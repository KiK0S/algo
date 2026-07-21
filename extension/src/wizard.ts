export interface WizardChoice {
  picked?: boolean;
}

export function defaultWizardSelection<T extends WizardChoice>(
  items: readonly T[],
  multiple: boolean
): T | T[] | undefined {
  if (multiple) {
    return items.filter((item) => item.picked);
  }
  return items.find((item) => item.picked) ?? items[0];
}

export class WizardReplay<T> {
  private index = 0;

  constructor(private readonly answers: readonly T[]) {}

  next(fallback: T): T {
    return this.answers[this.index++] ?? fallback;
  }
}

type DiffOperation = {
  kind: "equal" | "remove" | "add";
  line: string;
  oldLine: number;
  newLine: number;
};

function diffOperations(before: string, after: string): DiffOperation[] {
  const oldLines = before.replace(/\n$/, "").split("\n");
  const newLines = after.replace(/\n$/, "").split("\n");
  const lengths = Array.from({ length: oldLines.length + 1 }, () =>
    new Uint32Array(newLines.length + 1)
  );

  for (let oldIndex = oldLines.length - 1; oldIndex >= 0; oldIndex -= 1) {
    for (let newIndex = newLines.length - 1; newIndex >= 0; newIndex -= 1) {
      lengths[oldIndex][newIndex] =
        oldLines[oldIndex] === newLines[newIndex]
          ? lengths[oldIndex + 1][newIndex + 1] + 1
          : Math.max(
              lengths[oldIndex + 1][newIndex],
              lengths[oldIndex][newIndex + 1]
            );
    }
  }

  const operations: DiffOperation[] = [];
  let oldIndex = 0;
  let newIndex = 0;
  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    if (
      oldIndex < oldLines.length &&
      newIndex < newLines.length &&
      oldLines[oldIndex] === newLines[newIndex]
    ) {
      operations.push({
        kind: "equal",
        line: oldLines[oldIndex],
        oldLine: oldIndex + 1,
        newLine: newIndex + 1
      });
      oldIndex += 1;
      newIndex += 1;
    } else if (
      newIndex >= newLines.length ||
      (oldIndex < oldLines.length &&
        lengths[oldIndex + 1][newIndex] >= lengths[oldIndex][newIndex + 1])
    ) {
      operations.push({
        kind: "remove",
        line: oldLines[oldIndex],
        oldLine: oldIndex + 1,
        newLine: newIndex + 1
      });
      oldIndex += 1;
    } else {
      operations.push({
        kind: "add",
        line: newLines[newIndex],
        oldLine: oldIndex + 1,
        newLine: newIndex + 1
      });
      newIndex += 1;
    }
  }
  return operations;
}

export function createUnifiedDiff(
  before: string,
  after: string,
  contextLines = 3
): string {
  const operations = diffOperations(before, after);
  const changedIndexes = operations
    .map((operation, index) => (operation.kind === "equal" ? -1 : index))
    .filter((index) => index >= 0);
  if (changedIndexes.length === 0) {
    return "# No generated-code difference for this option.\n";
  }

  const ranges: Array<{ start: number; end: number }> = [];
  for (const index of changedIndexes) {
    const start = Math.max(0, index - contextLines);
    const end = Math.min(operations.length, index + contextLines + 1);
    const previous = ranges[ranges.length - 1];
    if (previous && start <= previous.end) {
      previous.end = Math.max(previous.end, end);
    } else {
      ranges.push({ start, end });
    }
  }

  const output = ["--- confirmed + defaults", "+++ highlighted option"];
  for (const range of ranges) {
    const hunk = operations.slice(range.start, range.end);
    const oldCount = hunk.filter((operation) => operation.kind !== "add").length;
    const newCount = hunk.filter((operation) => operation.kind !== "remove").length;
    const first = hunk[0];
    output.push(
      `@@ -${first.oldLine},${oldCount} +${first.newLine},${newCount} @@`
    );
    for (const operation of hunk) {
      const prefix =
        operation.kind === "add" ? "+" : operation.kind === "remove" ? "-" : " ";
      output.push(`${prefix}${operation.line}`);
    }
  }
  return `${output.join("\n")}\n`;
}

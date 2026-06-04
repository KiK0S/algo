import * as path from "path";
import * as vscode from "vscode";
import {
  analyzeCppDocument,
  applyIdentifierRenames,
  BerlekampMasseyFeature,
  BerlekampMasseyOptions,
  CatalogEntry,
  collectGlobalExportedIdentifiers,
  CompressUniqueOptions,
  CppAnalysis,
  defaultBerlekampMasseyFeatures,
  defaultInsertModeForKind,
  defaultKindForPath,
  findGlobalInsertionOffset,
  IdentifierRename,
  InsertMode,
  normalizeInsertionText,
  planBerlekampMasseyNames,
  planIdentifierRenames,
  planSegmentTreeNames,
  renderBerlekampMasseyRecipe,
  renderCompressUnique,
  renderHeaderContent,
  renderReadVector,
  renderRecipeSnippet,
  renderSegmentTreeRecipe,
  renderSparseTableRecipe,
  reserveIdentifier,
  resolveCatalogOrder,
  RenderedSnippet,
  ReadVectorOptions,
  SegmentAggregate,
  SegmentTreeOptions,
  SegmentUpdateOp,
  sizeExpressionCandidates,
  defaultSparseTableVariants,
  suggestIdentifier,
  vectorContainerTypeForValueType,
  SnippetKind,
  SparseTableOptions,
  SparseTableVariant,
  planSparseTableNames
} from "./core";

type SnippetPickItem = vscode.QuickPickItem & {
  snippetPath: string;
  uri?: vscode.Uri;
  entry?: CatalogEntry;
  snippetKind: SnippetKind;
  insertMode: InsertMode;
};

type ValuePickItem<T extends string = string> = vscode.QuickPickItem & {
  value: T;
  custom?: boolean;
};

interface GeneratorRegistration {
  catalogEntry: CatalogEntry;
  prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined>;
  defaultSnippet?(analysis: CppAnalysis, extraReserved: string[]): RenderedSnippet;
}

const DIRECT_COMMANDS = [
  { command: "edulcni.segtree", snippetPath: "/solvers/segtree" },
  { command: "edulcni.compressUnique", snippetPath: "/bricks/compress_unique" },
  { command: "edulcni.readVector", snippetPath: "/bricks/read_vector" },
  { command: "edulcni.berlekampMassey", snippetPath: "/solvers/berlekamp_massey" },
  { command: "edulcni.sparseTable", snippetPath: "/solvers/sparse_table" }
] as const;

function toPosix(value: string): string {
  return value.replace(/\\/g, "/");
}

function stripHeaderExtension(relativePath: string): string {
  return relativePath.endsWith(".hpp")
    ? relativePath.slice(0, -".hpp".length)
    : relativePath;
}

function buildDisplayPath(relativePath: string): string {
  return `/${stripHeaderExtension(relativePath)}`;
}

function isCatalogSnippetPath(displayPath: string): boolean {
  return displayPath.startsWith("/bricks/") || displayPath.startsWith("/solvers/");
}

async function resolveBundledLibraryRoot(
  context: vscode.ExtensionContext
): Promise<vscode.Uri | undefined> {
  const bundledRoot = vscode.Uri.joinPath(context.extensionUri, "library");
  try {
    const stat = await vscode.workspace.fs.stat(bundledRoot);
    if (stat.type & vscode.FileType.Directory) {
      return bundledRoot;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

async function collectHeaders(root: vscode.Uri): Promise<vscode.Uri[]> {
  const files: vscode.Uri[] = [];
  const stack: vscode.Uri[] = [root];

  while (stack.length > 0) {
    const current = stack.pop()!;
    let entries: [string, vscode.FileType][];
    try {
      entries = await vscode.workspace.fs.readDirectory(current);
    } catch {
      continue;
    }

    for (const [name, type] of entries) {
      const child = vscode.Uri.joinPath(current, name);
      if (type & vscode.FileType.Directory) {
        stack.push(child);
        continue;
      }
      if ((type & vscode.FileType.File) && name.endsWith(".hpp")) {
        files.push(child);
      }
    }
  }

  return files;
}

async function readUtf8(uri: vscode.Uri): Promise<string> {
  const bytes = await vscode.workspace.fs.readFile(uri);
  return Buffer.from(bytes).toString("utf8");
}

function normalizeCatalogEntries(value: unknown): CatalogEntry[] {
  if (Array.isArray(value)) {
    return value as CatalogEntry[];
  }
  if (
    value &&
    typeof value === "object" &&
    Array.isArray((value as { entries?: unknown }).entries)
  ) {
    return (value as { entries: CatalogEntry[] }).entries;
  }
  return [];
}

async function collectCatalogEntries(root: vscode.Uri): Promise<CatalogEntry[]> {
  const catalogRoot = vscode.Uri.joinPath(root, "catalog");
  let entries: [string, vscode.FileType][];
  try {
    entries = await vscode.workspace.fs.readDirectory(catalogRoot);
  } catch {
    return [];
  }

  const result: CatalogEntry[] = [];
  for (const [name, type] of entries) {
    if (!(type & vscode.FileType.File) || !name.endsWith(".json")) {
      continue;
    }
    const uri = vscode.Uri.joinPath(catalogRoot, name);
    try {
      const parsed = JSON.parse(await readUtf8(uri)) as unknown;
      for (const entry of normalizeCatalogEntries(parsed)) {
        if (entry.path?.startsWith("/")) {
          result.push(entry);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      vscode.window.showWarningMessage(
        `edulcni: failed to read catalog/${name}: ${message}`
      );
    }
  }
  return result;
}

function buildPickItems(
  root: vscode.Uri,
  uris: vscode.Uri[],
  catalogEntries: CatalogEntry[]
): SnippetPickItem[] {
  const entriesByPath = new Map(catalogEntries.map((entry) => [entry.path, entry]));
  const headerPaths = new Set<string>();

  const items: SnippetPickItem[] = [];
  for (const uri of uris) {
    const relativePath = toPosix(path.relative(root.fsPath, uri.fsPath));
    const directory = path.dirname(relativePath);
    const displayPath = buildDisplayPath(relativePath);
    if (!isCatalogSnippetPath(displayPath)) {
      continue;
    }
    headerPaths.add(displayPath);
    const entry = entriesByPath.get(displayPath);
    const snippetKind = entry?.kind ?? defaultKindForPath(displayPath);
    items.push({
      label: entry?.label ?? displayPath,
      description: entry?.description ?? relativePath,
      detail:
        entry?.detail ??
        (directory === "." ? "top-level" : `${snippetKind} / ${directory}`),
      snippetPath: displayPath,
      uri,
      entry,
      snippetKind,
      insertMode: entry?.insertMode ?? defaultInsertModeForKind(snippetKind)
    });
  }

  for (const entry of catalogEntries) {
    if (!isCatalogSnippetPath(entry.path)) {
      continue;
    }
    if (headerPaths.has(entry.path)) {
      continue;
    }
    items.push({
      label: entry.label ?? entry.path,
      description: entry.description ?? "",
      detail: entry.detail ?? entry.kind,
      snippetPath: entry.path,
      entry,
      snippetKind: entry.kind,
      insertMode: entry.insertMode ?? defaultInsertModeForKind(entry.kind)
    });
  }

  return items.sort((a, b) => a.label.localeCompare(b.label));
}

function snippetPathToUri(
  libraryRoot: vscode.Uri,
  snippetPath: string,
  entry?: CatalogEntry
): vscode.Uri {
  const source = entry?.source ?? `${snippetPath.slice(1)}.hpp`;
  return vscode.Uri.joinPath(libraryRoot, ...source.split("/"));
}

function directGeneratorEntry(snippetPath: string): CatalogEntry | undefined {
  return generatorRegistryByPath.get(snippetPath)?.catalogEntry;
}

async function renderSnippetPath(
  libraryRoot: vscode.Uri,
  snippetPath: string,
  catalogByPath: Map<string, CatalogEntry>,
  analysis: CppAnalysis
): Promise<RenderedSnippet> {
  const orderedPaths = resolveCatalogOrder(snippetPath, catalogByPath);
  const chunks: string[] = [];
  const exportedNames: string[] = [];

  for (const currentPath of orderedPaths) {
    const entry = catalogByPath.get(currentPath);
    if (entry?.generator) {
      const generator = generatorRegistry.get(entry.generator);
      if (!generator?.defaultSnippet) {
        if (currentPath === snippetPath) {
          continue;
        }
        throw new Error(
          `generator dependency has no default renderer: ${currentPath}`
        );
      }
      const generated = generator.defaultSnippet(analysis, exportedNames);
      chunks.push(generated.content.trim());
      exportedNames.push(...generated.exports);
      continue;
    }
    const uri = snippetPathToUri(libraryRoot, currentPath, entry);
    const kind = entry?.kind ?? defaultKindForPath(currentPath);
    const rendered = renderHeaderContent(await readUtf8(uri), kind);
    chunks.push(rendered.trim());
    if (entry?.exports) {
      exportedNames.push(...entry.exports);
    } else if (kind === "solver") {
      exportedNames.push(...collectGlobalExportedIdentifiers(rendered));
    }
  }

  const content = `${chunks.join("\n\n")}\n`;
  const renames = planIdentifierRenames(analysis, exportedNames);
  return {
    content: applyIdentifierRenames(content, renames),
    renames,
    exports: exportedNames
  };
}

function positionAtOffset(editor: vscode.TextEditor, offset: number): vscode.Position {
  return editor.document.positionAt(offset);
}

async function insertContent(
  editor: vscode.TextEditor,
  insertMode: InsertMode,
  content: string
): Promise<boolean> {
  const documentText = editor.document.getText();
  const offset =
    insertMode === "global"
      ? findGlobalInsertionOffset(documentText)
      : editor.document.offsetAt(editor.selection.active);
  const text =
    insertMode === "global"
      ? normalizeInsertionText(documentText, offset, content)
      : content;
  const position = positionAtOffset(editor, offset);
  return editor.edit((editBuilder) => {
    editBuilder.insert(position, text);
  });
}

function validateIdentifier(value: string): string | undefined {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value.trim())) {
    return "Use a valid C++ identifier.";
  }
  return undefined;
}

async function pickStringWithCustom(
  title: string,
  placeHolder: string,
  values: string[],
  customPrompt: string
): Promise<string | undefined> {
  const items: ValuePickItem[] = values.map((value) => ({ label: value, value }));
  items.push({ label: "Custom...", value: "", custom: true });
  const picked = await vscode.window.showQuickPick(items, {
    title,
    placeHolder,
    ignoreFocusOut: true
  });
  if (!picked) {
    return undefined;
  }
  if (!picked.custom) {
    return picked.value;
  }
  return vscode.window.showInputBox({
    title,
    prompt: customPrompt,
    ignoreFocusOut: true
  });
}

async function promptSegmentTreeOptions(
  editor: vscode.TextEditor
): Promise<SegmentTreeOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const initialNames = planSegmentTreeNames(analysis);
  const storageInput = await vscode.window.showInputBox({
    title: "edulcni: segment tree",
    prompt: "Storage variable name",
    value: initialNames.storageName,
    validateInput: validateIdentifier,
    ignoreFocusOut: true
  });
  if (storageInput === undefined) {
    return undefined;
  }

  const names = planSegmentTreeNames(analysis, storageInput);
  const sizeExpression = await pickStringWithCustom(
    "edulcni: segment tree",
    "Size expression",
    sizeExpressionCandidates(analysis),
    "Expression you expect to pass to init_segtree, for example n or MAXN"
  );
  if (sizeExpression === undefined || sizeExpression.trim() === "") {
    return undefined;
  }

  const valueType = await pickStringWithCustom(
    "edulcni: segment tree",
    "Value type",
    ["int", "ll", "long long"],
    "C++ value type"
  );
  if (valueType === undefined || valueType.trim() === "") {
    return undefined;
  }

  const aggregatePick = await vscode.window.showQuickPick<ValuePickItem<SegmentAggregate>>(
    [
      { label: "sum", value: "sum" },
      { label: "min", value: "min" },
      { label: "max", value: "max" },
      { label: "custom Node", value: "custom" }
    ],
    {
      title: "edulcni: segment tree",
      placeHolder: "Aggregate operation",
      ignoreFocusOut: true
    }
  );
  if (!aggregatePick) {
    return undefined;
  }

  const updateItems: ValuePickItem<SegmentUpdateOp>[] = [
    { label: "point set", value: "point_set", picked: true },
    { label: "point add", value: "point_add" },
    { label: "range add lazy", value: "range_add" },
    { label: "range assign lazy", value: "range_assign" }
  ];
  const updatePicks = await vscode.window.showQuickPick(updateItems, {
    title: "edulcni: segment tree",
    placeHolder: "Update operations to generate",
    canPickMany: true,
    ignoreFocusOut: true
  });
  if (!updatePicks) {
    return undefined;
  }

  const updates = updatePicks.map((item) => item.value);
  if (aggregatePick.value !== "custom") {
    return {
      sizeExpression: sizeExpression.trim(),
      valueType: valueType.trim(),
      aggregate: aggregatePick.value,
      updates,
      names
    };
  }

  const nodeType = await vscode.window.showInputBox({
    title: "edulcni: segment tree",
    prompt: "Custom node type name",
    value: "Node",
    validateInput: validateIdentifier,
    ignoreFocusOut: true
  });
  if (nodeType === undefined) {
    return undefined;
  }

  const leafTarget = await vscode.window.showInputBox({
    title: "edulcni: segment tree",
    prompt: "Leaf initialization target",
    value: "node.x",
    ignoreFocusOut: true
  });
  if (leafTarget === undefined) {
    return undefined;
  }

  const leafExpression = await vscode.window.showInputBox({
    title: "edulcni: segment tree",
    prompt: "Leaf initialization expression",
    value: "value",
    ignoreFocusOut: true
  });
  if (leafExpression === undefined) {
    return undefined;
  }

  const updateTarget =
    updates.length === 0
      ? leafTarget
      : await vscode.window.showInputBox({
          title: "edulcni: segment tree",
          prompt: "Field/expression changed by generated updates",
          value: leafTarget,
          ignoreFocusOut: true
        });
  if (updateTarget === undefined) {
    return undefined;
  }

  return {
    sizeExpression: sizeExpression.trim(),
    valueType: valueType.trim(),
    aggregate: "custom",
    updates,
    names,
    custom: {
      nodeType: nodeType.trim(),
      leafTarget: leafTarget.trim(),
      leafExpression: leafExpression.trim(),
      updateTarget: updateTarget.trim()
    }
  };
}

async function promptVectorName(
  title: string,
  placeHolder: string,
  values: { name: string; type?: string }[],
  customPrompt: string
): Promise<string | undefined> {
  const seen = new Set<string>();
  const items: ValuePickItem[] = [];
  for (const value of values) {
    if (seen.has(value.name)) {
      continue;
    }
    seen.add(value.name);
    items.push({
      label: value.name,
      description: value.type,
      value: value.name
    });
  }
  items.push({ label: "Custom...", value: "", custom: true });
  const picked = await vscode.window.showQuickPick(items, {
    title,
    placeHolder,
    ignoreFocusOut: true
  });
  if (!picked) {
    return undefined;
  }
  if (!picked.custom) {
    return picked.value;
  }
  return vscode.window.showInputBox({
    title,
    prompt: customPrompt,
    validateInput: validateIdentifier,
    ignoreFocusOut: true
  });
}

async function promptCompressUniqueOptions(
  editor: vscode.TextEditor
): Promise<CompressUniqueOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const sourceName = await promptVectorName(
    "edulcni: compress_unique",
    "Vector to compress",
    analysis.vectorSymbols,
    "Vector variable name"
  );
  if (sourceName === undefined || sourceName.trim() === "") {
    return undefined;
  }

  const used = new Set(analysis.identifiers);
  used.add(sourceName.trim());
  const valuesName = await vscode.window.showInputBox({
    title: "edulcni: compress_unique",
    prompt: "Unique values vector name",
    value: reserveIdentifier(used, "vals", "coords"),
    validateInput: validateIdentifier,
    ignoreFocusOut: true
  });
  if (valuesName === undefined || valuesName.trim() === "") {
    return undefined;
  }
  used.add(valuesName.trim());

  const idFunctionName = reserveIdentifier(used, "get_id", "compress_id");
  const rewritePick = await vscode.window.showQuickPick<
    ValuePickItem<"rewrite" | "keep">
  >(
    [
      { label: `rewrite ${sourceName.trim()} to ids`, value: "rewrite", picked: true },
      { label: "keep source unchanged", value: "keep" }
    ],
    {
      title: "edulcni: compress_unique",
      placeHolder: "Compression output",
      ignoreFocusOut: true
    }
  );
  if (!rewritePick) {
    return undefined;
  }

  return {
    sourceName: sourceName.trim(),
    valuesName: valuesName.trim(),
    idFunctionName,
    rewriteSource: rewritePick.value === "rewrite"
  };
}

async function promptReadVectorOptions(
  editor: vscode.TextEditor
): Promise<ReadVectorOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const nameInput = await vscode.window.showInputBox({
    title: "edulcni: read_vector",
    prompt: "Vector variable name",
    value: suggestIdentifier(analysis, "a", "values"),
    validateInput: validateIdentifier,
    ignoreFocusOut: true
  });
  if (nameInput === undefined || nameInput.trim() === "") {
    return undefined;
  }

  const sizeExpression = await pickStringWithCustom(
    "edulcni: read_vector",
    "Size expression",
    sizeExpressionCandidates(analysis),
    "Expression for the vector size, for example n"
  );
  if (sizeExpression === undefined || sizeExpression.trim() === "") {
    return undefined;
  }

  const valueType = await pickStringWithCustom(
    "edulcni: read_vector",
    "Value type",
    ["int", "ll", "long long"],
    "C++ value type"
  );
  if (valueType === undefined || valueType.trim() === "") {
    return undefined;
  }

  return {
    name: nameInput.trim(),
    sizeExpression: sizeExpression.trim(),
    valueType: valueType.trim(),
    containerType: vectorContainerTypeForValueType(analysis, valueType.trim())
  };
}

function vectorValueType(type: string | undefined): string | undefined {
  if (!type) {
    return undefined;
  }
  const compact = type.trim();
  if (compact === "vi") {
    return "int";
  }
  if (compact === "vll") {
    return "ll";
  }
  const match = compact.match(/^(?:std::)?vector\s*<(.+)>$/);
  return match?.[1].trim();
}

function uniqueValues(values: string[]): string[] {
  const result: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (trimmed !== "" && !result.includes(trimmed)) {
      result.push(trimmed);
    }
  }
  return result;
}

async function promptSparseTableOptions(
  editor: vscode.TextEditor
): Promise<SparseTableOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const sourceName = await promptVectorName(
    "edulcni: sparse_table",
    "Source vector",
    analysis.vectorSymbols,
    "Source vector variable name"
  );
  if (sourceName === undefined || sourceName.trim() === "") {
    return undefined;
  }

  const sourceSymbol = analysis.vectorSymbols.find(
    (symbol) => symbol.name === sourceName.trim()
  );
  const valueType = await pickStringWithCustom(
    "edulcni: sparse_table",
    "Value type",
    uniqueValues([
      vectorValueType(sourceSymbol?.type) ?? "",
      "int",
      "ll",
      "long long"
    ]),
    "C++ value type"
  );
  if (valueType === undefined || valueType.trim() === "") {
    return undefined;
  }

  const variantPicks = await vscode.window.showQuickPick<
    ValuePickItem<SparseTableVariant>
  >(
    [
      { label: "range minimum", value: "min", picked: true },
      { label: "range maximum", value: "max", picked: true }
    ],
    {
      title: "edulcni: sparse_table",
      placeHolder: "Variants to generate",
      canPickMany: true,
      ignoreFocusOut: true
    }
  );
  if (!variantPicks) {
    return undefined;
  }

  return {
    valueType: valueType.trim(),
    sourceName: sourceName.trim(),
    variants:
      variantPicks.length === 0
        ? defaultSparseTableVariants()
        : variantPicks.map((item) => item.value),
    names: planSparseTableNames(analysis),
    includeUsageComment: true
  };
}

async function promptBerlekampMasseyOptions(
  editor: vscode.TextEditor
): Promise<BerlekampMasseyOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const sequenceName = await promptVectorName(
    "edulcni: berlekamp_massey",
    "Sequence vector",
    analysis.vectorSymbols,
    "Sequence vector variable name"
  );
  if (sequenceName === undefined || sequenceName.trim() === "") {
    return undefined;
  }

  const sequenceSymbol = analysis.vectorSymbols.find(
    (symbol) => symbol.name === sequenceName.trim()
  );
  const valueTypes = uniqueValues([
    vectorValueType(sequenceSymbol?.type) ?? "",
    "Mint",
    "int",
    "ll",
    "long long"
  ]);
  const valueType = await pickStringWithCustom(
    "edulcni: berlekamp_massey",
    "Field/modint type for the usage comment",
    valueTypes,
    "C++ field-like type with division, for example Mint"
  );
  if (valueType === undefined || valueType.trim() === "") {
    return undefined;
  }

  const indexName = await pickStringWithCustom(
    "edulcni: berlekamp_massey",
    "Index expression for the usage comment",
    uniqueValues([...sizeExpressionCandidates(analysis), "k"]),
    "Index expression, for example k"
  );
  if (indexName === undefined || indexName.trim() === "") {
    return undefined;
  }

  const featurePicks = await vscode.window.showQuickPick<
    ValuePickItem<BerlekampMasseyFeature>
  >(
    [
      {
        label: "minimal recurrence",
        value: "minimal_recurrence",
        picked: true
      },
      {
        label: "kth from recurrence",
        value: "kth_term",
        picked: true
      },
      {
        label: "one-shot kth",
        value: "one_shot_kth",
        picked: true
      }
    ],
    {
      title: "edulcni: berlekamp_massey",
      placeHolder: "Helpers to generate",
      canPickMany: true,
      ignoreFocusOut: true
    }
  );
  if (!featurePicks) {
    return undefined;
  }

  return {
    valueType: valueType.trim(),
    sequenceName: sequenceName.trim(),
    indexName: indexName.trim(),
    features:
      featurePicks.length === 0
        ? ["minimal_recurrence"]
        : featurePicks.map((item) => item.value),
    names: planBerlekampMasseyNames(analysis),
    includeUsageComment: true
  };
}

const generatorRegistry = new Map<string, GeneratorRegistration>([
  [
    "segtree",
    {
      catalogEntry: {
        path: "/solvers/segtree",
        kind: "solver",
        insertMode: "global",
        generator: "segtree",
        label: "/solvers/segtree",
        description: "interactive inline segment tree generator",
        detail: "interactive / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptSegmentTreeOptions(editor);
        return options ? renderRecipeSnippet(renderSegmentTreeRecipe(options)) : undefined;
      }
    }
  ],
  [
    "compress_unique",
    {
      catalogEntry: {
        path: "/bricks/compress_unique",
        kind: "brick",
        insertMode: "cursor",
        generator: "compress_unique",
        label: "/bricks/compress_unique",
        description: "interactive coordinate compression snippet",
        detail: "interactive / brick"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptCompressUniqueOptions(editor);
        return options
          ? { content: renderCompressUnique(options), renames: [], exports: [] }
          : undefined;
      }
    }
  ],
  [
    "read_vector",
    {
      catalogEntry: {
        path: "/bricks/read_vector",
        kind: "brick",
        insertMode: "cursor",
        generator: "read_vector",
        label: "/bricks/read_vector",
        description: "interactive vector declaration and input snippet",
        detail: "interactive / brick"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptReadVectorOptions(editor);
        return options
          ? { content: renderReadVector(options), renames: [], exports: [] }
          : undefined;
      }
    }
  ],
  [
    "sparse_table",
    {
      catalogEntry: {
        path: "/solvers/sparse_table",
        kind: "solver",
        insertMode: "global",
        generator: "sparse_table",
        label: "/solvers/sparse_table",
        description: "interactive sparse table generator",
        detail: "interactive / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptSparseTableOptions(editor);
        return options ? renderRecipeSnippet(renderSparseTableRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        const options: SparseTableOptions = {
          valueType: "int",
          sourceName: "a",
          variants: defaultSparseTableVariants(),
          names: planSparseTableNames(analysis, extraReserved),
          includeUsageComment: true
        };
        return renderRecipeSnippet(renderSparseTableRecipe(options));
      }
    }
  ],
  [
    "berlekamp_massey",
    {
      catalogEntry: {
        path: "/solvers/berlekamp_massey",
        kind: "solver",
        insertMode: "global",
        generator: "berlekamp_massey",
        label: "/solvers/berlekamp_massey",
        description: "interactive linear recurrence helper generator",
        detail: "interactive / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptBerlekampMasseyOptions(editor);
        return options
          ? renderRecipeSnippet(renderBerlekampMasseyRecipe(options))
          : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        const options: BerlekampMasseyOptions = {
          valueType: "Mint",
          sequenceName: "sequence",
          indexName: "k",
          features: defaultBerlekampMasseyFeatures(),
          names: planBerlekampMasseyNames(analysis, extraReserved),
          includeUsageComment: true
        };
        return renderRecipeSnippet(renderBerlekampMasseyRecipe(options));
      }
    }
  ]
]);

const generatorRegistryByPath = new Map(
  [...generatorRegistry.values()].map((generator) => [
    generator.catalogEntry.path,
    generator
  ])
);

function showRenameSummary(renames: IdentifierRename[]): void {
  if (renames.length === 0) {
    return;
  }
  const summary = renames.map((rename) => `${rename.from}->${rename.to}`).join(", ");
  vscode.window.showInformationMessage(`edulcni: renamed exported symbols: ${summary}`);
}

async function insertSnippet(
  context: vscode.ExtensionContext,
  requestedPath?: string
): Promise<void> {
  const libraryRoot = await resolveBundledLibraryRoot(context);
  if (!libraryRoot) {
    vscode.window.showErrorMessage(
      "edulcni: bundled library not found. Run `npm run build` in `extension/`."
    );
    return;
  }

  const [headers, catalogEntries] = await Promise.all([
    collectHeaders(libraryRoot),
    collectCatalogEntries(libraryRoot)
  ]);
  if (headers.length === 0 && catalogEntries.length === 0) {
    vscode.window.showWarningMessage(
      "edulcni: no bundled snippets found in extension/library."
    );
    return;
  }

  const items = buildPickItems(libraryRoot, headers, catalogEntries);
  let picked: SnippetPickItem | undefined;
  const directEntry = requestedPath ? directGeneratorEntry(requestedPath) : undefined;
  if (requestedPath) {
    picked = items.find((item) => item.snippetPath === requestedPath);
    if (picked && directEntry) {
      picked = {
        ...picked,
        entry: { ...(picked.entry ?? {}), ...directEntry },
        snippetKind: directEntry.kind,
        insertMode: directEntry.insertMode ?? defaultInsertModeForKind(directEntry.kind)
      };
    } else if (!picked && directEntry) {
      picked = {
        label: directEntry.label ?? directEntry.path,
        description: directEntry.description ?? "",
        detail: directEntry.detail ?? directEntry.kind,
        snippetPath: directEntry.path,
        entry: directEntry,
        snippetKind: directEntry.kind,
        insertMode: directEntry.insertMode ?? defaultInsertModeForKind(directEntry.kind)
      };
    }
  } else {
    picked = await vscode.window.showQuickPick(items, {
      title: "edulcni:browse",
      placeHolder: "Type a slash path, for example /solvers/segtree",
      matchOnDescription: true,
      matchOnDetail: true,
      ignoreFocusOut: true
    });
  }

  if (!picked) {
    if (requestedPath) {
      vscode.window.showErrorMessage(`edulcni: unknown snippet ${requestedPath}.`);
    }
    return;
  }

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("edulcni: open a file and place the cursor first.");
    return;
  }

  const catalogByPath = new Map(catalogEntries.map((entry) => [entry.path, entry]));
  let renderedSnippet: RenderedSnippet;
  const generator = picked.entry?.generator
    ? generatorRegistry.get(picked.entry.generator)
    : undefined;
  if (generator) {
    const generated = await generator.prompt(editor);
    if (!generated) {
      return;
    }
    renderedSnippet = generated;
  } else {
    renderedSnippet = await renderSnippetPath(
      libraryRoot,
      picked.snippetPath,
      catalogByPath,
      analyzeCppDocument(editor.document.getText())
    );
  }

  const ok = await insertContent(editor, picked.insertMode, renderedSnippet.content);
  if (!ok) {
    vscode.window.showErrorMessage("edulcni: failed to insert snippet content.");
    return;
  }
  showRenameSummary(renderedSnippet.renames);
}

export function activate(context: vscode.ExtensionContext): void {
  const browseDisposable = vscode.commands.registerCommand(
    "edulcni.insertHeader",
    async () => {
      try {
        await insertSnippet(context);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "unknown extension error";
        vscode.window.showErrorMessage(`edulcni: ${message}`);
      }
    }
  );

  context.subscriptions.push(browseDisposable);
  for (const command of DIRECT_COMMANDS) {
    context.subscriptions.push(
      vscode.commands.registerCommand(command.command, async () => {
        try {
          await insertSnippet(context, command.snippetPath);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "unknown extension error";
          vscode.window.showErrorMessage(`edulcni: ${message}`);
        }
      })
    );
  }
}

export function deactivate(): void {}

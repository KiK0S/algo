export type SnippetKind = "brick" | "solver";
export type InsertMode = "cursor" | "global";
export type SolutionSection =
  | "includes"
  | "defines"
  | "constants"
  | "data"
  | "helpers"
  | "solve"
  | "main";

export const SOLUTION_SECTION_ORDER: SolutionSection[] = [
  "includes",
  "defines",
  "constants",
  "data",
  "helpers",
  "solve",
  "main"
];

export interface CatalogEntry {
  path: string;
  kind: SnippetKind;
  insertMode?: InsertMode;
  generator?: string;
  source?: string;
  label?: string;
  description?: string;
  detail?: string;
  exports?: string[];
  dependsOn?: string[];
  features?: string[];
  sections?: SolutionSection[];
  variants?: unknown[];
  pipeline?: Record<string, unknown>;
  form?: unknown[];
  render?: Record<string, unknown>;
}

export interface DynamicDependency {
  path: string;
  feature?: string;
  options?: Record<string, unknown>;
}

export interface RenderedRecipe {
  sections: Partial<Record<SolutionSection, string[]>>;
  exports: string[];
  dependencies: DynamicDependency[];
}

export interface AnnotatedSymbol {
  name: string;
  kind: "const" | "input";
}

export interface VectorSymbol {
  name: string;
  type: string;
}

export interface CppSectionSpan {
  section: SolutionSection;
  start: number;
  end: number;
}

export interface CppAnalysis {
  identifiers: Set<string>;
  annotatedSymbols: AnnotatedSymbol[];
  constantSymbols: AnnotatedSymbol[];
  inputSymbols: AnnotatedSymbol[];
  vectorSymbols: VectorSymbol[];
  vectorAliases: Set<string>;
  sections: CppSectionSpan[];
}

export type SegmentAggregate = "sum" | "min" | "max" | "custom";
export type SegmentUpdateOp =
  | "point_set"
  | "point_add"
  | "range_add"
  | "range_assign";

export interface SegmentTreeNames {
  storageName: string;
  lazyAddName: string;
  lazySetName: string;
  lazyHasSetName: string;
  initName: string;
  buildName: string;
  queryName: string;
  mergeName: string;
  neutralName: string;
  makeNodeName: string;
  pushName: string;
  applyAddName: string;
  applySetName: string;
  pointSetName: string;
  pointAddName: string;
  rangeAddName: string;
  rangeAssignName: string;
}

export interface SegmentTreeCustomOptions {
  nodeType: string;
  leafTarget: string;
  leafExpression: string;
  updateTarget: string;
}

export interface SegmentTreeOptions {
  sizeExpression: string;
  valueType: string;
  aggregate: SegmentAggregate;
  updates: SegmentUpdateOp[];
  names: SegmentTreeNames;
  custom?: SegmentTreeCustomOptions;
}

export interface CompressUniqueOptions {
  sourceName: string;
  valuesName: string;
  idFunctionName: string;
  rewriteSource: boolean;
}

export interface ReadVectorOptions {
  name: string;
  sizeExpression: string;
  valueType: string;
  containerType: string;
}

export type SparseTableVariant = "min" | "max";

export interface SparseTableNames {
  logName: string;
  ensureLogName: string;
  minTableName: string;
  buildMinName: string;
  queryMinName: string;
  maxTableName: string;
  buildMaxName: string;
  queryMaxName: string;
}

export interface SparseTableOptions {
  valueType: string;
  sourceName: string;
  variants: SparseTableVariant[];
  names: SparseTableNames;
  includeUsageComment: boolean;
}

export type BerlekampMasseyFeature =
  | "minimal_recurrence"
  | "kth_term"
  | "one_shot_kth";

export interface BerlekampMasseyNames {
  berlekampMasseyName: string;
  linearRecurrenceKthName: string;
  berlekampMasseyKthName: string;
}

export interface BerlekampMasseyOptions {
  valueType: string;
  sequenceName: string;
  indexName: string;
  features: BerlekampMasseyFeature[];
  names: BerlekampMasseyNames;
  includeUsageComment: boolean;
}

export interface IdentifierRename {
  from: string;
  to: string;
}

export interface RenderedSnippet {
  content: string;
  renames: IdentifierRename[];
  exports: string[];
}

const CPP_KEYWORDS = new Set([
  "alignas",
  "alignof",
  "and",
  "and_eq",
  "asm",
  "auto",
  "bitand",
  "bitor",
  "bool",
  "break",
  "case",
  "catch",
  "char",
  "char16_t",
  "char32_t",
  "class",
  "compl",
  "const",
  "constexpr",
  "const_cast",
  "continue",
  "decltype",
  "default",
  "delete",
  "do",
  "double",
  "dynamic_cast",
  "else",
  "enum",
  "explicit",
  "export",
  "extern",
  "false",
  "float",
  "for",
  "friend",
  "goto",
  "if",
  "inline",
  "int",
  "long",
  "mutable",
  "namespace",
  "new",
  "noexcept",
  "not",
  "not_eq",
  "nullptr",
  "operator",
  "or",
  "or_eq",
  "private",
  "protected",
  "public",
  "register",
  "reinterpret_cast",
  "return",
  "short",
  "signed",
  "sizeof",
  "static",
  "static_assert",
  "static_cast",
  "struct",
  "switch",
  "template",
  "this",
  "thread_local",
  "throw",
  "true",
  "try",
  "typedef",
  "typeid",
  "typename",
  "union",
  "unsigned",
  "using",
  "virtual",
  "void",
  "volatile",
  "wchar_t",
  "while",
  "xor",
  "xor_eq"
]);

function isIdentifier(value: string): boolean {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(value);
}

function lastIdentifier(value: string): string | undefined {
  const matches = value.match(/[A-Za-z_][A-Za-z0-9_]*/g);
  if (!matches) {
    return undefined;
  }
  for (let i = matches.length - 1; i >= 0; --i) {
    const candidate = matches[i];
    if (!CPP_KEYWORDS.has(candidate)) {
      return candidate;
    }
  }
  return undefined;
}

export function stripCppCommentsAndStrings(text: string): string {
  let result = "";
  let state: "normal" | "line" | "block" | "string" | "char" = "normal";

  for (let i = 0; i < text.length; ++i) {
    const ch = text[i];
    const next = text[i + 1] ?? "";

    if (state === "line") {
      if (ch === "\n") {
        state = "normal";
        result += "\n";
      } else {
        result += " ";
      }
      continue;
    }

    if (state === "block") {
      if (ch === "*" && next === "/") {
        result += "  ";
        ++i;
        state = "normal";
      } else {
        result += ch === "\n" ? "\n" : " ";
      }
      continue;
    }

    if (state === "string" || state === "char") {
      const end = state === "string" ? "\"" : "'";
      if (ch === "\\" && i + 1 < text.length) {
        result += " ";
        result += text[i + 1] === "\n" ? "\n" : " ";
        ++i;
      } else if (ch === end) {
        result += " ";
        state = "normal";
      } else {
        result += ch === "\n" ? "\n" : " ";
      }
      continue;
    }

    if (ch === "/" && next === "/") {
      result += "  ";
      ++i;
      state = "line";
      continue;
    }
    if (ch === "/" && next === "*") {
      result += "  ";
      ++i;
      state = "block";
      continue;
    }
    if (ch === "\"") {
      result += " ";
      state = "string";
      continue;
    }
    if (ch === "'") {
      result += " ";
      state = "char";
      continue;
    }
    result += ch;
  }

  return result;
}

function collectAnnotatedSymbols(text: string): AnnotatedSymbol[] {
  const result: AnnotatedSymbol[] = [];
  const seen = new Set<string>();
  for (const line of text.split(/\r?\n/)) {
    const commentStart = line.indexOf("//");
    if (commentStart === -1) {
      continue;
    }
    const comment = line.slice(commentStart);
    const kindMatch = comment.match(/\bedulcni:(const|input)\b/);
    if (!kindMatch) {
      continue;
    }

    const prefix = line.slice(0, commentStart);
    const source = prefix.includes(">>")
      ? prefix.slice(prefix.lastIndexOf(">>") + 2)
      : prefix.split("=")[0];
    const name = lastIdentifier(source);
    if (!name || seen.has(name)) {
      continue;
    }
    seen.add(name);
    result.push({ name, kind: kindMatch[1] as "const" | "input" });
  }
  return result;
}

function pushSymbol(
  result: AnnotatedSymbol[],
  seen: Set<string>,
  name: string | undefined,
  kind: "const" | "input"
): void {
  if (!name || seen.has(name) || CPP_KEYWORDS.has(name)) {
    return;
  }
  seen.add(name);
  result.push({ name, kind });
}

function splitTopLevelCommas(value: string): string[] {
  const parts: string[] = [];
  let current = "";
  let angleDepth = 0;
  let parenDepth = 0;
  let braceDepth = 0;
  let bracketDepth = 0;

  for (let i = 0; i < value.length; ++i) {
    const ch = value[i];
    if (ch === "<") {
      ++angleDepth;
    } else if (ch === ">" && angleDepth > 0) {
      --angleDepth;
    } else if (ch === "(") {
      ++parenDepth;
    } else if (ch === ")" && parenDepth > 0) {
      --parenDepth;
    } else if (ch === "{") {
      ++braceDepth;
    } else if (ch === "}" && braceDepth > 0) {
      --braceDepth;
    } else if (ch === "[") {
      ++bracketDepth;
    } else if (ch === "]" && bracketDepth > 0) {
      --bracketDepth;
    }

    if (
      ch === "," &&
      angleDepth === 0 &&
      parenDepth === 0 &&
      braceDepth === 0 &&
      bracketDepth === 0
    ) {
      parts.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }

  if (current.trim() !== "") {
    parts.push(current.trim());
  }
  return parts;
}

function declaredNameFromDeclarator(
  declarator: string,
  allowConstructorInitializer: boolean
): string | undefined {
  let prefix = declarator.split("=")[0].trim();
  const firstInitializer = prefix.search(/[({[]/);
  if (firstInitializer !== -1) {
    if (!allowConstructorInitializer && prefix[firstInitializer] === "(") {
      return undefined;
    }
    prefix = prefix.slice(0, firstInitializer).trim();
  }
  return lastIdentifier(prefix);
}

function collectVectorAliases(text: string): Set<string> {
  const aliases = new Set<string>();
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    const macroMatch = trimmed.match(
      /^#\s*define\s+([A-Za-z_][A-Za-z0-9_]*)\s+(?:std::)?vector\s*</
    );
    if (macroMatch) {
      aliases.add(macroMatch[1]);
      continue;
    }

    const usingMatch = trimmed.match(
      /^using\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:std::)?vector\s*</
    );
    if (usingMatch) {
      aliases.add(usingMatch[1]);
      continue;
    }

    const typedefMatch = trimmed.match(
      /^typedef\s+(?:std::)?vector\s*<.+>\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/
    );
    if (typedefMatch) {
      aliases.add(typedefMatch[1]);
    }
  }
  return aliases;
}

function collectDeclaredSymbols(
  text: string,
  vectorAliases: Set<string>
): {
  constants: AnnotatedSymbol[];
  inputs: AnnotatedSymbol[];
  vectors: VectorSymbol[];
} {
  const constants: AnnotatedSymbol[] = [];
  const inputs: AnnotatedSymbol[] = [];
  const vectors: VectorSymbol[] = [];
  const seenConstants = new Set<string>();
  const seenInputs = new Set<string>();
  const seenVectors = new Set<string>();

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) {
      continue;
    }

    const vectorMatch = trimmed.match(
      /^(?:(?:const)\s+)?((?:std::)?vector\s*<.+>|[A-Za-z_][A-Za-z0-9_]*)\s+(.+);$/
    );
    if (vectorMatch) {
      const type = vectorMatch[1].trim();
      const isVectorType =
        /^(?:std::)?vector\s*</.test(type) || vectorAliases.has(type);
      if (isVectorType) {
        for (const declarator of splitTopLevelCommas(vectorMatch[2])) {
          const name = declaredNameFromDeclarator(declarator, true);
          if (!name || seenVectors.has(name) || CPP_KEYWORDS.has(name)) {
            continue;
          }
          seenVectors.add(name);
          vectors.push({ name, type });
        }
        continue;
      }
    }

    const scalarMatch = trimmed.match(
      /^(?:(?:static|extern|register)\s+)*(?:(const|constexpr)\s+)?(?:int|ll|long\s+long|short|char|bool|size_t)\s+(.+);$/
    );
    if (!scalarMatch) {
      continue;
    }

    const kind = scalarMatch[1] ? "const" : "input";
    for (const declarator of splitTopLevelCommas(scalarMatch[2])) {
      const name = declaredNameFromDeclarator(declarator, false);
      if (kind === "const") {
        pushSymbol(constants, seenConstants, name, "const");
      } else {
        pushSymbol(inputs, seenInputs, name, "input");
      }
    }
  }

  return { constants, inputs, vectors };
}

function topLevelLineSection(line: string): SolutionSection | undefined {
  const trimmed = line.trim();
  if (trimmed === "") {
    return undefined;
  }
  if (/^#\s*include\b/.test(trimmed)) {
    return "includes";
  }
  if (/^#\s*\w+\b/.test(trimmed)) {
    return "defines";
  }
  if (/^(?:using|typedef)\b/.test(trimmed)) {
    return "defines";
  }
  if (/^(?:static\s+)?(?:const|constexpr)\b/.test(trimmed)) {
    return "constants";
  }
  if (/^(?:void|int|auto|ll|long\s+long)\s+solve\s*\(/.test(trimmed)) {
    return "solve";
  }
  if (/^int\s+main\s*\(/.test(trimmed)) {
    return "main";
  }
  if (/^(?:template|class|struct)\b/.test(trimmed)) {
    return "helpers";
  }
  if (/;\s*$/.test(trimmed)) {
    const firstParen = trimmed.indexOf("(");
    const firstEquals = trimmed.indexOf("=");
    if (firstParen === -1 || (firstEquals !== -1 && firstEquals < firstParen)) {
      return "data";
    }
  }
  if (topLevelDeclarationName(trimmed)) {
    return "helpers";
  }
  if (/;\s*$/.test(trimmed)) {
    return "data";
  }
  return "helpers";
}

function countBraceDelta(line: string): number {
  let delta = 0;
  for (const ch of line) {
    if (ch === "{") {
      ++delta;
    } else if (ch === "}") {
      --delta;
    }
  }
  return delta;
}

function pushSectionSpan(
  spans: CppSectionSpan[],
  section: SolutionSection,
  start: number,
  end: number
): void {
  if (start >= end) {
    return;
  }
  const previous = spans[spans.length - 1];
  if (previous?.section === section && previous.end === start) {
    previous.end = end;
    return;
  }
  spans.push({ section, start, end });
}

export function detectCppSections(text: string): CppSectionSpan[] {
  const stripped = stripCppCommentsAndStrings(text);
  const spans: CppSectionSpan[] = [];
  let offset = 0;
  let braceDepth = 0;
  let activeBlockSection: SolutionSection | undefined;

  for (const match of stripped.matchAll(/[^\n]*(?:\n|$)/g)) {
    const line = match[0];
    if (line === "" && offset >= stripped.length) {
      break;
    }
    const start = offset;
    const end = start + line.length;
    const lineWithoutNewline = line.replace(/\r?\n$/, "");
    const section =
      activeBlockSection ??
      (braceDepth === 0 ? topLevelLineSection(lineWithoutNewline) : undefined);

    if (section) {
      pushSectionSpan(spans, section, start, end);
    }

    const nextBraceDepth = Math.max(0, braceDepth + countBraceDelta(lineWithoutNewline));
    if (
      activeBlockSection === undefined &&
      section &&
      (section === "helpers" || section === "solve" || section === "main") &&
      braceDepth === 0 &&
      nextBraceDepth > 0
    ) {
      activeBlockSection = section;
    }
    if (activeBlockSection !== undefined && nextBraceDepth === 0) {
      activeBlockSection = undefined;
    }

    braceDepth = nextBraceDepth;
    offset = end;
  }

  return spans;
}

export function analyzeCppDocument(text: string): CppAnalysis {
  const stripped = stripCppCommentsAndStrings(text);
  const identifiers = new Set<string>();
  for (const match of stripped.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)) {
    if (!CPP_KEYWORDS.has(match[0])) {
      identifiers.add(match[0]);
    }
  }
  const vectorAliases = collectVectorAliases(stripped);
  const declaredSymbols = collectDeclaredSymbols(stripped, vectorAliases);

  return {
    identifiers,
    annotatedSymbols: collectAnnotatedSymbols(text),
    constantSymbols: declaredSymbols.constants,
    inputSymbols: declaredSymbols.inputs,
    vectorSymbols: declaredSymbols.vectors,
    vectorAliases,
    sections: detectCppSections(text)
  };
}

export function sizeExpressionCandidates(analysis: CppAnalysis): string[] {
  const result: string[] = [];
  const add = (name: string) => {
    if (!result.includes(name)) {
      result.push(name);
    }
  };

  for (const symbol of analysis.annotatedSymbols) {
    if (symbol.kind === "input") {
      add(symbol.name);
    }
  }
  for (const symbol of analysis.inputSymbols) {
    add(symbol.name);
  }
  for (const symbol of analysis.annotatedSymbols) {
    if (symbol.kind === "const") {
      add(symbol.name);
    }
  }
  for (const symbol of analysis.constantSymbols) {
    add(symbol.name);
  }
  return result;
}

export function sanitizeIdentifier(value: string, fallback: string): string {
  const trimmed = value.trim();
  return isIdentifier(trimmed) && !CPP_KEYWORDS.has(trimmed) ? trimmed : fallback;
}

export function reserveIdentifier(
  used: Set<string>,
  preferred: string,
  fallback?: string
): string {
  const cleanPreferred = sanitizeIdentifier(preferred, fallback ?? "edulcni_name");
  const cleanFallback = sanitizeIdentifier(fallback ?? cleanPreferred, cleanPreferred);

  if (!used.has(cleanPreferred)) {
    used.add(cleanPreferred);
    return cleanPreferred;
  }
  if (!used.has(cleanFallback)) {
    used.add(cleanFallback);
    return cleanFallback;
  }

  const base = cleanFallback;
  for (let suffix = 2; suffix < 10000; ++suffix) {
    const candidate = `${base}${suffix}`;
    if (!used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
  }

  const underscore = `${cleanPreferred}_`;
  if (!used.has(underscore)) {
    used.add(underscore);
    return underscore;
  }

  throw new Error(`unable to reserve identifier for ${preferred}`);
}

export interface NamePlannerRequest {
  preferred: string;
  fallback?: string;
  exportName?: boolean;
}

export interface NamePlanner {
  reserve(preferred: string, fallback?: string): string;
  reserveExport(preferred: string, fallback?: string): string;
  reserveMany<T extends Record<string, string | NamePlannerRequest>>(
    requests: T
  ): { [K in keyof T]: string };
  useExisting(name: string): string;
  isUsed(name: string): boolean;
  exportedNames(): string[];
  usedNames(): Set<string>;
}

function normalizeNameRequest(request: string | NamePlannerRequest): NamePlannerRequest {
  return typeof request === "string" ? { preferred: request } : request;
}

export function createNamePlanner(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): NamePlanner {
  const used = new Set(analysis.identifiers);
  const exports: string[] = [];
  for (const name of extraReserved) {
    if (isIdentifier(name) && !CPP_KEYWORDS.has(name)) {
      used.add(name);
    }
  }

  const addExport = (name: string) => {
    if (!exports.includes(name)) {
      exports.push(name);
    }
  };

  const reserveOne = (
    preferred: string,
    fallback?: string,
    exportName = false
  ): string => {
    const name = reserveIdentifier(used, preferred, fallback);
    if (exportName) {
      addExport(name);
    }
    return name;
  };

  return {
    reserve(preferred: string, fallback?: string): string {
      return reserveOne(preferred, fallback);
    },
    reserveExport(preferred: string, fallback?: string): string {
      return reserveOne(preferred, fallback, true);
    },
    reserveMany<T extends Record<string, string | NamePlannerRequest>>(
      requests: T
    ): { [K in keyof T]: string } {
      const result = {} as { [K in keyof T]: string };
      for (const key of Object.keys(requests) as Array<keyof T>) {
        const request = normalizeNameRequest(requests[key]);
        result[key] = reserveOne(
          request.preferred,
          request.fallback,
          request.exportName ?? false
        );
      }
      return result;
    },
    useExisting(name: string): string {
      const trimmed = name.trim();
      if (!isIdentifier(trimmed) || CPP_KEYWORDS.has(trimmed)) {
        throw new Error(`invalid C++ identifier: ${name}`);
      }
      used.add(trimmed);
      return trimmed;
    },
    isUsed(name: string): boolean {
      return used.has(name);
    },
    exportedNames(): string[] {
      return [...exports];
    },
    usedNames(): Set<string> {
      return new Set(used);
    }
  };
}

export function suggestIdentifier(
  analysis: CppAnalysis,
  preferred: string,
  fallback?: string
): string {
  return reserveIdentifier(new Set(analysis.identifiers), preferred, fallback);
}

export function vectorContainerTypeForValueType(
  analysis: CppAnalysis,
  valueType: string
): string {
  const normalized = valueType.trim().replace(/\s+/g, " ");
  if (normalized === "int" && analysis.vectorAliases.has("vi")) {
    return "vi";
  }
  if (
    (normalized === "ll" || normalized === "long long") &&
    analysis.vectorAliases.has("vll")
  ) {
    return "vll";
  }
  return `vector<${valueType.trim()}>`;
}

export function planSegmentTreeNames(
  analysis: CppAnalysis,
  requestedStorageName = "t"
): SegmentTreeNames {
  const planner = createNamePlanner(analysis);
  const storageName = planner.reserve(requestedStorageName, "segtree");
  return {
    storageName,
    lazyAddName: planner.reserve("lazy_add", "seg_lazy_add"),
    lazySetName: planner.reserve("lazy_set", "seg_lazy_set"),
    lazyHasSetName: planner.reserve("lazy_has_set", "seg_lazy_has_set"),
    initName: planner.reserve("init_segtree", "seg_init"),
    buildName: planner.reserve("build", "build_segtree"),
    queryName: planner.reserve("get", "seg_get"),
    mergeName: planner.reserve("merge", "merge_nodes"),
    neutralName: planner.reserve("neutral", "seg_neutral"),
    makeNodeName: planner.reserve("make_node", "seg_make_node"),
    pushName: planner.reserve("push", "seg_push"),
    applyAddName: planner.reserve("apply_add", "seg_apply_add"),
    applySetName: planner.reserve("apply_set", "seg_apply_set"),
    pointSetName: planner.reserve("point_set", "seg_point_set"),
    pointAddName: planner.reserve("point_add", "seg_point_add"),
    rangeAddName: planner.reserve("range_add", "seg_range_add"),
    rangeAssignName: planner.reserve("range_assign", "seg_range_assign")
  };
}

function hasUpdate(options: SegmentTreeOptions, op: SegmentUpdateOp): boolean {
  return options.updates.includes(op);
}

function valueStorageType(options: SegmentTreeOptions): string {
  return options.aggregate === "custom"
    ? options.custom?.nodeType ?? "Node"
    : options.valueType;
}

function scalarNeutralExpression(options: SegmentTreeOptions): string {
  if (options.aggregate === "sum") {
    return `${options.valueType}(0)`;
  }
  if (options.aggregate === "min") {
    return `numeric_limits<${options.valueType}>::max()`;
  }
  if (options.aggregate === "max") {
    return `numeric_limits<${options.valueType}>::lowest()`;
  }
  return `${options.custom?.nodeType ?? "Node"}{}`;
}

function scalarMergeExpression(options: SegmentTreeOptions, lhs: string, rhs: string): string {
  if (options.aggregate === "sum") {
    return `${lhs} + ${rhs}`;
  }
  if (options.aggregate === "min") {
    return `min(${lhs}, ${rhs})`;
  }
  if (options.aggregate === "max") {
    return `max(${lhs}, ${rhs})`;
  }
  return `${lhs}`;
}

function scalarSetExpression(options: SegmentTreeOptions, value: string, len: string): string {
  if (options.aggregate === "sum") {
    return `${value} * static_cast<${options.valueType}>(${len})`;
  }
  return value;
}

function scalarAddExpression(options: SegmentTreeOptions, delta: string, len: string): string {
  if (options.aggregate === "sum") {
    return `${delta} * static_cast<${options.valueType}>(${len})`;
  }
  return delta;
}

function extractTargetField(target: string): string | undefined {
  const match = target.match(/\.([A-Za-z_][A-Za-z0-9_]*)\s*$/);
  return match?.[1];
}

function customFieldNames(options: SegmentTreeOptions): string[] {
  const fields: string[] = [];
  const add = (field: string | undefined) => {
    if (field && !fields.includes(field)) {
      fields.push(field);
    }
  };
  add(extractTargetField(options.custom?.leafTarget ?? "node.x"));
  add(extractTargetField(options.custom?.updateTarget ?? "node.x"));
  if (fields.length === 0) {
    fields.push("x");
  }
  return fields;
}

function targetExpression(target: string, objectName: string): string {
  const trimmed = target.trim();
  if (trimmed.startsWith("node.")) {
    return `${objectName}.${trimmed.slice("node.".length)}`;
  }
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(trimmed)) {
    return `${objectName}.${trimmed}`;
  }
  return trimmed.replace(/\bnode\b/g, objectName);
}

function pushLine(lines: string[], line = ""): void {
  lines.push(line);
}

function normalizeSectionChunk(chunk: string): string {
  return chunk.trim();
}

export function createRenderedRecipe(
  sections: Partial<Record<SolutionSection, string[]>>,
  exports: string[] = [],
  dependencies: DynamicDependency[] = []
): RenderedRecipe {
  return { sections, exports, dependencies };
}

export function composeRecipeSections(
  recipe: RenderedRecipe,
  selectedSections: SolutionSection[] = SOLUTION_SECTION_ORDER
): string {
  const chunks: string[] = [];
  for (const section of selectedSections) {
    for (const chunk of recipe.sections[section] ?? []) {
      const normalized = normalizeSectionChunk(chunk);
      if (normalized !== "") {
        chunks.push(normalized);
      }
    }
  }
  return chunks.length === 0 ? "" : `${chunks.join("\n\n")}\n`;
}

export function renderRecipeSnippet(
  recipe: RenderedRecipe,
  selectedSections: SolutionSection[] = SOLUTION_SECTION_ORDER
): RenderedSnippet {
  return {
    content: composeRecipeSections(recipe, selectedSections),
    renames: [],
    exports: recipe.exports
  };
}

export function mergeRenderedRecipes(recipes: RenderedRecipe[]): RenderedRecipe {
  const sections: Partial<Record<SolutionSection, string[]>> = {};
  const exports: string[] = [];
  const dependenciesByPath = new Map<string, DynamicDependency>();

  for (const recipe of recipes) {
    for (const section of SOLUTION_SECTION_ORDER) {
      const chunks = recipe.sections[section];
      if (!chunks || chunks.length === 0) {
        continue;
      }
      sections[section] = [...(sections[section] ?? []), ...chunks];
    }
    for (const name of recipe.exports) {
      if (!exports.includes(name)) {
        exports.push(name);
      }
    }
    for (const dependency of recipe.dependencies) {
      if (!dependenciesByPath.has(dependency.path)) {
        dependenciesByPath.set(dependency.path, dependency);
      }
    }
  }

  return {
    sections,
    exports,
    dependencies: [...dependenciesByPath.values()]
  };
}

function segmentTreeExportedNames(options: SegmentTreeOptions): string[] {
  const names = options.names;
  const result: string[] = [];
  const add = (name: string | undefined) => {
    if (name && !result.includes(name)) {
      result.push(name);
    }
  };

  add(options.aggregate === "custom" ? options.custom?.nodeType ?? "Node" : undefined);
  add(names.storageName);
  add(names.neutralName);
  add(names.makeNodeName);
  add(names.mergeName);
  add(names.initName);
  add(names.buildName);
  add(names.queryName);
  if (hasUpdate(options, "range_add")) {
    add(names.lazyAddName);
    add(names.applyAddName);
  }
  if (hasUpdate(options, "range_assign")) {
    add(names.lazySetName);
    add(names.lazyHasSetName);
    add(names.applySetName);
  }
  if (hasUpdate(options, "range_add") || hasUpdate(options, "range_assign")) {
    add(names.pushName);
  }
  if (hasUpdate(options, "point_set")) {
    add(names.pointSetName);
  }
  if (hasUpdate(options, "point_add")) {
    add(names.pointAddName);
  }
  if (hasUpdate(options, "range_add")) {
    add(names.rangeAddName);
  }
  if (hasUpdate(options, "range_assign")) {
    add(names.rangeAssignName);
  }
  return result;
}

export function renderSegmentTreeRecipe(options: SegmentTreeOptions): RenderedRecipe {
  return createRenderedRecipe(
    { helpers: [renderSegmentTree(options)] },
    segmentTreeExportedNames(options)
  );
}

export function renderSegmentTree(options: SegmentTreeOptions): string {
  const names = options.names;
  const valueType = valueStorageType(options);
  const hasRangeAdd = hasUpdate(options, "range_add");
  const hasRangeAssign = hasUpdate(options, "range_assign");
  const hasLazy = hasRangeAdd || hasRangeAssign;
  const lines: string[] = [];

  if (options.aggregate === "custom") {
    const custom = options.custom ?? {
      nodeType: "Node",
      leafTarget: "node.x",
      leafExpression: "value",
      updateTarget: "node.x"
    };
    const fields = customFieldNames(options);
    const field = fields[0];
    pushLine(lines, `struct ${custom.nodeType} {`);
    for (const currentField of fields) {
      pushLine(lines, `  ${options.valueType} ${currentField} = ${options.valueType}(0);`);
    }
    pushLine(lines, `  // TODO: add aggregate fields.`);
    pushLine(lines, `};`);
    pushLine(lines);
    pushLine(lines, `${custom.nodeType} ${names.neutralName}() {`);
    pushLine(lines, `  return ${custom.nodeType}{};`);
    pushLine(lines, `}`);
    pushLine(lines);
    pushLine(lines, `${custom.nodeType} ${names.makeNodeName}(${options.valueType} value) {`);
    pushLine(lines, `  ${custom.nodeType} node{};`);
    pushLine(
      lines,
      `  ${targetExpression(custom.leafTarget, "node")} = ${custom.leafExpression};`
    );
    pushLine(lines, `  return node;`);
    pushLine(lines, `}`);
    pushLine(lines);
    pushLine(lines, `${custom.nodeType} ${names.mergeName}(${custom.nodeType} a, ${custom.nodeType} b) {`);
    pushLine(lines, `  ${custom.nodeType} res{};`);
    pushLine(lines, `  res.${field} = a.${field} + b.${field};`);
    pushLine(lines, `  // TODO: replace with the problem-specific merge.`);
    pushLine(lines, `  return res;`);
    pushLine(lines, `}`);
  } else {
    pushLine(lines, `${options.valueType} ${names.neutralName}() {`);
    pushLine(lines, `  return ${scalarNeutralExpression(options)};`);
    pushLine(lines, `}`);
    pushLine(lines);
    pushLine(lines, `${options.valueType} ${names.makeNodeName}(${options.valueType} value) {`);
    pushLine(lines, `  return value;`);
    pushLine(lines, `}`);
    pushLine(lines);
    pushLine(lines, `${options.valueType} ${names.mergeName}(${options.valueType} a, ${options.valueType} b) {`);
    pushLine(lines, `  return ${scalarMergeExpression(options, "a", "b")};`);
    pushLine(lines, `}`);
  }

  pushLine(lines);
  pushLine(lines, `vector<${valueType}> ${names.storageName};`);
  if (hasRangeAdd) {
    pushLine(lines, `vector<${options.valueType}> ${names.lazyAddName};`);
  }
  if (hasRangeAssign) {
    pushLine(lines, `vector<${options.valueType}> ${names.lazySetName};`);
    pushLine(lines, `vector<char> ${names.lazyHasSetName};`);
  }
  pushLine(lines);

  pushLine(lines, `void ${names.initName}(int n) {`);
  pushLine(
    lines,
    `  ${names.storageName}.assign(4 * max(1, n), ${names.neutralName}());`
  );
  if (hasRangeAdd) {
    pushLine(
      lines,
      `  ${names.lazyAddName}.assign(4 * max(1, n), ${options.valueType}(0));`
    );
  }
  if (hasRangeAssign) {
    pushLine(
      lines,
      `  ${names.lazySetName}.assign(4 * max(1, n), ${options.valueType}(0));`
    );
    pushLine(lines, `  ${names.lazyHasSetName}.assign(4 * max(1, n), 0);`);
  }
  pushLine(lines, `}`);
  pushLine(lines);

  if (hasRangeAssign) {
    pushLine(lines, `void ${names.applySetName}(int v, int tl, int tr, ${options.valueType} value) {`);
    if (options.aggregate === "custom") {
      const custom = options.custom!;
      pushLine(lines, `  (void)tl;`);
      pushLine(lines, `  (void)tr;`);
      pushLine(lines, `  ${valueType}& node = ${names.storageName}[v];`);
      pushLine(lines, `  ${targetExpression(custom.updateTarget, "node")} = value;`);
      pushLine(lines, `  // TODO: adjust assignment for aggregate fields and segment length.`);
    } else {
      pushLine(lines, `  ${names.storageName}[v] = ${scalarSetExpression(options, "value", "tr - tl + 1")};`);
    }
    pushLine(lines, `  ${names.lazyHasSetName}[v] = 1;`);
    pushLine(lines, `  ${names.lazySetName}[v] = value;`);
    if (hasRangeAdd) {
      pushLine(lines, `  ${names.lazyAddName}[v] = ${options.valueType}(0);`);
    }
    pushLine(lines, `}`);
    pushLine(lines);
  }

  if (hasRangeAdd) {
    pushLine(lines, `void ${names.applyAddName}(int v, int tl, int tr, ${options.valueType} delta) {`);
    if (options.aggregate === "custom") {
      const custom = options.custom!;
      pushLine(lines, `  (void)tl;`);
      pushLine(lines, `  (void)tr;`);
      pushLine(lines, `  ${valueType}& node = ${names.storageName}[v];`);
      pushLine(lines, `  ${targetExpression(custom.updateTarget, "node")} += delta;`);
      pushLine(lines, `  // TODO: adjust addition for aggregate fields and segment length.`);
    } else {
      pushLine(lines, `  ${names.storageName}[v] += ${scalarAddExpression(options, "delta", "tr - tl + 1")};`);
    }
    if (hasRangeAssign) {
      pushLine(lines, `  if (${names.lazyHasSetName}[v]) {`);
      pushLine(lines, `    ${names.lazySetName}[v] += delta;`);
      pushLine(lines, `  } else {`);
      pushLine(lines, `    ${names.lazyAddName}[v] += delta;`);
      pushLine(lines, `  }`);
    } else {
      pushLine(lines, `  ${names.lazyAddName}[v] += delta;`);
    }
    pushLine(lines, `}`);
    pushLine(lines);
  }

  if (hasLazy) {
    pushLine(lines, `void ${names.pushName}(int v, int tl, int tr) {`);
    pushLine(lines, `  if (tl == tr) return;`);
    pushLine(lines, `  int tm = (tl + tr) / 2;`);
    if (hasRangeAssign) {
      pushLine(lines, `  if (${names.lazyHasSetName}[v]) {`);
      pushLine(lines, `    ${names.applySetName}(v * 2, tl, tm, ${names.lazySetName}[v]);`);
      pushLine(
        lines,
        `    ${names.applySetName}(v * 2 + 1, tm + 1, tr, ${names.lazySetName}[v]);`
      );
      pushLine(lines, `    ${names.lazyHasSetName}[v] = 0;`);
      pushLine(lines, `  }`);
    }
    if (hasRangeAdd) {
      pushLine(lines, `  if (${names.lazyAddName}[v] != ${options.valueType}(0)) {`);
      pushLine(lines, `    ${names.applyAddName}(v * 2, tl, tm, ${names.lazyAddName}[v]);`);
      pushLine(
        lines,
        `    ${names.applyAddName}(v * 2 + 1, tm + 1, tr, ${names.lazyAddName}[v]);`
      );
      pushLine(lines, `    ${names.lazyAddName}[v] = ${options.valueType}(0);`);
      pushLine(lines, `  }`);
    }
    pushLine(lines, `}`);
    pushLine(lines);
  }

  pushLine(lines, `void ${names.buildName}(int v, int tl, int tr, const vector<${options.valueType}>& a) {`);
  pushLine(lines, `  if (tl == tr) {`);
  pushLine(lines, `    ${names.storageName}[v] = ${names.makeNodeName}(a[tl]);`);
  pushLine(lines, `    return;`);
  pushLine(lines, `  }`);
  pushLine(lines, `  int tm = (tl + tr) / 2;`);
  pushLine(lines, `  ${names.buildName}(v * 2, tl, tm, a);`);
  pushLine(lines, `  ${names.buildName}(v * 2 + 1, tm + 1, tr, a);`);
  pushLine(
    lines,
    `  ${names.storageName}[v] = ${names.mergeName}(${names.storageName}[v * 2], ${names.storageName}[v * 2 + 1]);`
  );
  pushLine(lines, `}`);
  pushLine(lines);

  pushLine(lines, `${valueType} ${names.queryName}(int v, int tl, int tr, int l, int r) {`);
  pushLine(lines, `  if (tl > r || tr < l) return ${names.neutralName}();`);
  pushLine(lines, `  if (l <= tl && tr <= r) return ${names.storageName}[v];`);
  if (hasLazy) {
    pushLine(lines, `  ${names.pushName}(v, tl, tr);`);
  }
  pushLine(lines, `  int tm = (tl + tr) / 2;`);
  pushLine(
    lines,
    `  return ${names.mergeName}(${names.queryName}(v * 2, tl, tm, l, r), ${names.queryName}(v * 2 + 1, tm + 1, tr, l, r));`
  );
  pushLine(lines, `}`);

  if (hasUpdate(options, "point_set")) {
    pushLine(lines);
    pushLine(lines, `void ${names.pointSetName}(int v, int tl, int tr, int pos, ${options.valueType} value) {`);
    pushLine(lines, `  if (tl == tr) {`);
    pushLine(lines, `    ${names.storageName}[v] = ${names.makeNodeName}(value);`);
    pushLine(lines, `    return;`);
    pushLine(lines, `  }`);
    if (hasLazy) {
      pushLine(lines, `  ${names.pushName}(v, tl, tr);`);
    }
    pushLine(lines, `  int tm = (tl + tr) / 2;`);
    pushLine(lines, `  if (pos <= tm) ${names.pointSetName}(v * 2, tl, tm, pos, value);`);
    pushLine(lines, `  else ${names.pointSetName}(v * 2 + 1, tm + 1, tr, pos, value);`);
    pushLine(
      lines,
      `  ${names.storageName}[v] = ${names.mergeName}(${names.storageName}[v * 2], ${names.storageName}[v * 2 + 1]);`
    );
    pushLine(lines, `}`);
  }

  if (hasUpdate(options, "point_add")) {
    pushLine(lines);
    pushLine(lines, `void ${names.pointAddName}(int v, int tl, int tr, int pos, ${options.valueType} delta) {`);
    pushLine(lines, `  if (tl == tr) {`);
    if (options.aggregate === "custom") {
      const custom = options.custom!;
      pushLine(lines, `    ${targetExpression(custom.updateTarget, `${names.storageName}[v]`)} += delta;`);
    } else {
      pushLine(lines, `    ${names.storageName}[v] += delta;`);
    }
    pushLine(lines, `    return;`);
    pushLine(lines, `  }`);
    if (hasLazy) {
      pushLine(lines, `  ${names.pushName}(v, tl, tr);`);
    }
    pushLine(lines, `  int tm = (tl + tr) / 2;`);
    pushLine(lines, `  if (pos <= tm) ${names.pointAddName}(v * 2, tl, tm, pos, delta);`);
    pushLine(lines, `  else ${names.pointAddName}(v * 2 + 1, tm + 1, tr, pos, delta);`);
    pushLine(
      lines,
      `  ${names.storageName}[v] = ${names.mergeName}(${names.storageName}[v * 2], ${names.storageName}[v * 2 + 1]);`
    );
    pushLine(lines, `}`);
  }

  if (hasRangeAdd) {
    pushLine(lines);
    pushLine(lines, `void ${names.rangeAddName}(int v, int tl, int tr, int l, int r, ${options.valueType} delta) {`);
    pushLine(lines, `  if (tl > r || tr < l) return;`);
    pushLine(lines, `  if (l <= tl && tr <= r) {`);
    pushLine(lines, `    ${names.applyAddName}(v, tl, tr, delta);`);
    pushLine(lines, `    return;`);
    pushLine(lines, `  }`);
    pushLine(lines, `  ${names.pushName}(v, tl, tr);`);
    pushLine(lines, `  int tm = (tl + tr) / 2;`);
    pushLine(lines, `  ${names.rangeAddName}(v * 2, tl, tm, l, r, delta);`);
    pushLine(lines, `  ${names.rangeAddName}(v * 2 + 1, tm + 1, tr, l, r, delta);`);
    pushLine(
      lines,
      `  ${names.storageName}[v] = ${names.mergeName}(${names.storageName}[v * 2], ${names.storageName}[v * 2 + 1]);`
    );
    pushLine(lines, `}`);
  }

  if (hasRangeAssign) {
    pushLine(lines);
    pushLine(lines, `void ${names.rangeAssignName}(int v, int tl, int tr, int l, int r, ${options.valueType} value) {`);
    pushLine(lines, `  if (tl > r || tr < l) return;`);
    pushLine(lines, `  if (l <= tl && tr <= r) {`);
    pushLine(lines, `    ${names.applySetName}(v, tl, tr, value);`);
    pushLine(lines, `    return;`);
    pushLine(lines, `  }`);
    pushLine(lines, `  ${names.pushName}(v, tl, tr);`);
    pushLine(lines, `  int tm = (tl + tr) / 2;`);
    pushLine(lines, `  ${names.rangeAssignName}(v * 2, tl, tm, l, r, value);`);
    pushLine(lines, `  ${names.rangeAssignName}(v * 2 + 1, tm + 1, tr, l, r, value);`);
    pushLine(
      lines,
      `  ${names.storageName}[v] = ${names.mergeName}(${names.storageName}[v * 2], ${names.storageName}[v * 2 + 1]);`
    );
    pushLine(lines, `}`);
  }

  return `${lines.join("\n")}\n`;
}

export function renderCompressUnique(options: CompressUniqueOptions): string {
  const lines: string[] = [];
  if (options.valuesName !== options.sourceName) {
    pushLine(lines, `auto ${options.valuesName} = ${options.sourceName};`);
  }
  pushLine(lines, `sort(all(${options.valuesName}));`);
  pushLine(
    lines,
    `${options.valuesName}.resize(unique(all(${options.valuesName})) - ${options.valuesName}.begin());`
  );
  pushLine(lines, `auto ${options.idFunctionName} = [&](auto x) {`);
  pushLine(
    lines,
    `  return lower_bound(all(${options.valuesName}), x) - ${options.valuesName}.begin();`
  );
  pushLine(lines, `};`);
  if (options.rewriteSource && options.valuesName !== options.sourceName) {
    pushLine(
      lines,
      `for (auto& x : ${options.sourceName}) x = ${options.idFunctionName}(x);`
    );
  }
  return `${lines.join("\n")}\n`;
}

export function renderReadVector(options: ReadVectorOptions): string {
  return `${options.containerType} ${options.name}(${options.sizeExpression});\nfor (auto& x : ${options.name}) cin >> x;\n`;
}

export function defaultSparseTableVariants(): SparseTableVariant[] {
  return ["min", "max"];
}

export function planSparseTableNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): SparseTableNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    logName: planner.reserve("sparse_log"),
    ensureLogName: planner.reserve("ensure_sparse_log"),
    minTableName: planner.reserve("sparse_min"),
    buildMinName: planner.reserve("build_sparse_min"),
    queryMinName: planner.reserve("query_sparse_min"),
    maxTableName: planner.reserve("sparse_max"),
    buildMaxName: planner.reserve("build_sparse_max"),
    queryMaxName: planner.reserve("query_sparse_max")
  };
}

function sparseTableVariantSet(
  variants: SparseTableVariant[]
): Set<SparseTableVariant> {
  return new Set(variants.length === 0 ? defaultSparseTableVariants() : variants);
}

function sparseTableExports(
  options: SparseTableOptions,
  variants: Set<SparseTableVariant>
): string[] {
  const exports = [options.names.logName, options.names.ensureLogName];
  if (variants.has("min")) {
    exports.push(
      options.names.minTableName,
      options.names.buildMinName,
      options.names.queryMinName
    );
  }
  if (variants.has("max")) {
    exports.push(
      options.names.maxTableName,
      options.names.buildMaxName,
      options.names.queryMaxName
    );
  }
  return exports;
}

function renderSparseTableUsage(
  options: SparseTableOptions,
  variants: Set<SparseTableVariant>
): string {
  const lines = ["/*", "Inclusive [l, r] queries:"];
  if (variants.has("min")) {
    lines.push(
      `${options.names.buildMinName}(${options.sourceName});`,
      `auto mn = ${options.names.queryMinName}(l, r);`
    );
  }
  if (variants.has("max")) {
    lines.push(
      `${options.names.buildMaxName}(${options.sourceName});`,
      `auto mx = ${options.names.queryMaxName}(l, r);`
    );
  }
  lines.push("*/");
  return lines.join("\n");
}

function renderSparseTableVariant(
  options: SparseTableOptions,
  variant: SparseTableVariant
): string[] {
  const names = options.names;
  const isMin = variant === "min";
  const tableName = isMin ? names.minTableName : names.maxTableName;
  const buildName = isMin ? names.buildMinName : names.buildMaxName;
  const queryName = isMin ? names.queryMinName : names.queryMaxName;
  const combineExpression = isMin ? "lhs < rhs ? lhs : rhs" : "lhs < rhs ? rhs : lhs";
  const lines: string[] = [];

  pushLine(lines, `vector<vector<${options.valueType}>> ${tableName};`);
  pushLine(lines);
  pushLine(lines, `void ${buildName}(const vector<${options.valueType}>& values) {`);
  pushLine(lines, "  const int n = static_cast<int>(values.size());");
  pushLine(lines, `  ${names.ensureLogName}(n);`);
  pushLine(lines, `  ${tableName}.clear();`);
  pushLine(lines, "  if (n == 0) {");
  pushLine(lines, "    return;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${tableName}.assign(${names.logName}[n] + 1, vector<${options.valueType}>());`);
  pushLine(lines, `  ${tableName}[0] = values;`);
  pushLine(lines, `  for (int level = 1; level < static_cast<int>(${tableName}.size()); ++level) {`);
  pushLine(lines, "    const int len = 1 << level;");
  pushLine(lines, "    const int half = len >> 1;");
  pushLine(lines, `    ${tableName}[level].assign(n - len + 1, ${options.valueType}());`);
  pushLine(lines, "    for (int i = 0; i + len <= n; ++i) {");
  pushLine(lines, `      const ${options.valueType}& lhs = ${tableName}[level - 1][i];`);
  pushLine(lines, `      const ${options.valueType}& rhs = ${tableName}[level - 1][i + half];`);
  pushLine(lines, `      ${tableName}[level][i] = (${combineExpression});`);
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, `${options.valueType} ${queryName}(int left, int right) {`);
  pushLine(
    lines,
    `  const int n = ${tableName}.empty() ? 0 : static_cast<int>(${tableName}[0].size());`
  );
  pushLine(lines, "  if (n == 0 || left > right || right < 0 || left >= n) {");
  pushLine(lines, `    return ${options.valueType}();`);
  pushLine(lines, "  }");
  pushLine(lines, "  if (left < 0) {");
  pushLine(lines, "    left = 0;");
  pushLine(lines, "  }");
  pushLine(lines, "  if (right >= n) {");
  pushLine(lines, "    right = n - 1;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  const int level = ${names.logName}[right - left + 1];`);
  pushLine(lines, `  const ${options.valueType}& lhs = ${tableName}[level][left];`);
  pushLine(
    lines,
    `  const ${options.valueType}& rhs = ${tableName}[level][right - (1 << level) + 1];`
  );
  pushLine(lines, `  return ${combineExpression};`);
  pushLine(lines, "}");
  return lines;
}

export function renderSparseTableRecipe(options: SparseTableOptions): RenderedRecipe {
  const variants = sparseTableVariantSet(options.variants);
  const lines: string[] = [];

  pushLine(lines, `vector<int> ${options.names.logName};`);
  pushLine(lines);
  pushLine(lines, `void ${options.names.ensureLogName}(int n) {`);
  pushLine(lines, `  if (static_cast<int>(${options.names.logName}.size()) > n) {`);
  pushLine(lines, "    return;");
  pushLine(lines, "  }");
  pushLine(lines, `  int start = static_cast<int>(${options.names.logName}.size());`);
  pushLine(lines, "  if (start < 2) {");
  pushLine(lines, "    start = 2;");
  pushLine(lines, "  }");
  pushLine(lines, `  ${options.names.logName}.resize(n + 1, 0);`);
  pushLine(lines, "  for (int i = start; i <= n; ++i) {");
  pushLine(lines, `    ${options.names.logName}[i] = ${options.names.logName}[i / 2] + 1;`);
  pushLine(lines, "  }");
  pushLine(lines, "}");

  if (variants.has("min")) {
    pushLine(lines);
    lines.push(...renderSparseTableVariant(options, "min"));
  }
  if (variants.has("max")) {
    pushLine(lines);
    lines.push(...renderSparseTableVariant(options, "max"));
  }
  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderSparseTableUsage(options, variants));
  }

  return createRenderedRecipe(
    { helpers: [lines.join("\n")] },
    sparseTableExports(options, variants)
  );
}

export function renderSparseTable(options: SparseTableOptions): string {
  return composeRecipeSections(renderSparseTableRecipe(options));
}

export function defaultBerlekampMasseyFeatures(): BerlekampMasseyFeature[] {
  return ["minimal_recurrence", "kth_term", "one_shot_kth"];
}

export function planBerlekampMasseyNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): BerlekampMasseyNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    berlekampMasseyName: planner.reserve("berlekamp_massey"),
    linearRecurrenceKthName: planner.reserve("linear_recurrence_kth"),
    berlekampMasseyKthName: planner.reserve("berlekamp_massey_kth")
  };
}

function berlekampMasseyFeatureSet(
  features: BerlekampMasseyFeature[]
): Set<BerlekampMasseyFeature> {
  const result = new Set(features.length === 0 ? defaultBerlekampMasseyFeatures() : features);
  if (result.has("one_shot_kth")) {
    result.add("minimal_recurrence");
    result.add("kth_term");
  }
  return result;
}

function berlekampMasseyExports(
  options: BerlekampMasseyOptions,
  features: Set<BerlekampMasseyFeature>
): string[] {
  const exports: string[] = [];
  if (features.has("minimal_recurrence")) {
    exports.push(options.names.berlekampMasseyName);
  }
  if (features.has("kth_term")) {
    exports.push(options.names.linearRecurrenceKthName);
  }
  if (features.has("one_shot_kth")) {
    exports.push(options.names.berlekampMasseyKthName);
  }
  return exports;
}

function renderBerlekampMasseyUsage(
  options: BerlekampMasseyOptions,
  features: Set<BerlekampMasseyFeature>
): string {
  const lines = ["/*", "Example:"];
  if (features.has("minimal_recurrence")) {
    lines.push(
      `auto c = ${options.names.berlekampMasseyName}<${options.valueType}>(${options.sequenceName});`
    );
  }
  if (features.has("kth_term")) {
    if (!features.has("minimal_recurrence")) {
      lines.push(`std::vector<${options.valueType}> c = {}; // recurrence coefficients`);
    }
    lines.push(
      `std::vector<${options.valueType}> init(${options.sequenceName}.begin(), ${options.sequenceName}.begin() + c.size());`,
      `auto ans = ${options.names.linearRecurrenceKthName}<${options.valueType}>(init, c, ${options.indexName});`
    );
  }
  if (features.has("one_shot_kth")) {
    lines.push(
      `auto same = ${options.names.berlekampMasseyKthName}<${options.valueType}>(${options.sequenceName}, ${options.indexName});`
    );
  }
  lines.push("*/");
  return lines.join("\n");
}

export function renderBerlekampMasseyRecipe(
  options: BerlekampMasseyOptions
): RenderedRecipe {
  const features = berlekampMasseyFeatureSet(options.features);
  const lines: string[] = [];

  if (features.has("minimal_recurrence")) {
    pushLine(lines, "// T must be a field-like type where division by a non-zero value is valid.");
    pushLine(lines, "// Returns c where s[i] = c[0] * s[i - 1] + ... + c[m - 1] * s[i - m].");
    pushLine(lines, "template <typename T>");
    pushLine(
      lines,
      `inline std::vector<T> ${options.names.berlekampMasseyName}(const std::vector<T>& sequence) {`
    );
    pushLine(lines, "  const T zero = T(0);");
    pushLine(lines, "  const T one = T(1);");
    pushLine(lines);
    pushLine(lines, "  std::vector<T> current(1, one);");
    pushLine(lines, "  std::vector<T> last(1, one);");
    pushLine(lines, "  int order = 0;");
    pushLine(lines, "  int shift = 1;");
    pushLine(lines, "  T last_discrepancy = one;");
    pushLine(lines);
    pushLine(lines, "  for (int i = 0; i < static_cast<int>(sequence.size()); ++i) {");
    pushLine(lines, "    T discrepancy = sequence[i];");
    pushLine(lines, "    for (int j = 1; j <= order; ++j) {");
    pushLine(lines, "      discrepancy += current[j] * sequence[i - j];");
    pushLine(lines, "    }");
    pushLine(lines);
    pushLine(lines, "    if (discrepancy == zero) {");
    pushLine(lines, "      ++shift;");
    pushLine(lines, "      continue;");
    pushLine(lines, "    }");
    pushLine(lines);
    pushLine(lines, "    const std::vector<T> previous = current;");
    pushLine(lines, "    const T factor = discrepancy / last_discrepancy;");
    pushLine(
      lines,
      "    if (static_cast<int>(current.size()) < static_cast<int>(last.size()) + shift) {"
    );
    pushLine(lines, "      current.resize(static_cast<int>(last.size()) + shift, zero);");
    pushLine(lines, "    }");
    pushLine(lines, "    for (int j = 0; j < static_cast<int>(last.size()); ++j) {");
    pushLine(lines, "      current[j + shift] -= factor * last[j];");
    pushLine(lines, "    }");
    pushLine(lines);
    pushLine(lines, "    if (2 * order <= i) {");
    pushLine(lines, "      order = i + 1 - order;");
    pushLine(lines, "      last = previous;");
    pushLine(lines, "      last_discrepancy = discrepancy;");
    pushLine(lines, "      shift = 1;");
    pushLine(lines, "    } else {");
    pushLine(lines, "      ++shift;");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  current.erase(current.begin());");
    pushLine(lines, "  for (T& coefficient : current) {");
    pushLine(lines, "    coefficient = zero - coefficient;");
    pushLine(lines, "  }");
    pushLine(lines, "  while (!current.empty() && current.back() == zero) {");
    pushLine(lines, "    current.pop_back();");
    pushLine(lines, "  }");
    pushLine(lines, "  return current;");
    pushLine(lines, "}");
  }

  if (features.has("kth_term")) {
    if (lines.length > 0) {
      pushLine(lines);
    }
    pushLine(lines, "template <typename T>");
    pushLine(
      lines,
      `inline T ${options.names.linearRecurrenceKthName}(const std::vector<T>& initial,`
    );
    pushLine(lines, "                               const std::vector<T>& coefficients,");
    pushLine(lines, "                               long long index) {");
    pushLine(lines, "  if (index < 0) {");
    pushLine(lines, "    return T(0);");
    pushLine(lines, "  }");
    pushLine(lines, "  if (index < static_cast<long long>(initial.size())) {");
    pushLine(lines, "    return initial[static_cast<int>(index)];");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  const int order = static_cast<int>(coefficients.size());");
    pushLine(lines, "  if (order == 0) {");
    pushLine(lines, "    return T(0);");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  auto combine = [&](const std::vector<T>& lhs, const std::vector<T>& rhs) {");
    pushLine(lines, "    std::vector<T> result(2 * order, T(0));");
    pushLine(lines, "    for (int i = 0; i < order; ++i) {");
    pushLine(lines, "      for (int j = 0; j < order; ++j) {");
    pushLine(lines, "        result[i + j] += lhs[i] * rhs[j];");
    pushLine(lines, "      }");
    pushLine(lines, "    }");
    pushLine(lines, "    for (int i = 2 * order - 1; i >= order; --i) {");
    pushLine(lines, "      for (int j = 0; j < order; ++j) {");
    pushLine(lines, "        result[i - 1 - j] += result[i] * coefficients[j];");
    pushLine(lines, "      }");
    pushLine(lines, "    }");
    pushLine(lines, "    result.resize(order);");
    pushLine(lines, "    return result;");
    pushLine(lines, "  };");
    pushLine(lines);
    pushLine(lines, "  std::vector<T> seed(order, T(0));");
    pushLine(lines, "  for (int i = 0; i < order && i < static_cast<int>(initial.size()); ++i) {");
    pushLine(lines, "    seed[i] = initial[i];");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  std::vector<T> result(order, T(0));");
    pushLine(lines, "  result[0] = T(1);");
    pushLine(lines);
    pushLine(lines, "  std::vector<T> x(order, T(0));");
    pushLine(lines, "  if (order == 1) {");
    pushLine(lines, "    x[0] = coefficients[0];");
    pushLine(lines, "  } else {");
    pushLine(lines, "    x[1] = T(1);");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  long long power = index;");
    pushLine(lines, "  while (power > 0) {");
    pushLine(lines, "    if (power & 1LL) {");
    pushLine(lines, "      result = combine(result, x);");
    pushLine(lines, "    }");
    pushLine(lines, "    x = combine(x, x);");
    pushLine(lines, "    power >>= 1LL;");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  T answer = T(0);");
    pushLine(lines, "  for (int i = 0; i < order; ++i) {");
    pushLine(lines, "    answer += result[i] * seed[i];");
    pushLine(lines, "  }");
    pushLine(lines, "  return answer;");
    pushLine(lines, "}");
  }

  if (features.has("one_shot_kth")) {
    if (lines.length > 0) {
      pushLine(lines);
    }
    pushLine(lines, "template <typename T>");
    pushLine(
      lines,
      `inline T ${options.names.berlekampMasseyKthName}(const std::vector<T>& sequence, long long index) {`
    );
    pushLine(lines, "  if (index < 0) {");
    pushLine(lines, "    return T(0);");
    pushLine(lines, "  }");
    pushLine(lines, "  if (index < static_cast<long long>(sequence.size())) {");
    pushLine(lines, "    return sequence[static_cast<int>(index)];");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(
      lines,
      `  const std::vector<T> coefficients = ${options.names.berlekampMasseyName}(sequence);`
    );
    pushLine(lines, "  const int order = static_cast<int>(coefficients.size());");
    pushLine(lines, "  if (order == 0) {");
    pushLine(lines, "    return T(0);");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  std::vector<T> initial(order, T(0));");
    pushLine(lines, "  for (int i = 0; i < order; ++i) {");
    pushLine(lines, "    initial[i] = sequence[i];");
    pushLine(lines, "  }");
    pushLine(
      lines,
      `  return ${options.names.linearRecurrenceKthName}(initial, coefficients, index);`
    );
    pushLine(lines, "}");
  }

  if (options.includeUsageComment) {
    if (lines.length > 0) {
      pushLine(lines);
    }
    pushLine(lines, renderBerlekampMasseyUsage(options, features));
  }

  return createRenderedRecipe(
    { helpers: [lines.join("\n")] },
    berlekampMasseyExports(options, features)
  );
}

export function renderBerlekampMassey(options: BerlekampMasseyOptions): string {
  return composeRecipeSections(renderBerlekampMasseyRecipe(options));
}

export function stripHeaderGuard(content: string): string {
  const lines = content.split(/\r?\n/);
  let start = 0;
  if (
    lines.length >= 2 &&
    /^\s*#ifndef\s+EDULCNI_/.test(lines[0]) &&
    /^\s*#define\s+EDULCNI_/.test(lines[1])
  ) {
    start = 2;
  }

  let end = lines.length;
  while (end > start && lines[end - 1].trim() === "") {
    --end;
  }
  if (end > start && /^\s*#endif\b.*EDULCNI_/.test(lines[end - 1])) {
    --end;
  }

  return `${lines.slice(start, end).join("\n").trim()}\n`;
}

function stripIncludeLines(content: string): string {
  return content
    .split(/\r?\n/)
    .filter((line) => !/^\s*#\s*include\b/.test(line))
    .join("\n");
}

export function unwrapEdulcniNamespace(content: string): string {
  let result = stripIncludeLines(stripHeaderGuard(content));
  result = result.replace(/(^|\n)\s*namespace\s+edulcni\s*\{\s*\n/, "$1");
  result = result.replace(/\n\s*\}\s*\/\/\s*namespace\s+edulcni\s*$/, "\n");
  return `${result.trim()}\n`;
}

export function renderHeaderContent(content: string, kind: SnippetKind): string {
  return kind === "solver" ? unwrapEdulcniNamespace(content) : content;
}

function addUniqueIdentifier(result: string[], seen: Set<string>, name: string | undefined): void {
  if (!name || seen.has(name) || CPP_KEYWORDS.has(name) || !isIdentifier(name)) {
    return;
  }
  seen.add(name);
  result.push(name);
}

function updateBraceDepth(line: string, depth: number): number {
  let nextDepth = depth;
  for (const ch of line) {
    if (ch === "{") {
      ++nextDepth;
    } else if (ch === "}") {
      nextDepth = Math.max(0, nextDepth - 1);
    }
  }
  return nextDepth;
}

function topLevelDeclarationName(line: string): string | undefined {
  const trimmed = line.trim();
  if (
    trimmed === "" ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("template") ||
    trimmed.startsWith("namespace ")
  ) {
    return undefined;
  }

  const typeMatch = trimmed.match(/^(?:class|struct)\s+([A-Za-z_][A-Za-z0-9_]*)\b/);
  if (typeMatch) {
    return typeMatch[1];
  }

  const usingMatch = trimmed.match(/^using\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/);
  if (usingMatch) {
    return usingMatch[1];
  }

  const typedefMatch = trimmed.match(/^typedef\b.+\b([A-Za-z_][A-Za-z0-9_]*)\s*;/);
  if (typedefMatch) {
    return typedefMatch[1];
  }

  const paren = trimmed.indexOf("(");
  if (paren === -1) {
    return undefined;
  }
  const beforeParen = trimmed.slice(0, paren).trim();
  const name = lastIdentifier(beforeParen);
  if (!name) {
    return undefined;
  }

  const nameOffset = beforeParen.lastIndexOf(name);
  const prefix = beforeParen.slice(0, nameOffset).trim();
  return prefix === "" ? undefined : name;
}

export function collectGlobalExportedIdentifiers(content: string): string[] {
  const stripped = stripCppCommentsAndStrings(content);
  const result: string[] = [];
  const seen = new Set<string>();
  let braceDepth = 0;

  for (const line of stripped.split(/\r?\n/)) {
    if (braceDepth === 0 && /^\S/.test(line)) {
      addUniqueIdentifier(result, seen, topLevelDeclarationName(line));
    }
    braceDepth = updateBraceDepth(line, braceDepth);
  }

  return result;
}

export function planIdentifierRenames(
  analysis: CppAnalysis,
  exportedNames: string[]
): IdentifierRename[] {
  const used = new Set(analysis.identifiers);
  const seen = new Set<string>();
  const renames: IdentifierRename[] = [];

  for (const name of exportedNames) {
    if (seen.has(name) || !isIdentifier(name) || CPP_KEYWORDS.has(name)) {
      continue;
    }
    seen.add(name);
    const safeName = reserveIdentifier(used, name);
    if (safeName !== name) {
      renames.push({ from: name, to: safeName });
    }
  }

  return renames;
}

function isIdentifierStart(ch: string): boolean {
  return /^[A-Za-z_]$/.test(ch);
}

function isIdentifierPart(ch: string): boolean {
  return /^[A-Za-z0-9_]$/.test(ch);
}

export function applyIdentifierRenames(
  content: string,
  renames: IdentifierRename[]
): string {
  if (renames.length === 0) {
    return content;
  }

  const renameByName = new Map(renames.map((rename) => [rename.from, rename.to]));
  let result = "";
  let state: "normal" | "line" | "block" | "string" | "char" = "normal";

  for (let i = 0; i < content.length; ++i) {
    const ch = content[i];
    const next = content[i + 1] ?? "";

    if (state === "line") {
      result += ch;
      if (ch === "\n") {
        state = "normal";
      }
      continue;
    }

    if (state === "block") {
      result += ch;
      if (ch === "*" && next === "/") {
        result += next;
        ++i;
        state = "normal";
      }
      continue;
    }

    if (state === "string" || state === "char") {
      result += ch;
      const end = state === "string" ? "\"" : "'";
      if (ch === "\\" && i + 1 < content.length) {
        result += content[i + 1];
        ++i;
      } else if (ch === end) {
        state = "normal";
      }
      continue;
    }

    if (ch === "/" && next === "/") {
      result += ch + next;
      ++i;
      state = "line";
      continue;
    }
    if (ch === "/" && next === "*") {
      result += ch + next;
      ++i;
      state = "block";
      continue;
    }
    if (ch === "\"") {
      result += ch;
      state = "string";
      continue;
    }
    if (ch === "'") {
      result += ch;
      state = "char";
      continue;
    }
    if (!isIdentifierStart(ch)) {
      result += ch;
      continue;
    }

    let end = i + 1;
    while (end < content.length && isIdentifierPart(content[end])) {
      ++end;
    }
    const token = content.slice(i, end);
    result += renameByName.get(token) ?? token;
    i = end - 1;
  }

  return result;
}

export function renderSnippetContent(
  content: string,
  kind: SnippetKind,
  analysis: CppAnalysis,
  exportedNames?: string[]
): RenderedSnippet {
  const rendered = renderHeaderContent(content, kind);
  const exports = exportedNames ?? (kind === "solver" ? collectGlobalExportedIdentifiers(rendered) : []);
  const renames = planIdentifierRenames(analysis, exports);
  return {
    content: applyIdentifierRenames(rendered, renames),
    renames,
    exports
  };
}

export function defaultKindForPath(path: string): SnippetKind {
  return path.startsWith("/bricks/") ? "brick" : "solver";
}

export function defaultInsertModeForKind(kind: SnippetKind): InsertMode {
  return kind === "brick" ? "cursor" : "global";
}

export function resolveCatalogOrder(
  selectedPath: string,
  entries: Map<string, CatalogEntry>
): string[] {
  const result: string[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (path: string) => {
    if (visited.has(path)) {
      return;
    }
    if (visiting.has(path)) {
      throw new Error(`catalog dependency cycle at ${path}`);
    }
    visiting.add(path);
    const entry = entries.get(path);
    for (const dependency of entry?.dependsOn ?? []) {
      visit(dependency);
    }
    visiting.delete(path);
    visited.add(path);
    result.push(path);
  };

  visit(selectedPath);
  return result;
}

export function findGlobalInsertionOffset(text: string): number {
  const stripped = stripCppCommentsAndStrings(text);
  const solveMatch = stripped.match(
    /^[ \t]*(?:void|int|auto|ll|long\s+long)\s+solve\s*\(/m
  );
  const mainMatch = stripped.match(/^[ \t]*int\s+main\s*\(/m);
  const target = solveMatch ?? mainMatch;
  if (target?.index !== undefined) {
    let offset = target.index;
    while (offset > 0) {
      const previousNewline = text.lastIndexOf("\n", offset - 2);
      const lineStart = previousNewline === -1 ? 0 : previousNewline + 1;
      const previousLine = text.slice(lineStart, offset).trim();
      if (previousLine !== "") {
        break;
      }
      offset = lineStart;
    }
    return offset;
  }

  const lines = text.split(/(\r?\n)/);
  let offset = 0;
  let lastPreludeOffset = 0;
  for (let i = 0; i < lines.length; i += 2) {
    const line = lines[i];
    const newline = lines[i + 1] ?? "";
    const trimmed = line.trim();
    const isPrelude =
      trimmed === "" ||
      trimmed.startsWith("#include") ||
      trimmed.startsWith("#define") ||
      trimmed.startsWith("#ifdef") ||
      trimmed.startsWith("#ifndef") ||
      trimmed.startsWith("#endif") ||
      trimmed.startsWith("using ") ||
      trimmed.startsWith("typedef ") ||
      /^const\s+/.test(trimmed);
    if (!isPrelude) {
      break;
    }
    offset += line.length + newline.length;
    lastPreludeOffset = offset;
  }
  return lastPreludeOffset;
}

export function normalizeInsertionText(
  documentText: string,
  offset: number,
  content: string
): string {
  const trimmed = content.trim();
  const before = documentText.slice(0, offset);
  const after = documentText.slice(offset);
  const prefix = before.length === 0 || before.endsWith("\n\n")
    ? ""
    : before.endsWith("\n")
      ? "\n"
      : "\n\n";
  const suffix = after.length === 0 || after.startsWith("\n\n")
    ? "\n"
    : after.startsWith("\n")
      ? "\n"
      : "\n\n";
  return `${prefix}${trimmed}${suffix}`;
}

export type SnippetKind = "brick" | "solver";
export type InsertMode = "cursor" | "global";

export interface CatalogEntry {
  path: string;
  kind: SnippetKind;
  insertMode?: InsertMode;
  generator?: "segtree" | "compress_unique" | "read_vector";
  source?: string;
  label?: string;
  description?: string;
  detail?: string;
  exports?: string[];
  dependsOn?: string[];
  form?: unknown[];
  render?: Record<string, unknown>;
}

export interface AnnotatedSymbol {
  name: string;
  kind: "const" | "input";
}

export interface VectorSymbol {
  name: string;
  type: string;
}

export interface CppAnalysis {
  identifiers: Set<string>;
  annotatedSymbols: AnnotatedSymbol[];
  constantSymbols: AnnotatedSymbol[];
  inputSymbols: AnnotatedSymbol[];
  vectorSymbols: VectorSymbol[];
  vectorAliases: Set<string>;
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
    vectorAliases
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
  const used = new Set(analysis.identifiers);
  const storageName = reserveIdentifier(used, requestedStorageName, "segtree");
  return {
    storageName,
    lazyAddName: reserveIdentifier(used, "lazy_add", "seg_lazy_add"),
    lazySetName: reserveIdentifier(used, "lazy_set", "seg_lazy_set"),
    lazyHasSetName: reserveIdentifier(used, "lazy_has_set", "seg_lazy_has_set"),
    initName: reserveIdentifier(used, "init_segtree", "seg_init"),
    buildName: reserveIdentifier(used, "build", "build_segtree"),
    queryName: reserveIdentifier(used, "get", "seg_get"),
    mergeName: reserveIdentifier(used, "merge", "merge_nodes"),
    neutralName: reserveIdentifier(used, "neutral", "seg_neutral"),
    makeNodeName: reserveIdentifier(used, "make_node", "seg_make_node"),
    pushName: reserveIdentifier(used, "push", "seg_push"),
    applyAddName: reserveIdentifier(used, "apply_add", "seg_apply_add"),
    applySetName: reserveIdentifier(used, "apply_set", "seg_apply_set"),
    pointSetName: reserveIdentifier(used, "point_set", "seg_point_set"),
    pointAddName: reserveIdentifier(used, "point_add", "seg_point_add"),
    rangeAddName: reserveIdentifier(used, "range_add", "seg_range_add"),
    rangeAssignName: reserveIdentifier(used, "range_assign", "seg_range_assign")
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

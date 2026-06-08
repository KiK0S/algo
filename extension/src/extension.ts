import * as path from "path";
import * as vscode from "vscode";
import {
  analyzeCppDocument,
  applyIdentifierRenames,
  BerlekampMasseyFeature,
  BerlekampMasseyOptions,
  BfsOptions,
  CatalogEntry,
  collectGlobalExportedIdentifiers,
  CompressUniqueOptions,
  CppAnalysis,
  defaultBerlekampMasseyFeatures,
  defaultInsertModeForKind,
  defaultKindForPath,
  defaultMaxflowDinicCapType,
  defaultMaxflowDinicFeatures,
  defaultMinCostMaxFlowCapType,
  defaultMinCostMaxFlowCostType,
  defaultMinCostMaxFlowFeatures,
  defaultMinCostMaxFlowOptions,
  defaultFenwickOptions,
  defaultModIntOptions,
  defaultPolyHashOptions,
  defaultSegmentTreeBeatsQueries,
  defaultSegmentTreeBeatsUpdates,
  defaultTwoSatFeatures,
  defaultTwoSatOptions,
  defaultFftNttTransforms,
  defaultHungarianCostType,
  defaultHungarianOptions,
  defaultKuhnFeatures,
  defaultKuhnOptions,
  defaultLinearSieveFeatures,
  DsuOptions,
  defaultMergeSortTreeQueries,
  defaultSuffixArrayFeatures,
  findGlobalInsertionOffset,
  FftNttOptions,
  FftNttTransform,
  HungarianMode,
  HungarianOptions,
  IdentifierRename,
  ImplicitTreapAggregate,
  ImplicitTreapFeature,
  ImplicitTreapOptions,
  InsertMode,
  KuhnFeature,
  KuhnOptions,
  LinearSieveOptions,
  LcaOptions,
  MaxflowDinicFeature,
  MaxflowDinicOptions,
  MinCostMaxFlowFeature,
  MinCostMaxFlowMode,
  MinCostMaxFlowOptions,
  ModIntMode,
  ModIntOptions,
  MergeSortTreeOptions,
  MergeSortTreeQuery,
  normalizeInsertionText,
  planBerlekampMasseyNames,
  planBfsNames,
  planDsuNames,
  planFftNttNames,
  planHungarianNames,
  planImplicitTreapNames,
  planKuhnNames,
  planLcaNames,
  planLinearSieveNames,
  planMaxflowDinicNames,
  planMinCostMaxFlowNames,
  planMergeSortTreeNames,
  planModIntNames,
  planPolyHashNames,
  planIdentifierRenames,
  planSegmentTreeBeatsNames,
  planSegmentTreeNames,
  planSuffixArrayNames,
  renderBerlekampMasseyRecipe,
  renderBfsRecipe,
  renderCompressUnique,
  renderDsuRecipe,
  renderFenwickRecipe,
  renderFftNttRecipe,
  renderHungarianRecipe,
  renderHeaderContent,
  renderImplicitTreapRecipe,
  renderKuhnRecipe,
  renderLcaRecipe,
  renderLinearSieveRecipe,
  renderMaxflowDinicRecipe,
  renderMinCostMaxFlowRecipe,
  renderMergeSortTreeRecipe,
  renderModIntRecipe,
  renderPolyHashRecipe,
  renderReadVector,
  renderRecipeSnippet,
  renderRollbackDsuRecipe,
  renderSegmentTreeBeatsRecipe,
  renderSegmentTreeRecipe,
  renderSparseTableRecipe,
  renderSuffixArrayRecipe,
  renderTwoSatRecipe,
  reserveIdentifier,
  resolveCatalogOrder,
  RenderedSnippet,
  ReadVectorOptions,
  RollbackDsuOptions,
  SegmentDescendQuery,
  SegmentAggregate,
  SegmentTreeBeatsOptions,
  SegmentTreeBeatsQuery,
  SegmentTreeBeatsUpdate,
  SegmentTreeOptions,
  SegmentTreeOutputMode,
  SegmentUpdateOp,
  sizeExpressionCandidates,
  defaultSparseTableVariants,
  defaultImplicitTreapFeatures,
  suggestIdentifier,
  vectorContainerTypeForValueType,
  SnippetKind,
  SparseTableOptions,
  SparseTableVariant,
  planSparseTableNames,
  planRollbackDsuNames,
  SuffixArrayFeature,
  SuffixArrayInputKind,
  SuffixArrayOptions,
  PolyHashFeature,
  PolyHashInputKind,
  PolyHashOptions,
  TwoSatFeature,
  TwoSatOptions,
  planTwoSatNames
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

  const outputPick = await vscode.window.showQuickPick<
    ValuePickItem<SegmentTreeOutputMode>
  >(
    [
      { label: "recursive globals", value: "global_recursive", picked: true },
      { label: "iterative class", value: "iterative_class" }
    ],
    {
      title: "edulcni: segment tree",
      placeHolder: "Output shape",
      ignoreFocusOut: true
    }
  );
  if (!outputPick) {
    return undefined;
  }

  const aggregatePick = await vscode.window.showQuickPick<ValuePickItem<SegmentAggregate>>(
    outputPick.value === "iterative_class"
      ? [
          { label: "sum", value: "sum" },
          { label: "min", value: "min" },
          { label: "max", value: "max" }
        ]
      : [
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

  const updateItems: ValuePickItem<SegmentUpdateOp>[] =
    outputPick.value === "iterative_class"
      ? [
          { label: "point set", value: "point_set", picked: true },
          { label: "point add", value: "point_add" }
        ]
      : [
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
  let descends: SegmentDescendQuery[] = [];
  if (outputPick.value === "global_recursive" && aggregatePick.value === "min") {
    const descendPicks = await vscode.window.showQuickPick<
      ValuePickItem<SegmentDescendQuery>
    >(
      [{ label: "first <= target", value: "first_leq" }],
      {
        title: "edulcni: segment tree",
        placeHolder: "Descent queries to generate",
        canPickMany: true,
        ignoreFocusOut: true
      }
    );
    if (!descendPicks) {
      return undefined;
    }
    descends = descendPicks.map((item) => item.value);
  }

  if (aggregatePick.value !== "custom") {
    return {
      sizeExpression: sizeExpression.trim(),
      valueType: valueType.trim(),
      aggregate: aggregatePick.value,
      updates,
      descends,
      names,
      outputMode: outputPick.value
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
    outputMode: outputPick.value,
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

async function promptSegmentTreeBeatsOptions(
  editor: vscode.TextEditor
): Promise<SegmentTreeBeatsOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const valueType = await pickStringWithCustom(
    "edulcni: segtree_beats",
    "Value type",
    ["ll", "long long", "int"],
    "C++ value type"
  );
  if (valueType === undefined || valueType.trim() === "") {
    return undefined;
  }

  const updatePicks = await vscode.window.showQuickPick<
    ValuePickItem<SegmentTreeBeatsUpdate>
  >(
    [
      { label: "range chmin", value: "chmin", picked: true },
      { label: "range chmax", value: "chmax", picked: true },
      { label: "range add", value: "add", picked: true }
    ],
    {
      title: "edulcni: segtree_beats",
      placeHolder: "Update operations to generate",
      canPickMany: true,
      ignoreFocusOut: true
    }
  );
  if (!updatePicks) {
    return undefined;
  }

  const queryPicks = await vscode.window.showQuickPick<
    ValuePickItem<SegmentTreeBeatsQuery>
  >(
    [
      { label: "range sum", value: "sum", picked: true },
      { label: "range minimum", value: "min", picked: true },
      { label: "range maximum", value: "max", picked: true }
    ],
    {
      title: "edulcni: segtree_beats",
      placeHolder: "Query operations to generate",
      canPickMany: true,
      ignoreFocusOut: true
    }
  );
  if (!queryPicks) {
    return undefined;
  }

  return {
    valueType: valueType.trim(),
    updates: updatePicks.map((item) => item.value),
    queries: queryPicks.map((item) => item.value),
    names: planSegmentTreeBeatsNames(analysis),
    includeUsageComment: true
  };
}

async function promptImplicitTreapOptions(
  editor: vscode.TextEditor
): Promise<ImplicitTreapOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const valueType = await pickStringWithCustom(
    "edulcni: implicit_treap",
    "Value type",
    ["ll", "long long", "int"],
    "C++ value type"
  );
  if (valueType === undefined || valueType.trim() === "") {
    return undefined;
  }

  const aggregatePick = await vscode.window.showQuickPick<
    ValuePickItem<ImplicitTreapAggregate>
  >(
    [
      { label: "sum", value: "sum", picked: true },
      { label: "custom aggregate skeleton", value: "custom" }
    ],
    {
      title: "edulcni: implicit_treap",
      placeHolder: "Aggregate operation",
      ignoreFocusOut: true
    }
  );
  if (!aggregatePick) {
    return undefined;
  }

  const featurePicks = await vscode.window.showQuickPick<
    ValuePickItem<ImplicitTreapFeature>
  >(
    [
      { label: "range reverse", value: "reverse", picked: true },
      { label: "range add", value: "range_add" }
    ],
    {
      title: "edulcni: implicit_treap",
      placeHolder: "Lazy features to generate",
      canPickMany: true,
      ignoreFocusOut: true
    }
  );
  if (!featurePicks) {
    return undefined;
  }

  return {
    valueType: valueType.trim(),
    aggregate: aggregatePick.value,
    features: featurePicks.map((item) => item.value),
    names: planImplicitTreapNames(analysis),
    includeUsageComment: true
  };
}

async function promptMergeSortTreeOptions(
  editor: vscode.TextEditor
): Promise<MergeSortTreeOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const sourceName = await promptVectorName(
    "edulcni: merge_sort_tree",
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
    "edulcni: merge_sort_tree",
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

  const queryPicks = await vscode.window.showQuickPick<
    ValuePickItem<MergeSortTreeQuery>
  >(
    [
      { label: "count < x", value: "count_less", picked: true },
      { label: "count <= x", value: "count_less_equal" },
      { label: "count == x", value: "count_equal" },
      { label: "count in [low, high]", value: "count_in_range", picked: true },
      { label: "exists x", value: "exists" }
    ],
    {
      title: "edulcni: merge_sort_tree",
      placeHolder: "Query methods to generate",
      canPickMany: true,
      ignoreFocusOut: true
    }
  );
  if (!queryPicks) {
    return undefined;
  }

  return {
    valueType: valueType.trim(),
    sourceName: sourceName.trim(),
    queries:
      queryPicks.length === 0
        ? defaultMergeSortTreeQueries()
        : queryPicks.map((item) => item.value),
    names: planMergeSortTreeNames(analysis),
    includeUsageComment: true
  };
}

function defaultDsuOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): DsuOptions {
  return {
    names: planDsuNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

function defaultRollbackDsuOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): RollbackDsuOptions {
  return {
    names: planRollbackDsuNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

function defaultLcaOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): LcaOptions {
  return {
    names: planLcaNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

function defaultBfsOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): BfsOptions {
  return {
    names: planBfsNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

function defaultLinearSieveOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): LinearSieveOptions {
  return {
    features: defaultLinearSieveFeatures(),
    names: planLinearSieveNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

async function promptModIntOptions(
  editor: vscode.TextEditor
): Promise<ModIntOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const modePick = await vscode.window.showQuickPick<ValuePickItem<ModIntMode>>(
    [
      {
        label: "Static and dynamic",
        description: "Emit template and runtime-mod classes",
        value: "both",
        picked: true
      },
      {
        label: "Static only",
        description: "Emit template<class MOD>-style modint",
        value: "static"
      },
      {
        label: "Dynamic only",
        description: "Emit one runtime-mod class with set_mod",
        value: "dynamic"
      }
    ],
    {
      title: "edulcni: modint",
      placeHolder: "Modint variant",
      ignoreFocusOut: true
    }
  );
  if (!modePick) {
    return undefined;
  }

  let dynamicDefaultModExpression = "1000000007";
  if (modePick.value !== "static") {
    const providedMod = await vscode.window.showInputBox({
      title: "edulcni: modint",
      prompt: "Default runtime modulus",
      value: dynamicDefaultModExpression,
      ignoreFocusOut: true
    });
    if (providedMod === undefined) {
      return undefined;
    }
    dynamicDefaultModExpression = providedMod.trim() || dynamicDefaultModExpression;
  }

  return {
    ...defaultModIntOptions(analysis),
    mode: modePick.value,
    dynamicDefaultModExpression,
    names: planModIntNames(analysis),
    includeUsageComment: true
  };
}

function defaultImplicitTreapOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): ImplicitTreapOptions {
  return {
    valueType: "ll",
    aggregate: "sum",
    features: defaultImplicitTreapFeatures(),
    names: planImplicitTreapNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

function defaultSegmentTreeBeatsOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): SegmentTreeBeatsOptions {
  return {
    valueType: "ll",
    updates: defaultSegmentTreeBeatsUpdates(),
    queries: defaultSegmentTreeBeatsQueries(),
    names: planSegmentTreeBeatsNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

function defaultMergeSortTreeOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): MergeSortTreeOptions {
  const sourceName = analysis.vectorSymbols[0]?.name ?? "a";
  const sourceSymbol = analysis.vectorSymbols.find(
    (symbol) => symbol.name === sourceName
  );
  return {
    valueType: vectorValueType(sourceSymbol?.type) ?? "int",
    sourceName,
    queries: defaultMergeSortTreeQueries(),
    names: planMergeSortTreeNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

function defaultSuffixArrayOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): SuffixArrayOptions {
  return {
    inputKind: "string",
    sourceName: analysis.stringSymbols[0]?.name ?? "s",
    features: defaultSuffixArrayFeatures(),
    names: planSuffixArrayNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

function defaultFftNttOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): FftNttOptions {
  return {
    transforms: defaultFftNttTransforms(),
    includeConvolution: true,
    modulusExpression: "998244353",
    primitiveRootExpression: "3",
    names: planFftNttNames(analysis, extraReserved),
    includeUsageComment: true
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

function matrixValueType(type: string | undefined): string | undefined {
  if (!type) {
    return undefined;
  }
  const match = type
    .trim()
    .match(/^(?:std::)?vector\s*<\s*(?:std::)?vector\s*<(.+)>\s*>$/);
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

async function promptStringName(
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

async function promptSuffixArrayOptions(
  editor: vscode.TextEditor
): Promise<SuffixArrayOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const inputPick = await vscode.window.showQuickPick<
    ValuePickItem<SuffixArrayInputKind>
  >(
    [
      { label: "string", value: "string", picked: true },
      { label: "compressed int vector", value: "ints" },
      { label: "positive code vector", value: "positive_codes" }
    ],
    {
      title: "edulcni: suffix_array",
      placeHolder: "Source kind",
      ignoreFocusOut: true
    }
  );
  if (!inputPick) {
    return undefined;
  }

  let sourceName: string | undefined;
  if (inputPick.value === "string") {
    sourceName = await promptStringName(
      "edulcni: suffix_array",
      "Source string",
      analysis.stringSymbols,
      "Source string variable name"
    );
  } else {
    sourceName = await promptVectorName(
      "edulcni: suffix_array",
      inputPick.value === "ints"
        ? "Source int vector"
        : "Source positive-code vector",
      analysis.vectorSymbols,
      "Source vector variable name"
    );
  }
  if (sourceName === undefined || sourceName.trim() === "") {
    return undefined;
  }

  const featurePicks = await vscode.window.showQuickPick<
    ValuePickItem<SuffixArrayFeature>
  >(
    [
      { label: "strip empty suffix", value: "stripped_sa", picked: true },
      { label: "rank array", value: "rank", picked: true },
      { label: "lcp array", value: "lcp", picked: true },
      { label: "lcp range queries", value: "lcp_rmq" }
    ],
    {
      title: "edulcni: suffix_array",
      placeHolder: "Optional outputs",
      canPickMany: true,
      ignoreFocusOut: true
    }
  );
  if (!featurePicks) {
    return undefined;
  }

  return {
    inputKind: inputPick.value,
    sourceName: sourceName.trim(),
    features: featurePicks.map((item) => item.value),
    names: planSuffixArrayNames(analysis),
    includeUsageComment: true
  };
}

async function promptFftNttOptions(
  editor: vscode.TextEditor
): Promise<FftNttOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const transformPicks = await vscode.window.showQuickPick<
    ValuePickItem<FftNttTransform>
  >(
    [
      { label: "complex FFT", value: "fft", picked: true },
      { label: "modular NTT", value: "ntt", picked: true }
    ],
    {
      title: "edulcni: fft_ntt",
      placeHolder: "Transforms to generate",
      canPickMany: true,
      ignoreFocusOut: true
    }
  );
  if (!transformPicks) {
    return undefined;
  }
  const transforms =
    transformPicks.length === 0
      ? defaultFftNttTransforms()
      : transformPicks.map((item) => item.value);

  const helperPick = await vscode.window.showQuickPick<
    ValuePickItem<"convolution" | "transform">
  >(
    [
      { label: "transform + convolution wrappers", value: "convolution", picked: true },
      { label: "transform only", value: "transform" }
    ],
    {
      title: "edulcni: fft_ntt",
      placeHolder: "Helper surface",
      ignoreFocusOut: true
    }
  );
  if (!helperPick) {
    return undefined;
  }

  let modulusExpression = "998244353";
  let primitiveRootExpression = "3";
  if (transforms.includes("ntt")) {
    const constantNames = analysis.constantSymbols.map((symbol) => symbol.name);
    const modulus = await pickStringWithCustom(
      "edulcni: fft_ntt",
      "NTT modulus expression",
      uniqueValues([...constantNames, "FFT_MOD", "MOD", "998244353"]),
      "NTT modulus expression"
    );
    if (modulus === undefined || modulus.trim() === "") {
      return undefined;
    }
    const primitiveRoot = await pickStringWithCustom(
      "edulcni: fft_ntt",
      "NTT primitive root expression",
      uniqueValues(["3", "FFT_ROOT", "ROOT", ...constantNames]),
      "NTT primitive root expression"
    );
    if (primitiveRoot === undefined || primitiveRoot.trim() === "") {
      return undefined;
    }
    modulusExpression = modulus.trim();
    primitiveRootExpression = primitiveRoot.trim();
  }

  return {
    transforms,
    includeConvolution: helperPick.value === "convolution",
    modulusExpression,
    primitiveRootExpression,
    names: planFftNttNames(analysis),
    includeUsageComment: true
  };
}

async function promptPolyHashOptions(
  editor: vscode.TextEditor
): Promise<PolyHashOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const inputPick = await vscode.window.showQuickPick<
    ValuePickItem<PolyHashInputKind>
  >(
    [
      { label: "string", value: "string", picked: true },
      { label: "vector<int>", value: "vector_int" }
    ],
    {
      title: "edulcni: poly_hash",
      placeHolder: "Source kind",
      ignoreFocusOut: true
    }
  );
  if (!inputPick) {
    return undefined;
  }

  let sourceName: string | undefined;
  if (inputPick.value === "string") {
    sourceName = await promptStringName(
      "edulcni: poly_hash",
      "Source string",
      analysis.stringSymbols,
      "Source string variable name"
    );
  } else {
    sourceName = await promptVectorName(
      "edulcni: poly_hash",
      "Source int vector",
      analysis.vectorSymbols,
      "Source vector variable name"
    );
  }
  if (sourceName === undefined || sourceName.trim() === "") {
    return undefined;
  }

  const featurePicks = await vscode.window.showQuickPick<
    ValuePickItem<PolyHashFeature>
  >(
    [
      { label: "substring equality", value: "substring_equal", picked: true },
      { label: "combine hashes", value: "concat", picked: true },
      { label: "reverse/palindrome queries", value: "reverse" },
      { label: "lcp by binary search", value: "lcp" }
    ],
    {
      title: "edulcni: poly_hash",
      placeHolder: "Optional helpers",
      canPickMany: true,
      ignoreFocusOut: true
    }
  );
  if (!featurePicks) {
    return undefined;
  }

  const constantsPick = await vscode.window.showQuickPick<
    ValuePickItem<"default" | "custom">
  >(
    [
      { label: "current constants", value: "default", picked: true },
      { label: "custom expressions", value: "custom" }
    ],
    {
      title: "edulcni: poly_hash",
      placeHolder: "Mod/base constants",
      ignoreFocusOut: true
    }
  );
  if (!constantsPick) {
    return undefined;
  }

  let mod1Expression = "1000000007";
  let mod2Expression = "1000000009";
  let baseExpression = "911382323";
  if (constantsPick.value === "custom") {
    const constantNames = analysis.constantSymbols.map((symbol) => symbol.name);
    const mod1 = await pickStringWithCustom(
      "edulcni: poly_hash",
      "First modulus expression",
      uniqueValues([...constantNames, "1000000007"]),
      "First modulus expression"
    );
    if (mod1 === undefined || mod1.trim() === "") {
      return undefined;
    }
    const mod2 = await pickStringWithCustom(
      "edulcni: poly_hash",
      "Second modulus expression",
      uniqueValues([...constantNames, "1000000009"]),
      "Second modulus expression"
    );
    if (mod2 === undefined || mod2.trim() === "") {
      return undefined;
    }
    const base = await pickStringWithCustom(
      "edulcni: poly_hash",
      "Base expression",
      uniqueValues([...constantNames, "911382323"]),
      "Base expression"
    );
    if (base === undefined || base.trim() === "") {
      return undefined;
    }
    mod1Expression = mod1.trim();
    mod2Expression = mod2.trim();
    baseExpression = base.trim();
  }

  return {
    inputKind: inputPick.value,
    sourceName: sourceName.trim(),
    mod1Expression,
    mod2Expression,
    baseExpression,
    features: featurePicks.map((item) => item.value),
    names: planPolyHashNames(analysis),
    includeUsageComment: true
  };
}

async function promptMaxflowDinicOptions(
  editor: vscode.TextEditor
): Promise<MaxflowDinicOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const defaultCapType = defaultMaxflowDinicCapType(analysis);
  const capType = await pickStringWithCustom(
    "edulcni: maxflow_dinic",
    "Capacity type",
    uniqueValues([defaultCapType, "long long", "ll", "int"]),
    "C++ capacity type"
  );
  if (capType === undefined || capType.trim() === "") {
    return undefined;
  }

  const featurePicks = await vscode.window.showQuickPick<
    ValuePickItem<MaxflowDinicFeature>
  >(
    [
      { label: "min-cut side", value: "min_cut", picked: true },
      { label: "graph/edge access", value: "graph_access", picked: true },
      { label: "reset flows", value: "reset_flows", picked: true }
    ],
    {
      title: "edulcni: maxflow_dinic",
      placeHolder: "Optional methods",
      canPickMany: true,
      ignoreFocusOut: true
    }
  );
  if (!featurePicks) {
    return undefined;
  }

  const inputPick = await vscode.window.showQuickPick<
    ValuePickItem<"helper" | "read_call">
  >(
    [
      { label: "helper only", value: "helper", picked: true },
      { label: "read directed edges and call maxflow", value: "read_call" }
    ],
    {
      title: "edulcni: maxflow_dinic",
      placeHolder: "Generated sections",
      ignoreFocusOut: true
    }
  );
  if (!inputPick) {
    return undefined;
  }

  return {
    capType: capType.trim(),
    features:
      featurePicks.length === 0
        ? defaultMaxflowDinicFeatures()
        : featurePicks.map((item) => item.value),
    generateInput: inputPick.value === "read_call",
    names: planMaxflowDinicNames(analysis),
    nodeCountName: suggestIdentifier(analysis, "n", "flow_n"),
    edgeCountName: suggestIdentifier(analysis, "m", "flow_m"),
    sourceName: suggestIdentifier(analysis, "s", "source"),
    sinkName: suggestIdentifier(analysis, "t", "sink"),
    fromName: suggestIdentifier(analysis, "u", "from"),
    toName: suggestIdentifier(analysis, "v", "to"),
    edgeCapName: suggestIdentifier(analysis, "cap", "edge_cap"),
    includeUsageComment: true
  };
}

async function promptMinCostMaxFlowOptions(
  editor: vscode.TextEditor
): Promise<MinCostMaxFlowOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const defaults = defaultMinCostMaxFlowOptions(analysis);
  const defaultCapType = defaultMinCostMaxFlowCapType(analysis);
  const capType = await pickStringWithCustom(
    "edulcni: mincost_maxflow",
    "Capacity type",
    uniqueValues([defaultCapType, "long long", "ll", "int"]),
    "C++ capacity type"
  );
  if (capType === undefined || capType.trim() === "") {
    return undefined;
  }

  const defaultCostType = defaultMinCostMaxFlowCostType(analysis);
  const costType = await pickStringWithCustom(
    "edulcni: mincost_maxflow",
    "Cost type",
    uniqueValues([defaultCostType, "long long", "ll", "int"]),
    "C++ cost type"
  );
  if (costType === undefined || costType.trim() === "") {
    return undefined;
  }

  const featurePicks = await vscode.window.showQuickPick<
    ValuePickItem<MinCostMaxFlowFeature>
  >(
    [
      { label: "graph/edge access", value: "graph_access", picked: true },
      { label: "potential access", value: "potential_access", picked: true }
    ],
    {
      title: "edulcni: mincost_maxflow",
      placeHolder: "Optional methods",
      canPickMany: true,
      ignoreFocusOut: true
    }
  );
  if (!featurePicks) {
    return undefined;
  }

  const modePick = await vscode.window.showQuickPick<
    ValuePickItem<MinCostMaxFlowMode>
  >(
    [
      { label: "min-cost max-flow", value: "max_flow", picked: true },
      { label: "fixed flow amount", value: "fixed_flow" }
    ],
    {
      title: "edulcni: mincost_maxflow",
      placeHolder: "Target flow mode",
      ignoreFocusOut: true
    }
  );
  if (!modePick) {
    return undefined;
  }

  const inputPick = await vscode.window.showQuickPick<
    ValuePickItem<"helper" | "read_call">
  >(
    [
      { label: "helper only", value: "helper", picked: true },
      { label: "read directed edges and call min-cost flow", value: "read_call" }
    ],
    {
      title: "edulcni: mincost_maxflow",
      placeHolder: "Generated sections",
      ignoreFocusOut: true
    }
  );
  if (!inputPick) {
    return undefined;
  }

  return {
    ...defaults,
    capType: capType.trim(),
    costType: costType.trim(),
    features: featurePicks.map((item) => item.value),
    generateInput: inputPick.value === "read_call",
    mode: modePick.value,
    names: planMinCostMaxFlowNames(analysis),
    includeUsageComment: true
  };
}

async function promptHungarianOptions(
  editor: vscode.TextEditor
): Promise<HungarianOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const defaults = defaultHungarianOptions(analysis);
  const matrixSymbols = analysis.vectorSymbols.filter((symbol) =>
    matrixValueType(symbol.type)
  );

  const sourceMode = await vscode.window.showQuickPick<
    ValuePickItem<"existing" | "read">
  >(
    [
      { label: "use existing matrix", value: "existing", picked: true },
      { label: "read cost matrix in solve", value: "read" }
    ],
    {
      title: "edulcni: hungarian",
      placeHolder: "Matrix source",
      ignoreFocusOut: true
    }
  );
  if (!sourceMode) {
    return undefined;
  }

  let sourceName = defaults.sourceName;
  let inferredCostType: string | undefined;
  if (sourceMode.value === "existing") {
    const pickedSource = await promptVectorName(
      "edulcni: hungarian",
      "Cost matrix",
      matrixSymbols,
      "Cost matrix variable name"
    );
    if (pickedSource === undefined || pickedSource.trim() === "") {
      return undefined;
    }
    sourceName = pickedSource.trim();
    const sourceSymbol = matrixSymbols.find(
      (symbol) => symbol.name === sourceName
    );
    inferredCostType = matrixValueType(sourceSymbol?.type);
  }

  const costType = await pickStringWithCustom(
    "edulcni: hungarian",
    "Cost type",
    uniqueValues([
      inferredCostType ?? "",
      defaultHungarianCostType(analysis),
      "long long",
      "ll",
      "int"
    ]),
    "C++ cost type"
  );
  if (costType === undefined || costType.trim() === "") {
    return undefined;
  }

  const modePick = await vscode.window.showQuickPick<ValuePickItem<HungarianMode>>(
    [
      { label: "minimize cost", value: "minimize", picked: true },
      { label: "maximize value", value: "maximize" }
    ],
    {
      title: "edulcni: hungarian",
      placeHolder: "Optimization mode",
      ignoreFocusOut: true
    }
  );
  if (!modePick) {
    return undefined;
  }

  const rectangularPick = await vscode.window.showQuickPick<
    ValuePickItem<"rectangular" | "square">
  >(
    [
      { label: "rectangular matrices", value: "rectangular", picked: true },
      { label: "rows <= columns only", value: "square" }
    ],
    {
      title: "edulcni: hungarian",
      placeHolder: "Matrix shape support",
      ignoreFocusOut: true
    }
  );
  if (!rectangularPick) {
    return undefined;
  }

  return {
    ...defaults,
    costType: costType.trim(),
    sourceName,
    mode: modePick.value,
    rectangular: rectangularPick.value === "rectangular",
    generateInput: sourceMode.value === "read",
    names: planHungarianNames(analysis),
    includeUsageComment: true
  };
}

async function promptKuhnOptions(
  editor: vscode.TextEditor
): Promise<KuhnOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const defaults = defaultKuhnOptions(analysis);

  const featurePicks = await vscode.window.showQuickPick<
    ValuePickItem<KuhnFeature>
  >(
    [
      { label: "minimum vertex cover", value: "vertex_cover", picked: true }
    ],
    {
      title: "edulcni: kuhn",
      placeHolder: "Optional helpers",
      canPickMany: true,
      ignoreFocusOut: true
    }
  );
  if (!featurePicks) {
    return undefined;
  }

  const inputPick = await vscode.window.showQuickPick<
    ValuePickItem<"helper" | "read_call">
  >(
    [
      { label: "helper only", value: "helper", picked: true },
      { label: "read bipartite edges and call matching", value: "read_call" }
    ],
    {
      title: "edulcni: kuhn",
      placeHolder: "Generated sections",
      ignoreFocusOut: true
    }
  );
  if (!inputPick) {
    return undefined;
  }

  let decrementInput = defaults.decrementInput;
  if (inputPick.value === "read_call") {
    const indexingPick = await vscode.window.showQuickPick<
      ValuePickItem<"one_based" | "zero_based">
    >(
      [
        { label: "1-based input edges", value: "one_based", picked: true },
        { label: "0-based input edges", value: "zero_based" }
      ],
      {
        title: "edulcni: kuhn",
        placeHolder: "Input indexing",
        ignoreFocusOut: true
      }
    );
    if (!indexingPick) {
      return undefined;
    }
    decrementInput = indexingPick.value === "one_based";
  }

  return {
    ...defaults,
    features: featurePicks.map((item) => item.value),
    generateInput: inputPick.value === "read_call",
    decrementInput,
    names: planKuhnNames(analysis),
    leftCountName: suggestIdentifier(analysis, "n", "left_n"),
    rightCountName: suggestIdentifier(analysis, "m", "right_n"),
    edgeCountName: suggestIdentifier(analysis, "e", "edge_count"),
    leftVertexName: suggestIdentifier(analysis, "u", "left"),
    rightVertexName: suggestIdentifier(analysis, "v", "right"),
    instanceName: suggestIdentifier(analysis, "matcher", "kuhn_matcher"),
    resultName: suggestIdentifier(analysis, "matching", "kuhn_matching"),
    coverName: suggestIdentifier(analysis, "vertex_cover", "kuhn_vertex_cover"),
    includeUsageComment: true
  };
}

async function promptTwoSatOptions(
  editor: vscode.TextEditor
): Promise<TwoSatOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const featurePicks = await vscode.window.showQuickPick<
    ValuePickItem<TwoSatFeature>
  >(
    [
      { label: "xor helper", value: "xor" },
      { label: "equivalence helper", value: "equal" },
      { label: "force true/false helpers", value: "force" },
      { label: "at-most-one helper", value: "at_most_one" },
      { label: "component accessor", value: "components" }
    ],
    {
      title: "edulcni: twosat",
      placeHolder: "Optional helpers",
      canPickMany: true,
      ignoreFocusOut: true
    }
  );
  if (!featurePicks) {
    return undefined;
  }

  return {
    ...defaultTwoSatOptions(analysis),
    features:
      featurePicks.length === 0
        ? defaultTwoSatFeatures()
        : featurePicks.map((item) => item.value),
    names: planTwoSatNames(analysis),
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
    "segtree_beats",
    {
      catalogEntry: {
        path: "/solvers/segtree_beats",
        kind: "solver",
        insertMode: "global",
        generator: "segtree_beats",
        label: "/solvers/segtree_beats",
        description: "dynamic segment tree beats helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptSegmentTreeBeatsOptions(editor);
        return options
          ? renderRecipeSnippet(renderSegmentTreeBeatsRecipe(options))
          : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderSegmentTreeBeatsRecipe(
            defaultSegmentTreeBeatsOptions(analysis, extraReserved)
          )
        );
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
    "dsu",
    {
      catalogEntry: {
        path: "/solvers/dsu",
        kind: "solver",
        insertMode: "global",
        generator: "dsu",
        label: "/solvers/dsu",
        description: "dynamic disjoint set union helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const analysis = analyzeCppDocument(editor.document.getText());
        return renderRecipeSnippet(renderDsuRecipe(defaultDsuOptions(analysis)));
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderDsuRecipe(defaultDsuOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "rollback_dsu",
    {
      catalogEntry: {
        path: "/solvers/rollback_dsu",
        kind: "solver",
        insertMode: "global",
        generator: "rollback_dsu",
        label: "/solvers/rollback_dsu",
        description: "dynamic rollback disjoint set union helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const analysis = analyzeCppDocument(editor.document.getText());
        return renderRecipeSnippet(
          renderRollbackDsuRecipe(defaultRollbackDsuOptions(analysis))
        );
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderRollbackDsuRecipe(
            defaultRollbackDsuOptions(analysis, extraReserved)
          )
        );
      }
    }
  ],
  [
    "lca",
    {
      catalogEntry: {
        path: "/solvers/lca",
        kind: "solver",
        insertMode: "global",
        generator: "lca",
        label: "/solvers/lca",
        description: "dynamic binary lifting LCA helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const analysis = analyzeCppDocument(editor.document.getText());
        return renderRecipeSnippet(renderLcaRecipe(defaultLcaOptions(analysis)));
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderLcaRecipe(defaultLcaOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "bfs",
    {
      catalogEntry: {
        path: "/solvers/bfs",
        kind: "solver",
        insertMode: "global",
        generator: "bfs",
        label: "/solvers/bfs",
        description: "dynamic BFS graph traversal helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const analysis = analyzeCppDocument(editor.document.getText());
        return renderRecipeSnippet(renderBfsRecipe(defaultBfsOptions(analysis)));
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderBfsRecipe(defaultBfsOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "linear_sieve",
    {
      catalogEntry: {
        path: "/solvers/linear_sieve",
        kind: "solver",
        insertMode: "global",
        generator: "linear_sieve",
        label: "/solvers/linear_sieve",
        description: "dynamic linear sieve helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const analysis = analyzeCppDocument(editor.document.getText());
        return renderRecipeSnippet(
          renderLinearSieveRecipe(defaultLinearSieveOptions(analysis))
        );
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderLinearSieveRecipe(
            defaultLinearSieveOptions(analysis, extraReserved)
          )
        );
      }
    }
  ],
  [
    "fenwick",
    {
      catalogEntry: {
        path: "/solvers/fenwick",
        kind: "solver",
        insertMode: "global",
        generator: "fenwick",
        label: "/solvers/fenwick",
        description: "dynamic Fenwick tree helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const analysis = analyzeCppDocument(editor.document.getText());
        return renderRecipeSnippet(renderFenwickRecipe(defaultFenwickOptions(analysis)));
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderFenwickRecipe(defaultFenwickOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "modint",
    {
      catalogEntry: {
        path: "/solvers/modint",
        kind: "solver",
        insertMode: "global",
        generator: "modint",
        label: "/solvers/modint",
        description: "dynamic modular integer helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptModIntOptions(editor);
        return options ? renderRecipeSnippet(renderModIntRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderModIntRecipe(defaultModIntOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "twosat",
    {
      catalogEntry: {
        path: "/solvers/twosat",
        kind: "solver",
        insertMode: "global",
        generator: "twosat",
        label: "/solvers/twosat",
        description: "dynamic 2-SAT helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptTwoSatOptions(editor);
        return options ? renderRecipeSnippet(renderTwoSatRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderTwoSatRecipe(defaultTwoSatOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "maxflow_dinic",
    {
      catalogEntry: {
        path: "/solvers/maxflow_dinic",
        kind: "solver",
        insertMode: "global",
        generator: "maxflow_dinic",
        label: "/solvers/maxflow_dinic",
        description: "dynamic Dinic maxflow helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptMaxflowDinicOptions(editor);
        return options
          ? renderRecipeSnippet(renderMaxflowDinicRecipe(options))
          : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderMaxflowDinicRecipe({
            capType: defaultMaxflowDinicCapType(analysis),
            features: defaultMaxflowDinicFeatures(),
            generateInput: false,
            names: planMaxflowDinicNames(analysis, extraReserved),
            nodeCountName: suggestIdentifier(analysis, "n", "flow_n"),
            edgeCountName: suggestIdentifier(analysis, "m", "flow_m"),
            sourceName: suggestIdentifier(analysis, "s", "source"),
            sinkName: suggestIdentifier(analysis, "t", "sink"),
            fromName: suggestIdentifier(analysis, "u", "from"),
            toName: suggestIdentifier(analysis, "v", "to"),
            edgeCapName: suggestIdentifier(analysis, "cap", "edge_cap"),
            includeUsageComment: true
          })
        );
      }
    }
  ],
  [
    "mincost_maxflow",
    {
      catalogEntry: {
        path: "/solvers/mincost_maxflow",
        kind: "solver",
        insertMode: "global",
        generator: "mincost_maxflow",
        label: "/solvers/mincost_maxflow",
        description: "dynamic min-cost max-flow helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptMinCostMaxFlowOptions(editor);
        return options
          ? renderRecipeSnippet(renderMinCostMaxFlowRecipe(options))
          : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderMinCostMaxFlowRecipe(
            defaultMinCostMaxFlowOptions(analysis, extraReserved)
          )
        );
      }
    }
  ],
  [
    "hungarian",
    {
      catalogEntry: {
        path: "/solvers/hungarian",
        kind: "solver",
        insertMode: "global",
        generator: "hungarian",
        label: "/solvers/hungarian",
        description: "dynamic Hungarian assignment helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptHungarianOptions(editor);
        return options ? renderRecipeSnippet(renderHungarianRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderHungarianRecipe(defaultHungarianOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "kuhn",
    {
      catalogEntry: {
        path: "/solvers/kuhn",
        kind: "solver",
        insertMode: "global",
        generator: "kuhn",
        label: "/solvers/kuhn",
        description: "dynamic Kuhn bipartite matching helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptKuhnOptions(editor);
        return options ? renderRecipeSnippet(renderKuhnRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderKuhnRecipe(defaultKuhnOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "implicit_treap",
    {
      catalogEntry: {
        path: "/solvers/implicit_treap",
        kind: "solver",
        insertMode: "global",
        generator: "implicit_treap",
        label: "/solvers/implicit_treap",
        description: "dynamic implicit treap helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptImplicitTreapOptions(editor);
        return options
          ? renderRecipeSnippet(renderImplicitTreapRecipe(options))
          : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderImplicitTreapRecipe(
            defaultImplicitTreapOptions(analysis, extraReserved)
          )
        );
      }
    }
  ],
  [
    "merge_sort_tree",
    {
      catalogEntry: {
        path: "/solvers/merge_sort_tree",
        kind: "solver",
        insertMode: "global",
        generator: "merge_sort_tree",
        label: "/solvers/merge_sort_tree",
        description: "dynamic merge-sort tree helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptMergeSortTreeOptions(editor);
        return options
          ? renderRecipeSnippet(renderMergeSortTreeRecipe(options))
          : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderMergeSortTreeRecipe(
            defaultMergeSortTreeOptions(analysis, extraReserved)
          )
        );
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
    "suffix_array",
    {
      catalogEntry: {
        path: "/solvers/suffix_array",
        kind: "solver",
        insertMode: "global",
        generator: "suffix_array",
        label: "/solvers/suffix_array",
        description: "dynamic suffix-array helper generator",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptSuffixArrayOptions(editor);
        return options ? renderRecipeSnippet(renderSuffixArrayRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderSuffixArrayRecipe(defaultSuffixArrayOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "poly_hash",
    {
      catalogEntry: {
        path: "/solvers/poly_hash",
        kind: "solver",
        insertMode: "global",
        generator: "poly_hash",
        label: "/solvers/poly_hash",
        description: "dynamic polynomial rolling hash helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptPolyHashOptions(editor);
        return options ? renderRecipeSnippet(renderPolyHashRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderPolyHashRecipe(defaultPolyHashOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "fft_ntt",
    {
      catalogEntry: {
        path: "/solvers/fft_ntt",
        kind: "solver",
        insertMode: "global",
        generator: "fft_ntt",
        label: "/solvers/fft_ntt",
        description: "dynamic FFT/NTT convolution helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptFftNttOptions(editor);
        return options ? renderRecipeSnippet(renderFftNttRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderFftNttRecipe(defaultFftNttOptions(analysis, extraReserved))
        );
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

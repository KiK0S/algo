import * as vscode from "vscode";
import {
  analyzeCppDocument,
  applyIdentifierRenames,
  BerlekampMasseyFeature,
  BerlekampMasseyOptions,
  bindingCandidates,
  BFS_APPLICATION_SPEC,
  BfsApplication,
  BfsGraphMode,
  BfsIndexing,
  BfsOptions,
  BfsSourceMode,
  BfsUsageMode,
  CatalogEntry,
  composeRecipeSections,
  CompressUniqueOptions,
  CppAnalysis,
  defaultBerlekampMasseyFeatures,
  defaultInsertModeForKind,
  defaultMaxflowDinicCapType,
  defaultMaxflowDinicFeatures,
  defaultMinCostMaxFlowCapType,
  defaultMinCostMaxFlowCostType,
  defaultMinCostMaxFlowFeatures,
  defaultMinCostMaxFlowOptions,
  defaultFenwickOptions,
  FENWICK_APPLICATION_SPEC,
  SEGMENT_TREE_BEATS_APPLICATION_SPEC,
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
  DIJKSTRA_APPLICATION_SPEC,
  DSU_APPLICATION_SPEC,
  DijkstraApplication,
  DijkstraGraphMode,
  DijkstraIndexing,
  DijkstraOptions,
  DijkstraSourceMode,
  DijkstraUsageMode,
  DsuApplication,
  DsuIndexing,
  DsuOptions,
  DsuUsageMode,
  FAST_ALLOCATOR_APPLICATION_SPEC,
  FastAllocatorApplication,
  FastAllocatorOptions,
  FastAllocatorUsageMode,
  GEOMETRY_APPLICATION_SPEC,
  GeometryApplication,
  GeometryOptions,
  GeometryUsageMode,
  HALFPLANE_INTERSECTION_APPLICATION_SPEC,
  HalfplaneIntersectionApplication,
  HalfplaneIntersectionOptions,
  HalfplaneIntersectionUsageMode,
  defaultMergeSortTreeQueries,
  MERGE_SORT_TREE_APPLICATION_SPEC,
  defaultSuffixArrayFeatures,
  findGlobalInsertionOffset,
  FenwickApplication,
  FenwickIndexing,
  FenwickOperation,
  FenwickSourceMode,
  FenwickUsageMode,
  FftNttOptions,
  FftNttTransform,
  GP_HASH_TABLE_APPLICATION_SPEC,
  GpHashTableApplication,
  GpHashTableOptions,
  GpHashTableUsageMode,
  HungarianMode,
  HungarianOptions,
  HLD_APPLICATION_SPEC,
  HldApplication,
  HldIndexing,
  HldOptions,
  HldSourceMode,
  HldUsageMode,
  HldValueMode,
  IdentifierRename,
  IMPLICIT_TREAP_APPLICATION_SPEC,
  ImplicitTreapAggregate,
  ImplicitTreapApplication,
  ImplicitTreapFeature,
  ImplicitTreapSourceMode,
  ImplicitTreapOptions,
  ImplicitTreapUsageMode,
  InsertMode,
  KuhnFeature,
  KuhnOptions,
  KOSARAJU_APPLICATION_SPEC,
  KosarajuApplication,
  KosarajuIndexing,
  KosarajuOptions,
  KosarajuSourceMode,
  KosarajuUsageMode,
  LCA_APPLICATION_SPEC,
  LcaApplication,
  LcaIndexing,
  LinearSieveOptions,
  LcaOptions,
  LcaSourceMode,
  LcaUsageMode,
  MaxflowDinicFeature,
  MaxflowDinicOptions,
  MinCostMaxFlowFeature,
  MinCostMaxFlowMode,
  MinCostMaxFlowOptions,
  MO_APPLICATION_SPEC,
  ModIntMode,
  ModIntOptions,
  MoApplication,
  MoIndexing,
  MoOptions,
  MoSourceMode,
  MoUsageMode,
  MONOTONIC_STACK_APPLICATION_SPEC,
  MonotonicStackApplication,
  MonotonicStackDirection,
  MonotonicStackOptions,
  MonotonicStackRelation,
  MonotonicStackStrictness,
  MonotonicStackUsageMode,
  MergeSortTreeApplication,
  MergeSortTreeOptions,
  MergeSortTreeQuery,
  MergeSortTreeSourceMode,
  MergeSortTreeUsageMode,
  normalizeInsertionText,
  ORDERED_SET_APPLICATION_SPEC,
  OrderedSetApplication,
  OrderedSetOptions,
  OrderedSetUsageMode,
  SET_UTILS_APPLICATION_SPEC,
  SetUtilsApplication,
  SetUtilsLookup,
  SetUtilsOptions,
  SetUtilsTarget,
  SetUtilsUsageMode,
  planBerlekampMasseyNames,
  planBfsNames,
  planDijkstraNames,
  planDsuNames,
  planFastAllocatorNames,
  planFenwickNames,
  planFftNttNames,
  planGpHashTableNames,
  planHldNames,
  planHungarianNames,
  planImplicitTreapNames,
  planKosarajuNames,
  planKuhnNames,
  planLcaNames,
  planLinearSieveNames,
  planMaxflowDinicNames,
  planMinCostMaxFlowNames,
  planMergeSortTreeNames,
  planMoNames,
  planModIntNames,
  planMonotonicStackNames,
  planOrderedSetNames,
  planPolyHashNames,
  planIdentifierRenames,
  planSegmentTreeBeatsNames,
  planSegmentTreeNames,
  planSetUtilsNames,
  planSuffixArrayNames,
  planToposortNames,
  renderBerlekampMasseyRecipe,
  renderBfsRecipe,
  renderCompressUnique,
  renderDijkstraRecipe,
  renderDsuRecipe,
  renderFastAllocatorRecipe,
  renderFenwickRecipe,
  renderGeometryRecipe,
  renderHalfplaneIntersectionRecipe,
  renderFftNttRecipe,
  renderGpHashTableRecipe,
  renderHungarianRecipe,
  renderHldRecipe,
  renderImplicitTreapRecipe,
  renderKosarajuRecipe,
  renderKuhnRecipe,
  renderLcaRecipe,
  renderLinearSieveRecipe,
  renderMaxflowDinicRecipe,
  renderMinCostMaxFlowRecipe,
  renderMergeSortTreeRecipe,
  renderMoRecipe,
  renderModIntRecipe,
  renderMonotonicStackRecipe,
  renderOrderedSetRecipe,
  renderPolyHashRecipe,
  renderReadVector,
  renderRecipeSnippet,
  renderStaticTemplate,
  renderRollbackDsuRecipe,
  renderSegmentTreeBeatsRecipe,
  renderSegmentTreeRecipe,
  renderSetUtilsRecipe,
  SEGMENT_TREE_APPLICATION_SPEC,
  renderSparseTableRecipe,
  renderSuffixArrayRecipe,
  renderToposortRecipe,
  renderTwoSatRecipe,
  reserveIdentifier,
  resolveCatalogOrder,
  RenderedSnippet,
  ReadVectorOptions,
  ROLLBACK_DSU_APPLICATION_SPEC,
  RollbackDsuApplication,
  RollbackDsuIndexing,
  RollbackDsuOptions,
  RollbackDsuUsageMode,
  SegmentDescendQuery,
  SegmentAggregate,
  SegmentTreeApplication,
  SegmentTreeBeatsApplication,
  SegmentTreeBeatsOptions,
  SegmentTreeBeatsQuery,
  SegmentTreeBeatsSourceMode,
  SegmentTreeBeatsUpdate,
  SegmentTreeBeatsUsageMode,
  SegmentTreeOptions,
  SegmentTreeOutputMode,
  SegmentTreeSourceMode,
  SegmentTreeUsageMode,
  SegmentUpdateOp,
  SPARSE_TABLE_APPLICATION_SPEC,
  sizeExpressionCandidates,
  defaultSparseTableVariants,
  defaultImplicitTreapFeatures,
  suggestIdentifier,
  vectorContainerTypeForValueType,
  SnippetKind,
  SolutionSection,
  SparseTableOptions,
  SparseTableApplication,
  SparseTableSourceMode,
  SparseTableUsageMode,
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
  TOPOSORT_APPLICATION_SPEC,
  ToposortApplication,
  ToposortIndexing,
  ToposortOptions,
  ToposortSourceMode,
  ToposortUsageMode,
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

function buildPickItems(catalogEntries: CatalogEntry[]): SnippetPickItem[] {
  const items: SnippetPickItem[] = [];
  for (const entry of catalogEntries) {
    if (!isCatalogSnippetPath(entry.path)) {
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
    if (!entry?.template) {
      throw new Error(`catalog entry has no generator or template: ${currentPath}`);
    }
    const rendered = renderStaticTemplate(entry.template, entry.kind);
    chunks.push(rendered.content.trim());
    exportedNames.push(...(entry.exports ?? rendered.exports));
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

function recipeSectionsExceptSolve(): SolutionSection[] {
  return [
    "includes",
    "defines",
    "constants",
    "data",
    "helpers",
    "main"
  ];
}

function solveBodyInsertionOffset(documentText: string, analysis: CppAnalysis): number | undefined {
  const solveSpan = analysis.sections.find((span) => span.section === "solve");
  if (!solveSpan) {
    return undefined;
  }
  const solveText = documentText.slice(solveSpan.start, solveSpan.end);
  const closeOffset = solveText.lastIndexOf("}");
  if (closeOffset === -1) {
    return undefined;
  }
  return solveSpan.start + closeOffset;
}

async function insertRenderedSnippet(
  editor: vscode.TextEditor,
  insertMode: InsertMode,
  snippet: RenderedSnippet
): Promise<boolean> {
  const recipe = snippet.recipe;
  const solveChunks = recipe?.sections.solve ?? [];
  if (!recipe || solveChunks.length === 0) {
    return insertContent(editor, insertMode, snippet.content);
  }

  const documentText = editor.document.getText();
  const analysis = analyzeCppDocument(documentText);
  const helperContent = composeRecipeSections(recipe, recipeSectionsExceptSolve());
  const usageContent = `${solveChunks.map((chunk) => chunk.trim()).filter(Boolean).join("\n\n")}\n`;
  const globalOffset = findGlobalInsertionOffset(documentText);
  const solveOffset = solveBodyInsertionOffset(documentText, analysis);

  return editor.edit((editBuilder) => {
    if (helperContent.trim() !== "") {
      editBuilder.insert(
        positionAtOffset(editor, globalOffset),
        normalizeInsertionText(documentText, globalOffset, helperContent)
      );
    }

    const usagePosition =
      solveOffset === undefined
        ? editor.selection.active
        : positionAtOffset(editor, solveOffset);
    const usageText =
      solveOffset === undefined
        ? usageContent
        : `\n${usageContent
            .split("\n")
            .filter((line) => line.length > 0)
            .map((line) => `  ${line}`)
            .join("\n")}\n`;
    editBuilder.insert(usagePosition, usageText);
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
): Promise<RenderedSnippet | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<
    ValuePickItem<SegmentTreeApplication>
  >(
    SEGMENT_TREE_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as SegmentTreeApplication
    })),
    {
      title: "edulcni: segment tree",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  if (scenarioPick.value === "beats") {
    const options = await promptSegmentTreeBeatsOptions(editor);
    return options ? renderRecipeSnippet(renderSegmentTreeBeatsRecipe(options)) : undefined;
  }

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

  const fixedOutputMode: SegmentTreeOutputMode | undefined =
    scenarioPick.value === "point_query"
      ? undefined
      : scenarioPick.value === "max_subarray"
        ? "iterative_class"
        : "global_recursive";
  const outputPick: ValuePickItem<SegmentTreeOutputMode> | undefined = fixedOutputMode
    ? { label: fixedOutputMode, value: fixedOutputMode }
    : await vscode.window.showQuickPick<ValuePickItem<SegmentTreeOutputMode>>(
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
    scenarioPick.value === "max_subarray"
      ? [{ label: "max subarray", value: "sum" }]
      : outputPick.value === "iterative_class"
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
    scenarioPick.value === "max_subarray"
      ? [{ label: "point set", value: "point_set", picked: true }]
      : scenarioPick.value === "lazy_minmax"
        ? [
            { label: "range add lazy", value: "range_add", picked: true },
            { label: "range assign lazy", value: "range_assign", picked: true }
          ]
      : outputPick.value === "iterative_class"
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
  if (
    outputPick.value === "global_recursive" &&
    aggregatePick.value === "min"
  ) {
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

  const sourcePick = await vscode.window.showQuickPick<
    ValuePickItem<SegmentTreeSourceMode>
  >(
    [
      { label: "empty size", value: "empty", picked: true },
      { label: "existing vector", value: "existing_vector" },
      { label: "generated read loop", value: "read_loop" }
    ],
    {
      title: "edulcni: segment tree",
      placeHolder: "Build source",
      ignoreFocusOut: true
    }
  );
  if (!sourcePick) {
    return undefined;
  }

  let sourceName: string | undefined;
  if (sourcePick.value === "existing_vector") {
    sourceName = await promptVectorName(
      "edulcni: segment tree",
      "Source vector",
      analysis.vectorSymbols,
      "Existing vector name"
    );
  } else if (sourcePick.value === "read_loop") {
    sourceName = await vscode.window.showInputBox({
      title: "edulcni: segment tree",
      prompt: "Generated vector name",
      value: "a",
      validateInput: validateIdentifier,
      ignoreFocusOut: true
    });
  }
  if (sourcePick.value !== "empty" && !sourceName) {
    return undefined;
  }

  const indexingPick = await vscode.window.showQuickPick(
    [
      { label: "0-indexed", value: "zero_based" },
      { label: "1-indexed input", value: "one_based_input" }
    ],
    {
      title: "edulcni: segment tree",
      placeHolder: "Query/update indexing",
      ignoreFocusOut: true
    }
  );
  if (!indexingPick) {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<
    ValuePickItem<SegmentTreeUsageMode>
  >(
    [
      { label: "helper only", value: "helper_only", picked: true },
      { label: "instance/build skeleton", value: "instance" },
      { label: "query loop skeleton", value: "query_loop" }
    ],
    {
      title: "edulcni: segment tree",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  if (aggregatePick.value !== "custom") {
    return renderRecipeSnippet(renderSegmentTreeRecipe({
      sizeExpression: sizeExpression.trim(),
      valueType: valueType.trim(),
      aggregate: aggregatePick.value,
      updates,
      descends,
      application: scenarioPick.value,
      sourceMode: sourcePick.value,
      sourceName,
      indexing: indexingPick.value as "zero_based" | "one_based_input",
      usageMode: usagePick.value,
      instanceName: "seg",
      answerName: "ans",
      names,
      outputMode: outputPick.value
    }));
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

  return renderRecipeSnippet(renderSegmentTreeRecipe({
    sizeExpression: sizeExpression.trim(),
    valueType: valueType.trim(),
    aggregate: "custom",
    updates,
    application: scenarioPick.value,
    sourceMode: sourcePick.value,
    sourceName,
    indexing: indexingPick.value as "zero_based" | "one_based_input",
    usageMode: usagePick.value,
    instanceName: "seg",
    answerName: "ans",
    names,
    outputMode: outputPick.value,
    custom: {
      nodeType: nodeType.trim(),
      leafTarget: leafTarget.trim(),
      leafExpression: leafExpression.trim(),
      updateTarget: updateTarget.trim()
    }
  }));
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
  const scenarioPick = await vscode.window.showQuickPick<
    ValuePickItem<SegmentTreeBeatsApplication>
  >(
    SEGMENT_TREE_BEATS_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as SegmentTreeBeatsApplication
    })),
    {
      title: "edulcni: segtree_beats",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const sourcePick = await vscode.window.showQuickPick<
    ValuePickItem<SegmentTreeBeatsSourceMode>
  >(
    [
      { label: "empty size", value: "empty", picked: true },
      { label: "existing vector", value: "existing_vector" },
      { label: "generated read loop", value: "read_loop" }
    ],
    {
      title: "edulcni: segtree_beats",
      placeHolder: "Build source",
      ignoreFocusOut: true
    }
  );
  if (!sourcePick) {
    return undefined;
  }

  let sourceName: string | undefined;
  if (sourcePick.value === "existing_vector") {
    sourceName = await promptVectorName(
      "edulcni: segtree_beats",
      "Source vector",
      analysis.vectorSymbols,
      "Source vector variable name"
    );
  } else if (sourcePick.value === "read_loop") {
    sourceName = await vscode.window.showInputBox({
      title: "edulcni: segtree_beats",
      prompt: "Generated vector name",
      value: "a",
      validateInput: validateIdentifier,
      ignoreFocusOut: true
    });
  }
  if (sourcePick.value !== "empty" && (!sourceName || sourceName.trim() === "")) {
    return undefined;
  }

  const sourceSymbol = analysis.vectorSymbols.find(
    (symbol) => symbol.name === sourceName?.trim()
  );
  const valueType = await pickStringWithCustom(
    "edulcni: segtree_beats",
    "Value type",
    uniqueValues([
      vectorValueType(sourceSymbol?.type) ?? "",
      "ll",
      "long long",
      "int"
    ]),
    "C++ value type"
  );
  if (valueType === undefined || valueType.trim() === "") {
    return undefined;
  }

  const updateItems: ValuePickItem<SegmentTreeBeatsUpdate>[] =
    scenarioPick.value === "query_only"
      ? []
      : scenarioPick.value === "clamp_queries"
        ? [
            { label: "range chmin", value: "chmin", picked: true },
            { label: "range chmax", value: "chmax", picked: true }
          ]
        : [
            { label: "range chmin", value: "chmin", picked: true },
            { label: "range chmax", value: "chmax", picked: true },
            { label: "range add", value: "add", picked: true }
          ];
  const updatePicks =
    updateItems.length === 0
      ? []
      : await vscode.window.showQuickPick<ValuePickItem<SegmentTreeBeatsUpdate>>(
          updateItems,
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

  const sizeDefaults =
    sourcePick.value === "existing_vector" && sourceName
      ? [`(int)${sourceName.trim()}.size()`, ...bindingCandidates(analysis, "size").map((item) => item.value)]
      : bindingCandidates(analysis, "size").map((item) => item.value);
  const sizeExpression = await pickStringWithCustom(
    "edulcni: segtree_beats",
    "Size expression",
    uniqueValues([...sizeDefaults, "n"]),
    "Segment tree beats size expression"
  );
  if (sizeExpression === undefined || sizeExpression.trim() === "") {
    return undefined;
  }

  const indexingPick = await vscode.window.showQuickPick(
    [
      { label: "0-indexed", value: "zero_based" },
      { label: "1-indexed input", value: "one_based_input" }
    ],
    {
      title: "edulcni: segtree_beats",
      placeHolder: "Query/update indexing",
      ignoreFocusOut: true
    }
  );
  if (!indexingPick) {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<
    ValuePickItem<SegmentTreeBeatsUsageMode>
  >(
    [
      { label: "helper only", value: "helper_only", picked: true },
      { label: "instance/build skeleton", value: "instance" },
      { label: "query loop skeleton", value: "query_loop" }
    ],
    {
      title: "edulcni: segtree_beats",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  return {
    valueType: valueType.trim(),
    application: scenarioPick.value,
    sourceMode: sourcePick.value,
    sourceName: sourceName?.trim(),
    sizeExpression: sizeExpression.trim(),
    indexing: indexingPick.value as "zero_based" | "one_based_input",
    usageMode: usagePick.value,
    instanceName: "seg",
    answerName: "ans",
    updates: updatePicks.map((item) => item.value),
    queries: queryPicks.map((item) => item.value),
    names: planSegmentTreeBeatsNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

async function promptImplicitTreapOptions(
  editor: vscode.TextEditor
): Promise<ImplicitTreapOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<
    ValuePickItem<ImplicitTreapApplication>
  >(
    IMPLICIT_TREAP_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as ImplicitTreapApplication
    })),
    {
      title: "edulcni: implicit_treap",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const sourceModePick = await vscode.window.showQuickPick<
    ValuePickItem<ImplicitTreapSourceMode>
  >(
    [
      { label: "empty treap", value: "empty", picked: true },
      { label: "existing vector", value: "existing_vector" },
      { label: "generated read loop", value: "read_loop" }
    ],
    {
      title: "edulcni: implicit_treap",
      placeHolder: "Build source",
      ignoreFocusOut: true
    }
  );
  if (!sourceModePick) {
    return undefined;
  }

  let sourceName: string | undefined;
  if (sourceModePick.value === "existing_vector") {
    sourceName = await promptVectorName(
      "edulcni: implicit_treap",
      "Source vector",
      analysis.vectorSymbols,
      "Source vector variable name"
    );
  } else if (sourceModePick.value === "read_loop") {
    sourceName = await vscode.window.showInputBox({
      title: "edulcni: implicit_treap",
      prompt: "Generated vector name",
      value: "a",
      validateInput: validateIdentifier,
      ignoreFocusOut: true
    });
  }
  if (sourceModePick.value !== "empty" && (!sourceName || sourceName.trim() === "")) {
    return undefined;
  }

  const sourceSymbol = analysis.vectorSymbols.find(
    (symbol) => symbol.name === sourceName?.trim()
  );
  const valueType = await pickStringWithCustom(
    "edulcni: implicit_treap",
    "Value type",
    uniqueValues([
      vectorValueType(sourceSymbol?.type) ?? "",
      "ll",
      "long long",
      "int"
    ]),
    "C++ value type"
  );
  if (valueType === undefined || valueType.trim() === "") {
    return undefined;
  }

  const aggregatePick = await vscode.window.showQuickPick<
    ValuePickItem<ImplicitTreapAggregate>
  >(
    scenarioPick.value === "custom_aggregate"
      ? [{ label: "custom aggregate skeleton", value: "custom", picked: true }]
      : [
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

  const featureItems: ValuePickItem<ImplicitTreapFeature>[] =
    scenarioPick.value === "range_lazy"
      ? [
          { label: "range reverse", value: "reverse", picked: true },
          { label: "range add", value: "range_add" }
        ]
      : scenarioPick.value === "sequence_edit"
        ? []
        : [{ label: "range reverse", value: "reverse", picked: true }];
  const featurePicks =
    featureItems.length === 0
      ? []
      : await vscode.window.showQuickPick<ValuePickItem<ImplicitTreapFeature>>(
          featureItems,
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

  let sizeExpression: string | undefined;
  if (sourceModePick.value === "read_loop") {
    sizeExpression = await pickStringWithCustom(
      "edulcni: implicit_treap",
      "Size expression",
      sizeExpressionCandidates(analysis),
      "Expression for generated vector size, for example n"
    );
    if (sizeExpression === undefined || sizeExpression.trim() === "") {
      return undefined;
    }
  }

  const indexingPick = await vscode.window.showQuickPick(
    [
      { label: "0-indexed", value: "zero_based" },
      { label: "1-indexed input", value: "one_based_input" }
    ],
    {
      title: "edulcni: implicit_treap",
      placeHolder: "Operation indexing",
      ignoreFocusOut: true
    }
  );
  if (!indexingPick) {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<
    ValuePickItem<ImplicitTreapUsageMode>
  >(
    [
      { label: "helper only", value: "helper_only", picked: true },
      { label: "instance/build skeleton", value: "instance" },
      { label: "query loop skeleton", value: "query_loop" }
    ],
    {
      title: "edulcni: implicit_treap",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  return {
    valueType: valueType.trim(),
    aggregate: aggregatePick.value,
    application: scenarioPick.value,
    features: featurePicks.map((item) => item.value),
    sourceMode: sourceModePick.value,
    sourceName: sourceName?.trim(),
    sizeExpression: sizeExpression?.trim(),
    indexing: indexingPick.value as "zero_based" | "one_based_input",
    usageMode: usagePick.value,
    instanceName: "treap",
    answerName: "ans",
    names: planImplicitTreapNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

async function promptMergeSortTreeOptions(
  editor: vscode.TextEditor
): Promise<MergeSortTreeOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<
    ValuePickItem<MergeSortTreeApplication>
  >(
    MERGE_SORT_TREE_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as MergeSortTreeApplication
    })),
    {
      title: "edulcni: merge_sort_tree",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

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

  const queryItems: ValuePickItem<MergeSortTreeQuery>[] =
    scenarioPick.value === "range_value_presence"
      ? [
          { label: "exists x", value: "exists", picked: true },
          { label: "count == x", value: "count_equal" }
        ]
      : scenarioPick.value === "range_value_band"
        ? [
            { label: "count in [low, high]", value: "count_in_range", picked: true }
          ]
        : [
            { label: "count < x", value: "count_less", picked: true },
            { label: "count <= x", value: "count_less_equal" }
          ];
  const queryPicks = await vscode.window.showQuickPick<
    ValuePickItem<MergeSortTreeQuery>
  >(
    queryItems,
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

  const sourceModePick = await vscode.window.showQuickPick<
    ValuePickItem<MergeSortTreeSourceMode>
  >(
    [
      { label: "existing vector", value: "existing_vector", picked: true },
      { label: "generated read loop", value: "read_loop" }
    ],
    {
      title: "edulcni: merge_sort_tree",
      placeHolder: "Build source",
      ignoreFocusOut: true
    }
  );
  if (!sourceModePick) {
    return undefined;
  }

  let sizeExpression: string | undefined;
  if (sourceModePick.value === "read_loop") {
    sizeExpression = await pickStringWithCustom(
      "edulcni: merge_sort_tree",
      "Size expression",
      sizeExpressionCandidates(analysis),
      "Expression for generated vector size, for example n"
    );
    if (sizeExpression === undefined || sizeExpression.trim() === "") {
      return undefined;
    }
  }

  const indexingPick = await vscode.window.showQuickPick(
    [
      { label: "0-indexed", value: "zero_based" },
      { label: "1-indexed input", value: "one_based_input" }
    ],
    {
      title: "edulcni: merge_sort_tree",
      placeHolder: "Query indexing",
      ignoreFocusOut: true
    }
  );
  if (!indexingPick) {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<
    ValuePickItem<MergeSortTreeUsageMode>
  >(
    [
      { label: "helper only", value: "helper_only", picked: true },
      { label: "instance/build skeleton", value: "instance" },
      { label: "query loop skeleton", value: "query_loop" }
    ],
    {
      title: "edulcni: merge_sort_tree",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  return {
    valueType: valueType.trim(),
    sourceName: sourceName.trim(),
    sizeExpression: sizeExpression?.trim(),
    queries:
      queryPicks.length === 0
        ? defaultMergeSortTreeQueries()
        : queryPicks.map((item) => item.value),
    application: scenarioPick.value,
    sourceMode: sourceModePick.value,
    indexing: indexingPick.value as "zero_based" | "one_based_input",
    usageMode: usagePick.value,
    instanceName: "mst",
    answerName: "ans",
    names: planMergeSortTreeNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultDsuOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): DsuOptions {
  return {
    application: "connectivity",
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    edgeCountName: bindingCandidates(analysis, "query_count")[0]?.value ?? "m",
    indexing: "zero_based",
    usageMode: "helper_only",
    instanceName: "dsu",
    answerName: "ans",
    names: planDsuNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

async function promptDsuOptions(editor: vscode.TextEditor): Promise<DsuOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<ValuePickItem<DsuApplication>>(
    DSU_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as DsuApplication
    })),
    {
      title: "edulcni: dsu",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const sizeExpression = await pickStringWithCustom(
    "edulcni: dsu",
    "Node count expression",
    uniqueValues([...bindingCandidates(analysis, "size").map((item) => item.value), "n"]),
    "DSU node count expression"
  );
  if (sizeExpression === undefined || sizeExpression.trim() === "") {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<ValuePickItem<DsuUsageMode>>(
    scenarioPick.value === "kruskal"
      ? [{ label: "Kruskal skeleton", value: "kruskal", picked: true }]
      : scenarioPick.value === "query_loop"
        ? [{ label: "query loop skeleton", value: "query_loop", picked: true }]
        : [
            { label: "helper only", value: "helper_only", picked: true },
            { label: "instance skeleton", value: "instance" },
            { label: "query loop skeleton", value: "query_loop" }
          ],
    {
      title: "edulcni: dsu",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  const edgeCountName =
    usagePick.value === "kruskal"
      ? await pickStringWithCustom(
          "edulcni: dsu",
          "Edge count expression",
          uniqueValues([...bindingCandidates(analysis, "query_count").map((item) => item.value), "m"]),
          "Kruskal edge count expression"
        )
      : undefined;
  if (usagePick.value === "kruskal" && (!edgeCountName || edgeCountName.trim() === "")) {
    return undefined;
  }

  const indexingPick = await vscode.window.showQuickPick<ValuePickItem<DsuIndexing>>(
    [
      { label: "0-indexed", value: "zero_based" },
      { label: "1-indexed input", value: "one_based_input" }
    ],
    {
      title: "edulcni: dsu",
      placeHolder: "Input indexing",
      ignoreFocusOut: true
    }
  );
  if (!indexingPick) {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    sizeExpression: sizeExpression.trim(),
    edgeCountName: edgeCountName?.trim(),
    indexing: indexingPick.value,
    usageMode: usagePick.value,
    instanceName: suggestIdentifier(analysis, "dsu", "sets"),
    answerName: suggestIdentifier(analysis, "ans", "answer"),
    names: planDsuNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultRollbackDsuOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): RollbackDsuOptions {
  return {
    application: "snapshots",
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    queryCountName: bindingCandidates(analysis, "query_count")[0]?.value ?? "q",
    indexing: "zero_based",
    usageMode: "helper_only",
    instanceName: "dsu",
    answerName: "ans",
    names: planRollbackDsuNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

async function promptRollbackDsuOptions(
  editor: vscode.TextEditor
): Promise<RollbackDsuOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<
    ValuePickItem<RollbackDsuApplication>
  >(
    ROLLBACK_DSU_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as RollbackDsuApplication
    })),
    {
      title: "edulcni: rollback_dsu",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const sizeExpression = await pickStringWithCustom(
    "edulcni: rollback_dsu",
    "Node count expression",
    uniqueValues([...bindingCandidates(analysis, "size").map((item) => item.value), "n"]),
    "Rollback DSU node count expression"
  );
  if (sizeExpression === undefined || sizeExpression.trim() === "") {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<
    ValuePickItem<RollbackDsuUsageMode>
  >(
    [
      { label: "helper only", value: "helper_only", picked: true },
      { label: "instance skeleton", value: "instance" },
      { label: "snapshot query loop", value: "query_loop" }
    ],
    {
      title: "edulcni: rollback_dsu",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  const indexingPick = await vscode.window.showQuickPick<
    ValuePickItem<RollbackDsuIndexing>
  >(
    [
      { label: "0-indexed", value: "zero_based" },
      { label: "1-indexed input", value: "one_based_input" }
    ],
    {
      title: "edulcni: rollback_dsu",
      placeHolder: "Input indexing",
      ignoreFocusOut: true
    }
  );
  if (!indexingPick) {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    sizeExpression: sizeExpression.trim(),
    queryCountName: bindingCandidates(analysis, "query_count")[0]?.value ?? "q",
    indexing: indexingPick.value,
    usageMode: usagePick.value,
    instanceName: suggestIdentifier(analysis, "dsu", "rollback_dsu"),
    answerName: suggestIdentifier(analysis, "ans", "answer"),
    names: planRollbackDsuNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultLcaOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): LcaOptions {
  return {
    application: "lca_dist",
    sourceMode: "empty",
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    rootExpression: "0",
    queryCountName: bindingCandidates(analysis, "query_count")[0]?.value ?? "q",
    indexing: "zero_based",
    usageMode: "helper_only",
    instanceName: "lca",
    answerName: "ans",
    names: planLcaNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

async function promptLcaOptions(editor: vscode.TextEditor): Promise<LcaOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<ValuePickItem<LcaApplication>>(
    LCA_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as LcaApplication
    })),
    {
      title: "edulcni: lca",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const sizeExpression = await pickStringWithCustom(
    "edulcni: lca",
    "Node count expression",
    uniqueValues([...bindingCandidates(analysis, "size").map((item) => item.value), "n"]),
    "LCA node count expression"
  );
  if (sizeExpression === undefined || sizeExpression.trim() === "") {
    return undefined;
  }

  const rootExpression = await pickStringWithCustom(
    "edulcni: lca",
    "Root expression",
    uniqueValues(["0", ...bindingCandidates(analysis, "index").map((item) => item.value)]),
    "Root vertex expression"
  );
  if (rootExpression === undefined || rootExpression.trim() === "") {
    return undefined;
  }

  const sourcePick = await vscode.window.showQuickPick<ValuePickItem<LcaSourceMode>>(
    [
      { label: "empty helper", value: "empty", picked: true },
      { label: "generated tree read loop", value: "read_tree" }
    ],
    {
      title: "edulcni: lca",
      placeHolder: "Build source",
      ignoreFocusOut: true
    }
  );
  if (!sourcePick) {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<ValuePickItem<LcaUsageMode>>(
    scenarioPick.value === "tree_query_loop"
      ? [{ label: "query loop skeleton", value: "query_loop", picked: true }]
      : [
          { label: "helper only", value: "helper_only", picked: true },
          { label: "instance skeleton", value: "instance" },
          { label: "read tree + build", value: "read_tree" },
          { label: "query loop skeleton", value: "query_loop" }
        ],
    {
      title: "edulcni: lca",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  const indexingPick = await vscode.window.showQuickPick<ValuePickItem<LcaIndexing>>(
    [
      { label: "0-indexed", value: "zero_based" },
      { label: "1-indexed input", value: "one_based_input" }
    ],
    {
      title: "edulcni: lca",
      placeHolder: "Input indexing",
      ignoreFocusOut: true
    }
  );
  if (!indexingPick) {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    sourceMode: sourcePick.value,
    sizeExpression: sizeExpression.trim(),
    rootExpression: rootExpression.trim(),
    queryCountName: bindingCandidates(analysis, "query_count")[0]?.value ?? "q",
    indexing: indexingPick.value,
    usageMode: usagePick.value,
    instanceName: suggestIdentifier(analysis, "lca", "tree_lca"),
    answerName: suggestIdentifier(analysis, "ans", "answer"),
    names: planLcaNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultHldOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): HldOptions {
  return {
    application: "path_query",
    sourceMode: "empty",
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    rootExpression: "0",
    queryCountName: bindingCandidates(analysis, "query_count")[0]?.value ?? "q",
    indexing: "zero_based",
    valueMode: "vertex_values",
    usageMode: "helper_only",
    instanceName: "hld",
    answerName: "ans",
    names: planHldNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

async function promptHldOptions(editor: vscode.TextEditor): Promise<HldOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<ValuePickItem<HldApplication>>(
    HLD_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as HldApplication
    })),
    {
      title: "edulcni: hld",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const sizeExpression = await pickStringWithCustom(
    "edulcni: hld",
    "Node count expression",
    uniqueValues([...bindingCandidates(analysis, "size").map((item) => item.value), "n"]),
    "HLD node count expression"
  );
  if (sizeExpression === undefined || sizeExpression.trim() === "") {
    return undefined;
  }

  const rootExpression = await pickStringWithCustom(
    "edulcni: hld",
    "Root expression",
    uniqueValues(["0", ...bindingCandidates(analysis, "index").map((item) => item.value)]),
    "Root vertex expression"
  );
  if (rootExpression === undefined || rootExpression.trim() === "") {
    return undefined;
  }

  const sourcePick = await vscode.window.showQuickPick<ValuePickItem<HldSourceMode>>(
    [
      { label: "empty helper", value: "empty", picked: true },
      { label: "generated tree read loop", value: "read_tree" }
    ],
    {
      title: "edulcni: hld",
      placeHolder: "Build source",
      ignoreFocusOut: true
    }
  );
  if (!sourcePick) {
    return undefined;
  }

  const valueModePick = await vscode.window.showQuickPick<ValuePickItem<HldValueMode>>(
    [
      { label: "vertex values", description: "path ranges include the LCA position", value: "vertex_values", picked: true },
      { label: "edge values", description: "path ranges skip the LCA endpoint", value: "edge_values" }
    ],
    {
      title: "edulcni: hld",
      placeHolder: "Path value convention",
      ignoreFocusOut: true
    }
  );
  if (!valueModePick) {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<ValuePickItem<HldUsageMode>>(
    scenarioPick.value === "path_query"
      ? [
          { label: "path/subtree/LCA query loop", value: "query_loop", picked: true },
          { label: "helper only", value: "helper_only" },
          { label: "read tree + build", value: "read_tree" },
          { label: "instance skeleton", value: "instance" }
        ]
      : [
          { label: "helper only", value: "helper_only", picked: true },
          { label: "instance skeleton", value: "instance" },
          { label: "read tree + build", value: "read_tree" },
          { label: "path/subtree/LCA query loop", value: "query_loop" }
        ],
    {
      title: "edulcni: hld",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  const indexingPick = await vscode.window.showQuickPick<ValuePickItem<HldIndexing>>(
    [
      { label: "0-indexed", value: "zero_based" },
      { label: "1-indexed input", value: "one_based_input" }
    ],
    {
      title: "edulcni: hld",
      placeHolder: "Input indexing",
      ignoreFocusOut: true
    }
  );
  if (!indexingPick) {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    sourceMode: sourcePick.value,
    sizeExpression: sizeExpression.trim(),
    rootExpression: rootExpression.trim(),
    queryCountName: bindingCandidates(analysis, "query_count")[0]?.value ?? "q",
    indexing: indexingPick.value,
    valueMode: valueModePick.value,
    usageMode: usagePick.value,
    instanceName: suggestIdentifier(analysis, "hld", "tree_hld"),
    answerName: suggestIdentifier(analysis, "ans", "answer"),
    names: planHldNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultBfsOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): BfsOptions {
  return {
    application: "shortest_distances",
    sourceMode: "existing_graph",
    graphMode: "undirected",
    indexing: "zero_based",
    usageMode: "helper_only",
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    edgeCountName: bindingCandidates(analysis, "query_count")[0]?.value ?? "m",
    graphName: bindingCandidates(analysis, "source_vector")[0]?.value ?? "graph",
    sourceName: suggestIdentifier(analysis, "source", "s"),
    targetName: suggestIdentifier(analysis, "target", "t"),
    resultName: suggestIdentifier(analysis, "result", "bfs_result"),
    names: planBfsNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

async function promptBfsOptions(editor: vscode.TextEditor): Promise<BfsOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<ValuePickItem<BfsApplication>>(
    BFS_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as BfsApplication
    })),
    {
      title: "edulcni: bfs",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const sourcePick = await vscode.window.showQuickPick<ValuePickItem<BfsSourceMode>>(
    [
      { label: "existing adjacency list", value: "existing_graph", picked: true },
      { label: "generated edge read loop", value: "read_edges" }
    ],
    {
      title: "edulcni: bfs",
      placeHolder: "Graph source",
      ignoreFocusOut: true
    }
  );
  if (!sourcePick) {
    return undefined;
  }

  const graphName = await pickStringWithCustom(
    "edulcni: bfs",
    "Graph variable",
    uniqueValues([...bindingCandidates(analysis, "source_vector").map((item) => item.value), "graph"]),
    "Adjacency-list variable name"
  );
  if (graphName === undefined || graphName.trim() === "") {
    return undefined;
  }

  let sizeExpression = sizeExpressionCandidates(analysis)[0] ?? "n";
  let edgeCountName = bindingCandidates(analysis, "query_count")[0]?.value ?? "m";
  if (sourcePick.value === "read_edges") {
    const pickedSize = await pickStringWithCustom(
      "edulcni: bfs",
      "Node count expression",
      uniqueValues([...bindingCandidates(analysis, "size").map((item) => item.value), "n"]),
      "BFS node count expression"
    );
    if (pickedSize === undefined || pickedSize.trim() === "") {
      return undefined;
    }
    sizeExpression = pickedSize.trim();

    const pickedEdges = await pickStringWithCustom(
      "edulcni: bfs",
      "Edge count expression",
      uniqueValues([...bindingCandidates(analysis, "query_count").map((item) => item.value), "m"]),
      "BFS edge count expression"
    );
    if (pickedEdges === undefined || pickedEdges.trim() === "") {
      return undefined;
    }
    edgeCountName = pickedEdges.trim();
  }

  const graphModePick = await vscode.window.showQuickPick<ValuePickItem<BfsGraphMode>>(
    [
      { label: "undirected", value: "undirected", picked: true },
      { label: "directed", value: "directed" }
    ],
    {
      title: "edulcni: bfs",
      placeHolder: "Graph direction",
      ignoreFocusOut: true
    }
  );
  if (!graphModePick) {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<ValuePickItem<BfsUsageMode>>(
    scenarioPick.value === "multi_source"
      ? [
          { label: "multi-source run", value: "multi_source", picked: true },
          { label: "helper only", value: "helper_only" },
          { label: "read graph", value: "read_graph" }
        ]
      : scenarioPick.value === "path_restore"
        ? [
            { label: "path query skeleton", value: "path_query", picked: true },
            { label: "single-source run", value: "single_source" },
            { label: "helper only", value: "helper_only" },
            { label: "read graph", value: "read_graph" }
          ]
        : [
            { label: "helper only", value: "helper_only", picked: true },
            { label: "read graph", value: "read_graph" },
            { label: "single-source run", value: "single_source" },
            { label: "multi-source run", value: "multi_source" },
            { label: "path query skeleton", value: "path_query" }
          ],
    {
      title: "edulcni: bfs",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  const indexingPick = await vscode.window.showQuickPick<ValuePickItem<BfsIndexing>>(
    [
      { label: "0-indexed", value: "zero_based" },
      { label: "1-indexed input", value: "one_based_input" }
    ],
    {
      title: "edulcni: bfs",
      placeHolder: "Input indexing",
      ignoreFocusOut: true
    }
  );
  if (!indexingPick) {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    sourceMode: sourcePick.value,
    graphMode: graphModePick.value,
    indexing: indexingPick.value,
    usageMode: usagePick.value,
    sizeExpression,
    edgeCountName,
    graphName: graphName.trim(),
    sourceName: suggestIdentifier(analysis, "source", "s"),
    targetName: suggestIdentifier(analysis, "target", "t"),
    resultName: suggestIdentifier(analysis, "result", "bfs_result"),
    names: planBfsNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultDijkstraOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): DijkstraOptions {
  return {
    application: "shortest_paths",
    sourceMode: "existing_graph",
    graphMode: "directed",
    indexing: "zero_based",
    usageMode: "helper_only",
    valueType: "long long",
    infExpression: "std::numeric_limits<long long>::max()",
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    edgeCountName: bindingCandidates(analysis, "query_count")[0]?.value ?? "m",
    graphName: bindingCandidates(analysis, "source_vector")[0]?.value ?? "graph",
    sourceName: suggestIdentifier(analysis, "source", "s"),
    targetName: suggestIdentifier(analysis, "target", "t"),
    resultName: suggestIdentifier(analysis, "result", "dijkstra_result"),
    names: planDijkstraNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

async function promptDijkstraOptions(
  editor: vscode.TextEditor
): Promise<DijkstraOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<ValuePickItem<DijkstraApplication>>(
    DIJKSTRA_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as DijkstraApplication
    })),
    {
      title: "edulcni: dijkstra",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const sourcePick = await vscode.window.showQuickPick<ValuePickItem<DijkstraSourceMode>>(
    [
      { label: "existing weighted adjacency list", value: "existing_graph", picked: true },
      { label: "generated weighted edge loop", value: "read_edges" }
    ],
    {
      title: "edulcni: dijkstra",
      placeHolder: "Graph source",
      ignoreFocusOut: true
    }
  );
  if (!sourcePick) {
    return undefined;
  }

  const valueType = await pickStringWithCustom(
    "edulcni: dijkstra",
    "Weight type",
    ["long long", "int", "double"],
    "Dijkstra edge weight type"
  );
  if (valueType === undefined || valueType.trim() === "") {
    return undefined;
  }

  const defaultInf = valueType.trim() === "long long"
    ? "std::numeric_limits<long long>::max()"
    : `std::numeric_limits<${valueType.trim()}>::max()`;
  const infExpression = await pickStringWithCustom(
    "edulcni: dijkstra",
    "Infinity expression",
    [defaultInf],
    "Dijkstra infinity expression"
  );
  if (infExpression === undefined || infExpression.trim() === "") {
    return undefined;
  }

  const graphName = await pickStringWithCustom(
    "edulcni: dijkstra",
    "Graph variable",
    uniqueValues([...bindingCandidates(analysis, "source_vector").map((item) => item.value), "graph"]),
    "Weighted adjacency-list variable name"
  );
  if (graphName === undefined || graphName.trim() === "") {
    return undefined;
  }

  let sizeExpression = sizeExpressionCandidates(analysis)[0] ?? "n";
  let edgeCountName = bindingCandidates(analysis, "query_count")[0]?.value ?? "m";
  if (sourcePick.value === "read_edges") {
    const pickedSize = await pickStringWithCustom(
      "edulcni: dijkstra",
      "Node count expression",
      uniqueValues([...bindingCandidates(analysis, "size").map((item) => item.value), "n"]),
      "Dijkstra node count expression"
    );
    if (pickedSize === undefined || pickedSize.trim() === "") {
      return undefined;
    }
    sizeExpression = pickedSize.trim();

    const pickedEdges = await pickStringWithCustom(
      "edulcni: dijkstra",
      "Edge count expression",
      uniqueValues([...bindingCandidates(analysis, "query_count").map((item) => item.value), "m"]),
      "Dijkstra edge count expression"
    );
    if (pickedEdges === undefined || pickedEdges.trim() === "") {
      return undefined;
    }
    edgeCountName = pickedEdges.trim();
  }

  const graphModePick = await vscode.window.showQuickPick<ValuePickItem<DijkstraGraphMode>>(
    [
      { label: "directed", value: "directed", picked: true },
      { label: "undirected", value: "undirected" }
    ],
    {
      title: "edulcni: dijkstra",
      placeHolder: "Graph direction",
      ignoreFocusOut: true
    }
  );
  if (!graphModePick) {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<ValuePickItem<DijkstraUsageMode>>(
    scenarioPick.value === "multi_source"
      ? [
          { label: "multi-source run", value: "multi_source", picked: true },
          { label: "helper only", value: "helper_only" },
          { label: "read graph", value: "read_graph" }
        ]
      : scenarioPick.value === "path_restore"
        ? [
            { label: "path query skeleton", value: "path_query", picked: true },
            { label: "single-source run", value: "single_source" },
            { label: "helper only", value: "helper_only" },
            { label: "read graph", value: "read_graph" }
          ]
        : scenarioPick.value === "weighted_graph_read"
          ? [
              { label: "read graph", value: "read_graph", picked: true },
              { label: "helper only", value: "helper_only" },
              { label: "single-source run", value: "single_source" }
            ]
          : [
              { label: "helper only", value: "helper_only", picked: true },
              { label: "read graph", value: "read_graph" },
              { label: "single-source run", value: "single_source" },
              { label: "multi-source run", value: "multi_source" },
              { label: "path query skeleton", value: "path_query" }
            ],
    {
      title: "edulcni: dijkstra",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  const indexingPick = await vscode.window.showQuickPick<ValuePickItem<DijkstraIndexing>>(
    [
      { label: "0-indexed", value: "zero_based" },
      { label: "1-indexed input", value: "one_based_input" }
    ],
    {
      title: "edulcni: dijkstra",
      placeHolder: "Input indexing",
      ignoreFocusOut: true
    }
  );
  if (!indexingPick) {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    sourceMode: sourcePick.value,
    graphMode: graphModePick.value,
    indexing: indexingPick.value,
    usageMode: usagePick.value,
    valueType: valueType.trim(),
    infExpression: infExpression.trim(),
    sizeExpression,
    edgeCountName,
    graphName: graphName.trim(),
    sourceName: suggestIdentifier(analysis, "source", "s"),
    targetName: suggestIdentifier(analysis, "target", "t"),
    resultName: suggestIdentifier(analysis, "result", "dijkstra_result"),
    names: planDijkstraNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultToposortOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): ToposortOptions {
  return {
    application: "dag_order",
    sourceMode: "existing_graph",
    indexing: "zero_based",
    usageMode: "helper_only",
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    edgeCountName: bindingCandidates(analysis, "query_count")[0]?.value ?? "m",
    graphName: bindingCandidates(analysis, "source_vector")[0]?.value ?? "graph",
    orderName: suggestIdentifier(analysis, "order", "topo_order"),
    dagName: suggestIdentifier(analysis, "dag", "is_dag"),
    names: planToposortNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

async function promptToposortOptions(
  editor: vscode.TextEditor
): Promise<ToposortOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<ValuePickItem<ToposortApplication>>(
    TOPOSORT_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as ToposortApplication
    })),
    {
      title: "edulcni: toposort",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const sourcePick = await vscode.window.showQuickPick<ValuePickItem<ToposortSourceMode>>(
    [
      { label: "existing adjacency list", value: "existing_graph", picked: true },
      { label: "generated dependency edge loop", value: "read_edges" }
    ],
    {
      title: "edulcni: toposort",
      placeHolder: "Graph source",
      ignoreFocusOut: true
    }
  );
  if (!sourcePick) {
    return undefined;
  }

  const graphName = await pickStringWithCustom(
    "edulcni: toposort",
    "Graph variable",
    uniqueValues([...bindingCandidates(analysis, "source_vector").map((item) => item.value), "graph"]),
    "Directed adjacency-list variable name"
  );
  if (graphName === undefined || graphName.trim() === "") {
    return undefined;
  }

  let sizeExpression = sizeExpressionCandidates(analysis)[0] ?? "n";
  let edgeCountName = bindingCandidates(analysis, "query_count")[0]?.value ?? "m";
  if (sourcePick.value === "read_edges") {
    const pickedSize = await pickStringWithCustom(
      "edulcni: toposort",
      "Node count expression",
      uniqueValues([...bindingCandidates(analysis, "size").map((item) => item.value), "n"]),
      "Toposort node count expression"
    );
    if (pickedSize === undefined || pickedSize.trim() === "") {
      return undefined;
    }
    sizeExpression = pickedSize.trim();

    const pickedEdges = await pickStringWithCustom(
      "edulcni: toposort",
      "Edge count expression",
      uniqueValues([...bindingCandidates(analysis, "query_count").map((item) => item.value), "m"]),
      "Toposort edge count expression"
    );
    if (pickedEdges === undefined || pickedEdges.trim() === "") {
      return undefined;
    }
    edgeCountName = pickedEdges.trim();
  }

  const usagePick = await vscode.window.showQuickPick<ValuePickItem<ToposortUsageMode>>(
    scenarioPick.value === "cycle_detection"
      ? [
          { label: "cycle check", value: "cycle_check", picked: true },
          { label: "helper only", value: "helper_only" },
          { label: "read graph", value: "read_graph" },
          { label: "sort and print order", value: "sort_order" }
        ]
      : scenarioPick.value === "order_validation"
        ? [
            { label: "validate supplied order", value: "validate_order", picked: true },
            { label: "helper only", value: "helper_only" },
            { label: "read graph", value: "read_graph" }
          ]
        : scenarioPick.value === "dependency_schedule"
          ? [
              { label: "sort and print order", value: "sort_order", picked: true },
              { label: "read graph", value: "read_graph" },
              { label: "cycle check", value: "cycle_check" },
              { label: "helper only", value: "helper_only" }
            ]
          : [
              { label: "helper only", value: "helper_only", picked: true },
              { label: "read graph", value: "read_graph" },
              { label: "sort and print order", value: "sort_order" },
              { label: "cycle check", value: "cycle_check" },
              { label: "validate supplied order", value: "validate_order" }
            ],
    {
      title: "edulcni: toposort",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  const indexingPick = await vscode.window.showQuickPick<ValuePickItem<ToposortIndexing>>(
    [
      { label: "0-indexed", value: "zero_based" },
      { label: "1-indexed input", value: "one_based_input" }
    ],
    {
      title: "edulcni: toposort",
      placeHolder: "Input indexing",
      ignoreFocusOut: true
    }
  );
  if (!indexingPick) {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    sourceMode: sourcePick.value,
    indexing: indexingPick.value,
    usageMode: usagePick.value,
    sizeExpression,
    edgeCountName,
    graphName: graphName.trim(),
    orderName: suggestIdentifier(analysis, "order", "topo_order"),
    dagName: suggestIdentifier(analysis, "dag", "is_dag"),
    names: planToposortNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultKosarajuOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): KosarajuOptions {
  return {
    application: "scc_components",
    sourceMode: "existing_graph",
    indexing: "zero_based",
    usageMode: "helper_only",
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    edgeCountName: bindingCandidates(analysis, "query_count")[0]?.value ?? "m",
    queryCountName: bindingCandidates(analysis, "query_count")[0]?.value ?? "q",
    graphName: bindingCandidates(analysis, "source_vector")[0]?.value ?? "graph",
    resultName: suggestIdentifier(analysis, "scc", "kosaraju_result"),
    names: planKosarajuNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

async function promptKosarajuOptions(
  editor: vscode.TextEditor
): Promise<KosarajuOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<ValuePickItem<KosarajuApplication>>(
    KOSARAJU_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as KosarajuApplication
    })),
    {
      title: "edulcni: kosaraju",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const sourcePick = await vscode.window.showQuickPick<ValuePickItem<KosarajuSourceMode>>(
    [
      { label: "existing directed graph", value: "existing_graph", picked: true },
      { label: "generated directed edge loop", value: "read_edges" }
    ],
    {
      title: "edulcni: kosaraju",
      placeHolder: "Graph source",
      ignoreFocusOut: true
    }
  );
  if (!sourcePick) {
    return undefined;
  }

  const graphName = await pickStringWithCustom(
    "edulcni: kosaraju",
    "Graph variable",
    uniqueValues([...bindingCandidates(analysis, "source_vector").map((item) => item.value), "graph"]),
    "Directed graph variable name"
  );
  if (graphName === undefined || graphName.trim() === "") {
    return undefined;
  }

  let sizeExpression = sizeExpressionCandidates(analysis)[0] ?? "n";
  let edgeCountName = bindingCandidates(analysis, "query_count")[0]?.value ?? "m";
  if (sourcePick.value === "read_edges") {
    const pickedSize = await pickStringWithCustom(
      "edulcni: kosaraju",
      "Node count expression",
      uniqueValues([...bindingCandidates(analysis, "size").map((item) => item.value), "n"]),
      "Kosaraju node count expression"
    );
    if (pickedSize === undefined || pickedSize.trim() === "") {
      return undefined;
    }
    sizeExpression = pickedSize.trim();

    const pickedEdges = await pickStringWithCustom(
      "edulcni: kosaraju",
      "Edge count expression",
      uniqueValues([...bindingCandidates(analysis, "query_count").map((item) => item.value), "m"]),
      "Kosaraju edge count expression"
    );
    if (pickedEdges === undefined || pickedEdges.trim() === "") {
      return undefined;
    }
    edgeCountName = pickedEdges.trim();
  }

  const usagePick = await vscode.window.showQuickPick<ValuePickItem<KosarajuUsageMode>>(
    scenarioPick.value === "same_component"
      ? [
          { label: "same-component query loop", value: "same_component_queries", picked: true },
          { label: "compute SCC", value: "compute_scc" },
          { label: "helper only", value: "helper_only" },
          { label: "read graph", value: "read_graph" }
        ]
      : scenarioPick.value === "condensation_dag"
        ? [
            { label: "compute SCC", value: "compute_scc", picked: true },
            { label: "print components", value: "print_components" },
            { label: "helper only", value: "helper_only" },
            { label: "read graph", value: "read_graph" }
          ]
        : [
            { label: "helper only", value: "helper_only", picked: true },
            { label: "read graph", value: "read_graph" },
            { label: "compute SCC", value: "compute_scc" },
            { label: "same-component query loop", value: "same_component_queries" },
            { label: "print components", value: "print_components" }
          ],
    {
      title: "edulcni: kosaraju",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  const indexingPick = await vscode.window.showQuickPick<ValuePickItem<KosarajuIndexing>>(
    [
      { label: "0-indexed", value: "zero_based" },
      { label: "1-indexed input", value: "one_based_input" }
    ],
    {
      title: "edulcni: kosaraju",
      placeHolder: "Input indexing",
      ignoreFocusOut: true
    }
  );
  if (!indexingPick) {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    sourceMode: sourcePick.value,
    indexing: indexingPick.value,
    usageMode: usagePick.value,
    sizeExpression,
    edgeCountName,
    queryCountName: bindingCandidates(analysis, "query_count")[0]?.value ?? "q",
    graphName: graphName.trim(),
    resultName: suggestIdentifier(analysis, "scc", "kosaraju_result"),
    names: planKosarajuNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultMoOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): MoOptions {
  return {
    application: "custom_callbacks",
    sourceMode: "existing_queries",
    indexing: "zero_based_half_open",
    usageMode: "helper_only",
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    queryCountName: bindingCandidates(analysis, "query_count")[0]?.value ?? "q",
    valuesName: bindingCandidates(analysis, "source_vector")[0]?.value ?? "a",
    queriesName: "queries",
    answersName: "answers",
    valueType: "int",
    answerType: "long long",
    names: planMoNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

async function promptMoOptions(editor: vscode.TextEditor): Promise<MoOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<ValuePickItem<MoApplication>>(
    MO_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as MoApplication
    })),
    {
      title: "edulcni: mo",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const sourcePick = await vscode.window.showQuickPick<ValuePickItem<MoSourceMode>>(
    [
      { label: "existing query vector", value: "existing_queries", picked: true },
      { label: "generated query read loop", value: "read_queries" }
    ],
    {
      title: "edulcni: mo",
      placeHolder: "Query source",
      ignoreFocusOut: true
    }
  );
  if (!sourcePick) {
    return undefined;
  }

  const sizeExpression = await pickStringWithCustom(
    "edulcni: mo",
    "Array length expression",
    uniqueValues([...bindingCandidates(analysis, "size").map((item) => item.value), "n"]),
    "Mo array length expression"
  );
  if (sizeExpression === undefined || sizeExpression.trim() === "") {
    return undefined;
  }

  const valuesName = await pickStringWithCustom(
    "edulcni: mo",
    "Values vector",
    uniqueValues([...bindingCandidates(analysis, "source_vector").map((item) => item.value), "a"]),
    "Values vector used by add/remove callbacks"
  );
  if (valuesName === undefined || valuesName.trim() === "") {
    return undefined;
  }

  let queryCountName = bindingCandidates(analysis, "query_count")[0]?.value ?? "q";
  if (sourcePick.value === "read_queries") {
    const pickedQueries = await pickStringWithCustom(
      "edulcni: mo",
      "Query count expression",
      uniqueValues([...bindingCandidates(analysis, "query_count").map((item) => item.value), "q"]),
      "Mo query count expression"
    );
    if (pickedQueries === undefined || pickedQueries.trim() === "") {
      return undefined;
    }
    queryCountName = pickedQueries.trim();
  }

  const indexingPick = await vscode.window.showQuickPick<ValuePickItem<MoIndexing>>(
    [
      { label: "0-indexed [l, r)", value: "zero_based_half_open", picked: true },
      { label: "1-indexed [l, r] input", value: "one_based_closed_input" }
    ],
    {
      title: "edulcni: mo",
      placeHolder: "Query indexing",
      ignoreFocusOut: true
    }
  );
  if (!indexingPick) {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<ValuePickItem<MoUsageMode>>(
    scenarioPick.value === "distinct_values"
      ? [
          { label: "distinct-count skeleton", value: "distinct_count_skeleton", picked: true },
          { label: "helper only", value: "helper_only" },
          { label: "read queries", value: "read_queries" },
          { label: "generic processor skeleton", value: "process_skeleton" }
        ]
      : scenarioPick.value === "custom_callbacks"
        ? [
            { label: "helper only", value: "helper_only", picked: true },
            { label: "generic processor skeleton", value: "process_skeleton" },
            { label: "read queries", value: "read_queries" }
          ]
        : [
            { label: "generic processor skeleton", value: "process_skeleton", picked: true },
            { label: "helper only", value: "helper_only" },
            { label: "read queries", value: "read_queries" },
            { label: "distinct-count skeleton", value: "distinct_count_skeleton" }
          ],
    {
      title: "edulcni: mo",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    sourceMode: sourcePick.value,
    indexing: indexingPick.value,
    usageMode: usagePick.value,
    sizeExpression: sizeExpression.trim(),
    queryCountName,
    valuesName: valuesName.trim(),
    queriesName: suggestIdentifier(analysis, "queries", "mo_queries"),
    answersName: suggestIdentifier(analysis, "answers", "mo_answers"),
    valueType: "int",
    answerType: "long long",
    names: planMoNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultMonotonicStackOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): MonotonicStackOptions {
  return {
    application: "nearest_smaller",
    direction: "left",
    relation: "smaller",
    strictness: "strict",
    usageMode: "helper_only",
    sourceName: bindingCandidates(analysis, "source_vector")[0]?.value ?? "values",
    resultName: "nearest",
    valueType: "int",
    names: planMonotonicStackNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

async function promptMonotonicStackOptions(
  editor: vscode.TextEditor
): Promise<MonotonicStackOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<ValuePickItem<MonotonicStackApplication>>(
    MONOTONIC_STACK_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as MonotonicStackApplication
    })),
    {
      title: "edulcni: monotonic_stack",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const relationPick = await vscode.window.showQuickPick<ValuePickItem<MonotonicStackRelation>>(
    scenarioPick.value === "all_nearest"
      ? [{ label: "all", value: "all", picked: true }]
      : scenarioPick.value === "nearest_greater"
        ? [
            { label: "greater", value: "greater", picked: true },
            { label: "smaller", value: "smaller" }
          ]
        : [
            { label: "smaller", value: "smaller", picked: true },
            { label: "greater", value: "greater" },
            { label: "all", value: "all" }
          ],
    {
      title: "edulcni: monotonic_stack",
      placeHolder: "Relation",
      ignoreFocusOut: true
    }
  );
  if (!relationPick) {
    return undefined;
  }

  const directionPick = await vscode.window.showQuickPick<ValuePickItem<MonotonicStackDirection>>(
    relationPick.value === "all"
      ? [{ label: "both", value: "both", picked: true }]
      : [
          { label: "left", value: "left", picked: true },
          { label: "right", value: "right" },
          { label: "both", value: "both" }
        ],
    {
      title: "edulcni: monotonic_stack",
      placeHolder: "Direction",
      ignoreFocusOut: true
    }
  );
  if (!directionPick) {
    return undefined;
  }

  const strictnessPick = await vscode.window.showQuickPick<ValuePickItem<MonotonicStackStrictness>>(
    [
      { label: "strict", value: "strict", picked: true },
      { label: "allow equal", value: "non_strict" }
    ],
    {
      title: "edulcni: monotonic_stack",
      placeHolder: "Strictness",
      ignoreFocusOut: true
    }
  );
  if (!strictnessPick) {
    return undefined;
  }

  const sourceName = await pickStringWithCustom(
    "edulcni: monotonic_stack",
    "Source vector",
    uniqueValues([...bindingCandidates(analysis, "source_vector").map((item) => item.value), "values", "a"]),
    "Source vector for nearest-index computation"
  );
  if (sourceName === undefined || sourceName.trim() === "") {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<ValuePickItem<MonotonicStackUsageMode>>(
    [
      { label: "helper only", value: "helper_only", picked: true },
      { label: "compute vector", value: "compute_vector" },
      { label: "compute all", value: "compute_all" }
    ],
    {
      title: "edulcni: monotonic_stack",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    direction: directionPick.value,
    relation: relationPick.value,
    strictness: strictnessPick.value,
    usageMode: usagePick.value,
    sourceName: sourceName.trim(),
    resultName: suggestIdentifier(analysis, "nearest", "nearest_index"),
    valueType: "int",
    names: planMonotonicStackNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultGpHashTableOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): GpHashTableOptions {
  return {
    application: "hash_map",
    usageMode: "helper_only",
    keyType: "long long",
    valueType: "int",
    tableName: "table",
    sourceName: bindingCandidates(analysis, "source_vector")[0]?.value ?? "values",
    names: planGpHashTableNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

async function promptGpHashTableOptions(
  editor: vscode.TextEditor
): Promise<GpHashTableOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<ValuePickItem<GpHashTableApplication>>(
    GP_HASH_TABLE_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as GpHashTableApplication
    })),
    {
      title: "edulcni: gp_hash_table",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const keyDefaults =
    scenarioPick.value === "pair_key"
      ? ["std::pair<int, int>", "std::pair<long long, long long>"]
      : ["long long", "int", "std::uint64_t", "std::string"];
  const keyType = await pickStringWithCustom(
    "edulcni: gp_hash_table",
    "Key type",
    keyDefaults,
    "Hash-table key type"
  );
  if (keyType === undefined || keyType.trim() === "") {
    return undefined;
  }

  const valueType = await pickStringWithCustom(
    "edulcni: gp_hash_table",
    "Value type",
    ["int", "long long", "bool", "__gnu_pbds::null_type"],
    "Hash-table value type"
  );
  if (valueType === undefined || valueType.trim() === "") {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<ValuePickItem<GpHashTableUsageMode>>(
    scenarioPick.value === "hash_set"
      ? [
          { label: "declare set", value: "declare_set", picked: true },
          { label: "helper only", value: "helper_only" },
          { label: "declare map", value: "declare_map" }
        ]
      : scenarioPick.value === "frequency_table"
        ? [
            { label: "frequency loop", value: "frequency_loop", picked: true },
            { label: "declare map", value: "declare_map" },
            { label: "helper only", value: "helper_only" }
          ]
        : [
            { label: "helper only", value: "helper_only", picked: true },
            { label: "declare map", value: "declare_map" },
            { label: "declare set", value: "declare_set" },
            { label: "frequency loop", value: "frequency_loop" }
          ],
    {
      title: "edulcni: gp_hash_table",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  const sourceName = await pickStringWithCustom(
    "edulcni: gp_hash_table",
    "Source vector",
    uniqueValues([...bindingCandidates(analysis, "source_vector").map((item) => item.value), "values", "a"]),
    "Source vector for frequency loop"
  );
  if (sourceName === undefined || sourceName.trim() === "") {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    usageMode: usagePick.value,
    keyType: keyType.trim(),
    valueType: valueType.trim(),
    tableName: suggestIdentifier(analysis, "table", "hash_table"),
    sourceName: sourceName.trim(),
    names: planGpHashTableNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultOrderedSetOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): OrderedSetOptions {
  return {
    application: "order_statistics",
    usageMode: "helper_only",
    keyType: "int",
    setName: "os",
    names: planOrderedSetNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

async function promptOrderedSetOptions(
  editor: vscode.TextEditor
): Promise<OrderedSetOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<ValuePickItem<OrderedSetApplication>>(
    ORDERED_SET_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as OrderedSetApplication
    })),
    {
      title: "edulcni: ordered_set",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const keyType = await pickStringWithCustom(
    "edulcni: ordered_set",
    "Key type",
    scenarioPick.value === "multiset_pairs"
      ? ["int", "long long"]
      : ["int", "long long", "std::pair<int, int>"],
    "Ordered-set key type"
  );
  if (keyType === undefined || keyType.trim() === "") {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<ValuePickItem<OrderedSetUsageMode>>(
    scenarioPick.value === "kth_element"
      ? [
          { label: "kth query", value: "kth_query", picked: true },
          { label: "declare set", value: "declare_set" },
          { label: "helper only", value: "helper_only" }
        ]
      : scenarioPick.value === "rank_queries"
        ? [
            { label: "rank query", value: "rank_query", picked: true },
            { label: "declare set", value: "declare_set" },
            { label: "helper only", value: "helper_only" }
          ]
        : scenarioPick.value === "multiset_pairs"
          ? [
              { label: "pair-key multiset", value: "pair_multiset", picked: true },
              { label: "helper only", value: "helper_only" }
            ]
          : [
              { label: "helper only", value: "helper_only", picked: true },
              { label: "declare set", value: "declare_set" },
              { label: "rank query", value: "rank_query" },
              { label: "kth query", value: "kth_query" },
              { label: "pair-key multiset", value: "pair_multiset" }
            ],
    {
      title: "edulcni: ordered_set",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    usageMode: usagePick.value,
    keyType: keyType.trim(),
    setName: suggestIdentifier(analysis, "os", "ordered_set"),
    names: planOrderedSetNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultSetUtilsOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): SetUtilsOptions {
  return {
    application: "next_value",
    lookup: "next",
    target: "value",
    usageMode: "helper_only",
    containerName: "container",
    keyName: "key",
    iteratorName: "it",
    resultName: "neighbor",
    names: planSetUtilsNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

async function promptSetUtilsOptions(editor: vscode.TextEditor): Promise<SetUtilsOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<ValuePickItem<SetUtilsApplication>>(
    SET_UTILS_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as SetUtilsApplication
    })),
    {
      title: "edulcni: set_utils",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const lookupPick = await vscode.window.showQuickPick<ValuePickItem<SetUtilsLookup>>(
    scenarioPick.value === "prev_value"
      ? [
          { label: "previous", value: "prev", picked: true },
          { label: "next", value: "next" }
        ]
      : [
          { label: "next", value: "next", picked: true },
          { label: "previous", value: "prev" }
        ],
    {
      title: "edulcni: set_utils",
      placeHolder: "Lookup direction",
      ignoreFocusOut: true
    }
  );
  if (!lookupPick) {
    return undefined;
  }

  const targetPick = await vscode.window.showQuickPick<ValuePickItem<SetUtilsTarget>>(
    scenarioPick.value === "iterator_navigation"
      ? [
          { label: "iterator", value: "iterator", picked: true },
          { label: "value", value: "value" }
        ]
      : [
          { label: "value", value: "value", picked: true },
          { label: "iterator", value: "iterator" }
        ],
    {
      title: "edulcni: set_utils",
      placeHolder: "Lookup target",
      ignoreFocusOut: true
    }
  );
  if (!targetPick) {
    return undefined;
  }

  const containerName = await pickStringWithCustom(
    "edulcni: set_utils",
    "Container variable",
    ["container", "st", "mp", "s"],
    "Ordered container variable"
  );
  if (containerName === undefined || containerName.trim() === "") {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<ValuePickItem<SetUtilsUsageMode>>(
    [
      { label: "helper only", value: "helper_only", picked: true },
      { label: "lookup snippet", value: "lookup_snippet" }
    ],
    {
      title: "edulcni: set_utils",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    lookup: lookupPick.value,
    target: targetPick.value,
    usageMode: usagePick.value,
    containerName: containerName.trim(),
    keyName: suggestIdentifier(analysis, "key", "x"),
    iteratorName: suggestIdentifier(analysis, "it", "iter"),
    resultName: suggestIdentifier(analysis, "neighbor", "adjacent"),
    names: planSetUtilsNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultFastAllocatorOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): FastAllocatorOptions {
  return {
    application: "many_vectors",
    usageMode: "helper_only",
    valueType: "int",
    containerName: "values",
    arenaName: "arena",
    capacityExpression: "1U << 26U",
    edgeTypeName: "Edge",
    names: planFastAllocatorNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

async function promptFastAllocatorOptions(editor: vscode.TextEditor): Promise<FastAllocatorOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<ValuePickItem<FastAllocatorApplication>>(
    FAST_ALLOCATOR_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as FastAllocatorApplication
    })),
    {
      title: "edulcni: fast_allocator",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<ValuePickItem<FastAllocatorUsageMode>>(
    scenarioPick.value === "graph_edges"
      ? [
          { label: "edge vector", value: "edge_vector", picked: true },
          { label: "vector declaration", value: "vector_declaration" },
          { label: "helper only", value: "helper_only" }
        ]
      : scenarioPick.value === "pool_reset"
        ? [
            { label: "arena reset", value: "arena_reset", picked: true },
            { label: "helper only", value: "helper_only" },
            { label: "vector declaration", value: "vector_declaration" }
          ]
        : [
            { label: "helper only", value: "helper_only", picked: true },
            { label: "vector declaration", value: "vector_declaration" },
            { label: "edge vector", value: "edge_vector" },
            { label: "arena reset", value: "arena_reset" }
          ],
    {
      title: "edulcni: fast_allocator",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  const valueType = await pickStringWithCustom(
    "edulcni: fast_allocator",
    "Value type",
    ["int", "long long", "pair<int, int>", "Edge"],
    "Vector value type"
  );
  if (valueType === undefined || valueType.trim() === "") {
    return undefined;
  }

  const capacityExpression = await pickStringWithCustom(
    "edulcni: fast_allocator",
    "Arena capacity",
    ["1U << 26U", "1U << 28U", "sizeof(Edge) * m * 2 + 1024"],
    "Preallocated bytes"
  );
  if (capacityExpression === undefined || capacityExpression.trim() === "") {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    usageMode: usagePick.value,
    valueType: valueType.trim(),
    containerName: suggestIdentifier(analysis, "values", "pool_values"),
    arenaName: suggestIdentifier(analysis, "arena", "pool"),
    capacityExpression: capacityExpression.trim(),
    edgeTypeName: suggestIdentifier(analysis, "Edge", "GraphEdge"),
    names: planFastAllocatorNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultGeometryOptions(): GeometryOptions {
  return {
    application: "convex_hull",
    usageMode: "helper_only",
    valueType: "long long",
    pointsName: "points",
    resultName: "hull",
    includeUsageComment: true
  };
}

async function promptGeometryOptions(editor: vscode.TextEditor): Promise<GeometryOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<ValuePickItem<GeometryApplication>>(
    GEOMETRY_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as GeometryApplication
    })),
    {
      title: "edulcni: geometry",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<ValuePickItem<GeometryUsageMode>>(
    scenarioPick.value === "orientation"
      ? [
          { label: "orientation check", value: "orientation_check", picked: true },
          { label: "helper only", value: "helper_only" }
        ]
      : scenarioPick.value === "segment_intersection"
        ? [
            { label: "segment intersection", value: "segment_intersection", picked: true },
            { label: "helper only", value: "helper_only" }
          ]
        : scenarioPick.value === "angle_sort"
          ? [
              { label: "sort points by angle", value: "sort_points", picked: true },
              { label: "helper only", value: "helper_only" }
            ]
          : [
              { label: "helper only", value: "helper_only", picked: true },
              { label: "build convex hull", value: "build_hull" },
              { label: "segment intersection", value: "segment_intersection" }
            ],
    {
      title: "edulcni: geometry",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  const valueType = await pickStringWithCustom(
    "edulcni: geometry",
    "Coordinate type",
    ["long long", "int", "long double"],
    "Point2 coordinate type"
  );
  if (valueType === undefined || valueType.trim() === "") {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    usageMode: usagePick.value,
    valueType: valueType.trim(),
    pointsName: suggestIdentifier(analysis, "points", "pts"),
    resultName: suggestIdentifier(analysis, "hull", "answer"),
    includeUsageComment: usagePick.value === "helper_only"
  };
}

function defaultHalfplaneIntersectionOptions(): HalfplaneIntersectionOptions {
  return {
    application: "convex_polygon",
    usageMode: "helper_only",
    halfplanesName: "halfplanes",
    resultName: "polygon",
    includeUsageComment: true
  };
}

async function promptHalfplaneIntersectionOptions(
  editor: vscode.TextEditor
): Promise<HalfplaneIntersectionOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<ValuePickItem<HalfplaneIntersectionApplication>>(
    HALFPLANE_INTERSECTION_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as HalfplaneIntersectionApplication
    })),
    {
      title: "edulcni: halfplane_intersection",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<ValuePickItem<HalfplaneIntersectionUsageMode>>(
    scenarioPick.value === "linear_constraints"
      ? [
          { label: "inequality box", value: "inequality_box", picked: true },
          { label: "compute polygon", value: "compute_polygon" },
          { label: "helper only", value: "helper_only" }
        ]
      : [
          { label: "helper only", value: "helper_only", picked: true },
          { label: "half-plane vector", value: "halfplane_vector" },
          { label: "compute polygon", value: "compute_polygon" }
        ],
    {
      title: "edulcni: halfplane_intersection",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  return {
    application: scenarioPick.value,
    usageMode: usagePick.value,
    halfplanesName: suggestIdentifier(analysis, "halfplanes", "planes"),
    resultName: suggestIdentifier(analysis, "polygon", "poly"),
    includeUsageComment: usagePick.value === "helper_only"
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

function fenwickOperationsForApplication(
  application: FenwickApplication
): FenwickOperation[] {
  if (application === "point_range") {
    return ["sum", "xor", "custom_invertible"];
  }
  if (application === "range_point" || application === "range_sum") {
    return ["sum"];
  }
  if (application === "frequency_kth" || application === "inversion_count") {
    return ["sum"];
  }
  if (application === "prefix_minmax") {
    return ["min", "max"];
  }
  return ["sum", "xor", "min", "max", "custom", "custom_invertible"];
}

function defaultOperationForApplication(
  application: FenwickApplication
): FenwickOperation {
  if (application === "prefix_minmax") {
    return "min";
  }
  return "sum";
}

async function promptFenwickOptions(
  editor: vscode.TextEditor
) {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await vscode.window.showQuickPick<
    ValuePickItem<FenwickApplication>
  >(
    FENWICK_APPLICATION_SPEC.scenarios.map((scenario, index) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as FenwickApplication,
      picked: index === 1
    })),
    {
      title: "edulcni: fenwick",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

  const application = scenarioPick.value;
  const operationPick = await vscode.window.showQuickPick<
    ValuePickItem<FenwickOperation>
  >(
    fenwickOperationsForApplication(application).map((operation) => ({
      label: operation === "custom_invertible" ? "custom invertible" : operation,
      value: operation,
      picked: operation === defaultOperationForApplication(application)
    })),
    {
      title: "edulcni: fenwick",
      placeHolder: "Operation",
      ignoreFocusOut: true
    }
  );
  if (!operationPick) {
    return undefined;
  }

  const sourcePick = await vscode.window.showQuickPick<
    ValuePickItem<FenwickSourceMode>
  >(
    [
      { label: "empty size", value: "empty", picked: true },
      { label: "existing vector", value: "existing_vector" },
      { label: "generated read loop", value: "read_loop" }
    ],
    {
      title: "edulcni: fenwick",
      placeHolder: "Build source",
      ignoreFocusOut: true
    }
  );
  if (!sourcePick) {
    return undefined;
  }

  let sourceName = "";
  if (sourcePick.value === "existing_vector") {
    const pickedSource = await promptVectorName(
      "edulcni: fenwick",
      "Source vector",
      analysis.vectorSymbols,
      "Source vector variable name"
    );
    if (pickedSource === undefined || pickedSource.trim() === "") {
      return undefined;
    }
    sourceName = pickedSource.trim();
  }

  const sourceSymbol = analysis.vectorSymbols.find(
    (symbol) => symbol.name === sourceName
  );
  const sizeDefaults =
    sourcePick.value === "existing_vector" && sourceName !== ""
      ? [`(int)${sourceName}.size()`, ...bindingCandidates(analysis, "size").map((item) => item.value)]
      : bindingCandidates(analysis, "size").map((item) => item.value);
  const sizeExpression = await pickStringWithCustom(
    "edulcni: fenwick",
    "Size expression",
    uniqueValues([...sizeDefaults, "n"]),
    "Fenwick size expression"
  );
  if (sizeExpression === undefined || sizeExpression.trim() === "") {
    return undefined;
  }

  const valueType = await pickStringWithCustom(
    "edulcni: fenwick",
    "Value type",
    uniqueValues([
      vectorValueType(sourceSymbol?.type) ?? "",
      application === "frequency_kth" ? "int" : "",
      "long long",
      "int"
    ]),
    "C++ value type"
  );
  if (valueType === undefined || valueType.trim() === "") {
    return undefined;
  }

  const indexingPick = await vscode.window.showQuickPick<
    ValuePickItem<FenwickIndexing>
  >(
    [
      { label: "0-indexed", value: "zero_based", picked: true },
      { label: "1-indexed input, decrement in skeleton", value: "one_based_input" }
    ],
    {
      title: "edulcni: fenwick",
      placeHolder: "Indexing convention",
      ignoreFocusOut: true
    }
  );
  if (!indexingPick) {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<
    ValuePickItem<FenwickUsageMode>
  >(
    [
      { label: "helper only", value: "helper_only", picked: true },
      { label: "instance initialization", value: "instance" },
      { label: "query loop skeleton", value: "query_loop" }
    ],
    {
      title: "edulcni: fenwick",
      placeHolder: "Generated usage",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  return {
    operations: [operationPick.value],
    application,
    sourceMode: sourcePick.value,
    sourceName,
    sizeExpression: sizeExpression.trim(),
    valueType: valueType.trim(),
    indexing: indexingPick.value,
    usageMode: usagePick.value,
    instanceName: suggestIdentifier(analysis, "fw", "fenwick"),
    answerName: suggestIdentifier(analysis, "ans", "answer"),
    names: planFenwickNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
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
    application: "range_query",
    sourceMode: "empty",
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    indexing: "zero_based",
    usageMode: "helper_only",
    instanceName: "treap",
    answerName: "ans",
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
    application: "add_clamp_queries",
    sourceMode: "empty",
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    indexing: "zero_based",
    usageMode: "helper_only",
    instanceName: "seg",
    answerName: "ans",
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
    sizeExpression: sourceName === "a" ? "n" : `(int)${sourceName}.size()`,
    queries: defaultMergeSortTreeQueries(),
    application: "range_threshold_count",
    sourceMode: "existing_vector",
    indexing: "zero_based",
    usageMode: "helper_only",
    instanceName: "mst",
    answerName: "ans",
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
  const scenarioPick = await vscode.window.showQuickPick<
    ValuePickItem<SparseTableApplication>
  >(
    SPARSE_TABLE_APPLICATION_SPEC.scenarios.map((scenario) => ({
      label: scenario.label,
      description: scenario.description,
      value: scenario.id as SparseTableApplication
    })),
    {
      title: "edulcni: sparse_table",
      placeHolder: "Application scenario",
      ignoreFocusOut: true
    }
  );
  if (!scenarioPick) {
    return undefined;
  }

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

  const variantItems: ValuePickItem<SparseTableVariant>[] =
    scenarioPick.value === "range_gcd_bitwise"
      ? [
          { label: "gcd", value: "gcd", picked: true },
          { label: "bitwise and", value: "bit_and" },
          { label: "bitwise or", value: "bit_or" }
        ]
      : scenarioPick.value === "custom_idempotent"
        ? [{ label: "custom idempotent", value: "custom", picked: true }]
        : [
            { label: "min", value: "min", picked: true },
            { label: "max", value: "max", picked: true }
          ];
  const variantPicks = await vscode.window.showQuickPick<
    ValuePickItem<SparseTableVariant>
  >(
    variantItems,
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

  const sourceModePick = await vscode.window.showQuickPick<
    ValuePickItem<SparseTableSourceMode>
  >(
    [
      { label: "existing vector", value: "existing_vector", picked: true },
      { label: "generated read loop", value: "read_loop" }
    ],
    {
      title: "edulcni: sparse_table",
      placeHolder: "Build source",
      ignoreFocusOut: true
    }
  );
  if (!sourceModePick) {
    return undefined;
  }

  let sizeExpression: string | undefined;
  if (sourceModePick.value === "read_loop") {
    sizeExpression = await pickStringWithCustom(
      "edulcni: sparse_table",
      "Size expression",
      sizeExpressionCandidates(analysis),
      "Expression for generated vector size, for example n"
    );
    if (sizeExpression === undefined || sizeExpression.trim() === "") {
      return undefined;
    }
  }

  const indexingPick = await vscode.window.showQuickPick(
    [
      { label: "0-indexed", value: "zero_based" },
      { label: "1-indexed input", value: "one_based_input" }
    ],
    {
      title: "edulcni: sparse_table",
      placeHolder: "Query indexing",
      ignoreFocusOut: true
    }
  );
  if (!indexingPick) {
    return undefined;
  }

  const usagePick = await vscode.window.showQuickPick<
    ValuePickItem<SparseTableUsageMode>
  >(
    [
      { label: "helper only", value: "helper_only", picked: true },
      { label: "build call", value: "build_call" },
      { label: "query loop skeleton", value: "query_loop" }
    ],
    {
      title: "edulcni: sparse_table",
      placeHolder: "Usage output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  return {
    valueType: valueType.trim(),
    sourceName: sourceName.trim(),
    sizeExpression: sizeExpression?.trim(),
    variants:
      variantPicks.length === 0
        ? defaultSparseTableVariants()
        : variantPicks.map((item) => item.value),
    application: scenarioPick.value,
    sourceMode: sourceModePick.value,
    indexing: indexingPick.value as "zero_based" | "one_based_input",
    usageMode: usagePick.value,
    answerName: "ans",
    names: planSparseTableNames(analysis),
    includeUsageComment: usagePick.value === "helper_only"
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
        return promptSegmentTreeOptions(editor);
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
        const options = await promptDsuOptions(editor);
        return options ? renderRecipeSnippet(renderDsuRecipe(options)) : undefined;
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
        const options = await promptRollbackDsuOptions(editor);
        return options ? renderRecipeSnippet(renderRollbackDsuRecipe(options)) : undefined;
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
        const options = await promptLcaOptions(editor);
        return options ? renderRecipeSnippet(renderLcaRecipe(options)) : undefined;
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
    "hld",
    {
      catalogEntry: {
        path: "/solvers/hld",
        kind: "solver",
        insertMode: "global",
        generator: "hld",
        label: "/solvers/hld",
        description: "dynamic heavy-light decomposition helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptHldOptions(editor);
        return options ? renderRecipeSnippet(renderHldRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderHldRecipe(defaultHldOptions(analysis, extraReserved))
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
        const options = await promptBfsOptions(editor);
        return options ? renderRecipeSnippet(renderBfsRecipe(options)) : undefined;
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
    "dijkstra",
    {
      catalogEntry: {
        path: "/solvers/dijkstra",
        kind: "solver",
        insertMode: "global",
        generator: "dijkstra",
        label: "/solvers/dijkstra",
        description: "dynamic Dijkstra shortest path helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptDijkstraOptions(editor);
        return options ? renderRecipeSnippet(renderDijkstraRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderDijkstraRecipe(defaultDijkstraOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "toposort",
    {
      catalogEntry: {
        path: "/solvers/toposort",
        kind: "solver",
        insertMode: "global",
        generator: "toposort",
        label: "/solvers/toposort",
        description: "dynamic topological sorting helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptToposortOptions(editor);
        return options ? renderRecipeSnippet(renderToposortRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderToposortRecipe(defaultToposortOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "kosaraju",
    {
      catalogEntry: {
        path: "/solvers/kosaraju",
        kind: "solver",
        insertMode: "global",
        generator: "kosaraju",
        label: "/solvers/kosaraju",
        description: "dynamic Kosaraju SCC helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptKosarajuOptions(editor);
        return options ? renderRecipeSnippet(renderKosarajuRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderKosarajuRecipe(defaultKosarajuOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "mo",
    {
      catalogEntry: {
        path: "/solvers/mo",
        kind: "solver",
        insertMode: "global",
        generator: "mo",
        label: "/solvers/mo",
        description: "dynamic Mo offline range query helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptMoOptions(editor);
        return options ? renderRecipeSnippet(renderMoRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderMoRecipe(defaultMoOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "monotonic_stack",
    {
      catalogEntry: {
        path: "/solvers/monotonic_stack",
        kind: "solver",
        insertMode: "global",
        generator: "monotonic_stack",
        label: "/solvers/monotonic_stack",
        description: "dynamic monotonic stack nearest-index helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptMonotonicStackOptions(editor);
        return options ? renderRecipeSnippet(renderMonotonicStackRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderMonotonicStackRecipe(
            defaultMonotonicStackOptions(analysis, extraReserved)
          )
        );
      }
    }
  ],
  [
    "gp_hash_table",
    {
      catalogEntry: {
        path: "/solvers/gp_hash_table",
        kind: "solver",
        insertMode: "global",
        generator: "gp_hash_table",
        label: "/solvers/gp_hash_table",
        description: "dynamic PBDS hash table helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptGpHashTableOptions(editor);
        return options ? renderRecipeSnippet(renderGpHashTableRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderGpHashTableRecipe(defaultGpHashTableOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "ordered_set",
    {
      catalogEntry: {
        path: "/solvers/ordered_set",
        kind: "solver",
        insertMode: "global",
        generator: "ordered_set",
        label: "/solvers/ordered_set",
        description: "dynamic PBDS ordered set helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptOrderedSetOptions(editor);
        return options ? renderRecipeSnippet(renderOrderedSetRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderOrderedSetRecipe(defaultOrderedSetOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "set_utils",
    {
      catalogEntry: {
        path: "/solvers/set_utils",
        kind: "solver",
        insertMode: "global",
        generator: "set_utils",
        label: "/solvers/set_utils",
        description: "dynamic ordered-container neighbor helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptSetUtilsOptions(editor);
        return options ? renderRecipeSnippet(renderSetUtilsRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderSetUtilsRecipe(defaultSetUtilsOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "fast_allocator",
    {
      catalogEntry: {
        path: "/solvers/fast_allocator",
        kind: "solver",
        insertMode: "global",
        generator: "fast_allocator",
        label: "/solvers/fast_allocator",
        description: "dynamic arena-backed allocator helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptFastAllocatorOptions(editor);
        return options ? renderRecipeSnippet(renderFastAllocatorRecipe(options)) : undefined;
      },
      defaultSnippet(
        analysis: CppAnalysis,
        extraReserved: string[]
      ): RenderedSnippet {
        return renderRecipeSnippet(
          renderFastAllocatorRecipe(defaultFastAllocatorOptions(analysis, extraReserved))
        );
      }
    }
  ],
  [
    "geometry",
    {
      catalogEntry: {
        path: "/solvers/geometry",
        kind: "solver",
        insertMode: "global",
        generator: "geometry",
        label: "/solvers/geometry",
        description: "dynamic 2D geometry helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptGeometryOptions(editor);
        return options ? renderRecipeSnippet(renderGeometryRecipe(options)) : undefined;
      },
      defaultSnippet(): RenderedSnippet {
        return renderRecipeSnippet(renderGeometryRecipe(defaultGeometryOptions()));
      }
    }
  ],
  [
    "halfplane_intersection",
    {
      catalogEntry: {
        path: "/solvers/halfplane_intersection",
        kind: "solver",
        insertMode: "global",
        generator: "halfplane_intersection",
        label: "/solvers/halfplane_intersection",
        description: "dynamic half-plane intersection helper",
        detail: "dynamic / solver"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptHalfplaneIntersectionOptions(editor);
        return options
          ? renderRecipeSnippet(renderHalfplaneIntersectionRecipe(options))
          : undefined;
      },
      defaultSnippet(): RenderedSnippet {
        return renderRecipeSnippet(
          renderHalfplaneIntersectionRecipe(defaultHalfplaneIntersectionOptions())
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
        const options = await promptFenwickOptions(editor);
        return options ? renderRecipeSnippet(renderFenwickRecipe(options)) : undefined;
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

  const catalogEntries = await collectCatalogEntries(libraryRoot);
  if (catalogEntries.length === 0) {
    vscode.window.showWarningMessage(
      "edulcni: no bundled snippets found in extension/library."
    );
    return;
  }

  const items = buildPickItems(catalogEntries);
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

  const ok = await insertRenderedSnippet(editor, picked.insertMode, renderedSnippet);
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

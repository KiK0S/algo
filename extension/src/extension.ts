import * as vscode from "vscode";
import {
  createUnifiedDiff,
  defaultWizardSelection,
  WizardReplay
} from "./wizard";
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
  customValueTypeCandidates,
  defaultBerlekampMasseyFeatures,
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
  InputField,
  InputIndexing,
  InputOptions,
  InputShape,
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
  ModularPrecalcOptions,
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
  planConnectedComponentsNames,
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
  renderConnectedComponentsRecipe,
  renderCompressUnique,
  renderDijkstraRecipe,
  renderDsuRecipe,
  renderFastAllocatorRecipe,
  renderFenwickRecipe,
  renderFactorialPrecalc,
  renderGeometryRecipe,
  renderHalfplaneIntersectionRecipe,
  renderFftNttRecipe,
  renderGpHashTableRecipe,
  renderHungarianRecipe,
  renderHldRecipe,
  renderImplicitTreapRecipe,
  renderInputRecipe,
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
  renderPowersPrecalc,
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
  ConnectedComponentsKind,
  ConnectedComponentsOptions,
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
  insertMode: InsertMode;
  previewContent?: string;
};

type ValuePickItem<T extends string = string> = vscode.QuickPickItem & {
  value: T;
  custom?: boolean;
  previewContent?: string;
};

type PreviewPickItem = vscode.QuickPickItem & {
  previewContent?: string;
};

const PREVIEW_SCHEME = "edulcni-preview";

class SnippetPreviewProvider implements vscode.TextDocumentContentProvider {
  private readonly contents = new Map<string, string>();
  private readonly changed = new vscode.EventEmitter<vscode.Uri>();
  readonly onDidChange = this.changed.event;

  provideTextDocumentContent(uri: vscode.Uri): string {
    return this.contents.get(uri.toString()) ?? "// Select an option to preview it.\n";
  }

  set(uri: vscode.Uri, content: string): void {
    this.contents.set(uri.toString(), content);
    this.changed.fire(uri);
  }

  delete(uri: vscode.Uri): void {
    this.contents.delete(uri.toString());
  }

  dispose(): void {
    this.changed.dispose();
    this.contents.clear();
  }
}

let snippetPreviewProvider: SnippetPreviewProvider | undefined;
let previewSequence = 0;

type WizardAnswer = vscode.QuickPickItem | vscode.QuickPickItem[] | string;

interface WizardReplayContext {
  replay: WizardReplay<WizardAnswer>;
}

let wizardReplayContext: WizardReplayContext | undefined;
let activeWizardSession: WizardPreviewSession | undefined;

function defaultQuickPickAnswer<T extends vscode.QuickPickItem>(
  items: readonly T[],
  canPickMany: boolean
): T | T[] | undefined {
  return defaultWizardSelection(items, canPickMany);
}

class WizardPreviewSession {
  private readonly answers: WizardAnswer[] = [];
  private readonly uri = vscode.Uri.parse(
    `${PREVIEW_SCHEME}:/wizard-${previewSequence++}.diff`
  );
  private previewVersion = 0;
  private previewQueue: Promise<void> = Promise.resolve();
  private previewFailure: Error | undefined;

  constructor(private readonly render: () => Promise<RenderedSnippet | undefined>) {}

  async open(initialContent: string): Promise<void> {
    if (!snippetPreviewProvider) {
      return;
    }
    snippetPreviewProvider.set(this.uri, initialContent);
    const document = await vscode.workspace.openTextDocument(this.uri);
    await vscode.window.showTextDocument(document, {
      viewColumn: vscode.ViewColumn.Beside,
      preserveFocus: true,
      preview: true
    });
  }

  commit(answer: WizardAnswer): void {
    this.answers.push(answer);
  }

  private async renderAnswers(
    answers: WizardAnswer[]
  ): Promise<RenderedSnippet | undefined> {
    wizardReplayContext = { replay: new WizardReplay(answers) };
    try {
      return await this.render();
    } finally {
      wizardReplayContext = undefined;
    }
  }

  preview(answer: WizardAnswer): void {
    if (!snippetPreviewProvider) {
      return;
    }
    const version = ++this.previewVersion;
    const replayAnswers = [...this.answers, answer];
    this.previewQueue = this.previewQueue.catch(() => undefined).then(async () => {
      if (version !== this.previewVersion) {
        return;
      }
      try {
        const baseline = await this.renderAnswers(this.answers);
        const candidate = await this.renderAnswers(replayAnswers);
        if (!baseline || !candidate) {
          throw new Error("the selected action did not produce a snippet");
        }
        if (version === this.previewVersion) {
          this.previewFailure = undefined;
          snippetPreviewProvider?.set(
            this.uri,
            createUnifiedDiff(baseline.content, candidate.content)
          );
        }
      } catch (error) {
        if (version === this.previewVersion) {
          const message = error instanceof Error ? error.message : String(error);
          this.previewFailure = error instanceof Error ? error : new Error(message);
          snippetPreviewProvider?.set(
            this.uri,
            `#error "edulcni preview renderer failed: ${message.replace(/["\r\n]/g, " ")}"\n`
          );
        }
        throw error;
      } finally {
        wizardReplayContext = undefined;
      }
    });
  }

  async close(requireValidPreview: boolean): Promise<void> {
    await this.previewQueue.catch(() => undefined);
    const previewTab = vscode.window.tabGroups.all
      .flatMap((group) => group.tabs)
      .find(
        (tab) =>
          tab.input instanceof vscode.TabInputText &&
          tab.input.uri.toString() === this.uri.toString()
      );
    try {
      if (previewTab) {
        await vscode.window.tabGroups.close(previewTab);
      }
    } finally {
      snippetPreviewProvider?.delete(this.uri);
    }
    if (requireValidPreview && this.previewFailure) {
      throw this.previewFailure;
    }
  }
}

const GENERATED_CHOICE_DESCRIPTIONS: Record<string, string> = {
  helper_only: "adds reusable definitions; no setup, input, or example calls",
  helper: "adds reusable definitions; no input or example calls",
  instance: "also adds an instance declaration and construction/build code",
  build_call: "also adds construction and a build call for the selected source",
  query_loop: "also adds input handling, operation dispatch, and example calls",
  read_tree: "also adds tree input and the build call",
  read_queries: "also adds query input; callback processing remains up to you",
  single_source: "also adds a call from one source vertex",
  multi_source: "also adds source input and a multi-source call",
  path_query: "also adds a path query and path reconstruction/output",
  sort_order: "also runs the sort and prints the resulting order",
  cycle_check: "also runs the sort and checks whether a cycle exists",
  validate_order: "also reads and validates a proposed topological order",
  compute_scc: "also runs SCC decomposition and stores the result",
  same_component_queries: "also answers whether vertex pairs share an SCC",
  print_components: "also groups and prints vertices by component",
  distinct_count_skeleton: "also adds Mo callbacks for distinct-value queries",
  process_skeleton: "also adds editable add/remove/get-answer callbacks",
  compute_vector: "also computes the selected nearest-index vector",
  compute_all: "also computes all four nearest-index variants",
  declare_map: "also declares a hash map with the selected key/value types",
  declare_set: "also declares a hash set with the selected key type",
  frequency_loop: "also counts source values in a hash map",
  rank_query: "also adds an order_of_key rank query",
  kth_query: "also adds a find_by_order kth-element query",
  pair_multiset: "also adds a duplicate-friendly ordered pair-key set",
  lookup_snippet: "also adds a call using the selected lookup helper",
  vector_declaration: "also declares a vector backed by the fast allocator",
  edge_vector: "also declares an allocator-backed edge vector",
  arena_reset: "also adds an explicit arena reset after container use",
  orientation_check: "also adds a three-point orientation call",
  segment_intersection: "also adds segment input and an intersection call",
  sort_points: "also adds a call that sorts points around a center",
  build_hull: "also adds a convex-hull call and result variable",
  halfplane_vector: "also declares the half-plane input vector",
  inequality_box: "also builds half-planes from linear inequalities and bounds",
  compute_polygon: "also runs the intersection and stores the polygon"
};

function explainPickItems<T extends vscode.QuickPickItem>(items: readonly T[]): T[] {
  return items.map((item) => {
    if (item.description) {
      return item;
    }
    const value = (item as Partial<ValuePickItem>).value;
    const description = value ? GENERATED_CHOICE_DESCRIPTIONS[value] : undefined;
    return description ? { ...item, description } : item;
  });
}

const OBSOLETE_PLUMBING_CHOICES = new Set([
  "read_queries",
  "tree_query_loop"
]);

function simplifyPickItems<T extends vscode.QuickPickItem>(items: readonly T[]): T[] {
  return items.filter((item) => {
    const value = (item as Partial<ValuePickItem>).value;
    return value === undefined || !OBSOLETE_PLUMBING_CHOICES.has(value);
  });
}

function showExplainedQuickPick<T extends vscode.QuickPickItem>(
  items: readonly T[] | Thenable<readonly T[]>,
  options: vscode.QuickPickOptions & { canPickMany: true }
): Thenable<T[] | undefined>;
function showExplainedQuickPick<T extends vscode.QuickPickItem>(
  items: readonly T[] | Thenable<readonly T[]>,
  options?: vscode.QuickPickOptions & { canPickMany?: false }
): Thenable<T | undefined>;
async function showExplainedQuickPick<T extends vscode.QuickPickItem>(
  items: readonly T[] | Thenable<readonly T[]>,
  options?: vscode.QuickPickOptions
): Promise<T | T[] | undefined> {
  const originalItems = await Promise.resolve(items);
  const simplifiedItems = simplifyPickItems(originalItems);
  const explainedItems = explainPickItems(
    simplifiedItems.length > 0 ? simplifiedItems : originalItems
  );
  if (explainedItems.length === 1) {
    const picked = explainedItems.find((item) => item.picked) ?? explainedItems[0];
    return (options?.canPickMany ? [picked] : picked) as T | T[];
  }
  if (wizardReplayContext) {
    const fallback = defaultQuickPickAnswer(
      explainedItems,
      options?.canPickMany ?? false
    );
    return (fallback === undefined
      ? undefined
      : wizardReplayContext.replay.next(fallback)) as T | T[] | undefined;
  }
  if (!snippetPreviewProvider) {
    return vscode.window.showQuickPick(explainedItems, options as vscode.QuickPickOptions);
  }

  const wizardSession = activeWizardSession;
  const previewUri = wizardSession
    ? undefined
    : vscode.Uri.parse(`${PREVIEW_SCHEME}:/choice-${previewSequence++}.cpp`);
  if (previewUri) {
    const previewDocument = await vscode.workspace.openTextDocument(previewUri);
    await vscode.window.showTextDocument(previewDocument, {
      viewColumn: vscode.ViewColumn.Beside,
      preserveFocus: true,
      preview: true
    });
  }

  const picker = vscode.window.createQuickPick<T>();
  picker.items = explainedItems;
  picker.canSelectMany = options?.canPickMany ?? false;
  picker.title = options?.title;
  picker.placeholder = options?.placeHolder;
  picker.matchOnDescription = options?.matchOnDescription ?? false;
  picker.matchOnDetail = options?.matchOnDetail ?? false;
  picker.ignoreFocusOut = options?.ignoreFocusOut ?? false;
  if (picker.canSelectMany) {
    picker.selectedItems = explainedItems.filter((item) => item.picked);
  }

  const previewFor = (item: T | undefined): string => {
    if (!item) {
      return "// Select an option to preview it.\n";
    }
    const preview = (item as PreviewPickItem).previewContent;
    if (preview) {
      return preview.endsWith("\n") ? preview : `${preview}\n`;
    }
    throw new Error(`edulcni: ${item.label} has no concrete preview renderer.`);
  };

  if (previewUri) {
    snippetPreviewProvider.set(previewUri, previewFor(explainedItems[0]));
  } else {
    const initialAnswer = defaultQuickPickAnswer(
      explainedItems,
      picker.canSelectMany
    );
    if (initialAnswer) {
      wizardSession?.preview(initialAnswer);
    }
  }
  picker.onDidChangeActive((activeItems) => {
    if (previewUri) {
      snippetPreviewProvider?.set(previewUri, previewFor(activeItems[0]));
      return;
    }
    const activeItem = activeItems[0];
    if (!activeItem) {
      return;
    }
    const answer = picker.canSelectMany
      ? picker.selectedItems.includes(activeItem)
        ? [...picker.selectedItems]
        : [...picker.selectedItems, activeItem]
      : activeItem;
    wizardSession?.preview(answer);
  });
  picker.onDidChangeSelection((selectedItems) => {
    if (!previewUri && picker.canSelectMany) {
      wizardSession?.preview([...selectedItems]);
    }
  });

  return new Promise<T | T[] | undefined>((resolve) => {
    let accepted = false;
    let finished = false;
    const finish = async (result: T | T[] | undefined): Promise<void> => {
      if (finished) {
        return;
      }
      finished = true;
      picker.dispose();
      const previewTab = previewUri
        ? vscode.window.tabGroups.all
            .flatMap((group) => group.tabs)
            .find(
              (tab) =>
                tab.input instanceof vscode.TabInputText &&
                tab.input.uri.toString() === previewUri.toString()
            )
        : undefined;
      try {
        if (previewTab) {
          await vscode.window.tabGroups.close(previewTab);
        }
      } finally {
        if (previewUri) {
          snippetPreviewProvider?.delete(previewUri);
        }
        resolve(result);
      }
    };

    picker.onDidAccept(() => {
      accepted = true;
      const result = picker.canSelectMany
        ? [...picker.selectedItems]
        : picker.activeItems[0];
      if (result) {
        wizardSession?.commit(result);
      }
      picker.hide();
      void finish(result);
    });
    picker.onDidHide(() => {
      if (!accepted) {
        void finish(undefined);
      }
    });
    picker.show();
  });
}

async function showExplainedInputBox(
  options: vscode.InputBoxOptions
): Promise<string | undefined> {
  if (wizardReplayContext) {
    const replayed = wizardReplayContext.replay.next(options.value ?? "");
    return typeof replayed === "string" ? replayed : options.value ?? "";
  }
  if (!activeWizardSession) {
    return vscode.window.showInputBox(options);
  }

  const input = vscode.window.createInputBox();
  input.title = options.title;
  input.prompt = options.prompt;
  input.placeholder = options.placeHolder;
  input.value = options.value ?? "";
  input.valueSelection = options.valueSelection;
  input.password = options.password ?? false;
  input.ignoreFocusOut = options.ignoreFocusOut ?? false;

  let validationVersion = 0;
  let valid = options.validateInput === undefined;
  const validate = async (value: string): Promise<void> => {
    const version = ++validationVersion;
    const message = await options.validateInput?.(value);
    if (version !== validationVersion) {
      return;
    }
    input.validationMessage = message ?? undefined;
    valid = !message;
  };

  activeWizardSession.preview(input.value);
  void validate(input.value);
  input.onDidChangeValue((value) => {
    activeWizardSession?.preview(value);
    void validate(value);
  });

  return new Promise<string | undefined>((resolve) => {
    let finished = false;
    const finish = (value: string | undefined): void => {
      if (finished) {
        return;
      }
      finished = true;
      input.dispose();
      resolve(value);
    };
    input.onDidAccept(async () => {
      await validate(input.value);
      if (!valid) {
        return;
      }
      const value = input.value;
      activeWizardSession?.commit(value);
      input.hide();
      finish(value);
    });
    input.onDidHide(() => finish(undefined));
    input.show();
  });
}

interface GeneratorRegistration {
  catalogEntry: CatalogEntry;
  prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined>;
  defaultSnippet(analysis: CppAnalysis, extraReserved: string[]): RenderedSnippet;
}

const DIRECT_COMMANDS = [
  { command: "edulcni.segtree", snippetPath: "/templates/segtree" },
  { command: "edulcni.compressUnique", snippetPath: "/templates/compress_unique" },
  { command: "edulcni.input", snippetPath: "/templates/input" },
  { command: "edulcni.connectedComponents", snippetPath: "/templates/connected_components" },
  { command: "edulcni.berlekampMassey", snippetPath: "/templates/berlekamp_massey" },
  { command: "edulcni.sparseTable", snippetPath: "/templates/sparse_table" }
] as const;

function isCatalogSnippetPath(displayPath: string): boolean {
  return displayPath.startsWith("/templates/") || displayPath.startsWith("/templates/");
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

function compactCodePreview(content: string, exportedNames: string[] = []): string {
  const lines = content.split("\n");
  const candidates =
    exportedNames.length > 0
      ? lines.filter((line) => exportedNames.some((name) => line.includes(name)))
      : lines;
  const preview = candidates
    .map((line) => line.trim())
    .filter((line) => line !== "" && !line.startsWith("//"))
    .slice(0, 3)
    .join("  ")
    .replace(/\s+/g, " ");
  return preview.length > 180 ? `${preview.slice(0, 177)}...` : preview;
}

function visualizationPickSummary(entry: CatalogEntry): string {
  const visualization = entry.visualization;
  if (!visualization) {
    return "";
  }
  if (visualization.status === "none" || visualization.status === "manual") {
    return `visualization: ${visualization.status}`;
  }
  const models = visualization.models.slice(0, 3).join(" + ");
  const granularity = visualization.defaultGranularity ?? "operations";
  return `visualization: ${models} · ${granularity}`;
}

async function snippetPickPreview(
  root: vscode.Uri,
  entry: CatalogEntry,
  analysis: CppAnalysis
): Promise<{ detail: string; content?: string }> {
  const visualization = visualizationPickSummary(entry);
  const withVisualization = (detail: string): string =>
    [visualization, detail].filter((value) => value !== "").join(" · ");
  try {
    if (entry.generator) {
      const generated = generatorRegistry.get(entry.generator)?.defaultSnippet(analysis, []);
      const preview = generated ? compactCodePreview(generated.content, generated.exports) : "";
      return {
        detail: withVisualization(preview || entry.detail || "template"),
        content: generated?.content
      };
    }
    if (entry.template) {
      const source = await readUtf8(
        vscode.Uri.joinPath(root, "templates", entry.template)
      );
      const preview = compactCodePreview(source, entry.exports);
      return {
        detail: withVisualization(preview || entry.detail || "template"),
        content: source
      };
    }
  } catch {
    // Keep the picker usable when a preview cannot be produced.
  }
  return { detail: withVisualization(entry.detail || "template") };
}

async function buildPickItems(
  root: vscode.Uri,
  catalogEntries: CatalogEntry[],
  analysis: CppAnalysis
): Promise<SnippetPickItem[]> {
  const items: SnippetPickItem[] = [];
  for (const entry of catalogEntries) {
    if (!isCatalogSnippetPath(entry.path)) {
      continue;
    }
    const preview = await snippetPickPreview(root, entry, analysis);
    if (!preview.content) {
      throw new Error(`catalog entry ${entry.path} has no concrete preview renderer`);
    }
    items.push({
      label: entry.label ?? entry.path,
      description: entry.description ?? "",
      detail: preview.detail,
      previewContent: preview.content,
      snippetPath: entry.path,
      entry,
      insertMode: entry.insertMode
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
    const rendered = renderStaticTemplate(entry.template);
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

function indentationUnit(editor: vscode.TextEditor): string {
  if (editor.options.insertSpaces === false) {
    return "\t";
  }
  const tabSize =
    typeof editor.options.tabSize === "number" ? editor.options.tabSize : 2;
  return " ".repeat(tabSize);
}

function indentFollowingLines(content: string, indentation: string): string {
  return content.replace(/\n(?=.)/g, `\n${indentation}`);
}

function cursorIndentation(editor: vscode.TextEditor, position: vscode.Position): string {
  const prefix = editor.document
    .lineAt(position.line)
    .text.slice(0, position.character);
  return /^\s*$/.test(prefix) ? prefix : prefix.match(/^\s*/)?.[0] ?? "";
}

const VISUALIZATION_FALLBACK = `#ifndef EDULCNI_VIS
#define EDULCNI_VIS(...) ((void)0)
#endif
#ifndef EDULCNI_STEP
#define EDULCNI_STEP(...) ((void)0)
#endif
`;

function needsVisualizationFallback(documentText: string, content: string): boolean {
  return (
    /\bEDULCNI_(?:VIS|STEP)\s*\(/.test(content) &&
    (
      !/^\s*#\s*define\s+EDULCNI_VIS\b/m.test(documentText) ||
      !/^\s*#\s*define\s+EDULCNI_STEP\b/m.test(documentText)
    )
  );
}

async function insertContent(
  editor: vscode.TextEditor,
  insertMode: InsertMode,
  content: string
): Promise<boolean> {
  const documentText = editor.document.getText();
  const fallback = needsVisualizationFallback(documentText, content)
    ? VISUALIZATION_FALLBACK
    : "";
  const offset =
    insertMode === "global"
      ? findGlobalInsertionOffset(documentText)
      : editor.document.offsetAt(editor.selection.active);
  const text =
    insertMode === "global"
      ? normalizeInsertionText(documentText, offset, content)
      : indentFollowingLines(
          content,
          cursorIndentation(editor, editor.selection.active)
        );
  const position = positionAtOffset(editor, offset);
  return editor.edit((editBuilder) => {
    if (fallback === "") {
      editBuilder.insert(position, text);
      return;
    }
    const fallbackOffset = findGlobalInsertionOffset(documentText);
    const fallbackText = normalizeInsertionText(
      documentText,
      fallbackOffset,
      fallback
    );
    if (fallbackOffset === offset) {
      editBuilder.insert(position, `${fallbackText}${text}`);
      return;
    }
    editBuilder.insert(positionAtOffset(editor, fallbackOffset), fallbackText);
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
  let helperContent = composeRecipeSections(recipe, recipeSectionsExceptSolve());
  const usageContent = `${solveChunks.map((chunk) => chunk.trim()).filter(Boolean).join("\n\n")}\n`;
  if (
    needsVisualizationFallback(
      documentText,
      `${helperContent}\n${usageContent}`
    )
  ) {
    helperContent = `${VISUALIZATION_FALLBACK}\n${helperContent}`;
  }
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
    const solveIndentation = `${cursorIndentation(
      editor,
      usagePosition
    )}${indentationUnit(editor)}`;
    const usageText =
      solveOffset === undefined
        ? indentFollowingLines(
            usageContent,
            cursorIndentation(editor, editor.selection.active)
          )
        : `\n${usageContent
            .trimEnd()
            .split("\n")
            .map((line) => (line === "" ? "" : `${solveIndentation}${line}`))
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
  const picked = await showExplainedQuickPick(items, {
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
  return showExplainedInputBox({
    title,
    prompt: customPrompt,
    ignoreFocusOut: true
  });
}

async function promptSegmentTreeOptions(
  editor: vscode.TextEditor
): Promise<RenderedSnippet | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await showExplainedQuickPick<
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
  const storageInput = await showExplainedInputBox({
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

  const fixedOutputMode: SegmentTreeOutputMode | undefined =
    scenarioPick.value === "point_query"
      ? undefined
      : scenarioPick.value === "max_subarray"
        ? "iterative_class"
        : "global_recursive";
  const outputPick: ValuePickItem<SegmentTreeOutputMode> | undefined = fixedOutputMode
    ? { label: fixedOutputMode, value: fixedOutputMode }
    : await showExplainedQuickPick<ValuePickItem<SegmentTreeOutputMode>>(
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

  const aggregatePick = await showExplainedQuickPick<ValuePickItem<SegmentAggregate>>(
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
  const updatePicks = await showExplainedQuickPick(updateItems, {
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
    const descendPicks = await showExplainedQuickPick<
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

  const sourcePick = await showExplainedQuickPick<
    ValuePickItem<SegmentTreeSourceMode>
  >(
    [
      { label: "empty size", value: "empty", picked: true },
      { label: "existing vector", value: "existing_vector" },
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
    sourceName = await showExplainedInputBox({
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

  const sourceSymbol = analysis.vectorSymbols.find(
    (symbol) => symbol.name === sourceName?.trim()
  );
  const valueTypePrompt = aggregatePick.value === "custom"
    ? "Leaf/update value type"
    : "Value type";
  const valueType = await pickStringWithCustom(
    "edulcni: segment tree",
    valueTypePrompt,
    uniqueValues([
      vectorValueType(sourceSymbol?.type) ?? "",
      "int",
      "ll",
      "long long"
    ]),
    aggregatePick.value === "custom"
      ? "C++ leaf/update value type"
      : "C++ value type"
  );
  if (valueType === undefined || valueType.trim() === "") {
    return undefined;
  }

  const indexingPick = await showExplainedQuickPick(
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

  const usagePick = await showExplainedQuickPick<
    ValuePickItem<SegmentTreeUsageMode>
  >(
    [
      { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
      { label: "instance/build skeleton", value: "instance" },
    ],
    {
      title: "edulcni: segment tree",
      placeHolder: "Generated output",
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

  const nodeType = await showExplainedInputBox({
    title: "edulcni: segment tree",
    prompt: "Custom node type name",
    value: "Node",
    validateInput: validateIdentifier,
    ignoreFocusOut: true
  });
  if (nodeType === undefined) {
    return undefined;
  }

  const leafTarget = await showExplainedInputBox({
    title: "edulcni: segment tree",
    prompt: "Leaf initialization target",
    value: "node.x",
    ignoreFocusOut: true
  });
  if (leafTarget === undefined) {
    return undefined;
  }

  const leafExpression = await showExplainedInputBox({
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
      : await showExplainedInputBox({
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
  const picked = await showExplainedQuickPick(items, {
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
  return showExplainedInputBox({
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
  const valuesName = reserveIdentifier(used, "vals", "coords");
  used.add(valuesName);

  const idFunctionName = reserveIdentifier(used, "get_id", "compress_id");
  const rewritePick = await showExplainedQuickPick<
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
    valuesName,
    idFunctionName,
    rewriteSource: rewritePick.value === "rewrite"
  };
}

async function promptInputIndexing(title: string): Promise<InputIndexing | undefined> {
  const picked = await showExplainedQuickPick<ValuePickItem<InputIndexing>>(
    [
      {
        label: "0-based values",
        value: "zero_based",
        picked: true,
        description: "Keep index values exactly as read."
      },
      {
        label: "1-based values",
        value: "one_based",
        description: "Subtract one from every selected index field."
      }
    ],
    { title, placeHolder: "Input indexing", ignoreFocusOut: true }
  );
  return picked?.value;
}

async function promptInputFields(
  title: string,
  defaultNames: string,
  needTypes: boolean
): Promise<{ fields: InputField[]; indexing: InputIndexing } | undefined> {
  const namesInput = await showExplainedInputBox({
    title,
    prompt: "Comma-separated field or variable names",
    value: defaultNames,
    ignoreFocusOut: true
  });
  if (namesInput === undefined) return undefined;
  const names = namesInput.split(",").map((name) => name.trim()).filter(Boolean);
  if (names.length === 0 || names.some((name) => validateIdentifier(name))) return undefined;

  let types = names.map(() => "int");
  if (needTypes) {
    const typeInput = await showExplainedInputBox({
      title,
      prompt: "Comma-separated types; one type applies to every field",
      value: "int",
      ignoreFocusOut: true
    });
    if (typeInput === undefined) return undefined;
    const parsed = typeInput.split(",").map((value) => value.trim()).filter(Boolean);
    if (parsed.length === 1) types = names.map(() => parsed[0]);
    else if (parsed.length === names.length) types = parsed;
    else return undefined;
  }

  const indexPicks = await showExplainedQuickPick<ValuePickItem<string>>(
    names.map((name, index) => ({ label: name, value: String(index) })),
    {
      title,
      placeHolder: "Index fields to normalize (select none for ordinary values)",
      canPickMany: true,
      ignoreFocusOut: true
    }
  );
  if (!indexPicks) return undefined;
  const indexSet = new Set(indexPicks.map((item) => Number(item.value)));
  const indexing = indexSet.size === 0
    ? "zero_based"
    : await promptInputIndexing(title);
  if (!indexing) return undefined;
  return {
    fields: names.map((name, index) => ({
      name,
      valueType: types[index],
      isIndex: indexSet.has(index)
    })),
    indexing
  };
}

async function promptInputOptions(
  editor: vscode.TextEditor
): Promise<InputOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const title = "edulcni: input";
  const shapePick = await showExplainedQuickPick<ValuePickItem<InputShape>>(
    [
      { label: "values", value: "values", description: "Read existing scalar variables." },
      { label: "vector", value: "vector", picked: true },
      { label: "matrix", value: "matrix" },
      { label: "string grid", value: "string_grid" },
      { label: "parallel arrays", value: "parallel_arrays" },
      { label: "tuple records", value: "tuple_records" },
      { label: "graph", value: "graph" },
      { label: "tree", value: "tree" },
      { label: "permutation", value: "permutation" },
      { label: "functional graph", value: "functional_graph" }
    ],
    { title, placeHolder: "Input shape", ignoreFocusOut: true }
  );
  if (!shapePick) return undefined;
  const shape = shapePick.value;
  const sizes = sizeExpressionCandidates(analysis);
  const options: InputOptions = {
    shape,
    includeReadHelper: !analysis.identifiers.has("read"),
    indexing: "zero_based"
  };

  if (shape === "values" || shape === "parallel_arrays" || shape === "tuple_records") {
    const selected = await promptInputFields(
      title,
      shape === "values" ? "a, b" : shape === "parallel_arrays" ? "a, b" : "u, v, weight",
      shape !== "values"
    );
    if (!selected) return undefined;
    options.fields = selected.fields;
    options.indexing = selected.indexing;
  }

  if (shape !== "values") {
    const semanticDefault = shape === "graph" ? "graph"
      : shape === "tree" ? "tree"
      : shape === "permutation" ? "permutation"
      : shape === "functional_graph" ? "next_vertex"
      : shape === "tuple_records" ? "records" : "a";
    if (shape !== "parallel_arrays") {
      const name = await showExplainedInputBox({
        title,
        prompt: "Output variable name",
        value: suggestIdentifier(analysis, semanticDefault, "values"),
        validateInput: validateIdentifier,
        ignoreFocusOut: true
      });
      if (!name) return undefined;
      options.name = name.trim();
    }
  }

  if (["vector", "parallel_arrays", "tuple_records", "graph", "tree", "permutation", "functional_graph"].includes(shape)) {
    const size = await pickStringWithCustom(
      title,
      shape === "graph" || shape === "tree" ? "Vertex count expression" : "Size/count expression",
      sizes,
      "Existing size expression, for example n"
    );
    if (!size) return undefined;
    options.sizeExpression = size.trim();
  }
  if (shape === "matrix" || shape === "string_grid") {
    const rows = await pickStringWithCustom(title, "Row count", sizes, "Row count expression");
    if (!rows) return undefined;
    options.rowExpression = rows.trim();
    if (shape === "matrix") {
      const columns = await pickStringWithCustom(title, "Column count", sizes, "Column count expression");
      if (!columns) return undefined;
      options.columnExpression = columns.trim();
    }
  }

  if (["vector", "matrix"].includes(shape)) {
    const type = await pickStringWithCustom(title, "Value type", ["int", "ll", "long long", "char"], "C++ value type");
    if (!type) return undefined;
    options.valueType = type.trim();
    const indexChoice = await showExplainedQuickPick<ValuePickItem<"ordinary" | "index">>(
      [
        { label: "ordinary values", value: "ordinary", picked: true },
        { label: "index values", value: "index" }
      ],
      { title, placeHolder: "Element semantics", ignoreFocusOut: true }
    );
    if (!indexChoice) return undefined;
    options.fields = [{ name: "value", valueType: options.valueType, isIndex: indexChoice.value === "index" }];
    if (indexChoice.value === "index") {
      const indexing = await promptInputIndexing(title);
      if (!indexing) return undefined;
      options.indexing = indexing;
    }
  }

  if (["vector", "matrix", "string_grid", "parallel_arrays"].includes(shape)) {
    const declaration = await showExplainedQuickPick<ValuePickItem<"declare" | "existing">>(
      [
        { label: "declare objects", value: "declare", picked: true },
        { label: "fill existing objects", value: "existing" }
      ],
      { title, placeHolder: "Declaration mode", ignoreFocusOut: true }
    );
    if (!declaration) return undefined;
    options.existing = declaration.value === "existing";
  }

  if (shape === "graph") {
    const direction = await showExplainedQuickPick<ValuePickItem<"undirected" | "directed">>(
      [
        { label: "undirected", value: "undirected", picked: true },
        { label: "directed", value: "directed" }
      ],
      { title, placeHolder: "Graph direction", ignoreFocusOut: true }
    );
    const weight = await showExplainedQuickPick<ValuePickItem<"unweighted" | "weighted">>(
      [
        { label: "unweighted", value: "unweighted", picked: true },
        { label: "weighted", value: "weighted" }
      ],
      { title, placeHolder: "Edge values", ignoreFocusOut: true }
    );
    if (!direction || !weight) return undefined;
    options.directed = direction.value === "directed";
    options.weighted = weight.value === "weighted";
    if (weight.value === "weighted") {
      const weightType = await pickStringWithCustom(title, "Weight type", ["ll", "long long", "int"], "C++ weight type");
      if (!weightType) return undefined;
      options.weightType = weightType.trim();
    }
    const edgeCount = await pickStringWithCustom(title, "Edge count expression", sizes, "Edge count expression, for example m");
    if (!edgeCount) return undefined;
    options.edgeCountExpression = edgeCount.trim();
    const indexing = await promptInputIndexing(title);
    if (!indexing) return undefined;
    options.indexing = indexing;
    const metadata = await showExplainedQuickPick<ValuePickItem<"edges" | "degrees">>(
      [
        { label: "keep edge list", value: "edges" },
        { label: "compute degrees", value: "degrees" }
      ],
      { title, placeHolder: "Additional graph outputs", canPickMany: true, ignoreFocusOut: true }
    );
    if (!metadata) return undefined;
    options.keepEdges = metadata.some((item) => item.value === "edges");
    options.degreeMetadata = metadata.some((item) => item.value === "degrees");
  }

  if (["tree", "permutation", "functional_graph"].includes(shape)) {
    const indexing = await promptInputIndexing(title);
    if (!indexing) return undefined;
    options.indexing = indexing;
  }
  if (shape === "tree") {
    const metadata = await showExplainedQuickPick<ValuePickItem<"parent" | "depth" | "subtree" | "euler">>(
      [
        { label: "parent + traversal order", value: "parent" },
        { label: "depth", value: "depth" },
        { label: "subtree sizes", value: "subtree" },
        { label: "tin/tout", value: "euler" }
      ],
      { title, placeHolder: "Tree metadata", canPickMany: true, ignoreFocusOut: true }
    );
    if (!metadata) return undefined;
    options.parentMetadata = metadata.length > 0;
    options.depthMetadata = metadata.some((item) => item.value === "depth");
    options.subtreeMetadata = metadata.some((item) => item.value === "subtree");
    options.eulerMetadata = metadata.some((item) => item.value === "euler");
    if (metadata.length > 0) {
      const root = await pickStringWithCustom(title, "Root expression", ["0"], "Root vertex expression");
      if (!root) return undefined;
      options.rootExpression = root.trim();
    }
  }
  if (shape === "permutation") {
    const metadata = await showExplainedQuickPick<ValuePickItem<"inverse" | "cycles">>(
      [
        { label: "inverse permutation", value: "inverse" },
        { label: "cycle decomposition", value: "cycles" }
      ],
      { title, placeHolder: "Permutation metadata", canPickMany: true, ignoreFocusOut: true }
    );
    if (!metadata) return undefined;
    options.inverseMetadata = metadata.some((item) => item.value === "inverse");
    options.cycleMetadata = metadata.some((item) => item.value === "cycles");
  }
  if (shape === "functional_graph") {
    const metadata = await showExplainedQuickPick<ValuePickItem<"reverse" | "indegree" | "cycles">>(
      [
        { label: "reverse graph", value: "reverse" },
        { label: "indegree", value: "indegree" },
        { label: "cycles, entry, and distance", value: "cycles" }
      ],
      { title, placeHolder: "Functional graph metadata", canPickMany: true, ignoreFocusOut: true }
    );
    if (!metadata) return undefined;
    options.reverseMetadata = metadata.some((item) => item.value === "reverse");
    options.degreeMetadata = metadata.some((item) => item.value === "indegree");
    options.cycleMetadata = metadata.some((item) => item.value === "cycles");
  }

  return options;
}

async function promptConnectedComponentsOptions(
  editor: vscode.TextEditor
): Promise<ConnectedComponentsOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const title = "edulcni: connected_components";
  const kind = await showExplainedQuickPick<ValuePickItem<ConnectedComponentsKind>>(
    [
      { label: "undirected components", value: "undirected", picked: true },
      { label: "weak directed components", value: "weak" },
      { label: "strongly connected components", value: "strong" }
    ],
    { title, placeHolder: "Component relation", ignoreFocusOut: true }
  );
  const source = await showExplainedQuickPick<ValuePickItem<"existing_graph" | "read_graph">>(
    [
      { label: "existing adjacency list", value: "existing_graph", picked: true },
      { label: "generate graph input", value: "read_graph" }
    ],
    { title, placeHolder: "Graph source", ignoreFocusOut: true }
  );
  if (!kind || !source) return undefined;
  const graphName = await showExplainedInputBox({
    title,
    prompt: "Graph variable name",
    value: suggestIdentifier(analysis, "graph", "g"),
    validateInput: validateIdentifier,
    ignoreFocusOut: true
  });
  if (!graphName) return undefined;
  const sizes = sizeExpressionCandidates(analysis);
  let sizeExpression = sizes[0] ?? "n";
  let edgeCountExpression = sizes[1] ?? "m";
  let indexing: InputIndexing = "zero_based";
  if (source.value === "read_graph") {
    const size = await pickStringWithCustom(title, "Vertex count expression", sizes, "Vertex count expression");
    const edges = await pickStringWithCustom(title, "Edge count expression", sizes, "Edge count expression");
    const base = await promptInputIndexing(title);
    if (!size || !edges || !base) return undefined;
    sizeExpression = size.trim();
    edgeCountExpression = edges.trim();
    indexing = base;
  }
  const outputs = await showExplainedQuickPick<ValuePickItem<"groups" | "sizes">>(
    [
      { label: "vertex groups", value: "groups" },
      { label: "component sizes", value: "sizes" }
    ],
    { title, placeHolder: "Additional outputs", canPickMany: true, ignoreFocusOut: true }
  );
  if (!outputs) return undefined;
  return {
    kind: kind.value,
    sourceMode: source.value,
    indexing,
    groups: outputs.some((item) => item.value === "groups"),
    sizes: outputs.some((item) => item.value === "sizes"),
    graphName: graphName.trim(),
    sizeExpression,
    edgeCountExpression,
    resultName: suggestIdentifier(analysis, "components", "cc"),
    includeReadHelper: source.value === "read_graph" && !analysis.identifiers.has("read"),
    names: planConnectedComponentsNames(analysis)
  };
}

async function promptSegmentTreeBeatsOptions(
  editor: vscode.TextEditor
): Promise<SegmentTreeBeatsOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const scenarioPick = await showExplainedQuickPick<
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

  const sourcePick = await showExplainedQuickPick<
    ValuePickItem<SegmentTreeBeatsSourceMode>
  >(
    [
      { label: "empty size", value: "empty", picked: true },
      { label: "existing vector", value: "existing_vector" },
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
    sourceName = await showExplainedInputBox({
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
      : await showExplainedQuickPick<ValuePickItem<SegmentTreeBeatsUpdate>>(
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

  const queryPicks = await showExplainedQuickPick<
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

  const indexingPick = await showExplainedQuickPick(
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

  const usagePick = await showExplainedQuickPick<
    ValuePickItem<SegmentTreeBeatsUsageMode>
  >(
    [
      { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
      { label: "instance/build skeleton", value: "instance" },
    ],
    {
      title: "edulcni: segtree_beats",
      placeHolder: "Generated output",
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
  const scenarioPick = await showExplainedQuickPick<
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

  const sourceModePick = await showExplainedQuickPick<
    ValuePickItem<ImplicitTreapSourceMode>
  >(
    [
      { label: "empty treap", value: "empty", picked: true },
      { label: "existing vector", value: "existing_vector" },
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
    sourceName = await showExplainedInputBox({
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

  const aggregatePick = await showExplainedQuickPick<
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
      : await showExplainedQuickPick<ValuePickItem<ImplicitTreapFeature>>(
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

  const indexingPick = await showExplainedQuickPick(
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

  const usagePick = await showExplainedQuickPick<
    ValuePickItem<ImplicitTreapUsageMode>
  >(
    [
      { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
      { label: "instance/build skeleton", value: "instance" },
    ],
    {
      title: "edulcni: implicit_treap",
      placeHolder: "Generated output",
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
  const scenarioPick = await showExplainedQuickPick<
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
  const queryPicks = await showExplainedQuickPick<
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

  const sourceModePick = await showExplainedQuickPick<
    ValuePickItem<MergeSortTreeSourceMode>
  >(
    [
      { label: "existing vector", value: "existing_vector", picked: true },
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

  const indexingPick = await showExplainedQuickPick(
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

  const usagePick = await showExplainedQuickPick<
    ValuePickItem<MergeSortTreeUsageMode>
  >(
    [
      { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
      { label: "instance/build skeleton", value: "instance" },
    ],
    {
      title: "edulcni: merge_sort_tree",
      placeHolder: "Generated output",
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
  const scenarioPick = await showExplainedQuickPick<ValuePickItem<DsuApplication>>(
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

  const usagePick = await showExplainedQuickPick<ValuePickItem<DsuUsageMode>>(
    scenarioPick.value === "query_loop"
        ? [{ label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true }]
        : [
            { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
            { label: "instance skeleton", value: "instance" },
          ],
    {
      title: "edulcni: dsu",
      placeHolder: "Generated output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  const indexingPick = await showExplainedQuickPick<ValuePickItem<DsuIndexing>>(
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
  const scenarioPick = await showExplainedQuickPick<
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

  const usagePick = await showExplainedQuickPick<
    ValuePickItem<RollbackDsuUsageMode>
  >(
    [
      { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
      { label: "instance skeleton", value: "instance" },
    ],
    {
      title: "edulcni: rollback_dsu",
      placeHolder: "Generated output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  const indexingPick = await showExplainedQuickPick<
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
  const scenarioPick = await showExplainedQuickPick<ValuePickItem<LcaApplication>>(
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

  const sourcePick = await showExplainedQuickPick<ValuePickItem<LcaSourceMode>>(
    [
      { label: "empty helper", value: "empty", picked: true },
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

  const usagePick = await showExplainedQuickPick<ValuePickItem<LcaUsageMode>>(
    scenarioPick.value === "tree_query_loop"
      ? [{ label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true }]
      : [
          { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
          { label: "instance skeleton", value: "instance" },
        ],
    {
      title: "edulcni: lca",
      placeHolder: "Generated output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  const indexingPick = await showExplainedQuickPick<ValuePickItem<LcaIndexing>>(
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
  const scenarioPick = await showExplainedQuickPick<ValuePickItem<HldApplication>>(
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

  const sourcePick = await showExplainedQuickPick<ValuePickItem<HldSourceMode>>(
    [
      { label: "empty helper", value: "empty", picked: true },
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

  const valueModePick = await showExplainedQuickPick<ValuePickItem<HldValueMode>>(
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

  const usagePick = await showExplainedQuickPick<ValuePickItem<HldUsageMode>>(
    scenarioPick.value === "path_query"
      ? [
          { label: "instance skeleton", value: "instance", picked: true },
          { label: "definitions only", description: "types and functions, without example calls", value: "helper_only" },
          { label: "instance skeleton", value: "instance" }
        ]
      : [
          { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
          { label: "instance skeleton", value: "instance" },
        ],
    {
      title: "edulcni: hld",
      placeHolder: "Generated output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  const indexingPick = await showExplainedQuickPick<ValuePickItem<HldIndexing>>(
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
  const scenarioPick = await showExplainedQuickPick<ValuePickItem<BfsApplication>>(
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

  const usagePick = await showExplainedQuickPick<ValuePickItem<BfsUsageMode>>(
    scenarioPick.value === "multi_source"
      ? [
          { label: "multi-source run", value: "multi_source", picked: true },
          { label: "Reusable API only", description: "Emit BFS result/path helpers without a call.", value: "helper_only" }
        ]
      : scenarioPick.value === "path_restore"
        ? [
            { label: "path query skeleton", value: "path_query", picked: true },
            { label: "single-source run", value: "single_source" },
            { label: "Reusable API only", description: "Emit BFS result/path helpers without a call.", value: "helper_only" }
          ]
        : [
            { label: "Reusable API only", description: "Emit BFS result/path helpers without a call.", value: "helper_only", picked: true },
            { label: "Run from one source", description: "Call bfs(graph, source) and store distances, parents, and order.", value: "single_source" },
            { label: "Run from multiple sources", description: "Call multi-source BFS on the existing adjacency list.", value: "multi_source" },
            { label: "Restore one path", description: "Run BFS, then restore source-to-target vertices.", value: "path_query" }
          ],
    {
      title: "edulcni: bfs",
      placeHolder: "Generated output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  let graphName = "graph";
  if (usagePick.value !== "helper_only") {
    const pickedGraph = await pickStringWithCustom(
      "edulcni: bfs",
      "Existing graph variable",
      uniqueValues([...bindingCandidates(analysis, "source_vector").map((item) => item.value), "graph"]),
      "Adjacency-list variable name"
    );
    if (pickedGraph === undefined || pickedGraph.trim() === "") return undefined;
    graphName = pickedGraph.trim();
  }

  return {
    application: scenarioPick.value,
    sourceMode: "existing_graph",
    graphMode: "directed",
    indexing: "zero_based",
    usageMode: usagePick.value,
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    graphName,
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
  const scenarioPick = await showExplainedQuickPick<ValuePickItem<DijkstraApplication>>(
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

  const usagePick = await showExplainedQuickPick<ValuePickItem<DijkstraUsageMode>>(
    scenarioPick.value === "multi_source"
      ? [
          { label: "multi-source run", value: "multi_source", picked: true },
          { label: "Reusable API only", description: "Emit weighted shortest-path helpers without a call.", value: "helper_only" }
        ]
      : scenarioPick.value === "path_restore"
        ? [
            { label: "path query skeleton", value: "path_query", picked: true },
            { label: "single-source run", value: "single_source" },
            { label: "Reusable API only", description: "Emit weighted shortest-path helpers without a call.", value: "helper_only" }
          ]
          : [
              { label: "Reusable API only", description: "Emit weighted shortest-path helpers without a call.", value: "helper_only", picked: true },
              { label: "Run from one source", description: "Call dijkstra(graph, source, inf) and store distances and parents.", value: "single_source" },
              { label: "Run from multiple sources", description: "Call multi-source Dijkstra on the existing weighted adjacency list.", value: "multi_source" },
              { label: "Restore one path", description: "Run Dijkstra, then restore source-to-target vertices.", value: "path_query" }
            ],
    {
      title: "edulcni: dijkstra",
      placeHolder: "Generated output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  let graphName = "graph";
  if (usagePick.value !== "helper_only") {
    const pickedGraph = await pickStringWithCustom(
      "edulcni: dijkstra",
      "Existing weighted graph variable",
      uniqueValues([...bindingCandidates(analysis, "source_vector").map((item) => item.value), "graph"]),
      "Weighted adjacency-list variable name"
    );
    if (pickedGraph === undefined || pickedGraph.trim() === "") return undefined;
    graphName = pickedGraph.trim();
  }

  return {
    application: scenarioPick.value,
    sourceMode: "existing_graph",
    graphMode: "directed",
    indexing: "zero_based",
    usageMode: usagePick.value,
    valueType: valueType.trim(),
    infExpression: infExpression.trim(),
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    graphName,
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
  const scenarioPick = await showExplainedQuickPick<ValuePickItem<ToposortApplication>>(
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

  const usagePick = await showExplainedQuickPick<ValuePickItem<ToposortUsageMode>>(
    scenarioPick.value === "cycle_detection"
      ? [
          { label: "cycle check", value: "cycle_check", picked: true },
          { label: "Reusable API only", description: "Emit sorting and validation helpers without a call.", value: "helper_only" },
          { label: "sort and print order", value: "sort_order" }
        ]
      : scenarioPick.value === "order_validation"
        ? [
            { label: "validate supplied order", value: "validate_order", picked: true },
            { label: "Reusable API only", description: "Emit sorting and validation helpers without a call.", value: "helper_only" }
          ]
        : scenarioPick.value === "dependency_schedule"
          ? [
              { label: "sort and print order", value: "sort_order", picked: true },
              { label: "cycle check", value: "cycle_check" },
              { label: "Reusable API only", description: "Emit sorting and validation helpers without a call.", value: "helper_only" }
            ]
          : [
              { label: "Reusable API only", description: "Emit sorting and validation helpers without a call.", value: "helper_only", picked: true },
              { label: "Sort and print order", description: "Call topological_sort(graph) and print the returned vertices.", value: "sort_order" },
              { label: "Check for a cycle", description: "Call topological_sort(graph) and store whether all vertices were returned.", value: "cycle_check" },
              { label: "Validate an order", description: "Call is_topological_order(graph, order) for an existing order.", value: "validate_order" }
            ],
    {
      title: "edulcni: toposort",
      placeHolder: "Generated output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  let graphName = "graph";
  if (usagePick.value !== "helper_only") {
    const pickedGraph = await pickStringWithCustom(
      "edulcni: toposort", "Existing directed graph variable",
      uniqueValues([...bindingCandidates(analysis, "source_vector").map((item) => item.value), "graph"]),
      "Directed adjacency-list variable name"
    );
    if (pickedGraph === undefined || pickedGraph.trim() === "") return undefined;
    graphName = pickedGraph.trim();
  }

  return {
    application: scenarioPick.value,
    sourceMode: "existing_graph",
    indexing: "zero_based",
    usageMode: usagePick.value,
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    graphName,
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
  const scenarioPick = await showExplainedQuickPick<ValuePickItem<KosarajuApplication>>(
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

  const usagePick = await showExplainedQuickPick<ValuePickItem<KosarajuUsageMode>>(
    scenarioPick.value === "same_component"
      ? [
          { label: "compute SCC", value: "compute_scc", picked: true },
          { label: "compute SCC", value: "compute_scc" },
          { label: "Reusable API only", description: "Emit SCC helpers without a call.", value: "helper_only" }
        ]
      : scenarioPick.value === "condensation_dag"
        ? [
            { label: "compute SCC", value: "compute_scc", picked: true },
            { label: "print components", value: "print_components" },
            { label: "Reusable API only", description: "Emit SCC helpers without a call.", value: "helper_only" }
          ]
        : [
            { label: "Reusable API only", description: "Emit SCC helpers without a call.", value: "helper_only", picked: true },
            { label: "Compute SCC result", description: "Call kosaraju_scc(graph) and store component ids.", value: "compute_scc" },
            { label: "Print components", description: "Compute SCCs, group vertices by id, and print each group.", value: "print_components" }
          ],
    {
      title: "edulcni: kosaraju",
      placeHolder: "Generated output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  let graphName = "graph";
  if (usagePick.value !== "helper_only") {
    const pickedGraph = await pickStringWithCustom(
      "edulcni: kosaraju", "Existing directed graph variable",
      uniqueValues([...bindingCandidates(analysis, "source_vector").map((item) => item.value), "graph"]),
      "Directed adjacency-list variable name"
    );
    if (pickedGraph === undefined || pickedGraph.trim() === "") return undefined;
    graphName = pickedGraph.trim();
  }

  return {
    application: scenarioPick.value,
    sourceMode: "existing_graph",
    indexing: "zero_based",
    usageMode: usagePick.value,
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    queryCountName: bindingCandidates(analysis, "query_count")[0]?.value ?? "q",
    graphName,
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
  const scenarioPick = await showExplainedQuickPick<ValuePickItem<MoApplication>>(
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

  const sourcePick = await showExplainedQuickPick<ValuePickItem<MoSourceMode>>(
    [
      { label: "existing query vector", value: "existing_queries", picked: true },
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

  const indexingPick = await showExplainedQuickPick<ValuePickItem<MoIndexing>>(
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

  const usagePick = await showExplainedQuickPick<ValuePickItem<MoUsageMode>>(
    scenarioPick.value === "distinct_values"
      ? [
          { label: "distinct-count skeleton", value: "distinct_count_skeleton", picked: true },
          { label: "definitions only", description: "types and functions, without example calls", value: "helper_only" },
          { label: "generic processor skeleton", value: "process_skeleton" }
        ]
      : scenarioPick.value === "custom_callbacks"
        ? [
            { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
            { label: "generic processor skeleton", value: "process_skeleton" },
          ]
        : [
            { label: "generic processor skeleton", value: "process_skeleton", picked: true },
            { label: "definitions only", description: "types and functions, without example calls", value: "helper_only" },
            { label: "distinct-count skeleton", value: "distinct_count_skeleton" }
          ],
    {
      title: "edulcni: mo",
      placeHolder: "Generated output",
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
  const scenarioPick = await showExplainedQuickPick<ValuePickItem<MonotonicStackApplication>>(
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

  const relationPick = await showExplainedQuickPick<ValuePickItem<MonotonicStackRelation>>(
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

  const directionPick = await showExplainedQuickPick<ValuePickItem<MonotonicStackDirection>>(
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

  const strictnessPick = await showExplainedQuickPick<ValuePickItem<MonotonicStackStrictness>>(
    [
      { label: "Strict", description: "Equal values do not qualify as smaller/greater neighbors.", value: "strict", picked: true },
      { label: "Allow equal", description: "Equal values qualify as the nearest non-strict neighbor.", value: "non_strict" }
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

  const usagePick = await showExplainedQuickPick<ValuePickItem<MonotonicStackUsageMode>>(
    [
      { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
      { label: "compute vector", value: "compute_vector" },
      { label: "compute all", value: "compute_all" }
    ],
    {
      title: "edulcni: monotonic_stack",
      placeHolder: "Generated output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  let sourceName = "values";
  if (usagePick.value !== "helper_only") {
    const pickedSource = await pickStringWithCustom(
      "edulcni: monotonic_stack", "Existing source vector",
      uniqueValues([...bindingCandidates(analysis, "source_vector").map((item) => item.value), "values", "a"]),
      "Source vector for nearest-index computation"
    );
    if (pickedSource === undefined || pickedSource.trim() === "") return undefined;
    sourceName = pickedSource.trim();
  }

  return {
    application: scenarioPick.value,
    direction: directionPick.value,
    relation: relationPick.value,
    strictness: strictnessPick.value,
    usageMode: usagePick.value,
    sourceName,
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
  const scenarioPick = await showExplainedQuickPick<ValuePickItem<GpHashTableApplication>>(
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

  const usagePick = await showExplainedQuickPick<ValuePickItem<GpHashTableUsageMode>>(
    scenarioPick.value === "hash_set"
      ? [
          { label: "declare set", value: "declare_set", picked: true },
          { label: "definitions only", description: "types and functions, without example calls", value: "helper_only" },
          { label: "declare map", value: "declare_map" }
        ]
      : scenarioPick.value === "frequency_table"
        ? [
            { label: "frequency loop", value: "frequency_loop", picked: true },
            { label: "declare map", value: "declare_map" },
            { label: "definitions only", description: "types and functions, without example calls", value: "helper_only" }
          ]
        : [
            { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
            { label: "declare map", value: "declare_map" },
            { label: "declare set", value: "declare_set" },
            { label: "frequency loop", value: "frequency_loop" }
          ],
    {
      title: "edulcni: gp_hash_table",
      placeHolder: "Generated output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  let sourceName = "values";
  if (usagePick.value === "frequency_loop") {
    const pickedSource = await pickStringWithCustom(
      "edulcni: gp_hash_table", "Existing source vector",
      uniqueValues([...bindingCandidates(analysis, "source_vector").map((item) => item.value), "values", "a"]),
      "Source vector for frequency loop"
    );
    if (pickedSource === undefined || pickedSource.trim() === "") return undefined;
    sourceName = pickedSource.trim();
  }

  return {
    application: scenarioPick.value,
    usageMode: usagePick.value,
    keyType: keyType.trim(),
    valueType: valueType.trim(),
    tableName: suggestIdentifier(analysis, "table", "hash_table"),
    sourceName,
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
  const scenarioPick = await showExplainedQuickPick<ValuePickItem<OrderedSetApplication>>(
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

  const usagePick = await showExplainedQuickPick<ValuePickItem<OrderedSetUsageMode>>(
    scenarioPick.value === "kth_element"
      ? [
          { label: "kth query", value: "kth_query", picked: true },
          { label: "declare set", value: "declare_set" },
          { label: "definitions only", description: "types and functions, without example calls", value: "helper_only" }
        ]
      : scenarioPick.value === "rank_queries"
        ? [
            { label: "rank query", value: "rank_query", picked: true },
            { label: "declare set", value: "declare_set" },
            { label: "definitions only", description: "types and functions, without example calls", value: "helper_only" }
          ]
        : scenarioPick.value === "multiset_pairs"
          ? [
              { label: "pair-key multiset", value: "pair_multiset", picked: true },
              { label: "definitions only", description: "types and functions, without example calls", value: "helper_only" }
            ]
          : [
              { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
              { label: "declare set", value: "declare_set" },
              { label: "rank query", value: "rank_query" },
              { label: "kth query", value: "kth_query" },
              { label: "pair-key multiset", value: "pair_multiset" }
            ],
    {
      title: "edulcni: ordered_set",
      placeHolder: "Generated output",
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
  const scenarioPick = await showExplainedQuickPick<ValuePickItem<SetUtilsApplication>>(
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

  const lookupPick = await showExplainedQuickPick<ValuePickItem<SetUtilsLookup>>(
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

  const targetPick = await showExplainedQuickPick<ValuePickItem<SetUtilsTarget>>(
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

  const usagePick = await showExplainedQuickPick<ValuePickItem<SetUtilsUsageMode>>(
    [
      { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
      { label: "lookup snippet", value: "lookup_snippet" }
    ],
    {
      title: "edulcni: set_utils",
      placeHolder: "Generated output",
      ignoreFocusOut: true
    }
  );
  if (!usagePick) {
    return undefined;
  }

  let containerName = "container";
  if (usagePick.value !== "helper_only") {
    const pickedContainer = await pickStringWithCustom(
      "edulcni: set_utils", "Existing ordered container",
      ["container", "st", "mp", "s"], "Ordered container variable"
    );
    if (pickedContainer === undefined || pickedContainer.trim() === "") return undefined;
    containerName = pickedContainer.trim();
  }

  return {
    application: scenarioPick.value,
    lookup: lookupPick.value,
    target: targetPick.value,
    usageMode: usagePick.value,
    containerName,
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
  const scenarioPick = await showExplainedQuickPick<ValuePickItem<FastAllocatorApplication>>(
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

  const usagePick = await showExplainedQuickPick<ValuePickItem<FastAllocatorUsageMode>>(
    scenarioPick.value === "graph_edges"
      ? [
          { label: "edge vector", value: "edge_vector", picked: true },
          { label: "vector declaration", value: "vector_declaration" },
          { label: "definitions only", description: "types and functions, without example calls", value: "helper_only" }
        ]
      : scenarioPick.value === "pool_reset"
        ? [
            { label: "arena reset", value: "arena_reset", picked: true },
            { label: "definitions only", description: "types and functions, without example calls", value: "helper_only" },
            { label: "vector declaration", value: "vector_declaration" }
          ]
        : [
            { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
            { label: "vector declaration", value: "vector_declaration" },
            { label: "edge vector", value: "edge_vector" },
            { label: "arena reset", value: "arena_reset" }
          ],
    {
      title: "edulcni: fast_allocator",
      placeHolder: "Generated output",
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
  const scenarioPick = await showExplainedQuickPick<ValuePickItem<GeometryApplication>>(
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

  const usagePick = await showExplainedQuickPick<ValuePickItem<GeometryUsageMode>>(
    scenarioPick.value === "orientation"
      ? [
          { label: "orientation check", value: "orientation_check", picked: true },
          { label: "definitions only", description: "types and functions, without example calls", value: "helper_only" }
        ]
      : scenarioPick.value === "segment_intersection"
        ? [
            { label: "segment intersection", value: "segment_intersection", picked: true },
            { label: "definitions only", description: "types and functions, without example calls", value: "helper_only" }
          ]
        : scenarioPick.value === "angle_sort"
          ? [
              { label: "sort points by angle", value: "sort_points", picked: true },
              { label: "definitions only", description: "types and functions, without example calls", value: "helper_only" }
            ]
          : [
              { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
              { label: "build convex hull", value: "build_hull" },
              { label: "segment intersection", value: "segment_intersection" }
            ],
    {
      title: "edulcni: geometry",
      placeHolder: "Generated output",
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
  const scenarioPick = await showExplainedQuickPick<ValuePickItem<HalfplaneIntersectionApplication>>(
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

  const usagePick = await showExplainedQuickPick<ValuePickItem<HalfplaneIntersectionUsageMode>>(
    scenarioPick.value === "linear_constraints"
      ? [
          { label: "inequality box", value: "inequality_box", picked: true },
          { label: "compute polygon", value: "compute_polygon" },
          { label: "definitions only", description: "types and functions, without example calls", value: "helper_only" }
        ]
      : [
          { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
          { label: "half-plane vector", value: "halfplane_vector" },
          { label: "compute polygon", value: "compute_polygon" }
        ],
    {
      title: "edulcni: halfplane_intersection",
      placeHolder: "Generated output",
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
  const scenarioPick = await showExplainedQuickPick<
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
  const operationPick = await showExplainedQuickPick<
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

  const sourcePick = await showExplainedQuickPick<
    ValuePickItem<FenwickSourceMode>
  >(
    [
      { label: "empty size", value: "empty", picked: true },
      { label: "existing vector", value: "existing_vector" },
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

  const indexingPick = await showExplainedQuickPick<
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

  const usagePick = await showExplainedQuickPick<
    ValuePickItem<FenwickUsageMode>
  >(
    [
      { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
      { label: "instance initialization", value: "instance" },
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
  const modePick = await showExplainedQuickPick<ValuePickItem<ModIntMode>>(
    [
      {
        label: "Static only",
        description: "Compile-time modulus; smallest and fastest generated API.",
        value: "static",
        picked: true
      },
      {
        label: "Static and dynamic",
        description: "Emit both APIs; use only when one solution needs compile-time and runtime moduli.",
        value: "both"
      },
      {
        label: "Dynamic only",
        description: "Runtime-mutable modulus via set_mod; adds global mutable state.",
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
    const providedMod = await showExplainedInputBox({
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

async function promptModularPrecalcOptions(
  editor: vscode.TextEditor,
  title: string,
  includeBase: boolean
): Promise<ModularPrecalcOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const valueType = await pickStringWithCustom(
    title,
    "Value type",
    customValueTypeCandidates(analysis),
    "C++ type, for example Mint"
  );
  if (!valueType?.trim()) {
    return undefined;
  }
  const limitExpression = await pickStringWithCustom(
    title,
    "Maximum exponent / index",
    sizeExpressionCandidates(analysis),
    "Maximum index expression, for example n or MAXN"
  );
  if (!limitExpression?.trim()) {
    return undefined;
  }
  let baseExpression: string | undefined;
  if (includeBase) {
    baseExpression = await pickStringWithCustom(
      title,
      "Power base",
      ["2", "base"],
      "Base expression"
    );
    if (!baseExpression?.trim()) {
      return undefined;
    }
  }
  return {
    valueType: valueType.trim(),
    limitExpression: limitExpression.trim(),
    baseExpression: baseExpression?.trim()
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
    includeConvolution: false,
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
  const picked = await showExplainedQuickPick(items, {
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
  return showExplainedInputBox({
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
  const scenarioPick = await showExplainedQuickPick<
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
  const variantPicks = await showExplainedQuickPick<
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

  const sourceModePick = await showExplainedQuickPick<
    ValuePickItem<SparseTableSourceMode>
  >(
    [
      { label: "existing vector", value: "existing_vector", picked: true },
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

  const indexingPick = await showExplainedQuickPick(
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

  const usagePick = await showExplainedQuickPick<
    ValuePickItem<SparseTableUsageMode>
  >(
    [
      { label: "definitions only", description: "types and functions, without example calls", value: "helper_only", picked: true },
      { label: "build call", value: "build_call" },
    ],
    {
      title: "edulcni: sparse_table",
      placeHolder: "Generated output",
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
  const inputPick = await showExplainedQuickPick<
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

  const sourceName = inputPick.value === "string" ? "s" : "values";

  const featurePicks = await showExplainedQuickPick<
    ValuePickItem<SuffixArrayFeature>
  >(
    [
      { label: "strip empty suffix", description: "Return only suffixes of the original sequence, excluding the sentinel.", value: "stripped_sa" },
      { label: "rank array", description: "Also map each suffix start to its position in suffix order.", value: "rank" },
      { label: "lcp array", description: "Also compute adjacent longest-common-prefix lengths.", value: "lcp" },
      { label: "lcp range queries", description: "Add sparse-table RMQ over LCP; also enables rank and LCP arrays.", value: "lcp_rmq" }
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
    sourceName,
    features: featurePicks.map((item) => item.value),
    names: planSuffixArrayNames(analysis),
    includeUsageComment: true
  };
}

async function promptFftNttOptions(
  editor: vscode.TextEditor
): Promise<FftNttOptions | undefined> {
  const analysis = analyzeCppDocument(editor.document.getText());
  const transformPick = await showExplainedQuickPick<
    ValuePickItem<FftNttTransform>
  >(
    [
      { label: "Complex FFT", description: "Floating-point transform; convolution rounds coefficients back to integers.", value: "fft", picked: true },
      { label: "Modular NTT", description: "Exact modulo a suitable prime; length must divide mod - 1 and use its primitive root.", value: "ntt" }
    ],
    {
      title: "edulcni: fft_ntt",
      placeHolder: "Transform to generate",
      ignoreFocusOut: true
    }
  );
  if (!transformPick) {
    return undefined;
  }
  const transforms = [transformPick.value];

  const helperPick = await showExplainedQuickPick<
    ValuePickItem<"convolution" | "transform">
  >(
    [
      { label: "Transform only", description: "Emit the selected transform API without convolution wrappers.", value: "transform", picked: true },
      { label: "Transform + convolution", description: "Also emit a ready-to-call polynomial convolution wrapper.", value: "convolution" }
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
  const inputPick = await showExplainedQuickPick<
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

  const sourceName = inputPick.value === "string" ? "s" : "values";

  const featurePicks = await showExplainedQuickPick<
    ValuePickItem<PolyHashFeature>
  >(
    [
      { label: "substring equality", value: "substring_equal", picked: true },
      { label: "combine hashes", value: "concat", picked: true },
      { label: "reverse/palindrome queries", description: "Add reverse hashes used to compare a range with its reversal.", value: "reverse" },
      { label: "lcp by binary search", description: "Add LCP search built on substring-hash comparisons.", value: "lcp" }
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

  const constantsPick = await showExplainedQuickPick<
    ValuePickItem<"default" | "custom">
  >(
    [
      { label: "Defaults: 1e9+7, 1e9+9, base 911382323", description: "Use the built-in double-hash constants.", value: "default", picked: true },
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
    sourceName,
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

  const featurePicks = await showExplainedQuickPick<
    ValuePickItem<MaxflowDinicFeature>
  >(
    [
      { label: "min-cut side", description: "Add residual reachability after max-flow for extracting a minimum cut.", value: "min_cut" },
      { label: "graph/edge access", description: "Expose residual edges for post-processing.", value: "graph_access" },
      { label: "reset flows", description: "Add a method that restores every residual capacity for reruns.", value: "reset_flows" }
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

  const inputPick = await showExplainedQuickPick<
    ValuePickItem<"helper" | "read_call">
  >(
    [
      { label: "definitions only", description: "types and functions, without input or example calls", value: "helper", picked: true },
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
    features: featurePicks.map((item) => item.value),
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

  const featurePicks = await showExplainedQuickPick<
    ValuePickItem<MinCostMaxFlowFeature>
  >(
    [
      { label: "graph/edge access", description: "Expose residual edges for post-processing.", value: "graph_access" },
      { label: "potential access", description: "Expose final Johnson potentials for inspection.", value: "potential_access" }
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

  const modePick = await showExplainedQuickPick<
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

  const inputPick = await showExplainedQuickPick<
    ValuePickItem<"helper" | "read_call">
  >(
    [
      { label: "definitions only", description: "types and functions, without input or example calls", value: "helper", picked: true },
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

  const sourceMode = await showExplainedQuickPick<
    ValuePickItem<"existing" | "read">
  >(
    [
      { label: "use existing matrix", value: "existing", picked: true },
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

  const modePick = await showExplainedQuickPick<ValuePickItem<HungarianMode>>(
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

  const rectangularPick = await showExplainedQuickPick<
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

  const featurePicks = await showExplainedQuickPick<
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

  const inputPick = await showExplainedQuickPick<
    ValuePickItem<"helper" | "read_call">
  >(
    [
      { label: "definitions only", description: "types and functions, without input or example calls", value: "helper", picked: true },
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
    const indexingPick = await showExplainedQuickPick<
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
  const featurePicks = await showExplainedQuickPick<
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
  const featurePicks = await showExplainedQuickPick<
    ValuePickItem<BerlekampMasseyFeature>
  >(
    [
      {
        label: "minimal recurrence",
        value: "minimal_recurrence",
        picked: true,
        description: "Recover the shortest linear recurrence from field-valued samples."
      },
      {
        label: "kth from recurrence",
        value: "kth_term",
        description: "Evaluate a known recurrence at an arbitrary nonnegative index."
      },
      {
        label: "one-shot kth",
        value: "one_shot_kth",
        description: "Recover the recurrence and evaluate its kth term in one call."
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
    valueType: "Mint",
    sequenceName: "sequence",
    indexName: "k",
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
        path: "/templates/segtree",
        insertMode: "global",
        generator: "segtree",
        label: "/templates/segtree",
        description: "interactive inline segment tree generator",
        detail: "interactive / template"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        return promptSegmentTreeOptions(editor);
      },
      defaultSnippet(analysis: CppAnalysis): RenderedSnippet {
        return renderRecipeSnippet(
          renderSegmentTreeRecipe({
            sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
            valueType: "int",
            aggregate: "sum",
            updates: ["point_set"],
            descends: [],
            application: "point_query",
            sourceMode: "empty",
            indexing: "zero_based",
            usageMode: "helper_only",
            instanceName: "seg",
            answerName: "ans",
            names: planSegmentTreeNames(analysis),
            outputMode: "global_recursive"
          })
        );
      }
    }
  ],
  [
    "segtree_beats",
    {
      catalogEntry: {
        path: "/templates/segtree_beats",
        insertMode: "global",
        generator: "segtree_beats",
        label: "/templates/segtree_beats",
        description: "dynamic segment tree beats helper",
        detail: "dynamic / template"
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
        path: "/templates/compress_unique",
        insertMode: "cursor",
        generator: "compress_unique",
        label: "/templates/compress_unique",
        description: "interactive coordinate compression snippet",
        detail: "interactive / template"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptCompressUniqueOptions(editor);
        return options
          ? { content: renderCompressUnique(options), renames: [], exports: [] }
          : undefined;
      },
      defaultSnippet(analysis: CppAnalysis): RenderedSnippet {
        const sourceName = analysis.vectorSymbols[0]?.name ?? "a";
        const used = new Set(analysis.identifiers);
        used.add(sourceName);
        const valuesName = reserveIdentifier(used, "vals", "coords");
        used.add(valuesName);
        return {
          content: renderCompressUnique({
            sourceName,
            valuesName,
            idFunctionName: reserveIdentifier(used, "get_id", "compress_id"),
            rewriteSource: true
          }),
          renames: [],
          exports: []
        };
      }
    }
  ],
  [
    "input",
    {
      catalogEntry: {
        path: "/templates/input",
        insertMode: "cursor",
        generator: "input",
        label: "/templates/input",
        description: "structured input generator using read()",
        detail: "interactive / template"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptInputOptions(editor);
        return options ? renderRecipeSnippet(renderInputRecipe(options)) : undefined;
      },
      defaultSnippet(analysis: CppAnalysis): RenderedSnippet {
        return renderRecipeSnippet(renderInputRecipe({
          shape: "vector",
          includeReadHelper: !analysis.identifiers.has("read"),
          name: suggestIdentifier(analysis, "a", "values"),
          sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
          valueType: "int",
          fields: [{ name: "value", valueType: "int" }],
          indexing: "zero_based"
        }));
      }
    }
  ],
  [
    "connected_components",
    {
      catalogEntry: {
        path: "/templates/connected_components",
        insertMode: "global",
        generator: "connected_components",
        label: "/templates/connected_components",
        description: "undirected, weak, or strong graph components",
        detail: "dynamic / template"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptConnectedComponentsOptions(editor);
        return options
          ? renderRecipeSnippet(renderConnectedComponentsRecipe(options))
          : undefined;
      },
      defaultSnippet(analysis: CppAnalysis, extraReserved: string[]): RenderedSnippet {
        return renderRecipeSnippet(renderConnectedComponentsRecipe({
          kind: "undirected",
          sourceMode: "existing_graph",
          indexing: "zero_based",
          groups: false,
          sizes: false,
          graphName: "graph",
          sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
          edgeCountExpression: sizeExpressionCandidates(analysis)[1] ?? "m",
          resultName: "components",
          includeReadHelper: false,
          names: planConnectedComponentsNames(analysis, extraReserved)
        }));
      }
    }
  ],
  [
    "dsu",
    {
      catalogEntry: {
        path: "/templates/dsu",
        insertMode: "global",
        generator: "dsu",
        label: "/templates/dsu",
        description: "dynamic disjoint set union helper",
        detail: "dynamic / template"
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
        path: "/templates/rollback_dsu",
        insertMode: "global",
        generator: "rollback_dsu",
        label: "/templates/rollback_dsu",
        description: "dynamic rollback disjoint set union helper",
        detail: "dynamic / template"
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
        path: "/templates/lca",
        insertMode: "global",
        generator: "lca",
        label: "/templates/lca",
        description: "dynamic binary lifting LCA helper",
        detail: "dynamic / template"
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
        path: "/templates/hld",
        insertMode: "global",
        generator: "hld",
        label: "/templates/hld",
        description: "dynamic heavy-light decomposition helper",
        detail: "dynamic / template"
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
        path: "/templates/bfs",
        insertMode: "global",
        generator: "bfs",
        label: "/templates/bfs",
        description: "dynamic BFS graph traversal helper",
        detail: "dynamic / template"
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
        path: "/templates/dijkstra",
        insertMode: "global",
        generator: "dijkstra",
        label: "/templates/dijkstra",
        description: "dynamic Dijkstra shortest path helper",
        detail: "dynamic / template"
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
        path: "/templates/toposort",
        insertMode: "global",
        generator: "toposort",
        label: "/templates/toposort",
        description: "dynamic topological sorting helper",
        detail: "dynamic / template"
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
        path: "/templates/kosaraju",
        insertMode: "global",
        generator: "kosaraju",
        label: "/templates/kosaraju",
        description: "dynamic Kosaraju SCC helper",
        detail: "dynamic / template"
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
        path: "/templates/mo",
        insertMode: "global",
        generator: "mo",
        label: "/templates/mo",
        description: "dynamic Mo offline range query helper",
        detail: "dynamic / template"
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
        path: "/templates/monotonic_stack",
        insertMode: "global",
        generator: "monotonic_stack",
        label: "/templates/monotonic_stack",
        description: "dynamic monotonic stack nearest-index helper",
        detail: "dynamic / template"
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
        path: "/templates/gp_hash_table",
        insertMode: "global",
        generator: "gp_hash_table",
        label: "/templates/gp_hash_table",
        description: "dynamic PBDS hash table helper",
        detail: "dynamic / template"
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
        path: "/templates/ordered_set",
        insertMode: "global",
        generator: "ordered_set",
        label: "/templates/ordered_set",
        description: "dynamic PBDS ordered set helper",
        detail: "dynamic / template"
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
        path: "/templates/set_utils",
        insertMode: "global",
        generator: "set_utils",
        label: "/templates/set_utils",
        description: "dynamic ordered-container neighbor helper",
        detail: "dynamic / template"
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
        path: "/templates/fast_allocator",
        insertMode: "global",
        generator: "fast_allocator",
        label: "/templates/fast_allocator",
        description: "dynamic arena-backed allocator helper",
        detail: "dynamic / template"
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
        path: "/templates/geometry",
        insertMode: "global",
        generator: "geometry",
        label: "/templates/geometry",
        description: "dynamic 2D geometry helper",
        detail: "dynamic / template"
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
        path: "/templates/halfplane_intersection",
        insertMode: "global",
        generator: "halfplane_intersection",
        label: "/templates/halfplane_intersection",
        description: "dynamic half-plane intersection helper",
        detail: "dynamic / template"
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
        path: "/templates/linear_sieve",
        insertMode: "global",
        generator: "linear_sieve",
        label: "/templates/linear_sieve",
        description: "dynamic linear sieve helper",
        detail: "dynamic / template"
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
        path: "/templates/fenwick",
        insertMode: "global",
        generator: "fenwick",
        label: "/templates/fenwick",
        description: "dynamic Fenwick tree helper",
        detail: "dynamic / template"
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
    "factorial_precalc",
    {
      catalogEntry: {
        path: "/templates/factorial_precalc",
        insertMode: "cursor",
        generator: "factorial_precalc",
        label: "/templates/factorial_precalc",
        description: "factorials and inverse factorials for a selected value type",
        detail: "interactive / template"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptModularPrecalcOptions(
          editor,
          "edulcni: factorial_precalc",
          false
        );
        return options
          ? {
              content: renderFactorialPrecalc(options),
              renames: [],
              exports: ["fact", "inv_fact"]
            }
          : undefined;
      },
      defaultSnippet(analysis: CppAnalysis): RenderedSnippet {
        return {
          content: renderFactorialPrecalc({
            valueType: customValueTypeCandidates(analysis)[0] ?? "Mint",
            limitExpression: sizeExpressionCandidates(analysis)[0] ?? "n"
          }),
          renames: [],
          exports: ["fact", "inv_fact"]
        };
      }
    }
  ],
  [
    "powers_precalc",
    {
      catalogEntry: {
        path: "/templates/powers_precalc",
        insertMode: "cursor",
        generator: "powers_precalc",
        label: "/templates/powers_precalc",
        description: "powers and inverse powers for a selected value type",
        detail: "interactive / template"
      },
      async prompt(editor: vscode.TextEditor): Promise<RenderedSnippet | undefined> {
        const options = await promptModularPrecalcOptions(
          editor,
          "edulcni: powers_precalc",
          true
        );
        return options
          ? {
              content: renderPowersPrecalc(options),
              renames: [],
              exports: ["powers", "inv_powers"]
            }
          : undefined;
      },
      defaultSnippet(analysis: CppAnalysis): RenderedSnippet {
        return {
          content: renderPowersPrecalc({
            valueType: customValueTypeCandidates(analysis)[0] ?? "Mint",
            limitExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
            baseExpression: "2"
          }),
          renames: [],
          exports: ["powers", "inv_powers"]
        };
      }
    }
  ],
  [
    "modint",
    {
      catalogEntry: {
        path: "/templates/modint",
        insertMode: "global",
        generator: "modint",
        label: "/templates/modint",
        description: "dynamic modular integer helper",
        detail: "dynamic / template"
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
        path: "/templates/twosat",
        insertMode: "global",
        generator: "twosat",
        label: "/templates/twosat",
        description: "dynamic 2-SAT helper",
        detail: "dynamic / template"
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
        path: "/templates/maxflow_dinic",
        insertMode: "global",
        generator: "maxflow_dinic",
        label: "/templates/maxflow_dinic",
        description: "dynamic Dinic maxflow helper",
        detail: "dynamic / template"
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
        path: "/templates/mincost_maxflow",
        insertMode: "global",
        generator: "mincost_maxflow",
        label: "/templates/mincost_maxflow",
        description: "dynamic min-cost max-flow helper",
        detail: "dynamic / template"
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
        path: "/templates/hungarian",
        insertMode: "global",
        generator: "hungarian",
        label: "/templates/hungarian",
        description: "dynamic Hungarian assignment helper",
        detail: "dynamic / template"
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
        path: "/templates/kuhn",
        insertMode: "global",
        generator: "kuhn",
        label: "/templates/kuhn",
        description: "dynamic Kuhn bipartite matching helper",
        detail: "dynamic / template"
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
        path: "/templates/implicit_treap",
        insertMode: "global",
        generator: "implicit_treap",
        label: "/templates/implicit_treap",
        description: "dynamic implicit treap helper",
        detail: "dynamic / template"
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
        path: "/templates/merge_sort_tree",
        insertMode: "global",
        generator: "merge_sort_tree",
        label: "/templates/merge_sort_tree",
        description: "dynamic merge-sort tree helper",
        detail: "dynamic / template"
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
        path: "/templates/sparse_table",
        insertMode: "global",
        generator: "sparse_table",
        label: "/templates/sparse_table",
        description: "interactive sparse table generator",
        detail: "interactive / template"
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
        path: "/templates/suffix_array",
        insertMode: "global",
        generator: "suffix_array",
        label: "/templates/suffix_array",
        description: "dynamic suffix-array helper generator",
        detail: "dynamic / template"
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
        path: "/templates/poly_hash",
        insertMode: "global",
        generator: "poly_hash",
        label: "/templates/poly_hash",
        description: "dynamic polynomial rolling hash helper",
        detail: "dynamic / template"
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
        path: "/templates/fft_ntt",
        insertMode: "global",
        generator: "fft_ntt",
        label: "/templates/fft_ntt",
        description: "dynamic FFT/NTT convolution helper",
        detail: "dynamic / template"
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
        path: "/templates/berlekamp_massey",
        insertMode: "global",
        generator: "berlekamp_massey",
        label: "/templates/berlekamp_massey",
        description: "interactive linear recurrence helper generator",
        detail: "interactive / template"
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

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("edulcni: open a file and place the cursor first.");
    return;
  }

  const items = await buildPickItems(
    libraryRoot,
    catalogEntries,
    analyzeCppDocument(editor.document.getText())
  );
  let picked: SnippetPickItem | undefined;
  const directEntry = requestedPath ? directGeneratorEntry(requestedPath) : undefined;
  if (requestedPath) {
    picked = items.find((item) => item.snippetPath === requestedPath);
    if (picked && directEntry) {
      picked = {
        ...picked,
        entry: { ...(picked.entry ?? {}), ...directEntry },
        insertMode: directEntry.insertMode
      };
    } else if (!picked && directEntry) {
      picked = {
        label: directEntry.label ?? directEntry.path,
        description: directEntry.description ?? "",
        detail: directEntry.detail ?? "template",
        snippetPath: directEntry.path,
        entry: directEntry,
        insertMode: directEntry.insertMode
      };
    }
  } else {
    picked = await showExplainedQuickPick(items, {
      title: "edulcni:browse",
      placeHolder: "Type a slash path, for example /templates/segtree",
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

  const catalogByPath = new Map(catalogEntries.map((entry) => [entry.path, entry]));
  let renderedSnippet: RenderedSnippet;
  const generator = picked.entry?.generator
    ? generatorRegistry.get(picked.entry.generator)
    : undefined;
  if (generator) {
    const defaultPreview = generator.defaultSnippet(
      analyzeCppDocument(editor.document.getText()),
      []
    );
    const wizardSession = new WizardPreviewSession(() => generator.prompt(editor));
    await wizardSession.open(
      defaultPreview.content
    );
    activeWizardSession = wizardSession;
    let generated: RenderedSnippet | undefined;
    try {
      generated = await generator.prompt(editor);
      if (!generated) {
        return;
      }
      renderedSnippet = generated;
    } finally {
      activeWizardSession = undefined;
      await wizardSession.close(generated !== undefined);
    }
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
  snippetPreviewProvider = new SnippetPreviewProvider();
  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider(
      PREVIEW_SCHEME,
      snippetPreviewProvider
    ),
    snippetPreviewProvider
  );

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

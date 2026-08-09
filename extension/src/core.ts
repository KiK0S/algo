import { readFileSync } from "node:fs";
import path from "node:path";

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

export type CodeTemplateValue = string | number | boolean | undefined;
export type CodeTemplateContext = Record<string, CodeTemplateValue>;

const codeTemplateCache = new Map<string, string>();

function codeTemplateValue(
  context: CodeTemplateContext,
  name: string
): CodeTemplateValue {
  if (!Object.prototype.hasOwnProperty.call(context, name)) {
    throw new Error(`missing code template value: ${name}`);
  }
  return context[name];
}

interface RenderedTemplateRange {
  content: string;
  offset: number;
  stop?: "else" | "/if" | "/unless";
}

function renderCodeTemplateRange(
  source: string,
  context: CodeTemplateContext,
  startOffset = 0,
  stops: Set<string> = new Set()
): RenderedTemplateRange {
  const tokenPattern = /{{\s*([^{}]+?)\s*}}/g;
  tokenPattern.lastIndex = startOffset;
  let content = "";
  let cursor = startOffset;

  for (let match = tokenPattern.exec(source); match; match = tokenPattern.exec(source)) {
    content += source.slice(cursor, match.index);
    const token = match[1].trim();
    if (stops.has(token)) {
      return { content, offset: tokenPattern.lastIndex, stop: token as RenderedTemplateRange["stop"] };
    }

    const section = token.match(/^#(if|unless)\s+([A-Za-z_][A-Za-z0-9_]*)$/);
    if (section) {
      const [, mode, name] = section;
      const truthy = Boolean(codeTemplateValue(context, name));
      const expectedClose = mode === "if" ? "/if" : "/unless";
      const primary = renderCodeTemplateRange(
        source,
        context,
        tokenPattern.lastIndex,
        new Set(["else", expectedClose])
      );
      let alternate = "";
      let endOffset = primary.offset;
      if (primary.stop === "else") {
        const fallback = renderCodeTemplateRange(
          source,
          context,
          primary.offset,
          new Set([expectedClose])
        );
        if (fallback.stop !== expectedClose) {
          throw new Error(`unclosed code template section: ${name}`);
        }
        alternate = fallback.content;
        endOffset = fallback.offset;
      } else if (primary.stop !== expectedClose) {
        throw new Error(`unclosed code template section: ${name}`);
      }
      content += mode === "if" ? (truthy ? primary.content : alternate) : (truthy ? alternate : primary.content);
      cursor = endOffset;
      tokenPattern.lastIndex = endOffset;
      continue;
    }

    if (token === "else" || token.startsWith("/")) {
      throw new Error(`unexpected code template token: ${token}`);
    }

    const value = codeTemplateValue(context, token);
    content += value === undefined ? "" : String(value);
    cursor = tokenPattern.lastIndex;
  }

  content += source.slice(cursor);
  return { content, offset: source.length };
}

export function renderCodeTemplateSource(
  source: string,
  context: CodeTemplateContext
): string {
  return renderCodeTemplateRange(source, context).content;
}

export function renderCodeTemplate(
  templatePath: string,
  context: CodeTemplateContext
): string {
  if (path.isAbsolute(templatePath) || templatePath.split(/[\\/]/).includes("..")) {
    throw new Error(`invalid code template path: ${templatePath}`);
  }
  let source = codeTemplateCache.get(templatePath);
  if (source === undefined) {
    const absolutePath = path.resolve(
      __dirname,
      "..",
      "library",
      "templates",
      templatePath
    );
    source = readFileSync(absolutePath, "utf8");
    codeTemplateCache.set(templatePath, source);
  }
  return renderCodeTemplateSource(source, context);
}

function renderSolverTemplate(
  templateDirectory: string,
  renames: IdentifierRename[] = []
): string {
  return applyIdentifierRenames(
    renderCodeTemplate(`${templateDirectory}/helpers.hpp.tmpl`, {}),
    renames
  );
}

export interface CatalogEntry {
  path: string;
  insertMode: InsertMode;
  generator?: string;
  template?: string;
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
  visualization?: VisualizationSpec;
}

export interface VisualizationSpec {
  status: "automatic" | "snapshot" | "diagnostic" | "manual" | "none";
  models: string[];
  layout?: string;
  defaultGranularity?: "summary" | "operations" | "verbose";
  limitations?: string[];
  reason?: string;
}

export function renderStaticTemplate(
  templatePath: string
): RenderedSnippet {
  const content = renderHeaderContent(
    renderCodeTemplate(templatePath, {}),
    templatePath.endsWith(".hpp.tmpl")
  );
  return {
    content,
    renames: [],
    exports: templatePath.endsWith(".hpp.tmpl")
      ? collectGlobalExportedIdentifiers(content)
      : []
  };
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

export type BindingCandidateKind =
  | "size"
  | "value"
  | "index"
  | "query_count"
  | "source_vector"
  | "answer";

export interface BindingCandidate {
  label: string;
  value: string;
  kind: BindingCandidateKind;
  detail?: string;
  score: number;
}

export interface BindingField {
  id: string;
  label: string;
  kind: BindingCandidateKind;
  required: boolean;
  defaultValue?: string;
}

export interface DecisionChoice {
  id: string;
  label: string;
  description?: string;
  next?: string;
}

export interface DecisionNode {
  id: string;
  label: string;
  choices: DecisionChoice[];
  multi?: boolean;
}

export interface UsageSection {
  id: string;
  label: string;
  section: SolutionSection;
}

export interface SolverApplicationSpec {
  path: string;
  title: string;
  scenarios: DecisionChoice[];
  decisions: DecisionNode[];
  bindings: BindingField[];
  usageSections: UsageSection[];
}

export interface AnnotatedSymbol {
  name: string;
  kind: "const" | "input";
}

export interface VectorSymbol {
  name: string;
  type: string;
}

export interface StringSymbol {
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
  typeAliases?: string[];
  annotatedSymbols: AnnotatedSymbol[];
  constantSymbols: AnnotatedSymbol[];
  inputSymbols: AnnotatedSymbol[];
  vectorSymbols: VectorSymbol[];
  stringSymbols: StringSymbol[];
  vectorAliases: Set<string>;
  sections: CppSectionSpan[];
}

export type SegmentTreeApplication =
  | "point_query"
  | "lazy_range"
  | "lazy_minmax"
  | "max_subarray"
  | "beats";
export type SegmentTreeSourceMode = "empty" | "existing_vector" | "read_loop";
export type SegmentTreeIndexing = "zero_based" | "one_based_input";
export type SegmentTreeUsageMode = "helper_only" | "instance" | "query_loop";
export type SegmentAggregate = "sum" | "min" | "max" | "custom";
export type SegmentUpdateOp =
  | "point_set"
  | "point_add"
  | "range_add"
  | "range_assign";
export type SegmentDescendQuery = "first_leq";
export type SegmentTreeOutputMode = "global_recursive" | "iterative_class";

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
  firstLeqName: string;
  className: string;
  sumOpName: string;
  minOpName: string;
  maxOpName: string;
  sumAliasName: string;
  minAliasName: string;
  maxAliasName: string;
  maxSubarrayNodeName: string;
  maxSubarrayClassName: string;
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
  descends?: SegmentDescendQuery[];
  application?: SegmentTreeApplication;
  sourceMode?: SegmentTreeSourceMode;
  sourceName?: string;
  indexing?: SegmentTreeIndexing;
  usageMode?: SegmentTreeUsageMode;
  instanceName?: string;
  answerName?: string;
  names: SegmentTreeNames;
  outputMode?: SegmentTreeOutputMode;
  custom?: SegmentTreeCustomOptions;
}

export type SegmentTreeBeatsUpdate = "chmin" | "chmax" | "add";
export type SegmentTreeBeatsQuery = "sum" | "min" | "max";
export type SegmentTreeBeatsApplication =
  | "clamp_queries"
  | "add_clamp_queries"
  | "query_only";
export type SegmentTreeBeatsSourceMode = "empty" | "existing_vector" | "read_loop";
export type SegmentTreeBeatsIndexing = "zero_based" | "one_based_input";
export type SegmentTreeBeatsUsageMode = "helper_only" | "instance" | "query_loop";

export interface SegmentTreeBeatsNames {
  className: string;
  nodeName: string;
  chminName: string;
  chmaxName: string;
  addName: string;
  querySumName: string;
  queryMinName: string;
  queryMaxName: string;
}

export interface SegmentTreeBeatsOptions {
  valueType: string;
  updates: SegmentTreeBeatsUpdate[];
  queries: SegmentTreeBeatsQuery[];
  application?: SegmentTreeBeatsApplication;
  sourceMode?: SegmentTreeBeatsSourceMode;
  sourceName?: string;
  sizeExpression?: string;
  indexing?: SegmentTreeBeatsIndexing;
  usageMode?: SegmentTreeBeatsUsageMode;
  instanceName?: string;
  answerName?: string;
  names: SegmentTreeBeatsNames;
  includeUsageComment: boolean;
}

export type MergeSortTreeQuery =
  | "count_less"
  | "count_less_equal"
  | "count_equal"
  | "count_in_range"
  | "exists";
export type MergeSortTreeApplication =
  | "range_threshold_count"
  | "range_value_presence"
  | "range_value_band";
export type MergeSortTreeSourceMode = "existing_vector" | "read_loop";
export type MergeSortTreeIndexing = "zero_based" | "one_based_input";
export type MergeSortTreeUsageMode = "helper_only" | "instance" | "query_loop";

export interface MergeSortTreeNames {
  className: string;
  storageName: string;
  buildName: string;
  normName: string;
  buildRecName: string;
  countLessName: string;
  countLessEqualName: string;
  countEqualName: string;
  countInRangeName: string;
  existsName: string;
  countLessRecName: string;
  countLessEqualRecName: string;
  countInRangeRecName: string;
  existsRecName: string;
}

export interface MergeSortTreeOptions {
  valueType: string;
  sourceName: string;
  sizeExpression?: string;
  queries: MergeSortTreeQuery[];
  application?: MergeSortTreeApplication;
  sourceMode?: MergeSortTreeSourceMode;
  indexing?: MergeSortTreeIndexing;
  usageMode?: MergeSortTreeUsageMode;
  instanceName?: string;
  answerName?: string;
  names: MergeSortTreeNames;
  includeUsageComment: boolean;
}

export interface CompressUniqueOptions {
  sourceName: string;
  valuesName: string;
  idFunctionName: string;
  rewriteSource: boolean;
}

export type InputShape =
  | "values"
  | "vector"
  | "matrix"
  | "string_grid"
  | "parallel_arrays"
  | "tuple_records"
  | "graph"
  | "tree"
  | "permutation"
  | "functional_graph";
export type InputIndexing = "zero_based" | "one_based";

export interface InputField {
  name: string;
  valueType: string;
  isIndex?: boolean;
}

export interface InputOptions {
  shape: InputShape;
  includeReadHelper: boolean;
  existing?: boolean;
  name?: string;
  sizeExpression?: string;
  rowExpression?: string;
  columnExpression?: string;
  valueType?: string;
  fields?: InputField[];
  indexing?: InputIndexing;
  directed?: boolean;
  weighted?: boolean;
  weightType?: string;
  edgeCountExpression?: string;
  keepEdges?: boolean;
  edgesName?: string;
  degreeMetadata?: boolean;
  indegreeName?: string;
  outdegreeName?: string;
  rootExpression?: string;
  parentMetadata?: boolean;
  depthMetadata?: boolean;
  subtreeMetadata?: boolean;
  eulerMetadata?: boolean;
  parentName?: string;
  depthName?: string;
  orderName?: string;
  subtreeName?: string;
  tinName?: string;
  toutName?: string;
  inverseMetadata?: boolean;
  cycleMetadata?: boolean;
  inverseName?: string;
  cycleIdName?: string;
  cyclesName?: string;
  cycleEntryName?: string;
  distanceName?: string;
  reverseMetadata?: boolean;
  reverseName?: string;
}

export type ConnectedComponentsKind = "undirected" | "weak" | "strong";
export type ConnectedComponentsSourceMode = "existing_graph" | "read_graph";

export interface ConnectedComponentsNames {
  resultStructName: string;
  functionName: string;
}

export interface ConnectedComponentsOptions {
  kind: ConnectedComponentsKind;
  sourceMode: ConnectedComponentsSourceMode;
  indexing: InputIndexing;
  groups: boolean;
  sizes: boolean;
  graphName: string;
  sizeExpression: string;
  edgeCountExpression: string;
  resultName: string;
  includeReadHelper: boolean;
  names: ConnectedComponentsNames;
}

export interface DsuNames {
  className: string;
}

export type DsuApplication = "connectivity" | "query_loop";
export type DsuIndexing = "zero_based" | "one_based_input";
export type DsuUsageMode = "helper_only" | "instance" | "query_loop";

export interface DsuOptions {
  application?: DsuApplication;
  sizeExpression?: string;
  indexing?: DsuIndexing;
  usageMode?: DsuUsageMode;
  instanceName?: string;
  answerName?: string;
  names: DsuNames;
  includeUsageComment: boolean;
}

export interface RollbackDsuNames {
  className: string;
}

export type RollbackDsuApplication =
  | "snapshots"
  | "offline_dynamic_connectivity";
export type RollbackDsuIndexing = "zero_based" | "one_based_input";
export type RollbackDsuUsageMode = "helper_only" | "instance" | "query_loop";

export interface RollbackDsuOptions {
  application?: RollbackDsuApplication;
  sizeExpression?: string;
  queryCountName?: string;
  indexing?: RollbackDsuIndexing;
  usageMode?: RollbackDsuUsageMode;
  instanceName?: string;
  answerName?: string;
  names: RollbackDsuNames;
  includeUsageComment: boolean;
}

export interface LcaNames {
  className: string;
}

export type LcaApplication = "lca_dist" | "kth_ancestor" | "tree_query_loop";
export type LcaSourceMode = "empty" | "read_tree";
export type LcaIndexing = "zero_based" | "one_based_input";
export type LcaUsageMode = "helper_only" | "instance" | "read_tree" | "query_loop";

export interface LcaOptions {
  application?: LcaApplication;
  sourceMode?: LcaSourceMode;
  sizeExpression?: string;
  rootExpression?: string;
  queryCountName?: string;
  indexing?: LcaIndexing;
  usageMode?: LcaUsageMode;
  instanceName?: string;
  answerName?: string;
  names: LcaNames;
  includeUsageComment: boolean;
}

export interface HldNames {
  className: string;
}

export type HldApplication =
  | "path_query"
  | "subtree_query"
  | "lca_distance"
  | "build_tree";
export type HldSourceMode = "empty" | "read_tree";
export type HldIndexing = "zero_based" | "one_based_input";
export type HldValueMode = "vertex_values" | "edge_values";
export type HldUsageMode = "helper_only" | "instance" | "read_tree" | "query_loop";

export interface HldOptions {
  application?: HldApplication;
  sourceMode?: HldSourceMode;
  sizeExpression?: string;
  rootExpression?: string;
  queryCountName?: string;
  indexing?: HldIndexing;
  valueMode?: HldValueMode;
  usageMode?: HldUsageMode;
  instanceName?: string;
  answerName?: string;
  names: HldNames;
  includeUsageComment: boolean;
}

export interface BfsNames {
  resultStructName: string;
  addEdgeName: string;
  multiSourceName: string;
  singleSourceName: string;
  restorePathName: string;
  restorePathToRootName: string;
}

export type BfsApplication =
  | "shortest_distances"
  | "multi_source"
  | "path_restore"
  | "traversal_order";
export type BfsSourceMode = "existing_graph";
export type BfsGraphMode = "directed" | "undirected";
export type BfsIndexing = "zero_based" | "one_based_input";
export type BfsUsageMode =
  | "helper_only"
  | "single_source"
  | "multi_source"
  | "path_query";

export interface BfsOptions {
  application?: BfsApplication;
  sourceMode?: BfsSourceMode;
  graphMode?: BfsGraphMode;
  indexing?: BfsIndexing;
  usageMode?: BfsUsageMode;
  sizeExpression?: string;
  edgeCountName?: string;
  graphName?: string;
  sourceName?: string;
  targetName?: string;
  resultName?: string;
  names: BfsNames;
  includeUsageComment: boolean;
}

export interface DijkstraNames {
  edgeStructName: string;
  resultStructName: string;
  addEdgeName: string;
  multiSourceName: string;
  singleSourceName: string;
  restorePathName: string;
}

export type DijkstraApplication =
  | "shortest_paths"
  | "multi_source"
  | "path_restore";
export type DijkstraSourceMode = "existing_graph";
export type DijkstraGraphMode = "directed" | "undirected";
export type DijkstraIndexing = "zero_based" | "one_based_input";
export type DijkstraUsageMode =
  | "helper_only"
  | "single_source"
  | "multi_source"
  | "path_query";

export interface DijkstraOptions {
  application?: DijkstraApplication;
  sourceMode?: DijkstraSourceMode;
  graphMode?: DijkstraGraphMode;
  indexing?: DijkstraIndexing;
  usageMode?: DijkstraUsageMode;
  valueType?: string;
  infExpression?: string;
  sizeExpression?: string;
  edgeCountName?: string;
  graphName?: string;
  sourceName?: string;
  targetName?: string;
  resultName?: string;
  names: DijkstraNames;
  includeUsageComment: boolean;
}

export interface ToposortNames {
  addEdgeName: string;
  sortName: string;
  validateName: string;
}

export type ToposortApplication =
  | "dag_order"
  | "cycle_detection"
  | "dependency_schedule"
  | "order_validation";
export type ToposortSourceMode = "existing_graph" | "read_edges";
export type ToposortIndexing = "zero_based" | "one_based_input";
export type ToposortUsageMode =
  | "helper_only"
  | "read_graph"
  | "sort_order"
  | "cycle_check"
  | "validate_order";

export interface ToposortOptions {
  application?: ToposortApplication;
  sourceMode?: ToposortSourceMode;
  indexing?: ToposortIndexing;
  usageMode?: ToposortUsageMode;
  sizeExpression?: string;
  edgeCountName?: string;
  graphName?: string;
  orderName?: string;
  dagName?: string;
  names: ToposortNames;
  includeUsageComment: boolean;
}

export interface KosarajuNames {
  resultStructName: string;
  addEdgeName: string;
  sccName: string;
}

export type KosarajuApplication =
  | "scc_components"
  | "same_component"
  | "condensation_dag"
  | "two_sat_analysis";
export type KosarajuSourceMode = "existing_graph" | "read_edges";
export type KosarajuIndexing = "zero_based" | "one_based_input";
export type KosarajuUsageMode =
  | "helper_only"
  | "read_graph"
  | "compute_scc"
  | "same_component_queries"
  | "print_components";

export interface KosarajuOptions {
  application?: KosarajuApplication;
  sourceMode?: KosarajuSourceMode;
  indexing?: KosarajuIndexing;
  usageMode?: KosarajuUsageMode;
  sizeExpression?: string;
  edgeCountName?: string;
  queryCountName?: string;
  graphName?: string;
  resultName?: string;
  names: KosarajuNames;
  includeUsageComment: boolean;
}

export interface MoNames {
  queryStructName: string;
  blockSizeName: string;
  normalizeName: string;
  orderName: string;
  processName: string;
}

export type MoApplication =
  | "distinct_values"
  | "range_frequency"
  | "range_aggregate"
  | "custom_callbacks";
export type MoSourceMode = "existing_queries" | "read_queries";
export type MoIndexing = "zero_based_half_open" | "one_based_closed_input";
export type MoUsageMode =
  | "helper_only"
  | "read_queries"
  | "process_skeleton"
  | "distinct_count_skeleton";

export interface MoOptions {
  application?: MoApplication;
  sourceMode?: MoSourceMode;
  indexing?: MoIndexing;
  usageMode?: MoUsageMode;
  sizeExpression?: string;
  queryCountName?: string;
  valuesName?: string;
  queriesName?: string;
  answersName?: string;
  valueType?: string;
  answerType?: string;
  names: MoNames;
  includeUsageComment: boolean;
}

export interface MonotonicStackNames {
  nearestLeftByName: string;
  nearestRightByName: string;
  nearestSmallerLeftName: string;
  nearestSmallerRightName: string;
  nearestGreaterLeftName: string;
  nearestGreaterRightName: string;
  nearestStructName: string;
  nearestAllName: string;
}

export type MonotonicStackApplication =
  | "nearest_smaller"
  | "nearest_greater"
  | "all_nearest"
  | "custom_comparator";
export type MonotonicStackDirection = "left" | "right" | "both";
export type MonotonicStackRelation = "smaller" | "greater" | "all";
export type MonotonicStackStrictness = "strict" | "non_strict";
export type MonotonicStackUsageMode = "helper_only" | "compute_vector" | "compute_all";

export interface MonotonicStackOptions {
  application?: MonotonicStackApplication;
  direction?: MonotonicStackDirection;
  relation?: MonotonicStackRelation;
  strictness?: MonotonicStackStrictness;
  usageMode?: MonotonicStackUsageMode;
  sourceName?: string;
  resultName?: string;
  valueType?: string;
  names: MonotonicStackNames;
  includeUsageComment: boolean;
}

export interface GpHashTableNames {
  splitMixName: string;
  hashName: string;
  pairHashName: string;
  tableAliasName: string;
}

export type GpHashTableApplication =
  | "hash_map"
  | "hash_set"
  | "frequency_table"
  | "pair_key";
export type GpHashTableUsageMode =
  | "helper_only"
  | "declare_map"
  | "declare_set"
  | "frequency_loop";

export interface GpHashTableOptions {
  application?: GpHashTableApplication;
  usageMode?: GpHashTableUsageMode;
  keyType?: string;
  valueType?: string;
  tableName?: string;
  sourceName?: string;
  names: GpHashTableNames;
  includeUsageComment: boolean;
}

export interface OrderedSetNames {
  treeAliasName: string;
  className: string;
}

export type OrderedSetApplication =
  | "order_statistics"
  | "kth_element"
  | "multiset_pairs"
  | "rank_queries";
export type OrderedSetUsageMode =
  | "helper_only"
  | "declare_set"
  | "rank_query"
  | "kth_query"
  | "pair_multiset";

export interface OrderedSetOptions {
  application?: OrderedSetApplication;
  usageMode?: OrderedSetUsageMode;
  keyType?: string;
  setName?: string;
  names: OrderedSetNames;
  includeUsageComment: boolean;
}

export interface SetUtilsNames {
  nextIteratorName: string;
  prevIteratorName: string;
  nextValueName: string;
  prevValueName: string;
}

export type SetUtilsApplication =
  | "next_value"
  | "prev_value"
  | "iterator_navigation"
  | "map_neighbor";
export type SetUtilsLookup = "next" | "prev";
export type SetUtilsTarget = "value" | "iterator";
export type SetUtilsUsageMode = "helper_only" | "lookup_snippet";

export interface SetUtilsOptions {
  application?: SetUtilsApplication;
  lookup?: SetUtilsLookup;
  target?: SetUtilsTarget;
  usageMode?: SetUtilsUsageMode;
  containerName?: string;
  keyName?: string;
  iteratorName?: string;
  resultName?: string;
  names: SetUtilsNames;
  includeUsageComment: boolean;
}

export interface FastAllocatorNames {
  arenaClassName: string;
  allocatorClassName: string;
  factoryName: string;
}

export type FastAllocatorApplication =
  | "many_vectors"
  | "graph_edges"
  | "pool_reset"
  | "custom_container";
export type FastAllocatorUsageMode =
  | "helper_only"
  | "vector_declaration"
  | "edge_vector"
  | "arena_reset";

export interface FastAllocatorOptions {
  application?: FastAllocatorApplication;
  usageMode?: FastAllocatorUsageMode;
  valueType?: string;
  containerName?: string;
  arenaName?: string;
  capacityExpression?: string;
  edgeTypeName?: string;
  names: FastAllocatorNames;
  includeUsageComment: boolean;
}

export type GeometryApplication =
  | "orientation"
  | "segment_intersection"
  | "angle_sort"
  | "convex_hull";
export type GeometryUsageMode =
  | "helper_only"
  | "orientation_check"
  | "segment_intersection"
  | "sort_points"
  | "build_hull";

export interface GeometryOptions {
  application?: GeometryApplication;
  usageMode?: GeometryUsageMode;
  valueType?: string;
  pointAliasName?: string;
  pointsName?: string;
  resultName?: string;
  includeUsageComment: boolean;
}

export type HalfplaneIntersectionApplication =
  | "convex_polygon"
  | "linear_constraints"
  | "clip_polygon";
export type HalfplaneIntersectionUsageMode =
  | "helper_only"
  | "halfplane_vector"
  | "inequality_box"
  | "compute_polygon";

export interface HalfplaneIntersectionOptions {
  application?: HalfplaneIntersectionApplication;
  usageMode?: HalfplaneIntersectionUsageMode;
  halfplanesName?: string;
  resultName?: string;
  includeUsageComment: boolean;
}

export type LinearSieveFeature = "lowest_prime" | "primes" | "factorization";

export interface LinearSieveNames {
  className: string;
  lowestPrimeFunctionName: string;
  primesFunctionName: string;
}

export interface LinearSieveOptions {
  features: LinearSieveFeature[];
  names: LinearSieveNames;
  includeUsageComment: boolean;
}

export type FenwickOperation =
  | "sum"
  | "xor"
  | "max"
  | "min"
  | "custom"
  | "custom_invertible";
export type FenwickApplication =
  | "point_prefix"
  | "point_range"
  | "range_point"
  | "range_sum"
  | "frequency_kth"
  | "inversion_count"
  | "prefix_minmax";
export type FenwickSourceMode = "empty" | "existing_vector" | "read_loop";
export type FenwickIndexing = "zero_based" | "one_based_input";
export type FenwickUsageMode = "helper_only" | "instance" | "query_loop";

export interface FenwickNames {
  className: string;
  rangeClassName: string;
  sumOpName: string;
  xorOpName: string;
  maxOpName: string;
  minOpName: string;
  customOpName: string;
  customInvertibleOpName: string;
  sumAliasName: string;
  xorAliasName: string;
  maxAliasName: string;
  minAliasName: string;
  customAliasName: string;
  customInvertibleAliasName: string;
}

export interface FenwickOptions {
  operations: FenwickOperation[];
  application?: FenwickApplication;
  sourceMode?: FenwickSourceMode;
  sourceName?: string;
  sizeExpression?: string;
  valueType?: string;
  indexing?: FenwickIndexing;
  usageMode?: FenwickUsageMode;
  instanceName?: string;
  answerName?: string;
  names: FenwickNames;
  includeUsageComment: boolean;
}

export type ModIntMode = "static" | "dynamic" | "both";

export interface ModIntNames {
  staticClassName: string;
  dynamicClassName: string;
}

export interface ModIntOptions {
  mode: ModIntMode;
  dynamicDefaultModExpression: string;
  names: ModIntNames;
  includeUsageComment: boolean;
}

export interface ModularPrecalcOptions {
  valueType: string;
  limitExpression: string;
  baseExpression?: string;
}

export type TwoSatFeature =
  | "xor"
  | "equal"
  | "force"
  | "at_most_one"
  | "components";

export interface TwoSatNames {
  className: string;
  resetName: string;
  addOrName: string;
  addImplicationName: string;
  addXorName: string;
  addEqualName: string;
  addTrueName: string;
  addFalseName: string;
  addAtMostOneName: string;
  solveName: string;
  valueName: string;
  assignmentName: string;
  implicationGraphName: string;
  componentName: string;
  okVarName: string;
  nodeName: string;
  addDirectName: string;
  sccName: string;
  graphFieldName: string;
  assignmentFieldName: string;
  componentFieldName: string;
}

export interface TwoSatOptions {
  features: TwoSatFeature[];
  names: TwoSatNames;
  includeUsageComment: boolean;
}

export type MaxflowDinicFeature =
  | "min_cut"
  | "graph_access"
  | "reset_flows";

export interface MaxflowDinicNames {
  className: string;
  edgeName: string;
  resetName: string;
  addEdgeName: string;
  maxFlowName: string;
  minCutName: string;
  graphName: string;
  resetFlowsName: string;
  buildLevelName: string;
  pushFlowName: string;
  graphFieldName: string;
  levelFieldName: string;
  ptrFieldName: string;
  solveName: string;
  instanceName: string;
  answerName: string;
}

export interface MaxflowDinicOptions {
  capType: string;
  features: MaxflowDinicFeature[];
  generateInput: boolean;
  names: MaxflowDinicNames;
  nodeCountName: string;
  edgeCountName: string;
  sourceName: string;
  sinkName: string;
  fromName: string;
  toName: string;
  edgeCapName: string;
  includeUsageComment: boolean;
}

export type MinCostMaxFlowFeature = "graph_access" | "potential_access";
export type MinCostMaxFlowMode = "max_flow" | "fixed_flow";

export interface MinCostMaxFlowNames {
  className: string;
  edgeName: string;
  resetName: string;
  addEdgeName: string;
  graphName: string;
  potentialName: string;
  setPotentialName: string;
  minCostFlowName: string;
  maxFlowMinCostName: string;
  minCostMaxFlowName: string;
  vertexOkName: string;
  infCostName: string;
  bellmanFordName: string;
  dijkstraName: string;
  graphFieldName: string;
  potentialFieldName: string;
  distFieldName: string;
  prevVertexFieldName: string;
  prevEdgeFieldName: string;
  hasNegativeFieldName: string;
  potentialsInitializedFieldName: string;
  solveName: string;
  instanceName: string;
  resultName: string;
}

export interface MinCostMaxFlowOptions {
  capType: string;
  costType: string;
  features: MinCostMaxFlowFeature[];
  generateInput: boolean;
  mode: MinCostMaxFlowMode;
  names: MinCostMaxFlowNames;
  nodeCountName: string;
  edgeCountName: string;
  sourceName: string;
  sinkName: string;
  fromName: string;
  toName: string;
  edgeCapName: string;
  edgeCostName: string;
  flowLimitName: string;
  includeUsageComment: boolean;
}

export type HungarianMode = "minimize" | "maximize";

export interface HungarianNames {
  resultStructName: string;
  internalName: string;
  minimizeName: string;
  maximizeName: string;
  solveName: string;
}

export interface HungarianOptions {
  costType: string;
  sourceName: string;
  mode: HungarianMode;
  rectangular: boolean;
  generateInput: boolean;
  names: HungarianNames;
  rowCountName: string;
  colCountName: string;
  resultName: string;
  includeUsageComment: boolean;
}

export type KuhnFeature = "vertex_cover";

export interface KuhnNames {
  resultStructName: string;
  coverStructName: string;
  className: string;
  resetName: string;
  leftSizeName: string;
  rightSizeName: string;
  graphName: string;
  addEdgeName: string;
  maximumMatchingName: string;
  tryAugmentName: string;
  matchFunctionName: string;
  vertexCoverFunctionName: string;
  matchingSizeName: string;
  matchLeftName: string;
  matchRightName: string;
  leftCoverName: string;
  rightCoverName: string;
  solveName: string;
}

export interface KuhnOptions {
  features: KuhnFeature[];
  generateInput: boolean;
  decrementInput: boolean;
  sourceName: string;
  rightSizeName: string;
  names: KuhnNames;
  leftCountName: string;
  rightCountName: string;
  edgeCountName: string;
  leftVertexName: string;
  rightVertexName: string;
  instanceName: string;
  resultName: string;
  coverName: string;
  includeUsageComment: boolean;
}

export type ImplicitTreapAggregate = "sum" | "custom";
export type ImplicitTreapFeature = "reverse" | "range_add";
export type ImplicitTreapApplication =
  | "sequence_edit"
  | "range_query"
  | "range_lazy"
  | "custom_aggregate";
export type ImplicitTreapSourceMode = "empty" | "existing_vector" | "read_loop";
export type ImplicitTreapIndexing = "zero_based" | "one_based_input";
export type ImplicitTreapUsageMode = "helper_only" | "instance" | "query_loop";

export interface ImplicitTreapNames {
  sumOpName: string;
  customOpName: string;
  className: string;
  nodeName: string;
  splitName: string;
  mergeName: string;
  rootName: string;
  rngName: string;
  reverseName: string;
  addName: string;
}

export interface ImplicitTreapOptions {
  valueType: string;
  aggregate: ImplicitTreapAggregate;
  features: ImplicitTreapFeature[];
  application?: ImplicitTreapApplication;
  sourceMode?: ImplicitTreapSourceMode;
  sourceName?: string;
  sizeExpression?: string;
  indexing?: ImplicitTreapIndexing;
  usageMode?: ImplicitTreapUsageMode;
  instanceName?: string;
  answerName?: string;
  names: ImplicitTreapNames;
  includeUsageComment: boolean;
}

export type SparseTableApplication =
  | "range_minmax"
  | "range_gcd_bitwise"
  | "custom_idempotent";
export type SparseTableVariant = "min" | "max" | "gcd" | "bit_and" | "bit_or" | "custom";
export type SparseTableSourceMode = "existing_vector" | "read_loop";
export type SparseTableIndexing = "zero_based" | "one_based_input";
export type SparseTableUsageMode = "helper_only" | "build_call" | "query_loop";

export interface SparseTableNames {
  logName: string;
  ensureLogName: string;
  minTableName: string;
  buildMinName: string;
  queryMinName: string;
  maxTableName: string;
  buildMaxName: string;
  queryMaxName: string;
  gcdTableName: string;
  buildGcdName: string;
  queryGcdName: string;
  bitAndTableName: string;
  buildBitAndName: string;
  queryBitAndName: string;
  bitOrTableName: string;
  buildBitOrName: string;
  queryBitOrName: string;
  customTableName: string;
  buildCustomName: string;
  queryCustomName: string;
  customCombineName: string;
}

export interface SparseTableOptions {
  valueType: string;
  sourceName: string;
  sizeExpression?: string;
  variants: SparseTableVariant[];
  application?: SparseTableApplication;
  sourceMode?: SparseTableSourceMode;
  indexing?: SparseTableIndexing;
  usageMode?: SparseTableUsageMode;
  answerName?: string;
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

export type PolyHashInputKind = "string" | "vector_int";

export type PolyHashFeature =
  | "substring_equal"
  | "reverse"
  | "lcp"
  | "concat";

export interface PolyHashNames {
  mod1Name: string;
  mod2Name: string;
  baseName: string;
  valueStructName: string;
  className: string;
  hashStringName: string;
  hashVectorName: string;
  equalFunctionName: string;
}

export interface PolyHashOptions {
  inputKind: PolyHashInputKind;
  sourceName: string;
  mod1Expression: string;
  mod2Expression: string;
  baseExpression: string;
  features: PolyHashFeature[];
  names: PolyHashNames;
  includeUsageComment: boolean;
}

export type SuffixArrayInputKind = "string" | "ints" | "positive_codes";

export type SuffixArrayFeature =
  | "rank"
  | "lcp"
  | "stripped_sa"
  | "lcp_rmq";

export interface SuffixArrayNames {
  resultStructName: string;
  buildPositiveCodesName: string;
  buildStringName: string;
  buildIntsName: string;
  removeEmptySuffixName: string;
  resultName: string;
  saName: string;
  rankName: string;
  lcpName: string;
  lcpRangeQueryName: string;
  lcpSparseNames: SparseTableNames;
}

export interface SuffixArrayOptions {
  inputKind: SuffixArrayInputKind;
  sourceName: string;
  features: SuffixArrayFeature[];
  names: SuffixArrayNames;
  includeUsageComment: boolean;
}

export type FftNttTransform = "fft" | "ntt";

export interface FftNttNames {
  nextPowerName: string;
  isPowerName: string;
  bitReverseName: string;
  fftTransformName: string;
  convolutionFftName: string;
  nttPowName: string;
  nttTransformName: string;
  convolutionNttName: string;
}

export interface FftNttOptions {
  transforms: FftNttTransform[];
  includeConvolution: boolean;
  modulusExpression: string;
  primitiveRootExpression: string;
  names: FftNttNames;
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
  recipe?: RenderedRecipe;
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

function collectTypeAliases(text: string): string[] {
  const aliases: string[] = [];
  const seen = new Set<string>();
  const add = (name: string) => {
    if (!seen.has(name)) {
      seen.add(name);
      aliases.push(name);
    }
  };

  for (const match of text.matchAll(
    /^\s*using\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/gm
  )) {
    add(match[1]);
  }
  for (const match of text.matchAll(
    /^\s*typedef\b[^;]*\b([A-Za-z_][A-Za-z0-9_]*)\s*;/gm
  )) {
    add(match[1]);
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
  strings: StringSymbol[];
} {
  const constants: AnnotatedSymbol[] = [];
  const inputs: AnnotatedSymbol[] = [];
  const vectors: VectorSymbol[] = [];
  const strings: StringSymbol[] = [];
  const seenConstants = new Set<string>();
  const seenInputs = new Set<string>();
  const seenVectors = new Set<string>();
  const seenStrings = new Set<string>();

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

    const stringMatch = trimmed.match(
      /^(?:(?:const)\s+)?((?:std::)?string)\s+(.+);$/
    );
    if (stringMatch) {
      const type = stringMatch[1].trim();
      for (const declarator of splitTopLevelCommas(stringMatch[2])) {
        const name = declaredNameFromDeclarator(declarator, true);
        if (!name || seenStrings.has(name) || CPP_KEYWORDS.has(name)) {
          continue;
        }
        seenStrings.add(name);
        strings.push({ name, type });
      }
      continue;
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

  return { constants, inputs, vectors, strings };
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
    typeAliases: collectTypeAliases(stripped),
    annotatedSymbols: collectAnnotatedSymbols(text),
    constantSymbols: declaredSymbols.constants,
    inputSymbols: declaredSymbols.inputs,
    vectorSymbols: declaredSymbols.vectors,
    stringSymbols: declaredSymbols.strings,
    vectorAliases,
    sections: detectCppSections(text)
  };
}

export function customValueTypeCandidates(analysis: CppAnalysis): string[] {
  const result: string[] = [];
  const add = (value: string) => {
    if (!result.includes(value)) {
      result.push(value);
    }
  };
  for (const alias of analysis.typeAliases ?? []) add(alias);
  for (const builtin of ["Mint", "long long", "int"]) add(builtin);
  return result;
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

function candidateScore(name: string, preferred: string[]): number {
  const exactIndex = preferred.indexOf(name);
  if (exactIndex !== -1) {
    return 100 - exactIndex;
  }
  if (/^n(?:$|[A-Z_])/.test(name)) {
    return 80;
  }
  if (/^(?:q|queries|query_count)$/.test(name)) {
    return 75;
  }
  if (/^(?:a|arr|v|values)$/.test(name)) {
    return 70;
  }
  if (/^(?:ans|answer|res|result)$/.test(name)) {
    return 65;
  }
  return 10;
}

export function bindingCandidates(
  analysis: CppAnalysis,
  kind: BindingCandidateKind
): BindingCandidate[] {
  const candidates: BindingCandidate[] = [];
  const seen = new Set<string>();
  const add = (
    value: string,
    candidateKind: BindingCandidateKind,
    preferred: string[],
    detail?: string
  ) => {
    const trimmed = value.trim();
    if (trimmed === "" || seen.has(trimmed)) {
      return;
    }
    seen.add(trimmed);
    candidates.push({
      label: trimmed,
      value: trimmed,
      kind: candidateKind,
      detail,
      score: candidateScore(trimmed, preferred)
    });
  };

  if (kind === "size" || kind === "query_count" || kind === "index") {
    const preferred =
      kind === "query_count"
        ? ["q", "m", "queries"]
        : kind === "index"
          ? ["i", "idx", "pos", "l", "r"]
          : ["n", "N", "sz", "size"];
    for (const value of sizeExpressionCandidates(analysis)) {
      add(value, kind, preferred);
    }
  }

  if (kind === "source_vector" || kind === "value" || kind === "answer") {
    const preferred =
      kind === "answer" ? ["ans", "answer", "res"] : ["a", "arr", "v", "values"];
    for (const symbol of analysis.vectorSymbols) {
      add(symbol.name, "source_vector", preferred, symbol.type);
    }
  }

  return candidates.sort((lhs, rhs) => rhs.score - lhs.score || lhs.label.localeCompare(rhs.label));
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
    rangeAssignName: planner.reserve("range_assign", "seg_range_assign"),
    firstLeqName: planner.reserve("first_leq", "seg_first_leq"),
    className: planner.reserve("SegmentTree", "PointSegmentTree"),
    sumOpName: planner.reserve("SegmentSumOp", "PointSegmentSumOp"),
    minOpName: planner.reserve("SegmentMinOp", "PointSegmentMinOp"),
    maxOpName: planner.reserve("SegmentMaxOp", "PointSegmentMaxOp"),
    sumAliasName: planner.reserve("SegmentSumTree", "PointSegmentSumTree"),
    minAliasName: planner.reserve("SegmentMinTree", "PointSegmentMinTree"),
    maxAliasName: planner.reserve("SegmentMaxTree", "PointSegmentMaxTree"),
    maxSubarrayNodeName: planner.reserve("MaxSubarrayNode", "SegmentMaxSubarrayNode"),
    maxSubarrayClassName: planner.reserve("MaxSubarraySegTree", "SegmentMaxSubarrayTree")
  };
}

function hasUpdate(options: SegmentTreeOptions, op: SegmentUpdateOp): boolean {
  return options.updates.includes(op);
}

function hasDescend(
  options: SegmentTreeOptions,
  query: SegmentDescendQuery
): boolean {
  return (options.descends ?? []).includes(query);
}

function canRenderFirstLeq(options: SegmentTreeOptions): boolean {
  return options.outputMode !== "iterative_class" && options.aggregate === "min";
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
    exports: recipe.exports,
    recipe
  };
}

export function mergeRenderedRecipes(recipes: RenderedRecipe[]): RenderedRecipe {
  const sections: Partial<Record<SolutionSection, string[]>> = {};
  const exportNames: string[] = [];
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
      if (!exportNames.includes(name)) {
        exportNames.push(name);
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
    exports: exportNames,
    dependencies: [...dependenciesByPath.values()]
  };
}

function segmentTreeExportedNames(options: SegmentTreeOptions): string[] {
  const names = options.names;
  if (options.application === "max_subarray") {
    return [names.maxSubarrayNodeName, names.maxSubarrayClassName];
  }
  if (options.outputMode === "iterative_class") {
    return [
      names.sumOpName,
      names.minOpName,
      names.maxOpName,
      names.className,
      names.sumAliasName,
      names.minAliasName,
      names.maxAliasName
    ];
  }

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
  if (hasDescend(options, "first_leq") && canRenderFirstLeq(options)) {
    add(names.firstLeqName);
  }
  return result;
}

export function renderSegmentTreeRecipe(options: SegmentTreeOptions): RenderedRecipe {
  const helpers =
    options.application === "max_subarray"
      ? renderMaxSubarraySegmentTree(options)
      : renderSegmentTree(options);
  const solve = renderSegmentTreeUsage(options);
  const sections: Partial<Record<SolutionSection, string[]>> = { helpers: [helpers] };
  if (solve !== "") {
    sections.solve = [solve];
  }
  return createRenderedRecipe(
    sections,
    segmentTreeExportedNames(options)
  );
}

function renderSegmentTreeUsage(options: SegmentTreeOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  const sourceName = options.sourceName?.trim() || "";
  const valueType = options.valueType.trim() || "int";
  const aggregateAlias = options.aggregate === "min"
    ? options.names.minAliasName
    : options.aggregate === "max" ? options.names.maxAliasName : options.names.sumAliasName;
  const templateName = options.application === "max_subarray"
    ? "solve-max-subarray.cpp.tmpl"
    : options.outputMode === "iterative_class"
      ? "solve-iterative.cpp.tmpl"
      : "solve-global.cpp.tmpl";
  return renderCodeTemplate(`segment_tree/${templateName}`, {
    ...options.names,
    valueType,
    sourceName,
    sizeExpression: options.sizeExpression.trim() || "n",
    instanceName: sanitizeIdentifier(options.instanceName ?? "seg", "seg"),
    answerName: sanitizeIdentifier(options.answerName ?? "ans", "ans"),
    aliasName: aggregateAlias,
    constructorArg: sourceName || options.sizeExpression.trim() || "n",
    readLoop: options.sourceMode === "read_loop" && sourceName !== "",
    hasSource: sourceName !== "",
    queryLoop: usageMode === "query_loop",
    oneBased: options.indexing === "one_based_input",
    rangeAdd: hasUpdate(options, "range_add"),
    rangeAssign: hasUpdate(options, "range_assign"),
    pointAdd: hasUpdate(options, "point_add")
  });
}

function renderMaxSubarraySegmentTree(options: SegmentTreeOptions): string {
  return applyIdentifierRenames(
    renderCodeTemplate("segment_tree/max-subarray.hpp.tmpl", {}),
    [
      { from: "MaxSubarrayNode", to: options.names.maxSubarrayNodeName },
      { from: "MaxSubarraySegTree", to: options.names.maxSubarrayClassName }
    ]
  );
}

function renderIterativeSegmentTree(options: SegmentTreeOptions): string {
  const names = options.names;
  return applyIdentifierRenames(
    renderCodeTemplate("segment_tree/iterative.hpp.tmpl", {
      pointAdd: hasUpdate(options, "point_add")
    }),
    [
      { from: "SegmentSumOp", to: names.sumOpName },
      { from: "SegmentMinOp", to: names.minOpName },
      { from: "SegmentMaxOp", to: names.maxOpName },
      { from: "SegmentTree", to: names.className },
      { from: "SegmentSumTree", to: names.sumAliasName },
      { from: "SegmentMinTree", to: names.minAliasName },
      { from: "SegmentMaxTree", to: names.maxAliasName }
    ]
  );
}

export function renderSegmentTree(options: SegmentTreeOptions): string {
  if (options.application === "max_subarray") return renderMaxSubarraySegmentTree(options);
  if (options.outputMode === "iterative_class") return renderIterativeSegmentTree(options);
  const names = options.names;
  const rangeAdd = hasUpdate(options, "range_add");
  const rangeAssign = hasUpdate(options, "range_assign");
  const context: CodeTemplateContext = {
    valueType: options.valueType,
    pointSet: hasUpdate(options, "point_set"),
    pointAdd: hasUpdate(options, "point_add"),
    rangeAdd,
    rangeAssign,
    hasLazy: rangeAdd || rangeAssign,
    firstLeq: hasDescend(options, "first_leq") && canRenderFirstLeq(options)
  };
  if (options.aggregate === "custom") {
    const custom = options.custom ?? {
      nodeType: "Node", leafTarget: "node.x", leafExpression: "value", updateTarget: "node.x"
    };
    const fields = customFieldNames(options);
    const field = fields[0];
    Object.assign(context, {
      customNodeType: custom.nodeType,
      customFieldDeclarations: fields.map((name) =>
        `  ${options.valueType} ${name} = ${options.valueType}(0);`
      ).join("\n"),
      leafTargetExpression: targetExpression(custom.leafTarget, "node"),
      leafExpression: custom.leafExpression,
      updateTargetExpression: targetExpression(custom.updateTarget, "node"),
      pointAddTargetExpression: targetExpression(custom.updateTarget, `${names.storageName}[v]`),
      mergeTargetExpression: `res.${field}`,
      mergeLhsExpression: `a.${field}`,
      mergeRhsExpression: `b.${field}`
    });
  }
  let helpers = renderCodeTemplate(
    `segment_tree/global-${options.aggregate}.hpp.tmpl`, context
  );
  helpers = applyIdentifierRenames(helpers, [
    { from: "t", to: names.storageName },
    { from: "lazy_add", to: names.lazyAddName },
    { from: "lazy_set", to: names.lazySetName },
    { from: "lazy_has_set", to: names.lazyHasSetName },
    { from: "init_segtree", to: names.initName },
    { from: "build", to: names.buildName },
    { from: "get", to: names.queryName },
    { from: "merge", to: names.mergeName },
    { from: "neutral", to: names.neutralName },
    { from: "make_node", to: names.makeNodeName },
    { from: "push", to: names.pushName },
    { from: "apply_add", to: names.applyAddName },
    { from: "apply_set", to: names.applySetName },
    { from: "point_set", to: names.pointSetName },
    { from: "point_add", to: names.pointAddName },
    { from: "range_add", to: names.rangeAddName },
    { from: "range_assign", to: names.rangeAssignName },
    { from: "first_leq", to: names.firstLeqName }
  ]);
  return helpers;
}

export function defaultSegmentTreeBeatsUpdates(): SegmentTreeBeatsUpdate[] {
  return ["chmin"];
}

export function defaultSegmentTreeBeatsQueries(): SegmentTreeBeatsQuery[] {
  return ["sum"];
}

export function planSegmentTreeBeatsNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): SegmentTreeBeatsNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    className: planner.reserve("SegmentTreeBeats"),
    nodeName: planner.reserve("Node", "BeatsNode"),
    chminName: planner.reserve("chmin", "beats_chmin"),
    chmaxName: planner.reserve("chmax", "beats_chmax"),
    addName: planner.reserve("add", "beats_add"),
    querySumName: planner.reserve("query_sum", "beats_query_sum"),
    queryMinName: planner.reserve("query_min", "beats_query_min"),
    queryMaxName: planner.reserve("query_max", "beats_query_max")
  };
}

function segmentTreeBeatsUpdateSet(
  updates: SegmentTreeBeatsUpdate[]
): Set<SegmentTreeBeatsUpdate> {
  return new Set(updates);
}

function segmentTreeBeatsQuerySet(
  queries: SegmentTreeBeatsQuery[]
): Set<SegmentTreeBeatsQuery> {
  return new Set(queries);
}

function segmentTreeBeatsExports(options: SegmentTreeBeatsOptions): string[] {
  return [options.names.className];
}

function renderSegmentTreeBeatsUsage(
  options: SegmentTreeBeatsOptions,
  updates: Set<SegmentTreeBeatsUpdate>,
  queries: Set<SegmentTreeBeatsQuery>
): string {
  return renderCodeTemplate("segment_tree_beats/usage-comment.cpp.tmpl", {
    ...options.names,
    valueType: options.valueType,
    chminUpdate: updates.has("chmin"), chmaxUpdate: updates.has("chmax"), addUpdate: updates.has("add"),
    sumQuery: queries.has("sum"), minQuery: queries.has("min"), maxQuery: queries.has("max")
  });
}

function firstSegmentTreeBeatsQuery(
  queries: Set<SegmentTreeBeatsQuery>
): SegmentTreeBeatsQuery {
  for (const query of ["sum", "min", "max"] as const) {
    if (queries.has(query)) {
      return query;
    }
  }
  return "sum";
}

function renderSegmentTreeBeatsUsageSnippet(
  options: SegmentTreeBeatsOptions,
  updates: Set<SegmentTreeBeatsUpdate>,
  queries: Set<SegmentTreeBeatsQuery>
): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  const sourceMode = options.sourceMode ?? "empty";
  const sourceName = options.sourceName?.trim() || "a";
  const addUpdate = updates.has("add");
  const chminUpdate = updates.has("chmin");
  const chmaxUpdate = updates.has("chmax");
  const query = firstSegmentTreeBeatsQuery(queries);
  return renderCodeTemplate("segment_tree_beats/solve.cpp.tmpl", {
    ...options.names,
    valueType: options.valueType,
    sourceName,
    sizeExpression: options.sizeExpression?.trim() || "n",
    instanceName: sanitizeIdentifier(options.instanceName ?? "seg", "seg"),
    answerName: sanitizeIdentifier(options.answerName ?? "ans", "ans"),
    constructorArg: sourceMode === "existing_vector" || sourceMode === "read_loop"
      ? sourceName : options.sizeExpression?.trim() || "n",
    readLoop: sourceMode === "read_loop",
    queryLoop: usageMode === "query_loop",
    oneBased: options.indexing === "one_based_input",
    addUpdate, chminUpdate, chmaxUpdate,
    hasUpdates: addUpdate || chminUpdate || chmaxUpdate,
    hasPreviousBeforeChmax: addUpdate || chminUpdate,
    chmaxType: addUpdate && chminUpdate ? 3 : 2,
    sumQuery: query === "sum", minQuery: query === "min", maxQuery: query === "max"
  });
}

export function renderSegmentTreeBeatsRecipe(
  options: SegmentTreeBeatsOptions
): RenderedRecipe {
  const names = options.names;
  const updates = segmentTreeBeatsUpdateSet(options.updates);
  const queries = segmentTreeBeatsQuerySet(options.queries);
  const addUpdate = updates.has("add");
  const chminUpdate = updates.has("chmin");
  const chmaxUpdate = updates.has("chmax");
  let helpers = renderCodeTemplate("segment_tree_beats/helpers.hpp.tmpl", {
    addUpdate, chminUpdate, chmaxUpdate,
    hasUpdates: addUpdate || chminUpdate || chmaxUpdate,
    sumQuery: queries.has("sum"), minQuery: queries.has("min"), maxQuery: queries.has("max")
  });
  helpers = applyIdentifierRenames(helpers, [
    { from: "SegmentTreeBeats", to: names.className },
    { from: "Node", to: names.nodeName },
    { from: "chmin", to: names.chminName },
    { from: "chmax", to: names.chmaxName },
    { from: "add", to: names.addName },
    { from: "query_sum", to: names.querySumName },
    { from: "query_min", to: names.queryMinName },
    { from: "query_max", to: names.queryMaxName },
    { from: "chmin_rec", to: `${names.chminName}_rec` },
    { from: "chmax_rec", to: `${names.chmaxName}_rec` },
    { from: "add_rec", to: `${names.addName}_rec` },
    { from: "query_sum_rec", to: `${names.querySumName}_rec` },
    { from: "query_min_rec", to: `${names.queryMinName}_rec` },
    { from: "query_max_rec", to: `${names.queryMaxName}_rec` },
    { from: "apply_chmin", to: `apply_${names.chminName}` },
    { from: "apply_chmax", to: `apply_${names.chmaxName}` },
    { from: "apply_add", to: `apply_${names.addName}` }
  ]);
  if (options.includeUsageComment) helpers = helpers.trimEnd() + "\n\n" + renderSegmentTreeBeatsUsage(options, updates, queries);
  const usage = renderSegmentTreeBeatsUsageSnippet(options, updates, queries);
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    segmentTreeBeatsExports(options)
  );
}

export function renderSegmentTreeBeats(options: SegmentTreeBeatsOptions): string {
  return composeRecipeSections(renderSegmentTreeBeatsRecipe(options));
}

export function renderCompressUnique(options: CompressUniqueOptions): string {
  return renderCodeTemplate("compress_unique.cpp.tmpl", {
    sourceName: options.sourceName,
    valuesName: options.valuesName,
    idFunctionName: options.idFunctionName,
    copySource: options.valuesName !== options.sourceName,
    rewriteSource:
      options.rewriteSource && options.valuesName !== options.sourceName
  });
}

function normalizedInputFields(options: InputOptions): InputField[] {
  const fields = options.fields && options.fields.length > 0
    ? options.fields
    : [{ name: "value", valueType: options.valueType?.trim() || "int" }];
  return fields.map((field, index) => ({
    name: sanitizeIdentifier(field.name, `value${index + 1}`),
    valueType: field.valueType.trim() || "int",
    isIndex: Boolean(field.isIndex)
  }));
}

function inputNormalization(
  fields: InputField[],
  indexing: InputIndexing | undefined,
  expression: (field: InputField, index: number) => string,
  indentation = ""
): string {
  if (indexing !== "one_based") return "";
  return fields
    .map((field, index) => field.isIndex ? `${indentation}--${expression(field, index)};` : "")
    .filter(Boolean)
    .join("\n");
}

export function renderInputRecipe(options: InputOptions): RenderedRecipe {
  const shape = options.shape;
  const name = sanitizeIdentifier(options.name ?? "a", "a");
  const sizeExpression = options.sizeExpression?.trim() || "n";
  const valueType = options.valueType?.trim() || "int";
  const fields = normalizedInputFields(options);
  let solve = "";

  if (shape === "values") {
    solve = renderCodeTemplate("input/values.cpp.tmpl", {
      names: fields.map((field) => field.name).join(", "),
      normalization: inputNormalization(fields, options.indexing, (field) => field.name)
    });
  } else if (shape === "vector") {
    solve = renderCodeTemplate("input/vector.cpp.tmpl", {
      existing: Boolean(options.existing), valueType, name, sizeExpression,
      normalizeValues: options.indexing === "one_based" && Boolean(fields[0]?.isIndex)
    });
  } else if (shape === "matrix" || shape === "string_grid") {
    solve = renderCodeTemplate("input/matrix.cpp.tmpl", {
      existing: Boolean(options.existing),
      stringGrid: shape === "string_grid",
      valueType,
      name,
      rowExpression: options.rowExpression?.trim() || "n",
      columnExpression: options.columnExpression?.trim() || "m",
      normalizeValues:
        shape === "matrix" && options.indexing === "one_based" && Boolean(fields[0]?.isIndex)
    });
  } else if (shape === "parallel_arrays") {
    const declarations = options.existing
      ? ""
      : fields.map((field) =>
          `std::vector<${field.valueType}> ${field.name}(${sizeExpression});`
        ).join("\n");
    solve = renderCodeTemplate("input/parallel_arrays.cpp.tmpl", {
      declarations,
      sizeExpression,
      readExpressions: fields.map((field) => `${field.name}[i]`).join(", "),
      normalization: inputNormalization(
        fields, options.indexing, (field) => `${field.name}[i]`, "\t"
      ),
      visualization: fields.map((field) =>
        `EDULCNI_VIS(edulcni::live::array("input.${field.name}", ${field.name}));`
      ).join("\n")
    });
  } else if (shape === "tuple_records") {
    solve = renderCodeTemplate("input/tuple_records.cpp.tmpl", {
      name,
      sizeExpression,
      fieldTypes: fields.map((field) => field.valueType).join(", "),
      fieldNames: fields.map((field) => field.name).join(", "),
      normalization: inputNormalization(fields, options.indexing, (field) => field.name, "\t")
    });
  } else if (shape === "graph") {
    const weighted = Boolean(options.weighted);
    const weightType = options.weightType?.trim() || "long long";
    const edgesName = sanitizeIdentifier(options.edgesName ?? "edges", "edges");
    solve = renderCodeTemplate("input/graph.cpp.tmpl", {
      name,
      sizeExpression,
      edgeCountExpression: options.edgeCountExpression?.trim() || "m",
      directed: Boolean(options.directed),
      weighted,
      weightType,
      oneBased: options.indexing === "one_based",
      keepEdges: Boolean(options.keepEdges),
      edgeVectorDeclaration: weighted
        ? `std::vector<std::tuple<int, int, ${weightType}>> ${edgesName};\n${edgesName}.reserve(${options.edgeCountExpression?.trim() || "m"});`
        : `std::vector<std::pair<int, int>> ${edgesName};\n${edgesName}.reserve(${options.edgeCountExpression?.trim() || "m"});`,
      edgePush: weighted
        ? `${edgesName}.emplace_back(from, to, weight);`
        : `${edgesName}.emplace_back(from, to);`,
      degreeMetadata: Boolean(options.degreeMetadata),
      indegreeName: sanitizeIdentifier(options.indegreeName ?? "indegree", "indegree"),
      outdegreeName: sanitizeIdentifier(options.outdegreeName ?? "outdegree", "outdegree")
    });
  } else if (shape === "tree") {
    const eulerMetadata = Boolean(options.eulerMetadata);
    const subtreeMetadata = Boolean(options.subtreeMetadata);
    solve = renderCodeTemplate("input/tree.cpp.tmpl", {
      name,
      sizeExpression,
      oneBased: options.indexing === "one_based",
      rootedMetadata: Boolean(
        options.parentMetadata || options.depthMetadata || subtreeMetadata || eulerMetadata
      ),
      depthMetadata: Boolean(options.depthMetadata),
      subtreeMetadata,
      needsSubtree: subtreeMetadata || eulerMetadata,
      eulerMetadata,
      rootExpression: options.rootExpression?.trim() || "0",
      parentName: sanitizeIdentifier(options.parentName ?? "parent", "parent"),
      depthName: sanitizeIdentifier(options.depthName ?? "depth", "depth"),
      orderName: sanitizeIdentifier(options.orderName ?? "order", "order"),
      subtreeName: sanitizeIdentifier(options.subtreeName ?? "subtree_size", "subtree_size"),
      tinName: sanitizeIdentifier(options.tinName ?? "tin", "tin"),
      toutName: sanitizeIdentifier(options.toutName ?? "tout", "tout")
    });
  } else if (shape === "permutation") {
    solve = renderCodeTemplate("input/permutation.cpp.tmpl", {
      name,
      sizeExpression,
      oneBased: options.indexing === "one_based",
      inverseMetadata: Boolean(options.inverseMetadata),
      cycleMetadata: Boolean(options.cycleMetadata),
      inverseName: sanitizeIdentifier(options.inverseName ?? "inverse", "inverse"),
      cycleIdName: sanitizeIdentifier(options.cycleIdName ?? "cycle_id", "cycle_id"),
      cyclesName: sanitizeIdentifier(options.cyclesName ?? "cycles", "cycles")
    });
  } else {
    const cycleMetadata = Boolean(options.cycleMetadata);
    const indegreeName = sanitizeIdentifier(options.indegreeName ?? "indegree", "indegree");
    solve = renderCodeTemplate("input/functional_graph.cpp.tmpl", {
      name,
      sizeExpression,
      oneBased: options.indexing === "one_based",
      reverseMetadata: Boolean(options.reverseMetadata),
      reverseName: sanitizeIdentifier(options.reverseName ?? "reverse_graph", "reverse_graph"),
      indegreeMetadata: Boolean(options.degreeMetadata),
      indegreeName,
      cycleMetadata,
      cycleIndegreeName: "functional_indegree",
      cycleIdName: sanitizeIdentifier(options.cycleIdName ?? "cycle_id", "cycle_id"),
      cyclesName: sanitizeIdentifier(options.cyclesName ?? "cycles", "cycles"),
      cycleEntryName: sanitizeIdentifier(options.cycleEntryName ?? "cycle_entry", "cycle_entry"),
      distanceName: sanitizeIdentifier(options.distanceName ?? "distance_to_cycle", "distance_to_cycle")
    });
  }

  const helpers = options.includeReadHelper
    ? [renderCodeTemplate("input/read.hpp.tmpl", {})]
    : [];
  return createRenderedRecipe(
    helpers.length === 0 ? { solve: [solve] } : { helpers, solve: [solve] },
    options.includeReadHelper ? ["read"] : []
  );
}

export function renderInput(options: InputOptions): string {
  return composeRecipeSections(renderInputRecipe(options));
}

export function planConnectedComponentsNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): ConnectedComponentsNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    resultStructName: planner.reserve("ConnectedComponentsResult", "ComponentsResult"),
    functionName: planner.reserve("connected_components", "build_components")
  };
}

export function renderConnectedComponentsRecipe(
  options: ConnectedComponentsOptions
): RenderedRecipe {
  let helpers = renderCodeTemplate(
    options.kind === "strong"
      ? "connected_components/strong.hpp.tmpl"
      : "connected_components/helpers.hpp.tmpl",
    { groups: options.groups, sizes: options.sizes, weak: options.kind === "weak" }
  );
  helpers = applyIdentifierRenames(helpers, [
    { from: "ConnectedComponentsResult", to: options.names.resultStructName },
    { from: "connected_components", to: options.names.functionName }
  ]);
  const solve = renderCodeTemplate("connected_components/solve.cpp.tmpl", {
    readGraph: options.sourceMode === "read_graph",
    directed: options.kind !== "undirected",
    oneBased: options.indexing === "one_based",
    graphName: sanitizeIdentifier(options.graphName, "graph"),
    sizeExpression: options.sizeExpression.trim() || "n",
    edgeCountExpression: options.edgeCountExpression.trim() || "m",
    resultName: sanitizeIdentifier(options.resultName, "components"),
    functionName: options.names.functionName
  });
  const helperChunks = options.includeReadHelper && options.sourceMode === "read_graph"
    ? [renderCodeTemplate("input/read.hpp.tmpl", {}), helpers]
    : [helpers];
  const exports = [options.names.resultStructName, options.names.functionName];
  if (options.includeReadHelper && options.sourceMode === "read_graph") exports.unshift("read");
  return createRenderedRecipe({ helpers: helperChunks, solve: [solve] }, exports);
}

export function renderConnectedComponents(options: ConnectedComponentsOptions): string {
  return composeRecipeSections(renderConnectedComponentsRecipe(options));
}

export function planDsuNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): DsuNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    className: planner.reserve("Dsu")
  };
}

function renderDsuUsageSnippet(options: DsuOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }

  const className = options.names.className;
  const n = options.sizeExpression?.trim() || "n";
  const instance = sanitizeIdentifier(options.instanceName ?? "dsu", "dsu");
  const answer = sanitizeIdentifier(options.answerName ?? "ans", "ans");
  const templateName = usageMode === "query_loop" ? "query_loop" : usageMode;
  return renderCodeTemplate(`dsu/${templateName}.cpp.tmpl`, {
    className,
    sizeExpression: n,
    instanceName: instance,
    answerName: answer,
    oneBasedInput: options.indexing === "one_based_input"
  });
}

export function renderDsuRecipe(options: DsuOptions): RenderedRecipe {
  const className = options.names.className;
  const helpers = renderCodeTemplate("dsu/helpers.hpp.tmpl", {
    className,
    instanceName: sanitizeIdentifier(options.instanceName ?? "dsu", "dsu"),
    sizeExpression: options.sizeExpression?.trim() || "n",
    includeUsageComment: options.includeUsageComment
  });

  const usage = renderDsuUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    [className]
  );
}

export function renderDsu(options: DsuOptions): string {
  return composeRecipeSections(renderDsuRecipe(options));
}

export function planRollbackDsuNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): RollbackDsuNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    className: planner.reserve("RollbackDsu")
  };
}

function renderRollbackDsuUsage(options: RollbackDsuOptions): string {
  return renderCodeTemplate("rollback_dsu/usage-comment.cpp.tmpl", {
    className: options.names.className,
    instanceName: options.instanceName?.trim() || "dsu",
    sizeExpression: options.sizeExpression?.trim() || "n"
  });
}

function renderRollbackDsuUsageSnippet(options: RollbackDsuOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  return renderCodeTemplate("rollback_dsu/solve.cpp.tmpl", {
    className: options.names.className,
    instanceName: sanitizeIdentifier(options.instanceName ?? "dsu", "dsu"),
    sizeExpression: options.sizeExpression?.trim() || "n",
    answerName: sanitizeIdentifier(options.answerName ?? "ans", "ans"),
    instanceOnly: usageMode === "instance",
    oneBasedInput: options.indexing === "one_based_input"
  });
}

export function renderRollbackDsuRecipe(
  options: RollbackDsuOptions
): RenderedRecipe {
  const className = options.names.className;
  let helpers = renderSolverTemplate("rollback_dsu", [
    { from: "RollbackDsu", to: className }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderRollbackDsuUsage(options)}\n`;
  }
  const usage = renderRollbackDsuUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    [className]
  );
}

export function renderRollbackDsu(options: RollbackDsuOptions): string {
  return composeRecipeSections(renderRollbackDsuRecipe(options));
}

export function planLcaNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): LcaNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    className: planner.reserve("LcaBinaryLifting")
  };
}

function renderLcaUsage(options: LcaOptions): string {
  return renderCodeTemplate("lca/usage-comment.cpp.tmpl", {
    className: options.names.className,
    instanceName: options.instanceName?.trim() || "lca",
    sizeExpression: options.sizeExpression?.trim() || "n",
    rootExpression: options.rootExpression?.trim() || "root"
  });
}

function renderLcaUsageSnippet(options: LcaOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  return renderCodeTemplate("lca/solve.cpp.tmpl", {
    className: options.names.className,
    instanceName: sanitizeIdentifier(options.instanceName ?? "lca", "lca"),
    sizeExpression: options.sizeExpression?.trim() || "n",
    rootExpression: options.rootExpression?.trim() || "0",
    answerName: sanitizeIdentifier(options.answerName ?? "ans", "ans"),
    readTree: options.sourceMode === "read_tree" || usageMode === "read_tree" || usageMode === "query_loop",
    queryLoop: usageMode === "query_loop",
    oneBasedInput: options.indexing === "one_based_input"
  });
}

export function renderLcaRecipe(options: LcaOptions): RenderedRecipe {
  const className = options.names.className;
  const includeDist = options.application === "lca_dist" ||
    options.application === "tree_query_loop" || options.usageMode === "query_loop";
  const includeLca = includeDist || options.application !== "kth_ancestor";
  const includeKth = includeLca || options.application === "kth_ancestor";
  let helpers = renderCodeTemplate("lca/helpers.hpp.tmpl", {
    includeKth,
    includeLca,
    includeDist
  });
  helpers = renderHeaderContent(helpers, true);
  helpers = applyIdentifierRenames(helpers, [
    { from: "LcaBinaryLifting", to: className }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderLcaUsage(options)}\n`;
  }
  const usage = renderLcaUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    [className]
  );
}

export function renderLca(options: LcaOptions): string {
  return composeRecipeSections(renderLcaRecipe(options));
}

export function planHldNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): HldNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    className: planner.reserve("HeavyLightDecomposition")
  };
}

function renderHldUsage(options: HldOptions): string {
  return renderCodeTemplate("hld/usage-comment.cpp.tmpl", {
    className: options.names.className,
    instanceName: options.instanceName?.trim() || "hld",
    sizeExpression: options.sizeExpression?.trim() || "n",
    rootExpression: options.rootExpression?.trim() || "root"
  });
}

function renderHldUsageSnippet(options: HldOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  return renderCodeTemplate("hld/solve.cpp.tmpl", {
    className: options.names.className,
    instanceName: sanitizeIdentifier(options.instanceName ?? "hld", "hld"),
    sizeExpression: options.sizeExpression?.trim() || "n",
    rootExpression: options.rootExpression?.trim() || "0",
    answerName: sanitizeIdentifier(options.answerName ?? "ans", "ans"),
    includeLca: options.valueMode === "edge_values" ? "false" : "true",
    readTree: options.sourceMode === "read_tree" || usageMode === "read_tree" || usageMode === "query_loop",
    queryLoop: usageMode === "query_loop",
    oneBasedInput: options.indexing === "one_based_input"
  });
}

export function renderHldRecipe(options: HldOptions): RenderedRecipe {
  const className = options.names.className;
  const queryLoop = options.usageMode === "query_loop";
  let helpers = renderCodeTemplate("hld/helpers.hpp.tmpl", {
    includePath: queryLoop || options.application === "path_query",
    includeSubtree: queryLoop || options.application === "subtree_query",
    includeLca: queryLoop || options.application === "lca_distance"
  });
  helpers = renderHeaderContent(helpers, true);
  helpers = applyIdentifierRenames(helpers, [
    { from: "HeavyLightDecomposition", to: className }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderHldUsage(options)}\n`;
  }
  const usage = renderHldUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    [className]
  );
}

export function renderHld(options: HldOptions): string {
  return composeRecipeSections(renderHldRecipe(options));
}

export function planBfsNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): BfsNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    resultStructName: planner.reserve("BfsResult", "BfsSearchResult"),
    addEdgeName: planner.reserve("bfs_add_edge", "bfs_graph_add_edge"),
    multiSourceName: planner.reserve("bfs_multi_source", "bfs_from_sources"),
    singleSourceName: planner.reserve("bfs", "run_bfs"),
    restorePathName: planner.reserve("bfs_restore_path", "bfs_get_path"),
    restorePathToRootName: planner.reserve(
      "bfs_restore_path_to_root",
      "bfs_get_path_to_root"
    )
  };
}

function renderBfsUsage(options: BfsOptions): string {
  return renderCodeTemplate("bfs/usage-comment.cpp.tmpl", {
    graphName: options.graphName ?? "graph",
    sourceName: options.sourceName ?? "source",
    targetName: options.targetName ?? "target",
    resultName: options.resultName ?? "result",
    addEdgeName: options.names.addEdgeName,
    singleSourceName: options.names.singleSourceName,
    restorePathName: options.names.restorePathName
  });
}

function renderBfsUsageSnippet(options: BfsOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }
  return renderCodeTemplate("bfs/solve.cpp.tmpl", {
    sizeExpression: options.sizeExpression?.trim() || "n",
    edgeCountName: options.edgeCountName?.trim() || "m",
    graphName: sanitizeIdentifier(options.graphName ?? "graph", "graph"),
    sourceName: sanitizeIdentifier(options.sourceName ?? "source", "source"),
    targetName: sanitizeIdentifier(options.targetName ?? "target", "target"),
    resultName: sanitizeIdentifier(options.resultName ?? "result", "result"),
    addEdgeName: options.names.addEdgeName,
    multiSourceName: options.names.multiSourceName,
    singleSourceName: options.names.singleSourceName,
    restorePathName: options.names.restorePathName,
    undirected: options.graphMode === "undirected" ? "true" : "false",
    readGraph: false,
    readGraphOnly: false,
    multiSource: usageMode === "multi_source",
    pathQuery: usageMode === "path_query",
    oneBasedInput: false
  });
}

export function renderBfsRecipe(options: BfsOptions): RenderedRecipe {
  const names = options.names;
  const usageMode = options.usageMode ?? "helper_only";
  const includeAddEdge = false;
  const includeSingle = options.application !== "multi_source" && usageMode !== "multi_source";
  const includeRestorePath = options.application === "path_restore" || usageMode === "path_query";
  const includeRestoreRoot = options.application === "multi_source" || usageMode === "multi_source";
  let helpers = renderCodeTemplate("bfs/helpers.hpp.tmpl", {
    includeAddEdge,
    includeSingle,
    includeRestorePath,
    includeRestoreRoot
  });
  helpers = renderHeaderContent(helpers, true);
  helpers = applyIdentifierRenames(helpers, [
    { from: "BfsResult", to: names.resultStructName },
    { from: "bfs_add_edge", to: names.addEdgeName },
    { from: "bfs_multi_source", to: names.multiSourceName },
    { from: "bfs", to: names.singleSourceName },
    { from: "bfs_restore_path", to: names.restorePathName },
    { from: "bfs_restore_path_to_root", to: names.restorePathToRootName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderBfsUsage(options)}\n`;
  }
  const usage = renderBfsUsageSnippet(options);
  const exports = [
    names.resultStructName,
    names.multiSourceName,
    ...(includeSingle ? [names.singleSourceName] : []),
    ...(includeRestorePath ? [names.restorePathName] : []),
    ...(includeRestoreRoot ? [names.restorePathToRootName] : [])
  ];
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    exports
  );
}

export function renderBfs(options: BfsOptions): string {
  return composeRecipeSections(renderBfsRecipe(options));
}

export function planDijkstraNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): DijkstraNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    edgeStructName: planner.reserve("DijkstraEdge", "ShortestPathEdge"),
    resultStructName: planner.reserve("DijkstraResult", "ShortestPathResult"),
    addEdgeName: planner.reserve("dijkstra_add_edge", "weighted_graph_add_edge"),
    multiSourceName: planner.reserve("dijkstra_multi_source", "dijkstra_from_sources"),
    singleSourceName: planner.reserve("dijkstra", "run_dijkstra"),
    restorePathName: planner.reserve("dijkstra_restore_path", "dijkstra_get_path")
  };
}

function renderDijkstraUsage(options: DijkstraOptions): string {
  const valueType = options.valueType?.trim() || "long long";
  return renderCodeTemplate("dijkstra/usage-comment.cpp.tmpl", {
    valueType,
    infExpression: options.infExpression?.trim() || "numeric_limits<long long>::max()",
    graphName: options.graphName ?? "graph",
    sourceName: options.sourceName ?? "source",
    targetName: options.targetName ?? "target",
    resultName: options.resultName ?? "result",
    edgeStructName: options.names.edgeStructName,
    addEdgeName: options.names.addEdgeName,
    singleSourceName: options.names.singleSourceName,
    restorePathName: options.names.restorePathName
  });
}

function renderDijkstraUsageSnippet(options: DijkstraOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }
  const valueType = options.valueType?.trim() || "long long";
  return renderCodeTemplate("dijkstra/solve.cpp.tmpl", {
    valueType,
    infExpression: options.infExpression?.trim() || `std::numeric_limits<${valueType}>::max()`,
    sizeExpression: options.sizeExpression?.trim() || "n",
    edgeCountName: options.edgeCountName?.trim() || "m",
    graphName: sanitizeIdentifier(options.graphName ?? "graph", "graph"),
    sourceName: sanitizeIdentifier(options.sourceName ?? "source", "source"),
    targetName: sanitizeIdentifier(options.targetName ?? "target", "target"),
    resultName: sanitizeIdentifier(options.resultName ?? "result", "result"),
    edgeStructName: options.names.edgeStructName,
    addEdgeName: options.names.addEdgeName,
    multiSourceName: options.names.multiSourceName,
    singleSourceName: options.names.singleSourceName,
    restorePathName: options.names.restorePathName,
    undirected: options.graphMode === "undirected" ? "true" : "false",
    readGraph: false,
    readGraphOnly: false,
    multiSource: usageMode === "multi_source",
    pathQuery: usageMode === "path_query",
    oneBasedInput: false
  });
}

export function renderDijkstraRecipe(options: DijkstraOptions): RenderedRecipe {
  const names = options.names;
  const usageMode = options.usageMode ?? "helper_only";
  const includeAddEdge = false;
  const includeSingle = options.application !== "multi_source" && usageMode !== "multi_source";
  const includeRestorePath = options.application === "path_restore" || usageMode === "path_query";
  let helpers = renderCodeTemplate("dijkstra/helpers.hpp.tmpl", {
    includeAddEdge,
    includeSingle,
    includeRestorePath
  });
  helpers = renderHeaderContent(helpers, true);
  helpers = applyIdentifierRenames(helpers, [
    { from: "DijkstraEdge", to: names.edgeStructName },
    { from: "DijkstraResult", to: names.resultStructName },
    { from: "dijkstra_add_edge", to: names.addEdgeName },
    { from: "dijkstra_multi_source", to: names.multiSourceName },
    { from: "dijkstra", to: names.singleSourceName },
    { from: "dijkstra_restore_path", to: names.restorePathName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderDijkstraUsage(options)}\n`;
  }
  const usage = renderDijkstraUsageSnippet(options);
  const exports = [
    names.edgeStructName,
    names.resultStructName,
    names.multiSourceName,
    ...(includeSingle ? [names.singleSourceName] : []),
    ...(includeRestorePath ? [names.restorePathName] : [])
  ];
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    exports
  );
}

export function renderDijkstra(options: DijkstraOptions): string {
  return composeRecipeSections(renderDijkstraRecipe(options));
}

export function planToposortNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): ToposortNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    addEdgeName: planner.reserve("toposort_add_edge", "dag_add_edge"),
    sortName: planner.reserve("topological_sort", "dag_topological_sort"),
    validateName: planner.reserve("is_topological_order", "dag_is_topological_order")
  };
}

function renderToposortUsage(options: ToposortOptions): string {
  return renderCodeTemplate("toposort/usage-comment.cpp.tmpl", {
    graphName: options.graphName?.trim() || "graph",
    orderName: options.orderName?.trim() || "order",
    dagName: options.dagName?.trim() || "dag",
    addEdgeName: options.names.addEdgeName,
    sortName: options.names.sortName
  });
}

function renderToposortUsageSnippet(options: ToposortOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  return renderCodeTemplate("toposort/solve.cpp.tmpl", {
    sizeExpression: options.sizeExpression?.trim() || "n",
    edgeCountName: options.edgeCountName?.trim() || "m",
    graphName: sanitizeIdentifier(options.graphName ?? "graph", "graph"),
    orderName: sanitizeIdentifier(options.orderName ?? "order", "order"),
    dagName: sanitizeIdentifier(options.dagName ?? "dag", "dag"),
    addEdgeName: options.names.addEdgeName,
    sortName: options.names.sortName,
    validateName: options.names.validateName,
    readGraph: false,
    readGraphOnly: false,
    validateOrder: usageMode === "validate_order",
    cycleCheck: usageMode === "cycle_check",
    oneBasedInput: false
  });
}

export function renderToposortRecipe(options: ToposortOptions): RenderedRecipe {
  const names = options.names;
  const usageMode = options.usageMode ?? "helper_only";
  const includeAddEdge = options.sourceMode === "read_edges" || usageMode === "read_graph";
  const includeValidate = options.application === "order_validation" || usageMode === "validate_order";
  const includeSort = usageMode !== "validate_order" && options.application !== "order_validation";
  let helpers = renderCodeTemplate("toposort/helpers.hpp.tmpl", {
    includeAddEdge,
    includeSort,
    includeValidate
  });
  helpers = renderHeaderContent(helpers, true);
  helpers = applyIdentifierRenames(helpers, [
    { from: "toposort_add_edge", to: names.addEdgeName },
    { from: "topological_sort", to: names.sortName },
    { from: "is_topological_order", to: names.validateName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderToposortUsage(options)}\n`;
  }
  const usage = renderToposortUsageSnippet(options);
  const exports = [
    ...(includeAddEdge ? [names.addEdgeName] : []),
    ...(includeSort ? [names.sortName] : []),
    ...(includeValidate ? [names.validateName] : [])
  ];
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    exports
  );
}

export function renderToposort(options: ToposortOptions): string {
  return composeRecipeSections(renderToposortRecipe(options));
}

export function planKosarajuNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): KosarajuNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    resultStructName: planner.reserve("KosarajuResult", "SccResult"),
    addEdgeName: planner.reserve("kosaraju_add_edge", "scc_add_edge"),
    sccName: planner.reserve("kosaraju_scc", "build_scc")
  };
}

function renderKosarajuUsage(options: KosarajuOptions): string {
  return renderCodeTemplate("kosaraju/usage-comment.cpp.tmpl", {
    graphName: options.graphName?.trim() || "graph",
    resultName: options.resultName?.trim() || "scc",
    addEdgeName: options.names.addEdgeName,
    sccName: options.names.sccName
  });
}

function renderKosarajuUsageSnippet(options: KosarajuOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  return renderCodeTemplate("kosaraju/solve.cpp.tmpl", {
    sizeExpression: options.sizeExpression?.trim() || "n",
    edgeCountName: options.edgeCountName?.trim() || "m",
    graphName: sanitizeIdentifier(options.graphName ?? "graph", "graph"),
    resultName: sanitizeIdentifier(options.resultName ?? "scc", "scc"),
    resultStructName: options.names.resultStructName,
    addEdgeName: options.names.addEdgeName,
    sccName: options.names.sccName,
    readGraph: false,
    readGraphOnly: false,
    computeScc: usageMode === "compute_scc",
    printComponents: usageMode === "print_components",
    sameComponentQueries: usageMode === "same_component_queries",
    oneBasedInput: false
  });
}

export function renderKosarajuRecipe(options: KosarajuOptions): RenderedRecipe {
  const names = options.names;
  const includeAddEdge = options.sourceMode === "read_edges" || options.usageMode === "read_graph";
  const includeCondensation = options.application === "condensation_dag";
  let helpers = renderCodeTemplate("kosaraju/helpers.hpp.tmpl", {
    includeAddEdge,
    includeCondensation
  });
  helpers = renderHeaderContent(helpers, true);
  helpers = applyIdentifierRenames(helpers, [
    { from: "KosarajuResult", to: names.resultStructName },
    { from: "kosaraju_add_edge", to: names.addEdgeName },
    { from: "kosaraju_scc", to: names.sccName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderKosarajuUsage(options)}\n`;
  }
  const usage = renderKosarajuUsageSnippet(options);
  const exports = [
    names.resultStructName,
    ...(includeAddEdge ? [names.addEdgeName] : []),
    names.sccName
  ];
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    exports
  );
}

export function renderKosaraju(options: KosarajuOptions): string {
  return composeRecipeSections(renderKosarajuRecipe(options));
}

export function planMoNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): MoNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    queryStructName: planner.reserve("MoQuery", "OfflineRangeQuery"),
    blockSizeName: planner.reserve("mo_default_block_size", "offline_range_block_size"),
    normalizeName: planner.reserve("normalize_mo_query", "normalize_offline_range_query"),
    orderName: planner.reserve("mo_order", "offline_range_order"),
    processName: planner.reserve("mo_process", "process_offline_ranges")
  };
}

function renderMoUsage(options: MoOptions): string {
  return renderCodeTemplate("mo/usage-comment.cpp.tmpl", {
    queryStructName: options.names.queryStructName,
    queriesName: options.queriesName?.trim() || "queries",
    orderName: options.names.orderName
  });
}

function renderMoUsageSnippet(options: MoOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  return renderCodeTemplate("mo/solve.cpp.tmpl", {
    sizeExpression: options.sizeExpression?.trim() || "n",
    queryCountName: options.queryCountName?.trim() || "q",
    valuesName: sanitizeIdentifier(options.valuesName ?? "a", "a"),
    queriesName: sanitizeIdentifier(options.queriesName ?? "queries", "queries"),
    answersName: sanitizeIdentifier(options.answersName ?? "answers", "answers"),
    answerType: options.answerType?.trim() || "long long",
    queryStructName: options.names.queryStructName,
    processName: options.names.processName,
    readQueries: options.sourceMode !== "existing_queries",
    readQueriesOnly: usageMode === "read_queries",
    distinctCount: usageMode === "distinct_count_skeleton",
    oneBasedClosedInput: options.indexing === "one_based_closed_input"
  });
}

export function renderMoRecipe(options: MoOptions): RenderedRecipe {
  const names = options.names;
  let helpers = renderSolverTemplate("mo", [
    { from: "MoQuery", to: names.queryStructName },
    { from: "mo_default_block_size", to: names.blockSizeName },
    { from: "normalize_mo_query", to: names.normalizeName },
    { from: "mo_order", to: names.orderName },
    { from: "mo_process", to: names.processName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderMoUsage(options)}\n`;
  }
  const usage = renderMoUsageSnippet(options);
  const exports = [
    names.queryStructName,
    names.blockSizeName,
    names.normalizeName,
    names.orderName,
    names.processName
  ];
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    exports
  );
}

export function renderMo(options: MoOptions): string {
  return composeRecipeSections(renderMoRecipe(options));
}

export function planMonotonicStackNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): MonotonicStackNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    nearestLeftByName: planner.reserve("nearest_left_by", "nearest_left_with"),
    nearestRightByName: planner.reserve("nearest_right_by", "nearest_right_with"),
    nearestSmallerLeftName: planner.reserve("nearest_smaller_left", "nearest_less_left"),
    nearestSmallerRightName: planner.reserve("nearest_smaller_right", "nearest_less_right"),
    nearestGreaterLeftName: planner.reserve("nearest_greater_left", "nearest_more_left"),
    nearestGreaterRightName: planner.reserve("nearest_greater_right", "nearest_more_right"),
    nearestStructName: planner.reserve("NearestIndices", "AllNearestIndices"),
    nearestAllName: planner.reserve("nearest_all", "build_nearest_indices")
  };
}

function monotonicStackCallName(options: MonotonicStackOptions): string {
  const names = options.names;
  const relation = options.relation ?? "smaller";
  const direction = options.direction ?? "left";
  if (relation === "all" || direction === "both") {
    return names.nearestAllName;
  }
  if (relation === "greater" && direction === "right") {
    return names.nearestGreaterRightName;
  }
  if (relation === "greater") {
    return names.nearestGreaterLeftName;
  }
  if (direction === "right") {
    return names.nearestSmallerRightName;
  }
  return names.nearestSmallerLeftName;
}

function renderMonotonicStackUsage(options: MonotonicStackOptions): string {
  const callName = monotonicStackCallName(options);
  return renderCodeTemplate("monotonic_stack/usage-comment.cpp.tmpl", {
    callName,
    sourceName: options.sourceName?.trim() || "values",
    resultName: options.resultName?.trim() || "nearest",
    strict: options.strictness === "non_strict" ? "false" : "true"
  });
}

function renderMonotonicStackUsageSnippet(options: MonotonicStackOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  const callName = ((options: MonotonicStackOptions): string => {
  const names = options.names;
  if (options.relation === "all" || options.direction === "both") return names.nearestAllName;
  if (options.relation === "greater" && options.direction === "right") return names.nearestGreaterRightName;
  if (options.relation === "greater") return names.nearestGreaterLeftName;
  if (options.direction === "right") return names.nearestSmallerRightName;
  return names.nearestSmallerLeftName;
})(options);
  return renderCodeTemplate("monotonic_stack/solve.cpp.tmpl", {
    callName,
    sourceName: options.sourceName?.trim() || "values",
    resultName: sanitizeIdentifier(options.resultName ?? "nearest", "nearest"),
    strict: options.strictness === "non_strict" ? "false" : "true",
    allResult: usageMode === "compute_all" || options.relation === "all" || options.direction === "both"
  });
}

export function renderMonotonicStackRecipe(
  options: MonotonicStackOptions
): RenderedRecipe {
  const names = options.names;
  const includeAll = options.application === "all_nearest" ||
    options.relation === "all" || options.direction === "both";
  const includeLeftCore = includeAll || options.direction !== "right";
  const includeRightCore = includeAll || options.direction === "right";
  const includeSmallerLeft = includeAll ||
    (options.relation !== "greater" && options.direction !== "right");
  const includeSmallerRight = includeAll ||
    (options.relation !== "greater" && options.direction === "right");
  const includeGreaterLeft = includeAll ||
    (options.relation === "greater" && options.direction !== "right");
  const includeGreaterRight = includeAll ||
    (options.relation === "greater" && options.direction === "right");
  let helpers = renderCodeTemplate("monotonic_stack/helpers.hpp.tmpl", {
    includeAll,
    includeLeftCore,
    includeRightCore,
    includeSmallerLeft,
    includeSmallerRight,
    includeGreaterLeft,
    includeGreaterRight
  });
  helpers = renderHeaderContent(helpers, true);
  helpers = applyIdentifierRenames(helpers, [
    { from: "nearest_left_by", to: names.nearestLeftByName },
    { from: "nearest_right_by", to: names.nearestRightByName },
    { from: "nearest_smaller_left", to: names.nearestSmallerLeftName },
    { from: "nearest_smaller_right", to: names.nearestSmallerRightName },
    { from: "nearest_greater_left", to: names.nearestGreaterLeftName },
    { from: "nearest_greater_right", to: names.nearestGreaterRightName },
    { from: "NearestIndices", to: names.nearestStructName },
    { from: "nearest_all", to: names.nearestAllName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderMonotonicStackUsage(options)}\n`;
  }
  const usage = renderMonotonicStackUsageSnippet(options);
  const exports = [
    ...(includeLeftCore ? [names.nearestLeftByName] : []),
    ...(includeRightCore ? [names.nearestRightByName] : []),
    ...(includeSmallerLeft ? [names.nearestSmallerLeftName] : []),
    ...(includeSmallerRight ? [names.nearestSmallerRightName] : []),
    ...(includeGreaterLeft ? [names.nearestGreaterLeftName] : []),
    ...(includeGreaterRight ? [names.nearestGreaterRightName] : []),
    ...(includeAll ? [names.nearestStructName, names.nearestAllName] : [])
  ];
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    exports
  );
}

export function renderMonotonicStack(options: MonotonicStackOptions): string {
  return composeRecipeSections(renderMonotonicStackRecipe(options));
}

export function planGpHashTableNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): GpHashTableNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    splitMixName: planner.reserve("SplitMix64Hash", "SplitMix64Hasher"),
    hashName: planner.reserve("GpHash", "SafeHash"),
    pairHashName: planner.reserve("PairHash", "SafePairHash"),
    tableAliasName: planner.reserve("GpHashTable", "SafeHashTable")
  };
}

function renderGpHashTableUsage(options: GpHashTableOptions): string {
  return renderCodeTemplate("gp_hash_table/usage-comment.cpp.tmpl", {
    tableAliasName: options.names.tableAliasName,
    keyType: options.keyType?.trim() || "long long",
    valueType: options.valueType?.trim() || "int",
    tableName: options.tableName?.trim() || "table"
  });
}

function renderGpHashTableUsageSnippet(options: GpHashTableOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  return renderCodeTemplate("gp_hash_table/solve.cpp.tmpl", {
    tableAliasName: options.names.tableAliasName,
    keyType: options.keyType?.trim() || "long long",
    valueType: options.valueType?.trim() || "int",
    tableName: sanitizeIdentifier(options.tableName ?? "table", "table"),
    sourceName: sanitizeIdentifier(options.sourceName ?? "values", "values"),
    declareSet: usageMode === "declare_set",
    frequencyLoop: usageMode === "frequency_loop"
  });
}

export function renderGpHashTableRecipe(options: GpHashTableOptions): RenderedRecipe {
  const names = options.names;
  let helpers = renderSolverTemplate("gp_hash_table", [
    { from: "SplitMix64Hash", to: names.splitMixName },
    { from: "GpHash", to: names.hashName },
    { from: "PairHash", to: names.pairHashName },
    { from: "GpHashTable", to: names.tableAliasName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderGpHashTableUsage(options)}\n`;
  }
  const usage = renderGpHashTableUsageSnippet(options);
  const exports = [names.splitMixName, names.hashName, names.pairHashName, names.tableAliasName];
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    exports
  );
}

export function renderGpHashTable(options: GpHashTableOptions): string {
  return composeRecipeSections(renderGpHashTableRecipe(options));
}

export function planOrderedSetNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): OrderedSetNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    treeAliasName: planner.reserve("OrderedSetTree", "OrderStatisticTree"),
    className: planner.reserve("OrderedSet", "OrderStatisticSet")
  };
}

function renderOrderedSetUsage(options: OrderedSetOptions): string {
  return renderCodeTemplate("ordered_set/usage-comment.cpp.tmpl", {
    className: options.names.className,
    keyType: options.keyType?.trim() || "int",
    setName: options.setName?.trim() || "os"
  });
}

function renderOrderedSetUsageSnippet(options: OrderedSetOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  return renderCodeTemplate("ordered_set/solve.cpp.tmpl", {
    className: options.names.className,
    keyType: options.keyType?.trim() || "int",
    setName: sanitizeIdentifier(options.setName ?? "os", "os"),
    pairMultiset: usageMode === "pair_multiset",
    rankQuery: usageMode === "rank_query",
    kthQuery: usageMode === "kth_query"
  });
}

export function renderOrderedSetRecipe(options: OrderedSetOptions): RenderedRecipe {
  const names = options.names;
  let helpers = renderSolverTemplate("ordered_set", [
    { from: "OrderedSetTree", to: names.treeAliasName },
    { from: "OrderedSet", to: names.className }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderOrderedSetUsage(options)}\n`;
  }
  const usage = renderOrderedSetUsageSnippet(options);
  const exports = [names.treeAliasName, names.className];
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    exports
  );
}

export function renderOrderedSet(options: OrderedSetOptions): string {
  return composeRecipeSections(renderOrderedSetRecipe(options));
}

export function planSetUtilsNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): SetUtilsNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    nextIteratorName: planner.reserve("next_iterator", "container_next_iterator"),
    prevIteratorName: planner.reserve("prev_iterator", "container_prev_iterator"),
    nextValueName: planner.reserve("next_value", "container_next_value"),
    prevValueName: planner.reserve("prev_value", "container_prev_value")
  };
}

function setUtilsCallName(options: SetUtilsOptions): string {
  if (options.target === "iterator") {
    return options.lookup === "prev"
      ? options.names.prevIteratorName
      : options.names.nextIteratorName;
  }
  return options.lookup === "prev"
    ? options.names.prevValueName
    : options.names.nextValueName;
}

function renderSetUtilsUsage(options: SetUtilsOptions): string {
  const callName = setUtilsCallName(options);
  return renderCodeTemplate("set_utils/usage-comment.cpp.tmpl", {
    callName,
    containerName: options.containerName?.trim() || "container",
    argumentName: options.target === "iterator"
      ? options.iteratorName?.trim() || "it"
      : options.keyName?.trim() || "key",
    resultName: options.resultName?.trim() || "neighbor"
  });
}

function renderSetUtilsUsageSnippet(options: SetUtilsOptions): string {
  if ((options.usageMode ?? "helper_only") === "helper_only") return "";
  const callName = ((options: SetUtilsOptions): string => {
  if (options.target === "iterator") {
    return options.lookup === "prev" ? options.names.prevIteratorName : options.names.nextIteratorName;
  }
  return options.lookup === "prev" ? options.names.prevValueName : options.names.nextValueName;
})(options);
  return renderCodeTemplate("set_utils/solve.cpp.tmpl", {
    callName,
    containerName: options.containerName?.trim() || "container",
    argumentName: options.target === "iterator"
      ? options.iteratorName?.trim() || "it"
      : options.keyName?.trim() || "key",
    resultName: sanitizeIdentifier(options.resultName ?? "neighbor", "neighbor")
  });
}

export function renderSetUtilsRecipe(options: SetUtilsOptions): RenderedRecipe {
  const names = options.names;
  const target = options.target ?? "value";
  const lookup = options.lookup ?? "next";
  let helpers = renderCodeTemplate("set_utils/helpers.hpp.tmpl", {
    includeNextIterator: target === "iterator" && lookup === "next",
    includePrevIterator: target === "iterator" && lookup === "prev",
    includeNextValue: target === "value" && lookup === "next",
    includePrevValue: target === "value" && lookup === "prev"
  });
  helpers = renderHeaderContent(helpers, true);
  helpers = applyIdentifierRenames(helpers, [
    { from: "next_iterator", to: names.nextIteratorName },
    { from: "prev_iterator", to: names.prevIteratorName },
    { from: "next_value", to: names.nextValueName },
    { from: "prev_value", to: names.prevValueName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderSetUtilsUsage(options)}\n`;
  }
  const usage = renderSetUtilsUsageSnippet(options);
  const exports = [setUtilsCallName(options)];
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    exports
  );
}

export function renderSetUtils(options: SetUtilsOptions): string {
  return composeRecipeSections(renderSetUtilsRecipe(options));
}

export function planFastAllocatorNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): FastAllocatorNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    arenaClassName: planner.reserveExport("FastAllocatorArena", "FastArena"),
    allocatorClassName: planner.reserveExport("FastAllocator", "ArenaAllocator"),
    factoryName: planner.reserveExport("make_fast_allocator", "make_arena_allocator")
  };
}

function renderFastAllocatorUsage(options: FastAllocatorOptions): string {
  return renderCodeTemplate("fast_allocator/usage-comment.cpp.tmpl", {
    arenaClassName: options.names.arenaClassName,
    allocatorClassName: options.names.allocatorClassName,
    arenaName: sanitizeIdentifier(options.arenaName ?? "arena", "arena"),
    containerName: sanitizeIdentifier(options.containerName ?? "values", "values"),
    valueType: options.valueType?.trim() || "int",
    capacityExpression: options.capacityExpression?.trim() || "1U << 26U"
  });
}

function renderFastAllocatorUsageSnippet(options: FastAllocatorOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  return renderCodeTemplate("fast_allocator/solve.cpp.tmpl", {
    arenaClassName: options.names.arenaClassName,
    allocatorClassName: options.names.allocatorClassName,
    arenaName: sanitizeIdentifier(options.arenaName ?? "arena", "arena"),
    containerName: sanitizeIdentifier(options.containerName ?? "values", "values"),
    valueType: options.valueType?.trim() || "int",
    capacityExpression: options.capacityExpression?.trim() || "1U << 26U",
    edgeTypeName: sanitizeIdentifier(options.edgeTypeName ?? "Edge", "Edge"),
    arenaReset: usageMode === "arena_reset",
    edgeVector: usageMode === "edge_vector"
  });
}

export function renderFastAllocatorRecipe(options: FastAllocatorOptions): RenderedRecipe {
  const names = options.names;
  let helpers = renderSolverTemplate("fast_allocator", [
    { from: "FastAllocatorArena", to: names.arenaClassName },
    { from: "FastAllocator", to: names.allocatorClassName },
    { from: "make_fast_allocator", to: names.factoryName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderFastAllocatorUsage(options)}\n`;
  }
  const usage = renderFastAllocatorUsageSnippet(options);
  const exports = [names.arenaClassName, names.allocatorClassName, names.factoryName];
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    exports
  );
}

export function renderFastAllocator(options: FastAllocatorOptions): string {
  return composeRecipeSections(renderFastAllocatorRecipe(options));
}

function renderGeometryUsage(options: GeometryOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  const valueType = options.valueType?.trim() || "long long";
  return renderCodeTemplate("geometry/solve.cpp.tmpl", {
    pointType: `Point2<${valueType}>`,
    pointsName: sanitizeIdentifier(options.pointsName ?? "points", "points"),
    resultName: sanitizeIdentifier(options.resultName ?? "answer", "answer"),
    orientationCheck: usageMode === "orientation_check",
    segmentIntersection: usageMode === "segment_intersection",
    sortPoints: usageMode === "sort_points",
    buildHull: usageMode === "build_hull"
  });
}

export function renderGeometryRecipe(options: GeometryOptions): RenderedRecipe {
  const application = options.application ?? "orientation";
  const segmentFeature = application === "segment_intersection" ||
    options.usageMode === "segment_intersection";
  const angleFeature = application === "angle_sort" || options.usageMode === "sort_points";
  const hullFeature = application === "convex_hull" || options.usageMode === "build_hull";
  const orientationFeature = application === "orientation" ||
    options.usageMode === "orientation_check" || segmentFeature;
  let helpers = renderCodeTemplate("geometry/helpers.hpp.tmpl", {
    angleFeature,
    hullFeature,
    orientationFeature,
    segmentFeature
  });
  helpers = renderHeaderContent(helpers, true);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderCodeTemplate("geometry/usage-comment.cpp.tmpl", {})}`;
  }
  const usage = renderGeometryUsage(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    [
      "geometry_sign_eps",
      "Point2",
      "cross_ld",
      ...(orientationFeature ? ["geometry_sign", "orientation"] : []),
      ...(segmentFeature ? [
        "to_point_long_double", "on_segment", "segments_intersect",
        "line_intersection", "point_equal_eps", "segment_intersection"
      ] : []),
      ...(angleFeature ? [
        "vector_halfplane", "angle_less", "sort_vectors_by_angle", "sort_points_by_angle"
      ] : []),
      ...(hullFeature ? ["convex_hull"] : [])
    ]
  );
}

export function renderGeometry(options: GeometryOptions): string {
  return composeRecipeSections(renderGeometryRecipe(options));
}

const HALFPLANE_INTERSECTION_EXPORTS = [
  "Point2",
  "to_point_long_double",
  "cross_ld",
  "line_intersection",
  "HalfPlane",
  "halfplane_parallel",
  "halfplane_less",
  "halfplane_intersection_point",
  "halfplane_intersection"
];

function renderHalfplaneIntersectionUsage(options: HalfplaneIntersectionOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  return renderCodeTemplate("halfplane_intersection/solve.cpp.tmpl", {
    halfplanesName: sanitizeIdentifier(options.halfplanesName ?? "halfplanes", "halfplanes"),
    resultName: sanitizeIdentifier(options.resultName ?? "polygon", "polygon"),
    halfplaneVector: usageMode === "halfplane_vector",
    inequalityBox: usageMode === "inequality_box",
    computePolygon: usageMode === "compute_polygon"
  });
}

export function renderHalfplaneIntersectionRecipe(
  options: HalfplaneIntersectionOptions
): RenderedRecipe {
  let helpers = renderSolverTemplate("halfplane_intersection");
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderCodeTemplate("halfplane_intersection/usage-comment.cpp.tmpl", {})}`;
  }
  const usage = renderHalfplaneIntersectionUsage(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    HALFPLANE_INTERSECTION_EXPORTS
  );
}

export function renderHalfplaneIntersection(
  options: HalfplaneIntersectionOptions
): string {
  return composeRecipeSections(renderHalfplaneIntersectionRecipe(options));
}

export function defaultLinearSieveFeatures(): LinearSieveFeature[] {
  return ["lowest_prime", "primes", "factorization"];
}

export function planLinearSieveNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): LinearSieveNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    className: planner.reserve("LinearSieve"),
    lowestPrimeFunctionName: planner.reserve(
      "linear_sieve_lowest_prime",
      "build_lowest_prime"
    ),
    primesFunctionName: planner.reserve(
      "linear_sieve_primes",
      "linear_sieve_prime_list"
    )
  };
}

function hasLinearSieveFeature(
  options: LinearSieveOptions,
  feature: LinearSieveFeature
): boolean {
  return options.features.includes(feature);
}

function renderLinearSieveUsage(options: LinearSieveOptions): string {
  return renderCodeTemplate("linear_sieve/usage-comment.cpp.tmpl", {
    className: options.names.className,
    primesFunctionName: options.names.primesFunctionName,
    includeLowestPrime: hasLinearSieveFeature(options, "lowest_prime"),
    includePrimes: hasLinearSieveFeature(options, "primes"),
    includeFactorization: hasLinearSieveFeature(options, "factorization")
  });
}

export function renderLinearSieveRecipe(
  options: LinearSieveOptions
): RenderedRecipe {
  const names = options.names;
  const includeLowestPrime = hasLinearSieveFeature(options, "lowest_prime");
  const includePrimes = hasLinearSieveFeature(options, "primes");
  const includeFactorization = hasLinearSieveFeature(options, "factorization");
  let helpers = renderCodeTemplate("linear_sieve/helpers.hpp.tmpl", {
    className: names.className,
    lowestPrimeFunctionName: names.lowestPrimeFunctionName,
    primesFunctionName: names.primesFunctionName,
    includeLowestPrime,
    includePrimes,
    includeFactorization
  });
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderLinearSieveUsage(options)}\n`;
  }
  const exports = [names.className];
  if (includeLowestPrime) exports.push(names.lowestPrimeFunctionName);
  if (includePrimes) exports.push(names.primesFunctionName);
  return createRenderedRecipe({ helpers: [helpers] }, exports);
}

export function renderLinearSieve(options: LinearSieveOptions): string {
  return composeRecipeSections(renderLinearSieveRecipe(options));
}

export function defaultFenwickOperations(): FenwickOperation[] {
  return ["sum", "xor", "max", "min"];
}

export const INPUT_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/input",
  title: "Structured input",
  scenarios: [
    { id: "values", label: "values", description: "Read one or more scalar values." },
    { id: "vector", label: "vector", description: "Read a flat sequence." },
    { id: "matrix", label: "matrix", description: "Read a rectangular matrix." },
    { id: "string_grid", label: "string grid", description: "Read one string per grid row." },
    { id: "parallel_arrays", label: "parallel arrays", description: "Read record fields into separate arrays." },
    { id: "tuple_records", label: "tuple records", description: "Read records into a vector of tuples." },
    { id: "graph", label: "graph", description: "Read an edge list into adjacency lists." },
    { id: "tree", label: "tree", description: "Read tree edges and optional rooted metadata." },
    { id: "permutation", label: "permutation", description: "Read a permutation and optional metadata." },
    { id: "functional_graph", label: "functional graph", description: "Read one successor per vertex." }
  ],
  decisions: [
    {
      id: "shape",
      label: "Input shape",
      choices: [
        { id: "values", label: "values" },
        { id: "vector", label: "vector" },
        { id: "matrix", label: "matrix" },
        { id: "string_grid", label: "string grid" },
        { id: "parallel_arrays", label: "parallel arrays" },
        { id: "tuple_records", label: "tuple records" },
        { id: "graph", label: "graph" },
        { id: "tree", label: "tree" },
        { id: "permutation", label: "permutation" },
        { id: "functional_graph", label: "functional graph" }
      ]
    },
    {
      id: "indexing",
      label: "Index values in input",
      choices: [
        { id: "zero_based", label: "already 0-based" },
        { id: "one_based", label: "1-based; normalize to 0-based" }
      ]
    }
  ],
  bindings: [
    { id: "name", label: "Result name", kind: "answer", required: false },
    { id: "sizeExpression", label: "Size expression", kind: "size", required: false },
    { id: "valueType", label: "Value type", kind: "value", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "read() helper", section: "helpers" },
    { id: "solve", label: "Input declarations and reads", section: "solve" }
  ]
};

export const CONNECTED_COMPONENTS_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/connected_components",
  title: "Connected components",
  scenarios: [
    { id: "undirected", label: "undirected components", description: "Components of an undirected graph." },
    { id: "weak", label: "weak components", description: "Components after ignoring directed edge orientation." },
    { id: "strong", label: "strong components", description: "Strongly connected components of a directed graph." }
  ],
  decisions: [
    {
      id: "kind",
      label: "Component relation",
      choices: [
        { id: "undirected", label: "undirected" },
        { id: "weak", label: "weakly connected" },
        { id: "strong", label: "strongly connected" }
      ]
    },
    {
      id: "sourceMode",
      label: "Graph source",
      choices: [
        { id: "existing_graph", label: "existing adjacency list" },
        { id: "read_graph", label: "generate edge input" }
      ]
    },
    {
      id: "indexing",
      label: "Edge endpoints in input",
      choices: [
        { id: "zero_based", label: "already 0-based" },
        { id: "one_based", label: "1-based; normalize to 0-based" }
      ]
    }
  ],
  bindings: [
    { id: "graphName", label: "Graph name", kind: "source_vector", required: true },
    { id: "sizeExpression", label: "Vertex count", kind: "size", required: true },
    { id: "edgeCountExpression", label: "Edge count", kind: "query_count", required: false },
    { id: "resultName", label: "Result name", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Component traversal", section: "helpers" },
    { id: "solve", label: "Graph input and call", section: "solve" }
  ]
};

export const SEGMENT_TREE_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/segtree",
  title: "Segment tree",
  scenarios: [
    {
      id: "point_query",
      label: "point updates + range aggregate",
      description: "Iterative class or recursive helpers for point changes and range queries."
    },
    {
      id: "lazy_range",
      label: "lazy range updates",
      description: "Recursive lazy tree with range add/assign and sum/min/max/custom aggregates."
    },
    {
      id: "lazy_minmax",
      label: "lazy min/max preset",
      description: "Compatibility preset for range assign/add min/max classes and threshold descents."
    },
    {
      id: "max_subarray",
      label: "max subarray preset",
      description: "Point-set tree that returns max subarray state and best sum."
    },
    {
      id: "beats",
      label: "beats preset",
      description: "Range chmin/chmax/add with sum/min/max queries."
    }
  ],
  decisions: [
    {
      id: "aggregate",
      label: "Aggregate",
      choices: [
        { id: "sum", label: "sum" },
        { id: "min", label: "min" },
        { id: "max", label: "max" },
        { id: "custom", label: "custom node" },
        { id: "max_subarray", label: "max subarray node" },
        { id: "beats", label: "beats node" }
      ]
    },
    {
      id: "updates",
      label: "Updates",
      choices: [
        { id: "point_set", label: "point set" },
        { id: "point_add", label: "point add" },
        { id: "range_add", label: "range add" },
        { id: "range_assign", label: "range assign" },
        { id: "chmin", label: "range chmin" },
        { id: "chmax", label: "range chmax" }
      ]
    },
    {
      id: "source",
      label: "Build source",
      choices: [
        { id: "empty", label: "empty size" },
        { id: "existing_vector", label: "existing vector" },
        { id: "read_loop", label: "generated read loop" }
      ]
    },
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "instance", label: "instance/build skeleton" },
        { id: "query_loop", label: "query loop skeleton" }
      ]
    }
  ],
  bindings: [
    { id: "sizeExpression", label: "Size expression", kind: "size", required: true },
    { id: "sourceName", label: "Source vector", kind: "source_vector", required: false },
    { id: "valueType", label: "Value type", kind: "value", required: true },
    { id: "instanceName", label: "Instance name", kind: "answer", required: false },
    { id: "answerName", label: "Answer name", kind: "answer", required: false }
  ],
  usageSections: [
    {
      id: "helpers",
      label: "Helpers",
      section: "helpers"
    },
    {
      id: "solve",
      label: "Solve skeleton",
      section: "solve"
    }
  ]
};

export const SEGMENT_TREE_BEATS_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/segtree_beats",
  title: "Segment tree beats",
  scenarios: [
    {
      id: "clamp_queries",
      label: "clamp updates + queries",
      description: "Range chmin/chmax with sum/min/max queries."
    },
    {
      id: "add_clamp_queries",
      label: "add + clamp updates",
      description: "Range add combined with chmin/chmax and aggregate queries."
    },
    {
      id: "query_only",
      label: "query-only beats node",
      description: "Build the beats node surface but emit only selected queries."
    }
  ],
  decisions: [
    {
      id: "updates",
      label: "Updates",
      multi: true,
      choices: [
        { id: "chmin", label: "range chmin" },
        { id: "chmax", label: "range chmax" },
        { id: "add", label: "range add" }
      ]
    },
    {
      id: "queries",
      label: "Queries",
      multi: true,
      choices: [
        { id: "sum", label: "range sum" },
        { id: "min", label: "range min" },
        { id: "max", label: "range max" }
      ]
    },
    {
      id: "source",
      label: "Build source",
      choices: [
        { id: "empty", label: "empty size" },
        { id: "existing_vector", label: "existing vector" },
        { id: "read_loop", label: "generated read loop" }
      ]
    },
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "instance", label: "instance/build skeleton" },
        { id: "query_loop", label: "query loop skeleton" }
      ]
    }
  ],
  bindings: [
    { id: "sourceName", label: "Source vector", kind: "source_vector", required: false },
    { id: "sizeExpression", label: "Size expression", kind: "size", required: true },
    { id: "valueType", label: "Value type", kind: "value", required: true },
    { id: "instanceName", label: "Instance name", kind: "answer", required: false },
    { id: "answerName", label: "Answer name", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Segment tree beats helper", section: "helpers" },
    { id: "usage", label: "Segment tree beats usage", section: "solve" }
  ]
};

export const FENWICK_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/fenwick",
  title: "Fenwick",
  scenarios: [
    {
      id: "point_prefix",
      label: "point update + prefix query",
      description: "Use one tree for online point updates and prefix aggregates."
    },
    {
      id: "point_range",
      label: "point update + range query",
      description: "Requires an invertible operation such as sum, xor, or custom invertible."
    },
    {
      id: "range_point",
      label: "range update + point query",
      description: "Difference-array Fenwick for range additions and point reads."
    },
    {
      id: "range_sum",
      label: "range update + range sum",
      description: "Two Fenwick trees for range additions and range-sum queries."
    },
    {
      id: "frequency_kth",
      label: "frequency table kth",
      description: "Counts, prefix frequencies, and lower-bound by prefix count."
    },
    {
      id: "inversion_count",
      label: "inversion count",
      description: "Coordinate-compressed frequency skeleton."
    },
    {
      id: "prefix_minmax",
      label: "prefix min/max",
      description: "Monotone prefix aggregate updates."
    }
  ],
  decisions: [
    {
      id: "operation",
      label: "Operation",
      choices: [
        { id: "sum", label: "sum" },
        { id: "xor", label: "xor" },
        { id: "min", label: "min" },
        { id: "max", label: "max" },
        { id: "custom", label: "custom" },
        { id: "custom_invertible", label: "custom invertible" }
      ]
    },
    {
      id: "source",
      label: "Build source",
      choices: [
        { id: "empty", label: "empty size" },
        { id: "existing_vector", label: "existing vector" },
        { id: "read_loop", label: "generated read loop" }
      ]
    },
    {
      id: "usage",
      label: "Generated usage",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "instance", label: "instance initialization" },
        { id: "query_loop", label: "query loop skeleton" }
      ]
    }
  ],
  bindings: [
    { id: "sizeExpression", label: "Size expression", kind: "size", required: true },
    { id: "sourceName", label: "Source vector", kind: "source_vector", required: false },
    { id: "instanceName", label: "Instance name", kind: "value", required: true, defaultValue: "fw" },
    { id: "answerName", label: "Answer name", kind: "answer", required: false, defaultValue: "ans" }
  ],
  usageSections: [
    { id: "helpers", label: "Fenwick helper", section: "helpers" },
    { id: "usage", label: "Fenwick usage", section: "solve" }
  ]
};

export const SPARSE_TABLE_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/sparse_table",
  title: "Sparse table",
  scenarios: [
    {
      id: "range_minmax",
      label: "range min/max",
      description: "Static idempotent min and max queries over an existing or generated vector."
    },
    {
      id: "range_gcd_bitwise",
      label: "range gcd/bitwise",
      description: "Static idempotent gcd, bitwise-and, or bitwise-or queries."
    },
    {
      id: "custom_idempotent",
      label: "custom idempotent op",
      description: "Custom combine placeholder for an idempotent operation."
    }
  ],
  decisions: [
    {
      id: "variant",
      label: "Query variants",
      multi: true,
      choices: [
        { id: "min", label: "min" },
        { id: "max", label: "max" },
        { id: "gcd", label: "gcd" },
        { id: "bit_and", label: "bitwise and" },
        { id: "bit_or", label: "bitwise or" },
        { id: "custom", label: "custom idempotent" }
      ]
    },
    {
      id: "source",
      label: "Build source",
      choices: [
        { id: "existing_vector", label: "existing vector" },
        { id: "read_loop", label: "generated read loop" }
      ]
    },
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "build_call", label: "build call" },
        { id: "query_loop", label: "query loop skeleton" }
      ]
    }
  ],
  bindings: [
    { id: "sourceName", label: "Source vector", kind: "source_vector", required: true },
    { id: "sizeExpression", label: "Size expression", kind: "size", required: false },
    { id: "valueType", label: "Value type", kind: "value", required: true },
    { id: "answerName", label: "Answer name", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Sparse table helper", section: "helpers" },
    { id: "usage", label: "Sparse table usage", section: "solve" }
  ]
};

export const MERGE_SORT_TREE_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/merge_sort_tree",
  title: "Merge sort tree",
  scenarios: [
    {
      id: "range_threshold_count",
      label: "threshold counts",
      description: "Count values below or at a threshold in static ranges."
    },
    {
      id: "range_value_presence",
      label: "value presence/equality",
      description: "Check existence or count exact values in static ranges."
    },
    {
      id: "range_value_band",
      label: "value band counts",
      description: "Count values in [low, high] inside static ranges."
    }
  ],
  decisions: [
    {
      id: "query",
      label: "Query methods",
      multi: true,
      choices: [
        { id: "count_less", label: "count < x" },
        { id: "count_less_equal", label: "count <= x" },
        { id: "count_equal", label: "count == x" },
        { id: "count_in_range", label: "count in [low, high]" },
        { id: "exists", label: "exists x" }
      ]
    },
    {
      id: "source",
      label: "Build source",
      choices: [
        { id: "existing_vector", label: "existing vector" },
        { id: "read_loop", label: "generated read loop" }
      ]
    },
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "instance", label: "instance/build skeleton" },
        { id: "query_loop", label: "query loop skeleton" }
      ]
    }
  ],
  bindings: [
    { id: "sourceName", label: "Source vector", kind: "source_vector", required: true },
    { id: "sizeExpression", label: "Size expression", kind: "size", required: false },
    { id: "valueType", label: "Value type", kind: "value", required: true },
    { id: "instanceName", label: "Instance name", kind: "answer", required: false },
    { id: "answerName", label: "Answer name", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Merge sort tree helper", section: "helpers" },
    { id: "usage", label: "Merge sort tree usage", section: "solve" }
  ]
};

export const IMPLICIT_TREAP_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/implicit_treap",
  title: "Implicit treap",
  scenarios: [
    {
      id: "sequence_edit",
      label: "sequence edit",
      description: "Insert, erase, set, get, and materialize a mutable sequence."
    },
    {
      id: "range_query",
      label: "range aggregate",
      description: "Maintain a sequence with range aggregate queries."
    },
    {
      id: "range_lazy",
      label: "range lazy operations",
      description: "Range reverse and/or range add over a mutable sequence."
    },
    {
      id: "custom_aggregate",
      label: "custom aggregate",
      description: "Custom aggregate operation skeleton for sequence nodes."
    }
  ],
  decisions: [
    {
      id: "aggregate",
      label: "Aggregate",
      choices: [
        { id: "sum", label: "sum" },
        { id: "custom", label: "custom aggregate" }
      ]
    },
    {
      id: "features",
      label: "Lazy features",
      multi: true,
      choices: [
        { id: "reverse", label: "range reverse" },
        { id: "range_add", label: "range add" }
      ]
    },
    {
      id: "source",
      label: "Build source",
      choices: [
        { id: "empty", label: "empty treap" },
        { id: "existing_vector", label: "existing vector" },
        { id: "read_loop", label: "generated read loop" }
      ]
    },
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "instance", label: "instance/build skeleton" },
        { id: "query_loop", label: "query loop skeleton" }
      ]
    }
  ],
  bindings: [
    { id: "sourceName", label: "Source vector", kind: "source_vector", required: false },
    { id: "sizeExpression", label: "Size expression", kind: "size", required: false },
    { id: "valueType", label: "Value type", kind: "value", required: true },
    { id: "instanceName", label: "Instance name", kind: "answer", required: false },
    { id: "answerName", label: "Answer name", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Implicit treap helper", section: "helpers" },
    { id: "usage", label: "Implicit treap usage", section: "solve" }
  ]
};

export const DSU_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/dsu",
  title: "DSU",
  scenarios: [
    {
      id: "connectivity",
      label: "connectivity / components",
      description: "Plain unite, same, component size, and component count."
    },
    {
      id: "query_loop",
      label: "online connectivity queries",
      description: "Read type-coded unite/same/component-size queries."
    }
  ],
  decisions: [
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "instance", label: "instance skeleton" },
        { id: "query_loop", label: "query loop skeleton" }
      ]
    }
  ],
  bindings: [
    { id: "sizeExpression", label: "Node count", kind: "size", required: true },
    { id: "instanceName", label: "Instance name", kind: "answer", required: false },
    { id: "answerName", label: "Answer name", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "DSU helper", section: "helpers" },
    { id: "usage", label: "DSU usage", section: "solve" }
  ]
};

export const ROLLBACK_DSU_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/rollback_dsu",
  title: "Rollback DSU",
  scenarios: [
    {
      id: "snapshots",
      label: "snapshots / rollback",
      description: "Explicit snapshot tokens and rollback during search or backtracking."
    },
    {
      id: "offline_dynamic_connectivity",
      label: "offline dynamic connectivity",
      description: "Skeleton for time-recursive connectivity with rollback DSU."
    }
  ],
  decisions: [
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "instance", label: "instance skeleton" },
        { id: "query_loop", label: "snapshot query loop" }
      ]
    }
  ],
  bindings: [
    { id: "sizeExpression", label: "Node count", kind: "size", required: true },
    { id: "queryCountName", label: "Query count", kind: "query_count", required: false },
    { id: "instanceName", label: "Instance name", kind: "answer", required: false },
    { id: "answerName", label: "Answer name", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Rollback DSU helper", section: "helpers" },
    { id: "usage", label: "Rollback DSU usage", section: "solve" }
  ]
};

export const LCA_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/lca",
  title: "LCA",
  scenarios: [
    {
      id: "lca_dist",
      label: "LCA + distance",
      description: "Binary lifting helper for LCA and tree distance queries."
    },
    {
      id: "kth_ancestor",
      label: "kth ancestor",
      description: "Binary lifting helper for ancestor jumps."
    },
    {
      id: "tree_query_loop",
      label: "tree query loop",
      description: "Read a tree, build LCA, and answer type-coded queries."
    }
  ],
  decisions: [
    {
      id: "source",
      label: "Build source",
      choices: [
        { id: "empty", label: "empty helper" },
        { id: "read_tree", label: "generated tree read loop" }
      ]
    },
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "instance", label: "instance skeleton" },
        { id: "read_tree", label: "read tree + build" },
        { id: "query_loop", label: "query loop skeleton" }
      ]
    }
  ],
  bindings: [
    { id: "sizeExpression", label: "Node count", kind: "size", required: true },
    { id: "rootExpression", label: "Root", kind: "index", required: false },
    { id: "queryCountName", label: "Query count", kind: "query_count", required: false },
    { id: "instanceName", label: "Instance name", kind: "answer", required: false },
    { id: "answerName", label: "Answer name", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "LCA helper", section: "helpers" },
    { id: "usage", label: "LCA usage", section: "solve" }
  ]
};

export const HLD_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/hld",
  title: "Heavy-light decomposition",
  scenarios: [
    {
      id: "path_query",
      label: "path query/update",
      description: "Flatten tree paths into O(log n) contiguous ranges for a segment tree or Fenwick tree."
    },
    {
      id: "subtree_query",
      label: "subtree query/update",
      description: "Use Euler/HLD positions to turn a rooted subtree into one contiguous range."
    },
    {
      id: "lca_distance",
      label: "LCA + distance",
      description: "Use HLD heads for LCA and derive tree distances from depths."
    },
    {
      id: "build_tree",
      label: "tree flattening helper",
      description: "Build only the HLD order, parent/depth/head/position arrays, and subtree ranges."
    }
  ],
  decisions: [
    {
      id: "source",
      label: "Build source",
      choices: [
        { id: "empty", label: "empty helper" },
        { id: "read_tree", label: "generated tree read loop" }
      ]
    },
    {
      id: "value_mode",
      label: "Path value convention",
      choices: [
        { id: "vertex_values", label: "vertex values" },
        { id: "edge_values", label: "edge values / skip LCA endpoint" }
      ]
    },
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "instance", label: "instance skeleton" },
        { id: "read_tree", label: "read tree + build" },
        { id: "query_loop", label: "path/subtree/LCA query loop" }
      ]
    }
  ],
  bindings: [
    { id: "sizeExpression", label: "Node count", kind: "size", required: true },
    { id: "rootExpression", label: "Root", kind: "index", required: false },
    { id: "queryCountName", label: "Query count", kind: "query_count", required: false },
    { id: "instanceName", label: "Instance name", kind: "answer", required: false },
    { id: "answerName", label: "Answer name", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "HLD helper", section: "helpers" },
    { id: "usage", label: "HLD usage", section: "solve" }
  ]
};

export const BFS_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/bfs",
  title: "BFS",
  scenarios: [
    {
      id: "shortest_distances",
      label: "unweighted shortest distances",
      description: "Single-source BFS distances and parents on an unweighted graph."
    },
    {
      id: "multi_source",
      label: "multi-source BFS",
      description: "Start from several sources at distance zero."
    },
    {
      id: "path_restore",
      label: "restore shortest path",
      description: "Run BFS and reconstruct a source-to-target path."
    },
    {
      id: "traversal_order",
      label: "traversal order",
      description: "Use BFS order, parent tree, or reachability without path restoration."
    }
  ],
  decisions: [
    {
      id: "source",
      label: "Graph source",
      choices: [
        { id: "existing_graph", label: "existing adjacency list" },
        { id: "read_edges", label: "generated edge read loop" }
      ]
    },
    {
      id: "graph_mode",
      label: "Graph direction",
      choices: [
        { id: "undirected", label: "undirected" },
        { id: "directed", label: "directed" }
      ]
    },
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "read_graph", label: "read graph" },
        { id: "single_source", label: "single-source run" },
        { id: "multi_source", label: "multi-source run" },
        { id: "path_query", label: "path query skeleton" }
      ]
    }
  ],
  bindings: [
    { id: "sizeExpression", label: "Node count", kind: "size", required: false },
    { id: "edgeCountName", label: "Edge count", kind: "query_count", required: false },
    { id: "graphName", label: "Graph variable", kind: "source_vector", required: false },
    { id: "sourceName", label: "Source variable", kind: "index", required: false },
    { id: "targetName", label: "Target variable", kind: "index", required: false },
    { id: "resultName", label: "Result variable", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "BFS helpers", section: "helpers" },
    { id: "usage", label: "BFS usage", section: "solve" }
  ]
};

export const DIJKSTRA_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/dijkstra",
  title: "Dijkstra",
  scenarios: [
    {
      id: "shortest_paths",
      label: "weighted shortest paths",
      description: "Single-source shortest paths on a nonnegative weighted graph."
    },
    {
      id: "multi_source",
      label: "multi-source Dijkstra",
      description: "Start from several vertices at distance zero."
    },
    {
      id: "path_restore",
      label: "restore weighted shortest path",
      description: "Run Dijkstra and reconstruct the source-to-target path."
    },
    {
      id: "weighted_graph_read",
      label: "weighted graph read helper",
      description: "Generate a typed weighted adjacency list and edge input loop."
    }
  ],
  decisions: [
    {
      id: "source",
      label: "Graph source",
      choices: [
        { id: "existing_graph", label: "existing weighted adjacency list" },
        { id: "read_edges", label: "generated weighted edge loop" }
      ]
    },
    {
      id: "graph_mode",
      label: "Graph direction",
      choices: [
        { id: "directed", label: "directed" },
        { id: "undirected", label: "undirected" }
      ]
    },
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "read_graph", label: "read graph" },
        { id: "single_source", label: "single-source run" },
        { id: "multi_source", label: "multi-source run" },
        { id: "path_query", label: "path query skeleton" }
      ]
    }
  ],
  bindings: [
    { id: "sizeExpression", label: "Node count", kind: "size", required: false },
    { id: "edgeCountName", label: "Edge count", kind: "query_count", required: false },
    { id: "graphName", label: "Graph variable", kind: "source_vector", required: false },
    { id: "sourceName", label: "Source variable", kind: "index", required: false },
    { id: "targetName", label: "Target variable", kind: "index", required: false },
    { id: "resultName", label: "Result variable", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Dijkstra helpers", section: "helpers" },
    { id: "usage", label: "Dijkstra usage", section: "solve" }
  ]
};

export const TOPOSORT_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/toposort",
  title: "Topological sort",
  scenarios: [
    {
      id: "dag_order",
      label: "DAG order",
      description: "Return a topological ordering or empty output when a cycle exists."
    },
    {
      id: "cycle_detection",
      label: "cycle detection",
      description: "Use Kahn's algorithm to check whether the directed graph is acyclic."
    },
    {
      id: "dependency_schedule",
      label: "dependency scheduling",
      description: "Read before-after constraints and print a valid schedule."
    },
    {
      id: "order_validation",
      label: "validate proposed order",
      description: "Check whether a supplied order satisfies every directed edge."
    }
  ],
  decisions: [
    {
      id: "source",
      label: "Graph source",
      choices: [
        { id: "existing_graph", label: "existing adjacency list" },
        { id: "read_edges", label: "generated dependency edge loop" }
      ]
    },
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "read_graph", label: "read graph" },
        { id: "sort_order", label: "sort and print order" },
        { id: "cycle_check", label: "cycle check" },
        { id: "validate_order", label: "validate supplied order" }
      ]
    }
  ],
  bindings: [
    { id: "sizeExpression", label: "Node count", kind: "size", required: false },
    { id: "edgeCountName", label: "Edge count", kind: "query_count", required: false },
    { id: "graphName", label: "Graph variable", kind: "source_vector", required: false },
    { id: "orderName", label: "Order variable", kind: "answer", required: false },
    { id: "dagName", label: "DAG flag", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Toposort helpers", section: "helpers" },
    { id: "usage", label: "Toposort usage", section: "solve" }
  ]
};

export const KOSARAJU_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/kosaraju",
  title: "Kosaraju SCC",
  scenarios: [
    {
      id: "scc_components",
      label: "SCC components",
      description: "Compute strongly connected components and component ids."
    },
    {
      id: "same_component",
      label: "same-component queries",
      description: "Answer whether two vertices belong to the same SCC."
    },
    {
      id: "condensation_dag",
      label: "condensation DAG",
      description: "Build the SCC DAG for dynamic programming over components."
    },
    {
      id: "two_sat_analysis",
      label: "implication graph analysis",
      description: "Use SCC ids as a basis for implication-graph checks."
    }
  ],
  decisions: [
    {
      id: "source",
      label: "Graph source",
      choices: [
        { id: "existing_graph", label: "existing directed graph" },
        { id: "read_edges", label: "generated directed edge loop" }
      ]
    },
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "read_graph", label: "read graph" },
        { id: "compute_scc", label: "compute SCC" },
        { id: "same_component_queries", label: "same-component query loop" },
        { id: "print_components", label: "print components" }
      ]
    }
  ],
  bindings: [
    { id: "sizeExpression", label: "Node count", kind: "size", required: false },
    { id: "edgeCountName", label: "Edge count", kind: "query_count", required: false },
    { id: "queryCountName", label: "Query count", kind: "query_count", required: false },
    { id: "graphName", label: "Graph variable", kind: "source_vector", required: false },
    { id: "resultName", label: "Result variable", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Kosaraju helpers", section: "helpers" },
    { id: "usage", label: "Kosaraju usage", section: "solve" }
  ]
};

export const MO_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/mo",
  title: "Mo's algorithm",
  scenarios: [
    {
      id: "distinct_values",
      label: "distinct values in ranges",
      description: "Classic offline distinct-count skeleton with frequency state."
    },
    {
      id: "range_frequency",
      label: "range frequency queries",
      description: "Offline range queries maintained by add/remove callbacks."
    },
    {
      id: "range_aggregate",
      label: "custom range aggregate",
      description: "Generic add/remove/get-answer skeleton for nontrivial state."
    },
    {
      id: "custom_callbacks",
      label: "callback processor only",
      description: "Paste only the reusable ordering and processor helpers."
    }
  ],
  decisions: [
    {
      id: "source",
      label: "Query source",
      choices: [
        { id: "existing_queries", label: "existing query vector" },
        { id: "read_queries", label: "generated query read loop" }
      ]
    },
    {
      id: "indexing",
      label: "Query indexing",
      choices: [
        { id: "zero_based_half_open", label: "0-indexed [l, r)" },
        { id: "one_based_closed_input", label: "1-indexed [l, r] input" }
      ]
    },
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "read_queries", label: "read queries" },
        { id: "process_skeleton", label: "generic processor skeleton" },
        { id: "distinct_count_skeleton", label: "distinct-count skeleton" }
      ]
    }
  ],
  bindings: [
    { id: "sizeExpression", label: "Array length", kind: "size", required: false },
    { id: "queryCountName", label: "Query count", kind: "query_count", required: false },
    { id: "valuesName", label: "Values vector", kind: "source_vector", required: false },
    { id: "queriesName", label: "Queries vector", kind: "answer", required: false },
    { id: "answersName", label: "Answers vector", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Mo helpers", section: "helpers" },
    { id: "usage", label: "Mo usage", section: "solve" }
  ]
};

export const MONOTONIC_STACK_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/monotonic_stack",
  title: "Monotonic stack",
  scenarios: [
    {
      id: "nearest_smaller",
      label: "nearest smaller",
      description: "Nearest previous/next smaller or smaller-or-equal index."
    },
    {
      id: "nearest_greater",
      label: "nearest greater",
      description: "Nearest previous/next greater or greater-or-equal index."
    },
    {
      id: "all_nearest",
      label: "all nearest directions",
      description: "Compute left/right smaller and greater arrays together."
    },
    {
      id: "custom_comparator",
      label: "custom comparator",
      description: "Use nearest-left/right generic helpers with custom comparison."
    }
  ],
  decisions: [
    {
      id: "relation",
      label: "Relation",
      choices: [
        { id: "smaller", label: "smaller" },
        { id: "greater", label: "greater" },
        { id: "all", label: "all" }
      ]
    },
    {
      id: "direction",
      label: "Direction",
      choices: [
        { id: "left", label: "left" },
        { id: "right", label: "right" },
        { id: "both", label: "both" }
      ]
    },
    {
      id: "strictness",
      label: "Strictness",
      choices: [
        { id: "strict", label: "strict" },
        { id: "non_strict", label: "allow equal" }
      ]
    }
  ],
  bindings: [
    { id: "sourceName", label: "Source vector", kind: "source_vector", required: false },
    { id: "resultName", label: "Result name", kind: "answer", required: false },
    { id: "valueType", label: "Value type", kind: "value", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Monotonic stack helpers", section: "helpers" },
    { id: "usage", label: "Nearest-index usage", section: "solve" }
  ]
};

export const GP_HASH_TABLE_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/gp_hash_table",
  title: "PBDS hash table",
  scenarios: [
    {
      id: "hash_map",
      label: "hash map",
      description: "PBDS gp_hash_table keyed by splitmix-protected scalar keys."
    },
    {
      id: "hash_set",
      label: "hash set",
      description: "PBDS gp_hash_table with null_type values."
    },
    {
      id: "frequency_table",
      label: "frequency table",
      description: "Count values from an existing vector."
    },
    {
      id: "pair_key",
      label: "pair key",
      description: "Hash pairs using PairHash for coordinate or edge keys."
    }
  ],
  decisions: [
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "declare_map", label: "declare map" },
        { id: "declare_set", label: "declare set" },
        { id: "frequency_loop", label: "frequency loop" }
      ]
    }
  ],
  bindings: [
    { id: "keyType", label: "Key type", kind: "value", required: false },
    { id: "valueType", label: "Value type", kind: "value", required: false },
    { id: "tableName", label: "Table variable", kind: "answer", required: false },
    { id: "sourceName", label: "Source vector", kind: "source_vector", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Hash helpers", section: "helpers" },
    { id: "usage", label: "Hash-table usage", section: "solve" }
  ]
};

export const ORDERED_SET_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/ordered_set",
  title: "Ordered set",
  scenarios: [
    {
      id: "order_statistics",
      label: "order statistics set",
      description: "PBDS tree wrapper with rank and kth-element queries."
    },
    {
      id: "kth_element",
      label: "kth element queries",
      description: "Find the element at a zero-based order."
    },
    {
      id: "multiset_pairs",
      label: "multiset via pair keys",
      description: "Store (value, unique_id) pairs to emulate duplicates."
    },
    {
      id: "rank_queries",
      label: "rank queries",
      description: "Count elements strictly smaller than a key."
    }
  ],
  decisions: [
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "declare_set", label: "declare set" },
        { id: "rank_query", label: "rank query" },
        { id: "kth_query", label: "kth query" },
        { id: "pair_multiset", label: "pair-key multiset" }
      ]
    }
  ],
  bindings: [
    { id: "keyType", label: "Key type", kind: "value", required: false },
    { id: "setName", label: "Set variable", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Ordered-set helper", section: "helpers" },
    { id: "usage", label: "Ordered-set usage", section: "solve" }
  ]
};

export const SET_UTILS_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/set_utils",
  title: "Ordered container neighbors",
  scenarios: [
    {
      id: "next_value",
      label: "next value",
      description: "Find the first container value strictly greater than a key."
    },
    {
      id: "prev_value",
      label: "previous value",
      description: "Find the last container value strictly smaller than a key."
    },
    {
      id: "iterator_navigation",
      label: "iterator navigation",
      description: "Move safely to previous or next iterator with optional output."
    },
    {
      id: "map_neighbor",
      label: "map neighbor",
      description: "Retrieve neighboring key/value entries from maps."
    }
  ],
  decisions: [
    {
      id: "lookup",
      label: "Lookup",
      choices: [
        { id: "next", label: "next" },
        { id: "prev", label: "previous" }
      ]
    },
    {
      id: "target",
      label: "Target",
      choices: [
        { id: "value", label: "value" },
        { id: "iterator", label: "iterator" }
      ]
    }
  ],
  bindings: [
    { id: "containerName", label: "Container", kind: "source_vector", required: false },
    { id: "keyName", label: "Key", kind: "value", required: false },
    { id: "iteratorName", label: "Iterator", kind: "value", required: false },
    { id: "resultName", label: "Result", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Set utilities", section: "helpers" },
    { id: "usage", label: "Neighbor lookup", section: "solve" }
  ]
};

export const FAST_ALLOCATOR_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/fast_allocator",
  title: "Arena-backed allocator",
  scenarios: [
    {
      id: "many_vectors",
      label: "many vectors",
      description: "Use a preallocated arena for vectors with heavy allocation churn."
    },
    {
      id: "graph_edges",
      label: "graph edge lists",
      description: "Allocate many edge records from one arena-backed vector."
    },
    {
      id: "pool_reset",
      label: "reset per test",
      description: "Reuse the same arena across test cases or phases."
    },
    {
      id: "custom_container",
      label: "custom container",
      description: "Paste allocator helpers for a custom STL container."
    }
  ],
  decisions: [
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "vector_declaration", label: "vector declaration" },
        { id: "edge_vector", label: "edge vector" },
        { id: "arena_reset", label: "arena reset" }
      ]
    }
  ],
  bindings: [
    { id: "valueType", label: "Value type", kind: "value", required: false },
    { id: "capacityExpression", label: "Arena capacity", kind: "size", required: false },
    { id: "arenaName", label: "Arena variable", kind: "answer", required: false },
    { id: "containerName", label: "Container variable", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Allocator helper", section: "helpers" },
    { id: "usage", label: "Allocator usage", section: "solve" }
  ]
};

export const GEOMETRY_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/geometry",
  title: "2D geometry",
  scenarios: [
    {
      id: "orientation",
      label: "orientation and cross products",
      description: "Point operations, signed area, orientation, and on-segment checks."
    },
    {
      id: "segment_intersection",
      label: "segment intersection",
      description: "Intersection predicate plus exact point/overlap extraction."
    },
    {
      id: "angle_sort",
      label: "angle sorting",
      description: "Sort vectors or points around a center by polar angle."
    },
    {
      id: "convex_hull",
      label: "convex hull",
      description: "Monotonic-chain hull for unique extreme points."
    }
  ],
  decisions: [
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "orientation_check", label: "orientation check" },
        { id: "segment_intersection", label: "segment intersection" },
        { id: "sort_points", label: "sort points by angle" },
        { id: "build_hull", label: "build convex hull" }
      ]
    }
  ],
  bindings: [
    { id: "valueType", label: "Coordinate type", kind: "value", required: false },
    { id: "pointsName", label: "Points vector", kind: "source_vector", required: false },
    { id: "resultName", label: "Result variable", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Geometry helpers", section: "helpers" },
    { id: "usage", label: "Geometry usage", section: "solve" }
  ]
};

export const HALFPLANE_INTERSECTION_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/templates/halfplane_intersection",
  title: "Half-plane intersection",
  scenarios: [
    {
      id: "convex_polygon",
      label: "convex polygon from halfplanes",
      description: "Build the polygon produced by directed half-plane boundaries."
    },
    {
      id: "linear_constraints",
      label: "linear constraints",
      description: "Convert inequalities ax + by <= c into half-planes."
    },
    {
      id: "clip_polygon",
      label: "polygon clipping",
      description: "Maintain a vector of clipping half-planes and compute the intersection."
    }
  ],
  decisions: [
    {
      id: "usage",
      label: "Generated output",
      choices: [
        { id: "helper_only", label: "definitions only" },
        { id: "halfplane_vector", label: "half-plane vector" },
        { id: "inequality_box", label: "inequality box" },
        { id: "compute_polygon", label: "compute polygon" }
      ]
    }
  ],
  bindings: [
    { id: "halfplanesName", label: "Half-planes vector", kind: "source_vector", required: false },
    { id: "resultName", label: "Result polygon", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "Half-plane helpers", section: "helpers" },
    { id: "usage", label: "Half-plane usage", section: "solve" }
  ]
};

export function planFenwickNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): FenwickNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    sumOpName: planner.reserve("FenwickSumOp"),
    xorOpName: planner.reserve("FenwickXorOp"),
    maxOpName: planner.reserve("FenwickMaxOp"),
    minOpName: planner.reserve("FenwickMinOp"),
    customOpName: planner.reserve("FenwickCustomOp"),
    customInvertibleOpName: planner.reserve("FenwickCustomInvertibleOp"),
    className: planner.reserve("Fenwick"),
    rangeClassName: planner.reserve("RangeFenwick"),
    sumAliasName: planner.reserve("FenwickSumTree"),
    xorAliasName: planner.reserve("FenwickXorTree"),
    maxAliasName: planner.reserve("FenwickMaxTree"),
    minAliasName: planner.reserve("FenwickMinTree"),
    customAliasName: planner.reserve("FenwickCustomTree"),
    customInvertibleAliasName: planner.reserve("FenwickCustomInvertibleTree")
  };
}

export function defaultFenwickOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): FenwickOptions {
  return {
    operations: defaultFenwickOperations(),
    application: "point_range",
    sourceMode: "empty",
    sizeExpression: sizeExpressionCandidates(analysis)[0] ?? "n",
    valueType: "long long",
    indexing: "zero_based",
    usageMode: "helper_only",
    instanceName: suggestIdentifier(analysis, "fw", "fenwick"),
    answerName: suggestIdentifier(analysis, "ans", "answer"),
    names: planFenwickNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

function hasFenwickOperation(
  options: FenwickOptions,
  operation: FenwickOperation
): boolean {
  return options.operations.includes(operation);
}

function primaryFenwickOperation(options: FenwickOptions): FenwickOperation {
  return options.operations[0] ?? "sum";
}

function fenwickAliasForOperation(
  names: FenwickNames,
  operation: FenwickOperation
): string {
  if (operation === "xor") {
    return names.xorAliasName;
  }
  if (operation === "max") {
    return names.maxAliasName;
  }
  if (operation === "min") {
    return names.minAliasName;
  }
  if (operation === "custom") {
    return names.customAliasName;
  }
  if (operation === "custom_invertible") {
    return names.customInvertibleAliasName;
  }
  return names.sumAliasName;
}

function fenwickValueType(options: FenwickOptions): string {
  return options.valueType?.trim() || "long long";
}

function fenwickSizeExpression(options: FenwickOptions): string {
  return options.sizeExpression?.trim() || "n";
}

function fenwickInstanceName(options: FenwickOptions): string {
  return options.instanceName?.trim() || "fw";
}

function renderFenwickUsageSnippet(options: FenwickOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  const operation = primaryFenwickOperation(options);
  const application = options.application ?? "point_range";
  const templateName = application === "range_sum"
    ? "solve-range-sum.cpp.tmpl"
    : application === "range_point"
      ? "solve-range-point.cpp.tmpl"
      : "solve-point.cpp.tmpl";
  return renderCodeTemplate(`fenwick/${templateName}`, {
    ...options.names,
    aliasName: fenwickAliasForOperation(options.names, operation),
    valueType: fenwickValueType(options),
    sizeExpression: fenwickSizeExpression(options),
    instanceName: fenwickInstanceName(options),
    sourceName: options.sourceName?.trim() || "a",
    answerName: options.answerName?.trim() || "ans",
    queryLoop: usageMode === "query_loop",
    oneBased: options.indexing === "one_based_input",
    existingVector: options.sourceMode === "existing_vector",
    readLoop: options.sourceMode === "read_loop",
    inversionCount: application === "inversion_count"
  });
}

function renderFenwickUsage(options: FenwickOptions): string {
  return renderCodeTemplate("fenwick/usage-comment.cpp.tmpl", {
    ...options.names,
    sumOp: hasFenwickOperation(options, "sum"),
    maxOp: hasFenwickOperation(options, "max"),
    minOp: hasFenwickOperation(options, "min"),
    xorOp: hasFenwickOperation(options, "xor")
  });
}

export function renderFenwickRecipe(options: FenwickOptions): RenderedRecipe {
  const names = options.names;
  const operations: Array<[FenwickOperation, string, string]> = [
    ["sum", names.sumOpName, names.sumAliasName],
    ["xor", names.xorOpName, names.xorAliasName],
    ["max", names.maxOpName, names.maxAliasName],
    ["min", names.minOpName, names.minAliasName],
    ["custom", names.customOpName, names.customAliasName],
    ["custom_invertible", names.customInvertibleOpName, names.customInvertibleAliasName]
  ];
  const included = new Set(options.operations);
  let helpers = renderCodeTemplate("fenwick/helpers.hpp.tmpl", {
    sumOp: included.has("sum"), xorOp: included.has("xor"),
    maxOp: included.has("max"), minOp: included.has("min"),
    customOp: included.has("custom"), customInvertibleOp: included.has("custom_invertible"),
    rangeSum: options.application === "range_sum"
  });
  helpers = applyIdentifierRenames(helpers, [
    { from: "Fenwick", to: names.className },
    { from: "FenwickRange", to: names.rangeClassName },
    { from: "FenwickSumOp", to: names.sumOpName },
    { from: "FenwickXorOp", to: names.xorOpName },
    { from: "FenwickMaxOp", to: names.maxOpName },
    { from: "FenwickMinOp", to: names.minOpName },
    { from: "FenwickCustomOp", to: names.customOpName },
    { from: "FenwickCustomInvertibleOp", to: names.customInvertibleOpName },
    { from: "FenwickSumTree", to: names.sumAliasName },
    { from: "FenwickXorTree", to: names.xorAliasName },
    { from: "FenwickMaxTree", to: names.maxAliasName },
    { from: "FenwickMinTree", to: names.minAliasName },
    { from: "FenwickCustomTree", to: names.customAliasName },
    { from: "FenwickCustomInvertibleTree", to: names.customInvertibleAliasName }
  ]);
  if (options.includeUsageComment) helpers = helpers.trimEnd() + "\n\n" + renderFenwickUsage(options);
  const exports = [names.className];
  for (const [operation, opName, aliasName] of operations) {
    if (included.has(operation)) exports.push(opName, aliasName);
  }
  if (options.application === "range_sum") exports.push(names.rangeClassName);
  const usage = renderFenwickUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    exports
  );
}

export function renderFenwick(options: FenwickOptions): string {
  return composeRecipeSections(renderFenwickRecipe(options));
}

export function planModIntNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): ModIntNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    staticClassName: planner.reserve("StaticModInt"),
    dynamicClassName: planner.reserve("DynamicModInt")
  };
}

export function defaultModIntOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): ModIntOptions {
  return {
    mode: "static",
    dynamicDefaultModExpression: "1000000007",
    names: planModIntNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

function includeStaticModInt(options: ModIntOptions): boolean {
  return options.mode === "static" || options.mode === "both";
}

function includeDynamicModInt(options: ModIntOptions): boolean {
  return options.mode === "dynamic" || options.mode === "both";
}

function renderModIntUsage(options: ModIntOptions): string {
  return renderCodeTemplate("modint/usage-comment.cpp.tmpl", {
    staticClassName: options.names.staticClassName,
    dynamicClassName: options.names.dynamicClassName,
    includeStatic: includeStaticModInt(options),
    includeDynamic: includeDynamicModInt(options)
  });
}







export function renderModIntRecipe(options: ModIntOptions): RenderedRecipe {
  const includeStatic = includeStaticModInt(options);
  const includeDynamic = includeDynamicModInt(options);
  let helpers = renderCodeTemplate("modint/helpers.hpp.tmpl", {
    includeStatic,
    includeDynamic,
    dynamicDefaultModExpression: options.dynamicDefaultModExpression.trim() || "1000000007"
  });
  helpers = applyIdentifierRenames(helpers, [
    { from: "StaticModInt", to: options.names.staticClassName },
    { from: "DynamicModInt", to: options.names.dynamicClassName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderModIntUsage(options)}\n`;
  }
  const exports: string[] = [];
  if (includeStatic) exports.push(options.names.staticClassName);
  if (includeDynamic) exports.push(options.names.dynamicClassName);
  return createRenderedRecipe({ helpers: [helpers] }, exports);
}

export function renderModInt(options: ModIntOptions): string {
  return composeRecipeSections(renderModIntRecipe(options));
}

export function renderFactorialPrecalc(options: ModularPrecalcOptions): string {
  return renderCodeTemplate("factorial_precalc.cpp.tmpl", {
    valueType: options.valueType.trim() || "Mint",
    limitExpression: options.limitExpression.trim() || "n"
  });
}

export function renderPowersPrecalc(options: ModularPrecalcOptions): string {
  return renderCodeTemplate("powers_precalc.cpp.tmpl", {
    valueType: options.valueType.trim() || "Mint",
    limitExpression: options.limitExpression.trim() || "n",
    baseExpression: options.baseExpression?.trim() || "base"
  });
}

export function defaultTwoSatFeatures(): TwoSatFeature[] {
  return [];
}

export function planTwoSatNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): TwoSatNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    className: planner.reserve("TwoSat"),
    resetName: planner.reserve("reset", "twosat_reset"),
    addOrName: planner.reserve("add_or", "twosat_add_or"),
    addImplicationName: planner.reserve(
      "add_implication",
      "twosat_add_implication"
    ),
    addXorName: planner.reserve("add_xor", "twosat_add_xor"),
    addEqualName: planner.reserve("add_equal", "twosat_add_equal"),
    addTrueName: planner.reserve("add_true", "twosat_add_true"),
    addFalseName: planner.reserve("add_false", "twosat_add_false"),
    addAtMostOneName: planner.reserve(
      "add_at_most_one",
      "twosat_add_at_most_one"
    ),
    solveName: planner.reserve("solve", "twosat_solve"),
    valueName: planner.reserve("value", "twosat_value"),
    assignmentName: planner.reserve("assignment", "twosat_assignment"),
    implicationGraphName: planner.reserve(
      "implication_graph",
      "twosat_implication_graph"
    ),
    componentName: planner.reserve("component", "twosat_component"),
    okVarName: planner.reserve("ok_var", "twosat_ok_var"),
    nodeName: planner.reserve("node", "twosat_node"),
    addDirectName: planner.reserve("add_direct", "twosat_add_direct"),
    sccName: planner.reserve(
      "strongly_connected_components",
      "twosat_scc"
    ),
    graphFieldName: planner.reserve("graph_", "twosat_graph_"),
    assignmentFieldName: planner.reserve(
      "assignment_",
      "twosat_assignment_"
    ),
    componentFieldName: planner.reserve("component_", "twosat_component_")
  };
}

export function defaultTwoSatOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): TwoSatOptions {
  return {
    features: defaultTwoSatFeatures(),
    names: planTwoSatNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

function twoSatFeatureSet(features: TwoSatFeature[]): Set<TwoSatFeature> {
  return new Set(features);
}

function twoSatExports(options: TwoSatOptions): string[] {
  return [options.names.className];
}

function renderTwoSatUsage(
  options: TwoSatOptions,
  features: Set<TwoSatFeature>
): string {
  return renderCodeTemplate("twosat/usage-comment.cpp.tmpl", {
    ...options.names,
    xorFeature: features.has("xor"),
    equalFeature: features.has("equal"),
    forceFeature: features.has("force")
  });
}

export function renderTwoSatRecipe(options: TwoSatOptions): RenderedRecipe {
  const names = options.names;
  const features = twoSatFeatureSet(options.features);
  let helpers = renderCodeTemplate("twosat/helpers.hpp.tmpl", {
    xorFeature: features.has("xor"),
    equalFeature: features.has("equal"),
    forceFeature: features.has("force"),
    atMostOneFeature: features.has("at_most_one"),
    componentsFeature: features.has("components")
  });
  helpers = applyIdentifierRenames(helpers, [
    { from: "TwoSat", to: names.className },
    { from: "reset", to: names.resetName },
    { from: "add_or", to: names.addOrName },
    { from: "add_implication", to: names.addImplicationName },
    { from: "add_xor", to: names.addXorName },
    { from: "add_equal", to: names.addEqualName },
    { from: "add_true", to: names.addTrueName },
    { from: "add_false", to: names.addFalseName },
    { from: "add_at_most_one", to: names.addAtMostOneName },
    { from: "solve", to: names.solveName },
    { from: "value", to: names.valueName },
    { from: "assignment", to: names.assignmentName },
    { from: "implication_graph", to: names.implicationGraphName },
    { from: "component", to: names.componentName },
    { from: "ok_var", to: names.okVarName },
    { from: "node", to: names.nodeName },
    { from: "add_direct", to: names.addDirectName },
    { from: "strongly_connected_components", to: names.sccName },
    { from: "graph_", to: names.graphFieldName },
    { from: "assignment_", to: names.assignmentFieldName },
    { from: "component_", to: names.componentFieldName }
  ]);
  if (options.includeUsageComment) {
    helpers += "\n\n" + renderTwoSatUsage(options, features);
  }
  return createRenderedRecipe({ helpers: [helpers] }, twoSatExports(options));
}

export function renderTwoSat(options: TwoSatOptions): string {
  return composeRecipeSections(renderTwoSatRecipe(options));
}

export function defaultMaxflowDinicFeatures(): MaxflowDinicFeature[] {
  return [];
}

export function defaultMaxflowDinicCapType(analysis: CppAnalysis): string {
  return analysis.identifiers.has("ll") ? "ll" : "long long";
}

export function planMaxflowDinicNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): MaxflowDinicNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    className: planner.reserve("Dinic", "MaxflowDinic"),
    edgeName: planner.reserve("Edge", "DinicEdge"),
    resetName: planner.reserve("reset", "reset_dinic"),
    addEdgeName: planner.reserve("add_edge", "dinic_add_edge"),
    maxFlowName: planner.reserve("max_flow", "dinic_max_flow"),
    minCutName: planner.reserve("left_of_min_cut", "dinic_left_of_min_cut"),
    graphName: planner.reserve("graph", "dinic_graph"),
    resetFlowsName: planner.reserve("reset_flows", "dinic_reset_flows"),
    buildLevelName: planner.reserve(
      "build_level_graph",
      "dinic_build_level_graph"
    ),
    pushFlowName: planner.reserve("push_flow", "dinic_push_flow"),
    graphFieldName: planner.reserve("graph_", "dinic_graph_"),
    levelFieldName: planner.reserve("level_", "dinic_level_"),
    ptrFieldName: planner.reserve("ptr_", "dinic_ptr_"),
    solveName: planner.reserve("solve", "solve_maxflow"),
    instanceName: planner.reserve("dinic", "flow"),
    answerName: planner.reserve("max_flow", "flow_value")
  };
}

export function defaultMaxflowDinicOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): MaxflowDinicOptions {
  const names = planMaxflowDinicNames(analysis, extraReserved);
  const dataPlanner = createNamePlanner(analysis, [
    ...extraReserved,
    ...Object.values(names)
  ]);
  return {
    capType: defaultMaxflowDinicCapType(analysis),
    features: defaultMaxflowDinicFeatures(),
    generateInput: false,
    names,
    nodeCountName: dataPlanner.reserve("n", "flow_n"),
    edgeCountName: dataPlanner.reserve("m", "flow_m"),
    sourceName: dataPlanner.reserve("s", "source"),
    sinkName: dataPlanner.reserve("t", "sink"),
    fromName: dataPlanner.reserve("u", "from"),
    toName: dataPlanner.reserve("v", "to"),
    edgeCapName: dataPlanner.reserve("cap", "edge_cap"),
    includeUsageComment: true
  };
}

function maxflowDinicFeatureSet(
  features: MaxflowDinicFeature[]
): Set<MaxflowDinicFeature> {
  return new Set(features);
}

function maxflowDinicExports(options: MaxflowDinicOptions): string[] {
  return [options.names.className];
}

function renderMaxflowDinicUsage(
  options: MaxflowDinicOptions,
  features: Set<MaxflowDinicFeature>
): string {
  const names = options.names;
  return renderCodeTemplate("maxflow_dinic/usage-comment.cpp.tmpl", {
    className: names.className,
    capType: options.capType,
    instanceName: names.instanceName,
    addEdgeName: names.addEdgeName,
    answerName: names.answerName,
    maxFlowName: names.maxFlowName,
    minCutName: names.minCutName,
    resetFlowsName: names.resetFlowsName,
    minCut: features.has("min_cut"),
    resetFlows: features.has("reset_flows")
  });
}

function renderMaxflowDinicSolveSection(options: MaxflowDinicOptions): string {
  const names = options.names;
  return renderCodeTemplate("maxflow_dinic/solve.cpp.tmpl", {
    solveName: names.solveName,
    className: names.className,
    capType: options.capType,
    instanceName: names.instanceName,
    addEdgeName: names.addEdgeName,
    answerName: names.answerName,
    maxFlowName: names.maxFlowName,
    nodeCountName: options.nodeCountName,
    edgeCountName: options.edgeCountName,
    sourceName: options.sourceName,
    sinkName: options.sinkName,
    fromName: options.fromName,
    toName: options.toName,
    edgeCapName: options.edgeCapName
  });
}

export function renderMaxflowDinicRecipe(
  options: MaxflowDinicOptions
): RenderedRecipe {
  const names = options.names;
  const features = maxflowDinicFeatureSet(options.features);
  let helpers = renderCodeTemplate("maxflow_dinic/helpers.hpp.tmpl", {
    minCut: features.has("min_cut"),
    graphAccess: features.has("graph_access"),
    resetFlows: features.has("reset_flows")
  });
  helpers = applyIdentifierRenames(helpers, [
    { from: "Dinic", to: names.className },
    { from: "Edge", to: names.edgeName },
    { from: "reset", to: names.resetName },
    { from: "add_edge", to: names.addEdgeName },
    { from: "max_flow", to: names.maxFlowName },
    { from: "left_of_min_cut", to: names.minCutName },
    { from: "graph", to: names.graphName },
    { from: "reset_flows", to: names.resetFlowsName },
    { from: "build_level_graph", to: names.buildLevelName },
    { from: "push_flow", to: names.pushFlowName },
    { from: "graph_", to: names.graphFieldName },
    { from: "level_", to: names.levelFieldName },
    { from: "iter_", to: names.ptrFieldName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderMaxflowDinicUsage(options, features)}\n`;
  }
  const sections: Partial<Record<SolutionSection, string[]>> = { helpers: [helpers] };
  if (options.generateInput) sections.solve = [renderMaxflowDinicSolveSection(options)];
  return createRenderedRecipe(sections, maxflowDinicExports(options));
}

export function renderMaxflowDinic(options: MaxflowDinicOptions): string {
  return composeRecipeSections(renderMaxflowDinicRecipe(options));
}

export function defaultMinCostMaxFlowFeatures(): MinCostMaxFlowFeature[] {
  return [];
}

export function defaultMinCostMaxFlowCapType(analysis: CppAnalysis): string {
  return analysis.identifiers.has("ll") ? "ll" : "long long";
}

export function defaultMinCostMaxFlowCostType(analysis: CppAnalysis): string {
  return analysis.identifiers.has("ll") ? "ll" : "long long";
}

export function planMinCostMaxFlowNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): MinCostMaxFlowNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    className: planner.reserve("MinCostMaxFlow", "MincostMaxflow"),
    edgeName: planner.reserve("Edge", "McmfEdge"),
    resetName: planner.reserve("reset", "reset_mincost_flow"),
    addEdgeName: planner.reserve("add_edge", "mcmf_add_edge"),
    graphName: planner.reserve("graph", "mcmf_graph"),
    potentialName: planner.reserve("potential", "mcmf_potential"),
    setPotentialName: planner.reserve(
      "set_potential_with_bellman_ford",
      "mcmf_set_potential_with_bellman_ford"
    ),
    minCostFlowName: planner.reserve("min_cost_flow", "mcmf_min_cost_flow"),
    maxFlowMinCostName: planner.reserve(
      "max_flow_min_cost",
      "mcmf_max_flow_min_cost"
    ),
    minCostMaxFlowName: planner.reserve(
      "min_cost_max_flow",
      "mcmf_min_cost_max_flow"
    ),
    vertexOkName: planner.reserve("vertex_ok", "mcmf_vertex_ok"),
    infCostName: planner.reserve("inf_cost", "mcmf_inf_cost"),
    bellmanFordName: planner.reserve(
      "bellman_ford_initialize",
      "mcmf_bellman_ford_initialize"
    ),
    dijkstraName: planner.reserve("dijkstra", "mcmf_dijkstra"),
    graphFieldName: planner.reserve("graph_", "mcmf_graph_"),
    potentialFieldName: planner.reserve("potential_", "mcmf_potential_"),
    distFieldName: planner.reserve("dist_", "mcmf_dist_"),
    prevVertexFieldName: planner.reserve("prev_vertex_", "mcmf_prev_vertex_"),
    prevEdgeFieldName: planner.reserve("prev_edge_", "mcmf_prev_edge_"),
    hasNegativeFieldName: planner.reserve(
      "has_negative_cost_edge_",
      "mcmf_has_negative_cost_edge_"
    ),
    potentialsInitializedFieldName: planner.reserve(
      "potentials_initialized_",
      "mcmf_potentials_initialized_"
    ),
    solveName: planner.reserve("solve", "solve_mincost_flow"),
    instanceName: planner.reserve("flow", "mcmf"),
    resultName: planner.reserve("result", "flow_cost")
  };
}

export function defaultMinCostMaxFlowOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): MinCostMaxFlowOptions {
  const names = planMinCostMaxFlowNames(analysis, extraReserved);
  const dataPlanner = createNamePlanner(analysis, [
    ...extraReserved,
    ...Object.values(names)
  ]);
  return {
    capType: defaultMinCostMaxFlowCapType(analysis),
    costType: defaultMinCostMaxFlowCostType(analysis),
    features: defaultMinCostMaxFlowFeatures(),
    generateInput: false,
    mode: "max_flow",
    names,
    nodeCountName: dataPlanner.reserve("n", "flow_n"),
    edgeCountName: dataPlanner.reserve("m", "flow_m"),
    sourceName: dataPlanner.reserve("s", "source"),
    sinkName: dataPlanner.reserve("t", "sink"),
    fromName: dataPlanner.reserve("u", "from"),
    toName: dataPlanner.reserve("v", "to"),
    edgeCapName: dataPlanner.reserve("cap", "edge_cap"),
    edgeCostName: dataPlanner.reserve("cost", "edge_cost"),
    flowLimitName: dataPlanner.reserve("flow_limit", "required_flow"),
    includeUsageComment: true
  };
}

function minCostMaxFlowFeatureSet(
  features: MinCostMaxFlowFeature[]
): Set<MinCostMaxFlowFeature> {
  return new Set(features);
}

function minCostMaxFlowExports(options: MinCostMaxFlowOptions): string[] {
  return [options.names.className];
}

function renderMinCostMaxFlowUsage(
  options: MinCostMaxFlowOptions,
  features: Set<MinCostMaxFlowFeature>
): string {
  const names = options.names;
  return renderCodeTemplate("mincost_maxflow/usage-comment.cpp.tmpl", {
    className: names.className,
    capType: options.capType,
    costType: options.costType,
    instanceName: names.instanceName,
    addEdgeName: names.addEdgeName,
    resultName: names.resultName,
    minCostFlowName: names.minCostFlowName,
    minCostMaxFlowName: names.minCostMaxFlowName,
    flowLimitName: options.flowLimitName,
    graphName: names.graphName,
    setPotentialName: names.setPotentialName,
    fixedFlow: options.mode === "fixed_flow",
    graphAccess: features.has("graph_access"),
    potentialAccess: features.has("potential_access")
  });
}

function renderMinCostMaxFlowSolveSection(
  options: MinCostMaxFlowOptions
): string {
  const names = options.names;
  return renderCodeTemplate("mincost_maxflow/solve.cpp.tmpl", {
    solveName: names.solveName,
    className: names.className,
    capType: options.capType,
    costType: options.costType,
    instanceName: names.instanceName,
    addEdgeName: names.addEdgeName,
    resultName: names.resultName,
    minCostFlowName: names.minCostFlowName,
    minCostMaxFlowName: names.minCostMaxFlowName,
    nodeCountName: options.nodeCountName,
    edgeCountName: options.edgeCountName,
    sourceName: options.sourceName,
    sinkName: options.sinkName,
    fromName: options.fromName,
    toName: options.toName,
    edgeCapName: options.edgeCapName,
    edgeCostName: options.edgeCostName,
    flowLimitName: options.flowLimitName,
    fixedFlow: options.mode === "fixed_flow"
  });
}

export function renderMinCostMaxFlowRecipe(
  options: MinCostMaxFlowOptions
): RenderedRecipe {
  const names = options.names;
  const features = minCostMaxFlowFeatureSet(options.features);
  let helpers = renderCodeTemplate("mincost_maxflow/helpers.hpp.tmpl", {
    graphAccess: features.has("graph_access"),
    potentialAccess: features.has("potential_access")
  });
  helpers = applyIdentifierRenames(helpers, [
    { from: "MinCostMaxFlow", to: names.className },
    { from: "Edge", to: names.edgeName },
    { from: "reset", to: names.resetName },
    { from: "add_edge", to: names.addEdgeName },
    { from: "graph", to: names.graphName },
    { from: "potential", to: names.potentialName },
    { from: "set_potential_with_bellman_ford", to: names.setPotentialName },
    { from: "min_cost_flow", to: names.minCostFlowName },
    { from: "max_flow_min_cost", to: names.maxFlowMinCostName },
    { from: "min_cost_max_flow", to: names.minCostMaxFlowName },
    { from: "vertex_ok", to: names.vertexOkName },
    { from: "inf_cost", to: names.infCostName },
    { from: "bellman_ford_initialize", to: names.bellmanFordName },
    { from: "dijkstra", to: names.dijkstraName },
    { from: "graph_", to: names.graphFieldName },
    { from: "potential_", to: names.potentialFieldName },
    { from: "dist_", to: names.distFieldName },
    { from: "prev_vertex_", to: names.prevVertexFieldName },
    { from: "prev_edge_", to: names.prevEdgeFieldName },
    { from: "has_negative_cost_edge_", to: names.hasNegativeFieldName },
    { from: "potentials_initialized_", to: names.potentialsInitializedFieldName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderMinCostMaxFlowUsage(options, features)}\n`;
  }
  const sections: Partial<Record<SolutionSection, string[]>> = { helpers: [helpers] };
  if (options.generateInput) sections.solve = [renderMinCostMaxFlowSolveSection(options)];
  return createRenderedRecipe(sections, minCostMaxFlowExports(options));
}

export function renderMinCostMaxFlow(options: MinCostMaxFlowOptions): string {
  return composeRecipeSections(renderMinCostMaxFlowRecipe(options));
}

export function defaultHungarianCostType(analysis: CppAnalysis): string {
  return analysis.identifiers.has("ll") ? "ll" : "long long";
}

export function planHungarianNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): HungarianNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    resultStructName: planner.reserve("HungarianResult"),
    internalName: planner.reserve("hungarian_internal"),
    minimizeName: planner.reserve("hungarian"),
    maximizeName: planner.reserve("hungarian_maximize"),
    solveName: planner.reserve("solve", "solve_hungarian")
  };
}

export function defaultHungarianOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): HungarianOptions {
  const names = planHungarianNames(analysis, extraReserved);
  const dataPlanner = createNamePlanner(analysis, [
    ...extraReserved,
    ...Object.values(names)
  ]);
  return {
    costType: defaultHungarianCostType(analysis),
    sourceName: dataPlanner.reserve("cost", "cost_matrix"),
    mode: "minimize",
    rectangular: true,
    generateInput: false,
    names,
    rowCountName: dataPlanner.reserve("n", "rows"),
    colCountName: dataPlanner.reserve("m", "cols"),
    resultName: dataPlanner.reserve("assignment", "hungarian_result"),
    includeUsageComment: true
  };
}

function hungarianCallName(options: HungarianOptions): string {
  return options.mode === "maximize"
    ? options.names.maximizeName
    : options.names.minimizeName;
}

function hungarianExports(options: HungarianOptions): string[] {
  const exports = [
    options.names.resultStructName,
    options.names.internalName,
    options.names.minimizeName
  ];
  if (options.mode === "maximize") {
    exports.push(options.names.maximizeName);
  }
  return exports;
}

function renderHungarianUsage(options: HungarianOptions): string {
  return renderCodeTemplate("hungarian/usage-comment.cpp.tmpl", {
    resultName: options.resultName,
    callName: hungarianCallName(options),
    sourceName: options.sourceName
  });
}

function renderHungarianSolveSection(options: HungarianOptions): string {
  return renderCodeTemplate("hungarian/solve.cpp.tmpl", {
    solveName: options.names.solveName,
    rowCountName: options.rowCountName,
    colCountName: options.colCountName,
    costType: options.costType,
    sourceName: options.sourceName,
    resultName: options.resultName,
    callName: hungarianCallName(options)
  });
}

export function renderHungarianRecipe(options: HungarianOptions): RenderedRecipe {
  const names = options.names;
  let helpers = renderCodeTemplate("hungarian/helpers.hpp.tmpl", {
    rectangular: options.rectangular,
    maximize: options.mode === "maximize"
  });
  helpers = applyIdentifierRenames(helpers, [
    { from: "HungarianResult", to: names.resultStructName },
    { from: "hungarian_internal", to: names.internalName },
    { from: "hungarian", to: names.minimizeName },
    { from: "hungarian_maximize", to: names.maximizeName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderHungarianUsage(options)}\n`;
  }
  const sections: Partial<Record<SolutionSection, string[]>> = { helpers: [helpers] };
  if (options.generateInput) sections.solve = [renderHungarianSolveSection(options)];
  return createRenderedRecipe(sections, hungarianExports(options));
}

export function renderHungarian(options: HungarianOptions): string {
  return composeRecipeSections(renderHungarianRecipe(options));
}

export function defaultKuhnFeatures(): KuhnFeature[] {
  return ["vertex_cover"];
}

export function planKuhnNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): KuhnNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    resultStructName: planner.reserve("KuhnResult"),
    coverStructName: planner.reserve("BipartiteVertexCover"),
    className: planner.reserve("KuhnMatcher"),
    resetName: planner.reserve("reset", "kuhn_reset"),
    leftSizeName: planner.reserve("left_size", "kuhn_left_size"),
    rightSizeName: planner.reserve("right_size", "kuhn_right_size"),
    graphName: planner.reserve("graph", "kuhn_graph"),
    addEdgeName: planner.reserve("add_edge", "kuhn_add_edge"),
    maximumMatchingName: planner.reserve("maximum_matching", "kuhn_maximum_matching_method"),
    tryAugmentName: planner.reserve("try_augment", "kuhn_dfs"),
    matchFunctionName: planner.reserve("kuhn_maximum_matching"),
    vertexCoverFunctionName: planner.reserve("minimum_vertex_cover_bipartite"),
    matchingSizeName: planner.reserve("matching_size", "kuhn_matching_size"),
    matchLeftName: planner.reserve("match_left", "kuhn_match_left"),
    matchRightName: planner.reserve("match_right", "kuhn_match_right"),
    leftCoverName: planner.reserve("left_vertices", "kuhn_left_vertices"),
    rightCoverName: planner.reserve("right_vertices", "kuhn_right_vertices"),
    solveName: planner.reserve("solve", "solve_kuhn")
  };
}

export function defaultKuhnOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): KuhnOptions {
  const names = planKuhnNames(analysis, extraReserved);
  const dataPlanner = createNamePlanner(analysis, [
    ...extraReserved,
    ...Object.values(names)
  ]);
  const leftCountName = dataPlanner.reserve("n", "left_n");
  const rightCountName = dataPlanner.reserve("m", "right_n");
  const edgeCountName = dataPlanner.reserve("e", "edge_count");
  const leftVertexName = dataPlanner.reserve("u", "left");
  const rightVertexName = dataPlanner.reserve("v", "right");
  return {
    features: defaultKuhnFeatures(),
    generateInput: false,
    decrementInput: true,
    sourceName: dataPlanner.reserve("graph", "adj"),
    rightSizeName: dataPlanner.reserve("right_size", "right_size_value"),
    names,
    leftCountName,
    rightCountName,
    edgeCountName,
    leftVertexName,
    rightVertexName,
    instanceName: dataPlanner.reserve("matcher", "kuhn_matcher"),
    resultName: dataPlanner.reserve("matching", "kuhn_matching"),
    coverName: dataPlanner.reserve("vertex_cover", "kuhn_vertex_cover"),
    includeUsageComment: true
  };
}

function kuhnFeatureSet(features: KuhnFeature[]): Set<KuhnFeature> {
  return new Set(features);
}

function kuhnExports(
  options: KuhnOptions,
  features: Set<KuhnFeature>
): string[] {
  const exports = [
    options.names.resultStructName,
    options.names.className,
    options.names.matchFunctionName
  ];
  if (features.has("vertex_cover")) {
    exports.push(options.names.coverStructName);
    exports.push(options.names.vertexCoverFunctionName);
  }
  return exports;
}

function renderKuhnUsage(
  options: KuhnOptions,
  features: Set<KuhnFeature>
): string {
  return renderCodeTemplate("kuhn/usage-comment.cpp.tmpl", {
    className: options.names.className,
    instanceName: options.instanceName,
    leftCountName: options.leftCountName,
    rightCountName: options.rightCountName,
    leftVertexName: options.leftVertexName,
    rightVertexName: options.rightVertexName,
    addEdgeName: options.names.addEdgeName,
    maximumMatchingName: options.names.maximumMatchingName,
    resultName: options.resultName,
    matchingSizeName: options.names.matchingSizeName,
    coverName: options.coverName,
    vertexCoverFunctionName: options.names.vertexCoverFunctionName,
    graphName: options.names.graphName,
    vertexCover: features.has("vertex_cover")
  });
}

function renderKuhnSolveSection(options: KuhnOptions): string {
  return renderCodeTemplate("kuhn/solve.cpp.tmpl", {
    solveName: options.names.solveName,
    className: options.names.className,
    addEdgeName: options.names.addEdgeName,
    maximumMatchingName: options.names.maximumMatchingName,
    matchingSizeName: options.names.matchingSizeName,
    leftCountName: options.leftCountName,
    rightCountName: options.rightCountName,
    edgeCountName: options.edgeCountName,
    leftVertexName: options.leftVertexName,
    rightVertexName: options.rightVertexName,
    instanceName: options.instanceName,
    resultName: options.resultName,
    decrementInput: options.decrementInput
  });
}

export function renderKuhnRecipe(options: KuhnOptions): RenderedRecipe {
  const features = kuhnFeatureSet(options.features);
  const names = options.names;
  let helpers = renderCodeTemplate("kuhn/helpers.hpp.tmpl", {
    vertexCover: features.has("vertex_cover")
  });
  helpers = applyIdentifierRenames(helpers, [
    { from: "KuhnResult", to: names.resultStructName },
    { from: "BipartiteVertexCover", to: names.coverStructName },
    { from: "KuhnMatcher", to: names.className },
    { from: "reset", to: names.resetName },
    { from: "left_size", to: names.leftSizeName },
    { from: "right_size", to: names.rightSizeName },
    { from: "graph", to: names.graphName },
    { from: "add_edge", to: names.addEdgeName },
    { from: "maximum_matching", to: names.maximumMatchingName },
    { from: "try_augment", to: names.tryAugmentName },
    { from: "kuhn_maximum_matching", to: names.matchFunctionName },
    { from: "minimum_vertex_cover_bipartite", to: names.vertexCoverFunctionName },
    { from: "matching_size", to: names.matchingSizeName },
    { from: "match_left", to: names.matchLeftName },
    { from: "match_right", to: names.matchRightName },
    { from: "left_vertices", to: names.leftCoverName },
    { from: "right_vertices", to: names.rightCoverName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderKuhnUsage(options, features)}\n`;
  }
  const sections: Partial<Record<SolutionSection, string[]>> = { helpers: [helpers] };
  if (options.generateInput) sections.solve = [renderKuhnSolveSection(options)];
  return createRenderedRecipe(sections, kuhnExports(options, features));
}

export function renderKuhn(options: KuhnOptions): string {
  return composeRecipeSections(renderKuhnRecipe(options));
}

export function defaultImplicitTreapFeatures(): ImplicitTreapFeature[] {
  return ["reverse"];
}

export function planImplicitTreapNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): ImplicitTreapNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    sumOpName: planner.reserve("TreapSumOp"),
    customOpName: planner.reserve("TreapCustomOp"),
    className: planner.reserve("ImplicitTreap"),
    nodeName: planner.reserve("Node", "TreapNode"),
    splitName: planner.reserve("split", "treap_split"),
    mergeName: planner.reserve("merge", "treap_merge"),
    rootName: planner.reserve("root", "treap_root"),
    rngName: planner.reserve("rng_state", "treap_rng_state"),
    reverseName: planner.reserve("reverse", "treap_reverse"),
    addName: planner.reserve("add", "treap_add")
  };
}

function implicitTreapFeatureSet(
  features: ImplicitTreapFeature[]
): Set<ImplicitTreapFeature> {
  return new Set(features);
}

function implicitTreapOpName(options: ImplicitTreapOptions): string {
  return options.aggregate === "custom"
    ? options.names.customOpName
    : options.names.sumOpName;
}

function implicitTreapExports(options: ImplicitTreapOptions): string[] {
  return [implicitTreapOpName(options), options.names.className];
}

function renderImplicitTreapUsage(
  options: ImplicitTreapOptions,
  features: Set<ImplicitTreapFeature>
): string {
  const opName = implicitTreapOpName(options);
  return renderCodeTemplate("implicit_treap/usage-comment.cpp.tmpl", {
    ...options.names,
    typeArgs: options.aggregate === "custom"
      ? `<${options.valueType}, ${opName}<${options.valueType}>>`
      : `<${options.valueType}>`,
    reverseFeature: features.has("reverse"),
    rangeAddFeature: features.has("range_add")
  });
}

function renderImplicitTreapUsageSnippet(
  options: ImplicitTreapOptions,
  features: Set<ImplicitTreapFeature>
): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  const opName = implicitTreapOpName(options);
  const reverseFeature = features.has("reverse");
  const sourceMode = options.sourceMode ?? "empty";
  return renderCodeTemplate("implicit_treap/solve.cpp.tmpl", {
    ...options.names,
    valueType: options.valueType,
    typeArgs: options.aggregate === "custom"
      ? `<${options.valueType}, ${opName}<${options.valueType}>>`
      : `<${options.valueType}>`,
    sourceName: options.sourceName?.trim() || "a",
    sizeExpression: options.sizeExpression?.trim() || "n",
    instanceName: sanitizeIdentifier(options.instanceName ?? "treap", "treap"),
    answerName: sanitizeIdentifier(options.answerName ?? "ans", "ans"),
    readLoop: sourceMode === "read_loop",
    assignSource: sourceMode === "existing_vector" || sourceMode === "read_loop",
    queryLoop: usageMode === "query_loop",
    oneBased: options.indexing === "one_based_input",
    reverseFeature,
    rangeAddFeature: features.has("range_add"),
    addQueryType: reverseFeature ? 5 : 4
  });
}

function renderImplicitTreapOp(
  options: ImplicitTreapOptions,
  features: Set<ImplicitTreapFeature>
): string {
  return renderCodeTemplate(
    options.aggregate === "custom"
      ? "implicit_treap/op-custom.hpp.tmpl"
      : "implicit_treap/op-sum.hpp.tmpl",
    { rangeAddFeature: features.has("range_add") }
  );
}

export function renderImplicitTreapRecipe(
  options: ImplicitTreapOptions
): RenderedRecipe {
  const names = options.names;
  const features = implicitTreapFeatureSet(options.features);
  const opName = implicitTreapOpName(options);
  let opDefinition = renderImplicitTreapOp(options, features);
  opDefinition = applyIdentifierRenames(opDefinition, [
    { from: options.aggregate === "custom" ? "TreapCustomOp" : "TreapSumOp", to: opName }
  ]);
  let helpers = renderCodeTemplate("implicit_treap/helpers.hpp.tmpl", {
    opDefinition,
    reverseFeature: features.has("reverse"),
    rangeAddFeature: features.has("range_add")
  });
  helpers = applyIdentifierRenames(helpers, [
    { from: "TreapSumOp", to: opName },
    { from: "ImplicitTreap", to: names.className },
    { from: "Node", to: names.nodeName },
    { from: "split", to: names.splitName },
    { from: "merge", to: names.mergeName },
    { from: "root_", to: `${names.rootName}_` },
    { from: "rng_state_", to: `${names.rngName}_` },
    { from: "reverse", to: names.reverseName },
    { from: "add", to: names.addName }
  ]);
  if (options.includeUsageComment) helpers = helpers.trimEnd() + "\n\n" + renderImplicitTreapUsage(options, features);
  const usage = renderImplicitTreapUsageSnippet(options, features);
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    implicitTreapExports(options)
  );
}

export function renderImplicitTreap(options: ImplicitTreapOptions): string {
  return composeRecipeSections(renderImplicitTreapRecipe(options));
}

export function defaultMergeSortTreeQueries(): MergeSortTreeQuery[] {
  return ["count_less", "count_in_range"];
}

export function planMergeSortTreeNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): MergeSortTreeNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    className: planner.reserve("MergeSortTree"),
    storageName: planner.reserve("tree_", "merge_tree_"),
    buildName: planner.reserve("build", "build_merge_sort_tree"),
    normName: planner.reserve("norm", "merge_sort_tree_norm"),
    buildRecName: planner.reserve("build_rec", "merge_sort_tree_build_rec"),
    countLessName: planner.reserve("count_less", "merge_sort_tree_count_less"),
    countLessEqualName: planner.reserve(
      "count_less_equal",
      "merge_sort_tree_count_less_equal"
    ),
    countEqualName: planner.reserve("count_equal", "merge_sort_tree_count_equal"),
    countInRangeName: planner.reserve(
      "count_in_range",
      "merge_sort_tree_count_in_range"
    ),
    existsName: planner.reserve("exists", "merge_sort_tree_exists"),
    countLessRecName: planner.reserve(
      "count_less_rec",
      "merge_sort_tree_count_less_rec"
    ),
    countLessEqualRecName: planner.reserve(
      "count_less_equal_rec",
      "merge_sort_tree_count_less_equal_rec"
    ),
    countInRangeRecName: planner.reserve(
      "count_in_range_rec",
      "merge_sort_tree_count_in_range_rec"
    ),
    existsRecName: planner.reserve("exists_rec", "merge_sort_tree_exists_rec")
  };
}

function mergeSortTreeQuerySet(
  queries: MergeSortTreeQuery[]
): Set<MergeSortTreeQuery> {
  return new Set(queries.length === 0 ? defaultMergeSortTreeQueries() : queries);
}

function mergeSortTreeExports(options: MergeSortTreeOptions): string[] {
  return [options.names.className];
}

function renderMergeSortTreeUsage(
  options: MergeSortTreeOptions,
  queries: Set<MergeSortTreeQuery>
): string {
  return renderCodeTemplate("merge_sort_tree/usage-comment.cpp.tmpl", {
    ...options.names,
    valueType: options.valueType,
    sourceName: options.sourceName,
    countLess: queries.has("count_less"),
    countLessEqual: queries.has("count_less_equal"),
    countEqual: queries.has("count_equal"),
    countInRange: queries.has("count_in_range"),
    exists: queries.has("exists")
  });
}

function firstMergeSortTreeQuery(queries: Set<MergeSortTreeQuery>): MergeSortTreeQuery {
  for (const query of [
    "count_less",
    "count_less_equal",
    "count_equal",
    "count_in_range",
    "exists"
  ] as const) {
    if (queries.has(query)) {
      return query;
    }
  }
  return "count_less";
}

function renderMergeSortTreeUsageSnippet(
  options: MergeSortTreeOptions,
  queries: Set<MergeSortTreeQuery>
): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  const query = firstMergeSortTreeQuery(queries);
  return renderCodeTemplate("merge_sort_tree/solve.cpp.tmpl", {
    ...options.names,
    valueType: options.valueType,
    sourceName: options.sourceName.trim() || "a",
    sizeExpression: options.sizeExpression?.trim() || "n",
    instanceName: sanitizeIdentifier(options.instanceName ?? "mst", "mst"),
    answerName: sanitizeIdentifier(options.answerName ?? "ans", "ans"),
    readLoop: options.sourceMode === "read_loop",
    queryLoop: usageMode === "query_loop",
    oneBased: options.indexing === "one_based_input",
    rangeQuery: query === "count_in_range",
    countLessQuery: query === "count_less",
    countLessEqualQuery: query === "count_less_equal",
    countEqualQuery: query === "count_equal",
    existsQuery: query === "exists"
  });
}

export function renderMergeSortTreeRecipe(
  options: MergeSortTreeOptions
): RenderedRecipe {
  const queries = mergeSortTreeQuerySet(options.queries);
  const names = options.names;
  let helpers = renderCodeTemplate("merge_sort_tree/helpers.hpp.tmpl", {
    countLess: queries.has("count_less"),
    countLessEqual: queries.has("count_less_equal"),
    countEqual: queries.has("count_equal"),
    countInRange: queries.has("count_in_range"),
    needsRangeRec: queries.has("count_equal") || queries.has("count_in_range"),
    exists: queries.has("exists")
  });
  helpers = applyIdentifierRenames(helpers, [
    { from: "MergeSortTree", to: names.className },
    { from: "tree_", to: names.storageName },
    { from: "build", to: names.buildName },
    { from: "norm", to: names.normName },
    { from: "build_rec", to: names.buildRecName },
    { from: "count_less", to: names.countLessName },
    { from: "count_less_equal", to: names.countLessEqualName },
    { from: "count_equal", to: names.countEqualName },
    { from: "count_in_range", to: names.countInRangeName },
    { from: "exists", to: names.existsName },
    { from: "count_less_rec", to: names.countLessRecName },
    { from: "count_less_equal_rec", to: names.countLessEqualRecName },
    { from: "count_in_range_rec", to: names.countInRangeRecName },
    { from: "exists_rec", to: names.existsRecName }
  ]);
  if (options.includeUsageComment) helpers = helpers.trimEnd() + "\n\n" + renderMergeSortTreeUsage(options, queries);
  const usage = renderMergeSortTreeUsageSnippet(options, queries);
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    mergeSortTreeExports(options)
  );
}

export function renderMergeSortTree(options: MergeSortTreeOptions): string {
  return composeRecipeSections(renderMergeSortTreeRecipe(options));
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
    queryMaxName: planner.reserve("query_sparse_max"),
    gcdTableName: planner.reserve("sparse_gcd"),
    buildGcdName: planner.reserve("build_sparse_gcd"),
    queryGcdName: planner.reserve("query_sparse_gcd"),
    bitAndTableName: planner.reserve("sparse_bit_and"),
    buildBitAndName: planner.reserve("build_sparse_bit_and"),
    queryBitAndName: planner.reserve("query_sparse_bit_and"),
    bitOrTableName: planner.reserve("sparse_bit_or"),
    buildBitOrName: planner.reserve("build_sparse_bit_or"),
    queryBitOrName: planner.reserve("query_sparse_bit_or"),
    customTableName: planner.reserve("sparse_custom"),
    buildCustomName: planner.reserve("build_sparse_custom"),
    queryCustomName: planner.reserve("query_sparse_custom"),
    customCombineName: planner.reserve("sparse_combine")
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
  if (variants.has("gcd")) {
    exports.push(
      options.names.gcdTableName,
      options.names.buildGcdName,
      options.names.queryGcdName
    );
  }
  if (variants.has("bit_and")) {
    exports.push(
      options.names.bitAndTableName,
      options.names.buildBitAndName,
      options.names.queryBitAndName
    );
  }
  if (variants.has("bit_or")) {
    exports.push(
      options.names.bitOrTableName,
      options.names.buildBitOrName,
      options.names.queryBitOrName
    );
  }
  if (variants.has("custom")) {
    exports.push(
      options.names.customCombineName,
      options.names.customTableName,
      options.names.buildCustomName,
      options.names.queryCustomName
    );
  }
  return exports;
}

function renderSparseTableCommentUsage(
  options: SparseTableOptions,
  variants: Set<SparseTableVariant>
): string {
  const answerNames: Record<SparseTableVariant, string> = {
    min: "mn",
    max: "mx",
    gcd: "g",
    bit_and: "common_bits",
    bit_or: "any_bits",
    custom: "value"
  };
  const variantExamples = [...variants].map((variant) => {
    const names = sparseTableVariantNames(options, variant);
    return renderCodeTemplate("sparse_table/usage-comment-variant.cpp.tmpl", {
      buildName: names.buildName,
      queryName: names.queryName,
      sourceName: options.sourceName,
      answerName: answerNames[variant]
    }).trim();
  }).join("\n");
  return renderCodeTemplate("sparse_table/usage-comment.cpp.tmpl", {
    variantExamples
  });
}

function sparseTableVariantNames(
  options: SparseTableOptions,
  variant: SparseTableVariant
): { tableName: string; buildName: string; queryName: string } {
  const names = options.names;
  if (variant === "min") return { tableName: names.minTableName, buildName: names.buildMinName, queryName: names.queryMinName };
  if (variant === "max") return { tableName: names.maxTableName, buildName: names.buildMaxName, queryName: names.queryMaxName };
  if (variant === "gcd") return { tableName: names.gcdTableName, buildName: names.buildGcdName, queryName: names.queryGcdName };
  if (variant === "bit_and") return { tableName: names.bitAndTableName, buildName: names.buildBitAndName, queryName: names.queryBitAndName };
  if (variant === "bit_or") return { tableName: names.bitOrTableName, buildName: names.buildBitOrName, queryName: names.queryBitOrName };
  return { tableName: names.customTableName, buildName: names.buildCustomName, queryName: names.queryCustomName };
}

function renderSparseTableVariant(
  options: SparseTableOptions,
  variant: SparseTableVariant
): string {
  const names = sparseTableVariantNames(options, variant);
  return renderCodeTemplate("sparse_table/variant.hpp.tmpl", {
    valueType: options.valueType,
    logName: options.names.logName,
    ensureLogName: options.names.ensureLogName,
    customCombineName: options.names.customCombineName,
    tableName: names.tableName,
    buildName: names.buildName,
    queryName: names.queryName,
    min: variant === "min",
    max: variant === "max",
    gcd: variant === "gcd",
    bitAnd: variant === "bit_and",
    bitOr: variant === "bit_or",
    custom: variant === "custom"
  });
}

function firstSparseTableVariant(variants: Set<SparseTableVariant>): SparseTableVariant {
  for (const variant of ["min", "max", "gcd", "bit_and", "bit_or", "custom"] as const) {
    if (variants.has(variant)) {
      return variant;
    }
  }
  return "min";
}

function renderSparseTableUsageSnippet(
  options: SparseTableOptions,
  variants: Set<SparseTableVariant>
): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") return "";
  const sourceName = options.sourceName.trim() || "a";
  const chunks: string[] = [];
  if (options.sourceMode === "read_loop") {
    chunks.push(renderCodeTemplate("sparse_table/read-source.cpp.tmpl", {
      valueType: options.valueType,
      sourceName,
      sizeExpression: options.sizeExpression?.trim() || "n"
    }));
  }
  for (const variant of variants) {
    chunks.push(renderCodeTemplate("sparse_table/build.cpp.tmpl", {
      buildName: sparseTableVariantNames(options, variant).buildName,
      sourceName
    }));
  }
  if (usageMode === "query_loop") {
    const queryName = sparseTableVariantNames(options, firstSparseTableVariant(variants)).queryName;
    chunks.push(renderCodeTemplate("sparse_table/query-loop.cpp.tmpl", {
      queryName,
      answerName: sanitizeIdentifier(options.answerName ?? "ans", "ans"),
      oneBasedInput: options.indexing === "one_based_input"
    }));
  }
  return chunks.map((chunk) => chunk.trim()).filter(Boolean).join("\n");
}

export function renderSparseTableRecipe(options: SparseTableOptions): RenderedRecipe {
  const variants = sparseTableVariantSet(options.variants);
  const chunks = [renderCodeTemplate("sparse_table/base.hpp.tmpl", {
    logName: options.names.logName,
    ensureLogName: options.names.ensureLogName
  })];
  for (const variant of variants) chunks.push(renderSparseTableVariant(options, variant));
  if (options.includeUsageComment) chunks.push(renderSparseTableCommentUsage(options, variants));
  const helpers = chunks.map((chunk) => chunk.trim()).filter(Boolean).join("\n\n");
  const usage = renderSparseTableUsageSnippet(options, variants);
  return createRenderedRecipe(
    usage === "" ? { helpers: [helpers] } : { helpers: [helpers], solve: [usage] },
    sparseTableExports(options, variants)
  );
}

export function renderSparseTable(options: SparseTableOptions): string {
  return composeRecipeSections(renderSparseTableRecipe(options));
}

export function defaultSuffixArrayFeatures(): SuffixArrayFeature[] {
  return [];
}

export function planSuffixArrayNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): SuffixArrayNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    resultStructName: planner.reserve("SuffixArrayResult"),
    buildPositiveCodesName: planner.reserve(
      "suffix_array_build_from_positive_codes"
    ),
    buildStringName: planner.reserve("suffix_array_build"),
    buildIntsName: planner.reserve("suffix_array_build_from_ints"),
    removeEmptySuffixName: planner.reserve("suffix_array_remove_empty_suffix"),
    resultName: planner.reserve("suffix_array", "suffix_result"),
    saName: planner.reserve("sa", "suffix_sa"),
    rankName: planner.reserve("rank", "suffix_rank"),
    lcpName: planner.reserve("lcp", "suffix_lcp"),
    lcpRangeQueryName: planner.reserve("suffix_array_lcp"),
    lcpSparseNames: {
      logName: planner.reserve("sparse_log", "suffix_lcp_log"),
      ensureLogName: planner.reserve("ensure_sparse_log", "ensure_suffix_lcp_log"),
      minTableName: planner.reserve("sparse_min", "suffix_lcp_min"),
      buildMinName: planner.reserve("build_sparse_min", "build_suffix_lcp_min"),
      queryMinName: planner.reserve("query_sparse_min", "query_suffix_lcp_min"),
      maxTableName: planner.reserve("sparse_max", "suffix_lcp_max"),
      buildMaxName: planner.reserve("build_sparse_max", "build_suffix_lcp_max"),
      queryMaxName: planner.reserve("query_sparse_max", "query_suffix_lcp_max"),
      gcdTableName: planner.reserve("sparse_gcd", "suffix_lcp_gcd"),
      buildGcdName: planner.reserve("build_sparse_gcd", "build_suffix_lcp_gcd"),
      queryGcdName: planner.reserve("query_sparse_gcd", "query_suffix_lcp_gcd"),
      bitAndTableName: planner.reserve("sparse_bit_and", "suffix_lcp_bit_and"),
      buildBitAndName: planner.reserve("build_sparse_bit_and", "build_suffix_lcp_bit_and"),
      queryBitAndName: planner.reserve("query_sparse_bit_and", "query_suffix_lcp_bit_and"),
      bitOrTableName: planner.reserve("sparse_bit_or", "suffix_lcp_bit_or"),
      buildBitOrName: planner.reserve("build_sparse_bit_or", "build_suffix_lcp_bit_or"),
      queryBitOrName: planner.reserve("query_sparse_bit_or", "query_suffix_lcp_bit_or"),
      customTableName: planner.reserve("sparse_custom", "suffix_lcp_custom"),
      buildCustomName: planner.reserve("build_sparse_custom", "build_suffix_lcp_custom"),
      queryCustomName: planner.reserve("query_sparse_custom", "query_suffix_lcp_custom"),
      customCombineName: planner.reserve("sparse_combine", "suffix_lcp_combine")
    }
  };
}

function suffixArrayFeatureSet(
  features: SuffixArrayFeature[]
): Set<SuffixArrayFeature> {
  const result = new Set(features);
  if (result.has("lcp_rmq")) {
    result.add("rank");
    result.add("lcp");
  }
  return result;
}

function suffixArrayBuildCall(options: SuffixArrayOptions): string {
  if (options.inputKind === "ints") {
    return `${options.names.buildIntsName}(${options.sourceName})`;
  }
  if (options.inputKind === "positive_codes") {
    return `${options.names.buildPositiveCodesName}(${options.sourceName})`;
  }
  return `${options.names.buildStringName}(${options.sourceName})`;
}

function suffixArrayExports(
  options: SuffixArrayOptions,
  features: Set<SuffixArrayFeature>
): string[] {
  const exports = [
    options.names.resultStructName,
    options.names.buildPositiveCodesName
  ];
  if (options.inputKind === "string") {
    exports.push(options.names.buildStringName);
  }
  if (options.inputKind === "ints") {
    exports.push(options.names.buildIntsName);
  }
  if (features.has("stripped_sa")) {
    exports.push(options.names.removeEmptySuffixName);
  }
  if (features.has("lcp_rmq")) {
    exports.push(options.names.lcpRangeQueryName);
  }
  return exports;
}

function renderSuffixArrayUsage(
  options: SuffixArrayOptions,
  features: Set<SuffixArrayFeature>
): string {
  return renderCodeTemplate("suffix_array/usage-comment.cpp.tmpl", {
    resultName: options.names.resultName,
    buildCall: suffixArrayBuildCall(options),
    strippedFeature: features.has("stripped_sa"),
    saName: options.names.saName,
    removeEmptySuffixName: options.names.removeEmptySuffixName,
    rankFeature: features.has("rank"),
    rankName: options.names.rankName,
    lcpFeature: features.has("lcp"),
    lcpName: options.names.lcpName,
    lcpRmqFeature: features.has("lcp_rmq"),
    buildLcpMinName: options.names.lcpSparseNames.buildMinName,
    lcpRangeQueryName: options.names.lcpRangeQueryName
  });
}

function renderSuffixArrayHelpers(
  options: SuffixArrayOptions,
  features: Set<SuffixArrayFeature>
): string {
  const names = options.names;
  let helpers = renderCodeTemplate("suffix_array/helpers.hpp.tmpl", {
    lcpFeature: features.has("lcp"),
    rankFeature: features.has("rank"),
    needsRank: features.has("rank") || features.has("lcp"),
    stringInput: options.inputKind === "string",
    intsInput: options.inputKind === "ints",
    strippedFeature: features.has("stripped_sa"),
    lcpRmqFeature: features.has("lcp_rmq")
  });
  helpers = applyIdentifierRenames(helpers, [
    { from: "SuffixArrayResult", to: names.resultStructName },
    { from: "suffix_array_build_from_positive_codes", to: names.buildPositiveCodesName },
    { from: "suffix_array_build", to: names.buildStringName },
    { from: "suffix_array_build_from_ints", to: names.buildIntsName },
    { from: "suffix_array_remove_empty_suffix", to: names.removeEmptySuffixName },
    { from: "suffix_array_lcp", to: names.lcpRangeQueryName },
    { from: "query_sparse_min", to: names.lcpSparseNames.queryMinName }
  ]);
  if (options.includeUsageComment) {
    helpers = helpers.trimEnd() + "\n\n" + renderSuffixArrayUsage(options, features) + "\n";
  }
  return helpers;
}

export function renderSuffixArrayRecipe(
  options: SuffixArrayOptions
): RenderedRecipe {
  const features = suffixArrayFeatureSet(options.features);
  const suffixRecipe = createRenderedRecipe(
    { helpers: [renderSuffixArrayHelpers(options, features)] },
    suffixArrayExports(options, features)
  );
  if (!features.has("lcp_rmq")) {
    return suffixRecipe;
  }

  const sparseRecipe = renderSparseTableRecipe({
    valueType: "int",
    sourceName: `${options.names.resultName}.lcp`,
    variants: ["min"],
    names: options.names.lcpSparseNames,
    includeUsageComment: false
  });
  return mergeRenderedRecipes([sparseRecipe, suffixRecipe]);
}

export function renderSuffixArray(options: SuffixArrayOptions): string {
  return composeRecipeSections(renderSuffixArrayRecipe(options));
}

export function defaultFftNttTransforms(): FftNttTransform[] {
  return ["fft"];
}

export function planFftNttNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): FftNttNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    nextPowerName: planner.reserve("fft_next_power_of_two"),
    isPowerName: planner.reserve("fft_is_power_of_two"),
    bitReverseName: planner.reserve("fft_bit_reverse"),
    fftTransformName: planner.reserve("fft_transform"),
    convolutionFftName: planner.reserve("convolution_fft_round"),
    nttPowName: planner.reserve("ntt_pow"),
    nttTransformName: planner.reserve("ntt_transform"),
    convolutionNttName: planner.reserve("convolution_ntt_int")
  };
}

function fftNttTransformSet(
  transforms: FftNttTransform[]
): Set<FftNttTransform> {
  return new Set(transforms);
}

function fftNttExports(
  options: FftNttOptions,
  transforms: Set<FftNttTransform>
): string[] {
  const exports: string[] = [];
  const add = (name: string) => {
    if (!exports.includes(name)) {
      exports.push(name);
    }
  };

  if (options.includeConvolution) {
    add(options.names.nextPowerName);
  }
  add(options.names.isPowerName);
  add(options.names.bitReverseName);
  if (transforms.has("fft")) {
    add(options.names.fftTransformName);
    if (options.includeConvolution) {
      add(options.names.convolutionFftName);
    }
  }
  if (transforms.has("ntt")) {
    add(options.names.nttPowName);
    add(options.names.nttTransformName);
    if (options.includeConvolution) {
      add(options.names.convolutionNttName);
    }
  }
  return exports;
}

function renderFftNttUsage(
  options: FftNttOptions,
  transforms: Set<FftNttTransform>
): string {
  return renderCodeTemplate("fft_ntt/usage-comment.cpp.tmpl", {
    includeFft: transforms.has("fft"),
    includeNtt: transforms.has("ntt"),
    includeConvolution: options.includeConvolution,
    fftTransformName: options.names.fftTransformName,
    convolutionFftName: options.names.convolutionFftName,
    nttTransformName: options.names.nttTransformName,
    convolutionNttName: options.names.convolutionNttName
  });
}

export function renderFftNttRecipe(options: FftNttOptions): RenderedRecipe {
  const transforms = fftNttTransformSet(options.transforms);
  const names = options.names;
  let helpers = renderCodeTemplate("fft_ntt/helpers.hpp.tmpl", {
    includeFft: transforms.has("fft"),
    includeNtt: transforms.has("ntt"),
    includeConvolution: options.includeConvolution,
    modulusExpression: options.modulusExpression,
    primitiveRootExpression: options.primitiveRootExpression
  });
  helpers = applyIdentifierRenames(helpers, [
    { from: "fft_next_power_of_two", to: names.nextPowerName },
    { from: "fft_is_power_of_two", to: names.isPowerName },
    { from: "fft_bit_reverse", to: names.bitReverseName },
    { from: "fft_transform", to: names.fftTransformName },
    { from: "convolution_fft_round", to: names.convolutionFftName },
    { from: "ntt_pow", to: names.nttPowName },
    { from: "ntt_transform", to: names.nttTransformName },
    { from: "convolution_ntt_int", to: names.convolutionNttName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderFftNttUsage(options, transforms)}\n`;
  }
  return createRenderedRecipe(
    { helpers: [helpers] },
    fftNttExports(options, transforms)
  );
}

export function renderFftNtt(options: FftNttOptions): string {
  return composeRecipeSections(renderFftNttRecipe(options));
}

export function defaultPolyHashFeatures(): PolyHashFeature[] {
  return ["substring_equal", "concat"];
}

export function planPolyHashNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): PolyHashNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    mod1Name: planner.reserve("POLY_HASH_MOD1", "PH_MOD1"),
    mod2Name: planner.reserve("POLY_HASH_MOD2", "PH_MOD2"),
    baseName: planner.reserve("POLY_HASH_BASE", "PH_BASE"),
    valueStructName: planner.reserve("PolyHashValue"),
    className: planner.reserve("PolyHash"),
    hashStringName: planner.reserve("poly_hash_string"),
    hashVectorName: planner.reserve("poly_hash_values"),
    equalFunctionName: planner.reserve("poly_hash_equal_substrings")
  };
}

export function defaultPolyHashOptions(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): PolyHashOptions {
  return {
    inputKind: "string",
    sourceName: analysis.stringSymbols[0]?.name ?? "s",
    mod1Expression: "1000000007",
    mod2Expression: "1000000009",
    baseExpression: "911382323",
    features: defaultPolyHashFeatures(),
    names: planPolyHashNames(analysis, extraReserved),
    includeUsageComment: true
  };
}

function polyHashFeatureSet(features: PolyHashFeature[]): Set<PolyHashFeature> {
  return new Set(features);
}

function polyHashExports(
  options: PolyHashOptions,
  features: Set<PolyHashFeature>
): string[] {
  const exports = [
    options.names.mod1Name,
    options.names.mod2Name,
    options.names.baseName,
    options.names.valueStructName,
    options.names.className
  ];
  exports.push(
    options.inputKind === "vector_int"
      ? options.names.hashVectorName
      : options.names.hashStringName
  );
  if (features.has("substring_equal")) {
    exports.push(options.names.equalFunctionName);
  }
  return exports;
}

function renderPolyHashUsage(
  options: PolyHashOptions,
  features: Set<PolyHashFeature>
): string {
  return renderCodeTemplate("poly_hash/usage-comment.cpp.tmpl", {
    className: options.names.className,
    sourceName: options.sourceName,
    equalFeature: features.has("substring_equal"),
    concatFeature: features.has("concat"),
    reverseFeature: features.has("reverse"),
    lcpFeature: features.has("lcp")
  });
}

export function renderPolyHashRecipe(options: PolyHashOptions): RenderedRecipe {
  const features = polyHashFeatureSet(options.features);
  const names = options.names;
  const constants = renderCodeTemplate("poly_hash/constants.hpp.tmpl", {
    mod1Name: names.mod1Name,
    mod1Expression: options.mod1Expression,
    mod2Name: names.mod2Name,
    mod2Expression: options.mod2Expression,
    baseName: names.baseName,
    baseExpression: options.baseExpression
  });
  let helpers = renderCodeTemplate("poly_hash/helpers.hpp.tmpl", {
    vectorInput: options.inputKind === "vector_int",
    equalFeature: features.has("substring_equal"),
    concatFeature: features.has("concat"),
    reverseFeature: features.has("reverse"),
    lcpFeature: features.has("lcp")
  });
  helpers = applyIdentifierRenames(helpers, [
    { from: "POLY_HASH_MOD1", to: names.mod1Name },
    { from: "POLY_HASH_MOD2", to: names.mod2Name },
    { from: "POLY_HASH_BASE", to: names.baseName },
    { from: "PolyHashValue", to: names.valueStructName },
    { from: "PolyHash", to: names.className },
    { from: "poly_hash_string", to: names.hashStringName },
    { from: "poly_hash_vector", to: names.hashVectorName },
    { from: "poly_hash_equal_substrings", to: names.equalFunctionName }
  ]);
  if (options.includeUsageComment) {
    helpers = helpers.trimEnd() + "\n\n" + renderPolyHashUsage(options, features);
  }
  return createRenderedRecipe(
    { constants: [constants], helpers: [helpers] },
    polyHashExports(options, features)
  );
}

export function renderPolyHash(options: PolyHashOptions): string {
  return composeRecipeSections(renderPolyHashRecipe(options));
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
  return renderCodeTemplate("berlekamp_massey/usage-comment.cpp.tmpl", {
    valueType: options.valueType,
    sequenceName: options.sequenceName,
    indexName: options.indexName,
    berlekampMasseyName: options.names.berlekampMasseyName,
    linearRecurrenceKthName: options.names.linearRecurrenceKthName,
    berlekampMasseyKthName: options.names.berlekampMasseyKthName,
    minimalRecurrence: features.has("minimal_recurrence"),
    kthTerm: features.has("kth_term"),
    standaloneKthTerm: features.has("kth_term") && !features.has("minimal_recurrence"),
    oneShotKth: features.has("one_shot_kth")
  });
}

export function renderBerlekampMasseyRecipe(
  options: BerlekampMasseyOptions
): RenderedRecipe {
  const features = berlekampMasseyFeatureSet(options.features);
  let helpers = renderCodeTemplate("berlekamp_massey/helpers.hpp.tmpl", {
    minimalRecurrence: features.has("minimal_recurrence"),
    kthTerm: features.has("kth_term"),
    oneShotKth: features.has("one_shot_kth")
  });
  helpers = applyIdentifierRenames(helpers, [
    { from: "berlekamp_massey", to: options.names.berlekampMasseyName },
    { from: "linear_recurrence_kth", to: options.names.linearRecurrenceKthName },
    { from: "berlekamp_massey_kth", to: options.names.berlekampMasseyKthName }
  ]);
  if (options.includeUsageComment) {
    helpers = `${helpers.trim()}\n\n${renderBerlekampMasseyUsage(options, features)}\n`;
  }
  return createRenderedRecipe(
    { helpers: [helpers] },
    berlekampMasseyExports(options, features)
  );
}

export function renderBerlekampMassey(options: BerlekampMasseyOptions): string {
  return composeRecipeSections(renderBerlekampMasseyRecipe(options));
}

export function stripHeaderGuard(content: string): string {
  const lines = content.split(/\r?\n/);
  let start = 0;
  let guardName: string | undefined;
  const ifndef = lines[0]?.match(
    /^\s*#ifndef\s+(EDULCNI_[A-Z0-9_]+_(?:H|HH|HPP|HXX))\s*$/
  );
  const define = lines[1]?.match(
    /^\s*#define\s+(EDULCNI_[A-Z0-9_]+_(?:H|HH|HPP|HXX))\s*$/
  );
  if (ifndef && define && ifndef[1] === define[1]) {
    guardName = ifndef[1];
    start = 2;
  }

  let end = lines.length;
  while (end > start && lines[end - 1].trim() === "") {
    --end;
  }
  if (
    guardName &&
    end > start &&
    new RegExp(`^\\s*#endif\\b(?:\\s*//.*\\b${guardName}\\b)?\\s*$`).test(lines[end - 1])
  ) {
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

export function renderHeaderContent(content: string, unwrapHeader: boolean): string {
  return unwrapHeader ? unwrapEdulcniNamespace(content) : content;
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
  unwrapHeader: boolean,
  analysis: CppAnalysis,
  exportedNames?: string[]
): RenderedSnippet {
  const rendered = renderHeaderContent(content, unwrapHeader);
  const exports = exportedNames ?? (unwrapHeader ? collectGlobalExportedIdentifiers(rendered) : []);
  const renames = planIdentifierRenames(analysis, exports);
  return {
    content: applyIdentifierRenames(rendered, renames),
    renames,
    exports
  };
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

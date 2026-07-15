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

export interface ReadVectorOptions {
  name: string;
  sizeExpression: string;
  valueType: string;
  containerType: string;
}

export interface DsuNames {
  className: string;
}

export type DsuApplication = "connectivity" | "kruskal" | "query_loop";
export type DsuIndexing = "zero_based" | "one_based_input";
export type DsuUsageMode = "helper_only" | "instance" | "query_loop" | "kruskal";

export interface DsuOptions {
  application?: DsuApplication;
  sizeExpression?: string;
  edgeCountName?: string;
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
export type BfsSourceMode = "existing_graph" | "read_edges";
export type BfsGraphMode = "directed" | "undirected";
export type BfsIndexing = "zero_based" | "one_based_input";
export type BfsUsageMode =
  | "helper_only"
  | "read_graph"
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
  | "path_restore"
  | "weighted_graph_read";
export type DijkstraSourceMode = "existing_graph" | "read_edges";
export type DijkstraGraphMode = "directed" | "undirected";
export type DijkstraIndexing = "zero_based" | "one_based_input";
export type DijkstraUsageMode =
  | "helper_only"
  | "read_graph"
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
    annotatedSymbols: collectAnnotatedSymbols(text),
    constantSymbols: declaredSymbols.constants,
    inputSymbols: declaredSymbols.inputs,
    vectorSymbols: declaredSymbols.vectors,
    stringSymbols: declaredSymbols.strings,
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
  if (!options.usageMode || options.usageMode === "helper_only") {
    return "";
  }

  const n = options.sizeExpression.trim() || "n";
  const source = options.sourceName?.trim();
  const valueType = options.valueType.trim() || "int";
  const instance = sanitizeIdentifier(options.instanceName ?? "seg", "seg");
  const answer = sanitizeIdentifier(options.answerName ?? "ans", "ans");
  const lines: string[] = [];

  if (options.sourceMode === "read_loop" && source) {
    pushLine(lines, `vector<${valueType}> ${source}(${n});`);
    pushLine(lines, `for (int i = 0; i < ${n}; ++i) cin >> ${source}[i];`);
  }

  if (options.application === "max_subarray") {
    if (source) {
      pushLine(lines, `${options.names.maxSubarrayClassName}<${valueType}> ${instance}(${source});`);
    } else {
      pushLine(lines, `${options.names.maxSubarrayClassName}<${valueType}> ${instance}(${n});`);
    }
    if (options.usageMode === "query_loop") {
      pushLine(lines, "int q;");
      pushLine(lines, "cin >> q;");
      pushLine(lines, "while (q--) {");
      pushLine(lines, "  int type, l, r;");
      pushLine(lines, `  ${valueType} x;`);
      pushLine(lines, "  cin >> type >> l >> r;");
      if (options.indexing === "one_based_input") {
        pushLine(lines, "  --l; --r;");
      }
      pushLine(lines, "  if (type == 1) {");
      pushLine(lines, "    cin >> x;");
      pushLine(lines, `    ${instance}.point_set(l, x);`);
      pushLine(lines, "  } else {");
      pushLine(lines, `    auto ${answer} = ${instance}.max_sum(l, r);`);
      pushLine(lines, `    cout << ${answer} << '\\n';`);
      pushLine(lines, "  }");
      pushLine(lines, "}");
    }
    return lines.join("\n");
  }

  if (options.outputMode === "iterative_class") {
    const alias =
      options.aggregate === "min"
        ? options.names.minAliasName
        : options.aggregate === "max"
          ? options.names.maxAliasName
          : options.names.sumAliasName;
    if (source) {
      pushLine(lines, `${alias}<${valueType}> ${instance}(${source});`);
    } else {
      pushLine(lines, `${alias}<${valueType}> ${instance}(${n});`);
    }
    if (options.usageMode === "query_loop") {
      pushLine(lines, "int q;");
      pushLine(lines, "cin >> q;");
      pushLine(lines, "while (q--) {");
      pushLine(lines, "  int type, l, r;");
      pushLine(lines, `  ${valueType} x;`);
      pushLine(lines, "  cin >> type >> l >> r;");
      if (options.indexing === "one_based_input") {
        pushLine(lines, "  --l; --r;");
      }
      pushLine(lines, "  if (type == 1) {");
      pushLine(lines, "    cin >> x;");
      pushLine(lines, `    ${instance}.point_set(l, x);`);
      pushLine(lines, "  } else {");
      pushLine(lines, "    ++r;");
      pushLine(lines, `    auto ${answer} = ${instance}.query(l, r);`);
      pushLine(lines, `    cout << ${answer} << '\\n';`);
      pushLine(lines, "  }");
      pushLine(lines, "}");
    }
    return lines.join("\n");
  }

  pushLine(lines, `${options.names.initName}(${n});`);
  if (source) {
    pushLine(lines, `if (${n} > 0) ${options.names.buildName}(1, 0, ${n} - 1, ${source});`);
  }
  if (options.usageMode === "query_loop") {
    pushLine(lines, "int q;");
    pushLine(lines, "cin >> q;");
    pushLine(lines, "while (q--) {");
    pushLine(lines, "  int type, l, r;");
    pushLine(lines, `  ${valueType} x;`);
    pushLine(lines, "  cin >> type >> l >> r;");
    if (options.indexing === "one_based_input") {
      pushLine(lines, "  --l; --r;");
    }
    pushLine(lines, "  if (type == 1) {");
    pushLine(lines, "    cin >> x;");
    if (hasUpdate(options, "range_add")) {
      pushLine(lines, `    ${options.names.rangeAddName}(1, 0, ${n} - 1, l, r, x);`);
    } else if (hasUpdate(options, "range_assign")) {
      pushLine(lines, `    ${options.names.rangeAssignName}(1, 0, ${n} - 1, l, r, x);`);
    } else if (hasUpdate(options, "point_add")) {
      pushLine(lines, `    ${options.names.pointAddName}(1, 0, ${n} - 1, l, x);`);
    } else {
      pushLine(lines, `    ${options.names.pointSetName}(1, 0, ${n} - 1, l, x);`);
    }
    pushLine(lines, "  } else {");
    pushLine(lines, `    auto ${answer} = ${options.names.queryName}(1, 0, ${n} - 1, l, r);`);
    pushLine(lines, `    cout << ${answer} << '\\n';`);
    pushLine(lines, "  }");
    pushLine(lines, "}");
  }

  return lines.join("\n");
}

function renderMaxSubarraySegmentTree(options: SegmentTreeOptions): string {
  const names = options.names;
  const lines: string[] = [];
  pushLine(lines, "template <typename T>");
  pushLine(lines, `struct ${names.maxSubarrayNodeName} {`);
  pushLine(lines, "  T sum;");
  pushLine(lines, "  T prefix;");
  pushLine(lines, "  T suffix;");
  pushLine(lines, "  T best;");
  pushLine(lines, "  bool valid;");
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(lines, "template <typename T>");
  pushLine(lines, `class ${names.maxSubarrayClassName} {`);
  pushLine(lines, " public:");
  pushLine(lines, `  using Node = ${names.maxSubarrayNodeName}<T>;`);
  pushLine(lines);
  pushLine(lines, `  explicit ${names.maxSubarrayClassName}(int n = 0) : n_(n < 0 ? 0 : n) { init_storage(); }`);
  pushLine(lines);
  pushLine(lines, `  explicit ${names.maxSubarrayClassName}(const std::vector<T>& values) : n_(0) { build(values); }`);
  pushLine(lines);
  pushLine(lines, "  void reset(int n) {");
  pushLine(lines, "    n_ = n < 0 ? 0 : n;");
  pushLine(lines, "    init_storage();");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void build(const std::vector<T>& values) {");
  pushLine(lines, "    n_ = static_cast<int>(values.size());");
  pushLine(lines, "    init_storage();");
  pushLine(lines, "    if (n_ > 0) build_rec(1, 0, n_ - 1, values);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int size() const { return n_; }");
  pushLine(lines);
  pushLine(lines, "  void point_set(int idx, const T& value) {");
  pushLine(lines, "    if (idx < 0 || idx >= n_) return;");
  pushLine(lines, "    point_set_rec(1, 0, n_ - 1, idx, value);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  Node get(int left, int right) const {");
  pushLine(lines, "    if (!normalize_range(left, right)) return neutral_node();");
  pushLine(lines, "    return get_rec(1, 0, n_ - 1, left, right);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  T max_sum(int left, int right) const { return get(left, right).best; }");
  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  int n_;");
  pushLine(lines, "  std::vector<Node> tree_;");
  pushLine(lines);
  pushLine(lines, "  static Node neutral_node() { return Node{T(0), T(0), T(0), T(0), false}; }");
  pushLine(lines);
  pushLine(lines, "  static Node make_leaf(const T& value) {");
  pushLine(lines, "    return Node{value, value, value, value, true};");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  static Node combine(const Node& lhs, const Node& rhs) {");
  pushLine(lines, "    if (!lhs.valid) return rhs;");
  pushLine(lines, "    if (!rhs.valid) return lhs;");
  pushLine(lines, "    Node result;");
  pushLine(lines, "    result.valid = true;");
  pushLine(lines, "    result.sum = lhs.sum + rhs.sum;");
  pushLine(lines, "    result.prefix = std::max(lhs.prefix, lhs.sum + rhs.prefix);");
  pushLine(lines, "    result.suffix = std::max(rhs.suffix, rhs.sum + lhs.suffix);");
  pushLine(lines, "    result.best = std::max(std::max(lhs.best, rhs.best), lhs.suffix + rhs.prefix);");
  pushLine(lines, "    return result;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void init_storage() { tree_.assign(4 * std::max(1, n_), neutral_node()); }");
  pushLine(lines);
  pushLine(lines, "  bool normalize_range(int& left, int& right) const {");
  pushLine(lines, "    if (n_ == 0 || left > right || right < 0 || left >= n_) return false;");
  pushLine(lines, "    if (left < 0) left = 0;");
  pushLine(lines, "    if (right >= n_) right = n_ - 1;");
  pushLine(lines, "    return left <= right;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void build_rec(int v, int tl, int tr, const std::vector<T>& values) {");
  pushLine(lines, "    if (tl == tr) {");
  pushLine(lines, "      tree_[v] = make_leaf(values[tl]);");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, "    int tm = (tl + tr) / 2;");
  pushLine(lines, "    build_rec(v * 2, tl, tm, values);");
  pushLine(lines, "    build_rec(v * 2 + 1, tm + 1, tr, values);");
  pushLine(lines, "    tree_[v] = combine(tree_[v * 2], tree_[v * 2 + 1]);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void point_set_rec(int v, int tl, int tr, int idx, const T& value) {");
  pushLine(lines, "    if (tl == tr) {");
  pushLine(lines, "      tree_[v] = make_leaf(value);");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, "    int tm = (tl + tr) / 2;");
  pushLine(lines, "    if (idx <= tm) point_set_rec(v * 2, tl, tm, idx, value);");
  pushLine(lines, "    else point_set_rec(v * 2 + 1, tm + 1, tr, idx, value);");
  pushLine(lines, "    tree_[v] = combine(tree_[v * 2], tree_[v * 2 + 1]);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  Node get_rec(int v, int tl, int tr, int l, int r) const {");
  pushLine(lines, "    if (tl > r || l > tr) return neutral_node();");
  pushLine(lines, "    if (l <= tl && tr <= r) return tree_[v];");
  pushLine(lines, "    int tm = (tl + tr) / 2;");
  pushLine(lines, "    return combine(get_rec(v * 2, tl, tm, l, r),");
  pushLine(lines, "                   get_rec(v * 2 + 1, tm + 1, tr, l, r));");
  pushLine(lines, "  }");
  pushLine(lines, "};");
  return `${lines.join("\n")}\n`;
}

function renderIterativeSegmentTree(options: SegmentTreeOptions): string {
  const names = options.names;
  const lines: string[] = [];
  const includePointAdd = hasUpdate(options, "point_add");

  pushLine(lines, "template <typename T>");
  pushLine(lines, `struct ${names.sumOpName} {`);
  pushLine(lines, "  static T neutral() { return T(0); }");
  pushLine(lines, "  static T combine(const T& a, const T& b) { return a + b; }");
  pushLine(lines, "};");
  pushLine(lines);

  pushLine(lines, "template <typename T>");
  pushLine(lines, `struct ${names.minOpName} {`);
  pushLine(lines, "  static T neutral() { return std::numeric_limits<T>::max(); }");
  pushLine(lines, "  static T combine(const T& a, const T& b) { return a < b ? a : b; }");
  pushLine(lines, "};");
  pushLine(lines);

  pushLine(lines, "template <typename T>");
  pushLine(lines, `struct ${names.maxOpName} {`);
  pushLine(lines, "  static T neutral() { return std::numeric_limits<T>::lowest(); }");
  pushLine(lines, "  static T combine(const T& a, const T& b) { return a < b ? b : a; }");
  pushLine(lines, "};");
  pushLine(lines);

  pushLine(lines, "template <typename T, typename Op>");
  pushLine(lines, `class ${names.className} {`);
  pushLine(lines, " public:");
  pushLine(lines, `  explicit ${names.className}(int n = 0) { reset(n); }`);
  pushLine(lines);
  pushLine(lines, `  explicit ${names.className}(const std::vector<T>& values) {`);
  pushLine(lines, "    build(values);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void reset(int n) {");
  pushLine(lines, "    n_ = n < 0 ? 0 : n;");
  pushLine(lines, "    tree_.assign(2 * std::max(1, n_), Op::neutral());");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void build(const std::vector<T>& values) {");
  pushLine(lines, "    n_ = static_cast<int>(values.size());");
  pushLine(lines, "    tree_.assign(2 * std::max(1, n_), Op::neutral());");
  pushLine(lines, "    for (int i = 0; i < n_; ++i) {");
  pushLine(lines, "      tree_[n_ + i] = values[i];");
  pushLine(lines, "    }");
  pushLine(lines, "    for (int i = n_ - 1; i > 0; --i) {");
  pushLine(lines, "      tree_[i] = Op::combine(tree_[i << 1], tree_[i << 1 | 1]);");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int size() const { return n_; }");
  pushLine(lines);
  pushLine(lines, "  void point_set(int pos, const T& value) {");
  pushLine(lines, "    if (pos < 0 || pos >= n_) {");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, "    pos += n_;");
  pushLine(lines, "    tree_[pos] = value;");
  pushLine(lines, "    for (pos >>= 1; pos > 0; pos >>= 1) {");
  pushLine(lines, "      tree_[pos] = Op::combine(tree_[pos << 1], tree_[pos << 1 | 1]);");
  pushLine(lines, "    }");
  pushLine(lines, "  }");

  if (includePointAdd) {
    pushLine(lines);
    pushLine(lines, "  void point_add(int pos, const T& delta) {");
    pushLine(lines, "    if (pos < 0 || pos >= n_) {");
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(lines, "    pos += n_;");
    pushLine(lines, "    tree_[pos] += delta;");
    pushLine(lines, "    for (pos >>= 1; pos > 0; pos >>= 1) {");
    pushLine(lines, "      tree_[pos] = Op::combine(tree_[pos << 1], tree_[pos << 1 | 1]);");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
  }

  pushLine(lines);
  pushLine(lines, "  T query(int left, int right) const {");
  pushLine(lines, "    if (left < 0) {");
  pushLine(lines, "      left = 0;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (right > n_) {");
  pushLine(lines, "      right = n_;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (left >= right || n_ == 0) {");
  pushLine(lines, "      return Op::neutral();");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    T lhs = Op::neutral();");
  pushLine(lines, "    T rhs = Op::neutral();");
  pushLine(lines, "    for (left += n_, right += n_; left < right; left >>= 1, right >>= 1) {");
  pushLine(lines, "      if (left & 1) {");
  pushLine(lines, "        lhs = Op::combine(lhs, tree_[left++]);");
  pushLine(lines, "      }");
  pushLine(lines, "      if (right & 1) {");
  pushLine(lines, "        rhs = Op::combine(tree_[--right], rhs);");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "    return Op::combine(lhs, rhs);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  int n_;");
  pushLine(lines, "  std::vector<T> tree_;");
  pushLine(lines, "};");
  pushLine(lines);

  pushLine(lines, "template <typename T>");
  pushLine(lines, `using ${names.sumAliasName} = ${names.className}<T, ${names.sumOpName}<T>>;`);
  pushLine(lines);
  pushLine(lines, "template <typename T>");
  pushLine(lines, `using ${names.minAliasName} = ${names.className}<T, ${names.minOpName}<T>>;`);
  pushLine(lines);
  pushLine(lines, "template <typename T>");
  pushLine(lines, `using ${names.maxAliasName} = ${names.className}<T, ${names.maxOpName}<T>>;`);

  return `${lines.join("\n")}\n`;
}

export function renderSegmentTree(options: SegmentTreeOptions): string {
  if (options.application === "max_subarray") {
    return renderMaxSubarraySegmentTree(options);
  }
  if (options.outputMode === "iterative_class") {
    return renderIterativeSegmentTree(options);
  }

  const names = options.names;
  const valueType = valueStorageType(options);
  const hasRangeAdd = hasUpdate(options, "range_add");
  const hasRangeAssign = hasUpdate(options, "range_assign");
  const hasLazy = hasRangeAdd || hasRangeAssign;
  const hasFirstLeq = hasDescend(options, "first_leq") && canRenderFirstLeq(options);
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

  if (hasFirstLeq) {
    pushLine(lines);
    pushLine(lines, `int ${names.firstLeqName}(int v, int tl, int tr, int l, int r, ${options.valueType} target) {`);
    pushLine(lines, `  if (tl > r || tr < l || ${names.storageName}[v] > target) return -1;`);
    pushLine(lines, `  if (tl == tr) return tl;`);
    if (hasLazy) {
      pushLine(lines, `  ${names.pushName}(v, tl, tr);`);
    }
    pushLine(lines, `  int tm = (tl + tr) / 2;`);
    pushLine(lines, `  int left = ${names.firstLeqName}(v * 2, tl, tm, l, r, target);`);
    pushLine(lines, `  return left != -1 ? left : ${names.firstLeqName}(v * 2 + 1, tm + 1, tr, l, r, target);`);
    pushLine(lines, `}`);
  }

  return `${lines.join("\n")}\n`;
}

export function defaultSegmentTreeBeatsUpdates(): SegmentTreeBeatsUpdate[] {
  return ["chmin", "chmax", "add"];
}

export function defaultSegmentTreeBeatsQueries(): SegmentTreeBeatsQuery[] {
  return ["sum", "min", "max"];
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
  return new Set(queries.length === 0 ? defaultSegmentTreeBeatsQueries() : queries);
}

function segmentTreeBeatsExports(options: SegmentTreeBeatsOptions): string[] {
  return [options.names.className];
}

function renderSegmentTreeBeatsUsage(
  options: SegmentTreeBeatsOptions,
  updates: Set<SegmentTreeBeatsUpdate>,
  queries: Set<SegmentTreeBeatsQuery>
): string {
  const names = options.names;
  const lines = ["/*", "Inclusive [l, r] ranges:"];
  lines.push(`std::vector<${options.valueType}> values(n);`);
  lines.push(`${names.className}<${options.valueType}> seg(values);`);
  if (updates.has("chmin")) {
    lines.push(`seg.${names.chminName}(l, r, x);`);
  }
  if (updates.has("chmax")) {
    lines.push(`seg.${names.chmaxName}(l, r, x);`);
  }
  if (updates.has("add")) {
    lines.push(`seg.${names.addName}(l, r, delta);`);
  }
  if (queries.has("sum")) {
    lines.push(`auto total = seg.${names.querySumName}(l, r);`);
  }
  if (queries.has("min")) {
    lines.push(`auto mn = seg.${names.queryMinName}(l, r);`);
  }
  if (queries.has("max")) {
    lines.push(`auto mx = seg.${names.queryMaxName}(l, r);`);
  }
  lines.push("*/");
  return lines.join("\n");
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
  if (usageMode === "helper_only") {
    return "";
  }

  const names = options.names;
  const source = options.sourceName?.trim() || "a";
  const n = options.sizeExpression?.trim() || "n";
  const instance = sanitizeIdentifier(options.instanceName ?? "seg", "seg");
  const answer = sanitizeIdentifier(options.answerName ?? "ans", "ans");
  const lines: string[] = [];

  if (options.sourceMode === "read_loop") {
    pushLine(lines, `vector<${options.valueType}> ${source}(${n});`);
    pushLine(lines, `for (int i = 0; i < ${n}; ++i) cin >> ${source}[i];`);
  }
  if (options.sourceMode === "existing_vector" || options.sourceMode === "read_loop") {
    pushLine(lines, `${names.className}<${options.valueType}> ${instance}(${source});`);
  } else {
    pushLine(lines, `${names.className}<${options.valueType}> ${instance}(${n});`);
  }

  if (usageMode !== "query_loop") {
    return lines.join("\n");
  }

  const query = firstSegmentTreeBeatsQuery(queries);
  pushLine(lines, "int q;");
  pushLine(lines, "cin >> q;");
  pushLine(lines, "while (q--) {");
  pushLine(lines, "  int type, l, r;");
  pushLine(lines, `  ${options.valueType} x;`);
  pushLine(lines, "  cin >> type >> l >> r;");
  if (options.indexing === "one_based_input") {
    pushLine(lines, "  --l; --r;");
  }
  let openedBranch = false;
  const pushUpdateBranch = (
    condition: string,
    methodName: string,
    readValue = true
  ) => {
    pushLine(lines, openedBranch ? `  } else if (${condition}) {` : `  if (${condition}) {`);
    openedBranch = true;
    if (readValue) {
      pushLine(lines, "    cin >> x;");
    }
    pushLine(lines, `    ${instance}.${methodName}(l, r, x);`);
  };
  if (updates.has("add")) {
    pushUpdateBranch("type == 1", names.addName);
  }
  if (updates.has("chmin")) {
    pushUpdateBranch(updates.has("add") ? "type == 2" : "type == 1", names.chminName);
  }
  if (updates.has("chmax")) {
    const typeNumber = updates.has("add") && updates.has("chmin") ? 3 : updates.has("add") || updates.has("chmin") ? 2 : 1;
    pushUpdateBranch(`type == ${typeNumber}`, names.chmaxName);
  }
  pushLine(lines, openedBranch ? "  } else {" : "  {");
  if (query === "sum") {
    pushLine(lines, `    auto ${answer} = ${instance}.${names.querySumName}(l, r);`);
  } else if (query === "min") {
    pushLine(lines, `    auto ${answer} = ${instance}.${names.queryMinName}(l, r);`);
  } else {
    pushLine(lines, `    auto ${answer} = ${instance}.${names.queryMaxName}(l, r);`);
  }
  pushLine(lines, `    cout << ${answer} << '\\n';`);
  pushLine(lines, "  }");
  pushLine(lines, "}");
  return lines.join("\n");
}

export function renderSegmentTreeBeatsRecipe(
  options: SegmentTreeBeatsOptions
): RenderedRecipe {
  const names = options.names;
  const updates = segmentTreeBeatsUpdateSet(options.updates);
  const queries = segmentTreeBeatsQuerySet(options.queries);
  const hasAdd = updates.has("add");
  const hasChmin = updates.has("chmin");
  const hasChmax = updates.has("chmax");
  const hasUpdates = hasAdd || hasChmin || hasChmax;
  const hasQuerySum = queries.has("sum");
  const hasQueryMin = queries.has("min");
  const hasQueryMax = queries.has("max");
  const addRecName = `${names.addName}_rec`;
  const chminRecName = `${names.chminName}_rec`;
  const chmaxRecName = `${names.chmaxName}_rec`;
  const sumRecName = `${names.querySumName}_rec`;
  const minRecName = `${names.queryMinName}_rec`;
  const maxRecName = `${names.queryMaxName}_rec`;
  const applyAddName = `apply_${names.addName}`;
  const applyChminName = `apply_${names.chminName}`;
  const applyChmaxName = `apply_${names.chmaxName}`;
  const lines: string[] = [];

  pushLine(lines, "template <typename T>");
  pushLine(lines, `class ${names.className} {`);
  pushLine(lines, " public:");
  pushLine(lines, `  explicit ${names.className}(int n = 0) { reset(n); }`);
  pushLine(lines);
  pushLine(lines, `  explicit ${names.className}(const std::vector<T>& values) { build(values); }`);
  pushLine(lines);
  pushLine(lines, "  void reset(int n) {");
  pushLine(lines, "    n_ = n < 0 ? 0 : n;");
  pushLine(lines, "    tree_.assign(4 * std::max(1, n_), empty_node());");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void build(const std::vector<T>& values) {");
  pushLine(lines, "    reset(static_cast<int>(values.size()));");
  pushLine(lines, "    if (n_ > 0) {");
  pushLine(lines, "      build_rec(1, 0, n_ - 1, values);");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int size() const { return n_; }");

  if (hasChmin) {
    pushLine(lines);
    pushLine(lines, `  void ${names.chminName}(int left, int right, const T& x) {`);
    pushLine(lines, "    if (norm(left, right)) {");
    pushLine(lines, `      ${chminRecName}(1, 0, n_ - 1, left, right, x);`);
    pushLine(lines, "    }");
    pushLine(lines, "  }");
  }

  if (hasChmax) {
    pushLine(lines);
    pushLine(lines, `  void ${names.chmaxName}(int left, int right, const T& x) {`);
    pushLine(lines, "    if (norm(left, right)) {");
    pushLine(lines, `      ${chmaxRecName}(1, 0, n_ - 1, left, right, x);`);
    pushLine(lines, "    }");
    pushLine(lines, "  }");
  }

  if (hasAdd) {
    pushLine(lines);
    pushLine(lines, `  void ${names.addName}(int left, int right, const T& x) {`);
    pushLine(lines, "    if (norm(left, right)) {");
    pushLine(lines, `      ${addRecName}(1, 0, n_ - 1, left, right, x);`);
    pushLine(lines, "    }");
    pushLine(lines, "  }");
  }

  if (hasQuerySum) {
    pushLine(lines);
    pushLine(lines, `  T ${names.querySumName}(int left, int right) {`);
    pushLine(lines, "    if (!norm(left, right)) {");
    pushLine(lines, "      return T(0);");
    pushLine(lines, "    }");
    pushLine(lines, `    return ${sumRecName}(1, 0, n_ - 1, left, right);`);
    pushLine(lines, "  }");
  }

  if (hasQueryMin) {
    pushLine(lines);
    pushLine(lines, `  T ${names.queryMinName}(int left, int right) {`);
    pushLine(lines, "    if (!norm(left, right)) {");
    pushLine(lines, "      return pos_inf();");
    pushLine(lines, "    }");
    pushLine(lines, `    return ${minRecName}(1, 0, n_ - 1, left, right);`);
    pushLine(lines, "  }");
  }

  if (hasQueryMax) {
    pushLine(lines);
    pushLine(lines, `  T ${names.queryMaxName}(int left, int right) {`);
    pushLine(lines, "    if (!norm(left, right)) {");
    pushLine(lines, "      return neg_inf();");
    pushLine(lines, "    }");
    pushLine(lines, `    return ${maxRecName}(1, 0, n_ - 1, left, right);`);
    pushLine(lines, "  }");
  }

  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, `  struct ${names.nodeName} {`);
  pushLine(lines, "    T sum;");
  pushLine(lines, "    T max_v;");
  pushLine(lines, "    T smax_v;");
  pushLine(lines, "    int max_count;");
  pushLine(lines, "    T min_v;");
  pushLine(lines, "    T smin_v;");
  pushLine(lines, "    int min_count;");
  pushLine(lines, "    T add;");
  pushLine(lines, "  };");
  pushLine(lines);
  pushLine(lines, "  int n_;");
  pushLine(lines, `  std::vector<${names.nodeName}> tree_;`);
  pushLine(lines);
  pushLine(lines, "  static T pos_inf() { return std::numeric_limits<T>::max() / T(4); }");
  pushLine(lines, "  static T neg_inf() { return std::numeric_limits<T>::lowest() / T(4); }");
  pushLine(lines);
  pushLine(lines, `  static ${names.nodeName} empty_node() {`);
  pushLine(lines, "    return {T(0), neg_inf(), neg_inf(), 0, pos_inf(), pos_inf(), 0, T(0)};");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  static ${names.nodeName} make_leaf(const T& value) {`);
  pushLine(lines, "    return {value, value, neg_inf(), 1, value, pos_inf(), 1, T(0)};");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  static bool empty(const ${names.nodeName}& node) { return node.max_count == 0; }`);
  pushLine(lines);
  pushLine(lines, "  bool norm(int& left, int& right) const {");
  pushLine(lines, "    if (n_ == 0 || left > right || right < 0 || left >= n_) {");
  pushLine(lines, "      return false;");
  pushLine(lines, "    }");
  pushLine(lines, "    left = std::max(left, 0);");
  pushLine(lines, "    right = std::min(right, n_ - 1);");
  pushLine(lines, "    return left <= right;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  static ${names.nodeName} merge_node(const ${names.nodeName}& a, const ${names.nodeName}& b) {`
  );
  pushLine(lines, "    if (empty(a)) {");
  pushLine(lines, "      return b;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (empty(b)) {");
  pushLine(lines, "      return a;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, `    ${names.nodeName} res;`);
  pushLine(lines, "    res.sum = a.sum + b.sum;");
  pushLine(lines, "    res.add = T(0);");
  pushLine(lines);
  pushLine(lines, "    if (a.max_v == b.max_v) {");
  pushLine(lines, "      res.max_v = a.max_v;");
  pushLine(lines, "      res.max_count = a.max_count + b.max_count;");
  pushLine(lines, "      res.smax_v = std::max(a.smax_v, b.smax_v);");
  pushLine(lines, "    } else if (a.max_v > b.max_v) {");
  pushLine(lines, "      res.max_v = a.max_v;");
  pushLine(lines, "      res.max_count = a.max_count;");
  pushLine(lines, "      res.smax_v = std::max(a.smax_v, b.max_v);");
  pushLine(lines, "    } else {");
  pushLine(lines, "      res.max_v = b.max_v;");
  pushLine(lines, "      res.max_count = b.max_count;");
  pushLine(lines, "      res.smax_v = std::max(a.max_v, b.smax_v);");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    if (a.min_v == b.min_v) {");
  pushLine(lines, "      res.min_v = a.min_v;");
  pushLine(lines, "      res.min_count = a.min_count + b.min_count;");
  pushLine(lines, "      res.smin_v = std::min(a.smin_v, b.smin_v);");
  pushLine(lines, "    } else if (a.min_v < b.min_v) {");
  pushLine(lines, "      res.min_v = a.min_v;");
  pushLine(lines, "      res.min_count = a.min_count;");
  pushLine(lines, "      res.smin_v = std::min(a.smin_v, b.min_v);");
  pushLine(lines, "    } else {");
  pushLine(lines, "      res.min_v = b.min_v;");
  pushLine(lines, "      res.min_count = b.min_count;");
  pushLine(lines, "      res.smin_v = std::min(a.min_v, b.smin_v);");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    return res;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void build_rec(int v, int tl, int tr, const std::vector<T>& values) {");
  pushLine(lines, "    if (tl == tr) {");
  pushLine(lines, "      tree_[v] = make_leaf(values[tl]);");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, "    const int tm = (tl + tr) / 2;");
  pushLine(lines, "    build_rec(v * 2, tl, tm, values);");
  pushLine(lines, "    build_rec(v * 2 + 1, tm + 1, tr, values);");
  pushLine(lines, "    pull(v);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void pull(int v) { tree_[v] = merge_node(tree_[v * 2], tree_[v * 2 + 1]); }");

  if (hasAdd) {
    pushLine(lines);
    pushLine(lines, `  void ${applyAddName}(int v, int tl, int tr, const T& x) {`);
    pushLine(lines, `    ${names.nodeName}& node = tree_[v];`);
    pushLine(lines, "    node.sum += x * static_cast<T>(tr - tl + 1);");
    pushLine(lines, "    node.max_v += x;");
    pushLine(lines, "    if (node.smax_v != neg_inf()) {");
    pushLine(lines, "      node.smax_v += x;");
    pushLine(lines, "    }");
    pushLine(lines, "    node.min_v += x;");
    pushLine(lines, "    if (node.smin_v != pos_inf()) {");
    pushLine(lines, "      node.smin_v += x;");
    pushLine(lines, "    }");
    pushLine(lines, "    node.add += x;");
    pushLine(lines, "  }");
  }

  if (hasChmin) {
    pushLine(lines);
    pushLine(lines, `  void ${applyChminName}(int v, const T& x) {`);
    pushLine(lines, `    ${names.nodeName}& node = tree_[v];`);
    pushLine(lines, "    if (node.max_v <= x) {");
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(lines, "    node.sum += (x - node.max_v) * static_cast<T>(node.max_count);");
    pushLine(lines, "    if (node.max_v == node.min_v) {");
    pushLine(lines, "      node.max_v = node.min_v = x;");
    pushLine(lines, "    } else if (node.max_v == node.smin_v) {");
    pushLine(lines, "      node.max_v = node.smin_v = x;");
    pushLine(lines, "    } else {");
    pushLine(lines, "      node.max_v = x;");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
  }

  if (hasChmax) {
    pushLine(lines);
    pushLine(lines, `  void ${applyChmaxName}(int v, const T& x) {`);
    pushLine(lines, `    ${names.nodeName}& node = tree_[v];`);
    pushLine(lines, "    if (node.min_v >= x) {");
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(lines, "    node.sum += (x - node.min_v) * static_cast<T>(node.min_count);");
    pushLine(lines, "    if (node.max_v == node.min_v) {");
    pushLine(lines, "      node.max_v = node.min_v = x;");
    pushLine(lines, "    } else if (node.smax_v == node.min_v) {");
    pushLine(lines, "      node.min_v = node.smax_v = x;");
    pushLine(lines, "    } else {");
    pushLine(lines, "      node.min_v = x;");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
  }

  if (hasUpdates) {
    pushLine(lines);
    pushLine(lines, "  void push(int v, int tl, int tr) {");
    pushLine(lines, "    if (tl == tr) {");
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(lines, "    const int tm = (tl + tr) / 2;");
    if (hasAdd) {
      pushLine(lines, "    if (tree_[v].add != T(0)) {");
      pushLine(lines, `      ${applyAddName}(v * 2, tl, tm, tree_[v].add);`);
      pushLine(lines, `      ${applyAddName}(v * 2 + 1, tm + 1, tr, tree_[v].add);`);
      pushLine(lines, "      tree_[v].add = T(0);");
      pushLine(lines, "    }");
    }
    if (hasChmin) {
      pushLine(lines, "    if (tree_[v * 2].max_v > tree_[v].max_v) {");
      pushLine(lines, `      ${applyChminName}(v * 2, tree_[v].max_v);`);
      pushLine(lines, "    }");
      pushLine(lines, "    if (tree_[v * 2 + 1].max_v > tree_[v].max_v) {");
      pushLine(lines, `      ${applyChminName}(v * 2 + 1, tree_[v].max_v);`);
      pushLine(lines, "    }");
    }
    if (hasChmax) {
      pushLine(lines, "    if (tree_[v * 2].min_v < tree_[v].min_v) {");
      pushLine(lines, `      ${applyChmaxName}(v * 2, tree_[v].min_v);`);
      pushLine(lines, "    }");
      pushLine(lines, "    if (tree_[v * 2 + 1].min_v < tree_[v].min_v) {");
      pushLine(lines, `      ${applyChmaxName}(v * 2 + 1, tree_[v].min_v);`);
      pushLine(lines, "    }");
    }
    pushLine(lines, "  }");
  }

  if (hasAdd) {
    pushLine(lines);
    pushLine(lines, `  void ${addRecName}(int v, int tl, int tr, int l, int r, const T& x) {`);
    pushLine(lines, "    if (tl > r || tr < l) {");
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(lines, "    if (l <= tl && tr <= r) {");
    pushLine(lines, `      ${applyAddName}(v, tl, tr, x);`);
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(lines, "    push(v, tl, tr);");
    pushLine(lines, "    const int tm = (tl + tr) / 2;");
    pushLine(lines, `    ${addRecName}(v * 2, tl, tm, l, r, x);`);
    pushLine(lines, `    ${addRecName}(v * 2 + 1, tm + 1, tr, l, r, x);`);
    pushLine(lines, "    pull(v);");
    pushLine(lines, "  }");
  }

  if (hasChmin) {
    pushLine(lines);
    pushLine(lines, `  void ${chminRecName}(int v, int tl, int tr, int l, int r, const T& x) {`);
    pushLine(lines, "    if (tl > r || tr < l || tree_[v].max_v <= x) {");
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(lines, "    if (l <= tl && tr <= r && tree_[v].smax_v < x) {");
    pushLine(lines, `      ${applyChminName}(v, x);`);
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(lines, "    push(v, tl, tr);");
    pushLine(lines, "    const int tm = (tl + tr) / 2;");
    pushLine(lines, `    ${chminRecName}(v * 2, tl, tm, l, r, x);`);
    pushLine(lines, `    ${chminRecName}(v * 2 + 1, tm + 1, tr, l, r, x);`);
    pushLine(lines, "    pull(v);");
    pushLine(lines, "  }");
  }

  if (hasChmax) {
    pushLine(lines);
    pushLine(lines, `  void ${chmaxRecName}(int v, int tl, int tr, int l, int r, const T& x) {`);
    pushLine(lines, "    if (tl > r || tr < l || tree_[v].min_v >= x) {");
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(lines, "    if (l <= tl && tr <= r && tree_[v].smin_v > x) {");
    pushLine(lines, `      ${applyChmaxName}(v, x);`);
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(lines, "    push(v, tl, tr);");
    pushLine(lines, "    const int tm = (tl + tr) / 2;");
    pushLine(lines, `    ${chmaxRecName}(v * 2, tl, tm, l, r, x);`);
    pushLine(lines, `    ${chmaxRecName}(v * 2 + 1, tm + 1, tr, l, r, x);`);
    pushLine(lines, "    pull(v);");
    pushLine(lines, "  }");
  }

  if (hasQuerySum) {
    pushLine(lines);
    pushLine(lines, `  T ${sumRecName}(int v, int tl, int tr, int l, int r) {`);
    pushLine(lines, "    if (tl > r || tr < l) {");
    pushLine(lines, "      return T(0);");
    pushLine(lines, "    }");
    pushLine(lines, "    if (l <= tl && tr <= r) {");
    pushLine(lines, "      return tree_[v].sum;");
    pushLine(lines, "    }");
    if (hasUpdates) {
      pushLine(lines, "    push(v, tl, tr);");
    }
    pushLine(lines, "    const int tm = (tl + tr) / 2;");
    pushLine(lines, `    return ${sumRecName}(v * 2, tl, tm, l, r) +`);
    pushLine(lines, `           ${sumRecName}(v * 2 + 1, tm + 1, tr, l, r);`);
    pushLine(lines, "  }");
  }

  if (hasQueryMin) {
    pushLine(lines);
    pushLine(lines, `  T ${minRecName}(int v, int tl, int tr, int l, int r) {`);
    pushLine(lines, "    if (tl > r || tr < l) {");
    pushLine(lines, "      return pos_inf();");
    pushLine(lines, "    }");
    pushLine(lines, "    if (l <= tl && tr <= r) {");
    pushLine(lines, "      return tree_[v].min_v;");
    pushLine(lines, "    }");
    if (hasUpdates) {
      pushLine(lines, "    push(v, tl, tr);");
    }
    pushLine(lines, "    const int tm = (tl + tr) / 2;");
    pushLine(lines, `    return std::min(${minRecName}(v * 2, tl, tm, l, r),`);
    pushLine(lines, `                    ${minRecName}(v * 2 + 1, tm + 1, tr, l, r));`);
    pushLine(lines, "  }");
  }

  if (hasQueryMax) {
    pushLine(lines);
    pushLine(lines, `  T ${maxRecName}(int v, int tl, int tr, int l, int r) {`);
    pushLine(lines, "    if (tl > r || tr < l) {");
    pushLine(lines, "      return neg_inf();");
    pushLine(lines, "    }");
    pushLine(lines, "    if (l <= tl && tr <= r) {");
    pushLine(lines, "      return tree_[v].max_v;");
    pushLine(lines, "    }");
    if (hasUpdates) {
      pushLine(lines, "    push(v, tl, tr);");
    }
    pushLine(lines, "    const int tm = (tl + tr) / 2;");
    pushLine(lines, `    return std::max(${maxRecName}(v * 2, tl, tm, l, r),`);
    pushLine(lines, `                    ${maxRecName}(v * 2 + 1, tm + 1, tr, l, r));`);
    pushLine(lines, "  }");
  }

  pushLine(lines, "};");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderSegmentTreeBeatsUsage(options, updates, queries));
  }

  const usage = renderSegmentTreeBeatsUsageSnippet(options, updates, queries);
  return createRenderedRecipe(
    usage === ""
      ? { helpers: [lines.join("\n")] }
      : { helpers: [lines.join("\n")], solve: [usage] },
    segmentTreeBeatsExports(options)
  );
}

export function renderSegmentTreeBeats(options: SegmentTreeBeatsOptions): string {
  return composeRecipeSections(renderSegmentTreeBeatsRecipe(options));
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

export function planDsuNames(
  analysis: CppAnalysis,
  extraReserved: string[] = []
): DsuNames {
  const planner = createNamePlanner(analysis, extraReserved);
  return {
    className: planner.reserve("Dsu")
  };
}

function renderDsuUsage(options: DsuOptions): string {
  const instance = options.instanceName ?? "dsu";
  const n = options.sizeExpression ?? "n";
  return [
    "/*",
    "Example:",
    `${options.names.className} ${instance}(${n});`,
    `${instance}.unite(u, v);`,
    `if (${instance}.same(u, v)) {`,
    "}",
    "*/"
  ].join("\n");
}

function renderDsuUsageSnippet(options: DsuOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }

  const className = options.names.className;
  const n = options.sizeExpression?.trim() || "n";
  const m = options.edgeCountName?.trim() || "m";
  const instance = sanitizeIdentifier(options.instanceName ?? "dsu", "dsu");
  const answer = sanitizeIdentifier(options.answerName ?? "ans", "ans");
  const lines: string[] = [];

  pushLine(lines, `${className} ${instance}(${n});`);
  if (usageMode === "instance") {
    return lines.join("\n");
  }

  if (usageMode === "kruskal") {
    pushLine(lines, "struct Edge { int u, v; long long w; };");
    pushLine(lines, `vector<Edge> edges(${m});`);
    pushLine(lines, `for (auto& e : edges) cin >> e.u >> e.v >> e.w;`);
    if (options.indexing === "one_based_input") {
      pushLine(lines, "for (auto& e : edges) { --e.u; --e.v; }");
    }
    pushLine(lines, "sort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b) {");
    pushLine(lines, "  return a.w < b.w;");
    pushLine(lines, "});");
    pushLine(lines, "long long mst_weight = 0;");
    pushLine(lines, "for (const auto& e : edges) {");
    pushLine(lines, `  if (${instance}.unite(e.u, e.v)) mst_weight += e.w;`);
    pushLine(lines, "}");
    return lines.join("\n");
  }

  pushLine(lines, "int q;");
  pushLine(lines, "cin >> q;");
  pushLine(lines, "while (q--) {");
  pushLine(lines, "  int type, u, v;");
  pushLine(lines, "  cin >> type >> u;");
  pushLine(lines, "  if (type == 3) {");
  if (options.indexing === "one_based_input") {
    pushLine(lines, "    --u;");
  }
  pushLine(lines, `    cout << ${instance}.component_size(u) << '\\n';`);
  pushLine(lines, "    continue;");
  pushLine(lines, "  }");
  pushLine(lines, "  cin >> v;");
  if (options.indexing === "one_based_input") {
    pushLine(lines, "  --u; --v;");
  }
  pushLine(lines, "  if (type == 1) {");
  pushLine(lines, `    ${instance}.unite(u, v);`);
  pushLine(lines, "  } else {");
  pushLine(lines, `    bool ${answer} = ${instance}.same(u, v);`);
  pushLine(lines, `    cout << ${answer} << '\\n';`);
  pushLine(lines, "  }");
  pushLine(lines, "}");
  return lines.join("\n");
}

export function renderDsuRecipe(options: DsuOptions): RenderedRecipe {
  const className = options.names.className;
  const lines: string[] = [];

  pushLine(lines, `class ${className} {`);
  pushLine(lines, " public:");
  pushLine(lines, `  explicit ${className}(int n = 0) { reset(n); }`);
  pushLine(lines);
  pushLine(lines, "  void reset(int n) {");
  pushLine(lines, "    n_ = (n < 0 ? 0 : n);");
  pushLine(lines, "    components_ = n_;");
  pushLine(lines, "    parent_.resize(n_);");
  pushLine(lines, "    size_.assign(n_, 1);");
  pushLine(lines, "    for (int i = 0; i < n_; ++i) {");
  pushLine(lines, "      parent_[i] = i;");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int size() const { return n_; }");
  pushLine(lines);
  pushLine(lines, "  int components() const { return components_; }");
  pushLine(lines);
  pushLine(lines, "  int find(int v) {");
  pushLine(lines, "    if (v < 0 || v >= n_) {");
  pushLine(lines, "      return -1;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (parent_[v] == v) {");
  pushLine(lines, "      return v;");
  pushLine(lines, "    }");
  pushLine(lines, "    parent_[v] = find(parent_[v]);");
  pushLine(lines, "    return parent_[v];");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  bool unite(int a, int b) {");
  pushLine(lines, "    int root_a = find(a);");
  pushLine(lines, "    int root_b = find(b);");
  pushLine(lines, "    if (root_a == -1 || root_b == -1 || root_a == root_b) {");
  pushLine(lines, "      return false;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    if (size_[root_a] > size_[root_b]) {");
  pushLine(lines, "      std::swap(root_a, root_b);");
  pushLine(lines, "    }");
  pushLine(lines, "    parent_[root_a] = root_b;");
  pushLine(lines, "    size_[root_b] += size_[root_a];");
  pushLine(lines, "    --components_;");
  pushLine(lines, "    return true;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  bool same(int a, int b) { return find(a) == find(b) && find(a) != -1; }");
  pushLine(lines);
  pushLine(lines, "  int component_size(int v) {");
  pushLine(lines, "    const int root = find(v);");
  pushLine(lines, "    if (root == -1) {");
  pushLine(lines, "      return 0;");
  pushLine(lines, "    }");
  pushLine(lines, "    return size_[root];");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  const std::vector<int>& parents() const { return parent_; }");
  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  int n_;");
  pushLine(lines, "  int components_;");
  pushLine(lines, "  std::vector<int> parent_;");
  pushLine(lines, "  std::vector<int> size_;");
  pushLine(lines, "};");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderDsuUsage(options));
  }

  const usage = renderDsuUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
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
  const className = options.names.className;
  const instance = options.instanceName ?? "dsu";
  const n = options.sizeExpression ?? "n";
  return [
    "/*",
    "Example:",
    `${className} ${instance}(${n});`,
    `int snap = ${instance}.snapshot();`,
    `${instance}.unite(u, v);`,
    `${instance}.rollback(snap);`,
    "*/"
  ].join("\n");
}

function renderRollbackDsuUsageSnippet(options: RollbackDsuOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }

  const className = options.names.className;
  const n = options.sizeExpression?.trim() || "n";
  const instance = sanitizeIdentifier(options.instanceName ?? "dsu", "dsu");
  const answer = sanitizeIdentifier(options.answerName ?? "ans", "ans");
  const lines: string[] = [];
  pushLine(lines, `${className} ${instance}(${n});`);
  if (usageMode === "instance") {
    pushLine(lines, `int snap = ${instance}.snapshot();`);
    return lines.join("\n");
  }

  pushLine(lines, "vector<int> snapshots;");
  pushLine(lines, "int q;");
  pushLine(lines, "cin >> q;");
  pushLine(lines, "while (q--) {");
  pushLine(lines, "  int type;");
  pushLine(lines, "  cin >> type;");
  pushLine(lines, "  if (type == 1) {");
  pushLine(lines, "    int u, v;");
  pushLine(lines, "    cin >> u >> v;");
  if (options.indexing === "one_based_input") {
    pushLine(lines, "    --u; --v;");
  }
  pushLine(lines, `    ${instance}.unite(u, v);`);
  pushLine(lines, "  } else if (type == 2) {");
  pushLine(lines, `    snapshots.push_back(${instance}.snapshot());`);
  pushLine(lines, "  } else if (type == 3) {");
  pushLine(lines, `    if (!snapshots.empty()) { ${instance}.rollback(snapshots.back()); snapshots.pop_back(); }`);
  pushLine(lines, "  } else {");
  pushLine(lines, "    int u, v;");
  pushLine(lines, "    cin >> u >> v;");
  if (options.indexing === "one_based_input") {
    pushLine(lines, "    --u; --v;");
  }
  pushLine(lines, `    bool ${answer} = ${instance}.same(u, v);`);
  pushLine(lines, `    cout << ${answer} << '\\n';`);
  pushLine(lines, "  }");
  pushLine(lines, "}");
  return lines.join("\n");
}

export function renderRollbackDsuRecipe(
  options: RollbackDsuOptions
): RenderedRecipe {
  const className = options.names.className;
  const lines: string[] = [];

  pushLine(lines, `class ${className} {`);
  pushLine(lines, " public:");
  pushLine(lines, `  explicit ${className}(int n = 0) { reset(n); }`);
  pushLine(lines);
  pushLine(lines, "  void reset(int n) {");
  pushLine(lines, "    n_ = (n < 0 ? 0 : n);");
  pushLine(lines, "    components_ = n_;");
  pushLine(lines, "    parent_.resize(n_);");
  pushLine(lines, "    size_.assign(n_, 1);");
  pushLine(lines, "    history_.clear();");
  pushLine(lines, "    for (int i = 0; i < n_; ++i) {");
  pushLine(lines, "      parent_[i] = i;");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int size() const { return n_; }");
  pushLine(lines);
  pushLine(lines, "  int components() const { return components_; }");
  pushLine(lines);
  pushLine(lines, "  int find(int v) const {");
  pushLine(lines, "    if (v < 0 || v >= n_) {");
  pushLine(lines, "      return -1;");
  pushLine(lines, "    }");
  pushLine(lines, "    while (parent_[v] != v) {");
  pushLine(lines, "      v = parent_[v];");
  pushLine(lines, "    }");
  pushLine(lines, "    return v;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  bool same(int a, int b) const {");
  pushLine(lines, "    const int root_a = find(a);");
  pushLine(lines, "    const int root_b = find(b);");
  pushLine(lines, "    return root_a != -1 && root_a == root_b;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int component_size(int v) const {");
  pushLine(lines, "    const int root = find(v);");
  pushLine(lines, "    return root == -1 ? 0 : size_[root];");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int snapshot() const { return static_cast<int>(history_.size()); }");
  pushLine(lines);
  pushLine(lines, "  bool unite(int a, int b) {");
  pushLine(lines, "    int root_a = find(a);");
  pushLine(lines, "    int root_b = find(b);");
  pushLine(lines, "    if (root_a == -1 || root_b == -1 || root_a == root_b) {");
  pushLine(lines, "      history_.push_back(Change{-1, -1, -1});");
  pushLine(lines, "      return false;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (size_[root_a] > size_[root_b]) {");
  pushLine(lines, "      std::swap(root_a, root_b);");
  pushLine(lines, "    }");
  pushLine(lines, "    history_.push_back(Change{root_a, root_b, size_[root_b]});");
  pushLine(lines, "    parent_[root_a] = root_b;");
  pushLine(lines, "    size_[root_b] += size_[root_a];");
  pushLine(lines, "    --components_;");
  pushLine(lines, "    return true;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void rollback() {");
  pushLine(lines, "    if (history_.empty()) {");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, "    undo_one();");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void rollback(int snapshot_id) {");
  pushLine(lines, "    if (snapshot_id < 0) {");
  pushLine(lines, "      snapshot_id = 0;");
  pushLine(lines, "    }");
  pushLine(lines, "    while (static_cast<int>(history_.size()) > snapshot_id) {");
  pushLine(lines, "      undo_one();");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  struct Change {");
  pushLine(lines, "    int child;");
  pushLine(lines, "    int parent;");
  pushLine(lines, "    int parent_size;");
  pushLine(lines, "  };");
  pushLine(lines);
  pushLine(lines, "  int n_;");
  pushLine(lines, "  int components_;");
  pushLine(lines, "  std::vector<int> parent_;");
  pushLine(lines, "  std::vector<int> size_;");
  pushLine(lines, "  std::vector<Change> history_;");
  pushLine(lines);
  pushLine(lines, "  void undo_one() {");
  pushLine(lines, "    const Change change = history_.back();");
  pushLine(lines, "    history_.pop_back();");
  pushLine(lines, "    if (change.child == -1) {");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, "    parent_[change.child] = change.child;");
  pushLine(lines, "    size_[change.parent] = change.parent_size;");
  pushLine(lines, "    ++components_;");
  pushLine(lines, "  }");
  pushLine(lines, "};");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderRollbackDsuUsage(options));
  }

  const usage = renderRollbackDsuUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
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
  const className = options.names.className;
  const instance = options.instanceName ?? "lca";
  const n = options.sizeExpression ?? "n";
  const root = options.rootExpression ?? "root";
  return [
    "/*",
    "Example:",
    `${className} ${instance}(${n});`,
    `${instance}.add_edge(u, v);`,
    `${instance}.build(${root});`,
    `int c = ${instance}.lca(a, b);`,
    `int d = ${instance}.dist(a, b);`,
    `int p = ${instance}.kth_ancestor(v, k);`,
    "*/"
  ].join("\n");
}

function renderLcaUsageSnippet(options: LcaOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }

  const className = options.names.className;
  const n = options.sizeExpression?.trim() || "n";
  const root = options.rootExpression?.trim() || "0";
  const instance = sanitizeIdentifier(options.instanceName ?? "lca", "lca");
  const answer = sanitizeIdentifier(options.answerName ?? "ans", "ans");
  const lines: string[] = [];
  pushLine(lines, `${className} ${instance}(${n});`);

  if (usageMode === "instance") {
    pushLine(lines, `${instance}.build(${root});`);
    return lines.join("\n");
  }

  if (options.sourceMode === "read_tree" || usageMode === "read_tree" || usageMode === "query_loop") {
    pushLine(lines, `for (int i = 0; i + 1 < ${n}; ++i) {`);
    pushLine(lines, "  int u, v;");
    pushLine(lines, "  cin >> u >> v;");
    if (options.indexing === "one_based_input") {
      pushLine(lines, "  --u; --v;");
    }
    pushLine(lines, `  ${instance}.add_edge(u, v);`);
    pushLine(lines, "}");
  }
  pushLine(lines, `${instance}.build(${root});`);

  if (usageMode !== "query_loop") {
    return lines.join("\n");
  }

  pushLine(lines, "int q;");
  pushLine(lines, "cin >> q;");
  pushLine(lines, "while (q--) {");
  pushLine(lines, "  int type, a, b;");
  pushLine(lines, "  cin >> type >> a >> b;");
  if (options.indexing === "one_based_input") {
    pushLine(lines, "  --a;");
    pushLine(lines, "  if (type != 3) --b;");
  }
  pushLine(lines, "  if (type == 1) {");
  pushLine(lines, `    int ${answer} = ${instance}.lca(a, b);`);
  pushLine(lines, `    cout << ${answer} << '\\n';`);
  pushLine(lines, "  } else if (type == 2) {");
  pushLine(lines, `    int ${answer} = ${instance}.dist(a, b);`);
  pushLine(lines, `    cout << ${answer} << '\\n';`);
  pushLine(lines, "  } else {");
  pushLine(lines, `    int ${answer} = ${instance}.kth_ancestor(a, b);`);
  pushLine(lines, `    cout << ${answer} << '\\n';`);
  pushLine(lines, "  }");
  pushLine(lines, "}");
  return lines.join("\n");
}

export function renderLcaRecipe(options: LcaOptions): RenderedRecipe {
  const className = options.names.className;
  const lines: string[] = [];

  pushLine(lines, `class ${className} {`);
  pushLine(lines, " public:");
  pushLine(lines, `  explicit ${className}(int n = 0) { reset(n); }`);
  pushLine(lines);
  pushLine(lines, "  void reset(int n) {");
  pushLine(lines, "    n_ = (n < 0 ? 0 : n);");
  pushLine(lines, "    max_log_ = 1;");
  pushLine(lines, "    while ((1 << max_log_) <= std::max(1, n_)) {");
  pushLine(lines, "      ++max_log_;");
  pushLine(lines, "    }");
  pushLine(lines, "    graph_.assign(n_, std::vector<int>());");
  pushLine(lines, "    depth_.assign(n_, 0);");
  pushLine(lines, "    parent_.assign(n_, -1);");
  pushLine(lines, "    component_.assign(n_, -1);");
  pushLine(lines, "    up_.assign(max_log_, std::vector<int>(n_, -1));");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int size() const { return n_; }");
  pushLine(lines);
  pushLine(lines, "  void add_edge(int a, int b, bool undirected = true) {");
  pushLine(lines, "    if (!ok(a) || !ok(b)) {");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, "    graph_[a].push_back(b);");
  pushLine(lines, "    if (undirected && a != b) {");
  pushLine(lines, "      graph_[b].push_back(a);");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void build(int root = 0) {");
  pushLine(lines, "    if (n_ == 0) {");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, "    std::fill(depth_.begin(), depth_.end(), 0);");
  pushLine(lines, "    std::fill(parent_.begin(), parent_.end(), -1);");
  pushLine(lines, "    std::fill(component_.begin(), component_.end(), -1);");
  pushLine(lines, "    for (int bit = 0; bit < max_log_; ++bit) {");
  pushLine(lines, "      std::fill(up_[bit].begin(), up_[bit].end(), -1);");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    int comp = 0;");
  pushLine(lines, "    if (ok(root)) {");
  pushLine(lines, "      dfs(root, -1, comp++);");
  pushLine(lines, "    }");
  pushLine(lines, "    for (int v = 0; v < n_; ++v) {");
  pushLine(lines, "      if (component_[v] == -1) {");
  pushLine(lines, "        dfs(v, -1, comp++);");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "    for (int bit = 1; bit < max_log_; ++bit) {");
  pushLine(lines, "      for (int v = 0; v < n_; ++v) {");
  pushLine(lines, "        const int mid = up_[bit - 1][v];");
  pushLine(lines, "        up_[bit][v] = (mid == -1 ? -1 : up_[bit - 1][mid]);");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int parent(int v) const { return ok(v) ? parent_[v] : -1; }");
  pushLine(lines);
  pushLine(lines, "  int depth(int v) const { return ok(v) ? depth_[v] : -1; }");
  pushLine(lines);
  pushLine(lines, "  int component(int v) const { return ok(v) ? component_[v] : -1; }");
  pushLine(lines);
  pushLine(lines, "  int kth_ancestor(int v, int k) const {");
  pushLine(lines, "    if (!ok(v) || k < 0) {");
  pushLine(lines, "      return -1;");
  pushLine(lines, "    }");
  pushLine(lines, "    for (int bit = 0; k > 0 && v != -1; ++bit, k >>= 1) {");
  pushLine(lines, "      if (k & 1) {");
  pushLine(lines, "        if (bit >= max_log_) {");
  pushLine(lines, "          return -1;");
  pushLine(lines, "        }");
  pushLine(lines, "        v = up_[bit][v];");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "    return v;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int lca(int a, int b) const {");
  pushLine(lines, "    if (!ok(a) || !ok(b) || component_[a] != component_[b]) {");
  pushLine(lines, "      return -1;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (depth_[a] < depth_[b]) {");
  pushLine(lines, "      std::swap(a, b);");
  pushLine(lines, "    }");
  pushLine(lines, "    a = kth_ancestor(a, depth_[a] - depth_[b]);");
  pushLine(lines, "    if (a == b) {");
  pushLine(lines, "      return a;");
  pushLine(lines, "    }");
  pushLine(lines, "    for (int bit = max_log_ - 1; bit >= 0; --bit) {");
  pushLine(lines, "      if (up_[bit][a] != up_[bit][b]) {");
  pushLine(lines, "        a = up_[bit][a];");
  pushLine(lines, "        b = up_[bit][b];");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "    return parent_[a];");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int dist(int a, int b) const {");
  pushLine(lines, "    const int c = lca(a, b);");
  pushLine(lines, "    return c == -1 ? -1 : depth_[a] + depth_[b] - 2 * depth_[c];");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  int n_;");
  pushLine(lines, "  int max_log_;");
  pushLine(lines, "  std::vector<std::vector<int>> graph_;");
  pushLine(lines, "  std::vector<int> depth_;");
  pushLine(lines, "  std::vector<int> parent_;");
  pushLine(lines, "  std::vector<int> component_;");
  pushLine(lines, "  std::vector<std::vector<int>> up_;");
  pushLine(lines);
  pushLine(lines, "  bool ok(int v) const { return v >= 0 && v < n_; }");
  pushLine(lines);
  pushLine(lines, "  void dfs(int root, int root_parent, int comp) {");
  pushLine(lines, "    std::vector<int> stack(1, root);");
  pushLine(lines, "    parent_[root] = root_parent;");
  pushLine(lines, "    component_[root] = comp;");
  pushLine(lines, "    up_[0][root] = root_parent;");
  pushLine(lines);
  pushLine(lines, "    while (!stack.empty()) {");
  pushLine(lines, "      const int v = stack.back();");
  pushLine(lines, "      stack.pop_back();");
  pushLine(lines, "      for (int to : graph_[v]) {");
  pushLine(lines, "        if (to == parent_[v] || component_[to] != -1) {");
  pushLine(lines, "          continue;");
  pushLine(lines, "        }");
  pushLine(lines, "        parent_[to] = v;");
  pushLine(lines, "        component_[to] = comp;");
  pushLine(lines, "        depth_[to] = depth_[v] + 1;");
  pushLine(lines, "        up_[0][to] = v;");
  pushLine(lines, "        stack.push_back(to);");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines, "};");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderLcaUsage(options));
  }

  const usage = renderLcaUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
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
  const className = options.names.className;
  const instance = options.instanceName ?? "hld";
  const n = options.sizeExpression ?? "n";
  const root = options.rootExpression ?? "root";
  return [
    "/*",
    "Example:",
    `${className} ${instance}(${n});`,
    `${instance}.add_edge(u, v);`,
    `${instance}.build(${root});`,
    `for (auto [l, r] : ${instance}.path_segments(a, b, true)) {`,
    "}",
    `auto subtree = ${instance}.subtree_segment(v);`,
    `int c = ${instance}.lca(a, b);`,
    "*/"
  ].join("\n");
}

function renderHldUsageSnippet(options: HldOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }

  const className = options.names.className;
  const n = options.sizeExpression?.trim() || "n";
  const root = options.rootExpression?.trim() || "0";
  const instance = sanitizeIdentifier(options.instanceName ?? "hld", "hld");
  const answer = sanitizeIdentifier(options.answerName ?? "ans", "ans");
  const includeLca = options.valueMode === "edge_values" ? "false" : "true";
  const lines: string[] = [];

  pushLine(lines, `${className} ${instance}(${n});`);
  if (usageMode === "instance") {
    pushLine(lines, `${instance}.build(${root});`);
    return lines.join("\n");
  }

  if (options.sourceMode === "read_tree" || usageMode === "read_tree" || usageMode === "query_loop") {
    pushLine(lines, `for (int i = 0; i + 1 < ${n}; ++i) {`);
    pushLine(lines, "  int u, v;");
    pushLine(lines, "  cin >> u >> v;");
    if (options.indexing === "one_based_input") {
      pushLine(lines, "  --u; --v;");
    }
    pushLine(lines, `  ${instance}.add_edge(u, v);`);
    pushLine(lines, "}");
  }
  pushLine(lines, `${instance}.build(${root});`);

  if (usageMode !== "query_loop") {
    return lines.join("\n");
  }

  pushLine(lines, "int q;");
  pushLine(lines, "cin >> q;");
  pushLine(lines, "while (q--) {");
  pushLine(lines, "  int type;");
  pushLine(lines, "  cin >> type;");
  pushLine(lines, "  if (type == 1) {");
  pushLine(lines, "    int u, v;");
  pushLine(lines, "    cin >> u >> v;");
  if (options.indexing === "one_based_input") {
    pushLine(lines, "    --u; --v;");
  }
  pushLine(lines, `    long long ${answer} = 0;`);
  pushLine(lines, `    for (auto [l, r] : ${instance}.path_segments(u, v, ${includeLca})) {`);
  pushLine(lines, "      // combine flattened range [l, r]");
  pushLine(lines, "    }");
  pushLine(lines, `    cout << ${answer} << '\\n';`);
  pushLine(lines, "  } else if (type == 2) {");
  pushLine(lines, "    int v;");
  pushLine(lines, "    cin >> v;");
  if (options.indexing === "one_based_input") {
    pushLine(lines, "    --v;");
  }
  pushLine(lines, `    auto seg = ${instance}.subtree_segment(v);`);
  pushLine(lines, "    // query flattened subtree range [seg.first, seg.second]");
  pushLine(lines, "  } else {");
  pushLine(lines, "    int u, v;");
  pushLine(lines, "    cin >> u >> v;");
  if (options.indexing === "one_based_input") {
    pushLine(lines, "    --u; --v;");
  }
  pushLine(lines, `    int c = ${instance}.lca(u, v);`);
  pushLine(lines, `    int ${answer} = c == -1 ? -1 : ${instance}.depth(u) + ${instance}.depth(v) - 2 * ${instance}.depth(c);`);
  pushLine(lines, `    cout << ${answer} << '\\n';`);
  pushLine(lines, "  }");
  pushLine(lines, "}");
  return lines.join("\n");
}

export function renderHldRecipe(options: HldOptions): RenderedRecipe {
  const className = options.names.className;
  const lines: string[] = [];

  pushLine(lines, `class ${className} {`);
  pushLine(lines, " public:");
  pushLine(lines, `  explicit ${className}(int n = 0) : n_(0), root_(0), timer_(0) {`);
  pushLine(lines, "    reset(n);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void reset(int n) {");
  pushLine(lines, "    n_ = (n < 0 ? 0 : n);");
  pushLine(lines, "    root_ = 0;");
  pushLine(lines, "    timer_ = 0;");
  pushLine(lines, "    graph_.assign(n_, std::vector<int>());");
  pushLine(lines, "    parent_.assign(n_, -1);");
  pushLine(lines, "    depth_.assign(n_, 0);");
  pushLine(lines, "    subtree_size_.assign(n_, 0);");
  pushLine(lines, "    heavy_.assign(n_, -1);");
  pushLine(lines, "    head_.assign(n_, 0);");
  pushLine(lines, "    pos_.assign(n_, -1);");
  pushLine(lines, "    order_.assign(n_, -1);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int size() const { return n_; }");
  pushLine(lines);
  pushLine(lines, "  void add_edge(int u, int v, bool undirected = true) {");
  pushLine(lines, "    if (u < 0 || u >= n_ || v < 0 || v >= n_) {");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, "    graph_[u].push_back(v);");
  pushLine(lines, "    if (undirected && u != v) {");
  pushLine(lines, "      graph_[v].push_back(u);");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void build(int root = 0) {");
  pushLine(lines, "    if (n_ == 0) {");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (root < 0 || root >= n_) {");
  pushLine(lines, "      root = 0;");
  pushLine(lines, "    }");
  pushLine(lines, "    root_ = root;");
  pushLine(lines);
  pushLine(lines, "    std::fill(parent_.begin(), parent_.end(), -1);");
  pushLine(lines, "    std::fill(depth_.begin(), depth_.end(), 0);");
  pushLine(lines, "    std::fill(subtree_size_.begin(), subtree_size_.end(), 0);");
  pushLine(lines, "    std::fill(heavy_.begin(), heavy_.end(), -1);");
  pushLine(lines, "    std::fill(head_.begin(), head_.end(), 0);");
  pushLine(lines, "    std::fill(pos_.begin(), pos_.end(), -1);");
  pushLine(lines, "    std::fill(order_.begin(), order_.end(), -1);");
  pushLine(lines);
  pushLine(lines, "    dfs_size(root_, -1);");
  pushLine(lines, "    timer_ = 0;");
  pushLine(lines, "    dfs_decompose(root_, root_);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int root() const { return root_; }");
  pushLine(lines);
  pushLine(lines, "  const std::vector<std::vector<int>>& graph() const { return graph_; }");
  pushLine(lines);
  pushLine(lines, "  int parent(int v) const { return vertex_ok(v) ? parent_[v] : -1; }");
  pushLine(lines);
  pushLine(lines, "  int depth(int v) const { return vertex_ok(v) ? depth_[v] : -1; }");
  pushLine(lines);
  pushLine(lines, "  int heavy_child(int v) const { return vertex_ok(v) ? heavy_[v] : -1; }");
  pushLine(lines);
  pushLine(lines, "  int head(int v) const { return vertex_ok(v) ? head_[v] : -1; }");
  pushLine(lines);
  pushLine(lines, "  int position(int v) const { return vertex_ok(v) ? pos_[v] : -1; }");
  pushLine(lines);
  pushLine(lines, "  int vertex_at(int pos) const {");
  pushLine(lines, "    if (pos < 0 || pos >= n_) {");
  pushLine(lines, "      return -1;");
  pushLine(lines, "    }");
  pushLine(lines, "    return order_[pos];");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int subtree_size(int v) const { return vertex_ok(v) ? subtree_size_[v] : 0; }");
  pushLine(lines);
  pushLine(lines, "  std::pair<int, int> subtree_segment(int v) const {");
  pushLine(lines, "    if (!vertex_ok(v) || pos_[v] == -1) {");
  pushLine(lines, "      return std::make_pair(-1, -2);");
  pushLine(lines, "    }");
  pushLine(lines, "    return std::make_pair(pos_[v], pos_[v] + subtree_size_[v] - 1);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int lca(int a, int b) const {");
  pushLine(lines, "    if (!vertex_ok(a) || !vertex_ok(b) || pos_[a] == -1 || pos_[b] == -1) {");
  pushLine(lines, "      return -1;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    int u = a;");
  pushLine(lines, "    int v = b;");
  pushLine(lines, "    while (head_[u] != head_[v]) {");
  pushLine(lines, "      if (depth_[head_[u]] > depth_[head_[v]]) {");
  pushLine(lines, "        u = parent_[head_[u]];");
  pushLine(lines, "      } else {");
  pushLine(lines, "        v = parent_[head_[v]];");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "    return (depth_[u] < depth_[v] ? u : v);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  std::vector<std::pair<int, int>> path_segments(int a, int b,");
  pushLine(lines, "                                                  bool include_lca = true) const {");
  pushLine(lines, "    if (!vertex_ok(a) || !vertex_ok(b) || pos_[a] == -1 || pos_[b] == -1) {");
  pushLine(lines, "      return {};");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    std::vector<std::pair<int, int>> left_segments;");
  pushLine(lines, "    std::vector<std::pair<int, int>> right_segments;");
  pushLine(lines);
  pushLine(lines, "    int u = a;");
  pushLine(lines, "    int v = b;");
  pushLine(lines, "    while (head_[u] != head_[v]) {");
  pushLine(lines, "      if (depth_[head_[u]] >= depth_[head_[v]]) {");
  pushLine(lines, "        left_segments.push_back(std::make_pair(pos_[head_[u]], pos_[u]));");
  pushLine(lines, "        u = parent_[head_[u]];");
  pushLine(lines, "      } else {");
  pushLine(lines, "        right_segments.push_back(std::make_pair(pos_[head_[v]], pos_[v]));");
  pushLine(lines, "        v = parent_[head_[v]];");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    if (depth_[u] > depth_[v]) {");
  pushLine(lines, "      std::swap(u, v);");
  pushLine(lines, "      std::swap(left_segments, right_segments);");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    const int l = pos_[u] + (include_lca ? 0 : 1);");
  pushLine(lines, "    if (l <= pos_[v]) {");
  pushLine(lines, "      right_segments.push_back(std::make_pair(l, pos_[v]));");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    std::vector<std::pair<int, int>> segments;");
  pushLine(lines, "    segments.reserve(left_segments.size() + right_segments.size());");
  pushLine(lines, "    for (const std::pair<int, int>& seg : left_segments) {");
  pushLine(lines, "      segments.push_back(seg);");
  pushLine(lines, "    }");
  pushLine(lines, "    for (int i = static_cast<int>(right_segments.size()) - 1; i >= 0; --i) {");
  pushLine(lines, "      segments.push_back(right_segments[i]);");
  pushLine(lines, "    }");
  pushLine(lines, "    return segments;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  template <typename Func>");
  pushLine(lines, "  void for_each_path_segment(int a, int b, const Func& fn,");
  pushLine(lines, "                             bool include_lca = true) const {");
  pushLine(lines, "    const std::vector<std::pair<int, int>> segments =");
  pushLine(lines, "        path_segments(a, b, include_lca);");
  pushLine(lines, "    for (const std::pair<int, int>& seg : segments) {");
  pushLine(lines, "      fn(seg.first, seg.second);");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  int n_;");
  pushLine(lines, "  int root_;");
  pushLine(lines, "  int timer_;");
  pushLine(lines, "  std::vector<std::vector<int>> graph_;");
  pushLine(lines, "  std::vector<int> parent_;");
  pushLine(lines, "  std::vector<int> depth_;");
  pushLine(lines, "  std::vector<int> subtree_size_;");
  pushLine(lines, "  std::vector<int> heavy_;");
  pushLine(lines, "  std::vector<int> head_;");
  pushLine(lines, "  std::vector<int> pos_;");
  pushLine(lines, "  std::vector<int> order_;");
  pushLine(lines);
  pushLine(lines, "  bool vertex_ok(int v) const { return v >= 0 && v < n_; }");
  pushLine(lines);
  pushLine(lines, "  int dfs_size(int v, int parent) {");
  pushLine(lines, "    parent_[v] = parent;");
  pushLine(lines, "    subtree_size_[v] = 1;");
  pushLine(lines, "    int best_size = 0;");
  pushLine(lines, "    int best_child = -1;");
  pushLine(lines);
  pushLine(lines, "    for (int to : graph_[v]) {");
  pushLine(lines, "      if (to == parent) {");
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines, "      depth_[to] = depth_[v] + 1;");
  pushLine(lines, "      const int child_size = dfs_size(to, v);");
  pushLine(lines, "      subtree_size_[v] += child_size;");
  pushLine(lines, "      if (child_size > best_size) {");
  pushLine(lines, "        best_size = child_size;");
  pushLine(lines, "        best_child = to;");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "    heavy_[v] = best_child;");
  pushLine(lines, "    return subtree_size_[v];");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void dfs_decompose(int v, int head) {");
  pushLine(lines, "    head_[v] = head;");
  pushLine(lines, "    pos_[v] = timer_;");
  pushLine(lines, "    order_[timer_] = v;");
  pushLine(lines, "    ++timer_;");
  pushLine(lines);
  pushLine(lines, "    if (heavy_[v] != -1) {");
  pushLine(lines, "      dfs_decompose(heavy_[v], head);");
  pushLine(lines, "    }");
  pushLine(lines, "    for (int to : graph_[v]) {");
  pushLine(lines, "      if (to == parent_[v] || to == heavy_[v]) {");
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines, "      dfs_decompose(to, to);");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines, "};");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderHldUsage(options));
  }

  const usage = renderHldUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
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
  const names = options.names;
  const graph = options.graphName ?? "graph";
  const source = options.sourceName ?? "source";
  const target = options.targetName ?? "target";
  const result = options.resultName ?? "result";
  return [
    "/*",
    "Example:",
    `std::vector<std::vector<int>> ${graph}(n);`,
    `${names.addEdgeName}(${graph}, u, v, true);`,
    `auto ${result} = ${names.singleSourceName}(${graph}, ${source});`,
    `auto path = ${names.restorePathName}(${source}, ${target}, ${result});`,
    "*/"
  ].join("\n");
}

function renderBfsUsageSnippet(options: BfsOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }

  const names = options.names;
  const n = options.sizeExpression?.trim() || "n";
  const m = options.edgeCountName?.trim() || "m";
  const graph = sanitizeIdentifier(options.graphName ?? "graph", "graph");
  const source = sanitizeIdentifier(options.sourceName ?? "source", "source");
  const target = sanitizeIdentifier(options.targetName ?? "target", "target");
  const result = sanitizeIdentifier(options.resultName ?? "result", "result");
  const undirected = options.graphMode === "undirected" ? "true" : "false";
  const lines: string[] = [];

  if (options.sourceMode !== "existing_graph") {
    pushLine(lines, `std::vector<std::vector<int>> ${graph}(${n});`);
    pushLine(lines, `for (int i = 0; i < ${m}; ++i) {`);
    pushLine(lines, "  int u, v;");
    pushLine(lines, "  cin >> u >> v;");
    if (options.indexing === "one_based_input") {
      pushLine(lines, "  --u; --v;");
    }
    pushLine(lines, `  ${names.addEdgeName}(${graph}, u, v, ${undirected});`);
    pushLine(lines, "}");
  }

  if (usageMode === "read_graph") {
    return lines.join("\n");
  }

  if (usageMode === "multi_source") {
    pushLine(lines, "int k;");
    pushLine(lines, "cin >> k;");
    pushLine(lines, "std::vector<int> sources(k);");
    pushLine(lines, "for (int& v : sources) cin >> v;");
    if (options.indexing === "one_based_input") {
      pushLine(lines, "for (int& v : sources) --v;");
    }
    pushLine(lines, `auto ${result} = ${names.multiSourceName}(${graph}, sources);`);
    return lines.join("\n");
  }

  pushLine(lines, `int ${source};`);
  pushLine(lines, `cin >> ${source};`);
  if (usageMode === "path_query") {
    pushLine(lines, `int ${target};`);
    pushLine(lines, `cin >> ${target};`);
  }
  if (options.indexing === "one_based_input") {
    pushLine(lines, `--${source};`);
    if (usageMode === "path_query") {
      pushLine(lines, `--${target};`);
    }
  }
  pushLine(lines, `auto ${result} = ${names.singleSourceName}(${graph}, ${source});`);
  if (usageMode === "path_query") {
    pushLine(lines, `auto path = ${names.restorePathName}(${source}, ${target}, ${result});`);
    pushLine(lines, `cout << ${result}.distance[${target}] << '\\n';`);
  }
  return lines.join("\n");
}

export function renderBfsRecipe(options: BfsOptions): RenderedRecipe {
  const names = options.names;
  const lines: string[] = [];

  pushLine(lines, `struct ${names.resultStructName} {`);
  pushLine(lines, "  std::vector<int> distance;");
  pushLine(lines, "  std::vector<int> parent;");
  pushLine(lines, "  std::vector<int> order;");
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(
    lines,
    `inline void ${names.addEdgeName}(std::vector<std::vector<int>>& graph, int from, int to,`
  );
  pushLine(lines, "                         bool undirected = false) {");
  pushLine(lines, "  const int n = static_cast<int>(graph.size());");
  pushLine(lines, "  if (from < 0 || from >= n || to < 0 || to >= n) {");
  pushLine(lines, "    return;");
  pushLine(lines, "  }");
  pushLine(lines, "  graph[from].push_back(to);");
  pushLine(lines, "  if (undirected && from != to) {");
  pushLine(lines, "    graph[to].push_back(from);");
  pushLine(lines, "  }");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(
    lines,
    `inline ${names.resultStructName} ${names.multiSourceName}(const std::vector<std::vector<int>>& graph,`
  );
  pushLine(lines, "                                  const std::vector<int>& sources) {");
  pushLine(lines, "  const int n = static_cast<int>(graph.size());");
  pushLine(lines, `  ${names.resultStructName} result;`);
  pushLine(lines, "  result.distance.assign(n, -1);");
  pushLine(lines, "  result.parent.assign(n, -1);");
  pushLine(lines, "  result.order.clear();");
  pushLine(lines);
  pushLine(lines, "  std::queue<int> q;");
  pushLine(lines, "  for (int source : sources) {");
  pushLine(lines, "    if (source < 0 || source >= n || result.distance[source] != -1) {");
  pushLine(lines, "      continue;");
  pushLine(lines, "    }");
  pushLine(lines, "    result.distance[source] = 0;");
  pushLine(lines, "    result.order.push_back(source);");
  pushLine(lines, "    q.push(source);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  while (!q.empty()) {");
  pushLine(lines, "    const int v = q.front();");
  pushLine(lines, "    q.pop();");
  pushLine(lines);
  pushLine(lines, "    for (int to : graph[v]) {");
  pushLine(lines, "      if (to < 0 || to >= n || result.distance[to] != -1) {");
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines, "      result.distance[to] = result.distance[v] + 1;");
  pushLine(lines, "      result.parent[to] = v;");
  pushLine(lines, "      result.order.push_back(to);");
  pushLine(lines, "      q.push(to);");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  return result;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(
    lines,
    `inline ${names.resultStructName} ${names.singleSourceName}(const std::vector<std::vector<int>>& graph, int source) {`
  );
  pushLine(lines, `  return ${names.multiSourceName}(graph, std::vector<int>(1, source));`);
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(
    lines,
    `inline std::vector<int> ${names.restorePathName}(int source, int target,`
  );
  pushLine(lines, `                                         const ${names.resultStructName}& result) {`);
  pushLine(lines, "  const int n = static_cast<int>(result.parent.size());");
  pushLine(lines, "  if (source < 0 || source >= n || target < 0 || target >= n) {");
  pushLine(lines, "    return {};");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  std::vector<int> path;");
  pushLine(lines, "  int current = target;");
  pushLine(lines, "  int steps = 0;");
  pushLine(lines, "  while (current != -1 && steps <= n) {");
  pushLine(lines, "    path.push_back(current);");
  pushLine(lines, "    current = result.parent[current];");
  pushLine(lines, "    ++steps;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  if (path.empty() || path.back() != source) {");
  pushLine(lines, "    return {};");
  pushLine(lines, "  }");
  pushLine(lines, "  std::reverse(path.begin(), path.end());");
  pushLine(lines, "  return path;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(
    lines,
    `inline std::vector<int> ${names.restorePathToRootName}(int target,`
  );
  pushLine(lines, `                                                 const ${names.resultStructName}& result) {`);
  pushLine(lines, "  const int n = static_cast<int>(result.parent.size());");
  pushLine(lines, "  if (target < 0 || target >= n || result.distance[target] == -1) {");
  pushLine(lines, "    return {};");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  std::vector<int> path;");
  pushLine(lines, "  int current = target;");
  pushLine(lines, "  int steps = 0;");
  pushLine(lines, "  while (current != -1 && steps <= n) {");
  pushLine(lines, "    path.push_back(current);");
  pushLine(lines, "    current = result.parent[current];");
  pushLine(lines, "    ++steps;");
  pushLine(lines, "  }");
  pushLine(lines, "  std::reverse(path.begin(), path.end());");
  pushLine(lines, "  return path;");
  pushLine(lines, "}");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderBfsUsage(options));
  }

  const usage = renderBfsUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
    [
      names.resultStructName,
      names.addEdgeName,
      names.multiSourceName,
      names.singleSourceName,
      names.restorePathName,
      names.restorePathToRootName
    ]
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
  const names = options.names;
  const weight = options.valueType ?? "long long";
  const graph = options.graphName ?? "graph";
  const source = options.sourceName ?? "source";
  const target = options.targetName ?? "target";
  const result = options.resultName ?? "result";
  const inf = options.infExpression ?? "numeric_limits<long long>::max()";
  return [
    "/*",
    "Example:",
    `std::vector<std::vector<${names.edgeStructName}<${weight}>>> ${graph}(n);`,
    `${names.addEdgeName}(${graph}, u, v, w, true);`,
    `auto ${result} = ${names.singleSourceName}(${graph}, ${source}, ${inf});`,
    `auto path = ${names.restorePathName}(${source}, ${target}, ${result});`,
    "*/"
  ].join("\n");
}

function renderDijkstraUsageSnippet(options: DijkstraOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }

  const names = options.names;
  const weight = options.valueType?.trim() || "long long";
  const inf = options.infExpression?.trim() || `std::numeric_limits<${weight}>::max()`;
  const n = options.sizeExpression?.trim() || "n";
  const m = options.edgeCountName?.trim() || "m";
  const graph = sanitizeIdentifier(options.graphName ?? "graph", "graph");
  const source = sanitizeIdentifier(options.sourceName ?? "source", "source");
  const target = sanitizeIdentifier(options.targetName ?? "target", "target");
  const result = sanitizeIdentifier(options.resultName ?? "result", "result");
  const undirected = options.graphMode === "undirected" ? "true" : "false";
  const lines: string[] = [];

  if (options.sourceMode !== "existing_graph") {
    pushLine(lines, `std::vector<std::vector<${names.edgeStructName}<${weight}>>> ${graph}(${n});`);
    pushLine(lines, `for (int i = 0; i < ${m}; ++i) {`);
    pushLine(lines, `  int u, v; ${weight} w;`);
    pushLine(lines, "  cin >> u >> v >> w;");
    if (options.indexing === "one_based_input") {
      pushLine(lines, "  --u; --v;");
    }
    pushLine(lines, `  ${names.addEdgeName}(${graph}, u, v, w, ${undirected});`);
    pushLine(lines, "}");
  }

  if (usageMode === "read_graph") {
    return lines.join("\n");
  }

  if (usageMode === "multi_source") {
    pushLine(lines, "int k;");
    pushLine(lines, "cin >> k;");
    pushLine(lines, "std::vector<int> sources(k);");
    pushLine(lines, "for (int& v : sources) cin >> v;");
    if (options.indexing === "one_based_input") {
      pushLine(lines, "for (int& v : sources) --v;");
    }
    pushLine(lines, `auto ${result} = ${names.multiSourceName}(${graph}, sources, ${inf});`);
    return lines.join("\n");
  }

  pushLine(lines, `int ${source};`);
  pushLine(lines, `cin >> ${source};`);
  if (usageMode === "path_query") {
    pushLine(lines, `int ${target};`);
    pushLine(lines, `cin >> ${target};`);
  }
  if (options.indexing === "one_based_input") {
    pushLine(lines, `--${source};`);
    if (usageMode === "path_query") {
      pushLine(lines, `--${target};`);
    }
  }
  pushLine(lines, `auto ${result} = ${names.singleSourceName}(${graph}, ${source}, ${inf});`);
  if (usageMode === "path_query") {
    pushLine(lines, `auto path = ${names.restorePathName}(${source}, ${target}, ${result});`);
    pushLine(lines, `cout << ${result}.distance[${target}] << '\\n';`);
  }
  return lines.join("\n");
}

export function renderDijkstraRecipe(options: DijkstraOptions): RenderedRecipe {
  const names = options.names;
  const lines: string[] = [];

  pushLine(lines, "template <typename Weight>");
  pushLine(lines, `struct ${names.edgeStructName} {`);
  pushLine(lines, "  int to;");
  pushLine(lines, "  Weight weight;");
  pushLine(lines);
  pushLine(lines, `  ${names.edgeStructName}(int to_ = 0, const Weight& weight_ = Weight())`);
  pushLine(lines, "      : to(to_), weight(weight_) {}");
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(lines, "template <typename Weight>");
  pushLine(lines, `struct ${names.resultStructName} {`);
  pushLine(lines, "  std::vector<Weight> distance;");
  pushLine(lines, "  std::vector<int> parent;");
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(lines, "template <typename Weight, typename WeightArg>");
  pushLine(lines, `void ${names.addEdgeName}(std::vector<std::vector<${names.edgeStructName}<Weight>>>& graph,`);
  pushLine(lines, "                       int from, int to, const WeightArg& weight,");
  pushLine(lines, "                       bool undirected = false) {");
  pushLine(lines, "  const int n = static_cast<int>(graph.size());");
  pushLine(lines, "  if (from < 0 || from >= n || to < 0 || to >= n) {");
  pushLine(lines, "    return;");
  pushLine(lines, "  }");
  pushLine(lines, `  graph[from].push_back(${names.edgeStructName}<Weight>(to, static_cast<Weight>(weight)));`);
  pushLine(lines, "  if (undirected && from != to) {");
  pushLine(lines, `    graph[to].push_back(${names.edgeStructName}<Weight>(from, static_cast<Weight>(weight)));`);
  pushLine(lines, "  }");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename Weight>");
  pushLine(lines, `${names.resultStructName}<Weight> ${names.multiSourceName}(`);
  pushLine(lines, `    const std::vector<std::vector<${names.edgeStructName}<Weight>>>& graph,`);
  pushLine(lines, "    const std::vector<int>& sources,");
  pushLine(lines, "    Weight inf = std::numeric_limits<Weight>::max()) {");
  pushLine(lines, "  const int n = static_cast<int>(graph.size());");
  pushLine(lines, `  ${names.resultStructName}<Weight> result;`);
  pushLine(lines, "  result.distance.assign(n, inf);");
  pushLine(lines, "  result.parent.assign(n, -1);");
  pushLine(lines);
  pushLine(lines, "  using Node = std::pair<Weight, int>;");
  pushLine(lines, "  std::priority_queue<Node, std::vector<Node>, std::greater<Node>> pq;");
  pushLine(lines);
  pushLine(lines, "  for (int source : sources) {");
  pushLine(lines, "    if (source < 0 || source >= n || result.distance[source] == Weight(0)) {");
  pushLine(lines, "      continue;");
  pushLine(lines, "    }");
  pushLine(lines, "    result.distance[source] = Weight(0);");
  pushLine(lines, "    pq.push(Node(Weight(0), source));");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  while (!pq.empty()) {");
  pushLine(lines, "    const Weight dist = pq.top().first;");
  pushLine(lines, "    const int v = pq.top().second;");
  pushLine(lines, "    pq.pop();");
  pushLine(lines);
  pushLine(lines, "    if (dist != result.distance[v]) {");
  pushLine(lines, "      continue;");
  pushLine(lines, "    }");
  pushLine(lines, `    for (const ${names.edgeStructName}<Weight>& edge : graph[v]) {`);
  pushLine(lines, "      if (edge.to < 0 || edge.to >= n || edge.weight < Weight(0)) {");
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines, "      const Weight candidate = dist + edge.weight;");
  pushLine(lines, "      if (candidate < result.distance[edge.to]) {");
  pushLine(lines, "        result.distance[edge.to] = candidate;");
  pushLine(lines, "        result.parent[edge.to] = v;");
  pushLine(lines, "        pq.push(Node(candidate, edge.to));");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  return result;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename Weight>");
  pushLine(lines, `${names.resultStructName}<Weight> ${names.singleSourceName}(`);
  pushLine(lines, `    const std::vector<std::vector<${names.edgeStructName}<Weight>>>& graph, int source,`);
  pushLine(lines, "    Weight inf = std::numeric_limits<Weight>::max()) {");
  pushLine(lines, `  return ${names.multiSourceName}(graph, std::vector<int>(1, source), inf);`);
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename Weight>");
  pushLine(lines, `std::vector<int> ${names.restorePathName}(int source, int target,`);
  pushLine(lines, `                                       const ${names.resultStructName}<Weight>& result) {`);
  pushLine(lines, "  const int n = static_cast<int>(result.parent.size());");
  pushLine(lines, "  if (source < 0 || source >= n || target < 0 || target >= n) {");
  pushLine(lines, "    return {};");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  std::vector<int> path;");
  pushLine(lines, "  int current = target;");
  pushLine(lines, "  int steps = 0;");
  pushLine(lines, "  while (current != -1 && steps <= n) {");
  pushLine(lines, "    path.push_back(current);");
  pushLine(lines, "    current = result.parent[current];");
  pushLine(lines, "    ++steps;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  if (path.empty() || path.back() != source) {");
  pushLine(lines, "    return {};");
  pushLine(lines, "  }");
  pushLine(lines, "  std::reverse(path.begin(), path.end());");
  pushLine(lines, "  return path;");
  pushLine(lines, "}");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderDijkstraUsage(options));
  }

  const usage = renderDijkstraUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
    [
      names.edgeStructName,
      names.resultStructName,
      names.addEdgeName,
      names.multiSourceName,
      names.singleSourceName,
      names.restorePathName
    ]
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
  const names = options.names;
  const graph = options.graphName ?? "graph";
  const order = options.orderName ?? "order";
  const dag = options.dagName ?? "dag";
  return [
    "/*",
    "Example:",
    `std::vector<std::vector<int>> ${graph}(n);`,
    `${names.addEdgeName}(${graph}, before, after);`,
    `bool ${dag} = false;`,
    `auto ${order} = ${names.sortName}(${graph}, &${dag});`,
    `if (!${dag}) {`,
    "}",
    "*/"
  ].join("\n");
}

function renderToposortUsageSnippet(options: ToposortOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }

  const names = options.names;
  const n = options.sizeExpression?.trim() || "n";
  const m = options.edgeCountName?.trim() || "m";
  const graph = sanitizeIdentifier(options.graphName ?? "graph", "graph");
  const order = sanitizeIdentifier(options.orderName ?? "order", "order");
  const dag = sanitizeIdentifier(options.dagName ?? "dag", "dag");
  const lines: string[] = [];

  if (options.sourceMode !== "existing_graph") {
    pushLine(lines, `std::vector<std::vector<int>> ${graph}(${n});`);
    pushLine(lines, `for (int i = 0; i < ${m}; ++i) {`);
    pushLine(lines, "  int before, after;");
    pushLine(lines, "  cin >> before >> after;");
    if (options.indexing === "one_based_input") {
      pushLine(lines, "  --before; --after;");
    }
    pushLine(lines, `  ${names.addEdgeName}(${graph}, before, after);`);
    pushLine(lines, "}");
  }

  if (usageMode === "read_graph") {
    return lines.join("\n");
  }

  if (usageMode === "validate_order") {
    pushLine(lines, `std::vector<int> ${order}(${n});`);
    pushLine(lines, `for (int& v : ${order}) cin >> v;`);
    if (options.indexing === "one_based_input") {
      pushLine(lines, `for (int& v : ${order}) --v;`);
    }
    pushLine(lines, `bool valid = ${names.validateName}(${graph}, ${order});`);
    pushLine(lines, "cout << valid << '\\n';");
    return lines.join("\n");
  }

  pushLine(lines, `bool ${dag} = false;`);
  pushLine(lines, `std::vector<int> ${order} = ${names.sortName}(${graph}, &${dag});`);
  if (usageMode === "cycle_check") {
    pushLine(lines, `cout << ${dag} << '\\n';`);
    return lines.join("\n");
  }
  pushLine(lines, `if (!${dag}) {`);
  pushLine(lines, "  cout << \"IMPOSSIBLE\\n\";");
  pushLine(lines, "} else {");
  pushLine(lines, `  for (int v : ${order}) cout << v << ' ';`);
  pushLine(lines, "  cout << '\\n';");
  pushLine(lines, "}");
  return lines.join("\n");
}

export function renderToposortRecipe(options: ToposortOptions): RenderedRecipe {
  const names = options.names;
  const lines: string[] = [];

  pushLine(lines, `inline void ${names.addEdgeName}(std::vector<std::vector<int>>& graph, int from, int to) {`);
  pushLine(lines, "  const int n = static_cast<int>(graph.size());");
  pushLine(lines, "  if (from < 0 || from >= n || to < 0 || to >= n) {");
  pushLine(lines, "    return;");
  pushLine(lines, "  }");
  pushLine(lines, "  graph[from].push_back(to);");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, `inline std::vector<int> ${names.sortName}(const std::vector<std::vector<int>>& graph,`);
  pushLine(lines, "                                         bool* is_dag = nullptr) {");
  pushLine(lines, "  const int n = static_cast<int>(graph.size());");
  pushLine(lines, "  std::vector<int> indegree(n, 0);");
  pushLine(lines, "  for (int v = 0; v < n; ++v) {");
  pushLine(lines, "    for (int to : graph[v]) {");
  pushLine(lines, "      if (to >= 0 && to < n) {");
  pushLine(lines, "        ++indegree[to];");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  std::queue<int> q;");
  pushLine(lines, "  for (int v = 0; v < n; ++v) {");
  pushLine(lines, "    if (indegree[v] == 0) {");
  pushLine(lines, "      q.push(v);");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  std::vector<int> order;");
  pushLine(lines, "  order.reserve(n);");
  pushLine(lines, "  while (!q.empty()) {");
  pushLine(lines, "    const int v = q.front();");
  pushLine(lines, "    q.pop();");
  pushLine(lines, "    order.push_back(v);");
  pushLine(lines, "    for (int to : graph[v]) {");
  pushLine(lines, "      if (to < 0 || to >= n) {");
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines, "      --indegree[to];");
  pushLine(lines, "      if (indegree[to] == 0) {");
  pushLine(lines, "        q.push(to);");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  const bool dag = static_cast<int>(order.size()) == n;");
  pushLine(lines, "  if (is_dag != nullptr) {");
  pushLine(lines, "    *is_dag = dag;");
  pushLine(lines, "  }");
  pushLine(lines, "  if (!dag) {");
  pushLine(lines, "    return {};");
  pushLine(lines, "  }");
  pushLine(lines, "  return order;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, `inline bool ${names.validateName}(const std::vector<std::vector<int>>& graph,`);
  pushLine(lines, "                                 const std::vector<int>& order) {");
  pushLine(lines, "  const int n = static_cast<int>(graph.size());");
  pushLine(lines, "  if (static_cast<int>(order.size()) != n) {");
  pushLine(lines, "    return false;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  std::vector<int> position(n, -1);");
  pushLine(lines, "  for (int i = 0; i < n; ++i) {");
  pushLine(lines, "    const int v = order[i];");
  pushLine(lines, "    if (v < 0 || v >= n || position[v] != -1) {");
  pushLine(lines, "      return false;");
  pushLine(lines, "    }");
  pushLine(lines, "    position[v] = i;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  for (int v = 0; v < n; ++v) {");
  pushLine(lines, "    for (int to : graph[v]) {");
  pushLine(lines, "      if (to < 0 || to >= n) {");
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines, "      if (position[v] > position[to]) {");
  pushLine(lines, "        return false;");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines, "  return true;");
  pushLine(lines, "}");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderToposortUsage(options));
  }

  const usage = renderToposortUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
    [names.addEdgeName, names.sortName, names.validateName]
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
  const names = options.names;
  const graph = options.graphName ?? "graph";
  const result = options.resultName ?? "scc";
  return [
    "/*",
    "Example:",
    `std::vector<std::vector<int>> ${graph}(n);`,
    `${names.addEdgeName}(${graph}, from, to);`,
    `auto ${result} = ${names.sccName}(${graph});`,
    `int comp = ${result}.component_of[v];`,
    "*/"
  ].join("\n");
}

function renderKosarajuUsageSnippet(options: KosarajuOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }

  const names = options.names;
  const n = options.sizeExpression?.trim() || "n";
  const m = options.edgeCountName?.trim() || "m";
  const graph = sanitizeIdentifier(options.graphName ?? "graph", "graph");
  const result = sanitizeIdentifier(options.resultName ?? "scc", "scc");
  const lines: string[] = [];

  if (options.sourceMode !== "existing_graph") {
    pushLine(lines, `std::vector<std::vector<int>> ${graph}(${n});`);
    pushLine(lines, `for (int i = 0; i < ${m}; ++i) {`);
    pushLine(lines, "  int from, to;");
    pushLine(lines, "  cin >> from >> to;");
    if (options.indexing === "one_based_input") {
      pushLine(lines, "  --from; --to;");
    }
    pushLine(lines, `  ${names.addEdgeName}(${graph}, from, to);`);
    pushLine(lines, "}");
  }

  if (usageMode === "read_graph") {
    return lines.join("\n");
  }

  pushLine(lines, `${names.resultStructName} ${result} = ${names.sccName}(${graph});`);
  if (usageMode === "compute_scc") {
    pushLine(lines, `cout << ${result}.component_count << '\\n';`);
    return lines.join("\n");
  }
  if (usageMode === "print_components") {
    pushLine(lines, `for (const auto& component : ${result}.components) {`);
    pushLine(lines, "  for (int v : component) cout << v << ' ';");
    pushLine(lines, "  cout << '\\n';");
    pushLine(lines, "}");
    return lines.join("\n");
  }

  pushLine(lines, "int q;");
  pushLine(lines, "cin >> q;");
  pushLine(lines, "while (q--) {");
  pushLine(lines, "  int a, b;");
  pushLine(lines, "  cin >> a >> b;");
  if (options.indexing === "one_based_input") {
    pushLine(lines, "  --a; --b;");
  }
  pushLine(lines, `  cout << (${result}.component_of[a] == ${result}.component_of[b]) << '\\n';`);
  pushLine(lines, "}");
  return lines.join("\n");
}

export function renderKosarajuRecipe(options: KosarajuOptions): RenderedRecipe {
  const names = options.names;
  const lines: string[] = [];

  pushLine(lines, `struct ${names.resultStructName} {`);
  pushLine(lines, "  int component_count;");
  pushLine(lines, "  std::vector<int> component_of;");
  pushLine(lines, "  std::vector<std::vector<int>> components;");
  pushLine(lines, "  std::vector<std::vector<int>> condensation_dag;");
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(lines, `inline void ${names.addEdgeName}(std::vector<std::vector<int>>& graph, int from, int to) {`);
  pushLine(lines, "  const int n = static_cast<int>(graph.size());");
  pushLine(lines, "  if (from < 0 || from >= n || to < 0 || to >= n) {");
  pushLine(lines, "    return;");
  pushLine(lines, "  }");
  pushLine(lines, "  graph[from].push_back(to);");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, `inline ${names.resultStructName} ${names.sccName}(const std::vector<std::vector<int>>& graph) {`);
  pushLine(lines, "  const int n = static_cast<int>(graph.size());");
  pushLine(lines, "  std::vector<std::vector<int>> reverse_graph(n);");
  pushLine(lines, "  for (int v = 0; v < n; ++v) {");
  pushLine(lines, "    for (int to : graph[v]) {");
  pushLine(lines, "      if (to >= 0 && to < n) {");
  pushLine(lines, "        reverse_graph[to].push_back(v);");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  std::vector<char> used(n, 0);");
  pushLine(lines, "  std::vector<int> order;");
  pushLine(lines, "  order.reserve(n);");
  pushLine(lines);
  pushLine(lines, "  std::function<void(int)> dfs1 = [&](int v) {");
  pushLine(lines, "    used[v] = 1;");
  pushLine(lines, "    for (int to : graph[v]) {");
  pushLine(lines, "      if (to < 0 || to >= n || used[to]) {");
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines, "      dfs1(to);");
  pushLine(lines, "    }");
  pushLine(lines, "    order.push_back(v);");
  pushLine(lines, "  };");
  pushLine(lines);
  pushLine(lines, "  for (int v = 0; v < n; ++v) {");
  pushLine(lines, "    if (!used[v]) {");
  pushLine(lines, "      dfs1(v);");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${names.resultStructName} result;`);
  pushLine(lines, "  result.component_of.assign(n, -1);");
  pushLine(lines, "  result.component_count = 0;");
  pushLine(lines);
  pushLine(lines, "  std::function<void(int, int)> dfs2 = [&](int v, int comp) {");
  pushLine(lines, "    result.component_of[v] = comp;");
  pushLine(lines, "    result.components[comp].push_back(v);");
  pushLine(lines, "    for (int to : reverse_graph[v]) {");
  pushLine(lines, "      if (result.component_of[to] == -1) {");
  pushLine(lines, "        dfs2(to, comp);");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "  };");
  pushLine(lines);
  pushLine(lines, "  for (int i = n - 1; i >= 0; --i) {");
  pushLine(lines, "    const int v = order[i];");
  pushLine(lines, "    if (result.component_of[v] != -1) {");
  pushLine(lines, "      continue;");
  pushLine(lines, "    }");
  pushLine(lines, "    result.components.push_back(std::vector<int>());");
  pushLine(lines, "    dfs2(v, result.component_count);");
  pushLine(lines, "    ++result.component_count;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  result.condensation_dag.assign(result.component_count, std::vector<int>());");
  pushLine(lines, "  for (int v = 0; v < n; ++v) {");
  pushLine(lines, "    const int from_comp = result.component_of[v];");
  pushLine(lines, "    for (int to : graph[v]) {");
  pushLine(lines, "      if (to < 0 || to >= n) {");
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines, "      const int to_comp = result.component_of[to];");
  pushLine(lines, "      if (from_comp != to_comp) {");
  pushLine(lines, "        result.condensation_dag[from_comp].push_back(to_comp);");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines, "  for (int comp = 0; comp < result.component_count; ++comp) {");
  pushLine(lines, "    std::vector<int>& edges = result.condensation_dag[comp];");
  pushLine(lines, "    std::sort(edges.begin(), edges.end());");
  pushLine(lines, "    edges.erase(std::unique(edges.begin(), edges.end()), edges.end());");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  return result;");
  pushLine(lines, "}");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderKosarajuUsage(options));
  }

  const usage = renderKosarajuUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
    [names.resultStructName, names.addEdgeName, names.sccName]
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
  const names = options.names;
  const queries = options.queriesName ?? "queries";
  return [
    "/*",
    "Example:",
    `std::vector<${names.queryStructName}> ${queries};`,
    `${queries}.push_back(${names.queryStructName}(l, r));  // [l, r)`,
    `auto order = ${names.orderName}(${queries}, n);`,
    "*/"
  ].join("\n");
}

function renderMoUsageSnippet(options: MoOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }

  const names = options.names;
  const n = options.sizeExpression?.trim() || "n";
  const q = options.queryCountName?.trim() || "q";
  const values = sanitizeIdentifier(options.valuesName ?? "a", "a");
  const queries = sanitizeIdentifier(options.queriesName ?? "queries", "queries");
  const answers = sanitizeIdentifier(options.answersName ?? "answers", "answers");
  const answerType = options.answerType?.trim() || "long long";
  const lines: string[] = [];

  if (options.sourceMode !== "existing_queries") {
    pushLine(lines, `std::vector<${names.queryStructName}> ${queries};`);
    pushLine(lines, `${queries}.reserve(${q});`);
    pushLine(lines, `for (int i = 0; i < ${q}; ++i) {`);
    pushLine(lines, "  int l, r;");
    pushLine(lines, "  cin >> l >> r;");
    if (options.indexing === "one_based_closed_input") {
      pushLine(lines, "  --l;");
    }
    pushLine(lines, `  ${queries}.push_back(${names.queryStructName}(l, r));`);
    pushLine(lines, "}");
  }

  if (usageMode === "read_queries") {
    return lines.join("\n");
  }

  if (usageMode === "distinct_count_skeleton") {
    pushLine(lines, "std::unordered_map<int, int> freq;");
    pushLine(lines, "int distinct = 0;");
    pushLine(lines, "auto add = [&](int index) {");
    pushLine(lines, `  if (++freq[${values}[index]] == 1) ++distinct;`);
    pushLine(lines, "};");
    pushLine(lines, "auto remove = [&](int index) {");
    pushLine(lines, `  if (--freq[${values}[index]] == 0) --distinct;`);
    pushLine(lines, "};");
    pushLine(lines, "auto get_answer = [&]() { return distinct; };");
    pushLine(lines, `std::vector<int> ${answers} = ${names.processName}(${n}, ${queries}, add, add, remove, remove, get_answer);`);
    return lines.join("\n");
  }

  pushLine(lines, `${answerType} current_answer{};`);
  pushLine(lines, "auto add_left = [&](int index) {");
  pushLine(lines, "  // include index on the left");
  pushLine(lines, "};");
  pushLine(lines, "auto add_right = [&](int index) {");
  pushLine(lines, "  // include index on the right");
  pushLine(lines, "};");
  pushLine(lines, "auto remove_left = [&](int index) {");
  pushLine(lines, "  // remove index from the left");
  pushLine(lines, "};");
  pushLine(lines, "auto remove_right = [&](int index) {");
  pushLine(lines, "  // remove index from the right");
  pushLine(lines, "};");
  pushLine(lines, "auto get_answer = [&]() { return current_answer; };");
  pushLine(lines, `std::vector<${answerType}> ${answers} = ${names.processName}(${n}, ${queries}, add_left, add_right, remove_left, remove_right, get_answer);`);
  return lines.join("\n");
}

export function renderMoRecipe(options: MoOptions): RenderedRecipe {
  const names = options.names;
  const lines: string[] = [];

  pushLine(lines, `struct ${names.queryStructName} {`);
  pushLine(lines, "  int left;");
  pushLine(lines, "  int right;  // [left, right)");
  pushLine(lines);
  pushLine(lines, `  ${names.queryStructName}(int left_ = 0, int right_ = 0) : left(left_), right(right_) {}`);
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(lines, `inline int ${names.blockSizeName}(int n, int q) {`);
  pushLine(lines, "  const int safe_n = std::max(1, n);");
  pushLine(lines, "  const int safe_q = std::max(1, q);");
  pushLine(lines, "  const int block_from_n = static_cast<int>(std::sqrt(static_cast<double>(safe_n)));");
  pushLine(lines, "  const int block_from_ratio =");
  pushLine(lines, "      static_cast<int>(safe_n / std::max(1.0, std::sqrt(static_cast<double>(safe_q))));");
  pushLine(lines, "  return std::max(1, std::max(block_from_n, block_from_ratio));");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, `inline ${names.queryStructName} ${names.normalizeName}(${names.queryStructName} query, int n) {`);
  pushLine(lines, "  query.left = std::max(0, std::min(query.left, n));");
  pushLine(lines, "  query.right = std::max(0, std::min(query.right, n));");
  pushLine(lines, "  if (query.left > query.right) {");
  pushLine(lines, "    std::swap(query.left, query.right);");
  pushLine(lines, "  }");
  pushLine(lines, "  return query;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, `inline std::vector<int> ${names.orderName}(const std::vector<${names.queryStructName}>& queries, int n,`);
  pushLine(lines, "                                 int block_size = -1) {");
  pushLine(lines, "  const int q = static_cast<int>(queries.size());");
  pushLine(lines, "  if (block_size <= 0) {");
  pushLine(lines, `    block_size = ${names.blockSizeName}(n, q);`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  std::vector<${names.queryStructName}> normalized(q);`);
  pushLine(lines, "  for (int i = 0; i < q; ++i) {");
  pushLine(lines, `    normalized[i] = ${names.normalizeName}(queries[i], n);`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  std::vector<int> order(q);");
  pushLine(lines, "  std::iota(order.begin(), order.end(), 0);");
  pushLine(lines, "  std::sort(order.begin(), order.end(), [&](int lhs_idx, int rhs_idx) {");
  pushLine(lines, "    const auto& lhs = normalized[lhs_idx];");
  pushLine(lines, "    const auto& rhs = normalized[rhs_idx];");
  pushLine(lines, "    const int lhs_block = lhs.left / block_size;");
  pushLine(lines, "    const int rhs_block = rhs.left / block_size;");
  pushLine(lines, "    if (lhs_block != rhs_block) {");
  pushLine(lines, "      return lhs_block < rhs_block;");
  pushLine(lines, "    }");
  pushLine(lines, "    if ((lhs_block & 1) == 0) {");
  pushLine(lines, "      return lhs.right < rhs.right;");
  pushLine(lines, "    }");
  pushLine(lines, "    return lhs.right > rhs.right;");
  pushLine(lines, "  });");
  pushLine(lines, "  return order;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename AddLeft, typename AddRight, typename RemoveLeft, typename RemoveRight,");
  pushLine(lines, "          typename GetAnswer>");
  pushLine(lines, `inline std::vector<typename std::invoke_result<GetAnswer>::type> ${names.processName}(`);
  pushLine(lines, `    int n, const std::vector<${names.queryStructName}>& queries, const AddLeft& add_left,`);
  pushLine(lines, "    const AddRight& add_right, const RemoveLeft& remove_left,");
  pushLine(lines, "    const RemoveRight& remove_right, const GetAnswer& get_answer,");
  pushLine(lines, "    int block_size = -1) {");
  pushLine(lines, "  using Answer = typename std::invoke_result<GetAnswer>::type;");
  pushLine(lines, "  const int q = static_cast<int>(queries.size());");
  pushLine(lines, "  std::vector<Answer> answers(static_cast<std::size_t>(q));");
  pushLine(lines, "  if (q == 0) {");
  pushLine(lines, "    return answers;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  std::vector<${names.queryStructName}> normalized(q);`);
  pushLine(lines, "  for (int i = 0; i < q; ++i) {");
  pushLine(lines, `    normalized[i] = ${names.normalizeName}(queries[i], n);`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  const std::vector<int> order = ${names.orderName}(normalized, n, block_size);`);
  pushLine(lines, "  int cur_left = 0;");
  pushLine(lines, "  int cur_right = 0;");
  pushLine(lines);
  pushLine(lines, "  for (int index : order) {");
  pushLine(lines, "    const auto query = normalized[index];");
  pushLine(lines, "    while (cur_left > query.left) {");
  pushLine(lines, "      add_left(--cur_left);");
  pushLine(lines, "    }");
  pushLine(lines, "    while (cur_right < query.right) {");
  pushLine(lines, "      add_right(cur_right++);");
  pushLine(lines, "    }");
  pushLine(lines, "    while (cur_left < query.left) {");
  pushLine(lines, "      remove_left(cur_left++);");
  pushLine(lines, "    }");
  pushLine(lines, "    while (cur_right > query.right) {");
  pushLine(lines, "      remove_right(--cur_right);");
  pushLine(lines, "    }");
  pushLine(lines, "    answers[index] = get_answer();");
  pushLine(lines, "  }");
  pushLine(lines, "  return answers;");
  pushLine(lines, "}");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderMoUsage(options));
  }

  const usage = renderMoUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
    [names.queryStructName, names.blockSizeName, names.normalizeName, names.orderName, names.processName]
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

function monotonicStackCall(options: MonotonicStackOptions): string {
  const names = options.names;
  const source = options.sourceName?.trim() || "values";
  const strict = options.strictness === "non_strict" ? "false" : "true";
  const relation = options.relation ?? "smaller";
  const direction = options.direction ?? "left";
  if (relation === "all" || direction === "both") {
    return `${names.nearestAllName}(${source}, ${strict})`;
  }
  if (relation === "greater" && direction === "right") {
    return `${names.nearestGreaterRightName}(${source}, ${strict})`;
  }
  if (relation === "greater") {
    return `${names.nearestGreaterLeftName}(${source}, ${strict})`;
  }
  if (direction === "right") {
    return `${names.nearestSmallerRightName}(${source}, ${strict})`;
  }
  return `${names.nearestSmallerLeftName}(${source}, ${strict})`;
}

function renderMonotonicStackUsage(options: MonotonicStackOptions): string {
  const source = options.sourceName ?? "values";
  const result = options.resultName ?? "nearest";
  return [
    "/*",
    "Example:",
    `auto ${result} = ${monotonicStackCall({ ...options, sourceName: source })};`,
    "*/"
  ].join("\n");
}

function renderMonotonicStackUsageSnippet(options: MonotonicStackOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }
  const result = sanitizeIdentifier(options.resultName ?? "nearest", "nearest");
  const call = monotonicStackCall(options);
  if (usageMode === "compute_all" || options.relation === "all" || options.direction === "both") {
    return `auto ${result} = ${call};`;
  }
  return `std::vector<int> ${result} = ${call};`;
}

export function renderMonotonicStackRecipe(
  options: MonotonicStackOptions
): RenderedRecipe {
  const names = options.names;
  const lines: string[] = [];

  pushLine(lines, "template <typename T, typename Compare>");
  pushLine(lines, `inline std::vector<int> ${names.nearestLeftByName}(const std::vector<T>& values,`);
  pushLine(lines, "                                        Compare compare, bool strict = true) {");
  pushLine(lines, "  const int n = static_cast<int>(values.size());");
  pushLine(lines, "  std::vector<int> result(n, -1);");
  pushLine(lines, "  std::vector<int> st;");
  pushLine(lines, "  st.reserve(n);");
  pushLine(lines);
  pushLine(lines, "  for (int i = 0; i < n; ++i) {");
  pushLine(lines, "    while (!st.empty()) {");
  pushLine(lines, "      const int j = st.back();");
  pushLine(lines, "      const bool keep = strict ? compare(values[j], values[i])");
  pushLine(lines, "                               : !compare(values[i], values[j]);");
  pushLine(lines, "      if (keep) {");
  pushLine(lines, "        break;");
  pushLine(lines, "      }");
  pushLine(lines, "      st.pop_back();");
  pushLine(lines, "    }");
  pushLine(lines, "    if (!st.empty()) {");
  pushLine(lines, "      result[i] = st.back();");
  pushLine(lines, "    }");
  pushLine(lines, "    st.push_back(i);");
  pushLine(lines, "  }");
  pushLine(lines, "  return result;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename T, typename Compare>");
  pushLine(lines, `inline std::vector<int> ${names.nearestRightByName}(const std::vector<T>& values,`);
  pushLine(lines, "                                         Compare compare, bool strict = true) {");
  pushLine(lines, "  const int n = static_cast<int>(values.size());");
  pushLine(lines, "  std::vector<int> result(n, -1);");
  pushLine(lines, "  std::vector<int> st;");
  pushLine(lines, "  st.reserve(n);");
  pushLine(lines);
  pushLine(lines, "  for (int i = n - 1; i >= 0; --i) {");
  pushLine(lines, "    while (!st.empty()) {");
  pushLine(lines, "      const int j = st.back();");
  pushLine(lines, "      const bool keep = strict ? compare(values[j], values[i])");
  pushLine(lines, "                               : !compare(values[i], values[j]);");
  pushLine(lines, "      if (keep) {");
  pushLine(lines, "        break;");
  pushLine(lines, "      }");
  pushLine(lines, "      st.pop_back();");
  pushLine(lines, "    }");
  pushLine(lines, "    if (!st.empty()) {");
  pushLine(lines, "      result[i] = st.back();");
  pushLine(lines, "    }");
  pushLine(lines, "    st.push_back(i);");
  pushLine(lines, "  }");
  pushLine(lines, "  return result;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename T>");
  pushLine(lines, `inline std::vector<int> ${names.nearestSmallerLeftName}(const std::vector<T>& values,`);
  pushLine(lines, "                                             bool strict = true) {");
  pushLine(lines, `  return ${names.nearestLeftByName}(values, std::less<T>(), strict);`);
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename T>");
  pushLine(lines, `inline std::vector<int> ${names.nearestSmallerRightName}(const std::vector<T>& values,`);
  pushLine(lines, "                                              bool strict = true) {");
  pushLine(lines, `  return ${names.nearestRightByName}(values, std::less<T>(), strict);`);
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename T>");
  pushLine(lines, `inline std::vector<int> ${names.nearestGreaterLeftName}(const std::vector<T>& values,`);
  pushLine(lines, "                                             bool strict = true) {");
  pushLine(lines, `  return ${names.nearestLeftByName}(values, std::greater<T>(), strict);`);
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename T>");
  pushLine(lines, `inline std::vector<int> ${names.nearestGreaterRightName}(const std::vector<T>& values,`);
  pushLine(lines, "                                              bool strict = true) {");
  pushLine(lines, `  return ${names.nearestRightByName}(values, std::greater<T>(), strict);`);
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename T>");
  pushLine(lines, `struct ${names.nearestStructName} {`);
  pushLine(lines, "  std::vector<int> left_smaller;");
  pushLine(lines, "  std::vector<int> right_smaller;");
  pushLine(lines, "  std::vector<int> left_greater;");
  pushLine(lines, "  std::vector<int> right_greater;");
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(lines, "template <typename T>");
  pushLine(lines, `inline ${names.nearestStructName}<T> ${names.nearestAllName}(const std::vector<T>& values,`);
  pushLine(lines, "                                     bool strict = true) {");
  pushLine(lines, `  ${names.nearestStructName}<T> result;`);
  pushLine(lines, `  result.left_smaller = ${names.nearestSmallerLeftName}(values, strict);`);
  pushLine(lines, `  result.right_smaller = ${names.nearestSmallerRightName}(values, strict);`);
  pushLine(lines, `  result.left_greater = ${names.nearestGreaterLeftName}(values, strict);`);
  pushLine(lines, `  result.right_greater = ${names.nearestGreaterRightName}(values, strict);`);
  pushLine(lines, "  return result;");
  pushLine(lines, "}");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderMonotonicStackUsage(options));
  }

  const usage = renderMonotonicStackUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
    [
      names.nearestLeftByName,
      names.nearestRightByName,
      names.nearestSmallerLeftName,
      names.nearestSmallerRightName,
      names.nearestGreaterLeftName,
      names.nearestGreaterRightName,
      names.nearestStructName,
      names.nearestAllName
    ]
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
  const table = options.tableName ?? "table";
  const keyType = options.keyType ?? "long long";
  const valueType = options.valueType ?? "int";
  const names = options.names;
  return [
    "/*",
    "Example:",
    `${names.tableAliasName}<${keyType}, ${valueType}> ${table};`,
    `${table}[key] += delta;`,
    "*/"
  ].join("\n");
}

function renderGpHashTableUsageSnippet(options: GpHashTableOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }
  const names = options.names;
  const keyType = options.keyType?.trim() || "long long";
  const valueType = options.valueType?.trim() || "int";
  const table = sanitizeIdentifier(options.tableName ?? "table", "table");
  const source = sanitizeIdentifier(options.sourceName ?? "values", "values");
  if (usageMode === "declare_set") {
    return `${names.tableAliasName}<${keyType}, __gnu_pbds::null_type> ${table};`;
  }
  if (usageMode === "frequency_loop") {
    return [
      `${names.tableAliasName}<${keyType}, int> ${table};`,
      `for (const auto& value : ${source}) {`,
      `  ++${table}[value];`,
      "}"
    ].join("\n");
  }
  return `${names.tableAliasName}<${keyType}, ${valueType}> ${table};`;
}

export function renderGpHashTableRecipe(options: GpHashTableOptions): RenderedRecipe {
  const names = options.names;
  const lines: string[] = [];

  pushLine(lines, `struct ${names.splitMixName} {`);
  pushLine(lines, "  static std::uint64_t mix(std::uint64_t x) {");
  pushLine(lines, "    x += 0x9e3779b97f4a7c15ULL;");
  pushLine(lines, "    x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;");
  pushLine(lines, "    x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;");
  pushLine(lines, "    x ^= (x >> 31);");
  pushLine(lines, "    return x;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  std::size_t operator()(std::uint64_t x) const {");
  pushLine(lines, "    return static_cast<std::size_t>(mix(x));");
  pushLine(lines, "  }");
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(lines, "template <typename Key>");
  pushLine(lines, `struct ${names.hashName} {`);
  pushLine(lines, "  std::size_t operator()(const Key& key) const {");
  pushLine(lines, "    const std::uint64_t base = static_cast<std::uint64_t>(std::hash<Key>()(key));");
  pushLine(lines, `    return static_cast<std::size_t>(${names.splitMixName}::mix(base));`);
  pushLine(lines, "  }");
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(lines, "template <typename First, typename Second,");
  pushLine(lines, `          typename FirstHash = ${names.hashName}<First>,`);
  pushLine(lines, `          typename SecondHash = ${names.hashName}<Second>>`);
  pushLine(lines, `struct ${names.pairHashName} {`);
  pushLine(lines, "  std::size_t operator()(const std::pair<First, Second>& value) const {");
  pushLine(lines, "    const std::uint64_t h1 = static_cast<std::uint64_t>(FirstHash()(value.first));");
  pushLine(lines, "    const std::uint64_t h2 = static_cast<std::uint64_t>(SecondHash()(value.second));");
  pushLine(lines, "    return static_cast<std::size_t>(");
  pushLine(lines, `        ${names.splitMixName}::mix(h1 ^ (h2 + 0x9e3779b97f4a7c15ULL + (h1 << 6) + (h1 >> 2))));`);
  pushLine(lines, "  }");
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(lines, "template <typename Key, typename Value,");
  pushLine(lines, `          typename Hash = ${names.hashName}<Key>>`);
  pushLine(lines, `using ${names.tableAliasName} = __gnu_pbds::gp_hash_table<Key, Value, Hash>;`);

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderGpHashTableUsage(options));
  }

  const usage = renderGpHashTableUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
    [names.splitMixName, names.hashName, names.pairHashName, names.tableAliasName]
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
  const className = options.names.className;
  const keyType = options.keyType ?? "int";
  const setName = options.setName ?? "os";
  return [
    "/*",
    "Example:",
    `${className}<${keyType}> ${setName};`,
    `${setName}.insert(x);`,
    `int less_count = ${setName}.order_of_key(x);`,
    `auto kth = ${setName}.find_by_order(k);`,
    "*/"
  ].join("\n");
}

function renderOrderedSetUsageSnippet(options: OrderedSetOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }
  const className = options.names.className;
  const keyType = options.keyType?.trim() || "int";
  const setName = sanitizeIdentifier(options.setName ?? "os", "os");
  if (usageMode === "pair_multiset") {
    return `${className}<std::pair<${keyType}, int>> ${setName};`;
  }
  const lines: string[] = [`${className}<${keyType}> ${setName};`];
  if (usageMode === "rank_query") {
    pushLine(lines, "int x;");
    pushLine(lines, "cin >> x;");
    pushLine(lines, `cout << ${setName}.order_of_key(x) << '\\n';`);
  } else if (usageMode === "kth_query") {
    pushLine(lines, "int k;");
    pushLine(lines, "cin >> k;");
    pushLine(lines, `auto value = ${setName}.find_by_order(k);`);
    pushLine(lines, "if (value.has_value()) cout << *value << '\\n';");
  }
  return lines.join("\n");
}

export function renderOrderedSetRecipe(options: OrderedSetOptions): RenderedRecipe {
  const names = options.names;
  const lines: string[] = [];

  pushLine(lines, "template <typename Key, typename Compare = std::less<Key>>");
  pushLine(lines, `using ${names.treeAliasName} =`);
  pushLine(lines, "    __gnu_pbds::tree<Key, __gnu_pbds::null_type, Compare, __gnu_pbds::rb_tree_tag,");
  pushLine(lines, "                     __gnu_pbds::tree_order_statistics_node_update>;");
  pushLine(lines);
  pushLine(lines, "template <typename Key, typename Compare = std::less<Key>>");
  pushLine(lines, `class ${names.className} {`);
  pushLine(lines, " public:");
  pushLine(lines, "  using key_type = Key;");
  pushLine(lines, `  using tree_type = ${names.treeAliasName}<Key, Compare>;`);
  pushLine(lines, "  using iterator = typename tree_type::iterator;");
  pushLine(lines, "  using const_iterator = typename tree_type::const_iterator;");
  pushLine(lines);
  pushLine(lines, "  bool insert(const Key& key) { return tree_.insert(key).second; }");
  pushLine(lines);
  pushLine(lines, "  bool erase(const Key& key) { return tree_.erase(key) > 0; }");
  pushLine(lines);
  pushLine(lines, "  void clear() { tree_.clear(); }");
  pushLine(lines);
  pushLine(lines, "  int size() const { return static_cast<int>(tree_.size()); }");
  pushLine(lines);
  pushLine(lines, "  bool empty() const { return tree_.empty(); }");
  pushLine(lines);
  pushLine(lines, "  bool contains(const Key& key) const { return tree_.find(key) != tree_.end(); }");
  pushLine(lines);
  pushLine(lines, "  int order_of_key(const Key& key) const {");
  pushLine(lines, "    return static_cast<int>(tree_.order_of_key(key));");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  std::optional<Key> find_by_order(int order) const {");
  pushLine(lines, "    if (order < 0 || order >= size()) {");
  pushLine(lines, "      return std::nullopt;");
  pushLine(lines, "    }");
  pushLine(lines, "    const const_iterator it = tree_.find_by_order(order);");
  pushLine(lines, "    if (it == tree_.end()) {");
  pushLine(lines, "      return std::nullopt;");
  pushLine(lines, "    }");
  pushLine(lines, "    return *it;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  iterator find(const Key& key) { return tree_.find(key); }");
  pushLine(lines);
  pushLine(lines, "  const_iterator find(const Key& key) const { return tree_.find(key); }");
  pushLine(lines);
  pushLine(lines, "  iterator lower_bound(const Key& key) { return tree_.lower_bound(key); }");
  pushLine(lines);
  pushLine(lines, "  const_iterator lower_bound(const Key& key) const { return tree_.lower_bound(key); }");
  pushLine(lines);
  pushLine(lines, "  iterator upper_bound(const Key& key) { return tree_.upper_bound(key); }");
  pushLine(lines);
  pushLine(lines, "  const_iterator upper_bound(const Key& key) const { return tree_.upper_bound(key); }");
  pushLine(lines);
  pushLine(lines, "  iterator begin() { return tree_.begin(); }");
  pushLine(lines);
  pushLine(lines, "  const_iterator begin() const { return tree_.begin(); }");
  pushLine(lines);
  pushLine(lines, "  iterator end() { return tree_.end(); }");
  pushLine(lines);
  pushLine(lines, "  const_iterator end() const { return tree_.end(); }");
  pushLine(lines);
  pushLine(lines, "  tree_type& raw() { return tree_; }");
  pushLine(lines);
  pushLine(lines, "  const tree_type& raw() const { return tree_; }");
  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  tree_type tree_;");
  pushLine(lines, "};");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderOrderedSetUsage(options));
  }

  const usage = renderOrderedSetUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
    [names.treeAliasName, names.className]
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

function setUtilsCall(options: SetUtilsOptions): string {
  const names = options.names;
  const container = options.containerName?.trim() || "container";
  if (options.target === "iterator") {
    const iterator = options.iteratorName?.trim() || "it";
    return options.lookup === "prev"
      ? `${names.prevIteratorName}(${container}, ${iterator})`
      : `${names.nextIteratorName}(${container}, ${iterator})`;
  }
  const key = options.keyName?.trim() || "key";
  return options.lookup === "prev"
    ? `${names.prevValueName}(${container}, ${key})`
    : `${names.nextValueName}(${container}, ${key})`;
}

function renderSetUtilsUsage(options: SetUtilsOptions): string {
  const result = options.resultName ?? "neighbor";
  return [
    "/*",
    "Example:",
    `auto ${result} = ${setUtilsCall(options)};`,
    `if (${result}.has_value()) {`,
    "}",
    "*/"
  ].join("\n");
}

function renderSetUtilsUsageSnippet(options: SetUtilsOptions): string {
  if ((options.usageMode ?? "helper_only") === "helper_only") {
    return "";
  }
  const result = sanitizeIdentifier(options.resultName ?? "neighbor", "neighbor");
  return [
    `auto ${result} = ${setUtilsCall(options)};`,
    `if (${result}.has_value()) {`,
    `  // use *${result}`,
    "}"
  ].join("\n");
}

export function renderSetUtilsRecipe(options: SetUtilsOptions): RenderedRecipe {
  const names = options.names;
  const lines: string[] = [];

  pushLine(lines, "template <typename Container>");
  pushLine(lines, `inline std::optional<typename Container::iterator> ${names.nextIteratorName}(`);
  pushLine(lines, "    Container& container, typename Container::iterator it) {");
  pushLine(lines, "  if (it == container.end()) {");
  pushLine(lines, "    return std::nullopt;");
  pushLine(lines, "  }");
  pushLine(lines, "  ++it;");
  pushLine(lines, "  if (it == container.end()) {");
  pushLine(lines, "    return std::nullopt;");
  pushLine(lines, "  }");
  pushLine(lines, "  return it;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename Container>");
  pushLine(lines, `inline std::optional<typename Container::const_iterator> ${names.nextIteratorName}(`);
  pushLine(lines, "    const Container& container, typename Container::const_iterator it) {");
  pushLine(lines, "  if (it == container.end()) {");
  pushLine(lines, "    return std::nullopt;");
  pushLine(lines, "  }");
  pushLine(lines, "  ++it;");
  pushLine(lines, "  if (it == container.end()) {");
  pushLine(lines, "    return std::nullopt;");
  pushLine(lines, "  }");
  pushLine(lines, "  return it;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename Container>");
  pushLine(lines, `inline std::optional<typename Container::iterator> ${names.prevIteratorName}(`);
  pushLine(lines, "    Container& container, typename Container::iterator it) {");
  pushLine(lines, "  if (container.empty() || it == container.begin()) {");
  pushLine(lines, "    return std::nullopt;");
  pushLine(lines, "  }");
  pushLine(lines, "  if (it == container.end()) {");
  pushLine(lines, "    auto last = container.end();");
  pushLine(lines, "    --last;");
  pushLine(lines, "    return last;");
  pushLine(lines, "  }");
  pushLine(lines, "  --it;");
  pushLine(lines, "  return it;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename Container>");
  pushLine(lines, `inline std::optional<typename Container::const_iterator> ${names.prevIteratorName}(`);
  pushLine(lines, "    const Container& container, typename Container::const_iterator it) {");
  pushLine(lines, "  if (container.empty() || it == container.begin()) {");
  pushLine(lines, "    return std::nullopt;");
  pushLine(lines, "  }");
  pushLine(lines, "  if (it == container.end()) {");
  pushLine(lines, "    auto last = container.end();");
  pushLine(lines, "    --last;");
  pushLine(lines, "    return last;");
  pushLine(lines, "  }");
  pushLine(lines, "  --it;");
  pushLine(lines, "  return it;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename Container, typename Key>");
  pushLine(lines, `inline std::optional<typename Container::value_type> ${names.nextValueName}(`);
  pushLine(lines, "    const Container& container, const Key& key) {");
  pushLine(lines, "  const auto it = container.upper_bound(key);");
  pushLine(lines, "  if (it == container.end()) {");
  pushLine(lines, "    return std::nullopt;");
  pushLine(lines, "  }");
  pushLine(lines, "  return *it;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename Container, typename Key>");
  pushLine(lines, `inline std::optional<typename Container::value_type> ${names.prevValueName}(`);
  pushLine(lines, "    const Container& container, const Key& key) {");
  pushLine(lines, "  auto it = container.lower_bound(key);");
  pushLine(lines, "  if (it == container.begin()) {");
  pushLine(lines, "    return std::nullopt;");
  pushLine(lines, "  }");
  pushLine(lines, "  --it;");
  pushLine(lines, "  return *it;");
  pushLine(lines, "}");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderSetUtilsUsage(options));
  }

  const usage = renderSetUtilsUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
    [
      names.nextIteratorName,
      names.prevIteratorName,
      names.nextValueName,
      names.prevValueName
    ]
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
  const names = options.names;
  const arena = sanitizeIdentifier(options.arenaName ?? "arena", "arena");
  const container = sanitizeIdentifier(options.containerName ?? "values", "values");
  const valueType = options.valueType?.trim() || "int";
  const capacity = (options.capacityExpression ?? "1U << 26U").trim() || "1U << 26U";
  const edgeType = sanitizeIdentifier(options.edgeTypeName ?? "Edge", "Edge");
  return [
    "/*",
    "Example:",
    `${names.arenaClassName} ${arena}(${capacity});`,
    `using Alloc = ${names.allocatorClassName}<${valueType}>;`,
    `std::vector<${valueType}, Alloc> ${container}{Alloc(${arena})};`,
    "*/"
  ].join("\n");
}

function renderFastAllocatorUsageSnippet(options: FastAllocatorOptions): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }
  const names = options.names;
  const arena = sanitizeIdentifier(options.arenaName ?? "arena", "arena");
  const container = sanitizeIdentifier(options.containerName ?? "values", "values");
  const valueType = options.valueType?.trim() || "int";
  const capacity = (options.capacityExpression ?? "1U << 26U").trim() || "1U << 26U";
  const edgeType = sanitizeIdentifier(options.edgeTypeName ?? "Edge", "Edge");
  const lines: string[] = [];

  pushLine(lines, `${names.arenaClassName} ${arena}(${capacity});`);
  if (usageMode === "arena_reset") {
    pushLine(lines, `${arena}.reset(${capacity});`);
    return lines.join("\n");
  }
  if (usageMode === "edge_vector") {
    pushLine(lines, `struct ${edgeType} {`);
    pushLine(lines, "  int to;");
    pushLine(lines, "  int w;");
    pushLine(lines, "};");
    pushLine(lines, `using ${edgeType}Alloc = ${names.allocatorClassName}<${edgeType}>;`);
    pushLine(lines, `std::vector<${edgeType}, ${edgeType}Alloc> ${container}{${edgeType}Alloc(${arena})};`);
    return lines.join("\n");
  }
  pushLine(lines, `using Alloc = ${names.allocatorClassName}<${valueType}>;`);
  pushLine(lines, `std::vector<${valueType}, Alloc> ${container}{Alloc(${arena})};`);
  return lines.join("\n");
}

export function renderFastAllocatorRecipe(options: FastAllocatorOptions): RenderedRecipe {
  const names = options.names;
  const lines: string[] = [];

  pushLine(lines, `class ${names.arenaClassName} {`);
  pushLine(lines, " public:");
  pushLine(lines, `  explicit ${names.arenaClassName}(std::size_t capacity_bytes = 0)`);
  pushLine(lines, "      : storage_(capacity_bytes), offset_(capacity_bytes) {}");
  pushLine(lines);
  pushLine(lines, "  void reset() { offset_ = storage_.size(); }");
  pushLine(lines);
  pushLine(lines, "  void reset(std::size_t capacity_bytes) {");
  pushLine(lines, "    storage_.assign(capacity_bytes, 0U);");
  pushLine(lines, "    offset_ = capacity_bytes;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  std::size_t capacity() const { return storage_.size(); }");
  pushLine(lines);
  pushLine(lines, "  std::size_t remaining() const { return offset_; }");
  pushLine(lines);
  pushLine(lines, "  void* allocate(std::size_t bytes,");
  pushLine(lines, "                 std::size_t alignment = alignof(std::max_align_t)) {");
  pushLine(lines, "    if (bytes == 0) {");
  pushLine(lines, "      return nullptr;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (alignment == 0 || (alignment & (alignment - 1)) != 0) {");
  pushLine(lines, "      throw std::bad_alloc();");
  pushLine(lines, "    }");
  pushLine(lines, "    if (bytes > offset_) {");
  pushLine(lines, "      throw std::bad_alloc();");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    std::size_t pos = offset_ - bytes;");
  pushLine(lines, "    pos &= ~(alignment - 1);");
  pushLine(lines, "    if (pos > offset_ || offset_ - pos < bytes) {");
  pushLine(lines, "      throw std::bad_alloc();");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    offset_ = pos;");
  pushLine(lines, "    return static_cast<void*>(storage_.data() + offset_);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  std::vector<unsigned char> storage_;");
  pushLine(lines, "  std::size_t offset_;");
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(lines, "template <typename T>");
  pushLine(lines, `class ${names.allocatorClassName} {`);
  pushLine(lines, " public:");
  pushLine(lines, "  using value_type = T;");
  pushLine(lines);
  pushLine(lines, `  ${names.allocatorClassName}() noexcept : arena_(nullptr) {}`);
  pushLine(lines);
  pushLine(lines, `  explicit ${names.allocatorClassName}(${names.arenaClassName}& arena) noexcept : arena_(&arena) {}`);
  pushLine(lines);
  pushLine(lines, "  template <typename U>");
  pushLine(lines, `  ${names.allocatorClassName}(const ${names.allocatorClassName}<U>& other) noexcept : arena_(other.arena()) {}`);
  pushLine(lines);
  pushLine(lines, "  T* allocate(std::size_t n) {");
  pushLine(lines, "    if (n == 0) {");
  pushLine(lines, "      return nullptr;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (arena_ == nullptr ||");
  pushLine(lines, "        n > std::numeric_limits<std::size_t>::max() / sizeof(T)) {");
  pushLine(lines, "      throw std::bad_alloc();");
  pushLine(lines, "    }");
  pushLine(lines, "    return static_cast<T*>(arena_->allocate(n * sizeof(T), alignof(T)));");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void deallocate(T*, std::size_t) noexcept {}");
  pushLine(lines);
  pushLine(lines, "  template <typename U>");
  pushLine(lines, "  struct rebind {");
  pushLine(lines, `    using other = ${names.allocatorClassName}<U>;`);
  pushLine(lines, "  };");
  pushLine(lines);
  pushLine(lines, `  ${names.arenaClassName}* arena() const noexcept { return arena_; }`);
  pushLine(lines);
  pushLine(lines, "  template <typename U>");
  pushLine(lines, `  bool operator==(const ${names.allocatorClassName}<U>& other) const noexcept {`);
  pushLine(lines, "    return arena_ == other.arena();");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  template <typename U>");
  pushLine(lines, `  bool operator!=(const ${names.allocatorClassName}<U>& other) const noexcept {`);
  pushLine(lines, "    return !(*this == other);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  template <typename>");
  pushLine(lines, `  friend class ${names.allocatorClassName};`);
  pushLine(lines);
  pushLine(lines, `  ${names.arenaClassName}* arena_;`);
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(lines, "template <typename T>");
  pushLine(lines, `inline ${names.allocatorClassName}<T> ${names.factoryName}(${names.arenaClassName}& arena) {`);
  pushLine(lines, `  return ${names.allocatorClassName}<T>(arena);`);
  pushLine(lines, "}");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderFastAllocatorUsage(options));
  }

  const usage = renderFastAllocatorUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
    [
      names.arenaClassName,
      names.allocatorClassName,
      names.factoryName
    ]
  );
}

export function renderFastAllocator(options: FastAllocatorOptions): string {
  return composeRecipeSections(renderFastAllocatorRecipe(options));
}

const GEOMETRY_HELPERS = String.raw`template <typename T>
int geometry_sign(const T& value) {
  return (T(0) < value) - (value < T(0));
}

inline int geometry_sign_eps(long double value, long double eps = 1e-12L) {
  return (value > eps) - (value < -eps);
}

template <typename T>
struct Point2 {
  using Value = T;
  T x;
  T y;

  Point2(const T& x_ = T(), const T& y_ = T()) : x(x_), y(y_) {}

  bool operator==(const Point2& other) const {
    return x == other.x && y == other.y;
  }

  bool operator!=(const Point2& other) const { return !(*this == other); }

  bool operator<(const Point2& other) const {
    if (x != other.x) {
      return x < other.x;
    }
    return y < other.y;
  }

  Point2 operator+(const Point2& other) const {
    return Point2(x + other.x, y + other.y);
  }

  Point2 operator-(const Point2& other) const {
    return Point2(x - other.x, y - other.y);
  }

  Point2 operator*(const T& scale) const { return Point2(x * scale, y * scale); }

  Point2 operator/(const T& scale) const { return Point2(x / scale, y / scale); }

  T dot(const Point2& other) const { return x * other.x + y * other.y; }

  T cross(const Point2& other) const { return x * other.y - y * other.x; }

  T cross(const Point2& a, const Point2& b) const { return (a - *this).cross(b - *this); }

  T norm2() const { return x * x + y * y; }
};

template <typename T>
inline Point2<long double> to_point_long_double(const Point2<T>& p) {
  return Point2<long double>(static_cast<long double>(p.x),
                             static_cast<long double>(p.y));
}

template <typename T>
inline long double cross_ld(const Point2<T>& a, const Point2<T>& b) {
  return static_cast<long double>(a.x) * static_cast<long double>(b.y) -
         static_cast<long double>(a.y) * static_cast<long double>(b.x);
}

template <typename T>
inline long double cross_ld(const Point2<T>& a, const Point2<T>& b,
                            const Point2<T>& c) {
  return cross_ld(b - a, c - a);
}

template <typename T>
inline int orientation(const Point2<T>& a, const Point2<T>& b, const Point2<T>& c,
                       long double eps = 1e-12L) {
  return geometry_sign_eps(cross_ld(a, b, c), eps);
}

template <typename T>
inline bool on_segment(const Point2<T>& a, const Point2<T>& b, const Point2<T>& p,
                       long double eps = 1e-12L) {
  if (orientation(a, b, p, eps) != 0) {
    return false;
  }
  const long double px = static_cast<long double>(p.x);
  const long double py = static_cast<long double>(p.y);
  return std::min(static_cast<long double>(a.x), static_cast<long double>(b.x)) - eps <=
             px &&
         px <=
             std::max(static_cast<long double>(a.x), static_cast<long double>(b.x)) + eps &&
         std::min(static_cast<long double>(a.y), static_cast<long double>(b.y)) - eps <=
             py &&
         py <=
             std::max(static_cast<long double>(a.y), static_cast<long double>(b.y)) + eps;
}

template <typename T>
inline bool segments_intersect(const Point2<T>& a, const Point2<T>& b, const Point2<T>& c,
                               const Point2<T>& d, long double eps = 1e-12L) {
  const int o1 = orientation(a, b, c, eps);
  const int o2 = orientation(a, b, d, eps);
  const int o3 = orientation(c, d, a, eps);
  const int o4 = orientation(c, d, b, eps);

  if (o1 * o2 < 0 && o3 * o4 < 0) {
    return true;
  }
  return (o1 == 0 && on_segment(a, b, c, eps)) ||
         (o2 == 0 && on_segment(a, b, d, eps)) ||
         (o3 == 0 && on_segment(c, d, a, eps)) ||
         (o4 == 0 && on_segment(c, d, b, eps));
}

template <typename T>
inline bool line_intersection(const Point2<T>& a, const Point2<T>& b, const Point2<T>& c,
                              const Point2<T>& d, Point2<long double>& out,
                              long double eps = 1e-12L) {
  const Point2<long double> aa = to_point_long_double(a);
  const Point2<long double> bb = to_point_long_double(b);
  const Point2<long double> cc = to_point_long_double(c);
  const Point2<long double> dd = to_point_long_double(d);

  const Point2<long double> ab = bb - aa;
  const Point2<long double> cd = dd - cc;
  const long double denom = cross_ld(ab, cd);
  if (std::fabs(denom) <= eps) {
    out = Point2<long double>(0.0L, 0.0L);
    return false;
  }

  const long double t = cross_ld(cc - aa, cd) / denom;
  out = Point2<long double>(aa.x + ab.x * t, aa.y + ab.y * t);
  return true;
}

inline bool point_equal_eps(const Point2<long double>& a, const Point2<long double>& b,
                            long double eps = 1e-12L) {
  return std::fabs(a.x - b.x) <= eps && std::fabs(a.y - b.y) <= eps;
}

template <typename T>
inline std::vector<Point2<long double>> segment_intersection(
    const Point2<T>& a, const Point2<T>& b, const Point2<T>& c, const Point2<T>& d,
    long double eps = 1e-12L) {
  if (!segments_intersect(a, b, c, d, eps)) {
    return {};
  }

  const int o1 = orientation(a, b, c, eps);
  const int o2 = orientation(a, b, d, eps);
  if (o1 == 0 && o2 == 0) {
    std::vector<Point2<long double>> common;
    auto add_if_unique = [&](const Point2<long double>& p) {
      for (const Point2<long double>& existing : common) {
        if (point_equal_eps(existing, p, eps)) {
          return;
        }
      }
      common.push_back(p);
    };

    if (on_segment(a, b, c, eps)) {
      add_if_unique(to_point_long_double(c));
    }
    if (on_segment(a, b, d, eps)) {
      add_if_unique(to_point_long_double(d));
    }
    if (on_segment(c, d, a, eps)) {
      add_if_unique(to_point_long_double(a));
    }
    if (on_segment(c, d, b, eps)) {
      add_if_unique(to_point_long_double(b));
    }

    std::sort(common.begin(), common.end(),
              [&](const Point2<long double>& lhs, const Point2<long double>& rhs) {
                if (std::fabs(lhs.x - rhs.x) > eps) {
                  return lhs.x < rhs.x;
                }
                return lhs.y < rhs.y - eps;
              });
    return common;
  }

  Point2<long double> inter;
  if (!line_intersection(a, b, c, d, inter, eps)) {
    return {};
  }
  return {inter};
}

template <typename T>
inline int vector_halfplane(const Point2<T>& v) {
  return (v.y > T(0) || (v.y == T(0) && v.x >= T(0))) ? 0 : 1;
}

template <typename T>
inline bool angle_less(const Point2<T>& lhs, const Point2<T>& rhs,
                       long double eps = 1e-12L) {
  const int half_lhs = vector_halfplane(lhs);
  const int half_rhs = vector_halfplane(rhs);
  if (half_lhs != half_rhs) {
    return half_lhs < half_rhs;
  }

  const long double cr = cross_ld(lhs, rhs);
  const int sign = geometry_sign_eps(cr, eps);
  if (sign != 0) {
    return sign > 0;
  }

  const long double dist_lhs =
      static_cast<long double>(lhs.x) * lhs.x + static_cast<long double>(lhs.y) * lhs.y;
  const long double dist_rhs =
      static_cast<long double>(rhs.x) * rhs.x + static_cast<long double>(rhs.y) * rhs.y;
  return dist_lhs < dist_rhs;
}

template <typename T>
inline void sort_vectors_by_angle(std::vector<Point2<T>>& vectors,
                                  long double eps = 1e-12L) {
  std::sort(vectors.begin(), vectors.end(),
            [&](const Point2<T>& lhs, const Point2<T>& rhs) {
              return angle_less(lhs, rhs, eps);
            });
}

template <typename T>
inline void sort_points_by_angle(std::vector<Point2<T>>& points, const Point2<T>& center,
                                 long double eps = 1e-12L) {
  std::sort(points.begin(), points.end(),
            [&](const Point2<T>& lhs, const Point2<T>& rhs) {
              return angle_less(lhs - center, rhs - center, eps);
            });
}

template <typename T>
inline std::vector<Point2<T>> convex_hull(std::vector<Point2<T>> points,
                                          long double eps = 1e-12L) {
  if (points.size() <= 1) {
    return points;
  }

  std::sort(points.begin(), points.end());
  points.erase(std::unique(points.begin(), points.end()), points.end());
  if (points.size() <= 1) {
    return points;
  }

  std::vector<Point2<T>> lower;
  std::vector<Point2<T>> upper;

  for (const Point2<T>& p : points) {
    while (lower.size() >= 2 &&
           geometry_sign_eps(cross_ld(lower[lower.size() - 2], lower.back(), p), eps) <=
               0) {
      lower.pop_back();
    }
    lower.push_back(p);
  }

  for (int i = static_cast<int>(points.size()) - 1; i >= 0; --i) {
    const Point2<T>& p = points[i];
    while (upper.size() >= 2 &&
           geometry_sign_eps(cross_ld(upper[upper.size() - 2], upper.back(), p), eps) <=
               0) {
      upper.pop_back();
    }
    upper.push_back(p);
  }

  lower.pop_back();
  upper.pop_back();
  lower.insert(lower.end(), upper.begin(), upper.end());
  return lower;
}`;

const GEOMETRY_EXPORTS = [
  "geometry_sign",
  "geometry_sign_eps",
  "Point2",
  "to_point_long_double",
  "cross_ld",
  "orientation",
  "on_segment",
  "segments_intersect",
  "line_intersection",
  "point_equal_eps",
  "segment_intersection",
  "vector_halfplane",
  "angle_less",
  "sort_vectors_by_angle",
  "sort_points_by_angle",
  "convex_hull"
];

function renderGeometryUsage(options: GeometryOptions): string {
  const pointType = `Point2<${options.valueType?.trim() || "long long"}>`;
  const points = sanitizeIdentifier(options.pointsName ?? "points", "points");
  const result = sanitizeIdentifier(options.resultName ?? "answer", "answer");
  const usage = options.usageMode ?? "helper_only";
  if (usage === "orientation_check") {
    return `int ${result} = orientation(a, b, c);`;
  }
  if (usage === "segment_intersection") {
    return `auto ${result} = segment_intersection(a, b, c, d);`;
  }
  if (usage === "sort_points") {
    return [
      `${pointType} center(0, 0);`,
      `sort_points_by_angle(${points}, center);`
    ].join("\n");
  }
  if (usage === "build_hull") {
    return `std::vector<${pointType}> ${result} = convex_hull(${points});`;
  }
  return "";
}

export function renderGeometryRecipe(options: GeometryOptions): RenderedRecipe {
  const lines = [GEOMETRY_HELPERS];
  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, "/*");
    pushLine(lines, "Example:");
    pushLine(lines, "std::vector<Point2<long long>> hull = convex_hull(points);");
    pushLine(lines, "*/");
  }
  const usage = renderGeometryUsage(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
    GEOMETRY_EXPORTS
  );
}

export function renderGeometry(options: GeometryOptions): string {
  return composeRecipeSections(renderGeometryRecipe(options));
}

const HALFPLANE_INTERSECTION_HELPERS = String.raw`template <typename T>
struct Point2 {
  using Value = T;
  T x;
  T y;

  Point2(const T& x_ = T(), const T& y_ = T()) : x(x_), y(y_) {}

  bool operator==(const Point2& other) const {
    return x == other.x && y == other.y;
  }

  bool operator!=(const Point2& other) const { return !(*this == other); }

  bool operator<(const Point2& other) const {
    if (x != other.x) {
      return x < other.x;
    }
    return y < other.y;
  }

  Point2 operator+(const Point2& other) const {
    return Point2(x + other.x, y + other.y);
  }

  Point2 operator-(const Point2& other) const {
    return Point2(x - other.x, y - other.y);
  }

  Point2 operator*(const T& scale) const { return Point2(x * scale, y * scale); }

  Point2 operator/(const T& scale) const { return Point2(x / scale, y / scale); }

  T dot(const Point2& other) const { return x * other.x + y * other.y; }

  T cross(const Point2& other) const { return x * other.y - y * other.x; }

  T cross(const Point2& a, const Point2& b) const { return (a - *this).cross(b - *this); }

  T norm2() const { return x * x + y * y; }
};

template <typename T>
inline Point2<long double> to_point_long_double(const Point2<T>& p) {
  return Point2<long double>(static_cast<long double>(p.x),
                             static_cast<long double>(p.y));
}

template <typename T>
inline long double cross_ld(const Point2<T>& a, const Point2<T>& b) {
  return static_cast<long double>(a.x) * static_cast<long double>(b.y) -
         static_cast<long double>(a.y) * static_cast<long double>(b.x);
}

template <typename T>
inline bool line_intersection(const Point2<T>& a, const Point2<T>& b,
                              const Point2<T>& c, const Point2<T>& d,
                              Point2<long double>& out,
                              long double eps = 1e-12L) {
  const Point2<long double> aa = to_point_long_double(a);
  const Point2<long double> bb = to_point_long_double(b);
  const Point2<long double> cc = to_point_long_double(c);
  const Point2<long double> dd = to_point_long_double(d);

  const Point2<long double> ab = bb - aa;
  const Point2<long double> cd = dd - cc;
  const long double denom = cross_ld(ab, cd);
  if (std::fabs(denom) <= eps) {
    out = Point2<long double>(0.0L, 0.0L);
    return false;
  }

  const long double t = cross_ld(cc - aa, cd) / denom;
  out = Point2<long double>(aa.x + ab.x * t, aa.y + ab.y * t);
  return true;
}

struct HalfPlane {
  Point2<long double> point;
  Point2<long double> direction;
  long double angle;

  HalfPlane(const Point2<long double>& point_ = Point2<long double>(),
            const Point2<long double>& through = Point2<long double>(1.0L, 0.0L))
      : point(point_), direction(through - point_), angle(0.0L) {
    normalize();
  }

  HalfPlane(long double x1, long double y1, long double x2, long double y2)
      : point(x1, y1), direction(x2 - x1, y2 - y1), angle(0.0L) {
    normalize();
  }

  static HalfPlane from_inequality(long double a, long double b, long double c) {
    if (std::fabs(a) <= 1e-18L && std::fabs(b) <= 1e-18L) {
      return HalfPlane(Point2<long double>(0.0L, 0.0L),
                       Point2<long double>(1.0L, 0.0L));
    }

    Point2<long double> p;
    if (std::fabs(a) > std::fabs(b)) {
      p = Point2<long double>(c / a, 0.0L);
    } else {
      p = Point2<long double>(0.0L, c / b);
    }
    const Point2<long double> dir(-b, a);
    return HalfPlane(p, p + dir);
  }

  bool out(const Point2<long double>& p, long double eps = 1e-12L) const {
    return cross_ld(direction, p - point) < -eps;
  }

 private:
  void normalize() {
    angle = std::atan2(direction.y, direction.x);
    if (angle < 0.0L) {
      angle += 2.0L * std::acos(-1.0L);
    }
  }
};

inline bool halfplane_parallel(const HalfPlane& lhs, const HalfPlane& rhs,
                               long double eps = 1e-12L) {
  return std::fabs(cross_ld(lhs.direction, rhs.direction)) <= eps;
}

inline bool halfplane_less(const HalfPlane& lhs, const HalfPlane& rhs,
                           long double eps = 1e-12L) {
  if (std::fabs(lhs.angle - rhs.angle) > eps) {
    return lhs.angle < rhs.angle;
  }
  return cross_ld(lhs.direction, rhs.point - lhs.point) < 0.0L;
}

inline bool halfplane_intersection_point(const HalfPlane& lhs, const HalfPlane& rhs,
                                         Point2<long double>& out,
                                         long double eps = 1e-12L) {
  return line_intersection(lhs.point, lhs.point + lhs.direction, rhs.point,
                           rhs.point + rhs.direction, out, eps);
}

inline std::vector<Point2<long double>> halfplane_intersection(
    std::vector<HalfPlane> halfplanes, long double eps = 1e-12L) {
  std::sort(halfplanes.begin(), halfplanes.end(),
            [&](const HalfPlane& lhs, const HalfPlane& rhs) {
              return halfplane_less(lhs, rhs, eps);
            });

  std::deque<HalfPlane> deque_planes;
  std::deque<Point2<long double>> deque_intersections;

  for (const HalfPlane& plane : halfplanes) {
    while (!deque_intersections.empty() && plane.out(deque_intersections.back(), eps)) {
      deque_intersections.pop_back();
      deque_planes.pop_back();
    }
    while (!deque_intersections.empty() && plane.out(deque_intersections.front(), eps)) {
      deque_intersections.pop_front();
      deque_planes.pop_front();
    }

    if (!deque_planes.empty() && halfplane_parallel(deque_planes.back(), plane, eps)) {
      if (plane.out(deque_planes.back().point, eps)) {
        deque_planes.back() = plane;
      }
      continue;
    }

    if (!deque_planes.empty()) {
      Point2<long double> intersection;
      if (!halfplane_intersection_point(deque_planes.back(), plane, intersection, eps)) {
        return {};
      }
      deque_intersections.push_back(intersection);
    }
    deque_planes.push_back(plane);
  }

  while (deque_intersections.size() > 0 &&
         deque_planes.front().out(deque_intersections.back(), eps)) {
    deque_intersections.pop_back();
    deque_planes.pop_back();
  }
  while (deque_intersections.size() > 0 &&
         deque_planes.back().out(deque_intersections.front(), eps)) {
    deque_intersections.pop_front();
    deque_planes.pop_front();
  }

  if (deque_planes.size() < 3) {
    return {};
  }

  Point2<long double> closing_intersection;
  if (!halfplane_intersection_point(deque_planes.back(), deque_planes.front(),
                                    closing_intersection, eps)) {
    return {};
  }
  deque_intersections.push_back(closing_intersection);

  return std::vector<Point2<long double>>(deque_intersections.begin(),
                                          deque_intersections.end());
}`;

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
  const halfplanes = sanitizeIdentifier(options.halfplanesName ?? "halfplanes", "halfplanes");
  const result = sanitizeIdentifier(options.resultName ?? "polygon", "polygon");
  const usage = options.usageMode ?? "helper_only";
  if (usage === "halfplane_vector") {
    return [
      `std::vector<HalfPlane> ${halfplanes};`,
      `${halfplanes}.push_back(HalfPlane(0.0L, 0.0L, 1.0L, 0.0L));`
    ].join("\n");
  }
  if (usage === "inequality_box") {
    return [
      `std::vector<HalfPlane> ${halfplanes} = {`,
      "    HalfPlane::from_inequality(-1.0L, 0.0L, 0.0L),",
      "    HalfPlane::from_inequality(1.0L, 0.0L, 1.0L),",
      "    HalfPlane::from_inequality(0.0L, -1.0L, 0.0L),",
      "    HalfPlane::from_inequality(0.0L, 1.0L, 1.0L),",
      "};"
    ].join("\n");
  }
  if (usage === "compute_polygon") {
    return `std::vector<Point2<long double>> ${result} = halfplane_intersection(${halfplanes});`;
  }
  return "";
}

export function renderHalfplaneIntersectionRecipe(
  options: HalfplaneIntersectionOptions
): RenderedRecipe {
  const lines = [HALFPLANE_INTERSECTION_HELPERS];
  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, "/*");
    pushLine(lines, "Example:");
    pushLine(lines, "std::vector<Point2<long double>> polygon = halfplane_intersection(halfplanes);");
    pushLine(lines, "*/");
  }
  const usage = renderHalfplaneIntersectionUsage(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
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
  const names = options.names;
  const lines = ["/*", "Example:", `${names.className} sieve(n);`];

  if (hasLinearSieveFeature(options, "lowest_prime")) {
    lines.push("bool prime = sieve.is_prime(x);");
  }

  if (hasLinearSieveFeature(options, "factorization")) {
    lines.push("auto factors = sieve.factorize(x);");
  }

  if (hasLinearSieveFeature(options, "primes")) {
    lines.push(`auto primes = ${names.primesFunctionName}(n);`);
  }

  lines.push("*/");
  return lines.join("\n");
}

export function renderLinearSieveRecipe(
  options: LinearSieveOptions
): RenderedRecipe {
  const names = options.names;
  const includeLowestPrime = hasLinearSieveFeature(options, "lowest_prime");
  const includePrimes = hasLinearSieveFeature(options, "primes");
  const includeFactorization = hasLinearSieveFeature(options, "factorization");
  const lines: string[] = [];
  const exports = [names.className];

  pushLine(lines, `class ${names.className} {`);
  pushLine(lines, " public:");
  pushLine(
    lines,
    `  explicit ${names.className}(int limit = 0) : limit_(0) { build(limit); }`
  );
  pushLine(lines);
  pushLine(lines, "  void build(int limit) {");
  pushLine(lines, "    limit_ = (limit < 0 ? 0 : limit);");
  pushLine(lines, "    lowest_prime_.assign(limit_ + 1, 0);");
  pushLine(lines, "    primes_.clear();");
  pushLine(lines);
  pushLine(lines, "    if (limit_ >= 1) {");
  pushLine(lines, "      lowest_prime_[1] = 1;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    for (int i = 2; i <= limit_; ++i) {");
  pushLine(lines, "      if (lowest_prime_[i] == 0) {");
  pushLine(lines, "        lowest_prime_[i] = i;");
  pushLine(lines, "        primes_.push_back(i);");
  pushLine(lines, "      }");
  pushLine(lines, "      for (int p : primes_) {");
  pushLine(lines, "        const long long next = static_cast<long long>(i) * p;");
  pushLine(lines, "        if (next > limit_ || p > lowest_prime_[i]) {");
  pushLine(lines, "          break;");
  pushLine(lines, "        }");
  pushLine(lines, "        lowest_prime_[static_cast<int>(next)] = p;");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int limit() const { return limit_; }");

  if (includeLowestPrime) {
    pushLine(lines);
    pushLine(
      lines,
      "  const std::vector<int>& lowest_prime() const { return lowest_prime_; }"
    );
    pushLine(lines);
    pushLine(lines, "  int lowest_prime_of(int value) const {");
    pushLine(lines, "    if (value < 0 || value > limit_) {");
    pushLine(lines, "      return 0;");
    pushLine(lines, "    }");
    pushLine(lines, "    return lowest_prime_[value];");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  bool is_prime(int value) const {");
    pushLine(
      lines,
      "    return value >= 2 && value <= limit_ && lowest_prime_[value] == value;"
    );
    pushLine(lines, "  }");
  }

  if (includePrimes) {
    pushLine(lines);
    pushLine(lines, "  const std::vector<int>& primes() const { return primes_; }");
  }

  if (includeFactorization) {
    pushLine(lines);
    pushLine(lines, "  std::vector<std::pair<int, int>> factorize(int value) const {");
    pushLine(lines, "    std::vector<std::pair<int, int>> factors;");
    pushLine(lines, "    if (value < 2 || value > limit_) {");
    pushLine(lines, "      return factors;");
    pushLine(lines, "    }");
    pushLine(lines);
    pushLine(lines, "    int x = value;");
    pushLine(lines, "    while (x > 1) {");
    pushLine(lines, "      const int p = lowest_prime_[x];");
    pushLine(lines, "      int exponent = 0;");
    pushLine(lines, "      while (x % p == 0) {");
    pushLine(lines, "        x /= p;");
    pushLine(lines, "        ++exponent;");
    pushLine(lines, "      }");
    pushLine(lines, "      factors.push_back(std::make_pair(p, exponent));");
    pushLine(lines, "    }");
    pushLine(lines, "    return factors;");
    pushLine(lines, "  }");
  }

  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  int limit_;");
  pushLine(lines, "  std::vector<int> lowest_prime_;");
  pushLine(lines, "  std::vector<int> primes_;");
  pushLine(lines, "};");

  if (includeLowestPrime) {
    exports.push(names.lowestPrimeFunctionName);
    pushLine(lines);
    pushLine(
      lines,
      `inline std::vector<int> ${names.lowestPrimeFunctionName}(int limit) {`
    );
    pushLine(lines, `  ${names.className} sieve(limit);`);
    pushLine(lines, "  return sieve.lowest_prime();");
    pushLine(lines, "}");
  }

  if (includePrimes) {
    exports.push(names.primesFunctionName);
    pushLine(lines);
    pushLine(lines, `inline std::vector<int> ${names.primesFunctionName}(int limit) {`);
    pushLine(lines, `  ${names.className} sieve(limit);`);
    pushLine(lines, "  return sieve.primes();");
    pushLine(lines, "}");
  }

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderLinearSieveUsage(options));
  }

  return createRenderedRecipe({ helpers: [lines.join("\n")] }, exports);
}

export function renderLinearSieve(options: LinearSieveOptions): string {
  return composeRecipeSections(renderLinearSieveRecipe(options));
}

export function defaultFenwickOperations(): FenwickOperation[] {
  return ["sum", "xor", "max", "min"];
}

export const SEGMENT_TREE_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/solvers/segtree",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/segtree_beats",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/fenwick",
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
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/sparse_table",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/merge_sort_tree",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/implicit_treap",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/dsu",
  title: "DSU",
  scenarios: [
    {
      id: "connectivity",
      label: "connectivity / components",
      description: "Plain unite, same, component size, and component count."
    },
    {
      id: "kruskal",
      label: "Kruskal skeleton",
      description: "Sort weighted edges and unite components for MST-style problems."
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
        { id: "instance", label: "instance skeleton" },
        { id: "query_loop", label: "query loop skeleton" },
        { id: "kruskal", label: "Kruskal skeleton" }
      ]
    }
  ],
  bindings: [
    { id: "sizeExpression", label: "Node count", kind: "size", required: true },
    { id: "edgeCountName", label: "Edge count", kind: "query_count", required: false },
    { id: "instanceName", label: "Instance name", kind: "answer", required: false },
    { id: "answerName", label: "Answer name", kind: "answer", required: false }
  ],
  usageSections: [
    { id: "helpers", label: "DSU helper", section: "helpers" },
    { id: "usage", label: "DSU usage", section: "solve" }
  ]
};

export const ROLLBACK_DSU_APPLICATION_SPEC: SolverApplicationSpec = {
  path: "/solvers/rollback_dsu",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/lca",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/hld",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/bfs",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/dijkstra",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/toposort",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/kosaraju",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/mo",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/monotonic_stack",
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
  path: "/solvers/gp_hash_table",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/ordered_set",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/set_utils",
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
  path: "/solvers/fast_allocator",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/geometry",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  path: "/solvers/halfplane_intersection",
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
      label: "Usage output",
      choices: [
        { id: "helper_only", label: "helper only" },
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
  if ((options.usageMode ?? "helper_only") === "helper_only") {
    return "";
  }

  const op = primaryFenwickOperation(options);
  const type = fenwickValueType(options);
  const size = fenwickSizeExpression(options);
  const instance = fenwickInstanceName(options);
  const source = options.sourceName?.trim() || "a";
  const answer = options.answerName?.trim() || "ans";
  const alias = fenwickAliasForOperation(options.names, op);
  const oneBasedAdjust = options.indexing === "one_based_input" ? "--idx;" : "";
  const lines: string[] = [];

  if (options.application === "range_sum") {
    pushLine(lines, `${options.names.rangeClassName}<${type}> ${instance}(${size});`);
    if (options.usageMode === "query_loop") {
      pushLine(lines, "for (int qi = 0; qi < q; ++qi) {");
      pushLine(lines, "  int type, l, r;");
      pushLine(lines, `  ${type} x;`);
      pushLine(lines, "  cin >> type >> l >> r;");
      if (options.indexing === "one_based_input") {
        pushLine(lines, "  --l; --r;");
      }
      pushLine(lines, "  if (type == 1) {");
      pushLine(lines, "    cin >> x;");
      pushLine(lines, `    ${instance}.add(l, r, x);`);
      pushLine(lines, "  } else {");
      pushLine(lines, `    cout << ${instance}.sum(l, r) << '\\n';`);
      pushLine(lines, "  }");
      pushLine(lines, "}");
    }
    return lines.join("\n");
  }

  pushLine(lines, `${alias}<${type}> ${instance}(${size});`);
  if (options.application === "range_point") {
    if (options.usageMode === "query_loop") {
      pushLine(lines, "for (int qi = 0; qi < q; ++qi) {");
      pushLine(lines, "  int type, l, r, idx;");
      pushLine(lines, `  ${type} x;`);
      pushLine(lines, "  cin >> type;");
      pushLine(lines, "  if (type == 1) {");
      pushLine(lines, "    cin >> l >> r >> x;");
      if (options.indexing === "one_based_input") {
        pushLine(lines, "    --l; --r;");
      }
      pushLine(lines, `    ${instance}.add(l, x);`);
      pushLine(lines, `    ${instance}.add(r + 1, -x);`);
      pushLine(lines, "  } else {");
      pushLine(lines, "    cin >> idx;");
      if (options.indexing === "one_based_input") {
        pushLine(lines, "    --idx;");
      }
      pushLine(lines, `    cout << ${instance}.prefix(idx) << '\\n';`);
      pushLine(lines, "  }");
      pushLine(lines, "}");
    }
    return lines.join("\n");
  }

  if (options.sourceMode === "existing_vector") {
    pushLine(lines, `for (int i = 0; i < (int)${source}.size(); ++i) {`);
    pushLine(lines, `  ${instance}.add(i, ${source}[i]);`);
    pushLine(lines, "}");
  } else if (options.sourceMode === "read_loop") {
    pushLine(lines, `for (int i = 0; i < ${size}; ++i) {`);
    pushLine(lines, `  ${type} x;`);
    pushLine(lines, "  cin >> x;");
    pushLine(lines, `  ${instance}.add(i, x);`);
    pushLine(lines, "}");
  }

  if (options.application === "inversion_count") {
    pushLine(lines, `${type} ${answer} = 0;`);
    pushLine(lines, `for (int i = (int)${source}.size() - 1; i >= 0; --i) {`);
    pushLine(lines, `  ${answer} += ${instance}.prefix(${source}[i] - 1);`);
    pushLine(lines, `  ${instance}.add(${source}[i], 1);`);
    pushLine(lines, "}");
  } else if (options.usageMode === "query_loop") {
    pushLine(lines, "for (int qi = 0; qi < q; ++qi) {");
    pushLine(lines, "  int type, idx;");
    pushLine(lines, `  ${type} x;`);
    pushLine(lines, "  cin >> type >> idx;");
    if (oneBasedAdjust !== "") {
      pushLine(lines, `  ${oneBasedAdjust}`);
    }
    pushLine(lines, "  if (type == 1) {");
    pushLine(lines, "    cin >> x;");
    pushLine(lines, `    ${instance}.add(idx, x);`);
    pushLine(lines, "  } else {");
    pushLine(lines, `    cout << ${instance}.prefix(idx) << '\\n';`);
    pushLine(lines, "  }");
    pushLine(lines, "}");
  }

  return lines.join("\n");
}

function renderFenwickUsage(options: FenwickOptions): string {
  const names = options.names;
  const lines = ["/*", "Example:"];

  if (hasFenwickOperation(options, "sum")) {
    lines.push(`${names.sumAliasName}<long long> fw(n);`);
    lines.push("fw.add(i, value);");
    lines.push("auto pref = fw.prefix(r);");
    lines.push("auto range = fw.segment(l, r);");
    lines.push("auto first = fw.descend(target_prefix);");
  } else if (hasFenwickOperation(options, "max")) {
    lines.push(`${names.maxAliasName}<int> fw(n, -1000000007);`);
    lines.push("fw.add(i, value);");
    lines.push("auto pref_max = fw.prefix(r);");
    lines.push("auto first_gt = fw.descend(target);");
  } else if (hasFenwickOperation(options, "min")) {
    lines.push(`${names.minAliasName}<int> fw(n, 1000000007);`);
    lines.push("fw.add(i, value);");
    lines.push("auto pref_min = fw.prefix(r);");
  } else if (hasFenwickOperation(options, "xor")) {
    lines.push(`${names.xorAliasName}<int> fw(n);`);
    lines.push("fw.add(i, value);");
    lines.push("auto pref_xor = fw.prefix(r);");
    lines.push("auto range_xor = fw.segment(l, r);");
  } else {
    lines.push(`${names.className}<long long, CustomOp> fw(n);`);
  }

  lines.push("*/");
  return lines.join("\n");
}

export function renderFenwickRecipe(options: FenwickOptions): RenderedRecipe {
  const names = options.names;
  const lines: string[] = [];
  const exports: string[] = [];
  const includeSum = hasFenwickOperation(options, "sum");
  const includeXor = hasFenwickOperation(options, "xor");
  const includeMax = hasFenwickOperation(options, "max");
  const includeMin = hasFenwickOperation(options, "min");
  const includeCustom = hasFenwickOperation(options, "custom");
  const includeCustomInvertible = hasFenwickOperation(options, "custom_invertible");

  if (includeSum) {
    exports.push(names.sumOpName);
    pushLine(lines, "template <typename T>");
    pushLine(lines, `struct ${names.sumOpName} {`);
    pushLine(lines, "  static constexpr bool kHasInverse = true;");
    pushLine(lines, "  static constexpr bool kHasDescend = true;");
    pushLine(lines);
    pushLine(lines, "  static T default_neutral() { return T(0); }");
    pushLine(lines, "  static T combine(const T& lhs, const T& rhs) { return lhs + rhs; }");
    pushLine(lines, "  static T inverse(const T& total, const T& prefix) { return total - prefix; }");
    pushLine(lines, "  static bool descend_should_advance(const T& candidate, const T& target) {");
    pushLine(lines, "    return candidate < target;");
    pushLine(lines, "  }");
    pushLine(lines, "};");
  }

  if (includeXor) {
    if (lines.length > 0) {
      pushLine(lines);
    }
    exports.push(names.xorOpName);
    pushLine(lines, "template <typename T>");
    pushLine(lines, `struct ${names.xorOpName} {`);
    pushLine(lines, "  static constexpr bool kHasInverse = true;");
    pushLine(lines, "  static constexpr bool kHasDescend = false;");
    pushLine(lines);
    pushLine(lines, "  static T default_neutral() { return T(0); }");
    pushLine(lines, "  static T combine(const T& lhs, const T& rhs) { return lhs ^ rhs; }");
    pushLine(lines, "  static T inverse(const T& total, const T& prefix) { return total ^ prefix; }");
    pushLine(lines, "};");
  }

  if (includeMax) {
    if (lines.length > 0) {
      pushLine(lines);
    }
    exports.push(names.maxOpName);
    pushLine(lines, "template <typename T>");
    pushLine(lines, `struct ${names.maxOpName} {`);
    pushLine(lines, "  static constexpr bool kHasInverse = false;");
    pushLine(lines, "  static constexpr bool kHasDescend = true;");
    pushLine(lines);
    pushLine(lines, "  static T default_neutral() { return T(); }");
    pushLine(
      lines,
      "  static T combine(const T& lhs, const T& rhs) { return (lhs < rhs ? rhs : lhs); }"
    );
    pushLine(lines, "  static bool descend_should_advance(const T& candidate, const T& target) {");
    pushLine(lines, "    return !(target < candidate);");
    pushLine(lines, "  }");
    pushLine(lines, "};");
  }

  if (includeMin) {
    if (lines.length > 0) {
      pushLine(lines);
    }
    exports.push(names.minOpName);
    pushLine(lines, "template <typename T>");
    pushLine(lines, `struct ${names.minOpName} {`);
    pushLine(lines, "  static constexpr bool kHasInverse = false;");
    pushLine(lines, "  static constexpr bool kHasDescend = false;");
    pushLine(lines);
    pushLine(lines, "  static T default_neutral() { return T(); }");
    pushLine(
      lines,
      "  static T combine(const T& lhs, const T& rhs) { return (lhs < rhs ? lhs : rhs); }"
    );
    pushLine(lines, "};");
  }

  if (includeCustom) {
    if (lines.length > 0) {
      pushLine(lines);
    }
    exports.push(names.customOpName);
    pushLine(lines, "template <typename T>");
    pushLine(lines, `struct ${names.customOpName} {`);
    pushLine(lines, "  static constexpr bool kHasInverse = false;");
    pushLine(lines, "  static constexpr bool kHasDescend = false;");
    pushLine(lines);
    pushLine(lines, "  static T default_neutral() { return T(); }");
    pushLine(lines, "  static T combine(const T& lhs, const T& rhs) {");
    pushLine(lines, "    // TODO: replace with the associative operation.");
    pushLine(lines, "    return lhs + rhs;");
    pushLine(lines, "  }");
    pushLine(lines, "};");
  }

  if (includeCustomInvertible) {
    if (lines.length > 0) {
      pushLine(lines);
    }
    exports.push(names.customInvertibleOpName);
    pushLine(lines, "template <typename T>");
    pushLine(lines, `struct ${names.customInvertibleOpName} {`);
    pushLine(lines, "  static constexpr bool kHasInverse = true;");
    pushLine(lines, "  static constexpr bool kHasDescend = false;");
    pushLine(lines);
    pushLine(lines, "  static T default_neutral() { return T(); }");
    pushLine(lines, "  static T combine(const T& lhs, const T& rhs) {");
    pushLine(lines, "    // TODO: replace with the associative operation.");
    pushLine(lines, "    return lhs + rhs;");
    pushLine(lines, "  }");
    pushLine(lines, "  static T inverse(const T& total, const T& prefix) {");
    pushLine(lines, "    // TODO: replace with the inverse operation for range queries.");
    pushLine(lines, "    return total - prefix;");
    pushLine(lines, "  }");
    pushLine(lines, "};");
  }

  if (lines.length > 0) {
    pushLine(lines);
  }
  exports.push(names.className);
  pushLine(lines, "template <typename T, typename Op>");
  pushLine(lines, `class ${names.className} {`);
  pushLine(lines, " public:");
  pushLine(
    lines,
    `  explicit ${names.className}(int n = 0, const T& neutral = Op::default_neutral())`
  );
  pushLine(lines, "      : n_(n < 0 ? 0 : n),");
  pushLine(lines, "        maxn_(n_ + 1),");
  pushLine(lines, "        bit_(maxn_, neutral),");
  pushLine(lines, "        neutral_(neutral) {}");
  pushLine(lines);
  pushLine(lines, "  void reset(int n, const T& neutral = Op::default_neutral()) {");
  pushLine(lines, "    n_ = (n < 0 ? 0 : n);");
  pushLine(lines, "    maxn_ = n_ + 1;");
  pushLine(lines, "    neutral_ = neutral;");
  pushLine(lines, "    bit_.assign(maxn_, neutral_);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int size() const { return n_; }");
  pushLine(lines);
  pushLine(lines, "  void add(int idx, const T& value) {");
  pushLine(lines, "    if (idx < 0 || idx >= n_) {");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, "    for (int i = idx + 1; i < maxn_; i += i & -i) {");
  pushLine(lines, "      bit_[i] = Op::combine(bit_[i], value);");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  T prefix(int idx) const {");
  pushLine(lines, "    if (idx < 0) {");
  pushLine(lines, "      return neutral_;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (idx >= n_) {");
  pushLine(lines, "      idx = n_ - 1;");
  pushLine(lines, "    }");
  pushLine(lines, "    T result = neutral_;");
  pushLine(lines, "    for (int i = idx + 1; i > 0; i -= i & -i) {");
  pushLine(lines, "      result = Op::combine(result, bit_[i]);");
  pushLine(lines, "    }");
  pushLine(lines, "    return result;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  T segment(int left, int right) const {");
  pushLine(lines, "    static_assert(Op::kHasInverse,");
  pushLine(lines, "                  \"segment query requires an invertible operation\");");
  pushLine(lines, "    if (left > right) {");
  pushLine(lines, "      return neutral_;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (right < 0 || left >= n_) {");
  pushLine(lines, "      return neutral_;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (left < 0) {");
  pushLine(lines, "      left = 0;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (right >= n_) {");
  pushLine(lines, "      right = n_ - 1;");
  pushLine(lines, "    }");
  pushLine(lines, "    return Op::inverse(prefix(right), prefix(left - 1));");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int descend(const T& target) const {");
  pushLine(lines, "    static_assert(Op::kHasDescend,");
  pushLine(lines, "                  \"descend is not defined for this operation\");");
  pushLine(lines, "    if (n_ == 0) {");
  pushLine(lines, "      return 0;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    int pos = 0;");
  pushLine(lines, "    T accumulated = neutral_;");
  pushLine(lines);
  pushLine(lines, "    int pw = 1;");
  pushLine(lines, "    while ((pw << 1) < maxn_) {");
  pushLine(lines, "      pw <<= 1;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    for (; pw > 0; pw >>= 1) {");
  pushLine(lines, "      const int next = pos + pw;");
  pushLine(lines, "      if (next >= maxn_) {");
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines, "      const T candidate = Op::combine(accumulated, bit_[next]);");
  pushLine(lines, "      if (Op::descend_should_advance(candidate, target)) {");
  pushLine(lines, "        pos = next;");
  pushLine(lines, "        accumulated = candidate;");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "    return pos;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  int n_;");
  pushLine(lines, "  int maxn_;");
  pushLine(lines, "  std::vector<T> bit_;");
  pushLine(lines, "  T neutral_;");
  pushLine(lines, "};");

  const pushAlias = (operation: boolean, aliasName: string, opName: string) => {
    if (!operation) {
      return;
    }
    exports.push(aliasName);
    pushLine(lines);
    pushLine(lines, "template <typename T>");
    pushLine(lines, `using ${aliasName} = ${names.className}<T, ${opName}<T>>;`);
  };

  pushAlias(includeSum, names.sumAliasName, names.sumOpName);
  pushAlias(includeXor, names.xorAliasName, names.xorOpName);
  pushAlias(includeMax, names.maxAliasName, names.maxOpName);
  pushAlias(includeMin, names.minAliasName, names.minOpName);
  pushAlias(includeCustom, names.customAliasName, names.customOpName);
  pushAlias(
    includeCustomInvertible,
    names.customInvertibleAliasName,
    names.customInvertibleOpName
  );

  if (options.application === "range_sum") {
    exports.push(names.rangeClassName);
    pushLine(lines);
    pushLine(lines, "template <typename T>");
    pushLine(lines, `class ${names.rangeClassName} {`);
    pushLine(lines, " public:");
    pushLine(lines, `  explicit ${names.rangeClassName}(int n = 0) : bit1_(n), bit2_(n) {}`);
    pushLine(lines);
    pushLine(lines, "  void reset(int n) {");
    pushLine(lines, "    bit1_.reset(n);");
    pushLine(lines, "    bit2_.reset(n);");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  void add(int left, int right, const T& value) {");
    pushLine(lines, "    add_prefix(left, value);");
    pushLine(lines, "    add_prefix(right + 1, -value);");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  T prefix(int idx) const {");
    pushLine(lines, "    return bit1_.prefix(idx) * static_cast<T>(idx + 1) - bit2_.prefix(idx);");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  T sum(int left, int right) const {");
    pushLine(lines, "    return prefix(right) - prefix(left - 1);");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, " private:");
    pushLine(lines, "  void add_prefix(int idx, const T& value) {");
    pushLine(lines, "    if (idx >= bit1_.size()) {");
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(lines, "    bit1_.add(idx, value);");
    pushLine(lines, "    bit2_.add(idx, value * static_cast<T>(idx));");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, `  ${names.sumAliasName}<T> bit1_;`);
    pushLine(lines, `  ${names.sumAliasName}<T> bit2_;`);
    pushLine(lines, "};");
  }

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderFenwickUsage(options));
  }

  const usage = renderFenwickUsageSnippet(options);
  return createRenderedRecipe(
    usage === "" ? { helpers: [lines.join("\n")] } : { helpers: [lines.join("\n")], solve: [usage] },
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
    mode: "both",
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
  const names = options.names;
  const lines = ["/*", "Example:"];

  if (includeStaticModInt(options)) {
    lines.push(`using Mint = ${names.staticClassName}<1000000007>;`);
    lines.push("Mint a = 2;");
    lines.push("auto b = a.pow(10);");
  }

  if (includeDynamicModInt(options)) {
    lines.push(`${names.dynamicClassName}::set_mod(998244353);`);
    lines.push(`${names.dynamicClassName} x = 5;`);
    lines.push("auto inv = x.inv();");
  }

  lines.push("*/");
  return lines.join("\n");
}

function pushStaticModInt(lines: string[], className: string): void {
  pushLine(lines, "template <int MOD>");
  pushLine(lines, `class ${className} {`);
  pushLine(lines, " public:");
  pushLine(lines, "  static_assert(MOD > 0, \"MOD must be positive\");");
  pushLine(lines);
  pushLine(lines, `  ${className}() : value_(0) {}`);
  pushLine(lines);
  pushLine(lines, "  template <typename T>");
  pushLine(
    lines,
    `  ${className}(T value) : value_(normalize(static_cast<long long>(value))) {}`
  );
  pushLine(lines);
  pushLine(lines, "  static constexpr int mod() { return MOD; }");
  pushLine(lines);
  pushLine(lines, "  int value() const { return value_; }");
  pushLine(lines);
  pushLine(lines, `  static ${className} raw(int value) {`);
  pushLine(lines, `    ${className} result;`);
  pushLine(lines, "    result.value_ = value;");
  pushLine(lines, "    return result;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  template <typename T>");
  pushLine(lines, `  ${className}& set(T value) {`);
  pushLine(lines, "    value_ = normalize(static_cast<long long>(value));");
  pushLine(lines, "    return *this;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${className} operator+() const { return *this; }`);
  pushLine(lines);
  pushLine(lines, `  ${className} operator-() const {`);
  pushLine(
    lines,
    `    return (value_ == 0 ? ${className}(0) : ${className}::raw(MOD - value_));`
  );
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${className}& operator+=(const ${className}& rhs) {`);
  pushLine(lines, "    value_ += rhs.value_;");
  pushLine(lines, "    if (value_ >= MOD) {");
  pushLine(lines, "      value_ -= MOD;");
  pushLine(lines, "    }");
  pushLine(lines, "    return *this;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${className}& operator-=(const ${className}& rhs) {`);
  pushLine(lines, "    value_ -= rhs.value_;");
  pushLine(lines, "    if (value_ < 0) {");
  pushLine(lines, "      value_ += MOD;");
  pushLine(lines, "    }");
  pushLine(lines, "    return *this;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${className}& operator*=(const ${className}& rhs) {`);
  pushLine(lines, "    value_ = static_cast<int>(");
  pushLine(lines, "        (static_cast<long long>(value_) * rhs.value_) % MOD);");
  pushLine(lines, "    return *this;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${className}& operator/=(const ${className}& rhs) {`);
  pushLine(lines, "    return (*this) *= rhs.inv();");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${className} pow(long long exponent) const {`);
  pushLine(lines, `    ${className} base = *this;`);
  pushLine(lines, "    long long exp = exponent;");
  pushLine(lines, "    if (exp < 0) {");
  pushLine(lines, "      base = base.inv();");
  pushLine(lines, "      exp = -exp;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, `    ${className} result(1);`);
  pushLine(lines, "    while (exp > 0) {");
  pushLine(lines, "      if (exp & 1LL) {");
  pushLine(lines, "        result *= base;");
  pushLine(lines, "      }");
  pushLine(lines, "      base *= base;");
  pushLine(lines, "      exp >>= 1LL;");
  pushLine(lines, "    }");
  pushLine(lines, "    return result;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  bool has_inverse() const {");
  pushLine(lines, "    return positive_gcd(static_cast<long long>(value_),");
  pushLine(lines, "                        static_cast<long long>(MOD)) == 1;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  bool try_inv(${className}& out) const {`);
  pushLine(lines, "    long long x = 0;");
  pushLine(lines, "    long long y = 0;");
  pushLine(lines, "    const long long g = extended_gcd(static_cast<long long>(value_),");
  pushLine(lines, "                                     static_cast<long long>(MOD), x, y);");
  pushLine(lines, "    if (g != 1) {");
  pushLine(lines, `      out = ${className}(0);`);
  pushLine(lines, "      return false;");
  pushLine(lines, "    }");
  pushLine(lines, "    x %= MOD;");
  pushLine(lines, "    if (x < 0) {");
  pushLine(lines, "      x += MOD;");
  pushLine(lines, "    }");
  pushLine(lines, `    out = ${className}::raw(static_cast<int>(x));`);
  pushLine(lines, "    return true;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${className} inv() const {`);
  pushLine(lines, `    ${className} result(0);`);
  pushLine(lines, "    try_inv(result);");
  pushLine(lines, "    return result;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  friend ${className} operator+(${className} lhs, const ${className}& rhs) {`);
  pushLine(lines, "    lhs += rhs;");
  pushLine(lines, "    return lhs;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  friend ${className} operator-(${className} lhs, const ${className}& rhs) {`);
  pushLine(lines, "    lhs -= rhs;");
  pushLine(lines, "    return lhs;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  friend ${className} operator*(${className} lhs, const ${className}& rhs) {`);
  pushLine(lines, "    lhs *= rhs;");
  pushLine(lines, "    return lhs;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  friend ${className} operator/(${className} lhs, const ${className}& rhs) {`);
  pushLine(lines, "    lhs /= rhs;");
  pushLine(lines, "    return lhs;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  friend bool operator==(const ${className}& lhs, const ${className}& rhs) {`
  );
  pushLine(lines, "    return lhs.value_ == rhs.value_;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  friend bool operator!=(const ${className}& lhs, const ${className}& rhs) {`
  );
  pushLine(lines, "    return lhs.value_ != rhs.value_;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  int value_;");
  pushLine(lines);
  pushLine(lines, "  static int normalize(long long value) {");
  pushLine(lines, "    value %= MOD;");
  pushLine(lines, "    if (value < 0) {");
  pushLine(lines, "      value += MOD;");
  pushLine(lines, "    }");
  pushLine(lines, "    return static_cast<int>(value);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushModIntGcdHelpers(lines);
  pushLine(lines, "};");
}

function pushDynamicModInt(
  lines: string[],
  className: string,
  defaultModExpression: string
): void {
  pushLine(lines, `class ${className} {`);
  pushLine(lines, " public:");
  pushLine(lines, `  ${className}() : value_(0) {}`);
  pushLine(lines);
  pushLine(lines, "  template <typename T>");
  pushLine(
    lines,
    `  ${className}(T value) : value_(normalize(static_cast<long long>(value))) {}`
  );
  pushLine(lines);
  pushLine(lines, "  static int mod() { return modulus_ref(); }");
  pushLine(lines);
  pushLine(lines, "  static void set_mod(int mod_value) {");
  pushLine(lines, "    modulus_ref() = (mod_value > 0 ? mod_value : 1);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int value() const { return value_; }");
  pushLine(lines);
  pushLine(lines, `  static ${className} raw(int value) {`);
  pushLine(lines, `    ${className} result;`);
  pushLine(lines, "    result.value_ = value;");
  pushLine(lines, "    return result;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  template <typename T>");
  pushLine(lines, `  ${className}& set(T value) {`);
  pushLine(lines, "    value_ = normalize(static_cast<long long>(value));");
  pushLine(lines, "    return *this;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${className} operator+() const { return *this; }`);
  pushLine(lines);
  pushLine(lines, `  ${className} operator-() const {`);
  pushLine(
    lines,
    `    return value_ == 0 ? ${className}(0) : ${className}::raw(mod() - value_);`
  );
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${className}& operator+=(const ${className}& rhs) {`);
  pushLine(lines, "    const int m = mod();");
  pushLine(lines, "    value_ += rhs.value_;");
  pushLine(lines, "    if (value_ >= m) {");
  pushLine(lines, "      value_ -= m;");
  pushLine(lines, "    }");
  pushLine(lines, "    return *this;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${className}& operator-=(const ${className}& rhs) {`);
  pushLine(lines, "    const int m = mod();");
  pushLine(lines, "    value_ -= rhs.value_;");
  pushLine(lines, "    if (value_ < 0) {");
  pushLine(lines, "      value_ += m;");
  pushLine(lines, "    }");
  pushLine(lines, "    return *this;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${className}& operator*=(const ${className}& rhs) {`);
  pushLine(lines, "    value_ = static_cast<int>(");
  pushLine(lines, "        (static_cast<long long>(value_) * rhs.value_) % mod());");
  pushLine(lines, "    return *this;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${className}& operator/=(const ${className}& rhs) {`);
  pushLine(lines, "    return (*this) *= rhs.inv();");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${className} pow(long long exponent) const {`);
  pushLine(lines, `    ${className} base = *this;`);
  pushLine(lines, "    long long exp = exponent;");
  pushLine(lines, "    if (exp < 0) {");
  pushLine(lines, "      base = base.inv();");
  pushLine(lines, "      exp = -exp;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, `    ${className} result(1);`);
  pushLine(lines, "    while (exp > 0) {");
  pushLine(lines, "      if (exp & 1LL) {");
  pushLine(lines, "        result *= base;");
  pushLine(lines, "      }");
  pushLine(lines, "      base *= base;");
  pushLine(lines, "      exp >>= 1LL;");
  pushLine(lines, "    }");
  pushLine(lines, "    return result;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  bool has_inverse() const {");
  pushLine(lines, "    return positive_gcd(static_cast<long long>(value_),");
  pushLine(lines, "                        static_cast<long long>(mod())) == 1;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  bool try_inv(${className}& out) const {`);
  pushLine(lines, "    const int m = mod();");
  pushLine(lines, "    long long x = 0;");
  pushLine(lines, "    long long y = 0;");
  pushLine(lines, "    const long long g = extended_gcd(static_cast<long long>(value_),");
  pushLine(lines, "                                     static_cast<long long>(m), x, y);");
  pushLine(lines, "    if (g != 1) {");
  pushLine(lines, `      out = ${className}(0);`);
  pushLine(lines, "      return false;");
  pushLine(lines, "    }");
  pushLine(lines, "    x %= m;");
  pushLine(lines, "    if (x < 0) {");
  pushLine(lines, "      x += m;");
  pushLine(lines, "    }");
  pushLine(lines, `    out = ${className}::raw(static_cast<int>(x));`);
  pushLine(lines, "    return true;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${className} inv() const {`);
  pushLine(lines, `    ${className} result(0);`);
  pushLine(lines, "    try_inv(result);");
  pushLine(lines, "    return result;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  friend ${className} operator+(${className} lhs, const ${className}& rhs) {`);
  pushLine(lines, "    lhs += rhs;");
  pushLine(lines, "    return lhs;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  friend ${className} operator-(${className} lhs, const ${className}& rhs) {`);
  pushLine(lines, "    lhs -= rhs;");
  pushLine(lines, "    return lhs;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  friend ${className} operator*(${className} lhs, const ${className}& rhs) {`);
  pushLine(lines, "    lhs *= rhs;");
  pushLine(lines, "    return lhs;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  friend ${className} operator/(${className} lhs, const ${className}& rhs) {`);
  pushLine(lines, "    lhs /= rhs;");
  pushLine(lines, "    return lhs;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  friend bool operator==(const ${className}& lhs, const ${className}& rhs) {`
  );
  pushLine(lines, "    return lhs.value_ == rhs.value_;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  friend bool operator!=(const ${className}& lhs, const ${className}& rhs) {`
  );
  pushLine(lines, "    return lhs.value_ != rhs.value_;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  int value_;");
  pushLine(lines);
  pushLine(lines, "  static int normalize(long long value) {");
  pushLine(lines, "    const int m = mod();");
  pushLine(lines, "    value %= m;");
  pushLine(lines, "    if (value < 0) {");
  pushLine(lines, "      value += m;");
  pushLine(lines, "    }");
  pushLine(lines, "    return static_cast<int>(value);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  static int& modulus_ref() {");
  pushLine(lines, `    static int value = ${defaultModExpression};`);
  pushLine(lines, "    return value;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushModIntGcdHelpers(lines);
  pushLine(lines, "};");
}

function pushModIntGcdHelpers(lines: string[]): void {
  pushLine(lines, "  static long long positive_gcd(long long a, long long b) {");
  pushLine(lines, "    if (a < 0) {");
  pushLine(lines, "      a = -a;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (b < 0) {");
  pushLine(lines, "      b = -b;");
  pushLine(lines, "    }");
  pushLine(lines, "    while (b != 0) {");
  pushLine(lines, "      const long long t = a % b;");
  pushLine(lines, "      a = b;");
  pushLine(lines, "      b = t;");
  pushLine(lines, "    }");
  pushLine(lines, "    return a;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  static long long extended_gcd(long long a, long long b, long long& x,");
  pushLine(lines, "                                long long& y) {");
  pushLine(lines, "    if (a == 0) {");
  pushLine(lines, "      x = 0;");
  pushLine(lines, "      y = 1;");
  pushLine(lines, "      return b;");
  pushLine(lines, "    }");
  pushLine(lines, "    long long x1 = 0;");
  pushLine(lines, "    long long y1 = 0;");
  pushLine(lines, "    const long long g = extended_gcd(b % a, a, x1, y1);");
  pushLine(lines, "    x = y1 - (b / a) * x1;");
  pushLine(lines, "    y = x1;");
  pushLine(lines, "    return g;");
  pushLine(lines, "  }");
}

export function renderModIntRecipe(options: ModIntOptions): RenderedRecipe {
  const lines: string[] = [];
  const exports: string[] = [];

  if (includeStaticModInt(options)) {
    exports.push(options.names.staticClassName);
    pushStaticModInt(lines, options.names.staticClassName);
  }

  if (includeDynamicModInt(options)) {
    if (lines.length > 0) {
      pushLine(lines);
    }
    exports.push(options.names.dynamicClassName);
    pushDynamicModInt(
      lines,
      options.names.dynamicClassName,
      options.dynamicDefaultModExpression
    );
  }

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderModIntUsage(options));
  }

  return createRenderedRecipe({ helpers: [lines.join("\n")] }, exports);
}

export function renderModInt(options: ModIntOptions): string {
  return composeRecipeSections(renderModIntRecipe(options));
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
  const names = options.names;
  const lines = ["/*", "Example:"];
  lines.push(`${names.className} sat(n);`);
  lines.push(`sat.${names.addOrName}(a, true, b, false);`);
  lines.push(`sat.${names.addImplicationName}(a, true, c, true);`);
  if (features.has("xor")) {
    lines.push(`sat.${names.addXorName}(x, true, y, true);`);
  }
  if (features.has("equal")) {
    lines.push(`sat.${names.addEqualName}(u, true, v, true);`);
  }
  if (features.has("force")) {
    lines.push(`sat.${names.addTrueName}(forced_var);`);
  }
  lines.push(`if (sat.${names.solveName}()) {`);
  lines.push(`  auto assign = sat.${names.assignmentName}();`);
  lines.push("}");
  lines.push("*/");
  return lines.join("\n");
}

export function renderTwoSatRecipe(options: TwoSatOptions): RenderedRecipe {
  const names = options.names;
  const features = twoSatFeatureSet(options.features);
  const lines: string[] = [];

  pushLine(lines, `class ${names.className} {`);
  pushLine(lines, " public:");
  pushLine(
    lines,
    `  explicit ${names.className}(int variables = 0) { ${names.resetName}(variables); }`
  );
  pushLine(lines);
  pushLine(lines, `  void ${names.resetName}(int variables) {`);
  pushLine(lines, "    variables_ = variables < 0 ? 0 : variables;");
  pushLine(
    lines,
    `    ${names.graphFieldName}.assign(2 * variables_, std::vector<int>());`
  );
  pushLine(lines, `    ${names.assignmentFieldName}.assign(variables_, false);`);
  if (features.has("components")) {
    pushLine(lines, `    ${names.componentFieldName}.assign(2 * variables_, -1);`);
  }
  pushLine(lines, "    solved_ = false;");
  pushLine(lines, "    satisfiable_ = false;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int size() const { return variables_; }");
  pushLine(lines);
  pushLine(
    lines,
    `  void ${names.addOrName}(int a, bool a_value, int b, bool b_value) {`
  );
  pushLine(lines, `    if (!${names.okVarName}(a) || !${names.okVarName}(b)) {`);
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, `    ${names.addDirectName}(a, !a_value, b, b_value);`);
  pushLine(lines, `    ${names.addDirectName}(b, !b_value, a, a_value);`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  void ${names.addImplicationName}(int a, bool a_value, int b, bool b_value) {`
  );
  pushLine(lines, `    if (!${names.okVarName}(a) || !${names.okVarName}(b)) {`);
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, `    ${names.addDirectName}(a, a_value, b, b_value);`);
  pushLine(lines, `    ${names.addDirectName}(b, !b_value, a, !a_value);`);
  pushLine(lines, "  }");

  if (features.has("xor")) {
    pushLine(lines);
    pushLine(
      lines,
      `  void ${names.addXorName}(int a, bool a_value, int b, bool b_value) {`
    );
    pushLine(lines, `    ${names.addOrName}(a, a_value, b, b_value);`);
    pushLine(lines, `    ${names.addOrName}(a, !a_value, b, !b_value);`);
    pushLine(lines, "  }");
  }

  if (features.has("equal")) {
    pushLine(lines);
    pushLine(
      lines,
      `  void ${names.addEqualName}(int a, bool a_value, int b, bool b_value) {`
    );
    pushLine(lines, `    ${names.addOrName}(a, a_value, b, !b_value);`);
    pushLine(lines, `    ${names.addOrName}(a, !a_value, b, b_value);`);
    pushLine(lines, "  }");
  }

  if (features.has("force")) {
    pushLine(lines);
    pushLine(lines, `  void ${names.addTrueName}(int var, bool value = true) {`);
    pushLine(lines, `    if (${names.okVarName}(var)) {`);
    pushLine(lines, `      ${names.addDirectName}(var, !value, var, value);`);
    pushLine(lines, "    }");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, `  void ${names.addFalseName}(int var) {`);
    pushLine(lines, `    ${names.addTrueName}(var, false);`);
    pushLine(lines, "  }");
  }

  if (features.has("at_most_one")) {
    pushLine(lines);
    pushLine(
      lines,
      `  void ${names.addAtMostOneName}(const std::vector<int>& vars) {`
    );
    pushLine(lines, "    for (int i = 0; i < static_cast<int>(vars.size()); ++i) {");
    pushLine(lines, "      for (int j = i + 1; j < static_cast<int>(vars.size()); ++j) {");
    pushLine(lines, `        ${names.addOrName}(vars[i], false, vars[j], false);`);
    pushLine(lines, "      }");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
  }

  pushLine(lines);
  pushLine(lines, `  bool ${names.solveName}() {`);
  pushLine(lines, "    solved_ = true;");
  pushLine(lines, "    satisfiable_ = true;");
  pushLine(lines, `    ${names.assignmentFieldName}.assign(variables_, false);`);
  pushLine(lines);
  pushLine(
    lines,
    `    const std::vector<int> comp = ${names.sccName}();`
  );
  if (features.has("components")) {
    pushLine(lines, `    ${names.componentFieldName} = comp;`);
  }
  pushLine(lines, "    int components = 0;");
  pushLine(lines, "    for (int x : comp) {");
  pushLine(lines, "      components = std::max(components, x + 1);");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    for (int var = 0; var < variables_; ++var) {");
  pushLine(
    lines,
    `      if (comp[${names.nodeName}(var, true)] == comp[${names.nodeName}(var, false)]) {`
  );
  pushLine(lines, "        satisfiable_ = false;");
  pushLine(
    lines,
    `        ${names.assignmentFieldName}.assign(variables_, false);`
  );
  pushLine(lines, "        return false;");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    std::vector<std::vector<int>> dag(components);");
  pushLine(lines, "    std::vector<int> indegree(components, 0);");
  pushLine(lines, `    for (int v = 0; v < static_cast<int>(${names.graphFieldName}.size()); ++v) {`);
  pushLine(lines, `      for (int to : ${names.graphFieldName}[v]) {`);
  pushLine(lines, "        const int a = comp[v];");
  pushLine(lines, "        const int b = comp[to];");
  pushLine(lines, "        if (a != b) {");
  pushLine(lines, "          dag[a].push_back(b);");
  pushLine(lines, "        }");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "    for (int v = 0; v < components; ++v) {");
  pushLine(lines, "      std::sort(dag[v].begin(), dag[v].end());");
  pushLine(lines, "      dag[v].resize(std::unique(dag[v].begin(), dag[v].end()) - dag[v].begin());");
  pushLine(lines, "      for (int to : dag[v]) {");
  pushLine(lines, "        ++indegree[to];");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    std::vector<int> q;");
  pushLine(lines, "    q.reserve(components);");
  pushLine(lines, "    for (int i = 0; i < components; ++i) {");
  pushLine(lines, "      if (indegree[i] == 0) {");
  pushLine(lines, "        q.push_back(i);");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "    std::vector<int> rank(components, 0);");
  pushLine(lines, "    for (int i = 0; i < static_cast<int>(q.size()); ++i) {");
  pushLine(lines, "      const int v = q[i];");
  pushLine(lines, "      rank[v] = i;");
  pushLine(lines, "      for (int to : dag[v]) {");
  pushLine(lines, "        if (--indegree[to] == 0) {");
  pushLine(lines, "          q.push_back(to);");
  pushLine(lines, "        }");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    for (int var = 0; var < variables_; ++var) {");
  pushLine(
    lines,
    `      ${names.assignmentFieldName}[var] = rank[comp[${names.nodeName}(var, true)]] > rank[comp[${names.nodeName}(var, false)]];`
  );
  pushLine(lines, "    }");
  pushLine(lines, "    return true;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  bool solved() const { return solved_; }");
  pushLine(lines);
  pushLine(lines, "  bool satisfiable() const { return solved_ && satisfiable_; }");
  pushLine(lines);
  pushLine(lines, `  bool ${names.valueName}(int var) const {`);
  pushLine(
    lines,
    `    return ${names.okVarName}(var) && satisfiable() ? ${names.assignmentFieldName}[var] : false;`
  );
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  const std::vector<bool>& ${names.assignmentName}() const {`
  );
  pushLine(lines, `    return ${names.assignmentFieldName};`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  const std::vector<std::vector<int>>& ${names.implicationGraphName}() const {`
  );
  pushLine(lines, `    return ${names.graphFieldName};`);
  pushLine(lines, "  }");

  if (features.has("components")) {
    pushLine(lines);
    pushLine(lines, `  int ${names.componentName}(int var, bool value) const {`);
    pushLine(
      lines,
      `    return ${names.okVarName}(var) && solved_ ? ${names.componentFieldName}[${names.nodeName}(var, value)] : -1;`
    );
    pushLine(lines, "  }");
  }

  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  int variables_;");
  pushLine(lines, `  std::vector<std::vector<int>> ${names.graphFieldName};`);
  pushLine(lines, `  std::vector<bool> ${names.assignmentFieldName};`);
  if (features.has("components")) {
    pushLine(lines, `  std::vector<int> ${names.componentFieldName};`);
  }
  pushLine(lines, "  bool solved_;");
  pushLine(lines, "  bool satisfiable_;");
  pushLine(lines);
  pushLine(
    lines,
    `  bool ${names.okVarName}(int var) const { return var >= 0 && var < variables_; }`
  );
  pushLine(lines);
  pushLine(
    lines,
    `  static int ${names.nodeName}(int var, bool value) { return 2 * var + (value ? 0 : 1); }`
  );
  pushLine(lines);
  pushLine(
    lines,
    `  void ${names.addDirectName}(int a, bool a_value, int b, bool b_value) {`
  );
  pushLine(
    lines,
    `    ${names.graphFieldName}[${names.nodeName}(a, a_value)].push_back(${names.nodeName}(b, b_value));`
  );
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  std::vector<int> ${names.sccName}() const {`);
  pushLine(lines, `    const int n = static_cast<int>(${names.graphFieldName}.size());`);
  pushLine(lines, "    std::vector<std::vector<int>> rev(n);");
  pushLine(lines, "    for (int v = 0; v < n; ++v) {");
  pushLine(lines, `      for (int to : ${names.graphFieldName}[v]) {`);
  pushLine(lines, "        rev[to].push_back(v);");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    std::vector<char> used(n, 0);");
  pushLine(lines, "    std::vector<int> order;");
  pushLine(lines, "    order.reserve(n);");
  pushLine(lines, "    for (int start = 0; start < n; ++start) {");
  pushLine(lines, "      if (used[start]) {");
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines, "      std::vector<std::pair<int, int>> stack;");
  pushLine(lines, "      stack.push_back({start, 0});");
  pushLine(lines, "      used[start] = 1;");
  pushLine(lines, "      while (!stack.empty()) {");
  pushLine(lines, "        int v = stack.back().first;");
  pushLine(lines, "        int& idx = stack.back().second;");
  pushLine(
    lines,
    `        if (idx < static_cast<int>(${names.graphFieldName}[v].size())) {`
  );
  pushLine(lines, `          const int to = ${names.graphFieldName}[v][idx++];`);
  pushLine(lines, "          if (!used[to]) {");
  pushLine(lines, "            used[to] = 1;");
  pushLine(lines, "            stack.push_back({to, 0});");
  pushLine(lines, "          }");
  pushLine(lines, "        } else {");
  pushLine(lines, "          order.push_back(v);");
  pushLine(lines, "          stack.pop_back();");
  pushLine(lines, "        }");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    std::vector<int> comp(n, -1);");
  pushLine(lines, "    int comp_id = 0;");
  pushLine(lines, "    for (int i = n - 1; i >= 0; --i) {");
  pushLine(lines, "      const int start = order[i];");
  pushLine(lines, "      if (comp[start] != -1) {");
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines, "      std::vector<int> stack(1, start);");
  pushLine(lines, "      comp[start] = comp_id;");
  pushLine(lines, "      while (!stack.empty()) {");
  pushLine(lines, "        const int v = stack.back();");
  pushLine(lines, "        stack.pop_back();");
  pushLine(lines, "        for (int to : rev[v]) {");
  pushLine(lines, "          if (comp[to] == -1) {");
  pushLine(lines, "            comp[to] = comp_id;");
  pushLine(lines, "            stack.push_back(to);");
  pushLine(lines, "          }");
  pushLine(lines, "        }");
  pushLine(lines, "      }");
  pushLine(lines, "      ++comp_id;");
  pushLine(lines, "    }");
  pushLine(lines, "    return comp;");
  pushLine(lines, "  }");
  pushLine(lines, "};");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderTwoSatUsage(options, features));
  }

  return createRenderedRecipe({ helpers: [lines.join("\n")] }, twoSatExports(options));
}

export function renderTwoSat(options: TwoSatOptions): string {
  return composeRecipeSections(renderTwoSatRecipe(options));
}

export function defaultMaxflowDinicFeatures(): MaxflowDinicFeature[] {
  return ["min_cut", "graph_access", "reset_flows"];
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
  const lines = ["/*", "Example:"];
  lines.push(`${names.className}<${options.capType}> ${names.instanceName}(n);`);
  lines.push(`${names.instanceName}.${names.addEdgeName}(u, v, cap);`);
  lines.push(
    `auto ${names.answerName} = ${names.instanceName}.${names.maxFlowName}(s, t);`
  );
  if (features.has("min_cut")) {
    lines.push(
      `bool source_side = ${names.instanceName}.${names.minCutName}(v);`
    );
  }
  if (features.has("reset_flows")) {
    lines.push(`${names.instanceName}.${names.resetFlowsName}();`);
  }
  lines.push("*/");
  return lines.join("\n");
}

function renderMaxflowDinicSolveSection(options: MaxflowDinicOptions): string {
  const names = options.names;
  const lines: string[] = [];

  pushLine(lines, `void ${names.solveName}() {`);
  pushLine(
    lines,
    `  int ${options.nodeCountName}, ${options.edgeCountName}, ${options.sourceName}, ${options.sinkName};`
  );
  pushLine(
    lines,
    `  cin >> ${options.nodeCountName} >> ${options.edgeCountName} >> ${options.sourceName} >> ${options.sinkName};`
  );
  pushLine(
    lines,
    `  ${names.className}<${options.capType}> ${names.instanceName}(${options.nodeCountName});`
  );
  pushLine(
    lines,
    `  for (int i = 0; i < ${options.edgeCountName}; ++i) {`
  );
  pushLine(
    lines,
    `    int ${options.fromName}, ${options.toName};`
  );
  pushLine(lines, `    ${options.capType} ${options.edgeCapName};`);
  pushLine(
    lines,
    `    cin >> ${options.fromName} >> ${options.toName} >> ${options.edgeCapName};`
  );
  pushLine(
    lines,
    `    ${names.instanceName}.${names.addEdgeName}(${options.fromName}, ${options.toName}, ${options.edgeCapName});`
  );
  pushLine(lines, "  }");
  pushLine(
    lines,
    `  auto ${names.answerName} = ${names.instanceName}.${names.maxFlowName}(${options.sourceName}, ${options.sinkName});`
  );
  pushLine(lines, `  cout << ${names.answerName} << '\\n';`);
  pushLine(lines, "}");
  return lines.join("\n");
}

export function renderMaxflowDinicRecipe(
  options: MaxflowDinicOptions
): RenderedRecipe {
  const names = options.names;
  const features = maxflowDinicFeatureSet(options.features);
  const lines: string[] = [];

  pushLine(lines, "template <typename Cap>");
  pushLine(lines, `class ${names.className} {`);
  pushLine(lines, " public:");
  pushLine(lines, `  struct ${names.edgeName} {`);
  pushLine(lines, "    int to;");
  pushLine(lines, "    int rev;");
  pushLine(lines, "    Cap cap;");
  pushLine(lines, "    Cap original_cap;");
  pushLine(lines);
  pushLine(
    lines,
    `    ${names.edgeName}(int to_ = 0, int rev_ = 0, Cap cap_ = Cap(0),`
  );
  pushLine(lines, "         Cap original_cap_ = Cap(0))");
  pushLine(
    lines,
    "        : to(to_), rev(rev_), cap(cap_), original_cap(original_cap_) {}"
  );
  pushLine(lines);
  pushLine(lines, "    Cap flow() const { return original_cap - cap; }");
  pushLine(lines, "  };");
  pushLine(lines);
  pushLine(
    lines,
    `  explicit ${names.className}(int n = 0) : n_(0) { ${names.resetName}(n); }`
  );
  pushLine(lines);
  pushLine(lines, `  void ${names.resetName}(int n) {`);
  pushLine(lines, "    n_ = (n < 0 ? 0 : n);");
  pushLine(
    lines,
    `    ${names.graphFieldName}.assign(n_, std::vector<${names.edgeName}>());`
  );
  pushLine(lines, `    ${names.levelFieldName}.assign(n_, -1);`);
  pushLine(lines, `    ${names.ptrFieldName}.assign(n_, 0);`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int size() const { return n_; }");
  pushLine(lines);
  pushLine(
    lines,
    `  int ${names.addEdgeName}(int from, int to, Cap cap, Cap rev_cap = Cap(0)) {`
  );
  pushLine(lines, "    if (from < 0 || from >= n_ || to < 0 || to >= n_ ||");
  pushLine(lines, "        cap < Cap(0) || rev_cap < Cap(0)) {");
  pushLine(lines, "      return -1;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(
    lines,
    `    const int from_id = static_cast<int>(${names.graphFieldName}[from].size());`
  );
  pushLine(
    lines,
    `    const int to_id = static_cast<int>(${names.graphFieldName}[to].size());`
  );
  pushLine(
    lines,
    `    ${names.graphFieldName}[from].push_back(${names.edgeName}(to, to_id, cap, cap));`
  );
  pushLine(
    lines,
    `    ${names.graphFieldName}[to].push_back(${names.edgeName}(from, from_id, rev_cap, rev_cap));`
  );
  pushLine(lines, "    return from_id;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  Cap ${names.maxFlowName}(int source, int sink) {`);
  pushLine(lines, "    if (source < 0 || source >= n_ || sink < 0 || sink >= n_ ||");
  pushLine(lines, "        source == sink) {");
  pushLine(lines, "      return Cap(0);");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    Cap total_flow = Cap(0);");
  pushLine(lines, `    while (${names.buildLevelName}(source, sink)) {`);
  pushLine(
    lines,
    `      std::fill(${names.ptrFieldName}.begin(), ${names.ptrFieldName}.end(), 0);`
  );
  pushLine(lines, "      while (true) {");
  pushLine(lines, "        const Cap pushed =");
  pushLine(
    lines,
    `            ${names.pushFlowName}(source, sink, std::numeric_limits<Cap>::max());`
  );
  pushLine(lines, "        if (pushed == Cap(0)) {");
  pushLine(lines, "          break;");
  pushLine(lines, "        }");
  pushLine(lines, "        total_flow += pushed;");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "    return total_flow;");
  pushLine(lines, "  }");

  if (features.has("reset_flows")) {
    pushLine(lines);
    pushLine(lines, `  void ${names.resetFlowsName}() {`);
    pushLine(lines, `    for (auto& edges : ${names.graphFieldName}) {`);
    pushLine(lines, "      for (auto& edge : edges) {");
    pushLine(lines, "        edge.cap = edge.original_cap;");
    pushLine(lines, "      }");
    pushLine(lines, "    }");
    pushLine(
      lines,
      `    std::fill(${names.levelFieldName}.begin(), ${names.levelFieldName}.end(), -1);`
    );
    pushLine(
      lines,
      `    std::fill(${names.ptrFieldName}.begin(), ${names.ptrFieldName}.end(), 0);`
    );
    pushLine(lines, "  }");
  }

  if (features.has("min_cut")) {
    pushLine(lines);
    pushLine(lines, `  bool ${names.minCutName}(int vertex) const {`);
    pushLine(
      lines,
      `    return vertex >= 0 && vertex < n_ && ${names.levelFieldName}[vertex] != -1;`
    );
    pushLine(lines, "  }");
  }

  if (features.has("graph_access")) {
    pushLine(lines);
    pushLine(
      lines,
      `  const std::vector<std::vector<${names.edgeName}>>& ${names.graphName}() const {`
    );
    pushLine(lines, `    return ${names.graphFieldName};`);
    pushLine(lines, "  }");
  }

  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  int n_;");
  pushLine(
    lines,
    `  std::vector<std::vector<${names.edgeName}>> ${names.graphFieldName};`
  );
  pushLine(lines, `  std::vector<int> ${names.levelFieldName};`);
  pushLine(lines, `  std::vector<int> ${names.ptrFieldName};`);
  pushLine(lines);
  pushLine(lines, `  bool ${names.buildLevelName}(int source, int sink) {`);
  pushLine(
    lines,
    `    std::fill(${names.levelFieldName}.begin(), ${names.levelFieldName}.end(), -1);`
  );
  pushLine(lines, "    std::queue<int> q;");
  pushLine(lines, `    ${names.levelFieldName}[source] = 0;`);
  pushLine(lines, "    q.push(source);");
  pushLine(lines);
  pushLine(lines, "    while (!q.empty()) {");
  pushLine(lines, "      const int v = q.front();");
  pushLine(lines, "      q.pop();");
  pushLine(lines);
  pushLine(lines, `      for (const ${names.edgeName}& edge : ${names.graphFieldName}[v]) {`);
  pushLine(
    lines,
    `        if (edge.cap <= Cap(0) || ${names.levelFieldName}[edge.to] != -1) {`
  );
  pushLine(lines, "          continue;");
  pushLine(lines, "        }");
  pushLine(
    lines,
    `        ${names.levelFieldName}[edge.to] = ${names.levelFieldName}[v] + 1;`
  );
  pushLine(lines, "        q.push(edge.to);");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, `    return ${names.levelFieldName}[sink] != -1;`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  Cap ${names.pushFlowName}(int v, int sink, Cap flow_limit) {`
  );
  pushLine(lines, "    if (v == sink || flow_limit == Cap(0)) {");
  pushLine(lines, "      return flow_limit;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(
    lines,
    `    for (int& edge_id = ${names.ptrFieldName}[v]; edge_id < static_cast<int>(${names.graphFieldName}[v].size()); ++edge_id) {`
  );
  pushLine(
    lines,
    `      ${names.edgeName}& edge = ${names.graphFieldName}[v][edge_id];`
  );
  pushLine(
    lines,
    `      if (edge.cap <= Cap(0) || ${names.levelFieldName}[edge.to] != ${names.levelFieldName}[v] + 1) {`
  );
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines);
  pushLine(lines, "      const Cap pushed =");
  pushLine(
    lines,
    `          ${names.pushFlowName}(edge.to, sink, std::min(flow_limit, edge.cap));`
  );
  pushLine(lines, "      if (pushed == Cap(0)) {");
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines);
  pushLine(lines, "      edge.cap -= pushed;");
  pushLine(lines, `      ${names.graphFieldName}[edge.to][edge.rev].cap += pushed;`);
  pushLine(lines, "      return pushed;");
  pushLine(lines, "    }");
  pushLine(lines, "    return Cap(0);");
  pushLine(lines, "  }");
  pushLine(lines, "};");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderMaxflowDinicUsage(options, features));
  }

  const sections: Partial<Record<SolutionSection, string[]>> = {
    helpers: [lines.join("\n")]
  };
  if (options.generateInput) {
    sections.solve = [renderMaxflowDinicSolveSection(options)];
  }

  return createRenderedRecipe(
    sections,
    maxflowDinicExports(options)
  );
}

export function renderMaxflowDinic(options: MaxflowDinicOptions): string {
  return composeRecipeSections(renderMaxflowDinicRecipe(options));
}

export function defaultMinCostMaxFlowFeatures(): MinCostMaxFlowFeature[] {
  return ["graph_access", "potential_access"];
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
  const lines = ["/*", "Example:"];
  lines.push(
    `${names.className}<${options.capType}, ${options.costType}> ${names.instanceName}(n);`
  );
  lines.push(
    `${names.instanceName}.${names.addEdgeName}(u, v, cap, cost);`
  );
  if (options.mode === "fixed_flow") {
    lines.push(
      `auto ${names.resultName} = ${names.instanceName}.${names.minCostFlowName}(s, t, ${options.flowLimitName});`
    );
  } else {
    lines.push(
      `auto ${names.resultName} = ${names.instanceName}.${names.minCostMaxFlowName}(s, t);`
    );
  }
  lines.push(
    `// ${names.resultName}.first is flow, ${names.resultName}.second is cost.`
  );
  if (features.has("graph_access")) {
    lines.push(`auto edges = ${names.instanceName}.${names.graphName}();`);
  }
  if (features.has("potential_access")) {
    lines.push(
      `${names.instanceName}.${names.setPotentialName}(s);`
    );
  }
  lines.push("*/");
  return lines.join("\n");
}

function renderMinCostMaxFlowSolveSection(
  options: MinCostMaxFlowOptions
): string {
  const names = options.names;
  const lines: string[] = [];

  pushLine(lines, `void ${names.solveName}() {`);
  pushLine(
    lines,
    `  int ${options.nodeCountName}, ${options.edgeCountName}, ${options.sourceName}, ${options.sinkName};`
  );
  pushLine(
    lines,
    `  cin >> ${options.nodeCountName} >> ${options.edgeCountName} >> ${options.sourceName} >> ${options.sinkName};`
  );
  if (options.mode === "fixed_flow") {
    pushLine(lines, `  ${options.capType} ${options.flowLimitName};`);
    pushLine(lines, `  cin >> ${options.flowLimitName};`);
  }
  pushLine(
    lines,
    `  ${names.className}<${options.capType}, ${options.costType}> ${names.instanceName}(${options.nodeCountName});`
  );
  pushLine(
    lines,
    `  for (int i = 0; i < ${options.edgeCountName}; ++i) {`
  );
  pushLine(
    lines,
    `    int ${options.fromName}, ${options.toName};`
  );
  pushLine(lines, `    ${options.capType} ${options.edgeCapName};`);
  pushLine(lines, `    ${options.costType} ${options.edgeCostName};`);
  pushLine(
    lines,
    `    cin >> ${options.fromName} >> ${options.toName} >> ${options.edgeCapName} >> ${options.edgeCostName};`
  );
  pushLine(
    lines,
    `    ${names.instanceName}.${names.addEdgeName}(${options.fromName}, ${options.toName}, ${options.edgeCapName}, ${options.edgeCostName});`
  );
  pushLine(lines, "  }");
  if (options.mode === "fixed_flow") {
    pushLine(
      lines,
      `  auto ${names.resultName} = ${names.instanceName}.${names.minCostFlowName}(${options.sourceName}, ${options.sinkName}, ${options.flowLimitName});`
    );
  } else {
    pushLine(
      lines,
      `  auto ${names.resultName} = ${names.instanceName}.${names.minCostMaxFlowName}(${options.sourceName}, ${options.sinkName});`
    );
  }
  pushLine(
    lines,
    `  cout << ${names.resultName}.first << ' ' << ${names.resultName}.second << '\\n';`
  );
  pushLine(lines, "}");
  return lines.join("\n");
}

export function renderMinCostMaxFlowRecipe(
  options: MinCostMaxFlowOptions
): RenderedRecipe {
  const names = options.names;
  const features = minCostMaxFlowFeatureSet(options.features);
  const lines: string[] = [];

  pushLine(lines, "template <typename Cap, typename Cost>");
  pushLine(lines, `class ${names.className} {`);
  pushLine(lines, " public:");
  pushLine(lines, `  struct ${names.edgeName} {`);
  pushLine(lines, "    int to;");
  pushLine(lines, "    int rev;");
  pushLine(lines, "    Cap cap;");
  pushLine(lines, "    Cost cost;");
  pushLine(lines, "    Cap original_cap;");
  pushLine(lines);
  pushLine(
    lines,
    `    ${names.edgeName}(int to_ = 0, int rev_ = 0, Cap cap_ = Cap(0), Cost cost_ = Cost(0),`
  );
  pushLine(lines, "         Cap original_cap_ = Cap(0))");
  pushLine(lines, "        : to(to_),");
  pushLine(lines, "          rev(rev_),");
  pushLine(lines, "          cap(cap_),");
  pushLine(lines, "          cost(cost_),");
  pushLine(lines, "          original_cap(original_cap_) {}");
  pushLine(lines);
  pushLine(lines, "    Cap flow() const { return original_cap - cap; }");
  pushLine(lines, "  };");
  pushLine(lines);
  pushLine(
    lines,
    `  explicit ${names.className}(int n = 0)`
  );
  pushLine(
    lines,
    `      : n_(0), ${names.hasNegativeFieldName}(false), ${names.potentialsInitializedFieldName}(false) {`
  );
  pushLine(lines, `    ${names.resetName}(n);`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  void ${names.resetName}(int n) {`);
  pushLine(lines, "    n_ = (n < 0 ? 0 : n);");
  pushLine(
    lines,
    `    ${names.graphFieldName}.assign(n_, std::vector<${names.edgeName}>());`
  );
  pushLine(
    lines,
    `    ${names.potentialFieldName}.assign(n_, Cost(0));`
  );
  pushLine(
    lines,
    `    ${names.distFieldName}.assign(n_, ${names.infCostName}());`
  );
  pushLine(lines, `    ${names.prevVertexFieldName}.assign(n_, -1);`);
  pushLine(lines, `    ${names.prevEdgeFieldName}.assign(n_, -1);`);
  pushLine(lines, `    ${names.hasNegativeFieldName} = false;`);
  pushLine(lines, `    ${names.potentialsInitializedFieldName} = false;`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int size() const { return n_; }");
  pushLine(lines);
  pushLine(
    lines,
    `  int ${names.addEdgeName}(int from, int to, Cap cap, Cost cost) {`
  );
  pushLine(lines, `    return ${names.addEdgeName}(from, to, cap, cost, Cap(0), -cost);`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  int ${names.addEdgeName}(int from, int to, Cap cap, Cost cost, Cap rev_cap) {`
  );
  pushLine(lines, `    return ${names.addEdgeName}(from, to, cap, cost, rev_cap, -cost);`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  int ${names.addEdgeName}(int from, int to, Cap cap, Cost cost, Cap rev_cap, Cost rev_cost) {`
  );
  pushLine(
    lines,
    `    if (!${names.vertexOkName}(from) || !${names.vertexOkName}(to) || cap < Cap(0) || rev_cap < Cap(0)) {`
  );
  pushLine(lines, "      return -1;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(
    lines,
    `    const int from_id = static_cast<int>(${names.graphFieldName}[from].size());`
  );
  pushLine(
    lines,
    `    const int to_id = static_cast<int>(${names.graphFieldName}[to].size());`
  );
  pushLine(
    lines,
    `    ${names.graphFieldName}[from].push_back(${names.edgeName}(to, to_id, cap, cost, cap));`
  );
  pushLine(
    lines,
    `    ${names.graphFieldName}[to].push_back(${names.edgeName}(from, from_id, rev_cap, rev_cost, rev_cap));`
  );
  pushLine(
    lines,
    `    if ((cap > Cap(0) && cost < Cost(0)) || (rev_cap > Cap(0) && rev_cost < Cost(0))) {`
  );
  pushLine(lines, `      ${names.hasNegativeFieldName} = true;`);
  pushLine(lines, "    }");
  pushLine(lines, `    ${names.potentialsInitializedFieldName} = false;`);
  pushLine(lines, "    return from_id;");
  pushLine(lines, "  }");

  if (features.has("graph_access")) {
    pushLine(lines);
    pushLine(
      lines,
      `  const std::vector<std::vector<${names.edgeName}>>& ${names.graphName}() const {`
    );
    pushLine(lines, `    return ${names.graphFieldName};`);
    pushLine(lines, "  }");
  }

  if (features.has("potential_access")) {
    pushLine(lines);
    pushLine(
      lines,
      `  const std::vector<Cost>& ${names.potentialName}() const { return ${names.potentialFieldName}; }`
    );
    pushLine(lines);
    pushLine(lines, `  void ${names.setPotentialName}(int source) {`);
    pushLine(lines, `    if (!${names.vertexOkName}(source)) {`);
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(lines, `    ${names.bellmanFordName}(source);`);
    pushLine(lines, `    ${names.potentialsInitializedFieldName} = true;`);
    pushLine(lines, "  }");
  }

  pushLine(lines);
  pushLine(
    lines,
    `  std::pair<Cap, Cost> ${names.minCostFlowName}(`
  );
  pushLine(lines, "      int source, int sink,");
  pushLine(
    lines,
    "      Cap flow_limit = std::numeric_limits<Cap>::max() / Cap(4)) {"
  );
  pushLine(lines, `    if (!${names.vertexOkName}(source) || !${names.vertexOkName}(sink) || source == sink ||`);
  pushLine(lines, "        flow_limit <= Cap(0)) {");
  pushLine(lines, "      return std::make_pair(Cap(0), Cost(0));");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(
    lines,
    `    if (${names.hasNegativeFieldName} && !${names.potentialsInitializedFieldName}) {`
  );
  pushLine(lines, `      ${names.bellmanFordName}(source);`);
  pushLine(lines, `      ${names.potentialsInitializedFieldName} = true;`);
  pushLine(lines, "    }");
  pushLine(
    lines,
    `    if (!${names.hasNegativeFieldName} && !${names.potentialsInitializedFieldName}) {`
  );
  pushLine(
    lines,
    `      std::fill(${names.potentialFieldName}.begin(), ${names.potentialFieldName}.end(), Cost(0));`
  );
  pushLine(lines, `      ${names.potentialsInitializedFieldName} = true;`);
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    Cap total_flow = Cap(0);");
  pushLine(lines, "    Cost total_cost = Cost(0);");
  pushLine(lines);
  pushLine(
    lines,
    `    while (total_flow < flow_limit && ${names.dijkstraName}(source, sink)) {`
  );
  pushLine(lines, "      Cap pushed = flow_limit - total_flow;");
  pushLine(lines, `      for (int v = sink; v != source; v = ${names.prevVertexFieldName}[v]) {`);
  pushLine(
    lines,
    `        const ${names.edgeName}& edge = ${names.graphFieldName}[${names.prevVertexFieldName}[v]][${names.prevEdgeFieldName}[v]];`
  );
  pushLine(lines, "        pushed = std::min(pushed, edge.cap);");
  pushLine(lines, "      }");
  pushLine(lines);
  pushLine(lines, `      for (int v = sink; v != source; v = ${names.prevVertexFieldName}[v]) {`);
  pushLine(
    lines,
    `        ${names.edgeName}& edge = ${names.graphFieldName}[${names.prevVertexFieldName}[v]][${names.prevEdgeFieldName}[v]];`
  );
  pushLine(lines, `        ${names.edgeName}& rev = ${names.graphFieldName}[edge.to][edge.rev];`);
  pushLine(lines, "        edge.cap -= pushed;");
  pushLine(lines, "        rev.cap += pushed;");
  pushLine(lines, "        total_cost += static_cast<Cost>(pushed) * edge.cost;");
  pushLine(lines, "      }");
  pushLine(lines, "      total_flow += pushed;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    return std::make_pair(total_flow, total_cost);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  std::pair<Cap, Cost> ${names.maxFlowMinCostName}(int source, int sink) {`
  );
  pushLine(lines, `    return ${names.minCostFlowName}(source, sink);`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  std::pair<Cap, Cost> ${names.minCostMaxFlowName}(int source, int sink) {`
  );
  pushLine(lines, `    return ${names.minCostFlowName}(source, sink);`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  int n_;");
  pushLine(
    lines,
    `  std::vector<std::vector<${names.edgeName}>> ${names.graphFieldName};`
  );
  pushLine(lines, `  std::vector<Cost> ${names.potentialFieldName};`);
  pushLine(lines, `  std::vector<Cost> ${names.distFieldName};`);
  pushLine(lines, `  std::vector<int> ${names.prevVertexFieldName};`);
  pushLine(lines, `  std::vector<int> ${names.prevEdgeFieldName};`);
  pushLine(lines, `  bool ${names.hasNegativeFieldName};`);
  pushLine(lines, `  bool ${names.potentialsInitializedFieldName};`);
  pushLine(lines);
  pushLine(
    lines,
    `  bool ${names.vertexOkName}(int v) const { return v >= 0 && v < n_; }`
  );
  pushLine(lines);
  pushLine(
    lines,
    `  static Cost ${names.infCostName}() { return std::numeric_limits<Cost>::max() / Cost(4); }`
  );
  pushLine(lines);
  pushLine(lines, `  void ${names.bellmanFordName}(int source) {`);
  pushLine(lines, `    const Cost inf = ${names.infCostName}();`);
  pushLine(
    lines,
    `    std::fill(${names.potentialFieldName}.begin(), ${names.potentialFieldName}.end(), inf);`
  );
  pushLine(lines, `    ${names.potentialFieldName}[source] = Cost(0);`);
  pushLine(lines);
  pushLine(lines, "    for (int it = 0; it < n_ - 1; ++it) {");
  pushLine(lines, "      bool updated = false;");
  pushLine(lines, "      for (int v = 0; v < n_; ++v) {");
  pushLine(lines, `        if (${names.potentialFieldName}[v] == inf) {`);
  pushLine(lines, "          continue;");
  pushLine(lines, "        }");
  pushLine(
    lines,
    `        for (const ${names.edgeName}& edge : ${names.graphFieldName}[v]) {`
  );
  pushLine(lines, "          if (edge.cap <= Cap(0)) {");
  pushLine(lines, "            continue;");
  pushLine(lines, "          }");
  pushLine(
    lines,
    `          const Cost candidate = ${names.potentialFieldName}[v] + edge.cost;`
  );
  pushLine(
    lines,
    `          if (candidate < ${names.potentialFieldName}[edge.to]) {`
  );
  pushLine(lines, `            ${names.potentialFieldName}[edge.to] = candidate;`);
  pushLine(lines, "            updated = true;");
  pushLine(lines, "          }");
  pushLine(lines, "        }");
  pushLine(lines, "      }");
  pushLine(lines, "      if (!updated) {");
  pushLine(lines, "        break;");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, `    for (Cost& value : ${names.potentialFieldName}) {`);
  pushLine(lines, "      if (value == inf) {");
  pushLine(lines, "        value = Cost(0);");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  bool ${names.dijkstraName}(int source, int sink) {`);
  pushLine(lines, `    const Cost inf = ${names.infCostName}();`);
  pushLine(
    lines,
    `    std::fill(${names.distFieldName}.begin(), ${names.distFieldName}.end(), inf);`
  );
  pushLine(
    lines,
    `    std::fill(${names.prevVertexFieldName}.begin(), ${names.prevVertexFieldName}.end(), -1);`
  );
  pushLine(
    lines,
    `    std::fill(${names.prevEdgeFieldName}.begin(), ${names.prevEdgeFieldName}.end(), -1);`
  );
  pushLine(lines);
  pushLine(lines, "    using Node = std::pair<Cost, int>;");
  pushLine(lines, "    std::priority_queue<Node, std::vector<Node>, std::greater<Node>> pq;");
  pushLine(lines, `    ${names.distFieldName}[source] = Cost(0);`);
  pushLine(lines, "    pq.push(std::make_pair(Cost(0), source));");
  pushLine(lines);
  pushLine(lines, "    while (!pq.empty()) {");
  pushLine(lines, "      const Cost current_dist = pq.top().first;");
  pushLine(lines, "      const int v = pq.top().second;");
  pushLine(lines, "      pq.pop();");
  pushLine(lines, `      if (current_dist != ${names.distFieldName}[v]) {`);
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines);
  pushLine(
    lines,
    `      for (int edge_id = 0; edge_id < static_cast<int>(${names.graphFieldName}[v].size()); ++edge_id) {`
  );
  pushLine(
    lines,
    `        const ${names.edgeName}& edge = ${names.graphFieldName}[v][edge_id];`
  );
  pushLine(lines, "        if (edge.cap <= Cap(0)) {");
  pushLine(lines, "          continue;");
  pushLine(lines, "        }");
  pushLine(lines);
  pushLine(
    lines,
    `        const Cost reduced_cost = edge.cost + ${names.potentialFieldName}[v] - ${names.potentialFieldName}[edge.to];`
  );
  pushLine(lines, "        const Cost candidate = current_dist + reduced_cost;");
  pushLine(lines, `        if (candidate < ${names.distFieldName}[edge.to]) {`);
  pushLine(lines, `          ${names.distFieldName}[edge.to] = candidate;`);
  pushLine(lines, `          ${names.prevVertexFieldName}[edge.to] = v;`);
  pushLine(lines, `          ${names.prevEdgeFieldName}[edge.to] = edge_id;`);
  pushLine(lines, "          pq.push(std::make_pair(candidate, edge.to));");
  pushLine(lines, "        }");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, `    if (${names.distFieldName}[sink] == inf) {`);
  pushLine(lines, "      return false;");
  pushLine(lines, "    }");
  pushLine(lines, "    for (int v = 0; v < n_; ++v) {");
  pushLine(lines, `      if (${names.distFieldName}[v] != inf) {`);
  pushLine(
    lines,
    `        ${names.potentialFieldName}[v] += ${names.distFieldName}[v];`
  );
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "    return true;");
  pushLine(lines, "  }");
  pushLine(lines, "};");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderMinCostMaxFlowUsage(options, features));
  }

  const sections: Partial<Record<SolutionSection, string[]>> = {
    helpers: [lines.join("\n")]
  };
  if (options.generateInput) {
    sections.solve = [renderMinCostMaxFlowSolveSection(options)];
  }

  return createRenderedRecipe(
    sections,
    minCostMaxFlowExports(options)
  );
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
  const lines = ["/*", "Example:"];
  lines.push(
    `auto ${options.resultName} = ${hungarianCallName(options)}(${options.sourceName});`
  );
  lines.push(`cout << ${options.resultName}.min_cost << '\\n';`);
  lines.push(`int col = ${options.resultName}.match_left[row];`);
  lines.push("*/");
  return lines.join("\n");
}

function renderHungarianSolveSection(options: HungarianOptions): string {
  const lines: string[] = [];
  pushLine(lines, `void ${options.names.solveName}() {`);
  pushLine(lines, `  int ${options.rowCountName}, ${options.colCountName};`);
  pushLine(
    lines,
    `  cin >> ${options.rowCountName} >> ${options.colCountName};`
  );
  pushLine(
    lines,
    `  std::vector<std::vector<${options.costType}>> ${options.sourceName}(${options.rowCountName}, std::vector<${options.costType}>(${options.colCountName}));`
  );
  pushLine(lines, `  for (int i = 0; i < ${options.rowCountName}; ++i) {`);
  pushLine(lines, `    for (int j = 0; j < ${options.colCountName}; ++j) {`);
  pushLine(lines, `      cin >> ${options.sourceName}[i][j];`);
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(
    lines,
    `  auto ${options.resultName} = ${hungarianCallName(options)}(${options.sourceName});`
  );
  pushLine(lines, `  cout << ${options.resultName}.min_cost << '\\n';`);
  pushLine(
    lines,
    `  for (int i = 0; i < static_cast<int>(${options.resultName}.match_left.size()); ++i) {`
  );
  pushLine(lines, "    if (i > 0) {");
  pushLine(lines, "      cout << ' ';");
  pushLine(lines, "    }");
  pushLine(lines, `    cout << ${options.resultName}.match_left[i];`);
  pushLine(lines, "  }");
  pushLine(lines, "  cout << '\\n';");
  pushLine(lines, "}");
  return lines.join("\n");
}

export function renderHungarianRecipe(options: HungarianOptions): RenderedRecipe {
  const names = options.names;
  const lines: string[] = [];

  pushLine(lines, "template <typename Cost>");
  pushLine(lines, `struct ${names.resultStructName} {`);
  pushLine(lines, "  Cost min_cost;");
  pushLine(lines, "  std::vector<int> match_left;");
  pushLine(lines, "  std::vector<int> match_right;");
  pushLine(lines);
  pushLine(lines, `  ${names.resultStructName}() : min_cost(Cost()) {}`);
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(lines, "template <typename Cost>");
  pushLine(
    lines,
    `inline ${names.resultStructName}<Cost> ${names.internalName}(`
  );
  pushLine(
    lines,
    "    const std::vector<std::vector<Cost>>& cost, Cost inf) {"
  );
  pushLine(lines, `  ${names.resultStructName}<Cost> result;`);
  pushLine(lines);
  pushLine(lines, "  const int n = static_cast<int>(cost.size());");
  pushLine(
    lines,
    "  const int m = (n == 0 ? 0 : static_cast<int>(cost[0].size()));"
  );
  pushLine(lines, "  result.match_left.assign(n, -1);");
  pushLine(lines, "  result.match_right.assign(m, -1);");
  pushLine(lines, "  if (n == 0 || m == 0) {");
  pushLine(lines, "    result.min_cost = Cost(0);");
  pushLine(lines, "    return result;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  std::vector<Cost> u(n + 1, Cost(0));");
  pushLine(lines, "  std::vector<Cost> v(m + 1, Cost(0));");
  pushLine(lines, "  std::vector<int> p(m + 1, 0);");
  pushLine(lines, "  std::vector<int> way(m + 1, 0);");
  pushLine(lines);
  pushLine(lines, "  for (int i = 1; i <= n; ++i) {");
  pushLine(lines, "    p[0] = i;");
  pushLine(lines, "    int j0 = 0;");
  pushLine(lines, "    std::vector<Cost> minv(m + 1, inf);");
  pushLine(lines, "    std::vector<char> used(m + 1, 0);");
  pushLine(lines);
  pushLine(lines, "    do {");
  pushLine(lines, "      used[j0] = 1;");
  pushLine(lines, "      const int i0 = p[j0];");
  pushLine(lines, "      int j1 = 0;");
  pushLine(lines, "      Cost delta = inf;");
  pushLine(lines);
  pushLine(lines, "      for (int j = 1; j <= m; ++j) {");
  pushLine(lines, "        if (used[j]) {");
  pushLine(lines, "          continue;");
  pushLine(lines, "        }");
  pushLine(
    lines,
    "        const Cost current = cost[i0 - 1][j - 1] - u[i0] - v[j];"
  );
  pushLine(lines, "        if (current < minv[j]) {");
  pushLine(lines, "          minv[j] = current;");
  pushLine(lines, "          way[j] = j0;");
  pushLine(lines, "        }");
  pushLine(lines, "        if (minv[j] < delta) {");
  pushLine(lines, "          delta = minv[j];");
  pushLine(lines, "          j1 = j;");
  pushLine(lines, "        }");
  pushLine(lines, "      }");
  pushLine(lines);
  pushLine(lines, "      for (int j = 0; j <= m; ++j) {");
  pushLine(lines, "        if (used[j]) {");
  pushLine(lines, "          u[p[j]] += delta;");
  pushLine(lines, "          v[j] -= delta;");
  pushLine(lines, "        } else {");
  pushLine(lines, "          minv[j] -= delta;");
  pushLine(lines, "        }");
  pushLine(lines, "      }");
  pushLine(lines, "      j0 = j1;");
  pushLine(lines, "    } while (p[j0] != 0);");
  pushLine(lines);
  pushLine(lines, "    do {");
  pushLine(lines, "      const int j1 = way[j0];");
  pushLine(lines, "      p[j0] = p[j1];");
  pushLine(lines, "      j0 = j1;");
  pushLine(lines, "    } while (j0 != 0);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  result.min_cost = Cost(0);");
  pushLine(lines, "  for (int j = 1; j <= m; ++j) {");
  pushLine(lines, "    if (p[j] != 0) {");
  pushLine(lines, "      const int row = p[j] - 1;");
  pushLine(lines, "      const int col = j - 1;");
  pushLine(lines, "      result.match_left[row] = col;");
  pushLine(lines, "      result.match_right[col] = row;");
  pushLine(lines, "      result.min_cost += cost[row][col];");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines, "  return result;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, "template <typename Cost>");
  pushLine(
    lines,
    `inline ${names.resultStructName}<Cost> ${names.minimizeName}(`
  );
  pushLine(lines, "    const std::vector<std::vector<Cost>>& cost,");
  pushLine(
    lines,
    "    Cost inf = std::numeric_limits<Cost>::max() / Cost(4)) {"
  );
  pushLine(lines, `  ${names.resultStructName}<Cost> result;`);
  pushLine(lines, "  const int n = static_cast<int>(cost.size());");
  pushLine(
    lines,
    "  const int m = (n == 0 ? 0 : static_cast<int>(cost[0].size()));"
  );
  pushLine(lines, "  result.match_left.assign(n, -1);");
  pushLine(lines, "  result.match_right.assign(m, -1);");
  pushLine(lines, "  result.min_cost = Cost(0);");
  pushLine(lines);
  pushLine(lines, "  if (n == 0 || m == 0) {");
  pushLine(lines, "    return result;");
  pushLine(lines, "  }");
  pushLine(lines, "  for (int i = 1; i < n; ++i) {");
  pushLine(lines, "    if (static_cast<int>(cost[i].size()) != m) {");
  pushLine(lines, "      return result;");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  if (options.rectangular) {
    pushLine(lines, "  if (n <= m) {");
    pushLine(lines, `    return ${names.internalName}(cost, inf);`);
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(
      lines,
      "  std::vector<std::vector<Cost>> transposed(m, std::vector<Cost>(n, Cost(0)));"
    );
    pushLine(lines, "  for (int i = 0; i < n; ++i) {");
    pushLine(lines, "    for (int j = 0; j < m; ++j) {");
    pushLine(lines, "      transposed[j][i] = cost[i][j];");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(
      lines,
      `  const ${names.resultStructName}<Cost> transposed_result = ${names.internalName}(transposed, inf);`
    );
    pushLine(lines, "  result.min_cost = transposed_result.min_cost;");
    pushLine(lines, "  for (int col = 0; col < m; ++col) {");
    pushLine(lines, "    const int row = transposed_result.match_left[col];");
    pushLine(lines, "    if (row != -1) {");
    pushLine(lines, "      result.match_left[row] = col;");
    pushLine(lines, "      result.match_right[col] = row;");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
    pushLine(lines, "  return result;");
  } else {
    pushLine(lines, "  if (n > m) {");
    pushLine(lines, "    return result;");
    pushLine(lines, "  }");
    pushLine(lines, `  return ${names.internalName}(cost, inf);`);
  }
  pushLine(lines, "}");

  if (options.mode === "maximize") {
    pushLine(lines);
    pushLine(lines, "template <typename Cost>");
    pushLine(
      lines,
      `inline ${names.resultStructName}<Cost> ${names.maximizeName}(`
    );
    pushLine(lines, "    const std::vector<std::vector<Cost>>& value) {");
    pushLine(lines, `  ${names.resultStructName}<Cost> result;`);
    pushLine(lines, "  const int n = static_cast<int>(value.size());");
    pushLine(
      lines,
      "  const int m = (n == 0 ? 0 : static_cast<int>(value[0].size()));"
    );
    pushLine(lines, "  result.match_left.assign(n, -1);");
    pushLine(lines, "  result.match_right.assign(m, -1);");
    pushLine(lines, "  result.min_cost = Cost(0);");
    pushLine(lines, "  if (n == 0 || m == 0) {");
    pushLine(lines, "    return result;");
    pushLine(lines, "  }");
    pushLine(lines, "  for (int i = 1; i < n; ++i) {");
    pushLine(lines, "    if (static_cast<int>(value[i].size()) != m) {");
    pushLine(lines, "      return result;");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  Cost max_value = value[0][0];");
    pushLine(lines, "  for (int i = 0; i < n; ++i) {");
    pushLine(lines, "    for (int j = 0; j < m; ++j) {");
    pushLine(lines, "      if (value[i][j] > max_value) {");
    pushLine(lines, "        max_value = value[i][j];");
    pushLine(lines, "      }");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(
      lines,
      "  std::vector<std::vector<Cost>> transformed(n, std::vector<Cost>(m, Cost(0)));"
    );
    pushLine(lines, "  for (int i = 0; i < n; ++i) {");
    pushLine(lines, "    for (int j = 0; j < m; ++j) {");
    pushLine(lines, "      transformed[i][j] = max_value - value[i][j];");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, `  result = ${names.minimizeName}(transformed);`);
    pushLine(lines, "  if (!result.match_left.empty() || n == 0 || m == 0) {");
    pushLine(lines, "    Cost max_sum = Cost(0);");
    pushLine(lines, "    for (int i = 0; i < n; ++i) {");
    pushLine(lines, "      if (result.match_left[i] != -1) {");
    pushLine(lines, "        max_sum += value[i][result.match_left[i]];");
    pushLine(lines, "      }");
    pushLine(lines, "    }");
    pushLine(lines, "    result.min_cost = max_sum;");
    pushLine(lines, "  }");
    pushLine(lines, "  return result;");
    pushLine(lines, "}");
  }

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderHungarianUsage(options));
  }

  const sections: Partial<Record<SolutionSection, string[]>> = {
    helpers: [lines.join("\n")]
  };
  if (options.generateInput) {
    sections.solve = [renderHungarianSolveSection(options)];
  }

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
  const names = options.names;
  const lines = ["/*", "Example:"];
  lines.push(
    `${names.className} ${options.instanceName}(${options.leftCountName}, ${options.rightCountName});`,
    `${options.instanceName}.${names.addEdgeName}(${options.leftVertexName}, ${options.rightVertexName});`,
    `auto ${options.resultName} = ${options.instanceName}.${names.maximumMatchingName}();`,
    `cout << ${options.resultName}.${names.matchingSizeName} << '\\n';`
  );
  if (features.has("vertex_cover")) {
    lines.push(
      `auto ${options.coverName} = ${names.vertexCoverFunctionName}(${options.instanceName}.${names.graphName}(), ${options.rightCountName}, ${options.resultName});`
    );
  }
  lines.push("*/");
  return lines.join("\n");
}

function renderKuhnSolveSection(options: KuhnOptions): string {
  const names = options.names;
  const lines: string[] = [];
  pushLine(lines, `void ${names.solveName}() {`);
  pushLine(
    lines,
    `  int ${options.leftCountName}, ${options.rightCountName}, ${options.edgeCountName};`
  );
  pushLine(
    lines,
    `  cin >> ${options.leftCountName} >> ${options.rightCountName} >> ${options.edgeCountName};`
  );
  pushLine(
    lines,
    `  ${names.className} ${options.instanceName}(${options.leftCountName}, ${options.rightCountName});`
  );
  pushLine(lines, `  for (int i = 0; i < ${options.edgeCountName}; ++i) {`);
  pushLine(lines, `    int ${options.leftVertexName}, ${options.rightVertexName};`);
  pushLine(lines, `    cin >> ${options.leftVertexName} >> ${options.rightVertexName};`);
  if (options.decrementInput) {
    pushLine(lines, `    --${options.leftVertexName};`);
    pushLine(lines, `    --${options.rightVertexName};`);
  }
  pushLine(
    lines,
    `    ${options.instanceName}.${names.addEdgeName}(${options.leftVertexName}, ${options.rightVertexName});`
  );
  pushLine(lines, "  }");
  pushLine(
    lines,
    `  auto ${options.resultName} = ${options.instanceName}.${names.maximumMatchingName}();`
  );
  pushLine(lines, `  cout << ${options.resultName}.${names.matchingSizeName} << '\\n';`);
  pushLine(lines, "}");
  return lines.join("\n");
}

export function renderKuhnRecipe(options: KuhnOptions): RenderedRecipe {
  const features = kuhnFeatureSet(options.features);
  const names = options.names;
  const lines: string[] = [];

  pushLine(lines, `struct ${names.resultStructName} {`);
  pushLine(lines, `  int ${names.matchingSizeName};`);
  pushLine(lines, `  std::vector<int> ${names.matchLeftName};`);
  pushLine(lines, `  std::vector<int> ${names.matchRightName};`);
  pushLine(lines);
  pushLine(lines, `  ${names.resultStructName}() : ${names.matchingSizeName}(0) {}`);
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(lines, `class ${names.className} {`);
  pushLine(lines, " public:");
  pushLine(
    lines,
    `  explicit ${names.className}(int n_left = 0, int n_right = 0) : n_left_(0), n_right_(0) {`
  );
  pushLine(lines, `    ${names.resetName}(n_left, n_right);`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  void ${names.resetName}(int n_left, int n_right) {`);
  pushLine(lines, "    n_left_ = (n_left < 0 ? 0 : n_left);");
  pushLine(lines, "    n_right_ = (n_right < 0 ? 0 : n_right);");
  pushLine(lines, "    graph_.assign(n_left_, std::vector<int>());");
  pushLine(lines, "    used_.assign(n_left_, 0);");
  pushLine(lines, "    visit_token_ = 1;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  int ${names.leftSizeName}() const { return n_left_; }`);
  pushLine(lines);
  pushLine(lines, `  int ${names.rightSizeName}() const { return n_right_; }`);
  pushLine(lines);
  pushLine(
    lines,
    `  const std::vector<std::vector<int>>& ${names.graphName}() const { return graph_; }`
  );
  pushLine(lines);
  pushLine(lines, `  int ${names.addEdgeName}(int left, int right) {`);
  pushLine(lines, "    if (!left_ok(left) || !right_ok(right)) {");
  pushLine(lines, "      return -1;");
  pushLine(lines, "    }");
  pushLine(lines, "    graph_[left].push_back(right);");
  pushLine(lines, "    return static_cast<int>(graph_[left].size()) - 1;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${names.resultStructName} ${names.maximumMatchingName}() {`);
  pushLine(lines, `    ${names.resultStructName} result;`);
  pushLine(lines, `    result.${names.matchLeftName}.assign(n_left_, -1);`);
  pushLine(lines, `    result.${names.matchRightName}.assign(n_right_, -1);`);
  pushLine(lines, `    result.${names.matchingSizeName} = 0;`);
  pushLine(lines, "    if (n_left_ == 0 || n_right_ == 0) {");
  pushLine(lines, "      return result;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    for (int left = 0; left < n_left_; ++left) {");
  pushLine(lines, "      for (int right : graph_[left]) {");
  pushLine(
    lines,
    `        if (!right_ok(right) || result.${names.matchRightName}[right] != -1) {`
  );
  pushLine(lines, "          continue;");
  pushLine(lines, "        }");
  pushLine(lines, `        result.${names.matchLeftName}[left] = right;`);
  pushLine(lines, `        result.${names.matchRightName}[right] = left;`);
  pushLine(lines, `        ++result.${names.matchingSizeName};`);
  pushLine(lines, "        break;");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    std::fill(used_.begin(), used_.end(), 0);");
  pushLine(lines, "    visit_token_ = 1;");
  pushLine(lines, "    for (int left = 0; left < n_left_; ++left) {");
  pushLine(lines, `      if (result.${names.matchLeftName}[left] != -1) {`);
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines, "      ++visit_token_;");
  pushLine(lines, "      if (visit_token_ == std::numeric_limits<int>::max()) {");
  pushLine(lines, "        std::fill(used_.begin(), used_.end(), 0);");
  pushLine(lines, "        visit_token_ = 1;");
  pushLine(lines, "      }");
  pushLine(
    lines,
    `      if (${names.tryAugmentName}(left, result.${names.matchLeftName}, result.${names.matchRightName})) {`
  );
  pushLine(lines, `        ++result.${names.matchingSizeName};`);
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "    return result;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  int n_left_;");
  pushLine(lines, "  int n_right_;");
  pushLine(lines, "  std::vector<std::vector<int>> graph_;");
  pushLine(lines, "  std::vector<int> used_;");
  pushLine(lines, "  int visit_token_;");
  pushLine(lines);
  pushLine(lines, "  bool left_ok(int v) const { return v >= 0 && v < n_left_; }");
  pushLine(lines);
  pushLine(lines, "  bool right_ok(int v) const { return v >= 0 && v < n_right_; }");
  pushLine(lines);
  pushLine(
    lines,
    `  bool ${names.tryAugmentName}(int left, std::vector<int>& match_left,`
  );
  pushLine(lines, "                   std::vector<int>& match_right) {");
  pushLine(lines, "    if (!left_ok(left) || used_[left] == visit_token_) {");
  pushLine(lines, "      return false;");
  pushLine(lines, "    }");
  pushLine(lines, "    used_[left] = visit_token_;");
  pushLine(lines);
  pushLine(lines, "    for (int right : graph_[left]) {");
  pushLine(lines, "      if (!right_ok(right)) {");
  pushLine(lines, "        continue;");
  pushLine(lines, "      }");
  pushLine(lines, "      const int matched_left = match_right[right];");
  pushLine(
    lines,
    `      if (matched_left == -1 || ${names.tryAugmentName}(matched_left, match_left, match_right)) {`
  );
  pushLine(lines, "        match_left[left] = right;");
  pushLine(lines, "        match_right[right] = left;");
  pushLine(lines, "        return true;");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "    return false;");
  pushLine(lines, "  }");
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(
    lines,
    `inline ${names.resultStructName} ${names.matchFunctionName}(const std::vector<std::vector<int>>& graph,`
  );
  pushLine(lines, "                                        int right_size) {");
  pushLine(
    lines,
    `  ${names.className} matcher(static_cast<int>(graph.size()), right_size);`
  );
  pushLine(lines, "  for (int left = 0; left < static_cast<int>(graph.size()); ++left) {");
  pushLine(lines, "    for (int right : graph[left]) {");
  pushLine(lines, `      matcher.${names.addEdgeName}(left, right);`);
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines, `  return matcher.${names.maximumMatchingName}();`);
  pushLine(lines, "}");

  if (features.has("vertex_cover")) {
    pushLine(lines);
    pushLine(lines, `struct ${names.coverStructName} {`);
    pushLine(lines, `  std::vector<int> ${names.leftCoverName};`);
    pushLine(lines, `  std::vector<int> ${names.rightCoverName};`);
    pushLine(lines);
    pushLine(lines, "  int size() const {");
    pushLine(
      lines,
      `    return static_cast<int>(${names.leftCoverName}.size() + ${names.rightCoverName}.size());`
    );
    pushLine(lines, "  }");
    pushLine(lines, "};");
    pushLine(lines);
    pushLine(
      lines,
      `inline ${names.coverStructName} ${names.vertexCoverFunctionName}(`
    );
    pushLine(lines, "    const std::vector<std::vector<int>>& graph, int right_size,");
    pushLine(lines, `    const ${names.resultStructName}& matching) {`);
    pushLine(lines, "  const int left_size = static_cast<int>(graph.size());");
    pushLine(lines, `  ${names.coverStructName} cover;`);
    pushLine(lines, "  if (left_size == 0 || right_size <= 0) {");
    pushLine(lines, "    return cover;");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  std::vector<char> visited_left(left_size, 0);");
    pushLine(lines, "  std::vector<char> visited_right(static_cast<std::size_t>(right_size), 0);");
    pushLine(lines, "  std::queue<int> q;");
    pushLine(lines);
    pushLine(lines, "  for (int left = 0; left < left_size; ++left) {");
    pushLine(
      lines,
      `    if (left < static_cast<int>(matching.${names.matchLeftName}.size()) &&`
    );
    pushLine(lines, `        matching.${names.matchLeftName}[left] != -1) {`);
    pushLine(lines, "      continue;");
    pushLine(lines, "    }");
    pushLine(lines, "    visited_left[left] = 1;");
    pushLine(lines, "    q.push(left);");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  while (!q.empty()) {");
    pushLine(lines, "    const int left = q.front();");
    pushLine(lines, "    q.pop();");
    pushLine(lines, "    for (int right : graph[left]) {");
    pushLine(lines, "      if (right < 0 || right >= right_size) {");
    pushLine(lines, "        continue;");
    pushLine(lines, "      }");
    pushLine(
      lines,
      `      if (left < static_cast<int>(matching.${names.matchLeftName}.size()) &&`
    );
    pushLine(lines, `          matching.${names.matchLeftName}[left] == right) {`);
    pushLine(lines, "        continue;");
    pushLine(lines, "      }");
    pushLine(lines, "      if (visited_right[right]) {");
    pushLine(lines, "        continue;");
    pushLine(lines, "      }");
    pushLine(lines, "      visited_right[right] = 1;");
    pushLine(lines, `      if (right < static_cast<int>(matching.${names.matchRightName}.size())) {`);
    pushLine(lines, `        const int matched_left = matching.${names.matchRightName}[right];`);
    pushLine(lines, "        if (matched_left != -1 && !visited_left[matched_left]) {");
    pushLine(lines, "          visited_left[matched_left] = 1;");
    pushLine(lines, "          q.push(matched_left);");
    pushLine(lines, "        }");
    pushLine(lines, "      }");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  for (int left = 0; left < left_size; ++left) {");
    pushLine(lines, "    if (!visited_left[left]) {");
    pushLine(lines, `      cover.${names.leftCoverName}.push_back(left);`);
    pushLine(lines, "    }");
    pushLine(lines, "  }");
    pushLine(lines, "  for (int right = 0; right < right_size; ++right) {");
    pushLine(lines, "    if (visited_right[right]) {");
    pushLine(lines, `      cover.${names.rightCoverName}.push_back(right);`);
    pushLine(lines, "    }");
    pushLine(lines, "  }");
    pushLine(lines, "  return cover;");
    pushLine(lines, "}");
    pushLine(lines);
    pushLine(
      lines,
      `inline ${names.coverStructName} ${names.vertexCoverFunctionName}(`
    );
    pushLine(lines, "    const std::vector<std::vector<int>>& graph, int right_size) {");
    pushLine(
      lines,
      `  const ${names.resultStructName} matching = ${names.matchFunctionName}(graph, right_size);`
    );
    pushLine(lines, `  return ${names.vertexCoverFunctionName}(graph, right_size, matching);`);
    pushLine(lines, "}");
  }

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderKuhnUsage(options, features));
  }

  const sections: Partial<Record<SolutionSection, string[]>> = {
    helpers: [lines.join("\n")]
  };
  if (options.generateInput) {
    sections.solve = [renderKuhnSolveSection(options)];
  }

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
  const names = options.names;
  const opName = implicitTreapOpName(options);
  const typeArgs =
    options.aggregate === "custom"
      ? `<${options.valueType}, ${opName}<${options.valueType}>>`
      : `<${options.valueType}>`;
  const lines = ["/*", "Inclusive [l, r] ranges:"];
  lines.push(`${names.className}${typeArgs} treap;`);
  lines.push("treap.push_back(x);");
  lines.push("treap.insert(pos, x);");
  lines.push(`auto total = treap.range_query(l, r);`);
  if (features.has("reverse")) {
    lines.push(`treap.${names.reverseName}(l, r);`);
  }
  if (features.has("range_add")) {
    lines.push(`treap.${names.addName}(l, r, delta);`);
  }
  lines.push("auto values = treap.to_vector();");
  lines.push("*/");
  return lines.join("\n");
}

function renderImplicitTreapUsageSnippet(
  options: ImplicitTreapOptions,
  features: Set<ImplicitTreapFeature>
): string {
  const usageMode = options.usageMode ?? "helper_only";
  if (usageMode === "helper_only") {
    return "";
  }

  const names = options.names;
  const opName = implicitTreapOpName(options);
  const typeArgs =
    options.aggregate === "custom"
      ? `<${options.valueType}, ${opName}<${options.valueType}>>`
      : `<${options.valueType}>`;
  const source = options.sourceName?.trim() || "a";
  const n = options.sizeExpression?.trim() || "n";
  const instance = sanitizeIdentifier(options.instanceName ?? "treap", "treap");
  const answer = sanitizeIdentifier(options.answerName ?? "ans", "ans");
  const lines: string[] = [];

  if (options.sourceMode === "read_loop") {
    pushLine(lines, `vector<${options.valueType}> ${source}(${n});`);
    pushLine(lines, `for (int i = 0; i < ${n}; ++i) cin >> ${source}[i];`);
  }
  pushLine(lines, `${names.className}${typeArgs} ${instance};`);
  if (options.sourceMode === "existing_vector" || options.sourceMode === "read_loop") {
    pushLine(lines, `${instance}.assign(${source}.begin(), ${source}.end());`);
  }

  if (usageMode !== "query_loop") {
    return lines.join("\n");
  }

  pushLine(lines, "int q;");
  pushLine(lines, "cin >> q;");
  pushLine(lines, "while (q--) {");
  pushLine(lines, "  int type;");
  pushLine(lines, "  cin >> type;");
  pushLine(lines, "  if (type == 1) {");
  pushLine(lines, "    int pos;");
  pushLine(lines, `    ${options.valueType} x;`);
  pushLine(lines, "    cin >> pos >> x;");
  if (options.indexing === "one_based_input") {
    pushLine(lines, "    --pos;");
  }
  pushLine(lines, `    ${instance}.insert(pos, x);`);
  pushLine(lines, "  } else if (type == 2) {");
  pushLine(lines, "    int pos;");
  pushLine(lines, "    cin >> pos;");
  if (options.indexing === "one_based_input") {
    pushLine(lines, "    --pos;");
  }
  pushLine(lines, `    ${instance}.erase(pos);`);
  pushLine(lines, "  } else if (type == 3) {");
  pushLine(lines, "    int l, r;");
  pushLine(lines, "    cin >> l >> r;");
  if (options.indexing === "one_based_input") {
    pushLine(lines, "    --l; --r;");
  }
  pushLine(lines, `    auto ${answer} = ${instance}.range_query(l, r);`);
  pushLine(lines, `    cout << ${answer} << '\\n';`);
  if (features.has("reverse")) {
    pushLine(lines, "  } else if (type == 4) {");
    pushLine(lines, "    int l, r;");
    pushLine(lines, "    cin >> l >> r;");
    if (options.indexing === "one_based_input") {
      pushLine(lines, "    --l; --r;");
    }
    pushLine(lines, `    ${instance}.${names.reverseName}(l, r);`);
  }
  if (features.has("range_add")) {
    pushLine(lines, features.has("reverse") ? "  } else if (type == 5) {" : "  } else if (type == 4) {");
    pushLine(lines, "    int l, r;");
    pushLine(lines, `    ${options.valueType} delta;`);
    pushLine(lines, "    cin >> l >> r >> delta;");
    if (options.indexing === "one_based_input") {
      pushLine(lines, "    --l; --r;");
    }
    pushLine(lines, `    ${instance}.${names.addName}(l, r, delta);`);
  }
  pushLine(lines, "  }");
  pushLine(lines, "}");
  return lines.join("\n");
}

function renderImplicitTreapOp(
  options: ImplicitTreapOptions,
  features: Set<ImplicitTreapFeature>
): string {
  const opName = implicitTreapOpName(options);
  const hasRangeAdd = features.has("range_add");
  const lines: string[] = [];

  pushLine(lines, "template <typename T>");
  pushLine(lines, `struct ${opName} {`);
  if (options.aggregate === "custom") {
    pushLine(lines, "  static T neutral() { return T(); }");
    pushLine(lines);
    pushLine(lines, "  static T combine(const T& lhs, const T& rhs) {");
    pushLine(lines, "    // TODO: replace with the problem-specific aggregate merge.");
    pushLine(lines, "    return lhs + rhs;");
    pushLine(lines, "  }");
    if (hasRangeAdd) {
      pushLine(lines);
      pushLine(
        lines,
        "  static void apply_delta(T& value, T& aggregate, int size, const T& delta) {"
      );
      pushLine(lines, "    (void)size;");
      pushLine(lines, "    value += delta;");
      pushLine(lines, "    // TODO: update aggregate for the custom lazy-add semantics.");
      pushLine(lines, "    aggregate += delta;");
      pushLine(lines, "  }");
    }
  } else {
    pushLine(lines, "  static T neutral() { return T(0); }");
    pushLine(
      lines,
      "  static T combine(const T& lhs, const T& rhs) { return lhs + rhs; }"
    );
    if (hasRangeAdd) {
      pushLine(lines);
      pushLine(
        lines,
        "  static void apply_delta(T& value, T& aggregate, int size, const T& delta) {"
      );
      pushLine(lines, "    value += delta;");
      pushLine(lines, "    aggregate += delta * static_cast<T>(size);");
      pushLine(lines, "  }");
    }
  }
  pushLine(lines, "};");
  return lines.join("\n");
}

export function renderImplicitTreapRecipe(
  options: ImplicitTreapOptions
): RenderedRecipe {
  const names = options.names;
  const features = implicitTreapFeatureSet(options.features);
  const hasReverse = features.has("reverse");
  const hasRangeAdd = features.has("range_add");
  const opName = implicitTreapOpName(options);
  const rootField = `${names.rootName}_`;
  const rngField = `${names.rngName}_`;
  const lines: string[] = [];

  pushLine(lines, renderImplicitTreapOp(options, features));
  pushLine(lines);
  pushLine(lines, "template <typename T, typename Op = " + `${opName}<T>>`);
  pushLine(lines, `class ${names.className} {`);
  pushLine(lines, " private:");
  pushLine(lines, `  struct ${names.nodeName} {`);
  pushLine(lines, "    T value;");
  pushLine(lines, "    T aggregate;");
  pushLine(lines, "    unsigned priority;");
  pushLine(lines, "    int size;");
  pushLine(lines, `    ${names.nodeName}* left;`);
  pushLine(lines, `    ${names.nodeName}* right;`);
  if (hasReverse) {
    pushLine(lines, "    bool reversed;");
  }
  if (hasRangeAdd) {
    pushLine(lines, "    T lazy_add;");
  }
  pushLine(lines);
  pushLine(lines, `    ${names.nodeName}(const T& value_, unsigned priority_)`);
  const initializers = [
    "value(value_)",
    "aggregate(value_)",
    "priority(priority_)",
    "size(1)",
    "left(nullptr)",
    "right(nullptr)"
  ];
  if (hasReverse) {
    initializers.push("reversed(false)");
  }
  if (hasRangeAdd) {
    initializers.push("lazy_add(T(0))");
  }
  for (let i = 0; i < initializers.length; ++i) {
    const prefix = i === 0 ? "        : " : "          ";
    const suffix = i + 1 === initializers.length ? " {}" : ",";
    pushLine(lines, `${prefix}${initializers[i]}${suffix}`);
  }
  pushLine(lines, "  };");
  pushLine(lines);
  pushLine(lines, " public:");
  pushLine(lines, `  explicit ${names.className}(unsigned seed = 712367821u)`);
  pushLine(
    lines,
    `      : ${rootField}(nullptr), ${rngField}(seed == 0u ? 1u : seed) {}`
  );
  pushLine(lines);
  pushLine(lines, `  ~${names.className}() { clear(); }`);
  pushLine(lines);
  pushLine(lines, `  ${names.className}(const ${names.className}&) = delete;`);
  pushLine(
    lines,
    `  ${names.className}& operator=(const ${names.className}&) = delete;`
  );
  pushLine(lines);
  pushLine(lines, `  ${names.className}(${names.className}&& other) noexcept`);
  pushLine(
    lines,
    `      : ${rootField}(other.${rootField}), ${rngField}(other.${rngField}) {`
  );
  pushLine(lines, `    other.${rootField} = nullptr;`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  ${names.className}& operator=(${names.className}&& other) noexcept {`
  );
  pushLine(lines, "    if (this == &other) {");
  pushLine(lines, "      return *this;");
  pushLine(lines, "    }");
  pushLine(lines, "    clear();");
  pushLine(lines, `    ${rootField} = other.${rootField};`);
  pushLine(lines, `    ${rngField} = other.${rngField};`);
  pushLine(lines, `    other.${rootField} = nullptr;`);
  pushLine(lines, "    return *this;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void clear() {");
  pushLine(lines, `    clear_node(${rootField});`);
  pushLine(lines, `    ${rootField} = nullptr;`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  int size() const { return node_size(${rootField}); }`);
  pushLine(lines);
  pushLine(lines, `  bool empty() const { return ${rootField} == nullptr; }`);
  pushLine(lines);
  pushLine(lines, "  void push_back(const T& value) { insert(size(), value); }");
  pushLine(lines);
  pushLine(lines, "  void insert(int position, const T& value) {");
  pushLine(lines, "    if (position < 0) {");
  pushLine(lines, "      position = 0;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (position > size()) {");
  pushLine(lines, "      position = size();");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, `    ${names.nodeName}* node = new ${names.nodeName}(value, next_priority());`);
  pushLine(
    lines,
    `    std::pair<${names.nodeName}*, ${names.nodeName}*> parts = ${names.splitName}(${rootField}, position);`
  );
  pushLine(lines, `    ${rootField} = ${names.mergeName}(${names.mergeName}(parts.first, node), parts.second);`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  bool erase(int position, T* erased_value = nullptr) {");
  pushLine(lines, "    if (position < 0 || position >= size()) {");
  pushLine(lines, "      return false;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(
    lines,
    `    std::pair<${names.nodeName}*, ${names.nodeName}*> left_mid = ${names.splitName}(${rootField}, position);`
  );
  pushLine(
    lines,
    `    std::pair<${names.nodeName}*, ${names.nodeName}*> mid_right = ${names.splitName}(left_mid.second, 1);`
  );
  pushLine(lines);
  pushLine(lines, "    if (mid_right.first == nullptr) {");
  pushLine(lines, `      ${rootField} = ${names.mergeName}(left_mid.first, mid_right.second);`);
  pushLine(lines, "      return false;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    if (erased_value != nullptr) {");
  pushLine(lines, "      *erased_value = mid_right.first->value;");
  pushLine(lines, "    }");
  pushLine(lines, "    clear_node(mid_right.first);");
  pushLine(lines, `    ${rootField} = ${names.mergeName}(left_mid.first, mid_right.second);`);
  pushLine(lines, "    return true;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  bool get(int position, T& out) {");
  pushLine(lines, "    if (position < 0 || position >= size()) {");
  pushLine(lines, "      return false;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, `    ${names.nodeName}* node = ${rootField};`);
  pushLine(lines, "    int index = position;");
  pushLine(lines, "    while (node != nullptr) {");
  pushLine(lines, "      push(node);");
  pushLine(lines, "      const int left_size = node_size(node->left);");
  pushLine(lines, "      if (index < left_size) {");
  pushLine(lines, "        node = node->left;");
  pushLine(lines, "      } else if (index == left_size) {");
  pushLine(lines, "        out = node->value;");
  pushLine(lines, "        return true;");
  pushLine(lines, "      } else {");
  pushLine(lines, "        index -= left_size + 1;");
  pushLine(lines, "        node = node->right;");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines, "    return false;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  bool set(int position, const T& value) {");
  pushLine(lines, "    if (position < 0 || position >= size()) {");
  pushLine(lines, "      return false;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(
    lines,
    `    std::pair<${names.nodeName}*, ${names.nodeName}*> left_mid = ${names.splitName}(${rootField}, position);`
  );
  pushLine(
    lines,
    `    std::pair<${names.nodeName}*, ${names.nodeName}*> mid_right = ${names.splitName}(left_mid.second, 1);`
  );
  pushLine(lines, "    if (mid_right.first == nullptr) {");
  pushLine(lines, `      ${rootField} = ${names.mergeName}(left_mid.first, mid_right.second);`);
  pushLine(lines, "      return false;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    mid_right.first->value = value;");
  pushLine(lines, "    mid_right.first->aggregate = value;");
  pushLine(lines, "    clear_lazy(mid_right.first);");
  pushLine(lines, "    pull(mid_right.first);");
  pushLine(
    lines,
    `    ${rootField} = ${names.mergeName}(left_mid.first, ${names.mergeName}(mid_right.first, mid_right.second));`
  );
  pushLine(lines, "    return true;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  T range_query(int left, int right) {");
  pushLine(lines, "    if (!normalize_range(left, right)) {");
  pushLine(lines, "      return Op::neutral();");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(
    lines,
    `    std::pair<${names.nodeName}*, ${names.nodeName}*> left_mid = ${names.splitName}(${rootField}, left);`
  );
  pushLine(
    lines,
    `    std::pair<${names.nodeName}*, ${names.nodeName}*> mid_right = ${names.splitName}(left_mid.second, right - left + 1);`
  );
  pushLine(lines, "    const T answer = node_aggregate(mid_right.first);");
  pushLine(
    lines,
    `    ${rootField} = ${names.mergeName}(left_mid.first, ${names.mergeName}(mid_right.first, mid_right.second));`
  );
  pushLine(lines, "    return answer;");
  pushLine(lines, "  }");

  if (hasReverse) {
    pushLine(lines);
    pushLine(lines, `  void ${names.reverseName}(int left, int right) {`);
    pushLine(lines, "    if (!normalize_range(left, right)) {");
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(lines);
    pushLine(
      lines,
      `    std::pair<${names.nodeName}*, ${names.nodeName}*> left_mid = ${names.splitName}(${rootField}, left);`
    );
    pushLine(
      lines,
      `    std::pair<${names.nodeName}*, ${names.nodeName}*> mid_right = ${names.splitName}(left_mid.second, right - left + 1);`
    );
    pushLine(lines, "    apply_reverse(mid_right.first);");
    pushLine(
      lines,
      `    ${rootField} = ${names.mergeName}(left_mid.first, ${names.mergeName}(mid_right.first, mid_right.second));`
    );
    pushLine(lines, "  }");
  }

  if (hasRangeAdd) {
    pushLine(lines);
    pushLine(lines, `  void ${names.addName}(int left, int right, const T& delta) {`);
    pushLine(lines, "    if (!normalize_range(left, right)) {");
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(lines);
    pushLine(
      lines,
      `    std::pair<${names.nodeName}*, ${names.nodeName}*> left_mid = ${names.splitName}(${rootField}, left);`
    );
    pushLine(
      lines,
      `    std::pair<${names.nodeName}*, ${names.nodeName}*> mid_right = ${names.splitName}(left_mid.second, right - left + 1);`
    );
    pushLine(lines, "    apply_add(mid_right.first, delta);");
    pushLine(
      lines,
      `    ${rootField} = ${names.mergeName}(left_mid.first, ${names.mergeName}(mid_right.first, mid_right.second));`
    );
    pushLine(lines, "  }");
  }

  pushLine(lines);
  pushLine(lines, "  std::vector<T> to_vector() {");
  pushLine(lines, "    std::vector<T> values;");
  pushLine(lines, "    values.reserve(size());");
  pushLine(lines, `    collect_inorder(${rootField}, values);`);
  pushLine(lines, "    return values;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  template <typename It>");
  pushLine(lines, "  void assign(It begin, It end) {");
  pushLine(lines, "    clear();");
  pushLine(lines, "    for (It it = begin; it != end; ++it) {");
  pushLine(lines, "      push_back(*it);");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, `  ${names.nodeName}* ${rootField};`);
  pushLine(lines, `  unsigned ${rngField};`);
  pushLine(lines);
  pushLine(lines, `  static int node_size(${names.nodeName}* node) {`);
  pushLine(lines, "    return node == nullptr ? 0 : node->size;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  static T node_aggregate(${names.nodeName}* node) {`);
  pushLine(lines, "    return node == nullptr ? Op::neutral() : node->aggregate;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  static void clear_lazy(${names.nodeName}* node) {`);
  pushLine(lines, "    if (node == nullptr) {");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  if (hasReverse) {
    pushLine(lines, "    node->reversed = false;");
  }
  if (hasRangeAdd) {
    pushLine(lines, "    node->lazy_add = T(0);");
  }
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  static void pull(${names.nodeName}* node) {`);
  pushLine(lines, "    if (node == nullptr) {");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, "    node->size = 1 + node_size(node->left) + node_size(node->right);");
  pushLine(lines, "    node->aggregate = Op::combine(");
  pushLine(lines, "        Op::combine(node_aggregate(node->left), node->value),");
  pushLine(lines, "        node_aggregate(node->right));");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  static void clear_node(${names.nodeName}* node) {`);
  pushLine(lines, "    if (node == nullptr) {");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, "    clear_node(node->left);");
  pushLine(lines, "    clear_node(node->right);");
  pushLine(lines, "    delete node;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  unsigned next_priority() {");
  pushLine(lines, `    ${rngField} ^= ${rngField} << 7;`);
  pushLine(lines, `    ${rngField} ^= ${rngField} >> 9;`);
  pushLine(lines, `    ${rngField} ^= ${rngField} << 8;`);
  pushLine(lines, `    return ${rngField};`);
  pushLine(lines, "  }");

  if (hasReverse) {
    pushLine(lines);
    pushLine(lines, `  static void apply_reverse(${names.nodeName}* node) {`);
    pushLine(lines, "    if (node == nullptr) {");
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(lines, "    std::swap(node->left, node->right);");
    pushLine(lines, "    node->reversed = !node->reversed;");
    pushLine(lines, "  }");
  }

  if (hasRangeAdd) {
    pushLine(lines);
    pushLine(lines, `  static void apply_add(${names.nodeName}* node, const T& delta) {`);
    pushLine(lines, "    if (node == nullptr) {");
    pushLine(lines, "      return;");
    pushLine(lines, "    }");
    pushLine(
      lines,
      "    Op::apply_delta(node->value, node->aggregate, node->size, delta);"
    );
    pushLine(lines, "    node->lazy_add += delta;");
    pushLine(lines, "  }");
  }

  pushLine(lines);
  pushLine(lines, `  static void push(${names.nodeName}* node) {`);
  pushLine(lines, "    if (node == nullptr) {");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  if (hasReverse) {
    pushLine(lines, "    if (node->reversed) {");
    pushLine(lines, "      apply_reverse(node->left);");
    pushLine(lines, "      apply_reverse(node->right);");
    pushLine(lines, "      node->reversed = false;");
    pushLine(lines, "    }");
  }
  if (hasRangeAdd) {
    pushLine(lines, "    if (node->lazy_add != T(0)) {");
    pushLine(lines, "      apply_add(node->left, node->lazy_add);");
    pushLine(lines, "      apply_add(node->right, node->lazy_add);");
    pushLine(lines, "      node->lazy_add = T(0);");
    pushLine(lines, "    }");
  }
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  static std::pair<${names.nodeName}*, ${names.nodeName}*> ${names.splitName}(${names.nodeName}* node, int left_size) {`
  );
  pushLine(lines, "    if (node == nullptr) {");
  pushLine(lines, "      return std::make_pair(nullptr, nullptr);");
  pushLine(lines, "    }");
  pushLine(lines, "    push(node);");
  pushLine(lines);
  pushLine(lines, "    if (node_size(node->left) >= left_size) {");
  pushLine(
    lines,
    `      std::pair<${names.nodeName}*, ${names.nodeName}*> parts = ${names.splitName}(node->left, left_size);`
  );
  pushLine(lines, "      node->left = parts.second;");
  pushLine(lines, "      pull(node);");
  pushLine(lines, "      return std::make_pair(parts.first, node);");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, `    std::pair<${names.nodeName}*, ${names.nodeName}*> parts =`);
  pushLine(
    lines,
    `        ${names.splitName}(node->right, left_size - node_size(node->left) - 1);`
  );
  pushLine(lines, "    node->right = parts.first;");
  pushLine(lines, "    pull(node);");
  pushLine(lines, "    return std::make_pair(node, parts.second);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  static ${names.nodeName}* ${names.mergeName}(${names.nodeName}* left, ${names.nodeName}* right) {`
  );
  pushLine(lines, "    if (left == nullptr) {");
  pushLine(lines, "      return right;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (right == nullptr) {");
  pushLine(lines, "      return left;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    if (left->priority > right->priority) {");
  pushLine(lines, "      push(left);");
  pushLine(lines, `      left->right = ${names.mergeName}(left->right, right);`);
  pushLine(lines, "      pull(left);");
  pushLine(lines, "      return left;");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    push(right);");
  pushLine(lines, `    right->left = ${names.mergeName}(left, right->left);`);
  pushLine(lines, "    pull(right);");
  pushLine(lines, "    return right;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  bool normalize_range(int& left, int& right) const {");
  pushLine(lines, "    if (left > right || right < 0 || left >= size()) {");
  pushLine(lines, "      return false;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (left < 0) {");
  pushLine(lines, "      left = 0;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (right >= size()) {");
  pushLine(lines, "      right = size() - 1;");
  pushLine(lines, "    }");
  pushLine(lines, "    return left <= right;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  static void collect_inorder(${names.nodeName}* node, std::vector<T>& out) {`
  );
  pushLine(lines, "    if (node == nullptr) {");
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, "    push(node);");
  pushLine(lines, "    collect_inorder(node->left, out);");
  pushLine(lines, "    out.push_back(node->value);");
  pushLine(lines, "    collect_inorder(node->right, out);");
  pushLine(lines, "  }");
  pushLine(lines, "};");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderImplicitTreapUsage(options, features));
  }

  const usage = renderImplicitTreapUsageSnippet(options, features);
  return createRenderedRecipe(
    usage === ""
      ? { helpers: [lines.join("\n")] }
      : { helpers: [lines.join("\n")], solve: [usage] },
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
  const names = options.names;
  const lines = [
    "/*",
    "Inclusive [l, r] queries:",
    `${names.className}<${options.valueType}> mst(${options.sourceName});`
  ];
  if (queries.has("count_less")) {
    lines.push(`auto lt = mst.${names.countLessName}(l, r, x);`);
  }
  if (queries.has("count_less_equal")) {
    lines.push(`auto le = mst.${names.countLessEqualName}(l, r, x);`);
  }
  if (queries.has("count_equal")) {
    lines.push(`auto eq = mst.${names.countEqualName}(l, r, x);`);
  }
  if (queries.has("count_in_range")) {
    lines.push(`auto inside = mst.${names.countInRangeName}(l, r, low, high);`);
  }
  if (queries.has("exists")) {
    lines.push(`bool found = mst.${names.existsName}(l, r, x);`);
  }
  lines.push("*/");
  return lines.join("\n");
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
  if (usageMode === "helper_only") {
    return "";
  }

  const names = options.names;
  const source = options.sourceName.trim() || "a";
  const n = options.sizeExpression?.trim() || "n";
  const instance = sanitizeIdentifier(options.instanceName ?? "mst", "mst");
  const answer = sanitizeIdentifier(options.answerName ?? "ans", "ans");
  const lines: string[] = [];

  if (options.sourceMode === "read_loop") {
    pushLine(lines, `vector<${options.valueType}> ${source}(${n});`);
    pushLine(lines, `for (int i = 0; i < ${n}; ++i) cin >> ${source}[i];`);
  }
  pushLine(lines, `${names.className}<${options.valueType}> ${instance}(${source});`);

  if (usageMode !== "query_loop") {
    return lines.join("\n");
  }

  const query = firstMergeSortTreeQuery(queries);
  pushLine(lines, "int q;");
  pushLine(lines, "cin >> q;");
  pushLine(lines, "while (q--) {");
  pushLine(lines, "  int l, r;");
  if (query === "count_in_range") {
    pushLine(lines, `  ${options.valueType} low, high;`);
    pushLine(lines, "  cin >> l >> r >> low >> high;");
  } else {
    pushLine(lines, `  ${options.valueType} x;`);
    pushLine(lines, "  cin >> l >> r >> x;");
  }
  if (options.indexing === "one_based_input") {
    pushLine(lines, "  --l; --r;");
  }
  if (query === "count_less") {
    pushLine(lines, `  auto ${answer} = ${instance}.${names.countLessName}(l, r, x);`);
  } else if (query === "count_less_equal") {
    pushLine(lines, `  auto ${answer} = ${instance}.${names.countLessEqualName}(l, r, x);`);
  } else if (query === "count_equal") {
    pushLine(lines, `  auto ${answer} = ${instance}.${names.countEqualName}(l, r, x);`);
  } else if (query === "count_in_range") {
    pushLine(lines, `  auto ${answer} = ${instance}.${names.countInRangeName}(l, r, low, high);`);
  } else {
    pushLine(lines, `  bool ${answer} = ${instance}.${names.existsName}(l, r, x);`);
  }
  pushLine(lines, `  cout << ${answer} << '\\n';`);
  pushLine(lines, "}");
  return lines.join("\n");
}

export function renderMergeSortTreeRecipe(
  options: MergeSortTreeOptions
): RenderedRecipe {
  const queries = mergeSortTreeQuerySet(options.queries);
  const names = options.names;
  const lines: string[] = [];

  pushLine(lines, "template <typename T>");
  pushLine(lines, `class ${names.className} {`);
  pushLine(lines, " public:");
  pushLine(lines, `  explicit ${names.className}(int n = 0) { reset(n); }`);
  pushLine(lines);
  pushLine(lines, `  explicit ${names.className}(const std::vector<T>& values) {`);
  pushLine(lines, `    ${names.buildName}(values);`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void reset(int n) {");
  pushLine(lines, "    n_ = n < 0 ? 0 : n;");
  pushLine(lines, `    ${names.storageName}.assign(4 * std::max(1, n_), std::vector<T>());`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  void ${names.buildName}(const std::vector<T>& values) {`);
  pushLine(lines, "    reset(static_cast<int>(values.size()));");
  pushLine(lines, "    if (n_ > 0) {");
  pushLine(lines, `      ${names.buildRecName}(1, 0, n_ - 1, values);`);
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int size() const { return n_; }");

  if (queries.has("count_less")) {
    pushLine(lines);
    pushLine(
      lines,
      `  int ${names.countLessName}(int left, int right, const T& x) const {`
    );
    pushLine(lines, `    if (!${names.normName}(left, right)) {`);
    pushLine(lines, "      return 0;");
    pushLine(lines, "    }");
    pushLine(
      lines,
      `    return ${names.countLessRecName}(1, 0, n_ - 1, left, right, x);`
    );
    pushLine(lines, "  }");
  }

  if (queries.has("count_less_equal")) {
    pushLine(lines);
    pushLine(
      lines,
      `  int ${names.countLessEqualName}(int left, int right, const T& x) const {`
    );
    pushLine(lines, `    if (!${names.normName}(left, right)) {`);
    pushLine(lines, "      return 0;");
    pushLine(lines, "    }");
    pushLine(
      lines,
      `    return ${names.countLessEqualRecName}(1, 0, n_ - 1, left, right, x);`
    );
    pushLine(lines, "  }");
  }

  if (queries.has("count_equal")) {
    pushLine(lines);
    pushLine(
      lines,
      `  int ${names.countEqualName}(int left, int right, const T& x) const {`
    );
    pushLine(lines, `    if (!${names.normName}(left, right)) {`);
    pushLine(lines, "      return 0;");
    pushLine(lines, "    }");
    pushLine(
      lines,
      `    return ${names.countInRangeRecName}(1, 0, n_ - 1, left, right, x, x);`
    );
    pushLine(lines, "  }");
  }

  if (queries.has("count_in_range")) {
    pushLine(lines);
    pushLine(
      lines,
      `  int ${names.countInRangeName}(int left, int right, const T& low,`
    );
    pushLine(lines, "                         const T& high) const {");
    pushLine(lines, `    if (high < low || !${names.normName}(left, right)) {`);
    pushLine(lines, "      return 0;");
    pushLine(lines, "    }");
    pushLine(
      lines,
      `    return ${names.countInRangeRecName}(1, 0, n_ - 1, left, right, low, high);`
    );
    pushLine(lines, "  }");
  }

  if (queries.has("exists")) {
    pushLine(lines);
    pushLine(
      lines,
      `  bool ${names.existsName}(int left, int right, const T& x) const {`
    );
    pushLine(lines, `    if (!${names.normName}(left, right)) {`);
    pushLine(lines, "      return false;");
    pushLine(lines, "    }");
    pushLine(
      lines,
      `    return ${names.existsRecName}(1, 0, n_ - 1, left, right, x);`
    );
    pushLine(lines, "  }");
  }

  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  int n_;");
  pushLine(lines, `  std::vector<std::vector<T>> ${names.storageName};`);
  pushLine(lines);
  pushLine(lines, `  bool ${names.normName}(int& left, int& right) const {`);
  pushLine(lines, "    if (n_ == 0 || left > right || right < 0 || left >= n_) {");
  pushLine(lines, "      return false;");
  pushLine(lines, "    }");
  pushLine(lines, "    left = std::max(left, 0);");
  pushLine(lines, "    right = std::min(right, n_ - 1);");
  pushLine(lines, "    return left <= right;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  void ${names.buildRecName}(int v, int tl, int tr, const std::vector<T>& values) {`
  );
  pushLine(lines, "    if (tl == tr) {");
  pushLine(lines, `      ${names.storageName}[v] = {values[tl]};`);
  pushLine(lines, "      return;");
  pushLine(lines, "    }");
  pushLine(lines, "    const int tm = (tl + tr) / 2;");
  pushLine(lines, `    ${names.buildRecName}(v * 2, tl, tm, values);`);
  pushLine(lines, `    ${names.buildRecName}(v * 2 + 1, tm + 1, tr, values);`);
  pushLine(
    lines,
    `    ${names.storageName}[v].resize(${names.storageName}[v * 2].size() + ${names.storageName}[v * 2 + 1].size());`
  );
  pushLine(
    lines,
    `    std::merge(${names.storageName}[v * 2].begin(), ${names.storageName}[v * 2].end(),`
  );
  pushLine(
    lines,
    `               ${names.storageName}[v * 2 + 1].begin(), ${names.storageName}[v * 2 + 1].end(),`
  );
  pushLine(lines, `               ${names.storageName}[v].begin());`);
  pushLine(lines, "  }");

  if (queries.has("count_less")) {
    pushLine(lines);
    pushLine(
      lines,
      `  int ${names.countLessRecName}(int v, int tl, int tr, int l, int r,`
    );
    pushLine(lines, "                         const T& x) const {");
    pushLine(lines, "    if (tl > r || tr < l) {");
    pushLine(lines, "      return 0;");
    pushLine(lines, "    }");
    pushLine(lines, "    if (l <= tl && tr <= r) {");
    pushLine(lines, "      return static_cast<int>(");
    pushLine(
      lines,
      `          std::lower_bound(${names.storageName}[v].begin(), ${names.storageName}[v].end(), x) -`
    );
    pushLine(lines, `          ${names.storageName}[v].begin());`);
    pushLine(lines, "    }");
    pushLine(lines, "    const int tm = (tl + tr) / 2;");
    pushLine(
      lines,
      `    return ${names.countLessRecName}(v * 2, tl, tm, l, r, x) +`
    );
    pushLine(
      lines,
      `           ${names.countLessRecName}(v * 2 + 1, tm + 1, tr, l, r, x);`
    );
    pushLine(lines, "  }");
  }

  if (queries.has("count_less_equal")) {
    pushLine(lines);
    pushLine(
      lines,
      `  int ${names.countLessEqualRecName}(int v, int tl, int tr, int l, int r,`
    );
    pushLine(lines, "                               const T& x) const {");
    pushLine(lines, "    if (tl > r || tr < l) {");
    pushLine(lines, "      return 0;");
    pushLine(lines, "    }");
    pushLine(lines, "    if (l <= tl && tr <= r) {");
    pushLine(lines, "      return static_cast<int>(");
    pushLine(
      lines,
      `          std::upper_bound(${names.storageName}[v].begin(), ${names.storageName}[v].end(), x) -`
    );
    pushLine(lines, `          ${names.storageName}[v].begin());`);
    pushLine(lines, "    }");
    pushLine(lines, "    const int tm = (tl + tr) / 2;");
    pushLine(
      lines,
      `    return ${names.countLessEqualRecName}(v * 2, tl, tm, l, r, x) +`
    );
    pushLine(
      lines,
      `           ${names.countLessEqualRecName}(v * 2 + 1, tm + 1, tr, l, r, x);`
    );
    pushLine(lines, "  }");
  }

  if (queries.has("count_equal") || queries.has("count_in_range")) {
    pushLine(lines);
    pushLine(
      lines,
      `  int ${names.countInRangeRecName}(int v, int tl, int tr, int l, int r,`
    );
    pushLine(lines, "                            const T& low, const T& high) const {");
    pushLine(lines, "    if (tl > r || tr < l) {");
    pushLine(lines, "      return 0;");
    pushLine(lines, "    }");
    pushLine(lines, "    if (l <= tl && tr <= r) {");
    pushLine(lines, "      return static_cast<int>(");
    pushLine(
      lines,
      `          std::upper_bound(${names.storageName}[v].begin(), ${names.storageName}[v].end(), high) -`
    );
    pushLine(
      lines,
      `          std::lower_bound(${names.storageName}[v].begin(), ${names.storageName}[v].end(), low));`
    );
    pushLine(lines, "    }");
    pushLine(lines, "    const int tm = (tl + tr) / 2;");
    pushLine(
      lines,
      `    return ${names.countInRangeRecName}(v * 2, tl, tm, l, r, low, high) +`
    );
    pushLine(
      lines,
      `           ${names.countInRangeRecName}(v * 2 + 1, tm + 1, tr, l, r, low, high);`
    );
    pushLine(lines, "  }");
  }

  if (queries.has("exists")) {
    pushLine(lines);
    pushLine(
      lines,
      `  bool ${names.existsRecName}(int v, int tl, int tr, int l, int r,`
    );
    pushLine(lines, "                        const T& x) const {");
    pushLine(lines, "    if (tl > r || tr < l) {");
    pushLine(lines, "      return false;");
    pushLine(lines, "    }");
    pushLine(lines, "    if (l <= tl && tr <= r) {");
    pushLine(lines, `      return std::binary_search(${names.storageName}[v].begin(),`);
    pushLine(lines, `                                ${names.storageName}[v].end(), x);`);
    pushLine(lines, "    }");
    pushLine(lines, "    const int tm = (tl + tr) / 2;");
    pushLine(
      lines,
      `    return ${names.existsRecName}(v * 2, tl, tm, l, r, x) ||`
    );
    pushLine(
      lines,
      `           ${names.existsRecName}(v * 2 + 1, tm + 1, tr, l, r, x);`
    );
    pushLine(lines, "  }");
  }

  pushLine(lines, "};");

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderMergeSortTreeUsage(options, queries));
  }

  const usage = renderMergeSortTreeUsageSnippet(options, queries);
  return createRenderedRecipe(
    usage === ""
      ? { helpers: [lines.join("\n")] }
      : { helpers: [lines.join("\n")], solve: [usage] },
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
  if (variants.has("gcd")) {
    lines.push(
      `${options.names.buildGcdName}(${options.sourceName});`,
      `auto g = ${options.names.queryGcdName}(l, r);`
    );
  }
  if (variants.has("bit_and")) {
    lines.push(
      `${options.names.buildBitAndName}(${options.sourceName});`,
      `auto common_bits = ${options.names.queryBitAndName}(l, r);`
    );
  }
  if (variants.has("bit_or")) {
    lines.push(
      `${options.names.buildBitOrName}(${options.sourceName});`,
      `auto any_bits = ${options.names.queryBitOrName}(l, r);`
    );
  }
  if (variants.has("custom")) {
    lines.push(
      `${options.names.buildCustomName}(${options.sourceName});`,
      `auto value = ${options.names.queryCustomName}(l, r);`
    );
  }
  lines.push("*/");
  return lines.join("\n");
}

function sparseTableVariantNames(
  options: SparseTableOptions,
  variant: SparseTableVariant
): { tableName: string; buildName: string; queryName: string; combineExpression: string } {
  const names = options.names;
  if (variant === "min") {
    return {
      tableName: names.minTableName,
      buildName: names.buildMinName,
      queryName: names.queryMinName,
      combineExpression: "lhs < rhs ? lhs : rhs"
    };
  }
  if (variant === "max") {
    return {
      tableName: names.maxTableName,
      buildName: names.buildMaxName,
      queryName: names.queryMaxName,
      combineExpression: "lhs < rhs ? rhs : lhs"
    };
  }
  if (variant === "gcd") {
    return {
      tableName: names.gcdTableName,
      buildName: names.buildGcdName,
      queryName: names.queryGcdName,
      combineExpression: "gcd(lhs, rhs)"
    };
  }
  if (variant === "bit_and") {
    return {
      tableName: names.bitAndTableName,
      buildName: names.buildBitAndName,
      queryName: names.queryBitAndName,
      combineExpression: "lhs & rhs"
    };
  }
  if (variant === "bit_or") {
    return {
      tableName: names.bitOrTableName,
      buildName: names.buildBitOrName,
      queryName: names.queryBitOrName,
      combineExpression: "lhs | rhs"
    };
  }
  return {
    tableName: names.customTableName,
    buildName: names.buildCustomName,
    queryName: names.queryCustomName,
    combineExpression: `${names.customCombineName}(lhs, rhs)`
  };
}

function renderSparseTableVariant(
  options: SparseTableOptions,
  variant: SparseTableVariant
): string[] {
  const names = options.names;
  const { tableName, buildName, queryName, combineExpression } =
    sparseTableVariantNames(options, variant);
  const lines: string[] = [];

  if (variant === "custom") {
    pushLine(lines, `${options.valueType} ${names.customCombineName}(${options.valueType} lhs, ${options.valueType} rhs) {`);
    pushLine(lines, "  // TODO: replace with an idempotent associative operation.");
    pushLine(lines, "  return lhs < rhs ? lhs : rhs;");
    pushLine(lines, "}");
    pushLine(lines);
  }

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
  if (usageMode === "helper_only") {
    return "";
  }

  const lines: string[] = [];
  const source = options.sourceName.trim() || "a";
  const n = options.sizeExpression?.trim() || "n";
  if (options.sourceMode === "read_loop") {
    pushLine(lines, `vector<${options.valueType}> ${source}(${n});`);
    pushLine(lines, `for (int i = 0; i < ${n}; ++i) cin >> ${source}[i];`);
  }

  for (const variant of variants) {
    const { buildName } = sparseTableVariantNames(options, variant);
    pushLine(lines, `${buildName}(${source});`);
  }

  if (usageMode === "query_loop") {
    const variant = firstSparseTableVariant(variants);
    const { queryName } = sparseTableVariantNames(options, variant);
    const answer = sanitizeIdentifier(options.answerName ?? "ans", "ans");
    pushLine(lines, "int q;");
    pushLine(lines, "cin >> q;");
    pushLine(lines, "while (q--) {");
    pushLine(lines, "  int l, r;");
    pushLine(lines, "  cin >> l >> r;");
    if (options.indexing === "one_based_input") {
      pushLine(lines, "  --l; --r;");
    }
    pushLine(lines, `  auto ${answer} = ${queryName}(l, r);`);
    pushLine(lines, `  cout << ${answer} << '\\n';`);
    pushLine(lines, "}");
  }

  return lines.join("\n");
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
  if (variants.has("gcd")) {
    pushLine(lines);
    lines.push(...renderSparseTableVariant(options, "gcd"));
  }
  if (variants.has("bit_and")) {
    pushLine(lines);
    lines.push(...renderSparseTableVariant(options, "bit_and"));
  }
  if (variants.has("bit_or")) {
    pushLine(lines);
    lines.push(...renderSparseTableVariant(options, "bit_or"));
  }
  if (variants.has("custom")) {
    pushLine(lines);
    lines.push(...renderSparseTableVariant(options, "custom"));
  }
  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderSparseTableCommentUsage(options, variants));
  }

  const usage = renderSparseTableUsageSnippet(options, variants);
  return createRenderedRecipe(
    usage === ""
      ? { helpers: [lines.join("\n")] }
      : { helpers: [lines.join("\n")], solve: [usage] },
    sparseTableExports(options, variants)
  );
}

export function renderSparseTable(options: SparseTableOptions): string {
  return composeRecipeSections(renderSparseTableRecipe(options));
}

export function defaultSuffixArrayFeatures(): SuffixArrayFeature[] {
  return ["rank", "lcp", "stripped_sa"];
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
  const names = options.names;
  const lines = ["/*", "Example:"];
  lines.push(`auto ${names.resultName} = ${suffixArrayBuildCall(options)};`);
  if (features.has("stripped_sa")) {
    lines.push(
      `auto ${names.saName} = ${names.removeEmptySuffixName}(${names.resultName});`
    );
  } else {
    lines.push(`const auto& ${names.saName} = ${names.resultName}.sa;`);
  }
  if (features.has("rank")) {
    lines.push(`const auto& ${names.rankName} = ${names.resultName}.rank;`);
  }
  if (features.has("lcp")) {
    lines.push(`const auto& ${names.lcpName} = ${names.resultName}.lcp;`);
  }
  if (features.has("lcp_rmq")) {
    lines.push(
      `${names.lcpSparseNames.buildMinName}(${names.resultName}.lcp);`,
      `int common = ${names.lcpRangeQueryName}(i, j, ${names.resultName});`
    );
  }
  lines.push("*/");
  return lines.join("\n");
}

function renderSuffixArrayHelpers(
  options: SuffixArrayOptions,
  features: Set<SuffixArrayFeature>
): string {
  const names = options.names;
  const needsRank = features.has("rank") || features.has("lcp");
  const lines: string[] = [];

  pushLine(lines, `struct ${names.resultStructName} {`);
  pushLine(lines, "  std::vector<int> sa;");
  if (features.has("lcp")) {
    pushLine(lines, "  std::vector<int> lcp;");
  }
  if (features.has("rank")) {
    pushLine(lines, "  std::vector<int> rank;");
  }
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(
    lines,
    `inline ${names.resultStructName} ${names.buildPositiveCodesName}(`
  );
  pushLine(
    lines,
    "    const std::vector<int>& positive_codes, int alphabet_limit = 0) {"
  );
  pushLine(lines, "  const int text_n = static_cast<int>(positive_codes.size());");
  pushLine(lines, "  const int n = text_n + 1;");
  pushLine(lines);
  pushLine(lines, "  std::vector<int> sequence(n, 0);");
  pushLine(lines, "  int lim = (alphabet_limit < 2 ? 2 : alphabet_limit);");
  pushLine(lines, "  for (int i = 0; i < text_n; ++i) {");
  pushLine(lines, "    const int code = (positive_codes[i] <= 0 ? 1 : positive_codes[i]);");
  pushLine(lines, "    sequence[i] = code;");
  pushLine(lines, "    if (code + 1 > lim) {");
  pushLine(lines, "      lim = code + 1;");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, `  ${names.resultStructName} result;`);
  pushLine(lines, "  result.sa.assign(n, 0);");
  if (features.has("lcp")) {
    pushLine(lines, "  result.lcp.assign(n, 0);");
  }
  if (features.has("rank")) {
    pushLine(lines, "  result.rank.assign(n, 0);");
  }
  pushLine(lines);
  pushLine(lines, "  std::vector<int> x = sequence;");
  pushLine(lines, "  std::vector<int> y(n, 0);");
  pushLine(lines, "  std::vector<int> ws(std::max(n, lim), 0);");
  pushLine(lines, "  std::iota(result.sa.begin(), result.sa.end(), 0);");
  pushLine(lines);
  pushLine(lines, "  for (int j = 0, p = 0; p < n; j = std::max(1, j * 2), lim = p) {");
  pushLine(lines, "    p = j;");
  pushLine(lines, "    std::iota(y.begin(), y.end(), n - j);");
  pushLine(lines, "    for (int i = 0; i < n; ++i) {");
  pushLine(lines, "      if (result.sa[i] >= j) {");
  pushLine(lines, "        y[p++] = result.sa[i] - j;");
  pushLine(lines, "      }");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    std::fill(ws.begin(), ws.begin() + lim, 0);");
  pushLine(lines, "    for (int i = 0; i < n; ++i) {");
  pushLine(lines, "      ++ws[x[i]];");
  pushLine(lines, "    }");
  pushLine(lines, "    for (int i = 1; i < lim; ++i) {");
  pushLine(lines, "      ws[i] += ws[i - 1];");
  pushLine(lines, "    }");
  pushLine(lines, "    for (int i = n - 1; i >= 0; --i) {");
  pushLine(lines, "      result.sa[--ws[x[y[i]]]] = y[i];");
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    std::swap(x, y);");
  pushLine(lines, "    p = 1;");
  pushLine(lines, "    x[result.sa[0]] = 0;");
  pushLine(lines, "    for (int i = 1; i < n; ++i) {");
  pushLine(lines, "      const int a = result.sa[i - 1];");
  pushLine(lines, "      const int b = result.sa[i];");
  pushLine(lines, "      const int a_second = (a + j < n ? y[a + j] : -1);");
  pushLine(lines, "      const int b_second = (b + j < n ? y[b + j] : -1);");
  pushLine(
    lines,
    "      x[b] = (y[a] == y[b] && a_second == b_second) ? p - 1 : p++;"
  );
  pushLine(lines, "    }");
  pushLine(lines, "  }");

  if (needsRank) {
    pushLine(lines);
    pushLine(lines, "  std::vector<int> rank(n, 0);");
    pushLine(lines, "  for (int i = 0; i < n; ++i) {");
    pushLine(lines, "    rank[result.sa[i]] = i;");
    pushLine(lines, "  }");
    if (features.has("rank")) {
      pushLine(lines, "  result.rank = rank;");
    }
  }

  if (features.has("lcp")) {
    pushLine(lines);
    pushLine(lines, "  for (int i = 0, k = 0; i < n - 1; ++i) {");
    pushLine(lines, "    const int r = rank[i];");
    pushLine(lines, "    const int j = result.sa[r - 1];");
    pushLine(
      lines,
      "    while (i + k < n && j + k < n && sequence[i + k] == sequence[j + k]) {"
    );
    pushLine(lines, "      ++k;");
    pushLine(lines, "    }");
    pushLine(lines, "    result.lcp[r] = k;");
    pushLine(lines, "    if (k > 0) {");
    pushLine(lines, "      --k;");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
  }

  pushLine(lines);
  pushLine(lines, "  return result;");
  pushLine(lines, "}");

  if (options.inputKind === "string") {
    pushLine(lines);
    pushLine(
      lines,
      `inline ${names.resultStructName} ${names.buildStringName}(const std::string& s) {`
    );
    pushLine(lines, "  std::vector<int> codes(s.size(), 0);");
    pushLine(lines, "  for (int i = 0; i < static_cast<int>(s.size()); ++i) {");
    pushLine(
      lines,
      "    codes[i] = static_cast<int>(static_cast<unsigned char>(s[i])) + 1;"
    );
    pushLine(lines, "  }");
    pushLine(lines, `  return ${names.buildPositiveCodesName}(codes, 257);`);
    pushLine(lines, "}");
  }

  if (options.inputKind === "ints") {
    pushLine(lines);
    pushLine(
      lines,
      `inline ${names.resultStructName} ${names.buildIntsName}(`
    );
    pushLine(lines, "    const std::vector<int>& values) {");
    pushLine(lines, "  std::vector<int> sorted_values = values;");
    pushLine(lines, "  std::sort(sorted_values.begin(), sorted_values.end());");
    pushLine(lines, "  sorted_values.erase(");
    pushLine(
      lines,
      "      std::unique(sorted_values.begin(), sorted_values.end()),"
    );
    pushLine(lines, "      sorted_values.end());");
    pushLine(lines);
    pushLine(lines, "  std::vector<int> codes(values.size(), 0);");
    pushLine(lines, "  for (int i = 0; i < static_cast<int>(values.size()); ++i) {");
    pushLine(lines, "    const int idx = static_cast<int>(std::lower_bound(sorted_values.begin(),");
    pushLine(lines, "                                                      sorted_values.end(),");
    pushLine(lines, "                                                      values[i]) -");
    pushLine(lines, "                                     sorted_values.begin());");
    pushLine(lines, "    codes[i] = idx + 1;");
    pushLine(lines, "  }");
    pushLine(lines, `  return ${names.buildPositiveCodesName}(`);
    pushLine(lines, "      codes, static_cast<int>(sorted_values.size()) + 1);");
    pushLine(lines, "}");
  }

  if (features.has("stripped_sa")) {
    pushLine(lines);
    pushLine(
      lines,
      `inline std::vector<int> ${names.removeEmptySuffixName}(`
    );
    pushLine(lines, `    const ${names.resultStructName}& result) {`);
    pushLine(lines, "  if (result.sa.empty()) {");
    pushLine(lines, "    return {};");
    pushLine(lines, "  }");
    pushLine(lines, "  const int empty_suffix_start = static_cast<int>(result.sa.size()) - 1;");
    pushLine(lines, "  std::vector<int> stripped;");
    pushLine(lines, "  stripped.reserve(result.sa.size() - 1);");
    pushLine(lines, "  for (int start : result.sa) {");
    pushLine(lines, "    if (start != empty_suffix_start) {");
    pushLine(lines, "      stripped.push_back(start);");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
    pushLine(lines, "  return stripped;");
    pushLine(lines, "}");
  }

  if (features.has("lcp_rmq")) {
    pushLine(lines);
    pushLine(
      lines,
      `inline int ${names.lcpRangeQueryName}(int left, int right,`
    );
    pushLine(lines, `                            const ${names.resultStructName}& result) {`);
    pushLine(lines, "  const int n = static_cast<int>(result.rank.size());");
    pushLine(lines, "  if (left < 0 || right < 0 || left >= n || right >= n) {");
    pushLine(lines, "    return 0;");
    pushLine(lines, "  }");
    pushLine(lines, "  if (left == right) {");
    pushLine(lines, "    return n - 1 - left;");
    pushLine(lines, "  }");
    pushLine(lines, "  int rank_left = result.rank[left];");
    pushLine(lines, "  int rank_right = result.rank[right];");
    pushLine(lines, "  if (rank_left > rank_right) {");
    pushLine(lines, "    std::swap(rank_left, rank_right);");
    pushLine(lines, "  }");
    pushLine(
      lines,
      `  return ${names.lcpSparseNames.queryMinName}(rank_left + 1, rank_right);`
    );
    pushLine(lines, "}");
  }

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderSuffixArrayUsage(options, features));
  }

  return `${lines.join("\n")}\n`;
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
  return ["fft", "ntt"];
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
  return new Set(transforms.length === 0 ? defaultFftNttTransforms() : transforms);
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
  const names = options.names;
  const lines = ["/*", "Example:"];
  if (options.includeConvolution) {
    if (transforms.has("fft")) {
      lines.push(`auto c = ${names.convolutionFftName}(a, b);`);
    }
    if (transforms.has("ntt")) {
      lines.push(`auto c_mod = ${names.convolutionNttName}(a, b);`);
    }
  } else {
    lines.push("Transform vectors must have power-of-two length.");
    if (transforms.has("fft")) {
      lines.push(
        `std::vector<std::complex<long double>> fa(n);`,
        `${names.fftTransformName}(fa, false);`,
        `${names.fftTransformName}(fa, true);`
      );
    }
    if (transforms.has("ntt")) {
      lines.push(
        `std::vector<int> fa(n);`,
        `${names.nttTransformName}(fa, false);`,
        `${names.nttTransformName}(fa, true);`
      );
    }
  }
  lines.push("*/");
  return lines.join("\n");
}

export function renderFftNttRecipe(options: FftNttOptions): RenderedRecipe {
  const transforms = fftNttTransformSet(options.transforms);
  const names = options.names;
  const lines: string[] = [];

  if (options.includeConvolution) {
    pushLine(lines, `inline int ${names.nextPowerName}(int n) {`);
    pushLine(lines, "  int p = 1;");
    pushLine(lines, "  while (p < n) {");
    pushLine(lines, "    p <<= 1;");
    pushLine(lines, "  }");
    pushLine(lines, "  return p;");
    pushLine(lines, "}");
    pushLine(lines);
  }

  pushLine(
    lines,
    `inline bool ${names.isPowerName}(int n) { return n > 0 && (n & (n - 1)) == 0; }`
  );
  pushLine(lines);
  pushLine(lines, "template <typename T>");
  pushLine(lines, `inline void ${names.bitReverseName}(std::vector<T>& a) {`);
  pushLine(lines, "  const int n = static_cast<int>(a.size());");
  pushLine(lines, "  for (int i = 1, j = 0; i < n; ++i) {");
  pushLine(lines, "    int bit = n >> 1;");
  pushLine(lines, "    while (j & bit) {");
  pushLine(lines, "      j ^= bit;");
  pushLine(lines, "      bit >>= 1;");
  pushLine(lines, "    }");
  pushLine(lines, "    j ^= bit;");
  pushLine(lines, "    if (i < j) {");
  pushLine(lines, "      std::swap(a[i], a[j]);");
  pushLine(lines, "    }");
  pushLine(lines, "  }");
  pushLine(lines, "}");

  if (transforms.has("fft")) {
    pushLine(lines);
    pushLine(
      lines,
      `inline bool ${names.fftTransformName}(std::vector<std::complex<long double>>& a,`
    );
    pushLine(lines, "                          bool invert = false) {");
    pushLine(lines, "  const int n = static_cast<int>(a.size());");
    pushLine(lines, "  if (n == 0) {");
    pushLine(lines, "    return true;");
    pushLine(lines, "  }");
    pushLine(lines, `  if (!${names.isPowerName}(n)) {`);
    pushLine(lines, "    return false;");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, `  ${names.bitReverseName}(a);`);
    pushLine(lines, "  const long double pi = std::acos(static_cast<long double>(-1));");
    pushLine(lines, "  for (int len = 2; len <= n; len <<= 1) {");
    pushLine(lines, "    const long double ang = (invert ? -2.0L : 2.0L) * pi / len;");
    pushLine(
      lines,
      "    const std::complex<long double> wlen(std::cos(ang), std::sin(ang));"
    );
    pushLine(lines, "    for (int i = 0; i < n; i += len) {");
    pushLine(lines, "      std::complex<long double> w(1.0L, 0.0L);");
    pushLine(lines, "      for (int j = 0; j < len / 2; ++j) {");
    pushLine(lines, "        const auto u = a[i + j];");
    pushLine(lines, "        const auto v = a[i + j + len / 2] * w;");
    pushLine(lines, "        a[i + j] = u + v;");
    pushLine(lines, "        a[i + j + len / 2] = u - v;");
    pushLine(lines, "        w *= wlen;");
    pushLine(lines, "      }");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  if (invert) {");
    pushLine(lines, "    const long double inv_n = 1.0L / static_cast<long double>(n);");
    pushLine(lines, "    for (auto& x : a) {");
    pushLine(lines, "      x *= inv_n;");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
    pushLine(lines, "  return true;");
    pushLine(lines, "}");

    if (options.includeConvolution) {
      pushLine(lines);
      pushLine(lines, "template <typename T>");
      pushLine(
        lines,
        `inline std::vector<long long> ${names.convolutionFftName}(const std::vector<T>& a,`
      );
      pushLine(lines, "                                                    const std::vector<T>& b) {");
      pushLine(lines, "  if (a.empty() || b.empty()) {");
      pushLine(lines, "    return {};");
      pushLine(lines, "  }");
      pushLine(lines, "  const int need = static_cast<int>(a.size() + b.size() - 1);");
      pushLine(lines, `  const int n = ${names.nextPowerName}(need);`);
      pushLine(lines, "  std::vector<std::complex<long double>> fa(n), fb(n);");
      pushLine(lines, "  for (int i = 0; i < static_cast<int>(a.size()); ++i) {");
      pushLine(lines, "    fa[i] = static_cast<long double>(a[i]);");
      pushLine(lines, "  }");
      pushLine(lines, "  for (int i = 0; i < static_cast<int>(b.size()); ++i) {");
      pushLine(lines, "    fb[i] = static_cast<long double>(b[i]);");
      pushLine(lines, "  }");
      pushLine(lines, `  ${names.fftTransformName}(fa, false);`);
      pushLine(lines, `  ${names.fftTransformName}(fb, false);`);
      pushLine(lines, "  for (int i = 0; i < n; ++i) {");
      pushLine(lines, "    fa[i] *= fb[i];");
      pushLine(lines, "  }");
      pushLine(lines, `  ${names.fftTransformName}(fa, true);`);
      pushLine(lines);
      pushLine(lines, "  std::vector<long long> result(need);");
      pushLine(lines, "  for (int i = 0; i < need; ++i) {");
      pushLine(lines, "    result[i] = static_cast<long long>(std::llround(fa[i].real()));");
      pushLine(lines, "  }");
      pushLine(lines, "  return result;");
      pushLine(lines, "}");
    }
  }

  if (transforms.has("ntt")) {
    pushLine(lines);
    pushLine(lines, `inline int ${names.nttPowName}(int a, long long e, int mod) {`);
    pushLine(lines, "  long long res = 1;");
    pushLine(lines, "  long long base = a % mod;");
    pushLine(lines, "  if (base < 0) {");
    pushLine(lines, "    base += mod;");
    pushLine(lines, "  }");
    pushLine(lines, "  while (e > 0) {");
    pushLine(lines, "    if (e & 1LL) {");
    pushLine(lines, "      res = res * base % mod;");
    pushLine(lines, "    }");
    pushLine(lines, "    base = base * base % mod;");
    pushLine(lines, "    e >>= 1LL;");
    pushLine(lines, "  }");
    pushLine(lines, "  return static_cast<int>(res);");
    pushLine(lines, "}");
    pushLine(lines);
    pushLine(lines, `inline bool ${names.nttTransformName}(std::vector<int>& a, bool invert = false,`);
    pushLine(lines, `                          int mod = ${options.modulusExpression},`);
    pushLine(lines, `                          int primitive_root = ${options.primitiveRootExpression}) {`);
    pushLine(lines, "  const int n = static_cast<int>(a.size());");
    pushLine(lines, "  if (n == 0) {");
    pushLine(lines, "    return true;");
    pushLine(lines, "  }");
    pushLine(lines, `  if (!${names.isPowerName}(n) || (mod - 1) % n != 0) {`);
    pushLine(lines, "    return false;");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, `  ${names.bitReverseName}(a);`);
    pushLine(lines, "  for (int len = 2; len <= n; len <<= 1) {");
    pushLine(lines, `    int wlen = ${names.nttPowName}(primitive_root, (mod - 1) / len, mod);`);
    pushLine(lines, "    if (invert) {");
    pushLine(lines, `      wlen = ${names.nttPowName}(wlen, mod - 2, mod);`);
    pushLine(lines, "    }");
    pushLine(lines, "    for (int i = 0; i < n; i += len) {");
    pushLine(lines, "      long long w = 1;");
    pushLine(lines, "      for (int j = 0; j < len / 2; ++j) {");
    pushLine(lines, "        const int u = a[i + j];");
    pushLine(lines, "        const int v = static_cast<int>(w * a[i + j + len / 2] % mod);");
    pushLine(lines, "        int x = u + v;");
    pushLine(lines, "        if (x >= mod) {");
    pushLine(lines, "          x -= mod;");
    pushLine(lines, "        }");
    pushLine(lines, "        int y = u - v;");
    pushLine(lines, "        if (y < 0) {");
    pushLine(lines, "          y += mod;");
    pushLine(lines, "        }");
    pushLine(lines, "        a[i + j] = x;");
    pushLine(lines, "        a[i + j + len / 2] = y;");
    pushLine(lines, "        w = w * wlen % mod;");
    pushLine(lines, "      }");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  if (invert) {");
    pushLine(lines, `    const int inv_n = ${names.nttPowName}(n, mod - 2, mod);`);
    pushLine(lines, "    for (int& x : a) {");
    pushLine(lines, "      x = static_cast<int>(1LL * x * inv_n % mod);");
    pushLine(lines, "    }");
    pushLine(lines, "  }");
    pushLine(lines, "  return true;");
    pushLine(lines, "}");

    if (options.includeConvolution) {
      pushLine(lines);
      pushLine(lines, "template <typename T>");
      pushLine(
        lines,
        `inline std::vector<int> ${names.convolutionNttName}(const std::vector<T>& a,`
      );
      pushLine(lines, "                                            const std::vector<T>& b,");
      pushLine(lines, `                                            int mod = ${options.modulusExpression},`);
      pushLine(lines, `                                            int primitive_root = ${options.primitiveRootExpression}) {`);
      pushLine(lines, "  if (a.empty() || b.empty()) {");
      pushLine(lines, "    return {};");
      pushLine(lines, "  }");
      pushLine(lines, "  const int need = static_cast<int>(a.size() + b.size() - 1);");
      pushLine(lines, `  const int n = ${names.nextPowerName}(need);`);
      pushLine(lines, "  std::vector<int> fa(n), fb(n);");
      pushLine(lines, "  for (int i = 0; i < static_cast<int>(a.size()); ++i) {");
      pushLine(lines, "    long long x = static_cast<long long>(a[i]) % mod;");
      pushLine(lines, "    if (x < 0) {");
      pushLine(lines, "      x += mod;");
      pushLine(lines, "    }");
      pushLine(lines, "    fa[i] = static_cast<int>(x);");
      pushLine(lines, "  }");
      pushLine(lines, "  for (int i = 0; i < static_cast<int>(b.size()); ++i) {");
      pushLine(lines, "    long long x = static_cast<long long>(b[i]) % mod;");
      pushLine(lines, "    if (x < 0) {");
      pushLine(lines, "      x += mod;");
      pushLine(lines, "    }");
      pushLine(lines, "    fb[i] = static_cast<int>(x);");
      pushLine(lines, "  }");
      pushLine(lines);
      pushLine(lines, `  if (!${names.nttTransformName}(fa, false, mod, primitive_root) ||`);
      pushLine(lines, `      !${names.nttTransformName}(fb, false, mod, primitive_root)) {`);
      pushLine(lines, "    return {};");
      pushLine(lines, "  }");
      pushLine(lines, "  for (int i = 0; i < n; ++i) {");
      pushLine(lines, "    fa[i] = static_cast<int>(1LL * fa[i] * fb[i] % mod);");
      pushLine(lines, "  }");
      pushLine(lines, `  if (!${names.nttTransformName}(fa, true, mod, primitive_root)) {`);
      pushLine(lines, "    return {};");
      pushLine(lines, "  }");
      pushLine(lines, "  fa.resize(need);");
      pushLine(lines, "  return fa;");
      pushLine(lines, "}");
    }
  }

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderFftNttUsage(options, transforms));
  }

  return createRenderedRecipe(
    { helpers: [lines.join("\n")] },
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
  const names = options.names;
  const lines = ["/*", "Half-open [l, r) substring hashes:"];
  lines.push(`${names.className} hash(${options.sourceName});`);
  lines.push(`auto value = hash.hash_substring(l, r);`);
  if (features.has("substring_equal")) {
    lines.push(`bool same = hash.equal_substrings(l1, r1, l2, r2);`);
  }
  if (features.has("concat")) {
    lines.push(`auto joined = hash.concat(left_hash, right_hash, right_length);`);
  }
  if (features.has("reverse")) {
    lines.push(`bool palindrome = hash.is_palindrome(l, r);`);
  }
  if (features.has("lcp")) {
    lines.push(`int common = hash.lcp(i, j);`);
  }
  lines.push("*/");
  return lines.join("\n");
}

export function renderPolyHashRecipe(options: PolyHashOptions): RenderedRecipe {
  const features = polyHashFeatureSet(options.features);
  const names = options.names;
  const constants: string[] = [];
  const lines: string[] = [];

  pushLine(constants, `constexpr int ${names.mod1Name} = ${options.mod1Expression};`);
  pushLine(constants, `constexpr int ${names.mod2Name} = ${options.mod2Expression};`);
  pushLine(constants, `constexpr int ${names.baseName} = ${options.baseExpression};`);

  pushLine(lines, `struct ${names.valueStructName} {`);
  pushLine(lines, "  int first;");
  pushLine(lines, "  int second;");
  pushLine(lines);
  pushLine(
    lines,
    `  ${names.valueStructName}(int first_ = 0, int second_ = 0)`
  );
  pushLine(lines, "      : first(first_), second(second_) {}");
  pushLine(lines, "};");
  pushLine(lines);
  pushLine(
    lines,
    `inline bool operator==(const ${names.valueStructName}& lhs, const ${names.valueStructName}& rhs) {`
  );
  pushLine(lines, "  return lhs.first == rhs.first && lhs.second == rhs.second;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(
    lines,
    `inline bool operator!=(const ${names.valueStructName}& lhs, const ${names.valueStructName}& rhs) {`
  );
  pushLine(lines, "  return !(lhs == rhs);");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(
    lines,
    `inline bool operator<(const ${names.valueStructName}& lhs, const ${names.valueStructName}& rhs) {`
  );
  pushLine(lines, "  if (lhs.first != rhs.first) {");
  pushLine(lines, "    return lhs.first < rhs.first;");
  pushLine(lines, "  }");
  pushLine(lines, "  return lhs.second < rhs.second;");
  pushLine(lines, "}");
  pushLine(lines);
  pushLine(lines, `class ${names.className} {`);
  pushLine(lines, " public:");
  pushLine(
    lines,
    `  explicit ${names.className}(const std::string& text = std::string(), int base = ${names.baseName}) {`
  );
  pushLine(lines, "    build(text, base);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  explicit ${names.className}(const std::vector<int>& values, int base = ${names.baseName}) {`
  );
  pushLine(lines, "    build(values, base);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  void build(const std::string& text, int base = ${names.baseName}) {`
  );
  pushLine(lines, "    std::vector<int> values;");
  pushLine(lines, "    values.reserve(text.size());");
  pushLine(lines, "    for (unsigned char ch : text) {");
  pushLine(lines, "      values.push_back(static_cast<int>(ch));");
  pushLine(lines, "    }");
  pushLine(lines, "    build_values(values, base);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  void build(const std::vector<int>& values, int base = ${names.baseName}) {`
  );
  pushLine(lines, "    build_values(values, base);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int size() const { return static_cast<int>(prefix1_.size()) - 1; }");
  pushLine(lines);
  pushLine(lines, "  int base() const { return base_; }");
  pushLine(lines);
  pushLine(
    lines,
    `  ${names.valueStructName} hash_prefix(int length) const {`
  );
  pushLine(lines, "    return hash_substring(0, length);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  ${names.valueStructName} hash_substring(int left, int right) const {`
  );
  pushLine(lines, "    const int n = size();");
  pushLine(lines, "    if (left < 0) {");
  pushLine(lines, "      left = 0;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (right > n) {");
  pushLine(lines, "      right = n;");
  pushLine(lines, "    }");
  pushLine(lines, "    if (left >= right) {");
  pushLine(lines, `      return ${names.valueStructName}(0, 0);`);
  pushLine(lines, "    }");
  pushLine(lines, "    return range_hash(prefix1_, prefix2_, left, right);");
  pushLine(lines, "  }");

  if (features.has("reverse")) {
    pushLine(lines);
    pushLine(
      lines,
      `  ${names.valueStructName} reverse_hash_substring(int left, int right) const {`
    );
    pushLine(lines, "    const int n = size();");
    pushLine(lines, "    if (left < 0) {");
    pushLine(lines, "      left = 0;");
    pushLine(lines, "    }");
    pushLine(lines, "    if (right > n) {");
    pushLine(lines, "      right = n;");
    pushLine(lines, "    }");
    pushLine(lines, "    if (left >= right) {");
    pushLine(lines, `      return ${names.valueStructName}(0, 0);`);
    pushLine(lines, "    }");
    pushLine(
      lines,
      "    return range_hash(reverse_prefix1_, reverse_prefix2_, n - right, n - left);"
    );
    pushLine(lines, "  }");
    pushLine(lines);
    pushLine(lines, "  bool is_palindrome(int left, int right) const {");
    pushLine(lines, "    return hash_substring(left, right) == reverse_hash_substring(left, right);");
    pushLine(lines, "  }");
  }

  pushLine(lines);
  pushLine(
    lines,
    `  std::vector<${names.valueStructName}> all_hashes_of_length(int length) const {`
  );
  pushLine(lines, "    const int n = size();");
  pushLine(lines, "    if (length < 0 || length > n) {");
  pushLine(lines, "      return {};");
  pushLine(lines, "    }");
  pushLine(lines, `    std::vector<${names.valueStructName}> hashes;`);
  pushLine(lines, "    hashes.reserve(n - length + 1);");
  pushLine(lines, "    for (int i = 0; i + length <= n; ++i) {");
  pushLine(lines, "      hashes.push_back(hash_substring(i, i + length));");
  pushLine(lines, "    }");
  pushLine(lines, "    return hashes;");
  pushLine(lines, "  }");

  if (features.has("substring_equal")) {
    pushLine(lines);
    pushLine(lines, "  bool equal_substrings(int left1, int right1, int left2, int right2) const {");
    pushLine(lines, "    if (right1 - left1 != right2 - left2) {");
    pushLine(lines, "      return false;");
    pushLine(lines, "    }");
    pushLine(lines, "    return hash_substring(left1, right1) == hash_substring(left2, right2);");
    pushLine(lines, "  }");
  }

  if (features.has("concat")) {
    pushLine(lines);
    pushLine(
      lines,
      `  ${names.valueStructName} concat(const ${names.valueStructName}& left,`
    );
    pushLine(
      lines,
      `                         const ${names.valueStructName}& right, int right_length) const {`
    );
    pushLine(lines, "    if (right_length < 0 || right_length >= static_cast<int>(power1_.size())) {");
    pushLine(lines, `      return ${names.valueStructName}(0, 0);`);
    pushLine(lines, "    }");
    pushLine(lines);
    pushLine(lines, "    const int merged1 =");
    pushLine(
      lines,
      "        static_cast<int>((static_cast<long long>(left.first) * power1_[right_length] +"
    );
    pushLine(lines, `                          right.first) % ${names.mod1Name});`);
    pushLine(lines, "    const int merged2 =");
    pushLine(
      lines,
      "        static_cast<int>((static_cast<long long>(left.second) * power2_[right_length] +"
    );
    pushLine(lines, `                          right.second) % ${names.mod2Name});`);
    pushLine(lines, `    return ${names.valueStructName}(merged1, merged2);`);
    pushLine(lines, "  }");
  }

  if (features.has("lcp")) {
    pushLine(lines);
    pushLine(lines, "  int lcp(int left1, int left2, int limit = -1) const {");
    pushLine(lines, "    const int n = size();");
    pushLine(lines, "    if (left1 < 0 || left2 < 0 || left1 >= n || left2 >= n) {");
    pushLine(lines, "      return 0;");
    pushLine(lines, "    }");
    pushLine(lines, "    int high = std::min(n - left1, n - left2);");
    pushLine(lines, "    if (limit >= 0 && limit < high) {");
    pushLine(lines, "      high = limit;");
    pushLine(lines, "    }");
    pushLine(lines, "    int low = 0;");
    pushLine(lines, "    while (low < high) {");
    pushLine(lines, "      const int mid = (low + high + 1) / 2;");
    pushLine(
      lines,
      "      if (hash_substring(left1, left1 + mid) == hash_substring(left2, left2 + mid)) {"
    );
    pushLine(lines, "        low = mid;");
    pushLine(lines, "      } else {");
    pushLine(lines, "        high = mid - 1;");
    pushLine(lines, "      }");
    pushLine(lines, "    }");
    pushLine(lines, "    return low;");
    pushLine(lines, "  }");
  }

  pushLine(lines);
  pushLine(lines, " private:");
  pushLine(lines, "  int base_;");
  pushLine(lines, "  int base_mod1_;");
  pushLine(lines, "  int base_mod2_;");
  pushLine(lines, "  std::vector<int> prefix1_;");
  pushLine(lines, "  std::vector<int> prefix2_;");
  pushLine(lines, "  std::vector<int> power1_;");
  pushLine(lines, "  std::vector<int> power2_;");
  if (features.has("reverse")) {
    pushLine(lines, "  std::vector<int> reverse_prefix1_;");
    pushLine(lines, "  std::vector<int> reverse_prefix2_;");
  }
  pushLine(lines);
  pushLine(lines, "  static int normalize_mod(long long value, int mod) {");
  pushLine(lines, "    long long x = value % mod;");
  pushLine(lines, "    if (x < 0) {");
  pushLine(lines, "      x += mod;");
  pushLine(lines, "    }");
  pushLine(lines, "    return static_cast<int>(x);");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(
    lines,
    `  ${names.valueStructName} range_hash(const std::vector<int>& prefix1,`
  );
  pushLine(lines, "                            const std::vector<int>& prefix2,");
  pushLine(lines, "                            int left, int right) const {");
  pushLine(lines, "    const int len = right - left;");
  pushLine(lines, "    int value1 =");
  pushLine(lines, "        prefix1[right] -");
  pushLine(
    lines,
    `        static_cast<int>((static_cast<long long>(prefix1[left]) * power1_[len]) % ${names.mod1Name});`
  );
  pushLine(lines, "    if (value1 < 0) {");
  pushLine(lines, `      value1 += ${names.mod1Name};`);
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, "    int value2 =");
  pushLine(lines, "        prefix2[right] -");
  pushLine(
    lines,
    `        static_cast<int>((static_cast<long long>(prefix2[left]) * power2_[len]) % ${names.mod2Name});`
  );
  pushLine(lines, "    if (value2 < 0) {");
  pushLine(lines, `      value2 += ${names.mod2Name};`);
  pushLine(lines, "    }");
  pushLine(lines);
  pushLine(lines, `    return ${names.valueStructName}(value1, value2);`);
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  int choose_base(int base) {");
  pushLine(lines, `    int mod1 = normalize_mod(base, ${names.mod1Name});`);
  pushLine(lines, `    int mod2 = normalize_mod(base, ${names.mod2Name});`);
  pushLine(lines, "    if (mod1 <= 1 || mod2 <= 1) {");
  pushLine(lines, `      base = ${names.baseName};`);
  pushLine(lines, `      mod1 = normalize_mod(base, ${names.mod1Name});`);
  pushLine(lines, `      mod2 = normalize_mod(base, ${names.mod2Name});`);
  pushLine(lines, "    }");
  pushLine(lines, "    base_mod1_ = mod1;");
  pushLine(lines, "    base_mod2_ = mod2;");
  pushLine(lines, "    return base;");
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  void push_prefix_value(long long raw_value, std::vector<int>& prefix1,");
  pushLine(lines, "                         std::vector<int>& prefix2) const {");
  pushLine(lines, `    const int value1 = normalize_mod(raw_value + 1, ${names.mod1Name});`);
  pushLine(lines, `    const int value2 = normalize_mod(raw_value + 1, ${names.mod2Name});`);
  pushLine(lines, "    prefix1.push_back(");
  pushLine(
    lines,
    `        static_cast<int>((static_cast<long long>(prefix1.back()) * base_mod1_ + value1) % ${names.mod1Name}));`
  );
  pushLine(lines, "    prefix2.push_back(");
  pushLine(
    lines,
    `        static_cast<int>((static_cast<long long>(prefix2.back()) * base_mod2_ + value2) % ${names.mod2Name}));`
  );
  pushLine(lines, "  }");
  pushLine(lines);
  pushLine(lines, "  template <typename Container>");
  pushLine(lines, "  void build_values(const Container& values, int base) {");
  pushLine(lines, "    base_ = choose_base(base);");
  pushLine(lines, "    const int n = static_cast<int>(values.size());");
  pushLine(lines);
  pushLine(lines, "    prefix1_.assign(1, 0);");
  pushLine(lines, "    prefix2_.assign(1, 0);");
  pushLine(lines, "    power1_.assign(n + 1, 1);");
  pushLine(lines, "    power2_.assign(n + 1, 1);");
  if (features.has("reverse")) {
    pushLine(lines, "    reverse_prefix1_.assign(1, 0);");
    pushLine(lines, "    reverse_prefix2_.assign(1, 0);");
  }
  pushLine(lines);
  pushLine(lines, "    for (int i = 0; i < n; ++i) {");
  pushLine(
    lines,
    `      power1_[i + 1] = static_cast<int>((static_cast<long long>(power1_[i]) * base_mod1_) % ${names.mod1Name});`
  );
  pushLine(
    lines,
    `      power2_[i + 1] = static_cast<int>((static_cast<long long>(power2_[i]) * base_mod2_) % ${names.mod2Name});`
  );
  pushLine(lines, "      push_prefix_value(static_cast<long long>(values[i]), prefix1_, prefix2_);");
  pushLine(lines, "    }");
  if (features.has("reverse")) {
    pushLine(lines);
    pushLine(lines, "    for (int i = n - 1; i >= 0; --i) {");
    pushLine(
      lines,
      "      push_prefix_value(static_cast<long long>(values[i]), reverse_prefix1_, reverse_prefix2_);"
    );
    pushLine(lines, "    }");
  }
  pushLine(lines, "  }");
  pushLine(lines, "};");
  pushLine(lines);
  if (options.inputKind === "vector_int") {
    pushLine(
      lines,
      `inline ${names.valueStructName} ${names.hashVectorName}(const std::vector<int>& values,`
    );
    pushLine(lines, `                                      int base = ${names.baseName}) {`);
    pushLine(lines, `  ${names.className} hash(values, base);`);
    pushLine(lines, "  return hash.hash_prefix(static_cast<int>(values.size()));");
    pushLine(lines, "}");
  } else {
    pushLine(
      lines,
      `inline ${names.valueStructName} ${names.hashStringName}(const std::string& text,`
    );
    pushLine(lines, `                                      int base = ${names.baseName}) {`);
    pushLine(lines, `  ${names.className} hash(text, base);`);
    pushLine(lines, "  return hash.hash_prefix(static_cast<int>(text.size()));");
    pushLine(lines, "}");
  }

  if (features.has("substring_equal")) {
    pushLine(lines);
    pushLine(
      lines,
      `inline bool ${names.equalFunctionName}(const ${names.className}& lhs,`
    );
    pushLine(lines, "                                       int left1, int right1,");
    pushLine(
      lines,
      `                                       const ${names.className}& rhs,`
    );
    pushLine(lines, "                                       int left2, int right2) {");
    pushLine(lines, "  if (lhs.base() != rhs.base() || right1 - left1 != right2 - left2) {");
    pushLine(lines, "    return false;");
    pushLine(lines, "  }");
    pushLine(lines, "  return lhs.hash_substring(left1, right1) == rhs.hash_substring(left2, right2);");
    pushLine(lines, "}");
  }

  if (options.includeUsageComment) {
    pushLine(lines);
    pushLine(lines, renderPolyHashUsage(options, features));
  }

  return createRenderedRecipe(
    { constants: [constants.join("\n")], helpers: [lines.join("\n")] },
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

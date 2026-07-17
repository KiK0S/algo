const core = globalThis.edulcniCore;

const emptyAnalysis = core.analyzeCppDocument("");

function namedOptions(planner, overrides = {}) {
  return {
    names: planner(emptyAnalysis),
    includeUsageComment: true,
    ...overrides
  };
}

const generators = {
  segtree: {
    defaults: () => ({
      sizeExpression: "n",
      valueType: "int",
      aggregate: "sum",
      updates: [],
      names: core.planSegmentTreeNames(emptyAnalysis, "t")
    }),
    render: core.renderSegmentTree
  },
  segtree_beats: {
    defaults: () => namedOptions(core.planSegmentTreeBeatsNames, {
      valueType: "long long",
      updates: core.defaultSegmentTreeBeatsUpdates(),
      queries: core.defaultSegmentTreeBeatsQueries()
    }),
    render: core.renderSegmentTreeBeats
  },
  fenwick: {
    defaults: () => core.defaultFenwickOptions(emptyAnalysis, []),
    render: core.renderFenwick
  },
  sparse_table: {
    defaults: () => namedOptions(core.planSparseTableNames, {
      valueType: "int",
      sourceName: "a",
      variants: core.defaultSparseTableVariants()
    }),
    render: core.renderSparseTable
  },
  merge_sort_tree: {
    defaults: () => namedOptions(core.planMergeSortTreeNames, {
      valueType: "int",
      sourceName: "a",
      queries: core.defaultMergeSortTreeQueries()
    }),
    render: core.renderMergeSortTree
  },
  implicit_treap: {
    defaults: () => namedOptions(core.planImplicitTreapNames, {
      valueType: "long long",
      aggregate: "sum",
      features: core.defaultImplicitTreapFeatures()
    }),
    render: core.renderImplicitTreap
  },
  dsu: { defaults: () => namedOptions(core.planDsuNames), render: core.renderDsu },
  rollback_dsu: { defaults: () => namedOptions(core.planRollbackDsuNames), render: core.renderRollbackDsu },
  lca: { defaults: () => namedOptions(core.planLcaNames), render: core.renderLca },
  hld: { defaults: () => namedOptions(core.planHldNames), render: core.renderHld },
  bfs: { defaults: () => namedOptions(core.planBfsNames), render: core.renderBfs },
  dijkstra: { defaults: () => namedOptions(core.planDijkstraNames), render: core.renderDijkstra },
  toposort: { defaults: () => namedOptions(core.planToposortNames), render: core.renderToposort },
  kosaraju: { defaults: () => namedOptions(core.planKosarajuNames), render: core.renderKosaraju },
  mo: { defaults: () => namedOptions(core.planMoNames), render: core.renderMo },
  monotonic_stack: { defaults: () => namedOptions(core.planMonotonicStackNames), render: core.renderMonotonicStack },
  gp_hash_table: { defaults: () => namedOptions(core.planGpHashTableNames), render: core.renderGpHashTable },
  ordered_set: { defaults: () => namedOptions(core.planOrderedSetNames), render: core.renderOrderedSet },
  set_utils: { defaults: () => namedOptions(core.planSetUtilsNames), render: core.renderSetUtils },
  fast_allocator: { defaults: () => namedOptions(core.planFastAllocatorNames), render: core.renderFastAllocator },
  geometry: { defaults: () => ({ includeUsageComment: true }), render: core.renderGeometry },
  halfplane_intersection: { defaults: () => ({ includeUsageComment: true }), render: core.renderHalfplaneIntersection }
  ,
  berlekamp_massey: {
    defaults: () => namedOptions(core.planBerlekampMasseyNames, {
      valueType: "Mint",
      sequenceName: "sequence",
      indexName: "k",
      features: core.defaultBerlekampMasseyFeatures()
    }),
    render: core.renderBerlekampMassey
  },
  linear_sieve: {
    defaults: () => namedOptions(core.planLinearSieveNames, { features: core.defaultLinearSieveFeatures() }),
    render: core.renderLinearSieve
  },
  modint: { defaults: () => core.defaultModIntOptions(emptyAnalysis), render: core.renderModInt },
  twosat: { defaults: () => core.defaultTwoSatOptions(emptyAnalysis), render: core.renderTwoSat },
  maxflow_dinic: { defaults: () => core.defaultMaxflowDinicOptions(emptyAnalysis), render: core.renderMaxflowDinic },
  mincost_maxflow: { defaults: () => core.defaultMinCostMaxFlowOptions(emptyAnalysis), render: core.renderMinCostMaxFlow },
  hungarian: { defaults: () => core.defaultHungarianOptions(emptyAnalysis), render: core.renderHungarian },
  kuhn: { defaults: () => core.defaultKuhnOptions(emptyAnalysis), render: core.renderKuhn },
  poly_hash: { defaults: () => core.defaultPolyHashOptions(emptyAnalysis), render: core.renderPolyHash },
  suffix_array: {
    defaults: () => namedOptions(core.planSuffixArrayNames, {
      inputKind: "string",
      sourceName: "s",
      features: core.defaultSuffixArrayFeatures()
    }),
    render: core.renderSuffixArray
  },
  fft_ntt: {
    defaults: () => namedOptions(core.planFftNttNames, {
      transforms: core.defaultFftNttTransforms(),
      includeConvolution: true,
      modulusExpression: "998244353",
      primitiveRootExpression: "3"
    }),
    render: core.renderFftNtt
  },
  compress_unique: {
    defaults: () => ({ sourceName: "a", valuesName: "vals", idFunctionName: "get_id", rewriteSource: true }),
    render: core.renderCompressUnique
  },
  read_vector: {
    defaults: () => ({ name: "a", sizeExpression: "n", valueType: "int", containerType: "vector<int>" }),
    render: core.renderReadVector
  }
};

const optionNames = {
  scenario: "application",
  source: "sourceMode",
  usage: "usageMode",
  variant: "variants",
  operation: "operations"
};

export function renderGenerator(entry, selections) {
  const generator = generators[entry.generator];
  if (!generator) return entry.preview;
  const options = generator.defaults();
  for (const [decisionId, value] of Object.entries(selections)) {
    const optionName = optionNames[decisionId] ?? decisionId;
    options[optionName] = decisionId === "rewriteSource"
      ? value === "yes"
      : decisionId === "operation" && !Array.isArray(value)
      ? [value]
      : value;
  }
  return generator.render(options);
}

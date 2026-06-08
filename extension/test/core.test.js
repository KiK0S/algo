const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const subprocess = require("node:child_process");

const core = require("../out/core.js");

function segmentOptions(overrides) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    sizeExpression: "n",
    valueType: "int",
    aggregate: "sum",
    updates: [],
    names: core.planSegmentTreeNames(analysis, overrides.storageName ?? "t"),
    ...overrides
  };
}

function compileGenerated(name, options, mainBody) {
  const dir = path.join(os.tmpdir(), "edulcni-extension-core-tests");
  fs.mkdirSync(dir, { recursive: true });
  const cpp = path.join(dir, `${name}.cpp`);
  const exe = path.join(dir, name);
  const source = [
    "#include <bits/stdc++.h>",
    "using namespace std;",
    "typedef long long ll;",
    "",
    core.renderSegmentTree(options),
    "int main() {",
    mainBody,
    "  return 0;",
    "}"
  ].join("\n");
  fs.writeFileSync(cpp, source);
  subprocess.execFileSync("g++", ["-std=c++17", cpp, "-o", exe], {
    stdio: "inherit"
  });
  subprocess.execFileSync(exe, [], { stdio: "inherit" });
}

function compileSource(name, source) {
  const dir = path.join(os.tmpdir(), "edulcni-extension-core-tests");
  fs.mkdirSync(dir, { recursive: true });
  const cpp = path.join(dir, `${name}.cpp`);
  const exe = path.join(dir, name);
  fs.writeFileSync(cpp, source);
  subprocess.execFileSync("g++", ["-std=c++17", cpp, "-o", exe], {
    stdio: "inherit"
  });
  subprocess.execFileSync(exe, [], { stdio: "inherit" });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toPosixPath(value) {
  return value.replaceAll(path.sep, "/");
}

function collectFiles(root, extensions) {
  const result = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      result.push(...collectFiles(fullPath, extensions));
      continue;
    }
    if (entry.isFile() && extensions.has(path.extname(entry.name))) {
      result.push(fullPath);
    }
  }
  return result;
}

const completedMigrations = [
  {
    name: "berlekamp_massey",
    catalogPath: "/solvers/berlekamp_massey",
    legacyHeader: "berlekamp_massey.hpp",
    replacementHeader: path.join("solvers", "berlekamp_massey.hpp"),
    tests: ["berlekamp_massey_test.cpp"]
  },
  {
    name: "sparse_table",
    catalogPath: "/solvers/sparse_table",
    legacyHeader: "sparse_table.hpp",
    replacementHeader: path.join("solvers", "sparse_table.hpp"),
    tests: ["sparse_table_test.cpp"],
    removedFiles: [path.join("solvers", "static_rmq.hpp")]
  },
  {
    name: "dsu",
    catalogPath: "/solvers/dsu",
    legacyHeader: "dsu.hpp",
    replacementHeader: path.join("solvers", "dsu.hpp"),
    tests: ["dsu_test.cpp"]
  },
  {
    name: "rollback_dsu",
    catalogPath: "/solvers/rollback_dsu",
    legacyHeader: "rollback_dsu.hpp",
    replacementHeader: path.join("solvers", "rollback_dsu.hpp"),
    tests: ["solvers_structures_test.cpp"]
  },
  {
    name: "lca",
    catalogPath: "/solvers/lca",
    legacyHeader: "lca.hpp",
    replacementHeader: path.join("solvers", "lca_binary_lifting.hpp"),
    tests: ["lca_test.cpp", "solvers_structures_test.cpp"]
  },
  {
    name: "bfs",
    catalogPath: "/solvers/bfs",
    legacyHeader: "bfs.hpp",
    replacementHeader: path.join("solvers", "bfs.hpp"),
    tests: ["bfs_test.cpp"]
  },
  {
    name: "linear_sieve",
    catalogPath: "/solvers/linear_sieve",
    legacyHeader: "linear_sieve.hpp",
    replacementHeader: path.join("solvers", "linear_sieve.hpp"),
    tests: ["linear_sieve_test.cpp"]
  },
  {
    name: "fenwick",
    catalogPath: "/solvers/fenwick",
    legacyHeader: "fenwick.hpp",
    replacementHeader: path.join("solvers", "fenwick.hpp"),
    tests: ["fenwick_test.cpp"]
  },
  {
    name: "twosat",
    catalogPath: "/solvers/twosat",
    legacyHeader: "twosat.hpp",
    replacementHeader: path.join("solvers", "twosat.hpp"),
    tests: ["twosat_test.cpp", "solvers_twosat_fft_test.cpp"]
  },
  {
    name: "maxflow_dinic",
    catalogPath: "/solvers/maxflow_dinic",
    legacyHeader: "dinic.hpp",
    replacementHeader: path.join("solvers", "maxflow_dinic.hpp"),
    tests: ["dinic_test.cpp", "solvers_flow_matching_test.cpp"]
  },
  {
    name: "mincost_maxflow",
    catalogPath: "/solvers/mincost_maxflow",
    legacyHeader: "mincost_maxflow.hpp",
    replacementHeader: path.join("solvers", "mincost_maxflow.hpp"),
    tests: ["mincost_maxflow_test.cpp", "solvers_flow_matching_test.cpp"]
  },
  {
    name: "hungarian",
    catalogPath: "/solvers/hungarian",
    legacyHeader: "hungarian.hpp",
    replacementHeader: path.join("solvers", "hungarian.hpp"),
    tests: ["hungarian_test.cpp", "solvers_flow_matching_test.cpp"]
  },
  {
    name: "kuhn",
    catalogPath: "/solvers/kuhn",
    legacyHeader: "kuhn.hpp",
    replacementHeader: path.join("solvers", "kuhn.hpp"),
    tests: ["kuhn_test.cpp", "solvers_flow_matching_test.cpp"]
  },
  {
    name: "fft_ntt",
    catalogPath: "/solvers/fft_ntt",
    legacyHeader: "fft.hpp",
    replacementHeader: path.join("solvers", "fft_ntt.hpp"),
    tests: ["fft_test.cpp", "solvers_twosat_fft_test.cpp"]
  },
  {
    name: "suffix_array",
    catalogPath: "/solvers/suffix_array",
    legacyHeader: "suffix_array.hpp",
    replacementHeader: path.join("solvers", "suffix_array.hpp"),
    tests: ["suffix_array_test.cpp"]
  },
  {
    name: "segtree_beats",
    catalogPath: "/solvers/segtree_beats",
    legacyHeader: "segtree_beats.hpp",
    replacementHeader: path.join("solvers", "segtree_beats.hpp"),
    tests: ["solvers_structures_test.cpp"]
  },
  {
    name: "segtree_monolith",
    catalogPath: "/solvers/segtree_lazy_minmax",
    legacyHeader: "segtree.hpp",
    replacementHeader: path.join("solvers", "segtree_lazy_minmax.hpp"),
    tests: ["segtree_test.cpp"]
  },
  {
    name: "segtree_monolith_max_subarray",
    catalogPath: "/solvers/segtree_max_subarray",
    legacyHeader: "segtree.hpp",
    replacementHeader: path.join("solvers", "segtree_max_subarray.hpp"),
    tests: ["segtree_test.cpp"]
  },
  {
    name: "implicit_treap",
    catalogPath: "/solvers/implicit_treap",
    legacyHeader: "treap.hpp",
    replacementHeader: path.join("solvers", "implicit_treap.hpp"),
    tests: ["treap_test.cpp", "solvers_structures_test.cpp"]
  },
  {
    name: "merge_sort_tree",
    catalogPath: "/solvers/merge_sort_tree",
    legacyHeader: "merge_sort_tree.hpp",
    replacementHeader: path.join("solvers", "merge_sort_tree.hpp"),
    tests: ["solvers_structures_test.cpp"]
  },
  {
    name: "poly_hash",
    catalogPath: "/solvers/poly_hash",
    legacyHeader: "poly_hash.hpp",
    replacementHeader: path.join("solvers", "poly_hash.hpp"),
    tests: ["poly_hash_test.cpp"]
  },
  {
    name: "fast_allocator",
    catalogPath: "/solvers/fast_allocator",
    legacyHeader: "fast_allocator.hpp",
    replacementHeader: path.join("solvers", "fast_allocator.hpp"),
    tests: ["fast_allocator_test.cpp"]
  },
  {
    name: "monotonic_stack",
    catalogPath: "/solvers/monotonic_stack",
    legacyHeader: "monotonic_stack.hpp",
    replacementHeader: path.join("solvers", "monotonic_stack.hpp"),
    tests: ["monotonic_stack_test.cpp"]
  },
  {
    name: "toposort",
    catalogPath: "/solvers/toposort",
    legacyHeader: "toposort.hpp",
    replacementHeader: path.join("solvers", "toposort.hpp"),
    tests: ["toposort_test.cpp"]
  },
  {
    name: "kosaraju",
    catalogPath: "/solvers/kosaraju",
    legacyHeader: "kosaraju.hpp",
    replacementHeader: path.join("solvers", "kosaraju.hpp"),
    tests: ["kosaraju_test.cpp"]
  },
  {
    name: "dijkstra",
    catalogPath: "/solvers/dijkstra",
    legacyHeader: "dijkstra.hpp",
    replacementHeader: path.join("solvers", "dijkstra.hpp"),
    tests: ["dijkstra_test.cpp"]
  },
  {
    name: "gp_hash_table",
    catalogPath: "/solvers/gp_hash_table",
    legacyHeader: "gp_hash_table.hpp",
    replacementHeader: path.join("solvers", "gp_hash_table.hpp"),
    tests: ["gp_hash_table_test.cpp"]
  },
  {
    name: "ordered_set",
    catalogPath: "/solvers/ordered_set",
    legacyHeader: "ordered_set.hpp",
    replacementHeader: path.join("solvers", "ordered_set.hpp"),
    tests: ["ordered_set_test.cpp"]
  },
  {
    name: "set_utils",
    catalogPath: "/solvers/set_utils",
    legacyHeader: "set_utils.hpp",
    replacementHeader: path.join("solvers", "set_utils.hpp"),
    tests: ["set_utils_test.cpp"]
  },
  {
    name: "hld",
    catalogPath: "/solvers/hld",
    legacyHeader: "hld.hpp",
    replacementHeader: path.join("solvers", "hld.hpp"),
    tests: ["hld_test.cpp"]
  },
  {
    name: "mo",
    catalogPath: "/solvers/mo",
    legacyHeader: "mo.hpp",
    replacementHeader: path.join("solvers", "mo.hpp"),
    tests: ["mo_test.cpp"]
  },
  {
    name: "geometry",
    catalogPath: "/solvers/geometry",
    legacyHeader: "geometry.hpp",
    replacementHeader: path.join("solvers", "geometry.hpp"),
    tests: ["geometry_test.cpp"]
  },
  {
    name: "halfplane_intersection",
    catalogPath: "/solvers/halfplane_intersection",
    legacyHeader: "halfplane_intersection.hpp",
    replacementHeader: path.join("solvers", "halfplane_intersection.hpp"),
    tests: ["halfplane_intersection_test.cpp"]
  },
  {
    name: "modint",
    catalogPath: "/solvers/modint",
    legacyHeader: "modint.hpp",
    replacementHeader: path.join("solvers", "modint.hpp"),
    tests: ["modint_test.cpp"]
  }
];

function berlekampOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    valueType: "Mint",
    sequenceName: "sequence",
    indexName: "k",
    features: core.defaultBerlekampMasseyFeatures(),
    names: core.planBerlekampMasseyNames(analysis),
    includeUsageComment: true,
    ...overrides
  };
}

function sparseOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    valueType: "int",
    sourceName: "a",
    variants: core.defaultSparseTableVariants(),
    names: core.planSparseTableNames(analysis),
    includeUsageComment: true,
    ...overrides
  };
}

function dsuOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    names: core.planDsuNames(analysis),
    includeUsageComment: true,
    ...overrides
  };
}

function rollbackDsuOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    names: core.planRollbackDsuNames(analysis),
    includeUsageComment: true,
    ...overrides
  };
}

function lcaOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    names: core.planLcaNames(analysis),
    includeUsageComment: true,
    ...overrides
  };
}

function bfsOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    names: core.planBfsNames(analysis),
    includeUsageComment: true,
    ...overrides
  };
}

function linearSieveOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    features: core.defaultLinearSieveFeatures(),
    names: core.planLinearSieveNames(analysis),
    includeUsageComment: true,
    ...overrides
  };
}

function fenwickOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    operations: core.defaultFenwickOperations(),
    names: core.planFenwickNames(analysis),
    includeUsageComment: true,
    ...overrides
  };
}

function modIntOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    ...core.defaultModIntOptions(analysis),
    ...overrides
  };
}

function twosatOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    features: core.defaultTwoSatFeatures(),
    names: core.planTwoSatNames(analysis),
    includeUsageComment: true,
    ...overrides
  };
}

function maxflowDinicOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    capType: "long long",
    features: core.defaultMaxflowDinicFeatures(),
    generateInput: false,
    names: core.planMaxflowDinicNames(analysis),
    nodeCountName: "n",
    edgeCountName: "m",
    sourceName: "s",
    sinkName: "t",
    fromName: "u",
    toName: "v",
    edgeCapName: "cap",
    includeUsageComment: true,
    ...overrides
  };
}

function minCostMaxFlowOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    capType: "long long",
    costType: "long long",
    features: core.defaultMinCostMaxFlowFeatures(),
    generateInput: false,
    mode: "max_flow",
    names: core.planMinCostMaxFlowNames(analysis),
    nodeCountName: "n",
    edgeCountName: "m",
    sourceName: "s",
    sinkName: "t",
    fromName: "u",
    toName: "v",
    edgeCapName: "cap",
    edgeCostName: "cost",
    flowLimitName: "flow_limit",
    includeUsageComment: true,
    ...overrides
  };
}

function hungarianOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    costType: "long long",
    sourceName: "cost",
    mode: "minimize",
    rectangular: true,
    generateInput: false,
    names: core.planHungarianNames(analysis),
    rowCountName: "n",
    colCountName: "m",
    resultName: "assignment",
    includeUsageComment: true,
    ...overrides
  };
}

function kuhnOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    features: core.defaultKuhnFeatures(),
    generateInput: false,
    decrementInput: true,
    sourceName: "graph",
    rightSizeName: "m",
    names: core.planKuhnNames(analysis),
    leftCountName: "n",
    rightCountName: "m",
    edgeCountName: "e",
    leftVertexName: "u",
    rightVertexName: "v",
    instanceName: "matcher",
    resultName: "matching",
    coverName: "vertex_cover",
    includeUsageComment: true,
    ...overrides
  };
}

function implicitTreapOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    valueType: "ll",
    aggregate: "sum",
    features: core.defaultImplicitTreapFeatures(),
    names: core.planImplicitTreapNames(analysis),
    includeUsageComment: true,
    ...overrides
  };
}

function mergeSortTreeOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    valueType: "int",
    sourceName: "a",
    queries: core.defaultMergeSortTreeQueries(),
    names: core.planMergeSortTreeNames(analysis),
    includeUsageComment: true,
    ...overrides
  };
}

function suffixArrayOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    inputKind: "string",
    sourceName: "s",
    features: core.defaultSuffixArrayFeatures(),
    names: core.planSuffixArrayNames(analysis),
    includeUsageComment: true,
    ...overrides
  };
}

function fftNttOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    transforms: core.defaultFftNttTransforms(),
    includeConvolution: true,
    modulusExpression: "998244353",
    primitiveRootExpression: "3",
    names: core.planFftNttNames(analysis),
    includeUsageComment: true,
    ...overrides
  };
}

function polyHashOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    inputKind: "string",
    sourceName: "s",
    mod1Expression: "1000000007",
    mod2Expression: "1000000009",
    baseExpression: "911382323",
    features: core.defaultPolyHashFeatures(),
    names: core.planPolyHashNames(analysis),
    includeUsageComment: true,
    ...overrides
  };
}

function segtreeBeatsOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    valueType: "ll",
    updates: core.defaultSegmentTreeBeatsUpdates(),
    queries: core.defaultSegmentTreeBeatsQueries(),
    names: core.planSegmentTreeBeatsNames(analysis),
    includeUsageComment: true,
    ...overrides
  };
}

function testTokenScanner() {
  const analysis = core.analyzeCppDocument(`
const int MOD = 998244353; // edulcni:const
int n; // edulcni:input
int t;
string s = "build get fake";
// int commented_name;
void solve() {
  int get = 0;
}
`);
  assert.equal(analysis.identifiers.has("t"), true);
  assert.equal(analysis.identifiers.has("get"), true);
  assert.equal(analysis.identifiers.has("fake"), false);
  assert.equal(analysis.identifiers.has("commented_name"), false);
  assert.deepEqual(analysis.annotatedSymbols, [
    { name: "MOD", kind: "const" },
    { name: "n", kind: "input" }
  ]);
}

function testCollisionNames() {
  const analysis = core.analyzeCppDocument(
    "int t; void build() {} int get; int first_leq; int segtree;"
  );
  const names = core.planSegmentTreeNames(analysis);
  assert.equal(names.storageName, "segtree2");
  assert.equal(names.buildName, "build_segtree");
  assert.equal(names.queryName, "seg_get");
  assert.equal(names.firstLeqName, "seg_first_leq");
}

function testSharedNamePlanner() {
  const analysis = core.analyzeCppDocument("int t; int build; int helper;");
  const planner = core.createNamePlanner(analysis);
  assert.equal(planner.reserve("t", "tree"), "tree");
  assert.equal(planner.reserveExport("build", "build_solver"), "build_solver");
  assert.equal(planner.reserve("helper", "helper"), "helper2");
  assert.deepEqual(planner.exportedNames(), ["build_solver"]);

  const many = planner.reserveMany({
    first: { preferred: "work", exportName: true },
    second: "work"
  });
  assert.deepEqual(many, { first: "work", second: "work2" });
  assert.deepEqual(planner.exportedNames(), ["build_solver", "work"]);
}

function testDetectedSymbols() {
  assert.deepEqual(core.sizeExpressionCandidates(core.analyzeCppDocument("")), []);

  const analysis = core.analyzeCppDocument(`
#define vi vector<int>
const int E9 = 1000000000;
constexpr long long LIM = 4000000000000000000LL;
int n, m;
string s;
std::string t = "abc";
void solve() {
  vi a(n);
  vector<ll> b(m);
}
`);
  assert.equal(analysis.vectorAliases.has("vi"), true);
  assert.deepEqual(analysis.constantSymbols.map((symbol) => symbol.name), [
    "E9",
    "LIM"
  ]);
  assert.deepEqual(analysis.inputSymbols.map((symbol) => symbol.name), ["n", "m"]);
  assert.deepEqual(analysis.vectorSymbols.map((symbol) => symbol.name), ["a", "b"]);
  assert.deepEqual(analysis.stringSymbols.map((symbol) => symbol.name), ["s", "t"]);
  assert.equal(core.sizeExpressionCandidates(analysis).includes("E9"), true);
}

function testSectionDetection() {
  const text = `#include <bits/stdc++.h>
#define all(x) begin(x), end(x)
using namespace std;
const int MOD = 998244353;
int n;
vector<int> a;
int seed = make_seed();

int helper(int x) {
  return x + 1;
}

void solve() {
  cout << helper(n) << '\\n';
}

int main() {
  solve();
}
`;
  const analysis = core.analyzeCppDocument(text);
  assert.deepEqual(analysis.sections.map((span) => span.section), [
    "includes",
    "defines",
    "constants",
    "data",
    "helpers",
    "solve",
    "main"
  ]);

  const solveSpan = analysis.sections.find((span) => span.section === "solve");
  assert.ok(solveSpan);
  assert.match(text.slice(solveSpan.start, solveSpan.end), /void solve/);
}

function testSmartSnippetExportsAndRenames() {
  const solver = `
template <typename T>
class TwoSat {
 public:
  TwoSat() {}
};

inline TwoSat<int> make_twosat() {
  return TwoSat<int>();
}

// TwoSat in a comment should not be renamed.
const char* label = "make_twosat in a string should not be renamed";
`;
  assert.deepEqual(core.collectGlobalExportedIdentifiers(solver), [
    "TwoSat",
    "make_twosat"
  ]);

  const analysis = core.analyzeCppDocument("int TwoSat; int make_twosat;");
  const rendered = core.renderSnippetContent(solver, "solver", analysis);
  assert.deepEqual(rendered.renames, [
    { from: "TwoSat", to: "TwoSat2" },
    { from: "make_twosat", to: "make_twosat2" }
  ]);
  assert.match(rendered.content, /class TwoSat2/);
  assert.match(rendered.content, /inline TwoSat2<int> make_twosat2\(\)/);
  assert.match(rendered.content, /return TwoSat2<int>\(\);/);
  assert.match(rendered.content, /\/\/ TwoSat in a comment/);
  assert.match(rendered.content, /"make_twosat in a string/);
}

function testDependencyOrder() {
  const entries = new Map([
    ["/a", { path: "/a", kind: "solver", dependsOn: ["/b", "/c"] }],
    ["/b", { path: "/b", kind: "brick", dependsOn: ["/d"] }],
    ["/c", { path: "/c", kind: "brick" }],
    ["/d", { path: "/d", kind: "brick" }]
  ]);
  assert.deepEqual(core.resolveCatalogOrder("/a", entries), ["/d", "/b", "/c", "/a"]);
}

function testSectionComposer() {
  const recipe = core.createRenderedRecipe({
    solve: ["void solve() {}"],
    includes: ["#include <bits/stdc++.h>"],
    helpers: ["int helper() { return 1; }"],
    constants: ["const int MOD = 998244353;"],
    data: ["int n;"]
  });
  assert.equal(
    core.composeRecipeSections(recipe),
    [
      "#include <bits/stdc++.h>",
      "const int MOD = 998244353;",
      "int n;",
      "int helper() { return 1; }",
      "void solve() {}",
      ""
    ].join("\n\n").replace(/\n\n$/, "\n")
  );

  const merged = core.mergeRenderedRecipes([
    core.createRenderedRecipe({ helpers: ["int a;"] }, ["a"], [{ path: "/x" }]),
    core.createRenderedRecipe({ data: ["int n;"] }, ["n"], [{ path: "/x" }])
  ]);
  assert.deepEqual(merged.exports, ["a", "n"]);
  assert.deepEqual(merged.dependencies, [{ path: "/x" }]);
  assert.equal(core.composeRecipeSections(merged), "int n;\n\nint a;\n");
}

function testRecipeMetadata() {
  const segmentRecipe = core.renderSegmentTreeRecipe(
    segmentOptions({ updates: ["point_set"] })
  );
  assert.equal(segmentRecipe.exports.includes("t"), true);
  assert.equal(segmentRecipe.exports.includes("point_set"), true);
  assert.equal(segmentRecipe.exports.includes("range_add"), false);

  const firstLeqRecipe = core.renderSegmentTreeRecipe(
    segmentOptions({
      aggregate: "min",
      updates: ["range_add"],
      descends: ["first_leq"]
    })
  );
  assert.equal(firstLeqRecipe.exports.includes("first_leq"), true);

  const pointClassRecipe = core.renderSegmentTreeRecipe(
    segmentOptions({ outputMode: "iterative_class", updates: ["point_set"] })
  );
  assert.deepEqual(pointClassRecipe.exports, [
    "SegmentSumOp",
    "SegmentMinOp",
    "SegmentMaxOp",
    "SegmentTree",
    "SegmentSumTree",
    "SegmentMinTree",
    "SegmentMaxTree"
  ]);

  const beatsRecipe = core.renderSegmentTreeBeatsRecipe(
    segtreeBeatsOptions({ includeUsageComment: false })
  );
  assert.deepEqual(beatsRecipe.exports, ["SegmentTreeBeats"]);
  assert.deepEqual(Object.keys(beatsRecipe.sections), ["helpers"]);

  const beatsSumOnlyRecipe = core.renderSegmentTreeBeatsRecipe(
    segtreeBeatsOptions({
      updates: ["chmin"],
      queries: ["sum"],
      includeUsageComment: false
    })
  );
  assert.equal(beatsSumOnlyRecipe.exports.includes("SegmentTreeBeats"), true);

  const minimalBmRecipe = core.renderBerlekampMasseyRecipe(
    berlekampOptions({
      features: ["minimal_recurrence"],
      includeUsageComment: false
    })
  );
  assert.deepEqual(minimalBmRecipe.exports, ["berlekamp_massey"]);

  const names = core.planBerlekampMasseyNames(
    core.analyzeCppDocument(""),
    ["berlekamp_massey"]
  );
  assert.equal(names.berlekampMasseyName, "berlekamp_massey2");

  const sparseRecipe = core.renderSparseTableRecipe(
    sparseOptions({
      variants: ["min"],
      includeUsageComment: false
    })
  );
  assert.equal(sparseRecipe.exports.includes("sparse_log"), true);
  assert.equal(sparseRecipe.exports.includes("build_sparse_min"), true);
  assert.equal(sparseRecipe.exports.includes("query_sparse_min"), true);
  assert.equal(sparseRecipe.exports.includes("build_sparse_max"), false);

  const dsuRecipe = core.renderDsuRecipe(dsuOptions({ includeUsageComment: false }));
  assert.deepEqual(dsuRecipe.exports, ["Dsu"]);
  assert.deepEqual(Object.keys(dsuRecipe.sections), ["helpers"]);

  const rollbackDsuRecipe = core.renderRollbackDsuRecipe(
    rollbackDsuOptions({ includeUsageComment: false })
  );
  assert.deepEqual(rollbackDsuRecipe.exports, ["RollbackDsu"]);
  assert.deepEqual(Object.keys(rollbackDsuRecipe.sections), ["helpers"]);

  const lcaRecipe = core.renderLcaRecipe(lcaOptions({ includeUsageComment: false }));
  assert.deepEqual(lcaRecipe.exports, ["LcaBinaryLifting"]);
  assert.deepEqual(Object.keys(lcaRecipe.sections), ["helpers"]);

  const bfsRecipe = core.renderBfsRecipe(bfsOptions({ includeUsageComment: false }));
  assert.deepEqual(bfsRecipe.exports, [
    "BfsResult",
    "bfs_add_edge",
    "bfs_multi_source",
    "bfs",
    "bfs_restore_path",
    "bfs_restore_path_to_root"
  ]);
  assert.deepEqual(Object.keys(bfsRecipe.sections), ["helpers"]);

  const linearSieveRecipe = core.renderLinearSieveRecipe(
    linearSieveOptions({ includeUsageComment: false })
  );
  assert.deepEqual(linearSieveRecipe.exports, [
    "LinearSieve",
    "linear_sieve_lowest_prime",
    "linear_sieve_primes"
  ]);
  assert.deepEqual(Object.keys(linearSieveRecipe.sections), ["helpers"]);

  const minimalLinearSieveRecipe = core.renderLinearSieveRecipe(
    linearSieveOptions({
      features: ["primes"],
      includeUsageComment: false
    })
  );
  assert.deepEqual(minimalLinearSieveRecipe.exports, [
    "LinearSieve",
    "linear_sieve_primes"
  ]);

  const fenwickRecipe = core.renderFenwickRecipe(
    fenwickOptions({ includeUsageComment: false })
  );
  assert.deepEqual(fenwickRecipe.exports, [
    "FenwickSumOp",
    "FenwickXorOp",
    "FenwickMaxOp",
    "FenwickMinOp",
    "Fenwick",
    "FenwickSumTree",
    "FenwickXorTree",
    "FenwickMaxTree",
    "FenwickMinTree"
  ]);
  assert.deepEqual(Object.keys(fenwickRecipe.sections), ["helpers"]);

  const sumOnlyFenwickRecipe = core.renderFenwickRecipe(
    fenwickOptions({
      operations: ["sum"],
      includeUsageComment: false
    })
  );
  assert.deepEqual(sumOnlyFenwickRecipe.exports, [
    "FenwickSumOp",
    "Fenwick",
    "FenwickSumTree"
  ]);

  const modIntRecipe = core.renderModIntRecipe(
    modIntOptions({ includeUsageComment: false })
  );
  assert.deepEqual(modIntRecipe.exports, ["StaticModInt", "DynamicModInt"]);
  assert.deepEqual(Object.keys(modIntRecipe.sections), ["helpers"]);

  const staticModIntRecipe = core.renderModIntRecipe(
    modIntOptions({
      mode: "static",
      includeUsageComment: false
    })
  );
  assert.deepEqual(staticModIntRecipe.exports, ["StaticModInt"]);

  const twosatRecipe = core.renderTwoSatRecipe(
    twosatOptions({ includeUsageComment: false })
  );
  assert.deepEqual(twosatRecipe.exports, ["TwoSat"]);
  assert.deepEqual(Object.keys(twosatRecipe.sections), ["helpers"]);

  const twosatFullRecipe = core.renderTwoSatRecipe(
    twosatOptions({
      features: ["xor", "equal", "force", "at_most_one", "components"],
      includeUsageComment: false
    })
  );
  assert.deepEqual(twosatFullRecipe.exports, ["TwoSat"]);
  assert.deepEqual(Object.keys(twosatFullRecipe.sections), ["helpers"]);

  const maxflowDinicRecipe = core.renderMaxflowDinicRecipe(
    maxflowDinicOptions({ includeUsageComment: false })
  );
  assert.deepEqual(maxflowDinicRecipe.exports, ["Dinic"]);
  assert.deepEqual(Object.keys(maxflowDinicRecipe.sections), ["helpers"]);

  const maxflowDinicInputRecipe = core.renderMaxflowDinicRecipe(
    maxflowDinicOptions({
      generateInput: true,
      includeUsageComment: false
    })
  );
  assert.deepEqual(Object.keys(maxflowDinicInputRecipe.sections), [
    "helpers",
    "solve"
  ]);

  const minCostMaxFlowRecipe = core.renderMinCostMaxFlowRecipe(
    minCostMaxFlowOptions({ includeUsageComment: false })
  );
  assert.deepEqual(minCostMaxFlowRecipe.exports, ["MinCostMaxFlow"]);
  assert.deepEqual(Object.keys(minCostMaxFlowRecipe.sections), ["helpers"]);

  const minCostMaxFlowInputRecipe = core.renderMinCostMaxFlowRecipe(
    minCostMaxFlowOptions({
      generateInput: true,
      mode: "fixed_flow",
      includeUsageComment: false
    })
  );
  assert.deepEqual(Object.keys(minCostMaxFlowInputRecipe.sections), [
    "helpers",
    "solve"
  ]);

  const hungarianRecipe = core.renderHungarianRecipe(
    hungarianOptions({ includeUsageComment: false })
  );
  assert.deepEqual(hungarianRecipe.exports, [
    "HungarianResult",
    "hungarian_internal",
    "hungarian"
  ]);
  assert.deepEqual(Object.keys(hungarianRecipe.sections), ["helpers"]);

  const hungarianMaxRecipe = core.renderHungarianRecipe(
    hungarianOptions({
      mode: "maximize",
      generateInput: true,
      includeUsageComment: false
    })
  );
  assert.equal(hungarianMaxRecipe.exports.includes("hungarian_maximize"), true);
  assert.deepEqual(Object.keys(hungarianMaxRecipe.sections), [
    "helpers",
    "solve"
  ]);

  const kuhnRecipe = core.renderKuhnRecipe(
    kuhnOptions({ includeUsageComment: false })
  );
  assert.deepEqual(kuhnRecipe.exports, [
    "KuhnResult",
    "KuhnMatcher",
    "kuhn_maximum_matching",
    "BipartiteVertexCover",
    "minimum_vertex_cover_bipartite"
  ]);
  assert.deepEqual(Object.keys(kuhnRecipe.sections), ["helpers"]);

  const kuhnInputRecipe = core.renderKuhnRecipe(
    kuhnOptions({
      generateInput: true,
      includeUsageComment: false
    })
  );
  assert.deepEqual(Object.keys(kuhnInputRecipe.sections), [
    "helpers",
    "solve"
  ]);

  const treapRecipe = core.renderImplicitTreapRecipe(
    implicitTreapOptions({ includeUsageComment: false })
  );
  assert.deepEqual(treapRecipe.exports, ["TreapSumOp", "ImplicitTreap"]);
  assert.deepEqual(Object.keys(treapRecipe.sections), ["helpers"]);

  const mergeSortTreeRecipe = core.renderMergeSortTreeRecipe(
    mergeSortTreeOptions({ includeUsageComment: false })
  );
  assert.deepEqual(mergeSortTreeRecipe.exports, ["MergeSortTree"]);
  assert.deepEqual(Object.keys(mergeSortTreeRecipe.sections), ["helpers"]);

  const existsOnlyMergeSortTreeRecipe = core.renderMergeSortTreeRecipe(
    mergeSortTreeOptions({
      queries: ["exists"],
      includeUsageComment: false
    })
  );
  assert.equal(
    existsOnlyMergeSortTreeRecipe.exports.includes("MergeSortTree"),
    true
  );

  const suffixRecipe = core.renderSuffixArrayRecipe(
    suffixArrayOptions({ includeUsageComment: false })
  );
  assert.equal(suffixRecipe.exports.includes("SuffixArrayResult"), true);
  assert.equal(
    suffixRecipe.exports.includes("suffix_array_build_from_positive_codes"),
    true
  );
  assert.equal(suffixRecipe.exports.includes("suffix_array_build"), true);
  assert.equal(suffixRecipe.exports.includes("suffix_array_build_from_ints"), false);
  assert.equal(Object.keys(suffixRecipe.sections).includes("helpers"), true);

  const suffixRmqRecipe = core.renderSuffixArrayRecipe(
    suffixArrayOptions({
      features: ["lcp_rmq"],
      includeUsageComment: false
    })
  );
  assert.equal(suffixRmqRecipe.exports.includes("build_sparse_min"), true);
  assert.equal(suffixRmqRecipe.exports.includes("suffix_array_lcp"), true);

  const fftNttRecipe = core.renderFftNttRecipe(
    fftNttOptions({ includeUsageComment: false })
  );
  assert.equal(fftNttRecipe.exports.includes("fft_next_power_of_two"), true);
  assert.equal(fftNttRecipe.exports.includes("fft_transform"), true);
  assert.equal(fftNttRecipe.exports.includes("convolution_fft_round"), true);
  assert.equal(fftNttRecipe.exports.includes("ntt_pow"), true);
  assert.equal(fftNttRecipe.exports.includes("ntt_transform"), true);
  assert.equal(fftNttRecipe.exports.includes("convolution_ntt_int"), true);
  assert.deepEqual(Object.keys(fftNttRecipe.sections), ["helpers"]);

  const polyHashRecipe = core.renderPolyHashRecipe(
    polyHashOptions({ includeUsageComment: false })
  );
  assert.deepEqual(polyHashRecipe.exports, [
    "POLY_HASH_MOD1",
    "POLY_HASH_MOD2",
    "POLY_HASH_BASE",
    "PolyHashValue",
    "PolyHash",
    "poly_hash_string",
    "poly_hash_equal_substrings"
  ]);
  assert.deepEqual(Object.keys(polyHashRecipe.sections), ["constants", "helpers"]);
}

function testBundledCatalogGuardrails() {
  const catalogPath = path.join(
    __dirname,
    "..",
    "library",
    "catalog",
    "snippets.json"
  );
  const parsed = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const entries = Array.isArray(parsed) ? parsed : parsed.entries;
  const validSections = new Set(core.SOLUTION_SECTION_ORDER);

  for (const entry of entries) {
    assert.match(entry.path, /^\/(?:bricks|solvers)\//);
    if (entry.generator !== undefined) {
      assert.equal(typeof entry.generator, "string");
    }
    if (entry.sections !== undefined) {
      for (const section of entry.sections) {
        assert.equal(validSections.has(section), true);
      }
    }
    if (entry.source !== undefined) {
      assert.match(entry.source, /^(?:bricks|solvers)\//);
    }
  }

  const berlekampEntry = entries.find(
    (entry) => entry.path === "/solvers/berlekamp_massey"
  );
  assert.ok(berlekampEntry);
  assert.equal(berlekampEntry.kind, "solver");
  assert.equal(berlekampEntry.generator, "berlekamp_massey");
  assert.equal(berlekampEntry.source, "solvers/berlekamp_massey.hpp");
  assert.deepEqual(berlekampEntry.sections, ["helpers"]);

  const sparseEntry = entries.find((entry) => entry.path === "/solvers/sparse_table");
  assert.ok(sparseEntry);
  assert.equal(sparseEntry.kind, "solver");
  assert.equal(sparseEntry.generator, "sparse_table");
  assert.equal(sparseEntry.source, "solvers/sparse_table.hpp");
  assert.deepEqual(sparseEntry.features, ["min", "max"]);
  assert.deepEqual(sparseEntry.sections, ["helpers"]);

  const dsuEntry = entries.find((entry) => entry.path === "/solvers/dsu");
  assert.ok(dsuEntry);
  assert.equal(dsuEntry.kind, "solver");
  assert.equal(dsuEntry.generator, "dsu");
  assert.equal(dsuEntry.source, "solvers/dsu.hpp");
  assert.deepEqual(dsuEntry.exports, ["Dsu"]);
  assert.deepEqual(dsuEntry.sections, ["helpers"]);

  const rollbackDsuEntry = entries.find(
    (entry) => entry.path === "/solvers/rollback_dsu"
  );
  assert.ok(rollbackDsuEntry);
  assert.equal(rollbackDsuEntry.kind, "solver");
  assert.equal(rollbackDsuEntry.generator, "rollback_dsu");
  assert.equal(rollbackDsuEntry.source, "solvers/rollback_dsu.hpp");
  assert.deepEqual(rollbackDsuEntry.exports, ["RollbackDsu"]);
  assert.deepEqual(rollbackDsuEntry.features, [
    "snapshot",
    "rollback",
    "component_count",
    "component_size"
  ]);
  assert.deepEqual(rollbackDsuEntry.sections, ["helpers"]);

  const lcaEntry = entries.find((entry) => entry.path === "/solvers/lca");
  assert.ok(lcaEntry);
  assert.equal(lcaEntry.kind, "solver");
  assert.equal(lcaEntry.generator, "lca");
  assert.equal(lcaEntry.source, "solvers/lca_binary_lifting.hpp");
  assert.deepEqual(lcaEntry.exports, ["LcaBinaryLifting"]);
  assert.deepEqual(lcaEntry.features, ["binary_lifting"]);
  assert.deepEqual(lcaEntry.sections, ["helpers"]);

  const bfsEntry = entries.find((entry) => entry.path === "/solvers/bfs");
  assert.ok(bfsEntry);
  assert.equal(bfsEntry.kind, "solver");
  assert.equal(bfsEntry.generator, "bfs");
  assert.equal(bfsEntry.source, "solvers/bfs.hpp");
  assert.deepEqual(bfsEntry.exports, [
    "BfsResult",
    "bfs_add_edge",
    "bfs_multi_source",
    "bfs",
    "bfs_restore_path",
    "bfs_restore_path_to_root"
  ]);
  assert.deepEqual(bfsEntry.features, [
    "add_edge",
    "single_source",
    "multi_source",
    "restore_path",
    "visit_order"
  ]);
  assert.deepEqual(bfsEntry.sections, ["helpers"]);

  const linearSieveEntry = entries.find(
    (entry) => entry.path === "/solvers/linear_sieve"
  );
  assert.ok(linearSieveEntry);
  assert.equal(linearSieveEntry.kind, "solver");
  assert.equal(linearSieveEntry.generator, "linear_sieve");
  assert.equal(linearSieveEntry.source, "solvers/linear_sieve.hpp");
  assert.deepEqual(linearSieveEntry.exports, [
    "LinearSieve",
    "linear_sieve_lowest_prime",
    "linear_sieve_primes"
  ]);
  assert.deepEqual(linearSieveEntry.features, [
    "lowest_prime",
    "primes",
    "factorization"
  ]);
  assert.deepEqual(linearSieveEntry.sections, ["helpers"]);

  const fenwickEntry = entries.find((entry) => entry.path === "/solvers/fenwick");
  assert.ok(fenwickEntry);
  assert.equal(fenwickEntry.kind, "solver");
  assert.equal(fenwickEntry.generator, "fenwick");
  assert.equal(fenwickEntry.source, "solvers/fenwick.hpp");
  assert.deepEqual(fenwickEntry.exports, [
    "FenwickSumOp",
    "FenwickXorOp",
    "FenwickMaxOp",
    "FenwickMinOp",
    "Fenwick",
    "FenwickSumTree",
    "FenwickXorTree",
    "FenwickMaxTree",
    "FenwickMinTree"
  ]);
  assert.deepEqual(fenwickEntry.features, [
    "sum",
    "xor",
    "max",
    "min",
    "range_query",
    "descend"
  ]);
  assert.deepEqual(fenwickEntry.sections, ["helpers"]);

  const modIntEntry = entries.find((entry) => entry.path === "/solvers/modint");
  assert.ok(modIntEntry);
  assert.equal(modIntEntry.kind, "solver");
  assert.equal(modIntEntry.generator, "modint");
  assert.equal(modIntEntry.source, "solvers/modint.hpp");
  assert.deepEqual(modIntEntry.exports, ["StaticModInt", "DynamicModInt"]);
  assert.deepEqual(modIntEntry.features, [
    "static_mod",
    "dynamic_mod",
    "inverse",
    "pow"
  ]);
  assert.deepEqual(modIntEntry.sections, ["helpers"]);

  const twosatEntry = entries.find((entry) => entry.path === "/solvers/twosat");
  assert.ok(twosatEntry);
  assert.equal(twosatEntry.kind, "solver");
  assert.equal(twosatEntry.generator, "twosat");
  assert.equal(twosatEntry.source, "solvers/twosat.hpp");
  assert.deepEqual(twosatEntry.exports, ["TwoSat"]);
  assert.deepEqual(twosatEntry.features, [
    "add_or",
    "add_implication",
    "assignment",
    "xor",
    "equal",
    "force",
    "at_most_one",
    "components"
  ]);
  assert.deepEqual(twosatEntry.sections, ["helpers"]);

  const maxflowDinicEntry = entries.find(
    (entry) => entry.path === "/solvers/maxflow_dinic"
  );
  assert.ok(maxflowDinicEntry);
  assert.equal(maxflowDinicEntry.kind, "solver");
  assert.equal(maxflowDinicEntry.generator, "maxflow_dinic");
  assert.equal(maxflowDinicEntry.source, "solvers/maxflow_dinic.hpp");
  assert.deepEqual(maxflowDinicEntry.exports, ["Dinic"]);
  assert.deepEqual(maxflowDinicEntry.features, [
    "add_edge",
    "max_flow",
    "min_cut",
    "graph_access",
    "reset_flows"
  ]);
  assert.deepEqual(maxflowDinicEntry.sections, ["helpers", "solve"]);

  const minCostMaxFlowEntry = entries.find(
    (entry) => entry.path === "/solvers/mincost_maxflow"
  );
  assert.ok(minCostMaxFlowEntry);
  assert.equal(minCostMaxFlowEntry.kind, "solver");
  assert.equal(minCostMaxFlowEntry.generator, "mincost_maxflow");
  assert.equal(minCostMaxFlowEntry.source, "solvers/mincost_maxflow.hpp");
  assert.deepEqual(minCostMaxFlowEntry.exports, ["MinCostMaxFlow"]);
  assert.deepEqual(minCostMaxFlowEntry.features, [
    "add_edge",
    "min_cost_flow",
    "min_cost_max_flow",
    "negative_costs",
    "graph_access",
    "potential_access"
  ]);
  assert.deepEqual(minCostMaxFlowEntry.sections, ["helpers", "solve"]);

  const hungarianEntry = entries.find(
    (entry) => entry.path === "/solvers/hungarian"
  );
  assert.ok(hungarianEntry);
  assert.equal(hungarianEntry.kind, "solver");
  assert.equal(hungarianEntry.generator, "hungarian");
  assert.equal(hungarianEntry.source, "solvers/hungarian.hpp");
  assert.deepEqual(hungarianEntry.exports, [
    "HungarianResult",
    "hungarian_internal",
    "hungarian",
    "hungarian_maximize"
  ]);
  assert.deepEqual(hungarianEntry.features, [
    "minimize",
    "maximize",
    "rectangular"
  ]);
  assert.deepEqual(hungarianEntry.sections, ["helpers", "solve"]);

  const kuhnEntry = entries.find((entry) => entry.path === "/solvers/kuhn");
  assert.ok(kuhnEntry);
  assert.equal(kuhnEntry.kind, "solver");
  assert.equal(kuhnEntry.generator, "kuhn");
  assert.equal(kuhnEntry.source, "solvers/kuhn.hpp");
  assert.deepEqual(kuhnEntry.exports, [
    "KuhnResult",
    "KuhnMatcher",
    "kuhn_maximum_matching",
    "BipartiteVertexCover",
    "minimum_vertex_cover_bipartite"
  ]);
  assert.deepEqual(kuhnEntry.features, [
    "maximum_matching",
    "left_matches",
    "right_matches",
    "vertex_cover"
  ]);
  assert.deepEqual(kuhnEntry.sections, ["helpers", "solve"]);

  const treapEntry = entries.find(
    (entry) => entry.path === "/solvers/implicit_treap"
  );
  assert.ok(treapEntry);
  assert.equal(treapEntry.kind, "solver");
  assert.equal(treapEntry.generator, "implicit_treap");
  assert.equal(treapEntry.source, "solvers/implicit_treap.hpp");
  assert.deepEqual(treapEntry.exports, ["TreapSumOp", "ImplicitTreap"]);
  assert.deepEqual(treapEntry.features, ["sum", "reverse", "range_add"]);
  assert.deepEqual(treapEntry.sections, ["helpers"]);

  const mergeSortTreeEntry = entries.find(
    (entry) => entry.path === "/solvers/merge_sort_tree"
  );
  assert.ok(mergeSortTreeEntry);
  assert.equal(mergeSortTreeEntry.kind, "solver");
  assert.equal(mergeSortTreeEntry.generator, "merge_sort_tree");
  assert.equal(mergeSortTreeEntry.source, "solvers/merge_sort_tree.hpp");
  assert.deepEqual(mergeSortTreeEntry.exports, ["MergeSortTree"]);
  assert.deepEqual(mergeSortTreeEntry.features, [
    "count_less",
    "count_less_equal",
    "count_equal",
    "count_in_range",
    "exists"
  ]);
  assert.deepEqual(mergeSortTreeEntry.sections, ["helpers"]);

  const polyHashEntry = entries.find((entry) => entry.path === "/solvers/poly_hash");
  assert.ok(polyHashEntry);
  assert.equal(polyHashEntry.kind, "solver");
  assert.equal(polyHashEntry.generator, "poly_hash");
  assert.equal(polyHashEntry.source, "solvers/poly_hash.hpp");
  assert.deepEqual(polyHashEntry.exports, [
    "POLY_HASH_MOD1",
    "POLY_HASH_MOD2",
    "POLY_HASH_BASE",
    "PolyHashValue",
    "PolyHash",
    "poly_hash_string",
    "poly_hash_values",
    "poly_hash_equal_substrings"
  ]);
  assert.deepEqual(polyHashEntry.features, [
    "substring_equal",
    "reverse",
    "lcp",
    "concat"
  ]);
  assert.deepEqual(polyHashEntry.sections, ["constants", "helpers"]);

  const suffixEntry = entries.find((entry) => entry.path === "/solvers/suffix_array");
  assert.ok(suffixEntry);
  assert.equal(suffixEntry.kind, "solver");
  assert.equal(suffixEntry.generator, "suffix_array");
  assert.equal(suffixEntry.source, "solvers/suffix_array.hpp");
  assert.deepEqual(suffixEntry.features, [
    "rank",
    "lcp",
    "stripped_sa",
    "lcp_rmq"
  ]);
  assert.deepEqual(suffixEntry.sections, ["helpers"]);

  const pointSegtreeEntry = entries.find(
    (entry) => entry.path === "/solvers/segtree_point_update"
  );
  assert.ok(pointSegtreeEntry);
  assert.equal(pointSegtreeEntry.kind, "solver");
  assert.equal(pointSegtreeEntry.generator, undefined);
  assert.equal(pointSegtreeEntry.source, "solvers/segtree_point_update.hpp");
  assert.deepEqual(pointSegtreeEntry.exports, [
    "SegmentSumOp",
    "SegmentMinOp",
    "SegmentMaxOp",
    "SegmentTree",
    "SegmentSumTree",
    "SegmentMinTree",
    "SegmentMaxTree"
  ]);
  assert.deepEqual(pointSegtreeEntry.features, ["point_set", "sum", "min", "max"]);
  assert.deepEqual(pointSegtreeEntry.sections, ["helpers"]);

  const lazyMinEntry = entries.find(
    (entry) => entry.path === "/solvers/segtree_lazy_add_min"
  );
  assert.ok(lazyMinEntry);
  assert.equal(lazyMinEntry.kind, "solver");
  assert.equal(lazyMinEntry.generator, undefined);
  assert.equal(lazyMinEntry.source, "solvers/segtree_lazy_add_min.hpp");
  assert.deepEqual(lazyMinEntry.exports, ["SegmentMinAddTree"]);
  assert.deepEqual(lazyMinEntry.features, ["range_add", "min", "first_leq"]);
  assert.deepEqual(lazyMinEntry.sections, ["helpers"]);

  const lazyMinMaxEntry = entries.find(
    (entry) => entry.path === "/solvers/segtree_lazy_minmax"
  );
  assert.ok(lazyMinMaxEntry);
  assert.equal(lazyMinMaxEntry.kind, "solver");
  assert.equal(lazyMinMaxEntry.generator, undefined);
  assert.equal(lazyMinMaxEntry.source, "solvers/segtree_lazy_minmax.hpp");
  assert.deepEqual(lazyMinMaxEntry.exports, [
    "SegmentAssignTag",
    "LazySegTree",
    "SegMinAssignSpec",
    "SegMaxAssignSpec",
    "SegMinAddSpec",
    "SegMaxAddSpec",
    "SegmentMinAssignTree",
    "SegmentMaxAssignTree",
    "SegmentMinAddTree",
    "SegmentMaxAddTree"
  ]);
  assert.deepEqual(lazyMinMaxEntry.features, [
    "range_assign",
    "range_add",
    "min",
    "max",
    "first_leq",
    "last_leq",
    "first_geq",
    "last_geq"
  ]);
  assert.deepEqual(lazyMinMaxEntry.sections, ["helpers"]);

  const maxSubarrayEntry = entries.find(
    (entry) => entry.path === "/solvers/segtree_max_subarray"
  );
  assert.ok(maxSubarrayEntry);
  assert.equal(maxSubarrayEntry.kind, "solver");
  assert.equal(maxSubarrayEntry.generator, undefined);
  assert.equal(maxSubarrayEntry.source, "solvers/segtree_max_subarray.hpp");
  assert.deepEqual(maxSubarrayEntry.exports, [
    "MaxSubarrayNode",
    "MaxSubarraySegTree"
  ]);
  assert.deepEqual(maxSubarrayEntry.features, ["max_subarray", "point_set"]);
  assert.deepEqual(maxSubarrayEntry.sections, ["helpers"]);

  const beatsEntry = entries.find(
    (entry) => entry.path === "/solvers/segtree_beats"
  );
  assert.ok(beatsEntry);
  assert.equal(beatsEntry.kind, "solver");
  assert.equal(beatsEntry.generator, "segtree_beats");
  assert.equal(beatsEntry.source, "solvers/segtree_beats.hpp");
  assert.deepEqual(beatsEntry.exports, ["SegmentTreeBeats"]);
  assert.deepEqual(beatsEntry.features, [
    "chmin",
    "chmax",
    "add",
    "sum",
    "min",
    "max"
  ]);
  assert.deepEqual(beatsEntry.sections, ["helpers"]);

  const fftNttEntry = entries.find((entry) => entry.path === "/solvers/fft_ntt");
  assert.ok(fftNttEntry);
  assert.equal(fftNttEntry.kind, "solver");
  assert.equal(fftNttEntry.generator, "fft_ntt");
  assert.equal(fftNttEntry.source, "solvers/fft_ntt.hpp");
  assert.deepEqual(fftNttEntry.exports, [
    "fft_next_power_of_two",
    "fft_is_power_of_two",
    "fft_bit_reverse",
    "fft_transform",
    "convolution_fft_round",
    "ntt_pow",
    "ntt_transform",
    "convolution_ntt_int"
  ]);
  assert.deepEqual(fftNttEntry.features, [
    "fft",
    "ntt",
    "convolution",
    "mod_998244353"
  ]);
  assert.deepEqual(fftNttEntry.sections, ["helpers"]);
}

function testCompletedMigrationGuardrails() {
  const repoRoot = path.join(__dirname, "..", "..");
  const catalogPath = path.join(repoRoot, "lib", "catalog", "snippets.json");
  const parsed = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const entries = Array.isArray(parsed) ? parsed : parsed.entries;
  const sourceFiles = [
    ...collectFiles(path.join(repoRoot, "lib"), new Set([".hpp"])),
    ...collectFiles(path.join(repoRoot, "tests"), new Set([".cpp"]))
  ];

  for (const migration of completedMigrations) {
    const legacyCatalogPath = `/${migration.legacyHeader.replace(/\.hpp$/, "")}`;
    const replacementHeader = toPosixPath(migration.replacementHeader);

    assert.equal(
      fs.existsSync(path.join(repoRoot, "lib", migration.legacyHeader)),
      false,
      `${migration.name} still has a top-level compatibility header`
    );
    assert.equal(
      fs.existsSync(path.join(repoRoot, "lib", migration.replacementHeader)),
      true,
      `${migration.name} replacement header is missing`
    );
    for (const removedFile of migration.removedFiles ?? []) {
      assert.equal(
        fs.existsSync(path.join(repoRoot, "lib", removedFile)),
        false,
        `${migration.name} removed file still exists: ${removedFile}`
      );
    }

    const entry = entries.find((candidate) => candidate.path === migration.catalogPath);
    assert.ok(entry, `${migration.catalogPath} is missing from the catalog`);
    if (entry.source !== undefined) {
      assert.equal(entry.source, replacementHeader);
    }

    for (const candidate of entries) {
      assert.notEqual(
        candidate.path,
        legacyCatalogPath,
        `${migration.name} still exposes ${legacyCatalogPath} in the catalog`
      );
      assert.notEqual(
        candidate.source,
        migration.legacyHeader,
        `${migration.name} still uses top-level source ${migration.legacyHeader}`
      );
      assert.equal(
        (candidate.dependsOn ?? []).includes(legacyCatalogPath),
        false,
        `${migration.name} still depends on ${legacyCatalogPath}`
      );
    }

    const expectedInclude = new RegExp(
      `#include "${escapeRegExp(`../lib/${replacementHeader}`)}"`
    );
    const forbiddenInclude = new RegExp(
      `#include "${escapeRegExp(`../lib/${migration.legacyHeader}`)}"`
    );
    const forbiddenLocalInclude = new RegExp(
      `#include "${escapeRegExp(migration.legacyHeader)}"`
    );
    for (const testFile of migration.tests) {
      const content = fs.readFileSync(path.join(repoRoot, "tests", testFile), "utf8");
      assert.match(content, expectedInclude);
      assert.doesNotMatch(content, forbiddenInclude);
    }

    for (const sourceFile of sourceFiles) {
      const content = fs.readFileSync(sourceFile, "utf8");
      assert.doesNotMatch(
        content,
        forbiddenInclude,
        `${path.relative(repoRoot, sourceFile)} includes completed legacy header ${migration.legacyHeader}`
      );
      assert.doesNotMatch(
        content,
        forbiddenLocalInclude,
        `${path.relative(repoRoot, sourceFile)} includes completed legacy header ${migration.legacyHeader}`
      );
    }

    for (const check of migration.extraSourceChecks ?? []) {
      const content = fs.readFileSync(path.join(repoRoot, ...check.pathParts), "utf8");
      assert.match(content, check.expected);
      assert.doesNotMatch(content, check.forbidden);
    }
  }
}

function testFinalLibraryShapeGuardrails() {
  const repoRoot = path.join(__dirname, "..", "..");
  const catalogPath = path.join(repoRoot, "lib", "catalog", "snippets.json");
  const parsed = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const entries = Array.isArray(parsed) ? parsed : parsed.entries;
  const validCatalogPath = /^(\/solvers\/|\/bricks\/)/;
  const validCatalogSource = /^(solvers\/|bricks\/)/;
  const topLevelTestInclude = /#include\s+"..\/lib\/[^/"]+\.hpp"/;
  const localHeaderInclude = /#include\s+"[^/"]+\.hpp"/;

  for (const root of [
    path.join(repoRoot, "lib"),
    path.join(repoRoot, "extension", "library")
  ]) {
    const topLevelHeaders = fs
      .readdirSync(root, { withFileTypes: true })
      .filter((entry) => entry.isFile() && path.extname(entry.name) === ".hpp")
      .map((entry) => entry.name);
    assert.deepEqual(topLevelHeaders, [], `${root} exposes top-level headers`);
  }

  for (const entry of entries) {
    assert.match(entry.path, validCatalogPath, `${entry.path} is not a solver/brick path`);
    if (entry.source !== undefined) {
      assert.match(
        entry.source,
        validCatalogSource,
        `${entry.path} uses top-level catalog source ${entry.source}`
      );
    }
    for (const dependency of entry.dependsOn ?? []) {
      assert.match(
        dependency,
        validCatalogPath,
        `${entry.path} depends on non solver/brick path ${dependency}`
      );
    }
  }

  for (const testFile of collectFiles(path.join(repoRoot, "tests"), new Set([".cpp"]))) {
    const content = fs.readFileSync(testFile, "utf8");
    assert.doesNotMatch(
      content,
      topLevelTestInclude,
      `${path.relative(repoRoot, testFile)} includes a top-level lib header`
    );
  }

  for (const sourceFile of [
    ...collectFiles(path.join(repoRoot, "lib"), new Set([".hpp"])),
    ...collectFiles(path.join(repoRoot, "extension", "library"), new Set([".hpp"]))
  ]) {
    const content = fs.readFileSync(sourceFile, "utf8");
    assert.doesNotMatch(
      content,
      localHeaderInclude,
      `${path.relative(repoRoot, sourceFile)} includes a local compatibility header`
    );
  }
}

function testManifestCommands() {
  const manifestPath = path.join(__dirname, "..", "package.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const contributedCommands = new Set(
    manifest.contributes.commands.map((command) => command.command)
  );
  const activationEvents = new Set(manifest.activationEvents);
  for (const command of [
    "edulcni.insertHeader",
    "edulcni.segtree",
    "edulcni.compressUnique",
    "edulcni.readVector",
    "edulcni.berlekampMassey",
    "edulcni.sparseTable"
  ]) {
    assert.equal(contributedCommands.has(command), true);
    assert.equal(activationEvents.has(`onCommand:${command}`), true);
  }
}

function testNamespaceUnwrap() {
  const content = `#ifndef EDULCNI_SOLVERS_DEMO_HPP
#define EDULCNI_SOLVERS_DEMO_HPP

#include <vector>

namespace edulcni {

int demo() { return 7; }

}  // namespace edulcni

#endif  // EDULCNI_SOLVERS_DEMO_HPP
`;
  assert.equal(core.renderHeaderContent(content, "solver").trim(), "int demo() { return 7; }");
}

function testGlobalInsertionOffset() {
  const text = `#include <bits/stdc++.h>
using namespace std;

void solve() {
}
`;
  const offset = core.findGlobalInsertionOffset(text);
  assert.equal(text.slice(offset).startsWith("\nvoid solve"), true);
}

function testGeneratedSegmentTrees() {
  assert.equal(core.renderSegmentTree(segmentOptions({})).includes("std::"), false);

  compileGenerated(
    "sum_point_set",
    segmentOptions({ aggregate: "sum", updates: ["point_set"] }),
    `
  int n = 4;
  vector<int> a = {1, 2, 3, 4};
  init_segtree(n);
  build(1, 0, n - 1, a);
  assert(get(1, 0, n - 1, 0, 3) == 10);
  point_set(1, 0, n - 1, 2, 10);
  assert(get(1, 0, n - 1, 1, 3) == 16);
`
  );

  compileGenerated(
    "min_range_add",
    segmentOptions({ aggregate: "min", updates: ["range_add"] }),
    `
  int n = 4;
  vector<int> a = {4, 8, 1, 6};
  init_segtree(n);
  build(1, 0, n - 1, a);
  range_add(1, 0, n - 1, 2, 3, -5);
  assert(get(1, 0, n - 1, 0, 3) == -4);
`
  );

  const lazyMinOptions = segmentOptions({
    aggregate: "min",
    updates: ["range_add"],
    descends: ["first_leq"],
    existingText: "int first_leq; int lazy_add; int get;"
  });
  assert.equal(lazyMinOptions.names.firstLeqName, "seg_first_leq");
  assert.equal(lazyMinOptions.names.lazyAddName, "seg_lazy_add");
  assert.equal(lazyMinOptions.names.queryName, "seg_get");
  const lazyMinContent = core.renderSegmentTree(lazyMinOptions);
  assert.match(lazyMinContent, /int seg_first_leq/);
  assert.match(lazyMinContent, /vector<int> seg_lazy_add/);

  compileGenerated(
    "min_range_add_first_leq",
    segmentOptions({
      aggregate: "min",
      updates: ["range_add"],
      descends: ["first_leq"]
    }),
    `
  int n = 4;
  vector<int> a = {4, 8, 1, 6};
  init_segtree(n);
  build(1, 0, n - 1, a);
  range_add(1, 0, n - 1, 0, 2, 3);
  assert(get(1, 0, n - 1, 0, 3) == 4);
  range_add(1, 0, n - 1, 2, 3, -5);
  assert(get(1, 0, n - 1, 0, 3) == -1);
  assert(first_leq(1, 0, n - 1, 0, 3, 0) == 2);
  assert(first_leq(1, 0, n - 1, 0, 1, 7) == 0);
  assert(first_leq(1, 0, n - 1, 0, 1, 3) == -1);
`
  );

  compileGenerated(
    "max_range_assign",
    segmentOptions({ aggregate: "max", updates: ["range_assign"] }),
    `
  int n = 3;
  vector<int> a = {1, 9, 2};
  init_segtree(n);
  build(1, 0, n - 1, a);
  range_assign(1, 0, n - 1, 0, 1, 4);
  assert(get(1, 0, n - 1, 0, 2) == 4);
  range_assign(1, 0, n - 1, 2, 2, 10);
  assert(get(1, 0, n - 1, 0, 2) == 10);
`
  );

  const collisionOptions = segmentOptions({
    aggregate: "min",
    updates: ["point_set", "point_add"],
    outputMode: "iterative_class",
    existingText:
      "class SegmentTree {}; struct SegmentMinOp {}; using SegmentMinTree = int;"
  });
  assert.equal(collisionOptions.names.className, "PointSegmentTree");
  assert.equal(collisionOptions.names.minOpName, "PointSegmentMinOp");
  assert.equal(collisionOptions.names.minAliasName, "PointSegmentMinTree");

  const pointClass = core.renderSegmentTree(collisionOptions);
  assert.match(pointClass, /class PointSegmentTree/);
  assert.match(pointClass, /struct PointSegmentMinOp/);
  assert.match(pointClass, /using PointSegmentMinTree = PointSegmentTree/);
  assert.match(pointClass, /void point_add/);

  compileGenerated(
    "iterative_min_point_tree",
    segmentOptions({
      aggregate: "min",
      updates: ["point_set", "point_add"],
      outputMode: "iterative_class"
    }),
    `
  vector<int> a = {5, 1, 7, 3};
  SegmentMinTree<int> st(a);
  assert(st.query(0, 4) == 1);
  st.point_set(1, 9);
  assert(st.query(0, 4) == 3);
  st.point_add(3, -2);
  assert(st.query(2, 4) == 1);
`
  );

  compileGenerated(
    "custom_point_add",
    segmentOptions({
      aggregate: "custom",
      updates: ["point_add"],
      valueType: "ll",
      custom: {
        nodeType: "Node",
        leafTarget: "node.x",
        leafExpression: "value",
        updateTarget: "node.x"
      }
    }),
    `
  int n = 3;
  vector<ll> a = {1, 2, 3};
  init_segtree(n);
  build(1, 0, n - 1, a);
  assert(get(1, 0, n - 1, 0, 2).x == 6);
  point_add(1, 0, n - 1, 1, 5);
  assert(get(1, 0, n - 1, 0, 2).x == 11);
`
  );
}

function testGeneratedSegmentTreeBeatsCompiles() {
  {
    const generated = core.renderSegmentTreeBeats(
      segtreeBeatsOptions({ includeUsageComment: false })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "typedef long long ll;",
      "",
      generated,
      "int main() {",
      "  vector<ll> a = {5, 1, 7, 3, 9};",
      "  SegmentTreeBeats<ll> seg(a);",
      "  assert(seg.query_sum(0, 4) == 25);",
      "  assert(seg.query_min(0, 4) == 1);",
      "  assert(seg.query_max(0, 4) == 9);",
      "  seg.chmin(0, 4, 6);",
      "  assert(seg.query_sum(0, 4) == 21);",
      "  assert(seg.query_max(0, 4) == 6);",
      "  seg.chmax(1, 3, 4);",
      "  assert(seg.query_sum(0, 4) == 25);",
      "  assert(seg.query_min(0, 4) == 4);",
      "  seg.add(2, 4, -2);",
      "  assert(seg.query_sum(0, 4) == 19);",
      "  assert(seg.query_min(0, 4) == 2);",
      "  assert(seg.query_max(0, 4) == 5);",
      "  seg.chmin(-5, 2, 3);",
      "  assert(seg.query_sum(0, 4) == 15);",
      "  seg.chmax(3, 99, 5);",
      "  assert(seg.query_sum(0, 4) == 19);",
      "  assert(seg.query_min(0, 4) == 3);",
      "  assert(seg.query_max(0, 4) == 5);",
      "  assert(seg.query_sum(7, 2) == 0);",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("segtree_beats_generated", source);
  }

  {
    const generated = core.renderSegmentTreeBeats(
      segtreeBeatsOptions({
        updates: [],
        queries: ["sum"],
        includeUsageComment: false
      })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "typedef long long ll;",
      "",
      generated,
      "int main() {",
      "  vector<ll> a = {2, 4, 8};",
      "  SegmentTreeBeats<ll> seg(a);",
      "  assert(seg.query_sum(0, 2) == 14);",
      "  assert(seg.query_sum(-10, 1) == 6);",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("segtree_beats_query_only_generated", source);
  }
}

function testInteractiveBrickRenderers() {
  assert.equal(
    core.renderReadVector({
      name: "a",
      sizeExpression: "n",
      valueType: "int",
      containerType: "vi"
    }),
    "vi a(n);\nfor (auto& x : a) cin >> x;\n"
  );

  const compressed = core.renderCompressUnique({
    sourceName: "a",
    valuesName: "vals",
    idFunctionName: "get_id",
    rewriteSource: true
  });
  assert.match(compressed, /auto vals = a;/);
  assert.match(compressed, /for \(auto& x : a\) x = get_id\(x\);/);
}

function testBerlekampMasseyRenderer() {
  const defaultContent = core.renderBerlekampMassey(berlekampOptions());
  assert.match(defaultContent, /berlekamp_massey/);
  assert.match(defaultContent, /linear_recurrence_kth/);
  assert.match(defaultContent, /berlekamp_massey_kth/);
  assert.match(defaultContent, /\/\*\nExample:/);

  const minimalContent = core.renderBerlekampMassey(
    berlekampOptions({
      features: ["minimal_recurrence"],
      includeUsageComment: false
    })
  );
  assert.match(minimalContent, /berlekamp_massey/);
  assert.doesNotMatch(minimalContent, /linear_recurrence_kth/);

  const kthOnlyContent = core.renderBerlekampMassey(
    berlekampOptions({ features: ["kth_term"] })
  );
  assert.match(kthOnlyContent, /recurrence coefficients/);

  const collisionOptions = berlekampOptions({
    existingText: "int berlekamp_massey; int linear_recurrence_kth; int berlekamp_massey_kth;"
  });
  assert.deepEqual(collisionOptions.names, {
    berlekampMasseyName: "berlekamp_massey2",
    linearRecurrenceKthName: "linear_recurrence_kth2",
    berlekampMasseyKthName: "berlekamp_massey_kth2"
  });
  assert.match(core.renderBerlekampMassey(collisionOptions), /berlekamp_massey2/);
}

function testSparseTableRenderer() {
  const defaultContent = core.renderSparseTable(
    sparseOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /vector<vector<int>> sparse_min;/);
  assert.match(defaultContent, /void build_sparse_min/);
  assert.match(defaultContent, /int query_sparse_min\(int left, int right\)/);
  assert.match(defaultContent, /void build_sparse_max/);
  assert.match(defaultContent, /int query_sparse_max\(int left, int right\)/);

  const maxOnly = core.renderSparseTable(
    sparseOptions({
      variants: ["max"],
      includeUsageComment: false
    })
  );
  assert.doesNotMatch(maxOnly, /build_sparse_min/);
  assert.match(maxOnly, /build_sparse_max/);

  const collisionOptions = sparseOptions({
    existingText:
      "int sparse_log; int ensure_sparse_log; int build_sparse_min; int query_sparse_min; int sparse_max;"
  });
  assert.equal(collisionOptions.names.logName, "sparse_log2");
  assert.equal(collisionOptions.names.ensureLogName, "ensure_sparse_log2");
  assert.equal(collisionOptions.names.buildMinName, "build_sparse_min2");
  assert.equal(collisionOptions.names.queryMinName, "query_sparse_min2");
  assert.equal(collisionOptions.names.maxTableName, "sparse_max2");
  assert.match(core.renderSparseTable(collisionOptions), /sparse_log2/);
  assert.match(core.renderSparseTable(collisionOptions), /build_sparse_min2/);
}

function testDsuRenderer() {
  const defaultContent = core.renderDsu(dsuOptions({ includeUsageComment: false }));
  assert.match(defaultContent, /class Dsu/);
  assert.match(defaultContent, /explicit Dsu\(int n = 0\)/);
  assert.match(defaultContent, /bool unite\(int a, int b\)/);
  assert.match(defaultContent, /std::vector<int> parent_/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const usageContent = core.renderDsu(dsuOptions());
  assert.match(usageContent, /\/\*\nExample:/);
  assert.match(usageContent, /Dsu dsu\(n\);/);

  const collisionOptions = dsuOptions({
    existingText: "class Dsu {}; int dsu;"
  });
  assert.equal(collisionOptions.names.className, "Dsu2");
  assert.match(core.renderDsu(collisionOptions), /class Dsu2/);
  assert.match(core.renderDsu(collisionOptions), /explicit Dsu2\(int n = 0\)/);
}

function testRollbackDsuRenderer() {
  const defaultContent = core.renderRollbackDsu(
    rollbackDsuOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /class RollbackDsu/);
  assert.match(defaultContent, /explicit RollbackDsu\(int n = 0\)/);
  assert.match(defaultContent, /int snapshot\(\) const/);
  assert.match(defaultContent, /void rollback\(int snapshot_id\)/);
  assert.match(defaultContent, /std::vector<Change> history_/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const usageContent = core.renderRollbackDsu(rollbackDsuOptions());
  assert.match(usageContent, /\/\*\nExample:/);
  assert.match(usageContent, /RollbackDsu dsu\(n\);/);
  assert.match(usageContent, /dsu.rollback\(snap\);/);

  const collisionOptions = rollbackDsuOptions({
    existingText:
      "class RollbackDsu {}; int unite; int rollback; int history; int dsu;"
  });
  assert.equal(collisionOptions.names.className, "RollbackDsu2");
  assert.match(core.renderRollbackDsu(collisionOptions), /class RollbackDsu2/);
  assert.match(
    core.renderRollbackDsu(collisionOptions),
    /explicit RollbackDsu2\(int n = 0\)/
  );
}

function testLcaRenderer() {
  const defaultContent = core.renderLca(lcaOptions({ includeUsageComment: false }));
  assert.match(defaultContent, /class LcaBinaryLifting/);
  assert.match(defaultContent, /explicit LcaBinaryLifting\(int n = 0\)/);
  assert.match(defaultContent, /void add_edge\(int a, int b, bool undirected = true\)/);
  assert.match(defaultContent, /int kth_ancestor\(int v, int k\) const/);
  assert.match(defaultContent, /int lca\(int a, int b\) const/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const usageContent = core.renderLca(lcaOptions());
  assert.match(usageContent, /\/\*\nExample:/);
  assert.match(usageContent, /LcaBinaryLifting lca\(n\);/);

  const collisionOptions = lcaOptions({
    existingText: "class LcaBinaryLifting {}; int LcaBinaryLifting2;"
  });
  assert.equal(collisionOptions.names.className, "LcaBinaryLifting3");
  assert.match(core.renderLca(collisionOptions), /class LcaBinaryLifting3/);
  assert.match(
    core.renderLca(collisionOptions),
    /explicit LcaBinaryLifting3\(int n = 0\)/
  );
}

function testBfsRenderer() {
  const defaultContent = core.renderBfs(bfsOptions({ includeUsageComment: false }));
  assert.match(defaultContent, /struct BfsResult/);
  assert.match(defaultContent, /inline void bfs_add_edge/);
  assert.match(defaultContent, /inline BfsResult bfs_multi_source/);
  assert.match(defaultContent, /inline BfsResult bfs\(/);
  assert.match(defaultContent, /inline std::vector<int> bfs_restore_path/);
  assert.match(defaultContent, /std::queue<int> q/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const usageContent = core.renderBfs(bfsOptions());
  assert.match(usageContent, /\/\*\nExample:/);
  assert.match(usageContent, /auto result = bfs\(graph, source\);/);

  const collisionOptions = bfsOptions({
    existingText:
      "struct BfsResult {}; int bfs_add_edge; int bfs_multi_source; int bfs; int bfs_restore_path; int bfs_restore_path_to_root;"
  });
  assert.equal(collisionOptions.names.resultStructName, "BfsSearchResult");
  assert.equal(collisionOptions.names.addEdgeName, "bfs_graph_add_edge");
  assert.equal(collisionOptions.names.multiSourceName, "bfs_from_sources");
  assert.equal(collisionOptions.names.singleSourceName, "run_bfs");
  assert.equal(collisionOptions.names.restorePathName, "bfs_get_path");
  assert.equal(
    collisionOptions.names.restorePathToRootName,
    "bfs_get_path_to_root"
  );
  const collisionContent = core.renderBfs(collisionOptions);
  assert.match(collisionContent, /struct BfsSearchResult/);
  assert.match(collisionContent, /inline void bfs_graph_add_edge/);
  assert.match(collisionContent, /inline BfsSearchResult bfs_from_sources/);
  assert.match(collisionContent, /inline BfsSearchResult run_bfs/);
  assert.match(collisionContent, /bfs_get_path/);
  assert.match(collisionContent, /bfs_get_path_to_root/);
}

function testLinearSieveRenderer() {
  const defaultContent = core.renderLinearSieve(
    linearSieveOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /class LinearSieve/);
  assert.match(defaultContent, /explicit LinearSieve\(int limit = 0\)/);
  assert.match(defaultContent, /const std::vector<int>& lowest_prime\(\) const/);
  assert.match(defaultContent, /bool is_prime\(int value\) const/);
  assert.match(defaultContent, /std::vector<std::pair<int, int>> factorize/);
  assert.match(defaultContent, /inline std::vector<int> linear_sieve_primes/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const usageContent = core.renderLinearSieve(linearSieveOptions());
  assert.match(usageContent, /\/\*\nExample:/);
  assert.match(usageContent, /LinearSieve sieve\(n\);/);

  const minimalContent = core.renderLinearSieve(
    linearSieveOptions({
      features: ["primes"],
      includeUsageComment: false
    })
  );
  assert.match(minimalContent, /const std::vector<int>& primes\(\) const/);
  assert.doesNotMatch(minimalContent, /lowest_prime\(\) const/);
  assert.doesNotMatch(minimalContent, /factorize/);

  const collisionOptions = linearSieveOptions({
    existingText:
      "class LinearSieve {}; int linear_sieve_lowest_prime; int linear_sieve_primes;"
  });
  assert.equal(collisionOptions.names.className, "LinearSieve2");
  assert.equal(collisionOptions.names.lowestPrimeFunctionName, "build_lowest_prime");
  assert.equal(collisionOptions.names.primesFunctionName, "linear_sieve_prime_list");
  const collisionContent = core.renderLinearSieve(collisionOptions);
  assert.match(collisionContent, /class LinearSieve2/);
  assert.match(collisionContent, /inline std::vector<int> build_lowest_prime/);
  assert.match(collisionContent, /inline std::vector<int> linear_sieve_prime_list/);
}

function testFenwickRenderer() {
  const defaultContent = core.renderFenwick(
    fenwickOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /struct FenwickSumOp/);
  assert.match(defaultContent, /struct FenwickXorOp/);
  assert.match(defaultContent, /struct FenwickMaxOp/);
  assert.match(defaultContent, /struct FenwickMinOp/);
  assert.match(defaultContent, /class Fenwick/);
  assert.match(defaultContent, /using FenwickSumTree = Fenwick<T, FenwickSumOp<T>>;/);
  assert.match(defaultContent, /using FenwickXorTree = Fenwick<T, FenwickXorOp<T>>;/);
  assert.match(defaultContent, /T segment\(int left, int right\) const/);
  assert.match(defaultContent, /int descend\(const T& target\) const/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const usageContent = core.renderFenwick(fenwickOptions());
  assert.match(usageContent, /\/\*\nExample:/);
  assert.match(usageContent, /FenwickSumTree<long long> fw\(n\);/);

  const sumOnlyContent = core.renderFenwick(
    fenwickOptions({
      operations: ["sum"],
      includeUsageComment: false
    })
  );
  assert.match(sumOnlyContent, /struct FenwickSumOp/);
  assert.doesNotMatch(sumOnlyContent, /struct FenwickXorOp/);
  assert.doesNotMatch(sumOnlyContent, /struct FenwickMaxOp/);
  assert.doesNotMatch(sumOnlyContent, /struct FenwickMinOp/);
  assert.match(sumOnlyContent, /using FenwickSumTree = Fenwick<T, FenwickSumOp<T>>;/);
  assert.doesNotMatch(sumOnlyContent, /using FenwickXorTree/);

  const collisionOptions = fenwickOptions({
    existingText:
      "struct FenwickSumOp {}; struct FenwickXorOp {}; struct FenwickMaxOp {}; struct FenwickMinOp {}; class Fenwick {}; int FenwickSumTree; int FenwickXorTree; int FenwickMaxTree; int FenwickMinTree;"
  });
  assert.equal(collisionOptions.names.sumOpName, "FenwickSumOp2");
  assert.equal(collisionOptions.names.xorOpName, "FenwickXorOp2");
  assert.equal(collisionOptions.names.maxOpName, "FenwickMaxOp2");
  assert.equal(collisionOptions.names.minOpName, "FenwickMinOp2");
  assert.equal(collisionOptions.names.className, "Fenwick2");
  assert.equal(collisionOptions.names.sumAliasName, "FenwickSumTree2");
  assert.equal(collisionOptions.names.xorAliasName, "FenwickXorTree2");
  assert.equal(collisionOptions.names.maxAliasName, "FenwickMaxTree2");
  assert.equal(collisionOptions.names.minAliasName, "FenwickMinTree2");
  const collisionContent = core.renderFenwick(collisionOptions);
  assert.match(collisionContent, /struct FenwickSumOp2/);
  assert.match(collisionContent, /class Fenwick2/);
  assert.match(collisionContent, /using FenwickSumTree2 = Fenwick2<T, FenwickSumOp2<T>>;/);
}

function testModIntRenderer() {
  const defaultContent = core.renderModInt(
    modIntOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /template <int MOD>\nclass StaticModInt/);
  assert.match(defaultContent, /class DynamicModInt/);
  assert.match(defaultContent, /static int value = 1000000007;/);
  assert.match(defaultContent, /StaticModInt pow\(long long exponent\) const/);
  assert.match(defaultContent, /DynamicModInt pow\(long long exponent\) const/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const usageContent = core.renderModInt(modIntOptions());
  assert.match(usageContent, /\/\*\nExample:/);
  assert.match(usageContent, /using Mint = StaticModInt<1000000007>;/);
  assert.match(usageContent, /DynamicModInt::set_mod\(998244353\);/);

  const staticContent = core.renderModInt(
    modIntOptions({
      mode: "static",
      includeUsageComment: false
    })
  );
  assert.match(staticContent, /class StaticModInt/);
  assert.doesNotMatch(staticContent, /class DynamicModInt/);

  const dynamicContent = core.renderModInt(
    modIntOptions({
      mode: "dynamic",
      dynamicDefaultModExpression: "998244353",
      includeUsageComment: false
    })
  );
  assert.doesNotMatch(dynamicContent, /class StaticModInt/);
  assert.match(dynamicContent, /class DynamicModInt/);
  assert.match(dynamicContent, /static int value = 998244353;/);

  const collisionOptions = modIntOptions({
    existingText: "class StaticModInt {}; class DynamicModInt {};"
  });
  assert.equal(collisionOptions.names.staticClassName, "StaticModInt2");
  assert.equal(collisionOptions.names.dynamicClassName, "DynamicModInt2");
  const collisionContent = core.renderModInt(collisionOptions);
  assert.match(collisionContent, /class StaticModInt2/);
  assert.match(collisionContent, /class DynamicModInt2/);
}

function testTwoSatRenderer() {
  const defaultContent = core.renderTwoSat(
    twosatOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /class TwoSat/);
  assert.match(defaultContent, /void add_or\(int a, bool a_value/);
  assert.match(defaultContent, /void add_implication\(int a, bool a_value/);
  assert.match(defaultContent, /bool solve\(\)/);
  assert.match(defaultContent, /const std::vector<bool>& assignment\(\) const/);
  assert.doesNotMatch(defaultContent, /add_xor/);
  assert.doesNotMatch(defaultContent, /add_equal/);
  assert.doesNotMatch(defaultContent, /add_true/);
  assert.doesNotMatch(defaultContent, /add_at_most_one/);
  assert.doesNotMatch(defaultContent, /int component\(int var, bool value\) const/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const fullContent = core.renderTwoSat(
    twosatOptions({
      features: ["xor", "equal", "force", "at_most_one", "components"],
      includeUsageComment: false
    })
  );
  assert.match(fullContent, /void add_xor\(int a, bool a_value/);
  assert.match(fullContent, /void add_equal\(int a, bool a_value/);
  assert.match(fullContent, /void add_true\(int var, bool value = true\)/);
  assert.match(fullContent, /void add_false\(int var\)/);
  assert.match(fullContent, /void add_at_most_one\(const std::vector<int>& vars\)/);
  assert.match(fullContent, /int component\(int var, bool value\) const/);

  const usageContent = core.renderTwoSat(
    twosatOptions({ features: ["xor", "force"] })
  );
  assert.match(usageContent, /\/\*\nExample:/);
  assert.match(usageContent, /TwoSat sat\(n\);/);
  assert.match(usageContent, /sat\.add_xor\(x, true, y, true\);/);
  assert.match(usageContent, /sat\.add_true\(forced_var\);/);

  const collisionOptions = twosatOptions({
    existingText:
      "class TwoSat {}; int add_or; int add_implication; int add_xor; int solve; int assignment; int implication_graph; int node; int graph_; int assignment_;"
  });
  assert.equal(collisionOptions.names.className, "TwoSat2");
  assert.equal(collisionOptions.names.addOrName, "twosat_add_or");
  assert.equal(
    collisionOptions.names.addImplicationName,
    "twosat_add_implication"
  );
  assert.equal(collisionOptions.names.addXorName, "twosat_add_xor");
  assert.equal(collisionOptions.names.solveName, "twosat_solve");
  assert.equal(collisionOptions.names.assignmentName, "twosat_assignment");
  assert.equal(
    collisionOptions.names.implicationGraphName,
    "twosat_implication_graph"
  );
  assert.equal(collisionOptions.names.nodeName, "twosat_node");
  assert.equal(collisionOptions.names.graphFieldName, "twosat_graph_");
  assert.equal(
    collisionOptions.names.assignmentFieldName,
    "twosat_assignment_"
  );

  const collisionContent = core.renderTwoSat({
    ...collisionOptions,
    features: ["xor"],
    includeUsageComment: false
  });
  assert.match(collisionContent, /class TwoSat2/);
  assert.match(collisionContent, /void twosat_add_or/);
  assert.match(collisionContent, /void twosat_add_xor/);
  assert.match(collisionContent, /bool twosat_solve\(\)/);
  assert.match(collisionContent, /std::vector<std::vector<int>> twosat_graph_/);
}

function testMaxflowDinicRenderer() {
  const defaultContent = core.renderMaxflowDinic(
    maxflowDinicOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /class Dinic/);
  assert.match(defaultContent, /struct Edge/);
  assert.match(defaultContent, /int add_edge\(int from, int to, Cap cap/);
  assert.match(defaultContent, /Cap max_flow\(int source, int sink\)/);
  assert.match(defaultContent, /bool left_of_min_cut\(int vertex\) const/);
  assert.match(defaultContent, /const std::vector<std::vector<Edge>>& graph\(\) const/);
  assert.match(defaultContent, /void reset_flows\(\)/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const usageContent = core.renderMaxflowDinic(maxflowDinicOptions());
  assert.match(usageContent, /\/\*\nExample:/);
  assert.match(usageContent, /Dinic<long long> dinic\(n\);/);
  assert.match(usageContent, /dinic\.max_flow\(s, t\)/);

  const helperOnly = core.renderMaxflowDinic(
    maxflowDinicOptions({
      features: [],
      includeUsageComment: false
    })
  );
  assert.doesNotMatch(helperOnly, /left_of_min_cut/);
  assert.doesNotMatch(helperOnly, /graph\(\) const/);
  assert.doesNotMatch(helperOnly, /reset_flows/);

  const inputRecipe = core.renderMaxflowDinicRecipe(
    maxflowDinicOptions({
      generateInput: true,
      includeUsageComment: false
    })
  );
  assert.match(inputRecipe.sections.solve[0], /void solve\(\)/);
  assert.match(inputRecipe.sections.solve[0], /cin >> n >> m >> s >> t;/);
  assert.match(inputRecipe.sections.solve[0], /dinic\.add_edge\(u, v, cap\);/);

  const collisionOptions = maxflowDinicOptions({
    existingText:
      "class Dinic {}; struct Edge {}; int max_flow; int graph; int build_level_graph; int push_flow;"
  });
  assert.equal(collisionOptions.names.className, "MaxflowDinic");
  assert.equal(collisionOptions.names.edgeName, "DinicEdge");
  assert.equal(collisionOptions.names.maxFlowName, "dinic_max_flow");
  assert.equal(collisionOptions.names.graphName, "dinic_graph");
  assert.equal(collisionOptions.names.buildLevelName, "dinic_build_level_graph");
  assert.equal(collisionOptions.names.pushFlowName, "dinic_push_flow");

  const collisionContent = core.renderMaxflowDinic(collisionOptions);
  assert.match(collisionContent, /class MaxflowDinic/);
  assert.match(collisionContent, /struct DinicEdge/);
  assert.match(collisionContent, /Cap dinic_max_flow\(int source, int sink\)/);
  assert.match(collisionContent, /bool dinic_build_level_graph/);
  assert.match(collisionContent, /Cap dinic_push_flow/);
}

function testMinCostMaxFlowRenderer() {
  const defaultContent = core.renderMinCostMaxFlow(
    minCostMaxFlowOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /class MinCostMaxFlow/);
  assert.match(defaultContent, /struct Edge/);
  assert.match(defaultContent, /int add_edge\(int from, int to, Cap cap, Cost cost\)/);
  assert.match(defaultContent, /std::pair<Cap, Cost> min_cost_flow/);
  assert.match(defaultContent, /std::pair<Cap, Cost> min_cost_max_flow/);
  assert.match(defaultContent, /const std::vector<std::vector<Edge>>& graph\(\) const/);
  assert.match(defaultContent, /const std::vector<Cost>& potential\(\) const/);
  assert.match(defaultContent, /set_potential_with_bellman_ford/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const usageContent = core.renderMinCostMaxFlow(minCostMaxFlowOptions());
  assert.match(usageContent, /\/\*\nExample:/);
  assert.match(usageContent, /MinCostMaxFlow<long long, long long> flow\(n\);/);
  assert.match(usageContent, /flow\.min_cost_max_flow\(s, t\)/);

  const fixedUsageContent = core.renderMinCostMaxFlow(
    minCostMaxFlowOptions({ mode: "fixed_flow" })
  );
  assert.match(fixedUsageContent, /flow\.min_cost_flow\(s, t, flow_limit\)/);

  const helperOnly = core.renderMinCostMaxFlow(
    minCostMaxFlowOptions({
      features: [],
      includeUsageComment: false
    })
  );
  assert.doesNotMatch(helperOnly, /graph\(\) const/);
  assert.doesNotMatch(helperOnly, /potential\(\) const/);
  assert.doesNotMatch(helperOnly, /void set_potential_with_bellman_ford/);

  const inputRecipe = core.renderMinCostMaxFlowRecipe(
    minCostMaxFlowOptions({
      generateInput: true,
      mode: "fixed_flow",
      includeUsageComment: false
    })
  );
  assert.match(inputRecipe.sections.solve[0], /void solve\(\)/);
  assert.match(inputRecipe.sections.solve[0], /cin >> n >> m >> s >> t;/);
  assert.match(inputRecipe.sections.solve[0], /long long flow_limit;/);
  assert.match(inputRecipe.sections.solve[0], /flow\.add_edge\(u, v, cap, cost\);/);
  assert.match(inputRecipe.sections.solve[0], /flow\.min_cost_flow\(s, t, flow_limit\);/);

  const collisionOptions = minCostMaxFlowOptions({
    existingText:
      "class MinCostMaxFlow {}; struct Edge {}; int min_cost_flow; int graph; int potential; int bellman_ford_initialize; int dijkstra; int result; int solve;"
  });
  assert.equal(collisionOptions.names.className, "MincostMaxflow");
  assert.equal(collisionOptions.names.edgeName, "McmfEdge");
  assert.equal(collisionOptions.names.minCostFlowName, "mcmf_min_cost_flow");
  assert.equal(collisionOptions.names.graphName, "mcmf_graph");
  assert.equal(collisionOptions.names.potentialName, "mcmf_potential");
  assert.equal(collisionOptions.names.bellmanFordName, "mcmf_bellman_ford_initialize");
  assert.equal(collisionOptions.names.dijkstraName, "mcmf_dijkstra");
  assert.equal(collisionOptions.names.solveName, "solve_mincost_flow");
  assert.equal(collisionOptions.names.resultName, "flow_cost");

  const collisionContent = core.renderMinCostMaxFlow(collisionOptions);
  assert.match(collisionContent, /class MincostMaxflow/);
  assert.match(collisionContent, /struct McmfEdge/);
  assert.match(collisionContent, /std::pair<Cap, Cost> mcmf_min_cost_flow/);
  assert.match(collisionContent, /bool mcmf_dijkstra/);
}

function testHungarianRenderer() {
  const defaultContent = core.renderHungarian(
    hungarianOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /struct HungarianResult/);
  assert.match(defaultContent, /hungarian_internal/);
  assert.match(defaultContent, /hungarian\(/);
  assert.match(defaultContent, /transposed/);
  assert.doesNotMatch(defaultContent, /hungarian_maximize/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const usageContent = core.renderHungarian(hungarianOptions());
  assert.match(usageContent, /\/\*\nExample:/);
  assert.match(usageContent, /auto assignment = hungarian\(cost\);/);

  const maximizeContent = core.renderHungarian(
    hungarianOptions({
      mode: "maximize",
      sourceName: "value",
      includeUsageComment: false
    })
  );
  assert.match(maximizeContent, /hungarian_maximize/);
  assert.match(maximizeContent, /max_value - value\[i\]\[j\]/);

  const squareOnlyContent = core.renderHungarian(
    hungarianOptions({
      rectangular: false,
      includeUsageComment: false
    })
  );
  assert.doesNotMatch(squareOnlyContent, /transposed/);
  assert.match(squareOnlyContent, /if \(n > m\)/);

  const solveRecipe = core.renderHungarianRecipe(
    hungarianOptions({
      generateInput: true,
      includeUsageComment: false
    })
  );
  assert.match(solveRecipe.sections.solve[0], /void solve\(\)/);
  assert.match(solveRecipe.sections.solve[0], /cin >> n >> m;/);
  assert.match(solveRecipe.sections.solve[0], /auto assignment = hungarian\(cost\);/);

  const collisionOptions = hungarianOptions({
    existingText:
      "struct HungarianResult {}; int hungarian_internal; int hungarian; int hungarian_maximize; int solve; int assignment;"
  });
  assert.equal(collisionOptions.names.resultStructName, "HungarianResult2");
  assert.equal(collisionOptions.names.internalName, "hungarian_internal2");
  assert.equal(collisionOptions.names.minimizeName, "hungarian2");
  assert.equal(collisionOptions.names.maximizeName, "hungarian_maximize2");
  assert.equal(collisionOptions.names.solveName, "solve_hungarian");

  const collisionContent = core.renderHungarian(collisionOptions);
  assert.match(collisionContent, /struct HungarianResult2/);
  assert.match(collisionContent, /hungarian_internal2/);
  assert.match(collisionContent, /hungarian2/);
}

function testKuhnRenderer() {
  const defaultContent = core.renderKuhn(
    kuhnOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /struct KuhnResult/);
  assert.match(defaultContent, /class KuhnMatcher/);
  assert.match(defaultContent, /kuhn_maximum_matching/);
  assert.match(defaultContent, /BipartiteVertexCover/);
  assert.match(defaultContent, /minimum_vertex_cover_bipartite/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const matchingOnlyContent = core.renderKuhn(
    kuhnOptions({
      features: [],
      includeUsageComment: false
    })
  );
  assert.match(matchingOnlyContent, /class KuhnMatcher/);
  assert.doesNotMatch(matchingOnlyContent, /BipartiteVertexCover/);
  assert.doesNotMatch(matchingOnlyContent, /minimum_vertex_cover_bipartite/);

  const usageContent = core.renderKuhn(kuhnOptions());
  assert.match(usageContent, /\/\*\nExample:/);
  assert.match(usageContent, /auto matching = matcher\.maximum_matching\(\);/);
  assert.match(usageContent, /matching\.matching_size/);

  const solveRecipe = core.renderKuhnRecipe(
    kuhnOptions({
      generateInput: true,
      includeUsageComment: false
    })
  );
  assert.match(solveRecipe.sections.solve[0], /void solve\(\)/);
  assert.match(solveRecipe.sections.solve[0], /cin >> n >> m >> e;/);
  assert.match(solveRecipe.sections.solve[0], /--u;/);
  assert.match(solveRecipe.sections.solve[0], /matcher\.add_edge\(u, v\);/);
  assert.match(solveRecipe.sections.solve[0], /auto matching = matcher\.maximum_matching\(\);/);

  const collisionOptions = kuhnOptions({
    existingText:
      "struct KuhnResult {}; struct BipartiteVertexCover {}; class KuhnMatcher {}; int kuhn_maximum_matching; int minimum_vertex_cover_bipartite; int match_left; int match_right; int try_augment; int solve; int matching; int vertex_cover;"
  });
  assert.equal(collisionOptions.names.resultStructName, "KuhnResult2");
  assert.equal(collisionOptions.names.coverStructName, "BipartiteVertexCover2");
  assert.equal(collisionOptions.names.className, "KuhnMatcher2");
  assert.equal(collisionOptions.names.matchFunctionName, "kuhn_maximum_matching2");
  assert.equal(
    collisionOptions.names.vertexCoverFunctionName,
    "minimum_vertex_cover_bipartite2"
  );
  assert.equal(collisionOptions.names.matchLeftName, "kuhn_match_left");
  assert.equal(collisionOptions.names.matchRightName, "kuhn_match_right");
  assert.equal(collisionOptions.names.tryAugmentName, "kuhn_dfs");
  assert.equal(collisionOptions.names.solveName, "solve_kuhn");

  const collisionContent = core.renderKuhn(collisionOptions);
  assert.match(collisionContent, /struct KuhnResult2/);
  assert.match(collisionContent, /class KuhnMatcher2/);
  assert.match(collisionContent, /std::vector<int> kuhn_match_left/);
  assert.match(collisionContent, /bool kuhn_dfs/);
}

function testImplicitTreapRenderer() {
  const defaultContent = core.renderImplicitTreap(
    implicitTreapOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /struct TreapSumOp/);
  assert.match(defaultContent, /class ImplicitTreap/);
  assert.match(defaultContent, /void reverse\(int left, int right\)/);
  assert.match(defaultContent, /T range_query\(int left, int right\)/);
  assert.doesNotMatch(defaultContent, /void add\(int left, int right/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const usageContent = core.renderImplicitTreap(implicitTreapOptions());
  assert.match(usageContent, /\/\*\nInclusive \[l, r\] ranges:/);
  assert.match(usageContent, /ImplicitTreap<ll> treap;/);
  assert.match(usageContent, /treap\.reverse\(l, r\);/);

  const addContent = core.renderImplicitTreap(
    implicitTreapOptions({
      features: ["reverse", "range_add"],
      includeUsageComment: false
    })
  );
  assert.match(addContent, /static void apply_delta/);
  assert.match(addContent, /void add\(int left, int right, const T& delta\)/);

  const customContent = core.renderImplicitTreap(
    implicitTreapOptions({
      aggregate: "custom",
      features: ["range_add"],
      includeUsageComment: false
    })
  );
  assert.match(customContent, /struct TreapCustomOp/);
  assert.match(customContent, /TODO: replace with the problem-specific aggregate merge/);

  const collisionOptions = implicitTreapOptions({
    existingText:
      "struct TreapSumOp {}; class ImplicitTreap {}; struct Node {}; int split; int merge; int root; int reverse;"
  });
  assert.equal(collisionOptions.names.sumOpName, "TreapSumOp2");
  assert.equal(collisionOptions.names.className, "ImplicitTreap2");
  assert.equal(collisionOptions.names.nodeName, "TreapNode");
  assert.equal(collisionOptions.names.splitName, "treap_split");
  assert.equal(collisionOptions.names.mergeName, "treap_merge");
  assert.equal(collisionOptions.names.rootName, "treap_root");
  assert.equal(collisionOptions.names.reverseName, "treap_reverse");
  const collisionContent = core.renderImplicitTreap(collisionOptions);
  assert.match(collisionContent, /struct TreapSumOp2/);
  assert.match(collisionContent, /class ImplicitTreap2/);
  assert.match(collisionContent, /struct TreapNode/);
  assert.match(collisionContent, /treap_split/);
  assert.match(collisionContent, /treap_merge/);
  assert.match(collisionContent, /treap_root_/);
  assert.match(collisionContent, /void treap_reverse/);
}

function testMergeSortTreeRenderer() {
  const defaultContent = core.renderMergeSortTree(
    mergeSortTreeOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /class MergeSortTree/);
  assert.match(defaultContent, /std::vector<std::vector<T>> tree_/);
  assert.match(defaultContent, /void build\(const std::vector<T>& values\)/);
  assert.match(defaultContent, /int count_less\(int left, int right, const T& x\) const/);
  assert.match(defaultContent, /int count_in_range\(int left, int right, const T& low,/);
  assert.doesNotMatch(defaultContent, /count_less_equal\(int left/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const usageContent = core.renderMergeSortTree(mergeSortTreeOptions());
  assert.match(usageContent, /\/\*\nInclusive \[l, r\] queries:/);
  assert.match(usageContent, /MergeSortTree<int> mst\(a\);/);

  const existsOnlyContent = core.renderMergeSortTree(
    mergeSortTreeOptions({
      queries: ["exists"],
      includeUsageComment: false
    })
  );
  assert.match(existsOnlyContent, /bool exists\(int left, int right, const T& x\) const/);
  assert.match(existsOnlyContent, /std::binary_search/);
  assert.doesNotMatch(existsOnlyContent, /count_less/);
  assert.doesNotMatch(existsOnlyContent, /count_in_range/);
  assert.doesNotMatch(existsOnlyContent, /upper_bound/);

  const collisionOptions = mergeSortTreeOptions({
    existingText:
      "class MergeSortTree {}; int tree_; int build; int count_less; int exists;",
    queries: ["count_less", "exists"],
    includeUsageComment: false
  });
  assert.equal(collisionOptions.names.className, "MergeSortTree2");
  assert.equal(collisionOptions.names.storageName, "merge_tree_");
  assert.equal(collisionOptions.names.buildName, "build_merge_sort_tree");
  assert.equal(
    collisionOptions.names.countLessName,
    "merge_sort_tree_count_less"
  );
  assert.equal(collisionOptions.names.existsName, "merge_sort_tree_exists");

  const collisionContent = core.renderMergeSortTree(collisionOptions);
  assert.match(collisionContent, /class MergeSortTree2/);
  assert.match(collisionContent, /std::vector<std::vector<T>> merge_tree_/);
  assert.match(collisionContent, /void build_merge_sort_tree/);
  assert.match(collisionContent, /int merge_sort_tree_count_less/);
  assert.match(collisionContent, /bool merge_sort_tree_exists/);
}

function testSuffixArrayRenderer() {
  const defaultContent = core.renderSuffixArray(
    suffixArrayOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /struct SuffixArrayResult/);
  assert.match(defaultContent, /std::vector<int> sa;/);
  assert.match(defaultContent, /std::vector<int> lcp;/);
  assert.match(defaultContent, /std::vector<int> rank;/);
  assert.match(defaultContent, /suffix_array_build\(const std::string& s\)/);
  assert.match(defaultContent, /suffix_array_remove_empty_suffix/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const saOnly = core.renderSuffixArray(
    suffixArrayOptions({
      features: [],
      includeUsageComment: false
    })
  );
  assert.match(saOnly, /std::vector<int> sa;/);
  assert.doesNotMatch(saOnly, /std::vector<int> lcp;/);
  assert.doesNotMatch(saOnly, /std::vector<int> rank;/);
  assert.doesNotMatch(saOnly, /result\.lcp/);
  assert.doesNotMatch(saOnly, /suffix_array_remove_empty_suffix/);

  const intVectorContent = core.renderSuffixArray(
    suffixArrayOptions({
      inputKind: "ints",
      sourceName: "values",
      includeUsageComment: false
    })
  );
  assert.match(intVectorContent, /suffix_array_build_from_ints/);
  assert.doesNotMatch(intVectorContent, /suffix_array_build\(const std::string& s\)/);

  const collisionOptions = suffixArrayOptions({
    existingText:
      "int sa; int rank; int lcp; struct SuffixArrayResult {}; int suffix_array_build;"
  });
  assert.equal(collisionOptions.names.resultStructName, "SuffixArrayResult2");
  assert.equal(collisionOptions.names.buildStringName, "suffix_array_build2");
  assert.equal(collisionOptions.names.saName, "suffix_sa");
  assert.equal(collisionOptions.names.rankName, "suffix_rank");
  assert.equal(collisionOptions.names.lcpName, "suffix_lcp");
  assert.match(core.renderSuffixArray(collisionOptions), /struct SuffixArrayResult2/);

  const rmqContent = core.renderSuffixArray(
    suffixArrayOptions({
      features: ["lcp_rmq"],
      includeUsageComment: false
    })
  );
  assert.match(rmqContent, /void build_sparse_min/);
  assert.match(rmqContent, /int suffix_array_lcp/);
  assert.match(rmqContent, /query_sparse_min\(rank_left \+ 1, rank_right\)/);
}

function testPolyHashRenderer() {
  const defaultContent = core.renderPolyHash(
    polyHashOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /constexpr int POLY_HASH_MOD1 = 1000000007;/);
  assert.match(defaultContent, /constexpr int POLY_HASH_BASE = 911382323;/);
  assert.match(defaultContent, /struct PolyHashValue/);
  assert.match(defaultContent, /class PolyHash/);
  assert.match(defaultContent, /PolyHashValue hash_substring/);
  assert.match(defaultContent, /bool equal_substrings/);
  assert.match(defaultContent, /PolyHashValue concat/);
  assert.match(defaultContent, /PolyHashValue poly_hash_string/);
  assert.doesNotMatch(defaultContent, /reverse_hash_substring/);
  assert.doesNotMatch(defaultContent, /int lcp/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const reverseContent = core.renderPolyHash(
    polyHashOptions({
      features: ["reverse", "lcp"],
      includeUsageComment: false
    })
  );
  assert.match(reverseContent, /reverse_hash_substring/);
  assert.match(reverseContent, /bool is_palindrome/);
  assert.match(reverseContent, /int lcp/);
  assert.doesNotMatch(reverseContent, /PolyHashValue concat/);

  const vectorContent = core.renderPolyHash(
    polyHashOptions({
      inputKind: "vector_int",
      sourceName: "values",
      includeUsageComment: false
    })
  );
  assert.match(vectorContent, /poly_hash_values/);
  assert.doesNotMatch(vectorContent, /poly_hash_string/);

  const collisionOptions = polyHashOptions({
    existingText:
      "int POLY_HASH_MOD1; int POLY_HASH_BASE; struct PolyHash {}; struct PolyHashValue {}; int poly_hash_string;"
  });
  assert.equal(collisionOptions.names.mod1Name, "PH_MOD1");
  assert.equal(collisionOptions.names.baseName, "PH_BASE");
  assert.equal(collisionOptions.names.valueStructName, "PolyHashValue2");
  assert.equal(collisionOptions.names.className, "PolyHash2");
  assert.equal(collisionOptions.names.hashStringName, "poly_hash_string2");
  const collisionContent = core.renderPolyHash(collisionOptions);
  assert.match(collisionContent, /constexpr int PH_MOD1/);
  assert.match(collisionContent, /constexpr int PH_BASE/);
  assert.match(collisionContent, /struct PolyHashValue2/);
  assert.match(collisionContent, /class PolyHash2/);
  assert.match(collisionContent, /PolyHashValue2 poly_hash_string2/);
}

function testFftNttRenderer() {
  const defaultContent = core.renderFftNtt(
    fftNttOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /int fft_next_power_of_two/);
  assert.match(defaultContent, /bool fft_transform/);
  assert.match(defaultContent, /vector<long long> convolution_fft_round/);
  assert.match(defaultContent, /int ntt_pow/);
  assert.match(defaultContent, /bool ntt_transform/);
  assert.match(defaultContent, /vector<int> convolution_ntt_int/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const fftOnly = core.renderFftNtt(
    fftNttOptions({
      transforms: ["fft"],
      includeConvolution: false,
      includeUsageComment: false
    })
  );
  assert.match(fftOnly, /bool fft_transform/);
  assert.doesNotMatch(fftOnly, /fft_next_power_of_two/);
  assert.doesNotMatch(fftOnly, /ntt_transform/);
  assert.doesNotMatch(fftOnly, /convolution_fft_round/);

  const nttCustom = core.renderFftNtt(
    fftNttOptions({
      transforms: ["ntt"],
      modulusExpression: "FFT_MOD",
      primitiveRootExpression: "FFT_ROOT",
      includeUsageComment: false
    })
  );
  assert.match(nttCustom, /int mod = FFT_MOD/);
  assert.match(nttCustom, /int primitive_root = FFT_ROOT/);
  assert.doesNotMatch(nttCustom, /fft_transform/);

  const collisionOptions = fftNttOptions({
    existingText:
      "int fft_transform; int ntt_transform; int ntt_pow; int fft_bit_reverse;"
  });
  assert.equal(collisionOptions.names.fftTransformName, "fft_transform2");
  assert.equal(collisionOptions.names.nttTransformName, "ntt_transform2");
  assert.equal(collisionOptions.names.nttPowName, "ntt_pow2");
  assert.equal(collisionOptions.names.bitReverseName, "fft_bit_reverse2");
  const collisionContent = core.renderFftNtt(collisionOptions);
  assert.match(collisionContent, /bool fft_transform2/);
  assert.match(collisionContent, /bool ntt_transform2/);
  assert.match(collisionContent, /int ntt_pow2/);
}

function testSegmentTreeBeatsRenderer() {
  const defaultContent = core.renderSegmentTreeBeats(
    segtreeBeatsOptions({ includeUsageComment: false })
  );
  assert.match(defaultContent, /class SegmentTreeBeats/);
  assert.match(defaultContent, /struct Node/);
  assert.match(defaultContent, /void chmin\(int left, int right, const T& x\)/);
  assert.match(defaultContent, /void chmax\(int left, int right, const T& x\)/);
  assert.match(defaultContent, /void add\(int left, int right, const T& x\)/);
  assert.match(defaultContent, /T query_sum\(int left, int right\)/);
  assert.match(defaultContent, /T query_min\(int left, int right\)/);
  assert.match(defaultContent, /T query_max\(int left, int right\)/);
  assert.doesNotMatch(defaultContent, /Example:/);

  const usageContent = core.renderSegmentTreeBeats(segtreeBeatsOptions());
  assert.match(usageContent, /\/\*\nInclusive \[l, r\] ranges:/);
  assert.match(usageContent, /SegmentTreeBeats<ll> seg\(values\);/);

  const sumOnlyContent = core.renderSegmentTreeBeats(
    segtreeBeatsOptions({
      updates: ["chmin"],
      queries: ["sum"],
      includeUsageComment: false
    })
  );
  assert.match(sumOnlyContent, /void chmin/);
  assert.match(sumOnlyContent, /T query_sum/);
  assert.doesNotMatch(sumOnlyContent, /\n  void chmax\(/);
  assert.doesNotMatch(sumOnlyContent, /\n  void add\(/);
  assert.doesNotMatch(sumOnlyContent, /T query_min\(/);
  assert.doesNotMatch(sumOnlyContent, /T query_max\(/);

  const collisionOptions = segtreeBeatsOptions({
    existingText:
      "class SegmentTreeBeats {}; struct Node {}; int add; int chmin; int query_sum;",
    includeUsageComment: false
  });
  assert.equal(collisionOptions.names.className, "SegmentTreeBeats2");
  assert.equal(collisionOptions.names.nodeName, "BeatsNode");
  assert.equal(collisionOptions.names.addName, "beats_add");
  assert.equal(collisionOptions.names.chminName, "beats_chmin");
  assert.equal(collisionOptions.names.querySumName, "beats_query_sum");

  const collisionContent = core.renderSegmentTreeBeats(collisionOptions);
  assert.match(collisionContent, /class SegmentTreeBeats2/);
  assert.match(collisionContent, /struct BeatsNode/);
  assert.match(collisionContent, /void beats_chmin/);
  assert.match(collisionContent, /void beats_add/);
  assert.match(collisionContent, /T beats_query_sum/);
}

function testGeneratedBerlekampMasseyCompiles() {
  const generated = core.renderBerlekampMassey(
    berlekampOptions({ includeUsageComment: false })
  );
  const source = [
    "#include <bits/stdc++.h>",
    "",
    "struct Mint {",
    "  static constexpr int MOD = 998244353;",
    "  int v;",
    "  Mint(long long value = 0) : v(static_cast<int>(value % MOD)) {",
    "    if (v < 0) v += MOD;",
    "  }",
    "  Mint& operator+=(const Mint& other) {",
    "    v += other.v;",
    "    if (v >= MOD) v -= MOD;",
    "    return *this;",
    "  }",
    "  Mint& operator-=(const Mint& other) {",
    "    v -= other.v;",
    "    if (v < 0) v += MOD;",
    "    return *this;",
    "  }",
    "  Mint& operator*=(const Mint& other) {",
    "    v = static_cast<int>(1LL * v * other.v % MOD);",
    "    return *this;",
    "  }",
    "  static Mint pow(Mint base, long long exp) {",
    "    Mint result(1);",
    "    while (exp > 0) {",
    "      if (exp & 1LL) result *= base;",
    "      base *= base;",
    "      exp >>= 1LL;",
    "    }",
    "    return result;",
    "  }",
    "  Mint inv() const { return pow(*this, MOD - 2); }",
    "  Mint& operator/=(const Mint& other) { return *this *= other.inv(); }",
    "  friend Mint operator+(Mint a, const Mint& b) { return a += b; }",
    "  friend Mint operator-(Mint a, const Mint& b) { return a -= b; }",
    "  friend Mint operator*(Mint a, const Mint& b) { return a *= b; }",
    "  friend Mint operator/(Mint a, const Mint& b) { return a /= b; }",
    "  friend bool operator==(const Mint& a, const Mint& b) { return a.v == b.v; }",
    "};",
    "",
    generated,
    "int main() {",
    "  const std::vector<Mint> sequence = {0, 1, 1, 2, 3, 5, 8, 13, 21, 34};",
    "  const auto coefficients = berlekamp_massey(sequence);",
    "  assert(coefficients.size() == 2);",
    "  assert(coefficients[0] == Mint(1));",
    "  assert(coefficients[1] == Mint(1));",
    "  const std::vector<Mint> initial = {0, 1};",
    "  assert(linear_recurrence_kth(initial, coefficients, 30) == Mint(832040));",
    "  assert(berlekamp_massey_kth(sequence, 30) == Mint(832040));",
    "  return 0;",
    "}"
  ].join("\n");
  compileSource("berlekamp_massey_generated", source);
}

function testGeneratedSparseTableCompiles() {
  const generated = core.renderSparseTable(
    sparseOptions({ includeUsageComment: false })
  );
  const source = [
    "#include <bits/stdc++.h>",
    "using namespace std;",
    "",
    generated,
    "int main() {",
    "  vector<int> a = {5, 2, 7, 3, 9, 1, 4};",
    "  build_sparse_min(a);",
    "  build_sparse_max(a);",
    "  assert(query_sparse_min(0, 6) == 1);",
    "  assert(query_sparse_min(1, 3) == 2);",
    "  assert(query_sparse_max(0, 6) == 9);",
    "  assert(query_sparse_max(1, 3) == 7);",
    "  assert(query_sparse_min(-5, 100) == 1);",
    "  assert(query_sparse_max(5, 2) == 0);",
    "  return 0;",
    "}"
  ].join("\n");
  compileSource("sparse_table_generated", source);
}

function testGeneratedDsuCompiles() {
  const generated = core.renderDsu(dsuOptions({ includeUsageComment: false }));
  const source = [
    "#include <bits/stdc++.h>",
    "",
    generated,
    "int main() {",
    "  Dsu dsu(5);",
    "  assert(dsu.size() == 5);",
    "  assert(dsu.components() == 5);",
    "  assert(dsu.unite(0, 1));",
    "  assert(dsu.unite(3, 4));",
    "  assert(!dsu.unite(0, 1));",
    "  assert(dsu.same(1, 0));",
    "  assert(!dsu.same(1, 4));",
    "  assert(dsu.component_size(0) == 2);",
    "  assert(dsu.find(-1) == -1);",
    "  assert(dsu.component_size(99) == 0);",
    "  return 0;",
    "}"
  ].join("\n");
  compileSource("dsu_generated", source);
}

function testGeneratedRollbackDsuCompiles() {
  const generated = core.renderRollbackDsu(
    rollbackDsuOptions({ includeUsageComment: false })
  );
  const source = [
    "#include <bits/stdc++.h>",
    "",
    generated,
    "int main() {",
    "  RollbackDsu dsu(5);",
    "  assert(dsu.size() == 5);",
    "  assert(dsu.components() == 5);",
    "  int snap0 = dsu.snapshot();",
    "  assert(dsu.unite(0, 1));",
    "  assert(dsu.unite(1, 2));",
    "  assert(!dsu.unite(0, 2));",
    "  assert(dsu.same(0, 2));",
    "  assert(dsu.component_size(1) == 3);",
    "  assert(dsu.components() == 3);",
    "  dsu.rollback();",
    "  assert(dsu.same(0, 2));",
    "  dsu.rollback(snap0);",
    "  assert(!dsu.same(0, 1));",
    "  assert(dsu.components() == 5);",
    "  assert(!dsu.unite(-1, 3));",
    "  int snap1 = dsu.snapshot();",
    "  assert(dsu.unite(3, 4));",
    "  dsu.rollback(snap1);",
    "  assert(!dsu.same(3, 4));",
    "  assert(dsu.component_size(99) == 0);",
    "  return 0;",
    "}"
  ].join("\n");
  compileSource("rollback_dsu_generated", source);
}

function testGeneratedLcaCompiles() {
  const generated = core.renderLca(lcaOptions({ includeUsageComment: false }));
  const source = [
    "#include <bits/stdc++.h>",
    "",
    generated,
    "int main() {",
    "  LcaBinaryLifting lca(9);",
    "  lca.add_edge(0, 1);",
    "  lca.add_edge(0, 2);",
    "  lca.add_edge(1, 3);",
    "  lca.add_edge(1, 4);",
    "  lca.add_edge(2, 5);",
    "  lca.add_edge(2, 6);",
    "  lca.add_edge(6, 7);",
    "  lca.add_edge(7, 8);",
    "  lca.build(0);",
    "  assert(lca.lca(3, 4) == 1);",
    "  assert(lca.lca(3, 6) == 0);",
    "  assert(lca.lca(8, 5) == 2);",
    "  assert(lca.dist(3, 8) == 6);",
    "  assert(lca.kth_ancestor(8, 3) == 2);",
    "  assert(lca.kth_ancestor(8, 20) == -1);",
    "  LcaBinaryLifting single(1);",
    "  single.build(0);",
    "  assert(single.kth_ancestor(0, 2) == -1);",
    "  LcaBinaryLifting forest(4);",
    "  forest.add_edge(0, 1);",
    "  forest.add_edge(2, 3);",
    "  forest.build(0);",
    "  assert(forest.lca(1, 3) == -1);",
    "  assert(forest.dist(1, 3) == -1);",
    "  return 0;",
    "}"
  ].join("\n");
  compileSource("lca_generated", source);
}

function testGeneratedBfsCompiles() {
  const generated = core.renderBfs(bfsOptions({ includeUsageComment: false }));
  const source = [
    "#include <bits/stdc++.h>",
    "",
    generated,
    "int main() {",
    "  std::vector<std::vector<int>> graph(6);",
    "  bfs_add_edge(graph, 0, 1, true);",
    "  bfs_add_edge(graph, 1, 2, true);",
    "  bfs_add_edge(graph, 2, 3, true);",
    "  bfs_add_edge(graph, 4, 5, true);",
    "  const BfsResult single = bfs(graph, 0);",
    "  assert((single.distance == std::vector<int>{0, 1, 2, 3, -1, -1}));",
    "  assert((bfs_restore_path(0, 3, single) == std::vector<int>{0, 1, 2, 3}));",
    "  assert(bfs_restore_path(0, 5, single).empty());",
    "  const BfsResult multi = bfs_multi_source(graph, {0, 5});",
    "  assert((multi.distance == std::vector<int>{0, 1, 2, 3, 1, 0}));",
    "  assert((bfs_restore_path_to_root(4, multi) == std::vector<int>{5, 4}));",
    "  bfs_add_edge(graph, -1, 0, true);",
    "  return 0;",
    "}"
  ].join("\n");
  compileSource("bfs_generated", source);
}

function testGeneratedLinearSieveCompiles() {
  const generated = core.renderLinearSieve(
    linearSieveOptions({ includeUsageComment: false })
  );
  const source = [
    "#include <bits/stdc++.h>",
    "using namespace std;",
    "",
    generated,
    "int main() {",
    "  LinearSieve sieve(50);",
    "  assert((sieve.primes() == vector<int>{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47}));",
    "  assert(sieve.lowest_prime_of(49) == 7);",
    "  assert(sieve.is_prime(47));",
    "  assert(!sieve.is_prime(48));",
    "  assert((sieve.factorize(48) == vector<pair<int, int>>{{2, 4}, {3, 1}}));",
    "  assert(linear_sieve_lowest_prime(12)[12] == 2);",
    "  assert((linear_sieve_primes(10) == vector<int>{2, 3, 5, 7}));",
    "  return 0;",
    "}"
  ].join("\n");
  compileSource("linear_sieve_generated", source);
}

function testGeneratedFenwickCompiles() {
  const generated = core.renderFenwick(
    fenwickOptions({ includeUsageComment: false })
  );
  const source = [
    "#include <bits/stdc++.h>",
    "using namespace std;",
    "",
    generated,
    "int main() {",
    "  FenwickSumTree<int> sum(8);",
    "  const int values[8] = {3, 1, 4, 1, 5, 9, 2, 6};",
    "  for (int i = 0; i < 8; ++i) sum.add(i, values[i]);",
    "  assert(sum.prefix(3) == 9);",
    "  assert(sum.segment(2, 5) == 19);",
    "  assert(sum.descend(15) == 5);",
    "",
    "  FenwickXorTree<int> xr(5);",
    "  const int xvalues[5] = {5, 1, 7, 3, 2};",
    "  for (int i = 0; i < 5; ++i) xr.add(i, xvalues[i]);",
    "  assert(xr.segment(1, 3) == (1 ^ 7 ^ 3));",
    "",
    "  FenwickMaxTree<int> mx(7, -1000000007);",
    "  const int mvalues[7] = {1, 5, 2, 7, 3, 6, 4};",
    "  for (int i = 0; i < 7; ++i) mx.add(i, mvalues[i]);",
    "  assert(mx.prefix(6) == 7);",
    "  assert(mx.descend(5) == 3);",
    "",
    "  FenwickMinTree<int> mn(5, 1000000007);",
    "  const int nvalues[5] = {7, 3, 5, 2, 8};",
    "  for (int i = 0; i < 5; ++i) mn.add(i, nvalues[i]);",
    "  assert(mn.prefix(3) == 2);",
    "  return 0;",
    "}"
  ].join("\n");
  compileSource("fenwick_generated", source);
}

function testGeneratedModIntCompiles() {
  const generated = core.renderModInt(
    modIntOptions({ includeUsageComment: false })
  );
  const source = [
    "#include <bits/stdc++.h>",
    "using namespace std;",
    "",
    generated,
    "int main() {",
    "  using Mint = StaticModInt<1000000007>;",
    "  assert((Mint(2) + Mint(1000000006)).value() == 1);",
    "  assert((Mint(5) * Mint(5).inv()).value() == 1);",
    "  assert(Mint(2).pow(10).value() == 1024);",
    "",
    "  DynamicModInt::set_mod(1000);",
    "  assert(DynamicModInt::mod() == 1000);",
    "  assert((DynamicModInt(3) * DynamicModInt(667)).value() == 1);",
    "  DynamicModInt inv;",
    "  assert(DynamicModInt(3).try_inv(inv));",
    "  assert((DynamicModInt(3) * inv).value() == 1);",
    "  assert(!DynamicModInt(10).has_inverse());",
    "  return 0;",
    "}"
  ].join("\n");
  compileSource("modint_generated", source);
}

function testGeneratedTwoSatCompiles() {
  {
    const generated = core.renderTwoSat(
      twosatOptions({ includeUsageComment: false })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "",
      generated,
      "int main() {",
      "  TwoSat sat(3);",
      "  sat.add_or(0, true, 1, true);",
      "  sat.add_or(0, false, 1, true);",
      "  sat.add_implication(1, true, 2, true);",
      "  sat.add_or(2, true, 2, true);",
      "  assert(sat.solve());",
      "  const std::vector<bool> assign = sat.assignment();",
      "  assert(assign[1]);",
      "  assert(assign[2]);",
      "  TwoSat impossible(1);",
      "  impossible.add_or(0, true, 0, true);",
      "  impossible.add_or(0, false, 0, false);",
      "  assert(!impossible.solve());",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("twosat_generated", source);
  }

  {
    const generated = core.renderTwoSat(
      twosatOptions({
        features: ["xor", "equal", "force", "at_most_one", "components"],
        includeUsageComment: false
      })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "",
      generated,
      "int main() {",
      "  TwoSat sat(4);",
      "  sat.add_xor(0, true, 1, true);",
      "  sat.add_equal(1, true, 2, false);",
      "  sat.add_true(3);",
      "  sat.add_at_most_one(std::vector<int>{0, 2});",
      "  assert(sat.solve());",
      "  assert(sat.value(3));",
      "  assert(sat.component(0, true) >= 0);",
      "  TwoSat impossible(1);",
      "  impossible.add_true(0);",
      "  impossible.add_false(0);",
      "  assert(!impossible.solve());",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("twosat_full_generated", source);
  }

  {
    const analysis = core.analyzeCppDocument(
      "class TwoSat {}; int add_or; int solve; int assignment;"
    );
    const options = core.defaultTwoSatOptions(analysis);
    assert.equal(options.names.className, "TwoSat2");
    assert.equal(options.names.addOrName, "twosat_add_or");
    assert.equal(options.names.solveName, "twosat_solve");
    assert.equal(options.names.assignmentName, "twosat_assignment");
    const generated = core.renderTwoSat({
      ...options,
      includeUsageComment: false
    });
    const source = [
      "#include <bits/stdc++.h>",
      "",
      generated,
      "int main() {",
      "  TwoSat2 sat(1);",
      "  sat.twosat_add_or(0, true, 0, true);",
      "  assert(sat.twosat_solve());",
      "  assert(sat.twosat_assignment()[0]);",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("twosat_collision_generated", source);
  }
}

function testGeneratedMaxflowDinicCompiles() {
  {
    const generated = core.renderMaxflowDinic(
      maxflowDinicOptions({ includeUsageComment: false })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "",
      generated,
      "int main() {",
      "  Dinic<long long> flow(6);",
      "  flow.add_edge(0, 1, 16);",
      "  flow.add_edge(0, 2, 13);",
      "  flow.add_edge(1, 2, 10);",
      "  flow.add_edge(2, 1, 4);",
      "  flow.add_edge(1, 3, 12);",
      "  flow.add_edge(3, 2, 9);",
      "  flow.add_edge(2, 4, 14);",
      "  flow.add_edge(4, 3, 7);",
      "  flow.add_edge(3, 5, 20);",
      "  flow.add_edge(4, 5, 4);",
      "  assert(flow.max_flow(0, 5) == 23);",
      "  assert(flow.left_of_min_cut(0));",
      "  assert(!flow.left_of_min_cut(5));",
      "  long long used = 0;",
      "  for (const auto& edge : flow.graph()[0]) {",
      "    if (edge.original_cap > 0) used += edge.flow();",
      "  }",
      "  assert(used == 23);",
      "  flow.reset_flows();",
      "  used = 0;",
      "  for (const auto& edge : flow.graph()[0]) {",
      "    if (edge.original_cap > 0) used += edge.flow();",
      "  }",
      "  assert(used == 0);",
      "  assert(flow.max_flow(0, 5) == 23);",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("maxflow_dinic_generated", source);
  }

  {
    const recipe = core.renderMaxflowDinicRecipe(
      maxflowDinicOptions({
        generateInput: true,
        includeUsageComment: false
      })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "",
      core.composeRecipeSections(recipe),
      "int main() {",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("maxflow_dinic_generated_solve", source);
  }
}

function testGeneratedMinCostMaxFlowCompiles() {
  {
    const generated = core.renderMinCostMaxFlow(
      minCostMaxFlowOptions({ includeUsageComment: false })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "",
      generated,
      "int main() {",
      "  MinCostMaxFlow<long long, long long> flow(4);",
      "  flow.add_edge(0, 1, 2, 1);",
      "  flow.add_edge(0, 2, 1, 5);",
      "  flow.add_edge(1, 2, 1, 2);",
      "  flow.add_edge(1, 3, 1, 3);",
      "  flow.add_edge(2, 3, 2, 1);",
      "  auto result = flow.min_cost_max_flow(0, 3);",
      "  assert(result.first == 3);",
      "  assert(result.second == 14);",
      "  long long used = 0;",
      "  for (const auto& edge : flow.graph()[0]) {",
      "    if (edge.original_cap > 0) used += edge.flow();",
      "  }",
      "  assert(used == 3);",
      "  assert(flow.potential().size() == 4);",
      "",
      "  MinCostMaxFlow<long long, long long> negative(3);",
      "  negative.add_edge(0, 1, 2, -3);",
      "  negative.add_edge(1, 2, 2, 2);",
      "  auto neg = negative.min_cost_flow(0, 2, 2);",
      "  assert(neg.first == 2);",
      "  assert(neg.second == -2);",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("mincost_maxflow_generated", source);
  }

  {
    const recipe = core.renderMinCostMaxFlowRecipe(
      minCostMaxFlowOptions({
        generateInput: true,
        mode: "fixed_flow",
        includeUsageComment: false
      })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "",
      core.composeRecipeSections(recipe),
      "int main() {",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("mincost_maxflow_generated_solve", source);
  }
}

function testGeneratedHungarianCompiles() {
  {
    const generated = core.renderHungarian(
      hungarianOptions({ includeUsageComment: false })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "",
      generated,
      "int main() {",
      "  const std::vector<std::vector<long long>> cost = {",
      "      {4, 1, 3},",
      "      {2, 0, 5},",
      "      {3, 2, 2},",
      "  };",
      "  auto result = hungarian(cost);",
      "  assert(result.min_cost == 5);",
      "  assert(result.match_left.size() == 3);",
      "  assert(result.match_right.size() == 3);",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("hungarian_generated", source);
  }

  {
    const generated = core.renderHungarian(
      hungarianOptions({
        mode: "maximize",
        includeUsageComment: false
      })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "",
      generated,
      "int main() {",
      "  const std::vector<std::vector<long long>> value = {",
      "      {3, 1, 7},",
      "      {2, 8, 4},",
      "      {6, 5, 9},",
      "  };",
      "  auto result = hungarian_maximize(value);",
      "  assert(result.min_cost == 21);",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("hungarian_maximize_generated", source);
  }

  {
    const analysis = core.analyzeCppDocument(
      "int cost; int assignment; int n; int m; int solve;"
    );
    const options = core.defaultHungarianOptions(analysis);
    assert.equal(options.sourceName, "cost_matrix");
    assert.equal(options.resultName, "hungarian_result");
    assert.equal(options.rowCountName, "rows");
    assert.equal(options.colCountName, "cols");
    assert.equal(options.names.solveName, "solve_hungarian");

    const recipe = core.renderHungarianRecipe({
      ...options,
      generateInput: true,
      includeUsageComment: false
    });
    const source = [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "",
      core.composeRecipeSections(recipe),
      "int main() {",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("hungarian_generated_solve", source);
  }
}

function testGeneratedKuhnCompiles() {
  {
    const generated = core.renderKuhn(
      kuhnOptions({
        features: [],
        includeUsageComment: false
      })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "",
      generated,
      "int main() {",
      "  KuhnMatcher matcher(3, 3);",
      "  matcher.add_edge(0, 0);",
      "  matcher.add_edge(0, 1);",
      "  matcher.add_edge(1, 1);",
      "  matcher.add_edge(2, 1);",
      "  matcher.add_edge(2, 2);",
      "  auto result = matcher.maximum_matching();",
      "  assert(result.matching_size == 3);",
      "  std::vector<std::vector<int>> graph = {{0, 1}, {1}, {1, 2}};",
      "  auto same = kuhn_maximum_matching(graph, 3);",
      "  assert(same.matching_size == 3);",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("kuhn_generated", source);
  }

  {
    const generated = core.renderKuhn(
      kuhnOptions({ includeUsageComment: false })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "",
      generated,
      "int main() {",
      "  const std::vector<std::vector<int>> graph = {{0, 1}, {1}, {1, 2}};",
      "  auto matching = kuhn_maximum_matching(graph, 3);",
      "  auto cover = minimum_vertex_cover_bipartite(graph, 3, matching);",
      "  assert(matching.matching_size == 3);",
      "  assert(cover.size() == matching.matching_size);",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("kuhn_vertex_cover_generated", source);
  }

  {
    const analysis = core.analyzeCppDocument(
      "int graph; int n; int m; int e; int u; int v; int matcher; int matching; int vertex_cover; int solve;"
    );
    const options = core.defaultKuhnOptions(analysis);
    assert.equal(options.sourceName, "adj");
    assert.equal(options.leftCountName, "left_n");
    assert.equal(options.rightCountName, "right_n");
    assert.equal(options.edgeCountName, "edge_count");
    assert.equal(options.leftVertexName, "left");
    assert.equal(options.rightVertexName, "right");
    assert.equal(options.instanceName, "kuhn_matcher");
    assert.equal(options.resultName, "kuhn_matching");
    assert.equal(options.coverName, "kuhn_vertex_cover");
    assert.equal(options.names.solveName, "solve_kuhn");

    const recipe = core.renderKuhnRecipe({
      ...options,
      generateInput: true,
      includeUsageComment: false
    });
    const source = [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "",
      core.composeRecipeSections(recipe),
      "int main() {",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("kuhn_generated_solve", source);
  }
}

function testGeneratedImplicitTreapCompiles() {
  {
    const generated = core.renderImplicitTreap(
      implicitTreapOptions({ includeUsageComment: false })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "",
      generated,
      "int main() {",
      "  ImplicitTreap<long long> treap(123);",
      "  treap.push_back(10);",
      "  treap.push_back(20);",
      "  treap.push_back(30);",
      "  treap.insert(1, 5);",
      "  assert(treap.to_vector() == std::vector<long long>({10, 5, 20, 30}));",
      "  assert(treap.range_query(0, 3) == 65);",
      "  treap.reverse(1, 3);",
      "  assert(treap.to_vector() == std::vector<long long>({10, 30, 20, 5}));",
      "  long long value = 0;",
      "  assert(treap.get(2, value) && value == 20);",
      "  assert(treap.set(2, 7));",
      "  assert(treap.range_query(1, 3) == 42);",
      "  long long erased = 0;",
      "  assert(treap.erase(1, &erased) && erased == 30);",
      "  assert(treap.to_vector() == std::vector<long long>({10, 7, 5}));",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("implicit_treap_generated", source);
  }

  {
    const generated = core.renderImplicitTreap(
      implicitTreapOptions({
        features: ["reverse", "range_add"],
        includeUsageComment: false
      })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "",
      generated,
      "int main() {",
      "  std::vector<long long> values = {1, 2, 3, 4, 5};",
      "  ImplicitTreap<long long> treap(456);",
      "  treap.assign(values.begin(), values.end());",
      "  treap.add(1, 3, 10);",
      "  assert(treap.to_vector() == std::vector<long long>({1, 12, 13, 14, 5}));",
      "  assert(treap.range_query(0, 4) == 45);",
      "  treap.reverse(0, 2);",
      "  assert(treap.to_vector() == std::vector<long long>({13, 12, 1, 14, 5}));",
      "  treap.add(0, 4, -1);",
      "  assert(treap.to_vector() == std::vector<long long>({12, 11, 0, 13, 4}));",
      "  assert(treap.range_query(1, 3) == 24);",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("implicit_treap_add_generated", source);
  }
}

function testGeneratedMergeSortTreeCompiles() {
  {
    const generated = core.renderMergeSortTree(
      mergeSortTreeOptions({ includeUsageComment: false })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "",
      generated,
      "int main() {",
      "  vector<int> a = {5, 1, 7, 3, 5, 2};",
      "  MergeSortTree<int> mst(a);",
      "  assert(mst.size() == 6);",
      "  assert(mst.count_less(1, 4, 5) == 2);",
      "  assert(mst.count_in_range(0, 5, 2, 5) == 4);",
      "  assert(mst.count_in_range(-10, 99, 1, 3) == 3);",
      "  assert(mst.count_less(7, 2, 4) == 0);",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("merge_sort_tree_generated", source);
  }

  {
    const generated = core.renderMergeSortTree(
      mergeSortTreeOptions({
        queries: ["exists"],
        includeUsageComment: false
      })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "",
      generated,
      "int main() {",
      "  vector<int> a = {5, 1, 7, 3, 5, 2};",
      "  MergeSortTree<int> mst(a);",
      "  assert(mst.exists(2, 5, 3));",
      "  assert(mst.exists(-10, 99, 1));",
      "  assert(!mst.exists(2, 5, 1));",
      "  assert(!mst.exists(8, 2, 5));",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("merge_sort_tree_exists_generated", source);
  }
}

function testGeneratedSuffixArrayCompiles() {
  {
    const generated = core.renderSuffixArray(
      suffixArrayOptions({ includeUsageComment: false })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "",
      generated,
      "int main() {",
      "  string s = \"banana\";",
      "  auto result = suffix_array_build(s);",
      "  assert(result.sa == vector<int>({6, 5, 3, 1, 0, 4, 2}));",
      "  assert(result.lcp == vector<int>({0, 0, 1, 3, 0, 0, 2}));",
      "  for (int i = 0; i < static_cast<int>(result.sa.size()); ++i) {",
      "    assert(result.rank[result.sa[i]] == i);",
      "  }",
      "  assert(suffix_array_remove_empty_suffix(result) == vector<int>({5, 3, 1, 0, 4, 2}));",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("suffix_array_string_generated", source);
  }

  {
    const generated = core.renderSuffixArray(
      suffixArrayOptions({
        inputKind: "ints",
        sourceName: "values",
        features: ["lcp"],
        includeUsageComment: false
      })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "",
      generated,
      "int main() {",
      "  vector<int> values = {3, -1, 3, 2};",
      "  auto result = suffix_array_build_from_ints(values);",
      "  assert(result.sa == vector<int>({4, 1, 3, 0, 2}));",
      "  assert(result.lcp == vector<int>({0, 0, 0, 0, 1}));",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("suffix_array_ints_generated", source);
  }

  {
    const generated = core.renderSuffixArray(
      suffixArrayOptions({
        features: ["lcp_rmq"],
        includeUsageComment: false
      })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "",
      generated,
      "int main() {",
      "  string s = \"banana\";",
      "  auto result = suffix_array_build(s);",
      "  build_sparse_min(result.lcp);",
      "  assert(suffix_array_lcp(1, 3, result) == 3);",
      "  assert(suffix_array_lcp(0, 2, result) == 0);",
      "  assert(suffix_array_lcp(4, 4, result) == 2);",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("suffix_array_rmq_generated", source);
  }
}

function testGeneratedPolyHashCompiles() {
  {
    const generated = core.renderPolyHash(
      polyHashOptions({ includeUsageComment: false })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "",
      generated,
      "int main() {",
      "  const string text = \"abracadabra\";",
      "  PolyHash hash(text);",
      "  assert(hash.size() == static_cast<int>(text.size()));",
      "  assert(hash.hash_substring(0, 4) == poly_hash_string(\"abra\"));",
      "  assert(hash.equal_substrings(0, 4, 7, 11));",
      "  assert(!hash.equal_substrings(0, 4, 3, 7));",
      "  const PolyHashValue left = hash.hash_substring(0, 4);",
      "  const PolyHashValue right = hash.hash_substring(4, 7);",
      "  assert(hash.concat(left, right, 3) == hash.hash_substring(0, 7));",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("poly_hash_generated", source);
  }

  {
    const generated = core.renderPolyHash(
      polyHashOptions({
        inputKind: "vector_int",
        sourceName: "values",
        features: ["reverse", "lcp"],
        includeUsageComment: false
      })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "",
      generated,
      "int main() {",
      "  const string text = \"abacaba\";",
      "  PolyHash hash(text);",
      "  assert(hash.is_palindrome(0, 7));",
      "  assert(hash.is_palindrome(2, 5));",
      "  assert(!hash.is_palindrome(1, 5));",
      "  assert(hash.lcp(0, 4) == 3);",
      "  const vector<int> values = {4, 8, 4, 8};",
      "  PolyHash value_hash(values);",
      "  assert(value_hash.hash_substring(0, 2) == value_hash.hash_substring(2, 4));",
      "  assert(poly_hash_values(values) == value_hash.hash_prefix(4));",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("poly_hash_reverse_generated", source);
  }
}

function testGeneratedFftNttCompiles() {
  {
    const generated = core.renderFftNtt(
      fftNttOptions({
        transforms: ["fft"],
        includeUsageComment: false
      })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "",
      generated,
      "int main() {",
      "  const vector<long long> a = {1, 2, 3};",
      "  const vector<long long> b = {4, 5};",
      "  const vector<long long> expected = {4, 13, 22, 15};",
      "  assert(convolution_fft_round(a, b) == expected);",
      "  vector<complex<long double>> bad(3);",
      "  assert(!fft_transform(bad, false));",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("fft_generated", source);
  }

  {
    const generated = core.renderFftNtt(
      fftNttOptions({
        transforms: ["ntt"],
        includeUsageComment: false
      })
    );
    const source = [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "",
      generated,
      "int main() {",
      "  const vector<int> a = {1, 2, 3, 4};",
      "  const vector<int> b = {5, 6, 7};",
      "  const vector<int> expected = {5, 16, 34, 52, 45, 28};",
      "  assert(convolution_ntt_int(a, b) == expected);",
      "  vector<int> values = {1, 2, 3, 4};",
      "  const vector<int> original = values;",
      "  assert(ntt_transform(values, false));",
      "  assert(ntt_transform(values, true));",
      "  assert(values == original);",
      "  return 0;",
      "}"
    ].join("\n");
    compileSource("ntt_generated", source);
  }
}

testTokenScanner();
testCollisionNames();
testSharedNamePlanner();
testDetectedSymbols();
testSectionDetection();
testSmartSnippetExportsAndRenames();
testDependencyOrder();
testSectionComposer();
testRecipeMetadata();
testBundledCatalogGuardrails();
testCompletedMigrationGuardrails();
testFinalLibraryShapeGuardrails();
testManifestCommands();
testNamespaceUnwrap();
testGlobalInsertionOffset();
testGeneratedSegmentTrees();
testGeneratedSegmentTreeBeatsCompiles();
testInteractiveBrickRenderers();
testBerlekampMasseyRenderer();
testSparseTableRenderer();
testDsuRenderer();
testRollbackDsuRenderer();
testLcaRenderer();
testBfsRenderer();
testLinearSieveRenderer();
testFenwickRenderer();
testModIntRenderer();
testTwoSatRenderer();
testMaxflowDinicRenderer();
testMinCostMaxFlowRenderer();
testHungarianRenderer();
testKuhnRenderer();
testImplicitTreapRenderer();
testMergeSortTreeRenderer();
testSuffixArrayRenderer();
testPolyHashRenderer();
testFftNttRenderer();
testSegmentTreeBeatsRenderer();
testGeneratedBerlekampMasseyCompiles();
testGeneratedSparseTableCompiles();
testGeneratedDsuCompiles();
testGeneratedRollbackDsuCompiles();
testGeneratedLcaCompiles();
testGeneratedBfsCompiles();
testGeneratedLinearSieveCompiles();
testGeneratedFenwickCompiles();
testGeneratedModIntCompiles();
testGeneratedTwoSatCompiles();
testGeneratedMaxflowDinicCompiles();
testGeneratedMinCostMaxFlowCompiles();
testGeneratedHungarianCompiles();
testGeneratedKuhnCompiles();
testGeneratedImplicitTreapCompiles();
testGeneratedMergeSortTreeCompiles();
testGeneratedSuffixArrayCompiles();
testGeneratedPolyHashCompiles();
testGeneratedFftNttCompiles();

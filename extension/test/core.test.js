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
  const analysis = core.analyzeCppDocument("int t; void build() {} int get; int segtree;");
  const names = core.planSegmentTreeNames(analysis);
  assert.equal(names.storageName, "segtree2");
  assert.equal(names.buildName, "build_segtree");
  assert.equal(names.queryName, "seg_get");
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
}

function testBerlekampMasseyMigrationGuardrails() {
  const repoRoot = path.join(__dirname, "..", "..");
  assert.equal(
    fs.existsSync(path.join(repoRoot, "lib", "berlekamp_massey.hpp")),
    false
  );

  const solverTest = fs.readFileSync(
    path.join(repoRoot, "tests", "berlekamp_massey_test.cpp"),
    "utf8"
  );
  assert.match(
    solverTest,
    /#include "\.\.\/lib\/solvers\/berlekamp_massey\.hpp"/
  );
  assert.doesNotMatch(solverTest, /#include "\.\.\/lib\/berlekamp_massey\.hpp"/);
}

function testSparseTableMigrationGuardrails() {
  const repoRoot = path.join(__dirname, "..", "..");
  assert.equal(fs.existsSync(path.join(repoRoot, "lib", "sparse_table.hpp")), false);
  assert.equal(
    fs.existsSync(path.join(repoRoot, "lib", "solvers", "sparse_table.hpp")),
    true
  );
  assert.equal(
    fs.existsSync(path.join(repoRoot, "lib", "solvers", "static_rmq.hpp")),
    false
  );

  const sparseTest = fs.readFileSync(
    path.join(repoRoot, "tests", "sparse_table_test.cpp"),
    "utf8"
  );
  assert.match(sparseTest, /#include "\.\.\/lib\/solvers\/sparse_table\.hpp"/);
  assert.doesNotMatch(sparseTest, /#include "\.\.\/lib\/sparse_table\.hpp"/);

  const legacyLca = fs.readFileSync(path.join(repoRoot, "lib", "lca.hpp"), "utf8");
  assert.match(legacyLca, /#include "solvers\/sparse_table\.hpp"/);
  assert.doesNotMatch(legacyLca, /#include "sparse_table\.hpp"/);
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
testBerlekampMasseyMigrationGuardrails();
testSparseTableMigrationGuardrails();
testManifestCommands();
testNamespaceUnwrap();
testGlobalInsertionOffset();
testGeneratedSegmentTrees();
testInteractiveBrickRenderers();
testBerlekampMasseyRenderer();
testSparseTableRenderer();
testGeneratedBerlekampMasseyCompiles();
testGeneratedSparseTableCompiles();

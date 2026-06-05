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
    name: "lca",
    catalogPath: "/solvers/lca",
    legacyHeader: "lca.hpp",
    replacementHeader: path.join("solvers", "lca_binary_lifting.hpp"),
    tests: ["lca_test.cpp", "solvers_structures_test.cpp"]
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

function lcaOptions(overrides = {}) {
  const analysis = core.analyzeCppDocument(overrides.existingText ?? "");
  return {
    names: core.planLcaNames(analysis),
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

  const dsuRecipe = core.renderDsuRecipe(dsuOptions({ includeUsageComment: false }));
  assert.deepEqual(dsuRecipe.exports, ["Dsu"]);
  assert.deepEqual(Object.keys(dsuRecipe.sections), ["helpers"]);

  const lcaRecipe = core.renderLcaRecipe(lcaOptions({ includeUsageComment: false }));
  assert.deepEqual(lcaRecipe.exports, ["LcaBinaryLifting"]);
  assert.deepEqual(Object.keys(lcaRecipe.sections), ["helpers"]);
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

  const lcaEntry = entries.find((entry) => entry.path === "/solvers/lca");
  assert.ok(lcaEntry);
  assert.equal(lcaEntry.kind, "solver");
  assert.equal(lcaEntry.generator, "lca");
  assert.equal(lcaEntry.source, "solvers/lca_binary_lifting.hpp");
  assert.deepEqual(lcaEntry.exports, ["LcaBinaryLifting"]);
  assert.deepEqual(lcaEntry.features, ["binary_lifting"]);
  assert.deepEqual(lcaEntry.sections, ["helpers"]);
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
testManifestCommands();
testNamespaceUnwrap();
testGlobalInsertionOffset();
testGeneratedSegmentTrees();
testInteractiveBrickRenderers();
testBerlekampMasseyRenderer();
testSparseTableRenderer();
testDsuRenderer();
testLcaRenderer();
testGeneratedBerlekampMasseyCompiles();
testGeneratedSparseTableCompiles();
testGeneratedDsuCompiles();
testGeneratedLcaCompiles();

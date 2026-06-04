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

testTokenScanner();
testCollisionNames();
testDetectedSymbols();
testSmartSnippetExportsAndRenames();
testDependencyOrder();
testNamespaceUnwrap();
testGlobalInsertionOffset();
testGeneratedSegmentTrees();
testInteractiveBrickRenderers();

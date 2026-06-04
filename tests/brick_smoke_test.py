#!/usr/bin/env python3
from __future__ import annotations

import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BRICKS = ROOT / "lib" / "bricks"
TMP = Path("/tmp/edulcni_brick_smoke")

BASE = r'''
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
#define all(v) v.begin(), v.end()
#define forn(x, n) for (int x = 0; x < int(n); x++)
#define pii pair<int, int>
#define F first
#define S second
#define vi vector<int>
const int MOD = 1000000007;
'''


BODY_CASES = {
    "read_array": (
        'int n = 3; istringstream input("1 2 3"); cin.rdbuf(input.rdbuf());',
        "assert(a == vi({1, 2, 3}));",
    ),
    "read_vector_ref": (
        'vi a(3); istringstream input("1 2 3"); cin.rdbuf(input.rdbuf());',
        "assert(a == vi({1, 2, 3}));",
    ),
    "read_graph_undirected": (
        'int n = 3, m = 2; istringstream input("1 2 2 3"); cin.rdbuf(input.rdbuf());',
        "assert(g[0][0] == 1 && g[1].size() == 2 && g[2][0] == 1);",
    ),
    "read_tree_edges": (
        'int n = 3; istringstream input("1 2 1 3"); cin.rdbuf(input.rdbuf());',
        "assert(g[0].size() == 2 && g[1][0] == 0 && g[2][0] == 0);",
    ),
    "decrement_indices": (
        "int a = 1, b = 2;",
        "assert(a == 0 && b == 1);",
    ),
    "compress_unique": (
        "vi vals = {3, 1, 3};",
        "assert(vals == vi({1, 3}) && get_id(3) == 1);",
    ),
    "lower_bound_l_false_r_true": (
        "int l = -1, r = 10; auto can = [&](int x) { return x >= 4; };",
        "assert(r == 4);",
    ),
    "static_rsq": (
        "int n = 3; vector<ll> a = {1, 2, 3};",
        "assert(rsq(0, 3) == 6 && rsq(1, 3) == 5);",
    ),
    "prefix_2d": (
        "int n = 2, m = 2; vector<vi> a = {{1, 2}, {3, 4}};",
        "assert(rect_sum(0, 0, 2, 2) == 10 && rect_sum(1, 0, 2, 2) == 7);",
    ),
    "grid4": (
        "int n = 2, m = 2;",
        "assert(inside(1, 1) && !inside(2, 0) && dx[0] == 0 && dy[0] == 1);",
    ),
    "dfs_tree": (
        "int n = 3; vector<vi> g = {{1, 2}, {0}, {0}};",
        "assert(sz[0] == 3 && depth[2] == 1 && p[1] == 0);",
    ),
    "bfs_dist": (
        "int n = 3, s = 0; vector<vi> g = {{1}, {0, 2}, {1}};",
        "assert(dist[2] == 2);",
    ),
    "dsu_short": (
        "int n = 3;",
        "assert(unite(0, 1) && get(get, 0) == get(get, 1));",
    ),
    "bitmask_loop": (
        "int n = 3;",
        "assert(true);",
    ),
    "print_vector": (
        "vi v = {1, 2, 3};",
        "cout << '\\n';",
    ),
}

TOP_CASES = {
    "fenwick_sum": "fenwick f(3); f.add(0, 2); f.add(2, 5); assert(f.get(0, 2) == 7);",
    "modpow": "assert(modpow(2, 10) == 1024);",
}


def compile_source(name: str, source: str) -> None:
    TMP.mkdir(parents=True, exist_ok=True)
    cpp = TMP / f"{name}.cpp"
    exe = TMP / name
    cpp.write_text(source)
    subprocess.run(
        ["g++", "-std=c++17", str(cpp), "-o", str(exe)],
        check=True,
        cwd=ROOT,
    )
    subprocess.run([str(exe)], check=True)


def main() -> int:
    base_template = (BRICKS / "base_template.hpp").read_text()
    compile_source("base_template", base_template)

    for name, (before, after) in BODY_CASES.items():
        snippet = (BRICKS / f"{name}.hpp").read_text()
        source = f"{BASE}\nint main() {{\n{before}\n{snippet}\n{after}\nreturn 0;\n}}\n"
        compile_source(name, source)

    for name, body in TOP_CASES.items():
        snippet = (BRICKS / f"{name}.hpp").read_text()
        source = f"{BASE}\n{snippet}\nint main() {{\n{body}\nreturn 0;\n}}\n"
        compile_source(name, source)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

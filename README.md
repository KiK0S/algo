# algo

Repository layout:

- `lib/`: competitive programming snippets and catalog metadata
- `lib/bricks/`: short paste snippets that assume the usual contest template
- `lib/solvers/`: global utility snippets that expose callable interfaces
- `lib/catalog/`: sidecar metadata for interactive extension imports
- `tests/`: C++ tests for library headers
- `extension/`: VS Code extension (`edulcni`), with bundled headers in `extension/library/`
- `tools/mine_iwcf_patterns.py`: read-only scanner for repeated patterns in `/home/kikos/dev/iwcf`
- `docs/iwcf-patterns.md`: current scan report and catalog rationale

Insertable snippets live under `lib/solvers/` or `lib/bricks/`; the old
top-level `lib/*.hpp` compatibility layer has been removed.

Interactive extension entries are available through `edulcni` browse paths such as:

- `/solvers/segtree`
- `/solvers/segtree_lazy_minmax`
- `/solvers/segtree_max_subarray`
- `/solvers/berlekamp_massey`
- `/solvers/sparse_table`
- `/solvers/dsu`
- `/solvers/rollback_dsu`
- `/solvers/lca`
- `/solvers/hld`
- `/solvers/bfs`
- `/solvers/linear_sieve`
- `/solvers/fenwick`
- `/solvers/modint`
- `/solvers/twosat`
- `/solvers/maxflow_dinic`
- `/solvers/mincost_maxflow`
- `/solvers/hungarian`
- `/solvers/kuhn`
- `/solvers/implicit_treap`
- `/solvers/merge_sort_tree`
- `/solvers/suffix_array`
- `/solvers/segtree_beats`
- `/solvers/fft_ntt`
- `/solvers/poly_hash`
- `/solvers/fast_allocator`
- `/solvers/monotonic_stack`
- `/solvers/toposort`
- `/solvers/kosaraju`
- `/solvers/dijkstra`
- `/solvers/mo`
- `/solvers/geometry`
- `/solvers/halfplane_intersection`
- `/solvers/gp_hash_table`
- `/solvers/ordered_set`
- `/solvers/set_utils`
- `/bricks/compress_unique`
- `/bricks/read_vector`

`/solvers/segtree` is an interactive generator. It scans the current C++ file for
identifier collisions and ordinary constants/variables, proposes safe names,
asks for the aggregate/update shape, and inserts an inline global segment tree.
For min trees with lazy range add, it can also emit a `first_leq` descent query;
static fallbacks such as `/solvers/segtree_point_update` and
`/solvers/segtree_lazy_add_min` remain browsable through the catalog.
`/solvers/segtree_lazy_minmax` provides a static lazy min/max tree fallback for
range assign/add and first/last threshold descents.
`/solvers/segtree_max_subarray` provides a static max-subarray tree fallback.
`/solvers/berlekamp_massey` can generate the recurrence and kth-term helpers as
a global utility fragment with a copyable usage example in a block comment.
`/solvers/sparse_table` can generate global min/max sparse-table helpers over an
existing vector with inclusive `[l, r]` queries.
`/solvers/dsu` can generate a collision-aware disjoint set union helper with a
copyable usage example.
`/solvers/rollback_dsu` can generate a rollback-capable disjoint set union
helper with snapshots and component metadata.
`/solvers/lca` can generate a binary-lifting tree helper.
`/solvers/hld` provides a static heavy-light decomposition helper for path and
subtree segments.
`/solvers/bfs` can generate BFS helpers with single-source, multi-source,
edge-add, visit order, and path restoration support.
`/solvers/linear_sieve` can generate a linear sieve helper with optional lowest
prime, prime-list, and factorization support.
`/solvers/fenwick` can generate a generic Fenwick tree helper with sum, xor,
max, and min operation aliases.
`/solvers/modint` can generate static-template and runtime-modulus modular
integer helpers with arithmetic, powers, and extended-gcd inverses.
`/solvers/twosat` can generate a self-contained 2-SAT helper with optional
xor/equality/force/at-most-one helpers and component access.
`/solvers/maxflow_dinic` can generate a Dinic max-flow class with configurable
capacity type, optional min-cut/edge access/reset helpers, and an explicit
directed-edge input reader mode.
`/solvers/mincost_maxflow` can generate a min-cost max-flow class with
configurable capacity/cost types, negative-cost initialization through
potentials, optional graph/potential accessors, and fixed-flow input mode.
`/solvers/hungarian` can generate a Hungarian assignment helper for min or max
cost matching over an existing or generated cost matrix.
`/solvers/kuhn` can generate a bipartite Kuhn matcher with optional minimum
vertex-cover helpers and an edge-list input mode.
`/solvers/implicit_treap` can generate a class-based sum treap with optional
reverse and range-add lazy operations.
`/solvers/merge_sort_tree` can generate a class-based merge-sort tree over an
existing vector with selectable inclusive range-count and existence queries.
`/solvers/suffix_array` can generate suffix-array helpers with optional rank,
LCP, stripped-SA, and LCP range-query support.
`/solvers/segtree_beats` can generate a class-based beats helper with selectable
chmin/chmax/add updates and sum/min/max queries.
`/solvers/fft_ntt` can generate complex FFT and modular NTT helpers, with
optional convolution wrappers and configurable NTT modulus/root defaults.
`/solvers/poly_hash` can generate pair-mod polynomial rolling hash helpers with
configurable constants and optional substring equality, concat, reverse, and
LCP methods.
`/solvers/fast_allocator`, `/solvers/monotonic_stack`, `/solvers/gp_hash_table`,
`/solvers/ordered_set`, and `/solvers/set_utils` provide static utility snippets
for allocator-backed containers, nearest-index stack helpers, PBDS-based
hash/order-statistics helpers, and ordered-container navigation helpers.
`/solvers/toposort`, `/solvers/kosaraju`, and `/solvers/dijkstra` provide
static graph helper snippets for DAG order, SCC condensation, and shortest paths.
`/solvers/mo` provides a static Mo's algorithm helper for offline half-open
range queries.
`/solvers/geometry` and `/solvers/halfplane_intersection` provide static 2D
geometry snippets for points, orientation, segment intersections, convex hulls,
and half-plane intersections.
`/bricks/compress_unique` and `/bricks/read_vector` are also interactive: they
ask which vector/name to use before rendering cursor-local snippets.
Static solver snippets also use catalog/inferred exported names to avoid
collisions with identifiers already present in the active C++ file.

Snippet conventions:

- Bricks are terse cursor-local snippets and may assume `base_template`.
- Solvers are global paste snippets: no header guards, no `namespace edulcni`,
  no local standard-library includes, and no dependency on another local header.
- Catalog metadata in `lib/catalog/` is used for generator registry dispatch,
  dependencies, insertion mode, section metadata, and exported-name handling.

Extension library sync:

```bash
cd extension
npm run build
```

This copies `lib/bricks/`, `lib/solvers/`, and `lib/catalog/` to
`extension/library/` so `edulcni` always inserts from the bundled source, not
the current workspace.

Run Fenwick tests:

```bash
g++ -std=c++17 tests/fenwick_test.cpp -o /tmp/fenwick_test && /tmp/fenwick_test
```

Run Segment Tree tests:

```bash
g++ -std=c++17 tests/segtree_test.cpp -o /tmp/segtree_test && /tmp/segtree_test
```

Run new catalog smoke tests:

```bash
npm --prefix extension test
python3 tests/brick_smoke_test.py
g++ -std=c++17 tests/solvers_structures_test.cpp -o /tmp/solvers_structures_test && /tmp/solvers_structures_test
g++ -std=c++17 tests/solvers_flow_matching_test.cpp -o /tmp/solvers_flow_matching_test && /tmp/solvers_flow_matching_test
g++ -std=c++17 tests/solvers_twosat_fft_test.cpp -o /tmp/solvers_twosat_fft_test && /tmp/solvers_twosat_fft_test
```

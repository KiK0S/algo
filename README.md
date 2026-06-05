# algo

Repository layout:

- `lib/`: competitive programming headers (`.hpp`)
- `lib/bricks/`: short paste snippets that assume the usual contest template
- `lib/solvers/`: global utility snippets that expose callable interfaces
- `lib/catalog/`: sidecar metadata for interactive extension imports
- `tests/`: C++ tests for library headers
- `extension/`: VS Code extension (`edulcni`), with bundled headers in `extension/library/`
- `tools/mine_iwcf_patterns.py`: read-only scanner for repeated patterns in `/home/kikos/dev/iwcf`
- `docs/iwcf-patterns.md`: current scan report and catalog rationale

Top-level `lib/*.hpp` headers are a legacy compatibility layer during the
dynamic-snippet migration. They should disappear one by one after each solver or
brick replacement is represented under `lib/solvers/` or `lib/bricks/`.

Interactive extension entries are available through `edulcni` browse paths such as:

- `/solvers/segtree`
- `/solvers/berlekamp_massey`
- `/solvers/sparse_table`
- `/solvers/dsu`
- `/bricks/compress_unique`
- `/bricks/read_vector`

`/solvers/segtree` is an interactive generator. It scans the current C++ file for
identifier collisions and ordinary constants/variables, proposes safe names,
asks for the aggregate/update shape, and inserts an inline global segment tree.
`/solvers/berlekamp_massey` can generate the recurrence and kth-term helpers as
a global utility fragment with a copyable usage example in a block comment.
`/solvers/sparse_table` can generate global min/max sparse-table helpers over an
existing vector with inclusive `[l, r]` queries.
`/solvers/dsu` can generate a collision-aware disjoint set union helper with a
copyable usage example.
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

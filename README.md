# algo

Repository layout:

- `lib/`: competitive programming headers (`.hpp`)
- `lib/bricks/`: short paste snippets that assume the usual contest template
- `lib/solvers/`: complete one-shot snippets for larger algorithms/data structures
- `lib/catalog/`: sidecar metadata for interactive extension imports
- `tests/`: C++ tests for library headers
- `extension/`: VS Code extension (`edulcni`), with bundled headers in `extension/library/`
- `tools/mine_iwcf_patterns.py`: read-only scanner for repeated patterns in `/home/kikos/dev/iwcf`
- `docs/iwcf-patterns.md`: current scan report and catalog rationale

Current top-level headers remain available for compatibility. Interactive extension entries are direct Command Palette commands such as:

- `edulcni:segtree`
- `edulcni:compress_unique`
- `edulcni:read_vector`

`/solvers/segtree` is an interactive generator. It scans the current C++ file for
identifier collisions and ordinary constants/variables, proposes safe names,
asks for the aggregate/update shape, and inserts an inline global segment tree.
`/bricks/compress_unique` and `/bricks/read_vector` are also interactive: they
ask which vector/name to use before rendering cursor-local snippets.
Static solver snippets also use catalog/inferred exported names to avoid
collisions with identifiers already present in the active C++ file.

Snippet conventions:

- Bricks are terse cursor-local snippets and may assume `base_template`.
- Solvers are global paste snippets: no header guards, no `namespace edulcni`,
  no local standard-library includes, and no dependency on another local header.
- Catalog metadata in `lib/catalog/` is used for generators, dependencies,
  insertion mode, and exported-name handling.

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

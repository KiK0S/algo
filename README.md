# algo

Repository layout:

- `lib/`: competitive programming headers (`.hpp`)
- `tests/`: C++ tests for library headers
- `extension/`: VS Code extension (`edulcni`), with bundled headers in `extension/library/`

Current header:

- `lib/fenwick.hpp`
- `lib/segtree.hpp`
- `lib/bfs.hpp`
- `lib/dijkstra.hpp`
- `lib/dinic.hpp`
- `lib/modint.hpp`
- `lib/fft.hpp`

Extension library sync:

```bash
cd extension
npm run build
```

This copies `lib/` to `extension/library/` so `edulcni` always inserts from the bundled source, not the current workspace.

Run Fenwick tests:

```bash
g++ -std=c++17 tests/fenwick_test.cpp -o /tmp/fenwick_test && /tmp/fenwick_test
```

Run Segment Tree tests:

```bash
g++ -std=c++17 tests/segtree_test.cpp -o /tmp/segtree_test && /tmp/segtree_test
```

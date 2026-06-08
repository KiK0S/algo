# HLD Solver Migration

Status: completed static solver cleanup. The browse path is `/solvers/hld`; the
pasteable fallback source is `lib/solvers/hld.hpp`; legacy `lib/hld.hpp` was
removed after tests moved to the solver path.

Completed migration:

1. Kept the existing `HeavyLightDecomposition` API as the static solver
   fallback.
2. Moved the pasteable source to `lib/solvers/hld.hpp` and stripped the header
   guard plus `edulcni` namespace to match solver snippet conventions.
3. Added catalog metadata for `/solvers/hld` with explicit exports.
4. Moved `tests/hld_test.cpp` to the solver-path include and global class name.
5. Removed the top-level legacy compatibility header.

Future dynamic work:

- Add a registry-backed generator only if we need selectable path-query wiring,
  edge-vs-node segment conventions, or generated segment-tree integration.

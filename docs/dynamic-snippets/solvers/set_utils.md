# Set Utils Solver Migration

Status: completed static solver cleanup. The browse path is
`/solvers/set_utils`; the pasteable fallback source is
`lib/solvers/set_utils.hpp`; legacy `lib/set_utils.hpp` was removed after tests
moved to the solver path.

Completed migration:

1. Classified the helper as a solver because it exposes reusable global helper
   functions rather than a cursor-local snippet.
2. Moved the pasteable source to `lib/solvers/set_utils.hpp` and stripped the
   header guard plus `edulcni` namespace to match solver snippet conventions.
3. Added catalog metadata for `/solvers/set_utils` with explicit exports.
4. Moved `tests/set_utils_test.cpp` to the solver-path include and global
   helper calls.
5. Removed the top-level legacy compatibility header.

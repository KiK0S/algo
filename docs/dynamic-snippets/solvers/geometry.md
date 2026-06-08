# Geometry Solver Migration

Status: completed static solver cleanup. The browse path is `/solvers/geometry`;
the pasteable fallback source is `lib/solvers/geometry.hpp`; legacy
`lib/geometry.hpp` was removed after tests moved to the solver path.

Completed migration:

1. Kept the existing `Point2` API plus orientation, segment, angle-sort, and
   convex-hull helpers as the static solver fallback.
2. Moved the pasteable source to `lib/solvers/geometry.hpp` and stripped the
   header guard plus `edulcni` namespace to match solver snippet conventions.
3. Added catalog metadata for `/solvers/geometry` with explicit exports.
4. Moved `tests/geometry_test.cpp` to the solver-path include and global helper
   names.
5. Removed the top-level legacy compatibility header.

Future dynamic work:

- Add a registry-backed generator only if geometry feature groups need to be
  selected independently for shorter insertions.

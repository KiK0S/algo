# Geometry Solver Migration

Status: completed smart solver migration. The browse path is `/solvers/geometry`;
the pasteable fallback source is `lib/solvers/geometry.hpp`; legacy
`lib/geometry.hpp` was removed after tests moved to the solver path.

Completed migration:

1. Kept the existing `Point2` API plus orientation, segment, angle-sort, and
   convex-hull helpers as the static solver fallback.
2. Moved the pasteable source to `lib/solvers/geometry.hpp` and stripped the
   header guard plus `edulcni` namespace to match solver snippet conventions.
3. Added catalog metadata for `/solvers/geometry` with explicit exports and
   dynamic generator metadata.
4. Added a registry-backed generator with helper-only output plus usage
   snippets for orientation checks, segment intersection, angle sorting, and
   convex hull construction.
5. Moved `tests/geometry_test.cpp` to the solver-path include and global helper
   names.
6. Removed the top-level legacy compatibility header.

Dynamic choices:

- Scenario: orientation, segment intersection, angle sorting, or convex hull.
- Usage mode: helper-only or a solve-section snippet for the selected scenario.
- Bindings: coordinate type, points vector, and result variable.

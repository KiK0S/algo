# Half-Plane Intersection Solver Migration

Status: completed static solver cleanup. The browse path is
`/solvers/halfplane_intersection`; the pasteable fallback source is
`lib/solvers/halfplane_intersection.hpp`; legacy
`lib/halfplane_intersection.hpp` was removed after tests moved to solver paths.

Completed migration:

1. Kept the existing `HalfPlane` API and half-plane intersection helpers as the
   static solver fallback.
2. Moved the pasteable source to `lib/solvers/halfplane_intersection.hpp` and
   stripped the header guard plus `edulcni` namespace to match solver snippet
   conventions.
3. Added catalog metadata for `/solvers/halfplane_intersection` with explicit
   exports. The fallback is self-contained so it does not require a local
   geometry header dependency.
4. Moved `tests/halfplane_intersection_test.cpp` to solver-path includes and
   global helper names.
5. Removed the top-level legacy compatibility header.

Future dynamic work:

- Fold this into a geometry feature selector if the geometry solver gets a
  registry-backed generator.

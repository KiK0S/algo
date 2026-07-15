# Half-Plane Intersection Solver Migration

Status: completed smart solver migration. The browse path is
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
   exports and dynamic generator metadata. The fallback is self-contained so it
   does not require a local geometry header dependency.
4. Added a registry-backed generator with helper-only output plus usage
   snippets for half-plane vectors, inequality constraints, and polygon
   computation.
5. Moved `tests/halfplane_intersection_test.cpp` to solver-path includes and
   global helper names.
6. Removed the top-level legacy compatibility header.

Dynamic choices:

- Scenario: convex polygon, linear constraints, or polygon clipping.
- Usage mode: helper-only, half-plane vector, inequality box, or compute
  polygon.
- Bindings: half-plane vector and result polygon identifiers.

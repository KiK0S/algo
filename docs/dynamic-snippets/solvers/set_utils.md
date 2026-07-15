# Set Utils Solver Migration

Status: completed smart solver migration. The browse path is
`/solvers/set_utils`; the pasteable fallback source is
`lib/solvers/set_utils.hpp`; legacy `lib/set_utils.hpp` was removed after tests
moved to the solver path.

Completed migration:

1. Classified the helper as a solver because it exposes reusable global helper
   functions rather than a cursor-local snippet.
2. Moved the pasteable source to `lib/solvers/set_utils.hpp` and stripped the
   header guard plus `edulcni` namespace to match solver snippet conventions.
3. Added catalog metadata for `/solvers/set_utils` with explicit exports and
   dynamic generator metadata.
4. Added a registry-backed generator that can emit helper-only code or a
   concrete neighbor lookup snippet.
5. Covered common scenarios: next value, previous value, iterator navigation,
   and map neighbor lookup.
6. Moved `tests/set_utils_test.cpp` to the solver-path include and global
   helper calls.
7. Removed the top-level legacy compatibility header.

Dynamic choices:

- Lookup direction: `next` or `prev`.
- Target: returned value via `optional` or iterator navigation.
- Usage mode: helper-only or solve-section lookup snippet.
- Bindings: container, key, iterator, and result identifiers.

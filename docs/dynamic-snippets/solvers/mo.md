# Mo Solver Migration

Status: completed static solver cleanup. The browse path is `/solvers/mo`; the
pasteable fallback source is `lib/solvers/mo.hpp`; legacy `lib/mo.hpp` was
removed after tests moved to the solver path.

Completed migration:

1. Kept the existing `MoQuery`, ordering, normalization, and callback processor
   API as the static solver fallback.
2. Moved the pasteable source to `lib/solvers/mo.hpp` and stripped the header
   guard plus `edulcni` namespace to match solver snippet conventions.
3. Added catalog metadata for `/solvers/mo` with explicit exports.
4. Moved `tests/mo_test.cpp` to the solver-path include and global helper names.
5. Removed the top-level legacy compatibility header.

Future dynamic work:

- Add a registry-backed generator if we need to emit problem-specific add,
  remove, and answer lambdas or generated query input wiring.

# Monotonic Stack Solver Migration

Status: completed static solver cleanup. The catalog entry path is
`/solvers/monotonic_stack`; the pasteable fallback source is
`lib/solvers/monotonic_stack.hpp`; legacy `lib/monotonic_stack.hpp` was removed
after tests moved to the solver path.

## Completed

1. Moved the nearest smaller/greater helpers into a global pasteable solver file
   with no header guard, local include, or `edulcni` namespace.
2. Added catalog metadata for `/solvers/monotonic_stack` with explicit exports.
3. Moved `tests/monotonic_stack_test.cpp` to the solver-path include and global
   helper calls.
4. Added the completed-migration guardrail row in `extension/test/core.test.js`.
5. Removed the top-level legacy compatibility header.

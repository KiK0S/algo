# Fenwick

Status: completed dynamic migration. The dynamic entry path is
`/solvers/fenwick`; the pasteable fallback source is
`lib/solvers/fenwick.hpp`; legacy `lib/fenwick.hpp` was removed after tests
moved to the solver path.

## Sources

- `lib/solvers/fenwick.hpp`
- related brick: `lib/bricks/fenwick_sum.hpp`
- tests: `tests/fenwick_test.cpp`

## Resolved Choices

- Dynamic path: `/solvers/fenwick`.
- Static fallback: `lib/solvers/fenwick.hpp`.
- Default operations: sum, xor, max, and min.
- Generated API keeps the legacy helper shape in global snippet form:
  `Fenwick<T, Op>`, operation structs, and operation aliases.
- Collision handling renames the class, operation structs, and aliases through
  the shared name planner.
- The short sum-only `fenwick_sum` brick remains separate for cursor-local
  insertion.

## Completed

1. Added registry-backed dynamic renderer for `/solvers/fenwick`.
2. Cataloged the solver with static fallback source `solvers/fenwick.hpp`.
3. Added a pasteable global solver fallback without header guards or namespace.
4. Moved `tests/fenwick_test.cpp` to the solver-path include.
5. Removed the top-level legacy `lib/fenwick.hpp` compatibility header.
6. Added extension render, catalog, migration guardrail, and generated compile
   tests.

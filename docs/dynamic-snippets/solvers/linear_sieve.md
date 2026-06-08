# Linear Sieve

Status: completed dynamic migration. The dynamic entry path is
`/solvers/linear_sieve`; the pasteable fallback source is
`lib/solvers/linear_sieve.hpp`; legacy `lib/linear_sieve.hpp` was removed after
tests moved to the solver path.

## Sources

- `lib/solvers/linear_sieve.hpp`
- tests: `tests/linear_sieve_test.cpp`

## Resolved Choices

- Dynamic path: `/solvers/linear_sieve`.
- Static fallback: `lib/solvers/linear_sieve.hpp`.
- Default features: lowest-prime table/accessors, prime-list accessors, and
  integer factorization.
- Generated API keeps the legacy names in global snippet form:
  `LinearSieve`, `linear_sieve_lowest_prime`, and `linear_sieve_primes`.
- Collision handling renames the class and free helper functions through the
  shared name planner.

## Completed

1. Added registry-backed dynamic renderer for `/solvers/linear_sieve`.
2. Cataloged the solver with static fallback source `solvers/linear_sieve.hpp`.
3. Added a pasteable global solver fallback without header guards or namespace.
4. Moved `tests/linear_sieve_test.cpp` to the solver-path include.
5. Removed the top-level legacy `lib/linear_sieve.hpp` compatibility header.
6. Added extension render, catalog, migration guardrail, and generated compile
   tests.

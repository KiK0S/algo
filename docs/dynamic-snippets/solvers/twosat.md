# TwoSat Dynamic Plan

Status: completed dynamic migration. The dynamic entry path is
`/solvers/twosat`; the pasteable fallback source is
`lib/solvers/twosat.hpp`; legacy `lib/twosat.hpp` was removed after tests moved
to the solver path.

## Existing Source

- `lib/solvers/twosat.hpp`
- tests: `tests/twosat_test.cpp`, `tests/solvers_twosat_fft_test.cpp`

## Solver-Specific Choices

Resolve these from the assumptions, settled defaults, existing code, and tests first. Ask the user only if a choice remains a genuine blocker:

- Should the generator emit the full class or small helper functions over implication graph arrays?
- Which clause helpers should be included: either, implies, equals, xor, at most one?
- Should assignment extraction be included by default?
- Should generated input support common clause formats?

## Assumptions

- Keep class output by default.
- Default helpers: add_or, add_implication, solve, assignment.
- Extra clause helpers are optional features.

## Dynamic Options

- variable count source
- feature helpers: implication, equivalence, xor, force true/false, at-most-one
- outputs: satisfiable boolean, assignment vector, components
- names: class, graph, reverse graph, order, comp, assignment, solve

## Sections

- data: optional variable count and clauses
- helpers: TwoSat class/functions
- solve: optional clause input and solve call

## Implementation Plan

1. Add `twosat` generator with clause-helper feature flags.
2. Use name planner for all arrays and exported class/function names.
3. Add optional graph-read clause input later after user confirms format.
4. Preserve static fallback.

## Tests

- Render default class and compile satisfiable/unsatisfiable examples.
- Render with xor helper and verify helper appears.
- Collision test for `TwoSat`, `comp`, `assignment`, `solve`.
- Re-run TwoSat tests.

## Completed Notes

Completed in this migration:

1. Added registry-backed dynamic renderer and prompt for `/solvers/twosat`.
2. Cataloged the solver with static fallback source `solvers/twosat.hpp`.
3. Kept the static fallback self-contained under `lib/solvers/twosat.hpp`.
4. Moved `tests/twosat_test.cpp` to the solver-path include.
5. Removed the top-level legacy `lib/twosat.hpp` compatibility header.

Generated input formats remain a future explicit follow-up, as the packet
requested waiting for a confirmed clause format.

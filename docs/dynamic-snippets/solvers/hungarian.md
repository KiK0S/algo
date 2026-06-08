# Hungarian Dynamic Plan

Status: completed dynamic migration. The dynamic entry path is
`/solvers/hungarian`; the pasteable fallback source is
`lib/solvers/hungarian.hpp`; legacy `lib/hungarian.hpp` was removed after tests
moved to the solver path.

## Existing Source

- `lib/solvers/hungarian.hpp`
- tests: `tests/hungarian_test.cpp`, `tests/solvers_flow_matching_test.cpp`

## Completed Solver-Specific Choices

- Default mode: minimize.
- Rectangular matrices are supported by default through transposition when
  rows exceed columns.
- Output stays aligned with the static fallback: `HungarianResult<Cost>` with
  `min_cost`, `match_left`, and `match_right`.
- Default generator shape uses an existing matrix; generated read/call solve
  mode is optional.
- Maximization is a selectable wrapper that reuses the generated minimizer.

## Assumptions

- Kept current generic `HungarianResult<Cost>` static fallback.
- Dynamic default minimizes an existing matrix and returns cost plus assignment.
- Maximization is a selectable wrapper.

## Dynamic Options

- cost type
- matrix source: existing `vector<vector<T>>`, generated read matrix
- mode: minimize, maximize
- rectangular handling: yes/no
- outputs: assignment, inverse assignment, potentials, result struct
- names: result struct, helper function, cost matrix variable

## Sections

- data: optional cost matrix declaration/read
- helpers: result struct and selected Hungarian functions
- solve: optional call and output handling

## Implementation Plan

Completed in this migration:

1. Added `hungarian` generator and registry entry.
2. Prompted for cost type, matrix source, min/max mode, and rectangular support.
3. Rendered the maximize wrapper only when selected.
4. Used the name planner for result struct, helper functions, solve function,
   matrix variable, result variable, and dimensions.
5. Preserved static fallback under `lib/solvers/hungarian.hpp`.
6. Moved `tests/hungarian_test.cpp` to the solver-path include.
7. Removed the top-level legacy `lib/hungarian.hpp` compatibility header.

## Tests

- Extension render and collision tests cover minimize, maximize, rectangular
  toggle, generated solve mode, `HungarianResult`, `hungarian`, and generated
  data names such as `assignment`.
- Generated C++ compile tests cover a 3x3 minimization case, a maximization
  case, and generated read/call solve mode.
- Re-run Hungarian and flow/matching tests after this migration.

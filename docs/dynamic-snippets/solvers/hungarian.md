# Hungarian Dynamic Plan

## Existing Source

- `lib/solvers/hungarian.hpp`
- tests: `tests/hungarian_test.cpp`, `tests/solvers_flow_matching_test.cpp`

## Solver-Specific Choices

Resolve these from the assumptions, settled defaults, existing code, and tests first. Ask the user only if a choice remains a genuine blocker:

- Should the default solve minimization or maximization?
- Should rectangular matrices be supported by default?
- Should output include assignment, total cost, potentials, or only assignment and cost?
- Should the generator read a cost matrix or use an existing matrix?

## Assumptions

- Keep current generic `HungarianResult<Cost>` static fallback.
- Dynamic default: minimize an existing matrix, return cost and assignment.
- Maximization can be a selectable wrapper.

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

1. Add `hungarian` generator.
2. Prompt for cost type, matrix source, and min/max mode.
3. Render maximize wrapper only when selected.
4. Use name planner for result and function names.
5. Preserve static fallback.

## Tests

- Render minimize variant and compile a 3x3 case.
- Render maximize wrapper and compile a small case.
- Collision test for `HungarianResult`, `hungarian`, `assignment`.
- Re-run Hungarian and flow/matching tests.


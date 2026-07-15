# Monotonic Stack Smart Solver

Status: completed smart-generator migration. The dynamic entry path is
`/solvers/monotonic_stack`; the pasteable fallback source is
`lib/solvers/monotonic_stack.hpp`; the extension command uses the
registry-backed `monotonic_stack` generator.

## Applications

1. `nearest_smaller`: nearest previous/next smaller or smaller-or-equal index.
2. `nearest_greater`: nearest previous/next greater or greater-or-equal index.
3. `all_nearest`: compute left/right smaller and greater arrays together.
4. `custom_comparator`: use generic nearest-left/right helpers with a custom
   comparator.

## Decision Tree

1. Pick the application scenario.
2. Choose relation: `smaller`, `greater`, or `all`.
3. Choose direction: `left`, `right`, or `both`.
4. Choose strictness: strict or allow equal values.
5. Bind `sourceName` from detected vector candidates.
6. Choose usage output:
   - `helper_only`
   - `compute_vector`
   - `compute_all`

## Generated Shape

- `helpers`: emits the API-compatible generic comparator helpers, smaller and
  greater left/right wrappers, `NearestIndices`, and `nearest_all`.
- `solve`: optionally emits a single nearest-index vector assignment or an
  `auto` assignment for all nearest arrays.

## Bindings

- `sourceName`: source vector.
- `resultName`: generated result variable.
- `valueType`: reserved for future typed examples; helpers remain templated.

## Notes

- Results store nearest indices, or `-1` when no valid neighbor exists.
- Strict mode uses `<` or `>`; non-strict mode allows equality.
- Default noninteractive insertion remains helper-only with a usage comment.

## Verification

- `npm --prefix extension test`
- `npm --prefix extension run build`
- `g++ -std=c++17 tests/monotonic_stack_test.cpp -o /tmp/monotonic_stack_test && /tmp/monotonic_stack_test`

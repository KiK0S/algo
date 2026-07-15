# Ordered Set Smart Solver

Status: completed smart-generator migration. The dynamic entry path is
`/solvers/ordered_set`; the pasteable fallback source is
`lib/solvers/ordered_set.hpp`; the extension command uses the registry-backed
`ordered_set` generator.

## Applications

1. `order_statistics`: rank and kth-element queries over a set.
2. `kth_element`: retrieve the zero-based kth element.
3. `multiset_pairs`: emulate duplicate values with `(value, unique_id)` keys.
4. `rank_queries`: count keys strictly smaller than a query key.

## Decision Tree

1. Pick the application scenario.
2. Bind `keyType`.
3. Choose usage output:
   - `helper_only`
   - `declare_set`
   - `rank_query`
   - `kth_query`
   - `pair_multiset`
4. Bind `setName`.

## Generated Shape

- `helpers`: emits `OrderedSetTree` and the `OrderedSet` wrapper class.
- `solve`: optionally emits set declarations and small rank/kth query snippets.

## Bindings

- `keyType`: set key type.
- `setName`: ordered-set variable.

## Notes

- This helper requires PBDS headers and `__gnu_pbds`.
- Duplicate values should use pair-key mode.
- Default noninteractive insertion remains helper-only with a usage comment.

## Verification

- `npm --prefix extension test`
- `npm --prefix extension run build`
- `g++ -std=c++17 tests/ordered_set_test.cpp -o /tmp/ordered_set_test && /tmp/ordered_set_test`

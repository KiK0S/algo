# GP Hash Table Smart Solver

Status: completed smart-generator migration. The dynamic entry path is
`/solvers/gp_hash_table`; the pasteable fallback source is
`lib/solvers/gp_hash_table.hpp`; the extension command uses the registry-backed
`gp_hash_table` generator.

## Applications

1. `hash_map`: PBDS `gp_hash_table` with splitmix-protected scalar keys.
2. `hash_set`: set-like `gp_hash_table<Key, __gnu_pbds::null_type>`.
3. `frequency_table`: count values from an existing source vector.
4. `pair_key`: hash `pair` keys through `PairHash`.

## Decision Tree

1. Pick the application scenario.
2. Bind `keyType`, defaulting to `long long` or pair types for pair keys.
3. Bind `valueType`.
4. Choose usage output:
   - `helper_only`
   - `declare_map`
   - `declare_set`
   - `frequency_loop`
5. Bind `sourceName` for frequency loops and `tableName` for declarations.

## Generated Shape

- `helpers`: emits `SplitMix64Hash`, `GpHash`, `PairHash`, and the
  `GpHashTable` alias.
- `solve`: optionally emits map/set declarations or a frequency-count loop.

## Bindings

- `keyType`: hash-table key type.
- `valueType`: mapped value type.
- `tableName`: table variable name.
- `sourceName`: source vector for frequency loops.

## Notes

- This helper requires `<ext/pb_ds/assoc_container.hpp>` in the user template.
- For pair keys, use `GpHashTable<pair<A, B>, V, PairHash<A, B>>`.
- Default noninteractive insertion remains helper-only with a usage comment.

## Verification

- `npm --prefix extension test`
- `npm --prefix extension run build`
- `g++ -std=c++17 tests/gp_hash_table_test.cpp -o /tmp/gp_hash_table_test && /tmp/gp_hash_table_test`

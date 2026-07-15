# Mo Smart Solver

Status: completed smart-generator migration. The dynamic entry path is
`/solvers/mo`; the pasteable fallback source is `lib/solvers/mo.hpp`; the
extension command uses the registry-backed `mo` generator.

## Applications

1. `distinct_values`: offline distinct-count queries with frequency state.
2. `range_frequency`: frequency-style add/remove range queries.
3. `range_aggregate`: custom state maintained by four callbacks.
4. `custom_callbacks`: reusable ordering and processor helpers only.

## Decision Tree

1. Pick the application scenario.
2. Choose query source:
   - `existing_queries`: use an existing `vector<MoQuery>`.
   - `read_queries`: generate query reading.
3. Bind `sizeExpression`, `valuesName`, and `queryCountName` where needed.
4. Choose query indexing:
   - `zero_based_half_open`: input already matches `[l, r)`.
   - `one_based_closed_input`: decrement `l` and keep `r`, converting to
     half-open `[l - 1, r)`.
5. Choose usage output:
   - `helper_only`
   - `read_queries`
   - `process_skeleton`
   - `distinct_count_skeleton`

## Generated Shape

- `helpers`: emits the API-compatible `MoQuery`, block-size helper,
  query normalization, query ordering, and callback processor.
- `solve`: optionally emits query input, a generic callback skeleton, or a
  distinct-count skeleton.

## Bindings

- `sizeExpression`: array length.
- `queryCountName`: query count.
- `valuesName`: source values vector for add/remove callbacks.
- `queriesName`: query vector name.
- `answersName`: answers vector name.

## Notes

- Query intervals are normalized to half-open `[left, right)`.
- The generic processor accepts separate add/remove callbacks for left and
  right movement, which keeps asymmetric state updates possible.
- Default noninteractive insertion remains helper-only with a usage comment.

## Verification

- `npm --prefix extension test`
- `npm --prefix extension run build`
- `g++ -std=c++17 tests/mo_test.cpp -o /tmp/mo_test && /tmp/mo_test`

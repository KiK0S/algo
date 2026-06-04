# Static RMQ / Sparse Table Dynamic Plan

Status: completed sparse-table migration. The dynamic entry path is
`/solvers/sparse_table`; the fallback source is
`lib/solvers/sparse_table.hpp`.

## Existing Source

- `lib/solvers/sparse_table.hpp`
- legacy `lib/sparse_table.hpp` was removed after tests and `lib/lca.hpp`
  moved to the solver fallback path.
- tests: `tests/sparse_table_test.cpp`, `tests/solvers_structures_test.cpp`

## Start By Aligning With The User

Historical alignment for the completed slice:

- Dynamic path: `/solvers/sparse_table`.
- First variants: min and max.
- Generated output: terse global arrays/functions, not a class.
- Query interval: inclusive `[l, r]`, matching the current static fallback.
- Source data: use an existing vector by default.
- Remove the top-level `lib/sparse_table.hpp` compatibility header in the same
  slice once references move.

## Assumptions

- Keep current `SparseTable<T, Op>` static snippet as fallback under
  `lib/solvers/sparse_table.hpp`.
- Dynamic default: min and max sparse tables over an existing vector, inclusive
  range query.
- Product means "generic associative combine over arbitrary type", not necessarily multiplication, until the user confirms semantics.
- Disjoint sparse table is a separate feature because it supports non-idempotent operations.

## Dynamic Options

- value type: existing vector type, `int`, `ll`, `long long`, custom
- source: existing vector, generated vector, raw array
- variant: `min`, `max`, `product`, `custom`, `disjoint`
- names: table, log array, build function, query function, op/combine function
- output: class helper, globals/functions, or full solution sections
- dependency consumers: LCA RMQ mode, suffix-array LCP RMQ

## Sections

- data: optional source vector declaration/read
- helpers: sparse table storage, build, query, combine
- solve: optional call to build and sample query placeholders only if full-solution mode asks for them

## Implementation Plan

Completed in this slice:

1. Added `sparse_table` generator entry in the registry.
2. Added prompt options using existing vector symbols.
3. Rendered idempotent sparse tables for min/max as global arrays/functions.
4. Exposed catalog metadata at `/solvers/sparse_table`.
5. Preserved `SparseMinTable` and `SparseMaxTable` static fallback exports under
   `lib/solvers/sparse_table.hpp`.
6. Removed `lib/sparse_table.hpp` after moving tests and the remaining
   top-level LCA include.

Deferred optional follow-ups:

- Custom associative operation.
- Disjoint sparse table for non-idempotent/product mode.
- Generated dependency negotiation for LCA and suffix-array consumers.

## Tests

- Render min/max sparse tables using existing `vector<int> a`.
- Render collision case where generated global names already exist.
- Compile generated min/max snippet.
- Re-run existing sparse table and structures tests.

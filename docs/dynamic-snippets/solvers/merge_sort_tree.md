# Merge Sort Tree Dynamic Plan

Status: completed dynamic migration. The dynamic entry path is
`/solvers/merge_sort_tree`; the pasteable fallback source remains
`lib/solvers/merge_sort_tree.hpp`.

## Existing Source

- `lib/solvers/merge_sort_tree.hpp`
- tests: `tests/solvers_structures_test.cpp`

Completed migration added:

- registry-backed generator id `merge_sort_tree`
- catalog metadata and fallback source mapping
- selectable query methods for `count_less`, `count_less_equal`,
  `count_equal`, `count_in_range`, and `exists`
- default generation over an existing vector with inclusive `[l, r]` queries
- extension render, collision, and generated C++ compile tests

## Solver-Specific Choices

Resolved choices for the completed migration:

- default queries: count less and count in range
- tree stores values directly
- generator prompts for an existing vector and value type
- interval convention stays inclusive `[l, r]`
- kth queries and coordinate-compression dependency are future work

## Assumptions

- Keep static class fallback.
- Dynamic default: existing vector, inclusive intervals, count-less and count-in-range helpers.
- Kth queries are future work unless the user requests them.

## Dynamic Options

- value type and source vector
- query set: less, less/equal, equal, in range, exists, kth future
- build mode: class, global vectors/functions
- compression: no, generated compress_unique dependency, user-provided compressed data
- names: tree, build, query helpers

## Sections

- data: optional source vector
- helpers: storage and selected query functions
- solve: optional build call

## Implementation Plan

Completed:

1. Added `merge_sort_tree` generator entry.
2. Rendered selected query methods only.
3. Kept static class as fallback.
4. Added compile tests for default and exists-only generated code.
5. Added render and collision tests for class, storage, build, and query names.

Future work:

- Add optional dependency on `compress_unique` if compression mode is added.
- Add kth query support only when requested.

## Tests

- Render default tree with existing `vector<int> a`.
- Render only `exists` and verify count helpers are omitted.
- Collision test for `MergeSortTree`, storage field naming, `build`, and query
  names.
- Re-run structures tests.

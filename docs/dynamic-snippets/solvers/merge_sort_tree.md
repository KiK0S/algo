# Merge Sort Tree Dynamic Plan

## Existing Source

- `lib/solvers/merge_sort_tree.hpp`
- tests: `tests/solvers_structures_test.cpp`

## Solver-Specific Choices

Resolve these from the assumptions, settled defaults, existing code, and tests first. Ask the user only if a choice remains a genuine blocker:

- Which queries should be emitted: count less, count less/equal, count in range, exists, kth future?
- Should the tree use values directly or coordinate-compressed ids?
- Should it use an existing vector or generated input data?
- Should interval convention stay inclusive?

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

1. Add `merge_sort_tree` generator entry.
2. Render selected query methods only.
3. Add optional dependency on `compress_unique` if compression is selected.
4. Keep static class as fallback.
5. Add compile tests for default and collision scenarios.

## Tests

- Render default tree with existing `vector<int> a`.
- Render only `exists` and verify count helpers are omitted.
- Collision test for `MergeSortTree`, `tree`, and `build`.
- Re-run structures tests.


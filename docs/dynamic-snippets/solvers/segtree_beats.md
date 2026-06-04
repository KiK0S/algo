# Segment Tree Beats Dynamic Plan

## Existing Source

- `lib/solvers/segtree_beats.hpp`
- tests: `tests/solvers_structures_test.cpp`

## Start By Aligning With The User

Ask the user:

- Which operations are needed first: chmin, chmax, add, assign, sum, min, max?
- Should beats be integrated into `/solvers/segtree` or remain `/solvers/segtree_beats`?
- Should generated code be a class or global recursive functions?
- Should interval convention stay inclusive like the static class?

## Assumptions

- Keep a separate `segtree_beats` generator because beats has a distinct node invariant.
- Default features match the current static class: chmin, chmax, add, sum/min/max queries.
- Assignment is future optional work unless the user requests it.

## Dynamic Options

- value type: `ll`, `long long`, custom numeric
- updates: chmin, chmax, add, assign future
- queries: sum, min, max
- source: existing vector or generated vector
- names: node type, tree storage, push/apply functions, update/query functions

## Sections

- data: optional source vector
- helpers: node definition, tree storage/class, beats update and query helpers
- solve: optional build call

## Implementation Plan

1. Extract static implementation into renderer-friendly blocks.
2. Make operations feature-conditioned without breaking node invariants.
3. Use generic name planner for all exported types/functions.
4. Add catalog entry for dynamic generator with static fallback source.
5. Add generated compile tests before adding advanced optional operations.

## Tests

- Render default beats and compile the deterministic test case.
- Render collision case for `SegmentTreeBeats`, `Node`, `add`, `chmin`, `query_sum`.
- Verify omitted queries are not rendered when disabled.
- Re-run structures tests.


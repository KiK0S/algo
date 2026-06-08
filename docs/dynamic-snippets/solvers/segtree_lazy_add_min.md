# Segment Tree Lazy Add Min Static Fallback Plan

Status: completed fallback alignment. The canonical dynamic path remains
`/solvers/segtree`, now with a selectable `first_leq` descent helper for global
recursive min trees. The pasteable fallback source is
`lib/solvers/segtree_lazy_add_min.hpp` and is cataloged as
`/solvers/segtree_lazy_add_min`. The top-level `lib/segtree.hpp` monolith has
been split into solver fallbacks and removed.

## Existing Source

- `lib/solvers/segtree_lazy_add_min.hpp`
- current dynamic generator: `/solvers/segtree`
- tests: `tests/solvers_structures_test.cpp`, `extension/test/core.test.js`

## Solver-Specific Choices

Resolve these from the assumptions, settled defaults, existing code, and tests first. Ask the user only if a choice remains a genuine blocker:

Resolved choices:

- `/solvers/segtree` remains the canonical dynamic generator for new segment
  tree insertions.
- `first_leq` is a selectable descent feature for global recursive min trees
  and uses the same inclusive `[l, r]` convention as the static fallback.
- `/solvers/segtree_lazy_add_min` remains browsable as a static fallback with
  explicit catalog exports for `SegmentMinAddTree`.

## Assumptions

- Dynamic segtree should cover range add over min and optional first-hit descent.
- Static class remains fallback until dynamic descent features are proven.
- The query interval remains inclusive if matching this file.

## Dynamic Options

- aggregate: min
- updates: range add, point set/add optional
- descend: first less-or-equal, last less-or-equal future option
- output: global recursive functions or class
- names: tree, lazy, add, get/query, first_leq

## Sections

- data: optional source vector
- helpers: lazy tree storage, apply/push/update/query/descend
- solve: optional build call

## Completed In This Migration

1. Extended segment-tree dynamic options with descent queries.
2. Added generated min/range-add/first-leq render and compile tests.
3. Cataloged `/solvers/segtree_lazy_add_min` as a static fallback with explicit
   exports and feature metadata.
4. Kept static fallback tests passing.

## Tests

- Render min range-add tree with `first_leq`.
- Collision test for `first_leq`, `lazy_add`, and `get`.
- Compile generated output and compare with the existing static test scenario.

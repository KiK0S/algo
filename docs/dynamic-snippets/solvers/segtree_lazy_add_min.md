# Segment Tree Lazy Add Min Static Fallback Plan

## Existing Source

- `lib/solvers/segtree_lazy_add_min.hpp`
- current dynamic generator: `/solvers/segtree`
- tests: `tests/solvers_structures_test.cpp`, `extension/test/core.test.js`

## Start By Aligning With The User

Ask the user:

- Should this path redirect to `/solvers/segtree` with min plus range-add selected?
- Should `first_leq` be a selectable descend feature in the dynamic segtree generator?
- Should the static class remain available for paste use?

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

## Implementation Plan

1. Extend segtree dynamic options with descend queries.
2. Add min/range-add/first-leq render test.
3. Decide whether `/solvers/segtree_lazy_add_min` remains static or becomes a catalog alias to preselected segtree options.
4. Keep static fallback tests passing.

## Tests

- Render min range-add tree with `first_leq`.
- Collision test for `first_leq`, `lazy_add`, and `get`.
- Compile generated output and compare with the existing static test scenario.


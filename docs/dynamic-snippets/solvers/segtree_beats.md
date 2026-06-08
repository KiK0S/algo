# Segment Tree Beats Dynamic Plan

Status: completed dynamic migration. The dynamic entry path is
`/solvers/segtree_beats`; the pasteable fallback source remains
`lib/solvers/segtree_beats.hpp`.

## Existing Source

- `lib/solvers/segtree_beats.hpp`
- tests: `tests/solvers_structures_test.cpp`, `extension/test/core.test.js`

## Resolved Choices

- Keep beats separate from `/solvers/segtree` because it has a distinct node
  invariant and a larger update/query surface.
- Default features match the current static class: chmin, chmax, add, and
  sum/min/max queries.
- Generate a class, preserving the static fallback's inclusive `[l, r]` range
  convention.
- Assignment remains future optional work.

## Completed In This Migration

1. Added a registry-backed `segtree_beats` renderer in `extension/src/core.ts`.
2. Added selectable chmin/chmax/add updates and sum/min/max query methods.
3. Added collision-aware planning for the class, nested node, update methods,
   and query methods.
4. Cataloged `/solvers/segtree_beats` with static fallback source
   `solvers/segtree_beats.hpp`.
5. Added extension tests for recipe metadata, catalog metadata, default output,
   collision output, omitted operations, and generated C++ compilation.

## Follow-Up Scope

- Add range assignment only if a future problem set needs it; it is not part of
  the completed default migration.

# Segment Tree Point Update Static Fallback Plan

Status: completed fallback alignment. The canonical dynamic path remains
`/solvers/segtree`, now with an iterative class output mode for point-update
trees. The pasteable fallback source is `lib/solvers/segtree_point_update.hpp`
and is cataloged as `/solvers/segtree_point_update`. The top-level
`lib/segtree.hpp` monolith has been split into solver fallbacks and removed.

## Existing Source

- `lib/solvers/segtree_point_update.hpp`
- current dynamic generator: `/solvers/segtree`
- tests: `tests/segtree_test.cpp`, `tests/solvers_structures_test.cpp`, `extension/test/core.test.js`

## Solver-Specific Choices

Resolve these from the assumptions, settled defaults, existing code, and tests first. Ask the user only if a choice remains a genuine blocker:

Resolved choices:

- `/solvers/segtree` remains the canonical dynamic generator for new segment
  tree insertions.
- The dynamic generator supports both recursive global helpers and an iterative
  class output mode for point-update trees.
- `/solvers/segtree_point_update` remains browsable as a static fallback with
  explicit catalog exports for `SegmentTree`, operation structs, and aliases
  such as `SegmentMinTree`.

## Assumptions

- The dynamic `/solvers/segtree` generator is the canonical path for new insertions.
- This file remains as static fallback for class-style paste usage.
- Point-only iterative tree can be a dynamic option because it is shorter than recursive global output.

## Dynamic Options

- aggregate: sum, min, max, custom
- update: point set, point add
- interval convention: half-open `[l, r)` for iterative class mode, inclusive for recursive global mode unless the user chooses otherwise
- output: class aliases, global arrays/functions, or full solution sections

## Sections

- data: optional source vector
- helpers: op structs, tree class or global helpers
- solve: optional build call

## Completed In This Migration

1. Folded point-update choices into the shared segtree generator with
   `global_recursive` and `iterative_class` output modes.
2. Added an iterative class renderer matching the static fallback's half-open
   query API and point update behavior.
3. Cataloged `/solvers/segtree_point_update` as a static fallback with explicit
   exports.
4. Kept current static tests passing.

## Tests

- Existing segtree generator tests remain green.
- Render iterative point set min tree with a collision on `SegmentTree`.
- Compile generated point-only tree.
- Re-run structures tests.

# Segment Tree Point Update Static Fallback Plan

## Existing Source

- `lib/solvers/segtree_point_update.hpp`
- current dynamic generator: `/solvers/segtree`
- tests: `tests/segtree_test.cpp`, `tests/solvers_structures_test.cpp`, `extension/test/core.test.js`

## Start By Aligning With The User

Ask the user:

- Should this static snippet remain browsable, or should it redirect to `/solvers/segtree`?
- Should point-only variants be rendered as iterative trees, recursive global trees, or either?
- Should aliases like `SegmentMinTree` stay available from static fallback?

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

## Implementation Plan

1. Fold point-update choices into the shared segtree generator.
2. Add an iterative class output mode if the user wants this static style preserved dynamically.
3. Catalog this static snippet as fallback or alias it to `/solvers/segtree`.
4. Keep current static tests passing.

## Tests

- Existing segtree generator tests remain green.
- Render iterative point set min tree with a collision on `SegmentTree`.
- Compile generated point-only tree.
- Re-run structures tests.


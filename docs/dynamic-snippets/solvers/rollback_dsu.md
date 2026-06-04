# Rollback DSU Dynamic Plan

## Existing Source

- `lib/solvers/rollback_dsu.hpp`
- tests: `tests/dsu_test.cpp`, `tests/solvers_structures_test.cpp`

## Start By Aligning With The User

Ask the user:

- Should rollback DSU stay a class or support short global arrays/functions?
- Should optional features include component count, component sizes, bipartite parity, or undo history only?
- Should snapshots be explicit integer tokens or stack-length snapshots?
- Should this generator share code with the short DSU brick?

## Assumptions

- Keep class output by default.
- Default features: parent, size, component count, snapshot, rollback, unite, same.
- Parity/bipartite DSU is a future optional variant.

## Dynamic Options

- size source: existing `n`, custom expression
- features: snapshot, rollback one step, rollback to snapshot, component count, sizes, parity future
- output: class or global helper block
- names: class, parent, size, history, snapshot, rollback, unite

## Sections

- data: optional DSU instance declaration
- helpers: DSU class/functions
- solve: optional construction with selected `n`

## Implementation Plan

1. Add `rollback_dsu` generator with static fallback.
2. Add feature flags for history and component metadata.
3. Share name-planning conventions with `dsu_short` brick.
4. Add generated compile tests for default class output.

## Tests

- Render default rollback DSU and compile snapshot/rollback scenario.
- Collision test for `RollbackDsu`, `unite`, `rollback`, `history`.
- Re-run DSU and structures tests.


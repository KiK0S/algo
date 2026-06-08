# Rollback DSU Dynamic Plan

Status: completed dynamic migration. The dynamic entry path is
`/solvers/rollback_dsu`; the pasteable fallback source is
`lib/solvers/rollback_dsu.hpp`. There was no top-level
`lib/rollback_dsu.hpp` compatibility header to remove.

## Existing Source

- `lib/solvers/rollback_dsu.hpp`
- tests: `tests/dsu_test.cpp`, `tests/solvers_structures_test.cpp`

## Solver-Specific Choices

Resolve these from the assumptions, settled defaults, existing code, and tests first. Ask the user only if a choice remains a genuine blocker:

Resolved choices:

- Rollback DSU stays a class.
- Default features include parent, size, component count, snapshot, rollback,
  rollback-to-snapshot, unite, same, and component size.
- Snapshots are explicit integer stack-length tokens from `snapshot()`.
- The generator follows class-based DSU naming, not the short DSU brick.

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

## Completed In This Migration

1. Added the `rollback_dsu` generator with static fallback metadata.
2. Preserved history, snapshot, rollback, component count, and component size in
   the generated default class output.
3. Added collision-aware class naming with the shared name planner.
4. Added generated render and compile tests for default class output.
5. Added catalog metadata at `/solvers/rollback_dsu`.

## Tests

- Render default rollback DSU and compile snapshot/rollback scenario.
- Collision test for `RollbackDsu`, with method/private names scoped inside the
  generated class.
- Re-run structures tests.

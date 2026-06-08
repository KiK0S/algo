# Implicit Treap Dynamic Plan

Status: completed dynamic migration. The dynamic entry path is
`/solvers/implicit_treap`; the pasteable fallback source is
`lib/solvers/implicit_treap.hpp`; legacy `lib/treap.hpp` was removed after
tests moved to the solver path.

## Existing Source

- `lib/solvers/implicit_treap.hpp`
- tests: `tests/treap_test.cpp`, `tests/solvers_structures_test.cpp`

## Solver-Specific Choices

Resolve these from the assumptions, settled defaults, existing code, and tests first. Ask the user only if a choice remains a genuine blocker:

- Which aggregate should default: sum, min, max, custom?
- Which lazy features are wanted: reverse, add, assign, chmin/chmax future?
- Should priorities be generated with fixed seed, `rng`, or passed externally?
- Should output be a class, loose helper functions, or both?

## Assumptions

- Keep class output by default because treap ownership is cleaner there.
- Default aggregate remains sum, matching current `TreapSumOp`.
- Reverse should be considered a first dynamic feature even if the current static API already supports it or can be extended.

The completed migration used these resolved choices:

- Dynamic path: `/solvers/implicit_treap`.
- Static fallback: `lib/solvers/implicit_treap.hpp`.
- Default output: class-based sum treap with fixed xorshift priority seed.
- Default lazy feature: range reverse.
- Optional generated lazy feature: range add.

## Dynamic Options

- value type and aggregate op
- lazy features: reverse, add, assign
- operations: push_back, insert, erase, split, merge, range query, range update, to_vector
- source: initial vector or empty treap
- names: node, treap class, root, rng, operation helpers

## Sections

- data: optional source vector and treap variable
- helpers: node, op, treap class/functions
- solve: optional construction/build calls

## Implementation Plan

1. Catalog `implicit_treap` as a dynamic generator with static fallback.
2. Add prompt for aggregate and lazy features.
3. Render only selected operations to keep output small.
4. Use name planner for `Node`, `ImplicitTreap`, `merge`, `split`, and helper names.
5. Add compile tests for default sum and one lazy feature.

Completed in this migration:

1. Added registry-backed dynamic renderer and prompt for `/solvers/implicit_treap`.
2. Cataloged the solver with static fallback source `solvers/implicit_treap.hpp`.
3. Added renderer, collision, metadata, and generated C++ compile tests.
4. Moved `tests/treap_test.cpp` to the solver-path include.
5. Removed the top-level legacy `lib/treap.hpp` compatibility header.

## Tests

- Render default sum treap and compile insert/query scenario.
- Render custom aggregate skeleton with TODO comments.
- Collision test for `Node`, `merge`, `split`, `root`.
- Re-run treap tests.

Future optional follow-ups:

- Add generated range-assign support when a concrete default API is chosen.
- Add min/max/custom aggregate presets beyond the current custom skeleton.

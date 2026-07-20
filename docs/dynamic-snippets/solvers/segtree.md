# Segment Tree

Status: active smart-runtime pilot after Fenwick.

## Goal

- Dynamic path: `/solvers/segtree`.
- Static fallbacks: `lib/solvers/segtree_point_update.hpp`,
  `lib/solvers/segtree_lazy_add_min.hpp`,
  `lib/solvers/segtree_lazy_minmax.hpp`,
  `lib/solvers/segtree_max_subarray.hpp`, and
  `lib/solvers/segtree_beats.hpp`.
- User-facing outcome: choose a segment-tree scenario first, then emit the
  smallest helper and optional solve skeleton for that scenario.

## Scenario Inventory

- Point update plus range aggregate.
- Lazy range add/assign plus range aggregate.
- Lazy min/max preset with threshold descents.
- Max-subarray point-set tree.
- Beats preset for `chmin`, `chmax`, add, sum, min, and max.

Out of scope for the current pass: fully custom lazy-tag composition UIs,
noncommutative directional path aggregates, and persistent segment trees.

## Decision Tree

- First choice: application scenario.
- Operation choice:
  - sum, min, max, or custom node for ordinary trees.
  - max-subarray node preset.
  - beats node preset.
- Update choice: point set/add, range add/assign, or beats updates.
- Build source: empty size, existing vector, or generated read loop.
- Indexing: 0-indexed or 1-indexed input adjustment for generated usage.
- Generated output: definitions only, instance/build skeleton, or query loop skeleton.

## Inputs And Outputs

- Prefill size from detected `n`, `N`, `sz`, constants, and annotated inputs.
- Prefill source vectors from detected `vector` variables such as `a`, `v`, and
  `values`.
- Reserve global helper names, class names, operation aliases, max-subarray
  names, and beats names through the shared planner.
- Helper sections insert globally; usage skeletons insert into `solve()` when a
  solve function exists.

## Generator Contract

- `/solvers/segtree` is the canonical smart command.
- Split static fallbacks remain browseable compatibility presets.
- Ordinary generated recursive helpers keep inclusive `[l, r]` ranges.
- Iterative point tree keeps half-open class queries internally, with generated
  inclusive query-loop usage adapting `r`.
- Max-subarray generated output matches the static fallback API:
  `point_set`, `get`, and `max_sum`.
- Beats remains available both as `/solvers/segtree` scenario and the
  `/solvers/segtree_beats` compatibility path.

## Acceptance Cases

- Render default point/lazy helpers.
- Render max-subarray preset from `/solvers/segtree`.
- Route beats from `/solvers/segtree` prompt.
- Verify collisions for ordinary and max-subarray names.
- Compile generated ordinary, lazy, max-subarray, and beats outputs.
- Check catalog metadata includes applications, constraints, wrappers, and
  bindings.

## Follow-Ups

- Add a custom lazy-tag composition prompt once more solvers share the same
  custom-operation UX.
- Add last-threshold descent in the ordinary dynamic renderer.
- Consider replacing the lazy min/max static fallback with a narrowed generated
  class once the prompt has enough presets.

# Segment Tree Beats

Status: active smart-runtime surface.

## Goal

- Dynamic path: `/solvers/segtree_beats`.
- Static fallback: `lib/solvers/segtree_beats.hpp`.
- User-facing outcome: choose the beats workload, update/query subset, build
  source, and usage skeleton while preserving the compact beats class.

## Scenario Inventory

- Clamp updates plus aggregate queries: range `chmin`, range `chmax`, and
  sum/min/max queries.
- Add plus clamp updates: range add combined with clamp updates and aggregate
  queries.
- Query-only tree over the beats node state.

Out of scope for this pass: range assignment, modulo updates, historic/persistent
beats, and non-numeric value types.

## Decision Tree

- First choice: application scenario.
- Update choices: `chmin`, `chmax`, and optionally `add`.
- Query choices: `sum`, `min`, and/or `max`.
- Build source: empty size, existing vector, or generated read loop.
- Indexing: 0-indexed or 1-indexed input adjustment for generated usage.
- Usage output: helper only, instance/build skeleton, or query loop skeleton.

## Inputs And Outputs

- Prefill source from detected vectors such as `a`, `v`, and `values`.
- Infer value type from the selected vector when practical.
- Prefill size from detected inputs and constants such as `n`.
- Reserve class, node, update method, and query method names through the shared
  name planner.
- Helpers insert globally; usage snippets insert into `solve()`.

## Generator Contract

- Keep the separate `/solvers/segtree_beats` path because beats has distinct
  invariants from ordinary lazy segment trees.
- Keep inclusive `[l, r]` APIs.
- Generate only selected update/query public methods and their private helpers.
- Keep `lib/solvers/segtree_beats.hpp` as a pasteable broad fallback.
- Query-loop skeleton uses type-coded operations and emits the first selected
  query as the concrete output branch.

## Acceptance Cases

- Render default add/clamp/query helper.
- Render clamp-only and query-only variants.
- Render read-loop/query-loop usage into `solve`.
- Verify collision handling for class, node, update, and query names.
- Compile generated default and query-only outputs.
- Verify catalog metadata includes applications, constraints, wrappers, and
  bindings.

## Follow-Ups

- Add range assignment only if a future problem set needs it.
- Add more explicit query-loop operation labels if the extension gains richer
  form rendering.

# DSU

Status: active smart-runtime surface.

## Goal

- Dynamic path: `/solvers/dsu`.
- Static fallback: `lib/solvers/dsu.hpp`.
- User-facing outcome: choose connectivity, Kruskal, or query-loop usage and
  emit the DSU class plus optional solve skeleton.

## Scenario Inventory

- Plain connectivity and component maintenance.
- Online type-coded unite/same/component-size queries.
- Kruskal MST skeleton.

Out of scope for this pass: parity DSU, weighted/potential DSU, and rollback;
rollback remains `/solvers/rollback_dsu`.

## Decision Tree

- First choice: application scenario.
- Node count binding: detected `n`/constants or custom expression.
- Optional edge count binding for Kruskal.
- Indexing: 0-indexed or 1-indexed input adjustment in generated usage.
- Generated output: definitions only, instance skeleton, query loop, or Kruskal skeleton.

## Inputs And Outputs

- Prefill node count from detected inputs and constants.
- Prefill edge/query count from detected `m`, `q`, and similar symbols.
- Reserve the generated class name through the shared name planner.
- Helpers insert globally; usage snippets insert into `solve()`.

## Generator Contract

- Keep the current `Dsu` API: `reset`, `size`, `components`, `find`, `unite`,
  `same`, `component_size`, and `parents`.
- Keep static fallback pasteable.
- Generated query loop uses type `1` for unite, type `2` for same, and type `3`
  for component size.
- Kruskal skeleton emits a local `Edge` struct and sorted edge loop.

## Acceptance Cases

- Render helper-only DSU.
- Render instance, query-loop, and Kruskal usage sections.
- Verify collision handling for `Dsu`.
- Compile generated helper output.
- Verify catalog metadata includes applications, constraints, wrappers, and
  bindings.

## Follow-Ups

- Add parity DSU as a separate DSU mode.
- Add weighted/potential DSU for equation constraints.

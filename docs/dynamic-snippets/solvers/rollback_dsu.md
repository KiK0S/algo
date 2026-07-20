# Rollback DSU

Status: active smart-runtime surface.

## Goal

- Dynamic path: `/solvers/rollback_dsu`.
- Static fallback: `lib/solvers/rollback_dsu.hpp`.
- User-facing outcome: choose snapshot/rollback or offline dynamic connectivity
  direction and emit the rollback DSU class plus optional solve skeleton.

## Scenario Inventory

- Explicit snapshots and rollback for recursive search/backtracking.
- Snapshot query loop with unite, snapshot, rollback, and same queries.
- Offline dynamic connectivity scaffold direction.

Out of scope for this pass: full segment-tree-over-time edge interval scaffold,
parity rollback DSU, and weighted rollback DSU.

## Decision Tree

- First choice: snapshots or offline dynamic connectivity direction.
- Node count binding from active-file inputs/constants.
- Query count binding for generated skeletons.
- Indexing: 0-indexed or 1-indexed input adjustment.
- Generated output: definitions only, instance skeleton, or snapshot query loop.

## Inputs And Outputs

- Prefill node count from `n` and constants.
- Prefill query count from `q`, `m`, and similar symbols.
- Reserve the generated class name through the shared name planner.
- Helpers insert globally; usage snippets insert into `solve()`.

## Generator Contract

- Keep rollback DSU path separate from plain `/solvers/dsu`.
- Keep no path compression in rollback `find`.
- Preserve `snapshot()`, `rollback()`, and `rollback(snapshot_id)` APIs.
- Generated snapshot query loop uses type `1` unite, type `2` snapshot, type
  `3` rollback latest snapshot, and type `4` same query.
- Keep static fallback pasteable.

## Acceptance Cases

- Render helper-only rollback DSU.
- Render instance and snapshot query-loop usage sections.
- Verify collision handling for `RollbackDsu`.
- Compile generated helper output.
- Verify catalog metadata includes applications, constraints, wrappers, and
  bindings.

## Follow-Ups

- Add full offline dynamic connectivity scaffold once dependency/section
  generation for recursive drivers is mature.
- Add parity rollback DSU as a separate mode.

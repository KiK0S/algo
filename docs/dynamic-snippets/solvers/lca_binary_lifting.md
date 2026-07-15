# LCA Binary Lifting

Status: active smart-runtime surface.

## Goal

- Dynamic path: `/solvers/lca`.
- Static fallback: `lib/solvers/lca_binary_lifting.hpp`.
- User-facing outcome: choose LCA/distance, kth ancestor, or a tree query-loop
  scenario and emit the binary-lifting helper plus optional solve skeleton.

## Scenario Inventory

- LCA and distance queries.
- Kth ancestor queries.
- Generated tree read/build/query loop.

Out of scope for this pass: Euler-tour RMQ LCA, weighted path aggregates, and
subtree traversal metadata.

## Decision Tree

- First choice: application scenario.
- Build source: empty helper or generated tree read loop.
- Node count binding from active-file inputs/constants.
- Root expression, defaulting to `0`.
- Indexing: 0-indexed or 1-indexed input adjustment.
- Usage output: helper only, instance skeleton, read tree + build, or query
  loop skeleton.

## Inputs And Outputs

- Prefill node count from detected `n`, constants, and annotated inputs.
- Prefill query count from detected `q`, `m`, and similar symbols.
- Reserve the generated class name through the shared name planner.
- Helpers insert globally; usage snippets insert into `solve()`.

## Generator Contract

- Keep the binary-lifting class API: `add_edge`, `build`, `parent`, `depth`,
  `component`, `kth_ancestor`, `lca`, and `dist`.
- Keep forest-safe behavior where disconnected LCA returns `-1`.
- Generated query loop uses type `1` for LCA, type `2` for distance, and type
  `3` for kth ancestor.
- Keep static fallback pasteable.

## Acceptance Cases

- Render helper-only binary lifting.
- Render instance, tree-read, and query-loop usage sections.
- Verify collision handling for `LcaBinaryLifting`.
- Compile generated helper output.
- Verify catalog metadata includes applications, constraints, wrappers, and
  bindings.

## Follow-Ups

- Add Euler-tour RMQ mode after dependency prompts can compose sparse table
  variants cleanly.
- Add weighted edge aggregates as a separate scenario.

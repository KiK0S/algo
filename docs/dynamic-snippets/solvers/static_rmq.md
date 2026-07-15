# Sparse Table

Status: active smart-runtime surface.

## Goal

- Dynamic path: `/solvers/sparse_table`.
- Static fallback: `lib/solvers/sparse_table.hpp`.
- User-facing outcome: choose a static idempotent query scenario, reuse or read
  a source vector, and emit only the selected sparse-table variants plus
  optional solve skeleton.

## Scenario Inventory

- Range min and range max.
- Range gcd.
- Range bitwise-and and bitwise-or.
- Custom idempotent operation placeholder.

Out of scope for this pass: disjoint sparse table for non-idempotent operations,
argmin/argmax pair returns, and 2D sparse table.

## Decision Tree

- First choice: application scenario.
- Variant choices:
  - `min` and/or `max`.
  - `gcd`, `bit_and`, and/or `bit_or`.
  - `custom` idempotent combine placeholder.
- Build source: existing vector or generated read loop.
- Indexing: 0-indexed or 1-indexed input adjustment for generated usage.
- Usage output: helper only, build call, or query loop skeleton.

## Inputs And Outputs

- Prefill source from detected vectors such as `a`, `v`, and `values`.
- Infer value type from the selected vector when practical.
- Prefill generated read-loop size from detected inputs and constants such as
  `n`.
- Reserve all generated table, build, query, log, and custom-combine names
  through the shared name planner.
- Helpers insert globally; build/query-loop snippets insert into `solve()`.

## Generator Contract

- Keep inclusive `[l, r]` query semantics.
- Keep `lib/solvers/sparse_table.hpp` pasteable as the class-style fallback.
- Generate global arrays/functions for terse contest usage.
- Require idempotence for every generated query variant; direct non-idempotent
  product/sum belongs to a future disjoint sparse-table surface.

## Acceptance Cases

- Render min/max default output.
- Render gcd/bitwise output.
- Render custom idempotent output with a TODO combine function.
- Verify collision handling for generated sparse names.
- Compile generated min/max and gcd/bitwise/custom outputs.
- Verify catalog metadata includes applications, constraints, wrappers, and
  bindings.

## Follow-Ups

- Add argmin/argmax with tie-breaking once a pair-return prompt pattern exists.
- Add disjoint sparse table as a separate scenario or solver path.
- Add suffix-array LCP dependency negotiation after more generators expose
  dependency prompts.

# Merge Sort Tree

Status: active smart-runtime surface.

## Goal

- Dynamic path: `/solvers/merge_sort_tree`.
- Static fallback: `lib/solvers/merge_sort_tree.hpp`.
- User-facing outcome: choose the range value-distribution scenario, reuse or
  read a source vector, and emit the selected class methods plus optional solve
  skeleton.

## Scenario Inventory

- Threshold counts: values `< x` and `<= x`.
- Exact value queries: count `== x` and existence.
- Value band counts: values in `[low, high]`.

Out of scope for this pass: kth order statistic by value, predecessor/successor,
dynamic updates, and generated coordinate-compression dependencies.

## Decision Tree

- First choice: application scenario.
- Query choices:
  - `count_less` and/or `count_less_equal`.
  - `exists` and/or `count_equal`.
  - `count_in_range`.
- Build source: existing vector or generated read loop.
- Indexing: 0-indexed or 1-indexed input adjustment for generated usage.
- Usage output: helper only, instance/build skeleton, or query loop skeleton.

## Inputs And Outputs

- Prefill source from detected vectors such as `a`, `v`, and `values`.
- Infer value type from the selected vector when practical.
- Prefill generated read-loop size from detected inputs and constants such as
  `n`.
- Reserve class, storage, build, normalization, public query, and recursive
  helper names through the shared name planner.
- Helpers insert globally; usage snippets insert into `solve()`.

## Generator Contract

- Keep the static class fallback pasteable.
- Keep generated class API inclusive on `[l, r]`.
- Generate only the selected public query methods and the private recursive
  helpers needed by those methods.
- Query-loop skeleton uses the first selected query as the concrete runnable
  shape.

## Acceptance Cases

- Render threshold-count, value-presence, and value-band variants.
- Render read-loop and query-loop usage in the `solve` section.
- Verify collision handling for class, storage, build, and query names.
- Compile generated threshold, exists-only, and query-loop-capable outputs.
- Verify catalog metadata includes applications, constraints, wrappers, and
  bindings.

## Follow-Ups

- Add kth by value with optional compressed value domain.
- Add predecessor/successor queries if a practical API emerges.
- Add compression dependency negotiation once shared dependency prompts are
  stable.

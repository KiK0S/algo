# Implicit Treap

Status: active smart-runtime surface.

## Goal

- Dynamic path: `/solvers/implicit_treap`.
- Static fallback: `lib/solvers/implicit_treap.hpp`.
- User-facing outcome: choose the sequence-maintenance scenario, optional lazy
  operations, build source, and usage skeleton while keeping a compact class
  helper.

## Scenario Inventory

- Sequence editing: insert, erase, set, get, extract/insert ranges, move,
  rotate, and materialize with `to_vector`.
- Range aggregate queries over sequence positions.
- Range lazy operations: reverse and range add.
- Custom aggregate skeleton.

Out of scope for this pass: range assign, min/max/chmin/chmax beats-like lazy
tags, external priority injection, and persistent treaps.

## Decision Tree

- First choice: application scenario.
- Aggregate: sum or custom aggregate skeleton.
- Lazy features: none, reverse, range add, or both when the scenario needs lazy
  operations.
- Build source: empty treap, existing vector, or generated read loop.
- Indexing: 0-indexed or 1-indexed input adjustment for generated usage.
- Generated output: definitions only, instance/build skeleton, or query loop skeleton.

## Inputs And Outputs

- Prefill source from detected vectors such as `a`, `v`, and `values`.
- Infer value type from the selected vector when practical.
- Prefill generated read-loop size from detected inputs and constants such as
  `n`.
- Reserve operation, class, node, split, merge, root, RNG, reverse, and add
  names through the shared name planner.
- Helpers insert globally; usage snippets insert into `solve()`.

## Generator Contract

- Keep class output by default because treap ownership is cleaner there.
- Keep inclusive `[l, r]` range APIs for query and lazy operations.
- Keep fixed xorshift-style internal priority generation.
- Keep static fallback pasteable.
- Generate solve skeletons that build from an existing/read vector through
  `assign(begin, end)` when requested.

## Acceptance Cases

- Render default sum treap.
- Render sequence-edit mode with no lazy features.
- Render range-lazy mode with reverse and add.
- Render custom aggregate skeleton.
- Render read-loop/query-loop usage into `solve`.
- Verify collision handling for op, class, node, split, merge, root, reverse,
  and add names.
- Compile generated default and range-add variants.
- Verify catalog metadata includes applications, constraints, wrappers, and
  bindings.

## Follow-Ups

- Add range assign once a stable default tag-composition API is chosen.
- Add min/max aggregate presets when the lazy-update semantics are clear.
- Add generated query-loop cases for cut/paste/rotate if a stable input format is
  adopted.

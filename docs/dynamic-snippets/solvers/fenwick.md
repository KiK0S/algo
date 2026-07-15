# Fenwick

Status: completed migration and active smart-runtime pilot.

## Goal

- Dynamic path: `/solvers/fenwick`.
- Static fallback: `lib/solvers/fenwick.hpp`.
- User-facing outcome: choose a Fenwick application scenario, prefill local
  variables from the active C++ file, and emit the smallest helper plus optional
  usage skeleton needed for that scenario.

## Scenario Inventory

- Point update plus prefix query.
- Point update plus range query for invertible operations.
- Range update plus point query.
- Range update plus range sum query.
- Frequency table with `kth` / prefix lower bound.
- Inversion-count skeleton over compressed values.
- Prefix min/max monotone update variants.

Out of scope for this pass: 2D Fenwick, persistent Fenwick, and fully custom
descend predicates.

## Decision Tree

- First choice: application scenario.
- Operation choice:
  - `sum`, `xor`, `min`, `max`, `custom`, or `custom invertible`.
  - `custom` emits combine + neutral only.
  - `custom invertible` emits combine + neutral + inverse and enables range
    query surfaces.
- Build source: empty size, existing vector, or generated read loop.
- Bindings: size expression, value type, source vector when needed, indexing,
  instance name, and answer name.
- Usage output: helper only, instance initialization, or query loop skeleton.

## Inputs And Outputs

- Prefill size from detected input scalars and constants such as `n`, `m`, and
  `MAXN`.
- Prefill source from detected vectors such as `a`, `v`, `values`.
- Infer value type from the selected vector when possible.
- Reserve all generated operation structs, aliases, `Fenwick`, and
  `RangeFenwick` through the shared name planner.
- Helper sections insert globally; usage skeletons insert into `solve()` when a
  solve function exists.

## Generator Contract

- Keep the compatible `Fenwick<T, Op>` API and operation aliases.
- Generate narrow operation structs for the selected scenario.
- Generate `RangeFenwick<T>` only for range-add/range-sum mode.
- Keep `lib/solvers/fenwick.hpp` pasteable as a broad static fallback.
- Keep `lib/bricks/fenwick_sum.hpp` as the small cursor-local sum brick.

## Acceptance Cases

- Render defaults and selected scenario variants.
- Verify custom and custom-invertible exports differ.
- Verify collision handling for all Fenwick helper names.
- Compile point-update/range-sum, range-update/range-sum, custom prefix, and
  custom-invertible range-query outputs.
- Check variable candidate ranking for existing scalars and vectors.

## Follow-Ups

- Add explicit `kth` naming customization if the frequency surface needs a
  friendlier wrapper than `descend`.
- Add 2D Fenwick as a separate path if generated code size grows.
- Consider a custom descend predicate surface after more solver specs use the
  same prompt runner.

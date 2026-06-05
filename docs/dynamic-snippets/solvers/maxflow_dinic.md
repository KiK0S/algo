# Dinic Maxflow Dynamic Plan

## Existing Source

- `lib/solvers/maxflow_dinic.hpp`
- related library header: `lib/dinic.hpp`
- tests: `tests/dinic_test.cpp`, `tests/solvers_flow_matching_test.cpp`

## Solver-Specific Choices

Resolve these from the assumptions, settled defaults, existing code, and tests first. Ask the user only if a choice remains a genuine blocker:

- Should generated code be a class or global graph arrays/functions?
- Which capacity type should default: `int`, `ll`, or custom?
- Should min-cut extraction be included?
- Should the generator declare/read the flow graph, or only emit the helper?
- Should edge ids and original capacities be exposed?

## Assumptions

- Keep class output by default.
- Default capacity type: `long long` if `ll` exists, otherwise `long long`.
- Default features: add edge and maxflow. Min cut is optional.

## Dynamic Options

- cap type
- graph size source
- directed edge input generation yes/no
- features: maxflow, min cut side, edge list access, reset flows
- names: class, edge struct, graph, level, ptr, bfs, dfs, maxflow

## Sections

- data: optional `n`, `m`, source/sink, edge input
- helpers: Dinic class/functions
- solve: optional read edges and call `maxflow`

## Implementation Plan

1. Add `dinic` or `maxflow_dinic` generator entry.
2. Prompt for cap type and whether to generate graph input.
3. Render selected helper methods and optional min-cut.
4. Use name planner for exported class and methods.
5. Keep static solver tests passing.

## Tests

- Render helper-only class and compile a small maxflow case.
- Render full-solution-style data/read section for `n`, `m`, `s`, `t`.
- Collision test for `Dinic`, `Edge`, `bfs`, `dfs`, `maxflow`.
- Re-run Dinic and flow/matching tests.


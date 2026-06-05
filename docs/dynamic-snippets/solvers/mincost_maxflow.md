# Min-Cost Max-Flow Dynamic Plan

## Existing Source

- `lib/solvers/mincost_maxflow.hpp`
- tests: `tests/mincost_maxflow_test.cpp`, `tests/solvers_flow_matching_test.cpp`

## Solver-Specific Choices

Resolve these from the assumptions, settled defaults, existing code, and tests first. Ask the user only if a choice remains a genuine blocker:

- Which capacity and cost types should be used?
- Should the algorithm support negative costs with potentials by default?
- Should the generated API return pair `{flow, cost}` or a named result struct?
- Should graph input be generated or use manual `add_edge` calls?
- Should it expose potentials/distances for debugging?

## Assumptions

- Keep class output by default.
- Default types: `long long` capacity and cost.
- Default algorithm uses potentials and shortest paths as in current static code.

## Dynamic Options

- cap type, cost type
- graph size source
- features: max flow target, min-cost max-flow, fixed-flow amount, potentials export, edge list export
- names: class, edge, graph, dist, potential, parent, add_edge, min_cost_flow

## Sections

- data: optional input graph, source, sink, flow demand
- helpers: MCMF class/functions
- solve: optional call and result handling

## Implementation Plan

1. Add `mincost_maxflow` generator.
2. Prompt for types, target flow mode, and graph input mode.
3. Render only selected result helpers.
4. Keep static source as fallback.
5. Add generated compile tests for a small fixed-flow case.

## Tests

- Render default class and compile a tiny min-cost flow network.
- Render collision case for `MinCostMaxFlow`, `Edge`, `dist`, `potential`.
- Re-run mincost and flow/matching tests.


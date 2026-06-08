# Min-Cost Max-Flow Dynamic Plan

Status: completed dynamic migration. The dynamic entry path is
`/solvers/mincost_maxflow`; the pasteable fallback source is
`lib/solvers/mincost_maxflow.hpp`; legacy `lib/mincost_maxflow.hpp` was removed
after tests moved to the solver path.

## Existing Source

- `lib/solvers/mincost_maxflow.hpp`
- tests: `tests/mincost_maxflow_test.cpp`, `tests/solvers_flow_matching_test.cpp`

## Completed Solver-Specific Choices

- Class output remains the default and stays aligned with the static fallback:
  `MinCostMaxFlow<Cap, Cost>`.
- Default capacity and cost types are `ll` when that alias exists in the active
  file, otherwise `long long`.
- The generated algorithm supports negative costs by initializing potentials
  with Bellman-Ford before Dijkstra when needed.
- The primary API returns `std::pair<Cap, Cost>` where `.first` is flow and
  `.second` is cost, matching the static fallback.
- Helper-only output is the default; directed-edge read/call solve output is an
  explicit prompt mode.
- Graph and potential accessors are optional generated methods and enabled by
  default.

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

Completed in this migration:

1. Added `mincost_maxflow` generator and registry entry.
2. Prompted for capacity type, cost type, target flow mode, optional accessors,
   and generated graph input/read-and-call mode.
3. Rendered the selected graph/potential accessors while keeping
   `min_cost_flow`, `max_flow_min_cost`, and `min_cost_max_flow` aligned with
   the fallback API.
4. Cataloged `/solvers/mincost_maxflow` with static fallback source
   `solvers/mincost_maxflow.hpp`.
5. Moved `tests/mincost_maxflow_test.cpp` to the solver-path include.
6. Removed the top-level legacy `lib/mincost_maxflow.hpp` compatibility header.

## Tests

- Extension render and collision tests cover `MinCostMaxFlow`, `Edge`,
  `min_cost_flow`, `graph`, `potential`, Bellman-Ford, Dijkstra, solve names,
  and generated result names.
- Generated C++ compile tests cover a small min-cost max-flow network,
  negative-cost fixed flow, and generated fixed-flow read/call solve mode.
- Re-run mincost and flow/matching tests after this migration.

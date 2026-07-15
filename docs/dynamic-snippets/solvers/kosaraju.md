# Kosaraju Smart Solver

Status: completed smart-generator migration. The dynamic entry path is
`/solvers/kosaraju`; the pasteable fallback source is
`lib/solvers/kosaraju.hpp`; the extension command uses the registry-backed
`kosaraju` generator.

## Applications

1. `scc_components`: compute strongly connected components and component ids.
2. `same_component`: answer whether two vertices are in the same SCC.
3. `condensation_dag`: build the SCC DAG for component-level DP.
4. `two_sat_analysis`: use implication graph SCC ids for satisfiability checks.

## Decision Tree

1. Pick the application scenario.
2. Choose graph source:
   - `existing_graph`: use an existing directed adjacency list.
   - `read_edges`: generate `vector<vector<int>> graph(n)` and a directed edge
     input loop.
3. Bind `graphName`, prefilled from detected vector candidates.
4. If reading edges, bind `sizeExpression` and `edgeCountName`.
5. Choose usage output:
   - `helper_only`
   - `read_graph`
   - `compute_scc`
   - `same_component_queries`
   - `print_components`
6. Choose input indexing, with generated decrements for one-based input.

## Generated Shape

- `helpers`: emits the API-compatible `KosarajuResult`,
  `kosaraju_add_edge`, and `kosaraju_scc` helpers.
- `solve`: optionally emits directed graph reading, SCC computation,
  same-component query loop, or component printing.

## Bindings

- `sizeExpression`: node count for generated graph allocation.
- `edgeCountName`: edge count for generated edge loops.
- `queryCountName`: query-count candidate for future query-loop expansion.
- `graphName`: directed adjacency-list variable.
- `resultName`: SCC result variable.

## Notes

- The helper returns `component_of`, `components`, and `condensation_dag`.
- The condensation DAG is deduplicated per component.
- Default noninteractive insertion remains helper-only with a usage comment.

## Verification

- `npm --prefix extension test`
- `npm --prefix extension run build`
- `g++ -std=c++17 tests/kosaraju_test.cpp -o /tmp/kosaraju_test && /tmp/kosaraju_test`

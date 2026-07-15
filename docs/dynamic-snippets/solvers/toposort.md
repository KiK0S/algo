# Toposort Smart Solver

Status: completed smart-generator migration. The dynamic entry path is
`/solvers/toposort`; the pasteable fallback source is
`lib/solvers/toposort.hpp`; the extension command uses the registry-backed
`toposort` generator.

## Applications

1. `dag_order`: produce a topological order for a DAG.
2. `cycle_detection`: detect whether directed dependencies contain a cycle.
3. `dependency_schedule`: read before-after constraints and print a valid
   schedule.
4. `order_validation`: check whether a supplied order satisfies every edge.

## Decision Tree

1. Pick the application scenario.
2. Choose graph source:
   - `existing_graph`: use an existing directed adjacency list.
   - `read_edges`: generate `vector<vector<int>> graph(n)` and read dependency
     edges.
3. Bind `graphName`, prefilled from detected vector candidates.
4. If reading edges, bind `sizeExpression` and `edgeCountName`.
5. Choose usage output:
   - `helper_only`
   - `read_graph`
   - `sort_order`
   - `cycle_check`
   - `validate_order`
6. Choose input indexing, with generated decrements for one-based input.

## Generated Shape

- `helpers`: emits the API-compatible `toposort_add_edge`,
  `topological_sort`, and `is_topological_order` helpers.
- `solve`: optionally emits directed graph reading, DAG sort/print, cycle
  check, or proposed-order validation.

## Bindings

- `sizeExpression`: node count for generated graph allocation.
- `edgeCountName`: edge count for generated edge loops.
- `graphName`: directed adjacency-list variable.
- `orderName`: topological order variable.
- `dagName`: DAG/cycle flag variable.

## Notes

- Topological sorting is directed-only. Undirected graphs should route to graph
  traversal/connectivity solvers instead.
- `topological_sort` returns an empty vector when the graph has a cycle and can
  also write the DAG flag through `bool*`.
- Default noninteractive insertion remains helper-only with a usage comment.

## Verification

- `npm --prefix extension test`
- `npm --prefix extension run build`
- `g++ -std=c++17 tests/toposort_test.cpp -o /tmp/toposort_test && /tmp/toposort_test`

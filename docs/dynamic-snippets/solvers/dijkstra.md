# Dijkstra Smart Solver

Status: completed smart-generator migration. The dynamic entry path is
`/solvers/dijkstra`; the pasteable fallback source is
`lib/solvers/dijkstra.hpp`; the extension command uses the registry-backed
`dijkstra` generator.

## Applications

1. `shortest_paths`: single-source shortest paths on nonnegative weighted
   graphs.
2. `multi_source`: several starting vertices at distance zero.
3. `path_restore`: source-to-target weighted shortest path reconstruction.
4. `weighted_graph_read`: typed weighted adjacency-list and edge input loop.

## Decision Tree

1. Pick the application scenario.
2. Choose graph source:
   - `existing_graph`: use an existing weighted adjacency-list variable.
   - `read_edges`: generate `vector<vector<DijkstraEdge<W>>> graph(n)` and a
     weighted edge loop.
3. Choose `valueType` and `infExpression`.
4. Bind `graphName`, prefilled from detected vector candidates.
5. If reading edges, bind `sizeExpression` and `edgeCountName`.
6. Choose directed or undirected edge insertion.
7. Choose usage output:
   - `helper_only`
   - `read_graph`
   - `single_source`
   - `multi_source`
   - `path_query`
8. Choose input indexing, with generated decrements for one-based input.

## Generated Shape

- `helpers`: emits the API-compatible `DijkstraEdge`, `DijkstraResult`,
  `dijkstra_add_edge`, `dijkstra_multi_source`, `dijkstra`, and
  `dijkstra_restore_path` helpers.
- `solve`: optionally emits weighted graph reading, a single-source run, a
  multi-source run, or a path query skeleton.

## Bindings

- `sizeExpression`: node count for generated graph allocation.
- `edgeCountName`: edge count for generated edge loops.
- `graphName`: weighted adjacency-list variable.
- `sourceName`: source vertex variable.
- `targetName`: target vertex variable.
- `resultName`: Dijkstra result variable.

## Notes

- The helper assumes nonnegative weights. Negative edges are skipped defensively
  by the helper; problems requiring negative weights should use a different
  shortest-path solver.
- Default noninteractive insertion remains helper-only with a usage comment.
- The static fallback remains pasteable and API-compatible with generated code.

## Verification

- `npm --prefix extension test`
- `npm --prefix extension run build`
- `g++ -std=c++17 tests/dijkstra_test.cpp -o /tmp/dijkstra_test && /tmp/dijkstra_test`

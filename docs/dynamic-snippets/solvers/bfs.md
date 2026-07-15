# BFS Smart Solver

Status: completed smart-generator migration. The dynamic entry path is
`/solvers/bfs`; the pasteable fallback source is `lib/solvers/bfs.hpp`; the
extension command uses the registry-backed `bfs` generator.

## Applications

1. `shortest_distances`: single-source distances and parent tree in an
   unweighted graph.
2. `multi_source`: several starting vertices at distance zero.
3. `path_restore`: source-to-target shortest path reconstruction.
4. `traversal_order`: reachability or BFS visit order without path output.

## Decision Tree

1. Pick the application scenario.
2. Choose graph source:
   - `existing_graph`: use an existing adjacency-list variable.
   - `read_edges`: generate `vector<vector<int>> graph(n)` and an edge loop.
3. Bind `graphName`, prefilled from detected vector candidates.
4. If reading edges, bind `sizeExpression` and `edgeCountName`.
5. Choose directed or undirected edge insertion.
6. Choose usage output:
   - `helper_only`
   - `read_graph`
   - `single_source`
   - `multi_source`
   - `path_query`
7. Choose input indexing, with generated decrements for one-based input.

## Generated Shape

- `helpers`: emits the API-compatible `BfsResult`, `bfs_add_edge`,
  `bfs_multi_source`, `bfs`, `bfs_restore_path`, and
  `bfs_restore_path_to_root` helpers.
- `solve`: optionally emits graph reading, a single-source run, a multi-source
  run, or a path query skeleton.

## Bindings

- `sizeExpression`: node count for generated graph allocation.
- `edgeCountName`: edge count for generated edge loops.
- `graphName`: adjacency-list variable.
- `sourceName`: source vertex variable.
- `targetName`: target vertex variable.
- `resultName`: BFS result variable.

## Notes

- BFS is for unweighted graphs. Weighted shortest paths should route to
  Dijkstra or another weighted solver.
- The helper API remains unchanged so existing snippets/tests keep working.
- Default noninteractive insertion remains helper-only with a usage comment.

## Verification

- `npm --prefix extension test`
- `npm --prefix extension run build`
- `g++ -std=c++17 tests/bfs_test.cpp -o /tmp/bfs_test && /tmp/bfs_test`

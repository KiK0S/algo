# HLD Smart Solver

Status: completed dynamic solver migration. The browse path is `/solvers/hld`;
the pasteable fallback source is `lib/solvers/hld.hpp`; the extension command
uses the registry-backed `hld` generator.

## Applications

1. `path_query`: flatten tree paths into O(log n) contiguous ranges for a
   Fenwick or segment tree.
2. `subtree_query`: expose rooted subtree ranges as one contiguous interval.
3. `lca_distance`: use heavy-light heads for LCA and derive distances from
   depths.
4. `build_tree`: build only the reusable flattened-tree helper state.

## Decision Tree

1. Pick the application scenario.
2. Bind `sizeExpression` from detected constants/scalars, defaulting to `n`.
3. Bind `rootExpression`, defaulting to `0`.
4. Choose source mode:
   - `empty`: paste only the helper plus optional instance skeleton.
   - `read_tree`: generate an `n - 1` edge read loop before `build`.
5. Choose path value convention:
   - `vertex_values`: path segments include the LCA position.
   - `edge_values`: path segments skip the LCA endpoint.
6. Choose usage output:
   - `helper_only`
   - `instance`
   - `read_tree`
   - `query_loop`
7. Choose input indexing, with generated decrements for one-based input.

## Generated Shape

- `helpers`: emits a collision-renamed `HeavyLightDecomposition` class with
  `add_edge`, `build`, `position`, `vertex_at`, `subtree_segment`,
  `path_segments`, `for_each_path_segment`, and `lca`.
- `solve`: optionally emits a tree read/build skeleton or a type-coded loop:
  type `1` path ranges, type `2` subtree range, and fallback LCA/distance.

## Bindings

- `sizeExpression`: node count expression.
- `rootExpression`: root vertex expression.
- `queryCountName`: detected query-count candidate for future prompt defaults.
- `instanceName`: generated helper instance name.
- `answerName`: generated answer accumulator name.

## Notes

- HLD stays separate from `/solvers/lca`: it is optimized for path/subtree
  ranges over a flattened tree, while LCA is the binary-lifting helper.
- The generated query loop deliberately leaves range aggregation as a local
  placeholder because HLD usually composes with Fenwick, segment tree, lazy
  segment tree, or custom edge-state logic.
- The static fallback remains pasteable and API-compatible with the generated
  helper.

## Verification

- `npm --prefix extension test`
- `npm --prefix extension run build`
- `g++ -std=c++17 tests/hld_test.cpp -o /tmp/hld_test && /tmp/hld_test`

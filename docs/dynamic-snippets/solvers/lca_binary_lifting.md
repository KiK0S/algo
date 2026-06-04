# LCA Dynamic Plan

## Existing Source

- `lib/solvers/lca_binary_lifting.hpp`
- related library header with RMQ approach: `lib/lca.hpp`
- related dependency: `/solvers/sparse_table`
- tests: `tests/lca_test.cpp`, `tests/solvers_structures_test.cpp`

## Start By Aligning With The User

Ask the user:

- Should the dynamic path be `/solvers/lca` with binary lifting and RMQ variants, or keep `/solvers/lca_binary_lifting` as one entry?
- Which approach should default: binary lifting or Euler tour plus RMQ?
- Which DFS precomputes are needed: parent, depth, height, subtree size, component id, tin/tout, order, subtree min/custom value?
- Should graph input be generated or use an existing adjacency list?
- Should the generated code be a class or global arrays/functions?

## Assumptions

- Use one generator named `lca` and keep static `/solvers/lca_binary_lifting` as fallback.
- Binary lifting remains the first default because current solver tests use it.
- RMQ mode requests the dynamic sparse table dependency.
- DFS precompute should be a shared tree traversal renderer that bricks can also use.

## Dynamic Options

- approach: binary lifting, Euler RMQ
- graph source: existing `g`, generated read-tree, weighted tree future option
- root: existing scalar, literal `0`, custom
- forest support: yes/no
- precompute fields: parent, depth, height, subtree size, component, tin/tout, euler order, custom subtree aggregate
- functions: `lca`, `dist`, `kth_ancestor`, `is_ancestor`, `path_min` future option
- names: graph, parent, depth, up, first, euler, rmq, dfs/build/query helpers

## Sections

- data: optional `n`, graph, value array for subtree aggregate
- helpers: DFS/precompute, LCA storage, query helpers
- solve: optional build call

## Implementation Plan

1. Build a tree precompute recipe independent of LCA.
2. Render binary lifting mode using selected precompute fields.
3. Render RMQ mode using Euler tour and sparse-table dependency.
4. Make graph/read-tree input an optional dependency instead of baked-in code.
5. Add catalog metadata for `/solvers/lca` and fallback source mapping.
6. Keep the existing static solver available under its current path until migration is stable.

## Tests

- Render binary lifting with existing `vector<vi> g`.
- Render RMQ mode and verify sparse table dependency is inserted once.
- Collision test for `depth`, `parent`, `lca`, `build`, and `up`.
- Compile generated binary lifting and RMQ snippets.
- Re-run current LCA tests.

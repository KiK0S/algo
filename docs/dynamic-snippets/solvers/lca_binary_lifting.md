# LCA Dynamic Plan

Status: completed binary-lifting migration. The dynamic entry path is
`/solvers/lca`; the pasteable fallback source is
`lib/solvers/lca_binary_lifting.hpp`; legacy `lib/lca.hpp` was removed after
tests moved to the solver path.

## Existing Source

- `lib/solvers/lca_binary_lifting.hpp`
- removed legacy library header with RMQ approach: `lib/lca.hpp`
- related dependency: `/solvers/sparse_table`
- tests: `tests/lca_test.cpp`, `tests/solvers_structures_test.cpp`

## Historical Alignment

The completed migration used these resolved choices:

- Dynamic path: `/solvers/lca`.
- Default approach: binary lifting.
- Generated shape: pasteable global helper class named `LcaBinaryLifting`.
- Generated sections: `helpers`.
- Static fallback: `lib/solvers/lca_binary_lifting.hpp`.
- Public helpers: `add_edge`, `build`, `parent`, `depth`, `component`,
  `kth_ancestor`, `lca`, and `dist`.
- Graph input generation and solve-call insertion remain outside the default
  paste fragment.

## Solver-Specific Choices

Resolve these from the assumptions, settled defaults, existing code, and tests first. Ask the user only if a choice remains a genuine blocker:

- Should the dynamic path be `/solvers/lca` with binary lifting and RMQ variants, or keep `/solvers/lca_binary_lifting` as one entry?
- Which approach should default: binary lifting or Euler tour plus RMQ?
- Which DFS precomputes are needed: parent, depth, height, subtree size, component id, tin/tout, order, subtree min/custom value?
- Should graph input be generated or use an existing adjacency list?
- Should the generated code be a class or global arrays/functions?

## Assumptions

- Use one generator named `lca` and keep static `/solvers/lca_binary_lifting` as fallback.
- Binary lifting remains the first default because current solver tests use it.
- Future RMQ mode should request the dynamic sparse table dependency.
- Future richer traversal features should use a shared tree traversal renderer
  that bricks can also use.

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

Completed:

1. Render binary lifting mode using selected precompute fields.
2. Add catalog metadata for `/solvers/lca` and fallback source mapping to
   `lib/solvers/lca_binary_lifting.hpp`.
3. Move or remove top-level `lib/lca.hpp` references in the same migration
   once the dynamic entry and solver fallback cover them.
4. Add extension renderer, collision, catalog, guardrail, and generated compile
   tests.

Future:

1. Build a tree precompute recipe independent of LCA.
2. Render RMQ mode using Euler tour and sparse-table dependency.
3. Make graph/read-tree input an optional dependency instead of baked-in code.

## Tests

- Render binary lifting default helper.
- Collision test for `LcaBinaryLifting`.
- Compile generated binary lifting snippet.
- Re-run current LCA tests.
- Future: render RMQ mode and verify sparse table dependency is inserted once.

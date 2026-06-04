# Legacy Compatibility Cleanup Plan

## Goal

Remove the top-level `lib/*.hpp` compatibility layer so every insertable artifact is either a solver or a brick. There is no literal `legacy/` directory in the current checkout; "legacy" means the top-level headers under `lib/` that sit beside `lib/solvers/`, `lib/bricks/`, and `lib/catalog/`.

## Start By Aligning With The User

The general cleanup direction is settled in
[README.md](./README.md#settled-migration-defaults): remove top-level
compatibility headers gradually as each solver/brick replacement lands.

Only ask again if a specific header has an ambiguous target:

- Should tests move immediately to `lib/solvers/*` and `lib/bricks/*`, or should forwarding files exist during a short transition?
- Should any tiny utility currently in a top-level header become a brick even if it inserts globally?
- Should duplicate implementations be merged into one solver/brick source before dynamic rendering starts?

## Final Repository Shape

- `lib/solvers/`: pasteable global helpers, data structures, and algorithm snippets.
- `lib/bricks/`: short local snippets and template/data-entry snippets.
- `lib/catalog/`: metadata for static and dynamic insertion.
- no insertable top-level `lib/*.hpp` compatibility headers.

## Migration Rules

- Every current top-level header must be classified as solver or brick.
- If a top-level header already has a matching solver file, merge any missing APIs into the solver or record an intentional omission.
- If no solver/brick exists, create one under the chosen folder.
- Update tests to include the new path.
- Update catalog exports so the extension can discover or generate the replacement.
- Delete the top-level header only after all tests and docs stop referencing it.

## Classification Inventory

| Top-level header | Target | Notes |
| --- | --- | --- |
| `lib/berlekamp_massey.hpp` | `lib/solvers/berlekamp_massey.hpp` | Migrated; legacy header removed after test include moved to solver path. |
| `lib/bfs.hpp` | `lib/solvers/bfs.hpp` | New solver or traversal generator; coordinate with BFS brick/precompute pipeline. |
| `lib/dijkstra.hpp` | `lib/solvers/dijkstra.hpp` | New graph solver; dynamic options for weight type, source, path restore. |
| `lib/dinic.hpp` | `lib/solvers/maxflow_dinic.hpp` | Existing solver; merge API differences if any. |
| `lib/dsu.hpp` | `lib/solvers/dsu.hpp` | New solver; short DSU brick remains separate. |
| `lib/fast_allocator.hpp` | `lib/solvers/fast_allocator.hpp` | Global helper solver; catalog as utility/data-structure. |
| `lib/fenwick.hpp` | `lib/solvers/fenwick.hpp` | New solver; short sum-only Fenwick brick remains separate. |
| `lib/fft.hpp` | `lib/solvers/fft_ntt.hpp` | Existing solver; reconcile `StaticModInt` dependency with `modint` solver. |
| `lib/geometry.hpp` | `lib/solvers/geometry.hpp` | New solver; consider feature groups for points, lines, hull, intersections. |
| `lib/gp_hash_table.hpp` | `lib/solvers/gp_hash_table.hpp` | New utility solver; PBDS dependency should be explicit in catalog/includes section. |
| `lib/halfplane_intersection.hpp` | `lib/solvers/halfplane_intersection.hpp` | New solver or geometry feature; depends on point geometry. |
| `lib/hld.hpp` | `lib/solvers/hld.hpp` | New tree solver; share DFS/LCA precompute choices. |
| `lib/hungarian.hpp` | `lib/solvers/hungarian.hpp` | Existing solver; compare APIs and remove duplicate. |
| `lib/kosaraju.hpp` | `lib/solvers/kosaraju.hpp` | New graph solver; dynamic SCC options. |
| `lib/kuhn.hpp` | `lib/solvers/kuhn.hpp` | Existing solver; compare APIs and remove duplicate. |
| `lib/lca.hpp` | `lib/solvers/lca_binary_lifting.hpp` plus dynamic `/solvers/lca` | Existing binary-lifting solver; RMQ variant should be represented by dynamic LCA options. |
| `lib/linear_sieve.hpp` | `lib/solvers/linear_sieve.hpp` | New number-theory solver; optional lowest prime, primes, factorization helpers. |
| `lib/mincost_maxflow.hpp` | `lib/solvers/mincost_maxflow.hpp` | Existing solver; compare APIs and remove duplicate. |
| `lib/mo.hpp` | `lib/solvers/mo.hpp` | New solver; dynamic options for add/remove callbacks and answer type. |
| `lib/modint.hpp` | `lib/solvers/modint.hpp` | New utility solver; dynamic modulus/static modulus options. |
| `lib/monotonic_stack.hpp` | `lib/solvers/monotonic_stack.hpp` | New solver or brick family; default to solver because current file exports several helpers. |
| `lib/ordered_set.hpp` | `lib/solvers/ordered_set.hpp` | New utility solver; PBDS dependency explicit. |
| `lib/poly_hash.hpp` | `lib/solvers/poly_hash.hpp` | Existing solver; compare APIs and remove duplicate. |
| `lib/segtree.hpp` | dynamic `/solvers/segtree` and segment-tree solver files | Split features: lazy specs, merge sort tree, max subarray tree, beats. Do not keep monolithic legacy file. |
| `lib/set_utils.hpp` | `lib/bricks/set_utils.hpp` or `lib/solvers/set_utils.hpp` | Decide with user; if kept as global helper functions, solver is simpler. |
| `lib/sparse_table.hpp` | `lib/solvers/sparse_table.hpp` plus dynamic sparse table generator | Migrated; legacy header removed after test includes and top-level LCA dependency moved. |
| `lib/suffix_array.hpp` | `lib/solvers/suffix_array.hpp` | Existing solver; compare APIs and remove duplicate. |
| `lib/toposort.hpp` | `lib/solvers/toposort.hpp` | New graph solver; dynamic options for cycle detection/order validation. |
| `lib/treap.hpp` | `lib/solvers/implicit_treap.hpp` | Existing solver; merge API differences and remove duplicate. |
| `lib/twosat.hpp` | `lib/solvers/twosat.hpp` | Existing solver; compare APIs and remove duplicate. |

## Test Migration

Current C++ tests include top-level headers directly. Move each include to the solver/brick replacement as that replacement lands.

Examples:

- `tests/dinic_test.cpp`: `../lib/dinic.hpp` to `../lib/solvers/maxflow_dinic.hpp`
- `tests/sparse_table_test.cpp`: `../lib/sparse_table.hpp` to `../lib/solvers/sparse_table.hpp`
- `tests/modint_test.cpp`: `../lib/modint.hpp` to `../lib/solvers/modint.hpp`

Add a CI/static check after migration:

- fail if `tests/` includes `../lib/<name>.hpp` directly.
- fail if extension catalog/bundled library exposes top-level snippets.
- fail if top-level `lib/*.hpp` files exist, except non-insertable documentation stubs if the user explicitly allows them.

## Catalog Migration

- Catalog entries should use slash paths under `/solvers/...` or `/bricks/...`.
- Top-level slash paths are not valid final entries.
- Duplicates should become aliases only temporarily; final aliases should point to solver/brick paths.

## Definition Of Done

- All current top-level headers are represented under `lib/solvers/` or `lib/bricks/`.
- Tests include only solver/brick paths.
- `README.md` and `Agents.md` no longer say top-level headers remain available for compatibility.
- `extension/scripts/sync-library.mjs` only needs to sync `bricks`, `solvers`, and `catalog`.
- `find lib -maxdepth 1 -name '*.hpp'` returns no insertable compatibility headers.

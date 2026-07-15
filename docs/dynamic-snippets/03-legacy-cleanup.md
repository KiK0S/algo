# Legacy Compatibility Cleanup Plan

## Goal

Remove the top-level `lib/*.hpp` compatibility layer so every insertable artifact is either a solver or a brick. There is no literal `legacy/` directory in the current checkout; "legacy" means the top-level headers under `lib/` that sit beside `lib/solvers/`, `lib/bricks/`, and `lib/catalog/`.

Status: complete. `find lib -maxdepth 1 -name '*.hpp'` returns no insertable
top-level compatibility headers.

## Solver-Specific Cleanup Choices

The general cleanup direction is settled in
[README.md](./README.md#settled-migration-defaults): remove top-level
compatibility headers gradually as each solver/brick replacement lands.

Only ask again if a specific header has an ambiguous target:

- Should tests move immediately to `lib/solvers/*` and `lib/bricks/*`, or should forwarding files exist during a short transition?
- Should any tiny utility currently in a top-level header become a brick even if it inserts globally?
- Should duplicate implementations be merged into one solver/brick source before dynamic rendering starts?

When the target is clear from the inventory, tests, and existing solver/brick
shape, proceed with the cleanup in the same migration. Do not keep a top-level
compatibility header just because cleanup feels like a second task.

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
| `lib/bfs.hpp` | `lib/solvers/bfs.hpp` | Migrated with dynamic generator; legacy header removed after test include moved to solver path. |
| `lib/dijkstra.hpp` | `lib/solvers/dijkstra.hpp` | Migrated as static graph solver; legacy header removed after test include moved to solver path. |
| `lib/dinic.hpp` | `lib/solvers/maxflow_dinic.hpp` | Migrated with dynamic generator; legacy header removed after test include moved to solver path. |
| `lib/dsu.hpp` | `lib/solvers/dsu.hpp` | Migrated with dynamic generator; legacy header removed after test include moved to solver path. Short DSU brick remains separate. |
| `lib/fast_allocator.hpp` | `lib/solvers/fast_allocator.hpp` | Migrated as static utility solver; legacy header removed after test include moved to solver path. |
| `lib/fenwick.hpp` | `lib/solvers/fenwick.hpp` | Migrated with dynamic generator; legacy header removed after test include moved to solver path. Short sum-only Fenwick brick remains separate. |
| `lib/fft.hpp` | `lib/solvers/fft_ntt.hpp` | Migrated with dynamic generator; legacy header removed after solver-path tests moved to standalone int NTT API. |
| `lib/geometry.hpp` | `lib/solvers/geometry.hpp` | Migrated as static 2D geometry solver; legacy header removed after tests moved to solver path. Future dynamic options can select feature groups for points, lines, hull, and intersections. |
| `lib/gp_hash_table.hpp` | `lib/solvers/gp_hash_table.hpp` | Migrated as static PBDS utility solver; legacy header removed after test include moved to solver path. |
| `lib/halfplane_intersection.hpp` | `lib/solvers/halfplane_intersection.hpp` | Migrated as self-contained static half-plane solver; legacy header removed after tests moved to solver path. |
| `lib/hld.hpp` | `lib/solvers/hld.hpp` | Migrated as static tree path/subtree helper solver; legacy header removed after test include moved to solver path. |
| `lib/hungarian.hpp` | `lib/solvers/hungarian.hpp` | Migrated with dynamic generator; legacy header removed after test include moved to solver path. |
| `lib/kosaraju.hpp` | `lib/solvers/kosaraju.hpp` | Migrated as static graph solver; legacy header removed after test include moved to solver path. |
| `lib/kuhn.hpp` | `lib/solvers/kuhn.hpp` | Migrated with dynamic generator; legacy header removed after test include moved to solver path. |
| `lib/lca.hpp` | `lib/solvers/lca_binary_lifting.hpp` plus dynamic `/solvers/lca` | Migrated; legacy header removed after tests moved to solver path. Future RMQ variant should be represented by dynamic LCA options. |
| `lib/linear_sieve.hpp` | `lib/solvers/linear_sieve.hpp` | Migrated with dynamic generator; legacy header removed after test include moved to solver path. |
| `lib/mincost_maxflow.hpp` | `lib/solvers/mincost_maxflow.hpp` | Migrated with dynamic generator; legacy header removed after test include moved to solver path. |
| `lib/mo.hpp` | `lib/solvers/mo.hpp` | Migrated as static offline-query helper solver; legacy header removed after test include moved to solver path. Future dynamic options can generate add/remove callbacks and answer wiring. |
| `lib/modint.hpp` | `lib/solvers/modint.hpp` | Migrated with dynamic generator for static-template and runtime-modulus helpers; legacy header removed after test include moved to solver path. |
| `lib/monotonic_stack.hpp` | `lib/solvers/monotonic_stack.hpp` | Migrated as static nearest-index solver; legacy header removed after test include moved to solver path. |
| `lib/ordered_set.hpp` | `lib/solvers/ordered_set.hpp` | Migrated as static PBDS utility solver; legacy header removed after test include moved to solver path. |
| `lib/poly_hash.hpp` | `lib/solvers/poly_hash.hpp` | Migrated with dynamic generator; legacy header removed after test include moved to solver path. |
| `lib/segtree.hpp` | dynamic `/solvers/segtree` and segment-tree solver files | Split and removed. Existing merge-sort tree and beats solver files cover those APIs; new `/solvers/segtree_lazy_minmax` and `/solvers/segtree_max_subarray` static fallbacks cover the remaining monolith-only APIs. |
| `lib/set_utils.hpp` | `lib/solvers/set_utils.hpp` | Migrated as static ordered-container helper solver; legacy header removed after test include moved to solver path. |
| `lib/sparse_table.hpp` | `lib/solvers/sparse_table.hpp` plus dynamic sparse table generator | Migrated; legacy header removed after test includes and top-level LCA dependency moved. |
| `lib/suffix_array.hpp` | `lib/solvers/suffix_array.hpp` | Existing solver; compare APIs and remove duplicate. |
| `lib/toposort.hpp` | `lib/solvers/toposort.hpp` | Migrated as static graph solver; legacy header removed after test include moved to solver path. |
| `lib/treap.hpp` | `lib/solvers/implicit_treap.hpp` | Migrated; legacy header removed after test include moved to solver path. |
| `lib/twosat.hpp` | `lib/solvers/twosat.hpp` | Migrated with dynamic generator; legacy header removed after test include moved to solver path. |

## Test Migration

Current C++ tests include solver/brick paths directly. Keep new tests on
`../lib/solvers/...` or `../lib/bricks/...` includes.

Add a CI/static check after migration:

- fail if `tests/` includes `../lib/<name>.hpp` directly.
- fail if extension catalog/bundled library exposes top-level snippets.
- fail if top-level `lib/*.hpp` files exist, except non-insertable documentation stubs if the user explicitly allows them.

During the incremental migration, `extension/test/core.test.js` has a
`completedMigrations` guardrail table. Each completed solver/brick cleanup
should add one row there so tests verify the legacy header is gone, the
replacement under `lib/solvers/` or `lib/bricks/` exists, the catalog source
points at the replacement, migrated tests include the replacement path, and no
`lib/*.hpp` or `tests/*.cpp` source includes the completed top-level header.

## Catalog Migration

- Catalog entries should use slash paths under `/solvers/...` or `/bricks/...`.
- Top-level slash paths are not valid final entries.
- Duplicates should become aliases only temporarily; final aliases should point to solver/brick paths.

## Definition Of Done

- All current top-level headers are represented under `lib/solvers/` or `lib/bricks/`.
- Tests include only solver/brick paths.
- `README.md` and `Agents.md` no longer say top-level headers remain available for compatibility.
- `extension/scripts/sync-library.mjs` syncs `bricks`, `solvers`, `templates`, and `catalog`.
- `find lib -maxdepth 1 -name '*.hpp'` returns no insertable compatibility headers.

# Smart Solver Pipeline

Use this pipeline when upgrading one solver from a pasteable or basic dynamic
snippet into a smart scenario-driven generator.

## Work Order

1. Read the static fallback, existing generator, catalog entry, tests, and the
   solver work packet.
2. Expand the work packet with scenario inventory, decision tree, bindings,
   generated sections, and acceptance cases.
3. Add a `*_APPLICATION_SPEC` in `extension/src/core.ts` with scenarios,
   decisions, bindings, and usage sections.
4. Extend the renderer options only for choices the generator actually uses.
5. Render helpers through `RenderedRecipe`; put usage skeletons in `solve` when
   they are meant to be dropped into `solve()`.
6. Update the VS Code prompt to ask scenario first, then only the choices valid
   for that scenario.
7. Update catalog metadata with `applications`, `aggregators` or equivalent
   domain facets, `constraints`, `wrappers`, and `bindings`.
8. Add focused extension tests for recipe exports, collision behavior, and
   generated compile coverage.
9. Run the extension tests and build after catalog or generator changes.

## Solver Batches

- Batch A: `/solvers/segtree`, `/solvers/sparse_table`,
  `/solvers/merge_sort_tree`, `/solvers/implicit_treap`,
  `/solvers/segtree_beats`.
- Batch B: `/solvers/dsu`, `/solvers/rollback_dsu`, `/solvers/lca`,
  `/solvers/hld`, `/solvers/bfs`, `/solvers/dijkstra`, `/solvers/toposort`,
  `/solvers/kosaraju`.
- Batch C: `/solvers/maxflow_dinic`, `/solvers/mincost_maxflow`,
  `/solvers/hungarian`, `/solvers/kuhn`, `/solvers/twosat`.
- Batch D: `/solvers/suffix_array`, `/solvers/poly_hash`, `/solvers/fft_ntt`,
  `/solvers/modint`, `/solvers/berlekamp_massey`, `/solvers/linear_sieve`.
- Batch E: `/solvers/ordered_set`, `/solvers/gp_hash_table`,
  `/solvers/monotonic_stack`, `/solvers/mo`, `/solvers/geometry`,
  `/solvers/halfplane_intersection`, `/solvers/set_utils`,
  `/solvers/fast_allocator`.

## Acceptance Bar

- The command should make the first prompt a solver-specific scenario choice.
- Variable prompts should prefer detected active-file symbols where practical.
- Helper-only insertion must remain possible.
- Usage skeletons must be sectioned so they can insert into `solve()`.
- Static fallback paths remain browsable while the canonical dynamic path gains
  smarter presets.

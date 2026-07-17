# Dynamic Snippet Migration Plans

> Historical planning archive. The source migration is complete: insertable
> content now lives only in `lib/templates/`, the full public surface is in
> `lib/catalog/snippets.json`, and tests render through the extension.

This folder captures the planning history for moving solver and brick insertion
onto the same dynamic model.

## Current Baseline

- `lib/templates/` contains all insertable C++ source.
- `lib/catalog/snippets.json` is the complete solver/brick inventory.
- `extension/src/core.ts` renders template recipes and performs collision-safe
  name planning.
- `extension/src/extension.ts` owns VS Code prompts and insertion.
- `extension/test/core.test.js` renders, compiles, and runs catalog scenarios.
- `site/` displays the generated archive tree and template previews.

## Target Assembly Order

Dynamic generators should be able to emit a full solution or a pasteable fragment in this order:

1. includes
2. defines and aliases
3. constants
4. data definitions, usually input arrays, strings, graphs, matrices, and supporting globals
5. helper types and helper functions
6. solve
7. main

For ordinary contest insertion, some sections may be empty because the active file already has them. The generator must still model these sections explicitly so a pipeline can decide what to import.

## Files In This Plan Set

- [00-prework.md](./00-prework.md): shared infrastructure needed before solver migrations.
- [01-agent-contract.md](./01-agent-contract.md): workflow every migration agent should follow.
- [02-bricks.md](./02-bricks.md): brick migration plan.
- [03-legacy-cleanup.md](./03-legacy-cleanup.md): plan to remove top-level compatibility headers and classify everything as solver or brick.
- [04-expansion-surfaces.md](./04-expansion-surfaces.md): structure-first expansion plan for prompts, application modes, custom escape hatches, and plug-and-play usage skeletons.
- [smart-solver-pipeline.md](./smart-solver-pipeline.md): repeatable per-solver upgrade pipeline for scenario-driven smart generators.
- [solvers/](./solvers): one work packet per solver snippet.

## Agent Rule

New work should update the generator, catalog metadata, templates, archive
preview, and catalog-driven render/compile scenarios together.
or `lib/bricks/`, legacy-header removal when references have moved, tests, and
plan/doc status. Do not stop after infrastructure or a partial draft when the
solver plan and settled defaults are enough to continue.

Read [Settled Migration Defaults](#settled-migration-defaults) before asking
alignment questions. Do not ask those same general questions again unless a
specific solver plan needs a new decision. Treat explicit defaults in a solver
plan as permission to implement; ask only when a real solver-specific choice is
missing, ambiguous, or would materially change the generated API.

Final state rule: every insertable artifact lives under `lib/solvers/` or `lib/bricks/`; there is no legacy or compatibility folder/layer left behind.

## Settled Migration Defaults

- Top-level `lib/*.hpp` compatibility headers have been removed; new
  insertable snippets should live under `lib/solvers/` or `lib/bricks/`.
- Dynamic solvers default to pasteable global utility fragments, not full
  solution files. Solvers usually expose an interface to call; bricks are
  cursor-local snippets.
- Full-solution generation is a separate explicit mode. It may use
  `/bricks/base_template`, but ordinary insertion should paste only the selected
  utility/fragment.
- Keep generated code in terse contest style unless a specific solver domain
  already needs a class-like interface or the user explicitly asks for a full
  new file.
- Optional dependencies should be rendered dynamically when a generator exists,
  asking the needed questions in that dependency pipeline. Static fallback files
  under `lib/solvers/` or `lib/bricks/` remain pasteable during migration.
- Interval conventions are per-solver defaults. Ask only when the assigned
  solver plan has no clear default or the convention materially changes the
  generated API.
- Prefer defaults and snippets informed by the existing IWCF/pattern analysis
  when available.
- `/solvers/berlekamp_massey`, `/solvers/sparse_table`, `/solvers/dsu`,
  `/solvers/rollback_dsu`, `/solvers/lca`, `/solvers/merge_sort_tree`,
  `/solvers/bfs`, `/solvers/linear_sieve`, `/solvers/fenwick`,
  `/solvers/suffix_array`, `/solvers/twosat`, `/solvers/maxflow_dinic`,
  `/solvers/mincost_maxflow`, `/solvers/hungarian`, `/solvers/kuhn`,
  `/solvers/segtree_beats`, `/solvers/implicit_treap`, `/solvers/fft_ntt`,
  `/solvers/poly_hash`, `/solvers/modint`, and `/solvers/hld` are completed
  migrations: they have registry-backed
  dynamic generators, catalog metadata, pasteable fallbacks under
  `lib/solvers/`, and solver-path tests. Dedicated top-level compatibility
  headers are removed when they exist; broader monolith cleanup remains tracked
  in [03-legacy-cleanup.md](./03-legacy-cleanup.md).
- `lib/solvers/segtree_point_update.hpp` is completed fallback alignment:
  `/solvers/segtree` has a dynamic iterative class mode, and the static
  `/solvers/segtree_point_update` fallback is cataloged with explicit exports.
- `lib/solvers/segtree_lazy_add_min.hpp` is completed fallback alignment:
  `/solvers/segtree` has a dynamic min/range-add `first_leq` descent mode, and
  the static `/solvers/segtree_lazy_add_min` fallback is cataloged with
  explicit exports.
- `lib/solvers/segtree_lazy_minmax.hpp` and
  `lib/solvers/segtree_max_subarray.hpp` completed the `lib/segtree.hpp`
  monolith cleanup: remaining lazy min/max range assign/add variants and the
  max-subarray tree now have static solver fallbacks, and the top-level
  monolith is removed.
- `/solvers/dijkstra`, `/solvers/toposort`, `/solvers/kosaraju`,
  `/solvers/gp_hash_table`, `/solvers/ordered_set`, `/solvers/set_utils`,
  `/solvers/fast_allocator`, `/solvers/geometry`,
  `/solvers/halfplane_intersection`,
  `/solvers/monotonic_stack`, and `/solvers/hld`
  are completed smart solver migrations
  with registry-backed dynamic generators, catalog metadata, pasteable global
  fallbacks under `lib/solvers/`, solver-path tests,
  and no top-level compatibility header.
- `/solvers/mo` is a completed smart offline-query solver migration with a
  registry-backed dynamic generator, catalog metadata, a pasteable global
  fallback under `lib/solvers/`, solver-path tests, and no top-level
  compatibility header.

## Next-Agent Default

If [solvers/](./solvers) has a useful `todo` packet, read that packet and
migrate the solver completely. If the solver index has no queued todo packet,
continue with generator coverage, feature groups, brick work, or the
structure-first expansion surfaces in
[04-expansion-surfaces.md](./04-expansion-surfaces.md); the top-level legacy
cleanup inventory is complete.

## Verification Spine

After any implementation step that changes generator behavior:

- `npm --prefix extension test`
- `npm --prefix extension run build`
- `node tools/build-archive-site.mjs`

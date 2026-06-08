# BFS Dynamic Plan

Status: completed dynamic migration. The dynamic entry path is `/solvers/bfs`;
the pasteable fallback source is `lib/solvers/bfs.hpp`; legacy `lib/bfs.hpp`
was removed after tests moved to the solver path.

## Existing Source

- `lib/solvers/bfs.hpp`
- tests: `tests/bfs_test.cpp`

## Historical Alignment

The completed migration used these resolved choices:

- Dynamic path: `/solvers/bfs`.
- Generated shape: pasteable global helpers, not a full solution.
- Preserve the old header API in global form: `BfsResult`, `bfs_add_edge`,
  `bfs_multi_source`, `bfs`, `bfs_restore_path`, and
  `bfs_restore_path_to_root`.
- Keep `BfsResult::distance`, `parent`, and `order`.
- Keep invalid vertices ignored for edge insertion and traversal.
- Keep the static pasteable fallback at `lib/solvers/bfs.hpp`.
- Keep the usage block comment in generated snippets by default.
- Keep the short cursor-local BFS distance snippet separate as
  `/bricks/bfs_dist`.

## Dynamic Options

- exported helper names, planned through the shared name planner
- optional usage block comment

Future graph-read or solve-section generation should reuse the read-graph brick
pipeline instead of baking input code into the BFS helper.

## Sections

- helpers: BFS result struct, graph edge helper, traversal helpers, path restore
  helpers, and optional usage block comment

## Implementation Plan

Completed in this migration:

1. Added the `bfs` generator and registered it through the shared registry.
2. Added catalog metadata at `/solvers/bfs`, with static fallback source
   `solvers/bfs.hpp`.
3. Rendered BFS as a section-based helper recipe.
4. Preserved the pasteable fallback under `lib/solvers/bfs.hpp`.
5. Removed the top-level `lib/bfs.hpp` compatibility header after moving the
   C++ test include.
6. Added extension renderer, collision, catalog, guardrail, and generated
   compile tests.

## Tests

- Render default BFS helpers.
- Render collision cases for every exported BFS identifier.
- Compile generated BFS helpers.
- Re-run `tests/bfs_test.cpp`.

# Kuhn Matching Dynamic Plan

Status: completed dynamic migration. The dynamic entry path is
`/solvers/kuhn`; the pasteable fallback source is
`lib/solvers/kuhn.hpp`; legacy `lib/kuhn.hpp` was removed after tests moved to
the solver path.

## Existing Source

- `lib/solvers/kuhn.hpp`
- tests: `tests/kuhn_test.cpp`, `tests/solvers_flow_matching_test.cpp`

## Solver-Specific Choices

The completed migration used these resolved choices:

- Dynamic path: `/solvers/kuhn`.
- Static fallback: `lib/solvers/kuhn.hpp`.
- Generated helpers include the class-based matcher and standalone
  `kuhn_maximum_matching` convenience function.
- Minimum vertex cover is an optional dynamic feature and is enabled by
  default to preserve the static fallback surface.
- Optional generated input reads `n m e` plus left-to-right edges, keeps
  0-based internals, and defaults to decrementing 1-based input edges.

Historical questions from the plan:

Resolve these from the assumptions, settled defaults, existing code, and tests first. Ask the user only if a choice remains a genuine blocker:

- Should the generator emit class-based matcher, standalone function, or both?
- Should minimum vertex cover be optional?
- Should graph input be generated for left-to-right adjacency?
- Should indexing be 0-based internally with input decrement support?

## Assumptions

- Default output: class or function matching current static convenience API.
- Vertex cover is optional because many tasks only need maximum matching.
- Generated input defaults to left side size `n`, right side size `m`.

## Dynamic Options

- left size, right size, graph source
- outputs: matching size, left matches, right matches, minimum vertex cover
- input: existing graph or generated edge list
- names: matcher class, graph, match arrays, dfs, maximum_matching, vertex_cover

## Sections

- data: optional bipartite graph declaration/read
- helpers: matcher and optional vertex-cover helpers
- solve: optional matching call

## Completed Work

1. Added registry-backed dynamic renderer and prompt for `/solvers/kuhn`.
2. Cataloged the solver with static fallback source `solvers/kuhn.hpp`.
3. Added helper-only and generated-edge-list solve sections.
4. Made vertex-cover helpers optional in the renderer while keeping them in the
   default fallback/API surface.
5. Moved `tests/kuhn_test.cpp` to the solver-path include.
6. Removed the top-level legacy `lib/kuhn.hpp` compatibility header.

## Tests

- Render maximum matching only and compile a small bipartite graph.
- Render with vertex cover and verify additional helpers appear.
- Collision test for `KuhnMatcher`, `match_left`, `match_right`, and
  `try_augment`/DFS naming.
- Re-run Kuhn and flow/matching tests.

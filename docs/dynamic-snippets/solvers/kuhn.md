# Kuhn Matching Dynamic Plan

## Existing Source

- `lib/solvers/kuhn.hpp`
- tests: `tests/kuhn_test.cpp`, `tests/solvers_flow_matching_test.cpp`

## Start By Aligning With The User

Ask the user:

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

## Implementation Plan

1. Add `kuhn` generator with feature flags for matcher and vertex cover.
2. Reuse graph input prompt primitives.
3. Render selected helper APIs only.
4. Keep static fallback and tests.

## Tests

- Render maximum matching only and compile a small bipartite graph.
- Render with vertex cover and verify additional helpers appear.
- Collision test for `KuhnMatcher`, `match_left`, `match_right`, `dfs`.
- Re-run Kuhn and flow/matching tests.


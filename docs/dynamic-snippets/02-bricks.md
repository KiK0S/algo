# Brick Dynamic Migration Plan

## Scope

Bricks are short cursor-local snippets, but they still need the same dynamic awareness as solvers: existing names, data source choices, generated sections, and optional imports.

Files:

- `lib/bricks/base_template.hpp`
- `lib/bricks/bfs_dist.hpp`
- `lib/bricks/bitmask_loop.hpp`
- `lib/bricks/compress_unique.hpp`
- `lib/bricks/decrement_indices.hpp`
- `lib/bricks/dfs_tree.hpp`
- `lib/bricks/dsu_short.hpp`
- `lib/bricks/fenwick_sum.hpp`
- `lib/bricks/grid4.hpp`
- `lib/bricks/lower_bound_l_false_r_true.hpp`
- `lib/bricks/modpow.hpp`
- `lib/bricks/prefix_2d.hpp`
- `lib/bricks/print_vector.hpp`
- `lib/bricks/read_array.hpp`
- `lib/bricks/read_graph_undirected.hpp`
- `lib/bricks/read_tree_edges.hpp`
- `lib/bricks/read_vector_ref.hpp`
- `lib/bricks/static_rsq.hpp`

## Brick-Specific Choices

Resolve these from the assumptions, settled defaults, existing code, and tests
first. Ask the user only if a choice remains a genuine blocker:

- Which bricks should become interactive first?
- Should `base_template` become a full-solution generator with selectable sections?
- Should read bricks declare data, read into existing variables, or support both?
- Should traversal bricks share a common DFS/BFS precompute pipeline with LCA and tree DP solvers?
- Should short lambda names like `dfs`, `inside`, `rsq`, and `get_id` be preserved by default when unused?

## Shared Brick Assumptions

- Cursor-local bricks can still emit only a `data` or `solve` section.
- Bricks that declare globals, such as `fenwick_sum`, should be modeled as helper sections.
- Bricks that use `n`, `m`, `a`, `g`, or `s` should offer existing candidates first.
- The current static files stay as fallback sources.

## Migration Groups

### Template And Constants

`base_template`

- Turn into a dynamic full-solution recipe.
- Optional sections: includes, typedefs/aliases, loop macros, constants, `init`, `solve`, `main`.
- Let the user pick constants to include and rename `MOD`, `INF`, `MAXN`, `n`.
- Verify that annotations still feed `analyzeCppDocument`.

### Input/Data Bricks

`read_array`, `read_vector_ref`, `read_graph_undirected`, `read_tree_edges`

- Shared prompt: declare new data or read into existing data.
- Use detected `n`, `m`, vector aliases, and graph variables.
- Options: 0-index or 1-index input, decrement endpoints, directed/undirected graph, weighted/unweighted graph.
- For tree edges, default to `n - 1` edges and undirected adjacency.

### Traversal And Precompute

`dfs_tree`, `bfs_dist`

- Share a traversal-precompute renderer with LCA.
- Options: parent, depth, subtree size, height, component id, order, entry/exit time.
- Let user reuse existing graph name.
- Avoid forcing recursive DFS if the user wants iterative.

### Utility Lambdas And Helpers

`compress_unique`, `lower_bound_l_false_r_true`, `grid4`, `static_rsq`, `prefix_2d`, `print_vector`, `decrement_indices`, `bitmask_loop`

- Keep terse cursor-local insertion.
- Prompt for target variables and helper names.
- Respect existing `all` macro or emit `begin/end` fallback if needed.
- For prefix/RMQ helpers, allow inclusive or half-open intervals.

### Small Data Structures

`fenwick_sum`, `dsu_short`, `modpow`

- Treat as helper-section recipes.
- Allow class/function/lambda naming choices.
- For `modpow`, detect `MOD` constants and support custom modulus argument.
- For DSU, prompt for parent/size vector names and whether rollback is needed. If rollback is needed, redirect to the rollback DSU solver generator.

## Implementation Plan

1. Add generic brick generator registry entries after pre-work lands.
2. Convert existing interactive bricks to the shared registry first: `compress_unique`, `read_vector`.
3. Add read-data generators because many solver plans depend on them.
4. Add traversal-precompute generators for LCA/tree DP consumers.
5. Add remaining utility bricks in small batches.
6. Keep `tests/brick_smoke_test.py` for static fallback and add extension render tests for dynamic variants.

## Definition Of Done

- Static brick smoke tests still pass.
- Dynamic bricks can use existing variable names from the active file.
- Generated helper names avoid collisions.
- `base_template` can render a full solution in the target assembly order.

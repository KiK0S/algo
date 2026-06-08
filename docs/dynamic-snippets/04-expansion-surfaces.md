# Structure-First Expansion Surface Plan

This is the next migration after snippet placement. The old migration answered:
"can the extension insert this solver or brick safely?" This expansion answers:
"after the user picks this structure, can we ask the right local questions and
emit the exact plug-and-play variant they need?"

The user is assumed to know the intended algorithm or data structure. Do not
build a generic recommender as the primary interface. The command for a path
such as `/solvers/fenwick` should ask Fenwick-specific questions and generate a
narrow, correct template with ready usage code.

## Product Contract

For every solver or structural brick, define an application surface:

- operation families it can cover
- supported aggregators or algebraic requirements
- correctness constraints the generator must ask about
- optional wrappers and usage skeletons to emit
- dependencies or bricks that naturally compose with it
- custom escape hatches for the user to provide operation logic

The ideal output is not the largest helper. It is the smallest complete helper
that covers the selected surface, plus enough call-site code to make it usable
immediately.

## Shared Prompt Axes

Use these only when they matter for the selected structure:

- value type, index type, capacity type, or cost type
- existing input variables to reuse
- build source: none, existing vector/string/graph/matrix, or generated input
- indexing of incoming queries: 0-indexed, 1-indexed, or custom adjustment
- interval convention: inclusive `[l, r]`, half-open `[l, r)`, path endpoint
  convention, or edge-vs-vertex convention
- static, online dynamic, or offline dynamic workload
- operation set: updates, queries, descents, restoration, reconstruction
- legality constraints: inverse exists, idempotent operation, monotone prefix,
  non-negative capacities, no negative cycles, convexity, etc.
- generated call-site surface: class only, helper functions, lambdas, input
  reader, query loop skeleton, or block-comment example

## Metadata Target

Add catalog metadata gradually. A first-pass shape can be:

```json
{
  "applications": ["point_update_range_query", "frequency_kth"],
  "aggregators": ["sum", "xor", "custom_group"],
  "constraints": ["inverse_for_range_query", "monotone_for_descend"],
  "wrappers": ["build_from_vector", "query_loop", "coordinate_compression"],
  "custom": ["combine", "neutral", "inverse", "descend_predicate"]
}
```

This metadata is descriptive first. Generators can start using it once the
surface is stable.

## Data Structures

### `/solvers/fenwick`

Support the broad Fenwick family:

- point update plus prefix query
- point update plus range query for invertible operations
- range update plus point query
- range update plus range query for sum-like groups
- frequency table with `kth`, `lower_bound_prefix`, and order statistics
- inversion counting and compressed frequency counting skeletons
- prefix min and prefix max for monotone update styles
- xor and product variants when an inverse is available
- 2D Fenwick as a future split entry if the generated code becomes large
- custom monoid, custom group, and custom descend predicate

Ask about operation family, aggregator, inverse availability, monotonicity for
descents, build source, coordinate compression, and query indexing.

### `/solvers/segtree`

Support the main segment-tree space:

- point set/add/update plus range aggregate
- range add, range assign, and combined lazy propagation
- sum, min, max, gcd, bitwise operations, and custom associative nodes
- custom node merge, neutral, leaf initialization, and lazy application
- first/last descent by predicate, threshold, or prefix condition
- max-subarray nodes with point updates
- iterative class mode for simple point-update trees
- recursive global mode for custom/lazy trees
- build from vector, generated empty tree, or fixed size expression
- named presets for the known point, lazy min/max, and max-subarray variants
- usage skeletons for query loops and update dispatch

Ask about aggregate, update family, lazy composition rules, descents, value
type, source vector, interval convention, and whether the user wants a custom
node escape hatch.

### `/solvers/segtree_beats`

Support beats-specific combinations:

- range `chmin`, `chmax`, and add
- range sum, min, max
- initial build from vector or empty tree
- problem skeletons for clamp/add/query workloads

Ask only about update/query subsets, value type, source vector, interval
convention, and whether to include all beats operations or a narrow class.

### `/solvers/sparse_table`

Support static idempotent range queries:

- min, max, gcd, bitwise and/or, and custom idempotent operation
- argmin/argmax with index tie-breaking
- inclusive and half-open query wrappers
- build from existing vector
- optional LCP/RMQ composition for suffix-array use

Ask about operation, value type, source vector, interval convention, and whether
the result should return a value, index, or pair.

### `/solvers/merge_sort_tree`

Support static range value-distribution queries:

- count `< x`, `<= x`, `== x`, and in `[lo, hi]`
- existence in a range
- kth by value through outer binary search or compressed values
- predecessor/successor in a range when practical
- coordinate-compressed and raw-value modes
- query-loop skeletons for common count problems

Ask about source vector, value type, count/existence/kth surface, compression,
and interval convention.

### `/solvers/implicit_treap`

Support sequence maintenance:

- insert, erase, split, merge, kth access
- range sum and custom aggregate
- reverse, add, assign, and other lazy tags as separate options
- cut/paste, rotate, and move-subsegment skeletons
- build from existing vector/string or repeated insertions
- deterministic or randomized priority choice if needed

Ask about sequence value type, aggregate, lazy tags, mutation operations, build
source, and whether generated helpers should expose raw split/merge.

### `/solvers/dsu`

Support the full DSU family from one prompt surface:

- connectivity, unite, same-set, component size, component count
- Kruskal skeleton
- component metadata hooks
- parity DSU for bipartiteness constraints
- weighted/potential DSU for equations of the form `dist[v] - dist[u] = w`
- snapshot and rollback
- offline dynamic connectivity over time intervals
- divide-and-conquer over time skeleton
- parity rollback variant
- query recording helpers

Ask first about DSU mode: plain, parity, weighted/potential, rollback, or
rollback plus offline dynamic connectivity. Then ask about metadata, component
count, Kruskal/query-loop scaffolding, manual snapshots, and whether to emit the
full offline time-decomposition scaffold. If `/solvers/rollback_dsu` remains as
a path, treat it as a preset entry into this same DSU surface rather than a
separate product surface.

### `/solvers/hld`

Support tree path/subtree decomposition:

- path segments and subtree segments
- vertex values vs edge values
- LCA and distance helpers
- compose with segment tree or Fenwick for path/subtree queries
- commutative and directional/noncommutative path aggregation
- query/update loop skeletons for tree path problems

Ask about vertex/edge convention, path vs subtree operations, chosen backing
structure, aggregate directionality, and indexing of tree input.

### `/solvers/lca`

Support binary-lifting tree queries:

- LCA, depth, parent, kth ancestor
- distance between nodes
- jump on path
- optional min/max/sum edge aggregates while lifting
- root choice and forest handling
- tree input skeleton

Ask about root, forest possibility, needed query helpers, edge metadata, and
whether to generate tree reading.

### `/solvers/ordered_set`

Support PBDS order statistics:

- insert, erase, kth, order_of_key
- multiset emulation with `(value, id)` pairs
- dynamic coordinate/rank queries
- lower/upper neighbor wrappers
- query-loop skeletons for rank/kth problems

Ask whether duplicates are needed, key type, pair-key policy, and which rank
wrappers to expose.

### `/solvers/gp_hash_table`

Support hash-table utility variants:

- integer keys with splitmix hash
- pair keys and tuple-like keys
- custom key hasher
- frequency map skeleton
- visited/set skeleton
- reserve and load-factor hints

Ask about key type, map vs set, pair/custom keys, expected size, and whether to
emit frequency-style wrappers.

### `/solvers/monotonic_stack`

Support stack-based nearest-element patterns:

- nearest smaller/greater to left/right
- strict vs non-strict comparisons
- contribution counting for subarray minimum/maximum
- histogram rectangle skeleton
- circular array handling
- span length output

Ask about direction, comparator, strictness, output shape, and whether to
generate contribution or nearest-index arrays.

### `/solvers/fast_allocator`

Support two explicit single-buffer bump allocation modes:

- raw C-style allocator over one static/global byte buffer
- no destructor calls and no individual frees
- typed `alloc<T>(count)` helper with alignment handling
- optional placement construction helper, still without destruction
- reset between test cases by rewinding the buffer pointer
- overflow policy: assert, abort, or throw
- STL-compatible allocator adapter backed by the same buffer
- vector/set/map aliases or usage examples using the STL adapter
- integration presets for treap nodes, graph edges, and other many-node snippets

Ask first about allocator mode: raw C-style buffer, STL allocator adapter, or
both. Then ask about buffer size, byte vs object-count sizing, alignment,
overflow behavior, reset policy, and whether to emit container aliases or
snippet-specific node allocation helpers. The current vector-owned arena shape
is not the target final surface.

## Graph And Connectivity Algorithms

### `/solvers/bfs`

Support unweighted traversal:

- single-source and multi-source distances
- path restoration
- visit order
- grid BFS with `grid4`/`grid8` dependency as a future composition
- component labeling for unweighted graphs
- shortest path tree output

Ask about graph source, directed/undirected edges, single vs multi-source,
path restoration, grid vs adjacency graph, and indexing.

### `/solvers/dijkstra`

Support non-negative shortest paths:

- single-source and multi-source distances
- path restoration
- custom distance type and infinity
- directed/undirected graph input
- sparse adjacency-list mode
- optional state-expanded graph skeleton

Ask about weight type, source count, path restoration, graph input shape,
indexing, and whether to include a priority-queue state type.

### `/solvers/toposort`

Support DAG order workflows:

- topological sort
- cycle detection
- order validation
- DAG DP skeleton
- prerequisite scheduling skeleton
- directed graph reader

Ask whether cycles should be reported, whether to emit DP scaffolding, and
which graph variable/input style to use.

### `/solvers/kosaraju`

Support SCC workflows:

- component assignment
- component list
- condensation DAG
- topological order of components
- 2-SAT dependency handoff where relevant
- graph reader for directed edges

Ask about needed outputs, condensation graph, component ordering, and indexing.

### `/solvers/maxflow_dinic`

Support max-flow workflows:

- directed edge input
- max flow only
- min cut extraction
- edge access for used flow
- reset/reuse graph
- bipartite matching via flow as a usage skeleton, though `/solvers/kuhn` stays
  the lighter option

Ask about capacity type, source/sink names, min-cut need, flow reconstruction,
and whether to generate an input reader/query skeleton.

### `/solvers/mincost_maxflow`

Support min-cost flow workflows:

- fixed-flow min cost
- max-flow with min cost
- negative costs with potentials
- graph and potential access
- assignment/transportation style input skeletons
- impossible-flow reporting

Ask about capacity/cost types, fixed required flow, negative edges, source/sink,
and result shape.

### `/solvers/kuhn`

Support bipartite matching:

- maximum cardinality matching
- left and right match arrays
- minimum vertex cover
- input by left adjacency or edge list
- 1-index to 0-index conversion
- optional named partitions

Ask about partition sizes, input style, vertex-cover need, and result outputs.

### `/solvers/hungarian`

Support assignment problems:

- minimize and maximize
- square and rectangular matrices
- existing matrix or generated matrix input
- forbidden assignment sentinel as a future extension
- return value, matching vector, or both

Ask about optimization direction, dimensions, cost type, matrix source, and
whether the output should include matching reconstruction.

### `/solvers/twosat`

Support implication-graph modeling:

- `or`, implication, xor, equality, force true/false
- at-most-one constraints
- assignment extraction
- component access for debugging or extra reasoning
- variable naming helper for problem statements
- common modeling skeletons for choose-one, conflict pairs, and binary search
  feasibility

Ask about helper constraints needed, assignment output, component access, and
whether to emit modeling helpers or only the core class.

## String Algorithms

### `/solvers/poly_hash`

Support rolling-hash workflows:

- substring equality
- reverse/palindrome queries
- concatenating hashes
- LCP by binary search
- string and integer-vector sources
- custom mod/base constants
- collision policy: single vs double hash if a future lighter mode is added

Ask about source kind/name, constants, reverse support, LCP support, and output
helper names.

### `/solvers/suffix_array`

Support suffix-array workflows:

- suffix array
- rank array
- LCP array
- stripped suffix array for string suffixes only
- LCP RMQ composition
- substring compare and pattern search as future wrappers
- kth suffix / distinct substring count skeletons

Ask about source string, needed arrays, LCP RMQ, pattern-search wrappers, and
whether to emit common counting formulas.

## Math And Algebra

### `/solvers/modint`

Support modular arithmetic modes:

- static modulus
- dynamic modulus
- both classes
- common modulus constants
- inverse through extended gcd
- power helpers
- factorial/combinatorics precompute as a future dependent recipe

Ask about modulus expression, static vs dynamic, inverse needs, and whether to
emit combinatorics scaffolding.

### `/bricks/modpow`

Support small modular-power insertion:

- binary exponentiation with explicit modulus argument
- captured/global modulus constant
- multiplication type override for overflow safety
- negative exponent only when inverse support is selected

Ask about base/exponent/mod names only if used as an interactive brick.

### `/solvers/linear_sieve`

Support prime and factorization workflows:

- prime list
- lowest prime factor table
- factorization of one value or many values
- divisor generation and Euler phi/mobius as future extensions
- precompute bound from existing `n`, `MAXN`, or custom expression

Ask about bound, required outputs, factorization helpers, and number-theory
extras.

### `/solvers/fft_ntt`

Support convolution workflows:

- complex FFT
- modular NTT
- convolution wrappers or transform-only helpers
- 998244353 default
- custom modulus/root
- polynomial multiplication skeleton
- big-integer/string multiplication as future usage skeleton

Ask about transform family, modulus/root, coefficient type, and whether
convolution wrappers should be emitted.

### `/solvers/berlekamp_massey`

Support linear recurrence workflows:

- minimal recurrence discovery
- kth term from recurrence
- one-shot kth term from prefix sequence
- modulus/value type integration, especially with `modint`
- multiple-query kth term as a future optimization surface

Ask about value type, sequence variable, index type, desired helper level, and
modular arithmetic assumptions.

## Offline And Query Algorithms

### `/solvers/mo`

Support offline range-query workflows:

- half-open and inclusive range query conventions
- add/remove callbacks
- answer type and answer array
- frequency-count examples
- distinct count, pair count, and mode-like skeletons as future examples
- block size policy

Ask about interval convention, answer type, query input shape, add/remove
state, and output order.

## Geometry

### `/solvers/geometry`

Support 2D geometry basics:

- point/vector operations
- orientation and cross/dot products
- segment intersection
- distance and projection helpers as future additions
- angle sort
- convex hull
- integer vs floating-point coordinates

Ask about coordinate type, exact vs floating comparisons, needed helper groups,
and hull/intersection outputs.

### `/solvers/halfplane_intersection`

Support convex linear constraint workflows:

- half-plane intersection
- convex polygon output
- area or feasibility-only result as future wrappers
- floating precision configuration
- dependency on base geometry helpers

Ask about coordinate type, epsilon, output shape, and whether only feasibility
or the resulting polygon is needed.

## Bricks And Local Scaffolds

### `/bricks/read_vector`, `/bricks/read_array`, `/bricks/read_vector_ref`

Support input surfaces:

- declare and read a new vector/array
- read into existing storage
- value type and size expression
- nested vectors as a future extension
- optional index/value transformation while reading

Ask about declaration vs existing target, name, type, size, and transformation.

### `/bricks/read_graph_undirected`, `/bricks/read_tree_edges`

Support graph input:

- directed and undirected graph modes
- weighted and unweighted edges
- adjacency list or edge list
- tree edge count defaulting to `n - 1`
- decrement endpoints
- edge id storage as a future option

Ask about graph name, `n`/`m`, indexing, weights, directedness, and storage
shape.

### `/bricks/compress_unique`

Support coordinate compression:

- compress existing vector
- collect values from queries first
- rewrite source values or expose `get_id`
- preserve original values for reverse lookup
- lower-bound and exact-match wrappers

Ask about source values, rewrite policy, reverse lookup, and helper names.

### `/bricks/decrement_indices`

Support index adjustment:

- decrement one variable, pair, vector, edge list, or query endpoints
- preserve inclusive/half-open intervals
- no-op guard when already 0-indexed as a future interactive nicety

Ask about target variables and whether endpoints are both indices.

### `/bricks/static_rsq`, `/bricks/prefix_2d`

Support prefix sums:

- 1D static range sum
- 2D rectangle sum
- inclusive and half-open wrappers
- value type selection
- build from existing vector/grid

Ask about source, value type, interval convention, and wrapper names.

### `/bricks/bfs_dist`, `/bricks/dfs_tree`

Support local traversal scaffolds:

- BFS distance array
- DFS parent/depth/subtree/order/tin/tout
- recursive or iterative DFS
- graph reuse
- root choice and forest handling

Ask about graph name, root(s), outputs, recursion policy, and indexing.

### `/bricks/grid4`

Support grid movement:

- 4-neighbor and 8-neighbor deltas
- bounds lambda
- obstacle predicate
- coordinate type and row/column names

Ask about dimensions, movement type, and obstacle handling if made dynamic.

### `/bricks/lower_bound_l_false_r_true`

Support binary-search scaffolds:

- first true
- last false
- integer and long long bounds
- answer-not-found policy
- custom predicate name

Ask about bounds, predicate polarity, type, and returned value.

### `/bricks/bitmask_loop`

Support subset iteration:

- all masks
- submasks of a mask
- proper non-empty submasks
- supersets within universe
- DP skeleton as a future option

Ask about mask variable, bit count, and loop family.

### `/bricks/set_utils`

Treat the current `/solvers/set_utils` entry as a candidate brick, because these
helpers are usually cursor-local ordered-container scaffolds rather than a
global data structure:

- predecessor and successor
- erase-safe iteration
- interval-set style neighbor lookup
- map lower/upper-bound helpers
- mex or gap tracking skeletons as future variants

Ask about set vs map, key type, neighbor operations, and whether endpoints are
sentinels or real values.

### `/bricks/print_vector`

Support output helpers:

- vector with spaces
- one per line
- custom separator
- transform before printing
- nested vector as future extension

Ask about vector name and separator if made dynamic.

## Migration Batches

### Batch 1: Surface Docs And Metadata

- Add application metadata to catalog entries without changing generation.
- Keep the metadata descriptive and easy to revise.
- Update tests to validate metadata shape only after the field names settle.

### Batch 2: Existing Dynamic Generators

Start with generators that already have rendering options:

- `/solvers/fenwick`
- `/solvers/segtree`
- `/solvers/sparse_table`
- `/solvers/merge_sort_tree`
- `/solvers/implicit_treap`
- `/solvers/poly_hash`
- `/solvers/suffix_array`
- `/solvers/fft_ntt`
- `/solvers/twosat`

The first goal is better prompts and narrower generated output, not new
algorithm code.

### Batch 3: Static High-Surface Solvers

Promote static snippets with many natural modes:

- `/solvers/hld`
- `/solvers/dijkstra`
- `/solvers/monotonic_stack`
- `/solvers/mo`
- `/solvers/ordered_set`
- `/solvers/gp_hash_table`
- `/solvers/geometry`

### Batch 4: Composition Recipes

Add optional usage skeletons that compose structures:

- HLD plus segment tree or Fenwick
- suffix array plus sparse table
- DSU rollback mode plus offline time decomposition
- coordinate compression plus Fenwick or ordered set
- graph reader plus BFS, Dijkstra, SCC, or flow

These should remain structure-triggered. For example, from `/solvers/hld`, ask
which backing data structure to compose.

### Batch 5: Custom Escape Hatches

For broad structures, support user-supplied logic:

- Fenwick custom monoid/group/descend
- segment tree custom node/lazy tag
- sparse table custom idempotent operation
- implicit treap custom aggregate/lazy tag
- Mo custom add/remove/current-answer block

Every custom path should still generate a compiling skeleton with clear TODO
slots.

## Definition Of Done Per Surface

- The catalog records the intended application families.
- The prompt asks only structure-specific questions.
- The renderer emits the narrowest helper that satisfies those answers.
- Generated usage code matches the selected mode.
- Correctness-sensitive choices are explicit in the prompt or generated TODO.
- At least one extension test covers a common mode and one covers custom or
  collision behavior.
- Existing known variants are reproducible through the dynamic surface.

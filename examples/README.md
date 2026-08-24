# Runnable template examples

This directory is generated from the canonical algorithm templates and the small
drivers in `tools/solver-examples`. Each driver executes real algorithm
operations so `xeppelin edulcni` receives visualization frames.

Run an example from its directory:

```sh
cd examples/templates/bfs
xeppelin edulcni main
```

The empty `input.in` is intentional: examples use small deterministic data in
their drivers. The program writes `ok` to `output.out` after its assertions
pass. Each driver adds scenario start/completion frames around the algorithm's
own operation-level visualization steps. Generated binaries and runtime output
are ignored by Git.

Regenerate or check the committed files from `extension/`:

```sh
npm run generate:examples
npm run check:examples
npm run test:examples
npm run test:examples:visualization
```

PBDS examples require GNU GCC. On macOS, pass a Homebrew compiler explicitly,
for example `xeppelin edulcni main --compiler g++-15`.

| Solver | Demo | Visualization | Requirement | Scenario |
| --- | --- | --- | --- | --- |
| [aliens_trick](templates/aliens_trick/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/aliens_trick/) | automatic | portable C++17 | Recover the optimum for an exact count through lambda search. |
| [berlekamp_massey](templates/berlekamp_massey/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/berlekamp_massey/) | automatic | portable C++17 | Recover the Fibonacci recurrence and evaluate a later term. |
| [bfs](templates/bfs/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/bfs/) | automatic | portable C++17 | Explore an unweighted graph and restore a shortest path. |
| [convex_hull_trick](templates/convex_hull_trick/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/convex_hull_trick/) | automatic | portable C++17 | Query minima from decreasing-slope lines at increasing x coordinates. |
| [digit_dp](templates/digit_dp/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/digit_dp/) | automatic | portable C++17 | Count values whose decimal digit sum is divisible by three. |
| [dijkstra](templates/dijkstra/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/dijkstra/) | automatic | portable C++17 | Trace shortest paths in a small weighted graph. |
| [divide_conquer_dp](templates/divide_conquer_dp/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/divide_conquer_dp/) | automatic | portable C++17 | Optimize a partition DP with monotone split points. |
| [dp_knapsack](templates/dp_knapsack/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/dp_knapsack/) | automatic | portable C++17 | Compare zero-one and unbounded one-dimensional knapsack. |
| [dsu](templates/dsu/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/dsu/) | automatic | portable C++17 | Merge components and inspect the resulting parent forest. |
| [fast_allocator](templates/fast_allocator/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/fast_allocator/) | diagnostic | portable C++17 | Allocate standard containers from a resettable arena. |
| [fenwick](templates/fenwick/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/fenwick/) | automatic | portable C++17 | Accumulate point additions and query prefix and range sums. |
| [fft_ntt](templates/fft_ntt/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/fft_ntt/) | automatic | portable C++17 | Multiply two integer polynomials with the NTT. |
| [floor_sum](templates/floor_sum/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/floor_sum/) | manual | portable C++17 | Evaluate signed floor sums and lattice-point counts. |
| [fwt_convolution](templates/fwt_convolution/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/fwt_convolution/) | automatic | portable C++17 | Compute an XOR convolution with the Walsh-Hadamard transform. |
| [geometry](templates/geometry/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/geometry/) | automatic | portable C++17 | Construct a convex hull from a small point set. |
| [gp_hash_table](templates/gp_hash_table/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/gp_hash_table/) | manual | pbds | Use hardened hashes with GNU PBDS hash tables. |
| [halfplane_intersection](templates/halfplane_intersection/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/halfplane_intersection/) | automatic | portable C++17 | Intersect four half-planes into a bounded polygon. |
| [hld](templates/hld/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/hld/) | automatic | portable C++17 | Decompose tree paths into contiguous heavy-light segments. |
| [hungarian](templates/hungarian/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/hungarian/) | automatic | portable C++17 | Compute a minimum-cost assignment in a square matrix. |
| [implicit_treap](templates/implicit_treap/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/implicit_treap/) | automatic | portable C++17 | Edit and aggregate a sequence represented by an implicit treap. |
| [knuth_dp](templates/knuth_dp/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/knuth_dp/) | automatic | portable C++17 | Optimize adjacent interval merging with Knuth's bounds. |
| [kosaraju](templates/kosaraju/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/kosaraju/) | automatic | portable C++17 | Find strongly connected components and their condensation graph. |
| [kruskal](templates/kruskal/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/kruskal/) | automatic | portable C++17 | Build a minimum spanning tree and recover its selected edges. |
| [kuhn](templates/kuhn/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/kuhn/) | automatic | portable C++17 | Find a maximum matching in a bipartite graph. |
| [lca](templates/lca/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/lca/) | automatic | portable C++17 | Build binary lifting tables and answer ancestor queries. |
| [li_chao_tree](templates/li_chao_tree/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/li_chao_tree/) | automatic | portable C++17 | Insert arbitrary lines and query their minimum on an integer domain. |
| [linear_sieve](templates/linear_sieve/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/linear_sieve/) | automatic | portable C++17 | Generate primes and factor an integer with a linear sieve. |
| [lis](templates/lis/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/lis/) | automatic | portable C++17 | Reconstruct strict and nondecreasing longest subsequences. |
| [lower_bound_flow](templates/lower_bound_flow/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/lower_bound_flow/) | manual | portable C++17 | Find a feasible circulation with lower and upper edge bounds. |
| [maxflow_dinic](templates/maxflow_dinic/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/maxflow_dinic/) | automatic | portable C++17 | Find the maximum flow through a small capacitated network. |
| [merge_sort_tree](templates/merge_sort_tree/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/merge_sort_tree/) | automatic | portable C++17 | Count values in subarray ranges with a merge-sort tree. |
| [mincost_maxflow](templates/mincost_maxflow/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/mincost_maxflow/) | automatic | portable C++17 | Send maximum flow while minimizing its total edge cost. |
| [mo](templates/mo/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/mo/) | automatic | portable C++17 | Answer offline range-distinct queries with Mo's ordering. |
| [modint](templates/modint/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/modint/) | automatic | portable C++17 | Perform modular arithmetic, exponentiation, and inversion. |
| [monotone_queue_dp](templates/monotone_queue_dp/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/monotone_queue_dp/) | automatic | portable C++17 | Optimize a sliding-window minimum transition with a deque. |
| [monotonic_stack](templates/monotonic_stack/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/monotonic_stack/) | automatic | portable C++17 | Find the nearest smaller and greater elements on both sides. |
| [offline_dynamic_connectivity](templates/offline_dynamic_connectivity/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/offline_dynamic_connectivity/) | automatic | portable C++17 | Answer connectivity queries across edge additions and removals. |
| [ordered_set](templates/ordered_set/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/ordered_set/) | automatic | pbds | Query ranks and k-th elements with a GNU PBDS ordered set. |
| [poly_hash](templates/poly_hash/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/poly_hash/) | automatic | portable C++17 | Compare substrings and compose polynomial hashes. |
| [potential_dsu](templates/potential_dsu/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/potential_dsu/) | manual | portable C++17 | Maintain relative potentials and reject inconsistent constraints. |
| [rollback_dsu](templates/rollback_dsu/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/rollback_dsu/) | automatic | portable C++17 | Merge components, then restore a previous DSU snapshot. |
| [segtree](templates/segtree/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/segtree/) | automatic | portable C++17 | Point updates and inclusive range sums in the standard segment-tree scenario. |
| [segtree_beats](templates/segtree_beats/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/segtree_beats/) | automatic | portable C++17 | Apply range chmin, chmax, and add updates with aggregate queries. |
| [set_utils](templates/set_utils/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/set_utils/) | snapshot | portable C++17 | Safely inspect neighboring values in ordered containers. |
| [sos_dp](templates/sos_dp/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/sos_dp/) | automatic | portable C++17 | Apply subset zeta, Mobius, and superset zeta transforms. |
| [sparse_table](templates/sparse_table/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/sparse_table/) | automatic | portable C++17 | Build a sparse table and answer immutable range minima. |
| [substring_dp](templates/substring_dp/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/substring_dp/) | automatic | portable C++17 | Partition a string into palindromes and solve palindromic subsequence DP. |
| [suffix_array](templates/suffix_array/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/suffix_array/) | automatic | portable C++17 | Build the suffix array and LCP array for a short string. |
| [suffix_automaton](templates/suffix_automaton/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/suffix_automaton/) | manual | portable C++17 | Count distinct substrings and occurrences with a suffix automaton. |
| [test_generators](templates/test_generators/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/test_generators/) | snapshot | portable C++17 | Generate deterministic arrays, permutations, masks, trees, and graphs. |
| [toposort](templates/toposort/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/toposort/) | automatic | portable C++17 | Topologically order a directed acyclic graph. |
| [tree_hash](templates/tree_hash/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/tree_hash/) | automatic | portable C++17 | Compare canonical hashes of two isomorphic unrooted trees. |
| [turtle_dp](templates/turtle_dp/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/turtle_dp/) | automatic | portable C++17 | Count right-down grid paths and reconstruct minimum and maximum paths. |
| [twosat](templates/twosat/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/twosat/) | automatic | portable C++17 | Solve a small implication system and inspect its assignment. |
| [wavelet_matrix](templates/wavelet_matrix/main.cpp) | [open](https://kik0s.github.io/edulcni/examples/wavelet_matrix/) | manual | portable C++17 | Query order statistics, frequencies, and prefix sums in subarrays. |

# Runnable solver examples

This directory is generated from the canonical solver templates and the small
drivers in `tools/solver-examples`. Each driver executes real algorithm
operations so `xeppelin edulcni` receives visualization frames.

Run an example from its directory:

```sh
cd examples/solvers/bfs
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

| Solver | Visualization | Requirement | Scenario |
| --- | --- | --- | --- |
| [aliens_trick](solvers/aliens_trick/main.cpp) | automatic | portable C++17 | Recover the optimum for an exact count through lambda search. |
| [berlekamp_massey](solvers/berlekamp_massey/main.cpp) | automatic | portable C++17 | Recover the Fibonacci recurrence and evaluate a later term. |
| [bfs](solvers/bfs/main.cpp) | automatic | portable C++17 | Explore an unweighted graph and restore a shortest path. |
| [convex_hull_trick](solvers/convex_hull_trick/main.cpp) | automatic | portable C++17 | Query minima from decreasing-slope lines at increasing x coordinates. |
| [digit_dp](solvers/digit_dp/main.cpp) | automatic | portable C++17 | Count values whose decimal digit sum is divisible by three. |
| [dijkstra](solvers/dijkstra/main.cpp) | automatic | portable C++17 | Trace shortest paths in a small weighted graph. |
| [divide_conquer_dp](solvers/divide_conquer_dp/main.cpp) | automatic | portable C++17 | Optimize a partition DP with monotone split points. |
| [dp_knapsack](solvers/dp_knapsack/main.cpp) | automatic | portable C++17 | Compare zero-one and unbounded one-dimensional knapsack. |
| [dsu](solvers/dsu/main.cpp) | automatic | portable C++17 | Merge components and inspect the resulting parent forest. |
| [fast_allocator](solvers/fast_allocator/main.cpp) | diagnostic | portable C++17 | Allocate standard containers from a resettable arena. |
| [fenwick](solvers/fenwick/main.cpp) | automatic | portable C++17 | Accumulate point additions and query prefix and range sums. |
| [fft_ntt](solvers/fft_ntt/main.cpp) | automatic | portable C++17 | Multiply two integer polynomials with the NTT. |
| [fwt_convolution](solvers/fwt_convolution/main.cpp) | automatic | portable C++17 | Compute an XOR convolution with the Walsh-Hadamard transform. |
| [geometry](solvers/geometry/main.cpp) | automatic | portable C++17 | Intersect segments and construct a convex hull. |
| [gp_hash_table](solvers/gp_hash_table/main.cpp) | manual | pbds | Use hardened hashes with GNU PBDS hash tables. |
| [halfplane_intersection](solvers/halfplane_intersection/main.cpp) | automatic | portable C++17 | Intersect four half-planes into a bounded polygon. |
| [hld](solvers/hld/main.cpp) | automatic | portable C++17 | Decompose tree paths into contiguous heavy-light segments. |
| [hungarian](solvers/hungarian/main.cpp) | automatic | portable C++17 | Compute a minimum-cost assignment in a square matrix. |
| [implicit_treap](solvers/implicit_treap/main.cpp) | automatic | portable C++17 | Edit and aggregate a sequence represented by an implicit treap. |
| [knuth_dp](solvers/knuth_dp/main.cpp) | automatic | portable C++17 | Optimize adjacent interval merging with Knuth's bounds. |
| [kosaraju](solvers/kosaraju/main.cpp) | automatic | portable C++17 | Find strongly connected components and their condensation graph. |
| [kuhn](solvers/kuhn/main.cpp) | automatic | portable C++17 | Find a maximum matching in a bipartite graph. |
| [lca](solvers/lca/main.cpp) | automatic | portable C++17 | Build binary lifting tables and answer ancestor queries. |
| [li_chao_tree](solvers/li_chao_tree/main.cpp) | automatic | portable C++17 | Insert arbitrary lines and query their minimum on an integer domain. |
| [linear_sieve](solvers/linear_sieve/main.cpp) | automatic | portable C++17 | Generate primes and factor an integer with a linear sieve. |
| [lis](solvers/lis/main.cpp) | automatic | portable C++17 | Reconstruct strict and nondecreasing longest subsequences. |
| [maxflow_dinic](solvers/maxflow_dinic/main.cpp) | automatic | portable C++17 | Find the maximum flow through a small capacitated network. |
| [merge_sort_tree](solvers/merge_sort_tree/main.cpp) | automatic | portable C++17 | Count values in subarray ranges with a merge-sort tree. |
| [mincost_maxflow](solvers/mincost_maxflow/main.cpp) | automatic | portable C++17 | Send maximum flow while minimizing its total edge cost. |
| [mo](solvers/mo/main.cpp) | automatic | portable C++17 | Answer offline range-distinct queries with Mo's ordering. |
| [modint](solvers/modint/main.cpp) | automatic | portable C++17 | Perform modular arithmetic, exponentiation, and inversion. |
| [monotone_queue_dp](solvers/monotone_queue_dp/main.cpp) | automatic | portable C++17 | Optimize a sliding-window minimum transition with a deque. |
| [monotonic_stack](solvers/monotonic_stack/main.cpp) | automatic | portable C++17 | Find the nearest smaller and greater elements on both sides. |
| [offline_dynamic_connectivity](solvers/offline_dynamic_connectivity/main.cpp) | automatic | portable C++17 | Answer connectivity queries across edge additions and removals. |
| [ordered_set](solvers/ordered_set/main.cpp) | automatic | pbds | Query ranks and k-th elements with a GNU PBDS ordered set. |
| [poly_hash](solvers/poly_hash/main.cpp) | automatic | portable C++17 | Compare substrings and compose polynomial hashes. |
| [rollback_dsu](solvers/rollback_dsu/main.cpp) | automatic | portable C++17 | Merge components, then restore a previous DSU snapshot. |
| [segtree](solvers/segtree/main.cpp) | automatic | portable C++17 | Point updates and range sums in an iterative segment tree. |
| [segtree_beats](solvers/segtree_beats/main.cpp) | automatic | portable C++17 | Apply range chmin, chmax, and add updates with aggregate queries. |
| [set_utils](solvers/set_utils/main.cpp) | snapshot | portable C++17 | Safely inspect neighboring values in ordered containers. |
| [sos_dp](solvers/sos_dp/main.cpp) | automatic | portable C++17 | Apply subset zeta, Mobius, and superset zeta transforms. |
| [sparse_table](solvers/sparse_table/main.cpp) | automatic | portable C++17 | Build a sparse table and answer immutable range minima. |
| [substring_dp](solvers/substring_dp/main.cpp) | automatic | portable C++17 | Partition a string into palindromes and solve palindromic subsequence DP. |
| [suffix_array](solvers/suffix_array/main.cpp) | automatic | portable C++17 | Build the suffix array and LCP array for a short string. |
| [test_generators](solvers/test_generators/main.cpp) | snapshot | portable C++17 | Generate deterministic arrays, permutations, masks, trees, and graphs. |
| [toposort](solvers/toposort/main.cpp) | automatic | portable C++17 | Topologically order a directed acyclic graph. |
| [tree_hash](solvers/tree_hash/main.cpp) | automatic | portable C++17 | Compare canonical hashes of two isomorphic unrooted trees. |
| [turtle_dp](solvers/turtle_dp/main.cpp) | automatic | portable C++17 | Count right-down grid paths and reconstruct minimum and maximum paths. |
| [twosat](solvers/twosat/main.cpp) | automatic | portable C++17 | Solve a small implication system and inspect its assignment. |

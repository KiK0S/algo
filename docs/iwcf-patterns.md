# iwcf Pattern Scan

- Root: `/home/kikos/dev/iwcf`
- C++ files scanned: `2254`
- Excluded path parts: `runs`, `artifacts`
- Generated from the same regex categories now codified in `tools/mine_iwcf_patterns.py`.

## Highest-Signal Patterns

| Pattern | Files | Candidate | Kind | Notes |
| --- | ---: | --- | --- | --- |
| `personal_template` | 1828 | `/bricks/base_template` | brick | Your active template family dominates recent files. |
| `solve_loop_while_cin` | 1846 | `/bricks/base_template` | brick | Most files use `while (cin >> ...) solve()`. |
| `randomized` | 1287 | `/bricks/base_template` | brick | Mostly `mt19937 rng(time(0))` from the template. |
| `multi_test_t` | 1064 | `/bricks/base_template` | brick | Usually present as commented alternative. |
| `decrement_indices` | 342 | `/bricks/decrement_indices` | brick | Common after reading graph/tree edges. |
| `stress_harness` | 222 | `/bricks/stress_harness` | brick | Includes `assert`, brute/stress files, and random tests. |
| `dfs_recursive` | 221 | `/bricks/dfs_tree` | brick | Usually short problem-specific tree/graph DFS. |
| `bitmask_dp` | 138 | `/bricks/bitmask_loop` | brick | Common enough to warrant loop skeletons, not a solver. |
| `binary_search_l_false` | 107 | `/bricks/lower_bound_l_false_r_true` | brick | The `while (l + 1 < r)` idiom repeats across tasks. |
| `grid_dirs` | 59 | `/bricks/grid4` | brick | Direction arrays and bounds checks repeat. |
| `bfs_queue` | 56 | `/bricks/bfs_dist` | brick | Mostly lightweight BFS, often easier as a brick. |
| `prefix_sum` | 50 | `/bricks/static_rsq` | brick | Static range sum appears as tiny arrays/functions. |
| `fenwick_inline` | 50 | `/bricks/fenwick_sum` | brick | Inline Fenwick is more common than inserting the generic header. |
| `dsu_inline` | 44 | `/bricks/dsu_short` | brick | Short DSU is common; rollback DSU should be a solver. |
| `coordinate_compress` | 40 | `/bricks/compress_unique` | brick | Mostly `sort`, `unique`, `lower_bound`. |
| `segtree_inline` | 32 | `/solvers/segtree_point_update` | solver | Enough variation that specialized solvers are better than one huge file. |
| `ordered_set_pbds` | 22 | `/solvers/ordered_set` | solver | Existing `ordered_set` can remain isolated. |
| `modpow` | 14 | `/bricks/modpow` | brick | Short enough to retype/correct. |
| `dijkstra_pq` | 12 | `/solvers/dijkstra` | solver | Not in the first requested catalog, but worth adding later. |

## Initial Catalog Decision

- Bricks should stay terse, assume the active contest template, and use your normal names (`vi`, `pii`, `all`, `forn`, `F`, `S`).
- Solvers should paste as complete units and must not require inserting another local header first.
- `segtree.hpp` should be split by problem shape: point update, lazy add/min, merge-sort tree, max-subarray, and beats.
- `twosat` and `fft_ntt` are solver-style files; they should be self-contained instead of depending on `kosaraju.hpp` or `modint.hpp`.

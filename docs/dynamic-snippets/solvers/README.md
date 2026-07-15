# Solver Migration Index

Each file in this directory is a work packet for one future migration agent. Agents should read [../01-agent-contract.md](../01-agent-contract.md) before acting.

Top-level `lib/*.hpp` compatibility headers are handled by [../03-legacy-cleanup.md](../03-legacy-cleanup.md). Solver fallback means a pasteable file under `lib/solvers/`, not keeping the old top-level header indefinitely.

## How To Pick Work

Start with the first useful `todo` packet in the suggested order and migrate it
completely. The packet's assumptions and the settled defaults are enough to
proceed unless a listed choice is still a genuine blocker after reading the
source and tests.

## Suggested Order

Completed: `berlekamp_massey.md`, `static_rmq.md`, `dsu.md`,
`lca_binary_lifting.md`, `bfs.md`, `suffix_array.md`, and
`segtree_point_update.md`, `segtree_lazy_add_min.md`, and
`segtree_beats.md`, `rollback_dsu.md`, `implicit_treap.md`, and
`fft_ntt.md`, `linear_sieve.md`, `merge_sort_tree.md`, `maxflow_dinic.md`,
`mincost_maxflow.md`, `hungarian.md`, `kuhn.md`, `twosat.md`,
`fenwick.md`, and
`poly_hash.md`, `modint.md`, `monotonic_stack.md`, `set_utils.md`,
`fast_allocator.md`, `hld.md`,
`mo.md`, `geometry.md`, `halfplane_intersection.md`,
`segtree_lazy_minmax.md`, and `segtree_max_subarray.md`.

No solver packet is currently queued in this index; continue from
[../03-legacy-cleanup.md](../03-legacy-cleanup.md) or add the next solver
packet before migrating another top-level header.

## Packets

Status key: `done` means the solver already has the complete dynamic migration
shape and the next agent should choose another packet.

| Solver source | Status | Plan |
| --- | --- | --- |
| `lib/solvers/berlekamp_massey.hpp` | done | [berlekamp_massey.md](./berlekamp_massey.md) |
| `lib/solvers/bfs.hpp` | done | [bfs.md](./bfs.md) |
| `lib/solvers/dijkstra.hpp` | done | [dijkstra.md](./dijkstra.md) |
| `lib/solvers/dsu.hpp` | done | [dsu.md](./dsu.md) |
| `lib/solvers/fenwick.hpp` | done | [fenwick.md](./fenwick.md) |
| `lib/solvers/fft_ntt.hpp` | done | [fft_ntt.md](./fft_ntt.md) |
| `lib/solvers/fast_allocator.hpp` | done | [fast_allocator.md](./fast_allocator.md) |
| `lib/solvers/geometry.hpp` | done | [geometry.md](./geometry.md) |
| `lib/solvers/gp_hash_table.hpp` | done | [gp_hash_table.md](./gp_hash_table.md) |
| `lib/solvers/halfplane_intersection.hpp` | done | [halfplane_intersection.md](./halfplane_intersection.md) |
| `lib/solvers/hungarian.hpp` | done | [hungarian.md](./hungarian.md) |
| `lib/solvers/hld.hpp` | done | [hld.md](./hld.md) |
| `lib/solvers/implicit_treap.hpp` | done | [implicit_treap.md](./implicit_treap.md) |
| `lib/solvers/kosaraju.hpp` | done | [kosaraju.md](./kosaraju.md) |
| `lib/solvers/kuhn.hpp` | done | [kuhn.md](./kuhn.md) |
| `lib/solvers/lca_binary_lifting.hpp` | done | [lca_binary_lifting.md](./lca_binary_lifting.md) |
| `lib/solvers/linear_sieve.hpp` | done | [linear_sieve.md](./linear_sieve.md) |
| `lib/solvers/maxflow_dinic.hpp` | done | [maxflow_dinic.md](./maxflow_dinic.md) |
| `lib/solvers/merge_sort_tree.hpp` | done | [merge_sort_tree.md](./merge_sort_tree.md) |
| `lib/solvers/modint.hpp` | done | [modint.md](./modint.md) |
| `lib/solvers/monotonic_stack.hpp` | done | [monotonic_stack.md](./monotonic_stack.md) |
| `lib/solvers/mo.hpp` | done | [mo.md](./mo.md) |
| `lib/solvers/mincost_maxflow.hpp` | done | [mincost_maxflow.md](./mincost_maxflow.md) |
| `lib/solvers/ordered_set.hpp` | done | [ordered_set.md](./ordered_set.md) |
| `lib/solvers/poly_hash.hpp` | done | [poly_hash.md](./poly_hash.md) |
| `lib/solvers/rollback_dsu.hpp` | done | [rollback_dsu.md](./rollback_dsu.md) |
| `/solvers/segtree` | active smart pilot | [segtree.md](./segtree.md) |
| `lib/solvers/segtree_beats.hpp` | done | [segtree_beats.md](./segtree_beats.md) |
| `lib/solvers/set_utils.hpp` | done | [set_utils.md](./set_utils.md) |
| `lib/solvers/segtree_lazy_add_min.hpp` | done | [segtree_lazy_add_min.md](./segtree_lazy_add_min.md) |
| `lib/solvers/segtree_lazy_minmax.hpp` | done | [segtree_lazy_minmax.md](./segtree_lazy_minmax.md) |
| `lib/solvers/segtree_max_subarray.hpp` | done | [segtree_max_subarray.md](./segtree_max_subarray.md) |
| `lib/solvers/segtree_point_update.hpp` | done | [segtree_point_update.md](./segtree_point_update.md) |
| `lib/solvers/sparse_table.hpp` | done | [static_rmq.md](./static_rmq.md) |
| `lib/solvers/suffix_array.hpp` | done | [suffix_array.md](./suffix_array.md) |
| `lib/solvers/toposort.hpp` | done | [toposort.md](./toposort.md) |
| `lib/solvers/twosat.hpp` | done | [twosat.md](./twosat.md) |

# Solver Migration Index

Each file in this directory is a work packet for one future migration agent. Agents should read [../01-agent-contract.md](../01-agent-contract.md) before acting.

Top-level `lib/*.hpp` compatibility headers are handled by [../03-legacy-cleanup.md](../03-legacy-cleanup.md). Solver fallback means a pasteable file under `lib/solvers/`, not keeping the old top-level header indefinitely.

## How To Pick Work

Start with the first useful `todo` packet in the suggested order and migrate it
completely. The packet's assumptions and the settled defaults are enough to
proceed unless a listed choice is still a genuine blocker after reading the
source and tests.

## Suggested Order

Completed: `berlekamp_massey.md`, `static_rmq.md`, `dsu.md`, and
`lca_binary_lifting.md`.

1. `suffix_array.md`: exercises optional outputs and optional LCP RMQ dependency.
2. `segtree_point_update.md`, `segtree_lazy_add_min.md`, `segtree_beats.md`: finishes segment-tree family alignment.
3. `rollback_dsu.md`, `implicit_treap.md`, `merge_sort_tree.md`: remaining structures.
4. `maxflow_dinic.md`, `mincost_maxflow.md`, `kuhn.md`, `hungarian.md`, `twosat.md`: graph and matching style solvers.
5. `fft_ntt.md`, `poly_hash.md`: algebra and string helpers with constants/type choices.

## Packets

Status key: `done` means the solver already has the complete dynamic migration
shape and the next agent should choose another packet.

| Solver source | Status | Plan |
| --- | --- | --- |
| `lib/solvers/berlekamp_massey.hpp` | done | [berlekamp_massey.md](./berlekamp_massey.md) |
| `lib/solvers/dsu.hpp` | done | [dsu.md](./dsu.md) |
| `lib/solvers/fft_ntt.hpp` | todo | [fft_ntt.md](./fft_ntt.md) |
| `lib/solvers/hungarian.hpp` | todo | [hungarian.md](./hungarian.md) |
| `lib/solvers/implicit_treap.hpp` | todo | [implicit_treap.md](./implicit_treap.md) |
| `lib/solvers/kuhn.hpp` | todo | [kuhn.md](./kuhn.md) |
| `lib/solvers/lca_binary_lifting.hpp` | done | [lca_binary_lifting.md](./lca_binary_lifting.md) |
| `lib/solvers/maxflow_dinic.hpp` | todo | [maxflow_dinic.md](./maxflow_dinic.md) |
| `lib/solvers/merge_sort_tree.hpp` | todo | [merge_sort_tree.md](./merge_sort_tree.md) |
| `lib/solvers/mincost_maxflow.hpp` | todo | [mincost_maxflow.md](./mincost_maxflow.md) |
| `lib/solvers/poly_hash.hpp` | todo | [poly_hash.md](./poly_hash.md) |
| `lib/solvers/rollback_dsu.hpp` | todo | [rollback_dsu.md](./rollback_dsu.md) |
| `lib/solvers/segtree_beats.hpp` | todo | [segtree_beats.md](./segtree_beats.md) |
| `lib/solvers/segtree_lazy_add_min.hpp` | todo | [segtree_lazy_add_min.md](./segtree_lazy_add_min.md) |
| `lib/solvers/segtree_point_update.hpp` | todo | [segtree_point_update.md](./segtree_point_update.md) |
| `lib/solvers/sparse_table.hpp` | done | [static_rmq.md](./static_rmq.md) |
| `lib/solvers/suffix_array.hpp` | todo | [suffix_array.md](./suffix_array.md) |
| `lib/solvers/twosat.hpp` | todo | [twosat.md](./twosat.md) |

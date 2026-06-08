# Segment Tree Max-Subarray Static Fallback Migration

Status: completed static solver cleanup. The browse path is
`/solvers/segtree_max_subarray`; the pasteable fallback source is
`lib/solvers/segtree_max_subarray.hpp`.

Completed migration:

1. Split the monolith-only `MaxSubarraySegTree` out of `lib/segtree.hpp`.
2. Preserved the inclusive `[l, r]` query convention and point-set update API.
3. Added catalog metadata for `/solvers/segtree_max_subarray` with explicit
   exports.
4. Moved `tests/segtree_test.cpp` to the solver-path fallback.
5. Removed the top-level `lib/segtree.hpp` compatibility header as part of the
   segment-tree monolith cleanup.

Future dynamic work:

- Add generated max-subarray output to `/solvers/segtree` only if point-set
  max-subarray trees become a common insertion target.

# Segment Tree Lazy Min/Max Static Fallback Migration

Status: completed static solver cleanup. The browse path is
`/solvers/segtree_lazy_minmax`; the pasteable fallback source is
`lib/solvers/segtree_lazy_minmax.hpp`.

Completed migration:

1. Split the monolith-only lazy min/max range assign/add classes out of
   `lib/segtree.hpp`.
2. Preserved the inclusive `[l, r]` query/update convention and first/last
   threshold descent helpers.
3. Added catalog metadata for `/solvers/segtree_lazy_minmax` with explicit
   exports.
4. Moved `tests/segtree_test.cpp` to the solver-path fallback.
5. Removed the top-level `lib/segtree.hpp` compatibility header as part of the
   segment-tree monolith cleanup.

Future dynamic work:

- Fold max variants and last-threshold descents into `/solvers/segtree` if they
  become common enough for interactive generation.

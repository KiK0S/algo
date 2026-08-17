# Segment-tree creation pipeline

`/templates/segtree` is the canonical segment-tree entry point. Its first
choice is the problem scenario, not an implementation shape.

## Scenarios

- **Standard:** sum, minimum, maximum, maximum-subsegment, sorted-vector
  merge-sort, or custom-node aggregation with point updates, inclusive queries,
  and optional named descent.
- **Lazy / push-down:** range add and/or assignment with ordered tag
  composition. Lazy descent propagates before inspecting either child.
- **Persistent:** immutable index-pool roots, point versions, range queries,
  and custom node algebra.
- **Segment tree beats:** the dedicated chmin/chmax/add implementation.

Maximum subsegment, merge-sort tree, and custom Node are aggregate/storage
choices rather than top-level tree families. The merge-sort preset stores a
sorted vector at each node and answers range counting/search with binary search.
Choosing custom under Lazy additionally generates `Tag`, `apply`, and
chronological `compose` functions.

There is no separate frequency aggregate: frequency trees use ordinary sum over
non-negative leaf counts. The optional `k-th by prefix sum` descent is available
under sum and requires those counts to remain non-negative.

Every public range API is zero-based and inclusive on `[left, right]`. Generated
query loops can adapt one-based contest input. Normal output contains only the
selected capabilities.

## Lazy action contract

Custom actions use value semantics and `optional<Tag>` pending storage:

```cpp
// compose(older, newer) performs older first, then newer.
pending = compose(*pending, incoming);
```

`Node`, `Tag`, `neutral`, `make_node`, `merge`, `apply`, `compose`, and
`can_descend` remain problem-specific. The generated class owns traversal,
storage, propagation, and rebuilding.

## Persistence

Root `0` is the neutral tree. Build and point updates return integer roots;
historical nodes are never changed. Persistent lazy propagation is intentionally
unsupported.

## Visualization

Builds, completed queries, updates, and descents emit operation-level frames.
Lazy pending tags, active ranges, persistent roots, and beats invariants are
observable. Define `EDULCNI_DIAGNOSTIC_STEPS` in an active Edulcni build for
apply/compose/push/descent/clone frames. Custom `edulcni_view() const` methods
must be observational and must not push or mutate algorithm state.

## Compatibility

`/templates/merge_sort_tree` and `/templates/segtree_beats` are hidden
compatibility aliases. Exact-path use remains supported and preselects the
matching scenario in `/templates/segtree`. Their focused C++ implementations
remain separate because their invariants do not fit an ordinary universal tree.

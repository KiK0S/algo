# Fast Allocator Solver Migration

Status: completed smart solver migration. The browse path is
`/solvers/fast_allocator`; the pasteable fallback source is
`lib/solvers/fast_allocator.hpp`.

Completed migration:

1. Kept the fallback API stable: `FastAllocatorArena`, `FastAllocator`, and
   `make_fast_allocator`.
2. Added a registry-backed generator with collision-safe exported names.
3. Added scenario metadata for many vectors, graph edge lists, per-test arena
   reset, and custom containers.
4. Added optional solve-section snippets for vector declaration, edge-vector
   declaration, and arena reset.
5. Added generated renderer and C++ smoke coverage.

Dynamic choices:

- Usage mode: helper-only, vector declaration, edge vector, or arena reset.
- Bindings: value type, arena capacity, arena variable, container variable.
- Names: exported helper names are renamed when they collide with the active
  file.

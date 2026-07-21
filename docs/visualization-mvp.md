# Visualization MVP contract

Instrumented templates keep Edulcni calls inside one of two overridable macros:

```cpp
#ifndef EDULCNI_VIS
#define EDULCNI_VIS(...) ((void)0)
#endif
#ifndef EDULCNI_STEP
#define EDULCNI_STEP(...) ((void)0)
#endif
```

An ordinary contest build sees only the fallback definitions. Macro arguments are
discarded by preprocessing, so the rendered snippet does not need Edulcni headers
and visualization expressions are neither parsed nor evaluated.

`xeppelin edulcni` force-includes `edulcni/bootstrap.hpp` before the solution.
The bootstrap defines `EDULCNI_VIS(expression)` as guarded expression execution,
defines `EDULCNI_STEP(label)` as `edulcni::live::step(label)`, and initializes the
live session from the environment.

The MVP recipes use these snapshot adapters from `edulcni::live`:

- `array(id, range)`
- `matrix(id, matrix)`
- `graph(id, adjacency)`
- `forest(id, parents)`
- `segment_tree(id, leaf_count, recursive_storage)`
- `points(id, points)`
- `bits(id, value, width)`
- `queue(id, queue)`

Adapters update the current widget. `step(label)` captures and publishes the
resulting frame. They are deliberately a small bridge to the existing Edulcni
widget library, not the final retained-model API.

## Recipe rules

- Mutate algorithm state first, then update its visualization.
- Keep all Edulcni names and visualization-only temporaries inside macro arguments.
- Never evaluate a predicate, callback, comparator, or transition again for display.
- Use stable literal widget IDs scoped to the algorithm.
- Prefer one step per meaningful operation or completed outer iteration.
- Visualization failures are handled by the active macro and must not escape into
  the contest algorithm.

The catalog marks only the representative MVP paths that currently implement this
contract. Unmarked paths remain ordinary paste snippets.

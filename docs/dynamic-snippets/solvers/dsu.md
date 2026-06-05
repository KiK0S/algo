# DSU Dynamic Plan

Status: completed dynamic migration. Future agents should not pick this as the
next migration packet unless they are changing the DSU API or adding optional
features.

## Existing Source

- `lib/solvers/dsu.hpp`
- tests: `tests/dsu_test.cpp`
- legacy `lib/dsu.hpp` was removed after the solver-path test was migrated.

## Historical Alignment

The completed migration used these resolved choices:

- Dynamic path: `/solvers/dsu`.
- Generated output: a pasteable global `Dsu` helper class, not a full solution.
- Keep the API from the old top-level header body: `reset`, `size`,
  `components`, `find`, `unite`, `same`, `component_size`, and `parents`.
- Keep the static pasteable fallback at `lib/solvers/dsu.hpp`.
- Keep the usage block comment in generated snippets by default.
- Keep the short inline DSU snippet separate as `/bricks/dsu_short`.

## Dynamic Options

- class name, planned through the shared name planner
- optional usage block comment

## Sections

- helpers: DSU class and optional usage block comment

## Implementation Plan

Completed in this migration:

1. Added the `dsu` generator and registered it through the shared registry.
2. Added catalog metadata at `/solvers/dsu`, with static fallback source
   `solvers/dsu.hpp`.
3. Rendered the DSU class as a section-based helper recipe.
4. Preserved the pasteable fallback under `lib/solvers/dsu.hpp`.
5. Removed the top-level `lib/dsu.hpp` compatibility header after moving the
   C++ test include.

## Tests

- Render default DSU helper.
- Render collision case for `Dsu`.
- Compile generated DSU helper.
- Re-run `tests/dsu_test.cpp`.

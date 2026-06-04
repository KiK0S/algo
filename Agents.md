# Agents.md

## Purpose
This repository has two goals:

1. Store competitive programming snippets as standalone `.hpp` files.
2. Expose them through direct VS Code extension commands such as `edulcni:segtree`.

## Repository Layout
- `lib/`: source headers/snippets to be inserted.
- `lib/bricks/`: terse snippets that may assume the base contest template.
- `lib/solvers/`: complete one-shot algorithm/data-structure snippets pasted in the global namespace.
- `lib/catalog/`: sidecar metadata for extension import behavior, generators, exported names, and dependencies.
- `tests/`: C++ tests for snippets.
- `docs/`: notes and generated reports, including `iwcf-patterns.md`.
- `tools/`: helper scripts such as the read-only iwcf pattern miner.
- `extension/`: VS Code extension code.
- `extension/library/`: bundled copy of `lib/bricks`, `lib/solvers`, and `lib/catalog` used at runtime by the extension.

## Workflow Rules
- Treat `lib/` as the source of truth.
- After changing catalog snippets, run `cd extension && npm run build` to sync bundled solver/brick sources.
- `edulcni` should always read from bundled `extension/library`, not from the active workspace.
- Keep slash-style paths stable internally, with catalog-only entries allowed for interactive renderers such as `/solvers/segtree`.

## Snippet Conventions
- Data structures are independent and may be heterogeneous in implementation style.
- Do not force one shared abstraction across all snippets.
- Keep each snippet self-contained and easy to paste.
- Do not add standard-library includes in paste snippets; assume user code provides needed includes. `lib/bricks/base_template.hpp` is the exception because it is the full contest template.
- Bricks may be statement snippets rather than standalone headers; test them by embedding in a small program.
- Solvers should not depend on inserting another local header first.
- New files in `lib/solvers/` should be global paste snippets: no header guards, no `namespace edulcni`, and no local `#include` lines.
- Add catalog metadata when a snippet needs non-default behavior, dependencies, explicit exported-name handling, or interactive rendering.
- Static solvers should remain pasteable as plain code; the extension infers top-level exported names and auto-renames them when they collide with the active C++ file.
- Forms should detect ordinary constants, scalar variables, and vector variables where practical. Comments such as `// edulcni:const` and `// edulcni:input` are still supported as explicit hints.

## Testing
- Prefer small direct tests in `tests/` with simple `assert`-style checks.
- Keep test commands simple, for example:
  `g++ -std=c++17 tests/<name>_test.cpp -o /tmp/<name>_test && /tmp/<name>_test`

## Extension Notes
- Command names in palette should be direct, for example `edulcni:segtree`, `edulcni:compress_unique`, and `edulcni:read_vector`.
- The slash-path browse command may remain registered for compatibility, but it should not be the main palette entry.
- Bricks insert at the cursor; solvers insert near the global section.
- `/solvers/segtree` remains the preferred segment-tree generator entry point.

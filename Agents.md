# Agents.md

## Purpose
This repository has two goals:

1. Store competitive programming snippets as standalone `.hpp` files.
2. Expose them through direct VS Code extension commands such as `edulcni:segtree`.

## Repository Layout
- `lib/templates/bricks/`: terse templates that may assume the base contest template.
- `lib/templates/solvers/`: solver templates rendered into the global namespace.
- `lib/catalog/`: sidecar metadata for extension import behavior, generators, exported names, and dependencies.
- `extension/test/`: end-to-end render/compile tests for templates.
- `site/`: dependency-free GitHub Pages archive browser.
- `docs/`: notes and generated reports, including `iwcf-patterns.md`.
- `tools/`: helper scripts such as the read-only iwcf pattern miner.
- `extension/`: VS Code extension code.
- `extension/library/`: generated bundled copy of `lib/templates` and `lib/catalog` used at runtime by the extension.

## Workflow Rules
- Treat `lib/templates/` and `lib/catalog/` as the source of truth.
- Do not add standalone insertable headers under `lib/bricks/` or `lib/solvers/`.
- After changing catalog templates, run `cd extension && npm run build` to sync the bundle.
- `edulcni` should always read from bundled `extension/library`, not from the active workspace.
- Every insertable artifact must have a catalog entry with a slash-style path.

## Snippet Conventions
- Data structures are independent and may be heterogeneous in implementation style.
- Do not force one shared abstraction across all snippets.
- Keep each snippet self-contained and easy to paste.
- Do not add standard-library includes in rendered paste snippets; assume user
  code provides needed includes. `lib/templates/bricks/base_template.cpp.tmpl`
  is the exception because it renders a full contest file.
- Bricks may render statement snippets rather than standalone translation units.
- Solvers should not depend on inserting another local template first.
- New solver templates should render as global paste snippets: no header guards,
  no `namespace edulcni`, and no local `#include` lines.
- Add catalog metadata when a snippet needs non-default behavior, dependencies, explicit exported-name handling, or interactive rendering.
- Static artifacts use catalog `template` entries; dynamic artifacts use
  catalog `generator` entries. Both are available only through the extension.
- Forms should detect ordinary constants, scalar variables, and vector variables where practical. Comments such as `// edulcni:const` and `// edulcni:input` are still supported as explicit hints.

## Testing
- Test templates through `extension/test/core.test.js`.
- End-to-end cases should name the catalog path, print the selected parameters,
  render through the extension core, and compile/run the generated C++.
- Run `cd extension && npm test` when tests are requested.

## Extension Notes
- Command names in palette should be direct, for example `edulcni:segtree`, `edulcni:compress_unique`, and `edulcni:read_vector`.
- The slash-path browse command may remain registered for compatibility, but it should not be the main palette entry.
- Bricks insert at the cursor; solvers insert near the global section.
- `/solvers/segtree` remains the preferred segment-tree generator entry point.

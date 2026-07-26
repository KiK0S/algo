# Agents.md

## Purpose
This repository has two goals:

1. Store competitive programming snippets as pasteable templates.
2. Expose them through direct VS Code extension commands such as `edulcni:segtree`.

## Repository Layout
- `lib/templates/`: all cursor-local and global templates.
- `lib/catalog/`: sidecar metadata for extension import behavior, generators, exported names, and dependencies.
- `extension/test/`: end-to-end render/compile tests for templates.
- `site/`: dependency-free GitHub Pages archive browser.
- `docs/`: notes and generated reports, including `iwcf-patterns.md`.
- `tools/`: helper scripts such as the read-only iwcf pattern miner.
- `extension/`: VS Code extension code.
- `extension/library/`: generated bundled copy of `lib/templates` and `lib/catalog` used at runtime by the extension.

## Workflow Rules
- Treat `lib/templates/` and `lib/catalog/` as the source of truth.
- Do not add a second insertable-template category outside `lib/templates/`.
- After changing catalog templates, run `cd extension && npm run build` to sync the bundle.
- `edulcni` should always read from bundled `extension/library`, not from the active workspace.
- Every insertable artifact must have a catalog entry with a slash-style path.

## Snippet Conventions
- Data structures are independent and may be heterogeneous in implementation style.
- Do not force one shared abstraction across all snippets.
- Keep each snippet self-contained and easy to paste.
- Do not add standard-library includes in rendered paste snippets; assume user
  code provides needed includes. `lib/templates/base_template.cpp.tmpl`
  is the exception because it renders a full contest file.
- Cursor-local templates may render statement snippets rather than standalone translation units.
- Global templates should not depend on inserting another local template first.
- New global templates should render as paste snippets: no header guards,
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
- Catalog `insertMode` determines whether a template inserts at the cursor or near the global section.
- `/templates/segtree` remains the preferred segment-tree generator entry point.

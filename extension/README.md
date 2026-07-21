# edulcni extension

`edulcni` adds one command to the Command Palette:

- `edulcni`

Workflow:

1. Press `Ctrl+Shift+P`.
2. Run `edulcni`.
3. Search the catalog tree and pick a solver or brick.
4. Review the highlighted catalog entry, then compare each generator choice in
   a compact single-pane diff. Confirmed answers are retained and later steps
   use their declared defaults, so only the concrete lines changed by the
   highlighted choice are shown.
5. Choose any interactive parameters.
6. The rendered template is inserted at the appropriate global section or cursor.

Template source:

- The extension reads only from its bundled `library/` directory.
- `npm run build` syncs only `../lib/templates/` and `../lib/catalog/`
  into `extension/library/`.
- This keeps behavior consistent across all workspaces/projects.
- Standalone solver and brick headers are not part of the extension package.

Generator templates:

- Generated C++ lives under `lib/templates/`; TypeScript prepares template
  values, selects optional sections, and applies collision-safe identifier
  renames.
- Templates support `{{name}}`, `{{#if name}}...{{else}}...{{/if}}`, and
  `{{#unless name}}...{{/unless}}` without an external runtime dependency.
- Treat `lib/templates/` as source and `extension/library/templates/` as the
  build-generated bundled copy.

Tests:

- `npm test` renders catalog scenarios through the extension core, prints
  their selected parameters, and compiles/runs the resulting C++.

Local development:

1. `cd extension`
2. `npm install`
3. `npm run build`
4. Press `F5` in VS Code to launch an Extension Development Host.

# edulcni extension

`edulcni` adds one command to the Command Palette:

- `edulcni`

Workflow:

1. Press `Ctrl+Shift+P`.
2. Run `edulcni`.
3. Start typing a header name and pick one from suggestions.
4. The selected file content is inserted at your current cursor position.

Header source:

- The extension reads only from its bundled `library/` directory.
- `npm run build` syncs `../lib/` into `extension/library/` automatically.
- This keeps behavior consistent across all workspaces/projects.

Local development:

1. `cd extension`
2. `npm install`
3. `npm run build`
4. Press `F5` in VS Code to launch an Extension Development Host.

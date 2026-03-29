# Agents.md

## Purpose
This repository has two goals:

1. Store competitive programming snippets as standalone `.hpp` files.
2. Expose them through the VS Code extension command `edulcni`.

## Repository Layout
- `lib/`: source headers/snippets to be inserted.
- `tests/`: C++ tests for snippets.
- `extension/`: VS Code extension code.
- `extension/library/`: bundled copy of `lib/` used at runtime by the extension.

## Workflow Rules
- Treat `lib/` as the source of truth.
- After changing `lib/`, run `cd extension && npm run build` to sync `lib/ -> extension/library/`.
- `edulcni` should always read from bundled `extension/library`, not from the active workspace.

## Snippet Conventions
- Data structures are independent and may be heterogeneous in style.
- Do not force one global abstraction style across all snippets.
- Keep each snippet self-contained and easy to paste.
- Do not add standard-library includes in `.hpp` files in `lib/`; assume user code provides needed includes.

## Testing
- Prefer small direct tests in `tests/` with simple `assert`-style checks.
- Keep test commands simple, for example:
  `g++ -std=c++17 tests/<name>_test.cpp -o /tmp/<name>_test && /tmp/<name>_test`

## Extension Notes
- Command name in palette: `edulcni`.
- UX: pick a header with QuickPick autosuggestions, insert content at cursor.

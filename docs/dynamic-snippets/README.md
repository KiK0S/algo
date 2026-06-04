# Dynamic Snippet Migration Plans

This folder captures the plan for moving solver and brick insertion onto the same dynamic model currently used by `/solvers/segtree`.

## Current Baseline

- `lib/catalog/snippets.json` has generator entries for `/solvers/segtree` and `/solvers/berlekamp_massey`, plus interactive brick generators for `/bricks/compress_unique` and `/bricks/read_vector`.
- `extension/src/core.ts` already analyzes the active C++ document for identifiers, constants, input variables, vector variables, aliases, and exported-name collisions.
- `extension/src/extension.ts` dispatches generator ids through a generator registry.
- Static solvers remain pasteable as plain code. They are unwrapped from headers and renamed if exported identifiers collide with the current file.

## Target Assembly Order

Dynamic generators should be able to emit a full solution or a pasteable fragment in this order:

1. includes
2. defines and aliases
3. constants
4. data definitions, usually input arrays, strings, graphs, matrices, and supporting globals
5. helper types and helper functions
6. solve
7. main

For ordinary contest insertion, some sections may be empty because the active file already has them. The generator must still model these sections explicitly so a pipeline can decide what to import.

## Files In This Plan Set

- [00-prework.md](./00-prework.md): shared infrastructure needed before solver migrations.
- [01-agent-contract.md](./01-agent-contract.md): workflow every migration agent should follow.
- [02-bricks.md](./02-bricks.md): brick migration plan.
- [03-legacy-cleanup.md](./03-legacy-cleanup.md): plan to remove top-level compatibility headers and classify everything as solver or brick.
- [solvers/](./solvers): one work packet per solver snippet.

## Agent Rule

Every solver plan is intentionally written so the assigned agent starts by aligning with the user on the pipeline and defaults. The plans include assumptions, but they are not permission to silently lock in choices like interval convention, naming style, optional outputs, or dependencies.

Read [Settled Migration Defaults](#settled-migration-defaults) before asking
alignment questions. Do not ask those same general questions again unless a
specific solver plan needs a new decision.

Final state rule: every insertable artifact lives under `lib/solvers/` or `lib/bricks/`; there is no legacy or compatibility folder/layer left behind.

## Settled Migration Defaults

- Remove top-level `lib/*.hpp` compatibility headers gradually as each
  solver/brick replacement lands and tests/catalog references have moved.
- Dynamic solvers default to pasteable global utility fragments, not full
  solution files. Solvers usually expose an interface to call; bricks are
  cursor-local snippets.
- Full-solution generation is a separate explicit mode. It may use
  `/bricks/base_template`, but ordinary insertion should paste only the selected
  utility/fragment.
- Keep generated code in terse contest style unless a specific solver domain
  already needs a class-like interface or the user explicitly asks for a full
  new file.
- Optional dependencies should be rendered dynamically when a generator exists,
  asking the needed questions in that dependency pipeline. Static fallback files
  under `lib/solvers/` or `lib/bricks/` remain pasteable during migration.
- Interval conventions are per-solver defaults. Ask only when the assigned
  solver plan has no clear default or the convention materially changes the
  generated API.
- Prefer defaults and snippets informed by the existing IWCF/pattern analysis
  when available.
- `/solvers/berlekamp_massey` is the completed non-segtree proof migration:
  it has a registry-backed dynamic generator, catalog metadata, a pasteable
  fallback under `lib/solvers/`, solver-path tests, and no top-level
  compatibility header.

## Verification Spine

After any implementation step that changes generator behavior:

- `npm --prefix extension test`
- `npm --prefix extension run build`
- `python3 tests/brick_smoke_test.py` when bricks are touched
- focused C++ solver tests under `tests/`

# Migration Agent Contract

Every solver migration should follow this contract. The default job is one
complete solver migration, not a tiny preparatory task.

## Start With User Alignment

First read the settled defaults in
[README.md](./README.md#settled-migration-defaults). Do not ask the user to
repeat those general answers.

For an assigned solver, ask only the choices that remain solver-specific or
unsettled:

- the exact dynamic entry path, for example `/solvers/sparse_table`
- paste fragment, full solution, or both
- which existing variables should be reused, for example `n`, `a`, `g`, `s`
- default interval convention
- default optional features
- whether dependencies should be rendered dynamically or pasted from static snippets
- whether the old static header should remain as a fallback

If the solver packet already records a default or historical alignment for these
choices, treat it as answered and proceed. Ask the user only for a genuine
blocker: a missing decision that cannot be inferred from the packet, settled
defaults, existing static API, tests, or local style. When there are no blockers,
briefly state the assumed shape and implement it.

## Completion Default

Finish the assigned solver end to end whenever the repository context makes it
feasible:

- dynamic generator registered through the shared registry
- section-based renderer using the shared name planner
- catalog metadata with `kind`, `insertMode`, `generator`, `source`, `exports`,
  and `sections`
- pasteable fallback under `lib/solvers/` or `lib/bricks/`
- top-level `lib/*.hpp` compatibility header removed after references move
- tests updated to solver/brick paths
- extension render/collision/compile tests added
- focused C++ tests run
- plan/index docs updated to mark the solver done

Do not leave the next agent with routine cleanup from this solver unless a
verification failure, missing dependency, or explicit user decision blocks it.

## Implementation Flow

1. Read the assigned source snippet and its tests.
2. Re-read the pre-work docs if the shared pipeline has changed.
3. Sketch the dynamic options and generated sections.
4. Confirm the sketch with the user only when a genuine unresolved choice
   remains; otherwise continue with the recorded defaults.
5. Implement the renderer and prompt using shared primitives.
6. Add or update catalog metadata.
7. Add extension tests for rendering, names, and collisions.
8. Add or update C++ smoke tests for generated output when practical.
9. Run the focused verification commands.
10. Remove the legacy top-level header once tests/catalog references have moved.
11. Record completion status and any unresolved choices in the plan file or
    follow-up notes.

## Output Shape

Renderer output should be modeled as sections even when it only inserts one helper block:

- includes
- defines
- constants
- data
- helpers
- solve
- main

The composer decides which sections are inserted for the selected pipeline.

## Naming Rules

- Use the shared name planner.
- Prefer existing symbols when the user selects them.
- Reserve every exported function, type, lambda, vector, array, and helper.
- Pass one planner through dependencies.
- Preserve user-selected names exactly when they are valid and unused.

## Compatibility Rules

- Static paste snippets stay pasteable when they live under `lib/solvers/` or `lib/bricks/`.
- Top-level `lib/*.hpp` headers are legacy compatibility files. They may be kept temporarily while migrating tests, but they should not be preserved as the final fallback.
- Existing tests should continue passing.
- Do not make solvers depend on local headers for static insertion.
- Dynamic dependencies are allowed only after pre-work support exists.

## Minimum Tests Per Migration

- one extension render test for defaults
- one extension render test for identifier collisions
- one compile test for generated code where the generated code is complete enough
- current solver-specific C++ tests still pass

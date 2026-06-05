# Berlekamp-Massey Dynamic Plan

Status: completed dynamic migration. Future agents should not pick this as the
next migration packet unless they are adding one of the optional follow-up
features below.

## Existing Source

- `lib/solvers/berlekamp_massey.hpp`
- tests: `tests/berlekamp_massey_test.cpp`
- legacy `lib/berlekamp_massey.hpp` was removed after the solver-path test was
  migrated.

## Historical Alignment

The completed migration used these resolved choices:

- Use a field-like/modint type with valid `/` by default.
- Reuse an existing sequence vector when available.
- Generate minimal recurrence, kth-term, and one-shot kth helpers by default.
- Keep the static pasteable fallback at `lib/solvers/berlekamp_massey.hpp`.
- Keep the usage block comment in generated snippets by default.
- Defer `long long` modular inverse/custom inverse prompts to a later feature.

## Assumptions

- Keep generic template fallback.
- Dynamic default: existing sequence vector, emit BM and kth-term helpers.
- The value type must support addition, subtraction, multiplication, and division or inverse semantics.
- Current migration default: assume a custom field-like/modint type with
  valid `/`, reuse an existing sequence vector when available, emit
  `berlekamp_massey`, `linear_recurrence_kth`, and `berlekamp_massey_kth`, and
  keep the pasteable fallback at `lib/solvers/berlekamp_massey.hpp`.

## Dynamic Options

- value type and sequence source
- helpers: minimal recurrence, combine polynomials, kth term, one-shot BM kth
- index type: `long long`, custom
- names: berlekamp_massey, linear_recurrence_kth, recurrence arrays

## Sections

- data: optional sequence vector and query index
- helpers: selected recurrence functions
- solve: optional call to compute answer

## Implementation Plan

Completed in the migration:

- Added the `berlekamp_massey` generator and direct command.
- Registered the generator through the shared registry.
- Added catalog metadata at `/solvers/berlekamp_massey`, with static fallback
  source `solvers/berlekamp_massey.hpp`.
- Rendered selected helper features only.
- Preserved the pasteable fallback under `lib/solvers/berlekamp_massey.hpp`.
- Removed the top-level `lib/berlekamp_massey.hpp` compatibility header.

Deferred optional follow-ups:

- Prompt for `long long` modular inverse/custom inverse modes.
- Generate optional data or solve call sections. The completed default remains
  a global helper fragment.

## Tests

- Render default template helpers and compile against a simple modint-like type.
- Render minimal recurrence only and verify kth helper is omitted.
- Collision test for helper function names.
- Re-run Berlekamp-Massey solver tests through
  `tests/berlekamp_massey_test.cpp`.

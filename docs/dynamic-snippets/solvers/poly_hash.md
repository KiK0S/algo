# Polynomial Hash Dynamic Plan

Status: completed dynamic migration. The dynamic entry path is
`/solvers/poly_hash`; the pasteable fallback source remains
`lib/solvers/poly_hash.hpp`; legacy `lib/poly_hash.hpp` was removed after tests
moved to the solver path.

## Existing Source

- `lib/solvers/poly_hash.hpp`
- tests: `tests/poly_hash_test.cpp`

## Solver-Specific Choices

Resolve these from the assumptions, settled defaults, existing code, and tests first. Ask the user only if a choice remains a genuine blocker:

- Should the hash use one mod, two mods, unsigned overflow, or current pair value?
- Should base/mod constants be generated, reused, or randomized?
- Should the generator build for an existing string/vector or generate input?
- Should reverse hashes and palindrome queries be optional?
- Should substring compare and LCP helpers be emitted?

## Assumptions

- Keep current pair-hash class fallback.
- Dynamic default: existing string, forward hashes, equality helper.
- Reverse hash and LCP helpers are optional.

## Dynamic Options

- source kind: string, vector<int>
- modulus/base mode: current constants, custom constants, generated constants
- features: forward hash, reverse hash, substring equal, LCP, combine hashes
- names: value struct, class, powers, prefix, helper functions

## Sections

- constants: optional base/mod constants
- data: optional source string/vector
- helpers: hash value operations, hash class/functions
- solve: optional construction and query

## Implementation Plan

Completed:

1. Added registry-backed dynamic renderer and prompt for `/solvers/poly_hash`.
2. Cataloged the solver with static fallback source `solvers/poly_hash.hpp`.
3. Split generated code so reverse/palindrome, LCP, substring equality, and
   concat helpers are selectable.
4. Used name planning for global constants, class/value names, and exported
   helper functions.
5. Moved `tests/poly_hash_test.cpp` to the solver-path include.
6. Removed the top-level legacy `lib/poly_hash.hpp` compatibility header.

## Tests

- Render forward string hash and compile equality checks.
- Render reverse hash, LCP, vector hashing, and palindrome checks.
- Collision test for `PolyHash`, `PolyHashValue`, and generated constants.
- Re-run poly hash tests.

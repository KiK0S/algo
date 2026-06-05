# Polynomial Hash Dynamic Plan

## Existing Source

- `lib/solvers/poly_hash.hpp`
- related library header: `lib/poly_hash.hpp`
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

1. Add `poly_hash` generator.
2. Prompt for source and mod/base mode.
3. Split renderer by feature so reverse/LCP code is only emitted when selected.
4. Use name planner for constants and exported helpers.
5. Preserve static fallback.

## Tests

- Render forward string hash and compile equality checks.
- Render reverse hash and palindrome check.
- Collision test for `PolyHash`, `PolyHashValue`, `BASE`, `MOD`.
- Re-run poly hash tests.


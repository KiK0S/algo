# Suffix Array Dynamic Plan

## Existing Source

- `lib/solvers/suffix_array.hpp`
- related library header: `lib/suffix_array.hpp`
- tests: `tests/suffix_array_test.cpp`

## Solver-Specific Choices

Resolve these from the assumptions, settled defaults, existing code, and tests first. Ask the user only if a choice remains a genuine blocker:

- Should the generator build from an existing `string`, an existing vector of ints, or generate input?
- Should `lcp` be emitted by default, optional, or omitted unless requested?
- Should `rank` be emitted when `lcp` is disabled?
- Should the empty suffix be kept or stripped by default?
- Should LCP range queries request a sparse-table dependency?

## Assumptions

- Keep `SuffixArrayResult` static fallback.
- Dynamic default: existing string source, `sa` plus `lcp` plus `rank`, empty suffix stripped for user-facing `sa`.
- LCP array generation should be optional because some uses only need `sa`.

## Dynamic Options

- input kind: string, vector<int>, positive codes
- source name: existing `s`, existing vector, generated variable
- outputs: `sa`, `rank`, `lcp`, stripped `sa`, LCP RMQ helper
- alphabet handling: byte string, compressed ints, positive codes with limit
- names: result struct, arrays, build helpers, remove-empty helper, RMQ names if needed

## Sections

- data: optional input string/vector
- helpers: suffix array build, optional LCP, optional compression, optional LCP RMQ
- solve: optional build call assigning selected output variables

## Implementation Plan

1. Add `suffix_array` generator using shared source-variable prompts.
2. Split renderer helpers so `lcp` and `rank` can be toggled.
3. Add an option to expose either a result struct or individual arrays.
4. Add optional sparse-table dependency for LCP range queries.
5. Keep static functions as fallback and as a reference implementation.

## Tests

- Render from existing `string s`.
- Render `sa` only and assert no `lcp` build code appears.
- Render with collision on `sa`, `rank`, `lcp`, and `SuffixArrayResult`.
- Compile generated string and int-vector variants.
- Re-run suffix array tests.


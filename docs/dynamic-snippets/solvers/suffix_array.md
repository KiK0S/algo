# Suffix Array Dynamic Plan

Status: completed dynamic migration. The dynamic entry path is
`/solvers/suffix_array`; the pasteable fallback source is
`lib/solvers/suffix_array.hpp`; legacy `lib/suffix_array.hpp` was removed after
tests moved to the solver path.

## Existing Source

- `lib/solvers/suffix_array.hpp`
- removed related library header: `lib/suffix_array.hpp`
- tests: `tests/suffix_array_test.cpp`

## Solver-Specific Choices

Resolve these from the assumptions, settled defaults, existing code, and tests first. Ask the user only if a choice remains a genuine blocker:

Resolved choices:

- The generator supports existing `string`, compressed int vector, and positive
  code vector sources. Default source kind is an existing string.
- Default optional outputs are stripped `sa`, `rank`, and `lcp`.
- `lcp` and `rank` are independently optional; `lcp_rmq` implies both.
- The empty suffix remains in the raw result, and the default user-facing `sa`
  uses the remove-empty helper.
- LCP range queries render the existing dynamic min sparse-table helper in the
  same recipe and add a wrapper over suffix ranks.

## Assumptions

- Keep `SuffixArrayResult` static fallback.
- Dynamic default: existing string source, `sa` plus `lcp` plus `rank`, empty
  suffix stripped for user-facing `sa`.
- LCP array generation is optional because some uses only need `sa`.

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

## Completed In This Migration

1. Added `suffix_array` generator using shared source-variable prompts.
2. Split renderer helpers so `lcp` and `rank` can be toggled.
3. Added collision-aware names for the result struct, build helpers, and
   user-facing output aliases.
4. Added optional sparse-table-backed LCP range queries.
5. Preserved static functions as the solver fallback and reference
   implementation.
6. Added catalog metadata at `/solvers/suffix_array`.
7. Moved `tests/suffix_array_test.cpp` to include
   `lib/solvers/suffix_array.hpp`.
8. Removed the top-level `lib/suffix_array.hpp` compatibility header.

## Tests

- Render from existing `string s`.
- Render `sa` only and assert no `lcp` build code appears.
- Render with collision on `sa`, `rank`, `lcp`, and `SuffixArrayResult`.
- Compile generated string, int-vector, and LCP RMQ variants.
- Re-run suffix array tests.

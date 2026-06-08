# FFT / NTT Dynamic Plan

Status: completed dynamic migration. The dynamic entry path is
`/solvers/fft_ntt`; the pasteable fallback source remains
`lib/solvers/fft_ntt.hpp`; legacy `lib/fft.hpp` was removed after
tests moved to the solver path.

## Existing Source

- `lib/solvers/fft_ntt.hpp`
- tests: `tests/fft_test.cpp`, `tests/solvers_twosat_fft_test.cpp`

## Solver-Specific Choices

Resolve these from the assumptions, settled defaults, existing code, and tests first. Ask the user only if a choice remains a genuine blocker:

- Should the generator emit FFT, NTT, or both?
- Which modulus/root should default for NTT: `998244353, 3`, existing `FFT_MOD`, or custom?
- Should convolution wrappers be included by default?
- Should polynomial operations beyond convolution be planned now or later?
- Should complex FFT include rounding to integer result or raw transform only?

## Assumptions

- Keep FFT and NTT in one generator with feature flags.
- Default for NTT: modulus `998244353`, primitive root `3`.
- Default output includes convolution wrapper for selected transform.

## Resolved Choices

- Dynamic path: `/solvers/fft_ntt`.
- Static fallback: `lib/solvers/fft_ntt.hpp`.
- Default render: both complex FFT and modular NTT with convolution wrappers.
- NTT defaults: `998244353` and primitive root `3`; prompt can select existing
  constants such as `FFT_MOD`, `MOD`, `FFT_ROOT`, or `ROOT`.
- Static fallback intentionally uses the standalone `int` NTT API instead of
  depending on `/solvers/modint`.

## Dynamic Options

- transform: FFT, NTT, both
- modulus and primitive root
- outputs: transform only or transform plus convolution wrappers
- names: transform functions, shared helpers, pow, and convolution wrappers

## Sections

- constants: selected existing modulus/root expressions are referenced when used
- helpers: selected transform and convolution functions
- data/solve: not emitted in ordinary snippet mode

## Implementation Plan

1. Add `fft_ntt` generator with separate feature flags.
2. Render minimal selected helpers instead of the whole static file when possible.
3. Reuse existing `MOD` or `FFT_MOD` constants when selected by user.
4. Preserve static fallback and catalog exports.

## Tests

- Render NTT convolution only and compile known polynomial product.
- Render FFT convolution only and compile rounded result.
- Collision test for `ntt_transform`, `fft_transform`, `ntt_pow`.
- Re-run FFT and twosat/fft tests.

## Completed Work

1. Added registry-backed dynamic renderer and prompt for `/solvers/fft_ntt`.
2. Cataloged the solver with static fallback source `solvers/fft_ntt.hpp`.
3. Added extension renderer, catalog, collision, and generated compile tests.
4. Moved `tests/fft_test.cpp` to the solver-path include and standalone NTT API.
5. Removed the top-level legacy `lib/fft.hpp` compatibility header.

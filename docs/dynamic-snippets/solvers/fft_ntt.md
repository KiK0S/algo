# FFT / NTT Dynamic Plan

## Existing Source

- `lib/solvers/fft_ntt.hpp`
- related library header: `lib/fft.hpp`
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

## Dynamic Options

- transform: FFT, NTT, both
- value/result type: int, ll, complex, custom
- modulus and primitive root
- outputs: transform only, convolution, next power of two, modular pow
- names: transform functions, pow, convolution, temporary arrays

## Sections

- constants: optional modulus/root constants
- helpers: selected transform and convolution functions
- data/solve: optional polynomial input and call in full-solution mode

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


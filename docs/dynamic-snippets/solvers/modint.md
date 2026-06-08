# Modint

Status: completed dynamic migration. The dynamic entry path is
`/solvers/modint`; the pasteable fallback source is
`lib/solvers/modint.hpp`; legacy `lib/modint.hpp` was removed after tests moved
to the solver path.

Files:

- `extension/src/core.ts`
- `extension/src/extension.ts`
- `lib/catalog/snippets.json`
- `lib/solvers/modint.hpp`
- `tests/modint_test.cpp`
- `extension/test/core.test.js`

Completed migration added:

1. Registry-backed renderer for `/solvers/modint`.
2. Static-template `StaticModInt<MOD>` generation.
3. Runtime-modulus `DynamicModInt` generation with `set_mod`.
4. Catalog exports for both generated helper classes.
5. Solver-path fallback without header guards or `edulcni` namespace.
6. Solver-path C++ test include and extension migration guardrail.

Resolved choices:

- Dynamic path: `/solvers/modint`.
- Static fallback: `lib/solvers/modint.hpp`.
- Default generated mode: both static-template and runtime-modulus classes.
- Default runtime modulus expression: `1000000007`.

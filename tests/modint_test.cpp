#include <cassert>
#include <random>
#include <vector>

#include "../lib/modint.hpp"

static long long normalize(long long x, long long mod) {
  x %= mod;
  if (x < 0) {
    x += mod;
  }
  return x;
}

static long long mod_pow(long long base, long long exp, long long mod) {
  long long result = 1 % mod;
  long long cur = normalize(base, mod);
  long long e = exp;
  while (e > 0) {
    if (e & 1LL) {
      result = static_cast<long long>((result * cur) % mod);
    }
    cur = static_cast<long long>((cur * cur) % mod);
    e >>= 1LL;
  }
  return result;
}

static void test_basic_arithmetic() {
  using Mint = edulcni::StaticModInt<1000000007>;

  const Mint a(2);
  const Mint b(1000000006);
  assert((a + b).value() == 1);
  assert((a - b).value() == 3);
  assert((a * b).value() == 1000000005);
  assert((-a).value() == 1000000005);

  const Mint x(5);
  const Mint inv_x = x.inv();
  assert(inv_x.value() == 400000003);
  assert((x * inv_x).value() == 1);
  assert((Mint(10) / Mint(5)).value() == 2);

  assert(Mint(2).pow(10).value() == 1024);
  assert(Mint(2).pow(-1).value() == Mint(2).inv().value());
}

static void test_non_prime_inverse_behavior() {
  using Mint = edulcni::StaticModInt<1000>;

  const Mint a(3);
  assert(a.has_inverse());
  Mint inv_a(0);
  assert(a.try_inv(inv_a));
  assert((a * inv_a).value() == 1);

  const Mint b(10);
  assert(!b.has_inverse());
  Mint inv_b(123);
  assert(!b.try_inv(inv_b));
  assert(inv_b.value() == 0);
}

static void test_random_prime_mod() {
  using Mint = edulcni::StaticModInt<1000000007>;
  static constexpr long long kMod = 1000000007LL;

  std::mt19937_64 rng(123456789ULL);
  for (int it = 0; it < 4000; ++it) {
    const long long x = static_cast<long long>(rng() % 2000000000000ULL) -
                        1000000000000LL;
    const long long y = static_cast<long long>(rng() % 2000000000000ULL) -
                        1000000000000LL;

    const Mint mx(x);
    const Mint my(y);

    const long long nx = normalize(x, kMod);
    const long long ny = normalize(y, kMod);

    assert((mx + my).value() == normalize(nx + ny, kMod));
    assert((mx - my).value() == normalize(nx - ny, kMod));

    const long long mul = static_cast<long long>((nx * ny) % kMod);
    assert((mx * my).value() == mul);

    if (ny != 0) {
      const long long inv_y = mod_pow(ny, kMod - 2, kMod);
      const long long div_expected =
          static_cast<long long>((nx * inv_y) % kMod);
      assert((mx / my).value() == div_expected);
    }
  }
}

int main() {
  test_basic_arithmetic();
  test_non_prime_inverse_behavior();
  test_random_prime_mod();
  return 0;
}

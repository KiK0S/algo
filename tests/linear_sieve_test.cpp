#include <algorithm>
#include <cassert>
#include <random>
#include <utility>
#include <vector>

#include "../lib/linear_sieve.hpp"

static int naive_lowest_prime(int x) {
  if (x < 2) {
    return x;
  }
  for (int d = 2; static_cast<long long>(d) * d <= x; ++d) {
    if (x % d == 0) {
      return d;
    }
  }
  return x;
}

static bool naive_is_prime(int x) {
  return x >= 2 && naive_lowest_prime(x) == x;
}

static long long rebuild_from_factors(const std::vector<std::pair<int, int>>& factors) {
  long long value = 1;
  for (const std::pair<int, int>& factor : factors) {
    for (int i = 0; i < factor.second; ++i) {
      value *= factor.first;
    }
  }
  return value;
}

static void test_basic_sieve() {
  edulcni::LinearSieve sieve(20);
  const std::vector<int> expected_primes = {2, 3, 5, 7, 11, 13, 17, 19};
  assert(sieve.primes() == expected_primes);

  const std::vector<int> expected_lp = {0, 1, 2, 3, 2, 5, 2, 7, 2, 3, 2,
                                        11, 2, 13, 2, 3, 2, 17, 2, 19, 2};
  assert(sieve.lowest_prime() == expected_lp);
}

static void test_prime_queries() {
  edulcni::LinearSieve sieve(1000);
  for (int x = 0; x <= 1000; ++x) {
    assert(sieve.lowest_prime_of(x) == (x <= 1 ? x : naive_lowest_prime(x)));
    assert(sieve.is_prime(x) == naive_is_prime(x));
  }

  assert(sieve.lowest_prime_of(-5) == 0);
  assert(sieve.lowest_prime_of(1500) == 0);
  assert(!sieve.is_prime(-1));
  assert(!sieve.is_prime(1500));
}

static void test_factorization() {
  edulcni::LinearSieve sieve(200000);
  std::mt19937 rng(20260225);

  for (int it = 0; it < 1000; ++it) {
    const int value = 2 + static_cast<int>(rng() % 199999);
    const std::vector<std::pair<int, int>> factors = sieve.factorize(value);
    assert(!factors.empty());

    int prev_prime = 1;
    for (const std::pair<int, int>& factor : factors) {
      const int prime = factor.first;
      const int exponent = factor.second;
      assert(prime > prev_prime);
      assert(exponent > 0);
      assert(sieve.is_prime(prime));
      prev_prime = prime;
    }

    assert(rebuild_from_factors(factors) == value);
  }

  assert(sieve.factorize(1).empty());
  assert(sieve.factorize(0).empty());
  assert(sieve.factorize(-10).empty());
  assert(sieve.factorize(500000).empty());
}

static void test_free_functions() {
  const std::vector<int> lp = edulcni::linear_sieve_lowest_prime(30);
  const std::vector<int> primes = edulcni::linear_sieve_primes(30);

  assert(lp[29] == 29);
  assert(lp[30] == 2);
  assert(primes ==
         std::vector<int>({2, 3, 5, 7, 11, 13, 17, 19, 23, 29}));
}

int main() {
  test_basic_sieve();
  test_prime_queries();
  test_factorization();
  test_free_functions();
  return 0;
}

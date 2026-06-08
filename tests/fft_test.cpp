#include <algorithm>
#include <cassert>
#include <complex>
#include <cstdint>
#include <random>
#include <vector>

#include "../lib/solvers/fft_ntt.hpp"

static std::vector<long long> naive_convolution_ll(const std::vector<long long>& a,
                                                   const std::vector<long long>& b) {
  if (a.empty() || b.empty()) {
    return {};
  }
  std::vector<long long> result(a.size() + b.size() - 1, 0LL);
  for (int i = 0; i < static_cast<int>(a.size()); ++i) {
    for (int j = 0; j < static_cast<int>(b.size()); ++j) {
      result[i + j] += a[i] * b[j];
    }
  }
  return result;
}

static std::vector<int> naive_convolution_mod(const std::vector<int>& a,
                                              const std::vector<int>& b,
                                              int mod) {
  if (a.empty() || b.empty()) {
    return {};
  }
  std::vector<int> result(a.size() + b.size() - 1, 0);
  for (int i = 0; i < static_cast<int>(a.size()); ++i) {
    for (int j = 0; j < static_cast<int>(b.size()); ++j) {
      const long long add =
          static_cast<long long>(a[i]) * static_cast<long long>(b[j]);
      result[i + j] =
          static_cast<int>((result[i + j] + add) % static_cast<long long>(mod));
    }
  }
  return result;
}

static void test_fft_basic() {
  const std::vector<long long> a = {1, 2, 3};
  const std::vector<long long> b = {4, 5};
  const std::vector<long long> expected = {4, 13, 22, 15};
  assert(convolution_fft_round(a, b) == expected);
}

static void test_fft_random() {
  std::mt19937 rng(20260225);
  for (int it = 0; it < 220; ++it) {
    const int n = 1 + static_cast<int>(rng() % 45);
    const int m = 1 + static_cast<int>(rng() % 45);
    std::vector<long long> a(n, 0LL);
    std::vector<long long> b(m, 0LL);

    for (int i = 0; i < n; ++i) {
      a[i] = static_cast<long long>(static_cast<int>(rng() % 401) - 200);
    }
    for (int i = 0; i < m; ++i) {
      b[i] = static_cast<long long>(static_cast<int>(rng() % 401) - 200);
    }

    const std::vector<long long> expected = naive_convolution_ll(a, b);
    const std::vector<long long> got = convolution_fft_round(a, b);
    assert(got == expected);
  }
}

static void test_fft_transform_guard() {
  std::vector<std::complex<long double>> values(3, std::complex<long double>(0, 0));
  assert(!fft_transform(values, false));
}

static void test_ntt_basic() {
  const std::vector<int> a = {1, 2, 3, 4};
  const std::vector<int> b = {5, 6, 7};
  const std::vector<int> conv = convolution_ntt_int(a, b);
  const std::vector<int> expected = {5, 16, 34, 52, 45, 28};
  assert(conv == expected);
}

static void test_ntt_roundtrip() {
  std::mt19937 rng(11235813);
  std::vector<int> values(256, 0);
  for (int i = 0; i < static_cast<int>(values.size()); ++i) {
    values[i] = static_cast<int>(rng() % 998244353);
  }

  const std::vector<int> original = values;
  assert(ntt_transform(values, false));
  assert(ntt_transform(values, true));
  assert(values == original);
}

static void test_ntt_random() {
  std::mt19937 rng(31415926);
  for (int it = 0; it < 260; ++it) {
    const int n = 1 + static_cast<int>(rng() % 70);
    const int m = 1 + static_cast<int>(rng() % 70);

    std::vector<int> a(n, 0);
    std::vector<int> b(m, 0);
    for (int i = 0; i < n; ++i) {
      a[i] = static_cast<int>(rng() % 998244353);
    }
    for (int i = 0; i < m; ++i) {
      b[i] = static_cast<int>(rng() % 998244353);
    }

    const std::vector<int> expected = naive_convolution_mod(a, b, 998244353);
    const std::vector<int> got = convolution_ntt_int(a, b);
    assert(got == expected);
  }
}

static void test_ntt_transform_guard() {
  std::vector<int> values(3, 0);
  assert(!ntt_transform(values, false));
}

int main() {
  test_fft_basic();
  test_fft_random();
  test_fft_transform_guard();
  test_ntt_basic();
  test_ntt_roundtrip();
  test_ntt_random();
  test_ntt_transform_guard();
  return 0;
}

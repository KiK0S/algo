#include <algorithm>
#include <cassert>
#include <random>
#include <vector>

#include "../lib/berlekamp_massey.hpp"
#include "../lib/modint.hpp"

using Mint = edulcni::StaticModInt<998244353>;

static std::vector<Mint> generate_sequence(const std::vector<Mint>& initial,
                                           const std::vector<Mint>& coefficients,
                                           int length) {
  std::vector<Mint> sequence(length, Mint(0));
  const int seed_count = std::min(length, static_cast<int>(initial.size()));
  for (int i = 0; i < seed_count; ++i) {
    sequence[i] = initial[i];
  }

  const int order = static_cast<int>(coefficients.size());
  for (int i = seed_count; i < length; ++i) {
    Mint next(0);
    for (int j = 0; j < order; ++j) {
      next += coefficients[j] * sequence[i - 1 - j];
    }
    sequence[i] = next;
  }
  return sequence;
}

static void test_fibonacci_recurrence() {
  const std::vector<Mint> sequence = {
      Mint(0),  Mint(1),  Mint(1),  Mint(2),  Mint(3),  Mint(5),
      Mint(8),  Mint(13), Mint(21), Mint(34), Mint(55), Mint(89),
  };

  const std::vector<Mint> coefficients = edulcni::berlekamp_massey(sequence);
  assert(coefficients.size() == 2);
  assert(coefficients[0] == Mint(1));
  assert(coefficients[1] == Mint(1));

  const std::vector<Mint> initial = {Mint(0), Mint(1)};
  for (int i = 0; i < static_cast<int>(sequence.size()); ++i) {
    assert(edulcni::linear_recurrence_kth(initial, coefficients, i) ==
           sequence[i]);
    assert(edulcni::berlekamp_massey_kth(sequence, i) == sequence[i]);
  }

  assert(edulcni::linear_recurrence_kth(initial, coefficients, 30).value() ==
         832040);
  assert(edulcni::berlekamp_massey_kth(sequence, 30).value() == 832040);
}

static void test_geometric_progression() {
  const std::vector<Mint> sequence = {
      Mint(7), Mint(21), Mint(63), Mint(189), Mint(567), Mint(1701),
  };

  const std::vector<Mint> coefficients = edulcni::berlekamp_massey(sequence);
  assert(coefficients.size() == 1);
  assert(coefficients[0] == Mint(3));

  const std::vector<Mint> initial = {Mint(7)};
  Mint current(7);
  for (int i = 0; i < 12; ++i) {
    assert(edulcni::linear_recurrence_kth(initial, coefficients, i) == current);
    current *= Mint(3);
  }
}

static void test_zero_sequence() {
  const std::vector<Mint> sequence(12, Mint(0));
  const std::vector<Mint> coefficients = edulcni::berlekamp_massey(sequence);
  assert(coefficients.empty());
  assert(edulcni::linear_recurrence_kth(sequence, coefficients, 100) == Mint(0));
  assert(edulcni::berlekamp_massey_kth(sequence, 100) == Mint(0));

  const std::vector<Mint> empty;
  assert(edulcni::berlekamp_massey(empty).empty());
  assert(edulcni::linear_recurrence_kth(empty, empty, 5) == Mint(0));
  assert(edulcni::berlekamp_massey_kth(empty, 5) == Mint(0));
}

static void test_random_recurrences() {
  std::mt19937 rng(20260318);

  for (int it = 0; it < 250; ++it) {
    const int order = 1 + static_cast<int>(rng() % 8);
    std::vector<Mint> coefficients(order, Mint(0));
    std::vector<Mint> initial(order, Mint(0));

    for (int i = 0; i < order; ++i) {
      coefficients[i] = Mint(static_cast<int>(rng() % 50));
      initial[i] = Mint(static_cast<int>(rng() % 50));
    }
    coefficients.back() = Mint(1 + static_cast<int>(rng() % 50));

    const int prefix_length = 4 * order + 20;
    const int total_length = prefix_length + 40;
    const std::vector<Mint> full =
        generate_sequence(initial, coefficients, total_length);
    const std::vector<Mint> prefix(full.begin(), full.begin() + prefix_length);

    const std::vector<Mint> recovered = edulcni::berlekamp_massey(prefix);
    const int recovered_order = static_cast<int>(recovered.size());
    std::vector<Mint> recovered_initial(recovered_order, Mint(0));
    for (int i = 0; i < recovered_order; ++i) {
      recovered_initial[i] = prefix[i];
    }

    for (int i = 0; i < total_length; ++i) {
      assert(edulcni::linear_recurrence_kth(recovered_initial, recovered, i) ==
             full[i]);
      assert(edulcni::berlekamp_massey_kth(prefix, i) == full[i]);
    }
  }
}

int main() {
  test_fibonacci_recurrence();
  test_geometric_progression();
  test_zero_sequence();
  test_random_recurrences();
  return 0;
}

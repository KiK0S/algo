#include <cassert>
#include <functional>
#include <random>
#include <vector>

#include "../lib/monotonic_stack.hpp"

template <typename T, typename Pred>
static std::vector<int> brute_left(const std::vector<T>& values, Pred pred) {
  const int n = static_cast<int>(values.size());
  std::vector<int> result(n, -1);
  for (int i = 0; i < n; ++i) {
    for (int j = i - 1; j >= 0; --j) {
      if (pred(values[j], values[i])) {
        result[i] = j;
        break;
      }
    }
  }
  return result;
}

template <typename T, typename Pred>
static std::vector<int> brute_right(const std::vector<T>& values, Pred pred) {
  const int n = static_cast<int>(values.size());
  std::vector<int> result(n, -1);
  for (int i = 0; i < n; ++i) {
    for (int j = i + 1; j < n; ++j) {
      if (pred(values[j], values[i])) {
        result[i] = j;
        break;
      }
    }
  }
  return result;
}

static void test_fixed_example() {
  const std::vector<int> values = {5, 2, 4, 4, 1, 3};
  assert((edulcni::nearest_smaller_left(values, true) ==
          std::vector<int>{-1, -1, 1, 1, -1, 4}));
  assert((edulcni::nearest_greater_right(values, true) ==
          std::vector<int>{-1, 2, -1, -1, 5, -1}));
  assert((edulcni::nearest_smaller_left(values, false) ==
          std::vector<int>{-1, -1, 1, 2, -1, 4}));
}

static void test_random_against_bruteforce() {
  std::mt19937 rng(20260226);
  for (int it = 0; it < 500; ++it) {
    const int n = 1 + static_cast<int>(rng() % 80);
    std::vector<int> values(n, 0);
    for (int i = 0; i < n; ++i) {
      values[i] = static_cast<int>(rng() % 31) - 15;
    }

    const auto left_smaller_strict = edulcni::nearest_smaller_left(values, true);
    const auto right_smaller_strict = edulcni::nearest_smaller_right(values, true);
    const auto left_greater_strict = edulcni::nearest_greater_left(values, true);
    const auto right_greater_strict = edulcni::nearest_greater_right(values, true);

    assert(left_smaller_strict == brute_left(values, std::less<int>()));
    assert(right_smaller_strict == brute_right(values, std::less<int>()));
    assert(left_greater_strict == brute_left(values, std::greater<int>()));
    assert(right_greater_strict == brute_right(values, std::greater<int>()));

    const auto left_smaller_nonstrict = edulcni::nearest_smaller_left(values, false);
    const auto right_smaller_nonstrict = edulcni::nearest_smaller_right(values, false);
    const auto left_greater_nonstrict = edulcni::nearest_greater_left(values, false);
    const auto right_greater_nonstrict = edulcni::nearest_greater_right(values, false);

    assert(left_smaller_nonstrict ==
           brute_left(values, [](int a, int b) { return a <= b; }));
    assert(right_smaller_nonstrict ==
           brute_right(values, [](int a, int b) { return a <= b; }));
    assert(left_greater_nonstrict ==
           brute_left(values, [](int a, int b) { return a >= b; }));
    assert(right_greater_nonstrict ==
           brute_right(values, [](int a, int b) { return a >= b; }));
  }
}

int main() {
  test_fixed_example();
  test_random_against_bruteforce();
  return 0;
}

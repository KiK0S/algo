#include <algorithm>
#include <cassert>
#include <numeric>
#include <random>
#include <string>
#include <vector>

#include "../lib/suffix_array.hpp"

template <typename T>
static bool lex_suffix_less(const std::vector<T>& values, int i, int j) {
  const int n = static_cast<int>(values.size());
  while (i < n && j < n && values[i] == values[j]) {
    ++i;
    ++j;
  }
  if (i == n || j == n) {
    return i == n && j != n;
  }
  return values[i] < values[j];
}

template <typename T>
static std::vector<int> naive_suffix_array(const std::vector<T>& values) {
  const int n = static_cast<int>(values.size());
  std::vector<int> sa(n + 1, 0);
  std::iota(sa.begin(), sa.end(), 0);
  std::sort(sa.begin(), sa.end(), [&](int lhs, int rhs) {
    if (lhs == n || rhs == n) {
      return lhs == n && rhs != n;
    }
    return lex_suffix_less(values, lhs, rhs);
  });
  return sa;
}

template <typename T>
static std::vector<int> naive_lcp(const std::vector<T>& values,
                                  const std::vector<int>& sa) {
  const int n = static_cast<int>(values.size());
  std::vector<int> lcp(sa.size(), 0);
  for (int i = 1; i < static_cast<int>(sa.size()); ++i) {
    int a = sa[i - 1];
    int b = sa[i];
    int len = 0;
    while (a + len < n && b + len < n && values[a + len] == values[b + len]) {
      ++len;
    }
    lcp[i] = len;
  }
  return lcp;
}

static void check_rank_inverse(const edulcni::SuffixArrayResult& result) {
  for (int i = 0; i < static_cast<int>(result.sa.size()); ++i) {
    assert(result.rank[result.sa[i]] == i);
  }
}

static void test_string_basic() {
  const std::string text = "banana";
  const edulcni::SuffixArrayResult result = edulcni::suffix_array_build(text);

  const std::vector<int> expected_sa = {6, 5, 3, 1, 0, 4, 2};
  const std::vector<int> expected_lcp = {0, 0, 1, 3, 0, 0, 2};
  assert(result.sa == expected_sa);
  assert(result.lcp == expected_lcp);
  check_rank_inverse(result);

  const std::vector<int> stripped =
      edulcni::suffix_array_remove_empty_suffix(result);
  assert(stripped == std::vector<int>({5, 3, 1, 0, 4, 2}));
}

static void test_empty_and_repeated() {
  {
    const edulcni::SuffixArrayResult result = edulcni::suffix_array_build("");
    assert(result.sa == std::vector<int>({0}));
    assert(result.lcp == std::vector<int>({0}));
    assert(result.rank == std::vector<int>({0}));
  }
  {
    const edulcni::SuffixArrayResult result = edulcni::suffix_array_build("aaaa");
    assert(result.sa == std::vector<int>({4, 3, 2, 1, 0}));
    assert(result.lcp == std::vector<int>({0, 0, 1, 2, 3}));
    check_rank_inverse(result);
  }
}

static void test_random_strings() {
  std::mt19937 rng(20260226);
  for (int it = 0; it < 700; ++it) {
    const int n = static_cast<int>(rng() % 35);
    const int alphabet = 1 + static_cast<int>(rng() % 8);
    std::vector<int> values(n, 0);
    std::string text(n, '\0');

    for (int i = 0; i < n; ++i) {
      values[i] = static_cast<int>(rng() % alphabet);
      text[i] = static_cast<char>(values[i]);
    }

    const std::vector<int> expected_sa = naive_suffix_array(values);
    const std::vector<int> expected_lcp = naive_lcp(values, expected_sa);

    const edulcni::SuffixArrayResult result = edulcni::suffix_array_build(text);
    assert(result.sa == expected_sa);
    assert(result.lcp == expected_lcp);
    check_rank_inverse(result);
  }
}

static void test_random_ints() {
  std::mt19937 rng(11223344);
  for (int it = 0; it < 650; ++it) {
    const int n = static_cast<int>(rng() % 35);
    std::vector<int> values(n, 0);
    for (int i = 0; i < n; ++i) {
      values[i] = static_cast<int>(rng() % 21) - 10;
    }

    const std::vector<int> expected_sa = naive_suffix_array(values);
    const std::vector<int> expected_lcp = naive_lcp(values, expected_sa);

    const edulcni::SuffixArrayResult result =
        edulcni::suffix_array_build_from_ints(values);
    assert(result.sa == expected_sa);
    assert(result.lcp == expected_lcp);
    check_rank_inverse(result);
  }
}

int main() {
  test_string_basic();
  test_empty_and_repeated();
  test_random_strings();
  test_random_ints();
  return 0;
}

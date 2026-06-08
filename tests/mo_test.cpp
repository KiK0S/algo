#include <algorithm>
#include <cassert>
#include <cmath>
#include <numeric>
#include <random>
#include <type_traits>
#include <vector>

#include "../lib/solvers/mo.hpp"

static int brute_distinct(const std::vector<int>& values, int left, int right) {
  left = std::max(0, std::min(left, static_cast<int>(values.size())));
  right = std::max(0, std::min(right, static_cast<int>(values.size())));
  if (left > right) {
    std::swap(left, right);
  }
  std::vector<int> seen(101, 0);
  int distinct = 0;
  for (int i = left; i < right; ++i) {
    if (seen[values[i]]++ == 0) {
      ++distinct;
    }
  }
  return distinct;
}

static void test_order_is_permutation() {
  const std::vector<MoQuery> queries = {
      {0, 4},
      {2, 7},
      {1, 1},
      {6, 9},
      {-2, 5},
  };
  const std::vector<int> order = mo_order(queries, 10);
  assert(order.size() == queries.size());
  std::vector<int> sorted = order;
  std::sort(sorted.begin(), sorted.end());
  for (int i = 0; i < static_cast<int>(sorted.size()); ++i) {
    assert(sorted[i] == i);
  }
}

static void test_distinct_queries_random() {
  std::mt19937 rng(20260226);
  for (int it = 0; it < 450; ++it) {
    const int n = 1 + static_cast<int>(rng() % 120);
    std::vector<int> values(n, 0);
    for (int i = 0; i < n; ++i) {
      values[i] = static_cast<int>(rng() % 35);
    }

    const int q = 1 + static_cast<int>(rng() % 200);
    std::vector<MoQuery> queries;
    queries.reserve(q);
    for (int i = 0; i < q; ++i) {
      const int l = static_cast<int>(rng() % (n + 10)) - 5;
      const int r = static_cast<int>(rng() % (n + 10)) - 5;
      queries.push_back(MoQuery(l, r));
    }

    std::vector<int> freq(35, 0);
    int distinct = 0;
    const auto add = [&](int idx) {
      if (++freq[values[idx]] == 1) {
        ++distinct;
      }
    };
    const auto remove = [&](int idx) {
      if (--freq[values[idx]] == 0) {
        --distinct;
      }
    };
    const auto answer = [&]() { return distinct; };

    const std::vector<int> got = mo_process(
        n, queries, add, add, remove, remove, answer);
    for (int i = 0; i < q; ++i) {
      const int expected = brute_distinct(values, queries[i].left, queries[i].right);
      assert(got[i] == expected);
    }
  }
}

int main() {
  test_order_is_permutation();
  test_distinct_queries_random();
  return 0;
}

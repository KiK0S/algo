#include <algorithm>
#include <cassert>
#include <functional>
#include <limits>
#include <random>
#include <vector>

#include "../lib/solvers/hungarian.hpp"

static long long brute_min_assignment(const std::vector<std::vector<long long>>& cost) {
  const int n = static_cast<int>(cost.size());
  const int m = (n == 0 ? 0 : static_cast<int>(cost[0].size()));
  if (n == 0 || m == 0) {
    return 0;
  }
  if (n > m) {
    std::vector<std::vector<long long>> transposed(m, std::vector<long long>(n, 0));
    for (int i = 0; i < n; ++i) {
      for (int j = 0; j < m; ++j) {
        transposed[j][i] = cost[i][j];
      }
    }
    return brute_min_assignment(transposed);
  }

  long long best = std::numeric_limits<long long>::max();
  std::vector<char> used(m, 0);

  std::function<void(int, long long)> dfs = [&](int row, long long total) {
    if (row == n) {
      best = std::min(best, total);
      return;
    }
    for (int col = 0; col < m; ++col) {
      if (used[col]) {
        continue;
      }
      used[col] = 1;
      dfs(row + 1, total + cost[row][col]);
      used[col] = 0;
    }
  };

  dfs(0, 0LL);
  return best;
}

static long long brute_max_assignment(const std::vector<std::vector<long long>>& value) {
  const int n = static_cast<int>(value.size());
  const int m = (n == 0 ? 0 : static_cast<int>(value[0].size()));
  if (n == 0 || m == 0) {
    return 0;
  }
  if (n > m) {
    std::vector<std::vector<long long>> transposed(m, std::vector<long long>(n, 0));
    for (int i = 0; i < n; ++i) {
      for (int j = 0; j < m; ++j) {
        transposed[j][i] = value[i][j];
      }
    }
    return brute_max_assignment(transposed);
  }

  long long best = std::numeric_limits<long long>::lowest();
  std::vector<char> used(m, 0);
  std::function<void(int, long long)> dfs = [&](int row, long long total) {
    if (row == n) {
      best = std::max(best, total);
      return;
    }
    for (int col = 0; col < m; ++col) {
      if (used[col]) {
        continue;
      }
      used[col] = 1;
      dfs(row + 1, total + value[row][col]);
      used[col] = 0;
    }
  };
  dfs(0, 0LL);
  return best;
}

static long long matching_cost(const std::vector<std::vector<long long>>& cost,
                               const std::vector<int>& match_left) {
  long long total = 0;
  for (int row = 0; row < static_cast<int>(match_left.size()); ++row) {
    const int col = match_left[row];
    if (col != -1) {
      total += cost[row][col];
    }
  }
  return total;
}

static void validate_matching(const std::vector<int>& match_left,
                              const std::vector<int>& match_right) {
  std::vector<int> used_right(match_right.size(), -1);
  for (int row = 0; row < static_cast<int>(match_left.size()); ++row) {
    const int col = match_left[row];
    if (col == -1) {
      continue;
    }
    assert(col >= 0 && col < static_cast<int>(match_right.size()));
    assert(match_right[col] == row);
    assert(used_right[col] == -1);
    used_right[col] = row;
  }
}

static void test_hungarian_basic() {
  const std::vector<std::vector<long long>> cost = {
      {4, 1, 3},
      {2, 0, 5},
      {3, 2, 2},
  };
  const HungarianResult<long long> result = hungarian(cost);
  assert(result.min_cost == 5);
  validate_matching(result.match_left, result.match_right);
  assert(matching_cost(cost, result.match_left) == result.min_cost);
}

static void test_hungarian_rectangular() {
  const std::vector<std::vector<long long>> cost = {
      {6, 4, 8, 5},
      {9, 7, 3, 4},
  };
  const HungarianResult<long long> result = hungarian(cost);
  validate_matching(result.match_left, result.match_right);
  assert(result.min_cost == brute_min_assignment(cost));
  assert(matching_cost(cost, result.match_left) == result.min_cost);
}

static void test_hungarian_more_rows_than_cols() {
  const std::vector<std::vector<long long>> cost = {
      {5, 2},
      {4, 7},
      {1, 6},
      {8, 3},
  };
  const HungarianResult<long long> result = hungarian(cost);
  validate_matching(result.match_left, result.match_right);
  assert(result.min_cost == brute_min_assignment(cost));
  assert(matching_cost(cost, result.match_left) == result.min_cost);
}

static void test_hungarian_random() {
  std::mt19937 rng(20260227);
  for (int it = 0; it < 300; ++it) {
    const int n = 1 + static_cast<int>(rng() % 6);
    const int m = 1 + static_cast<int>(rng() % 6);
    std::vector<std::vector<long long>> cost(n, std::vector<long long>(m, 0));
    for (int i = 0; i < n; ++i) {
      for (int j = 0; j < m; ++j) {
        cost[i][j] = static_cast<long long>(static_cast<int>(rng() % 31) - 15);
      }
    }

    const HungarianResult<long long> result = hungarian(cost);
    validate_matching(result.match_left, result.match_right);
    assert(result.min_cost == brute_min_assignment(cost));
    assert(matching_cost(cost, result.match_left) == result.min_cost);
  }
}

static void test_hungarian_maximize() {
  const std::vector<std::vector<long long>> value = {
      {3, 1, 7},
      {2, 8, 4},
      {6, 5, 9},
  };
  const HungarianResult<long long> result = hungarian_maximize(value);
  validate_matching(result.match_left, result.match_right);
  assert(result.min_cost == brute_max_assignment(value));
}

int main() {
  test_hungarian_basic();
  test_hungarian_rectangular();
  test_hungarian_more_rows_than_cols();
  test_hungarian_random();
  test_hungarian_maximize();
  return 0;
}

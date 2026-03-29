#ifndef EDULCNI_HUNGARIAN_HPP
#define EDULCNI_HUNGARIAN_HPP

namespace edulcni {

template <typename Cost>
struct HungarianResult {
  Cost min_cost;
  std::vector<int> match_left;
  std::vector<int> match_right;

  HungarianResult() : min_cost(Cost()) {}
};

template <typename Cost>
inline HungarianResult<Cost> hungarian_internal(
    const std::vector<std::vector<Cost>>& cost, Cost inf) {
  HungarianResult<Cost> result;

  const int n = static_cast<int>(cost.size());
  const int m = (n == 0 ? 0 : static_cast<int>(cost[0].size()));
  result.match_left.assign(n, -1);
  result.match_right.assign(m, -1);
  if (n == 0 || m == 0) {
    result.min_cost = Cost(0);
    return result;
  }

  std::vector<Cost> u(n + 1, Cost(0));
  std::vector<Cost> v(m + 1, Cost(0));
  std::vector<int> p(m + 1, 0);
  std::vector<int> way(m + 1, 0);

  for (int i = 1; i <= n; ++i) {
    p[0] = i;
    int j0 = 0;
    std::vector<Cost> minv(m + 1, inf);
    std::vector<char> used(m + 1, 0);

    do {
      used[j0] = 1;
      const int i0 = p[j0];
      int j1 = 0;
      Cost delta = inf;

      for (int j = 1; j <= m; ++j) {
        if (used[j]) {
          continue;
        }
        const Cost current = cost[i0 - 1][j - 1] - u[i0] - v[j];
        if (current < minv[j]) {
          minv[j] = current;
          way[j] = j0;
        }
        if (minv[j] < delta) {
          delta = minv[j];
          j1 = j;
        }
      }

      for (int j = 0; j <= m; ++j) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }
      j0 = j1;
    } while (p[j0] != 0);

    do {
      const int j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0 != 0);
  }

  result.min_cost = Cost(0);
  for (int j = 1; j <= m; ++j) {
    if (p[j] != 0) {
      const int row = p[j] - 1;
      const int col = j - 1;
      result.match_left[row] = col;
      result.match_right[col] = row;
      result.min_cost += cost[row][col];
    }
  }
  return result;
}

template <typename Cost>
inline HungarianResult<Cost> hungarian(
    const std::vector<std::vector<Cost>>& cost,
    Cost inf = std::numeric_limits<Cost>::max() / Cost(4)) {
  HungarianResult<Cost> result;
  const int n = static_cast<int>(cost.size());
  const int m = (n == 0 ? 0 : static_cast<int>(cost[0].size()));
  result.match_left.assign(n, -1);
  result.match_right.assign(m, -1);
  result.min_cost = Cost(0);

  if (n == 0 || m == 0) {
    return result;
  }
  for (int i = 1; i < n; ++i) {
    if (static_cast<int>(cost[i].size()) != m) {
      return result;
    }
  }

  if (n <= m) {
    return hungarian_internal(cost, inf);
  }

  std::vector<std::vector<Cost>> transposed(m, std::vector<Cost>(n, Cost(0)));
  for (int i = 0; i < n; ++i) {
    for (int j = 0; j < m; ++j) {
      transposed[j][i] = cost[i][j];
    }
  }

  const HungarianResult<Cost> transposed_result = hungarian_internal(transposed, inf);
  result.min_cost = transposed_result.min_cost;
  for (int col = 0; col < m; ++col) {
    const int row = transposed_result.match_left[col];
    if (row != -1) {
      result.match_left[row] = col;
      result.match_right[col] = row;
    }
  }
  return result;
}

template <typename Cost>
inline HungarianResult<Cost> hungarian_maximize(
    const std::vector<std::vector<Cost>>& value) {
  HungarianResult<Cost> result;
  const int n = static_cast<int>(value.size());
  const int m = (n == 0 ? 0 : static_cast<int>(value[0].size()));
  result.match_left.assign(n, -1);
  result.match_right.assign(m, -1);
  result.min_cost = Cost(0);
  if (n == 0 || m == 0) {
    return result;
  }
  for (int i = 1; i < n; ++i) {
    if (static_cast<int>(value[i].size()) != m) {
      return result;
    }
  }

  Cost max_value = value[0][0];
  for (int i = 0; i < n; ++i) {
    for (int j = 0; j < m; ++j) {
      if (value[i][j] > max_value) {
        max_value = value[i][j];
      }
    }
  }

  std::vector<std::vector<Cost>> transformed(n, std::vector<Cost>(m, Cost(0)));
  for (int i = 0; i < n; ++i) {
    for (int j = 0; j < m; ++j) {
      transformed[i][j] = max_value - value[i][j];
    }
  }

  result = hungarian(transformed);
  if (!result.match_left.empty() || n == 0 || m == 0) {
    Cost max_sum = Cost(0);
    for (int i = 0; i < n; ++i) {
      if (result.match_left[i] != -1) {
        max_sum += value[i][result.match_left[i]];
      }
    }
    result.min_cost = max_sum;
  }
  return result;
}

}  // namespace edulcni

#endif  // EDULCNI_HUNGARIAN_HPP

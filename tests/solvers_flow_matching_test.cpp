#include <algorithm>
#include <cassert>
#include <limits>
#include <queue>
#include <vector>

#include "../lib/solvers/hungarian.hpp"
#include "../lib/solvers/kuhn.hpp"
#include "../lib/solvers/maxflow_dinic.hpp"
#include "../lib/solvers/mincost_maxflow.hpp"

static void test_dinic_solver_path() {
  Dinic<int> dinic(4);
  dinic.add_edge(0, 1, 2);
  dinic.add_edge(0, 2, 1);
  dinic.add_edge(1, 2, 1);
  dinic.add_edge(1, 3, 1);
  dinic.add_edge(2, 3, 2);
  assert(dinic.max_flow(0, 3) == 3);
}

static void test_mincost_solver_path() {
  MinCostMaxFlow<int, long long> flow(4);
  flow.add_edge(0, 1, 1, 2);
  flow.add_edge(0, 2, 1, 5);
  flow.add_edge(1, 3, 1, 3);
  flow.add_edge(2, 3, 1, 1);
  const auto result = flow.min_cost_flow(0, 3, 2);
  assert(result.first == 2);
  assert(result.second == 11);
}

static void test_hungarian_solver_path() {
  const std::vector<std::vector<long long>> cost = {
      {4, 1, 3},
      {2, 0, 5},
      {3, 2, 2},
  };
  const auto result = hungarian(cost);
  assert(result.min_cost == 5);
  assert(result.match_left.size() == 3);
}

static void test_kuhn_solver_path() {
  KuhnMatcher matcher(3, 3);
  matcher.add_edge(0, 0);
  matcher.add_edge(0, 1);
  matcher.add_edge(1, 1);
  matcher.add_edge(2, 1);
  matcher.add_edge(2, 2);
  const auto result = matcher.maximum_matching();
  assert(result.matching_size == 3);
}

int main() {
  test_dinic_solver_path();
  test_mincost_solver_path();
  test_hungarian_solver_path();
  test_kuhn_solver_path();
  return 0;
}

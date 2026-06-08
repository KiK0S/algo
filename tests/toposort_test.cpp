#include <algorithm>
#include <cassert>
#include <queue>
#include <random>
#include <vector>

#include "../lib/solvers/toposort.hpp"

static void test_toposort_basic() {
  std::vector<std::vector<int>> graph(6);
  toposort_add_edge(graph, 5, 2);
  toposort_add_edge(graph, 5, 0);
  toposort_add_edge(graph, 4, 0);
  toposort_add_edge(graph, 4, 1);
  toposort_add_edge(graph, 2, 3);
  toposort_add_edge(graph, 3, 1);

  bool dag = false;
  const std::vector<int> order = topological_sort(graph, &dag);
  assert(dag);
  assert(static_cast<int>(order.size()) == 6);
  assert(is_topological_order(graph, order));
}

static void test_toposort_cycle() {
  std::vector<std::vector<int>> graph(4);
  toposort_add_edge(graph, 0, 1);
  toposort_add_edge(graph, 1, 2);
  toposort_add_edge(graph, 2, 0);

  bool dag = true;
  const std::vector<int> order = topological_sort(graph, &dag);
  assert(!dag);
  assert(order.empty());
}

static void test_toposort_random_dag() {
  std::mt19937 rng(20260226);
  for (int it = 0; it < 350; ++it) {
    const int n = 1 + static_cast<int>(rng() % 90);
    std::vector<std::vector<int>> graph(n);
    std::vector<int> permutation(n, 0);
    for (int i = 0; i < n; ++i) {
      permutation[i] = i;
    }
    std::shuffle(permutation.begin(), permutation.end(), rng);

    const int m = static_cast<int>(rng() % (n * n / 3 + 1));
    for (int i = 0; i < m; ++i) {
      int a = static_cast<int>(rng() % n);
      int b = static_cast<int>(rng() % n);
      if (a == b) {
        continue;
      }
      if (permutation[a] < permutation[b]) {
        graph[a].push_back(b);
      } else {
        graph[b].push_back(a);
      }
    }

    bool dag = false;
    const std::vector<int> order = topological_sort(graph, &dag);
    assert(dag);
    assert(is_topological_order(graph, order));
  }
}

static void test_is_topological_order_validation() {
  std::vector<std::vector<int>> graph(3);
  graph[0].push_back(1);
  graph[1].push_back(2);

  assert(is_topological_order(graph, {0, 1, 2}));
  assert(!is_topological_order(graph, {1, 0, 2}));
  assert(!is_topological_order(graph, {0, 2}));
  assert(!is_topological_order(graph, {0, 0, 2}));
}

int main() {
  test_toposort_basic();
  test_toposort_cycle();
  test_toposort_random_dag();
  test_is_topological_order_validation();
  return 0;
}

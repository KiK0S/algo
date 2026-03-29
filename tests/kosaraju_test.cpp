#include <algorithm>
#include <cassert>
#include <functional>
#include <random>
#include <vector>

#include "../lib/kosaraju.hpp"

static std::vector<std::vector<char>> all_reachable(
    const std::vector<std::vector<int>>& graph) {
  const int n = static_cast<int>(graph.size());
  std::vector<std::vector<char>> reach(n, std::vector<char>(n, 0));

  for (int source = 0; source < n; ++source) {
    std::vector<int> stack(1, source);
    reach[source][source] = 1;
    while (!stack.empty()) {
      const int v = stack.back();
      stack.pop_back();
      for (int to : graph[v]) {
        if (to < 0 || to >= n || reach[source][to]) {
          continue;
        }
        reach[source][to] = 1;
        stack.push_back(to);
      }
    }
  }
  return reach;
}

static void test_kosaraju_basic() {
  std::vector<std::vector<int>> graph(8);
  edulcni::kosaraju_add_edge(graph, 0, 1);
  edulcni::kosaraju_add_edge(graph, 1, 2);
  edulcni::kosaraju_add_edge(graph, 2, 0);
  edulcni::kosaraju_add_edge(graph, 2, 3);
  edulcni::kosaraju_add_edge(graph, 3, 4);
  edulcni::kosaraju_add_edge(graph, 4, 5);
  edulcni::kosaraju_add_edge(graph, 5, 3);
  edulcni::kosaraju_add_edge(graph, 6, 5);
  edulcni::kosaraju_add_edge(graph, 6, 7);
  edulcni::kosaraju_add_edge(graph, 7, 6);

  const edulcni::KosarajuResult scc = edulcni::kosaraju_scc(graph);
  assert(scc.component_count == 3);
  assert(scc.component_of[0] == scc.component_of[1]);
  assert(scc.component_of[1] == scc.component_of[2]);
  assert(scc.component_of[3] == scc.component_of[4]);
  assert(scc.component_of[4] == scc.component_of[5]);
  assert(scc.component_of[6] == scc.component_of[7]);
  assert(scc.component_of[0] != scc.component_of[3]);
  assert(scc.component_of[3] != scc.component_of[6]);
}

static void test_kosaraju_random() {
  std::mt19937 rng(20260227);
  for (int it = 0; it < 300; ++it) {
    const int n = 1 + static_cast<int>(rng() % 45);
    std::vector<std::vector<int>> graph(n);

    const int m = static_cast<int>(rng() % (n * n + 1));
    for (int i = 0; i < m; ++i) {
      const int from = static_cast<int>(rng() % n);
      const int to = static_cast<int>(rng() % n);
      graph[from].push_back(to);
    }

    const edulcni::KosarajuResult scc = edulcni::kosaraju_scc(graph);
    const std::vector<std::vector<char>> reach = all_reachable(graph);

    assert(static_cast<int>(scc.component_of.size()) == n);
    assert(static_cast<int>(scc.components.size()) == scc.component_count);
    assert(static_cast<int>(scc.condensation_dag.size()) == scc.component_count);

    for (int v = 0; v < n; ++v) {
      assert(scc.component_of[v] >= 0 && scc.component_of[v] < scc.component_count);
    }

    for (int a = 0; a < n; ++a) {
      for (int b = 0; b < n; ++b) {
        const bool same = scc.component_of[a] == scc.component_of[b];
        const bool mutually_reachable = reach[a][b] && reach[b][a];
        assert(same == mutually_reachable);
      }
    }

    for (int comp = 0; comp < scc.component_count; ++comp) {
      for (int to_comp : scc.condensation_dag[comp]) {
        assert(comp != to_comp);
        assert(comp < to_comp);
      }
    }
  }
}

int main() {
  test_kosaraju_basic();
  test_kosaraju_random();
  return 0;
}

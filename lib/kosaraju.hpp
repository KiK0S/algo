#ifndef EDULCNI_KOSARAJU_HPP
#define EDULCNI_KOSARAJU_HPP

namespace edulcni {

struct KosarajuResult {
  int component_count;
  std::vector<int> component_of;
  std::vector<std::vector<int>> components;
  std::vector<std::vector<int>> condensation_dag;
};

inline void kosaraju_add_edge(std::vector<std::vector<int>>& graph, int from, int to) {
  const int n = static_cast<int>(graph.size());
  if (from < 0 || from >= n || to < 0 || to >= n) {
    return;
  }
  graph[from].push_back(to);
}

inline KosarajuResult kosaraju_scc(const std::vector<std::vector<int>>& graph) {
  const int n = static_cast<int>(graph.size());
  std::vector<std::vector<int>> reverse_graph(n);
  for (int v = 0; v < n; ++v) {
    for (int to : graph[v]) {
      if (to >= 0 && to < n) {
        reverse_graph[to].push_back(v);
      }
    }
  }

  std::vector<char> used(n, 0);
  std::vector<int> order;
  order.reserve(n);

  std::function<void(int)> dfs1 = [&](int v) {
    used[v] = 1;
    for (int to : graph[v]) {
      if (to < 0 || to >= n || used[to]) {
        continue;
      }
      dfs1(to);
    }
    order.push_back(v);
  };

  for (int v = 0; v < n; ++v) {
    if (!used[v]) {
      dfs1(v);
    }
  }

  KosarajuResult result;
  result.component_of.assign(n, -1);
  result.component_count = 0;

  std::function<void(int, int)> dfs2 = [&](int v, int comp) {
    result.component_of[v] = comp;
    result.components[comp].push_back(v);
    for (int to : reverse_graph[v]) {
      if (result.component_of[to] == -1) {
        dfs2(to, comp);
      }
    }
  };

  for (int i = n - 1; i >= 0; --i) {
    const int v = order[i];
    if (result.component_of[v] != -1) {
      continue;
    }
    result.components.push_back(std::vector<int>());
    dfs2(v, result.component_count);
    ++result.component_count;
  }

  result.condensation_dag.assign(result.component_count, std::vector<int>());
  for (int v = 0; v < n; ++v) {
    const int from_comp = result.component_of[v];
    for (int to : graph[v]) {
      if (to < 0 || to >= n) {
        continue;
      }
      const int to_comp = result.component_of[to];
      if (from_comp != to_comp) {
        result.condensation_dag[from_comp].push_back(to_comp);
      }
    }
  }
  for (int comp = 0; comp < result.component_count; ++comp) {
    std::vector<int>& edges = result.condensation_dag[comp];
    std::sort(edges.begin(), edges.end());
    edges.erase(std::unique(edges.begin(), edges.end()), edges.end());
  }

  return result;
}

}  // namespace edulcni

#endif  // EDULCNI_KOSARAJU_HPP

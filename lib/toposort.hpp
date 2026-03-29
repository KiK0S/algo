#ifndef EDULCNI_TOPOSORT_HPP
#define EDULCNI_TOPOSORT_HPP

namespace edulcni {

inline void toposort_add_edge(std::vector<std::vector<int>>& graph, int from, int to) {
  const int n = static_cast<int>(graph.size());
  if (from < 0 || from >= n || to < 0 || to >= n) {
    return;
  }
  graph[from].push_back(to);
}

inline std::vector<int> topological_sort(const std::vector<std::vector<int>>& graph,
                                         bool* is_dag = nullptr) {
  const int n = static_cast<int>(graph.size());
  std::vector<int> indegree(n, 0);
  for (int v = 0; v < n; ++v) {
    for (int to : graph[v]) {
      if (to >= 0 && to < n) {
        ++indegree[to];
      }
    }
  }

  std::queue<int> q;
  for (int v = 0; v < n; ++v) {
    if (indegree[v] == 0) {
      q.push(v);
    }
  }

  std::vector<int> order;
  order.reserve(n);
  while (!q.empty()) {
    const int v = q.front();
    q.pop();
    order.push_back(v);
    for (int to : graph[v]) {
      if (to < 0 || to >= n) {
        continue;
      }
      --indegree[to];
      if (indegree[to] == 0) {
        q.push(to);
      }
    }
  }

  const bool dag = static_cast<int>(order.size()) == n;
  if (is_dag != nullptr) {
    *is_dag = dag;
  }
  if (!dag) {
    return {};
  }
  return order;
}

inline bool is_topological_order(const std::vector<std::vector<int>>& graph,
                                 const std::vector<int>& order) {
  const int n = static_cast<int>(graph.size());
  if (static_cast<int>(order.size()) != n) {
    return false;
  }

  std::vector<int> position(n, -1);
  for (int i = 0; i < n; ++i) {
    const int v = order[i];
    if (v < 0 || v >= n || position[v] != -1) {
      return false;
    }
    position[v] = i;
  }

  for (int v = 0; v < n; ++v) {
    for (int to : graph[v]) {
      if (to < 0 || to >= n) {
        continue;
      }
      if (position[v] > position[to]) {
        return false;
      }
    }
  }
  return true;
}

}  // namespace edulcni

#endif  // EDULCNI_TOPOSORT_HPP

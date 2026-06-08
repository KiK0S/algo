#include <algorithm>
#include <cassert>
#include <limits>
#include <queue>
#include <random>
#include <vector>

#include "../lib/solvers/maxflow_dinic.hpp"

template <typename Cap>
static Cap edmonds_karp(const std::vector<std::vector<Cap>>& capacity, int source,
                        int sink) {
  const int n = static_cast<int>(capacity.size());
  if (source < 0 || source >= n || sink < 0 || sink >= n || source == sink) {
    return Cap(0);
  }

  std::vector<std::vector<Cap>> residual = capacity;
  Cap total_flow = Cap(0);

  while (true) {
    std::vector<int> parent(n, -1);
    std::vector<Cap> path_cap(n, Cap(0));
    std::queue<int> q;

    parent[source] = -2;
    path_cap[source] = std::numeric_limits<Cap>::max();
    q.push(source);

    while (!q.empty() && parent[sink] == -1) {
      const int v = q.front();
      q.pop();
      for (int to = 0; to < n; ++to) {
        if (parent[to] == -1 && residual[v][to] > Cap(0)) {
          parent[to] = v;
          path_cap[to] = std::min(path_cap[v], residual[v][to]);
          q.push(to);
        }
      }
    }

    if (parent[sink] == -1) {
      break;
    }

    const Cap pushed = path_cap[sink];
    total_flow += pushed;
    int v = sink;
    while (v != source) {
      const int p = parent[v];
      residual[p][v] -= pushed;
      residual[v][p] += pushed;
      v = p;
    }
  }

  return total_flow;
}

template <typename Cap>
static Cap total_positive_flow_out(
    const Dinic<Cap>& dinic, int vertex, int ignore_to = -1) {
  Cap total = Cap(0);
  for (const auto& edge : dinic.graph()[vertex]) {
    if (edge.original_cap > Cap(0) && edge.to != ignore_to) {
      total += edge.flow();
    }
  }
  return total;
}

static void test_classic_network() {
  Dinic<long long> flow(6);
  flow.add_edge(0, 1, 16);
  flow.add_edge(0, 2, 13);
  flow.add_edge(1, 2, 10);
  flow.add_edge(2, 1, 4);
  flow.add_edge(1, 3, 12);
  flow.add_edge(3, 2, 9);
  flow.add_edge(2, 4, 14);
  flow.add_edge(4, 3, 7);
  flow.add_edge(3, 5, 20);
  flow.add_edge(4, 5, 4);

  const long long max_flow = flow.max_flow(0, 5);
  assert(max_flow == 23);
  assert(flow.left_of_min_cut(0));
  assert(!flow.left_of_min_cut(5));
  assert(total_positive_flow_out(flow, 0) == 23);
  flow.reset_flows();
  assert(total_positive_flow_out(flow, 0) == 0);
  assert(flow.max_flow(0, 5) == 23);
}

static void test_bipartite_matching_flow() {
  const int source = 0;
  const int sink = 7;
  Dinic<int> flow(8);

  for (int left = 1; left <= 3; ++left) {
    flow.add_edge(source, left, 1);
  }
  for (int right = 4; right <= 6; ++right) {
    flow.add_edge(right, sink, 1);
  }

  flow.add_edge(1, 4, 1);
  flow.add_edge(1, 5, 1);
  flow.add_edge(2, 5, 1);
  flow.add_edge(3, 5, 1);
  flow.add_edge(3, 6, 1);

  assert(flow.max_flow(source, sink) == 3);
}

static void test_dinic_random() {
  std::mt19937 rng(998244353);
  for (int it = 0; it < 220; ++it) {
    const int n = 2 + static_cast<int>(rng() % 7);
    const int source = 0;
    const int sink = n - 1;

    Dinic<long long> dinic(n);
    std::vector<std::vector<long long>> capacity(
        static_cast<size_t>(n), std::vector<long long>(static_cast<size_t>(n), 0));

    for (int u = 0; u < n; ++u) {
      for (int v = 0; v < n; ++v) {
        if (u == v) {
          continue;
        }
        if (static_cast<int>(rng() % 100) >= 30) {
          continue;
        }
        const long long cap = static_cast<long long>(rng() % 8);
        if (cap == 0) {
          continue;
        }
        dinic.add_edge(u, v, cap);
        capacity[u][v] += cap;

        if (static_cast<int>(rng() % 100) < 20) {
          const long long extra = static_cast<long long>(rng() % 8);
          if (extra > 0) {
            dinic.add_edge(u, v, extra);
            capacity[u][v] += extra;
          }
        }
      }
    }

    const long long expected = edmonds_karp(capacity, source, sink);
    const long long got = dinic.max_flow(source, sink);
    assert(got == expected);
  }
}

static void test_invalid_inputs() {
  Dinic<int> flow(3);
  assert(flow.add_edge(-1, 1, 3) == -1);
  assert(flow.add_edge(0, 9, 3) == -1);
  assert(flow.add_edge(0, 1, -3) == -1);
  assert(flow.max_flow(0, 0) == 0);
  assert(flow.max_flow(-1, 2) == 0);
}

int main() {
  test_classic_network();
  test_bipartite_matching_flow();
  test_dinic_random();
  test_invalid_inputs();
  return 0;
}

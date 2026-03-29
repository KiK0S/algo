#include <algorithm>
#include <cassert>
#include <functional>
#include <limits>
#include <queue>
#include <random>
#include <utility>
#include <vector>

#include "../lib/mincost_maxflow.hpp"

namespace {

struct BruteMinCostMaxFlow {
  struct Edge {
    int to;
    int rev;
    long long cap;
    long long cost;
  };

  explicit BruteMinCostMaxFlow(int n = 0) : graph(n) {}

  void add_edge(int from, int to, long long cap, long long cost) {
    const int rev_to = static_cast<int>(graph[to].size());
    const int rev_from = static_cast<int>(graph[from].size());
    graph[from].push_back(Edge{to, rev_to, cap, cost});
    graph[to].push_back(Edge{from, rev_from, 0, -cost});
  }

  std::pair<long long, long long> solve(int source, int sink) {
    const int n = static_cast<int>(graph.size());
    const long long inf = std::numeric_limits<long long>::max() / 4;
    long long total_flow = 0;
    long long total_cost = 0;

    while (true) {
      std::vector<long long> dist(n, inf);
      std::vector<int> prev_v(n, -1);
      std::vector<int> prev_e(n, -1);
      dist[source] = 0;

      for (int it = 0; it < n - 1; ++it) {
        bool changed = false;
        for (int v = 0; v < n; ++v) {
          if (dist[v] == inf) {
            continue;
          }
          for (int edge_id = 0; edge_id < static_cast<int>(graph[v].size()); ++edge_id) {
            const Edge& edge = graph[v][edge_id];
            if (edge.cap <= 0) {
              continue;
            }
            const long long candidate = dist[v] + edge.cost;
            if (candidate < dist[edge.to]) {
              dist[edge.to] = candidate;
              prev_v[edge.to] = v;
              prev_e[edge.to] = edge_id;
              changed = true;
            }
          }
        }
        if (!changed) {
          break;
        }
      }

      if (prev_v[sink] == -1) {
        break;
      }

      long long pushed = inf;
      for (int v = sink; v != source; v = prev_v[v]) {
        const Edge& edge = graph[prev_v[v]][prev_e[v]];
        pushed = std::min(pushed, edge.cap);
      }

      for (int v = sink; v != source; v = prev_v[v]) {
        Edge& edge = graph[prev_v[v]][prev_e[v]];
        Edge& rev = graph[edge.to][edge.rev];
        edge.cap -= pushed;
        rev.cap += pushed;
        total_cost += pushed * edge.cost;
      }
      total_flow += pushed;
    }

    return std::make_pair(total_flow, total_cost);
  }

  std::vector<std::vector<Edge>> graph;
};

void test_basic_network() {
  edulcni::MinCostMaxFlow<long long, long long> mcmf(4);
  mcmf.add_edge(0, 1, 2, 1);
  mcmf.add_edge(0, 2, 1, 5);
  mcmf.add_edge(1, 2, 1, 2);
  mcmf.add_edge(1, 3, 1, 3);
  mcmf.add_edge(2, 3, 2, 1);

  const std::pair<long long, long long> result = mcmf.min_cost_max_flow(0, 3);
  assert(result.first == 3);
  assert(result.second == 14);
}

void test_negative_cost_edges() {
  edulcni::MinCostMaxFlow<long long, long long> mcmf(3);
  mcmf.add_edge(0, 1, 2, -3);
  mcmf.add_edge(1, 2, 2, 2);

  const std::pair<long long, long long> result = mcmf.min_cost_max_flow(0, 2);
  assert(result.first == 2);
  assert(result.second == -2);
}

void test_flow_limit() {
  edulcni::MinCostMaxFlow<long long, long long> mcmf(4);
  mcmf.add_edge(0, 1, 3, 1);
  mcmf.add_edge(1, 3, 3, 2);
  mcmf.add_edge(0, 2, 3, 0);
  mcmf.add_edge(2, 3, 3, 5);

  const std::pair<long long, long long> limited = mcmf.min_cost_flow(0, 3, 2);
  assert(limited.first == 2);
  assert(limited.second == 6);
}

void test_random_dag_against_bruteforce() {
  std::mt19937 rng(20260226);
  for (int it = 0; it < 320; ++it) {
    const int n = 2 + static_cast<int>(rng() % 7);
    const int source = 0;
    const int sink = n - 1;

    edulcni::MinCostMaxFlow<long long, long long> fast(n);
    BruteMinCostMaxFlow brute(n);

    for (int u = 0; u < n; ++u) {
      for (int v = u + 1; v < n; ++v) {
        if (static_cast<int>(rng() % 100) >= 40) {
          continue;
        }
        const long long cap = 1 + static_cast<long long>(rng() % 4);
        const long long cost = static_cast<long long>(static_cast<int>(rng() % 11) - 5);
        fast.add_edge(u, v, cap, cost);
        brute.add_edge(u, v, cap, cost);
      }
    }

    const std::pair<long long, long long> fast_result = fast.min_cost_max_flow(source, sink);
    const std::pair<long long, long long> brute_result = brute.solve(source, sink);
    assert(fast_result == brute_result);
  }
}

void test_invalid_inputs() {
  edulcni::MinCostMaxFlow<int, int> mcmf(3);
  assert(mcmf.add_edge(-1, 1, 3, 2) == -1);
  assert(mcmf.add_edge(0, 8, 3, 2) == -1);
  assert(mcmf.add_edge(0, 1, -3, 2) == -1);
  assert(mcmf.min_cost_flow(0, 0).first == 0);
  assert(mcmf.min_cost_flow(0, 0).second == 0);
}

}  // namespace

int main() {
  test_basic_network();
  test_negative_cost_edges();
  test_flow_limit();
  test_random_dag_against_bruteforce();
  test_invalid_inputs();
  return 0;
}

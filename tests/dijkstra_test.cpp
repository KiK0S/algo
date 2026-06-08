#include <algorithm>
#include <cassert>
#include <functional>
#include <limits>
#include <queue>
#include <random>
#include <utility>
#include <vector>

#include "../lib/solvers/dijkstra.hpp"

template <typename Weight>
static std::vector<Weight> bellman_ford_non_negative(
    const std::vector<std::vector<DijkstraEdge<Weight>>>& graph,
    const std::vector<int>& sources, Weight inf) {
  const int n = static_cast<int>(graph.size());
  std::vector<Weight> dist(n, inf);
  for (int source : sources) {
    if (source >= 0 && source < n) {
      dist[source] = Weight(0);
    }
  }

  for (int it = 0; it < n; ++it) {
    bool changed = false;
    for (int v = 0; v < n; ++v) {
      if (dist[v] == inf) {
        continue;
      }
      for (const DijkstraEdge<Weight>& edge : graph[v]) {
        if (edge.to < 0 || edge.to >= n || edge.weight < Weight(0)) {
          continue;
        }
        const Weight candidate = dist[v] + edge.weight;
        if (candidate < dist[edge.to]) {
          dist[edge.to] = candidate;
          changed = true;
        }
      }
    }
    if (!changed) {
      break;
    }
  }
  return dist;
}

static void test_basic_dijkstra() {
  const long long inf = (1LL << 60);
  std::vector<std::vector<DijkstraEdge<long long>>> graph(6);

  dijkstra_add_edge(graph, 0, 1, 10);
  dijkstra_add_edge(graph, 0, 2, 3);
  dijkstra_add_edge(graph, 2, 1, 1);
  dijkstra_add_edge(graph, 1, 3, 2);
  dijkstra_add_edge(graph, 2, 3, 8);
  dijkstra_add_edge(graph, 3, 5, 2);
  dijkstra_add_edge(graph, 1, 5, 10);
  dijkstra_add_edge(graph, 99, 1, 5);
  dijkstra_add_edge(graph, 0, -1, 5);

  const DijkstraResult<long long> result = dijkstra(graph, 0, inf);
  const std::vector<long long> expected_dist = {0, 4, 3, 6, inf, 8};
  assert(result.distance == expected_dist);

  const std::vector<int> expected_path = {0, 2, 1, 3, 5};
  assert(dijkstra_restore_path(0, 5, result) == expected_path);
  assert(dijkstra_restore_path(0, 4, result).empty());
}

static void test_multi_source_dijkstra() {
  const long long inf = (1LL << 60);
  std::vector<std::vector<DijkstraEdge<long long>>> graph(5);

  dijkstra_add_edge(graph, 0, 2, 4);
  dijkstra_add_edge(graph, 1, 2, 1);
  dijkstra_add_edge(graph, 2, 3, 2);
  dijkstra_add_edge(graph, 4, 3, 1);

  const DijkstraResult<long long> result =
      dijkstra_multi_source(graph, {0, 1, 4}, inf);
  const std::vector<long long> expected_dist = {0, 0, 1, 1, 0};
  assert(result.distance == expected_dist);

  const std::vector<int> expected_path = {4, 3};
  assert(dijkstra_restore_path(4, 3, result) == expected_path);
  assert(dijkstra_restore_path(1, 3, result).empty());
}

static void test_dijkstra_random() {
  std::mt19937 rng(1234567);
  const long long inf = (1LL << 60);

  for (int it = 0; it < 300; ++it) {
    const int n = 2 + static_cast<int>(rng() % 25);
    std::vector<std::vector<DijkstraEdge<long long>>> graph(
        static_cast<size_t>(n));

    const int m = static_cast<int>(rng() % (n * n));
    for (int edge_id = 0; edge_id < m; ++edge_id) {
      const int from = static_cast<int>(rng() % n);
      const int to = static_cast<int>(rng() % n);
      const long long weight = static_cast<long long>(rng() % 30);
      dijkstra_add_edge(graph, from, to, weight);
    }

    const int source = static_cast<int>(rng() % n);
    const DijkstraResult<long long> single_result =
        dijkstra(graph, source, inf);
    const std::vector<long long> single_expected =
        bellman_ford_non_negative(graph, {source}, inf);
    assert(single_result.distance == single_expected);

    std::vector<int> sources;
    const int source_count = 1 + static_cast<int>(rng() % n);
    for (int i = 0; i < source_count; ++i) {
      sources.push_back(static_cast<int>(rng() % n));
    }
    const DijkstraResult<long long> multi_result =
        dijkstra_multi_source(graph, sources, inf);
    const std::vector<long long> multi_expected =
        bellman_ford_non_negative(graph, sources, inf);
    assert(multi_result.distance == multi_expected);
  }
}

static void test_invalid_source() {
  const long long inf = (1LL << 60);
  std::vector<std::vector<DijkstraEdge<long long>>> graph(4);
  dijkstra_add_edge(graph, 0, 1, 3);

  const DijkstraResult<long long> result = dijkstra(graph, -1, inf);
  assert(result.distance == std::vector<long long>({inf, inf, inf, inf}));
  assert(result.parent == std::vector<int>({-1, -1, -1, -1}));
}

int main() {
  test_basic_dijkstra();
  test_multi_source_dijkstra();
  test_dijkstra_random();
  test_invalid_source();
  return 0;
}

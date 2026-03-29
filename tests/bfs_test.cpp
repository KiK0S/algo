#include <algorithm>
#include <cassert>
#include <queue>
#include <vector>

#include "../lib/bfs.hpp"

static void test_basic_bfs() {
  std::vector<std::vector<int>> graph(8);
  edulcni::bfs_add_edge(graph, 0, 1, true);
  edulcni::bfs_add_edge(graph, 0, 2, true);
  edulcni::bfs_add_edge(graph, 1, 3, true);
  edulcni::bfs_add_edge(graph, 2, 4, true);
  edulcni::bfs_add_edge(graph, 3, 5, true);
  edulcni::bfs_add_edge(graph, 5, 6, true);
  edulcni::bfs_add_edge(graph, -1, 3, true);
  edulcni::bfs_add_edge(graph, 1, 99, true);

  const edulcni::BfsResult result = edulcni::bfs(graph, 0);

  const std::vector<int> expected_dist = {0, 1, 1, 2, 2, 3, 4, -1};
  assert(result.distance == expected_dist);

  const std::vector<int> path_to_6 = edulcni::bfs_restore_path(0, 6, result);
  const std::vector<int> expected_path = {0, 1, 3, 5, 6};
  assert(path_to_6 == expected_path);

  assert(edulcni::bfs_restore_path(0, 7, result).empty());

  const std::vector<int> root_path = edulcni::bfs_restore_path_to_root(6, result);
  assert(root_path == expected_path);
}

static void test_multi_source_bfs() {
  std::vector<std::vector<int>> graph(6);
  for (int i = 0; i + 1 < 6; ++i) {
    edulcni::bfs_add_edge(graph, i, i + 1, true);
  }

  const edulcni::BfsResult result = edulcni::bfs_multi_source(graph, {0, 5});
  const std::vector<int> expected_dist = {0, 1, 2, 2, 1, 0};
  assert(result.distance == expected_dist);

  const std::vector<int> path_to_2 = edulcni::bfs_restore_path_to_root(2, result);
  const std::vector<int> expected_path_to_2 = {0, 1, 2};
  assert(path_to_2 == expected_path_to_2);

  const std::vector<int> path_to_3 = edulcni::bfs_restore_path_to_root(3, result);
  const std::vector<int> expected_path_to_3 = {5, 4, 3};
  assert(path_to_3 == expected_path_to_3);
}

static void test_invalid_source() {
  std::vector<std::vector<int>> graph(4);
  edulcni::bfs_add_edge(graph, 0, 1, true);
  const edulcni::BfsResult result = edulcni::bfs(graph, 9);

  assert(result.distance == std::vector<int>({-1, -1, -1, -1}));
  assert(result.parent == std::vector<int>({-1, -1, -1, -1}));
  assert(result.order.empty());
}

int main() {
  test_basic_bfs();
  test_multi_source_bfs();
  test_invalid_source();
  return 0;
}

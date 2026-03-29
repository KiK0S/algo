#include <algorithm>
#include <cassert>
#include <limits>
#include <queue>
#include <random>
#include <vector>

#include "../lib/kuhn.hpp"

static int brute_max_matching_dfs(const std::vector<std::vector<int>>& graph, int right_size,
                                  int left, std::vector<char>& used_right) {
  if (left == static_cast<int>(graph.size())) {
    return 0;
  }
  int best = brute_max_matching_dfs(graph, right_size, left + 1, used_right);
  for (int right : graph[left]) {
    if (right < 0 || right >= right_size || used_right[right]) {
      continue;
    }
    used_right[right] = 1;
    best = std::max(best, 1 + brute_max_matching_dfs(graph, right_size, left + 1, used_right));
    used_right[right] = 0;
  }
  return best;
}

static int brute_max_matching(const std::vector<std::vector<int>>& graph, int right_size) {
  std::vector<char> used_right(static_cast<std::size_t>(right_size), 0);
  return brute_max_matching_dfs(graph, right_size, 0, used_right);
}

static int brute_min_vertex_cover(const std::vector<std::vector<int>>& graph, int right_size) {
  const int left_size = static_cast<int>(graph.size());
  const int total = left_size + right_size;
  int best = std::numeric_limits<int>::max();

  for (int mask = 0; mask < (1 << total); ++mask) {
    const int bits = __builtin_popcount(static_cast<unsigned int>(mask));
    if (bits >= best) {
      continue;
    }

    bool ok = true;
    for (int left = 0; left < left_size && ok; ++left) {
      for (int right : graph[left]) {
        if (right < 0 || right >= right_size) {
          continue;
        }
        const bool covered_left = ((mask >> left) & 1) != 0;
        const bool covered_right = ((mask >> (left_size + right)) & 1) != 0;
        if (!covered_left && !covered_right) {
          ok = false;
          break;
        }
      }
    }

    if (ok) {
      best = bits;
    }
  }

  return (best == std::numeric_limits<int>::max() ? 0 : best);
}

static void assert_matching_valid(const std::vector<std::vector<int>>& graph, int right_size,
                                  const edulcni::KuhnResult& result) {
  const int left_size = static_cast<int>(graph.size());
  assert(static_cast<int>(result.match_left.size()) == left_size);
  assert(static_cast<int>(result.match_right.size()) == right_size);

  int matched = 0;
  std::vector<int> seen_right(right_size, -1);
  for (int left = 0; left < left_size; ++left) {
    const int right = result.match_left[left];
    if (right == -1) {
      continue;
    }
    assert(right >= 0 && right < right_size);
    assert(result.match_right[right] == left);
    assert(seen_right[right] == -1);
    seen_right[right] = left;
    assert(std::find(graph[left].begin(), graph[left].end(), right) != graph[left].end());
    ++matched;
  }
  assert(result.matching_size == matched);
}

static bool cover_contains(const std::vector<int>& arr, int x) {
  return std::find(arr.begin(), arr.end(), x) != arr.end();
}

static void assert_cover_valid(const std::vector<std::vector<int>>& graph, int right_size,
                               const edulcni::BipartiteVertexCover& cover) {
  const int left_size = static_cast<int>(graph.size());
  for (int left = 0; left < left_size; ++left) {
    for (int right : graph[left]) {
      if (right < 0 || right >= right_size) {
        continue;
      }
      const bool covered =
          cover_contains(cover.left_vertices, left) || cover_contains(cover.right_vertices, right);
      assert(covered);
    }
  }
}

static void test_basic_case() {
  const std::vector<std::vector<int>> graph = {
      {0, 1},
      {1, 2},
      {2},
  };
  const int right_size = 3;

  const edulcni::KuhnResult matching = edulcni::kuhn_maximum_matching(graph, right_size);
  assert_matching_valid(graph, right_size, matching);
  assert(matching.matching_size == 3);

  const edulcni::BipartiteVertexCover cover =
      edulcni::minimum_vertex_cover_bipartite(graph, right_size, matching);
  assert_cover_valid(graph, right_size, cover);
  assert(cover.size() == matching.matching_size);
}

static void test_random_against_bruteforce() {
  std::mt19937 rng(20260226);
  for (int it = 0; it < 400; ++it) {
    const int left_size = 1 + static_cast<int>(rng() % 7);
    const int right_size = 1 + static_cast<int>(rng() % 7);
    std::vector<std::vector<int>> graph(left_size);

    for (int left = 0; left < left_size; ++left) {
      for (int right = 0; right < right_size; ++right) {
        if (static_cast<int>(rng() % 100) < 45) {
          graph[left].push_back(right);
          if (static_cast<int>(rng() % 100) < 20) {
            graph[left].push_back(right);  // duplicates should not break matching.
          }
        }
      }
    }

    const edulcni::KuhnResult matching = edulcni::kuhn_maximum_matching(graph, right_size);
    assert_matching_valid(graph, right_size, matching);

    const int brute_matching = brute_max_matching(graph, right_size);
    assert(matching.matching_size == brute_matching);

    const edulcni::BipartiteVertexCover cover =
        edulcni::minimum_vertex_cover_bipartite(graph, right_size, matching);
    assert_cover_valid(graph, right_size, cover);
    assert(cover.size() == matching.matching_size);

    const int brute_cover = brute_min_vertex_cover(graph, right_size);
    assert(cover.size() == brute_cover);
  }
}

int main() {
  test_basic_case();
  test_random_against_bruteforce();
  return 0;
}

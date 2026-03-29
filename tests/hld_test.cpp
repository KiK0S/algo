#include <algorithm>
#include <cassert>
#include <random>
#include <vector>

#include "../lib/hld.hpp"

static long long sum_on_base(const std::vector<long long>& base, int left, int right) {
  long long sum = 0;
  for (int i = left; i <= right; ++i) {
    sum += base[i];
  }
  return sum;
}

static std::vector<int> naive_path_nodes(const edulcni::HeavyLightDecomposition& hld, int a,
                                         int b) {
  int u = a;
  int v = b;
  std::vector<int> up;
  std::vector<int> down;

  while (hld.depth(u) > hld.depth(v)) {
    up.push_back(u);
    u = hld.parent(u);
  }
  while (hld.depth(v) > hld.depth(u)) {
    down.push_back(v);
    v = hld.parent(v);
  }
  while (u != v) {
    up.push_back(u);
    down.push_back(v);
    u = hld.parent(u);
    v = hld.parent(v);
  }

  up.push_back(u);
  std::reverse(down.begin(), down.end());
  up.insert(up.end(), down.begin(), down.end());
  return up;
}

static int naive_lca(const edulcni::HeavyLightDecomposition& hld, int a, int b) {
  int u = a;
  int v = b;
  while (hld.depth(u) > hld.depth(v)) {
    u = hld.parent(u);
  }
  while (hld.depth(v) > hld.depth(u)) {
    v = hld.parent(v);
  }
  while (u != v) {
    u = hld.parent(u);
    v = hld.parent(v);
  }
  return u;
}

static void collect_subtree_nodes(const edulcni::HeavyLightDecomposition& hld, int root,
                                  int parent, std::vector<int>& out) {
  out.push_back(root);
  for (int to : hld.graph()[root]) {
    if (to == parent) {
      continue;
    }
    collect_subtree_nodes(hld, to, root, out);
  }
}

static void test_basic_hld() {
  edulcni::HeavyLightDecomposition hld(7);
  hld.add_edge(0, 1);
  hld.add_edge(0, 2);
  hld.add_edge(1, 3);
  hld.add_edge(1, 4);
  hld.add_edge(2, 5);
  hld.add_edge(2, 6);
  hld.build(0);

  assert(hld.lca(3, 4) == 1);
  assert(hld.lca(3, 6) == 0);
  assert(hld.lca(5, 6) == 2);
  assert(hld.parent(0) == -1);
  assert(hld.subtree_size(0) == 7);
  assert(hld.subtree_size(1) == 3);

  const std::pair<int, int> seg = hld.subtree_segment(1);
  assert(seg.first <= seg.second);
  std::vector<int> nodes;
  for (int i = seg.first; i <= seg.second; ++i) {
    nodes.push_back(hld.vertex_at(i));
  }
  std::sort(nodes.begin(), nodes.end());
  assert(nodes == std::vector<int>({1, 3, 4}));

  const std::vector<long long> value = {5, 1, 4, 2, 3, 6, 7};
  std::vector<long long> base(7, 0);
  for (int v = 0; v < 7; ++v) {
    base[hld.position(v)] = value[v];
  }

  const std::vector<std::pair<int, int>> segments = hld.path_segments(3, 6, true);
  long long got = 0;
  for (const std::pair<int, int>& p : segments) {
    got += sum_on_base(base, p.first, p.second);
  }
  const std::vector<int> path_nodes = naive_path_nodes(hld, 3, 6);
  long long expected = 0;
  for (int v : path_nodes) {
    expected += value[v];
  }
  assert(got == expected);
}

static void test_random_hld() {
  std::mt19937 rng(20260225);

  for (int it = 0; it < 250; ++it) {
    const int n = 1 + static_cast<int>(rng() % 70);
    edulcni::HeavyLightDecomposition hld(n);
    for (int v = 1; v < n; ++v) {
      const int parent = static_cast<int>(rng() % v);
      hld.add_edge(parent, v);
    }
    hld.build(0);

    std::vector<long long> value(n, 0);
    std::vector<long long> base(n, 0);
    for (int v = 0; v < n; ++v) {
      value[v] = static_cast<long long>(static_cast<int>(rng() % 2001) - 1000);
      base[hld.position(v)] = value[v];
    }

    for (int q = 0; q < 500; ++q) {
      const int a = static_cast<int>(rng() % n);
      const int b = static_cast<int>(rng() % n);
      const int expected_lca = naive_lca(hld, a, b);
      assert(hld.lca(a, b) == expected_lca);

      for (int include_lca_flag = 0; include_lca_flag < 2; ++include_lca_flag) {
        const bool include_lca = (include_lca_flag == 1);
        const std::vector<std::pair<int, int>> segments =
            hld.path_segments(a, b, include_lca);
        long long got = 0;
        for (const std::pair<int, int>& seg : segments) {
          assert(seg.first <= seg.second);
          got += sum_on_base(base, seg.first, seg.second);
        }

        const std::vector<int> path_nodes = naive_path_nodes(hld, a, b);
        long long expected = 0;
        for (int v : path_nodes) {
          if (!include_lca && v == expected_lca) {
            continue;
          }
          expected += value[v];
        }
        assert(got == expected);
      }
    }

    for (int v = 0; v < n; ++v) {
      const std::pair<int, int> seg = hld.subtree_segment(v);
      assert(seg.first <= seg.second);
      assert(seg.second - seg.first + 1 == hld.subtree_size(v));

      long long got = sum_on_base(base, seg.first, seg.second);
      std::vector<int> nodes;
      collect_subtree_nodes(hld, v, hld.parent(v), nodes);
      long long expected = 0;
      for (int node : nodes) {
        expected += value[node];
      }
      assert(got == expected);
    }
  }
}

int main() {
  test_basic_hld();
  test_random_hld();
  return 0;
}

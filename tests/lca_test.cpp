#include <algorithm>
#include <cassert>
#include <random>
#include <vector>

#include "../lib/solvers/lca_binary_lifting.hpp"

static int naive_lca(const LcaBinaryLifting& lca, int a, int b) {
  if (lca.component(a) != lca.component(b)) {
    return -1;
  }

  int u = a;
  int v = b;
  while (lca.depth(u) > lca.depth(v)) {
    u = lca.parent(u);
  }
  while (lca.depth(v) > lca.depth(u)) {
    v = lca.parent(v);
  }
  while (u != v) {
    u = lca.parent(u);
    v = lca.parent(v);
  }
  return u;
}

static int naive_kth_ancestor(const LcaBinaryLifting& lca, int v, int k) {
  if (v < 0 || k < 0 || v >= lca.size()) {
    return -1;
  }
  int node = v;
  for (int i = 0; i < k && node != -1; ++i) {
    node = lca.parent(node);
  }
  return node;
}

static void test_basic_lca() {
  LcaBinaryLifting lca(9);
  lca.add_edge(0, 1);
  lca.add_edge(0, 2);
  lca.add_edge(1, 3);
  lca.add_edge(1, 4);
  lca.add_edge(2, 5);
  lca.add_edge(2, 6);
  lca.add_edge(6, 7);
  lca.add_edge(7, 8);
  lca.build(0);

  assert(lca.lca(3, 4) == 1);
  assert(lca.lca(3, 6) == 0);
  assert(lca.lca(8, 5) == 2);
  assert(lca.lca(8, 8) == 8);
  assert(lca.dist(3, 4) == 2);
  assert(lca.dist(3, 8) == 6);
  assert(lca.dist(0, 8) == 4);

  assert(lca.kth_ancestor(8, 0) == 8);
  assert(lca.kth_ancestor(8, 1) == 7);
  assert(lca.kth_ancestor(8, 2) == 6);
  assert(lca.kth_ancestor(8, 3) == 2);
  assert(lca.kth_ancestor(8, 4) == 0);
  assert(lca.kth_ancestor(8, 5) == -1);
}

static void test_forest_lca() {
  LcaBinaryLifting lca(6);
  lca.add_edge(0, 1);
  lca.add_edge(1, 2);
  lca.add_edge(3, 4);
  lca.add_edge(4, 5);
  lca.build(0);

  assert(lca.lca(2, 1) == 1);
  assert(lca.lca(2, 4) == -1);
  assert(lca.dist(2, 4) == -1);
}

static void test_random_lca() {
  std::mt19937 rng(20260226);
  for (int it = 0; it < 300; ++it) {
    const int n = 1 + static_cast<int>(rng() % 90);
    LcaBinaryLifting lca(n);

    for (int v = 1; v < n; ++v) {
      const int parent = static_cast<int>(rng() % v);
      lca.add_edge(parent, v);
    }
    lca.build(0);

    for (int q = 0; q < 1000; ++q) {
      const int a = static_cast<int>(rng() % n);
      const int b = static_cast<int>(rng() % n);

      const int expected_lca = naive_lca(lca, a, b);
      const int got_lca = lca.lca(a, b);
      assert(got_lca == expected_lca);

      if (expected_lca != -1) {
        const int expected_dist =
            lca.depth(a) + lca.depth(b) - 2 * lca.depth(expected_lca);
        assert(lca.dist(a, b) == expected_dist);
      }

      const int v = static_cast<int>(rng() % n);
      const int k = static_cast<int>(rng() % (n + 5));
      assert(lca.kth_ancestor(v, k) == naive_kth_ancestor(lca, v, k));
    }
  }
}

int main() {
  test_basic_lca();
  test_forest_lca();
  test_random_lca();
  return 0;
}

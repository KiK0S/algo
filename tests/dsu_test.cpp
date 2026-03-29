#include <algorithm>
#include <cassert>
#include <random>
#include <vector>

#include "../lib/dsu.hpp"

static int naive_find(const std::vector<int>& parent, int v) {
  int x = v;
  while (parent[x] != x) {
    x = parent[x];
  }
  return x;
}

static bool naive_unite(std::vector<int>& parent, std::vector<int>& sz, int a, int b) {
  int ra = naive_find(parent, a);
  int rb = naive_find(parent, b);
  if (ra == rb) {
    return false;
  }
  if (sz[ra] > sz[rb]) {
    std::swap(ra, rb);
  }
  parent[ra] = rb;
  sz[rb] += sz[ra];
  return true;
}

static int naive_component_size(const std::vector<int>& parent,
                                const std::vector<int>& sz, int v) {
  return sz[naive_find(parent, v)];
}

static void test_basic_dsu() {
  edulcni::Dsu dsu(7);
  assert(dsu.size() == 7);
  assert(dsu.components() == 7);

  assert(dsu.unite(0, 1));
  assert(dsu.unite(1, 2));
  assert(!dsu.unite(0, 2));
  assert(dsu.same(0, 2));
  assert(!dsu.same(0, 3));
  assert(dsu.component_size(0) == 3);
  assert(dsu.component_size(1) == 3);
  assert(dsu.components() == 5);

  assert(!dsu.unite(-1, 2));
  assert(!dsu.unite(2, 99));
  assert(dsu.find(-1) == -1);
  assert(dsu.find(99) == -1);
  assert(dsu.component_size(-5) == 0);
}

static void test_reset() {
  edulcni::Dsu dsu(10);
  dsu.unite(0, 1);
  dsu.unite(2, 3);
  dsu.unite(3, 4);
  assert(dsu.components() == 7);

  dsu.reset(4);
  assert(dsu.size() == 4);
  assert(dsu.components() == 4);
  for (int i = 0; i < 4; ++i) {
    assert(dsu.find(i) == i);
    assert(dsu.component_size(i) == 1);
  }
}

static void test_random_dsu() {
  std::mt19937 rng(20260225);

  for (int it = 0; it < 300; ++it) {
    const int n = 1 + static_cast<int>(rng() % 80);
    edulcni::Dsu dsu(n);
    std::vector<int> parent(n, 0);
    std::vector<int> size(n, 1);
    for (int i = 0; i < n; ++i) {
      parent[i] = i;
    }
    int components = n;

    for (int step = 0; step < 1000; ++step) {
      const int op = static_cast<int>(rng() % 4);
      if (op == 0) {
        const int a = static_cast<int>(rng() % n);
        const int b = static_cast<int>(rng() % n);
        const bool merged1 = dsu.unite(a, b);
        const bool merged2 = naive_unite(parent, size, a, b);
        assert(merged1 == merged2);
        if (merged2) {
          --components;
        }
      } else if (op == 1) {
        const int v = static_cast<int>(rng() % n);
        assert(dsu.component_size(v) == naive_component_size(parent, size, v));
      } else if (op == 2) {
        const int a = static_cast<int>(rng() % n);
        const int b = static_cast<int>(rng() % n);
        const bool same1 = dsu.same(a, b);
        const bool same2 = naive_find(parent, a) == naive_find(parent, b);
        assert(same1 == same2);
      } else {
        const int v = static_cast<int>(rng() % n);
        const int root1 = dsu.find(v);
        const int root2 = naive_find(parent, v);
        assert(root1 != -1);
        assert(dsu.same(v, root1));
        assert(naive_find(parent, root1) == root2);
      }

      assert(dsu.components() == components);
    }
  }
}

int main() {
  test_basic_dsu();
  test_reset();
  test_random_dsu();
  return 0;
}

#include <algorithm>
#include <cassert>
#include <limits>
#include <numeric>
#include <random>
#include <utility>
#include <vector>

#include "../lib/solvers/implicit_treap.hpp"
#include "../lib/solvers/lca_binary_lifting.hpp"
#include "../lib/solvers/merge_sort_tree.hpp"
#include "../lib/solvers/rollback_dsu.hpp"
#include "../lib/solvers/segtree_beats.hpp"
#include "../lib/solvers/segtree_lazy_add_min.hpp"
#include "../lib/solvers/segtree_point_update.hpp"
#include "../lib/solvers/static_rmq.hpp"

static void test_point_segment_tree() {
  std::vector<int> a = {5, 1, 7, 3};
  SegmentMinTree<int> st(a);
  assert(st.query(0, 4) == 1);
  assert(st.query(2, 4) == 3);
  st.point_set(1, 9);
  assert(st.query(0, 4) == 3);
}

static void test_lazy_add_min_tree() {
  std::vector<int> a = {4, 8, 1, 6};
  SegmentMinAddTree<int> st(a);
  st.add(0, 2, 3);
  assert(st.get(0, 3) == 4);
  st.add(2, 3, -5);
  assert(st.get(0, 3) == -1);
  assert(st.first_leq(0, 3, 0) == 2);
}

static void test_merge_sort_tree() {
  std::vector<int> a = {5, 1, 7, 3, 5, 2};
  MergeSortTree<int> mst(a);
  assert(mst.count_less(1, 4, 5) == 2);
  assert(mst.count_less_equal(1, 4, 5) == 3);
  assert(mst.count_in_range(0, 5, 2, 5) == 4);
  assert(mst.exists(2, 5, 3));
}

static void test_segment_tree_beats() {
  std::vector<long long> a = {5, 1, 7, 3, 9, 2};
  SegmentTreeBeats<long long> beats(a);
  beats.chmin(0, 5, 6);
  assert(beats.query_sum(0, 5) == 23);
  beats.chmax(1, 4, 4);
  assert(beats.query_min(0, 5) == 2);
  beats.add(2, 5, 3);
  assert(beats.query_sum(2, 4) == 25);

  std::mt19937 rng(12345);
  std::vector<long long> values(16);
  for (long long& x : values) {
    x = static_cast<long long>(static_cast<int>(rng() % 31) - 15);
  }
  SegmentTreeBeats<long long> random_beats(values);
  std::vector<long long> naive = values;
  for (int it = 0; it < 300; ++it) {
    int l = static_cast<int>(rng() % values.size());
    int r = static_cast<int>(rng() % values.size());
    if (l > r) {
      std::swap(l, r);
    }
    const long long x = static_cast<long long>(static_cast<int>(rng() % 21) - 10);
    const int op = static_cast<int>(rng() % 6);
    if (op == 0) {
      random_beats.add(l, r, x);
      for (int i = l; i <= r; ++i) {
        naive[i] += x;
      }
    } else if (op == 1) {
      random_beats.chmin(l, r, x);
      for (int i = l; i <= r; ++i) {
        naive[i] = std::min(naive[i], x);
      }
    } else if (op == 2) {
      random_beats.chmax(l, r, x);
      for (int i = l; i <= r; ++i) {
        naive[i] = std::max(naive[i], x);
      }
    }
    long long sum = 0;
    long long mn = naive[l];
    long long mx = naive[l];
    for (int i = l; i <= r; ++i) {
      sum += naive[i];
      mn = std::min(mn, naive[i]);
      mx = std::max(mx, naive[i]);
    }
    assert(random_beats.query_sum(l, r) == sum);
    assert(random_beats.query_min(l, r) == mn);
    assert(random_beats.query_max(l, r) == mx);
  }
}

static void test_rollback_dsu() {
  RollbackDsu dsu(4);
  assert(dsu.components() == 4);
  const int snap = dsu.snapshot();
  assert(dsu.unite(0, 1));
  assert(dsu.unite(2, 3));
  assert(dsu.components() == 2);
  dsu.rollback(snap);
  assert(dsu.components() == 4);
  assert(!dsu.same(0, 1));
}

static void test_lca_binary_lifting() {
  LcaBinaryLifting lca(5);
  lca.add_edge(0, 1);
  lca.add_edge(0, 2);
  lca.add_edge(1, 3);
  lca.add_edge(1, 4);
  lca.build(0);
  assert(lca.lca(3, 4) == 1);
  assert(lca.lca(2, 4) == 0);
  assert(lca.dist(3, 2) == 3);
  assert(lca.kth_ancestor(4, 2) == 0);
}

static void test_static_rmq_and_treap() {
  std::vector<int> a = {4, 1, 3, 2};
  SparseMinTable<int> rmq(a);
  assert(rmq.query(0, 3) == 1);
  assert(rmq.query(2, 3) == 2);

  ImplicitTreap<long long> treap(123);
  treap.push_back(10);
  treap.push_back(20);
  treap.insert(1, 5);
  assert(treap.to_vector() == std::vector<long long>({10, 5, 20}));
  assert(treap.range_query(0, 2) == 35);
}

int main() {
  test_point_segment_tree();
  test_lazy_add_min_tree();
  test_merge_sort_tree();
  test_segment_tree_beats();
  test_rollback_dsu();
  test_lca_binary_lifting();
  test_static_rmq_and_treap();
  return 0;
}

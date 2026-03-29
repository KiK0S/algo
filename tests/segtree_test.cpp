#include <algorithm>
#include <cassert>
#include <random>
#include <vector>

#include "../lib/segtree.hpp"

static void test_min_max_assign_trees() {
  const std::vector<int> values = {5, 1, 7, 3, 9};

  edulcni::SegmentMinAssignTree<int> min_tree(values);
  assert(min_tree.get(0, 4) == 1);

  min_tree.assign(1, 3, 6);
  assert(min_tree.get(0, 4) == 5);
  assert(min_tree.get(1, 3) == 6);
  assert(min_tree.first_leq(0, 4, 5) == 0);
  assert(min_tree.last_leq(0, 4, 6) == 3);
  assert(min_tree.first_leq(2, 4, 4) == -1);

  edulcni::SegmentMaxAssignTree<int> max_tree(values);
  assert(max_tree.get(0, 4) == 9);

  max_tree.assign(2, 4, 4);
  assert(max_tree.get(0, 4) == 5);
  assert(max_tree.get(2, 4) == 4);
  assert(max_tree.first_geq(0, 4, 4) == 0);
  assert(max_tree.last_geq(0, 4, 4) == 4);
  assert(max_tree.first_geq(1, 4, 6) == -1);
}

static void test_min_max_add_trees() {
  const std::vector<int> values = {4, 8, 1, 6};

  edulcni::SegmentMinAddTree<int> min_tree(values);
  min_tree.add(0, 2, 3);  // {7, 11, 4, 6}
  assert(min_tree.get(0, 3) == 4);

  min_tree.add(2, 3, -5);  // {7, 11, -1, 1}
  assert(min_tree.get(0, 3) == -1);
  assert(min_tree.get(0, 1) == 7);
  assert(min_tree.first_leq(0, 3, 0) == 2);
  assert(min_tree.last_leq(0, 3, 1) == 3);

  edulcni::SegmentMaxAddTree<int> max_tree(values);
  max_tree.add(1, 3, 2);  // {4, 10, 3, 8}
  assert(max_tree.get(0, 3) == 10);

  max_tree.add(0, 0, 9);  // {13, 10, 3, 8}
  assert(max_tree.get(0, 3) == 13);
  assert(max_tree.get(1, 3) == 10);
  assert(max_tree.first_geq(0, 3, 12) == 0);
  assert(max_tree.last_geq(0, 3, 8) == 3);
  assert(max_tree.first_geq(2, 3, 11) == -1);
}

static void test_merge_sort_tree() {
  const std::vector<int> values = {5, 1, 7, 3, 5, 2};
  edulcni::MergeSortTree<int> mst(values);

  assert(mst.count_less(1, 4, 5) == 2);
  assert(mst.count_less_equal(1, 4, 5) == 3);
  assert(mst.count_greater(0, 5, 4) == 3);
  assert(mst.count_greater_equal(0, 5, 5) == 3);
  assert(mst.count_in_range(0, 5, 2, 5) == 4);
  assert(mst.exists(2, 5, 3));
  assert(!mst.exists(2, 5, 8));
}

static void test_max_subarray_tree() {
  const std::vector<long long> values = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
  edulcni::MaxSubarraySegTree<long long> st(values);

  assert(st.max_sum(0, 8) == 6);
  assert(st.get(3, 6).best == 6);

  st.point_set(0, 5);  // {5, 1, -3, 4, -1, 2, 1, -5, 4}
  assert(st.max_sum(0, 8) == 9);
  assert(st.max_sum(0, 2) == 6);
}

static long long naive_sum(const std::vector<long long>& a, int l, int r) {
  long long result = 0;
  for (int i = l; i <= r; ++i) {
    result += a[i];
  }
  return result;
}

static long long naive_min(const std::vector<long long>& a, int l, int r) {
  long long result = a[l];
  for (int i = l + 1; i <= r; ++i) {
    result = std::min(result, a[i]);
  }
  return result;
}

static long long naive_max(const std::vector<long long>& a, int l, int r) {
  long long result = a[l];
  for (int i = l + 1; i <= r; ++i) {
    result = std::max(result, a[i]);
  }
  return result;
}

static void test_segment_tree_beats() {
  std::vector<long long> values = {5, 1, 7, 3, 9, 2};
  edulcni::SegmentTreeBeats<long long> beats(values);

  assert(beats.query_sum(0, 5) == 27);
  assert(beats.query_min(0, 5) == 1);
  assert(beats.query_max(0, 5) == 9);

  beats.chmin(0, 5, 6);  // {5, 1, 6, 3, 6, 2}
  assert(beats.query_sum(0, 5) == 23);
  assert(beats.query_min(0, 5) == 1);
  assert(beats.query_max(0, 5) == 6);

  beats.chmax(1, 4, 4);  // {5, 4, 6, 4, 6, 2}
  assert(beats.query_sum(0, 5) == 27);
  assert(beats.query_min(0, 5) == 2);
  assert(beats.query_max(0, 5) == 6);

  beats.add(2, 5, 3);  // {5, 4, 9, 7, 9, 5}
  assert(beats.query_sum(0, 5) == 39);
  assert(beats.query_sum(2, 4) == 25);
  assert(beats.query_min(0, 5) == 4);
  assert(beats.query_max(0, 5) == 9);

  beats.chmin(0, 3, 6);  // {5, 4, 6, 6, 9, 5}
  beats.chmax(0, 5, 5);  // {5, 5, 6, 6, 9, 5}
  assert(beats.query_sum(0, 5) == 36);
  assert(beats.query_sum(1, 3) == 17);
  assert(beats.query_min(0, 5) == 5);
  assert(beats.query_max(0, 5) == 9);
}

static void test_segment_tree_beats_random() {
  std::mt19937 rng(123456);
  const int n = 20;
  std::vector<long long> values(n);
  for (int i = 0; i < n; ++i) {
    values[i] = static_cast<long long>(static_cast<int>(rng() % 41) - 20);
  }

  edulcni::SegmentTreeBeats<long long> beats(values);
  std::vector<long long> naive = values;

  for (int it = 0; it < 500; ++it) {
    int l = static_cast<int>(rng() % n);
    int r = static_cast<int>(rng() % n);
    if (l > r) {
      std::swap(l, r);
    }

    const int op = static_cast<int>(rng() % 6);
    const long long x = static_cast<long long>(static_cast<int>(rng() % 41) - 20);

    if (op == 0) {
      beats.add(l, r, x);
      for (int i = l; i <= r; ++i) {
        naive[i] += x;
      }
    } else if (op == 1) {
      beats.chmin(l, r, x);
      for (int i = l; i <= r; ++i) {
        naive[i] = std::min(naive[i], x);
      }
    } else if (op == 2) {
      beats.chmax(l, r, x);
      for (int i = l; i <= r; ++i) {
        naive[i] = std::max(naive[i], x);
      }
    } else if (op == 3) {
      assert(beats.query_sum(l, r) == naive_sum(naive, l, r));
    } else if (op == 4) {
      assert(beats.query_min(l, r) == naive_min(naive, l, r));
    } else {
      assert(beats.query_max(l, r) == naive_max(naive, l, r));
    }

    int ql = static_cast<int>(rng() % n);
    int qr = static_cast<int>(rng() % n);
    if (ql > qr) {
      std::swap(ql, qr);
    }
    assert(beats.query_sum(ql, qr) == naive_sum(naive, ql, qr));
    assert(beats.query_min(ql, qr) == naive_min(naive, ql, qr));
    assert(beats.query_max(ql, qr) == naive_max(naive, ql, qr));
  }
}

int main() {
  test_min_max_assign_trees();
  test_min_max_add_trees();
  test_merge_sort_tree();
  test_max_subarray_tree();
  test_segment_tree_beats();
  test_segment_tree_beats_random();
  return 0;
}

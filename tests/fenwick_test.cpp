#include <cassert>
#include <vector>

#include "../lib/solvers/fenwick.hpp"

static void test_sum_tree() {
  FenwickSumTree<int> ft(8);
  const int values[8] = {3, 1, 4, 1, 5, 9, 2, 6};

  for (int i = 0; i < 8; ++i) {
    ft.add(i, values[i]);
  }

  assert(ft.prefix(0) == 3);
  assert(ft.prefix(3) == 9);
  assert(ft.prefix(7) == 31);

  assert(ft.segment(2, 5) == 19);
  assert(ft.segment(0, 7) == 31);

  assert(ft.descend(1) == 0);
  assert(ft.descend(4) == 1);
  assert(ft.descend(15) == 5);
  assert(ft.descend(100) == 8);
}

static void test_xor_tree() {
  FenwickXorTree<int> ft(5);
  const int values[5] = {5, 1, 7, 3, 2};

  for (int i = 0; i < 5; ++i) {
    ft.add(i, values[i]);
  }

  assert(ft.prefix(0) == 5);
  assert(ft.prefix(2) == (5 ^ 1 ^ 7));
  assert(ft.segment(1, 3) == (1 ^ 7 ^ 3));
  assert(ft.segment(0, 4) == (5 ^ 1 ^ 7 ^ 3 ^ 2));
}

static void test_max_tree() {
  FenwickMaxTree<int> ft(7, -1000000007);
  const int values[7] = {1, 5, 2, 7, 3, 6, 4};

  for (int i = 0; i < 7; ++i) {
    ft.add(i, values[i]);
  }

  assert(ft.prefix(0) == 1);
  assert(ft.prefix(2) == 5);
  assert(ft.prefix(6) == 7);

  assert(ft.descend(0) == 0);
  assert(ft.descend(1) == 1);
  assert(ft.descend(5) == 3);
  assert(ft.descend(7) == 7);
}

static void test_min_tree() {
  FenwickMinTree<int> ft(5, 1000000007);
  const int values[5] = {7, 3, 5, 2, 8};

  for (int i = 0; i < 5; ++i) {
    ft.add(i, values[i]);
  }

  assert(ft.prefix(0) == 7);
  assert(ft.prefix(1) == 3);
  assert(ft.prefix(3) == 2);
}

int main() {
  test_sum_tree();
  test_xor_tree();
  test_max_tree();
  test_min_tree();
  return 0;
}

#include <algorithm>
#include <cassert>
#include <random>
#include <vector>

#include "../lib/sparse_table.hpp"

static int naive_min(const std::vector<int>& values, int left, int right) {
  if (values.empty() || left > right || right < 0 || left >= static_cast<int>(values.size())) {
    return 0;
  }
  if (left < 0) {
    left = 0;
  }
  if (right >= static_cast<int>(values.size())) {
    right = static_cast<int>(values.size()) - 1;
  }

  int result = values[left];
  for (int i = left + 1; i <= right; ++i) {
    result = std::min(result, values[i]);
  }
  return result;
}

static int naive_max(const std::vector<int>& values, int left, int right) {
  if (values.empty() || left > right || right < 0 || left >= static_cast<int>(values.size())) {
    return 0;
  }
  if (left < 0) {
    left = 0;
  }
  if (right >= static_cast<int>(values.size())) {
    right = static_cast<int>(values.size()) - 1;
  }

  int result = values[left];
  for (int i = left + 1; i <= right; ++i) {
    result = std::max(result, values[i]);
  }
  return result;
}

static void test_sparse_table_basic() {
  const std::vector<int> values = {5, 2, 7, 3, 9, 1, 4};
  edulcni::SparseMinTable<int> min_table(values);
  edulcni::SparseMaxTable<int> max_table(values);

  assert(min_table.size() == static_cast<int>(values.size()));
  assert(max_table.size() == static_cast<int>(values.size()));

  assert(min_table.query(0, 6) == 1);
  assert(min_table.query(1, 3) == 2);
  assert(min_table.query(2, 4) == 3);
  assert(max_table.query(0, 6) == 9);
  assert(max_table.query(1, 3) == 7);
  assert(max_table.query(4, 5) == 9);

  assert(min_table.query(-5, 100) == 1);
  assert(max_table.query(-5, 100) == 9);
  assert(min_table.query(5, 2) == 0);
}

static void test_sparse_table_empty() {
  edulcni::SparseMinTable<int> table;
  assert(table.empty());
  assert(table.query(0, 0) == 0);
}

static void test_sparse_table_random() {
  std::mt19937 rng(20260225);

  for (int it = 0; it < 300; ++it) {
    const int n = static_cast<int>(rng() % 150);
    std::vector<int> values(n, 0);
    for (int i = 0; i < n; ++i) {
      values[i] = static_cast<int>(rng() % 2001) - 1000;
    }

    edulcni::SparseMinTable<int> min_table(values);
    edulcni::SparseMaxTable<int> max_table(values);

    for (int q = 0; q < 1500; ++q) {
      int left = static_cast<int>(rng() % (n + 10)) - 5;
      int right = static_cast<int>(rng() % (n + 10)) - 5;
      if (left > right) {
        std::swap(left, right);
      }
      assert(min_table.query(left, right) == naive_min(values, left, right));
      assert(max_table.query(left, right) == naive_max(values, left, right));
    }
  }
}

int main() {
  test_sparse_table_basic();
  test_sparse_table_empty();
  test_sparse_table_random();
  return 0;
}

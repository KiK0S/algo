#include <algorithm>
#include <cassert>
#include <random>
#include <vector>

#include "../lib/solvers/implicit_treap.hpp"

static long long naive_range_sum(const std::vector<long long>& values, int left,
                                 int right) {
  if (left > right || right < 0 || left >= static_cast<int>(values.size())) {
    return 0LL;
  }
  if (left < 0) {
    left = 0;
  }
  if (right >= static_cast<int>(values.size())) {
    right = static_cast<int>(values.size()) - 1;
  }

  long long sum = 0LL;
  for (int i = left; i <= right; ++i) {
    sum += values[i];
  }
  return sum;
}

static void test_basic_treap() {
  ImplicitTreap<long long> treap(12345u);
  assert(treap.empty());

  treap.push_back(10);
  treap.push_back(20);
  treap.push_back(30);
  treap.insert(1, 15);

  assert(treap.to_vector() == std::vector<long long>({10, 15, 20, 30}));
  assert(treap.range_query(0, 3) == 75LL);
  assert(treap.range_query(1, 2) == 35LL);

  long long value = 0;
  assert(treap.get(2, value) && value == 20LL);
  assert(treap.set(2, 25LL));
  assert(treap.get(2, value) && value == 25LL);
  assert(treap.range_query(0, 3) == 80LL);

  long long erased = 0;
  assert(treap.erase(1, &erased));
  assert(erased == 15LL);
  assert(treap.to_vector() == std::vector<long long>({10, 25, 30}));

  assert(!treap.get(-1, value));
  assert(!treap.get(99, value));
  assert(!treap.set(99, 0LL));
  assert(!treap.erase(99));
}

static void test_assign_and_move() {
  std::vector<long long> initial = {3, 1, 4, 1, 5, 9, 2};
  ImplicitTreap<long long> treap(1u);
  treap.assign(initial.begin(), initial.end());
  assert(treap.to_vector() == initial);
  assert(treap.range_query(0, 6) == 25LL);

  ImplicitTreap<long long> moved(std::move(treap));
  assert(moved.to_vector() == initial);
  assert(treap.size() == 0);
  assert(treap.empty());
}

static void test_random_operations() {
  std::mt19937 rng(20260226);
  ImplicitTreap<long long> treap(987654321u);
  std::vector<long long> naive;

  for (int it = 0; it < 5000; ++it) {
    const int op = static_cast<int>(rng() % 7);

    if (op == 0) {
      const int position = static_cast<int>(rng() % (naive.size() + 1));
      const long long value = static_cast<long long>(static_cast<int>(rng() % 2001) - 1000);
      treap.insert(position, value);
      naive.insert(naive.begin() + position, value);
    } else if (op == 1) {
      if (naive.empty()) {
        continue;
      }
      const int position = static_cast<int>(rng() % naive.size());
      long long erased = 0;
      assert(treap.erase(position, &erased));
      assert(erased == naive[position]);
      naive.erase(naive.begin() + position);
    } else if (op == 2) {
      if (naive.empty()) {
        continue;
      }
      const int position = static_cast<int>(rng() % naive.size());
      const long long value = static_cast<long long>(static_cast<int>(rng() % 2001) - 1000);
      assert(treap.set(position, value));
      naive[position] = value;
    } else if (op == 3) {
      int left = static_cast<int>(rng() % (naive.size() + 5)) - 2;
      int right = static_cast<int>(rng() % (naive.size() + 5)) - 2;
      if (left > right) {
        std::swap(left, right);
      }
      assert(treap.range_query(left, right) == naive_range_sum(naive, left, right));
    } else if (op == 4) {
      if (naive.empty()) {
        continue;
      }
      const int position = static_cast<int>(rng() % naive.size());
      long long value = 0;
      assert(treap.get(position, value));
      assert(value == naive[position]);
    } else if (op == 5) {
      const long long value = static_cast<long long>(static_cast<int>(rng() % 3001) - 1500);
      treap.push_back(value);
      naive.push_back(value);
    } else {
      const std::vector<long long> from_treap = treap.to_vector();
      assert(from_treap == naive);
    }

    assert(treap.size() == static_cast<int>(naive.size()));
    assert(treap.to_vector() == naive);
  }
}

int main() {
  test_basic_treap();
  test_assign_and_move();
  test_random_operations();
  return 0;
}

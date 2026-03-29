#include <algorithm>
#include <cassert>
#include <optional>
#include <random>
#include <set>
#include <vector>

#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>

#include "../lib/ordered_set.hpp"

static std::optional<int> kth_from_std_set(const std::set<int>& st, int k) {
  if (k < 0 || k >= static_cast<int>(st.size())) {
    return std::nullopt;
  }
  auto it = st.begin();
  std::advance(it, k);
  return *it;
}

static int order_of_key_std_set(const std::set<int>& st, int key) {
  return static_cast<int>(std::distance(st.begin(), st.lower_bound(key)));
}

static void test_basic_operations() {
  edulcni::OrderedSet<int> os;
  assert(os.empty());
  assert(os.insert(8));
  assert(os.insert(3));
  assert(os.insert(10));
  assert(!os.insert(8));
  assert(os.size() == 3);
  assert(os.contains(3));
  assert(!os.contains(4));
  assert(os.order_of_key(8) == 1);
  assert(os.order_of_key(9) == 2);
  assert(os.find_by_order(0).value() == 3);
  assert(os.find_by_order(1).value() == 8);
  assert(os.find_by_order(2).value() == 10);
  assert(!os.find_by_order(3).has_value());
  assert(os.erase(8));
  assert(!os.erase(8));
  assert(os.size() == 2);
  assert(os.find_by_order(1).value() == 10);
}

static void test_random_against_std_set() {
  std::mt19937 rng(20260226);
  edulcni::OrderedSet<int> os;
  std::set<int> st;

  for (int it = 0; it < 7000; ++it) {
    const int op = static_cast<int>(rng() % 4);
    const int x = static_cast<int>(rng() % 100);

    if (op == 0) {
      assert(os.insert(x) == st.insert(x).second);
    } else if (op == 1) {
      assert(os.erase(x) == (st.erase(x) > 0));
    } else if (op == 2) {
      assert(os.order_of_key(x) == order_of_key_std_set(st, x));
    } else {
      const int k = static_cast<int>(rng() % 110) - 5;
      assert(os.find_by_order(k) == kth_from_std_set(st, k));
    }

    assert(os.size() == static_cast<int>(st.size()));
  }
}

int main() {
  test_basic_operations();
  test_random_against_std_set();
  return 0;
}

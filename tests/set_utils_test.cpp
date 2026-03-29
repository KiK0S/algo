#include <cassert>
#include <map>
#include <optional>
#include <set>
#include <string>

#include "../lib/set_utils.hpp"

static void test_iterator_navigation() {
  std::set<int> st = {2, 4, 7, 11};
  auto it = st.find(4);
  assert(it != st.end());

  const auto next_it = edulcni::next_iterator(st, it);
  assert(next_it.has_value());
  assert(**next_it == 7);

  const auto prev_it = edulcni::prev_iterator(st, it);
  assert(prev_it.has_value());
  assert(**prev_it == 2);

  const auto no_prev = edulcni::prev_iterator(st, st.begin());
  assert(!no_prev.has_value());

  const auto last = edulcni::prev_iterator(st, st.end());
  assert(last.has_value());
  assert(**last == 11);

  const auto no_next = edulcni::next_iterator(st, std::prev(st.end()));
  assert(!no_next.has_value());
}

static void test_key_navigation() {
  const std::set<int> st = {1, 3, 6, 10};
  assert(edulcni::next_value(st, 3).value() == 6);
  assert(edulcni::next_value(st, 4).value() == 6);
  assert(!edulcni::next_value(st, 10).has_value());

  assert(edulcni::prev_value(st, 6).value() == 3);
  assert(edulcni::prev_value(st, 5).value() == 3);
  assert(!edulcni::prev_value(st, 1).has_value());
}

static void test_map_values() {
  const std::map<int, std::string> mp = {
      {2, "a"},
      {5, "b"},
      {9, "c"},
  };

  const auto nxt = edulcni::next_value(mp, 2);
  assert(nxt.has_value());
  assert(nxt->first == 5);
  assert(nxt->second == "b");

  const auto prv = edulcni::prev_value(mp, 6);
  assert(prv.has_value());
  assert(prv->first == 5);
  assert(prv->second == "b");
}

int main() {
  test_iterator_navigation();
  test_key_navigation();
  test_map_values();
  return 0;
}

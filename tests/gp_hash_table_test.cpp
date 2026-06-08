#include <cassert>
#include <cstdint>
#include <random>
#include <unordered_map>
#include <utility>
#include <vector>

#include <ext/pb_ds/assoc_container.hpp>

#include "../lib/solvers/gp_hash_table.hpp"

static void test_basic_usage() {
  GpHashTable<long long, int> table;
  table[5] = 11;
  table[9] = 13;
  table[5] += 4;
  assert(table[5] == 15);
  assert(table[9] == 13);
  assert(table.find(7) == table.end());
  table.erase(9);
  assert(table.find(9) == table.end());
}

static void test_pair_keys() {
  using Key = std::pair<int, int>;
  using Table = GpHashTable<Key, int, PairHash<int, int>>;

  Table table;
  const Key a{1, 2};
  const Key b{2, 3};
  table[a] = 7;
  table[b] = 9;
  table[a] += 5;
  assert(table[a] == 12);
  assert(table[b] == 9);
}

static void test_random_against_unordered_map() {
  std::mt19937_64 rng(20260226);
  GpHashTable<std::uint64_t, int> table;
  std::unordered_map<std::uint64_t, int> reference;

  for (int it = 0; it < 50000; ++it) {
    const std::uint64_t key = rng() ^ (rng() << 1);
    const int op = static_cast<int>(rng() % 3);

    if (op == 0) {
      const int delta = static_cast<int>(rng() % 31) - 15;
      table[key] += delta;
      reference[key] += delta;
    } else if (op == 1) {
      table.erase(key);
      reference.erase(key);
    } else {
      const bool in_table = (table.find(key) != table.end());
      const bool in_reference = (reference.find(key) != reference.end());
      assert(in_table == in_reference);
      if (in_table) {
        assert(table[key] == reference[key]);
      }
    }
  }

  for (const auto& entry : reference) {
    const auto it = table.find(entry.first);
    assert(it != table.end());
    assert(it->second == entry.second);
  }
}

int main() {
  test_basic_usage();
  test_pair_keys();
  test_random_against_unordered_map();
  return 0;
}

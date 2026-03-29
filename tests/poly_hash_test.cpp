#include <algorithm>
#include <cassert>
#include <random>
#include <string>
#include <vector>

#include "../lib/poly_hash.hpp"

static bool substrings_equal(const std::string& s, int l1, int r1, int l2, int r2) {
  if (r1 - l1 != r2 - l2) {
    return false;
  }
  for (int i = 0; i < r1 - l1; ++i) {
    if (s[l1 + i] != s[l2 + i]) {
      return false;
    }
  }
  return true;
}

static void test_basic_hashing() {
  const std::string text = "abracadabra";
  const edulcni::PolyHash hash(text);

  assert(hash.size() == static_cast<int>(text.size()));
  assert(hash.hash_substring(0, 4) == edulcni::poly_hash_string("abra"));
  assert(hash.hash_substring(3, 7) == edulcni::poly_hash_string("acad"));
  assert(hash.hash_substring(7, 11) == edulcni::poly_hash_string("abra"));
  assert(hash.equal_substrings(0, 4, 7, 11));
  assert(!hash.equal_substrings(0, 4, 3, 7));

  const edulcni::PolyHashValue left = hash.hash_substring(0, 4);
  const edulcni::PolyHashValue right = hash.hash_substring(4, 7);
  const edulcni::PolyHashValue merged = hash.concat(left, right, 3);
  assert(merged == hash.hash_substring(0, 7));
}

static void test_all_hashes_of_length() {
  const std::string text = "mississippi";
  const edulcni::PolyHash hash(text);

  for (int len = 0; len <= static_cast<int>(text.size()); ++len) {
    const std::vector<edulcni::PolyHashValue> all = hash.all_hashes_of_length(len);
    assert(static_cast<int>(all.size()) == static_cast<int>(text.size()) - len + 1);
    for (int i = 0; i + len <= static_cast<int>(text.size()); ++i) {
      assert(all[i] == hash.hash_substring(i, i + len));
    }
  }
}

static void test_cross_string_comparison() {
  const std::string lhs_text = "bananabandana";
  const std::string rhs_text = "xxbananayyy";
  const edulcni::PolyHash lhs(lhs_text, 911382323);
  const edulcni::PolyHash rhs(rhs_text, 911382323);

  assert(edulcni::poly_hash_equal_substrings(lhs, 0, 6, rhs, 2, 8));
  assert(!edulcni::poly_hash_equal_substrings(lhs, 0, 7, rhs, 2, 9));
}

static void test_random_substrings() {
  std::mt19937 rng(42424242);

  for (int it = 0; it < 1000; ++it) {
    const int n = static_cast<int>(rng() % 60);
    const int alphabet = 1 + static_cast<int>(rng() % 8);
    std::string text(n, '\0');
    for (int i = 0; i < n; ++i) {
      text[i] = static_cast<char>(rng() % alphabet);
    }

    edulcni::PolyHash hash(text);
    for (int q = 0; q < 120; ++q) {
      int l1 = static_cast<int>(rng() % (n + 1));
      int r1 = static_cast<int>(rng() % (n + 1));
      if (l1 > r1) {
        std::swap(l1, r1);
      }

      int l2 = static_cast<int>(rng() % (n + 1));
      int r2 = static_cast<int>(rng() % (n + 1));
      if (l2 > r2) {
        std::swap(l2, r2);
      }

      const bool equal = substrings_equal(text, l1, r1, l2, r2);
      const bool by_hash = hash.equal_substrings(l1, r1, l2, r2);
      assert(equal == by_hash);
    }
  }
}

static void test_base_fallback() {
  const edulcni::PolyHash hash("abcdef", 1);
  assert(hash.base() == edulcni::PolyHash::kDefaultBase);
}

int main() {
  test_basic_hashing();
  test_all_hashes_of_length();
  test_cross_string_comparison();
  test_random_substrings();
  test_base_fallback();
  return 0;
}

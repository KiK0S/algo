#include <cassert>
#include <cstddef>
#include <limits>
#include <memory>
#include <numeric>
#include <stdexcept>
#include <vector>

#include "../lib/fast_allocator.hpp"

static void test_arena_allocate_and_reset() {
  edulcni::FastAllocatorArena arena(128);
  void* a = arena.allocate(16, 8);
  void* b = arena.allocate(24, 8);
  assert(a != nullptr);
  assert(b != nullptr);
  assert(a != b);
  const std::size_t remaining_after = arena.remaining();
  assert(remaining_after <= 128 - 40);
  arena.reset();
  assert(arena.remaining() == 128);
}

static void test_vector_with_fast_allocator() {
  edulcni::FastAllocatorArena arena(1U << 20U);
  using Alloc = edulcni::FastAllocator<int>;
  std::vector<int, Alloc> values{Alloc(arena)};

  for (int i = 0; i < 20000; ++i) {
    values.push_back(i);
  }
  const long long sum = std::accumulate(values.begin(), values.end(), 0LL);
  assert(sum == (19999LL * 20000LL) / 2);
}

static void test_rebind_and_multiple_types() {
  edulcni::FastAllocatorArena arena(1U << 20U);
  using Pair = std::pair<int, int>;
  std::vector<Pair, edulcni::FastAllocator<Pair>> edges{
      edulcni::FastAllocator<Pair>(arena)};
  std::vector<int, edulcni::FastAllocator<int>> values{
      edulcni::FastAllocator<int>(arena)};

  for (int i = 0; i < 5000; ++i) {
    edges.push_back(Pair{i, i * 2});
    values.push_back(i * 3);
  }

  assert(edges.size() == 5000);
  assert(values.size() == 5000);
  assert(edges[123].second == 246);
  assert(values[123] == 369);
}

static void test_out_of_memory() {
  edulcni::FastAllocatorArena arena(64);
  bool thrown = false;
  try {
    (void)arena.allocate(128, alignof(std::max_align_t));
  } catch (const std::bad_alloc&) {
    thrown = true;
  }
  assert(thrown);
}

int main() {
  test_arena_allocate_and_reset();
  test_vector_with_fast_allocator();
  test_rebind_and_multiple_types();
  test_out_of_memory();
  return 0;
}

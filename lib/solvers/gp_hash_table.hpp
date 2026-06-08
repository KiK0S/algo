struct SplitMix64Hash {
  static std::uint64_t mix(std::uint64_t x) {
    x += 0x9e3779b97f4a7c15ULL;
    x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
    x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
    x ^= (x >> 31);
    return x;
  }

  std::size_t operator()(std::uint64_t x) const {
    return static_cast<std::size_t>(mix(x));
  }
};

template <typename Key>
struct GpHash {
  std::size_t operator()(const Key& key) const {
    const std::uint64_t base = static_cast<std::uint64_t>(std::hash<Key>()(key));
    return static_cast<std::size_t>(SplitMix64Hash::mix(base));
  }
};

template <typename First, typename Second, typename FirstHash = GpHash<First>,
          typename SecondHash = GpHash<Second>>
struct PairHash {
  std::size_t operator()(const std::pair<First, Second>& value) const {
    const std::uint64_t h1 = static_cast<std::uint64_t>(FirstHash()(value.first));
    const std::uint64_t h2 = static_cast<std::uint64_t>(SecondHash()(value.second));
    return static_cast<std::size_t>(
        SplitMix64Hash::mix(h1 ^ (h2 + 0x9e3779b97f4a7c15ULL + (h1 << 6) + (h1 >> 2))));
  }
};

template <typename Key, typename Value, typename Hash = GpHash<Key>>
using GpHashTable = __gnu_pbds::gp_hash_table<Key, Value, Hash>;

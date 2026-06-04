struct PolyHashValue {
  int first;
  int second;

  PolyHashValue(int first_ = 0, int second_ = 0)
      : first(first_), second(second_) {}
};

inline bool operator==(const PolyHashValue& lhs, const PolyHashValue& rhs) {
  return lhs.first == rhs.first && lhs.second == rhs.second;
}

inline bool operator!=(const PolyHashValue& lhs, const PolyHashValue& rhs) {
  return !(lhs == rhs);
}

inline bool operator<(const PolyHashValue& lhs, const PolyHashValue& rhs) {
  if (lhs.first != rhs.first) {
    return lhs.first < rhs.first;
  }
  return lhs.second < rhs.second;
}

class PolyHash {
 public:
  static constexpr int kMod1 = 1000000007;
  static constexpr int kMod2 = 1000000009;
  static constexpr int kDefaultBase = 911382323;

  explicit PolyHash(const std::string& text = std::string(),
                    int base = kDefaultBase) {
    build(text, base);
  }

  void build(const std::string& text, int base = kDefaultBase) {
    text_ = text;
    base_ = choose_base(base);
    const int n = static_cast<int>(text_.size());

    prefix1_.assign(n + 1, 0);
    prefix2_.assign(n + 1, 0);
    power1_.assign(n + 1, 1);
    power2_.assign(n + 1, 1);

    for (int i = 0; i < n; ++i) {
      const int value = static_cast<int>(static_cast<unsigned char>(text_[i])) + 1;
      prefix1_[i + 1] =
          static_cast<int>((static_cast<long long>(prefix1_[i]) * base_mod1_ + value) %
                           kMod1);
      prefix2_[i + 1] =
          static_cast<int>((static_cast<long long>(prefix2_[i]) * base_mod2_ + value) %
                           kMod2);
      power1_[i + 1] =
          static_cast<int>((static_cast<long long>(power1_[i]) * base_mod1_) % kMod1);
      power2_[i + 1] =
          static_cast<int>((static_cast<long long>(power2_[i]) * base_mod2_) % kMod2);
    }
  }

  int size() const { return static_cast<int>(text_.size()); }

  int base() const { return base_; }

  PolyHashValue hash_prefix(int length) const { return hash_substring(0, length); }

  PolyHashValue hash_substring(int left, int right) const {
    const int n = size();
    if (left < 0) {
      left = 0;
    }
    if (right > n) {
      right = n;
    }
    if (left >= right) {
      return PolyHashValue(0, 0);
    }

    const int len = right - left;
    int value1 =
        prefix1_[right] -
        static_cast<int>((static_cast<long long>(prefix1_[left]) * power1_[len]) % kMod1);
    if (value1 < 0) {
      value1 += kMod1;
    }

    int value2 =
        prefix2_[right] -
        static_cast<int>((static_cast<long long>(prefix2_[left]) * power2_[len]) % kMod2);
    if (value2 < 0) {
      value2 += kMod2;
    }

    return PolyHashValue(value1, value2);
  }

  std::vector<PolyHashValue> all_hashes_of_length(int length) const {
    const int n = size();
    if (length < 0 || length > n) {
      return {};
    }
    std::vector<PolyHashValue> hashes;
    hashes.reserve(n - length + 1);
    for (int i = 0; i + length <= n; ++i) {
      hashes.push_back(hash_substring(i, i + length));
    }
    return hashes;
  }

  bool equal_substrings(int left1, int right1, int left2, int right2) const {
    if (right1 - left1 != right2 - left2) {
      return false;
    }
    return hash_substring(left1, right1) == hash_substring(left2, right2);
  }

  PolyHashValue concat(const PolyHashValue& left, const PolyHashValue& right,
                       int right_length) const {
    if (right_length < 0 || right_length >= static_cast<int>(power1_.size())) {
      return PolyHashValue(0, 0);
    }

    const int merged1 =
        static_cast<int>((static_cast<long long>(left.first) * power1_[right_length] +
                          right.first) %
                         kMod1);
    const int merged2 =
        static_cast<int>((static_cast<long long>(left.second) * power2_[right_length] +
                          right.second) %
                         kMod2);
    return PolyHashValue(merged1, merged2);
  }

  const std::string& text() const { return text_; }

 private:
  std::string text_;
  int base_;
  int base_mod1_;
  int base_mod2_;
  std::vector<int> prefix1_;
  std::vector<int> prefix2_;
  std::vector<int> power1_;
  std::vector<int> power2_;

  static int normalize_mod(int value, int mod) {
    int x = value % mod;
    if (x < 0) {
      x += mod;
    }
    return x;
  }

  int choose_base(int base) {
    int candidate = base;
    int mod1 = normalize_mod(candidate, kMod1);
    int mod2 = normalize_mod(candidate, kMod2);
    if (mod1 <= 1 || mod2 <= 1) {
      candidate = kDefaultBase;
      mod1 = normalize_mod(candidate, kMod1);
      mod2 = normalize_mod(candidate, kMod2);
    }
    base_mod1_ = mod1;
    base_mod2_ = mod2;
    return candidate;
  }
};

inline PolyHashValue poly_hash_string(const std::string& text,
                                      int base = PolyHash::kDefaultBase) {
  PolyHash hash(text, base);
  return hash.hash_prefix(static_cast<int>(text.size()));
}

inline bool poly_hash_equal_substrings(const PolyHash& lhs, int left1, int right1,
                                       const PolyHash& rhs, int left2,
                                       int right2) {
  if (lhs.base() != rhs.base() || right1 - left1 != right2 - left2) {
    return false;
  }
  return lhs.hash_substring(left1, right1) == rhs.hash_substring(left2, right2);
}


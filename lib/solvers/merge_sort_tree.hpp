template <typename T>
class MergeSortTree {
 public:
  explicit MergeSortTree(int n = 0) { reset(n); }

  explicit MergeSortTree(const std::vector<T>& values) { build(values); }

  void reset(int n) {
    n_ = n < 0 ? 0 : n;
    tree_.assign(4 * std::max(1, n_), std::vector<T>());
  }

  void build(const std::vector<T>& values) {
    reset(static_cast<int>(values.size()));
    if (n_ > 0) {
      build_rec(1, 0, n_ - 1, values);
    }
  }

  int size() const { return n_; }

  int count_less(int left, int right, const T& x) const {
    if (!norm(left, right)) {
      return 0;
    }
    return count_less_rec(1, 0, n_ - 1, left, right, x);
  }

  int count_less_equal(int left, int right, const T& x) const {
    if (!norm(left, right)) {
      return 0;
    }
    return count_less_equal_rec(1, 0, n_ - 1, left, right, x);
  }

  int count_greater(int left, int right, const T& x) const {
    if (!norm(left, right)) {
      return 0;
    }
    return right - left + 1 - count_less_equal(left, right, x);
  }

  int count_greater_equal(int left, int right, const T& x) const {
    if (!norm(left, right)) {
      return 0;
    }
    return right - left + 1 - count_less(left, right, x);
  }

  int count_in_range(int left, int right, const T& low, const T& high) const {
    if (high < low || !norm(left, right)) {
      return 0;
    }
    return count_less_equal(left, right, high) - count_less(left, right, low);
  }

  bool exists(int left, int right, const T& x) const {
    return count_in_range(left, right, x, x) > 0;
  }

 private:
  int n_;
  std::vector<std::vector<T>> tree_;

  bool norm(int& left, int& right) const {
    if (n_ == 0 || left > right || right < 0 || left >= n_) {
      return false;
    }
    left = std::max(left, 0);
    right = std::min(right, n_ - 1);
    return left <= right;
  }

  void build_rec(int v, int tl, int tr, const std::vector<T>& values) {
    if (tl == tr) {
      tree_[v] = {values[tl]};
      return;
    }
    const int tm = (tl + tr) / 2;
    build_rec(v * 2, tl, tm, values);
    build_rec(v * 2 + 1, tm + 1, tr, values);
    tree_[v].resize(tree_[v * 2].size() + tree_[v * 2 + 1].size());
    std::merge(tree_[v * 2].begin(), tree_[v * 2].end(),
               tree_[v * 2 + 1].begin(), tree_[v * 2 + 1].end(),
               tree_[v].begin());
  }

  int count_less_rec(int v, int tl, int tr, int l, int r, const T& x) const {
    if (tl > r || tr < l) {
      return 0;
    }
    if (l <= tl && tr <= r) {
      return static_cast<int>(
          std::lower_bound(tree_[v].begin(), tree_[v].end(), x) -
          tree_[v].begin());
    }
    const int tm = (tl + tr) / 2;
    return count_less_rec(v * 2, tl, tm, l, r, x) +
           count_less_rec(v * 2 + 1, tm + 1, tr, l, r, x);
  }

  int count_less_equal_rec(int v, int tl, int tr, int l, int r,
                           const T& x) const {
    if (tl > r || tr < l) {
      return 0;
    }
    if (l <= tl && tr <= r) {
      return static_cast<int>(
          std::upper_bound(tree_[v].begin(), tree_[v].end(), x) -
          tree_[v].begin());
    }
    const int tm = (tl + tr) / 2;
    return count_less_equal_rec(v * 2, tl, tm, l, r, x) +
           count_less_equal_rec(v * 2 + 1, tm + 1, tr, l, r, x);
  }
};


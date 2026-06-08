template <typename T>
struct MaxSubarrayNode {
  T sum;
  T prefix;
  T suffix;
  T best;
  bool valid;
};

template <typename T>
class MaxSubarraySegTree {
 public:
  using Node = MaxSubarrayNode<T>;

  explicit MaxSubarraySegTree(int n = 0) : n_(n < 0 ? 0 : n) { init_storage(); }

  explicit MaxSubarraySegTree(const std::vector<T>& values) : n_(0) { build(values); }

  void reset(int n) {
    n_ = (n < 0 ? 0 : n);
    init_storage();
  }

  void build(const std::vector<T>& values) {
    n_ = static_cast<int>(values.size());
    init_storage();
    if (n_ == 0) {
      return;
    }
    build_rec(1, 0, n_ - 1, values);
  }

  int size() const { return n_; }

  void point_set(int idx, const T& value) {
    if (idx < 0 || idx >= n_) {
      return;
    }
    point_set_rec(1, 0, n_ - 1, idx, value);
  }

  Node get(int left, int right) const {
    if (!normalize_range(left, right)) {
      return neutral_node();
    }
    return get_rec(1, 0, n_ - 1, left, right);
  }

  T max_sum(int left, int right) const { return get(left, right).best; }

 private:
  int n_;
  std::vector<Node> tree_;

  static Node neutral_node() { return Node{T(0), T(0), T(0), T(0), false}; }

  static Node make_leaf(const T& value) {
    return Node{value, value, value, value, true};
  }

  static Node combine(const Node& lhs, const Node& rhs) {
    if (!lhs.valid) {
      return rhs;
    }
    if (!rhs.valid) {
      return lhs;
    }
    Node result;
    result.valid = true;
    result.sum = lhs.sum + rhs.sum;
    result.prefix = std::max(lhs.prefix, lhs.sum + rhs.prefix);
    result.suffix = std::max(rhs.suffix, rhs.sum + lhs.suffix);
    result.best = std::max(std::max(lhs.best, rhs.best), lhs.suffix + rhs.prefix);
    return result;
  }

  void init_storage() { tree_.assign(4 * std::max(1, n_), neutral_node()); }

  bool normalize_range(int& left, int& right) const {
    if (n_ == 0 || left > right || right < 0 || left >= n_) {
      return false;
    }
    if (left < 0) {
      left = 0;
    }
    if (right >= n_) {
      right = n_ - 1;
    }
    return left <= right;
  }

  void build_rec(int v, int tl, int tr, const std::vector<T>& values) {
    if (tl == tr) {
      tree_[v] = make_leaf(values[tl]);
      return;
    }
    const int tm = (tl + tr) / 2;
    build_rec(v * 2, tl, tm, values);
    build_rec(v * 2 + 1, tm + 1, tr, values);
    tree_[v] = combine(tree_[v * 2], tree_[v * 2 + 1]);
  }

  void point_set_rec(int v, int tl, int tr, int idx, const T& value) {
    if (tl == tr) {
      tree_[v] = make_leaf(value);
      return;
    }
    const int tm = (tl + tr) / 2;
    if (idx <= tm) {
      point_set_rec(v * 2, tl, tm, idx, value);
    } else {
      point_set_rec(v * 2 + 1, tm + 1, tr, idx, value);
    }
    tree_[v] = combine(tree_[v * 2], tree_[v * 2 + 1]);
  }

  Node get_rec(int v, int tl, int tr, int l, int r) const {
    if (tl > r || l > tr) {
      return neutral_node();
    }
    if (l <= tl && tr <= r) {
      return tree_[v];
    }
    const int tm = (tl + tr) / 2;
    return combine(get_rec(v * 2, tl, tm, l, r),
                   get_rec(v * 2 + 1, tm + 1, tr, l, r));
  }
};

template <typename T>
class SegmentMinAddTree {
 public:
  explicit SegmentMinAddTree(int n = 0) { reset(n); }

  explicit SegmentMinAddTree(const std::vector<T>& values) { build(values); }

  void reset(int n) {
    n_ = n < 0 ? 0 : n;
    tree_.assign(4 * std::max(1, n_), inf());
    lazy_.assign(4 * std::max(1, n_), T(0));
  }

  void build(const std::vector<T>& values) {
    reset(static_cast<int>(values.size()));
    if (n_ > 0) {
      build_rec(1, 0, n_ - 1, values);
    }
  }

  int size() const { return n_; }

  void add(int left, int right, const T& delta) {
    if (!norm(left, right)) {
      return;
    }
    add_rec(1, 0, n_ - 1, left, right, delta);
  }

  T get(int left, int right) {
    if (!norm(left, right)) {
      return inf();
    }
    return get_rec(1, 0, n_ - 1, left, right);
  }

  T query(int left, int right) { return get(left, right); }

  int first_leq(int left, int right, const T& target) {
    if (!norm(left, right)) {
      return -1;
    }
    return first_leq_rec(1, 0, n_ - 1, left, right, target);
  }

 private:
  int n_;
  std::vector<T> tree_;
  std::vector<T> lazy_;

  static T inf() { return std::numeric_limits<T>::max(); }

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
      tree_[v] = values[tl];
      return;
    }
    const int tm = (tl + tr) / 2;
    build_rec(v * 2, tl, tm, values);
    build_rec(v * 2 + 1, tm + 1, tr, values);
    tree_[v] = std::min(tree_[v * 2], tree_[v * 2 + 1]);
  }

  void apply(int v, const T& delta) {
    tree_[v] += delta;
    lazy_[v] += delta;
  }

  void push(int v) {
    if (lazy_[v] == T(0)) {
      return;
    }
    apply(v * 2, lazy_[v]);
    apply(v * 2 + 1, lazy_[v]);
    lazy_[v] = T(0);
  }

  void add_rec(int v, int tl, int tr, int l, int r, const T& delta) {
    if (tl > r || tr < l) {
      return;
    }
    if (l <= tl && tr <= r) {
      apply(v, delta);
      return;
    }
    push(v);
    const int tm = (tl + tr) / 2;
    add_rec(v * 2, tl, tm, l, r, delta);
    add_rec(v * 2 + 1, tm + 1, tr, l, r, delta);
    tree_[v] = std::min(tree_[v * 2], tree_[v * 2 + 1]);
  }

  T get_rec(int v, int tl, int tr, int l, int r) {
    if (tl > r || tr < l) {
      return inf();
    }
    if (l <= tl && tr <= r) {
      return tree_[v];
    }
    push(v);
    const int tm = (tl + tr) / 2;
    return std::min(get_rec(v * 2, tl, tm, l, r),
                    get_rec(v * 2 + 1, tm + 1, tr, l, r));
  }

  int first_leq_rec(int v, int tl, int tr, int l, int r, const T& target) {
    if (tl > r || tr < l || tree_[v] > target) {
      return -1;
    }
    if (tl == tr) {
      return tl;
    }
    push(v);
    const int tm = (tl + tr) / 2;
    const int left = first_leq_rec(v * 2, tl, tm, l, r, target);
    return left != -1 ? left
                      : first_leq_rec(v * 2 + 1, tm + 1, tr, l, r, target);
  }
};


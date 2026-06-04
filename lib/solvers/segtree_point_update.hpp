template <typename T>
struct SegmentSumOp {
  static T neutral() { return T(0); }
  static T combine(const T& a, const T& b) { return a + b; }
};

template <typename T>
struct SegmentMinOp {
  static T neutral() { return std::numeric_limits<T>::max(); }
  static T combine(const T& a, const T& b) { return a < b ? a : b; }
};

template <typename T>
struct SegmentMaxOp {
  static T neutral() { return std::numeric_limits<T>::lowest(); }
  static T combine(const T& a, const T& b) { return a < b ? b : a; }
};

template <typename T, typename Op>
class SegmentTree {
 public:
  explicit SegmentTree(int n = 0) { reset(n); }

  explicit SegmentTree(const std::vector<T>& values) { build(values); }

  void reset(int n) {
    n_ = n < 0 ? 0 : n;
    tree_.assign(2 * std::max(1, n_), Op::neutral());
  }

  void build(const std::vector<T>& values) {
    n_ = static_cast<int>(values.size());
    tree_.assign(2 * std::max(1, n_), Op::neutral());
    for (int i = 0; i < n_; ++i) {
      tree_[n_ + i] = values[i];
    }
    for (int i = n_ - 1; i > 0; --i) {
      tree_[i] = Op::combine(tree_[i << 1], tree_[i << 1 | 1]);
    }
  }

  int size() const { return n_; }

  void point_set(int pos, const T& value) {
    if (pos < 0 || pos >= n_) {
      return;
    }
    pos += n_;
    tree_[pos] = value;
    for (pos >>= 1; pos > 0; pos >>= 1) {
      tree_[pos] = Op::combine(tree_[pos << 1], tree_[pos << 1 | 1]);
    }
  }

  T query(int left, int right) const {
    if (left < 0) {
      left = 0;
    }
    if (right > n_) {
      right = n_;
    }
    if (left >= right || n_ == 0) {
      return Op::neutral();
    }

    T lhs = Op::neutral();
    T rhs = Op::neutral();
    for (left += n_, right += n_; left < right; left >>= 1, right >>= 1) {
      if (left & 1) {
        lhs = Op::combine(lhs, tree_[left++]);
      }
      if (right & 1) {
        rhs = Op::combine(tree_[--right], rhs);
      }
    }
    return Op::combine(lhs, rhs);
  }

 private:
  int n_;
  std::vector<T> tree_;
};

template <typename T>
using SegmentSumTree = SegmentTree<T, SegmentSumOp<T>>;

template <typename T>
using SegmentMinTree = SegmentTree<T, SegmentMinOp<T>>;

template <typename T>
using SegmentMaxTree = SegmentTree<T, SegmentMaxOp<T>>;


template <typename T>
struct SparseMinOp {
  static T combine(const T& lhs, const T& rhs) { return (lhs < rhs ? lhs : rhs); }
};

template <typename T>
struct SparseMaxOp {
  static T combine(const T& lhs, const T& rhs) { return (lhs < rhs ? rhs : lhs); }
};

template <typename T, typename Op>
class SparseTable {
 public:
  SparseTable() : n_(0) {}

  explicit SparseTable(const std::vector<T>& values) : n_(0) { build(values); }

  void build(const std::vector<T>& values) {
    n_ = static_cast<int>(values.size());
    table_.clear();
    log2_.clear();
    if (n_ == 0) {
      return;
    }

    log2_.assign(n_ + 1, 0);
    for (int i = 2; i <= n_; ++i) {
      log2_[i] = log2_[i / 2] + 1;
    }

    const int levels = log2_[n_] + 1;
    table_.assign(levels, std::vector<T>());
    table_[0] = values;
    for (int level = 1; level < levels; ++level) {
      const int len = 1 << level;
      const int half = len >> 1;
      table_[level].assign(n_ - len + 1, T());
      for (int i = 0; i + len <= n_; ++i) {
        table_[level][i] =
            Op::combine(table_[level - 1][i], table_[level - 1][i + half]);
      }
    }
  }

  int size() const { return n_; }

  bool empty() const { return n_ == 0; }

  T query(int left, int right) const {
    if (n_ == 0 || left > right || right < 0 || left >= n_) {
      return T();
    }
    if (left < 0) {
      left = 0;
    }
    if (right >= n_) {
      right = n_ - 1;
    }

    const int len = right - left + 1;
    const int level = log2_[len];
    return Op::combine(table_[level][left],
                       table_[level][right - (1 << level) + 1]);
  }

 private:
  int n_;
  std::vector<std::vector<T>> table_;
  std::vector<int> log2_;
};

template <typename T>
using SparseMinTable = SparseTable<T, SparseMinOp<T>>;

template <typename T>
using SparseMaxTable = SparseTable<T, SparseMaxOp<T>>;


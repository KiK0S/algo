class RollbackDsu {
 public:
  explicit RollbackDsu(int n = 0) { reset(n); }

  void reset(int n) {
    n_ = (n < 0 ? 0 : n);
    components_ = n_;
    parent_.resize(n_);
    size_.assign(n_, 1);
    history_.clear();
    for (int i = 0; i < n_; ++i) {
      parent_[i] = i;
    }
  }

  int size() const { return n_; }

  int components() const { return components_; }

  int find(int v) const {
    if (v < 0 || v >= n_) {
      return -1;
    }
    while (parent_[v] != v) {
      v = parent_[v];
    }
    return v;
  }

  bool same(int a, int b) const {
    const int root_a = find(a);
    const int root_b = find(b);
    return root_a != -1 && root_a == root_b;
  }

  int component_size(int v) const {
    const int root = find(v);
    return root == -1 ? 0 : size_[root];
  }

  int snapshot() const { return static_cast<int>(history_.size()); }

  bool unite(int a, int b) {
    int root_a = find(a);
    int root_b = find(b);
    if (root_a == -1 || root_b == -1 || root_a == root_b) {
      history_.push_back(Change{-1, -1, -1});
      return false;
    }
    if (size_[root_a] > size_[root_b]) {
      std::swap(root_a, root_b);
    }
    history_.push_back(Change{root_a, root_b, size_[root_b]});
    parent_[root_a] = root_b;
    size_[root_b] += size_[root_a];
    --components_;
    return true;
  }

  void rollback() {
    if (history_.empty()) {
      return;
    }
    undo_one();
  }

  void rollback(int snapshot_id) {
    if (snapshot_id < 0) {
      snapshot_id = 0;
    }
    while (static_cast<int>(history_.size()) > snapshot_id) {
      undo_one();
    }
  }

 private:
  struct Change {
    int child;
    int parent;
    int parent_size;
  };

  int n_;
  int components_;
  std::vector<int> parent_;
  std::vector<int> size_;
  std::vector<Change> history_;

  void undo_one() {
    const Change change = history_.back();
    history_.pop_back();
    if (change.child == -1) {
      return;
    }
    parent_[change.child] = change.child;
    size_[change.parent] = change.parent_size;
    ++components_;
  }
};


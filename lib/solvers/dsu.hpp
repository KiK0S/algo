class Dsu {
 public:
  explicit Dsu(int n = 0) { reset(n); }

  void reset(int n) {
    n_ = (n < 0 ? 0 : n);
    components_ = n_;
    parent_.resize(n_);
    size_.assign(n_, 1);
    for (int i = 0; i < n_; ++i) {
      parent_[i] = i;
    }
  }

  int size() const { return n_; }

  int components() const { return components_; }

  int find(int v) {
    if (v < 0 || v >= n_) {
      return -1;
    }
    if (parent_[v] == v) {
      return v;
    }
    parent_[v] = find(parent_[v]);
    return parent_[v];
  }

  bool unite(int a, int b) {
    int root_a = find(a);
    int root_b = find(b);
    if (root_a == -1 || root_b == -1 || root_a == root_b) {
      return false;
    }

    if (size_[root_a] > size_[root_b]) {
      std::swap(root_a, root_b);
    }
    parent_[root_a] = root_b;
    size_[root_b] += size_[root_a];
    --components_;
    return true;
  }

  bool same(int a, int b) { return find(a) == find(b) && find(a) != -1; }

  int component_size(int v) {
    const int root = find(v);
    if (root == -1) {
      return 0;
    }
    return size_[root];
  }

  const std::vector<int>& parents() const { return parent_; }

 private:
  int n_;
  int components_;
  std::vector<int> parent_;
  std::vector<int> size_;
};

class LcaBinaryLifting {
 public:
  explicit LcaBinaryLifting(int n = 0) { reset(n); }

  void reset(int n) {
    n_ = (n < 0 ? 0 : n);
    max_log_ = 1;
    while ((1 << max_log_) <= std::max(1, n_)) {
      ++max_log_;
    }
    graph_.assign(n_, std::vector<int>());
    depth_.assign(n_, 0);
    parent_.assign(n_, -1);
    component_.assign(n_, -1);
    up_.assign(max_log_, std::vector<int>(n_, -1));
  }

  int size() const { return n_; }

  void add_edge(int a, int b, bool undirected = true) {
    if (!ok(a) || !ok(b)) {
      return;
    }
    graph_[a].push_back(b);
    if (undirected && a != b) {
      graph_[b].push_back(a);
    }
  }

  void build(int root = 0) {
    if (n_ == 0) {
      return;
    }
    std::fill(depth_.begin(), depth_.end(), 0);
    std::fill(parent_.begin(), parent_.end(), -1);
    std::fill(component_.begin(), component_.end(), -1);
    for (int bit = 0; bit < max_log_; ++bit) {
      std::fill(up_[bit].begin(), up_[bit].end(), -1);
    }

    int comp = 0;
    if (ok(root)) {
      dfs(root, -1, comp++);
    }
    for (int v = 0; v < n_; ++v) {
      if (component_[v] == -1) {
        dfs(v, -1, comp++);
      }
    }
    for (int bit = 1; bit < max_log_; ++bit) {
      for (int v = 0; v < n_; ++v) {
        const int mid = up_[bit - 1][v];
        up_[bit][v] = (mid == -1 ? -1 : up_[bit - 1][mid]);
      }
    }
  }

  int parent(int v) const { return ok(v) ? parent_[v] : -1; }

  int depth(int v) const { return ok(v) ? depth_[v] : -1; }

  int component(int v) const { return ok(v) ? component_[v] : -1; }

  int kth_ancestor(int v, int k) const {
    if (!ok(v) || k < 0) {
      return -1;
    }
    for (int bit = 0; k > 0 && v != -1; ++bit, k >>= 1) {
      if (k & 1) {
        if (bit >= max_log_) {
          return -1;
        }
        v = up_[bit][v];
      }
    }
    return v;
  }

  int lca(int a, int b) const {
    if (!ok(a) || !ok(b) || component_[a] != component_[b]) {
      return -1;
    }
    if (depth_[a] < depth_[b]) {
      std::swap(a, b);
    }
    a = kth_ancestor(a, depth_[a] - depth_[b]);
    if (a == b) {
      return a;
    }
    for (int bit = max_log_ - 1; bit >= 0; --bit) {
      if (up_[bit][a] != up_[bit][b]) {
        a = up_[bit][a];
        b = up_[bit][b];
      }
    }
    return parent_[a];
  }

  int dist(int a, int b) const {
    const int c = lca(a, b);
    return c == -1 ? -1 : depth_[a] + depth_[b] - 2 * depth_[c];
  }

 private:
  int n_;
  int max_log_;
  std::vector<std::vector<int>> graph_;
  std::vector<int> depth_;
  std::vector<int> parent_;
  std::vector<int> component_;
  std::vector<std::vector<int>> up_;

  bool ok(int v) const { return v >= 0 && v < n_; }

  void dfs(int root, int root_parent, int comp) {
    std::vector<int> stack(1, root);
    parent_[root] = root_parent;
    component_[root] = comp;
    up_[0][root] = root_parent;

    while (!stack.empty()) {
      const int v = stack.back();
      stack.pop_back();
      for (int to : graph_[v]) {
        if (to == parent_[v] || component_[to] != -1) {
          continue;
        }
        parent_[to] = v;
        component_[to] = comp;
        depth_[to] = depth_[v] + 1;
        up_[0][to] = v;
        stack.push_back(to);
      }
    }
  }
};

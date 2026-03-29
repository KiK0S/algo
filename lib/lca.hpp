#ifndef EDULCNI_LCA_HPP
#define EDULCNI_LCA_HPP

#include "sparse_table.hpp"

namespace edulcni {

struct LcaEulerNode {
  int depth;
  int vertex;

  LcaEulerNode(int depth_ = 0, int vertex_ = -1)
      : depth(depth_), vertex(vertex_) {}
};

struct LcaEulerMinOp {
  static LcaEulerNode combine(const LcaEulerNode& lhs, const LcaEulerNode& rhs) {
    return (lhs.depth < rhs.depth ? lhs : rhs);
  }
};

class Lca {
 public:
  explicit Lca(int n = 0) : n_(0), root_(0), max_log_(0) { reset(n); }

  void reset(int n) {
    n_ = (n < 0 ? 0 : n);
    root_ = 0;
    max_log_ = 0;
    graph_.assign(n_, std::vector<int>());
    parent_.assign(n_, -1);
    depth_.assign(n_, 0);
    first_.assign(n_, -1);
    component_.assign(n_, -1);
    up_.clear();
    euler_.clear();
  }

  int size() const { return n_; }

  void add_edge(int u, int v, bool undirected = true) {
    if (u < 0 || u >= n_ || v < 0 || v >= n_) {
      return;
    }
    graph_[u].push_back(v);
    if (undirected && u != v) {
      graph_[v].push_back(u);
    }
  }

  void build(int root = 0) {
    if (n_ == 0) {
      return;
    }
    if (root < 0 || root >= n_) {
      root = 0;
    }
    root_ = root;

    std::fill(parent_.begin(), parent_.end(), -1);
    std::fill(depth_.begin(), depth_.end(), 0);
    std::fill(first_.begin(), first_.end(), -1);
    std::fill(component_.begin(), component_.end(), -1);
    euler_.clear();

    max_log_ = 1;
    while ((1 << max_log_) <= std::max(1, n_)) {
      ++max_log_;
    }
    up_.assign(max_log_, std::vector<int>(n_, -1));

    int component_id = 0;
    dfs_build(root_, -1, component_id);
    ++component_id;
    for (int v = 0; v < n_; ++v) {
      if (first_[v] != -1) {
        continue;
      }
      depth_[v] = 0;
      dfs_build(v, -1, component_id);
      ++component_id;
    }

    for (int bit = 1; bit < max_log_; ++bit) {
      for (int v = 0; v < n_; ++v) {
        const int mid = up_[bit - 1][v];
        up_[bit][v] = (mid == -1 ? -1 : up_[bit - 1][mid]);
      }
    }

    rmq_.build(euler_);
  }

  int root() const { return root_; }

  const std::vector<std::vector<int>>& graph() const { return graph_; }

  int parent(int v) const { return vertex_ok(v) ? parent_[v] : -1; }

  int depth(int v) const { return vertex_ok(v) ? depth_[v] : -1; }

  int component(int v) const { return vertex_ok(v) ? component_[v] : -1; }

  int lca(int a, int b) const {
    if (!vertex_ok(a) || !vertex_ok(b) || first_[a] == -1 || first_[b] == -1 ||
        component_[a] != component_[b]) {
      return -1;
    }

    int left = first_[a];
    int right = first_[b];
    if (left > right) {
      std::swap(left, right);
    }
    return rmq_.query(left, right).vertex;
  }

  int dist(int a, int b) const {
    const int c = lca(a, b);
    if (c == -1) {
      return -1;
    }
    return depth_[a] + depth_[b] - 2 * depth_[c];
  }

  int kth_ancestor(int v, int k) const {
    if (!vertex_ok(v) || k < 0) {
      return -1;
    }

    int node = v;
    int steps = k;
    int bit = 0;
    while (steps > 0 && node != -1) {
      if (steps & 1) {
        node = (bit < max_log_ ? up_[bit][node] : -1);
      }
      steps >>= 1;
      ++bit;
    }
    return node;
  }

 private:
  int n_;
  int root_;
  int max_log_;
  std::vector<std::vector<int>> graph_;
  std::vector<int> parent_;
  std::vector<int> depth_;
  std::vector<int> first_;
  std::vector<int> component_;
  std::vector<std::vector<int>> up_;
  std::vector<LcaEulerNode> euler_;
  SparseTable<LcaEulerNode, LcaEulerMinOp> rmq_;

  bool vertex_ok(int v) const { return v >= 0 && v < n_; }

  void dfs_build(int v, int parent, int component_id) {
    parent_[v] = parent;
    component_[v] = component_id;
    up_[0][v] = parent;
    first_[v] = static_cast<int>(euler_.size());
    euler_.push_back(LcaEulerNode(depth_[v], v));

    for (int to : graph_[v]) {
      if (to == parent) {
        continue;
      }
      if (component_[to] != -1) {
        continue;
      }
      depth_[to] = depth_[v] + 1;
      dfs_build(to, v, component_id);
      euler_.push_back(LcaEulerNode(depth_[v], v));
    }
  }
};

}  // namespace edulcni

#endif  // EDULCNI_LCA_HPP

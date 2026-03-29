#ifndef EDULCNI_DINIC_HPP
#define EDULCNI_DINIC_HPP

namespace edulcni {

template <typename Cap>
class Dinic {
 public:
  struct Edge {
    int to;
    int rev;
    Cap cap;
    Cap original_cap;

    Edge(int to_ = 0, int rev_ = 0, Cap cap_ = Cap(0),
         Cap original_cap_ = Cap(0))
        : to(to_), rev(rev_), cap(cap_), original_cap(original_cap_) {}

    Cap flow() const { return original_cap - cap; }
  };

  explicit Dinic(int n = 0) : n_(0) { reset(n); }

  void reset(int n) {
    n_ = (n < 0 ? 0 : n);
    graph_.assign(n_, std::vector<Edge>());
    level_.assign(n_, -1);
    iter_.assign(n_, 0);
  }

  int size() const { return n_; }

  int add_edge(int from, int to, Cap cap, Cap rev_cap = Cap(0)) {
    if (from < 0 || from >= n_ || to < 0 || to >= n_ || cap < Cap(0) ||
        rev_cap < Cap(0)) {
      return -1;
    }

    const int from_id = static_cast<int>(graph_[from].size());
    const int to_id = static_cast<int>(graph_[to].size());
    graph_[from].push_back(Edge(to, to_id, cap, cap));
    graph_[to].push_back(Edge(from, from_id, rev_cap, rev_cap));
    return from_id;
  }

  Cap max_flow(int source, int sink) {
    if (source < 0 || source >= n_ || sink < 0 || sink >= n_ ||
        source == sink) {
      return Cap(0);
    }

    Cap total_flow = Cap(0);
    while (build_level_graph(source, sink)) {
      std::fill(iter_.begin(), iter_.end(), 0);
      while (true) {
        const Cap pushed =
            push_flow(source, sink, std::numeric_limits<Cap>::max());
        if (pushed == Cap(0)) {
          break;
        }
        total_flow += pushed;
      }
    }
    return total_flow;
  }

  bool left_of_min_cut(int vertex) const {
    return vertex >= 0 && vertex < n_ && level_[vertex] != -1;
  }

  const std::vector<std::vector<Edge>>& graph() const { return graph_; }

 private:
  int n_;
  std::vector<std::vector<Edge>> graph_;
  std::vector<int> level_;
  std::vector<int> iter_;

  bool build_level_graph(int source, int sink) {
    std::fill(level_.begin(), level_.end(), -1);
    std::queue<int> q;
    level_[source] = 0;
    q.push(source);

    while (!q.empty()) {
      const int v = q.front();
      q.pop();

      for (const Edge& edge : graph_[v]) {
        if (edge.cap <= Cap(0) || level_[edge.to] != -1) {
          continue;
        }
        level_[edge.to] = level_[v] + 1;
        q.push(edge.to);
      }
    }

    return level_[sink] != -1;
  }

  Cap push_flow(int v, int sink, Cap flow_limit) {
    if (v == sink || flow_limit == Cap(0)) {
      return flow_limit;
    }

    for (int& edge_id = iter_[v];
         edge_id < static_cast<int>(graph_[v].size()); ++edge_id) {
      Edge& edge = graph_[v][edge_id];
      if (edge.cap <= Cap(0) || level_[edge.to] != level_[v] + 1) {
        continue;
      }

      const Cap pushed =
          push_flow(edge.to, sink, std::min(flow_limit, edge.cap));
      if (pushed == Cap(0)) {
        continue;
      }

      edge.cap -= pushed;
      graph_[edge.to][edge.rev].cap += pushed;
      return pushed;
    }
    return Cap(0);
  }
};

}  // namespace edulcni

#endif  // EDULCNI_DINIC_HPP

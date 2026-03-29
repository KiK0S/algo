#ifndef EDULCNI_TWOSAT_HPP
#define EDULCNI_TWOSAT_HPP

#include "kosaraju.hpp"

namespace edulcni {

class TwoSat {
 public:
  explicit TwoSat(int variables = 0) : variables_(0) { reset(variables); }

  void reset(int variables) {
    variables_ = (variables < 0 ? 0 : variables);
    graph_.assign(2 * variables_, std::vector<int>());
    assignment_.assign(variables_, false);
    solved_ = false;
    satisfiable_ = false;
  }

  int size() const { return variables_; }

  void add_implication(int a, bool a_value, int b, bool b_value) {
    if (!variable_ok(a) || !variable_ok(b)) {
      return;
    }
    add_direct_implication(a, a_value, b, b_value);
    add_direct_implication(b, !b_value, a, !a_value);
  }

  void add_or(int a, bool a_value, int b, bool b_value) {
    if (!variable_ok(a) || !variable_ok(b)) {
      return;
    }
    add_direct_implication(a, !a_value, b, b_value);
    add_direct_implication(b, !b_value, a, a_value);
  }

  void add_xor(int a, bool a_value, int b, bool b_value) {
    add_or(a, a_value, b, b_value);
    add_or(a, !a_value, b, !b_value);
  }

  void add_equal(int a, bool a_value, int b, bool b_value) {
    add_or(a, a_value, b, !b_value);
    add_or(a, !a_value, b, b_value);
  }

  void add_true(int var, bool value = true) {
    if (!variable_ok(var)) {
      return;
    }
    add_direct_implication(var, !value, var, value);
  }

  void add_false(int var) { add_true(var, false); }

  bool solve() {
    const KosarajuResult scc = kosaraju_scc(graph_);
    assignment_.assign(variables_, false);
    solved_ = true;
    satisfiable_ = true;

    for (int var = 0; var < variables_; ++var) {
      const int true_node = literal_node(var, true);
      const int false_node = literal_node(var, false);
      if (scc.component_of[true_node] == scc.component_of[false_node]) {
        satisfiable_ = false;
        return false;
      }
    }

    const int components = scc.component_count;
    std::vector<int> indegree(components, 0);
    for (int comp = 0; comp < components; ++comp) {
      for (int to_comp : scc.condensation_dag[comp]) {
        if (to_comp >= 0 && to_comp < components) {
          ++indegree[to_comp];
        }
      }
    }

    std::vector<int> queue;
    queue.reserve(components);
    for (int comp = 0; comp < components; ++comp) {
      if (indegree[comp] == 0) {
        queue.push_back(comp);
      }
    }

    std::vector<int> topo_order;
    topo_order.reserve(components);
    for (int idx = 0; idx < static_cast<int>(queue.size()); ++idx) {
      const int comp = queue[idx];
      topo_order.push_back(comp);
      for (int to_comp : scc.condensation_dag[comp]) {
        if (to_comp < 0 || to_comp >= components) {
          continue;
        }
        --indegree[to_comp];
        if (indegree[to_comp] == 0) {
          queue.push_back(to_comp);
        }
      }
    }

    if (static_cast<int>(topo_order.size()) != components) {
      satisfiable_ = false;
      return false;
    }

    std::vector<int> rank(components, 0);
    for (int i = 0; i < components; ++i) {
      rank[topo_order[i]] = i;
    }

    for (int var = 0; var < variables_; ++var) {
      const int true_comp = scc.component_of[literal_node(var, true)];
      const int false_comp = scc.component_of[literal_node(var, false)];
      assignment_[var] = rank[true_comp] > rank[false_comp];
    }

    if (!assignment_satisfies_implications(assignment_)) {
      satisfiable_ = false;
      assignment_.assign(variables_, false);
      return false;
    }
    return true;
  }

  bool solved() const { return solved_; }

  bool satisfiable() const { return solved_ && satisfiable_; }

  bool value(int var) const {
    if (!solved_ || !satisfiable_ || !variable_ok(var)) {
      return false;
    }
    return assignment_[var];
  }

  const std::vector<bool>& assignment() const { return assignment_; }

  const std::vector<std::vector<int>>& implication_graph() const { return graph_; }

 private:
  int variables_;
  std::vector<std::vector<int>> graph_;
  std::vector<bool> assignment_;
  bool solved_;
  bool satisfiable_;

  bool variable_ok(int var) const { return var >= 0 && var < variables_; }

  static int literal_node(int var, bool value) { return 2 * var + (value ? 0 : 1); }

  void add_direct_implication(int a, bool a_value, int b, bool b_value) {
    graph_[literal_node(a, a_value)].push_back(literal_node(b, b_value));
  }

  static bool literal_truth(const std::vector<bool>& assignment, int literal_node) {
    const int var = literal_node / 2;
    const bool literal_value = (literal_node % 2 == 0);
    return assignment[var] == literal_value;
  }

  bool assignment_satisfies_implications(const std::vector<bool>& assignment) const {
    for (int from = 0; from < static_cast<int>(graph_.size()); ++from) {
      if (!literal_truth(assignment, from)) {
        continue;
      }
      for (int to : graph_[from]) {
        if (to < 0 || to >= static_cast<int>(graph_.size())) {
          continue;
        }
        if (!literal_truth(assignment, to)) {
          return false;
        }
      }
    }
    return true;
  }
};

}  // namespace edulcni

#endif  // EDULCNI_TWOSAT_HPP

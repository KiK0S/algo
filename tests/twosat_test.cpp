#include <algorithm>
#include <cassert>
#include <functional>
#include <random>
#include <vector>

#include "../lib/twosat.hpp"

enum class ConstraintType { kOr, kXor, kEqual, kImplication, kTrue };

struct Constraint {
  ConstraintType type;
  int a;
  bool a_value;
  int b;
  bool b_value;
};

static bool eval_literal(const std::vector<bool>& assign, int var, bool value) {
  return assign[var] == value;
}

static bool eval_constraint(const Constraint& c, const std::vector<bool>& assign) {
  if (c.type == ConstraintType::kTrue) {
    return eval_literal(assign, c.a, c.a_value);
  }

  const bool lhs = eval_literal(assign, c.a, c.a_value);
  const bool rhs = eval_literal(assign, c.b, c.b_value);
  if (c.type == ConstraintType::kOr) {
    return lhs || rhs;
  }
  if (c.type == ConstraintType::kXor) {
    return lhs != rhs;
  }
  if (c.type == ConstraintType::kEqual) {
    return lhs == rhs;
  }
  return (!lhs) || rhs;
}

static bool brute_force_satisfiable(int variables,
                                    const std::vector<Constraint>& constraints,
                                    std::vector<bool>* witness = nullptr) {
  const int total = (variables >= 0 && variables < 30 ? (1 << variables) : 0);
  for (int mask = 0; mask < total; ++mask) {
    std::vector<bool> assign(variables, false);
    for (int i = 0; i < variables; ++i) {
      assign[i] = ((mask >> i) & 1) != 0;
    }

    bool ok = true;
    for (const Constraint& c : constraints) {
      if (!eval_constraint(c, assign)) {
        ok = false;
        break;
      }
    }
    if (ok) {
      if (witness != nullptr) {
        *witness = assign;
      }
      return true;
    }
  }
  return false;
}

static void test_twosat_basic() {
  edulcni::TwoSat sat(3);
  sat.add_or(0, true, 1, true);
  sat.add_or(0, false, 1, true);
  sat.add_or(1, false, 2, true);
  sat.add_true(2, true);

  assert(sat.solve());
  const std::vector<bool> assign = sat.assignment();
  assert(assign[2]);
  assert((assign[0] || assign[1]));
  assert((!assign[0] || assign[1]));
  assert((!assign[1] || assign[2]));
}

static void test_twosat_unsat() {
  edulcni::TwoSat sat(1);
  sat.add_true(0, true);
  sat.add_true(0, false);
  assert(!sat.solve());
}

static void test_twosat_random_against_bruteforce() {
  std::mt19937 rng(20260227);

  for (int it = 0; it < 500; ++it) {
    const int n = 1 + static_cast<int>(rng() % 8);
    edulcni::TwoSat sat(n);
    std::vector<Constraint> constraints;

    const int m = 1 + static_cast<int>(rng() % 24);
    for (int i = 0; i < m; ++i) {
      const int type = static_cast<int>(rng() % 5);
      if (type == 4) {
        const int a = static_cast<int>(rng() % n);
        const bool av = (rng() & 1u) != 0u;
        sat.add_true(a, av);
        constraints.push_back({ConstraintType::kTrue, a, av, -1, false});
        continue;
      }

      const int a = static_cast<int>(rng() % n);
      const int b = static_cast<int>(rng() % n);
      const bool av = (rng() & 1u) != 0u;
      const bool bv = (rng() & 1u) != 0u;

      if (type == 0) {
        sat.add_or(a, av, b, bv);
        constraints.push_back({ConstraintType::kOr, a, av, b, bv});
      } else if (type == 1) {
        sat.add_xor(a, av, b, bv);
        constraints.push_back({ConstraintType::kXor, a, av, b, bv});
      } else if (type == 2) {
        sat.add_equal(a, av, b, bv);
        constraints.push_back({ConstraintType::kEqual, a, av, b, bv});
      } else {
        sat.add_implication(a, av, b, bv);
        constraints.push_back({ConstraintType::kImplication, a, av, b, bv});
      }
    }

    std::vector<bool> witness;
    const bool expected = brute_force_satisfiable(n, constraints, &witness);
    const bool got = sat.solve();
    assert(got == expected);

    if (got) {
      const std::vector<bool> assign = sat.assignment();
      for (const Constraint& c : constraints) {
        assert(eval_constraint(c, assign));
      }
    }
  }
}

int main() {
  test_twosat_basic();
  test_twosat_unsat();
  test_twosat_random_against_bruteforce();
  return 0;
}

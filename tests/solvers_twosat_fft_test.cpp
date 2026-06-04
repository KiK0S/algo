#include <algorithm>
#include <cassert>
#include <cmath>
#include <complex>
#include <vector>

#include "../lib/solvers/fft_ntt.hpp"
#include "../lib/solvers/twosat.hpp"

static void test_twosat_solver_path() {
  TwoSat sat(2);
  sat.add_or(0, true, 1, true);
  sat.add_or(0, false, 1, true);
  assert(sat.solve());
  const auto assignment = sat.assignment();
  assert((assignment[0] || assignment[1]));
  assert((!assignment[0] || assignment[1]));

  TwoSat impossible(1);
  impossible.add_true(0, true);
  impossible.add_true(0, false);
  assert(!impossible.solve());
}

static void test_fft_solver_path() {
  const std::vector<long long> a = {1, 2, 3};
  const std::vector<long long> b = {4, 5};
  const std::vector<long long> expected = {4, 13, 22, 15};
  assert(convolution_fft_round(a, b) == expected);
}

static void test_ntt_solver_path() {
  const std::vector<int> a = {1, 2, 3, 4};
  const std::vector<int> b = {5, 6, 7};
  const std::vector<int> expected = {5, 16, 34, 52, 45, 28};
  assert(convolution_ntt_int(a, b) == expected);

  std::vector<int> values = {1, 2, 3, 4};
  const std::vector<int> original = values;
  assert(ntt_transform(values, false));
  assert(ntt_transform(values, true));
  assert(values == original);
}

int main() {
  test_twosat_solver_path();
  test_fft_solver_path();
  test_ntt_solver_path();
  return 0;
}

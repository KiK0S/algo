#include <algorithm>
#include <cassert>
#include <cmath>
#include <deque>
#include <vector>

#include "../lib/halfplane_intersection.hpp"

using Pld = edulcni::Point2<long double>;

static bool close_ld(long double lhs, long double rhs, long double eps = 1e-9L) {
  return std::fabs(lhs - rhs) <= eps;
}

static bool close_point(const Pld& lhs, const Pld& rhs, long double eps = 1e-9L) {
  return close_ld(lhs.x, rhs.x, eps) && close_ld(lhs.y, rhs.y, eps);
}

static long double polygon_area2(const std::vector<Pld>& polygon) {
  long double sum = 0.0L;
  for (int i = 0; i < static_cast<int>(polygon.size()); ++i) {
    const Pld& a = polygon[i];
    const Pld& b = polygon[(i + 1) % static_cast<int>(polygon.size())];
    sum += a.x * b.y - a.y * b.x;
  }
  return std::fabs(sum);
}

static std::vector<Pld> sorted_points(std::vector<Pld> points) {
  std::sort(points.begin(), points.end(), [](const Pld& lhs, const Pld& rhs) {
    if (!close_ld(lhs.x, rhs.x, 1e-9L)) {
      return lhs.x < rhs.x;
    }
    return lhs.y < rhs.y;
  });
  return points;
}

static void assert_point_set_equal(std::vector<Pld> actual, std::vector<Pld> expected) {
  actual = sorted_points(actual);
  expected = sorted_points(expected);
  assert(actual.size() == expected.size());
  for (int i = 0; i < static_cast<int>(actual.size()); ++i) {
    assert(close_point(actual[i], expected[i]));
  }
}

static void test_square_intersection() {
  std::vector<edulcni::HalfPlane> halfplanes = {
      edulcni::HalfPlane(0.0L, 0.0L, 1.0L, 0.0L),
      edulcni::HalfPlane(1.0L, 0.0L, 1.0L, 1.0L),
      edulcni::HalfPlane(1.0L, 1.0L, 0.0L, 1.0L),
      edulcni::HalfPlane(0.0L, 1.0L, 0.0L, 0.0L),
  };

  const std::vector<Pld> polygon = edulcni::halfplane_intersection(halfplanes);
  assert(polygon.size() == 4);
  assert_point_set_equal(polygon, {Pld(0.0L, 0.0L), Pld(1.0L, 0.0L),
                                   Pld(1.0L, 1.0L), Pld(0.0L, 1.0L)});
  assert(close_ld(polygon_area2(polygon), 2.0L));
}

static void test_triangle_intersection() {
  std::vector<edulcni::HalfPlane> halfplanes = {
      edulcni::HalfPlane(0.0L, 0.0L, 2.0L, 0.0L),
      edulcni::HalfPlane(2.0L, 0.0L, 0.0L, 2.0L),
      edulcni::HalfPlane(0.0L, 2.0L, 0.0L, 0.0L),
  };

  const std::vector<Pld> polygon = edulcni::halfplane_intersection(halfplanes);
  assert(polygon.size() == 3);
  assert_point_set_equal(polygon,
                         {Pld(0.0L, 0.0L), Pld(2.0L, 0.0L), Pld(0.0L, 2.0L)});
  assert(close_ld(polygon_area2(polygon), 4.0L));
}

static void test_empty_intersection() {
  std::vector<edulcni::HalfPlane> halfplanes = {
      edulcni::HalfPlane(1.0L, 1.0L, 1.0L, 0.0L),  // x >= 1
      edulcni::HalfPlane(0.0L, 0.0L, 0.0L, 1.0L),  // x <= 0
      edulcni::HalfPlane(0.0L, 0.0L, 1.0L, 0.0L),  // y >= 0
      edulcni::HalfPlane(1.0L, 1.0L, 0.0L, 1.0L),  // y <= 1
  };

  const std::vector<Pld> polygon = edulcni::halfplane_intersection(halfplanes);
  assert(polygon.empty());
}

static void test_parallel_redundant_constraints() {
  std::vector<edulcni::HalfPlane> halfplanes = {
      edulcni::HalfPlane(0.0L, 0.0L, 1.0L, 0.0L),  // y >= 0 (redundant)
      edulcni::HalfPlane(0.0L, 1.0L, 1.0L, 1.0L),  // y >= 1
      edulcni::HalfPlane(2.0L, 0.0L, 2.0L, 1.0L),  // x <= 2
      edulcni::HalfPlane(0.0L, 1.0L, 0.0L, 0.0L),  // x >= 0
      edulcni::HalfPlane(2.0L, 3.0L, 0.0L, 3.0L),  // y <= 3
  };

  const std::vector<Pld> polygon = edulcni::halfplane_intersection(halfplanes);
  assert(polygon.size() == 4);
  assert_point_set_equal(polygon, {Pld(0.0L, 1.0L), Pld(2.0L, 1.0L),
                                   Pld(2.0L, 3.0L), Pld(0.0L, 3.0L)});
  assert(close_ld(polygon_area2(polygon), 8.0L));
}

static void test_from_inequality() {
  std::vector<edulcni::HalfPlane> halfplanes = {
      edulcni::HalfPlane::from_inequality(-1.0L, 0.0L, 0.0L),  // x >= 0
      edulcni::HalfPlane::from_inequality(1.0L, 0.0L, 2.0L),   // x <= 2
      edulcni::HalfPlane::from_inequality(0.0L, -1.0L, 0.0L),  // y >= 0
      edulcni::HalfPlane::from_inequality(0.0L, 1.0L, 2.0L),   // y <= 2
  };

  const std::vector<Pld> polygon = edulcni::halfplane_intersection(halfplanes);
  assert(polygon.size() == 4);
  assert_point_set_equal(polygon, {Pld(0.0L, 0.0L), Pld(2.0L, 0.0L),
                                   Pld(2.0L, 2.0L), Pld(0.0L, 2.0L)});
  assert(close_ld(polygon_area2(polygon), 8.0L));
}

int main() {
  test_square_intersection();
  test_triangle_intersection();
  test_empty_intersection();
  test_parallel_redundant_constraints();
  test_from_inequality();
  return 0;
}

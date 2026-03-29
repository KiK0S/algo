#include <algorithm>
#include <cassert>
#include <cmath>
#include <random>
#include <vector>

#include "../lib/geometry.hpp"

using Pll = edulcni::Point2<long long>;
using Pld = edulcni::Point2<long double>;

static bool close_ld(long double lhs, long double rhs, long double eps = 1e-9L) {
  return std::fabs(lhs - rhs) <= eps;
}

static bool close_point(const Pld& lhs, const Pld& rhs, long double eps = 1e-9L) {
  return close_ld(lhs.x, rhs.x, eps) && close_ld(lhs.y, rhs.y, eps);
}

static bool point_in_vector(const std::vector<Pll>& points, const Pll& target) {
  for (const Pll& p : points) {
    if (p == target) {
      return true;
    }
  }
  return false;
}

static void test_point_ops_and_orientation() {
  const Pll a(1, 2);
  const Pll b(3, 5);
  const Pll c = a + b;
  assert(c == Pll(4, 7));
  assert((b - a) == Pll(2, 3));
  assert(a.dot(b) == 13);
  assert(a.cross(b) == -1);
  assert(edulcni::orientation(Pll(0, 0), Pll(2, 0), Pll(1, 1)) == 1);
  assert(edulcni::orientation(Pll(0, 0), Pll(2, 0), Pll(1, -1)) == -1);
  assert(edulcni::orientation(Pll(0, 0), Pll(2, 0), Pll(1, 0)) == 0);
}

static void test_convex_hull_basic() {
  std::vector<Pll> points = {
      Pll(0, 0), Pll(4, 0), Pll(4, 4), Pll(0, 4), Pll(2, 2), Pll(1, 1),
      Pll(3, 3), Pll(2, 4), Pll(0, 0), Pll(4, 4)};

  const std::vector<Pll> hull = edulcni::convex_hull(points);
  const std::vector<Pll> expected = {Pll(0, 0), Pll(4, 0), Pll(4, 4), Pll(0, 4)};
  assert(hull == expected);
}

static void test_convex_hull_collinear() {
  std::vector<Pll> points = {Pll(-3, 0), Pll(-1, 0), Pll(0, 0), Pll(2, 0), Pll(5, 0)};
  const std::vector<Pll> hull = edulcni::convex_hull(points);
  assert(hull == std::vector<Pll>({Pll(-3, 0), Pll(5, 0)}));
}

static void test_convex_hull_random_shape() {
  std::mt19937 rng(2025);
  for (int it = 0; it < 250; ++it) {
    const int n = 5 + static_cast<int>(rng() % 40);
    std::vector<Pll> points;
    points.reserve(n);
    for (int i = 0; i < n; ++i) {
      points.push_back(Pll(static_cast<long long>(rng() % 41) - 20,
                           static_cast<long long>(rng() % 41) - 20));
    }

    const std::vector<Pll> hull = edulcni::convex_hull(points);
    if (hull.size() <= 2) {
      continue;
    }

    for (int i = 0; i < static_cast<int>(hull.size()); ++i) {
      const Pll& prev = hull[(i + static_cast<int>(hull.size()) - 1) %
                             static_cast<int>(hull.size())];
      const Pll& cur = hull[i];
      const Pll& next = hull[(i + 1) % static_cast<int>(hull.size())];
      assert(edulcni::orientation(prev, cur, next) > 0);
    }

    for (const Pll& p : hull) {
      assert(point_in_vector(points, p));
    }
  }
}

static void test_segment_intersection() {
  {
    const std::vector<Pld> inter =
        edulcni::segment_intersection(Pll(0, 0), Pll(2, 2), Pll(0, 2), Pll(2, 0));
    assert(inter.size() == 1);
    assert(close_point(inter[0], Pld(1.0L, 1.0L)));
  }
  {
    const std::vector<Pld> inter =
        edulcni::segment_intersection(Pll(0, 0), Pll(2, 0), Pll(2, 0), Pll(3, 1));
    assert(inter.size() == 1);
    assert(close_point(inter[0], Pld(2.0L, 0.0L)));
  }
  {
    const std::vector<Pld> inter =
        edulcni::segment_intersection(Pll(0, 0), Pll(5, 0), Pll(2, 0), Pll(4, 0));
    assert(inter.size() == 2);
    assert(close_point(inter[0], Pld(2.0L, 0.0L)));
    assert(close_point(inter[1], Pld(4.0L, 0.0L)));
  }
  {
    const std::vector<Pld> inter =
        edulcni::segment_intersection(Pll(0, 0), Pll(1, 1), Pll(2, 0), Pll(3, 1));
    assert(inter.empty());
  }
  {
    const std::vector<Pld> inter =
        edulcni::segment_intersection(Pll(0, 0), Pll(6, 0), Pll(2, 0), Pll(10, 0));
    assert(inter.size() == 2);
    assert(close_point(inter[0], Pld(2.0L, 0.0L)));
    assert(close_point(inter[1], Pld(6.0L, 0.0L)));
  }
}

static void test_angle_sort_vectors() {
  std::vector<Pll> vectors = {
      Pll(-1, -1), Pll(0, -1), Pll(1, -1), Pll(1, 0),  Pll(1, 1),
      Pll(0, 1),   Pll(-1, 1), Pll(-1, 0), Pll(2, 0),  Pll(2, 2),
      Pll(-2, 0),  Pll(0, -2)};

  edulcni::sort_vectors_by_angle(vectors);
  const std::vector<Pll> expected = {
      Pll(1, 0), Pll(2, 0),  Pll(1, 1),  Pll(2, 2),  Pll(0, 1),   Pll(-1, 1),
      Pll(-1, 0), Pll(-2, 0), Pll(-1, -1), Pll(0, -1), Pll(0, -2), Pll(1, -1)};
  assert(vectors == expected);
}

static void test_angle_sort_points_around_center() {
  const Pll center(10, -7);
  std::vector<Pll> points = {
      center + Pll(-1, -1), center + Pll(1, 0),   center + Pll(0, -2),
      center + Pll(0, 1),   center + Pll(-2, 0),  center + Pll(1, 1),
      center + Pll(2, 0),   center + Pll(-1, 1),  center + Pll(1, -1)};

  edulcni::sort_points_by_angle(points, center);
  for (int i = 0; i + 1 < static_cast<int>(points.size()); ++i) {
    const Pll v1 = points[i] - center;
    const Pll v2 = points[i + 1] - center;
    assert(!edulcni::angle_less(v2, v1));
  }
}

static void test_angle_sort_random_against_atan2() {
  std::mt19937 rng(77);
  const long double pi = std::acos(-1.0L);

  for (int it = 0; it < 300; ++it) {
    const int n = 1 + static_cast<int>(rng() % 40);
    std::vector<Pll> vectors;
    vectors.reserve(n);
    while (static_cast<int>(vectors.size()) < n) {
      const long long x = static_cast<long long>(rng() % 51) - 25;
      const long long y = static_cast<long long>(rng() % 51) - 25;
      if (x == 0 && y == 0) {
        continue;
      }
      vectors.push_back(Pll(x, y));
    }

    edulcni::sort_vectors_by_angle(vectors);
    long double prev_angle = -1.0L;
    long double prev_dist = -1.0L;

    for (const Pll& v : vectors) {
      long double angle = std::atan2(static_cast<long double>(v.y),
                                     static_cast<long double>(v.x));
      if (angle < 0) {
        angle += 2.0L * pi;
      }
      const long double dist =
          static_cast<long double>(v.x) * v.x + static_cast<long double>(v.y) * v.y;
      if (prev_angle < 0) {
        prev_angle = angle;
        prev_dist = dist;
        continue;
      }
      if (std::fabs(angle - prev_angle) <= 1e-12L) {
        assert(dist + 1e-12L >= prev_dist);
      } else {
        assert(angle + 1e-12L >= prev_angle);
      }
      prev_angle = angle;
      prev_dist = dist;
    }
  }
}

int main() {
  test_point_ops_and_orientation();
  test_convex_hull_basic();
  test_convex_hull_collinear();
  test_convex_hull_random_shape();
  test_segment_intersection();
  test_angle_sort_vectors();
  test_angle_sort_points_around_center();
  test_angle_sort_random_against_atan2();
  return 0;
}

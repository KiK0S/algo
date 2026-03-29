#ifndef EDULCNI_HALFPLANE_INTERSECTION_HPP
#define EDULCNI_HALFPLANE_INTERSECTION_HPP

#include "geometry.hpp"

namespace edulcni {

struct HalfPlane {
  Point2<long double> point;
  Point2<long double> direction;
  long double angle;

  HalfPlane(const Point2<long double>& point_ = Point2<long double>(),
            const Point2<long double>& through = Point2<long double>(1.0L, 0.0L))
      : point(point_), direction(through - point_), angle(0.0L) {
    normalize();
  }

  HalfPlane(long double x1, long double y1, long double x2, long double y2)
      : point(x1, y1), direction(x2 - x1, y2 - y1), angle(0.0L) {
    normalize();
  }

  static HalfPlane from_inequality(long double a, long double b, long double c) {
    if (std::fabs(a) <= 1e-18L && std::fabs(b) <= 1e-18L) {
      return HalfPlane(Point2<long double>(0.0L, 0.0L),
                       Point2<long double>(1.0L, 0.0L));
    }

    Point2<long double> p;
    if (std::fabs(a) > std::fabs(b)) {
      p = Point2<long double>(c / a, 0.0L);
    } else {
      p = Point2<long double>(0.0L, c / b);
    }
    const Point2<long double> dir(-b, a);
    return HalfPlane(p, p + dir);
  }

  bool out(const Point2<long double>& p, long double eps = 1e-12L) const {
    return cross_ld(direction, p - point) < -eps;
  }

 private:
  void normalize() {
    angle = std::atan2(direction.y, direction.x);
    if (angle < 0.0L) {
      angle += 2.0L * std::acos(-1.0L);
    }
  }
};

inline bool halfplane_parallel(const HalfPlane& lhs, const HalfPlane& rhs,
                               long double eps = 1e-12L) {
  return std::fabs(cross_ld(lhs.direction, rhs.direction)) <= eps;
}

inline bool halfplane_less(const HalfPlane& lhs, const HalfPlane& rhs,
                           long double eps = 1e-12L) {
  if (std::fabs(lhs.angle - rhs.angle) > eps) {
    return lhs.angle < rhs.angle;
  }
  return cross_ld(lhs.direction, rhs.point - lhs.point) < 0.0L;
}

inline bool halfplane_intersection_point(const HalfPlane& lhs, const HalfPlane& rhs,
                                         Point2<long double>& out,
                                         long double eps = 1e-12L) {
  return line_intersection(lhs.point, lhs.point + lhs.direction, rhs.point,
                           rhs.point + rhs.direction, out, eps);
}

inline std::vector<Point2<long double>> halfplane_intersection(
    std::vector<HalfPlane> halfplanes, long double eps = 1e-12L) {
  std::sort(halfplanes.begin(), halfplanes.end(),
            [&](const HalfPlane& lhs, const HalfPlane& rhs) {
              return halfplane_less(lhs, rhs, eps);
            });

  std::deque<HalfPlane> deque_planes;
  std::deque<Point2<long double>> deque_intersections;

  for (const HalfPlane& plane : halfplanes) {
    while (!deque_intersections.empty() && plane.out(deque_intersections.back(), eps)) {
      deque_intersections.pop_back();
      deque_planes.pop_back();
    }
    while (!deque_intersections.empty() && plane.out(deque_intersections.front(), eps)) {
      deque_intersections.pop_front();
      deque_planes.pop_front();
    }

    if (!deque_planes.empty() && halfplane_parallel(deque_planes.back(), plane, eps)) {
      if (plane.out(deque_planes.back().point, eps)) {
        deque_planes.back() = plane;
      }
      continue;
    }

    if (!deque_planes.empty()) {
      Point2<long double> intersection;
      if (!halfplane_intersection_point(deque_planes.back(), plane, intersection, eps)) {
        return {};
      }
      deque_intersections.push_back(intersection);
    }
    deque_planes.push_back(plane);
  }

  while (deque_intersections.size() > 0 &&
         deque_planes.front().out(deque_intersections.back(), eps)) {
    deque_intersections.pop_back();
    deque_planes.pop_back();
  }
  while (deque_intersections.size() > 0 &&
         deque_planes.back().out(deque_intersections.front(), eps)) {
    deque_intersections.pop_front();
    deque_planes.pop_front();
  }

  if (deque_planes.size() < 3) {
    return {};
  }

  Point2<long double> closing_intersection;
  if (!halfplane_intersection_point(deque_planes.back(), deque_planes.front(),
                                    closing_intersection, eps)) {
    return {};
  }
  deque_intersections.push_back(closing_intersection);

  return std::vector<Point2<long double>>(deque_intersections.begin(),
                                          deque_intersections.end());
}

}  // namespace edulcni

#endif  // EDULCNI_HALFPLANE_INTERSECTION_HPP

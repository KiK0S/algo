#ifndef EDULCNI_MODINT_HPP
#define EDULCNI_MODINT_HPP

namespace edulcni {

template <int MOD>
class StaticModInt {
 public:
  static_assert(MOD > 0, "MOD must be positive");

  StaticModInt() : value_(0) {}

  template <typename T>
  StaticModInt(T value) : value_(normalize(static_cast<long long>(value))) {}

  static constexpr int mod() { return MOD; }

  int value() const { return value_; }

  static StaticModInt raw(int value) {
    StaticModInt result;
    result.value_ = value;
    return result;
  }

  template <typename T>
  StaticModInt& set(T value) {
    value_ = normalize(static_cast<long long>(value));
    return *this;
  }

  StaticModInt operator+() const { return *this; }

  StaticModInt operator-() const {
    return (value_ == 0 ? StaticModInt(0) : StaticModInt::raw(MOD - value_));
  }

  StaticModInt& operator+=(const StaticModInt& rhs) {
    value_ += rhs.value_;
    if (value_ >= MOD) {
      value_ -= MOD;
    }
    return *this;
  }

  StaticModInt& operator-=(const StaticModInt& rhs) {
    value_ -= rhs.value_;
    if (value_ < 0) {
      value_ += MOD;
    }
    return *this;
  }

  StaticModInt& operator*=(const StaticModInt& rhs) {
    value_ = static_cast<int>(
        (static_cast<long long>(value_) * rhs.value_) % MOD);
    return *this;
  }

  StaticModInt& operator/=(const StaticModInt& rhs) {
    return (*this) *= rhs.inv();
  }

  StaticModInt pow(long long exponent) const {
    StaticModInt base = *this;
    long long exp = exponent;
    if (exp < 0) {
      base = base.inv();
      exp = -exp;
    }

    StaticModInt result(1);
    while (exp > 0) {
      if (exp & 1LL) {
        result *= base;
      }
      base *= base;
      exp >>= 1LL;
    }
    return result;
  }

  bool has_inverse() const {
    return positive_gcd(static_cast<long long>(value_), static_cast<long long>(MOD)) ==
           1;
  }

  bool try_inv(StaticModInt& out) const {
    long long x = 0;
    long long y = 0;
    const long long g = extended_gcd(static_cast<long long>(value_),
                                     static_cast<long long>(MOD), x, y);
    if (g != 1) {
      out = StaticModInt(0);
      return false;
    }
    x %= MOD;
    if (x < 0) {
      x += MOD;
    }
    out = StaticModInt::raw(static_cast<int>(x));
    return true;
  }

  StaticModInt inv() const {
    StaticModInt result(0);
    try_inv(result);
    return result;
  }

  friend StaticModInt operator+(StaticModInt lhs, const StaticModInt& rhs) {
    lhs += rhs;
    return lhs;
  }

  friend StaticModInt operator-(StaticModInt lhs, const StaticModInt& rhs) {
    lhs -= rhs;
    return lhs;
  }

  friend StaticModInt operator*(StaticModInt lhs, const StaticModInt& rhs) {
    lhs *= rhs;
    return lhs;
  }

  friend StaticModInt operator/(StaticModInt lhs, const StaticModInt& rhs) {
    lhs /= rhs;
    return lhs;
  }

  friend bool operator==(const StaticModInt& lhs, const StaticModInt& rhs) {
    return lhs.value_ == rhs.value_;
  }

  friend bool operator!=(const StaticModInt& lhs, const StaticModInt& rhs) {
    return lhs.value_ != rhs.value_;
  }

 private:
  int value_;

  static int normalize(long long value) {
    value %= MOD;
    if (value < 0) {
      value += MOD;
    }
    return static_cast<int>(value);
  }

  static long long positive_gcd(long long a, long long b) {
    if (a < 0) {
      a = -a;
    }
    if (b < 0) {
      b = -b;
    }
    while (b != 0) {
      const long long t = a % b;
      a = b;
      b = t;
    }
    return a;
  }

  static long long extended_gcd(long long a, long long b, long long& x,
                                long long& y) {
    if (a == 0) {
      x = 0;
      y = 1;
      return b;
    }
    long long x1 = 0;
    long long y1 = 0;
    const long long g = extended_gcd(b % a, a, x1, y1);
    x = y1 - (b / a) * x1;
    y = x1;
    return g;
  }
};

}  // namespace edulcni

#endif  // EDULCNI_MODINT_HPP

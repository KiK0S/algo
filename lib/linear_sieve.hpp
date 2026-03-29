#ifndef EDULCNI_LINEAR_SIEVE_HPP
#define EDULCNI_LINEAR_SIEVE_HPP

namespace edulcni {

class LinearSieve {
 public:
  explicit LinearSieve(int limit = 0) : limit_(0) { build(limit); }

  void build(int limit) {
    limit_ = (limit < 0 ? 0 : limit);
    lowest_prime_.assign(limit_ + 1, 0);
    primes_.clear();

    if (limit_ >= 1) {
      lowest_prime_[1] = 1;
    }

    for (int i = 2; i <= limit_; ++i) {
      if (lowest_prime_[i] == 0) {
        lowest_prime_[i] = i;
        primes_.push_back(i);
      }
      for (int p : primes_) {
        const long long next = static_cast<long long>(i) * p;
        if (next > limit_ || p > lowest_prime_[i]) {
          break;
        }
        lowest_prime_[static_cast<int>(next)] = p;
      }
    }
  }

  int limit() const { return limit_; }

  const std::vector<int>& lowest_prime() const { return lowest_prime_; }

  const std::vector<int>& primes() const { return primes_; }

  int lowest_prime_of(int value) const {
    if (value < 0 || value > limit_) {
      return 0;
    }
    return lowest_prime_[value];
  }

  bool is_prime(int value) const {
    return value >= 2 && value <= limit_ && lowest_prime_[value] == value;
  }

  std::vector<std::pair<int, int>> factorize(int value) const {
    std::vector<std::pair<int, int>> factors;
    if (value < 2 || value > limit_) {
      return factors;
    }

    int x = value;
    while (x > 1) {
      const int p = lowest_prime_[x];
      int exponent = 0;
      while (x % p == 0) {
        x /= p;
        ++exponent;
      }
      factors.push_back(std::make_pair(p, exponent));
    }
    return factors;
  }

 private:
  int limit_;
  std::vector<int> lowest_prime_;
  std::vector<int> primes_;
};

inline std::vector<int> linear_sieve_lowest_prime(int limit) {
  LinearSieve sieve(limit);
  return sieve.lowest_prime();
}

inline std::vector<int> linear_sieve_primes(int limit) {
  LinearSieve sieve(limit);
  return sieve.primes();
}

}  // namespace edulcni

#endif  // EDULCNI_LINEAR_SIEVE_HPP

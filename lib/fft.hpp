#ifndef EDULCNI_FFT_HPP
#define EDULCNI_FFT_HPP

#include "modint.hpp"

namespace edulcni {

inline bool fft_is_power_of_two(int n) { return n > 0 && (n & (n - 1)) == 0; }

inline int fft_next_power_of_two(int n) {
  if (n <= 1) {
    return 1;
  }
  int p = 1;
  while (p < n) {
    p <<= 1;
  }
  return p;
}

template <typename T>
inline void fft_bit_reverse_permute(std::vector<T>& a) {
  const int n = static_cast<int>(a.size());
  for (int i = 1, j = 0; i < n; ++i) {
    int bit = n >> 1;
    while (j & bit) {
      j ^= bit;
      bit >>= 1;
    }
    j ^= bit;
    if (i < j) {
      std::swap(a[i], a[j]);
    }
  }
}

inline bool fft_transform(std::vector<std::complex<long double>>& a,
                          bool invert = false) {
  const int n = static_cast<int>(a.size());
  if (n == 0) {
    return true;
  }
  if (!fft_is_power_of_two(n)) {
    return false;
  }

  fft_bit_reverse_permute(a);

  const long double pi = std::acos(static_cast<long double>(-1));
  for (int len = 2; len <= n; len <<= 1) {
    const long double ang = (invert ? -2.0L : 2.0L) * pi / len;
    const std::complex<long double> wlen(std::cos(ang), std::sin(ang));
    for (int i = 0; i < n; i += len) {
      std::complex<long double> w(1.0L, 0.0L);
      for (int j = 0; j < len / 2; ++j) {
        const std::complex<long double> u = a[i + j];
        const std::complex<long double> v = a[i + j + len / 2] * w;
        a[i + j] = u + v;
        a[i + j + len / 2] = u - v;
        w *= wlen;
      }
    }
  }

  if (invert) {
    const long double inv_n = 1.0L / static_cast<long double>(n);
    for (int i = 0; i < n; ++i) {
      a[i] *= inv_n;
    }
  }
  return true;
}

template <typename T>
inline std::vector<long double> convolution_fft(const std::vector<T>& a,
                                                const std::vector<T>& b) {
  if (a.empty() || b.empty()) {
    return {};
  }

  const int need = static_cast<int>(a.size() + b.size() - 1);
  const int n = fft_next_power_of_two(need);

  std::vector<std::complex<long double>> fa(n), fb(n);
  for (int i = 0; i < static_cast<int>(a.size()); ++i) {
    fa[i] = std::complex<long double>(static_cast<long double>(a[i]), 0.0L);
  }
  for (int i = 0; i < static_cast<int>(b.size()); ++i) {
    fb[i] = std::complex<long double>(static_cast<long double>(b[i]), 0.0L);
  }

  fft_transform(fa, false);
  fft_transform(fb, false);
  for (int i = 0; i < n; ++i) {
    fa[i] *= fb[i];
  }
  fft_transform(fa, true);

  std::vector<long double> result(need, 0.0L);
  for (int i = 0; i < need; ++i) {
    result[i] = fa[i].real();
  }
  return result;
}

template <typename T>
inline std::vector<long long> convolution_fft_round(const std::vector<T>& a,
                                                    const std::vector<T>& b) {
  const std::vector<long double> raw = convolution_fft(a, b);
  std::vector<long long> rounded(raw.size(), 0LL);
  for (int i = 0; i < static_cast<int>(raw.size()); ++i) {
    rounded[i] = static_cast<long long>(std::llround(raw[i]));
  }
  return rounded;
}

template <int MOD, int PRIMITIVE_ROOT = 3>
inline bool ntt_transform(std::vector<StaticModInt<MOD>>& a,
                          bool invert = false) {
  using Mint = StaticModInt<MOD>;

  const int n = static_cast<int>(a.size());
  if (n == 0) {
    return true;
  }
  if (!fft_is_power_of_two(n) || (MOD - 1) % n != 0) {
    return false;
  }

  fft_bit_reverse_permute(a);

  for (int len = 2; len <= n; len <<= 1) {
    Mint wlen = Mint(PRIMITIVE_ROOT).pow((MOD - 1) / len);
    if (invert) {
      wlen = wlen.inv();
    }

    for (int i = 0; i < n; i += len) {
      Mint w(1);
      for (int j = 0; j < len / 2; ++j) {
        const Mint u = a[i + j];
        const Mint v = a[i + j + len / 2] * w;
        a[i + j] = u + v;
        a[i + j + len / 2] = u - v;
        w *= wlen;
      }
    }
  }

  if (invert) {
    Mint inv_n(0);
    if (!Mint(n).try_inv(inv_n)) {
      return false;
    }
    for (int i = 0; i < n; ++i) {
      a[i] *= inv_n;
    }
  }
  return true;
}

template <int MOD, int PRIMITIVE_ROOT = 3>
inline std::vector<StaticModInt<MOD>> convolution_ntt(
    const std::vector<StaticModInt<MOD>>& a,
    const std::vector<StaticModInt<MOD>>& b) {
  using Mint = StaticModInt<MOD>;

  if (a.empty() || b.empty()) {
    return {};
  }

  const int need = static_cast<int>(a.size() + b.size() - 1);
  const int n = fft_next_power_of_two(need);

  std::vector<Mint> fa(n, Mint(0));
  std::vector<Mint> fb(n, Mint(0));

  for (int i = 0; i < static_cast<int>(a.size()); ++i) {
    fa[i] = a[i];
  }
  for (int i = 0; i < static_cast<int>(b.size()); ++i) {
    fb[i] = b[i];
  }

  if (!ntt_transform<MOD, PRIMITIVE_ROOT>(fa, false) ||
      !ntt_transform<MOD, PRIMITIVE_ROOT>(fb, false)) {
    return {};
  }

  for (int i = 0; i < n; ++i) {
    fa[i] *= fb[i];
  }

  if (!ntt_transform<MOD, PRIMITIVE_ROOT>(fa, true)) {
    return {};
  }

  fa.resize(need);
  return fa;
}

template <int MOD, int PRIMITIVE_ROOT = 3, typename T>
inline std::vector<StaticModInt<MOD>> convolution_ntt_values(
    const std::vector<T>& a, const std::vector<T>& b) {
  using Mint = StaticModInt<MOD>;
  std::vector<Mint> aa(a.size(), Mint(0));
  std::vector<Mint> bb(b.size(), Mint(0));

  for (int i = 0; i < static_cast<int>(a.size()); ++i) {
    aa[i] = Mint(a[i]);
  }
  for (int i = 0; i < static_cast<int>(b.size()); ++i) {
    bb[i] = Mint(b[i]);
  }
  return convolution_ntt<MOD, PRIMITIVE_ROOT>(aa, bb);
}

template <int MOD, int PRIMITIVE_ROOT = 3, typename T>
inline std::vector<int> convolution_ntt_int(const std::vector<T>& a,
                                            const std::vector<T>& b) {
  const std::vector<StaticModInt<MOD>> conv =
      convolution_ntt_values<MOD, PRIMITIVE_ROOT>(a, b);
  std::vector<int> result(conv.size(), 0);
  for (int i = 0; i < static_cast<int>(conv.size()); ++i) {
    result[i] = conv[i].value();
  }
  return result;
}

}  // namespace edulcni

#endif  // EDULCNI_FFT_HPP

// T must be a field-like type where division by a non-zero value is valid.
// Returns c where s[i] = c[0] * s[i - 1] + ... + c[m - 1] * s[i - m].
template <typename T>
inline std::vector<T> berlekamp_massey(const std::vector<T>& sequence) {
  const T zero = T(0);
  const T one = T(1);

  std::vector<T> current(1, one);
  std::vector<T> last(1, one);
  int order = 0;
  int shift = 1;
  T last_discrepancy = one;

  for (int i = 0; i < static_cast<int>(sequence.size()); ++i) {
    T discrepancy = sequence[i];
    for (int j = 1; j <= order; ++j) {
      discrepancy += current[j] * sequence[i - j];
    }

    if (discrepancy == zero) {
      ++shift;
      continue;
    }

    const std::vector<T> previous = current;
    const T factor = discrepancy / last_discrepancy;
    if (static_cast<int>(current.size()) < static_cast<int>(last.size()) + shift) {
      current.resize(static_cast<int>(last.size()) + shift, zero);
    }
    for (int j = 0; j < static_cast<int>(last.size()); ++j) {
      current[j + shift] -= factor * last[j];
    }

    if (2 * order <= i) {
      order = i + 1 - order;
      last = previous;
      last_discrepancy = discrepancy;
      shift = 1;
    } else {
      ++shift;
    }
  }

  current.erase(current.begin());
  for (T& coefficient : current) {
    coefficient = zero - coefficient;
  }
  while (!current.empty() && current.back() == zero) {
    current.pop_back();
  }
  return current;
}

template <typename T>
inline T linear_recurrence_kth(const std::vector<T>& initial,
                               const std::vector<T>& coefficients,
                               long long index) {
  if (index < 0) {
    return T(0);
  }
  if (index < static_cast<long long>(initial.size())) {
    return initial[static_cast<int>(index)];
  }

  const int order = static_cast<int>(coefficients.size());
  if (order == 0) {
    return T(0);
  }

  auto combine = [&](const std::vector<T>& lhs, const std::vector<T>& rhs) {
    std::vector<T> result(2 * order, T(0));
    for (int i = 0; i < order; ++i) {
      for (int j = 0; j < order; ++j) {
        result[i + j] += lhs[i] * rhs[j];
      }
    }
    for (int i = 2 * order - 1; i >= order; --i) {
      for (int j = 0; j < order; ++j) {
        result[i - 1 - j] += result[i] * coefficients[j];
      }
    }
    result.resize(order);
    return result;
  };

  std::vector<T> seed(order, T(0));
  for (int i = 0; i < order && i < static_cast<int>(initial.size()); ++i) {
    seed[i] = initial[i];
  }

  std::vector<T> result(order, T(0));
  result[0] = T(1);

  std::vector<T> x(order, T(0));
  if (order == 1) {
    x[0] = coefficients[0];
  } else {
    x[1] = T(1);
  }

  long long power = index;
  while (power > 0) {
    if (power & 1LL) {
      result = combine(result, x);
    }
    x = combine(x, x);
    power >>= 1LL;
  }

  T answer = T(0);
  for (int i = 0; i < order; ++i) {
    answer += result[i] * seed[i];
  }
  return answer;
}

template <typename T>
inline T berlekamp_massey_kth(const std::vector<T>& sequence, long long index) {
  if (index < 0) {
    return T(0);
  }
  if (index < static_cast<long long>(sequence.size())) {
    return sequence[static_cast<int>(index)];
  }

  const std::vector<T> coefficients = berlekamp_massey(sequence);
  const int order = static_cast<int>(coefficients.size());
  if (order == 0) {
    return T(0);
  }

  std::vector<T> initial(order, T(0));
  for (int i = 0; i < order; ++i) {
    initial[i] = sequence[i];
  }
  return linear_recurrence_kth(initial, coefficients, index);
}

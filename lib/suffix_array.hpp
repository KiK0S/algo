#ifndef EDULCNI_SUFFIX_ARRAY_HPP
#define EDULCNI_SUFFIX_ARRAY_HPP

namespace edulcni {

struct SuffixArrayResult {
  std::vector<int> sa;
  std::vector<int> lcp;
  std::vector<int> rank;
};

inline SuffixArrayResult suffix_array_build_from_positive_codes(
    const std::vector<int>& positive_codes, int alphabet_limit = 0) {
  const int text_n = static_cast<int>(positive_codes.size());
  const int n = text_n + 1;

  std::vector<int> sequence(n, 0);
  int lim = (alphabet_limit < 2 ? 2 : alphabet_limit);
  for (int i = 0; i < text_n; ++i) {
    const int code = (positive_codes[i] <= 0 ? 1 : positive_codes[i]);
    sequence[i] = code;
    if (code + 1 > lim) {
      lim = code + 1;
    }
  }

  SuffixArrayResult result;
  result.sa.assign(n, 0);
  result.lcp.assign(n, 0);
  result.rank.assign(n, 0);

  std::vector<int> x = sequence;
  std::vector<int> y(n, 0);
  std::vector<int> ws(std::max(n, lim), 0);
  std::iota(result.sa.begin(), result.sa.end(), 0);

  for (int j = 0, p = 0; p < n; j = std::max(1, j * 2), lim = p) {
    p = j;
    std::iota(y.begin(), y.end(), n - j);
    for (int i = 0; i < n; ++i) {
      if (result.sa[i] >= j) {
        y[p++] = result.sa[i] - j;
      }
    }

    std::fill(ws.begin(), ws.begin() + lim, 0);
    for (int i = 0; i < n; ++i) {
      ++ws[x[i]];
    }
    for (int i = 1; i < lim; ++i) {
      ws[i] += ws[i - 1];
    }
    for (int i = n - 1; i >= 0; --i) {
      result.sa[--ws[x[y[i]]]] = y[i];
    }

    std::swap(x, y);
    p = 1;
    x[result.sa[0]] = 0;
    for (int i = 1; i < n; ++i) {
      const int a = result.sa[i - 1];
      const int b = result.sa[i];
      const int a_second = (a + j < n ? y[a + j] : -1);
      const int b_second = (b + j < n ? y[b + j] : -1);
      x[b] = (y[a] == y[b] && a_second == b_second) ? p - 1 : p++;
    }
  }

  for (int i = 0; i < n; ++i) {
    result.rank[result.sa[i]] = i;
  }

  for (int i = 0, k = 0; i < n - 1; ++i) {
    const int r = result.rank[i];
    const int j = result.sa[r - 1];
    while (i + k < n && j + k < n && sequence[i + k] == sequence[j + k]) {
      ++k;
    }
    result.lcp[r] = k;
    if (k > 0) {
      --k;
    }
  }

  return result;
}

inline SuffixArrayResult suffix_array_build(const std::string& s) {
  std::vector<int> codes(s.size(), 0);
  for (int i = 0; i < static_cast<int>(s.size()); ++i) {
    codes[i] = static_cast<int>(static_cast<unsigned char>(s[i])) + 1;
  }
  return suffix_array_build_from_positive_codes(codes, 257);
}

inline SuffixArrayResult suffix_array_build_from_ints(
    const std::vector<int>& values) {
  std::vector<int> sorted_values = values;
  std::sort(sorted_values.begin(), sorted_values.end());
  sorted_values.erase(
      std::unique(sorted_values.begin(), sorted_values.end()),
      sorted_values.end());

  std::vector<int> codes(values.size(), 0);
  for (int i = 0; i < static_cast<int>(values.size()); ++i) {
    const int idx = static_cast<int>(std::lower_bound(sorted_values.begin(),
                                                      sorted_values.end(),
                                                      values[i]) -
                                     sorted_values.begin());
    codes[i] = idx + 1;
  }
  return suffix_array_build_from_positive_codes(
      codes, static_cast<int>(sorted_values.size()) + 1);
}

inline std::vector<int> suffix_array_remove_empty_suffix(
    const SuffixArrayResult& result) {
  if (result.sa.empty()) {
    return {};
  }
  const int empty_suffix_start = static_cast<int>(result.sa.size()) - 1;
  std::vector<int> stripped;
  stripped.reserve(result.sa.size() - 1);
  for (int start : result.sa) {
    if (start != empty_suffix_start) {
      stripped.push_back(start);
    }
  }
  return stripped;
}

}  // namespace edulcni

#endif  // EDULCNI_SUFFIX_ARRAY_HPP

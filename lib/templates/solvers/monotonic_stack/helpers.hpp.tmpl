template <typename T, typename Compare>
inline std::vector<int> nearest_left_by(const std::vector<T>& values,
                                        Compare compare, bool strict = true) {
  const int n = static_cast<int>(values.size());
  std::vector<int> result(n, -1);
  std::vector<int> st;
  st.reserve(n);

  for (int i = 0; i < n; ++i) {
    while (!st.empty()) {
      const int j = st.back();
      const bool keep = strict ? compare(values[j], values[i])
                               : !compare(values[i], values[j]);
      if (keep) {
        break;
      }
      st.pop_back();
    }
    if (!st.empty()) {
      result[i] = st.back();
    }
    st.push_back(i);
  }
  return result;
}

template <typename T, typename Compare>
inline std::vector<int> nearest_right_by(const std::vector<T>& values,
                                         Compare compare, bool strict = true) {
  const int n = static_cast<int>(values.size());
  std::vector<int> result(n, -1);
  std::vector<int> st;
  st.reserve(n);

  for (int i = n - 1; i >= 0; --i) {
    while (!st.empty()) {
      const int j = st.back();
      const bool keep = strict ? compare(values[j], values[i])
                               : !compare(values[i], values[j]);
      if (keep) {
        break;
      }
      st.pop_back();
    }
    if (!st.empty()) {
      result[i] = st.back();
    }
    st.push_back(i);
  }
  return result;
}

template <typename T>
inline std::vector<int> nearest_smaller_left(const std::vector<T>& values,
                                             bool strict = true) {
  return nearest_left_by(values, std::less<T>(), strict);
}

template <typename T>
inline std::vector<int> nearest_smaller_right(const std::vector<T>& values,
                                              bool strict = true) {
  return nearest_right_by(values, std::less<T>(), strict);
}

template <typename T>
inline std::vector<int> nearest_greater_left(const std::vector<T>& values,
                                             bool strict = true) {
  return nearest_left_by(values, std::greater<T>(), strict);
}

template <typename T>
inline std::vector<int> nearest_greater_right(const std::vector<T>& values,
                                              bool strict = true) {
  return nearest_right_by(values, std::greater<T>(), strict);
}

template <typename T>
struct NearestIndices {
  std::vector<int> left_smaller;
  std::vector<int> right_smaller;
  std::vector<int> left_greater;
  std::vector<int> right_greater;
};

template <typename T>
inline NearestIndices<T> nearest_all(const std::vector<T>& values,
                                     bool strict = true) {
  NearestIndices<T> result;
  result.left_smaller = nearest_smaller_left(values, strict);
  result.right_smaller = nearest_smaller_right(values, strict);
  result.left_greater = nearest_greater_left(values, strict);
  result.right_greater = nearest_greater_right(values, strict);
  return result;
}

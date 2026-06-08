template <typename Container>
inline std::optional<typename Container::iterator> next_iterator(
    Container& container, typename Container::iterator it) {
  if (it == container.end()) {
    return std::nullopt;
  }
  ++it;
  if (it == container.end()) {
    return std::nullopt;
  }
  return it;
}

template <typename Container>
inline std::optional<typename Container::const_iterator> next_iterator(
    const Container& container, typename Container::const_iterator it) {
  if (it == container.end()) {
    return std::nullopt;
  }
  ++it;
  if (it == container.end()) {
    return std::nullopt;
  }
  return it;
}

template <typename Container>
inline std::optional<typename Container::iterator> prev_iterator(
    Container& container, typename Container::iterator it) {
  if (container.empty() || it == container.begin()) {
    return std::nullopt;
  }
  if (it == container.end()) {
    auto last = container.end();
    --last;
    return last;
  }
  --it;
  return it;
}

template <typename Container>
inline std::optional<typename Container::const_iterator> prev_iterator(
    const Container& container, typename Container::const_iterator it) {
  if (container.empty() || it == container.begin()) {
    return std::nullopt;
  }
  if (it == container.end()) {
    auto last = container.end();
    --last;
    return last;
  }
  --it;
  return it;
}

template <typename Container, typename Key>
inline std::optional<typename Container::value_type> next_value(
    const Container& container, const Key& key) {
  const auto it = container.upper_bound(key);
  if (it == container.end()) {
    return std::nullopt;
  }
  return *it;
}

template <typename Container, typename Key>
inline std::optional<typename Container::value_type> prev_value(
    const Container& container, const Key& key) {
  auto it = container.lower_bound(key);
  if (it == container.begin()) {
    return std::nullopt;
  }
  --it;
  return *it;
}

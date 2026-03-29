#ifndef EDULCNI_SEGTREE_HPP
#define EDULCNI_SEGTREE_HPP

#include <algorithm>
#include <limits>
#include <vector>

namespace edulcni {

template <typename T>
struct SegmentAssignTag {
  bool has_value;
  T value;

  SegmentAssignTag(bool has_value_ = false, const T& value_ = T())
      : has_value(has_value_), value(value_) {}
};

template <typename Spec>
class LazySegTree {
 public:
  using Value = typename Spec::Value;
  using Update = typename Spec::Update;
  using DescendKey = typename Spec::DescendKey;

  explicit LazySegTree(int n = 0,
                       const Value& neutral = Spec::default_neutral(),
                       const Update& idle = Spec::default_update())
      : n_(n < 0 ? 0 : n), neutral_(neutral), idle_(idle) {
    init_storage();
  }

  explicit LazySegTree(const std::vector<Value>& values,
                       const Value& neutral = Spec::default_neutral(),
                       const Update& idle = Spec::default_update())
      : n_(0), neutral_(neutral), idle_(idle) {
    build(values);
  }

  void reset(int n,
             const Value& neutral = Spec::default_neutral(),
             const Update& idle = Spec::default_update()) {
    n_ = (n < 0 ? 0 : n);
    neutral_ = neutral;
    idle_ = idle;
    init_storage();
  }

  void build(const std::vector<Value>& values) {
    n_ = static_cast<int>(values.size());
    init_storage();
    if (n_ == 0) {
      return;
    }
    build_rec(1, 0, n_ - 1, values);
  }

  int size() const { return n_; }

  void update(int left, int right, const Update& upd) {
    if (!normalize_range(left, right)) {
      return;
    }
    update_rec(1, 0, n_ - 1, left, right, upd);
  }

  Value get(int left, int right) {
    if (!normalize_range(left, right)) {
      return neutral_;
    }
    return get_rec(1, 0, n_ - 1, left, right);
  }

  Value query(int left, int right) { return get(left, right); }

  int find_first(int left, int right, const DescendKey& key) {
    static_assert(Spec::kHasDescend,
                  "find_first is not defined for this specification");
    if (!normalize_range(left, right)) {
      return -1;
    }
    return find_first_rec(1, 0, n_ - 1, left, right, key);
  }

  int find_last(int left, int right, const DescendKey& key) {
    static_assert(Spec::kHasDescend,
                  "find_last is not defined for this specification");
    if (!normalize_range(left, right)) {
      return -1;
    }
    return find_last_rec(1, 0, n_ - 1, left, right, key);
  }

 private:
  int n_;
  std::vector<Value> tree_;
  std::vector<Update> lazy_;
  Value neutral_;
  Update idle_;

  void init_storage() {
    const int nodes = 4 * std::max(1, n_);
    tree_.assign(nodes, neutral_);
    lazy_.assign(nodes, idle_);
  }

  bool normalize_range(int& left, int& right) const {
    if (n_ == 0 || left > right || right < 0 || left >= n_) {
      return false;
    }
    if (left < 0) {
      left = 0;
    }
    if (right >= n_) {
      right = n_ - 1;
    }
    return left <= right;
  }

  void build_rec(int v, int tl, int tr, const std::vector<Value>& values) {
    if (tl == tr) {
      tree_[v] = values[tl];
      return;
    }
    const int tm = (tl + tr) / 2;
    build_rec(v * 2, tl, tm, values);
    build_rec(v * 2 + 1, tm + 1, tr, values);
    pull(v);
  }

  void pull(int v) { tree_[v] = Spec::combine(tree_[v * 2], tree_[v * 2 + 1]); }

  void apply_node(int v, int tl, int tr, const Update& upd) {
    Spec::apply(tree_[v], upd, tl, tr);
    Spec::compose(lazy_[v], upd);
    if (Spec::is_idle(lazy_[v])) {
      lazy_[v] = idle_;
    }
  }

  void push(int v, int tl, int tr) {
    if (tl == tr || Spec::is_idle(lazy_[v])) {
      return;
    }
    const int tm = (tl + tr) / 2;
    apply_node(v * 2, tl, tm, lazy_[v]);
    apply_node(v * 2 + 1, tm + 1, tr, lazy_[v]);
    lazy_[v] = idle_;
  }

  void update_rec(int v, int tl, int tr, int l, int r, const Update& upd) {
    if (tl > r || l > tr) {
      return;
    }
    if (l <= tl && tr <= r) {
      apply_node(v, tl, tr, upd);
      return;
    }
    push(v, tl, tr);
    const int tm = (tl + tr) / 2;
    update_rec(v * 2, tl, tm, l, r, upd);
    update_rec(v * 2 + 1, tm + 1, tr, l, r, upd);
    pull(v);
  }

  Value get_rec(int v, int tl, int tr, int l, int r) {
    if (tl > r || l > tr) {
      return neutral_;
    }
    if (l <= tl && tr <= r) {
      return tree_[v];
    }
    push(v, tl, tr);
    const int tm = (tl + tr) / 2;
    return Spec::combine(get_rec(v * 2, tl, tm, l, r),
                         get_rec(v * 2 + 1, tm + 1, tr, l, r));
  }

  int find_first_rec(int v, int tl, int tr, int l, int r,
                     const DescendKey& key) {
    if (tl > r || l > tr || !Spec::descend_can_hit(tree_[v], key)) {
      return -1;
    }
    if (tl == tr) {
      return tl;
    }
    push(v, tl, tr);
    const int tm = (tl + tr) / 2;
    const int left_res = find_first_rec(v * 2, tl, tm, l, r, key);
    if (left_res != -1) {
      return left_res;
    }
    return find_first_rec(v * 2 + 1, tm + 1, tr, l, r, key);
  }

  int find_last_rec(int v, int tl, int tr, int l, int r,
                    const DescendKey& key) {
    if (tl > r || l > tr || !Spec::descend_can_hit(tree_[v], key)) {
      return -1;
    }
    if (tl == tr) {
      return tl;
    }
    push(v, tl, tr);
    const int tm = (tl + tr) / 2;
    const int right_res = find_last_rec(v * 2 + 1, tm + 1, tr, l, r, key);
    if (right_res != -1) {
      return right_res;
    }
    return find_last_rec(v * 2, tl, tm, l, r, key);
  }
};

template <typename T>
struct SegMinAssignSpec {
  using Value = T;
  using Update = SegmentAssignTag<T>;
  using DescendKey = T;
  static constexpr bool kHasDescend = true;

  static Value default_neutral() { return std::numeric_limits<T>::max(); }
  static Update default_update() { return Update(); }
  static bool is_idle(const Update& upd) { return !upd.has_value; }
  static Value combine(const Value& lhs, const Value& rhs) {
    return (lhs < rhs ? lhs : rhs);
  }
  static void apply(Value& node, const Update& upd, int, int) {
    if (upd.has_value) {
      node = upd.value;
    }
  }
  static void compose(Update& current, const Update& add) {
    if (add.has_value) {
      current = add;
    }
  }
  static bool descend_can_hit(const Value& node, const DescendKey& target) {
    return node <= target;
  }
  static Update make_assign(const T& value) { return Update(true, value); }
};

template <typename T>
struct SegMaxAssignSpec {
  using Value = T;
  using Update = SegmentAssignTag<T>;
  using DescendKey = T;
  static constexpr bool kHasDescend = true;

  static Value default_neutral() { return std::numeric_limits<T>::lowest(); }
  static Update default_update() { return Update(); }
  static bool is_idle(const Update& upd) { return !upd.has_value; }
  static Value combine(const Value& lhs, const Value& rhs) {
    return (lhs < rhs ? rhs : lhs);
  }
  static void apply(Value& node, const Update& upd, int, int) {
    if (upd.has_value) {
      node = upd.value;
    }
  }
  static void compose(Update& current, const Update& add) {
    if (add.has_value) {
      current = add;
    }
  }
  static bool descend_can_hit(const Value& node, const DescendKey& target) {
    return node >= target;
  }
  static Update make_assign(const T& value) { return Update(true, value); }
};

template <typename T>
struct SegMinAddSpec {
  using Value = T;
  using Update = T;
  using DescendKey = T;
  static constexpr bool kHasDescend = true;

  static Value default_neutral() { return std::numeric_limits<T>::max(); }
  static Update default_update() { return T(0); }
  static bool is_idle(const Update& upd) { return upd == T(0); }
  static Value combine(const Value& lhs, const Value& rhs) {
    return (lhs < rhs ? lhs : rhs);
  }
  static void apply(Value& node, const Update& upd, int, int) { node += upd; }
  static void compose(Update& current, const Update& add) { current += add; }
  static bool descend_can_hit(const Value& node, const DescendKey& target) {
    return node <= target;
  }
  static Update make_add(const T& delta) { return delta; }
};

template <typename T>
struct SegMaxAddSpec {
  using Value = T;
  using Update = T;
  using DescendKey = T;
  static constexpr bool kHasDescend = true;

  static Value default_neutral() { return std::numeric_limits<T>::lowest(); }
  static Update default_update() { return T(0); }
  static bool is_idle(const Update& upd) { return upd == T(0); }
  static Value combine(const Value& lhs, const Value& rhs) {
    return (lhs < rhs ? rhs : lhs);
  }
  static void apply(Value& node, const Update& upd, int, int) { node += upd; }
  static void compose(Update& current, const Update& add) { current += add; }
  static bool descend_can_hit(const Value& node, const DescendKey& target) {
    return node >= target;
  }
  static Update make_add(const T& delta) { return delta; }
};

template <typename T>
class SegmentMinAssignTree : public LazySegTree<SegMinAssignSpec<T>> {
 public:
  using Spec = SegMinAssignSpec<T>;
  using Base = LazySegTree<Spec>;
  using Base::Base;

  void assign(int left, int right, const T& value) {
    this->update(left, right, Spec::make_assign(value));
  }
  int first_leq(int left, int right, const T& target) {
    return this->find_first(left, right, target);
  }
  int last_leq(int left, int right, const T& target) {
    return this->find_last(left, right, target);
  }
};

template <typename T>
class SegmentMaxAssignTree : public LazySegTree<SegMaxAssignSpec<T>> {
 public:
  using Spec = SegMaxAssignSpec<T>;
  using Base = LazySegTree<Spec>;
  using Base::Base;

  void assign(int left, int right, const T& value) {
    this->update(left, right, Spec::make_assign(value));
  }
  int first_geq(int left, int right, const T& target) {
    return this->find_first(left, right, target);
  }
  int last_geq(int left, int right, const T& target) {
    return this->find_last(left, right, target);
  }
};

template <typename T>
class SegmentMinAddTree : public LazySegTree<SegMinAddSpec<T>> {
 public:
  using Spec = SegMinAddSpec<T>;
  using Base = LazySegTree<Spec>;
  using Base::Base;

  void add(int left, int right, const T& delta) {
    this->update(left, right, Spec::make_add(delta));
  }
  int first_leq(int left, int right, const T& target) {
    return this->find_first(left, right, target);
  }
  int last_leq(int left, int right, const T& target) {
    return this->find_last(left, right, target);
  }
};

template <typename T>
class SegmentMaxAddTree : public LazySegTree<SegMaxAddSpec<T>> {
 public:
  using Spec = SegMaxAddSpec<T>;
  using Base = LazySegTree<Spec>;
  using Base::Base;

  void add(int left, int right, const T& delta) {
    this->update(left, right, Spec::make_add(delta));
  }
  int first_geq(int left, int right, const T& target) {
    return this->find_first(left, right, target);
  }
  int last_geq(int left, int right, const T& target) {
    return this->find_last(left, right, target);
  }
};

template <typename T>
class MergeSortTree {
 public:
  explicit MergeSortTree(int n = 0) : n_(n < 0 ? 0 : n) { init_storage(); }

  explicit MergeSortTree(const std::vector<T>& values) : n_(0) { build(values); }

  void reset(int n) {
    n_ = (n < 0 ? 0 : n);
    init_storage();
  }

  void build(const std::vector<T>& values) {
    n_ = static_cast<int>(values.size());
    init_storage();
    if (n_ == 0) {
      return;
    }
    build_rec(1, 0, n_ - 1, values);
  }

  int size() const { return n_; }

  int count_less(int left, int right, const T& x) const {
    if (!normalize_range(left, right)) {
      return 0;
    }
    return count_less_rec(1, 0, n_ - 1, left, right, x);
  }

  int count_less_equal(int left, int right, const T& x) const {
    if (!normalize_range(left, right)) {
      return 0;
    }
    return count_less_equal_rec(1, 0, n_ - 1, left, right, x);
  }

  int count_greater(int left, int right, const T& x) const {
    if (!normalize_range(left, right)) {
      return 0;
    }
    return (right - left + 1) - count_less_equal(left, right, x);
  }

  int count_greater_equal(int left, int right, const T& x) const {
    if (!normalize_range(left, right)) {
      return 0;
    }
    return (right - left + 1) - count_less(left, right, x);
  }

  int count_in_range(int left, int right, const T& low, const T& high) const {
    if (high < low || !normalize_range(left, right)) {
      return 0;
    }
    return count_less_equal(left, right, high) - count_less(left, right, low);
  }

  bool exists(int left, int right, const T& x) const {
    return count_in_range(left, right, x, x) > 0;
  }

 private:
  int n_;
  std::vector<std::vector<T>> tree_;

  void init_storage() { tree_.assign(4 * std::max(1, n_), std::vector<T>()); }

  bool normalize_range(int& left, int& right) const {
    if (n_ == 0 || left > right || right < 0 || left >= n_) {
      return false;
    }
    if (left < 0) {
      left = 0;
    }
    if (right >= n_) {
      right = n_ - 1;
    }
    return left <= right;
  }

  void build_rec(int v, int tl, int tr, const std::vector<T>& values) {
    if (tl == tr) {
      tree_[v] = {values[tl]};
      return;
    }
    const int tm = (tl + tr) / 2;
    build_rec(v * 2, tl, tm, values);
    build_rec(v * 2 + 1, tm + 1, tr, values);
    tree_[v].resize(tree_[v * 2].size() + tree_[v * 2 + 1].size());
    std::merge(tree_[v * 2].begin(), tree_[v * 2].end(), tree_[v * 2 + 1].begin(),
               tree_[v * 2 + 1].end(), tree_[v].begin());
  }

  int count_less_rec(int v, int tl, int tr, int l, int r, const T& x) const {
    if (tl > r || l > tr) {
      return 0;
    }
    if (l <= tl && tr <= r) {
      return static_cast<int>(std::lower_bound(tree_[v].begin(), tree_[v].end(), x) -
                              tree_[v].begin());
    }
    const int tm = (tl + tr) / 2;
    return count_less_rec(v * 2, tl, tm, l, r, x) +
           count_less_rec(v * 2 + 1, tm + 1, tr, l, r, x);
  }

  int count_less_equal_rec(int v, int tl, int tr, int l, int r,
                           const T& x) const {
    if (tl > r || l > tr) {
      return 0;
    }
    if (l <= tl && tr <= r) {
      return static_cast<int>(std::upper_bound(tree_[v].begin(), tree_[v].end(), x) -
                              tree_[v].begin());
    }
    const int tm = (tl + tr) / 2;
    return count_less_equal_rec(v * 2, tl, tm, l, r, x) +
           count_less_equal_rec(v * 2 + 1, tm + 1, tr, l, r, x);
  }
};

template <typename T>
struct MaxSubarrayNode {
  T sum;
  T prefix;
  T suffix;
  T best;
  bool valid;
};

template <typename T>
class MaxSubarraySegTree {
 public:
  using Node = MaxSubarrayNode<T>;

  explicit MaxSubarraySegTree(int n = 0) : n_(n < 0 ? 0 : n) { init_storage(); }

  explicit MaxSubarraySegTree(const std::vector<T>& values) : n_(0) { build(values); }

  void reset(int n) {
    n_ = (n < 0 ? 0 : n);
    init_storage();
  }

  void build(const std::vector<T>& values) {
    n_ = static_cast<int>(values.size());
    init_storage();
    if (n_ == 0) {
      return;
    }
    build_rec(1, 0, n_ - 1, values);
  }

  int size() const { return n_; }

  void point_set(int idx, const T& value) {
    if (idx < 0 || idx >= n_) {
      return;
    }
    point_set_rec(1, 0, n_ - 1, idx, value);
  }

  Node get(int left, int right) const {
    if (!normalize_range(left, right)) {
      return neutral_node();
    }
    return get_rec(1, 0, n_ - 1, left, right);
  }

  T max_sum(int left, int right) const { return get(left, right).best; }

 private:
  int n_;
  std::vector<Node> tree_;

  static Node neutral_node() { return Node{T(0), T(0), T(0), T(0), false}; }

  static Node make_leaf(const T& value) {
    return Node{value, value, value, value, true};
  }

  static Node combine(const Node& lhs, const Node& rhs) {
    if (!lhs.valid) {
      return rhs;
    }
    if (!rhs.valid) {
      return lhs;
    }
    Node result;
    result.valid = true;
    result.sum = lhs.sum + rhs.sum;
    result.prefix = std::max(lhs.prefix, lhs.sum + rhs.prefix);
    result.suffix = std::max(rhs.suffix, rhs.sum + lhs.suffix);
    result.best = std::max(std::max(lhs.best, rhs.best), lhs.suffix + rhs.prefix);
    return result;
  }

  void init_storage() { tree_.assign(4 * std::max(1, n_), neutral_node()); }

  bool normalize_range(int& left, int& right) const {
    if (n_ == 0 || left > right || right < 0 || left >= n_) {
      return false;
    }
    if (left < 0) {
      left = 0;
    }
    if (right >= n_) {
      right = n_ - 1;
    }
    return left <= right;
  }

  void build_rec(int v, int tl, int tr, const std::vector<T>& values) {
    if (tl == tr) {
      tree_[v] = make_leaf(values[tl]);
      return;
    }
    const int tm = (tl + tr) / 2;
    build_rec(v * 2, tl, tm, values);
    build_rec(v * 2 + 1, tm + 1, tr, values);
    tree_[v] = combine(tree_[v * 2], tree_[v * 2 + 1]);
  }

  void point_set_rec(int v, int tl, int tr, int idx, const T& value) {
    if (tl == tr) {
      tree_[v] = make_leaf(value);
      return;
    }
    const int tm = (tl + tr) / 2;
    if (idx <= tm) {
      point_set_rec(v * 2, tl, tm, idx, value);
    } else {
      point_set_rec(v * 2 + 1, tm + 1, tr, idx, value);
    }
    tree_[v] = combine(tree_[v * 2], tree_[v * 2 + 1]);
  }

  Node get_rec(int v, int tl, int tr, int l, int r) const {
    if (tl > r || l > tr) {
      return neutral_node();
    }
    if (l <= tl && tr <= r) {
      return tree_[v];
    }
    const int tm = (tl + tr) / 2;
    return combine(get_rec(v * 2, tl, tm, l, r),
                   get_rec(v * 2 + 1, tm + 1, tr, l, r));
  }
};

template <typename T>
class SegmentTreeBeats {
 public:
  explicit SegmentTreeBeats(int n = 0) : n_(n < 0 ? 0 : n) { init_storage(); }

  explicit SegmentTreeBeats(const std::vector<T>& values) : n_(0) { build(values); }

  void reset(int n) {
    n_ = (n < 0 ? 0 : n);
    init_storage();
  }

  void build(const std::vector<T>& values) {
    n_ = static_cast<int>(values.size());
    init_storage();
    if (n_ == 0) {
      return;
    }
    build_rec(1, 0, n_ - 1, values);
  }

  int size() const { return n_; }

  void chmin(int left, int right, const T& x) {
    if (!normalize_range(left, right)) {
      return;
    }
    range_chmin_rec(1, 0, n_ - 1, left, right, x);
  }

  void chmax(int left, int right, const T& x) {
    if (!normalize_range(left, right)) {
      return;
    }
    range_chmax_rec(1, 0, n_ - 1, left, right, x);
  }

  void add(int left, int right, const T& delta) {
    if (!normalize_range(left, right)) {
      return;
    }
    range_add_rec(1, 0, n_ - 1, left, right, delta);
  }

  T query_sum(int left, int right) {
    if (!normalize_range(left, right)) {
      return T(0);
    }
    return query_sum_rec(1, 0, n_ - 1, left, right);
  }

  T query_min(int left, int right) {
    if (!normalize_range(left, right)) {
      return pos_inf();
    }
    return query_min_rec(1, 0, n_ - 1, left, right);
  }

  T query_max(int left, int right) {
    if (!normalize_range(left, right)) {
      return neg_inf();
    }
    return query_max_rec(1, 0, n_ - 1, left, right);
  }

 private:
  struct Node {
    T sum;
    T max_v;
    T smax_v;
    int max_count;
    T min_v;
    T smin_v;
    int min_count;
    T add;
  };

  int n_;
  std::vector<Node> tree_;

  static T pos_inf() { return std::numeric_limits<T>::max() / T(4); }
  static T neg_inf() { return std::numeric_limits<T>::lowest() / T(4); }

  static Node empty_node() {
    return Node{T(0), neg_inf(), neg_inf(), 0, pos_inf(), pos_inf(), 0, T(0)};
  }

  static Node make_leaf(const T& value) {
    return Node{value, value, neg_inf(), 1, value, pos_inf(), 1, T(0)};
  }

  static bool is_empty(const Node& node) { return node.max_count == 0; }

  static Node merge_nodes(const Node& lhs, const Node& rhs) {
    if (is_empty(lhs)) {
      return rhs;
    }
    if (is_empty(rhs)) {
      return lhs;
    }

    Node result;
    result.sum = lhs.sum + rhs.sum;
    result.add = T(0);

    if (lhs.max_v == rhs.max_v) {
      result.max_v = lhs.max_v;
      result.max_count = lhs.max_count + rhs.max_count;
      result.smax_v = std::max(lhs.smax_v, rhs.smax_v);
    } else if (lhs.max_v > rhs.max_v) {
      result.max_v = lhs.max_v;
      result.max_count = lhs.max_count;
      result.smax_v = std::max(lhs.smax_v, rhs.max_v);
    } else {
      result.max_v = rhs.max_v;
      result.max_count = rhs.max_count;
      result.smax_v = std::max(lhs.max_v, rhs.smax_v);
    }

    if (lhs.min_v == rhs.min_v) {
      result.min_v = lhs.min_v;
      result.min_count = lhs.min_count + rhs.min_count;
      result.smin_v = std::min(lhs.smin_v, rhs.smin_v);
    } else if (lhs.min_v < rhs.min_v) {
      result.min_v = lhs.min_v;
      result.min_count = lhs.min_count;
      result.smin_v = std::min(lhs.smin_v, rhs.min_v);
    } else {
      result.min_v = rhs.min_v;
      result.min_count = rhs.min_count;
      result.smin_v = std::min(lhs.min_v, rhs.smin_v);
    }

    return result;
  }

  void init_storage() { tree_.assign(4 * std::max(1, n_), empty_node()); }

  bool normalize_range(int& left, int& right) const {
    if (n_ == 0 || left > right || right < 0 || left >= n_) {
      return false;
    }
    if (left < 0) {
      left = 0;
    }
    if (right >= n_) {
      right = n_ - 1;
    }
    return left <= right;
  }

  void build_rec(int v, int tl, int tr, const std::vector<T>& values) {
    if (tl == tr) {
      tree_[v] = make_leaf(values[tl]);
      return;
    }
    const int tm = (tl + tr) / 2;
    build_rec(v * 2, tl, tm, values);
    build_rec(v * 2 + 1, tm + 1, tr, values);
    pull(v);
  }

  void pull(int v) { tree_[v] = merge_nodes(tree_[v * 2], tree_[v * 2 + 1]); }

  void apply_add(int v, int tl, int tr, const T& delta) {
    Node& node = tree_[v];
    node.sum += delta * static_cast<T>(tr - tl + 1);
    node.max_v += delta;
    if (node.smax_v != neg_inf()) {
      node.smax_v += delta;
    }
    node.min_v += delta;
    if (node.smin_v != pos_inf()) {
      node.smin_v += delta;
    }
    node.add += delta;
  }

  void apply_chmin(int v, const T& x) {
    Node& node = tree_[v];
    if (node.max_v <= x) {
      return;
    }
    node.sum += (x - node.max_v) * static_cast<T>(node.max_count);
    if (node.max_v == node.min_v) {
      node.max_v = x;
      node.min_v = x;
    } else if (node.max_v == node.smin_v) {
      node.max_v = x;
      node.smin_v = x;
    } else {
      node.max_v = x;
    }
  }

  void apply_chmax(int v, const T& x) {
    Node& node = tree_[v];
    if (node.min_v >= x) {
      return;
    }
    node.sum += (x - node.min_v) * static_cast<T>(node.min_count);
    if (node.max_v == node.min_v) {
      node.max_v = x;
      node.min_v = x;
    } else if (node.smax_v == node.min_v) {
      node.min_v = x;
      node.smax_v = x;
    } else {
      node.min_v = x;
    }
  }

  void push(int v, int tl, int tr) {
    if (tl == tr) {
      return;
    }
    const int tm = (tl + tr) / 2;

    if (tree_[v].add != T(0)) {
      apply_add(v * 2, tl, tm, tree_[v].add);
      apply_add(v * 2 + 1, tm + 1, tr, tree_[v].add);
      tree_[v].add = T(0);
    }

    if (tree_[v * 2].max_v > tree_[v].max_v) {
      apply_chmin(v * 2, tree_[v].max_v);
    }
    if (tree_[v * 2 + 1].max_v > tree_[v].max_v) {
      apply_chmin(v * 2 + 1, tree_[v].max_v);
    }

    if (tree_[v * 2].min_v < tree_[v].min_v) {
      apply_chmax(v * 2, tree_[v].min_v);
    }
    if (tree_[v * 2 + 1].min_v < tree_[v].min_v) {
      apply_chmax(v * 2 + 1, tree_[v].min_v);
    }
  }

  void range_add_rec(int v, int tl, int tr, int l, int r, const T& delta) {
    if (tl > r || l > tr) {
      return;
    }
    if (l <= tl && tr <= r) {
      apply_add(v, tl, tr, delta);
      return;
    }
    push(v, tl, tr);
    const int tm = (tl + tr) / 2;
    range_add_rec(v * 2, tl, tm, l, r, delta);
    range_add_rec(v * 2 + 1, tm + 1, tr, l, r, delta);
    pull(v);
  }

  void range_chmin_rec(int v, int tl, int tr, int l, int r, const T& x) {
    if (tl > r || l > tr || tree_[v].max_v <= x) {
      return;
    }
    if (l <= tl && tr <= r && tree_[v].smax_v < x) {
      apply_chmin(v, x);
      return;
    }
    push(v, tl, tr);
    const int tm = (tl + tr) / 2;
    range_chmin_rec(v * 2, tl, tm, l, r, x);
    range_chmin_rec(v * 2 + 1, tm + 1, tr, l, r, x);
    pull(v);
  }

  void range_chmax_rec(int v, int tl, int tr, int l, int r, const T& x) {
    if (tl > r || l > tr || tree_[v].min_v >= x) {
      return;
    }
    if (l <= tl && tr <= r && tree_[v].smin_v > x) {
      apply_chmax(v, x);
      return;
    }
    push(v, tl, tr);
    const int tm = (tl + tr) / 2;
    range_chmax_rec(v * 2, tl, tm, l, r, x);
    range_chmax_rec(v * 2 + 1, tm + 1, tr, l, r, x);
    pull(v);
  }

  T query_sum_rec(int v, int tl, int tr, int l, int r) {
    if (tl > r || l > tr) {
      return T(0);
    }
    if (l <= tl && tr <= r) {
      return tree_[v].sum;
    }
    push(v, tl, tr);
    const int tm = (tl + tr) / 2;
    return query_sum_rec(v * 2, tl, tm, l, r) +
           query_sum_rec(v * 2 + 1, tm + 1, tr, l, r);
  }

  T query_min_rec(int v, int tl, int tr, int l, int r) {
    if (tl > r || l > tr) {
      return pos_inf();
    }
    if (l <= tl && tr <= r) {
      return tree_[v].min_v;
    }
    push(v, tl, tr);
    const int tm = (tl + tr) / 2;
    return std::min(query_min_rec(v * 2, tl, tm, l, r),
                    query_min_rec(v * 2 + 1, tm + 1, tr, l, r));
  }

  T query_max_rec(int v, int tl, int tr, int l, int r) {
    if (tl > r || l > tr) {
      return neg_inf();
    }
    if (l <= tl && tr <= r) {
      return tree_[v].max_v;
    }
    push(v, tl, tr);
    const int tm = (tl + tr) / 2;
    return std::max(query_max_rec(v * 2, tl, tm, l, r),
                    query_max_rec(v * 2 + 1, tm + 1, tr, l, r));
  }
};

}  // namespace edulcni

#endif  // EDULCNI_SEGTREE_HPP

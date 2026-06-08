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

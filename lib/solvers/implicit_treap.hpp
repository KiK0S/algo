template <typename T>
struct TreapSumOp {
  static T neutral() { return T(0); }
  static T combine(const T& lhs, const T& rhs) { return lhs + rhs; }
};

template <typename T, typename Op = TreapSumOp<T>>
class ImplicitTreap {
 private:
  struct Node {
    T value;
    T aggregate;
    unsigned priority;
    int size;
    Node* left;
    Node* right;

    Node(const T& value_, unsigned priority_)
        : value(value_),
          aggregate(value_),
          priority(priority_),
          size(1),
          left(nullptr),
          right(nullptr) {}
  };

 public:
  explicit ImplicitTreap(unsigned seed = 712367821u)
      : root_(nullptr), rng_state_(seed == 0u ? 1u : seed) {}

  ~ImplicitTreap() { clear(); }

  ImplicitTreap(const ImplicitTreap&) = delete;
  ImplicitTreap& operator=(const ImplicitTreap&) = delete;

  ImplicitTreap(ImplicitTreap&& other) noexcept
      : root_(other.root_), rng_state_(other.rng_state_) {
    other.root_ = nullptr;
  }

  ImplicitTreap& operator=(ImplicitTreap&& other) noexcept {
    if (this == &other) {
      return *this;
    }
    clear();
    root_ = other.root_;
    rng_state_ = other.rng_state_;
    other.root_ = nullptr;
    return *this;
  }

  void clear() {
    clear_node(root_);
    root_ = nullptr;
  }

  int size() const { return node_size(root_); }

  bool empty() const { return root_ == nullptr; }

  void push_back(const T& value) { insert(size(), value); }

  void insert(int position, const T& value) {
    if (position < 0) {
      position = 0;
    }
    if (position > size()) {
      position = size();
    }

    Node* node = new Node(value, next_priority());
    std::pair<Node*, Node*> parts = split(root_, position);
    root_ = merge(merge(parts.first, node), parts.second);
  }

  bool erase(int position, T* erased_value = nullptr) {
    if (position < 0 || position >= size()) {
      return false;
    }

    std::pair<Node*, Node*> left_mid = split(root_, position);
    std::pair<Node*, Node*> mid_right = split(left_mid.second, 1);

    if (mid_right.first == nullptr) {
      root_ = merge(left_mid.first, mid_right.second);
      return false;
    }

    if (erased_value != nullptr) {
      *erased_value = mid_right.first->value;
    }
    clear_node(mid_right.first);
    root_ = merge(left_mid.first, mid_right.second);
    return true;
  }

  bool get(int position, T& out) const {
    if (position < 0 || position >= size()) {
      return false;
    }

    Node* node = root_;
    int index = position;
    while (node != nullptr) {
      const int left_size = node_size(node->left);
      if (index < left_size) {
        node = node->left;
      } else if (index == left_size) {
        out = node->value;
        return true;
      } else {
        index -= left_size + 1;
        node = node->right;
      }
    }
    return false;
  }

  bool set(int position, const T& value) {
    if (position < 0 || position >= size()) {
      return false;
    }

    std::pair<Node*, Node*> left_mid = split(root_, position);
    std::pair<Node*, Node*> mid_right = split(left_mid.second, 1);
    if (mid_right.first == nullptr) {
      root_ = merge(left_mid.first, mid_right.second);
      return false;
    }

    mid_right.first->value = value;
    pull(mid_right.first);
    root_ = merge(left_mid.first, merge(mid_right.first, mid_right.second));
    return true;
  }

  T range_query(int left, int right) {
    if (!normalize_range(left, right)) {
      return Op::neutral();
    }

    std::pair<Node*, Node*> left_mid = split(root_, left);
    std::pair<Node*, Node*> mid_right = split(left_mid.second, right - left + 1);
    const T answer = node_aggregate(mid_right.first);
    root_ = merge(left_mid.first, merge(mid_right.first, mid_right.second));
    return answer;
  }

  std::vector<T> to_vector() const {
    std::vector<T> values;
    values.reserve(size());
    collect_inorder(root_, values);
    return values;
  }

  template <typename It>
  void assign(It begin, It end) {
    clear();
    for (It it = begin; it != end; ++it) {
      push_back(*it);
    }
  }

 private:
  Node* root_;
  unsigned rng_state_;

  static int node_size(Node* node) { return node == nullptr ? 0 : node->size; }

  static T node_aggregate(Node* node) {
    return node == nullptr ? Op::neutral() : node->aggregate;
  }

  static void pull(Node* node) {
    if (node == nullptr) {
      return;
    }
    node->size = 1 + node_size(node->left) + node_size(node->right);
    node->aggregate = Op::combine(
        Op::combine(node_aggregate(node->left), node->value),
        node_aggregate(node->right));
  }

  static void clear_node(Node* node) {
    if (node == nullptr) {
      return;
    }
    clear_node(node->left);
    clear_node(node->right);
    delete node;
  }

  unsigned next_priority() {
    rng_state_ ^= rng_state_ << 7;
    rng_state_ ^= rng_state_ >> 9;
    rng_state_ ^= rng_state_ << 8;
    return rng_state_;
  }

  static std::pair<Node*, Node*> split(Node* node, int left_size) {
    if (node == nullptr) {
      return std::make_pair(nullptr, nullptr);
    }

    if (node_size(node->left) >= left_size) {
      std::pair<Node*, Node*> parts = split(node->left, left_size);
      node->left = parts.second;
      pull(node);
      return std::make_pair(parts.first, node);
    }

    std::pair<Node*, Node*> parts =
        split(node->right, left_size - node_size(node->left) - 1);
    node->right = parts.first;
    pull(node);
    return std::make_pair(node, parts.second);
  }

  static Node* merge(Node* left, Node* right) {
    if (left == nullptr) {
      return right;
    }
    if (right == nullptr) {
      return left;
    }

    if (left->priority > right->priority) {
      left->right = merge(left->right, right);
      pull(left);
      return left;
    }

    right->left = merge(left, right->left);
    pull(right);
    return right;
  }

  bool normalize_range(int& left, int& right) const {
    if (left > right || right < 0 || left >= size()) {
      return false;
    }
    if (left < 0) {
      left = 0;
    }
    if (right >= size()) {
      right = size() - 1;
    }
    return left <= right;
  }

  static void collect_inorder(Node* node, std::vector<T>& out) {
    if (node == nullptr) {
      return;
    }
    collect_inorder(node->left, out);
    out.push_back(node->value);
    collect_inorder(node->right, out);
  }
};


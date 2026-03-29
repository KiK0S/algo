#ifndef EDULCNI_MO_HPP
#define EDULCNI_MO_HPP

namespace edulcni {

struct MoQuery {
  int left;
  int right;  // [left, right)

  MoQuery(int left_ = 0, int right_ = 0) : left(left_), right(right_) {}
};

inline int mo_default_block_size(int n, int q) {
  const int safe_n = std::max(1, n);
  const int safe_q = std::max(1, q);
  const int block_from_n = static_cast<int>(std::sqrt(static_cast<double>(safe_n)));
  const int block_from_ratio =
      static_cast<int>(safe_n / std::max(1.0, std::sqrt(static_cast<double>(safe_q))));
  return std::max(1, std::max(block_from_n, block_from_ratio));
}

inline MoQuery normalize_mo_query(MoQuery query, int n) {
  query.left = std::max(0, std::min(query.left, n));
  query.right = std::max(0, std::min(query.right, n));
  if (query.left > query.right) {
    std::swap(query.left, query.right);
  }
  return query;
}

inline std::vector<int> mo_order(const std::vector<MoQuery>& queries, int n,
                                 int block_size = -1) {
  const int q = static_cast<int>(queries.size());
  if (block_size <= 0) {
    block_size = mo_default_block_size(n, q);
  }

  std::vector<MoQuery> normalized(q);
  for (int i = 0; i < q; ++i) {
    normalized[i] = normalize_mo_query(queries[i], n);
  }

  std::vector<int> order(q);
  std::iota(order.begin(), order.end(), 0);
  std::sort(order.begin(), order.end(), [&](int lhs_idx, int rhs_idx) {
    const MoQuery& lhs = normalized[lhs_idx];
    const MoQuery& rhs = normalized[rhs_idx];
    const int lhs_block = lhs.left / block_size;
    const int rhs_block = rhs.left / block_size;
    if (lhs_block != rhs_block) {
      return lhs_block < rhs_block;
    }
    if ((lhs_block & 1) == 0) {
      return lhs.right < rhs.right;
    }
    return lhs.right > rhs.right;
  });
  return order;
}

template <typename AddLeft, typename AddRight, typename RemoveLeft, typename RemoveRight,
          typename GetAnswer>
inline std::vector<typename std::invoke_result<GetAnswer>::type> mo_process(
    int n, const std::vector<MoQuery>& queries, const AddLeft& add_left,
    const AddRight& add_right, const RemoveLeft& remove_left,
    const RemoveRight& remove_right, const GetAnswer& get_answer,
    int block_size = -1) {
  using Answer = typename std::invoke_result<GetAnswer>::type;
  const int q = static_cast<int>(queries.size());
  std::vector<Answer> answers(static_cast<std::size_t>(q));
  if (q == 0) {
    return answers;
  }

  std::vector<MoQuery> normalized(q);
  for (int i = 0; i < q; ++i) {
    normalized[i] = normalize_mo_query(queries[i], n);
  }

  const std::vector<int> order = mo_order(normalized, n, block_size);
  int cur_left = 0;
  int cur_right = 0;

  for (int index : order) {
    const MoQuery query = normalized[index];
    while (cur_left > query.left) {
      add_left(--cur_left);
    }
    while (cur_right < query.right) {
      add_right(cur_right++);
    }
    while (cur_left < query.left) {
      remove_left(cur_left++);
    }
    while (cur_right > query.right) {
      remove_right(--cur_right);
    }
    answers[index] = get_answer();
  }
  return answers;
}

}  // namespace edulcni

#endif  // EDULCNI_MO_HPP

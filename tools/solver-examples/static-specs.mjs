function renderStaticSolver(core, name) {
  return () =>
    core.renderStaticTemplate(`${name}/helpers.hpp.tmpl`).content;
}

export function createStaticSpecs(core) {
  return [
    {
      name: "test_generators",
      path: "/templates/test_generators",
      description: "Generate deterministic arrays, permutations, masks, trees, and graphs.",
      render: renderStaticSolver(core, "test_generators"),
      mainBody: String.raw`
  TestGenerator generator(123456789);
  const auto values = generator.generate_array<int>(6, -5, 5);
  assert(values.size() == 6);
  assert(std::all_of(values.begin(), values.end(), [](int value) {
    return -5 <= value && value <= 5;
  }));

  auto permutation = generator.generate_permutation(6);
  std::sort(permutation.begin(), permutation.end());
  assert((permutation == std::vector<int>{0, 1, 2, 3, 4, 5}));

  const auto tree = generator.generate_tree(6);
  assert(tree.size() == 5);
  const auto graph = generator.generate_graph(6, 7, true);
  assert(graph.size() == 7);
  assert(generator.generate_mask(5) < (std::uint64_t{1} << 5));
`
    },
    {
      name: "tree_hash",
      path: "/templates/tree_hash",
      description: "Compare canonical hashes of two isomorphic unrooted trees.",
      render: renderStaticSolver(core, "tree_hash"),
      mainBody: String.raw`
  std::vector<std::vector<int>> first(6), second(6);
  const auto add_edge = [](std::vector<std::vector<int>>& graph, int u, int v) {
    graph[u].push_back(v);
    graph[v].push_back(u);
  };
  add_edge(first, 0, 1);
  add_edge(first, 1, 2);
  add_edge(first, 1, 3);
  add_edge(first, 3, 4);
  add_edge(first, 3, 5);

  add_edge(second, 5, 4);
  add_edge(second, 4, 3);
  add_edge(second, 4, 2);
  add_edge(second, 2, 1);
  add_edge(second, 2, 0);

  TreeHasher hasher;
  assert(hasher.hash(first) == hasher.hash(second));
`
    },
    {
      name: "kruskal",
      path: "/templates/kruskal",
      description: "Build a minimum spanning tree and recover its selected edges.",
      render: renderStaticSolver(core, "kruskal"),
      mainBody: String.raw`
  const std::vector<KruskalEdge> edges = {
      {0, 1, 1, 0},
      {1, 2, 2, 1},
      {0, 2, 4, 2},
  };
  const auto result = kruskal(3, edges);
  assert(result.connected);
  assert(result.weight == 3);
  assert(result.edges.size() == 2);
`
    },
    {
      name: "fwt_convolution",
      path: "/templates/fwt_convolution",
      description: "Compute an XOR convolution with the Walsh-Hadamard transform.",
      render: renderStaticSolver(core, "fwt_convolution"),
      mainBody: String.raw`
  const std::vector<long long> first = {1, 2, 3, 4};
  const std::vector<long long> second = {4, 3, 2, 1};
  const auto result = bitwise_convolution(
      first, second, BitwiseConvolution::xor_convolution);
  assert((result == std::vector<long long>{20, 22, 28, 30}));
`
    },
    {
      name: "offline_dynamic_connectivity",
      path: "/templates/offline_dynamic_connectivity",
      description: "Answer connectivity queries across edge additions and removals.",
      render: renderStaticSolver(core, "offline_dynamic_connectivity"),
      mainBody: String.raw`
  using Type = DynamicConnectivityOperationType;
  const std::vector<DynamicConnectivityOperation> operations = {
      {Type::add_edge, 0, 1},
      {Type::connected, 0, 2},
      {Type::add_edge, 1, 2},
      {Type::connected, 0, 2},
      {Type::remove_edge, 0, 1},
      {Type::connected, 0, 2},
  };
  OfflineDynamicConnectivity connectivity(3, operations);
  const auto answers = connectivity.solve();
  assert((answers == std::vector<bool>{false, true, false}));
`
    },
    {
      name: "dp_knapsack",
      path: "/templates/dp_knapsack",
      description: "Compare zero-one and unbounded one-dimensional knapsack.",
      render: renderStaticSolver(core, "dp_knapsack"),
      mainBody: String.raw`
  const std::vector<int> weights = {3, 4};
  const std::vector<long long> values = {5, 6};
  assert(knapsack_zero_one(weights, values, 6) == 6);
  assert(knapsack_unbounded(weights, values, 6) == 10);
`
    },
    {
      name: "lis",
      path: "/templates/lis",
      description: "Reconstruct strict and nondecreasing longest subsequences.",
      render: renderStaticSolver(core, "lis"),
      mainBody: String.raw`
  const std::vector<int> values = {3, 1, 2, 2, 4};
  const auto strict = longest_increasing_subsequence_indices(values);
  const auto nondecreasing = longest_increasing_subsequence_indices(values, true);
  assert((strict == std::vector<int>{1, 3, 4}));
  assert((nondecreasing == std::vector<int>{1, 2, 3, 4}));
`
    },
    {
      name: "digit_dp",
      path: "/templates/digit_dp",
      description: "Count values whose decimal digit sum is divisible by three.",
      render: renderStaticSolver(core, "digit_dp"),
      mainBody: String.raw`
  const long long count = digit_dp_count(
      "25", 3, 0,
      [](int remainder, int digit) { return (remainder + digit) % 3; },
      [](int remainder) { return remainder == 0; });
  assert(count == 9);
`
    },
    {
      name: "sos_dp",
      path: "/templates/sos_dp",
      description: "Apply subset zeta, Mobius, and superset zeta transforms.",
      render: renderStaticSolver(core, "sos_dp"),
      mainBody: String.raw`
  const std::vector<long long> values = {1, 2, 3, 4, 5, 6, 7, 8};
  const auto subset_sums = subset_zeta_transform(values, 3);
  assert((subset_sums == std::vector<long long>{1, 3, 4, 10, 6, 14, 16, 36}));
  assert(subset_mobius_transform(subset_sums, 3) == values);
  const auto superset_sums = superset_zeta_transform(values, 3);
  assert((superset_sums == std::vector<long long>{36, 20, 22, 12, 26, 14, 15, 8}));
`
    },
    {
      name: "turtle_dp",
      path: "/templates/turtle_dp",
      description: "Count right-down grid paths and reconstruct minimum and maximum paths.",
      render: renderStaticSolver(core, "turtle_dp"),
      mainBody: String.raw`
  const std::vector<std::string> grid = {"...", ".#.", "..."};
  assert(turtle_count_paths(grid) == 2);

  const std::vector<std::vector<long long>> values = {
      {1, 2, 3},
      {4, 5, 6},
      {7, 8, 9},
  };
  const auto maximum = turtle_max_path(values);
  const auto minimum = turtle_min_path(values);
  assert(maximum.value == 29);
  assert(minimum.value == 21);
  assert((maximum.path.front() == std::pair<int, int>{0, 0}));
  assert((maximum.path.back() == std::pair<int, int>{2, 2}));
`
    },
    {
      name: "substring_dp",
      path: "/templates/substring_dp",
      description: "Partition a string into palindromes and solve palindromic subsequence DP.",
      render: renderStaticSolver(core, "substring_dp"),
      mainBody: String.raw`
  const std::string text = "aab";
  const std::function<long long(int, int)> palindrome_cost =
      [&](int left, int right) {
        const std::string part = text.substr(left, right - left);
        return std::equal(part.begin(), part.end(), part.rbegin()) ? 1LL : 1000LL;
      };
  const auto partition = substring_partition_dp<long long>(
      static_cast<int>(text.size()), 1000000LL, palindrome_cost);
  assert(partition.first == 2);
  assert((partition.second == std::vector<std::pair<int, int>>{{0, 2}, {2, 3}}));
  assert(longest_palindromic_subsequence("bbbab") == 4);
`
    },
    {
      name: "divide_conquer_dp",
      path: "/templates/divide_conquer_dp",
      description: "Optimize a partition DP with monotone split points.",
      render: renderStaticSolver(core, "divide_conquer_dp"),
      mainBody: String.raw`
  const auto squared_length = [](int left, int right) {
    const long long length = right - left;
    return length * length;
  };
  const auto result = divide_conquer_partition_dp(5, 2, squared_length);
  assert(result[5] == 13);
`
    },
    {
      name: "knuth_dp",
      path: "/templates/knuth_dp",
      description: "Optimize adjacent interval merging with Knuth's bounds.",
      render: renderStaticSolver(core, "knuth_dp"),
      mainBody: String.raw`
  const std::vector<long long> weights = {1, 2, 3, 4};
  std::vector<long long> prefix(weights.size() + 1);
  std::partial_sum(weights.begin(), weights.end(), prefix.begin() + 1);
  const auto [cost, optimum] = knuth_interval_dp(
      static_cast<int>(weights.size()),
      [&](int left, int right) { return prefix[right] - prefix[left]; });
  assert(cost[0][4] == 19);
  assert(0 < optimum[0][4] && optimum[0][4] < 4);
`
    },
    {
      name: "convex_hull_trick",
      path: "/templates/convex_hull_trick",
      description: "Query minima from decreasing-slope lines at increasing x coordinates.",
      render: renderStaticSolver(core, "convex_hull_trick"),
      mainBody: String.raw`
  MonotoneConvexHullTrick hull;
  hull.add_line(5, 1);
  hull.add_line(3, 2);
  hull.add_line(1, 10);
  assert(hull.query(0) == 1);
  assert(hull.query(2) == 8);
  assert(hull.query(10) == 20);
`
    },
    {
      name: "li_chao_tree",
      path: "/templates/li_chao_tree",
      description: "Insert arbitrary lines and query their minimum on an integer domain.",
      render: renderStaticSolver(core, "li_chao_tree"),
      mainBody: String.raw`
  LiChaoTree tree(0, 10);
  tree.add_line(2, 3);
  tree.add_line(-1, 10);
  tree.add_line(0, 5);
  assert(tree.query(0) == 3);
  assert(tree.query(4) == 5);
  assert(tree.query(10) == 0);
`
    },
    {
      name: "monotone_queue_dp",
      path: "/templates/monotone_queue_dp",
      description: "Optimize a sliding-window minimum transition with a deque.",
      render: renderStaticSolver(core, "monotone_queue_dp"),
      mainBody: String.raw`
  const std::vector<long long> transition_cost = {0, 5, 1, 2, 10, 1};
  const auto result = sliding_window_min_dp(transition_cost, 2);
  assert((result == std::vector<long long>{0, 5, 1, 3, 11, 4}));
`
    },
    {
      name: "aliens_trick",
      path: "/templates/aliens_trick",
      description: "Recover the optimum for an exact count through lambda search.",
      render: renderStaticSolver(core, "aliens_trick"),
      mainBody: String.raw`
  const std::array<long long, 5> objective = {16, 9, 4, 1, 0};
  const auto solve_penalized = [&](long long lambda) {
    std::pair<long long, int> best = {
        std::numeric_limits<long long>::max(), -1};
    for (int count = 0; count < static_cast<int>(objective.size()); ++count) {
      const long long candidate = objective[count] + lambda * count;
      if (candidate <= best.first) best = {candidate, count};
    }
    return best;
  };
  const auto result = aliens_trick_min_exact(2, -10, 10, solve_penalized);
  assert(result.objective == 4);
  assert(result.lambda == 5);
  assert(result.selected_count == 2);
`
    },
    {
      name: "wavelet_matrix",
      path: "/templates/wavelet_matrix",
      description: "Query order statistics, frequencies, and prefix sums in subarrays.",
      render: renderStaticSolver(core, "wavelet_matrix"),
      mainBody: String.raw`
  const std::vector<unsigned> values = {5, 1, 4, 1, 3};
  WaveletMatrix<unsigned> matrix(values);
  assert(matrix.kth(1, 5, 0) == 1);
  assert(matrix.kth(1, 5, 2) == 3);
  assert(matrix.frequency(0, 5, 1) == 2);
  assert(matrix.count_less(0, 5, 4) == 3);
  assert(matrix.sum_k_smallest(0, 5, 3) == 5);
`
    },
    {
      name: "suffix_automaton",
      path: "/templates/suffix_automaton",
      description: "Count distinct substrings and occurrences with a suffix automaton.",
      render: renderStaticSolver(core, "suffix_automaton"),
      mainBody: String.raw`
  SuffixAutomaton automaton(std::string("ababa"));
  assert(automaton.distinct_substring_count() == 9);
  assert(automaton.occurrence_count(std::string("aba")) == 2);
  assert(automaton.occurrence_count(std::string("ac")) == 0);
  assert((automaton.representative_occurrence(std::string("bab")) ==
          std::pair<int, int>{1, 4}));
`
    },
    {
      name: "potential_dsu",
      path: "/templates/potential_dsu",
      description: "Maintain relative potentials and reject inconsistent constraints.",
      render: renderStaticSolver(core, "potential_dsu"),
      mainBody: String.raw`
  PotentialDsu<long long> dsu(4);
  assert(dsu.unite(0, 1, 5));
  assert(dsu.unite(1, 2, -2));
  assert(dsu.difference(0, 2) == std::optional<long long>{3});
  assert(!dsu.unite(0, 2, 4));
  assert(!dsu.difference(0, 3).has_value());
`
    },
    {
      name: "floor_sum",
      path: "/templates/floor_sum",
      description: "Evaluate signed floor sums and lattice-point counts.",
      render: renderStaticSolver(core, "floor_sum"),
      mainBody: String.raw`
  assert(floor_sum(5, 7, 3, 2) == 4);
  assert(floor_sum(4, 5, -2, 1) == -3);
  assert(count_lattice_points_below(5, 7, 3, 2) == 9);
`
    },
    {
      name: "lower_bound_flow",
      path: "/templates/lower_bound_flow",
      description: "Find a feasible circulation with lower and upper edge bounds.",
      render: renderStaticSolver(core, "lower_bound_flow"),
      mainBody: String.raw`
  LowerBoundFlow<long long> flow(3);
  flow.add_edge(0, 1, 2, 4);
  flow.add_edge(1, 2, 2, 4);
  flow.add_edge(2, 0, 2, 4);
  assert(flow.feasible_circulation());
  const auto edge_flows = flow.edge_flows();
  assert((edge_flows == std::vector<long long>{2, 2, 2}));
`
    }
  ];
}

function analysis(core) {
  return core.analyzeCppDocument("");
}

export function createDynamicSpecsA(core) {
  return [
    {
      name: "segtree",
      path: "/solvers/segtree",
      description: "Point updates and range sums in an iterative segment tree.",
      render: () =>
        core.renderSegmentTree({
          sizeExpression: "n",
          valueType: "int",
          aggregate: "sum",
          updates: ["point_set"],
          outputMode: "iterative_class",
          names: core.planSegmentTreeNames(analysis(core), "t"),
          includeUsageComment: false
        }),
      mainBody: String.raw`
  std::vector<int> values = {1, 2, 3, 4};
  SegmentSumTree<int> tree(values);
  assert(tree.query(0, 4) == 10);
  tree.point_set(2, 10);
  assert(tree.query(1, 4) == 16);
`
    },
    {
      name: "berlekamp_massey",
      path: "/solvers/berlekamp_massey",
      description: "Recover the Fibonacci recurrence and evaluate a later term.",
      render: () =>
        core.renderBerlekampMassey({
          valueType: "long double",
          sequenceName: "sequence",
          indexName: "k",
          features: core.defaultBerlekampMasseyFeatures(),
          names: core.planBerlekampMasseyNames(analysis(core)),
          includeUsageComment: false
        }),
      mainBody: String.raw`
  const std::vector<long double> sequence = {0, 1, 1, 2, 3, 5, 8, 13};
  const auto coefficients = berlekamp_massey(sequence);
  assert(coefficients.size() == 2);
  assert(std::abs(coefficients[0] - 1.0L) < 1e-12L);
  assert(std::abs(coefficients[1] - 1.0L) < 1e-12L);
  const long double term = linear_recurrence_kth(
      std::vector<long double>{0, 1}, coefficients, 10);
  assert(std::llround(term) == 55);
`
    },
    {
      name: "sparse_table",
      path: "/solvers/sparse_table",
      description: "Build a sparse table and answer immutable range minima.",
      render: () =>
        core.renderSparseTable({
          valueType: "int",
          sourceName: "a",
          variants: ["min"],
          names: core.planSparseTableNames(analysis(core)),
          includeUsageComment: false
        }),
      mainBody: String.raw`
  std::vector<int> values = {5, 2, 7, 3, 9, 1, 4};
  build_sparse_min(values);
  assert(query_sparse_min(0, 6) == 1);
  assert(query_sparse_min(1, 3) == 2);
`
    },
    {
      name: "bfs",
      path: "/solvers/bfs",
      description: "Explore an unweighted graph and restore a shortest path.",
      render: () =>
        core.renderBfs({
          names: core.planBfsNames(analysis(core)),
          includeUsageComment: false
        }),
      mainBody: String.raw`
  std::vector<std::vector<int>> graph(6);
  bfs_add_edge(graph, 0, 1, true);
  bfs_add_edge(graph, 1, 2, true);
  bfs_add_edge(graph, 2, 3, true);
  bfs_add_edge(graph, 1, 4, true);
  bfs_add_edge(graph, 4, 5, true);
  const BfsResult result = bfs(graph, 0);
  assert(result.distance[5] == 3);
  const auto path = bfs_restore_path(0, 5, result);
  assert((path == std::vector<int>{0, 1, 4, 5}));
`
    },
    {
      name: "linear_sieve",
      path: "/solvers/linear_sieve",
      description: "Generate primes and factor an integer with a linear sieve.",
      render: () =>
        core.renderLinearSieve({
          features: core.defaultLinearSieveFeatures(),
          names: core.planLinearSieveNames(analysis(core)),
          includeUsageComment: false
        }),
      mainBody: String.raw`
  LinearSieve sieve(50);
  assert(sieve.is_prime(47));
  assert(!sieve.is_prime(48));
  const auto factors = sieve.factorize(48);
  assert((factors == std::vector<std::pair<int, int>>{{2, 4}, {3, 1}}));
`
    },
    {
      name: "fenwick",
      path: "/solvers/fenwick",
      description: "Accumulate point additions and query prefix and range sums.",
      render: () =>
        core.renderFenwick({
          ...core.defaultFenwickOptions(analysis(core)),
          operations: ["sum"],
          application: "point_range",
          includeUsageComment: false
        }),
      mainBody: String.raw`
  FenwickSumTree<int> tree(6);
  const std::vector<int> values = {3, 1, 4, 1, 5, 9};
  for (int i = 0; i < static_cast<int>(values.size()); ++i) tree.add(i, values[i]);
  assert(tree.prefix(3) == 9);
  assert(tree.segment(2, 5) == 19);
`
    },
    {
      name: "modint",
      path: "/solvers/modint",
      description: "Perform modular arithmetic, exponentiation, and inversion.",
      render: () =>
        core.renderModInt({
          ...core.defaultModIntOptions(analysis(core)),
          mode: "static",
          includeUsageComment: false
        }),
      mainBody: String.raw`
  using Mint = StaticModInt<1000000007>;
  const Mint power = Mint(2).pow(10);
  assert(power.value() == 1024);
  assert((Mint(5) * Mint(5).inv()).value() == 1);
  assert((Mint(1000000006) + Mint(2)).value() == 1);
`
    },
    {
      name: "dsu",
      path: "/solvers/dsu",
      description: "Merge components and inspect the resulting parent forest.",
      render: () =>
        core.renderDsu({
          names: core.planDsuNames(analysis(core)),
          includeUsageComment: false
        }),
      mainBody: String.raw`
  Dsu dsu(6);
  assert(dsu.unite(0, 1));
  assert(dsu.unite(1, 2));
  assert(dsu.unite(4, 5));
  assert(dsu.same(0, 2));
  assert(!dsu.same(2, 4));
  assert(dsu.component_size(1) == 3);
`
    },
    {
      name: "rollback_dsu",
      path: "/solvers/rollback_dsu",
      description: "Merge components, then restore a previous DSU snapshot.",
      render: () =>
        core.renderRollbackDsu({
          names: core.planRollbackDsuNames(analysis(core)),
          includeUsageComment: false
        }),
      mainBody: String.raw`
  RollbackDsu dsu(5);
  dsu.unite(0, 1);
  const int snapshot = dsu.snapshot();
  dsu.unite(1, 2);
  assert(dsu.same(0, 2));
  dsu.rollback(snapshot);
  assert(!dsu.same(0, 2));
  assert(dsu.same(0, 1));
`
    },
    {
      name: "lca",
      path: "/solvers/lca",
      description: "Build binary lifting tables and answer ancestor queries.",
      render: () =>
        core.renderLca({
          names: core.planLcaNames(analysis(core)),
          includeUsageComment: false
        }),
      mainBody: String.raw`
  LcaBinaryLifting lca(7);
  lca.add_edge(0, 1);
  lca.add_edge(0, 2);
  lca.add_edge(1, 3);
  lca.add_edge(1, 4);
  lca.add_edge(2, 5);
  lca.add_edge(2, 6);
  lca.build(0);
  assert(lca.lca(3, 4) == 1);
  assert(lca.lca(3, 6) == 0);
  assert(lca.dist(3, 6) == 4);
`
    },
    {
      name: "twosat",
      path: "/solvers/twosat",
      description: "Solve a small implication system and inspect its assignment.",
      render: () =>
        core.renderTwoSat({
          features: ["force"],
          names: core.planTwoSatNames(analysis(core)),
          includeUsageComment: false
        }),
      mainBody: String.raw`
  TwoSat sat(3);
  sat.add_or(0, true, 1, true);
  sat.add_implication(1, true, 2, true);
  sat.add_true(1);
  assert(sat.solve());
  assert(sat.value(1));
  assert(sat.value(2));
`
    },
    {
      name: "maxflow_dinic",
      path: "/solvers/maxflow_dinic",
      description: "Find the maximum flow through a small capacitated network.",
      render: () =>
        core.renderMaxflowDinic({
          ...core.defaultMaxflowDinicOptions(analysis(core)),
          includeUsageComment: false
        }),
      mainBody: String.raw`
  Dinic<long long> flow(4);
  flow.add_edge(0, 1, 3);
  flow.add_edge(0, 2, 2);
  flow.add_edge(1, 2, 1);
  flow.add_edge(1, 3, 2);
  flow.add_edge(2, 3, 3);
  const long long result = flow.max_flow(0, 3);
  assert(result == 5);
`
    },
    {
      name: "mincost_maxflow",
      path: "/solvers/mincost_maxflow",
      description: "Send maximum flow while minimizing its total edge cost.",
      render: () =>
        core.renderMinCostMaxFlow({
          ...core.defaultMinCostMaxFlowOptions(analysis(core)),
          includeUsageComment: false
        }),
      mainBody: String.raw`
  MinCostMaxFlow<long long, long long> flow(4);
  flow.add_edge(0, 1, 2, 1);
  flow.add_edge(0, 2, 1, 5);
  flow.add_edge(1, 2, 1, 2);
  flow.add_edge(1, 3, 1, 3);
  flow.add_edge(2, 3, 2, 1);
  const auto result = flow.min_cost_max_flow(0, 3);
  assert(result.first == 3);
  assert(result.second == 14);
`
    },
    {
      name: "hungarian",
      path: "/solvers/hungarian",
      description: "Compute a minimum-cost assignment in a square matrix.",
      render: () =>
        core.renderHungarian({
          ...core.defaultHungarianOptions(analysis(core)),
          includeUsageComment: false
        }),
      mainBody: String.raw`
  const std::vector<std::vector<long long>> cost = {
      {4, 1, 3},
      {2, 0, 5},
      {3, 2, 2},
  };
  const auto result = hungarian(cost);
  assert(result.min_cost == 5);
  assert(result.match_left.size() == 3);
`
    },
    {
      name: "kuhn",
      path: "/solvers/kuhn",
      description: "Find a maximum matching in a bipartite graph.",
      render: () =>
        core.renderKuhn({
          ...core.defaultKuhnOptions(analysis(core)),
          features: [],
          includeUsageComment: false
        }),
      mainBody: String.raw`
  KuhnMatcher matcher(3, 3);
  matcher.add_edge(0, 0);
  matcher.add_edge(0, 1);
  matcher.add_edge(1, 1);
  matcher.add_edge(2, 1);
  matcher.add_edge(2, 2);
  const auto result = matcher.maximum_matching();
  assert(result.matching_size == 3);
`
    },
    {
      name: "implicit_treap",
      path: "/solvers/implicit_treap",
      description: "Edit and aggregate a sequence represented by an implicit treap.",
      render: () =>
        core.renderImplicitTreap({
          valueType: "long long",
          aggregate: "sum",
          features: core.defaultImplicitTreapFeatures(),
          names: core.planImplicitTreapNames(analysis(core)),
          includeUsageComment: false
        }),
      mainBody: String.raw`
  ImplicitTreap<long long> treap(123);
  treap.push_back(10);
  treap.push_back(20);
  treap.push_back(30);
  treap.insert(1, 5);
  assert(treap.range_query(0, 3) == 65);
  treap.reverse(1, 3);
  assert((treap.to_vector() == std::vector<long long>{10, 30, 20, 5}));
`
    },
    {
      name: "merge_sort_tree",
      path: "/solvers/merge_sort_tree",
      description: "Count values in subarray ranges with a merge-sort tree.",
      render: () =>
        core.renderMergeSortTree({
          valueType: "int",
          sourceName: "a",
          queries: core.defaultMergeSortTreeQueries(),
          names: core.planMergeSortTreeNames(analysis(core)),
          includeUsageComment: false
        }),
      mainBody: String.raw`
  const std::vector<int> values = {5, 1, 7, 3, 5, 2};
  MergeSortTree<int> tree(values);
  assert(tree.count_less(1, 4, 5) == 2);
  assert(tree.count_in_range(0, 5, 2, 5) == 4);
`
    }
  ];
}

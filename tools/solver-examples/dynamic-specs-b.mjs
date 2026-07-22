export function createDynamicSpecsB(core) {
  const analyze = () => core.analyzeCppDocument("");

  return [
    {
      name: "poly_hash",
      path: "/solvers/poly_hash",
      description: "Compare substrings and compose polynomial hashes.",
      render: () => core.renderPolyHash({
        inputKind: "string",
        sourceName: "s",
        mod1Expression: "1000000007",
        mod2Expression: "1000000009",
        baseExpression: "911382323",
        features: core.defaultPolyHashFeatures(),
        names: core.planPolyHashNames(analyze()),
        includeUsageComment: false
      }),
      mainBody: String.raw`
  const std::string text = "abracadabra";
  PolyHash hash(text);
  assert(hash.size() == static_cast<int>(text.size()));
  assert(hash.hash_substring(0, 4) == poly_hash_string("abra"));
  assert(hash.equal_substrings(0, 4, 7, 11));
  const PolyHashValue left = hash.hash_substring(0, 4);
  const PolyHashValue right = hash.hash_substring(4, 7);
  assert(hash.concat(left, right, 3) == hash.hash_substring(0, 7));
`
    },
    {
      name: "suffix_array",
      path: "/solvers/suffix_array",
      description: "Build the suffix array and LCP array for a short string.",
      render: () => core.renderSuffixArray({
        inputKind: "string",
        sourceName: "s",
        features: ["rank", "lcp", "stripped_sa"],
        names: core.planSuffixArrayNames(analyze()),
        includeUsageComment: false
      }),
      mainBody: String.raw`
  const std::string text = "banana";
  const auto result = suffix_array_build(text);
  assert((result.sa == std::vector<int>{6, 5, 3, 1, 0, 4, 2}));
  assert((result.lcp == std::vector<int>{0, 0, 1, 3, 0, 0, 2}));
  const auto without_empty = suffix_array_remove_empty_suffix(result);
  assert((without_empty == std::vector<int>{5, 3, 1, 0, 4, 2}));
`
    },
    {
      name: "segtree_beats",
      path: "/solvers/segtree_beats",
      description: "Apply range chmin, chmax, and add updates with aggregate queries.",
      render: () => core.renderSegmentTreeBeats({
        valueType: "long long",
        updates: ["chmin", "chmax", "add"],
        queries: ["sum", "min", "max"],
        names: core.planSegmentTreeBeatsNames(analyze()),
        includeUsageComment: false
      }),
      mainBody: String.raw`
  std::vector<long long> values = {5, 1, 7, 3, 9};
  SegmentTreeBeats<long long> tree(values);
  assert(tree.query_sum(0, 4) == 25);
  tree.chmin(0, 4, 6);
  assert(tree.query_max(0, 4) == 6);
  tree.chmax(1, 3, 4);
  tree.add(2, 4, -2);
  assert(tree.query_sum(0, 4) == 19);
  assert(tree.query_min(0, 4) == 2);
`
    },
    {
      name: "fft_ntt",
      path: "/solvers/fft_ntt",
      description: "Multiply two integer polynomials with the NTT.",
      render: () => core.renderFftNtt({
        transforms: ["ntt"],
        includeConvolution: true,
        modulusExpression: "998244353",
        primitiveRootExpression: "3",
        names: core.planFftNttNames(analyze()),
        includeUsageComment: false
      }),
      mainBody: String.raw`
  const std::vector<int> a = {1, 2, 3, 4};
  const std::vector<int> b = {5, 6, 7};
  const std::vector<int> product = convolution_ntt_int(a, b);
  assert((product == std::vector<int>{5, 16, 34, 52, 45, 28}));
`
    },
    {
      name: "fast_allocator",
      path: "/solvers/fast_allocator",
      description: "Allocate standard containers from a resettable arena.",
      render: () => core.renderFastAllocator({
        names: core.planFastAllocatorNames(analyze()),
        includeUsageComment: false
      }),
      mainBody: String.raw`
  FastAllocatorArena arena(1U << 16U);
  std::vector<int, FastAllocator<int>> values{FastAllocator<int>(arena)};
  for (int value = 0; value < 16; ++value) values.push_back(value * value);
  assert(values[7] == 49);
  const std::size_t remaining_after_allocations = arena.remaining();
  arena.reset();
  assert(arena.remaining() > remaining_after_allocations);
`
    },
    {
      name: "monotonic_stack",
      path: "/solvers/monotonic_stack",
      description: "Find the nearest smaller and greater elements on both sides.",
      render: () => core.renderMonotonicStack({
        names: core.planMonotonicStackNames(analyze()),
        includeUsageComment: false
      }),
      mainBody: String.raw`
  const std::vector<int> values = {5, 2, 4, 4, 1, 3};
  const auto nearest = nearest_all(values, true);
  assert((nearest.left_smaller == std::vector<int>{-1, -1, 1, 1, -1, 4}));
  assert((nearest.right_greater == std::vector<int>{-1, 2, -1, -1, 5, -1}));
`
    },
    {
      name: "toposort",
      path: "/solvers/toposort",
      description: "Topologically order a directed acyclic graph.",
      render: () => core.renderToposort({
        names: core.planToposortNames(analyze()),
        includeUsageComment: false
      }),
      mainBody: String.raw`
  std::vector<std::vector<int>> graph(6);
  toposort_add_edge(graph, 5, 2);
  toposort_add_edge(graph, 5, 0);
  toposort_add_edge(graph, 4, 0);
  toposort_add_edge(graph, 4, 1);
  toposort_add_edge(graph, 2, 3);
  toposort_add_edge(graph, 3, 1);
  bool is_dag = false;
  const std::vector<int> order = topological_sort(graph, &is_dag);
  assert(is_dag && is_topological_order(graph, order));
`
    },
    {
      name: "kosaraju",
      path: "/solvers/kosaraju",
      description: "Find strongly connected components and their condensation graph.",
      render: () => core.renderKosaraju({
        names: core.planKosarajuNames(analyze()),
        includeUsageComment: false
      }),
      mainBody: String.raw`
  std::vector<std::vector<int>> graph(6);
  kosaraju_add_edge(graph, 0, 1);
  kosaraju_add_edge(graph, 1, 2);
  kosaraju_add_edge(graph, 2, 0);
  kosaraju_add_edge(graph, 2, 3);
  kosaraju_add_edge(graph, 3, 4);
  kosaraju_add_edge(graph, 4, 3);
  kosaraju_add_edge(graph, 4, 5);
  const KosarajuResult result = kosaraju_scc(graph);
  assert(result.component_count == 3);
  assert(result.component_of[0] == result.component_of[2]);
  assert(result.component_of[3] == result.component_of[4]);
  assert(result.component_of[4] != result.component_of[5]);
`
    },
    {
      name: "dijkstra",
      path: "/solvers/dijkstra",
      description: "Trace shortest paths in a small weighted graph.",
      render: () => core.renderDijkstra({
        names: core.planDijkstraNames(analyze()),
        includeUsageComment: false
      }),
      mainBody: String.raw`
  const long long infinity = std::numeric_limits<long long>::max();
  std::vector<std::vector<DijkstraEdge<long long>>> graph(5);
  dijkstra_add_edge(graph, 0, 1, 10);
  dijkstra_add_edge(graph, 0, 2, 3);
  dijkstra_add_edge(graph, 2, 1, 1);
  dijkstra_add_edge(graph, 1, 3, 2);
  dijkstra_add_edge(graph, 2, 3, 8);
  dijkstra_add_edge(graph, 3, 4, 2);
  const DijkstraResult<long long> result = dijkstra(graph, 0, infinity);
  assert(result.distance[4] == 8);
  assert((dijkstra_restore_path(0, 4, result) == std::vector<int>{0, 2, 1, 3, 4}));
`
    },
    {
      name: "gp_hash_table",
      path: "/solvers/gp_hash_table",
      description: "Use hardened hashes with GNU PBDS hash tables.",
      requirements: ["pbds"],
      preamble: "#include <ext/pb_ds/assoc_container.hpp>",
      render: () => core.renderGpHashTable({
        names: core.planGpHashTableNames(analyze()),
        includeUsageComment: false
      }),
      mainBody: String.raw`
  GpHashTable<long long, int> table;
  table[5] = 11;
  table[5] += 4;
  table[8] = 3;
  assert(table[5] == 15);
  assert(table.find(8) != table.end());
`
    },
    {
      name: "ordered_set",
      path: "/solvers/ordered_set",
      description: "Query ranks and k-th elements with a GNU PBDS ordered set.",
      requirements: ["pbds"],
      preamble: `#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>`,
      render: () => core.renderOrderedSet({
        names: core.planOrderedSetNames(analyze()),
        includeUsageComment: false
      }),
      mainBody: String.raw`
  OrderedSet<int> ordered;
  assert(ordered.insert(8));
  assert(ordered.insert(3));
  assert(ordered.insert(10));
  assert(!ordered.insert(8));
  assert(ordered.order_of_key(9) == 2);
  assert(ordered.find_by_order(1).value() == 8);
  assert(ordered.erase(3));
`
    },
    {
      name: "set_utils",
      path: "/solvers/set_utils",
      description: "Safely inspect neighboring values in ordered containers.",
      render: () => core.renderSetUtils({
        names: core.planSetUtilsNames(analyze()),
        includeUsageComment: false
      }),
      mainBody: String.raw`
  const std::set<int> values = {2, 4, 8};
  assert(next_value(values, 4).value() == 8);
  assert(prev_value(values, 4).value() == 2);
  assert(!next_value(values, 8).has_value());
  assert(!prev_value(values, 2).has_value());
`
    },
    {
      name: "hld",
      path: "/solvers/hld",
      description: "Decompose tree paths into contiguous heavy-light segments.",
      render: () => core.renderHld({
        names: core.planHldNames(analyze()),
        includeUsageComment: false
      }),
      mainBody: String.raw`
  HeavyLightDecomposition hld(7);
  hld.add_edge(0, 1);
  hld.add_edge(0, 2);
  hld.add_edge(1, 3);
  hld.add_edge(1, 4);
  hld.add_edge(2, 5);
  hld.add_edge(2, 6);
  hld.build(0);
  assert(hld.lca(3, 4) == 1);
  assert(hld.lca(3, 6) == 0);
  const auto subtree = hld.subtree_segment(2);
  assert(subtree.second - subtree.first + 1 == 3);
  const auto path = hld.path_segments(3, 6, true);
  assert(!path.empty());
`
    },
    {
      name: "mo",
      path: "/solvers/mo",
      description: "Answer offline range-distinct queries with Mo's ordering.",
      render: () => core.renderMo({
        names: core.planMoNames(analyze()),
        includeUsageComment: false
      }),
      mainBody: String.raw`
  const std::vector<int> values = {1, 2, 1, 3, 2, 4, 1};
  const std::vector<MoQuery> queries = {{0, 3}, {2, 7}, {0, 2}};
  std::vector<int> frequency(5, 0);
  int distinct = 0;
  auto add = [&](int index) { if (++frequency[values[index]] == 1) ++distinct; };
  auto remove = [&](int index) { if (--frequency[values[index]] == 0) --distinct; };
  auto answer = [&]() { return distinct; };
  const std::vector<int> result = mo_process(
      static_cast<int>(values.size()), queries, add, add, remove, remove, answer);
  assert((result == std::vector<int>{2, 4, 2}));
`
    },
    {
      name: "geometry",
      path: "/solvers/geometry",
      description: "Intersect segments and construct a convex hull.",
      render: () => core.renderGeometry({ includeUsageComment: false }),
      mainBody: String.raw`
  using Point = Point2<long long>;
  assert(segments_intersect(Point(0, 0), Point(2, 2), Point(0, 2), Point(2, 0)));
  const auto intersections = segment_intersection(
      Point(0, 0), Point(2, 2), Point(0, 2), Point(2, 0));
  assert(intersections.size() == 1);
  std::vector<Point> points = {
      Point(0, 0), Point(2, 0), Point(2, 2), Point(0, 2), Point(1, 1)};
  const std::vector<Point> hull = convex_hull(points);
  assert((hull == std::vector<Point>{Point(0, 0), Point(2, 0), Point(2, 2), Point(0, 2)}));
`
    },
    {
      name: "halfplane_intersection",
      path: "/solvers/halfplane_intersection",
      description: "Intersect four half-planes into a bounded polygon.",
      render: () => core.renderHalfplaneIntersection({ includeUsageComment: false }),
      mainBody: String.raw`
  std::vector<HalfPlane> halfplanes = {
      HalfPlane(0.0L, 0.0L, 1.0L, 0.0L),
      HalfPlane(1.0L, 0.0L, 1.0L, 1.0L),
      HalfPlane(1.0L, 1.0L, 0.0L, 1.0L),
      HalfPlane(0.0L, 1.0L, 0.0L, 0.0L),
  };
  const std::vector<Point2<long double>> polygon = halfplane_intersection(halfplanes);
  assert(polygon.size() == 4);
`
    }
  ];
}

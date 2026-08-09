# Structured input and connected components

`/templates/input` asks for the shape of the input and emits only the selected
reader. If the current file does not already define `read`, it also inserts this
global helper:

```cpp
template<class... Ts>
std::istream& read(Ts&... values) {
	return (std::cin >> ... >> values);
}
```

The wizard asks whether every selected index-valued field is 0-based or
1-based. Ordinary values such as costs are not changed.

## Examples

For a 1-based weighted edge list where only the endpoints are indices:

```cpp
std::vector<std::tuple<int, int, long long>> edges(m);
for (auto& [from, to, weight] : edges) {
	read(from, to, weight);
	--from;
	--to;
}
```

For an undirected 1-based graph, retaining both adjacency lists and degrees:

```cpp
std::vector<std::vector<int>> graph(n);
std::vector<int> indegree(n), outdegree(n);
for (int edge_index = 0; edge_index < m; ++edge_index) {
	int from, to;
	read(from, to);
	--from, --to;
	graph[from].push_back(to);
	graph[to].push_back(from);
	++outdegree[from], ++indegree[to];
	++outdegree[to], ++indegree[from];
}
```

For parallel arrays where `vertex` is 1-based but `cost` is an ordinary value:

```cpp
std::vector<int> vertex(n);
std::vector<long long> cost(n);
for (int i = 0; i < n; ++i) {
	read(vertex[i], cost[i]);
	--vertex[i];
}
```

Trees, permutations, and functional graphs can additionally request derived
metadata. The generator only emits the selected metadata: for example, a tree
can request `parent` and `depth` without also importing an LCA or HLD class.

## Connected components

For an existing undirected adjacency list, `/templates/connected_components`
with only component ids selected produces a small result type and one iterative
traversal:

```cpp
struct ConnectedComponentsResult {
	int count = 0;
	std::vector<int> component_of;
};

inline ConnectedComponentsResult connected_components(
		const std::vector<std::vector<int>>& graph) {
	// Iterative DFS; each vertex receives one component id.
}

auto components = connected_components(graph);
```

The same generator can optionally return component sizes or explicit vertex
groups. For directed graphs it asks whether “connected” means weakly connected
or strongly connected; strong components use an iterative Kosaraju traversal.
If graph input is requested, the index-base question is asked before the edges
are emitted.

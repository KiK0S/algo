vi p(n, -1), depth(n), sz(n, 1);
auto dfs = [&](auto self, int v, int pr = -1) -> void {
	p[v] = pr;
	for (auto to : g[v]) {
		if (to == pr) continue;
		depth[to] = depth[v] + 1;
		self(self, to, v);
		sz[v] += sz[to];
	}
};
dfs(dfs, 0);

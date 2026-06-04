vi dist(n, -1);
queue<int> q;
dist[s] = 0;
q.push(s);
while (q.size()) {
	int v = q.front();
	q.pop();
	for (auto to : g[v]) {
		if (dist[to] != -1) continue;
		dist[to] = dist[v] + 1;
		q.push(to);
	}
}

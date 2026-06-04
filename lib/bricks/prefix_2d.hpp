vector<vector<ll>> pref(n + 1, vector<ll>(m + 1));
forn(i, n) forn(j, m) {
	pref[i + 1][j + 1] = pref[i + 1][j] + pref[i][j + 1] - pref[i][j] + a[i][j];
}
auto rect_sum = [&](int x1, int y1, int x2, int y2) {
	return pref[x2][y2] - pref[x1][y2] - pref[x2][y1] + pref[x1][y1];
};

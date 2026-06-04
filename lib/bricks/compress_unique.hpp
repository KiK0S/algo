sort(all(vals));
vals.resize(unique(all(vals)) - vals.begin());
auto get_id = [&](auto x) {
	return lower_bound(all(vals), x) - vals.begin();
};

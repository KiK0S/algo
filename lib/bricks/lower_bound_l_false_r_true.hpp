while (l + 1 < r) {
	int mid = (l + r) / 2;
	if (can(mid)) {
		r = mid;
	} else {
		l = mid;
	}
}

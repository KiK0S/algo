.PHONY: test archive

test:
	cd extension && npm test

archive:
	node tools/build-archive-site.mjs

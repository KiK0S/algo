# algo

Competitive-programming templates exposed through the edulcni VS Code
extension.

## Source model

lib/templates is the only source of insertable C++ content. There are no
standalone snippet headers to include or copy directly.

- lib/templates/solvers: templates used by interactive solver generators
- lib/templates/bricks: static and interactive cursor-local templates
- lib/catalog/snippets.json: the complete public archive, metadata, form
  fields, exports, features, and insertion behavior
- extension/library: generated extension bundle containing only templates
  and catalog data

Browse and insert templates from the extension with commands such as
edulcni:segtree, or use the compatibility browse command to select a slash
path.

Segment-tree presets are consolidated under /solvers/segtree. Segment Tree
Beats remains /solvers/segtree_beats because it has a distinct invariant and
prompt surface.

## Archive website

The static app in site presents the catalog as a searchable expandable tree
with parameter metadata and read-only template previews.

Build its generated data locally:

~~~bash
node tools/build-archive-site.mjs
python3 -m http.server 8000 --directory site
~~~

.github/workflows/pages.yml rebuilds the archive from the catalog and
templates and deploys it to GitHub Pages on pushes to master.

## Tests

Tests render the bundled templates through the extension core, compile and run
curated generated variants, and print each catalog path with its selected
parameters:

~~~bash
cd extension
npm test
~~~

Direct C++ tests that include archive snippets are intentionally unsupported;
they bypass the extension renderer and can test a different artifact than the
one users receive.

# algo

Competitive-programming templates exposed through the edulcni VS Code
extension.

## Install the VS Code extension

Download the `.vsix` file from the
[latest GitHub Release](https://github.com/KiK0S/algo/releases/latest), then run:

```sh
code --install-extension edulcni-v*.vsix
```

Release tags must match the version in `extension/package.json`. Pushing a
`v*` tag packages that exact extension and attaches it to a GitHub Release.

## Source model

lib/templates is the only source of insertable C++ content. There are no
standalone snippet headers to include or copy directly.

- lib/templates: all static and interactive templates
- lib/catalog/snippets.json: the complete public archive, metadata, form
  fields, exports, features, and insertion behavior
- extension/library: generated extension bundle containing only templates
  and catalog data

Browse and insert templates from the extension with commands such as
edulcni:segtree, or use the compatibility browse command to select a slash
path.

Segment-tree presets are consolidated under /templates/segtree. Segment Tree
Beats remains /templates/segtree_beats because it has a distinct invariant and
prompt surface.

## Runnable examples

Every algorithm template with a runnable showcase has a generated, executable showcase under
`examples/templates`. The examples are rendered from the same templates used by
the extension, then combined with small deterministic drivers that exercise the
algorithm and its visualization hooks.

For example:

~~~bash
cd examples/templates/bfs
xeppelin edulcni main
~~~

See `examples/README.md` for the complete index. From `extension/`, use
`npm run generate:examples` after template changes and `npm run check:examples`
to detect stale generated files.

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
npm run test:examples
npm run test:examples:visualization
~~~

Direct C++ tests that include archive snippets are intentionally unsupported;
they bypass the extension renderer and can test a different artifact than the
one users receive.

# Edulcni visualization contract

Every catalog artifact has an explicit visualization classification. The current
78 entries comprise 63 automatic visualizations, 10 summary snapshots, 2
diagnostic visualizations, 1 manual integration, and 2 entries with no
visualization. This metadata is shown by the extension picker and the archive
site and is checked against the source templates by the extension test suite.

Visualization is opt-in. Ordinary `xeppelin run` and `xeppelin compile` builds
remain normal contest programs. `xeppelin edulcni` force-includes
`edulcni/bootstrap.hpp`, enables the hooks, runs the solution, and displays live
frames through the native viewer before the process exits. A saved trace may be
added as an export, but replaying a trace is not part of the execution contract.

## Snippet boundary

Templates keep Edulcni calls inside two overridable macros:

```cpp
#ifndef EDULCNI_VIS
#define EDULCNI_VIS(...) ((void)0)
#endif
#ifndef EDULCNI_STEP
#define EDULCNI_STEP(...) ((void)0)
#endif
```

In an ordinary contest build, preprocessing discards each macro argument. The
rendered snippet therefore needs no Edulcni include or link dependency, and its
visualization expressions are neither parsed nor evaluated. In an active build,
the bootstrap defines `EDULCNI_VIS(expression)` as guarded expression execution
and `EDULCNI_STEP(label)` as `edulcni::live::step(label)`. Visualization failures
must not escape into the algorithm.

Algorithm code publishes semantic state through generic adapters; it does not
select renderer-specific widgets or know which concrete algorithm preset will
draw the state. Mutate algorithm state first, publish all related state, then
finish the logical operation with one step.

Additional instrumentation rules:

- Do not reevaluate a predicate, callback, comparator, transition, or returned
  expression for display. Store the result once when necessary.
- Keep Edulcni names and visualization-only temporaries inside macro arguments.
- Use stable literal IDs scoped to the algorithm, such as `dijkstra.distance`.
- Prefer an operation, completed outer iteration, or other meaningful state
  transition over steps for individual implementation details.
- Preserve the public API, asymptotic complexity, and disabled-build behavior of
  every paste snippet.

## Generic adapter surface

`edulcni::live` accepts ordinary C++17 values and containers and translates them
to the existing Edulcni widget model. The supported semantic families are:

- scalar state: `value`, `scalar`, `annotation`, `text`, `string`, `gauge`;
- sequences and tables: `array`, `array_highlight`, `matrix`, `table`,
  `matrix_highlight_cell`, `bits`, `histogram`;
- graphs: `graph`, `edges`, `weighted_graph`, `bipartite_graph`, and graph
  highlighting;
- hierarchy: `tree`, `tree_edges`, `forest`, `trie`, `segment_tree`, and
  `interval_tree`;
- containers: `queue`, `stack`, `deque`, `priority_queue`, and `heap`;
- geometry: `points`, `segments`, `polygon`, and `lines`;
- execution context: `transcript` and `recursion_stack`.

Adapters update the current semantic scene. `step(label)` captures and publishes
the resulting frame immediately. Pair and tuple values are formatted recursively;
unknown non-streamable values retain their structural position and display as
`<value>`.

## Catalog classifications

- `automatic`: the normal API publishes meaningful frames without caller work.
- `snapshot`: the API can publish useful state, but only at explicit summaries or
  from overloads that own enough data to construct the snapshot.
- `diagnostic`: the artifact exposes static or support data rather than a full
  evolving algorithm.
- `manual`: generic automatic instrumentation would change the artifact's nature;
  the catalog explains the required integration.
- `none`: visualization is intentionally inapplicable and the catalog records why.

Every entry records semantic models, a preferred layout, default granularity, and
known limitations where applicable. `/solvers/gp_hash_table` is manual because it
is a raw PBDS alias. The full contest-file and stress-harness templates are the two
intentional `none` entries.

## Current compatibility limits

The adapter layer currently streams complete legacy frames rather than deltas.
Graph drawing is undirected, has no arrowheads, and deduplicates parallel edges;
weighted edges use a companion array instead of attached edge labels. Some
high-level presets reuse arrays and labels, and container adapters copy their
snapshots. Per-snippet limitations, including raw PBDS mutations and APIs that do
not own enough state to snapshot it, live in `lib/catalog/snippets.json`.

## Verification

From this repository:

```sh
cd extension
npm test
npm run test:visualization
```

The first command verifies rendering and ordinary disabled builds. The second
force-includes the Edulcni bootstrap and compiles, links, and runs the same
end-to-end cases with visualization enabled.

From the sibling Edulcni repository:

```sh
make check-mvp
```

That target covers the generic C++17 adapters, enabled and disabled bootstrap
behavior, static examples, the producer library, and the native macOS viewer.

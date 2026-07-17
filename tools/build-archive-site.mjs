import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toolsDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(toolsDirectory, "..");
const templateRoot = path.join(repositoryRoot, "lib", "templates");
const catalogPath = path.join(repositoryRoot, "lib", "catalog", "snippets.json");
const outputDirectory = path.join(repositoryRoot, "site");
const outputPath = path.join(outputDirectory, "archive.json");
const browserCorePath = path.join(outputDirectory, "core-browser.js");
const compiledCorePath = path.join(repositoryRoot, "extension", "out", "core.js");
const require = createRequire(import.meta.url);
const core = require(compiledCorePath);

const applicationSpecs = {
  segtree: core.SEGMENT_TREE_APPLICATION_SPEC,
  segtree_beats: core.SEGMENT_TREE_BEATS_APPLICATION_SPEC,
  fenwick: core.FENWICK_APPLICATION_SPEC,
  sparse_table: core.SPARSE_TABLE_APPLICATION_SPEC,
  merge_sort_tree: core.MERGE_SORT_TREE_APPLICATION_SPEC,
  implicit_treap: core.IMPLICIT_TREAP_APPLICATION_SPEC,
  dsu: core.DSU_APPLICATION_SPEC,
  rollback_dsu: core.ROLLBACK_DSU_APPLICATION_SPEC,
  lca: core.LCA_APPLICATION_SPEC,
  hld: core.HLD_APPLICATION_SPEC,
  bfs: core.BFS_APPLICATION_SPEC,
  dijkstra: core.DIJKSTRA_APPLICATION_SPEC,
  toposort: core.TOPOSORT_APPLICATION_SPEC,
  kosaraju: core.KOSARAJU_APPLICATION_SPEC,
  mo: core.MO_APPLICATION_SPEC,
  monotonic_stack: core.MONOTONIC_STACK_APPLICATION_SPEC,
  gp_hash_table: core.GP_HASH_TABLE_APPLICATION_SPEC,
  ordered_set: core.ORDERED_SET_APPLICATION_SPEC,
  set_utils: core.SET_UTILS_APPLICATION_SPEC,
  fast_allocator: core.FAST_ALLOCATOR_APPLICATION_SPEC,
  geometry: core.GEOMETRY_APPLICATION_SPEC,
  halfplane_intersection: core.HALFPLANE_INTERSECTION_APPLICATION_SPEC,
  berlekamp_massey: featureSpec("Berlekamp–Massey", ["minimal_recurrence", "kth_term", "one_shot_kth"]),
  linear_sieve: featureSpec("Linear sieve", ["lowest_prime", "primes", "factorization"]),
  modint: simpleSpec("Modular integer", "mode", "Mode", ["static", "dynamic"]),
  twosat: featureSpec("2-SAT", ["xor", "equal", "force", "at_most_one", "components"]),
  maxflow_dinic: featureSpec("Dinic", ["min_cut", "edge_access", "reset_flow"]),
  mincost_maxflow: simpleSpec("Min-cost flow", "mode", "Mode", ["max_flow", "fixed_flow"]),
  hungarian: simpleSpec("Hungarian", "mode", "Optimization", ["minimize", "maximize"]),
  kuhn: featureSpec("Kuhn matching", ["vertex_cover"]),
  poly_hash: featureSpec("Polynomial hash", ["substring_equal", "reverse", "lcp", "concat"]),
  suffix_array: featureSpec("Suffix array", ["rank", "lcp", "stripped_sa", "lcp_rmq"]),
  fft_ntt: simpleSpec("FFT / NTT", "transforms", "Transforms", ["fft", "ntt"], true),
  compress_unique: simpleSpec("Coordinate compression", "rewriteSource", "Rewrite source", ["yes", "no"]),
  read_vector: { title: "Read vector", scenarios: [], decisions: [], bindings: [], usageSections: [] }
};

function choices(ids) {
  return ids.map((id) => ({ id, label: id.replaceAll("_", " ") }));
}

function simpleSpec(title, id, label, ids, multi = false) {
  return { title, scenarios: [], decisions: [{ id, label, choices: choices(ids), multi }], bindings: [], usageSections: [] };
}

function featureSpec(title, ids) {
  return simpleSpec(title, "features", "Features", ids, true);
}

async function filesBelow(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      result.push(...await filesBelow(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".tmpl")) {
      result.push(entryPath);
    }
  }
  return result.sort();
}

function generatorTemplateLocation(entry) {
  if (entry.kind === "brick") {
    return path.join(templateRoot, "bricks", `${entry.generator}.cpp.tmpl`);
  }
  const directory = {
    segtree: "segment_tree",
    segtree_beats: "segment_tree_beats"
  }[entry.generator] ?? entry.generator;
  return path.join(templateRoot, "solvers", directory);
}

async function previewFiles(entry) {
  if (entry.template) {
    return [path.join(templateRoot, entry.template)];
  }
  const location = generatorTemplateLocation(entry);
  const directoryEntries = await readdir(location, { withFileTypes: true }).catch(() => []);
  if (directoryEntries.length === 0) {
    return [location];
  }
  return filesBelow(location);
}

async function buildPreview(entry) {
  const files = await previewFiles(entry);
  const chunks = [];
  for (const file of files) {
    const source = await readFile(file, "utf8");
    const relativePath = path.relative(templateRoot, file).split(path.sep).join("/");
    chunks.push(`// template: ${relativePath}\n${source.trimEnd()}`);
  }
  return chunks.join("\n\n");
}

async function buildBrowserCore() {
  const templates = {};
  for (const file of await filesBelow(templateRoot)) {
    const relativePath = path.relative(templateRoot, file).split(path.sep).join("/");
    templates[relativePath] = await readFile(file, "utf8");
  }
  const compiledCore = await readFile(compiledCorePath, "utf8");
  return `// Generated by tools/build-archive-site.mjs.\n(() => {\n  const templates = ${JSON.stringify(templates)};\n  const module = { exports: {} };\n  const exports = module.exports;\n  const __dirname = "/extension/out";\n  const pathStub = {\n    resolve(...parts) { return parts.join("/").replaceAll(/\\/+/g, "/"); }\n  };\n  const fsStub = {\n    readFileSync(location) {\n      const marker = "/library/templates/";\n      const index = location.indexOf(marker);\n      const key = index === -1 ? location : location.slice(index + marker.length);\n      if (!(key in templates)) throw new Error(\`missing embedded template: \${key}\`);\n      return templates[key];\n    }\n  };\n  function require(name) {\n    if (name === "node:fs") return fsStub;\n    if (name === "node:path") return { __esModule: true, default: pathStub };\n    throw new Error(\`unsupported browser core import: \${name}\`);\n  }\n${compiledCore}\n  globalThis.edulcniCore = module.exports;\n})();\n`;
}

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const entries = [];
for (const entry of catalog) {
  entries.push({
    ...entry,
    applicationSpec: entry.generator ? applicationSpecs[entry.generator] : undefined,
    preview: await buildPreview(entry)
  });
}

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ entries }, null, 2)}\n`);
await writeFile(browserCorePath, await buildBrowserCore());
console.log(`built ${path.relative(repositoryRoot, outputPath)} with ${entries.length} entries`);

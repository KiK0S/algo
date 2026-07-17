import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toolsDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(toolsDirectory, "..");
const templateRoot = path.join(repositoryRoot, "lib", "templates");
const catalogPath = path.join(repositoryRoot, "lib", "catalog", "snippets.json");
const outputDirectory = path.join(repositoryRoot, "site");
const outputPath = path.join(outputDirectory, "archive.json");

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

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const entries = [];
for (const entry of catalog) {
  entries.push({
    ...entry,
    preview: await buildPreview(entry)
  });
}

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ entries }, null, 2)}\n`);
console.log(`built ${path.relative(repositoryRoot, outputPath)} with ${entries.length} entries`);

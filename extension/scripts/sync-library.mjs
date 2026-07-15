import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const thisFile = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);
const extensionRoot = path.resolve(thisDir, "..");
const sourceRoot = path.resolve(extensionRoot, "..", "lib");
const targetRoot = path.resolve(extensionRoot, "library");
const bundledEntries = ["bricks", "solvers", "templates", "catalog"];

async function ensureSourceExists() {
  const sourceStat = await stat(sourceRoot);
  if (!sourceStat.isDirectory()) {
    throw new Error(`source is not a directory: ${sourceRoot}`);
  }
}

async function main() {
  await ensureSourceExists();
  await rm(targetRoot, { recursive: true, force: true });
  await mkdir(targetRoot, { recursive: true });
  for (const entry of bundledEntries) {
    await cp(path.join(sourceRoot, entry), path.join(targetRoot, entry), {
      recursive: true,
      force: true
    });
  }
  console.log(`synced catalog snippets from ${sourceRoot} to ${targetRoot}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`sync-library failed: ${message}`);
  process.exit(1);
});

import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toolsDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(toolsDirectory, "..");
const catalogPath = path.join(repositoryRoot, "lib", "catalog", "snippets.json");
const examplesRoot = path.join(repositoryRoot, "examples", "templates");
const active = process.env.EDULCNI_ACTIVE_EXAMPLES === "1";
const edulcniRoot = path.resolve(
  process.env.EDULCNI_ROOT ?? path.join(repositoryRoot, "..", "edulcni")
);

function compilerSupportsPbds(compiler) {
  const result = spawnSync(
    compiler,
    ["-std=c++17", "-x", "c++", "-fsyntax-only", "-"],
    { input: "#include <ext/pb_ds/assoc_container.hpp>\n", stdio: ["pipe", "ignore", "ignore"] }
  );
  return result.status === 0;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.status !== 0) {
    throw new Error(`${command} failed with status ${result.status}`);
  }
}

async function main() {
  const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
  const templateNames = await readdir(examplesRoot);
  const templates = templateNames.map((name) => {
    const entry = catalog.find((candidate) => candidate.path === `/templates/${name}`);
    if (!entry) {
      throw new Error(`example has no template catalog entry: ${name}`);
    }
    return entry;
  });
  const compiler = process.env.CXX ?? "g++";
  const hasPbds = compilerSupportsPbds(compiler);
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "algo-solver-examples-"));
  let checked = 0;
  let skipped = 0;

  try {
    for (const entry of templates) {
      const name = entry.path.slice("/templates/".length);
      const requiresPbds = JSON.stringify(entry.constraints ?? {}).includes("pb_ds");
      if (requiresPbds && !hasPbds) {
        console.log(`skip ${name}: ${compiler} has no GNU PBDS`);
        skipped += 1;
        continue;
      }

      const source = path.join(examplesRoot, name, "main.cpp");
      const executable = path.join(temporaryDirectory, name);
      const compilerArguments = ["-std=c++17"];
      if (active) {
        const includeDirectory = path.join(edulcniRoot, "include");
        const libraryDirectory = path.join(edulcniRoot, "lib");
        compilerArguments.push(
          "-DEDULCNI_ENABLED=1",
          "-include",
          path.join(includeDirectory, "edulcni", "bootstrap.hpp"),
          `-I${includeDirectory}`
        );
        compilerArguments.push(source, "-o", executable, `-L${libraryDirectory}`,
          `-Wl,-rpath,${libraryDirectory}`, "-ledulcni", "-pthread");
      } else {
        compilerArguments.push(source, "-o", executable);
      }

      run(compiler, compilerArguments);
      const environment = { ...process.env };
      delete environment.EDULCNI_HOST;
      delete environment.EDULCNI_PORT;
      delete environment.EDULCNI_TOKEN;
      run(executable, [], { env: environment });
      checked += 1;
    }
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }

  console.log(`compiled and ran ${checked} template examples${skipped ? `; skipped ${skipped}` : ""}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

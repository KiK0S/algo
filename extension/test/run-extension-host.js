const path = require("node:path");
const fs = require("node:fs");
const { downloadAndUnzipVSCode, runTests } = require("@vscode/test-electron");

async function main() {
  const extensionDevelopmentPath = path.resolve(__dirname, "..");
  const extensionTestsPath = path.resolve(__dirname, "extension-host", "suite.js");
  const vscodeVersion = "1.85.2";
  let vscodeExecutablePath = await downloadAndUnzipVSCode(vscodeVersion);
  if (process.platform === "darwin" && !fs.existsSync(vscodeExecutablePath)) {
    const codeExecutablePath = path.join(path.dirname(vscodeExecutablePath), "Code");
    if (fs.existsSync(codeExecutablePath)) {
      vscodeExecutablePath = codeExecutablePath;
    }
  }
  await runTests({
    vscodeExecutablePath,
    extensionDevelopmentPath,
    extensionTestsPath,
    launchArgs: ["--disable-extensions", "--skip-welcome", "--skip-release-notes"],
    extensionTestsEnv: {
      ...process.env,
      EDULCNI_EXTENSION_HOST_TEST: "1"
    }
  });
}

main().catch((error) => {
  console.error("Extension-host tests failed:", error);
  process.exitCode = 1;
});

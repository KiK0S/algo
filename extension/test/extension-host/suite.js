const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const vscode = require("vscode");

async function openDocument(content, filePath) {
  if (filePath) {
    await fs.writeFile(filePath, content, "utf8");
    const document = await vscode.workspace.openTextDocument(filePath);
    return vscode.window.showTextDocument(document);
  }
  const document = await vscode.workspace.openTextDocument({
    language: "cpp",
    content
  });
  return vscode.window.showTextDocument(document);
}

async function closeEditor() {
  await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
}

async function queueQuickPicks(...answers) {
  await vscode.commands.executeCommand("edulcni.test.setQuickPickAnswers", answers);
}

async function run() {
  const extension = vscode.extensions.getExtension("local.edulcni");
  assert.ok(extension, "the development extension is available");
  await extension.activate();

  const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "edulcni-extension-host-"));
  try {
    const cursorEditor = await openDocument("void solve() {\n  // insertion point\n}\n");
    cursorEditor.selection = new vscode.Selection(1, 2, 1, 2);
    await vscode.commands.executeCommand("edulcni.modpow");
    const cursorText = cursorEditor.document.getText();
    assert.match(cursorText, /ll modpow\(/, "direct cursor command routes to modpow");
    assert.ok(cursorText.indexOf("ll modpow(") > cursorText.indexOf("void solve()"));
    assert.equal(cursorEditor.document.isDirty, true, "insertion leaves the buffer dirty");
    await closeEditor();

    const savedPath = path.join(tempDirectory, "saved.cpp");
    const globalEditor = await openDocument(
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {}\n",
      savedPath
    );
    await vscode.commands.executeCommand("edulcni.combinatorics");
    const insertedText = globalEditor.document.getText();
    assert.match(insertedText, /class Combinatorics/, "direct global command routes correctly");
    assert.ok(
      insertedText.indexOf("class Combinatorics") < insertedText.indexOf("int main"),
      "global insertion is placed before main"
    );
    assert.equal(globalEditor.document.isDirty, true);
    assert.equal(await globalEditor.document.save(), true, "document saves successfully");
    assert.equal(globalEditor.document.isDirty, false);
    await closeEditor();
    const reopened = await vscode.workspace.openTextDocument(savedPath);
    assert.equal(reopened.getText(), insertedText, "saved insertion survives reopen");

    const workflowEditor = await openDocument("int main() {}\n");
    await queueQuickPicks("Potential DSU");
    await vscode.commands.executeCommand("edulcni.connectivity_workflow");
    assert.match(
      workflowEditor.document.getText(),
      /class PotentialDsu/,
      "workflow command routes the selected choice"
    );
    await closeEditor();

    const cancellationPath = path.join(tempDirectory, "cancelled.cpp");
    const cancellationEditor = await openDocument("int main() {}\n", cancellationPath);
    const beforeCancellation = cancellationEditor.document.getText();
    await queueQuickPicks(undefined);
    await vscode.commands.executeCommand("edulcni.connectivity_workflow");
    assert.equal(cancellationEditor.document.getText(), beforeCancellation);
    assert.equal(cancellationEditor.document.isDirty, false, "cancellation performs no edit");
    await closeEditor();
  } finally {
    await fs.rm(tempDirectory, { recursive: true, force: true });
  }
}

module.exports = { run };

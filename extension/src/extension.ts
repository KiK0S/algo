import * as path from "path";
import * as vscode from "vscode";

type HeaderPickItem = vscode.QuickPickItem & {
  uri: vscode.Uri;
};

function toPosix(value: string): string {
  return value.replace(/\\/g, "/");
}

async function resolveBundledLibraryRoot(
  context: vscode.ExtensionContext
): Promise<vscode.Uri | undefined> {
  const bundledRoot = vscode.Uri.joinPath(context.extensionUri, "library");
  try {
    const stat = await vscode.workspace.fs.stat(bundledRoot);
    if (stat.type & vscode.FileType.Directory) {
      return bundledRoot;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

async function collectHeaders(root: vscode.Uri): Promise<vscode.Uri[]> {
  const files: vscode.Uri[] = [];
  const stack: vscode.Uri[] = [root];

  while (stack.length > 0) {
    const current = stack.pop()!;
    let entries: [string, vscode.FileType][];
    try {
      entries = await vscode.workspace.fs.readDirectory(current);
    } catch {
      continue;
    }

    for (const [name, type] of entries) {
      const child = vscode.Uri.joinPath(current, name);
      if (type & vscode.FileType.Directory) {
        stack.push(child);
        continue;
      }
      if ((type & vscode.FileType.File) && name.endsWith(".hpp")) {
        files.push(child);
      }
    }
  }

  return files;
}

function buildPickItems(
  root: vscode.Uri,
  uris: vscode.Uri[]
): HeaderPickItem[] {
  return uris
    .map((uri) => {
      const relativePath = toPosix(path.relative(root.fsPath, uri.fsPath));
      const directory = path.dirname(relativePath);
      return {
        label: path.basename(uri.fsPath),
        description: relativePath,
        detail: directory === "." ? "" : directory,
        uri
      };
    })
    .sort((a, b) => (a.description || "").localeCompare(b.description || ""));
}

async function insertHeaderAtCursor(
  context: vscode.ExtensionContext
): Promise<void> {
  const libraryRoot = await resolveBundledLibraryRoot(context);
  if (!libraryRoot) {
    vscode.window.showErrorMessage(
      "edulcni: bundled library not found. Run `npm run build` in `extension/`."
    );
    return;
  }

  const headers = await collectHeaders(libraryRoot);
  if (headers.length === 0) {
    vscode.window.showWarningMessage(
      "edulcni: no bundled .hpp files found in extension/library."
    );
    return;
  }

  const picked = await vscode.window.showQuickPick(
    buildPickItems(libraryRoot, headers),
    {
      title: "edulcni",
      placeHolder: "Type a header file name (auto-suggest) and press Enter to insert",
      matchOnDescription: true,
      matchOnDetail: true,
      ignoreFocusOut: true
    }
  );

  if (!picked) {
    return;
  }

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("edulcni: open a file and place the cursor first.");
    return;
  }

  const bytes = await vscode.workspace.fs.readFile(picked.uri);
  const content = Buffer.from(bytes).toString("utf8");
  const ok = await editor.edit((editBuilder) => {
    editBuilder.insert(editor.selection.active, content);
  });

  if (!ok) {
    vscode.window.showErrorMessage("edulcni: failed to insert header content.");
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(
    "edulcni.insertHeader",
    async () => {
      try {
        await insertHeaderAtCursor(context);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "unknown extension error";
        vscode.window.showErrorMessage(`edulcni: ${message}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate(): void {}

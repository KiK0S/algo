const tree = document.querySelector("#tree");
const search = document.querySelector("#search");
const details = document.querySelector("#details");
const preview = document.querySelector("#preview");
const copyButton = document.querySelector("#copy");
const archiveCount = document.querySelector("#archive-count");

let entries = [];
let selectedPath = "";

function asArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (value && typeof value === "object") {
    return Object.entries(value).map(([key, item]) => `${key}: ${item}`);
  }
  return [];
}

function text(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

function chips(title, values) {
  const items = asArray(values);
  if (items.length === 0) {
    return "";
  }
  return `
    <section class="detail-section">
      <h3>${text(title)}</h3>
      <div class="chips">${items.map((item) => `<span class="chip">${text(String(item))}</span>`).join("")}</div>
    </section>
  `;
}

function parameterNames(entry) {
  const values = [...asArray(entry.form), ...asArray(entry.bindings)];
  return [...new Set(values.map((value) =>
    typeof value === "string" ? value : value.id ?? value.name
  ).filter(Boolean))];
}

function parameterValues(entry, name) {
  const normalized = name.toLowerCase();
  if (normalized.includes("application")) return asArray(entry.applications);
  if (normalized.includes("feature")) return asArray(entry.features);
  if (normalized.includes("variant")) return asArray(entry.variants);
  if (normalized.includes("aggregate")) return asArray(entry.aggregators);
  if (normalized.includes("usage") || normalized.includes("wrapper")) return asArray(entry.wrappers);
  return [];
}

function renderDetails(entry) {
  const parameters = parameterNames(entry);
  details.innerHTML = `
    <p class="eyebrow">${text(entry.kind)}</p>
    <h2 class="entry-path">${text(entry.path)}</h2>
    <p class="description">${text(entry.description ?? "No description yet.")}</p>
    <div class="badges">
      <span class="badge primary">${entry.generator ? "interactive generator" : "static template"}</span>
      <span class="badge">${text(entry.insertMode ?? (entry.kind === "solver" ? "global" : "cursor"))} insertion</span>
      ${entry.generator ? `<span class="badge">generator: ${text(entry.generator)}</span>` : ""}
    </div>
    <section class="detail-section">
      <h3>Extension parameters</h3>
      ${parameters.length === 0
        ? '<p class="description">No interactive parameters; inserts directly from its template.</p>'
        : `<dl class="parameter-list">${parameters.map((name) => {
            const values = parameterValues(entry, name);
            return `<div class="parameter-row"><dt>${text(name)}</dt><dd>${
              values.length ? text(values.join(" · ")) : "value chosen in the extension"
            }</dd></div>`;
          }).join("")}</dl>`
      }
    </section>
    ${chips("Features", entry.features)}
    ${chips("Applications", entry.applications)}
    ${chips("Constraints", entry.constraints)}
    ${chips("Exports", entry.exports)}
  `;
  preview.textContent = entry.preview;
  copyButton.disabled = false;
}

function selectEntry(path) {
  const entry = entries.find((candidate) => candidate.path === path);
  if (!entry) return;
  selectedPath = path;
  renderDetails(entry);
  document.querySelectorAll(".tree button").forEach((button) => {
    button.classList.toggle("active", button.dataset.path === path);
  });
  history.replaceState(null, "", `#${encodeURIComponent(path)}`);
}

function renderTree(query = "") {
  const normalized = query.trim().toLowerCase();
  const filtered = entries.filter((entry) => {
    const haystack = [
      entry.path,
      entry.description,
      ...asArray(entry.features),
      ...asArray(entry.applications)
    ].join(" ").toLowerCase();
    return haystack.includes(normalized);
  });
  tree.replaceChildren();
  for (const kind of ["solver", "brick"]) {
    const group = filtered
      .filter((entry) => entry.kind === kind)
      .sort((left, right) => left.path.localeCompare(right.path));
    if (group.length === 0) continue;
    const container = document.createElement("details");
    container.open = true;
    const summary = document.createElement("summary");
    summary.textContent = `${kind}s · ${group.length}`;
    const list = document.createElement("div");
    list.className = "tree-list";
    for (const entry of group) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.path = entry.path;
      button.textContent = entry.path.split("/").at(-1);
      button.classList.toggle("active", selectedPath === entry.path);
      button.addEventListener("click", () => selectEntry(entry.path));
      list.append(button);
    }
    container.append(summary, list);
    tree.append(container);
  }
}

search.addEventListener("input", () => renderTree(search.value));
copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(preview.textContent);
  copyButton.textContent = "Copied";
  window.setTimeout(() => {
    copyButton.textContent = "Copy";
  }, 1200);
});

try {
  const response = await fetch("./archive.json");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  ({ entries } = await response.json());
  archiveCount.textContent = `${entries.length} extension entries`;
  renderTree();
  const requestedPath = decodeURIComponent(location.hash.slice(1));
  if (entries.some((entry) => entry.path === requestedPath)) {
    selectEntry(requestedPath);
  } else if (entries.length > 0) {
    selectEntry(entries[0].path);
  }
} catch (error) {
  archiveCount.textContent = "Archive unavailable";
  details.innerHTML = `<div class="empty-state"><h2>Could not load archive.json</h2><p>${text(String(error))}</p></div>`;
}

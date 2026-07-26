import { renderGenerator } from "./renderer.js";

const tree = document.querySelector("#tree");
const search = document.querySelector("#search");
const details = document.querySelector("#details");
const preview = document.querySelector("#preview");
const copyButton = document.querySelector("#copy");
const archiveCount = document.querySelector("#archive-count");

let entries = [];
let selectedPath = "";
const decisionState = new Map();

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
  const visualization = entry.visualization;
  details.innerHTML = `
    <p class="eyebrow">template</p>
    <h2 class="entry-path">${text(entry.path)}</h2>
    <p class="description">${text(entry.description ?? "No description yet.")}</p>
    <div class="badges">
      <span class="badge primary">${entry.generator ? "interactive generator" : "static template"}</span>
      <span class="badge">${text(entry.insertMode)} insertion</span>
      ${entry.generator ? `<span class="badge">generator: ${text(entry.generator)}</span>` : ""}
      ${visualization ? `<span class="badge">visualization: ${text(visualization.status)}</span>` : ""}
    </div>
    ${visualization ? `
      <section class="detail-section">
        <h3>Visualization</h3>
        <p class="description">${text(
          visualization.reason ??
          `${visualization.defaultGranularity ?? "operations"} granularity · ${visualization.layout ?? "single"} layout`
        )}</p>
        <div class="chips">${asArray(visualization.models).map(
          (model) => `<span class="chip">${text(String(model))}</span>`
        ).join("")}</div>
        ${(visualization.limitations ?? []).map(
          (limitation) => `<p class="description">${text(limitation)}</p>`
        ).join("")}
      </section>
    ` : ""}
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
    ${entry.applicationSpec ? '<section class="detail-section"><h3>Build preview</h3><div id="decisions" class="decisions"></div></section>' : ""}
    ${chips("Features", entry.features)}
    ${chips("Applications", entry.applications)}
    ${chips("Constraints", entry.constraints)}
    ${chips("Exports", entry.exports)}
  `;
  if (entry.applicationSpec) {
    renderDecisions(entry);
  } else {
    preview.textContent = entry.preview;
  }
  copyButton.disabled = false;
}

function decisionSteps(spec) {
  return [
    ...(spec.scenarios?.length ? [{ id: "scenario", label: "Application", choices: spec.scenarios }] : []),
    ...spec.decisions
  ];
}

function entryDecisionState(entry) {
  if (!decisionState.has(entry.path)) {
    decisionState.set(entry.path, { selections: {}, activeStep: 0 });
  }
  return decisionState.get(entry.path);
}

function updateGeneratedPreview(entry, state) {
  try {
    preview.textContent = renderGenerator(entry, state.selections);
  } catch (error) {
    preview.textContent = `// Preview cannot be rendered for this selection.\n// ${String(error)}`;
  }
}

function renderDecisions(entry) {
  const container = document.querySelector("#decisions");
  const state = entryDecisionState(entry);
  const steps = decisionSteps(entry.applicationSpec);
  const clearLaterSelections = (index) => {
    for (const laterStep of steps.slice(index + 1)) {
      delete state.selections[laterStep.id];
    }
  };
  container.replaceChildren();

  steps.forEach((step, index) => {
    const section = document.createElement("section");
    section.className = "decision-step";
    section.classList.toggle("active", index === state.activeStep);
    section.classList.toggle("pending", index > state.activeStep);

    const heading = document.createElement("h4");
    heading.textContent = `${index + 1}. ${step.label}`;
    section.append(heading);

    const choices = document.createElement("div");
    choices.className = "decision-choices";
    const selected = state.selections[step.id];
    for (const choice of step.choices) {
      const label = document.createElement("label");
      label.className = "decision-choice";
      const input = document.createElement("input");
      input.type = step.multi ? "checkbox" : "radio";
      input.name = `${entry.path}:${step.id}`;
      input.value = choice.id;
      input.disabled = index > state.activeStep;
      input.checked = step.multi
        ? Array.isArray(selected) && selected.includes(choice.id)
        : selected === choice.id;
      input.addEventListener("change", () => {
        if (step.multi) {
          if (index < state.activeStep) {
            clearLaterSelections(index);
            state.activeStep = index;
          }
          const picked = new Set(state.selections[step.id] ?? []);
          input.checked ? picked.add(choice.id) : picked.delete(choice.id);
          state.selections[step.id] = [...picked];
          updateGeneratedPreview(entry, state);
          renderDecisions(entry);
          return;
        }
        clearLaterSelections(index);
        state.selections[step.id] = choice.id;
        state.activeStep = Math.min(index + 1, steps.length - 1);
        updateGeneratedPreview(entry, state);
        renderDecisions(entry);
      });
      const content = document.createElement("span");
      content.innerHTML = `<strong>${text(choice.label)}</strong>${choice.description ? `<small>${text(choice.description)}</small>` : ""}`;
      label.append(input, content);
      choices.append(label);
    }
    section.append(choices);

    if (step.multi && index <= state.activeStep) {
      const continueButton = document.createElement("button");
      continueButton.type = "button";
      continueButton.className = "decision-continue";
      continueButton.textContent = index === steps.length - 1 ? "Apply" : "Continue";
      continueButton.addEventListener("click", () => {
        clearLaterSelections(index);
        state.selections[step.id] ??= [];
        state.activeStep = Math.min(index + 1, steps.length - 1);
        updateGeneratedPreview(entry, state);
        renderDecisions(entry);
      });
      section.append(continueButton);
    }
    container.append(section);
  });

  updateGeneratedPreview(entry, state);
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
      ...asArray(entry.applications),
      ...asArray(entry.visualization?.models),
      entry.visualization?.status
    ].join(" ").toLowerCase();
    return haystack.includes(normalized);
  });
  tree.replaceChildren();
  const group = filtered.sort((left, right) => left.path.localeCompare(right.path));
  if (group.length === 0) return;
  const container = document.createElement("details");
  container.open = true;
  const summary = document.createElement("summary");
  summary.textContent = `templates · ${group.length}`;
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

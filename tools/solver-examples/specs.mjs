import { createDynamicSpecsA } from "./dynamic-specs-a.mjs";
import { createDynamicSpecsB } from "./dynamic-specs-b.mjs";
import { createStaticSpecs } from "./static-specs.mjs";

export function createSolverExampleSpecs(core) {
  return [
    ...createDynamicSpecsA(core),
    ...createDynamicSpecsB(core),
    ...createStaticSpecs(core)
  ];
}

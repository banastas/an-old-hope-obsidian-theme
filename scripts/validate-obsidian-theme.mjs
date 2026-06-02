import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const manifestPath = path.join(root, "manifest.json");
const cssPath = path.join(root, "theme.css");

const requiredManifestFields = ["name", "version", "minAppVersion", "author"];
const requiredPalette = [
  "#1c1d21",
  "#f8f8f2",
  "#eb3d54",
  "#ef7c2b",
  "#e7ce57",
  "#78bc65",
  "#50b4d8",
  "#7851a9"
];
const requiredSelectors = [
  ".theme-dark",
  ".theme-light",
  ".markdown-source-view.mod-cm6",
  ".markdown-rendered",
  ".callout",
  ".graph-view",
  ".canvas-node"
];
const requiredVariables = [
  "--background-primary",
  "--background-secondary",
  "--text-normal",
  "--text-muted",
  "--interactive-accent",
  "--link-color",
  "--code-background",
  "--graph-node",
  "--canvas-background"
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkBalancedCss(css) {
  let braces = 0;
  let inString = false;
  let quote = "";
  let inComment = false;

  for (let index = 0; index < css.length; index += 1) {
    const char = css[index];
    const next = css[index + 1];

    if (inComment) {
      if (char === "*" && next === "/") {
        inComment = false;
        index += 1;
      }
      continue;
    }

    if (inString) {
      if (char === "\\" && next) {
        index += 1;
      } else if (char === quote) {
        inString = false;
        quote = "";
      }
      continue;
    }

    if (char === "/" && next === "*") {
      inComment = true;
      index += 1;
      continue;
    }

    if (char === "\"" || char === "'") {
      inString = true;
      quote = char;
      continue;
    }

    if (char === "{") braces += 1;
    if (char === "}") braces -= 1;

    assert(braces >= 0, `Unexpected closing brace near byte ${index}.`);
  }

  assert(!inComment, "CSS ends inside a comment.");
  assert(!inString, "CSS ends inside a string.");
  assert(braces === 0, `CSS has unbalanced braces: ${braces}.`);
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const css = await readFile(cssPath, "utf8");

for (const field of requiredManifestFields) {
  assert(typeof manifest[field] === "string" && manifest[field].trim(), `manifest.json is missing ${field}.`);
}

assert(manifest.name === "An Old Hope", `manifest.json name should be "An Old Hope", found "${manifest.name}".`);
assert(/^\d+\.\d+\.\d+$/.test(manifest.version), "manifest.json version must be semver-like, e.g. 1.0.0.");
assert(/^1\./.test(manifest.minAppVersion), "minAppVersion should target Obsidian 1.x for the modern theme format.");

checkBalancedCss(css);

for (const color of requiredPalette) {
  assert(css.toLowerCase().includes(color), `theme.css is missing original palette color ${color}.`);
}

for (const selector of requiredSelectors) {
  assert(css.includes(selector), `theme.css is missing selector ${selector}.`);
}

for (const variable of requiredVariables) {
  assert(css.includes(variable), `theme.css is missing variable ${variable}.`);
}

assert(!/obsidian\.css/i.test(css), "theme.css should not refer to the legacy obsidian.css theme file.");
assert(css.split("\n").length > 500, "theme.css looks too small for the complete Obsidian port.");

console.log("Obsidian theme validation passed.");

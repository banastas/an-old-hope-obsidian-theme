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

const contrastPairs = [
  {
    label: "dark readable purple",
    selector: ".theme-dark",
    variable: "--old-hope-purple-readable",
    background: "#1c1d21"
  },
  {
    label: "light readable purple",
    selector: ".theme-light",
    variable: "--old-hope-purple-readable",
    background: "#fbfbf8"
  }
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function relativeLuminance(hex) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    );

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function readHexVariable(css, selector, variable) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = css.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`));
  assert(block, `theme.css is missing the ${selector} block.`);

  const value = block[1].match(new RegExp(`${variable}:\\s*(#[0-9a-f]{6})`, "i"));
  assert(value, `${selector} is missing a hex value for ${variable}.`);
  return value[1].toLowerCase();
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

for (const { label, selector, variable, background } of contrastPairs) {
  const foreground = readHexVariable(css, selector, variable);
  const ratio = contrastRatio(foreground, background);
  assert(
    ratio >= 4.5,
    `${label} must meet WCAG AA contrast; ${foreground} on ${background} is ${ratio.toFixed(2)}:1.`
  );
}

const modeScopedBoldRoles = css.match(/--bold-color: var\(--old-hope-purple-readable\)/g) ?? [];
assert(
  modeScopedBoldRoles.length === 2,
  "Bold prose should use the readable purple role in both theme modes."
);

assert(!/obsidian\.css/i.test(css), "theme.css should not refer to the legacy obsidian.css theme file.");
assert(css.split("\n").length > 500, "theme.css looks too small for the complete Obsidian port.");

console.log("Obsidian theme validation passed.");

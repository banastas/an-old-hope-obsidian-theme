# An Old Hope

> A clean test note for reviewing the An Old Hope Obsidian theme.

## Theme At A Glance

An Old Hope is built for notes that need to stay readable while still showing structure. Headings carry the warm yellow from the original palette, subsection titles use orange, links stay cyan, inline code stays green, and **bold emphasis uses purple** so important phrases stand out without turning dense notes into a wall of alarm color.

### Field Note

- Review `theme.css` and the Obsidian `manifest.json`.
- Link between [[Theme Notes]] and [Obsidian](https://obsidian.md) without losing scanability.
- Use tags like #theme, #obsidian, and #syntax for small metadata surfaces.
- Mark decisions with ==highlight== only when they need to survive a skim.

> [!tip]
> The best screenshot should show the theme working as a real note, not as a color legend.

## Markdown Surfaces

### Lists, Links, And Inline Code

- Draft a note in `theme.css`.
- Link to [[An Old Hope]] and [Obsidian](https://obsidian.md).
- Tag the release with #theme #obsidian #syntax.
- Track completion:
  - [x] Port palette
  - [x] Style Markdown
  - [ ] Capture screenshot

### Quote

> The right theme should make structure visible without making every sentence compete for attention.

### Table

| Surface | Palette Role | Example |
| --- | --- | --- |
| Heading | Yellow | Primary document structure |
| Link | Cyan | Internal and external navigation |
| Bold | Purple | Long-form emphasis |
| Inline code | Green | `const theme = "An Old Hope"` |
| Warning | Red | Error and danger callouts |

## Callouts

> [!note]
> Notes use cyan for calm context and supporting detail.

> [!tip]
> Tips use green for useful next actions.

> [!warning]
> Warnings use yellow when something deserves attention but is not broken.

> [!danger]
> Danger callouts use red for real problems.

> [!example]
> Examples use purple to match constants and bold emphasis.

## Code

```js
const palette = {
  background: "#1C1D21",
  foreground: "#F8F8F2",
  keyword: "#EB3D54",
  string: "#50B4D8",
  function: "#E7CE57",
  variable: "#78BC65",
  constant: "#7851A9",
  accent: "#EF7C2B"
};

function applyTheme(name) {
  return `Loaded ${name}`;
}
```

## Release Notes

**An Old Hope for Obsidian** adapts the VS Code and Sublime ports into a full Obsidian theme: editor, reading view, sidebars, callouts, graph, canvas, tags, tables, and syntax highlighting.

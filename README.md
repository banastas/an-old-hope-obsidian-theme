# An Old Hope for Obsidian

A dark Obsidian theme inspired by a galaxy far, far away, porting the An Old Hope palette to modern Obsidian with styled Markdown, callouts, graph view, canvas, and editor syntax.

## Preview

An Old Hope keeps the original editor theme's backbone: deep charcoal backgrounds, warm off-white text, red keywords/actions, cyan links and strings, yellow headings/functions, green Markdown/code accents, orange accents, purple constants, and purple bold emphasis.

## Install

### Manual install

1. Download this repository.
2. Copy `manifest.json` and `theme.css` into this folder in your vault:

   ```text
   <your-vault>/.obsidian/themes/An Old Hope/
   ```

3. Restart Obsidian if this is the first install or if `manifest.json` changed.
4. Open `Settings -> Appearance -> Themes` and choose `An Old Hope`.

### Development install

From your vault's theme directory, clone the repository into a folder named exactly `An Old Hope`:

```sh
cd /path/to/your-vault/.obsidian/themes
git clone https://github.com/banastas/an-old-hope-obsidian-theme.git "An Old Hope"
```

Obsidian expects the theme folder name to match the `name` in `manifest.json`.

## Files

- `manifest.json`: Obsidian theme metadata.
- `theme.css`: the complete Obsidian theme.
- `scripts/validate-obsidian-theme.mjs`: a lightweight validation check for the theme package.

## Development

Run the validation check before publishing:

```sh
npm test
```

The validator checks that the manifest matches the expected Obsidian theme shape, the original An Old Hope palette is present, key Obsidian selectors and variables exist, and the CSS has balanced braces/comments/strings.

## Credits

The An Old Hope palette began with [Jesse Leite's original Atom syntax theme](https://github.com/jesseleite/an-old-hope-syntax-atom). Bill Anastas used that Atom theme as the base for the [VS Code and Sublime ports](https://github.com/banastas/an-old-hope-theme), and this Obsidian version was created from those ports.

This repository adapts that lineage for Obsidian's modern theme CSS, including the app shell, Markdown editor, reading view, callouts, graph view, canvas, and editor syntax.

## License

MIT

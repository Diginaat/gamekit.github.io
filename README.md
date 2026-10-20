# GameKit Docs

User documentation for GameKit, the modular first-person systems in `GameClient/addons/gamekit_*`.
The site is built with [docsify](https://docsify.js.org): plain Markdown in `docs/`, no build step.

## View the docs

Double-click `serve.bat`, or run any static file server **from this folder** (`gamekit-docs`, not `docs`):

```bash
python -m http.server 3000 --directory docs
```

Then open http://localhost:3000. Or, with Node: `npx docsify-cli serve docs`.

To publish on GitHub Pages: push this folder to a repository and set **Settings > Pages** to the
`docs/` folder.

## Edit the docs

| File | Purpose |
| --- | --- |
| `docs/index.html` | docsify setup (theme, plugins) |
| `docs/_sidebar.md` | Navigation |
| `docs/README.md` | Home page |
| `docs/<section>/*.md` | Pages |
| `docs/images/` | Screenshots |

Add a page: create the `.md` file and add a line to `_sidebar.md`. Links between pages are relative to
`docs/`, for example `[Ladders](world/ladders.md)`.

The C# in `docs/examples/` was compiled against GameKit and the jump pad, AI walker and wall run were run
in a test world when these docs were written. When GameKit's API changes, check the examples again.

# Sebastian Chirinos — Portfolio

Personal portfolio for Sebastian Arley Chirinos Negrón, full-stack engineer and software architect.

The page is built around one argument: everyone has the same code generator now, so the
differentiator is who can defend the decisions. Evidence first, method last. It leads with
shipped systems, then the decision records and the concepts under them, then the
fundamentals, then the tools, and only at the end how AI fits into the work.

**Live:** https://sebastian-cn-portfolio.vercel.app

## Stack

React 19 · Vite 8 · Tailwind CSS v4 · Framer Motion · Lucide · Oxlint · Vercel

## Getting started

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production bundle into `dist/` |
| `npm run preview` | Serves the built bundle locally |
| `npm run lint` | Oxlint over `src/` |
| `npm run og` | Regenerates `public/og.png`, the 1200x630 share card |
| `npm run images` | Rebuilds the served WebP variants from `assets/source/` |
| `npm run screenshots -- <dir>` | Imports a folder of per-project screenshots, then runs `images` |
| `npm run assets` | Both of the above |

## Structure

```
src/
  components/      One file per page section
  context/
    AppContext.jsx Provider: theme + language state
    app-context.js Context object and the useAppContext hook
  data/
    portfolioData.js    English content
    portfolioDataEs.js  Spanish content (same export shape)
    caseStudies.js      Long-form write-ups, English
    caseStudiesEs.js    Long-form write-ups, Spanish
    translations.js     UI strings for both languages
    imageManifest.json  Generated: slides per project, with size and caption
  lib/
    router.js      Home vs /case-studies/<slug>
    cv.js          CV path and download filename, shared by hero and footer
  index.css        Design tokens and the neobrutalist component classes

assets/source/     Full-size originals, one folder per project. Never served.
scripts/           generate-og.mjs, optimize-images.mjs
```

## Editing content

All copy lives in `src/data/`. The two portfolio data files export the same names, so anything
added to one must be added to the other or the language toggle will render `undefined`.

- `personalData` — identity, positioning line, hero stats
- `orchestrationData` — the five-phase loop and the delegated/never-delegated split
- `decisionLog` — architecture decision records. Beyond context, options, decision and
  trade-off, each one carries `concept` and `theory` (the named idea underneath),
  `atScale` (where it breaks at ten times the size) and `verified` (how it was checked).
  A record without those four still renders; it just says less.
- `projectsData` — projects, each with the key decision behind it
- `techStackData` — tool list, rendered below the fundamentals in the same section
- `engineeringPrinciples` — each area carries `concepts` (named theory) and `evidence`
  plus an `adr` id, so nothing in it is an unbacked claim
- `caseStudies` / `caseStudiesEs` — long-form pieces at `/case-studies/<slug>`

Project categories are derived from `projectsData`, so a new category appears as a filter
automatically.

A project with a `caseStudy` key gets a link to `/case-studies/<slug>`, and that slug must exist
in both `caseStudies.js` and `caseStudiesEs.js`. A project may omit `liveUrl` and `repoUrl`; the
card renders without those buttons, which is the normal shape of client work.

## Images

Every project has a screenshot carousel. The source screenshots live in
`assets/source/projects/<project-id>/` (one folder per project, named after its `id` in
`projectsData`) and are never served. Each image in a folder becomes one slide:

```
assets/source/projects/
  lo-exacto/
    01-home.png          -> slide 1, caption "home"
    02-catalogo.png      -> slide 2, caption "catalogo"
    03.png               -> slide 3, no caption
  boom-pos/
    ...
```

- **Order** follows the file names with natural sorting, so prefix them `01-`, `02-`, … to set it.
- **Captions** come from the name: `02-panel_admin.png` is captioned "panel admin". A name
  without a number prefix (for example `Captura de pantalla 2026-09-01.png`) gets no caption.
- **Formats:** PNG, JPG, WebP or AVIF, at any size. Desktop captures taller than 16:9 are cropped
  to the top of the page; phone captures in portrait are shown whole, centred.

Then run `npm run images`. It emits two WebP widths per slide into `public/projects/<id>/`
plus the portrait variants, and writes each slide's intrinsic size and caption to
`src/data/imageManifest.json` so the carousel reserves its space before the file arrives.
A new project only needs a folder whose name matches its `id`.

To bring in a whole set of captures at once, point `npm run screenshots` at a folder with one
sub-folder per project:

```bash
npm run screenshots -- "C:\Users\me\Pictures\Screenshots\PROJECTS-PORTFOLIO"
```

Sub-folders are matched by the `ALIASES` map in `scripts/import-screenshots.mjs` (`BOOM-POS`,
`CALITOP`, `GEOTOP`, `GEOTOP-CERT`, `LO-EXACTO`, `REVOLT`, `ANEMIVISION`) or by project id. A
matched project's gallery is replaced with that folder's images, keeping their file names; a
project with no folder keeps its current gallery. Then it rebuilds the served images.

## Theming

`src/index.css` defines the tokens. `--ink` carries text, borders and the hard shadows and flips
with the theme; `--on-accent` stays dark in both themes and is the foreground for anything on a
bright accent fill. Add the `on-accent` class to any element you give an accent background.

Component classes live inside `@layer components` so Tailwind utilities applied in markup still
win. Moving them out of that layer silently breaks every `bg-*` override.

The theme is applied by an inline script in `index.html` before first paint, then persisted to
`localStorage` under `portfolio-theme`; language uses `portfolio-lang`.

## Notes

- The contact form composes a `mailto:` link in the visitor's own client. There is no backend and
  no third-party form service, and the form says so.
- Entry animations are skipped entirely when the visitor has `prefers-reduced-motion` set.
- Nothing that carries content starts at `opacity: 0`. Reveals animate position only, so a fast
  or programmatic scroll that never fires the observer still leaves the section readable.
- Fonts are requested as variable `wght` ranges, not discrete weights. Asking for the weights
  individually pulled 75 `@font-face` rules and a file per weight.

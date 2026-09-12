# Sebastian Chirinos — Portfolio

Personal portfolio for Sebastian Arley Chirinos Negrón, full-stack engineer and software architect.

The page is built around one argument: everyone has the same code generator now, so the
differentiator is who owns the decisions. It leads with an operating model, backs it with
architecture decision records, and only then lists the stack.

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
    imageManifest.json  Generated: intrinsic size of each preview image
  lib/
    router.js      Home vs /case-studies/<slug>
    cv.js          CV path and download filename, shared by hero and footer
  index.css        Design tokens and the neobrutalist component classes

assets/source/     Full-size originals. Never served; input to npm run images.
scripts/           generate-og.mjs, optimize-images.mjs
```

## Editing content

All copy lives in `src/data/`. The two portfolio data files export the same names, so anything
added to one must be added to the other or the language toggle will render `undefined`.

- `personalData` — identity, positioning line, hero stats
- `orchestrationData` — the five-phase loop and the delegated/never-delegated split
- `decisionLog` — architecture decision records: context, options, decision, trade-off
- `projectsData` — projects, each with the key decision behind it
- `techStackData`, `engineeringPrinciples`

Project categories are derived from `projectsData`, so a new category appears as a filter
automatically.

A project with a `caseStudy` key gets a link to `/case-studies/<slug>`, and that slug must exist
in both `caseStudies.js` and `caseStudiesEs.js`. A project may omit `liveUrl` and `repoUrl`; the
card renders without those buttons, which is the normal shape of client work.

## Images

Full-size screenshots live in `assets/source/` and are never served. `npm run images` emits two
WebP widths per project into `public/projects/` plus the portrait variants, and writes the
intrinsic dimensions to `src/data/imageManifest.json` so cards reserve their space before the
file arrives. To add a project image, drop the original in `assets/source/`, add it to the
`PROJECTS` map in `scripts/optimize-images.mjs`, and rerun the script.

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

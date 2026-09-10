# Sebastian Chirinos — Portfolio

Personal portfolio for Sebastian Arley Chirinos Negrón, Systems Engineer and software architect.

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
    translations.js     UI strings for both languages
  index.css        Design tokens and the neobrutalist component classes
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
automatically. Preview images go in `public/` and are referenced by absolute path.

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

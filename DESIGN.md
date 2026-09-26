# Design — Bottle & Brass (v2)

The portfolio's argument is that the differentiator is owning the decisions, not generating code.
The visual world follows the subject: an engineer's computation pad by day, bottle glass under a
desk lamp by night, and one drawn moment that *is* the argument — the decision log grown as a tree.

## Palette

| Role | Light | Dark | Notes |
|---|---|---|---|
| Canvas | `#eef2ea` | `#07231a` | Pale engineering-pad green / deep bottle |
| Raised paper | `#f8faf5` | `#0c2f24` | Cards, panels |
| Ink | `#0e2a21` | `#e8efe5` | Text |
| Ink soft | `#3f5a4f` | `#a6bbb0` | Secondary text (7.4:1 on canvas) |
| Bottle | `#0f4a36` | same | Brand regions: hero, decision callout, owned split, contact |
| Brass | `#c9973a` | `#d8a84c` | Actions and the tree. Text on brass is `#0b2a20` (6.9:1) |
| Mint | `#74d3a4` | same | Live / available signal only |

Tokens live in `src/index.css`. The old names (`--ink`, `--bg-color`, `--card-color`,
`--muted-color`, `--accent`, `--on-accent`) are kept and re-pointed. `.bottle-region` re-points
them again inside a bottle area, so anything placed there reads without extra classes.

## Type

- **Bricolage Grotesque** (opsz/wdth/wght variable): headings and figures. Display tracking -0.035 to -0.04em, max 6rem.
- **Geist**: body and UI.
- **Geist Mono**: only for data — ADR ids, domains, counters.

Labels are sentence case; no kicker labels above headings, no section numbering except the
operating loop, which is a real sequence.

## Shape and depth

Hairline borders (`--line`), radius by hierarchy (8 / 12 / 18 / 26px), soft layered shadows
(`--shadow-sm|md|lg`). No hard offset shadows.

## Motion

One ease everywhere: `cubic-bezier(0.16, 1, 0.3, 1)`.

- **Focal moment:** the hero decision tree draws itself (trunk, then branches staggered, then the
  rejected-option twigs and the brass nodes). Hover/focus lights a branch and names the decision;
  a node links to `#adr-00x`, which opens that record in the ledger.
- **Continuity:** sliding indicators (`layoutId`) in the nav, project filters, stack tabs and the
  ADR index; the ADR panel crossfades; the reading-progress hairline under the nav.
- **Reveal:** project galleries rise into place with a single brass glint; the operating loop's
  line fills with scroll. Content is visible by default — reveals move things, they never hide them.
- **Feedback:** button lift/press, icon nudges, count-up stats.
- Everything collapses to instant under `prefers-reduced-motion`; the galleries start paused.

## Layouts kept switchable

`PROJECT_LAYOUT` in `src/components/Projects.jsx`: `'split'` (default) or `'showcase'`.

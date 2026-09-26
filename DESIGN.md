# Design — Clay (v3)

Claymorphism: every surface is a soft, inflated slab lit from the top left, and every control
squishes into the page when pressed. Same data as every other version; only layout, tokens and
motion change.

## Palette

| Role | Light | Dark |
|---|---|---|
| Ground (lavender mist) | `#eeeaf7` | `#1b1730` |
| Clay slab | `#faf8ff` | `#282245` |
| Pressed well | `#e5e0f3` | `#201b39` |
| Ink (indigo) | `#26204a` | `#f0ebff` |
| Ink soft | `#5a5382` | `#b6addb` |
| Violet — the only action colour | `#6b58e6` (white text, 5.1:1) | `#9585ff` (dark text) |
| Peach / Butter / Sky / Lilac / Rose | `#ffb49b` `#ffdb7d` `#9ed6ff` `#cfc2ff` `#ffabcd` | slightly deeper |

Pastels tag roles (stats, decision tiles, trade-off, status), never decoration alone. Text on a
pastel is always indigo.

## The clay recipe (`src/index.css`)

- `.clay` — four shadows: soft drop to the lower right, faint glow to the upper left, and two
  insets (shine on the upper edge, shade on the lower). The insets make it puffy.
- `.clay-violet|peach|butter|sky|lilac|rose` — coloured slabs; each re-tunes its own inset shade.
- `.clay-well` — the pressed-in surface: inputs, tracks, the selected tile.
- `.clay-press` / `.neo-btn` — hover lifts with overshoot, press squishes (`scale(.96)` + insets).

Radii by hierarchy: 12 / 18 / 28 / 40px, pills for controls.

## Type

**Fredoka** (rounded, width axis) for headings and figures, **DM Sans** for text,
**JetBrains Mono** only for ids and counters. Sentence-case labels, no kicker labels.

## Layout

- Top bar for identity and settings; a floating clay **dock** at the bottom for the sections.
- Hero as a **bento**: identity slab, portrait on lilac, four coloured figure slabs, rotating one-liners.
- Projects: each one is a big clay slab with the framed gallery (autoplay) beside its text.
- Decisions: seven coloured tiles (a swipeable row on phones); the chosen one sinks, its record opens below.
- Fundamentals as clay cards; the stack as pressable keycaps; the loop on a clay track that fills with scroll.

## Motion

Springs everywhere (`stiffness 160–460`), overshoot on hover (`--ease-squish`). Slabs pop into
place on first view but start visible. Ambient pastel blobs drift behind the page. The dock puck,
filters and tabs slide with `layoutId`. Everything is instant under `prefers-reduced-motion`.

`PROJECT_LAYOUT` in `src/components/Projects.jsx` still switches `'split'` (default) and `'showcase'`.

# Design — Clay (v3)

Claymorphism: every surface is a soft, inflated slab lit from the top left, and every control
squishes into the page when pressed. Same data as every other version; only layout, tokens and
motion change.

## Palette

Sober and professional: cool stone neutrals, navy-charcoal ink, one deep cobalt for actions, and
four muted clays for roles.

| Role | Light | Dark |
|---|---|---|
| Ground (cool stone) | `#e8eaee` | `#11151c` |
| Clay slab | `#f5f6f8` | `#1a2029` |
| Pressed well | `#dde1e7` | `#141920` |
| Ink (navy-charcoal) | `#141c28` | `#e7ebf1` |
| Ink soft | `#4a5566` | `#9ba6b6` |
| Cobalt — the only action colour | `#1f4bb8` (white text, 7.1:1) | `#6f95ff` (dark text) |
| Sand / Amber / Steel / Slate / Stone | `#e4d8c4` `#e0bb6c` `#c2cfdf` `#cdd3dc` `#d8d3cc` | muted, deeper |

The muted clays tag roles (figures, decision tiles, trade-off, status), never decoration alone.
Text on them is always the ink colour.

## The clay recipe (`src/index.css`)

- `.clay` — four shadows: soft drop to the lower right, faint glow to the upper left, and two
  insets (shine on the upper edge, shade on the lower). The insets make it puffy.
- `.clay-accent|sand|amber|steel|slate|stone` — coloured slabs; each re-tunes its own inset shade.
- `.clay-well` — the pressed-in surface: inputs, tracks, the selected tile.
- `.clay-press` / `.neo-btn` — hover lifts with overshoot, press squishes (`scale(.96)` + insets).

Radii by hierarchy: 12 / 18 / 28 / 40px, pills for controls.

## Type

**Fredoka** (rounded, width axis) for headings and figures, **DM Sans** for text,
**JetBrains Mono** only for ids and counters. Sentence-case labels, no kicker labels.

## Layout

- Top bar for identity and settings; a floating clay **dock** at the bottom for the sections.
- Hero as a **bento**: identity slab, portrait on slate, four coloured figure slabs, rotating one-liners.
- Projects: each one is a big clay slab with the framed gallery (autoplay) beside its text.
- Decisions: seven coloured tiles (a swipeable row on phones); the chosen one sinks, its record opens below.
- Fundamentals as clay cards; the stack as pressable keycaps; the loop on a clay track that fills with scroll.

## Motion

Springs everywhere (`stiffness 160–460`), overshoot on hover (`--ease-squish`). Slabs pop into
place on first view but start visible. Ambient muted blobs drift behind the page. The dock puck,
filters and tabs slide with `layoutId`. Everything is instant under `prefers-reduced-motion`.

`PROJECT_LAYOUT` in `src/components/Projects.jsx` still switches `'split'` (default) and `'showcase'`.

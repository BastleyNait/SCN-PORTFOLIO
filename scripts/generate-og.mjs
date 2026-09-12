/**
 * Renders public/og.png, the 1200x630 card every scraper asks for when the
 * portfolio URL is pasted into LinkedIn, WhatsApp or an email client.
 *
 * The card is drawn in the same visual language as the site: off-white ground,
 * thick black frame, one green accent block, large type. It is generated rather
 * than hand-exported so the copy can never drift from the data file.
 *
 *   node scripts/generate-og.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(root, 'public/og.png');

const WIDTH = 1200;
const HEIGHT = 630;

const INK = '#1a1a1a';
const BG = '#fffdf7';
const ACCENT = '#27f5a9';
const MUTED = '#4a4a4a';

/* Escapes the five characters that would otherwise break the SVG document. */
const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const NAME = 'Sebastian Chirinos';
const ROLE = 'Full-Stack Engineer · React, Next.js & Python';
const FACTS = '7 systems in production · Arequipa, Peru · UTC-5';

/* Segoe UI is the Windows default and Arial is the universal fallback, so the
   card renders identically whether it is built locally or on a Linux runner. */
const SANS = "Segoe UI, Arial, Helvetica, DejaVu Sans, sans-serif";
const MONO = "Consolas, Courier New, DejaVu Sans Mono, monospace";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>

  <g stroke="${INK}" stroke-width="1" opacity="0.07">
    ${Array.from({ length: Math.ceil(WIDTH / 40) }, (_, i) => `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="${HEIGHT}"/>`).join('')}
    ${Array.from({ length: Math.ceil(HEIGHT / 40) }, (_, i) => `<line x1="0" y1="${i * 40}" x2="${WIDTH}" y2="${i * 40}"/>`).join('')}
  </g>

  <rect x="28" y="28" width="${WIDTH - 56}" height="${HEIGHT - 56}" fill="none" stroke="${INK}" stroke-width="10"/>

  <rect x="76" y="96" width="296" height="44" fill="${ACCENT}" stroke="${INK}" stroke-width="4"/>
  <text x="94" y="127" font-family="${MONO}" font-size="22" font-weight="700" fill="#14120f" letter-spacing="2">
    AVAILABLE FOR WORK
  </text>

  <text x="76" y="258" font-family="${SANS}" font-size="88" font-weight="800" fill="${INK}" letter-spacing="-2">
    ${esc(NAME)}
  </text>

  <rect x="76" y="296" width="640" height="14" fill="${ACCENT}"/>

  <text x="76" y="390" font-family="${SANS}" font-size="42" font-weight="600" fill="${INK}">
    ${esc(ROLE)}
  </text>

  <text x="76" y="472" font-family="${MONO}" font-size="27" font-weight="500" fill="${MUTED}">
    ${esc(FACTS)}
  </text>

  <rect x="76" y="516" width="${WIDTH - 152}" height="4" fill="${INK}" opacity="0.18"/>

  <text x="76" y="570" font-family="${MONO}" font-size="24" font-weight="600" fill="${INK}">
    sebastian-cn-portfolio.vercel.app
  </text>
</svg>`;

await mkdir(dirname(OUT), { recursive: true });
const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile(OUT, png);

const meta = await sharp(png).metadata();
console.log(`og.png written: ${meta.width}x${meta.height}, ${(png.length / 1024).toFixed(1)} kB`);
if (meta.width !== WIDTH || meta.height !== HEIGHT) {
  console.error(`expected ${WIDTH}x${HEIGHT}`);
  process.exit(1);
}

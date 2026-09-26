/**
 * Renders public/og.png, the 1200x630 card every scraper asks for when the
 * portfolio URL is pasted into LinkedIn, WhatsApp or an email client.
 *
 * The card is drawn in the same visual language as the site: a stone
 * ground, a big clay slab for the name and four muted clay chips. It is generated rather
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

const INK = '#141c28';
const BG = '#e8eaee';
const ACCENT = '#1f4bb8';
const MUTED = '#4a5566';

/* Escapes the five characters that would otherwise break the SVG document. */
const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const ROLE = 'Full-Stack Engineer · React, Next.js & Python';

/* Segoe UI is the Windows default and Arial is the universal fallback, so the
   card renders identically whether it is built locally or on a Linux runner. */
const SANS = "Segoe UI, Arial, Helvetica, DejaVu Sans, sans-serif";

/* A clay slab: drop shadow, then the slab, then a soft highlight band on its
   upper half. Close enough to the CSS version at share-card size. */
const slab = (x, y, w, h, r, fill, shadow = 'rgba(24,36,58,0.25)') => `
  <rect x="${x + 14}" y="${y + 18}" width="${w}" height="${h}" rx="${r}" fill="${shadow}" filter="url(#soft)"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>
  <rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h * 0.45}" rx="${r - 6}" fill="#ffffff" opacity="0.28"/>`;

const CHIPS = [
  ['7 systems', '#1f4bb8', '#ffffff'],
  ['7 decisions', '#e4d8c4', INK],
  ['4 domains', '#c2cfdf', INK],
  ['5 languages', '#cdd3dc', INK]
];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter>
    <filter id="blob" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60"/></filter>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
  <circle cx="120" cy="80" r="220" fill="#c2cfdf" filter="url(#blob)" opacity="0.7"/>
  <circle cx="1120" cy="540" r="240" fill="#e4d8c4" filter="url(#blob)" opacity="0.6"/>

  ${slab(60, 60, 1080, 380, 48, '#f5f6f8')}

  <circle cx="118" cy="128" r="9" fill="${ACCENT}"/>
  <text x="138" y="137" font-family="${SANS}" font-size="26" font-weight="700" fill="${INK}">Available for work</text>

  <text x="104" y="262" font-family="${SANS}" font-size="100" font-weight="800" fill="${INK}" letter-spacing="-2">Sebastian Chirinos</text>
  <text x="108" y="330" font-family="${SANS}" font-size="34" font-weight="600" fill="${ACCENT}">${esc(ROLE)}</text>
  <text x="108" y="392" font-family="${SANS}" font-size="26" font-weight="500" fill="${MUTED}">Arequipa, Peru · UTC-5 · sebastian-cn-portfolio.vercel.app</text>

  ${CHIPS.map(([label, fill, ink], i) => {
    const x = 60 + i * 276;
    return `${slab(x, 474, 252, 104, 36, fill)}
      <text x="${x + 126}" y="538" text-anchor="middle" font-family="${SANS}" font-size="30" font-weight="800" fill="${ink}">${label}</text>`;
  }).join('')}
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

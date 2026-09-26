/**
 * Renders public/og.png, the 1200x630 card every scraper asks for when the
 * portfolio URL is pasted into LinkedIn, WhatsApp or an email client.
 *
 * The card is drawn in the same visual language as the site: bottle-green
 * ground ruled like an engineering pad, ivory type, brass for the decision tree. It is generated rather
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

const INK = '#eef4ea';
const BG = '#0f4a36';
const ACCENT = '#c9973a';
const MUTED = 'rgba(238,244,234,0.74)';

/* Escapes the five characters that would otherwise break the SVG document. */
const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const ROLE = 'Full-Stack Engineer · React, Next.js & Python';
const FACTS = '7 systems in production · Arequipa, Peru · UTC-5';

/* Segoe UI is the Windows default and Arial is the universal fallback, so the
   card renders identically whether it is built locally or on a Linux runner. */
const SANS = "Segoe UI, Arial, Helvetica, DejaVu Sans, sans-serif";
const MONO = "Consolas, Courier New, DejaVu Sans Mono, monospace";

/* A small version of the hero's decision tree on the right of the card. */
const TREE = (() => {
  const rootX = 1000, rootY = 470;
  const branches = Array.from({ length: 7 }, (_, i) => {
    const deg = -160 + (140 / 6) * i;
    const rad = (deg * Math.PI) / 180;
    const reach = i % 2 === 0 ? 170 : 140;
    const x = rootX + Math.cos(rad) * reach;
    const y = rootY + Math.sin(rad) * reach * 1.55;
    const fy = 410 - (i % 3) * 14;
    return `<path d="M ${rootX} ${fy} C ${rootX + (x - rootX) * 0.08} ${fy - 60}, ${x - (x - rootX) * 0.3} ${y + 50}, ${x} ${y}" stroke="${ACCENT}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="${x}" cy="${y}" r="8" fill="${ACCENT}" stroke="${BG}" stroke-width="3"/>`;
  }).join('');
  return `<path d="M ${rootX} ${rootY - 30} L ${rootX} 400" stroke="${ACCENT}" stroke-width="4" stroke-linecap="round"/>
    ${branches}
    <circle cx="${rootX}" cy="${rootY}" r="30" fill="#0a3327" stroke="${ACCENT}" stroke-width="4"/>
    <text x="${rootX}" y="${rootY + 9}" text-anchor="middle" font-family="${SANS}" font-size="24" font-weight="700" fill="${INK}">SC</text>`;
})();

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="glow" cx="85%" cy="0%" r="90%">
      <stop offset="0%" stop-color="#74d3a4" stop-opacity="0.22"/>
      <stop offset="60%" stop-color="#74d3a4" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <g stroke="${INK}" stroke-width="1" opacity="0.06">
    ${Array.from({ length: Math.ceil(WIDTH / 30) }, (_, i) => `<line x1="${i * 30}" y1="0" x2="${i * 30}" y2="${HEIGHT}"/>`).join('')}
    ${Array.from({ length: Math.ceil(HEIGHT / 30) }, (_, i) => `<line x1="0" y1="${i * 30}" x2="${WIDTH}" y2="${i * 30}"/>`).join('')}
  </g>

  <circle cx="86" cy="120" r="7" fill="#74d3a4"/>
  <text x="104" y="128" font-family="${SANS}" font-size="24" font-weight="500" fill="${INK}">Available for work</text>

  <text x="72" y="262" font-family="${SANS}" font-size="92" font-weight="800" fill="${INK}" letter-spacing="-3">Sebastian</text>
  <text x="72" y="352" font-family="${SANS}" font-size="92" font-weight="800" fill="${INK}" letter-spacing="-3">Chirinos</text>

  <text x="76" y="424" font-family="${SANS}" font-size="32" font-weight="500" fill="${ACCENT}">
    ${esc(ROLE)}
  </text>

  <text x="76" y="478" font-family="${SANS}" font-size="26" font-weight="400" fill="${MUTED}">
    ${esc(FACTS)}
  </text>

  <text x="76" y="572" font-family="${MONO}" font-size="22" font-weight="600" fill="${INK}" opacity="0.85">
    sebastian-cn-portfolio.vercel.app
  </text>

  ${TREE}
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

/**
 * Turns the full-size screenshots in assets/source into the WebP variants the
 * site actually serves.
 *
 * The originals are 2500px-wide PNGs weighing up to 2 MB each, shipped at full
 * size to every phone. Each one becomes two WebP widths so the browser can pick,
 * and the emitted manifest gives the components the intrinsic dimensions they
 * need to reserve layout space and avoid shifting.
 *
 *   node scripts/optimize-images.mjs
 */
import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = resolve(root, 'assets/source');
const OUT_DIR = resolve(root, 'public/projects');

/* Card art is cropped to a wide banner, so 640 covers a phone at 1x and 1280
   covers a two-column desktop card at 2x. A third width buys nothing here. */
const PROJECT_WIDTHS = [640, 1280];
const QUALITY = 78;

/* source file -> published basename, which matches the project id in the data
   file so the component can derive both URLs from one string. */
const PROJECTS = {
  'lo-exacto.png': 'lo-exacto',
  'calitop.png': 'calitop-services',
  'revolt.png': 'revolt-laptop',
  'boom-pos.png': 'boom-pos',
  'anemivision.png': 'anemivision'
};

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} kB`;

async function build() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const available = await readdir(SOURCE_DIR);
  const manifest = {};
  let sourceBytes = 0;
  let outputBytes = 0;

  for (const [file, base] of Object.entries(PROJECTS)) {
    if (!available.includes(file)) {
      throw new Error(`missing source image: assets/source/${file}`);
    }

    const input = join(SOURCE_DIR, file);
    sourceBytes += (await stat(input)).size;

    const meta = await sharp(input).metadata();
    const ratio = meta.height / meta.width;

    for (const width of PROJECT_WIDTHS) {
      const height = Math.round(width * ratio);
      const out = join(OUT_DIR, `${base}-${width}.webp`);
      const buffer = await sharp(input)
        .resize({ width, height, fit: 'cover' })
        .webp({ quality: QUALITY, effort: 6 })
        .toBuffer();
      await writeFile(out, buffer);
      outputBytes += buffer.length;
      console.log(`  ${base}-${width}.webp`.padEnd(36), kb(buffer.length));
    }

    /* The largest variant defines the intrinsic box the markup declares. */
    manifest[base] = {
      width: PROJECT_WIDTHS.at(-1),
      height: Math.round(PROJECT_WIDTHS.at(-1) * ratio)
    };
  }

  /* The portrait is a 2048px square rendered into a ~340px box. Two widths
     cover 1x and 2x; the JPEG stays because structured data references it. */
  const portrait = join(SOURCE_DIR, 'profile.jpg');
  sourceBytes += (await stat(portrait)).size;

  for (const width of [400, 800]) {
    const buffer = await sharp(portrait)
      .resize({ width, height: width, fit: 'cover' })
      .webp({ quality: 82, effort: 6 })
      .toBuffer();
    await writeFile(resolve(root, `public/profile-${width}.webp`), buffer);
    outputBytes += buffer.length;
    console.log(`  profile-${width}.webp`.padEnd(36), kb(buffer.length));
  }

  const jpeg = await sharp(portrait)
    .resize({ width: 800, height: 800, fit: 'cover' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  await writeFile(resolve(root, 'public/profile.jpg'), jpeg);
  outputBytes += jpeg.length;
  console.log('  profile.jpg'.padEnd(36), kb(jpeg.length));

  await writeFile(
    resolve(root, 'src/data/imageManifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );

  console.log(`\nsource ${kb(sourceBytes)} -> served ${kb(outputBytes)}`);
}

await build();

/**
 * Turns the full-size screenshots in assets/source into the WebP variants the
 * site actually serves.
 *
 * Every project owns a folder, assets/source/projects/<project-id>/, and every
 * image inside it becomes one slide of that project's carousel. Order follows
 * the file names (natural sort, so 2 comes before 10), which means renaming a
 * file to 01-, 02-, 03- is all it takes to reorder a gallery. A name shaped
 * like "02-admin-panel.png" also yields the caption "admin panel"; a name
 * without a number prefix gets no caption.
 *
 * Each slide becomes two WebP widths so the browser can pick, and the emitted
 * manifest gives the carousel the intrinsic dimensions it needs to reserve
 * layout space and avoid shifting.
 *
 *   node scripts/optimize-images.mjs
 */
import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = resolve(root, 'assets/source');
const PROJECTS_SOURCE = join(SOURCE_DIR, 'projects');
const OUT_DIR = resolve(root, 'public/projects');

/* The carousel stage is ~680px wide beside the text on a desktop and full
   width on a phone; the lightbox goes up to 1280. 640 covers a phone at 1x
   and the stage at ~1x, 1280 covers the stage at 2x and the lightbox. */
const PROJECT_WIDTHS = [640, 1280];
const QUALITY = 78;

/* A desktop screenshot taller than 16:9 is a scrolled page, and the stage is
   16:9, so everything below the fold would be letterboxed into a thumbnail.
   Keep the top. Phone screenshots are cropped only past 9:20, the tallest
   real handset ratio, so a full-page mobile capture does not become a sliver. */
const MAX_LANDSCAPE_RATIO = 9 / 16;
const MAX_PORTRAIT_RATIO = 20 / 9;

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} kB`;
const naturalSort = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

/** "02-admin_panel.png" -> "admin panel". Screenshot-tool names such as
 *  "Screenshot 2026-09-01 101010.png" carry no numeric prefix and no caption. */
function captionFrom(file) {
  const match = file.slice(0, -extname(file).length).match(/^\d+[\s._-]+(.+)$/);
  return match ? match[1].replace(/[_-]+/g, ' ').trim() : null;
}

async function listDirs(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort(naturalSort);
}

async function build() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const manifest = {};
  let sourceBytes = 0;
  let outputBytes = 0;

  for (const project of await listDirs(PROJECTS_SOURCE)) {
    const dir = join(PROJECTS_SOURCE, project);
    const files = (await readdir(dir))
      .filter((file) => IMAGE_EXT.has(extname(file).toLowerCase()))
      .sort(naturalSort);

    if (files.length === 0) {
      console.warn(`  ${project}: no images, skipped`);
      continue;
    }

    await mkdir(join(OUT_DIR, project), { recursive: true });
    manifest[project] = [];

    for (const [index, file] of files.entries()) {
      const input = join(dir, file);
      sourceBytes += (await stat(input)).size;

      /* rotate() applies EXIF orientation before the dimensions are read, so
         a phone photo is measured the way it is displayed. */
      const oriented = await sharp(input).rotate().toBuffer();
      const { width: srcW, height: srcH } = await sharp(oriented).metadata();
      const portrait = srcH > srcW;
      const maxRatio = portrait ? MAX_PORTRAIT_RATIO : MAX_LANDSCAPE_RATIO;
      const ratio = Math.min(srcH / srcW, maxRatio);
      const cropH = Math.round(srcW * ratio);

      /* Slide files are numbered, not named after the source, so a screenshot
         called "Captura de pantalla (3).png" never leaks into a URL. */
      const name = String(index + 1).padStart(2, '0');

      for (const targetW of PROJECT_WIDTHS) {
        /* Portrait art is displayed at the stage height, not its width, so it
           is sized against the same 16:9 box a landscape slide fills. */
        const width = portrait
          ? Math.min(srcW, Math.round((targetW * 9) / 16 / ratio))
          : Math.min(srcW, targetW);
        const buffer = await sharp(oriented)
          .extract({ left: 0, top: 0, width: srcW, height: cropH })
          .resize({ width })
          .webp({ quality: QUALITY, effort: 6 })
          .toBuffer();
        await writeFile(join(OUT_DIR, project, `${name}-${targetW}.webp`), buffer);
        outputBytes += buffer.length;
        console.log(`  ${project}/${name}-${targetW}.webp`.padEnd(44), kb(buffer.length));
      }

      /* The largest variant defines the intrinsic box the markup declares. */
      const largestW = portrait
        ? Math.min(srcW, Math.round((PROJECT_WIDTHS.at(-1) * 9) / 16 / ratio))
        : Math.min(srcW, PROJECT_WIDTHS.at(-1));
      manifest[project].push({
        file: name,
        width: largestW,
        height: Math.round(largestW * ratio),
        caption: captionFrom(file)
      });
    }
  }

  /* The portrait is a 2048px square rendered into a ~340px box. Two widths
     cover 1x and 2x; the JPEG stays because structured data references it. */
  const portraitFile = join(SOURCE_DIR, 'profile.jpg');
  sourceBytes += (await stat(portraitFile)).size;

  for (const width of [400, 800]) {
    const buffer = await sharp(portraitFile)
      .resize({ width, height: width, fit: 'cover' })
      .webp({ quality: 82, effort: 6 })
      .toBuffer();
    await writeFile(resolve(root, `public/profile-${width}.webp`), buffer);
    outputBytes += buffer.length;
    console.log(`  profile-${width}.webp`.padEnd(44), kb(buffer.length));
  }

  const jpeg = await sharp(portraitFile)
    .resize({ width: 800, height: 800, fit: 'cover' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  await writeFile(resolve(root, 'public/profile.jpg'), jpeg);
  outputBytes += jpeg.length;
  console.log('  profile.jpg'.padEnd(44), kb(jpeg.length));

  await writeFile(
    resolve(root, 'src/data/imageManifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );

  const slides = Object.values(manifest).reduce((sum, list) => sum + list.length, 0);
  console.log(`\n${Object.keys(manifest).length} projects, ${slides} slides`);
  console.log(`source ${kb(sourceBytes)} -> served ${kb(outputBytes)}`);
}

await build();

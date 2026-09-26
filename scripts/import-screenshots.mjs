/**
 * Copies a folder of project screenshots into assets/source/projects and
 * rebuilds the served images, so a new set of captures is one command away:
 *
 *   npm run screenshots -- "C:\Users\me\Pictures\Screenshots\PROJECTS-PORTFOLIO"
 *
 * The source holds one sub-folder per project. Its name is matched against
 * ALIASES (case-insensitive) or taken as a project id directly. A project
 * that has a folder there gets its gallery replaced by that folder's images;
 * a project without one keeps the gallery it already has. File names are kept,
 * so slide order and captions follow the rules in optimize-images.mjs.
 */
import { copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectsData } from '../src/data/portfolioData.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = resolve(root, 'assets/source/projects');
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

/* Folder name as it exists on disk -> project id in projectsData. */
const ALIASES = {
  'lo-exacto': 'lo-exacto',
  'calitop': 'calitop-services',
  'geotop': 'geotop-aqp',
  'geotop-cert': 'geotop-certificates',
  'boom-pos': 'boom-pos',
  'revolt': 'revolt-laptop',
  'anemivision': 'anemivision'
};

const source = process.argv[2];
if (!source) {
  console.error('usage: npm run screenshots -- "<folder with one sub-folder per project>"');
  process.exit(1);
}

const ids = new Set(projectsData.map((project) => project.id));
const entries = await readdir(resolve(source), { withFileTypes: true });
const imported = [];

for (const entry of entries.filter((e) => e.isDirectory())) {
  const key = entry.name.toLowerCase();
  const id = ALIASES[key] ?? (ids.has(key) ? key : null);

  if (!id || !ids.has(id)) {
    console.warn(`  ${entry.name}: no project matches this folder, skipped`);
    continue;
  }

  const from = join(resolve(source), entry.name);
  const files = (await readdir(from)).filter((file) => IMAGE_EXT.has(extname(file).toLowerCase()));
  if (files.length === 0) {
    console.warn(`  ${entry.name}: no images inside, ${id} keeps its current gallery`);
    continue;
  }

  const to = join(TARGET, id);
  await rm(to, { recursive: true, force: true });
  await mkdir(to, { recursive: true });
  for (const file of files) await copyFile(join(from, file), join(to, file));

  imported.push(id);
  console.log(`  ${entry.name} -> ${id}`.padEnd(40), `${files.length} images`);
}

const untouched = [...ids].filter((id) => !imported.includes(id));
if (untouched.length) console.log(`\nkept as they were: ${untouched.join(', ')}`);

console.log('\nrebuilding the served images...\n');
await import('./optimize-images.mjs');

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ExternalLink, Sparkles, Eye, GitBranch, UserCog } from 'lucide-react';
import { Github } from './Icons';
import { useAppContext } from '../context/app-context';
import imageManifest from '../data/imageManifest.json';

/* Widths emitted by scripts/optimize-images.mjs. Keep the two in step. */
const PREVIEW_WIDTHS = [640, 1280];

/* A card is full width on a phone and roughly half the 1152px content column
   on a desktop, so the browser has what it needs to skip the 1280 variant on
   small screens instead of downloading it and throwing the pixels away. */
const PREVIEW_SIZES = '(max-width: 767px) 100vw, 560px';

const TECH_TAG_COLORS = [
  'var(--accent)',
  'var(--accent-lime)',
  'var(--accent-blue)',
  'var(--accent-pink)',
  'var(--accent-orange)',
  'var(--accent-purple)'
];

const ALL = '__all__';

/** Production reads green; anything else reads as a distinct build type. */
function statusColor(status) {
  const value = (status || '').toLowerCase();
  if (value.startsWith('prod')) return 'var(--accent-lime)';
  if (value.includes('ai')) return 'var(--accent-pink)';
  return 'var(--accent-blue)';
}

export default function Projects() {
  const { t, data } = useAppContext();
  const projectsData = data.projectsData;
  const reduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState(ALL);

  /* Categories come from the project data itself, so a new project can never
     end up in a filter that silently matches nothing. */
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(projectsData.map((project) => project.category)))],
    [projectsData]
  );

  const visibleProjects = activeCategory === ALL
    ? projectsData
    : projectsData.filter((project) => project.category === activeCategory);

  return (
    <section id="projects" className="py-20 relative z-10 bg-[var(--bg-color)]" aria-labelledby="projects-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col items-center text-center mb-14">
          <div className="neo-section-label mb-4">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>{t.projects.portfolio}</span>
          </div>

          <h2
            id="projects-title"
            className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4 text-[var(--ink)] text-balance"
          >
            {t.projects.featured}
          </h2>

          <p className="text-[var(--muted-color)] text-sm sm:text-base max-w-2xl leading-relaxed">
            {t.projects.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8" role="group" aria-label={t.projects.featured}>
            {categories.map((category) => {
              const isActive = activeCategory === category;
              const label = category === ALL ? t.projects.allCategories : category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={isActive}
                  className={`px-4 py-2 text-xs sm:text-sm font-heading font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer border-2 border-[var(--ink)] ${
                    isActive
                      ? 'bg-[var(--accent)] text-[var(--on-accent)] shadow-[4px_4px_0px_var(--ink)] -translate-x-px -translate-y-px'
                      : 'bg-[var(--card-color)] text-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] hover:shadow-[3px_3px_0px_var(--ink)] hover:-translate-x-px hover:-translate-y-px'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <motion.ul layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project) => (
              <motion.li
                key={project.id}
                layout
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3 }}
                className="neo-card flex flex-col overflow-hidden group"
              >
                {/* Preview with a browser chrome affordance */}
                <div className="relative w-full border-b-[3px] border-[var(--ink)]">
                  <div className="h-8 bg-[var(--bg-color)] border-b-2 border-[var(--ink)] px-3 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-red)] border-2 border-[var(--ink)]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] border-2 border-[var(--ink)]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-lime)] border-2 border-[var(--ink)]" />
                    </span>

                    <span className="font-mono text-[10px] text-[var(--ink)] font-semibold truncate bg-[var(--card-color)] px-2 py-0.5 border border-[var(--ink)]">
                      {project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : `${project.id}.apk`}
                    </span>

                    <span className="w-4 shrink-0" aria-hidden="true" />
                  </div>

                  <div className="relative w-full h-48 bg-[var(--bg-color)] overflow-hidden">
                    <ProjectPreview project={project} />

                    <span
                      className="absolute bottom-3 right-3 z-10 neo-tag on-accent shadow-[2px_2px_0px_var(--ink)] text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: statusColor(project.status) }}
                    >
                      {project.status}
                    </span>

                    <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 flex items-center justify-center z-20">
                      <a
                        href={project.liveUrl || project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neo-btn bg-[var(--accent)] text-[var(--on-accent)] text-xs py-2 px-4"
                      >
                        <Eye className="w-4 h-4" aria-hidden="true" />
                        <span>{t.projects.viewProject}</span>
                      </a>
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-heading font-black text-xl text-[var(--ink)] leading-tight">
                      {project.title}
                    </h3>
                    <span className="neo-tag text-[10px] font-semibold shrink-0">
                      {project.category}
                    </span>
                  </div>

                  <p className="text-[var(--muted-color)] text-xs sm:text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* The decision behind the project, given more weight than the stack */}
                  <div className="bg-[var(--bg-color)] border-2 border-[var(--ink)] p-3 mb-4">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted-color)] mb-1.5 flex items-center gap-1.5">
                      <GitBranch className="w-3 h-3" aria-hidden="true" />
                      {t.projects.decisionLabel}
                    </p>
                    <p className="text-[var(--ink)] text-xs leading-relaxed font-medium">
                      {project.keyDecision}
                    </p>
                  </div>

                  <p className="font-mono text-[10px] text-[var(--muted-color)] uppercase tracking-wider mb-4 flex items-start gap-1.5">
                    <UserCog className="w-3 h-3 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>
                      <span className="font-black">{t.projects.roleLabel}:</span> {project.role}
                    </span>
                  </p>

                  <div className="mt-auto">
                    <ul className="flex flex-wrap gap-1.5 mb-4 list-none p-0">
                      {project.tech.map((tech, index) => (
                        <li
                          key={tech}
                          className="neo-tag on-accent text-[10px] font-bold shadow-[2px_2px_0px_var(--ink)]"
                          style={{ backgroundColor: TECH_TAG_COLORS[index % TECH_TAG_COLORS.length] }}
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>

                    <div className="border-t-2 border-dashed border-[var(--ink)] my-3" />

                    <div className="flex items-center gap-2 pt-1">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neo-btn flex-1 bg-[var(--accent)] text-[var(--on-accent)] text-xs py-2 px-3 border-2 shadow-[3px_3px_0px_var(--ink)]"
                        >
                          <span>{t.projects.liveDemo}</span>
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      )}

                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={t.projects.viewCode}
                        className={`neo-btn bg-[var(--card-color)] text-[var(--ink)] text-xs py-2 px-3 border-2 shadow-[3px_3px_0px_var(--ink)] ${
                          project.liveUrl ? '' : 'flex-1'
                        }`}
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>{t.projects.repo}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {visibleProjects.length === 0 && (
          <p className="text-center text-[var(--muted-color)] font-mono text-sm mt-10">
            {t.projects.empty}
          </p>
        )}

      </div>
    </section>
  );
}

/* Serves the narrow variant to phones and the wide one to desktops, and states
   the intrinsic box so the card never resizes once the file arrives. */
function ProjectPreview({ project }) {
  const base = project.previewImage;
  const intrinsic = imageManifest[base];

  if (!base || !intrinsic) return null;

  return (
    <img
      src={`/projects/${base}-${PREVIEW_WIDTHS.at(-1)}.webp`}
      srcSet={PREVIEW_WIDTHS.map((w) => `/projects/${base}-${w}.webp ${w}w`).join(', ')}
      sizes={PREVIEW_SIZES}
      width={intrinsic.width}
      height={intrinsic.height}
      alt={`${project.title} preview`}
      loading="lazy"
      decoding="async"
      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
    />
  );
}

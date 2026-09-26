import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Sparkles, GitBranch, UserCog, FileText } from 'lucide-react';
import { Github } from './Icons';
import { useAppContext } from '../context/app-context';
import { CASE_STUDY_PREFIX } from '../lib/router';
import ProjectGallery from './ProjectGallery';

const ALL = '__all__';

export default function Projects({ onOpenCaseStudy }) {
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
    <section id="projects" className="py-14 relative z-10 bg-[var(--bg-color)]" aria-labelledby="projects-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col items-center text-center mb-12">
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

          <p className="text-[var(--muted-color)] text-sm sm:text-base max-w-2xl leading-relaxed text-pretty">
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
                      ? 'bg-[var(--accent)] text-[var(--on-accent)] shadow-[3px_3px_0px_var(--ink)] -translate-x-px -translate-y-px'
                      : 'bg-[var(--card-color)] text-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] hover:shadow-[3px_3px_0px_var(--ink)] hover:-translate-x-px hover:-translate-y-px'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* One project per row. The gallery gets the wider column because the
            screenshots are the evidence; the text says what to look for in them.
            Rows alternate sides on a desktop so the page reads as a sequence of
            pieces rather than one long list with a picture glued to the left. */}
        <motion.ol layout className="list-none p-0 m-0">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleProjects.map((project, i) => (
              <motion.li
                key={project.id}
                layout
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={i > 0 ? 'border-t-2 border-dashed border-[var(--ink)]/30 pt-12 mt-12 lg:pt-16 lg:mt-16' : ''}
              >
                <ProjectRow
                  project={project}
                  position={i + 1}
                  total={visibleProjects.length}
                  flipped={i % 2 === 1}
                  onOpenCaseStudy={onOpenCaseStudy}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ol>

        {visibleProjects.length === 0 && (
          <p className="text-center text-[var(--muted-color)] font-mono text-sm mt-10">
            {t.projects.empty}
          </p>
        )}

      </div>
    </section>
  );
}

function ProjectRow({ project, position, total, flipped, onOpenCaseStudy }) {
  const { t } = useAppContext();
  const headingId = `project-${project.id}-title`;

  return (
    <article aria-labelledby={headingId} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <div className={`lg:col-span-7 ${flipped ? 'lg:order-2' : ''}`}>
        <ProjectGallery project={project} priority={position === 1} />
      </div>

      <div className={`lg:col-span-5 flex flex-col ${flipped ? 'lg:order-1' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-sm font-black tabular-nums text-[var(--ink)]">
            {String(position).padStart(2, '0')}
            <span className="text-[var(--muted-color)] font-semibold"> / {String(total).padStart(2, '0')}</span>
          </span>
          <span className="h-px flex-1 bg-[var(--ink)] opacity-30" aria-hidden="true" />
          <span className="neo-tag text-[10px] font-semibold">{project.category}</span>
        </div>

        <h3
          id={headingId}
          className="font-heading font-black text-3xl sm:text-4xl text-[var(--ink)] leading-[1.05] tracking-tight mb-3 text-balance"
        >
          {project.title}
        </h3>

        <p className="text-[var(--ink)] text-base leading-relaxed mb-2 text-pretty font-medium">
          {project.description}
        </p>
        <p className="text-[var(--muted-color)] text-sm leading-relaxed mb-6 text-pretty">
          {project.longDescription}
        </p>

        {/* The decision behind the project, given more weight than the stack */}
        <div className="border-l-4 border-[var(--accent)] pl-4 mb-5">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted-color)] mb-1.5 flex items-center gap-1.5">
            <GitBranch className="w-3 h-3" aria-hidden="true" />
            {t.projects.decisionLabel}
          </p>
          <p className="text-[var(--ink)] text-sm leading-relaxed font-semibold">
            {project.keyDecision}
          </p>
        </div>

        <p className="font-mono text-[10px] text-[var(--muted-color)] uppercase tracking-wider mb-4 flex items-start gap-1.5">
          <UserCog className="w-3 h-3 mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            <span className="font-black">{t.projects.roleLabel}:</span> {project.role}
          </span>
        </p>

        <ul className="flex flex-wrap gap-1.5 mb-6 list-none p-0" aria-label="Stack">
          {project.tech.map((tech) => (
            <li key={tech} className="neo-tag text-[10px] font-semibold">
              {tech}
            </li>
          ))}
        </ul>

        {/* A project can be missing either link: a client system has no public
            site and no public repo. Render only what exists, and let the one
            that is there carry the primary style. */}
        <div className="flex flex-wrap items-stretch gap-2.5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn bg-[var(--accent)] text-[var(--on-accent)] text-xs py-3 px-5 shadow-[3px_3px_0px_var(--ink)] group/visit"
            >
              <span>{t.projects.visitSite}</span>
              <ArrowUpRight
                className="w-4 h-4 transition-transform duration-150 group-hover/visit:translate-x-0.5 group-hover/visit:-translate-y-0.5"
                aria-hidden="true"
              />
              <span className="sr-only">{t.projects.opensInNewTab}</span>
            </a>
          )}

          {project.caseStudy && (
            <a
              href={`${CASE_STUDY_PREFIX}${project.caseStudy}`}
              onClick={(event) => {
                /* Let the browser handle new-tab and modified clicks. */
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
                event.preventDefault();
                onOpenCaseStudy(project.caseStudy);
              }}
              className={`neo-btn text-xs py-3 px-4 ${
                project.liveUrl
                  ? 'bg-[var(--card-color)] text-[var(--ink)]'
                  : 'bg-[var(--ink)] text-[var(--bg-color)]'
              }`}
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>{t.projects.caseStudyShort}</span>
            </a>
          )}

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={t.projects.viewCode}
              className="neo-btn bg-[var(--card-color)] text-[var(--ink)] text-xs py-3 px-4"
            >
              <Github className="w-4 h-4" />
              <span>{t.projects.repo}</span>
              <span className="sr-only">{t.projects.opensInNewTab}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

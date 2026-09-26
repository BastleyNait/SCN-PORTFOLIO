import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, FileText } from 'lucide-react';
import { Github } from './Icons';
import { useAppContext } from '../context/app-context';
import { CASE_STUDY_PREFIX } from '../lib/router';
import ProjectGallery, { ProjectShowcase } from './ProjectGallery';
import SectionHeader from './SectionHeader';
import { toSentence } from '../lib/text';

const ALL = '__all__';

/* Two ways to present a project, kept side by side so the page can switch
   between them with one word:
   'showcase' - the screenshots fill the card and the text sits over them.
   'split'    - a framed gallery beside a column of text. */
const PROJECT_LAYOUT = 'split';

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
    <section id="projects" className="py-20 lg:py-28 relative z-10 bg-[var(--bg-color)]" aria-labelledby="projects-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader id="projects-title" title={t.projects.featured} description={t.projects.description}>
          {/* Filters: a segmented control whose brass thumb slides to the
              chosen category instead of blinking between buttons. */}
          <div
            className="mt-7 inline-flex flex-wrap gap-1 p-1 rounded-2xl bg-[var(--sunk-color)] border border-[var(--line)]"
            role="group"
            aria-label={t.projects.featured}
          >
            {categories.map((category) => {
              const isActive = activeCategory === category;
              const label = category === ALL ? t.projects.allCategories : category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={isActive}
                  className="relative px-4 py-2 text-sm font-medium rounded-xl cursor-pointer"
                >
                  {isActive && (
                    <motion.span
                      layoutId="project-filter"
                      className="absolute inset-0 rounded-xl bg-[var(--card-color)] shadow-[var(--shadow-sm)] border border-[var(--line)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className={`relative z-10 inline-flex items-center gap-2 transition-colors ${isActive ? 'text-[var(--ink)]' : 'text-[var(--muted-color)] hover:text-[var(--ink)]'}`}>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />}
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </SectionHeader>

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
                className={i === 0 ? '' : PROJECT_LAYOUT === 'showcase'
                  ? 'mt-10 lg:mt-14'
                  : 'pt-16 mt-16 lg:pt-24 lg:mt-24 border-t border-[var(--line)]'}
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
          <p className="text-center text-[var(--muted-color)] text-sm mt-10">
            {t.projects.empty}
          </p>
        )}

      </div>
    </section>
  );
}

function ProjectRow({ project, position, flipped, onOpenCaseStudy }) {
  const headingId = `project-${project.id}-title`;
  const compact = PROJECT_LAYOUT === 'showcase';
  const details = (
    <ProjectDetails
      project={project}
      headingId={headingId}
      compact={compact}
      onOpenCaseStudy={onOpenCaseStudy}
    />
  );

  if (compact) {
    return (
      <article aria-labelledby={headingId}>
        <ProjectShowcase project={project} priority={position === 1} flipped={flipped}>
          {details}
        </ProjectShowcase>
      </article>
    );
  }

  return (
    <article aria-labelledby={headingId} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
      <RevealGallery className={`lg:col-span-7 ${flipped ? 'lg:order-2' : ''}`} flipped={flipped}>
        <ProjectGallery project={project} priority={position === 1} />
      </RevealGallery>
      <div className={`lg:col-span-5 flex flex-col ${flipped ? 'lg:order-1' : ''}`}>
        {details}
      </div>
    </article>
  );
}

/* The evidence arrives: the gallery rises and tilts flat into place, and a
   brass glint crosses it once. The gallery is visible throughout; the motion
   only moves it, so a scroll that outruns the observer still shows it. */
function RevealGallery({ className, flipped, children }) {
  const reduceMotion = useReducedMotion();
  const [seen, setSeen] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      initial={reduceMotion ? false : { y: 48, rotate: flipped ? 1.2 : -1.2 }}
      whileInView={{ y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      onViewportEnter={() => setSeen(true)}
    >
      {children}
      <span className="absolute inset-0 overflow-hidden rounded-[var(--radius-lg)] pointer-events-none" aria-hidden="true">
        <span className={`glint ${seen && !reduceMotion ? 'is-on' : ''}`} />
      </span>
    </motion.div>
  );
}

/* Title, description, key decision, role, stack and links. The showcase
   drops the long description: over a screenshot, less text is what keeps
   the screenshot visible. */
function ProjectDetails({ project, headingId, compact, onOpenCaseStudy }) {
  const { t } = useAppContext();

  return (
    <>
      <p className="flex flex-wrap items-center gap-2 mb-4 text-sm">
        <span className="text-[var(--muted-color)]">{project.category}</span>
        <span className="w-1 h-1 rounded-full bg-[var(--line-strong)]" aria-hidden="true" />
        <span className="inline-flex items-center gap-1.5 text-[var(--ink)] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--mint)]" aria-hidden="true" />
          {project.status}
        </span>
      </p>

      <h3
        id={headingId}
        className={`font-heading font-bold text-[var(--ink)] leading-[1] tracking-[-0.035em] mb-4 text-balance ${
          compact ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-[2.4rem] sm:text-5xl'
        }`}
      >
        {project.title}
      </h3>

      <p className={`text-[var(--ink)] text-[17px] leading-relaxed text-pretty ${compact ? 'mb-5 max-w-xl' : 'mb-3'}`}>
        {project.description}
      </p>
      {!compact && (
        <p className="text-[var(--muted-color)] text-[15px] leading-relaxed mb-7 text-pretty">
          {project.longDescription}
        </p>
      )}

      {/* The decision behind the project, given more weight than the stack. */}
      <div className="relative rounded-[var(--radius-md)] bg-[var(--sunk-color)] px-5 py-4 mb-6">
        <p className="text-[13px] text-[var(--muted-color)] mb-1.5">{toSentence(t.projects.decisionLabel)}</p>
        <p className="font-heading text-[17px] font-semibold text-[var(--ink)] leading-snug tracking-[-0.01em]">
          {project.keyDecision}
        </p>
      </div>

      <p className="text-[13px] text-[var(--muted-color)] mb-3">
        <span className="text-[var(--ink)] font-medium">{toSentence(t.projects.roleLabel)}</span>
        <span className="mx-2" aria-hidden="true">—</span>
        {project.role}
      </p>

      <ul className="flex flex-wrap gap-1.5 mb-8 list-none p-0" aria-label="Stack">
        {project.tech.map((tech) => (
          <li key={tech} className="neo-tag">{tech}</li>
        ))}
      </ul>

      {/* A project can be missing either link: a client system has no public
          site and no public repo. Render only what exists, and let the first
          one that is there carry the primary style. */}
      <div className="flex flex-wrap items-center gap-2.5">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn btn-brass group/visit"
          >
            <span>{toSentence(t.projects.visitSite)}</span>
            <ArrowUpRight
              className="w-4 h-4 transition-transform duration-300 group-hover/visit:translate-x-0.5 group-hover/visit:-translate-y-0.5"
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
            className={`neo-btn ${project.liveUrl ? 'btn-ghost' : 'btn-brass'}`}
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
            className="neo-btn btn-ghost"
          >
            <Github className="w-4 h-4" />
            <span>{toSentence(t.projects.repo)}</span>
            <span className="sr-only">{t.projects.opensInNewTab}</span>
          </a>
        )}
      </div>
    </>
  );
}

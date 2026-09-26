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
    <section id="projects" className="py-16 lg:py-24 relative z-10" aria-labelledby="projects-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader id="projects-title" title={t.projects.featured} description={t.projects.description}>
          {/* Filters: a segmented control whose violet puck slides to the
              chosen category instead of blinking between buttons. */}
          <div
            className="mt-8 inline-flex flex-wrap gap-1 p-1.5 clay-well !rounded-full"
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
                  className="relative px-4 py-2.5 text-sm font-semibold rounded-full cursor-pointer"
                >
                  {isActive && (
                    <motion.span
                      layoutId="project-filter"
                      className="absolute inset-0 rounded-full clay clay-violet"
                      transition={{ type: 'spring', stiffness: 460, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 transition-colors ${isActive ? 'text-[var(--on-accent)]' : 'text-[var(--muted-color)] hover:text-[var(--ink)]'}`}>
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
                  : 'mt-8 lg:mt-10'}
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
    <RevealCard>
      <article aria-labelledby={headingId} className="clay !rounded-[var(--radius-xl)] p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
        <div className={`lg:col-span-7 ${flipped ? 'lg:order-2' : ''}`}>
          <ProjectGallery project={project} priority={position === 1} />
        </div>
        <div className={`lg:col-span-5 flex flex-col px-2 sm:px-0 pb-2 lg:pb-0 ${flipped ? 'lg:order-1' : ''}`}>
          {details}
        </div>
      </article>
    </RevealCard>
  );
}

/* Each project slab pops up into place with a little overshoot, like clay
   pressed onto the page. It starts visible and only moves, so a scroll that
   outruns the observer still shows it. */
function RevealCard({ children }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { y: 60, scale: 0.96 }}
      whileInView={{ y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 170, damping: 20 }}
    >
      {children}
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
        <span className="neo-tag">{project.category}</span>
        <span className="neo-tag !bg-[var(--butter)] !text-[var(--on-pastel)]">{project.status}</span>
      </p>

      <h3
        id={headingId}
        className={`font-heading font-bold text-[var(--ink)] leading-[1] tracking-[-0.025em] mb-4 text-balance ${
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
      <div className="clay clay-lilac !rounded-[var(--radius-md)] px-5 py-4 mb-6">
        <p className="text-[13px] font-semibold opacity-80 mb-1">{toSentence(t.projects.decisionLabel)}</p>
        <p className="font-heading text-[17px] font-semibold leading-snug">
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
            className="neo-btn btn-primary group/visit"
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
            className={`neo-btn ${project.liveUrl ? 'btn-ghost' : 'btn-primary'}`}
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

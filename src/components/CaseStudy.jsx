import React, { useEffect } from 'react';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useAppContext } from '../context/app-context';
import { caseStudies as caseStudiesEn } from '../data/caseStudies';
import { caseStudies as caseStudiesEs } from '../data/caseStudiesEs';

/* Imported here rather than re-exported from the portfolio data, so the
   long-form text ships in the lazy route chunk and not in the bundle every
   visitor downloads to read the landing page. */
const STUDIES = { en: caseStudiesEn, es: caseStudiesEs };

/**
 * The long-form counterpart to a project card. A card has room for the
 * decision; this has room for why that decision beat the alternatives, which
 * is the part an interviewer is actually reading for.
 */
export default function CaseStudy({ slug, onBack }) {
  const { t, language } = useAppContext();
  const study = STUDIES[language]?.[slug];

  useEffect(() => {
    if (!study) return undefined;
    const previous = document.title;
    document.title = `${study.title} — Sebastian Chirinos`;
    return () => { document.title = previous; };
  }, [study, language]);

  if (!study) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-mono text-sm text-[var(--muted-color)]">{t.caseStudy.notFound}</p>
        <button type="button" onClick={onBack} className="neo-btn bg-[var(--accent)] text-[var(--on-accent)]">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{t.caseStudy.back}</span>
        </button>
      </main>
    );
  }

  return (
    <main id="main" className="bg-[var(--bg-color)] min-h-screen pb-20">
      <div className="bottle-region bottle-grain bg-grid-neo pt-10 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="neo-tag cursor-pointer !py-1.5 !px-3 hover:!bg-[var(--accent)] hover:!text-[var(--on-accent)] transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.caseStudy.back}</span>
          </button>


          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl tracking-[-0.035em] leading-[1.02] text-[var(--ink)] text-balance mb-6">
            {study.title}
          </h1>

          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--muted-color)]">
            <span className="inline-flex items-center gap-2 font-medium text-[var(--ink)]">
              <Building2 className="w-4 h-4" aria-hidden="true" />
              {study.client}
            </span>
            <span aria-hidden="true">•</span>
            <span>{study.role}</span>
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 -mt-10 mb-14 relative">
          {study.metrics.map((metric) => (
            <div key={metric.label} className="neo-card-flat !rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-md)]">
              <dd
className="font-heading font-bold text-4xl tracking-[-0.04em] text-[var(--ink)] mb-1"
              >
                {metric.value}
              </dd>
              <dt className="text-[13px] text-[var(--muted-color)] leading-snug">
                {metric.label}
              </dt>
            </div>
          ))}
        </dl>

        <article className="flex flex-col gap-10">
          {study.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-heading font-semibold text-2xl sm:text-[1.75rem] text-[var(--ink)] tracking-[-0.025em] mb-4">
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-[var(--ink)] text-base sm:text-[17px] leading-[1.7] mb-4 last:mb-0 max-w-[68ch]">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>

        <div className="mt-14 pt-6 border-t border-[var(--line)]">
          <p className="text-[13px] text-[var(--muted-color)] mb-3">
            {t.caseStudy.stackLabel}
          </p>
          <ul className="flex flex-wrap gap-2 list-none p-0">
            {study.tech.map((item) => (
              <li key={item} className="neo-tag">{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex justify-center">
          <button type="button" onClick={onBack} className="neo-btn btn-brass">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{t.caseStudy.back}</span>
          </button>
        </div>
      </div>
    </main>
  );
}

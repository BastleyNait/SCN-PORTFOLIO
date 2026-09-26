import React, { Suspense, lazy, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Orchestration from './components/Orchestration';
import Projects from './components/Projects';
import DecisionLog from './components/DecisionLog';
import TechStack from './components/TechStack';
import ContactFooter from './components/ContactFooter';
const CaseStudy = lazy(() => import('./components/CaseStudy'));
import { useAppContext } from './context/app-context';
import { CASE_STUDY_PREFIX, useRoute } from './lib/router';

/* Narrative order: who I am, what I shipped, the reasoning behind it, the
   fundamentals under that reasoning, the tools, and only then how AI fits in.
   Evidence first, method last: the method is a claim, the rest is proof.
   A case study takes over the whole view; it is a document, not a section. */
export default function App() {
  const { t } = useAppContext();
  const { route, navigate } = useRoute();

  const openCaseStudy = useCallback(
    (slug) => navigate(`${CASE_STUDY_PREFIX}${slug}`),
    [navigate]
  );
  const goHome = useCallback(() => navigate('/'), [navigate]);

  return (
    <div className="relative min-h-screen bg-[var(--bg-color)] text-[var(--ink)] font-body overflow-x-hidden">
      <a href="#main" className="skip-link">{t.meta.skipToContent}</a>

      {/* Ambient clay: three pastel masses drifting behind everything. */}
      <div className="clay-ambient" aria-hidden="true">
        <span style={{ width: '42vw', height: '42vw', left: '-10vw', top: '-8vw', background: 'var(--slate)' }} />
        <span style={{ width: '34vw', height: '34vw', right: '-8vw', top: '30vh', background: 'var(--sand)', animationDelay: '-9s' }} />
        <span style={{ width: '30vw', height: '30vw', left: '30vw', bottom: '-12vw', background: 'var(--steel)', animationDelay: '-17s' }} />
      </div>

      {route.name === 'case-study' ? (
        <Suspense fallback={<div className="min-h-screen" />}>
          <CaseStudy slug={route.slug} onBack={goHome} />
        </Suspense>
      ) : (
        <>
          <Navbar />

          <main id="main" className="relative z-10">
            <Hero />
            <Projects onOpenCaseStudy={openCaseStudy} />
            <DecisionLog onOpenCaseStudy={openCaseStudy} />
            <TechStack />
            <Orchestration />
          </main>

          <ContactFooter />
          {/* Room for the dock so it never sits on the last line. */}
          <div className="h-28" aria-hidden="true" />
        </>
      )}

      {/* Page views only, no cookie and no cross-site identifier. Inert
          outside a Vercel deployment, so local runs report nothing. */}
      <Analytics />
    </div>
  );
}

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
            <hr className="neo-divider max-w-6xl mx-auto" />
            <DecisionLog onOpenCaseStudy={openCaseStudy} />
            <hr className="neo-divider max-w-6xl mx-auto" />
            <TechStack />
            <hr className="neo-divider max-w-6xl mx-auto" />
            <Orchestration />
          </main>

          <ContactFooter />
        </>
      )}

      {/* Page views only, no cookie and no cross-site identifier. Inert
          outside a Vercel deployment, so local runs report nothing. */}
      <Analytics />
    </div>
  );
}

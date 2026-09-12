import React, { useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Orchestration from './components/Orchestration';
import Projects from './components/Projects';
import DecisionLog from './components/DecisionLog';
import TechStack from './components/TechStack';
import ContactFooter from './components/ContactFooter';
import CaseStudy from './components/CaseStudy';
import { useAppContext } from './context/app-context';
import { CASE_STUDY_PREFIX, useRoute } from './lib/router';

/* Narrative order: who I am, how I work, what that produced,
   the decisions behind it, the tools and fundamentals, then contact.
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
        <CaseStudy slug={route.slug} onBack={goHome} />
      ) : (
        <>
          <Navbar />

          <main id="main" className="relative z-10">
            <Hero />
            <Orchestration />
            <Projects onOpenCaseStudy={openCaseStudy} />
            <hr className="neo-divider max-w-6xl mx-auto" />
            <DecisionLog />
            <hr className="neo-divider max-w-6xl mx-auto" />
            <TechStack />
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

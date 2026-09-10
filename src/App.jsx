import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Orchestration from './components/Orchestration';
import Projects from './components/Projects';
import DecisionLog from './components/DecisionLog';
import TechStack from './components/TechStack';
import EngineeringSkills from './components/EngineeringSkills';
import ContactFooter from './components/ContactFooter';
import { useAppContext } from './context/app-context';

/* Narrative order: who I am, how I work, what that produced,
   the decisions behind it, the tools, the fundamentals, then contact. */
export default function App() {
  const { t } = useAppContext();

  return (
    <div className="relative min-h-screen bg-[var(--bg-color)] text-[var(--ink)] font-body overflow-x-hidden">
      <a href="#main" className="skip-link">{t.meta.skipToContent}</a>

      <Navbar />

      <main id="main" className="relative z-10">
        <Hero />
        <Orchestration />
        <Projects />
        <hr className="neo-divider max-w-6xl mx-auto" />
        <DecisionLog />
        <hr className="neo-divider max-w-6xl mx-auto" />
        <TechStack />
        <hr className="neo-divider max-w-6xl mx-auto" />
        <EngineeringSkills />
      </main>

      <ContactFooter />
    </div>
  );
}

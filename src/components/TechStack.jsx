import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Code2,
  Layout,
  Server,
  Smartphone,
  Cloud,
  Database,
  Brain,
  CheckCircle2,
  Terminal,
  Cpu
} from 'lucide-react';
import { useAppContext } from '../context/app-context';
import EngineeringSkills from './EngineeringSkills';

const ICONS = {
  Code2,
  Layout,
  Server,
  Smartphone,
  Cloud,
  Database,
  Brain
};

export default function TechStack() {
  const { t, data } = useAppContext();
  const techStackData = data.techStackData;
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCategory = techStackData[activeIndex] ?? techStackData[0];

  return (
    <section id="stack" className="py-14 relative bg-[var(--bg-color)]" aria-labelledby="stack-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* The fundamentals lead the section and give it its heading. A tool
            list answers "what did you use"; this answers "what do you know",
            which is the question a reader who has seen a hundred stack lists
            is actually asking. */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="neo-section-label mb-4">
            <Cpu className="w-4 h-4" aria-hidden="true" />
            <span>{t.engineering.label}</span>
          </div>

          <h2
            id="stack-title"
            className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[var(--ink)] tracking-tight mb-4 text-balance"
          >
            {t.engineering.title}
          </h2>

          <p className="text-[var(--muted-color)] text-sm sm:text-base max-w-2xl leading-relaxed">
            {t.engineering.description}
          </p>
        </div>

        <div id="engineering" className="scroll-mt-24">
          <EngineeringSkills />
        </div>

        <div className="mt-14">
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-color)]">
              <Terminal className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" aria-hidden="true" />
              {t.techStack.label}
            </span>
            <span className="h-px flex-1 bg-[var(--ink)] opacity-30" aria-hidden="true" />
          </div>

          <p className="text-[var(--muted-color)] text-sm leading-relaxed max-w-2xl mb-7">
            {t.techStack.description}
          </p>

        {/* Category tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10 max-w-4xl mx-auto" role="tablist" aria-label={t.techStack.title}>
          {techStackData.map((category, index) => {
            const isActive = index === activeIndex;
            const Icon = ICONS[category.icon];

            return (
              <button
                key={category.category}
                type="button"
                role="tab"
                id={`stack-tab-${index}`}
                aria-selected={isActive}
                aria-controls="stack-panel"
                onClick={() => setActiveIndex(index)}
                className={`neo-tag cursor-pointer text-xs sm:text-sm font-bold px-4 py-2 transition-all duration-150 ${
                  isActive
                    ? 'on-accent shadow-[3px_3px_0px_var(--ink)] -translate-x-0.5 -translate-y-0.5'
                    : 'shadow-[2px_2px_0px_var(--ink)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_var(--ink)]'
                }`}
                style={isActive ? { backgroundColor: 'var(--accent)' } : undefined}
              >
                {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
                <span>{category.category}</span>
              </button>
            );
          })}
        </div>

        {/* Active category items */}
        <motion.div
          key={activeCategory.category}
          id="stack-panel"
          role="tabpanel"
          aria-labelledby={`stack-tab-${activeIndex}`}
          initial={reduceMotion ? false : { opacity: 1, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl mx-auto"
        >
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
          {activeCategory.items.map((item) => (
            <li key={item.name} className="neo-card-sm p-4 flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[var(--ink)]" aria-hidden="true" />
              <span className="font-heading font-bold text-sm text-[var(--ink)] truncate min-w-0">
                {item.name}
              </span>
            </li>
          ))}
        </ul>
        </motion.div>
        </div>

      </div>
    </section>
  );
}

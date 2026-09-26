import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Code2, Layout, Server, Smartphone, Cloud, Database, Brain } from 'lucide-react';
import { useAppContext } from '../context/app-context';
import EngineeringSkills from './EngineeringSkills';
import SectionHeader from './SectionHeader';

const ICONS = { Code2, Layout, Server, Smartphone, Cloud, Database, Brain };
const EASE = [0.16, 1, 0.3, 1];

export default function TechStack() {
  const { t, data } = useAppContext();
  const techStackData = data.techStackData;
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCategory = techStackData[activeIndex] ?? techStackData[0];

  return (
    <section id="engineering" className="py-20 lg:py-28 relative bg-[var(--bg-color)]" aria-labelledby="engineering-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* The fundamentals lead the section and give it its heading: a tool
            list answers "what did you use", this answers "what do you know". */}
        <SectionHeader id="engineering-title" title={t.engineering.title} description={t.engineering.description} />

        <EngineeringSkills />

        <div id="stack" className="mt-20 lg:mt-24 scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <h3 className="font-heading font-bold text-3xl text-[var(--ink)] tracking-[-0.03em] mb-3">
              {t.techStack.title}
            </h3>
            <p className="text-[15px] text-[var(--muted-color)] leading-relaxed">
              {t.techStack.description}
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="flex flex-wrap gap-1 p-1 rounded-2xl bg-[var(--sunk-color)] border border-[var(--line)] mb-6" role="tablist" aria-label={t.techStack.title}>
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
                    className="relative px-3.5 py-2 rounded-xl text-sm font-medium cursor-pointer"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="stack-tab"
                        className="absolute inset-0 rounded-xl bg-[var(--bottle)] shadow-[var(--shadow-sm)]"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className={`relative z-10 inline-flex items-center gap-2 transition-colors ${isActive ? 'text-[var(--on-bottle)]' : 'text-[var(--muted-color)] hover:text-[var(--ink)]'}`}>
                      {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
                      {category.category}
                    </span>
                  </button>
                );
              })}
            </div>

            <div id="stack-panel" role="tabpanel" aria-labelledby={`stack-tab-${activeIndex}`} className="min-h-[132px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.ul
                  key={activeCategory.category}
                  className="flex flex-wrap gap-2.5 list-none p-0 m-0"
                  initial="hidden"
                  animate="shown"
                  exit="gone"
                  variants={{
                    hidden: {},
                    shown: { transition: { staggerChildren: reduceMotion ? 0 : 0.04 } },
                    gone: { opacity: 0, transition: { duration: 0.15 } }
                  }}
                >
                  {activeCategory.items.map((item) => (
                    <motion.li
                      key={item.name}
                      variants={{
                        hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.96 },
                        shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE } }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[var(--card-color)] border border-[var(--line)] font-heading font-medium text-[17px] text-[var(--ink)] tracking-[-0.01em] shadow-[var(--shadow-sm)] hover:border-[var(--accent)] transition-colors"
                    >
                      {item.name}
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

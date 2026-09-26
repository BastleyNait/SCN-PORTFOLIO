import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Code2, Layout, Server, Smartphone, Cloud, Database, Brain } from 'lucide-react';
import { useAppContext } from '../context/app-context';
import EngineeringSkills from './EngineeringSkills';
import SectionHeader from './SectionHeader';

const ICONS = { Code2, Layout, Server, Smartphone, Cloud, Database, Brain };

export default function TechStack() {
  const { t, data } = useAppContext();
  const techStackData = data.techStackData;
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCategory = techStackData[activeIndex] ?? techStackData[0];

  return (
    <section id="engineering" className="py-16 lg:py-24 relative z-10" aria-labelledby="engineering-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* The fundamentals lead the section and give it its heading: a tool
            list answers "what did you use", this answers "what do you know". */}
        <SectionHeader id="engineering-title" title={t.engineering.title} description={t.engineering.description} />

        <EngineeringSkills />

        <div id="stack" className="mt-16 lg:mt-20 scroll-mt-24 clay !rounded-[var(--radius-xl)] p-6 sm:p-9 lg:p-11 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <h3 className="font-heading font-bold text-3xl sm:text-4xl text-[var(--ink)] tracking-[-0.02em] mb-3">
              {t.techStack.title}
            </h3>
            <p className="text-[15px] text-[var(--muted-color)] leading-relaxed">
              {t.techStack.description}
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="flex flex-wrap gap-1 p-1.5 clay-well !rounded-[26px] mb-7" role="tablist" aria-label={t.techStack.title}>
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
                    className="relative px-3.5 py-2.5 rounded-full text-sm font-semibold cursor-pointer"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="stack-tab"
                        className="absolute inset-0 rounded-full clay clay-accent"
                        transition={{ type: 'spring', stiffness: 460, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 inline-flex items-center gap-2 transition-colors ${isActive ? 'text-[var(--on-accent)]' : 'text-[var(--muted-color)] hover:text-[var(--ink)]'}`}>
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
                  className="flex flex-wrap gap-3 list-none p-0 m-0"
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
                        hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.8 },
                        shown: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 380, damping: 18 } }
                      }}
                      className="clay clay-press !rounded-2xl px-5 py-3 font-heading font-semibold text-[17px] text-[var(--ink)] cursor-default select-none"
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

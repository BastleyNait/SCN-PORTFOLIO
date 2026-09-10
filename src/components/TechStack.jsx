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
  Terminal
} from 'lucide-react';
import { useAppContext } from '../context/app-context';

const CATEGORY_COLORS = [
  'var(--accent)',
  'var(--accent-lime)',
  'var(--accent-pink)',
  'var(--accent-blue)',
  'var(--accent-orange)',
  'var(--accent-purple)',
  'var(--accent-red)'
];

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
  const activeColor = CATEGORY_COLORS[activeIndex % CATEGORY_COLORS.length];

  return (
    <section id="stack" className="py-20 relative bg-[var(--bg-color)]" aria-labelledby="stack-title">
      <div className="absolute inset-0 bg-stripes pointer-events-none opacity-40" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="flex flex-col items-center text-center mb-12">
          <div className="neo-section-label mb-4">
            <Terminal className="w-4 h-4" aria-hidden="true" />
            <span>{t.techStack.label}</span>
          </div>

          <h2
            id="stack-title"
            className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[var(--ink)] tracking-tight mb-4 text-balance"
          >
            {t.techStack.title}
          </h2>

          <p className="text-[var(--muted-color)] text-sm sm:text-base max-w-2xl leading-relaxed">
            {t.techStack.description}
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10 max-w-4xl mx-auto" role="tablist" aria-label={t.techStack.title}>
          {techStackData.map((category, index) => {
            const isActive = index === activeIndex;
            const Icon = ICONS[category.icon];
            const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

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
                    ? 'on-accent shadow-[4px_4px_0px_var(--ink)] -translate-x-0.5 -translate-y-0.5'
                    : 'shadow-[2px_2px_0px_var(--ink)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_var(--ink)]'
                }`}
                style={isActive ? { backgroundColor: color } : undefined}
              >
                {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
                <span>{category.category}</span>
              </button>
            );
          })}
        </div>

        {/* Active category items */}
        <motion.ul
          key={activeCategory.category}
          id="stack-panel"
          role="tabpanel"
          aria-labelledby={`stack-tab-${activeIndex}`}
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto list-none p-0"
        >
          {activeCategory.items.map((item) => (
            <li key={item.name} className="neo-card-sm p-4 flex items-center gap-3">
              <span
                className="w-10 h-10 border-2 border-[var(--ink)] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_var(--ink)] text-[var(--on-accent)]"
                style={{ backgroundColor: activeColor }}
              >
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col min-w-0">
                <span className="font-heading font-bold text-sm text-[var(--ink)] truncate">
                  {item.name}
                </span>
                <span className="text-[11px] font-mono font-semibold text-[var(--muted-color)]">
                  {item.level}
                </span>
              </span>
            </li>
          ))}
        </motion.ul>

        {/* Layer summaries */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <SummaryCard
            icon={<Layout className="w-6 h-6" aria-hidden="true" />}
            color="var(--accent-blue)"
            title={t.techStack.frontendTitle}
            description={t.techStack.frontendDesc}
          />
          <SummaryCard
            icon={<Server className="w-6 h-6" aria-hidden="true" />}
            color="var(--accent-lime)"
            title={t.techStack.backendTitle}
            description={t.techStack.backendDesc}
          />
          <SummaryCard
            icon={<Brain className="w-6 h-6" aria-hidden="true" />}
            color="var(--accent-pink)"
            title={t.techStack.aiTitle}
            description={t.techStack.aiDesc}
          />
        </div>

      </div>
    </section>
  );
}

function SummaryCard({ icon, color, title, description }) {
  return (
    <div className="neo-card-flat p-6" style={{ borderTop: `6px solid ${color}` }}>
      <span
        className="w-12 h-12 border-2 border-[var(--ink)] flex items-center justify-center mb-4 shadow-[3px_3px_0px_var(--ink)] text-[var(--on-accent)]"
        style={{ backgroundColor: color }}
      >
        {icon}
      </span>
      <h3 className="font-heading font-extrabold text-lg text-[var(--ink)] mb-2">{title}</h3>
      <p className="text-[var(--muted-color)] text-xs sm:text-sm leading-relaxed">{description}</p>
    </div>
  );
}

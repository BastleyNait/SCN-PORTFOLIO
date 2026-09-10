import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Building2,
  ClipboardCheck,
  ShieldCheck,
  TestTube2,
  Kanban,
  Cloud,
  CheckCircle,
  Cpu
} from 'lucide-react';
import { useAppContext } from '../context/app-context';

const COLOR_CYCLE = [
  'var(--accent)',
  'var(--accent-lime)',
  'var(--accent-pink)',
  'var(--accent-blue)',
  'var(--accent-orange)',
  'var(--accent-purple)'
];

const ICONS = {
  Building2,
  ClipboardCheck,
  ShieldCheck,
  TestTube2,
  Kanban,
  CloudCognitive: Cloud
};

export default function EngineeringSkills() {
  const { t, data } = useAppContext();
  const principles = data.engineeringPrinciples;
  const reduceMotion = useReducedMotion();

  return (
    <section id="engineering" className="py-20 relative bg-[var(--bg-color)]" aria-labelledby="engineering-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="flex flex-col items-center text-center mb-16">
          <div className="neo-section-label mb-4">
            <Cpu className="w-4 h-4" aria-hidden="true" />
            <span>{t.engineering.label}</span>
          </div>

          <h2
            id="engineering-title"
            className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[var(--ink)] tracking-tight mb-4 text-balance"
          >
            {t.engineering.title}
          </h2>

          <p className="text-[var(--muted-color)] text-sm sm:text-base max-w-2xl leading-relaxed">
            {t.engineering.description}
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
          {principles.map((principle, index) => {
            const color = COLOR_CYCLE[index % COLOR_CYCLE.length];
            const Icon = ICONS[principle.icon];

            return (
              <motion.li
                key={principle.title}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: reduceMotion ? 0 : Math.min(index, 3) * 0.08 }}
                className="neo-card p-6 flex flex-col"
                style={{ borderLeft: `6px solid ${color}` }}
              >
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span
                    className="w-12 h-12 border-2 border-[var(--ink)] flex items-center justify-center shadow-[2px_2px_0px_var(--ink)] text-[var(--on-accent)] shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {Icon && <Icon className="w-6 h-6" aria-hidden="true" />}
                  </span>
                  <span
                    className="neo-tag on-accent text-[11px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_var(--ink)]"
                    style={{ backgroundColor: color }}
                  >
                    {principle.tag}
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-lg text-[var(--ink)] mb-2 leading-snug">
                  {principle.title}
                </h3>

                <p className="text-[var(--muted-color)] text-xs sm:text-sm leading-relaxed mb-6 flex-1">
                  {principle.description}
                </p>

                <div className="pt-3 border-t-2 border-dashed border-[var(--ink)] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" style={{ color }} aria-hidden="true" />
                  <span className="font-mono font-bold text-xs text-[var(--ink)]">
                    {t.engineering.production}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </ul>

      </div>
    </section>
  );
}

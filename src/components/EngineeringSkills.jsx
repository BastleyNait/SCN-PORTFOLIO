import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Building2,
  ClipboardCheck,
  ShieldCheck,
  TestTube2,
  Kanban,
  Cloud,
  CheckCircle
} from 'lucide-react';
import { useAppContext } from '../context/app-context';

const ICONS = {
  Building2,
  ClipboardCheck,
  ShieldCheck,
  TestTube2,
  Kanban,
  CloudCognitive: Cloud
};

/* Headless on purpose: this grid is the second half of the stack section
   rather than a section of its own, so it carries no heading block. */
export default function EngineeringSkills() {
  const { t, data } = useAppContext();
  const principles = data.engineeringPrinciples;
  const reduceMotion = useReducedMotion();

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0">
      {principles.map((principle, index) => {
        const color = 'var(--ink)';
        const Icon = ICONS[principle.icon];

        return (
          <motion.li
            key={principle.title}
            initial={reduceMotion ? false : { opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: reduceMotion ? 0 : Math.min(index, 3) * 0.08 }}
            className="neo-card-flat p-5 flex flex-col"
            style={{ borderLeft: `6px solid ${color}` }}
          >
            <div className="flex items-center justify-between gap-2 mb-3.5">
              <span className="w-10 h-10 border border-[var(--ink)] flex items-center justify-center bg-[var(--ink)] text-[var(--bg-color)] shrink-0">
                {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
              </span>
              <span className="neo-tag text-[11px] font-bold uppercase tracking-wider">
                {principle.tag}
              </span>
            </div>

            <h3 className="font-heading font-extrabold text-lg text-[var(--ink)] mb-2 leading-snug">
              {principle.title}
            </h3>

            <p className="text-[var(--muted-color)] text-xs sm:text-sm leading-relaxed mb-4 flex-1">
              {principle.description}
            </p>

            <div className="pt-2.5 border-t-2 border-dashed border-[var(--ink)] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" style={{ color }} aria-hidden="true" />
              <span className="font-mono font-bold text-xs text-[var(--ink)]">
                {t.engineering.production}
              </span>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}

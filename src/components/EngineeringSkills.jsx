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

            <p className="text-[var(--muted-color)] text-xs sm:text-sm leading-relaxed mb-4">
              {principle.description}
            </p>

            {/* The named concepts. A reader who knows the field can tell in one
                glance whether this is vocabulary or understanding. */}
            {principle.concepts && (
              <ul className="flex flex-wrap gap-1.5 mb-4 list-none p-0">
                {principle.concepts.map((concept) => (
                  <li key={concept} className="neo-tag text-[10px] font-semibold">
                    {concept}
                  </li>
                ))}
              </ul>
            )}

            {/* And where it was actually applied, so none of it is a claim. */}
            {principle.evidence && (
              <div className="mt-auto pt-3 border-t border-[var(--ink)]">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted-color)] mb-1.5 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {t.engineering.evidenceLabel}
                </p>
                <p className="text-[var(--ink)] text-xs leading-relaxed">
                  {principle.evidence}
                </p>
                {principle.adr && (
                  <a
                    href="#decisions"
                    className="mt-2 inline-block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted-color)] hover:text-[var(--ink)] underline underline-offset-2"
                  >
                    {principle.adr}
                  </a>
                )}
              </div>
            )}
          </motion.li>
        );
      })}
    </ul>
  );
}

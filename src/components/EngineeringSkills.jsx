import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Building2,
  ClipboardCheck,
  ShieldCheck,
  TestTube2,
  Kanban,
  Cloud,
  ArrowUpRight
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

/*
 * The fundamentals as a ledger, not a card grid: one ruled row per area,
 * read left to right as claim, the concepts under it, and the place it was
 * actually used, with a link that opens the decision record proving it.
 */
export default function EngineeringSkills() {
  const { t, data } = useAppContext();
  const principles = data.engineeringPrinciples;
  const reduceMotion = useReducedMotion();

  return (
    <ol className="list-none p-0 m-0 border-t border-[var(--line)]">
      {principles.map((principle, index) => {
        const Icon = ICONS[principle.icon];
        return (
          <motion.li
            key={principle.title}
            initial={reduceMotion ? false : { x: -16 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: reduceMotion ? 0 : Math.min(index, 5) * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="group isolate grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 py-7 lg:py-8 border-b border-[var(--line)] relative"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-0 -inset-x-3 lg:-inset-x-5 rounded-[var(--radius-lg)] bg-[var(--card-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
            />

            <div className="lg:col-span-4 flex items-start gap-4">
              <span className="w-11 h-11 rounded-xl bg-[var(--bottle)] text-[var(--on-bottle)] flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
                {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
              </span>
              <div>
                <h3 className="font-heading font-semibold text-xl text-[var(--ink)] leading-tight tracking-[-0.02em] mb-1">
                  {principle.title}
                </h3>
                <p className="text-[13px] text-[var(--muted-color)]">{principle.tag}</p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <p className="text-[15px] text-[var(--ink)] leading-relaxed mb-3.5">
                {principle.description}
              </p>
              {principle.concepts && (
                <ul className="flex flex-wrap gap-1.5 list-none p-0">
                  {principle.concepts.map((concept) => (
                    <li key={concept} className="neo-tag">{concept}</li>
                  ))}
                </ul>
              )}
            </div>

            {principle.evidence && (
              <div className="lg:col-span-3 lg:border-l lg:border-[var(--line)] lg:pl-6">
                <p className="text-[13px] text-[var(--muted-color)] mb-1.5">{t.engineering.evidenceLabel}</p>
                <p className="text-sm text-[var(--ink)] leading-relaxed">{principle.evidence}</p>
                {principle.adr && (
                  <a
                    href={`#${principle.adr}`}
                    className="mt-2.5 inline-flex items-center gap-1 font-mono text-[12px] text-[var(--accent-strong)] hover:text-[var(--ink)] transition-colors"
                  >
                    {principle.adr.toUpperCase()}
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            )}
          </motion.li>
        );
      })}
    </ol>
  );
}

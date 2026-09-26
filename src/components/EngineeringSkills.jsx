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

const ICON_CLAYS = ['clay-accent', 'clay-sand', 'clay-steel', 'clay-amber', 'clay-stone', 'clay-slate'];

/*
 * Six fundamentals as clay cards. Each names the area, the concepts under
 * it, and where it was actually used, with a chip that opens the decision
 * record proving it.
 */
export default function EngineeringSkills() {
  const { t, data } = useAppContext();
  const principles = data.engineeringPrinciples;
  const reduceMotion = useReducedMotion();

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0">
      {principles.map((principle, index) => {
        const Icon = ICONS[principle.icon];
        return (
          <motion.li
            key={principle.title}
            initial={reduceMotion ? false : { y: 40, scale: 0.95 }}
            whileInView={{ y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: reduceMotion ? 0 : (index % 3) * 0.07 }}
            whileHover={reduceMotion ? undefined : { y: -6 }}
            className="group clay p-6 sm:p-7 flex flex-col"
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <span className={`w-12 h-12 rounded-2xl clay ${ICON_CLAYS[index % ICON_CLAYS.length]} flex items-center justify-center transition-transform duration-500 [transition-timing-function:var(--ease-squish)] group-hover:rotate-[-12deg] group-hover:scale-110`}>
                {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
              </span>
              <span className="neo-tag">{principle.tag}</span>
            </div>

            <h3 className="font-heading font-semibold text-[22px] text-[var(--ink)] leading-tight mb-2.5">
              {principle.title}
            </h3>
            <p className="text-[15px] text-[var(--muted-color)] leading-relaxed mb-4">
              {principle.description}
            </p>

            {principle.concepts && (
              <ul className="flex flex-wrap gap-1.5 list-none p-0 mb-5">
                {principle.concepts.map((concept) => (
                  <li key={concept} className="neo-tag">{concept}</li>
                ))}
              </ul>
            )}

            {principle.evidence && (
              <div className="mt-auto clay-well px-4 py-4">
                <p className="text-[12px] font-semibold text-[var(--muted-color)] mb-1">{t.engineering.evidenceLabel}</p>
                <p className="text-sm text-[var(--ink)] leading-relaxed">{principle.evidence}</p>
                {principle.adr && (
                  <a
                    href={`#${principle.adr}`}
                    className="mt-3 inline-flex items-center gap-1 neo-tag !bg-[var(--accent)] !text-[var(--on-accent)] font-mono hover:scale-105 transition-transform"
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
    </ul>
  );
}

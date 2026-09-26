import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/*
 * Section opening: a big rounded heading, a violet squiggle that draws
 * itself under it the first time it is seen, and the section's argument
 * beside it. No kicker label; the heading is the label.
 */
export default function SectionHeader({ id, title, description, children }) {
  const reduceMotion = useReducedMotion();

  return (
    <header className="mb-10 lg:mb-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-end">
        <div className="lg:col-span-7">
          <h2
            id={id}
            className="font-heading font-bold text-[clamp(2.2rem,4.8vw,3.8rem)] leading-[1.02] tracking-[-0.025em] text-[var(--ink)] text-balance"
          >
            {title}
          </h2>
          <svg viewBox="0 0 220 16" className="w-44 h-4 mt-3 overflow-visible" aria-hidden="true">
            <motion.path
              d="M2 10 Q 20 2, 38 9 T 74 9 T 110 9 T 146 9 T 182 9 T 218 8"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="5"
              strokeLinecap="round"
              initial={reduceMotion ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </div>
        {description && (
          <p className="lg:col-span-5 text-[15px] sm:text-base leading-relaxed text-[var(--muted-color)] max-w-[60ch] text-pretty">
            {description}
          </p>
        )}
      </div>
      {children}
    </header>
  );
}

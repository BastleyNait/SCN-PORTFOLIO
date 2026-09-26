import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

/*
 * Editorial section opening: the heading carries its own weight on the left,
 * the one-paragraph argument sits on the right, and a brass rule draws
 * underneath the first time the section arrives. No kicker label above the
 * heading; the heading is the label.
 */
export default function SectionHeader({ id, title, description, children }) {
  const reduceMotion = useReducedMotion();

  return (
    <header className="mb-10 lg:mb-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-end">
        <h2
          id={id}
          className="lg:col-span-7 font-heading font-bold text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.02] tracking-[-0.035em] text-[var(--ink)] text-balance"
        >
          {title}
        </h2>
        {description && (
          <p className="lg:col-span-5 text-[15px] sm:text-base leading-relaxed text-[var(--muted-color)] max-w-[60ch] text-pretty">
            {description}
          </p>
        )}
      </div>

      <div className="relative mt-7 h-px bg-[var(--line)]">
        <motion.span
          aria-hidden="true"
          className="absolute left-0 top-[-1px] h-[3px] w-40 rounded-full bg-[var(--accent)] origin-left"
          initial={reduceMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </div>

      {children}
    </header>
  );
}

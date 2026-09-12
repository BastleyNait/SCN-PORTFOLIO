import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Workflow, Bot, UserCog, Quote } from 'lucide-react';
import { useAppContext } from '../context/app-context';

const PHASE_COLORS = [
  'var(--accent)',
  'var(--accent-blue)',
  'var(--accent-purple)',
  'var(--accent-pink)',
  'var(--accent-lime)'
];

export default function Orchestration() {
  const { t, data } = useAppContext();
  const { thesis, loop, split } = data.orchestrationData;
  const reduceMotion = useReducedMotion();

  const rise = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 1, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.4, delay: reduceMotion ? 0 : delay }
  });

  return (
    <section
      id="orchestration"
      className="py-14 relative bg-[var(--bg-color)] border-b-[3px] border-[var(--ink)]"
      aria-labelledby="orchestration-title"
    >
      <div className="absolute inset-0 bg-stripes pointer-events-none opacity-30" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="neo-section-label mb-4">
            <Workflow className="w-4 h-4" aria-hidden="true" />
            <span>{t.orchestration.label}</span>
          </div>

          <h2
            id="orchestration-title"
            className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[var(--ink)] tracking-tight mb-6 max-w-3xl text-balance"
          >
            {t.orchestration.title}
          </h2>

          {/* The thesis, set as a pull quote so it reads as a position, not filler */}
          <blockquote className="relative neo-card-flat max-w-3xl p-6 sm:p-8 text-left">
            <Quote
              className="w-8 h-8 absolute -top-4 -left-4 bg-[var(--accent)] text-[var(--on-accent)] border-2 border-[var(--ink)] p-1.5"
              aria-hidden="true"
            />
            <p className="text-[var(--ink)] text-sm sm:text-base leading-relaxed font-medium">
              {thesis}
            </p>
          </blockquote>
        </div>

        {/* The loop: five phases, each labelled with who owns it */}
        <div className="mb-6 flex items-center gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-color)]">
            {t.orchestration.loopLabel}
          </span>
          <span className="h-[2px] flex-1 bg-[var(--ink)] opacity-30" aria-hidden="true" />
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-12">
          {loop.map((phase, index) => {
            const color = PHASE_COLORS[index % PHASE_COLORS.length];
            const isShared = phase.owner === 'shared';

            return (
              <motion.li
                key={phase.step}
                {...rise(index * 0.06)}
                className="neo-card-flat p-5 flex flex-col"
                style={{ borderTop: `6px solid ${color}` }}
              >
                {/* Step number + ownership badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono font-black text-2xl text-[var(--muted-color)] leading-none">
                    {phase.step}
                  </span>
                  <span
                    className="neo-tag on-accent text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_var(--ink)]"
                    style={{ backgroundColor: isShared ? 'var(--accent-lime)' : color }}
                  >
                    {isShared ? <Bot className="w-3 h-3" aria-hidden="true" /> : <UserCog className="w-3 h-3" aria-hidden="true" />}
                    {isShared ? t.orchestration.ownerShared : t.orchestration.ownerHuman}
                  </span>
                </div>

                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted-color)] mb-1.5">
                  {phase.phase}
                </p>

                <h3 className="font-heading font-extrabold text-base text-[var(--ink)] leading-snug mb-2.5">
                  {phase.title}
                </h3>

                <p className="text-[var(--muted-color)] text-xs leading-relaxed mb-5 flex-1">
                  {phase.description}
                </p>

                <div className="pt-3 border-t-2 border-dashed border-[var(--ink)]">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted-color)] mb-2">
                    {t.orchestration.artifactsLabel}
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {phase.artifacts.map((artifact) => (
                      <li
                        key={artifact}
                        className="font-mono text-[10px] font-semibold text-[var(--ink)] border border-[var(--ink)] px-1.5 py-0.5"
                      >
                        {artifact}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            );
          })}
        </ol>

        {/* The split: what goes to the agents versus what never leaves my hands */}
        <div className="mb-6 flex items-center gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-color)]">
            {t.orchestration.splitLabel}
          </span>
          <span className="h-[2px] flex-1 bg-[var(--ink)] opacity-30" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SplitCard
            {...rise(0)}
            icon={<Bot className="w-5 h-5" aria-hidden="true" />}
            tag={split.delegatedTag}
            title={split.delegatedTitle}
            items={split.delegated}
            color="var(--accent-blue)"
            marker="→"
          />
          <SplitCard
            {...rise(0.1)}
            icon={<UserCog className="w-5 h-5" aria-hidden="true" />}
            tag={split.ownedTag}
            title={split.ownedTitle}
            items={split.owned}
            color="var(--accent)"
            marker="◆"
          />
        </div>


      </div>
    </section>
  );
}

function SplitCard({ icon, tag, title, items, color, marker, ...motionProps }) {
  return (
    <motion.div {...motionProps} className="neo-card-flat p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-5">
        <span
          className="w-11 h-11 border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] flex items-center justify-center text-[var(--on-accent)] shrink-0"
          style={{ backgroundColor: color }}
        >
          {icon}
        </span>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-color)]">
            {tag}
          </p>
          <h3 className="font-heading font-extrabold text-lg text-[var(--ink)] leading-tight">
            {title}
          </h3>
        </div>
      </div>

      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--ink)] leading-relaxed">
            <span
              className="font-mono font-black text-xs mt-1 shrink-0"
              style={{ color }}
              aria-hidden="true"
            >
              {marker}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

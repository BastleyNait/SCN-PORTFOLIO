import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ScrollText, GitBranch, Scale, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/app-context';

export default function DecisionLog() {
  const { t, data } = useAppContext();
  const records = data.decisionLog;
  const reduceMotion = useReducedMotion();

  // The first record starts open so the pattern is visible without a click.
  const [openId, setOpenId] = useState(records[0]?.id ?? null);

  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  return (
    <section
      id="decisions"
      className="py-14 relative bg-[var(--bg-color)]"
      aria-labelledby="decisions-title"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="flex flex-col items-center text-center mb-14">
          <div className="neo-section-label mb-4">
            <ScrollText className="w-4 h-4" aria-hidden="true" />
            <span>{t.decisions.label}</span>
          </div>

          <h2
            id="decisions-title"
            className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[var(--ink)] tracking-tight mb-4 text-balance"
          >
            {t.decisions.title}
          </h2>

          <p className="text-[var(--muted-color)] text-sm sm:text-base max-w-2xl leading-relaxed">
            {t.decisions.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {records.map((record, index) => {
            const color = 'var(--ink)';
            const isOpen = openId === record.id;
            const panelId = `${record.id}-panel`;

            return (
              <motion.article
                key={record.id}
                initial={reduceMotion ? false : { opacity: 1, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.35, delay: reduceMotion ? 0 : Math.min(index, 3) * 0.06 }}
                className="neo-card-flat overflow-hidden"
                style={{ borderLeft: `8px solid ${color}` }}
              >
                {/* Header row doubles as the disclosure control */}
                <h3>
                  <button
                    type="button"
                    onClick={() => toggle(record.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full text-left p-5 sm:p-6 flex items-start gap-4 cursor-pointer hover:bg-[var(--bg-color)] transition-colors"
                  >
                    <span
                      className="hidden sm:flex w-11 h-11 shrink-0 items-center justify-center border border-[var(--ink)] bg-[var(--ink)] text-[var(--bg-color)]"
                    >
                      <GitBranch className="w-5 h-5" aria-hidden="true" />
                    </span>

                    <span className="flex-1 min-w-0">
                      <span className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-color)]">
                          {record.id}
                        </span>
                        <span className="neo-tag text-[10px] font-bold uppercase tracking-wider">
                          {record.project}
                        </span>
                        <span className="neo-tag bg-[var(--ink)] text-[var(--bg-color)] text-[10px] font-bold uppercase tracking-wider">
                          {record.tag}
                        </span>
                      </span>

                      <span className="block font-heading font-extrabold text-lg sm:text-xl text-[var(--ink)] leading-snug">
                        {record.title}
                      </span>
                    </span>

                    <span className="shrink-0 flex items-center gap-2 pt-1">
                      <span className="hidden lg:inline font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted-color)]">
                        {isOpen ? t.decisions.collapse : t.decisions.expand}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[var(--ink)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      key="panel"
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 border-t-2 border-dashed border-[var(--ink)] grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">

                        <Field label={t.decisions.contextLabel}>
                          <p className="text-sm text-[var(--ink)] leading-relaxed">{record.context}</p>
                        </Field>

                        <Field label={t.decisions.optionsLabel}>
                          <ul className="space-y-1.5">
                            {record.options.map((option) => (
                              <li
                                key={option}
                                className="text-sm text-[var(--muted-color)] leading-relaxed flex items-start gap-2"
                              >
                                <span className="font-mono text-xs mt-0.5 shrink-0" aria-hidden="true">·</span>
                                <span>{option}</span>
                              </li>
                            ))}
                          </ul>
                        </Field>

                        <Field label={t.decisions.decisionLabel} accent={color}>
                          <p className="text-sm text-[var(--ink)] font-medium leading-relaxed">
                            {record.decision}
                          </p>
                        </Field>

                        <Field label={t.decisions.tradeoffLabel} icon={<Scale className="w-3.5 h-3.5" aria-hidden="true" />}>
                          <p className="text-sm text-[var(--ink)] leading-relaxed italic">
                            {record.tradeoff}
                          </p>
                        </Field>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
}

function Field({ label, children, accent, icon }) {
  return (
    <div className="pt-5">
      <p
        className="font-mono text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5"
        style={{ color: accent || 'var(--muted-color)' }}
      >
        {icon}
        {label}
      </p>
      {children}
    </div>
  );
}

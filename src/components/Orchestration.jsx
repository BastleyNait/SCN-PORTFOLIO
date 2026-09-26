import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Bot, UserCog } from 'lucide-react';
import { useAppContext } from '../context/app-context';
import { toSentence } from '../lib/text';
import SectionHeader from './SectionHeader';

/*
 * The operating model. The loop is a real sequence, so it is numbered and
 * drawn as a line the reader's scroll fills in brass: by the time the last
 * phase is on screen, the line has reached it. The split closes the section
 * as two facing panels, and the owned half is the bottle one.
 */
export default function Orchestration() {
  const { t, data } = useAppContext();
  const { thesis, loop, split } = data.orchestrationData;
  const reduceMotion = useReducedMotion();
  const loopRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: loopRef, offset: ['start 85%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const fillX = useTransform(fill, (v) => (reduceMotion ? 1 : v));

  return (
    <section id="orchestration" className="py-20 lg:py-28 relative bg-[var(--bg-color)]" aria-labelledby="orchestration-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader id="orchestration-title" title={t.orchestration.title} description={thesis} />

        <h3 className="sr-only">{t.orchestration.loopLabel}</h3>
        <div ref={loopRef} className="relative">
          {/* Track and its brass fill. Horizontal on a desktop, vertical on a phone. */}
          <div className="hidden lg:block absolute left-0 right-0 top-[22px] h-px bg-[var(--line-strong)]" aria-hidden="true">
            <motion.span className="absolute inset-0 bg-[var(--accent)] origin-left h-[2px] -top-px" style={{ scaleX: fillX }} />
          </div>
          <div className="lg:hidden absolute left-[21px] top-2 bottom-2 w-px bg-[var(--line-strong)]" aria-hidden="true">
            <motion.span className="absolute inset-0 bg-[var(--accent)] origin-top w-[2px] -left-px" style={{ scaleY: fillX }} />
          </div>

          <ol className="relative grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-6 list-none p-0 m-0">
            {loop.map((phase, index) => {
              const shared = phase.owner === 'shared';
              return (
                <motion.li
                  key={phase.step}
                  initial={reduceMotion ? false : { y: 24 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, delay: reduceMotion ? 0 : index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pl-16 lg:pl-0"
                >
                  <span
                    className={`absolute left-0 top-0 lg:static w-11 h-11 rounded-full flex items-center justify-center font-mono text-[13px] mb-5 ring-4 ring-[var(--bg-color)] ${
                      shared
                        ? 'bg-[var(--card-color)] text-[var(--ink)] border border-[var(--line-strong)]'
                        : 'bg-[var(--bottle)] text-[var(--on-bottle)]'
                    }`}
                  >
                    {phase.step}
                  </span>
                  <p className="text-[13px] text-[var(--accent-strong)] font-medium mb-1">{phase.phase}</p>
                  <h4 className="font-heading font-semibold text-[19px] leading-snug tracking-[-0.015em] text-[var(--ink)] mb-2.5">
                    {phase.title}
                  </h4>
                  <p className="text-sm text-[var(--muted-color)] leading-relaxed mb-3">{phase.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--ink)]">
                    {shared ? <Bot className="w-3.5 h-3.5" aria-hidden="true" /> : <UserCog className="w-3.5 h-3.5" aria-hidden="true" />}
                    {toSentence(shared ? t.orchestration.ownerShared : t.orchestration.ownerHuman)}
                  </span>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <h3 className="sr-only">{t.orchestration.splitLabel}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-20">
          <SplitPanel
            icon={<Bot className="w-5 h-5" aria-hidden="true" />}
            title={split.delegatedTitle}
            note={toSentence(split.delegatedTag)}
            items={split.delegated}
            className="neo-card-flat !rounded-[var(--radius-xl)]"
          />
          <SplitPanel
            icon={<UserCog className="w-5 h-5" aria-hidden="true" />}
            title={split.ownedTitle}
            note={toSentence(split.ownedTag)}
            items={split.owned}
            className="bottle-region bottle-grain rounded-[var(--radius-xl)] overflow-hidden"
            owned
          />
        </div>
      </div>
    </section>
  );
}

function SplitPanel({ icon, title, note, items, className, owned = false }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { y: 28 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, delay: owned && !reduceMotion ? 0.1 : 0, ease: [0.16, 1, 0.3, 1] }}
      className={`p-7 sm:p-9 ${className}`}
    >
      <div className="flex items-center gap-3.5 mb-6">
        <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${owned ? 'bg-[var(--accent)] text-[var(--on-accent)]' : 'bg-[var(--sunk-color)] text-[var(--ink)]'}`}>
          {icon}
        </span>
        <div>
          <h4 className="font-heading font-bold text-2xl tracking-[-0.025em] text-[var(--ink)] leading-tight">{title}</h4>
          <p className="text-[13px] text-[var(--muted-color)]">{note}</p>
        </div>
      </div>
      <ul className="list-none p-0 m-0 divide-y divide-[var(--line)]">
        {items.map((item) => (
          <li key={item} className="py-3 text-[15px] text-[var(--ink)] leading-relaxed flex items-start gap-3">
            <span className={`mt-[0.55em] w-1.5 h-1.5 rounded-full shrink-0 ${owned ? 'bg-[var(--accent)]' : 'bg-[var(--line-strong)]'}`} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Bot, UserCog } from 'lucide-react';
import { useAppContext } from '../context/app-context';
import { toSentence } from '../lib/text';
import SectionHeader from './SectionHeader';

/*
 * The operating model. The loop is a real sequence, so it is numbered and
 * sits on a clay track the reader's scroll fills in violet. The split closes
 * the section as two facing slabs; the owned half is the violet one.
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
    <section id="orchestration" className="py-16 lg:py-24 relative z-10" aria-labelledby="orchestration-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader id="orchestration-title" title={t.orchestration.title} description={thesis} />

        <h3 className="sr-only">{t.orchestration.loopLabel}</h3>
        <div ref={loopRef} className="relative">
          {/* Clay track and its violet fill. Horizontal on a desktop, vertical on a phone. */}
          <div className="hidden lg:block absolute left-6 right-6 top-[40px] h-3 clay-well !rounded-full overflow-hidden" aria-hidden="true">
            <motion.span className="absolute inset-0 rounded-full bg-[var(--accent)] origin-left" style={{ scaleX: fillX }} />
          </div>
          <div className="lg:hidden absolute left-[22px] top-4 bottom-4 w-3 clay-well !rounded-full overflow-hidden" aria-hidden="true">
            <motion.span className="absolute inset-0 rounded-full bg-[var(--accent)] origin-top" style={{ scaleY: fillX }} />
          </div>

          <ol className="relative grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-4 list-none p-0 m-0">
            {loop.map((phase, index) => {
              const shared = phase.owner === 'shared';
              return (
                <motion.li
                  key={phase.step}
                  initial={reduceMotion ? false : { y: 40, scale: 0.94 }}
                  whileInView={{ y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20, delay: reduceMotion ? 0 : index * 0.07 }}
                  className="relative pl-16 lg:pl-0 flex flex-col"
                >
                  <span
                    className={`absolute left-0 top-3 lg:static lg:mx-auto w-14 h-14 lg:w-[68px] lg:h-[68px] rounded-full clay flex items-center justify-center font-heading font-bold text-lg lg:text-xl mb-5 ${
                      shared ? 'clay-butter' : 'clay-violet'
                    }`}
                  >
                    {phase.step}
                  </span>
                  <div className="clay p-5 flex-1">
                  <p className="text-[13px] text-[var(--accent-strong)] font-semibold mb-1">{phase.phase}</p>
                  <h4 className="font-heading font-semibold text-[19px] leading-snug text-[var(--ink)] mb-2.5">
                    {phase.title}
                  </h4>
                  <p className="text-sm text-[var(--muted-color)] leading-relaxed mb-3">{phase.description}</p>
                  <span className={`neo-tag ${shared ? '!bg-[var(--butter)] !text-[var(--on-pastel)]' : ''}`}>
                    {shared ? <Bot className="w-3.5 h-3.5" aria-hidden="true" /> : <UserCog className="w-3.5 h-3.5" aria-hidden="true" />}
                    {toSentence(shared ? t.orchestration.ownerShared : t.orchestration.ownerHuman)}
                  </span>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <h3 className="sr-only">{t.orchestration.splitLabel}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-14">
          <SplitPanel
            icon={<Bot className="w-5 h-5" aria-hidden="true" />}
            title={split.delegatedTitle}
            note={toSentence(split.delegatedTag)}
            items={split.delegated}
            className="clay !rounded-[var(--radius-xl)]"
          />
          <SplitPanel
            icon={<UserCog className="w-5 h-5" aria-hidden="true" />}
            title={split.ownedTitle}
            note={toSentence(split.ownedTag)}
            items={split.owned}
            className="clay clay-violet !rounded-[var(--radius-xl)]"
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
      initial={reduceMotion ? false : { y: 44, rotate: owned ? 1.5 : -1.5 }}
      whileInView={{ y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18, delay: owned && !reduceMotion ? 0.1 : 0 }}
      className={`p-7 sm:p-9 ${className}`}
    >
      <div className="flex items-center gap-3.5 mb-6">
        <span className={`w-12 h-12 rounded-2xl clay flex items-center justify-center shrink-0 ${owned ? 'clay-butter' : 'clay-lilac'}`}>
          {icon}
        </span>
        <div>
          <h4 className="font-heading font-bold text-2xl leading-tight">{title}</h4>
          <p className="text-[13px] opacity-80">{note}</p>
        </div>
      </div>
      <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item} className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed flex items-start gap-3 ${owned ? 'bg-[rgba(255,255,255,0.14)]' : 'clay-well'}`}>
            <span className={`mt-[0.5em] w-2 h-2 rounded-full shrink-0 ${owned ? 'bg-[var(--butter)]' : 'bg-[var(--accent)]'}`} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

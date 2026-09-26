import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useAppContext } from '../context/app-context';
import { CASE_STUDY_PREFIX } from '../lib/router';
import { toSentence } from '../lib/text';
import SectionHeader from './SectionHeader';

/*
 * The decision log as a set of clay tiles with one open record beneath
 * them. A link to #adr-00x (the fundamentals use them) opens that record
 * and brings it into view.
 */
export default function DecisionLog({ onOpenCaseStudy }) {
  const { t, data } = useAppContext();
  const records = data.decisionLog;
  const reduceMotion = useReducedMotion();
  const hashId = () => {
    const id = typeof window === 'undefined' ? '' : window.location.hash.slice(1);
    return records.some((record) => record.id === id) ? id : null;
  };
  const [openId, setOpenId] = useState(() => hashId() ?? records[0]?.id ?? null);

  const scrollToRecord = useCallback(() => {
    requestAnimationFrame(() => {
      const target = document.getElementById('decisions-ledger') ?? document.getElementById('decisions');
      target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }, [reduceMotion]);

  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.slice(1);
      if (!records.some((record) => record.id === id)) return;
      setOpenId(id);
      scrollToRecord();
    };
    /* A deep link on first load: the state already opened it, only scroll. */
    const initial = window.location.hash.slice(1);
    if (records.some((record) => record.id === initial)) scrollToRecord();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [records, scrollToRecord]);

  const open = records.find((record) => record.id === openId) ?? records[0];

  return (
    <section id="decisions" className="py-16 lg:py-24 relative z-10" aria-labelledby="decisions-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader id="decisions-title" title={t.decisions.title} description={t.decisions.description} />

        {/* The records as clay tiles: a grid on a desktop, a swipeable row on
            a phone. The chosen tile sinks into the page; its record opens
            in the slab underneath. */}
        <ol
          className="list-none m-0 -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory sm:overflow-visible"
          aria-label={t.decisions.title}
        >
          {records.map((record, i) => {
            const isActive = record.id === open?.id;
            return (
              <li key={record.id} className="snap-start shrink-0 w-[78%] sm:w-auto">
                <motion.button
                  type="button"
                  onClick={() => setOpenId(record.id)}
                  aria-pressed={isActive}
                  aria-controls="adr-panel"
                  whileHover={reduceMotion || isActive ? undefined : { y: -5, rotate: i % 2 ? 0.8 : -0.8 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`w-full h-full min-h-[150px] text-left p-5 rounded-[var(--radius-lg)] cursor-pointer flex flex-col gap-3 transition-[box-shadow,background-color] duration-300 ${
                    isActive ? 'clay-well ring-2 ring-[var(--accent)]' : `clay ${TILE_CLAYS[i % TILE_CLAYS.length]}`
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold opacity-80">{record.id.toUpperCase()}</span>
                    <span className={`w-2.5 h-2.5 rounded-full transition-colors ${isActive ? 'bg-[var(--accent)]' : 'bg-current opacity-30'}`} aria-hidden="true" />
                  </span>
                  <span className="font-heading font-semibold text-[17px] leading-snug">{record.title}</span>
                  <span className="mt-auto text-[13px] opacity-75">{record.project}</span>
                </motion.button>
              </li>
            );
          })}
        </ol>

        <div id="decisions-ledger" className="mt-6 scroll-mt-24" aria-live="polite">
          <div id="adr-panel">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={open.id}
                initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className="clay !rounded-[var(--radius-xl)] p-6 sm:p-9 lg:p-11"
              >
                <RecordBody record={open} t={t} onOpenCaseStudy={onOpenCaseStudy} />
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

const TILE_CLAYS = ['clay-slate', 'clay-sand', 'clay-amber', 'clay-steel', 'clay-stone'];

function RecordBody({ record, t, onOpenCaseStudy }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-7">
        <p className="flex flex-wrap items-center gap-2 mb-4">
          <span className="font-mono text-[12px] font-semibold text-[var(--accent-strong)]">{record.id.toUpperCase()}</span>
          <span className="neo-tag">{record.project}</span>
          <span className="neo-tag !bg-[var(--amber)] !text-[var(--on-pastel)]">{record.tag}</span>
        </p>

        <h3 className="font-heading font-bold text-[1.9rem] sm:text-[2.3rem] leading-[1.05] tracking-[-0.02em] text-[var(--ink)] mb-7 text-balance">
          {record.title}
        </h3>

        <Block label={toSentence(t.decisions.contextLabel)}>
          <p className="text-[15px] text-[var(--ink)] leading-relaxed">{record.context}</p>
        </Block>

        <Block label={toSentence(t.decisions.optionsLabel)}>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {record.options.map((option, i) => (
              <li key={option} className="clay-well !rounded-2xl px-4 py-3 text-[15px] text-[var(--ink)] leading-snug flex items-start gap-3">
                <span className="w-6 h-6 rounded-full clay clay-slate flex items-center justify-center font-mono text-[11px] shrink-0">{i + 1}</span>
                {option}
              </li>
            ))}
          </ul>
        </Block>

        <div className="clay clay-accent !rounded-[var(--radius-lg)] px-6 py-5 mt-2">
          <p className="text-[13px] font-semibold opacity-85 mb-1">{toSentence(t.decisions.decisionLabel)}</p>
          <p className="font-heading text-[19px] font-semibold leading-snug">{record.decision}</p>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="clay clay-sand !rounded-[var(--radius-lg)] px-6 py-5">
          <p className="text-[13px] font-semibold opacity-80 mb-1">{toSentence(t.decisions.tradeoffLabel)}</p>
          <p className="text-[15px] leading-relaxed italic">{record.tradeoff}</p>
        </div>

        {record.concept && (
          <div>
            <p className="text-[13px] text-[var(--muted-color)] mb-1.5">{t.decisions.conceptLabel}</p>
            <p className="font-heading font-semibold text-[20px] text-[var(--ink)] mb-2">{record.concept}</p>
            <p className="text-[15px] text-[var(--ink)] leading-relaxed">{record.theory}</p>
          </div>
        )}

        {record.atScale && (
          <Block label={t.decisions.atScaleLabel} flush>
            <p className="text-sm text-[var(--muted-color)] leading-relaxed">{record.atScale}</p>
          </Block>
        )}
        {record.verified && (
          <Block label={t.decisions.verifiedLabel} flush>
            <p className="text-sm text-[var(--muted-color)] leading-relaxed">{record.verified}</p>
          </Block>
        )}

        {record.caseStudy && (
          <a
            href={`${CASE_STUDY_PREFIX}${record.caseStudy}`}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
              event.preventDefault();
              onOpenCaseStudy?.(record.caseStudy);
            }}
            className="neo-btn self-start"
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            <span>{t.projects.caseStudyLink}</span>
          </a>
        )}
      </div>
    </div>
  );
}

function Block({ label, children, flush = false }) {
  return (
    <div className={flush ? '' : 'mb-6'}>
      <p className="text-[13px] text-[var(--muted-color)] mb-2">{label}</p>
      {children}
    </div>
  );
}

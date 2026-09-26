import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, FileText } from 'lucide-react';
import { useAppContext } from '../context/app-context';
import { CASE_STUDY_PREFIX } from '../lib/router';
import { toSentence } from '../lib/text';
import SectionHeader from './SectionHeader';

const EASE = [0.16, 1, 0.3, 1];

/*
 * The decision log reads like a ledger on a desktop: the index of records
 * stays pinned on the left and the open record fills the right, swapping
 * with a short crossfade. On a phone it is an accordion. Either way a link
 * to #adr-00x (the hero tree uses them) opens that record and brings the
 * section into view.
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

  const scrollToRecord = useCallback((id) => {
    requestAnimationFrame(() => {
      /* The desktop ledger and the phone accordion both exist in the DOM;
         scroll to whichever one is actually displayed. */
      const ledger = document.getElementById('decisions-ledger');
      const target = ledger?.offsetParent
        ? ledger
        : document.getElementById(`${id}-row-m`) ?? document.getElementById('decisions');
      target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }, [reduceMotion]);

  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.slice(1);
      if (!records.some((record) => record.id === id)) return;
      setOpenId(id);
      scrollToRecord(id);
    };
    /* A deep link on first load: the state already opened it, only scroll. */
    const initial = window.location.hash.slice(1);
    if (records.some((record) => record.id === initial)) scrollToRecord(initial);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [records, scrollToRecord]);

  const open = records.find((record) => record.id === openId) ?? records[0];

  return (
    <section id="decisions" className="py-20 lg:py-28 relative bg-[var(--bg-color)]" aria-labelledby="decisions-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader id="decisions-title" title={t.decisions.title} description={t.decisions.description} />

        {/* Desktop: pinned index + reading panel */}
        <div id="decisions-ledger" className="hidden lg:grid grid-cols-12 gap-10 items-start scroll-mt-24">
          <ol className="col-span-5 sticky top-24 list-none p-0 m-0 space-y-1" aria-label={t.decisions.title}>
            {records.map((record) => {
              const isActive = record.id === open?.id;
              return (
                <li key={record.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(record.id)}
                    aria-pressed={isActive}
                    aria-controls="adr-panel"
                    className="relative w-full text-left px-4 py-3.5 rounded-[var(--radius-md)] cursor-pointer group"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="adr-active"
                        className="absolute inset-0 rounded-[var(--radius-md)] bg-[var(--card-color)] border border-[var(--line)] shadow-[var(--shadow-md)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span className="relative z-10 flex items-start gap-3.5">
                      <span className={`font-mono text-[12px] pt-1 w-8 shrink-0 transition-colors ${isActive ? 'text-[var(--accent-strong)]' : 'text-[var(--muted-color)]'}`}>
                        {record.id.replace('adr-', '')}
                      </span>
                      <span className="min-w-0">
                        <span className={`block font-heading text-[16px] leading-snug tracking-[-0.01em] transition-colors ${isActive ? 'text-[var(--ink)] font-semibold' : 'text-[var(--muted-color)] group-hover:text-[var(--ink)]'}`}>
                          {record.title}
                        </span>
                        <span className="block text-[13px] text-[var(--muted-color)] mt-0.5">{record.project}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div id="adr-panel" className="col-span-7 min-h-[560px]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={open.id}
                initial={reduceMotion ? false : { opacity: 0, y: 14, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: EASE }}
                className="neo-card-flat !rounded-[var(--radius-lg)] p-8 xl:p-10 shadow-[var(--shadow-md)]"
              >
                <RecordBody record={open} t={t} onOpenCaseStudy={onOpenCaseStudy} showTitle />
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        {/* Phone and tablet: accordion */}
        <div className="lg:hidden space-y-3">
          {records.map((record) => {
            const isOpen = record.id === openId;
            const panelId = `${record.id}-panel`;
            return (
              <article
                key={record.id}
                id={`${record.id}-row-m`}
                className={`rounded-[var(--radius-lg)] border transition-colors duration-300 scroll-mt-24 ${
                  isOpen ? 'bg-[var(--card-color)] border-[var(--line-strong)] shadow-[var(--shadow-md)]' : 'border-[var(--line)]'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : record.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full text-left p-5 flex items-start gap-3 cursor-pointer"
                  >
                    <span className="font-mono text-[12px] text-[var(--accent-strong)] pt-1 shrink-0">
                      {record.id.replace('adr-', '')}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-heading font-semibold text-[17px] text-[var(--ink)] leading-snug">
                        {record.title}
                      </span>
                      <span className="block text-[13px] text-[var(--muted-color)] mt-1">{record.project}</span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 mt-0.5 shrink-0 text-[var(--muted-color)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6">
                        <RecordBody record={record} t={t} onOpenCaseStudy={onOpenCaseStudy} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RecordBody({ record, t, onOpenCaseStudy, showTitle = false }) {
  return (
    <>
      <p className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-mono text-[12px] text-[var(--accent-strong)]">{record.id.toUpperCase()}</span>
        <span className="neo-tag">{record.project}</span>
        <span className="neo-tag !bg-[var(--sunk-color)]">{record.tag}</span>
      </p>

      {showTitle && (
        <h3 className="font-heading font-bold text-[1.9rem] xl:text-[2.2rem] leading-[1.05] tracking-[-0.03em] text-[var(--ink)] mb-7 text-balance">
          {record.title}
        </h3>
      )}

      <Block label={toSentence(t.decisions.contextLabel)}>
        <p className="text-[15px] text-[var(--ink)] leading-relaxed">{record.context}</p>
      </Block>

      {/* The options, drawn as the branches they were: each leaves the same
          stem, and only the decision below continues. */}
      <Block label={toSentence(t.decisions.optionsLabel)}>
        <ul className="relative list-none p-0 m-0 pl-5 space-y-2.5 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-[var(--line-strong)]">
          {record.options.map((option) => (
            <li key={option} className="relative text-[15px] text-[var(--muted-color)] leading-relaxed">
              <span className="absolute -left-5 top-[0.6em] w-[11px] h-[11px] rounded-full border border-[var(--line-strong)] bg-[var(--card-color)]" aria-hidden="true" />
              {option}
            </li>
          ))}
        </ul>
      </Block>

      <div className="bottle-region rounded-[var(--radius-md)] px-5 py-5 my-6">
        <p className="text-[13px] text-[var(--accent)] mb-1.5 font-medium">{toSentence(t.decisions.decisionLabel)}</p>
        <p className="font-heading text-[18px] font-semibold leading-snug tracking-[-0.01em]">{record.decision}</p>
      </div>

      <Block label={toSentence(t.decisions.tradeoffLabel)}>
        <p className="text-[15px] text-[var(--ink)] leading-relaxed italic">{record.tradeoff}</p>
      </Block>

      {/* The theory layer: the named concept, where it stops holding, and how
          it was checked. A decision anyone can repeat is worth less than the
          reasoning that produced it. */}
      {record.concept && (
        <div className="mt-7 pt-6 border-t border-[var(--line)]">
          <p className="text-[13px] text-[var(--muted-color)] mb-1.5">{t.decisions.conceptLabel}</p>
          <p className="font-heading font-semibold text-[19px] text-[var(--ink)] mb-2 tracking-[-0.01em]">{record.concept}</p>
          <p className="text-[15px] text-[var(--ink)] leading-relaxed">{record.theory}</p>
        </div>
      )}

      {(record.atScale || record.verified) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
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
        </div>
      )}

      {record.caseStudy && (
        <a
          href={`${CASE_STUDY_PREFIX}${record.caseStudy}`}
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
            event.preventDefault();
            onOpenCaseStudy?.(record.caseStudy);
          }}
          className="neo-btn btn-ghost mt-8"
        >
          <FileText className="w-4 h-4" aria-hidden="true" />
          <span>{t.projects.caseStudyLink}</span>
        </a>
      )}
    </>
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

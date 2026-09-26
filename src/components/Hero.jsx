import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, animate } from 'framer-motion';
import { MapPin, ArrowDown, Download } from 'lucide-react';
import { Github, Linkedin, Whatsapp } from './Icons';
import { useAppContext } from '../context/app-context';
import { CV_PATH, CV_DOWNLOAD_NAME } from '../lib/cv';
import { toSentence } from '../lib/text';
import DecisionTree from './DecisionTree';

const EASE = [0.16, 1, 0.3, 1];
const LINE_MS = 3600;

const SOCIAL_CLASS =
  'w-11 h-11 rounded-full border border-[var(--line-strong)] flex items-center justify-center text-[var(--ink)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)] hover:border-transparent transition-colors duration-200';

/** Cycles the product one-liners with a crossfade. Holds on the first line
 *  for reduced-motion visitors and whenever the hero is off screen. */
function useRotatingLine(lines, running) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!running || lines.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % lines.length), LINE_MS);
    return () => clearInterval(id);
  }, [running, lines.length]);
  return index;
}

/** Counts a stat up from zero once it is on screen. The final value is in
 *  the markup from the start, so nothing depends on the animation running. */
function CountUp({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const target = Number.parseInt(value, 10);
  const numeric = Number.isFinite(target);

  useEffect(() => {
    if (!inView || reduceMotion || !numeric || !ref.current) return undefined;
    const node = ref.current;
    const controls = animate(0, target, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (latest) => { node.textContent = String(Math.round(latest)); }
    });
    return () => controls.stop();
  }, [inView, reduceMotion, numeric, target]);

  return <span ref={ref}>{value}</span>;
}

export default function Hero() {
  const { t, data } = useAppContext();
  const personalData = data.personalData;
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.25 });
  const lineIndex = useRotatingLine(personalData.typingLines, inView && !reduceMotion);

  const enter = (delay) => (reduceMotion ? {} : {
    initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.8, delay, ease: EASE }
  });

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="bottle-region bottle-grain bg-grid-neo relative overflow-hidden pt-28 sm:pt-32 pb-10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">

          <div className="lg:col-span-7 flex flex-col items-start">
            <motion.p {...enter(0.05)} className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--muted-color)] mb-7">
              <span className="inline-flex items-center gap-2 text-[var(--ink)] font-medium">
                <span className="relative flex w-2.5 h-2.5" aria-hidden="true">
                  <span className="absolute inset-0 rounded-full bg-[var(--mint)] opacity-60 motion-safe:animate-ping" />
                  <span className="relative w-2.5 h-2.5 rounded-full bg-[var(--mint)]" />
                </span>
                {toSentence(t.hero.available)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                {personalData.location} · UTC-5
              </span>
            </motion.p>

            <h1 className="font-heading font-extrabold text-[var(--ink)] leading-[0.92] tracking-[-0.04em] mb-6">
              <motion.span {...enter(0.12)} className="block text-xl sm:text-2xl font-medium tracking-[-0.01em] text-[var(--muted-color)] mb-3">
                {t.hero.greeting}
              </motion.span>
              <motion.span
                {...enter(0.2)}
                className="block text-[clamp(3.1rem,8.2vw,6rem)]"
                style={{ fontVariationSettings: '"opsz" 96, "wdth" 88' }}
              >
                {personalData.shortName}
              </motion.span>
            </h1>

            <motion.p {...enter(0.32)} className="font-heading text-xl sm:text-2xl font-medium text-[var(--ink)] leading-snug max-w-xl text-balance mb-5">
              {personalData.headline}
            </motion.p>

            {/* One-liners from the systems themselves, in rotation. */}
            <motion.div {...enter(0.4)} className="relative h-7 w-full max-w-xl mb-7 overflow-hidden" aria-live="off">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={lineIndex}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="absolute inset-0 flex items-center gap-2.5 text-sm sm:text-base text-[var(--accent)] truncate"
                >
                  <span className="w-5 h-px bg-[var(--accent)] shrink-0" aria-hidden="true" />
                  {personalData.typingLines[lineIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.p {...enter(0.48)} className="text-[var(--muted-color)] text-[15px] leading-relaxed max-w-[60ch] mb-9">
              {personalData.bio}
            </motion.p>

            <motion.div {...enter(0.56)} className="flex flex-wrap items-center gap-3">
              <a href="#decisions" className="neo-btn btn-brass group">
                <span>{toSentence(t.hero.exploreBtn)}</span>
                <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
              <a href={CV_PATH} download={CV_DOWNLOAD_NAME} className="neo-btn btn-ghost">
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>{t.hero.downloadCv}</span>
              </a>
              <span className="flex items-center gap-2 sm:ml-2">
                <a href={personalData.github} target="_blank" rel="noopener noreferrer" className={SOCIAL_CLASS} aria-label="GitHub">
                  <Github className="w-[18px] h-[18px]" />
                </a>
                <a href={personalData.linkedin} target="_blank" rel="noopener noreferrer" className={SOCIAL_CLASS} aria-label="LinkedIn">
                  <Linkedin className="w-[18px] h-[18px]" />
                </a>
                <a href={personalData.whatsapp} target="_blank" rel="noopener noreferrer" className={SOCIAL_CLASS} aria-label="WhatsApp">
                  <Whatsapp className="w-[18px] h-[18px]" />
                </a>
              </span>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <DecisionTree
              records={data.decisionLog}
              portrait="/profile-400.webp"
              portraitAlt={`${personalData.name}, ${personalData.role}`}
              hint={t.hero.treeHint}
            />
          </div>
        </div>

        {/* The ledger: four facts, set as figures on one ruled line. */}
        <motion.dl
          {...enter(0.7)}
          className="mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 border-t border-[var(--line)]"
        >
          {personalData.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col-reverse gap-1 py-5 pr-4 ${i % 2 === 1 ? 'pl-4 md:pl-6' : 'md:pl-6'} ${i === 0 ? 'md:pl-0' : ''} ${
                i > 0 ? 'md:border-l border-[var(--line)]' : ''
              } ${i % 2 === 1 ? 'border-l border-[var(--line)] md:border-l' : ''}`}
            >
              <dt className="text-sm text-[var(--muted-color)] leading-snug">{stat.label}</dt>
              <dd className="font-heading font-bold text-4xl sm:text-5xl text-[var(--ink)] tracking-[-0.04em] tabular-nums">
                <CountUp value={stat.value} />
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

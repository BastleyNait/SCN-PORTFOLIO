import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, animate } from 'framer-motion';
import { MapPin, ArrowDown, Download, Rocket, ScrollText, Boxes, Braces } from 'lucide-react';
import { Github, Linkedin, Whatsapp } from './Icons';
import { useAppContext } from '../context/app-context';
import { CV_PATH, CV_DOWNLOAD_NAME } from '../lib/cv';
import { toSentence } from '../lib/text';

const STAT_ICONS = { Rocket, ScrollText, Boxes, Braces };
const STAT_CLAYS = ['clay-accent', 'clay-sand', 'clay-amber', 'clay-steel'];
const LINE_MS = 3800;
const SPRING = { type: 'spring', stiffness: 260, damping: 22 };

const SOCIAL =
  'w-11 h-11 rounded-full clay clay-press flex items-center justify-center text-[var(--ink)]';

function useRotatingLine(count, running) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!running || count < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), LINE_MS);
    return () => clearInterval(id);
  }, [running, count]);
  return [index, setIndex];
}

/** Counts up once on screen; the real value is in the markup from the start. */
function CountUp({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const target = Number.parseInt(value, 10);

  useEffect(() => {
    if (!inView || reduceMotion || !Number.isFinite(target) || !ref.current) return undefined;
    const node = ref.current;
    const controls = animate(0, target, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { node.textContent = String(Math.round(v)); }
    });
    return () => controls.stop();
  }, [inView, reduceMotion, target]);

  return <span ref={ref}>{value}</span>;
}

/*
 * The hero as a bento of clay slabs: identity and actions on the big one,
 * the portrait on a slate one, the four figures on four coloured ones, and
 * the systems' own one-liners rotating along the bottom.
 */
export default function Hero() {
  const { t, data } = useAppContext();
  const personalData = data.personalData;
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.2 });
  const [lineIndex, setLineIndex] = useRotatingLine(personalData.typingLines.length, inView && !reduceMotion);

  const pop = (i) => (reduceMotion ? {} : {
    initial: { opacity: 0, y: 30, scale: 0.94 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { ...SPRING, delay: 0.08 * i }
  });

  return (
    <section id="hero" ref={sectionRef} className="relative z-10 pt-24 sm:pt-28 pb-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-12 gap-4 sm:gap-5">

        {/* Identity */}
        <motion.div {...pop(0)} className="clay col-span-2 md:col-span-8 md:row-span-2 p-7 sm:p-10 flex flex-col">
          <p className="flex flex-wrap items-center gap-2 mb-7">
            <span className="neo-tag !bg-transparent !shadow-none !px-0 text-[var(--ink)]">
              <span className="relative flex w-2.5 h-2.5" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-[var(--accent)] opacity-50 motion-safe:animate-ping" />
                <span className="relative w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
              </span>
              {toSentence(t.hero.available)}
            </span>
            <span className="neo-tag">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              {personalData.location}
            </span>
          </p>

          <h1 className="font-heading text-[var(--ink)] mb-5">
            <span className="block text-2xl sm:text-3xl font-medium text-[var(--muted-color)] mb-1">{t.hero.greeting}</span>
            <span
              className="block font-bold leading-[0.95] tracking-[-0.03em] text-[clamp(3rem,7.4vw,5.6rem)]"
              style={{ fontVariationSettings: '"wdth" 110' }}
            >
              {personalData.shortName}
            </span>
          </h1>

          <p className="font-heading text-xl sm:text-2xl font-medium text-[var(--ink)] leading-snug max-w-xl text-balance mb-4">
            {personalData.headline}
          </p>

          <p className="text-[15px] text-[var(--muted-color)] leading-relaxed max-w-[60ch] mb-8">
            {personalData.bio}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-3">
            <a href="#decisions" className="neo-btn btn-primary group">
              {toSentence(t.hero.exploreBtn)}
              <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" aria-hidden="true" />
            </a>
            <a href={CV_PATH} download={CV_DOWNLOAD_NAME} className="neo-btn">
              <Download className="w-4 h-4" aria-hidden="true" />
              {t.hero.downloadCv}
            </a>
          </div>
        </motion.div>

        {/* Portrait */}
        <motion.div {...pop(1)} className="clay clay-slate col-span-2 md:col-span-4 md:row-span-2 p-5 flex flex-col items-center justify-between gap-5 min-h-[360px] overflow-hidden">
          <div className="relative w-full flex-1 flex items-center justify-center pt-2">
            <div className="clay-bob relative w-[88%] max-w-[300px] aspect-[4/5]" style={{ '--tilt': '-3deg' }}>
              <img
                src="/profile-800.webp"
                srcSet="/profile-400.webp 400w, /profile-800.webp 800w"
                sizes="300px"
                alt={`${personalData.name}, ${personalData.role}`}
                width={800}
                height={800}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover rounded-[34px] shadow-[14px_18px_34px_-10px_rgba(20,35,60,0.4)]"
              />
              <span
                className="clay-bob absolute -bottom-3 -right-4 clay clay-amber !rounded-full px-3.5 py-1.5 font-heading font-semibold text-xs"
                style={{ '--tilt': '6deg', animationDelay: '-2s' }}
              >
                {t.hero.engineerBadge}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <a href={personalData.github} target="_blank" rel="noopener noreferrer" className={SOCIAL} aria-label="GitHub"><Github className="w-[18px] h-[18px]" /></a>
            <a href={personalData.linkedin} target="_blank" rel="noopener noreferrer" className={SOCIAL} aria-label="LinkedIn"><Linkedin className="w-[18px] h-[18px]" /></a>
            <a href={personalData.whatsapp} target="_blank" rel="noopener noreferrer" className={SOCIAL} aria-label="WhatsApp"><Whatsapp className="w-[18px] h-[18px]" /></a>
          </div>
        </motion.div>

        {/* Figures */}
        <dl className="contents">
          {personalData.stats.map((stat, i) => {
            const Icon = STAT_ICONS[stat.icon];
            return (
              <motion.div
                key={stat.label}
                {...pop(2 + i)}
                whileHover={reduceMotion ? undefined : { y: -6, rotate: i % 2 ? 1.5 : -1.5 }}
                className={`clay ${STAT_CLAYS[i % STAT_CLAYS.length]} md:col-span-3 p-5 sm:p-6 flex flex-col-reverse justify-between gap-4 sm:gap-6 min-h-[140px] sm:min-h-[150px]`}
              >
                <dt className="text-sm font-semibold leading-snug opacity-90">{stat.label}</dt>
                <dd className="flex items-start justify-between">
                  <span className="font-heading font-bold text-4xl sm:text-5xl leading-none tracking-[-0.03em] tabular-nums">
                    <CountUp value={stat.value} />
                  </span>
                  {Icon && <Icon className="w-6 h-6 opacity-80" aria-hidden="true" />}
                </dd>
              </motion.div>
            );
          })}
        </dl>

        {/* The systems in one line each */}
        <motion.div {...pop(6)} className="clay-well col-span-2 md:col-span-12 px-5 sm:px-7 py-4 flex items-center gap-4">
          <span className="w-9 h-9 rounded-full clay clay-accent flex items-center justify-center shrink-0 font-mono text-xs">
            {String(lineIndex + 1).padStart(2, '0')}
          </span>
          <div className="relative flex-1 h-7 overflow-hidden" aria-live="off">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={lineIndex}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center font-heading font-medium text-base sm:text-lg text-[var(--ink)] truncate"
              >
                {personalData.typingLines[lineIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            {personalData.typingLines.map((line, i) => (
              <button
                key={line}
                type="button"
                onClick={() => setLineIndex(i)}
                aria-label={line}
                aria-current={i === lineIndex ? 'true' : undefined}
                className={`h-2.5 rounded-full cursor-pointer transition-all duration-500 [transition-timing-function:var(--ease-squish)] ${
                  i === lineIndex ? 'w-7 bg-[var(--accent)]' : 'w-2.5 bg-[var(--line-strong)] hover:bg-[var(--muted-color)]'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

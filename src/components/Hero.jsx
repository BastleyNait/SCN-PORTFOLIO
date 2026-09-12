import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Terminal,
  MapPin,
  ArrowRight,
  Download,
  Rocket,
  ScrollText,
  Boxes,
  Braces,
  UserCheck
} from 'lucide-react';
import { Github, Linkedin, Whatsapp } from './Icons';
import { useAppContext } from '../context/app-context';
import { CV_PATH, CV_DOWNLOAD_NAME } from '../lib/cv';

const STAT_COLORS = [
  'var(--accent)',
  'var(--accent-blue)',
  'var(--accent-pink)',
  'var(--accent-lime)'
];

const STAT_ICONS = {
  Rocket: Rocket,
  ScrollText: ScrollText,
  Boxes: Boxes,
  Braces: Braces
};

const SOCIAL_LINK_CLASS =
  'p-2.5 bg-[var(--card-color)] border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center text-[var(--ink)]';

/** Types the tagline out character by character, or shows it whole when the
 *  visitor has asked the system to reduce motion. */
function useTypedLine(lines, enabled) {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;

    const currentLine = lines[lineIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentLine.substring(0, displayText.length + 1));
        if (displayText.length === currentLine.length) {
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        setDisplayText(currentLine.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setLineIndex((prev) => (prev + 1) % lines.length);
        }
      }
    }, isDeleting ? 30 : 60);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, lineIndex, lines, enabled]);

  return enabled ? displayText : lines[0];
}

export default function Hero() {
  const { t, data } = useAppContext();
  const personalData = data.personalData;
  const reduceMotion = useReducedMotion();
  const [photoFailed, setPhotoFailed] = useState(false);

  const displayText = useTypedLine(personalData.typingLines, !reduceMotion);

  return (
    <section id="hero" className="relative pt-24 pb-10 bg-[var(--bg-color)] bg-grid-neo overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* LEFT: identity, position, calls to action */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="neo-tag on-accent bg-[var(--accent-lime)] shadow-[2px_2px_0px_var(--ink)] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[var(--on-accent)] animate-pulse" aria-hidden="true" />
                {t.hero.available}
              </span>
              <span className="neo-tag shadow-[2px_2px_0px_var(--ink)]">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                {personalData.location}
              </span>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] mb-4 text-[var(--ink)]">
              {t.hero.greeting} <br />
              <span className="bg-[var(--accent)] text-[var(--on-accent)] px-2.5 py-0.5 border-[3px] border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] inline-block mt-2">
                {personalData.shortName}
              </span>
            </h1>

            {/* The positioning line — the single sentence this page is built around */}
            <p className="font-heading font-extrabold text-xl sm:text-2xl text-[var(--ink)] leading-snug mb-6 max-w-xl text-balance">
              {personalData.headline}
            </p>

            <div className="bg-[var(--card-color)] border-[3px] border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] px-4 py-3 flex items-center gap-2.5 w-full max-w-lg mb-6">
              <span className="bg-[var(--ink)] p-1 text-[var(--accent)] shrink-0">
                <Terminal className="w-4 h-4" aria-hidden="true" />
              </span>
              <span className="font-mono text-xs sm:text-sm text-[var(--ink)] font-bold tracking-wide truncate">
                {displayText}
              </span>
              {!reduceMotion && (
                <span className="w-2 h-4 bg-[var(--ink)] inline-block shrink-0 animate-pulse" aria-hidden="true" />
              )}
            </div>

            <p className="text-[var(--muted-color)] text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
              {personalData.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a href="#decisions" className="neo-btn bg-[var(--accent)] text-[var(--on-accent)]">
                <span>{t.hero.exploreBtn}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href={CV_PATH}
                download={CV_DOWNLOAD_NAME}
                className="neo-btn bg-[var(--card-color)] text-[var(--ink)]"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>{t.hero.downloadCv}</span>
              </a>

              <div className="flex items-center gap-3 ml-auto sm:ml-2 pt-2 sm:pt-0">
                <a href={personalData.github} target="_blank" rel="noopener noreferrer" className={SOCIAL_LINK_CLASS} aria-label="GitHub">
                  <Github className="w-5 h-5" />
                </a>
                <a href={personalData.linkedin} target="_blank" rel="noopener noreferrer" className={SOCIAL_LINK_CLASS} aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href={personalData.whatsapp} target="_blank" rel="noopener noreferrer" className={SOCIAL_LINK_CLASS} aria-label="WhatsApp">
                  <Whatsapp className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: portrait */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">

              <FloatingTag className="-top-4 -left-4" color="var(--accent-blue)" delay={0} reduceMotion={reduceMotion}>
                Architecture
              </FloatingTag>
              <FloatingTag className="top-1/2 -right-5" color="var(--accent-lime)" delay={1} reduceMotion={reduceMotion}>
                AI Orchestration
              </FloatingTag>
              <FloatingTag className="-bottom-4 left-4" color="var(--accent-pink)" delay={2} reduceMotion={reduceMotion}>
                Edge ML
              </FloatingTag>

              <div className="w-full bg-[var(--card-color)] border-[3px] border-[var(--ink)] shadow-[8px_8px_0px_var(--accent)] p-4 flex flex-col items-center">
                <div className="relative w-full h-[280px] sm:h-[320px] bg-[var(--bg-color)] border-2 border-[var(--ink)] overflow-hidden">
                  {photoFailed ? (
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[var(--muted-color)]">
                      <UserCheck className="w-12 h-12" aria-hidden="true" />
                      <span className="font-mono text-xs uppercase tracking-wider">{t.hero.photoPlaceholder}</span>
                    </span>
                  ) : (
                    <img
                      src="/profile-800.webp"
                      srcSet="/profile-400.webp 400w, /profile-800.webp 800w"
                      sizes="(max-width: 639px) 340px, 380px"
                      alt={`${personalData.name}, ${personalData.role}`}
                      width={800}
                      height={800}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      onError={() => setPhotoFailed(true)}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                  )}
                </div>

                <div className="w-full mt-3.5 pt-3 border-t-2 border-dashed border-[var(--ink)] flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-lime)] border border-[var(--ink)] shrink-0" aria-hidden="true" />
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-[var(--ink)] tracking-tight truncate">
                      {personalData.shortName}
                    </span>
                  </span>
                  <span className="neo-tag on-accent bg-[var(--accent)] text-[10px] uppercase shadow-[2px_2px_0px_var(--ink)] shrink-0">
                    {t.hero.engineerBadge}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stat bar */}
        <motion.dl
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 neo-card-flat p-6 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {personalData.stats.map((stat, index) => {
            const Icon = STAT_ICONS[stat.icon];
            const color = STAT_COLORS[index % STAT_COLORS.length];

            return (
              <div key={stat.label} className="flex flex-col items-center text-center p-2">
                <dd
                  className="font-heading font-black text-2xl sm:text-3xl text-[var(--on-accent)] px-3 py-0.5 border-2 border-[var(--ink)] shadow-[3px_3px_0px_var(--ink)] mb-2.5"
                  style={{ backgroundColor: color }}
                >
                  {stat.value}
                </dd>
                <dt className="font-mono text-xs text-[var(--ink)] font-bold tracking-tight inline-flex items-center gap-1.5">
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                  {stat.label}
                </dt>
              </div>
            );
          })}
        </motion.dl>

      </div>
    </section>
  );
}

function FloatingTag({ children, className, color, delay, reduceMotion }) {
  return (
    <motion.span
      animate={reduceMotion ? undefined : { y: [-5, 5, -5] }}
      transition={{ duration: 3.6 + delay * 0.3, repeat: Infinity, ease: 'easeInOut', delay }}
      className={`absolute z-20 neo-tag on-accent shadow-[3px_3px_0px_var(--ink)] font-bold uppercase tracking-wider ${className}`}
      style={{ backgroundColor: color }}
    >
      {children}
    </motion.span>
  );
}

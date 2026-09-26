import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight, Sun, Moon, Languages, Home, LayoutGrid, GitBranch, Cpu, Layers, Workflow, Mail } from 'lucide-react';
import { useAppContext } from '../context/app-context';
import { toSentence } from '../lib/text';

/** Section ids are structural, so they live outside the translation layer. */
const SECTIONS = [
  { id: 'hero', labelKey: 'home', icon: Home },
  { id: 'projects', labelKey: 'projects', icon: LayoutGrid },
  { id: 'decisions', labelKey: 'decisions', icon: GitBranch },
  { id: 'engineering', labelKey: 'engineering', icon: Cpu },
  { id: 'stack', labelKey: 'techStack', icon: Layers },
  { id: 'orchestration', labelKey: 'orchestration', icon: Workflow },
  { id: 'contact', labelKey: 'contact', icon: Mail }
];

const CHIP =
  'h-10 min-w-10 px-3 inline-flex items-center justify-center gap-1.5 rounded-full clay clay-press text-[var(--ink)] text-sm font-semibold cursor-pointer';

/*
 * Two pieces. A light top bar for identity and settings, and a floating
 * clay dock at the bottom that carries the sections: always in reach of a
 * thumb, labelled on wide screens, icons on phones, with a cobalt puck that
 * slides to the section being read and a progress line along its base.
 */
export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, theme, toggleTheme, t, data } = useAppContext();
  const personalData = data.personalData;

  /* Scroll spy. Runs inside requestAnimationFrame so a fast scroll cannot
     queue up more layout reads than the browser can paint. */
  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const probe = window.scrollY + window.innerHeight * 0.3;

      /* getBoundingClientRect is measured against the viewport, so adding
         scrollY gives a position in the document. offsetTop cannot be used
         here: it is relative to the nearest positioned ancestor, so any
         anchor nested inside another one reports a small number and the
         section is never matched. */
      let current = SECTIONS[0].id;
      let best = -Infinity;

      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        const top = element.getBoundingClientRect().top + window.scrollY;
        if (top <= probe && top > best) {
          best = top;
          current = section.id;
        }
      }

      /* The last section can be shorter than the probe offset, so a page
         scrolled to the bottom would otherwise never highlight it. */
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = SECTIONS[SECTIONS.length - 1].id;
      }

      setActiveSection(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-5 pt-3">
        <div
          className={`max-w-6xl mx-auto flex items-center justify-between gap-3 px-2 py-2 rounded-full transition-[background-color,box-shadow] duration-500 ${
            scrolled ? 'clay' : ''
          }`}
        >
          <a href="#hero" className="flex items-center gap-2.5 min-w-0 group pl-1">
            <span className="w-10 h-10 rounded-2xl clay clay-accent flex items-center justify-center font-heading font-bold text-sm shrink-0 transition-transform duration-500 [transition-timing-function:var(--ease-squish)] group-hover:rotate-[-10deg] group-hover:scale-110">
              SC
            </span>
            <span className="flex flex-col min-w-0">
              <span className="font-heading font-semibold text-[15px] text-[var(--ink)] leading-none truncate">
                {personalData.shortName}
              </span>
              <span className="text-[11px] text-[var(--muted-color)] mt-1 truncate">{t.nav.systemsEngineer}</span>
            </span>
          </a>

          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleTheme} className={CHIP} aria-label={t.nav.toggleTheme} title={t.nav.toggleTheme}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -120, scale: 0.4, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 120, scale: 0.4, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                  className="flex"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
                </motion.span>
              </AnimatePresence>
            </button>
            <button
              type="button"
              onClick={toggleLanguage}
              className={CHIP}
              aria-label={`${language === 'en' ? 'ES' : 'EN'} — ${t.nav.toggleLanguage}`}
              title={t.nav.toggleLanguage}
            >
              <Languages className="w-4 h-4" aria-hidden="true" />
              {language === 'en' ? 'ES' : 'EN'}
            </button>
            <a href="#contact" className="hidden sm:inline-flex neo-btn btn-primary !py-2.5 !px-5 !text-sm">
              {toSentence(t.nav.contactBtn)}
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <nav
        aria-label="Primary"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-1.5rem)]"
      >
        <div className="relative clay !rounded-full p-1.5 overflow-hidden">
          <ul className="flex items-center gap-0.5 list-none p-0 m-0">
            {SECTIONS.map(({ id, labelKey, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={t.nav[labelKey]}
                    title={t.nav[labelKey]}
                    className="relative flex items-center gap-2 h-11 px-3 lg:px-3.5 rounded-full text-sm font-semibold"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="dock-puck"
                        className="absolute inset-0 rounded-full clay clay-accent"
                        transition={{ type: 'spring', stiffness: 460, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-[var(--on-accent)]' : 'text-[var(--muted-color)] hover:text-[var(--ink)]'}`}>
                      <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
                      <span className="hidden lg:inline">{t.nav[labelKey]}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
          <motion.span
            aria-hidden="true"
            className="absolute left-4 right-4 bottom-0.5 h-[3px] rounded-full bg-[var(--accent)] origin-left opacity-60"
            style={{ scaleX: progress }}
          />
        </div>
      </nav>
    </>
  );
}

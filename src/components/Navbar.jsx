import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, ArrowUpRight, Sun, Moon, Languages } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { useAppContext } from '../context/app-context';
import { toSentence } from '../lib/text';

/** Section ids are structural, so they live outside the translation layer. */
const SECTIONS = [
  { id: 'hero', labelKey: 'home' },
  { id: 'projects', labelKey: 'projects' },
  { id: 'decisions', labelKey: 'decisions' },
  { id: 'engineering', labelKey: 'engineering' },
  { id: 'stack', labelKey: 'techStack' },
  { id: 'orchestration', labelKey: 'orchestration' },
  { id: 'contact', labelKey: 'contact' }
];

const ICON_BTN_CLASS =
  'w-9 h-9 flex items-center justify-center rounded-full border border-[var(--line)] hover:border-[var(--line-strong)] hover:bg-[var(--sunk-color)] transition-colors text-[var(--ink)] cursor-pointer';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
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

  /* Escape closes the mobile menu, as any disclosure should. */
  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  /* Reading progress: a brass hairline along the bottom of the bar, sprung
     so a fast scroll glides instead of jumping. */
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-3">
      <div className="relative max-w-6xl mx-auto bg-[color-mix(in_oklab,var(--card-color)_92%,transparent)] backdrop-blur-md border border-[var(--line)] rounded-2xl shadow-[var(--shadow-md)] overflow-hidden">
        <div className="flex items-center justify-between h-14 pl-3 pr-2 sm:pl-4">

          <a href="#hero" className="flex items-center gap-2.5 group min-w-0">
            <span className="w-9 h-9 rounded-xl bg-[var(--bottle)] text-[var(--on-bottle)] flex items-center justify-center font-heading font-bold text-sm tracking-tight shrink-0 transition-transform duration-300 group-hover:rotate-[-6deg]">
              SC
            </span>
            <span className="flex flex-col min-w-0">
              <span className="font-heading font-semibold text-[15px] tracking-tight text-[var(--ink)] leading-none truncate">
                {personalData.shortName}
              </span>
              <span className="text-[11px] text-[var(--muted-color)] mt-1 truncate">
                {t.nav.systemsEngineer}
              </span>
            </span>
          </a>

          <nav className="hidden xl:flex items-center gap-0.5 p-1 rounded-xl bg-[var(--sunk-color)]" aria-label="Primary">
            {SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className="relative px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors"
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg bg-[var(--bottle)] shadow-[var(--shadow-sm)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-[var(--on-bottle)]' : 'text-[var(--muted-color)] hover:text-[var(--ink)]'}`}>
                    {t.nav[section.labelKey]}
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              className={ICON_BTN_CLASS}
              aria-label={t.nav.toggleTheme}
              title={t.nav.toggleTheme}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex"
                >
                  {theme === 'dark'
                    ? <Sun className="w-4 h-4" aria-hidden="true" />
                    : <Moon className="w-4 h-4" aria-hidden="true" />}
                </motion.span>
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={toggleLanguage}
              className={`${ICON_BTN_CLASS} gap-1 w-auto px-3 text-xs font-semibold`}
              aria-label={`${language === 'en' ? 'ES' : 'EN'} — ${t.nav.toggleLanguage}`}
              title={t.nav.toggleLanguage}
            >
              <Languages className="w-3.5 h-3.5" aria-hidden="true" />
              {language === 'en' ? 'ES' : 'EN'}
            </button>

            <a href="#contact" className="neo-btn btn-brass !py-2 !px-4 !text-[13px] ml-1">
              <span>{toSentence(t.nav.contactBtn)}</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={`xl:hidden ${ICON_BTN_CLASS} w-10 h-10`}
            aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen
              ? <X className="w-5 h-5" aria-hidden="true" />
              : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>

        <motion.span
          aria-hidden="true"
          className="absolute left-0 right-0 bottom-0 h-[2px] bg-[var(--accent)] origin-left"
          style={{ scaleX: progress }}
        />

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden border-t border-[var(--line)] px-3 py-3 space-y-3 overflow-hidden max-h-[calc(100vh-88px)] overflow-y-auto"
          >
            <nav className="flex flex-col gap-2" aria-label="Primary mobile">
              {SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={closeMenu}
                    aria-current={isActive ? 'true' : undefined}
                    className={`px-3.5 py-2.5 text-[15px] font-medium rounded-xl transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-[var(--bottle)] text-[var(--on-bottle)]'
                        : 'text-[var(--ink)] hover:bg-[var(--sunk-color)]'
                    }`}
                  >
                    <span>{t.nav[section.labelKey]}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />}
                  </a>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <a href={personalData.github} target="_blank" rel="noopener noreferrer" className={ICON_BTN_CLASS} aria-label="GitHub">
                  <Github className="w-4 h-4" />
                </a>
                <a href={personalData.linkedin} target="_blank" rel="noopener noreferrer" className={ICON_BTN_CLASS} aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <button type="button" onClick={toggleTheme} className={ICON_BTN_CLASS} aria-label={t.nav.toggleTheme}>
                  {theme === 'dark'
                    ? <Sun className="w-4 h-4" aria-hidden="true" />
                    : <Moon className="w-4 h-4" aria-hidden="true" />}
                </button>
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className={`${ICON_BTN_CLASS} w-auto px-3 font-semibold text-xs`}
                  aria-label={`${language === 'en' ? 'ES' : 'EN'} — ${t.nav.toggleLanguage}`}
                >
                  {language === 'en' ? 'ES' : 'EN'}
                </button>
              </div>

              <a
                href="#contact"
                onClick={closeMenu}
                className="neo-btn btn-brass !py-2 !px-4 !text-[13px]"
              >
                <span>{toSentence(t.nav.contactBtn)}</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </header>
  );
}

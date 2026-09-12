import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Sun, Moon, Languages } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { useAppContext } from '../context/app-context';

/** Section ids are structural, so they live outside the translation layer. */
const SECTIONS = [
  { id: 'hero', labelKey: 'home' },
  { id: 'orchestration', labelKey: 'orchestration' },
  { id: 'projects', labelKey: 'projects' },
  { id: 'decisions', labelKey: 'decisions' },
  { id: 'stack', labelKey: 'techStack' },
  { id: 'engineering', labelKey: 'engineering' },
  { id: 'contact', labelKey: 'contact' }
];

const ICON_BTN_CLASS =
  'w-9 h-9 flex items-center justify-center bg-[var(--card-color)] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--ink)] transition-all text-[var(--ink)] cursor-pointer';

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

      for (let i = SECTIONS.length - 1; i >= 0; i -= 1) {
        const element = document.getElementById(SECTIONS[i].id);
        if (element && element.offsetTop <= probe) {
          setActiveSection(SECTIONS[i].id);
          return;
        }
      }
      setActiveSection(SECTIONS[0].id);
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-color)] border-b-[3px] border-[var(--ink)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          <a href="#hero" className="flex items-center gap-3 group">
            <span className="w-10 h-10 bg-[var(--ink)] text-[var(--bg-color)] flex items-center justify-center font-mono font-black text-base uppercase">
              SC
            </span>
            <span className="flex flex-col">
              <span className="font-heading font-black text-base sm:text-lg tracking-tight text-[var(--ink)] leading-none">
                {personalData.shortName}
              </span>
              <span className="text-[11px] font-mono font-bold text-[var(--muted-color)] uppercase tracking-wider mt-1">
                {t.nav.systemsEngineer}
              </span>
            </span>
          </a>

          <nav className="hidden xl:flex items-center gap-2" aria-label="Primary">
            {SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className="relative px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border border-[var(--ink)] transition-colors bg-[var(--card-color)] overflow-hidden"
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[var(--ink)]"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? 'text-[var(--bg-color)]' : 'text-[var(--ink)]'}`}>
                    {t.nav[section.labelKey]}
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleTheme}
              className={`${ICON_BTN_CLASS} hover:bg-[var(--accent-lime)] hover:text-[var(--on-accent)]`}
              aria-label={t.nav.toggleTheme}
              title={t.nav.toggleTheme}
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4" aria-hidden="true" />
                : <Moon className="w-4 h-4" aria-hidden="true" />}
            </button>

            <button
              type="button"
              onClick={toggleLanguage}
              className={`${ICON_BTN_CLASS} gap-1 w-auto px-2.5 hover:bg-[var(--accent-pink)] hover:text-[var(--on-accent)] font-mono font-bold text-xs`}
              aria-label={`${language === 'en' ? 'ES' : 'EN'} — ${t.nav.toggleLanguage}`}
              title={t.nav.toggleLanguage}
            >
              <Languages className="w-3.5 h-3.5" aria-hidden="true" />
              {language === 'en' ? 'ES' : 'EN'}
            </button>

            <a
              href="#contact"
              className="neo-btn !py-2 !px-4 !text-xs bg-[var(--accent)] text-[var(--on-accent)] ml-1"
            >
              <span>{t.nav.contactBtn}</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="xl:hidden w-10 h-10 flex items-center justify-center bg-[var(--card-color)] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-[var(--ink)] cursor-pointer"
            aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen
              ? <X className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
              : <Menu className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden border-t-[3px] border-[var(--ink)] bg-[var(--bg-color)] px-4 py-4 space-y-3 overflow-hidden max-h-[calc(100vh-72px)] overflow-y-auto"
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
                    className={`px-4 py-2.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-[var(--ink)] text-[var(--bg-color)]'
                        : 'bg-[var(--card-color)] text-[var(--ink)]'
                    }`}
                  >
                    <span>{t.nav[section.labelKey]}</span>
                    {isActive && <span aria-hidden="true">●</span>}
                  </a>
                );
              })}
            </nav>

            <div className="pt-3 border-t-2 border-dashed border-[var(--ink)] flex items-center justify-between gap-3 flex-wrap">
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
                  className={`${ICON_BTN_CLASS} w-auto px-2.5 font-mono font-bold text-xs`}
                  aria-label={`${language === 'en' ? 'ES' : 'EN'} — ${t.nav.toggleLanguage}`}
                >
                  {language === 'en' ? 'ES' : 'EN'}
                </button>
              </div>

              <a
                href="#contact"
                onClick={closeMenu}
                className="neo-btn !py-2 !px-4 !text-xs bg-[var(--accent)] text-[var(--on-accent)]"
              >
                <span>{t.nav.contactBtn}</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

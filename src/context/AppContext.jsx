import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppContext } from './app-context';
import { translations } from '../data/translations';
import * as portfolioDataEn from '../data/portfolioData';
import * as portfolioDataEs from '../data/portfolioDataEs';

const THEME_KEY = 'portfolio-theme';
const LANG_KEY = 'portfolio-lang';

/**
 * Reads the theme the inline script in index.html already applied, so the
 * provider never fights the pre-paint value and the page cannot flash.
 */
function readInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* Storage can be blocked; fall through to the system preference. */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readInitialLanguage() {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = window.localStorage.getItem(LANG_KEY);
    if (stored === 'en' || stored === 'es') return stored;
  } catch {
    /* Ignore and fall back to the browser language. */
  }
  return (window.navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';
}

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState(readInitialLanguage);
  const [theme, setTheme] = useState(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* Persisting is a convenience, not a requirement. */
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem(LANG_KEY, language);
    } catch {
      /* Same as above. */
    }
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'es' : 'en'));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(() => ({
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    t: translations[language],
    data: language === 'en' ? portfolioDataEn : portfolioDataEs
  }), [language, theme, toggleLanguage, toggleTheme]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

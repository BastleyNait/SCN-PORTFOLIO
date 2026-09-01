import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';
import * as portfolioDataEn from '../data/portfolioData';
import * as portfolioDataEs from '../data/portfolioDataEs';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // language logic
  const [language, setLanguage] = useState('en');

  // theme logic (dark by default)
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const t = translations[language];
  const data = language === 'en' ? portfolioDataEn : portfolioDataEs;

  return (
    <AppContext.Provider value={{ language, toggleLanguage, theme, toggleTheme, t, data }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

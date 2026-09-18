import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from './locales/en.js';
import { ta } from './locales/ta.js';
import { hi } from './locales/hi.js';
import { te } from './locales/te.js';
import { kn } from './locales/kn.js';
import { ml } from './locales/ml.js';

export const translations = { en, ta, hi, te, kn, ml };

export const supportedLanguages = [
  { code: 'en', label: 'English (EN)', nativeName: 'English' },
  { code: 'ta', label: 'தமிழ் (Tamil)', nativeName: 'தமிழ்' },
  { code: 'hi', label: 'हिन्दी (Hindi)', nativeName: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు (Telugu)', nativeName: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം (Malayalam)', nativeName: 'മലയാളം' }
];

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('farmogram_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('farmogram_lang', currentLang);
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Enhanced t function with fallback, interpolation, and automatic snake_case humanization
  const t = (key, fallbackOrParams, maybeParams) => {
    if (!key) return '';
    const langDict = translations[currentLang] || translations.en;
    let str = langDict?.[key];
    if (str === undefined || str === null) {
      str = translations.en?.[key];
    }

    // If a string fallback was provided as 2nd argument e.g. t('key', 'Default text')
    if ((str === undefined || str === null) && typeof fallbackOrParams === 'string') {
      str = fallbackOrParams;
    }

    // If still missing, humanize the key so raw snake_case with underscores is NEVER displayed
    if (str === undefined || str === null) {
      if (typeof key === 'string') {
        str = key
          .replace(/[_-]+/g, ' ')
          .trim()
          .replace(/\b\w/g, c => c.toUpperCase());
      } else {
        str = String(key);
      }
    }

    // Determine parameter object e.g. { dist: 12 }
    const actualParams = (typeof fallbackOrParams === 'object' && fallbackOrParams !== null) 
      ? fallbackOrParams 
      : (typeof maybeParams === 'object' && maybeParams !== null ? maybeParams : null);

    if (actualParams && typeof actualParams === 'object') {
      for (const [paramKey, paramVal] of Object.entries(actualParams)) {
        str = str.replace(new RegExp(`{{${paramKey}}}|{${paramKey}}`, 'g'), String(paramVal));
      }
    }

    // Absolute guarantee: clean any remaining underscores in user-facing text
    if (typeof str === 'string' && str.includes('_')) {
      str = str.replace(/_/g, ' ');
    }

    return str;
  };

  return (
    <LanguageContext.Provider value={{
      currentLang,
      setCurrentLang,
      language: currentLang,
      setLanguage: setCurrentLang,
      t,
      supportedLanguages,
      translations
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

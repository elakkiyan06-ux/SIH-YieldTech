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

  // Enhanced t function with fallback and string interpolation e.g. {{name}} or {name}
  const t = (key, params) => {
    if (!key) return '';
    const langDict = translations[currentLang] || translations.en;
    let str = langDict?.[key];
    if (str === undefined) {
      str = translations.en?.[key];
    }
    if (str === undefined) {
      str = key;
    }
    if (params && typeof params === 'object') {
      for (const [paramKey, paramVal] of Object.entries(params)) {
        str = str.replace(new RegExp(`{{${paramKey}}}|{${paramKey}}`, 'g'), String(paramVal));
      }
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

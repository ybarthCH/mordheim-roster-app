import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getSetting, setSetting } from '../db/db';
import { LanguageContext } from './useLanguage';
import type { Language } from './useLanguage';
import { uiDictionary } from '../i18n/ui';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    getSetting<Language>('language').then((saved) => {
      if (saved) setLanguageState(saved);
    });
  }, []);

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    setSetting('language', l);
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    const entry = uiDictionary[key];
    const raw = entry ? (entry[language] ?? entry.fr) : key;
    if (!params) return raw;
    return raw.replace(/\{(\w+)\}/g, (match, token) => (token in params ? String(params[token]) : match));
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getSetting, setSetting } from '../db/db';
import { LanguageContext } from './useLanguage';
import type { Language } from './useLanguage';
import { uiDictionary } from '../i18n/ui';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    getSetting<Language>('language').then((saved) => {
      if (saved) setLanguageState(saved);
    });
  }, []);

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    setSetting('language', l);
  };

  const t = (key: string) => {
    const entry = uiDictionary[key];
    if (!entry) return key;
    return entry[language] ?? entry.fr;
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

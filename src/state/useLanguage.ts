import { createContext, useContext } from 'react';

export type Language = 'fr' | 'en';

export type LanguageContextValue = {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: string) => string;
};

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage doit être utilisé dans un LanguageProvider');
  return ctx;
}

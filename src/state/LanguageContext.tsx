import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { getSetting, setSetting } from '../db/db';
import { LanguageContext } from './useLanguage';
import type { Language } from './useLanguage';
import { uiDictionary } from '../i18n/ui';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  // Voir le même motif dans GameRulesContext/ThemeContext : un changement de
  // langue déclenché avant la fin du chargement IndexedDB ne doit pas être
  // écrasé par la valeur persistée une fois ce chargement terminé.
  const modifiedBeforeLoad = useRef(false);

  useEffect(() => {
    getSetting<Language>('language').then((saved) => {
      if (saved && !modifiedBeforeLoad.current) setLanguageState(saved);
    });
  }, []);

  const setLanguage = useCallback((l: Language) => {
    modifiedBeforeLoad.current = true;
    setLanguageState(l);
    setSetting('language', l);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const entry = uiDictionary[key];
      const raw = entry ? (entry[language] ?? entry.fr) : key;
      if (!params) return raw;
      return raw.replace(/\{(\w+)\}/g, (match, token) => (token in params ? String(params[token]) : match));
    },
    [language]
  );

  // value mémoïsé : sans ça, un nouvel objet littéral à chaque rendu de
  // LanguageProvider re-rendrait tous les consommateurs de useLanguage()
  // (donc quasi tout l'arbre, t() étant utilisé partout), même quand la
  // langue n'a pas changé.
  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

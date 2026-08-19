import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { getSetting, setSetting } from '../db/db';
import { ThemeContext } from './useTheme';
import type { Theme } from './useTheme';

function systemPrefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

// Miroir de --accent (palette rouge, seule restante) pour les deux thèmes —
// la barre de statut mobile (theme-color) lit une balise <meta> statique,
// indépendante du CSS, donc on la met à jour à la main.
const ACCENT_COLORS: Record<'light' | 'dark', string> = {
  light: '#7a1414',
  dark: '#c94f4f',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [systemDark, setSystemDark] = useState(systemPrefersDark());
  // Un choix fait avant la fin du chargement IndexedDB (ouverture rapide des
  // réglages, appareil lent) ne doit pas être écrasé par la valeur persistée
  // une fois ce chargement terminé — voir le même motif dans GameRulesContext.
  const modifiedBeforeLoad = useRef(false);

  useEffect(() => {
    getSetting<Theme>('theme').then((saved) => {
      if (saved && !modifiedBeforeLoad.current) setThemeState(saved);
    });
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, []);

  const effectiveTheme: 'light' | 'dark' =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    document.documentElement.dataset.theme = effectiveTheme;
  }, [effectiveTheme]);

  useEffect(() => {
    const meta = document.getElementById('meta-theme-color');
    meta?.setAttribute('content', ACCENT_COLORS[effectiveTheme]);
  }, [effectiveTheme]);

  const setTheme = useCallback((t: Theme) => {
    modifiedBeforeLoad.current = true;
    setThemeState(t);
    setSetting('theme', t);
  }, []);

  const value = useMemo(
    () => ({ theme, effectiveTheme, setTheme, palette: 'rouge' as const }),
    [theme, effectiveTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

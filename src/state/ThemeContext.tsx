import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getSetting, setSetting } from '../db/db';
import { ThemeContext } from './useTheme';
import type { Palette, Theme } from './useTheme';

function systemPrefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

// Miroir des couleurs --accent définies dans index.css pour chaque
// combinaison thème/palette — la barre de statut mobile (theme-color) lit
// une balise <meta> statique, indépendante du CSS, donc on la met à jour à
// la main pour qu'elle suive la sélection de l'utilisateur au lieu de
// rester bloquée sur le rouge par défaut.
const ACCENT_COLORS: Record<'light' | 'dark', Record<Palette, string>> = {
  light: { rouge: '#7a1414', noir: '#3a4149' },
  dark: { rouge: '#c94f4f', noir: '#7b8590' },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [systemDark, setSystemDark] = useState(systemPrefersDark());

  useEffect(() => {
    getSetting<Theme>('theme').then((saved) => {
      if (saved) setThemeState(saved);
    });
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, []);

  const effectiveTheme: 'light' | 'dark' =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  // Palette dérivée du thème plutôt que réglage indépendant : Sang est
  // toujours sombre, Ice Metal toujours clair (voir la note dans
  // useTheme.ts) — deux combinaisons (clair+rouge, sombre+noir) existent
  // encore dans index.css mais ne sont plus atteignables depuis l'UI.
  const palette: Palette = effectiveTheme === 'dark' ? 'rouge' : 'noir';

  useEffect(() => {
    document.documentElement.dataset.theme = effectiveTheme;
  }, [effectiveTheme]);

  useEffect(() => {
    document.documentElement.dataset.palette = palette;
  }, [palette]);

  useEffect(() => {
    const meta = document.getElementById('meta-theme-color');
    meta?.setAttribute('content', ACCENT_COLORS[effectiveTheme][palette]);
  }, [effectiveTheme, palette]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    setSetting('theme', t);
  }, []);

  // value mémoïsé : sans ça, un nouvel objet littéral à chaque rendu de
  // ThemeProvider re-rendrait tous les consommateurs de useTheme(), même
  // quand ni le thème ni la palette n'ont changé.
  const value = useMemo(
    () => ({ theme, effectiveTheme, setTheme, palette }),
    [theme, effectiveTheme, setTheme, palette]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

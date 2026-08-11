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
  const [palette, setPaletteState] = useState<Palette>('rouge');

  useEffect(() => {
    getSetting<Theme>('theme').then((saved) => {
      if (saved) setThemeState(saved);
    });
    getSetting<Palette>('palette').then((saved) => {
      if (saved) setPaletteState(saved);
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

  const setPalette = useCallback((p: Palette) => {
    setPaletteState(p);
    setSetting('palette', p);
  }, []);

  // value mémoïsé : sans ça, un nouvel objet littéral à chaque rendu de
  // ThemeProvider re-rendrait tous les consommateurs de useTheme(), même
  // quand ni le thème ni la palette n'ont changé.
  const value = useMemo(
    () => ({ theme, effectiveTheme, setTheme, palette, setPalette }),
    [theme, effectiveTheme, setTheme, palette, setPalette]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

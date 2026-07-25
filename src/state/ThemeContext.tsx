import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getSetting, setSetting } from '../db/db';
import { ThemeContext } from './useTheme';
import type { Palette, Theme } from './useTheme';

function systemPrefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

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

  const setTheme = (t: Theme) => {
    setThemeState(t);
    setSetting('theme', t);
  };

  const setPalette = (p: Palette) => {
    setPaletteState(p);
    setSetting('palette', p);
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme, palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

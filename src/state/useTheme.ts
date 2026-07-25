import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type Palette = 'rouge' | 'noir';

export type ThemeContextValue = {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (t: Theme) => void;
  palette: Palette;
  setPalette: (p: Palette) => void;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  return ctx;
}

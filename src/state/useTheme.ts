import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type Palette = 'rouge' | 'noir';

export type ThemeContextValue = {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (t: Theme) => void;
  // Dérivée de effectiveTheme, plus un réglage indépendant : le thème Sang
  // est toujours sombre, le thème Ice Metal toujours clair — un seul
  // sélecteur (thème) au lieu de deux réglages qui pouvaient produire des
  // combinaisons non maintenues (clair+rouge, sombre+noir).
  palette: Palette;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  return ctx;
}

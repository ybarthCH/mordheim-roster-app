import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark' | 'system';
// Une seule palette (Sang/rouge) reste jouée — voir la décision projet qui a
// retiré Ice Metal. Type conservé (plutôt qu'un simple littéral inline) pour
// que les appelants existants (Icon.tsx notamment) n'aient pas à changer.
export type Palette = 'rouge';

export type ThemeContextValue = {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (t: Theme) => void;
  palette: Palette;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  return ctx;
}

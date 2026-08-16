// Thème clair retiré (voir décision projet) : l'application est figée sur
// le thème Sang (sombre, palette rouge) — plus de sélecteur, plus de
// détection système. Cette valeur constante remplace l'ancien
// ThemeContext/ThemeProvider ; conservée sous forme de hook pour que les
// consommateurs (Icon.tsx notamment) n'aient pas à changer d'API.
const THEME_VALUE = {
  theme: 'dark' as const,
  effectiveTheme: 'dark' as const,
  palette: 'rouge' as const,
};

export type Palette = 'rouge';

export function useTheme() {
  return THEME_VALUE;
}

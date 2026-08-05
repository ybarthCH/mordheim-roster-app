import { useEffect, useState } from 'react';

// Seuil au-delà duquel le roster et la fiche personnage s'affichent côte à
// côte (voir RosterRoute) plutôt qu'en navigation plein écran. La colonne
// liste passe systématiquement en mode carte compact (voir
// .roster-split__list dans index.css), donc ce seuil n'a pas besoin de
// rester au-dessus des 720px de MemberGroupCard — il vise plutôt à inclure
// les pliables dépliés et les tablettes, tout en excluant les téléphones
// classiques en portrait. Référence : Pixel 10 Pro Fold déplié ≈ 692px CSS,
// mais ce chiffre varie avec le réglage Android « taille d'affichage »/zoom
// (une police système plus grande réduit la largeur effective en px CSS) —
// on garde donc une marge de sécurité sous 692 plutôt que de coller pile
// dessus.
export const SPLIT_VIEW_QUERY = '(min-width: 640px)';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

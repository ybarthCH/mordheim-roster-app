import { useEffect, useState } from 'react';

// Seuil au-delà duquel le roster et la fiche personnage s'affichent côte à
// côte (voir RosterRoute) plutôt qu'en navigation plein écran. Volontairement
// au-dessus du seuil desktop/mobile de MemberGroupCard (720px, index.css) et
// du mode portrait des tablettes (~768px), pour ne couvrir que les écrans où
// deux colonnes tiennent confortablement.
export const SPLIT_VIEW_QUERY = '(min-width: 900px)';

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

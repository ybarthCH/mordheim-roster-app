import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// HashRouter ne recharge jamais la page : sans ça, naviguer vers un nouvel
// écran garde la position de scroll de l'écran précédent au lieu de repartir
// du haut.
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

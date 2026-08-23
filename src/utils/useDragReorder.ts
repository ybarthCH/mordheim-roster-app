import { useEffect, useRef, useState } from 'react';

// Réordonnancement tactile/souris par glisser-déposer, sans dépendance
// externe (Pointer Events couvrent souris/tactile/stylet uniformément) —
// remplace les anciens boutons ↑/↓. Le survol met à jour l'ordre affiché en
// direct (comme un vrai drag natif) ; seul le relâchement du pointeur
// déclenche `onReorder`, pour ne pas spammer la persistance à chaque frame.
// L'élément glissé lui-même reste dans le flux normal (opacité réduite,
// pour garder sa hauteur exacte et des rects fiables pour les autres) —
// c'est une vignette flottante séparée (voir pointerPos) qui suit le
// curseur/doigt à l'écran.
//
// `refItem` prend une variante (ex : "table" / "card") car un même membre
// est monté deux fois en parallèle — tableau desktop ET cartes mobiles,
// l'une des deux étant seulement masquée en CSS (display: none) selon la
// largeur d'écran, pas démontée. Sans cette distinction, la dernière
// variante à s'attacher (les cartes, rendues après le tableau) écrasait
// systématiquement la référence de l'autre dans la Map : sur desktop, où
// c'est le tableau qui est visible, le calcul de position utilisait alors
// le rect d'un élément caché (donc toujours 0×0), et la figurine glissée
// atterrissait invariablement en fin de liste, sans retour visuel fiable.
export function useDragReorder<T extends { instance_id: string }>(
  items: T[],
  onReorder: (nouvelOrdre: T[]) => void
) {
  const [ordreEnCours, setOrdreEnCours] = useState<T[] | null>(null);
  const [idEnCours, setIdEnCours] = useState<string | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const refsElements = useRef<Map<string, HTMLElement>>(new Map());

  const refItem = (variante: string, id: string) => (el: HTMLElement | null) => {
    const cle = `${variante}:${id}`;
    if (el) refsElements.current.set(cle, el);
    else refsElements.current.delete(cle);
  };

  // Rect de la variante actuellement visible pour cet id (l'autre étant
  // masquée en CSS, donc une boîte 0×0 — écartée).
  const rectVisible = (id: string): DOMRect | null => {
    for (const variante of ['table', 'card']) {
      const el = refsElements.current.get(`${variante}:${id}`);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 || rect.height > 0) return rect;
    }
    return null;
  };

  const demarrerDrag = (id: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIdEnCours(id);
    setOrdreEnCours(items);
    setPointerPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!idEnCours) return;

    const onMove = (e: PointerEvent) => {
      setPointerPos({ x: e.clientX, y: e.clientY });
      setOrdreEnCours((current) => {
        if (!current) return current;
        const dragged = current.find((it) => it.instance_id === idEnCours);
        if (!dragged) return current;
        const autres = current.filter((it) => it.instance_id !== idEnCours);
        let cible = autres.length;
        for (let i = 0; i < autres.length; i++) {
          const rect = rectVisible(autres[i].instance_id);
          if (!rect) continue;
          if (e.clientY < rect.top + rect.height / 2) {
            cible = i;
            break;
          }
        }
        const nouveau = [...autres.slice(0, cible), dragged, ...autres.slice(cible)];
        const inchange = nouveau.length === current.length && nouveau.every((it, i) => it.instance_id === current[i].instance_id);
        return inchange ? current : nouveau;
      });
    };

    const onFin = () => {
      setIdEnCours(null);
      setPointerPos(null);
      setOrdreEnCours((current) => {
        if (current) onReorder(current);
        return null;
      });
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onFin);
    window.addEventListener('pointercancel', onFin);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onFin);
      window.removeEventListener('pointercancel', onFin);
    };
  }, [idEnCours, onReorder]);

  return {
    elements: ordreEnCours ?? items,
    refItem,
    demarrerDrag,
    idEnCours,
    pointerPos,
  };
}

import { useEffect, useRef, useState } from 'react';

// Réordonnancement tactile/souris par glisser-déposer, sans dépendance
// externe (Pointer Events couvrent souris/tactile/stylet uniformément) —
// remplace les anciens boutons ↑/↓. Le survol met à jour l'ordre affiché en
// direct (comme un vrai drag natif) ; seul le relâchement du pointeur
// déclenche `onReorder`, pour ne pas spammer la persistance à chaque frame.
export function useDragReorder<T extends { instance_id: string }>(
  items: T[],
  onReorder: (nouvelOrdre: T[]) => void
) {
  const [ordreEnCours, setOrdreEnCours] = useState<T[] | null>(null);
  const [idEnCours, setIdEnCours] = useState<string | null>(null);
  const refsElements = useRef<Map<string, HTMLElement>>(new Map());

  const refItem = (id: string) => (el: HTMLElement | null) => {
    if (el) refsElements.current.set(id, el);
    else refsElements.current.delete(id);
  };

  const demarrerDrag = (id: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIdEnCours(id);
    setOrdreEnCours(items);
  };

  useEffect(() => {
    if (!idEnCours) return;

    const onMove = (e: PointerEvent) => {
      setOrdreEnCours((current) => {
        if (!current) return current;
        const dragged = current.find((it) => it.instance_id === idEnCours);
        if (!dragged) return current;
        const autres = current.filter((it) => it.instance_id !== idEnCours);
        let cible = autres.length;
        for (let i = 0; i < autres.length; i++) {
          const el = refsElements.current.get(autres[i].instance_id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
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
  };
}

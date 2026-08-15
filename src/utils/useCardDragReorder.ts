import { useEffect, useRef, useState } from 'react';

// Réordonnancement par glisser-déposer directement sur toute la carte, sans
// poignée dédiée (contrairement à useDragReorder, pensé pour une petite
// poignée qui n'a pas besoin de faire la différence entre "clic" et
// "début de glisser" puisqu'elle ne déclenche aucune navigation elle-même).
// Ici la carte entière est aussi cliquable (ouvre la bande), donc chaque
// pointerdown est d'abord une simple "intention" : le drag ne s'engage
// réellement qu'après un déplacement de quelques pixels (SEUIL_PX). En
// dessous du seuil au relâchement, on laisse le clic normal suivre son
// cours (navigation) ; au-dessus, on avale ce clic pour ne pas naviguer
// après un glisser.
const SEUIL_PX = 8;

export function useCardDragReorder<T extends { id: string }>(
  items: T[],
  onReorder: (nouvelOrdre: T[]) => void
) {
  const [ordreEnCours, setOrdreEnCours] = useState<T[] | null>(null);
  const [idEnCours, setIdEnCours] = useState<string | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const refsElements = useRef<Map<string, HTMLElement>>(new Map());
  const enAttente = useRef<{ id: string; x: number; y: number; pointerId: number; el: HTMLElement } | null>(null);
  // true dès que le seuil est dépassé pour ce cycle pointerdown→pointerup —
  // consulté par onCardClick pour savoir s'il doit avaler le clic qui suit.
  const dragReelRef = useRef(false);

  const refItem = (id: string) => (el: HTMLElement | null) => {
    if (el) refsElements.current.set(id, el);
    else refsElements.current.delete(id);
  };

  const rect = (id: string): DOMRect | null => refsElements.current.get(id)?.getBoundingClientRect() ?? null;

  const onPointerDown = (id: string) => (e: React.PointerEvent) => {
    // Bouton gauche uniquement en souris (les événements tactiles n'ont pas
    // de notion de bouton pertinente ici) ; ignore aussi les pointerdown sur
    // les boutons d'action de la carte (Export/Dupliquer/Suppr), qui ont
    // leur propre gestionnaire de clic et ne doivent pas amorcer un drag.
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('.list-item__actions')) return;
    enAttente.current = { id, x: e.clientX, y: e.clientY, pointerId: e.pointerId, el: e.currentTarget as HTMLElement };
    dragReelRef.current = false;
  };

  // Détection du seuil : tant qu'aucun drag n'est engagé, surveille les
  // déplacements globaux pour décider si l'intention posée par
  // onPointerDown devient un vrai glisser.
  useEffect(() => {
    if (idEnCours) return;
    const onMove = (e: PointerEvent) => {
      const info = enAttente.current;
      if (!info) return;
      const dx = e.clientX - info.x;
      const dy = e.clientY - info.y;
      if (Math.hypot(dx, dy) < SEUIL_PX) return;
      info.el.setPointerCapture(info.pointerId);
      dragReelRef.current = true;
      setIdEnCours(info.id);
      setOrdreEnCours(items);
      setPointerPos({ x: e.clientX, y: e.clientY });
    };
    const onUp = () => {
      enAttente.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [idEnCours, items]);

  // Une fois engagé : même logique que useDragReorder (survol met à jour
  // l'ordre affiché en direct, le relâchement persiste).
  useEffect(() => {
    if (!idEnCours) return;

    const onMove = (e: PointerEvent) => {
      setPointerPos({ x: e.clientX, y: e.clientY });
      setOrdreEnCours((current) => {
        if (!current) return current;
        const dragged = current.find((it) => it.id === idEnCours);
        if (!dragged) return current;
        const autres = current.filter((it) => it.id !== idEnCours);
        let cible = autres.length;
        for (let i = 0; i < autres.length; i++) {
          const r = rect(autres[i].id);
          if (!r) continue;
          if (e.clientY < r.top + r.height / 2) {
            cible = i;
            break;
          }
        }
        const nouveau = [...autres.slice(0, cible), dragged, ...autres.slice(cible)];
        const inchange = nouveau.length === current.length && nouveau.every((it, i) => it.id === current[i].id);
        return inchange ? current : nouveau;
      });
    };

    const onFin = () => {
      setIdEnCours(null);
      setPointerPos(null);
      enAttente.current = null;
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

  // À poser sur le onClick de la carte, à la place de l'action normale : si
  // le clic suit un vrai glisser, il est avalé plutôt que d'ouvrir la bande.
  const onCardClick = (action: () => void) => (e: React.MouseEvent) => {
    if (dragReelRef.current) {
      e.preventDefault();
      e.stopPropagation();
      dragReelRef.current = false;
      return;
    }
    action();
  };

  return {
    elements: ordreEnCours ?? items,
    refItem,
    onPointerDown,
    onCardClick,
    idEnCours,
    pointerPos,
  };
}

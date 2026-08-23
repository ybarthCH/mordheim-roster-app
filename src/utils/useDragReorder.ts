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
export function useDragReorder<T extends { instance_id: string }>(
  items: T[],
  onReorder: (nouvelOrdre: T[]) => void
) {
  const [ordreEnCours, setOrdreEnCours] = useState<T[] | null>(null);
  const [idEnCours, setIdEnCours] = useState<string | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const refsElements = useRef<Map<string, HTMLElement>>(new Map());

  const refItem = (id: string) => (el: HTMLElement | null) => {
    if (el) refsElements.current.set(id, el);
    else refsElements.current.delete(id);
  };

  const rectVisible = (id: string): DOMRect | null => refsElements.current.get(id)?.getBoundingClientRect() ?? null;

  // Vrai juste après qu'un drag démarré via demarrerDragDiffere se soit
  // réellement armé (voir ci-dessous) — remis à false au tour suivant.
  // Permet à l'appelant de distinguer, dans son propre onClick (ex : la
  // ligne du tableau qui navigue vers la fiche), un simple clic d'un
  // relâchement qui vient de terminer un glisser.
  const dragVientDeSeProduireRef = useRef(false);
  const dragVientDeSeProduire = () => dragVientDeSeProduireRef.current;

  // Variante "sans poignée dédiée" : le pointerdown se fait directement sur
  // un élément qui a par ailleurs sa propre action au clic (ex : le nom
  // d'une figurine, qui navigue vers sa fiche). Le drag ne s'arme donc
  // qu'après un déplacement minimal OU un appui prolongé sans relâcher —
  // selon ce qui arrive en premier — plutôt qu'immédiatement au
  // pointerdown : un simple clic/tap reste ainsi un clic normal.
  const DEPLACEMENT_MIN_DRAG_PX = 6;
  const APPUI_LONG_MS = 350;

  const demarrerDragDiffere = (id: string) => (e: React.PointerEvent) => {
    const element = e.currentTarget as HTMLElement;
    const pointerId = e.pointerId;
    const origineX = e.clientX;
    const origineY = e.clientY;
    let arme = false;

    const armer = (x: number, y: number) => {
      if (arme) return;
      arme = true;
      dragVientDeSeProduireRef.current = true;
      clearTimeout(minuteur);
      // setPointerCapture peut lever InvalidStateError si le pointeur n'est
      // déjà plus "actif" au moment de l'appel (observé en pratique sur un
      // geste tactile synthétique, potentiellement aussi sur un vrai
      // relâchement très rapide) — la logique de drag elle-même n'en dépend
      // pas (le useEffect ci-dessous écoute déjà pointermove/up sur window,
      // pas sur cet élément précis), la capture n'est qu'un bonus de
      // compatibilité : on l'essaie sans laisser un échec faire planter la
      // page.
      try {
        element.setPointerCapture(pointerId);
      } catch {
        // Pas grave, voir commentaire ci-dessus.
      }
      setIdEnCours(id);
      setOrdreEnCours(items);
      setPointerPos({ x, y });
    };

    const minuteur = window.setTimeout(() => armer(origineX, origineY), APPUI_LONG_MS);

    const onMoveInitial = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      const dx = ev.clientX - origineX;
      const dy = ev.clientY - origineY;
      // N'arme sur mouvement que si celui-ci est majoritairement VERTICAL :
      // réordonner est par nature un geste vertical (on monte/descend une
      // figurine dans sa liste), alors qu'un balayage majoritairement
      // horizontal correspond à une intention de défilement du tableau
      // (voir touch-action:pan-x sur .roster-table__col-nom, qui délègue
      // déjà cet axe au scroll natif — cette vérification est une seconde
      // ligne de défense indépendante du navigateur, utile si l'arbitrage
      // tactile natif ne tranche pas assez tôt). Un balayage horizontal pur
      // ne s'arme donc jamais ici ; l'appui prolongé (minuteur ci-dessus)
      // reste, lui, toujours disponible pour démarrer un drag sans bouger.
      if (Math.hypot(dx, dy) >= DEPLACEMENT_MIN_DRAG_PX && Math.abs(dy) >= Math.abs(dx)) {
        armer(ev.clientX, ev.clientY);
      }
    };
    const nettoyer = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      clearTimeout(minuteur);
      window.removeEventListener('pointermove', onMoveInitial);
      window.removeEventListener('pointerup', nettoyer);
      window.removeEventListener('pointercancel', nettoyer);
      // Laisse dragVientDeSeProduireRef à true le temps du clic de
      // compatibilité éventuel (survient de façon synchrone juste après ce
      // pointerup, dans le même tour) — remis à false au tour suivant.
      if (arme) setTimeout(() => { dragVientDeSeProduireRef.current = false; }, 0);
    };
    window.addEventListener('pointermove', onMoveInitial);
    window.addEventListener('pointerup', nettoyer);
    window.addEventListener('pointercancel', nettoyer);
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
    demarrerDragDiffere,
    dragVientDeSeProduire,
    idEnCours,
    pointerPos,
  };
}

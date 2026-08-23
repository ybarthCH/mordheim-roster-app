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
// `refItem` prend une variante (ex : "table" / "compact") car un même
// membre peut être monté deux fois en parallèle — tableau desktop ET
// lignes compactes téléphone (voir MemberGroupCard), l'une des deux étant
// seulement masquée en CSS (display: none) selon la largeur d'écran, pas
// démontée. Sans cette distinction, la dernière variante à s'attacher
// écraserait systématiquement la référence de l'autre dans la Map, et le
// calcul de position utiliserait alors le rect d'un élément caché (donc
// toujours 0×0). Les appelants à rendu unique (ex : MemberQuickList)
// peuvent utiliser n'importe quel nom de variante, y compris toujours le
// même — rectVisible ne présuppose pas quels noms existent.
export function useDragReorder<T extends { instance_id: string }>(
  items: T[],
  onReorder: (nouvelOrdre: T[]) => void
) {
  const [ordreEnCours, setOrdreEnCours] = useState<T[] | null>(null);
  const [idEnCours, setIdEnCours] = useState<string | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const refsElements = useRef<Map<string, HTMLElement>>(new Map());
  // Miroir synchrone de ordreEnCours : onFin (voir plus bas) a besoin de lire
  // l'ordre final AVANT de déclencher onReorder — appeler onReorder depuis
  // l'intérieur d'un updater fonctionnel de setOrdreEnCours (ancienne
  // version) invoque au passage le setState d'un tout autre composant
  // (RostersProvider, plusieurs niveaux plus haut), React ne garantit pas
  // qu'un tel effet de bord niché dans un updater soit appliqué de façon
  // fiable — en pratique, le nouvel ordre s'affichait bien pendant le drag
  // mais ne persistait jamais (silencieusement annulé au relâchement). Ce
  // ref permet à onFin de lire l'ordre courant puis d'appeler onReorder en
  // tant qu'appel de fonction ordinaire, hors de tout updater.
  const ordreEnCoursRef = useRef<T[] | null>(null);
  const definirOrdreEnCours = (valeur: T[] | null) => {
    ordreEnCoursRef.current = valeur;
    setOrdreEnCours(valeur);
  };

  const refItem = (variante: string, id: string) => (el: HTMLElement | null) => {
    const cle = `${variante}:${id}`;
    if (el) refsElements.current.set(cle, el);
    else refsElements.current.delete(cle);
  };

  // Rect de la variante actuellement visible pour cet id (une éventuelle
  // autre variante masquée en CSS donnant une boîte 0×0 — écartée).
  const rectVisible = (id: string): DOMRect | null => {
    const suffixe = `:${id}`;
    for (const [cle, el] of refsElements.current) {
      if (!cle.endsWith(suffixe)) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 || rect.height > 0) return rect;
    }
    return null;
  };

  const demarrerDrag = (id: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIdEnCours(id);
    definirOrdreEnCours(items);
    setPointerPos({ x: e.clientX, y: e.clientY });
  };

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
  // Remonté de 350ms : trop court, il s'armait parfois sur un simple tap un
  // peu lent (doigt qui reste posé une fraction de seconde avant de lever),
  // déclenchant un drag alors que l'intention était juste de naviguer vers
  // la fiche.
  const APPUI_LONG_MS = 2000;

  const demarrerDragDiffere = (id: string) => (e: React.PointerEvent) => {
    const element = e.currentTarget as HTMLElement;
    const pointerId = e.pointerId;
    // Souris uniquement : au tactile, un simple défilement de PAGE démarré
    // depuis cette cellule (le nom, sans poignée dédiée) est lui aussi un
    // mouvement — vertical qui plus est, la direction qu'on autorise
    // justement au drag ci-dessous. Même avec le bon touch-action (voir
    // .roster-table__col-nom), rien ne garantit que l'arbitrage tactile
    // natif tranche pour le scroll AVANT que ce seuil de quelques pixels ne
    // s'arme côté JS (observé en pratique : "appuyer sur un nom et faire
    // défiler par accident" déclenchait le drag). Au tactile, seul l'appui
    // prolongé (minuteur plus bas) arme donc le drag — la souris garde
    // l'armement immédiat au mouvement, sans ce risque de conflit.
    const pointerType = e.pointerType;
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
      definirOrdreEnCours(items);
      setPointerPos({ x, y });
    };

    const minuteur = window.setTimeout(() => armer(origineX, origineY), APPUI_LONG_MS);

    const onMoveInitial = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      // Voir le commentaire sur pointerType plus haut : au tactile, un
      // mouvement n'arme jamais — seul l'appui prolongé le fait.
      if (pointerType !== 'mouse') return;
      const dx = ev.clientX - origineX;
      const dy = ev.clientY - origineY;
      // N'arme sur mouvement que si celui-ci est majoritairement VERTICAL :
      // réordonner est par nature un geste vertical (on monte/descend une
      // figurine dans sa liste), alors qu'un balayage majoritairement
      // horizontal correspond à une intention de défilement du tableau.
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
      const current = ordreEnCoursRef.current;
      if (!current) return;
      const dragged = current.find((it) => it.instance_id === idEnCours);
      if (!dragged) return;
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
      if (!inchange) definirOrdreEnCours(nouveau);
    };

    const onFin = () => {
      const final = ordreEnCoursRef.current;
      setIdEnCours(null);
      setPointerPos(null);
      definirOrdreEnCours(null);
      if (final) onReorder(final);
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
    demarrerDragDiffere,
    dragVientDeSeProduire,
    idEnCours,
    pointerPos,
  };
}

import type { Language } from '../../state/useLanguage';
import type { EvenementExploration } from '../../data/tableExplorationEvenements';

type LigneSousTableTraduite = { resultat: string };
type LigneTresorTraduite = { element: string };
type EvenementTraduit = {
  nom?: string;
  texte?: string;
  regle?: string[];
  sousTable?: LigneSousTableTraduite[];
  sousTableTresor?: LigneTresorTraduite[];
};

// Traductions du Tableau d'Exploration (doubles/triples/.../sextuples),
// remplies progressivement — voir translateItem dans i18n/data/items.ts pour
// le même principe de repli. Clé = id de l'événement
// (src/data/tableExplorationEvenements.ts).
export const evenementsEn: Record<string, EvenementTraduit> = {};

// N'affecte que l'affichage (carte détaillée de l'événement, sous-tables) —
// le texte réellement consigné dans le journal post-bataille reste toujours
// celui de `EvenementExploration` d'origine (français), exactement comme
// pour translateItem vis-à-vis des achats d'équipement.
export function translateEvenementExploration<T extends EvenementExploration>(ev: T, language: Language): T {
  if (language !== 'en') return ev;
  const en = evenementsEn[ev.id];
  if (!en) return ev;
  return {
    ...ev,
    nom: en.nom ?? ev.nom,
    texte: en.texte ?? ev.texte,
    regle: en.regle ?? ev.regle,
    sousTable: ev.sousTable?.map((l, i) => {
      const lEn = en.sousTable?.[i];
      return lEn ? { ...l, resultat: lEn.resultat } : l;
    }),
    sousTableTresor: ev.sousTableTresor?.map((l, i) => {
      const lEn = en.sousTableTresor?.[i];
      return lEn ? { ...l, element: lEn.element } : l;
    }),
  };
}

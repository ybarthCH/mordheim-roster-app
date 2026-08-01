import type { Language } from '../../state/useLanguage';
import type { ResultatBlessureGrave } from '../../data/blessuresGraves';

type SousJetOptionTraduite = { texte: string; noteTag?: string };
type BlessureTraduite = {
  nom?: string;
  texte?: string;
  noteTag?: string;
  sousJetOptions?: SousJetOptionTraduite[];
};

// Traductions de la table des Blessures Graves (D66), remplies
// progressivement — voir translateItem dans i18n/data/items.ts pour le même
// principe de repli. Clé = id du résultat (src/data/blessuresGraves.ts).
export const blessuresEn: Record<string, BlessureTraduite> = {};

// N'affecte que l'affichage (sélecteur, en-têtes, aperçu de confirmation) —
// le texte réellement consigné dans le journal/l'historique du guerrier
// reste toujours celui de `ResultatBlessureGrave` d'origine (français),
// exactement comme pour translateItem vis-à-vis des achats d'équipement.
export function translateBlessure<T extends ResultatBlessureGrave>(r: T, language: Language): T {
  if (language !== 'en') return r;
  const en = blessuresEn[r.id];
  if (!en) return r;
  return {
    ...r,
    nom: en.nom ?? r.nom,
    texte: en.texte ?? r.texte,
    noteTag: en.noteTag ?? r.noteTag,
    sousJet: r.sousJet
      ? {
          ...r.sousJet,
          options: r.sousJet.options.map((o, i) => {
            const oEn = en.sousJetOptions?.[i];
            return oEn ? { ...o, texte: oEn.texte, noteTag: oEn.noteTag ?? o.noteTag } : o;
          }),
        }
      : r.sousJet,
  };
}

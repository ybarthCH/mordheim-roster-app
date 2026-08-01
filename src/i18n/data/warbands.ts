import type { Language } from '../../state/useLanguage';
import type {
  CompetenceSpeciale,
  EquipementListe,
  EquipementRef,
  Magie,
  Profile,
  SpecialRule,
  WarbandCatalog,
} from '../../types/catalog';

type RegleTraduite = { nom: string; texte: string; exception?: string };
type CompetenceTraduite = { nom: string; texte: string; reserve_a?: string };
type SortTraduit = { nom: string; texte: string; note?: string };
type MagieTraduite = { nom?: string; type?: string; note?: string; sorts?: SortTraduit[] };
type MarqueTraduite = { nom: string; texte?: string };
type TribuTraduite = { nom: string; texte: string };
type EquipementListeTraduite = {
  armes_cac?: (string | undefined)[];
  armes_tir?: (string | undefined)[];
  armures?: (string | undefined)[];
  divers?: (string | undefined)[];
};

type ProfileTraduit = {
  nom?: string;
  regles_speciales?: RegleTraduite[];
  competences_speciales?: Record<string, CompetenceTraduite>;
};

export type WarbandTraduite = {
  nom?: string;
  regles_speciales?: RegleTraduite[];
  profils?: Record<string, ProfileTraduit>;
  competences_speciales?: Record<string, CompetenceTraduite>;
  magie?: MagieTraduite;
  magie_variantes?: Record<string, MagieTraduite>;
  marques?: Record<string, MarqueTraduite>;
  tribus?: Record<string, TribuTraduite>;
  equipement?: Record<string, EquipementListeTraduite>;
};

// Traductions des bandes, remplies progressivement bande par bande (voir
// translateItem dans items.ts pour le même principe de repli). Clé = id de
// bande (src/data/warbands/*.json).
export const warbandsEn: Record<string, WarbandTraduite> = {};

function translateRegles(regles: SpecialRule[], en: RegleTraduite[] | undefined): SpecialRule[] {
  return regles.map((r, i) => {
    const rEn = en?.[i];
    return rEn ? { ...r, nom: rEn.nom, texte: rEn.texte, exception: rEn.exception ?? r.exception } : r;
  });
}

function translateCompetences(
  competences: CompetenceSpeciale[],
  en: Record<string, CompetenceTraduite> | undefined
): CompetenceSpeciale[] {
  return competences.map((c) => {
    const cEn = en?.[c.id];
    return cEn ? { ...c, nom: cEn.nom, texte: cEn.texte, reserve_a: cEn.reserve_a ?? c.reserve_a } : c;
  });
}

function translateMagie(magie: Magie, en: MagieTraduite | undefined): Magie {
  return {
    ...magie,
    nom: en?.nom ?? magie.nom,
    type: en?.type ?? magie.type,
    note: en?.note ?? magie.note,
    sorts: magie.sorts.map((s, i) => {
      const sEn = en?.sorts?.[i];
      return sEn ? { ...s, nom: sEn.nom, texte: sEn.texte, note: sEn.note ?? s.note } : s;
    }),
  };
}

function translateRefs(refs: EquipementRef[] | undefined, notesEn: (string | undefined)[] | undefined) {
  return refs?.map((r, i) => (notesEn?.[i] ? { ...r, note: notesEn[i] } : r));
}

function translateEquipementListe(liste: EquipementListe, en: EquipementListeTraduite | undefined): EquipementListe {
  return {
    armes_cac: translateRefs(liste.armes_cac, en?.armes_cac),
    armes_tir: translateRefs(liste.armes_tir, en?.armes_tir),
    armures: translateRefs(liste.armures, en?.armures),
    divers: translateRefs(liste.divers, en?.divers),
  };
}

function translateProfil(profil: Profile, en: ProfileTraduit | undefined): Profile {
  if (!en) return profil;
  return {
    ...profil,
    nom: en.nom ?? profil.nom,
    regles_speciales: profil.regles_speciales ? translateRegles(profil.regles_speciales, en.regles_speciales) : profil.regles_speciales,
    competences_speciales: profil.competences_speciales
      ? translateCompetences(profil.competences_speciales, en.competences_speciales)
      : profil.competences_speciales,
  };
}

// Traduit un catalogue de bande complet quand la langue courante est 'en'.
// Retombe sur le texte français d'origine pièce par pièce si la bande (ou
// une partie de son contenu) n'a pas encore de traduction dans warbandsEn —
// même principe de repli progressif que translateItem/translateSkill.
export function translateWarbandCatalog(catalogue: WarbandCatalog, language: Language): WarbandCatalog {
  if (language !== 'en') return catalogue;
  const en = warbandsEn[catalogue.id];
  if (!en) return catalogue;
  return {
    ...catalogue,
    nom: en.nom ?? catalogue.nom,
    regles_speciales: translateRegles(catalogue.regles_speciales, en.regles_speciales),
    profils: catalogue.profils.map((p) => translateProfil(p, en.profils?.[p.id])),
    competences_speciales: translateCompetences(catalogue.competences_speciales, en.competences_speciales),
    magie: catalogue.magie ? translateMagie(catalogue.magie, en.magie) : catalogue.magie,
    magie_variantes: catalogue.magie_variantes
      ? Object.fromEntries(
          Object.entries(catalogue.magie_variantes).map(([k, m]) => [k, translateMagie(m, en.magie_variantes?.[k])])
        )
      : catalogue.magie_variantes,
    marques: catalogue.marques?.map((m) => {
      const mEn = en.marques?.[m.id];
      return mEn ? { ...m, nom: mEn.nom, texte: mEn.texte ?? m.texte } : m;
    }),
    tribus: catalogue.tribus?.map((tr) => {
      const trEn = en.tribus?.[tr.id];
      return trEn ? { ...tr, nom: trEn.nom, texte: trEn.texte } : tr;
    }),
    equipement: catalogue.equipement
      ? Object.fromEntries(
          Object.entries(catalogue.equipement).map(([k, liste]) => [k, translateEquipementListe(liste, en.equipement?.[k])])
        )
      : catalogue.equipement,
  };
}

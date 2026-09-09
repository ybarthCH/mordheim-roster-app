// Recherche transversale (toutes bandes confondues) pour la page référence
// de bande (voir BandeReferenceScreen/RechercheReferenceSection) : indexe en
// lecture seule ce que l'app connaît déjà — objets, compétences,
// francs-tireurs, règles spéciales, magie — pour retrouver une règle sans
// devoir rouvrir chaque bande une par une. Ne retranscrit PAS le livre de
// règles de base (aucune donnée nouvelle créée ici, uniquement une relecture
// agrégée des données déjà auditées bande par bande).
import type { Language } from '../state/useLanguage';
import type { CompetenceSpeciale, SpecialRule, WarbandCatalog } from '../types/catalog';
import { CATALOGUES } from '../data/warbands';
import { translateWarbandCatalog } from '../i18n/data/warbands';
import { TOUS_LES_ITEMS, getItem } from '../data/items';
import { translateItem } from '../i18n/data/items';
import skillsData from '../data/skills.json';
import { translateSkill } from '../i18n/data/skills';
import { FRANCS_TIREURS } from '../data/hiredSwords';
import type { FrancTireurCatalog } from '../types/hiredSword';
import { translateHiredSword } from '../i18n/data/hiredSwords';
import { magieMineure } from '../i18n/data/minorMagic';
import { estAccesGenerique, formatCoutItem, libelleCategorie } from './shop';
import { skillCategories } from '../i18n/ui/skillCategories';

export type TypeEntreeReference = 'objet' | 'competence' | 'francTireur' | 'regleSpeciale' | 'sort';

export type EntreeReference = {
  id: string;
  type: TypeEntreeReference;
  nom: string;
  texte: string;
  // Bandes auxquelles ce contenu est propre — vide = générique/disponible à
  // toutes les bandes (objet de la Place du marché, compétence générique,
  // Magie mineure...).
  bandeNoms: string[];
  meta?: string;
};

const LISTES_EQUIPEMENT = ['armes_cac', 'armes_tir', 'armures', 'divers'] as const;

function libelleCategorieCompetence(cat: string, language: Language): string {
  const entry = skillCategories[`skillCategory.${cat}`];
  return entry ? (entry[language] ?? entry.fr) : cat;
}

function texteRegle(regle: SpecialRule): string {
  return regle.exception ? `${regle.texte} (${regle.exception})` : regle.texte;
}

function texteCompetence(comp: CompetenceSpeciale): string {
  return comp.reserve_a ? `${comp.texte} (${comp.reserve_a})` : comp.texte;
}

// Bandes qui proposent chaque objet en propre (equipement_special, ou une
// entrée de liste rapide non générique) — même filtre que EquipementReference
// (CatalogueReference.tsx) : un objet à accès générique ("commun"/"rare_N")
// n'est pas assez distinctif pour mériter un tag de bande.
function tagsObjetsParBande(catalogues: WarbandCatalog[]): Map<string, Set<string>> {
  const tags = new Map<string, Set<string>>();
  const ajouter = (itemId: string, bandeNom: string) => {
    if (!tags.has(itemId)) tags.set(itemId, new Set());
    tags.get(itemId)!.add(bandeNom);
  };
  for (const catalogue of catalogues) {
    for (const groupes of Object.values(catalogue.equipement ?? {})) {
      for (const cle of LISTES_EQUIPEMENT) {
        for (const ref of groupes[cle] ?? []) {
          const item = getItem(ref.item_id);
          if (item && !estAccesGenerique(item.acces ?? [])) ajouter(ref.item_id, catalogue.nom);
        }
      }
    }
    for (const ref of catalogue.equipement_special ?? []) {
      ajouter(ref.item_id, catalogue.nom);
    }
  }
  return tags;
}

function indexerObjets(catalogues: WarbandCatalog[], language: Language): EntreeReference[] {
  const tags = tagsObjetsParBande(catalogues);
  return TOUS_LES_ITEMS.map((itemBrut) => {
    const item = translateItem(itemBrut, language);
    const regles = item.regles_speciales?.map((r) => `${r.nom} : ${texteRegle(r)}`).join(' ') ?? '';
    return {
      id: `objet:${item.id}`,
      type: 'objet' as const,
      nom: item.nom,
      texte: [item.texte, regles].filter(Boolean).join(' '),
      bandeNoms: [...(tags.get(item.id) ?? [])].sort((a, b) => a.localeCompare(b, language)),
      meta: `${libelleCategorie(item.categorie, language)} · ${formatCoutItem(item.cout, language)}`,
    };
  });
}

function indexerCompetencesGeneriques(language: Language): EntreeReference[] {
  const entrees: EntreeReference[] = [];
  for (const [categorie, competences] of Object.entries(skillsData)) {
    for (const competenceBrute of competences) {
      const competence = translateSkill(competenceBrute, language);
      entrees.push({
        id: `competence:generique:${competence.id}`,
        type: 'competence',
        nom: competence.nom,
        texte: competence.texte ?? '',
        bandeNoms: [],
        meta: libelleCategorieCompetence(categorie, language),
      });
    }
  }
  return entrees;
}

// Compétences "Spéciale" propres à une bande (WarbandCatalog.competences_speciales,
// remplace la liste Spéciale générique pour les profils qui y ont accès) et
// les rares surcharges au niveau d'un profil précis (Profile.competences_speciales).
function indexerCompetencesSpeciales(catalogues: WarbandCatalog[], language: Language): EntreeReference[] {
  const entrees: EntreeReference[] = [];
  const libelleSpecial = libelleCategorieCompetence('special', language);
  for (const catalogue of catalogues) {
    for (const competence of catalogue.competences_speciales) {
      entrees.push({
        id: `competence:bande:${catalogue.id}:${competence.id}`,
        type: 'competence',
        nom: competence.nom,
        texte: texteCompetence(competence),
        bandeNoms: [catalogue.nom],
        meta: libelleSpecial,
      });
    }
    for (const profil of catalogue.profils) {
      for (const competence of profil.competences_speciales ?? []) {
        entrees.push({
          id: `competence:profil:${catalogue.id}:${profil.id}:${competence.id}`,
          type: 'competence',
          nom: competence.nom,
          texte: texteCompetence(competence),
          bandeNoms: [catalogue.nom],
          meta: `${libelleSpecial} — ${profil.nom}`,
        });
      }
    }
  }
  return entrees;
}

function indexerReglesSpeciales(catalogues: WarbandCatalog[]): EntreeReference[] {
  const entrees: EntreeReference[] = [];
  for (const catalogue of catalogues) {
    catalogue.regles_speciales.forEach((regle, i) => {
      entrees.push({
        id: `regle:bande:${catalogue.id}:${i}`,
        type: 'regleSpeciale',
        nom: regle.nom,
        texte: texteRegle(regle),
        bandeNoms: [catalogue.nom],
      });
    });
    for (const profil of catalogue.profils) {
      (profil.regles_speciales ?? []).forEach((regle, i) => {
        entrees.push({
          id: `regle:profil:${catalogue.id}:${profil.id}:${i}`,
          type: 'regleSpeciale',
          nom: regle.nom,
          texte: texteRegle(regle),
          bandeNoms: [catalogue.nom],
          meta: profil.nom,
        });
      });
    }
  }
  return entrees;
}

function indexerMagie(catalogues: WarbandCatalog[], language: Language): EntreeReference[] {
  const entrees: EntreeReference[] = [];
  for (const catalogue of catalogues) {
    const domaines = [catalogue.magie, ...Object.values(catalogue.magie_variantes ?? {})].filter((m) => !!m);
    for (const magie of domaines) {
      for (const sort of magie.sorts) {
        entrees.push({
          id: `sort:${catalogue.id}:${magie.nom}:${sort.id}`,
          type: 'sort',
          nom: sort.nom,
          texte: sort.texte,
          bandeNoms: [catalogue.nom],
          meta: `${magie.nom} · ${sort.resultat}`,
        });
      }
    }
  }
  const mineure = magieMineure(language);
  for (const sort of mineure.sorts) {
    entrees.push({
      id: `sort:mineure:${sort.id}`,
      type: 'sort',
      nom: sort.nom,
      texte: sort.texte,
      bandeNoms: [],
      meta: `${mineure.nom} · ${sort.resultat}`,
    });
  }
  return entrees;
}

// Francs-tireurs "de classe" uniquement (hors Dramatis Personae, personnages
// nommés uniques recrutés via une recherche post-bataille dédiée — même
// filtre que FrancsTireursReference, CatalogueReference.tsx).
function indexerFrancsTireurs(catalogues: WarbandCatalog[], language: Language): EntreeReference[] {
  const nomBande = (id: string) => catalogues.find((c) => c.id === id)?.nom ?? id;
  return FRANCS_TIREURS.filter((ft: FrancTireurCatalog) => !ft.est_dramatis_personae).map((ftBrut) => {
    const ft = translateHiredSword(ftBrut, language);
    const regles = ft.regles_speciales.map((r) => `${r.nom} : ${texteRegle(r)}`).join(' ');
    const competences = (ft.competences_speciales ?? []).map((c) => `${c.nom} : ${texteCompetence(c)}`).join(' ');
    return {
      id: `francTireur:${ft.id}`,
      type: 'francTireur' as const,
      nom: ft.nom,
      // employeurs.texte volontairement exclu : déjà représenté par bandeNoms
      // ci-dessous (tags), et une bonne partie des francs-tireurs n'ont pas
      // encore de traduction EN pour ce champ précis (repli sur le français,
      // voir translateHiredSword) — l'inclure ferait apparaître du texte
      // français au milieu d'une fiche autrement traduite dans les résultats.
      texte: [regles, competences, ft.entretien.texte].filter(Boolean).join(' '),
      bandeNoms: ft.employeurs.bande_ids.map(nomBande).sort((a, b) => a.localeCompare(b, language)),
    };
  });
}

// Index complet, à reconstruire seulement quand la langue change (voir
// RechercheReferenceSection : useMemo(() => construireIndexReference(language), [language])).
export function construireIndexReference(language: Language): EntreeReference[] {
  const catalogues = CATALOGUES.map((c) => translateWarbandCatalog(c, language));
  return [
    ...indexerObjets(catalogues, language),
    ...indexerCompetencesGeneriques(language),
    ...indexerCompetencesSpeciales(catalogues, language),
    ...indexerFrancsTireurs(catalogues, language),
    ...indexerReglesSpeciales(catalogues),
    ...indexerMagie(catalogues, language),
  ];
}

function echapperRegex(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Insensible aux accents dans les deux sens : chercher "ecu" doit trouver
// "Écu" et chercher "écu" doit aussi trouver un éventuel "ecu" non
// accentué. NFD décompose chaque caractère accentué en lettre de base +
// signe combinant séparé (ex : "é" -> "e" + U+0301), qu'il ne reste plus
// qu'à retirer. Mis en cache : les mêmes chaînes (nom/texte des entrées de
// l'index) sont normalisées à répétition à chaque frappe tant que la langue
// ne change pas, alors que la requête tapée est toujours courte — évite de
// redécomposer tout le texte d'une règle à chaque caractère saisi.
// Plage Unicode des signes diacritiques combinants (accents, cédille...),
// isolés après normalize('NFD') — construite via new RegExp(chaîne) plutôt
// qu'un littéral /[\u0300-\u036f]/ pour garder des échappements \u lisibles
// dans le fichier source plutôt que des caractères combinants bruts.
const MARQUES_COMBINANTES = new RegExp('[\u0300-\u036f]', 'g');
const cacheSansAccents = new Map<string, string>();
function sansAccents(texte: string): string {
  const enCache = cacheSansAccents.get(texte);
  if (enCache !== undefined) return enCache;
  const normalise = texte.normalize('NFD').replace(MARQUES_COMBINANTES, '');
  cacheSansAccents.set(texte, normalise);
  return normalise;
}

// Un simple .includes() faisait remonter des faux positifs à l'intérieur
// d'un autre mot (ex : chercher "carte" trouvait aussi "s'écarter", qui
// contient bien la suite de lettres "carte"). \b ne suffit pas non plus ici :
// c'est une frontière ASCII ([A-Za-z0-9_]) qui traite un caractère accentué
// comme "é" comme un caractère NON-mot, donc \bcarte\b matcherait quand même
// juste après le "é" de "écarter". On construit donc la frontière nous-mêmes
// avec \p{L}/\p{N} (lettres/chiffres Unicode, gère les accents) : la requête
// ne doit être précédée ni suivie d'un caractère de mot, sans quoi ce n'est
// qu'un fragment d'un mot plus grand. Une requête à plusieurs mots (ex.
// "Coup Précis") reste cherchée comme une phrase continue, frontières
// vérifiées seulement à ses deux extrémités. `requeteEchappeeNormalisee` est
// déjà passée sans accents (voir rechercherReference) ; `texte` est encore
// brut, normalisé ici via le cache.
function matchMotEntier(texte: string, requeteEchappeeNormalisee: string): boolean {
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${requeteEchappeeNormalisee}(?![\\p{L}\\p{N}])`, 'iu');
  return re.test(sansAccents(texte));
}

// Filtre simple, sans debounce (aucun précédent dans le code — voir
// AchatEquipementModal/RechercheObjetRareModal, qui filtrent directement à
// chaque frappe via useMemo). Les correspondances sur le nom sont priorisées
// sur celles trouvées seulement dans le texte/les tags de bande.
export function rechercherReference(index: EntreeReference[], query: string, language: Language): EntreeReference[] {
  const q = query.trim();
  if (!q) return [];
  const qEchappee = echapperRegex(sansAccents(q));
  const matchNom: EntreeReference[] = [];
  const matchAutre: EntreeReference[] = [];
  for (const entree of index) {
    if (matchMotEntier(entree.nom, qEchappee)) {
      matchNom.push(entree);
    } else if (
      matchMotEntier(entree.texte, qEchappee) ||
      entree.bandeNoms.some((b) => matchMotEntier(b, qEchappee))
    ) {
      matchAutre.push(entree);
    }
  }
  const tri = (a: EntreeReference, b: EntreeReference) => a.nom.localeCompare(b.nom, language);
  return [...matchNom.sort(tri), ...matchAutre.sort(tri)];
}

// Achat/gestion d'équipement structuré : shop commun (base d'objets extraite
// du compendium "Place du Marché") + listes d'équipement propres à la bande
// (catalogue.equipement / equipement_special, déjà utilisées en référence
// libre par EquipementReference). Pas de gestion de rareté ni de phase
// d'achat dédiée : simple déduction de trésorerie, à tout moment.
import { v4 as uuidv4 } from 'uuid';
import type { Member, RosterInstance, InventoryEntry, CustomItem, CustomItemOverride } from '../types/roster';
import type { WarbandCatalog, Profile, SpecialRule, Stats } from '../types/catalog';
import { STAT_KEYS } from '../types/catalog';
import { TOUS_LES_ITEMS, getItem } from '../data/items';
import { appliquerDeltaSurNotation } from './statsVariables';
import { estSorcier } from './magie';
import type { IconName } from '../components/common/Icon';
import { DEFAULT_GAME_RULES } from '../types/rules';
import type { GameRules } from '../types/rules';
import type { Language } from '../state/useLanguage';

// Profil de caractéristiques d'une monture/créature (items/montures.json) :
// valeurs habituellement numériques, mais certaines notations spéciales
// restent du texte (ex : Force "3(4)" pour une charge d'araignée géante).
export type StatsMonture = { [K in keyof Stats]: number | string };

// Sous-résultat déterminé par un jet de dé fait au moment de l'achat (ex :
// Carte de Mordheim, résolue par 1D6) — même principe que SousJetSpec pour
// les blessures graves (voir data/blessuresGraves.ts), mais résolu une seule
// fois à l'achat plutôt qu'au fil d'un assistant multi-étapes.
export type SousJetAchatOption = {
  valeurs: number[];
  label: string;
  texte: string;
};

export type SousJetAchatSpec = {
  de: '1D6';
  options: SousJetAchatOption[];
};

export type ShopItem = {
  id: string;
  nom: string;
  categorie: string;
  cout: number | string;
  // Prix officiel avant l'éventuelle réduction de la règle avancée de
  // poudre noire. Présent uniquement sur les armes concernées.
  cout_officiel?: number | string;
  cout_fixe?: boolean;
  disponibilite?: string;
  rarete?: string;
  texte?: string | null;
  portee?: string | null;
  force?: string | null;
  sauvegarde?: string | null;
  regles_speciales?: SpecialRule[];
  // Présent uniquement sur les objets dont l'effet dépend d'un jet fait au
  // moment de l'achat (ex : Carte de Mordheim) — voir SousJetAchatSpec.
  sous_jet_achat?: SousJetAchatSpec;
  // Résultat déjà résolu du sous_jet_achat pour UN exemplaire particulier —
  // uniquement présent sur un ShopItem reconstruit depuis une InventoryEntry
  // (voir resolveItemDetail), jamais sur l'entrée catalogue brute.
  // `regles_speciales` reste la liste complète non résolue ; c'est ce champ
  // qu'il faut afficher partout où l'effet réel de CET exemplaire compte.
  resultatSousJetAchat?: { jet: number; optionIndex: number; label: string; texte: string };
  // Profil de caractéristiques (montures/créatures) — présent seulement pour
  // la catégorie "montures".
  stats?: StatsMonture;
  // Modification permanente des caractéristiques du membre à l'achat (ex :
  // mutations de la Kermesse du Chaos). Appliquée une seule fois au moment
  // de l'achat, jamais annulée automatiquement si l'objet est revendu.
  stats_delta?: Partial<Record<keyof Stats, number>>;
  origine: 'commun' | 'bande' | 'personnalise';
  // true si une surcharge locale (voir CustomItemOverride) a été appliquée à
  // un objet du catalogue officiel pour cette bande — purement indicatif
  // pour l'UI (badge + option de revert), n'affecte jamais la résolution.
  surcharge?: boolean;
};

// "C à C" (corps à corps) est la seule valeur de portée non numérique du
// catalogue — stockée telle quelle en français faute d'unité universelle,
// à traduire à l'affichage plutôt que dans chacune des ~60 entrées JSON.
// Les autres notations ("U", "U+1", distances en pas...) restent
// inchangées : ce sont des abréviations de jeu, pas du texte français.
export function traduirePortee(portee: string, language: Language): string {
  return portee === 'C à C' && language === 'en' ? 'Hand-to-hand' : portee;
}

// Résumé compact des stats de jeu d'un objet (portée/force/sauvegarde/noms
// des règles spéciales), utilisé comme synopsis dans la liste d'achat. Se
// rabat sur le texte d'ambiance si l'objet n'a pas de stats structurées
// (la plupart des objets divers/consommables/poisons).
export function resumeItem(item: ShopItem, language: Language = 'fr'): string | null {
  const parties: string[] = [];
  if (item.portee) parties.push(`${language === 'en' ? 'Range' : 'Portée'} ${traduirePortee(item.portee, language)}`);
  if (item.force) parties.push(`${language === 'en' ? 'Strength' : 'Force'} ${item.force}`);
  if (item.sauvegarde) parties.push(`${language === 'en' ? 'Save' : 'Sauvegarde'} ${item.sauvegarde}`);
  if (item.resultatSousJetAchat) parties.push(item.resultatSousJetAchat.label);
  else if (item.regles_speciales?.length) parties.push(item.regles_speciales.map((r) => r.nom).join(', '));
  if (parties.length > 0) return parties.join(' · ');
  return item.texte ?? null;
}

// "12 po" pour un coût numérique, ou la notation telle quelle (ex : "10+1D6",
// "x4") sinon — un coût d'objet non fixe reste une formule à résoudre à la
// main, pas un montant en po.
export function formatCoutItem(cout: number | string, language: Language = 'fr'): string {
  return typeof cout === 'number' ? `${cout} ${language === 'en' ? 'gc' : 'po'}` : cout;
}

// "12 po", "25+2D6 po" ou "coût ?" pour le coût (éventuellement variable)
// d'un profil de catalogue.
export function formatCoutProfil(cout: number | null, coutNotation?: string, language: Language = 'fr'): string {
  const unite = language === 'en' ? 'gc' : 'po';
  if (cout != null) return `${cout} ${unite}`;
  if (coutNotation) return `${coutNotation} ${unite}`;
  return language === 'en' ? 'cost ?' : 'coût ?';
}

// Tags "acces" considérés comme ouverts à toutes les bandes dans la base
// d'objets (items/*.json) : "commun" strict, "rare_N" (rare mais sans
// restriction de bande), "commun_sauf_..." (commun avec une exception
// mineure), "commun_ou_rare_N" (variante commun/rare selon les éditions —
// dans les deux cas accessible sans restriction de bande) et
// "jeteurs_de_sorts" (réservé aux jeteurs de sorts par le texte de règle,
// mais sans restriction de bande particulière — contrairement au Grimoire de
// magie, dont le texte exclut explicitement Répurgateurs et Sœurs de Sigmar,
// voir "jeteurs_de_sorts_sauf_witch_hunters_sisters_of_sigmar" plus bas).
// Attention : les tags "commun_<bande ou rôle>" SANS "_sauf_" (ex :
// "commun_pirates", "commun_heros", "commun_pretres_guerriers_soeurs_de_sigmar")
// signifient l'inverse — l'objet est licite/pas cher UNIQUEMENT pour ce
// groupe précis, donc restreint, pas générique. Ils restent donc exclus du
// shop commun ici ; le cas "commun_heros" (Héros uniquement, ex : Cuir durci)
// est réintroduit pour les héros directement dans le filtre de
// getShopCommun() ci-dessous, où le profil ciblé est connu.
export function estAccesGenerique(acces: string[]): boolean {
  return acces.some(
    (a) =>
      a === 'commun' ||
      a === 'jeteurs_de_sorts' ||
      /^rare_\d+$/.test(a) ||
      /^rare_\d+_sauf_.+$/.test(a) ||
      a.startsWith('commun_sauf_') ||
      /^commun_ou_rare_\d+$/.test(a)
  );
}

// Bandes humaines "classiques" au sens large (mercenaires de l'Empire,
// répurgateurs, gladiateurs, artilleurs, Norses, gardiens bretonniens,
// sœurs de Sigmar...) — sert à résoudre le tag "commun_humains" utilisé par
// certains objets (montures notamment), qui ne correspond à aucun id de
// catalogue précis contrairement aux autres tags "commun_<bande>".
const CATALOGUES_HUMAINS = new Set([
  'reiklanders',
  'averlanders',
  'ostlanders',
  'middenheimers',
  'marienburgers',
  'kislevites',
  'witch_hunters',
  'gladiateurs',
  'artilleurs_de_nuln',
  'norses',
  'gardiens_de_chapelle_bretonniens',
  'sisters_of_sigmar',
  'bandits_du_hochland',
  'chasseurs_cornus',
  'chevaliers_bretonniens',
  'escorteurs_imperiaux',
  'hors_la_loi_de_stirwood',
  'pirates',
  'tileens',
  'ostermarkers',
  'caravanes_marchandes',
  'moines_guerriers_de_cathay',
  'pilleurs_de_tombes_arabes',
  'lustrian_reavers',
]);

// Les tags "commun_sauf_X_Y" (ex : "commun_sauf_witch_hunters_sisters_of_sigmar")
// nomment une ou plusieurs bandes exclues d'un objet par ailleurs commun.
// estAccesGenerique() les traite comme génériques (l'objet reste "commun"
// pour l'affichage/le shop des autres bandes) — c'est ici, avec l'id de
// catalogue de la bande consultée, que l'exclusion doit réellement
// s'appliquer. Les ids de bande contenant eux-mêmes des "_" (ex :
// "carnival_of_chaos", "cult_of_the_possessed") et ne correspondant pas
// toujours au fragment du tag (ex : tag "hommes_betes" vs id de catalogue
// "beastmen_raiders"), chaque tag connu est mappé explicitement plutôt que
// re-découpé programmatiquement.
const EXCLUSIONS_COMMUN_SAUF: Record<string, string[]> = {
  commun_sauf_witch_hunters_sisters_of_sigmar: ['witch_hunters', 'sisters_of_sigmar'],
  commun_sauf_hommes_betes: ['beastmen_raiders'],
  commun_sauf_carnival_of_chaos_undead: ['carnival_of_chaos', 'undead'],
  commun_sauf_cult_of_the_possessed_undead: ['cult_of_the_possessed', 'undead'],
};

// Un objet "commun_<bande>" (restreint à un groupe précis, donc exclu du
// shop générique par estAccesGenerique) reste accessible pour la bande
// concernée : soit l'id du catalogue est listé tel quel dans `acces` (ex :
// "gobelins_de_la_nuit", "undead"), soit la bande appartient au tag de
// groupe "commun_humains". Utilisé pour que les montures et autres objets
// à accès restreint apparaissent dans le shop commun d'une bande éligible.
export function estAccesPourCatalogue(acces: string[], catalogueId: string): boolean {
  if (acces.includes(`rare_9_sauf_${catalogueId}`)) return false;
  if (acces.some((a) => EXCLUSIONS_COMMUN_SAUF[a]?.includes(catalogueId))) return false;
  if (estAccesGenerique(acces)) return true;
  if (acces.includes(catalogueId)) return true;
  if (acces.includes('commun_humains') && CATALOGUES_HUMAINS.has(catalogueId)) return true;
  if (
    acces.includes('jeteurs_de_sorts_sauf_witch_hunters_sisters_of_sigmar') &&
    catalogueId !== 'witch_hunters' &&
    catalogueId !== 'sisters_of_sigmar'
  ) {
    return true;
  }
  return false;
}

// Les fichiers items/*.json et les listes d'équipement de bande utilisent des
// clés de catégorie différentes pour la même chose (armes_corps_a_corps vs
// armes_cac...). Normalisées ici pour que les filtres de catégorie du modal
// d'achat fonctionnent quelle que soit la source de l'objet.
const CATEGORIE_CANONIQUE: Record<string, string> = {
  armes_corps_a_corps: 'armes_cac',
  objets_divers: 'divers',
};

function normaliserCategorie(categorie: string): string {
  return CATEGORIE_CANONIQUE[categorie] ?? categorie;
}

// `armes_tir` et `armes_poudre_noire` restent deux catégories distinctes
// (une bande comme les Artilleurs de Nuln n'a le droit qu'à la seconde,
// les Elfes Noirs bannissent uniquement la première) : un profil qui doit
// perdre tout accès aux armes de tir au sens large (ex : Flagellant) liste
// donc explicitement les deux dans `categories_interdites`, plutôt que de
// s'appuyer sur un regroupement implicite. `munitions` (grenades, flèches
// spéciales...) suit ce même couple : bloqué seulement si les deux sont
// interdites, signe qu'un profil n'a plus aucune capacité de tir.
//
// `armes_de_jet` cible un sous-type au sein d'`armes_tir` (voir le champ
// `sous_type` sur les items concernés dans data/items/armes_tir.json) —
// utilisé par les bandes qui bannissent seulement les armes lancées à la
// main (ex : la règle Chevalerie des Gardiens de Chapelle Bretonniens) sans
// toucher aux arcs/arbalètes.
export type CategorieInterdite =
  | 'armes_cac'
  | 'armes_tir'
  | 'armes_poudre_noire'
  | 'armes_de_jet'
  | 'armures'
  | 'poisons_drogues';

// Un objet appartient-il à une catégorie interdite à ce profil (voir
// Profile.categories_interdites) ? Ne filtre que l'onglet "commun" du shop
// et la recherche d'objet rare — l'onglet "bande" (getEquipementBande) est
// déjà correctement restreint par `acces_equipement`. Comme pour
// `acces_equipement`, les compétences "Connaissance des Armes"/"Expert en
// Armes" lèvent l'interdiction pour la catégorie qu'elles couvrent.
export function estCategorieInterdite(
  categorie: string,
  profil: Profile | null | undefined,
  competencesAcquises: string[] = [],
  sousType?: string
): boolean {
  const interdictions = profil?.categories_interdites;
  if (!interdictions || interdictions.length === 0) return false;
  const c = normaliserCategorie(categorie);
  if (interdictions.includes('armes_cac') && c === 'armes_cac' && !competencesAcquises.includes(SKILL_TOUTES_ARMES_CAC)) {
    return true;
  }
  if (interdictions.includes('armures') && c === 'armures') return true;
  // Sans rapport avec le tir : vérifiée avant le court-circuit
  // SKILL_TOUTES_ARMES_TIR ci-dessous, qui ne doit lever que les
  // interdictions liées au tir (voir QA sur commit 9aa1e8f — la compétence
  // "Toutes armes de tir" ne doit jamais rendre un poison de nouveau
  // achetable à un profil qui les a par ailleurs bannis).
  if (interdictions.includes('poisons_drogues') && c === 'poisons_drogues') return true;
  if (competencesAcquises.includes(SKILL_TOUTES_ARMES_TIR)) return false;
  if (interdictions.includes('armes_tir') && c === 'armes_tir') return true;
  if (interdictions.includes('armes_poudre_noire') && c === 'armes_poudre_noire') return true;
  if (interdictions.includes('armes_de_jet') && sousType === 'jet') return true;
  if (c === 'munitions' && interdictions.includes('armes_tir') && interdictions.includes('armes_poudre_noire')) {
    return true;
  }
  return false;
}

const CATALOGUE_ARTILLEURS_NULN = 'artilleurs_de_nuln';

// Armures de corps et caparaçons concernés par la règle Lozheim. Les
// protections périphériques (boucliers, casques, cuir durci, pavois,
// rondaches, écus, capes...) sont volontairement absentes. Exporté pour
// utils/armure.ts (calcul de la statistique Sv).
export const ARMURES_LOZHEIM = new Set([
  'armure_cathayenne_soie_matelassee',
  'armure_du_chaos_market',
  'armure_en_gromril_market',
  'armure_en_ithilmar_market',
  'armure_lamellaire',
  'armure_legere',
  'armure_lourde',
  'armure_lourde_de_maitre',
  'exosquelette',
  'caparacon',
  'caparacon_bretonnien',
]);

export const TRINKETS_LIMITES = new Set([
  'porte_bonheur',
  'gnoblar_porte_bonheur',
  'herbes_de_soin',
  'patte_de_lapin',
  'amulette_de_malepierre',
  'familier',
  'parchemin_de_rat_familier',
  'relique_sacree_bretonnienne',
  'relique_sacree_sigmarite',
  // Réservés aux variantes impies lorsqu'elles seront ajoutées au catalogue.
  'relique_impie',
  'relique_maudite',
]);

// Objets d'équipement spécial limités à un exemplaire par bande par la
// règle source elle-même (pas une règle optionnelle comme TRINKETS_LIMITES
// ci-dessus — toujours appliqué, quel que soit rules.trinketsLimites).
export const ITEMS_UNIQUES_BANDE = new Set([
  // Faucon de chasse tiléen (Pillards de Lustrie) : équipement du Maître
  // des bêtes, max 1 par bande.
  'faucon_de_chasse_tileen',
  // Jolly Roger (Pirates) : "un seul par bande".
  'jolly_roger',
  // Pierrier (Pirates) : "une bande de Pirates ne peut avoir qu'un seul
  // pierrier".
  'pierrier',
  // Fouet barbelé (Maraudeurs du Chaos) : "Rare 9, un seul Héros
  // Maraudeurs du Chaos uniquement".
  'fouet_barbele',
  // Bannière du clan Pestilens (Skavens du Clan Pestilens) : "Une bande ne
  // peut avoir qu'une seule bannière du Clan Pestilens à la fois."
  'banniere_du_clan_pestilens',
  // Liber Bubonicus (Skavens du Clan Pestilens) : "une bande ne peut avoir
  // qu'un seul utilisateur du Liber Bubonicus dans une campagne donnée."
  'liber_bubonicus',
]);

// Rejoindre un groupe existant (RecruterDansGroupeModal, sélection d'un
// groupe cible dans AjouterMembreModal, recrue gratuite d'un Prisonnier
// dans ResolutionPrisonniers) clone l'inventaire du groupe pour chaque
// nouvelle figurine (voir clonerEquipementPourNouvellesFigurines) — si ce
// groupe possède déjà un trinket limité ou un objet unique de bande, la
// rejoindre dupliquerait cet objet en contournant la limite, sans jamais
// passer par les gardes-fous de l'achat direct (AchatEquipementModal,
// `trinketLimite`/`limiteUniqueBande`). Centralise le même contrôle pour
// ces trois flux.
export function groupeDupliqueraitObjetLimite(groupe: Member, rules: GameRules): boolean {
  return (
    (rules.trinketsLimites && groupe.inventaire.some((entree) => TRINKETS_LIMITES.has(entree.item_id))) ||
    groupe.inventaire.some((entree) => ITEMS_UNIQUES_BANDE.has(entree.item_id))
  );
}

// Objets "matériau" (gromril, ithilmar, obsidienne, lame elfe noire) : au
// lieu de s'acheter tels quels, ils demandent de choisir une arme/armure de
// base existante — son prix est soit multiplié (gromril/ithilmar/
// obsidienne), soit augmenté d'un montant fixe (lame elfe noire), et
// l'effet du matériau vient s'ajouter aux règles spéciales déjà en place.
// `basesAutorisees` restreint le choix à une liste d'ids précise (ex : la
// lame elfe noire ne se pose que sur une épée ou une dague) ; omis, toute la
// catégorie `categorieBase` est proposée. Voir basesPourMateriau/
// construireObjetMateriau/resolveCombinaisonMateriau ci-dessous.
type SpecMateriau = { categorieBase: string; basesAutorisees?: string[] } & (
  | { mode: 'multiplicateur'; multiplicateur: number }
  | { mode: 'addition'; montant: number }
);

// Contrairement aux armes en matériau spécial (n'importe quelle arme de
// corps à corps de base peut être améliorée, donc un vrai choix de base a du
// sens), les armures en gromril/ithilmar sont TOUJOURS des armures lourdes
// en pratique — pas un choix parmi les types d'armure. Elles s'achètent donc
// comme des objets rares autonomes à prix fixe (voir items/armures.json),
// pas via ce picker matériau+base.
export const MATERIAUX: Record<string, SpecMateriau> = {
  arme_en_gromril: { mode: 'multiplicateur', multiplicateur: 4, categorieBase: 'armes_cac' },
  arme_en_ithilmar: { mode: 'multiplicateur', multiplicateur: 3, categorieBase: 'armes_cac' },
  arme_en_obsidienne_market: { mode: 'multiplicateur', multiplicateur: 4, categorieBase: 'armes_cac' },
  lame_elfe_noire: { mode: 'addition', montant: 20, categorieBase: 'armes_cac', basesAutorisees: ['epee', 'dague'] },
};

function coutFinalMateriau(spec: SpecMateriau, coutBase: number): number {
  return spec.mode === 'multiplicateur' ? coutBase * spec.multiplicateur : coutBase + spec.montant;
}

export function estItemMateriau(id: string): boolean {
  return id in MATERIAUX;
}

// Armes/armures de base proposées pour un matériau donné : même catégorie
// (ou restreinte à `basesAutorisees` si précisé), à l'exclusion des objets
// matériau eux-mêmes (pas de gromril sur gromril), dédupliquées par id (une
// arme peut apparaître à la fois dans la liste de la bande et dans le shop
// commun).
export function basesPourMateriau(items: ShopItem[], materiauId: string): ShopItem[] {
  const spec = MATERIAUX[materiauId];
  if (!spec) return [];
  const vus = new Set<string>();
  return items
    .filter((item) => {
      if (item.categorie !== spec.categorieBase || estItemMateriau(item.id) || vus.has(item.id)) return false;
      if (spec.basesAutorisees && !spec.basesAutorisees.includes(item.id)) return false;
      vus.add(item.id);
      return true;
    })
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
}

const PREFIXE_COMBO = 'combo__';

function libelleMateriau(nomMateriau: string): string {
  return nomMateriau.replace(/^Arme en /, '').replace(/^Armure en /, '');
}

// Fusionne une arme/armure de base et un objet matériau en un objet unique
// (id synthétique combo__<baseId>__<materiauId>, résolu par
// resolveCombinaisonMateriau pour un affichage cohérent après achat).
export function construireObjetMateriau(base: ShopItem, materiau: ShopItem, coutBase: number): ShopItem {
  const spec = MATERIAUX[materiau.id];
  return {
    id: `${PREFIXE_COMBO}${base.id}__${materiau.id}`,
    nom: `${base.nom} (${libelleMateriau(materiau.nom)})`,
    categorie: base.categorie,
    cout: spec ? coutFinalMateriau(spec, coutBase) : coutBase,
    cout_fixe: true,
    rarete: materiau.rarete,
    disponibilite: materiau.disponibilite,
    texte: base.texte ?? null,
    portee: base.portee,
    force: base.force,
    sauvegarde: base.sauvegarde,
    regles_speciales: [...(base.regles_speciales ?? []), ...(materiau.regles_speciales ?? [])],
    origine: 'personnalise',
  };
}

// Reconstruit un objet base+matériau déjà acheté (id combo__<baseId>__
// <materiauId>) à partir des deux objets d'origine dans la base commune —
// utilisé par resolveItemDetail pour ré-afficher le détail complet d'un
// objet déjà dans un inventaire, sans avoir besoin de le stocker à part.
export function resolveCombinaisonMateriau(comboId: string): ShopItem | undefined {
  if (!comboId.startsWith(PREFIXE_COMBO)) return undefined;
  const [baseId, materiauId] = comboId.slice(PREFIXE_COMBO.length).split('__');
  const base = baseId ? getItem(baseId) : undefined;
  const materiau = materiauId ? getItem(materiauId) : undefined;
  if (!base || !materiau) return undefined;
  const spec = materiauId ? MATERIAUX[materiauId] : undefined;
  return {
    id: comboId,
    nom: `${base.nom} (${libelleMateriau(materiau.nom)})`,
    categorie: normaliserCategorie(base.categorie),
    cout: spec && typeof base.cout === 'number' ? coutFinalMateriau(spec, base.cout) : materiau.cout,
    cout_fixe: true,
    rarete: materiau.rarete,
    disponibilite: materiau.disponibilite,
    texte: 'texte' in base ? (base.texte as string | undefined) ?? null : null,
    portee: 'portee' in base ? (base.portee as string | null) : undefined,
    force: 'force' in base ? (base.force as string | null) : undefined,
    sauvegarde: 'sauvegarde' in base ? (base.sauvegarde as string | null) : undefined,
    regles_speciales: [...(base.regles_speciales ?? []), ...(materiau.regles_speciales ?? [])],
    origine: 'personnalise',
  };
}

function arrondirMultipleDeCinq(value: number): number {
  return Math.round(value / 5) * 5;
}

// La règle enlève environ un tiers du prix : 35 -> 25, 200 -> 135.
// Pour une notation avec dés, seule la base fixe est adaptée.
export function reduirePrixPoudreNoire(cout: number | string): number | string {
  if (typeof cout === 'number') return arrondirMultipleDeCinq((cout * 2) / 3);
  const match = cout.match(/^(\s*)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return cout;
  const base = Number(match[2].replace(',', '.'));
  return `${match[1]}${arrondirMultipleDeCinq((base * 2) / 3)}${match[3]}`;
}

type OriginePrix = 'commun' | 'bande' | 'paye';

export function prixAvecRegles(
  itemId: string,
  cout: number | string,
  catalogueId: string,
  rules: GameRules,
  origine: OriginePrix
): number | string {
  const reference = getItem(itemId);
  // Tromblon Nain du Chaos : joue toujours avec les incidents de tir (voir
  // son texte de règle), donc son prix ne suit pas la remise habituelle de
  // la règle optionnelle des armes à poudre noire — il est fixe.
  const prixFixePoudreNoire = !!reference && 'prix_poudre_noire_fixe' in reference && !!reference.prix_poudre_noire_fixe;
  const estPoudreNoire = reference?.categorie === 'armes_poudre_noire' && !prixFixePoudreNoire;
  let prix = cout;

  if (estPoudreNoire && origine !== 'paye') {
    const prixReduit = rules.poudreNoireAvancee || catalogueId === CATALOGUE_ARTILLEURS_NULN;
    if (origine === 'commun') {
      const officiel =
        reference && 'cout_officiel' in reference
          ? (reference.cout_officiel as number | string | undefined)
          : undefined;
      prix = prixReduit ? cout : (officiel ?? cout);
    } else if (prixReduit && catalogueId !== CATALOGUE_ARTILLEURS_NULN) {
      // Les listes de bande utilisent les prix officiels, sauf celle de
      // Nuln qui contient déjà ses prix réduits permanents.
      prix = reduirePrixPoudreNoire(cout);
    }
  }

  if (rules.armuresLozheim && ARMURES_LOZHEIM.has(itemId) && typeof prix === 'number') {
    prix /= 2;
  }
  return prix;
}

// Améliore d'un cran la valeur de base d'un texte de sauvegarde ("6+" ->
// "5+") sans toucher un éventuel bonus de superposition à droite ("6+/+1"
// -> "5+/+1") : la règle Lozheim renforce l'armure elle-même, pas ce
// qu'elle apporte en superposition à une autre armure (voir Sv, utils/armure.ts).
function ameliorerTexteSauvegarde(sauvegarde: string): string {
  return sauvegarde.replace(/^(\d)\+/, (_, chiffre: string) => `${Math.max(1, Number(chiffre) - 1)}+`);
}

function appliquerReglesObjet(
  item: ShopItem,
  catalogueId: string,
  rules: GameRules,
  originePrix: OriginePrix
): ShopItem {
  const lozheim = rules.armuresLozheim && ARMURES_LOZHEIM.has(item.id);
  return {
    ...item,
    cout: prixAvecRegles(item.id, item.cout, catalogueId, rules, originePrix),
    sauvegarde: lozheim && item.sauvegarde ? ameliorerTexteSauvegarde(item.sauvegarde) : item.sauvegarde,
    regles_speciales: lozheim
      ? [
          ...(item.regles_speciales ?? []),
          {
            nom: 'Règle Maison Lozheim',
            texte: "Cette armure coûte 50 % de son prix normal et accorde +1 supplémentaire à la sauvegarde d'armure.",
          },
        ]
      : item.regles_speciales,
  };
}

export function inventaireComplet(roster: RosterInstance): InventoryEntry[] {
  return [...roster.stock, ...roster.membres.flatMap((m) => m.inventaire)];
}

// Équipement de départ inclus dans le coût de recrutement d'un profil précis
// (voir sa règle spéciale), à ajouter à l'inventaire dès la création du
// membre plutôt qu'à acheter séparément — pour l'instant limité à la
// Branchanteresse des Sylvaneths (Écorce de fer I). À étendre au cas par cas
// si d'autres profils l'exigent.
export function equipementInclusDepart(catalogueId: string, profilId: string): InventoryEntry[] {
  if (catalogueId === 'sylvaneths' && profilId === 'branchanteresse') {
    const item = getItem('ecorce_de_fer');
    if (item) {
      return [{ instance_id: uuidv4(), item_id: item.id, nom: item.nom, categorie: item.categorie, cout: 0 }];
    }
  }
  // "Armes/armures : Les Snotlings ne peuvent utiliser qu'un bâton pointu
  // ou un objet quelconque similaire, qu'ils trouveront eux-mêmes sans
  // frais. Cette arme compte comme une dague." (Gobelins de la Nuit
  // [GLM].pdf p.10) — acces_equipement est vide sur ce profil (aucun
  // achat possible), donc l'arme gratuite doit être fournie ici.
  if (catalogueId === 'gobelins_de_la_nuit' && profilId === 'snotling') {
    const item = getItem('dague');
    if (item) {
      return [{ instance_id: uuidv4(), item_id: item.id, nom: item.nom, categorie: item.categorie, cout: 0 }];
    }
  }
  // "Un Kroxigor n'a accès à aucune liste d'équipement mais, contrairement
  // à l'usage, est recruté avec une hallebarde." (Hommes-Lézards [GLM].pdf
  // p.7) — même situation que le Snotling ci-dessus (acces_equipement
  // vide, arme incluse dans le coût de recrutement).
  if (catalogueId === 'hommes_lezards' && profilId === 'kroxigor') {
    const item = getItem('hallebarde');
    if (item) {
      return [{ instance_id: uuidv4(), item_id: item.id, nom: item.nom, categorie: item.categorie, cout: 0 }];
    }
  }
  // "Armes/armures : Les Boscos commencent avec une corde & grappin et
  // peuvent s'équiper d'armes et d'armures choisies dans la liste
  // d'équipement des Pirates." (Pirates [GLM].pdf p.10) — contrairement
  // aux cas ci-dessus, le Bosco garde un accès normal à sa liste
  // d'équipement ; ceci s'ajoute simplement à ce qu'il achète par ailleurs.
  if (catalogueId === 'pirates' && profilId === 'bosco') {
    const item = getItem('corde_et_grappin');
    if (item) {
      return [{ instance_id: uuidv4(), item_id: item.id, nom: item.nom, categorie: item.categorie, cout: 0 }];
    }
  }
  return [];
}

// Compte, à l'échelle de la bande, le nombre de figurines et d'objets
// d'équipement partageant un même `plafond_groupe.id` (voir Profile et
// EquipementSpecialRef dans types/catalog.ts) — ex : chez les Pillards de
// Lustrie, le Molosse estalien et le Singe de Barbarie recrutés, plus le
// Faucon de chasse tiléen acheté comme équipement, comptent ensemble dans
// le plafond des 2 Bêtes de guerre.
export function comptePlafondGroupe(catalogue: WarbandCatalog, roster: RosterInstance, groupeId: string): number {
  let total = 0;
  for (const profil of catalogue.profils) {
    if (profil.plafond_groupe?.id !== groupeId) continue;
    for (const m of roster.membres) {
      if (m.profil_id === profil.id && m.statut !== 'mort') {
        total += m.taille_groupe || 1;
      }
    }
  }
  const idsGroupe = new Set(
    (catalogue.equipement_special ?? [])
      .filter((ref) => ref.plafond_groupe?.id === groupeId)
      .map((ref) => ref.item_id)
  );
  if (idsGroupe.size > 0) {
    total += inventaireComplet(roster).filter((entree) => idsGroupe.has(entree.item_id)).length;
  }
  return total;
}

export type AvertissementTrinketLimite = {
  itemId: string;
  nom: string;
  quantite: number;
};

// Contrôle aussi bien le stock de bande que l'équipement porté. Cette
// validation reste utile pour les anciens rosters ou lorsqu'une règle est
// activée après que plusieurs exemplaires ont déjà été achetés — ou après
// qu'un roster ait pu se retrouver en double via un flux mal gardé (ex :
// avant que groupeDupliqueraitObjetLimite/RechercheObjetRareModal ne
// vérifient ITEMS_UNIQUES_BANDE). TRINKETS_LIMITES reste optionnel
// (`rules.trinketsLimites`) ; ITEMS_UNIQUES_BANDE est toujours vérifié, la
// règle source elle-même n'étant jamais optionnelle.
export function trouverTrinketsLimitesEnTrop(roster: RosterInstance, rules: GameRules): AvertissementTrinketLimite[] {
  const parItem = new Map<string, AvertissementTrinketLimite>();

  for (const entree of inventaireComplet(roster)) {
    if (!((rules.trinketsLimites && TRINKETS_LIMITES.has(entree.item_id)) || ITEMS_UNIQUES_BANDE.has(entree.item_id)))
      continue;
    const existant = parItem.get(entree.item_id);
    if (existant) {
      existant.quantite += 1;
    } else {
      parItem.set(entree.item_id, {
        itemId: entree.item_id,
        nom: getItem(entree.item_id)?.nom ?? entree.nom,
        quantite: 1,
      });
    }
  }

  return [...parItem.values()]
    .filter(({ quantite }) => quantite > 1)
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
}

export const CATEGORIE_ORDRE = [
  'armes_cac',
  'armes_tir',
  'armes_poudre_noire',
  'munitions',
  'armures',
  'divers',
  'mutations',
  'consommables',
  'poisons_drogues',
  'montures',
  'vehicules',
  'artefacts_magiques',
  'special',
];

const CATEGORIE_LABELS: Record<string, string> = {
  armes_cac: 'Corps à corps',
  armes_tir: 'Tir',
  armes_poudre_noire: 'Poudre noire',
  munitions: 'Munitions',
  armures: 'Armure',
  divers: 'Divers',
  mutations: 'Mutations',
  consommables: 'Consommable',
  poisons_drogues: 'Poison / drogue',
  montures: 'Monture',
  vehicules: 'Véhicule',
  artefacts_magiques: 'Artefact magique',
  special: 'Spécial',
};

const CATEGORIE_LABELS_EN: Record<string, string> = {
  armes_cac: 'Hand-to-hand',
  armes_tir: 'Missile',
  armes_poudre_noire: 'Black powder',
  munitions: 'Ammunition',
  armures: 'Armour',
  divers: 'Miscellaneous',
  mutations: 'Mutations',
  consommables: 'Consumable',
  poisons_drogues: 'Poison / drug',
  montures: 'Mount',
  vehicules: 'Vehicle',
  artefacts_magiques: 'Magic artefact',
  special: 'Special',
};

export function libelleCategorie(categorie: string, language: Language = 'fr'): string {
  if (language === 'en') return CATEGORIE_LABELS_EN[categorie] ?? CATEGORIE_LABELS[categorie] ?? categorie;
  return CATEGORIE_LABELS[categorie] ?? categorie;
}

const CATEGORIE_ICONES: Partial<Record<string, IconName>> = {
  armes_cac: 'epee',
  armes_tir: 'arc',
  armes_poudre_noire: 'flamme',
  munitions: 'cible',
  armures: 'bouclier',
  divers: 'gemme',
  mutations: 'crane',
  consommables: 'fiole',
  poisons_drogues: 'goutte',
  montures: 'griffe',
  artefacts_magiques: 'couronne',
  special: 'etoile',
};

export function iconeCategorie(categorie: string): IconName | undefined {
  return CATEGORIE_ICONES[categorie];
}

// Classe de badge indicative selon le niveau de rareté (score "Rare N" du
// livre de règles) : plus le nombre est élevé, plus l'objet est difficile à
// trouver. Purement décoratif, sans incidence sur les jets de disponibilité
// (toujours faits en jeu).
export function classeRarete(rarete?: string): string | null {
  if (!rarete) return null;
  const n = Number(rarete);
  if (Number.isNaN(n)) return null;
  if (n >= 10) return 'badge--rarete-danger';
  if (n >= 7) return 'badge--rarete-warning';
  return 'badge--rarete-info';
}

// Un objet est "Rare N" (par opposition à Commun/"C", ou "-" pour les objets
// sans cote applicable) dès que sa rareté est un nombre — même convention
// que classeRarete ci-dessus. Sert à distinguer les objets Rares dans
// masquerObjetsRares (voir AchatEquipementModal) : au-delà de la création
// de bande, le livre de règles n'autorise plus leur achat direct, seulement
// via un jet de recherche d'objet rare (RechercheObjetRareModal).
export function estObjetRare(rarete?: string): boolean {
  return rarete !== undefined && !Number.isNaN(Number(rarete));
}

// Mappe un objet brut (items/*.json) vers un ShopItem "commun", sans
// résolution de règles de prix (voir getShopCommun/itemVersShopItem qui
// appellent appliquerReglesObjet par-dessus).
function mapperItemVersShopItem(item: (typeof TOUS_LES_ITEMS)[number]): ShopItem {
  return {
    id: item.id,
    nom: item.nom,
    categorie: normaliserCategorie(item.categorie),
    cout: item.cout,
    cout_officiel:
      'cout_officiel' in item ? (item.cout_officiel as number | string | undefined) : undefined,
    cout_fixe: item.cout_fixe,
    disponibilite: item.disponibilite,
    rarete: item.rarete,
    texte: item.texte,
    portee: 'portee' in item ? (item.portee as string | null) : undefined,
    force: 'force' in item ? (item.force as string | null) : undefined,
    sauvegarde: 'sauvegarde' in item ? (item.sauvegarde as string | null) : undefined,
    regles_speciales: item.regles_speciales,
    sous_jet_achat: 'sous_jet_achat' in item ? (item.sous_jet_achat as SousJetAchatSpec | undefined) : undefined,
    stats: 'stats' in item ? (item.stats as StatsMonture | undefined) : undefined,
    origine: 'commun',
  };
}

// L'armure en gromril et l'armure en ithilmar du shop commun comptent
// toutes deux comme une armure lourde par leur propre texte de règle (voir
// data/items/armures.json, règle spéciale "Armure lourde") : un profil sans
// accès à l'armure lourde commune dans sa propre liste d'équipement ne peut
// donc pas non plus les porter. Contrairement à `categories_interdites`
// (interdiction affirmée à la main par profil), celle-ci se déduit
// directement de la liste d'équipement de la bande — elle couvre donc aussi
// les profils dont la liste ne mentionne simplement jamais l'armure lourde,
// sans qu'un texte de règle dédié n'ait eu besoin d'être relevé pour le dire
// explicitement (ex : le Séide des Répurgateurs, limité à l'armure légère).
const ITEMS_EQUIVALENT_ARMURE_LOURDE = new Set([
  'armure_en_gromril_market',
  'armure_en_ithilmar_market',
  'armure_du_chaos_market',
  'exosquelette',
]);

export function aAccesArmureLourde(catalogue: WarbandCatalog | undefined, profil: Profile | null | undefined): boolean {
  if (!catalogue) return true;
  const listes = catalogue.equipement ?? {};
  const clesProfil = profil?.acces_equipement ?? Object.keys(listes);
  return clesProfil.some((cle) => listes[cle]?.armures?.some((ref) => ref.item_id === 'armure_lourde'));
}

// Compétences qui donnent accès à N'IMPORTE QUELLE arme de la catégorie —
// pas seulement celles déjà présentes dans une liste d'équipement de la
// bande (cf. src/data/skills.json, texte de la compétence : "peut utiliser
// n'importe quelle arme de corps à corps/de tir, pas seulement celles de
// ses options d'équipement") : "Connaissance des Armes" (corps à corps) et
// "Expert en Armes" (tir). "Tir" couvre ici armes_tir ET armes_poudre_noire
// (les armes à poudre noire sont des armes de tir au sens des règles — la
// distinction entre les deux dans nos données sert au filtrage/à
// l'affichage de la boutique, pas à limiter la portée de cette compétence),
// ce qui inclut donc aussi les armes "Rare" de la boutique commune (ex :
// Long fusil du Hochland) qui ne figurent dans la liste d'équipement
// d'aucun profil.
const SKILL_TOUTES_ARMES_CAC = 'combat_03';
const SKILL_TOUTES_ARMES_TIR = 'tir_04';

// Ids déjà présents dans la/les liste(s) d'équipement propre(s) au profil
// pour cette catégorie (mêmes règles que getEquipementBande : repli sur
// toutes les listes de la bande si `acces_equipement` est absent). Ne gère
// pas Connaissance des Armes/Expert en Armes — voir SKILL_TOUTES_ARMES_CAC/
// SKILL_TOUTES_ARMES_TIR ci-dessus, court-circuités directement par
// l'appelant (armeArmureUtilisableSansEntrainement) avant même d'en arriver
// à une recherche dans les listes.
function idsListeProfil(
  catalogue: WarbandCatalog,
  profil: Profile,
  categorie: 'armes_cac' | 'armes_tir' | 'armures'
): Set<string> {
  const listes = catalogue.equipement ?? {};
  const cles = profil.acces_equipement ?? Object.keys(listes);
  const ids = new Set<string>();
  for (const cle of cles) {
    for (const ref of listes[cle]?.[categorie] ?? []) ids.add(ref.item_id);
  }
  return ids;
}

// Id de base à vérifier pour l'accès arme/armure : pour un objet composé
// matériau (voir construireObjetMateriau), c'est l'arme/armure de base qui
// détermine ce que le profil "sait utiliser", pas l'id combo__ synthétique
// (qui n'apparaît jamais tel quel dans une liste d'équipement de bande).
function idBasePourAcces(itemId: string): string {
  if (!itemId.startsWith(PREFIXE_COMBO)) return itemId;
  const [baseId] = itemId.slice(PREFIXE_COMBO.length).split('__');
  return baseId ?? itemId;
}

// Un profil peut-il utiliser cette arme/armure sans entraînement
// particulier ? Reflète la règle "vos guerriers ne savent utiliser que les
// armes de leur liste de recrutement" (livre de règles, Place du Marché) :
// objet présent dans sa propre liste d'équipement de bande (acces_equipement),
// ou compétence Connaissance des Armes/Expert en Armes pour sa catégorie —
// auquel cas TOUTE arme de cette catégorie devient utilisable, y compris une
// arme "Rare" de la boutique commune (ex : Long fusil du Hochland) qui ne
// figure dans la liste d'équipement d'aucun profil de la bande (voir
// SKILL_TOUTES_ARMES_CAC/SKILL_TOUTES_ARMES_TIR ci-dessus). Les armures n'ont
// pas d'équivalent, hors gromril/ithilmar qui suivent aAccesArmureLourde. Ne
// s'applique qu'aux armes et armures : les autres catégories restent
// toujours utilisables. Contrairement au filtre d'ACHAT de getShopCommun
// (voir `filtrerAccesEntrainement`), ceci ne bloque jamais une transaction —
// le livre de règles autorise explicitement l'achat d'objets rares qu'un
// guerrier ne sait pas encore utiliser ("ils seront peut-être capables de
// s'en servir plus tard") : cette fonction sert donc uniquement à décider
// qui peut RECEVOIR un objet déjà possédé (voir "Donner à" dans
// ArmurerieSection), pas ce qui peut être acheté.
export function armeArmureUtilisableSansEntrainement(
  itemId: string,
  categorie: string,
  catalogue: WarbandCatalog | undefined,
  profil: Profile | null | undefined,
  competencesAcquises: string[] = []
): boolean {
  if (!catalogue || !profil) return true;
  const c = normaliserCategorie(categorie);
  const id = idBasePourAcces(itemId);
  if (c === 'armes_cac') {
    if (competencesAcquises.includes(SKILL_TOUTES_ARMES_CAC)) return true;
    return idsListeProfil(catalogue, profil, 'armes_cac').has(id);
  }
  if (c === 'armes_tir' || c === 'armes_poudre_noire') {
    if (competencesAcquises.includes(SKILL_TOUTES_ARMES_TIR)) return true;
    return idsListeProfil(catalogue, profil, 'armes_tir').has(id);
  }
  if (c === 'armures') {
    if (ITEMS_EQUIVALENT_ARMURE_LOURDE.has(id)) return aAccesArmureLourde(catalogue, profil);
    // Le cuir durci (tag "commun_heros") précise explicitement dans son texte
    // de règle qu'il n'a pas besoin de figurer dans la liste d'équipement de
    // la bande pour être utilisé — contrairement aux autres armures, son
    // achat n'est donc pas conditionné à la liste d'entraînement du profil.
    if (getItem(id)?.acces?.includes('commun_heros')) return true;
    return idsListeProfil(catalogue, profil, 'armures').has(id);
  }
  return true;
}

// Catégories couvertes par le chapitre "Objets Divers" du livre de règles
// (munitions, poisons/drogues, consommables, artefacts magiques et objets
// divers au sens strict) — n'inclut ni montures ni véhicules, qui relèvent
// d'un chapitre séparé et restent toujours accessibles aux hommes de main.
const CATEGORIES_CHAPITRE_DIVERS = new Set([
  'divers',
  'poisons_drogues',
  'munitions',
  'consommables',
  'artefacts_magiques',
]);

// Exceptions au chapitre "Objets Divers" relevées profil par profil (texte
// de règle explicite ou kit de combat propre au profil), clé
// "<bande.id>::<profil.id>::<item.id>". Le préfixe par bande évite toute
// collision fortuite entre deux profils de bandes différentes partageant le
// même id (ex : "novice" existe aussi bien chez les Guerriers Fantômes que
// chez les Sœurs de Sigmar, sans lien entre les deux).
const EXCEPTIONS_DIVERS_HOMMES_DE_MAIN = new Set([
  // Gardiens de Chapelle Bretonniens — règle spéciale "Reliques sacrées
  // bretonniennes" : "peut recevoir une relique sacrée malgré la
  // restriction habituelle des Hommes de main sur les objets divers".
  'gardiens_de_chapelle_bretonniens::pelerin::relique_sacree_bretonnienne',
  // Artilleurs de Nuln — la poudre noire supérieure fait partie du
  // fonctionnement normal de leurs tireurs, pas un objet divers générique.
  'artilleurs_de_nuln::pupille_de_nuln::poudre_noire_superieure',
  'artilleurs_de_nuln::tireur_delite::poudre_noire_superieure',
  'artilleurs_de_nuln::pistolier::poudre_noire_superieure',
  // Gladiateurs — le filet est l'arme de combat propre au Rétiaire.
  'gladiateurs::retiaire::filet',
  // Gobelins de la Nuit / Horde Orque — filet et champignons bonnets de fou
  // font partie du kit de combat habituel des gobelins nocturnes.
  'gobelins_de_la_nuit::guerrier_gobelin_de_la_nuit::filet',
  'gobelins_de_la_nuit::guerrier_gobelin_de_la_nuit::champignons_bonnets_de_fou_market',
  'gobelins_de_la_nuit::snotling::filet',
  'gobelins_de_la_nuit::snotling::champignons_bonnets_de_fou_market',
  'gobelins_de_la_nuit::fanatique::champignons_bonnets_de_fou_market',
  'orc_mob::guerrier_gobelin::champignons_bonnets_de_fou_market',
  // Maneaters — les serviteurs gnoblars sont des figurines/recrues propres
  // au Taureau et au Demi-Grand, pas de véritables objets divers.
  'maneaters::taureau::gnoblar_combattant',
  'maneaters::taureau::gnoblar_longue_vue',
  'maneaters::taureau::gnoblar_porte_bonheur',
  'maneaters::taureau::gnoblar_porte_epee',
  'maneaters::demi_grand::gnoblar_combattant',
  'maneaters::demi_grand::gnoblar_longue_vue',
  'maneaters::demi_grand::gnoblar_porte_bonheur',
  'maneaters::demi_grand::gnoblar_porte_epee',
]);

// "Seuls les héros peuvent acheter et porter l'équipement décrit dans ce
// chapitre. Vous ne pouvez pas le fournir à vos hommes de main sauf si les
// règles le spécifient." (livre de règles, chapitre Objets Divers) — un
// homme de main promu Héros via "Ce gars est doué" n'est plus concerné
// (resolveProfil bascule alors `type` à 'heros', voir utils/profil.ts).
// Contrairement à `armeArmureUtilisableSansEntrainement`, ceci s'applique
// aussi bien à l'achat (getShopCommun/getEquipementBande) qu'à la réception
// via "Donner à" (ArmurerieSection) : le livre ne prévoit ici aucune
// exception pour un objet trouvé mais pas encore utilisable — et un homme
// de main ne fait de toute façon jamais de recherche d'objet rare
// post-bataille (réservée aux héros), donc RechercheObjetRareModal n'a pas
// besoin de ce filtre. `equipement_special` reste volontairement hors
// périmètre (audit séparé à venir) : ce filtre ne s'applique qu'aux objets
// venant de la liste d'équipement propre au profil ou du shop commun/rare.
export function objetAutorisePourHommeDeMain(
  bandeId: string | undefined,
  profil: Profile | null | undefined,
  itemId: string,
  categorie: string
): boolean {
  if (!bandeId || profil?.type !== 'homme_de_main') return true;
  if (!CATEGORIES_CHAPITRE_DIVERS.has(categorie)) return true;
  return EXCEPTIONS_DIVERS_HOMMES_DE_MAIN.has(`${bandeId}::${profil.id}::${itemId}`);
}

// Un objet accessible via le shop commun (tag générique type "commun_humains",
// ou nommé directement pour une bande) reste soumis à la restriction de
// profil que sa propre bande lui impose déjà via equipement_special.profils,
// quand elle existe (ex : Destriers/Cheval/Caparaçon bretonnien des
// Chevaliers Bretonniens, réservés aux Chevaliers/Écuyers — sans ce filtre,
// un Homme d'Arme ou un Archer pouvait les acheter via le shop commun,
// contournant la restriction déjà posée côté liste de la bande). Ne
// s'applique que si la bande a explicitement choisi de restreindre CET item
// par profil ; les autres objets restent inchangés. Si `profil` est omis
// (vitrine sans membre précis, ex : achat pour le stock de bande depuis
// l'Armurerie), on ne filtre PAS — même contrat que le reste de
// getShopCommun (voir son propre commentaire) : un profil manquant ne doit
// jamais se comporter comme "aucun profil n'a le droit".
function respecteRestrictionProfilEquipementSpecial(
  catalogue: WarbandCatalog | undefined,
  profil: Profile | null | undefined,
  itemId: string
): boolean {
  const refRestreint = catalogue?.equipement_special?.find((ref) => ref.item_id === itemId && ref.profils);
  return !refRestreint?.profils || !profil || refRestreint.profils.includes(profil.id);
}

// Même principe que respecteRestrictionProfilEquipementSpecial ci-dessus,
// mais pour la restriction de compétence que la bande impose déjà via
// equipement_special.competences (ex : Grande Hache du Chaos des Maraudeurs
// du Chaos, réservée aux Héros avec la compétence Choisi par le Chaos) —
// sans ce filtre, un objet devenu accessible par tag générique dans le shop
// commun/la recherche d'objet rare contournerait la restriction de
// compétence déjà posée côté liste de la bande. `profil` omis (vitrine sans
// membre précis) : même contrat que ci-dessus, on ne filtre pas.
function respecteRestrictionCompetenceEquipementSpecial(
  catalogue: WarbandCatalog | undefined,
  profil: Profile | null | undefined,
  competencesAcquises: string[],
  itemId: string
): boolean {
  const refRestreint = catalogue?.equipement_special?.find((ref) => ref.item_id === itemId && ref.competences);
  return !refRestreint?.competences || !profil || refRestreint.competences.some((c) => competencesAcquises.includes(c));
}

// `catalogueId` élargit le filtre aux objets "commun_<bande>" propres à
// cette bande (voir estAccesPourCatalogue) — omis, seul le shop générique
// (accessible à toutes les bandes) est retourné. `profil`/`competencesAcquises`
// appliquent en plus les interdictions de catégorie du profil ciblé (voir
// estCategorieInterdite) — omis, aucun filtre par profil n'est appliqué
// (ex : vitrine en lecture seule sans membre précis). `catalogue` (le
// WarbandCatalog complet, en plus de `catalogueId`) sert uniquement à
// aAccesArmureLourde/`filtrerAccesEntrainement` — omis, l'armure en
// gromril/ithilmar reste accessible sans restriction supplémentaire.
// `filtrerAccesEntrainement` restreint en plus l'achat des armes/armures à
// celles déjà connues du profil (voir armeArmureUtilisableSansEntrainement) —
// réservé à l'achat direct côté personnage (AchatEquipementModal) : la
// recherche d'objet rare post-bataille reste volontairement ouverte, le
// livre de règles autorisant explicitement l'achat d'objets pas encore
// utilisables par le guerrier.
export function getShopCommun(
  catalogueId?: string,
  rules: GameRules = DEFAULT_GAME_RULES,
  profil?: Profile | null,
  competencesAcquises: string[] = [],
  catalogue?: WarbandCatalog,
  filtrerAccesEntrainement = false
): ShopItem[] {
  // Profil sans aucun achat possible, toutes catégories confondues (ex :
  // Snotling des Gobelins de la Nuit, Kroxigor des Hommes-Lézards — arme
  // gratuite fournie par equipementInclusDepart, sans liste d'équipement
  // ni accès au shop commun). categories_interdites ne couvre que
  // armes/armures ; sans ce court-circuit, montures/véhicules/munitions/
  // poisons restaient achetables via cet onglet malgré acces_equipement: [].
  if (profil?.aucun_achat_shop_commun) return [];
  const armureLourdeInterdite = !aAccesArmureLourde(catalogue, profil);
  // Fusionne categories_interdites (filtre aussi l'onglet bande) et
  // categories_interdites_commun (ne filtre que cet onglet commun) pour ce
  // seul appel — voir le commentaire de categories_interdites_commun dans
  // types/catalog.ts pour la raison de cette distinction.
  const profilInterdictionCommune =
    profil && profil.categories_interdites_commun?.length
      ? { ...profil, categories_interdites: [...(profil.categories_interdites ?? []), ...profil.categories_interdites_commun] }
      : profil;
  const items: ShopItem[] = TOUS_LES_ITEMS.filter(
    (item) =>
      // Les mutations ("Un guerrier de Mutant ou de Possédé peut acheter des
      // mutations uniquement lors de son recrutement") ne s'achètent jamais
      // depuis le shop commun, quelle que soit la bande : uniquement via la
      // liste equipement_special de la bande.
      item.categorie !== 'mutations' &&
      !(armureLourdeInterdite && ITEMS_EQUIVALENT_ARMURE_LOURDE.has(item.id)) &&
      !('heros_uniquement' in item && item.heros_uniquement && profil?.type === 'homme_de_main') &&
      ((catalogueId ? estAccesPourCatalogue(item.acces ?? [], catalogueId) : estAccesGenerique(item.acces ?? [])) ||
        (item.acces?.includes('commun_heros') && profil?.type === 'heros')) &&
      respecteRestrictionProfilEquipementSpecial(catalogue, profil, item.id) &&
      respecteRestrictionCompetenceEquipementSpecial(catalogue, profil, competencesAcquises, item.id) &&
      !estCategorieInterdite(
        item.categorie,
        profilInterdictionCommune,
        competencesAcquises,
        'sous_type' in item ? (item.sous_type as string | undefined) : undefined
      ) &&
      (!filtrerAccesEntrainement ||
        armeArmureUtilisableSansEntrainement(item.id, item.categorie, catalogue, profil, competencesAcquises)) &&
      objetAutorisePourHommeDeMain(catalogueId, profil, item.id, item.categorie)
  ).map(mapperItemVersShopItem);
  return items.map((item) => appliquerReglesObjet(item, catalogueId ?? '', rules, 'commun'));
}

// Résout un item_id de la base commune en ShopItem, indépendamment de son
// accessibilité normale (voir estAccesGenerique/estAccesPourCatalogue) —
// utilisé quand un événement (ex : Tableau d'Exploration) accorde un objet
// spécifique directement, sans passer par la liste d'achat habituelle.
export function itemVersShopItem(
  itemId: string,
  catalogueId?: string,
  rules: GameRules = DEFAULT_GAME_RULES
): ShopItem | undefined {
  const item = getItem(itemId);
  if (!item) return undefined;
  return appliquerReglesObjet(mapperItemVersShopItem(item), catalogueId ?? '', rules, 'commun');
}

// Montures accessibles à cette bande (pour un profil donné), qu'elles
// soient listées dans son propre catalogue (`equipement`/`equipement_special`)
// ou dans le shop commun — utilisé pour proposer un choix de monture liée à
// la compétence Équitation (voir utils/tribu.SKILL_EQUITATION). Résolu via
// la catégorie réelle de l'objet (`getItem(id).categorie`) plutôt que la
// catégorie d'affichage du `ShopItem`, qui reflète la liste où l'objet a été
// placé plutôt que sa nature propre (ex : une monture rangée dans "divers").
export function monturesDisponibles(
  catalogue: WarbandCatalog,
  profil: Profile | null,
  competencesAcquises: string[] = [],
  rules: GameRules = DEFAULT_GAME_RULES
): ShopItem[] {
  const items = [
    ...getEquipementBande(catalogue, profil, competencesAcquises, [], rules),
    ...getShopCommun(catalogue.id, rules),
  ];
  const vus = new Set<string>();
  return items.filter((item) => {
    if (vus.has(item.id)) return false;
    vus.add(item.id);
    return getItem(item.id)?.categorie === 'montures';
  });
}

// Objets propres à la bande (catalogue.equipement/equipement_special), déjà
// utilisés en lecture seule par EquipementReference. Chaque référence pointe
// vers un item_id de la base commune (items/*.json) : nom/catégorie/stats se
// résolvent depuis là, seul le prix (souvent propre à la bande) reste local.
// Si le profil précise `acces_equipement`, seules ces listes nommées sont
// proposées ; sinon, toutes les listes de la bande le sont (repli par
// défaut) — plusieurs listes (ex : infanterie/tireurs) partagent souvent les
// mêmes armes de base, d'où la déduplication finale par item_id.
// `competencesAcquises` permet à "Connaissance des Armes"/"Expert en Armes"
// de lever la restriction de liste pour leur catégorie d'arme respective.
export function getEquipementBande(
  catalogue: WarbandCatalog,
  profil: Profile | null,
  competencesAcquises: string[] = [],
  inventaireActuel: InventoryEntry[] = [],
  rules: GameRules = DEFAULT_GAME_RULES,
  marqueId?: string
): ShopItem[] {
  const items: ShopItem[] = [];
  const listes = catalogue.equipement ?? {};
  const clesProfil = profil?.acces_equipement ?? Object.keys(listes);
  const clesToutes = Object.keys(listes);
  const clesParCategorie: Record<string, string[]> = {
    armes_cac: competencesAcquises.includes(SKILL_TOUTES_ARMES_CAC) ? clesToutes : clesProfil,
    armes_tir: competencesAcquises.includes(SKILL_TOUTES_ARMES_TIR) ? clesToutes : clesProfil,
    armures: clesProfil,
    divers: clesProfil,
  };
  const categories = ['armes_cac', 'armes_tir', 'armures', 'divers'] as const;
  for (const categorie of categories) {
    for (const cle of clesParCategorie[categorie]) {
      const liste = listes[cle];
      if (!liste) continue;
      for (const ref of liste[categorie] ?? []) {
        const item = getItem(ref.item_id);
        if (!item) continue;
        // Une arme à poudre noire d'une bande reste rangée sous la clé
        // d'onglet "armes_tir" dans son catalogue.equipement (pas de clé
        // dédiée "armes_poudre_noire" pour ces listes) — estCategorieInterdite
        // distingue pourtant explicitement les deux (voir son propre code),
        // donc sans cette bascule, un profil interdit d'"armes_tir" SEUL (ex :
        // les 7 profils Artilleurs de Nuln, dont la règle "Fier artilleur !"
        // n'interdit QUE les armes de tir non-poudre-noire) se retrouvait
        // aussi privé de ses propres armes à poudre noire, la seule catégorie
        // qu'il a pourtant explicitement le droit d'acheter. getShopCommun
        // (juste au-dessus) ne souffre pas de ce problème : il passe déjà
        // item.categorie, la vraie catégorie de l'objet, plutôt que la clé
        // d'onglet de la liste où il est rangé.
        const categorieInterdictionEffective =
          categorie === 'armes_tir' && item.categorie === 'armes_poudre_noire' ? 'armes_poudre_noire' : categorie;
        if (
          estCategorieInterdite(
            categorieInterdictionEffective,
            profil,
            competencesAcquises,
            'sous_type' in item ? (item.sous_type as string | undefined) : undefined
          )
        )
          continue;
        if (!objetAutorisePourHommeDeMain(catalogue.id, profil, item.id, item.categorie)) continue;
        if (ref.heros_uniquement && profil?.type === 'homme_de_main') continue;
        if (ref.profils && !(profil && ref.profils.includes(profil.id))) continue;
        items.push({
          id: item.id,
          nom: item.nom,
          categorie,
          cout: ref.cout,
          cout_fixe: typeof ref.cout === 'number',
          disponibilite: ref.restriction ?? ref.note ?? item.disponibilite,
          rarete: ref.rarete ?? item.rarete,
          texte: item.texte,
          portee: 'portee' in item ? (item.portee as string | null) : undefined,
          force: 'force' in item ? (item.force as string | null) : undefined,
          sauvegarde: 'sauvegarde' in item ? (item.sauvegarde as string | null) : undefined,
          regles_speciales: item.regles_speciales,
          origine: 'bande',
        });
      }
    }
  }
  for (const ref of catalogue.equipement_special ?? []) {
    if (ref.profils && !(profil && ref.profils.includes(profil.id))) continue;
    if (ref.competences && !ref.competences.some((c) => competencesAcquises.includes(c))) continue;
    if (ref.marques && !(marqueId && ref.marques.includes(marqueId))) continue;
    const item = getItem(ref.item_id);
    if (!item) continue;
    // Contrairement à la boucle equipement/acces_equipement ci-dessus,
    // equipement_special ignorait jusqu'ici categories_interdites (ex : un
    // profil "ne peut en aucun cas porter d'armure" pouvait acheter une
    // armure spéciale). Exception : l'Armure du Chaos porte elle-même la
    // règle "Jeteurs de sorts" ("peut être portée par les jeteurs de
    // sorts" malgré une interdiction d'armure) — modélisée par
    // `leve_interdiction_armures_pour_sorciers` sur l'item, levée
    // uniquement pour un profil sorcier (voir utils/magie.ts estSorcier).
    const contourneInterdictionArmures =
      item.categorie === 'armures' &&
      'leve_interdiction_armures_pour_sorciers' in item &&
      !!item.leve_interdiction_armures_pour_sorciers &&
      !!profil &&
      estSorcier(catalogue, profil, marqueId);
    if (
      !contourneInterdictionArmures &&
      estCategorieInterdite(
        item.categorie,
        profil,
        competencesAcquises,
        'sous_type' in item ? (item.sous_type as string | undefined) : undefined
      )
    )
      continue;
    let cout = ref.cout;
    if (ref.groupe_prix && typeof cout === 'number') {
      const idsGroupe = new Set(
        (catalogue.equipement_special ?? [])
          .filter((r) => r.groupe_prix === ref.groupe_prix)
          .map((r) => r.item_id)
      );
      const dejaPossede = inventaireActuel.some((e) => idsGroupe.has(e.item_id));
      if (dejaPossede) cout = cout * 2;
    }
    items.push({
      id: item.id,
      nom: item.nom,
      // La liste d'équipement spécial d'une bande regroupe des objets très
      // divers (armures uniques, montures, mutations...) tous affichés sous
      // un même onglet "Spécial" par défaut — sauf les mutations, qui
      // gagnent leur propre onglet dédié (voir CATEGORIE_ORDRE) pour rester
      // groupées avec celles achetées via le shop commun.
      categorie: item.categorie === 'mutations' ? 'mutations' : 'special',
      cout,
      cout_fixe: typeof cout === 'number',
      disponibilite: ref.disponibilite ?? item.disponibilite,
      rarete: ref.rarete ?? item.rarete,
      texte: item.texte,
      portee: 'portee' in item ? (item.portee as string | null) : undefined,
      force: 'force' in item ? (item.force as string | null) : undefined,
      sauvegarde: 'sauvegarde' in item ? (item.sauvegarde as string | null) : undefined,
      regles_speciales: item.regles_speciales,
      stats_delta: 'stats_delta' in item ? item.stats_delta : undefined,
      origine: 'bande',
    });
  }

  const vus = new Set<string>();
  return items.filter((item) => {
    if (vus.has(item.id)) return false;
    vus.add(item.id);
    return true;
  }).map((item) => appliquerReglesObjet(item, catalogue.id, rules, 'bande'));
}

// Un profil a-t-il quoi que ce soit à acheter (liste de bande ou shop
// commun) ? Sert à sauter l'étape d'équipement après un recrutement plutôt
// que de proposer une boutique vide.
// Les profils "animal" (chien de guerre, monture, squig...) n'ont jamais
// d'équipement personnel dans les règles — vérifié sur les 27 bandes du
// projet, aucun profil animal n'a de `acces_equipement` renseigné — donc
// exclus sans condition plutôt que de dépendre de `categories_interdites`
// (renseigné de façon inégale selon les bandes, ex : le Chien de guerre
// générique n'a jamais eu cette liste alors que le Molosse du Chaos si) :
// un animal shoppant au shop commun (torche, corde...) n'aurait aucun sens.
// Volontairement permissif par défaut pour les autres profils
// (competencesAcquises vide, pas de matériaux) : sert juste à décider si
// l'étape mérite d'être montrée, pas à filtrer finement.
export function profilPeutAcheterEquipement(catalogue: WarbandCatalog, profil: Profile | null): boolean {
  if (!profil) return false;
  if (profil.type === 'animal') {
    // Un profil animal n'a jamais `acces_equipement` renseigné (voir plus
    // haut), donc le laisser passer par la logique de catégories ci-dessous
    // lui ouvrirait TOUTES les listes de bande (repli `?? Object.keys(...)`
    // dans getEquipementBande) au lieu de rien. Seul un objet
    // equipement_special explicitement réservé à ce profil précis (ex : les
    // Cymbales du Singe de Combat, Cavalcade Maudite) doit compter.
    return !!catalogue.equipement_special?.some((ref) => ref.profils?.includes(profil.id));
  }
  if (getEquipementBande(catalogue, profil).length > 0) return true;
  return getShopCommun(catalogue.id, DEFAULT_GAME_RULES, profil, [], catalogue, true).length > 0;
}

// Objets homebrew créés pour cette bande (voir CustomItem/RosterInstance) —
// convertis à la forme ShopItem pour rejoindre le reste du catalogue d'achat.
export function objetsPersonnalisesEnShopItems(objets: CustomItem[]): ShopItem[] {
  return objets.map((o) => ({
    id: o.id,
    nom: o.nom,
    categorie: o.categorie,
    cout: o.cout,
    cout_fixe: o.cout_fixe,
    rarete: o.rarete,
    disponibilite: o.disponibilite,
    texte: o.texte,
    stats_delta: o.stats_delta,
    origine: 'personnalise',
  }));
}

// Applique les surcharges locales (voir CustomItemOverride) à une liste
// d'objets déjà résolue, par id — les champs surchargés remplacent
// intégralement ceux de l'objet d'origine, `id`/`origine` restant inchangés.
export function avecSurcharges(
  items: ShopItem[],
  surcharges: Record<string, CustomItemOverride>
): ShopItem[] {
  return items.map((item) => {
    const surcharge = surcharges[item.id];
    if (!surcharge) return item;
    return { ...item, ...surcharge, id: item.id, origine: item.origine, surcharge: true };
  });
}

export function creerEntreeInventaire(item: ShopItem, coutPaye: number): InventoryEntry {
  return {
    instance_id: uuidv4(),
    item_id: item.id,
    nom: item.nom,
    categorie: item.categorie,
    cout: coutPaye,
    cout_notation: item.cout_fixe === false ? String(item.cout) : undefined,
    date_achat: new Date().toISOString(),
    resultat_sous_jet_achat: item.resultatSousJetAchat,
  };
}

// `quantite` exemplaires indépendants (instance_id distincts) du même objet,
// au même prix unitaire — utilisé pour équiper un groupe d'hommes de main
// d'un coup (l'équipement doit rester identique entre toutes ses figurines).
export function creerEntreesInventaire(item: ShopItem, coutPaye: number, quantite: number): InventoryEntry[] {
  return Array.from({ length: Math.max(1, quantite) }, () => creerEntreeInventaire(item, coutPaye));
}

export function acheterPourMembre(
  roster: RosterInstance,
  membreId: string,
  entrees: InventoryEntry | InventoryEntry[]
): RosterInstance {
  const liste = Array.isArray(entrees) ? entrees : [entrees];
  const coutTotal = liste.reduce((acc, e) => acc + e.cout, 0);
  if (coutTotal > roster.tresorerie) return roster;
  return {
    ...roster,
    tresorerie: roster.tresorerie - coutTotal,
    membres: roster.membres.map((m) =>
      m.instance_id === membreId ? { ...m, inventaire: [...m.inventaire, ...liste] } : m
    ),
  };
}

export function acheterPourStock(roster: RosterInstance, entree: InventoryEntry): RosterInstance {
  if (entree.cout > roster.tresorerie) return roster;
  return { ...roster, tresorerie: roster.tresorerie - entree.cout, stock: [...roster.stock, entree] };
}

export function retirerDeMembre(roster: RosterInstance, membreId: string, instanceId: string): RosterInstance {
  return {
    ...roster,
    membres: roster.membres.map((m) =>
      m.instance_id === membreId ? { ...m, inventaire: m.inventaire.filter((e) => e.instance_id !== instanceId) } : m
    ),
  };
}

export function retirerDuStock(roster: RosterInstance, instanceId: string): RosterInstance {
  return { ...roster, stock: roster.stock.filter((e) => e.instance_id !== instanceId) };
}

// Ne transfère qu'un seul exemplaire à la fois, même au sein d'un groupe
// d'hommes de main : renvoyer/vendre/retirer tout le lot en un clic serait
// trop facile à déclencher par erreur. Le mismatch d'équipement du groupe
// (voir inventaireGroupeMismatch) réagit immédiatement si cela déséquilibre
// la répartition, et reste résolvable en répétant l'action figurine par
// figurine ou via l'armurerie.
export function transfererVersStock(roster: RosterInstance, membre: Member, instanceId: string): RosterInstance {
  const entree = membre.inventaire.find((e) => e.instance_id === instanceId);
  if (!entree) return roster;
  return {
    ...retirerDeMembre(roster, membre.instance_id, instanceId),
    stock: [...roster.stock, entree],
  };
}

export function transfererVersMembre(roster: RosterInstance, instanceId: string, membreId: string): RosterInstance {
  const entree = roster.stock.find((e) => e.instance_id === instanceId);
  if (!entree) return roster;
  const sansStock = retirerDuStock(roster, instanceId);
  return {
    ...sansStock,
    membres: sansStock.membres.map((m) =>
      m.instance_id === membreId ? { ...m, inventaire: [...m.inventaire, entree] } : m
    ),
  };
}

export function formatEquipementAffiche(inventaire: InventoryEntry[]): string {
  return inventaire.map((e) => e.nom).join(', ');
}

// "When a warrior is killed (Hero or Henchman) all his weapons and
// equipment are lost. [...] It is not possible to reallocate a warrior's
// weapons or equipment once he is dead." (Part 3 - Campaigns & Optional
// Rules, p.78) — à répercuter sur tout membre passant au statut 'mort',
// quel que soit le chemin (jet Hors de Combat simple, groupe anéanti,
// déclaration manuelle). Sans ça, l'inventaire du défunt reste compté par
// inventaireComplet() et peut bloquer indéfiniment le rachat d'un objet
// unique/limité à la bande.
export function equipementPerduALaMort(): Pick<Member, 'inventaire' | 'equipement'> {
  return { inventaire: [], equipement: '' };
}

// Applique un achat complet à un membre : crée les entrées d'inventaire
// (une par figurine du groupe), débite la trésorerie via acheterPourMembre,
// applique le stats_delta éventuel de l'objet (ex : mutation Great Claw,
// +1F/+1A) et resynchronise le résumé texte `equipement` affiché ailleurs
// (liste du roster, export PDF). Centralisé ici plutôt que dupliqué entre
// l'achat depuis la fiche personnage et l'achat au moment du recrutement,
// pour que les deux parcours appliquent exactement les mêmes règles.
export function appliquerAchatSurMembre(
  roster: RosterInstance,
  membre: Member,
  item: ShopItem,
  coutPaye: number
): RosterInstance {
  const entrees = creerEntreesInventaire(item, coutPaye, membre.taille_groupe || 1);
  const nouveauRoster = acheterPourMembre(roster, membre.instance_id, entrees);
  const inventaire = [...membre.inventaire, ...entrees];
  let stats_actuels = membre.stats_actuels;
  let stats_modifiees = membre.stats_modifiees;
  let stats_variables = membre.stats_variables;
  if (item.stats_delta) {
    stats_actuels = { ...stats_actuels };
    stats_modifiees = [...stats_modifiees];
    for (const k of STAT_KEYS) {
      const delta = item.stats_delta[k];
      if (!delta) continue;
      // Une caractéristique encore variable (ex : F du Damné) n'a pas de
      // stats_actuels significatif à ce stade : le delta s'applique à la
      // notation dé elle-même plutôt que sur l'espace réservé ignoré par
      // l'affichage — voir CaracteristiquesCard.
      if (stats_variables?.[k]) {
        stats_variables = { ...stats_variables, [k]: appliquerDeltaSurNotation(stats_variables[k]!, delta) };
        continue;
      }
      stats_actuels[k] += delta;
      if (!stats_modifiees.includes(k)) stats_modifiees.push(k);
    }
  }
  return {
    ...nouveauRoster,
    membres: nouveauRoster.membres.map((m) =>
      m.instance_id === membre.instance_id
        ? { ...m, equipement: formatEquipementAffiche(inventaire), stats_actuels, stats_modifiees, stats_variables }
        : m
    ),
  };
}

// Un groupe d'hommes de main ne peut pas mélanger son équipement : l'achat
// direct (voir acheterPourMembre + creerEntreesInventaire) équipe toujours
// tout le monde d'un coup, mais donner un objet du stock au groupe un par un
// (armurerie -> Donner à…) peut casser cette règle. Détecté ici en vérifiant
// que chaque objet distinct est possédé en un nombre d'exemplaires multiple
// de la taille du groupe (donc répartissable également entre figurines).
export function inventaireGroupeMismatch(membre: Member): boolean {
  if (membre.taille_groupe <= 1) return false;
  return resumeInventaireParItem(membre.inventaire).some(({ quantite }) => quantite % membre.taille_groupe !== 0);
}

// Un inventaire de groupe contient `taille_groupe` exemplaires identiques de
// chaque objet (voir entreesLieesAuGroupe) : regroupé ici en une entrée par
// objet distinct + sa quantité, pour l'affichage et pour calculer le coût
// d'équipement des nouvelles figurines rejoignant le groupe.
export function resumeInventaireParItem(inventaire: InventoryEntry[]): { entree: InventoryEntry; quantite: number }[] {
  const parItem = new Map<string, { entree: InventoryEntry; quantite: number }>();
  for (const entree of inventaire) {
    const existant = parItem.get(entree.item_id);
    if (existant) existant.quantite += 1;
    else parItem.set(entree.item_id, { entree, quantite: 1 });
  }
  return [...parItem.values()];
}

// Nouveaux exemplaires à offrir aux figurines qui rejoignent un groupe
// d'hommes de main déjà équipé — l'équipement doit rester identique entre
// toutes les figurines du groupe. `resumeInventaireParItem` donne la
// quantité TOTALE de chaque objet pour tout le groupe actuel : il faut la
// diviser par sa taille actuelle pour obtenir la quantité par figurine avant
// de la multiplier par le nombre de nouvelles recrues (ex : groupe de 2 avec
// 4 Dagues au total = 2 Dagues/figurine ; un 3e guerrier doit en recevoir 2,
// pas 1).
export function clonerEquipementPourNouvellesFigurines(
  inventaireExistant: InventoryEntry[],
  quantiteNouvelle: number,
  tailleGroupeActuelle: number
): InventoryEntry[] {
  const diviseur = Math.max(1, tailleGroupeActuelle);
  const distincts = resumeInventaireParItem(inventaireExistant);
  const clones: InventoryEntry[] = [];
  for (const { entree, quantite } of distincts) {
    const quantiteParFigurine = Math.floor(quantite / diviseur);
    for (let i = 0; i < quantiteParFigurine * quantiteNouvelle; i++) {
      clones.push({
        ...entree,
        instance_id: uuidv4(),
        date_achat: new Date().toISOString(),
      });
    }
  }
  return clones;
}

// Équipement restant pour un groupe d'hommes de main ayant perdu des
// figurines (résolution post-bataille) — l'inverse de
// clonerEquipementPourNouvellesFigurines ci-dessus : chaque figurine tombée
// emporte sa part de chaque objet distinct avec elle plutôt que de la
// laisser aux survivants (ex : groupe de 5 avec 5 Dagues, 2 tombent = 3
// Dagues restantes, pas 5). Sans ce partage, le reste du groupe se
// retrouverait avec plus d'exemplaires de chaque objet que de figurines
// pour les porter.
// Le ratio se calcule sur `quantite * survivants` avant de diviser (plutôt
// que floor(quantite / tailleGroupeActuelle) * survivants) : un groupe déjà
// en sous-effectif d'équipement avant la mort (ex: un exemplaire revendu
// individuellement depuis la fiche personnage, voir inventaireGroupeMismatch)
// aurait sinon vu tout l'objet disparaître d'un coup dès qu'une seule
// figurine meurt (floor(4/5) = 0 exemplaire par figurine), au lieu d'en
// garder une part proportionnelle pour les survivants.
export function retirerEquipementFigurinesTombees(
  inventaireExistant: InventoryEntry[],
  tailleGroupeActuelle: number,
  survivants: number
): InventoryEntry[] {
  const diviseur = Math.max(1, tailleGroupeActuelle);
  const restant: InventoryEntry[] = [];
  for (const { entree, quantite } of resumeInventaireParItem(inventaireExistant)) {
    const quantiteRestante = Math.floor((quantite * survivants) / diviseur);
    const memeItem = inventaireExistant.filter((e) => e.item_id === entree.item_id);
    restant.push(...memeItem.slice(0, quantiteRestante));
  }
  return restant;
}

// Coût total pour équiper `quantiteNouvelle` nouvelles figurines à
// l'identique de l'équipement déjà possédé par le groupe (voir
// clonerEquipementPourNouvellesFigurines ci-dessus pour le calcul par
// figurine).
export function coutEquipementNouvellesFigurines(
  inventaireExistant: InventoryEntry[],
  quantiteNouvelle: number,
  tailleGroupeActuelle: number
): number {
  const diviseur = Math.max(1, tailleGroupeActuelle);
  return resumeInventaireParItem(inventaireExistant).reduce((acc, { entree, quantite }) => {
    const quantiteParFigurine = Math.floor(quantite / diviseur);
    return acc + entree.cout * quantiteParFigurine * quantiteNouvelle;
  }, 0);
}

export type CoutRejoindreGroupe = {
  xpGroupe: number;
  surtaxeXpUnitaire: number;
  coutEquipementForce: number;
  coutTotal: number;
  vetPointsIndicatifs: number;
};

// Détail du coût pour faire rejoindre `quantite` nouvelles figurines à un
// groupe d'hommes de main déjà expérimenté : surtaxe de 2 × XP du groupe par
// figurine (elle profite immédiatement de l'XP acquise) + équipement forcé
// identique au reste du groupe. Le coût en points vétéran reste indicatif,
// volontairement non bloquant.
export function calculerCoutRejoindreGroupe(groupe: Member, coutUnitaire: number, quantite: number): CoutRejoindreGroupe {
  const xpGroupe = groupe.xp;
  const surtaxeXpUnitaire = 2 * xpGroupe;
  const coutEquipementForce = coutEquipementNouvellesFigurines(groupe.inventaire, quantite, groupe.taille_groupe);
  const coutTotal = (coutUnitaire + surtaxeXpUnitaire) * quantite + coutEquipementForce;
  const vetPointsIndicatifs = xpGroupe * quantite;
  return { xpGroupe, surtaxeXpUnitaire, coutEquipementForce, coutTotal, vetPointsIndicatifs };
}

// Fait rejoindre `quantite` nouvelles figurines à un groupe existant :
// équipement identique cloné, taille du groupe augmentée, coût déduit.
// `coutUnitaireRecrutement`, s'il est fourni (profil à prix variable, voir
// Member.cout_recrutement dans types/roster.ts), met à jour le prix par
// figurine utilisé par Power Value (utils/powerValue.ts) pour ce groupe —
// approximation documentée : le modèle ne suit qu'un seul prix par membre,
// pas un prix par figurine individuelle, donc un groupe dont les lots
// successifs ont été recrutés à des prix variables différents retombe sur
// le dernier prix connu.
export function rejoindreGroupe(
  roster: RosterInstance,
  groupe: Member,
  quantite: number,
  coutTotal: number,
  coutUnitaireRecrutement?: number
): RosterInstance {
  const nouvellesEntrees = clonerEquipementPourNouvellesFigurines(groupe.inventaire, quantite, groupe.taille_groupe);
  return {
    ...roster,
    tresorerie: roster.tresorerie - coutTotal,
    membres: roster.membres.map((m) =>
      m.instance_id === groupe.instance_id
        ? {
            ...m,
            taille_groupe: m.taille_groupe + quantite,
            inventaire: [...m.inventaire, ...nouvellesEntrees],
            ...(coutUnitaireRecrutement != null ? { cout_recrutement: coutUnitaireRecrutement } : {}),
          }
        : m
    ),
  };
}

// Reconstruit le détail complet (stats/règles) d'un objet possédé à partir
// de son item_id, pour l'affichage au clic (récap "en un coup d'œil",
// inventaire...). Se rabat sur le simple instantané pris à l'achat
// (nom/catégorie/coût) si l'objet n'existe plus dans la base commune.
export function resolveItemDetail(
  entree: InventoryEntry,
  catalogueId = '',
  rules: GameRules = DEFAULT_GAME_RULES
): ShopItem {
  const item = getItem(entree.item_id);
  if (!item) {
    const combo = resolveCombinaisonMateriau(entree.item_id);
    if (combo) return { ...combo, cout: entree.cout };
    return appliquerReglesObjet({
      id: entree.item_id,
      nom: entree.nom,
      categorie: entree.categorie,
      cout: entree.cout,
      origine: 'bande',
    }, catalogueId, rules, 'paye');
  }
  const sousJetAchat = 'sous_jet_achat' in item ? (item.sous_jet_achat as SousJetAchatSpec | undefined) : undefined;
  const resultatPersiste = entree.resultat_sous_jet_achat;
  // Rejoue toujours l'option canonique du catalogue plutôt que le seul
  // instantané persisté, quand elle est encore disponible — l'instantané ne
  // sert que de repli si l'objet/l'option a depuis disparu du catalogue.
  const optionCanonique = resultatPersiste ? sousJetAchat?.options[resultatPersiste.optionIndex] : undefined;
  const resultatSousJetAchat = resultatPersiste
    ? {
        jet: resultatPersiste.jet,
        optionIndex: resultatPersiste.optionIndex,
        label: optionCanonique?.label ?? resultatPersiste.label,
        texte: optionCanonique?.texte ?? resultatPersiste.texte,
      }
    : undefined;
  return appliquerReglesObjet({
    id: item.id,
    nom: item.nom,
    categorie: normaliserCategorie(item.categorie),
    cout: entree.cout,
    disponibilite: item.disponibilite,
    rarete: item.rarete,
    texte: item.texte,
    portee: 'portee' in item ? (item.portee as string | null) : undefined,
    force: 'force' in item ? (item.force as string | null) : undefined,
    sauvegarde: 'sauvegarde' in item ? (item.sauvegarde as string | null) : undefined,
    regles_speciales: item.regles_speciales,
    sous_jet_achat: resultatSousJetAchat ? undefined : sousJetAchat,
    resultatSousJetAchat,
    stats: 'stats' in item ? (item.stats as StatsMonture | undefined) : undefined,
    stats_delta: 'stats_delta' in item ? item.stats_delta : undefined,
    origine: 'bande',
  }, catalogueId, rules, 'paye');
}

// Revente d'équipement : moitié du prix payé, arrondie au supérieur.
export function prixVente(coutPaye: number): number {
  return Math.ceil(coutPaye / 2);
}

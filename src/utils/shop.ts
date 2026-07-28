// Achat/gestion d'équipement structuré : shop commun (base d'objets extraite
// du compendium "Place du Marché") + listes d'équipement propres à la bande
// (catalogue.equipement / equipement_special, déjà utilisées en référence
// libre par EquipementReference). Pas de gestion de rareté ni de phase
// d'achat dédiée : simple déduction de trésorerie, à tout moment.
import { v4 as uuidv4 } from 'uuid';
import type { Member, RosterInstance, InventoryEntry, CustomItem, CustomItemOverride } from '../types/roster';
import type { WarbandCatalog, Profile, SpecialRule, Stats } from '../types/catalog';
import { TOUS_LES_ITEMS, getItem } from '../data/items';
import type { IconName } from '../components/common/Icon';
import { DEFAULT_GAME_RULES } from '../types/rules';
import type { GameRules } from '../types/rules';

// Profil de caractéristiques d'une monture/créature (items/montures.json) :
// valeurs habituellement numériques, mais certaines notations spéciales
// restent du texte (ex : Force "3(4)" pour une charge d'araignée géante).
export type StatsMonture = { [K in keyof Stats]: number | string };

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

// Résumé compact des stats de jeu d'un objet (portée/force/sauvegarde/noms
// des règles spéciales), utilisé comme synopsis dans la liste d'achat. Se
// rabat sur le texte d'ambiance si l'objet n'a pas de stats structurées
// (la plupart des objets divers/consommables/poisons).
export function resumeItem(item: ShopItem): string | null {
  const parties: string[] = [];
  if (item.portee) parties.push(`Portée ${item.portee}`);
  if (item.force) parties.push(`Force ${item.force}`);
  if (item.sauvegarde) parties.push(`Save ${item.sauvegarde}`);
  if (item.regles_speciales?.length) parties.push(item.regles_speciales.map((r) => r.nom).join(', '));
  if (parties.length > 0) return parties.join(' · ');
  return item.texte ?? null;
}

// "12 po" pour un coût numérique, ou la notation telle quelle (ex : "10+1D6",
// "x4") sinon — un coût d'objet non fixe reste une formule à résoudre à la
// main, pas un montant en po.
export function formatCoutItem(cout: number | string): string {
  return typeof cout === 'number' ? `${cout} po` : cout;
}

// "12 po", "25+2D6 po" ou "coût ?" pour le coût (éventuellement variable)
// d'un profil de catalogue.
export function formatCoutProfil(cout: number | null, coutNotation?: string): string {
  if (cout != null) return `${cout} po`;
  if (coutNotation) return `${coutNotation} po`;
  return 'coût ?';
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
// shop commun ici.
export function estAccesGenerique(acces: string[]): boolean {
  return acces.some(
    (a) =>
      a === 'commun' ||
      a === 'jeteurs_de_sorts' ||
      /^rare_\d+$/.test(a) ||
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
]);

// Un objet "commun_<bande>" (restreint à un groupe précis, donc exclu du
// shop générique par estAccesGenerique) reste accessible pour la bande
// concernée : soit l'id du catalogue est listé tel quel dans `acces` (ex :
// "gobelins_de_la_nuit", "undead"), soit la bande appartient au tag de
// groupe "commun_humains". Utilisé pour que les montures et autres objets
// à accès restreint apparaissent dans le shop commun d'une bande éligible.
export function estAccesPourCatalogue(acces: string[], catalogueId: string): boolean {
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

const CATALOGUE_ARTILLEURS_NULN = 'artilleurs_de_nuln';

// Armures de corps et caparaçons concernés par la règle Lozheim. Les
// protections périphériques (boucliers, casques, cuir durci, pavois,
// rondaches, écus, capes...) sont volontairement absentes.
const ARMURES_LOZHEIM = new Set([
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
  const estPoudreNoire = reference?.categorie === 'armes_poudre_noire';
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

export type AvertissementTrinketLimite = {
  itemId: string;
  nom: string;
  quantite: number;
};

// Contrôle aussi bien le stock de bande que l'équipement porté. Cette
// validation reste utile pour les anciens rosters ou lorsqu'une règle est
// activée après que plusieurs exemplaires ont déjà été achetés.
export function trouverTrinketsLimitesEnTrop(roster: RosterInstance): AvertissementTrinketLimite[] {
  const parItem = new Map<string, AvertissementTrinketLimite>();

  for (const entree of inventaireComplet(roster)) {
    if (!TRINKETS_LIMITES.has(entree.item_id)) continue;
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
  'consommables',
  'poisons_drogues',
  'montures',
  'vehicules',
  'special',
];

const CATEGORIE_LABELS: Record<string, string> = {
  armes_cac: 'Corps à corps',
  armes_tir: 'Tir',
  armes_poudre_noire: 'Poudre noire',
  munitions: 'Munitions',
  armures: 'Armure',
  divers: 'Divers',
  consommables: 'Consommable',
  poisons_drogues: 'Poison / drogue',
  montures: 'Monture',
  vehicules: 'Véhicule',
  special: 'Spécial',
};

export function libelleCategorie(categorie: string): string {
  return CATEGORIE_LABELS[categorie] ?? categorie;
}

const CATEGORIE_ICONES: Partial<Record<string, IconName>> = {
  armes_cac: 'epee',
  armes_tir: 'arc',
  armes_poudre_noire: 'flamme',
  munitions: 'cible',
  armures: 'bouclier',
  divers: 'gemme',
  consommables: 'fiole',
  poisons_drogues: 'goutte',
  montures: 'griffe',
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
  if (n >= 10) return 'badge--danger';
  if (n >= 7) return 'badge--warning';
  return 'badge--info';
}

// `catalogueId` élargit le filtre aux objets "commun_<bande>" propres à
// cette bande (voir estAccesPourCatalogue) — omis, seul le shop générique
// (accessible à toutes les bandes) est retourné.
export function getShopCommun(catalogueId?: string, rules: GameRules = DEFAULT_GAME_RULES): ShopItem[] {
  const items: ShopItem[] = TOUS_LES_ITEMS.filter((item) =>
    catalogueId ? estAccesPourCatalogue(item.acces ?? [], catalogueId) : estAccesGenerique(item.acces ?? [])
  ).map((item) => ({
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
    stats: 'stats' in item ? (item.stats as StatsMonture | undefined) : undefined,
    origine: 'commun',
  }));
  return items.map((item) => appliquerReglesObjet(item, catalogueId ?? '', rules, 'commun'));
}

// Compétences qui donnent accès à toute arme de la bande dans leur
// catégorie, au-delà de la liste normalement assignée au profil (cf.
// src/data/skills.json) : "Connaissance des Armes" (corps à corps) et
// "Expert en Armes" (tir).
const SKILL_TOUTES_ARMES_CAC = 'combat_03';
const SKILL_TOUTES_ARMES_TIR = 'tir_04';

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
        items.push({
          id: item.id,
          nom: item.nom,
          categorie,
          cout: ref.cout,
          cout_fixe: typeof ref.cout === 'number',
          disponibilite: ref.restriction ?? ref.note ?? item.disponibilite,
          rarete: item.rarete,
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
      categorie: 'special',
      cout,
      cout_fixe: typeof cout === 'number',
      disponibilite: ref.disponibilite ?? item.disponibilite,
      rarete: item.rarete,
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
  };
}

// `quantite` exemplaires indépendants (instance_id distincts) du même objet,
// au même prix unitaire — utilisé pour équiper un groupe d'hommes de main
// d'un coup (l'équipement doit rester identique entre toutes ses figurines).
export function creerEntreesInventaire(item: ShopItem, coutPaye: number, quantite: number): InventoryEntry[] {
  return Array.from({ length: Math.max(1, quantite) }, () => creerEntreeInventaire(item, coutPaye));
}

// Toutes les entrées d'inventaire partageant le même item_id qu'une instance
// donnée. Pour un groupe d'hommes de main (taille_groupe > 1), l'équipement
// doit rester identique entre toutes les figurines : vendre, retirer ou
// renvoyer un exemplaire agit donc sur tout le lot. Un héros (taille_groupe
// = 1, toujours le cas) ne voit agir que l'exemplaire ciblé.
export function entreesLieesAuGroupe(membre: Member, instanceId: string): InventoryEntry[] {
  const entree = membre.inventaire.find((e) => e.instance_id === instanceId);
  if (!entree) return [];
  return membre.taille_groupe > 1
    ? membre.inventaire.filter((e) => e.item_id === entree.item_id)
    : [entree];
}

export function acheterPourMembre(
  roster: RosterInstance,
  membreId: string,
  entrees: InventoryEntry | InventoryEntry[]
): RosterInstance {
  const liste = Array.isArray(entrees) ? entrees : [entrees];
  const coutTotal = liste.reduce((acc, e) => acc + e.cout, 0);
  return {
    ...roster,
    tresorerie: roster.tresorerie - coutTotal,
    membres: roster.membres.map((m) =>
      m.instance_id === membreId ? { ...m, inventaire: [...m.inventaire, ...liste] } : m
    ),
  };
}

export function acheterPourStock(roster: RosterInstance, entree: InventoryEntry): RosterInstance {
  return { ...roster, tresorerie: roster.tresorerie - entree.cout, stock: [...roster.stock, entree] };
}

export function retirerDeMembre(roster: RosterInstance, membreId: string, instanceId: string): RosterInstance {
  const membre = roster.membres.find((m) => m.instance_id === membreId);
  const aRetirer = new Set(
    (membre ? entreesLieesAuGroupe(membre, instanceId) : [{ instance_id: instanceId }]).map((e) => e.instance_id)
  );
  return {
    ...roster,
    membres: roster.membres.map((m) =>
      m.instance_id === membreId ? { ...m, inventaire: m.inventaire.filter((e) => !aRetirer.has(e.instance_id)) } : m
    ),
  };
}

export function retirerDuStock(roster: RosterInstance, instanceId: string): RosterInstance {
  return { ...roster, stock: roster.stock.filter((e) => e.instance_id !== instanceId) };
}

export function transfererVersStock(roster: RosterInstance, membre: Member, instanceId: string): RosterInstance {
  const aTransferer = entreesLieesAuGroupe(membre, instanceId);
  if (aTransferer.length === 0) return roster;
  return {
    ...retirerDeMembre(roster, membre.instance_id, instanceId),
    stock: [...roster.stock, ...aTransferer],
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

// Nouveaux exemplaires (un par objet distinct déjà possédé par le groupe, ×
// quantiteNouvelle) à offrir aux figurines qui rejoignent un groupe d'hommes
// de main déjà équipé — l'équipement doit rester identique entre toutes les
// figurines du groupe.
export function clonerEquipementPourNouvellesFigurines(
  inventaireExistant: InventoryEntry[],
  quantiteNouvelle: number
): InventoryEntry[] {
  const distincts = resumeInventaireParItem(inventaireExistant);
  const clones: InventoryEntry[] = [];
  for (const { entree } of distincts) {
    for (let i = 0; i < quantiteNouvelle; i++) {
      clones.push({
        ...entree,
        instance_id: uuidv4(),
        date_achat: new Date().toISOString(),
      });
    }
  }
  return clones;
}

// Coût total pour équiper `quantiteNouvelle` nouvelles figurines à
// l'identique de l'équipement déjà possédé par le groupe.
export function coutEquipementNouvellesFigurines(inventaireExistant: InventoryEntry[], quantiteNouvelle: number): number {
  return resumeInventaireParItem(inventaireExistant).reduce((acc, { entree }) => acc + entree.cout * quantiteNouvelle, 0);
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
  const coutEquipementForce = coutEquipementNouvellesFigurines(groupe.inventaire, quantite);
  const coutTotal = (coutUnitaire + surtaxeXpUnitaire) * quantite + coutEquipementForce;
  const vetPointsIndicatifs = xpGroupe * quantite;
  return { xpGroupe, surtaxeXpUnitaire, coutEquipementForce, coutTotal, vetPointsIndicatifs };
}

// Fait rejoindre `quantite` nouvelles figurines à un groupe existant :
// équipement identique cloné, taille du groupe augmentée, coût déduit.
export function rejoindreGroupe(
  roster: RosterInstance,
  groupe: Member,
  quantite: number,
  coutTotal: number
): RosterInstance {
  const nouvellesEntrees = clonerEquipementPourNouvellesFigurines(groupe.inventaire, quantite);
  return {
    ...roster,
    tresorerie: roster.tresorerie - coutTotal,
    membres: roster.membres.map((m) =>
      m.instance_id === groupe.instance_id
        ? { ...m, taille_groupe: m.taille_groupe + quantite, inventaire: [...m.inventaire, ...nouvellesEntrees] }
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
    return appliquerReglesObjet({
      id: entree.item_id,
      nom: entree.nom,
      categorie: entree.categorie,
      cout: entree.cout,
      origine: 'bande',
    }, catalogueId, rules, 'paye');
  }
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
    stats: 'stats' in item ? (item.stats as StatsMonture | undefined) : undefined,
    stats_delta: 'stats_delta' in item ? item.stats_delta : undefined,
    origine: 'bande',
  }, catalogueId, rules, 'paye');
}

// Revente d'équipement : moitié du prix payé, arrondie au supérieur.
export function prixVente(coutPaye: number): number {
  return Math.ceil(coutPaye / 2);
}

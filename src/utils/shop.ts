// Achat/gestion d'équipement structuré : shop commun (base d'objets extraite
// du compendium "Place du Marché") + listes d'équipement propres à la bande
// (catalogue.equipement / equipement_special, déjà utilisées en référence
// libre par EquipementReference). Pas de gestion de rareté ni de phase
// d'achat dédiée : simple déduction de trésorerie, à tout moment.
import { v4 as uuidv4 } from 'uuid';
import type { Member, RosterInstance, InventoryEntry } from '../types/roster';
import type { WarbandCatalog, Profile, SpecialRule } from '../types/catalog';
import { TOUS_LES_ITEMS, getItem } from '../data/items';

export type ShopItem = {
  id: string;
  nom: string;
  categorie: string;
  cout: number | string;
  cout_fixe?: boolean;
  disponibilite?: string;
  rarete?: string;
  texte?: string | null;
  portee?: string | null;
  force?: string | null;
  sauvegarde?: string | null;
  regles_speciales?: SpecialRule[];
  origine: 'commun' | 'bande';
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

// Tags "acces" considérés comme ouverts à toutes les bandes dans la base
// d'objets (items/*.json) : "commun" strict, "rare_N" (rare mais sans
// restriction de bande), "commun_sauf_..." (commun avec une exception
// mineure) et "commun_ou_rare_N" (variante commun/rare selon les éditions —
// dans les deux cas accessible sans restriction de bande). Attention : les
// tags "commun_<bande ou rôle>" SANS "_sauf_" (ex : "commun_pirates",
// "commun_heros", "commun_pretres_guerriers_soeurs_de_sigmar") signifient
// l'inverse — l'objet est license/pas cher UNIQUEMENT pour ce groupe précis,
// donc restreint, pas générique. Ils restent donc exclus du shop commun ici.
export function estAccesGenerique(acces: string[]): boolean {
  return acces.some(
    (a) =>
      a === 'commun' ||
      /^rare_\d+$/.test(a) ||
      a.startsWith('commun_sauf_') ||
      /^commun_ou_rare_\d+$/.test(a)
  );
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

export function getShopCommun(): ShopItem[] {
  return TOUS_LES_ITEMS.filter((item) => estAccesGenerique(item.acces ?? [])).map((item) => ({
    id: item.id,
    nom: item.nom,
    categorie: normaliserCategorie(item.categorie),
    cout: item.cout,
    cout_fixe: item.cout_fixe,
    disponibilite: item.disponibilite,
    rarete: item.rarete,
    texte: item.texte,
    portee: 'portee' in item ? (item.portee as string | null) : undefined,
    force: 'force' in item ? (item.force as string | null) : undefined,
    sauvegarde: 'sauvegarde' in item ? (item.sauvegarde as string | null) : undefined,
    regles_speciales: item.regles_speciales,
    origine: 'commun',
  }));
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
  competencesAcquises: string[] = []
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
    const item = getItem(ref.item_id);
    if (!item) continue;
    items.push({
      id: item.id,
      nom: item.nom,
      categorie: 'special',
      cout: ref.cout,
      cout_fixe: typeof ref.cout === 'number',
      disponibilite: ref.disponibilite ?? item.disponibilite,
      texte: item.texte,
      portee: 'portee' in item ? (item.portee as string | null) : undefined,
      force: 'force' in item ? (item.force as string | null) : undefined,
      sauvegarde: 'sauvegarde' in item ? (item.sauvegarde as string | null) : undefined,
      regles_speciales: item.regles_speciales,
      origine: 'bande',
    });
  }

  const vus = new Set<string>();
  return items.filter((item) => {
    if (vus.has(item.id)) return false;
    vus.add(item.id);
    return true;
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

// Reconstruit le détail complet (stats/règles) d'un objet possédé à partir
// de son item_id, pour l'affichage au clic (récap "en un coup d'œil",
// inventaire...). Se rabat sur le simple instantané pris à l'achat
// (nom/catégorie/coût) si l'objet n'existe plus dans la base commune.
export function resolveItemDetail(entree: InventoryEntry): ShopItem {
  const item = getItem(entree.item_id);
  if (!item) {
    return {
      id: entree.item_id,
      nom: entree.nom,
      categorie: entree.categorie,
      cout: entree.cout,
      origine: 'bande',
    };
  }
  return {
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
    origine: 'bande',
  };
}

// Revente d'équipement : moitié du prix payé, arrondie au supérieur.
export function prixVente(coutPaye: number): number {
  return Math.ceil(coutPaye / 2);
}

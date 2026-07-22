// Achat/gestion d'équipement structuré : shop commun (base d'objets extraite
// du compendium "Place du Marché") + listes d'équipement propres à la bande
// (catalogue.equipement / equipement_special, déjà utilisées en référence
// libre par EquipementReference). Pas de gestion de rareté ni de phase
// d'achat dédiée : simple déduction de trésorerie, à tout moment.
import { v4 as uuidv4 } from 'uuid';
import type { Member, RosterInstance, InventoryEntry } from '../types/roster';
import type { WarbandCatalog, Profile, SpecialRule } from '../types/catalog';
import { TOUS_LES_ITEMS } from '../data/items';

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
// restriction de bande), et "commun_sauf_..." (commun avec une exception
// mineure). Les tags spécifiques à une bande ou un rôle (ex : "skaven",
// "commun_heros") ne rendent pas l'objet accessible au shop commun ici — ils
// resteront affichés via les listes d'équipement propres à la bande.
function estAccesGenerique(acces: string[]): boolean {
  return acces.some((a) => a === 'commun' || /^rare_\d+$/.test(a) || a.startsWith('commun_sauf_'));
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

const DIACRITIQUES = new RegExp('[̀-ͯ]', 'g');

function slugify(texte: string): string {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITIQUES, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// Les objets des listes d'équipement de bande (catalogue.equipement) n'ont
// que nom/coût — les stats de jeu (portée/force/règles) vivent dans la base
// de référence (items/*.json). La plupart de ces objets sont les mêmes armes
// communes qu'on retrouve telles quelles dans cette base ; on les enrichit
// donc par correspondance de nom pour que le détail au clic ne soit pas vide.
const INDEX_ITEMS_PAR_NOM = new Map<string, (typeof TOUS_LES_ITEMS)[number]>();
for (const item of TOUS_LES_ITEMS) {
  const cle = slugify(item.nom);
  if (!INDEX_ITEMS_PAR_NOM.has(cle)) INDEX_ITEMS_PAR_NOM.set(cle, item);
}

// Objets propres à la bande (catalogue.equipement/equipement_special), déjà
// utilisés en lecture seule par EquipementReference. Si le profil précise
// `acces_equipement`, seules ces listes nommées sont proposées ; sinon,
// toutes les listes de la bande le sont (repli par défaut) — plusieurs
// listes (ex : infanterie/tireurs) partagent souvent les mêmes armes de
// base, d'où la déduplication finale par catégorie+nom.
export function getEquipementBande(catalogue: WarbandCatalog, profil: Profile | null): ShopItem[] {
  const items: ShopItem[] = [];
  const listes = catalogue.equipement ?? {};
  const cles = profil?.acces_equipement ?? Object.keys(listes);
  for (const cle of cles) {
    const liste = listes[cle];
    if (!liste) continue;
    const categories: (keyof typeof liste)[] = ['armes_cac', 'armes_tir', 'armures', 'divers'];
    for (const categorie of categories) {
      for (const item of liste[categorie] ?? []) {
        const reference = INDEX_ITEMS_PAR_NOM.get(slugify(item.nom));
        items.push({
          id: `bande:${catalogue.id}:${cle}:${slugify(categorie)}:${slugify(item.nom)}`,
          nom: item.nom,
          categorie,
          cout: item.cout,
          cout_fixe: typeof item.cout === 'number',
          disponibilite: item.restriction ?? item.note,
          texte: reference?.texte,
          portee: reference && 'portee' in reference ? (reference.portee as string | null) : undefined,
          force: reference && 'force' in reference ? (reference.force as string | null) : undefined,
          sauvegarde: reference && 'sauvegarde' in reference ? (reference.sauvegarde as string | null) : undefined,
          regles_speciales: reference?.regles_speciales,
          origine: 'bande',
        });
      }
    }
  }
  for (const item of catalogue.equipement_special ?? []) {
    items.push({
      id: `bande:${catalogue.id}:special:${item.id}`,
      nom: item.nom,
      categorie: 'special',
      cout: item.cout,
      cout_fixe: typeof item.cout === 'number',
      disponibilite: item.disponibilite,
      texte: item.texte,
      portee: item.portee,
      force: item.force,
      sauvegarde: item.sauvegarde,
      regles_speciales: item.regles_speciales,
      origine: 'bande',
    });
  }

  const vus = new Set<string>();
  return items.filter((item) => {
    const cle = `${item.categorie}|${item.nom.trim().toLowerCase()}`;
    if (vus.has(cle)) return false;
    vus.add(cle);
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

export function acheterPourMembre(roster: RosterInstance, membreId: string, entree: InventoryEntry): RosterInstance {
  return {
    ...roster,
    tresorerie: roster.tresorerie - entree.cout,
    membres: roster.membres.map((m) =>
      m.instance_id === membreId ? { ...m, inventaire: [...m.inventaire, entree] } : m
    ),
  };
}

export function acheterPourStock(roster: RosterInstance, entree: InventoryEntry): RosterInstance {
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

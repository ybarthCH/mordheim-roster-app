// Calcul de la statistique dérivée "Sv" (sauvegarde d'armure totale),
// affichée dynamiquement dans le bloc de stats dès qu'une figurine possède
// au moins un objet d'équipement (catégorie "armures") qui accorde une
// VRAIE sauvegarde d'armure — jamais une sauvegarde spéciale/invulnérable
// ("Ward save" — amulette lunaire, peaux enchantées, casque-marmite,
// casque, cape en peau de loup...), qui reste un mécanisme à part, non
// cumulable ici.
//
// Portée volontairement limitée aux objets de src/data/items/armures.json
// (pas aux compétences/règles spéciales de bande qui accorderaient une
// sauvegarde — ex : "Pelage épais" des Hommes-Bêtes, "Écaille naturelle" —
// laissées en texte informatif pour l'instant, à intégrer plus tard si
// besoin). Table explicite plutôt que parsing du champ texte libre
// `sauvegarde` (ShopItem) : ce champ mélange trop de formats incompatibles
// (valeurs conditionnelles à pied/monté, corps à corps/tir différents,
// mentions "spéciale"...) pour être analysé de façon fiable.
//
// Deux valeurs par objet :
// - `seule` : sauvegarde obtenue si l'objet est porté SEUL (aucune autre
//   armure de corps déjà présente) — la cible à atteindre sur 1D6 (6 = besoin
//   d'un 6+, etc.).
// - `combinee` : bonus additif apporté à la MEILLEURE armure déjà portée
//   quand cet objet est superposé à elle (boucliers, écu, pavois, armure
//   cathayenne en soie matelassée superposable, caparaçons).
//
// Pour l'écu et le pavois, dont la valeur dépend d'un état de jeu que le
// roster ne connaît pas (monté ou non, chargé de front ou non), on retient
// leur valeur par défaut/la plus courante (à pied, chargé de front) plutôt
// que de les exclure du calcul.
import type { InventoryEntry } from '../types/roster';
import { ARMURES_LOZHEIM } from './shop';

type SauvegardeArmure = {
  seule?: number;
  combinee?: number;
  // Ne se combine avec AUCUNE autre protection de cette liste (cuir durci :
  // "ne peut pas être combinée avec un autre type d'armure, en dehors des
  // casques et des rondaches", qui n'apportent eux-mêmes aucun bonus ici).
  exclusive?: boolean;
};

const SAUVEGARDE_ARMURES: Record<string, SauvegardeArmure> = {
  armure_cathayenne_soie_matelassee: { seule: 6, combinee: 1 },
  armure_du_chaos_market: { seule: 4 },
  armure_en_gromril_market: { seule: 4 },
  armure_en_ithilmar_market: { seule: 5 },
  armure_lamellaire: { seule: 4 },
  armure_legere: { seule: 6 },
  armure_lourde: { seule: 5 },
  armure_lourde_de_maitre: { seule: 4 },
  cuir_durci: { seule: 6, exclusive: true },
  exosquelette: { seule: 4 },
  // Sauvegarde au corps à corps (la moins bonne des deux valeurs de cet
  // objet, 5+ mêlée / 4+ tir) retenue par défaut — voir note écu/pavois.
  cape_en_peau_de_dragon_des_mers: { seule: 5 },
  bouclier: { seule: 6, combinee: 1 },
  // 5+ à pied par défaut (voir note écu/pavois ci-dessus) ; +2 en superposition.
  ecu: { seule: 5, combinee: 2 },
  // Considéré chargé de front par défaut (voir note écu/pavois ci-dessus).
  pavois: { seule: 6, combinee: 1 },
  caparacon: { seule: 5, combinee: 2 },
  caparacon_bretonnien: { seule: 5, combinee: 2 },
  // Niveau I (le plus faible) retenu par défaut : le niveau réellement
  // acheté (Écorce de fer, Sylvaneths) n'est pas distingué par un id séparé.
  ecorce_de_fer: { seule: 5 },
};

// Plafond officiel : une sauvegarde d'armure ne peut jamais être améliorée
// au-delà de 1+ (confirmé par deux sources indépendantes lors de l'audit de
// cette fonctionnalité — voir écu ci-dessus et la mutation "Iron Hard Skin"
// de Town Cryer #15).
const MEILLEURE_SAUVEGARDE_POSSIBLE = 1;

// Sauvegarde d'armure totale ("Sv") d'un membre, dérivée de son inventaire
// — ou `null` si rien dans son équipement n'accorde de vraie sauvegarde
// d'armure (voir portée en tête de fichier). `lozheimActif` : voir
// GameRules.armuresLozheim, +1 sur la valeur PROPRE des armures de corps
// concernées (pas sur leur éventuel bonus de superposition — voir
// ARMURES_LOZHEIM et ameliorerTexteSauvegarde dans utils/shop.ts).
export function sauvegardeArmureMembre(inventaire: InventoryEntry[], lozheimActif: boolean): number | null {
  const possedes = inventaire
    .map((entree) => ({ id: entree.item_id, def: SAUVEGARDE_ARMURES[entree.item_id] }))
    .filter((x): x is { id: string; def: SauvegardeArmure } => !!x.def);

  if (possedes.length === 0) return null;

  if (possedes.some((x) => x.def.exclusive)) {
    const exclusive = possedes.find((x) => x.def.exclusive)!;
    return exclusive.def.seule ?? null;
  }

  const candidats = possedes
    .filter((x) => x.def.seule !== undefined)
    .map((x) => ({
      id: x.id,
      seule: x.def.seule! - (lozheimActif && ARMURES_LOZHEIM.has(x.id) ? 1 : 0),
    }));
  if (candidats.length === 0) return null;

  const base = candidats.reduce((meilleur, c) => (c.seule < meilleur.seule ? c : meilleur));
  const bonus = possedes
    .filter((x) => x.id !== base.id)
    .reduce((somme, x) => somme + (x.def.combinee ?? 0), 0);

  return Math.max(MEILLEURE_SAUVEGARDE_POSSIBLE, base.seule - bonus);
}

// Modèle de données de l'instance de roster (données du joueur)
import type { SkillCategory, Stats } from './catalog';

export type Statut = 'actif' | 'hors_de_combat' | 'mort' | 'blesse';

export const STATUTS: { id: Statut; label: string }[] = [
  { id: 'actif', label: 'Actif' },
  { id: 'hors_de_combat', label: 'Hors de combat' },
  { id: 'mort', label: 'Mort' },
  { id: 'blesse', label: 'Blessé' },
];

export type SeriousInjuryRecord = {
  id: string;
  date: string;
  // Résultat saisi librement par le joueur (table papier, règles complètes
  // largement au-delà des 12 cas de la table de base 2D6).
  description: string;
};

export type AdvanceRecord = {
  id: string;
  date: string;
  xpAtRoll: number;
  roll: number;
  type: string;
  detail: string;
};

// Profil entièrement défini à la main pour une recrue "Franc-tireur"
// (indépendante du catalogue de la bande — profil, équipement, prix et
// solde propres à cette recrue).
export type ProfilFrancTireur = {
  nom: string;
  type: 'heros' | 'homme_de_main';
  stats: Stats;
  acces_competences: SkillCategory[];
  cout: number; // prix d'engagement, déduit une fois à l'embauche
  solde: number; // solde à payer après chaque bataille
};

export type Member = {
  instance_id: string;
  profil_id: string;
  nom_perso: string;
  equipement: string;
  xp: number;
  // XP de départ à la recrue (catalogue ou saisie manuelle) : ne déclenche
  // aucune avancée due, sert uniquement de référence pour ne compter que
  // les paliers franchis depuis le recrutement.
  xp_depart: number;
  stats_actuels: Stats;
  // Caractéristiques modifiées à la main (édition directe, blessure grave...),
  // par opposition à une augmentation obtenue via une avancée XP normale —
  // sert uniquement à l'affichage distinct sur la fiche personnage.
  stats_modifiees: (keyof Stats)[];
  competences_acquises: string[];
  sorts_connus: string[];
  statut: Statut;
  // Renseigné automatiquement quand le statut passe à "Mort".
  date_mort?: string;
  // Compteur manuel utilisé quand le statut est "Blessé".
  blesse_tour_actuel: number;
  blesse_tour_total: number;
  blessures_graves: SeriousInjuryRecord[];
  historique_avancees: AdvanceRecord[];
  notes: string;
  // Case manuelle "Grande Cible" (+20 au rating), non liée au catalogue.
  grande_cible: boolean;
  // Profil "Franc-tireur" : présent uniquement pour une recrue hors
  // catalogue, entièrement définie à la création (voir ProfilFrancTireur).
  profil_custom?: ProfilFrancTireur;
  // Homme de main ayant obtenu "Ce gars est doué" : traité comme un héros
  // (grille XP à 90, table d'avancement héros) à partir de là.
  promu_heros?: boolean;
  // Tables de compétences choisies à la promotion (2 ou 3), remplace
  // l'accès du profil d'origine une fois promu.
  acces_competences_override?: SkillCategory[];
  // Nombre de figurines représentées par cette entrée (groupe d'hommes de
  // main identiques). Toujours 1 pour un héros — voir la promotion, qui
  // détache une figurine du groupe plutôt que de le convertir en bloc.
  taille_groupe: number;
  // Nombre de figurines de ce groupe actuellement Hors de Combat (0 à
  // taille_groupe), en attente de résolution à l'assistant post-bataille.
  // Sans objet pour taille_groupe = 1 : le statut "Hors de combat" suffit.
  hors_combat: number;
};

// Journal de la session post-bataille associée, pour ne pas perdre ces
// informations une fois l'assistant terminé (visible/consultable depuis
// l'historique des batailles).
export type JournalPostBataille = {
  wyrdstoneTrouve: number;
  notesExploration: string;
  quantiteVendue: number;
  prixVente: number;
  soldeFrancsTireurs: number;
  blessures: { nom: string; description: string }[];
  survie: { nom: string; survecu: boolean }[];
};

export type BattleRecord = {
  id: string;
  date: string;
  resultat: 'victoire' | 'defaite' | 'nul';
  adversaires: string[];
  notes: string;
  journal?: JournalPostBataille;
};

export type RosterInstance = {
  id: string;
  bande_id: string;
  nom_bande: string;
  tresorerie: number;
  wyrdstone: number;
  equipement_reserve: string;
  membres: Member[];
  historique_batailles: BattleRecord[];
  createdAt: string;
  updatedAt: string;
};

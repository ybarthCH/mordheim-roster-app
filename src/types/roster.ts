// Modèle de données de l'instance de roster (données du joueur)
import type { Stats } from './catalog';

export type Statut = 'actif' | 'hors_de_combat' | 'mort' | 'capture';

export const STATUTS: { id: Statut; label: string }[] = [
  { id: 'actif', label: 'Actif' },
  { id: 'hors_de_combat', label: 'Hors de combat' },
  { id: 'mort', label: 'Mort' },
  { id: 'capture', label: 'Capturé' },
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

export type Member = {
  instance_id: string;
  profil_id: string;
  nom_perso: string;
  equipement: string;
  xp: number;
  pv_actuels: number;
  stats_actuels: Stats;
  // Caractéristiques modifiées à la main (édition directe, blessure grave...),
  // par opposition à une augmentation obtenue via une avancée XP normale —
  // sert uniquement à l'affichage distinct sur la fiche personnage.
  stats_modifiees: (keyof Stats)[];
  competences_acquises: string[];
  sorts_connus: string[];
  statut: Statut;
  blessures_graves: SeriousInjuryRecord[];
  historique_avancees: AdvanceRecord[];
  notes: string;
  // Case manuelle "Grande Cible" (+20 au rating), non liée au catalogue.
  grande_cible: boolean;
};

export type BattleRecord = {
  id: string;
  date: string;
  resultat: 'victoire' | 'defaite' | 'nul';
  adversaires: string[];
  notes: string;
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

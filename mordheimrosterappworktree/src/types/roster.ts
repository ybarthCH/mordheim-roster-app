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
  roll: number;
  resultat: string;
  effet: string;
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
  equipement_valeur: number;
  xp: number;
  pv_actuels: number;
  stats_actuels: Stats;
  competences_acquises: string[];
  sorts_connus: string[];
  statut: Statut;
  blessures_graves: SeriousInjuryRecord[];
  historique_avancees: AdvanceRecord[];
  notes: string;
};

export type BattleRecord = {
  id: string;
  date: string;
  resultat: 'victoire' | 'defaite' | 'nul';
  adversaire: string;
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

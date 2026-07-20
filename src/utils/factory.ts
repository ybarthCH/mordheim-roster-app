import { v4 as uuidv4 } from 'uuid';
import type { Profile, Stats } from '../types/catalog';
import type { Member, RosterInstance } from '../types/roster';

const STATS_VIDES: Stats = { M: 0, CC: 0, CT: 0, F: 0, E: 0, PV: 0, I: 0, A: 0, Cd: 0 };

export function creerMembre(profil: Profile): Member {
  const stats = profil.stats ? { ...profil.stats } : { ...STATS_VIDES };
  return {
    instance_id: uuidv4(),
    profil_id: profil.id,
    nom_perso: profil.nom,
    equipement: '',
    equipement_valeur: 0,
    xp: profil.xp_depart ?? 0,
    pv_actuels: stats.PV,
    stats_actuels: stats,
    competences_acquises: [],
    sorts_connus: [],
    statut: 'actif',
    blessures_graves: [],
    historique_avancees: [],
    notes: '',
  };
}

export function creerRoster(bandeId: string, nomBande: string, tresorerie: number): RosterInstance {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    bande_id: bandeId,
    nom_bande: nomBande,
    tresorerie,
    wyrdstone: 0,
    equipement_reserve: '',
    membres: [],
    historique_batailles: [],
    createdAt: now,
    updatedAt: now,
  };
}

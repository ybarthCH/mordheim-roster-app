import { v4 as uuidv4 } from 'uuid';
import type { Profile, Stats } from '../types/catalog';
import type { Member, ProfilFrancTireur, RosterInstance } from '../types/roster';

const STATS_VIDES: Stats = { M: 0, CC: 0, CT: 0, F: 0, E: 0, PV: 0, I: 0, A: 0, Cd: 0 };

function membreDeBase(): Omit<Member, 'profil_id' | 'nom_perso' | 'xp' | 'xp_depart' | 'stats_actuels'> {
  return {
    instance_id: uuidv4(),
    equipement: '',
    stats_modifiees: [],
    competences_acquises: [],
    sorts_connus: [],
    statut: 'actif',
    blesse_tour_actuel: 0,
    blesse_tour_total: 0,
    blessures_graves: [],
    historique_avancees: [],
    notes: '',
    grande_cible: false,
    taille_groupe: 1,
    hors_combat: 0,
  };
}

export function creerMembre(profil: Profile, xpDepart?: number, tailleGroupe = 1): Member {
  const stats = profil.stats ? { ...profil.stats } : { ...STATS_VIDES };
  const xp = xpDepart ?? profil.xp_depart ?? 0;
  return {
    ...membreDeBase(),
    profil_id: profil.id,
    nom_perso: profil.nom,
    xp,
    xp_depart: xp,
    stats_actuels: stats,
    taille_groupe: profil.type === 'homme_de_main' || profil.type === 'animal' ? Math.max(1, tailleGroupe) : 1,
  };
}

export function creerMembreFrancTireur(profilCustom: ProfilFrancTireur, xpDepart = 0, tailleGroupe = 1): Member {
  return {
    ...membreDeBase(),
    profil_id: `franc-tireur-${uuidv4()}`,
    nom_perso: profilCustom.nom,
    xp: xpDepart,
    xp_depart: xpDepart,
    stats_actuels: { ...profilCustom.stats },
    profil_custom: profilCustom,
    taille_groupe: profilCustom.type === 'homme_de_main' ? Math.max(1, tailleGroupe) : 1,
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

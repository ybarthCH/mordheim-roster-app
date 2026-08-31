import { v4 as uuidv4 } from 'uuid';
import type { Profile, Stats } from '../types/catalog';
import type { Member, ProfilFrancTireur, RosterInstance } from '../types/roster';
import type { FrancTireurCatalog } from '../types/hiredSword';
import { profilDeFrancTireur } from '../data/hiredSwords';

const STATS_VIDES: Stats = { M: 0, CC: 0, CT: 0, F: 0, E: 0, PV: 0, I: 0, A: 0, Cd: 0 };

function membreDeBase(
  competencesGratuites: string[] = []
): Omit<Member, 'profil_id' | 'nom_perso' | 'xp' | 'xp_depart' | 'stats_actuels'> {
  return {
    instance_id: uuidv4(),
    equipement: '',
    inventaire: [],
    stats_modifiees: [],
    competences_acquises: [...competencesGratuites],
    sorts_connus: [],
    regles_speciales_notes: [],
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
    ...membreDeBase(profil.competences_gratuites),
    profil_id: profil.id,
    nom_perso: profil.nom,
    xp,
    xp_depart: xp,
    stats_actuels: stats,
    ...(profil.stats_variables ? { stats_variables: { ...profil.stats_variables } } : {}),
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

export function creerMembreFrancTireurCatalogue(francTireur: FrancTireurCatalog): Member {
  const membre = creerMembre(profilDeFrancTireur(francTireur), 0, 1);
  return {
    ...membre,
    franc_tireur_id: francTireur.id,
    equipement: francTireur.equipement.join(', '),
    competences_acquises: francTireur.competences_departs ?? membre.competences_acquises,
    sorts_connus: francTireur.sorts_departs ?? membre.sorts_connus,
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
    stock: [],
    objets_personnalises: [],
    objets_surcharges: {},
    membres: [],
    historique_batailles: [],
    profils_bannis: [],
    effets_persistants: [],
    createdAt: now,
    updatedAt: now,
  };
}

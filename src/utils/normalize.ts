// Le schéma RosterInstance/Member s'est enrichi de nombreux champs au fil du
// développement (hors_combat, wyrdstone, inventaire, stock, blessures_graves,
// taille_groupe...). Les bandes créées avant l'ajout d'un champ n'ont aucune
// raison de l'avoir dans IndexedDB — sans ce filet, un simple `.map()` ou
// `.length` dessus plante l'écran. Toute lecture de roster (chargement,
// import JSON) doit passer par ici avant d'être utilisée par l'UI.
import { v4 as uuidv4 } from 'uuid';
import type { Stats } from '../types/catalog';
import type { Member, RosterInstance, Statut } from '../types/roster';

const STATS_VIDES: Stats = { M: 0, CC: 0, CT: 0, F: 0, E: 0, PV: 0, I: 0, A: 0, Cd: 0 };

function normaliserMembre(membre: Partial<Member>): Member {
  // `sorts_connus` servait autrefois de fourre-tout texte libre (règles
  // spéciales gagnées en jeu, sorts, mutations manuscrites). Le champ dédié
  // `regles_speciales_notes` sépare maintenant les deux : sur un roster
  // jamais encore relu depuis cette séparation (regles_speciales_notes
  // absent), on bascule l'ancien contenu de sorts_connus vers les notes —
  // il s'agissait alors très majoritairement de notes manuscrites, jamais
  // de vrais sorts choisis dans un sélecteur — et on repart avec des sorts
  // connus vides, prêts pour le nouveau système structuré. Idempotent :
  // une fois `regles_speciales_notes` présent, plus aucune bascule.
  const dejaMigreVersNotes = membre.regles_speciales_notes !== undefined;
  return {
    instance_id: membre.instance_id ?? uuidv4(),
    profil_id: membre.profil_id ?? '',
    nom_perso: membre.nom_perso ?? '',
    equipement: membre.equipement ?? '',
    inventaire: membre.inventaire ?? [],
    xp: membre.xp ?? 0,
    xp_depart: membre.xp_depart ?? 0,
    stats_actuels: membre.stats_actuels ?? { ...STATS_VIDES },
    stats_modifiees: membre.stats_modifiees ?? [],
    stats_variables: membre.stats_variables,
    competences_acquises: membre.competences_acquises ?? [],
    sorts_connus: dejaMigreVersNotes ? (membre.sorts_connus ?? []) : [],
    regles_speciales_notes: dejaMigreVersNotes ? membre.regles_speciales_notes! : (membre.sorts_connus ?? []),
    statut: (membre.statut as Statut | undefined) ?? 'actif',
    date_mort: membre.date_mort,
    blesse_tour_actuel: membre.blesse_tour_actuel ?? 0,
    blesse_tour_total: membre.blesse_tour_total ?? 0,
    blessures_graves: membre.blessures_graves ?? [],
    historique_avancees: membre.historique_avancees ?? [],
    notes: membre.notes ?? '',
    grande_cible: membre.grande_cible ?? false,
    profil_custom: membre.profil_custom,
    franc_tireur_id: membre.franc_tireur_id,
    franc_tireur_impaye: membre.franc_tireur_impaye ?? false,
    promu_heros: membre.promu_heros,
    acces_competences_override: membre.acces_competences_override,
    taille_groupe: membre.taille_groupe ?? 1,
    hors_combat: membre.hors_combat ?? 0,
  };
}

export function normaliserRoster(roster: Partial<RosterInstance>): RosterInstance {
  const now = new Date().toISOString();
  return {
    id: roster.id ?? uuidv4(),
    bande_id: roster.bande_id ?? '',
    nom_bande: roster.nom_bande ?? '',
    tresorerie: roster.tresorerie ?? 0,
    wyrdstone: roster.wyrdstone ?? 0,
    equipement_reserve: roster.equipement_reserve ?? '',
    stock: roster.stock ?? [],
    objets_personnalises: roster.objets_personnalises ?? [],
    objets_surcharges: roster.objets_surcharges ?? {},
    membres: (roster.membres ?? []).map(normaliserMembre),
    historique_batailles: roster.historique_batailles ?? [],
    leader_instance_id: roster.leader_instance_id,
    profils_bannis: roster.profils_bannis ?? [],
    tribu: roster.tribu,
    createdAt: roster.createdAt ?? now,
    updatedAt: roster.updatedAt ?? now,
  };
}

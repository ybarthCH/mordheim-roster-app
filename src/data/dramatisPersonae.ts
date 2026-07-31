import type { FrancTireurCatalog } from '../types/hiredSword';
import type { Member, RosterInstance } from '../types/roster';
import { toutesSauf, SKAVENS, MORTS_VIVANTS } from './bandeCategories';

// Chapitre Dramatis Personae (Livre des Règles, 1a) : personnages spéciaux
// trouvés via une recherche post-bataille dédiée (voir
// RechercheDramatisPersonaeModal), jamais recrutés directement. Partagent
// sinon toute la mécanique des francs-tireurs — voir hiredSwords.ts, dont
// ces profils rejoignent le catalogue FRANCS_TIREURS (champ
// est_dramatis_personae pour les distinguer à l'affichage).
export const DRAMATIS_PERSONAE: FrancTireurCatalog[] = [
  {
    id: 'aenur',
    nom: 'Aenur, l’épée du crépuscule',
    page_source: 153,
    recrutement: { cout: 150 },
    entretien: {
      type: 'aucun',
      cout: 0,
      texte:
        'Aenur ne reste jamais plus d’une bataille d’affilée avec la même bande : il quitte automatiquement la bande après chaque bataille. Une bande doit livrer la bataille suivante sans lui avant de pouvoir le rechercher (et payer sa prime de 150 CO) de nouveau.',
    },
    valeur: 100,
    employeurs: {
      bande_ids: toutesSauf(...SKAVENS, 'cult_of_the_possessed', ...MORTS_VIVANTS),
      texte: 'Toutes les bandes sauf les Skavens, les Possédés et les Morts-Vivants.',
    },
    stats: { M: 5, CC: 8, CT: 4, F: 4, E: 3, PV: 2, I: 7, A: 3, Cd: 8 },
    equipement: ['Armure d’ithilmar', 'Cape elfique', 'Ienh-Khain (épée magique)'],
    acces_competences: [],
    regles_speciales: [
      { nom: 'Bretteur Invincible', texte: 'En corps à corps, Aenur touche toujours ses ennemis sur 2+.' },
      {
        nom: 'Ienh-Khain (la Main de Khaine)',
        texte:
          'Cette épée d’une longueur démesurée autorise les parades et ajoute +1 à la Force d’Aenur ; elle provoque aussi des coups critiques sur 5+ au lieu de 6.',
      },
    ],
    competences_departs: ['combat_01', 'combat_05', 'combat_06', 'vitesse_02', 'vitesse_04', 'vitesse_06', 'force_01'],
    groupe_caracteristiques: 'elfe',
    tags: ['elfe'],
    gagne_experience: false,
    depart_apres_bataille: true,
    est_dramatis_personae: true,
  },
  {
    id: 'johann_le_surin',
    nom: 'Johann le Surin',
    page_source: 154,
    recrutement: { cout: 70 },
    entretien: {
      type: 'or',
      cout: 30,
      texte:
        '30 CO après chaque bataille à laquelle il participe. Johann est dépendant de l’ombre pourpre : sa prime de recrutement peut aussi être payée avec une dose d’ombre pourpre au lieu de 70 CO (à gérer manuellement).',
    },
    valeur: 60,
    employeurs: {
      bande_ids: toutesSauf(...SKAVENS, 'cult_of_the_possessed', ...MORTS_VIVANTS),
      texte: 'Toutes les bandes sauf les Skavens, les Possédés et les Morts-Vivants.',
    },
    stats: { M: 4, CC: 3, CT: 6, F: 4, E: 3, PV: 2, I: 6, A: 1, Cd: 7 },
    equipement: ['Couteaux de lancer', 'Plusieurs dagues (compte comme ayant toujours deux épées au corps à corps)'],
    acces_competences: [],
    regles_speciales: [
      {
        nom: 'Lanceur d’exception',
        texte:
          'Contrairement aux autres guerriers, Johann peut combiner Lanceur de Couteaux et Tir Rapide : il peut lancer six couteaux par tour s’il n’a pas bougé au tour précédent.',
      },
      {
        nom: 'Armes empoisonnées',
        texte: 'Ses armes sont toujours enduites de lotus noir ; il peut aussi prendre de l’ombre pourpre avant la bataille.',
      },
    ],
    competences_departs: ['vitesse_06', 'vitesse_07', 'tir_01', 'tir_03', 'tir_08'],
    groupe_caracteristiques: 'humain',
    gagne_experience: false,
    est_dramatis_personae: true,
  },
  {
    id: 'bertha_bestraufrung',
    nom: 'Bertha Bestraufrung, Haute Matriarche de Sigmar',
    page_source: 155,
    recrutement: { cout: 0 },
    entretien: {
      type: 'aucun',
      cout: 0,
      texte: 'Bertha sert Sigmar, pas l’or : aucune solde à lui verser après les batailles.',
    },
    valeur: 105,
    employeurs: {
      bande_ids: ['sisters_of_sigmar'],
      texte:
        'Bertha ne se joindra qu’à des bandes de Sœurs de Sigmar, et seulement si l’adversaire de la prochaine bataille a une valeur de bande supérieure (0-49 : impossible ; 50-99 : 6+ ; 100-149 : 5+ ; 150-199 : 4+ ; 200+ : 3+ sur 1D6, à vérifier sur table papier avant la recherche).',
    },
    stats: { M: 4, CC: 5, CT: 3, F: 4, E: 4, PV: 2, I: 4, A: 3, Cd: 10 },
    equipement: ['Deux marteaux sigmarites', 'Armure de gromril', 'Fiole d’eau bénite', 'Relique sacrée'],
    acces_competences: [],
    regles_speciales: [
      { nom: 'Haute Matriarche', texte: 'En tant que Haute Matriarche des Sœurs de Sigmar, Bertha est automatiquement le chef de la bande.' },
      { nom: 'Vierge de Sigmar', texte: 'Bertha obtient +2 à tous ses jets pour déterminer si ses prières de Sigmar fonctionnent.' },
      { nom: 'Fureur du juste', texte: 'Bertha est affectée par la haine des bandes de Skavens, de Possédés et de Morts-Vivants.' },
    ],
    competences_departs: ['force_01', 'force_06'],
    sorts_domaine_bande: true,
    sorts_departs: [
      'Le Marteau de Sigmar',
      'Cœur d’Acier',
      'Feu de l’Âme',
      'Bouclier de Sigmar',
      'Imposition des Mains',
      'Armure du Juste',
    ],
    groupe_caracteristiques: 'humain',
    gagne_experience: false,
    est_dramatis_personae: true,
  },
  {
    id: 'veskit',
    nom: 'Veskit, Grand Exécuteur du clan Eshin',
    page_source: 156,
    recrutement: { cout: 80 },
    entretien: { type: 'or', cout: 35, texte: '35 CO après chaque bataille à laquelle il participe.' },
    valeur: 70,
    employeurs: { bande_ids: [...SKAVENS], texte: 'Veskit ne peut être engagé que par des bandes de Skavens.' },
    stats: { M: 5, CC: 5, CT: 4, F: 4, E: 4, PV: 2, I: 5, A: 4, Cd: 8 },
    equipement: ['Griffes de combat Eshin (avec pistolets à malepierre intégrés)'],
    acces_competences: [],
    regles_speciales: [
      {
        nom: 'Griffes de combat Eshin',
        texte:
          'L’attaque supplémentaire est déjà comptée dans le profil. Chaque griffe contient un pistolet à malepierre incorporé : Veskit peut donc tirer à chaque tour, combat au corps à corps avec une Force de 5 et un modificateur de sauvegarde de -3, et peut toujours effectuer 2 parades avec ses griffes.',
      },
      { nom: 'Implacable', texte: 'Machine à tuer froide et insensible : immunisé à toute psychologie.' },
      {
        nom: 'Insensible',
        texte: 'Ignore les résultats à terre et sonné. Doit perdre son dernier Point de Vie pour être hors de combat et retiré du jeu.',
      },
      { nom: 'L’Œil', texte: 'Peut repérer un ennemi caché dans un rayon de deux fois sa valeur d’Initiative.' },
      { nom: 'Corps Métallique', texte: 'Confère à Veskit sa forte Endurance et une sauvegarde de 3+.' },
    ],
    groupe_caracteristiques: 'skaven',
    gagne_experience: false,
    est_dramatis_personae: true,
  },
];

export function estDramatisPersonae(membre: Member): boolean {
  return !!getDramatisPersonae(membre.franc_tireur_id);
}

export function getDramatisPersonae(id: string | undefined): FrancTireurCatalog | undefined {
  return id ? DRAMATIS_PERSONAE.find((p) => p.id === id) : undefined;
}

// Personnages spéciaux qu'une bande peut actuellement rechercher : réservés
// à ses employeurs habituels, et jamais déjà présents dans le roster (mort
// ou vivant) — sauf s'ils l'ont quitté automatiquement (depart_apres_bataille,
// ex : Aenur), auquel cas ils redeviennent recherchables.
export function dramatisPersonaeDisponibles(roster: RosterInstance): FrancTireurCatalog[] {
  const dejaPresents = new Set(
    roster.membres.filter((m) => m.franc_tireur_id).map((m) => m.franc_tireur_id as string)
  );
  return DRAMATIS_PERSONAE.filter(
    (dp) => dp.employeurs.bande_ids.includes(roster.bande_id) && !dejaPresents.has(dp.id)
  );
}

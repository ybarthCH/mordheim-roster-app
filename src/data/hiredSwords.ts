import type { Profile } from '../types/catalog';
import type { FrancTireurCatalog } from '../types/hiredSword';
import type { Member, RosterInstance } from '../types/roster';
import type { Language } from '../state/useLanguage';
import { getItem } from './items';
import { translateItem } from '../i18n/data/items';
import {
  TOUTES_LES_BANDES,
  SKAVENS,
  MORTS_VIVANTS,
  PEAUX_VERTES,
  CHAOS,
  MERCENAIRES,
  MERCENAIRES_ET_KISLEVITES,
  HUMAINS,
  BIEN,
  MALEFIQUES,
  NAINS,
  toutesSauf,
  uniques,
} from './bandeCategories';
import { DRAMATIS_PERSONAE, RESTRICTIONS_ABSOLUES_DP } from './dramatisPersonae';

export { SKAVENS, MORTS_VIVANTS, toutesSauf };

const brutesDuBien = uniques([...MERCENAIRES, 'witch_hunters']);

const PROFILS_BRUTS: FrancTireurCatalog[] = [
  {
    id: 'gladiateur',
    nom: 'Gladiateur',
    page_source: 2,
    recrutement: { cout: 30 },
    entretien: { type: 'or', cout: 15, texte: '15 CO après chaque bataille à laquelle il participe.' },
    valeur: 22,
    employeurs: {
      bande_ids: toutesSauf(...MORTS_VIVANTS, ...SKAVENS),
      texte: 'Toute bande sauf les Morts-Vivants et les Skavens.',
    },
    stats: { M: 4, CC: 4, CT: 3, F: 4, E: 4, PV: 1, I: 4, A: 2, Cd: 7 },
    equipement: ['Morgenstern', 'Gantelet à pointe', 'Casque'],
    acces_competences: ['combat', 'force', 'vitesse'],
    regles_speciales: [
      {
        nom: 'Gantelet à pointe',
        texte:
          'Compte à la fois comme une rondache et comme une arme additionnelle. Les autres héros ne peuvent pas apprendre à s’en servir.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'ogre',
    nom: 'Ogre',
    nom_original: 'Ogre Bodyguard',
    page_source: 2,
    recrutement: { cout: 80 },
    entretien: { type: 'or', cout: 30, texte: '30 CO après chaque bataille à laquelle il participe.' },
    valeur: 25,
    employeurs: { bande_ids: toutesSauf(...SKAVENS), texte: 'Toute bande sauf les Skavens.' },
    stats: { M: 6, CC: 3, CT: 2, F: 4, E: 4, PV: 3, I: 3, A: 2, Cd: 7 },
    equipement: [
      'Deux épées, haches ou gourdins (ou une combinaison), ou une arme à deux mains',
      'Armure légère',
    ],
    equipement_choix: [
      {
        ligneIndex: 0,
        options: [
          { id: 'deux_epees', itemIds: ['epee', 'epee'] },
          { id: 'deux_haches', itemIds: ['hache', 'hache'] },
          { id: 'deux_gourdins', itemIds: ['arme_contondante_une_main', 'arme_contondante_une_main'] },
          { id: 'epee_hache', itemIds: ['epee', 'hache'] },
          { id: 'epee_gourdin', itemIds: ['epee', 'arme_contondante_une_main'] },
          { id: 'hache_gourdin', itemIds: ['hache', 'arme_contondante_une_main'] },
          { id: 'arme_deux_mains', itemIds: ['arme_a_deux_mains'] },
        ],
      },
    ],
    acces_competences: ['combat', 'force'],
    regles_speciales: [
      { nom: 'Peur', texte: 'L’Ogre provoque la peur.' },
      { nom: 'Grand', texte: 'L’Ogre est une grande cible.' },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'ogre_garde_mangeur',
  },
  {
    id: 'halfling',
    nom: 'Éclaireur Halfling',
    nom_original: 'Halfling Scout',
    page_source: 3,
    recrutement: { cout: 15 },
    entretien: { type: 'or', cout: 5, texte: '5 CO après chaque bataille à laquelle il participe.' },
    valeur: 5,
    employeurs: {
      bande_ids: toutesSauf(...SKAVENS, ...MORTS_VIVANTS, 'cult_of_the_possessed'),
      texte: 'Toute bande sauf les Skavens, les Morts-Vivants et les Possédés.',
    },
    stats: { M: 4, CC: 2, CT: 4, F: 2, E: 2, PV: 1, I: 4, A: 1, Cd: 8 },
    equipement: ['Arc', 'Dague', 'Casserole (compte comme un casque)'],
    acces_competences: ['tir', 'vitesse'],
    regles_speciales: [
      {
        nom: 'Cuistot',
        texte:
          'La taille maximale de la bande augmente de 1. Cela n’augmente pas le nombre maximal de héros.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'halfling',
    tags: ['halfling'],
  },
  {
    id: 'mage',
    nom: 'Mage',
    page_source: 3,
    recrutement: { cout: 30 },
    entretien: { type: 'or', cout: 15, texte: '15 CO après chaque bataille à laquelle il participe.' },
    valeur: 16,
    employeurs: {
      bande_ids: toutesSauf('witch_hunters', 'sisters_of_sigmar'),
      texte: 'Toute bande sauf les Répurgateurs et les Sœurs de Sigmar.',
    },
    stats: { M: 4, CC: 2, CT: 2, F: 3, E: 3, PV: 1, I: 4, A: 1, Cd: 8 },
    equipement: ['Bâton'],
    acces_competences: ['academique'],
    magie: { categorie: 'magie_mineure', sorts_depart: 2 },
    regles_speciales: [
      {
        nom: 'Jeteur de sorts',
        texte:
          'Commence avec deux sorts tirés aléatoirement dans la liste de magie mineure. Lorsqu’il gagne une nouvelle compétence, il peut tirer un nouveau sort de magie mineure à la place.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'chevalier_solitaire',
    nom: 'Chevalier solitaire',
    nom_original: 'Freelance Knight',
    page_source: 4,
    recrutement: { cout: 50 },
    entretien: { type: 'or', cout: 20, texte: '20 CO après chaque bataille à laquelle il participe.' },
    valeur: 21,
    employeurs: {
      // "Francs-tireurs : Les Escorteurs Impériaux ne peuvent être
      // accompagnés que par des Francs-tireurs montés. Cela concerne les
      // Chevaliers solitaires et les Patrouilleurs." (Escorteurs Impériaux
      // [GLM].pdf p.1) — ajouté explicitement ici, en plus de brutesDuBien ;
      // voir RESTRICTIONS_ABSOLUES ci-dessous pour la fermeture réciproque
      // (tout autre franc-tireur exclu pour cette bande).
      bande_ids: uniques([...brutesDuBien, 'escorteurs_imperiaux']),
      texte: 'Les bandes de Mercenaires et de Répurgateurs.',
    },
    stats: { M: 4, CC: 4, CT: 3, F: 4, E: 3, PV: 1, I: 4, A: 1, Cd: 7 },
    equipement: ['Armure lourde', 'Bouclier', 'Lance de cavalerie', 'Épée', 'Destrier (règles de cavalerie)'],
    acces_competences: ['combat', 'force'],
    regles_speciales: [
      {
        nom: 'Cavalier',
        texte:
          'Avec les règles optionnelles de cavalerie, il monte un destrier et possède Équitation. Sa sauvegarde est de 3+ monté et de 4+ à pied.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    profils_secondaires: [
      { nom: 'Destrier', stats: { M: 8, CC: 3, CT: 0, F: 3, E: 3, PV: 1, I: 3, A: 1, Cd: 5 } },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'eclaireur_elfe',
    nom: 'Éclaireur elfe',
    nom_original: 'Elf Ranger',
    page_source: 4,
    recrutement: { cout: 40 },
    entretien: {
      type: 'or',
      cout: 20,
      cout_si_elfe: 40,
      texte: '20 CO, ou 40 CO si la bande comprend des nains.',
    },
    valeur: 12,
    employeurs: {
      // Exclusion explicite : "à l'exception de l'Éclaireur Elfe pour qui
      // travailler avec des individus aussi sales et brutaux est
      // inconcevable !" (Gladiateurs [GLM].pdf p.2, règle Francs-tireurs) —
      // seul cas où les Gladiateurs (ajoutés à MERCENAIRES, voir
      // bandeCategories.ts) doivent rester exclus malgré brutesDuBien.
      bande_ids: brutesDuBien.filter((id) => id !== 'gladiateurs'),
      texte: 'Les bandes de Mercenaires et de Répurgateurs.',
    },
    stats: { M: 5, CC: 4, CT: 5, F: 3, E: 3, PV: 1, I: 6, A: 1, Cd: 8 },
    equipement: ['Arc elfique', 'Épée', 'Cape elfique'],
    acces_competences: ['tir', 'vitesse', 'special'],
    regles_speciales: [
      {
        nom: 'Chercheur',
        texte: 'Lors d’un jet d’exploration, permet de modifier le résultat d’un dé de +1 ou -1.',
      },
      {
        nom: 'Excellente vue',
        texte: 'Détecte les ennemis cachés à une distance égale à deux fois son Initiative en pas.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'eclaireur_elfe_sagesse',
        nom: 'Sagesse',
        texte: 'Les sorts hostiles ne l’affectent pas sur 4+ sur 1D6.',
        valeurPuissance: 0,
      },
      {
        id: 'eclaireur_elfe_chance',
        nom: 'Chance',
        texte: 'Une fois par partie, peut relancer l’un de ses propres jets de dé.',
        valeurPuissance: 20,
      },
    ],
    groupe_caracteristiques: 'elfe',
    tags: ['elfe'],
  },
  {
    id: 'tueur_trolls_nain',
    nom: 'Tueur de trolls nain',
    nom_original: 'Dwarf Troll Slayer',
    page_source: 5,
    recrutement: { cout: 25 },
    entretien: {
      type: 'or',
      cout: 10,
      cout_si_elfe: 20,
      texte: '10 CO, ou 20 CO si la bande comprend des elfes.',
    },
    valeur: 12,
    employeurs: {
      // "Hired Swords: [...] They may hire an Ogre Bodyguard, Dwarf
      // Trollslayer, Tilean Marksman or a Big Game Hunter."
      // (Lustrian-Reavers-V1.2.pdf p.2, "Épées louées") — les 3 autres
      // francs-tireurs cités fonctionnaient déjà (listes de base plus
      // larges), seul celui-ci en manquait ; RESTRICTIONS_ABSOLUES.lustrian_reavers
      // le référence déjà mais ne fait que RESTREINDRE une liste de base,
      // jamais l'étendre — sans cet ajout il restait un artefact sans effet.
      bande_ids: uniques([...brutesDuBien, 'lustrian_reavers']),
      texte: 'Les bandes de Mercenaires et de Répurgateurs.',
    },
    stats: { M: 3, CC: 4, CT: 3, F: 3, E: 4, PV: 1, I: 2, A: 1, Cd: 9 },
    equipement: ['Deux haches ou une hache à deux mains'],
    equipement_choix: [
      {
        ligneIndex: 0,
        options: [
          { id: 'deux_haches', itemIds: ['hache', 'hache'] },
          { id: 'arme_deux_mains', itemIds: ['arme_a_deux_mains'] },
        ],
      },
    ],
    acces_competences: ['combat', 'force', 'special'],
    regles_speciales: [
      {
        nom: 'Vœu de mort',
        texte: 'Immunisé à toute psychologie et ne teste jamais Seul contre tous.',
      },
      {
        nom: 'Coriace',
        texte: 'N’est mis hors de combat que sur 6 sur le tableau des dégâts ; un 5 compte comme Sonné.',
      },
      { nom: 'Tête dure', texte: 'Ignore les règles spéciales des masses, gourdins et armes similaires.' },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'tueur_charge_furieuse',
        nom: 'Charge furieuse',
        texte: 'Double ses Attaques le tour où il charge, mais subit -1 pour toucher pendant ce tour.',
        valeurPuissance: 40,
      },
      {
        id: 'tueur_monstres',
        nom: 'Tueur de monstres',
        texte:
          'Blesse toujours sur 4+, sans tenir compte de l’Endurance, sauf si sa Force permet de blesser plus facilement.',
        valeurPuissance: 20,
      },
      {
        id: 'tueur_berserk',
        nom: 'Berserk',
        texte: 'Ajoute +1 à ses jets pour toucher pendant le tour où il charge.',
        valeurPuissance: 20,
      },
    ],
    groupe_caracteristiques: 'nain',
    tags: ['nain'],
  },
  {
    id: 'tireur_elite_tileen',
    nom: 'Tireur d’Élite Tiléen',
    nom_original: 'Tilean Marksman',
    page_source: 6,
    recrutement: { cout: 30 },
    entretien: { type: 'or', cout: 15, texte: '15 CO après chaque bataille à laquelle il participe.' },
    valeur: 16,
    employeurs: {
      bande_ids: toutesSauf(...SKAVENS, ...PEAUX_VERTES, ...MORTS_VIVANTS),
      texte: 'Toute bande sauf les Skavens, les Orques et les Morts-Vivants.',
    },
    stats: { M: 4, CC: 3, CT: 4, F: 3, E: 3, PV: 1, I: 3, A: 1, Cd: 7 },
    equipement: ['Armure légère', 'Épée', 'Dague', 'Arbalète'],
    acces_competences: ['tir'],
    regles_speciales: [
      {
        nom: 'Main ferme',
        texte: 'Ignore le modificateur de longue portée lorsqu’il tire avec son arbalète.',
      },
      {
        nom: 'Œil de lynx',
        texte: 'Ignore le modificateur de couvert lorsqu’il tire avec son arbalète.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'patrouilleur',
    nom: 'Patrouilleur',
    nom_original: 'Road Warden',
    page_source: 7,
    recrutement: { cout: 40 },
    entretien: { type: 'or', cout: 20, texte: '20 CO après chaque bataille à laquelle il participe.' },
    valeur: 22,
    employeurs: {
      // Voir chevalier_solitaire ci-dessus : même règle "Francs-tireurs"
      // des Escorteurs Impériaux, qui nomme aussi le Patrouilleur.
      bande_ids: uniques([...BIEN, 'escorteurs_imperiaux']),
      texte: 'Les bandes alignées du côté du Bien, ainsi que les Gladiateurs.',
    },
    stats: { M: 4, CC: 3, CT: 4, F: 3, E: 3, PV: 1, I: 3, A: 1, Cd: 8 },
    equipement: ['Arbalète', 'Marteau de cavalerie', 'Dague', 'Armure lourde', 'Trois torches', 'Cheval'],
    acces_competences: ['combat', 'force', 'tir'],
    regles_speciales: [
      {
        nom: 'Tireur infaillible',
        texte: 'Possède les compétences Œil de faucon et Tireur d’élite.',
      },
      {
        nom: 'Impavide',
        texte: 'Peut relancer ses tests de panique et de peur ratés ; immunisé à Seul contre tous.',
      },
      {
        nom: 'Cavalier expert',
        texte:
          'Compte comme ayant Tir en mouvement à cheval et ne subit aucun malus pour s’être déplacé et tirer à cheval.',
      },
      {
        nom: 'Diligences',
        texte:
          'Dans un scénario comprenant une diligence ou une charrette, peut relancer un dé par tour jusqu’à ce qu’une relance donne 1.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    profils_secondaires: [
      { nom: 'Cheval', stats: { M: 8, CC: 0, CT: 0, F: 3, E: 3, PV: 1, I: 3, A: 0, Cd: 5 } },
    ],
    groupe_caracteristiques: 'humain',
    incompatibles: ['bandit_grand_chemin'],
  },
  {
    id: 'bandit_grand_chemin',
    nom: 'Bandit de Grand Chemin',
    nom_original: 'Highwayman',
    page_source: 8,
    recrutement: { cout: 35 },
    entretien: { type: 'or', cout: 20, texte: '20 CO après chaque bataille à laquelle il participe.' },
    valeur: 20,
    employeurs: {
      // "May be Hired: Any warband, except Sisters of Sigmar, Witch
      // Hunters and any good-aligned Elves may hire a Highwayman."
      // (Hired Sword Compendium part1.pdf p.11) — le texte affiché
      // ci-dessous excluait déjà "les elfes du Bien" (seule bande d'elfes
      // non-maléfique du catalogue : Guerriers Fantômes), mais bande_ids
      // ne l'excluait pas réellement.
      bande_ids: toutesSauf('sisters_of_sigmar', 'witch_hunters', 'guerriers_fantomes'),
      texte: 'Toute bande sauf les Sœurs de Sigmar, les Répurgateurs et les elfes du Bien.',
    },
    stats: { M: 4, CC: 3, CT: 4, F: 3, E: 3, PV: 1, I: 3, A: 1, Cd: 7 },
    equipement: ['Paire de pistolets', 'Rapière', 'Cape (compte comme une rondache)', 'Dague', 'Cheval'],
    acces_competences: ['combat', 'tir', 'vitesse'],
    regles_speciales: [
      { nom: 'Duelliste expert', texte: 'Possède les compétences Pistolier et Tireur d’élite.' },
      {
        nom: 'Sans scrupules',
        texte:
          'Après chaque bataille, sur 1 sur 1D6, il vole un trésor à la bande. Ce trésor est perdu.',
      },
      {
        nom: 'Cavalier expert',
        texte: 'À cheval, compte comme immobile pour les tirs et ignore le malus pour s’être déplacé.',
      },
      {
        nom: 'Diligences',
        texte:
          'Dans un scénario comprenant une diligence ou une charrette, peut relancer un dé par tour jusqu’à ce qu’une relance donne 1.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    profils_secondaires: [
      { nom: 'Cheval', stats: { M: 8, CC: 0, CT: 0, F: 3, E: 3, PV: 1, I: 3, A: 0, Cd: 5 } },
    ],
    groupe_caracteristiques: 'humain',
    incompatibles: ['patrouilleur'],
  },
  {
    id: 'chasseur',
    nom: 'Chasseur',
    nom_original: 'Beast Hunter',
    page_source: 9,
    recrutement: { cout: 35 },
    entretien: {
      type: 'or',
      cout: 15,
      texte: '15 CO après chaque bataille à laquelle il participe.',
      exemption: {
        label: 'Bataille contre des Hommes-Bêtes',
        texte: 'Ne réclame aucune solde pour une bataille contre des Hommes-Bêtes.',
      },
    },
    valeur: 18,
    employeurs: {
      bande_ids: toutesSauf(...SKAVENS, ...MORTS_VIVANTS, ...PEAUX_VERTES, ...CHAOS),
      texte: 'Toute bande sauf les Skavens, Morts-Vivants, Peaux-Vertes et Adeptes du Chaos.',
    },
    stats: { M: 4, CC: 3, CT: 4, F: 3, E: 3, PV: 1, I: 4, A: 2, Cd: 7 },
    equipement: ['Deux haches', 'Hache de jet (couteau de lancer, +1 F)', 'Armure légère'],
    acces_competences: ['combat', 'force'],
    regles_speciales: [
      {
        nom: 'Haine des Hommes-Bêtes',
        texte: 'Hait tous les Hommes-Bêtes et combat contre eux sans réclamer de solde.',
      },
      { nom: 'Trophées', texte: 'Provoque la peur chez les Hommes-Bêtes.' },
      {
        nom: 'Prédateur',
        texte:
          'Dans une bataille en extérieur impliquant des Hommes-Bêtes, se place après les deux bandes, caché, hors de la zone de déploiement ennemie.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'assassin_imperial',
    nom: 'Assassin Impérial',
    nom_original: 'Imperial Assassin',
    page_source: 10,
    recrutement: { cout: 40 },
    entretien: { type: 'or', cout: 20, texte: '20 CO après chaque bataille à laquelle il participe.' },
    valeur: 22,
    employeurs: {
      bande_ids: toutesSauf('witch_hunters', 'sisters_of_sigmar', 'guerriers_fantomes', ...PEAUX_VERTES, ...SKAVENS),
      texte: 'Toute bande sauf les Répurgateurs, Sœurs de Sigmar, Guerriers Fantômes, Peaux-Vertes et Skavens.',
    },
    stats: { M: 4, CC: 4, CT: 4, F: 3, E: 3, PV: 1, I: 5, A: 2, Cd: 8 },
    equipement: ['Épée', 'Dague', 'Couteaux de jet', 'Arbalète de poing'],
    acces_competences: ['combat', 'tir', 'vitesse', 'special'],
    regles_speciales: [
      {
        nom: 'Maître d’armes',
        texte:
          'Peut utiliser toute arme sauf les armes à feu. Les armes achetées pour lui restent personnelles et ne peuvent être données à un autre guerrier.',
      },
      {
        nom: 'Empoisonneur',
        texte:
          'Avant chaque partie, choisit gratuitement du lotus noir ou du venin fuligineux pour ses propres armes.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'assassin_frappe_dos',
        nom: 'Frappe dans le dos',
        texte:
          'Peut charger un adversaire invisible à portée. Après cette charge : +1 pour toucher et +1 au jet de dégâts pendant la première phase de corps à corps.',
        valeurPuissance: 40,
      },
      {
        id: 'assassin_homme_ombre',
        nom: 'Homme de l’ombre',
        texte:
          'À 1ps d’un mur ou obstacle linéaire, un ennemi doit réussir un test d’Initiative avant de le charger ou de le prendre pour cible.',
        valeurPuissance: 20,
      },
      {
        id: 'assassin_charge_furieuse',
        nom: 'Charge furieuse',
        texte: 'Peut choisir Charge furieuse dans la liste de Force.',
        valeurPuissance: 0,
      },
    ],
    groupe_caracteristiques: 'humain',
    tags: ['malefique'],
  },
  {
    id: 'barde',
    nom: 'Barde',
    page_source: 11,
    recrutement: { cout: 20 },
    entretien: { type: 'or', cout: 10, texte: '10 CO après chaque bataille à laquelle il participe.' },
    valeur: 8,
    employeurs: {
      bande_ids: uniques([...MERCENAIRES, 'sisters_of_sigmar', 'witch_hunters']),
      texte: 'Les Mercenaires, les Sœurs de Sigmar et les Répurgateurs.',
    },
    stats: { M: 4, CC: 3, CT: 3, F: 3, E: 3, PV: 1, I: 3, A: 1, Cd: 7 },
    equipement: ['Épée', 'Dague', 'Armure légère'],
    acces_competences: ['academique', 'vitesse'],
    regles_speciales: [
      {
        nom: 'Chanteur',
        texte:
          'Toute figurine alliée à 6ps peut relancer ses tests de Commandement ratés avec un bonus de +1, y compris les tests de déroute.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'chaman_norse',
    nom: 'Chaman Norse',
    nom_original: 'Norse Shaman',
    page_source: 12,
    recrutement: { cout: 45 },
    entretien: { type: 'or', cout: 25, texte: '25 CO après chaque bataille à laquelle il participe.' },
    valeur: 25,
    employeurs: {
      bande_ids: uniques([...HUMAINS, 'maraudeurs_du_chaos']).filter((id) => id !== 'hors_la_loi_de_stirwood'),
      texte: 'Les bandes d’Humains, de Norses et de Maraudeurs du Chaos.',
    },
    stats: { M: 4, CC: 3, CT: 2, F: 3, E: 3, PV: 1, I: 4, A: 1, Cd: 8 },
    equipement: ['Bâton runique', 'Épée ou hache'],
    equipement_choix: [
      {
        ligneIndex: 1,
        options: [
          { id: 'epee', itemIds: ['epee'] },
          { id: 'hache', itemIds: ['hache'] },
        ],
      },
    ],
    acces_competences: ['combat', 'academique'],
    regles_speciales: [
      {
        nom: 'Runes',
        texte:
          'Commence avec deux Runes Norses tirées aléatoirement. Elles suivent les règles des prières de Sigmar. Une Rune déjà connue réduit sa difficulté de 1.',
      },
      {
        nom: 'Mugissement du Nord (Difficulté 9)',
        texte:
          'Le Chaman devient immunisé aux tirs. À chaque phase de Ralliement du Chaman, l’effet cesse sur 1-2 sur 1D6.',
      },
      {
        nom: 'Fureur d’Angvar (Difficulté 7)',
        texte:
          'Tous les guerriers à 8ps gagnent +1 pour toucher au corps à corps jusqu’au début du prochain tour du Chaman.',
      },
      {
        nom: 'Lance de Glace d’Elvek (Difficulté 7)',
        texte: 'Portée 18ps ; la première figurine sur la trajectoire subit une touche de F4.',
      },
      {
        nom: 'Don de Clairvoyance (Difficulté 7)',
        texte:
          'Permet de modifier un jet de dé de +1/-1 avant la prochaine phase de Ralliement. Un 6 ainsi créé pour blesser ne produit pas de critique.',
      },
      {
        nom: 'Baiser de Givre (Difficulté 6)',
        texte: 'Une figurine à 12ps doit réussir un test d’Initiative ou être mise à terre.',
      },
      {
        nom: 'Puissance de l’Ours (Difficulté 9)',
        texte:
          'Gagne +2 F, +2 E, +1 A et -2 I (minimum 1). Test de Cd au début de chaque tour pour maintenir l’effet. Une seule utilisation par partie.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'duelliste',
    nom: 'Duelliste',
    page_source: 13,
    recrutement: { cout: 35 },
    entretien: { type: 'or', cout: 15, texte: '15 CO après chaque bataille à laquelle il participe.' },
    valeur: 18,
    employeurs: {
      bande_ids: toutesSauf(...SKAVENS, ...MORTS_VIVANTS),
      texte: 'Toute bande sauf les Skavens et les Morts-Vivants.',
    },
    stats: { M: 4, CC: 4, CT: 3, F: 3, E: 3, PV: 1, I: 4, A: 2, Cd: 7 },
    equipement: ['Épée', 'Dague', 'Pistolet de duel', 'Cape (compte comme une rondache)'],
    acces_competences: ['combat', 'tir'],
    regles_speciales: [
      {
        nom: 'Tourbillon de lames',
        texte:
          'Peut parer avec son épée et sa cape si son jet est inférieur à sa CC, au lieu de devoir dépasser le meilleur jet pour toucher adverse.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'muletier',
    nom: 'Muletier',
    nom_original: 'Mule Skinner',
    page_source: 14,
    recrutement: { cout: 35 },
    entretien: { type: 'or', cout: 15, texte: '15 CO après chaque bataille à laquelle il participe.' },
    valeur: 20,
    employeurs: {
      bande_ids: toutesSauf('cult_of_the_possessed', ...SKAVENS, ...MORTS_VIVANTS),
      texte: 'Toute bande sauf les Possédés, les Skavens et les Morts-Vivants.',
    },
    stats: { M: 4, CC: 3, CT: 3, F: 3, E: 3, PV: 1, I: 3, A: 1, Cd: 7 },
    equipement: ['Fouet', 'Dague'],
    acces_competences: ['combat', 'force', 'special'],
    regles_speciales: [
      {
        nom: 'Dresseur',
        texte: 'Commence avec la compétence Dresseur pour un type d’animal choisi par le joueur.',
      },
      {
        nom: 'Fouet',
        texte:
          'F U-1, +1 à la sauvegarde ennemie. Donne +1 A en charge ou lorsqu’il est chargé, peut désarmer au lieu de blesser, et ne peut pas être paré.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'muletier_adresse_fouet',
        nom: 'Adresse au fouet',
        texte: 'Peut relancer ses jets pour toucher avec un fouet ; le second résultat est obligatoire.',
        valeurPuissance: 20,
      },
      { id: 'muletier_baratin', nom: 'Baratin', texte: 'Peut apprendre la compétence Baratin.', valeurPuissance: 0, },
      {
        id: 'muletier_connaissance_rue',
        nom: 'Connaissance de la rue',
        texte: 'Peut apprendre la compétence Connaissance de la rue.',
        valeurPuissance: 0,
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'geolier',
    nom: 'Geôlier',
    nom_original: 'Gaoler',
    page_source: 15,
    recrutement: { cout: 30 },
    entretien: {
      type: 'or',
      cout: 15,
      texte: '15 CO après chaque bataille à laquelle il participe.',
      maintien_sans_paiement:
        'Si un prêtre de Sigmar est présent, il peut rester sans être payé mais doit manquer la prochaine bataille.',
    },
    valeur: 22,
    employeurs: { bande_ids: ['witch_hunters'], texte: 'Seuls les Répurgateurs.' },
    stats: { M: 4, CC: 3, CT: 2, F: 4, E: 4, PV: 2, I: 3, A: 1, Cd: 7 },
    equipement: ['Lourde chaîne (compte comme un fléau) ou deux marteaux/masses', 'Aucune armure'],
    equipement_choix: [
      {
        ligneIndex: 0,
        options: [
          { id: 'fleau', itemIds: ['fleau'] },
          { id: 'deux_marteaux', itemIds: ['arme_contondante_une_main', 'arme_contondante_une_main'] },
        ],
      },
    ],
    acces_competences: ['combat', 'force'],
    regles_speciales: [
      {
        nom: 'Torture',
        texte:
          'Peut remplacer ses attaques par une attaque sans dégâts. Si elle touche, la cible rate un test de F à -1 : elle est immobilisée jusqu’à réussir ce test au début d’une phase de corps à corps. Sans effet sur morts-vivants, démons, créatures insensibles à la douleur et grandes cibles.',
      },
      {
        nom: 'Dévot',
        texte:
          'Avec un prêtre de Sigmar dans la bande, il ne part pas si sa solde est impayée, mais refuse la bataille suivante jusqu’au paiement.',
      },
      {
        nom: 'Insensible à la douleur',
        texte: 'Tous les jets pour le blesser subissent -1 ; un résultat final de 0 est ignoré.',
      },
      {
        nom: 'Haine',
        texte:
          'Hait les Skavens, Morts-Vivants, Hommes-Bêtes, Possédés, Kermesses du Chaos et autres Adeptes du Chaos.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'ranger_kislevite',
    nom: 'Ranger Kislévite',
    nom_original: 'Kislev Ranger',
    page_source: 29,
    recrutement: { cout: 30 },
    entretien: { type: 'or', cout: 15, texte: '15 CO après chaque bataille à laquelle il participe.' },
    valeur: 15,
    employeurs: {
      // "May be Hired: Mercenaries, Witch Hunters and Dwarfs may hire
      // Kislev Rangers." (Hired Sword Compendium part1.pdf p.29) ne nomme
      // pas les Kislévites — mais ceux-ci y ont accès quand même via leur
      // propre règle générale ("Une bande kislévite peut engager les
      // mêmes Francs-tireurs que les bandes de mercenaires humains",
      // Kislévites [GW].pdf), qui s'applique dès lors que ce franc-tireur
      // est accessible aux Mercenaires (c'est le cas : MERCENAIRES ci-
      // dessous). Confirmé explicitement par l'utilisateur (pas une
      // erreur, malgré la fiche propre du Ranger qui ne le nomme pas) —
      // ne pas retirer 'kislevites' d'ici sans revalider ce point.
      bande_ids: uniques([...MERCENAIRES, 'kislevites', 'witch_hunters', 'dwarf_treasure_hunters']),
      texte: 'Les Mercenaires, les Kislévites, les Répurgateurs et les Nains.',
    },
    stats: { M: 4, CC: 3, CT: 4, F: 3, E: 3, PV: 1, I: 4, A: 1, Cd: 7 },
    equipement: ['Arc', 'Épée', 'Manteau de chasseur'],
    acces_competences: ['tir', 'vitesse', 'special'],
    regles_speciales: [
      {
        nom: 'Frappe au cœur',
        texte:
          'Contre une grande cible, un 6 pour toucher suivi d’un 5+ pour blesser la tue sur le coup, sans sauvegarde.',
      },
      {
        nom: 'Manteau de chasseur',
        texte:
          'Un tir depuis une position cachée ne le révèle que si la cible réussit un test d’Initiative.',
      },
      {
        nom: 'Chercheur',
        texte: 'Permet de modifier un dé du jet d’exploration de +1 ou -1.',
      },
      { nom: 'Solitaire', texte: 'Ne fait jamais de test Seul contre tous.' },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'ranger_cri_animal',
        nom: 'Cri d’animal',
        texte:
          'Caché, peut viser à 18ps une figurine ne pouvant pas charger : elle teste le Cd avant de bouger ; en cas d’échec, le Ranger choisit son déplacement.',
        valeurPuissance: 20,
      },
      {
        id: 'ranger_herboristerie',
        nom: 'Herboristerie',
        texte:
          'Au début de la Récupération, lui-même ou une figurine au contact récupère 1 PV sur 4+. Le Ranger ne bouge pas ce tour.',
        valeurPuissance: 20,
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'chasseur_tresor_nain',
    nom: 'Chasseur de Trésor Nain',
    nom_original: 'Dwarf Treasure Hunter',
    page_source: 17,
    recrutement: { cout: 55 },
    entretien: {
      type: 'or',
      cout: 30,
      cout_si_elfe: 60,
      texte: '30 CO, ou 60 CO si la bande comprend un ou plusieurs elfes.',
    },
    valeur: 24,
    employeurs: {
      bande_ids: uniques([...MERCENAIRES, 'witch_hunters']),
      texte:
        'Les Mercenaires et les Répurgateurs. Les bandes naines ne peuvent pas l’employer.',
    },
    stats: { M: 3, CC: 5, CT: 4, F: 3, E: 4, PV: 1, I: 2, A: 1, Cd: 9 },
    equipement: [
      'Armure en gromril',
      'Casque',
      'Pioche de mineur',
      'Dague',
      'Marteau',
      'Carte au trésor',
      'Lanterne sur perche',
    ],
    acces_competences: ['combat', 'force'],
    regles_speciales: [
      {
        nom: 'Difficile à tuer',
        texte: '1-2 À terre, 3-5 Sonné et 6 Hors de combat sur le tableau des dégâts.',
      },
      { nom: 'Tête dure', texte: 'Ignore les règles spéciales des masses et marteaux.' },
      { nom: 'Armure', texte: 'Ne subit aucune pénalité de Mouvement due à l’armure.' },
      { nom: 'Haine des Orques & Gobelins', texte: 'Hait les Orques et les Gobelins.' },
      {
        nom: 'Cartes au trésor',
        texte:
          'Après une bataille survécue sans mise hors de combat, lance 1D6 sur la table de cartes : 1 Embuscade ; 2 Faux ; 3 +1 fragment ; 4 bière de Bugman pour 1D6 membres ; 5 un dé d’exploration supplémentaire ; 6 un dé d’exploration au résultat choisi.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'nain',
    tags: ['nain'],
  },
  {
    id: 'supervizork',
    nom: 'Supervizork',
    page_source: 18,
    recrutement: { cout: 60 },
    entretien: { type: 'or', cout: 40, texte: '40 CO après chaque bataille à laquelle il participe.' },
    valeur: 15,
    employeurs: { bande_ids: PEAUX_VERTES, texte: 'Toute bande de Peaux-Vertes.' },
    stats: { M: 4, CC: 4, CT: 3, F: 4, E: 4, PV: 1, I: 2, A: 1, Cd: 7 },
    equipement: ['Armure lourde', 'Casque', 'Deux haches ou une arme à deux mains'],
    equipement_choix: [
      {
        ligneIndex: 2,
        options: [
          { id: 'deux_haches', itemIds: ['hache', 'hache'] },
          { id: 'arme_deux_mains', itemIds: ['arme_a_deux_mains'] },
        ],
      },
    ],
    acces_competences: ['combat', 'force', 'special'],
    regles_speciales: [
      {
        nom: 'J’ai dit « fermez-la »',
        texte: 'Les Orques et Gobelins à 6ps ignorent les effets de l’animosité.',
      },
      {
        nom: 'C’est qui ce gars !',
        texte:
          'Si le Chef Gobelin est mis hors de combat, le Supervizork gagne Chef pour la bataille. Si ce chef meurt, il devient définitivement chef et continue de réclamer sa solde.',
      },
      {
        nom: 'Orque Noir',
        texte: 'Possède une sauvegarde naturelle de 6+ cumulable avec une armure.',
      },
      {
        nom: 'Vente de pierre magique',
        texte: 'Ne compte pas dans le nombre de guerriers lors de la vente de pierre magique.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'supervizork_competences_orques',
        nom: 'Compétences spéciales des Orques',
        texte: 'Peut choisir dans les compétences spéciales de la Horde Orque.',
        valeurPuissance: 0,
      },
    ],
    groupe_caracteristiques: 'peaux_vertes_orque_noir',
    tags: ['peau_verte'],
  },
  {
    id: 'rat_ogre_skryre',
    nom: 'Rat-Ogre du Clan Skryre',
    nom_original: 'Clan Skryre Rat Ogre',
    page_source: 19,
    recrutement: { cout: 100 },
    entretien: {
      type: 'malepierre',
      cout: 1,
      texte: 'Un fragment de pierre magique pour l’activer avant chaque partie.',
    },
    valeur: 25,
    employeurs: { bande_ids: SKAVENS, texte: 'Seules les bandes de Skavens.' },
    stats: { M: 4, CC: 3, CT: 3, F: 5, E: 5, PV: 3, I: 1, A: 3, Cd: 10 },
    equipement: ['Crocs et griffes', 'Lance-flammes à malepierre', 'Corps mécanique (sauvegarde 4+)'],
    acces_competences: [],
    regles_speciales: [
      { nom: 'Grande cible', texte: 'Le Rat-Ogre est une grande cible.' },
      { nom: 'Peur', texte: 'Le Rat-Ogre provoque la peur.' },
      {
        nom: 'Biomécanique',
        texte: 'Immunisé à la psychologie et ne quitte jamais le combat.',
      },
      {
        nom: 'Alimenté en pierre magique',
        texte: 'N’exige pas d’or, mais consomme un fragment de pierre magique pour être activé.',
      },
      { nom: 'Ne peut pas courir', texte: 'Ne peut pas courir, mais peut charger normalement.' },
      { nom: 'Immunisé aux poisons', texte: 'Aucun poison ne l’affecte.' },
      {
        nom: 'Peu fiable',
        texte:
          'Au début de chaque tour, sur 1 sur 1D6, lancez sur la table de défaillance : 1 explosion F5 à 6ps et destruction ; 2 berserk et mouvement aléatoire ; 3 hors tension ; 4 perte temporaire de contrôle ; 5-6 bloqué sur place.',
      },
      {
        nom: 'Lance-flammes à malepierre',
        texte:
          'Portée 6ps, F4, sauvegarde totale -2. Trace un couloir droit de 6ps × 2ps ; chaque figurine est touchée sur 4+. Une cible touchée prend feu sur 5+ et doit éteindre les flammes sur 4+ en Ralliement.',
      },
      { nom: 'Sans expérience', texte: 'Cette création biomécanique ne gagne jamais d’expérience.' },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'ogre_garde_mangeur',
    gagne_experience: false,
  },
  {
    id: 'cocher',
    nom: 'Cocher',
    nom_original: 'Coachman',
    page_source: 22,
    recrutement: { cout: 20 },
    entretien: { type: 'or', cout: 10, texte: '10 CO après chaque bataille à laquelle il participe.' },
    valeur: 8,
    employeurs: {
      bande_ids: toutesSauf(...SKAVENS, 'beastmen_raiders', ...PEAUX_VERTES),
      texte: 'Toute bande sauf les Skavens, Hommes-Bêtes, Orques et Gobelins.',
    },
    stats: { M: 4, CC: 3, CT: 3, F: 3, E: 3, PV: 1, I: 4, A: 1, Cd: 7 },
    equipement: ['Fouet', 'Épée', 'Armure légère'],
    acces_competences: ['vitesse'],
    regles_speciales: [
      {
        nom: 'Conducteur',
        texte:
          'Une diligence conduite par le Cocher peut relancer une fois un résultat de la table Perte de contrôle ; le second résultat est obligatoire.',
      },
      {
        nom: 'Bricoleur',
        texte:
          'Au contact d’un véhicule immobile qui n’a pas bougé au tour précédent, peut réparer une roue endommagée ou remettre une roue perdue. Il ne fait rien d’autre et le véhicule ne bouge pas ce tour.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'centaure_chaos',
    nom: 'Centaure du Chaos',
    nom_original: 'Chaos Centaur',
    page_source: 22,
    recrutement: { cout: 65 },
    entretien: { type: 'or', cout: 25, texte: '25 CO après chaque bataille à laquelle il participe.' },
    valeur: 20,
    employeurs: {
      bande_ids: ['beastmen_raiders', 'maraudeurs_du_chaos', 'maneaters', 'norses'],
      texte: 'Les Hommes-Bêtes, Maraudeurs du Chaos, Ogres et Norses.',
    },
    stats: { M: 8, CC: 4, CT: 3, F: 4, E: 3, PV: 1, I: 3, A: 1, Cd: 7 },
    equipement: ['Haches de jet', 'Bouclier', 'Épée ou lance'],
    equipement_choix: [
      {
        ligneIndex: 2,
        options: [
          { id: 'epee', itemIds: ['epee'] },
          { id: 'lance', itemIds: ['lance'] },
        ],
      },
    ],
    acces_competences: ['combat', 'force', 'special'],
    regles_speciales: [
      {
        nom: 'Ivrogne',
        texte:
          'Au début de chaque tour : sur 1, teste la stupidité ; sur 2-5 rien ; sur 6 devient frénétique pour ce tour. Sous stupidité ou frénésie, ignore les autres formes de psychologie.',
      },
      {
        nom: 'Habitant des bois',
        texte: 'Ignore les pénalités de mouvement dans les zones boisées.',
      },
      {
        nom: 'Piétinement',
        texte: 'Ses sabots lui donnent une attaque additionnelle sans bonus ni malus d’arme.',
      },
      {
        nom: 'Lance en charge',
        texte: 'Une lance lui donne +1 F lorsqu’il charge, comme une lance de cavalerie.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'centaure_mutation',
        nom: 'Nouvelle mutation',
        texte: 'Peut acheter une nouvelle mutation au lieu d’une compétence.',
        valeurPuissance: 0,
      },
    ],
    groupe_caracteristiques: 'hommes_betes_centigor',
    tags: ['malefique'],
  },
  {
    id: 'pyromane',
    nom: 'Pyromane',
    nom_original: 'Pyromaniac',
    page_source: 23,
    recrutement: { cout: 25 },
    entretien: { type: 'or', cout: 10, texte: '10 CO après chaque bataille à laquelle il participe.' },
    valeur: 9,
    employeurs: {
      bande_ids: uniques([...MERCENAIRES, 'moines_guerriers_de_cathay']),
      texte: 'Les Caravanes marchandes, Moines de Cathay et Mercenaires.',
    },
    stats: { M: 4, CC: 3, CT: 3, F: 3, E: 3, PV: 1, I: 3, A: 1, Cd: 7 },
    equipement: ['Fusées', 'Pétards (illimités)'],
    acces_competences: ['special'],
    regles_speciales: [
      {
        nom: 'Artificier dément',
        texte:
          'À chaque tour, doit soit allumer une fusée, soit lancer un pétard sur un animal hostile. Il peut marcher mais pas courir ni charger ; s’il est attaqué, il combat normalement.',
      },
      {
        nom: 'Fusées',
        texte:
          'À chaque phase de Tir, une fusée parcourt la distance du dé d’artillerie dans une direction contrôlée, puis continue aléatoirement jusqu’à toucher. Une touche inflige F4 et enflamme sur 4+. Un incident déclenche : 1 rien ; 2-3 relance et double distance ; 4-5 spectacle, test de Cd à 2D6ps ou distraction ; 6 explosion F4 à 1D6ps.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'pyromane_science_fusees',
        nom: 'Science des fusées',
        texte: 'Peut modifier le résultat du dé d’artillerie de +1 ou -1.',
        valeurPuissance: 20,
      },
      {
        id: 'pyromane_artiste',
        nom: 'Artiste du spectacle',
        texte:
          'Peut tester l’Initiative au lieu de lancer le dé d’artillerie ; en cas de réussite, la fusée explose immédiatement.',
        valeurPuissance: 20,
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'ninja',
    nom: 'Ninja',
    page_source: 23,
    recrutement: { cout: null, notation: '70+3D6' },
    entretien: {
      type: 'aucun',
      cout: 0,
      texte: 'Engagé pour une seule mission : aucun entretien, il quitte automatiquement la bande après la bataille.',
    },
    valeur: 45,
    employeurs: {
      bande_ids: toutesSauf(...SKAVENS, ...PEAUX_VERTES, 'beastmen_raiders', 'maraudeurs_du_chaos', 'norses', 'nains_du_chaos'),
      texte:
        'Les Moines de Cathay et toute bande sauf les Skavens, Orques & Gobelins, Hommes-Bêtes, Maraudeurs du Chaos, Norses et Nains du Chaos.',
    },
    stats: { M: 4, CC: 4, CT: 4, F: 3, E: 3, PV: 1, I: 5, A: 2, Cd: 8 },
    equipement: ['Paire d’épées', 'Étoiles de jet', 'Corde et grappin', 'Une bombe fumigène'],
    acces_competences: [],
    regles_speciales: [
      {
        nom: 'Maîtrise',
        texte:
          'Possède Expert bretteur, Combattant au couteau, Escalade des surfaces abruptes, Art de la mort silencieuse, Vitesse de l’éclair et Saut de la foi.',
      },
      {
        nom: 'Strictement professionnel',
        texte:
          'Engagé pour une mission précise, ne réclame aucun entretien, quitte automatiquement la bande après la bataille et ne gagne pas d’expérience.',
      },
      {
        nom: 'Secret',
        texte:
          'Ne se tient pas aux côtés de la bande et ne compte pas comme membre de la bande pour les tests de déroute.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'humain',
    gagne_experience: false,
    depart_apres_bataille: true,
  },
  {
    id: 'forgeron',
    nom: 'Maître-forgeron',
    nom_original: 'Swordsmith',
    page_source: 24,
    recrutement: { cout: 60 },
    entretien: { type: 'or', cout: 15, texte: '15 CO après chaque bataille à laquelle il participe.' },
    valeur: 10,
    employeurs: {
      bande_ids: uniques([...HUMAINS, 'dwarf_treasure_hunters', 'moines_guerriers_de_cathay']),
      texte: 'Toute bande comprenant des Humains ou des Elfes, y compris les Moines de Cathay.',
    },
    stats: { M: 4, CC: 3, CT: 3, F: 4, E: 3, PV: 1, I: 4, A: 1, Cd: 7 },
    equipement: ['Marteau', 'Cuirs renforcés'],
    acces_competences: ['academique', 'force', 'special'],
    regles_speciales: [
      {
        nom: 'Maître artisan',
        texte:
          'Pour les héros cherchant des épées longues de Cathay ou des épées dragon, la rareté diminue de 1 par tranche de 2 XP du Forgeron.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'forgeron_affutage',
        nom: 'Affûtage',
        texte:
          'S’il n’a pas été mis hors de combat, peut donner Coupe tranchante à jusqu’à trois épées ou armes semblables pour la prochaine bataille.',
        valeurPuissance: 20,
      },
      {
        id: 'forgeron_marechal_ferrant',
        nom: 'Maréchal-ferrant',
        texte:
          'Entre les batailles, rechausse les montures. Si un cheval de guerre, destrier elfique ou centaure du Chaos est mis hors de combat, il n’est retiré du roster que sur 1-2 au lieu du résultat normal.',
        valeurPuissance: 0,
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'pilleur_tombes',
    nom: 'Pilleur de tombes',
    nom_original: 'Grave Robber',
    page_source: 24,
    recrutement: { cout: 45 },
    entretien: { type: 'or', cout: 18, texte: '18 CO après chaque bataille à laquelle il participe.' },
    valeur: 15,
    employeurs: {
      bande_ids: ['undead', 'morts_sans_repos'],
      texte: 'Toute bande comprenant un Vampire, un Nécromancien ou une Liche.',
    },
    stats: { M: 4, CC: 3, CT: 3, F: 3, E: 3, PV: 1, I: 4, A: 1, Cd: 6 },
    equipement: ['Pioche (compte comme une hache)', 'Dague', 'Lanterne', 'Cuirs renforcés'],
    acces_competences: ['combat', 'vitesse'],
    regles_speciales: [
      {
        nom: 'Détesté',
        texte: 'Toutes les figurines pouvant utiliser des prières le haïssent.',
      },
      {
        nom: 'Pillage de tombes',
        texte:
          'S’il n’a pas été mis hors de combat, lance 2D6 en exploration : 2 découvert et renvoyé ; 3-4 rien ; 5-7 1D6+3 CO ; 8-9 1D6+8 CO ; 10-11 Zombie gratuit ou cadavre vendu 1D6+2 CO ; 12 artefact mineur.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'humain',
    tags: ['malefique'],
  },
  {
    id: 'marchand_cathayen',
    nom: 'Marchand cathayen',
    nom_original: 'Cathayan Merchant',
    page_source: 25,
    recrutement: { cout: 20 },
    entretien: { type: 'or', cout: 10, texte: '10 CO après chaque bataille à laquelle il participe.' },
    valeur: 10,
    employeurs: {
      bande_ids: uniques([...HUMAINS, 'dwarf_treasure_hunters', 'moines_guerriers_de_cathay']),
      texte: 'Toute bande comprenant des Humains ou des Nains, y compris les Moines de Cathay.',
    },
    stats: { M: 4, CC: 2, CT: 2, F: 3, E: 3, PV: 1, I: 4, A: 1, Cd: 7 },
    equipement: ['Épée'],
    acces_competences: ['academique', 'special'],
    regles_speciales: [
      {
        nom: 'Marchandage',
        texte: 'Peut marchander 2D6 CO sur un objet, jusqu’à un minimum de 1 CO.',
      },
      {
        nom: 'Prêteur sur gages',
        texte:
          'S’il n’a pas été mis hors de combat, ajoute 2D6 CO au prix total de vente des objets de la bande.',
      },
      {
        nom: 'Mercatique',
        texte:
          'S’il n’a pas été mis hors de combat, peut visiter après la bataille le Marché noir et les Marchandises exotiques ; lance 1D6 sur chaque table. Les objets sont proposés à leur prix de base.',
      },
      {
        nom: 'Garde du corps',
        texte:
          'Le garde protège seulement le Marchand, reste à 1ps et ne gagne ni XP ni solde. Il peut intercepter un tir ou une charge visant le Marchand s’il n’est pas déjà engagé.',
      },
      {
        nom: 'Marché noir',
        texte:
          '1 rien ; 2 bave d’araignée (1D3 doses) ; 3 bombe incendiaire ; 4 griffes de combat ; 5 épée longue de Cathay ; 6 artefact mineur pour 75 + 1D6×10 CO.',
      },
      {
        nom: 'Marchandises exotiques',
        texte:
          '1 rien ; 2 armure en gromril ; 3 arc elfique ; 4 armure en ithilmar ; 5 tome de magie ; 6 cape elfique.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'marchand_tailleur_pierre',
        nom: 'Tailleur de pierre',
        texte:
          'Lors d’une vente de malepierre, lance 1D6 : 1-2 perd 2D6 CO, 3-5 gagne 2D6 CO, 6 gagne 3D6 CO.',
        valeurPuissance: 0,
      },
    ],
    profils_secondaires: [
      {
        nom: 'Garde du corps',
        stats: { M: 4, CC: 4, CT: 2, F: 4, E: 3, PV: 1, I: 3, A: 1, Cd: 8 },
        equipement: ['Épée', 'Armure légère', 'Bouclier', 'Casque'],
        regles_speciales: [
          {
            nom: 'Interception',
            texte:
              'Intercepte les tirs et charges dirigés contre le Marchand s’il n’est pas déjà engagé ; il doit rester à 1ps.',
          },
        ],
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'eclaireur_hobgobelin',
    nom: 'Éclaireur Hobgobelin',
    nom_original: 'Hobgoblin Scout',
    page_source: 26,
    recrutement: { cout: 45 },
    entretien: { type: 'or', cout: 20, texte: '20 CO après chaque bataille à laquelle il participe.' },
    valeur: 19,
    employeurs: {
      // "Une bande de Fils d'Hashut peut recruter les Francs-Tireurs
      // suivants : [...] et Éclaireurs Hobgobelins." (fils_dhashut.json,
      // règle de bande "Francs-Tireurs") — ajouté explicitement ici, en
      // plus de nains_du_chaos/maneaters.
      bande_ids: ['nains_du_chaos', 'maneaters', 'fils_dhashut'],
      texte: 'Les bandes de Nains du Chaos et d’Ogres.',
    },
    stats: { M: 4, CC: 3, CT: 3, F: 3, E: 3, PV: 1, I: 2, A: 1, Cd: 6 },
    equipement: ['Dague', 'Arc court', 'Bouclier', 'Loup géant'],
    acces_competences: ['tir', 'equitation', 'special'],
    regles_speciales: [
      { nom: 'Monte', texte: 'Possède la compétence Monter un loup géant.' },
      {
        nom: 'Solitaire',
        texte:
          'Ne peut pas utiliser le Cd du chef, ne fait jamais Seul contre tous et peut agir indépendamment.',
      },
      {
        nom: 'Traître',
        texte:
          'Subit la haine de toutes les races Peaux-Vertes. La bande qui l’emploie ne peut engager aucun autre franc-tireur Peau-Verte.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'hobgobelin_espion',
        nom: 'Espion',
        texte:
          'Après le déploiement, peut redéployer 1D3 figurines autres que lui. Sinon, peut être placé hors du plateau à plus de 18ps de tout ennemi.',
        valeurPuissance: 40,
      },
      {
        id: 'hobgobelin_tir_potshot',
        nom: 'Tir au galop',
        texte: 'Peut tirer avec un arc en courant, avec -2 pour toucher.',
        valeurPuissance: 20,
      },
    ],
    profils_secondaires: [
      { nom: 'Loup géant', stats: { M: 9, CC: 3, CT: 0, F: 3, E: 3, PV: 1, I: 4, A: 1, Cd: 4 } },
    ],
    groupe_caracteristiques: 'peaux_vertes_gobelin',
    tags: ['peau_verte'],
  },
  {
    id: 'goliath_os',
    nom: 'Goliath d’Os',
    nom_original: 'Bone Goliath',
    page_source: 27,
    recrutement: { cout: 225 },
    entretien: { type: 'aucun', cout: 0, texte: 'Construction permanente : aucun entretien.' },
    valeur: 50,
    employeurs: { bande_ids: ['morts_sans_repos'], texte: 'Seuls les Morts Sans Repos.' },
    stats: { M: 5, CC: 3, CT: 0, F: 5, E: 5, PV: 3, I: 2, A: 3, Cd: 6 },
    equipement: ['Aucune arme ni armure'],
    acces_competences: [],
    regles_speciales: [
      { nom: 'Peur', texte: 'Provoque la peur.' },
      { nom: 'Ne peut pas courir', texte: 'Ne peut pas courir, mais peut charger normalement.' },
      { nom: 'Immunisé à la psychologie', texte: 'Immunisé à la psychologie et ne quitte jamais le combat.' },
      { nom: 'Immunisé au poison', texte: 'Aucun poison ne l’affecte.' },
      {
        nom: 'Construction mort-vivante',
        texte:
          'Sur 4+ sur le tableau des dégâts, ignore le résultat et continue à combattre. Ce jet n’est pas une sauvegarde et ne fonctionne pas contre les armes magiques.',
      },
      {
        nom: 'Assemblage',
        texte:
          'Sa construction retire 1D3 PV à la Liche de la bande, jusqu’à un minimum de 1. Aucun objet rare ne peut être cherché pendant cette phase. Une bande sans Liche ne peut pas le construire.',
      },
      { nom: 'Grande cible', texte: 'Le Goliath d’Os est une grande cible.' },
      {
        nom: 'Sans douleur',
        texte: 'Traite les résultats Sonné du tableau des dégâts comme À terre.',
      },
      { nom: 'Sans esprit', texte: 'Ne gagne jamais d’expérience.' },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'morts_vivants_liche',
    gagne_experience: false,
    sacrifice_liche: true,
    tags: ['malefique'],
  },
  {
    id: 'skink_cameleon',
    nom: 'Skink Caméléon',
    nom_original: 'Chameleon Skink',
    page_source: 28,
    recrutement: { cout: 70 },
    entretien: { type: 'or', cout: 12, texte: '12 CO après chaque bataille à laquelle il participe.' },
    valeur: 25,
    // Le commentaire d'origine ("aucune dans le catalogue actuel") date
    // d'avant l'implémentation de la bande hommes_lezards, désormais
    // jouable — bande_ids était resté vide, rendant ce franc-tireur
    // inaccessible à absolument tout le monde, y compris son seul
    // employeur prévu.
    employeurs: { bande_ids: ['hommes_lezards'], texte: 'Seules les bandes d’Hommes-Lézards.' },
    stats: { M: 6, CC: 4, CT: 4, F: 4, E: 2, PV: 1, I: 5, A: 1, Cd: 7 },
    equipement: ['Dague', 'Sarbacane avec dards empoisonnés', 'Rondache'],
    acces_competences: ['tir', 'vitesse', 'special'],
    regles_speciales: [
      {
        nom: 'Aquatique',
        texte: 'Se déplace dans les terrains aquatiques sans pénalité et y compte comme à couvert.',
      },
      { nom: 'Créature de la jungle', texte: 'Se déplace dans la jungle sans pénalité.' },
      {
        nom: 'Peau écailleuse',
        texte:
          'Sauvegarde de 6+ qui ne peut être réduite au-delà de 6+ sauf par un critique sans sauvegarde. Armure légère et bouclier ajoutent chacun +1.',
      },
      {
        nom: 'Sang-froid',
        texte: 'Pour les tests de psychologie, lance 3D6 et conserve les deux plus petits dés.',
      },
      {
        nom: 'Peau de caméléon',
        texte:
          'Quand il est caché, l’Initiative de l’ennemi est divisée par deux pour le détecter ; les tirs subissent -2 pour le toucher.',
      },
      {
        nom: 'Infiltration',
        texte: 'Peut être placé hors des lignes de vue et à plus de 12ps de tout ennemi.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'skink_grand_chasseur',
        nom: 'Grand chasseur',
        texte: 'S’il est à couvert, le malus pour le toucher au tir passe de -1 à -2.',
        valeurPuissance: 20,
      },
    ],
    groupe_caracteristiques: 'hommes_lezards_skinks',
  },
  {
    id: 'chasseur_gros_gibier',
    nom: 'Chasseur de Gros Gibier',
    nom_original: 'Big Game Hunter',
    page_source: 29,
    recrutement: { cout: 40 },
    entretien: { type: 'or', cout: 18, texte: '18 CO après chaque bataille à laquelle il participe.' },
    valeur: 16,
    employeurs: { bande_ids: HUMAINS, texte: 'Toute bande d’Humains.' },
    stats: { M: 4, CC: 3, CT: 4, F: 3, E: 3, PV: 1, I: 4, A: 1, Cd: 7 },
    equipement: ['Épée', 'Dague', 'Filet', 'Armure légère', 'Fusil de chasse (long fusil du Hochland)'],
    acces_competences: ['tir', 'academique'],
    regles_speciales: [
      {
        nom: 'Pose de pièges',
        texte:
          'Après son déploiement, place jusqu’à 6 pièges au sol, espacés d’au moins 6ps. Une figurine à 3ps déclenche sur 4-6 une touche de F1D6, puis le piège est retiré. Un animal mis hors de combat est capturé et retiré du roster.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'guide_lustrien',
    nom: 'Guide Lustrien',
    nom_original: 'Lustria Guide',
    page_source: 30,
    recrutement: { cout: 60 },
    entretien: { type: 'or', cout: 15, texte: '15 CO après chaque bataille à laquelle il participe.' },
    valeur: 25,
    employeurs: { bande_ids: [...TOUTES_LES_BANDES], texte: 'Toutes les bandes.' },
    stats: { M: 4, CC: 3, CT: 4, F: 3, E: 3, PV: 1, I: 4, A: 1, Cd: 8 },
    equipement: ['Épée', 'Dague', 'Arc long', 'Corde et grappin', 'Herbes de soin'],
    acces_competences: ['combat', 'tir', 'vitesse', 'special'],
    regles_speciales: [
      {
        nom: 'Connaissance des mythes et légendes',
        texte:
          'S’il n’a pas été mis hors de combat, peut relancer un dé d’exploration ; le second résultat est obligatoire.',
      },
      {
        nom: 'Maîtrise du terrain',
        texte: 'Ignore les modificateurs de terrain et peut franchir les terrains infranchissables.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'guide_attention',
        nom: 'Attention !',
        texte:
          'Une fois par bataille, sur 4+, annule l’effet d’un piège ou d’un danger aléatoire.',
        valeurPuissance: 20,
      },
      {
        id: 'guide_par_la',
        nom: 'Par-là !',
        texte:
          'Au contact d’une figurine au début du tour, peut lui faire traverser avec lui un terrain infranchissable ; si le contact est rompu avant la sortie, elle est mise hors de combat.',
        valeurPuissance: 20,
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'guerrier_fantome',
    nom: 'Guerrier Fantôme',
    nom_original: 'Shadow Warrior',
    page_source: 31,
    recrutement: { cout: 35 },
    entretien: {
      type: 'or',
      cout: 15,
      texte: '15 CO après chaque bataille à laquelle il participe.',
      exemption: {
        label: 'Dernière bataille contre des Elfes Noirs',
        texte:
          'Ne réclame aucune solde si la dernière bataille était contre des Elfes Noirs ou une bande comprenant un Assassin Elfe Noir.',
      },
    },
    valeur: 12,
    employeurs: {
      bande_ids: uniques([...BIEN, 'artilleurs_de_nuln', 'gladiateurs']),
      texte:
        'Les Hauts Elfes et les bandes humaines non maléfiques, sans personnage ou franc-tireur maléfique.',
    },
    stats: { M: 5, CC: 4, CT: 4, F: 3, E: 3, PV: 1, I: 6, A: 1, Cd: 8 },
    equipement: ['Épée', 'Arc long', 'Dague', 'Bouclier', 'Armure légère'],
    acces_competences: ['combat', 'tir', 'special'],
    regles_speciales: [
      { nom: 'Haine des Elfes Noirs', texte: 'Hait les Elfes Noirs.' },
      {
        nom: 'Vue excellente',
        texte: 'Détecte les ennemis cachés à une distance égale à deux fois son Initiative.',
      },
      {
        nom: 'Ennemis jurés',
        texte:
          'Ne réclame pas de solde après une bataille contre des Elfes Noirs ou une bande comprenant un Assassin Elfe Noir.',
      },
      {
        nom: 'Infiltration',
        texte: 'Se déploie après l’adversaire, hors de vue et à plus de 12ps de toute figurine ennemie.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'fantome_tenebres',
        nom: 'Voir dans les ténèbres',
        texte:
          'Pour charger un ennemi invisible, n’est pas limité à 4ps mais doit réussir un test d’Initiative.',
        valeurPuissance: 20,
      },
      {
        id: 'fantome_ombres',
        nom: 'Se cacher parmi les ombres',
        texte: 'L’Initiative d’un ennemi tentant de le détecter caché est divisée par deux.',
        valeurPuissance: 20,
      },
      {
        id: 'fantome_tir_silencieux',
        nom: 'Tir silencieux',
        texte:
          'Peut tirer en restant caché ; si la cible survit, elle le repère en réussissant un test d’Initiative.',
        valeurPuissance: 40,
      },
      {
        id: 'fantome_solide',
        nom: 'Solide carrure',
        texte: 'Donne accès aux compétences de Force.',
        valeurPuissance: 0,
      },
    ],
    groupe_caracteristiques: 'elfe',
    tags: ['elfe'],
    incompatibles: ['assassin_elfe_noir'],
  },
  {
    id: 'assassin_elfe_noir',
    nom: 'Assassin Elfe Noir',
    nom_original: 'Dark Elf Assassin',
    page_source: 32,
    recrutement: { cout: 70 },
    entretien: { type: 'or', cout: 25, texte: '25 CO après chaque bataille à laquelle il participe.' },
    valeur: 25,
    employeurs: { bande_ids: MALEFIQUES, texte: 'Toute bande maléfique.' },
    stats: { M: 5, CC: 5, CT: 5, F: 4, E: 4, PV: 1, I: 7, A: 1, Cd: 8 },
    equipement: [
      'Brise-lame',
      'Lame elfe noire',
      'Arbalète à répétition',
      'Venin fuligineux',
      'Armure légère',
      'Cape sombre (cape elfique)',
    ],
    acces_competences: ['combat', 'tir', 'vitesse', 'special'],
    regles_speciales: [
      {
        nom: 'Tueur parfait',
        texte: 'Toutes ses attaques de tir et de corps à corps imposent -1 supplémentaire à la sauvegarde.',
      },
      { nom: 'Haine', texte: 'Hait les Hauts Elfes, y compris leurs francs-tireurs.' },
      {
        nom: 'Vue surhumaine',
        texte: 'Détecte les ennemis cachés à une distance égale à deux fois son Initiative.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'assassin_elfe_fureur',
        nom: 'Fureur de Khaine',
        texte:
          'Après avoir mis tous ses adversaires hors de combat, peut poursuivre de 4ps et engager un nouveau combat au tour suivant en comptant comme ayant chargé.',
        valeurPuissance: 20,
      },
      {
        id: 'assassin_elfe_infiltration',
        nom: 'Infiltration',
        texte: 'Se déploie après l’adversaire, hors de vue et à plus de 12ps de toute figurine ennemie.',
        valeurPuissance: 40,
      },
      {
        id: 'assassin_elfe_massif',
        nom: 'Massif',
        texte: 'Donne accès aux compétences de Force.',
        valeurPuissance: 0,
      },
      {
        id: 'assassin_elfe_rapidite',
        nom: 'Rapidité surnaturelle',
        texte:
          'Évite une attaque de tir ou de corps à corps sur 6+. Avec Esquive ou Saut de côté, cette sauvegarde passe à 4+ dans le domaine concerné.',
        valeurPuissance: 20,
      },
    ],
    groupe_caracteristiques: 'elfe',
    tags: ['elfe', 'malefique'],
    incompatibles: ['guerrier_fantome'],
  },
  {
    id: 'chasseur_primes',
    nom: 'Chasseur de primes',
    nom_original: 'Bounty Hunter',
    page_source: 8,
    recrutement: { cout: 40 },
    entretien: { type: 'or', cout: 15, texte: '15 CO après chaque bataille à laquelle il participe.' },
    valeur: 20,
    employeurs: {
      bande_ids: toutesSauf('cult_of_the_possessed', 'hors_la_loi_de_stirwood', ...MORTS_VIVANTS, ...SKAVENS, ...PEAUX_VERTES),
      texte: 'Toute bande sauf les Possédés, les Morts-Vivants, les Skavens et les Orques & Gobelins.',
    },
    stats: { M: 4, CC: 4, CT: 3, F: 4, E: 3, PV: 1, I: 4, A: 1, Cd: 8 },
    equipement: ['Épée', 'Dague', 'Pistolet', 'Arbalète', 'Armure lourde', 'Casque', 'Corde à grappin', 'Lanterne'],
    acces_competences: ['combat', 'tir', 'force', 'vitesse'],
    regles_speciales: [
      {
        nom: 'Capture',
        texte:
          'Au début de chaque bataille, désigne un héros de la bande adverse comme cible de sa traque : il obtient +1 pour le toucher contre lui et doit toujours se déplacer vers lui s’il le voit, sauf s’il peut le prendre pour cible au tir (auquel cas il choisit librement sa cible). S’il met sa cible hors de combat, il touche sa valeur en or en prime (dont il reverse la moitié à la bande) plus 1D3 points d’expérience s’il survit à la partie et que son camp l’emporte. Le héros capturé ne fait pas de jet sur la table des blessures graves : il est simplement considéré comme capturé.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'halfling_voleur',
    nom: 'Halfling voleur',
    nom_original: 'Halfling Thief',
    page_source: 22,
    recrutement: { cout: 25 },
    entretien: {
      type: 'or',
      cout: 15,
      texte: '15 CO après chaque bataille, sauf modification par la règle spéciale Allié précaire ci-dessous.',
    },
    valeur: 14,
    employeurs: {
      bande_ids: uniques([...MERCENAIRES, 'kislevites', 'guerriers_fantomes', ...NAINS, 'maneaters']),
      texte: 'Les Mercenaires humains, les Kislévites, ainsi que toute bande d’Elfes Sylvains, de Nains ou de Mangeurs d’Hommes.',
    },
    stats: { M: 4, CC: 2, CT: 4, F: 2, E: 2, PV: 1, I: 4, A: 1, Cd: 7 },
    equipement: ['Épée', 'Dague', 'Couteaux de jet', 'Corde et grappin'],
    acces_competences: ['vitesse', 'tir'],
    regles_speciales: [
      {
        nom: 'Infiltrateur',
        texte:
          'Peut toujours être placé sur le champ de bataille après la ou les bandes adverses, hors de vue et à plus de 12ps de toute figurine ennemie.',
      },
      {
        nom: 'Crochetage',
        texte: 'Pour ouvrir une porte verrouillée, un simple test d’Initiative suffit, là où d’autres échoueraient.',
      },
      {
        nom: 'Chapardeur',
        texte:
          'S’il a participé à la bataille et n’a pas été mis hors de combat, la bande reçoit un Trésor supplémentaire lors du jet d’exploration, en plus de ceux normalement obtenus.',
      },
      {
        nom: 'Allié précaire',
        texte:
          'À la fin de chaque bataille (qu’il y ait participé ou non), lancez 1D6 : sur 1, il s’enfuit avec tous les Trésors et fragments de malepierre de la bande, qui sont perdus (il quitte alors la bande) ; sur 2-5, il réclame son entretien normal de 15 CO ; sur 6, satisfait de ce qu’il a déjà « emprunté », il ne réclame aucun entretien cette fois-ci.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'halfling',
    tags: ['halfling'],
  },
  {
    id: 'ninja_gnoblar',
    nom: 'Ninja Gnoblar',
    page_source: 24,
    recrutement: { cout: 35 },
    entretien: { type: 'or', cout: 10, texte: '10 CO après chaque bataille à laquelle il participe.' },
    valeur: 8,
    employeurs: {
      bande_ids: toutesSauf('maneaters'),
      texte:
        'Toute bande qui ne compte, au moment de l’engager, aucune figurine provoquant la peur (les Ogres ne peuvent de toute façon jamais l’engager). Si la bande acquiert ensuite une figurine provoquant la peur, le Ninja Gnoblar la quitte aussitôt : bien qu’il soit doué au combat, il reste un froussard (à vérifier manuellement).',
    },
    stats: { M: 4, CC: 3, CT: 3, F: 3, E: 3, PV: 1, I: 4, A: 1, Cd: 6 },
    equipement: [
      'Robe de ninja (compte comme des cuirs renforcés)',
      'Shurikens (étoiles de jet bénéficiant de la règle spéciale Furtif)',
      'Bo (arme à deux mains donnant une attaque supplémentaire et permettant de parer)',
    ],
    acces_competences: ['tir', 'vitesse'],
    regles_speciales: [
      {
        nom: 'Furtif',
        texte:
          'Peut lancer ses shurikens en restant caché, sans révéler sa position. La cible touchée peut réussir un test d’Initiative pour repérer le Ninja Gnoblar ; en cas d’échec, il reste caché.',
      },
      {
        nom: 'Toit en toit',
        texte:
          'Ne déduit pas de sa distance de mouvement les sauts par-dessus rues et brèches : il peut ainsi courir 8ps et sauter 3ps supplémentaires le même tour.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      {
        id: 'ninja_gnoblar_sauteur_expert',
        nom: 'Sauteur de toits expert',
        texte:
          'Peut sauter jusqu’à 4ps au lieu de 3ps, et relancer un test d’Initiative raté lors d’un saut ou d’une charge en plongée.',
        valeurPuissance: 20,
      },
    ],
    groupe_caracteristiques: 'peaux_vertes_gobelin',
    tags: ['peau_verte'],
  },
  {
    id: 'pretre_guerrier_sigmar',
    nom: 'Prêtre-guerrier de Sigmar',
    nom_original: 'Warrior Priest of Sigmar',
    page_source: 30,
    recrutement: { cout: 40 },
    entretien: { type: 'or', cout: 20, texte: '20 CO après chaque bataille à laquelle il participe.' },
    valeur: 16,
    employeurs: {
      bande_ids: toutesSauf(
        'witch_hunters',
        'middenheimers',
        'cult_of_the_possessed',
        ...PEAUX_VERTES,
        ...SKAVENS,
        ...MORTS_VIVANTS,
        ...CHAOS,
        'elfes_noirs'
      ),
      texte:
        'Toute bande sauf les Répurgateurs (qui ont déjà leur propre prêtrise), les Middenheimers (dévots d’Ulric), les Possédés, les Orques & Gobelins, les Skavens, les Morts-Vivants, les Adeptes du Chaos et les Elfes Noirs.',
    },
    stats: { M: 4, CC: 3, CT: 3, F: 3, E: 3, PV: 1, I: 4, A: 1, Cd: 8 },
    equipement: ['Marteau de Sigmar (compte comme un marteau)', 'Armure légère', 'Bouclier'],
    acces_competences: ['academique'],
    regles_speciales: [
      {
        nom: 'Prières de Sigmar',
        texte:
          'Serviteur de Sigmar, il peut utiliser les Prières de Sigmar (les mêmes que celles des Sœurs de Sigmar, voir la section Magie du livre de règles). Il n’en connaît aucune au recrutement, mais peut, à chaque fois qu’il gagnerait normalement une nouvelle compétence, tirer une nouvelle Prière aléatoirement à la place.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'pretre_de_morr',
    nom: 'Prêtre de Morr',
    nom_original: 'Priest of Morr',
    page_source: 34,
    recrutement: { cout: 35 },
    entretien: { type: 'aucun', cout: 0, texte: 'Aucune solde : les Prêtres de Morr n’ont que faire de l’or.' },
    valeur: 8,
    employeurs: {
      bande_ids: MERCENAIRES_ET_KISLEVITES,
      texte: 'Les bandes de Mercenaires humains (Reikland, Marienburg, Middenheim, Averland, Ostland, Artilleurs de Nuln), ainsi que les Kislévites.',
    },
    stats: { M: 4, CC: 2, CT: 2, F: 3, E: 3, PV: 1, I: 4, A: 1, Cd: 9 },
    equipement: ['Dague', 'Faux (arme à deux mains, Force de l’utilisateur +1, difficile à manier)'],
    acces_competences: ['academique', 'vitesse'],
    regles_speciales: [
      {
        nom: 'Solitaire',
        texte: 'Habitué à sa propre compagnie, le Prêtre de Morr ne teste jamais Seul contre tous.',
      },
      {
        nom: 'Rites Funéraires',
        texte:
          'Le Prêtre de Morr connaît les six Rites Funéraires suivants et en accomplit un tiré aléatoirement (1D6) lorsque l’occasion se présente, selon les règles de Magie du livre de règles.',
      },
      {
        nom: '1 — La Protection de Morr (Difficulté 6)',
        texte:
          'Toute attaque magique d’un Nécromancien, d’un Magister ou d’un Démon visant directement le prêtre est annulée si le rite réussit.',
      },
      {
        nom: '2 — La Mort Sans Peur (Difficulté automatique)',
        texte: 'Le Prêtre de Morr devient Intrépide pour le reste de la partie.',
      },
      {
        nom: '3 — Sainteté des Défunts (Difficulté 7)',
        texte:
          'Utilisable sur un modèle (ami ou ennemi) mis hors de combat à moins de 6ps du prêtre : en cas de réussite, ce modèle ne pourra pas être relevé par un Nécromancien.',
      },
      {
        nom: '4 — La Main de Morr (Difficulté 9)',
        texte:
          'Au contact socle à socle d’un Mort-Vivant, avant le combat : en cas de réussite, l’ennemi est immédiatement hors de combat (Zombies, Loups Décharnés, Vampires) ; les Goules et Possédés affectés fuient plutôt de leur mouvement complet.',
      },
      {
        nom: '5 — Me connais-tu ? (Difficulté 7)',
        texte:
          'Portée 6ps, cible le Mort-Vivant le plus proche en priorité, sinon le plus proche serviteur humain des Morts-Vivants, sinon n’importe quel modèle. En cas de réussite, la cible est Sonnée (ou Mise à terre si elle ne peut être Sonnée).',
      },
      {
        nom: '6 — Je suis la Mort ! (Difficulté 8)',
        texte:
          'Le Prêtre de Morr obtient une sauvegarde d’armure de 6+ et sa CC passe à 4 si elle est inférieure, pour le reste de la partie.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'pretre_loup_ulric',
    nom: 'Prêtre-loup d’Ulric',
    nom_original: 'Wolf Priest of Ulric',
    page_source: 36,
    recrutement: { cout: 60 },
    entretien: { type: 'aucun', cout: 0, texte: 'Aucune solde : le Prêtre-loup ne se bat que pour Ulric.' },
    valeur: 22,
    employeurs: {
      bande_ids: ['middenheimers'],
      texte:
        'Uniquement les Mercenaires de Middenheim, où il remplace l’un des Champions de la bande (0-1, à gérer manuellement lors du recrutement).',
    },
    stats: { M: 4, CC: 3, CT: 2, F: 3, E: 3, PV: 1, I: 3, A: 1, Cd: 8 },
    equipement: [
      'Cape en peau de loup blanc (sauvegarde de 6+, incluse dans le prix)',
      'Dague',
      'Une arme contondante (marteau, masse, gourdin, fléau ou morgenstern, à une ou deux mains)',
    ],
    equipement_choix: [
      {
        ligneIndex: 2,
        options: [
          { id: 'contondante', itemIds: ['arme_contondante_une_main'] },
          { id: 'fleau', itemIds: ['fleau'] },
          { id: 'morgenstern', itemIds: ['morgenstern'] },
        ],
      },
    ],
    acces_competences: ['combat', 'academique', 'force', 'vitesse'],
    regles_speciales: [
      {
        nom: 'Aucune armure',
        texte:
          'Le Prêtre-loup ne fait confiance qu’à la protection d’Ulric et ne peut porter aucune armure hormis sa cape en peau de loup blanc.',
      },
      {
        nom: 'Armes contondantes uniquement',
        texte:
          'Ne peut utiliser que des marteaux, masses, gourdins, fléaux, morgensterns (à une ou deux mains) et la dague, qu’il porte toujours.',
      },
      {
        nom: 'Haine',
        texte:
          'Considérant les Répurgateurs (Templiers de Sigmar), les Prêtres-guerriers, les Matriarches Sigmarites et les Sœurs Supérieures comme les agents d’un culte rival, le Prêtre-loup les hait. Cette haine ne s’étend pas aux autres membres de ces bandes, simples adeptes égarés à ses yeux.',
      },
      {
        nom: 'Compagnon Loup',
        texte:
          'Une bande qui compte un Prêtre-loup d’Ulric peut recruter un Compagnon Loup pour 25 CO (voir profil secondaire ci-dessous) ; ce loup gigantesque part en éclaireur pour prévenir le prêtre du danger.',
      },
      {
        nom: 'Prières d’Ulric',
        texte:
          'Comme les Sœurs de Sigmar et les Prêtres-guerriers avec leurs prières, le Prêtre-loup peut invoquer Ulric au combat. Il ne connaît aucune Prière au recrutement, mais peut en tirer une nouvelle aléatoirement (1D6 ci-dessous) à la place d’une compétence lorsqu’il en gagnerait une.',
      },
      {
        nom: '1 — Bourrasque de Neige (Difficulté 6)',
        texte:
          'Ulric enveloppe le prêtre d’une tempête de neige localisée : tout ennemi engagé avec lui au corps à corps subit -1 pour le toucher pendant la durée du combat.',
      },
      {
        nom: '2 — Coup de Marteau (Difficulté 10)',
        texte:
          'Un marteau éthéréal géant s’abat sur une cible à 6ps, lui infligeant une touche de Force 4 avec la règle Commotion.',
      },
      {
        nom: '3 — Soif de Sang (Difficulté 7)',
        texte:
          'Le Prêtre-loup, empli d’une soif de bataille, combat à Force +2 et obtient un coup critique sur 5-6. Chaque tour, un test à difficulté ou plus sur 2D6 est nécessaire pour maintenir l’effet.',
      },
      {
        nom: '4 — Faim du Loup (Difficulté 7)',
        texte: 'Un membre de la bande au choix du prêtre est plongé en Frénésie.',
      },
      {
        nom: '5 — Hurlement d’Ulric (Difficulté 10)',
        texte:
          'Pour le reste de la partie, tous les membres de la bande du prêtre sont immunisés à la Peur, à la Terreur et à Seul contre tous, et bénéficient de +1 à leurs tests de Déroute.',
      },
      {
        nom: '6 — Appel d’Ulric (Difficulté 10)',
        texte:
          'Le prêtre se change en un loup gigantesque (M6 CC4 CT0 F4 E4 PV1 I5 A2 Cd6) : il ne peut alors qu’attaquer comme un loup (ni sorts ni armes), mais peut tenter à chaque phase de Tir un test de Commandement (avec le Cd du loup) pour retrouver forme humaine. Toujours sous forme de loup à la fin de la partie, il obtient une dernière chance de revenir à la normale ; sinon il reste loup à jamais (il garde son statut de héros, gagne toujours de l’expérience mais ne choisit plus que dans la table Vitesse, hormis Escalade des surfaces abruptes ; caractéristiques maximales de loup : M7 CC6 CT0 F4 E4 PV3 I7 A3 Cd7).',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    profils_secondaires: [
      {
        nom: 'Compagnon Loup',
        stats: { M: 6, CC: 4, CT: 0, F: 4, E: 4, PV: 1, I: 4, A: 2, Cd: 5 },
        equipement: ['Crocs'],
        regles_speciales: [
          {
            nom: 'Animal',
            texte:
              'Le Compagnon Loup, recruté pour 25 CO et uniquement disponible avec un Prêtre-loup d’Ulric dans la bande, suit les règles des animaux et ne gagne jamais d’expérience. Sa fourrure épaisse compte comme une cape de loup (sauvegarde de 6+).',
          },
        ],
      },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'sorciere',
    nom: 'Sorcière',
    nom_original: 'Witch',
    page_source: 39,
    recrutement: { cout: 30 },
    entretien: { type: 'or', cout: 15, texte: '15 CO après chaque bataille à laquelle elle participe.' },
    valeur: 14,
    employeurs: {
      bande_ids: toutesSauf('witch_hunters', 'sisters_of_sigmar'),
      texte: 'Toute bande sauf les Répurgateurs et les Sœurs de Sigmar.',
    },
    stats: { M: 4, CC: 2, CT: 2, F: 2, E: 2, PV: 1, I: 4, A: 1, Cd: 7 },
    equipement: ['Bâton'],
    acces_competences: ['academique'],
    regles_speciales: [
      {
        nom: 'Jeteuse de sorts',
        texte:
          'Commence avec deux sorts tirés aléatoirement dans la liste Charmes & Malédictions ci-dessous. Lorsqu’elle gagne une nouvelle compétence, elle peut tirer un nouveau sort de cette liste à la place.',
      },
      {
        nom: 'Recluse',
        texte:
          'Individu farouchement solitaire, la Sorcière peut refuser de rejoindre la bande même une fois localisée : au moment de l’engager, lancez 1D6 — sur 4+ elle accepte, sinon il faudra retenter sa chance après la prochaine bataille.',
      },
      {
        nom: 'Potions',
        texte:
          'Un seul héros de la bande ayant engagé la Sorcière peut boire une de ses potions avant la bataille. Lancez 1D6 : 1 Débilitante (-1 Endurance pour toute la bataille, jusqu’à un jet de 6 sur 1D6 en phase de Récupération) ; 2-3 Force (+1 Force jusqu’à un jet de 1 sur 1D6 en phase de Récupération) ; 4-5 Résilience (+1 Endurance jusqu’à un jet de 1 sur 1D6 en phase de Récupération) ; 6 Vigueur (+1 Point de Vie pour la bataille, non restauré une fois perdu).',
      },
      {
        nom: 'Réticente',
        texte:
          'La Sorcière ne charge jamais (bien qu’elle se défende si elle est chargée) et doit toujours essayer de rester à au moins 8ps des figurines ennemies, s’éloignant si nécessaire.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, elle doit être payée son entretien après chaque bataille à laquelle elle participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      { id: 'sorciere_scry', nom: 'Divination', texte: 'Difficulté 6 — Pendant ce tour, un héros ou homme de main allié peut relancer 1D3 dés et modifier le résultat de +1 ou -1.', valeurPuissance: 40, },
      { id: 'sorciere_curse', nom: 'Malédiction', texte: 'Difficulté 6 — Une figurine ennemie à 12ps doit relancer tous ses jets réussis pour ce tour et le suivant.', valeurPuissance: 40, },
      { id: 'sorciere_dust_of_the_blind', nom: 'Poussière Aveuglante', texte: 'Difficulté 9 — Une figurine ennemie à 16ps est aveuglée : elle ne peut ni tirer, ni charger, ni courir, combat à CC divisée par deux et se déplace aléatoirement au début de son tour, jusqu’à ce que la Sorcière relance un sort ou bouge.', valeurPuissance: 40, },
      { id: 'sorciere_age_of_stone', nom: 'Âge de Pierre', texte: 'Difficulté 8 — Une figurine ennemie à 12ps voit toutes ses caractéristiques réduites de -1 pour ce tour et le suivant.', valeurPuissance: 40, },
      { id: 'sorciere_warriors_bane', nom: 'Fléau du Guerrier', texte: 'Difficulté 7 — Une figurine ennemie à 18ps ne peut plus utiliser ses armes (elle ne peut ni tirer, ni faire autre chose que se battre à mains nues) pour ce tour et le suivant.', valeurPuissance: 40, },
      { id: 'sorciere_cure', nom: 'Guérison', texte: 'Difficulté 6 — Toutes les figurines amies à 6ps récupèrent un Point de Vie perdu ; celles Sonnées ou À terre peuvent immédiatement se relever.', valeurPuissance: 40, },
    ],
    groupe_caracteristiques: 'humain',
  },
  {
    id: 'mage_elfe',
    nom: 'Mage elfe',
    nom_original: 'Elf Mage',
    page_source: 42,
    recrutement: { cout: 45 },
    entretien: { type: 'aucun', cout: 0, texte: 'Aucune solde : le Mage elfe ne reste jamais assez longtemps pour en réclamer une.' },
    valeur: 23,
    employeurs: {
      bande_ids: MERCENAIRES_ET_KISLEVITES,
      texte: 'Les bandes de Mercenaires humains, ainsi que les Kislévites.',
    },
    stats: { M: 5, CC: 4, CT: 3, F: 3, E: 3, PV: 2, I: 6, A: 1, Cd: 8 },
    equipement: ['Bâton', 'Cape elfique'],
    acces_competences: [],
    regles_speciales: [
      {
        nom: 'Jeteur de sorts',
        texte: 'Commence avec trois sorts tirés aléatoirement dans la liste Sorts des Djed’hi ci-dessous.',
      },
      { nom: 'Sorcellerie', texte: 'Voir les règles de Sorcellerie du livre de règles.' },
      { nom: 'Fey', texte: 'Les sorts hostiles ne l’affectent pas sur un résultat de 4+ sur 1D6.' },
      {
        nom: 'Vagabond',
        texte:
          'Le Mage elfe ne reste jamais plus d’une bataille d’affilée avec la même bande : celle-ci doit livrer la suivante sans lui avant de pouvoir le rechercher de nouveau. Il n’apprend jamais de nouvelle compétence.',
      },
      {
        nom: 'Solde',
        texte:
          "Comme tout franc-tireur, il doit être payé son entretien après chaque bataille à laquelle il participe (voir Entretien des francs-tireurs) pour rester dans la bande.",
      },
    ],
    competences_speciales: [
      { id: 'mage_elfe_divination_de_shirath', nom: 'Divination de Shirath', texte: 'Difficulté 6 — Le Mage peut relancer tous ses jets ratés jusqu’au début de son prochain tour ; le second résultat est définitif.', valeurPuissance: 40, },
      { id: 'mage_elfe_bouclier_chatoyant', nom: 'Bouclier Chatoyant', texte: 'Difficulté 7 — Sauvegarde supplémentaire non modifiée de 5+ contre toute attaque, jusqu’au début du prochain tour du Mage.', valeurPuissance: 40, },
      { id: 'mage_elfe_statue_de_lumiere', nom: 'Statue de Lumière', texte: 'Difficulté 8 — Une figurine ennemie visible est figée sur place tant que le Mage reste immobile et vivant ; les deux peuvent lancer des sorts normalement, mais combattent à CC-1 (minimum 1) s’ils se retrouvent au corps à corps.', valeurPuissance: 40, },
      { id: 'mage_elfe_ombres_fugaces', nom: 'Ombres Fugaces', texte: 'Difficulté 8 — La première fois que le Mage est touché (tir ou corps à corps), la touche est ignorée et il est déplacé de 2ps dans une direction aléatoire ; le sort reste actif jusqu’à ce qu’il protège ainsi le Mage, puis se dissipe.', valeurPuissance: 20, },
      { id: 'mage_elfe_furie_du_chasseur', nom: 'Furie du Chasseur', texte: 'Difficulté 9 — Invoque 1D3+1 flèches magiques (portée 36ps, CT du Mage, sans pénalité de mouvement ni de couvert) contre une même figurine ennemie ; chacune inflige une touche de Force 3.', valeurPuissance: 40, },
      { id: 'mage_elfe_gardien_silencieux', nom: 'Gardien Silencieux', texte: 'Difficulté 9 — Une épée spectrale invisible protège le Mage : si celui-ci est attaqué au corps à corps, elle frappe en premier (CC5, F3) contre chaque assaillant. Elle ne peut être attaquée en retour et disparaît si le Mage lance un autre sort ou meurt.', valeurPuissance: 20, },
    ],
    tags: ['elfe'],
    depart_apres_bataille: true,
  },
];

const RESTRICTIONS_ABSOLUES: Record<string, Set<string>> = {
  carnival_of_chaos: new Set(),
  cavalcade_maudite: new Set(),
  // "It's not one of us: ... the Amazons never hire Hired Swords or
  // Dramatis Personae, unless they are also Amazons." (Amazones - Setting
  // Lustrie [GLM].pdf p.1) — aucun franc-tireur brut n'est une Amazone,
  // d'où l'ensemble vide ; seule Penthesilée (Dramatis Personae) reste
  // recrutable, via RESTRICTIONS_ABSOLUES_DP dans dramatisPersonae.ts. Même
  // règle chez les Amazones du Setting Mordheim (amazones_mordheim).
  amazones_lustrie: new Set(),
  amazones_mordheim: new Set(),
  // "Outsiders: ... The Battle Monks warband may never hire any sort of
  // Hired Sword or Dramatis Personae unless specifically stated with the
  // Hired sword/Dramatis Personae." (Battle Monks of Cathay.pdf p.1) —
  // seuls les francs-tireurs dont le texte nomme explicitement Cathay.
  moines_guerriers_de_cathay: new Set(['pyromane', 'ninja', 'forgeron', 'marchand_cathayen']),
  // "Francs-tireurs : Les Escorteurs Impériaux ne peuvent être accompagnés
  // que par des Francs-tireurs montés. Cela concerne les Chevaliers
  // solitaires et les Patrouilleurs." (Escorteurs Impériaux [GLM].pdf p.1)
  // — liste blanche fermée : sans elle, tout franc-tireur dont la
  // définition utilise toutesSauf(...)/HUMAINS/TOUTES_LES_BANDES (ex.
  // Bandit de Grand Chemin, nommément exclu par le texte) resterait
  // accessible par défaut.
  escorteurs_imperiaux: new Set(['chevalier_solitaire', 'patrouilleur']),
  ostlanders: new Set(['ogre']),
  lustrian_reavers: new Set(['ogre', 'tueur_trolls_nain', 'tireur_elite_tileen', 'chasseur_gros_gibier']),
  orc_mob: new Set(['gladiateur', 'ogre', 'mage']),
  gobelins_de_la_nuit: new Set([
    'gladiateur',
    'ogre',
    'mage',
    'sorciere',
    'supervizork',
  ]),
  maneaters: new Set(['halfling', 'halfling_voleur', 'ogre', 'centaure_chaos', 'eclaireur_hobgobelin', 'guide_lustrien']),
  maraudeurs_du_chaos: new Set([
    'gladiateur',
    'ogre',
    'chaman_norse',
    'assassin_imperial',
    'centaure_chaos',
    'guide_lustrien',
    'assassin_elfe_noir',
    'sorciere',
    'mage',
  ]),
  nains_du_chaos: new Set([
    'gladiateur',
    'ogre',
    'mage',
    'assassin_imperial',
    'eclaireur_hobgobelin',
    'guide_lustrien',
    'assassin_elfe_noir',
  ]),
};

function appliquerRestrictionsDeBande(profil: FrancTireurCatalog): FrancTireurCatalog {
  const bandeIds = profil.employeurs.bande_ids.filter((id) => {
    const restriction = RESTRICTIONS_ABSOLUES[id];
    if (restriction && !restriction.has(profil.id)) return false;
    if ((id === 'dwarf_treasure_hunters' || id === 'culte_des_tueurs') && profil.tags?.includes('elfe')) return false;
    return true;
  });
  return { ...profil, employeurs: { ...profil.employeurs, bande_ids: bandeIds } };
}

// Pendant DP de appliquerRestrictionsDeBande ci-dessus, appliqué aux
// Dramatis Personae au moment où ils rejoignent FRANCS_TIREURS — sans ce
// filtre, RecruterFrancTireurScreen (qui liste FRANCS_TIREURS dans son
// intégralité, francs-tireurs bruts ET Dramatis Personae confondus) resterait
// aveugle à RESTRICTIONS_ABSOLUES_DP.
function appliquerRestrictionsDeBandeDP(profil: FrancTireurCatalog): FrancTireurCatalog {
  const bandeIds = profil.employeurs.bande_ids.filter((id) => {
    const restriction = RESTRICTIONS_ABSOLUES_DP[id];
    if (restriction && !restriction.has(profil.id)) return false;
    // "Rancuniers" — même exclusion elfe que pour les francs-tireurs bruts
    // (appliquerRestrictionsDeBande ci-dessus), dupliquée ici pour que
    // RecruterFrancTireurScreen (qui liste FRANCS_TIREURS en entier) reste
    // cohérent avec dramatisPersonaeDisponibles (dramatisPersonae.ts).
    if ((id === 'dwarf_treasure_hunters' || id === 'culte_des_tueurs') && profil.tags?.includes('elfe')) return false;
    return true;
  });
  return { ...profil, employeurs: { ...profil.employeurs, bande_ids: bandeIds } };
}

// Le chapitre Dramatis Personae (dramatisPersonae.ts) rejoint le même
// catalogue : recrutement différent (recherche post-bataille dédiée plutôt
// que l'écran de recrutement), mais mécanique de jeu identique (resolveProfil,
// entretien, valeur de bande...) — voir FrancTireurCatalog.est_dramatis_personae.
// RESTRICTIONS_ABSOLUES ne s'applique volontairement qu'aux francs-tireurs
// bruts : c'est une liste blanche par bande spécifique à ce système (ex :
// l'Horde Orque exclut Gladiateur/Ogre/Mage), sans équivalent partagé avec
// les Dramatis Personae — la leur appliquer les rendrait accidentellement
// indisponibles partout où une bande a une liste blanche. Une bande fermée
// à TOUT franc-tireur/DP sauf un cas nommé (ex : la Cavalcade Maudite, qui
// ne peut engager que le Maître Corbeau — voir RESTRICTIONS_ABSOLUES_DP
// dans dramatisPersonae.ts pour le pendant DP) doit donc être déclarée aux
// DEUX endroits séparément.
export const FRANCS_TIREURS: FrancTireurCatalog[] = [
  ...PROFILS_BRUTS.map(appliquerRestrictionsDeBande),
  ...DRAMATIS_PERSONAE.map(appliquerRestrictionsDeBandeDP),
];

export function getFrancTireur(id: string | undefined): FrancTireurCatalog | undefined {
  return id ? FRANCS_TIREURS.find((profil) => profil.id === id) : undefined;
}

export function profilDeFrancTireur(francTireur: FrancTireurCatalog): Profile {
  return {
    id: `franc-tireur-${francTireur.id}`,
    nom: francTireur.nom,
    type: 'heros',
    unique: true,
    cout: francTireur.recrutement.cout,
    cout_notation: francTireur.recrutement.notation,
    stats: francTireur.stats,
    acces_competences: francTireur.acces_competences,
    grille_xp: 'homme_de_main',
    table_avancement: 'heros',
    acces_equitation_automatique: false,
    peut_lancer_sorts: !!francTireur.magie || !!francTireur.sorts_domaine_bande,
    categorie_magie: francTireur.magie?.categorie,
    regles_speciales: francTireur.regles_speciales,
    competences_speciales: francTireur.competences_speciales,
    groupe_caracteristiques: francTireur.groupe_caracteristiques,
  };
}

// Libellé affiché pour une option de FrancTireurCatalog['equipement_choix']
// (ex : ['epee', 'epee'] -> "2× Sword", ['epee', 'hache'] -> "Sword + Axe")
// — dérivé des noms d'objets déjà traduits plutôt que d'un texte dédié à
// écrire/traduire pour chaque combinaison.
export function libelleOptionEquipementChoix(itemIds: string[], language: Language): string {
  const comptes = new Map<string, number>();
  for (const id of itemIds) comptes.set(id, (comptes.get(id) ?? 0) + 1);
  return [...comptes.entries()]
    .map(([id, n]) => {
      const item = getItem(id);
      const nom = item ? translateItem(item, language).nom : id;
      return n > 1 ? `${n}× ${nom}` : nom;
    })
    .join(' + ');
}

export type DisponibiliteFrancTireur = { disponible: boolean; raison?: string };

export function disponibiliteFrancTireur(
  francTireur: FrancTireurCatalog,
  roster: RosterInstance
): DisponibiliteFrancTireur {
  if (!francTireur.employeurs.bande_ids.includes(roster.bande_id)) {
    return { disponible: false, raison: francTireur.employeurs.texte };
  }
  if (
    roster.membres.some(
      (m) => m.statut !== 'mort' && (m.franc_tireur_id === francTireur.id || m.profil_custom?.nom === francTireur.nom)
    )
  ) {
    return { disponible: false, raison: 'La bande possède déjà un franc-tireur de ce type.' };
  }
  const incompatibles = new Set(francTireur.incompatibles ?? []);
  const incompatiblePresent = roster.membres.find(
    (m) => m.statut !== 'mort' && m.franc_tireur_id && incompatibles.has(m.franc_tireur_id)
  );
  if (incompatiblePresent) {
    const autre = getFrancTireur(incompatiblePresent.franc_tireur_id);
    return { disponible: false, raison: `Incompatible avec ${autre?.nom ?? incompatiblePresent.nom_perso}.` };
  }
  if (
    francTireur.id === 'eclaireur_hobgobelin' &&
    roster.membres.some((m) => {
      const autre = getFrancTireur(m.franc_tireur_id);
      return m.statut !== 'mort' && autre?.tags?.includes('peau_verte');
    })
  ) {
    return { disponible: false, raison: 'Incompatible avec un autre franc-tireur Peau-Verte.' };
  }
  if (
    francTireur.tags?.includes('peau_verte') &&
    roster.membres.some((m) => m.statut !== 'mort' && m.franc_tireur_id === 'eclaireur_hobgobelin')
  ) {
    return { disponible: false, raison: 'L’Éclaireur Hobgobelin refuse tout autre franc-tireur Peau-Verte.' };
  }
  if (
    francTireur.id === 'guerrier_fantome' &&
    roster.membres.some((m) => {
      const autre = getFrancTireur(m.franc_tireur_id);
      return m.statut !== 'mort' && autre?.tags?.includes('malefique');
    })
  ) {
    return { disponible: false, raison: 'Refuse une bande qui emploie déjà un franc-tireur maléfique.' };
  }
  if (francTireur.sacrifice_liche && !roster.membres.some((m) => m.profil_id === 'liche' && m.statut !== 'mort')) {
    return { disponible: false, raison: 'Une Liche vivante est requise pour construire le Goliath d’Os.' };
  }
  if (
    roster.bande_id === 'maraudeurs_du_chaos' &&
    (francTireur.id === 'sorciere' || francTireur.id === 'mage') &&
    roster.membres.some((m) => m.statut !== 'mort' && m.marque === 'arkhar')
  ) {
    return { disponible: false, raison: 'Refusé : un guerrier de la bande porte la Marque d’Arkhar.' };
  }
  return { disponible: true };
}

export function estFrancTireur(membre: Member): boolean {
  return !!(membre.franc_tireur_id || membre.profil_custom);
}

export function aUnFrancTireurAvecTag(roster: RosterInstance, tag: NonNullable<FrancTireurCatalog['tags']>[number]) {
  return roster.membres.some((m) => {
    if (m.statut === 'mort') return false;
    return getFrancTireur(m.franc_tireur_id)?.tags?.includes(tag);
  });
}

export function coutEntretienFrancTireur(francTireur: FrancTireurCatalog, roster: RosterInstance): number {
  if (francTireur.entretien.cout_si_elfe != null) {
    const tagOppose = francTireur.tags?.includes('elfe') ? 'nain' : 'elfe';
    if (aUnFrancTireurAvecTag(roster, tagOppose)) return francTireur.entretien.cout_si_elfe;
  }
  return francTireur.entretien.cout;
}

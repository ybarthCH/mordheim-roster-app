import type { FrancTireurCatalog } from '../types/hiredSword';
import type { Member, RosterInstance } from '../types/roster';
import { toutesSauf, SKAVENS, MORTS_VIVANTS, HUMAINS, TOUTES_LES_BANDES, ELFES, NAINS } from './bandeCategories';

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
  {
    id: 'marianna_chevaux',
    nom: 'Comtesse Marianna Chevaux, Vampire Assassin',
    page_source: 0,
    recrutement: { cout: 150 },
    entretien: { type: 'or', cout: 75, texte: '75 CO après chaque bataille à laquelle elle participe.' },
    valeur: 90,
    employeurs: {
      bande_ids: toutesSauf('witch_hunters', 'sisters_of_sigmar', ...MORTS_VIVANTS),
      texte:
        'Toutes les bandes sauf les Répurgateurs, les Sœurs de Sigmar, les Morts-Vivants, les bandes elfes et les bandes affiliées à Sigmar (les Mercenaires ne comptent pas comme affiliés).',
    },
    stats: { M: 6, CC: 6, CT: 6, F: 4, E: 4, PV: 2, I: 9, A: 3, Cd: 9 },
    equipement: ['Rapière', 'Dague', 'Couteaux de lancer', 'Arbalète de poing', 'Robe de soie bretonnienne'],
    acces_competences: [],
    regles_speciales: [
      {
        nom: 'Immunité à la Psychologie',
        texte: 'Étant un vampire, Marianna est immunisée à la psychologie et n’abandonnera jamais le combat.',
      },
      { nom: 'Immunité aux Poisons', texte: 'Marianna n’est affectée par aucun poison.' },
      {
        nom: 'Insensible',
        texte:
          'Marianna remplace les résultats sonné par à terre. Sa compétence Rétablissement l’empêchant d’être mise à terre, le seul moyen de la stopper est de la mettre hors de combat.',
      },
      { nom: 'Provoque la Peur', texte: 'Marianna est terrifiante, davantage à cause de sa réputation que de sa condition vampirique.' },
      { nom: 'Tueuse de vampires', texte: 'Tous les vampires haïssent Marianna, car elle a juré leur perte.' },
      {
        nom: 'Le Noctu',
        texte:
          'La gemme volée dans le repaire de Serutat possède des capacités magiques latentes. L’ombre qu’elle projette inflige une pénalité de -1 au toucher à tous les tirs dirigés contre Marianna.',
      },
      {
        nom: 'Ail sur les armes',
        texte: 'Les carreaux de son arbalète et sa rapière sont enduits d’ail, qui compte comme du Lotus Noir contre les vampires.',
      },
      {
        nom: 'Rapière : +1 Sauvegarde ennemie, Barrage, Parade',
        texte:
          'Une figurine blessée obtient +1 à sa sauvegarde d’armure (ou 6+ si elle n’en a pas). Barrage : en cas de touche sans blessure, une attaque supplémentaire est possible (cumulable, malus -1 pour toucher à chaque fois). Parade : contre un jet pour toucher, 1D6 supérieur au meilleur jet adverse annule l’attaque (sauf Force double ou plus).',
      },
      {
        nom: 'Tu n’échapperas pas à ton destin…',
        texte:
          'Au dernier tour de partie (si Marianna est présente) ou dès qu’une bande déroute, lancez 1D6 sur table papier : 1-3 elle quitte la bande à la fin de la partie ; 4-5 elle reste, contre solde, pour la bataille suivante ; 6 des serviteurs de Serutat interviennent (à résoudre sur table).',
      },
    ],
    competences_departs: ['vitesse_06', 'combat_02', 'combat_06', 'vitesse_01', 'vitesse_04', 'vitesse_05', 'vitesse_07'],
    groupe_caracteristiques: 'morts_vivants_vampire',
    gagne_experience: false,
    est_dramatis_personae: true,
  },
  {
    id: 'dijin_katal',
    nom: 'Dijin Katal, l’Assassin Renégat',
    page_source: 0,
    recrutement: { cout: 85 },
    entretien: { type: 'or', cout: 40, texte: '40 CO après chaque bataille à laquelle il participe.' },
    valeur: 70,
    employeurs: {
      bande_ids: toutesSauf(...ELFES),
      texte:
        'Toutes les bandes, sauf les bandes elfes (dont les Elfes Noirs, exclus dans tous les cas) et toute bande qui compte déjà un elfe parmi ses membres.',
    },
    stats: { M: 5, CC: 7, CT: 5, F: 4, E: 3, PV: 2, I: 7, A: 2, Cd: 8 },
    equipement: ['Cape d’assassin druchii (cape elfique)', 'Deux épées enduites de venin fuligineux', 'Arbalète à répétition'],
    acces_competences: [],
    regles_speciales: [
      {
        nom: 'Haine fratricide',
        texte: 'Tout Elfe Noir (y compris un franc-tireur Haut Elfe) ressent de la haine envers Dijin Katal, et réciproquement.',
      },
      {
        nom: 'Tueur parfait',
        texte: 'Toutes les attaques de Dijin Katal, corps à corps ou tir, infligent un malus de -1 à la sauvegarde d’armure adverse.',
      },
      {
        nom: 'Drapé d’ombre',
        texte:
          'À couvert, Dijin ne peut être chargé qu’à une distance maximale égale à son Initiative ; les tirs contre lui à couvert subissent -1 pour toucher en plus du malus habituel.',
      },
      {
        nom: 'Vue excellente',
        texte: 'Détecte les ennemis cachés à une distance égale au double de son Initiative.',
      },
      { nom: 'Renégat', texte: 'Ayant commis un fratricide, Dijin est haï par tout Elfe Noir qui le combat.' },
      {
        nom: 'Vagabond',
        texte:
          'Dijin Katal ne reste jamais plus d’une bataille d’affilée avec la même bande : une bande doit livrer la suivante sans lui avant de pouvoir le rechercher de nouveau.',
      },
    ],
    competences_departs: ['combat_01', 'vitesse_04', 'tir_01', 'vitesse_06', 'tir_06'],
    groupe_caracteristiques: 'elfe',
    tags: ['elfe'],
    gagne_experience: false,
    depart_apres_bataille: true,
    est_dramatis_personae: true,
  },
  {
    id: 'luthor_lame_pourpre',
    nom: 'Luthor, la Lame Pourpre du Reikland',
    page_source: 0,
    recrutement: { cout: 60 },
    entretien: { type: 'or', cout: 25, texte: '25 CO après chaque bataille à laquelle il participe.' },
    valeur: 35,
    employeurs: {
      bande_ids: HUMAINS.filter((id) => id !== 'middenheimers'),
      texte: 'Toutes les bandes humaines sauf les Middenheimers (qui ne chercheraient jamais l’aide d’un Reiklander).',
    },
    stats: { M: 4, CC: 4, CT: 4, F: 4, E: 4, PV: 2, I: 4, A: 2, Cd: 8 },
    equipement: ['Épée', 'Poignard', 'Armure lourde', 'Casque'],
    acces_competences: [],
    regles_speciales: [
      {
        nom: 'Mauvais Œil',
        texte: 'Luthor est immunisé contre toutes les blessures oculaires (ignorez pour lui le résultat 31 sur la table des Blessures permanentes).',
      },
      {
        nom: 'Je suis partout',
        texte: 'Deux bandes qui se battent l’une contre l’autre peuvent toutes deux utiliser Luthor le temps d’une bataille (à gérer manuellement).',
      },
      {
        nom: 'La Lame Pourpre',
        texte: 'Contre un ennemi déjà engagé au corps à corps, Luthor gagne +1 pour toucher, +1 pour blesser et +1 pour les jets de blessures.',
      },
      {
        nom: 'Désengagement',
        texte:
          'Pendant sa phase de mouvement, Luthor peut s’éloigner de tout corps à corps sans que l’ennemi ne puisse faire d’attaques, et peut même charger un autre ennemi de cette façon.',
      },
    ],
    competences_departs: ['combat_06', 'vitesse_06', 'combat_05', 'vitesse_02', 'tir_01'],
    groupe_caracteristiques: 'humain',
    gagne_experience: false,
    est_dramatis_personae: true,
    groupe_exclusif: 'luthor',
  },
  {
    id: 'luthor_sorcier_tenebreux',
    nom: 'Luthor, le Sorcier Ténébreux Extraordinaire',
    page_source: 0,
    recrutement: { cout: 60 },
    entretien: { type: 'or', cout: 25, texte: '25 CO après chaque bataille à laquelle il participe.' },
    valeur: 35,
    employeurs: {
      bande_ids: toutesSauf('witch_hunters', 'reiklanders', 'sisters_of_sigmar'),
      texte: 'N’importe quelle bande, à l’exception des Répurgateurs, des Reiklanders et des Sœurs de Sigmar.',
    },
    stats: { M: 4, CC: 4, CT: 4, F: 4, E: 4, PV: 2, I: 4, A: 2, Cd: 8 },
    equipement: [
      'Bâton (considéré comme une masse)',
      'Armure lourde dissimulée',
      'Porte-bonheur',
      'Ail',
      'Flasque de Bière de Bugman (immunise contre la peur)',
      'Orbes d’argile de Feu Tiléen',
    ],
    acces_competences: [],
    regles_speciales: [
      {
        nom: 'Mauvais Œil',
        texte: 'Luthor est immunisé contre toutes les blessures oculaires (ignorez pour lui le résultat 31 sur la table des Blessures permanentes).',
      },
      {
        nom: 'Je suis partout',
        texte: 'Deux bandes qui se battent l’une contre l’autre peuvent toutes deux utiliser Luthor le temps d’une bataille (à gérer manuellement).',
      },
      {
        nom: 'Boules de Feu',
        texte:
          'Lors de sa phase de tir, même engagé au corps à corps, portée 8ps sans pénalité à longue portée : 1 touche de Force 2 si elle atteint sa cible, qui doit ensuite réussir un test d’Initiative ou ne peut ni charger ni tirer au tour suivant.',
      },
      {
        nom: 'Danse Frétillante du Poisson',
        texte: 'Au corps à corps, sur un résultat de 6 pour toucher avec son bâton, résolvez le coup à Force x2 (8 au lieu de 4).',
      },
    ],
    competences_departs: ['combat_06', 'vitesse_06', 'combat_05', 'vitesse_02', 'tir_01'],
    groupe_caracteristiques: 'humain',
    gagne_experience: false,
    est_dramatis_personae: true,
    groupe_exclusif: 'luthor',
  },
  {
    id: 'luthor_maitre_archer',
    nom: 'Luthor, le Maître-Archer de la Drakwald',
    page_source: 0,
    recrutement: { cout: 60 },
    entretien: { type: 'or', cout: 25, texte: '25 CO après chaque bataille à laquelle il participe.' },
    valeur: 35,
    employeurs: {
      bande_ids: [...HUMAINS, ...NAINS, ...ELFES].filter((id) => id !== 'reiklanders'),
      texte: 'N’importe quelle bande humaine, elfe ou naine, à l’exception des Reiklanders (où il est trop connu sous le nom de Lame Pourpre).',
    },
    stats: { M: 4, CC: 4, CT: 4, F: 4, E: 4, PV: 2, I: 4, A: 2, Cd: 8 },
    equipement: ['Arc long', 'Poignard', 'Flèches de chasse', 'Armure lourde', 'Venin noir (sur ses flèches)'],
    acces_competences: [],
    regles_speciales: [
      {
        nom: 'Mauvais Œil',
        texte: 'Luthor est immunisé contre toutes les blessures oculaires (ignorez pour lui le résultat 31 sur la table des Blessures permanentes).',
      },
      {
        nom: 'Je suis partout',
        texte: 'Deux bandes qui se battent l’une contre l’autre peuvent toutes deux utiliser Luthor le temps d’une bataille (à gérer manuellement).',
      },
      {
        nom: 'Vantardise',
        texte:
          'Avant de tirer, Luthor peut se vanter d’atteindre sa cible : s’il touche, la bande reçoit +1D6 à un futur jet de corps à corps, de tir ou de Commandement. S’il rate, la bande subit -1 Cd cumulatif jusqu’à ce qu’il touche une autre cible.',
      },
      {
        nom: 'Tu te sens chanceux fiston ?',
        texte:
          'En début de phase de tir, Luthor désigne une figurine adverse comme cible de ses menaces : elle subit -1 CC et -1 CT (sauf morts-vivants, démons, animaux et guerriers immunisés à la psychologie).',
      },
    ],
    competences_departs: ['combat_06', 'vitesse_06', 'combat_05', 'vitesse_02', 'tir_01'],
    groupe_caracteristiques: 'humain',
    gagne_experience: false,
    est_dramatis_personae: true,
    groupe_exclusif: 'luthor',
  },
  {
    id: 'thrud_le_barbare',
    nom: 'Thrud le Barbare',
    page_source: 0,
    recrutement: { cout: 0 },
    entretien: {
      type: 'aucun',
      cout: 0,
      texte:
        'Thrud ne demande aucune solde, seulement de quoi boire — sa règle d’origine (jet d’Initiative avant chaque bataille pour attirer son attention, uniquement si l’adversaire a une valeur de bande supérieure) est simplifiée ici en recrutement classique via une recherche post-bataille.',
    },
    valeur: 110,
    employeurs: {
      bande_ids: [...TOUTES_LES_BANDES],
      texte: 'N’importe quelle bande, à l’exception d’une bande dont le chef est un jeteur de sorts.',
    },
    stats: { M: 4, CC: 6, CT: 2, F: 5, E: 4, PV: 3, I: 3, A: 2, Cd: 6 },
    equipement: ['Hache de guerre', 'Casque'],
    acces_competences: [],
    regles_speciales: [
      {
        nom: 'Peau épaisse et Tête dure',
        texte:
          'Sauvegarde d’armure de 6+, jamais améliorable par des modificateurs de Force. Ignore les règles spéciales des masses/gourdins et est immunisé à la psychologie.',
      },
      {
        nom: 'Esprit insondable',
        texte: 'Sauvegarde de 4+ contre tous les sorts et effets magiques qui ciblent Thrud (le sort est alors ignoré).',
      },
      {
        nom: 'Boit sans soif & Digestion trollesque',
        texte: 'Immunisé aux poisons et aux effets de l’alcool ; peut manger ou boire n’importe quoi sans effet néfaste.',
      },
      {
        nom: 'Barbare imprévisible (règle de jeu sur table, non simulée ici)',
        texte:
          'Au début de chacun de ses tours, 2D6 détermine son état jusqu’au tour suivant : 2 confusion totale (contrôlé par l’adversaire) ; 3-4 Stupidité ; 5 fonce vers "de la bière" dans une direction aléatoire ; 6 ne peut être pris par surprise ; 7-8 +1 Mouvement et +1 Initiative ; 9-10 +1 Force au premier coup d’une charge ; 11-12 Frénésie.',
      },
    ],
    competences_departs: ['combat_02', 'force_05'],
    gagne_experience: false,
    est_dramatis_personae: true,
  },
  {
    id: 'nicodemus',
    nom: 'Nicodemus, l’Éternel Vagabond',
    page_source: 0,
    recrutement: { cout: 0 },
    entretien: {
      type: 'malepierre',
      cout: 1,
      texte:
        '1 fragment de pierre magique après chaque bataille à laquelle il participe, y compris la première. S’il n’y en a pas (ou si vous préférez le vendre), Nicodemus quitte la bande.',
    },
    valeur: 85,
    employeurs: {
      bande_ids: toutesSauf(...SKAVENS, 'cult_of_the_possessed', ...MORTS_VIVANTS, 'witch_hunters'),
      texte: 'Toute bande sauf les Skavens, les Morts-Vivants, les Possédés et les Répurgateurs.',
    },
    stats: { M: 4, CC: 3, CT: 3, F: 4, E: 4, PV: 2, I: 3, A: 1, Cd: 8 },
    equipement: ['Bâton de sorcier (massue à deux mains avec parade de rondache, ou massue à une main en gardant la Lame de Rehebel dans l’autre)'],
    acces_competences: [],
    regles_speciales: [
      {
        nom: 'Maudit',
        texte:
          'Victime d’un vœu mal formulé auprès d’un démon, Nicodemus grandit sans cesse et ne s’intéresse qu’à la pierre magique, jamais à l’or.',
      },
      {
        nom: 'Bâton de Sorcier',
        texte:
          'À deux mains, considéré comme une massue permettant en plus de parer comme une rondache. À une main, massue normale tout en gardant la Lame de Rehebel dans l’autre main (un sort, pas une arme : ne peut pas parer).',
      },
    ],
    competences_departs: ['academique_02', 'force_04'],
    magie: { categorie: 'magie_mineure', sorts_depart: 6 },
    sorts_departs: [
      'Flammes de U’Zhul',
      'Vol de Zimmeran',
      'Frayeur d’Aramar',
      'Flèches Argentées d’Arha',
      'Chance de Shemtek',
      'Lame de Rehebel',
    ],
    groupe_caracteristiques: 'humain',
    gagne_experience: false,
    est_dramatis_personae: true,
  },
  {
    id: 'penthesilee',
    nom: 'Penthesilée, l’Élue du Dieu Serpent',
    page_source: 0,
    recrutement: { cout: 0 },
    entretien: { type: 'aucun', cout: 0, texte: 'Penthesilée ne demande aucune solde.' },
    valeur: 70,
    employeurs: {
      bande_ids: ['amazones_lustrie', 'amazones_mordheim'],
      texte:
        'Penthesilée ne se joindra qu’à une bande d’Amazones, et seulement si l’adversaire de la prochaine bataille a une valeur de bande supérieure (0-49 : impossible ; 50-99 : 6+ ; 100-149 : 5+ ; 150-199 : 4+ ; 200+ : 3+ sur 1D6, à vérifier sur table papier avant la recherche).',
    },
    stats: { M: 5, CC: 5, CT: 4, F: 4, E: 4, PV: 2, I: 5, A: 2, Cd: 8 },
    equipement: ['Épée des étoiles', 'Lame des étoiles', 'Amulette lunaire', 'Peaux enchantées (équipement des Amazones)'],
    acces_competences: [],
    regles_speciales: [
      { nom: 'Amazone', texte: 'Penthesilée est une Amazone et suit donc toutes les règles spéciales les concernant.' },
      {
        nom: 'Marque du Serpent',
        texte: 'Déjà incluse dans son profil : +1 Mouvement et +1 Initiative par rapport à une Amazone ordinaire.',
      },
      {
        nom: 'Haine des hommes',
        texte: 'Ayant vu nombre de ses sœurs se faire capturer ou tuer par des pillards, Penthesilée est sujette à la haine envers tous les mâles humains.',
      },
    ],
    competences_departs: ['combat_02'],
    competences_speciales: [
      {
        id: 'elixir_de_vie',
        nom: 'Élixir de Vie',
        texte:
          'Après la bataille, si Penthesilée a été mise hors de combat, relancez son jet de Dégâts : sur 1-4, elle ne subit pas les conséquences du statut hors de combat et participe normalement à la séquence d’après-bataille.',
        valeurPuissance: 0,
      },
      {
        id: 'dissimulation',
        nom: 'Dissimulation',
        texte: 'Cachée dans un terrain de type jungle, la portée nécessaire pour la détecter est divisée par deux.',
        valeurPuissance: 20,
      },
      {
        id: 'danse_hypnotique',
        nom: 'Danse Hypnotique',
        texte:
          'Tout combattant engagé au corps à corps contre Penthesilée doit réussir un test de Commandement en début de tour ou ne peut pas attaquer ce tour (mais peut se défendre). Sans effet contre les Hommes-Lézards et les Morts-Vivants.',
        valeurPuissance: 40,
      },
      {
        id: 'fureur_sauvage',
        nom: 'Fureur Sauvage',
        texte: '+1 Attaque lorsqu’elle charge ; immunisée aux effets de charme ou de peur.',
        valeurPuissance: 40,
      },
    ],
    gagne_experience: false,
    est_dramatis_personae: true,
  },
  {
    id: 'marquand_volker',
    nom: 'Marquand Volker',
    page_source: 0,
    recrutement: { cout: 30 },
    entretien: { type: 'aucun', cout: 0, texte: 'Aucune solde : Ulli et Marquand quittent la bande après chaque bataille (Vagabonds) et sont à re-recruter à chaque fois.' },
    valeur: 30,
    employeurs: {
      bande_ids: toutesSauf('sisters_of_sigmar', 'witch_hunters'),
      texte: 'Toutes les bandes sauf les Sœurs de Sigmar et les Répurgateurs.',
    },
    stats: { M: 4, CC: 5, CT: 4, F: 3, E: 3, PV: 2, I: 5, A: 2, Cd: 8 },
    equipement: ['Épée', 'Armure légère', 'Couteaux de lancer'],
    acces_competences: [],
    regles_speciales: [
      {
        nom: 'Vagabonds',
        texte: 'Ulli et Marquand ne restent jamais plus d’une bataille d’affilée avec la même bande : celle-ci doit livrer la suivante sans eux avant de pouvoir les engager de nouveau.',
      },
      {
        nom: 'Pour une poignée de couronnes',
        texte:
          'En cours de partie, l’adversaire peut tenter de les acheter pour qu’ils changent de camp (offres secrètes en début de partie, révélées au choix de l’ennemi ; l’offre la plus haute l’emporte) — à gérer manuellement sur table.',
      },
      {
        nom: 'C’est l’heure de payer !',
        texte:
          'Si la bande ne peut régler leurs frais supplémentaires, ils se payent en équipement ou, à défaut, se retournent contre le chef de bande (corps à corps à mort, sans les hommes de main) — à gérer manuellement.',
      },
      {
        nom: 'Inséparables',
        texte:
          'Ulli et Marquand doivent rester à 4ps ou moins l’un de l’autre ; si l’un est mis hors de combat, l’autre tente de le mettre à l’abri — à gérer manuellement sur table.',
      },
    ],
    competences_departs: ['tir_08', 'combat_06', 'vitesse_04'],
    groupe_caracteristiques: 'humain',
    gagne_experience: false,
    depart_apres_bataille: true,
    est_dramatis_personae: true,
    recrue_avec: 'ulli_leitpold',
  },
  {
    id: 'ulli_leitpold',
    nom: 'Ulli Leitpold',
    page_source: 0,
    recrutement: { cout: 30 },
    entretien: { type: 'aucun', cout: 0, texte: 'Aucune solde : Ulli et Marquand quittent la bande après chaque bataille (Vagabonds) et sont à re-recruter à chaque fois.' },
    valeur: 30,
    employeurs: {
      bande_ids: toutesSauf('sisters_of_sigmar', 'witch_hunters'),
      texte: 'Toutes les bandes sauf les Sœurs de Sigmar et les Répurgateurs.',
    },
    stats: { M: 4, CC: 4, CT: 4, F: 4, E: 3, PV: 3, I: 4, A: 2, Cd: 7 },
    equipement: ['Marteau de guerre à deux mains', 'Armure légère'],
    acces_competences: [],
    regles_speciales: [
      {
        nom: 'Vagabonds',
        texte: 'Ulli et Marquand ne restent jamais plus d’une bataille d’affilée avec la même bande : celle-ci doit livrer la suivante sans eux avant de pouvoir les engager de nouveau.',
      },
      {
        nom: 'Inséparables',
        texte:
          'Ulli et Marquand doivent rester à 4ps ou moins l’un de l’autre ; si l’un est mis hors de combat, l’autre tente de le mettre à l’abri — à gérer manuellement sur table.',
      },
    ],
    competences_departs: ['force_05', 'force_06', 'combat_02'],
    groupe_caracteristiques: 'humain',
    gagne_experience: false,
    depart_apres_bataille: true,
    est_dramatis_personae: true,
  },
  {
    id: 'simius_gantt',
    nom: 'Simius Gantt, le Maître aux Corbeaux',
    nom_original: 'The Crow Master',
    page_source: 0,
    recrutement: { cout: 65 },
    entretien: { type: 'or', cout: 15, texte: '15 CO après chaque bataille à laquelle il participe.' },
    valeur: 85,
    employeurs: {
      bande_ids: toutesSauf(...NAINS, ...ELFES, 'sisters_of_sigmar', 'witch_hunters'),
      texte: 'Toute bande sauf les Nains, les Elfes, les Sœurs de Sigmar et les Répurgateurs.',
    },
    stats: { M: 4, CC: 3, CT: 3, F: 3, E: 4, PV: 3, I: 5, A: 2, Cd: 8 },
    equipement: ['Manteau aux Corbeaux', 'Bâton', 'Aiguille et fil'],
    acces_competences: [],
    regles_speciales: [
      {
        nom: 'Manteau aux Corbeaux',
        texte:
          'Ce manteau en apparence miteux abrite un pouvoir malin caché : une nuée de corbeaux tourbillonne autour de Simius pour distraire ses adversaires. Toute figurine ennemie au contact socle à socle de Simius subit une touche automatique de Force 2 avant les échanges de coups, au début de chaque phase de Corps à corps.',
      },
      {
        nom: 'Aiguille et fil',
        texte:
          'Vestige de ses années de chirurgien, Simius porte toujours une aiguille et du fil. S’il étourdit un adversaire au corps à corps sans qu’aucun autre ennemi ne soit au contact, il recoud la bouche de sa victime : celle-ci ne peut plus utiliser l’aptitude de Chef ni lancer de sorts pour le reste de la bataille.',
      },
      {
        nom: 'Paiement en sang',
        texte:
          'Scientifique zélé dont la soif d’expérimentation n’est jamais rassasiée, Simius peut, si la bande qui l’a engagé perd la bataille, décider d’« enlever » un guerrier sans défense. Lancez 1D6 : sur 1, Simius enlève le Héros ou l’Homme de main (jamais un autre franc-tireur) ayant le moins d’expérience ; ce guerrier est retiré du roster de la bande et considéré comme mort. Simius disparaît ensuite sans laisser de trace, sa prime déjà encaissée.',
      },
    ],
    competences_departs: ['academique_05', 'vitesse_06'],
    groupe_caracteristiques: 'humain',
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
// Un DP "coéquipier" (voir FrancTireurCatalog.recrue_avec) n'est jamais
// proposé seul à la recherche : il rejoint automatiquement la bande en même
// temps que celui qui le désigne.
const IDS_COEQUIPIERS = new Set(
  DRAMATIS_PERSONAE.flatMap((dp) => (dp.recrue_avec ? [dp.recrue_avec] : []))
);

// Pendant DP de RESTRICTIONS_ABSOLUES dans hiredSwords.ts : une bande fermée
// à tout Dramatis Personae sauf un cas nommé par sa propre règle spéciale
// (ex : la Cavalcade Maudite, "They cannot hire any Hired Sword or Dramatis
// Personae, other than the Crow Master") a besoin d'une liste blanche ici,
// puisque la plupart des DP restent ouverts par défaut via toutesSauf(...) —
// sans ce filtre, une telle bande resterait éligible à tous les DP dont elle
// n'est pas explicitement exclue.
export const RESTRICTIONS_ABSOLUES_DP: Record<string, Set<string>> = {
  cavalcade_maudite: new Set(['simius_gantt']),
  // Règle "Étrangers"/Outsiders (Battle Monks of Cathay.pdf p.1, voir le
  // pendant francs-tireurs dans hiredSwords.ts RESTRICTIONS_ABSOLUES) :
  // aucun Dramatis Personae ne nomme explicitement Cathay dans son texte.
  moines_guerriers_de_cathay: new Set(),
};

export function dramatisPersonaeDisponibles(roster: RosterInstance): FrancTireurCatalog[] {
  const dejaPresents = new Set(
    roster.membres.filter((m) => m.franc_tireur_id).map((m) => m.franc_tireur_id as string)
  );
  const groupesExclusifsPresents = new Set(
    [...dejaPresents]
      .map((id) => getDramatisPersonae(id)?.groupe_exclusif)
      .filter((g): g is string => !!g)
  );
  const restriction = RESTRICTIONS_ABSOLUES_DP[roster.bande_id];
  return DRAMATIS_PERSONAE.filter(
    (dp) =>
      dp.employeurs.bande_ids.includes(roster.bande_id) &&
      (!restriction || restriction.has(dp.id)) &&
      !dejaPresents.has(dp.id) &&
      !(dp.recrue_avec && dejaPresents.has(dp.recrue_avec)) &&
      !IDS_COEQUIPIERS.has(dp.id) &&
      !(dp.groupe_exclusif && groupesExclusifsPresents.has(dp.groupe_exclusif))
  );
}

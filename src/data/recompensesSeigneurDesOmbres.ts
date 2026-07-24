// Règle optionnelle "Récompenses du Seigneur des Ombres" (livre de règles
// Mordheim, p.146) : un Magister ou un Mutant ayant accumulé suffisamment
// d'expérience peut lancer 2D6 sur ce tableau au lieu de choisir une
// compétence, représentant un pèlerinage à la Fosse. Réservée au Culte des
// Possédés dans le livre de règles (voir Profile.acces_seigneur_des_ombres).
export type ResultatSeigneurDesOmbres = {
  id: string;
  min: number;
  max: number;
  nom: string;
  texte: string;
};

export const RECOMPENSES_SEIGNEUR_DES_OMBRES: ResultatSeigneurDesOmbres[] = [
  {
    id: 'colere',
    min: 2,
    max: 2,
    nom: 'Colère du Seigneur des Ombres !',
    texte:
      "Le guerrier subit tant de mutations qu'il perd toute trace d'humanité. Il disparaît dans les ruines pour rejoindre les nombreuses autres horreurs qui peuplent Mordheim.",
  },
  {
    id: 'rien',
    min: 3,
    max: 6,
    nom: 'Rien ne se passe.',
    texte: 'Le capricieux Seigneur des Ombres décide d’ignorer les supplications de son serviteur.',
  },
  {
    id: 'mutation',
    min: 7,
    max: 8,
    nom: 'Mutation.',
    texte:
      "Le guerrier développe une mutation importante. Lancez 1D6. Sur un jet de 1, vous perdez un point dans l'une des caractéristiques de votre guerrier (au choix) à cause d'une atrophie ou autre mutation débilitante. Sur un jet de 2 ou plus, choisissez la mutation reçue parmi celles de la liste des bandes de Possédés.",
  },
  {
    id: 'armure_chaos',
    min: 9,
    max: 10,
    nom: 'Armure du Chaos.',
    texte:
      "Le guerrier développe une armure ésotérique qui le recouvre entièrement. Elle confère une sauvegarde de base de 4+ sans affecter le mouvement ni empêcher de lancer des sorts.",
  },
  {
    id: 'arme_demon',
    min: 11,
    max: 11,
    nom: 'Arme démon.',
    texte:
      "Le guerrier reçoit une arme contenant un démon lié. Cette arme ajoute +1 à la Force au corps à corps, et +1 à tous les jets pour toucher avec. L'utilisateur peut en choisir la forme (épée, hache, etc), bien qu'elle ne conserve aucune des capacités spéciales habituellement associées aux armes du même type.",
  },
  {
    id: 'possede',
    min: 12,
    max: 12,
    nom: 'Possédé !',
    texte:
      "Un démon prend possession de l'âme et du corps du guerrier. Il gagne immédiatement +1 en Capacité de Combat, +1 en Force, +1 Attaque et +1 Point de Vie. Ces augmentations ne comptent pas vis-à-vis des caractéristiques maximales. Le guerrier perd D3 compétences (au choix du joueur) et ne peut plus utiliser ni arme ni armure, à l'exception de l'armure du Chaos ou des armes démons.",
  },
];

// Table de Mutations (extrait et adapté du chapitre Corrupted Characters de
// Mutiny in Marienburg) — références vers items/objets_divers.json,
// utilisées à la fois pour l'achat payant (equipement_special des bandes) et
// pour le choix gratuit offert par le résultat "Mutation" ci-dessus.
export const TABLE_MUTATIONS_ITEM_IDS = [
  'sang_acide',
  'epines',
  'corps_cristallin',
  'ame_demoniaque',
  'bras_supplementaire',
  'brute_epaisse',
  'sabots_fendus',
  'queue_prehensile',
  'queue_de_scorpion',
  'morsure_venimeuse',
  'peau_ecailleuse',
  'hideux_mutation',
  'ailes_mutation',
  'pince_mutation',
  'tentacule',
];

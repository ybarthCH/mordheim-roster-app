// Table des Blessures Graves (D66), livre de règles Mordheim p.116-117.
// Traduction française — sert uniquement de référence de sélection dans
// l'app : le joueur lance ses dés sur table réelle puis choisit le résultat
// obtenu ici, plutôt que de laisser l'app tirer les dés à sa place.
import type { Stats } from '../types/catalog';

export type SousJetOption = {
  // Valeur(s) du D6 relancé qui mènent à cette branche (ex [1] ou [2,3,4,5,6]).
  valeurs: number[];
  label: string;
  texte: string;
  stat?: Partial<Record<keyof Stats, number>>;
  noteTag?: string;
};

export type SousJetSpec = {
  de: '1D6';
  instructions: string;
  options: SousJetOption[];
};

export type ResultatBlessureGrave = {
  id: string;
  // Plage D66 d'origine, affichée à titre de repère seulement (l'app ne
  // tire jamais les dés elle-même pour ce résultat).
  code: string;
  nom: string;
  texte: string;
  stat?: Partial<Record<keyof Stats, number>>;
  noteTag?: string;
  // Instruction explicite de la table : perte totale de l'équipement.
  perteEquipement?: boolean;
  statutMort?: boolean;
  xpBonus?: number;
  // Gain de trésorerie de bande (po), appliqué au roster plutôt qu'au
  // personnage. Utilisé par le résultat Gladiateur en cas de victoire.
  tresorerieBonus?: number;
  sousJet?: SousJetSpec;
  // Cas spécial "Blessures multiples" : relance D6 fois sur cette même
  // table (en excluant Mort/Capturé/nouvelles Blessures multiples), géré à
  // part par l'assistant plutôt que via `sousJet`.
  multiplesInjuries?: boolean;
  // Cas spécial "Blessure profonde" : le nombre de parties manquées est
  // lui-même un jet de dé (1D3) plutôt qu'un choix de branche.
  sousJetDureeD3?: boolean;
  // Résultats purement informatifs (négociation avec l'adversaire...) qu'il
  // n'est pas possible d'automatiser mécaniquement.
  informatifSeulement?: boolean;
  // Cas spécial "Gladiateur" : combat dans les fosses, résolu par l'assistant
  // via une question Oui/Non (victoire ?) puis, en cas de défaite, Mort ou
  // Vivant (et dans ce dernier cas une relance filtrée sur les résultats
  // 16-35), plutôt que via `sousJet`.
  combatGladiateur?: boolean;
};

export const BLESSURES_GRAVES: ResultatBlessureGrave[] = [
  {
    id: 'mort',
    code: '11-15',
    nom: 'Mort',
    texte:
      "Le guerrier est mort ; son corps est abandonné dans les ruelles sombres de Mordheim et ne sera jamais retrouvé. Toutes les armes et l'équipement qu'il portait sont perdus. Retire-le du roster de la bande.",
    statutMort: true,
    perteEquipement: true,
  },
  {
    id: 'blessures_multiples',
    code: '16-21',
    nom: 'Blessures multiples',
    texte:
      "Le guerrier n'est pas mort mais a subi de nombreuses blessures. Lance 1D6 : relance ce nombre de fois sur cette même table. Relance tout résultat Mort, Capturé ou nouvelles Blessures multiples.",
    multiplesInjuries: true,
  },
  {
    id: 'blessure_jambe',
    code: '22',
    nom: 'Blessure à la jambe',
    texte:
      "La jambe du guerrier est brisée. Il subit désormais un malus permanent de -1 en Mouvement.",
    stat: { M: -1 },
  },
  {
    id: 'blessure_bras',
    code: '23',
    nom: 'Blessure au bras',
    texte: 'Relance 1D6 pour déterminer la gravité de la blessure.',
    sousJet: {
      de: '1D6',
      instructions: 'Relance 1D6 :',
      options: [
        {
          valeurs: [1],
          label: '1',
          texte:
            "Blessure grave au bras : il doit être amputé. Le guerrier ne peut plus utiliser qu'une seule arme à une main à partir de maintenant.",
          noteTag: 'Bras amputé — une seule arme à une main utilisable',
        },
        {
          valeurs: [2, 3, 4, 5, 6],
          label: '2-6',
          texte: 'Blessure légère : le guerrier doit manquer la prochaine partie.',
          noteTag: 'Doit manquer la prochaine partie (bras blessé)',
        },
      ],
    },
  },
  {
    id: 'folie',
    code: '24',
    nom: 'Folie',
    texte: 'Relance 1D6 pour déterminer la forme que prend la folie du guerrier.',
    sousJet: {
      de: '1D6',
      instructions: 'Relance 1D6 :',
      options: [
        {
          valeurs: [1, 2, 3],
          label: '1-3',
          texte: 'Le guerrier devient sujet à la Stupidité.',
          noteTag: 'Sujet à la Stupidité (Blessure grave — Folie)',
        },
        {
          valeurs: [4, 5, 6],
          label: '4-6',
          texte: 'Le guerrier est désormais sujet à la Frénésie.',
          noteTag: 'Sujet à la Frénésie (Blessure grave — Folie)',
        },
      ],
    },
  },
  {
    id: 'jambe_brisee',
    code: '25',
    nom: 'Jambe brisée',
    texte: 'Relance 1D6 pour déterminer la gravité de la blessure.',
    sousJet: {
      de: '1D6',
      instructions: 'Relance 1D6 :',
      options: [
        {
          valeurs: [1],
          label: '1',
          texte: 'Le guerrier ne peut plus courir, mais peut toujours charger.',
          noteTag: 'Ne peut plus courir (peut toujours charger)',
        },
        {
          valeurs: [2, 3, 4, 5, 6],
          label: '2-6',
          texte: 'Le guerrier manque la prochaine partie.',
          noteTag: 'Doit manquer la prochaine partie (jambe brisée)',
        },
      ],
    },
  },
  {
    id: 'blessure_poitrine',
    code: '26',
    nom: 'Blessure à la poitrine',
    texte:
      "Le guerrier a été gravement blessé à la poitrine. Il se rétablit mais reste affaibli par la blessure : son Endurance est réduite de -1.",
    stat: { E: -1 },
  },
  {
    id: 'aveugle_oeil',
    code: '31',
    nom: "Aveuglé d'un œil",
    texte:
      "Le guerrier survit mais perd la vue d'un œil (déterminé aléatoirement). Sa Capacité de Tir est réduite de -1. S'il perd également son autre œil par la suite, il doit se retirer définitivement de la bande.",
    stat: { CT: -1 },
    noteTag: 'Aveugle d\'un œil — retrait définitif si le second œil est perdu',
  },
  {
    id: 'vieille_blessure',
    code: '32',
    nom: 'Vieille blessure de guerre',
    texte:
      "Le guerrier survit, mais sa blessure l'empêchera parfois de combattre : au début de chaque bataille à partir de maintenant, lance 1D6 — sur un résultat de 1, il ne peut pas participer à la bataille.",
    noteTag: 'Vieille blessure — teste 1D6 en début de bataille (1 = ne combat pas)',
  },
  {
    id: 'trouble_nerveux',
    code: '33',
    nom: 'Trouble nerveux',
    texte:
      "Le système nerveux du guerrier a été endommagé. Son Initiative est réduite de façon permanente de -1.",
    stat: { I: -1 },
  },
  {
    id: 'blessure_main',
    code: '34',
    nom: 'Blessure à la main',
    texte:
      "La main du guerrier est sérieusement blessée. Sa Capacité de Combat est réduite de façon permanente de -1.",
    stat: { CC: -1 },
  },
  {
    id: 'blessure_profonde',
    code: '35',
    nom: 'Blessure profonde',
    texte:
      "Le guerrier a subi une blessure sérieuse et doit manquer les 1D3 prochaines parties le temps de se rétablir. Il ne peut rien faire du tout durant sa convalescence.",
    sousJetDureeD3: true,
  },
  {
    id: 'detrousse',
    code: '36',
    nom: 'Détroussé',
    texte:
      "Le guerrier parvient à s'échapper, mais toutes ses armes, son armure et son équipement sont perdus.",
    perteEquipement: true,
  },
  {
    id: 'retablissement_complet',
    code: '41-55',
    nom: 'Rétablissement complet',
    texte:
      "Le guerrier a été assommé, ou souffre d'une blessure légère dont il se remet complètement.",
  },
  {
    id: 'haine_tenace',
    code: '56',
    nom: 'Haine tenace',
    texte:
      "Le guerrier se rétablit physiquement, mais reste marqué psychologiquement par cette épreuve. Relance 1D6 pour déterminer qui il hait désormais.",
    sousJet: {
      de: '1D6',
      instructions: 'Relance 1D6 :',
      options: [
        {
          valeurs: [1, 2, 3],
          label: '1-3',
          texte:
            "L'individu responsable de la blessure. Si c'était un Homme de main, il hait le chef adverse à la place.",
          noteTag: 'Haine tenace : l\'individu responsable (ou le chef adverse si Homme de main)',
        },
        {
          valeurs: [4],
          label: '4',
          texte: 'Le chef de la bande responsable de la blessure.',
          noteTag: 'Haine tenace : le chef de la bande adverse',
        },
        {
          valeurs: [5],
          label: '5',
          texte: 'Toute la bande du guerrier responsable de la blessure.',
          noteTag: 'Haine tenace : toute la bande adverse',
        },
        {
          valeurs: [6],
          label: '6',
          texte: 'Toutes les bandes de ce type.',
          noteTag: 'Haine tenace : toutes les bandes de ce type',
        },
      ],
    },
  },
  {
    id: 'capture',
    code: '61',
    nom: 'Capturé',
    texte:
      "Le guerrier reprend conscience, prisonnier de la bande adverse. Il peut être libéré contre rançon (prix fixé par le ravisseur) ou échangé contre un prisonnier détenu par sa propre bande. Un prisonnier peut être vendu à des marchands d'esclaves pour D6×5 po. Les Morts-Vivants peuvent tuer leur prisonnier pour en faire un nouveau Zombie. Les Possédés peuvent sacrifier le prisonnier — le chef de la bande gagne alors +1 Expérience. Un prisonnier échangé ou libéré contre rançon conserve tout son équipement ; s'il est vendu, tué ou zombifié, son équipement reste à ses ravisseurs.",
    informatifSeulement: true,
  },
  {
    id: 'endurci',
    code: '62-63',
    nom: 'Endurci',
    texte:
      "Le guerrier survit et s'endurcit face aux horreurs de Mordheim. Il est désormais immunisé à la Peur.",
    noteTag: 'Immunisé à la Peur (Blessure grave — Endurci)',
  },
  {
    id: 'cicatrices_horribles',
    code: '64',
    nom: 'Cicatrices horribles',
    texte: 'Le guerrier porte désormais des cicatrices affreuses : il provoque la Peur.',
    noteTag: 'Cause la Peur (Blessure grave — Cicatrices horribles)',
  },
  {
    id: 'gladiateur',
    code: '65',
    nom: 'Gladiateur',
    texte:
      "Le guerrier se réveille dans les tristement célèbres fosses de combat du Repaire des Coupe-Jarrets et doit affronter un gladiateur. Déterminez qui charge, puis résolvez le combat normalement. S'il perd, relance sur cette table (Mort à Blessure profonde, soit 11-35) pour savoir s'il meurt ou est blessé ; s'il survit, il est jeté hors des fosses sans son armure ni ses armes et peut rejoindre sa bande. S'il gagne, il empoche 50 po, gagne +2 Expérience et est libre de rejoindre sa bande avec tout son équipement.",
    combatGladiateur: true,
  },
  {
    id: 'survit_contre_tout',
    code: '66',
    nom: 'Survit contre toute attente',
    texte: 'Le guerrier survit et rejoint sa bande. Il gagne +1 Expérience.',
    xpBonus: 1,
  },
];

export function trouverBlessure(id: string): ResultatBlessureGrave | undefined {
  return BLESSURES_GRAVES.find((b) => b.id === id);
}

// Résultat "Gladiateur" perdu : la table papier précise de relancer sur la
// plage 11-35 (Mort à Blessure profonde) pour savoir ce qu'il devient — Mort
// est un résultat possible de CETTE relance comme un autre, pas une
// question à part : le personnage n'est déclaré mort (statut, tag, perte
// d'équipement...) que si la relance tombe elle-même sur 11-15.
export const IDS_GLADIATEUR_PERDU = [
  'mort',
  'blessures_multiples',
  'blessure_jambe',
  'blessure_bras',
  'folie',
  'jambe_brisee',
  'blessure_poitrine',
  'aveugle_oeil',
  'vieille_blessure',
  'trouble_nerveux',
  'blessure_main',
  'blessure_profonde',
];

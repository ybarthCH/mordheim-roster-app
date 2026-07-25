import type { CompetenceSpeciale, SkillCategory, SpecialRule, Stats } from './catalog';

export type EntretienFrancTireur = {
  type: 'or' | 'malepierre' | 'aucun';
  cout: number;
  texte: string;
  // Certains nains réclament le double si la bande emploie aussi un elfe.
  cout_si_elfe?: number;
  // Exemption choisie par le joueur lorsque la condition de scénario est
  // remplie (adversaire précis, prêtre de Sigmar présent, etc.).
  exemption?: {
    label: string;
    texte: string;
  };
  // Le Geôlier peut rester sous contrat sans être payé, mais doit alors
  // manquer la bataille suivante.
  maintien_sans_paiement?: string;
};

export type ProfilSecondaireFrancTireur = {
  nom: string;
  stats: Stats;
  equipement?: string[];
  regles_speciales?: SpecialRule[];
};

export type FrancTireurCatalog = {
  id: string;
  nom: string;
  nom_original?: string;
  page_source: number;
  recrutement: {
    cout: number | null;
    notation?: string;
  };
  entretien: EntretienFrancTireur;
  valeur: number;
  employeurs: {
    bande_ids: string[];
    texte: string;
  };
  stats: Stats;
  equipement: string[];
  acces_competences: SkillCategory[];
  regles_speciales: SpecialRule[];
  competences_speciales?: CompetenceSpeciale[];
  profils_secondaires?: ProfilSecondaireFrancTireur[];
  groupe_caracteristiques?: string;
  tags?: ('elfe' | 'nain' | 'malefique' | 'peau_verte' | 'halfling')[];
  gagne_experience?: boolean;
  // Le Ninja n'est engagé que pour une mission et quitte automatiquement la
  // bande à la fin de celle-ci.
  depart_apres_bataille?: boolean;
  incompatibles?: string[];
  // Construction du Goliath d'Os : nécessite une Liche et lui retire 1D3 PV
  // de départ (minimum 1).
  sacrifice_liche?: boolean;
};

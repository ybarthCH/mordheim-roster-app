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
  magie?: {
    categorie: 'magie_mineure';
    sorts_depart: number;
  };
  tags?: ('elfe' | 'nain' | 'malefique' | 'peau_verte' | 'halfling')[];
  gagne_experience?: boolean;
  // Le Ninja n'est engagé que pour une mission et quitte automatiquement la
  // bande à la fin de celle-ci.
  depart_apres_bataille?: boolean;
  incompatibles?: string[];
  // Construction du Goliath d'Os : nécessite une Liche et lui retire 1D3 PV
  // de départ (minimum 1).
  sacrifice_liche?: boolean;
  // Personnage spécial (chapitre Dramatis Personae) plutôt que franc-tireur
  // ordinaire : recruté via une recherche post-bataille dédiée (voir
  // dramatisPersonae.ts) plutôt que directement depuis l'écran de
  // recrutement, jamais renommable, et ne peut être obtenu qu'une seule fois
  // par bande même après sa mort. Partage sinon toute la mécanique des
  // francs-tireurs (entretien, valeur de bande, XP figée à zéro).
  est_dramatis_personae?: boolean;
  // Compétences déjà acquises dès le recrutement (ids de skills.json) — un
  // Dramatis Personae ne gagnant jamais d'expérience, ses compétences fixes
  // décrites dans son profil doivent être pré-inscrites sur la fiche plutôt
  // que choisies via le tableau d'avancement, qu'il ne consultera jamais.
  competences_departs?: string[];
  // Sorts/prières déjà connus dès le recrutement (noms exacts du domaine de
  // la bande, ex : les six prières de Sigmar de Bertha Bestraufrung) — même
  // logique que competences_departs, appliquée à Member.sorts_connus.
  sorts_departs?: string[];
  // Personnage utilisant le domaine de sorts propre de la bande qui le
  // recrute (ex : les prières de Sigmar) plutôt qu'un domaine externe fixe
  // comme la Magie mineure du Mage franc-tireur (voir Profile.magie).
  sorts_domaine_bande?: boolean;
  // Regroupe plusieurs profils de Dramatis Personae qui ne sont en réalité
  // qu'un seul et même personnage sous des identités différentes (ex : les
  // 3 personæ de Luthor Wulfenbaum) : dès qu'une bande a recruté (vivant ou
  // mort) l'un des profils partageant cette valeur, les autres deviennent
  // indisponibles pour elle — voir dramatisPersonaeDisponibles.
  groupe_exclusif?: string;
};

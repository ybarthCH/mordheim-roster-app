// Modèle de données du catalogue (référence, en lecture seule côté joueur)

export type Stats = {
  M: number;
  CC: number;
  CT: number;
  F: number;
  E: number;
  PV: number;
  I: number;
  A: number;
  Cd: number;
};

export const STAT_KEYS: (keyof Stats)[] = ['M', 'CC', 'CT', 'F', 'E', 'PV', 'I', 'A', 'Cd'];

export type SkillCategory = 'combat' | 'tir' | 'force' | 'academique' | 'vitesse' | 'equitation' | 'special';

export const SKILL_CATEGORIES: { id: SkillCategory; label: string }[] = [
  { id: 'combat', label: 'Combat' },
  { id: 'tir', label: 'Tir' },
  { id: 'force', label: 'Force' },
  { id: 'academique', label: 'Académique' },
  { id: 'vitesse', label: 'Vitesse' },
  { id: 'equitation', label: 'Équitation' },
  { id: 'special', label: 'Spécial' },
];

export type SpecialRule = {
  nom: string;
  texte: string;
  // Précision/dérogation à la règle (ex : "Ne s'applique pas aux Délateurs").
  // Affichée telle quelle en complément du texte, purement informative.
  exception?: string;
};

// Forme minimale dupliquée de Skill (types/gameData.ts) pour éviter un
// import circulaire catalog.ts <-> gameData.ts.
export type CompetenceSpeciale = {
  id: string;
  nom: string;
  texte: string;
  // Restreint la compétence à un rôle précis (ex : "Chef uniquement").
  // Informatif seulement — l'app ne filtre pas la liste en fonction de ça.
  reserve_a?: string;
};

export type Profile = {
  id: string;
  nom: string;
  // 'animal' : suivi comme un groupe d'hommes de main (statut simplifié,
  // compteur Hors de combat) mais ne gagne jamais d'expérience.
  type: 'heros' | 'homme_de_main' | 'animal';
  unique?: boolean;
  // Minimum requis dans la composition de bande (ex : chef obligatoire).
  // Informatif seulement — n'empêche pas de recruter/jouer sans.
  min?: number;
  max?: number | null;
  cout: number | null;
  // Notation de dés affichée quand `cout` est variable (donc null, ex :
  // "25+2D6" pour un chien de guerre) — le montant réel est saisi à la main
  // au recrutement, comme pour un objet non `cout_fixe`.
  cout_notation?: string;
  // Score "Rare N" (règles de disponibilité) : un jet de disponibilité est
  // requis en jeu avant de pouvoir recruter ce profil. Purement informatif,
  // comme pour les objets — n'empêche pas de recruter/jouer.
  rarete?: string;
  stats: Stats | null;
  acces_competences: SkillCategory[];
  acces_competences_a_verifier?: boolean;
  // Clés du catalogue `WarbandCatalog.equipement` accessibles à ce profil
  // pour l'achat en jeu. Non renseigné = accès à toutes les listes de la
  // bande (repli par défaut, tant que ce champ n'est pas encore rempli
  // partout).
  acces_equipement?: string[];
  xp_depart?: number;
  peut_lancer_sorts?: boolean;
  categorie_magie?: string;
  // Chef de bande selon les règles (un seul par catalogue) : badge visuel +
  // bonus de +1 XP automatique en cas de victoire.
  est_leader?: boolean;
  // Règles spéciales propres à ce profil (en plus de celles de la bande).
  regles_speciales?: SpecialRule[];
  // Clé vers CARACTERISTIQUES_MAX (src/data/caracteristiquesMax.ts) : plafond
  // d'avancement applicable à ce profil. Absent seulement pour les profils
  // de type 'animal' (n'avancent jamais, voir avancesDues).
  groupe_caracteristiques?: string;
};

// Contraintes de composition de bande. Purement informatif (affiché comme
// les violations de max existantes) — n'empêche pas de recruter/jouer.
export type Composition = {
  effectif_min?: number;
  effectif_max?: number;
  cout_max_constitution?: number;
};

// Référence vers un objet de la base commune (src/data/items/*.json, extraite
// du compendium "Place du Marché") — nom, catégorie, stats et règles se
// résolvent via item_id, seul le prix (souvent propre à la bande) reste
// dupliqué ici. Remplace l'ancien schéma en texte libre (nom/cout dupliqués)
// pour ne plus dépendre d'une correspondance de nom fragile entre les deux
// sources.
export type EquipementRef = {
  item_id: string;
  cout: number | string;
  note?: string;
  restriction?: string;
};

// Une liste d'équipement nommée (ex : "repurgateurs", "flagellants"...) —
// affichée telle quelle en référence libre, sans automatisation d'achat.
export type EquipementListe = {
  armes_cac?: EquipementRef[];
  armes_tir?: EquipementRef[];
  armures?: EquipementRef[];
  divers?: EquipementRef[];
};

export type EquipementSpecialRef = {
  item_id: string;
  cout: number | string;
  disponibilite?: string;
  // Restreint l'objet à certains profils (ex : mutations réservées à
  // l'Impur). Absent = accessible à tous les profils de la bande.
  profils?: string[];
  // Restreint l'objet aux membres possédant l'une de ces compétences (ex :
  // mutations réservées aux héros ayant pris la compétence spéciale
  // « Mutant »). Absent = pas de restriction par compétence.
  competences?: string[];
  // Objets partageant la même clé : le prix double dès que le membre
  // possède déjà l'un d'entre eux (ex : Bénédictions de Nurgle — la
  // première coûte le prix normal, toute suivante coûte le double).
  groupe_prix?: string;
};

export type MagieSort = {
  resultat: number | string;
  nom: string;
  difficulte: number | string;
  texte: string;
  note?: string;
};

// Système de magie/prières propre à la bande — affiché en référence libre
// sur le roster, sans moteur de jet automatisé.
export type Magie = {
  nom: string;
  type: string;
  de: string;
  utilisateurs: string[];
  note?: string;
  sorts: MagieSort[];
};

export type WarbandCatalog = {
  id: string;
  nom: string;
  grade: string;
  source: string;
  regles_speciales: SpecialRule[];
  profils: Profile[];
  // Compétences "Spéciale" propres à cette bande (contenu différent par
  // bande, accessible seulement à certains profils via acces_competences).
  // Vide initialement, à remplir bande par bande.
  competences_speciales: CompetenceSpeciale[];
  composition?: Composition;
  // Références libres, affichées en bas du roster sans automatisation.
  equipement?: Record<string, EquipementListe>;
  equipement_special?: EquipementSpecialRef[];
  magie?: Magie;
  // Bande à progression ralentie (ex : Mangeurs d'Hommes) : chaque case de
  // la grille XP vaut 2 points d'XP réels au lieu d'1 — la case se remplit
  // à moitié au premier point gagné, complètement au second.
  xp_demi?: boolean;
};

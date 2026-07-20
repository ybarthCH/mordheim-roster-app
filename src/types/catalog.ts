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

export type SkillCategory = 'combat' | 'tir' | 'force' | 'academique' | 'vitesse' | 'special';

export const SKILL_CATEGORIES: { id: SkillCategory; label: string }[] = [
  { id: 'combat', label: 'Combat' },
  { id: 'tir', label: 'Tir' },
  { id: 'force', label: 'Force' },
  { id: 'academique', label: 'Académique' },
  { id: 'vitesse', label: 'Vitesse' },
  { id: 'special', label: 'Spécial' },
];

export type SpecialRule = {
  nom: string;
  texte: string;
};

export type Profile = {
  id: string;
  nom: string;
  type: 'heros' | 'homme_de_main';
  unique?: boolean;
  max?: number | null;
  cout: number | null;
  stats: Stats | null;
  acces_competences: SkillCategory[];
  acces_competences_a_verifier?: boolean;
  xp_depart?: number;
  peut_lancer_sorts?: boolean;
  categorie_magie?: string;
};

export type WarbandCatalog = {
  id: string;
  nom: string;
  grade: string;
  source: string;
  regles_speciales: SpecialRule[];
  profils: Profile[];
};

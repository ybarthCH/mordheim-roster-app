import type { SkillCategory, Stats } from './catalog';

export type Skill = {
  id: string;
  nom: string;
  texte: string;
};

export type SkillsData = Record<SkillCategory, Skill[]>;

export type InjuryEntry = {
  min: number;
  max: number;
  resultat: string;
  effet: string;
  mort?: boolean;
  horsDeCombatDefinitif?: boolean;
  modificateur?: { stat: keyof Stats; delta: number };
};

// Table d'avancement — deux versions distinctes (héros / hommes de main),
// chacune avec ses propres résultats possibles sur 2D6.
export type AdvanceEntry =
  | { min: number; max: number; type: 'competence'; label: string }
  | { min: number; max: number; type: 'caracteristique_fixe'; label: string; stat: keyof Stats }
  | {
      min: number;
      max: number;
      type: 'caracteristique_choix';
      label: string;
      // Absent : choix libre du joueur entre les deux options (ex : CC/CT
      // héros, CT/CC hommes de main). Présent : la répartition est en
      // réalité déterminée par un jet physique sur cette notation (ex :
      // "1D6"), reporté sur `options[].plage` — le joueur ne choisit pas,
      // il indique le résultat de son jet.
      hasard?: { notation: string };
      options: { stat: keyof Stats; label: string; plage?: string }[];
    }
  | { min: number; max: number; type: 'promotion'; label: string };

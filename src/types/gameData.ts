import type { SkillCategory } from './catalog';

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
  modificateur?: { stat: 'M' | 'CC' | 'CT' | 'F' | 'E' | 'PV' | 'I' | 'A' | 'Cd'; delta: number };
};

export type AdvanceEntry = {
  min: number;
  max: number;
  type: 'competence' | 'caracteristique' | 'choix';
  label: string;
};

export type CaracAleatoireEntry = {
  min: number;
  max: number;
  stat: 'M' | 'CC' | 'CT' | 'F' | 'E' | 'PV' | 'I' | 'A' | 'Cd';
  delta: number;
};

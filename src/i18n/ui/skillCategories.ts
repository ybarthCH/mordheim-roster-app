import type { UiDictionary } from './types';

// Les 7 catégories de compétences (types/catalog.ts, SKILL_CATEGORIES) sont
// une énumération fixe, indépendante de toute bande — contrairement au
// contenu des catalogues, elles n'ont pas besoin du mécanisme translateX,
// une simple clé statique par catégorie suffit.
export const skillCategories: UiDictionary = {
  'skillCategory.combat': { fr: 'Combat', en: 'Combat' },
  'skillCategory.tir': { fr: 'Tir', en: 'Shooting' },
  'skillCategory.force': { fr: 'Force', en: 'Strength' },
  'skillCategory.academique': { fr: 'Érudition', en: 'Academic' },
  'skillCategory.vitesse': { fr: 'Vitesse', en: 'Speed' },
  'skillCategory.equitation': { fr: 'Équitation', en: 'Riding' },
  'skillCategory.special': { fr: 'Spécial', en: 'Special' },
};

import type { UiDictionary } from './types';

// Noms complets des 9 caractéristiques (types/catalog.ts, STAT_KEYS) —
// utilisés là où l'abrégé (M, CC, CT...) ne suffit pas, ex : la table
// d'avancement papier (data/table_avancement_*.json) dont les libellés
// français ("+1 Force ou +1 Attaques") sont reconstruits à l'affichage à
// partir du champ `stat` plutôt que traduits mot à mot.
export const statFullNames: UiDictionary = {
  'statFullName.M': { fr: 'Mouvement', en: 'Movement' },
  'statFullName.CC': { fr: 'Capacité de Combat', en: 'Weapon Skill' },
  'statFullName.CT': { fr: 'Capacité de Tir', en: 'Ballistic Skill' },
  'statFullName.F': { fr: 'Force', en: 'Strength' },
  'statFullName.E': { fr: 'Endurance', en: 'Toughness' },
  'statFullName.PV': { fr: 'Points de Vie', en: 'Wounds' },
  'statFullName.I': { fr: 'Initiative', en: 'Initiative' },
  'statFullName.A': { fr: 'Attaques', en: 'Attacks' },
  'statFullName.Cd': { fr: 'Commandement', en: 'Leadership' },
};

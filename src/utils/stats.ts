import type { Stats } from '../types/catalog';
import type { Language } from '../state/useLanguage';

// Abréviations anglaises officielles des caractéristiques (Warhammer/Mordheim) —
// les clés internes (M, CC, CT, F, E, PV, I, A, Cd) restent françaises partout
// ailleurs (données, calculs), seul l'affichage en change.
const STAT_LABELS_EN: Record<keyof Stats, string> = {
  M: 'M',
  CC: 'WS',
  CT: 'BS',
  F: 'S',
  E: 'T',
  PV: 'W',
  I: 'I',
  A: 'A',
  Cd: 'Ld',
};

export function libelleCaracteristique(k: keyof Stats, language: Language): string {
  return language === 'en' ? STAT_LABELS_EN[k] : k;
}

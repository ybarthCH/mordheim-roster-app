import type { Stats } from '../types/catalog';
import type { Member } from '../types/roster';
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

// Points de vie restants d'une figurine (voir Member.pv_perdus) : jamais
// négatifs ni supérieurs au maximum, même si le profil a changé entre-temps
// (ex : une caractéristique modifiée réduit PV en dessous des pertes déjà
// enregistrées).
export function pvRestant(m: Member): number {
  const max = m.stats_actuels.PV;
  const perdus = Math.min(Math.max(m.pv_perdus ?? 0, 0), max);
  return max - perdus;
}

// Une figurine dont PV n'est pas encore une valeur fixe (notation de dés non
// résolue, voir Member.stats_variables) n'a pas de maximum connu — le cycle
// tactile n'a alors pas de sens. Idem pour un groupe simplifié (plusieurs
// figurines partagent la même ligne, déjà suivies via hors_combat) ou une
// figurine déjà marquée Morte (statut figé, modifiable depuis sa fiche).
export function pvEstCliquable(m: Member, groupeSimplifie: boolean): boolean {
  return !groupeSimplifie && m.statut !== 'mort' && m.stats_variables?.PV === undefined;
}

// Valeur affichée dans la case PV : la notation de dés non résolue si le
// profil en a une, sinon le maximum tel quel à pleine santé, sinon
// "restant/max" une fois la figurine touchée.
export function pvAffiche(m: Member): string {
  if (m.stats_variables?.PV !== undefined) return m.stats_variables.PV;
  const max = m.stats_actuels.PV;
  const restant = pvRestant(m);
  return restant === max ? String(max) : `${restant}/${max}`;
}

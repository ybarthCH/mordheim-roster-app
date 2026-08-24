import type { Stats } from '../types/catalog';
import type { Member, Statut } from '../types/roster';
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
// "restant/max" une fois la figurine touchée. Une figurine Morte affiche
// toujours le maximum brut, quels que soient les points perdus enregistrés
// avant sa mort — sa case n'est plus cliquable (voir pvEstCliquable) et ne
// doit pas laisser croire qu'elle est encore "à terre à 0 PV".
export function pvAffiche(m: Member): string {
  if (m.stats_variables?.PV !== undefined) return m.stats_variables.PV;
  const max = m.stats_actuels.PV;
  if (m.statut === 'mort') return String(max);
  const restant = pvRestant(m);
  return restant === max ? String(max) : `${restant}/${max}`;
}

// Points de vie perdus à synchroniser avec un changement de statut décidé
// par un mécanisme AUTRE que le cycle tactile PV lui-même (ancien bouton
// Hors de combat, boutons de statut de la fiche personnage, résolution de
// l'assistant post-bataille) — sans cette resynchronisation, ces chemins ne
// touchent jamais pv_perdus et le roster affiche par exemple "Actif" avec la
// case PV encore bloquée à "0/1" après une convalescence. Un passage à Actif
// efface les pertes (pleine santé) ; un passage à Hors de combat les porte au
// maximum (case à "0/max"). Mort et Blessé ne changent rien : voir
// pvAffiche pour Mort, et basculerPointsDeVie (RosterScreen) qui protège déjà
// Blessé d'un écrasement par le cycle tactile lui-même.
export function pvPerdusPourStatut(m: Member, nouveauStatut: Statut): number | undefined {
  if (nouveauStatut === 'actif') return undefined;
  if (nouveauStatut === 'hors_de_combat') return m.stats_actuels.PV || undefined;
  return m.pv_perdus;
}

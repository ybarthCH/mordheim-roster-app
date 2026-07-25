import type { Member, SeriousInjuryRecord } from '../types/roster';
import type { Stats } from '../types/catalog';

const LONGUEUR_NOM_COURT = 30;

// Titre court d'une blessure grave pour l'affichage condensé (roster global).
// Les enregistrements créés avant l'introduction du champ `nom` (ou saisis à
// la main sous l'ancien format libre resultat/effet) retombent sur un extrait
// tronqué de la description.
export function nomCourtBlessure(b: SeriousInjuryRecord): string {
  if (b.nom) return b.nom;
  const legacy = b as unknown as { resultat?: string };
  if (legacy.resultat) return legacy.resultat;
  const texte = b.description || '(sans description)';
  return texte.length > LONGUEUR_NOM_COURT ? `${texte.slice(0, LONGUEUR_NOM_COURT).trimEnd()}…` : texte;
}

// Description complète d'une blessure grave pour l'affichage détaillé
// (fiche personnage). Compatibilité avec d'anciens enregistrements
// (roll/resultat/effet) sauvegardés avant le passage de la table déroulante
// à la saisie libre.
export function injuryLabel(b: SeriousInjuryRecord): string {
  if (b.description) return b.description;
  const legacy = b as unknown as { resultat?: string; effet?: string };
  return [legacy.resultat, legacy.effet].filter(Boolean).join(' — ') || '(sans description)';
}

// Annule sur le membre les effets encore actifs d'une blessure grave (stats
// et notes ajoutées), avant de la retirer de l'historique. Un effet déjà
// traité par le docteur (`traitee`) n'a plus d'impact sur les stats
// actuelles — ne pas l'annuler une seconde fois. Les enregistrements créés
// avant l'introduction des effets structurés (`effets` absent) n'ont pas de
// delta fiable à annuler : seule l'entrée d'historique est alors retirée.
export function annulerEffetsBlessure(
  membre: Member,
  blessure: SeriousInjuryRecord
): Pick<Member, 'stats_actuels' | 'notes'> {
  const effetsActifs = (blessure.effets ?? []).filter((e) => !e.traitee);
  if (effetsActifs.length === 0) {
    return { stats_actuels: membre.stats_actuels, notes: membre.notes };
  }
  const stats_actuels = { ...membre.stats_actuels };
  for (const effet of effetsActifs) {
    for (const [cle, delta] of Object.entries(effet.stats_delta)) {
      const stat = cle as keyof Stats;
      stats_actuels[stat] -= delta ?? 0;
    }
  }
  const notesARetirer = new Set(effetsActifs.flatMap((e) => e.notes_ajoutees).map((n) => n.trim()));
  const notes = membre.notes
    .split('\n')
    .filter((ligne) => !notesARetirer.has(ligne.trim()))
    .join('\n')
    .trim();
  return { stats_actuels, notes };
}

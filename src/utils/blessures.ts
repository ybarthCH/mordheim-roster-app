import type { Member, SeriousInjuryRecord } from '../types/roster';
import type { Stats } from '../types/catalog';
import type { Language } from '../state/useLanguage';
import { trouverBlessure } from '../data/blessuresGraves';
import { translateBlessure } from '../i18n/data/blessuresGraves';

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

// `SeriousInjuryRecord.nom`/`description` sont un texte français pré-généré
// à la création (voir BlessureGraveWizard), pas une référence vers la donnée
// canonique — ils ne se re-traduisent donc pas tout seuls si la langue change
// ensuite. Repli best-effort : ne s'applique que si la blessure est un effet
// unique, non personnalisé (son nom correspond exactement à l'entrée
// canonique désignée par `resultat_id`) — sinon on retombe sur le texte
// français d'origine plutôt que de risquer un mélange incohérent (une
// blessure multiple ou un texte édité à la main n'existe qu'en français).
function effetSeulNonPersonnalise(b: SeriousInjuryRecord) {
  if (b.effets?.length !== 1) return undefined;
  const [effet] = b.effets;
  const canonique = trouverBlessure(effet.resultat_id);
  if (!canonique || canonique.nom !== effet.nom) return undefined;
  return canonique;
}

/** Variante de nomCourtBlessure qui re-traduit le titre court quand c'est
 * possible sans risque (voir effetSeulNonPersonnalise) — sinon identique à
 * nomCourtBlessure. */
export function nomCourtBlessureAffiche(b: SeriousInjuryRecord, language: Language): string {
  const original = nomCourtBlessure(b);
  const canonique = effetSeulNonPersonnalise(b);
  if (!canonique || canonique.nom !== original) return original;
  return translateBlessure(canonique, language).nom;
}

/** Variante de injuryLabel qui re-traduit la description complète quand
 * c'est possible sans risque (voir effetSeulNonPersonnalise) — sinon
 * identique à injuryLabel. */
export function injuryLabelAffiche(b: SeriousInjuryRecord, language: Language): string {
  const original = injuryLabel(b);
  const canonique = effetSeulNonPersonnalise(b);
  if (!canonique) return original;
  const texteCanonique = `${canonique.nom} (${canonique.code}) — ${canonique.texte}`;
  if (!original.startsWith(texteCanonique)) return original;
  const traduit = translateBlessure(canonique, language);
  return `${traduit.nom} (${canonique.code}) — ${traduit.texte}${original.slice(texteCanonique.length)}`;
}

export type ApplicationDeltaStats = {
  stats_actuels: Stats;
  notes: string;
  // Clés touchées par CE delta (valeurs non nulles seulement) — à fusionner
  // dans `stats_modifiees` côté appelant, qui connaît le reste de l'historique.
  statsTouchees: (keyof Stats)[];
};

// Primitive bas niveau partagée par tout ce qui inflige un effet mesurable
// à un membre (blessure grave, docteur...) : applique un delta de
// caractéristiques et ajoute des notes (dédupliquées contre les lignes déjà
// présentes) à sa suite. Ne connaît rien d'autre du membre (équipement, XP,
// statut...) — chaque appelant gère ces champs-là lui-même.
export function appliquerDeltaStats(
  statsActuels: Stats,
  notes: string,
  delta: Partial<Record<keyof Stats, number>>,
  notesAjoutees: string[]
): ApplicationDeltaStats {
  const stats_actuels = { ...statsActuels };
  const statsTouchees: (keyof Stats)[] = [];
  for (const [cle, valeur] of Object.entries(delta)) {
    if (!valeur) continue;
    const stat = cle as keyof Stats;
    stats_actuels[stat] += valeur;
    statsTouchees.push(stat);
  }
  const existantes = new Set(
    notes
      .split('\n')
      .map((ligne) => ligne.trim())
      .filter(Boolean)
  );
  const nouvelles = notesAjoutees.filter((note) => !existantes.has(note.trim()));
  const notesMaj = [notes.trim(), ...nouvelles].filter(Boolean).join('\n');
  return { stats_actuels, notes: notesMaj, statsTouchees };
}

// Inverse d'appliquerDeltaStats : annule un delta déjà appliqué et retire
// les lignes de notes qu'il avait ajoutées.
export function annulerDeltaStats(
  statsActuels: Stats,
  notes: string,
  delta: Partial<Record<keyof Stats, number>>,
  notesAjoutees: string[]
): Pick<ApplicationDeltaStats, 'stats_actuels' | 'notes'> {
  const stats_actuels = { ...statsActuels };
  for (const [cle, valeur] of Object.entries(delta)) {
    const stat = cle as keyof Stats;
    stats_actuels[stat] -= valeur ?? 0;
  }
  const aRetirer = new Set(notesAjoutees.map((note) => note.trim()));
  const notesMaj = notes
    .split('\n')
    .filter((ligne) => !aRetirer.has(ligne.trim()))
    .join('\n')
    .trim();
  return { stats_actuels, notes: notesMaj };
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
  let stats_actuels = membre.stats_actuels;
  let notes = membre.notes;
  for (const effet of effetsActifs) {
    const resultat = annulerDeltaStats(stats_actuels, notes, effet.stats_delta, effet.notes_ajoutees);
    stats_actuels = resultat.stats_actuels;
    notes = resultat.notes;
  }
  return { stats_actuels, notes };
}

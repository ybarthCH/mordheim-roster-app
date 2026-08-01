import type { Member, SeriousInjuryRecord } from '../types/roster';
import type { Stats } from '../types/catalog';
import type { Language } from '../state/useLanguage';
import { trouverBlessure } from '../data/blessuresGraves';
import { translateBlessure } from '../i18n/data/blessuresGraves';
import { uiDictionary } from '../i18n/ui';

const LONGUEUR_NOM_COURT = 30;

// Équivalent autonome de useLanguage().t() — utilisable ici car ce module
// n'est pas un composant (pas d'accès au contexte React), mais la donnée
// (uiDictionary) et la logique d'interpolation sont les mêmes.
function traduireCle(key: string, language: Language, params?: Record<string, string | number>): string {
  const entry = uiDictionary[key];
  const raw = entry ? (entry[language] ?? entry.fr) : key;
  if (!params) return raw;
  return raw.replace(/\{(\w+)\}/g, (match, token) => (token in params ? String(params[token]) : match));
}

// Issues spéciales "Gladiateur"/"Capturé" construites par BlessureGraveWizard
// (voir les constantes NOM_GLADIATEUR_VICTOIRE / NOM_CAPTURE_PERDU /
// NOM_CAPTURE_RANCON là-bas) : leur texte est un français fixe hors de la
// table canonique BLESSURES_GRAVES, donc jamais reconnu par
// effetSeulNonPersonnalise (nom personnalisé). Reconnues ici par
// `resultat_id` (stable) + nom exact pour distinguer l'issue précise parmi
// celles qui partagent le même résultat canonique de départ.
const PREFIXE_DEFAITE_GLADIATEUR_FR = 'Défaite face à un gladiateur dans les fosses de combat — ';

function effetSpecialAffiche(
  b: BlessureAffichable,
  language: Language
): { nom: string; texte: string; texteFrancaisAttendu: string } | undefined {
  if (b.effets?.length !== 1) return undefined;
  const [effet] = b.effets;
  if (effet.resultat_id === 'gladiateur' && effet.nom === 'Gladiateur (victoire)') {
    return {
      nom: traduireCle('blessureGraveWizard.gladiatorVictoryNom', language),
      texte: traduireCle('blessureGraveWizard.gladiatorVictoryTexte', language),
      texteFrancaisAttendu:
        "Le guerrier remporte son combat dans les fosses du Repaire des Coupe-Jarrets : il empoche 50 pièces d'or, gagne 2 points d'Expérience et rejoint sa bande avec tout son équipement intact.",
    };
  }
  if (effet.resultat_id === 'capture' && effet.nom === 'Capturé — héros perdu') {
    return {
      nom: traduireCle('blessureGraveWizard.capturedLostNom', language),
      texte: traduireCle('blessureGraveWizard.capturedLostTexte', language),
      texteFrancaisAttendu:
        "Le prisonnier ne revient pas : vendu à des marchands d'esclaves, exécuté ou transformé par ses ravisseurs, il quitte définitivement la bande. Son équipement reste aux mains de ses ravisseurs.",
    };
  }
  if (effet.resultat_id === 'capture' && effet.nom === 'Capturé — libéré contre rançon') {
    const match = b.description.match(/rançon de (\d+) po/);
    const montant = match ? match[1] : '0';
    return {
      nom: traduireCle('blessureGraveWizard.capturedRansomNom', language),
      texte: traduireCle('blessureGraveWizard.capturedRansomTexte', language, { montant }),
      texteFrancaisAttendu: `Le prisonnier est libéré contre une rançon de ${montant} po, payée par la bande. Il conserve tout son équipement et rejoint aussitôt la bande.`,
    };
  }
  return undefined;
}

// Sous-ensemble commun à SeriousInjuryRecord et au brouillon éphémère du
// post-battle (BlessureDraft, voir PostBatailleScreen) — les deux portent le
// même triplet nom/description/effets, seul ce qui est nécessaire ici pour
// résoudre l'affichage (y compris sa re-traduction, voir *Affiche ci-dessous).
type BlessureAffichable = Pick<SeriousInjuryRecord, 'nom' | 'description' | 'effets'>;

// Titre court d'une blessure grave pour l'affichage condensé (roster global).
// Les enregistrements créés avant l'introduction du champ `nom` (ou saisis à
// la main sous l'ancien format libre resultat/effet) retombent sur un extrait
// tronqué de la description.
export function nomCourtBlessure(b: BlessureAffichable): string {
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
export function injuryLabel(b: BlessureAffichable): string {
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
function effetSeulNonPersonnalise(b: BlessureAffichable) {
  if (b.effets?.length !== 1) return undefined;
  const [effet] = b.effets;
  const canonique = trouverBlessure(effet.resultat_id);
  if (!canonique || canonique.nom !== effet.nom) return undefined;
  return canonique;
}

/** Variante de nomCourtBlessure qui re-traduit le titre court quand c'est
 * possible sans risque (voir effetSeulNonPersonnalise / effetSpecialAffiche)
 * — sinon identique à nomCourtBlessure. */
export function nomCourtBlessureAffiche(b: BlessureAffichable, language: Language): string {
  const original = nomCourtBlessure(b);
  const special = effetSpecialAffiche(b, language);
  if (special) return special.nom;
  const canonique = effetSeulNonPersonnalise(b);
  if (!canonique || canonique.nom !== original) return original;
  return translateBlessure(canonique, language).nom;
}

/** Variante de injuryLabel qui re-traduit la description complète quand
 * c'est possible sans risque (voir effetSeulNonPersonnalise / *
 * effetSpecialAffiche) — sinon identique à injuryLabel. Un résultat "défaite
 * face à un gladiateur" relancé (voir prefixeGladiateur dans
 * BlessureGraveWizard) préfixe le texte français d'une mention fixe avant le
 * résultat effectivement tiré : traitée séparément puis recombinée, pour que
 * la relance sous-jacente (qu'elle soit canonique ou elle-même spéciale)
 * reste traduisible normalement. */
export function injuryLabelAffiche(b: BlessureAffichable, language: Language): string {
  const original = injuryLabel(b);
  if (original.startsWith(PREFIXE_DEFAITE_GLADIATEUR_FR)) {
    const reste = original.slice(PREFIXE_DEFAITE_GLADIATEUR_FR.length);
    const resteAffiche = injuryLabelAffiche({ ...b, description: reste }, language);
    if (resteAffiche === reste) return original;
    return `${traduireCle('blessureGraveWizard.gladiatorDefeatPrefix', language)}${resteAffiche}`;
  }
  const special = effetSpecialAffiche(b, language);
  if (special) {
    const code = trouverBlessure(b.effets![0].resultat_id)?.code ?? '';
    const texteCanonique = `${b.nom} (${code}) — ${special.texteFrancaisAttendu}`;
    if (!original.startsWith(texteCanonique)) return original;
    return `${special.nom} (${code}) — ${special.texte}${original.slice(texteCanonique.length)}`;
  }
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

import type { Member, SeriousInjuryEffect, SeriousInjuryRecord } from '../types/roster';
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
// table canonique BLESSURES_GRAVES, donc jamais reconnu comme un résultat
// canonique standard. Reconnues ici par `resultat_id` (stable) + nom exact
// pour distinguer l'issue précise parmi celles qui partagent le même
// résultat canonique de départ.
const PREFIXE_DEFAITE_GLADIATEUR_FR = 'Défaite face à un gladiateur dans les fosses de combat — ';

function issueSpecialeAffichee(
  effet: SeriousInjuryEffect,
  language: Language
): { nom: string; texte: (segment: string) => string; texteFrancaisAttendu: (segment: string) => string } | undefined {
  if (effet.resultat_id === 'gladiateur' && effet.nom === 'Gladiateur (victoire)') {
    const texteFr =
      "Le guerrier remporte son combat dans les fosses du Repaire des Coupe-Jarrets : il empoche 50 pièces d'or, gagne 2 points d'Expérience et rejoint sa bande avec tout son équipement intact.";
    return {
      nom: traduireCle('blessureGraveWizard.gladiatorVictoryNom', language),
      texte: () => traduireCle('blessureGraveWizard.gladiatorVictoryTexte', language),
      texteFrancaisAttendu: () => texteFr,
    };
  }
  if (effet.resultat_id === 'capture' && effet.nom === 'Capturé — héros perdu') {
    const texteFr =
      "Le prisonnier ne revient pas : vendu à des marchands d'esclaves, exécuté ou transformé par ses ravisseurs, il quitte définitivement la bande. Son équipement reste aux mains de ses ravisseurs.";
    return {
      nom: traduireCle('blessureGraveWizard.capturedLostNom', language),
      texte: () => traduireCle('blessureGraveWizard.capturedLostTexte', language),
      texteFrancaisAttendu: () => texteFr,
    };
  }
  if (effet.resultat_id === 'capture' && effet.nom === 'Capturé — libéré contre rançon') {
    const montantDe = (segment: string) => segment.match(/rançon de (\d+) po/)?.[1] ?? '0';
    return {
      nom: traduireCle('blessureGraveWizard.capturedRansomNom', language),
      texte: (segment) => traduireCle('blessureGraveWizard.capturedRansomTexte', language, { montant: montantDe(segment) }),
      texteFrancaisAttendu: (segment) =>
        `Le prisonnier est libéré contre une rançon de ${montantDe(segment)} po, payée par la bande. Il conserve tout son équipement et rejoint aussitôt la bande.`,
    };
  }
  return undefined;
}

/** Titre affiché d'un effet isolé (issue spéciale ou entrée canonique de la
 * table) — inchangé (nom français d'origine) si non reconnu. */
function nomEffetAffiche(effet: SeriousInjuryEffect, language: Language): string {
  const special = issueSpecialeAffichee(effet, language);
  if (special) return special.nom;
  const canonique = trouverBlessure(effet.resultat_id);
  if (!canonique || canonique.nom !== effet.nom) return effet.nom;
  return translateBlessure(canonique, language).nom;
}

/** Traduit un unique segment de texte français correspondant à un effet
 * donné (résultat canonique — éventuellement suivi d'un suffixe sous-jet ou
 * durée D3 — ou une issue spéciale Gladiateur/Capturé), utilisé aussi bien
 * pour la description complète d'une blessure à effet unique que pour
 * chacune des lignes numérotées d'une "Blessures multiples" (voir
 * texteMultiplesAffiche). Retourne `segment` inchangé si son contenu ne
 * correspond pas exactement à ce qui serait construit pour cet effet — un
 * texte édité à la main n'existe alors qu'en français, mieux vaut ne pas
 * risquer un mélange incohérent. */
function segmentAffiche(effet: SeriousInjuryEffect, segment: string, language: Language): string {
  const special = issueSpecialeAffichee(effet, language);
  if (special) {
    const code = trouverBlessure(effet.resultat_id)?.code ?? '';
    const attendu = `${effet.nom} (${code}) — ${special.texteFrancaisAttendu(segment)}`;
    if (!segment.startsWith(attendu)) return segment;
    return `${special.nom} (${code}) — ${special.texte(segment)}${segment.slice(attendu.length)}`;
  }
  const canonique = trouverBlessure(effet.resultat_id);
  if (!canonique || canonique.nom !== effet.nom) return segment;
  const base = `${canonique.nom} (${canonique.code}) — ${canonique.texte}`;
  if (!segment.startsWith(base)) return segment;
  const traduit = translateBlessure(canonique, language);
  let reste = segment.slice(base.length);
  if (canonique.sousJet) {
    for (let i = 0; i < canonique.sousJet.options.length; i++) {
      const option = canonique.sousJet.options[i];
      const suffixeFr = ` Résultat du sous-jet (${option.label}) : ${option.texte}`;
      if (reste.startsWith(suffixeFr)) {
        const optionTraduite = traduit.sousJet?.options[i] ?? option;
        const prefixe = traduireCle('blessureGraveWizard.subRollResultPrefix', language);
        reste = ` ${prefixe} (${optionTraduite.label}) : ${optionTraduite.texte}${reste.slice(suffixeFr.length)}`;
        break;
      }
    }
  }
  const dureeMatch = reste.match(/^ Le guerrier manque (\d+) prochaine\(s\) partie\(s\)\./);
  if (dureeMatch) {
    const suffixe = traduireCle('blessureGraveWizard.missesNextGamesSuffix', language, { n: dureeMatch[1] });
    reste = ` ${suffixe}${reste.slice(dureeMatch[0].length)}`;
  }
  return `${traduit.nom} (${canonique.code}) — ${traduit.texte}${reste}`;
}

/** Variante multi-lignes de segmentAffiche pour une "Blessures multiples" —
 * traduit l'en-tête et chaque ligne numérotée un par un via `effets`
 * (un par sous-résultat, dans l'ordre), en conservant tel quel tout ce qui
 * suit (Précision libre, mention du second œil perdu...). Repli intégral sur
 * le texte français d'origine si la forme ne correspond pas exactement à ce
 * que produit BlessureGraveWizard (texte édité à la main, ancien format...). */
function texteMultiplesAffiche(effets: SeriousInjuryEffect[], original: string, language: Language): string {
  const enTeteFr = `Blessures multiples (16-21) — relance de ${effets.length} résultat(s) supplémentaire(s) :\n`;
  if (!original.startsWith(enTeteFr)) return original;
  let curseur = enTeteFr.length;
  const lignesAffichees: string[] = [];
  for (let i = 0; i < effets.length; i++) {
    const reste = original.slice(curseur);
    const finLigne = reste.indexOf('\n');
    const ligne = finLigne === -1 ? reste : reste.slice(0, finLigne);
    const prefixeNumero = `${i + 1}. `;
    if (!ligne.startsWith(prefixeNumero)) return original;
    const segment = ligne.slice(prefixeNumero.length);
    lignesAffichees.push(`${prefixeNumero}${segmentAffiche(effets[i], segment, language)}`);
    curseur += ligne.length + (finLigne === -1 ? 0 : 1);
  }
  const suffixeFinal = original.slice(curseur);
  const enTeteAffichee = `${traduireCle('blessureGraveWizard.multipleInjuriesTitle', language)} (16-21) — ${traduireCle('blessureGraveWizard.multipleInjuriesRerollCount', language, { n: effets.length })} :\n`;
  return `${enTeteAffichee}${lignesAffichees.join('\n')}${suffixeFinal}`;
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

/** Variante de nomCourtBlessure qui re-traduit le titre court quand c'est
 * possible sans risque (voir nomEffetAffiche) — sinon identique à
 * nomCourtBlessure. Gère aussi bien l'effet unique que le titre composite
 * "Blessures multiples (nom1, nom2, ...)". */
export function nomCourtBlessureAffiche(b: BlessureAffichable, language: Language): string {
  const original = nomCourtBlessure(b);
  if (!b.effets || b.effets.length === 0) return original;
  if (b.effets.length > 1) {
    const attendu = `Blessures multiples (${b.effets.map((e) => e.nom).join(', ')})`;
    if (original !== attendu) return original;
    const titre = traduireCle('blessureGraveWizard.multipleInjuriesTitle', language);
    return `${titre} (${b.effets.map((e) => nomEffetAffiche(e, language)).join(', ')})`;
  }
  const [effet] = b.effets;
  if (original !== effet.nom) return original;
  return nomEffetAffiche(effet, language);
}

/** Variante de injuryLabel qui re-traduit la description complète quand
 * c'est possible sans risque (voir segmentAffiche / texteMultiplesAffiche)
 * — sinon identique à injuryLabel. Un résultat "défaite face à un
 * gladiateur" relancé (voir prefixeGladiateur dans BlessureGraveWizard)
 * préfixe le texte français d'une mention fixe avant le résultat
 * effectivement tiré (lui-même simple ou "Blessures multiples") : le
 * préfixe est traité séparément puis recombiné, pour que la relance
 * sous-jacente reste traduisible normalement. */
export function injuryLabelAffiche(b: BlessureAffichable, language: Language): string {
  const original = injuryLabel(b);
  if (!b.effets || b.effets.length === 0) return original;
  if (original.startsWith(PREFIXE_DEFAITE_GLADIATEUR_FR)) {
    const reste = original.slice(PREFIXE_DEFAITE_GLADIATEUR_FR.length);
    const resteAffiche =
      b.effets.length > 1 ? texteMultiplesAffiche(b.effets, reste, language) : segmentAffiche(b.effets[0], reste, language);
    if (resteAffiche === reste) return original;
    return `${traduireCle('blessureGraveWizard.gladiatorDefeatPrefix', language)}${resteAffiche}`;
  }
  return b.effets.length > 1
    ? texteMultiplesAffiche(b.effets, original, language)
    : segmentAffiche(b.effets[0], original, language);
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

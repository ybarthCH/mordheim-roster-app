// Power Value : métrique alternative de force de bande, distincte du Rating
// officiel (voir utils/rating.ts, qui reste inchangé et continue de régir
// toute mécanique de jeu). Purement une valeur d'AFFICHAGE alternative,
// recalculée à la demande depuis l'état courant du roster — jamais dérivée
// de l'XP ni persistée.
//
// Formule (par figurine, sommée sur la bande) :
//   Coût de recrutement + Équipement + Progression du profil + Compétences
//
// Voir chaque fonction ci-dessous pour le détail de chaque terme.
import type { Member, RosterInstance } from '../types/roster';
import type { CompetenceSpeciale, Profile, Stats, WarbandCatalog } from '../types/catalog';
import type { Skill } from '../types/gameData';
import { STAT_KEYS } from '../types/catalog';
import { resolveProfil } from './profil';
import { skillById } from '../data/gameData';
import { getCatalogue } from '../data/warbands';

// Barème officiel "Fighting Individual Battles" (livre de règles Mordheim) :
// coût en points pour acheter UN point d'une caractéristique en dehors de la
// table d'avancement normale. Non linéaire pour F/E/PV/A : le second point
// acheté coûte plus cher que le premier — voir valeurDeltaCaracteristique.
type PalierCaracteristique = { premier: number; second?: number };

const POINTS_PAR_CARACTERISTIQUE: Record<keyof Stats, PalierCaracteristique> = {
  M: { premier: 15 },
  CC: { premier: 15 },
  CT: { premier: 15 },
  F: { premier: 25, second: 35 },
  E: { premier: 30, second: 45 },
  PV: { premier: 20, second: 30 },
  I: { premier: 10 },
  A: { premier: 25, second: 35 },
  Cd: { premier: 15 },
};

/**
 * Valeur Power Value d'un écart de caractéristique par rapport au profil de
 * recrutement de base, dans les deux sens : un delta positif (progression
 * achetée, ex : F3 -> F4 = +25) ou négatif (blessure grave permanente qui
 * réduit la caractéristique, ex : CC-1 = -15) utilise le même barème,
 * appliqué palier par palier plutôt que comme un simple `delta × valeur`
 * (ex : F3 -> F5 = +25 pour le 1er point + 35 pour le 2nd = +60, jamais
 * 2 × 25). Au-delà du 2e point, chaque point supplémentaire est valorisé au
 * tarif du 2e palier (extrapolation raisonnable, non explicitement couverte
 * par la table imprimée).
 */
export function valeurDeltaCaracteristique(stat: keyof Stats, delta: number): number {
  if (!delta) return 0;
  const palier = POINTS_PAR_CARACTERISTIQUE[stat];
  const signe = delta > 0 ? 1 : -1;
  let total = 0;
  for (let i = 0; i < Math.abs(delta); i++) {
    total += i === 0 ? palier.premier : (palier.second ?? palier.premier);
  }
  return signe * total;
}

/**
 * Coût de recrutement PAR FIGURINE d'un membre : celui de son profil
 * (catalogue, franc-tireur du catalogue commun ou franc-tireur "custom" —
 * resolveProfil() unifie déjà les trois sources, cout pointant vers le
 * prix d'engagement dans les trois cas, jamais vers `valeur`/`solde`) quand
 * il est fixe, sinon le montant réellement payé stocké sur le membre (voir
 * Member.cout_recrutement) — 0 si ce montant n'a pas été conservé (recrue à
 * prix variable créée avant l'introduction de ce champ : voir le rapport
 * d'implémentation, point 6, plutôt que d'inventer un montant).
 */
export function coutRecrutementUnitaire(m: Member, profil: Profile | undefined): number {
  if (profil?.cout != null) return profil.cout;
  return m.cout_recrutement ?? 0;
}

/** Coût de recrutement total du membre (groupe compris). */
export function coutRecrutementMembre(m: Member, profil: Profile | undefined): number {
  return coutRecrutementUnitaire(m, profil) * (m.taille_groupe || 1);
}

/**
 * Équipement actuellement porté par le membre : somme directe de
 * `inventaire[].cout`. Pour un groupe d'hommes de main, l'inventaire
 * contient déjà `taille_groupe` exemplaires de chaque objet (voir le
 * commentaire de resumeInventaireParItem dans utils/shop.ts) — aucune
 * multiplication supplémentaire ici. N'inclut ni la trésorerie, ni le stock
 * de bande (armurerie) non attribué, ni l'historique d'achats/objets perdus
 * (déjà absents de `inventaire`, qui ne reflète que ce qui est possédé
 * aujourd'hui).
 */
export function coutEquipementMembre(m: Member): number {
  return m.inventaire.reduce((acc, e) => acc + (Number(e.cout) || 0), 0);
}

/**
 * Progression du profil ET blessures graves permanentes, calculées comme UN
 * SEUL écart signé par caractéristique entre `stats_actuels` (profil effectif
 * actuel) et le profil de recrutement de base (resolveProfil().stats) — et
 * non comme deux mécanismes séparés (avancées d'un côté, blessures de
 * l'autre), pour qu'une réduction déjà reflétée dans `stats_actuels` ne soit
 * jamais soustraite une seconde fois. Une caractéristique encore variable
 * (voir Member.stats_variables, ex : le Damné avant que Destin ne fixe une
 * valeur) est ignorée : sa valeur numérique n'est qu'un espace réservé, sans
 * signification tant qu'elle n'a pas été fixée. Multiplié par la taille du
 * groupe : chaque figurine bénéficiant de la progression compte pour elle-
 * même (ex : 4 hommes de main +1 Attaque = 4 × 25).
 *
 * Retourne `progression` (somme des deltas positifs, jamais négative) et
 * `blessures` (somme des deltas négatifs, jamais positive) séparément —
 * uniquement pour l'affichage détaillé (voir powerValueDetailMembre) : un
 * delta donné est TOUJOURS soit positif soit négatif, jamais les deux à la
 * fois, donc `progression + blessures` redonne exactement la même valeur que
 * l'ancien calcul combiné, sans aucun risque de double-comptage introduit
 * par cette séparation.
 */
export function contributionProfilDetailMembre(
  m: Member,
  profil: Profile | undefined
): { progression: number; blessures: number } {
  if (!profil?.stats) return { progression: 0, blessures: 0 };
  let progression = 0;
  let blessures = 0;
  for (const stat of STAT_KEYS) {
    if (m.stats_variables?.[stat] !== undefined) continue;
    const delta = m.stats_actuels[stat] - profil.stats[stat];
    const valeur = valeurDeltaCaracteristique(stat, delta);
    if (valeur > 0) progression += valeur;
    else blessures += valeur;
  }
  const taille = m.taille_groupe || 1;
  return { progression: progression * taille, blessures: blessures * taille };
}

export function contributionProfilMembre(m: Member, profil: Profile | undefined): number {
  const { progression, blessures } = contributionProfilDetailMembre(m, profil);
  return progression + blessures;
}

function trouverCompetence(
  id: string,
  profil: Profile | undefined,
  catalogue: WarbandCatalog | undefined
): Skill | CompetenceSpeciale | undefined {
  return skillById(id) ?? (profil?.competences_speciales ?? catalogue?.competences_speciales ?? []).find((s) => s.id === id);
}

/**
 * Compétences ACQUISES (progression ou autre mécanisme d'acquisition
 * permanent), à l'exclusion de toute compétence déjà incluse dans le profil
 * de recrutement d'origine (déjà représentée par le coût de recrutement).
 *
 * Distinction : `Member.competences_acquises` mélange en réalité deux
 * origines pour certains francs-tireurs — leurs compétences de départ (voir
 * FrancTireurCatalog.competences_departs, pré-inscrites à la création par
 * creerMembreFrancTireurCatalogue) et les compétences réellement obtenues
 * via une avancée (voir AvanceeModal.choisirCompetence/confirmerMonture, qui
 * ajoutent systématiquement un AdvanceRecord{type:'competence', competenceId}
 * en plus de pousser l'id dans `competences_acquises`). Pour un membre
 * catalogue normal, `competences_acquises` ne contient de toute façon QUE
 * des compétences acquises (jamais pré-rempli au recrutement) : la
 * distinction ne change donc rien pour eux.
 *
 * Least-invasive : plutôt que d'ajouter un nouveau champ pour marquer
 * l'origine, on croise (intersection multi-ensemble, pour gérer les
 * compétences `repetable`) les ids actuellement possédés avec ceux qui
 * apparaissent dans `historique_avancees` comme obtenus via une avancée —
 * cet historique existe déjà et identifie précisément ce cas. Une
 * compétence obtenue puis retirée depuis (voir Récompenses du Seigneur des
 * Ombres, `competencesRetirees`) n'est plus dans `competences_acquises` et
 * ne compte donc plus, sans double retrait.
 */
export function competencesAcquisesValorisees(
  m: Member,
  profil: Profile | undefined,
  catalogue: WarbandCatalog | undefined
): number {
  const acquisesViaAvancee = m.historique_avancees
    .filter((a): a is typeof a & { competenceId: string } => a.type === 'competence' && !!a.competenceId)
    .map((a) => a.competenceId);

  const disponibles = [...m.competences_acquises];
  let total = 0;
  for (const id of acquisesViaAvancee) {
    const index = disponibles.indexOf(id);
    if (index === -1) continue;
    disponibles.splice(index, 1);
    const skill = trouverCompetence(id, profil, catalogue);
    total += skill?.valeurPuissance ?? 0;
  }
  return total;
}

// Décomposition affichable de la Power Value d'un membre ou d'une bande —
// R/E/P/S/W (Recrutement / Équipement / Progression du Profil / Skills /
// Wounds), voir formatPowerValueTooltip. Ces cinq lettres ne sont volontai-
// rement pas traduites (identiques en français et en anglais).
export type PowerValueDetail = {
  recrutement: number;
  equipement: number;
  progression: number;
  competences: number;
  blessures: number;
  total: number;
};

/**
 * Power Value d'un membre (ou groupe d'hommes de main), décomposée par
 * terme : Coût de recrutement + Équipement + Progression du profil +
 * Compétences acquises + Blessures graves permanentes (Progression et
 * Blessures partagent le même calcul sous-jacent, voir
 * contributionProfilDetailMembre, pour ne jamais double-compter).
 *
 * Les francs-tireurs (profil_custom ou franc_tireur_id) ne reçoivent AUCUN
 * traitement spécial ici : resolveProfil() résout déjà leur coût de
 * recrutement (`recrutement.cout`, jamais `valeur`/`solde`, qui sont la
 * contribution au Rating officiel et l'entretien récurrent — deux notions
 * distinctes du coût de recrutement) et leurs statistiques de base de la
 * même façon qu'un profil de catalogue classique, et ils avancent bien via
 * la même table/le même mécanisme (grille XP hommes de main, table
 * d'avancement héros — voir profilDeFrancTireur) : la progression de profil
 * s'applique donc à eux normalement, sans configuration supplémentaire.
 */
export function powerValueDetailMembre(m: Member, roster: RosterInstance): PowerValueDetail {
  const catalogue = getCatalogue(roster.bande_id);
  const profil = resolveProfil(roster, m, catalogue);
  const recrutement = coutRecrutementMembre(m, profil);
  const equipement = coutEquipementMembre(m);
  const { progression, blessures } = contributionProfilDetailMembre(m, profil);
  const competences = competencesAcquisesValorisees(m, profil, catalogue);
  return {
    recrutement,
    equipement,
    progression,
    competences,
    blessures,
    total: recrutement + equipement + progression + competences + blessures,
  };
}

export function powerValueMembre(m: Member, roster: RosterInstance): number {
  return powerValueDetailMembre(m, roster).total;
}

const DETAIL_VIDE: PowerValueDetail = {
  recrutement: 0,
  equipement: 0,
  progression: 0,
  competences: 0,
  blessures: 0,
  total: 0,
};

/**
 * Décomposition R/E/P/S/W sommée sur toute la bande — même périmètre que
 * ratingTotal() (utils/rating.ts) : un membre Mort est exclu, tout autre
 * statut (Blessé, Hors de combat...) compte normalement.
 */
export function powerValueDetailTotal(roster: RosterInstance): PowerValueDetail {
  return roster.membres
    .filter((m) => m.statut !== 'mort')
    .reduce((acc, m) => {
      const d = powerValueDetailMembre(m, roster);
      return {
        recrutement: acc.recrutement + d.recrutement,
        equipement: acc.equipement + d.equipement,
        progression: acc.progression + d.progression,
        competences: acc.competences + d.competences,
        blessures: acc.blessures + d.blessures,
        total: acc.total + d.total,
      };
    }, DETAIL_VIDE);
}

export function powerValueTotal(roster: RosterInstance): number {
  return powerValueDetailTotal(roster).total;
}

/**
 * Tooltip texte multi-lignes (survol souris) : R/E/P/S/W volontairement non
 * traduits (abréviations identiques en français et en anglais, voir
 * PowerValueDetail). Format brut adapté à un attribut `title` natif —
 * `\n` y est bien rendu comme un saut de ligne par tous les navigateurs.
 */
export function formatPowerValueTooltip(d: PowerValueDetail): string {
  return [
    `R ${d.recrutement}`,
    `E ${d.equipement}`,
    `P ${d.progression}`,
    `S ${d.competences}`,
    `W ${d.blessures}`,
  ].join('\n');
}

/**
 * Membres actuellement dans la bande dont le coût de recrutement est
 * définitivement inconnu (profil à prix variable, `Member.cout_recrutement`
 * jamais renseigné — recrue créée avant l'introduction de ce champ) : leur
 * Power Value compte 0 pour ce terme plutôt qu'une valeur inventée. Exposé
 * pour permettre de signaler ces cas à l'utilisateur plutôt que de les
 * laisser silencieusement sous-évalués.
 */
export function membresCoutRecrutementInconnu(roster: RosterInstance): Member[] {
  const catalogue = getCatalogue(roster.bande_id);
  return roster.membres.filter((m) => {
    if (m.statut === 'mort') return false;
    const profil = resolveProfil(roster, m, catalogue);
    return profil?.cout == null && m.cout_recrutement == null;
  });
}

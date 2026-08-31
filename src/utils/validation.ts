import type { RosterInstance } from '../types/roster';
import type { Language } from '../state/useLanguage';
import { getCatalogue } from '../data/warbands';
import { translateWarbandCatalog } from '../i18n/data/warbands';
import { effectifTotal } from './bandeValue';
import { aUnFrancTireurAvecTag, estFrancTireur } from '../data/hiredSwords';
import { effectifMaxPourTribu, maxProfilPourTribu } from './tribu';
import { comptePlafondGroupe } from './shop';

export type ViolationComposition = {
  profilId: string;
  nomProfil: string;
  type: 'max' | 'min';
  limite: number;
  actuel: number;
};

// Limite de recrutement effective pour un profil : un Héros unique (chef,
// sorcier...) est toujours plafonné à 1 quel que soit profil.max ; sinon une
// surcharge de tribu (voir maxProfilPourTribu, ex : Chiens du Chaos
// illimités chez les Kurgans) prime sur le max du catalogue. `null`
// ("illimité" côté tribu) est normalisé en `undefined` ici, la convention
// que les appelants testent via `limite != null`.
function limiteEffectivePourProfil(
  profil: { unique?: boolean; max?: number | null },
  surchargeTribu: number | null | undefined
): number | undefined {
  if (profil.unique) return 1;
  return (surchargeTribu !== undefined ? surchargeTribu : profil.max) ?? undefined;
}

/**
 * Vérifie les limites de composition (max/min par profil, unique) parmi les
 * membres actifs/capturés (hors morts). Purement informatif — n'empêche rien.
 */
export function validerComposition(roster: RosterInstance, language?: Language): ViolationComposition[] {
  const catalogueBrut = getCatalogue(roster.bande_id);
  if (!catalogueBrut) return [];
  const catalogue = language ? translateWarbandCatalog(catalogueBrut, language) : catalogueBrut;
  const violations: ViolationComposition[] = [];
  const comptes = new Map<string, number>();
  for (const m of roster.membres) {
    if (m.statut === 'mort' || estFrancTireur(m)) continue;
    comptes.set(m.profil_id, (comptes.get(m.profil_id) ?? 0) + (m.taille_groupe || 1));
  }
  const bannis = new Set(roster.profils_bannis ?? []);
  for (const profil of catalogue.profils) {
    const actuel = comptes.get(profil.id) ?? 0;
    const surchargeTribu = maxProfilPourTribu(catalogue, roster, profil.id);
    const limiteMax = limiteEffectivePourProfil(profil, surchargeTribu);
    if (limiteMax != null && actuel > limiteMax) {
      violations.push({ profilId: profil.id, nomProfil: profil.nom, type: 'max', limite: limiteMax, actuel });
    }
    // Un profil banni à jamais (chef mort, héros unique perdu...) ne peut
    // plus être recruté : signaler le minimum non atteint n'aurait aucun
    // sens puisque impossible à corriger.
    if (profil.min != null && profil.min > 0 && actuel < profil.min && !bannis.has(profil.id)) {
      violations.push({ profilId: profil.id, nomProfil: profil.nom, type: 'min', limite: profil.min, actuel });
    }
  }
  return violations;
}

export type ViolationEffectif = {
  type: 'min' | 'max';
  limite: number;
  actuel: number;
};

/** Le Cuisinier Halfling permet à la bande d'accueillir un guerrier de plus. */
export function effectifMaxAutorise(roster: RosterInstance): number | undefined {
  const catalogue = getCatalogue(roster.bande_id);
  const maximum = effectifMaxPourTribu(catalogue, roster);
  if (maximum == null) return undefined;
  // Bonus porté par un profil de bande (ex : la Roulotte de la Peste de la
  // Kermesse du Chaos, "+2") — voir Profile.bonus_effectif_max.
  const bonusProfils =
    catalogue?.profils.reduce((total, profil) => {
      if (!profil.bonus_effectif_max) return total;
      const possede = roster.membres.some((m) => m.profil_id === profil.id && m.statut !== 'mort');
      return possede ? total + profil.bonus_effectif_max : total;
    }, 0) ?? 0;
  // Bonus porté par une compétence spéciale acquise par un membre vivant
  // (ex : Invocateur des Morts Sans Repos, "+1") — voir
  // CompetenceSpeciale.bonus_effectif_max.
  const bonusCompetences =
    catalogue?.competences_speciales.reduce((total, competence) => {
      if (!competence.bonus_effectif_max) return total;
      const possede = roster.membres.some(
        (m) => m.statut !== 'mort' && m.competences_acquises.includes(competence.id)
      );
      return possede ? total + competence.bonus_effectif_max : total;
    }, 0) ?? 0;
  return maximum + (aUnFrancTireurAvecTag(roster, 'halfling') ? 1 : 0) + bonusProfils + bonusCompetences;
}

/**
 * Vérifie l'effectif total de la bande par rapport aux bornes du catalogue
 * (composition.effectif_min/effectif_max), quand elles sont renseignées.
 * Purement informatif — n'empêche pas de recruter/jouer.
 */
export function validerEffectif(roster: RosterInstance): ViolationEffectif[] {
  const catalogue = getCatalogue(roster.bande_id);
  const composition = catalogue?.composition;
  if (!composition) return [];
  const actuel = effectifTotal(roster);
  const violations: ViolationEffectif[] = [];
  if (composition.effectif_min != null && actuel < composition.effectif_min) {
    violations.push({ type: 'min', limite: composition.effectif_min, actuel });
  }
  const effectifMax = effectifMaxAutorise(roster);
  if (effectifMax != null && actuel > effectifMax) {
    violations.push({ type: 'max', limite: effectifMax, actuel });
  }
  return violations;
}

// Limite numérique à afficher pour un profil (ex : griser une option de
// liste avec son max) — même calcul que dans peutAjouterMembre, mais séparé
// car purement informatif : ne couvre pas le plafond combiné
// (profil.plafond_groupe), qui n'a pas de max propre à un seul profil.
export function limiteAfficheePourProfil(roster: RosterInstance, profilId: string): number | undefined {
  const catalogue = getCatalogue(roster.bande_id);
  const profil = catalogue?.profils.find((p) => p.id === profilId);
  if (!catalogue || !profil) return undefined;
  const surchargeTribu = maxProfilPourTribu(catalogue, roster, profilId);
  return limiteEffectivePourProfil(profil, surchargeTribu);
}

export function peutAjouterMembre(
  roster: RosterInstance,
  profilId: string,
  quantite = 1
): { ok: boolean; raison?: string } {
  if (roster.dissoute) {
    return { ok: false, raison: 'Bande dissoute : plus aucun recrutement possible.' };
  }
  const catalogue = getCatalogue(roster.bande_id);
  if (!catalogue) return { ok: false, raison: 'Bande introuvable dans le catalogue.' };
  const profil = catalogue.profils.find((p) => p.id === profilId);
  if (!profil) return { ok: false, raison: 'Profil introuvable dans le catalogue.' };
  if ((roster.profils_bannis ?? []).includes(profilId)) {
    return {
      ok: false,
      raison: `${profil.nom} ne peut plus jamais être recruté dans cette bande (profil banni définitivement).`,
    };
  }
  if (profil.requiert_profil_vivant) {
    const profilRequis = catalogue.profils.find((p) => p.id === profil.requiert_profil_vivant);
    const present = roster.membres.some((m) => m.profil_id === profil.requiert_profil_vivant && m.statut !== 'mort');
    if (!present) {
      return {
        ok: false,
        raison: `${profil.nom} nécessite qu'un ${profilRequis?.nom ?? profil.requiert_profil_vivant} vivant soit déjà présent dans la bande.`,
      };
    }
  }
  const surchargeTribu = maxProfilPourTribu(catalogue, roster, profilId);
  const limite = limiteEffectivePourProfil(profil, surchargeTribu);
  if (limite != null) {
    const actuel = roster.membres
      .filter((m) => m.profil_id === profilId && m.statut !== 'mort')
      .reduce((acc, m) => acc + (m.taille_groupe || 1), 0);
    if (actuel + quantite > limite) {
      return {
        ok: false,
        raison: `Limite atteinte pour ${profil.nom} (max ${limite}, ${actuel} déjà présent(s)).`,
      };
    }
  }
  if (profil.plafond_groupe) {
    const { id: groupeId, max: limiteGroupe, label } = profil.plafond_groupe;
    const actuelGroupe = comptePlafondGroupe(catalogue, roster, groupeId);
    if (actuelGroupe + quantite > limiteGroupe) {
      return {
        ok: false,
        raison: `Limite combinée atteinte pour ${label ?? profil.nom} (max ${limiteGroupe} au total pour la bande, ${actuelGroupe} déjà présent(s)).`,
      };
    }
  }
  if (profil.plafond_relatif) {
    const { profils: profilsReference, multiplicateur = 1, label } = profil.plafond_relatif;
    const actuel = roster.membres
      .filter((m) => m.profil_id === profilId && m.statut !== 'mort')
      .reduce((acc, m) => acc + (m.taille_groupe || 1), 0);
    const actuelReference = roster.membres
      .filter((m) => profilsReference.includes(m.profil_id) && m.statut !== 'mort')
      .reduce((acc, m) => acc + (m.taille_groupe || 1), 0);
    const limiteRelative = actuelReference * multiplicateur;
    if (actuel + quantite > limiteRelative) {
      return {
        ok: false,
        raison: `Limite relative atteinte pour ${label ?? profil.nom} (max ${limiteRelative} avec l'effectif actuel de référence, ${actuel} déjà présent(s)).`,
      };
    }
  }
  return { ok: true };
}

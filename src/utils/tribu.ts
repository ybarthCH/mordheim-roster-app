// Résolution de la tribu choisie à la création pour les bandes qui en
// proposent (voir WarbandCatalog.tribus, ex : Maraudeurs du Chaos).
import type { SkillCategory, WarbandCatalog } from '../types/catalog';
import type { RosterInstance } from '../types/roster';

export function tribuChoisie(catalogue: WarbandCatalog | undefined, roster: RosterInstance) {
  return catalogue?.tribus?.find((t) => t.id === roster.tribu);
}

// Identifiant de la compétence générique "Équitation" (data/skills.json,
// catégorie equitation) — voir Tribu.equitation_gratuite_heros.
export const SKILL_EQUITATION = 'equitation_01';

// Vrai si un Héros de la tribu choisie possède automatiquement la
// compétence Équitation sans consommer d'avancée (ex : les Hungs et leurs
// Chevaux de Guerre).
export function equitationGratuitePourTribu(catalogue: WarbandCatalog | undefined, roster: RosterInstance): boolean {
  return !!tribuChoisie(catalogue, roster)?.equitation_gratuite_heros;
}

// Effectif max applicable, en tenant compte d'une éventuelle surcharge de
// tribu (ex : Hungs, limités à 12 au lieu de 15).
export function effectifMaxPourTribu(catalogue: WarbandCatalog | undefined, roster: RosterInstance): number | undefined {
  return tribuChoisie(catalogue, roster)?.effectif_max ?? catalogue?.composition?.effectif_max;
}

// Max applicable pour un profil donné, en tenant compte d'une éventuelle
// surcharge de tribu (ex : Chiens du Chaos illimités chez les Kurgans,
// null = illimité). `undefined` signifie "pas de surcharge" — l'appelant se
// rabat alors sur `profil.max`.
export function maxProfilPourTribu(
  catalogue: WarbandCatalog | undefined,
  roster: RosterInstance,
  profilId: string
): number | null | undefined {
  const tribu = tribuChoisie(catalogue, roster);
  if (tribu?.profil_max && profilId in tribu.profil_max) return tribu.profil_max[profilId];
  return undefined;
}

// Accès aux compétences pour un profil donné, en tenant compte d'une
// éventuelle surcharge de tribu (ex : les Capitaines/Champions/Recrues
// tiléens n'ont pas le même tableau de compétences selon leur cité-état
// d'origine). `undefined` signifie "pas de surcharge" — l'appelant se
// rabat alors sur `profil.acces_competences`.
export function accesCompetencesPourTribu(
  catalogue: WarbandCatalog | undefined,
  roster: RosterInstance,
  profilId: string
): SkillCategory[] | undefined {
  const tribu = tribuChoisie(catalogue, roster);
  return tribu?.profil_acces_competences?.[profilId];
}

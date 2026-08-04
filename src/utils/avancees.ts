// Annulation d'une avancée d'expérience déjà résolue (voir AvanceeModal) —
// corrige une saisie erronée sans devoir recommencer la fiche du personnage.
// Seuls les types à effet simple et localisé (une caractéristique, une
// compétence, un sort) sont réversibles automatiquement : la promotion ("Ce
// gars est doué", qui peut détacher une figurine d'un groupe) et les
// récompenses du Seigneur des Ombres (stats, objets, notes, mort possible...)
// ont des effets trop larges pour être annulés sans ambiguïté.
import type { AdvanceRecord, Member } from '../types/roster';
import { SKILL_EQUITATION } from './tribu';

export function avanceeReversible(record: AdvanceRecord): boolean {
  return record.type === 'caracteristique' || record.type === 'competence' || record.type === 'sort';
}

export function annulerAvancee(
  membre: Member,
  record: AdvanceRecord,
  nomCompetence: (skillId: string) => string
): Partial<Member> {
  const historique_avancees = membre.historique_avancees.filter((a) => a.id !== record.id);
  // Le jet gratuit "Ce gars est doué" (bonus: true) n'est jamais compté dans
  // le total d'avancées dues (voir AdvanceRecord.bonus) : le supprimer ne
  // fait donc jamais réapparaître "Avancée en attente" via ce calcul. On
  // restaure explicitement la possibilité de le relancer, sans quoi il
  // serait perdu sans recours.
  const restaurationBonus: Partial<Member> = record.bonus ? { bonus_avancee_en_attente: true } : {};

  if (record.type === 'caracteristique' && record.stat) {
    return {
      historique_avancees,
      stats_actuels: { ...membre.stats_actuels, [record.stat]: membre.stats_actuels[record.stat] - 1 },
      ...restaurationBonus,
    };
  }

  if (record.type === 'competence') {
    const index = record.competenceId
      ? membre.competences_acquises.findIndex((id) => id === record.competenceId)
      : membre.competences_acquises.findIndex((id) => nomCompetence(id) === record.detail);
    if (index === -1) return { historique_avancees, ...restaurationBonus };
    const retiree = membre.competences_acquises[index];
    return {
      historique_avancees,
      competences_acquises: membre.competences_acquises.filter((_, i) => i !== index),
      ...(retiree === SKILL_EQUITATION ? { monture_equitation: undefined } : {}),
      ...restaurationBonus,
    };
  }

  if (record.type === 'sort') {
    const cible = record.sortId ?? record.detail.replace(/^Nouveau sort\s*:\s*/, '');
    const index = membre.sorts_connus.indexOf(cible);
    if (index === -1) return { historique_avancees, ...restaurationBonus };
    return {
      historique_avancees,
      sorts_connus: membre.sorts_connus.filter((_, i) => i !== index),
      ...restaurationBonus,
    };
  }

  return { historique_avancees, ...restaurationBonus };
}

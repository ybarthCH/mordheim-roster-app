import type { UiDictionary } from './types';

export const etapeGainXp: UiDictionary = {
  'gainXp.leaderBonusTitle': { fr: 'Bonus chef de bande : +1 XP automatique à la victoire', en: "Warband leader bonus: +1 XP automatically on victory" },
  'gainXp.xpBoxLabel': { fr: 'Case XP {n}', en: 'XP box {n}' },
  'gainXp.title': { fr: "Gain d'expérience", en: 'Experience gain' },
  'gainXp.intro': {
    fr: "Chaque participant gagne 1 XP automatiquement (couleur dédiée ci-dessous). Le sort de tous les Hors de combat (héros, hommes de main et groupes) a déjà été résolu à l'étape précédente : cette étape n'affiche plus que le résultat.",
    en: "Every participant automatically gains 1 XP (dedicated colour below). Everyone's Out of Action outcome (heroes, henchmen, and groups) was already resolved in the previous step: this step only reflects the result.",
  },
  'gainXp.noMembers': { fr: 'Aucun membre dans la bande.', en: 'No members in the warband.' },
  'gainXp.leaderBadge': { fr: 'Leader', en: 'Leader' },
  'gainXp.statusDeadInjury': { fr: 'Mort (blessure grave)', en: 'Dead (serious injury)' },
  'gainXp.statusOoaSurvived': { fr: 'Hors de combat — a survécu', en: 'Out of Action — survived' },
  'gainXp.statusOoa': { fr: 'Hors de combat', en: 'Out of Action' },
  'gainXp.statusInjured': { fr: 'Blessé', en: 'Injured' },
  'gainXp.statusActive': { fr: 'Actif', en: 'Active' },
  'gainXp.neverGainsXp': { fr: "Ne gagne jamais d'expérience.", en: 'Never gains experience.' },
  'gainXp.rollInstruction': {
    fr: 'Lance 1D6{suffix} : 1–2, il meurt ; 3–6, il survit.',
    en: 'Roll 1D6{suffix}: 1–2, he dies; 3–6, he survives.',
  },
  'gainXp.rollForHiredSword': { fr: ' pour ce franc-tireur', en: ' for this hired sword' },
  'gainXp.survived': { fr: 'A survécu{xp}', en: 'Survived{xp}' },
  'gainXp.survivedXpSuffix': { fr: ' (+1 XP)', en: ' (+1 XP)' },
  'gainXp.didNotSurvive': { fr: "N'a pas survécu", en: 'Did not survive' },
  'gainXp.outOfActionCount': { fr: '{hc} / {total} hors de combat', en: '{hc} / {total} Out of Action' },
  'gainXp.survivedShort': { fr: 'Survécu', en: 'Survived' },
  'gainXp.deadShort': { fr: 'Mort', en: 'Dead' },
  'gainXp.modelsToResolve': { fr: '{n} figurine(s) à résoudre.', en: '{n} model(s) to resolve.' },
  'gainXp.resolvedKeeps': {
    fr: 'Résolu — le groupe garde {n} figurine(s){xp}',
    en: 'Resolved — the group keeps {n} model(s){xp}',
  },
  'gainXp.resolvedKeepsXpSuffix': { fr: ' et gagne +1 XP.', en: ' and gains +1 XP.' },
  'gainXp.resolvedKeepsNoXpSuffix': { fr: '.', en: '.' },
  'gainXp.resolvedWiped': {
    fr: "Résolu — le groupe est entièrement éliminé (passera au statut Mort).",
    en: 'Resolved — the group is completely wiped out (will move to Dead status).',
  },
  'gainXp.advancesResolvedTitle': { fr: 'Avancées résolues pendant cette bataille', en: 'Advances resolved during this battle' },
};

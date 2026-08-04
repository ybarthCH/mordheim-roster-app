import type { UiDictionary } from './types';

export const avanceeModal: UiDictionary = {
  'avanceeModal.title': { fr: "Avancée d'expérience — {nom}", en: 'Experience advance — {nom}' },
  'avanceeModal.promotedImmediateRoll': {
    fr: 'Promu héros ! Jet immédiat sur la table de progression des héros.',
    en: 'Promoted to Hero! Immediate roll on the hero advancement table.',
  },
  'avanceeModal.remainingGroupAdvance': {
    fr: 'Avancée du groupe restant ({n} figurine{s}).',
    en: 'Remaining group advance ({n} model{s}).',
  },
  'avanceeModal.rollInstruction': {
    fr: 'Lance 2D6 sur ta table papier, puis choisis la ligne correspondante.',
    en: 'Roll 2D6 on your tabletop, then choose the corresponding line.',
  },
  'avanceeModal.rollResultLabel2D6': { fr: 'Résultat du jet (2D6)', en: 'Roll result (2D6)' },
  'avanceeModal.chooseResultObtained': { fr: '— Choisir le résultat obtenu —', en: '— Choose the result obtained —' },
  'avanceeModal.unavailableHeroLimitSuffix': {
    fr: ' (indisponible — 6 héros déjà atteints)',
    en: ' (unavailable — 6 heroes already reached)',
  },
  'avanceeModal.heroLimitReachedNote': {
    fr: 'La bande compte déjà {n} héros (maximum autorisé) : « Lad\'s Got Talent » ne peut pas promouvoir ce membre pour l\'instant.',
    en: 'The warband already has {n} heroes (maximum allowed): "Lad\'s Got Talent" cannot promote this member right now.',
  },
  'avanceeModal.cannotApplyResult': {
    fr: "Impossible d'appliquer ce résultat : {raison} Relance sur ta table papier pour obtenir un autre résultat.",
    en: 'Cannot apply this result: {raison} Roll again on your tabletop to get another result.',
  },
  'avanceeModal.cancel': { fr: 'Annuler', en: 'Cancel' },
  'avanceeModal.validate': { fr: 'Valider', en: 'Validate' },
  'avanceeModal.chooseWhichCharacteristic': {
    fr: 'Choisis laquelle des deux caractéristiques augmenter.',
    en: 'Choose which of the two characteristics to increase.',
  },
  'avanceeModal.rollWhichCharacteristic': {
    fr: 'Lance {notation} sur ta table papier, puis choisis la ligne correspondante.',
    en: 'Roll {notation} on your tabletop, then choose the corresponding line.',
  },
  'avanceeModal.bothCappedNote': {
    fr: "Les deux caractéristiques proposées sont déjà au maximum. Augmente n'importe quelle autre caractéristique disponible de +1 à la place.",
    en: 'Both proposed characteristics are already at maximum. Increase any other available characteristic by +1 instead.',
  },
  'avanceeModal.allCappedNote': {
    fr: 'Toutes les caractéristiques de ce profil sont déjà au plafond racial.',
    en: 'All characteristics on this profile are already at the racial cap.',
  },
  'avanceeModal.variableStatIntro': {
    fr: "est une caractéristique variable ({notation}) : lance ce dé sur ta table papier. Si tu es satisfait du résultat, fixe-le définitivement — sinon la caractéristique reste variable et l'avancée est perdue.",
    en: 'is a variable characteristic ({notation}): roll this die on your tabletop. If you are satisfied with the result, fix it permanently — otherwise the characteristic stays variable and the advance is lost.',
  },
  'avanceeModal.rollResultLabel': { fr: 'Résultat du jet', en: 'Roll result' },
  'avanceeModal.leaveVariable': { fr: 'Laisser variable (jet perdu)', en: 'Leave variable (roll lost)' },
  'avanceeModal.fixToResult': { fr: 'Fixer à ce résultat', en: 'Fix to this result' },
  'avanceeModal.talentTitle': { fr: "Lad's Got Talent !", en: "Lad's Got Talent!" },
  'avanceeModal.groupBecomesHero': {
    fr: "Une figurine du groupe devient héros (le groupe continue avec {n} figurine(s)) : elle conserve le profil et l'expérience du groupe, mais accède désormais à la grille XP et à la table d'avancement des héros.",
    en: 'One model from the group becomes a Hero (the group continues with {n} model(s)): it keeps the profile and experience of the group, but now uses the XP grid and hero advancement table.',
  },
  'avanceeModal.memberBecomesHero': {
    fr: "Ce membre devient un héros : il conserve son profil et son expérience, mais accède désormais à la grille XP et à la table d'avancement des héros.",
    en: 'This member becomes a Hero: it keeps its profile and experience, but now uses the XP grid and hero advancement table.',
  },
  'avanceeModal.chooseTwoTables': {
    fr: 'Choisis au moins 2 tables de compétences accessibles à ce nouveau héros.',
    en: 'Choose at least 2 skill tables accessible to this new Hero.',
  },
  'avanceeModal.confirmPromotionRoll': {
    fr: 'Confirmer la promotion et lancer sur la table héros',
    en: 'Confirm the promotion and roll on the hero table',
  },
  'avanceeModal.skillOrShadowLordIntro': {
    fr: 'peut choisir une compétence normale, ou tenter un pèlerinage à la Fosse pour une récompense du Seigneur des Ombres (règle optionnelle).',
    en: 'can choose a normal skill, or attempt a pilgrimage to the Pit for a Lord of the Shadows reward (optional rule).',
  },
  'avanceeModal.chooseSkill': { fr: 'Choisir une compétence', en: 'Choose a skill' },
  'avanceeModal.shadowLordRewards': { fr: 'Récompenses du Seigneur des Ombres', en: 'Lord of the Shadows rewards' },
  'avanceeModal.skillOrSpellIntro': {
    fr: 'peut choisir une compétence normale, ou apprendre un nouveau sort à la place.',
    en: 'can choose a normal skill, or learn a new spell instead.',
  },
  'avanceeModal.learnNewSpell': { fr: 'Apprendre un nouveau sort', en: 'Learn a new spell' },
  'avanceeModal.resultLabelPrefix': { fr: 'Résultat {label}.', en: 'Result {label}.' },
  'avanceeModal.allSpellsKnown': { fr: 'Tous les sorts de cette bande sont déjà connus.', en: 'All spells for this warband are already known.' },
  'avanceeModal.skillTableLabel': { fr: 'Table de compétence', en: 'Skill table' },
  'avanceeModal.chooseEllipsis': { fr: '— Choisir —', en: '— Choose —' },
  'avanceeModal.equitationMountIntro': {
    fr: "Équitation est une compétence propre à une monture précise (règle imprimée : elle doit être réapprise pour en chevaucher une autre) — choisis celle à laquelle elle est liée.",
    en: 'Ride is a skill tied to a specific mount (per the rules: it must be relearned to ride another) — choose the one it is linked to.',
  },
  'avanceeModal.mountLabel': { fr: 'Monture', en: 'Mount' },
  'avanceeModal.mountUnspecified': { fr: '— Non précisée pour l\'instant —', en: '— Not specified for now —' },
  'avanceeModal.noMountAvailable': {
    fr: 'Aucune monture répertoriée dans le shop de cette bande — la compétence peut être acquise sans monture précisée pour le moment.',
    en: 'No mount listed in this warband\'s shop — the skill can be acquired without a specified mount for now.',
  },
  'avanceeModal.confirm': { fr: 'Confirmer', en: 'Confirm' },
  'avanceeModal.continueRemainingGroup': {
    fr: 'Continuer — avancée du groupe restant ({n} figurine{s})',
    en: 'Continue — remaining group advance ({n} model{s})',
  },
  'avanceeModal.finish': { fr: 'Terminer', en: 'Finish' },
  'avanceeModal.resultCharacteristicIncreased': { fr: 'Caractéristique augmentée : {label}', en: 'Characteristic increased: {label}' },
  'avanceeModal.resultShadowLord': { fr: 'Seigneur des Ombres : {nom}', en: 'Lord of the Shadows: {nom}' },
  'avanceeModal.resultNewSkill': { fr: 'Nouvelle compétence : {nom}', en: 'New skill: {nom}' },
  'avanceeModal.resultNewSkillMount': { fr: 'Nouvelle compétence : {nom} — {monture}', en: 'New skill: {nom} — {monture}' },
  'avanceeModal.resultNewSpell': { fr: 'Nouveau sort appris : {nom}', en: 'New spell learned: {nom}' },
  'avanceeModal.resultCharacteristicFixed': { fr: 'Caractéristique fixée : {label} = {valeur}', en: 'Characteristic fixed: {label} = {valeur}' },
  'avanceeModal.resultCharacteristicRemainsVariable': { fr: '{label} reste variable (jet non concluant).', en: '{label} stays variable (inconclusive roll).' },
  'avanceeModal.tableNewSkill': { fr: 'Nouvelle compétence', en: 'New skill' },
  'avanceeModal.tablePromotion': {
    fr: 'Ce gars est doué — devient héros (jet immédiat sur la table des héros)',
    en: "Lad's Got Talent — becomes a Hero (immediate roll on the hero table)",
  },
  'avanceeModal.orSeparator': { fr: ' ou ', en: ' or ' },
};

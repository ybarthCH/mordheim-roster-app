import type { UiDictionary } from './types';

export const postBatailleScreen: UiDictionary = {
  'postBatailleScreen.bandNotFoundTitle': { fr: 'Bande introuvable', en: 'Warband not found' },
  'postBatailleScreen.bandNotFoundBody': { fr: "Ce roster n'existe pas (ou plus).", en: 'This roster does not (or no longer) exist.' },
  'postBatailleScreen.wizardTitle': { fr: 'Assistant post-bataille', en: 'Post-battle wizard' },
  'postBatailleScreen.stepCounter': { fr: 'Étape {n}/{total} — {nom}', en: 'Step {n}/{total} — {nom}' },
  'postBatailleScreen.step.battle': { fr: 'Bataille', en: 'Battle' },
  'postBatailleScreen.step.injuries': { fr: 'Blessures graves', en: 'Serious injuries' },
  'postBatailleScreen.step.xpGain': { fr: "Gain d'expérience", en: 'Experience gain' },
  'postBatailleScreen.step.exploration': { fr: 'Exploration', en: 'Exploration' },
  'postBatailleScreen.step.commerce': { fr: 'Commerce', en: 'Trade' },
  'postBatailleScreen.step.upkeep': { fr: 'Entretien', en: 'Upkeep' },
  'postBatailleScreen.step.summary': { fr: 'Résumé', en: 'Summary' },
  'postBatailleScreen.previous': { fr: 'Précédent', en: 'Previous' },
  'postBatailleScreen.next': { fr: 'Suivant', en: 'Next' },
  'postBatailleScreen.validateAndSave': { fr: 'Valider et enregistrer', en: 'Validate and save' },
  'postBatailleScreen.confirmLeaveWizard': {
    fr: "Quitter le post-bataille sans valider ? Certains changements (blessures, XP, avancées…) ont peut-être déjà été appliqués à la bande — utilise plutôt le bouton « Précédent » pour revenir en arrière sans rien perdre.",
    en: 'Leave the post-battle wizard without validating? Some changes (injuries, XP, advances…) may already have been applied to the warband — use the "Previous" button instead to go back without losing anything.',
  },
  'postBatailleScreen.resolveEyeOfDarkGods': {
    fr: 'Résous le test Œil des Dieux Sombres (Réussi / Raté) avant de valider.',
    en: 'Resolve the Eye of the Dark Gods test (Succeeded / Failed) before validating.',
  },
  'postBatailleScreen.resolveInjuriesFirst': {
    fr: 'Résous la blessure grave de chaque Héros Hors de combat avant de continuer.',
    en: 'Resolve the serious injury of every Hero Out of Action before continuing.',
  },
  'postBatailleScreen.resolveSurvivalFirst': {
    fr: "Résous d'abord le statut (survécu / n'a pas survécu) de tous les Hors de combat avant de continuer.",
    en: 'Resolve the status (survived / did not survive) of everyone Out of Action before continuing.',
  },
  'postBatailleScreen.resolveCommerceFirst': {
    fr: 'Choisis une action de commerce pour chaque Héros et termine toute consultation payée avant de continuer, ou clique sur « Tout passer ».',
    en: 'Choose a trade action for each Hero and finish any paid consultation before continuing, or press the Skip all button.',
  },
  'postBatailleScreen.insufficientUpkeepResources': {
    fr: 'Les ressources disponibles ne couvrent pas les contrats conservés.',
    en: 'The available resources do not cover the contracts kept.',
  },
};

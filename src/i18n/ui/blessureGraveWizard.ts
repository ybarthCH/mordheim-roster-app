import type { UiDictionary } from './types';

export const blessureGraveWizard: UiDictionary = {
  'blessureGraveWizard.loopIntro': {
    fr: 'Blessures multiples — résultat {index}/{count}. Les résultats Mort, Capturé et Blessures multiples doivent être relancés : ils ne sont pas proposés ci-dessous.',
    en: 'Multiple Injuries — result {index}/{count}. Dead, Captured, and Multiple Injuries results must be re-rolled: they are not offered below.',
  },
  'blessureGraveWizard.gladiatorLostIntro': {
    fr: "Il perd le combat et est jeté hors des fosses sans arme ni armure. Relance sur la table complète pour savoir ce qu'il devient — Mort y compris si le sort s'y prête, et même un nouveau Gladiateur.",
    en: 'He loses the fight and is thrown out of the pits without weapon or armour. Roll again on the full table to find out what happens to him — Dead included if fate has it that way, even another Pit Fighter.',
  },
  'blessureGraveWizard.rollInstruction': {
    fr: 'Lance 2D6 sur ta table papier, puis sélectionne le résultat obtenu pour {nom}.',
    en: 'Roll 2D6 on your tabletop, then select the result obtained for {nom}.',
  },
  'blessureGraveWizard.resultObtained': { fr: 'Résultat obtenu', en: 'Result obtained' },
  'blessureGraveWizard.chooseResult': { fr: 'Choisis un résultat…', en: 'Choose a result…' },
  'blessureGraveWizard.cancel': { fr: 'Annuler', en: 'Cancel' },
  'blessureGraveWizard.continue': { fr: 'Continuer', en: 'Continue' },
  'blessureGraveWizard.back': { fr: '‹ Retour', en: '‹ Back' },
  'blessureGraveWizard.rerollD6Instructions': { fr: 'Relance 1D6 :', en: 'Reroll 1D6:' },
  'blessureGraveWizard.d3DurationQuestion': {
    fr: 'Lance 1D3 : combien de parties le guerrier doit-il manquer ?',
    en: 'Roll 1D3: how many games must the warrior miss?',
  },
  'blessureGraveWizard.multipleInjuriesTitle': { fr: 'Blessures multiples', en: 'Multiple Injuries' },
  'blessureGraveWizard.multipleInjuriesCountQuestion': {
    fr: 'Lance 1D6 : combien de fois faut-il relancer sur la table ?',
    en: 'Roll 1D6: how many times must you roll again on the table?',
  },
  'blessureGraveWizard.gladiatorFightQuestion': {
    fr: 'Le guerrier affronte un gladiateur dans les fosses de combat du Repaire des Coupe-Jarrets. A-t-il gagné le combat ?',
    en: "The warrior faces a pit fighter in the fighting pits of the Cutthroats' Den. Did he win the fight?",
  },
  'blessureGraveWizard.stackedProfilesNote': {
    fr: "Profils l'un au-dessus de l'autre, pour résoudre le duel sans quitter cet écran :",
    en: 'Profiles stacked one above the other, to resolve the duel without leaving this screen:',
  },
  'blessureGraveWizard.opposingGladiatorTitle': { fr: 'Gladiateur adverse (franc-tireur)', en: 'Opposing pit fighter (hired sword)' },
  'blessureGraveWizard.equipmentLabel': { fr: 'Équipement :', en: 'Equipment:' },
  'blessureGraveWizard.specialRulesLabel': { fr: 'Règles spéciales :', en: 'Special rules:' },
  'blessureGraveWizard.yes': { fr: 'Oui', en: 'Yes' },
  'blessureGraveWizard.no': { fr: 'Non', en: 'No' },
  'blessureGraveWizard.currentTreasury': {
    fr: 'Trésorerie actuelle de la bande : {n} po.',
    en: "Warband's current treasury: {n} gc.",
  },
  'blessureGraveWizard.heroLost': { fr: 'Héros perdu', en: 'Hero lost' },
  'blessureGraveWizard.ransomedBack': { fr: 'Récupéré contre rançon', en: 'Recovered for ransom' },
  'blessureGraveWizard.ransomAmountLabel': { fr: 'Montant de la rançon (po)', en: 'Ransom amount (gc)' },
  'blessureGraveWizard.treasuryAfterPayment': {
    fr: 'Trésorerie après paiement : {n} po.',
    en: 'Treasury after payment: {n} gc.',
  },
  'blessureGraveWizard.confirmRansom': { fr: 'Confirmer la rançon', en: 'Confirm the ransom' },
  'blessureGraveWizard.summary': { fr: 'Résumé', en: 'Summary' },
  'blessureGraveWizard.eternalDeathNote': {
    fr: 'un résultat Tué inflige à la place une perte permanente de -D3 Points de Vie. Lance 1D3 sur ta table papier.',
    en: 'a Dead result instead inflicts a permanent loss of -D3 Wounds. Roll 1D3 on your tabletop.',
  },
  'blessureGraveWizard.eternalLabel': { fr: 'Éternelle', en: 'Eternal' },
  'blessureGraveWizard.eternalIgnoreOption': {
    fr: 'Éternelle : ignorer ce résultat, -1 PV permanent à la place (PV actuels : {pv})',
    en: 'Eternal: ignore this result, -1 permanent Wound instead (current Wounds: {pv})',
  },
  'blessureGraveWizard.modifiedCharacteristics': { fr: 'Caractéristiques modifiées :', en: 'Modified characteristics:' },
  'blessureGraveWizard.notesToAdd': { fr: 'À ajouter aux notes :', en: 'To add to notes:' },
  'blessureGraveWizard.experienceLabel': { fr: 'Expérience :', en: 'Experience:' },
  'blessureGraveWizard.warbandTreasury': { fr: 'Trésorerie de la bande :', en: "Warband's treasury:" },
  'blessureGraveWizard.gcSuffix': { fr: 'po', en: 'gc' },
  'blessureGraveWizard.willBeMarkedDead': { fr: '⚠ Ce guerrier sera marqué Mort.', en: '⚠ This warrior will be marked Dead.' },
  'blessureGraveWizard.equipmentLossWarning': {
    fr: "⚠ Cette blessure entraîne la perte de tout l'équipement (armes, armures, objets) — il sera vidé de la fiche en cliquant sur Appliquer.",
    en: "⚠ This injury results in the loss of all equipment (weapons, armour, items) — it will be cleared from the sheet when you click Apply.",
  },
  'blessureGraveWizard.notAutomatableNote': {
    fr: "Ce résultat n'est pas automatisable (négociation avec l'adversaire, combat annexe...) : note l'issue ci-dessous, puis applique manuellement les conséquences sur la fiche si besoin.",
    en: 'This result cannot be automated (negotiation with the opponent, side fight...): note the outcome below, then manually apply the consequences on the sheet if needed.',
  },
  'blessureGraveWizard.precisionLabel': { fr: 'Précision (optionnel)', en: 'Detail (optional)' },
  'blessureGraveWizard.precisionPlaceholderCapture': {
    fr: "Ex : nom de la bande ou du guerrier qui l'a capturé...",
    en: 'E.g.: name of the warband or warrior who captured him...',
  },
  'blessureGraveWizard.precisionPlaceholderDefault': {
    fr: "Ex : nom de l'adversaire responsable, issue de la négociation...",
    en: 'E.g.: name of the responsible opponent, outcome of the negotiation...',
  },
  'blessureGraveWizard.restart': { fr: 'Recommencer', en: 'Restart' },
  'blessureGraveWizard.apply': { fr: 'Appliquer', en: 'Apply' },
  'blessureGraveWizard.gladiatorVictoryNom': { fr: 'Gladiateur (victoire)', en: 'Pit fighter (victory)' },
  'blessureGraveWizard.gladiatorVictoryTexte': {
    fr: "Le guerrier remporte son combat dans les fosses du Repaire des Coupe-Jarrets : il empoche 50 pièces d'or, gagne 2 points d'Expérience et rejoint sa bande avec tout son équipement intact.",
    en: "The warrior wins his fight in the pits of the Cutthroats' Den: he pockets 50 gold crowns, gains 2 Experience points, and rejoins his warband with all his equipment intact.",
  },
  'blessureGraveWizard.gladiatorDefeatPrefix': {
    fr: 'Défaite face à un gladiateur dans les fosses de combat — ',
    en: 'Defeat against a pit fighter in the fighting pits — ',
  },
  'blessureGraveWizard.capturedLostNom': { fr: 'Capturé — héros perdu', en: 'Captured — hero lost' },
  'blessureGraveWizard.capturedLostTexte': {
    fr: "Le prisonnier ne revient pas : vendu à des marchands d'esclaves, exécuté ou transformé par ses ravisseurs, il quitte définitivement la bande. Son équipement reste aux mains de ses ravisseurs.",
    en: 'The captive never returns: sold to slavers, executed, or turned by his captors, he leaves the warband for good. His equipment stays with his captors.',
  },
  'blessureGraveWizard.capturedRansomNom': { fr: 'Capturé — libéré contre rançon', en: 'Captured — ransomed' },
  'blessureGraveWizard.capturedRansomTexte': {
    fr: 'Le prisonnier est libéré contre une rançon de {montant} po, payée par la bande. Il conserve tout son équipement et rejoint aussitôt la bande.',
    en: 'The captive is released for a ransom of {montant} gc, paid by the warband. He keeps all his equipment and immediately rejoins the warband.',
  },
  'blessureGraveWizard.subRollResultPrefix': { fr: 'Résultat du sous-jet', en: 'Sub-roll result' },
  'blessureGraveWizard.missesNextGamesSuffix': {
    fr: 'Le guerrier manque {n} prochaine(s) partie(s).',
    en: 'The warrior misses the next {n} game(s).',
  },
  'blessureGraveWizard.multipleInjuriesRerollCount': {
    fr: 'relance de {n} résultat(s) supplémentaire(s)',
    en: 'reroll {n} additional result(s)',
  },
};

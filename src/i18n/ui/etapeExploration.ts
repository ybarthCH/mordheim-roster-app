import type { UiDictionary } from './types';

export const etapeExploration: UiDictionary = {
  'exploration.title': { fr: 'Exploration & wyrdstone', en: 'Exploration & wyrdstone' },
  'exploration.rollLine': {
    fr: 'Lance {total}D6 : {heros} pour les Héros ayant participé sans être mis Hors de combat{victoire}{bonus}.',
    en: 'Roll {total}D6: {heros} for the Heroes who took part without being taken Out of Action{victoire}{bonus}.',
  },
  'exploration.victorySuffix': { fr: ' + 1 pour la victoire', en: ' + 1 for the victory' },
  'exploration.bandRulesSuffix': { fr: ' + {n} dû aux règles de la bande', en: " + {n} due to the warband's rules" },
  'exploration.moreThanSixDiceNote': {
    fr: "Tu peux lancer plus de six dés, mais tu dois en choisir au maximum six pour former le résultat d'exploration.",
    en: 'You can roll more than six dice, but you must choose at most six to form the exploration result.',
  },
  'exploration.heroesProvidingDie': { fr: 'Héros qui fournissent un dé :', en: 'Heroes who provide a die:' },
  'exploration.aidsDetected': { fr: "Aides à l'exploration détectées", en: 'Exploration aids detected' },
  'exploration.aidsNoAutoRoll': {
    fr: 'Ces règles ne lancent aucun dé automatiquement.',
    en: 'These rules do not roll any dice automatically.',
  },
  'exploration.reportRollsIntro': {
    fr: "Reporte ici le résultat de tes jets d'exploration effectués sur table papier : touche la ligne obtenue ci-dessous.",
    en: 'Report the result of your exploration rolls made on your tabletop here: tap the row obtained below.',
  },
  'exploration.diceResultHeader': { fr: 'Résultat des dés', en: 'Dice result' },
  'exploration.fragmentsFoundHeader': { fr: 'Fragments trouvés', en: 'Fragments found' },
  'exploration.wyrdstoneFound': { fr: 'Wyrdstone trouvé : {n} fragment{s}.', en: 'Wyrdstone found: {n} fragment{s}.' },
  'exploration.eventTitle': { fr: "Événement d'exploration", en: 'Exploration event' },
  'exploration.journalLabel': { fr: "Journal d'exploration", en: 'Exploration journal' },
  'exploration.saleTitle': { fr: 'Vente de wyrdstone', en: 'Wyrdstone sale' },
  'exploration.salePriceIntro': {
    fr: 'Prix de vente selon le nombre de fragments vendus ensemble et la taille de la bande ({n} guerrier{s}).',
    en: 'Sale price depends on how many fragments are sold together and the size of the warband ({n} warrior{s}).',
  },
  'exploration.fragmentsSoldHeader': { fr: 'Fragments vendus', en: 'Fragments sold' },
  'exploration.quantitySoldLabel': { fr: 'Quantité vendue', en: 'Quantity sold' },
  'exploration.removeFragmentAria': { fr: 'Retirer un fragment de la vente', en: 'Remove one fragment from the sale' },
  'exploration.fragmentCountAria': { fr: 'Nombre de fragments à vendre', en: 'Number of fragments to sell' },
  'exploration.addFragmentAria': { fr: 'Ajouter un fragment à la vente', en: 'Add one fragment to the sale' },
  'exploration.fragmentsAvailable': { fr: '{n} fragment{s} disponible{s}.', en: '{n} fragment{s} available.' },
  'exploration.forFragmentsSold': {
    fr: 'pour {n} fragment{s} vendu{s}',
    en: 'for {n} fragment{s} sold',
  },
  'exploration.reserveAfterStep': {
    fr: 'Wyrdstone en réserve après cette étape : {n} · Trésorerie : {po} po',
    en: 'Wyrdstone in reserve after this step: {n} · Treasury: {po} gc',
  },
  'exploration.veteranPointsTitle': { fr: 'Nombre de points vétéran disponibles', en: 'Number of veteran points available' },
  'exploration.veteranPointsNote': {
    fr: 'Jet de 2D6 effectué sur table papier — saisis le résultat ici pour qu\'il apparaisse dans le journal de la bataille.',
    en: "Roll of 2D6 made on your tabletop — enter the result here so it appears in the battle's journal.",
  },
  'exploration.veteranPointsLabel': { fr: 'Points vétéran', en: 'Veteran points' },
  'exploration.bandSourceLabel': { fr: 'Bande', en: 'Warband' },
  'exploration.pendingEffectSourceLabel': { fr: 'Effet en attente', en: 'Pending effect' },
  'exploration.extraDiceNote': {
    fr: "Vous bénéficiez de {n} dé(s) supplémentaire(s) lors de cette phase d'exploration.",
    en: 'You get {n} extra {dice} during this exploration phase.',
  },
};

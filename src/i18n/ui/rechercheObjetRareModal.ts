import type { UiDictionary } from './types';

export const rechercheObjetRareModal: UiDictionary = {
  'rareModal.title': { fr: "Recherche d'un objet rare — {nom}", en: 'Rare item search — {nom}' },
  'rareModal.close': { fr: 'Fermer', en: 'Close' },
  'rareModal.intro': {
    fr: "Choisis l'objet recherché, puis indique si le test de rareté (2D6 sur table papier) est réussi ou raté. Ce Héros ne dispose que d'un seul jet pendant cette séquence.",
    en: 'Choose the item you are searching for, then indicate whether the rarity roll (2D6 on your tabletop) succeeded or failed. This Hero only gets a single roll during this sequence.',
  },
  'rareModal.searchPlaceholder': { fr: 'Rechercher un objet rare…', en: 'Search for a rare item…' },
  'rareModal.noMatch': { fr: 'Aucun objet rare correspondant.', en: 'No matching rare item.' },
  'rareModal.rareLevel': { fr: 'Rare {n}', en: 'Rare {n}' },
  'rareModal.backToCatalogue': { fr: '← Catalogue', en: '← Catalogue' },
  'rareModal.succeedsOn': {
    fr: 'Réussi sur un résultat de 2D6 supérieur ou égal à {n}.',
    en: 'Succeeds on a 2D6 result of {n} or higher.',
  },
  'rareModal.blackPowderBonus': {
    fr: 'Seuil déjà réduit de {n} : Entretien impeccable (armes à poudre noire, Artilleurs de Nuln).',
    en: 'Threshold already lowered by {n}: Well-Kept Weapons (black powder weapons, Gunnery School of Nuln).',
  },
  'rareModal.marienburgersBonus': {
    fr: 'Seuil déjà réduit de {n} : Bonus Rare +1 (guildes de marchands de Marienburg).',
    en: 'Threshold already lowered by {n}: +1 Rare Bonus (Marienburg merchant guilds).',
  },
  'rareModal.success': { fr: 'Réussi', en: 'Succeeded' },
  'rareModal.failure': { fr: 'Raté', en: 'Failed' },
  'rareModal.costPaidLabel': { fr: 'Coût payé (po)', en: 'Cost paid (gc)' },
  'rareModal.notationSuffix': { fr: ' — notation : {notation}', en: ' — roll: {notation}' },
  'rareModal.treasuryAvailable': { fr: 'Trésorerie disponible : {n} po.', en: 'Treasury available: {n} gc.' },
  'rareModal.insufficientTreasury': { fr: 'Trésorerie insuffisante.', en: 'Insufficient treasury.' },
  'rareModal.trinketLimitReached': {
    fr: 'Limite atteinte : cet objet est limité à un exemplaire par bande.',
    en: 'Limit reached: this item is limited to one copy per warband.',
  },
  'rareModal.cancel': { fr: 'Annuler', en: 'Cancel' },
  'rareModal.dontBuy': { fr: 'Ne pas acheter', en: "Don't buy" },
  'rareModal.buyAndFinish': { fr: 'Acheter et terminer', en: 'Buy and finish' },
};

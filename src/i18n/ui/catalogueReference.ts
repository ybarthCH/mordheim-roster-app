import type { UiDictionary } from './types';

export const catalogueReference: UiDictionary = {
  'catalogueReference.equipmentTitle': { fr: 'Équipement de la bande (référence)', en: 'Warband equipment (reference)' },
  'catalogueReference.equipmentIntro': {
    fr: "Objets propres à cette bande uniquement — texte libre, à titre indicatif. Les objets courants s'achètent directement depuis la fiche personnage.",
    en: 'Items specific to this warband only — free text, for reference only. Common items can be bought directly from the character sheet.',
  },
  'catalogueReference.rareItems': { fr: 'Objets rares', en: 'Rare items' },
  'catalogueReference.gc': { fr: 'po', en: 'gc' },
  'catalogueReference.magieReferenceSuffix': { fr: '(référence)', en: '(reference)' },
  'catalogueReference.die': { fr: 'dé', en: 'die' },
  'catalogueReference.users': { fr: 'utilisateurs :', en: 'users:' },
  'catalogueReference.hiredSwordsTitle': { fr: 'Francs-tireurs disponibles (référence)', en: 'Available hired swords (reference)' },
  'catalogueReference.hiredSwordsIntro': {
    fr: "Francs-tireurs que cette bande peut engager en principe — liste indicative, sans tenir compte de l'état actuel du roster (déjà engagé, incompatibilités...). Voir « Engager un franc-tireur » pour un recrutement effectif.",
    en: "Hired Swords this warband can hire in principle — indicative list, not accounting for the roster's current state (already hired, incompatibilities...). See \"Hire a Hired Sword\" for actual recruitment.",
  },
  'catalogueReference.hiredSwordHireCost': { fr: 'engagement', en: 'hire' },
  'catalogueReference.hiredSwordValue': { fr: 'valeur', en: 'value' },
  'catalogueReference.hiredSwordUpkeepDoubled': {
    fr: 'actuellement {n} po pour cette bande',
    en: 'currently {n} gc for this warband',
  },
};

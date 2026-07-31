import type { UiDictionary } from './types';

export const rechercheDramatisPersonaeModal: UiDictionary = {
  'dpModal.title': { fr: "Recherche d'un Dramatis Personae — {nom}", en: 'Dramatis Personae search — {nom}' },
  'dpModal.close': { fr: 'Fermer', en: 'Close' },
  'dpModal.intro': {
    fr: "À la place d'un objet rare, ce Héros peut tenter de retrouver la trace d'un personnage spécial. Consulte la table de recherche de ta règle papier, puis déclare si le test est réussi ou raté. Ce Héros ne dispose que d'un seul jet pendant cette séquence.",
    en: 'Instead of a rare item, this Hero can try to track down a special character. Check the search table in your rulebook, then declare whether the roll succeeded or failed. This Hero only gets a single roll during this sequence.',
  },
  'dpModal.noneAvailable': { fr: 'Aucun Dramatis Personae disponible pour cette bande en ce moment.', en: 'No Dramatis Personae available for this warband right now.' },
  'dpModal.recruitmentSubtitle': { fr: 'Recrutement : {cout} CO · Valeur de bande : +{valeur}', en: 'Recruitment: {cout} gc · Warband rating: +{valeur}' },
  'dpModal.backToList': { fr: '← Liste', en: '← List' },
  'dpModal.recruitedWith': { fr: 'Recruté avec {nom}', en: 'Recruited with {nom}' },
  'dpModal.recruitedWithNote': {
    fr: 'les deux rejoignent la bande ensemble pour ce prix, et la quittent ensemble.',
    en: 'both join the warband together for this price, and leave together.',
  },
  'dpModal.equipmentLabel': { fr: 'Équipement :', en: 'Equipment:' },
  'dpModal.success': { fr: 'Réussi', en: 'Succeeded' },
  'dpModal.failure': { fr: 'Raté', en: 'Failed' },
  'dpModal.recruitmentCost': { fr: 'Coût de recrutement : {cout} CO.', en: 'Recruitment cost: {cout} gc.' },
  'dpModal.treasuryAvailable': { fr: 'Trésorerie disponible : {n} po.', en: 'Treasury available: {n} gc.' },
  'dpModal.insufficientTreasury': { fr: 'Trésorerie insuffisante.', en: 'Insufficient treasury.' },
  'dpModal.cancel': { fr: 'Annuler', en: 'Cancel' },
  'dpModal.dontRecruit': { fr: 'Ne pas recruter', en: "Don't recruit" },
  'dpModal.recruitAndFinish': { fr: 'Recruter et terminer', en: 'Recruit and finish' },
};

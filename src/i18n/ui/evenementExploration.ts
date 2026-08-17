import type { UiDictionary } from './types';

export const evenementExploration: UiDictionary = {
  'evenement.resolveTitle': { fr: 'Résoudre un événement (double, triple…)', en: 'Resolve an event (double, triple…)' },
  'evenement.intro': {
    fr: "Si ton jet d'exploration comporte un double, triple, quadruple, quintuple ou sextuple, sélectionne-le ici pour consulter l'événement correspondant sans rouvrir le livret.",
    en: 'If your exploration roll includes a double, triple, quadruple, quintuple, or sextuple, select it here to view the corresponding event without reopening the rulebook.',
  },
  'evenement.selectD6Result': { fr: 'Sélectionne le résultat obtenu sur le D6 :', en: 'Select the result obtained on the D6:' },
  'evenement.elementHeader': { fr: 'Élément', en: 'Element' },
  'evenement.resultRequiredHeader': { fr: 'Résultat requis', en: 'Result required' },
  'evenement.actionHeader': { fr: 'Action', en: 'Action' },
  'evenement.goldRollNotation': { fr: 'Jet or ({notation}) :', en: 'Gold roll ({notation}):' },
  'evenement.tier.doubles': { fr: 'Doubles', en: 'Doubles' },
  'evenement.tier.triples': { fr: 'Triples', en: 'Triples' },
  'evenement.tier.quadruples': { fr: 'Quadruples', en: 'Quadruples' },
  'evenement.tier.quintuples': { fr: 'Quintuples', en: 'Quintuples' },
  'evenement.tier.sextuples': { fr: 'Sextuples', en: 'Sextuples' },
  'evenement.journalGold': { fr: '{prefix} : +{valeur} po ({notation}).', en: '{prefix} : +{valeur} gc ({notation}).' },
  'evenement.journalItemAdded': {
    fr: '{prefix} : {item}{quantitySuffix} ajouté(e) au stock.',
    en: '{prefix} : {item}{quantitySuffix} added to stock.',
  },
  'evenement.journalFragments': {
    fr: '{prefix} : +{valeur} fragment{s} de pierre magique ({notation}).',
    en: '{prefix} : +{valeur} wyrdstone shard{s} ({notation}).',
  },
};

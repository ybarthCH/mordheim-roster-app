import type { UiDictionary } from './types';

export const etapeEntretien: UiDictionary = {
  'entretien.title': { fr: 'Entretien des francs-tireurs', en: 'Hired sword upkeep' },
  'entretien.noneHired': { fr: 'Aucun franc-tireur engagé, aucune solde à payer.', en: 'No hired sword engaged, no wages to pay.' },
  'entretien.intro': {
    fr: "La prime d'engagement couvrait le recrutement, pas cette solde. Choisis qui reste sous contrat ; un franc-tireur renvoyé quitte immédiatement la bande et perd son expérience.",
    en: "The hiring fee covered recruitment, not these wages. Choose who stays under contract; a dismissed hired sword leaves the warband immediately and loses their experience.",
  },
  'entretien.goldCoins': { fr: '{n} CO', en: '{n} gc' },
  'entretien.fragments': { fr: '{n} fragment{s}', en: '{n} fragment{s}' },
  'entretien.noUpkeep': { fr: 'Sans entretien', en: 'No upkeep' },
  'entretien.automaticDeparture': { fr: 'Départ automatique :', en: 'Automatic departure:' },
  'entretien.oneBattleOnly': { fr: 'ce contrat ne couvrait qu\'une seule bataille.', en: 'this contract only covered a single battle.' },
  'entretien.staysWithoutPayment': { fr: 'Le profil reste dans la bande sans paiement.', en: 'The profile stays in the warband without payment.' },
  'entretien.payAndKeep': { fr: 'Payer et conserver', en: 'Pay and keep' },
  'entretien.dontPayDismiss': { fr: 'Ne pas payer — renvoyer', en: "Don't pay — dismiss" },
  'entretien.exemptionLabel': { fr: 'Exemption : {label}', en: 'Exemption: {label}' },
  'entretien.keepWithoutPaying': { fr: 'Conserver sans payer', en: 'Keep without paying' },
  'entretien.totalLine': {
    fr: 'Total à payer : {or} CO{malepierre}.',
    en: 'Total to pay: {or} gc{malepierre}.',
  },
  'entretien.andFragments': { fr: ' et {n} fragment(s) de malepierre', en: ' and {n} warpstone fragment(s)' },
  'entretien.availableAfterExploration': {
    fr: 'Disponibles après exploration : {or} CO et {malepierre} fragment(s).',
    en: 'Available after exploration: {or} gc and {malepierre} fragment(s).',
  },
  'entretien.insufficientResources': {
    fr: 'Ressources insuffisantes : renvoie un ou plusieurs francs-tireurs, ou applique une exemption valide.',
    en: 'Insufficient resources: dismiss one or more hired swords, or apply a valid exemption.',
  },
  'entretien.surtaxePiratesTitle': { fr: 'Supplément « Nains et Elfes »', en: '"Dwarfs and Elves" surcharge' },
  'entretien.surtaxePiratesTexte': {
    fr: "La bande compte à la fois des francs-tireurs Nains et Elfes : le navire n'est pas si grand, et l'espace restreint les rend plus irritables que d'habitude !",
    en: "The warband has both Dwarf and Elf hired swords aboard: the ship isn't that big, and the cramped quarters make them crankier than usual!",
  },
};

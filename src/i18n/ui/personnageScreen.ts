import type { UiDictionary } from './types';

export const personnageScreen: UiDictionary = {
  'personnage.notFoundTitle': { fr: 'Personnage introuvable', en: 'Character not found' },
  'personnage.notFoundBody': { fr: "Ce personnage n'existe pas (ou plus).", en: "This character doesn't exist (or no longer exists)." },
  'personnage.profileSpecialRules': { fr: 'Règles spéciales du profil', en: 'Profile special rules' },
  'personnage.skills': { fr: 'Compétences', en: 'Skills' },
  'personnage.notes': { fr: 'Notes', en: 'Notes' },
  'personnage.bigTarget': { fr: 'Grande Cible', en: 'Big Target' },
  'personnage.bigTargetNote': {
    fr: 'Case manuelle — ajoute +20 au rating de ce personnage.',
    en: "Manual checkbox — adds +20 to this character's rating.",
  },
  'personnage.removeButton': { fr: 'Retirer ce personnage de la bande', en: 'Remove this character from the warband' },
  'personnage.sellTitlePrefix': { fr: 'Vendre', en: 'Sell' },
  'personnage.sellBodyMultiplePrefix': {
    fr: "Les {n} exemplaires seront retirés de l'inventaire du groupe et",
    en: "The {n} copies will be removed from the group's inventory and",
  },
  'personnage.sellBodySingle': { fr: "L'objet sera retiré de l'inventaire et", en: 'The item will be removed from the inventory and' },
  'personnage.sellBodySuffix': {
    fr: '{total} po seront ajoutées à la trésorerie de la bande.',
    en: "{total} gc will be added to the warband's treasury.",
  },
  'personnage.cancel': { fr: 'Annuler', en: 'Cancel' },
  'personnage.sellForPrefix': { fr: 'Vendre pour', en: 'Sell for' },
  'personnage.removeConfirmTitlePrefix': { fr: 'Retirer', en: 'Remove' },
  'personnage.removeConfirmBody': {
    fr: 'Cette action supprime définitivement ce personnage du roster.',
    en: 'This action permanently removes this character from the roster.',
  },
  'personnage.remove': { fr: 'Retirer', en: 'Remove' },
  'personnage.editAdvanceTitle': { fr: 'Modifier cette avancée ?', en: 'Edit this advance?' },
  'personnage.editAdvanceRollPrefix': { fr: 'jet', en: 'roll' },
  'personnage.editAdvanceReversibleBody': {
    fr: "Cela annule l'effet de cette avancée (caractéristique, compétence ou sort) et la retire de l'historique. Elle redeviendra disponible sous « Résoudre une avancée » pour être relancée.",
    en: 'This cancels the effect of this advance (characteristic, skill, or spell) and removes it from the history. It will become available again under "Resolve an advance" to be rolled again.',
  },
  'personnage.cancelAdvance': { fr: 'Annuler cette avancée', en: 'Cancel this advance' },
  'personnage.editAdvanceIrreversibleBody': {
    fr: "Ce type d'avancée (promotion en héros ou récompense du Seigneur des Ombres) a des effets trop étendus pour être annulé automatiquement. Contacte-moi si tu as besoin d'aide pour corriger ça à la main.",
    en: 'This type of advance (promotion to hero or Lord of the Shadows reward) has effects too extensive to be cancelled automatically. Get in touch if you need help fixing this by hand.',
  },
  'personnage.close': { fr: 'Fermer', en: 'Close' },
};

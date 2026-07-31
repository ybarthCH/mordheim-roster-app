import type { UiDictionary } from './types';

export const reglagesScreen: UiDictionary = {
  'reglages.title': { fr: 'Réglages', en: 'Settings' },
  'reglages.appearance': { fr: 'Apparence', en: 'Appearance' },
  'reglages.theme': { fr: 'Thème', en: 'Theme' },
  'reglages.theme.light': { fr: 'Clair', en: 'Light' },
  'reglages.theme.dark': { fr: 'Sombre', en: 'Dark' },
  'reglages.theme.system': { fr: 'Système', en: 'System' },
  'reglages.accentColor': { fr: "Couleur d'accent", en: 'Accent color' },
  'reglages.palette.rouge': { fr: 'Rouge', en: 'Red' },
  'reglages.palette.noir': { fr: 'Noir & Gris', en: 'Black & Grey' },
  'reglages.wakeLock.title': { fr: "Garder l'écran allumé", en: 'Keep screen awake' },
  'reglages.wakeLock.body': {
    fr: "Empêche l'appareil de se mettre en veille tant que l'appli est ouverte — pratique en table de jeu.",
    en: 'Prevents the device from sleeping while the app is open — handy at the gaming table.',
  },
  'reglages.wakeLock.unsupported': {
    fr: ' Non pris en charge par ce navigateur.',
    en: ' Not supported by this browser.',
  },
  'reglages.optionalRules': { fr: 'Règles optionnelles', en: 'Optional rules' },
  'reglages.optionalRules.intro': {
    fr: "Ces choix sont mémorisés sur cet appareil et s'appliquent à toutes les bandes.",
    en: 'These choices are remembered on this device and apply to all warbands.',
  },
  'reglages.poudreNoire.title': { fr: 'Règles avancées de poudre noire', en: 'Advanced black powder rules' },
  'reglages.poudreNoire.body': {
    fr: "Réduit d'environ 33 % le prix des armes à poudre noire, arrondi au multiple de 5 le plus proche. Les Artilleurs de Nuln utilisent toujours ces prix réduits, même si cette option est désactivée.",
    en: 'Reduces the price of black powder weapons by roughly 33%, rounded to the nearest multiple of 5. The Gunnery School of Nuln always uses these reduced prices, even if this option is disabled.',
  },
  'reglages.lozheim.title': { fr: 'Règle Maison Lozheim', en: 'Lozheim House Rule' },
  'reglages.lozheim.body': {
    fr: "Les armures sont à 50 % du prix normal et donnent +1 à la sauvegarde d'armure. Les boucliers, casques, cuirs durcis, pavois et rondaches ne sont pas concernés ; les caparaçons le sont.",
    en: 'Armour costs 50% of its normal price and grants +1 to the armour save. Shields, helmets, toughened leathers, pavises, and bucklers are not affected; barding is.',
  },
  'reglages.trinkets.title': { fr: 'Règle Maison Trinket limité', en: 'Limited Trinkets House Rule' },
  'reglages.trinkets.body': {
    fr: 'Porte-bonheur, Herbes de soin, Patte de lapin et leurs variantes, Familiers et Reliques sacrées ou impies sont limités à un exemplaire de chaque par bande, afin que les relances et sécurités restent rares et que les échecs conservent leur poids.',
    en: "Lucky Charms, Healing Herbs, Rabbit's Foot and their variants, Familiars, and Holy or Unholy Relics are limited to one of each per warband, so re-rolls and safety nets stay rare and failures keep their weight.",
  },
  'reglages.sawbones.title': { fr: "Quoi de neuf, docteur ? (Sawbones)", en: "What's Up, Doc? (Sawbones)" },
  'reglages.sawbones.body': {
    fr: "Active le supplément du médecin pendant l'étape Commerce de la séquence post-bataille. Un Héros peut payer 20 po pour tenter de soigner une blessure au lieu de rechercher un objet rare.",
    en: 'Enables the doctor supplement during the Trading step of the post-battle sequence. A Hero may pay 20 gc to attempt to heal an injury instead of searching for a rare item.',
  },
  'reglages.dramatisPersonae.title': { fr: 'Dramatis Personae', en: 'Dramatis Personae' },
  'reglages.dramatisPersonae.body': {
    fr: "Active la recherche de Dramatis Personae pendant l'étape Commerce de la séquence post-bataille. Un Héros peut tenter de retrouver l'un de ces personnages spéciaux au lieu de rechercher un objet rare.",
    en: 'Enables searching for Dramatis Personae during the Trading step of the post-battle sequence. A Hero may attempt to track down one of these special characters instead of searching for a rare item.',
  },
};

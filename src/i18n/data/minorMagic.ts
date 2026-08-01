import type { Language } from '../../state/useLanguage';
import type { Magie } from '../../types/catalog';
import { MAGIE_MINEURE } from '../../data/minorMagic';
import { translateMagie } from './warbands';
import type { MagieTraduite } from './warbands';

// Traduction anglaise de la Magie mineure (utilisée notamment par les Mages
// francs-tireurs) — même principe de repli progressif que translateItem.
const magieMineureEn: MagieTraduite = {
  nom: 'Petty Magic',
  note: 'Used notably by freelance Mages and accessible via the Grimoire of Magic.',
  sorts: [
    {
      nom: 'Flames of U’Zhul',
      texte:
        'Range 18". The first model in the path of the fireball suffers a Strength 4 hit. Armour saves work normally, with a -1 penalty.',
    },
    {
      nom: 'Flight of Zimmeran',
      texte:
        'The mage may immediately move anywhere within 12", even into contact with an enemy, in which case he counts as having charged. If he engages a fleeing enemy, he inflicts an automatic hit during the close combat phase, and the opponent flees again if he survives.',
    },
    {
      nom: 'Aramar’s Fear',
      texte:
        'A single model within 12" of the mage must pass a Leadership test or flee 2D6" in the opposite direction. If it flees, it tests at the start of each of its movement phases and keeps fleeing until it passes. Has no effect on undead or models immune to fear.',
    },
    {
      nom: 'Arha’s Silver Arrows',
      texte:
        'Cannot be cast if the wizard is in close combat. Creates D6+2 arrows usable to shoot at an enemy model following normal shooting rules. Range 24", uses the mage’s Ballistic Skill and ignores movement, range and cover penalties. Each arrow causes a Strength 3 hit.',
    },
    {
      nom: 'Shemtek’s Luck',
      texte:
        'The mage may re-roll all his failed rolls, but the second result must always be kept. The effects last until the start of his next turn.',
    },
    {
      nom: 'Rehebel’s Blade',
      texte:
        'A flaming sword grants the mage +1 Attack, +2 Strength and +2 Weapon Skill. The mage must pass a Leadership test at the start of each of his turns; the sword vanishes if he fails.',
    },
  ],
};

export function magieMineure(language: Language): Magie {
  return translateMagie(MAGIE_MINEURE, language === 'en' ? magieMineureEn : undefined);
}

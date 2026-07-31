import type { Language } from '../../state/useLanguage';

// Traductions anglaises des compétences (src/data/skills.json), indexées par
// id. Complète translateSkill() ci-dessous ; toute compétence absente de ce
// dictionnaire retombe simplement sur le texte français.
export const skillsEn: Record<string, { nom: string; texte: string }> = {
  combat_01: {
    nom: 'Strike to Injure',
    texte:
      'The warrior can land his blows with uncanny accuracy. Add +1 to all injury rolls caused by the model in hand-to-hand combat.',
  },
  combat_02: {
    nom: 'Combat Master',
    texte:
      "The warrior can hold his own against several opponents at once. He gains an extra attack in every hand-to-hand phase as long as he is fighting two or more enemies. He is also immune to 'All Alone' tests.",
  },
  combat_03: {
    nom: 'Weapons Training',
    texte:
      'The warrior knows how to wield many different weapons perfectly. He may use any hand-to-hand weapon, not just those among his equipment options.',
  },
  combat_04: {
    nom: 'Web of Steel',
    texte:
      'Few can match the ability of this warrior. He fights with great skill, weaving a web of steel around him. The model gains +1 to all his rolls on Critical Hit tables in hand-to-hand combat.',
  },
  combat_05: {
    nom: 'Expert Swordsman',
    texte:
      'This warrior was trained by a great master in the art of swordsmanship. If he uses a sword, he may re-roll failed attacks during the hand-to-hand phase of the turn he charges. Note that he only enjoys this bonus when using an ordinary sword or an oozing blade, not a two-handed sword or any other weapon.',
  },
  combat_06: {
    nom: 'Step Aside',
    texte:
      'The warrior knows how to dodge blows in combat. Each time he suffers a wound, he may attempt an additional 5+ save. This save is never modified and is taken after all other armour saves.',
  },
  tir_01: {
    nom: 'Quick Shot',
    texte: 'The warrior may fire twice per turn with a bow or crossbow (but not with a crossbow pistol).',
  },
  tir_02: {
    nom: 'Pistolier',
    texte:
      'The warrior is an expert with pistols of all kinds, including crossbow pistols. If equipped with a pair of pistols of any type (including crossbow pistols), he may fire twice during the shooting phase (note that the usual reload rules still apply). If he has only one pistol, he may fire it even during the turn he reloaded it.',
  },
  tir_03: {
    nom: 'Eagle Eyes',
    texte: 'The warrior has exceptionally sharp eyesight. He adds +6" to the range of any missile weapon (except a blunderbuss) he uses.',
  },
  tir_04: {
    nom: 'Weapons Expert',
    texte:
      'The warrior has learned to use some of the strangest weapons in the Old World. He may use any missile weapon, not just those among his equipment options.',
  },
  tir_05: {
    nom: 'Nimble',
    texte:
      'The warrior may move and fire with weapons that are normally only used if the firer has not moved. Note that this skill cannot be combined with the Quick Shot skill.',
  },
  tir_06: {
    nom: 'Trick Shooter',
    texte: 'The warrior can shoot through the tiniest gap without it affecting his aim. He ignores all modifiers for cover when using missile weapons.',
  },
  tir_07: {
    nom: 'Hunter',
    texte:
      'The warrior is perfectly trained at loading and priming his weapon. He may fire every turn even with an arquebus or a Hochland long rifle.',
  },
  tir_08: {
    nom: 'Knife-Fighter',
    texte:
      'The warrior is an unrivalled expert at using throwing knives and throwing stars. He can throw a maximum of three of these missiles in his shooting phase and may divide his shots between any targets within range as he wishes. Note that this skill cannot be combined with the Quick Shot skill.',
  },
  force_01: {
    nom: 'Mighty Blow',
    texte:
      "The warrior knows how to put his muscles to good use and gains a +1 Strength bonus in hand-to-hand combat (except with pistols). This bonus therefore also applies to the Strength of hand-to-hand weapons, which depends on their user's.",
  },
  force_02: {
    nom: 'Pit Fighter',
    texte:
      'The warrior learned to fight in confined spaces while wrestling in the arenas of the Empire. He gains +1 Weapon Skill and +1 Attack if he fights in a building or ruins. We recommend clearly defining before the battle which terrain features fall into this category.',
  },
  force_03: {
    nom: 'Resilient',
    texte:
      'The warrior is covered in battle scars. Deduct -1 Strength from all hits against him in close combat. This does not affect armour save modifiers.',
  },
  force_04: {
    nom: 'Fearsome',
    texte: "The warrior's reputation and appearance are such that he causes fear in his enemies.",
  },
  force_05: {
    nom: 'Strongman',
    texte:
      'The warrior has great physical strength and can wield a two-handed weapon without having to strike last. Determine strike order as with other weapons.',
  },
  force_06: {
    nom: 'Unstoppable Charge',
    texte: 'When he charges, the warrior is almost impossible to halt. He adds +1 to his Weapon Skill when charging.',
  },
  academique_01: {
    nom: 'Battle Tongue',
    texte:
      "Only a leader may choose this skill. He gives his orders through brief shouts his warband understands. This increases the range of his leadership ability (lending his Leadership) by 6\". Undead cannot use this skill.",
  },
  academique_02: {
    nom: 'Sorcery',
    texte:
      'This skill may only be taken by Heroes capable of casting spells. A warrior with this skill gains +1 to his rolls to see whether he can cast spells successfully or not. Note that Sisters of Sigmar and Warrior Priests may not have this skill.',
  },
  academique_03: {
    nom: 'Streetwise',
    texte:
      'A warrior with this skill has good contacts and knows where to purchase rare items. He may add +2 to the roll that determines his chances of finding such items (see the Trading section).',
  },
  academique_04: {
    nom: 'Haggle',
    texte:
      'The warrior knows all about bargaining and haggling. He may deduct 2D6 gold crowns from the price of a single item once per post-battle sequence (down to a minimum of 1 gold crown).',
  },
  academique_05: {
    nom: 'Arcane Lore',
    texte:
      'Witch Hunters, Sisters of Sigmar or Warrior Priests may not have this skill. Any Hero with this skill may learn Lesser Magic if he owns a Tome of Magic.',
  },
  academique_06: {
    nom: 'Wyrdstone Hunter',
    texte:
      'The warrior has an uncanny ability to find hidden shards of wyrdstone. If a Hero with this skill is searching the ruins in the exploration phase, you may re-roll one die when rolling on the Exploration chart. The second result stands.',
  },
  academique_07: {
    nom: 'Warrior Wizard',
    texte: 'Only a spellcaster may choose this skill, which lets him cast spells while wearing armour.',
  },
  academique_08: {
    nom: 'Tactician',
    texte:
      'Only a Leader may have this skill. Whatever the scenario, he may reposition his men at the end of the opponent\'s Deployment and may even advance them up to 12" from the table edge instead of 8".',
  },
  academique_09: {
    nom: 'Insight',
    texte:
      'Only a Leader may have this skill. Whatever the scenario, he may reposition three of his fighters (able to gain experience) within a piece of terrain (ruined building, woods...). It must be located more than 12" from any enemy model and outside the enemy\'s initial Deployment zone.',
  },
  academique_10: {
    nom: 'Beast Handler',
    texte:
      'This skill is highly beneficial if non-ridden animals are to be included in a warband. This skill must be taken for specific animals and may be taken multiple times for different animals. It represents knowledge of the general care and well being of the animal as well as training techniques. A warrior with this skill has a beneficial effect on the animals under his care. If a warrior has the Animal Handling skill for a particular animal, any such animals may use his Leadership provided he is within 6". If the warband\'s leader is also nearby, a player may choose which of the warriors\' Leadership to use unless the animal is stupid, in which case only the Handler\'s Leadership may be used. In addition, stubborn animals with a Handler in base contact ignore the effects of stubbornness. This counts as an Academic skill.',
  },
  academique_11: {
    nom: 'Concentration',
    texte:
      'This skill can only be acquired by a fighter able to cast spells or prayers. He may re-roll one of the two dice of his casting or prayer rolls.',
  },
  academique_12: {
    nom: 'Aptitude for Magic',
    texte:
      "This skill may only be chosen by a Hero able to cast spells (unavailable to Sisters of Sigmar and Warrior Priests). The wizard may attempt to cast two spells per turn, provided he is not engaged in hand-to-hand combat. However, after the first attempt, he must pass a Toughness test to make his second attempt (with another spell or the same one). If the Toughness test fails, immediately roll on the Injury Table, with no armour save, treating any Knocked Down result as Stunned.",
  },
  academique_13: {
    nom: 'Scribe',
    texte:
      'Any warrior able to cast spells or use prayers may choose this skill. It lets him write a scroll before the battle, inscribing a single spell or prayer he knows onto it. The scroll may be used before casting that spell or prayer and grants a +2 bonus to the casting roll. The scroll is single-use and crumbles to dust after use. It also cannot be kept for later and can only be used during the following battle.',
  },
  vitesse_01: {
    nom: 'Leap',
    texte:
      "The warrior may leap D6\" during his movement phase in addition to his normal move. He may move and leap, run and leap, or charge and leap, but in every case he may only leap once per turn. The warrior may leap without penalty over obstacles up to 1\" high and over human-sized models, even enemy ones. A leap may also clear gaps, but in that case you must declare the attempt before rolling the die for how far he jumps. If he fails to reach the other side, he falls.",
  },
  vitesse_02: {
    nom: 'Sprint',
    texte: 'The warrior may triple his Movement rate when running or charging, rather than doubling it as normal.',
  },
  vitesse_03: {
    nom: 'Acrobat',
    texte:
      'The warrior is incredibly supple and agile. He may fall or jump without harm from a height of up to 12" if he passes a single Initiative test, and may re-roll failed diving charge rolls. He can still only make a diving charge from a maximum height of 6".',
  },
  vitesse_04: {
    nom: 'Lightning Reflexes',
    texte:
      'If the warrior is charged, he strikes first against the enemies who charged him. Since those enemies also strike first (because of their charge), the strike order between charger and charged is determined by their respective Initiatives.',
  },
  vitesse_05: {
    nom: 'Jump Up',
    texte:
      'The warrior can regain his footing in an instant, springing to his feet immediately if he is knocked down. The warrior may ignore knocked down results when rolling for injuries, unless he is knocked down because of a successful save from wearing a helmet or because he has the No Pain special rule.',
  },
  vitesse_06: {
    nom: 'Dodge',
    texte:
      "The warrior is agile and quick as quicksilver. He can avoid a shot on a 5+ on 1D6. Note that this roll is made as soon as a hit is scored, before rolling to wound and before determining the effects of other skills or equipment (such as Lucky Charms).",
  },
  vitesse_07: {
    nom: 'Scale Sheer Surfaces',
    texte:
      'A warrior with this skill can scale even the highest wall or fence with ease. He can climb up or down a height equal to twice his normal Movement, and does not need to make Initiative tests when doing so.',
  },
  equitation_01: {
    nom: 'Ride',
    texte:
      "This skill is vital if a rider wishes to ride an animal into combat. The skill is specific to a type of animal and must be gained again if the warrior wishes to be able to ride a different kind of animal. For instance, a warrior with the skill Ride Horse would need to gain the skill Ride Warhorse if he wanted to be able to ride such a spirited mount. Special Riding Skills may be used by warriors who have a riding animal, but only after the skill Ride has been gained; warriors which come provided with a riding animal are assumed to possess the Ride skill already.",
  },
  equitation_02: {
    nom: 'Cavalry Commander',
    texte:
      "Mounted Heroes are an impressive sight. With a good vantage point, they can see (and be seen) far more readily than if they were on foot. If the warband's leader has this skill and is mounted, he may add an extra 6\" to the distance within which other warriors in the warband may use his Leadership. This is in addition to any other bonuses that increase the range of the leader's influence.",
  },
  equitation_03: {
    nom: 'Athletic Mount',
    texte:
      "Without breaking stride, the warrior is able to leap onto the back of his mount and immediately spur it into a full gallop. Once the warrior is on board, the mount may make a run or charge move as normal. The warrior must be within half his full move distance of his steed to use this skill.",
  },
  equitation_04: {
    nom: 'Running Dismount',
    texte:
      "The rider is able to dismount from his mount at speed. The rider may ride up the mount's normal move distance and then dismount immediately. No further movement or shooting is possible. This skill may be used to move into contact with the enemy, counting as a diving charge from a height of 2\" – all the usual rules for diving charges apply. Note that the rider then counts as dismounted, gaining no further assistance from his mount. Warriors without Ride may not use this skill.",
  },
  equitation_05: {
    nom: 'Horse Archer',
    texte:
      'The rider has learned the skills of the steppe nomads and can shoot from a running mount. The rider may shoot in a 360 degree arc whilst mounted, and may shoot while his mount is running; however, the shot suffers a -1 to hit penalty in addition to all other normal modifiers. Warriors without Ride may not use this skill.',
  },
  equitation_06: {
    nom: 'Trick Riding',
    texte:
      "By athletically hanging off the side of his mount, a rider makes himself harder to hit. While a rider is trick riding all missile attacks against him suffer -1 to hit in addition to all other normal modifiers. The rider must declare that he is trick riding before moving. He must then make an Initiative test and, if successful, may move full distance. If he fails he loses control of his mount and must roll immediately on the Whoa Boy! table. This skill may not be used with heavy armour because of the agility required. In addition, trick riding requires both hands, so the model may not use a shield or missile weapons whilst using the skill. Warriors without Ride may not use this skill.",
  },
  equitation_07: {
    nom: 'Evade',
    texte:
      'The rider has trained his mount to swerve from side to side in combat, wrong-footing his opponent. A rider with this skill always strikes first in close combat against dismounted opponents. When charged by an opponent, or otherwise fighting an enemy also entitled to strike first, attacks are carried out in order of Initiative. If Initiative is equal, the model with greater Experience strikes first. Warriors without Ride may not use this skill.',
  },
  equitation_08: {
    nom: 'Combat Riding',
    texte:
      'The rider has trained his mount to use its bulk to trample any un-mounted enemy before him. A warrior with this skill may make a single additional Strength 4 attack when charging an unmounted opponent. In subsequent rounds of combat, or if charged by enemy warriors, the mounted warrior fights as normal.',
  },
  equitation_09: {
    nom: 'Mounted Combat Master',
    texte:
      "The rider is especially skilled at combat against a mounted opponent. If the model is fighting mounted against a mounted opponent and successfully wounds the enemy, the wounded model must add +1 to his roll on the Whoa Boy! table. Warriors without Ride may not use this skill.",
  },
};

// Traduit une compétence { id, nom, texte } quand la langue courante est
// 'en'. Retombe sur le texte français d'origine si la compétence n'a pas
// (encore) de traduction dans skillsEn — ex : compétences spéciales propres
// à une bande, pas encore traduites.
export function translateSkill<T extends { id: string; nom: string; texte?: string }>(
  skill: T,
  language: Language
): T {
  if (language !== 'en') return skill;
  const en = skillsEn[skill.id];
  if (!en) return skill;
  return { ...skill, nom: en.nom, texte: en.texte };
}

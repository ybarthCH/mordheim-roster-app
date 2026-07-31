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
    nom: 'Animal Handler',
    texte:
      'This skill is very useful if the warband includes combat animals. It must be taken for a specific animal species and can be taken multiple times, each time for a different species. It represents knowledge of animals\' needs and the techniques suited to training them. A warrior with this skill passes it on to the animals in his charge. Any animal within 6" of a model with the appropriate Animal Handler skill may use its Leadership instead of its own. If the warband Leader is also in range, the player chooses which Leadership is used, unless the animal is Stupid, in which case it may only use the handler\'s Leadership. In addition, Stubborn (or equivalent) animals in contact with the handler ignore the effects of this rule.',
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
    nom: 'Riding',
    texte:
      "This skill is vital for riding a mount into combat. It is specific to a given animal and must be learned again if the model wants to be able to ride another type of animal. For example, a model with the Riding – Horse skill would need to learn Riding – Warhorse to ride a mount with such a fiery temperament. Special Riding skills can be used by models with a mount, but only after first acquiring the Riding skill. Warriors equipped with a mount as standard equipment are considered to already have the Riding skill.",
  },
  equitation_02: {
    nom: 'Commanding Presence',
    texte:
      "The sight of a Leader perched on his mount is inspiring to the troops. From this elevated vantage point, the Hero can see (and be seen) far more easily. A mounted warband Leader with this skill may add 6\" to the distance at which other members of his warband can use his Leadership, in addition to any other bonus the model already enjoys.",
  },
  equitation_03: {
    nom: 'Vault into the Saddle',
    texte:
      "Without stopping, the warrior is able to vault into his mount's saddle before immediately spurring it into a triple gallop! Once the warrior is in the saddle, he may make a charge or a run with his mount normally. The model must be within 2\" of its mount to use this skill.",
  },
  equitation_04: {
    nom: 'Trotting Dismount',
    texte:
      "The rider is able to jump off his mount while it advances at a moderate pace. He may move a distance equal to his mount's normal Movement and dismount. No further movement or shooting is allowed afterwards. This skill can be used to reach base contact with the enemy. It then counts as a diving charge from a height of 2\" (all diving charge rules apply). Note that the rider then counts as being on foot and gains no benefit linked to his mount.",
  },
  equitation_05: {
    nom: 'Horse Archer',
    texte:
      'The rider has learned to shoot from the saddle from the nomads of the steppes and can do so from a mount at full gallop. The rider has a 360° firing arc while mounted and may fire even if his mount has moved up to double its normal Movement. However, this shot suffers a -1 to hit penalty in addition to any other modifier.',
  },
  equitation_06: {
    nom: 'Trick Riding',
    texte:
      "The warrior can hang from his saddle and lean against his mount's flank, making him hard to hit. While using this skill, all shots against him suffer a -1 to hit penalty. He must declare he is using it before moving and must then take an Initiative test. On a success, he may move normally. On a failure, he must roll on the Whoa There! table. This skill cannot be used with heavy armour. It also requires both hands, so the Hero cannot use a shield or a missile weapon while using it.",
  },
  equitation_07: {
    nom: 'Feint',
    texte:
      'The rider has trained his mount to manoeuvre in combat. A model with this skill always strikes first against opponents on foot. When charged, or when facing an enemy with the ability to always strike first, Attacks are resolved by Initiative. In case of a tie, whoever has more Experience strikes first.',
  },
  equitation_08: {
    nom: 'Trample',
    texte:
      'The rider has trained his mount to trample its opponents. A model with this skill may make an additional Strength 4 Attack when it charges an enemy on foot. In subsequent turns, or if it is the one being charged, it fights normally.',
  },
  equitation_09: {
    nom: 'Mounted Combat Expert',
    texte:
      "The model is formidable against enemy riders. If the model is mounted, fights an opponent who is also mounted, and manages to Wound him, his opponent must add +1 to the result of his roll on the Whoa There! table.",
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

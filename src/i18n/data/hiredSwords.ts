import type { Language } from '../../state/useLanguage';

type RegleTraduite = { nom: string; texte: string; exception?: string };
type CompetenceTraduite = { nom: string; texte: string; reserve_a?: string };
type ProfilSecondaireTraduit = { nom?: string; regles_speciales?: RegleTraduite[] };
type EntretienTraduit = {
  texte?: string;
  exemption?: { label: string; texte: string };
  maintien_sans_paiement?: string;
};

type HiredSwordTraduit = {
  nom?: string;
  entretien?: EntretienTraduit;
  employeurs?: { texte: string };
  equipement?: (string | undefined)[];
  regles_speciales?: RegleTraduite[];
  competences_speciales?: Record<string, CompetenceTraduite>;
  profils_secondaires?: ProfilSecondaireTraduit[];
};

// Traductions anglaises du catalogue des francs-tireurs (src/data/hiredSwords.ts)
// et des Dramatis Personae (src/data/dramatisPersonae.ts, qui rejoint le même
// catalogue FRANCS_TIREURS), indexées par id. Même principe de repli
// incrémental que itemsEn dans items.ts : tout champ/objet absent de ce
// dictionnaire retombe sur le texte français d'origine. Le texte anglais des
// entrées correspondant à un profil du "Mordheim Hired Sword Compendium" fan
// PDF reprend fidèlement les règles officielles de ce document ; les autres
// (sourcées d'autres suppléments) sont traduites naturellement depuis le
// français.
export const hiredSwordsEn: Record<string, HiredSwordTraduit> = {
  // --- Francs-tireurs (src/data/hiredSwords.ts) ---
  gladiateur: {
    nom: 'Pit Fighter',
    entretien: { texte: '15 gc after every battle he fights.' },
    equipement: ['Morning star', 'Spiked gauntlet', 'Helmet'],
    regles_speciales: [
      {
        nom: 'Spiked Gauntlet',
        texte:
          'Counts as both a buckler and an additional hand weapon. No other Hero may learn to use it.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  ogre: {
    nom: 'Ogre Bodyguard',
    entretien: { texte: '30 gc after every battle he fights.' },
    equipement: ['Two swords, axes or clubs (or any mix of them), or a double-handed weapon', 'Light armour'],
    regles_speciales: [
      { nom: 'Fear', texte: 'The Ogre causes fear.' },
      { nom: 'Large', texte: 'The Ogre is a large target.' },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  halfling: {
    nom: 'Halfling Scout',
    entretien: { texte: '5 gc after every battle he fights.' },
    equipement: ['Bow', 'Dagger', 'Cooking pot (counts as a helmet)'],
    regles_speciales: [
      {
        nom: 'Cook',
        texte: "Increases the warband's maximum size by +1. This does not increase the maximum number of Heroes.",
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  mage: {
    nom: 'Warlock',
    entretien: { texte: '15 gc after every battle he fights.' },
    equipement: ['Staff'],
    regles_speciales: [
      {
        nom: 'Wizard',
        texte:
          'Starts with two spells generated at random from the Lesser Magic list. When he gains a new skill, he may instead roll for a new Lesser Magic spell.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  chevalier_solitaire: {
    nom: 'Freelancer',
    entretien: { texte: '20 gc after every battle he fights.' },
    equipement: ['Heavy armour', 'Shield', 'Cavalry lance', 'Sword', 'Warhorse (mounted rules)'],
    regles_speciales: [
      {
        nom: 'Rider',
        texte:
          'With the optional mounted rules, he rides a warhorse and has the Ride skill. His save is 3+ mounted and 4+ on foot.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    profils_secondaires: [{ nom: 'Warhorse' }],
  },
  eclaireur_elfe: {
    nom: 'Elf Ranger',
    entretien: { texte: '20 gc, or 40 gc if the warband includes Dwarfs.' },
    equipement: ['Elf bow', 'Sword', 'Elven cloak'],
    regles_speciales: [
      {
        nom: 'Seeker',
        texte: 'When rolling on the Exploration chart, allows you to modify one dice roll by -1/+1.',
      },
      {
        nom: 'Excellent Sight',
        texte: 'Spots Hidden enemies from twice his Initiative value away, in inches.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      eclaireur_elfe_sagesse: { nom: 'Fey', texte: 'Hostile spells will not affect him on a D6 roll of 4+.' },
      eclaireur_elfe_chance: {
        nom: 'Luck',
        texte: 'Once per game he may re-roll any one of his own dice rolls.',
      },
    },
  },
  tueur_trolls_nain: {
    nom: 'Dwarf Troll Slayer',
    entretien: { texte: '10 gc, or 20 gc if the warband includes Elves.' },
    equipement: ['Two axes or a double-handed axe'],
    regles_speciales: [
      {
        nom: 'Deathwish',
        texte: 'Completely immune to all psychology and never needs to test if he is fighting alone.',
      },
      {
        nom: 'Hard to Kill',
        texte: 'Only taken Out of Action on a roll of 6 on the Injury chart; a 5 counts as Stunned.',
      },
      { nom: 'Hard Head', texte: 'Ignores the special rules for maces, clubs and similar weapons.' },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      tueur_charge_furieuse: {
        nom: 'Ferocious Charge',
        texte: 'Doubles his Attacks on the turn he charges, but suffers -1 to hit during that turn.',
      },
      tueur_monstres: {
        nom: 'Monster Slayer',
        texte: 'Always wounds on a 4+ regardless of Toughness, unless his Strength would wound more easily.',
      },
      tueur_berserk: {
        nom: 'Berserker',
        texte: 'Adds +1 to his to-hit rolls during the turn in which he charges.',
      },
    },
  },
  tireur_elite_tileen: {
    nom: 'Tilean Marksman',
    entretien: { texte: '15 gc after every battle he fights.' },
    equipement: ['Light armour', 'Sword', 'Dagger', 'Crossbow'],
    regles_speciales: [
      { nom: 'Steady Hands', texte: 'Ignores the long-range to-hit modifier when shooting his crossbow.' },
      { nom: 'Dead Eye Shot', texte: 'Ignores the cover modifier when shooting his crossbow.' },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  patrouilleur: {
    nom: 'Roadwarden',
    entretien: { texte: '20 gc after every battle he fights.' },
    equipement: ['Crossbow', 'Horseman’s hammer', 'Dagger', 'Heavy armour', 'Three torches', 'Horse'],
    regles_speciales: [
      { nom: 'Lethal Marksman', texte: 'Has both the Eagle Eyes and Trick Shooter skills.' },
      {
        nom: 'Stern',
        texte: 'May re-roll failed panic and fear Leadership tests; immune to the All Alone rules.',
      },
      {
        nom: 'Expert Rider',
        texte: 'Counts as having the Nimble skill while mounted and suffers no modifiers for shooting after moving on horseback.',
      },
      {
        nom: 'Stagecoaches',
        texte:
          'In a scenario involving a stagecoach or wagon, may re-roll one dice per turn until a re-roll comes up as a 1.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    profils_secondaires: [{ nom: 'Horse' }],
  },
  bandit_grand_chemin: {
    nom: 'Highwayman',
    entretien: { texte: '20 gc after every battle he fights.' },
    equipement: ['Brace of pistols', 'Rapier', 'Cloak (counts as a buckler)', 'Dagger', 'Horse'],
    regles_speciales: [
      { nom: 'Expert Pistolier', texte: 'Has both the Pistolier and Trick Shooter skills.' },
      {
        nom: 'Unscrupulous',
        texte: 'After every battle, on a roll of 1 on a D6, he steals a Treasure from the warband. This Treasure is lost.',
      },
      {
        nom: 'Expert Rider',
        texte: 'While mounted, counts as stationary for shooting and ignores the penalty for having moved.',
      },
      {
        nom: 'Stagecoaches',
        texte:
          'In a scenario involving a stagecoach or wagon, may re-roll one dice per turn until a re-roll comes up as a 1.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    profils_secondaires: [{ nom: 'Horse' }],
  },
  chasseur: {
    nom: 'Beast Hunter',
    entretien: {
      texte: '15 gc after every battle he fights.',
      exemption: {
        label: 'Battle against Beastmen',
        texte: 'Fights for no upkeep in a battle against Beastmen.',
      },
    },
    equipement: ['Two axes', 'Throwing axe (throwing knife, +1 Strength)', 'Light armour'],
    regles_speciales: [
      { nom: 'Beastmen Vengeance', texte: 'Hates all Beastmen and fights for no upkeep in battles against them.' },
      { nom: 'Skull Rack', texte: 'Causes fear in Beastmen.' },
      {
        nom: 'Predator',
        texte:
          'In a wilderness battle involving Beastmen, may be set up after both warbands have deployed, hidden and outside the enemy deployment zone.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  assassin_imperial: {
    nom: 'Imperial Assassin',
    entretien: { texte: '20 gc after every battle he fights.' },
    equipement: ['Sword', 'Dagger', 'Throwing knives', 'Hand crossbow'],
    regles_speciales: [
      {
        nom: 'Weapons Master',
        texte:
          'May use any weapon he finds except black powder weapons. Weapons bought for him remain his personal property and can never be given to another warband member.',
      },
      {
        nom: 'Poisoner',
        texte: 'Before every game, chooses Black Lotus or Dark Venom for free for his own weapons.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      assassin_frappe_dos: {
        nom: 'Backstabber',
        texte:
          'May charge an opponent he cannot see, as long as the target is within charge range. If he does, he surprises his opponent and gets +1 to hit him, with all rolls on the Serious Injuries chart at +1. This bonus only lasts for the first round of combat.',
      },
      assassin_homme_ombre: {
        nom: 'Hide in Shadows',
        texte:
          'Within 1" of a wall or other linear obstacle, opposing models must pass an Initiative test in order to charge or shoot at him.',
      },
      assassin_charge_furieuse: { nom: 'Unstoppable Charge', texte: 'May choose Unstoppable Charge from the Strength list.' },
    },
  },
  barde: {
    nom: 'Bard',
    entretien: { texte: '10 gc after every battle he fights.' },
    equipement: ['Sword', 'Dagger', 'Light armour'],
    regles_speciales: [
      {
        nom: 'Songster',
        texte:
          "Any friendly model within 6\" may re-roll a failed Leadership test with a +1 bonus to Leadership, including rout tests.",
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  chaman_norse: {
    nom: 'Norse Shaman',
    entretien: { texte: '25 gc after every battle he fights.' },
    equipement: ['Rune staff', 'Sword or axe'],
    regles_speciales: [
      {
        nom: 'Runes',
        texte:
          'Starts with two Norse Runes generated at random. They follow the rules for Prayers of Sigmar. A Rune already known reduces its difficulty by 1.',
      },
      {
        nom: 'Northern Roar (Difficulty 9)',
        texte: 'The Shaman becomes immune to shooting. At each of his Rally phases, the effect ends on a 1-2 on a D6.',
      },
      {
        nom: "Angvar's Fury (Difficulty 7)",
        texte: 'All warriors within 8" gain +1 to hit in close combat until the start of the Shaman’s next turn.',
      },
      {
        nom: "Elvek's Ice Spear (Difficulty 7)",
        texte: 'Range 18"; the first model in the path takes a Strength 4 hit.',
      },
      {
        nom: 'Gift of Clairvoyance (Difficulty 7)',
        texte:
          'Allows a dice roll to be modified by +1/-1 before the next Rally phase. A 6 thus created to wound does not produce a critical hit.',
      },
      {
        nom: "Frost's Kiss (Difficulty 6)",
        texte: 'A model within 12" must pass an Initiative test or be Knocked Down.',
      },
      {
        nom: "Bear's Might (Difficulty 9)",
        texte:
          'Gains +2 Strength, +2 Toughness, +1 Attack and -2 Initiative (minimum 1). A Leadership test at the start of each turn is required to maintain the effect. Usable once per game.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  duelliste: {
    nom: 'Duellist',
    entretien: { texte: '15 gc after every battle he fights.' },
    equipement: ['Sword', 'Dagger', 'Duelling pistol', 'Cloak (counts as a buckler)'],
    regles_speciales: [
      {
        nom: 'Darting Steel',
        texte:
          'May parry using his sword and cloak if he can roll under his Weapon Skill, instead of having to beat the opponent’s best to-hit roll.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  muletier: {
    nom: 'Mule Skinner',
    entretien: { texte: '15 gc after every battle he fights.' },
    equipement: ['Whip', 'Dagger'],
    regles_speciales: [
      {
        nom: 'Trainer',
        texte: 'Starts with the Animal Trainer skill for one type of animal, chosen by the player.',
      },
      {
        nom: 'Whip',
        texte:
          'Strength user -1, +1 to the enemy save. Gives +1 Attack when charging or being charged, may disarm instead of wounding, and cannot be parried.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      muletier_adresse_fouet: {
        nom: 'Whip Skill',
        texte: 'May re-roll his to-hit rolls with a whip; the second result is mandatory.',
      },
      muletier_baratin: { nom: 'Haggle', texte: 'May learn the Haggle skill.' },
      muletier_connaissance_rue: { nom: 'Street Knowledge', texte: 'May learn the Street Knowledge skill.' },
    },
  },
  geolier: {
    nom: 'Gaoler',
    entretien: {
      texte: '15 gc after every battle he fights.',
      maintien_sans_paiement:
        'If a Priest of Sigmar is present, he may stay unpaid but must sit out the next battle.',
    },
    equipement: ['Heavy chain (counts as a flail) or two hammers/maces', 'No armour'],
    regles_speciales: [
      {
        nom: 'Torture',
        texte:
          'May replace his attacks with a single, damage-free attack. If it hits, the target must pass a Strength test at -1 or be immobilised until he passes this test at the start of a Hand-to-Hand phase. No effect on Undead, Daemons, creatures immune to pain and large targets.',
      },
      {
        nom: 'Devoted',
        texte:
          'With a Priest of Sigmar in the warband, he does not leave if his wages go unpaid, but refuses to fight the next battle until paid.',
      },
      {
        nom: 'Immune to Pain',
        texte: 'All rolls to wound him suffer -1; a final result of 0 is ignored.',
      },
      {
        nom: 'Hatred',
        texte: 'Hates Skaven, Undead, Beastmen, Possessed, Chaos Kermesse and other Chaos warbands.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  ranger_kislevite: {
    nom: 'Kislev Ranger',
    employeurs: { texte: 'Mercenaries, Kislevites, Witch Hunters, and Dwarfs.' },
    entretien: { texte: '15 gc after every battle she fights.' },
    equipement: ['Bow', 'Sword', "Hunter's cloak"],
    regles_speciales: [
      {
        nom: 'Heart Strike',
        texte:
          'Against a large target, a 6 to hit followed by a 5+ to wound kills it outright, with no save.',
      },
      {
        nom: "Hunter's Cloak",
        texte: 'A hidden shot does not reveal her unless the target passes an Initiative test.',
      },
      { nom: 'Seeker', texte: 'Allows one dice of the Exploration roll to be modified by +1 or -1.' },
      { nom: 'Loner', texte: 'Never has to take an All Alone test.' },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, she must be paid her upkeep after every battle she fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      ranger_cri_animal: {
        nom: 'Animal Call',
        texte:
          'While hidden, may target a model within 18" that cannot charge: it must test Leadership before moving, or the Ranger chooses its move on a failure.',
      },
      ranger_herboristerie: {
        nom: 'Herb Lore',
        texte:
          'At the start of the Recovery phase, she or a model in base contact recovers 1 Wound on a 4+. The Ranger does not move that turn.',
      },
    },
  },
  chasseur_tresor_nain: {
    nom: 'Dwarf Treasure Hunter',
    entretien: { texte: '30 gc, or 60 gc if the warband includes one or more Elves.' },
    equipement: ['Gromril armour', 'Helmet', 'Mining pick', 'Dagger', 'Hammer', 'Treasure maps', 'Lantern rig'],
    regles_speciales: [
      {
        nom: 'Hard to Kill',
        texte: '1-2 Knocked Down, 3-5 Stunned and 6 Out of Action on the Injury chart.',
      },
      { nom: 'Hard Head', texte: 'Ignores the special rules for maces and hammers.' },
      { nom: 'Armour', texte: 'Suffers no Movement penalty from his armour.' },
      { nom: 'Hates Orcs & Goblins', texte: 'Hates Orcs and Goblins.' },
      {
        nom: 'Treasure Maps',
        texte:
          'After surviving a battle without being taken Out of Action, rolls 1D6 on the map chart: 1 Ambush; 2 Fake; 3 +1 shard; 4 Bugman’s Ale for 1D6 members; 5 one extra Exploration dice; 6 one Exploration dice with a chosen result.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  supervizork: {
    nom: 'Supervizork',
    entretien: { texte: '40 gc after every battle he fights.' },
    equipement: ['Heavy armour', 'Helmet', 'Two axes or a double-handed weapon'],
    regles_speciales: [
      { nom: '"I said shuddup"', texte: 'Orcs and Goblins within 6" ignore the effects of animosity.' },
      {
        nom: 'Who is this guy!',
        texte:
          'If the Goblin Boss is taken Out of Action, the Supervizork gains Leader for the battle. If that boss dies, he becomes leader permanently and keeps claiming his wages.',
      },
      { nom: 'Black Orc', texte: 'Has a natural 6+ save that stacks with armour.' },
      { nom: 'Warpstone Sale', texte: 'Does not count towards the number of warriors when selling warpstone.' },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      supervizork_competences_orques: {
        nom: 'Orc Special Skills',
        texte: 'May choose from the Orc Mob special skills.',
      },
    },
  },
  rat_ogre_skryre: {
    nom: 'Clan Skryre Rat Ogre',
    entretien: { texte: 'One warpstone shard to power it up before every game.' },
    equipement: ['Fangs and claws', 'Warpfire thrower', 'Mechanical body (4+ save)'],
    regles_speciales: [
      { nom: 'Large', texte: 'The Rat Ogre is a large target.' },
      { nom: 'Fear', texte: 'The Rat Ogre causes fear.' },
      { nom: 'Bio Machinery', texte: 'Immune to psychology and never leaves combat.' },
      {
        nom: 'Wyrdstone Powered',
        texte: 'Requires no gold, but a warpstone shard is needed to power it up before each game.',
      },
      { nom: 'May not run', texte: 'May not run, but may charge normally.' },
      { nom: 'Immune to Poison', texte: 'Not affected by any poison.' },
      {
        nom: 'Unreliable',
        texte:
          'At the start of each turn, on a 1 on a D6, roll on the malfunction table: 1 explodes, Strength 5 within 6" and destroyed; 2 goes berserk and moves randomly; 3 shuts down; 4 temporary loss of control; 5-6 freezes.',
      },
      {
        nom: 'Warpfire Thrower',
        texte:
          'Range 6", Strength 4, save modifier -2. Draws a 6"x2" line; every model in its path is hit on a 4+. A hit target catches fire on a 5+ and must put out the flames on a 4+ during the Rally phase.',
      },
      { nom: 'No Experience', texte: 'This bio-mechanical creation never gains experience.' },
      {
        nom: 'Wages',
        texte: 'Requires no gold upkeep, only a warpstone shard before each battle (see above).',
      },
    ],
  },
  cocher: {
    nom: 'Coachman',
    entretien: { texte: '10 gc after every battle he fights.' },
    equipement: ['Whip', 'Sword', 'Light armour'],
    regles_speciales: [
      {
        nom: 'Driver',
        texte:
          'A stagecoach driven by the Coachman may re-roll one result on the Loss of Control chart once; the second result is mandatory.',
      },
      {
        nom: 'Handyman',
        texte:
          'In base contact with a stationary vehicle that did not move last turn, may repair a damaged wheel or replace a lost one. He does nothing else and the vehicle does not move that turn.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  centaure_chaos: {
    nom: 'Chaos Centaur',
    entretien: { texte: '25 gc after every battle he fights.' },
    equipement: ['Throwing axes', 'Shield', 'Sword or spear'],
    regles_speciales: [
      {
        nom: 'Drunkard',
        texte:
          'At the start of each turn: on a 1, tests for stupidity; on a 2-5 nothing; on a 6 becomes frenzied for the turn. While stupid or frenzied, ignores other forms of psychology.',
      },
      { nom: 'Woodsman', texte: 'Ignores Movement penalties in wooded areas.' },
      { nom: 'Stomp', texte: 'His hooves give him an additional attack with no weapon bonus or penalty.' },
      { nom: 'Charging Spear', texte: 'A spear gives +1 Strength when charging, like a cavalry lance.' },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      centaure_mutation: { nom: 'New Mutation', texte: 'May buy a new mutation instead of a skill.' },
    },
  },
  pyromane: {
    nom: 'Pyromaniac',
    entretien: { texte: '10 gc after every battle he fights.' },
    equipement: ['Rockets', 'Firecrackers (unlimited)'],
    regles_speciales: [
      {
        nom: 'Mad Bomber',
        texte:
          'Every turn, must either light a rocket or throw a firecracker at a hostile animal. He may walk but not run or charge; if attacked, he fights normally.',
      },
      {
        nom: 'Rockets',
        texte:
          'During each Shooting phase, a rocket travels the artillery dice distance in a controlled direction, then continues randomly until it hits. A hit inflicts Strength 4 and sets alight on a 4+. A misfire: 1 nothing; 2-3 re-roll and double distance; 4-5 fireworks show, Leadership test at 2D6" or distraction; 6 explosion Strength 4 within 1D6".',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      pyromane_science_fusees: {
        nom: 'Rocket Science',
        texte: 'May modify the result of the artillery dice by +1 or -1.',
      },
      pyromane_artiste: {
        nom: 'Show Off',
        texte: 'May test Initiative instead of rolling the artillery dice; on a success, the rocket explodes immediately.',
      },
    },
  },
  ninja: {
    nom: 'Ninja',
    entretien: { texte: 'Hired for a single mission: no upkeep, he automatically leaves the warband after the battle.' },
    equipement: ['Pair of swords', 'Throwing stars', 'Rope and grapple', 'A smoke bomb'],
    regles_speciales: [
      {
        nom: 'Mastery',
        texte: 'Has Expert Swordsman, Knife Fighter, Scale Sheer Surfaces, Silent Death, Lightning Reflexes and Leap of Faith.',
      },
      {
        nom: 'Strictly Professional',
        texte:
          'Hired for a specific mission, requires no upkeep, automatically leaves the warband after the battle and gains no experience.',
      },
      {
        nom: 'Secret',
        texte: 'Does not stand alongside the warband and does not count as a warband member for rout tests.',
      },
      {
        nom: 'Wages',
        texte: 'Requires no upkeep at all: he is hired for a single mission and leaves automatically after the battle.',
      },
    ],
  },
  forgeron: {
    nom: 'Swordsmith',
    entretien: { texte: '15 gc after every battle he fights.' },
    equipement: ['Hammer', 'Reinforced leathers'],
    regles_speciales: [
      {
        nom: 'Master Craftsman',
        texte:
          'For Heroes seeking Cathayan longswords or dragon swords, rarity decreases by 1 for every 2 XP the Swordsmith has.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      forgeron_affutage: {
        nom: 'Sharpening',
        texte:
          'If not taken Out of Action, may give Razor Edge to up to three swords or similar weapons for the next battle.',
      },
      forgeron_marechal_ferrant: {
        nom: 'Farrier',
        texte:
          'Between battles, reshoes mounts. If a warhorse, elven steed or chaos centaur is taken Out of Action, it is only removed from the roster on a 1-2 instead of the normal result.',
      },
    },
  },
  pilleur_tombes: {
    nom: 'Grave Robber',
    entretien: { texte: '18 gc after every battle he fights.' },
    equipement: ['Pick (counts as an axe)', 'Dagger', 'Lantern', 'Reinforced leathers'],
    regles_speciales: [
      { nom: 'Despised', texte: 'Every model able to use prayers hates him.' },
      {
        nom: 'Grave Robbing',
        texte:
          'If not taken Out of Action, rolls 2D6 during exploration: 2 discovered and sent packing; 3-4 nothing; 5-7 1D6+3 gc; 8-9 1D6+8 gc; 10-11 free Zombie or corpse sold for 1D6+2 gc; 12 minor artefact.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  marchand_cathayen: {
    nom: 'Cathayan Merchant',
    entretien: { texte: '10 gc after every battle he fights.' },
    equipement: ['Sword'],
    regles_speciales: [
      { nom: 'Haggle', texte: 'May haggle 2D6 gc off an item, down to a minimum of 1 gc.' },
      {
        nom: 'Pawnbroker',
        texte: 'If not taken Out of Action, adds 2D6 gc to the total sale price of the warband’s items.',
      },
      {
        nom: 'Marketeer',
        texte:
          'If not taken Out of Action, may after the battle visit the Black Market and Foreign Wares, rolling 1D6 on each table. Items are offered at their base price.',
      },
      {
        nom: 'Guardian',
        texte:
          'The bodyguard only protects the Merchant, stays within 1", and gains no XP or wages. He may intercept a shot or charge aimed at the Merchant if not already engaged.',
      },
      {
        nom: 'Black Market',
        texte:
          '1 nothing; 2 spider venom (1D3 doses); 3 fire bomb; 4 fighting claws; 5 Cathayan longsword; 6 minor artefact for 75 + 1D6x10 gc.',
      },
      {
        nom: 'Foreign Wares',
        texte: '1 nothing; 2 gromril armour; 3 elf bow; 4 ithilmar armour; 5 tome of magic; 6 elven cloak.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      marchand_tailleur_pierre: {
        nom: 'Stone Cutter',
        texte: 'When selling warpstone, rolls 1D6: 1-2 loses 2D6 gc, 3-5 gains 2D6 gc, 6 gains 3D6 gc.',
      },
    },
    profils_secondaires: [
      {
        nom: 'Guardian',
        regles_speciales: [
          {
            nom: 'Intercept',
            texte:
              'Intercepts shots and charges directed against the Merchant if not already engaged; must stay within 1".',
          },
        ],
      },
    ],
  },
  eclaireur_hobgobelin: {
    nom: 'Hobgoblin Scout',
    entretien: { texte: '20 gc after every battle he fights.' },
    equipement: ['Dagger', 'Short bow', 'Shield', 'Giant wolf'],
    regles_speciales: [
      { nom: 'Mounted', texte: 'Has the Ride – Giant Wolf skill.' },
      {
        nom: 'Loner',
        texte: 'May not use the leader’s Leadership, never tests All Alone and may act independently.',
      },
      {
        nom: 'Traitor',
        texte:
          'Suffers hatred from all Greenskin races. The warband employing him may not hire any other Greenskin Hired Sword.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      hobgobelin_espion: {
        nom: 'Spy',
        texte:
          'After deployment, may redeploy 1D3 models other than himself. Otherwise, may be placed off the board more than 18" from any enemy.',
      },
      hobgobelin_tir_potshot: { nom: 'Potshot', texte: 'May shoot a bow while running, at -2 to hit.' },
    },
    profils_secondaires: [{ nom: 'Giant Wolf' }],
  },
  goliath_os: {
    nom: 'Bone Goliath',
    equipement: ['No weapons or armour'],
    regles_speciales: [
      { nom: 'Fear', texte: 'Causes fear.' },
      { nom: 'May not run', texte: 'May not run, but may charge normally.' },
      { nom: 'Immune to Psychology', texte: 'Immune to psychology and never leaves combat.' },
      { nom: 'Immune to Poison', texte: 'Not affected by any poison.' },
      {
        nom: 'Undead Construct',
        texte:
          'On a 4+ on the Injury chart, ignores the result and keeps fighting. This is not a save and does not work against magical weapons.',
      },
      {
        nom: 'Assembly',
        texte:
          'Building it costs the warband’s Lichemaster 1D3 Wounds, down to a minimum of 1. No rare item may be sought during this phase. A warband with no Lichemaster cannot build it.',
      },
      { nom: 'Large', texte: 'The Bone Goliath is a large target.' },
      { nom: 'Feels No Pain', texte: 'Treats Stunned results on the Injury chart as Knocked Down.' },
      { nom: 'Mindless', texte: 'Never gains experience.' },
      { nom: 'Wages', texte: 'A permanent construct: requires no upkeep at all.' },
    ],
  },
  skink_cameleon: {
    nom: 'Chameleon Skink',
    entretien: { texte: '12 gc after every battle he fights.' },
    equipement: ['Dagger', 'Blowpipe with poisoned darts', 'Buckler'],
    regles_speciales: [
      { nom: 'Aquatic', texte: 'Moves through water terrain with no penalty and counts as being in cover there.' },
      { nom: 'Jungle Creature', texte: 'Moves through jungle terrain with no penalty.' },
      {
        nom: 'Scaly Skin',
        texte:
          'A 6+ save that cannot be reduced below 6+ except by a critical hit with no save. Light armour and a shield each add +1.',
      },
      { nom: 'Cold-Blooded', texte: 'For psychology tests, rolls 3D6 and keeps the two lowest dice.' },
      {
        nom: 'Chameleon Skin',
        texte:
          'While hidden, an enemy’s Initiative for detecting him is halved; shots against him suffer -2 to hit.',
      },
      { nom: 'Infiltration', texte: 'May be placed out of line of sight and more than 12" from any enemy.' },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      skink_grand_chasseur: {
        nom: 'Great Hunter',
        texte: 'While in cover, the to-hit shooting penalty against him increases from -1 to -2.',
      },
    },
  },
  chasseur_gros_gibier: {
    nom: 'Big Game Hunter',
    entretien: { texte: '18 gc after every battle he fights.' },
    equipement: ['Sword', 'Dagger', 'Net', 'Light armour', 'Hunting rifle (Hochland long rifle)'],
    regles_speciales: [
      {
        nom: 'Set Traps',
        texte:
          'After deployment, places up to six trap counters at ground level, at least 6" apart. Any model (except the Hunter) moving within 3" rolls a D6: on a 1-3 nothing happens; on a 4-6 the model takes a single automatic hit at the strength shown, then the counter is removed. Any animal taken Out of Action by a trap is automatically captured after the game.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  guide_lustrien: {
    nom: 'Lustria Guide',
    entretien: { texte: '15 gc after every battle he fights.' },
    equipement: ['Sword', 'Dagger', 'Long bow', 'Rope and grapple', 'Healing herbs'],
    regles_speciales: [
      {
        nom: 'Myths and Legends',
        texte: 'If not taken Out of Action, may re-roll one Exploration dice; the second result is mandatory.',
      },
      { nom: 'Terrain Mastery', texte: 'Ignores terrain modifiers and may cross impassable terrain.' },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      guide_attention: {
        nom: 'Look Out!',
        texte: 'Once per battle, on a 4+, cancels the effect of a trap or a random hazard.',
      },
      guide_par_la: {
        nom: 'This Way!',
        texte:
          'In base contact with a model at the start of the turn, may lead it across impassable terrain with him; if contact is broken before crossing, that model is taken Out of Action.',
      },
    },
  },
  guerrier_fantome: {
    nom: 'Shadow Warrior',
    entretien: {
      texte: '15 gc after every battle he fights.',
      exemption: {
        label: 'Last battle against Dark Elves',
        texte: 'Fights for no upkeep if the last battle was against Dark Elves or a warband including a Dark Elf Assassin.',
      },
    },
    equipement: ['Sword', 'Long bow', 'Dagger', 'Shield', 'Light armour'],
    regles_speciales: [
      { nom: 'Hates Dark Elves', texte: 'Hates Dark Elves.' },
      { nom: 'Excellent Sight', texte: 'Spots Hidden enemies from twice his Initiative value away.' },
      {
        nom: 'Bitter Enemies',
        texte: 'Fights for no upkeep after a battle against Dark Elves or a warband including a Dark Elf Assassin.',
      },
      { nom: 'Infiltration', texte: 'Deploys after the opponent, out of sight and more than 12" from any enemy model.' },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      fantome_tenebres: {
        nom: 'See in the Dark',
        texte:
          'To charge an invisible enemy, is not limited to 4" but must pass an Initiative test instead.',
      },
      fantome_ombres: {
        nom: 'Hide in Shadows',
        texte: 'An enemy’s Initiative for detecting him while hidden is halved.',
      },
      fantome_tir_silencieux: {
        nom: 'Silent Shot',
        texte: 'May shoot while remaining hidden; if the target survives, it spots him by passing an Initiative test.',
      },
      fantome_solide: { nom: 'Sturdy Build', texte: 'Grants access to the Strength skills.' },
    },
  },
  assassin_elfe_noir: {
    nom: 'Dark Elf Assassin',
    entretien: { texte: '25 gc after every battle he fights.' },
    equipement: ['Parrying blade', 'Dark Elf blade', 'Repeater crossbow', 'Dark Venom', 'Light armour', 'Dark cloak (elven cloak)'],
    regles_speciales: [
      { nom: 'Perfect Killer', texte: 'All his shooting and hand-to-hand attacks impose an additional -1 to the enemy save.' },
      { nom: 'Hatred', texte: 'Hates High Elves, including their Hired Swords.' },
      { nom: 'Superhuman Sight', texte: 'Spots Hidden enemies from twice his Initiative value away.' },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      assassin_elfe_fureur: {
        nom: "Khaine's Fury",
        texte:
          'After taking all his opponents Out of Action, may pursue 4" and engage a new combat next turn, counting as having charged.',
      },
      assassin_elfe_infiltration: {
        nom: 'Infiltration',
        texte: 'Deploys after the opponent, out of sight and more than 12" from any enemy model.',
      },
      assassin_elfe_massif: { nom: 'Massive Build', texte: 'Grants access to the Strength skills.' },
      assassin_elfe_rapidite: {
        nom: 'Supernatural Speed',
        texte:
          'Avoids a shooting or hand-to-hand attack on a 6+. With Dodge or Sidestep, this save becomes 4+ in the relevant field.',
      },
    },
  },

  // --- Nouveaux francs-tireurs (Mordheim Hired Sword Compendium) ---
  chasseur_primes: {
    nom: 'Bounty Hunter',
    entretien: { texte: '15 gc after every battle he fights.' },
    equipement: ['Sword', 'Dagger', 'Pistol', 'Crossbow', 'Heavy armour', 'Helmet', 'Rope hook', 'Lantern'],
    regles_speciales: [
      {
        nom: 'Capture',
        texte:
          "At the start of each battle, nominates one of the opponent's Heroes as his mark: he gets +1 to hit this model and must always move towards them if he can see them, unless he can shoot (in which case he chooses freely). If he takes his mark Out of Action, he gains the hero's gold value as payment (of which he gives the warband half) plus 1D3 experience if he survives the game and his side wins. The captured hero does not roll on the Serious Injury table: he simply counts as captured.",
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  halfling_voleur: {
    nom: 'Halfling Thief',
    entretien: { texte: '15 gc per battle, unless modified by the Uneasy Ally rule below.' },
    equipement: ['Sword', 'Dagger', 'Throwing knives', 'Rope and grapple'],
    regles_speciales: [
      {
        nom: 'Infiltrator',
        texte: 'May always be placed on the battlefield after the opposing warband(s), out of sight and more than 12" from any enemy model.',
      },
      {
        nom: 'Pick Locks',
        texte: 'When testing to open a locked door, only needs to pass an Initiative test.',
      },
      {
        nom: 'Cutpurse',
        texte:
          'If he took part in the game and was not taken Out of Action, the warband receives one additional Treasure when rolling for exploration, in addition to those normally found.',
      },
      {
        nom: 'Uneasy Ally',
        texte:
          'At the end of each game (whether or not he took part), roll a D6: on a 1, Stop Thief! — he absconds with all the warband’s Treasures and warpstone, which are lost, and he leaves the warband; on a 2-5, Tax Time — he charges his normal 15 gc upkeep; on a 6, Ignorance is Bliss — he forgoes any upkeep this time.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  ninja_gnoblar: {
    entretien: { texte: '10 gc after every battle he fights.' },
    equipement: ['Ninja robe (counts as Hardened Leathers)', 'Shurikens (throwing stars with the Stealthy special rule)', 'Bo (two-handed weapon giving an additional attack and allowing him to parry)'],
    regles_speciales: [
      {
        nom: 'Stealthy',
        texte:
          'May throw his shurikens while hidden without revealing his position. The target model may take an Initiative test to try to spot him; if it fails, he remains hidden.',
      },
      {
        nom: 'Rooftop to Rooftop',
        texte: "Doesn't deduct the distance jumped from his movement. This means he can run 8\" and still jump 3\".",
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      ninja_gnoblar_sauteur_expert: {
        nom: 'Expert Rooftop Jumper',
        texte: 'May jump up to 4" and may re-roll a failed Initiative test when jumping or making a diving charge.',
      },
    },
  },
  pretre_guerrier_sigmar: {
    nom: 'Warrior Priest of Sigmar',
    entretien: { texte: '20 gc after every battle he fights.' },
    equipement: ['Hammer of Sigmar (counts as a hammer)', 'Light armour', 'Shield'],
    regles_speciales: [
      {
        nom: 'Prayers',
        texte:
          'A servant of Sigmar, he may use the Prayers of Sigmar (the same as the Sisters of Sigmar, see the Magic section). He knows none at recruitment, but whenever he would normally gain a new skill, he may instead roll for a new Prayer at random.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
  },
  pretre_de_morr: {
    nom: 'Priest of Morr',
    entretien: { texte: 'Priests of Morr have no use for gold: no upkeep is due after any battle.' },
    employeurs: { texte: 'Human Mercenary warbands (Reikland, Marienburg, Middenheim, Averland, Ostland, Nuln Gunnery School), as well as the Kislevites.' },
    equipement: ['Dagger', 'Scythe (two-handed weapon, user Strength +1, difficult to use)'],
    regles_speciales: [
      { nom: 'Loner', texte: 'Priests of Morr do not suffer from the All Alone rules.' },
      {
        nom: 'Funerary Rites',
        texte:
          'The Priest of Morr knows the following six Funerary Rites and performs one, chosen at random (1D6), whenever the opportunity arises, using the rules for Magic in the rulebook.',
      },
      {
        nom: "1 — Morr's Protection (Difficulty 6)",
        texte: 'Any magical attack made by a Necromancer, a Magister or Daemons that would be a direct attack on the priest is negated if the rite succeeds.',
      },
      {
        nom: '2 — Death Holds No Fear (Difficulty Auto)',
        texte: 'The Priest of Morr is now Fearless for the remainder of the game.',
      },
      {
        nom: '3 — Sanctity of the Fallen (Difficulty 7)',
        texte:
          'May be attempted on a model (friend or foe) that has been taken Out of Action within 6" of the priest. If successful, the model may not be raised by a Necromancer.',
      },
      {
        nom: '4 — Hand of Morr (Difficulty 9)',
        texte:
          'The priest must be in base-to-base contact with an Undead model. If successful before combat, the foe immediately goes Out of Action (Zombies, Dire Wolves, Vampires); Ghouls and Possessed affected by this rite flee their full move instead.',
      },
      {
        nom: '5 — Do You Know Who I Am? (Difficulty 7)',
        texte:
          'Range 6", directed at the closest Undead model first, or if none are in range, the closest human servant of the Undead, or finally any model. If successful, the target is immediately Stunned (or Knocked Down if it cannot be Stunned).',
      },
      {
        nom: '6 — I Am Death! (Difficulty 8)',
        texte: 'Gives the Priest of Morr a 6+ armour save and increases his Weapon Skill to 4, whichever is greater, for the rest of the game.',
      },
      {
        nom: 'Wages',
        texte: 'Priests of Morr have no use for gold: no upkeep is due after any battle.',
      },
    ],
  },
  pretre_loup_ulric: {
    nom: 'Wolf Priest of Ulric',
    equipement: ['White wolf pelt cloak (6+ save, cost included)', 'Dagger', 'A blunt weapon (hammer, mace, club, flail or morning star, one- or two-handed)'],
    regles_speciales: [
      {
        nom: 'No Armour',
        texte: 'Wolf Priests may not use any armour, trusting only in Ulric’s protection, save for their white wolf cloak.',
      },
      {
        nom: 'Blunt Weapons Only',
        texte: 'May only use hammers, maces, clubs, flails, morning stars (one- or two-handed) and the ubiquitous dagger.',
      },
      {
        nom: 'Hatred',
        texte:
          'Sees Witch Hunters (Templars of Sigmar), Warrior-Priests, Sigmarite Matriarchs and Sisters Superior as agents of a rival cult, and thus hates them. This hatred does not extend to other models in those warbands, seen simply as misguided followers of an errant cult.',
      },
      {
        nom: 'Wolf Companion',
        texte:
          'A warband with a Wolf Priest of Ulric may recruit a Wolf Companion for 25 gc (see the secondary profile below), a huge wolf that often scouts ahead to warn the priest of danger.',
      },
      {
        nom: 'Prayers of Ulric',
        texte:
          'Like the Sisters of Sigmar and Warrior-Priests with their prayers, the Wolf Priest may call upon Ulric in battle. He knows no Prayer at recruitment, but whenever he would gain a new skill he may instead roll for a new Prayer at random (1D6 below).',
      },
      {
        nom: '1 — Snow Squall (Difficulty 6)',
        texte:
          'Ulric extends his protection in the form of a localised snow squall: all enemy models in hand-to-hand combat with the priest are at -1 to hit for the duration of the combat.',
      },
      {
        nom: '2 — Hammerschlag (Difficulty 10)',
        texte: 'An enormous ethereal hammer blow strikes a model within 6", inflicting a Strength 4 hit with the Concussion special rule.',
      },
      {
        nom: '3 — Bloodlust (Difficulty 7)',
        texte:
          'The Wolf Priest attacks wildly: all attacks are at Strength +2, and he scores a critical hit on a 5-6. Each turn, a 2D6 test against the prayer’s difficulty is required to maintain the effect.',
      },
      { nom: "4 — Wolf's Hunger (Difficulty 7)", texte: 'One member of the warband, chosen by the priest, is thrown into Frenzy.' },
      {
        nom: "5 — Ulric's Howl (Difficulty 10)",
        texte:
          'For the rest of the game, all members of the priest’s warband are immune to Fear, Terror and All Alone tests, and gain +1 to their rout tests.',
      },
      {
        nom: '6 — Call of Ulric (Difficulty 10)',
        texte:
          'The priest reshapes into a huge, slavering wolf (M6 WS4 BS0 S4 T4 W1 I5 A2 Ld6): while in this form he may do nothing but attack as a wolf (no spellcasting or weapon use), but may attempt a Leadership test (using the wolf’s Ld 6) at each Shooting phase to regain human form. If still a wolf at the end of the battle, he gets one last chance to return; otherwise he remains a wolf forever (he keeps his hero status and still gains experience, but only chooses from the Speed table, except Scale Sheer Surfaces; maximum wolf characteristics: M7 WS6 BS0 S4 T4 W3 I7 A3 Ld7).',
      },
      {
        nom: 'Wages',
        texte: 'The Wolf Priest fights for Ulric alone: no upkeep is due after any battle.',
      },
    ],
    profils_secondaires: [
      {
        nom: 'Wolf Companion',
        regles_speciales: [
          {
            nom: 'Animal',
            texte:
              'The Wolf Companion, hired for 25 gc and only available with a Wolf Priest of Ulric in the warband, follows the rules for animals and never gains experience. Its thick fur counts as a wolf cloak (6+ save).',
          },
        ],
      },
    ],
  },
  sorciere: {
    nom: 'Witch',
    entretien: { texte: '15 gc after every battle she fights.' },
    equipement: ['Staff'],
    regles_speciales: [
      {
        nom: 'Wizard',
        texte:
          'Starts with two spells generated at random from the Charms & Hexes list below. When she gains a new skill, she may instead roll for a new spell from this list.',
      },
      {
        nom: 'Recluse',
        texte:
          'A fiercely solitary individual, the Witch may refuse to join the warband even once found: when attempting to hire her, roll a D6 — on a 4+ she can be hired, otherwise you must try again after your next battle.',
      },
      {
        nom: 'Potions',
        texte:
          'A single Hero in the warband that hired the Witch may partake of one of her potions before the battle. Roll a D6: 1 Debilitating (-1 Toughness for the whole battle, until a 6 is rolled on a D6 in the Recovery phase); 2-3 Strength (+1 Strength until a 1 is rolled in the Recovery phase); 4-5 Resilience (+1 Toughness until a 1 is rolled in the Recovery phase); 6 Fortitude (an extra Wound for the battle; once lost, it cannot be restored).',
      },
      {
        nom: 'Reluctant',
        texte: 'The Witch will never charge (although she will defend herself if charged) and must always try to stay at least 8" away from enemy models, moving away if needed.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, she must be paid her upkeep after every battle she fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      sorciere_scry: {
        nom: 'Scry',
        texte:
          'Difficulty 6 — For the duration of the turn, one hero or henchman may re-roll D3 dice rolls and modify the result by +1 or -1.',
      },
      sorciere_curse: {
        nom: 'Curse',
        texte: 'Difficulty 6 — One enemy model within 12" must re-roll all successful dice rolls for this and their next turn.',
      },
      sorciere_dust_of_the_blind: {
        nom: 'Dust of the Blind',
        texte:
          'Difficulty 9 — One enemy model within 16" is struck instantly blind: it may not shoot, charge or run, is at half Weapon Skill and moves in a random direction at the start of its turn, until the Witch casts another spell or moves.',
      },
      sorciere_age_of_stone: {
        nom: 'Age of Stone',
        texte: 'Difficulty 8 — One enemy model within 12" has all of its characteristics reduced by -1 for this and their next turn.',
      },
      sorciere_warriors_bane: {
        nom: "Warrior's Bane",
        texte:
          'Difficulty 7 — One enemy model within 18" is unable to use any of its weapons: it may not shoot and fights with fists in hand-to-hand combat, for this and their next turn.',
      },
      sorciere_cure: {
        nom: 'Cure',
        texte: 'Difficulty 6 — All friendly models within 6" have a single Wound healed. Any Stunned or Knocked Down models may immediately stand up.',
      },
    },
  },
  mage_elfe: {
    nom: 'Elf Mage',
    employeurs: { texte: 'Human Mercenary warbands, as well as the Kislevites.' },
    equipement: ['Staff', 'Elven cloak'],
    regles_speciales: [
      { nom: 'Wizard', texte: 'Starts with three spells generated at random from the Spells of the Djed’hi list below.' },
      { nom: 'Sorcery', texte: 'See the Sorcery rules in the rulebook.' },
      { nom: 'Fey', texte: 'Hostile spells will not affect him on a D6 roll of 4+.' },
      {
        nom: 'Wanderer',
        texte:
          'The Elf Mage will only stay with a warband for the duration of a single battle. A warband that used an Elf Mage in their last battle may not seek out another until they have fought at least one battle without one. He never learns a new skill.',
      },
      {
        nom: 'Wages',
        texte:
          'Like any Hired Sword, he must be paid his upkeep after every battle he fights (see Hired Sword Upkeep) to remain with the warband.',
      },
    ],
    competences_speciales: {
      mage_elfe_divination_de_shirath: {
        nom: 'Divination of Shirath',
        texte: 'Difficulty 6 — The Mage may re-roll all his failed dice rolls, though the second result stands. Lasts until the beginning of his next turn.',
      },
      mage_elfe_bouclier_chatoyant: {
        nom: 'Shimmering Shield',
        texte: 'Difficulty 7 — Gives him an additional unmodified 5+ save against all attacks. Lasts until the beginning of his next turn.',
      },
      mage_elfe_statue_de_lumiere: {
        nom: 'Statue of Light',
        texte:
          'Difficulty 8 — A single enemy model he can see may not move as long as the Mage remains both static and alive. The Mage and the target may cast spells normally, but fight in close combat at -1 Weapon Skill (minimum 1).',
      },
      mage_elfe_ombres_fugaces: {
        nom: 'Fleeting Shadows',
        texte:
          'Difficulty 8 — The first time the Mage is hit in close combat or shooting, the hit is ignored and he is moved 2" in a random direction. The spell remains in play until it saves him from a hit, whereupon it is dispelled.',
      },
      mage_elfe_furie_du_chasseur: {
        nom: "Hunter's Fury",
        texte:
          'Difficulty 9 — Summons D3+1 arrows which the Mage can use to shoot at one enemy model, range 36", using his own Ballistic Skill and ignoring movement, range and cover penalties. Each arrow causes one Strength 3 hit.',
      },
      mage_elfe_gardien_silencieux: {
        nom: 'Silent Guardian',
        texte:
          'Difficulty 9 — An invisible guardian defends the Mage: if he is attacked in close combat, it fights first with WS5, S3 against each attacker. It cannot be attacked in return and is dispelled only if the Mage casts another spell or dies.',
      },
    },
  },

  // --- Dramatis Personae (src/data/dramatisPersonae.ts) ---
  aenur: {
    nom: 'Aenur, the Sword of Twilight',
    equipement: ['Ithilmar armour', 'Elven cloak', 'Ienh-Khain (magic sword)'],
    regles_speciales: [
      { nom: 'Invincible Swordsman', texte: 'Aenur always hits his opponents on a 2+ in hand-to-hand combat.' },
      {
        nom: 'Ienh-Khain (the Hand of Khaine)',
        texte:
          'This immensely long sword allows Aenur to parry and adds +1 to his Strength; it also causes a critical hit on a roll of 5-6 when rolling to wound.',
      },
    ],
  },
  johann_le_surin: {
    nom: 'Johann the Knife',
    equipement: ['Throwing knives', 'Several long daggers (always counts as having two swords in close combat)'],
    regles_speciales: [
      {
        nom: 'Knife Fighter Extraordinaire',
        texte:
          'Unlike normal warriors, Johann can combine the Knife Fighter and Quick Shot skills (yes, he can throw six throwing knives in one turn if he does not move).',
      },
      {
        nom: 'Poisoned Weapons',
        texte: 'His weapons are always coated with Black Lotus; he may also take Crimson Shade before a battle.',
      },
    ],
  },
  bertha_bestraufrung: {
    nom: 'Bertha Bestraufrung, High Matriarch of the Sisterhood',
    equipement: ['Two Sigmarite warhammers', 'Gromril armour', 'A vial of holy water', 'A holy relic'],
    regles_speciales: [
      { nom: 'High Matriarch', texte: 'As the High Matriarch of the Sisters of Sigmar, Bertha automatically becomes the leader of any warband she joins.' },
      { nom: "Sigmar's Handmaiden", texte: 'Bertha is favoured above all other Sisters in the eyes of Sigmar. She gains +2 to all her rolls to see whether her Prayers of Sigmar are granted.' },
      { nom: 'Righteous Fury', texte: 'Bertha is affected by hatred against Skaven, Possessed and Undead warbands.' },
    ],
  },
  veskit: {
    nom: 'Veskit, High Executioner of Clan Eshin',
    equipement: ['Eshin Fighting Claws (with built-in warplock pistols)'],
    regles_speciales: [
      {
        nom: 'Eshin Fighting Claws',
        texte:
          'The extra attack is already included in his profile. Each claw has a warplock pistol built in, so Veskit may shoot every turn, fights in close combat with Strength 5 and a save modifier of -3, and can still parry twice with his claws.',
      },
      { nom: 'Unfeeling', texte: 'A cold, calculating killing machine, immune to all psychology.' },
      {
        nom: 'No Pain',
        texte: 'Veskit ignores Knocked Down and Stunned results on the Injury chart. He must lose his last Wound and be taken Out of Action before being removed from battle.',
      },
      { nom: 'The Eye', texte: 'Can spot a hidden enemy within twice his Initiative value, in inches.' },
      { nom: 'Metallic Body', texte: 'Gives Veskit his high Toughness and a 3+ armour save.' },
    ],
  },
  marianna_chevaux: {
    nom: 'Countess Marianna Chevaux, Vampire Assassin',
    equipement: ['Rapier', 'Dagger', 'Throwing knives', 'Hand crossbow', 'Bretonnian silk gown'],
    regles_speciales: [
      { nom: 'Immune to Psychology', texte: 'As a Vampire, Marianna is immune to psychology and will never leave combat.' },
      { nom: 'Immune to Poison', texte: 'Marianna is unaffected by any poison.' },
      {
        nom: 'No Pain',
        texte:
          'Marianna replaces Stunned results with Knocked Down. Since her Recovery skill prevents her from being Knocked Down, the only way to stop her is to take her Out of Action.',
      },
      { nom: 'Causes Fear', texte: 'Marianna is terrifying, more through reputation than her vampiric nature.' },
      { nom: 'Vampire Slayer', texte: 'All vampires hate Marianna, for she has sworn their doom.' },
      {
        nom: 'The Noctu',
        texte: "The gem stolen from Serutat's lair has latent magical powers. The shadow it casts gives a -1 to-hit penalty to all shooting directed at Marianna.",
      },
      {
        nom: 'Garlic on her Weapons',
        texte: 'Her crossbow bolts and rapier are coated in garlic, which acts as Black Lotus against vampires.',
      },
      {
        nom: 'Rapier: +1 Enemy Save, Barrage, Parry',
        texte:
          'A wounded model gets +1 to its armour save (or 6+ if it has none). Barrage: on a hit that fails to wound, an additional attack is possible (stacking, with a cumulative -1 to hit each time). Parry: against a to-hit roll, a D6 higher than the opponent’s best roll cancels the attack (except double Strength or more).',
      },
      {
        nom: "You Can't Escape Your Fate…",
        texte:
          'On the last turn of the game (if Marianna is present) or as soon as a warband routs, roll a D6 on the paper reference table: 1-3 she leaves the warband at the end of the game; 4-5 she stays, for wages, for the next battle; 6 servants of Serutat intervene (resolve on the reference table).',
      },
    ],
  },
  dijin_katal: {
    nom: 'Dijin Katal, the Renegade Assassin',
    equipement: ['Druchii assassin cloak (elven cloak)', 'Two swords coated in Sooty Venom', 'Repeater crossbow'],
    regles_speciales: [
      { nom: 'Fratricidal Hatred', texte: 'Any Dark Elf (including a High Elf Hired Sword) feels hatred towards Dijin Katal, and vice versa.' },
      { nom: 'Perfect Killer', texte: "All of Dijin Katal's attacks, shooting or hand-to-hand, inflict a -1 penalty to the enemy armour save." },
      {
        nom: 'Shadow Cloak',
        texte:
          'While in cover, Dijin may only be charged from a distance equal to his Initiative at most; shots against him in cover suffer -1 to hit in addition to the usual penalty.',
      },
      { nom: 'Excellent Sight', texte: 'Detects hidden enemies at a distance equal to twice his Initiative.' },
      { nom: 'Renegade', texte: 'Having committed fratricide, Dijin is hated by every Dark Elf he fights.' },
      {
        nom: 'Wanderer',
        texte: 'Dijin Katal never stays more than one battle in a row with the same warband: it must fight the next one without him before being able to seek him out again.',
      },
    ],
  },
  luthor_lame_pourpre: {
    nom: 'Luthor, the Purple Blade of Reikland',
    equipement: ['Sword', 'Dagger', 'Heavy armour', 'Helmet'],
    regles_speciales: [
      { nom: 'Evil Eye', texte: 'Luthor is immune to all eye injuries (ignore the 31 result on the Permanent Injury table for him).' },
      { nom: "I'm Everywhere", texte: 'Two warbands fighting each other may both use Luthor for the duration of a battle (to be resolved manually).' },
      {
        nom: 'The Purple Blade',
        texte: 'Against an enemy already engaged in close combat, Luthor gains +1 to hit, +1 to wound and +1 on injury rolls.',
      },
      {
        nom: 'Disengage',
        texte: 'During his Movement phase, Luthor may move away from any hand-to-hand combat without the enemy making any attacks, and may even charge another enemy this way.',
      },
    ],
  },
  luthor_sorcier_tenebreux: {
    nom: 'Luthor, the Extraordinary Dark Sorcerer',
    equipement: [
      'Staff (counts as a club)',
      'Concealed heavy armour',
      'Lucky charm',
      'Garlic',
      "Flask of Bugman's Ale (immune to fear)",
      'Tilean Fire Clay Orbs',
    ],
    regles_speciales: [
      { nom: 'Evil Eye', texte: 'Luthor is immune to all eye injuries (ignore the 31 result on the Permanent Injury table for him).' },
      { nom: "I'm Everywhere", texte: 'Two warbands fighting each other may both use Luthor for the duration of a battle (to be resolved manually).' },
      {
        nom: 'Fireballs',
        texte:
          'During his Shooting phase, even engaged in close combat, range 8" with no long-range penalty: one Strength 2 hit if it reaches its target, who must then pass an Initiative test or may neither charge nor shoot next turn.',
      },
      {
        nom: "Wiggling Fish Dance",
        texte: 'In close combat, on a roll of 6 to hit with his staff, resolve the hit at double Strength (8 instead of 4).',
      },
    ],
  },
  luthor_maitre_archer: {
    nom: 'Luthor, the Master Archer of Drakwald',
    equipement: ['Long bow', 'Dagger', 'Hunting arrows', 'Heavy armour', 'Dark Venom (on his arrows)'],
    regles_speciales: [
      { nom: 'Evil Eye', texte: 'Luthor is immune to all eye injuries (ignore the 31 result on the Permanent Injury table for him).' },
      { nom: "I'm Everywhere", texte: 'Two warbands fighting each other may both use Luthor for the duration of a battle (to be resolved manually).' },
      {
        nom: 'Boasting',
        texte:
          "Before shooting, Luthor may boast that he will hit his target: if he does, the warband gains +1D6 on a future close combat, shooting or Leadership roll. If he misses, the warband suffers a cumulative -1 Leadership until he hits another target.",
      },
      {
        nom: 'Feeling Lucky, Punk?',
        texte:
          'At the start of the Shooting phase, Luthor singles out an enemy model as the target of his threats: it suffers -1 WS and -1 BS (except Undead, Daemons, animals and warriors immune to psychology).',
      },
    ],
  },
  thrud_le_barbare: {
    nom: 'Thrud the Barbarian',
    equipement: ['War axe', 'Helmet'],
    regles_speciales: [
      {
        nom: 'Thick Skin and Hard Head',
        texte:
          'A 6+ armour save, never improved by Strength modifiers. Ignores the special rules for maces/clubs and is immune to psychology.',
      },
      { nom: 'Unfathomable Mind', texte: 'A 4+ save against all spells and magical effects targeting Thrud (the spell is then ignored).' },
      { nom: 'Drinks Without Thirst & Trollish Digestion', texte: 'Immune to poisons and the effects of alcohol; may eat or drink anything with no ill effect.' },
      {
        nom: 'Unpredictable Barbarian (tabletop rule, not simulated here)',
        texte:
          'At the start of each of his turns, 2D6 determines his state until his next turn: 2 total confusion (controlled by the opponent); 3-4 Stupidity; 5 charges towards "beer" in a random direction; 6 cannot be taken by surprise; 7-8 +1 Movement and +1 Initiative; 9-10 +1 Strength on the first hit of a charge; 11-12 Frenzy.',
      },
    ],
  },
  nicodemus: {
    nom: 'Nicodemus, the Eternal Wanderer',
    equipement: ["Wizard's staff (two-handed club with buckler parry, or one-handed club while keeping Rezhebel's Sword in his other hand)"],
    regles_speciales: [
      {
        nom: 'Cursed',
        texte: "A victim of an ill-worded wish made to a daemon, Nicodemus grows without end and cares only for warpstone, never for gold.",
      },
      {
        nom: "Wizard's Staff",
        texte:
          "Two-handed, counts as a club that also allows him to parry like a buckler. One-handed, a normal club while keeping Rezhebel's Sword (a spell, not a weapon: cannot parry) in his other hand.",
      },
    ],
  },
  penthesilee: {
    nom: "Penthesilea, the Serpent God's Chosen",
    equipement: ['Sword of the Stars', 'Blade of the Stars', 'Lunar Amulet', 'Enchanted skins (Amazon equipment)'],
    regles_speciales: [
      { nom: 'Amazon', texte: 'Penthesilea is an Amazon and follows all the special rules concerning them.' },
      {
        nom: 'Mark of the Serpent',
        texte: 'Already included in her profile: +1 Movement and +1 Initiative compared to an ordinary Amazon.',
      },
      { nom: 'Hatred of Men', texte: 'Having seen many of her sisters captured or killed by raiders, Penthesilea is subject to hatred towards all human males.' },
    ],
    competences_speciales: {
      elixir_de_vie: {
        nom: 'Elixir of Life',
        texte:
          'After the battle, if Penthesilea was taken Out of Action, re-roll her Injury roll: on a 1-4, she suffers no consequences from being Out of Action and takes part normally in the post-battle sequence.',
      },
      dissimulation: { nom: 'Concealment', texte: 'Hidden in jungle terrain, the range needed to spot her is halved.' },
      danse_hypnotique: {
        nom: 'Hypnotic Dance',
        texte:
          'Any fighter engaged in close combat with Penthesilea must pass a Leadership test at the start of the turn or may not attack that turn (but may defend). No effect against Lizardmen and Undead.',
      },
      fureur_sauvage: {
        nom: 'Savage Fury',
        texte: '+1 Attack when charging; immune to the effects of charm or fear.',
      },
    },
  },
  marquand_volker: {
    nom: 'Marquand Volker',
    equipement: ['Sword', 'Light armour', 'Throwing knives'],
    regles_speciales: [
      {
        nom: 'Wanderers',
        texte: 'Ulli and Marquand never stay more than one battle in a row with the same warband: it must fight the next one without them before being able to hire them again.',
      },
      {
        nom: 'For a Handful of Crowns',
        texte:
          'During the game, the opponent may attempt to bribe them into changing sides (secret bids at the start of the game, revealed at the enemy’s choosing; the highest bid wins) — to be resolved manually on the tabletop.',
      },
      {
        nom: "It's Payin' Time!",
        texte:
          'If the warband cannot pay their extra fee, they take payment in equipment or, failing that, turn on the warband leader (a fight to the death, without the henchmen) — to be resolved manually.',
      },
      {
        nom: 'Inseparable',
        texte:
          'Ulli and Marquand must stay within 4" of each other; if one is taken Out of Action, the other will try to drag him to safety — to be resolved manually on the tabletop.',
      },
    ],
  },
  ulli_leitpold: {
    nom: 'Ulli Leitpold',
    equipement: ['Two-handed warhammer', 'Light armour'],
    regles_speciales: [
      {
        nom: 'Wanderers',
        texte: 'Ulli and Marquand never stay more than one battle in a row with the same warband: it must fight the next one without them before being able to hire them again.',
      },
      {
        nom: 'Inseparable',
        texte:
          'Ulli and Marquand must stay within 4" of each other; if one is taken Out of Action, the other will try to drag him to safety — to be resolved manually on the tabletop.',
      },
    ],
  },
  simius_gantt: {
    nom: 'Simius Gantt, the Crow Master',
    equipement: ['Mantle of Crows', 'Staff', 'Needle and Thread'],
    regles_speciales: [
      {
        nom: 'Mantle of Crows',
        texte:
          'The mantle, in appearance a simple shabby cloak, has a hidden malign power: it attracts a murder of crows that circle around Simius, distracting his adversaries. Any enemy model in base-to-base contact with Simius suffers a single automatic Strength 2 hit before any blows are struck, at the start of the Hand-to-Hand Combat phase.',
      },
      {
        nom: 'Needle and Thread',
        texte:
          "A throwback to his surgeon days, Simius carries a needle and thread. If he stuns an opponent in hand-to-hand combat and has no other enemy in base contact, he sews the mouth of his enemy: leaders cannot then use their 'leader' ability and spellcasters are unable to cast spells for the remainder of the battle.",
      },
      {
        nom: 'Payment in Blood',
        texte:
          "Simius is a zealous scientist and his propensity to experiment is seldom slaked. If the warband who hired him loses the battle, he may decide to 'abduct' a hapless warrior to experiment on. Roll a D6: on a 1, Simius abducts the Hero or Henchman with the lowest experience (not Hired Swords), and that warrior is struck off the warband roster and, for all intents and purposes, slain. Simius disappears without trace after collecting his fee, of course…",
      },
    ],
  },
};

function translateRegles(regles: RegleTraduite[] | undefined, en: RegleTraduite[] | undefined) {
  if (!regles) return regles;
  return regles.map((r, i) => {
    const rEn = en?.[i];
    return rEn ? { ...r, nom: rEn.nom, texte: rEn.texte, exception: rEn.exception ?? r.exception } : r;
  });
}

function translateCompetences(
  competences: { id: string; nom: string; texte: string; reserve_a?: string }[] | undefined,
  en: Record<string, CompetenceTraduite> | undefined
) {
  if (!competences) return competences;
  return competences.map((c) => {
    const cEn = en?.[c.id];
    return cEn ? { ...c, nom: cEn.nom, texte: cEn.texte, reserve_a: cEn.reserve_a ?? c.reserve_a } : c;
  });
}

/**
 * Traduit un franc-tireur (ou Dramatis Persona, même catalogue — voir
 * FRANCS_TIREURS dans hiredSwords.ts) quand la langue courante est 'en'.
 * Repli progressif pièce par pièce si hiredSwordsEn n'a pas (encore) traduit
 * l'objet ou l'un de ses champs — même principe que translateItem (items.ts)
 * et translateWarbandCatalog (warbands.ts).
 */
export function translateHiredSword<
  T extends {
    id: string;
    nom: string;
    entretien: { texte: string; exemption?: { label: string; texte: string }; maintien_sans_paiement?: string };
    employeurs: { texte: string };
    equipement: string[];
    regles_speciales: { nom: string; texte: string; exception?: string }[];
    competences_speciales?: { id: string; nom: string; texte: string; reserve_a?: string }[];
    profils_secondaires?: { nom: string; regles_speciales?: { nom: string; texte: string; exception?: string }[] }[];
  },
>(francTireur: T, language: Language): T {
  if (language !== 'en') return francTireur;
  const en = hiredSwordsEn[francTireur.id];
  if (!en) return francTireur;
  return {
    ...francTireur,
    nom: en.nom ?? francTireur.nom,
    entretien: {
      ...francTireur.entretien,
      texte: en.entretien?.texte ?? francTireur.entretien.texte,
      exemption: en.entretien?.exemption ?? francTireur.entretien.exemption,
      maintien_sans_paiement: en.entretien?.maintien_sans_paiement ?? francTireur.entretien.maintien_sans_paiement,
    },
    employeurs: en.employeurs ? { ...francTireur.employeurs, texte: en.employeurs.texte } : francTireur.employeurs,
    equipement: en.equipement
      ? francTireur.equipement.map((e, i) => en.equipement?.[i] ?? e)
      : francTireur.equipement,
    regles_speciales: translateRegles(francTireur.regles_speciales, en.regles_speciales) ?? francTireur.regles_speciales,
    competences_speciales: translateCompetences(francTireur.competences_speciales, en.competences_speciales),
    profils_secondaires: francTireur.profils_secondaires?.map((p, i) => {
      const pEn = en.profils_secondaires?.[i];
      if (!pEn) return p;
      return {
        ...p,
        nom: pEn.nom ?? p.nom,
        regles_speciales: translateRegles(p.regles_speciales, pEn.regles_speciales),
      };
    }),
  };
}

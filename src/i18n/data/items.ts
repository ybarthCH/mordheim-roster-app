import type { Language } from '../../state/useLanguage';

type RegleTraduite = { nom: string; texte: string };

type ItemTraduit = {
  nom: string;
  texte?: string;
  disponibilite?: string;
  regles_speciales?: RegleTraduite[];
};

// Traductions anglaises du catalogue d'équipement commun (src/data/items/*.json),
// indexées par id. Complète translateItem() ci-dessous ; tout objet absent de ce
// dictionnaire retombe sur le texte français d'origine — permet un remplissage
// incrémental catégorie par catégorie sans casser les objets pas encore traduits.
export const itemsEn: Record<string, ItemTraduit> = {
  // --- Artefacts magiques ---
  bottes_et_corde_de_pieter: {
    nom: "Pieter's Boots and Rope",
    texte:
      "Pieter, master thief of the Shadow Guild, was the most famous cat burglar in Mordheim, and his daring heists earned him the nickname 'the Spider'. The secret of his success lay in his enchanted boots and magical rope, which he acquired in far-off Araby.",
    regles_speciales: [
      {
        nom: 'Uncanny Climbing',
        texte:
          'A model wearing these boots may move normally (and therefore charge, run, etc.) across any terrain, including vertical surfaces. When moving, combine horizontal and vertical distances travelled without making Initiative tests (except for leaps).',
      },
    ],
  },
  misericorde_de_ventimiglia: {
    nom: 'The Mercy of Count Ventimiglia',
    texte:
      'This dagger was used by the famous gentleman pirate known as the Black Corsair. It is said to have been found in ancient elven ruins, and that its blade is indestructible.',
    regles_speciales: [
      {
        nom: 'Mercy',
        texte:
          'The dagger counts as a sword. Opponents it wounds are Stunned on a roll of 1-3 (Undead are Knocked Down as normal) and taken Out of Action on a roll of 4-6.',
      },
    ],
  },
  armure_dattla: {
    nom: "Att'la's Armour",
    texte:
      "This gromril armour was given as a gift by the dwarf lord Kurgan to the warlord Att'la, in the time of Sigmar Heldenhammer. Att'la's Armour is a suit of gromril armour engraved with three runes.",
    regles_speciales: [
      { nom: 'Spell-Eater Rune', texte: 'The hero wearing this armour is immune to all spells.' },
      {
        nom: 'Rune of Passage',
        texte: 'The hero can pass through solid objects such as walls (this does not mean he can see through them).',
      },
      {
        nom: 'Rune of Vigour',
        texte: "The hero gains one extra Wound. Note that his total Wounds may thus exceed his race's maximum.",
      },
    ],
  },
  arc_traqueur: {
    nom: "Hunter's Bow",
    texte: 'This bow was given to Count Steinhardt by the elf lords of the Forest of Shadows.',
    regles_speciales: [
      {
        nom: 'Tracking Arrow',
        texte:
          "Any arrow fired from this magic bow will pursue its target and hit it even behind cover. Treat the Hunter's Bow as an elf bow that always hits on 2+ regardless of modifiers. Its accuracy is so fearsome that arrows fired count as hunting arrows (+1 on all wound rolls). Choose any enemy within range, not just the closest, but the firer must be able to see it (even the tip of a weapon is enough, as long as the firer knows the target's position).",
      },
      {
        nom: 'Dwarf Hunter',
        texte:
          'If a dwarf is a possible target, arrows will always veer away from their original target to try to hit the dwarf instead. This bow obviously cannot be used to shoot at elves.',
      },
    ],
  },
  cagoule_dexecuteur: {
    nom: "Executioner's Hood",
    texte:
      'Found on a wrecked dark elf vessel, this hood bears glowing, malevolent runes that plunge its wearer into a state of demented rage.',
    regles_speciales: [
      {
        nom: 'Demented Rage',
        texte:
          'A warrior wearing this hood becomes frenzied and remains so even if Knocked Down or Stunned. He also gains +1 Strength in hand-to-hand combat, so intense is his fury. The wearer never willingly leaves combat and always attacks the enemies in contact with him until they are Out of Action.',
      },
      {
        nom: 'Uncontrollable Charge',
        texte:
          'If any Stunned or Knocked Down models are within charge range of the wearer at the start of his turn, he will charge and attack the nearest one, even if it belongs to his own warband! The resulting combat lasts until one of the fighters is taken Out of Action.',
      },
    ],
  },
  oeil_omniscient_de_numas: {
    nom: 'The All-Seeing Eye of Numas',
    texte:
      'This gem was found deep within the ruins of Numas, far to the south. It gives its bearer terrible, prophetic nightmares.',
    regles_speciales: [
      {
        nom: 'Prophetic Vision',
        texte:
          'The bearer of the All-Seeing Eye can see every model on the table, even if they are hidden or out of sight. He can guide his comrades through the ruins (this lets the bearer roll two dice during the post-battle exploration phase). He also gains an additional 6+ save (never modified) against all shooting and hand-to-hand attacks, as he can sense them coming before they are even made.',
      },
      {
        nom: 'Animal Terror',
        texte:
          'All animals (such as war dogs, horses, etc.) become frenzied when facing the bearer of the All-Seeing Eye of Numas.',
      },
    ],
  },

  // --- Munitions ---
  bombe_fumigene: {
    nom: 'Smoke Bomb',
    texte:
      'The Cathayans have a much greater mastery than the Old World alchemists over black powder, poisons, and other strange natural ingredients. Smoke bombs are especially prized by thieves and assassins. The smoke offers a unique opportunity to cover a fast retreat. Single use.',
    regles_speciales: [
      {
        nom: 'Smoke',
        texte:
          "At the start of the Movement phase, a smoke bomb may be thrown up to 4\" and will create a thick cloud of smoke with a 2\" radius that lasts until the start of the thrower's next turn. If he is in hand-to-hand combat, he must pass an Initiative test or take an automatic hit from each of his opponents. After that, the bomb explodes, even if the thrower is Wounded. Models inside the smoke cloud cannot fight, shoot, or be targeted by shooting or hand-to-hand attacks. This also applies to wizards and priests wishing to cast a spell or prayer. Fighters engaged in hand-to-hand combat are immediately moved 1\" apart from each other. Since fighters cannot see through the smoke, they also cannot attack through it. However, fighters may move into, out of, and through the smoke normally. Note that Sisters of Sigmar Augurs, thanks to their sacred sight, are unaffected by the smoke bomb's effects. The moment a fighter carrying a smoke bomb is Knocked Down, Stunned, or taken Out of Action, the bomb explodes on a roll of 4+. Note that this roll does not need to be made again when, at the start of his turn, he goes from Stunned to Knocked Down.",
      },
    ],
  },
  bombe_incendiaire: {
    nom: 'Fire Bomb',
    texte:
      "The fruit of dwarf engineering genius, this device is as rare as it is dangerous. It consists of a charge of black powder trapped inside an iron sphere, connected to the outside by a short fuse. Once lit, there are only a few seconds to throw the bomb before it explodes. If the fuse is too short or burns too fast, the thrower ends up caught in the blast himself! Single use.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "During the Shooting phase, a fire bomb may be thrown up to a maximum distance in inches equal to twice the thrower's Strength. To hit, use the thrower's Ballistic Skill, with no penalty for range or for having moved. If the bomb hits its target, it inflicts 1D3 Strength 4 hits, with no armour save. Any fighter, friend or foe, within 1\" of the target suffers a Strength 3 hit that allows saves. If the bomb-thrower rolls a 1 to hit, the bomb explodes in his hands and he suffers all its effects instead of the intended target.",
      },
    ],
  },
  eau_benite: {
    nom: 'Holy Water',
    texte:
      'The priests of Ulric, Sigmar, Morr, and Manann hold great power against evil. It is said that pure water drawn from a clear spring and blessed by one of these priests burns the creatures of darkness. Single use.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "During the Shooting phase, a vial of holy water may be thrown up to a maximum distance in inches equal to twice the thrower's Strength. To hit, use the thrower's Ballistic Skill, with no penalty for range or for having moved. Holy water causes 1 automatic Wound, with no armour save, to Undead (except Necromancers, Ghouls, and Pariahs), Daemons, and Possessed (except Initiates and Beastmen).",
      },
    ],
  },
  filet: {
    nom: 'Net',
    texte:
      'Steel nets, such as those used by gladiators, can be used in combat. A net can only be used once per game, but may be reused in subsequent games.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "During the Shooting phase, instead of using a weapon, the net may be thrown up to a maximum distance of 8\". To hit, use the thrower's Ballistic Skill, with no penalty for range or for having moved. If hit, the target must make a Strength test.",
      },
      { nom: 'Success', texte: 'The net is torn apart.' },
      { nom: 'Failure', texte: 'The target cannot move, shoot, or cast spells during its next turn, with no other effect.' },
    ],
  },
  fleches_de_chasse: {
    nom: 'Hunting Arrows',
    texte:
      'The finest hunting arrows are made by the huntsmen of Drakwald Forest. Their sharp, barbed heads cause extremely painful wounds and let a skilled archer inflict heavy damage with a single arrow. They can be used with short bows, ordinary bows, long bows, and elf bows. There are enough hunting arrows to last the whole campaign.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte: 'Add +1 to all Injury rolls; usable with short bows, ordinary bows, long bows, and elf bows.',
      },
    ],
  },
  fleches_enflammees: {
    nom: 'Flaming Arrows',
    texte:
      "These are ordinary arrows fitted with an oil-soaked rag pouch at the head, which spreads its burning contents on impact, setting the target of the shot alight. There are enough flaming arrows to last for the duration of one game.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'When you hit your target with such an arrow, in addition to the normal damage, roll 1D6. On a result of 4+, the target catches fire. If it is a fighter, to put out the flames he must roll a 4+ on 1D6 at the start of his Recovery phase. If he fails, he suffers a Strength 4 hit and cannot move during the turn. Other members of the warband can try to put him out by moving into base contact and rolling a 4+ on 1D6 during the Recovery phase.',
      },
    ],
  },
  grenade_de_cathay: {
    nom: 'Cathayan Grenade',
    texte:
      'Cathayan grenades are explosive pots or tubes filled with black powder or other strange ingredients. These unstable explosives, peddled by Arabian merchants, most often detonate on impact, setting alight anything and anyone they come into contact with.',
    regles_speciales: [
      {
        nom: 'Thrown Weapon',
        texte:
          'This weapon is perfectly balanced for throwing, and the fighter using it suffers no penalties for long range or for having moved. However, it cannot be used in hand-to-hand combat.',
      },
      {
        nom: 'Fire',
        texte:
          'If you score a hit with the Cathayan grenade, roll 1D6. On a 5+, the victim catches fire. If the warrior survives the attack, during the Recovery phase he must roll a 4+ to put out the flames or suffer a Strength 4 hit and be able to do nothing but move until the fire is out. Other members of his warband can help put out the flames — they must move into base contact and roll a 4+ during the Recovery phase.',
      },
      {
        nom: 'Volatile',
        texte:
          'On a roll of 1 to hit, the Cathayan grenade explodes in the thrower\'s hands. Make the wound roll treating the thrower as the target.',
      },
    ],
  },
  grenade_de_miragliano: {
    nom: 'Miragliano Grenade',
    texte:
      'These primitive clay hand grenades contain Tilean alchemical fire that ignites when exposed to air.',
    regles_speciales: [
      {
        nom: 'Thrown Weapon',
        texte:
          'Fighters using this weapon suffer no penalty for long range, but still suffer a -1 penalty after moving.',
      },
      {
        nom: 'Burn',
        texte:
          'The target suffers 1 hit at Strength 2 from the erupting flames and must make an Initiative test at the start of its next turn to see through the smoke. If it fails, it may neither charge nor shoot until the start of its next turn, but may move or act normally and fight in hand-to-hand combat.',
      },
    ],
  },
  petards: {
    nom: 'Firecrackers',
    texte:
      'These small explosives are not powerful enough to set anything alight or injure humans. Firecrackers make a loud, violent noise that frightens animals. There are enough firecrackers to last for the duration of one game.',
    regles_speciales: [
      {
        nom: 'Charge Effect',
        texte:
          "If an animal or rider attempts to charge the fighter and he is not engaged in hand-to-hand combat, Knocked Down, or Stunned, he may try to use his firecrackers. The thrower must pass an Initiative test. If successful, the animal must make a Leadership test (animals cannot use the warband leader's Leadership, and mounts cannot use their rider's Leadership). If the test fails, the rider must roll on the Whoa Boy! chart. If the mount has the Trained special rule, the rider may re-roll the die on the Whoa Boy! chart.",
      },
      {
        nom: 'Shooting Effect',
        texte:
          "The fighter may also throw these firecrackers during the Shooting phase, up to a maximum distance of 8\". All mounts or animals within 3\" of the point of impact must make a Leadership test. If they fail, mounts must roll on the Whoa Boy! chart and animals flee as if they had failed an All Alone test.",
      },
    ],
  },
  poudre_noire_superieure: {
    nom: 'Superior Black Powder',
    texte:
      'The model has purchased black powder of better quality than what is usually sold. There is enough superior black powder to last for the duration of one game.',
    regles_speciales: [
      { nom: 'Effect', texte: "Adds +1 to the Strength of all the model's black powder weapons." },
    ],
  },

  // --- Véhicules ---
  chariot_diligence: {
    nom: 'Cart / Coach',
    texte: 'This includes carts, coaches, and generally any four-wheeled towed means of transport.',
    regles_speciales: [
      {
        nom: 'See Empire Vehicles and Boat Rules',
        texte: 'See the rules on carts and coaches in the Empire Vehicles and Boats article.',
      },
    ],
  },
  chariot_de_marchandises: {
    nom: "Merchant's Wagon",
    texte: "Valuable items such as Cathayan jewels, spices, and silk cloth are stored in the merchant's wagon.",
    regles_speciales: [
      {
        nom: 'Cart',
        texte:
          "The merchant's wagon is a cart and follows all its rules (see Empire Vehicles and Boats). The cost of the merchant's wagon includes two draught horses. Remember that a warband fighter must be assigned as the driver.",
      },
      {
        nom: 'Storage',
        texte:
          "All the warband's equipment and treasure are stored in the merchant's wagon. Note that this does not include the warband's Gold Crowns. If the merchant's wagon is destroyed, all stored equipment and treasure are lost. Until a new merchant's wagon (or a coach, if the player prefers) is bought, no equipment can be stored. All Treasures earned after a battle are lost if not sold before the next game.",
      },
      {
        nom: 'Reputation',
        texte:
          "For every five different rare items stored in the merchant's wagon, the Merchant gains a +1 bonus to his rolls to find rare items.",
      },
      {
        nom: 'Abandoned',
        texte:
          "If the warband fails its Rout test and no fighter is driving the merchant's wagon, it is then considered abandoned. The wagon falls into the hands of the victorious warband. It may choose to loot its contents, keep the wagon (treat it as a cart or coach), or strike a deal with the Merchant (use the rules for result 61 - Captured on the Heroes' Serious Injury table). A warband capturing a Merchants' Caravan's wagon cannot search for rare items after the battle, unless every fighter in the Merchants' Caravan warband was taken Out of Action. Indeed, if that is not the case, word will spread like wildfire and frightened local traders will prefer to avoid it.",
      },
    ],
  },
  carrosse_opulent: {
    nom: 'Opulent Carriage',
    texte:
      'Wealthy warband leaders are quick to spend their gold on extravagances such as fine wines, jewel-encrusted weapons and armour, and Cathayan spices. The opulent carriage, used to travel around Mordheim, is the pinnacle of this. Few things impress commoners more, or stir up more jealousy among less fortunate leaders, than an opulent carriage, which gets +3 to all its rolls to find rare items.',
    regles_speciales: [
      {
        nom: 'See Empire Vehicles and Boat Rules',
        texte: 'See the rules on carts and coaches in the Empire Vehicles and Boats article.',
      },
    ],
  },
  char_squelette: {
    nom: 'Skeleton Chariot',
    texte: "A skeleton chariot is made from the bones of the dead, pulled by two skeletal steeds and driven by a member of the warband.",
    regles_speciales: [
      {
        nom: 'Mounting a Chariot',
        texte: "The chariot's driver mounts and dismounts the chariot the same way a rider would with his mount.",
      },
      {
        nom: 'Movement',
        texte: 'A skeleton chariot moves normally at 8" and cannot run. However, it may double its movement when charging.',
      },
      {
        nom: 'Difficult Terrain',
        texte:
          'If a chariot moves across difficult terrain, it suffers 1D3 Strength 4 hits. If the chariot ends its charge on difficult terrain, it suffers 2D3 Strength 6 hits.',
      },
      {
        nom: 'Team (rule)',
        texte:
          'If one of the steeds dies, the chariot\'s Movement is halved, but it may still charge (also at half its normal charge movement). However, impact hits are then ineffective. If both steeds die, the chariot is immobilised and the driver must fight on foot.',
      },
      {
        nom: 'Combat',
        texte:
          "Chariots are feared for their devastating charges, caused by the horrible scythes mounted on their wheels, cutting to pieces any warriors in their path. The driver is allowed to charge any enemy within his line of sight and in open ground. He is not obliged to charge the closest model. If the chariot moves more than half its base Movement, it may make impact hits. Anyone directly in the path of a charging chariot is allowed to make an Initiative test to jump out of the way and avoid being hit. The driver must make a roll to hit, as usual. A successful hit causes a Strength 4 wound with a -2 penalty to the armour save. At the end of the charge, the chariot's driver may fight enemy models in base contact, as if it were a normal charge.",
      },
      {
        nom: 'Shooting',
        texte:
          'A chariot is a large target, and a fighter gets a +1 bonus to hit with a missile weapon when aiming at the skeleton chariot. If the chariot is hit, roll 1D6 to see where it is hit: 1-2 = Team. 3-4 = Chariot. 5-6 = Driver.',
      },
    ],
  },
  machine_du_chaos: {
    nom: 'Chaos Machine',
    texte:
      'The Slavers lock their victims inside a demonic machine, twisted by the industrial madness of Chaos engineers. This vehicle is a living prison on wheels. These armoured machines carry prisoners to the Dark Lands to fuel the furnaces or be sacrificed there.',
    regles_speciales: [
      {
        nom: 'Cart',
        texte:
          'The Chaos Machine follows all the rules for Carts (see the Empire Vehicles and Boats article), except where noted otherwise below.',
      },
      {
        nom: 'Daemon',
        texte:
          "The Chaos Machine is bound to a daemon that powers it. All references to animals pulling the cart should be treated as references to its daemon. The daemon's Movement is not affected by cargo.",
      },
      {
        nom: 'Passengers',
        texte:
          'A Chaos Dwarf must act as driver. Only prisoners may ride on a Chaos Machine as passengers. More than six creatures — large creatures (Ogres, Minotaurs, etc.) count as two — make it uncontrollable.',
      },
      {
        nom: 'Crack the Whip',
        texte:
          "The driver may crack the whip! If a Chaos Machine becomes uncontrollable, refer to the loss-of-control chart. If the result is Whoa Boy!, replace result 5 (The shaft of the cart breaks…) with: 'The Daemon has broken free of the sorcery binding it to the Chaos Machine. The machine moves 6\" straight ahead, then stops. The vehicle cannot move again for the rest of this battle.'",
      },
      {
        nom: 'Prisoners',
        texte:
          "When fighting a Chaos Dwarf warband with a Chaos Machine, opponents are always treated as prisoners on a Captured result on the Serious Injury table, or if they are taken Out of Action with a pair of tongs. Note that in both cases, their equipment is lost to the Chaos Dwarf warband. Certain results on the Mordheim Exploration table let Chaos Dwarfs acquire prisoners: 4-4: Vagrant (1); 3-3-3: Prisoners (1D3). On the Empire in Flames exploration table: 2-2: Fool (1); 3-3: Lost Children (2); 4-4: Refugees from Mordheim (1D3); 3-3-3: Small Farm (2); 1-1-1-1-1: Large Farm (2); 3-3-3-3-3: The Hanging Tree (1).",
      },
      {
        nom: 'Freeing Prisoners',
        texte:
          "Models held captive can be freed by destroying the Chaos Machine or by using the prison keys. If a model takes an Out of Action Chaos Dwarf Slaver, it takes the keys. A model holding the keys can free the prisoners by moving into base contact with the Chaos Machine. If the Chaos Dwarfs are routed before this happens, or if the model holding the keys is taken Out of Action (losing the keys to a new bearer), the prisoners remain captive. Freed prisoners must always move towards the nearest table edge. Prisoners not from the participating warbands use the basic profile or that of Mercenary warriors (see the Mercenaries warband). Rescued prisoners rejoin their former warband.",
      },
      {
        nom: "Hashut's Reward",
        texte:
          "After a battle, the Chaos Dwarfs may decide to deport the prisoners to the Dark Lands. If they do, they must all be sacrificed to Hashut. The Chaos Machine plus one Hero will be absent for the next battle. Unless there is another machine, no model can be captured before its return. Once the Hero has returned, consult the following table. Prisoners — Hashut's Reward (1D6): 1-3 = +1 experience point for the Leader. 4-5 = +1D3 experience points to be distributed among the Heroes. 6 = +2D3 experience points to be distributed among the Heroes plus 1D6x5 Gold Crowns.",
      },
    ],
  },
  pousse_pousse: {
    nom: 'Rickshaw',
    texte:
      'A rickshaw is a two-wheeled cart pulled by a man. Wealthy merchants, influential officials, and other members of the social elite can be seen using this means of transport to get around town. A non-animal member of the warband must be assigned to pull the rickshaw. He may then neither run nor charge. As long as he is pulling the rickshaw, the two models must stay in base contact and move together. The model may stop pulling the rickshaw at any time and move normally in the same turn (including the possibility of making a charge).',
    regles_speciales: [
      {
        nom: 'Seat',
        texte:
          'The rickshaw is fitted with a seat, allowing a passenger to sit in it. Mounting or dismounting the rickshaw works the same way as mounting or dismounting a steed.',
      },
      {
        nom: 'Target',
        texte:
          "Shooting at a rickshaw gives a +1 bonus to hit. For each hit, roll on the following table to determine which part of the rickshaw or its crew is hit. Then apply the 'to wound' modifiers accordingly. D6: 1-2 = the rickshaw puller. 3-4 = the rickshaw (Toughness 8 - 2 Wounds). 5 = a wheel (Toughness 6 - 1 Wound). 6 = the rickshaw's passenger.",
      },
      {
        nom: 'Hand-to-Hand Contact',
        texte:
          'In hand-to-hand combat, as long as they are in contact with the respective parts, attackers may choose to strike the puller, the rickshaw, the wheel, or the passenger. The passenger is only hit on a 6+.',
      },
      {
        nom: 'Destruction',
        texte:
          'Note that as soon as one of the wheels is destroyed (when it loses its last Wound), the rickshaw can no longer be pulled. Unless the rickshaw is completely destroyed, it can always be repaired after the battle.',
      },
    ],
  },
  barge_fluviale: {
    nom: 'River Barge',
    texte: 'A river barge can carry twelve human-sized or smaller models, or their equivalent in cargo.',
    regles_speciales: [
      {
        nom: 'See Empire Vehicles and Boat Rules',
        texte: 'See the rules on boats in the Empire Vehicles and Boats article.',
      },
    ],
  },
  barque: {
    nom: 'Rowboat',
    texte: 'A rowboat can carry six human-sized or smaller models, or their equivalent in cargo.',
    regles_speciales: [
      {
        nom: 'See Empire Vehicles and Boat Rules',
        texte: 'See the rules on boats in the Empire Vehicles and Boats article.',
      },
    ],
  },
  gabare: {
    nom: 'Barge',
    texte: 'A barge can carry eight human-sized or smaller models, or their equivalent in cargo.',
    regles_speciales: [
      {
        nom: 'See Empire Vehicles and Boat Rules',
        texte: 'See the rules on boats in the Empire Vehicles and Boats article.',
      },
    ],
  },

  // --- Poisons / drogues ---
  champignons_bonnets_de_fou_market: {
    nom: "Fool's Cap Mushrooms",
    texte:
      "The dreaded cult of fanatical goblins from the Edge of the World Mountains use these hallucinogenic mushrooms to enter a state of frenzy. The use of poison is almost universally despised, but in the brutal, merciless battles of Mordheim, desperate warbands often use poisoned blades. The poison cannot be used with black powder weapons. When you buy a vial of poison, you always have enough for the duration of one battle. You may only poison a single weapon with one vial of poison.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte: "A warrior consuming fool's cap mushrooms before a battle will be subject to frenzy. These mushrooms have no effect on Possessed and Undead.",
      },
      {
        nom: 'Side Effects',
        texte: 'After the battle, roll 1D6. On a result of 1, the model permanently becomes stupid.',
      },
    ],
  },
  lotus_noir: {
    nom: 'Black Lotus',
    texte:
      'Deep in the forests of the Southlands grows an extremely poisonous plant. Black lotus, as its name suggests, is highly sought after by alchemists, assassins, wizards, and weary wives. A weapon coated in black lotus sap automatically Wounds if you roll a 6 to hit. Still roll the die for each Wound inflicted this way. On a 6, you cause a Critical Hit. If you don\'t roll a 6, the Wound is normal. Make armour saves as usual.',
  },
  ombre_pourpre: {
    nom: 'Purple Shade',
    texte:
      'Purple shade is the name given by the people of the Old World to the leaves of the Estalian blood oak. This drug is highly addictive, but grants superhuman speed and strength.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'A model that takes purple shade has its Initiative increased by +1D3 points, and its Movement and Strength by +1 (for the duration of the game). It has no effect on Undead such as Vampires and Zombies, nor on Possessed.',
      },
      {
        nom: 'Side Effects',
        texte:
          "Roll 2D6 after the battle. On a result of 2-3, the model becomes addicted and you must now buy a dose of purple shade before every battle. If you fail to do so, it leaves the warband. On a result of 12, the model's Initiative is permanently increased by +1.",
      },
    ],
  },
  poison_de_manticore: {
    nom: 'Manticore Venom',
    texte:
      'This is a soporific substance, as deadly as the creature that secretes it. A wound caused by a blade coated in fresh manticore excretions causes a comatose state, followed by near-certain death.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'Any fighter Wounded by a weapon coated in manticore venom must roll 1D6 at the start of each turn. On a result of 1, the victim loses 1 Wound. On a 6, the effects of the poison wear off and he no longer has to make the roll. Multiple Wounds caused by a weapon coated in manticore venom do not require multiple rolls per turn.',
      },
    ],
  },
  racine_de_mandragore: {
    nom: 'Mandrake Root',
    texte:
      'This human-shaped root grows in the putrid marshes of Sylvania. Highly toxic, it is strongly addictive and slowly kills its users, but also allows them to ignore pain.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'This root renders one almost insensitive to pain. It increases Toughness by +1 for the duration of the battle and turns Stunned results into Knocked Down. It has no effect on Possessed or Undead.',
      },
      {
        nom: 'Side Effects',
        texte: 'Mandrake root is extremely poisonous. Roll 2D6 at the end of the battle. On a result of 2-3, the model permanently loses 1 point of Toughness.',
      },
    ],
  },
  toxine_arachneenne: {
    nom: 'Arachnid Toxin',
    texte:
      'Forest goblins commonly plunge their weapons into the bodies of giant spiders in the hope of coating them with a deadly poison. A weapon coated with arachnid toxin gets a +1 bonus to Injury rolls. As soon as the toxin is bought, it is immediately applied to a weapon. It therefore cannot be kept or resold.',
  },
  venin_daraignee: {
    nom: 'Spider Venom',
    texte:
      'These paralysing doses are concocted from toxins taken from small animals poisoned by a spider bite. A blade coated with spider venom can be used to paralyse an enemy in hand-to-hand combat.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'Any fighter hit by a blade coated with spider venom must immediately pass a Toughness test or be paralysed. A paralysed warrior cannot move or fight and is automatically hit in hand-to-hand combat. The victim remains paralysed until he passes a Toughness test during his Recovery phase.',
      },
    ],
  },
  venin_de_reptile: {
    nom: 'Reptile Venom',
    texte:
      "Adds +1 to the weapon's Strength, but does not grant the -1 armour save penalty. Remember that all Henchmen in the same group must be equipped identically.",
  },
  venin_fuligineux: {
    nom: 'Sooty Venom',
    texte:
      'This poison is drawn from fire dragons, the giant sea serpents that infest the western ocean and the coast of Naggaroth. The slightest scratch infected with sooty venom causes unbearable pain that neutralises even the bravest of men.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "Any hit caused by a weapon coated with sooty venom gets +1 Strength. For example, if a Strength 3 warrior wielding a poisoned sword hits his opponent, his blow will be at Strength 4. Armour saves are modified to account for the attack's increased Strength.",
      },
    ],
  },
  ombre_cramoisie: {
    nom: 'Crimson Shade',
    texte:
      'An extract drawn from a scarlet orchid that grows only in the jungles of Lustria, prized by treasure hunters for the superhuman stamina it provides.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte: 'A model that takes crimson shade has its Toughness increased by +1 for the duration of the game.',
      },
      {
        nom: 'Side Effects',
        texte: 'Roll 1D6 after the battle. On a result of 1, the model permanently suffers -1 Strength.',
      },
    ],
  },
  venin_sombre: {
    nom: 'Dark Venom',
    texte:
      'Extracted from the glands of a Lustrian jungle serpent, this thick, black poison causes painful paralysis in those it touches.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'Any fighter hit by a weapon coated with dark venom must immediately pass a Toughness test or be paralysed until his next Recovery phase.',
      },
    ],
  },

  // --- Consommables ---
  ail: {
    nom: 'Garlic',
    texte:
      'Garlic, renowned for keeping vampires and other creatures of the night at bay, grows in most vegetable gardens across the Empire. A Vampire must pass a Leadership test to charge a model wearing a garland of garlic. Garlic lasts only for the duration of one battle, whether used or not.',
  },
  biere_de_bugman: {
    nom: "Bugman's Ale",
    texte:
      "Of all the dwarf master brewers, Josef Bugman is the most famous. His ale, known throughout the Old World, is generally considered the best of them all. A warband that drinks a barrel of Bugman's Ale before a battle is immune to fear for the entire duration of the game. Elves cannot drink it, as they are too delicate to withstand its effects. The barrel contains enough ale for one battle.",
  },
  biscuit_de_mer: {
    nom: "Ship's Biscuit",
    texte:
      "Any pirate can carry a few of these dense blocks with him to eat during battle... something comparable to bread (the ship's cook refuses to reveal the exact recipe).",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'At the start of any of his turns, the Pirate may gorge himself on it if he is not engaged in hand-to-hand combat. His Toughness is temporarily increased by +1 for the duration of that turn and the following enemy turn, after which the effects wear off. Roll 1D6 after that turn. On a result of 1, his biscuits are spoiled and full of maggots (yuck!). Note his name, as the Pirate will have to sit out the next game to recover (and give the cook a few blows!). If the Pirate ends up having to sit out a game due to other effects, the consequences stack and he must sit out the next two games.',
      },
    ],
  },
  chausse_trappes: {
    nom: 'Caltrops',
    texte:
      'These are three-pronged nails or small spiked spheres, originally designed to hinder cavalry charges. In the alleyways of Mordheim, a full pouch is enough to slow down charges, whether from a rider or a foot soldier, so great is the risk of injury. Caltrops may be used when an opponent decides to charge. A pouch contains just enough caltrops for a single use.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte: 'The defender scatters them in the path of the charge, reducing its distance by 1D6" (and potentially causing it to fail).',
      },
    ],
  },
  fiole_de_pestilence: {
    nom: 'Vial of Pestilence',
    texte:
      "This small crystal vial contains an extremely virulent pathogen. A single breath is enough to dissolve the victim's airways, who then drowns in his own blood. This poison is however highly volatile and only dangerous for a few seconds, before dissipating into the air. The vial can only be used once.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'The vial can be opened and its contents thrown in the face of a model in base contact who has just taken the Skaven Out of Action. The opponent must then pass a Toughness test or be immediately taken Out of Action, with no save possible. If the opponent succumbs to the poison, he failed to complete his attack and the Skaven is only Stunned instead of Out of Action.',
      },
    ],
  },
  gourde_dhuile: {
    nom: 'Oil Flask',
    texte:
      'This small leather container holds combustible oil for refilling lamps and lanterns. The oil flask can be used to easily start a fire, provided a flame is brought near it. The flask can only be used once.',
  },
  herbes_de_soin: {
    nom: 'Healing Herbs',
    texte:
      'Certain plants that grow on the banks of the River Stir have curative properties. Apothecaries gather their roots and leaves to treat the sick and wounded. A Hero with healing herbs may use them at the start of any of his Recovery phases, as long as he is not engaged in hand-to-hand combat. He then recovers all Wounds lost during the game. Healing herbs can only be used once.',
  },
  larmes_de_shallya: {
    nom: 'Tears of Shallya',
    texte:
      'Tears of Shallya are vials of water from the holy spring of the Crown. Shallya is the goddess of healing and mercy, and this water is said to heal and protect against poison. A model that drinks it at the start of the battle will be completely immune to all poisons for the duration of the game. Tears of Shallya can only be used once.',
  },
  poudre_eclair: {
    nom: 'Flash Powder',
    texte:
      'Another dwarf creation, this phosphorous preparation is used in mines to light up dark cracks when searching for veins of precious minerals. In Mordheim, pouches of this powder can be used to blind enemies and catch them off guard at the moment of attack. It may be used when an opponent decides to charge. A pouch contains just enough flash powder for a single use.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'The charging model must pass an Initiative test to cover his eyes in time. If he fails, he is temporarily blinded and the charge is considered to have failed.',
      },
    ],
  },
  torche: {
    nom: 'Torch',
    texte:
      'Warriors who cannot afford a lantern can use torches instead. A torch works exactly like a lantern: it adds 4" to the distance at which the model can spot hidden models, but also follows other special rules. A torch lasts only for the duration of one game.',
    regles_speciales: [
      {
        nom: 'Combat Effect',
        texte:
          'A model armed with a torch causes fear in animals (dogs, horses, warhorses, wolves, bears, etc.) and may use it as a weapon. When used in combat, a torch works like a club, but with a -1 penalty to hit. Models with the regeneration skill (such as Trolls) cannot regenerate Wounds caused by a torch. Torches can also be used to set buildings alight if you are using the Fires of Hell rules.',
      },
    ],
  },
  victuailles: {
    nom: 'Provisions',
    texte:
      'Provisions can be used after a battle. If the warband sells wyrdstone or treasures (see Empire in Flames or Border Town Burning), the number of warriors in the warband is treated as being one column lower (i.e. a warband of 10-12 warriors is treated as 7-9 warriors). A warband may use as many provisions as it wishes, but note that the warband size can never be treated as lower than 1-3 warriors.',
  },
  vin_elfique: {
    nom: 'Elf Wine',
    texte:
      'Elven wines are renowned as the finest in the world, and some are even said to have magical properties. A delicate elf wine banishes doubt and fear and fills the drinker with a sense of well-being. A Ghost Warband that drinks elf wine before a battle is immune to fear for the entire duration of the battle. The effect lasts for the duration of one battle.',
  },
  vodka: {
    nom: 'Vodka',
    texte:
      "The Kislevites inhabit a hostile land, constantly threatened by invasion. As a result, they tend to be grave and pragmatic, but this has not dampened their love of celebration. One could even say the opposite: the hardships they face daily teach them that life is short and that any opportunity to have fun must be seized. One consequence of this attitude is the creation of an alcoholic drink called vodka. It is also one of the country's most famous exports, though most people of the Old World find the drink a little too strong for their southern tastes. Kislevites, on the other hand, are so fond of this drink that they attribute magical properties to it. Mothers give vodka to their children to ward off illness and to keep them warm during the long winter months. Foreigners remain puzzled by the supposed supernatural qualities of this spirit. Yet it is a proven fact that a Kislevite army well-stocked with vodka fights better and with even greater valour. Single use.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'In game terms, a Kislevite Hero may give vodka to his warband before a battle. All members of the warband then gain a +1 Leadership bonus (up to a maximum of 10) for the duration of the game. However, to represent the intoxicating effects of vodka, all members must make a Toughness test before the start of the game, or suffer a -1 Initiative penalty if they fail.',
      },
    ],
  },

  // --- Montures ---
  araignee_geante: {
    nom: 'Giant Spider',
    texte:
      'Giant spiders are hairy monstrosities 3 to 3.5 metres long that inhabit the forests of the Old World. They are highly prized as mounts by forest goblins. It gives me the shivers just thinking about it...',
    regles_speciales: [
      {
        nom: 'Poisoned Attacks',
        texte: "A giant spider's Attacks are Strength 4, but do not inflict an armour save modifier.",
      },
      {
        nom: 'Wall Climbing',
        texte:
          'Giant spiders and their rider can move across walls without taking an Initiative test. They can only jump 2" vertically or horizontally, but this counts as a diving charge. When a spider jumps, its rider must make an Initiative test. If failed, he must then roll on the Whoa Boy! chart. Note that if the rider has the trotting jump skill, his maximum diving charge distance remains 2".',
      },
      { nom: 'Note', texte: 'Giant spiders cannot be taken by a warband that has giant wolves.' },
    ],
  },
  cauchemar: {
    nom: 'Nightmare',
    texte: "Vampire counts sometimes need a mount to move quickly. After all, even dead, a horse keeps its four legs, doesn't it?",
    regles_speciales: [
      { nom: 'Cannot Run', texte: 'As Undead, a Nightmare cannot run, but may charge normally.' },
      { nom: 'Immune to Poison', texte: 'Nightmares are immune to poisons.' },
      {
        nom: 'Immune to Psychology',
        texte:
          'As Undead, Nightmares are immune to psychology, never need to take Leadership tests, and will always remain motionless if they have no leader. However, if the rider loses his last Wound, he will normally have to make a roll on the Whoa Boy! chart.',
      },
    ],
  },
  coursier_elfique: {
    nom: 'Elven Steed',
    texte:
      "Elven steeds are graceful animals that hide a very aggressive temperament in battle. Dark elves breed their own strain of steeds. High elves' steeds are usually dappled grey, wood elves' are chestnut, while the Druchii's are jet black.",
    regles_speciales: [
      {
        nom: 'Trained',
        texte: 'The animal is trained to fight. The rider may re-roll any failed control test. Only one re-roll may be made per test.',
      },
    ],
  },
  cheval: {
    nom: 'Horse',
    texte:
      'Horses are not trained for war and do not attack the enemy. They remain very useful nonetheless for moving quickly across the battlefield.',
  },
  destriers: {
    nom: 'Warhorses',
    texte: 'Warhorses are powerfully built horses trained for combat. They are mainly used by human warbands.',
    regles_speciales: [
      {
        nom: 'Trained',
        texte: 'The animal is trained to fight. The rider may re-roll any failed control test. Only one re-roll may be made per test.',
      },
    ],
  },
  destrier_du_chaos_market: {
    nom: 'Chaos Steed',
    texte: "Chaos steeds are twisted parodies of the Empire's magnificent chargers. They are ridden into battle by Chaos warbands.",
    regles_speciales: [
      {
        nom: 'Cannot Be Ridden by Possessed',
        texte: 'Even Chaos steeds refuse to be ridden by abominations such as the Possessed.',
      },
      {
        nom: 'Trained',
        texte: 'The animal is trained to fight. The rider may re-roll any failed control test. Only one re-roll may be made per test.',
      },
    ],
  },
  lion_de_pierre: {
    nom: 'Stone Lion',
    texte:
      'Works of a magical nature, carved from enchanted stone, these statues remain motionless, guarding temples. On closer inspection, these avatars are indistinguishable from an ordinary statue, only stirring when certain rules are violated within the temple grounds. The vast majority of these sculptures are heavily weathered by time, suggesting they may date from an ancient era and that the arcane knowledge used in their creation has been lost or remains unknown. Rumour has it that they hide within secret sanctuaries whose priests have been slaughtered by defilers. Ruins watched over by vigilant guardians who will resist all attempts to send them back to stillness, repelling those who dare uncover the mystery.',
    regles_speciales: [
      { nom: 'Fear', texte: 'Stone lions are supernaturally animated sculptures that cause fear.' },
      {
        nom: 'Save',
        texte:
          'Due to their stone-like skin, stone lions have a 5+ armour save that cannot be modified by Strength (or by other save modifiers).',
      },
      { nom: 'Ferocious Charge', texte: 'Stone lions attack at Strength+1 when charging, due to their mass.' },
      {
        nom: 'Magical Attacks',
        texte: "All of the stone lion's Attacks are considered magical, the same as Daemon Attacks.",
      },
      { nom: 'Immune to Poison', texte: 'Stone lions are unaffected by any poison.' },
    ],
  },
  loup_geant: {
    nom: 'Giant Wolf',
    texte:
      'The giant wolf is common in most of the mountains of the Known World. However, capturing a wolf cub to train is far from easy, especially for a frail goblin.',
    regles_speciales: [{ nom: 'Note', texte: 'Giant wolves cannot be taken by a warband that has giant spiders.' }],
  },
  mule_market: {
    nom: 'Mule',
    texte:
      'Their stubbornness is legendary. And yet? That doesn\'t stop halflings, dwarfs, and portly clerics from using them as mounts!',
    regles_speciales: [
      { nom: 'Slow', texte: 'A mule only moves 2D6" when uncontrollable.' },
      {
        nom: 'Mule-headed!',
        texte:
          'If a warrior rides a mule, or is in base contact with the mule, he must pass a Leadership test each turn or the animal will refuse to move forward.',
      },
      {
        nom: 'Pig-headed!',
        texte:
          'If it has no rider or handler, the mule moves in a randomly determined direction. If combat is taking place within 6", the mule moves away in the opposite direction.',
      },
      {
        nom: 'Peaceful',
        texte:
          'Mules do not fight and cannot charge in hand-to-hand combat: they refuse to move forward. If an enemy warrior charges a mounted mule, immediately roll on the Whoa Boy! chart. If an unmounted mule is charged, it becomes uncontrollable and moves directly away from its opponent.',
      },
    ],
  },
  rhinox: {
    nom: 'Rhinox',
    texte:
      'Beneath the ruined realm of the Mountains of Mourn Titans lie the ice fields where herds of rhinox graze. Rhinox have become a cultural cornerstone of the savage realms. Taming these ill-tempered beasts of burden is truly a feat of strength.',
    regles_speciales: [
      {
        nom: 'Availability',
        texte:
          'A Hero searching for a rhinox adds +1 to his rarity roll result for each point of Strength he has. If a rhinox is found, the Hero must make a Strength test. If the test fails, he is injured by the rhinox while trying to capture and tame it. Immediately roll on the Serious Injury table.',
      },
      { nom: 'Fear', texte: 'Rhinox are large and dangerous cave beasts, with horns as long as a grown man. They cause fear.' },
      {
        nom: 'Bad Temper',
        texte:
          "Even rhinox tamed by their rider have a temper as short as a pygmy's thumb. When declaring charges, if an enemy fighter is eligible for a charge by the rhinox's rider, he must pass a Leadership test or be forced to declare a charge (if there is a choice between several targets, the player controlling the rhinox may choose freely among them).",
      },
      {
        nom: 'Crushing Charge',
        texte:
          'A charging rhinox rider remains a terrifying sight, the ground trembling as the cave beast crashes into enemy ranks. Whenever a rhinox rider charges more than 7", he inflicts 1D3 impact hits based on the rhinox\'s base Strength.',
      },
    ],
  },
  sang_froid: {
    nom: 'Cold One',
    texte: 'These scaly creatures native to the New World are stupid and aggressive, but make excellent combat mounts.',
    regles_speciales: [
      { nom: 'Fear', texte: 'Cold ones cause fear.' },
      {
        nom: 'Stupid',
        texte:
          "Make a test against the rider's Leadership each turn. If the test is failed, apply the rules for stupidity. Otherwise, the model may act normally.",
      },
      { nom: 'Scaly Skin', texte: "Cold ones add +2 instead of +1 to their rider's armour save." },
    ],
  },
  sanglier_de_guerre_market: {
    nom: 'War Boar',
    texte:
      'Huge, ferocious, and hot-tempered: what more could an orc leader want? Orc warbands sometimes use these animals in the ruins of Mordheim or to travel through the surrounding countryside. They remain uncommon, however, as the biggest orcs invariably claim the right to ride them.',
    regles_speciales: [
      {
        nom: 'Furious Charge',
        texte:
          "Thanks to their bulk, war boars gain a +2 Strength bonus when charging. Note that this bonus only applies to the boar, not its rider.",
      },
      {
        nom: 'Thick Skin',
        texte: "The boar's thick skin and hide make it hard to wound. Boars add +2 instead of +1 to their rider's armour save.",
      },
    ],
  },
  tapis_volant: {
    nom: 'Flying Carpet',
    texte:
      'These wondrous objects from ancient times are even rarer than magic lamps. They are thought to originate from the far-off Isles of the Sorcerers, lost long ago.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'A flying carpet counts as an ordinary mount and allows 16" of movement, with no penalty for terrain. It can also be used to reach the upper floors of a building without being slowed down. The carpet can carry up to three human-sized creatures, or one large creature and one human-sized creature. One of the occupants must be a Hero. Due to its magical nature, the flying carpet is indestructible.',
      },
    ],
  },
  molosse_estalien: {
    nom: 'Estalian Mastiff',
    texte: 'An Estalian war dog, livelier and better trained for hunting than Old World mastiffs.',
  },
  singe_de_barbarie: {
    nom: 'Barbary Ape',
    texte: 'A small, cunning monkey, capable of scavenging through rubble and pilfering small items during battle.',
    regles_speciales: [
      {
        nom: 'Pilferer',
        texte: 'At the end of the game, if its owner survived, roll 1D6: on a 6, the ape brings back 1D6 gold crowns pilfered during the battle.',
      },
    ],
  },

  // --- Armures ---
  amulette_lunaire: {
    nom: 'Lunar Amulet',
    texte: 'Once activated, this ancient object creates a luminescent aura around its wearer, making it harder for the enemy to make out.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'Any missile aimed at the model wearing the amulet suffers a -1 penalty to hit. The amulet also grants its wearer a special 5+ save against shooting.',
      },
    ],
  },
  armure_cathayenne_soie_matelassee: {
    nom: 'Cathayan Quilted Silk Armour',
    texte:
      "Caravans from the distant lands of the East sometimes bring fabulous quilted silk armour, light as a feather and tough as steel. It is often worn beneath the armour or clothing of Imperial nobles to protect against assassins' arrows.",
    regles_speciales: [
      { nom: 'Layering', texte: 'Cathayan quilted silk armour can be combined with any other type of armour.' },
    ],
  },
  armure_du_chaos_market: {
    nom: 'Chaos Armour',
    texte:
      'Chaos armour is armour wrought from a strange and unnatural metal. It is a manifestation of the favour of a Dark God of Chaos. Most Chaos armour is obtained as a reward from a Hellforger. However, it may also be acquired from the Chaos Dwarfs in exchange for numerous slaves, or following an extraordinary act serving their interests.',
    regles_speciales: [
      { nom: 'Cost', texte: 'The cost of Chaos armour is reduced by 1 gold crown for every experience point the Hero possesses.' },
      {
        nom: 'Gift of Chaos',
        texte:
          "Chaos armour is a gift from the Dark Gods to the deserving warrior. A Hero who has acquired it will never give it to another member of his warband, and will equip it immediately. The armour then fuses with its wearer's body and can never be removed.",
      },
      {
        nom: 'Spellcasters',
        texte:
          'Chaos armour does not prevent its wearer from casting spells or performing rituals. It may be worn by spellcasters, but cannot be combined with a shield or buckler.',
      },
      {
        nom: 'Rarity',
        texte: 'When searching for Chaos armour, a warrior gains +1 to his search roll result for each enemy he took Out of Action in the previous battle.',
      },
    ],
  },
  armure_en_gromril_market: {
    nom: 'Gromril Armour',
    texte:
      'Gromril is the rarest and hardest metal in the Old World. Only a handful of dwarf craftsmen know how to work gromril, and the armour they forge fetches astronomical prices. Gromril armour costs four times the price of ordinary armour of the same type. You may choose which type of armour is offered to you.',
    regles_speciales: [
      {
        nom: 'Gromril Armour',
        texte:
          'Base armour price x4. Improves its armour save by +1 (a 6+ light armour becomes 5+, a 5+ heavy armour becomes 4+) and does not slow its wearer down if he also wears a shield.',
      },
    ],
  },
  armure_en_ithilmar_market: {
    nom: 'Ithilmar Armour',
    texte:
      'Ithilmar is a silvery metal as light as silk and harder than steel. Elves are experts at crafting weapons and armour from ithilmar, and the elven realm of Caledor is the only place in the world where this metal can be found. Ithilmar armour costs three times the price of ordinary armour of the same type. You may choose which type of armour is offered to you.',
    regles_speciales: [
      {
        nom: 'Ithilmar Armour',
        texte:
          'Base armour price x3. Improves its armour save by +1 (a 6+ light armour becomes 5+, a 5+ heavy armour becomes 4+) and does not slow its wearer down if he also wears a shield.',
      },
    ],
  },
  armure_lamellaire: {
    nom: 'Lamellar Armour',
    texte:
      "Smiths created this heavy armour for the noble Cathayan knights who guard the farms. This armour is common, particularly among the palace guard of the Emperor of Cathay. It covers not only the wearer's torso, but also the upper arms and thighs. Lamellar armour counts as heavy armour.",
    regles_speciales: [
      { nom: 'Movement', texte: 'A fighter wearing both this armour and a shield suffers a -1 Movement penalty.' },
    ],
  },
  armure_legere: {
    nom: 'Light Armour',
    texte:
      "A wide variety of materials are used to make light armour, ranging from boiled leather tunics to mail shirts. They don't provide complete protection against arrows or swords, but are still better than nothing. Light armour does not hinder movement.",
  },
  armure_lourde: {
    nom: 'Heavy Armour',
    texte:
      'Typical heavy armour is made of metal rings and is called mail armour. Forging mail armour is very long and tedious, as the armourer must assemble thousands of metal rings. The cost reflects this, but this type of armour provides excellent protection to those who can afford it. There are also other types of heavy armour, the most well-known being the steel breastplate and tassets worn by the foot knights of the Templar orders.',
    regles_speciales: [
      { nom: 'Movement', texte: 'A fighter wearing both this armour and a shield suffers a -1 Movement penalty.' },
    ],
  },
  armure_lourde_de_maitre: {
    nom: "Master's Heavy Armour",
    texte:
      'A legacy brought back from Tilea, where the art of forging extremely ornate and nearly impenetrable heavy armour is taught.',
    regles_speciales: [
      { nom: 'Hindered Movement', texte: 'A fighter wearing this armour suffers a -1 Movement penalty, even without a shield.' },
    ],
  },
  bouclier: {
    nom: 'Shield',
    texte:
      "There are two types of shields used in Mordheim: the first is made of wood, sometimes reinforced with metal plates. This basic type of shield, while relatively sturdy, tends to split, but this can sometimes save its bearer's life, as an opponent's weapon can get stuck in it. The opponent is then easy prey while he struggles to free his weapon. Metal shields are heavy and cumbersome, but resist blows for much longer. A typical Imperial shield is round or triangular, and bears the emblem of its owner's province or city.",
  },
  caparacon_bretonnien: {
    nom: 'Bretonnian Barding',
    texte:
      "Barding is armour for a horse, similar to the light armour worn by humans. It covers the animal's body and sometimes its head as well. This special armour is blessed by the Bretonnians, and is normally only available to Bretonnian knights.",
    regles_speciales: [
      {
        nom: 'Shell',
        texte:
          'A model mounted on a barded charger receives an additional +1 save bonus (so +2 in total). In addition, a mount fitted with barding that is taken Out of Action will only be killed on a result of 1 on 1D6 at the end of the game (instead of 1-2).',
      },
    ],
  },
  caparacon: {
    nom: 'Barding',
    texte:
      "Barding is armour for a horse, similar to the light armour worn by humans. It covers the animal's body and sometimes its head as well.",
    regles_speciales: [
      {
        nom: 'Shell',
        texte:
          'A model mounted on a barded charger receives an additional +1 save bonus (so +2 in total). In addition, a mount fitted with barding that is taken Out of Action will only be killed on a result of 1 on 1D6 at the end of the game (instead of 1-2).',
      },
      { nom: 'Movement Penalty', texte: 'A mount wearing barding suffers a -1 Movement penalty.' },
    ],
  },
  cape_en_peau_de_dragon_des_mers: {
    nom: 'Sea Dragon Skin Cloak',
    texte:
      'Dark elf corsairs wear cloaks cut from the hide of sea monsters. These cloaks are tough and offer excellent protection.',
    regles_speciales: [
      { nom: 'Effect', texte: 'A sea dragon skin cloak provides a 5+ armour save in hand-to-hand combat, 4+ against shooting.' },
      { nom: 'Movement', texte: 'A fighter wearing both this armour and a shield suffers a -1 Movement penalty.' },
    ],
  },
  cape_en_peau_de_loup: {
    nom: 'Wolf Skin Cloak',
    texte:
      'In Middenheim, it is still considered that one must kill a great wolf with one\'s bare hands to be a true man. Warriors who accomplish such a feat earn the respect of their peers, and their cloaks are blessed by the high priest of the cult of Ulric, god of winter, war, and wolves. To acquire a wolf skin cloak, the Hero must pay 10 gold crowns (this represents the cost of travelling to Middenheim and taking part in a hunt). In addition, the Hero must roll equal to or less than his Strength on 1D6 to succeed in finding and killing the wolf. He can then make a cloak from its skin as a mark of skill and courage. Note that Middenheimers may buy wolf skin cloaks when creating the warband without making an availability test.',
    regles_speciales: [
      { nom: 'Effect', texte: 'A model wearing a wolf skin cloak gains +1 to its saves against all shooting attacks.' },
    ],
  },
  cape_en_peau_des_hommes_lezards: {
    nom: 'Lizardmen Skin Cloak',
  },
  casque_marmite: {
    nom: 'Pot Helm',
    texte:
      'Any self-respecting Master Cook will trade his ridiculous white toque for an even more ridiculous cooking pot to protect himself when a fight is brewing. It may seem incredibly foolish, but it often lets the Halfling keep his head intact after the battle.',
    regles_speciales: [
      {
        nom: 'Avoid Stunning',
        texte:
          "A Master Cook fitted with a pot helm gets a special 5+ save against a Stunned result. This save is not modified by the opponent's Strength.",
      },
    ],
  },
  cuir_durci: {
    nom: 'Hardened Leather',
    texte:
      'The best tanners can turn (out-of-fashion) leather coats into armour, and the less wealthy often turn to such protection since other kinds are so costly. Covered with crusts of salt, alcohol, and other less appetising substances, hardened leather is hard to pierce and offers some protection in combat.',
    regles_speciales: [
      {
        nom: 'Restricted Combinations',
        texte:
          'Hardened leather armour gives a 6+ save, like light armour, except that it cannot be combined with any other type of armour, other than helmets and bucklers.',
      },
      {
        nom: 'Unsellable',
        texte: 'Hardened leather armour cannot be resold, as the stench it gives off is enough to drive away even the most desperate buyers.',
      },
      {
        nom: 'Spellcasting',
        texte:
          "Although hardened leather is miscellaneous equipment and does not need to be on the warband's equipment list to be used, it is nonetheless armour, which prevents casting spells.",
      },
    ],
  },
  ecu: {
    nom: 'Great Shield',
    regles_speciales: [
      {
        nom: 'Save',
        texte:
          'A fighter fitted with a great shield gets a 5+ armour save on foot, and 6+ if mounted (or, if he already wears armour, a bonus of +2 on foot and +1 when mounted). The armour save can never go below 1+.',
      },
    ],
  },
  exosquelette: {
    nom: 'Exoskeleton',
    texte:
      'The Curse of Stone falls upon all Chaos Dwarf Hierogrammates, gradually turning them to rock, starting with their feet. Engineers have designed machines that can carry their priests once they begin to pay the price of their dark rituals.',
    regles_speciales: [
      { nom: 'Ready to Roll', texte: 'A wizard fitted with an exoskeleton gets +3 Movement.' },
      { nom: 'Chaos Armour', texte: 'An exoskeleton counts as Chaos armour and the following rules apply.' },
      { nom: 'Cost', texte: 'The cost of the exoskeleton is reduced by 1 gold crown for every experience point the Hero possesses.' },
      {
        nom: 'Gift of Chaos',
        texte:
          'A Hero who has acquired an exoskeleton will never give it to another member of his warband, and will equip it immediately. It can never be removed.',
      },
      {
        nom: 'Spellcasters',
        texte: 'The exoskeleton does not prevent its wearer from casting spells or performing rituals, but cannot be combined with a shield or buckler.',
      },
      {
        nom: 'Rarity',
        texte: 'When searching for an exoskeleton, a warrior gains +1 to his search roll result for each enemy he took Out of Action in the previous battle.',
      },
    ],
  },
  pavois: {
    nom: 'Pavise',
    texte:
      'A pavise is a huge shield commonly used by soldiers on the battlefield to defend themselves against enemy arrows. It is heavy equipment, rarely used in hand-to-hand combat, but very effective against shooting.',
    regles_speciales: [
      {
        nom: 'Cover / Save',
        texte:
          'A warrior using a pavise is considered to be under cover against missile fire (-1 to hit). In hand-to-hand combat, the pavise counts as a shield (+1 armour save) but only if the warrior was charged from the front. The Pavise is so heavy and cumbersome that its bearer moves at half speed.',
      },
    ],
  },
  peaux_enchantees: {
    nom: 'Enchanted Skins',
    texte: 'The animal skins and amulets worn by the Amazons are imbued with protective magic.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'Any model wearing enchanted skins gets a special 6+ save against any Wound inflicted. In addition, the wearer of enchanted skins is unaffected by enemy magic on a result of 5+.',
      },
    ],
  },
  rondache: {
    nom: 'Buckler',
    texte:
      'Bucklers are small round shields designed to parry and deflect blows. They are often made of steel, as they must be very sturdy to withstand furious blows in hand-to-hand combat. Wielding one takes great skill, but an agile warrior can protect himself from blows that would otherwise maim him for certain.',
    regles_speciales: [
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
    ],
  },
  casque: {
    nom: 'Helmet',
    texte:
      'From Bretonnian knights with their gleaming helms to Skaven wearing leather hoods, all sensible warriors try to protect the most vulnerable part of their body: their head. Even the most vain wear helmets, whether adorned with feathers, horns, or other decorations. A helmet\'s shape and size may vary, but its function always remains the same.',
    regles_speciales: [
      {
        nom: 'Protection',
        texte:
          "The fighter gets a special 4+ save against a Stunned result. If the save succeeds, turn the Stunned result into Knocked Down. This save is not modified by the opponent's Strength.",
      },
    ],
  },

  // --- Armes à poudre noire ---
  arquebuse: {
    nom: 'Arquebus',
    texte:
      'The arquebus is a rudimentary firearm whose manufacturing quality ranges from the crude wooden hackbuts of the Nuln artillery school to the sophisticated dwarf firearms. The latter are fitted with levers and springs that hold the lit match, and triggers that activate the firing mechanism. Arquebuses are not very reliable weapons: the barrel occasionally explodes and the powder sometimes refuses to ignite. But their range is extraordinary and their penetrating power makes a mockery of even the thickest armour. In Mordheim, arquebuses are rare and expensive, but a warband equipped with such weapons will command the respect of all rivals. The arquebus is eligible for the double barrel option for Nuln Artillerists.',
    regles_speciales: [
      {
        nom: 'Save Modifier',
        texte:
          'The weapon punches through armour even better than its Strength suggests. A model Wounded by this weapon takes its armour save with an additional -1 penalty.',
      },
      {
        nom: 'Move or Shoot',
        texte: 'It is not possible to move and shoot during the same turn, except to turn on the spot or stand up.',
      },
      { nom: 'Reloading', texte: 'It takes a full turn to reload the weapon, so it can only fire every other turn.' },
    ],
  },
  arquebuse_a_repetition: {
    nom: 'Repeater Arquebus',
    texte:
      "These represent the next stage in the evolution of multi-barrelled arquebuses. This repeating weapon is made up of a number of barrels mounted around a rotating cylinder, each firing in turn. Often prone to malfunction, repeater arquebuses are nonetheless highly sought after, as they can unleash a veritable storm of lead upon the enemy if they don't explode.",
    regles_speciales: [
      {
        nom: 'Experimental',
        texte:
          "This weapon is always subject to the optional black powder weapon rules from the Mordheim Rulebook, even if they are not used in your campaign. For any result other than 'BOOM!', the weapon has jammed or run out of ammunition and the barrels must be reloaded.",
      },
      { nom: 'Save Modifier', texte: 'See Arquebus.' },
      { nom: 'Move or Shoot', texte: 'See Arquebus.' },
      {
        nom: 'Long Reload',
        texte:
          'Reloading a repeater arquebus takes time and requires a fair amount of concentration. The warrior can do nothing else for a full turn in order to reload the weapon (no movement, no shooting, no hand-to-hand combat, etc.).',
      },
      {
        nom: 'Triple Shot',
        texte:
          'The repeater arquebus may fire up to 3 times. If more than one shot is made, the shooter suffers a -1 penalty to hit. Resolve each shot individually; each shot may have a different target as long as the next target is within 3" of the previous one. The usual target selection rules apply normally.',
      },
    ],
  },
  canon_crache_plomb: {
    nom: 'Lead-Spitter Cannon',
    texte: 'In the Border Town Burning setting, only the Maneaters have access to the portable mortar, under the name lead-spitter cannon.',
    regles_speciales: [
      {
        nom: 'See Portable Mortar',
        texte: 'Renamed version of the Portable Mortar for the Maneaters; same rules (Scatter, Experimental, Save Modifier, Move or Shoot, Blast Radius, Reloading).',
      },
    ],
  },
  long_fusil_du_hochland: {
    nom: 'Hochland Long Rifle',
    texte:
      'Hochland is a province famous for its huntsmen, and the favoured weapon of its nobility for hunting is a long-range rifle. It is a rare and precious weapon that only the most talented armourer can manage to craft. The Hochland long rifle is eligible for the double barrel option for Ostlander Mercenaries.',
    regles_speciales: [
      { nom: 'Choice of Target', texte: 'This weapon allows the shooter to target any model in sight, not just the closest one.' },
      {
        nom: 'Save Modifier',
        texte:
          'The weapon punches through armour even better than its Strength suggests. A model Wounded by this weapon takes its armour save with an additional -1 penalty.',
      },
      {
        nom: 'Move or Shoot',
        texte: 'It is not possible to move and shoot during the same turn, except to turn on the spot or stand up.',
      },
      {
        nom: 'Reloading',
        texte:
          'It takes a full turn to reload the weapon, so it can only fire every other turn. If you have a pair of these weapons, you may fire once per turn.',
      },
    ],
  },
  mortier_portable: {
    nom: 'Portable Mortar',
    texte:
      "With the explosive power of a true mortar, a device small enough to be carried by a single man lets a warrior lob an explosive into the heart of the enemy's ranks, sowing death and confusion.",
    regles_speciales: [
      {
        nom: 'Scatter',
        texte:
          'If the fighter fails his roll to hit, the shot lands 2D6" away, in a random direction (determined by a scatter die or any other method agreed upon by the players).',
      },
      {
        nom: 'Experimental',
        texte:
          "This weapon is always subject to the optional black powder weapon rules from the Mordheim Rulebook, even if they are not used in your campaign. For any result other than 'BOOM!', the weapon has jammed or run out of ammunition and the barrels must be reloaded.",
      },
      {
        nom: 'Save Modifier',
        texte:
          'The weapon punches through armour even better than its Strength suggests. A model Wounded by this weapon takes its armour save with an additional -1 penalty.',
      },
      {
        nom: 'Move or Shoot',
        texte: 'It is not possible to move and shoot during the same turn, except to turn on the spot or stand up.',
      },
      {
        nom: 'Blast Radius',
        texte:
          'After determining the point of impact, the explosion created by the bomb will cover a small area. All models within 1.5" of the point of impact are hit by a Strength 4 hit caused by the blast.',
      },
      { nom: 'Reloading', texte: 'It takes a full turn to reload the weapon, so it can only fire every other turn.' },
    ],
  },
  pierrier: {
    nom: 'Swivel Gun',
    texte:
      'Sometimes, pirate gunners build and carry onto the battlefield a scaled-down version of the actual cannons usually mounted on swivels at the rails or sides of the ship. Although smaller than ordinary cannons, these swivel-mounted guns are so large they must be mounted on a wooden support. They are cumbersome and more prone to jamming than more common black powder weapons, due to imperfect casting or a poor mix of black powder. Even so, most gunners agree that these drawbacks are more than made up for by their power.',
    regles_speciales: [
      {
        nom: 'Massive',
        texte:
          'The user has -1 Initiative and -1 Movement for the entire battle. In addition, swivel guns can never fire twice per turn or fire while the user is moving, regardless of the user\'s skills.',
      },
      {
        nom: 'Move or Shoot',
        texte: 'It is not possible to move and shoot during the same turn, except to turn on the spot or stand up.',
      },
      { nom: 'Reloading', texte: 'It takes a full turn to reload a swivel gun, so it can only fire every other turn.' },
      {
        nom: 'Only One',
        texte: "A Pirates warband may only have a single swivel gun, due to the time the ship's craftsmen need to maintain it.",
      },
      {
        nom: 'Black Powder',
        texte:
          'Due to the questionable nature of the materials used in their construction, the optional black powder weapon rules on page 184 of the Mordheim Rulebook always apply to swivel guns.',
      },
      {
        nom: 'Special Ammunition',
        texte:
          'Swivel guns use unconventional ammunition types that must be purchased for each game. Each type of ammunition only lasts for the duration of one battle. So, if used during a game, it cannot be used again until new ammunition is bought. Before firing, the shooter must declare which type of ammunition is being used if more than one type is available (see special ammunition: Round Shot, Chain Shot, Grapeshot).',
      },
    ],
  },
  boulet_pierrier: {
    nom: 'Round Shot (swivel gun ammunition)',
    texte: 'A swivel gun firing these heavy lead balls can stop an ogre dead in his charge!',
    regles_speciales: [
      {
        nom: 'Blunt Force',
        texte:
          'The impact of the heavy lead projectile is enough to stun even the toughest of warriors. A damage roll of 2-4 (instead of the usual 3-4) is treated as Stunned.',
      },
      { nom: 'Armour Save -2', texte: 'The armour save suffers a -2 penalty.' },
    ],
  },
  chaines_pierrier: {
    nom: 'Chain Shot (swivel gun ammunition)',
    texte: "These metal chains don't cause as much damage, but can entangle an opponent and bring him to his knees.",
    regles_speciales: [
      {
        nom: 'Entangle',
        texte:
          'Enemies hit by chain shot fire, but not wounded, are Knocked Down on a roll of 4+ on 1D6, even if they normally cannot be Knocked Down.',
      },
      { nom: 'Armour Save -1', texte: 'The armour save suffers a -1 penalty.' },
    ],
  },
  mitraille_pierrier: {
    nom: 'Grapeshot (swivel gun ammunition)',
    texte:
      'Small casks filled with metal balls, pebbles, scrap metal, and even salt crystals are used to reload the gun. It can then fire a cloud of shrapnel.',
    regles_speciales: [
      {
        nom: 'Shrapnel',
        texte:
          "If a hit is scored, 1D6 other enemies within 4\" of the target and in the shooter's line of sight automatically suffer a hit. If the initial target was in the open, only targets in the open can be hit (targets in cover can only be hit if the initial target was in cover). Additional targets are hit starting from the fighter closest to the initial target to the farthest. Hidden fighters, if within the shooter's line of sight, are also considered close to the initial target and may therefore be hit. Pirates know to duck for cover when they hear a swivel gun go off, and are therefore never hit by an allied grapeshot shot.",
      },
      { nom: 'No Armour Save', texte: 'No armour save is allowed.' },
    ],
  },
  pigeon_explosif: {
    nom: 'Hersten-Wenkler Explosive Pigeon',
    texte:
      "When the Empire became aware of the full potential of black powder, it was only a matter of time before a few enterprising engineers combined explosives and small animals. After initial failures with rats, bats, and dogs, promising results were obtained with pigeons. Although not very accurate, pigeons can quickly reach distant targets and, once launched, are very difficult to intercept. Upon arrival, the pigeon's small metal harness detaches, releasing the bomb to devastate a small area below, while the pigeon calmly flies home...",
    regles_speciales: [
      {
        nom: 'Temperamental',
        texte:
          "When launching an explosive pigeon, do not use the fighter's Ballistic Skill. Instead, roll 1D6: 1 = something went wrong and the pigeon explodes in the Hero's hands... he and anyone within 1.5\" suffer a Strength 4 hit. 2-4 = the fuse wasn't cut to the right length and the bomb explodes in mid-flight before reaching its target. 5-6 = the bomb reaches its target.",
      },
      {
        nom: 'Move or Shoot',
        texte: 'It is not possible to move and shoot during the same turn, except to turn on the spot or stand up.',
      },
      {
        nom: 'Pigeon Loft',
        texte: 'When a Hero buys explosive pigeons, he has enough for the whole game, and his supply is replenished at the start of each new game.',
      },
      {
        nom: 'Blast Radius',
        texte:
          'After determining the point of impact, the explosion created by the explosive pigeon will cover a small area. All models within 1.5" of the point of impact are hit by a Strength 4 hit caused by the blast.',
      },
    ],
  },
  pistolet: {
    nom: 'Pistol',
    texte:
      'A pistol is a simple black powder weapon, fitted with a spring-loaded firing mechanism. Most pistols are expensive, unreliable, and poorly made. The pistol is eligible for the double barrel option for Nuln Artillerists and Ostlander Mercenaries.',
    regles_speciales: [
      {
        nom: 'Hand-to-Hand',
        texte:
          'This weapon may be used once during the first round of hand-to-hand combat. Used alongside another weapon, it grants +1 Attack (+2 Attacks with a pair). These extra attacks are resolved with Weapon Skill and may be parried.',
      },
      {
        nom: 'Save Modifier',
        texte:
          'The weapon punches through armour even better than its Strength suggests. A model Wounded by this weapon takes its armour save with an additional -1 penalty.',
      },
      {
        nom: 'Reloading',
        texte:
          'It takes a full turn to reload the weapon, so it can only fire every other turn. If you have a pair of these weapons, you may fire once per turn.',
      },
    ],
  },
  pistolet_a_malepierre: {
    nom: 'Warpstone Pistol',
    texte:
      "Warpstone pistols are formidable weapons, testament to Clan Skryre's twisted genius. These pistols fire ammunition made from bewitched warpstone fragments. These bullets cause horrific wounds that often degenerate into terrible infections.",
    regles_speciales: [
      {
        nom: 'Save Modifier',
        texte:
          'The weapon punches through armour even better than its Strength suggests. A model Wounded by this weapon takes its armour save with an additional -1 penalty (i.e. -3 in total).',
      },
      {
        nom: 'Reloading',
        texte:
          'It takes a full turn to reload the weapon, so it can only fire every other turn. If you have a pair of these weapons, you may fire once per turn.',
      },
    ],
  },
  pistolet_a_repetition: {
    nom: 'Repeater Pistol',
    texte:
      "It didn't take long for Imperial engineers to adapt the repeater arquebus mechanism onto a pistol. Although they too are prone to regular malfunction, they have found their place in the army's armouries. Tales of stone-faced officers firing on hordes of enemies while standing atop a pile of corpses are, in all likelihood, legends. But it could well happen...",
    regles_speciales: [
      {
        nom: 'Experimental',
        texte:
          "This weapon is always subject to the optional black powder weapon rules from the Mordheim Rulebook, even if they are not used in your campaign. For any result other than 'BOOM!', the weapon has jammed or run out of ammunition and the barrels must be reloaded.",
      },
      {
        nom: 'Save Modifier',
        texte:
          'The weapon punches through armour even better than its Strength suggests. A model Wounded by this weapon takes its armour save with an additional -1 penalty.',
      },
      {
        nom: 'Not a Club',
        texte:
          'The repeater pistol may be used as a normal pistol during the first round of hand-to-hand combat. After that, it does not count as an additional weapon, as it is too fragile to be used in such a crude manner. Its owner will not willingly part with it during a fight and will have to fight without using an additional weapon.',
      },
      {
        nom: 'Quick Reload',
        texte:
          "The repeater pistol's design and number of barrels allow for a quick reload. The repeater pistol will always be able to fire at least one shot. If the weapon is used in triple shot mode, the fighter must spend a full Shooting phase, without being engaged in hand-to-hand combat, to reload the weapon.",
      },
      {
        nom: 'Triple Shot',
        texte:
          'The repeater pistol may fire up to 3 times. If more than one shot is made, the shooter suffers a -1 penalty to hit. Resolve each shot individually; each shot may have a different target as long as the next target is within 3" of the previous one. The usual target selection rules apply normally.',
      },
    ],
  },
  pistolet_de_duel: {
    nom: 'Duelling Pistol',
    texte:
      "A duelling pistol is a true work of art, and an armourer must put in long and meticulous work to craft one. These are weapons of exorbitant cost that the average warrior rarely has the chance to own: even if one manages to steal or buy one, the price of ammunition remains astronomical. Some of Mordheim's wealthiest warriors carry duelling pistols to signal their rank and inspire respect and envy. Duelling pistols are eligible for the double barrel option for Nuln Artillerists.",
    regles_speciales: [
      {
        nom: 'Hand-to-Hand',
        texte:
          'This weapon may be used once during the first round of hand-to-hand combat. Used alongside another weapon, it grants +1 Attack (+2 Attacks with a pair). These extra attacks are resolved with Weapon Skill and may be parried.',
      },
      {
        nom: 'Save Modifier',
        texte:
          'The weapon punches through armour even better than its Strength suggests. A model Wounded by this weapon takes its armour save with an additional -1 penalty.',
      },
      { nom: 'Accuracy', texte: 'This weapon is designed for accuracy. Any shot with this weapon gets a +1 bonus to hit.' },
      {
        nom: 'Reloading',
        texte:
          'It takes a full turn to reload the weapon, so it can only fire every other turn. If you have a pair of these weapons, you may fire once per turn.',
      },
    ],
  },
  tromblon: {
    nom: 'Blunderbuss',
    texte:
      'A blunderbuss is a rudimentary black powder weapon that fires a hail of lead shot, rusty rivets, bent nails, and other scrap metal. This powerful but hazardous weapon takes an enormous amount of time to reload, so most warriors discard it after the first shot.',
    regles_speciales: [
      {
        nom: 'Discharge',
        texte: 'When the weapon fires, draw a line 16" long and 1" wide in any direction. All models in its path are automatically hit by a Strength 3 hit.',
      },
      { nom: 'Single Shot', texte: 'This weapon takes time to reload and can only be used once per game.' },
    ],
  },
  tromblon_nain_du_chaos: {
    nom: 'Chaos Dwarf Blunderbuss',
    texte:
      'Chaos Dwarfs are renowned for using large numbers of these infamous blunderbusses against enemy infantry. They employ the same tactic in street fights across Mordheim.',
    regles_speciales: [
      {
        nom: 'Discharge',
        texte: 'When the weapon fires, draw a line 16" long and 1" wide in any direction. All models in its path are automatically hit by a Strength 3 hit.',
      },
      { nom: 'Reloading', texte: 'It takes a full turn to reload the weapon, so it can only fire every other turn.' },
      {
        nom: 'Systematic Misfires',
        texte:
          'Unlike other black powder weapons, this blunderbuss always uses the optional misfire rules, even if they are not used in the campaign: before firing, roll 1D6 — on a result of 1, resolve a misfire on the dedicated table.',
      },
    ],
  },
  double_canon: {
    nom: 'Double Barrel (option)',
    texte:
      'Originally created by an innovative Ostland blacksmith for a vampire hunter, the engineers of the Nuln College of Engineering quickly grasped the concept. The idea is fairly simple: it is simply a black powder weapon with a pair of barrels and a trigger, capable of firing one or both barrels at once, giving it the ability to punch through the thickest armour. The following black powder weapons may benefit from the double barrel option (see each weapon\'s price table for cost and rarity): Arquebus (Nuln Artillerists), Hochland Long Rifle (Ostlander Mercenaries), Pistol (Nuln Artillerists, Ostlander Mercenaries), Duelling Pistol (Nuln Artillerists).',
    regles_speciales: [
      {
        nom: 'Double Barrel',
        texte:
          'A double-barrelled weapon is fitted with a delicate mechanism, but proves to be an effective weapon in combat. When firing such a weapon, the shooter must declare whether he is firing with one or both barrels. If firing with a single barrel, treat the shot as you normally would for the weapon\'s ordinary equivalent. If firing with both barrels: To hit, make a single roll, as you normally would — this weapon allows a combined shot. To wound, make a roll for each hit, as each barrel can Wound individually — roll for Critical Hit results.',
      },
      {
        nom: 'Reloading',
        texte:
          'After firing both barrels, place 2 tokens next to the model. During your next Shooting phase, remove 1 token. It represents one of the barrels having been reloaded. Removing tokens is the last action taken during your Shooting phase. You therefore cannot reload and fire with the same weapon during the same Shooting phase.',
      },
      {
        nom: 'Reloading a Pair',
        texte: 'When reloading a pair of pistols, place 4 tokens of 2 different colours (one for each pistol). Each turn, remove one token of each colour.',
      },
    ],
  },
  pistolet_double_canon: {
    nom: 'Double-Barrelled Pistol',
    texte: 'A pistol fitted with two stacked barrels, allowing two shots before needing to reload. Heavier and less reliable than a single pistol.',
    regles_speciales: [
      {
        nom: 'Double Shot',
        texte: 'This weapon fires two shots before needing to be reloaded (instead of just one for a normal pistol).',
      },
      { nom: 'Reloading', texte: 'It takes a full turn to reload the weapon after its two shots.' },
    ],
  },
  long_fusil_hochland_double_canon: {
    nom: 'Double-Barrelled Hochland Long Rifle',
    texte:
      'A two-barrelled variant of the famous Hochland long rifle, even rarer and more expensive than the original, but capable of mowing down two targets before needing to reload.',
    regles_speciales: [
      { nom: 'Double Shot', texte: 'This weapon fires two shots before needing to be reloaded.' },
      {
        nom: 'Move or Shoot',
        texte: 'It is not possible to move and shoot during the same turn, except to turn on the spot or stand up.',
      },
      { nom: 'Reloading', texte: 'It takes a full turn to reload the weapon after its two shots.' },
      { nom: 'Aim', texte: 'A shooter who does not move may re-roll a failed roll to hit.' },
    ],
  },
  pistolet_duel_double_canon: {
    nom: 'Double-Barrelled Duelling Pistol',
    texte: 'A two-barrelled variant of the duelling pistol, as precious as it is delicate to maintain. Eligible for the double barrel option.',
    regles_speciales: [
      {
        nom: 'Double Shot',
        texte: 'This weapon fires two shots before needing to be reloaded (instead of just one for a normal duelling pistol).',
      },
      {
        nom: 'Save Modifier',
        texte:
          'The weapon punches through armour even better than its Strength suggests. A model Wounded by this weapon takes its armour save with an additional -1 penalty.',
      },
      { nom: 'Accuracy', texte: 'This weapon is designed for accuracy. Any shot with this weapon gets a +1 bonus to hit.' },
      { nom: 'Reloading', texte: 'It takes a full turn to reload the weapon after its two shots.' },
    ],
  },
  arquebuse_double_canon: {
    nom: 'Double-Barrelled Arquebus',
    texte: 'An arquebus fitted with a pair of barrels, capable of punching through the thickest armour. Eligible for the double barrel option.',
    regles_speciales: [
      {
        nom: 'Double Shot',
        texte: 'This weapon fires two shots before needing to be reloaded (instead of just one for a normal arquebus).',
      },
      {
        nom: 'Save Modifier',
        texte:
          'The weapon punches through armour even better than its Strength suggests. A model Wounded by this weapon takes its armour save with an additional -1 penalty.',
      },
      {
        nom: 'Move or Shoot',
        texte: 'It is not possible to move and shoot during the same turn, except to turn on the spot or stand up.',
      },
      { nom: 'Reloading', texte: 'It takes a full turn to reload the weapon after its two shots.' },
    ],
  },

  // --- Armes de tir ---
  arbalete: {
    nom: 'Crossbow',
    texte:
      'A crossbow consists of a small, powerful bow mounted on a wooden or steel stock. It takes time to prepare a crossbow to fire, but the bolts it fires have an enormous range and easily pierce armour. Crossbows are much longer to make than bows, and are therefore expensive and quite rare. Many at Mordheim nonetheless prize them for their power and range.',
    regles_speciales: [
      {
        nom: 'Move or Shoot',
        texte: 'It is not possible to move and shoot during the same turn, except to turn on the spot or stand up.',
      },
    ],
  },
  arbalete_de_poing: {
    nom: 'Hand Crossbow',
    texte:
      'Hand crossbows are masterpieces crafted by master gunsmiths: miniatures with the power and accuracy of true crossbows. They can be easily concealed under clothing and are highly prized by assassins.',
    regles_speciales: [
      {
        nom: 'Melee Shot',
        texte:
          'The fighter may use this weapon during the first round of hand-to-hand combat. This attack is always resolved first, before other attacks, using Ballistic Skill and a -2 penalty to hit. This attack is in addition to normal hand-to-hand attacks.',
      },
    ],
  },
  arbalete_a_repetition: {
    nom: 'Repeater Crossbow',
    texte:
      'Repeater crossbows are complex, costly, and difficult to make. They are therefore rather rare, but not without their advantages: they can fire a hail of bolts at the enemy, and a warrior can use one while moving at a good pace.',
    regles_speciales: [
      { nom: 'Double Shot', texte: 'The weapon may fire twice per turn, with an additional -1 penalty to hit on each shot.' },
    ],
  },
  arc_court: {
    nom: 'Short Bow',
    texte:
      'These are small, short-range bows, cheap and easy to handle. Some riders use these bows, as other models are too long for mounted shooting. Small creatures, too weak to use more powerful bows, must also make do with short bows.',
  },
  arc: {
    nom: 'Bow',
    texte: 'The bow is used by most races, especially in times of war. It is a simple but powerful weapon, cheap to make and easy to maintain.',
  },
  arc_long: {
    nom: 'Long Bow',
    texte:
      "A long bow is made of alternating layers of yew or elm wood. A skilled archer can hit the leaf of his choosing on a tree at three hundred paces with such a weapon. The long bow is the weapon of choice for experienced archers due to its long range and great accuracy.",
  },
  arc_elfique: {
    nom: 'Elf Bow',
    texte:
      'Elf bows are the finest of their kind. Made from ithilmar or wood from the elven forests, with strings woven from the hair of elf maidens, elf bows are far superior to the missile weapons of other races. In the hands of an elf archer, the elf bow is fearsomely effective thanks to its long range and great penetrating power.',
    regles_speciales: [
      {
        nom: 'Save Modifier -1',
        texte:
          'The weapon punches through armour even better than its Strength suggests. A model Wounded by this weapon takes its armour save with an additional -1 penalty.',
      },
    ],
  },
  baton_solaire_lustrie: {
    nom: 'Sun Staff (Lustria Setting)',
    texte:
      'The sun staff is a long tube made of multicoloured metal with one hollow end. Strange runes are engraved along its entire length, and a gem is set into its pommel.',
    regles_speciales: [
      {
        nom: 'Sun Shot',
        texte:
          "During the Shooting phase, the bearer of the sun staff may unleash a beam of energy resembling the sun's rays. The sun shot has a range of 12\" and a Strength of 4. Except for magical protections and side-step, a sun shot ignores armour saves.",
      },
    ],
  },
  baton_solaire_mordheim: {
    nom: 'Sun Staff (Mordheim Setting)',
    texte:
      'The sun staff is a long tube of multicoloured metal with one hollow end. Strange runes are engraved along its entire length, and a gem is set into its pommel. Despite its ancient age (the Loremasters of the White Tower of Hoeth claim to have found a similar object over twenty thousand years old — older than the elven race itself!), the sun staff can emit a beam of energy as bright as the sun.',
    regles_speciales: [
      { nom: 'Accurate Weapon', texte: 'The sun staff does not suffer the usual -1 penalty to hit at long range.' },
      {
        nom: 'No Save',
        texte: 'The weapon can pass through any material. A fighter Wounded by this weapon gets no armour save, except for magical protections and side-step.',
      },
    ],
  },
  arme_de_jet: {
    nom: 'Throwing Weapon (star, knife, etc.)',
    texte:
      'Throwing stars are mainly used by assassins of the sinister House of Shadows, or by bandits who specialise in attacking the unwary. A well-balanced knife thrown into the back has ended the lives of many of Mordheim\'s nobles and merchants. Throwing knives are unsuited to hand-to-hand combat, as they are not properly balanced for it.',
    regles_speciales: [
      {
        nom: 'Throwing Weapon',
        texte: 'This weapon is perfectly balanced for throwing, and the fighter using it suffers no penalties for long range or for having moved. However, it cannot be used in hand-to-hand combat.',
      },
    ],
  },
  bolas: {
    nom: 'Bolas',
    texte:
      'Bolas are made of three stone or bronze spheres tied together. They are wielded like a sling, but in this case, both the thrower and the projectile are launched. This is a hunting weapon intended to immobilise prey without killing it. They can only be used once per battle, though they are recovered at the end of it.',
    regles_speciales: [
      { nom: 'Dangerous', texte: "If the roll to hit results in a 1, the bolas strike their thrower's head and cause a Strength 3 hit." },
      {
        nom: 'Entangle',
        texte:
          "A model hit by the bolas is not Wounded, but becomes entangled and can no longer move. It also suffers a -2 penalty to its Weapon Skill in hand-to-hand combat. The victim may still shoot and may attempt to free itself during the Recovery phase. If it rolls 4+ on 1D6, it succeeds and may move and fight normally again.",
      },
    ],
  },
  cabillot: {
    nom: 'Belaying Pin',
    texte:
      'A typical ship contains hundreds of these small carved pieces of wood. They are placed in racks at strategic points around the ship, around which rigging can be secured. They also make good weapons, and pirates quickly become skilled at using them as short-range weapons.',
    regles_speciales: [
      {
        nom: 'Thrown Weapon',
        texte: 'Fighters using this weapon suffer no penalty for long range, but still suffer a -1 penalty after moving.',
      },
      { nom: '+1 Enemy Save', texte: 'An enemy Wounded by this weapon gets +1 to his armour save, or a 6+ save if he has none.' },
    ],
  },
  fleches_aspic: {
    nom: 'Asp Arrows',
    texte: 'Made from the mummified remains of venomous snakes, they are guided through the air by ancient magic.',
    regles_speciales: [
      {
        nom: 'Accuracy',
        texte: 'This weapon is designed for accuracy. Any shot or hand-to-hand attack with this weapon gets a +1 bonus to hit.',
      },
    ],
  },
  fronde: {
    nom: 'Sling',
    texte:
      'Slings are rarely used, being no more powerful than bows while having a shorter range. A sling is nothing more than a loop of cloth or leather in which a stone is placed. The slinger whirls his weapon above his head before releasing the stone towards his target. Although many archers look down on this weapon, a skilled slinger can kill a man at a considerable distance, and ammunition can be found everywhere!',
    regles_speciales: [
      {
        nom: 'Double Shot at Half Range',
        texte:
          'If he does not move during the Movement phase and is at half range, the user of this weapon may fire twice. However, each shot suffers a -1 penalty to hit.',
      },
    ],
  },
  gantelet_du_soleil: {
    nom: 'Sun Gauntlet',
    texte:
      'Like many Amazon artefacts, this weapon is made of a strange multicoloured metal that never tarnishes. It is covered in runes and a gem is set into its guard. The gauntlet closely resembles a black powder pistol. It can be held in one hand, and when pointed at an enemy, it releases a beam of blinding light, much like the Sun Staff.',
    regles_speciales: [
      { nom: 'Accurate Weapon', texte: 'The sun gauntlet does not suffer the usual -1 penalty to hit at long range.' },
      {
        nom: 'Hand-to-Hand',
        texte:
          'The sun gauntlet may be used alongside another hand-to-hand weapon, at Strength 4, with no armour save. Note: because it does not need to be reloaded, this weapon may be used during every hand-to-hand phase.',
      },
      {
        nom: 'No Save',
        texte: 'The weapon can pass through any material. A fighter Wounded by this weapon gets no armour save, except for magical protections and side-step.',
      },
    ],
  },
  javelots: {
    nom: 'Javelins',
    texte:
      'Javelins are short spears specially designed to reach distant targets. Although their range is shorter than that of an arrow, they can cause terrible damage when wielded by someone of great physical strength. Note: 4 out of 5 sources give a range of 8". This is therefore treated as the standard (only the Gladiators\' javelin had a range of 10").',
    regles_speciales: [
      {
        nom: 'Thrown Weapon',
        texte: 'This weapon is perfectly balanced for throwing, and the thrower suffers no penalty for shooting if he has moved beforehand.',
      },
    ],
  },
  javelot_nehekharien: {
    nom: 'Nehekharan Javelin',
    texte:
      'These warriors throw these javelins using a cord wound around the weapon. When thrown, the javelin spins like a bullet, increasing its accuracy.',
    regles_speciales: [
      {
        nom: 'Thrown Weapon',
        texte: 'This weapon is perfectly balanced for throwing, and the thrower suffers no penalty for shooting if he has moved beforehand.',
      },
      {
        nom: 'Accuracy',
        texte: 'This weapon is designed for accuracy. Any shot or hand-to-hand attack with this weapon gets a +1 bonus to hit.',
      },
    ],
  },
  kusarigama: {
    nom: 'Kusarigama',
    texte:
      'The kusarigama is a thin weighted cord or chain with a scythe or fishing hook attached to one end. The monks use the reach of this strange weapon with deadly precision to unbalance sword-armed enemies.',
    regles_speciales: [
      {
        nom: 'Throwing Weapon',
        texte: 'This weapon is perfectly balanced for throwing, and the fighter using it suffers no penalties for long range or for having moved. However, it cannot be used in hand-to-hand combat.',
      },
      {
        nom: 'Accurate',
        texte:
          'A warrior using a kusarigama is so well trained in its use that he may attack an enemy model already engaged in hand-to-hand combat. However, the Monk cannot use this weapon if he is himself engaged in hand-to-hand combat.',
      },
      {
        nom: 'Trip',
        texte:
          'The warrior may declare that he wants to knock down an enemy model rather than inflict damage on it. The Monk must make a roll to hit, then a Strength test. If the test succeeds, the target is Knocked Down. Add a +1 modifier to the Strength test against large targets. If a mount is knocked down, its rider falls (see result 3-4 on the Whoa Boy! chart in the Mounted Warriors rules).',
      },
    ],
  },
  lance_harpon: {
    nom: 'Harpoon Launcher',
    texte: 'More than just a crude hybrid crossbow, scaled up for a titanic marksman.',
    regles_speciales: [
      {
        nom: 'Move or Shoot',
        texte: 'It is not possible to move and shoot during the same turn, except to turn on the spot or stand up.',
      },
      { nom: 'Reloading', texte: 'It takes a full turn to reload the weapon, so it can only fire every other turn.' },
    ],
  },
  oiseau_de_proie: {
    nom: 'Bird of Prey',
    texte: 'A falcon, hawk, or other winged predator trained from birth to hunt and fight for its noble owner.',
    regles_speciales: [
      { nom: 'Targeting', texte: 'The bird of prey may attack hidden targets and ignores penalties for cover.' },
    ],
  },
  sarbacane: {
    nom: 'Blowpipe',
    texte:
      'The blowpipe is a tube used to fire poisoned darts. While the darts themselves are too small to cause real damage, Skaven poisons are extremely painful and can even prove fatal. The great advantage of a blowpipe is that it is silent; a well-hidden user can fire his poisoned darts without being spotted.',
    regles_speciales: [
      { nom: '+1 Enemy Save', texte: 'An enemy Wounded by this weapon gets +1 to his armour save, or a 6+ save if he has none.' },
      {
        nom: 'Stealth',
        texte:
          'A fighter armed with a blowpipe may fire while hidden without revealing his position. The target may make an Initiative test to spot the shooter. If the test succeeds, he is no longer hidden.',
      },
      {
        nom: 'Poison',
        texte:
          'The needles fired by the blowpipe are coated with a venom whose effects are similar to those of black lotus (if you roll a 6 to hit, the target is automatically Wounded). A blowpipe cannot cause Critical Hits.',
      },
    ],
  },
  tufenk: {
    nom: 'Tufenk',
    texte: 'This is a blowpipe that projects alchemical fire, causing burns.',
    regles_speciales: [
      { nom: 'Reloading', texte: 'It takes a full turn to reload the weapon, so it can only fire every other turn.' },
      {
        nom: 'Fire',
        texte:
          'Following a hit, roll 1D6. On a result of 4+, the target catches fire. During the Recovery phase, he must roll a 4+ to put out the flames or suffer a Strength 4 hit and be able to do nothing but move until the fire is out. Other members of his warband can help put out the flames. They must move into base contact and roll a 4+ during the Recovery phase. Against dry targets, such as mummies, the Tufenk has a Strength of 3 and the target catches fire on a 2+ on 1D6.',
      },
    ],
  },

  // --- Armes de corps à corps (1/2) ---
  aiguillon_a_squigs: {
    nom: 'Squig Prod',
    texte:
      "This is a trident fixed to the end of a long pole and used by goblins to push squigs in the right direction. Squigs have learned to recognise a prod and hold a certain respect for whoever carries it!",
    regles_speciales: [
      {
        nom: 'Herder',
        texte: "A Goblin equipped with a squig prod can control any Squig within 12\" instead of the normal 6\" (see the Squigs' special rule at heel!).",
      },
      {
        nom: 'Cavalry Bonus',
        texte: 'A rider armed with this weapon gets a +1 Strength bonus when charging. This bonus only applies during the turn he charges.',
      },
      { nom: 'Hard to Wield', texte: 'A fighter armed with this weapon may carry a shield or buckler normally, but not an additional weapon.' },
      {
        nom: 'Strikes First',
        texte: 'A fighter equipped with this weapon strikes first during the first round of hand-to-hand combat, even when charged.',
      },
    ],
  },
  arme_a_deux_mains: {
    nom: 'Two-Handed Weapon (sword, axe, two-handed hammer)',
    texte:
      'A blow from a two-handed sword or axe can cut a man in two and smash through his armour. It takes a long time to learn to use these weapons, and only the strongest can wield them effectively.',
    regles_speciales: [
      {
        nom: 'Two-Handed Weapon',
        texte:
          'The weapon is wielded with both hands and prevents the simultaneous use of a shield, buckler, or additional weapon. A shield, however, still provides a +1 bonus to the save against shooting.',
      },
      { nom: 'Strikes Last', texte: 'The weapon is so heavy that its wielder always strikes last, even when charging.' },
    ],
  },
  arme_contondante_une_main: {
    nom: 'One-Handed Blunt Weapon (staff, club, mace, hammer)',
    texte:
      'These rudimentary, blunt weapons range from primitive clubs to dwarf hammers forged from the finest steel. A blow from a mace can easily crack a skull or knock a man out.',
    regles_speciales: [
      { nom: 'Blunt', texte: 'A damage roll of 2-4 (instead of the usual 3-4) is treated as Stunned.' },
    ],
  },
  attendrisseur: {
    nom: 'Meat Tenderiser',
    texte: 'Even if other warbands mock your rolling pins and meat tenderisers, they are perfectly capable of crushing a skull or knocking out an opponent.',
    regles_speciales: [
      { nom: 'Blunt', texte: 'A damage roll of 2-4 (instead of the usual 3-4) is treated as Stunned.' },
    ],
  },
  baton_dboss: {
    nom: 'Boss Stick',
    texte: 'Some influential goblins carry insignia of office, usually in the form of long wooden poles with an icon or a sharp blade at the end.',
    regles_speciales: [
      { nom: 'Authority', texte: 'Allows Heroes and all Goblin Henchmen within 6" and in line of sight to ignore animosity.' },
      {
        nom: 'Cavalry Bonus',
        texte: 'A rider armed with this weapon gets a +1 Strength bonus when charging. This bonus only applies during the turn he charges.',
      },
      { nom: 'Hard to Wield', texte: 'A fighter armed with this weapon may carry a shield or buckler normally, but not an additional weapon.' },
      {
        nom: 'Strikes First',
        texte: 'A fighter equipped with this weapon strikes first during the first round of hand-to-hand combat, even when charged.',
      },
    ],
  },
  baton_ardent: {
    nom: 'Fiery Staff',
    texte:
      'The fiery staff is a weapon commonly used by Witch Hunters. It consists of a long shaft topped with a small iron-covered brazier. In combat, the weapon takes on a supernatural quality as the embers light up the night, while enemies catch fire and writhe in an agony of flame.',
    regles_speciales: [
      {
        nom: 'Two-Handed Weapon',
        texte:
          'The weapon is wielded with both hands and prevents the simultaneous use of a shield, buckler, or additional weapon. A shield, however, still provides a +1 bonus to the save against shooting.',
      },
      {
        nom: 'Fire',
        texte:
          'The brazier of burning coals atop the staff is deadly. Whenever you score a hit with the Fiery Staff, roll 1D6. On a 5+, the victim catches fire. If the warrior survives the attack, during the Recovery phase he must roll a 4+ to put out the flames or suffer a Strength 4 hit and be able to do nothing but move until the fire is out. Other members of his warband can help put out the flames. They must move into base contact and roll a 4+ during the Recovery phase.',
      },
    ],
  },
  baton_de_combat: {
    nom: 'Fighting Staff',
    texte: 'Fighting staves are traditional weapons of the warrior monk brotherhoods.',
    regles_speciales: [
      { nom: 'Balanced', texte: 'A fighting staff is particularly light and easy to wield. A warrior equipped with a fighting staff gets +1 Initiative in hand-to-hand combat.' },
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
      {
        nom: 'Free Style',
        texte:
          "Although a fighting staff does not always require the use of both hands, it does not allow the use of a shield, buckler, or additional weapon in hand-to-hand combat. However, it can be combined with the Monk's bare-handed attacks. As a result, a Monk always gets the +1 Attack bonus.",
      },
    ],
  },
  baton_du_serpent: {
    nom: 'Serpent Staff',
    texte: "The highest liche priests of their order bear, as the insignia of their office, a staff adorned with a serpent's head.",
    regles_speciales: [
      { nom: 'Autonomy', texte: "Once activated, the staff strikes autonomously and uses its own Weapon Skill of 4 instead of its bearer's." },
      {
        nom: 'Strikes First',
        texte:
          'A fighter equipped with this weapon strikes first during the first round of hand-to-hand combat, even when charged. The Liche Priest may forgo all his attacks and parries for a turn in order to use the power contained within the staff. A single word of power brings to life the serpent that it strikes.',
      },
      {
        nom: 'Parry',
        texte:
          'The staff is wielded with both hands and may be used to parry. When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
    ],
  },
  bec_de_corbin: {
    nom: 'Lucerne Hammer',
    texte: 'A Tilean invention, the Lucerne hammer is a polearm that combines the best aspects of a halberd, a spear, and a war hammer.',
    regles_speciales: [
      { nom: 'Reach', texte: 'When charged, a fighter armed with a Lucerne hammer strikes in Initiative order instead of striking last.' },
      {
        nom: 'Two-Handed Weapon',
        texte:
          'The weapon is wielded with both hands and prevents the simultaneous use of a shield, buckler, or additional weapon. A shield, however, still provides a +1 bonus to the save against shooting.',
      },
      { nom: 'Blunt', texte: 'A damage roll of 2-4 (instead of the usual 3-4) is treated as Stunned, although Dwarfs are immune to this effect.' },
    ],
  },
  chaine_et_boulet_cac: {
    nom: 'Chain & Ball',
    texte:
      'This is a huge ball fixed to the end of a long chain. It is the favourite weapon of the infamous Night Goblin Fanatics. Extremely heavy and hard to wield, this weapon requires the consumption of fool\'s cap mushrooms.',
    regles_speciales: [
      {
        nom: 'Cumbersome',
        texte:
          'The chain & ball is so heavy that a model equipped with it cannot carry any other weapon or equipment. In addition, only a model under the influence of fool\'s cap mushrooms has the strength necessary to wield this weapon.',
      },
      {
        nom: 'Colossal Force',
        texte:
          'The impact of the enormous ball, boosted by the speed given to it by the chain, renders ordinary armour of little use. No armour save is therefore allowed against Wounds inflicted by this weapon. In addition, any successful hit could well decapitate the victim (or at least break a few limbs!): any Wound suffered inflicts 1D3 Wounds instead of just one.',
      },
      {
        nom: 'Exhausting',
        texte:
          "The effort required to wield this weapon can cause muscle damage or even dislocate a shoulder. Under the influence of the fool's cap mushrooms, the warrior feels no pain and won't even notice, but once the effects wear off, it's a different story... To represent this, after the battle, every model that used a chain & ball must make an Injury roll, as if it had been taken Out of Action. If the model was actually taken Out of Action, make only one roll, not two.",
      },
      {
        nom: 'Unpredictable',
        texte:
          "The only way to use this weapon is to swing it above your head, using your own body as a counterweight. This is unfortunately not the most reliable way to fight, and once he starts swinging the ball, the warrior loses much control over his fate. On the turn he starts swinging his ball, the warrior is moved 2D6\" in a direction chosen by the player. For subsequent Movement phases, roll 1D6: 1 = the model tangles itself up and strangles itself with its own chain, taken Out of Action (killed on 1-2 instead of 1-3 on the Serious Injury roll). 2-5 = moved 2D6\" in the direction chosen by the player. 6 = moved 2D6\" in a random direction (scatter die: 1 straight ahead, 2-3 to the right, 4-5 to the left, 6 backwards). If it hits a building, wall, or other obstacle, it is immediately taken Out of Action. A model wishing to attack a warrior carrying this weapon suffers a -1 penalty to hit, as it must be careful not to take the ball to the head. A warrior equipped with a chain & ball is not locked into hand-to-hand combat, even if he is in contact with another model at the start of his Movement phase. If the model ends up in contact with a model (friend or foe), it is treated as having charged and remains engaged in hand-to-hand combat until its next Movement phase.",
      },
      {
        nom: 'Deranged',
        texte: 'The warrior is far too busy controlling his weapon to pay attention to what those around him are saying. He is therefore immune to animosity.',
      },
    ],
  },
  chat_a_neuf_queues: {
    nom: "Cat o' Nine Tails",
    texte:
      'Aboard ship, order is often kept under threat of the whip. In combat, this long barbed whip is also used, but this time to punish the enemy!',
    regles_speciales: [
      { nom: '+1 Enemy Save', texte: 'An enemy Wounded by this weapon gets +1 to his armour save, or a 6+ save if he has none.' },
      {
        nom: 'Crack',
        texte:
          "A model armed with a cat o' nine tails gets +1 Attack when charging, in addition to any other bonus. When charged, it also gets +1 Attack that may only be used against the model that charged it. This extra attack strikes first. If the bearer is charged by 2 or more enemies, this bonus remains +1 Attack. If the bearer fights with two whips, he gets +1 Attack for his additional base weapon, but only his first whip benefits from the +1 Attack from Crack.",
      },
      { nom: 'Cannot Be Parried', texte: 'Attempts to parry this weapon are useless, whether with a sword or a buckler.' },
    ],
  },
  couteau_de_cuisine: {
    nom: 'Kitchen Knife',
    texte: "The ordinary kitchen knife isn't just for cutting vegetables. In the pudgy but expert hands of a Master Cook, it can wreak havoc among the enemy ranks!",
    regles_speciales: [
      { nom: '+1 Enemy Save', texte: 'An enemy Wounded by this weapon gets +1 to his armour save, or a 6+ save if he has none.' },
    ],
  },
  dague: {
    nom: 'Dagger',
    texte: "Daggers and knives are very common and can be carried where other weapons are forbidden. In Mordheim, more than one warrior has died with a knife between his shoulder blades.",
    regles_speciales: [
      { nom: '+1 Enemy Save', texte: 'An enemy Wounded by this weapon gets +1 to his armour save, or a 6+ save if he has none.' },
    ],
  },
  dague_de_la_peste: {
    nom: 'Plague Dagger',
    texte: 'This dagger is permanently coated with a disgusting substance resembling green mould. Wounds inflicted by this dagger can cause terrible diseases.',
    regles_speciales: [
      { nom: '+1 Enemy Save', texte: 'An enemy Wounded by this weapon gets +1 to his armour save, or a 6+ save if he has none.' },
      {
        nom: 'Poison',
        texte:
          'A result of 6 on the roll to hit infects the target with disease. It must make a Toughness test. If it fails, the target suffers an automatic Wound in addition to any Wound potentially caused by the dagger. Undead and Possessed are immune to disease and do not need to make this test. If the model uses two plague daggers, it gets an extra attack, with no other effect besides an extra chance of rolling a 6.',
      },
    ],
  },
  dague_empoisonnee_hobgobeline: {
    nom: 'Hobgoblin Poisoned Dagger',
    texte:
      "Hobgoblins, also called 'cretins', poison the blades of their daggers. Cunning and sly, they are often employed as assassins by their masters, though they are unreliable and vulnerable troops.",
    regles_speciales: [
      { nom: '+1 Armour Save', texte: 'An enemy Wounded by this weapon gets +1 to his armour save, or a 6+ save if he has none.' },
      {
        nom: 'Pair',
        texte: 'These weapons are traditionally used in pairs, one in each hand. A warrior with these weapons gets +1 Attack.',
      },
      { nom: 'Fast', texte: 'The weapon grants +1 Initiative when determining combat order.' },
      {
        nom: 'Venom',
        texte: "The venom of the poisoned daggers enters the victim's bloodstream and ravages its organs and muscles. These weapons are equivalent to those coated with black lotus. No other poison may be added to them.",
      },
    ],
  },
  encensoir_a_peste: {
    nom: 'Plague Censer',
    texte:
      'The plague censer is a hollow, spike-covered metal sphere attached to a long chain that swings like a flail. A fragment of warpstone infected with plague burns at the heart of the ball and gives off a foul smoke. This smoke nauseates opponents and can make the censer bearer a difficult target to hit.',
    regles_speciales: [
      {
        nom: 'Two-Handed Weapon',
        texte:
          'The weapon is wielded with both hands and prevents the simultaneous use of a shield, buckler, or additional weapon. A shield, however, still provides a +1 bonus to the save against shooting.',
      },
      {
        nom: 'Deadly Mist',
        texte:
          'A fighter hit by a plague censer must make a Toughness test. If he fails, he suffers an automatic Wound in addition to any Wound potentially caused by the censer. A result of 6 always inflicts a Wound. In addition, the censer\'s bearer must also make the test and will suffer a Wound on a result of 6. Undead and Possessed are immune to disease and do not need to make this test. If the Skaven wielding the plague censer also has glowing warpstone fragments, he becomes a difficult target to hit, and those aiming at him with missile weapons suffer a -1 penalty to hit.',
      },
      {
        nom: 'Fatigue',
        texte: 'Wielding this weapon is very tiring, and the Strength bonus only applies during the first round of each hand-to-hand combat.',
      },
    ],
  },
  epee: {
    nom: 'Sword',
    texte:
      'The sword is often considered the queen of weapons. The most common sword available, the Imperial longsword, is a masterpiece for any blacksmith: four feet of gleaming steel with two razor-sharp edges. Swords are far more effective weapons than crude clubs or axes, though learning to use them is long and difficult.',
    regles_speciales: [
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
    ],
  },
  epee_courte: {
    nom: 'Short Sword',
    regles_speciales: [
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
      { nom: '+1 Armour Save', texte: 'Note: for the master swordsman skill, the short sword counts as a sword.' },
    ],
  },
  epee_batarde: {
    nom: 'Bastard Sword',
    regles_speciales: [
      { nom: 'Strikes Last', texte: 'The weapon is so heavy that its wielder always strikes last, even when charging.' },
      { nom: 'Difficult to Wield', texte: 'A fighter armed with this weapon may carry a shield normally, but not an additional weapon or buckler.' },
      {
        nom: 'Note',
        texte: "Even though the word 'sword' appears in its name, a bastard sword cannot be used to parry. It is nonetheless considered a sword for the master swordsman skill.",
      },
    ],
  },
  epee_des_etoiles: {
    nom: 'Blade of the Stars',
    texte: 'This is an ancient and legendary sword whose edge can cut through armour like butter.',
    regles_speciales: [
      {
        nom: 'No Save',
        texte: 'The weapon can pass through any material. A fighter Wounded by this weapon gets no armour save, except for magical protections and side-step.',
      },
    ],
  },
  epee_dragon: {
    nom: 'Dragon Sword',
    texte: 'Dragon swords are large swords, typically used by Cathayan soldiers and ronin and occasionally wielded by monks.',
    regles_speciales: [
      {
        nom: 'Two-Handed Weapon',
        texte:
          'The weapon is wielded with both hands and prevents the simultaneous use of a shield, buckler, or additional weapon. A shield, however, still provides a +1 bonus to the save against shooting.',
      },
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
    ],
  },
  fleau: {
    nom: 'Flail',
    texte:
      'The flail is a heavy weapon wielded with both hands. It usually consists of heavy balls, often covered in spikes, attached to a handle by sturdy chains. Flails are very tiring to wield, but terribly destructive in the hands of a skilled warrior.',
    regles_speciales: [
      {
        nom: 'Two-Handed Weapon',
        texte:
          'The weapon is wielded with both hands and prevents the simultaneous use of a shield, buckler, or additional weapon. A shield, however, still provides a +1 bonus to the save against shooting.',
      },
      { nom: 'Fatigue', texte: 'Wielding this weapon is very tiring, and the Strength bonus only applies during the first round of each hand-to-hand combat.' },
    ],
  },
  fouet_a_betes: {
    nom: 'Beast Whip',
    texte: 'Beastmasters use barbed whips to drive their creatures into battle.',
    regles_speciales: [
      {
        nom: 'Bane of Beasts',
        texte:
          'A Beastmaster armed with a beast whip causes fear in animals. Any animal charged by, or wishing to charge, a Beastmaster must therefore make a fear test according to the usual rules in the Mordheim Rulebook.',
      },
      {
        nom: 'Crack',
        texte:
          'A model armed with the beast whip gets +1 Attack when charging, in addition to any other bonus. When charged, it also gets +1 Attack that may only be used against the model that charged it. This extra attack strikes first. If the bearer is charged by 2 or more enemies, this bonus remains +1 Attack. If the bearer fights with two whips, he gets +1 Attack for his additional base weapon, but only his first whip benefits from the +1 Attack from Crack.',
      },
    ],
  },
  fouet_barbele: {
    nom: 'Barbed Whip',
    texte: 'Originally used to tame wild Chaos hounds, barbed whips have also proven effective in combat.',
    regles_speciales: [
      {
        nom: 'Crack',
        texte:
          'A model armed with a barbed whip gets +1 Attack when charging, in addition to any other bonus. When charged, it also gets +1 Attack that may only be used against the model that charged it. This extra attack strikes first. If the bearer is charged by 2 or more enemies, this bonus remains +1 Attack. If the bearer fights with two whips, he gets +1 Attack for his additional base weapon, but only his first whip benefits from the +1 Attack from Crack.',
      },
      {
        nom: 'Enrage',
        texte: 'The Hero may use his whip to drive the Chaos Hounds into a wild charge. Unless engaged in hand-to-hand combat, all Chaos Hounds within 4" gain +1 Attack.',
      },
      { nom: 'Cannot Be Parried', texte: 'Attempts to parry this weapon are useless, whether with a sword or a buckler.' },
    ],
  },
  fouet_dacier: {
    nom: 'Steel Whip',
    texte: "Another unique weapon of the Order, made of barbed steel chains.",
    regles_speciales: [
      {
        nom: 'Crack',
        texte:
          'A model armed with a steel whip gets +1 Attack when charging, in addition to any other bonus. When charged, it also gets +1 Attack that may only be used against the model that charged it. This extra attack strikes first. If the bearer is charged by 2 or more enemies, this bonus remains +1 Attack. If the bearer fights with two whips, he gets +1 Attack for his additional base weapon, but only his first whip benefits from the +1 Attack from Crack.',
      },
      { nom: 'Cannot Be Parried', texte: 'Attempts to parry this weapon are useless, whether with a sword or a buckler.' },
    ],
  },
  fouet_dhedoniste: {
    nom: "Hedonist's Whip",
    regles_speciales: [
      {
        nom: 'Crack',
        texte:
          "A model armed with a hedonist's whip gets +1 Attack when charging, in addition to any other bonus. When charged, it also gets +1 Attack that may only be used against the model that charged it. This extra attack strikes first. If the bearer is charged by 2 or more enemies, this bonus remains +1 Attack. If the bearer fights with two whips, he gets +1 Attack for his additional base weapon, but only his first whip benefits from the +1 Attack from Crack.",
      },
      { nom: 'Cannot Be Parried', texte: 'Attempts to parry this weapon are useless, whether with a sword or a buckler.' },
    ],
  },
  gaffe: {
    nom: 'Boat Hook',
    texte: 'Boat hooks are usually used to haul up ropes or other objects fallen into the water, but their long reach and fearsome metal hook also make them useful in combat.',
    regles_speciales: [
      {
        nom: 'Strikes First',
        texte: 'A fighter equipped with this weapon strikes first during the first round of hand-to-hand combat, even when charged.',
      },
      {
        nom: 'Two-Handed Weapon',
        texte:
          'The weapon is wielded with both hands and prevents the simultaneous use of a shield, buckler, or additional weapon. A shield, however, still provides a +1 bonus to the save against shooting.',
      },
    ],
  },
  gantelet_a_pointe: {
    nom: 'Spiked Gauntlet',
    texte: 'Usually used in the arenas, the spiked gauntlet counts as both a buckler and an additional weapon.',
    regles_speciales: [
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
      { nom: 'Parry Re-roll', texte: 'Used together with a sword, this weapon allows a failed parry to be re-rolled once per turn.' },
    ],
  },
  grande_hache_du_chaos: {
    nom: 'Great Chaos Axe',
    texte: 'These oversized battle axes can only be used by the strongest of warriors.',
    regles_speciales: [
      {
        nom: 'Two-Handed Weapon',
        texte:
          'The weapon is wielded with both hands and prevents the simultaneous use of a shield, buckler, or additional weapon. A shield, however, still provides a +1 bonus to the save against shooting.',
      },
      {
        nom: 'Strikes Last',
        texte: 'Great Chaos axes are so heavy that the model always strikes last, even when charging (unless he has the strongman skill).',
      },
      {
        nom: 'Sharp',
        texte: "A Great Chaos axe has an additional -1 save modifier. A model with Strength 4 using a Great Chaos axe therefore has a save modifier of -4 in hand-to-hand combat.",
      },
    ],
  },
  griffes_de_combat: {
    nom: 'Fighting Claws (pair)',
    texte:
      'The martial arts of Clan Eshin require exotic weapons. The most famous are fighting claws: sharp blades fixed to the warrior\'s paws. It takes an expert to use them well, but the members of Clan Eshin are exactly that.',
    regles_speciales: [
      { nom: 'Cumbersome', texte: 'A fighter equipped with this weapon cannot use any other weapons for the entire game.' },
      { nom: 'Climber', texte: 'A fighter equipped with this weapon gets +1 Initiative for climbing tests.' },
      {
        nom: 'Pair',
        texte: 'These weapons are traditionally used in pairs, one in each hand. A warrior with these weapons gets +1 Attack.',
      },
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
    ],
  },
  griffes_des_anciens: {
    nom: 'Claws of the Ancients',
    texte:
      'This very ancient weapon is made of an unalterable metal. The powers of this artefact can only be unleashed by a ritual known to a handful of Amazons. The blade of this weapon then appears white-hot and can pass through armour as if it were paper.',
    regles_speciales: [
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
      {
        nom: 'No Save',
        texte: 'The weapon can pass through any material. A fighter Wounded by this weapon gets no armour save, except for magical protections and side-step.',
      },
    ],
  },
  hache: {
    nom: 'Axe',
    texte:
      'The axe is the traditional weapon of Empire woodcutters, but is also used as a weapon in the poorest rural regions. It has a heavy blade capable of causing a great deal of damage and easily pierces armour when wielded by a strong man. Of all armourers, it is the dwarfs who forge the finest axes. Dwarf axes are highly valued by warriors of the Old World and are among the most sought-after weapons.',
    regles_speciales: [
      { nom: 'Sharp', texte: "The weapon gets an additional -1 save modifier (a Strength 4 fighter will reduce the target's save by -2)." },
    ],
  },
  hachoir: {
    nom: 'Chopper',
    texte: 'The chopper is one of the best kitchen utensils for fighting. It is fairly light and can cut through almost anything, much like an axe.',
    regles_speciales: [
      { nom: 'Sharp', texte: "The weapon gets an additional -1 save modifier (a Strength 4 fighter will reduce the target's save by -2)." },
    ],
  },
  katar: {
    nom: 'Katar',
    texte: "The katar is an Arabian-style dagger whose grip is perpendicular to the blade and is used in a way that lets it pierce an opponent.",
    regles_speciales: [
      { nom: 'Sharp', texte: "The weapon gets an additional -1 save modifier (a Strength 4 fighter will reduce the target's save by -2)." },
    ],
  },
  hache_naine: {
    nom: 'Dwarf Axe',
    texte:
      'Dwarf axes are short-handled weapons made of lighter (and much sturdier) materials than ordinary axes. Dwarf warriors have used them since time immemorial and wield them as skilfully as a human warrior might wield a sword. It is the dwarf weapon par excellence.',
    regles_speciales: [
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
      { nom: 'Sharp', texte: "The weapon gets an additional -1 save modifier (a Strength 4 fighter will reduce the target's save by -2)." },
    ],
  },
  hallebarde: {
    nom: 'Halberd',
    texte:
      "The halberd's heavy blade, fitted with a spear point and an axe edge, is mounted on a sturdy oak or steel shaft. This weapon, usable for both thrusting and slashing, is versatile but hard to wield in confined spaces.",
    regles_speciales: [
      {
        nom: 'Two-Handed Weapon',
        texte:
          'The weapon is wielded with both hands and prevents the simultaneous use of a shield, buckler, or additional weapon. A shield, however, still provides a +1 bonus to the save against shooting.',
      },
    ],
  },
  lame_des_etoiles: {
    nom: 'Star Blade',
    texte:
      "Among the many strange weapons possessed by the Amazons, the star blade is a weapon crafted like an Amazon dagger. It is usually painted in exotic colours and has magical properties that enhance the Amazons' martial prowess.",
    regles_speciales: [
      { nom: '+1 Enemy Save', texte: 'An enemy Wounded by this weapon gets +1 to his armour save, or a 6+ save if he has none.' },
      { nom: 'Defence', texte: 'The star blade allows the first successful hit of any combat to be parried on a 4+.' },
    ],
  },
  lames_suintantes: {
    nom: 'Weeping Blades (pair)',
    texte: 'Clan Eshin adepts use weeping blades: swords forged with a small amount of warpstone mixed into their steel. Weeping blades have the property of continuously releasing poison.',
    regles_speciales: [
      {
        nom: 'Pair',
        texte: 'These weapons are traditionally used in pairs, one in each hand. A warrior with these weapons gets +1 Attack.',
      },
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
      {
        nom: 'Venom',
        texte: "The venom of the weeping blades enters the victim's wound, ravaging its organs and muscles. These weapons are equivalent to those coated with black lotus. No other poison may be added to them.",
      },
    ],
  },
  lance: {
    nom: 'Spear',
    texte: 'Spears include everything from the sharpened sticks used by goblins to the great lances used by elven riders.',
    regles_speciales: [
      {
        nom: 'Cavalry Bonus',
        texte: 'A rider armed with this weapon gets a +1 Strength bonus when charging. This bonus only applies during the turn he charges.',
      },
      { nom: 'Hard to Wield', texte: 'A fighter armed with this weapon may carry a shield or buckler normally, but not an additional weapon.' },
      {
        nom: 'Strikes First',
        texte: 'A fighter equipped with this weapon strikes first during the first round of hand-to-hand combat, even when charged.',
      },
    ],
  },
  lance_a_sanglier: {
    nom: 'Boar Spear',
    texte:
      'The boar spear is the favoured hunting weapon of Ostermark nobles, designed with a crossguard to stop the charge of a giant boar driven mad with pain. In Mordheim, the nobles of the Doomed Cavalcade use it for far more sinister purposes: hunting desperate men.',
    regles_speciales: [
      {
        nom: 'Strikes First',
        texte: 'A fighter equipped with this weapon strikes first during the first round of hand-to-hand combat, even when charged.',
      },
      {
        nom: 'Cavalry Bonus',
        texte: 'A rider armed with this weapon gets a +1 Strength bonus when charging. This bonus only applies during the turn he charges.',
      },
      {
        nom: 'Crossguard',
        texte:
          "This weapon was designed to stop a raging boar's charge dead in its tracks. When its bearer is charged, the boar spear reduces the number of Attacks of the first hand-to-hand attacker by -1 (down to a minimum of 1). Attacks from a second weapon or any other source, other than the base characteristic, are unaffected. The boar spear has no effect on large targets such as ogres, other than the charge bonus. The Aristocrat cannot wield two boar spears at once.",
      },
    ],
  },
  lance_de_cavalerie: {
    nom: 'Cavalry Lance',
    texte:
      'This long lance is used by heavy cavalry to pierce armour and knock the enemy to the ground. It is the weapon of choice for Templar knights and other wealthy warriors. Wielding it requires a great deal of skill and strength, and only the wealthiest can afford the warhorses that give this weapon its full effectiveness.',
    regles_speciales: [
      { nom: 'Cavalry Weapon', texte: 'The fighter must be mounted to wield this weapon.' },
      {
        nom: 'Cavalry Bonus',
        texte: 'A rider armed with this weapon gets a +1 Strength bonus when charging. This bonus only applies during the turn he charges.',
      },
    ],
  },
  louche: {
    nom: 'Ladle',
    texte: "A ladle isn't very effective for killing your enemies, but if you aim well, a strike to the knuckles can seriously hamper the combat ability of even the finest warrior.",
    regles_speciales: [
      {
        nom: 'Knuckle Breaker',
        texte:
          "If a Master Cook manages to hit an enemy in hand-to-hand combat (a feat in itself), and on top of that rolls a '6', he has struck his opponent square on the knuckles, forcing him to drop his weapon.",
      },
      {
        nom: 'No Save, Except for Shields',
        texte: 'A Master Cook knows exactly where to aim his ladle. Helmets and breastplates are of no use against a ladle that strikes the hands. The only saves allowed are those from shields or skills.',
      },
    ],
  },
  main_gauche: {
    nom: 'Main-Gauche',
    texte:
      "A main-gauche is a dagger with a wide guard, often used together with a rapier or another sword. Popular among duellists and minor nobles, the main-gauche is sometimes considered a 'gimmick' weapon. In reality, it lets its user be effective in both attack and defence.",
    regles_speciales: [
      { nom: '+1 Enemy Save', texte: 'An enemy Wounded by this weapon gets +1 to his armour save, or a 6+ save if he has none.' },
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
      { nom: 'Parry Re-roll', texte: 'Used together with a sword, this weapon allows a failed parry to be re-rolled once per turn.' },
    ],
  },
  marteau_de_cavalerie: {
    nom: 'Cavalry Hammer',
    texte:
      "This is a great hammer such as those used by the Knights of the White Wolf. It is too cumbersome to be used one-handed and is better suited to mounted combat, since the animal's momentum adds to the weapon's power.",
    regles_speciales: [
      {
        nom: 'Two-Handed Weapon',
        texte:
          'The weapon is wielded with both hands and prevents the simultaneous use of a shield, buckler, or additional weapon. A shield, however, still provides a +1 bonus to the save against shooting.',
      },
      {
        nom: 'Cavalry Charge',
        texte:
          "A model armed with a cavalry hammer can use its mount's speed to add more impact to its weapon. A mounted model armed with a cavalry hammer may add an additional +1 Strength bonus when charging (for a total of +2). This additional bonus only applies during the turn it charges.",
      },
    ],
  },
  marteau_de_guerre_sigmarite_market: {
    nom: 'Sigmarite War Hammer',
    texte: "One of the Order's traditional weapons, in memory of Ghal Maraz, the hammer of Sigmar.",
    regles_speciales: [
      { nom: 'Blunt', texte: 'A damage roll of 2-4 (instead of the usual 3-4) is treated as Stunned.' },
      {
        nom: 'Sacred',
        texte:
          'Each hammer was blessed by a Matriarch before being given to a Sister. The hammer grants a +1 bonus to all Wound rolls inflicted in hand-to-hand combat against Possessed and Undead. Note that you will still need a 6 before modifiers to inflict a Critical Hit.',
      },
    ],
  },
  massue_ogre: {
    nom: 'Ogre Club',
    texte:
      'Ogre clubs are crudely put together with straps, spikes, and nails. The care and size of the club an ogre wields is an indicator of his status. An ogre armed with a simple log is generally considered desperate or extremely poor, while some vagabonds are known to fight with almost any object of appropriate size, such as lampposts, salvaged artillery, or architectural pieces. These clubs are usually used to stun prey so it can be dragged back to the cave without losing too much blood, but they are also perfect for breaking through the enemy\'s defence in a fight.',
    regles_speciales: [
      {
        nom: 'Crushing Attack',
        texte:
          'Ogre clubs can be wielded with impressive force, granting an additional -1 save modifier. When it comes to the defender\'s parry attempts, the attack is treated as being at Strength+1. Thus, a Strength 3 fighter cannot parry the attack of a Strength 5 Ogre wielding an ogre club. The Crushing Attack only works if the Ogre uses the ogre club two-handed.',
      },
      { nom: 'Blunt', texte: 'A damage roll of 2-4 (instead of the usual 3-4) is treated as Stunned.' },
    ],
  },
  misericordia: {
    nom: 'Misericordia',
    texte:
      'The misericordia is a Tilean dagger with a long, thin blade, designed to end the suffering of wounded warriors. The warriors of the Doomed Cavalcade are experts at striking their opponents\' vital points, and the misericordia can find the smallest gap even in the finest armour. Often, those who wield it choose a spot that causes indescribable pain but does not kill the target outright, so that it can be dragged back to the Throne of Worms.',
    regles_speciales: [
      { nom: 'Coup de Grâce', texte: 'The misericordia lets its wielder ignore all armour saves of an opponent who is Knocked Down.' },
    ],
  },
  misericorde: {
    nom: 'Mercy Blade',
    texte: 'These long daggers were specially designed to kill downed opponents by piercing gaps in armour and vulnerable spots such as the eyes and throat.',
    regles_speciales: [
      { nom: '+1 Enemy Save', texte: 'An enemy Wounded by this weapon gets +1 to his armour save, or a 6+ save if he has none.' },
      {
        nom: 'Fatal Blow',
        texte: 'When the target of the attack is Knocked Down, roll 2D6 instead of just one for the Wound roll. Choose the higher result.',
      },
    ],
  },
  morgenstern: {
    nom: 'Morning Star',
    texte:
      'This weapon, as devastating as it is difficult to wield, is a one-handed flail made of a handle to which chains fitted with spiked steel balls are attached.',
    regles_speciales: [
      { nom: 'Difficult to Wield', texte: 'A fighter armed with this weapon may carry a shield normally, but not an additional weapon or buckler.' },
      { nom: 'Fatigue', texte: 'Wielding this weapon is very tiring, and the Strength bonus only applies during the first round of each hand-to-hand combat.' },
    ],
  },
  nunchaku: {
    nom: 'Nunchaku',
    texte:
      'The nunchaku consists of two wooden bars, linked together and reinforced with iron or steel to increase striking power. It is light and gives its user more flexibility than a flail.',
    regles_speciales: [
      {
        nom: 'Two-Handed Weapon',
        texte:
          'The weapon is wielded with both hands and prevents the simultaneous use of a shield, buckler, or additional weapon. A shield, however, still provides a +1 bonus to the save against shooting.',
      },
      {
        nom: 'Flurry of Blows',
        texte:
          'Fighting with two nunchakus lets its user deliver a flurry of blows. A fighter armed with nunchakus gets +2 Attacks. This bonus only applies during the first round of each hand-to-hand combat. For the rest of the combat, the nunchakus count as two normal one-handed weapons.',
      },
    ],
  },

  // --- Armes de corps à corps (2/2) ---
  pince_market: {
    nom: 'Tongs',
    texte:
      "These are semi-circular teeth mounted on a long handle, ready to capture an enemy with this spike-covered jaw. Popular among Chaos Dwarfs, this device doesn't leave much room for the most violent prisoners to escape its grip.",
    regles_speciales: [
      {
        nom: 'Two-Handed Weapon',
        texte:
          'The weapon is wielded with both hands and prevents the simultaneous use of a shield, buckler, or additional weapon. A shield, however, still provides a +1 bonus to the save against shooting.',
      },
      {
        nom: 'Capture',
        texte:
          'A model taken Out of Action by tongs is captured, unless the warband is Routed. Do not make the Serious Injury roll for the victim. Large targets, such as Ogres, Trolls, and Minotaurs, as well as animals, cannot be captured this way.',
      },
    ],
  },
  pince_homme_slaaneshi: {
    nom: 'Slaaneshi Man-Catcher',
    regles_speciales: [
      {
        nom: 'Two-Handed Weapon',
        texte:
          'The weapon is wielded with both hands and prevents the simultaneous use of a shield, buckler, or additional weapon. A shield, however, still provides a +1 bonus to the save against shooting.',
      },
      {
        nom: 'Restraint',
        texte:
          "If the weapon hits and causes an unsaved Wound, do not roll on the Injury table. Instead, the enemy is Knocked Down and cannot get up as long as it is in contact with the bearer. The target cannot leave combat except by magic. The bearer may move (dragging the enemy along with him) as long as he is not engaged by other opponents. The Slaaneshi man-catcher has no effect against large targets (Ogres, mounts, etc.). If you change weapons, the opponent may get up normally during his Recovery phase. At the end of the battle, if the target is still restrained, it is treated as captured (result 61 on the Serious Injury table), even if it is a Henchman.",
      },
    ],
  },
  pique_market: {
    nom: 'Pike',
    texte: 'The pike is a little longer than a spear and is weighted so it can be wielded effectively among the trees and undergrowth so common in the jungle.',
    regles_speciales: [
      {
        nom: 'Two-Handed Weapon',
        texte:
          'The weapon is wielded with both hands and prevents the simultaneous use of a shield, buckler, or additional weapon. A shield, however, still provides a +1 bonus to the save against shooting.',
      },
      {
        nom: 'Always Strikes First',
        texte:
          'A fighter armed with a pike strikes first during the first round of hand-to-hand combat. Thanks to the pike\'s long shaft, he gets a +1 Initiative bonus during the first round of hand-to-hand combat, letting him attack before the enemy can even reach him. Note: since any "reach" mechanic has been removed from Mordheim, we recommend using the Border Town Burning rules, detailed above.',
      },
    ],
  },
  poignards_empoisonnes: {
    nom: 'Poisoned Daggers (pair)',
    texte: 'This pair of daggers is coated with the juice of death cap mushrooms.',
    regles_speciales: [
      {
        nom: 'Pair',
        texte: 'These weapons are traditionally used in pairs, one in each hand. A warrior with these weapons gets +1 Attack.',
      },
      {
        nom: 'Poisoned',
        texte:
          "The daggers are re-coated for free after each game. These mushrooms have the same effect as black lotus: they automatically Wound if you roll a 6 to hit. Note that you must roll a die for each Wound inflicted by these weapons. On a 6, you inflict a Critical Hit. If you don't roll a 6, the Wound is normal. Make armour saves as usual.",
      },
    ],
  },
  poing: {
    nom: 'Fist',
    texte:
      "In the most desperate situations, when you don't even have a knife, you must fight bare-handed. Needless to say, the chances of survival are comparable to those of a halfling deprived of food for eight hours! Note: the following rule only applies to warriors who have lost their weapons. Creatures such as zombies, animals, and others are unaffected. Warriors fighting bare-handed still only get a single attack.",
    regles_speciales: [
      { nom: '+1 Enemy Save', texte: 'An enemy Wounded by this weapon gets +1 to his armour save, or a 6+ save if he has none.' },
    ],
  },
  poing_de_fer: {
    nom: 'Iron Fist',
    texte:
      "Ogres often protect their left hand with a kind of spiked gauntlet. Such a heavy glove can be used to fend off the most violent attacks, like a giant shield, or to smash an enemy's face to a pulp.",
    regles_speciales: [
      {
        nom: 'Dual Role',
        texte: 'Iron fists work as both a shield and a melee weapon. This means an iron fist allows failed parry attempts to be re-rolled if combined with a sword or a second iron fist.',
      },
      {
        nom: 'Gauntleted',
        texte:
          'A model equipped with an iron fist cannot hold another weapon in that same hand. This means a two-handed weapon cannot be used. With two iron fists, the ogre cannot use any other hand-to-hand weapons for the entire battle.',
      },
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
    ],
  },
  rapiere: {
    nom: 'Rapier',
    texte:
      'The rapier is a long, thin blade commonly used by duellists. It is a formidable weapon, capable of delivering a multitude of blows, but lacks the power of a broadsword.',
    regles_speciales: [
      {
        nom: '+1 Enemy Save',
        texte:
          "The rapier is a very light sword that lacks the thick blade of a sword capable of breaking through armour. A model Wounded by a rapier gets +1 to its armour save, or a 6+ save if it has none.",
      },
      {
        nom: 'Barrage',
        texte:
          'The rapier is light and flexible, which makes it less powerful than a sabre or an axe, but lets a skilled warrior rain down a flurry of quick attacks on his opponent before he can react. A well-trained swordsman can inflict a multitude of light wounds in a matter of seconds, often enough to put even the toughest of enemies out of action. A warrior armed with a rapier makes his rolls to hit and Wound as usual. However, if you manage to hit your opponent but fail to Wound him, you may attack again as if it were a new attack, but with a -1 penalty to hit (down to a minimum of 6+ to hit). The fighter may thus keep attacking as long as he keeps hitting, and may use this ability as many times as he has Attacks.',
      },
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
    ],
  },
  sabre_de_cathay: {
    nom: 'Cathayan Sabre',
    texte:
      'Ithilmar blades forged by the elves are highly prized. Weapons made by Cathayan blacksmiths are even more prestigious. Known by Estalian merchants as Jintachi blades, Cathayan sabres are true little gems, deadly in the hands of a seasoned fighter. Gold alone is never enough to acquire such a weapon. The few weapons still forged are only given as a reward for a heroic deed performed in the eastern realms.',
    regles_speciales: [
      { nom: 'Master Weapon', texte: 'Attacks made with this weapon get a +1 Weapon Skill and +1 Initiative bonus.' },
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
      { nom: 'Sharp', texte: "The weapon gets an additional -1 save modifier (a Strength 4 fighter will reduce the target's save by -2)." },
    ],
  },
  trident: {
    nom: 'Trident',
    texte:
      'The trident used as a gladiator\'s weapon originates in Tilea, in ancient times, when gladiators fought in the great public arenas. This weapon resembles a spear, with all the advantages its length brings, but it also has three prongs allowing a skilled user to deflect blades. Traditionally, the trident is combined with a net, wielded by a lightly-armoured gladiator to face more heavily-armed swordsmen.',
    regles_speciales: [
      {
        nom: 'Strikes First',
        texte: 'A fighter equipped with this weapon strikes first during the first round of hand-to-hand combat, even when charged.',
      },
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
    ],
  },
  arme_empoisonnee_mod: {
    nom: 'Poisoned Weapon',
    texte:
      'Forest goblins commonly plunge the points of their weapons into the bodies of giant spiders in the hope of coating them with a deadly poison. Once this poison is bought, it is applied to a single weapon and cannot subsequently be exchanged or sold. The weapon in question, once poisoned, adds +1 to all its Wound rolls.',
    regles_speciales: [
      {
        nom: 'Existing Weapon Modifier',
        texte: 'This is not a standalone weapon but an upgrade (+25 gold crowns) applied to an already-owned hand-to-hand weapon: adds +1 to all of that weapon\'s Wound rolls.',
      },
    ],
  },
  arme_en_gromril: {
    nom: 'Gromril Weapon',
    texte:
      'Only a dwarf runemaster can forge a weapon from gromril, a rare meteoric ore. A blade made from this metal will not dull for a thousand years. A gromril weapon gives an additional -1 save modifier and costs four times the price of a normal weapon of the same type. You may choose which type of hand-to-hand weapon is offered to you.',
    regles_speciales: [
      { nom: 'Gromril Weapon', texte: 'Base weapon price x4. Additional -1 save modifier on the chosen hand-to-hand weapon.' },
    ],
  },
  arme_en_ithilmar: {
    nom: 'Ithilmar Weapon',
    texte:
      'Elf blades are forged from precious ithilmar, a hard but very light metal found only in the elven realms. A few of these weapons occasionally find their way into the Old World, brought back as plunder by Norse raiders who attack the elves\' coastal cities. An ithilmar weapon gives its user +1 Initiative in hand-to-hand combat and costs three times the price of a normal hand-to-hand weapon. You may choose which type of hand-to-hand weapon is offered to you.',
    regles_speciales: [
      { nom: 'Ithilmar Weapon', texte: 'Base weapon price x3. +1 Initiative in hand-to-hand combat for the user.' },
    ],
  },
  arme_en_obsidienne_market: {
    nom: 'Obsidian Weapon',
    texte:
      'Obsidian is mined from the Dark Lands by the servants of Chaos. During its skilled extraction, this curious volcanic rock is enchanted by engineers in the furnaces of Zharr-Naggrund. Forging weapons using these vile techniques requires great expertise, which makes it extremely rare. An obsidian weapon gives its user +1 Strength in hand-to-hand combat and costs four times the price of a normal weapon of this type. You may choose which type of hand-to-hand weapon is offered to you.',
    regles_speciales: [
      { nom: 'Obsidian Weapon', texte: 'Base weapon price x4. +1 Strength in hand-to-hand combat for the user.' },
      {
        nom: 'Corrupted',
        texte:
          'Although not strictly corrupted by Chaos, all obsidian items are considered tainted with the dark malevolence associated with their creators. Can never be used by Dwarfs, Elves, Sisters of Sigmar, Witch Hunters, or Priests.',
      },
      { nom: 'Strikes Last', texte: 'Obsidian weapons are so heavy that their wielder always strikes last, even when charging.' },
    ],
  },
  lame_elfe_noire: {
    nom: 'Dark Elf Blade',
    texte:
      'These blades are forged in the city of Hag Graef, the Dark Rock, from black iron, a very rare ore found deep in the mountains surrounding the city. The barbs on dark elf blades can inflict severe wounds on their victims. Any dark elf can fit his sword or dagger with a dark elf blade for 20 gold crowns at the time of purchase. Weapons fitted with a dark elf blade keep their usual rules (swords can therefore still parry, and daggers still grant a 6+ armour save).',
    regles_speciales: [
      { nom: 'Barbs', texte: 'Dark elf blades are fitted with sharp barbs and hooks with devastating effects. A damage roll of 2-4 counts as a Stunned result.' },
      {
        nom: 'Critical Damage',
        texte: 'Dark elf blades inflict severe damage on their enemies. In the event of a Critical Hit with a weapon of this type, add +1 to the result on the Critical Hit table.',
      },
    ],
  },
  lame_homme_lezard: {
    nom: 'Lizardman Blade',
    regles_speciales: [
      { nom: 'Upgrade', texte: 'Upgrades a sword into a Lizardman sword (+1 to Wound rolls due to poison).' },
    ],
  },
  couperet: {
    nom: 'Cleaver',
    texte: 'A heavy butcher\'s cleaver, crudely cut from a steel plate. Ogres use it just as much for fighting as for carving up their meals.',
    regles_speciales: [
      { nom: 'Blunt', texte: 'A damage roll of 2-4 (instead of the usual 3-4) is treated as Stunned.' },
    ],
  },
  gourdin_ogre: {
    nom: 'Ogre Cudgel',
    texte: 'A barely-shaped tree trunk, or sometimes the bone of a giant creature, that only an Ogre can wield as a hand-to-hand weapon.',
    regles_speciales: [
      { nom: 'Blunt', texte: 'A damage roll of 2-4 (instead of the usual 3-4) is treated as Stunned.' },
      { nom: 'Strikes Last', texte: 'The weapon is so heavy that its wielder always strikes last, even when charging.' },
    ],
  },
};

const DISPONIBILITE_ARTEFACT_EN =
  'Unique magic artefact — found only via the Magic Artefacts table (Exploration), never for purchase. Can only be owned by a single warrior in the entire campaign: re-roll if the artefact is already owned by someone, even if they have been killed.';

for (const id of [
  'bottes_et_corde_de_pieter',
  'misericorde_de_ventimiglia',
  'armure_dattla',
  'arc_traqueur',
  'cagoule_dexecuteur',
  'oeil_omniscient_de_numas',
]) {
  itemsEn[id].disponibilite = DISPONIBILITE_ARTEFACT_EN;
}

// Traduit un objet { id, nom, texte?, disponibilite?, regles_speciales? } quand
// la langue courante est 'en'. Retombe sur le texte français d'origine si
// l'objet n'a pas (encore) de traduction dans itemsEn (remplissage progressif
// catégorie par catégorie). N'affecte que la copie utilisée à l'affichage —
// les objets French d'origine (tri, recherche, correspondances de règles
// comme libelleMateriau) restent inchangés ailleurs dans le code.
export function translateItem<
  T extends {
    id: string;
    nom: string;
    texte?: string | null;
    disponibilite?: string;
    regles_speciales?: { nom: string; texte: string; exception?: string }[];
  },
>(item: T, language: Language): T {
  if (language !== 'en') return item;
  const en = itemsEn[item.id];
  if (!en) return item;
  return {
    ...item,
    nom: en.nom,
    texte: en.texte ?? item.texte,
    disponibilite: en.disponibilite ?? item.disponibilite,
    regles_speciales: item.regles_speciales?.map((r, i) => {
      const rEn = en.regles_speciales?.[i];
      return rEn ? { ...r, nom: rEn.nom, texte: rEn.texte } : r;
    }),
  };
}

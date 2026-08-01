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

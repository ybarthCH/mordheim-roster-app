import type { Language } from '../../state/useLanguage';

type RegleTraduite = { nom: string; texte: string };
type SousJetAchatOptionTraduite = { label: string; texte: string };

type ItemTraduit = {
  nom: string;
  texte?: string;
  disponibilite?: string;
  regles_speciales?: RegleTraduite[];
  sousJetAchatOptions?: SousJetAchatOptionTraduite[];
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
  piege: {
    nom: 'Trap',
    disponibilite: 'Trap Master (Lustrian Reavers) only — up to 5 per battle on top of the first, free and not counted here',
    texte:
      'Set during the Shooting phase instead of shooting (cannot be set if the model ran), only one at a time, and cannot be used in hand-to-hand combat. Single use.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "Place two 1\"-diameter markers (one fake, one real) anywhere within 3\" of the Trap Master, but at least 3\" from any other model. Any model moving within 2\" of a marker must flip it over: a fake marker does nothing, a real one inflicts 1D3 Strength 5 hits (traps do not cause critical hits). Remove the markers once the trap is triggered.",
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
    nom: 'Engine of Chaos',
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
    nom: 'Mad Cap Mushrooms',
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
    nom: 'Dark Venom',
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
  faucon_de_chasse_tileen: {
    nom: 'Tilean Hunting Hawk',
    texte:
      "A hawk, sparrowhawk or other bird of prey trained from birth to hunt and fight on its master's behalf. Does not fight as a separate model: it is part of the Beastmaster's equipment.",
    disponibilite: 'Beastmaster only',
    regles_speciales: [
      {
        nom: 'Part of the Equipment',
        texte:
          'Acts at the same time as the Beastmaster. Can attack any enemy within 12" as a melee attack, even those out of line of sight (unless Hidden), and returns to the Beastmaster immediately. The hawk cannot be targeted separately by any attack or spell. It does not attack if the Beastmaster is engaged in hand-to-hand combat, being too busy commanding it!',
      },
      {
        nom: 'War Beast',
        texte:
          'Like all War Beasts, the hawk is subject to the rules for animals and never gains experience. If taken Out of Action, it is considered dead on a roll of 1-2 on 1D6 (as a Henchman).',
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
      'Gromril is the rarest and hardest metal in the Old World. Only a handful of dwarf craftsmen know how to work gromril, and the armour they forge fetches astronomical prices. Gromril armour is always heavy armour — three times the price of ordinary heavy armour.',
    regles_speciales: [
      {
        nom: 'Heavy armour',
        texte: 'Counts as heavy armour: profiles without access to common heavy armour cannot wear it either.',
      },
      {
        nom: 'Lightness',
        texte: 'Unlike ordinary heavy armour, does not slow its wearer down if he also wears a shield.',
      },
    ],
  },
  armure_en_ithilmar_market: {
    nom: 'Ithilmar Armour',
    texte:
      'Ithilmar is a silvery metal as light as silk and harder than steel. Elves are experts at crafting weapons and armour from ithilmar, and the elven realm of Caledor is the only place in the world where this metal can be found.',
    regles_speciales: [
      {
        nom: 'Heavy armour',
        texte: 'Counts as heavy armour: profiles without access to common heavy armour cannot wear it either.',
      },
      {
        nom: 'Lightness',
        texte: 'Unlike ordinary heavy armour, does not slow its wearer down if he also wears a shield.',
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
    nom: 'Sea Dragon Cloak',
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
    nom: 'Mechanical Suit',
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
    nom: 'Handgun',
    texte:
      'The handgun is a rudimentary firearm whose manufacturing quality ranges from the crude wooden hackbuts of the Nuln artillery school to the sophisticated dwarf firearms. The latter are fitted with levers and springs that hold the lit match, and triggers that activate the firing mechanism. Handguns are not very reliable weapons: the barrel occasionally explodes and the powder sometimes refuses to ignite. But their range is extraordinary and their penetrating power makes a mockery of even the thickest armour. In Mordheim, handguns are rare and expensive, but a warband equipped with such weapons will command the respect of all rivals. The handgun is eligible for the double barrel option for Nuln Artillerists.',
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
    nom: 'Repeater Handgun',
    texte:
      "These represent the next stage in the evolution of multi-barrelled handguns. This repeating weapon is made up of a number of barrels mounted around a rotating cylinder, each firing in turn. Often prone to malfunction, repeater handguns are nonetheless highly sought after, as they can unleash a veritable storm of lead upon the enemy if they don't explode.",
    regles_speciales: [
      {
        nom: 'Experimental',
        texte:
          "This weapon is always subject to the optional black powder weapon rules from the Mordheim Rulebook, even if they are not used in your campaign. For any result other than 'BOOM!', the weapon has jammed or run out of ammunition and the barrels must be reloaded.",
      },
      { nom: 'Save Modifier', texte: 'See Handgun.' },
      { nom: 'Move or Shoot', texte: 'See Handgun.' },
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
  mortier_portable_ogre: {
    nom: 'Portable Mortar',
    texte:
      "With the explosive power of a true mortar, a device small enough to be carried by a single man lets an Ogre lob an explosive into the heart of the enemy's ranks, sowing death and confusion.",
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
    nom: 'Warplock Pistol',
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
  pistolet_paire: {
    nom: 'Brace of Pistols',
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
  pistolet_a_malepierre_paire: {
    nom: 'Brace of Warplock Pistols',
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
  pistolet_de_duel_paire: {
    nom: 'Brace of Duelling Pistols',
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
    ],
  },
  double_canon: {
    nom: 'Double Barrel (option)',
    texte:
      'Originally created by an innovative Ostland blacksmith for a vampire hunter, the engineers of the Nuln College of Engineering quickly grasped the concept. The idea is fairly simple: it is simply a black powder weapon with a pair of barrels and a trigger, capable of firing one or both barrels at once, giving it the ability to punch through the thickest armour. The following black powder weapons may benefit from the double barrel option (see each weapon\'s price table for cost and rarity): Handgun (Nuln Artillerists), Hochland Long Rifle (Ostlander Mercenaries), Pistol (Nuln Artillerists, Ostlander Mercenaries), Duelling Pistol (Nuln Artillerists).',
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
  pistolet_double_canon_paire: {
    nom: 'Brace of Double-Barrelled Pistols',
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
  pistolet_duel_double_canon_paire: {
    nom: 'Brace of Double-Barrelled Duelling Pistols',
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
    nom: 'Double-Barrelled Handgun',
    texte: 'A handgun fitted with a pair of barrels, capable of punching through the thickest armour. Eligible for the double barrel option.',
    regles_speciales: [
      {
        nom: 'Double Shot',
        texte: 'This weapon fires two shots before needing to be reloaded (instead of just one for a normal handgun).',
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
  hache_de_jet: {
    nom: 'Throwing Axe',
    texte: 'A smaller axe specially weighted for hurling from dangerous distances.',
    regles_speciales: [
      {
        nom: 'Thrown Weapon',
        texte: 'Throwing axes suffer no penalty for throwing over half range, or for moving and shooting.',
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
    nom: 'Harpoon Crossbow',
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
    nom: 'Squig Prodder',
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
    nom: 'Two-Handed Weapon',
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
    nom: 'One-Handed Blunt Weapon',
    texte:
      '(Staff, club, mace, hammer.) These rudimentary, blunt weapons range from primitive clubs to dwarf hammers forged from the finest steel. A blow from a mace can easily crack a skull or knock a man out.',
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
    nom: 'Boss Pole',
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
    nom: 'Ball and Chain',
    texte:
      'This is a huge ball fixed to the end of a long chain. It is the favourite weapon of the infamous Night Goblin Fanatics. Extremely heavy and hard to wield, this weapon requires the consumption of fool\'s cap mushrooms.',
    regles_speciales: [
      {
        nom: 'Cumbersome',
        texte:
          'The chain & ball is so heavy that a model equipped with it cannot carry any other weapon or equipment. In addition, only a model under the influence of fool\'s cap mushrooms has the strength necessary to wield this weapon.',
      },
      {
        nom: 'Incredible Force',
        texte:
          'The impact of the enormous ball, boosted by the speed given to it by the chain, renders ordinary armour of little use. No armour save is therefore allowed against Wounds inflicted by this weapon. In addition, any successful hit could well decapitate the victim (or at least break a few limbs!): any Wound suffered inflicts 1D3 Wounds instead of just one.',
      },
      {
        nom: 'Unwieldy',
        texte:
          "The effort required to wield this weapon can cause muscle damage or even dislocate a shoulder. Under the influence of the fool's cap mushrooms, the warrior feels no pain and won't even notice, but once the effects wear off, it's a different story... To represent this, after the battle, every model that used a chain & ball must make an Injury roll, as if it had been taken Out of Action. If the model was actually taken Out of Action, make only one roll, not two.",
      },
      {
        nom: 'Random',
        texte:
          "The only way to use this weapon is to swing it above your head, using your own body as a counterweight. This is unfortunately not the most reliable way to fight, and once he starts swinging the ball, the warrior loses much control over his fate. On the turn he starts swinging his ball, the warrior is moved 2D6\" in a direction chosen by the player. For subsequent Movement phases, roll 1D6: 1 = the model tangles itself up and strangles itself with its own chain, taken Out of Action (killed on 1-3 instead of 1-2 on the Serious Injury roll). 2-5 = moved 2D6\" in the direction chosen by the player. 6 = moved 2D6\" in a random direction (scatter die: 1 straight ahead, 2-3 to the right, 4-5 to the left, 6 backwards). If it hits a building, wall, or other obstacle, it is immediately taken Out of Action. A model wishing to attack a warrior carrying this weapon suffers a -1 penalty to hit, as it must be careful not to take the ball to the head. A warrior equipped with a chain & ball is not locked into hand-to-hand combat, even if he is in contact with another model at the start of his Movement phase. If the model ends up in contact with a model (friend or foe), it is treated as having charged and remains engaged in hand-to-hand combat until its next Movement phase.",
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
    nom: 'Disease Dagger',
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
    nom: 'Censer',
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
      {
        nom: '+1 Enemy Armour Save',
        texte: 'An enemy wounded by this weapon gains a +1 bonus to his armour save, or a 6+ armour save if he has none normally.',
      },
      { nom: 'Note', texte: 'For the master swordsman skill, the short sword counts as a sword.' },
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
    nom: 'Beastlash',
    texte: 'Beastmasters use barbed whips to drive their creatures into battle.',
    regles_speciales: [
      {
        nom: 'Bane of Beasts',
        texte:
          'A Beastmaster armed with a beast whip causes fear in animals. Any animal charged by, or wishing to charge, a Beastmaster must therefore make a fear test according to the usual rules in the Mordheim Rulebook.',
      },
      {
        nom: 'Reach',
        texte: 'A Beastlash may attack opponents up to 4" away.',
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
    nom: 'Claw of the Old Ones',
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
  lames_tournoyantes: {
    nom: 'Whirling Blades',
    texte:
      'The signature weapon of the Doomseeker, the Whirling Blade is an axe on a chain. Even expert slayers have trouble mastering such a difficult weapon, but once mastered, the damage dealt can be staggering.',
    regles_speciales: [
      {
        nom: 'Cannot be Parried',
        texte:
          'The Whirling Blades are a flexible weapon and a Doomseeker uses them with great expertise. Attempts to parry their strikes are futile. A model attacked by a whirling blade may not make parries with swords or bucklers.',
      },
      { nom: 'Sharp', texte: "The weapon gets an additional -1 save modifier (a Strength 4 fighter will reduce the target's save by -2)." },
      {
        nom: 'Pair',
        texte:
          'Whirling Blades are traditionally used in pairs, one in each hand; like any off-hand weapon, it grants an additional attack as normal. A warrior armed with a pair of whirling blades may not wield a different off-hand weapon, and may never split up the pair (unless he loses a hand).',
      },
      {
        nom: 'Dance of Doom',
        texte:
          'Whenever the Doomseeker charges, the blade in their main hand provides a +1 attack in the first round of combat. The main hand also grants an additional attack in any turn in which the doomseeker is charged by one or more opponents (this attack must be used against one of the chargers; if simultaneously charged by two or more opponents, the bonus remains a total of +1A). This does not apply to the off-hand Whirling Blade.',
      },
      {
        nom: 'Whirlwind of Death',
        texte:
          "Whenever the Doomseeker is charged, the free attack from Dance of Doom and the additional attack from the off-hand both gain 'Strike First,' like a Steel Whip for that turn. All of the Slayer's other attacks strike at normal speed.",
      },
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
      {
        nom: 'Note',
        texte: 'Only Matriarchs and Sister Superiors of the order may carry two Sigmarite war hammers at once.',
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
    nom: 'Man-catcher',
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
        nom: 'Paired',
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
      { nom: 'Wicked Edge', texte: 'Dark elf blades are fitted with sharp barbs and hooks with devastating effects. A damage roll of 2-4 counts as a Stunned result.' },
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
    nom: 'Ogre Club',
    texte: 'A barely-shaped tree trunk, or sometimes the bone of a giant creature, that only an Ogre can wield as a hand-to-hand weapon.',
    regles_speciales: [
      {
        nom: 'Crushing Attack',
        texte:
          'Ogre clubs can be wielded with impressive force, granting an additional -1 save modifier. When it comes to the defender\'s parry attempts, the attack is treated as being at Strength+1. Thus, a Strength 3 fighter cannot parry the attack of a Strength 5 Ogre wielding an ogre club. The Crushing Attack only works if the Ogre uses the club two-handed.',
      },
      { nom: 'Blunt', texte: 'A damage roll of 2-4 (instead of the usual 3-4) is treated as Stunned.' },
    ],
  },

  // --- Objets divers (1/2) ---
  amulette_de_malepierre: {
    nom: 'Warpstone Amulet',
    texte:
      "A warpstone amulet allows its bearer to re-roll one die during the battle. If this ability was not used during the battle, it may instead be used for the Exploration roll, provided the Hero is fit to search the ruins. This item is used by the Clan Pestilens Skaven in place of the rabbit's foot.",
  },
  anneau_du_scorpion: {
    nom: 'Ring of the Scorpion',
    texte:
      'At the start of the battle, if the bearer passes a Leadership test, he may summon a Tomb Scorpion that will fight alongside the warband. The summoned Scorpion will only fight for the duration of one battle. Tomb Scorpion profile: M5 WS2 BS0 S2* T1 W4 I1 A4 Ld(-).',
    regles_speciales: [
      {
        nom: 'Living',
        texte:
          'Scorpions are living creatures and are therefore affected normally by Psychology. However, they are small desert creatures and do not need water.',
      },
      { nom: 'Animals', texte: 'Scorpions are animals and therefore do not gain experience.' },
      {
        nom: 'Scorpion Sting',
        texte:
          'Scorpions attack using the venomous stinger on their tail. The effects are similar to those of black lotus (if you roll a 6 to hit, the target is automatically Wounded).',
      },
    ],
  },
  anneau_venimeux: {
    nom: 'Venomous Ring',
    texte: 'The venomous ring makes its bearer immune to the effects of all poisons.',
  },
  gnoblar_longue_vue: {
    nom: 'Lookout Gnoblar',
    texte:
      "Ogres take great delight in the quarrels between gnoblars, and some claim to keep one as a pet purely for entertainment. A cunning gnoblar will use his cunning to do the right thing at the right moment in order to win his master's favour. Treated in every respect as miscellaneous equipment (these are not models and do not take up a base!). If the Ogre is taken Out of Action, roll 1D6 for each gnoblar: on a 1-2, he is dead and removed from his master's equipment. Ogres may have up to two different gnoblar assistants.",
    regles_speciales: [
      { nom: 'Effect', texte: 'An Ogre with a spyglass gnoblar gains the dodge skill from the Speed skills list.' },
    ],
  },
  gnoblar_porte_bonheur: {
    nom: 'Luck Gnoblar',
    texte:
      'Treated in every respect as miscellaneous equipment (these are not models and do not take up a base!). Ogres may have up to two different gnoblar assistants.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'An Ogre with a lucky gnoblar may re-roll one die per game. Remember that you can never re-roll a die that has already been re-rolled.',
      },
    ],
  },
  gnoblar_porte_epee: {
    nom: 'Sword Gnoblar',
    texte:
      'Treated in every respect as miscellaneous equipment (these are not models and do not take up a base!). Ogres may have up to two different gnoblar assistants.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "An Ogre with a sword-bearer gnoblar gains an additional Strength 2 attack in hand-to-hand combat, using his owner's Weapon Skill. This attack is made at the same time as the Hero's other attacks and must be directed against the same opponent.",
      },
    ],
  },
  attirail_tribal_dent_rouj: {
    nom: 'Red Toof Tribal Jewellery',
    texte:
      'Only proof of martial prowess can catch the attention of this circle of warriors. Once inducted into the tribe, to symbolise his feats, the warrior gets pierced from head to toe!',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'These piercings cannot be removed. The warrior is now subject to the frenzy rules as described in the Mordheim Rulebook.',
      },
    ],
  },
  banniere: {
    nom: 'Banner',
    texte:
      'Well-established warbands often carry a banner or flag to announce their presence, but also to have a rallying point during battle.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "The banner must be carried in one hand by a Hero of the warband. Friendly warriors within 12\" of the bearer may re-roll all failed All Alone tests (but you cannot re-roll a failed re-roll).",
      },
    ],
  },
  banniere_de_la_maison_noble: {
    nom: 'Noble House Banner',
    texte:
      "Burnt and torn like the rest of the Cavalcade's finery, the banner represents the noble house of the aristocrat leading the warband, even though it is often decorated with a red mask symbolising allegiance to the Cavalcade. Although their city has fallen and their power reduced to nothing, the aristocrats of the Doomed Cavalcade still cling in vain to the symbols of their lost glory.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "The pride of carrying the banner and never abandoning it to the enemy increases the bearer's Leadership by 1, up to a maximum of 10. The model carrying the banner must use one of its hands to hold it aloft and cannot carry a shield, buckler, two-handed weapon, or additional weapon.",
      },
    ],
  },
  banniere_de_nagarythe: {
    nom: 'Banner of Nagarythe',
    texte:
      "While many Ghost Warriors are simple vagabonds, others are in fact groups sent by Ulthuan to carry out a mission for the Phoenix King. Such bands are closer to military units and tend to keep their insignia and other symbols, such as the unit's standard. Their colours can have many meanings, especially when the unit's warriors no longer have a true homeland. Ghost Warriors make their own banner; the cost and rarity represent the difficulty of finding the appropriate materials (fine silk and gold thread, for example).",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "A Banner of Nagarythe can serve as a second rallying point for the unit (the Shadow Master being the first, thanks to his Leader skill). All members of the Ghost Warriors warband within 12\" of their banner may re-roll failed Leadership tests. In addition, if the banner is captured by the enemy (if the model carrying it is taken Out of Action), all members of the warband are subject to hatred for the rest of the game, and cannot voluntarily go into Rout. Note that these effects do not affect the warband's irregulars, but only apply to the Ghost Warriors (and Ghost Warrior Heroes). A model carrying a banner needs a free hand to hold it. No weapon or shield can be held in the hand carrying the banner, and the model carrying it cannot have a two-handed weapon. In hand-to-hand combat, a banner may be used as an improvised spear (use the spear rules, but with a -1 penalty to hit).",
      },
    ],
  },
  banniere_du_clan_pestilens: {
    nom: 'Clan Pestilens Banner',
    texte:
      "A model within 12\" of the banner's bearer, usually a Plague Monk or Plague Initiate, may re-roll one failed All Alone test. This item is used by the Clan Pestilens Skaven in place of the banner.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'In addition, the shaft of the Clan Pestilens banner counts as a two-handed weapon in hand-to-hand combat. A warband may only have one Clan Pestilens banner at a time.',
      },
    ],
  },
  bidules_magiques: {
    nom: 'Magic Gubbinz',
    texte:
      'Magic trinkets are objects of all kinds that allow the shaman to focus his powers. Most of the time these are bat claws, lizard jaws, and other similar items, but they nonetheless seem to bring benefits to their owner.',
    regles_speciales: [
      { nom: 'Effect', texte: 'The Shaman may re-roll a spellcasting roll if he gets a result of 4+ on 1D6.' },
    ],
  },
  boussole: {
    nom: 'Compass',
    texte:
      "A compass can be of great use, on land as at sea, allowing pirates to navigate more quickly and precisely through the seemingly chaotic ruins of the destroyed city.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "In any scenario where players must roll 1D6 to determine which side deploys first, the warband of a compass bearer may re-roll its die. Note that only one re-roll is allowed, even if several Pirates have one. If both sides have one, no re-roll is allowed.",
      },
    ],
  },
  brouette: {
    nom: 'Wheelbarrow',
    texte:
      "Probably the adventurer's best friend, the wheelbarrow makes it easy to transport all sorts of bulky items such as chests or powder kegs.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "The wheelbarrow must be placed in the Deployment zone, like all the warband's other models. If you do not have a suitable model, use a marker to represent it. A Hero or Henchman, other than animals or Stupid creatures, may push the wheelbarrow if he is in base contact with it. Pushing a wheelbarrow does not affect the fighter's Movement. He cannot charge with it, but may drop it at any time. The wheelbarrow can be used to carry bulky items. First, the item must be placed in the wheelbarrow. Then, a model may push the wheelbarrow and its load. A wheelbarrow cannot hold more than one bulky item at a time, but can hold as many small items as you like (weapons, armour, and small miscellaneous items).",
      },
    ],
  },
  cape_des_bois: {
    nom: 'Forest Cloak',
    texte:
      "Some outlaws use Forest Cloaks to camouflage themselves and slip out of their enemies' sight. Any bearer of such a cloak seems to blend into the surrounding forest, making him almost invisible. Forest Cloaks are available to Stirwood Outlaw Heroes from their initial recruitment, with no Rarity roll needed. If you wish to acquire one afterwards, use the normal purchase rules during the Trade and Exploration phase.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "As long as the bearer is under cover of a tree, bush, or hedge, any enemy wishing to use a missile weapon against him suffers an additional -1 penalty to hit (in addition to any other modifier). Likewise, if a spellcaster wishes to target an Outlaw camouflaged in this way with a magical attack, he may only do so on a roll of 4+ on 1D6. If the warrior or spellcaster is within a distance in inches equal to or less than his Initiative, this rule is cancelled.",
      },
    ],
  },
  cape_elfique: {
    nom: 'Elven Cloak',
    texte:
      "Woven from the hair of young elf maidens interwoven with living tree leaves, elven cloaks are pure marvels. A warrior wearing one will blend into the shadows and be very difficult to target with missile weapons. These cloaks are rarely offered for sale, but are sometimes taken from dead warriors or given by the elves to reward humans who have provided them with some form of aid.",
    regles_speciales: [
      { nom: 'Effect', texte: 'An elven cloak inflicts a -1 penalty to hit on anyone wishing to shoot at its bearer.' },
    ],
  },
  carte_au_tresor: {
    nom: 'Treasure Map',
    texte:
      'Pirates may use a treasure map instead of Exploring the city ruins normally. It indicates the (possible) location of a treasure that another band of Pirates was forced to bury before putting it somewhere safe. Roll 1D6 after the game to determine where the map leads you (note that the Gold Crowns earned represent the gain after the loot has been divided among the crew). When you buy a map, roll 1D6.',
    regles_speciales: [
      {
        nom: '1. Fake (but a refund)',
        texte:
          'The map turns out to be fake! However, you manage to track down and rough up the filthy bilge-drinking swine who sold it to you, and he offers your warband 1D6x5 Gold Crowns to make amends (and avoid walking the plank!).',
      },
      {
        nom: '2. Small Hideout',
        texte:
          'The map leads your crew to a small hideout. After a few hours of searching, you find a chest containing a shard of wyrdstone and jewellery worth 2D6x10 Gold Crowns.',
      },
      {
        nom: "3. Long Drong Silver's Stash",
        texte:
          "The map reveals one of the legendary beer stashes of Long Drong Silver himself! You discover several barrels of rum, beer, and other spirits. One of them is a barrel of BugmanXXXX, which can be drunk (apply the rules for Bugman's Ale). After 'sampling' many a barrel, the remainder is sold for 2D6x10 Gold Crowns (once the crew has sobered up, of course).",
      },
      {
        nom: "4. Facio's Hideout",
        texte:
          "Buried in the ruins of a modest little hovel, you find several chests filled with precious garments, along with notebooks containing compromising information on numerous local merchants. You realise this must be one of the hideouts left by Facio, the great Tilean swindler. Newly clothed and armed with the information gathered, on your next visit to the trading posts you may buy any item listed in the price table as if it were a common item (with the exception of items specific to Pirates, such as swivel guns or treasure maps), provided you have the necessary money. Once the transaction is complete, you may sell the notebooks to his competitors for 2D6x10 GC, and continue shopping normally at the other trading posts. In addition, if in your next game your warband captures someone, finds the Vagrants (result 4-4 on the Exploration table) or Prisoners (3-3-3), they will be impressed by fine clothes! The Captain's Leadership is increased by +1 for the Recruitment test.",
      },
      {
        nom: '5. Trapped Chest',
        texte:
          'The treasure chest is cunningly trapped! One of your Heroes must venture into the maze protecting the chest and try to avoid poisoned darts and collapsing ceilings by passing an Initiative test. If he succeeds, his skill allows him to discover a lucky charm near the chest (which he claims for himself!), and 3D6x10 GC in the chest. If he fails the test, he must spend the next game recovering. However, now that the traps have been triggered, the crew manages to open the chest and gains the gold as above. Unfortunately, they do not find the lucky charm, which awaits discovery by a more careful adventurer.',
      },
      {
        nom: "6. Black-Wyrd's Cache",
        texte:
          'Your crew bows their heads in reverent silence. The map leads them to one of the legendary secret caches used by Black-Wyrd, the Pirate King. The first and greatest pirate ever to have plundered Mordheim. Known for tying shards of wyrdstone into his hair and beard and then setting them alight so they threw off sparks of unholy fire, he was rightly feared by every warband, on land as at sea. Although only a small chest is found at the site, once opened it reveals 1D3+2 shards of wyrdstone, plus a Map of Mordheim!',
      },
    ],
  },
  carte_de_cathay: {
    nom: 'Map of Cathay',
    texte:
      'Many maps of the provinces of Cathay and its border regions circulate. Most of them are unreliable, but from time to time, a warband manages to get its hands on an interesting map. When you buy a map, roll 1D6.',
    regles_speciales: [
      { nom: '1. Fake', texte: 'The map is fake and utterly useless!' },
      {
        nom: '2-3. The Old Hag',
        texte:
          "The map indicates the way to a mysterious lady. If the warband follows the described route, the first Random Event that occurs during the next battle will automatically be (56) 'The Old Hag' (see the Border Town Burning Random Encounters table).",
      },
      {
        nom: '4-5. Campaign Progress',
        texte:
          'The next time a 4+ is rolled on the Progress table (see Border Town Burning), the warband possessing a Map of Cathay automatically counts as having the most campaign points. It may therefore choose the next scenario. If both warbands have a Map of Cathay, compare campaign points as usual.',
      },
      {
        nom: "6. Belandysh's Hideout",
        texte:
          "This map leads to Belandysh's hideout! When a warband possessing this map rolls a 1 for a Random Event roll, it may choose to automatically land on the event (42-43) 'Belandysh Arrives!'.",
      },
    ],
    sousJetAchatOptions: [
      { label: '1. Fake', texte: 'The map is fake and utterly useless!' },
      {
        label: '2-3. The Old Hag',
        texte:
          "The map indicates the way to a mysterious lady. If the warband follows the described route, the first Random Event that occurs during the next battle will automatically be (56) 'The Old Hag' (see the Border Town Burning Random Encounters table).",
      },
      {
        label: '4-5. Campaign Progress',
        texte:
          'The next time a 4+ is rolled on the Progress table (see Border Town Burning), the warband possessing a Map of Cathay automatically counts as having the most campaign points. It may therefore choose the next scenario. If both warbands have a Map of Cathay, compare campaign points as usual.',
      },
      {
        label: "6. Belandysh's Hideout",
        texte:
          "This map leads to Belandysh's hideout! When a warband possessing this map rolls a 1 for a Random Event roll, it may choose to automatically land on the event (42-43) 'Belandysh Arrives!'.",
      },
    ],
  },
  carte_de_mordheim: {
    nom: 'Map of Mordheim',
    texte:
      'A few survivors of the cataclysm still live in the camps around Mordheim, and earn their living by drawing maps of the city from memory. Many of these maps are fake, and even the genuine ones are often crude and inaccurate. A map can help a warband find its way through the maze of alleys to the places where the rich buildings brimming with loot are found. Roll 1D6 when you buy a map.',
    regles_speciales: [
      {
        nom: '1. Fake',
        texte:
          'The map is fake and worthless. It leads you around in circles, and your opponent may automatically choose the next scenario you play.',
      },
      {
        nom: '2-3. Vague',
        texte:
          'Although crude, this map is relatively accurate (well... partly... maybe!). You may re-roll one die of your choice during the next Exploration phase if you wish, but you must accept the result of the second roll.',
      },
      {
        nom: '4. Catacomb Map',
        texte: 'The map shows access to the city through the catacombs. You automatically choose the scenario for your next battle.',
      },
      {
        nom: '5. Precise',
        texte:
          'The map is recent and highly detailed. You may re-roll up to three dice during the next Exploration phase if you wish. You must accept the results of the second rolls.',
      },
      {
        nom: '6. Original Map',
        texte:
          'This is one of the twelve maps drawn for Count Von Steinhardt of Ostermark. From now on, you may always re-roll one die on Exploration table rolls as long as your Hero possesses the map and is not taken Out of Action during a battle.',
      },
    ],
    sousJetAchatOptions: [
      {
        label: '1. Fake',
        texte:
          'The map is fake and worthless. It leads you around in circles, and your opponent may automatically choose the next scenario you play.',
      },
      {
        label: '2-3. Vague',
        texte:
          'Although crude, this map is relatively accurate (well... partly... maybe!). You may re-roll one die of your choice during the next Exploration phase if you wish, but you must accept the result of the second roll.',
      },
      {
        label: '4. Catacomb Map',
        texte: 'The map shows access to the city through the catacombs. You automatically choose the scenario for your next battle.',
      },
      {
        label: '5. Precise',
        texte:
          'The map is recent and highly detailed. You may re-roll up to three dice during the next Exploration phase if you wish. You must accept the results of the second rolls.',
      },
      {
        label: '6. Original Map',
        texte:
          'This is one of the twelve maps drawn for Count Von Steinhardt of Ostermark. From now on, you may always re-roll one die on Exploration table rolls as long as your Hero possesses the map and is not taken Out of Action during a battle.',
      },
    ],
  },
  carte_de_nehekhara: {
    nom: 'Map of Nehekhara',
    texte:
      'Maps of the realm of the dead are rare. Accurate ones are rarer still. Shifting dunes and dried-up riverbeds can render a map obsolete within a season. Use the rules for the Map of Mordheim from the Rulebook.',
    regles_speciales: [{ nom: 'Effect', texte: 'See Map of Mordheim (same 1D6 results).' }],
    sousJetAchatOptions: [
      {
        label: '1. Fake',
        texte:
          'The map is fake and worthless. It leads you around in circles, and your opponent may automatically choose the next scenario you play.',
      },
      {
        label: '2-3. Vague',
        texte:
          'Although crude, this map is relatively accurate (well... partly... maybe!). You may re-roll one die of your choice during the next Exploration phase if you wish, but you must accept the result of the second roll.',
      },
      {
        label: '4. Catacomb Map',
        texte: 'The map shows access to the city through the catacombs. You automatically choose the scenario for your next battle.',
      },
      {
        label: '5. Precise',
        texte:
          'The map is recent and highly detailed. You may re-roll up to three dice during the next Exploration phase if you wish. You must accept the results of the second rolls.',
      },
      {
        label: '6. Original Map',
        texte:
          'This is one of the twelve maps drawn for Count Von Steinhardt of Ostermark. From now on, you may always re-roll one die on Exploration table rolls as long as your Hero possesses the map and is not taken Out of Action during a battle.',
      },
    ],
  },
  cartes_de_tarot: {
    nom: 'Tarot Cards',
    texte:
      'Although declared blasphemous and illegal by the Grand Theogonist, it is said that the Tarot of the Stars can predict the future for whoever dares consult it.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'A Hero equipped with a deck of tarot cards may consult it before each battle by making a Leadership test. On a success, the Hero gets a glimpse of what is to come. You may therefore modify the result of the die of your choice by -1/+1 during the Exploration phase (even if the Hero carrying the cards is Out of Action). If the Ld test is failed by three points or more, the cards predict misfortune and despair, and the Hero refuses to fight and misses the next battle.',
      },
    ],
  },
  chapelet: {
    nom: 'Prayer Beads',
    texte:
      'A set of prayer beads is made of stone or ivory beads and other sacred ornaments, strung on a chain. It helps with concentration during prayers or meditation.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'A prayer-caster carrying prayer beads may re-roll a failed difficulty roll if he did nothing this turn other than move (not run) or stand still. Prayer beads cannot be used if the user is engaged in hand-to-hand combat.',
      },
    ],
  },
  coffre: {
    nom: 'Chest',
    texte:
      'Chests are often used to keep weapons, equipment, or provisions safe, and sometimes even more precious items.',
    regles_speciales: [
      {
        nom: 'Cumbersome',
        texte:
          'A chest must be carried by two fighters. The bearers must remain in base contact with the chest, or it will fall to the ground. They cannot use missile weapons or fight in hand-to-hand combat while carrying the chest.',
      },
    ],
  },
  collet: {
    nom: 'Snare',
    texte: 'The Horned Hunters are seasoned trappers.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "A Hero may set a snare if he spends his turn doing nothing else (he cannot set a snare if he has just stood up). Place a marker in contact with the Hero's base. If a model (other than the one who set the snare) moves within 2\" or less, roll 1D6: 1-2 = nothing happens, the model may continue its Movement. 3-6 = the snare is triggered, the model is placed 2\" from the snare and suffers an automatic Strength 4 hit. If the model is not Wounded, it may continue its Movement. The marker is then removed.",
      },
    ],
  },
  collier_de_griffes_dours_market: {
    nom: 'Bear Claw Necklace',
    texte:
      "In Kislev, bears are sacred, and a necklace made from the teeth (or claws) of this animal is said to have magical powers. A warrior wearing a bear claw necklace gains a portion of the animal's strength and ferocity.",
    regles_speciales: [{ nom: 'Effect', texte: 'The warrior becomes subject to frenzy.' }],
  },
  conque_musicale: {
    nom: 'Musical Conch',
    texte: 'The musical conch is used by experienced Piranha Warriors to warn the warband of approaching enemies.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'At the start of the game, a Piranha Warrior may use the conch to re-roll the roll determining who deploys first and who goes first. Even if several models have a conch, it is not possible to make a second re-roll.',
      },
    ],
  },
  cor_de_guerre: {
    nom: 'War Horn',
    texte:
      'The powerful sound of a war horn is often enough to instil courage into the hearts of fighters. Its warlike blast drives warriors to unheard-of feats of courage and gives them the will to keep fighting despite the odds.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'The war horn may be sounded once per battle, at the start of any of the player\'s turns. Until the start of the next turn, all members of the warband gain a +1 bonus to their Leadership (up to a maximum of 10), the effect ending at the start of the next turn. The horn may be used just before a Rout test.',
      },
    ],
  },
  cor_de_guerre_de_nagarythe: {
    nom: 'War Horn of Nagarythe',
    texte:
      'As with the Banner of Nagarythe, Mordheim\'s Ghost Warrior units carry a war horn with them. The rules for the War Horn of Nagarythe are the same as for normal war horns (aside from rarity and cost).',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'The War Horn of Nagarythe may be sounded once per game, at the start of any of the player\'s turns. Until the start of the next turn, all members of the warband gain a +1 bonus to their Leadership (up to a maximum of 10), the effect ending at the start of the next turn. The war horn may be used just before the warband makes a Rout test.',
      },
    ],
  },
  corde_et_grappin: {
    nom: 'Rope and Grappling Hook',
    texte: 'A rope combined with a grappling hook makes it easier to move around the ruins of Mordheim.',
    regles_speciales: [
      { nom: 'Effect', texte: 'A warrior equipped with a rope and grappling hook may re-roll failed Initiative tests to climb up or down.' },
    ],
  },
  echelle: {
    nom: 'Ladder (small/large)',
    texte:
      'Ladders are handy for reaching higher places, such as rooftops or trees. The ladder is placed on the game board like any other model in the warband. If you do not have the right piece, use a marker to represent it. A ladder requires two models, Henchmen or Heroes, to be carried (or one large creature). However, although a single fighter can carry a ladder alone, he will only be able to move at half speed (a quarter for large ladders).',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'Models carrying a ladder cannot run, but may drop it whenever they wish (for example, when charging). A ladder can be set up during the Movement phase and requires a quarter of the models\' Movement (half for large ladders). Note that if one of the bearers has a lower Movement than the other, both move at the lower Movement. Ladders are considered open ground and do not affect models\' Movement. A model in base contact with a ladder may attempt to knock it over during the Hand-to-Hand phase. The model must make a Strength test with a -1 modifier for each model on the ladder beyond the first. If the test succeeds, treat the models as falling from where they were. Small ladders have a maximum length of 3", and large ladders are longer than 3".',
      },
    ],
  },
  familier: {
    nom: 'Familiar',
    texte:
      "Wizards lead solitary lives, shunned by those who can barely imagine, let alone understand, the powers they possess. They therefore tend to share their existence with pets rather than beings gifted with 'awareness'. It sometimes happens that a magical bond forms between one of these animals and the mage, to the point where he can see through the creature's eyes and guess its thoughts. Wizards favour different types of animals depending on their homeland and environment. Shadow Weavers, for instance, tend to prefer dark-coated animals that can blend easily into the shadows, such as ravens or black cats. Despite their appearance, Familiars are not normal creatures, but rather animals that have become sensitive to the winds of magic. Familiars cannot be taken as normal equipment. Their cost actually represents that of the materials required for the ritual that will summon the Familiar and form a magical bond with it. The rarity level represents the chances of the ritual succeeding. Thus, the cost of a Familiar must always be paid if the rarity roll is attempted, regardless of whether it succeeds or not. In addition, only spellcasters may attempt to 'find' a Familiar. If a Familiar is found, it must be represented on the spellcaster like any other equipment. A Familiar may be placed on a separate base (in fact, this is how most Games Workshop Familiars are presented), but if you decide to do this, the Familiar must always remain in base contact with the wizard, and has no effect in game terms (it cannot attack enemy models or be attacked, and does not increase the size of the wizard's base, other than as detailed below). Spellcasters only (this excludes users of Prayers).",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'A wizard with a Familiar may re-roll one spellcasting roll each turn. The result of this re-roll must always be accepted, even if it is a failure. It is impossible to re-roll a re-roll.',
      },
    ],
  },
  flute_de_charmeur_de_serpent: {
    nom: "Snake Charmer's Flute",
    texte: 'The owner of this item is able to control snakes.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'If the fighter does nothing for an entire turn, he may play the flute. In that case, all snakes within 6" can neither move nor attack during their next turn.',
      },
    ],
  },
  fragments_de_malepierre_incandescents: {
    nom: 'Glowing Warpstone Fragments',
    texte:
      'Placed in a plague censer, these warpstone fragments have the property of making clouds of pestilent smoke thicker than usual. This item is used by the Clan Pestilens Skaven in place of the elven cloak.',
    regles_speciales: [
      { nom: 'Effect', texte: 'The bearer becomes difficult to hit, and shooters wishing to target him suffer a -1 penalty to hit.' },
    ],
  },
  glandes_a_venin: {
    nom: 'Venom Glands',
    disponibilite: 'Sacred Marking, only buyable at the Hero\'s recruitment — Skinks only, a Hero may only bear one Sacred Marking',
    texte:
      'The Skink has sublingual glands that secrete a deadly poison. The Skink may make some or all of his attacks by biting instead of using his weapons. These attacks suffer a +1 armour save modifier, regardless of the Skink\'s Strength. However, they do not suffer the penalty for fighting unarmed and, if they Wound, gain a +1 bonus on the Injury table. These attacks are always resolved last, whether or not the Skink charged and regardless of the weapons used (including two-handed weapons).',
  },
  gourde_magique: {
    nom: 'Magic Water Skin',
    texte:
      "The power of the water skin may be used at the end of each battle. It provides 1D3 units of water. Once the water has been used up, roll 1 additional D6. On a 6, the water skin's magic is spent and it breaks.",
  },
  grimoire_de_magie: {
    nom: 'Grimoire of Magic',
    texte: 'Books containing forbidden knowledge are sometimes offered for sale in the markets and dark alleys of the camps surrounding Mordheim.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'If a warband includes spellcasters, one of them permanently gains a new spell. Roll for it randomly on his own list or on the Lesser Magic list. Refer to the Magic chapter. Can only be used once.',
      },
    ],
  },
  gueule_enorme: {
    nom: 'Huge Gob',
    disponibilite: 'Sacred Marking, only buyable at the Hero\'s recruitment — Saurus only, a Hero may only bear one Sacred Marking',
    texte:
      'The Saurus has oversized jaws and powerful jaw muscles. As a result, his bite attack is resolved with a +1 Strength bonus.',
  },
  habits_de_fourrure: {
    nom: 'Fur Clothing',
    texte:
      'Fur clothing includes snowshoes and furs (including boots and gloves). A model wearing fur clothing is immune to the special rules of the following weather effects: biting cold, heavy snow, and harsh winter (see Border Town Burning).',
    regles_speciales: [
      {
        nom: 'Soaked Through',
        texte:
          'If fur clothing gets soaked through by water, it becomes useless until the end of the game. Note that, like the overcoat, fur clothing may be used by Henchmen.',
      },
    ],
  },
  habits_de_nomade: {
    nom: 'Nomad Robes',
    texte:
      'Woven by the natives of the desert, these robes allow their wearer to suffer only half the penalties associated with Weather Effects. These robes affect results on the Weather table as follows. Rain: the robes protect the fighter\'s equipment. Whenever you must roll 1D6 each time you use a black powder weapon, the shot is only lost on a 1. Scorching Heat: a fighter wearing nomad robes suffers only a -1 penalty to his WS and BS and only needs the normal amount of water. Heat: a fighter wearing these robes suffers no penalty to his WS and BS. If at least half the warband is wearing nomad robes, it only needs the normal amount of water. Sandstorm: the robes have no effect. Not even these robes can protect fighters from the ferocity of the storm. Apply the sandstorm rules normally.',
  },
  habits_en_soie_de_cathay: {
    nom: 'Cathayan Silk Garments',
    texte:
      'Some wealthy warband leaders like to flaunt their wealth by buying Cathayan silk garments. This is the most expensive fabric in the known world, and wearing such clothes is a surefire way to attract attention, especially from thieves and assassins.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'Any Mercenary warband whose leader wears silk garments may re-roll its first failed Rout test. However, roll 1D6 after every battle in which the leader is taken Out of Action. On a result of 1-3, the garments are torn and destroyed.',
      },
    ],
  },
  cape_de_soie_cathayenne: {
    nom: 'Cathayan Silk Cloak',
    texte:
      'Some wealthy warband leaders like to flaunt their wealth by buying clothes made out of silk from distant Cathay. This silk is the most expensive fabric in the known world, and wearing such clothes is a sure way to attract attention – especially thieves and assassins!',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'A warband whose leader is wearing the Cathayan silk cloak may re-roll the first failed Rout test. However, after each battle in which the leader is taken out of action, roll a D6. On a roll of 1-3 the cloak is ruined and must be discarded.',
      },
    ],
  },
  crochet: {
    nom: 'Hook',
    texte:
      'Any Pirate who has lost a hand or arm as a result of the Serious Injuries Hand Injury or Arm Injury may have a sharpened metal hook fitted in its place. The bearer of this new, elegant device cannot use two-handed weapons, but will always be considered equipped with a hand-to-hand weapon thanks to this prosthesis. The hook counts as a dagger. A new member of the warband, whether at warband creation or as a new recruit, may also start with a hook.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'If the bearer suffers a Hand Injury or Arm Injury in subsequent battles, these Serious Injuries may be ignored on a roll of 4+, as the blow landed on the hook.',
      },
    ],
  },
  jambe_de_bois: {
    nom: 'Wooden Leg',
    texte:
      'Any Pirate who has suffered the Serious Injuries Leg Wound or Smashed Leg may choose to have the crippled leg replaced with a sturdy wooden leg. This reduces his Movement (and his maximum Movement characteristic) by -1, but offers a chance that blows received will strike the wooden leg instead. The bearer benefits from a special 6+ save, usable whenever he makes a save roll against a shooting or hand-to-hand attack. This save cannot be modified and may be used even when no save roll would normally be allowed. A new member of the warband, whether at warband creation or as a new recruit, may also start with a wooden leg.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'If the bearer suffers a Leg Wound or Smashed Leg in subsequent battles, these Serious Injuries may be ignored on a roll of 4+, as the blow landed on the wooden leg.',
      },
    ],
  },
  jolly_roger: {
    nom: 'Jolly Roger',
    texte:
      "The mere sight of the Jolly Roger fluttering in the wind is enough to stir even the most hardened old sea dog. Any Hero may carry the Jolly Roger. The cost represents the effort the ship's craftsmen must put in to create a miniaturised version of the flag, carried on the end of a pole.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'Pirates within 12" of the Jolly Roger are never considered to be All Alone. Carrying the banner ties up one hand. This fighter therefore cannot carry or use two-handed weapons for the rest of the game. Note that the Conscripts, lacking true Pirate spirit, gain no benefit from the Jolly Roger.',
      },
    ],
  },
  lampe_magique: {
    nom: 'Magic Lamp',
    texte:
      'This is an extremely rare item dating back to the time of Sultan Jaffar. It is said that the sultan used dark magic to bind demonic entities to everyday objects in order to benefit from their powers without revealing their true nature. It happens that one or another of these objects ends up in the hands of adventurers brave or foolish enough to call upon the powers of the djinn within. Each time a Hero uses the magic lamp, it grants him three wishes, but for each roll on the Light table, you must make one on the Shadow table.',
    regles_speciales: [
      { nom: 'Light D6 — 1', texte: 'Gain 1D6 experience points.' },
      { nom: 'Light D6 — 2', texte: 'Gain a skill chosen from the appropriate lists.' },
      { nom: 'Light D6 — 3', texte: 'Gain 1D6x10 Gold Crowns.' },
      { nom: 'Light D6 — 4', texte: 'Gain an item randomly determined from the equipment list.' },
      { nom: 'Light D6 — 5', texte: 'Choose an item from the equipment list.' },
      { nom: 'Light D6 — 6', texte: 'Roll twice on this table.' },
      { nom: 'Shadow D6 — 1', texte: 'Nothing in particular.' },
      { nom: 'Shadow D6 — 2', texte: 'Nothing in particular.' },
      { nom: 'Shadow D6 — 3', texte: 'You lose 1D6x10 GC.' },
      { nom: 'Shadow D6 — 4', texte: 'You lose 1D6 weapons.' },
      { nom: 'Shadow D6 — 5', texte: 'You lose the lamp.' },
      { nom: 'Shadow D6 — 6', texte: 'Roll on the Injury table.' },
    ],
  },
  liber_bubonicus: {
    nom: 'Liber Bubonicus',
    texte:
      "If a Clan Pestilens Skaven warband includes a Pestilens Sorcerer, he permanently gains a new spell. Roll for it randomly on the Horned Rat magic spell list. If he has the Arcane Lore skill, a Plague Priest may use the Liber Bubonicus to learn Horned Rat magic. He gains the special rule 'Sorcerer: a sorcerer is a spellcaster who uses Horned Rat magic. See the Magic section.' and permanently learns a spell drawn at random from the Horned Rat magic spell list. The Liber Bubonicus may only be used once, and a warband may only have a single user of the Liber Bubonicus in any given campaign. This item is used by the Clan Pestilens Skaven in place of the grimoire of magic.",
  },
  lanterne: {
    nom: 'Lantern',
    texte: 'A model carrying a lantern may add +4" to the distance at which it can spot hidden enemies.',
  },
  liber_necris: {
    nom: 'Liber Necris',
    texte:
      'This book transcribes some of the writings of Nagash, the Great Necromancer. If he has the sorcery skill, a Vampire may use this book to learn Necromancy. A Necromancer will permanently gain a new spell.',
  },
  liturgicus_infectus: {
    nom: 'Liturgicus Infectus',
    texte:
      'A member of Clan Pestilens, usually a Plague Monk, may carry with him a scroll bearing the holy Liturgicus Infectus. This is the Clan Pestilens hymn to the glory of disease and contagion.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'At the start of a turn, or just before making a Rout test, the warband may sing the Liturgicus Infectus and gain a +1 Leadership bonus until the end of the turn.',
      },
    ],
  },
  livre_de_cuisine_halfling: {
    nom: 'Halfling Cookbook',
    texte:
      'All Halfling cooks have their own secret recipes, compiled in hand-copied grimoires from Mootland, their homeland. Food prepared according to these recipes attracts warriors during hard times.',
    regles_speciales: [
      { nom: 'Effect', texte: 'The maximum number of warriors allowed in your warband is increased by +1, regardless of how many cookbooks you possess.' },
    ],
  },
  livre_des_damnes: {
    nom: 'Book of the Damned',
    texte:
      "The pages of this grimoire describe the servants of Chaos, heretics, deviants, mutants, blasphemers, necromancers, sinners, and other enemies of Sigmar in all their infamy. A Hero carrying the Book of the Damned will hate all models from Possessed, Skaven, Sisters of Sigmar, Beastmen, Chaos, Daemon, or Orc and Goblin warbands. Translator's note: these rules were written before many other warbands appeared. Feel free to consider which warbands are affected or not, but Undead and other Chaotic warbands released later seem to be obvious candidates.",
  },
  livre_saint: {
    nom: 'Holy Book',
    texte:
      'Books containing prayers and accounts of miracles performed by holy men such as Sigmar Heldenhammer are hand-copied in the scriptoriums of Sigmar and Ulric, then given or sold to the faithful. Of these works, the Deus Sigmar is the most famous and widespread, but other texts, such as the Scriptures of Sigmar, are also sold to believers. A pious man may recite the prayers from such a book to strengthen his faith.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'A Warrior Priest or Sister of Sigmar carrying a holy book adds +1 to the result when determining whether he (or she) successfully casts a prayer.',
      },
    ],
  },
  longue_vue: {
    nom: 'Spyglass',
    texte: 'A pirate may use his trusty spyglass to scan the battlefield and spot sneaks trying to hide!',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'At the start of his turn, the spyglass user may attempt to detect a hidden enemy he has line of sight to. On a roll of 4+, the fighter loses his hidden status. A Pirate using a spyglass may move during that turn, but cannot run or charge.',
      },
    ],
  },
  lunette_de_visee: {
    nom: 'Sighting Scope',
    texte:
      "The telescope, an essential instrument for Nuln's astronomers and astrologers, is quite rare in the City of the Damned. However, its miniature version is very useful for marksmen and those who wish to keep an eye on their surroundings from a distance.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'A Hero possessing a sighting scope may, each turn, increase the normal range of his missile weapons by 1D6". It also triples the distance at which he can spot hidden models.',
      },
    ],
  },
  marque_des_anciens: {
    nom: 'Mark of the Ancients',
    disponibilite: 'Sacred Marking, only buyable when recruiting a Hero born with it — a Hero may only bear one Sacred Marking',
    texte:
      'The most prestigious mark a Lizardman can be born with. These albinos have a great destiny in the eyes of their gods and of other Lizardmen. The Hero may turn one of his failed dice rolls into a successful one. This mark can only be used once per battle and only on the Hero\'s own actions. You may use this mark on a failed Rout test if you wish.',
  },
  masque_de_crane: {
    nom: 'Skull Mask',
    regles_speciales: [{ nom: 'Effect', texte: 'Causes fear.' }],
  },
  masque_du_roi_soleil: {
    nom: 'Mask of the Sun King',
    texte:
      "A golden mask depicting the ancient emperors, adorned with a laurel wreath. The mask symbolises House Steinhardt's secret desire to betray the Empire and ascend to Sigmar's throne in Altdorf. No bearer of this mask may be brought to his knees, as befits an emperor. Each mask is unique, so you may only have one copy of each mask in your warband. You may freely distribute the masks among your Heroes before the battle if you wish.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'The bearer of the Mask of the Sun King cannot be Knocked Down or Stunned, and results shown on the Injury table have no effect on him. The only way to remove him from the table is to roll an Injury result of Out of Action.',
      },
    ],
  },
  masque_de_mort_en_argent: {
    nom: 'Silver Death Mask',
    texte: 'This mask resembles a richly decorated skull, but moves like living human skin, reflecting the expressions of whoever wears it.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'If the bearer of the silver mask is taken Out of Action, he may re-roll any result on a Serious Injury table. He must accept the second result even if it is worse than the first.',
      },
    ],
  },
  masque_de_tete_de_poisson: {
    nom: 'Fish-Head Mask',
    texte:
      'A strange silvery mask, inlaid with gemstone eyes, resembling that of a deep-sea fish. It is whispered that these masks were once used by worshippers of forgotten evil deities slumbering at the bottom of the sea, dreaming of the day they will rise from the depths to sow ruin among men. A man wearing this mask can swallow a human whole, as a snake swallows a rat.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'Whenever the bearer of the fish-head mask takes an opponent Out of Action, he temporarily gains +1 Wound (up to a maximum of 5) until the end of the battle. After that, his number of Wounds returns to normal.',
      },
    ],
  },
  masque_sans_visage: {
    nom: 'Faceless Mask',
    texte:
      'This mask has almost no human features, except for two eye slits filled with blackness. The bearer can move with such determination that no one dares stop him.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'Once per game, the bearer of the faceless mask may prevent an opponent from intercepting his charge. Fighters immune to psychology, such as the Undead and Flagellants, are not affected.',
      },
    ],
  },
  masque_de_medecin_de_peste: {
    nom: 'Plague Doctor Mask',
    texte:
      "A silver mask fitted with a long beak resembling that of a bird, itself a symbol of death for the people of the Old World, ravaged by countless diseases. In combat, a cloud of black death seeps from the mask's empty eye sockets.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'Once per game, during the Shooting phase, the bearer may release the black cloud contained within the mask, burning those who are not part of the Cavalcade. The longer the power is held within the mask, the more powerful it becomes. On the first turn, it hits any enemy model within 3" of the bearer with a Strength of 1. The range and Strength of the effect increase by +1 at the start of each of the Cavalcade\'s turns, up to a range of 7" and a Strength of 5 (if you wait 4 turns before releasing the cloud). Roll to hit (with no penalty for range or cover) and to Wound as usual. The cloud never causes Critical Hits.',
      },
    ],
  },
  masque_de_bouffon_malefique: {
    nom: 'Wicked Jester Mask',
    texte:
      'Erratic and unpredictable, the face of the wicked jester mask twists from a demented grin to a look of pure hatred or terrifying rage before every fight.',
    regles_speciales: [
      {
        nom: 'Effect (D6 at the start of combat)',
        texte:
          '1: the bearer is subject to stupidity for the duration of the fight. 2-5: the bearer hates all his enemies for the duration of the fight. 6: the bearer is subject to frenzy.',
      },
    ],
  },
  outils_de_crochetage: {
    nom: 'Lockpicks',
    texte: 'An essential tool for those without scruples. These tools allow finesse rather than brute force to be used to open a locked door.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'A model equipped with lockpicks may make a test under his Initiative instead of Strength to open a door. Make the roll at the end of his Movement phase as if the model were attempting to force the door open, but without the Strength penalty. In addition, a door opened this way is not damaged and may be closed again later.',
      },
    ],
  },
  outre: {
    nom: 'Waterskin',
    texte: 'Like wineskins, it allows its owner to carry one additional unit of water. Each model may only have one waterskin.',
  },
  parchemin_de_rat_familier: {
    nom: 'Familiar Rat Scroll',
    texte:
      'This scroll bears a spell that a Plague Preacher may use as many times as he wishes. If the warband includes at least one Giant Rat, this spell may be cast on it before the start of the battle, transforming it into a Familiar Rat. If his Familiar Rat is within 6", the Plague Preacher may re-roll one spellcasting roll once per game. The result of this re-roll must be accepted, even if it is a failure. A Plague Preacher may only have one Familiar Rat at a time. It remains a Henchman and counts towards the warband\'s maximum number of members. If the Plague Preacher dies, his Familiar Rat reverts to its Giant Rat form. Familiar Rat profile: M6 WS2 BS0 S3 T3 W1 I4 A1 Ld4. Weapons/armour: None.',
    regles_speciales: [
      {
        nom: 'Enchanted Animal',
        texte:
          "The Familiar Rat gains experience as a Henchman. On the Henchmen advance table, the result of 10-12 'This One's Got Talent' is replaced by 'Improved Spellcasting: if the Plague Preacher is within 6\" of the Familiar Rat, he gains a +1 bonus to his spellcasting roll. This ability is cumulative.'",
      },
    ],
  },
  pardessus: {
    nom: 'Overcoat',
    texte:
      'This coat or cloak protects its wearer, and especially his equipment, from the soaked-through effect (see the Weather Effects of the Setting used). Note that this miscellaneous item is an exception to the rule and may be used by Henchmen.',
  },
  patte_de_lapin: {
    nom: "Rabbit's Foot",
    texte: 'This lucky charm is often worn around the neck on a leather cord by the most superstitious fighters.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "A rabbit's foot allows its bearer to re-roll one die during the battle. If this ability was not used during the battle, it may instead be used for the Exploration roll, provided the Hero is fit to search the ruins. The Clan Pestilens Skaven use the warpstone amulet, which has the same effects.",
      },
    ],
  },
  patte_de_singe: {
    nom: "Monkey's Paw",
    texte:
      'Crafted during a strange ritual by nomadic tribes roaming the desert, this item, as powerful as the magic lamp, does not always bring luck to its bearer. Each time a Hero uses the paw, he is granted three wishes (on the Light table) and must make a roll on the Shadow table. It is impossible to get rid of the paw, but it will disappear after three uses, or if you roll a result of 6 on the Shadow table. After the third use, the monkey\'s paw disappears. If the Hero goes two games without using the paw, he must make a roll on the Shadow table.',
    regles_speciales: [
      { nom: 'Light D6 — 1', texte: 'Gain 1D6 experience points.' },
      { nom: 'Light D6 — 2', texte: 'Gain a skill chosen from the appropriate lists.' },
      { nom: 'Light D6 — 3', texte: 'Gain 1D6x10 Gold Crowns.' },
      { nom: 'Light D6 — 4', texte: 'Gain an additional Hero, even if you are already at your maximum.' },
      { nom: 'Light D6 — 5', texte: 'Gain an additional Henchman, even if you are already at your maximum.' },
      { nom: 'Light D6 — 6', texte: 'Roll twice on this table.' },
      { nom: 'Shadow D6 — 1', texte: 'Lose 1D6 experience points.' },
      { nom: 'Shadow D6 — 2', texte: 'Lose a randomly determined skill.' },
      { nom: 'Shadow D6 — 3', texte: 'Lose 1D6x10 GC.' },
      { nom: 'Shadow D6 — 4', texte: 'Lose a Hero.' },
      { nom: 'Shadow D6 — 5', texte: 'Lose a Henchman.' },
      { nom: 'Shadow D6 — 6', texte: "Lose the monkey's paw." },
    ],
  },
  peau_de_cerf_benie: {
    nom: 'Blessed Deer Skin',
    texte: 'This animal skin, worn as a cloak, is a mark of honour once blessed by the clergy of Taal.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte: 'A blessed skin grants unmistakable grace to its wearer, allowing him to re-roll a failed Initiative test once per turn.',
      },
    ],
  },
  pendule_en_pierre_magique: {
    nom: 'Wyrdstone Pendulum',
    texte: 'Wyrdstone pendulums are used to find even more of this precious ore.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'If not Out of Action, the Hero carrying the pendulum may make a Leadership test after the battle. On a success, you may re-roll one die of your choice during the Exploration phase. This die cannot be re-rolled a second time.',
      },
    ],
  },
  perroquet: {
    nom: 'Parrot',
    texte:
      'Wyrdstone shards! Wyrdstone shards! A well-trained parrot is excellent at distracting opponents, either by squawking loudly at them or by flapping around to hinder them.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "Any enemy in base contact with the parrot's owner must pass a Leadership test or suffer a -1 penalty to hit during his first turn of hand-to-hand combat against the Pirate.",
      },
    ],
  },
  pierres_runiques_elfiques: {
    nom: 'Elven Rune Stones',
    texte:
      "High Elf mages are masters of defensive magic. To this end, they have developed many powerful mystical runes, which they often inscribe on semi-precious stones to reinforce a wizard's magical defences.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "A wizard equipped with this item may use it to successfully dispel a spell cast on himself or another member of his warband. To dispel it, the wizard must roll against the spell's difficulty (Sorcery does not work here). If he succeeds, the spell fails. If he fails, the spell works normally.",
      },
    ],
  },
  porte_bonheur: {
    nom: 'Lucky Charm',
    texte: 'Many exist, but the most common are medallions shaped like hammers blessed by a Sigmarite priest, or effigies of ancient dwarf gods.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'The first time a model carrying a lucky charm is hit, it rolls 1D6: on a result of 4+, the hit is cancelled and no damage is suffered. Having several lucky charms brings no further benefit, as the model can only cancel the first hit.',
      },
    ],
  },
  tonneau_de_poudre: {
    nom: 'Powder Keg',
    texte:
      'A powder keg is treated as a chest, with one exception: it can be blown up! Fighters may attack a powder keg at range with a black powder weapon, Cathayan grenades, fire bombs, or flaming arrows. They may also attack it in hand-to-hand combat with a torch or a fiery staff. Naturally, they may also use any weapon or similar item capable of igniting the powder inside the keg.',
    regles_speciales: [
      {
        nom: 'Explosion',
        texte:
          'The fighter must hit and wound normally (the keg having a Toughness of 4). Then roll 1D6. On a 4+, the keg explodes (remove the keg from the game board). If a Critical Hit is scored, the keg automatically explodes. An exploding powder keg automatically inflicts a Strength 6 hit on all models within 1D6+3". If the scenario being played takes place underground or in a cavern (Horrors of the Underworld, available in Border Town Burning, for example), roll one additional D6. On a 4+, the explosion causes the tunnel to collapse, forming a wall of rocks blocking the passage. Place a marker where the keg stood to indicate that the passage is blocked. The rock rubble can be cleared by non-animal fighters. To represent this, during the Hand-to-Hand phase, they must attack the rocks (Toughness 6, 4 Wounds). The wall has a 3+ armour save, affected normally by Strength modifiers.',
      },
    ],
  },
  trophee_coiffe_sacree_de_slann: {
    nom: 'Sacred Slann Headdress Trophy',
    regles_speciales: [{ nom: 'Effect', texte: '+2 armour save.' }],
  },
  relique_sacree_impie: {
    nom: 'Holy (Unholy) Relic',
    texte:
      'A religious relic, blessed or cursed depending on the nature of its bearer — a bone fragment, an engraved amulet, or a vial of consecrated blood — carried to bolster one\'s courage in battle.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "The bearer automatically passes the first Leadership test he is required to take in the game. If he is the warband's leader and hasn't had to take a Leadership test before, he also automatically passes his first Rout test. Owning more than one relic does not allow further tests to be ignored.",
      },
    ],
  },
  relique_sacree_impie_pretres_soeurs: {
    nom: 'Holy (Unholy) Relic',
    texte:
      'A religious relic, blessed or cursed depending on the nature of its bearer — a bone fragment, an engraved amulet, or a vial of consecrated blood — carried to bolster one\'s courage in battle.',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "The bearer automatically passes the first Leadership test he is required to take in the game. If he is the warband's leader and hasn't had to take a Leadership test before, he also automatically passes his first Rout test. Owning more than one relic does not allow further tests to be ignored.",
      },
    ],
  },
  relique_sacree_bretonnienne: {
    nom: 'Bretonnian Holy Relic',
    texte: 'A fragment of a reliquary, a lock of hair from a Lady of the Lake, or a shard of armour from a fallen knight — an object of devotion carried on pilgrimage.',
    regles_speciales: [
      { nom: 'Effect', texte: 'The bearer gains the ability Frenzy (reminder: when frenzied, he is immune to Hatred).' },
    ],
  },
  relique_sacree_sigmarite: {
    nom: 'Sacred Relic',
    texte: 'A miniature hammer, a fragment of bone from a holy martyr, or a page torn from the Great Testament — an object of faith carried by the Sisters into battle.',
    regles_speciales: [
      { nom: 'Effect', texte: 'The bearer benefits from a special 6+ save against spells and prayers directed at him.' },
    ],
  },

  // --- Objets divers (2/2) — Bénédictions de Nurgle / mutations ---
  gnoblar_combattant: {
    nom: 'Gnoblar Fighter',
    texte:
      'Treated in every respect as miscellaneous equipment (these are not models and do not take up a base!). Ogres may have up to two different gnoblar assistants.',
    regles_speciales: [
      { nom: 'Effect', texte: 'An Ogre with a fighting gnoblar gains the Precise Blow skill from the Combat skills list.' },
    ],
  },
  flot_de_corruption: {
    nom: 'Flood of Corruption (Blessing of Nurgle)',
    texte: 'A Blessing of Nurgle granted to the Unclean upon recruitment, teeming with worms, bile, and blood.',
    regles_speciales: [
      { nom: 'Effect', texte: 'Shooting attack (range 6", Strength 3, no armour save): a spray of worms, bile, and blood.' },
    ],
  },
  pourriture_de_nurgle: {
    nom: "Nurgle's Rot (Blessing of Nurgle)",
    texte: "The Unclean is infected with this virulent and incurable disease, contracted in Nurgle's service.",
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'Immunity to poisons. On a 6 to wound in hand-to-hand combat, the bearer transmits the disease to his target (living models only), who tests his Toughness after every subsequent battle (failure = permanent loss of 1 point of Toughness, death at 0; on a 6 on the test, the disease is unwittingly passed on to another member of the warband, determined randomly).',
      },
    ],
  },
  nuage_de_mouches_benediction: {
    nom: 'Cloud of Flies (Blessing of Nurgle)',
    texte: 'A swarm of nauseating flies constantly swirls around the Unclean, hindering his opponents.',
    regles_speciales: [
      { nom: 'Effect', texte: "The Unclean's opponents suffer a -1 penalty to hit in hand-to-hand combat." },
    ],
  },
  horreur_enflee: {
    nom: 'Bloated Horror (Blessing of Nurgle)',
    texte: "The Unclean's body swells and bloats under the effect of Nurgle's blessing.",
    regles_speciales: [{ nom: 'Effect', texte: '+1 Wound, +1 Toughness, but -1 Movement.' }],
  },
  marque_de_nurgle: {
    nom: 'Mark of Nurgle (Blessing of Nurgle)',
    texte: "The Mark of Nurgle is branded into the Unclean's flesh, a sign of the Plague God's favour.",
    regles_speciales: [{ nom: 'Effect', texte: '+1 Wound and immunity to the effects of all poisons.' }],
  },
  hideux: {
    nom: 'Hideous (Blessing of Nurgle)',
    texte: 'The Unclean transforms into something so repulsive that the mere sight of his weeping sores freezes the blood.',
    regles_speciales: [{ nom: 'Effect', texte: 'Causes fear.' }],
  },
  ame_demoniaque: {
    nom: 'Daemonic Soul',
    regles_speciales: [{ nom: 'Effect', texte: 'Special 4+ save against spells or prayers.' }],
  },
  pince_mutation: {
    nom: 'Great Claw',
    regles_speciales: [
      { nom: 'Effect', texte: 'The mutant does not wield a weapon in this arm, but gains an additional Strength+1 attack in hand-to-hand combat.' },
    ],
  },
  tentacule: {
    nom: 'Tentacle',
    regles_speciales: [
      { nom: 'Effect', texte: 'The mutant may grapple an opponent in hand-to-hand combat, causing him to lose 1 Attack of his choice (minimum 1).' },
    ],
  },
  sabots_fendus: {
    nom: 'Cloven Hooves',
    regles_speciales: [{ nom: 'Effect', texte: '+1 Movement.' }],
  },
  sang_acide: {
    nom: 'Black Blood',
    regles_speciales: [
      {
        nom: 'Effect',
        texte: 'If the mutant suffers a wound in hand-to-hand combat, models in contact with him suffer a Strength 3 hit (no Critical Hits).',
      },
    ],
  },
  epines: {
    nom: 'Spines',
    regles_speciales: [
      {
        nom: 'Effect',
        texte: 'Any model in contact suffers a Strength 1 hit at the start of each hand-to-hand phase (never a Critical Hit).',
      },
    ],
  },
  queue_de_scorpion: {
    nom: 'Scorpion Tail',
    regles_speciales: [
      { nom: 'Effect', texte: 'Additional Strength 5 attack (Strength 2 if the target is immune to poison).' },
    ],
  },
  bras_supplementaire: {
    nom: 'Extra Arm',
    regles_speciales: [
      {
        nom: 'Effect',
        texte: 'Additional attack with a one-handed weapon, shield, or buckler (or +1 Attack with no additional weapon).',
      },
    ],
  },
  hideux_mutation: {
    nom: 'Hideous',
    regles_speciales: [{ nom: 'Effect', texte: 'Causes fear.' }],
  },
  corps_cristallin: {
    nom: 'Crystalline Body',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          'Toughness fixed at 6 and Wounds fixed at 1, no longer modifiable afterwards (re-roll any corresponding advances already obtained).',
      },
    ],
  },
  brute_epaisse: {
    nom: 'Thick-Skinned Brute',
    regles_speciales: [{ nom: 'Effect', texte: '+2 Strength, -4 Leadership.' }],
  },
  morsure_venimeuse: {
    nom: 'Venomous Bite',
    regles_speciales: [
      { nom: 'Effect', texte: 'Additional Strength 5 attack (Strength 2 if the target is immune to poison).' },
    ],
  },
  queue_prehensile: {
    nom: 'Prehensile Tail',
    regles_speciales: [
      { nom: 'Effect', texte: 'Additional attack; allows the mutant to hold a one-handed weapon, shield, or buckler.' },
    ],
  },
  peau_ecailleuse: {
    nom: 'Scaly Skin',
    regles_speciales: [
      { nom: 'Effect', texte: 'Natural 5+ armour save, stackable with light armour (+1).' },
    ],
  },
  ailes_mutation: {
    nom: 'Wings',
    regles_speciales: [
      { nom: 'Effect', texte: 'Allows gliding from an elevated position: for every 1" fallen, move 2" horizontally.' },
    ],
  },
  cymbales_de_singe: {
    nom: 'Cymbals',
    texte:
      "A pair of cymbals the Fighting Ape clashes frantically together, to the haunting tune of the Danse Macabre.",
    regles_speciales: [
      { nom: 'Effect', texte: 'Any enemy within 6" of the Fighting Ape suffers a -1 BS and -1 Ld penalty, unsettled by the racket.' },
    ],
  },
  epee_longue_cathayenne: {
    nom: 'Cathayan Longsword',
    texte:
      'A long, heavy blade forged by the finest armourers of Cathay, reserved for the highest-ranking Imperial dignitaries posted on the borders of the Celestial Empire.',
    regles_speciales: [
      {
        nom: 'Two-Handed Weapon',
        texte:
          'The weapon is wielded two-handed and prevents the simultaneous use of a shield, buckler, or additional weapon. A shield still grants a +1 bonus to the armour save against shooting.',
      },
    ],
  },
  arme_en_obsidienne_fils_dhashut: {
    nom: 'Obsidian Weapon (Sons of Hashut)',
    texte:
      "The Sons of Hashut's own variant of the obsidian weapon — distinct from the Chaos cults' x4 obsidian weapon (see arme_en_obsidienne_market), never to be used in the same campaign as that one without renaming one of the two. Only swords, axes, and maces can be forged in obsidian; all cost the same fixed price, regardless of the weapon type chosen.",
    regles_speciales: [
      { nom: 'Personal', texte: "The weapon keeps all the usual bonuses of its base type (Parry for a sword, etc.)." },
      { nom: 'Heavy', texte: '-1 Initiative in hand-to-hand combat for the wielder.' },
    ],
  },
  serre_cruelle: {
    nom: 'Cruel Talon',
    texte: 'A claw-like blade grown directly from the bark, as sharp as a metal blade but never quite of the same nature.',
    disponibilite: 'Sylvaneth only',
    regles_speciales: [
      {
        nom: 'Parry',
        texte:
          'When the opponent rolls to hit, roll 1D6. If the result is higher than his best roll, your fighter has parried the blow and the attack is cancelled. It is not possible to parry an attack from a Strength double or more his own, as it is too powerful.',
      },
    ],
  },
  arme_spectrale_market: {
    nom: 'Spectral Weapon',
    texte:
      'Any weapon available in the Sylvaneth or Treeman equipment list, except daggers, may be purchased as a spectral version for twice its normal cost.',
    disponibilite: 'Common, Sylvaneth only',
    regles_speciales: [
      { nom: 'Cost x2', texte: 'Base weapon price x2.' },
      {
        nom: 'Automatic Wound',
        texte:
          'On a natural 6 to hit, the attack wounds automatically. Still roll to wound to determine whether a critical hit is scored. This roll may not be re-rolled by Wrathful Spirits.',
      },
    ],
  },
  grand_arc_de_kurnoth: {
    nom: 'Kurnoth Greatbow',
    texte: "A bow the size of its bearer, carved from the hardest wood of the oldest glades.",
    disponibilite: 'Rare 9, Treeman only',
    regles_speciales: [
      {
        nom: 'Piercing Trait',
        texte:
          "When a shot from the Kurnoth Greatbow causes an unsaved wound, the projectile may continue on its course. Draw a straight line from the shooter through the target. If another warrior is directly behind it on this line, he automatically suffers a hit with Strength reduced by 1. If this hit in turn causes an unsaved wound, the projectile continues in the same way, again reducing its Strength by 1. The projectile stops as soon as it fails to cause an unsaved wound or its Strength drops to 0.",
      },
    ],
  },
  ecorce_de_fer: {
    nom: 'Ironbark',
    texte:
      "Ironbark is a growth bound to the bearer's body. It provides a normal, modifiable armour save and may be combined with a shield. It may not be transferred or sold and never reduces the bearer's Movement. It never prevents the bearer from casting spells.",
    disponibilite: 'Common (Levels I-II), Rare 10 Heroes only (Level III), Sylvaneth only',
    regles_speciales: [
      {
        nom: 'Levels',
        texte:
          'Level I: 30 gc, 5+ save, Common. Level II: +50 gc (80 gc total), 4+ save, Common. Level III: +120 gc (200 gc total), 3+ save, Rare 10, Heroes only.',
      },
    ],
  },
  manuel_entrainement: {
    nom: 'Training Manual',
    texte:
      'A training manual recovered from the ruins of a duellists and gladiators arena in Mordheim, describing forgotten combat techniques.',
    disponibilite: 'Found only via the Arena exploration event — never for purchase',
    regles_speciales: [
      {
        nom: 'Effect',
        texte:
          "The bearing Hero may choose from the Combat skill list in addition to his usual lists whenever an advance roll grants him a new skill, and his Weapon Skill may now advance one point beyond the normal maximum (for example, a human's Weapon Skill with the manual may now advance to a maximum of 7).",
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

// Notes de disponibilité (rareté/restriction de bande) traduites en anglais —
// remplissage systématique de la trentaine d'items sans note dédiée jusque-là,
// suivant le même principe de repli progressif que le reste de ce fichier.
for (const id of ['masque_du_roi_soleil']) {
  itemsEn[id].disponibilite = 'Aristocrats only, one per warband';
}
for (const id of ['double_canon']) {
  itemsEn[id].disponibilite = 'Gunnery School of Nuln and Ostlander Mercenaries only';
}
for (const id of ['coffre', 'corde_et_grappin', 'lanterne', 'outre', 'pardessus', 'ail', 'torche', 'victuailles', 'armure_legere', 'armure_lourde', 'bouclier', 'rondache', 'casque', 'arme_a_deux_mains', 'arme_contondante_une_main', 'dague', 'epee', 'fleau', 'hache', 'hallebarde', 'lance', 'morgenstern', 'poing', 'arbalete', 'arc_court', 'arc', 'arc_long', 'fronde', 'javelots', 'filet']) {
  itemsEn[id].disponibilite = 'Common';
}
for (const id of ['echelle']) {
  itemsEn[id].disponibilite = 'Common / Rare 5';
}
for (const id of ['boulet_pierrier', 'chaines_pierrier', 'mitraille_pierrier']) {
  itemsEn[id].disponibilite = 'Common, Pirate Gunners only';
}
for (const id of ['chariot_de_marchandises']) {
  itemsEn[id].disponibilite = 'Common, Merchant Caravans only';
}
for (const id of ['collet']) {
  itemsEn[id].disponibilite = 'Common, Horned Hunters only';
}
for (const id of ['ecu']) {
  itemsEn[id].disponibilite = 'Common, Knights of the Bretonnian Chapel Guard only';
}
for (const id of ['epee_batarde']) {
  itemsEn[id].disponibilite = 'Common, Bretonnian Chapel Guardian Knights only';
}
for (const id of ['relique_sacree_bretonnienne', 'epee_courte']) {
  itemsEn[id].disponibilite = 'Common, Bretonnian Chapel Guardians only';
}
for (const id of ['poignards_empoisonnes']) {
  itemsEn[id].disponibilite = 'Common, Night Goblins only';
}
for (const id of ['arme_empoisonnee_mod']) {
  itemsEn[id].disponibilite = 'Common, Forest Goblins only';
}
for (const id of ['aiguillon_a_squigs', 'baton_dboss']) {
  itemsEn[id].disponibilite = 'Common, Goblins only';
}
for (const id of ['chaine_et_boulet_cac']) {
  itemsEn[id].disponibilite = 'Common, Night Goblin Fanatics only';
}
for (const id of ['chat_a_neuf_queues']) {
  itemsEn[id].disponibilite = 'Common, Pirate Heroes only';
}
for (const id of ['cuir_durci', 'fouet_dhedoniste']) {
  itemsEn[id].disponibilite = 'Common, Heroes only';
}
for (const id of ['baton_de_combat']) {
  itemsEn[id].disponibilite = 'Common, Battle Monks of Cathay only';
}
for (const id of ['casque_marmite']) {
  itemsEn[id].disponibilite = 'Common, Mootlanders';
}
for (const id of ['attendrisseur', 'couteau_de_cuisine', 'hachoir', 'louche']) {
  itemsEn[id].disponibilite = 'Common, Mootlanders only';
}
for (const id of ['massue_ogre', 'poing_de_fer', 'couperet', 'gourdin_ogre']) {
  itemsEn[id].disponibilite = 'Common, Ogres only';
}
for (const id of ['gaffe', 'cabillot']) {
  itemsEn[id].disponibilite = 'Common, Pirates only';
}
for (const id of ['biscuit_de_mer']) {
  itemsEn[id].disponibilite = 'Common, Pirates only (one per Pirate Hero, single use)';
}
for (const id of ['crochet']) {
  itemsEn[id].disponibilite = 'Common, Pirates only (one per model)';
}
for (const id of ['jambe_de_bois']) {
  itemsEn[id].disponibilite = 'Common, Pirates only (one per model)';
}
for (const id of ['jolly_roger']) {
  itemsEn[id].disponibilite = 'Common, Pirates only, one per warband';
}
for (const id of ['misericorde']) {
  itemsEn[id].disponibilite = 'Common, Lustrian Reavers only';
}
for (const id of ['fleches_aspic', 'javelot_nehekharien']) {
  itemsEn[id].disponibilite = 'Common, Tomb Guardians\' Tomb Lords only';
}
for (const id of ['cymbales_de_singe']) {
  itemsEn[id].disponibilite = 'Common, The Cursed Cavalcade\'s Fighting Ape only';
}
for (const id of ['bolas']) {
  itemsEn[id].disponibilite = 'Common, Skinks only';
}
for (const id of ['relique_sacree_sigmarite']) {
  itemsEn[id].disponibilite = 'Common, Sisters of Sigmar only';
}
for (const id of ['fouet_dacier']) {
  itemsEn[id].disponibilite = 'Common, Sisters of Sigmar and Black Dwarfs only';
}
for (const id of ['masque_de_crane', 'trophee_coiffe_sacree_de_slann', 'cape_en_peau_des_hommes_lezards', 'lame_homme_lezard']) {
  itemsEn[id].disponibilite = 'Common, Saurus Slayer only';
}
for (const id of ['venin_de_reptile']) {
  itemsEn[id].disponibilite = 'Common, Skink thrown weapons only (Heroes and Henchmen)';
}
for (const id of ['habits_de_fourrure']) {
  itemsEn[id].disponibilite = 'Common, unavailable to Beastmen';
}
for (const id of ['cape_de_soie_cathayenne']) {
  itemsEn[id].disponibilite = 'Common, Battle Monks of Cathay Emissary and Merchant Caravans Heroes only';
}
for (const id of ['epee_longue_cathayenne']) {
  itemsEn[id].disponibilite = 'Common, Battle Monks of Cathay Emissary only';
}
for (const id of ['marteau_de_guerre_sigmarite_market']) {
  itemsEn[id].disponibilite = 'Common, Sisters of Sigmar only';
}
for (const id of ['armure_lourde_de_maitre', 'bec_de_corbin']) {
  itemsEn[id].disponibilite = 'Lustrian Reavers Conqueror only';
}
for (const id of ['flot_de_corruption', 'pourriture_de_nurgle', 'nuage_de_mouches_benediction', 'horreur_enflee', 'marque_de_nurgle', 'hideux']) {
  itemsEn[id].disponibilite = 'Impure (Carnival of Chaos) only, at recruitment';
}
for (const id of ['faucon_de_chasse_tileen']) {
  itemsEn[id].disponibilite = 'Beastmaster only';
}
for (const id of ['grenade_de_miragliano']) {
  itemsEn[id].disponibilite = 'Lustrian Reavers Trap Master only';
}
for (const id of ['pistolet_de_duel']) {
  itemsEn[id].disponibilite = 'Rare 10 (60 gc per pair)';
}
for (const id of ['carrosse_opulent']) {
  itemsEn[id].disponibilite = 'Rare 10 (price includes 2 horses)';
}
for (const id of ['epee_des_etoiles', 'baton_solaire_lustrie']) {
  itemsEn[id].disponibilite = 'Rare 10, Amazons — Lustria Setting only';
}
for (const id of ['oiseau_de_proie']) {
  itemsEn[id].disponibilite = 'Rare 10, The Cursed Cavalcade Aristocrats only';
}
for (const id of ['armure_cathayenne_soie_matelassee', 'lance_a_sanglier']) {
  itemsEn[id].disponibilite = 'Rare 10, Aristocrats only';
}
for (const id of ['pistolet_duel_double_canon_paire']) {
  itemsEn[id].disponibilite = 'Rare 10, Gunnery School of Nuln only';
}
for (const id of ['pistolet_duel_double_canon']) {
  itemsEn[id].disponibilite = 'Rare 10, Gunnery School of Nuln only (65 gc per pair)';
}
for (const id of ['peau_de_cerf_benie']) {
  itemsEn[id].disponibilite = 'Rare 10, Horned Hunters only';
}
for (const id of ['coursier_elfique']) {
  itemsEn[id].disponibilite = 'Rare 10, Elves only';
}
for (const id of ['arme_en_obsidienne_fils_dhashut']) {
  itemsEn[id].disponibilite = 'Rare 10, Sons of Hashut only (30 gc for a warband starting at 0 XP)';
}
for (const id of ['pince_homme_slaaneshi']) {
  itemsEn[id].disponibilite = 'Rare 10, Whipmaster only';
}
for (const id of ['char_squelette']) {
  itemsEn[id].disponibilite = 'Rare 10, Tomb Guardians only';
}
for (const id of ['pince_market']) {
  itemsEn[id].disponibilite = 'Rare 10, Black Dwarf Jailers only';
}
for (const id of ['loup_geant']) {
  itemsEn[id].disponibilite = 'Rare 10, Goblins only';
}
for (const id of ['vin_elfique']) {
  itemsEn[id].disponibilite = 'Rare 10, Shadow Warriors only';
}
for (const id of ['cape_des_bois']) {
  itemsEn[id].disponibilite = 'Rare 10, Outlaw Heroes only';
}
for (const id of ['banniere_de_la_maison_noble']) {
  itemsEn[id].disponibilite = 'Rare 10, The Cursed Cavalcade Heroes only';
}
for (const id of ['cape_en_peau_de_dragon_des_mers']) {
  itemsEn[id].disponibilite = 'Rare 10, Dark Elf Heroes and Corsairs only';
}
for (const id of ['epee_dragon']) {
  itemsEn[id].disponibilite = 'Rare 10, Battle Monks of Cathay and Merchant Caravans only';
}
for (const id of ['machine_du_chaos']) {
  itemsEn[id].disponibilite = 'Rare 10, Black Dwarfs only';
}
for (const id of ['gnoblar_porte_epee', 'lance_harpon']) {
  itemsEn[id].disponibilite = 'Rare 10, Ogres only';
}
for (const id of ['carte_au_tresor']) {
  itemsEn[id].disponibilite = 'Rare 10, Pirates only';
}
for (const id of ['livre_des_damnes']) {
  itemsEn[id].disponibilite = 'Rare 10, The Witch Hunters only';
}
for (const id of ['arquebuse_a_repetition']) {
  itemsEn[id].disponibilite = 'Rare 11, Gunnery School of Nuln only';
}
for (const id of ['destrier_du_chaos_market']) {
  itemsEn[id].disponibilite = 'Rare 11, Cult of the Possessed, Black Dwarfs, Carnival of Chaos, Marauders of Chaos, Norse and Beastmen Raiders only';
}
for (const id of ['caparacon_bretonnien']) {
  itemsEn[id].disponibilite = 'Rare 11, Bretonnian Knights\' Warhorses only';
}
for (const id of ['sang_froid']) {
  itemsEn[id].disponibilite = 'Rare 11, Dark Elves and Skinks only';
}
for (const id of ['araignee_geante']) {
  itemsEn[id].disponibilite = 'Rare 11, Goblins only';
}
for (const id of ['destriers']) {
  itemsEn[id].disponibilite = 'Rare 11, Humans only';
}
for (const id of ['sanglier_de_guerre_market']) {
  itemsEn[id].disponibilite = 'Rare 11, Orcs only';
}
for (const id of ['pistolet_a_malepierre_paire']) {
  itemsEn[id].disponibilite = 'Rare 11, Skaven only';
}
for (const id of ['pistolet_a_malepierre']) {
  itemsEn[id].disponibilite = 'Rare 11, Skaven only (70 gc per pair)';
}
for (const id of ['pierres_runiques_elfiques']) {
  itemsEn[id].disponibilite = 'Rare 11, Shadow Warriors\' Shadow Weavers only';
}
for (const id of ['cauchemar']) {
  itemsEn[id].disponibilite = 'Rare 11, Vampires and Necromancers only';
}
for (const id of ['cape_elfique']) {
  itemsEn[id].disponibilite = 'Rare 12 (75+1D6x10 gc for Shadow Warriors)';
}
for (const id of ['griffes_des_anciens', 'baton_solaire_mordheim', 'gantelet_du_soleil']) {
  itemsEn[id].disponibilite = 'Rare 12, Amazons — Mordheim Setting only';
}
for (const id of ['amulette_lunaire']) {
  itemsEn[id].disponibilite = 'Rare 12, Amazons — Mordheim Setting only (Rare 11 for Amazons — Lustria Setting)';
}
for (const id of ['mortier_portable']) {
  itemsEn[id].disponibilite = 'Rare 12, Gunnery School of Nuln only';
}
for (const id of ['mortier_portable_ogre']) {
  itemsEn[id].disponibilite = 'Rare 12, Maneaters only';
}
for (const id of ['arme_en_obsidienne_market']) {
  itemsEn[id].disponibilite = 'Rare 12, Cult of the Possessed, Black Dwarfs, Carnival of Chaos, Marauders of Chaos, Norse and Beastmen Raiders only';
}
for (const id of ['liber_necris']) {
  itemsEn[id].disponibilite = 'Rare 12, Undead and Vampires only';
}
for (const id of ['liber_bubonicus']) {
  itemsEn[id].disponibilite = 'Rare 12, Skaven of Clan Pestilens only';
}
for (const id of ['grimoire_de_magie']) {
  itemsEn[id].disponibilite = 'Rare 12, unavailable to The Witch Hunters and Sisters of Sigmar';
}
for (const id of ['armure_du_chaos_market']) {
  itemsEn[id].disponibilite = 'Rare 13, Cult of the Possessed, Black Dwarfs, Carnival of Chaos, Marauders of Chaos, Norse and Beastmen Raiders only';
}
for (const id of ['lion_de_pierre']) {
  itemsEn[id].disponibilite = 'Rare 13, Dragon Monks, Sisters of Sigmar and Priests only, unavailable to Skaven, Undead and Black Dwarfs';
}
for (const id of ['exosquelette']) {
  itemsEn[id].disponibilite = 'Rare 14, Black Dwarfs only';
}
for (const id of ['rhinox']) {
  itemsEn[id].disponibilite = 'Rare 15, Ogres, Marauders of Chaos, Norse Explorers and Merchant Caravans only';
}
for (const id of ['rapiere']) {
  itemsEn[id].disponibilite = 'Rare 5, Reiklander Mercenaries and Marienburg Mercenaries, Tileans, Hochland Bandits, Merchant Caravans';
}
for (const id of ['amulette_de_malepierre', 'banniere_du_clan_pestilens']) {
  itemsEn[id].disponibilite = 'Rare 5, Skaven of Clan Pestilens only';
}
for (const id of ['peaux_enchantees']) {
  itemsEn[id].disponibilite = 'Rare 6, Amazons — Lustria Setting only';
}
for (const id of ['cor_de_guerre_de_nagarythe']) {
  itemsEn[id].disponibilite = 'Rare 6, Shadow Warriors only';
}
for (const id of ['eau_benite']) {
  itemsEn[id].disponibilite = 'Rare 6, unavailable to the Possessed and Undead (Common for Warrior Priests and Sisters of Sigmar)';
}
for (const id of ['cartes_de_tarot']) {
  itemsEn[id].disponibilite = 'Rare 7 (unavailable to The Witch Hunters and Sisters of Sigmar)';
}
for (const id of ['chariot_diligence']) {
  itemsEn[id].disponibilite = 'Rare 7 (price does not include animals)';
}
for (const id of ['lame_des_etoiles']) {
  itemsEn[id].disponibilite = 'Rare 7, Amazons — Lustria Setting only';
}
for (const id of ['gantelet_a_pointe', 'trident']) {
  itemsEn[id].disponibilite = 'Rare 7, Pit Fighters only';
}
for (const id of ['sarbacane']) {
  itemsEn[id].disponibilite = 'Rare 7, Forest Goblins, Skaven and Skinks only (Common for Forest Goblins)';
}
for (const id of ['nunchaku', 'kusarigama']) {
  itemsEn[id].disponibilite = 'Rare 7, Battle Monks of Cathay only';
}
for (const id of ['baton_du_serpent']) {
  itemsEn[id].disponibilite = 'Rare 7, Tomb Guardians\' Liche Priest only';
}
for (const id of ['baton_ardent']) {
  itemsEn[id].disponibilite = 'Rare 7, The Witch Hunters only';
}
for (const id of ['griffes_de_combat']) {
  itemsEn[id].disponibilite = 'Rare 7, Skaven only';
}
for (const id of ['main_gauche']) {
  itemsEn[id].disponibilite = 'Rare 7, Hochland Bandits Duelist only';
}
for (const id of ['larmes_de_shallya']) {
  itemsEn[id].disponibilite = 'Rare 7, unavailable to the Possessed and Undead';
}
for (const id of ['livre_de_cuisine_halfling']) {
  itemsEn[id].disponibilite = 'Rare 7, unavailable to Carnival of Chaos and Undead';
}
for (const id of ['venin_fuligineux']) {
  itemsEn[id].disponibilite = 'Rare 8 (20 gc for Lizardmen Skink Heroes\' missile weapons, Common for Lizardmen)';
}
for (const id of ['pistolet']) {
  itemsEn[id].disponibilite = 'Rare 8 (30 gc per pair)';
}
for (const id of ['herbes_de_soin']) {
  itemsEn[id].disponibilite = 'Rare 8, 35 gc (Common) for Amazons — Mordheim and Lustria Settings';
}
for (const id of ['pigeon_explosif']) {
  itemsEn[id].disponibilite = 'Rare 8, Gunnery School of Nuln only';
}
for (const id of ['pierrier']) {
  itemsEn[id].disponibilite = 'Rare 8, Pirate Gunners only';
}
for (const id of ['perroquet']) {
  itemsEn[id].disponibilite = 'Rare 8, Pirate Captain and Lieutenants only';
}
for (const id of ['pique_market']) {
  itemsEn[id].disponibilite = 'Rare 8, Merchant Caravans and Tileans only';
}
for (const id of ['caparacon']) {
  itemsEn[id].disponibilite = 'Rare 8, Warhorses, Nightmares, Elven Steeds and Chaos Steeds only';
}
for (const id of ['conque_musicale']) {
  itemsEn[id].disponibilite = 'Rare 8, Amazons — Lustria Setting Piranha Warriors only';
}
for (const id of ['cheval', 'pousse_pousse']) {
  itemsEn[id].disponibilite = 'Rare 8, Humans only';
}
for (const id of ['grande_hache_du_chaos']) {
  itemsEn[id].disponibilite = 'Rare 8, Chaos Heroes with the Chosen of Chaos skill';
}
for (const id of ['vodka']) {
  itemsEn[id].disponibilite = 'Rare 8, Kislevites only';
}
for (const id of ['venin_sombre']) {
  itemsEn[id].disponibilite = 'Rare 8, Lustrian Reavers only';
}
for (const id of ['fouet_a_betes']) {
  itemsEn[id].disponibilite = 'Rare 8, Dark Elf Beastmasters only';
}
for (const id of ['hache_naine']) {
  itemsEn[id].disponibilite = 'Rare 8, Dwarfs only';
}
for (const id of ['hache_de_jet']) {
  itemsEn[id].disponibilite = 'Common for Slayers (Rare 5 for others)';
}
for (const id of ['lames_tournoyantes']) {
  itemsEn[id].disponibilite = 'Rare 9, Slayers only';
}
for (const id of ['gnoblar_longue_vue', 'gnoblar_combattant']) {
  itemsEn[id].disponibilite = 'Rare 8, Ogres only';
}
for (const id of ['ombre_cramoisie']) {
  itemsEn[id].disponibilite = 'Rare 8, Lustrian Reavers and Court of the Profane Pleasures only';
}
for (const id of ['longue_vue']) {
  itemsEn[id].disponibilite = 'Rare 8, Pirates only';
}
for (const id of ['livre_saint']) {
  itemsEn[id].disponibilite = 'Rare 8, Warrior Priests and Sisters of Sigmar only';
}
for (const id of ['liturgicus_infectus', 'parchemin_de_rat_familier', 'dague_de_la_peste']) {
  itemsEn[id].disponibilite = 'Rare 8, Skaven of Clan Pestilens only';
}
for (const id of ['familier']) {
  itemsEn[id].disponibilite = 'Rare 8, spellcasters only';
}
for (const id of ['champignons_bonnets_de_fou_market']) {
  itemsEn[id].disponibilite = 'Rare 9 (Common, 25 gc if the warband includes Night Goblins)';
}
for (const id of ['pistolet_a_repetition', 'arquebuse_double_canon']) {
  itemsEn[id].disponibilite = 'Rare 9, Gunnery School of Nuln only';
}
for (const id of ['lame_elfe_noire']) {
  itemsEn[id].disponibilite = 'Rare 9, Dark Elves only';
}
for (const id of ['attirail_tribal_dent_rouj', 'bidules_magiques']) {
  itemsEn[id].disponibilite = 'Rare 9, Forest Goblins only';
}
for (const id of ['banniere_de_nagarythe']) {
  itemsEn[id].disponibilite = 'Rare 9, Shadow Warriors only';
}
for (const id of ['dague_empoisonnee_hobgobeline']) {
  itemsEn[id].disponibilite = 'Rare 9, Hobgoblins only';
}
for (const id of ['misericordia']) {
  itemsEn[id].disponibilite = 'Rare 9, The Cursed Cavalcade Heroes only';
}
for (const id of ['collier_de_griffes_dours_market']) {
  itemsEn[id].disponibilite = 'Rare 9, Kislevites only';
}
for (const id of ['habits_en_soie_de_cathay']) {
  itemsEn[id].disponibilite = 'Rare 9, Mercenaries only';
}
for (const id of ['tromblon_nain_du_chaos']) {
  itemsEn[id].disponibilite = 'Rare 9, Black Dwarfs only';
}
for (const id of ['gnoblar_porte_bonheur']) {
  itemsEn[id].disponibilite = 'Rare 9, Ogres only';
}
for (const id of ['boussole']) {
  itemsEn[id].disponibilite = 'Rare 9, Pirates only';
}
for (const id of ['fragments_de_malepierre_incandescents', 'encensoir_a_peste']) {
  itemsEn[id].disponibilite = 'Rare 9, Skaven of Clan Pestilens only';
}
for (const id of ['fiole_de_pestilence']) {
  itemsEn[id].disponibilite = 'Rare 9, Skaven only';
}
for (const id of ['lames_suintantes']) {
  itemsEn[id].disponibilite = 'Rare 9, Skaven only (per pair)';
}
for (const id of ['lotus_noir']) {
  itemsEn[id].disponibilite = 'Rare 9, unavailable to The Witch Hunters and Sisters of Sigmar (Rare 7 for Skaven, Common for Lizardmen; 10 gc for Lizardmen Skinks\' missile weapons)';
}
for (const id of ['tromblon']) {
  itemsEn[id].disponibilite = 'Rare 9, except Black Dwarfs (see Chaos Dwarf Blunderbuss)';
}
for (const id of ['fouet_barbele']) {
  itemsEn[id].disponibilite = 'Rare 9, one Marauders of Chaos Hero only';
}
for (const id of ['ame_demoniaque', 'pince_mutation', 'tentacule', 'sabots_fendus', 'sang_acide', 'epines', 'queue_de_scorpion', 'bras_supplementaire', 'hideux_mutation', 'corps_cristallin', 'brute_epaisse', 'morsure_venimeuse', 'queue_prehensile', 'peau_ecailleuse', 'ailes_mutation']) {
  itemsEn[id].disponibilite = 'Reserved for Mutants/Possessed, or heroes who have taken the special \'Mutant\' skill (depending on the warband) — first mutation at normal price, subsequent ones on the same model cost double.';
}
for (const id of ['cape_en_peau_de_loup']) {
  itemsEn[id].disponibilite = 'Special, Middenheim Mercenaries, Norse Explorers and Marauders of Chaos only';
}
for (const id of ['masque_de_tete_de_poisson', 'masque_sans_visage', 'masque_de_bouffon_malefique']) {
  itemsEn[id].disponibilite = 'Any Hero';
}
for (const id of ['masque_de_mort_en_argent']) {
  itemsEn[id].disponibilite = 'Any Hero, one silver death mask per warband';
}
for (const id of ['masque_de_medecin_de_peste']) {
  itemsEn[id].disponibilite = 'Twisted Scholar only';
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
    sous_jet_achat?: { de: '1D6'; options: { valeurs: number[]; label: string; texte: string }[] };
    resultatSousJetAchat?: { jet: number; optionIndex: number; label: string; texte: string };
  },
>(item: T, language: Language): T {
  if (language !== 'en') return item;
  const en = itemsEn[item.id];
  if (!en) return item;
  const resultatSousJetAchat = item.resultatSousJetAchat;
  return {
    ...item,
    nom: en.nom,
    texte: en.texte ?? item.texte,
    disponibilite: en.disponibilite ?? item.disponibilite,
    regles_speciales: item.regles_speciales?.map((r, i) => {
      const rEn = en.regles_speciales?.[i];
      return rEn ? { ...r, nom: rEn.nom, texte: rEn.texte } : r;
    }),
    sous_jet_achat: item.sous_jet_achat
      ? {
          ...item.sous_jet_achat,
          options: item.sous_jet_achat.options.map((o, i) => {
            const oEn = en.sousJetAchatOptions?.[i];
            return oEn ? { ...o, label: oEn.label, texte: oEn.texte } : o;
          }),
        }
      : item.sous_jet_achat,
    resultatSousJetAchat: resultatSousJetAchat
      ? (() => {
          const oEn = en.sousJetAchatOptions?.[resultatSousJetAchat.optionIndex];
          return oEn ? { ...resultatSousJetAchat, label: oEn.label, texte: oEn.texte } : resultatSousJetAchat;
        })()
      : resultatSousJetAchat,
  };
}

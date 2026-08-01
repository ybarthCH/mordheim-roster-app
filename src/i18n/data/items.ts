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

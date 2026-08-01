import type { Language } from '../../state/useLanguage';
import type {
  CompetenceSpeciale,
  EquipementListe,
  EquipementRef,
  Magie,
  Profile,
  SpecialRule,
  WarbandCatalog,
} from '../../types/catalog';

type RegleTraduite = { nom: string; texte: string; exception?: string };
type CompetenceTraduite = { nom: string; texte: string; reserve_a?: string };
type SortTraduit = { nom: string; texte: string; note?: string };
type MagieTraduite = { nom?: string; type?: string; note?: string; sorts?: SortTraduit[] };
type MarqueTraduite = { nom: string; texte?: string };
type TribuTraduite = { nom: string; texte: string };
type EquipementListeTraduite = {
  armes_cac?: (string | undefined)[];
  armes_tir?: (string | undefined)[];
  armures?: (string | undefined)[];
  divers?: (string | undefined)[];
};

type ProfileTraduit = {
  nom?: string;
  regles_speciales?: RegleTraduite[];
  competences_speciales?: Record<string, CompetenceTraduite>;
};

export type WarbandTraduite = {
  nom?: string;
  regles_speciales?: RegleTraduite[];
  profils?: Record<string, ProfileTraduit>;
  competences_speciales?: Record<string, CompetenceTraduite>;
  magie?: MagieTraduite;
  magie_variantes?: Record<string, MagieTraduite>;
  marques?: Record<string, MarqueTraduite>;
  tribus?: Record<string, TribuTraduite>;
  equipement?: Record<string, EquipementListeTraduite>;
};

// Traductions des bandes, remplies progressivement bande par bande (voir
// translateItem dans items.ts pour le même principe de repli). Clé = id de
// bande (src/data/warbands/*.json).
export const warbandsEn: Record<string, WarbandTraduite> = {
  maraudeurs_du_chaos: {
    nom: 'Chaos Marauders (1c)',
    regles_speciales: [
      {
        nom: 'Eye of the Dark Gods',
        texte:
          "After each battle, roll 2D6. If you lost, add +1 for each Hero taken Out of Action; on a 12+, the leader becomes a Chaos Spawn (losing experience, skills, wounds, and equipment). If you won, add +1 for each enemy taken Out of Action by the leader; on a 12+, the leader receives a Mark of the Dark Gods of his choice (see the Marks of the Dark Gods special rule). Once a leader has received a Mark through this rule, he is no longer subject to it (unless he dies, in which case the new leader is tested in turn). If the warband already has a Chaos Spawn, a leader who would get this result is simply removed from the warband instead of being transformed.",
      },
      {
        nom: 'Hired Swords',
        texte:
          'May only hire Pit Fighters, Ogres, Norse Shamans, and Imperial Assassins, as well as any Hired Sword whose description specifically allows it. Spellcasters may be hired, unless the warband includes warriors with the Mark of Arkhar.',
      },
      {
        nom: 'Tribes',
        texte:
          'At recruitment, the player chooses which tribe his warband belongs to (Norse, Kurgans, or Hung). All follow the standard Marauder rules (choice of warriors, skills, equipment) except for the few exceptions detailed for each (see Chosen Tribe below).',
      },
      {
        nom: 'Marks of the Dark Gods',
        texte:
          "A leader can only bear one Mark at a time (except the Mark of Chaos Undivided, which can coexist with the others); Wise Ones choose their Mark in agreement with the tribe at recruitment, and then use the rituals associated with their Mark instead of the generic Rituals of Chaos (except Chaos Undivided, which keeps the Rituals of Chaos). Mark of Arkhar the Hound — Leader: automatic frenzy, any spell targeting the Hero fails on a 4+. Wise One: becomes a Blood Father, no longer casts spells but gains +1 to a characteristic of choice (Combat, S, T, or I, once each) each time he takes an enemy Out of Action (Leadership test required), and gains access to Strength skills in addition to his normal list. Mark of Shornaal the Serpent — Leader: enemies not Immune to Psychology must pass a Leadership test (3D6, discarding the lowest) to attack the Hero in hand-to-hand combat, or suffer an automatic hit; once passed, no further tests are needed. Wise One: uses the Rituals of Shornaal; may brew a strong drink for the warband (like Bugman's Ale, not for sale) instead of searching for rare items, provided he was not taken Out of Action. Mark of Tchar the Eagle — Leader: immediately learns a random spell from the Rituals of Tchar, with a -1 penalty to difficulty rolls unless he was already a spellcaster. Wise One: starts with two spells from the Rituals of Tchar (one chosen freely, one random). Mark of Onogal the Raven — Leader: +1 Toughness, may re-roll on the Serious Injury table, immune to poisons. Wise One: uses the Rituals of Onogal and benefits from immunity to poisons. Mark of Chaos Undivided — Leader: all warband members within the Leader rule's range may re-roll failed Leadership tests. Wise One: allows the warband to include 0 to 3 Gors (see Beastmen Raiders), counting towards the maximum warband size; uses the standard Rituals of Chaos. The alternative rituals specific to each Mark (Shornaal, Tchar, Onogal) are provided as additional reference; otherwise the Wise One uses the Rituals of Chaos below.",
      },
      {
        nom: 'Mutation Table',
        texte:
          "Reserved for Heroes with the special skill 'Mutant' (extracted and adapted from the Corrupted Characters chapter of Mutiny in Marienburg). A model's first mutation is bought at normal price; subsequent mutations for the same model cost double — see his Equipment list.",
      },
      {
        nom: 'Blessings of Nurgle',
        texte:
          "Extracted and adapted from the Chaos Kermesse warband. Reserved for Marauder Heroes with the Mark of Onogal, purchasable each time the Mutant skill is chosen (double cost for each additional purchase) instead of a regular mutation. Flow of Corruption (25 gc): shooting attack, range 6\", Strength 3, no armour save. Cloud of Flies (25 gc): the bearer's opponents suffer -1 to hit in hand-to-hand combat. Hideous (40 gc): causes Fear. Nurgle's Rot (50 gc): immune to poisons; on a roll of 6 to wound in hand-to-hand combat, transmits an incurable disease that reduces the victim's Toughness by 1 point per battle on a failed Toughness test (death if Toughness reaches 0), with a chance of spreading to another warband member on a 6. Mark of Nurgle (35 gc): +1 Wound, immune to the effects of all poisons. Bloated Horror (40 gc): +1 Wound, +1 Toughness, -1 Movement.",
      },
      {
        nom: 'Daemonic Bestiary (allies)',
        texte:
          'Extracted from the Bestiary of the Border Town Burning and Empire in Flames supplements. All creatures with the Daemon special rule benefit from: immunity to poisons, immunity to Psychology, they cause Fear, and have a special armour save of 5+ (modified by the attacker\'s Strength, negated by magical weapons/spells); they never gain experience. Pink Horror of Tzeentch (M4 WS2 BS0 S3 T3 W1 I3 A1 Ld8): warband leaders bearing the Mark of Tchar may ally with Pink Horrors of Tzeentch; during the Shooting phase, roll 2D6: on a 6+ the nearest model within 12" suffers a Strength 1 hit (Fire of Tzeentch). Plaguebearer (M4 WS4 BS0 S4 T4 W1 I4 A2 Ld10): opponents suffer -1 to hit in hand-to-hand combat (Cloud of Flies); an eternal daemon, never gains experience (no advancement possible).',
      },
    ],
    tribus: {
      norses: {
        nom: 'Norse',
        texte:
          'Raiders: due to their proximity to the Empire and the frequency of their raids, the Norse excel at finding the best equipment and supplies quickly — they gain +1 to their rarity rolls when searching for rare items (for reference only, apply on your tabletop). Pantheon: the Norse worship a myriad of gods, spirits, and ancestors; because of their broad pantheon, the effect of the Eye of the Dark Gods special rule (becoming a Chaos Spawn or receiving a Mark) triggers on a result of 13+ instead of 12+.',
      },
      kurgans: {
        nom: 'Kurgans',
        texte:
          'Pedigree: a Kurgan warband may include as many Chaos Hounds as desired, not just five. Bone Bows: Marauder Heroes and Henchmen may use bows (10 gc, Common — for reference only, not automatically filtered in the shop). Difficult Customers: while the Norse and the Hung trade with the south, the Kurgans live far from civilisation and are not welcome there — -1 penalty on rarity rolls when searching for rare items, except for Chaos Great Axes and Barbed Whips (for reference only, apply on your tabletop).',
      },
      hungs: {
        nom: 'Hung',
        texte:
          'Faithlessness: the tribal loyalty of these nomads is weak at best — the maximum number of warriors in the warband is reduced to 12 (instead of 15). Affinity with horses: warhorses always cost the warband 40 gc, even outside of warband creation (for reference only, not automated in the shop); all Heroes (including promoted Henchmen) automatically gain the Ride – Warhorse skill.',
      },
    },
    profils: {
      chef: {
        nom: 'Marauder Chief',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any model within 6" may use his Leadership for their tests.' },
        ],
      },
      devin: {
        nom: 'Wise One',
        regles_speciales: [
          {
            nom: 'Sorcerer',
            texte: 'Uses the Rituals of Chaos (or the rituals associated with his Mark, see the Marks of the Dark Gods special rule).',
          },
          {
            nom: 'Mark of the Dark Gods',
            texte:
              "Receives a Mark of choice at recruitment: Mark of the Serpent (Shornaal), of the Raven (Onogal), of the Hound (Arkhar), of the Eagle (Tchar), or the Mark of Chaos Undivided.",
          },
        ],
      },
      champion: { nom: 'Champion' },
      damne: {
        nom: 'Doomed One',
        regles_speciales: [
          {
            nom: 'Inconstancy',
            texte:
              'WS, S, T, and A are variable characteristics (D6, D6, D6, and D3 respectively), determined when needed, once per turn — the 0 value shown above is only a placeholder. Each possible increase to a variable characteristic is determined by a die roll (D3 or D6) that the player may lock in if satisfied, or leave variable otherwise (losing the increase). The Marauders\' normal maximums may be exceeded due to his unique nature.',
          },
          { nom: 'Fear', texte: 'Causes Fear.' },
          {
            nom: 'Fate',
            texte:
              'Once all variable characteristics are locked in, uses weapons/armour/items normally. If he reaches 90 experience points while still having variable characteristics, he becomes a Chaos Spawn (or leaves the warband to wander the wastes if it already has one).',
          },
          { nom: 'Equipment', texte: 'Uses no equipment but fights without penalty (see Fate).' },
        ],
      },
      maraudeur: {
        nom: 'Marauder',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' }],
      },
      chien_du_chaos: {
        nom: 'Chaos Hound',
        regles_speciales: [
          { nom: 'Animals', texte: 'Never gains experience.' },
          { nom: 'Recruitment', texte: 'Unlimited for a Kurgan tribe warband (see the Tribes special rule), otherwise maximum 5.' },
          { nom: 'Equipment', texte: 'No weapons or armour; fights without penalty thanks to its fangs.' },
        ],
      },
      enfant_du_chaos: {
        nom: 'Chaos Spawn',
        regles_speciales: [
          {
            nom: 'Special Movement',
            texte:
              'Moves 2D6" in a straight line (direction set by the player before rolling) each Movement phase, instead of the M value above (placeholder); does not double this movement for a charge, but contact with a model counts as a charge and engages combat.',
          },
          {
            nom: 'Special Attack',
            texte:
              'The number of Attacks (D6+1, instead of the A value above which is only a placeholder) is determined by a roll at the start of each hand-to-hand combat phase.',
          },
          { nom: 'Fear', texte: 'Causes Fear.' },
          { nom: 'Psychology', texte: 'A stupid creature, automatically passes all Leadership tests.' },
          { nom: 'No Brain', texte: 'Never gains experience.' },
          { nom: 'Large Target', texte: 'Counted as a Large Target under the Shooting rules.' },
          { nom: 'Equipment', texte: 'None! Uses claws, tentacles, and other appendages.' },
        ],
      },
      chien_de_guerre: {
        nom: 'War Dog',
        regles_speciales: [
          {
            nom: 'Fighting Dog',
            texte: 'Fights exactly like a warband member, although it is part of the equipment of the Hero who bought it. A model is needed to represent it on the battlefield.',
          },
          { nom: 'Never gains experience', texte: 'A war dog stays at the same level throughout its career.' },
          { nom: 'Recovery', texte: 'If taken Out of Action: 1-2 Dead, 3-6 Alive (as a Henchman).' },
          {
            nom: 'Versatile profile',
            texte: 'Can be used to represent more exotic animals (a trained bear, a Chaos familiar, a Southlands fighting monkey...).',
          },
        ],
      },
    },
    competences_speciales: {
      mutant: {
        nom: 'Mutant',
        texte:
          'Allows purchasing a mutation (see the Mutation Table special rule). Heroes with the Mark of Onogal may choose a Blessing of Nurgle instead (see the Blessings of Nurgle special rule). Unlike other skills, it may be chosen multiple times.',
      },
      corps_tatoue: {
        nom: 'Tattooed Body',
        reserve_a: 'Warband Leader only',
        texte: 'Lowers the trigger threshold of Eye of the Dark Gods to 10+ (11+ for a Norse Leader) instead of 12+.',
      },
      courage_du_guerrier: {
        nom: "Warrior's Courage",
        reserve_a: 'Warband Leader only',
        texte: 'May re-roll any failed Rout test and is immune to Fear as well as to All Alone.',
      },
      balayage: {
        nom: 'Sweeping Blow',
        texte: 'Requires the Strongman skill. Each Out of Action result caused with a two-handed weapon grants an immediate extra attack against another model in base contact.',
      },
      choisi_par_le_chaos: {
        nom: 'Chosen by Chaos',
        texte: 'The Hero joins the ranks of the Chaos Warriors: he uses their maximum profile (see caracteristiques_max) and the Heroes\' equipment list (if not already the case).',
      },
    },
    equipement: {
      heros: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, 'see special weapons', undefined, undefined],
      },
      hommes_de_main: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined],
        armes_tir: ['counted as throwing knives'],
      },
    },
    magie: {
      nom: 'Rituals of Chaos',
      type: 'sorcery',
      note:
        'Base table used by a Wise One with no Mark, or with the Mark of Chaos Undivided. A Wise One marked by Shornaal, Tchar, or Onogal instead uses the rituals specific to his Mark (chosen at recruitment — see marks). A Wise One marked by Arkhar becomes a Blood Father and no longer casts spells.',
      sorts: [
        {
          nom: 'Vision of Horror',
          texte: 'Range 6" against the nearest enemy (or a target in contact if the Wise One is engaged); the victim is immediately Stunned, or Knocked Down if it cannot be Stunned.',
        },
        {
          nom: 'Divine Eye',
          texte: 'Once per battle. Choose a model within 6", friend or foe, and roll 1D6: 1 = immediate Out of Action (no Serious Injury roll); 2-5 = +1 to a characteristic of choice for the battle; 6 = +1 to all characteristics for the battle.',
        },
        {
          nom: 'Black Blood',
          texte: 'Range 8", D3 Strength 5 hits on the first model in the path; the Wise One must then roll on the Injury table for his own wound (an Out of Action result is treated as Stunned).',
        },
        {
          nom: 'Temptation of Chaos',
          texte: 'Range 12" against the nearest enemy; compares 1D6+Ld of the Wise One against 1D6+Ld of the target. If the Wise One wins, he takes control of the victim until a successful Leadership test during the opponent\'s Recovery phase; it cannot commit suicide but may attack its own side, without fighting the Wise One\'s warband.',
        },
        {
          nom: 'Dark Wings',
          texte: 'The Wise One immediately moves anywhere within 12", even into contact (which then counts as a charge); against a fleeing enemy, inflicts an automatic hit, and if it survives, it flees again.',
        },
        {
          nom: 'Word of Suffering',
          texte: 'All models within 3" of the Wise One, friend or foe, suffer a Strength 3 hit with no armour save.',
        },
      ],
    },
    marques: {
      arkhar: {
        nom: 'Mark of Arkhar the Hound',
        texte: 'The Wise One becomes a Blood Father: he no longer casts spells, but gains +1 to a characteristic of choice (Combat, S, T, or I, once each) each time he takes an enemy Out of Action (Leadership test required), and gains access to Strength skills in addition to his normal list.',
      },
      shornaal: {
        nom: 'Mark of Shornaal the Serpent',
        texte: "Uses the Rituals of Shornaal. May brew a strong drink for the warband (like Bugman's Ale, not for sale) instead of searching for rare items, provided he was not taken Out of Action.",
      },
      tchar: {
        nom: 'Mark of Tchar the Eagle',
        texte: 'Uses the Rituals of Tchar. Starts with two spells from the Rituals of Tchar (one chosen freely, one determined randomly — the second spell is not automated here, roll on your tabletop).',
      },
      onogal: {
        nom: 'Mark of Onogal the Raven',
        texte: 'Uses the Rituals of Onogal and benefits from immunity to poisons.',
      },
      chaos_universel: {
        nom: 'Mark of Chaos Undivided',
        texte: 'Uses the standard Rituals of Chaos. Allows the warband to include 0 to 3 Gors (see Beastmen Raiders), counting towards the maximum warband size.',
      },
    },
    magie_variantes: {
      shornaal: {
        nom: 'Rituals of Shornaal',
        type: 'sorcery',
        sorts: [
          {
            nom: 'Delicious Suffering',
            texte: 'All models (friend and foe, except the Wise One) within 3" must pass a Leadership test or be Knocked Down.',
          },
          {
            nom: "Serpent's Dance",
            texte: "All enemy models that are not Immune to Psychology suffer a -1 penalty to hit the Wise One in hand-to-hand combat. The Dance lasts until the start of the Wise One's next Shooting phase.",
          },
          {
            nom: 'Endless Torment',
            texte: 'Choose an enemy model within 8". From now on, it must make a -1 Injury roll after its Recovery phase. As long as the torment lasts, the Wise One can do nothing else but end the spell, at the start of his turn. If he is attacked in hand-to-hand combat, he is hit automatically and the spell is broken.',
          },
          {
            nom: 'Consternation',
            texte: 'Choose an enemy model within 8". Its Initiative is reduced to 1 and it will always strike last in hand-to-hand combat, even if it charges or is armed with a spear while itself charged. Lasts until the target passes a Leadership test during the Recovery phase.',
          },
          {
            nom: 'A Thousand Voices',
            texte: 'Choose an enemy model within 12". It reduces its Leadership by D3+1 (minimum 2) if it is not Immune to Psychology. It must pass a Leadership test at the start of its turn to end the spell; the spell also breaks if the Wise One suffers a wound. Can only affect one model at a time.',
          },
          {
            nom: 'Temptation of Shornaal',
            texte: 'Choose an enemy model within 8" that is not Immune to Psychology. It must pass a Leadership test, or the Wise One takes control of the target (control may be regained with a Leadership test at Recovery). Can only target one model at a time; if the Wise One is hit in hand-to-hand combat or by shooting, he must pass a Leadership test for the spell not to end.',
          },
        ],
      },
      tchar: {
        nom: 'Rituals of Tchar',
        type: 'sorcery',
        sorts: [
          {
            nom: 'Blessing of Tchar',
            texte: 'To be used before the game, once only. The Wise One may not cast spells during the battle that follows. After the game, he gains D3 experience points if he was not taken Out of Action.',
          },
          { nom: 'Dispel Magic', texte: 'The Wise One ends all active spell effects.' },
          {
            nom: 'Clairvoyance',
            texte: 'To be used before the game, once only. Choose a warband; one of its Heroes, determined randomly, cannot take part in the current game. Models capable of casting spells or prayers are immune to this effect.',
          },
          {
            nom: 'Wrath of the Great Eagle',
            texte: 'Choose an enemy model within 12". It is hit by an attack with a Strength equal to the difference in experience points between the Wise One and the target (max 10), normal armour save. If the victim has more XP than the Wise One, the Wise One is hit instead.',
          },
          {
            nom: 'Reward of Tchar',
            texte: "The Wise One gains +1 to any characteristic for every 10 experience points earned (each only once by this means). Lasts until the end of the Wise One's next Shooting phase, after which the spell may be discarded.",
          },
          {
            nom: 'Slave of Chaos',
            texte: 'Range 12", Strength 2 hit with no armour save. If the model is taken Out of Action, roll immediately on the Serious Injury table; if it dies, it is replaced by a Pink Horror of Tzeentch until the end of the game, under the Wise One\'s control (see Daemonic Bestiary). If the Wise One is Stunned or taken Out of Action, the Horror vanishes into the Realm of Chaos.',
          },
        ],
      },
      onogal: {
        nom: 'Rituals of Onogal',
        type: 'sorcery',
        sorts: [
          {
            nom: 'Touch of Onogal',
            texte: "Against an opponent in base contact. If the model is taken Out of Action during the following combat phase, roll immediately on the Serious Injury table; if it dies, it is replaced by a Plaguebearer of Nurgle until the end of the game, under the Wise One's control (see Daemonic Bestiary). If the Wise One is Stunned or taken Out of Action, the Plaguebearer vanishes into the Realm of Chaos.",
          },
          {
            nom: 'Buboes',
            texte: 'Range 8" against an enemy warrior. He must pass a Toughness test or lose 1 Wound; no armour save allowed.',
          },
          {
            nom: 'Nurgling Miasma',
            texte: 'Range 6", affects all living creatures, friend or foe. Any warrior within range must pass a Toughness test or lose 1 Attack for the rest of the turn.',
          },
          {
            nom: 'Pestilence',
            texte: 'Any enemy model within 12" of the Wise One suffers a Strength 3 hit, with no armour save.',
          },
          {
            nom: 'Warty Skin',
            texte: 'The Wise One gains a 2+ armour save that replaces his current save. Lasts until the start of his next Shooting phase.',
          },
          {
            nom: "Nurgle's Rot",
            texte: "Any enemy model in contact with the Wise One must immediately pass a Toughness test or catch Nurgle's Rot (an incurable disease: at the start of each following battle, a Toughness test or lose 1 permanent point of Toughness, death if Toughness reaches 0; on a 6 on the Toughness roll, it is involuntarily transmitted to another warband member).",
          },
        ],
      },
    },
  },
  gobelins_des_forets: {
    nom: 'Forest Goblins (1b)',
    regles_speciales: [
      {
        nom: 'Natives',
        texte: 'Used to moving through the undergrowth, Forest Goblins suffer no Movement penalty when moving through wooded terrain.',
      },
      {
        nom: 'Animosity',
        texte:
          "At the start of each Goblin player's turn, roll 1D6 for each Brave or Goblin Henchman not engaged in hand-to-hand combat. On a result of 1, roll 1D6 on the following table: 1 \"Say that again, I dare ya!\" — the fighter immediately charges the nearest friendly Goblin Henchman or Hired Sword within charge range (or shoots them if none are in range and he is equipped with a missile weapon; otherwise, treat as a 2-5 result). 2-5 \"Wot did 'e say?\" — the fighter grumbles at everyone and does nothing else this turn (he still defends himself normally in hand-to-hand combat). 6 \"I'll show 'em!\" — the fighter must advance as fast as possible towards the nearest enemy and charge if possible. For reference only, not automated.",
      },
    ],
    profils: {
      gran_chef: {
        nom: 'Big Boss',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warband member within 6" of the Big Boss may use his Leadership for their tests.' },
          {
            nom: 'Spider Rider',
            texte: 'The Big Boss may ride Giant Spiders or the Gigantic Spider using the rules detailed in the Mounted Warriors article.',
          },
        ],
      },
      chaman: {
        nom: 'Forest Goblin Shaman',
        regles_speciales: [
          { nom: 'Sorcerer', texte: 'The Shaman starts with a spell randomly drawn from the Goblin Magic spell list.' },
        ],
      },
      brav: {
        nom: 'Brave',
        regles_speciales: [
          { nom: 'Animosity', texte: 'Braves are subject to the Animosity rules. A Brave may choose to remove his animosity instead of choosing a Special skill.' },
        ],
      },
      gobelin_des_forets: {
        nom: 'Forest Goblin',
        regles_speciales: [{ nom: 'Animosity', texte: 'Forest Goblins are subject to the Animosity rules.' }],
      },
      gobelin_dent_rouj: {
        nom: 'Redfang Goblin',
        regles_speciales: [
          {
            nom: 'Berserkers',
            texte: 'Redfang Goblins are subject to Frenzy. In addition, if they start their turn within charge range of an enemy, they are immune to Animosity for that turn.',
          },
          { nom: 'Animosity', texte: 'Redfang Goblins are subject to the Animosity rules.' },
        ],
      },
      lanceur: {
        nom: 'Thrower',
        regles_speciales: [
          {
            nom: 'Throwers',
            texte: 'During the Shooting phase, Throwers may throw missile weapons up to three times per turn. If a Thrower is promoted to Hero, this ability cannot be used together with Quick Shot.',
          },
          { nom: 'Animosity', texte: 'Throwers are subject to the Animosity rules.' },
        ],
      },
      araignee_gigantesque: {
        nom: 'Gigantic Spider',
        regles_speciales: [
          { nom: 'Weapons/armour', texte: 'A Gigantic Spider needs no weapons or armour and uses none.' },
          { nom: 'Fear', texte: 'Gigantic Spiders cause Fear.' },
          { nom: 'Huge Beast', texte: 'Gigantic Spiders are Large Targets as defined in the Shooting rules.' },
          { nom: 'Native', texte: 'They move through any wooded terrain without any penalty.' },
          {
            nom: 'Venomous',
            texte: 'When it causes a Wound, use the following table: 1 Knocked Down; 2-4 Stunned; 5-6 Out of Action.',
          },
          { nom: 'Natives', texte: 'No Movement penalty in wooded terrain.' },
          { nom: 'Non-sentient', texte: 'Subject to the Stupidity rules. Never gains experience. May climb normally.' },
          {
            nom: 'Mount',
            texte:
              'The Forest Goblin Big Boss may ride it (see the Mounted Warriors article). If a shooting attack hits, roll 1D6: 1-2 the Big Boss is hit, 3-6 the Gigantic Spider is hit. In hand-to-hand combat, the opponent chooses his target. While ridden, it is not subject to Stupidity.',
          },
        ],
      },
    },
    equipement: {
      heros: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined],
      },
      hommes_de_main: {
        armes_cac: ['first free', undefined, undefined],
      },
    },
    magie: {
      nom: 'Goblin Magic',
      type: 'sorcery',
      sorts: [
        {
          nom: "Gork's Wind",
          texte: 'Range 12"; the first model hit must pass a Toughness test or suffer a Strength 2 hit and be automatically Knocked Down.',
        },
        { nom: "Mork's Gaze", texte: 'Range 12"; D3 Strength 3 hits on the first model in the path.' },
        {
          nom: "'Ead-Seeker",
          texte:
            "Range 6\"; fires a number of bolts equal to the Shaman's base Attacks, Strength equal to his Toughness, hitting the first model in the path. On a 1 after resolving, the Shaman collapses and is taken Out of Action.",
        },
        {
          nom: 'Waaagh! Leap',
          texte: 'The Shaman or a Goblin within 3" may be moved up to 12", ignoring terrain; if this brings him into hand-to-hand combat, it counts as a charge.',
        },
        { nom: 'Idol of Gork', texte: 'The Shaman gains WS+1, S+1, and A+1 until he suffers a Wound.' },
        {
          nom: "'Ere We Go!",
          texte: 'Allied models within 6" of the Shaman treat Stunned results as Knocked Down, until the Shaman suffers a Wound.',
        },
      ],
    },
  },
  artilleurs_de_nuln: {
    nom: 'Nuln Gunners (1b)',
    regles_speciales: [
      {
        nom: 'Impeccable Maintenance',
        texte: 'Nuln Gunners always use the reduced cost for black powder weapons listed in their equipment list, and gain a +2 bonus on rarity rolls to find a black powder weapon.',
      },
      {
        nom: 'Good Practice',
        texte: 'If you use the Shooting Mishaps rules, a result of 1 to hit is followed by a re-roll: on a 3+, the shot simply misses (the weapon does not explode).',
      },
      {
        nom: 'Proud Gunner!',
        texte: 'Nuln Gunners never use missile weapons that do not run on black powder. This restriction does not apply to Hired Swords or Dramatis Personae hired by the warband.',
      },
    ],
    profils: {
      officier_superieur_dartillerie: {
        nom: 'Senior Gunnery Officer',
        regles_speciales: [
          {
            nom: 'Leader',
            texte: 'Any warband member within 12" of the Senior Gunnery Officer may use his Leadership for their tests.',
          },
          {
            nom: 'Hunter',
            texte:
              'Perfectly trained to load and prime his weapon, he may shoot every turn even with a blunderbuss or a Hochland long rifle (identical to the Sharpshooter shooting skill; grants no additional effect if learned again).',
          },
        ],
      },
      instructeur: {
        nom: 'Instructor',
        regles_speciales: [
          {
            nom: 'Weapons Expert',
            texte: 'As long as an Instructor is present in the warband, all pistol-type weapons gain a +3" bonus to range and all other black powder weapons gain a +6" bonus.',
          },
        ],
      },
      aspirant: { nom: 'Aspirant' },
      cadets: { nom: 'Cadets' },
      pupille_de_nuln: { nom: 'Nuln Pupil' },
      tireur_delite: {
        nom: 'Marksman',
        regles_speciales: [
          {
            nom: 'Hunter',
            texte:
              'Perfectly trained to load and prime his weapon, he may shoot every turn even with a blunderbuss or a Hochland long rifle (identical to the Sharpshooter shooting skill; grants no additional effect if he becomes a Hero and learns it again).',
          },
        ],
      },
      pistolier: {
        nom: 'Pistolier',
        regles_speciales: [
          {
            nom: 'Quick Draw',
            texte:
              'In the first round of any hand-to-hand combat, if using pistols in combat, may re-roll failed to-hit rolls with pistols (the re-roll result must be accepted; a re-roll cannot be re-rolled).',
          },
        ],
      },
      chien_de_guerre: {
        nom: 'War Dog',
        regles_speciales: [
          {
            nom: 'Fighting Dog',
            texte: 'Fights exactly like a warband member, although it is part of the equipment of the Hero who bought it. A model is needed to represent it on the battlefield.',
          },
          { nom: 'Never gains experience', texte: 'A war dog stays at the same level throughout its career.' },
          { nom: 'Recovery', texte: 'If taken Out of Action: 1-2 Dead, 3-6 Alive (as a Henchman).' },
          {
            nom: 'Versatile profile',
            texte: 'Can be used to represent more exotic animals (a trained bear, a Chaos familiar, a Southlands fighting monkey...).',
          },
        ],
      },
    },
    equipement: {
      artilleurs_de_nuln: {
        armes_cac: ['first free', 'Mace or Hammer', undefined, undefined, undefined, undefined, undefined, undefined],
        armes_tir: ['20gc per pair', '35gc per pair', '35gc per pair', '65gc per pair', undefined, undefined],
      },
      tireurs_delite: {
        armes_cac: ['first free', 'Mace or Hammer', undefined, undefined],
        armes_tir: ['20gc per pair', '35gc per pair', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
      },
      montures_nuln: {
        divers: [
          'Mount — see the Mounted Warriors article',
          'Mount — see the Mounted Warriors article',
          'Mount — see the Mounted Warriors article',
        ],
      },
    },
  },
  skaven: {
    nom: 'Skaven (1a)',
    profils: {
      adepte_assassin: {
        nom: 'Assassin Adept',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warrior within 6" of an Assassin Adept may use his Leadership.' },
          {
            nom: 'Killing Machine',
            texte: "An Assassin Adept always inflicts a -1 penalty to the enemy's armour save when he wounds (in shooting or hand-to-hand combat).",
          },
        ],
      },
      skaven_noir: { nom: 'Black Skaven' },
      sorcier_eshin: {
        nom: 'Eshin Sorcerer',
        regles_speciales: [
          { nom: 'Sorcerer', texte: 'An Eshin Sorcerer is a spellcaster who uses the Magic of the Horned Rat (see Magic).' },
        ],
      },
      coureur_nocturne: { nom: 'Night Runner' },
      vermineux: {
        nom: 'Verminkin',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' }],
      },
      rat_geant: {
        nom: 'Giant Rat',
        regles_speciales: [
          { nom: 'Numbers', texte: 'You may recruit as many Giant Rats as you wish. Bought in groups of 1 to 5.' },
          { nom: 'Experience', texte: 'Giant Rats are animals and therefore do not gain experience.' },
          { nom: 'Equipment', texte: 'None. Giant Rats carry no weapons or armour.' },
        ],
      },
      rat_ogre: {
        nom: 'Rat Ogre',
        regles_speciales: [
          { nom: 'Fear', texte: 'Rat Ogres cause Fear.' },
          { nom: 'Stupidity', texte: 'A Rat Ogre is subject to Stupidity, unless a Skaven Hero is within 6".' },
          { nom: 'Experience', texte: 'Rat Ogres do not gain experience.' },
          {
            nom: 'Large Target',
            texte: 'Rat Ogres are huge creatures that make good targets for archers; they are Large Targets, as defined in the Shooting rules.',
          },
          { nom: 'Equipment', texte: 'Fangs, claws, and raw strength! Rat Ogres never use weapons or armour.' },
        ],
      },
    },
    competences_speciales: {
      frenesie_mortelle: {
        nom: 'Deadly Frenzy',
        texte:
          'The Skaven Hero may declare at the start of a turn that he is using this skill: he gains +1 Attack and 1D3" of Movement for the whole turn, but suffers 1D3 Strength 3 hits with no armour save allowed at the end of the turn.',
      },
      queue_de_combat: {
        nom: 'Fighting Tail',
        texte: 'The Skaven may use a shield, sword, or dagger with his tail: an extra Attack with the appropriate weapon, or a +1 bonus to armour save.',
      },
      grimpeur_ne: {
        nom: 'Born Climber',
        texte: 'The Skaven does not need to make an Initiative test when climbing a wall or steep surface.',
      },
      infiltration: {
        nom: 'Infiltration',
        texte:
          'A Skaven with this skill is always placed on the battlefield after the opposing warband has deployed; he may be placed anywhere out of enemy line of sight and more than 12" from any enemy model. If both players have infiltrating models, roll 1D6; the lower result deploys first.',
      },
      art_de_la_mort_silencieuse: {
        nom: 'Art of Silent Death',
        texte:
          'In hand-to-hand combat, the Skaven may fight bare-handed without penalty and counts as having two weapons (+1 Attack). A Skaven Hero with this skill scores a Critical Hit on a to-wound roll of 5-6 instead of 6 (unless he can only wound his target on a 5+, in which case the critical remains on a 6). Usable with combat claws (+2 Attacks instead of +1).',
      },
    },
    equipement: {
      heros_skavens: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined],
        armes_tir: [undefined, undefined, undefined, '70gc per pair'],
      },
      hommes_de_main_skavens: {
        armes_cac: ['first free', undefined, undefined, undefined],
      },
    },
    magie: {
      nom: 'Magic of the Horned Rat',
      type: 'sorcery',
      note: 'This sinister form of sorcery used by the skaven comes from their god, an infamous daemonic deity known as the Horned Rat.',
      sorts: [
        {
          nom: 'Warpfire',
          texte: 'Range 8", hits the first model in its path: D3 Strength 4 hits on the victim and a Strength 3 hit on every model within 2" of it.',
        },
        {
          nom: 'Spawn of the Horned Rat',
          texte: "Usable once before each game. Summons D3 Giant Rats placed within 6\" of the sorcerer; these rats do not count towards the warband's maximum model count.",
        },
        { nom: 'Fleshgnaw', texte: 'Causes 2D6 Strength 1 hits on a single model within 8" of the sorcerer.' },
        {
          nom: 'Black Fury',
          texte: 'The sorcerer may immediately charge an enemy model of his choice within 12" (ignoring terrain and other models). He gains 2 extra Attacks and +1 Strength during the hand-to-hand combat phase of this turn only.',
        },
        {
          nom: 'Eye of the Warp',
          texte: 'All standing models in contact with the sorcerer must immediately make a Leadership test. Those who fail suffer a Strength 3 hit and must run 2D6" in the direction opposite the sorcerer.',
        },
        {
          nom: "Sorcerer's Curse",
          texte: 'Affects a model within 12": it must re-roll any successful to-hit roll or armour save during the following Skaven hand-to-hand combat phase, as well as during the shooting and hand-to-hand combat phases of its next turn.',
        },
      ],
    },
  },
  expedition_runique: {
    nom: 'Runic Expedition (1b)',
    regles_speciales: [
      {
        nom: 'Hard to Kill',
        texte:
          'Dwarfs are very tough and resilient. They can therefore only be taken Out of Action on a roll of 6 instead of 5-6 on the Injury table. Treat a roll of 1-2 as Knocked Down, 3-5 as Stunned, and 6 as Out of Action.',
      },
      { nom: 'Hard Head', texte: 'Dwarfs ignore the special rules of maces, hammers, etc. They are not easy to knock silly!' },
      { nom: 'Armour', texte: 'Dwarfs suffer no Movement penalty for wearing armour.' },
      {
        nom: 'Hatred of Orcs and Goblins',
        texte: 'All Dwarfs hate Orcs and Goblins. See the Psychology section of the Mordheim rules for the effects of Hatred.',
      },
      {
        nom: 'Grudge-Bearers',
        texte: 'Dwarfs hold an old grudge against elves dating back to when the two races vied for supremacy over the Old World. A Dwarf warband may never include any Elf Hired Sword, whoever they are.',
      },
      {
        nom: 'Miners Without Equal',
        texte: 'Dwarfs spend their lives underground searching for precious ore and are the best miners in the Old World. Add +1 to the number of Treasures found when rolling to determine the amount of Treasure at the end of the game.',
      },
      {
        nom: 'Suspicious',
        texte:
          'Runic Expeditions are detached from other Dwarf warbands in multiplayer games. Their outlooks are so different that they will never trust one another. Members of a Runic Expedition are never considered allied combatants to one another, and vice versa. This means that members of one warband will stop the charge of another, cannot support each other in an All Alone test, etc. They are not considered enemies, however, and can therefore share Exploration loot at the end of the battle as usual. However, the two warbands will never be friends, make no mistake about that.',
      },
    ],
    profils: {
      forgerune: {
        nom: 'Runesmith',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any model within 6" of the Runesmith may use his Leadership for their tests.' },
          {
            nom: 'Rune Engraver',
            texte:
              'A Runesmith knows one Minor Rune (see Dwarf Runes, an article not detailed here). It is determined randomly when the warband is created. He may inscribe a Rune on a single item carried by a warband member and, if successful, the item gains a bonus for the duration of the game. When a Runesmith advances and gains a skill, he may choose to learn a new Rune instead of a new skill.',
          },
        ],
      },
      apprenti_forgerune: {
        nom: "Runesmith's Apprentice",
        regles_speciales: [
          {
            nom: 'An Extra Pair of Hands',
            texte:
              "A Runesmith's Apprentice helps his master inscribe runes. He also does all the dirty work so the Runesmith can work more efficiently. If the warband includes a Runesmith's Apprentice, the Runesmith may inscribe the Rune on two items instead of one before each battle.",
          },
        ],
      },
      tueur_de_trolls: {
        nom: 'Troll Slayer',
        regles_speciales: [
          {
            nom: 'Death Wish',
            texte: 'Troll Slayers seek an honourable death. They are completely Immune to Psychology and will never take an All Alone test.',
          },
          {
            nom: 'Slayer Skills',
            texte: 'When they gain a new skill, Troll Slayers may choose one of the skills specific to them (see special skills).',
          },
          { nom: 'Restrictions', texte: 'Slayers may never be equipped with missile weapons or any form of armour.' },
        ],
      },
      longues_barbes: {
        nom: 'Longbeards',
        regles_speciales: [
          {
            nom: 'Tenacious',
            texte:
              "Longbeards have seen it all over the course of their long careers, and they know it. They are used to fighting alone against overwhelming odds and have always survived. Moreover, they are better prepared than most and certainly won't be discouraged by a bunch of scrawny Goblins. Longbeards may therefore re-roll all failed Leadership tests. Remember that a re-roll cannot be re-rolled and you must always accept the second result.",
          },
        ],
      },
      arbaletrier_nain: { nom: 'Dwarf Crossbowman' },
      poil_au_menton: { nom: 'Chinbeard' },
      guerrier_des_clans: { nom: 'Clan Warrior' },
    },
    competences_speciales: {
      maitre_des_lames: {
        nom: 'Blademaster',
        reserve_a: 'Runic Expedition Heroes only',
        texte:
          'This Dwarf is a supremely gifted fighter who has effortlessly faced hordes of Orcs and Goblins. When using a weapon with the Parry special rule, he may parry a blow by rolling equal to or higher than the best enemy to-hit roll, instead of strictly higher. Furthermore, if this fighter wields two weapons with the Parry special rule, he may parry two attacks (if both his results are equal to or higher than the two best enemy to-hit rolls) instead of just one. Note that if he wields two Dwarf axes, he may re-roll failed parry rolls.',
      },
      prospecteur: {
        nom: 'Prospector',
        reserve_a: 'Runic Expedition Heroes only',
        texte: 'This Dwarf is particularly skilled at finding valuable items. When he rolls on the Exploration table at the end of the game, the Hero may modify one die roll by +1/-1.',
      },
      tres_coriace: {
        nom: 'Extremely Tough',
        reserve_a: 'Runic Expedition Heroes only',
        texte: 'Dwarfs are sturdy creatures, and this Hero is determined, even for a Dwarf! On the Injury table, a roll of 1-3 is treated as Knocked Down, 4-5 as Stunned, and 6 as Out of Action.',
      },
      crane_epais: {
        nom: 'Thick Skull',
        reserve_a: 'Runic Expedition Heroes only',
        texte:
          "The Hero has a special 3+ save to avoid being Stunned. If the save is successful, the Hero is treated as Knocked Down instead. If the Dwarf also wears a helmet, this save is 2+ instead of 3+ (which replaces the helmet's usual special rule).",
      },
      increvable: {
        nom: 'Unstoppable',
        reserve_a: 'Runic Expedition Heroes only',
        texte:
          'This Dwarf is famous for surviving wounds that would have felled a less hardy individual. After a game in which this Hero was taken Out of Action, when you roll on the Serious Injury table, the dice may be re-rolled once. The result of this second roll must be accepted, even if the consequences are worse.',
      },
      charge_furieuse_tueur: {
        nom: 'Furious Charge',
        reserve_a: 'Troll Slayers only',
        texte: 'The Troll Slayer may double his Attacks in the turn he charges. However, he suffers a -1 penalty to hit during that turn.',
      },
      tueur_de_monstres: {
        nom: 'Monster Slayer',
        reserve_a: 'Troll Slayers only',
        texte: 'The Troll Slayer always Wounds his opponents on a 4+ on 1D6, regardless of Toughness, unless his own Strength (with weapon modifiers) allows him to wound more easily.',
      },
      berserk_tueur: {
        nom: 'Berserk',
        reserve_a: 'Troll Slayers only',
        texte: 'The Troll Slayer adds +1 to his to-hit rolls during the turn he charges.',
      },
    },
    equipement: {
      guerriers_nains: {
        armes_cac: ['first free', 'Hammer or Mace', undefined, undefined, undefined, undefined, undefined, undefined],
        armes_tir: ['30gc per pair'],
        armures: [undefined, undefined, 'reduced price for a starting warband', undefined, undefined],
      },
      arbaletriers: {
        armes_cac: ['first free', 'Hammer or Mace', undefined, undefined],
      },
    },
  },
  amazones_mordheim: {
    nom: 'Amazons — Mordheim Setting (1b)',
    regles_speciales: [
      {
        nom: 'Sacrifice',
        texte: 'Amazons are quick to offer their prisoners as sacrifices to their gods. Amazons follow the rules for the Possessed in the rulebook regarding captives.',
      },
      {
        nom: 'She Is Not One of Us',
        texte: 'Due to their independence and suspicion of other races, Amazons never ally with anyone. For this reason, they may not recruit Hired Swords or special characters, unless they are Amazons themselves.',
      },
    ],
    profils: {
      pretresse: {
        nom: 'Priestess',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warband model within 6" of the Priestess may use her Leadership.' },
          {
            nom: 'Witch',
            texte: 'The Priestess is a Witch who uses the Amazon Rituals. She starts with one ritual chosen randomly from the list.',
          },
        ],
      },
      championne: {
        nom: 'Champion',
        regles_speciales: [
          {
            nom: 'Lieutenants',
            texte: "Champions have taken part in dozens of campaigns over the years. They are the Priestesses' lieutenants, as well as their bodyguards. They are skilled with a variety of weapons, including the legendary Claws of the Ancients.",
          },
        ],
      },
      guerriere_totem: {
        nom: 'Totem Warrior',
        regles_speciales: [
          {
            nom: 'Frenzy',
            texte: 'Totem Warriors are frenzied fighters, thirsty for blood. They are also thoroughly intoxicated by the potions brewed by their sisters. Totem Warriors are killing machines that care little for their own survival. They are subject to Frenzy.',
          },
        ],
      },
      guerriere_amazone_mordheim: { nom: 'Amazon Warrior' },
      scout: {
        nom: 'Scout',
        regles_speciales: [
          { nom: 'Stealthy', texte: 'A Scout may deploy twice as far onto the battlefield as other warriors and may start the battle hidden.' },
        ],
      },
    },
    equipement: {
      heroines: {
        armes_cac: ['first free', 'Club', undefined, undefined, 'Claw of the Ancients'],
        armures: ['Helmet', undefined],
        divers: ['Amulet of the Moon', 'Medicinal Herbs'],
      },
      femmes_de_main: {
        armes_cac: ['first free', 'Club', undefined, undefined],
        armures: ['Helmet', undefined],
      },
      scouts: {
        armes_cac: ['first free', 'Club', undefined, undefined],
        armures: ['Helmet', undefined],
      },
    },
    magie: {
      nom: 'Amazon Rituals',
      type: 'sorcery',
      note: 'Little is known about Amazon magic, but it is said that these immortal warriors learned it from the mouths of the gods themselves.',
      sorts: [
        {
          nom: 'Song of the Wind',
          texte:
            'The Priestess calls upon the Wind Goddess Shaekal to join the battle. The goddess appears as dancing notes of music and light that entrance an enemy model within 10" of the caster. Until the start of the Amazons\' next turn, the model cannot move, shoot, or cast spells, but may defend itself in hand-to-hand combat. Models affected by this ritual always act last in the combat phase.',
        },
        {
          nom: 'Strength of the Serpent',
          texte:
            'The Priestess performs this ritual by dancing wildly and shouting forgotten words. All friendly models near the Priestess are filled with powerful energy until the end of their next turn. During this time, any model within 8" of the Priestess (including herself) adds +1 to Strength. The ritual cannot be cast if the Priestess is engaged in hand-to-hand combat during her Shooting phase. The effect continues after the ritual is cast if the Priestess joins a combat.',
        },
        {
          nom: "Wendala's Maelstrom",
          texte:
            "The Priestess summons violent tropical winds to protect the Amazons from enemy shooting. The storm extends within 18\" of the Priestess. Any enemy attempt to use missile weapons suffers a -1 penalty to hit. The ritual lasts until the start of the Amazon player's next turn.",
        },
        {
          nom: 'Shield of Thorns',
          texte:
            'Delicately moving her hands as if weaving the very air, the Priestess calls upon the protection of plants. This ritual creates a cocoon of thorns around the Priestess, making her immune to any shooting or magical attack. Any model wishing to charge the Priestess may do so, but the thorns cancel all hits from both the Priestess and her opponents during the first round of hand-to-hand combat. The Priestess cannot cast this ritual while engaged in hand-to-hand combat.',
        },
        {
          nom: 'Living Jungle',
          texte:
            "Focusing her will, the Priestess calls upon the aid of the jungle's creatures. Choose a model within 12\". It is suddenly assailed by a swarm of snakes, spiders, and insects, each more venomous than the last. The victim suffers 1D6 Strength 2 hits with no save allowed, other than invulnerable saves. You cannot dodge this swarm.",
        },
        {
          nom: "Siren's Dream",
          texte:
            'The Priestess intones a sweet melody in a magnificent voice, soon joined by the other Amazons. The song is so beautiful and enchanting that enemy Leadership tests within 12" suffer a -1 penalty until the end of the opposing player\'s turn. Lizardmen and Undead are immune to the effects of this ritual.',
        },
      ],
    },
  },
};

function translateRegles(regles: SpecialRule[], en: RegleTraduite[] | undefined): SpecialRule[] {
  return regles.map((r, i) => {
    const rEn = en?.[i];
    return rEn ? { ...r, nom: rEn.nom, texte: rEn.texte, exception: rEn.exception ?? r.exception } : r;
  });
}

function translateCompetences(
  competences: CompetenceSpeciale[],
  en: Record<string, CompetenceTraduite> | undefined
): CompetenceSpeciale[] {
  return competences.map((c) => {
    const cEn = en?.[c.id];
    return cEn ? { ...c, nom: cEn.nom, texte: cEn.texte, reserve_a: cEn.reserve_a ?? c.reserve_a } : c;
  });
}

function translateMagie(magie: Magie, en: MagieTraduite | undefined): Magie {
  return {
    ...magie,
    nom: en?.nom ?? magie.nom,
    type: en?.type ?? magie.type,
    note: en?.note ?? magie.note,
    sorts: magie.sorts.map((s, i) => {
      const sEn = en?.sorts?.[i];
      return sEn ? { ...s, nom: sEn.nom, texte: sEn.texte, note: sEn.note ?? s.note } : s;
    }),
  };
}

function translateRefs(refs: EquipementRef[] | undefined, notesEn: (string | undefined)[] | undefined) {
  return refs?.map((r, i) => (notesEn?.[i] ? { ...r, note: notesEn[i] } : r));
}

function translateEquipementListe(liste: EquipementListe, en: EquipementListeTraduite | undefined): EquipementListe {
  return {
    armes_cac: translateRefs(liste.armes_cac, en?.armes_cac),
    armes_tir: translateRefs(liste.armes_tir, en?.armes_tir),
    armures: translateRefs(liste.armures, en?.armures),
    divers: translateRefs(liste.divers, en?.divers),
  };
}

function translateProfil(profil: Profile, en: ProfileTraduit | undefined): Profile {
  if (!en) return profil;
  return {
    ...profil,
    nom: en.nom ?? profil.nom,
    regles_speciales: profil.regles_speciales ? translateRegles(profil.regles_speciales, en.regles_speciales) : profil.regles_speciales,
    competences_speciales: profil.competences_speciales
      ? translateCompetences(profil.competences_speciales, en.competences_speciales)
      : profil.competences_speciales,
  };
}

// Traduit un catalogue de bande complet quand la langue courante est 'en'.
// Retombe sur le texte français d'origine pièce par pièce si la bande (ou
// une partie de son contenu) n'a pas encore de traduction dans warbandsEn —
// même principe de repli progressif que translateItem/translateSkill.
export function translateWarbandCatalog(catalogue: WarbandCatalog, language: Language): WarbandCatalog {
  if (language !== 'en') return catalogue;
  const en = warbandsEn[catalogue.id];
  if (!en) return catalogue;
  return {
    ...catalogue,
    nom: en.nom ?? catalogue.nom,
    regles_speciales: translateRegles(catalogue.regles_speciales, en.regles_speciales),
    profils: catalogue.profils.map((p) => translateProfil(p, en.profils?.[p.id])),
    competences_speciales: translateCompetences(catalogue.competences_speciales, en.competences_speciales),
    magie: catalogue.magie ? translateMagie(catalogue.magie, en.magie) : catalogue.magie,
    magie_variantes: catalogue.magie_variantes
      ? Object.fromEntries(
          Object.entries(catalogue.magie_variantes).map(([k, m]) => [k, translateMagie(m, en.magie_variantes?.[k])])
        )
      : catalogue.magie_variantes,
    marques: catalogue.marques?.map((m) => {
      const mEn = en.marques?.[m.id];
      return mEn ? { ...m, nom: mEn.nom, texte: mEn.texte ?? m.texte } : m;
    }),
    tribus: catalogue.tribus?.map((tr) => {
      const trEn = en.tribus?.[tr.id];
      return trEn ? { ...tr, nom: trEn.nom, texte: trEn.texte } : tr;
    }),
    equipement: catalogue.equipement
      ? Object.fromEntries(
          Object.entries(catalogue.equipement).map(([k, liste]) => [k, translateEquipementListe(liste, en.equipement?.[k])])
        )
      : catalogue.equipement,
  };
}

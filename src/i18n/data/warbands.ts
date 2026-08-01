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
  gobelins_de_la_nuit: {
    nom: 'Night Goblins (1c)',
    regles_speciales: [
      {
        nom: 'Animosity',
        texte:
          'At the start of each Goblin player\'s turn, roll 1D6 for each Goblin Henchman not engaged in hand-to-hand combat. On a 1, the warrior gets annoyed: roll 1D6 on a dedicated table — he may charge the nearest friendly Goblin within charge range, simply rant at everyone and do nothing else, or rush towards the nearest enemy and charge it. He still defends himself normally if already engaged.',
        exception: 'Does not affect Fanatics',
      },
      {
        nom: "Masters of the Fool's Cap",
        texte:
          "Night Goblins ignore the stupidity side effect of Fool's Cap mushrooms while under the frenzy the mushrooms grant; if they are Knocked Down or Stunned, the stupidity takes effect again until the end of the battle.",
      },
      {
        nom: 'Hatred of Dwarfs',
        texte: 'Night Goblins hold a bitter hatred for Dwarfs.',
        exception: 'Only affects Night Goblins; Fanatics are not subject to it',
      },
      {
        nom: 'Fear of Elves',
        texte: 'Night Goblins are subject to fear of Elves.',
        exception: 'Only affects Night Goblins; Fanatics are not subject to it',
      },
      {
        nom: 'Unsavoury Characters',
        texte:
          'A Night Goblin warband may only hire the following Hired Swords: Gladiator, Ogre Bodyguard, Wizard, as well as any Hired Sword whose description specifically allows it.',
      },
    ],
    profils: {
      boss: {
        nom: 'Boss',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any model within 6" of the Boss may use his Leadership for their tests.' },
          {
            nom: 'Biggest of the Bosses',
            texte:
              "Only the current Boss may choose Strength skills; a Boss promoted after the previous one's death gains this right in turn, but no other warband member may access it.",
          },
        ],
      },
      chaman: {
        nom: 'Night Goblin Shaman',
        regles_speciales: [
          { nom: 'Sorcerer', texte: 'Starts with a spell randomly drawn from the Goblin Magic spell list.' },
          {
            nom: 'Mushroom Brew',
            texte:
              "Before the battle, may brew a special batch from 1 to 3 Fool's Cap mushrooms plus other harvested mushrooms, affecting a single group of Goblin warriors until the end of the battle. A roll is made on the mushroom brew table for each mushroom used; a duplicate result ruins the batch (just a headache).",
          },
        ],
      },
      berger_a_squig: {
        nom: 'Squig Herder',
        regles_speciales: [
          {
            nom: 'Handler — Squigs',
            texte: 'Any Squig within 6" (12" with a squig prodder) may use his Leadership instead of its own.',
          },
          {
            nom: 'Master Herder',
            texte:
              'During the Recovery phase, any out-of-control Cave Squig or Giant Squig within his zone of influence stops wandering and can be controlled on a successful Leadership test.',
          },
          {
            nom: 'Dedicated Skills (instead of the Special list)',
            texte:
              "Gaseous Squigs: when an untrained Cave Squig is taken Out of Action, on a 1 it explodes and hits every model within 1D6\" with a Strength 3 hit; that Squig is dead. — Menace: during the Movement phase, on a successful Leadership test, all Cave Squigs and Giant Squigs within range (6\", 12\" with a prodder) may re-roll their Movement die for that turn. — Training: the Herder may train a Squig as a personal bodyguard: it gains experience like a normal Henchman (re-rolling Lad's Got Talent results). Only one trained Squig at a time; it only dies on a 1 after being taken Out of Action and protects its fallen master under certain conditions.",
          },
        ],
      },
      zbir: { nom: 'Thug' },
      guerrier_gobelin_de_la_nuit: {
        nom: 'Night Goblin Warrior',
        regles_speciales: [
          { nom: 'Animosity', texte: 'Subject to animosity; a Goblin who becomes a Hero is no longer subject to it.' },
        ],
      },
      fanatique: {
        nom: 'Night Goblin Fanatic',
        regles_speciales: [
          {
            nom: 'Addiction',
            texte: "Needs a Fool's Cap mushroom for every game; without one, he stays in his cave and does not take part in the battle.",
          },
          { nom: 'Crazed', texte: 'Immune to the animosity rules.' },
          { nom: 'Mushroom Brain', texte: "Can never become a Hero (re-roll Lad's Got Talent results)." },
        ],
      },
      squig_des_cavernes: {
        nom: 'Cave Squig',
        regles_speciales: [
          {
            nom: 'Movement',
            texte:
              'Variable Movement of 2D6" (M cannot be represented by a single number — see this field); never runs, does not declare a normal charge but counts as having charged if it reaches base contact.',
          },
          {
            nom: 'On a Leash!',
            texte:
              "Must stay within 6\" of a Goblin; otherwise it becomes uncontrollable and moves randomly until the end of the game, unless within the Squig Herder's zone of influence.",
          },
          { nom: 'Just Squigs', texte: 'Only counts as half a model for Rout tests.' },
          { nom: 'Animals', texte: 'Never gains experience; may climb using the Climbing rules with a particularly large leap.' },
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' },
        ],
      },
      snotling: {
        nom: 'Snotling',
        regles_speciales: [
          { nom: 'Mob', texte: 'The whole group of Snotlings counts as a single model for warband size purposes.' },
          { nom: 'Puny', texte: 'Knocked Down on a 1, Stunned on 2-3, Out of Action on 4-6.' },
          { nom: 'Elusive', texte: '-1 penalty to hit for any shooting or hand-to-hand attack targeting a Snotling.' },
          {
            nom: 'Insignificant',
            texte:
              'The whole group of Snotlings only counts as one model for Rout tests and when selling magic stones; each Snotling only earns half an experience point (rounded down), never gains experience itself, and is not a priority target for shooters.',
          },
        ],
      },
      squig_geant: {
        nom: 'Giant Squig',
        regles_speciales: [
          { nom: 'Movement', texte: 'As the Cave Squig, but rolls 3D6.' },
          {
            nom: 'Wild',
            texte:
              'Needs a Goblin to watch over it; on a hit from the scatter die, it moves towards the nearest visible model (friend or foe) and engages it in combat.',
          },
          { nom: 'Fear', texte: 'Causes Fear.' },
          { nom: 'Large Target', texte: 'Large Target under the Shooting rules.' },
          { nom: 'Animals', texte: 'Never gains experience.' },
          { nom: 'Ever Heard of a Troll?', texte: 'Mutually exclusive with the Troll — a warband can never have both.' },
        ],
      },
      troll: {
        nom: 'Troll',
        regles_speciales: [
          { nom: 'Fear', texte: 'Causes Fear.' },
          { nom: 'Stupidity', texte: 'Subject to the Stupidity rules.' },
          {
            nom: 'Regeneration',
            texte:
              'On a 4+ after a Wound, it is ignored (except wounds from fire or fire-based spells). Does not roll on the Serious Injury table at the end of the game.',
          },
          { nom: 'Zero IQ', texte: 'Never gains experience.' },
          {
            nom: 'Always Hungry',
            texte: 'The warband must spend 15 gc after each battle to feed it, or sacrifice 2 Goblins/Squigs; otherwise it leaves the warband.',
          },
          {
            nom: 'Vomit',
            texte: 'Instead of its normal attacks, may spit a single attack that hits automatically at Strength 5 with no armour save.',
          },
          { nom: 'Large Target', texte: 'Large Target under the Shooting rules.' },
          { nom: 'Exclusivity', texte: 'A warband can never have both a Troll and a Giant Squig.' },
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
      heros: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined, undefined],
      },
      hommes_de_main: {
        armes_cac: ['first free', undefined, undefined, undefined],
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

  chasseurs_cornus: {
    nom: 'Horned Hunters (1b)',
    regles_speciales: [
      {
        nom: 'Woodsmen',
        texte: 'Horned Hunters warbands suffer no Movement penalty in difficult terrain.',
      },
    ],
    profils: {
      chasseur_cornu: {
        nom: 'Horned Hunter',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warrior within 6" of the Horned Hunter may use his Leadership for their tests.' },
          { nom: 'Hang the Bandits!', texte: 'A Horned Hunter hates all Bandits and Outlaws.' },
        ],
      },
      pretre_de_taal: {
        nom: 'Priest of Taal',
        regles_speciales: [
          { nom: 'Prayers', texte: 'A Priest of Taal may use the Prayers of Taal.' },
          { nom: 'Restrictions', texte: 'Priests of Taal never wear heavy armour.' },
        ],
      },
      initie: {
        nom: 'Initiate',
        regles_speciales: [
          {
            nom: 'Infiltration',
            texte:
              'The Hero is always placed on the battlefield after the opposing warband. He may be placed anywhere on the table as long as he is out of sight and more than 12" from any enemy fighter. If both players have infiltrating fighters, each rolls 1D6; the lower result deploys first.',
          },
          { nom: 'Hang the Bandits!', texte: 'An Initiate hates all Bandits and Outlaws.' },
          { nom: 'Restrictions', texte: 'Initiates never wear armour.' },
        ],
      },
      soiffard: {
        nom: 'Boozer',
        regles_speciales: [{ nom: 'Drunkenness', texte: 'Boozers automatically pass all Leadership tests.' }],
      },
      zelote: {
        nom: 'Zealot',
        regles_speciales: [{ nom: 'Restrictions', texte: 'Zealots never wear armour.' }],
      },
      chien_de_guerre: {
        nom: 'War Dog',
        regles_speciales: [
          { nom: 'Weapons/armour', texte: 'Fangs and brute force! War dogs never use weapons or armour.' },
          { nom: 'Animals', texte: 'War dogs are animals and therefore gain no experience.' },
        ],
      },
    },
    competences_speciales: {
      maitre_trappeur: {
        nom: 'Master Trapper',
        texte: 'The range of snares set by this Hero is increased to 4". Traps set by a Master Trapper trigger on a 2+ instead of a 3+.',
      },
      effluve_nauseabonde: {
        nom: 'Noxious Reek',
        texte:
          'All living enemies (except Undead and Possessed) suffer a -1 penalty to hit this Hero in hand-to-hand combat. In addition, he may carry no flame, and burning attacks that hit him gain a +1 Strength bonus.',
      },
      ami_des_betes: {
        nom: 'Friend of Beasts',
        texte: "The Hero cannot be attacked by any animal, and up to two war dogs in his possession do not count towards the warband's maximum model count.",
      },
      infiltration: {
        nom: 'Infiltration',
        texte:
          'The Hero is always placed on the battlefield after the opposing warband. He may be placed anywhere on the table as long as he is out of sight and more than 12" from any enemy fighter. If both players have infiltrating fighters, each rolls 1D6; the lower result deploys first.',
      },
      guide: {
        nom: 'Guide',
        texte: 'Roll 1 additional D6 during the Exploration phase. A warband may only have one Hero with the Guide skill.',
      },
      cache_dans_les_ombres: {
        nom: 'Hidden in the Shadows',
        texte: 'Enemy fighters must halve their Initiative when trying to spot this Hero while he is hidden.',
      },
    },
    equipement: {
      heros: {
        armes_cac: ['first free', 'Mace / Hammer', undefined, undefined, undefined, undefined],
      },
      hommes_de_main: {
        armes_cac: ['first free', 'Mace / Hammer', undefined, undefined, undefined],
      },
    },
    magie: {
      nom: 'Prayers of Taal',
      type: 'prayer',
      note: 'The Prayers of Taal work like the Prayers of Sigmar, except that a Priest of Taal never wears armour.',
      sorts: [
        {
          nom: "Stag's Leap",
          texte:
            'The Priest of Taal may immediately move anywhere within 9", including into contact with an enemy (counts as a charge with +1 Strength on the first turn). If he engages a fleeing enemy, he inflicts an automatic hit at +1 Strength, and his opponent flees again.',
        },
        {
          nom: 'Blessed Ale',
          texte:
            'Drinking a skin of ale blessed by Taal allows the priest to heal a fighter within 2" (himself included): he recovers all his lost Wounds. In addition, any living enemy fighter (except Undead and Possessed) within 2" of the Priest loses -1 Attack during the next hand-to-hand combat turn.',
        },
        {
          nom: "Bear's Paw",
          texte: "The priest calls down Taal's blessing on an allied fighter or himself within 6\". The target gains a +2 Strength bonus until the Priest's next turn.",
        },
        {
          nom: 'Earth Tremor',
          texte:
            'The prayer targets a building within 4". Any enemy fighter in contact with the building suffers a Strength 3 hit. In addition, the building collapses and all fighters inside it are treated as having fallen. Remove the targeted terrain piece from the table for the rest of the game.',
        },
        {
          nom: 'Entanglement',
          texte: 'All fighters, enemy and allied alike (except Zealots), within 12" of the Priest have their Movement halved until the next Shooting phase.',
        },
        {
          nom: 'Call of the Squirrels',
          texte: 'The Priest calls upon the wrath of the Lord of Beasts. The target, an enemy within 12" of the Priest, suffers 2D6 Strength 1 hits, with no armour save.',
        },
      ],
    },
  },

  lustrian_reavers: {
    nom: 'Lustrian Reavers (1c)',
    regles_speciales: [
      {
        nom: 'Rare Heroes',
        texte:
          "Only one of each type of Hero may ever be bought during the warband's existence. Heroes come with the weapons/armour listed under their entry, which can never be swapped away or given away, though new equipment may be added.",
      },
      {
        nom: 'Promotions',
        texte:
          "When a Hero is lost, no replacement of that type may be bought. The warband keeps all of the fallen Hero's equipment, and may promote a Prospect into the vacant role as if it had just rolled 'Lad's Got Talent' on the Henchmen Advancement Table: the player picks two Hero skill lists for the new Hero and makes one immediate roll on the Heroes Advance table. The new Hero gains the fallen Hero's armour and weapons (not equipment) and takes their place in the warband; the Prospect's own equipment goes to the warband stash. If there is no Prospect currently in the warband, the next one hired may be promoted instead.",
      },
      {
        nom: 'Hired Swords',
        texte: 'Allowed: Ogre Bodyguard, Dwarf Trollslayer, Tilean Marksman, Big Game Hunter.',
      },
    ],
    profils: {
      conqueror: {
        nom: 'Conqueror',
        regles_speciales: [
          { nom: 'Starting equipment', texte: 'Masterwork Heavy Armour, Bec de Corbin, Helmet (fixed — see Rare Heroes).' },
          {
            nom: 'Survivor',
            texte: 'Cannot be taken Out of Action unless already Knocked Down or Stunned. Treat an Out of Action result as Stunned if the Conqueror was standing when the Wound was received.',
          },
          {
            nom: 'Multiple Injuries (once)',
            texte: 'The first time the Conqueror suffers a Dead result on the Serious Injury chart, treat it as Multiple Injuries instead. This can only save the Conqueror once.',
          },
        ],
      },
      saurus_slayer: {
        nom: 'Saurus Slayer',
        regles_speciales: [
          { nom: 'Starting equipment', texte: 'Heavy Armour, Misericordia, two Swords, Helmet (fixed — see Rare Heroes).' },
          {
            nom: 'Duellist',
            texte: 'If engaged with only a single opponent in melee, may re-roll missed hits on the first turn, whether they charged or were charged.',
          },
        ],
      },
      reaver_beastmaster: {
        nom: 'Reaver Beastmaster',
        regles_speciales: [
          { nom: 'Starting equipment', texte: 'Heavy Armour, Spear, Sword (fixed — see Rare Heroes).' },
          {
            nom: 'War Beasts',
            texte:
              "If included, the warband may take up to 2 War Beasts from the dedicated list (see equipment reference). They count toward the warband's maximum size, must be bought when the warband is created (but can be replaced if killed), and may use the Beastmaster's Leadership within 6\". If the Beastmaster is killed or lost, War Beasts cannot be used until a Prospect is promoted into a new Beastmaster.",
          },
        ],
      },
      jungle_shadow: {
        nom: 'Jungle Shadow',
        regles_speciales: [
          { nom: 'Starting equipment', texte: 'Javelins, Light Armour, two Daggers (fixed — see Rare Heroes).' },
          {
            nom: 'Silent Hunter',
            texte:
              "Always considered Hidden if touching any piece of terrain 1\" high or higher. Shooting does not reveal the Jungle Shadow's position, though spellcasting does; this does not work with Blackpowder weapons.",
          },
          {
            nom: 'Surprise attack',
            texte: "If attacking an enemy whose back is turned (a shot from within a 180-degree arc behind the target's facing), may re-roll missed to-hit rolls.",
          },
          { nom: 'Canopy Walker', texte: 'May re-roll all failed climbing, jumping and falling-off-ledges tests once.' },
          {
            nom: 'Wizard option',
            texte: 'For +30gc, may be made a Wizard using the Lesser Magic list, generating a single spell as standard. If taken, remove the starting Light Armour and generate 1 Lesser Magic spell.',
          },
        ],
      },
      trap_master: {
        nom: 'Trap master',
        regles_speciales: [
          {
            nom: 'Starting equipment',
            texte:
              'Heavy Armour, Sword, Tilean Hunting Rifle (treat as Hochland Long Rifle), Firepots of Miragliano, Leaf coat (counts as Elven Cloak) (fixed — see Rare Heroes).',
          },
          { nom: 'Deadeye', texte: 'Suffers no penalties for shooting at long range.' },
          {
            nom: 'Traps',
            texte:
              'Starts each game with 1 Trap and may buy up to 5 more before the game at 5gc each; each is one use only. Traps are used in the Shooting Phase instead of shooting (cannot be set if running), one at a time, and cannot be used in melee. When used, place two 1" diameter counters (one false, one real) anywhere within 3" of the Trapmaster but at least 3" from any other model. Any model moving within 2" of a counter must flip it over: a false counter does nothing, a real one inflicts D3 Strength 5 hits (no critical hits). Remove the counters once the trap is sprung.',
          },
        ],
      },
      prospect: {
        nom: 'Prospect',
        regles_speciales: [
          {
            nom: 'Promotion Only',
            texte:
              "Re-rolls any 'Lad's Got Talent' result on the Henchmen Advancement table (cannot become a Hero directly). When promoted to fill a fallen Hero's role — see the band's Promotions rule — the model no longer counts as a Prospect, so a new Prospect may be hired.",
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
      heroes: {
        armes_cac: ['first free', undefined, undefined, 'see special equipment', undefined, undefined],
        armes_tir: ['see special equipment', undefined, undefined, undefined],
      },
      prospects: {
        armes_cac: ['first free', undefined, undefined, undefined],
      },
    },
  },

  skavens_pestilens: {
    nom: 'Skaven of Clan Pestilens (1b)',
    profils: {
      pretre_de_la_peste: {
        nom: 'Plague Priest',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any model within 6" of the Plague Priest may use his Leadership for their tests.' },
        ],
      },
      precheur_sorcier_pestilens: {
        nom: 'Pestilens Preacher-Sorcerer',
        regles_speciales: [
          { nom: 'Sorcerer', texte: 'The Pestilens Preacher-Sorcerer is a spellcaster who uses the Magic of the Horned Rat.' },
        ],
      },
      moine_de_la_peste: { nom: 'Plague Monk' },
      initie_de_la_peste: { nom: 'Plague Initiate' },
      novice_de_la_peste: {
        nom: 'Plague Novice',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' }],
      },
      rat_geant: {
        nom: 'Giant Rat',
        regles_speciales: [
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' },
          { nom: 'Experience', texte: 'Giant rats are animals and therefore do not gain experience.' },
          { nom: 'Equipment', texte: 'None. Giant rats carry no weapons or armour.' },
          {
            nom: 'Familiar Rat',
            texte:
              "If the warband includes a Pestilens Preacher-Sorcerer equipped with a Familiar Rat Scroll, a giant rat may be transformed into a Familiar Rat before the battle (see Special Equipment). Familiar Rat profile: M6 WS2 BS0 S3 T3 W1 I4 A1 Ld4, with no weapons or armour. It gains experience like a Henchman, but its 10-12 \"Lad's Got Talent\" result is replaced by \"Enhanced Spellcasting: if the Pestilens Preacher-Sorcerer is within 6\" of the Familiar Rat, he gains a cumulative +1 bonus to his casting roll.\" If the Pestilens Preacher-Sorcerer dies, the Familiar Rat reverts to its Giant Rat form.",
          },
        ],
      },
      rat_ogre: {
        nom: 'Rat Ogre',
        regles_speciales: [
          { nom: 'Fear', texte: 'Rat ogres cause Fear.' },
          { nom: 'Stupidity', texte: 'A rat ogre is subject to Stupidity, unless a Skaven Hero is within 6".' },
          { nom: 'Experience', texte: 'Rat ogres do not gain experience.' },
          {
            nom: 'Large Target',
            texte: 'Rat ogres are huge creatures that make good targets for archers; they are Large Targets, as defined in the Shooting rules.',
          },
          { nom: 'Equipment', texte: 'Fangs, claws, and raw strength! Rat ogres never use weapons or armour.' },
        ],
      },
    },
    competences_speciales: {
      insensible_a_la_douleur: {
        nom: 'Unfeeling to Pain',
        texte: 'Only a Skaven of Clan Pestilens Hero with the Hard as Nails skill may choose this skill. The Skaven treats Stunned results as Knocked Down.',
        reserve_a: 'Requires the Hard as Nails skill',
      },
      frenesie_mortelle: {
        nom: 'Deadly Frenzy',
        texte:
          'At the start of a turn, the Clan Pestilens Hero may declare that he is using this skill. He gains +1 Attack and 1D3" of Movement for the whole turn. In exchange, at the end of the turn, he suffers 1D3 Strength 3 hits, with no armour save allowed.',
      },
      porteur_dencensoir_a_peste: {
        nom: 'Plague Censer Bearer',
        texte:
          'Only a Skaven of Clan Pestilens Hero with the Deadly Frenzy skill may choose this skill. This Skaven is called a censer bearer. He gains the Frenzy special rule and may only use a plague censer as a hand-to-hand weapon.',
        reserve_a: 'Requires the Deadly Frenzy skill',
      },
      corps_putrefie: {
        nom: 'Rotten Body',
        texte:
          'A Clan Pestilens Hero with this skill has grown accustomed to the poisons, infections, and lethal fumes of plague censers. He is now immune to poisons and diseases. If he is taken Out of Action following a failed Toughness test for carrying a plague censer, he does not roll on the Serious Injury table at the end of the game and is simply treated as having been overcome by the fumes.',
      },
      contagieux: {
        nom: 'Contagious',
        texte:
          'Only a Clan Pestilens Hero with the Rotten Body skill may choose this skill. Any model that takes the contagious Skaven Out of Action must make a Toughness test. On a failure, the attacker suffers an automatic Wound. A roll of 6 always inflicts a Wound. Undead and Possessed are immune and never make this test.',
        reserve_a: 'Requires the Rotten Body skill',
      },
    },
    equipement: {
      heros_pestilens: {
        armes_cac: ['first free', 'mace', undefined, undefined, undefined, undefined, undefined, undefined],
      },
      hommes_de_main_pestilens: {
        armes_cac: ['first free', 'mace', undefined, undefined],
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
          texte: "Usable once before each game. Summons D3 Giant Rats placed within 6\" of the Preacher-Sorcerer; these rats do not count towards the warband's maximum model count.",
        },
        { nom: 'Fleshgnaw', texte: 'Causes 2D6 Strength 1 hits on a single model within 8" of the Preacher-Sorcerer.' },
        {
          nom: 'Black Fury',
          texte: 'The Preacher-Sorcerer may immediately charge an enemy model of his choice within 12" (ignoring terrain and other models). He gains 2 extra Attacks and +1 Strength during the hand-to-hand combat phase of this turn only.',
        },
        {
          nom: 'Eye of the Warp',
          texte: 'All standing models in contact with the Preacher-Sorcerer must immediately make a Leadership test. Those who fail suffer a Strength 3 hit and must run 2D6" in the direction opposite the Preacher-Sorcerer.',
        },
        {
          nom: "Sorcerer's Curse",
          texte:
            'Affects a model within 12": it must re-roll any successful to-hit roll or armour save during the following Skaven of Clan Pestilens hand-to-hand combat phase, as well as during the shooting and hand-to-hand combat phases of its next turn.',
        },
      ],
    },
  },

  undead: {
    nom: 'Undead (1a)',
    profils: {
      vampire: {
        nom: 'Vampire',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warrior within 6" of the Vampire may use his Ld for their Leadership tests.' },
          { nom: 'Causes Fear', texte: 'Vampires are Undead and cause Fear.' },
          { nom: 'Immunity to Psychology', texte: 'Vampires are not affected by psychology and never leave combat.' },
          { nom: 'Immunity to Poisons', texte: 'Vampires are not affected by any poison.' },
          { nom: 'Unfeeling', texte: 'Vampires treat Stunned results as Knocked Down.' },
        ],
      },
      necromancien: {
        nom: 'Necromancer',
        regles_speciales: [
          { nom: 'Sorcerer', texte: 'Necromancers are spellcasters who use Necromancy (see Magic).' },
        ],
      },
      paria: { nom: 'Dregs' },
      zombie: {
        nom: 'Zombie',
        regles_speciales: [
          { nom: 'Causes Fear', texte: 'Zombies are terrifying creatures and cause Fear.' },
          { nom: 'Apathy', texte: 'Zombies have slow reactions and cannot run (but they may charge normally).' },
          { nom: 'Immunity to Psychology', texte: 'Zombies are not affected by psychology and never leave combat.' },
          { nom: 'Immunity to Poisons', texte: 'Zombies are not affected by any poison.' },
          { nom: 'Unfeeling', texte: 'Zombies treat Stunned results as Knocked Down.' },
          { nom: 'No Brain', texte: 'Zombies do not gain experience. They never learn from their mistakes.' },
          { nom: 'Recruitment', texte: 'As many as you like.' },
          { nom: 'Equipment', texte: 'Zombies may have no weapons or armour.' },
        ],
      },
      goule: {
        nom: 'Ghoul',
        regles_speciales: [
          { nom: 'Causes Fear', texte: 'Ghouls are repulsive, misshapen creatures that cause Fear.' },
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5 models.' },
          {
            nom: 'Equipment',
            texte: 'Ghouls never carry equipment, except for a few bones they use as blunt objects (no effect on gameplay).',
          },
        ],
      },
      loup_funeste: {
        nom: 'Dire Wolf',
        regles_speciales: [
          { nom: 'Charge', texte: 'Dire wolves have two Attacks instead of one during the turn they charge.' },
          { nom: 'Apathy', texte: 'Slow reactions, cannot run (but charge normally).' },
          { nom: 'Causes Fear', texte: 'Dire wolves are terrifying creatures that cause Fear.' },
          { nom: 'Immunity to Psychology', texte: 'Not affected by psychology and never leave combat.' },
          { nom: 'Immunity to Poisons', texte: 'Not affected by any poison.' },
          { nom: 'Corpses', texte: 'Dire wolves do not gain experience.' },
          { nom: 'Unfeeling', texte: 'Treat Stunned results as Knocked Down.' },
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
      morts_vivants: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined, undefined],
      },
    },
    magie: {
      nom: 'Necromancy',
      type: 'sorcery',
      note: 'Necromancy is the magic of the dead: it grants the power to awaken corpses and command spirits, but also to destroy the vitality of the living.',
      sorts: [
        {
          nom: 'Life Drain',
          texte:
            'Choose a model within 6". The target suffers a Wound (with no save allowed) and the necromancer gains 1 extra Wound for the duration of the battle (may exceed his starting value). Does not affect Possessed or Undead models.',
        },
        {
          nom: 'Raise Dead',
          texte: 'A zombie taken Out of Action during the last hand-to-hand combat or shooting phase returns to the fight immediately, placed within 6" of the necromancer (not directly in base contact with an enemy).',
        },
        { nom: 'Vision of Death', texte: 'The necromancer causes Fear in his enemies for the duration of the battle.' },
        {
          nom: 'Doom',
          texte: 'Choose an enemy model within 12"; it must roll 1D6 equal to or lower than its Strength to avoid being dragged down by the dead. On a failure, roll on the Injury table.',
        },
        {
          nom: "Vanhel's Danse Macabre",
          texte: 'A single zombie or dire wolf within 6" of the necromancer may move again with its full Movement; if this movement brings it into base-to-base contact with an enemy, it counts as having charged.',
        },
        {
          nom: 'Awakening Incantation',
          texte:
            'If an enemy Hero is killed (result 11-16 on the Serious Injury table after the battle), the necromancer may awaken him and turn him into a servile zombie. The dead Hero follows all the zombie rules (Fear, Unfeeling, etc.) but keeps his characteristics, armour, and weapons; he may use no other equipment or skills, may no longer run, counts as his own Henchmen group, and can no longer gain experience. This spell always succeeds.',
        },
      ],
    },
  },

  witch_hunters: {
    nom: 'The Witch Hunters (1a)',
    profils: {
      capitaine_repurgateur: {
        nom: 'Witch Hunter Captain',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warrior within 6" may use his Ld for Leadership tests.' },
          { nom: 'To the Stake!', texte: 'The Witch Hunter Captain hates all spellcasters.' },
        ],
      },
      pretre_guerrier: {
        nom: 'Warrior Priest',
        regles_speciales: [
          { nom: 'Prayers', texte: 'A servant of Sigmar, may use the Prayers of Sigmar (see Magic).' },
        ],
      },
      repurgateur: {
        nom: 'Witch Hunter',
        regles_speciales: [{ nom: 'To the Stake!', texte: 'Witch Hunters hate all spellcasters.' }],
      },
      seide: { nom: 'Warrior' },
      flagellant: {
        nom: 'Flagellant',
        regles_speciales: [
          {
            nom: 'Fanatics',
            texte: "Automatically pass all Leadership tests they might have to take. A Flagellant can never become the warband's leader.",
          },
          { nom: 'Equipment', texte: 'No armour allowed; never uses a missile weapon even via a skill that would permit it.' },
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' },
        ],
      },
      chien_de_guerre: {
        nom: 'War Dog',
        regles_speciales: [
          { nom: 'Animals', texte: 'Never gain experience.' },
          { nom: 'Equipment', texte: 'Fangs and brute force! Never use weapons or armour.' },
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' },
        ],
      },
    },
    equipement: {
      repurgateurs: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined],
        armes_tir: [undefined, '30gc per pair', undefined],
      },
      seides: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined],
      },
    },
    magie: {
      nom: 'Prayers of Sigmar',
      type: 'prayer',
      note: 'Prayers are not considered spells: an armoured warrior may use them, and special protections against spells do not affect them.',
      sorts: [
        {
          nom: "Sigmar's Hammer",
          texte:
            'The bearer gains +2 Strength in hand-to-hand combat, and all his hits cause double damage (1 Wound = 2 Wounds lost). The priest must test at every Shooting phase to use the Hammer.',
        },
        {
          nom: 'Heart of Steel',
          texte:
            'Every allied warrior within 8" becomes immune to Fear and All Alone, and the whole warband gains +1 to its Rout tests. Not cumulative if cast multiple times; lasts until the caster is taken Out of Action.',
        },
        {
          nom: 'Soul Fire',
          texte: 'Any enemy model within 4" of the priest suffers a Strength 3 hit with no armour save (Strength 5 against Undead and Possessed).',
        },
        {
          nom: 'Shield of Sigmar',
          texte: 'The priest is immune to all spells. On a 1-2 at the start of each turn (Recovery phase), the shield dissipates.',
        },
        {
          nom: 'Laying of Hands',
          texte:
            'Any model within 2" of the priest (himself included) recovers all lost Wounds; friendly models Stunned or Knocked Down within 2" immediately get back up and continue fighting normally.',
        },
        {
          nom: 'Armour of Righteousness',
          texte: 'The priest gains a 2+ save that replaces his armour save, causes Fear in his enemies, and is himself immune to it. Lasts until the start of his next Shooting phase.',
        },
      ],
    },
  },

  orques_noirs: {
    nom: 'Black Orcs (1b)',
    regles_speciales: [
      {
        nom: 'Let the Real Boyz Do the Job',
        texte:
          'Black Orcs rely only on themselves to kill their enemies. They may therefore never have any kind of mount. Only common Orcs may ride boars or other mounts.',
      },
      {
        nom: 'The Boss Got Done In!',
        texte:
          'If the Boss should be killed, command of the warband must pass to the Black Orc with the most experience, even if an Orc has more experience overall. The replacement automatically gains the special rule You Gonna Calm Down?!.',
      },
      {
        nom: 'Animosity',
        texte:
          'Orcs love to fight. Unfortunately for them, they don\'t always tell who against. At the start of each Orc player\'s turn, roll 1D6 for every Orc Henchman not engaged in hand-to-hand combat (those already have something to sink their teeth into!). On a result of 1, the model has been annoyed by something one of his mates said or did. Then roll 1D6 on the following table to determine the result of this offence:\n\n1 — "Say that again!" The warrior decides that his nearest Orc Henchman ally has insulted his ancestors or something of the sort, and that he must pay for it! If an Orc Henchman or Hired Sword is within charge range (if there are several possible targets, choose the closest), the offended model immediately charges him and fights a round of hand-to-hand combat. At the end of the turn, the models are moved 1" apart and are no longer considered engaged in hand-to-hand combat (unless another Animosity test is failed and this result comes up again). If no Orc Henchman or Hired Sword is within charge range, and the affected model is equipped with a missile weapon, it immediately uses it against the nearest Orc Henchman or Hired Sword. If neither of these situations applies, or if the nearest model is a Hero, the affected model acts as if it had rolled the 2-5 "What\'d You Say?" result on this table. In every case, the model does nothing else this turn. However, it defends itself normally if engaged in hand-to-hand combat.\n\n2-5 — "What\'d You Say?" The warrior is convinced that one of his allies insulted him, but isn\'t quite sure which one. He spends the whole turn ranting at everyone and does absolutely nothing else. However, he defends himself normally if engaged in hand-to-hand combat.\n\n6 — "I\'ll Show \'Em!" The warrior imagines that his allies are mocking him behind his back and calling him names. He decides to show them he\'s no coward! The model must advance as fast as possible towards the nearest enemy model and charge it if possible. If no enemy model is visible, the warrior may immediately make a normal Move, in addition to his standard move during the Movement phase. If the first move brings the model within charge range of an enemy, it must charge during its next Movement phase.',
      },
    ],
    profils: {
      boss_orque_noir: {
        nom: 'Black Orc Boss',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warband member within 6" of the Black Orc Boss may use his Leadership for their tests.' },
          {
            nom: 'Black Orc',
            texte: 'The model starts with a natural armour save of 6+. It may be combined with any equipment that would improve it.',
          },
          {
            nom: 'You Gonna Calm Down?!',
            texte:
              'If an Orc Henchman fails his Animosity test within 6" of the Black Orc Boss, the Black Orc player may choose to have the Boss step in. The Black Orc Boss decides to calm things down by kicking a few backsides… The unruly Orc Henchman suffers an automatic hit of a Strength chosen by the Black Orc player. If the Orc Henchman is still standing after the smack, he adds a number equal to the Strength of the blow received to the result rolled on the Animosity table. For example, the player decides the Black Orc Boss gives an unruly Orc Henchman a Strength 2 clout. If he is not Knocked Down, Stunned, or Out of Action after the beating, the player adds +2 to the result on the Animosity table.',
          },
        ],
      },
      orque_noir: {
        nom: 'Black Orcs',
        regles_speciales: [
          {
            nom: 'Black Orc',
            texte: 'The model starts with a natural armour save of 6+. It may be combined with any equipment that would improve it.',
          },
        ],
      },
      pti_mek: {
        nom: "Young'un",
        regles_speciales: [
          {
            nom: 'Black Orc Blood',
            texte:
              'Once he has accumulated 25 experience points, a Young\'un may be promoted to "Black Orc Young\'un". He must first undergo a rite of passage to become a Black Orc Young\'un, whose preparations cost 10 Gold Crowns. Once this rite is completed, the next time he is due to choose a new skill, he may instead gain the Black Orc special rule. He then becomes a fully-fledged Black Orc and gains access to their equipment list and the same skills as them.',
          },
        ],
      },
      kastagneurs_orques: {
        nom: 'Orc Bruisers',
        regles_speciales: [
          { nom: 'Animosity', texte: "Orc Bruisers are subject to animosity (see the warband's special rules)." },
        ],
      },
      chasseurs_orques: {
        nom: 'Orc Hunters',
        regles_speciales: [
          { nom: 'Animosity', texte: "Orc Hunters are subject to animosity (see the warband's special rules)." },
          {
            nom: 'Uncommon',
            texte: 'A warband may never hire more Hunters than Bruisers. If a Bruiser dies and there are more Hunters than Bruisers, the next recruit must be a Bruiser to restore the balance.',
          },
        ],
      },
      ding_boyz: {
        nom: "Ding'boyz",
        regles_speciales: [
          {
            nom: 'Unstable',
            texte: "These Orcs aren't quite right in the head. They don't suffer from Animosity, but from a whole host of other problems.",
          },
          {
            nom: 'Mad',
            texte:
              "Ding'boyz automatically pass all Leadership tests. The downside is that their minds are so disturbed that, should they become Heroes following an advance roll, they would be unable to learn even a single Academic skill.",
          },
          {
            nom: 'Savage',
            texte:
              "Ding'boyz must always run or charge at full Movement towards the nearest visible enemy. Friendly models do not block line of sight. If there is no visible enemy, the Black Orc player may move them normally. In hand-to-hand combat, they get an extra Attack. This Attack does not appear on their profile and does not count towards the racial maximum. Ding'boyz may not wear armour or carry missile weapons. They are also too unstable for the other Orcs, who will refuse to let one of them become their Boss. Their Leadership may also not be used for Rout tests, unless the Ding'boyz are the only models left in the warband.",
          },
        ],
      },
      troll: {
        nom: 'Troll',
        regles_speciales: [
          {
            nom: 'Weapons/Armour',
            texte: 'Trolls could easily do without weapons, but they carry a big club regardless. In game terms, they may not be given weapons or armour.',
          },
          { nom: 'Fear', texte: 'Trolls are frightening creatures and cause Fear.' },
          { nom: 'Zero IQ', texte: 'Trolls are far too stupid to learn anything. They never gain experience.' },
          {
            nom: 'Regeneration',
            texte:
              'Trolls have a unique physiology that lets them heal wounds far faster than any other creature. Whenever a Troll suffers a Wound, of any kind, roll 1D6. On a 4+, the Wound is simply ignored. Trolls cannot regenerate wounds caused by fire or by fire-based spells. They do not roll on the Serious Injury table at the end of the game.',
          },
          { nom: 'Stupidity', texte: 'Trolls are subject to the Stupidity rules.' },
          {
            nom: 'Always Hungry',
            texte:
              "A Troll is rather expensive to keep; it must be stuffed with a colossal amount of food to ensure its loyalty to the warband. The warband must spend 20 gc after each battle to feed the Troll. If it cannot afford this, the Boss may choose to count it as 2 members, which reduces the Troll's upkeep cost to 5 gc. However, the maximum number of warriors allowed in the warband then drops to 11. If you still cannot pay, the Troll will leave the warband for good to find its own food.",
          },
          {
            nom: 'Vomit',
            texte: 'Instead of making its normal attacks, a Troll may regurgitate its highly corrosive stomach fluids onto its unfortunate opponent. This single attack hits automatically, is resolved at Strength 5, and ignores armour saves.',
          },
          {
            nom: 'Large Target',
            texte: 'Trolls are huge creatures that make good targets for archers. They are Large Targets, as defined in the Shooting rules.',
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
    competences_speciales: {
      tet_dure: {
        nom: 'Thick Skull',
        texte:
          "The warrior has a particularly thick skull, even for an Orc. This Orc gets a special 3+ save on 1D6 to avoid being Stunned. If the save is successful, the model is simply Knocked Down instead. If the Orc also wears a helmet, this save becomes 2+ instead of 3+ (replacing the helmet's usual special rule).",
      },
      waaagh: {
        nom: 'Waaagh!',
        texte: 'Orcs are aggressive creatures who love to charge into the fray. The Hero adds +1D3" to his charge range.',
      },
      on_y_va: {
        nom: "Let's Go!",
        texte: 'Orcs don\'t hesitate to rush into combat, even against fearsome opponents. The Hero ignores Fear and Terror tests when charging.',
      },
      revenez_ici: {
        nom: "Come Back 'Ere!",
        texte: 'Only the Boss may take this skill. The warband may re-roll all failed Rout tests as long as the Boss has not been taken Out of Action.',
        reserve_a: 'Black Orc Boss only',
      },
      coup_de_boule: {
        nom: 'Headbutt',
        texte: 'Orcs are fairly muscular creatures, and some are used to striking their opponents with great headbutts, with rather conclusive results. Any model Knocked Down in hand-to-hand combat is treated as Stunned.',
      },
    },
    equipement: {
      orques_noirs: {
        armes_cac: ['first free', undefined, undefined, 'Choppa (counts as a Morning Star)', undefined, undefined],
      },
      pti_meks: {
        armes_cac: ['first free', undefined, undefined, 'Choppa (counts as a Morning Star)', undefined],
      },
      kastagneurs: {
        armes_cac: ['first free', undefined, undefined, 'Choppa (counts as a Morning Star)', undefined, undefined],
      },
      ding_boyz: {
        armes_cac: ['first free', undefined, undefined, 'Choppa (counts as a Morning Star)', undefined, undefined],
      },
      chasseurs: {
        armes_cac: ['first free', undefined, undefined, 'Choppa (counts as a Morning Star)', undefined],
      },
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

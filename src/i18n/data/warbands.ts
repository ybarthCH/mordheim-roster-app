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
export type SortTraduit = { nom: string; texte: string; note?: string };
export type MagieTraduite = { nom?: string; type?: string; note?: string; sorts?: SortTraduit[] };
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
  // Aligné par index sur `WarbandCatalog.equipement_special` — ne traduit que
  // la mention d'accès (ex : "Sylvaneths uniquement"), le nom/texte de
  // l'objet lui-même vient déjà de translateItem via son item_id.
  equipement_special?: { disponibilite?: string }[];
};

// Traductions des bandes, remplies progressivement bande par bande (voir
// translateItem dans items.ts pour le même principe de repli). Clé = id de
// bande (src/data/warbands/*.json).
export const warbandsEn: Record<string, WarbandTraduite> = {
  maraudeurs_du_chaos: {
    nom: 'Marauders of Chaos (1c)',
    regles_speciales: [
      {
        nom: 'Eye of the Gods',
        texte:
          "After each battle, roll 2D6. If you lost, add +1 for each Hero taken Out of Action; on a 12+, the leader becomes a Spawn of Chaos (losing experience, skills, wounds, and equipment). If you won, add +1 for each enemy taken Out of Action by the leader; on a 12+, the leader receives a Mark of the Dark Gods of his choice (see the Marks of the Dark Gods special rule). Once a leader has received a Mark through this rule, he is no longer subject to it (unless he dies, in which case the new leader is tested in turn). If the warband already has a Spawn of Chaos, a leader who would get this result is simply removed from the warband instead of being transformed.",
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
          "A leader can only bear one Mark at a time (except the Mark of Chaos Undivided, which can coexist with the others); Seers choose their Mark in agreement with the tribe at recruitment, and then use the rituals associated with their Mark instead of the generic Rituals of Chaos (except Chaos Undivided, which keeps the Rituals of Chaos). Mark of Arkhar the Dog — Leader: automatic frenzy, any spell targeting the Hero fails on a 4+. Seer: becomes a Bloodfather, no longer casts spells but gains +1 to a characteristic of choice (Combat, S, T, or I, once each) each time he takes an enemy Out of Action (Leadership test required), and gains access to Strength skills in addition to his normal list. Mark of Shornaal the Serpent — Leader: enemies not Immune to Psychology must pass a Leadership test (3D6, discarding the lowest) to attack the Hero in hand-to-hand combat, or suffer an automatic hit; once passed, no further tests are needed. Seer: uses the Rituals of Shornaal; may brew a strong drink for the warband (like Bugman's Ale, not for sale) instead of searching for rare items, provided he was not taken Out of Action. Mark of Tchar the Eagle — Leader: immediately learns a random spell from the Rituals of Tchar, with a -1 penalty to difficulty rolls unless he was already a spellcaster. Seer: starts with two spells from the Rituals of Tchar (one chosen freely, one random). Mark of Onogal the Crow — Leader: +1 Toughness, may re-roll on the Serious Injury table, immune to poisons. Seer: uses the Rituals of Onogal and benefits from immunity to poisons. Mark of Chaos Undivided — Leader: all warband members within the Leader rule's range may re-roll failed Leadership tests. Seer: allows the warband to include 0 to 3 Gors (see Beastmen Raiders), counting towards the maximum warband size; uses the standard Rituals of Chaos. The alternative rituals specific to each Mark (Shornaal, Tchar, Onogal) are provided as additional reference; otherwise the Seer uses the Rituals of Chaos below.",
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
          'Reavers: due to their proximity to the Empire and the frequency of their raids, the Norse excel at finding the best equipment and supplies quickly — they gain +1 to their rarity rolls when searching for rare items (for reference only, apply on your tabletop). Pantheon: the Norse worship a myriad of gods, spirits, and ancestors; because of their broad pantheon, the effect of the Eye of the Gods special rule (becoming a Spawn of Chaos or receiving a Mark) triggers on a result of 13+ instead of 12+.',
      },
      kurgans: {
        nom: 'Kurgans',
        texte:
          'Pedigree: a Kurgan warband may include as many Warhounds of Chaos as desired, not just five. Bone Bows: Marauder Heroes and Henchmen may use bows (10 gc, Common — for reference only, not automatically filtered in the shop). Difficult Customers: while the Norse and the Hung trade with the south, the Kurgans live far from civilisation and are not welcome there — -1 penalty on rarity rolls when searching for rare items, except for Chaos Great Axes and Barbed Whips (for reference only, apply on your tabletop).',
      },
      hungs: {
        nom: 'Hung',
        texte:
          'Disloyalty: the tribal loyalty of these nomads is weak at best — the maximum number of warriors in the warband is reduced to 12 (instead of 15). Affinity with horses: warhorses always cost the warband 40 gc, even outside of warband creation (for reference only, not automated in the shop); all Heroes (including promoted Henchmen) automatically gain the Ride – Warhorse skill.',
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
        nom: 'Seer',
        regles_speciales: [
          {
            nom: 'Sorcerer',
            texte: 'Uses the Rituals of Chaos (or the rituals associated with his Mark, see the Marks of the Dark Gods special rule).',
          },
          {
            nom: 'Mark of the Dark Gods',
            texte:
              "Receives a Mark of choice at recruitment: Mark of the Serpent (Shornaal), of the Crow (Onogal), of the Dog (Arkhar), of the Eagle (Tchar), or the Mark of Chaos Undivided.",
          },
        ],
      },
      champion: { nom: 'Champion' },
      damne: {
        nom: 'Condemned',
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
              'Once all variable characteristics are locked in, uses weapons/armour/items normally. If he reaches 90 experience points while still having variable characteristics, he becomes a Spawn of Chaos (or leaves the warband to wander the wastes if it already has one).',
          },
          { nom: 'Equipment', texte: 'Uses no equipment but fights without penalty (see Fate).' },
        ],
      },
      maraudeur: {
        nom: 'Marauder',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' }],
      },
      chien_du_chaos: {
        nom: 'Warhound of Chaos',
        regles_speciales: [
          { nom: 'Animals', texte: 'Never gains experience.' },
          { nom: 'Recruitment', texte: 'Unlimited for a Kurgan tribe warband (see the Tribes special rule), otherwise maximum 5.' },
          { nom: 'Equipment', texte: 'No weapons or armour; fights without penalty thanks to its fangs.' },
        ],
      },
      enfant_du_chaos: {
        nom: 'Spawn of Chaos',
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
        texte: 'Lowers the trigger threshold of Eye of the Gods to 10+ (11+ for a Norse Leader) instead of 12+.',
      },
      courage_du_guerrier: {
        nom: 'Heart of the Warrior',
        reserve_a: 'Warband Leader only',
        texte: 'May re-roll any failed Rout test and is immune to Fear as well as to All Alone.',
      },
      balayage: {
        nom: 'Sweeping Blow',
        texte: 'Requires the Strongman skill. Each Out of Action result caused with a two-handed weapon grants an immediate extra attack against another model in base contact.',
      },
      choisi_par_le_chaos: {
        nom: 'Chosen of Chaos',
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
        'Base table used by a Seer with no Mark, or with the Mark of Chaos Undivided. A Seer marked by Shornaal, Tchar, or Onogal instead uses the rituals specific to his Mark (chosen at recruitment — see marks). A Seer marked by Arkhar becomes a Bloodfather and no longer casts spells.',
      sorts: [
        {
          nom: 'Vision of Torment',
          texte: 'Range 6" against the nearest enemy (or a target in contact if the Seer is engaged); the victim is immediately Stunned, or Knocked Down if it cannot be Stunned.',
        },
        {
          nom: 'Eye of God',
          texte: 'Once per battle. Choose a model within 6", friend or foe, and roll 1D6: 1 = immediate Out of Action (no Serious Injury roll); 2-5 = +1 to a characteristic of choice for the battle; 6 = +1 to all characteristics for the battle.',
        },
        {
          nom: 'Dark Blood',
          texte: 'Range 8", D3 Strength 5 hits on the first model in the path; the Seer must then roll on the Injury table for his own wound (an Out of Action result is treated as Stunned).',
        },
        {
          nom: 'Lure of Chaos',
          texte: 'Range 12" against the nearest enemy; compares 1D6+Ld of the Seer against 1D6+Ld of the target. If the Seer wins, he takes control of the victim until a successful Leadership test during the opponent\'s Recovery phase; it cannot commit suicide but may attack its own side, without fighting the Seer\'s warband.',
        },
        {
          nom: 'Wings of Darkness',
          texte: 'The Seer immediately moves anywhere within 12", even into contact (which then counts as a charge); against a fleeing enemy, inflicts an automatic hit, and if it survives, it flees again.',
        },
        {
          nom: 'Word of Pain',
          texte: 'All models within 3" of the Seer, friend or foe, suffer a Strength 3 hit with no armour save.',
        },
      ],
    },
    marques: {
      arkhar: {
        nom: 'Mark of Arkhar the Dog',
        texte: 'The Seer becomes a Bloodfather: he no longer casts spells, but gains +1 to a characteristic of choice (Combat, S, T, or I, once each) each time he takes an enemy Out of Action (Leadership test required), and gains access to Strength skills in addition to his normal list.',
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
        nom: 'Mark of Onogal the Crow',
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
            texte: 'All models (friend and foe, except the Seer) within 3" must pass a Leadership test or be Knocked Down.',
          },
          {
            nom: 'Dance of the Serpent',
            texte: "All enemy models that are not Immune to Psychology suffer a -1 penalty to hit the Seer in hand-to-hand combat. The Dance lasts until the start of the Seer's next Shooting phase.",
          },
          {
            nom: 'Endless Torment',
            texte: 'Choose an enemy model within 8". From now on, it must make a -1 Injury roll after its Recovery phase. As long as the torment lasts, the Seer can do nothing else but end the spell, at the start of his turn. If he is attacked in hand-to-hand combat, he is hit automatically and the spell is broken.',
          },
          {
            nom: 'Mystify',
            texte: 'Choose an enemy model within 8". Its Initiative is reduced to 1 and it will always strike last in hand-to-hand combat, even if it charges or is armed with a spear while itself charged. Lasts until the target passes a Leadership test during the Recovery phase.',
          },
          {
            nom: 'A Thousand Voices',
            texte: 'Choose an enemy model within 12". It reduces its Leadership by D3+1 (minimum 2) if it is not Immune to Psychology. It must pass a Leadership test at the start of its turn to end the spell; the spell also breaks if the Seer suffers a wound. Can only affect one model at a time.',
          },
          {
            nom: "Shornaal's Temptation",
            texte: 'Choose an enemy model within 8" that is not Immune to Psychology. It must pass a Leadership test, or the Seer takes control of the target (control may be regained with a Leadership test at Recovery). Can only target one model at a time; if the Seer is hit in hand-to-hand combat or by shooting, he must pass a Leadership test for the spell not to end.',
          },
        ],
      },
      tchar: {
        nom: 'Rituals of Tchar',
        type: 'sorcery',
        sorts: [
          {
            nom: "Tchar's Blessing",
            texte: 'To be used before the game, once only. The Seer may not cast spells during the battle that follows. After the game, he gains D3 experience points if he was not taken Out of Action.',
          },
          { nom: 'Dispel Magic', texte: 'The Seer ends all active spell effects.' },
          {
            nom: 'Foresight',
            texte: 'To be used before the game, once only. Choose a warband; one of its Heroes, determined randomly, cannot take part in the current game. Models capable of casting spells or prayers are immune to this effect.',
          },
          {
            nom: 'Wrath of the Great Eagle',
            texte: 'Choose an enemy model within 12". It is hit by an attack with a Strength equal to the difference in experience points between the Seer and the target (max 10), normal armour save. If the victim has more XP than the Seer, the Seer is hit instead.',
          },
          {
            nom: "Tchar's Reward",
            texte: "The Seer gains +1 to any characteristic for every 10 experience points earned (each only once by this means). Lasts until the end of the Seer's next Shooting phase, after which the spell may be discarded.",
          },
          {
            nom: 'Slave to Chaos',
            texte: 'Range 12", Strength 2 hit with no armour save. If the model is taken Out of Action, roll immediately on the Serious Injury table; if it dies, it is replaced by a Pink Horror of Tzeentch until the end of the game, under the Seer\'s control (see Daemonic Bestiary). If the Seer is Stunned or taken Out of Action, the Horror vanishes into the Realm of Chaos.',
          },
        ],
      },
      onogal: {
        nom: 'Rituals of Onogal',
        type: 'sorcery',
        sorts: [
          {
            nom: 'Touch of Onogal',
            texte: "Against an opponent in base contact. If the model is taken Out of Action during the following combat phase, roll immediately on the Serious Injury table; if it dies, it is replaced by a Plaguebearer of Nurgle until the end of the game, under the Seer's control (see Daemonic Bestiary). If the Seer is Stunned or taken Out of Action, the Plaguebearer vanishes into the Realm of Chaos.",
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
            texte: 'Any enemy model within 12" of the Seer suffers a Strength 3 hit, with no armour save.',
          },
          {
            nom: 'Warty Skin',
            texte: 'The Seer gains a 2+ armour save that replaces his current save. Lasts until the start of his next Shooting phase.',
          },
          {
            nom: "Nurgle's Rot",
            texte: "Any enemy model in contact with the Seer must immediately pass a Toughness test or catch Nurgle's Rot (an incurable disease: at the start of each following battle, a Toughness test or lose 1 permanent point of Toughness, death if Toughness reaches 0; on a 6 on the Toughness roll, it is involuntarily transmitted to another warband member).",
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
    nom: 'Gunnery School of Nuln (1b)',
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
    nom: 'Dwarf Rangers (1b)',
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
    magie: {
      nom: 'Dwarf Runes',
      type: 'runes',
      note:
        "A Runesmith taps into the magic of the Old World by inscribing magical Runes onto items, granting them fantastic powers. Before each battle, he may attempt to inscribe his known Rune onto an item carried by a warband member (two items if the warband includes a Runesmith's Apprentice): roll 2D6, and on a result equal to or higher than the Difficulty, the item gains the listed bonus for that game only. On a roll of 2, the inscription fails completely and the item is destroyed (remove it from the warband's equipment, though it may be replaced before the next battle). Any other failure simply fails with no further consequence. Runic Jealousy: Rune bonuses never stack with each other or with a magic item — a fighter only ever benefits from one bonus of a given kind at a time.",
      sorts: [
        { nom: 'Rune of Stone', texte: 'Inscribed on armour, grants +1 to the armour save for the duration of the game.' },
        { nom: 'Rune of Cutting', texte: "Inscribed on a weapon, inflicts -1 to the armour save of any enemy struck by it." },
        { nom: 'Rune of Speed', texte: "Inscribed on a weapon, doubles the wielder's Initiative for the duration of the game." },
        { nom: 'Rune of Warding', texte: 'Inscribed on a belt, armour, or similar item, grants a special 4+ save against spells.' },
        { nom: 'Rune of Accuracy', texte: 'Inscribed on a weapon, grants +1 to hit with that weapon.' },
        { nom: 'Rune of Speeding', texte: 'Inscribed on boots, a belt, or similar item, grants +1 Movement for the duration of the game.' },
      ],
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
            nom: 'Dedicated Skills (in addition to the Special list)',
            texte:
              "When gaining a new Special skill, the Squig Herder may choose from his own list (Gaseous Squigs, Menace, Training) in addition to the warband's Special list — see the Skills tab on his sheet.",
          },
        ],
        competences_speciales: {
          squigs_gazeux: {
            nom: 'Gaseous Squigs',
            texte:
              "The Squig Herder feeds his Squigs a mix of rotten mushrooms, flint, and sharp pebbles to turn them into shrapnel. When an untrained Cave Squig (see Training) is taken Out of Action, roll a die. On a 1, it explodes, hitting every model within 1D6\" with a Strength 3 hit. That Squig is DEAD!",
          },
          menace: {
            nom: 'Menace',
            texte:
              'During the Movement phase, the Squig Herder may take a Leadership test. If successful, all Cave Squigs and Giant Squigs within 6" (12" with a squig prodder) may re-roll their Movement dice for that turn.',
          },
          entrainement: {
            nom: 'Training',
            texte:
              "The Squig Herder may train a particularly intelligent and vicious Squig as his personal bodyguard. The next Squig bought gains experience like a normal Henchman, re-rolling \"Lad's Got Talent\" results on the Henchman advance table. If the Squig Herder dies, the trained Squig is removed from the warband. If the trained Squig dies, a new trained Squig may be recruited. There is never more than one trained Squig in a warband, and it still counts towards the maximum number of Cave Squigs. Thanks to the Herder's special attention (kicks, prods), the trained Squig only dies on a roll of 1 after being taken Out of Action. In exchange, the trained Squig will fiercely defend its fallen master: if the Squig Herder is taken Out of Action and the trained Squig is under control, remove the latter from the table but treat any 36 - Stripped Bare, 61 - Captured!, or 65 - Sold to the Arena result as a Full Recovery instead.",
          },
        },
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
    competences_speciales: {
      producteur_de_champignons: {
        nom: 'Fungus Farmer',
        texte:
          "The industrious little git has a mushroom crop back at the cave. If the Hero doesn't search for rare items, he may pick D3-1 Mad Cap Mushrooms instead. There is a chance of getting none, as there is no guarantee they will be ready for harvest. Each Mad Cap Mushroom must be used in the next battle, and they cannot be sold or traded to other warbands — these are a special high yield/low shelf life crop.",
      },
      se_cacher_dans_lombre: {
        nom: 'Hide in Shadows',
        texte:
          'The sneaky Goblin has become an expert at concealing himself from enemies (and potential victims!). An enemy warrior attempting to detect this warrior when it is Hidden must halve their Initiative (round up) before measuring the distance.',
      },
      retiaire: {
        nom: 'Netter',
        texte:
          'The Goblin applies techniques learned hunting wild Cave Squigs in the depths of the mountains to disable charging enemies. Instead of their normal use, the Goblin may throw a Net they are equipped with at an enemy who is charging them. This reduces the charge range of the attacker by D6" as the charger either slows down to avoid the net, or gets tangled up in it. If this means the attacker cannot reach the Goblin, the charge is failed. Regardless of the outcome, the Net is lost when this skill is used.',
      },
      petit_vicelard: {
        nom: 'Sneaky Git',
        texte:
          'The Goblin specializes in attacking his targets from the shadows. He may charge an opponent from hiding, even if he cannot see the target. There is no need for an Initiative test, and the target may be over the normal 4" limit for charging unseen targets. If the charge is successful, the Goblin surprises his opponent, who will attack at half Weapon Skill and half Initiative, rounded up. This penalty lasts for the first round of combat only, as the opponent will swiftly recover their wits if the initial assault is survived.',
      },
      chevaucheur_de_squigs: {
        nom: 'Ride Squig',
        texte:
          'This Goblin can ride one of the warband\'s Cave Squigs, or even the Great Squig! The pair deploy as a single model. Standard mount rules are not used, although the Night Goblin counts as being mounted for the Cavalry Bonus rule (see spears and lances). While the Squig is ridden, it and the rider move as a single model using the Squig\'s movement rules, but attack separately in Close Combat. In this skill\'s text, "Squig" refers to both Cave Squigs and Great Squigs. If a shooting or close combat attack hits, roll 1D6 to see who is hit: 1-2 the rider; 3-6 the Squig. If the Squig is stunned or taken Out of Action, the rider crashes to the ground and takes a Strength 2 hit with no armor save. If the rider is stunned or taken Out of Action, the Squig reverts to normal Squig behavior. Either way, the rider counts as on foot for the rest of the battle. Squigs don\'t like being ridden. If the Movement roll is a double or triple, the rider must roll 1D6 and compare the result to his Strength: if higher, the rider is thrown off before the Squig moves away — he crashes to the ground, takes a Strength 2 hit with no armor save, and counts as on foot for the rest of the battle; if equal to or lower, the rider keeps his grip and stays on the Squig.',
      },
      infiltration: {
        nom: 'Infiltrate',
        texte:
          'A Night Goblin with this skill is always placed on the battlefield after the opposing warband has deployed. He may be deployed anywhere on the table, provided he is out of sight of the enemy and more than 12" from any enemy model. If both players have models with Infiltrate, roll 1D6 for each — the lowest result deploys first.',
      },
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
              "If included, the warband may own up to 2 War Beasts in total among the Estalian Warhound, the Barbary Ape (dedicated profiles, recruited as models), and the Tilean Hunting Hawk (special equipment for the Beastmaster, not a separate model). Recruited War Beasts count toward the warband's maximum size, must be bought when the warband is created (but can be replaced if killed), and may use the Beastmaster's Leadership within 6\". If the Beastmaster is killed or lost, War Beasts cannot be used until a Prospect is promoted into a new Beastmaster.",
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
      molosse_estalien: {
        nom: 'Estalian Warhound',
        regles_speciales: [
          { nom: '5+ Armour Save', texte: 'Benefits from a 5+ Armour Save thanks to its iron collar and padded barding.' },
          { nom: 'Never gains experience', texte: 'Like all War Beasts, the warhound stays at the same level throughout its career.' },
          { nom: 'Recovery', texte: 'If taken Out of Action: 1-2 Dead, 3-6 Alive (as a Henchman).' },
          {
            nom: 'Recruitment',
            texte:
              "May only be recruited if the warband includes a living Beastmaster. Must be bought when the warband is created (but can be replaced if killed); the warband may not own more than 2 War Beasts in total (Estalian Warhound, Barbary Ape, and Tilean Hunting Hawk combined).",
          },
        ],
      },
      singe_de_barbarie: {
        nom: 'Barbary Ape',
        regles_speciales: [
          {
            nom: 'Nimble',
            texte: 'Can climb any sheer surfaces without taking Initiative tests, and re-rolls all failed Diving Charge tests. Unlike other animals, the ape can enter buildings.',
          },
          {
            nom: '5+ Ward Save',
            texte: 'Thanks to its agility, the ape has a 5+ Ward Save against any and all wounds it suffers in melee, shooting, magic, or even falling damage.',
          },
          { nom: 'Never gains experience', texte: 'Like all War Beasts, the ape stays at the same level throughout its career.' },
          { nom: 'Recovery', texte: 'If taken Out of Action: 1-2 Dead, 3-6 Alive (as a Henchman).' },
          {
            nom: 'Recruitment',
            texte:
              "May only be recruited if the warband includes a living Beastmaster. Must be bought when the warband is created (but can be replaced if killed); the warband may not own more than 2 War Beasts in total (Estalian Warhound, Barbary Ape, and Tilean Hunting Hawk combined).",
          },
        ],
      },
    },
    equipement: {
      heros: {
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
        nom: 'Pestilens Sorcerer',
        regles_speciales: [
          { nom: 'Sorcerer', texte: 'The Pestilens Sorcerer is a spellcaster who uses the Magic of the Horned Rat.' },
        ],
      },
      moine_de_la_peste: { nom: 'Plague Monk' },
      initie_de_la_peste: { nom: 'Monk Initiate' },
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
              "If the warband includes a Pestilens Sorcerer equipped with a Familiar Rat Scroll, a giant rat may be transformed into a Familiar Rat before the battle (see Special Equipment). Familiar Rat profile: M6 WS2 BS0 S3 T3 W1 I4 A1 Ld4, with no weapons or armour. It gains experience like a Henchman, but its 10-12 \"Lad's Got Talent\" result is replaced by \"Enhanced Spellcasting: if the Pestilens Sorcerer is within 6\" of the Familiar Rat, he gains a cumulative +1 bonus to his casting roll.\" If the Pestilens Sorcerer dies, the Familiar Rat reverts to its Giant Rat form.",
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
          nom: 'Children of the Horned Rat',
          texte: "Usable once before each game. Summons D3 Giant Rats placed within 6\" of the Sorcerer; these rats do not count towards the warband's maximum model count.",
        },
        { nom: 'Gnawdoom', texte: 'Causes 2D6 Strength 1 hits on a single model within 8" of the Sorcerer.' },
        {
          nom: 'Black Fury',
          texte: 'The Sorcerer may immediately charge an enemy model of his choice within 12" (ignoring terrain and other models). He gains 2 extra Attacks and +1 Strength during the hand-to-hand combat phase of this turn only.',
        },
        {
          nom: 'Eye of the Warp',
          texte: 'All standing models in contact with the Sorcerer must immediately make a Leadership test. Those who fail suffer a Strength 3 hit and must run 2D6" in the direction opposite the Sorcerer.',
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
  bandits_du_hochland: {
    nom: 'Hochland Bandits (1b)',
    regles_speciales: [
      {
        nom: 'Powder Is Expensive!',
        texte:
          'Bandits are often too poor to buy or maintain costly equipment such as black powder weapons. Only Heroes may buy them (black powder weapons available only via the Duelist equipment list); Henchmen may never buy them.',
      },
      {
        nom: 'Penny-Pinchers',
        texte:
          "Hochland Bandits know how to save their gold: when determining the warband's Income, shift the warband size one column to the left (a warband of 1 to 3 members always uses the first column). For reference only, not automated.",
      },
      {
        nom: 'Fence',
        texte:
          "In addition to half the base price of the item, when a Hochland Bandit sells equipment, he also receives half of the variable part of the item's price. For reference only, not automated.",
      },
      {
        nom: 'Hired Swords',
        texte: 'Bandits may hire any Hired Sword available to a human Mercenary warband.',
      },
    ],
    profils: {
      prince_des_bandits: {
        nom: 'Bandit Prince',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warrior within 6" of the Bandit Prince may use the latter\'s Leadership for their Leadership tests.' },
        ],
      },
      brigand: {
        nom: 'Footpad',
        regles_speciales: [
          {
            nom: 'Concealment',
            texte:
              "Enemies of a Footpad find him extremely difficult to detect before he strikes. If an enemy warrior wishes to charge a Footpad he cannot see (and who has not been declared hidden), he must subtract 1 from his Initiative before making his Initiative test (a roll of 6 is always a failure). In addition, the detection range for a hidden Footpad is halved.",
          },
        ],
      },
      ferrailleur: {
        nom: 'Duelist',
        regles_speciales: [
          {
            nom: 'Master Swordsman',
            texte:
              "If equipped with a weapon or piece of armour that grants a parry, the Duelist succeeds in parrying an enemy blow on a result equal to or higher than the opponent's to-hit roll, not only on a strictly higher result as with a normal parry.",
          },
          {
            nom: 'Weapon Lore',
            texte:
              "The weapons on the Duelist's equipment list only represent those he can start with. A Duelist may use any hand-to-hand or missile weapon that warband members can find.",
          },
        ],
      },
      demagogue: {
        nom: 'Huckster',
        regles_speciales: [
          {
            nom: 'Persuasive Manner',
            texte:
              'When an enemy warrior attempts to charge a member of the Huckster\'s warband within 12" of him, the enemy must first pass a Leadership test, or the charge fails (as if he had failed to charge an enemy that causes Fear). Creatures subject to Stupidity and animals (as well as the Undead) are immune.',
          },
          {
            nom: 'Shrewd Manager',
            texte:
              'Between games, the player may call on the Huckster to swindle the local populace. Roll 1D6. On a 2-6, the scam succeeds and the warband gains 2D6 Gold Crowns. On a 1, the Huckster must flee: he misses the next game and does not take part in the Exploration phase. For reference only, not automated.',
          },
        ],
      },
      malfrat: {
        nom: 'Thug',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 5.' }],
      },
      braconnier: {
        nom: 'Poacher',
        regles_speciales: [
          { nom: 'Trailblazers', texte: 'Allows the warband to re-roll, for each Poacher, 1D6 during the Exploration phase.' },
        ],
      },
      detrousseur: {
        nom: 'Looter',
        regles_speciales: [
          {
            nom: 'Looting the Dead',
            texte:
              'At the end of a battle, for each friendly or enemy warrior who died and must be removed from the warband rosters, roll 1D6 per Looter in the warband. On a 4+, all of the dead warrior\'s equipment is recovered for the warband (limited to one corpse per Looter). For reference only, not automated.',
          },
        ],
      },
      sans_coeur: {
        nom: 'Blackheart',
        regles_speciales: [
          { nom: 'Hardened', texte: 'Immune to Fear and never has to take an all alone test.' },
        ],
      },
      racaille: {
        nom: 'Gutterscum',
        regles_speciales: [
          { nom: 'Totally Unskilled', texte: 'Gutterscum never gain experience.' },
          { nom: 'Recruitment', texte: 'Bought in groups of 5.' },
        ],
      },
    },
    competences_speciales: {
      banditisme: {
        nom: 'Banditry',
        texte:
          "Instead of searching for Rare equipment, the Hero may engage in banditry. Roll 1D6. On a 2-6, the banditry succeeds and the Hero adds 1D6+1 Gold Crowns to the warband's pool. On a 1, roll on the Serious Injury table for the Hero, as if he had been taken Out of Action. Cannot be combined with Shrewd Manager.",
      },
      cache_dans_lombre: {
        nom: 'Hidden in the Shadows',
        texte: 'An enemy warrior attempting to detect the hidden Hero must halve his Initiative (rounding up) before measuring the detection range.',
      },
      bond_arriere: {
        nom: 'Backward Leap',
        texte:
          'If the warrior is engaged in hand-to-hand combat at the start of his Movement phase and is neither Knocked Down nor Stunned, he may attempt a leap to break off combat via an Initiative test. On a failure, he automatically strikes last this turn. On a success, he is moved 1" away from the enemy warrior and may act normally (and may even charge again).',
      },
      tir_silencieux: {
        nom: 'Silent Shot',
        texte:
          "If hidden, the Hero may shoot or cast spells while remaining hidden. If his target is not immediately taken Out of Action, it must make an Initiative test to spot him. Does not work with a black powder weapon.",
      },
      ventriloque: {
        nom: 'Ventriloquist',
        texte: 'If an enemy warrior attempts to detect the hidden Hero, roll 1D6. On a 4+, the Hero is not spotted and remains hidden.',
      },
    },
    equipement: {
      bandits: {
        armes_cac: ['first free', 'Hammer', undefined, undefined, undefined, undefined],
        armes_tir: ['Throwing Axe, counted as a throwing knife'],
      },
      pleutres: {
        armes_cac: ['first free', undefined],
      },
      ferrailleurs: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined],
        armes_tir: ['40gc per pair', '60gc per pair'],
      },
      braconniers: {
        armes_cac: ['first free', undefined],
      },
    },
  },
  orc_mob: {
    nom: 'Orc Mob (1a)',
    regles_speciales: [
      {
        nom: 'Disreputable Sorts',
        texte:
          'Many Hired Swords would refuse to work for Orcs, knowing the orcs could turn on them at any moment. An Orc warband may therefore only hire the following Hired Swords: Gladiators, Ogre Bodyguards, or Wizards.',
      },
      {
        nom: 'Animosity',
        texte:
          'Orcs and Goblins love to fight, but do not always know exactly who against. At the start of each Orc player\'s turn, roll 1D6 for each Henchman (Orc or Goblin) not engaged in hand-to-hand combat. On a result of 1, roll 1D6 on the following table. 1 "Say that again!" — the warrior immediately charges the nearest Henchman, Orc, Goblin, or Hired Sword within charge range and fights a round of hand-to-hand combat; at the end of the turn, the models are moved 1" apart and are no longer engaged (unless this same result comes up again on a later failure). If no one is within charge range and the model has a missile weapon, it shoots at the nearest target; otherwise, or if the nearest model is a Hero, it acts as per the 2-5 result. In all cases it defends itself normally if engaged in hand-to-hand combat. 2-5 "Wot did \'e say?" — the warrior spends the whole turn grumbling at everyone and does nothing else (he defends himself normally if engaged in hand-to-hand combat). 6 "I\'ll show \'em!" — the model must advance as fast as possible towards the nearest enemy and charge if possible; if no enemy is visible, it makes an additional normal Move, and if this brings it within charge range, it must charge on the following Movement phase.',
      },
    ],
    profils: {
      chef_orque: {
        nom: 'Orc Boss',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warband member within 6" of the Orc Boss may use the latter\'s Leadership for their tests.' },
        ],
      },
      chamane_orque: {
        nom: 'Orc Shaman',
        regles_speciales: [
          { nom: 'Sorcerer', texte: 'A Shaman is a spellcaster who uses Waaagh! Magic (see Magic).' },
          { nom: 'No Armour', texte: 'A Shaman may be equipped with weapons chosen from the Orc equipment list. He never wears armour.' },
        ],
      },
      kosto: { nom: 'Bruiser' },
      boyz_orque: {
        nom: 'Orc Boyz',
        regles_speciales: [
          { nom: 'Animosity', texte: "Orc Boyz are subject to animosity (see the warband's special rules)." },
          { nom: 'Recruitment', texte: 'Any number. Bought in groups of 1 to 5.' },
        ],
      },
      guerrier_gobelin: {
        nom: 'Goblin Warrior',
        regles_speciales: [
          {
            nom: 'Animosity',
            texte: 'Goblin Warriors are subject to animosity. A Goblin who fails his Animosity test and rolls a 1 on the table will never charge an Orc: he will use his missile weapon if he has one.',
          },
          {
            nom: 'Not Like Orcs',
            texte: 'When determining whether an Orc warband must take a Rout test, each Goblin or Squig taken Out of Action counts as half a model.',
          },
          {
            nom: 'Less Than Nothing',
            texte: "If a Goblin Warrior rolls the Lad's Got Talent result, the Boss kills him on the spot. Remove him from the warband roster.",
          },
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5. Can never outnumber the Orcs (Heroes included) by more than two to one.' },
        ],
      },
      squig_des_cavernes: {
        nom: 'Cave Squig',
        regles_speciales: [
          {
            nom: 'Movement',
            texte:
              'The Squig\'s Movement characteristic is not fixed (M=0 above is only a placeholder): roll 2D6 whenever you want to move a Squig. They never run and never declare a charge normally; they may use their 2D6" move to reach base contact with an opponent, and are then considered to have charged for the following Combat phase.',
          },
          {
            nom: 'Heel!',
            texte:
              'Each Squig must stay within 6" of a Goblin Warrior model at all times. If it finds itself more than 6" from any Goblin at the start of the Movement phase, it goes wild: from then on, move it 2D6" in a random direction during each following Movement phase; if it touches a model (friend or foe), it engages it in hand-to-hand combat. It is no longer controlled by the Orc player for the rest of the game.',
          },
          { nom: 'Not Like Orcs', texte: "Each Goblin or Squig taken Out of Action counts as half a model for the warband's Rout tests." },
          { nom: 'Animals', texte: 'Squigs are animals (well, almost...) and therefore never gain experience.' },
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5. Never more numerous than the Goblin Warriors.' },
          { nom: 'Equipment', texte: 'Squigs carry no weapons or armour.' },
        ],
      },
      troll: {
        nom: 'Troll',
        regles_speciales: [
          { nom: 'Fear', texte: 'Trolls are frightening creatures and cause Fear.' },
          { nom: 'Stupidity', texte: 'Trolls are subject to the Stupidity rules.' },
          {
            nom: 'Regeneration',
            texte:
              'Whenever a Troll suffers a Wound, of any kind, roll 1D6: on a 4+, the Wound is ignored. Trolls cannot regenerate wounds caused by fire or fire-based spells. They do not roll on the Serious Injury table at the end of the game.',
          },
          { nom: 'Zero IQ', texte: 'Trolls never gain experience.' },
          {
            nom: 'Always Hungry',
            texte: 'The warband must spend 15gc after each battle to feed the Troll, or sacrifice 2 Goblins or Squigs. If the Troll is not fed enough, it leaves the warband permanently.',
          },
          {
            nom: 'Vomit',
            texte: "Instead of his normal attacks, a Troll may regurgitate his stomach fluids: a single attack that hits automatically, resolved at Strength 5, ignoring armour saves.",
          },
          { nom: 'Large Target', texte: 'Trolls are Large Targets, as defined in the Shooting rules.' },
          { nom: 'Equipment', texte: 'May never be given weapons or armour (sometimes carries a large club with no effect on the game).' },
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
      tetdure: {
        nom: 'Thick Skull',
        texte:
          "The Hero benefits from a special 3+ save on 1D6 to avoid being Stunned. If the save is successful, the model is simply Knocked Down instead. If the Orc also wears a helmet, this save becomes 2+ instead of 3+ (replacing the helmet's usual special rule).",
      },
      waaagh: { nom: 'Waaagh!', texte: 'The warrior adds +1D3" to his charge range.' },
      dur_a_cuire: { nom: 'Tough as Nails', texte: "Increases the model's armour save by +1." },
      coup_dboule: { nom: 'Headbutt', texte: 'Any model Knocked Down in hand-to-hand combat by this warrior is treated as Stunned.' },
      on_y_va: { nom: "Let's Go!", texte: 'The model does not have to take a Fear test when charging.' },
      revnez_ici: {
        nom: "Come Back 'Ere!",
        reserve_a: 'Orc Boss only',
        texte: 'The warband may re-roll any failed Rout test as long as the Orc Boss has not been taken Out of Action.',
      },
    },
    equipement: {
      orques: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined, undefined],
      },
      gobelins: {
        armes_cac: ['first free', undefined, undefined, undefined],
      },
    },
    magie: {
      nom: 'Waaagh! Magic',
      type: 'sorcery',
      note: 'Spells invoked through rituals resembling bellowed hollers, calling out to the Orc gods, Gork and Mork.',
      sorts: [
        {
          nom: "Get 'Im!",
          texte: "Any Orc or Goblin within 4\" of the Shaman strikes automatically first in hand-to-hand combat, regardless of circumstances. Lasts until the Shaman is Knocked Down, Stunned, or taken Out of Action.",
        },
        {
          nom: 'Move It!',
          texte: 'Range 8". Move an enemy model 1D6" in the direction away from the Shaman. If it collides with another model or a building, both suffer a Strength 3 hit. Cannot be used against models engaged in hand-to-hand combat.',
        },
        {
          nom: 'Zzzap!',
          texte: 'Range 12". Inflicts 1D3 Strength 4 hits on the nearest enemy model, no armour save allowed.',
        },
        {
          nom: 'Get Lost!',
          texte: 'No enemy may charge the Shaman during the next turn. If the Shaman was engaged in hand-to-hand combat, he may immediately be moved 4".',
        },
        {
          nom: "Bring It 'Ere!",
          texte: "A ghostly club appears in the Shaman's hand: counts as an ordinary club, adds +2 Strength and +1 Attack. Lasts until the Shaman suffers a Wound.",
        },
        {
          nom: "Gork's Fire",
          texte: 'Range 12". Two bolts of green flame burst from the Shaman\'s nostrils towards the nearest enemy model. Each bolt inflicts 1D3 Strength 3 hits; both bolts may strike the same target or be split between the two nearest enemy models.',
        },
      ],
    },
  },
  norses: {
    nom: 'Norses (1b)',
    regles_speciales: [
      {
        nom: 'Sailors',
        texte:
          "Norses are excellent navigators. All gain +2 Strength when rowing (see The Script of Sigmar scenario rule, Town Cryer #9; otherwise, apply this bonus to the boat's Movement).",
      },
    ],
    profils: {
      jarl: {
        nom: 'Jarl',
        regles_speciales: [{ nom: 'Leader', texte: 'Any model within 6" of the Jarl may use his Leadership for their tests.' }],
      },
      berserk: {
        nom: 'Berserker',
        regles_speciales: [
          { nom: 'Berserker', texte: 'Subject to Frenzy (see Psychology).' },
          { nom: 'Equipment', texte: 'May never wear armour.' },
        ],
      },
      wulfen: {
        nom: 'Wulfen',
        regles_speciales: [
          { nom: 'Fear', texte: 'A terrifying creature that causes Fear.' },
          { nom: 'Bestial', texte: 'Immune to Psychology; too uncontrollable to become warband Leader.' },
          {
            nom: 'Equipment',
            texte: 'A mass of claws and fangs, never uses weapons or armour. Suffers no penalty for fighting unarmed.',
          },
        ],
      },
      bondis: { nom: 'Bóndis' },
      maraudeur_norse: { nom: 'Norse Marauder' },
      chasseur_norse: { nom: 'Norse Hunter' },
      loup: {
        nom: 'Wolf',
        regles_speciales: [
          { nom: 'Animals', texte: 'Wolves never gain experience.' },
          {
            nom: 'Pack Leader',
            texte: 'Submit to the Wulfen; without a Wulfen in the warband, Wolves cannot be fielded until he is replaced.',
          },
          { nom: 'Equipment', texte: 'Never use weapons.' },
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
      expert_du_bouclier: {
        nom: 'Shield Master',
        texte: 'Equipped with a shield, may perform a parry in addition to the 6+ armour save.',
      },
      frappe_destructrice: { nom: 'Crushing Blow', texte: "This Hero's attacks cannot be parried." },
      charge_berserk: {
        nom: 'Berserk Charge',
        texte: 'Armed with an axe or a two-handed weapon, may re-roll any failed to-hit roll when charging.',
      },
      jargon_des_batailles: {
        nom: 'Battle Tongue',
        reserve_a: 'Warband Leader only',
        texte: 'The range within which allies may use his Leadership increases from 6" to 12".',
      },
      intrepidite: {
        nom: 'Barbarian Courage',
        texte: 'Never has to take an all alone test and may re-roll failed Fear tests.',
      },
    },
    equipement: {
      heros_armes: {
        armes_cac: ['first free', 'Hammer', undefined, undefined, undefined, undefined],
        armes_tir: ['Throwing axes, counted as throwing knives'],
        divers: [
          'Mount — see the Mounted Warriors article',
          'Mount — see the Mounted Warriors article',
          'Mount — see the Mounted Warriors article',
        ],
      },
      hommes_de_main: {
        armes_cac: ['first free', 'Hammer', undefined, undefined, undefined, undefined],
        armes_tir: ['Throwing axes, counted as throwing knives'],
      },
      chasseurs_norses: {
        armes_cac: ['first free', 'Hammer', undefined, undefined, undefined, undefined],
      },
    },
  },
  cult_of_the_possessed: {
    nom: 'Cult of the Possessed (1a)',
    regles_speciales: [
      {
        nom: 'Mutation Table',
        texte:
          'Reserved for Mutants and Possessed, purchasable only at recruitment (cannot be bought afterwards). The first mutation is bought at normal price; subsequent mutations for the same model cost double — see his Equipment list.',
      },
      {
        nom: 'Rewards of the Lord of Shadows',
        texte:
          'Optional rule: a Magister or Mutant who has accumulated enough experience may roll 2D6 on this table instead of choosing a skill, representing a pilgrimage to the Pit. 2: Wrath of the Lord of Shadows! The warrior suffers so many mutations that he loses all trace of humanity and disappears. 3-6: Nothing happens. 7-8: Major Mutation (roll 1D6: on a 1, lose 1 point in a characteristic of choice; on a 2+, choose a mutation from the Mutation Table). 9-10: Armour of Chaos — base 4+ save with no effect on Movement, and does not prevent casting spells. 11: Daemon Weapon — +1 Strength in hand-to-hand combat and +1 to hit with it, taking whatever form the bearer chooses. 12: Possessed! A daemon takes possession of the warrior: +1 WS, +1 S, +1 Attack, and +1 Wound (beyond the normal maximums), but he loses D3 skills of the player\'s choice and can no longer use any weapon or armour other than Chaos Armour or Daemon Weapons.',
      },
    ],
    profils: {
      magister: {
        nom: 'Magister',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any model within 6" of the Magister may use the latter\'s Leadership for their tests.' },
          { nom: 'Sorcerer', texte: 'The Magister is a sorcerer who uses the Rituals of Chaos (see Magic).' },
        ],
      },
      possede: {
        nom: 'Possessed',
        regles_speciales: [
          { nom: 'Fear', texte: 'The Possessed are hideous, formless creatures that cause Fear.' },
          {
            nom: 'Mutations',
            texte: 'The Possessed may start the game with one or more mutations (see the Mutation Table special rule). Cost: 90gc + the cost of mutations bought at recruitment.',
          },
          { nom: 'Equipment', texte: 'None. The Possessed never use weapons or armour.' },
        ],
      },
      mutant: {
        nom: 'Mutant',
        regles_speciales: [
          {
            nom: 'Mutations',
            texte: 'Each Mutant must start the game with one or more mutations (see the Mutation Table special rule). Cost: 25gc + the cost of the mutations.',
          },
        ],
      },
      initie: {
        nom: 'Initiate',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Your warband may include as many Initiates as you like.' }],
      },
      damne: {
        nom: 'The Damned',
        regles_speciales: [
          {
            nom: 'Deranged',
            texte: 'The Damned have been driven mad by possession and know no fear. They automatically pass all Leadership tests they might have to take.',
          },
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' },
        ],
      },
      homme_bete: {
        nom: 'Beastman',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' }],
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
      culte_des_possedes: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined],
      },
      damnes: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined],
      },
    },
    magie: {
      nom: 'Rituals of Chaos',
      type: 'sorcery',
      sorts: [
        {
          nom: 'Vision of Torment',
          texte:
            'Range 6", cast on the nearest enemy (a model in base contact if the sorcerer is engaged in hand-to-hand combat). The victim is immediately Stunned; if it cannot be Stunned, it is Knocked Down instead.',
        },
        {
          nom: 'Eye of God',
          texte:
            'Usable once per battle. Choose any model within 6", friend or foe, and roll 1D6: 1 = the model is immediately taken Out of Action (no roll on the Serious Injury table); 2-5 = +1 to a characteristic of the caster\'s choice for the battle; 6 = +1 to all characteristics for the duration of the battle.',
        },
        {
          nom: 'Dark Blood',
          texte:
            "Range 8\", causes D3 Strength 5 hits on the first model in its path. The sorcerer must then roll on the Injury table for his own Wound (an Out of Action result is treated as Stunned).",
        },
        {
          nom: 'Lure of Chaos',
          texte:
            "Range 12\", cast on the nearest enemy model. Compare 1D6+Ld of the sorcerer to 1D6+Ld of the target; if the sorcerer wins, he takes control of his victim until it passes a Leadership test during the opponent's Recovery phase. The controlled model cannot commit suicide but may attack its own side, and will not fight the sorcerer's warband.",
        },
        {
          nom: 'Wings of Darkness',
          texte:
            'The sorcerer may immediately move anywhere within 12", even into contact with the enemy (counts as having charged). If he engages a fleeing enemy, he inflicts an automatic hit during the hand-to-hand combat phase, and the opponent then flees again if it survives.',
        },
        {
          nom: 'Word of Pain',
          texte: 'All models within 3" of the sorcerer, friend or foe, suffer a Strength 3 hit with no armour save.',
        },
      ],
    },
  },
  reiklanders: {
    nom: 'Reiklander Mercenaries (1a)',
    regles_speciales: [
      {
        nom: 'Leader at 12"',
        texte:
          'Reiklander mercenaries are accustomed to the demands of military discipline and develop strong loyalty towards their officers. Warriors may use their captain\'s Leadership if he is within 12" instead of the usual 6".',
      },
      {
        nom: 'Marksmen +1 BS',
        texte:
          'A strong tradition of martial training is responsible for the high degree of accuracy of Reiklander archers. All Marksmen add +1 to their Ballistic Skill, whether hired at warband creation or afterwards.',
      },
    ],
    profils: {
      capitaine_mercenaire: {
        nom: 'Mercenary Captain',
        regles_speciales: [
          {
            nom: 'Leader',
            texte:
              'Any warrior within 12" of the Mercenary Captain (instead of 6", thanks to the Reiklanders\' Leader at 12" rule) may use the latter\'s Leadership for their Leadership tests.',
          },
        ],
      },
      champion: { nom: 'Champion' },
      recrue: { nom: 'Recruit' },
      guerrier: {
        nom: 'Warrior',
        regles_speciales: [{ nom: 'Recruitment', texte: 'As many as you like. Bought in groups of 1 to 5.' }],
      },
      tireur: {
        nom: 'Marksman',
        regles_speciales: [
          {
            nom: 'Marksmen +1 BS',
            texte: "This Marksman benefits from the Reiklander racial bonus of +1 Ballistic Skill (already included in his Ballistic Skill above).",
          },
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' },
        ],
      },
      bretteur: {
        nom: 'Fencer',
        regles_speciales: [
          {
            nom: 'Expert Swordsman',
            texte:
              'Fencers are so skilled with their weapons that, when they charge, they may re-roll failed to-hit rolls. This applies only when equipped with ordinary swords, not two-handed swords or other weapons.',
          },
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' },
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
      mercenaires: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        armes_tir: [undefined, '30gc per pair', '50gc per pair', undefined],
      },
      tireur: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined],
        armes_tir: [undefined, '30gc per pair', undefined, undefined, undefined, undefined, undefined],
      },
    },
  },
  escorteurs_imperiaux: {
    nom: 'Imperial Outriders (1b)',
    regles_speciales: [
      {
        nom: 'Hired Swords',
        texte: 'Imperial Outriders may only be accompanied by mounted Hired Swords (the Freelance Knight and Roadwardens). Highwaymen may not be hired.',
      },
      {
        nom: 'Dense Terrain',
        texte: 'Imperial Escorts may ignore the normal limit of two mounts per warband within areas of dense terrain.',
      },
      {
        nom: 'Two-Weapon Fighting',
        texte:
          'Mounted warriors may not fight with two weapons, although a shield or buckler may be used normally. Two-handed weapons are not allowed. Using a pistol during the first round of hand-to-hand combat replaces the model\'s usual weapon.',
      },
      {
        nom: 'Mounts',
        texte:
          'All warband members are automatically mounted on a Horse (included in their recruitment cost). The Horse may be upgraded to a Warhorse for an additional cost where indicated. See the Cavalry rules (Mounted Warriors article) for the full rules on mounted warriors.',
      },
    ],
    profils: {
      chevalier: {
        nom: 'Knight',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warband member within 6" of the Knight may use the latter\'s Leadership for their tests.' },
          { nom: 'Mount', texte: 'The Knight rides a Horse (included in his cost). May be upgraded to a Warhorse for +40gc.' },
        ],
      },
      escorteur: {
        nom: 'Outrider',
        regles_speciales: [
          { nom: 'Mount', texte: 'An Escort rides a Horse (included in his cost). May be upgraded to a Warhorse for +40gc.' },
        ],
      },
      eclaireur: {
        nom: 'Scout',
        regles_speciales: [{ nom: 'Mount', texte: 'A Scout rides a Horse (included in his cost).' }],
      },
      pistolier: {
        nom: 'Pistolier',
        regles_speciales: [
          { nom: 'Ride', texte: 'Pistoliers already have the Ride skill.' },
          { nom: 'Mount', texte: 'Pistoliers ride Horses (included in their cost).' },
        ],
      },
      hussard: {
        nom: 'Hussar',
        regles_speciales: [
          { nom: 'Ride', texte: 'Hussars already have the Ride skill.' },
          {
            nom: 'Trample',
            texte: 'Hussars already have the Trample skill: they make an additional Strength 4 Attack when they charge an enemy on foot.',
          },
          { nom: 'Mount', texte: 'Hussars ride Horses (included in their cost). May be upgraded to Warhorses for +40gc.' },
        ],
      },
      palefrenier: {
        nom: 'Groom',
        regles_speciales: [
          { nom: 'Ride', texte: 'Grooms already have the Ride skill.' },
          {
            nom: 'Horse Trainer',
            texte:
              'Any animal within 6" of the Groom may use his Leadership instead of its own (the player chooses if the Leader is also in range). Stubborn animals in contact with him ignore the effects of the Stubborn rule.',
          },
          { nom: 'Mount', texte: 'Grooms ride Horses (included in their cost).' },
        ],
      },
    },
    equipement: {
      base: {
        armes_cac: ['first free', 'Hammer', undefined, undefined, undefined, undefined, undefined],
      },
      armes_tir_escorteurs: {
        armes_tir: ['30gc per pair', undefined, undefined, undefined],
      },
      armes_tir_eclaireurs: {
        armes_tir: ['Throwing knives'],
      },
    },
  },
  hors_la_loi_de_stirwood: {
    nom: 'Outlaws of Stirwood Forest (1b)',
    regles_speciales: [
      {
        nom: 'Archers',
        texte:
          'All warriors in a Stirwood Forest Outlaws warband must be equipped with a bow. However, they may never carry or use any other missile weapon. So even if an Outlaw gains skills that would allow him to use additional missile weapons, he may not use them. The only exception to this rule is the Cleric, who may choose to carry a bow, but is not required to do so.',
      },
      {
        nom: 'Hired Swords',
        texte: 'The following Hired Swords are not available to the Outlaws: Bounty Hunters, Wolf Priest of Ulric, Norse Shamans, and Dark Elf Assassins.',
      },
    ],
    profils: {
      chef_hors_la_loi: {
        nom: 'Bandit Leader',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any model within 6" of the Bandit Leader may use the latter\'s Leadership to make their tests.' },
        ],
      },
      moine_stirwood: {
        nom: 'Cleric',
        regles_speciales: [
          { nom: 'Recruitment', texte: 'The warband may include one Cleric, but he must replace a Stirwood Champion or a Petty Thief.' },
          {
            nom: 'Disciple of Sigmar',
            texte:
              'The Cleric has devoted his life to the service of Sigmar and may use the Prayers of Sigmar. Like a Warrior Priest of the Repurgators, he is also subject to certain restrictions applicable to disciples of Sigmar, and therefore cannot learn Sorcery or Magic. Since Prayers are not considered spells, a Cleric may wear armour if he wishes.',
          },
        ],
      },
      champion_de_stirwood: { nom: 'Stirwood Champion' },
      petit_voleur: { nom: 'Petty Thief' },
      hors_la_loi: { nom: 'Outlaw' },
      tireur: { nom: 'Marksman' },
    },
    equipement: {
      hors_la_loi: {
        armes_cac: ['first free', 'Hammer, Mace, or Staff', undefined, undefined, undefined, undefined],
      },
    },
    magie: {
      nom: 'Prayers of Sigmar',
      type: 'prayer',
      note:
        'Priests of Sigmar can perform many miracles: healing wounds, encouraging their comrades, or banishing daemonic creatures and the Undead. Prayers are not considered spells: an armoured warrior may therefore use them, and special protections against spells do not affect them.',
      sorts: [
        {
          nom: 'The Hammer of Sigmar',
          texte:
            "This weapon of faith, holding the almighty power of Sigmar's divine justice, shines with an intense golden light. The bearer gains +2 Strength in hand-to-hand combat, and all hits he causes deal double damage (1 Wound = 2 Wounds lost, for example). The priest must test at every Shooting phase if he wishes to use the Hammer.",
        },
        {
          nom: 'Heart of Steel',
          texte:
            "As the three words of power are spoken, an aura of glory emanates from Sigmar's servant. The courage of the faithful is strengthened by the presence of the God of War. Every allied warrior within 8\" of the caster becomes immune to Fear and all alone tests. In addition, the whole warband gains +1 to all its Rout tests. The effects of this prayer cannot be stacked if cast multiple times. Its effects last until the caster is taken Out of Action.",
        },
        {
          nom: 'Soul Fire',
          texte:
            "Sigmar's wrath is made manifest. Purifying flames surround the priest and sweep away those who resist the furious justice of the God-Emperor! Every enemy model within 4\" of the priest suffers a Strength 3 hit with no armour save. Worshippers of darkness and Chaos are especially vulnerable to Sigmar's sacred power: the hit suffered by the Undead and the Possessed is Strength 5 instead.",
        },
        {
          nom: 'Shield of Sigmar',
          texte:
            'A shield of pure white light appears before the priest of Sigmar, protecting him for as long as his faith remains unshaken. The priest is immune to all spells. Roll 1D6 at the start of each turn during the Recovery phase. On a 1 or 2, the shield dissipates.',
        },
        {
          nom: 'Laying On of Hands',
          texte:
            "Placing his hands upon a wounded comrade, Sigmar's servant implores his Lord to heal the warrior's wounds. Any model within 2\" of the priest (himself included) may be healed and recovers all lost Wounds. In addition, friendly models within 2\" who are Stunned or Knocked Down immediately regain their senses, get back up, and continue fighting normally.",
        },
        {
          nom: 'Armour of the Righteous',
          texte:
            "Impenetrable armour covers the priest, and the blazing image of a two-tailed comet burns above his head. The priest gains a 2+ save that replaces his normal armour save. In addition, he causes Fear in his enemies and is himself immune to it. The power of the Armour of the Righteous lasts until the start of the priest's next Shooting phase.",
        },
      ],
    },
  },
  gardiens_de_chapelle_bretonniens: {
    nom: 'Bretonnian Chapel Guardians (1c)',
    regles_speciales: [
      {
        nom: 'Chivalry',
        texte: "No Knight may use a missile weapon (except holy water), nor resort to poison, drugs, or spells; prayers remain permitted.",
      },
      {
        nom: "The Lord's Favour",
        texte:
          'Upon joining the warband, a Knight may acquire ONE item only from among warhorse / light armour / heavy armour at half price. This item may not be traded, given away, or sold, and is removed from the warband (returned or buried) if the Knight dies.',
      },
      {
        nom: 'Virtue of Purity',
        texte:
          'Knights with this virtue may never voluntarily leave combat unless Knocked Down; they are immune to non-magical effects such as All Alone, but spells/magical effects that force them to flee affect them normally.',
      },
    ],
    profils: {
      chevalier_de_la_quete: {
        nom: 'Questing Knight',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warband member within 6" may use his Leadership for their tests.' },
          { nom: 'Knight', texte: 'Has the Chivalry, the Lord\'s Favour, and Virtue of Purity rules.' },
          { nom: 'Horsemanship', texte: 'Starts with the Ride – Warhorse skill.' },
          { nom: 'Vow of Poverty', texte: 'May never take a cavalry lance.' },
        ],
      },
      damoiselle: {
        nom: 'Damsel',
        regles_speciales: [
          {
            nom: 'Prayer to the Lady',
            texte: "Starts with a Prayer randomly drawn from the Prayers of the Lady list and may learn others.",
          },
        ],
      },
      chevalier_errant: {
        nom: 'Knight Errant',
        regles_speciales: [
          { nom: 'Knight', texte: "Has the Chivalry, the Lord's Favour, and Virtue of Purity rules." },
          { nom: 'Vain', texte: 'Refuses to wear a helmet.' },
          {
            nom: 'Impetuous',
            texte:
              "After charges are declared, if he is not already engaged and has not charged this turn, he must charge a standing enemy within range if able (likewise if his original target, now Knocked Down or Stunned, is no longer valid). A Leadership test (usable via the Leader within range) allows choosing his target if passed; otherwise he charges the nearest standing enemy. Automatically ignores fear/psychology tests during a forced charge.",
          },
          {
            nom: 'May Exceed Three',
            texte: 'May exceed 3 Knights Errant if a Squire promoted to Hero becomes one (see the Knighting rule).',
          },
        ],
      },
      ecuyer: {
        nom: 'Squire',
        regles_speciales: [
          {
            nom: 'Knighting',
            texte:
              "On 'Lad's Got Talent', two choices: remain a Squire (2 lists among Combat/Academic/Strength/Speed, keeps his equipment list) or become a Knight Errant (immediately gains Knight, Vain, and Impetuous instead of an immediate advance, gains access to Special Skills plus 2 other lists, switches to the Knights' equipment list, may no longer use missile weapons — this is the mechanism that allows exceeding 3 Knights Errant).",
          },
          {
            nom: 'Mount',
            texte: 'May only ride a horse if the Questing Knight and all Knights Errant are themselves mounted on warhorses.',
          },
        ],
      },
      pelerin: {
        nom: 'Grail Pilgrim',
        regles_speciales: [
          {
            nom: 'Low Caste',
            texte: "Gains experience normally, but every 'Lad's Got Talent' result is re-rolled; can never become a Hero.",
          },
          { nom: 'Hatred', texte: "Hatred of all enemies, regarded as heretics to the Lady's cause." },
          { nom: 'Stubborn', texte: 'May re-roll a failed Leadership test once, keeping the second result.' },
          {
            nom: 'Bretonnian Sacred Relics',
            texte:
              'May receive a sacred relic despite the usual restriction on Henchmen carrying miscellaneous items; it grants frenzy (and therefore immunity to Hatred). If a group does not have enough relics for all its members, the bearer splits off and forms his own group.',
          },
        ],
      },
      paysan_archer: {
        nom: 'Peasant Bowman',
        regles_speciales: [
          {
            nom: 'Low Caste',
            texte: "Gains experience normally, but every 'Lad's Got Talent' result is re-rolled; can never become a Hero.",
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
      vertu_de_renommee: {
        nom: 'Virtue of Renown',
        texte:
          "Allows learning a Virtue from Tom Merrigan's original list of Bretonnian Knights. May only be chosen once. Available Virtues — Discipline: once per battle, if the Hero is not Knocked Down, Stunned, or Out of Action, may re-roll a failed Rout test. Impetuousness: adds +1D3\" to Movement when charging (roll before moving the model). Purity: any spell targeting the Hero is dispelled on a 4+ (natural dispelling due to his piety). Bravery: against a model with higher Strength than his own, re-rolls failed to-hit rolls in hand-to-hand combat. Noble Disdain: hatred of all enemies equipped with missile weapons.",
      },
      voeu_de_la_quete: {
        nom: 'Vow of the Quest',
        reserve_a: 'Questing Knight only',
        texte: 'If he charges, is charged, or fights an enemy that causes fear, may re-roll a Leadership test (including Rout), keeping the second result.',
      },
      coup_de_bouclier: {
        nom: 'Shield Bash',
        texte: 'Each turn, an extra attack with a shield/buckler at Strength -1, treated as a club blow.',
      },
      muscles_saillants: {
        nom: 'Bulging Muscles',
        texte: 'Keeps the Strength bonus of flails and morning stars after the first round of combat.',
      },
      infatigable: {
        nom: 'Tireless',
        texte: 'On foot, ignores Movement penalties from armour; save modifiers (Strength, axe, critical hit) cannot reduce his save below 5+, and it cannot be ignored by non-magical means.',
      },
    },
    equipement: {
      chevaliers: {
        armes_cac: ['first free', undefined, undefined, undefined, 'see special equipment', undefined, undefined, undefined],
        armures: [undefined, undefined, undefined, undefined, 'see special equipment', undefined],
      },
      pelerins: {
        armes_cac: ['first free', undefined, undefined, 'see special equipment', undefined, undefined, undefined, undefined],
      },
      paysans_archers: {
        armes_cac: ['first free', undefined, undefined, 'see special equipment', undefined],
      },
    },
    magie: {
      nom: 'Prayers of the Lady of the Lake',
      type: 'prayers',
      sorts: [
        {
          nom: 'Favours of the Lady',
          texte:
            'All Heroes count as having a lucky charm for the battle (ignore the first hit on a 4+); those who already have one may re-roll a failed lucky charm save, keeping the second result.',
        },
        {
          nom: 'Blessed Protection',
          texte:
            'The Damsel and Bretonnians within 6" benefit from a special, non-modifiable 4+ save against spells/prayers. At the start of each Shooting phase, on a 1-2, the spell is dispelled.',
        },
        {
          nom: 'Swift Steps',
          texte:
            'An ally within 12" who charged or failed a charge this turn gains +1 to hit until the end of the turn, and may make an additional Movement of 1D6" towards an enemy (contact = charge) if not engaged.',
        },
        {
          nom: "Wrath of the Lady",
          texte:
            'Anyone attempting to shoot the Damsel must first pass a Leadership test, or may not shoot this turn (includes area-effect weapons whose path crosses her). Lasts until the end of the game.',
        },
        {
          nom: 'Elixir of Life',
          texte: 'A model within 4" (including the Damsel) regains all Wounds; allies Stunned/Knocked Down within 4" immediately stand up.',
        },
        {
          nom: 'Inspiring Vision',
          texte: 'An ally within 8" may re-roll a die and add +1 or -1 to the result, until the start of the next Shooting phase.',
        },
      ],
    },
  },
  morts_sans_repos: {
    nom: 'The Restless Dead (1c)',
    profils: {
      liche: {
        nom: 'Liche',
        regles_speciales: [
          {
            nom: 'Sorcerer',
            texte: 'A powerful spellcaster; uses Necromancy and starts with two spells randomly drawn from the Necromancy list.',
          },
          { nom: 'Causes Fear', texte: 'A horrifying abomination that causes Fear.' },
          { nom: 'Immune to Psychology', texte: 'Unaffected by psychology and never leaves combat.' },
          { nom: 'Unfeeling', texte: 'A Stunned result on the Injury table is treated as Knocked Down.' },
          { nom: 'Immune to Poisons', texte: 'Unaffected by poisons.' },
          {
            nom: 'Undying',
            texte:
              'May ignore any Serious Injury result except Dead, suffering instead a permanent loss of -1 Wound (not usable if she has only 1 Wound left). A Dead result instead inflicts -D3 permanent Wounds; if this brings the Liche to 0 Wounds or below, she is killed normally.',
          },
          {
            nom: 'Feeds on Magic',
            texte:
              'Between battles, by consuming D3 Treasures, may gain +1 permanent Wound. Cannot be used if the Liche searched for rare items or was taken Out of Action in the previous battle; the Treasures are consumed even if not enough are available.',
          },
          { nom: 'Battle Sorceress', texte: 'May wear armour and cast spells.' },
          {
            nom: 'Advancement',
            texte: 'If the Liche rolls a +1 Wound advance result, she may instead choose a new skill from her available tables.',
          },
          {
            nom: 'Equipment',
            texte: 'May carry no non-magical weapon (without penalty for this), but may wear any armour from the undead equipment list.',
          },
        ],
      },
      necromancien: {
        nom: 'Necromancer',
        regles_speciales: [
          {
            nom: 'Sorcerer',
            texte: "Trained by the Liche in Necromancy; starts knowing one of the Liche's two known spells.",
          },
          {
            nom: 'Apprentice',
            texte:
              'May only learn spells already known by the Liche (he does not dare use others out of deference). If the Liche is killed, the Necromancer may continue learning spells like a normal spellcaster, ignoring this rule.',
          },
          { nom: 'Scavenger', texte: 'When searching for rare items, rolls 3D6 and keeps the two best results.' },
        ],
      },
      garde_funeraire: {
        nom: 'Grave Guard',
        regles_speciales: [
          {
            nom: 'Spectral Blades',
            texte:
              'Any to-hit roll of 6 in hand-to-hand combat automatically wounds (normal to-wound roll for critical hits; a failed to-wound roll still causes a wound if a 6 was rolled to hit).',
          },
          { nom: 'Causes Fear', texte: 'Terrifying undead creatures that cause Fear.' },
          { nom: 'Immune to Poisons', texte: 'Unaffected by poisons.' },
          { nom: 'Immune to Psychology', texte: 'Unaffected by psychology and never leaves combat.' },
          { nom: 'Unfeeling', texte: 'A Stunned result on the Injury table is treated as Knocked Down.' },
          { nom: 'Cannot Run', texte: 'A slow undead creature; cannot run but may charge normally.' },
          { nom: 'No Bargaining', texte: 'May not search for rare items.' },
        ],
      },
      zombie: {
        nom: 'Zombie',
        regles_speciales: [
          { nom: 'Causes Fear', texte: 'Horrifying creatures that cause Fear.' },
          { nom: 'Cannot Run', texte: 'A slow undead creature; cannot run but may charge normally.' },
          { nom: 'Immune to Psychology', texte: 'Unaffected by psychology and never leaves combat.' },
          { nom: 'Immune to Poisons', texte: 'Unaffected by poisons.' },
          { nom: 'Unfeeling', texte: 'A Stunned result on the Injury table is treated as Knocked Down.' },
          { nom: 'Brainless', texte: 'Never gains experience.' },
          { nom: 'Equipment', texte: 'May carry no weapons or armour, without penalty for this.' },
        ],
      },
      squelette: {
        nom: 'Skeleton',
        regles_speciales: [
          { nom: 'Causes Fear', texte: 'Terrifying undead monsters that cause Fear.' },
          { nom: 'Cannot Run', texte: 'A slow undead creature; cannot run but may charge normally.' },
          { nom: 'Immune to Psychology', texte: 'Unaffected by psychology and never leaves combat.' },
          { nom: 'Immune to Poisons', texte: 'Unaffected by poisons.' },
          { nom: 'Unfeeling', texte: 'A Stunned result on the Injury table is treated as Knocked Down.' },
          { nom: 'Brainless', texte: 'Never gains experience.' },
        ],
      },
      spectre: {
        nom: 'Spectre',
        regles_speciales: [
          { nom: 'Causes Fear', texte: 'Terrifying undead creatures that cause Fear.' },
          { nom: 'Immune to Poisons', texte: 'Unaffected by poisons.' },
          { nom: 'Immune to Psychology', texte: 'Unaffected by psychology and never leaves combat.' },
          { nom: 'Unfeeling', texte: 'A Stunned result on the Injury table is treated as Knocked Down.' },
          { nom: 'Cannot Run', texte: 'A slow undead creature; cannot run but may charge normally.' },
          {
            nom: 'Experience',
            texte:
              "May gain experience; if promoted to Hero via 'Lad's Got Talent', may not search for rare items (like Grave Guards), must choose the Combat and Strength skill tables, and gains the Spectral Blades rule.",
          },
        ],
      },
      epouvantail: {
        nom: 'Scarecrow',
        regles_speciales: [
          { nom: 'Causes Fear', texte: 'A deeply unnatural sight that causes Fear.' },
          { nom: 'Immune to Psychology', texte: 'Immune to all psychology, never leaves combat.' },
          { nom: 'Immune to Poisons', texte: 'Immune to all poisons.' },
          { nom: 'Unfeeling', texte: 'Any Stunned result on the Injury table is treated as Knocked Down.' },
          { nom: 'Brainless', texte: 'Never gains experience.' },
          {
            nom: 'Insubstantial',
            texte:
              'Counts as Toughness 6 against any shooting and magic missiles, and is immune to critical hits from shooting (exception: fire-based missile weapons/spells deal normal damage).',
          },
          { nom: 'Flammable', texte: 'Counts as flammable and catches fire on a 3+ instead of the usual 4+.' },
          { nom: 'Construct', texte: 'May re-roll any result on the Injury table, except injuries caused by fire.' },
          {
            nom: 'Animated Construct',
            texte:
              'Controlled by either the Liche or the Necromancer (noted on the roster sheet), one at a time; a warband needs both a Liche and a Necromancer to field two Scarecrows. If its controller cannot take part in a battle, neither can the Scarecrow. If its controller loses a Wound, an unmodified Leadership test must be passed or the Scarecrow is immediately taken Out of Action.',
          },
          { nom: 'Equipment', texte: 'Carries no equipment, without penalty for this.' },
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
      bombe_cadaverique: {
        nom: 'Corpse Bomb',
        texte:
          'Secretly designate a Zombie at the start of the battle as a Corpse Bomb; if it is charged or charges an enemy, it immediately explodes, inflicting D3 Strength 4 hits on all models within a D6" radius. This Zombie can never be reused. A Corpse Bomb killed by shooting does not explode. Only one Zombie at a time may be a Corpse Bomb; both the Necromancer and the Liche may choose this skill.',
      },
      porte_voix_des_morts: {
        nom: 'Voice of the Dead',
        texte:
          "At the start of the battle, may deploy D3 Zombies for free; they do not count towards the warband's maximum model count but do increase the warband's rating. They cannot serve as a Corpse Bomb and last only for the duration of the battle.",
      },
      toucher_spectral: {
        nom: 'Spectral Touch',
        texte:
          'The hero may make a single unarmed attack instead of his normal hand-to-hand attacks; if it hits, it automatically wounds. If a Liche uses this skill and wounds, she recovers 1 lost Wound (not exceeding her starting total). Necromancers do not recover Wounds this way. Has no effect on Possessed or undead models.',
      },
      rite_interdit: {
        nom: 'Forbidden Rite',
        texte:
          'If the hero did not search for rare items during the last Exploration phase, he starts the next battle with a reserve of D3+1 (+1) modifiers usable on spell-casting rolls, as many at once as desired.',
      },
      invocateur: {
        nom: 'Summoner',
        texte: "The warband's maximum model count is increased by 1.",
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
      sorts: [
        {
          nom: 'Awakening Spell',
          texte:
            "If an enemy Hero is killed (the opponent rolls 11-15 on the Serious Injury table), the spellcaster may raise him as a Zombie in his service, keeping his characteristics, weapons, and armour but no equipment/skills; he counts as his own Henchman group, cannot run, and no longer gains experience.",
        },
        {
          nom: 'Life Stealer',
          texte:
            "Choose a model within 6\". It suffers a wound (no save), and the spellcaster gains an extra Wound for the duration of the battle (may exceed a Necromancer's starting maximum; a Liche can only restore lost Wounds). Has no effect on Possessed or undead models.",
        },
        {
          nom: 'Reanimation',
          texte:
            "A Zombie taken Out of Action during the last hand-to-hand combat phase returns to the fight within 6\" of the spellcaster (not directly into contact). May be used on a Grave Guard/Spectre to restore 1 lost Wound if it has more than one; cannot revive Scarecrows, Grave Guards, Spectres, or Skeletons the way it does Zombies.",
        },
        {
          nom: 'Curse Spell',
          texte:
            'Choose an enemy model within 12"; it must roll equal to or under its Strength on 1D6 or be seized by the dead — on a failure, roll on the Injury table.',
        },
        {
          nom: "Vanhel's Call",
          texte:
            'A single Zombie, Skeleton, Spectre, or Grave Guard within 6" of the spellcaster may move again at its full Movement; a move that brings it into contact counts as a charge, and any Initiative test required during this move is automatically passed.',
        },
        {
          nom: 'Grim Vision',
          note: 'Necromancers only',
          texte:
            'The Necromancer causes fear in his enemies for the duration of the battle and is himself immune to it — the sole exception to the Apprentice rule, available if the Liche knows the Vision of Death spell.',
        },
        {
          nom: 'Living Horror',
          note: 'Liche only',
          texte:
            'Choose a model within 8" of the Liche and roll D6+3; if the result is equal to or greater than the target\'s Leadership, it suffers a Wound (no armour save). If wounded and it still has Wounds remaining, it may not move, shoot, or cast spells next turn unless it passes a Leadership test. Has no effect on Possessed, undead, or any model immune to fear.',
        },
      ],
    },
  },
  maneaters: {
    nom: 'Maneaters (1c)',
    regles_speciales: [
      { nom: 'Fear', texte: 'Ogres are large, threatening creatures that cause fear, except Young Bloods.' },
      {
        nom: 'Gluttony',
        texte:
          "Each Ogre counts as two models when selling magic stone or treasures. Captured models (via Serious Injuries or Exploration) may be devoured, with the Ogre keeping their possessions and reducing the enemy warband's model count by one (two if the captive is a Large Target). Any warband member or animal may be eaten in the same way. An Ogre Hero who devours captives gains as much experience as models consumed; the consumed comrades are immediately removed from the roster.",
      },
      { nom: 'Slow-Witted', texte: 'Ogres advance at half speed: they need twice the usual XP to gain an advance.' },
      { nom: 'Difficult Customers', texte: 'Ogre Heroes suffer a -1 penalty when rolling to find Rare items not exclusively reserved for Ogres.' },
      {
        nom: 'Cannibals',
        texte:
          'An Ogre warband may not hire Hired Swords, except Halflings (Scout, Thief, etc.) and the Ogre Bodyguard, or unless stated otherwise — in which case the Ogres may choose to devour him at the end of the contract (see Gluttony).',
      },
      {
        nom: 'Bound Gnoblars',
        texte:
          'Treated in every way as miscellaneous equipment (not a model, no base). If the owning Ogre is taken Out of Action during a game, roll 1D6 per Gnoblar: on a 1-2 it is killed and removed. An Ogre may own up to two different Bound Gnoblars (see special equipment).',
      },
    ],
    profils: {
      capitaine: {
        nom: 'Captain',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warrior within 6" of the Captain may use his Leadership for their tests.' },
          {
            nom: 'Large Target',
            texte: 'An immense target for archers; any model may shoot him even if he is not the nearest target, with a +1 bonus to hit.',
          },
          {
            nom: 'Equipment',
            texte: 'Ogres have no free dagger and never fight with a dagger in hand-to-hand combat, even though they may carry one reserved for their meals.',
          },
        ],
      },
      guide_de_montagne: {
        nom: 'Mountain Guide',
        regles_speciales: [
          {
            nom: 'Prowler',
            texte: 'If he was not taken Out of Action during the battle, may roll two dice during the Exploration phase and choose which to keep (not a re-roll).',
          },
          {
            nom: 'Loner',
            texte: "Immune to All Alone tests; will never claim a Gnoblar as a pet, and can never become the warband's leader.",
          },
          {
            nom: 'Large Target',
            texte: 'An immense target for archers; any model may shoot him even if he is not the nearest target, with a +1 bonus to hit.',
          },
          { nom: 'Equipment', texte: 'Ogres have no free dagger and never fight with a dagger in hand-to-hand combat.' },
        ],
      },
      jeune_sang: {
        nom: 'Young Blood',
        regles_speciales: [
          { nom: 'Not Yet Fearsome', texte: 'Unlike other Ogres, Young Bloods do not cause fear.' },
          { nom: 'Equipment', texte: 'Ogres have no free dagger and never fight with a dagger in hand-to-hand combat.' },
        ],
      },
      taureau: {
        nom: 'Bull',
        regles_speciales: [
          {
            nom: 'Bull Charge',
            texte: 'When charging, may attempt a single attack with a +1 bonus to hit instead of his normal attacks; if successful, the enemy model is automatically Knocked Down.',
          },
          {
            nom: 'Large Target',
            texte: 'An immense target for archers; any model may shoot him even if he is not the nearest target, with a +1 bonus to hit.',
          },
          { nom: 'Equipment', texte: 'Ogres have no free dagger and never fight with a dagger in hand-to-hand combat.' },
        ],
      },
      demi_grand: {
        nom: 'Half-grown',
        regles_speciales: [
          { nom: 'Equipment', texte: 'Ogres have no free dagger and never fight with a dagger in hand-to-hand combat.' },
        ],
      },
      tigre_a_sabre: {
        nom: 'Sabre-tooth Tiger',
        regles_speciales: [
          {
            nom: 'Trained',
            texte:
              'May use the Mountain Guide\'s Leadership within 6" of him; cannot be fielded if there is no Mountain Guide in the warband (must remain caged at camp until a Guide is hired).',
          },
          {
            nom: 'Wild Instinct',
            texte: "At the start of the Ogres' turn, must pass a Leadership test or the opponent may move it this turn; an uncontrolled Sabre-tooth Tiger may charge the Ogres' own models.",
          },
          { nom: 'Ignored', texte: 'Sabre-tooth Tigers taken Out of Action do not count towards the number of models Out of Action for Rout tests.' },
          { nom: 'Causes Fear', texte: 'Immense predatory cats that cause fear.' },
          { nom: 'Equipment', texte: 'Fangs and primal ferocity — no equipment.' },
        ],
      },
      guerrier_gnoblar: {
        nom: 'Gnoblar Warrior',
        regles_speciales: [
          {
            nom: 'Weapons/armour',
            texte: 'Equipped with a dagger and shrapnel (counts as a missile weapon, range 8", Strength 2, and fires twice).',
          },
          {
            nom: 'Utterly Insignificant',
            texte: "Counts towards the warband's number of warriors, but is not counted for Rout tests (neither for determining the warband's starting size, nor for casualties).",
          },
          {
            nom: 'Squabbling',
            texte: 'Roll 1D6 at the start of the turn for each Gnoblar not engaged in hand-to-hand combat, within 2" of another Gnoblar. On a 1, the Gnoblar insults, curses, and/or threatens the other Gnoblar and can do nothing else this turn.',
          },
          {
            nom: 'Like a War Dog',
            texte: 'Does not count as an animal in fiction (counts as a Greenskin, not subject to Animosity), but follows the same rules as a war dog: never gains experience, recovery 1-2 Dead/3-6 Alive, counts towards the maximum model count.',
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
      maitre_darmes: {
        nom: 'Master-at-Arms',
        texte: 'May wield a Difficult to Use weapon together with a basic weapon, but not two Difficult to Use weapons.',
      },
      rot_grossier: {
        nom: 'Crude Belch',
        texte:
          'The hero may unleash thunderous fumes on all enemies engaged in hand-to-hand combat; those who fail a Leadership test suffer -1 to hit for the turn. Must wait for a new enemy to engage before repeating.',
      },
      maneater: {
        nom: 'Maneater',
        texte: 'Immediately learns a skill from the Shooting or Academic tables (only once; not available to the Guide).',
      },
      charge_du_taureau_comp: {
        nom: 'Bull Charge',
        texte: 'When charging, may attempt a single attack with a +1 bonus to hit instead of his normal attacks; if successful, the enemy model is automatically Knocked Down.',
      },
      chien_de_guerre: {
        nom: 'Dog of War',
        reserve_a: 'Leader only',
        texte: 'The warband may hire the Hired Swords available to Mercenary warbands; if the leader dies, all Hired Swords are removed from the warband.',
      },
      rugissement_tonitruant: {
        nom: 'Bellowing Roar',
        reserve_a: 'Leader only',
        texte: 'Allows re-rolling the first failed Rout test.',
      },
    },
    equipement: {
      ogres: {
        armes_cac: ['counts as an axe', 'see special equipment', undefined, undefined, undefined, undefined, 'see special equipment', undefined],
        armes_tir: ['see special equipment'],
      },
      guide: {
        armes_cac: ['counts as an axe', undefined, undefined, undefined, undefined],
        armes_tir: ['see special equipment'],
      },
    },
  },
  elfes_noirs: {
    nom: 'Dark Elves (1b)',
    regles_speciales: [
      {
        nom: 'Fratricidal Hatred',
        texte:
          'Dark Elves have fought the High Elves for millennia, and the wars between the two peoples have been long and bloody. Dark Elves hate High Elves, including Hired Swords of that race.',
      },
      {
        nom: 'Superhuman Eyesight',
        texte:
          'Many legends tell of the excellent eyesight of elves, whether Druchii or High Elves. Elves can detect hidden enemies at twice the normal distance (that is, at a distance equal to twice their Initiative).',
      },
      {
        nom: 'Firearms',
        texte: 'Dark Elves never use black powder weapons, finding them primitive, noisy, and unreliable.',
      },
    ],
    profils: {
      dynaste: {
        nom: 'Dreadlord',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any Dark Elf warband model within 6" of the Dreadlord may use his Leadership for their tests.' },
        ],
      },
      spadassin: {
        nom: 'Swordsman',
        regles_speciales: [
          {
            nom: 'Melee Specialists',
            texte: 'Swordsmen adhere to a very strict code of conduct requiring them to fight only in hand-to-hand combat, and they may never be equipped with missile weapons.',
          },
        ],
      },
      maitre_des_betes: {
        nom: 'Beastmaster',
        regles_speciales: [
          {
            nom: 'Cold One Hound',
            texte: 'The Beastmaster may be accompanied by up to two Cold One Hounds, recruited as Henchmen and following the special rules detailed further on.',
          },
        ],
      },
      sorciere_elfe_noire: {
        nom: 'Sorceress',
        regles_speciales: [
          { nom: 'Magic', texte: 'Dark Elf Sorceresses are spellcasters who use Dark Magic. She cannot cast spells while wearing armour.' },
        ],
      },
      corsaire: {
        nom: 'Corsair',
        regles_speciales: [
          { nom: 'Sea Dragon Cloak', texte: 'Corsairs may receive Sea Dragon Cloaks, even though they are not Heroes.' },
        ],
      },
      ombre: {
        nom: 'Shade',
        regles_speciales: [
          {
            nom: 'Stealth',
            texte: 'Above all, Dark Elf scouts learn to move silently. If a Shade is hiding, enemies suffer a -1 penalty to their Initiative when trying to spot her.',
          },
        ],
      },
      molosse_a_sang_froid: {
        nom: 'Cold One Hound',
        regles_speciales: [
          { nom: 'Weapons/armour', texte: 'Cold One Hounds are animals and need no equipment other than their scales and teeth!' },
          {
            nom: 'Animals',
            texte: 'Cold One Hounds are animals, and all rules relating to animals apply to them. They can never gain experience.',
          },
          {
            nom: 'Beastmaster',
            texte:
              'Cold One Hounds are sly, vicious animals, barely controllable. If the Beastmaster dies, the Hounds immediately escape and are struck off the warband roster. If for any reason the Beastmaster cannot take part in a battle, the Cold One Hounds cannot either.',
          },
          {
            nom: 'Submissive',
            texte:
              "Cold One Hounds may use the Beastmaster's base Leadership if within 6\" of him. However, they cannot benefit from the warband Leader's Leadership, even if their Beastmaster, within 6\" of him, does.",
          },
          {
            nom: 'Scales',
            texte:
              "Cold One Hounds are protected by thick, scaly skin. They therefore count as having a 6+ Armour Save. This save cannot be reduced by the attacker's Strength, but certain Critical Hits ignore it normally.",
          },
          { nom: 'Fear', texte: 'Cold One Hounds cause fear.' },
        ],
      },
    },
    competences_speciales: {
      infiltration_elfe_noir: {
        nom: 'Infiltration',
        reserve_a: 'Dark Elf Heroes only',
        texte:
          'A Dark Elf with this skill is always placed on the battlefield after the opposing warband has deployed. He may be placed anywhere on the table, provided he is out of enemy line of sight and more than 12" from any enemy model. If both players have infiltrating models, roll 1D6, the lower result deploys first.',
      },
      rapidite_surnaturelle: {
        nom: 'Supernatural Speed',
        reserve_a: 'Dark Elf Heroes only',
        texte:
          'Few can match the incredible swiftness of elves. An elf with this skill may dodge shooting or hand-to-hand attacks on a roll of 6 on 1D6. If the elf also has the Sidestep or Dodge skill, this save becomes 4+ in the appropriate area. For example, an elf with Supernatural Speed and Sidestep dodges hand-to-hand wounds on a 4+ and shooting on a 6+.',
      },
      massif_elfe_noir: {
        nom: 'Massive',
        reserve_a: 'Dark Elf Heroes only, except the Sorceress, maximum two models per warband',
        texte:
          'The warrior is solidly built (for an elf) and possesses great strength. A warrior with this skill may choose Strength skills. The Sorceress cannot receive this skill, and your warband may not have more than two models with it.',
      },
      maitre_des_poisons: {
        nom: 'Master of Poisons',
        reserve_a: 'Dark Elf Heroes only',
        texte:
          'A Dark Elf knows how to concoct various poisons. If the Hero does not search for rare items, he may instead brew 1D3-1 doses of Sooty Venom. The result may be 0, as the elf may not have access to a proper laboratory. The poison must be used in the next battle and cannot be sold or traded to other warbands, as Dark Elves guard their secrets well.',
      },
      fureur_de_khaine: {
        nom: 'Fury of Khaine',
        reserve_a: 'Dark Elf Heroes only',
        texte:
          "A Dark Elf is a bloodthirsty killing machine. He may make a 4\" pursuit Movement if he takes all his opponents Out of Action. If he makes contact with another enemy, a new combat takes place next turn and he counts as having charged. This Movement cannot be made during the enemy's turn.",
      },
    },
    equipement: {
      elfes_noirs: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined, 'cost of the weapon (dagger or sword) + 20 gc, Heroes only'],
        armures: [undefined, undefined, undefined, undefined, 'Heroes and Corsairs only'],
      },
      ombres: {
        armes_cac: ['first free', undefined, undefined],
      },
    },
    magie: {
      nom: 'Dark Magic',
      type: 'sorcery',
      note:
        'Like the High Elves, Dark Elves are accomplished spellcasters. But where the High Elves use their magic to protect and do good, the Dark Elves wield dark magic to destroy.',
      sorts: [
        {
          nom: 'Black Lightning',
          texte:
            'Murmuring an ancient incantation, the Sorceress creates a bolt of pure black energy that she unleashes on her enemies. Black Lightning may be cast against any enemy model in line of sight. Its range is 18" and it hits with Strength 5. If the target is wounded, the nearest model within 6" of it is also hit on a 4+ with Strength one point lower than the previous hit. The lightning continues jumping from model to model in this way until it runs out of targets, misses, or its Strength drops below 1. Each model can only be hit once per turn by this lightning. Armour saves apply normally.',
        },
        {
          nom: 'Word of Pain',
          texte:
            'The Sorceress calls down the wrath of the Witch King upon her enemies, blunting their fighting spirit. This spell may be cast on an enemy model within 12". The victim must re-roll all successful to-hit and to-wound rolls, in both shooting and hand-to-hand combat. If the victim wishes to charge, she must first pass a Leadership test. This spell lasts until the start of the next Dark Elf turn.',
        },
        {
          nom: 'Soul Stealer',
          texte:
            'By simple touch, the Sorceress drains her enemies of their life essence and absorbs it, strengthening her own energies. Once the spell is successfully cast, the Sorceress must make a to-hit roll against a model in contact. If it hits, its target loses 1 Wound, with no armour save allowed. The Sorceress then feeds on this energy and adds +1 Wound to her profile. Note: the Sorceress can never have more than 1 extra Wound from this spell, and it will be lost at the end of the game.',
        },
        {
          nom: 'Sword of Fire',
          texte:
            'Invoking baleful energies, the Sorceress wreathes a blade in black, icy flames. The Sorceress may cast this spell on one of the hand-to-hand weapons of a Dark Elf within 6". A weapon so enchanted still counts as a normal weapon of the appropriate type, but adds +2 to its wielder\'s Strength, and the hits it inflicts ignore armour saves. This spell lasts until the next Dark Elf Shooting phase.',
        },
        {
          nom: 'Death Spasms',
          texte:
            'The Sorceress riddles her enemy\'s body with dark magic, inflicting unbearable pain for a mere mortal to endure. This spell has a range of 6" and may be cast on the nearest enemy. The affected model must immediately roll on the Injury table. If the spell is cast successfully, the Sorceress is immediately Knocked Down.',
        },
        {
          nom: "Witches' Flight",
          texte:
            'The Sorceress bends the winds of magic to her will and rises into the air. The Sorceress may immediately move anywhere within 12" and may charge an enemy this way. If she charges a fleeing enemy, she inflicts an automatic hit on it, after which it flees again.',
        },
      ],
    },
  },
  hommes_lezards: {
    nom: 'Lizardmen (1b)',
    regles_speciales: [
      {
        nom: 'Scaly Skin',
        texte:
          "All Lizardmen have scaly skin that grants an armour save: 6+ for Skinks, 5+ for Saurus, and 4+ for Kroxigors. Penalties to these saves cannot modify them past 6+, but a 'no save' result on the Critical Hits table will negate them. Light armour and shields add a +1 bonus to these saves.",
      },
      {
        nom: 'Armour',
        texte: 'Armour is rare in Lizardmen societies, so light armour will always cost 50 Gold Crowns, even when bought from the equipment list.',
      },
      {
        nom: 'Bite',
        texte:
          'Saurus have powerful jaws and can bite in hand-to-hand combat. They therefore get an extra attack resolved at their profile\'s Strength, which does not suffer the penalty for fighting unarmed. This attack is always made last, whether or not the Saurus charged, and regardless of the weapons used (including two-handed weapons).',
      },
      {
        nom: 'Cold Blood',
        texte:
          "All Lizardmen are slow to react. Due to this composure, they may roll 3D6 and keep only the two lowest results for their Psychology or Rout tests. A Lizardmen warband may not use a Saurus's or Kroxigor's Leadership for its Rout tests.",
      },
      { nom: 'Aquatic', texte: 'Skinks may move through Water Terrain without penalty and are considered to be in cover in any such terrain.' },
      { nom: 'Creatures of the Jungle', texte: 'Skinks may move through jungle without penalty.' },
      {
        nom: 'Scarcity of Saurus',
        texte: 'Slann Mage-Priests never include more Saurus Henchmen than Skink Henchmen in a warband. You may not do so either.',
      },
    ],
    profils: {
      pretre_skink: {
        nom: 'Skink Priest',
        regles_speciales: [
          {
            nom: 'Leader',
            texte:
              "As Leader, the Skink Priest may grant his Leadership to any Lizardman taking a Leadership test within 6\" of him. If the Skink Priest is killed, you may recruit another, but you must play at least one game without a leader while he joins the warband.",
          },
          { nom: 'Sorcerer', texte: 'Skink Priests are spellcasters and may use Lizardmen magic.' },
        ],
      },
      guerrier_totem_saurus: {
        nom: 'Saurus Totem Warrior',
        regles_speciales: [
          {
            nom: 'Totem',
            texte:
              'When a Saurus warrior has killed twenty enemies, he is accepted into one of the three Warrior Totems: Eagle, Jaguar, or Alligator. But first he must hunt and kill his totem animal himself to prove his worth. Once part of one of these prestigious groups, he will be chosen by the Skink Priests to help protect the temples.',
          },
          {
            nom: 'Attacks',
            texte: "His base profile (A1) is increased by +1 due to his Totem Warrior status, printed as A1+1 in the original rules.",
          },
        ],
      },
      skink_a_grande_crete: { nom: 'High-Crested Skink' },
      skink: { nom: 'Skink' },
      saurus: {
        nom: 'Saurus',
        regles_speciales: [
          { nom: 'Scarcity of Saurus', texte: 'It is not possible to have more Saurus Henchmen than Skink Henchmen in a warband.' },
        ],
      },
      kroxigor: {
        nom: 'Kroxigor',
        regles_speciales: [
          {
            nom: 'Equipment',
            texte: 'A Kroxigor has access to no equipment list but, unusually, is recruited with a halberd. Attacks made with this weapon are therefore resolved at Strength 6.',
          },
          { nom: 'Aquatic', texte: 'The Kroxigor moves through Water Terrain without penalty. While in such terrain, it counts as being in cover.' },
          { nom: 'Causes Fear', texte: 'Like any self-respecting large monster, a Kroxigor causes fear.' },
          { nom: 'Large', texte: 'Due to its great size, the Kroxigor may always be targeted by a shooter, even if other targets are closer to him.' },
          { nom: 'Animal', texte: 'The Kroxigor is so unintelligent that it cannot benefit from any training. It therefore never gains experience points.' },
        ],
      },
    },
    competences_speciales: {
      infiltration_skink: {
        nom: 'Infiltration',
        reserve_a: 'Skinks only',
        texte: 'This Skink can sneak up close to his enemies. At the start of the game, you may place him anywhere on the table, provided he is hidden and more than 12" from any enemy.',
      },
      grand_chasseur: {
        nom: 'Great Hunter',
        reserve_a: 'High-Crested Skink only',
        texte: 'This High-Crested Skink is an excellent hunter and makes the most effective use of available cover. If in cover, the penalty to hit him with shooting increases from -1 to -2.',
      },
      cri_de_guerre_saurus: {
        nom: 'War Cry',
        reserve_a: 'Saurus only',
        texte: "The Saurus's war cry is deafening. Enemies in base-to-base contact with him suffer a -1 penalty to their to-hit rolls in the first round of hand-to-hand combat.",
      },
      peau_de_bois: {
        nom: 'Wooden Skin',
        reserve_a: 'Saurus only',
        texte: "Over the years, the Saurus's scaly skin has thickened and hardened. He will only be taken Out of Action on a result of 6+ on 1D6.",
      },
      glandes_a_venin: {
        nom: 'Venom Glands',
        reserve_a: 'Sacred Mark — Skinks only',
        texte:
          "The Skink has sublingual glands that secrete a deadly poison (40 gc). The Skink may make some or all of his attacks by biting instead of using his weapons. These attacks impose a +1 armour save modifier, regardless of the Skink's Strength. However, they do not suffer the penalty for fighting unarmed, and on a Wound, gain a +1 bonus on the Injury table. These attacks are always made last, whether or not the Skink charged, and regardless of the weapons used (including two-handed weapons).",
      },
      gueule_enorme: {
        nom: 'Massive Jaws',
        reserve_a: 'Sacred Mark — Saurus only',
        texte: 'The Saurus has enlarged jaws and powerful jaw muscles (40 gc). As a result, his bite attack is resolved with a +1 Strength bonus.',
      },
      marque_des_anciens: {
        nom: 'Mark of the Old Ones',
        reserve_a: 'Sacred Mark — only acquired when recruiting a Hero born with it',
        texte:
          'The most prestigious mark a Lizardman can be born with (50 gc). These albinos have a great destiny in the eyes of their gods and other Lizardmen. The Hero may turn one of his failed die rolls into a success. This mark can only be used once per battle and only on the Hero\'s own actions. You may use this mark on a failed Rout test if you wish.',
      },
    },
    equipement: {
      skinks: {
        armes_cac: ['first free', 'Stone axe', undefined, undefined],
        armes_tir: [undefined, undefined, undefined, 'Throwing knives', undefined],
        armures: ['Bone helm — Skink Priest only', undefined, undefined],
      },
      saurus: {
        armes_cac: ['first free', 'Stone axe', undefined, undefined, undefined, undefined, undefined],
        armures: [undefined, 'Bone helm', undefined],
      },
    },
    magie: {
      nom: 'Lizardmen Magic',
      type: 'prayers',
      note: 'Lizardmen magic works like the Prayers of Sigmar, and the Skink Priest may call upon it even while wearing pieces of armour.',
      sorts: [
        {
          nom: 'Wrath of Chotec',
          texte:
            'A bolt of lightning falls from the sky and strikes the nearest enemy within 10" of the Skink Priest, inflicting a Strength 5 hit. If the target wears armour (light, heavy, gromril, etc.), increase the Strength by +1 and add +1 to the result on the Injury table.',
        },
        {
          nom: 'Blessing of Sotek',
          texte:
            'This spell may be cast on a model within 6" of the Skink Priest or on himself. Roll 1D6 to determine the nature of the blessing (1-2 BS+1 or +1 to hit in hand-to-hand combat; 3-4 Toughness +1; 5-6 Movement and Initiative +1). The effects apply as long as the Skink Priest or the target is not Stunned or taken Out of Action. Only one model at a time may be under the blessing.',
        },
        {
          nom: 'Stealth of Huanchi',
          texte:
            'This spell affects all Skinks within 6" of the Skink Priest, including himself. It allows those in cover to hide immediately. A model may hide this way even if it ran or shot this turn.',
        },
        {
          nom: 'Protection of the Old Ones',
          texte:
            'The Skink Priest and all Lizardmen within 4" gain a special 4+ save against the effects of spells and prayers. This spell remains active as long as the Priest is not taken Out of Action.',
        },
        {
          nom: 'Fury of Tinci',
          texte:
            'The Skink Priest, or a model within 6", is overcome with bloodlust and becomes frenzied. He also gains a +1 Strength bonus. The effects of this spell apply as long as the Skink Priest is not Stunned or taken Out of Action. In addition, at the start of each turn, the Skink Priest must pass a Leadership test to maintain it. Only one model may be under this spell\'s effect at a time, but the Skink Priest may end it at the start of the turn to cast it on another target during the Shooting phase.',
        },
        {
          nom: 'Swiftness of Itzl',
          texte:
            'This spell may be cast on a model within 6" of the Skink Priest or on himself. The target may make an additional 4" Movement. This counts as running, and the model cannot move if it has already used a missile weapon this turn. It is not possible to charge using this magical movement.',
        },
      ],
    },
  },
  amazones_lustrie: {
    nom: 'Amazons — Lustria Setting (1b)',
    regles_speciales: [
      {
        nom: 'Isolationists',
        texte:
          'Amazons constantly struggle against raids by treasure-hungry Norsemen and Lizardmen. Amazon culture reflects their distrust and wariness of outsiders, and in battle they are particularly savage. Against Norsemen and Lizardmen, Amazons may re-roll all failed attack rolls during the first round of combat.',
      },
      {
        nom: 'Sacrifice',
        texte:
          'Amazons are quick to sacrifice their captives to their gods. A captured warrior (result 61 on the Serious Injuries table) may be sacrificed. The warband Leader then gains +1 experience point. Furthermore, if the sacrificed warrior is a Lizardman, the warband gains a free set of Enchanted Skins.',
      },
      {
        nom: 'Norse Enmity',
        texte:
          'Against a Norse warband, Amazons will fight to the death. Amazons may re-roll their first failed Rout test against Norsemen. Remember that a failed re-roll cannot be re-rolled. In addition, Amazons may never choose to voluntarily Rout against a Norse warband, unless the warband Leader has been taken Out of Action.',
      },
      {
        nom: 'She Is Not One of Us',
        texte:
          'Due to their isolationism and suspicion of other races, Amazons never fight alongside anyone else. For this reason, Amazons do not recruit Hired Swords or Dramatis Personae, unless they are Amazons themselves.',
      },
    ],
    profils: {
      pretresse_serpent: {
        nom: 'Serpent Priestess',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warrior within 6" of the Serpent Priestess may use her Leadership for their Leadership tests.' },
          {
            nom: 'Witch',
            texte: 'The Serpent Priestess is a Witch who uses the Amazon Rituals. She starts with one ritual drawn at random from the list.',
          },
        ],
      },
      guerriere_aigle: { nom: 'Eagle Warrior' },
      guerriere_piranha: {
        nom: 'Piranha Warrior',
        regles_speciales: [
          {
            nom: 'Musical Conch',
            texte: 'Piranha Warriors are the only Amazons who may use the musical conch, which allows re-rolling the roll that determines who deploys and goes first.',
          },
        ],
      },
      guerriere_amazone: { nom: 'Amazon Warrior' },
      guerriere_jaguar: {
        nom: 'Jaguar Warrior',
        regles_speciales: [
          {
            nom: 'Daughters of the Jungle',
            texte: 'Jaguar Warriors have spent their lives in the deepest parts of the jungle and may move through jungle terrain without penalty.',
          },
        ],
      },
    },
    competences_speciales: {
      chasseuse_de_skinks: {
        nom: 'Skink Hunter',
        reserve_a: 'Amazon Heroines only, instead of the standard list',
        texte: 'Through her exploits, the Amazon has proven herself an expert at hunting Lizardmen, particularly Skinks. Against a Skink, an Amazon with this skill will always strike first in the first round of combat.',
      },
      danse_hypnotique: {
        nom: 'Hypnotic Dance',
        reserve_a: 'Amazon Heroines only, instead of the standard list',
        texte:
          'Some Amazons use a graceful dance as a combat technique that can subjugate their enemies. Any fighter engaged in hand-to-hand combat against the Amazon must pass a Leadership test at the start of each turn. On a failure, the fighter cannot attack this turn, but may defend himself. The dance has no effect, however, against Lizardmen or Undead, who are immune to its charms.',
      },
      fureur_sauvage: {
        nom: 'Savage Fury',
        reserve_a: 'Amazon Heroines only, instead of the standard list',
        texte:
          'The Amazon has learned to channel her anger and aggression, becoming a true wild animal when she attacks her enemies. Any Amazon model with this skill gains +1 Attack when charging and is immune to the effects of charm or fear.',
      },
      dissimulation: {
        nom: 'Concealment',
        reserve_a: 'Amazon Heroines only, instead of the standard list',
        texte: 'The Amazon specialises in the art of blending into her surroundings. When hiding in jungle terrain, all enemy models halve the range needed to spot her.',
      },
      elixir_de_vie: {
        nom: 'Elixir of Life',
        reserve_a: 'Amazon Heroines only, instead of the standard list',
        texte:
          'After years of service within her tribe, this Amazon has gained access to the springs that produce the Elixir of Life. It is said the Elixir heals wounds and makes Amazons immortal. After the battle, if the Amazon was taken Out of Action, she may re-roll her Injury roll once, accepting the result of the second roll.',
      },
    },
    equipement: {
      heroines: {
        armes_cac: ['first free', 'Club', undefined, undefined, undefined, undefined, undefined],
        armures: ['Helmet', undefined, undefined],
      },
      femmes_de_main: {
        armes_cac: ['first free', 'Club', undefined, undefined, undefined],
      },
      guerrieres_jaguar: {
        armes_cac: ['first free', 'Club', undefined, undefined],
        armures: ['Helmet', undefined],
      },
    },
    magie: {
      nom: 'Amazon Rituals',
      type: 'sorcery',
      note: 'Beyond their island, little is known of Amazon magic. It is said that the immortal Amazons learned their magic from the gods themselves.',
      sorts: [
        {
          nom: 'Song of the Wind',
          texte:
            'The Priestess calls upon the Wind Goddess Shaekal to join the battle. The Goddess appears as dancing notes of music and light that entrance an enemy model within 10" of the Priestess. Until the start of the Amazon player\'s next turn, the model cannot move, shoot, or cast spells, but may defend itself in hand-to-hand combat. Models affected by this ritual always strike last in hand-to-hand combat.',
        },
        {
          nom: 'Strength of the Serpent',
          texte:
            'The Priestess performs this ritual by dancing wildly and shouting forgotten words. All friendly models within 8" of the Priestess (including herself) are filled with powerful energy and gain +1 Strength until the end of the next Amazon turn. The ritual cannot be cast if the Priestess is engaged in hand-to-hand combat during her Shooting phase. However, once the ritual has been cast, its effect persists even if the Priestess becomes engaged in hand-to-hand combat.',
        },
        {
          nom: "Wendala's Maelstrom",
          texte:
            'The Priestess summons violent tropical winds to protect the Amazons from enemy shooting. The storm extends within 18" of the Priestess. All enemy shooting attempts suffer a -1 penalty to hit. The ritual lasts until the start of the next Amazon player\'s turn.',
        },
        {
          nom: 'Shield of Thorns',
          texte:
            'Moving her hands as if weaving dark patterns in the air, the Priestess calls upon plants for protection. This ritual creates a cocoon of thorns around the Priestess, making her immune to any shooting or magical attack. Any model wishing to charge the Priestess may do so, but the thorns cancel all hits from both the Priestess and her enemies during the first round of hand-to-hand combat. The Priestess cannot cast this ritual while engaged in hand-to-hand combat.',
        },
        {
          nom: 'Living Jungle',
          texte:
            'Focusing her will, the Priestess calls upon the aid of the jungle\'s creatures. Choose a model within 12". It is suddenly attacked by a swarm of snakes, spiders, and insects, each more venomous than the last. The victim suffers 1D6 Strength 2 hits, with no armour save allowed other than invulnerable saves. The model cannot use Sidestep against this swarm.',
        },
        {
          nom: "Siren's Dream",
          texte:
            'The Priestess intones a sweet melody in a magnificent voice, soon joined by the other Amazons. The song is so beautiful and enchanting that enemy Leadership tests within 12" suffer a -1 penalty until the end of the opposing player\'s turn. Lizardmen and Undead are immune to the effects of this ritual.',
        },
      ],
    },
  },
  tileens: {
    nom: 'Tileans (1b)',
    regles_speciales: [
      {
        nom: 'Hired Swords',
        texte:
          'A Tilean warband may use the Hired Swords available to Mercenary warbands from the Mordheim rulebook, including: Shadow Warrior, Big Game Hunter, Tilean Marksman. Unless stated otherwise, Hired Swords cannot benefit from the specific rules of the Tilean city-states.',
      },
    ],
    tribus: {
      miragliano: {
        nom: 'Miragliano',
        texte:
          "Tileans from Miragliano are deadly marksmen thanks to their city's signature weapon: the crossbow. As a result, Heroes from Miragliano get +1 to hit when using crossbows. Marksmen get +1 to hit with any missile weapon. All inhabitants of Miragliano hold a deep aversion to Skaven. This dates back to the Red Pox epidemic of 1812 IC, during which three-quarters of the city's population perished. When a Miragliano warband fights Skaven, it is affected by the rules for Hatred. Hired Swords are not affected by this rule (for reference only, apply on your tabletop).",
      },
      remas: {
        nom: 'Remas',
        texte:
          'In 1487 IC, a fleet of Dark Elf ships invaded the coasts of the city of Remas, and ever since, its inhabitants have felt a deep aversion to the Druchii. A warband from Remas will fight to the death against a Dark Elf warband. To represent this, when fighting Dark Elves, a Tilean player from Remas may re-roll a Rout test but must keep the second result. Remas officers are steadfast individuals whose years of training have made them excellent commanders. The Leadership value of a Captain, Champion, or Youngblood from Remas is always one point higher, regardless of the opposing warband (for reference only, apply on the paper roster).',
      },
      trantio: {
        nom: 'Trantio',
        texte:
          'A warband from Trantio will be the best-equipped and most experienced of the human warbands in Lustria. To represent this, a Trantio warband will always start a one-off game with 100 extra gc, and with a 20% increase to the sum allotted for recruitment during a campaign in Lustria (for reference only, not automated).',
      },
    },
    profils: {
      capitaine: {
        nom: 'Captain',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warrior within 6" of the Captain may use his Leadership for their Leadership tests.' },
        ],
      },
      champion: { nom: 'Champion' },
      recrue: { nom: 'Youngblood' },
      guerrier_tileen: { nom: 'Warrior' },
      duelliste: {
        nom: 'Duellist',
        regles_speciales: [
          {
            nom: 'Cloak & Dagger',
            texte:
              'Duellists are skilled fighters who whirl around their enemy, using their flowing cloak to distract and block blows. Duellists are considered to be using a shield, but only in hand-to-hand combat.',
          },
        ],
      },
      tireur_delite: { nom: 'Marksman' },
    },
    equipement: {
      tileens: {
        armes_cac: ['first free', 'Hammer or Mace', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        armes_tir: ['30gc per pair', '50gc per pair', undefined, undefined],
      },
      tireurs_delite: {
        armes_cac: ['first free', 'Hammer or Mace', undefined, undefined],
        armes_tir: ['30gc per pair', '50gc per pair', undefined, undefined, undefined, undefined],
      },
    },
    equipement_special: [
      { disponibilite: 'Rare 7, man-sized creatures or larger only' },
      { disponibilite: 'Rare 5, Hochland Bandits, Reiklanders, Marienburgers, Merchant Caravans and Tileans only' },
    ],
  },
  nains_du_chaos: {
    nom: 'Black Dwarfs (1c)',
    regles_speciales: [
      {
        nom: 'Hard to Kill',
        texte:
          'Like their uncorrupted kin, Chaos Dwarfs are tough, resilient individuals who can only be taken Out of Action on a roll of 6 instead of 5-6 on the Injury table. Treat a roll of 1-2 as Knocked Down, 3-5 as Stunned, and 6 as Out of Action.',
        exception: 'Does not apply to Informers',
      },
      {
        nom: 'Hard Head',
        texte: 'Chaos Dwarfs ignore the special rules of maces, hammers, and other such weapons. They too are not easy to knock silly!',
        exception: 'Does not apply to Informers',
      },
      {
        nom: 'Armour',
        texte: 'Chaos Dwarfs suffer no Movement penalty for wearing armour.',
        exception: 'Does not apply to Informers',
      },
      {
        nom: 'Hired Swords',
        texte:
          'A Chaos Dwarf warband may hire the following Hired Swords: Ogre Bodyguard, Gladiator, Wizard, Imperial Assassin, and Hobgoblin Scout. They may also hire any Hired Sword available to all warbands, as well as those available to Orc and Chaos warbands. They may never hire any Elf Hired Sword, whoever they are!',
        exception: 'Does not apply to Informers',
      },
    ],
    profils: {
      hierogrammate: {
        nom: 'Hierogrammate',
        regles_speciales: [
          { nom: 'Leader', texte: "Any warrior within 6\" of the Hierogrammate may use the latter's Leadership for their tests." },
          { nom: 'Sorcerer', texte: 'The Hierogrammate is a spellcaster who uses the Rituals of Hashut (see Magic).' },
          {
            nom: 'Priest',
            texte: 'The Hierogrammate starts with two rituals. One of them is the Sacrificial Ritual. The other spell is determined as usual from the Rituals of Hashut.',
          },
        ],
      },
      geolier: {
        nom: 'Jailer',
        regles_speciales: [
          { nom: 'Bad Reputation', texte: 'Jailers are known for their brutality. The mere thought of being captured by one of them strikes fear into Humans.' },
        ],
      },
      centaure_taureau: {
        nom: 'Bull Centaur',
        regles_speciales: [
          {
            nom: 'Large Target',
            texte:
              "Bull Centaurs are large creatures and therefore make prime targets for archers. They are Large Targets, as defined in the Mordheim shooting rules. As a Large Target, the Bull Centaur adds an extra +20 to the warband's rating.",
          },
          { nom: 'No Missile Weapons', texte: 'May never be equipped with missile weapons.' },
        ],
      },
      delateur: {
        nom: 'Informer',
        regles_speciales: [
          {
            nom: 'The Grind',
            texte: "The will of Informers has been broken by their masters. Informers will never become Heroes. Re-roll any 'Lad's Got Talent' result.",
          },
        ],
      },
      nain_du_chaos: { nom: 'Chaos Dwarf' },
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
      guerrier_gnoblar: {
        nom: 'Gnoblar Fighter',
        regles_speciales: [
          { nom: 'Weapons/armour', texte: 'Equipped with a dagger and shrapnel (counts as a throwing weapon, range 8", Strength 2, and double shot).' },
          {
            nom: 'Utterly Insignificant',
            texte: "Counts towards the warband's warrior count, but is not counted for Rout tests (neither for determining the warband's starting size nor for casualties).",
          },
          {
            nom: 'Squabbles',
            texte: 'Roll 1D6 at the start of the turn for each Gnoblar not engaged in hand-to-hand combat, within 2" of another Gnoblar. On a roll of 1, the Gnoblar insults, curses, and/or threatens the other Gnoblar and can do nothing else this turn.',
          },
          {
            nom: 'Like a War Dog',
            texte:
              'Does not count as an animal in the fiction (counts as a Greenskin, not subject to Animosity), but follows the same rules as a war dog: never gains experience, recovery 1-2 Dead/3-6 Alive, counts towards the maximum warband size.',
          },
        ],
      },
    },
    competences_speciales: {
      increvable: {
        nom: 'Unstoppable',
        texte:
          'A Chaos Dwarf with this skill is renowned for surviving wounds that would fell a lesser warrior. After a game in which this Hero was taken Out of Action, when you roll on the Serious Injury table, the dice may be re-rolled once. The result of this second roll must be accepted, even if the consequences are worse.',
      },
      ingenieur_du_chaos: {
        nom: 'Chaos Engineer',
        texte:
          'The Hero has extensive technical knowledge which he can put to use crafting fell weapons and armour. Whenever a Hero with this skill searches for Chaos armour (including an exoskeleton) or obsidian weapons, he gains a +3 bonus to the roll. This bonus represents the engineer\'s ability to craft these items himself, and therefore ignores the special rules on rarity and the Gift of Chaos. This skill does not grant the ability to wear Chaos armour.',
      },
      crane_epais: {
        nom: 'Thick Skull',
        texte:
          "The Hero has a thick skull, even for a Chaos Dwarf. The Hero has a special 3+ save to avoid being Stunned. If the save is successful, the Hero is treated as Knocked Down instead. If the Chaos Dwarf also wears a helmet, this save is 2+ instead of 3+ (which replaces the helmet's usual special rule).",
      },
      chasseur_de_ressources: {
        nom: 'Resource Hunter',
        texte: 'This Chaos Dwarf is particularly skilled at locating valuable resources. When he rolls on the Exploration table at the end of the game, the Hero may modify one die roll by +1/-1.',
      },
      tres_coriace: {
        nom: 'Extremely Tough',
        texte: 'Chaos Dwarfs are sturdy creatures, and this Hero is determined, even for a Chaos Dwarf! On the Injury table, a roll of 1-3 is treated as Knocked Down, 4-5 as Stunned, and 6 as Out of Action.',
      },
      tyran: {
        nom: 'Tyrant',
        reserve_a: 'Leader (Hierogrammate) only',
        texte:
          "This priest of Hashut is renowned for his tyranny. His word is absolute, and his own warband fears his cruelty more than the enemy's. During a Rout test, if the warband is led by a Leader with this skill, he may rally his warband to hold their ground. This skill allows the Leader to re-roll a failed Rout test as long as the Leader is not Knocked Down or Stunned. If the test is re-rolled, the new result applies, even if it is worse. If the Leader is taken Out of Action, the warband must immediately take a Rout test.",
      },
    },
    equipement: {
      nains_du_chaos: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        armes_tir: ['30gc per pair', undefined, undefined],
      },
      delateurs: {
        armes_cac: ['first free', undefined, undefined, undefined],
      },
    },
    magie: {
      nom: 'Rituals of Hashut',
      type: 'sorcery',
      sorts: [
        {
          nom: 'Sacrificial Ritual',
          texte:
            "The Hierogrammate must be in contact with a Chaos Machine to cast this ritual. Remove a captive from the machine and from his original warband's roster. The Hierogrammate may sacrifice additional captives to reduce the difficulty by -1 per extra sacrifice (before the test). On a success, +1D3 XP.",
          note: 'Mandatory spell known from the start',
        },
        { nom: 'Spirit of Hashut', texte: 'Draw an 18" line from the Hierogrammate. All fighters along the line suffer a Strength 4 hit.' },
        { nom: 'Bellow of Doom', texte: 'All fighters in base contact with the Hierogrammate must pass a Leadership test or break off combat and flee.' },
        { nom: 'Fumes of Azgorh', texte: 'Range 8", hits all fighters in its path on a 4+. Strength 4 hit, no armour save allowed.' },
        {
          nom: 'Glittering Skin',
          texte:
            "Can be cast on the Hierogrammate himself or any fighter within 6\". Negates any Wound suffered on a 4+. In hand-to-hand combat, any fighter who hits the target suffers a Strength 3 hit for each blow landed. Lasts until the start of the Hierogrammate's next Shooting phase.",
        },
        { nom: 'Lava Flow', texte: 'The Hierogrammate moves 12" in any direction, even to charge, but may only reappear on or beneath the ground.' },
        { nom: 'Earthquake', texte: 'All fighters (friend or foe) within 3" of the Hierogrammate must pass an Initiative test or suffer 1D3 Strength 4 hits.' },
      ],
    },
  },
  gladiateurs: {
    nom: 'Pit Fighters (1b)',
    regles_speciales: [
      {
        nom: 'Pit Fighter',
        texte: 'All models in the warband gain +1 WS and +1 Attack if the fight takes place inside a building, in ruins, or in an arena (to be clearly defined before the game).',
      },
      { nom: 'Free the Slaves!', texte: 'Gladiators despise all slavers and will never sell a captured opponent to one of them.' },
      {
        nom: 'In the Pit!',
        texte:
          "A captured prisoner can be sent to fight in the arenas of Cutthroat's Haven (full rules in Town Cryer #14): if the Gladiator sent wins, he gains +2 XP and the warband receives the prisoner's weapons/armour plus 50 gc; if he loses, roll a restricted Serious Injury (Stripped/Captured/Hardened/Sold to the Arena/Miraculous Survival results excluded) with no loss of equipment, and the winning prisoner then gains +50 gc and +2 XP. The crowd then decides (4+ on 1D6) whether the prisoner is freed; otherwise he remains captive and can be sent back into the arena after future games.",
      },
      {
        nom: 'Fighting Styles',
        texte:
          'Except for Ogre Gladiators and Troll Slayers (separate restricted list), each model chooses a fighting style from the corresponding list (matching weapons and armour); a Hero may mix styles if he has Weapons Training and/or Weapons Expert. The warband may switch styles between games (swapping equipment or buying the missing pieces) and Henchmen may have different styles within the same group. Official price for the complete style, to be applied manually instead of the itemised total if the whole style is bought at once: Orc 20 gc, Undead 35 gc, Empire 45 gc, Chaos 50 gc, Skink Style 25 gc, Witch Elf Style 30 gc.',
      },
      { nom: 'Hired Swords', texte: 'The warband may hire any available Hired Sword, except the Elf Ranger.' },
    ],
    profils: {
      roi_de_larene: {
        nom: 'Pit King',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any model within 6" of the Pit King may use his Leadership for their tests.' },
        ],
      },
      veteran_de_larene: { nom: 'Pit Veteran' },
      gladiateur_tueur_de_trolls: {
        nom: 'Dwarf Troll Slayer',
        regles_speciales: [
          {
            nom: 'Hard to Kill',
            texte: 'Only taken Out of Action on a roll of 6 (instead of 5-6) on the Injury table: 1-2 Knocked Down, 3-5 Stunned, 6 Out of Action.',
          },
          { nom: 'Hard Head', texte: 'Ignores the special rules of maces, hammers, and other blunt weapons.' },
          { nom: 'Hatred of Orcs and Goblins', texte: 'Like all Dwarfs, hates Orcs and Goblins (see Psychology).' },
          { nom: 'Grudge-Bearer', texte: 'If the warband hires an Elf Hired Sword, the Dwarf Troll Slayer immediately leaves the warband.' },
          { nom: 'Death Wish', texte: 'Immune to Psychology and never takes a test when fighting alone.' },
        ],
      },
      gladiateur: { nom: 'Pit Fighter' },
      retiaire: {
        nom: 'Pursuer',
        regles_speciales: [
          {
            nom: 'Evade',
            texte: 'If targeted by a charge, may attempt to dodge by passing an Initiative test: on a success, the charge is considered to have failed.',
          },
        ],
      },
      gladiateur_ogre: {
        nom: 'Ogre Pit Fighter',
        regles_speciales: [
          { nom: 'Fear', texte: 'A large creature that causes Fear (see Psychology).' },
          { nom: 'Large', texte: 'Large Target, as explained in the Shooting chapter.' },
          {
            nom: 'Slow Witted',
            texte: 'Only ticks off half a box for each experience point earned; therefore needs double the usual XP to advance.',
          },
          {
            nom: 'Skills',
            texte:
              "If he becomes a Hero on a 'Lad's Got Talent' result, chooses his skills from the Combat and Strength lists, plus the Gladiators' special skills (Body Slam, Force of Will, Bulging Biceps, Weapons Master, Grizzled Veteran).",
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
      renversement: {
        nom: 'Body Slam',
        texte:
          'Instead of a normal charge, attempts a single attack with +1 to hit and +1 Strength, without weapon or Weapon Skill bonus; scores a Critical Hit on a 5+.',
      },
      volonte_de_fer: {
        nom: 'Force of Will',
        texte:
          'Taken Out of Action, tests his Toughness to get back up and keep fighting; at the start of each following turn, he repeats the test with a cumulative -1 penalty, until he fails again (removed from the battlefield).',
      },
      gros_bras: {
        nom: 'Bulging Biceps',
        texte: "Ignores Fatigue penalties; his weapon's Strength bonus applies during every round of hand-to-hand combat, not just the first.",
      },
      maitre_darmes: {
        nom: 'Weapons Master',
        texte:
          'Ignores the restrictions of the Difficult to Handle rule, allowing him to combine, for example, a morning star and a shield, or even a pair of morning stars.',
      },
      vieux_de_la_vieille: { nom: 'Grizzled Veteran', texte: 'Immune to Psychology.' },
      berserk_gladiateur: {
        nom: 'Berserk',
        reserve_a: 'Dwarf Troll Slayer only',
        texte: '+1 to hit in hand-to-hand combat during the turn he charges (not cumulative with Furious Charge).',
      },
      charge_furieuse_gladiateur: {
        nom: 'Furious Charge',
        reserve_a: 'Dwarf Troll Slayer only',
        texte: 'May double his number of Attacks during the turn he charges, with a -1 penalty to hit.',
      },
      tueur_de_monstres: {
        nom: 'Monster Slayer',
        reserve_a: 'Dwarf Troll Slayer only',
        texte: 'Always wounds his opponent on a 4+ regardless of Toughness, unless his Strength already allows him to wound more easily.',
      },
    },
    equipement: {
      style_skink: {
        armes_tir: ['or Javelins', 'or Trident'],
        armures: [undefined, 'or Net'],
        divers: ['or Buckler'],
      },
      style_furie: {
        armes_cac: [undefined, 'bought as a pair, or Spear and Net', 'or pair of Swords'],
        divers: ['with Spear, or pair of Swords'],
      },
      ogres_trolls: {
        armes_cac: ['first free', 'Hammer or Mace', undefined, undefined, undefined, undefined, undefined, undefined],
      },
    },
  },
  kislevites: {
    nom: 'Kislevites (1a)',
    regles_speciales: [
      {
        nom: 'Hired Swords',
        texte: 'A Kislevite warband may hire the same Hired Swords as the human Mercenary warbands described in the Mordheim rulebook.',
      },
      {
        nom: 'Old Enemies',
        texte:
          'Kislevites may never ally with any Chaos warband of any kind. This restriction extends to the following warbands: Possessed, Beastmen, Skaven, Dark Elves, Chaos Dwarfs, and any other warband deemed too chaotic by the players.',
      },
    ],
    profils: {
      capitaine_de_druzhina: {
        nom: 'Druzhina Captain',
        regles_speciales: [
          { nom: 'Leader', texte: "Any warrior within 6\" of the Druzhina Captain may use the latter's Ld for all his Leadership tests." },
          {
            nom: 'Heirloom',
            texte:
              "When the warband is created, the Captain may buy one item from the Kislevite Warriors' equipment list at half price (family heirloom). If he loses this item (for example, a 'Stripped' result on the Injury table), he must replace it as soon as possible with a good-quality substitute by rebuying the same item at 150% of its usual price. Until the item is replaced, the Captain suffers a -1 penalty on all his tests and to-hit rolls.",
          },
        ],
      },
      dompteur_dours: {
        nom: 'Bear Tamer',
        regles_speciales: [
          {
            nom: 'Bear Tamer',
            texte:
              "A Kislevite warband that includes a Bear Tamer may recruit a Tamed Bear as a Henchman. This animal has been trained to follow the Tamer's instructions: it automatically passes its Stupidity tests when within 6\" of the Bear Tamer (even if the latter is Knocked Down or Stunned).",
          },
        ],
      },
      esaul: { nom: 'Esaul' },
      recrue: { nom: 'Recruit' },
      guerrier_kislevite: {
        nom: 'Warrior',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Any number. Bought in groups of 1 to 5.' }],
      },
      cosaque: {
        nom: 'Cossack',
        regles_speciales: [
          {
            nom: 'Hatred of Chaos',
            texte: 'Cossacks are subject to Hatred of the forces of Chaos, i.e. the members of any warband to which the Old Enemies rule applies.',
          },
          { nom: 'Recruitment', texte: 'Any number. Bought in groups of 1 to 5.' },
        ],
      },
      streltsi: {
        nom: 'Streltsi',
        regles_speciales: [
          {
            nom: 'Support',
            texte:
              'A Streltsi armed with a halberd and an arquebus may use the halberd to rest his firearm on: he then gains a +1 bonus to hit with his arquebus as long as he does not move during the Movement phase (even if he has a skill that allows him to move and shoot).',
          },
          { nom: 'Recruitment', texte: 'Only Kislevite warriors trained in the use of arquebuses. Bought in groups of 1 to 5.' },
        ],
      },
      ours_apprivoise: {
        nom: 'Tamed Bear',
        regles_speciales: [
          { nom: 'Recruitment', texte: 'May only be included if the warband already has a Bear Tamer.' },
          {
            nom: 'Tamed',
            texte:
              "The Bear simply obeys its tamer. It is subject to Stupidity, but automatically passes its Stupidity tests if it is within 6\" of the Tamer. The Bear never uses the warband leader's Ld, but may use the Tamer's if it is within 6\" of him. The warband cannot control the Bear without its tamer present: if the warband loses the Tamer, the Bear stays in its cage until the warband recruits another one.",
          },
          { nom: 'Frightening', texte: 'A charging bear is a fearsome sight. A Tamed Bear causes Fear.' },
          {
            nom: 'Bear Hug',
            texte:
              "If the Bear hits an enemy model with both its Attacks in the same round of combat, the player may have it make a single bear hug hit instead of the two ordinary hits. Both players roll 1D6 + their model's Strength: if the bear's total is equal to or higher, the enemy automatically loses 1 Wound with no armour save; otherwise it breaks free unharmed.",
          },
          {
            nom: 'Fiercely Loyal',
            texte:
              'If, at the end of a game, the Bear has not been taken Out of Action, the Tamer may ignore Stripped, Captured, and Sold to the Arena results (and their equivalents) on the Serious Injury table: treat them instead as Full Recovery.',
          },
          { nom: 'Animal', texte: 'Bears are animals and therefore never gain experience points.' },
          { nom: 'Large Target', texte: 'See the rulebook, Shooting chapter.' },
          { nom: 'Equipment', texte: 'Fangs and claws!' },
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
      guerriers_kislevites: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        armes_tir: [undefined, undefined, undefined, undefined, '30gc per pair', '50gc per pair'],
      },
      streltsi: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        armes_tir: [undefined, undefined, '30gc per pair', '50gc per pair', undefined],
      },
    },
  },
  pirates: {
    nom: 'Pirates (1b)',
    regles_speciales: [
      {
        nom: 'Hired Swords',
        texte:
          "Unless stated otherwise, Pirate warbands have access to the same Hired Swords and items as a human Mercenary warband. The same applies to the usual rules. Pirates must, however, pay an extra +20 gc in wages if their warband includes both Dwarfs and Elves at the same time (the ship isn't that big, and the cramped space makes them more irritable than usual!).",
      },
      { nom: 'Press-Ganged in a One-off Game', texte: 'In a one-off game, a Pirate warband starts with 2 free Swabbies!' },
      { nom: 'Succession', texte: 'If the Captain is killed, one of the Mates takes over in the same way a Champion would take command of a Mercenary warband.' },
      {
        nom: 'Press-Ganging',
        texte:
          "Pirate warbands can 'recruit' new members to join the exciting life of piracy, sometimes of their own free will, but more often as an alternative to the plank! Only human Heroes or Henchmen can be recruited this way. Any human Hero from a warband fighting the Pirates who suffers the Captured (61) result on the Serious Injury table may be 'offered' a place in the crew (usually at the point of a cutlass!). Each player rolls 2D6, the Pirate player adding his Captain's Leadership and the opponent adding the captured Hero's Ld. If one side won the game, it may add +1 to its result. If the Pirate player scores the higher result, the Hero abandons his old life and becomes a Crewman (skills and characteristics changed to match those of a basic Crewman, or those of his new crewmates if he joins an existing group). If the Hero scores the higher result, he resists the sirens' song and becomes a Swabbie (stripped of his equipment and weapons, but keeps his original skills and characteristics). Enemy human Henchmen taken Out of Action in a game won by the Pirates (a 1-2 result on the Serious Injury roll) also have a chance to join the crew, following a similar procedure. This rule is not automated in the app: it is resolved entirely on the tabletop, by agreement with the opponent, and the new member must be added manually to the warband (as a Swabbie or Crewman, depending on the result).",
      },
      {
        nom: 'Vagabonds and Prisoners',
        texte:
          'On the Exploration table, if the Pirates roll the (4.4) Vagabonds or (3.3.3) Prisoners result during their search, they may agree to come aboard the Jolly Roger and join the crew as a Swabbie or Crewman, following a procedure similar to that used to recruit an ordinary Hired Sword. Not automated — resolve on the tabletop.',
      },
    ],
    profils: {
      capitaine_pirate: {
        nom: 'Pirate Captain',
        regles_speciales: [
          { nom: 'Leader', texte: "Any Pirate within 6\" of the Pirate Captain may use the latter's Ld for his Leadership tests." },
        ],
      },
      quartier_maitre: { nom: 'Mate' },
      mousse: { nom: 'Cabin Boy' },
      matelot: { nom: 'Crewman' },
      artilleur: {
        nom: 'Gunner',
        regles_speciales: [
          {
            nom: "Swivel Guns are Dangerous, Lad!",
            texte:
              "Gunners are known to be among the bravest pirates thanks to their familiarity with black powder weapons. But even among their own, they admire those who dare to bring a swivel gun into battle. Generally, they keep a safe distance, because even they can never be sure when it's going to go off. If a Pirate warband includes a swivel gun, the Gunner wielding it will always be treated as a one-man Henchman group and can never have anyone else with him. As a Pirate warband can only have a single swivel gun, if a Gunner is equipped with one, he must either be a new recruit or be split off from an existing Henchman group. In the latter case, he keeps all the experience and skills he had already gained.",
          },
        ],
      },
      bosco: {
        nom: 'Bosun',
        regles_speciales: [
          {
            nom: 'Expert Riggers',
            texte:
              "Bosuns are highly skilled with ropes, since they maintain the ship's complex web of rigging. They may re-roll failed Initiative tests when jumping over a gap, making a diving charge, or when climbing up or down a rope.",
          },
          {
            nom: 'Rope & Grapnel',
            texte: "Bosuns start with a rope & grapnel and may be equipped with weapons and armour chosen from the Pirates' equipment list. Note that they can never sell or give away their rope & grapnel!",
          },
        ],
      },
      enrole: {
        nom: 'Swabbie',
        regles_speciales: [
          {
            nom: 'Not Recruited',
            texte:
              "Swabbies are not recruited for Gold Crowns: they join the warband through the Press-Ganging special rule (a captured enemy Hero or Henchman) or through the Vagabonds/Prisoners results on the Exploration table — see the Pirates' special rules. This profile is provided here so it can be recorded manually in the warband once the procedure has been resolved on the tabletop.",
          },
          {
            nom: 'Never Gains Experience',
            texte: 'Generally speaking, Swabbies have no desire to prove their worth to the crew. They are only interested in surviving and, if possible, escaping!',
          },
          {
            nom: 'Riff-Raff',
            texte:
              "Swabbies need not all be armed the same way. Each of them may be given different equipment, as long as it appears on the Swabbies' equipment list. Swabbies can never use magic or cast spells in any way, whatever their background or original abilities.",
          },
          {
            nom: "Shiver Me Timbers, They've Taken to the Sails!",
            texte:
              'If the Pirate warband is Routed, any Swabbies who left the table in previous turns are assumed to have successfully escaped and are never seen again. Remove them from your warband roster as if they were dead.',
          },
          {
            nom: "Don't Mind Them, Lads, They Ain't Real Pirates!",
            texte:
              "The rest of the crew will barely notice if a Swabbie flees or is put out of action; they know they'll catch up with him sooner or later and give him 30 lashes if he's lucky! Swabbies who flee or are taken Out of Action are not counted when working out the Rout test threshold.",
          },
        ],
      },
    },
    competences_speciales: {
      interprete_de_chants_marins: {
        nom: 'Sea Shanty Singer',
        reserve_a: 'Pirate Heroes only',
        texte:
          "In every sea, the pirate is renowned as one of the finest singers to ever tread a ship's boards, able to lift the spirits of any crew with a rousing rendition of pirate songs. At the start of his hand-to-hand combat phase, the Hero may suddenly burst into song, distracting an enemy of his choice in base contact. That enemy must pass a Leadership test or lose 1 Attack for that turn. Does not affect Undead or other non-living creatures, such as the Possessed.",
      },
      constitution_solide: {
        nom: 'Hardy Constitution',
        reserve_a: 'Pirate Heroes only',
        texte:
          "Many months spent at sea eating ship's biscuit have hardened the pirate's body where a less hardy man would have collapsed. During battle, the Pirate may ignore any Critical Hit on a 5+ roll of 1D6 (on a success, the Wound is treated normally). If the roll fails, the Critical Hit applies.",
      },
      voix_tonitruante: {
        nom: 'Booming Voice',
        reserve_a: 'Pirate Captain only',
        texte:
          "The captain has fought in many battles, bellowing orders to his crew, roaring over the din of cannon fire and enemy cries. Once per turn, the Pirate Captain may shout encouragement (or threats) at one of his Pirates within 8\" who has just failed a test resulting in fleeing combat, or a Rally test. That Pirate may then re-take his test. This can only be done if the Pirate Captain is standing and not engaged in hand-to-hand combat.",
      },
      pied_marin: {
        nom: 'Sea Legs',
        reserve_a: 'Pirate Heroes only',
        texte:
          'Even on the roughest seas, the pirate has learned to keep his footing and his balance. During a fight, if the Hero falls, he may ignore the 1D3 hits on a roll of 4+ on 1D6 (make a single roll for all the hits). In addition, if he is Knocked Down or Stunned within 1" of a drop, he may re-roll his Initiative test to determine whether he falls into the void.',
      },
      maitre_du_sabre_dabordage: {
        nom: 'Cutlass Master',
        reserve_a: 'Pirate Heroes only',
        texte:
          'These short-bladed swords are the standard weapon of any pirate crew, and in the hands of a trained sailor they are formidable close-combat weapons. If the Pirate is equipped with a sword, this skill grants him the ability to succeed a parry on a roll equal to or higher than the attacker\'s result, instead of strictly higher. This ability only applies if the Pirate is under cover, inside a building, or within 2" of a terrain feature such as a wall, tree, etc.',
      },
      bretteur: {
        nom: 'Swashbuckler',
        reserve_a: 'Pirate Heroes only',
        texte:
          "This pirate stands out in combat with his dashing style, blending dazzling swordplay and acrobatic feats with charm and witty remarks. Even Mordheim's vilest scoundrels respect (and curse) his ability to always seem to slip effortlessly from their grasp. The Pirate may make a Leadership test at the end of a hand-to-hand combat phase (his turn or the enemy's) if he is still in base contact with enemy fighters. If successful, he may make a normal Move to get away from the enemy (he may not run or charge), without the enemy striking him. If he fails the test, he remains in combat and must fight normally next turn.",
      },
    },
    equipement: {
      pirates: {
        armes_cac: ['first free', 'Hammer or Mace', undefined, undefined, undefined, 'Cutlass', undefined],
        armes_tir: [undefined, undefined, undefined, '30gc per pair', '60gc per pair'],
      },
      artilleurs: {
        armes_cac: ['first free', 'Hammer or Mace', undefined, 'Cutlass'],
        armes_tir: ['30gc per pair', '60gc per pair', undefined, undefined, 'one per warband'],
      },
      enroles: {
        armes_cac: ['first free', 'Hammer or Mace', undefined, 'Hook', 'Cutlass', undefined],
      },
    },
  },
  marienburgers: {
    nom: 'Marienburg Mercenaries (1a)',
    regles_speciales: [
      {
        nom: 'Rare +1 Bonus',
        texte: 'Thanks to their ties with the merchant guilds of Marienburg, warbands receive a +1 bonus on rare item rolls (see the Trading section).',
      },
      {
        nom: 'Wealth',
        texte:
          'To reflect their financial comfort, Marienburgers start a campaign with 600 gc instead of 500. In a one-off game, they receive a 20% increase to the sum allotted for recruitment (for example 1200 gc instead of 1000 gc for a 1000 gc game).',
      },
    ],
    profils: {
      capitaine_mercenaire: {
        nom: 'Mercenary Captain',
        regles_speciales: [
          { nom: 'Leader', texte: "Any warrior within 6\" of the Mercenary Captain may use the latter's Leadership for his Leadership tests." },
        ],
      },
      champion: { nom: 'Champion' },
      recrue: { nom: 'Recruit' },
      guerrier: {
        nom: 'Warrior',
        regles_speciales: [{ nom: 'Recruitment', texte: 'As many as you like. Bought in groups of 1 to 5.' }],
      },
      tireur: {
        nom: 'Marksman',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' }],
      },
      bretteur: {
        nom: 'Fencer',
        regles_speciales: [
          {
            nom: 'Sword Expert',
            texte:
              'Fencers are so skilled with their weapons that, when they charge, they may re-roll failed to-hit rolls. This only applies when they are equipped with ordinary swords, not two-handed swords or other weapons.',
          },
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' },
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
      mercenaires: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        armes_tir: [undefined, '30gc per pair', '50gc per pair', undefined],
      },
      tireur: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined],
        armes_tir: [undefined, '30gc per pair', undefined, undefined, undefined, undefined, undefined],
      },
    },
  },
  chevaliers_bretonniens: {
    nom: 'Bretonnian Knights (1b)',
    regles_speciales: [
      {
        nom: 'Lady of the Lake',
        texte:
          'Before engaging in battle, Bretonnian Knights kneel and pray to the Lady of the Lake, swearing to fight to the death for honour and justice. Before starting the game, make a Leadership test using the warband Leader\'s Ld. If the test is successful, the Lady of the Lake has granted her blessing to the warband. It takes the form of a powerful curse that falls upon the enemies of chivalry, and especially upon those who make use of foul, dishonourable weapons of mass destruction. Any enemy model wishing to use a firearm must roll 4+ on 1D6 to overcome the curse. On a failure, it may not shoot. The test must be made every time an enemy wishes to use one of these weapons. Models armed with other missile weapons, such as bows or crossbows, do not need to make this test, unless they are targeting a Bretonnian Knight (Questing Knight and Knights Errant only).',
      },
      {
        nom: 'Horsemanship',
        texte:
          'Any model equipped from the start with a mount is considered to already have the riding skill specific to its mount. Thus, at warband creation, any Knight with a warhorse or Squire with a horse gains the Ride (Warhorse) or Ride (Horse) skill, as appropriate.',
      },
    ],
    profils: {
      chevalier_de_la_quete: {
        nom: 'Questing Knight',
        regles_speciales: [
          { nom: 'Leader', texte: "Any model within 6\" of the Questing Knight may use the latter's Leadership to make his tests." },
          {
            nom: 'Knightly Virtue',
            texte: 'A Questing Knight is a chivalrous warrior, far above the ordinary fighter. He never panics and never flees combat. He therefore does not need to take All Alone tests.',
          },
        ],
      },
      chevalier_errant: {
        nom: 'Knight Errant',
        regles_speciales: [
          {
            nom: 'Knightly Virtue',
            texte: 'A Questing Knight is a chivalrous warrior, far above the ordinary fighter. He never panics and never flees combat. He therefore does not need to take All Alone tests.',
          },
          { nom: 'Mount', texte: 'A Knight Errant may not ride a warhorse if the Questing Knight does not already have one.' },
        ],
      },
      ecuyer: {
        nom: 'Squire',
        regles_speciales: [
          { nom: 'Numbers', texte: 'You may not have more Squires than Knights in your warband.' },
          {
            nom: 'Mount',
            texte: 'A Squire may not ride a horse unless the Questing Knight and all the Knights Errant in the warband already ride a warhorse.',
          },
        ],
      },
      homme_darme_bretonnien: { nom: 'Man-at-Arms' },
      archer_bretonnien: { nom: 'Bowman' },
    },
    competences_speciales: {
      vertu_discipline: {
        nom: 'Virtue of Discipline',
        reserve_a: 'Bretonnian Knight Heroes only, instead of a normal skill',
        texte:
          'The knight has total faith in the code of chivalry: he keeps his cool in the face of adversity and shows complete confidence whatever the situation. Once per battle, if the Hero is not Knocked Down, Stunned, or Out of Action, you may re-roll a failed Rout test.',
      },
      vertu_impetuosite: {
        nom: 'Virtue of Impetuousness',
        reserve_a: 'Bretonnian Knight Heroes only, instead of a normal skill',
        texte: 'The knight is eager to clash with his enemies and charges with reckless enthusiasm. When he charges, the Hero adds +1D3" to his Movement. Roll the die before moving the model.',
      },
      vertu_purete: {
        nom: 'Virtue of Purity',
        reserve_a: 'Bretonnian Knight Heroes only, instead of a normal skill',
        texte:
          "The knight's only goal is to serve the Lady of the Lake. The purity of his heart and his discipline grant him a strength of mind that lets him resist his enemies' magic. Any spell cast against the Hero is dispelled on a 4+ on 1D6. This is a natural dispelling caused by the Hero's piety.",
      },
      vertu_bravoure: {
        nom: 'Virtue of Valour',
        reserve_a: 'Bretonnian Knight Heroes only, instead of a normal skill',
        texte:
          "The knight has sworn to fight the greatest and most powerful opponents. The mightier the enemy, the more valiant the knight's efforts. If he fights a model with a Strength higher than his own, the Hero may re-roll failed to-hit rolls in hand-to-hand combat.",
      },
      vertu_noble_dedain: {
        nom: 'Virtue of Noble Disdain',
        reserve_a: 'Bretonnian Knight Heroes only, instead of a normal skill',
        texte: "The knight feels nothing but contempt for enemies who hide behind dishonourable weapons. The Hero is subject to Hatred of all enemies equipped with missile weapons.",
      },
    },
    equipement: {
      chevaliers: {
        armes_cac: ['first free', 'Mace', undefined, undefined, undefined, undefined, undefined],
      },
      ecuyers: {
        armes_cac: ['first free', 'Hammer', undefined, undefined, undefined],
      },
      hommes_darmes: {
        armes_cac: ['first free', 'Hammer', undefined, undefined, undefined, undefined, undefined],
      },
      archers: {
        armes_cac: ['first free', undefined, undefined],
      },
    },
  },
  guerriers_fantomes: {
    nom: 'Shadow Warriors (1b)',
    regles_speciales: [
      {
        nom: 'Aversion to Poison',
        texte:
          'The use of poisons and other drugs is a speciality of the dark elves. Shadow Warriors disapprove of their use even more strongly than the High Elves do. Members of a Shadow Warrior warband never use any type of poison.',
      },
      {
        nom: 'Hate Dark Elves',
        texte: 'All warriors in a Shadow Warrior warband (excluding any Hired Swords) have an unyielding Hatred for Dark Elves.',
      },
      {
        nom: 'Excellent Sight',
        texte:
          "All the Elves in a Shadow Warrior warband can spot Hidden enemies from twice as far away as other warriors (ie, twice their Initiative in inches).",
      },
      {
        nom: 'Merciless',
        texte:
          'In addition to their hatred of their corrupted cousins, the people of Nagarythe have long fought against Chaos. In a multiplayer game, a Shadow Warrior warband may never ally with any warband of a chaotic nature (Possessed, Skaven, Beastmen, Dark Elves, etc.).',
      },
      {
        nom: 'Tolerant',
        texte:
          "Due to their status as outcasts among their own people, the elves of Nagarythe have learned to suppress their contempt for the 'lesser races', and sometimes even work for them. A Shadow Warrior warband may therefore hire any non-chaotic or non-evil Hired Sword (so no Skaven, Possessed, Dark Elves, Undead, etc.). They also avoid anyone who makes use of poisons (so no Assassins).",
      },
    ],
    profils: {
      maitre_des_ombres: {
        nom: 'Shadow Master',
        regles_speciales: [
          { nom: 'Leader', texte: "Any warrior within 6\" of the Shadow Master may use the latter's Leadership value for his Leadership tests." },
        ],
      },
      rodeur_des_ombres: { nom: 'Shadow Walker' },
      tisseur_dombres: {
        nom: 'Shadow Weaver',
        regles_speciales: [
          { nom: 'Sorcerer', texte: 'The Shadow Weaver is a spellcaster who uses the Shadow Magic spell list. He cannot cast spells if he wears armour.' },
        ],
      },
      guerrier_fantome: { nom: 'Shadow Warrior' },
      novice: { nom: 'Novice' },
    },
    competences_speciales: {
      infiltration_fantome: {
        nom: 'Infiltration',
        reserve_a: 'Shadow Warrior Heroes only',
        texte:
          'This skill is identical to the Skaven skill of the same name: at the start of the game, you may place him anywhere on the table, provided he is hidden and more than 12" from any enemy.',
      },
      voir_dans_les_tenebres: {
        nom: 'See in Shadows',
        reserve_a: 'Shadow Warrior Heroes only',
        texte:
          'The warrior\'s senses have been sharpened after years spent moving through the shadows. As long as his Movement allows him to reach them, the warrior may always roll the dice to charge enemies he cannot see (instead of the usual 4").',
      },
      se_cacher_parmi_les_ombres: {
        nom: 'Hide in Shadows',
        reserve_a: 'Shadow Warrior Heroes only',
        texte:
          "Shadow Warriors have learned to stay perfectly still and become undetectable, even to the keen senses of their Dark Elf cousins. An enemy warrior attempting to detect this warrior while he is hidden must halve his Initiative before measuring the distance.",
      },
      tir_silencieux: {
        nom: 'Sniper',
        reserve_a: 'Shadow Warrior Heroes only',
        texte:
          'Long years of guerrilla warfare against the Dark Elves have taught Shadow Warriors how to strike from the shadows without being seen. If hidden, a warrior with this skill may shoot or cast spells while remaining hidden. If his target is not immediately taken Out of Action, it must pass a test against its Initiative to spot him. A success means the shooter is spotted and can no longer remain hidden.',
      },
      solide_carrure_fantome: {
        nom: 'Powerful Build',
        reserve_a: 'Shadow Warrior Heroes only, except the Shadow Weaver, maximum two models per warband',
        texte:
          'For an elf, the warrior is solidly built, capable of physical feats rare among the inhabitants of Ulthuan. A warrior with this skill may choose his skills from the Strength skills table. This skill cannot be taken by a Shadow Weaver. There may never be more than two elves with this skill in a warband at the same time.',
      },
      maitre_des_runes: {
        nom: 'Master of Runes',
        reserve_a: 'Shadow Weaver only',
        texte:
          'The Shadow Weaver has learned to channel the power of elven runes (see Elven Rune Stones) to an unmatched degree. When using Elven Rune Stones, the sorcerer adds +1 to his dispel roll. In addition, the sorcerer may inscribe elven runes on the weapons and armour of one of his companions. A warband member may re-roll a single armour save or parry roll per battle. After a battle, the rune loses its power and must be re-inscribed.',
      },
    },
    equipement: {
      guerriers_fantomes: {
        armes_cac: ['first free', undefined, undefined, undefined, 'Heroes only'],
        armures: ['Helm', undefined, undefined, 'Heroes only'],
        divers: ['Heroes only', 'Heroes only', 'Heroes only', 'Heroes only', 'Heroes only'],
      },
    },
    magie: {
      nom: 'Shadow Magic',
      type: 'sorcery',
      note:
        "The magic wielded by Shadow Weavers differs greatly from the traditional High Magic taught at the Tower of Hoeth. Some spells specify that the target must be near a 'wall': this includes any terrain feature that casts a man-sized shadow.",
      sorts: [
        {
          nom: 'Well of Darkness',
          texte:
            'The area around the sorcerer is suddenly filled with shadows concealing everything within it. This spell allows the sorcerer and everyone within 6" of him to hide, exactly as if a wall stood between them and their opponents. They may hide even after running. The effect ends if an enemy enters the area of effect. In addition, those affected count as being under cover against enemy shooting. This spell lasts until the start of the Shadow Weaver\'s next turn.',
        },
        {
          nom: 'Living Shadows',
          texte:
            'The shadows around the victim come alive and move to strike her. The Shadow Weaver may cast this spell on any enemy model within 12" of him, and within 2" of a wall. The target suffers a single Strength 4 hit with no armour save allowed.',
        },
        {
          nom: 'Wings of Night',
          texte:
            "Dark wings unfurl from the Shadow Weaver's back. He vanishes, reappearing amid the nearby shadows. This spell can only be cast if the sorcerer is within 2\" of a wall. He is immediately moved up to 12\" away, to a spot that is also within 2\" of a wall. If he ends in contact with an enemy model, the Shadow Weaver counts as having charged during the first round of combat.",
        },
        {
          nom: 'Cloak of Darkness',
          texte:
            'The Shadow Weaver seems to be swallowed by impenetrable darkness. The Shadow Weaver hides from the enemy\'s sight. As long as he does not attack an enemy model (by casting spells, shooting, or engaging the enemy in hand-to-hand combat), he cannot be attacked. He may intercept normally, but is not obliged to (and if he does not, enemy warriors may of course move past him when they charge). The effect lasts until the Shadow Weaver attacks an enemy model. A model engaged in hand-to-hand combat can never choose not to attack.',
        },
        {
          nom: 'Theatre of Shadows',
          texte:
            'Tentacles as black as night burst from the darkness to seize an enemy warrior, placing him at the sorcerer\'s mercy. The Shadow Weaver may cast this spell against any enemy model within 24" of him and within 2" of a wall. The target cannot move unless he passes a Strength test on 2D6 at the start of his turn (before the Recovery phase). This spell lasts until the Shadow Weaver suffers a wound or attempts to cast another spell. If attacked while under the effect of the spell, the victim is treated exactly as if he were Stunned.',
        },
        {
          nom: 'Shield of Shadows',
          texte:
            "Shadows form a protective barrier in front of the sorcerer or one of his companions. The Shadow Weaver may cast this spell on himself or a warband member within 12\" of him. The target gains a 5+ armour save unmodified by the attacker's Strength. The spell lasts until the start of the Shadow Weaver's next turn.",
        },
      ],
    },
  },
  beastmen_raiders: {
    nom: 'Beastmen Raiders (1a)',
    regles_speciales: [
      {
        nom: 'Beasts',
        texte: 'Beastmen are ferocious creatures of Chaos and cannot recruit Hired Swords unless stated otherwise in their description.',
      },
      {
        nom: 'Mutation Table',
        texte:
          "Reserved for Heroes with the special skill 'Mutant'. A model's first mutation is bought at normal price; subsequent mutations for the same model cost double — see his Equipment list.",
      },
    ],
    profils: {
      chef_homme_bete: {
        nom: 'Beastman Chief',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any model within 6" of the Beastman Chief may use his Leadership for their tests.' },
        ],
      },
      chaman_homme_bete: {
        nom: 'Beastman Shaman',
        regles_speciales: [
          { nom: 'Sorcerer', texte: 'The Beastman Shaman is a spellcaster who uses the Rituals of Chaos (see Magic).' },
          { nom: 'No Armour', texte: 'May never wear armour under any circumstances.' },
        ],
      },
      bestigor: { nom: 'Bestigor' },
      centigor: {
        nom: 'Centigor',
        regles_speciales: [
          {
            nom: 'Drunk',
            texte:
              'At the start of each turn, roll 1D6. On a 1, take a Stupidity test (if failed, the effect lasts until the end of the turn). On 2-5, nothing happens. On a 6, he becomes frenzied for the duration of the turn. While stupid or frenzied, the Centigor is immune to psychology.',
          },
          { nom: 'Forest Dweller', texte: 'The Centigor suffers no Movement penalty in wooded terrain.' },
          {
            nom: 'Stamping',
            texte:
              'In addition to his weapons, the Centigor uses his hooves to trample his enemies: he therefore has an extra Attack on his profile, unaffected by weapon bonuses and penalties (1 base Attack, the second in brackets A 1(2) coming from this rule).',
          },
        ],
      },
      ungor: {
        nom: 'Ungor',
        regles_speciales: [
          {
            nom: 'Sub-Beasts',
            texte:
              "No matter how many experience points he accumulates, an Ungor can never climb the ranks. If, following an advance roll, an Ungor gets the \"Lad's Got Talent\" result, the dice must be re-rolled.",
          },
          { nom: 'Recruitment', texte: 'As many as you wish.' },
        ],
      },
      gor: {
        nom: 'Gor',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' }],
      },
      chien_du_chaos: {
        nom: 'Chaos Hound',
        regles_speciales: [
          { nom: 'Animals', texte: 'Chaos Hounds are animals and therefore never gain experience points.' },
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' },
          {
            nom: 'Equipment',
            texte:
              'Apart from their claws, fangs, and — for the most mutated — a few horns, Chaos Hounds have no equipment. They therefore fight without any penalty.',
          },
        ],
      },
      minotaure: {
        nom: 'Minotaur',
        regles_speciales: [
          { nom: 'Fear', texte: 'The Minotaur is huge and causes Fear.' },
          {
            nom: 'Bloodlust',
            texte: 'If the Minotaur takes all his enemies Out of Action in hand-to-hand combat, he becomes frenzied on a 4+ on 1D6.',
          },
          {
            nom: 'Animal',
            texte:
              'The Minotaur is far more bestial than his Beastman brethren; although classed as a Henchman capable of gaining experience, he will never become a Hero or take skills.',
          },
          { nom: 'Large Target', texte: 'The Minotaur is a Large Target, as described in the Shooting rules.' },
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
      cuir_epais: {
        nom: 'Shaggy Hide',
        texte:
          "The Beastman's massively shaggy hide acts as armour, deflecting sword strokes and protecting him from harm: 6+ armour save, combinable with other armour.",
      },
      mutant: {
        nom: 'Mutant',
        texte: 'The Beastman may acquire a Mutation (see the Mutation Table special rule).',
      },
      sans_peur: {
        nom: 'Fearless',
        texte: 'The Beastman is immune to Fear and does not need to take an All Alone test.',
      },
      le_cornu: {
        nom: 'The Horned One',
        texte: 'The Beastman has large horns he can use when charging to make an extra Attack resolved at his base Strength.',
      },
      mugissement: {
        nom: 'Bellow',
        reserve_a: 'Beastman Chief only',
        texte: 'Allows a failed Rout test to be re-rolled.',
      },
      mangeur_dhommes: {
        nom: 'Man-Eater',
        texte: 'The bearer of this skill is subject to Hatred when fighting human warbands.',
      },
    },
    equipement: {
      hommes_betes: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined],
      },
      ungors: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined],
      },
    },
    magie: {
      nom: 'Rituals of Chaos',
      type: 'sorcery',
      sorts: [
        {
          nom: 'Vision of Torment',
          texte:
            "Range 6\", cast on the nearest enemy (or a target in base contact if the Shaman is engaged in hand-to-hand combat). The victim is immediately Stunned; if it cannot be Stunned, it is Knocked Down instead.",
        },
        {
          nom: 'Eye of God',
          texte:
            'Usable once per battle. Choose any model within 6", friend or foe, and roll 1D6: 1 = immediate Out of Action (no Serious Injury roll); 2-5 = +1 to a characteristic of choice for the battle; 6 = +1 to all characteristics for the duration of the battle.',
        },
        {
          nom: 'Dark Blood',
          texte:
            'Range 8", causes D3 Strength 5 hits on the first model in its path. The Shaman must then roll on the Injury table for his own Wound (an Out of Action result is treated as Stunned).',
        },
        {
          nom: 'Lure of Chaos',
          texte:
            "Range 12\", cast on the nearest enemy model. Compare 1D6+Ld of the Shaman to 1D6+Ld of the target; if the Shaman wins, he takes control of his victim until it passes a Leadership test during the opponent's Recovery phase.",
        },
        {
          nom: 'Wings of Darkness',
          texte:
            'The Shaman may immediately move anywhere within 12", even into base contact with an enemy (counts as having charged). If he engages a fleeing enemy, he inflicts an automatic hit, and the enemy flees again if it survives.',
        },
        {
          nom: 'Word of Pain',
          texte: 'All models within 3" of the Shaman, friend or foe, suffer a Strength 3 hit with no armour save.',
        },
      ],
    },
  },
  ostlanders: {
    nom: 'Ostlander Mercenaries (1a)',
    regles_speciales: [
      {
        nom: 'Self-Reliant',
        texte:
          "The Ostlanders have no desire to let their hard-earned gold end up in a stranger's hands. As a result, they may never hire Hired Swords, except Ogres (who are not uncommon in Ostland).",
      },
    ],
    profils: {
      doyen: {
        nom: 'Elder',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any model within 6" of the Elder may use his Leadership for their tests.' },
        ],
      },
      pretre_de_taal: {
        nom: 'Priest of Taal',
        regles_speciales: [
          { nom: 'Prayers', texte: 'A Priest of Taal may use the Prayers of Taal (see Magic).' },
          { nom: 'Frail', texte: 'Priests of Taal may never wear heavy armour.' },
        ],
      },
      freres_de_sang: { nom: 'Blood Brothers' },
      proche: {
        nom: 'Kinsman',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' }],
      },
      jaeger: {
        nom: 'Jaeger',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' }],
      },
      vaurien: {
        nom: 'Wastrel',
        regles_speciales: [
          {
            nom: 'Drunk',
            texte: "Wastrels' minds are addled by rotgut and bad beer. They therefore automatically pass any Leadership tests they must take.",
          },
          {
            nom: 'Disreputable',
            texte: 'Wastrels provoke mixed feelings among their comrades, a strange blend of pity and fear. They can therefore never become the warband Leader.',
          },
        ],
      },
      ogre: {
        nom: 'Ogre',
        regles_speciales: [
          { nom: 'Fear', texte: 'Ogres are huge, threatening creatures that cause Fear.' },
          {
            nom: 'Large Target',
            texte: 'Ogres are bulky, massive creatures, making them good targets for archers. They are Large Targets, as defined in the Shooting rules.',
          },
          {
            nom: 'Skills',
            texte: "An Ogre who becomes a Hero through the \"Lad's Got Talent\" rule may choose from the Combat and Strength skill lists.",
          },
          {
            nom: 'Slow Witted',
            texte:
              'Although Ogres are capable of gaining experience and benefiting from advances, they are not the brightest of creatures. Ogres only gain an advance every other time (they must accumulate twice the normal amount of experience to gain an advance).',
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
      ruee_du_taureau: {
        nom: 'Bull Rush',
        texte:
          'When he charges, the Hero may attempt to knock down his opponent instead of making normal attacks: roll to score a single hit with a +1 modifier, with no wound roll. If the warrior hits, the target is Knocked Down.',
      },
      odeur_nauseabonde: {
        nom: 'Foul Stench',
        texte:
          'All living enemies (not Undead or Possessed) suffer a -1 penalty to hit this warrior in hand-to-hand combat. He may not carry a burning item, and fire attacks against him are resolved at Strength +1 due to his alcohol-soaked clothes.',
      },
      serment_de_sang: {
        nom: 'Blood Oath',
        reserve_a: 'Warband Leader only',
        texte: 'Allows one failed Rout test to be re-rolled per game.',
      },
      narguer: {
        nom: 'Taunt',
        texte:
          'During the Shooting phase, the warrior may choose to taunt an enemy instead of shooting or casting a spell (follows the normal targeting rules for shooting: the nearest visible enemy, etc.). The enemy must take a Leadership test: if failed, he must spend his next Movement phase engaging the warrior who taunted him in hand-to-hand combat.',
      },
      amis_des_betes: {
        nom: 'Friend of Beasts',
        texte:
          "This warrior radiates a charm that affects all \"ordinary\" animals (warhorses, war dogs, etc.): they will never attack him, and up to two War Dogs owned by this model do not count towards the warband's maximum model count.",
      },
    },
    equipement: {
      ostlanders: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined],
        armes_tir: ['30gc per pair', undefined],
      },
      vauriens: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined],
      },
      jaegers: {
        armes_cac: ['first free', undefined, undefined, undefined],
        armes_tir: [undefined, undefined, undefined, '30gc per pair', '60gc per pair', undefined, undefined],
      },
    },
    magie: {
      nom: 'Prayers of Taal',
      type: 'prayer',
      note: 'The Prayers of Taal function like the Prayers of Sigmar, though a Priest of Taal rarely wears armour.',
      sorts: [
        {
          nom: "Stag's Leap",
          texte:
            'The Priest may immediately move anywhere within 9", including into base contact with an enemy (charging at Strength +1 for the first round). If he makes contact with a fleeing enemy, he inflicts an automatic Strength +1 hit during the hand-to-hand combat phase, and the enemy flees again if it survives.',
        },
        {
          nom: 'Blessed Beer',
          texte:
            'The Priest may heal himself or any model within 2" of him, who recovers his full Wounds. In addition, all living enemy models (not Undead or Possessed) within 2" of the Priest lose 1 Attack during the next combat phase, due to the powerful fumes of beer.',
        },
        {
          nom: "Bear's Paw",
          texte: "The Priest calls upon the blessing of Taal on himself or a friendly model within 6\": the target gains +2 Strength until the Priest's next turn.",
        },
        {
          nom: 'Earthquake',
          texte:
            'The spell must be cast on a building within 4". Any enemy model in contact with the building suffers a Strength 3 hit. In addition, the building collapses and models inside it suffer a fall (for every 2" fallen, an Initiative test must be passed to avoid D3 Strength 5 hits). Remove the building from the board for the rest of the game.',
        },
        {
          nom: 'Snares',
          texte:
            'Creeping vines and small trees burst from the ground: all friendly or enemy models (except Ostlander Jaegers) within 12" of the Priest may only move at half their Movement until the next Shooting phase.',
        },
        {
          nom: 'Call of the Squirrels',
          texte:
            'The Priest summons dozens of enraged squirrels that attack an enemy within 12" of the Priest: the target suffers 2D6 Strength 1 hits, with no save allowed.',
        },
      ],
    },
  },
  carnival_of_chaos: {
    nom: 'Carnival of Chaos (1a)',
    regles_speciales: [
      {
        nom: 'Sinister Reputation',
        texte: 'Due to its plague-ridden nature, a Carnival of Chaos may not recruit any Hired Swords.',
      },
      {
        nom: 'Corrupted',
        texte:
          'The Carnival resembles Possessed warbands (a collection of corrupted mutants): it counts as a Possessed warband for all purposes relating to Exploration and Serious Injuries.',
      },
      {
        nom: 'Blessings of Nurgle',
        texte: 'Options reserved for the Impure, purchased only at recruitment (none may be added once the Impure is in play) — see his Equipment list.',
      },
    ],
    profils: {
      maitre_de_ceremonie: {
        nom: 'Master of Ceremonies',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any member of the Carnival within 6" may use his Ld for Leadership tests.' },
          { nom: 'Sorcerer', texte: 'Uses the Rituals of Nurgle (see Magic).' },
        ],
      },
      colosse: {
        nom: 'Colossus',
        regles_speciales: [
          { nom: 'Supernatural Strength', texte: 'Starts with the Strongman Strength skill from the rulebook.' },
        ],
      },
      impur: {
        nom: 'Impure',
        regles_speciales: [
          {
            nom: 'Blessing of Nurgle',
            texte: 'Must receive one or more Blessings of Nurgle at the time of recruitment (see the dedicated list); none may be added once the Impure is in play.',
          },
          { nom: 'Cost', texte: '+ the price of the chosen Blessing(s) of Nurgle.' },
        ],
      },
      portepeste: {
        nom: 'Plaguebearer',
        regles_speciales: [
          { nom: 'Cloud of Flies', texte: "The Plaguebearer's opponents suffer a -1 penalty to hit it in hand-to-hand combat." },
          { nom: 'Flow of Corruption', texte: 'Shooting attack (range 6", Strength 3, no armour save) consisting of a spray of worms, entrails, and pus.' },
          { nom: 'Daemon', texte: 'Made of raw Chaos energy; never gains experience.' },
          { nom: 'Immunity to Poison', texte: 'Completely immune to the effects of poisons and diseases.' },
          { nom: 'Immunity to Psychology', texte: 'Automatically passes any Leadership test.' },
          { nom: 'Causes Fear', texte: 'Causes Fear.' },
          {
            nom: 'Daemonic Aura',
            texte: "Special 5+ armour save, modified by the attacker's Strength, but completely negated by magical weapons and spells; its own attacks count as magical attacks.",
          },
          {
            nom: 'Daemonic Instability',
            texte: 'If taken Out of Action, banished and destroyed on a 1-3 on 1D6 (no roll on the Injury table). If the warband fails a Rout test, each Plaguebearer must immediately pass a Leadership test or be considered destroyed.',
          },
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' },
        ],
      },
      frere: {
        nom: 'Brother',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' }],
      },
      nurgling: {
        nom: 'Nurgling',
        regles_speciales: [
          { nom: 'Cloud of Flies', texte: 'Opponents suffer a -1 penalty to hit in hand-to-hand combat.' },
          { nom: 'Swarms', texte: 'No limit to the number of Nurglings that may be included, even beyond 5 per Henchman group.' },
          { nom: 'Daemon', texte: 'Made of raw Chaos energy; never gains experience.' },
          { nom: 'Immunity to Poison', texte: 'Completely immune to the effects of poisons and diseases.' },
          { nom: 'Immunity to Psychology', texte: 'Automatically passes any Leadership test.' },
          {
            nom: 'Daemonic Aura',
            texte: "Special 5+ armour save, modified by the attacker's Strength, but completely negated by magical weapons and spells; its own attacks count as magical attacks.",
          },
          {
            nom: 'Daemonic Instability',
            texte: 'If taken Out of Action, banished and destroyed on a 1-3 on 1D6 (no roll on the Injury table). If the warband fails a Rout test, each Nurgling must immediately pass a Leadership test or be considered destroyed.',
          },
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5, though Swarms allows more than 5 per group.' },
        ],
      },
      roulotte_de_la_peste: {
        nom: 'Plague Wagon',
        regles_speciales: [
          {
            nom: 'Plague Wagon',
            texte:
              "Increases the warband's maximum number of warriors by +2. Reduces daemonic instability: Plaguebearers and Nurglings may re-roll failed Leadership tests caused by instability and gain a +1 bonus when determining the severity of their injuries if taken Out of Action.",
          },
          {
            nom: 'Driver',
            texte:
              "Included in the price of the wagon; permanently bound to it (can never dismount), and can only be wounded if the wagon is destroyed (in which case he is too). Counts as a daemonic creature and therefore never gains experience. His attacks transmit Nurgle's Rot (see Blessings of Nurgle).",
          },
          {
            nom: 'Immunity to Psychology',
            texte: 'The wagon and its driver are utterly untouched by fear and automatically pass any Leadership test.',
          },
          {
            nom: 'Detailed Profiles',
            texte: 'Wagon: T8, W4. Wheel: T6, W1. Horse: M8, S3, T3, W1, I3. Guard (Driver): WS3, S3, T3, A1, I3.',
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
      kermesse: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        armes_tir: [undefined, undefined, '30gc per pair'],
      },
    },
    magie: {
      nom: 'Rituals of Nurgle',
      type: 'sorcery',
      sorts: [
        {
          nom: 'Daemonic Vigour',
          texte: 'Any Plaguebearer or Nurgling within 8" has its daemonic save improved to 4+ until the start of its next turn.',
        },
        {
          nom: 'Buboes',
          texte: 'Range 8"; an enemy warrior who fails a Toughness test loses 1 Wound, with no armour save allowed.',
        },
        {
          nom: "Nurgle's Miasma",
          texte: 'Range 6", affects all living creatures, friend or foe; failing a Toughness test means the loss of 1 Attack for the rest of the turn.',
        },
        {
          nom: 'Pestilence',
          texte: 'Any enemy model within 12" suffers a Strength 3 hit, with no armour save.',
        },
        {
          nom: 'Warty Skin',
          texte: "The Master gains a 2+ save that replaces his current armour save, until the start of his next Shooting phase.",
        },
        {
          nom: "Nurgle's Rot",
          texte: "Any enemy model in contact with the Master must immediately pass a Toughness test or catch Nurgle's Rot (see Blessings of Nurgle).",
        },
      ],
    },
  },
  averlanders: {
    nom: 'Averlander Mercenaries (1a)',
    profils: {
      capitaine: {
        nom: 'Captain',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any model within 6" of the Captain may use his Leadership for their tests.' },
        ],
      },
      sergent: { nom: 'Sergeant' },
      bergjaeger: {
        nom: 'Bergjaeger',
        regles_speciales: [
          {
            nom: 'Traps',
            texte:
              'A Bergjaeger may set a trap if he spends a turn doing nothing else (unless he has just stood back up after being Knocked Down). Place a marker in contact with his base. When a model, friend or foe, comes within 2" of the trap, it risks triggering it: roll 1D6, on a 3+ the trap inflicts a Strength 4 hit (a Bergjaeger never risks triggering his own traps). If the trap did not wound the model or was not triggered, the victim may finish its move; otherwise it ends up Knocked Down or Stunned 2" from the marker. Whether the trap was triggered or not, the marker is removed from play.',
          },
        ],
      },
      recrue: { nom: 'Recruit' },
      garde_des_montagnes: {
        nom: 'Mountain Guard',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' }],
      },
      tireur: {
        nom: 'Marksman',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' }],
      },
      eclaireur_halfling: {
        nom: 'Halfling Scout',
        regles_speciales: [
          {
            nom: 'Promotion',
            texte:
              "A Halfling Scout promoted to Hero through the \"Lad's Got Talent\" result may not choose Strength skills as one of his two skill tables. Halflings are not renowned for their athletic build!",
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
      eclaireurs: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined],
      },
      tireurs: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined],
        armes_tir: [undefined, '30gc per pair', undefined, undefined, undefined, undefined, undefined],
      },
      gardes_des_montagnes: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        armes_tir: [undefined, '30gc per pair', '50gc per pair', undefined],
      },
    },
  },
  dwarf_treasure_hunters: {
    nom: 'Dwarf Treasure Hunters (1a)',
    regles_speciales: [
      {
        nom: 'Hard to Kill',
        texte:
          'Dwarfs are very tough and resilient. They can therefore only be taken Out of Action on a roll of 6 instead of 5-6 on the Injury table. Treat a roll of 1-2 as Knocked Down, 3-5 as Stunned, and 6 as Out of Action.',
      },
      { nom: 'Hard Head', texte: 'Dwarfs ignore the special rules of maces, hammers, etc. They are not easy to knock silly!' },
      { nom: 'Armour', texte: 'Dwarfs suffer no Movement penalty for wearing armour.' },
      { nom: 'Hatred of Orcs and Goblins', texte: 'All Dwarfs hate Orcs and Goblins.' },
      {
        nom: 'Grudge-Bearers',
        texte: 'Dwarfs hold an old grudge against elves. A Dwarf warband may never include any Elf Hired Sword, whoever they are.',
      },
      {
        nom: 'Miners Without Equal',
        texte: 'In the city of Mordheim, Dwarfs put their skills to use searching for Wyrdstone. Add +1 to the number of shards found when rolling to determine the amount of Wyrdstone at the end of the game.',
      },
    ],
    profils: {
      noble_nain: {
        nom: 'Dwarf Noble',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warband member within 6" of the Dwarf Noble may use his Leadership instead of his own for his tests.' },
        ],
      },
      ingenieur_nain: {
        nom: 'Dwarf Engineer',
        regles_speciales: [
          {
            nom: 'Master Armourer',
            texte:
              'A Dwarf Engineer can increase the range of the warband\'s missile weapons. Missile weapons bought from the Dwarf Equipment list gain +3" range for Pistols and +6" for Crossbows and Handguns. The range increases only apply to battles the Dwarf Engineer takes part in (but they apply even if he has not yet entered the battlefield or has been taken Out of Action). The increase does not apply to Hired Swords\' equipment.',
          },
        ],
      },
      tueur_de_trolls_nain: {
        nom: 'Dwarf Troll Slayer',
        regles_speciales: [
          {
            nom: 'Death Wish',
            texte: 'Troll Slayers seek an honourable death in battle. They are immune to psychology and never take a test when fighting alone.',
          },
          {
            nom: 'Slayer Skills',
            texte: 'Troll Slayers may choose a skill from the Slayer skills table (see special skills, reserved) instead of the normal skill tables when they gain a new skill.',
          },
          { nom: 'No Missile Weapons or Armour', texte: 'Never use missile weapons, nor any form of armour.' },
        ],
      },
      guerrier_nain: {
        nom: 'Dwarf Warrior',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Any number. Bought in groups of 1 to 5.' }],
      },
      tireur_nain: {
        nom: 'Dwarf Marksman',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' }],
      },
      poil_au_menton: {
        nom: 'Chinbeard',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Any number. Bought in groups of 1 to 5.' }],
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
      maitre_des_lames: {
        nom: 'Blademaster',
        texte:
          'When using a weapon with the Parry special rule, this Dwarf may parry a blow by rolling equal to or higher than the best enemy to-hit roll, instead of strictly higher. If he wields two weapons with the Parry special rule, he may parry two attacks instead of one (if both his results are equal to or higher than the two best enemy to-hit rolls). If he wields two Dwarf axes, he may re-roll failed parry rolls.',
      },
      increvable: {
        nom: 'Unstoppable',
        texte: 'When you roll on the Serious Injury table at the end of a game in which this Hero was taken Out of Action, the die may be re-rolled once. The second result must be accepted, even if it is worse than the first.',
      },
      prospecteur: {
        nom: 'Prospector',
        texte: 'During the Exploration phase at the end of the game, the Hero may modify one die roll by +1/-1.',
      },
      tres_coriace: {
        nom: 'Extremely Tough',
        texte: 'When rolling for damage affecting this Hero, a roll of 1-3 is treated as Knocked Down, 4-5 as Stunned, and 6 as Out of Action.',
      },
      crane_epais: {
        nom: 'Thick Skull',
        texte:
          'The Hero has a 3+ save on 1D6 to avoid being Stunned. If the save is successful, the Stunned result is treated as Knocked Down instead. If the Hero also wears a helmet, this save becomes 2+ instead of 3+ (this replaces the usual special rule for helmets).',
      },
      charge_furieuse: {
        nom: 'Furious Charge',
        reserve_a: 'Dwarf Troll Slayer only',
        texte: 'The Slayer may double his number of Attacks in the turn he charges. He then suffers a -1 penalty to hit.',
      },
      tueur_de_monstres: {
        nom: 'Monster Slayer',
        reserve_a: 'Dwarf Troll Slayer only',
        texte: 'The Slayer always wounds his opponent on a 4+, regardless of Toughness, unless his Strength (after all weapon modifiers, etc.) already allows him to wound more easily.',
      },
      berserk: {
        nom: 'Berserk',
        reserve_a: 'Dwarf Troll Slayer only',
        texte: 'The Slayer may add +1 to his to-hit rolls in hand-to-hand combat in the turn he charges.',
      },
    },
    equipement: {
      guerriers_nains: {
        armes_cac: [
          'first free',
          undefined,
          undefined,
          undefined,
          'Rare 8 (Dwarfs only)',
          undefined,
          undefined,
          undefined,
          undefined,
          'Any weapon available to a Dwarf may be bought in Gromril, tripling the cost. Price valid only for a starting warband.',
        ],
        armes_tir: ['30gc per pair'],
        armures: [undefined, undefined, 'Lower price for a starting warband; subsequent purchases use the standard Mordheim price tables.', undefined, undefined],
      },
      tireurs_nains: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined],
        armes_tir: [undefined, undefined, '30gc per pair'],
      },
    },
  },
  middenheimers: {
    nom: 'Middenheim Mercenaries (1a)',
    regles_speciales: [
      {
        nom: 'Strength 4',
        texte: "Middenheim men are famous for their physical strength. Middenheim Champions and Captains start with Strength 4 instead of the average human's Strength 3.",
      },
    ],
    profils: {
      capitaine_mercenaire: {
        nom: 'Mercenary Captain',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warrior within 6" of the Mercenary Captain may use his Leadership for their tests.' },
        ],
      },
      champion: { nom: 'Champion' },
      recrue: { nom: 'Recruit' },
      guerrier: {
        nom: 'Warrior',
        regles_speciales: [{ nom: 'Recruitment', texte: 'As many as you want. Bought in groups of 1 to 5.' }],
      },
      tireur: {
        nom: 'Marksman',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' }],
      },
      bretteur: {
        nom: 'Swordsman',
        regles_speciales: [
          {
            nom: 'Sword Expert',
            texte: 'Swordsmen are so skilled with their weapons that, when they charge, they may re-roll failed to-hit rolls. This only applies when they are equipped with normal swords, not two-handed swords or other weapons.',
          },
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' },
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
      mercenaires: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        armes_tir: [undefined, '30gc per pair', '50gc per pair', undefined],
      },
      tireur: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined],
        armes_tir: [undefined, '30gc per pair', undefined, undefined, undefined, undefined, undefined],
      },
    },
  },
  sisters_of_sigmar: {
    nom: 'Sisters of Sigmar (1a)',
    profils: {
      matriarche_sigmarite: {
        nom: 'Sigmarite Matriarch',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warrior within 6" of the Matriarch may use her Ld for Leadership tests.' },
          { nom: 'Prayers of Sigmar', texte: 'The Matriarch has studied the Prayers of Sigmar (see the Magic section).' },
        ],
      },
      soeur_superieure: { nom: 'Sister Superior' },
      augure: {
        nom: 'Augur',
        regles_speciales: [
          {
            nom: 'Sacred Vision',
            texte:
              'An Augur may re-roll failed characteristic tests (climbing, resisting spells, or others) and to-hit rolls in hand-to-hand combat or shooting; the second result must always be kept. In addition, if the Augur is not Out of Action, she may use her sacred vision to roll two dice during the Exploration phase when the Sisters search for Wyrdstone in the city.',
          },
          { nom: 'No Armour', texte: 'Augurs never wear armour.' },
        ],
      },
      soeur: {
        nom: 'Sister',
        regles_speciales: [{ nom: 'Recruitment', texte: 'As many as you wish. Bought in groups of 1 to 5.' }],
      },
      novice: {
        nom: 'Novice',
        regles_speciales: [{ nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' }],
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
      signe_de_sigmar: {
        nom: 'Sign of Sigmar',
        texte: 'Possessed and Undead opponents lose one Attack against the priestess during the first round of hand-to-hand combat (down to a minimum of 1).',
      },
      protection_de_sigmar: {
        nom: 'Protection of Sigmar',
        texte: 'Any spell cast on the sister is dispelled on a 4+ on 1D6. If the spell is dispelled, it will not affect any other model.',
      },
      farouche_determination: {
        nom: 'Fierce Determination',
        reserve_a: 'Matriarch only',
        texte: 'Allows failed Rout tests to be re-rolled.',
      },
      fureur_du_juste: {
        nom: 'Righteous Fury',
        texte: 'The model is subject to Hatred against Skaven, Possessed, and Undead warbands.',
      },
      foi_inebranlable: {
        nom: 'Unshakeable Faith',
        texte: 'May re-roll Fear tests and does not need to take an All Alone test if fighting several opponents at once.',
      },
    },
    equipement: {
      soeurs_de_sigmar: {
        armes_cac: ['first free', undefined, undefined, undefined, undefined, undefined, undefined],
      },
    },
    magie: {
      nom: 'Prayers of Sigmar',
      type: 'prayer',
      note:
        'The Prayers of Sigmar may be recited by Witch Hunter Warrior Priests and Sisters of Sigmar Matriarchs. They are not considered spells: an armoured warrior may therefore use them, and special protections against spells do not affect them.',
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
  gardiens_des_tombes: {
    nom: 'Tomb Guardians (1b)',
    regles_speciales: [
      {
        nom: 'Home Ground',
        texte:
          'Tomb Guardians live in the Necropolises and have no trouble locating hidden tombs in search of weapons and armour to defend their home. A Tomb Guardians warband always rolls an extra die during the Exploration phase.',
      },
      {
        nom: "Doesn't Drink",
        texte:
          "The Undead need neither food nor water. Any living animal accompanying the Mummies (such as the Tomb Scorpion) follows the normal water rules as usual, unless stated otherwise on its own profile.",
      },
      {
        nom: 'New Skill: Drive Chariot (Academic)',
        texte:
          "Chariots are very difficult to handle. A warrior with access to Academic skills (the Liche Priest or an Acolyte) can learn this skill, essential to pilot the Skeleton Chariot effectively in battle: without it, the driver cannot charge with the chariot.",
      },
    ],
    profils: {
      roi_des_tombes: {
        nom: 'Tomb Lord',
        regles_speciales: [
          { nom: 'Leader', texte: 'The Tomb Lord is the warband Leader and follows all rules that apply to Leaders.' },
          { nom: 'Undead', texte: 'The Tomb Lord is Undead and follows all rules that apply to the Undead.' },
          { nom: 'Causes Fear', texte: 'A terrifying undead monster that causes Fear.' },
          { nom: 'Immune to Psychology', texte: 'Unaffected by psychology and never flees combat.' },
          { nom: 'Not Affected by Pain', texte: 'A Stunned result on the injury chart is treated as Knocked Down.' },
          { nom: "Can't Run", texte: 'A slow undead creature; cannot run but can charge normally.' },
          { nom: 'Immune to Poison', texte: 'Unaffected by poisons.' },
          {
            nom: 'Flammable',
            texte:
              'The Tomb Lord is as dry as tinder and wrapped in bandages soaked in highly flammable resins and preservatives. A hit from a fire-based attack inflicts double the normal number of Wounds.',
          },
        ],
      },
      pretre_liche: {
        nom: 'Liche Priest',
        regles_speciales: [
          {
            nom: 'Wizard',
            texte: 'The Liche Priest is a Wizard and uses Mortuary Cult scrolls (see the magic domain below).',
          },
          { nom: 'Equipment', texte: 'Cannot wear armour, as it interferes with spellcasting.' },
          { nom: 'Undead', texte: 'The Liche Priest is Undead and follows all rules that apply to the Undead.' },
          { nom: 'Causes Fear', texte: 'A terrifying undead monster that causes Fear.' },
          { nom: 'Immune to Psychology', texte: 'Unaffected by psychology and never flees combat.' },
          { nom: 'Not Affected by Pain', texte: 'A Stunned result on the injury chart is treated as Knocked Down.' },
          { nom: "Can't Run", texte: 'A slow undead creature; cannot run but can charge normally.' },
          { nom: 'Immune to Poison', texte: 'Unaffected by poisons.' },
        ],
      },
      acolyte: {
        nom: 'Acolyte',
        regles_speciales: [
          { nom: 'Undead', texte: 'The Acolyte is Undead and follows all rules that apply to the Undead.' },
          { nom: 'Causes Fear', texte: 'A terrifying undead monster that causes Fear.' },
          { nom: 'Immune to Psychology', texte: 'Unaffected by psychology and never flees combat.' },
          { nom: 'Not Affected by Pain', texte: 'A Stunned result on the injury chart is treated as Knocked Down.' },
          { nom: "Can't Run", texte: 'A slow undead creature; cannot run but can charge normally.' },
          { nom: 'Immune to Poison', texte: 'Unaffected by poisons.' },
        ],
      },
      squelette: {
        nom: 'Skeleton Warrior',
        regles_speciales: [
          { nom: 'Undead', texte: 'The Skeleton is Undead and follows all rules that apply to the Undead.' },
          { nom: 'Causes Fear', texte: 'A terrifying undead monster that causes Fear.' },
          { nom: 'Immune to Psychology', texte: 'Unaffected by psychology and never flees combat.' },
          { nom: 'Not Affected by Pain', texte: 'A Stunned result on the injury chart is treated as Knocked Down.' },
          { nom: "Can't Run", texte: 'A slow undead creature; cannot run but can charge normally.' },
          { nom: 'Immune to Poison', texte: 'Unaffected by poisons.' },
          { nom: 'No Brain', texte: 'Skeletons are not alive; they therefore never gain experience.' },
        ],
      },
      gardien_des_tombes: {
        nom: 'Tomb Guard',
        regles_speciales: [
          { nom: 'Undead', texte: 'The Tomb Guard is Undead and follows all rules that apply to the Undead.' },
          { nom: 'Causes Fear', texte: 'A terrifying undead monster that causes Fear.' },
          { nom: 'Immune to Psychology', texte: 'Unaffected by psychology and never flees combat.' },
          { nom: 'Not Affected by Pain', texte: 'A Stunned result on the injury chart is treated as Knocked Down.' },
          { nom: "Can't Run", texte: 'A slow undead creature; cannot run but can charge normally.' },
          { nom: 'Immune to Poison', texte: 'Unaffected by poisons.' },
          { nom: 'No Brain', texte: 'Skeletons are not alive; they therefore never gain experience.' },
        ],
      },
      scorpion_des_tombeaux: {
        nom: 'Tomb Scorpion',
        regles_speciales: [
          {
            nom: 'Alive',
            texte:
              'Scorpions are living creatures and are therefore affected by Psychology as normal. However, they are small desert creatures and need no water.',
          },
          { nom: 'Animal', texte: 'Scorpions are animals and therefore never gain experience.' },
          {
            nom: 'Scorpion Sting',
            texte:
              'Scorpions attack using the venomous stinger on their tail. The effects are similar to those of black lotus (if you roll a 6 to hit, the target is automatically Wounded).',
          },
          { nom: 'Equipment', texte: 'Scorpions carry no weapons or armour.' },
        ],
      },
    },
    magie: {
      nom: 'Mortuary Cult Scroll',
      note:
        "The Mortuary Cult's Liche Priests do not use ordinary Necromancy: their magic is preserved in ancient scrolls dating back to Nagash's time as High Priest of the early Nehekharan civilisation. In game terms, the scrolls work just like normal spells — the Liche Priest must pass a test to read the incantation correctly, no easy task in the middle of a fight.",
      sorts: [
        {
          nom: "Menkare's Scroll of Urgency",
          texte:
            'The Liche Priest reaches out to urge an Undead warrior forward. A single Skeleton within 6" may immediately move again up to its maximum Movement distance (4"). If this takes the model into base contact with an enemy model, it counts as charging.',
        },
        {
          nom: "Horrebe's Curse of the Mummy",
          texte:
            'The Liche Priest amplifies the curse that all mummies bear and focuses it on a single enemy model. The target must be in base contact with a Mummy and within 18" of the Liche Priest. On a success, the enemy model suffers a -1 penalty to hit, to wound, and to its armour save, until the start of the next Tomb Guardian Shooting phase.',
        },
        {
          nom: "Tawosret's Scroll of Tomb Dust",
          texte:
            'The Liche Priest commands the sand around him to assault a single warrior within 12". The warrior is automatically Knocked Down as he chokes on the sand. This spell only affects a living model.',
        },
        {
          nom: "Neferre's Scroll of Quaking Horror",
          texte:
            'The Liche Priest selects a warrior within 12" who is beset by terrible, haunting visions of his own death. The model must pass a Leadership test or flee 2D6" directly away from the Liche Priest, continuing to flee each Movement phase until he makes a successful Rally test in the Recovery phase. Has no effect on Undead models or models immune to psychology.',
        },
        {
          nom: "Merneptah's Scroll of the Scarab Song",
          texte:
            'With a short, rasping chant, the Liche Priest summons a swarm of scarabs that burrow up through the ground and swarm over an enemy warrior. A single model within 8" of the Liche Priest suffers 2D6 Strength 1 hits. In addition, that model may not be shot at for the rest of the Tomb Guardian Shooting phase, nor may he fight or be fought in hand-to-hand combat; if already in combat, move him 1" away as he staggers in agony. Unless actually injured, he counts as having just stood up next turn.',
        },
        {
          nom: "Djedre's Summoning of the Vengeful Dead",
          texte:
            'The Liche Priest may re-animate a Skeleton that went out of action during the last turn. Place the model anywhere within 6" of the Liche Priest, but not directly into hand-to-hand combat with an enemy model.',
        },
      ],
    },
  },
  pilleurs_de_tombes_arabes: {
    nom: 'Arabian Tomb Raiders (1b)',
    regles_speciales: [
      {
        nom: 'Hatred of the Undead',
        texte:
          "The people of Araby have suffered greatly from the attacks (and claws) of the armies of the Tomb King of the Lands of the Dead. For this reason, Arabian Heroes hate all Undead.",
        exception: 'Only applies to Heroes (Sheikh, Champion and Mystic); Henchmen are not subject to it.',
      },
    ],
    profils: {
      cheikh: {
        nom: 'Sheikh',
        regles_speciales: [
          {
            nom: 'Recruitment',
            texte: 'Every Arabian Tomb Raiders warband must include a Sheikh: no more, no less! He is the undisputed leader of the warband.',
          },
        ],
      },
      champion: { nom: 'Champion' },
      mystique: {
        nom: 'Mystic',
        regles_speciales: [
          {
            nom: 'Wizard',
            texte: 'The Mystic is a Wizard. He casts spells from the Arabian Elemental Magic list. He starts with a single spell drawn randomly from this list.',
          },
        ],
      },
      bedouin: {
        nom: 'Bedouin',
        regles_speciales: [
          {
            nom: 'Desert Trader',
            texte: 'Add +1 to the Equipment/Trading search roll. Note that this bonus remains +1 even if the warband has two Bedouins (non-cumulative).',
          },
        ],
      },
      guerrier_nomade: { nom: 'Nomad Warrior' },
      esclave: {
        nom: 'Slave',
        regles_speciales: [
          {
            nom: 'A Life of Slavery',
            texte:
              'A Slave can gain experience, but if he rolls "Lad\'s Got Talent" on the Advance table, the leader executes him at once and he is removed from the warband roster. The rest of the group may then re-roll its advance.',
          },
        ],
      },
    },
    competences_speciales: {
      ver_des_sables: {
        nom: 'Sand Worm',
        texte: 'The warrior can bury himself in the sand and become nearly undetectable. The model can hide in open ground. Cannot be used indoors.',
      },
      frappe_et_fuite: {
        nom: 'Hit and Run',
        texte: 'The warrior may run and shoot, but suffers a -2 penalty to hit instead of the usual -1 for having moved.',
      },
      resistant_aux_intemperies: {
        nom: 'Weather-Hardened',
        texte: "The warrior has grown so used to the climate that it no longer affects him at all. Weather conditions such as heat and the like have no effect on this model.",
      },
    },
    magie: {
      nom: 'Arabian Elemental Magic',
      type: 'spells',
      note: 'Djinn magic is a rare art, almost lost among men. It is the preserve of the deep desert Djinn and of the unlucky few who have been captured.',
      sorts: [
        {
          nom: 'Ride the Wind',
          texte:
            "This spell is cast at the start of the caster's Movement phase. The caster may move up to 12+D6\" anywhere on the table, ignoring any terrain in between; this movement counts as his move for the turn. This spell cannot be used to bring the caster into base contact with an enemy, but he may then shoot normally (with the usual -1 for having moved).",
        },
        {
          nom: 'Skin of Stone',
          texte:
            "This spell can be cast on any friendly warrior within 6\". The target gains +2 to his armour save but suffers a -1 penalty to Initiative. The spell can be maintained each turn as long as the affected warrior stays within 6\" of the caster and the caster passes a Difficulty test. If the caster is more than 6\" from the affected warrior during the Recovery phase, the spell cannot be maintained and dissipates at once. Only one warrior can be affected by Skin of Stone at a time, though the caster remains free to cast other spells while maintaining it.",
        },
        {
          nom: 'Burning Hand',
          texte:
            'This spell is cast at the start of the Combat phase. The caster may sacrifice all of his normal attacks to make a single close combat attack at Strength 5 causing 2 Wounds. If the enemy warrior is successfully hit, he catches fire on a roll of 4+. This spell lasts only one round.',
        },
        {
          nom: 'Quicksand',
          texte:
            "This spell targets any warrior within 6\". Water floods a 3\" area around the targeted warrior. The effect lasts until the start of the caster's next Recovery phase. All warriors caught in the quicksand must pass a Strength test or be unable to move. Warriors engaged in close combat cannot attack but may defend themselves.",
        },
        {
          nom: 'Magic Storm',
          texte:
            "The caster may target any warrior within 12\". If the spell is cast successfully, the target is struck by a bolt of pure energy and suffers a Strength 5 hit. Armour saves apply as normal.",
        },
        {
          nom: 'Blessing of the Elements',
          texte:
            'During the post-battle sequence, the player may re-roll any one die of his choice or modify a die by +1/-1. If the caster was taken Out of Action during the game, this spell cannot be used.',
        },
      ],
    },
  },
  ostermarkers: {
    nom: 'Ostermark Mercenaries (1b)',
    regles_speciales: [
      {
        nom: 'Against All Odds',
        texte:
          'Ostermarkers (Heroes and Henchmen) may re-roll a failed Leadership test if they are All Alone or in a Rout test. The warband or fighter must, however, accept the second roll, whatever the result.',
      },
      {
        nom: 'Free War Dog',
        texte:
          "These mercenaries often use dogs to guard their farms and raise the alarm in case of intrusion. Any Captain of an Ostermarkers warband may start with a war dog as part of his starting equipment, in tribute to the beast that once protected his farm and lands from bandits and other vile creatures. This war dog is free at warband creation.",
      },
      {
        nom: 'Skill Choice',
        texte:
          'When the warband is created, you must choose one of the following three skill sets for your Ostermark Mercenaries. Once chosen, it can never be changed.\n\nOption 1: Mercenary Captain — Combat, Shooting, Academic, Strength, Speed; Champion — Combat, Shooting, Strength; Recruit — Combat, Shooting, Speed.\nOption 2: Mercenary Captain — Combat, Shooting, Academic, Strength, Speed; Champion — Combat, Strength, Speed; Recruit — Combat, Strength, Speed.\nOption 3: Mercenary Captain — Combat, Shooting, Academic, Strength, Speed; Champion — Combat, Shooting; Recruit — Combat, Shooting, Speed.',
      },
    ],
    profils: {
      capitaine_mercenaire: {
        nom: 'Mercenary Captain',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warband member within 6" of the Mercenary Captain may use his Leadership for their tests.' },
        ],
      },
      champion: { nom: 'Champion' },
      recrue: { nom: 'Recruit' },
      guerrier: { nom: 'Warrior' },
      tireur: { nom: 'Marksman' },
      bretteur: {
        nom: 'Swashbuckler',
        regles_speciales: [
          {
            nom: 'Sword Expert',
            texte:
              'Swashbucklers are so skilled with their weapons that, when they charge, they may re-roll failed to-hit rolls. Note that this applies when they carry normal swords, not two-handed swords or other weapons.',
          },
        ],
      },
      chien_de_guerre: {
        nom: 'War Dog',
        regles_speciales: [
          {
            nom: "Captain's First Dog Free",
            texte: "The Mercenary Captain may start with a war dog as part of his starting equipment, free of charge, at warband creation (see warband special rules).",
          },
          {
            nom: 'War Beast',
            texte: 'Fights exactly like a warband member, though it is counted as part of the equipment of the Hero who bought it. A model is needed to represent it on the battlefield.',
          },
          { nom: 'Never Gains Experience', texte: 'A war dog remains at the same level throughout its career.' },
          { nom: 'Recovery', texte: 'If taken Out of Action: 1-2 Dead, 3-6 Alive (as a Henchman).' },
          { nom: 'Versatile Profile', texte: 'Usable to represent more exotic animals (trained bear, Chaos familiar, Southlands fighting monkey...).' },
        ],
      },
    },
  },
  mootlanders: {
    nom: 'Mootlanders (1b)',
    regles_speciales: [
      {
        nom: 'Puny',
        texte:
          'Halflings are very weak and puny; even the lightest blows are enough to knock them out. When rolling an Injury for a Halfling, a result of 2 is treated as "Stunned".',
      },
    ],
    profils: {
      moot_elder: {
        nom: 'Moot Elder',
        regles_speciales: [
          { nom: 'Leader', texte: "Any warrior within 6\" of the Moot Elder may use his Leadership for their Leadership tests." },
          {
            nom: 'Family Pistol',
            texte: 'The Moot Elder may be equipped with a pistol for 15gc (see special equipment), usually an ancient heirloom weapon passed down through his family.',
          },
        ],
      },
      master_chef: {
        nom: 'Master Chef',
        regles_speciales: [
          {
            nom: 'Inspired Cooking',
            texte: "Any Halfling within 6\" of a Master Chef may re-roll one failed to-hit roll in close combat (once per turn).",
          },
          {
            nom: 'Equipment',
            texte:
              "The Master Chef may only be equipped from the Master Chef's utensil list (close combat weapons) and the Halfling armour list — not the general close combat or missile weapon lists.",
          },
        ],
      },
      halfling_thief: {
        nom: 'Halfling Thief',
        regles_speciales: [
          {
            nom: 'Sneaky',
            texte: "Halfling Thieves can hide in the smallest shadow or nook. Shots aimed at a Halfling Thief always suffer a -1 penalty to hit, in addition to any other modifier.",
          },
        ],
      },
      halfling_warrior: {
        nom: 'Halfling Warrior',
        regles_speciales: [{ nom: 'Recruitment', texte: 'As many as you like. Bought in groups of 1 to 5.' }],
      },
      halfling_scout: {
        nom: 'Halfling Scout',
        regles_speciales: [
          {
            nom: 'Keen Eyes',
            texte: 'Halfling Scouts spot hidden enemies up to a distance (in inches) equal to twice their Initiative.',
          },
          { nom: 'Recruitment', texte: 'Bought in groups of 1 to 5.' },
        ],
      },
    },
  },
  fils_dhashut: {
    nom: 'Sons of Hashut (1c)',
    regles_speciales: [
      {
        nom: 'Hard Head',
        texte: "Chaos Dwarfs ignore the special rules for maces, hammers, etc. They are not easy to knock silly!",
        exception: 'Does not apply to Hobgoblins or the Bull Centaur.',
      },
      {
        nom: 'Armour',
        texte: 'Chaos Dwarfs and the Bull Centaur never suffer a Movement penalty for wearing armour.',
        exception: 'Does not apply to Hobgoblins.',
      },
      {
        nom: 'Hard to Kill',
        texte:
          'Chaos Dwarfs and the Bull Centaur are tough, resilient individuals who can only be taken Out of Action on a roll of 6 instead of 5-6 on the Injury table. Treat a roll of 1-2 as Knocked Down, 3-5 as Stunned, and 6 as Out of Action.',
        exception: 'Does not apply to Hobgoblins.',
      },
      {
        nom: 'Slavers',
        texte:
          "One of the Chaos Dwarfs' main goals in Mordheim is to capture more slaves for their sacrifices and drudgery. As a result, they never release a captured slave. Choose: sacrifice him or put him to work. If sacrificed, the Sorcerer Apprentice gains +1 Experience per sacrificed slave. If put to work, he helps the warband in its quest for wyrdstone: at the end of the game, gain +1 extra wyrdstone per working captive, then roll 1D6. On a result of 2-6, the captive dies (overwork, disease, prolonged exposure to wyrdstone, or similar) and the warband may keep his equipment. On a result of 1, the captive escapes, returns to his original warband with his equipment intact, and gains a bonus of 1D3 Experience (if he is a Henchman, simply add 1 to his total).",
      },
      {
        nom: 'Rarity',
        texte:
          "Chaos Dwarfs are rather rare in the settlements of the Old World. For this reason, when making rolls to acquire new recruits, they must spend 1.5 times (rounded up) the amount they would normally spend. This does not apply to Hobgoblins, a much more common race than the Chaos Dwarfs. For example, a Chaos Dwarf warband with 4 Experience points would need at least 6 Experience points to recruit one warrior, 12 to recruit two, and so on.",
      },
      {
        nom: 'Servitude',
        texte:
          'A Sons of Hashut warband must start with at least 4 Hobgoblins; if their number drops below 4, the warband cannot recruit any other member until the number of Hobgoblins is back up to four or more.',
      },
      {
        nom: 'Hired Swords',
        texte:
          'A Sons of Hashut warband may recruit the following Hired Swords: Ogre Bodyguard, Gladiators, Mages, Imperial Assassins, and Hobgoblin Scouts. It may also hire any Hired Sword available to all warbands, as well as those allowed for Orc and Chaos warbands. It may never recruit any Elf Hired Sword, whoever they are!',
      },
    ],
    profils: {
      apprenti_sorcier: {
        nom: 'Sorcerer Apprentice',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any fighter within 6" of the Sorcerer Apprentice may use his Leadership for their tests.' },
          {
            nom: 'Rituals of Chaos',
            texte: 'The Sorcerer Apprentice is a wizard and learns a random spell from the Chaos Dwarf spell list (see magic).',
          },
          { nom: 'Concentration', texte: 'If the Sorcerer Apprentice is wearing armour, he cannot cast any spells.' },
        ],
      },
      centaure_taureau: {
        nom: 'Bull Centaur',
        regles_speciales: [
          {
            nom: 'Large Target',
            texte:
              'Bull Centaurs are large creatures and therefore prime targets for archers. Anyone shooting at the Bull Centaur gains a +1 bonus to hit and may target him even if he is not the closest target. As a Large Target, the Bull Centaur adds an extra +20 (instead of +5) to the warband rating.',
          },
          {
            nom: 'Shooting Capped',
            texte:
              'The Bull Centaur has a Shooting cap of 3: he can therefore never learn a Shooting skill, though he remains free to carry a missile weapon from the Chaos Dwarf equipment list.',
          },
        ],
      },
      champion: { nom: 'Chaos Dwarf Champion', regles_speciales: [{ nom: 'Trusted Sergeant', texte: "Champions are the Sorcerer Apprentice's favourite warriors: excellent fighters and trustworthy sergeants." }] },
      guerrier_nain_du_chaos: { nom: 'Chaos Dwarf' },
      tromblonnier_nain_du_chaos: { nom: 'Chaos Dwarf Blunderbuss' },
      hobgobelin: {
        nom: 'Hobgoblin',
        regles_speciales: [
          {
            nom: 'Cowardly',
            texte:
              'Hobgoblins are naturally cowardly creatures, forced to fight by their Chaos Dwarf masters. They take blows poorly and look for any chance to flee. On an Injury roll, a result of 1-3 means the Hobgoblin deserts the warband.',
          },
          {
            nom: 'Little Regard',
            texte:
              'Hobgoblins only count as half a model for a Rout test. For example, in a warband of 12 models, if 2 Hobgoblins and 1 Chaos Dwarf are Out of Action, the total to consider is 2 (1/2 + 1/2 + 1 = 2).',
          },
          { nom: 'No Future', texte: 'Hobgoblins can never become Heroes: re-roll any "Lad\'s Got Talent" result concerning them.' },
        ],
      },
    },
    competences_speciales: {
      tenace: {
        nom: 'Tenacious',
        texte: 'On the Injury chart, a roll of 1-3 is treated as Knocked Down, 4-5 as Stunned, and 6 as Out of Action.',
      },
      increvable: {
        nom: 'Unstoppable',
        texte: 'Allows a single re-roll on the Serious Injury chart after the game. The result of the second roll must be accepted, even if it is worse.',
      },
      haine_sans_limites: {
        nom: 'Boundless Hatred',
        texte: 'The fighter is subject to the Hatred special rule against absolutely every opponent he faces, regardless of race or warband.',
      },
      crane_epais: {
        nom: 'Thick Skull',
        texte: 'The fighter gains a special 3+ save to avoid being Stunned. If the save is successful, he is treated as Knocked Down instead.',
      },
    },
    magie: {
      nom: 'Chaos Dwarf Magic',
      sorts: [
        {
          nom: "Hashut's Spectre",
          texte: "Designates the closest enemy model to the wizard, within 10\". This model is automatically Stunned.",
        },
        {
          nom: 'Statue of Stone',
          texte:
            "Choose an enemy model within 12\" and in the wizard's line of sight. For the rest of the turn and the following turn, this model can do nothing. If attacked in close combat, it automatically suffers a hit. If targeted by shooting, the shooter gains a +1 bonus to hit.",
        },
        {
          nom: 'Fireball',
          texte: "Range 16\", requires line of sight. The target automatically suffers a Strength 4 hit.",
        },
        {
          nom: 'Vanish',
          texte:
            'The wizard may immediately move up to 6" in any direction and may enter or leave combat without penalty. If this brings him into contact with an enemy, this move counts as a charge.',
        },
        {
          nom: 'Eruption',
          texte:
            "All models within 4\" of the wizard (friend or foe) automatically suffer a Strength 4 hit. After resolving this hit, the wizard cannot cast any spell until the following turn and suffers a permanent -1 penalty to Toughness for the rest of the game.",
        },
        {
          nom: "Hashut's Eye",
          texte:
            'Choose a friendly model within 12" and roll 1D6 (Hobgoblins always subtract 1 from the result): 1 — Hashut is wary of you, the model is immediately taken Out of Action but does not roll on the Serious Injury chart during the post-battle sequence; 2-5 — Hashut trusts you, the model adds +1 to one Characteristic for the rest of the game; 6 — Hashut favours you, the model adds +1 to all Characteristics for the rest of the game.',
          note: 'Can only be used successfully once per battle.',
        },
      ],
    },
  },
  caravanes_marchandes: {
    nom: 'Merchant Caravans (1c)',
    regles_speciales: [
      {
        nom: 'Merchant',
        texte:
          "The Merchant is the warband's leader (any warrior within 6\" of him may use his Leadership when taking Ld tests). If he leaves the caravan (e.g. dies permanently through Serious Injuries), a new leader is determined as normal. The new leader gets the Merchant special rule, allowing him to choose new skills from the Merchant's special skills list, and is considered a Merchant for all purposes just as the previous one was. If no model in the warband is allowed to become the leader, an Apprentice must be bought as soon as possible to become the leader.",
      },
      {
        nom: "Merchant's Special Skills",
        texte: "The Merchant may choose his skills from the Merchant's special skills list (see special skills) instead of the standard Special skill tables.",
      },
      {
        nom: 'Rarity',
        texte:
          "Any rare item reduced to Rare 2 or below by the Trade Wagon's Reputation rule, an equivalent skill, etc., can be bought as a Common item.",
      },
      {
        nom: 'Mandatory Trade Wagon',
        texte: 'A Merchant Caravan warband must always include a Trade Wagon in its starting warband (see Special Equipment). See the Trade Wagon rules (Storage, Reputation, Abandoned) on the item card itself.',
      },
      {
        nom: 'Hired Swords',
        texte: 'A Merchant Caravan may hire every Hired Sword normally available to Mercenary warbands.',
      },
    ],
    profils: {
      marchand: {
        nom: 'Merchant',
        regles_speciales: [
          { nom: 'Leader', texte: "The Merchant is always the warband's leader — see the Merchant special rule." },
          {
            nom: 'Trade',
            texte:
              'Instead of searching for a rare item, the Merchant may sell a rare item stored in the Trade Wagon during the preceding battle. This must be done before Heroes of either warband search for rare items. Roll 1D6 to determine how many gold coins the Merchant gets: 1-2 half the item\'s basic price; 3-4 the item\'s full basic price; 5-6 full plus half the item\'s basic price. The Merchant may choose to sell the item at that price or try again after the next battle. This can be combined with the Wholesale skill to sell up to D3+1 items per game.',
          },
          {
            nom: 'Open for Business',
            texte:
              "All players may send any of their Heroes to see the Merchant instead of having them search for rare items. A Hero doing so may buy one item from the warband's stored equipment if the players agree on a price (exchanges for items and Treasures are possible). Instead of buying an item, a Hero may also visit the Merchant to sell him one (rare, common, magical, or a Treasure marker). If the players cannot agree on a price, no deal is closed and the visit is wasted.",
          },
        ],
        competences_speciales: {
          corruption: {
            nom: 'Corruption',
            texte:
              "Whenever the warband has to take a Rout test, the Merchant may talk his hirelings into staying a little longer and facing the danger. He may immediately pay 5 gc per non-Hero warband member (including Hired Swords!) still in the game. If he does, one member already taken out of action does not count for Rout tests. If a Rout test is still required after that, test as normal. This skill may be used as many times as required so long as the coffers aren't empty!",
          },
          fin_negociateur: {
            nom: 'Sharp Negotiator',
            texte: 'When trying to sell an item through the Trade special rule, the Merchant gets a +1 bonus on the roll to see what the item fetches.',
          },
          reseau_de_contacts: {
            nom: 'Network of Contacts',
            texte:
              'The Merchant knows many retailers and ways of getting hold of rare items. Instead of searching for rare items as normal, he may visit the local black market and its fencers. If he does, he may search for an item from the following table, applying the normal rules: Dispel Scroll (50+4D6 gc, Rare 12); Lesser Artefact (200+D6x15 gc, Rare 16, roll on the Lesser Artefacts table); Magical Artefact (350+D6x25 gc, Rare 18, roll on the Mordheim rulebook\'s Magical Artefact table); Magical Scroll (100 gc, Rare 14, roll on the Lesser Artefacts table). The Merchant may buy items from this table, but can never sell them back — he will have to hope another player is interested.',
          },
          revenus_douteux: {
            nom: 'Dubious Income',
            texte:
              "The Merchant has set up an underground business that proves quite profitable. After every battle in which he was not taken out of action, he may choose to use this skill before the trading phase (i.e. before any gold is spent). If he does, he must pass a Leadership test. On a success, the warband receives one gold coin per Experience point the Merchant has. On a failure, the warband loses up to the same amount of gold coins.",
          },
          vente_en_gros: {
            nom: 'Wholesale',
            texte: 'The Merchant is known for buying items in bulk, making him especially welcome at other merchants. He may search for D3+1 rare items after each battle instead of just one, provided he was not taken out of action, of course!',
          },
        },
      },
      apprenti: {
        nom: 'Apprentice',
        regles_speciales: [
          {
            nom: 'Emergency Leader',
            texte: 'If no model in the warband is allowed to become the leader when the Merchant dies, an Apprentice must be recruited as soon as possible to fill that role (see Merchant special rule).',
          },
        ],
      },
      chevalier_avant_garde: {
        nom: 'Knight Vanguard',
        regles_speciales: [
          {
            nom: 'Lightning Reflexes',
            texte:
              "If the Knight Vanguard is charged, he 'strikes first' against that turn's attackers. As the charger(s) also 'strike first' (from charging), the order of attacks between charger(s) and Knight Vanguard is determined by comparing Initiative values.",
          },
          { nom: 'Warhorse Rider', texte: 'The Knight Vanguard is trained to ride Warhorses.' },
          { nom: 'Hireling', texte: 'The Knight Vanguard is a mercenary paid by the Merchant; he can never become the warband leader.' },
        ],
      },
      magicien: {
        nom: 'Magician',
        regles_speciales: [
          { nom: 'Wizard', texte: 'The Magician is a Wizard and uses Lesser Magic.' },
          { nom: 'Hireling', texte: 'The Magician is a mercenary paid by the Merchant; he can never become the warband leader.' },
        ],
      },
      epee_a_louer: { nom: 'Sell-sword', regles_speciales: [] },
      tireur_elite: { nom: 'Tilean Marksman', regles_speciales: [] },
      reitre_cathayan: {
        nom: 'Blackguard',
        regles_speciales: [
          {
            nom: 'Strongman',
            texte: 'Blackguards are capable of great feats of strength. They may use a double-handed weapon without the usual penalty of always striking last. Work out attack order as with any other weapon.',
          },
          {
            nom: 'Unreliable Hirelings',
            texte:
              "Blackguards are only hired by the Merchant to protect his cargo. They are not much trusted or granted any responsibility. They may never become Heroes: re-roll all results of 'The Lad's Got Talent' for them.",
          },
        ],
      },
    },
  },
  moines_guerriers_de_cathay: {
    nom: 'Battle Monks of Cathay (1c)',
    regles_speciales: [
      {
        nom: 'Strictures',
        texte: "A strict regime of meditation is followed by the monks, who hold that the skin of one's body is armour in itself. Dragon Monks and Warrior Monks never wear any kind of armour.",
      },
      {
        nom: 'Distaste for Poison',
        texte: 'The use of poisons and other drugs is the province of dishonourable warriors. Dragon Monks and Warrior Monks refuse to use any kind of poison or venom.',
      },
      {
        nom: 'Outsiders',
        texte: "Foreigners are generally considered unwelcome by Cathay's border guards. The Battle Monks warband may never hire any Hired Sword or Dramatis Personae, unless specifically stated otherwise on the Hired Sword/Dramatis Personae's own profile.",
      },
      {
        nom: "Battle Monks' Special Skills",
        texte: 'Battle Monks of Cathay may choose to use the special skill list below (see the warband\'s special skills) instead of the standard skill lists, for any Hero with access to the Special category. Note that the Emissary may only choose the Warmonger skill from this alternate list.',
      },
    ],
    profils: {
      emissaire: {
        nom: 'Emissary',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warrior within 6" of the Emissary may use his Leadership for their tests.' },
          { nom: 'Rider', texte: 'The Emissary is trained to ride horses.' },
          {
            nom: 'Decree',
            texte: 'When the Emissary dies, a new one must be hired as soon as possible. Until then, no other warrior or equipment may be bought. The new Emissary then takes command of the warband.',
          },
          {
            nom: 'Special Skills',
            texte: 'May choose the Battle Monks special skill list instead of the standard list, but only the Warmonger skill in that case (see warband special rule).',
          },
        ],
      },
      officier: { nom: 'Officer', regles_speciales: [] },
      moine_dragon: {
        nom: 'Dragon Monk',
        regles_speciales: [
          { nom: 'Unarmed Combat', texte: 'The Dragon Monk suffers no penalty for fighting unarmed and gains +1 Attack when doing so.' },
          {
            nom: 'Art of Silent Death',
            texte: 'In hand-to-hand combat, when fighting unarmed, the Dragon Monk causes a critical hit on a to-wound roll of 5-6 instead of 6 only. If armed with a quarter staff, only his unarmed attacks benefit from this bonus.',
          },
        ],
      },
      soldat: { nom: 'Soldier', regles_speciales: [] },
      moine_guerrier: {
        nom: 'Warrior Monk',
        regles_speciales: [
          { nom: 'Unarmed Combat', texte: 'The Warrior Monk suffers no penalty for fighting unarmed and gains +1 Attack when doing so.' },
        ],
      },
      paysan_en_furie: {
        nom: 'Raging Peasant',
        regles_speciales: [
          { nom: 'Equipment', texte: 'Equipped with a pitchfork, a torch, or some other simple tool. Fights unarmed with no penalty, but cannot buy any weapon or armour.' },
          { nom: 'Simple Folk', texte: 'Peasants never gain Experience.' },
          { nom: 'Mob', texte: 'A Peasant gains +1 Ld for each other allied Peasant within 3". Due to their rage, they do not benefit from the Leader rule.' },
          { nom: 'Ignored', texte: 'Peasants taken out of action do not count towards the number of out-of-action models for Rout tests.' },
          { nom: 'Downtrodden', texte: 'When a Peasant is Wounded, do not roll on the Serious Injury table: he is immediately taken out of action.' },
        ],
      },
    },
    competences_speciales: {
      energie_focalisee: {
        nom: 'Focused Energy',
        texte: 'If fighting unarmed, the Hero may choose to reduce his Attacks by -1 to gain +1 Strength in hand-to-hand combat. The monk may sacrifice any number of Attacks this way.',
      },
      vitesse_foudroyante: {
        nom: 'Lightning Speed',
        texte: 'The monk may triple his Movement while running or charging, and may run even with enemy models within 8".',
      },
      saut_de_la_foi: {
        nom: 'Leap of Faith',
        texte:
          'The Hero cannot be intercepted while charging. He may escape from hand-to-hand combat (as described on p.161 of the Mordheim rulebook) by leaping out of combat without needing a Leadership test, and may declare a leaping charge in the same turn.',
      },
      bouclier_humain: {
        nom: 'Human Shield',
        texte:
          'If two or more enemy models are engaged in hand-to-hand combat with the monk, he may choose to use one of them as a shield instead of making his normal attacks. To do so, he must pass an Initiative test after the first model has attacked but before the second attacks. On a success, the monk grabs the first model — the second model directs its full attacks against it. After the combat phase the grabbed model breaks free and the battle continues as usual. On a failure, the monk and the second model make their attacks normally.',
      },
      guerre_acharnee: {
        nom: 'Warmonger',
        texte: 'The Emissary may make a Leadership test before the battle. On a success, D3+1 Raging Peasants join the warband for the next game (this may exceed the maximum warband size). Each Raging Peasant recruited this way is subject to Hatred for the duration of the battle.',
      },
    },
  },
  cour_des_plaisirs_profanes: {
    nom: 'Court of the Profane Pleasures (1c)',
    regles_speciales: [
      {
        nom: 'Corruption of the Mind and Flesh',
        texte:
          "Whenever a model dies — an enemy Hero or Henchman, or even one of the warband's own — the warband may choose to perform an obscene ritual grafting a part of the fallen warrior's body (arm, leg, head, strips of muscle...) onto one of its Slaaneshi Beastmen, Cultists, or Chaos Hounds. Choose one characteristic of the fallen warrior and replace the corresponding characteristic of the receiving creature with that value. Players are encouraged to convert the receiving model to represent the creature corrupted by its new body parts. This ritual costs 1 wyrdstone, and prevents 1 Hero from searching for rare items at the market while it is performed.",
      },
      {
        nom: 'Mutations',
        texte:
          'Any Hero may buy, only at the time of his recruitment, one of the following mutations (see the Cult of the Possessed Mutation rules): Extra Arm, Tentacle, or Great Claw — see Special Equipment. First mutation at normal price, any subsequent mutation on the same model costs double.',
      },
      {
        nom: 'Composition',
        texte: 'The warband must include at least one Hero acting as Leader; freely choose which of your Heroes benefits from the Leader rules. Each Hero type may only be hired once (0-1 each). The maximum number of warriors is 15, though some items (such as the Halfling Cookbook) may increase it.',
      },
    ],
    profils: {
      maitre_fouetteur: {
        nom: 'Whipmaster',
        regles_speciales: [
          {
            nom: 'Agony and Ecstasy',
            texte:
              "The Whipmaster, if armed with a Hedonist Whip, may decide to use one of his attacks to scourge a friendly model within 3\". This attack automatically hits and gets +1 on its roll to wound; resolve injuries normally. As a reward for such a pious act of devotion, Slaanesh grants the Whipmaster a surge of ecstasy that makes him nearly invulnerable: his Toughness is doubled. At the start of each new Slaaneshi turn, he must pass a Leadership test; on a failure, the effect ends immediately (it can be reactivated later).",
          },
          {
            nom: 'Pain and Pleasure',
            texte: 'Whenever the Whipmaster suffers an unsaved wound, he is subject to Frenzy until the end of his next turn — this Frenzy is not negated by being Knocked Down or Stunned.',
          },
        ],
      },
      danseuse: {
        nom: 'Slaaneshi Danseuse',
        regles_speciales: [
          {
            nom: 'Strange Allure',
            texte: 'An enemy wishing to attack the Danseuse in hand-to-hand combat or at range must pass a Leadership test before making his attacks. On a failure, he must re-roll any successful hit against her.',
          },
          { nom: 'Equipment', texte: 'The Danseuse may never wear armour.' },
        ],
      },
      marchand_de_chair: {
        nom: 'Flesh Merchant',
        regles_speciales: [
          {
            nom: 'Pound of Flesh',
            texte:
              'Before the battle, you may assign one of the Wretches to the Flesh Merchant, who carries it as a "meat shield" as part of his equipment. Whenever the Flesh Merchant should suffer a wound, you may choose to let the Wretch take the hit instead: it is then immediately taken out of action and removed from the game. The carried Wretch may still make its normal attacks in hand-to-hand combat while alive; it has no base of its own and cannot be targeted by enemy attacks. If the Flesh Merchant dies, the Wretch is lost with him.',
          },
          {
            nom: 'Cruel Fate',
            texte: 'Any captives the warband gains through combat results or exploration can be turned into Wretches at no cost, through lobotomy, torture and other acts of depravity.',
          },
        ],
      },
      pretre_de_l_obscene: {
        nom: 'Priest of Obscene',
        regles_speciales: [
          {
            nom: 'Flesh Reserve',
            texte:
              'Before the battle, you may assign one of the Wretches to the Priest, who carries it as a "sacrificial pawn" as part of his equipment. When the Priest fails to cast a spell, he may sacrifice the Wretch to re-roll the casting roll. The carried Wretch may still make its normal attacks in hand-to-hand combat while alive; it has no base of its own and cannot be targeted by enemy attacks. If the Priest dies, the Wretch is lost with him.',
          },
          { nom: 'Wizard', texte: 'The Priest of Obscene is a Wizard and uses the Rituals of Chaos (see magic).' },
        ],
      },
      devot: {
        nom: 'Devout',
        regles_speciales: [
          {
            nom: 'Fluctuating Form',
            texte:
              'At the start of the battle, and at each Recovery phase while not engaged in hand-to-hand combat, choose the aspect the Devout manifests for the turn: male aspect (+1 WS, +1 S, +1 A and +1 T) or female aspect (+1 BS, +2 I, +2 Ld and +2 M).',
          },
          { nom: 'Immune to Psychology', texte: 'The Devout is immune to Psychology and All Alone tests.' },
        ],
      },
      molosse_de_slaanesh: {
        nom: 'Slaaneshi Chaos Hound',
        regles_speciales: [
          { nom: 'Animal', texte: 'Slaaneshi Chaos Hounds are animals and never gain experience.' },
          { nom: 'Equipment', texte: 'None. Slaaneshi Chaos Hounds may not use any equipment, weapons, or armour.' },
        ],
      },
      bete_slaaneshi: { nom: 'Slaaneshi Beastman', regles_speciales: [] },
      souffre_douleur: {
        nom: 'Slaaneshi Wretch',
        regles_speciales: [
          { nom: 'Slaves to Darkness', texte: 'Wretches are immune to all Psychology and All Alone tests while within 6" of a friendly Hero.' },
          {
            nom: 'No Future',
            texte:
              "Wretches cannot become Heroes the normal way: if a \"The Lad's Got Talent\" result is rolled for a Wretch, re-roll it; if this second roll gives \"The Lad's Got Talent\" again, the model instead suffers an immediate roll on the Serious Injury table, as if it were a Hero.",
          },
        ],
      },
      cultiste: { nom: 'Cultist', regles_speciales: [] },
    },
    magie: {
      nom: 'Rituals of Chaos',
      sorts: [
        {
          nom: 'Vision of Torment',
          texte:
            'Range 6", cast on the nearest enemy (a model in base contact if the sorcerer is engaged in hand-to-hand combat). The victim is immediately Stunned; if it cannot be Stunned, it is Knocked Down instead.',
        },
        {
          nom: 'Eye of God',
          texte:
            'Usable once per battle. Choose any model within 6", friend or foe, and roll 1D6: 1 = the model is immediately taken Out of Action (no roll on the Serious Injury table); 2-5 = +1 to a characteristic of the caster\'s choice for the battle; 6 = +1 to all characteristics for the duration of the battle.',
        },
        {
          nom: 'Dark Blood',
          texte:
            "Range 8\", causes D3 Strength 5 hits on the first model in its path. The sorcerer must then roll on the Injury table for his own Wound (an Out of Action result is treated as Stunned).",
        },
        {
          nom: 'Lure of Chaos',
          texte:
            "Range 12\", cast on the nearest enemy model. Compare 1D6+Ld of the sorcerer to 1D6+Ld of the target; if the sorcerer wins, he takes control of his victim until it passes a Leadership test during the opponent's Recovery phase. The controlled model cannot commit suicide but may attack its own side, and will not fight the sorcerer's warband.",
        },
        {
          nom: 'Wings of Darkness',
          texte:
            'The sorcerer may immediately move anywhere within 12", even into contact with the enemy (counts as having charged). If he engages a fleeing enemy, he inflicts an automatic hit during the hand-to-hand combat phase, and the opponent then flees again if it survives.',
        },
        {
          nom: 'Word of Pain',
          texte: 'All models within 3" of the sorcerer, friend or foe, suffer a Strength 3 hit with no armour save.',
        },
      ],
    },
  },
  cavalcade_maudite: {
    nom: 'The Cursed Cavalcade (1c)',
    regles_speciales: [
      {
        nom: 'Absurd Nobility',
        texte:
          "Even though every non-animal member of the warband is Human, the corrupt and perverted power of the Dark Gods has bent the morale and psyche of these men beyond any imaginable level, even for the most tolerant of mercenaries. For this reason, the Cursed Cavalcade is treated as an Evil warband for all game effects (for example, the 333 - Prisoners result on the Exploration chart). It cannot hire any Hired Sword or Dramatis Personae, other than the Crow Master and anyone who specifically allows it.",
      },
      {
        nom: 'Captured!',
        texte:
          "If a Hero takes an enemy human Henchman model Out of Action with a Misericordia, and the warband has fewer than 5 Captured Thralls, roll a die: on a 5+ the model is captured. Enemy Heroes can only be captured as a result of a '61 - Captured!' result on the Serious Injuries table. It is not possible to capture more than 2 models per game. If the warband has already captured 2 Henchmen this game, or already has 5 Captured Thralls, re-roll any '61 - Captured!' result rolled against an enemy Hero.",
      },
      {
        nom: 'The Throne of Worms',
        texte:
          "For each enemy captured (see Captured! above), instead of rolling on the Serious Injury table after the battle, roll 1D6: 1 — the warrior is swallowed up forever by the Throne of Worms; remove him permanently from his original warband's roster. 2-5 — the warrior completely loses his mind and is submitted to the power of the Throne; remove him from his original warband's roster, and the Cursed Cavalcade gains a Captured Thrall. 6 — the warrior is sacrificed in a ritual to the Throne; remove him from his original warband's roster and a random Hero in the Cursed Cavalcade gains 1 XP. This result entirely replaces any other way a captured model is treated, including the '61 - Captured!' result on the Heroes' Serious Injury table.",
      },
      {
        nom: 'Warband Size Extended by Captured Thralls',
        texte: 'Captured Thralls (see their dedicated Henchman profile) do not count towards the warband\'s normal size limit (13 to start), effectively raising the capacity up to 18. A Captured Thrall can never be dismissed from the warband.',
      },
      {
        nom: 'Cursed Masks',
        texte:
          'At warband creation, each recruited Hero may receive a Cursed Mask for free (see Special Equipment). Each type of mask is unique: the warband may never own two of the same mask at once. Once worn, a mask cannot be removed. After warband creation, any Hero without one may buy a mask at the indicated price during the post-battle sequence.',
      },
      {
        nom: "Cavalcade's Special Skills",
        texte: "The Cursed Cavalcade's Heroes may choose their Special skills from the warband's own list (Noblesse Oblige, Torturer, Duelist — see special skills) instead of the standard Special skill tables.",
      },
      {
        nom: 'Noble House Banner',
        texte: 'The Cursed Cavalcade uses the Noble House Banner instead of the standard banner (see Special Equipment); as with any banner, the warband may only own one at a time.',
      },
    ],
    profils: {
      aristocrate: {
        nom: 'Aristocrat',
        regles_speciales: [
          { nom: 'Leader', texte: 'Any warrior of the Cursed Cavalcade within 6" of the Aristocrat may use his Leadership for their tests.' },
          { nom: 'Expert Horseman', texte: 'The Aristocrat gets the Ride (Nightmare) skill for free, without needing to choose it on an advance.' },
        ],
      },
      compagnon: {
        nom: 'Companion',
        regles_speciales: [
          { nom: 'Expert Swordsman', texte: 'As Imperial nobles, Companions have been taught the way of the sword from an early age. All Companions get the Expert Swordsman skill for free.' },
        ],
      },
      erudit_devoye: {
        nom: 'Twisted Scholar',
        regles_speciales: [
          {
            nom: 'Magical Adept (implementation simplification)',
            texte:
              "In the original rules, access to Lesser Magic is optional: at recruitment, for an extra 10 gc, the Twisted Scholar becomes a Wizard using Lesser Magic (knowing 1 randomly-rolled spell); alternatively, for 10 gc, he can become a Chronicler instead (re-rolls an Exploration die and picks which of the two to keep, without becoming a Wizard). As a modelling simplification in this app (which has no mechanism for an optional pay-to-toggle profile trait), the Twisted Scholar is always defined here as a Wizard using Lesser Magic from recruitment, at no extra cost — adjust manually if you want to faithfully apply the original paid, optional rule with the Chronicler alternative.",
          },
        ],
      },
      flutiste_maudit: {
        nom: 'Cursed Piper',
        regles_speciales: [
          {
            nom: 'Restricted Equipment',
            texte: 'The Cursed Piper must hold a flute or other instrument in one hand at all times. He may therefore never use an off-hand weapon, a double-handed weapon, a brace of pistols, a bow, or a crossbow.',
          },
          {
            nom: 'Danse Macabre',
            texte:
              "During the Shooting phase, the Cursed Piper may direct the cursed melody of his flute against one visible enemy model within 6\". The targeted model must pass a Leadership test or fall under the sway of the Danse Macabre: the Piper may then move it in any direction (including out of hand-to-hand combat or off a height). A warrior under this effect while engaged in hand-to-hand combat cannot attack (too busy dancing!). Only one enemy at a time can be controlled by the Danse Macabre; if the Piper targets another warrior, the previous one is immediately freed. At the start of the following enemy turn, in the Recovery phase, the controlled warrior must pass another Leadership test or remain under the effect (unable to attack or shoot) for that turn.",
          },
        ],
      },
      thrall: {
        nom: 'Thrall',
        regles_speciales: [
          { nom: 'Bought in Groups', texte: 'Thralls are bought in groups of 1 to 5; the warband may own an unlimited number of them.' },
        ],
      },
      thrall_capture: {
        nom: 'Captured Thrall',
        regles_speciales: [
          {
            nom: 'Not Available for Purchase',
            texte: 'A Captured Thrall is never bought directly at recruitment: it only joins the warband through the Captured!/Throne of Worms special rule (see warband special rules), up to a maximum of 5.',
          },
          {
            nom: 'Extra Servitors, Worthless but Precious',
            texte: "Captured Thralls do not count towards the warband's maximum size, raising the effective capacity from 13 to 18.",
          },
          { nom: 'Not Exactly Clever', texte: 'Captured Thralls can never gain Experience points or benefit from advances. They can never be dismissed from the warband.' },
        ],
      },
      grand_ours: {
        nom: 'Great Bear',
        regles_speciales: [
          { nom: 'Maddened With Pain', texte: 'As soon as the Great Bear suffers its first wound, it gains an additional Attack for the rest of the battle.' },
          { nom: 'Large Target', texte: 'The Great Bear is a Large Target for Shooting purposes.' },
          { nom: 'Animal', texte: 'The Great Bear does not fight like a normal warband member and never gains Experience.' },
        ],
      },
      bete_sauvage: {
        nom: 'Wild Beast',
        regles_speciales: [
          { nom: 'Charge', texte: 'When charging an enemy, the Wild Beast gains +1 Attack for the first turn of hand-to-hand combat (base 2 Attacks, raised to 3 on the charging turn).' },
          { nom: 'Animal', texte: 'The Wild Beast never gains Experience. It can represent a wild cat, a boar, or any other exotic animal trained for combat.' },
        ],
      },
      singe_de_combat: {
        nom: 'Fighting Ape',
        regles_speciales: [
          {
            nom: 'Agile',
            texte: 'The Fighting Ape gets the Scale Sheer Surfaces, Acrobat, and Dodge skills for free. It may also make a diving charge from a height of up to 10" instead of the normal maximum.',
          },
          { nom: 'Animal', texte: 'The Fighting Ape never gains Experience, but can still climb and enter buildings normally.' },
        ],
      },
    },
    competences_speciales: {
      noblesse_oblige: {
        nom: 'Noblesse Oblige',
        texte:
          'The warrior feels utterly superior to his opponents: his long lineage and prestige let him look down on his common enemies, whom he sees as nothing more than cattle to be slaughtered. The warrior is immune to Fear and can stomp knocked-down opponents underfoot, granting him an additional Attack against Knocked Down opponents, resolved at his own Strength.',
      },
      tortionnaire: {
        nom: 'Torturer',
        texte:
          'Having learned the art of torture during the Ritual of the Comet, the warrior knows how to inflict maximum pain and does so in a sadistic, cruel way in combat. Any model successfully Wounded (with no save) in hand-to-hand combat by this Hero permanently loses 1 point of Strength for the duration of the battle, the pain causing lasting agony. The effect is cumulative and can reduce the target\'s Strength to a minimum of 1. The Undead are immune to this effect.',
      },
      duelliste: {
        nom: 'Duelist',
        texte:
          "The warrior masters the Imperial art of duelling, prized by aristocrats renowned for their skill in single combat. At the end of each Hand-to-Hand Combat phase, the Duelist may force any non-Large opponent he is fighting one-on-one to pass a Strength test or be pushed 2\" in a direction of his choice. If this brings the target into contact with another model, both suffer an automatic Strength 2 hit. If this pushes the opponent off a height, he falls and takes damage as normal; the Duelist himself stays on the elevated area.",
      },
    },
  },
  sylvaneths: {
    nom: 'Sylvaneth (3)',
    regles_speciales: [
      {
        nom: 'Spirit Form',
        texte:
          'The Arch-Revenant, Thornwych, Tree-Revenants, Spite-Revenants and Treeman are difficult to stun. Whenever such a warrior suffers a Stunned result, roll a D6. On a 4+, treat the result as Knocked Down instead.',
      },
      {
        nom: 'Hatred of Metal',
        texte:
          'Sylvaneth may never wear conventional body armour. Shields, bucklers and Ironbark remain allowed if permitted by their equipment list.',
      },
      {
        nom: 'Forest Walk',
        texte: 'Sylvaneth ignore Movement penalties caused by woods, forests, undergrowth and similar vegetation terrain.',
      },
    ],
    profils: {
      archi_revenant: {
        nom: 'Arch-Revenant',
        regles_speciales: [{ nom: 'Leader', texte: 'Any warrior within 6" may use his Leadership.' }],
      },
      sorciere_des_ronces: {
        nom: 'Thornwych',
        regles_speciales: [{ nom: 'Wizard', texte: 'Starts with one randomly determined spell by rolling D3.' }],
      },
      branchanteresse: {
        nom: 'Branchwych',
        regles_speciales: [
          { nom: 'Wizard', texte: 'Starts with one randomly determined spell by rolling D3+3.' },
          { nom: 'Ironbark', texte: 'Starts with Ironbark I, included in her cost.' },
        ],
      },
      shadestalker: {
        nom: 'Shadestalker',
        regles_speciales: [
          { nom: 'Fear', texte: 'Causes Fear.' },
          { nom: 'Frenzy', texte: 'Is subject to Frenzy.' },
          { nom: 'Outcast', texte: 'Can never become the warband leader.' },
        ],
      },
      sylve_revenant: { nom: 'Tree-Revenant' },
      fiel_revenant: {
        nom: 'Spite-Revenant',
        regles_speciales: [
          { nom: 'Fear', texte: 'Causes Fear.' },
          {
            nom: 'Cruel Talons',
            texte: 'Start with two Cruel Talons, included in their cost. The second can never be sold or transferred.',
          },
        ],
      },
      dryade: {
        nom: 'Dryad',
        regles_speciales: [
          { nom: 'Ironbark', texte: 'Starts with Ironbark I and may never improve it.' },
          {
            nom: 'Forest Creatures',
            texte:
              'Never gain Experience or "The Lad\'s Got Talent!". They fight with claws and branches without the penalties for fighting unarmed.',
          },
        ],
      },
      homme_arbre: {
        nom: 'Treeman',
        regles_speciales: [
          { nom: 'Fear', texte: 'Causes Fear.' },
          { nom: 'Large Target', texte: 'Is a Large Target.' },
          {
            nom: 'Monstrous Veteran',
            texte: 'Gains Experience but can never become a Hero. Any "The Lad\'s Got Talent!" result is re-rolled.',
          },
          { nom: 'Claws', texte: 'Fights with its natural weapons without penalty.' },
        ],
      },
    },
    competences_speciales: {
      voies_secretes: {
        nom: 'Hidden Paths',
        texte:
          'The Hero is always placed after the opposing warband has deployed. He may be placed anywhere out of sight of all enemy models and more than 12" from any enemy. If both players have infiltrators, roll a D6: the lower result deploys first.',
      },
      maitrise_spectrale: {
        nom: 'Spectral Mastery',
        texte:
          'When a Hero uses a Spectral Weapon in close combat, he gains +1 on his rolls on the Critical Hit charts. Automatic wounds caused by a natural 6 to hit allow no armour save.',
      },
      repousse_perpetuelle: {
        nom: 'Endless Growth',
        texte:
          'Whenever the Hero suffers an unsaved wound, roll a D6. On a 5+, the wound is ignored. Wounds caused by flaming attacks can never be regenerated.',
      },
      memoire_des_ages: {
        nom: 'Memory of Ages',
        texte: 'Once per battle, the Hero may re-roll a failed roll he has just made. The second result must be accepted.',
      },
      murmures_des_racines: {
        nom: 'Whispers of the Roots',
        reserve_a: 'Only one Hero in the warband may have this skill',
        texte: "During Exploration rolls, this Hero allows you to modify the result of one die by -1/+1.",
      },
    },
    magie: {
      nom: 'Sylvaneth Sorcery',
      type: 'sorcery',
      note:
        'The Thornwych and Branchwych are Wizards and use the same spell table. The Thornwych determines her starting spell by rolling D3; the Branchwych rolls D3+3. For every new spell, roll D6. If the same spell is rolled twice, re-roll or reduce its Difficulty by 1.',
      sorts: [
        {
          nom: 'Verdurous Harmony',
          texte:
            'Choose a friendly Sylvaneth within 12". It recovers 1 lost Wound. If it is Knocked Down or Stunned, it may instead stand up immediately.',
        },
        {
          nom: 'Walk the Hidden Paths',
          texte:
            'Choose a friendly Sylvaneth within 6" that is not engaged in close combat. Reposition it up to 12" away. It may not finish in contact with an enemy and this move is never a charge.',
        },
        {
          nom: 'Treesong',
          texte:
            "Choose a friendly Sylvaneth within 12\". Until the start of the caster's next turn, all shooting attacks against it suffer -1 to hit. This modifier is not cover and stacks with actual cover.",
        },
        {
          nom: 'Wrathful Spirits',
          texte:
            'Choose a friendly Sylvaneth within 6". Until the next turn, it may re-roll failed rolls to wound. The second result stands. The roll used to determine a critical hit after an automatic Spectral Weapon wound may not be re-rolled.',
        },
        {
          nom: 'The Dwellers Below',
          texte:
            'Choose an enemy within 12". The target and every other enemy within 2" of it suffer a Strength 3 hit. Armour saves apply normally.',
        },
        {
          nom: 'Creeping Overgrowth',
          texte:
            'Choose an enemy within 12". Until the next turn, its Movement is halved, rounding up, and it always strikes last, even if it charges.',
        },
      ],
    },
    equipement: {
      sylvaneths: {
        armes_cac: ['first free', 'or Scythe', undefined, undefined, 'or Glaive', undefined],
        armures: [undefined, undefined, 'Level I/II/III, see special rules'],
      },
      homme_arbre: {
        armures: ['Level I/II/III, see special rules'],
      },
      divers_sylvaneth: {
        divers: ['Base weapon price x2, except daggers — see special rules', undefined, undefined],
      },
    },
    equipement_special: [
      { disponibilite: 'Sylvaneth only' },
      { disponibilite: 'Common, Sylvaneth only' },
      { disponibilite: 'Common (Levels I-II), Rare 10 Heroes only (Level III), Sylvaneth only' },
      { disponibilite: 'Rare 9, Treeman only' },
      { disponibilite: 'Rare 8, Thornwych only' },
    ],
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

export function translateMagie(magie: Magie, en: MagieTraduite | undefined): Magie {
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
  return refs?.map((r, i) => (r.note && notesEn?.[i] ? { ...r, note: notesEn[i] } : r));
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
    equipement_special: catalogue.equipement_special?.map((it, i) => {
      const dispoEn = en.equipement_special?.[i]?.disponibilite;
      return dispoEn ? { ...it, disponibilite: dispoEn } : it;
    }),
  };
}

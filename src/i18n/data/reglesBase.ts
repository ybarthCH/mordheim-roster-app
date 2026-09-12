import type { Language } from '../../state/useLanguage';
import type { ChapitreRegleBase, SousRegleBase } from '../../data/reglesBase';

// Traduction anglaise du livre de règles de base — source directement le PDF
// anglais original (« Mordheim Living Rulebook »), pas une traduction du
// texte français : contrairement au cas habituel du projet (français rédigé
// en premier, trou anglais comblé plus tard), les deux langues sont ici
// écrites dans la même passe à partir de deux sources officielles distinctes
// (le PDF anglais et le PDF français condensé fourni par Yannick). Réapparié
// par id (chapitre puis sous-règle) plutôt que par position — plus robuste
// qu'un réappariement positionnel si le contenu français est réordonné plus
// tard.
type SousRegleTraduite = Omit<SousRegleBase, 'id'> & { id: string };
type ChapitreTraduit = { id: ChapitreRegleBase['id']; titre: string; sousRegles: SousRegleTraduite[] };

const reglesBaseEn: ChapitreTraduit[] = [
  {
    id: 'sequence_de_bataille',
    titre: 'The Turn',
    sousRegles: [
      {
        id: 'sequence_de_tour',
        titre: 'Turn sequence',
        texte:
          "To play, one side takes a turn, then the other side, then the original side and so on. When it is your turn, you may move all your models, shoot with any warriors able to do so, and fight in hand-to-hand combat. Once your turn is complete, it is your opponent's turn to move, shoot and fight.\n\nEach turn is split into four phases, in this order:\n\n1. Recovery — you may attempt to rally individuals who have lost their nerve and recover models that are knocked down or stunned.\n2. Movement — you may move the warriors of your warband according to the rules given in the Movement section.\n3. Shooting — you may shoot with any appropriate weapons; spellcasters may cast a spell.\n4. Hand-to-hand combat — all models in hand-to-hand combat may fight. Both sides fight in this phase, regardless of whose turn it is.",
      },
      {
        id: 'phase_de_ralliement',
        titre: 'Recovery phase',
        texte:
          "To rally any of your models who have lost their nerve, take a Rally test by rolling 2D6:\n\n- 4: the model stops fleeing and has rallied; turn it to face in any direction you wish. It cannot move or shoot for the rest of the turn, but models able to do so can cast spells.\n- 8: the model continues to flee towards the closest table edge.\n\nNote that a model cannot rally if the closest model to him is an enemy model (fleeing, stunned, knocked down and hidden models are not taken into consideration).\n\nKnocked down or stunned warriors: warriors who have been stunned become knocked down instead, and warriors who have been knocked down may stand up.",
      },
    ],
  },
  {
    id: 'mouvement',
    titre: 'Movement',
    sousRegles: [
      {
        id: 'phase_de_mouvement',
        titre: 'Movement phase',
        texte:
          "During their movement phase, models can move up to their Movement rate in any direction. In normal circumstances models don't have to move their full distance, or at all if you do not want them to.\n\nModels are moved in the following order:\n\n1. Charge! — if you want a model to charge at an enemy model, this must be done at the start of the movement phase before moving any of your other models.\n2. Compulsory moves — a model is sometimes forced to move in a certain way. Make all compulsory moves before finishing any remaining movement.\n3. Remaining moves — once you have moved your chargers and made any compulsory moves, you may move the rest of your warriors as you see fit.\n\nModels knocked down or stunned: knocked down models may crawl 2\" during the movement phase, but only if their enemy is engaged in hand-to-hand combat with another opponent (otherwise they have to stay where they are). Stunned models cannot move. A model that stood up this turn can move at half rate, but may not run or charge.",
      },
      {
        id: 'charge',
        titre: 'Charge',
        texte:
          "If you want a model in your warband to charge at an enemy model and attack it in hand-to-hand combat, you must do this at the start of the movement phase before moving any of your other models.\n\nResolve charges one at a time: declare which model is charging, declare its target without measuring the distance, measure the distance and check the charge range, carry out the charge move, then move to the next charge. You may charge in any order you wish.\n\nA model may charge any opposing model if it can draw an unobstructed line to the target. A charge is like a running move, performed at double the Movement rate, ending with the attacker moving by the most direct route into base-to-base contact with the enemy model. Once their bases are touching they are engaged in hand-to-hand combat, even when separated by a low wall or obstacle where the bases cannot physically touch. Models cannot be moved into hand-to-hand combat except by charging — any move that brings a warrior into hand-to-hand combat is a charge by definition. A model that charges strikes first.\n\nCharging a model out of sight: it is not possible to charge a model out of sight more than 4\" away. To charge a model within 4\" that is out of sight but not declared hidden, the model must pass an Initiative test to detect it (4: charge possible; 8: the model may not charge this turn, but may move, shoot or cast spells).\n\nCharging more than one opponent: if you can move your warrior into base contact with more than one enemy model with its charge move, it can charge them both.\n\nDiving charge: a model in an elevated position may charge an enemy below by jumping down onto it. If the target model is within 2\" of the point where the charger lands and within a maximum height of 6\", the model may make a diving charge, taking an Initiative test for each full 2\" of height jumped (4: the model gains +1 to hit and +1 Strength for that hand-to-hand combat phase only; 8: the model falls, suffers damage — see Falling — and may not charge or move for the rest of the movement phase).\n\nCharge interception: an unengaged enemy within 2\" of the charge route may intercept the charging model (a charge may only be intercepted by one enemy). If the enemy causes fear, the intercepting model must take a Fear test; if failed, it does not move. If the intercepting model causes fear, move it into contact instead — the charging model must then take a Fear test as if it were the one being charged. Either way, the model that originally declared the charge still counts as having charged, not the interceptor.\n\nFailed charge: if you have misjudged the charge distance, the model only moves its normal Movement distance towards the enemy. It cannot shoot that turn, but can cast spells as normal.",
        precisionFaq:
          "It is possible to charge while climbing (Mordheim Annual 2002 p.104). Charge interception only applies to an actual charge — a model that merely moves past an enemy model (e.g. while running) cannot be intercepted (Mordheim Annual 2002 p.104). If two models are perfectly aligned, interception is impossible; being just 0.001mm ahead of the other is enough for a model to intercept (Tuomas Pirinen on Facebook). The intercepting model does not need line of sight to the charger, and a charge that involves a jump test cannot be intercepted (Tuomas Pirinen on Facebook).",
      },
      {
        id: 'courir',
        titre: 'Running',
        texte:
          "A running warrior can move at double speed.\n\n- A model can only run if there are no enemy models within 8\" of it at the start of the turn (fleeing, stunned, knocked down and hidden models do not count).\n- Any model that runs loses its chance to shoot during that turn.\n- Running models can cast spells as normal.\n- Running is not the same as charging: it does not allow a model to engage the enemy in hand-to-hand combat.",
      },
      {
        id: 'se_cacher',
        titre: 'Hiding',
        texte:
          "A model can hide if it ends its move behind a low wall, a column or a similar position where it could reasonably conceal itself. The player must declare that the warrior is hiding and place a Hidden counter beside the model. A model that runs, flees, is stunned or charges cannot hide that turn.\n\n- A model may stay hidden over several turns, so long as it stays behind a wall or similar feature, even while moving.\n- A hidden model cannot shoot or cast spells without giving away its position.\n- A hidden model cannot be seen, shot at or charged.\n- Enemy warriors will always see, hear or otherwise detect hidden foes within their Initiative value in inches.\n- If an enemy moves so that it can see the hidden warrior, the model is no longer hidden and the counter is removed.",
      },
      {
        id: 'grimper_ou_descendre',
        titre: 'Climbing',
        texte:
          "Any model (except animals) can climb up or down fences, walls, etc, provided that:\n\n- it is touching what it wants to climb at the start of its movement phase;\n- it cannot run while climbing;\n- the distance is covered in a single movement phase and cannot exceed the model's Movement value in inches (if the height is more than the model's normal move, it cannot climb).\n\nIf these conditions are met, the model must take an Initiative test:\n\n- 4: the model succeeds in climbing up or down. Any remaining Movement can be used as normal.\n- 8, climbing up: the model cannot move that turn.\n- 8, climbing down: the model falls from where it started its descent and suffers damage (see Falling).",
      },
      {
        id: 'descendre_en_sautant',
        titre: 'Jumping down',
        texte:
          "A model may jump down from high places (up to a maximum height of 6\") at any time during its movement phase. Take an Initiative test for every full 2\" it jumps down:\n\n- 4: the model can continue its movement. The jump does not count towards the distance moved.\n- 8: the model falls, takes damage and may not move any more during the movement phase (see Falling).",
      },
      {
        id: 'saut_en_longueur',
        titre: 'Jumping over gaps',
        texte:
          "Models may jump over gaps (up to a maximum of 3\"). Deduct the distance jumped from the model's Movement, remembering that you cannot measure the distance before jumping.\n\n- If the model does not have enough Movement to cover the distance, it automatically falls.\n- If it can cover the distance, it must pass an Initiative test or fall.\n- A model may jump over a gap and still fire a missile weapon if it is not running.\n- A model may jump as part of its charge or running move.",
      },
      {
        id: 'chute',
        titre: 'Falling',
        texte:
          "A model that falls takes D3 hits at a Strength equal to the height in inches that it fell, with no armour saves. Falling never causes a Critical Hit, and a model that falls may not move any further or hide during that turn, even if it is not hurt.",
      },
      {
        id: 'types_de_terrain',
        titre: 'Terrain',
        texte:
          "The type of terrain can affect a model's movement.\n\n- Open ground (normal Movement): the tabletop surface, floors of buildings, connecting overhangs, ladders and ropes; doors and hatches do not slow movement either.\n- Difficult ground (Movement halved): steep or treacherous slopes, bushes and the angled roofs of buildings.\n- Very difficult ground (Movement divided by 4): really dangerous terrain, such as narrow crawlholes through rubble.\n- Impassable terrain: a model that ends up in impassable terrain is taken out of action.\n- Walls and barriers: can be gone around or leapt over; a model can leap over a barrier less than 1\" high without affecting its movement.",
      },
    ],
  },
  {
    id: 'tir',
    titre: 'Shooting',
    sousRegles: [
      {
        id: 'qui_peut_tirer',
        titre: 'Shooting phase — who can shoot',
        texte:
          "During your warband's shooting phase each of your warriors may shoot once with one of his weapons. Work through the models one at a time: nominate the shooter, nominate his target, measure and check the range, work out whether he hits, and if he does work out any wounds or injuries caused, then move to the next shooter. You can take shots in any order you wish.\n\nKnocked down, stunned or recovering models: models that are knocked down or stunned may not fire. A model that stood up this turn may fire.\n\nEach model can shoot once in the shooting phase, so long as he can see a target and has a suitable weapon. He may not fire if he is engaged in hand-to-hand combat, has run or failed a charge in the movement phase, or has rallied this turn.\n\nTo shoot at a target, a model must be able to see it (stoop over the tabletop for a model's eye view). Models can see all around themselves (360°) and may be turned freely to face in any direction before firing; turning on the spot does not count as moving.",
      },
      {
        id: 'cible_prioritaire',
        titre: 'Closest target',
        texte:
          "You must shoot at the closest enemy, as he represents the most immediate threat. However, you may shoot at a more distant target if the closer model is harder to hit (in cover), if the more distant model is a large target, or if the closer models are stunned, knocked down or fleeing (though nothing stops you from targeting them instead).\n\nYou may not shoot at models engaged in hand-to-hand combat if models from the shooter's own warband are involved in that combat — the risk of hitting a comrade is too great.\n\nShooting from an elevated position: a model in an elevated position (more than 2\" above the table surface) may freely pick any target it can see and shoot at it. If there are enemies in the same building and in the shooter's line of sight, however, he must shoot at them instead, as they present a more immediate threat.",
      },
      {
        id: 'portee_de_tir',
        titre: 'Range',
        texte:
          "Once you have chosen a target, measure the distance to check whether the shot is within range. Each type of missile weapon has its own maximum range (see equipment). If the target is out of range, the shot has automatically missed.",
      },
      {
        id: 'toucher_tir',
        titre: 'Hitting the target',
        texte:
          "To determine whether a shot hits its target, roll a D6. The score needed depends on the shooter's Ballistic Skill, modified by various factors.\n\nNote that if a shot at a model in cover misses by exactly 1, it hits the cover instead of the model. Once you have hit a target, determine whether it is Wounded (see the Injuries chapter).",
        tableau: {
          entetes: ['BS', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
          lignes: [['D6 roll needed', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3']],
        },
      },
      {
        id: 'modificateurs_pour_toucher_tir',
        titre: 'Hit modifiers (shooting)',
        texte:
          "- Cover: -1. If any part of the target is obscured by scenery or another model, it counts as being in cover.\n- Long range: -1. The target is more than half of the weapon's maximum range away.\n- Moving & shooting: -1. The shooter has moved during this turn.\n- Large target: +1. The target has the large target special rule or is more than 2\" tall or wide.",
      },
      {
        id: 'parties_multi_joueurs_tir',
        titre: 'Multiplayer games (Mayhem in the Streets) — shooting',
        texte:
          "In a game involving more than two warbands, it is possible to shoot into a hand-to-hand combat, provided the shooter does not belong to the same warband as one of the combatants. As usual, shooters must target the closest enemy unless in an elevated position.\n\nIf the shooter targets a model engaged in hand-to-hand combat, any combatant in that combat may be hit instead: randomly allocate hits between the intended target and all models engaged against it in that combat.",
      },
    ],
  },
  {
    id: 'corps_a_corps',
    titre: 'Close Combat',
    sousRegles: [
      {
        id: 'qui_peut_combattre',
        titre: 'Who can fight',
        texte:
          "Close quarter fighting is resolved in the hand-to-hand combat phase, in which all models in combat fight, not just those belonging to the player whose turn it is. A warrior can fight enemies to his front, side or rear. Models whose bases are touching are engaged in hand-to-hand combat, which can only happen after a charge.\n\nIf a warrior is touching more than one enemy, he can choose which to attack, and may divide his Attacks as the player wishes, so long as this is made clear before rolling to hit. Models fighting in hand-to-hand combat do not shoot in the shooting phase (very close range pistol shots are treated like close combat weapon attacks).\n\nKnocked down, stunned or recovering models: knocked down or stunned models cannot strike back (and so cannot defend themselves) in hand-to-hand combat. A model that stood up this turn cannot disengage and will always strike last, irrespective of weapons or Initiative.",
        precisionFaq: 'After the first round of hand-to-hand combat, it is possible to swap a spear or pistols for other weapons (Mordheim Rules Review 2005 p.33).',
      },
      {
        id: 'qui_frappe_en_premier',
        titre: 'Who strikes first',
        texte:
          "Models with the strike first ability (from a charge, certain equipment, etc.) strike before anyone else, in descending Initiative order. They are followed by the remaining combatants, who also strike in Initiative order. Then come models that must strike last (due to certain equipment or other effects), again in descending Initiative order. Finally, models that stood up in the recovery phase this turn strike last of all.\n\nIn all cases, ties are broken by rolling a D6.",
      },
      {
        id: 'toucher_ennemi',
        titre: 'Hitting the enemy',
        texte:
          "To determine whether hits are scored, roll a D6 for each attack of each model fighting. The score needed depends on the Weapon Skills of the attacker and his opponent: compare the attacker's Weapon Skill with that of his opponent to find the minimum D6 score needed to hit.",
        tableau: {
          entetes: ["Attacker's WS \\ Opponent's WS", '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
          lignes: [
            ['1', '4', '4', '5', '5', '5', '5', '5', '5', '5', '5'],
            ['2', '3', '4', '4', '4', '5', '5', '5', '5', '5', '5'],
            ['3', '3', '3', '4', '4', '4', '4', '5', '5', '5', '5'],
            ['4', '3', '3', '3', '4', '4', '4', '4', '4', '5', '5'],
            ['5', '3', '3', '3', '3', '4', '4', '4', '4', '4', '4'],
            ['6', '3', '3', '3', '3', '3', '4', '4', '4', '4', '4'],
            ['7', '3', '3', '3', '3', '3', '3', '4', '4', '4', '4'],
            ['8', '3', '3', '3', '3', '3', '3', '3', '4', '4', '4'],
            ['9', '3', '3', '3', '3', '3', '3', '3', '3', '4', '4'],
            ['10', '3', '3', '3', '3', '3', '3', '3', '3', '3', '4'],
          ],
        },
      },
      {
        id: 'manier_deux_armes',
        titre: 'Fighting with two weapons',
        texte:
          "A warrior armed with two one-handed weapons may make 1 extra Attack with the additional weapon. This bonus is added to the total of the warrior's Attacks after other modifiers, such as frenzy, have been applied.\n\nIf he is armed with two different weapons, he makes a single attack with whichever weapon he chooses, and all others with the remaining weapon. Roll to hit and to wound separately for each weapon.",
      },
      {
        id: 'parade',
        titre: 'Parry',
        texte:
          "A warrior equipped with a weapon that has the parry special rule (a buckler or a sword, for example) may try to parry a blow scored by his opponent. Roll a D6: if the result is higher than the best result your opponent rolled to hit, the blow has been parried. A parried blow is ignored and has no effect.\n\n- A buckler or sword may only parry one blow per hand-to-hand combat phase.\n- A model fighting several opponents may only parry the first successful hit.\n- A model armed with a buckler and a sword may re-roll any failed parries once.\n- A model armed with two swords does not benefit from a parry re-roll.\n- It is impossible to parry a blow that scored a 6 to hit.\n- It is impossible to parry an attack whose Strength is equal to or greater than twice the parrying model's own basic Strength — it is simply too powerful to be stopped.",
      },
      {
        id: 'cible_a_terre_ou_sonnee',
        titre: 'Knocked down or stunned target',
        texte:
          "Knocked down target: all attacks against a knocked down warrior hit automatically. If any of them wound him and he fails his armour save, he is immediately taken out of action. A knocked down model may not parry.\n\nStunned target: a stunned warrior is at the mercy of his enemies — a stunned model is automatically taken out of action if an enemy attacks him in hand-to-hand combat.\n\nA model with multiple attacks may not stun/knock down and then automatically take a warrior out of action during the same hand-to-hand combat phase. The only way to achieve this is to have more than one model attacking the same enemy: if he is stunned/knocked down by the first attacker, he can be hit and put out of action by the next. If your model is engaged with an enemy who is still standing, it cannot attack other models that are stunned or knocked down, since they no longer pose an immediate threat and their companions will try to protect them.",
      },
      {
        id: 'quitter_un_combat',
        titre: 'Moving from combat',
        texte:
          "Once models are engaged in hand-to-hand combat they cannot move away during their movement phase. They must fight until they are either taken out of action, until they take out their enemies, or until one side or the other breaks and runs.",
      },
      {
        id: 'fuir_le_combat',
        titre: 'Breaking from combat',
        texte:
          "A warrior who panics whilst fighting in hand-to-hand combat will break off and run for it, as described in the Leadership & Psychology chapter. He turns and runs; his opponents each automatically score 1 hit against him, resolved immediately. A warrior cannot choose to leave a fight voluntarily.",
      },
      {
        id: 'parties_multi_joueurs_cac',
        titre: 'Multiplayer games (Mayhem in the Streets) — close combat',
        texte:
          "In multiplayer games, a warrior may sometimes be charged by models from two or more opposing warbands. In this case, the model fights in the hand-to-hand combat phase of each opponent it faces. This gives a model a large number of attacks over a single game turn, but it's unlikely to help it survive!",
      },
    ],
  },
  {
    id: 'blessures',
    titre: 'Injuries',
    sousRegles: [
      {
        id: 'jet_pour_blesser',
        titre: 'Roll to wound',
        texte:
          "When you hit a target, you must test to see if a wound is inflicted. Compare the Strength (of the weapon for shooting, of the combatant for hand-to-hand combat) with the Toughness of the target and roll a D6. A dash (–) means the target cannot be wounded.",
        tableau: {
          entetes: ['Strength \\ Toughness', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
          lignes: [
            ['1', '4', '5', '6', '6', '–', '–', '–', '–', '–', '–'],
            ['2', '3', '4', '5', '6', '6', '–', '–', '–', '–', '–'],
            ['3', '2', '3', '4', '5', '6', '6', '–', '–', '–', '–'],
            ['4', '2', '2', '3', '4', '5', '6', '6', '–', '–', '–'],
            ['5', '2', '2', '2', '3', '4', '5', '6', '6', '–', '–'],
            ['6', '2', '2', '2', '2', '3', '4', '5', '6', '6', '–'],
            ['7', '2', '2', '2', '2', '2', '3', '4', '5', '6', '6'],
            ['8', '2', '2', '2', '2', '2', '2', '3', '4', '5', '6'],
            ['9', '2', '2', '2', '2', '2', '2', '2', '3', '4', '5'],
            ['10', '2', '2', '2', '2', '2', '2', '2', '2', '3', '4'],
          ],
        },
      },
      {
        id: 'coups_critiques',
        titre: 'Critical hits',
        texte:
          "If you roll a 6 to wound (for hand-to-hand combat and shooting only), you cause a Critical Hit: roll a D6 and consult the table below.\n\nIf the attacker normally needs 6s to wound his target, he cannot cause a Critical Hit. A warrior may only cause one Critical Hit per hand-to-hand combat phase, caused by the first 6 he rolls. If a Critical Hit causes more than one wound and the attacker's weapon also causes multiple wounds, only use whichever of the two causes the most damage.",
        tableau: {
          entetes: ['D6', 'Effect'],
          lignes: [
            ['1-2', 'Hits a vital part. The wound is doubled to 2 wounds, with armour saves allowed.'],
            ['3-4', 'Hits an exposed spot. The wound is doubled to 2 wounds; the attack ignores all armour saves.'],
            ['5-6', 'Master strike! The wound is doubled to 2 wounds, no armour saves; you gain +2 to any Injury rolls.'],
          ],
        },
      },
      {
        id: 'armure',
        titre: 'Armour',
        texte:
          "If a warrior wearing armour suffers a wound, roll a D6. The score required varies according to the type of armour. If the roll succeeds, the blow has been deflected by the armour without harm.\n\nExample: Dieter wears heavy armour and carries a shield. His armour save is 4+. He is hit by a crossbow (Strength 4) and will therefore save on a roll of 5+ on a D6 (4+ – 1 = 5+).",
        tableau: {
          entetes: ['Armour', 'Minimum D6 score required to save'],
          lignes: [
            ['Light armour', '6+'],
            ['Heavy armour', '5+'],
            ['Gromril armour', '4+'],
            ['Shield', 'Adds +1 to the armour save'],
          ],
        },
      },
      {
        id: 'modificateurs_de_sauvegarde',
        titre: 'Armour save modifiers',
        texte:
          "Some weapons are better at penetrating armour than others: the higher a weapon's Strength, the more easily it can pierce armour. Some weapons are better at penetrating armour than their Strength value suggests (Elven bows, for example) — this is covered in the entry for each weapon where relevant.",
        tableau: {
          entetes: ['Strength', '1-3', '4', '5', '6', '7', '8', '9+'],
          lignes: [['Save modifier', 'None', '-1', '-2', '-3', '-4', '-5', '-6']],
        },
      },
      {
        id: 'jet_de_degats',
        titre: 'Injury roll',
        texte:
          "If a target has more than 1 Wound, deduct one from his total each time he suffers a wound. So long as the model has at least 1 Wound remaining, he may continue to fight.\n\nAs soon as a fighter's Wounds are reduced to zero, the player who inflicted the wound rolls a D6 for the wound that reduced the model to zero Wounds, and for every wound the model receives after that. Apply the highest result.",
        tableau: {
          entetes: ['D6', 'Effect'],
          lignes: [
            ['1-2', 'Knocked down.'],
            ['3-4', 'Stunned.'],
            ['5-6', 'Out of action.'],
          ],
        },
      },
      {
        id: 'a_terre',
        titre: 'Knocked down',
        texte:
          "The force of the blow knocks the warrior down. Place the model face up to show that he has been knocked down.\n\nA knocked down model may crawl 2\" during the movement phase, but only if his enemy is engaged in hand-to-hand combat with another opponent (otherwise he has to stay where he is). A knocked down model may not shoot, cast spells, or strike back (and so cannot defend himself) in hand-to-hand combat.\n\nHe may stand up at the start of his next turn's recovery phase: he may then move at half rate, shoot and cast spells, but cannot charge or run. If he was engaged in hand-to-hand combat, he may not move away and will automatically strike last, irrespective of weapons or Initiative. After this turn he moves and fights normally.\n\nA model that faces a knocked down warrior may put him out of his misery: all attacks against him hit automatically; if any wound him and he fails his armour save, he is immediately taken out of action. It is impossible to parry while knocked down.\n\nIf a model is knocked down within 1\" of the edge of a roof or building, it risks slipping and falling: take an Initiative test — if failed, it falls to the ground and takes damage (see Falling).",
      },
      {
        id: 'sonne',
        titre: 'Stunned',
        texte:
          "The victim falls to the ground, wounded and barely conscious. Turn the model face down to show that it has been stunned. A stunned model may do nothing at all. The player may turn it face up in the next recovery phase, and it is then treated as knocked down.\n\nA stunned warrior is at the mercy of his enemies: a stunned model is automatically taken out of action if it is attacked in hand-to-hand combat.\n\nIf a model is stunned within 1\" of the edge of a roof or building, it risks falling off: take an Initiative test — if failed, it falls and takes damage (see Falling).",
      },
      {
        id: 'hors_de_combat',
        titre: 'Out of action',
        texte:
          "The target has been badly hurt and falls unconscious. A warrior who is out of action is removed from the tabletop. It is impossible to tell at this point whether he is alive or dead, but for game purposes it makes no difference.\n\nAfter the battle you can test to see whether he survives and whether he sustains any serious lasting injuries as a result of his wounds (see the post-battle sequence and Serious Injuries for details).",
      },
    ],
  },
  {
    id: 'psychologie',
    titre: 'Leadership & Psychology',
    sousRegles: [
      {
        id: 'test_de_deroute',
        titre: 'The Rout test',
        texte:
          "A player must make a Rout test at the start of his turn if a quarter (25%) or more of his warband is out of action. Even warbands normally immune to psychology (such as Undead) must make Rout tests.\n\nIf the test is failed, the warband automatically loses the fight and the game ends immediately. To take the test, roll 2D6: if the score is equal to or less than the warband leader's Leadership, the player may continue to fight. If the leader is out of action or stunned, use the highest Leadership among the remaining fighters who are not stunned or out of action.\n\nA player may voluntarily abandon the battle at the start of any of his own turns, but only once he has already had to make a Rout test, or once at least 25% of his warriors are out of action.\n\nMultiplayer games (Mayhem in the Streets): if one of the warbands fails a Rout test (or has every member out of action), the game is not necessarily over. Unless a scenario states special victory conditions, a multiplayer game continues until only one warband remains on the table.",
      },
      {
        id: 'chefs',
        titre: 'Leaders',
        texte:
          "A warrior within 6\" of his leader may use the leader's Leadership value for his own Leadership tests, representing the leader's ability to encourage his warriors beyond their normal limits. A leader cannot confer this bonus if he is knocked down, stunned or fleeing himself.",
      },
      {
        id: 'seul_contre_tous',
        titre: 'All alone',
        texte:
          "A warrior fighting alone against two or more opponents, with no friendly models within 6\" (knocked down, stunned or fleeing friends do not count), must take a Leadership test on 2D6 at the end of his combat phase.\n\n- 4: his nerve holds.\n- 8: the warrior breaks from combat and runs (each opponent may make one automatic hit against him).\n\nIf the model survives, it runs 2D6\" directly away from its enemies.",
      },
      {
        id: 'fuite',
        titre: 'Fleeing',
        texte:
          "A fleeing model must take another Leadership test in the recovery phase:\n\n- 4: the model stops, but can do nothing else during its turn except cast spells.\n- 8: the model runs 2D6\" towards the nearest table edge, avoiding enemy models. If it reaches the table edge, it is removed from the game.\n\nIf a fleeing warrior is charged, the charger is moved into base contact as normal, but the fleeing warrior then runs a further 2D6\" towards the table edge before any blows can be struck.",
      },
      {
        id: 'frenesie',
        titre: 'Frenzy',
        texte:
          "Frenzied models must always charge if there are any enemy models within charge range (check after charges have been declared). They fight with double their Attacks characteristic in hand-to-hand combat (a warrior carrying a weapon in each hand still gets +1 Attack as usual — this additional Attack is never doubled).\n\nOnce within charge range, frenzied warriors are immune to all other psychology (such as fear) and don't need to take those tests as long as they remain within charge range.\n\nIf a frenzied model is knocked down or stunned, it loses its frenzy and fights normally for the rest of the battle.",
      },
      {
        id: 'haine',
        titre: 'Hatred',
        texte:
          "Warriors who fight enemies they hate in hand-to-hand combat may re-roll any misses when they attack in the first turn of each combat. This bonus applies only in the first turn of each combat — after that they fight as normal for the rest of the combat.",
      },
      {
        id: 'peur',
        titre: 'Fear',
        texte:
          "A model must take a Fear test (a Leadership test) in the following situations. Note that creatures that cause fear can ignore these tests.\n\na) If the model is charged by a warrior or creature that causes fear (test taken when the charge is declared and found to be within range):\n- 4: the model may fight as normal.\n- 8: it must roll 6s to score hits in the first round of that combat.\n\nb) If the model wishes to charge a fear-causing enemy (test to overcome this before charging):\n- 4: the model may fight as normal.\n- 8: the model may not charge and must remain stationary for the turn (treat as a failed charge).",
        precisionFaq:
          "A model charged by several fear-causing combatants must take a test for each charge declared. Once a test is failed, further Fear tests are no longer required — the model must roll 6s to hit that turn of combat, regardless of target (Mordheim Rules Review 2005 p.33).",
      },
      {
        id: 'stupidite',
        titre: 'Stupidity',
        texte:
          "Stupid models must take a Leadership test at the start of their turn. Roll 2D6:\n\n- 4: the creature moves and fights normally.\n- 8: the creature cannot strike in hand-to-hand combat this turn (the enemy must still make its rolls to hit as normal) or cast spells. If it is not in hand-to-hand combat, roll a D6:\n  - 1-3: the creature moves straight forward at half speed. It cannot charge (its movement stops 1\" from any model it would otherwise contact). It may fall from a sheer drop or hit an obstacle, in which case it stops. It will not shoot this turn.\n  - 4-6: the creature stands inactive and drools a bit this turn. It can do nothing else.\n\nWhether the test is passed or failed, the result applies until the start of the creature's next turn, when it must take a new Stupidity test.",
      },
    ],
  },
];

export function translateReglesBase(chapitres: ChapitreRegleBase[], language: Language): ChapitreRegleBase[] {
  if (language !== 'en') return chapitres;
  return chapitres.map((chapitre) => {
    const chapitreEn = reglesBaseEn.find((c) => c.id === chapitre.id);
    if (!chapitreEn) return chapitre;
    return {
      ...chapitre,
      titre: chapitreEn.titre,
      sousRegles: chapitre.sousRegles.map((sousRegle): SousRegleBase => {
        const sousRegleEn = chapitreEn.sousRegles.find((s) => s.id === sousRegle.id);
        if (!sousRegleEn) return sousRegle;
        return {
          ...sousRegle,
          titre: sousRegleEn.titre,
          texte: sousRegleEn.texte,
          tableau: sousRegleEn.tableau ?? sousRegle.tableau,
          precisionFaq: sousRegleEn.precisionFaq ?? sousRegle.precisionFaq,
        };
      }),
    };
  });
}

import type { Language } from '../../state/useLanguage';
import type { ChangelogEntry } from '../../data/changelog';

// Traduction anglaise indexée par date (même clé que ChangelogEntry.date),
// même mécanisme que translateItem/translateWarbandCatalog : le français
// reste la source de vérité, l'anglais ne fait que remplacer le texte des
// puces au rendu, réapparié par POSITION dans le tableau — toute
// modification de l'ordre/nombre de puces FR doit être répercutée ici dans
// le même ordre.
const changelogEn: Record<string, string[]> = {
  '2026-08-28': [
    'New banner on the home screen announcing the app is now officially available on the Google Play Store (can be permanently dismissed with one click).',
    'Continued the major warband rules audit: fixes for the Restless Dead (a Necromancer could wrongly be offered the spell reserved for the Liche instead of his own) and the Lustrian Reavers (the warband mistakenly used another warband\'s special weapon instead of its own, and a Hero\'s equipment normally reserved for one specific profile stayed purchasable by any Hero).',
  ],
  '2026-08-27': [
    'In the shop, mutations (Cult of the Possessed, Marauders of Chaos, Beastmen Raiders, Carnival of Chaos) move out of the Miscellaneous/Special category into a new dedicated Mutations tab, which only shows up for warriors who actually have access to them.',
    "Continued the major warband rules audit against official sourcebooks: fixed rules for the Marienburg Mercenaries, Middenheim Mercenaries, Reikland Mercenaries, Sisters of Sigmar, Witch Hunters, Skaven, Undead, Cult of the Possessed, Ostermark Mercenaries, Tileans, Beastmen Raiders, Marauders of Chaos, and Carnival of Chaos — including 6 missing mutations added to the Cult of the Possessed, the second-mutation price doubling finally applied for Beastmen Raiders, an exemption from the Eye of the Gods rule for a Wounded leader among the Marauders of Chaos, and numerous skill-access, equipment, and English translation fixes.",
    "Fixed a leak that let a warrior fully denied a weapon or armour category by the rules (Chaos war beasts, the Carnival of Chaos's Plague Cart...) still buy that kind of item through their warband's special equipment. The character sheet's Buy button is now automatically greyed out when a warrior isn't allowed to buy anything at all, in any warband.",
  ],
  '2026-08-26': [
    'New playable warband: Slayer Cult Warband (2a), a Dwarf warband of Slayers seeking a glorious death — Giant Slayer, Doomseekers, Rememberer, Trollslayers, Stubbles, and Axe Hurlers, with their signature weapons (Throwing Axe, Whirling Blades). Originally only available in English, translated into French for the occasion. Its Exploration dice depend too heavily on how the battle unfolds to be calculated automatically, so the player must count them by hand, using the reminder of the relevant special rules.',
    "Continued the major warband rules audit against official sourcebooks: fixed equipment, skill-access, and Hired Sword restrictions for the Dwarf Treasure Hunters, Black Dwarfs, Night Goblins, Kislevites, Ostlander Mercenaries, Imperial Outriders, Dark Elves, Black Orcs, Lizardmen, Bretonnian Knights, Outlaws of Stirwood Forest, Skaven of Clan Pestilens, Shadow Warriors, Marauders of Chaos, Norse, Pirates, Bretonnian Chapel Guardians, and Orc Mob (including forbidding Marauders from hiring a Witch/Warlock while a warrior bears the Mark of Arkhar, and requiring a living Wulfen for Norse to recruit Wolves), plus numerous English translation fixes.",
  ],
  '2026-08-25': [
    'Lustrian Reavers: Jungle Shadow\'s "Wizard option" is finally playable — for 30 gc, takeable at recruitment or at any point in the campaign from their sheet, with a choice of first Lesser Magic spell. The starting Light Armour, now incompatible, goes to the warband armoury instead of being lost.',
    'New Musterheim banner on the home screen.',
    'Major warband rules audit against official sourcebooks: fixed equipment and skill-access restrictions for the Amazons (Mordheim and Lustria), Nuln Gunnery School, Averlanders, Hochland Bandits, Horned Hunters, and Forest Goblins, plus numerous English translation fixes (rule, skill, and spell names aligned with the official texts).',
  ],
  '2026-08-24': [
    'Tapping the Wounds (W) number in the table or compact list now knocks off one wound per tap, automatically switching to Out of Action at zero and back to full health on the next tap.',
    'Added a "fan project, not affiliated with Games Workshop" notice at the bottom of the Privacy Policy page.',
  ],
  '2026-08-23': [
    'Added a "Sv" column (total armour save) to the table and compact list.',
    'The desktop member table now stays visible at all times (no more automatic switch to a 3-line list on narrow screens), and each model gets its own painted stone card.',
    "The \"Full Warband\" list now has its own drag handle, and the long-press time to start a drag on mobile was increased to 2 seconds to avoid accidental triggers.",
    "Fixed: accidentally scrolling while pressing on a model's name no longer starts a drag on mobile.",
    "Fixed the Weapons Expert/Weapons Training skills, which weren't correctly unlocking every weapon type.",
  ],
  '2026-08-22': [
    'New "Full Warband" view: a condensed list merging Heroes and Henchmen into one quick scroll, with a button to switch back to the usual detailed view.',
    'Exploration step: the Bear Pit is now a real decision and the new "Training Manual" item is available.',
    "Night Goblins: added the 6 warband special skills and the Squig Herder's dedicated skills.",
    'Profiles already recruited up to their limit (uniques, etc.) now appear greyed out in the recruitment list instead of staying selectable.',
    'Fixed the Mordheim Map sub-roll in exploration.',
    'Fixed 5 discrepancies found in the post-battle wizard.',
    "Night Goblins: fixed the Giant Squig's Movement.",
  ],
  '2026-08-21': [
    'Enlarged touch targets on mobile for member cards and XP gains.',
    'Fixed: in the recruitment wizard, cancelling at the equipment step now cancels the whole recruitment instead of leaving a half-created model.',
    'Fixed the Gromril armour price (150 gc instead of 200) and several inconsistencies in the Sylvaneths warband.',
    'Re-audited multi-result exploration events (quadruple, quintuple, sextuple): several missing cases added.',
  ],
  '2026-08-20': [
    'Repositioned the delete X and drag handle on member cards, moved the pending-advance badge onto the status row.',
    'Merged the LEADER badge with the status row when it no longer fits next to the name.',
    'The post-battle wizard\'s "Skip all" button now stays visible (disabled) instead of disappearing, avoiding a layout jump.',
  ],
  '2026-08-19': [
    'Added tribe-specific skill access, applied to the Tilean city-states.',
    'Repositioned the drag handle and delete X on mobile member cards, status moved onto its own row.',
    'Added an explicit "Save and go back" button at the bottom of Settings.',
    'Fixed numerous English translation errors found by a systematic audit across every warband (names, skills, special rules).',
    'Fixed a lost-update bug from quick successive actions on the roster, state leaks in split view, and buggy numeric input fields.',
  ],
  '2026-08-18': [
    'Equipment shopping now happens directly in the recruitment window instead of a second screen, with a cart to buy several items at once; added equipment choices for 7 Hired Swords.',
    'Added the English translation for the Sylvaneth warband.',
    'Quiet auto-reload on a stale-deploy error instead of a scary error screen.',
    'Fixed several equipment bugs (Averland, Cult of the Possessed, Kislevites, Skaven, Orc Mob, Undead, Beastmen).',
    "Fixed the avatar not filling its frame in both themes.",
  ],
  '2026-08-17': [
    "Unified the remaining red action buttons, moved starting XP into the recruit modal's title.",
    'Fixed French text leaking into the exploration journal in English mode.',
  ],
  '2026-08-16': [
    'Added banner illustrations for every warband.',
    'Restyled the shop and post-battle wizard to match the rest of the app (painted buttons, ribbon badges).',
    'On touch devices, dragging a warband card now only starts from a dedicated handle.',
  ],
  '2026-08-15': [
    "Each warband's banner now fills the card background on the selection screen.",
    'Warband cards can be reordered by drag-and-drop.',
    'Fixed the banner crop ballooning into a near-square shape on wide screens.',
  ],
  '2026-08-14': [
    'Header actions (settings, theme...) are now grouped into a single painted-stone dropdown menu instead of a row of separate buttons.',
    "Replaced the home screen's text title with the framed Musterheim banner.",
    'Fixed split-view responsive bugs, overly long character names, and dark-theme header contrast.',
  ],
  '2026-08-13': [
    'The equipment shop is now full-screen on desktop, with the same painted stone styling as the rest of the app.',
    'Fixed: only the true leader profile gets permanently banned on death; added a way to manually lift that ban from the roster.',
  ],
  '2026-08-11': [
    'Fixed missing warbands in the eligibility list and improved local-storage error handling.',
    'Fixed several accessibility and performance issues found in audit.',
  ],
  '2026-08-10': [
    'Shortened the Two-Handed Weapon item name.',
  ],
  '2026-08-09': [
    'The Active/Out of Action status control is now a forged-iron plaque instead of a plain switch.',
  ],
  '2026-08-08': [
    'Added Power Value V2 (Rout Value, permanent injuries, Dramatis Personae).',
    'Redesigned summary tiles (tinted watermark icons behind the text).',
    "The dense stat table is now shown in split view's list pane too, not just on cards.",
    'Fixed the cursor jumping while editing a name, a modal hidden behind split view, and stat alignment in the roster table.',
    'Fixed free exploration items being stored at 0 gc.',
  ],
  '2026-08-07': [
    'Added a Graveyard section for dead models.',
    'Added Power Value as an alternative warband rating.',
    'Fixed rules issues found in an FAQ audit (shop, post-battle advances, wizard-exit safety).',
    'Fixed the .txt import filter, added a Power Value breakdown tooltip.',
    'Fixed French text leaking into English mode.',
  ],
  '2026-08-06': [
    'Added Braces of Pistols.',
    'Redesigned the roster list and action bar, redesigned the Dead status display.',
    'Redesigned the warband summary tiles (Members/Rating/Treasury/Wyrdstone).',
    'Identical henchmen in the same group now share a single equipment line instead of repeating it.',
    'Fixed: the photo (and two other fields) was wiped on every roster reload.',
  ],
  '2026-08-05': [
    'Added member photos, with direct in-app photo capture and cropping.',
    'New art direction: Caslon Antique headings, discreet section eyebrows, unified toolbar icons.',
    'Redesigned the Active/Out of Action status control into a real toggle switch.',
    'Fixed stat visibility and table width issues in split view.',
  ],
};

export function translateChangelog(entries: ChangelogEntry[], language: Language): ChangelogEntry[] {
  if (language !== 'en') return entries;
  return entries.map((e) => {
    const en = changelogEn[e.date];
    if (!en) return e;
    return { ...e, points: e.points.map((p, i) => ({ ...p, texte: en[i] ?? p.texte })) };
  });
}

import type { Language } from '../../state/useLanguage';
import type { ChangelogEntry } from '../../data/changelog';

// Traduction anglaise indexée par date (même clé que ChangelogEntry.date),
// même mécanisme que translateItem/translateWarbandCatalog : le français
// reste la source de vérité, l'anglais ne fait que remplacer le texte des
// puces au rendu, réapparié par POSITION dans le tableau — toute
// modification de l'ordre/nombre de puces FR doit être répercutée ici dans
// le même ordre.
const changelogEn: Record<string, string[]> = {
  '2026-09-03': [
    "Lizardmen: the 3 Sacred Markings (Venom Glands, Huge Gob, Mark of the Ancients) can finally be bought, as special items reserved for the Heroes who qualify for them at recruitment.",
    'Maneaters: the "Gluttony" rule is now playable — an Ogre Hero can devour a captive obtained after battle, or even a warband-mate (gaining experience, removed from the roster), and each Ogre counts double when selling wyrdstone or treasure.',
    'Lustrian Reavers: the Trap Master can now buy Traps (a one-use item) in his shop.',
    "Sons of Hashut: the warband's full source material has finally been found — closes a leak that let forbidden Hired Swords (Ninja, Beast Hunter, Warrior Priest of Sigmar) be recruited, and adds the missing +1 Strength bonus on the Obsidian Weapon.",
    'Chaos Dwarfs: the Witch can now be hired as a Hired Sword.',
    'The message shown for "Lad\'s Got Talent" now reflects the real consequence of the rule for profiles who can never become a Hero (Slave, Goblin Warrior, Slaaneshi Wretch, Familiar Rat), instead of a generic reroll message that was sometimes wrong.',
    'Fixed several special items that were wrongly disappearing from the shop as soon as the warband had fought its first battle: Mad Cap Mushrooms (Night Goblins) and the Knight Vanguard\'s Warhorse (Merchant Caravans).',
    'Cult of the Possessed: mutations can no longer be bought after recruitment, and a Possessed can no longer be mounted, as the rules require.',
    'Skaven of Clan Pestilens: the Familiar Rat, wrongly capped at 0, can once again be obtained by transforming a Giant Rat.',
    'Chaos Dwarfs: the Exoskeleton and the Chaos Engine sometimes showed the wrong price in the common shop; the experience-based price reduction now also applies to the Exoskeleton. The Blunderbuss loses its "Systematic Misfires" rule, which came from no source ever found.',
    'Slayer Cult Warband: Stubbles gains Hatred of Orcs and Goblins like the other named Slayers, and the warband can now hire a Bard.',
    'Fixed a purchase bug for a Henchman group manually enlarged (via the group-size field): buying missing equipment to complete it no longer buys a whole extra batch by mistake.',
    "Maneaters: the warband's full source material has finally been found — fixes the Captain's Cathayan Longsword price (now fixed) and stops a Sabretusk from being recruited without a living Mountain Guide in the warband, as the rules require.",
  ],
  '2026-09-01': [
    'Fixed an important bug: the "Refresh" button on the update banner could stay unresponsive on a tab left open for a while (the tap did trigger the update behind the scenes, but the screen never reloaded on its own) — now reliable.',
    'Court of the Profane Pleasures: a new button lets you turn a captive obtained after battle into a Whipping Boy recruited into the warband for free ("Cruel Fate").',
    "Kislevites: \"Fiercely Loyal\", the Tame Bear's special skill, now lets the bear absorb part of the Bear Tamer's serious injury instead of him suffering it normally.",
    'Pirates: a +20 gc upkeep surcharge now applies automatically if the warband has both Dwarfs and Elves among its Hired Swords.',
    'Outlaws of Stirwood Forest: the "Archers" rule now actually prevents buying or using any missile weapon other than a bow, even via a skill that would normally allow it.',
  ],
  '2026-08-31': [
    "New forced leader-succession and profile-transformation mechanisms triggered from the character sheet: warband dissolution for the Undead when neither Necromancer nor Vampire remains, Pti'mek becoming a Black Orc, Giant Rat becoming a Pet Rat (Skaven of Clan Pestilens), the Possessed becoming a Chaos Spawn (Marauders of Chaos), forced succession for the Black Orcs, and the Merchant Caravans' Merchant handing off to the Apprentice (who inherits his special skills) on succession.",
    "New price reductions tied to a Hero's history: Chaos Armour gets cheaper the more experienced its wearer is (and searching for one gets a bonus based on enemies that Hero took out of action in the previous battle), while the Lord's Favour (Bretonnian Chapel Guardians) and Inheritance (Kislevites) both grant a Hero one item at half price on recruitment.",
    "The Maneaters' War Dog now unlocks access to Mercenary Hired Swords (removed from the warband when the chief who acquired it dies), and Gors become recruitable in Marauders of Chaos warbands bearing the Mark of Chaos Undivided.",
    'The rout indicator is now a badge on the warband summary card.',
    "Continued and closed out the major warband rules audit against official sourcebooks on nearly all of the remaining warbands: Amazons, Nuln Gunnery School, Averland Mercenaries, Hochland Bandits, Beastmen Raiders, Carnival of Chaos, The Cursed Cavalcade, Horned Hunters, Dwarf Treasure Hunters, Court of the Profane Pleasures, Cult of the Possessed, Slayer Cult Warband, Dark Elves, Imperial Outriders, Sons of Hashut, Bretonnian Chapel Guardians, Tomb Guardians, Pit Fighters, Night Goblins, Outlaws of Stirwood Forest, Lizardmen, Shadow Warriors, Marienburg Mercenaries, Lustrian Reavers, Maneaters, Marauders of Chaos, Middenheim Mercenaries, Mootlanders, Restless Dead, Chaos Dwarfs, Norse, Orc Mob, Black Orcs, Ostermark Mercenaries, Ostland Mercenaries, Pirates, Arabian Tomb Robbers, Skaven of Clan Pestilens, Tileans, Witch Hunters, Sylvaneths, and Undead — equipment leaks closed, special skills finally reserved to the right profile, recruitment caps fixed, and numerous rarity, price, and English translation corrections.",
    "Items \"fused to their wearer\" (like Chaos Armour) can no longer be resold or transferred to another member, and relative recruitment caps between two profiles of the same warband are now genuinely blocking instead of purely indicative.",
    'Fixed several shop leaks shared across warbands (access to items exclusive to another profile or warband, duplicate rare/unique items from a search, skills wrongly lifting an equipment ban).',
  ],
  '2026-08-30': [
    'New +1 XP button right from the warband list, no need to open the character sheet — handy for recording an enemy taken out of action mid-game. Dedicated chip with a confirmation prompt on mobile/two-pane view (to avoid a stray tap while scrolling), and a directly clickable XP cell on the desktop table.',
    'A confirmation is now asked before leaving the "create a new warband" screen without having clicked "Create warband" (header back button or a phone\'s hardware/gesture back) — nothing is saved yet at that point, so an accidental tap no longer silently loses everything.',
    'New "New version available" banner when an app update is ready: it stays discreetly at the bottom of the screen until tapping "Refresh", never reloading on its own or interrupting typing or closing a screen you\'re on. The app now also actively re-checks every hour while it stays open, on top of the browser\'s automatic check on every relaunch — and a new "Check for updates" button under Settings → About lets you force that check right away instead of waiting.',
    "Continued the major warband rules audit against official sourcebooks on the 10 warbands that had never been checked before: Merchant Caravans, The Cursed Cavalcade, Court of the Profane Pleasures, Sons of Hashut, Tomb Guardians, Maneaters, Cathayan Warrior Monks, Mootlanders, Arabian Tomb Robbers, and Pit Fighters — fixed wrongly-hireable Hired Swords and Dramatis Personae, skills misallocated between profiles, equipment access, and several incorrect stats and special rules (including the Mootlanders' Cleaver, whose Strength was flat-out inverted).",
    "General rules-engine audit (warband creation and the full post-battle sequence): Rare items can no longer be bought in the shop once the warband has fought its first battle (from then on they can only be found through exploration, as the rule requires); when several Heroes are tied on Leadership after the leader dies, succession is now decided automatically by Experience points, leaving the player's manual choice only for a full tie.",
    'A warrior who dies now consistently loses all of his equipment, as the rule requires: fixed first for the models of a group who die in the post-battle wizard (including a group whose inventory was already mismatched between models), then extended to every other case where it was still missing (dying in combat from the character sheet, the Pit, the Lord of the Shadows table...).',
    'Kislevites: the Tame Bear once again requires a living Bear Tamer to be recruited or kept in the warband.',
    'Fixed two shop leaks: the common shop stayed accessible while recruiting a new member even though it should be hidden for certain warbands, and a Squig designated "Trained" (Night Goblins) could wrongly buy equipment like a Henchman.',
  ],
  '2026-08-29': [
    "Kislevites: fixed access to the Priest of Morr, Elf Mage, and Kislev Ranger Hired Swords (their own special rule says they hire like the Human Mercenary warbands). Also fixed the name of the Halfling Hired Sword, who is actually the Halfling Scout.",
    'Kislevites: the Bear Tamer, Esaul, and Youth can once again buy armour, like the rest of the warband.',
    "Fixed a possible misclick in the XP grid (on the character sheet and in the post-battle wizard) that could drop a warrior's XP below their starting XP.",
  ],
  '2026-08-28': [
    'New banner on the home screen announcing the app is now officially available on the Google Play Store (can be permanently dismissed with one click).',
    'Continued the major warband rules audit: fixes for the Restless Dead (a Necromancer could wrongly be offered the spell reserved for the Liche instead of his own) and the Lustrian Reavers (the warband mistakenly used another warband\'s special weapon instead of its own, and a Hero\'s equipment normally reserved for one specific profile stayed purchasable by any Hero).',
    'The Finish button when recruiting a Mutant (Cult of the Possessed) or a Tainted One (Carnival of Chaos) now stays greyed out until a mutation/Blessing of Nurgle has been bought, matching the rule that requires one at recruitment.',
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

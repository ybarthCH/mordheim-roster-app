import type { Language } from '../../state/useLanguage';
import type { ChangelogEntry } from '../../data/changelog';

// Traduction anglaise indexée par date (même clé que ChangelogEntry.date),
// même mécanisme que translateItem/translateWarbandCatalog : le français
// reste la source de vérité, l'anglais ne fait que remplacer le texte des
// puces au rendu, réapparié par POSITION dans le tableau — toute
// modification de l'ordre/nombre de puces FR doit être répercutée ici dans
// le même ordre.
const changelogEn: Record<string, string[]> = {
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
};

export function translateChangelog(entries: ChangelogEntry[], language: Language): ChangelogEntry[] {
  if (language !== 'en') return entries;
  return entries.map((e) => {
    const en = changelogEn[e.date];
    if (!en) return e;
    return { ...e, points: e.points.map((p, i) => ({ ...p, texte: en[i] ?? p.texte })) };
  });
}

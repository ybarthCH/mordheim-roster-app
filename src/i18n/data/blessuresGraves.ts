import type { Language } from '../../state/useLanguage';
import type { ResultatBlessureGrave } from '../../data/blessuresGraves';

type SousJetOptionTraduite = { texte: string; noteTag?: string };
type BlessureTraduite = {
  nom?: string;
  texte?: string;
  noteTag?: string;
  sousJetOptions?: SousJetOptionTraduite[];
};

// Traductions de la table des Blessures Graves (D66), remplies
// progressivement — voir translateItem dans i18n/data/items.ts pour le même
// principe de repli. Clé = id du résultat (src/data/blessuresGraves.ts).
export const blessuresEn: Record<string, BlessureTraduite> = {
  mort: {
    nom: 'Death',
    texte:
      "The warrior is dead; his body is abandoned in the dark alleys of Mordheim and will never be found. All the weapons and equipment he carried are lost. Remove him from the warband's roster.",
  },
  blessures_multiples: {
    nom: 'Multiple Injuries',
    texte:
      'The warrior is not dead but has suffered numerous injuries. Roll 1D6: roll that many times on this same table. Re-roll any Death, Captured, or new Multiple Injuries result.',
  },
  blessure_jambe: {
    nom: 'Leg Wound',
    texte: "The warrior's leg is broken. He now suffers a permanent -1 penalty to Movement.",
  },
  blessure_bras: {
    nom: 'Arm Wound',
    texte: 'Roll 1D6 to determine the severity of the injury.',
    sousJetOptions: [
      {
        texte:
          'Serious arm wound: it must be amputated. The warrior may now only use a single one-handed weapon from now on.',
        noteTag: 'Arm amputated — can only use a single one-handed weapon',
      },
      {
        texte: 'Minor wound: the warrior must miss the next game.',
        noteTag: 'Must miss the next game (arm wound)',
      },
    ],
  },
  folie: {
    nom: 'Madness',
    texte: "Roll 1D6 to determine the form the warrior's madness takes.",
    sousJetOptions: [
      {
        texte: 'The warrior becomes subject to Stupidity.',
        noteTag: 'Subject to Stupidity (Serious Injury — Madness)',
      },
      {
        texte: 'The warrior is now subject to Frenzy.',
        noteTag: 'Subject to Frenzy (Serious Injury — Madness)',
      },
    ],
  },
  jambe_brisee: {
    nom: 'Smashed Leg',
    texte: 'Roll 1D6 to determine the severity of the injury.',
    sousJetOptions: [
      {
        texte: 'The warrior can no longer run, but may still charge.',
        noteTag: 'Can no longer run (may still charge)',
      },
      {
        texte: 'The warrior misses the next game.',
        noteTag: 'Must miss the next game (broken leg)',
      },
    ],
  },
  blessure_poitrine: {
    nom: 'Chest Wound',
    texte:
      'The warrior was badly wounded in the chest. He recovers but remains weakened by the injury: his Toughness is reduced by -1.',
  },
  aveugle_oeil: {
    nom: 'Blinded in One Eye',
    texte:
      'The warrior survives but loses the sight of one eye (determined randomly). His Ballistic Skill is reduced by -1. If he later loses his other eye as well, he must retire from the warband permanently.',
    noteTag: 'Blind in one eye — permanent retirement if the other eye is lost',
  },
  vieille_blessure: {
    nom: 'Old Battle Wound',
    texte:
      'The warrior survives, but his injury will sometimes prevent him from fighting: from now on, at the start of every battle, roll 1D6 — on a result of 1, he cannot take part in the battle.',
    noteTag: 'Old wound — roll 1D6 at the start of the battle (1 = does not fight)',
  },
  trouble_nerveux: {
    nom: 'Nerve Damage',
    texte: "The warrior's nervous system has been damaged. His Initiative is permanently reduced by -1.",
  },
  blessure_main: {
    nom: 'Hand Wound',
    texte: "The warrior's hand is badly injured. His Weapon Skill is permanently reduced by -1.",
  },
  blessure_profonde: {
    nom: 'Deep Wound',
    texte:
      'The warrior has suffered a serious injury and must miss the next 1D3 games while he recovers. He can do nothing at all during his convalescence.',
  },
  detrousse: {
    nom: 'Robbed',
    texte: 'The warrior manages to escape, but all his weapons, armour, and equipment are lost.',
  },
  retablissement_complet: {
    nom: 'Full Recovery',
    texte: 'The warrior was knocked out, or suffers a minor wound from which he makes a full recovery.',
  },
  haine_tenace: {
    nom: 'Lasting Hatred',
    texte:
      'The warrior recovers physically, but remains psychologically scarred by the ordeal. Roll 1D6 to determine who he now hates.',
    sousJetOptions: [
      {
        texte:
          'The individual responsible for the injury. If it was a Henchman, he hates the enemy leader instead.',
        noteTag: 'Lasting Hatred: the individual responsible (or the enemy leader if a Henchman)',
      },
      {
        texte: 'The leader of the warband responsible for the injury.',
        noteTag: 'Lasting Hatred: the enemy warband\'s leader',
      },
      {
        texte: 'The entire warband of the warrior responsible for the injury.',
        noteTag: 'Lasting Hatred: the entire enemy warband',
      },
      {
        texte: 'All warbands of that type.',
        noteTag: 'Lasting Hatred: all warbands of that type',
      },
    ],
  },
  capture: {
    nom: 'Captured',
    texte:
      "The warrior regains consciousness, a prisoner of the enemy warband. He may be freed for a ransom (price set by the captor) or exchanged for a prisoner held by his own warband. A prisoner may be sold to slave traders for D6×5 gc. Undead may kill their prisoner to make a new Zombie. Possessed may sacrifice the prisoner — the warband leader then gains +1 Experience. A prisoner who is exchanged or ransomed keeps all his equipment; if he is sold, killed, or zombified, his equipment remains with his captors.",
  },
  endurci: {
    nom: 'Hardened',
    texte: 'The warrior survives and grows hardened to the horrors of Mordheim. He is now immune to Fear.',
    noteTag: 'Immune to Fear (Serious Injury — Hardened)',
  },
  cicatrices_horribles: {
    nom: 'Horrible Scars',
    texte: 'The warrior now bears dreadful scars: he causes Fear.',
    noteTag: 'Causes Fear (Serious Injury — Horrible Scars)',
  },
  gladiateur: {
    nom: 'Sold to the Pits',
    texte:
      "The warrior wakes up in the infamous fighting pits of the Cutthroat's Haven and must face a gladiator. Determine who charges, then resolve the fight normally. If he loses, he is thrown out of the pits without his armour or weapons and rolls again on the full table to find out what becomes of him. If he wins, he pockets 50 gc, gains +2 Experience, and is free to rejoin his warband with all his equipment.",
  },
  survit_contre_tout: {
    nom: 'Survives Against All Odds',
    texte: 'The warrior survives and rejoins his warband. He gains +1 Experience.',
  },
};

// N'affecte que l'affichage (sélecteur, en-têtes, aperçu de confirmation) —
// le texte réellement consigné dans le journal/l'historique du guerrier
// reste toujours celui de `ResultatBlessureGrave` d'origine (français),
// exactement comme pour translateItem vis-à-vis des achats d'équipement.
export function translateBlessure<T extends ResultatBlessureGrave>(r: T, language: Language): T {
  if (language !== 'en') return r;
  const en = blessuresEn[r.id];
  if (!en) return r;
  return {
    ...r,
    nom: en.nom ?? r.nom,
    texte: en.texte ?? r.texte,
    noteTag: en.noteTag ?? r.noteTag,
    sousJet: r.sousJet
      ? {
          ...r.sousJet,
          options: r.sousJet.options.map((o, i) => {
            const oEn = en.sousJetOptions?.[i];
            return oEn ? { ...o, texte: oEn.texte, noteTag: oEn.noteTag ?? o.noteTag } : o;
          }),
        }
      : r.sousJet,
  };
}

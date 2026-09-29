import type { UiDictionary } from './types';

// Libellés de la fiche PDF exportée (utils/pdfExport.ts). Ils étaient écrits
// en français en dur dans le générateur, qui ne recevait pas la langue : un
// joueur anglophone obtenait un PDF mi-anglais (noms d'objets et de profils,
// traduits via les données) mi-français (tous les intitulés de structure).
//
// Deux origines pour l'anglais de ce fichier :
//   - la plupart des termes existaient DÉJÀ traduits ailleurs dans
//     l'interface (Treasury, Heroes, Henchmen, Warband rating, Battle
//     history, Date, Result, Notes, Tribe...) : leur formulation est reprise
//     telle quelle, pas réinventée ;
//   - les intitulés propres au PDF, sans équivalent existant, sont des
//     PROPOSITIONS à valider (voir la marque « proposition » sur chacun).
//     Conformément à la politique de traduction du projet (CLAUDE.md,
//     FR -> EN), ils ne sont pas censés être comblés d'initiative : ils sont
//     isolés ici pour qu'une correction tienne en une ligne.
export const pdfExport: UiDictionary = {
  // --- En-tête
  'pdf.warbandLabel': { fr: 'Bande :', en: 'Warband:' },
  // proposition
  'pdf.listLabel': { fr: 'Liste :', en: 'List:' },
  'pdf.tribeLine': { fr: 'Tribu : {nom}', en: 'Tribe: {nom}' },

  // --- Encadrés de résumé
  'pdf.treasuryBox': { fr: 'TRÉSORERIE', en: 'TREASURY' },
  'pdf.treasuryLine': { fr: '{po} po · {ws} wyrdstone', en: '{po} gc · {ws} wyrdstone' },
  // Cette ligne affiche valeurBande() (utils/bandeValue.ts) : la somme des
  // coûts de recrutement EN OR des figurines vivantes. À ne pas confondre
  // avec le classement de bande de l'encadré voisin (pdf.standingBox), qui
  // est le « Warband rating » du livre de règles — figurines x5 + expérience.
  // D'où « value » et non « rating » ici : les deux encadrés portaient sinon
  // le même intitulé anglais pour deux nombres différents.
  'pdf.warbandValue': { fr: 'Valeur de bande : {n} po', en: 'Warband value: {n} gc' },
  // proposition — abréviations Victoires/Défaites/Nuls -> Wins/Losses/Draws
  'pdf.record': { fr: 'Bilan : {v}V / {d}D / {n}N', en: 'Record: {v}W / {d}L / {n}D' },
  'pdf.standingBox': { fr: 'CLASSEMENT DE BANDE', en: 'WARBAND RATING' },
  // proposition
  'pdf.totalXpLine': { fr: 'XP cumulé : {xp} · {libelle} : {valeur}', en: 'Total XP: {xp} · {libelle}: {valeur}' },
  // « suivant(s) » était un terme inventé : le jeu dit « homme de main » /
  // « Henchman », comme partout ailleurs dans l'app. Le pluriel irrégulier
  // anglais (henchman/henchmen) ne se prête pas au « (s) » utilisé côté
  // français, d'où l'asymétrie de forme entre les deux.
  'pdf.membersLine': { fr: '{heros} héros, {autres} homme(s) de main', en: '{heros} heroes, {autres} henchmen' },
  // proposition
  'pdf.reserveBox': { fr: 'ÉQUIPEMENT EN RÉSERVE', en: 'EQUIPMENT IN RESERVE' },
  'pdf.none': { fr: 'Aucun', en: 'None' },

  // --- Sections
  'pdf.heroes': { fr: 'Héros', en: 'Heroes' },
  // proposition
  'pdf.capNote': {
    fr: '(la ligne grisée sous les valeurs indique le plafond racial applicable)',
    en: '(the greyed line under the values shows the applicable racial maximum)',
  },
  'pdf.henchmen': { fr: 'Hommes de main & créatures', en: 'Henchmen & creatures' },
  // proposition
  'pdf.killedInAction': { fr: 'Morts au combat : {noms}', en: 'Killed in action: {noms}' },
  'pdf.notes': { fr: 'Notes', en: 'Notes' },
  'pdf.battleHistory': { fr: 'Historique des batailles', en: 'Battle history' },
  'pdf.date': { fr: 'Date', en: 'Date' },
  'pdf.result': { fr: 'Résultat', en: 'Result' },
  // proposition
  'pdf.opponent': { fr: 'Adversaire', en: 'Opponent' },

  // --- Blocs de figurine
  'pdf.equipmentLine': { fr: 'Équipement : {liste}', en: 'Equipment: {liste}' },
  'pdf.skillsLine': { fr: 'Compétences & Sorts : {liste}', en: 'Skills & Spells: {liste}' },
  // proposition
  'pdf.totalXp': { fr: 'XP total : {xp}', en: 'Total XP: {xp}' },
  // proposition
  'pdf.groupXp': { fr: 'Expérience du groupe : {xp}', en: 'Group experience: {xp}' },

  // --- Pied de page
  // proposition
  'pdf.generatedOn': { fr: '{bande} — généré le {date}', en: '{bande} — generated on {date}' },
  // proposition
  'pdf.pageOf': { fr: 'Page {i} / {n}', en: 'Page {i} of {n}' },
  // Locale de formatage de la date du pied de page — 'fr-FR' donnait un
  // 28/09/2026 même en anglais.
  'pdf.dateLocale': { fr: 'fr-FR', en: 'en-GB' },
};

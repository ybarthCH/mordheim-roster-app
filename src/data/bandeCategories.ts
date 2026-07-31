// Catégorisation officielle des bandes (Livre des Règles + FAQ), utilisée
// pour la Disponibilité des francs-tireurs ET des Dramatis Personae — d'où
// son extraction dans un module à part, importé par hiredSwords.ts et
// dramatisPersonae.ts sans dépendance circulaire entre les deux.
//
// - Mercenaires : Marienburg, Middenheim, Reikland, Ostland, Averland et les
//   autres provinces impériales, ainsi que les Kislévites, Tiléens,
//   Norses/Pit Fighters (Gladiateurs) et Artilleurs de Nuln.
// - Humains : les Mercenaires ci-dessus, plus toute bande majoritairement
//   humaine (Répurgateurs, Sœurs de Sigmar, Norses, Gladiateurs, Gardiens de
//   Chapelle, Chasseurs de Trésors Lustriens...).
// - Adeptes du Chaos : Kermesse du Chaos et autres Cultes du Chaos, Hommes-
//   Bêtes, Maraudeurs du Chaos, Nains du Chaos. Les Skavens et Elfes Noirs
//   n'en font PAS partie.
// - Bien : bandes alignées du côté du Bien (Mercenaires, Répurgateurs, Sœurs
//   de Sigmar, Kislévites, Gardiens de Chapelle, Chasseurs de Trésors Nains).
// - Toute bande possédant un Vampire, un Nécromancien ou une Liche est
//   considérée comme une bande de Morts-Vivants.
export const TOUTES_LES_BANDES = [
  'artilleurs_de_nuln',
  'averlanders',
  'beastmen_raiders',
  'carnival_of_chaos',
  'cult_of_the_possessed',
  'dwarf_treasure_hunters',
  'gardiens_de_chapelle_bretonniens',
  'gladiateurs',
  'gobelins_de_la_nuit',
  'kislevites',
  'lustrian_reavers',
  'maneaters',
  'maraudeurs_du_chaos',
  'marienburgers',
  'middenheimers',
  'morts_sans_repos',
  'nains_du_chaos',
  'norses',
  'orc_mob',
  'orques_noirs',
  'ostlanders',
  'reiklanders',
  'sisters_of_sigmar',
  'skaven',
  'skavens_pestilens',
  'undead',
  'witch_hunters',
] as const;

export const SKAVENS = ['skaven', 'skavens_pestilens'];
export const MORTS_VIVANTS = ['undead', 'morts_sans_repos'];
export const PEAUX_VERTES = ['orc_mob', 'orques_noirs', 'gobelins_de_la_nuit'];
export const CHAOS = [
  'beastmen_raiders',
  'carnival_of_chaos',
  'cult_of_the_possessed',
  'maraudeurs_du_chaos',
  'nains_du_chaos',
];
export const MERCENAIRES = [
  'reiklanders',
  'marienburgers',
  'middenheimers',
  'averlanders',
  'ostlanders',
  'artilleurs_de_nuln',
];
export const HUMAINS = [
  ...MERCENAIRES,
  'witch_hunters',
  'sisters_of_sigmar',
  'kislevites',
  'norses',
  'gladiateurs',
  'gardiens_de_chapelle_bretonniens',
  'lustrian_reavers',
];
export const BIEN = [
  ...MERCENAIRES,
  'witch_hunters',
  'sisters_of_sigmar',
  'kislevites',
  'gardiens_de_chapelle_bretonniens',
  'dwarf_treasure_hunters',
];
export const MALEFIQUES = [...MORTS_VIVANTS, ...SKAVENS, ...PEAUX_VERTES, ...CHAOS];

export const toutesSauf = (...ids: string[]) => TOUTES_LES_BANDES.filter((id) => !ids.includes(id));
export const uniques = (ids: string[]) => [...new Set(ids)];

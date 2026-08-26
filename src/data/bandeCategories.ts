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
  'amazones_lustrie',
  'amazones_mordheim',
  'artilleurs_de_nuln',
  'averlanders',
  'bandits_du_hochland',
  'beastmen_raiders',
  'caravanes_marchandes',
  'carnival_of_chaos',
  'cavalcade_maudite',
  'chasseurs_cornus',
  'chevaliers_bretonniens',
  'cour_des_plaisirs_profanes',
  'cult_of_the_possessed',
  'culte_des_tueurs',
  'dwarf_treasure_hunters',
  'elfes_noirs',
  'escorteurs_imperiaux',
  'expedition_runique',
  'fils_dhashut',
  'gardiens_de_chapelle_bretonniens',
  'gardiens_des_tombes',
  'gladiateurs',
  'gobelins_de_la_nuit',
  'gobelins_des_forets',
  'guerriers_fantomes',
  'hommes_lezards',
  'hors_la_loi_de_stirwood',
  'kislevites',
  'lustrian_reavers',
  'maneaters',
  'maraudeurs_du_chaos',
  'marienburgers',
  'middenheimers',
  'moines_guerriers_de_cathay',
  'mootlanders',
  'morts_sans_repos',
  'nains_du_chaos',
  'norses',
  'orc_mob',
  'orques_noirs',
  'ostermarkers',
  'ostlanders',
  'pilleurs_de_tombes_arabes',
  'pirates',
  'reiklanders',
  'sisters_of_sigmar',
  'skaven',
  'skavens_pestilens',
  'tileens',
  'undead',
  'witch_hunters',
] as const;

export const SKAVENS = ['skaven', 'skavens_pestilens'];
export const MORTS_VIVANTS = ['undead', 'morts_sans_repos'];
export const PEAUX_VERTES = ['orc_mob', 'orques_noirs', 'gobelins_de_la_nuit', 'gobelins_des_forets'];
export const ELFES = ['elfes_noirs', 'guerriers_fantomes'];
export const NAINS = ['dwarf_treasure_hunters', 'expedition_runique', 'culte_des_tueurs'];
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
  'amazones_lustrie',
  'amazones_mordheim',
  'bandits_du_hochland',
  'chasseurs_cornus',
  'chevaliers_bretonniens',
  'escorteurs_imperiaux',
  'hors_la_loi_de_stirwood',
  'pirates',
  'tileens',
];
export const BIEN = [
  ...MERCENAIRES,
  'witch_hunters',
  'sisters_of_sigmar',
  'kislevites',
  'gardiens_de_chapelle_bretonniens',
  'dwarf_treasure_hunters',
  'culte_des_tueurs',
];
export const MALEFIQUES = [...MORTS_VIVANTS, ...SKAVENS, ...PEAUX_VERTES, ...CHAOS];

export const toutesSauf = (...ids: string[]) => TOUTES_LES_BANDES.filter((id) => !ids.includes(id));
export const uniques = (ids: string[]) => [...new Set(ids)];

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
//   Bêtes, Maraudeurs du Chaos, Nains du Chaos, Fils d'Hashut (bande de
//   Nains du Chaos elle aussi — "A Chaos Dwarf warband"). Les Skavens et
//   Elfes Noirs n'en font PAS partie.
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
// gardiens_des_tombes n'est nommée dans aucune source comme exclue des
// francs-tireurs/Dramatis Personae (son propre PDF, tomb guardians.pdf, ne
// parle même pas de francs-tireurs) — ajoutée par extension du même
// traitement déjà appliqué à morts_sans_repos (bande de supplément elle
// aussi sans clause explicite propre, mais dont tous les profils portent la
// règle spéciale nommée "Mort-Vivant"/"Undead", exactement comme ici sur
// les 5 profils de Gardiens des Tombes hors Scorpion des Tombeaux) : à
// reconsidérer si une source nommant explicitement cette bande contredit ce
// choix.
export const MORTS_VIVANTS = ['undead', 'morts_sans_repos', 'gardiens_des_tombes'];
export const PEAUX_VERTES = ['orc_mob', 'orques_noirs', 'gobelins_de_la_nuit', 'gobelins_des_forets'];
export const ELFES = ['elfes_noirs', 'guerriers_fantomes'];
export const NAINS = ['dwarf_treasure_hunters', 'expedition_runique', 'culte_des_tueurs'];
export const CHAOS = [
  'beastmen_raiders',
  'carnival_of_chaos',
  'cult_of_the_possessed',
  'maraudeurs_du_chaos',
  'nains_du_chaos',
  'fils_dhashut',
];
export const MERCENAIRES = [
  'reiklanders',
  'marienburgers',
  'middenheimers',
  'averlanders',
  'ostlanders',
  'artilleurs_de_nuln',
  // Gladiateurs ("Les Gladiateurs peuvent recruter tous les Francs-tireurs
  // disponibles, à l'exception de l'Éclaireur Elfe...", Gladiateurs [GLM].pdf
  // p.2) : ajoutée ici pour que tout franc-tireur accessible aux Mercenaires
  // (directement ou via HUMAINS/BIEN/MERCENAIRES_ET_KISLEVITES, qui
  // partent tous de cette constante) le devienne aussi pour les Gladiateurs
  // — sauf l'Éclaireur Elfe, explicitement exclu de son propre bande_ids
  // (voir hiredSwords.ts).
  'gladiateurs',
  // Bandits du Hochland ("Les Bandits n'ont aucun scrupule à recruter des
  // mercenaires et peuvent engager n'importe quel Franc-Tireur autorisé pour
  // une bande de Mercenaires humains.", Bandits du Hochland [GLM].pdf p.1)
  // : même logique que Gladiateurs ci-dessus — aucune exception nommée dans
  // le texte, donc ajoutée directement ici plutôt que via une constante
  // dérivée façon MERCENAIRES_ET_KISLEVITES.
  'bandits_du_hochland',
  // Caravanes Marchandes ("Hired Swords: Merchant Caravans may hire every
  // Hired Sword that is available to Mercenary warbands.", Merchant
  // Caravans.pdf p.1) : même logique — aucune exception nommée, et
  // vérification croisée du Hired Sword Compendium (Bard, Dwarf Troll
  // Slayer, Freelancer, Elf Ranger, Kislev Ranger, Halfling Thief, Elf
  // Mage, Priest of Morr) confirmant qu'aucun de ces francs-tireurs
  // n'exclut nommément cette bande. Retire par la même occasion l'ajout ad
  // hoc redondant du Pyromane dans hiredSwords.ts (seul cas déjà correct
  // avant ce commit, désormais couvert par le spread).
  'caravanes_marchandes',
  // Ostermarkers ("Ostermarkers follow the rules for Mercenary warbands as
  // given on page 48 of the Mordheim rulebook.", 19TheLeagueOfOstermark.pdf
  // p.3/Mercenaires Ostermarkers [GLM].pdf p.1) : bande de Mercenaires
  // humains standard sans exception nommée — manquait de cette constante
  // depuis sa création (`ostermarkers` n'était présente que dans
  // TOUTES_LES_BANDES), ce qui bloquait à tort tout franc-tireur/Dramatis
  // Personae gaté par MERCENAIRES/HUMAINS/BIEN (ex. Luthor la Lame Pourpre,
  // ouvert à "Toutes les bandes humaines sauf les Middenheimers").
  'ostermarkers',
];
// Règle spéciale kislévite ("Une bande kislévite peut engager les mêmes
// Francs-tireurs que les bandes de mercenaires humains décrites dans le
// livre de règles de Mordheim.", Kislévites [GW].pdf p.1) : à utiliser à la
// place de MERCENAIRES seul pour tout franc-tireur dont le texte
// d'employeurs désigne génériquement "les bandes de Mercenaires humains"
// (voir hiredSwords.ts, ex. Prêtre de Morr, Mage elfe) — pas pour ceux dont
// la liste d'employeurs nomme des bandes précises en plus des Mercenaires
// (Barde, Ranger Kislévite, Chasseur de Trésor Nain, Pyromane...), où
// l'exclusion des Kislévites pourrait être volontaire et documentée dans
// leur propre fiche du Hired Sword Compendium — non vérifié à ce jour,
// laissés sur MERCENAIRES tant que cette source n'a pas été relue.
export const MERCENAIRES_ET_KISLEVITES = [...MERCENAIRES, 'kislevites'];
export const HUMAINS = [
  ...MERCENAIRES,
  'witch_hunters',
  'sisters_of_sigmar',
  'kislevites',
  'norses',
  'gardiens_de_chapelle_bretonniens',
  'lustrian_reavers',
  'amazones_lustrie',
  'amazones_mordheim',
  // bandits_du_hochland retiré d'ici : déjà couvert via le spread
  // ...MERCENAIRES ci-dessus depuis son ajout direct à MERCENAIRES.
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

// Bandes qui "comptent comme" le Culte des Possédés pour l'exploration et
// les blessures graves : "The Amazons follow the rules for the Possessed
// warband when it comes to prisoners." (Amazones - Setting Mordheim/Lustrie
// [GW - GLM edit].pdf p.4) et "La kermesse du Chaos compte donc comme une
// bande de possédés pour tout ce qui est de l'exploration et des blessures
// graves." (Kermesse du Chaos [GW].pdf p.1, règle "Corrompu"). Utilisée pour
// synchroniser les options de sacrifice (Vagabond, Prisonniers) entre
// ResolutionVagabond.tsx et ResolutionPrisonniers.tsx, qui codaient chacun
// leur propre liste en dur — l'ajout des Amazones à l'un sans l'autre avait
// laissé passer l'oubli de la Kermesse dans les deux.
export const BANDES_TRAITEES_COMME_POSSEDES = [
  'cult_of_the_possessed',
  'amazones_mordheim',
  'amazones_lustrie',
  'carnival_of_chaos',
  // "the Cursed Cavalcade is treated as an Evil warband, and, similarly to
  // the Cult of the Possessed, for all game effects purpose (such as, for
  // example, for the effect 333 - Prisoners, on the exploration chart)."
  // (The Cursed Cavalcade.pdf p.4) — clause générale ("for all game effects
  // purpose"), pas limitée au seul exemple cité.
  'cavalcade_maudite',
];

export const toutesSauf = (...ids: string[]) => TOUTES_LES_BANDES.filter((id) => !ids.includes(id));
export const uniques = (ids: string[]) => [...new Set(ids)];

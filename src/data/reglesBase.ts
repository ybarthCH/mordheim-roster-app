// Livre de règles de base (mécanique de jeu générique, indépendante de toute
// bande) — accessible depuis la page référence de bande (BandeReferenceScreen)
// plutôt que d'y être injecté, vu le volume de texte. Source : « Mordheim -
// Livre des Règles - Règles condensées [GLM] », PDF français fourni par
// Yannick dans le dépôt Musterheim-pdf-warband-ref/Rules/ (compilation fidèle
// des règles officielles + quelques précisions FAQ clairement identifiées
// ci-dessous). Pagination d'origine indiquée dans les titres de sous-règles à
// titre de repère de relecture, jamais affichée dans l'app.
//
// Pas de règle « Terreur » distincte dans cette source (ni dans le Living
// Rulebook anglais consulté en parallèle) : la Terreur n'existe dans Mordheim
// que comme règle spéciale ponctuelle de certains profils (ex : bandes de
// Morts-Vivants), jamais comme chapitre générique du livre de base — absente
// ici volontairement plutôt qu'inventée.

export type SousRegleBase = {
  id: string;
  titre: string;
  // Paragraphes séparés par \n\n, listes à puces en lignes préfixées par
  // "- " — même convention que le texte multi-paragraphe déjà affiché en
  // pre-line ailleurs dans l'app (ex : regles_speciales).
  texte: string;
  tableau?: { entetes: string[]; lignes: string[][] };
  // Précision issue d'une FAQ/erratum plutôt que du corps du livre lui-même
  // (identifiée comme telle dans la source) — affichée séparément du texte
  // principal plutôt que fondue dedans.
  precisionFaq?: string;
};

export type ChapitreRegleBase = {
  id: 'sequence_de_bataille' | 'mouvement' | 'tir' | 'corps_a_corps' | 'blessures' | 'psychologie';
  titre: string;
  sousRegles: SousRegleBase[];
};

export const REGLES_BASE: ChapitreRegleBase[] = [
  {
    id: 'sequence_de_bataille',
    titre: 'Le Tour',
    sousRegles: [
      {
        id: 'sequence_de_tour',
        titre: 'Séquence de tour',
        texte:
          "Pendant une partie, les camps jouent chacun leur tour. Pendant votre tour, vous pouvez déplacer toutes vos figurines, tirer avec les guerriers qui le peuvent, et combattre au corps à corps. Une fois votre tour terminé, c'est à votre adversaire de se déplacer, tirer et combattre.\n\nChaque tour se décompose en quatre phases, dans cet ordre :\n\n1. Ralliement — vous pouvez tenter de rallier ceux qui ont perdu leur calme et relever les combattants à terre ou sonnés.\n2. Mouvement — vous pouvez déplacer vos guerriers selon les règles du chapitre Mouvement.\n3. Tir — vous pouvez tirer avec toute arme appropriée ; les jeteurs de sorts peuvent lancer un sort.\n4. Corps à Corps (CàC) — tous les combattants engagés au corps à corps peuvent combattre. Les deux camps se battent lors de cette phase, quel que soit le joueur dont c'est le tour.",
      },
      {
        id: 'phase_de_ralliement',
        titre: 'Phase de ralliement',
        texte:
          "Pour rallier vos combattants qui ont perdu leur calme, faites un test de Commandement avec 2D6 :\n\n- 4 : la figurine cesse de fuir et est ralliée. Tournez-la dans la direction de votre choix. Le combattant ne peut ni se déplacer, ni tirer pour le reste du tour, mais peut lancer des sorts s'il en a la capacité.\n- 8 : la figurine continue de fuir vers le bord de table le plus proche.\n\nÀ noter qu'un combattant ne peut pas être rallié si la figurine la plus proche est un ennemi (les figurines en fuite, sonnées, à terre et cachées ne sont pas prises en compte).\n\nFigurines à terre ou sonnées : les figurines qui étaient à terre peuvent se relever. Les figurines de votre bande qui étaient sonnées passent à terre.",
      },
    ],
  },
  {
    id: 'mouvement',
    titre: 'Mouvement',
    sousRegles: [
      {
        id: 'phase_de_mouvement',
        titre: 'Phase de mouvement',
        texte:
          "Durant leur tour, les figurines peuvent se déplacer de leur valeur de Mouvement. Il n'est pas obligatoire d'utiliser tout son Mouvement, ni même de se déplacer.\n\nLes figurines sont déplacées dans l'ordre suivant :\n\n1. Charges — effectuez les charges au début de la phase de Mouvement avant de déplacer les autres figurines.\n2. Mouvements obligatoires — une figurine parfois obligée de se déplacer d'une certaine manière (mouvement obligatoire) le fait avant les autres mouvements.\n3. Autres mouvements — après charges et mouvements obligatoires, déplacez le reste de vos guerriers.\n\nFigurines à terre, sonnées ou qui se relèvent : les figurines à terre peuvent ramper de 2ps pendant la phase de Mouvement, mais uniquement si leur adversaire est engagé au corps à corps avec un autre combattant (sinon elles doivent rester sur place). Les figurines sonnées ne peuvent pas se déplacer. Les figurines qui viennent de se relever peuvent se déplacer à demi-vitesse, mais ne peuvent ni charger, ni courir.",
      },
      {
        id: 'charge',
        titre: 'Charge',
        texte:
          "Si vous voulez que l'un de vos combattants engage au corps à corps un ennemi, vous devez effectuer un mouvement spécial appelé charge.\n\nEffectuez les charges une par une : désignez la figurine qui va charger, sans mesurer la distance désignez sa cible, mesurez la distance et vérifiez la portée de charge, réalisez le mouvement, puis passez à la charge suivante. Vous pouvez charger dans l'ordre que vous voulez.\n\nUne figurine peut charger n'importe quelle figurine ennemie tant qu'une ligne dégagée peut être tracée. Une charge s'effectue au double du Mouvement normal, en empruntant le chemin le plus court pour entrer en contact socle à socle avec la cible. Dès que leurs socles se touchent, les figurines sont engagées au corps à corps, même si elles sont séparées par un muret ou un obstacle qui empêche les socles d'être physiquement en contact. Des figurines ne peuvent pas être engagées au corps à corps sans une charge préalable : tout déplacement qui amène un guerrier au corps à corps est une charge par définition. Une figurine qui charge frappera en premier.\n\nCharger une figurine hors de vue : il n'est pas possible de charger une figurine hors de vue située à plus de 4ps. Pour charger une figurine à moins de 4ps, hors de vue mais non déclarée cachée, le combattant doit faire un test d'Initiative pour la repérer (4 : charge possible ; 8 : pas de charge, mais il peut se déplacer, tirer ou lancer des sorts).\n\nCharger plusieurs adversaires à la fois : si vous parvenez à placer votre combattant en contact socle à socle avec plus d'une figurine lors d'une charge, il peut les charger en même temps.\n\nCharge plongeante : un combattant placé en hauteur peut charger un ennemi situé sous lui en lui sautant dessus. Si la cible est à moins de 2ps du point de chute et à 6ps maximum de hauteur, le combattant peut faire une charge plongeante ; il doit faire un test d'Initiative pour chaque tranche complète de 2ps de hauteur sautée (4 : la figurine reçoit +1 pour toucher et +1 Force pour cette phase de Corps à Corps uniquement ; 8 : le combattant tombe, subit des dommages — voir Chute — et ne peut ni charger ni se déplacer pour le reste de la phase de Mouvement).\n\nInterception de charge : un ennemi non-engagé se trouvant à moins de 2ps de l'itinéraire de charge peut intercepter la figurine qui charge (une charge ne peut être interceptée que par un seul ennemi). Si l'ennemi provoque la peur, l'intercepteur doit faire un test de peur ; en cas d'échec, il ne se déplace pas. Si l'intercepteur provoque la peur, faites-le avancer au contact — la figurine qui charge doit alors faire un test de peur comme si elle subissait la charge. Quel que soit le résultat, c'est la figurine qui chargeait à l'origine qui compte comme ayant chargé, pas l'intercepteur.\n\nCharge ratée : si vous avez mal estimé la distance de charge, la figurine n'avance que de son Mouvement normal vers l'ennemi. Elle ne pourra pas tirer ce tour, mais pourra lancer des sorts.",
        precisionFaq:
          "Il est possible de charger en grimpant (Mordheim Annual 2002 p.104). L'interception de charge ne concerne que la charge elle-même — une figurine qui passe à proximité sans charger (en courant, par exemple) ne peut pas être interceptée (Mordheim Annual 2002 p.104). Si deux figurines sont parfaitement alignées, l'interception est impossible ; il suffit que la figurine qui intercepte soit à 0,001 mm devant l'autre pour pouvoir intercepter (Tuomas Pirinen sur Facebook). L'intercepteur n'a pas besoin d'avoir une ligne de vue directe sur le combattant qui charge, et il n'est pas possible d'intercepter une charge qui implique un test de saut (Tuomas Pirinen sur Facebook).",
      },
      {
        id: 'courir',
        titre: 'Courir',
        texte:
          "Un guerrier qui court peut se déplacer au double de son Mouvement normal.\n\n- Une figurine ne peut courir que si aucun ennemi ne se trouve à moins de 8ps au début de son tour (les figurines en fuite, à terre, sonnées et cachées ne sont pas prises en compte).\n- Une figurine qui a couru ne peut pas tirer.\n- Une figurine qui a couru peut lancer des sorts.\n- Courir ne permet pas d'engager un ennemi au corps à corps.",
      },
      {
        id: 'se_cacher',
        titre: 'Se cacher',
        texte:
          "Une figurine peut se cacher si elle termine son déplacement derrière un muret, une colonne ou tout autre objet assez grand pour qu'elle puisse s'y dissimuler. Le joueur doit signaler que son combattant se cache en plaçant un pion caché à côté de lui. Une figurine sonnée, qui court, fuit ou charge ne peut pas se cacher.\n\n- Si elle ne sort pas de sa cachette, une figurine peut rester cachée plusieurs tours, même si elle se déplace.\n- Une figurine cachée ne peut ni tirer, ni lancer de sort sans trahir sa position et ne plus être cachée.\n- Il n'est pas possible de voir, cibler ou charger une figurine cachée.\n- Une figurine verra ou entendra toujours un ennemi caché à une distance égale à son Initiative en pas.\n- Si un ennemi se déplace de manière à pouvoir la voir, la figurine n'est plus considérée comme cachée et le pion est retiré.",
      },
      {
        id: 'grimper_ou_descendre',
        titre: 'Grimper ou descendre',
        texte:
          "Tout combattant (en dehors des animaux) peut escalader des grilles, des murs ou autres pour y grimper ou en descendre, sous réserve que :\n\n- la figurine soit en contact avec le mur au début du tour ;\n- elle ne puisse pas courir pendant qu'elle grimpe ou descend ;\n- la distance soit parcourue en une seule fois et ne dépasse pas la valeur de Mouvement de la figurine en pas (si la hauteur est supérieure au Mouvement, il n'est pas possible de grimper).\n\nSi ces conditions sont réunies, le combattant doit faire un test d'Initiative :\n\n- 4 : la figurine réussit à grimper ou descendre. Tout Mouvement restant peut être utilisé normalement.\n- 8, en grimpant : la figurine ne peut pas bouger pendant ce tour.\n- 8, en descendant : la figurine tombe de l'endroit où elle a commencé sa descente et subit des dommages (voir Chute).",
      },
      {
        id: 'descendre_en_sautant',
        titre: 'Descendre en sautant',
        texte:
          "Un combattant peut sauter à n'importe quel moment pendant son déplacement (maximum 6ps). Il doit faire un test d'Initiative pour chaque tranche complète de 2ps de hauteur :\n\n- 4 : la figurine peut finir son déplacement. Le saut ne compte pas dans la distance parcourue.\n- 8 : la figurine tombe, subit des dommages et ne peut plus bouger pour le reste de la phase de Mouvement (voir Chute).",
      },
      {
        id: 'saut_en_longueur',
        titre: 'Saut en longueur',
        texte:
          "Les figurines peuvent sauter pour franchir des trous. Déduisez la distance sautée (maximum 3ps) du Mouvement de la figurine, sans pouvoir mesurer la distance avant de sauter.\n\n- Si la figurine n'a pas assez de Mouvement pour faire le saut, elle tombe automatiquement.\n- Si elle peut franchir la distance, elle doit réussir un test d'Initiative pour ne pas tomber.\n- Une figurine peut sauter un trou et quand même tirer avec une arme si elle ne court pas.\n- Une figurine peut sauter pendant une charge ou une course.",
      },
      {
        id: 'chute',
        titre: 'Chute',
        texte:
          "Une figurine qui tombe subit 1D3 touches d'une Force égale à la hauteur de chute en ps, sans sauvegarde d'armure. Une chute ne provoque jamais de Coup Critique et une figurine qui a chuté ne peut ni se déplacer, ni se cacher, pour le reste du tour, même si elle est indemne.",
      },
      {
        id: 'types_de_terrain',
        titre: 'Types de terrain',
        texte:
          "Le type de terrain peut affecter la capacité de mouvement des combattants.\n\n- Terrain dégagé (Mouvement normal) : le sol, les planchers, les bâtiments, les passerelles, les échelles et les cordes ; franchir des portes et trappes ne ralentit pas non plus les déplacements.\n- Terrain difficile (Mouvement divisé par 2) : pentes abruptes ou instables, broussailles, toits pentus des bâtiments.\n- Terrain très difficile (Mouvement divisé par 4) : terrains vraiment dangereux, comme de petits tunnels à travers des éboulis.\n- Terrain infranchissable (impossible) : une figurine qui s'y retrouve est mise hors de combat.\n- Murs et barrières : peuvent être contournés ou sautés ; une figurine peut sauter un obstacle de moins de 1ps de haut sans que son Mouvement ne soit affecté.",
      },
    ],
  },
  {
    id: 'tir',
    titre: 'Tir',
    sousRegles: [
      {
        id: 'qui_peut_tirer',
        titre: 'Phase de tir — qui peut tirer',
        texte:
          "Pendant votre phase de Tir, chacun de vos combattants peut utiliser l'une de ses armes pour tirer. Effectuez les tirs un par un : désignez la figurine qui va tirer, désignez sa cible, mesurez et vérifiez la portée de tir, déterminez si le combattant touche, s'il a touché déterminez si la cible est Blessée puis, le cas échéant, les Blessures, et passez au tireur suivant. Vous pouvez tirer dans l'ordre que vous voulez.\n\nFigurines à terre, sonnées ou qui se relèvent : les figurines à terre ou sonnées ne peuvent pas tirer. Les figurines qui viennent de se relever peuvent tirer.\n\nUne fois par phase de Tir, chacune de vos figurines peut tirer si elle voit une cible et possède une arme de tir. Il est impossible de tirer en étant engagé au corps à corps, en ayant couru ou raté une charge pendant la phase de Mouvement, ou en s'étant rallié lors du même tour.\n\nPour viser une cible, la figurine doit pouvoir la voir (penchez-vous sur la surface de jeu et mettez-vous dans l'axe de vision de la figurine). Les combattants peuvent voir à 360° et peuvent pivoter dans n'importe quelle direction avant de tirer ; pivoter sur place ne compte pas comme un déplacement.",
      },
      {
        id: 'cible_prioritaire',
        titre: 'Cible prioritaire',
        texte:
          "Vous devez tirer sur l'ennemi le plus proche, car il représente le danger le plus imminent et constitue donc une cible évidente. Vous pouvez toutefois sélectionner une cible plus éloignée si la figurine la plus proche est plus difficile à toucher (couvert), si la cible plus éloignée est une grande cible, ou si les figurines les plus proches sont sonnées, à terre ou en fuite (rien ne vous empêche cependant de les prendre pour cible).\n\nIl est impossible de tirer sur des figurines engagées au corps à corps si des figurines de la même bande que le tireur sont impliquées dans le combat — le risque de toucher un camarade serait trop grand.\n\nTirer depuis une hauteur : une figurine positionnée en hauteur (tout ce qui s'élève à plus de 2ps de la surface de la table) peut choisir librement n'importe quelle cible en vue. Si des ennemis sont présents dans le même bâtiment et en ligne de vue du tireur, il doit toutefois les prendre pour cible en priorité.",
      },
      {
        id: 'portee_de_tir',
        titre: 'Portée de tir',
        texte:
          "Une fois la cible sélectionnée, mesurez la distance qui sépare le tireur de sa cible pour déterminer si vous êtes à portée de tir. Chaque type de projectile possède sa propre portée maximale (voir équipement). Si la cible est hors de portée, le tir est automatiquement raté.",
      },
      {
        id: 'toucher_tir',
        titre: 'Toucher',
        texte:
          "Pour déterminer si un tir atteint sa cible, lancez 1D6. Le résultat nécessaire dépend de la Capacité de Tir (CT) du tireur, modifié par différents facteurs.\n\nÀ noter que si un tir sur une figurine à couvert rate de 1, le tir touche le couvert au lieu de la figurine. Lorsque vous touchez une cible, déterminez si elle est Blessée (voir le chapitre Blessures).",
        tableau: {
          entetes: ['CT', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
          lignes: [['Résultat pour toucher', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3']],
        },
      },
      {
        id: 'modificateurs_pour_toucher_tir',
        titre: 'Modificateurs pour toucher (tir)',
        texte:
          "- Couvert : -1. Si une partie de la cible est occultée par un élément de décor ou une autre figurine, elle est considérée comme étant à couvert.\n- Longue portée : -1. La cible est à plus de la moitié de la portée de l'arme.\n- Bouger et tirer : -1. Le tireur s'est déplacé autrement que pour se relever ou pivoter sur place.\n- Grande cible : +1. La cible a la règle spéciale grande cible ou fait plus de 2ps de haut ou de large.",
      },
      {
        id: 'parties_multi_joueurs_tir',
        titre: 'Parties multi-joueurs (Chaos dans les Rues) — tir',
        texte:
          "Dans une partie impliquant plus de deux bandes, il est possible de tirer dans un corps à corps, tant que le tireur n'appartient pas à la même bande que l'un des protagonistes de la mêlée. Comme d'habitude, les tireurs doivent tirer sur l'ennemi le plus proche, à moins d'être en position de hauteur.\n\nSi le tireur vise une figurine engagée au corps à corps, n'importe quel protagoniste de la mêlée peut être touché : répartissez aléatoirement les touches entre la cible du tir et toutes les figurines engagées au corps à corps contre elle.",
      },
    ],
  },
  {
    id: 'corps_a_corps',
    titre: 'Corps à corps',
    sousRegles: [
      {
        id: 'qui_peut_combattre',
        titre: 'Qui peut combattre',
        texte:
          "Les combats rapprochés sont résolus durant la phase de Corps à Corps, au cours de laquelle toutes les figurines se battent, pas seulement celles du joueur dont c'est le tour. Un guerrier peut affronter des ennemis devant lui, derrière lui et sur ses flancs. Les figurines dont les socles se touchent sont engagées au corps à corps, ce qui ne peut se produire qu'après une charge.\n\nS'il est au contact de plusieurs ennemis, un guerrier peut choisir qui attaquer, et même répartir ses attaques comme il le désire, tant que les cibles sont déterminées avant les jets pour toucher. Les figurines engagées au corps à corps ne peuvent pas tirer (tout tir de pistolet à bout portant est traité comme une attaque de corps à corps).\n\nFigurines à terre, sonnées ou qui se relèvent : les figurines à terre ou sonnées ne peuvent pas riposter (et donc se défendre) au corps à corps. Les figurines qui viennent de se relever ne peuvent pas se désengager et frapperont toujours en dernier, sans tenir compte des armes et de l'Initiative.",
        precisionFaq: "Après le premier tour de corps à corps, il est possible d'échanger une lance ou des pistolets contre d'autres armes (Mordheim Rules Review 2005 p.33).",
      },
      {
        id: 'qui_frappe_en_premier',
        titre: 'Qui frappe en premier',
        texte:
          "Les figurines qui disposent de la capacité frappe en premier (grâce à une charge, certains équipements, etc.) frappent avant tout le monde, par ordre décroissant d'Initiative. Elles sont suivies par les autres belligérants, qui frappent également par ordre d'Initiative. Suivent les figurines qui doivent frapper en dernier (à cause de certains équipements ou autre), toujours dans l'ordre décroissant d'Initiative. Enfin, les figurines qui se sont relevées lors de la phase de Ralliement frappent en tout dernier.\n\nDans tous les cas, les ex æquo sont départagés en lançant 1D6.",
      },
      {
        id: 'toucher_ennemi',
        titre: "Toucher l'ennemi",
        texte:
          "Pour savoir si vous touchez, lancez 1D6 pour chaque attaque de chaque figurine engagée au corps à corps. Le résultat à obtenir dépend des Capacités de Combat (CC) respectives : comparez la CC de l'attaquant avec celle de son adversaire pour connaître le résultat minimum à obtenir pour toucher.",
        tableau: {
          entetes: ['CC attaquant \\ CC adversaire', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
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
        titre: 'Manier deux armes',
        texte:
          "Un guerrier équipé de deux armes à une main bénéficie d'une attaque supplémentaire avec son arme additionnelle. Ce bonus s'ajoute au total d'attaques, après tout autre modificateur, tel que la frénésie.\n\nS'il porte deux armes différentes, il fera une attaque avec l'arme de son choix et toutes les autres avec la seconde. Lancez pour toucher et pour blesser séparément pour chaque arme.",
      },
      {
        id: 'parade',
        titre: 'Parade',
        texte:
          "Un guerrier en possession d'un équipement avec la règle spéciale parade (une rondache ou une épée par exemple) peut tenter de parer un coup asséné par son adversaire. Lancez 1D6 : si le résultat est supérieur au meilleur résultat obtenu par votre adversaire pour toucher, vous avez dévié le coup. Un coup paré est ignoré et n'a aucun effet.\n\n- Une seule touche peut être parée par phase de Corps à Corps.\n- Une figurine qui se bat contre plusieurs adversaires ne peut parer que la première touche réussie.\n- Une figurine équipée d'une rondache et d'une épée peut relancer une fois toute parade ratée.\n- Une figurine armée de deux épées ne bénéficie pas de relance de parade.\n- Il est impossible de parer un coup ayant obtenu un 6 pour toucher.\n- Il est impossible de parer une attaque dont la Force est supérieure ou égale au double de sa propre Force de base : elle est trop puissante pour être bloquée.",
      },
      {
        id: 'cible_a_terre_ou_sonnee',
        titre: 'Cible à terre ou sonnée',
        texte:
          "Cible à terre : toutes les attaques contre un guerrier à terre touchent automatiquement. Si l'une d'elles blesse la figurine à terre et que celle-ci rate sa sauvegarde, elle est immédiatement mise hors de combat. Il est impossible de parer en étant à terre.\n\nCible sonnée : un guerrier sonné est à la merci de ses ennemis — une figurine sonnée est automatiquement mise hors de combat si un ennemi l'attaque au corps à corps.\n\nUne figurine ayant plusieurs attaques ne peut pas sonner/mettre à terre puis mettre automatiquement hors de combat un guerrier lors de la même phase de Corps à Corps. La seule manière d'y parvenir est d'avoir plusieurs figurines attaquant le même ennemi : si l'ennemi est sonné/mis à terre par le premier attaquant, il peut être frappé et mis hors de combat par le suivant. Si votre figurine est engagée contre un ennemi encore debout, elle ne peut pas attaquer d'autres figurines sonnées ou à terre, puisqu'elles ne représentent plus un danger immédiat et que leurs compagnons tentent de les protéger.",
      },
      {
        id: 'quitter_un_combat',
        titre: 'Quitter un combat',
        texte:
          "Une fois engagée au corps à corps, une figurine ne peut plus quitter un combat lors de sa phase de Mouvement. Les figurines sont engagées jusqu'à ce qu'elles soient hors de combat, que leurs ennemis soient terrassés (à terre, sonnés ou hors de combat) ou que l'un des protagonistes prenne la fuite.",
      },
      {
        id: 'fuir_le_combat',
        titre: 'Fuir le combat',
        texte:
          "Un guerrier pris de panique pendant un corps à corps prendra la fuite comme indiqué dans le chapitre Commandement et Psychologie. Il se retourne pour prendre ses jambes à son cou ; ses adversaires lui infligent alors chacun 1 touche automatique, résolue immédiatement. Un guerrier ne peut pas fuir un combat de son plein gré.",
      },
      {
        id: 'parties_multi_joueurs_cac',
        titre: 'Parties multi-joueurs (Chaos dans les Rues) — corps à corps',
        texte:
          "Lors des parties multi-joueurs, il arrive qu'un guerrier soit chargé par des figurines de deux bandes adverses ou plus. Dans ce cas, la figurine se bat lors de la phase de Corps à Corps de chaque adversaire qu'elle affronte. Cela lui donne un grand nombre d'attaques lors d'un tour global de jeu, mais il est peu probable que cela lui permette de s'en tirer !",
      },
    ],
  },
  {
    id: 'blessures',
    titre: 'Blessures',
    sousRegles: [
      {
        id: 'jet_pour_blesser',
        titre: 'Jet pour blesser',
        texte:
          "Lorsque vous touchez une cible, vous devez faire un test pour voir si une Blessure est infligée. Comparez la Force (de l'arme pour un tir, du combattant pour le corps à corps) avec l'Endurance de la cible et lancez 1D6. Un trait (–) indique que la cible ne peut être blessée.",
        tableau: {
          entetes: ['Force \\ Endurance', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
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
        titre: 'Coups Critiques',
        texte:
          "Si vous obtenez un 6 pour blesser (au corps à corps ou au tir uniquement), vous infligez un Coup Critique : lancez 1D6 et consultez le tableau ci-dessous.\n\nSi l'attaquant ne peut normalement blesser sa cible que sur des 6, il ne peut pas causer de Coup Critique. Un guerrier ne peut causer qu'un seul Coup Critique par phase de Corps à Corps, infligé par le premier 6 obtenu. Si un Coup Critique inflige plus d'une Blessure et si l'arme de l'attaquant cause des Blessures multiples, ne prenez en compte que celui des deux facteurs qui cause le plus de Dégâts.",
        tableau: {
          entetes: ['D6', 'Effet'],
          lignes: [
            ['1-2', 'Organe vital. 2 Blessures, avec Sauvegarde.'],
            ['3-4', 'Partie découverte. 2 Blessures, sans Sauvegarde.'],
            ['5-6', 'Coup de maître ! 2 Blessures, sans Sauvegarde, Dégâts +2.'],
          ],
        },
      },
      {
        id: 'armure',
        titre: 'Armure',
        texte:
          "Si un guerrier revêtu d'une armure subit une Blessure, lancez 1D6. Le résultat à obtenir varie selon le type d'armure. Si le test est réussi, le coup a été dévié par l'armure sans dommages.\n\nExemple : Dieter porte une armure lourde et un bouclier. Sa sauvegarde est donc de 4+. Il est touché par une arbalète (Force 4) et réussira sa sauvegarde d'armure sur un 5+ sur 1D6 (4+ – 1 = 5+).",
        tableau: {
          entetes: ['Armure', 'Résultat minimum pour sauvegarder'],
          lignes: [
            ['Armure légère', '6+'],
            ['Armure lourde', '5+'],
            ['Armure en gromril', '4+'],
            ['Bouclier', 'Sauvegarde +1'],
          ],
        },
      },
      {
        id: 'modificateurs_de_sauvegarde',
        titre: 'Modificateurs de sauvegarde',
        texte:
          "Certaines armes pénètrent mieux les armures que d'autres : plus la Force d'une arme est élevée, plus elle traverse facilement les armures. Certaines armes ont un pouvoir de pénétration plus important par rapport à leur Force (comme les haches ou les arcs elfiques) — indiqué le cas échéant dans la description de l'arme.",
        tableau: {
          entetes: ['Force', '1-3', '4', '5', '6', '7', '8', '9+'],
          lignes: [['Malus de sauvegarde', '–', '-1', '-2', '-3', '-4', '-5', '-6']],
        },
      },
      {
        id: 'jet_de_degats',
        titre: 'Jet de Dégâts',
        texte:
          "Si une cible possède plusieurs Points de Vie (PV), retirez-lui-en un à chaque fois qu'elle subit une Blessure. Tant que la figurine conserve au moins 1 PV, elle peut continuer à se battre.\n\nDès que les PV d'un guerrier tombent à zéro, le joueur qui a fait perdre le dernier PV lance 1D6 pour la Blessure qui a amené la figurine à 0 PV et pour chaque PV perdu en plus. Appliquez le résultat le plus élevé.",
        tableau: {
          entetes: ['D6', 'Effet'],
          lignes: [
            ['1-2', 'À terre.'],
            ['3-4', 'Sonné.'],
            ['5-6', 'Hors de combat.'],
          ],
        },
      },
      {
        id: 'a_terre',
        titre: 'À terre',
        texte:
          "La force du coup jette le combattant au sol. Placez la figurine sur le dos pour montrer qu'elle a été mise à terre.\n\nUne figurine à terre peut ramper de 2ps pendant la phase de Mouvement, mais uniquement si son adversaire est engagé au corps à corps avec un autre combattant (sinon elle doit rester sur place). Une figurine à terre ne peut pas tirer, lancer de sorts, ni riposter (et donc se défendre) au corps à corps.\n\nElle peut se relever lors de la phase de Ralliement de son prochain tour : elle pourra alors se déplacer à demi-vitesse, tirer et lancer des sorts, mais ne pourra ni charger ni courir. Si elle était engagée au corps à corps, elle ne pourra pas se désengager et frappera toujours en dernier, sans tenir compte des armes et de l'Initiative. Après ce tour, elle pourra bouger et combattre normalement.\n\nUne figurine qui affronte un guerrier à terre peut lui donner le coup de grâce : toutes les attaques contre lui touchent automatiquement ; s'il est blessé et rate sa sauvegarde, il est immédiatement mis hors de combat. Il est impossible de parer en étant à terre.\n\nSi une figurine est mise à terre à moins d'1ps d'un bord de toit ou de bâtiment, elle risque de glisser et tomber : faites un test d'Initiative, en cas d'échec elle tombe et subit des dommages (voir Chute).",
      },
      {
        id: 'sonne',
        titre: 'Sonné',
        texte:
          "La victime s'écroule, blessée et à peine consciente. Placez la figurine sur le ventre pour montrer qu'elle a été sonnée. Une figurine sonnée ne peut rien faire du tout. Le joueur pourra tourner la figurine sur le dos lors de la prochaine phase de Ralliement et le guerrier sera alors traité comme étant à terre.\n\nUn guerrier sonné est à la merci de ses ennemis : une figurine sonnée est automatiquement mise hors de combat si elle est attaquée au corps à corps.\n\nSi une figurine est sonnée à moins d'1ps d'un bord de toit ou de bâtiment, elle risque de tomber : faites un test d'Initiative, en cas d'échec elle tombe et subit des dommages (voir Chute).",
      },
      {
        id: 'hors_de_combat',
        titre: 'Hors de combat',
        texte:
          "La cible a été sérieusement blessée et perd connaissance. Un guerrier hors de combat est éliminé : retirez la figurine de la table. Il est impossible pour le moment de dire s'il est vivant ou mort, mais cela est sans importance pour la suite de la partie.\n\nAprès la bataille, vous pourrez déterminer s'il survit et s'il conserve des séquelles de ses blessures (voir la séquence post-bataille et les Blessures Graves pour plus de détails).",
      },
    ],
  },
  {
    id: 'psychologie',
    titre: 'Commandement et Psychologie',
    sousRegles: [
      {
        id: 'test_de_deroute',
        titre: 'Test de Déroute',
        texte:
          "Un joueur doit faire un test de Déroute au début de son tour si le quart (25%) ou plus de sa bande est hors de combat. Même les bandes habituellement immunisées à la psychologie (comme les Morts-Vivants) doivent faire le test.\n\nSi le test est raté, la bande perd la bataille automatiquement et la partie prend fin immédiatement. Pour effectuer le test, lancez 2D6 : si le score est inférieur ou égal au Commandement du Chef de bande, le joueur peut continuer le combat. Si le Chef est hors de combat ou sonné, utilisez le Cd le plus haut parmi les guerriers qui ne sont ni sonnés ni hors de combat.\n\nUn joueur peut volontairement abandonner le combat au début de n'importe lequel de ses tours, mais seulement s'il a déjà dû effectuer un test de Déroute ou si au moins 25% de ses figurines sont hors de combat.\n\nParties multi-joueurs (Chaos dans les Rues) : si l'une des bandes rate un test de Déroute (ou si tous ses membres sont hors de combat), la partie n'est pas forcément terminée. À moins que des conditions de victoire spéciales ne soient stipulées dans le scénario, une partie multi-joueurs continue jusqu'à ce qu'il ne reste plus qu'une seule bande sur la table.",
      },
      {
        id: 'chefs',
        titre: 'Chefs',
        texte:
          "Une figurine à moins de 6ps de son Chef peut utiliser le Commandement de ce dernier pour ses tests de Cd. Cela représente la capacité du Chef à encourager ses guerriers pour qu'ils dépassent leurs limites. Un Chef ne peut pas conférer ce bonus s'il est à terre, sonné ou en fuite.",
      },
      {
        id: 'seul_contre_tous',
        titre: 'Seul contre tous',
        texte:
          "Un combattant qui se bat seul contre deux adversaires ou plus, sans aucune figurine amie à moins de 6ps (celles qui sont à terre, sonnées ou en fuite ne comptent pas), doit faire un test de Cd avec 2D6 à la fin de sa phase de Corps à Corps.\n\n- 4 : le guerrier tient bon.\n- 8 : le guerrier rompt le combat et prend la fuite (chaque adversaire fait une touche automatique).\n\nSi la figurine survit, elle parcourt immédiatement 2D6ps dans la direction opposée à celle de ses adversaires.",
      },
      {
        id: 'fuite',
        titre: 'Fuite',
        texte:
          "Une figurine en fuite doit faire un autre test de Cd à la phase de Ralliement :\n\n- 4 : la figurine s'arrête, mais ne peut rien faire d'autre que lancer des sorts pendant son tour.\n- 8 : la figurine court de 2D6ps vers le bord de table le plus proche en évitant toute figurine ennemie. Si elle atteint le bord de table, elle est retirée du jeu.\n\nSi une figurine est chargée pendant qu'elle fuit, l'attaquant est mis au contact comme d'habitude, mais le fuyard avance à nouveau de 2D6ps vers le bord de table avant qu'il puisse être frappé.",
      },
      {
        id: 'frenesie',
        titre: 'Frénésie',
        texte:
          "Les figurines frénétiques doivent toujours charger si un ennemi est à portée (vérifiez après les déclarations de charge). Elles doublent leur caractéristique Attaques (si un guerrier manie une arme de chaque main, il bénéficie de +1 Attaque comme d'habitude ; cette attaque additionnelle n'est jamais doublée).\n\nUne fois à portée de charge, les guerriers frénétiques sont immunisés à toute autre règle de psychologie (comme la peur), et n'ont à effectuer aucun test de psychologie tant qu'ils restent à distance de charge.\n\nSi une figurine frénétique est mise à terre ou sonnée, elle perd sa frénésie et doit se battre normalement pour le reste de la bataille.",
      },
      {
        id: 'haine',
        titre: 'Haine',
        texte:
          "Les guerriers qui affrontent au corps à corps des ennemis qu'ils haïssent peuvent relancer leurs attaques ratées lors du premier tour de chaque combat. Cette impétuosité initiale retombe après le premier tour de corps à corps et le combat se déroule ensuite normalement jusqu'à la fin.",
      },
      {
        id: 'peur',
        titre: 'Peur',
        texte:
          "Une figurine doit passer un test de peur (un test de Commandement) dans les situations suivantes. Notez que les créatures qui provoquent la peur n'ont pas à faire de tels tests.\n\na) Si la figurine est chargée par un guerrier ou une créature provoquant la peur (test effectué lorsque la charge est déclarée et s'avère ne pas être ratée) :\n- 4 : la figurine se bat normalement.\n- 8 : elle doit obtenir des 6 pour toucher lors de ce tour de combat.\n\nb) Si la figurine désire charger un ennemi qui provoque la peur (test pour réussir à charger) :\n- 4 : la figurine se bat normalement.\n- 8 : elle ne peut pas charger et reste immobile pour le tour (charge ratée).",
        precisionFaq:
          "Une figurine chargée par plusieurs combattants provoquant la peur doit faire un test pour chaque charge déclarée. Dès qu'un test est raté, il n'est plus nécessaire de faire les tests de peur suivants : elle doit obtenir des 6 pour toucher lors de ce tour de combat, quelle que soit sa cible (Mordheim Rules Review 2005 p.33).",
      },
      {
        id: 'stupidite',
        titre: 'Stupidité',
        texte:
          "Les figurines stupides doivent faire un test de Commandement au début de leur tour. Lancez 2D6 :\n\n- 4 : la créature se déplace et combat normalement.\n- 8 : la créature ne peut pas frapper au corps à corps (l'ennemi devra quand même effectuer normalement ses jets pour toucher) ni lancer de sorts. Si elle n'est pas engagée au corps à corps, lancez 1D6 :\n  - 1-3 : la créature avance tout droit, à demi-vitesse. Elle ne peut pas charger (arrêtez son déplacement à 1ps d'une figurine avec laquelle elle entrerait en contact). Elle peut tomber d'un bâtiment ou dans un trou, ou rencontrer un obstacle, auquel cas elle s'arrête. Elle ne peut pas tirer durant ce tour.\n  - 4-6 : la créature reste inactive et se contente de baver pendant ce tour. Elle ne peut rien faire d'autre.\n\nQue le test soit réussi ou non, le résultat s'applique jusqu'au début du prochain tour de la créature, où elle devra faire un nouveau test de Stupidité.",
      },
    ],
  },
];

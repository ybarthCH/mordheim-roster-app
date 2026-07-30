// Tableau d'Exploration — événements liés aux doubles/triples/quadruples/
// quintuples/sextuples obtenus sur les dés d'exploration (voir Procédure
// d'exploration, chapitre Revenus). Transcrit depuis le livret. Ces
// événements s'ajoutent au résultat de base (fragments de wyrdstone) déjà
// géré par tableExplorationWyrdstone.ts — ils sont indépendants et peuvent
// se cumuler avec lui sur le même jet.

// Objet trouvé directement ajoutable au stock de la bande (voir
// EvenementExploration/AjouterObjetTrouveButton), en un clic plutôt qu'en
// rouvrant la liste d'achat pour retrouver l'objet correspondant.
export type LigneObjetTrouve = {
  // Doit exister dans la base commune (src/data/items/*.json).
  item_id: string;
  // Nombre fixe (défaut 1), ou notation de dés (ex : "D3") si la quantité
  // exacte dépend d'un jet à reporter depuis la table papier — jamais lancé
  // par l'app, comme `or` ci-dessous.
  quantite?: number | string;
};

// Résultat d'une sous-table à un seul jet de D6 (ex : Cadavre, Forge...).
export type LigneSousTableD6 = {
  min: number;
  max: number;
  resultat: string;
  // Notation de dés si ce résultat précis est un gain d'or automatisable
  // (ex : "D6", "2D6") — le joueur reporte le total obtenu sur sa table
  // papier, jamais lancé par l'app (comme partout ailleurs dans l'outil).
  or?: string;
  // Objet(s) trouvé(s) correspondant à ce résultat. Plusieurs entrées =
  // objets alternatifs (ex : Bouclier OU Rondache) affichés côte à côte, pas
  // cumulatifs : le joueur clique celui qu'il a choisi sur table papier.
  objets?: LigneObjetTrouve[];
};

// Élément d'une sous-table "trésor" (Trésor caché, Bande massacrée) : chaque
// élément est déterminé indépendamment via un jet à seuil séparé, sauf
// mention "Auto" (toujours obtenu).
export type LigneTresorConditionnel = {
  element: string;
  seuil: string;
};

export type EvenementExploration = {
  id: string;
  face: number;
  nom: string;
  // Texte d'ambiance (en italique dans le livret).
  texte: string;
  // Texte des règles, un paragraphe par entrée de tableau.
  regle: string[];
  // Sous-table à un seul jet de D6, si l'événement en propose une.
  sousTable?: LigneSousTableD6[];
  // Sous-table "trésor" à seuils indépendants par élément.
  sousTableTresor?: LigneTresorConditionnel[];
  // Gain d'or automatisable directement lié à l'événement (hors sous-table).
  or?: string;
  // Renvoie vers le Tableau des artefacts magiques (voir items/artefacts_magiques.json).
  artefactMagique?: boolean;
};

export type PalierExploration = {
  id: 'doubles' | 'triples' | 'quadruples' | 'quintuples' | 'sextuples';
  label: string;
  nombreDes: number;
  evenements: EvenementExploration[];
};

export const TABLE_EXPLORATION_EVENEMENTS: PalierExploration[] = [
  {
    id: 'doubles',
    label: 'Doubles',
    nombreDes: 2,
    evenements: [
      {
        id: 'puits',
        face: 1,
        nom: 'Puits',
        texte:
          "Les puits publics - Mordheim en comptait plusieurs - étaient surmontés de toits soutenus par des piliers décorés de sculptures et de fontaines. La cité était fière de son magnifique réseau de distribution d'eau. Hélas, comme tous les autres puits, celui-ci est délabré et sans nul doute pollué par la pierre magique.",
        regle: [
          "Choisissez un de vos héros et lancez 1D6. Si le résultat est inférieur ou égal à son Endurance, il trouve un fragment de pierre magique au fond du puits. Sinon, le héros avale de l'eau impure, tombe malade et doit manquer la prochaine partie.",
        ],
      },
      {
        id: 'echoppe',
        face: 2,
        nom: 'Échoppe',
        texte:
          "Cette échoppe de la guilde des marchands a déjà été pillée. Malgré tout, quelques objets traînent encore ici et là dans les débris. Certains sont utiles comme des pots de fer et des rouleaux de tissu. De petits bibelots de toutes sortes sont également éparpillés dans la pièce, mais leur utilité est limitée dans une cité dévastée et presque déserte.",
        regle: [
          "Après une fouille minutieuse, vous trouvez D6 CO de butin. Sur un 1 vous trouvez aussi un Porte-bonheur (voir le chapitre Équipement page 53).",
        ],
        or: 'D6',
      },
      {
        id: 'cadavre',
        face: 3,
        nom: 'Cadavre',
        texte:
          "Vous trouvez un cadavre encore chaud, une dague ébréchée plantée dans le dos. Étonnamment, ses biens n'ont pas été dérobés.",
        regle: ['Lancez 1D6 pour savoir ce que vous trouvez sur le cadavre lorsque vous le fouillez :'],
        sousTable: [
          { min: 1, max: 2, resultat: 'D6 CO', or: 'D6' },
          { min: 3, max: 3, resultat: 'Dague', objets: [{ item_id: 'dague' }] },
          { min: 4, max: 4, resultat: 'Hache', objets: [{ item_id: 'hache' }] },
          { min: 5, max: 5, resultat: 'Épée', objets: [{ item_id: 'epee' }] },
          { min: 6, max: 6, resultat: 'Armure légère', objets: [{ item_id: 'armure_legere' }] },
        ],
      },
      {
        id: 'vagabond',
        face: 4,
        nom: 'Vagabond',
        texte:
          "Votre bande rencontre l'un des survivants de Mordheim, qui a depuis longtemps perdu la raison en même temps que tous ses biens.",
        regle: [
          "Les bandes de skavens peuvent vendre le vagabond pour 2D6 CO aux agents du clan Eshin (qui le mangeront ou en feront un esclave).",
          "Les bandes de Possédés peuvent sacrifier le malheureux à la gloire des dieux du Chaos. Le chef de la bande gagne +1pt d'expérience.",
          'Les bandes de morts-vivants peuvent le tuer et en faire gratuitement un zombie.',
          "Les autres bandes peuvent interroger le vagabond sur la ville. Au prochain jet sur le Tableau d'Exploration, lancez un dé en plus, et annulez un des résultats de votre choix. (Par exemple, si vous avez trois héros, lancez quatre dés et gardez les trois résultats de votre choix.)",
        ],
      },
      {
        id: 'carrosse_retourne',
        face: 5,
        nom: 'Carrosse retourné',
        texte:
          "Un carrosse retourné est coincé dans un portail écroulé. Il s'agit d'un carrosse couvert, du genre de ceux qu'utilisent les nobles pour aller de la cité à leur propriété à la campagne. Que fait-il ici, puisque tous les gens importants sont partis depuis bien longtemps ?",
        regle: ['Lancez 1D6 pour savoir ce que vous trouvez :'],
        sousTable: [
          {
            min: 1,
            max: 2,
            resultat: 'Carte de Mordheim (voir Équipement)',
            objets: [{ item_id: 'carte_de_mordheim' }],
          },
          { min: 3, max: 4, resultat: 'Une bourse contenant 2D6 CO', or: '2D6' },
          {
            min: 5,
            max: 6,
            resultat:
              "Une épée et une dague incrustées de joyaux. Vous pouvez les garder ou les vendre. Vous tirerez 10 CO de l'épée et 2 CO de la dague — le double du prix de vente habituel (consultez le chapitre Commerce pour les règles sur la vente d'objets).",
          },
        ],
      },
      {
        id: 'masures_delabrees',
        face: 6,
        nom: 'Masures délabrées',
        texte:
          "La rue est bordée de masures délabrées à l'allure plutôt instable. Il n'y a pas grand-chose à piller dans les environs.",
        regle: ['Vous trouvez D6 CO de butin dans les ruines.'],
        or: 'D6',
      },
    ],
  },
  {
    id: 'triples',
    label: 'Triples',
    nombreDes: 3,
    evenements: [
      {
        id: 'taverne',
        face: 1,
        nom: 'Taverne',
        texte:
          "Vous identifiez les ruines d'une taverne grâce à l'enseigne qui n'est pas encore tombée du mur. La partie supérieure est effondrée, mais les caves taillées à même la roche contiennent encore des tonneaux intacts.",
        regle: [
          'Vous pourriez aisément vendre les tonneaux et leur contenu pour un bon prix, hélas vos hommes sont des soiffards ! Le chef de la bande doit effectuer un test de Commandement. S\'il le réussit, la bande gagne immédiatement 4D6 CO en vendant les breuvages alcoolisés.',
          "En cas d'échec, les hommes vident la plupart des tonneaux malgré les menaces et les malédictions du chef. Le peu d'alcool qui vous reste rapporte D6 CO lorsque la bande rejoint son campement.",
          'Les morts-vivants, les Répurgateurs et les Sœurs de Sigmar réussissent automatiquement le test car un vulgaire breuvage alcoolisé ne les intéresse pas.',
        ],
      },
      {
        id: 'forge',
        face: 2,
        nom: 'Forge',
        texte:
          "Le fourneau et l'enclume renversée indiquent clairement la fonction passée de ce lieu. Le fer et les outils ont été volés depuis longtemps, le charbon et les scories jonchent le sol, mais il reste peut-être des armes parmi les décombres.",
        regle: ['Lancez 1D6 pour savoir ce que vous trouvez :'],
        sousTable: [
          { min: 1, max: 1, resultat: 'Épée', objets: [{ item_id: 'epee' }] },
          { min: 2, max: 2, resultat: 'Arme à deux mains', objets: [{ item_id: 'arme_a_deux_mains' }] },
          { min: 3, max: 3, resultat: 'Fléau', objets: [{ item_id: 'fleau' }] },
          { min: 4, max: 4, resultat: 'D3 Hallebardes', objets: [{ item_id: 'hallebarde', quantite: 'D3' }] },
          { min: 5, max: 5, resultat: 'Lance de cavalerie', objets: [{ item_id: 'lance_de_cavalerie' }] },
          { min: 6, max: 6, resultat: '2D6 CO de métal (ajoutez la valeur à votre magot)', or: '2D6' },
        ],
      },
      {
        id: 'prisonniers',
        face: 3,
        nom: 'Prisonniers',
        texte:
          "Un bruit étouffé provient d'un bâtiment proche, à l'intérieur duquel vous découvrez un groupe d'individus bien habillés enfermés dans une cave. Il s'agit peut-être de captifs que les sectateurs qui attendaient là à être sacrifiés lors de la Geheimnisnacht.",
        regle: [
          'Les bandes de Possédés peuvent sacrifier les victimes (finissant sans doute ainsi le travail des ravisseurs). Ils gagnent D3 points d\'expérience répartis entre les héros de la bande.',
          'Les bandes de morts-vivants peuvent tuer les prisonniers et gagner D3 zombies gratuitement.',
          'Les skavens peuvent vendre les prisonniers comme esclaves pour 3D6 CO.',
          "Les autres bandes peuvent escorter les prisonniers hors de la cité et recevoir une récompense de 2D6 CO. De plus, l'un des captifs décide de se joindre à la bande. Si vous avez le matériel nécessaire pour équiper la recrue, vous pouvez ajouter un nouvel homme de main dans n'importe quel groupe humain de votre bande (avec le même profil que le reste du groupe, même s'ils ont déjà progressé).",
        ],
      },
      {
        id: 'atelier_facteur_arc',
        face: 4,
        nom: "Atelier de facteur d'arc",
        texte:
          "Cette masure était jadis l'atelier d'un fabricant d'arcs et de flèches. Le sol est jonché de fagots de bois d'if et de saule.",
        regle: ['Lancez 1D6 pour savoir ce que vous trouvez :'],
        sousTable: [
          { min: 1, max: 2, resultat: 'D3 Arcs courts', objets: [{ item_id: 'arc_court', quantite: 'D3' }] },
          { min: 3, max: 3, resultat: 'D3 Arcs', objets: [{ item_id: 'arc', quantite: 'D3' }] },
          { min: 4, max: 4, resultat: 'D3 Arcs longs', objets: [{ item_id: 'arc_long', quantite: 'D3' }] },
          {
            min: 5,
            max: 5,
            resultat: 'Carquois de flèches de chasse',
            objets: [{ item_id: 'fleches_de_chasse' }],
          },
          { min: 6, max: 6, resultat: 'D3 Arbalètes', objets: [{ item_id: 'arbalete', quantite: 'D3' }] },
        ],
      },
      {
        id: 'marche_couvert',
        face: 5,
        nom: 'Marché couvert',
        texte:
          "La halle où se faisaient les échanges de grain a été construite sur des piliers, au-dessus de la place du marché. L'étage supérieur est très endommagé mais constitue encore un bon abri. Ce qui reste du dernier jour de marché, surtout des pots cassés et des récipients de fer, recouvre encore les étals.",
        regle: ['Vous découvrez plusieurs objets ayant une valeur totale de 2D6 CO.'],
        or: '2D6',
      },
      {
        id: 'debiteur_reconnaissant',
        face: 6,
        nom: 'Débiteur reconnaissant',
        texte:
          'Alors que vous retournez vers votre campement, vous croisez une vieille connaissance. L\'homme est venu vous rembourser une vieille faveur ou dette.',
        regle: [
          "Vous gagnez les services gratuits de n'importe quel Franc-tireur (choisissez parmi ceux qui sont accessibles à votre bande) pour la durée de la prochaine bataille. Ensuite, il repart à moins que vous vouliez continuer à le payer comme d'habitude. Consultez le chapitre Francs-tireurs à la page 147.",
        ],
      },
    ],
  },
  {
    id: 'quadruples',
    label: 'Quadruples',
    nombreDes: 4,
    evenements: [
      {
        id: 'fabrique_armes_a_feu',
        face: 1,
        nom: "Fabrique d'armes à feu",
        texte:
          "Vous trouvez l'atelier d'un nain fabricant d'armes à poudre noire. Les portes ont été défoncées et les chambres pillées, mais quelques coffres métalliques sont intacts.",
        regle: ['Lancez 1D6 pour savoir ce que vous trouvez :'],
        sousTable: [
          { min: 1, max: 1, resultat: 'Tromblon', objets: [{ item_id: 'tromblon' }] },
          { min: 2, max: 2, resultat: 'Paire de pistolets', objets: [{ item_id: 'pistolet', quantite: 2 }] },
          {
            min: 3,
            max: 3,
            resultat: 'Paire de pistolets de duel',
            objets: [{ item_id: 'pistolet_de_duel', quantite: 2 }],
          },
          { min: 4, max: 4, resultat: 'D3 Arquebuses', objets: [{ item_id: 'arquebuse', quantite: 'D3' }] },
          {
            min: 5,
            max: 5,
            resultat: 'D3 Poires de poudre noire supérieure',
            objets: [{ item_id: 'poudre_noire_superieure', quantite: 'D3' }],
          },
          {
            min: 6,
            max: 6,
            resultat: "Long fusil d'Hochland",
            objets: [{ item_id: 'long_fusil_du_hochland' }],
          },
        ],
      },
      {
        id: 'temple',
        face: 2,
        nom: 'Temple',
        texte:
          "Votre bande découvre un temple en si mauvais état qu'il est difficile de dire quel dieu y était adoré. Quelques parcelles de fresques sont encore visibles sur les murs, mais elles ont été dégradées par des hérétiques. Des fragments de statues brisées gisent parmi les décombres, certains objets semblent avoir été jadis recouverts de feuilles d'or qui ont en grande partie été grattées depuis.",
        regle: [
          'Votre bande peut piller le temple et gagner pour 3D6 CO de butin.',
          "Les Sœurs de Sigmar ou les Répurgateurs peuvent récupérer quelques reliques saintes du temple. Ils gagnent alors 3D6 CO ainsi qu'une bénédiction des dieux. Une de leurs armes (au choix du joueur) est à présent bénie et blesse toujours toutes les figurines de morts-vivants (hormis les goules, les nécromanciens et les parias) et de possédés (hormis les initiés et les hommes-bêtes) sur un jet pour blesser de 2+.",
        ],
        or: '3D6',
      },
      {
        id: 'hotel_particulier',
        face: 3,
        nom: 'Hôtel particulier',
        texte:
          "Cette maison de trois étages faisait jadis partie d'un pâté de maisons surplombant une ruelle étroite. La rue est à présent dévastée mais cette maison reste en grande partie intacte. En l'explorant, vous découvrez que la mansarde s'avance tellement au-dessus de la ruelle que vous pouvez sortir par la fenêtre pour pénétrer dans la maison d'en face.",
        regle: ['Votre bande trouve pour 3D6 CO de butin.'],
        or: '3D6',
      },
      {
        id: 'armurerie',
        face: 4,
        nom: 'Armurerie',
        texte:
          "Une cuirasse pendue à une perche attire votre attention sur ce lieu. L'atelier est en ruine et la forge a été dévastée. En fouillant les décombres, vous trouvez divers éléments d'armure à moitié finis.",
        regle: ['Lancez 1D6 pour savoir ce que vous trouvez :'],
        sousTable: [
          {
            min: 1,
            max: 2,
            resultat: 'D3 Boucliers ou rondaches (au choix)',
            objets: [
              { item_id: 'bouclier', quantite: 'D3' },
              { item_id: 'rondache', quantite: 'D3' },
            ],
          },
          { min: 3, max: 3, resultat: 'D3 Casques', objets: [{ item_id: 'casque', quantite: 'D3' }] },
          {
            min: 4,
            max: 4,
            resultat: 'D3 Armures légères',
            objets: [{ item_id: 'armure_legere', quantite: 'D3' }],
          },
          {
            min: 5,
            max: 5,
            resultat: 'D3 Armures lourdes',
            objets: [{ item_id: 'armure_lourde', quantite: 'D3' }],
          },
          {
            min: 6,
            max: 6,
            resultat: 'Armure en ithilmar',
            objets: [{ item_id: 'armure_en_ithilmar_market' }],
          },
        ],
      },
      {
        id: 'cimetiere',
        face: 5,
        nom: 'Cimetière',
        texte:
          "Vous trouvez un vieux cimetière dont les nombreuses sépultures, aux monuments sinistres et décorés de gargouilles, sont recouvertes de végétation. Le fer forgé a été arraché de certaines tombes et les pierres ont été renversées. Il semble que certaines cryptes ont déjà reçu la visite de profanateurs.",
        regle: [
          'Toute bande sauf les Répurgateurs et les Sœurs de Sigmar peut piller les cryptes et les tombes pour gagner D6x10 CO de butin. Si vous décidez de piller le cimetière, la bande ennemie entière haïra toutes vos figurines lors de la prochaine partie que vous jouerez contre des Sœurs de Sigmar ou des Répurgateurs. Notez cela sur votre feuille de bande.',
          'Les Sœurs de Sigmar et les Répurgateurs peuvent refermer les tombes. Ils seront récompensés de leur piété par D6 points d\'expérience répartis entre les héros de la bande.',
        ],
        or: 'D6x10',
      },
      {
        id: 'catacombes',
        face: 6,
        nom: 'Catacombes',
        texte: 'Vous trouvez une entrée vers les catacombes et les tunnels qui s\'étendent sous Mordheim.',
        regle: [
          'Vous pouvez utiliser les nouveaux tunnels que vous venez de découvrir lors de la prochaine bataille que vous jouez. Déployez jusqu\'à trois guerriers au niveau du sol (ni rats-ogres ni possédés), n\'importe où sur le champ de bataille. Ils sont placés à la fin du premier tour du joueur et ne peuvent pas se trouver dès le début à moins de 8ps d\'une figurine ennemie.',
          "Ceci représente les guerriers qui s'infiltrent à travers les lignes ennemies et empruntent les souterrains pour surprendre leurs ennemis.",
        ],
      },
    ],
  },
  {
    id: 'quintuples',
    label: 'Quintuples',
    nombreDes: 5,
    evenements: [
      {
        id: 'maison_usurier',
        face: 1,
        nom: "Maison d'usurier",
        texte:
          "Un grand manoir bâti en pierre de taille a plutôt bien résisté au cataclysme. Des armoiries ornent le portail, mais elles ont été vandalisées et ne sont plus identifiables. La porte a été défoncée à coups de hache et ce qu'il en reste est encore suspendu aux charnières.",
        regle: ["A l'intérieur, vous trouvez D6x10 CO à ajouter à votre magot parmi les décombres."],
        or: 'D6x10',
      },
      {
        id: 'laboratoire_alchimiste',
        face: 2,
        nom: "Laboratoire d'alchimiste",
        texte:
          "Un escalier étroit mène à une sorte de crypte qui fut autrefois un laboratoire d'alchimiste. L'enseigne ne tient plus que par une des attaches au-dessus de l'entrée. Le bâtiment semble avoir été utilisé pendant des siècles mais n'a pas très bien résisté au cataclysme. Les dalles du sol sont gravées d'étranges symboles et des cartes et des symboles astrologiques sont peints sur les murs.",
        regle: [
          "Vous trouvez 3D6 CO dans les ruines ainsi qu'un vieux calepin. L'un de vos héros peut l'étudier : le savoir qu'il trouve lui permet de choisir dans la liste de compétences d'érudition en plus de ses listes habituelles lorsqu'un jet de progression lui fait gagner une nouvelle compétence.",
        ],
        or: '3D6',
      },
      {
        id: 'joaillerie',
        face: 3,
        nom: 'Joaillerie',
        texte:
          "Les demeures du quartier des joailliers ont été pillées de fond en comble depuis longtemps. Même les décombres ont été retournés de nombreuses fois pour trouver des fragments d'or et de gemmes. Malgré tout, quelques petits objets de valeur ont été oubliés.",
        regle: [
          'Lancez 1D6 pour savoir ce que vous trouvez :',
          "Si votre bande ne vend pas les gemmes, l'un de vos héros peut les garder et les arborer fièrement. Il gagne alors +1 à ses jets pour trouver des objets rares car les marchands se présentent autour d'un guerrier qui semble si riche.",
        ],
        sousTable: [
          { min: 1, max: 2, resultat: "Quartz d'une valeur de D6x5 CO", or: 'D6x5' },
          { min: 3, max: 4, resultat: "Améthyste d'une valeur de 20 CO", or: '20' },
          { min: 5, max: 5, resultat: "Collier d'une valeur de 50 CO", or: '50' },
          { min: 6, max: 6, resultat: "Rubis d'une valeur de D6x15 CO", or: 'D6x15' },
        ],
      },
      {
        id: 'maison_marchand',
        face: 4,
        nom: 'Maison de marchand',
        texte:
          "La maison du marchand se trouve à côté des quais. Un entrepôt sous une voûte de pierre contient des tonneaux et des ballots de tissu. Les produits alimentaires ont été pillés ou mangés depuis longtemps, et d'énormes rats infestent les ballots moisis. Des escaliers montent jusqu'aux quartiers d'habitation solidement bâtis en poutres épaisses. Malgré les dégâts, vous pensez pouvoir les atteindre, bien que la prudence s'impose !",
        regle: [
          "A l'intérieur, vous trouvez plusieurs objets de valeur que vous pouvez vendre pour 2D6x5 CO. Si vous obtenez un double, au lieu de trouver de l'or, vous dénichez un symbole de l'Ordre des Libres Marchands. Un héros en possession de ce médaillon gagne la compétence Baratin.",
        ],
        or: '2D6x5',
      },
      {
        id: 'batiment_ecroule',
        face: 5,
        nom: 'Bâtiment écroulé',
        texte:
          "La comète a presque entièrement détruit ce bâtiment, le rendant très dangereux à explorer. De tels endroits sont cependant ceux où l'on a le plus de chances de découvrir des fragments de pierre magique.",
        regle: [
          "Vous trouvez D3 fragments de pierre magique parmi les décombres. De plus, faites un test sous le Commandement de votre chef de bande. En cas de réussite, un chien de guerre qui gardait le bâtiment est adopté par votre bande.",
        ],
      },
      {
        id: 'entree_catacombes_5',
        face: 6,
        nom: 'Entrée des Catacombes',
        texte:
          "Vous trouvez une entrée bien dissimulée menant aux sombres catacombes qui s'étendent sous Mordheim. Malgré l'air peu engageant de l'entrée, les tunnels vous feront gagner des heures lors de vos fouilles.",
        regle: [
          "Vous pouvez utiliser ces tunnels pour explorer Mordheim plus efficacement. Vous pouvez dorénavant relancer un dé lors des jets sur le Tableau d'exploration. Notez-le sur votre feuille de bande. Si vous trouvez encore une entrée de catacombes, vous n'obtenez pas de relance supplémentaire, mais vous pouvez tout de même en obtenir par d'autres moyens.",
        ],
      },
    ],
  },
  {
    id: 'sextuples',
    label: 'Sextuples',
    nombreDes: 6,
    evenements: [
      {
        id: 'la_fosse',
        face: 1,
        nom: 'La Fosse',
        texte:
          "Vous arrivez en vue de la Fosse, l'énorme cratère creusé par la comète. Un nuage noir s'en élève toujours mais vous pouvez voir de la pierre magique partout. C'est le domaine du Seigneur des Ombres, le Maître des Possédés, et personne n'y est le bienvenu, pas même ses propres serviteurs !",
        regle: [
          "Si vous le souhaitez, vous pouvez envoyer l'un de vos héros en quête de pierre magique. Lancez 1D6. Sur un jet de 1 le héros est dévoré par les gardiens de la Fosse et ne revient pas. Sur un 2 ou plus, il revient avec D6+1 fragments de pierre magique.",
        ],
      },
      {
        id: 'tresor_cache',
        face: 2,
        nom: 'Trésor caché',
        texte:
          "Dans les profondeurs de Mordheim, vous découvrez un coffre caché portant les armoiries de l'une des familles nobles de la cité.",
        regle: [
          'Vous trouvez les objets qui suivent en ouvrant le coffre. Lancez séparément pour chaque élément de la liste (sauf pour les couronnes d\'or) afin de savoir si vous l\'avez trouvé. Par exemple, vous trouvez de la Pierre Magique sur un jet de 4+.',
        ],
        sousTableTresor: [
          { element: 'D3 Fragments de pierre magique', seuil: '4+' },
          { element: '5D6x5 CO', seuil: 'Auto' },
          { element: 'Relique sacrée', seuil: '5+' },
          { element: 'Armure lourde', seuil: '5+' },
          { element: 'D3 Gemmes valant 10 CO chacune', seuil: '4+' },
          { element: 'Cape elfique', seuil: '5+' },
          { element: 'Livre saint', seuil: '5+' },
          { element: 'Artefact magique', seuil: '5+' },
        ],
        or: '5D6x5',
        artefactMagique: true,
      },
      {
        id: 'forge_naine',
        face: 3,
        nom: 'Forge naine',
        texte:
          "Vous trouvez un atelier solidement bâti en pierre. Une inscription runique indique qu'il s'agit d'une ancienne forge naine.",
        regle: ['Lancez 1D6 pour savoir ce que vous trouvez :'],
        sousTable: [
          {
            min: 1,
            max: 1,
            resultat: 'D3 Haches à deux mains',
            objets: [{ item_id: 'arme_a_deux_mains', quantite: 'D3' }],
          },
          {
            min: 2,
            max: 2,
            resultat: 'D3 Armures lourdes',
            objets: [{ item_id: 'armure_lourde', quantite: 'D3' }],
          },
          { min: 3, max: 3, resultat: 'Hache en gromril' },
          { min: 4, max: 4, resultat: 'Marteau en gromril' },
          { min: 5, max: 5, resultat: 'Hache à deux mains en gromril' },
          { min: 6, max: 6, resultat: 'Armure en gromril', objets: [{ item_id: 'armure_en_gromril_market' }] },
        ],
      },
      {
        id: 'bande_massacree',
        face: 4,
        nom: 'Bande massacrée',
        texte:
          "Vous trouvez les cadavres de toute une bande. Les corps démembrés par quelque monstrueuse créature jonchent les ruines. Une immense silhouette, qui semble être une énorme bête possédée, disparaît dans l'obscurité.",
        regle: [
          "Après les avoir enterrés (Sœurs de Sigmar ou Répurgateurs), mangés (skavens ou morts-vivants) ou volés (tous les autres !) vous trouvez les objets suivants. Lancez un D6 séparément pour chaque élément (sauf l'or et les dagues) pour savoir si vous le trouvez. Par exemple, vous trouvez les armures légères sur un jet de 4+.",
        ],
        sousTableTresor: [
          { element: '3D6x5 CO', seuil: 'Auto' },
          { element: 'D3 Armures légères', seuil: '4+' },
          { element: 'Armure lourde', seuil: '5+' },
          { element: 'D6 Dagues', seuil: 'Auto' },
          { element: 'Carte de Mordheim (voir p55)', seuil: '4+' },
          { element: 'D3 Hallebarde', seuil: '5+' },
          { element: 'D3 Épées', seuil: '3+' },
          { element: 'D3 Boucliers', seuil: '2+' },
          { element: 'D3 Arcs', seuil: '4+' },
          { element: 'D3 Casques', seuil: '2+' },
        ],
        or: '3D6x5',
      },
      {
        id: 'arene',
        face: 5,
        nom: 'Arène',
        texte:
          "Il fut un temps où Mordheim était célèbre pour ses duellistes et ses gladiateurs. Vous venez de trouver l'un des endroits où étaient formés ces guerriers. L'endroit est plein d'équipement et d'armes d'entraînement.",
        regle: [
          "Vous trouvez un manuel d'entraînement, que vous pouvez vendre pour 100 CO ou donner à l'un de vos héros. Le savoir qu'il y trouve lui permet de choisir dans la liste de compétences de combat en plus de ses listes habituelles lorsqu'un jet de progression lui fait gagner une nouvelle compétence, et sa CC peut dorénavant progresser d'un point de plus que le maximum normal (par exemple, la CC d'un humain doté du livre peut à présent progresser jusqu'à un maximum de 7).",
        ],
        or: '100',
      },
      {
        id: 'villa_de_noble',
        face: 6,
        nom: 'Villa de noble',
        texte:
          "Vous trouvez une belle maison partiellement détruite. Elle a déjà été pillée et le mobilier a été dépouillé de ses pièces de valeur. Des poteries de grande qualité gisent en morceaux partout sur le sol.",
        regle: ['Lancez 1D6 :'],
        sousTable: [
          { min: 1, max: 2, resultat: "D6x10 CO d'objets et d'or à ajouter à votre magot", or: 'D6x10' },
          {
            min: 3,
            max: 4,
            resultat: "D6 fioles d'ombre pourpre",
            objets: [{ item_id: 'ombre_pourpre', quantite: 'D6' }],
          },
          {
            min: 5,
            max: 6,
            resultat: 'Un artefact magique dissimulé dans une alcôve secrète — lancez sur le Tableau des artefacts magiques.',
          },
        ],
        artefactMagique: true,
      },
    ],
  },
];

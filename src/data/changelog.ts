// Notes de mise à jour affichées dans le menu Options (voir SettingsMenu,
// ChangelogScreen). Une entrée par JOURNÉE de mise en production sur `main`
// (pas par push individuel — plusieurs pushes/jour sont fréquents et
// produiraient des entrées quasi vides) : quand une modification est
// mergée sur main, ajouter sa journée en tête de liste si elle n'existe pas
// encore, sinon ajouter une puce à l'entrée du jour. Texte pensé pour le
// joueur (ce qui change pour lui), pas un résumé technique des commits —
// voir i18n/data/changelog.ts pour la traduction anglaise associée, indexée
// par la même date (les puces y sont réappariées par position, donc
// n'insérer/retirer une puce FR qu'en mettant à jour l'anglais en même
// temps).
//
// Chaque puce porte une catégorie, affichée regroupée à l'écran (voir
// ChangelogScreen) :
// - 'fonctionnalite' : un nouveau mécanisme ou une nouvelle capacité pour
//   le joueur (ex : le cycle tactile des PV).
// - 'interface' : apparence, ergonomie, disposition — sans changer ce que
//   l'app permet de faire.
// - 'autre' : corrections de bugs, corrections de règles erronées, et tout
//   ce qui ne rentre pas clairement dans les deux catégories ci-dessus.
export type ChangelogCategorie = 'fonctionnalite' | 'interface' | 'autre';

export type ChangelogPoint = {
  texte: string;
  categorie: ChangelogCategorie;
};

export type ChangelogEntry = {
  date: string; // AAAA-MM-JJ
  points: ChangelogPoint[];
};

// Plus récent en premier.
export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-09-03',
    points: [
      {
        categorie: 'fonctionnalite',
        texte:
          "Hommes-Lézards : les 3 Marques Sacrées (Glandes à Venin, Gueule Énorme, Marque des Anciens) sont enfin achetables, comme objets spéciaux réservés aux Héros concernés au recrutement.",
      },
      {
        categorie: 'fonctionnalite',
        texte:
          "Mangeurs d'Hommes : la règle \"Gloutonnerie\" est jouable — un Héros Ogre peut dévorer un captif obtenu après bataille ou même un camarade de bande (gain d'expérience, retrait du roster), et chaque Ogre compte double lors de la vente de pierre de sorcière ou de trésors.",
      },
      {
        categorie: 'fonctionnalite',
        texte: "Pillards de Lustrie : le Maître des pièges peut acheter des Pièges (objet à usage unique) dans sa boutique.",
      },
      {
        categorie: 'fonctionnalite',
        texte:
          "Fils d'Hashut : la source complète de la bande a enfin été retrouvée — ferme une fuite qui laissait recruter des Francs-Tireurs interdits (Ninja, Chasseur, Prêtre-guerrier de Sigmar) et ajoute le bonus de +1 en Force manquant sur l'Arme en obsidienne.",
      },
      {
        categorie: 'fonctionnalite',
        texte: "Nains du Chaos : la Sorcière peut désormais être engagée comme Franc-Tireur.",
      },
      {
        categorie: 'autre',
        texte:
          "Le message affiché pour \"Ce gars est doué\" reflète maintenant la vraie conséquence de la règle pour les profils qui ne peuvent jamais devenir Héros (Esclave, Guerrier Gobelin, Souffre-douleur, Rat Familier), au lieu d'un message générique de relance parfois faux.",
      },
      {
        categorie: 'autre',
        texte:
          "Correction de plusieurs objets spéciaux qui disparaissaient à tort de la boutique dès la première bataille disputée : Champignons bonnets de fou (Gobelins de la Nuit) et Destrier des Chevaliers d'Avant-garde (Caravanes Marchandes).",
      },
      {
        categorie: 'autre',
        texte:
          "Culte des Possédés : les mutations ne sont plus achetables après le recrutement, et un Possédé ne peut plus être équipé d'une monture, conformément aux règles.",
      },
      {
        categorie: 'autre',
        texte:
          "Skavens du Clan Pestilens : le Rat Familier, plafonné par erreur à 0, peut de nouveau être obtenu par transformation du Rat Géant.",
      },
      {
        categorie: 'autre',
        texte:
          "Nains du Chaos : l'Exosquelette et la Machine du Chaos affichaient parfois le mauvais prix dans la boutique commune ; la réduction de prix liée à l'expérience du Héros s'applique désormais aussi à l'Exosquelette. Le Tromblon perd sa règle \"Incidents de tir systématiques\", qui ne provenait d'aucune source retrouvée.",
      },
      {
        categorie: 'autre',
        texte:
          "Culte des Tueurs : le Barbe-Naissante gagne la Haine des Orques et des Gobelins comme les autres Tueurs nommés, et la bande peut désormais engager un Barde.",
      },
      {
        categorie: 'autre',
        texte:
          "Correction d'un bug d'achat pour un groupe d'hommes de main agrandi manuellement (via le champ de taille de groupe) : compléter l'équipement manquant n'en rachète plus tout un lot en trop.",
      },
      {
        categorie: 'autre',
        texte:
          "Mangeurs d'Hommes : la source complète de la bande a enfin été retrouvée — corrige le prix du Sabre de Cathay du Capitaine (désormais fixe) et empêche de recruter un Tigre à Sabre sans Guide de Montagne vivant dans la bande, conformément aux règles.",
      },
      {
        categorie: 'fonctionnalite',
        texte:
          "Morts Sans Repos : les Gardes Funéraires et Spectres promus Héros ne peuvent plus chercher d'objet rare (règle « Aucun Marché » enfin appliquée), et un rappel de la règle Fureteur du Nécromancien (3D6, garde les 2 meilleurs) s'affiche lors de la recherche.",
      },
      {
        categorie: 'fonctionnalite',
        texte:
          "La pénalité de -1 Mouvement pour le port simultané d'une armure lourde et d'un bouclier est désormais automatique, et disparaît dès que l'un des deux est retiré (les bandes naines en restent exemptées).",
      },
      {
        categorie: 'interface',
        texte:
          "Un objet du stock d'armurerie de bande sans aucun porteur éligible affiche maintenant un avertissement rouge explicite, à la place du bouton simplement grisé.",
      },
      {
        categorie: 'interface',
        texte:
          "L'étape équipement du recrutement affiche le détail complet des coûts (trésorerie de départ, coût du profil, chaque objet acheté), et annuler un recrutement en cours demande désormais confirmation avant de tout perdre.",
      },
      {
        categorie: 'fonctionnalite',
        texte:
          "Morts Sans Repos : le Goliath d'Os peut être recruté dès la création de la bande, sans coût en Points de Vie pour la Liche dans ce cas précis (contrairement à un Goliath construit plus tard en campagne via Franc-Tireur).",
      },
      {
        categorie: 'interface',
        texte:
          "Le sélecteur de langue FR/EN a été déplacé dans le menu Réglages (roue crantée) ; le bouton en haut à droite du bandeau ouvre désormais une page de référence dédiée à la bande consultée (règles spéciales, équipement, magie et francs-tireurs disponibles).",
      },
      {
        categorie: 'autre',
        texte:
          "Les francs-tireurs affichent enfin le montant réel de leur entretien (au recrutement et sur leur fiche une fois engagés), à la place d'un texte générique qui ne le précisait pas.",
      },
    ],
  },
  {
    date: '2026-09-01',
    points: [
      {
        categorie: 'autre',
        texte:
          "Correction d'un bug important : le bouton \"Actualiser\" du bandeau de mise à jour pouvait rester sans effet sur un onglet resté ouvert un moment (l'appui déclenchait bien la mise à jour en coulisses, mais l'écran ne se rechargeait jamais tout seul) — désormais fiable.",
      },
      {
        categorie: 'fonctionnalite',
        texte:
          "Cour des Plaisirs Profanes : un nouveau bouton permet de transformer un captif obtenu après bataille en Souffre-douleur recruté gratuitement dans la bande (\"Destin Cruel\").",
      },
      {
        categorie: 'fonctionnalite',
        texte:
          "Kislévites : \"Férocement Loyal\", la compétence spéciale de l'Ours Apprivoisé, permet désormais de faire absorber une partie des blessures graves du Dompteur par l'ours plutôt que de les subir normalement.",
      },
      {
        categorie: 'autre',
        texte:
          "Pirates : une surtaxe de solde de +20 CO s'applique désormais automatiquement en entretien si la bande compte à la fois des Nains et des Elfes parmi ses francs-tireurs.",
      },
      {
        categorie: 'autre',
        texte:
          "Hors-la-loi de la Forêt de Stirwood : la règle \"Archers\" empêche maintenant réellement l'achat ou l'usage d'une autre arme de tir que l'arc, même via une compétence qui le permettrait habituellement.",
      },
    ],
  },
  {
    date: '2026-08-31',
    points: [
      {
        categorie: 'fonctionnalite',
        texte:
          "Nouveaux mécanismes de succession de chef forcée et de transformation de profil déclenchés depuis la fiche personnage : dissolution de bande chez les Morts-Vivants sans Nécromancien ni Vampire, Pti'mek devenant Orque Noir, Rat géant devenant Rat Familier (Skavens du Clan Pestilens), Damné devenant Enfant du Chaos (Maraudeurs du Chaos), succession forcée chez les Orques Noirs, et succession du Marchand vers l'Apprenti chez les Caravanes Marchandes (qui hérite de ses compétences spéciales).",
      },
      {
        categorie: 'fonctionnalite',
        texte:
          "Nouvelles réductions de prix liées à l'historique d'un Héros : l'Armure du Chaos coûte moins cher selon l'expérience de son porteur (et sa recherche bénéficie d'un bonus selon ses ennemis mis hors de combat lors de la bataille précédente), et la Faveur du Seigneur (Gardiens de Chapelle Bretonniens) comme l'Héritage (Kislévites) offrent un objet à moitié prix au recrutement d'un Héros.",
      },
      {
        categorie: 'fonctionnalite',
        texte:
          "Le Chien de Guerre des Mangeurs d'Hommes débloque désormais l'accès aux francs-tireurs Mercenaires (retirés de la bande à la mort du chef qui l'a acquis), et les Gors deviennent recrutables chez les Maraudeurs du Chaos pour toute bande portant la Marque du Chaos Universel.",
      },
      {
        categorie: 'interface',
        texte: "L'indication de déroute est désormais un badge sur la carte résumé de bande.",
      },
      {
        categorie: 'autre',
        texte:
          "Poursuite et clôture du grand audit des règles de bande contre les documents officiels sur la quasi-totalité des bandes restantes : Amazones, Artilleurs de Nuln, Mercenaires Averlanders, Bandits du Hochland, Pillards Hommes-Bêtes, La Kermesse du Chaos, La Cavalcade Maudite, Chasseurs Cornus, Chasseurs de Trésors Nains, Cour des Plaisirs Profanes, Culte des Possédés, Culte des Tueurs, Elfes Noirs, Escorteurs Impériaux, Fils d'Hashut, Gardiens de Chapelle Bretonniens, Gardiens des Tombes, Gladiateurs, Gobelins de la Nuit, Hors-la-loi de la Forêt de Stirwood, Hommes-Lézards, Guerriers Fantômes, Mercenaires Marienburgers, Pillards de Lustrie, Mangeurs d'Hommes, Maraudeurs du Chaos, Mercenaires Middenheimers, Mootlanders, Morts Tourmentés, Nains du Chaos, Norses, Horde Orque, Orques Noirs, Mercenaires Ostermarkers, Mercenaires Ostlanders, Pirates, Pilleurs de Tombes Arabes, Skavens du Clan Pestilens, Tiléens, Les Répurgateurs, Sylvaneths et Morts-Vivants : fuites d'équipement fermées, compétences spéciales enfin réservées au bon profil, plafonds de recrutement corrigés, et de nombreuses corrections de rareté, de prix et de traduction anglaise.",
      },
      {
        categorie: 'autre',
        texte:
          "Les objets « fusionnés au porteur » (comme l'Armure du Chaos) ne peuvent plus être revendus ni transférés à un autre membre, et les plafonds de recrutement relatifs entre deux profils d'une même bande sont désormais réellement bloquants plutôt que purement indicatifs.",
      },
      {
        categorie: 'autre',
        texte:
          "Correction de plusieurs fuites de la boutique communes à plusieurs bandes (accès à des objets exclusifs à un autre profil ou une autre bande, duplication d'objets rares/uniques lors d'une recherche, compétences levant à tort une interdiction d'équipement).",
      },
    ],
  },
  {
    date: '2026-08-30',
    points: [
      {
        categorie: 'fonctionnalite',
        texte:
          "Nouveau bouton +1 XP directement depuis la liste de la bande, sans ouvrir la fiche du personnage — pratique pour noter un ennemi mis hors de combat en pleine partie. Puce dédiée avec confirmation sur mobile/deux volets (pour éviter un faux tap au défilement), case XP directement cliquable sur le tableau desktop.",
      },
      {
        categorie: 'interface',
        texte:
          "Confirmation demandée avant de quitter l'écran de création d'une nouvelle bande sans avoir cliqué sur \"Créer la bande\" (bouton retour du bandeau ou retour matériel/geste du téléphone) — rien n'y est encore sauvegardé, un appui accidentel ne fait plus tout perdre en silence.",
      },
      {
        categorie: 'fonctionnalite',
        texte:
          "Nouveau bandeau \"Nouvelle version disponible\" quand une mise à jour de l'app est prête : reste discrètement en bas de l'écran jusqu'à un clic sur \"Actualiser\", sans jamais recharger tout seul ni interrompre une saisie ou fermer un écran en cours. L'app revérifie désormais aussi activement toutes les heures tant qu'elle reste ouverte, en plus de la vérification automatique du navigateur à chaque relance — et un nouveau bouton \"Vérifier les mises à jour\" dans Options → À propos permet de forcer cette vérification immédiatement plutôt que d'attendre.",
      },
      {
        categorie: 'autre',
        texte:
          "Poursuite du grand audit des règles de bande contre les documents officiels sur les 10 dernières bandes jamais vérifiées : Caravanes Marchandes, La Cavalcade Maudite, Cour des Plaisirs Profanes, Fils d'Hashut, Gardiens des Tombes, Mangeurs d'Hommes, Moines Guerriers de Cathay, Mootlanders, Pilleurs de Tombes Arabes et Gladiateurs — corrections de francs-tireurs et Dramatis Personae recrutables à tort, de compétences mal réparties entre profils, d'accès à l'équipement, et de plusieurs statistiques et règles spéciales erronées (dont la Force du Louche des Mootlanders, purement et simplement inversée).",
      },
      {
        categorie: 'autre',
        texte:
          "Audit général du moteur de règles (création de bande et séquence post-bataille complète) : les objets Rares ne sont plus achetables en boutique une fois la première bataille de la bande disputée (ils ne s'obtiennent alors plus qu'à l'exploration, comme le prévoit la règle) ; en cas d'égalité de Commandement entre plusieurs héros à la mort du chef, la succession se départage désormais automatiquement par Points d'Expérience, le choix manuel du joueur ne restant nécessaire qu'en cas d'égalité totale.",
      },
      {
        categorie: 'autre',
        texte:
          "Un combattant qui meurt perd désormais systématiquement tout son équipement, comme le prévoit la règle : corrigé d'abord pour les figurines mortes d'un groupe en post-bataille (y compris un groupe dont l'inventaire était déjà dépareillé entre figurines), puis étendu à tous les autres cas où c'était encore manquant (mort au combat depuis la fiche, la Fosse, la table du Seigneur des Ombres...).",
      },
      {
        categorie: 'autre',
        texte:
          "Kislévites : l'Ours Apprivoisé nécessite de nouveau un Dompteur d'Ours vivant pour être recruté ou conservé dans la bande.",
      },
      {
        categorie: 'autre',
        texte:
          "Corrigé deux fuites de la boutique : le shop commun restait accessible pendant le recrutement d'un nouveau membre alors qu'il devrait être masqué pour certaines bandes, et un Squig désigné \"Entraîné\" (Gobelins de la Nuit) pouvait à tort acheter de l'équipement comme un homme de main.",
      },
    ],
  },
  {
    date: '2026-08-29',
    points: [
      {
        categorie: 'autre',
        texte:
          "Kislévites : corrigé l'accès aux francs-tireurs Prêtre de Morr, Mage elfe et Ranger Kislévite (leur propre règle spéciale dit pourtant qu'ils recrutent comme les bandes de Mercenaires humains). Corrigé aussi le nom du franc-tireur Halfling, qui s'appelle en réalité Éclaireur Halfling.",
      },
      {
        categorie: 'autre',
        texte:
          "Kislévites : le Dompteur d'Ours, l'Esaul et la Recrue peuvent de nouveau acheter des armures, comme le reste de la bande.",
      },
      {
        categorie: 'autre',
        texte:
          "Fixé un miss-click possible dans la grille d'XP (sur la fiche personnage comme dans l'assistant post-bataille) qui pouvait faire redescendre l'XP d'un guerrier en dessous de son XP de départ.",
      },
    ],
  },
  {
    date: '2026-08-28',
    points: [
      {
        categorie: 'interface',
        texte:
          "Nouvel encadré sur l'écran d'accueil annonçant la disponibilité officielle de l'app sur le Google Play Store (masquable définitivement d'un clic).",
      },
      {
        categorie: 'autre',
        texte:
          "Poursuite du grand audit des règles de bande : corrections sur les Morts Tourmentés (un Nécromancien pouvait se voir proposer à tort le sort réservé à la Liche au lieu du sien) et sur les Pillards de Lustrie (la bande utilisait par erreur l'arme spéciale d'une autre bande à la place de la sienne, et de l'équipement de héros normalement réservé à un profil précis restait achetable par n'importe quel héros).",
      },
      {
        categorie: 'autre',
        texte:
          "Le bouton Terminer du recrutement d'un Mutant (Culte des Possédés) ou d'un Impur (Kermesse du Chaos) reste désormais grisé tant qu'aucune mutation/Bénédiction de Nurgle n'a été achetée, conformément à la règle qui l'impose dès le recrutement.",
      },
    ],
  },
  {
    date: '2026-08-27',
    points: [
      {
        categorie: 'interface',
        texte:
          "Dans la boutique, les mutations (Culte des Possédés, Maraudeurs du Chaos, Pillards Hommes-Bêtes, Kermesse du Chaos) sortent de la catégorie Divers/Spécial pour rejoindre un nouvel onglet Mutations dédié, qui n'apparaît que pour les guerriers y ayant réellement accès.",
      },
      {
        categorie: 'autre',
        texte:
          "Poursuite du grand audit des règles de bande contre les documents officiels : corrections sur les Mercenaires Marienburgers, les Mercenaires Middenheimers, les Mercenaires Reiklanders, les Sœurs de Sigmar, les Répurgateurs, les Skavens, les Morts-Vivants, le Culte des Possédés, les Mercenaires Ostermarkers, les Tiléens, les Pillards Hommes-Bêtes, les Maraudeurs du Chaos et la Kermesse du Chaos — dont l'ajout de 6 mutations manquantes au Culte des Possédés, le doublement de prix des mutations enfin appliqué chez les Pillards Hommes-Bêtes, l'exemption de la règle Œil des Dieux Sombres pour un chef Blessé chez les Maraudeurs du Chaos, et de nombreuses corrections d'accès aux compétences, à l'équipement et de traduction anglaise.",
      },
      {
        categorie: 'autre',
        texte:
          "Corrigé une fuite permettant à un guerrier totalement privé d'une catégorie d'arme ou d'armure par les règles (bêtes de guerre du Chaos, Roulotte de la Peste de la Kermesse du Chaos...) d'acheter quand même ce type d'objet via l'équipement spécial de sa bande. Le bouton Acheter de la fiche personnage se grise désormais automatiquement quand le guerrier n'a droit à aucun achat, quelle que soit sa bande.",
      },
    ],
  },
  {
    date: '2026-08-26',
    points: [
      {
        categorie: 'fonctionnalite',
        texte:
          "Nouvelle bande jouable : Culte des Tueurs (2a), bande naine de Tueurs cherchant une mort glorieuse — Tueur de Géants, Chercheurs de Trépas, Mémorialiste, Tueurs de Trolls, Barbes-Naissantes et Lanceurs de Haches, avec leurs armes signatures (Hache de jet, Lames tournoyantes). Bande disponible uniquement en anglais à l'origine, traduite en français pour l'occasion. Ses dés d'Exploration, trop dépendants du déroulement de la partie pour être calculés automatiquement, doivent être comptés à la main par le joueur, en s'appuyant sur le rappel des règles spéciales concernées.",
      },
      {
        categorie: 'autre',
        texte:
          "Poursuite du grand audit des règles de bande contre les documents officiels : corrections de restrictions d'équipement, de compétences et de francs-tireurs pour les Chasseurs de Trésors Nains, les Nains du Chaos, les Gobelins de la Nuit, les Kislévites, les Ostlanders, les Escorteurs Impériaux, les Elfes Noirs, les Orques Noirs, les Hommes-Lézards, les Chevaliers Bretonniens, les Hors-la-loi de la Forêt de Stirwood, les Skavens du Clan Pestilens, les Guerriers Fantômes, les Maraudeurs du Chaos, les Norses, les Pirates, les Gardiens de Chapelle Bretonniens et la Horde Orque (dont l'interdiction de recruter un Sorcier/une Sorcière chez les Maraudeurs en présence de la Marque d'Arkhar, et l'obligation d'avoir un Wulfen vivant pour recruter des Loups chez les Norses), ainsi que de nombreuses corrections de traduction anglaise.",
      },
    ],
  },
  {
    date: '2026-08-25',
    points: [
      {
        categorie: 'fonctionnalite',
        texte:
          'Pillards de Lustrie : "Option Sorcier" de l\'Ombre de la Jungle enfin jouable — contre 30 po, prenable au recrutement ou à tout moment de la campagne depuis sa fiche, avec choix du premier sort de Magie mineure. L\'Armure légère de départ, devenue incompatible, part à l\'armurerie de la bande plutôt que d\'être perdue.',
      },
      {
        categorie: 'interface',
        texte: "Nouvelle bannière Musterheim sur l'écran d'accueil.",
      },
      {
        categorie: 'autre',
        texte:
          "Grand audit des règles de bande contre les documents officiels : corrections de restrictions d'équipement et de compétences pour les Amazones (Mordheim et Lustrie), les Artilleurs de Nuln, les Averlanders, les Bandits du Hochland, les Chasseurs Cornus et les Gobelins des Forêts, ainsi que de nombreuses corrections de traduction anglaise (noms de règles, compétences et sorts alignés sur les textes officiels).",
      },
    ],
  },
  {
    date: '2026-08-24',
    points: [
      {
        categorie: 'fonctionnalite',
        texte:
          "Un tap sur le nombre de Points de vie (PV) dans le tableau ou la liste compacte décompte maintenant les PV restants d'un cran, jusqu'à passer automatiquement Hors de combat à 0 puis revenir à pleine santé au tap suivant.",
      },
      {
        categorie: 'autre',
        texte: 'Ajout d\'une mention "projet de fan, non affilié à Games Workshop" en bas de la page Politique de confidentialité.',
      },
    ],
  },
  {
    date: '2026-08-23',
    points: [
      {
        categorie: 'fonctionnalite',
        texte: 'Ajout d\'une colonne "Sv" (sauvegarde d\'armure totale) dans le tableau et la liste compacte.',
      },
      {
        categorie: 'interface',
        texte:
          "Le tableau des membres reste maintenant affiché en permanence sur ordinateur (plus de bascule automatique vers une liste à 3 lignes sur les écrans étroits), et chaque figurine a son propre encart en pierre peinte.",
      },
      {
        categorie: 'interface',
        texte:
          "La liste \"Bande complète\" a maintenant sa propre poignée de glisser-déposer, et le temps d'appui long pour démarrer un glisser sur mobile est passé à 2 secondes pour éviter un déclenchement accidentel.",
      },
      {
        categorie: 'autre',
        texte: "Correction : faire défiler la page en appuyant par erreur sur le nom d'une figurine ne déclenche plus de glisser-déposer sur mobile.",
      },
      {
        categorie: 'autre',
        texte: 'Correction des compétences "Expert en Armes"/"Connaissance des Armes", qui ne débloquaient pas correctement tous les types d\'armes.',
      },
    ],
  },
  {
    date: '2026-08-22',
    points: [
      {
        categorie: 'fonctionnalite',
        texte:
          'Nouvelle vue "Bande complète" : une liste condensée qui fusionne Héros et Hommes de main en un seul défilement rapide, avec un bouton pour revenir à la vue détaillée habituelle.',
      },
      {
        categorie: 'fonctionnalite',
        texte:
          'Étape Exploration : la Fosse aux ours devient une vraie décision et le nouvel objet "Manuel d\'entraînement" est disponible.',
      },
      {
        categorie: 'fonctionnalite',
        texte: 'Gobelins de la Nuit : ajout des 6 compétences spéciales de bande et des compétences dédiées du Berger à Squig.',
      },
      {
        categorie: 'interface',
        texte: 'Les profils déjà recrutés à leur limite (uniques, etc.) apparaissent maintenant grisés dans la liste de recrutement plutôt que de rester sélectionnables.',
      },
      {
        categorie: 'autre',
        texte: 'Correction du sous-jet lié à la Carte de Mordheim en exploration.',
      },
      {
        categorie: 'autre',
        texte: "Correction de 5 divergences relevées dans l'assistant post-bataille.",
      },
      {
        categorie: 'autre',
        texte: 'Gobelins de la Nuit : correction du Mouvement du Squig Géant.',
      },
    ],
  },
  {
    date: '2026-08-21',
    points: [
      {
        categorie: 'interface',
        texte: "Cibles tactiles agrandies sur mobile pour les cartes de figurine et les gains d'XP.",
      },
      {
        categorie: 'autre',
        texte: 'Correction : dans l\'assistant de recrutement, "Annuler" à l\'étape équipement annule maintenant tout le recrutement au lieu de laisser une figurine à moitié créée.',
      },
      {
        categorie: 'autre',
        texte: 'Correction du prix de l\'armure en gromril (150 po au lieu de 200) et de plusieurs incohérences sur la bande Sylvaneths.',
      },
      {
        categorie: 'autre',
        texte: "Ré-audit des événements d'exploration à résultats multiples (quadruple, quintuple, sextuple) : plusieurs cas manquants intégrés.",
      },
    ],
  },
  {
    date: '2026-08-20',
    points: [
      {
        categorie: 'interface',
        texte: "Repositionnement de la croix de suppression et de la poignée de glisser sur les cartes de figurine, badge d'avancée en attente déplacé sur la ligne de statut.",
      },
      {
        categorie: 'interface',
        texte: 'Fusion du badge CHEF avec la ligne de statut quand il ne tient plus à côté du nom.',
      },
      {
        categorie: 'autre',
        texte: 'Le bouton "Tout passer" du post-bataille reste maintenant affiché (désactivé) au lieu de disparaître, évitant un saut de mise en page.',
      },
    ],
  },
  {
    date: '2026-08-19',
    points: [
      {
        categorie: 'fonctionnalite',
        texte: "Ajout d'accès aux compétences propres à certaines tribus, appliqué aux cités-États tiléennes.",
      },
      {
        categorie: 'interface',
        texte: 'Repositionnement de la poignée de glisser-déposer et de la croix de suppression sur les cartes de figurine mobile, statut sur sa propre ligne.',
      },
      {
        categorie: 'interface',
        texte: 'Ajout d\'un bouton explicite "Enregistrer et revenir" en bas des Réglages.',
      },
      {
        categorie: 'autre',
        texte: "Correction de nombreuses erreurs de traduction anglaise relevées par un audit systématique sur l'ensemble des bandes (noms, compétences, règles spéciales).",
      },
      {
        categorie: 'autre',
        texte: "Correction d'une perte de modification lors d'actions rapides successives sur le roster, de fuites d'état en vue deux volets, et de champs de saisie numériques buggés.",
      },
    ],
  },
  {
    date: '2026-08-18',
    points: [
      {
        categorie: 'fonctionnalite',
        texte:
          "L'achat d'équipement se fait maintenant directement dans la fenêtre de recrutement plutôt que sur un second écran, avec un panier pour acheter plusieurs objets d'un coup ; ajout de choix d'équipement pour 7 francs-tireurs.",
      },
      {
        categorie: 'fonctionnalite',
        texte: 'Ajout de la traduction anglaise de la bande Sylvaneths.',
      },
      {
        categorie: 'interface',
        texte: "Rechargement automatique discret en cas d'erreur de déploiement, au lieu d'un écran d'erreur alarmant.",
      },
      {
        categorie: 'autre',
        texte: 'Correction de plusieurs bugs d\'équipement (Averland, Culte des Possédés, Kislevites, Skavens, Mob Orc, Morts-vivants, Bêtes du Chaos).',
      },
      {
        categorie: 'autre',
        texte: "Correction de l'avatar qui ne remplissait pas son cadre dans les deux thèmes.",
      },
    ],
  },
  {
    date: '2026-08-17',
    points: [
      {
        categorie: 'interface',
        texte: "Harmonisation des boutons d'action rouges restants, XP de départ déplacé dans le titre de la fenêtre de recrutement.",
      },
      {
        categorie: 'autre',
        texte: "Correction de texte français qui s'affichait par erreur dans le journal d'exploration en mode anglais.",
      },
    ],
  },
  {
    date: '2026-08-16',
    points: [
      {
        categorie: 'interface',
        texte: 'Ajout des illustrations de bannière pour toutes les bandes.',
      },
      {
        categorie: 'interface',
        texte: "Restylage de la boutique et de l'assistant post-bataille pour matcher le reste de l'appli (boutons peints, badges rubans).",
      },
      {
        categorie: 'interface',
        texte: "Sur tactile, le glisser-déposer d'une carte de bande ne s'active plus que via une poignée dédiée.",
      },
    ],
  },
  {
    date: '2026-08-15',
    points: [
      {
        categorie: 'interface',
        texte: "La bannière de chaque bande s'affiche maintenant en fond de carte sur l'écran de sélection.",
      },
      {
        categorie: 'interface',
        texte: 'Les cartes de bande peuvent être réorganisées par glisser-déposer.',
      },
      {
        categorie: 'autre',
        texte: 'Correction du recadrage de la bannière qui devenait presque carré sur grand écran.',
      },
    ],
  },
  {
    date: '2026-08-14',
    points: [
      {
        categorie: 'interface',
        texte:
          "Les actions du bandeau (réglages, thème...) sont regroupées dans un seul menu déroulant en pierre peinte plutôt qu'une rangée de boutons séparés.",
      },
      {
        categorie: 'interface',
        texte: "Le titre-texte de l'accueil est remplacé par la bannière encadrée Musterheim.",
      },
      {
        categorie: 'autre',
        texte: "Correction de bugs de responsive en vue deux volets, des noms de personnage trop longs, et du contraste du bandeau en thème sombre.",
      },
    ],
  },
  {
    date: '2026-08-13',
    points: [
      {
        categorie: 'interface',
        texte: "La boutique d'équipement passe en plein écran sur ordinateur, avec le même habillage en pierre peinte que le reste de l'appli.",
      },
      {
        categorie: 'autre',
        texte: 'Correction : seul le véritable profil de chef est banni définitivement à sa mort ; ajout d\'un moyen de lever ce bannissement manuellement depuis le roster.',
      },
    ],
  },
  {
    date: '2026-08-11',
    points: [
      {
        categorie: 'autre',
        texte: "Correction de bandes manquantes dans la liste d'éligibilité et meilleure gestion des erreurs de stockage local.",
      },
      {
        categorie: 'autre',
        texte: 'Correction de plusieurs problèmes d\'accessibilité et de performance relevés en audit.',
      },
    ],
  },
  {
    date: '2026-08-10',
    points: [
      {
        categorie: 'autre',
        texte: "Nom raccourci pour l'arme à deux mains.",
      },
    ],
  },
  {
    date: '2026-08-09',
    points: [
      {
        categorie: 'interface',
        texte: 'Le contrôle de statut (Actif/Hors de combat) devient une plaque en fer forgé plutôt qu\'un simple interrupteur.',
      },
    ],
  },
  {
    date: '2026-08-08',
    points: [
      {
        categorie: 'fonctionnalite',
        texte: 'Ajout de la Valeur de Puissance V2 (Rout Value, blessures permanentes, Dramatis Personae).',
      },
      {
        categorie: 'interface',
        texte: 'Refonte des tuiles de résumé (icônes filigranées derrière le texte).',
      },
      {
        categorie: 'interface',
        texte: 'Le tableau dense de caractéristiques est aussi affiché dans le volet liste en vue deux volets, pas seulement sur les cartes.',
      },
      {
        categorie: 'autre',
        texte:
          "Correction du curseur qui sautait pendant l'édition du nom, d'une fenêtre cachée derrière la vue deux volets, et de l'alignement des caractéristiques dans le tableau du roster.",
      },
      {
        categorie: 'autre',
        texte: "Correction des objets gratuits d'exploration enregistrés à 0 po.",
      },
    ],
  },
  {
    date: '2026-08-07',
    points: [
      {
        categorie: 'fonctionnalite',
        texte: 'Ajout d\'une section Cimetière pour les figurines mortes.',
      },
      {
        categorie: 'fonctionnalite',
        texte: 'Ajout de la Valeur de Puissance comme notation alternative de bande.',
      },
      {
        categorie: 'autre',
        texte: "Correction de règles relevées par un audit FAQ (boutique, avancées post-bataille, sécurité de sortie de l'assistant).",
      },
      {
        categorie: 'autre',
        texte: "Correction du filtre d'import .txt, ajout d'une infobulle de détail pour la Valeur de Puissance.",
      },
      {
        categorie: 'autre',
        texte: 'Correction de texte français qui s\'affichait par erreur en mode anglais.',
      },
    ],
  },
  {
    date: '2026-08-06',
    points: [
      {
        categorie: 'fonctionnalite',
        texte: 'Ajout des Paires de pistolets.',
      },
      {
        categorie: 'interface',
        texte: 'Refonte de la liste du roster et de la barre d\'actions, refonte de l\'affichage du statut Mort.',
      },
      {
        categorie: 'interface',
        texte: 'Refonte des tuiles de résumé de bande (Membres/Rating/Trésorerie/Wyrdstone).',
      },
      {
        categorie: 'interface',
        texte: "Les hommes de main identiques d'un même groupe partagent maintenant une seule ligne d'équipement plutôt que d'être répétés.",
      },
      {
        categorie: 'autre',
        texte: 'Correction : la photo (et deux autres champs) était effacée à chaque rechargement de la bande.',
      },
    ],
  },
  {
    date: '2026-08-05',
    points: [
      {
        categorie: 'fonctionnalite',
        texte: 'Ajout de la photo de figurine, avec prise de photo directe et recadrage intégré.',
      },
      {
        categorie: 'interface',
        texte: "Nouvelle direction artistique : titres en Caslon Antique, en-têtes de section discrets, icônes de la barre d'outils unifiées.",
      },
      {
        categorie: 'interface',
        texte: 'Refonte du contrôle de statut Actif/Hors de combat en véritable interrupteur.',
      },
      {
        categorie: 'autre',
        texte: 'Correction de la visibilité des caractéristiques et de la largeur du tableau en vue deux volets.',
      },
    ],
  },
];

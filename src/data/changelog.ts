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
];

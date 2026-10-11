export type GameRules = {
  poudreNoireAvancee: boolean;
  armuresLozheim: boolean;
  trinketsLimites: boolean;
  sawbonesDocteur: boolean;
  dramatisPersonae: boolean;
  // Affiche la Power Value (voir utils/powerValue.ts) à la place du Rating
  // officiel partout où celui-ci est affiché. N'affecte que l'affichage :
  // le Rating officiel (utils/rating.ts) reste calculé sans changement et
  // continue de régir toute mécanique de jeu (XP, avancées, légalité de
  // bande...).
  valeurPuissanceActivee: boolean;
  // Affiche un bouton « Jet auto » à côté de chaque saisie de jet du
  // post-bataille. Décochée (par défaut), l'app ne lance jamais aucun dé :
  // le joueur lance sur sa table et saisit le résultat, comportement
  // historique de l'app. Cochée, le bouton remplit le champ avec un tirage
  // dans la plage exacte du jet demandé — le joueur reste libre de saisir
  // sa propre valeur par-dessus.
  jetsVirtuels: boolean;
};

export const DEFAULT_GAME_RULES: GameRules = {
  poudreNoireAvancee: false,
  armuresLozheim: false,
  trinketsLimites: false,
  sawbonesDocteur: false,
  dramatisPersonae: false,
  valeurPuissanceActivee: false,
  jetsVirtuels: false,
};

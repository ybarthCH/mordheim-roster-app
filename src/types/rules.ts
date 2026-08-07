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
};

export const DEFAULT_GAME_RULES: GameRules = {
  poudreNoireAvancee: false,
  armuresLozheim: false,
  trinketsLimites: false,
  sawbonesDocteur: false,
  dramatisPersonae: false,
  valeurPuissanceActivee: false,
};

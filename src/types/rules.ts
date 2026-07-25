export type GameRules = {
  poudreNoireAvancee: boolean;
  armuresLozheim: boolean;
  trinketsLimites: boolean;
  sawbonesDocteur: boolean;
};

export const DEFAULT_GAME_RULES: GameRules = {
  poudreNoireAvancee: false,
  armuresLozheim: false,
  trinketsLimites: false,
  sawbonesDocteur: false,
};

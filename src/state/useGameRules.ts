import { createContext, useContext } from 'react';
import type { GameRules } from '../types/rules';

export type GameRulesContextValue = {
  rules: GameRules;
  setRule: <K extends keyof GameRules>(rule: K, active: GameRules[K]) => void;
};

export const GameRulesContext = createContext<GameRulesContextValue | undefined>(undefined);

export function useGameRules() {
  const ctx = useContext(GameRulesContext);
  if (!ctx) throw new Error('useGameRules doit être utilisé dans un GameRulesProvider');
  return ctx;
}

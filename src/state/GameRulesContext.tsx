import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { getSetting, setSetting } from '../db/db';
import { DEFAULT_GAME_RULES } from '../types/rules';
import type { GameRules } from '../types/rules';
import { GameRulesContext } from './useGameRules';

const SETTING_KEY = 'regles_jeu';

export function GameRulesProvider({ children }: { children: ReactNode }) {
  const [rules, setRules] = useState<GameRules>(DEFAULT_GAME_RULES);
  const modifiedBeforeLoad = useRef(false);

  useEffect(() => {
    let active = true;
    getSetting<Partial<GameRules>>(SETTING_KEY).then((saved) => {
      if (!active || modifiedBeforeLoad.current || !saved) return;
      setRules({ ...DEFAULT_GAME_RULES, ...saved });
    });
    return () => {
      active = false;
    };
  }, []);

  const setRule = <K extends keyof GameRules>(rule: K, active: GameRules[K]) => {
    modifiedBeforeLoad.current = true;
    setRules((current) => {
      const next = { ...current, [rule]: active };
      void setSetting(SETTING_KEY, next);
      return next;
    });
  };

  return <GameRulesContext.Provider value={{ rules, setRule }}>{children}</GameRulesContext.Provider>;
}

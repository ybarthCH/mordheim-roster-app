import { createContext, useContext } from 'react';
import type { RosterInstance } from '../types/roster';

export type RostersContextValue = {
  rosters: RosterInstance[];
  loading: boolean;
  refresh: () => Promise<void>;
  getRosterById: (id: string) => RosterInstance | undefined;
  updateRoster: (roster: RosterInstance) => Promise<void>;
  addRoster: (roster: RosterInstance) => Promise<void>;
  removeRoster: (id: string) => Promise<void>;
  duplicateRoster: (id: string) => Promise<RosterInstance | undefined>;
  importRoster: (roster: RosterInstance) => Promise<RosterInstance>;
};

export const RostersContext = createContext<RostersContextValue | undefined>(undefined);

export function useRosters() {
  const ctx = useContext(RostersContext);
  if (!ctx) throw new Error('useRosters doit être utilisé dans un RostersProvider');
  return ctx;
}

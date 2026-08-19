import { createContext, useContext } from 'react';
import type { RosterInstance } from '../types/roster';

export type RostersContextValue = {
  rosters: RosterInstance[];
  loading: boolean;
  refresh: () => Promise<void>;
  getRosterById: (id: string) => RosterInstance | undefined;
  updateRoster: (roster: RosterInstance) => Promise<void>;
  // Lit/modifie la bande à partir de son état le plus récent (une ref tenue à
  // jour de façon synchrone, jamais la valeur figée dans la closure de
  // l'appelant) : deux appels rapprochés (ex. saisie clavier rapide dans deux
  // champs différents) s'enchaînent donc correctement au lieu que le second,
  // parti d'un instantané périmé, écrase le changement du premier. Préférer
  // patchRoster à updateRoster partout où le partiel dépend de l'état
  // courant de la bande plutôt que d'une valeur déjà entièrement calculée.
  patchRoster: (id: string, updater: (current: RosterInstance) => RosterInstance) => Promise<void>;
  addRoster: (roster: RosterInstance) => Promise<void>;
  removeRoster: (id: string) => Promise<void>;
  duplicateRoster: (id: string) => Promise<RosterInstance | undefined>;
  importRoster: (roster: RosterInstance) => Promise<RosterInstance>;
  // Persiste un nouvel ordre d'affichage (glisser-déposer sur
  // ListeBandesScreen) : attribue ordre = position dans le tableau reçu à
  // chaque bande, dans cet ordre exact.
  reorderRosters: (nouvelOrdre: RosterInstance[]) => Promise<void>;
};

export const RostersContext = createContext<RostersContextValue | undefined>(undefined);

export function useRosters() {
  const ctx = useContext(RostersContext);
  if (!ctx) throw new Error('useRosters doit être utilisé dans un RostersProvider');
  return ctx;
}

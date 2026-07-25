import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { RosterInstance } from '../types/roster';
import { deleteRoster, listRosters, saveRoster } from '../db/db';
import { normaliserRoster } from '../utils/normalize';
import { RostersContext } from './useRosters';

export function RostersProvider({ children }: { children: ReactNode }) {
  const [rosters, setRosters] = useState<RosterInstance[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const all = await listRosters();
    setRosters(all.map(normaliserRoster));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getRosterById = useCallback(
    (id: string) => rosters.find((r) => r.id === id),
    [rosters]
  );

  const updateRoster = useCallback(async (roster: RosterInstance) => {
    const updated = { ...roster, updatedAt: new Date().toISOString() };
    await saveRoster(updated);
    setRosters((prev) => {
      const idx = prev.findIndex((r) => r.id === updated.id);
      if (idx === -1) return [...prev, updated];
      const copy = [...prev];
      copy[idx] = updated;
      return copy;
    });
  }, []);

  const addRoster = useCallback(async (roster: RosterInstance) => {
    await saveRoster(roster);
    setRosters((prev) => [...prev, roster]);
  }, []);

  const removeRoster = useCallback(async (id: string) => {
    await deleteRoster(id);
    setRosters((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const duplicateRoster = useCallback(
    async (id: string) => {
      const original = rosters.find((r) => r.id === id);
      if (!original) return undefined;
      const now = new Date().toISOString();
      // Chaque membre reçoit un nouvel instance_id — leader_instance_id
      // (bandes à leadership libre) doit être remappé en conséquence, sinon
      // il pointe vers un id qui n'existe plus dans la copie et le chef
      // choisi est silencieusement perdu.
      const idsRemappes = new Map<string, string>();
      const membres = original.membres.map((m) => {
        const instance_id = uuidv4();
        idsRemappes.set(m.instance_id, instance_id);
        return { ...m, instance_id };
      });
      const copy: RosterInstance = {
        ...original,
        id: uuidv4(),
        nom_bande: `${original.nom_bande} (copie)`,
        membres,
        leader_instance_id: original.leader_instance_id
          ? idsRemappes.get(original.leader_instance_id)
          : undefined,
        createdAt: now,
        updatedAt: now,
      };
      await saveRoster(copy);
      setRosters((prev) => [...prev, copy]);
      return copy;
    },
    [rosters]
  );

  const importRoster = useCallback(async (roster: RosterInstance) => {
    const imported: RosterInstance = {
      ...normaliserRoster(roster),
      id: uuidv4(),
      updatedAt: new Date().toISOString(),
    };
    await saveRoster(imported);
    setRosters((prev) => [...prev, imported]);
    return imported;
  }, []);

  const value = useMemo(
    () => ({
      rosters,
      loading,
      refresh,
      getRosterById,
      updateRoster,
      addRoster,
      removeRoster,
      duplicateRoster,
      importRoster,
    }),
    [rosters, loading, refresh, getRosterById, updateRoster, addRoster, removeRoster, duplicateRoster, importRoster]
  );

  return <RostersContext.Provider value={value}>{children}</RostersContext.Provider>;
}

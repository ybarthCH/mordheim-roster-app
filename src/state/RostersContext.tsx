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
      // Un effet persistant ciblant un membre précis (ex : exemption d'entretien
      // "Débiteur reconnaissant") doit suivre le remappage des instance_id ci-
      // dessus, sinon il continue de viser le membre de la bande source et ne
      // s'applique plus jamais dans la copie. Un effet devenu orphelin (cible
      // qui n'existe plus, ex : membre déjà mort avant la duplication) est
      // abandonné plutôt que recopié sans cible valide.
      const effets_persistants = (original.effets_persistants ?? []).flatMap((e) => {
        if (!e.cible) return [{ ...e, id: uuidv4() }];
        const cibleRemappee = idsRemappes.get(e.cible);
        return cibleRemappee ? [{ ...e, id: uuidv4(), cible: cibleRemappee }] : [];
      });
      const copy: RosterInstance = {
        ...original,
        id: uuidv4(),
        nom_bande: `${original.nom_bande} (copie)`,
        membres,
        effets_persistants,
        leader_instance_id: original.leader_instance_id
          ? idsRemappes.get(original.leader_instance_id)
          : undefined,
        // Pas d'ordre hérité de l'original : la copie retombe dans le repli
        // alphabétique de listRosters() plutôt que de partager exactement
        // la même position glissée-déposée que la bande source.
        ordre: undefined,
        createdAt: now,
        updatedAt: now,
      };
      await saveRoster(copy);
      setRosters((prev) => [...prev, copy]);
      return copy;
    },
    [rosters]
  );

  // Attribue un ordre séquentiel (0, 1, 2...) selon la position dans le
  // tableau reçu, et ne persiste que les bandes dont l'ordre a réellement
  // changé — évite une écriture IndexedDB inutile pour chaque bande à
  // chaque glisser-déposer, y compris ceux qui n'ont rien déplacé (relâché
  // au même endroit).
  const reorderRosters = useCallback(async (nouvelOrdre: RosterInstance[]) => {
    const now = new Date().toISOString();
    const misesAJour: RosterInstance[] = [];
    const parId = new Map(nouvelOrdre.map((r, i) => [r.id, i]));
    for (const roster of nouvelOrdre) {
      const ordre = parId.get(roster.id);
      if (ordre !== undefined && roster.ordre !== ordre) {
        misesAJour.push({ ...roster, ordre, updatedAt: now });
      }
    }
    if (misesAJour.length === 0) return;
    await Promise.all(misesAJour.map((r) => saveRoster(r)));
    setRosters((prev) => {
      const parIdMaj = new Map(misesAJour.map((r) => [r.id, r]));
      return prev
        .map((r) => parIdMaj.get(r.id) ?? r)
        .sort((a, b) => (a.ordre ?? Number.MAX_SAFE_INTEGER) - (b.ordre ?? Number.MAX_SAFE_INTEGER));
    });
  }, []);

  const importRoster = useCallback(async (roster: RosterInstance) => {
    const imported: RosterInstance = {
      ...normaliserRoster(roster),
      id: uuidv4(),
      // Un ordre venu d'un fichier exporté par une autre instance n'a aucun
      // sens ici — repli alphabétique, comme pour une bande dupliquée.
      ordre: undefined,
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
      reorderRosters,
    }),
    [
      rosters,
      loading,
      refresh,
      getRosterById,
      updateRoster,
      addRoster,
      removeRoster,
      duplicateRoster,
      importRoster,
      reorderRosters,
    ]
  );

  return <RostersContext.Provider value={value}>{children}</RostersContext.Provider>;
}

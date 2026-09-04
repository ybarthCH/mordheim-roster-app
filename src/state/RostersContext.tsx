import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { RosterInstance } from '../types/roster';
import { deleteRoster, listRosters, saveRoster } from '../db/db';
import { normaliserRoster } from '../utils/normalize';
import { RostersContext } from './useRosters';

export function RostersProvider({ children }: { children: ReactNode }) {
  const [rosters, setRosters] = useState<RosterInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Reflète `rosters` de façon synchrone (assignée pendant le rendu, avant
  // tout effet) : patchRoster s'appuie dessus plutôt que sur `rosters` pour
  // lire l'état le plus récent même entre deux rendus, quand un premier
  // appel est encore en attente de son écriture IndexedDB.
  const rostersRef = useRef(rosters);
  rostersRef.current = rosters;

  const refresh = useCallback(async () => {
    setLoading(true);
    // try/catch/finally indispensable ici : listRosters() peut rejeter (voir
    // son propre commentaire dans db/db.ts — IndexedDB indisponible, quota
    // dépassé, navigation privée sur certains navigateurs...). Sans ce filet,
    // l'exception remontait hors du useEffect qui appelle refresh() sans
    // jamais atteindre setLoading(false) : l'app restait bloquée
    // indéfiniment sur l'écran "Chargement…", sans message ni recours.
    try {
      const all = await listRosters();
      setRosters(all.map(normaliserRoster));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
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

  const patchRoster = useCallback(
    async (id: string, updater: (current: RosterInstance) => RosterInstance) => {
      const current = rostersRef.current.find((r) => r.id === id);
      if (!current) return;
      const updated = { ...updater(current), updatedAt: new Date().toISOString() };
      // Répercuté sur la ref et sur l'état React de façon synchrone, avant
      // l'attente de saveRoster : un second patchRoster lancé pendant cette
      // écriture (ex. deuxième frappe avant que la précédente ait fini de
      // persister) part donc de ce résultat déjà à jour plutôt que de
      // l'instantané pré-patch.
      rostersRef.current = rostersRef.current.map((r) => (r.id === id ? updated : r));
      setRosters(rostersRef.current);
      await saveRoster(updated);
    },
    []
  );

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
    // allSettled plutôt qu'all : si une seule écriture IndexedDB échoue
    // (quota, etc.), les autres doivent quand même se refléter dans l'état
    // React — sinon un Promise.all rejeté abandonnerait tout le lot, y
    // compris les bandes réellement persistées avec leur nouvel ordre,
    // désynchronisant l'affichage de ce qui est en base jusqu'au prochain
    // rechargement complet.
    const resultats = await Promise.allSettled(misesAJour.map((r) => saveRoster(r)));
    const reussies = misesAJour.filter((_, i) => resultats[i].status === 'fulfilled');
    if (reussies.length === 0) return;
    setRosters((prev) => {
      const parIdMaj = new Map(reussies.map((r) => [r.id, r]));
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
      error,
      refresh,
      getRosterById,
      updateRoster,
      patchRoster,
      addRoster,
      removeRoster,
      duplicateRoster,
      importRoster,
      reorderRosters,
    }),
    [
      rosters,
      loading,
      error,
      refresh,
      getRosterById,
      updateRoster,
      patchRoster,
      addRoster,
      removeRoster,
      duplicateRoster,
      importRoster,
      reorderRosters,
    ]
  );

  return <RostersContext.Provider value={value}>{children}</RostersContext.Provider>;
}

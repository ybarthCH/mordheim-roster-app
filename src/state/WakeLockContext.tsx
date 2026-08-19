import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { getSetting, setSetting } from '../db/db';
import { WakeLockContext } from './useWakeLock';

const supporte = typeof navigator !== 'undefined' && 'wakeLock' in navigator;

export function WakeLockProvider({ children }: { children: ReactNode }) {
  const [actif, setActifState] = useState(false);
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  // Un setActif(false) déclenché avant la fin du chargement IndexedDB (ex :
  // l'utilisateur désactive tout de suite un réglage resté activé en base
  // depuis une session précédente) ne doit pas être réécrasé à true par ce
  // chargement une fois terminé — même motif que GameRulesContext.
  const modifiedBeforeLoad = useRef(false);

  useEffect(() => {
    getSetting<boolean>('ecranActif').then((saved) => {
      if (saved && !modifiedBeforeLoad.current) setActifState(true);
    });
  }, []);

  useEffect(() => {
    if (!supporte || !actif) return;

    let annule = false;
    const demander = async () => {
      try {
        const sentinel = await navigator.wakeLock.request('screen');
        if (annule) {
          sentinel.release();
          return;
        }
        sentinelRef.current = sentinel;
        // Le navigateur peut relâcher le verrou de son propre chef (pas
        // seulement via visibilitychange, ex : bascule automatique en mode
        // économie d'énergie) — sans cet écouteur, la référence resterait
        // pointée sur un sentinel déjà mort et onVisibilite ne redemanderait
        // plus jamais de nouveau verrou.
        sentinel.addEventListener('release', () => {
          if (sentinelRef.current === sentinel) sentinelRef.current = null;
        });
      } catch {
        // Refus du navigateur (ex : onglet en arrière-plan) — sans
        // conséquence, on retentera au prochain retour au premier plan.
      }
    };
    demander();

    // Le verrou est automatiquement relâché quand l'onglet passe en
    // arrière-plan : il faut le redemander explicitement au retour.
    const onVisibilite = () => {
      if (document.visibilityState === 'visible' && (!sentinelRef.current || sentinelRef.current.released)) {
        demander();
      }
    };
    document.addEventListener('visibilitychange', onVisibilite);

    return () => {
      annule = true;
      document.removeEventListener('visibilitychange', onVisibilite);
      sentinelRef.current?.release();
      sentinelRef.current = null;
    };
  }, [actif]);

  const setActif = useCallback((v: boolean) => {
    modifiedBeforeLoad.current = true;
    setActifState(v);
    setSetting('ecranActif', v);
  }, []);

  // value mémoïsé : sans ça, un nouvel objet littéral à chaque rendu de
  // WakeLockProvider re-rendrait tous les consommateurs de useWakeLock(),
  // même quand ni actif ni supporte n'ont changé.
  const value = useMemo(() => ({ actif, setActif, supporte }), [actif, setActif]);

  return <WakeLockContext.Provider value={value}>{children}</WakeLockContext.Provider>;
}

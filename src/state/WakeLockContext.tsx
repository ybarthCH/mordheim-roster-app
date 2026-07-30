import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { getSetting, setSetting } from '../db/db';
import { WakeLockContext } from './useWakeLock';

const supporte = typeof navigator !== 'undefined' && 'wakeLock' in navigator;

export function WakeLockProvider({ children }: { children: ReactNode }) {
  const [actif, setActifState] = useState(false);
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    getSetting<boolean>('ecranActif').then((saved) => {
      if (saved) setActifState(true);
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
      } catch {
        // Refus du navigateur (ex : onglet en arrière-plan) — sans
        // conséquence, on retentera au prochain retour au premier plan.
      }
    };
    demander();

    // Le verrou est automatiquement relâché quand l'onglet passe en
    // arrière-plan : il faut le redemander explicitement au retour.
    const onVisibilite = () => {
      if (document.visibilityState === 'visible' && !sentinelRef.current) demander();
    };
    document.addEventListener('visibilitychange', onVisibilite);

    return () => {
      annule = true;
      document.removeEventListener('visibilitychange', onVisibilite);
      sentinelRef.current?.release();
      sentinelRef.current = null;
    };
  }, [actif]);

  const setActif = (v: boolean) => {
    setActifState(v);
    setSetting('ecranActif', v);
  };

  return (
    <WakeLockContext.Provider value={{ actif, setActif, supporte }}>{children}</WakeLockContext.Provider>
  );
}

import { createContext, useContext } from 'react';

export type WakeLockContextValue = {
  // Empêche l'écran de se mettre en veille (utile en table de jeu, l'appareil
  // posé sans interaction pendant qu'on consulte les fiches).
  actif: boolean;
  setActif: (v: boolean) => void;
  // Screen Wake Lock API absente (navigateur/contexte non sécurisé) : la
  // case reste proposée mais n'a aucun effet, on préfère le signaler.
  supporte: boolean;
};

export const WakeLockContext = createContext<WakeLockContextValue | undefined>(undefined);

export function useWakeLock() {
  const ctx = useContext(WakeLockContext);
  if (!ctx) throw new Error('useWakeLock doit être utilisé dans un WakeLockProvider');
  return ctx;
}

import { createContext, useContext } from 'react';

export type UpdateSWCheckResult = 'update-found' | 'up-to-date' | 'unsupported';

export type UpdateSWContextValue = {
  // Une nouvelle version a été détectée et installée (en attente de prise
  // de contrôle) — voir UpdateToast.tsx pour le bandeau qui s'appuie
  // dessus, et ReglagesScreen pour le bouton de vérification manuelle.
  needRefresh: boolean;
  // Bascule sur la nouvelle version et recharge la page.
  updateServiceWorker: () => void;
  // Force une revérification immédiate côté serveur plutôt que d'attendre
  // le prochain cycle horaire (voir UpdateSWProvider) — c'est le bouton
  // "Vérifier les mises à jour" des options qui s'en sert.
  checkForUpdate: () => Promise<UpdateSWCheckResult>;
};

export const UpdateSWContext = createContext<UpdateSWContextValue | undefined>(undefined);

export function useUpdateSW() {
  const ctx = useContext(UpdateSWContext);
  if (!ctx) throw new Error('useUpdateSW doit être utilisé dans un UpdateSWProvider');
  return ctx;
}

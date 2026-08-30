import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { UpdateSWContext } from './useUpdateSW';
import type { UpdateSWCheckResult } from './useUpdateSW';

// Revérifie activement une fois par heure pendant que l'app reste ouverte
// (onglet ou PWA installée) : sans ça, le navigateur ne revérifie de
// lui-même une nouvelle version qu'à la prochaine navigation/rechargement,
// ce qui peut laisser une session ouverte des jours sur une ancienne
// version sans jamais déclencher UpdateToast. Le bouton "Vérifier les
// mises à jour" des options (checkForUpdate) permet de ne pas attendre.
const INTERVALLE_VERIFICATION_MS = 60 * 60 * 1000;

// Laisse le temps à un service worker fraîchement détecté de finir de
// s'installer et à workbox-window de le signaler (needRefresh) avant de
// conclure qu'il n'y a rien de neuf — registration.update() ne renvoie
// rien d'exploitable directement, seul cet événement fait foi.
const DELAI_INSTALLATION_MS = 6000;
const INTERVALLE_SONDAGE_MS = 300;

export function UpdateSWProvider({ children }: { children: ReactNode }) {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>();
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, reg) {
      setRegistration(reg);
    },
  });

  // Lu depuis checkForUpdate (fonction stable, capturée une fois) pour
  // toujours voir la valeur la plus récente pendant son sondage, sans
  // dépendre d'une fermeture figée sur le needRefresh du rendu courant.
  const needRefreshRef = useRef(needRefresh);
  useEffect(() => {
    needRefreshRef.current = needRefresh;
  }, [needRefresh]);

  useEffect(() => {
    if (!registration) return;
    const id = setInterval(() => {
      registration.update().catch(() => {});
    }, INTERVALLE_VERIFICATION_MS);
    return () => clearInterval(id);
  }, [registration]);

  const checkForUpdate = async (): Promise<UpdateSWCheckResult> => {
    if (!registration) return 'unsupported';
    await registration.update().catch(() => {});
    const debut = Date.now();
    while (Date.now() - debut < DELAI_INSTALLATION_MS) {
      if (needRefreshRef.current) return 'update-found';
      await new Promise((resolve) => setTimeout(resolve, INTERVALLE_SONDAGE_MS));
    }
    return needRefreshRef.current ? 'update-found' : 'up-to-date';
  };

  return (
    <UpdateSWContext.Provider
      value={{ needRefresh, updateServiceWorker: () => updateServiceWorker(), checkForUpdate }}
    >
      {children}
    </UpdateSWContext.Provider>
  );
}

import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useLanguage } from '../../state/useLanguage';

// Revérifie activement une fois par heure pendant que l'app reste ouverte
// (onglet ou PWA installée) : sans ça, le navigateur ne revérifie de
// lui-même une nouvelle version qu'à la prochaine navigation/rechargement,
// ce qui peut laisser une session ouverte des jours sur une ancienne
// version sans jamais déclencher ce bandeau.
const INTERVALLE_VERIFICATION_MS = 60 * 60 * 1000;

// Bandeau flottant, global à toute l'app (rendu une fois depuis App.tsx,
// pas par écran) : prévient qu'une nouvelle version a été déployée sur
// main et attend un clic explicite avant de recharger — voir
// vite.config.ts (registerType: 'prompt') pour le choix de ne jamais
// recharger tout seul, quitte à ce qu'une saisie ou un écran en cours soit
// interrompu sans prévenir.
export function UpdateToast() {
  const { t } = useLanguage();
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>();
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, reg) {
      setRegistration(reg);
    },
  });

  useEffect(() => {
    if (!registration) return;
    const id = setInterval(() => {
      registration.update().catch(() => {});
    }, INTERVALLE_VERIFICATION_MS);
    return () => clearInterval(id);
  }, [registration]);

  if (!needRefresh) return null;

  return (
    <div className="update-toast" role="status">
      <span>{t('updateToast.message')}</span>
      <button type="button" className="btn btn--primary btn--sm" onClick={() => updateServiceWorker()}>
        {t('updateToast.refresh')}
      </button>
    </div>
  );
}

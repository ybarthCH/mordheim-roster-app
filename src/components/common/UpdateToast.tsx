import { useUpdateSW } from '../../state/useUpdateSW';
import { useLanguage } from '../../state/useLanguage';

// Bandeau flottant, global à toute l'app (rendu une fois depuis App.tsx,
// pas par écran) : prévient qu'une nouvelle version a été déployée sur
// main et attend un clic explicite avant de recharger — voir
// UpdateSWContext (registerType: 'prompt' côté vite.config.ts) pour le
// choix de ne jamais recharger tout seul, quitte à ce qu'une saisie ou un
// écran en cours soit interrompu sans prévenir. Le bouton "Vérifier les
// mises à jour" des options (ReglagesScreen) partage le même état
// (useUpdateSW) : le déclencher depuis là fait aussi apparaître ce
// bandeau, pas juste un message local.
export function UpdateToast() {
  const { t } = useLanguage();
  const { needRefresh, updateServiceWorker } = useUpdateSW();

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

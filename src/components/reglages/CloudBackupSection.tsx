import { useLanguage } from '../../state/useLanguage';
import { useCloudBackup } from '../../state/useCloudBackup';
import { Modal } from '../common/Modal';
import { googleDriveConfigure } from '../../utils/googleDrive';

// Carte Réglages : sauvegarde/restauration manuelle vers un fichier caché
// (appDataFolder) du Google Drive personnel du joueur — voir utils/
// googleDrive.ts et utils/cloudBackup.ts pour les deux couches sous-jacentes,
// et state/useCloudBackup.ts pour la logique partagée avec le raccourci de
// l'écran des bandes. Pas de synchro automatique ni de résolution de
// conflit : chaque action est un geste explicite du joueur, une restauration
// réussie recharge donc toute la page plutôt que de tenter un rafraîchissement
// partiel des multiples contexts concernés (rosters, langue, thème, règles).
export function CloudBackupSection() {
  const { t } = useLanguage();
  const {
    statutSauvegarde,
    statutRestauration,
    erreur,
    derniereSauvegardeAffichee,
    peutSauvegarder,
    confirmationSauvegardeOuverte,
    demanderSauvegarde,
    annulerSauvegarde,
    confirmerSauvegarde,
    confirmationRestaurationOuverte,
    demanderRestauration,
    annulerRestauration,
    confirmerRestauration,
  } = useCloudBackup();

  return (
    <div className="card">
      <h3 className="mt-0">{t('cloudBackup.title')}</h3>
      <p className="text-sm text-muted">{t('cloudBackup.intro')}</p>
      {!googleDriveConfigure() && <p className="text-sm text-danger">{t('cloudBackup.notConfigured')}</p>}

      <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <button
          type="button"
          className="btn btn--sm"
          onClick={demanderSauvegarde}
          disabled={!googleDriveConfigure() || !peutSauvegarder || statutSauvegarde === 'en_cours'}
        >
          {statutSauvegarde === 'en_cours' ? t('cloudBackup.backingUp') : t('cloudBackup.backupNow')}
        </button>
        <button
          type="button"
          className="btn btn--sm"
          onClick={demanderRestauration}
          disabled={!googleDriveConfigure() || statutRestauration === 'en_cours'}
        >
          {statutRestauration === 'en_cours' ? t('cloudBackup.restoring') : t('cloudBackup.restoreNow')}
        </button>
      </div>

      {!peutSauvegarder && (
        <p className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>
          {t('cloudBackup.noRostersToBackup')}
        </p>
      )}
      {derniereSauvegardeAffichee && (
        <p className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>
          {derniereSauvegardeAffichee}
        </p>
      )}
      {erreur && (
        <p className="text-danger text-sm" style={{ marginTop: '0.5rem' }}>
          {erreur}
        </p>
      )}

      {confirmationSauvegardeOuverte && (
        <Modal onClose={annulerSauvegarde}>
          <h3>{t('cloudBackup.backupConfirmTitle')}</h3>
          <p className="text-muted">{t('cloudBackup.backupConfirmBody')}</p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={annulerSauvegarde}>
              {t('cloudBackup.cancel')}
            </button>
            <button className="btn btn--danger" onClick={confirmerSauvegarde}>
              {t('cloudBackup.backupConfirmButton')}
            </button>
          </div>
        </Modal>
      )}

      {confirmationRestaurationOuverte && (
        <Modal onClose={annulerRestauration}>
          <h3>{t('cloudBackup.restoreConfirmTitle')}</h3>
          <p className="text-muted">{t('cloudBackup.restoreConfirmBody')}</p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={annulerRestauration}>
              {t('cloudBackup.cancel')}
            </button>
            <button className="btn btn--danger" onClick={confirmerRestauration}>
              {t('cloudBackup.restoreConfirmButton')}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

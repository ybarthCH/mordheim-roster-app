import { useEffect, useState } from 'react';
import { useLanguage } from '../../state/useLanguage';
import { Modal } from '../common/Modal';
import { getSetting, setSetting } from '../../db/db';
import { obtenirJeton, precharger, envoyerSauvegarde, recupererSauvegarde, googleDriveConfigure } from '../../utils/googleDrive';
import { construireSauvegardeComplete, sauvegardeValide, appliquerSauvegardeComplete } from '../../utils/cloudBackup';

const CLE_DERNIERE_SAUVEGARDE = 'google_drive_last_backup_at';

type Statut = 'inactif' | 'en_cours' | 'erreur';

// Carte Réglages : sauvegarde/restauration manuelle vers un fichier caché
// (appDataFolder) du Google Drive personnel du joueur — voir utils/
// googleDrive.ts et utils/cloudBackup.ts pour les deux couches sous-jacentes.
// Pas de synchro automatique ni de résolution de conflit : chaque action est
// un geste explicite du joueur (voir plan de session), une restauration
// réussie recharge donc toute la page plutôt que de tenter un rafraîchissement
// partiel des multiples contexts concernés (rosters, langue, thème, règles).
export function CloudBackupSection() {
  const { t, language } = useLanguage();
  const [statutSauvegarde, setStatutSauvegarde] = useState<Statut>('inactif');
  const [statutRestauration, setStatutRestauration] = useState<Statut>('inactif');
  const [erreur, setErreur] = useState<string | null>(null);
  const [derniereSauvegarde, setDerniereSauvegarde] = useState<string | null>(null);
  const [confirmationOuverte, setConfirmationOuverte] = useState(false);

  useEffect(() => {
    precharger();
    getSetting<string>(CLE_DERNIERE_SAUVEGARDE).then((v) => setDerniereSauvegarde(v ?? null));
  }, []);

  const sauvegarder = async () => {
    setErreur(null);
    setStatutSauvegarde('en_cours');
    try {
      const jeton = await obtenirJeton();
      const sauvegarde = await construireSauvegardeComplete();
      await envoyerSauvegarde(jeton, JSON.stringify(sauvegarde));
      const maintenant = new Date().toISOString();
      await setSetting(CLE_DERNIERE_SAUVEGARDE, maintenant);
      setDerniereSauvegarde(maintenant);
      setStatutSauvegarde('inactif');
    } catch (e) {
      setErreur(e instanceof Error ? e.message : String(e));
      setStatutSauvegarde('erreur');
    }
  };

  const restaurer = async () => {
    setConfirmationOuverte(false);
    setErreur(null);
    setStatutRestauration('en_cours');
    try {
      const jeton = await obtenirJeton();
      const contenu = await recupererSauvegarde(jeton);
      if (!contenu) {
        setErreur(t('cloudBackup.noBackupFound'));
        setStatutRestauration('erreur');
        return;
      }
      const data: unknown = JSON.parse(contenu);
      if (!sauvegardeValide(data)) {
        setErreur(t('cloudBackup.invalidBackup'));
        setStatutRestauration('erreur');
        return;
      }
      await appliquerSauvegardeComplete(data);
      window.location.reload();
    } catch (e) {
      setErreur(e instanceof Error ? e.message : String(e));
      setStatutRestauration('erreur');
    }
  };

  return (
    <div className="card">
      <h3 className="mt-0">{t('cloudBackup.title')}</h3>
      <p className="text-sm text-muted">{t('cloudBackup.intro')}</p>
      {!googleDriveConfigure() && <p className="text-sm text-danger">{t('cloudBackup.notConfigured')}</p>}

      <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <button
          type="button"
          className="btn btn--sm"
          onClick={sauvegarder}
          disabled={!googleDriveConfigure() || statutSauvegarde === 'en_cours'}
        >
          {statutSauvegarde === 'en_cours' ? t('cloudBackup.backingUp') : t('cloudBackup.backupNow')}
        </button>
        <button
          type="button"
          className="btn btn--sm"
          onClick={() => setConfirmationOuverte(true)}
          disabled={!googleDriveConfigure() || statutRestauration === 'en_cours'}
        >
          {statutRestauration === 'en_cours' ? t('cloudBackup.restoring') : t('cloudBackup.restoreNow')}
        </button>
      </div>

      {derniereSauvegarde && (
        <p className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>
          {t('cloudBackup.lastBackup', { date: new Date(derniereSauvegarde).toLocaleString(language) })}
        </p>
      )}
      {erreur && (
        <p className="text-danger text-sm" style={{ marginTop: '0.5rem' }}>
          {erreur}
        </p>
      )}

      {confirmationOuverte && (
        <Modal onClose={() => setConfirmationOuverte(false)}>
          <h3>{t('cloudBackup.restoreConfirmTitle')}</h3>
          <p className="text-muted">{t('cloudBackup.restoreConfirmBody')}</p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setConfirmationOuverte(false)}>
              {t('cloudBackup.cancel')}
            </button>
            <button className="btn btn--danger" onClick={restaurer}>
              {t('cloudBackup.restoreConfirmButton')}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

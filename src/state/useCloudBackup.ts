import { useEffect, useState } from 'react';
import { useLanguage } from './useLanguage';
import { useRosters } from './useRosters';
import { getSetting, setSetting } from '../db/db';
import { obtenirJeton, precharger, envoyerSauvegarde, recupererSauvegarde } from '../utils/googleDrive';
import { construireSauvegardeComplete, sauvegardeValide, appliquerSauvegardeComplete } from '../utils/cloudBackup';

const CLE_DERNIERE_SAUVEGARDE = 'google_drive_last_backup_at';

export type StatutCloudBackup = 'inactif' | 'en_cours' | 'erreur';

// Logique de sauvegarde/restauration Google Drive, partagée entre la carte
// dédiée de Réglages (CloudBackupSection) et le raccourci de l'écran des
// bandes (ListeBandesScreen) — deux points d'entrée vers le même flux plutôt
// que de le dupliquer, chaque composant restant libre de sa propre mise en
// forme (carte complète vs. bandeau compact).
export function useCloudBackup() {
  const { t, language } = useLanguage();
  const { rosters } = useRosters();
  const [statutSauvegarde, setStatutSauvegarde] = useState<StatutCloudBackup>('inactif');
  const [statutRestauration, setStatutRestauration] = useState<StatutCloudBackup>('inactif');
  const [erreur, setErreur] = useState<string | null>(null);
  const [derniereSauvegarde, setDerniereSauvegarde] = useState<string | null>(null);
  const [confirmationSauvegardeOuverte, setConfirmationSauvegardeOuverte] = useState(false);
  const [confirmationRestaurationOuverte, setConfirmationRestaurationOuverte] = useState(false);

  useEffect(() => {
    precharger();
    getSetting<string>(CLE_DERNIERE_SAUVEGARDE).then((v) => setDerniereSauvegarde(v ?? null));
  }, []);

  // Aucune bande locale : une sauvegarde écraserait la sauvegarde Drive
  // existante par un fichier vide, avec le même effet destructeur qu'une
  // restauration malheureuse mais sans sa confirmation — mieux vaut
  // empêcher l'action à la source (bouton désactivé, voir peutSauvegarder)
  // que la proposer puis avertir.
  const peutSauvegarder = rosters.length > 0;

  const executerSauvegarde = async () => {
    setConfirmationSauvegardeOuverte(false);
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
    setConfirmationRestaurationOuverte(false);
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

  return {
    statutSauvegarde,
    statutRestauration,
    erreur,
    derniereSauvegarde,
    derniereSauvegardeAffichee: derniereSauvegarde
      ? t('cloudBackup.lastBackup', { date: new Date(derniereSauvegarde).toLocaleString(language) })
      : null,
    peutSauvegarder,
    confirmationSauvegardeOuverte,
    // Filet de sécurité (rosters.length === 0) redondant avec le bouton
    // désactivé côté UI, au cas où un appelant oublierait de le respecter.
    demanderSauvegarde: () => peutSauvegarder && setConfirmationSauvegardeOuverte(true),
    annulerSauvegarde: () => setConfirmationSauvegardeOuverte(false),
    confirmerSauvegarde: executerSauvegarde,
    confirmationRestaurationOuverte,
    demanderRestauration: () => setConfirmationRestaurationOuverte(true),
    annulerRestauration: () => setConfirmationRestaurationOuverte(false),
    confirmerRestauration: restaurer,
  };
}

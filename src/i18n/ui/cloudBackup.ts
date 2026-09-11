import type { UiDictionary } from './types';

export const cloudBackup: UiDictionary = {
  'cloudBackup.title': { fr: 'Sauvegarde cloud (Google Drive)', en: 'Cloud backup (Google Drive)' },
  'cloudBackup.intro': {
    fr: 'Envoie une copie complète de tes bandes et réglages dans un fichier caché de ton Google Drive personnel, invisible ailleurs dans ton Drive. Une seule sauvegarde par compte : chaque nouvel envoi remplace la précédente.',
    en: "Sends a full copy of your warbands and settings to a hidden file in your own Google Drive, invisible elsewhere in your Drive. One backup per account: each new save replaces the previous one.",
  },
  'cloudBackup.notConfigured': {
    fr: 'Fonctionnalité pas encore activée sur ce déploiement.',
    en: 'Not yet enabled on this deployment.',
  },
  'cloudBackup.backupNow': { fr: 'Sauvegarder sur Drive', en: 'Back up to Drive' },
  'cloudBackup.backingUp': { fr: 'Sauvegarde en cours…', en: 'Backing up…' },
  'cloudBackup.restoreNow': { fr: 'Restaurer depuis Drive', en: 'Restore from Drive' },
  'cloudBackup.restoring': { fr: 'Restauration en cours…', en: 'Restoring…' },
  'cloudBackup.lastBackup': { fr: 'Dernière sauvegarde : {date}', en: 'Last backup: {date}' },
  'cloudBackup.noBackupFound': { fr: 'Aucune sauvegarde trouvée sur Drive.', en: 'No backup found on Drive.' },
  'cloudBackup.invalidBackup': {
    fr: 'Le fichier de sauvegarde sur Drive est invalide ou corrompu.',
    en: 'The backup file on Drive is invalid or corrupted.',
  },
  'cloudBackup.restoreConfirmTitle': { fr: 'Restaurer depuis Drive ?', en: 'Restore from Drive?' },
  'cloudBackup.restoreConfirmBody': {
    fr: "Ceci remplace TOUTES les bandes et réglages actuels de cet appareil par la dernière sauvegarde Drive. Irréversible localement (ta sauvegarde sur Drive n'est pas affectée par cette action).",
    en: 'This replaces ALL current warbands and settings on this device with the latest Drive backup. Irreversible locally (your Drive backup itself is not affected by this action).',
  },
  'cloudBackup.cancel': { fr: 'Annuler', en: 'Cancel' },
  'cloudBackup.restoreConfirmButton': { fr: 'Restaurer', en: 'Restore' },
  'cloudBackup.homeBannerText': {
    fr: "Protège tes bandes d'une perte de données : configure la sauvegarde sur Google Drive.",
    en: 'Protect your warbands from data loss: set up Google Drive backup.',
  },
  'cloudBackup.homeBannerLink': { fr: 'Configurer', en: 'Set up' },
  'cloudBackup.emptyStateButton': { fr: 'Restaurer depuis Drive', en: 'Restore from Drive' },
};

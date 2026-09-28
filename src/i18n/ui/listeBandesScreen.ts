import type { UiDictionary } from './types';

export const listeBandesScreen: UiDictionary = {
  'home.title': { fr: 'Mes bandes', en: 'My Warbands' },
  'home.settings': { fr: 'Réglages', en: 'Settings' },
  'home.newBand': { fr: '+ Nouvelle bande', en: '+ New Warband' },
  'home.importJson': { fr: 'Importer JSON', en: 'Import JSON' },
  'home.importFailed': { fr: "Échec de l'import.", en: 'Import failed.' },
  'home.playStoreAnnounceText': {
    fr: 'Musterheim quitte la bêta fermée : l\'app est maintenant disponible publiquement sur le Google Play Store !',
    en: 'Musterheim is leaving closed beta: the app is now publicly available on the Google Play Store!',
  },
  'home.playStoreAnnounceLink': { fr: 'Voir la fiche', en: 'View listing' },
  'home.playStoreAnnounceDismiss': { fr: 'Masquer cette annonce', en: 'Dismiss this announcement' },
  'home.loading': { fr: 'Chargement…', en: 'Loading…' },
  'home.loadError': {
    fr: "Impossible de charger tes bandes (stockage local indisponible ou navigation privée). Réessaie, ou vérifie l'espace de stockage disponible.",
    en: 'Unable to load your warbands (local storage unavailable, or private browsing). Try again, or check your available storage space.',
  },
  'home.loadRetry': { fr: 'Réessayer', en: 'Try again' },
  'home.emptyTitle': { fr: 'Aucune bande enregistrée pour l\'instant.', en: 'No warbands registered yet.' },
  'home.emptySubtitle': {
    fr: "Crée ta première bande ou importe un fichier JSON.",
    en: 'Create your first warband or import a JSON file.',
  },
  'home.members': { fr: 'membres', en: 'members' },
  'home.noBattles': { fr: 'Aucune bataille enregistrée', en: 'No battles recorded' },
  'home.export': { fr: 'Export', en: 'Export' },
  'home.dragHandle': { fr: 'Glisser pour réordonner', en: 'Drag to reorder' },
  'home.duplicate': { fr: 'Dupliquer', en: 'Duplicate' },
  'home.deleteShort': { fr: 'Suppr.', en: 'Del.' },
  'home.deleteConfirmBody': {
    fr: "Cette action est irréversible. Pense à exporter un JSON avant si besoin.",
    en: 'This action is irreversible. Remember to export a JSON backup first if needed.',
  },
  'home.cancel': { fr: 'Annuler', en: 'Cancel' },
  'home.delete': { fr: 'Supprimer', en: 'Delete' },
  'home.supportKofi': { fr: '☕ Soutenir Musterheim sur Ko-fi', en: '☕ Support Musterheim on Ko-fi' },
  // Les deux mentions de pied de page étaient écrites en anglais en dur dans
  // le JSX de ListeBandesScreen, sans passer par t() : elles restaient donc
  // en anglais même avec l'interface en français.
  'home.localDataWarning': {
    fr: "Musterheim enregistre tes données localement, sur cet appareil. Effacer les données de site de ton navigateur peut supprimer définitivement tes bandes sauvegardées. Nous te recommandons vivement d'exporter des sauvegardes régulières.",
    en: "Musterheim saves your data locally on this device. Clearing your browser's site data may permanently delete your saved rosters. We strongly recommend exporting regular backups.",
  },
  'home.gamesWorkshopDisclaimer': {
    fr: "Cette app est un projet communautaire gratuit, sans lien avec Games Workshop. Tout le contenu d'origine est Copyright 2026 Games Workshop.",
    en: 'This app is a free community project not associated with Games Workshop. All original content is Copyright 2026 Games Workshop.',
  },
};

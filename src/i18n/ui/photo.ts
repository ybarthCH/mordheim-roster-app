import type { UiDictionary } from './types';

export const photo: UiDictionary = {
  // Avatar
  'avatar.viewTitle': { fr: 'Photo de {nom}', en: "{nom}'s photo" },
  'avatar.addTitle': { fr: 'Ajouter une photo pour {nom}', en: 'Add a photo for {nom}' },

  // Photo manage modal (view / change / remove)
  'photoModal.title': { fr: 'Photo', en: 'Photo' },
  'photoModal.emptyHint': {
    fr: "Aucune photo. Ajoute une photo de la figurine, tu pourras la recadrer ensuite.",
    en: 'No photo yet. Add a picture of the model — you can crop it afterwards.',
  },
  'photoModal.add': { fr: '+ Depuis un fichier', en: '+ From a file' },
  'photoModal.takePhoto': { fr: 'Prendre une photo', en: 'Take a photo' },
  'photoModal.change': { fr: 'Changer', en: 'Change' },
  'photoModal.remove': { fr: 'Supprimer', en: 'Remove' },
  'photoModal.close': { fr: 'Fermer', en: 'Close' },

  // PhotoCropModal
  'photoCrop.title': { fr: 'Cadrer la photo', en: 'Crop the photo' },
  'photoCrop.hint': { fr: 'Glisse pour déplacer, utilise le curseur pour zoomer.', en: 'Drag to pan, use the slider to zoom.' },
  'photoCrop.cancel': { fr: 'Annuler', en: 'Cancel' },
  'photoCrop.confirm': { fr: 'Valider', en: 'Confirm' },
};

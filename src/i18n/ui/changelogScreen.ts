import type { UiDictionary } from './types';

export const changelogScreen: UiDictionary = {
  'changelog.menuLabel': { fr: 'Notes de mise à jour', en: 'Release notes' },
  // Titre du bandeau, plus court que menuLabel : sur le plus étroit des
  // formats ciblés (fold plié, ~280px), "Notes de mise à jour"/"Release
  // notes" ne tenait pas et se tronquait en "Notes de …"/"Release n…" (voir
  // revue mordheim-responsive-reviewer) — tous les autres titres statiques
  // de l'app (Réglages, Mes bandes...) sont plus courts et ne tronquent
  // jamais. Le menu garde le libellé complet, moins contraint en largeur.
  'changelog.title': { fr: 'Nouveautés', en: "What's new" },
  'changelog.intro': {
    fr: "Historique des mises à jour de l'application, les plus récentes en premier.",
    en: 'History of app updates, most recent first.',
  },
};

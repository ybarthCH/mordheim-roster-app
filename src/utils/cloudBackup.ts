// Construction/validation/application d'une sauvegarde complète de l'app —
// agnostique de la destination (Google Drive aujourd'hui, autre chose un
// jour peut-être). Voir utils/googleDrive.ts pour la partie transport.
import type { RosterInstance } from '../types/roster';
import type { GameRules } from '../types/rules';
import type { Theme } from '../state/useTheme';
import type { Language } from '../state/useLanguage';
import { listRosters, saveRoster, deleteRoster, getSetting, setSetting } from '../db/db';
import { estRosterValide } from './importExport';

export type SauvegardeComplete = {
  version: 1;
  exportedAt: string;
  rosters: RosterInstance[];
  settings: {
    regles_jeu?: Partial<GameRules>;
    language?: Language;
    theme?: Theme;
  };
};

// Rassemble tout ce qui est aujourd'hui dispersé entre le store `rosters` et
// les clés `regles_jeu`/`language`/`theme` du store `settings` (voir
// GameRulesContext/LanguageContext/ThemeContext, chacun lit/écrit sa propre
// clé indépendamment).
export async function construireSauvegardeComplete(): Promise<SauvegardeComplete> {
  const [rosters, regles_jeu, language, theme] = await Promise.all([
    listRosters(),
    getSetting<Partial<GameRules>>('regles_jeu'),
    getSetting<Language>('language'),
    getSetting<Theme>('theme'),
  ]);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    rosters,
    settings: { regles_jeu, language, theme },
  };
}

export function sauvegardeValide(data: unknown): data is SauvegardeComplete {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  if (d.version !== 1) return false;
  if (!Array.isArray(d.rosters) || !d.rosters.every(estRosterValide)) return false;
  if (!d.settings || typeof d.settings !== 'object') return false;
  return true;
}

// Sémantique "restaurer", pas "importer" : remplace l'état local plutôt que
// d'ajouter à côté (contrairement à RostersContext.importRoster, qui
// attribue toujours un nouvel id — approprié pour importer la bande d'un
// autre joueur, pas pour restaurer sa propre sauvegarde). Conserve les id
// d'origine des bandes pour qu'une restauration répétée reste idempotente
// au lieu de dupliquer à chaque fois.
export async function appliquerSauvegardeComplete(data: SauvegardeComplete): Promise<void> {
  const actuelles = await listRosters();
  const idsSauvegarde = new Set(data.rosters.map((r) => r.id));
  await Promise.all(actuelles.filter((r) => !idsSauvegarde.has(r.id)).map((r) => deleteRoster(r.id)));
  await Promise.all(data.rosters.map((r) => saveRoster(r)));
  const { regles_jeu, language, theme } = data.settings;
  if (regles_jeu !== undefined) await setSetting('regles_jeu', regles_jeu);
  if (language !== undefined) await setSetting('language', language);
  if (theme !== undefined) await setSetting('theme', theme);
}

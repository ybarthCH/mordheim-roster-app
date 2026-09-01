import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import type { Declaration, Plugin } from 'postcss';

// Deux cibles de déploiement possibles :
// - GitHub Pages (dev/staging) sert le projet sous /mordheim-roster-app/,
//   d'où le base path par défaut.
// - Le build de prod pour Infomaniak (musterheim.app, servi à la racine
//   de son propre domaine) est produit via `npm run build:prod`, qui met
//   DEPLOY_TARGET=root pour forcer base à "/".
// En dev (`npm run dev`), toujours servi à la racine.
const base = process.env.DEPLOY_TARGET === 'root' ? '/' : '/mordheim-roster-app/';

// Le CSS référence les assets de public/decor (icônes, cadres, bannières du
// pack) avec des chemins absolus (`url('/decor/...')`) : c'est le chemin
// final tel que servi une fois déployé à la racine. Vite ne réécrit jamais
// ces URLs absolues — par design, il laisse le développeur responsable du
// base path — donc sous GitHub Pages (base `/mordheim-roster-app/`), chaque
// `url('/decor/...')` résout vers la racine du domaine au lieu du sous-
// dossier du projet et 404 (icônes/cadres invisibles, quel que soit le
// navigateur). Ce plugin PostCSS préfixe ces chemins absolus par le base
// path au moment du build, une seule fois pour toutes les déclarations,
// plutôt que de réécrire individuellement chaque référence dans le CSS.
function rewriteRootAssetUrls(basePath: string): Plugin {
  const prefix = basePath === '/' ? '' : basePath.replace(/\/$/, '');
  return {
    postcssPlugin: 'rewrite-root-asset-urls',
    Declaration(decl: Declaration) {
      if (!prefix || !decl.value.includes('url(')) return;
      decl.value = decl.value.replace(/url\((['"]?)(\/[^'")]+)\1\)/g, (_match, quote: string, path: string) => {
        return `url(${quote}${prefix}${path}${quote})`;
      });
    },
  };
}

// Identifiant de build affiché sur l'écran d'accueil, pour distinguer un
// service worker resté sur un ancien cache d'un vrai dernier déploiement.
// Retombe sur 'dev' hors dépôt git (ex : archive téléchargée sans .git).
function gitShortSha() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'dev';
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? base : '/',
  css: {
    postcss: {
      plugins: [rewriteRootAssetUrls(command === 'build' ? base : '/')],
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(gitShortSha()),
    __APP_BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    react(),
    VitePWA({
      // 'prompt' + injectRegister: false : on enregistre nous-mêmes le service
      // worker via virtual:pwa-register/react (voir UpdateToast.tsx) plutôt
      // que le script auto-injecté par le plugin — nécessaire pour piloter
      // le moment du rechargement (bandeau "Nouvelle version" cliqué par le
      // joueur) au lieu d'un rechargement automatique et silencieux qui
      // pourrait interrompre une saisie ou fermer un écran en cours.
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: [
        'app-icons/icon-32.png',
        'app-icons/icon-192.png',
        'app-icons/icon-512.png',
        'app-icons/icon-512-maskable.png',
      ],
      manifest: {
        id: base,
        name: 'Musterheim',
        short_name: 'Musterheim',
        description: "Gestion de rosters de bandes Mordheim, 100% locale et hors-ligne.",
        theme_color: '#7a1414',
        background_color: '#17130f',
        display: 'standalone',
        orientation: 'any',
        start_url: base,
        scope: base,
        icons: [
          // Relative to the manifest's own URL, so it resolves correctly
          // regardless of the base path it's served under.
          { src: 'app-icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'app-icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          // Safe-zone variant for Android adaptive-icon masking (TWA) — the
          // artwork is scaled to ~66% of the canvas so it survives circle/
          // squircle/rounded-square masks without clipping.
          { src: 'app-icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Le nouveau service worker n'attend l'aval de l'utilisateur (bouton
        // "Actualiser") que pour SKIP_WAITING (voir registerType: 'prompt'
        // ci-dessus, qui génère déjà le bon listener de message dans
        // sw.js) — mais sans clientsClaim, une fois activé il ne prend
        // jamais le contrôle de l'onglet DÉJÀ OUVERT (seuls les nouveaux
        // onglets/navigations l'auraient comme contrôleur). Le clic sur
        // "Actualiser" envoyait donc bien SKIP_WAITING, mais l'événement
        // "controlling" que virtual:pwa-register/react attend pour
        // déclencher window.location.reload() ne se produisait jamais :
        // le bouton semblait ne rien faire (bug remonté par Yannick,
        // 2026-08-31). clientsClaim ne change rien au comportement
        // "jamais de rechargement automatique et silencieux" : il ne fait
        // que réagir à la prise de contrôle après un skipWaiting déjà
        // explicitement déclenché par l'utilisateur.
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,svg,png,webp,ico,json}'],
        // assetlinks.json proves domain ownership to Android's Digital Asset
        // Links verifier — it's fetched directly by the OS/Chrome, not by the
        // app, so it has no business in the app's own offline cache.
        globIgnores: ['.well-known/**'],
        // /privacy is a standalone static page, not a client-side route —
        // without this denylist, Workbox's NavigationRoute intercepts every
        // navigation request and serves index.html instead, so the page
        // never renders unless the browser bypasses the service worker
        // (e.g. a hard reload).
        navigateFallbackDenylist: [/^\/privacy$/],
      },
    }),
  ],
}));

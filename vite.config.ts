import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Deux cibles de déploiement possibles :
// - GitHub Pages (dev/staging) sert le projet sous /mordheim-roster-app/,
//   d'où le base path par défaut.
// - Le build de prod pour Infomaniak (musterheim.app, servi à la racine
//   de son propre domaine) est produit via `npm run build:prod`, qui met
//   DEPLOY_TARGET=root pour forcer base à "/".
// En dev (`npm run dev`), toujours servi à la racine.
const base = process.env.DEPLOY_TARGET === 'root' ? '/' : '/mordheim-roster-app/';

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
  define: {
    __APP_VERSION__: JSON.stringify(gitShortSha()),
    __APP_BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
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
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
        // assetlinks.json proves domain ownership to Android's Digital Asset
        // Links verifier — it's fetched directly by the OS/Chrome, not by the
        // app, so it has no business in the app's own offline cache.
        globIgnores: ['.well-known/**'],
      },
    }),
  ],
}));

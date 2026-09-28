import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
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
  resolve: {
    alias: {
      // Dépendances optionnelles de jsPDF, chargées uniquement par sa méthode
      // `.html()` que cette app n'utilise pas — voir le commentaire détaillé
      // dans build/jspdf-optional-stub.js. ~370 Ko de dist en moins.
      html2canvas: fileURLToPath(new URL('./build/jspdf-optional-stub.js', import.meta.url)),
      dompurify: fileURLToPath(new URL('./build/jspdf-optional-stub.js', import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [rewriteRootAssetUrls(command === 'build' ? base : '/')],
    },
  },
  define: {
    // 'prod' uniquement pour le build Infomaniak (musterheim.app) ; 'dev'
    // pour GitHub Pages ET le serveur de dev local — sert à isoler le
    // fichier de sauvegarde Google Drive (voir utils/googleDrive.ts) : le
    // Client ID OAuth étant partagé entre les trois origines autorisées, un
    // même compte Google connecté sur dev et sur prod pointerait sinon vers
    // le même appDataFolder et le même fichier, chaque sauvegarde de l'un
    // écrasant celle de l'autre.
    __DEPLOY_TARGET__: JSON.stringify(process.env.DEPLOY_TARGET === 'root' ? 'prod' : 'dev'),
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
        // woff2 était absent de cette liste (comme ttf/otf avant la conversion) :
        // les polices maison n'étaient donc JAMAIS précachées et, hors-ligne,
        // l'app retombait silencieusement sur les polices système (font-display:
        // swap). 212 Ko pour les six fichiers, indispensables à l'identité
        // visuelle d'une app qui se veut utilisable sans réseau.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,ico,json,woff2}'],
        // Les 52 bannières de bande (~3 Mo) sortent du précache : un joueur ne
        // consulte que les bandes qu'il possède, et les précacher imposait
        // ~3 Mo de téléchargement à la première visite pour des visuels
        // purement décoratifs. Elles passent en cache d'exécution (voir
        // runtimeCaching plus bas) : mises en cache à la première vue, puis
        // disponibles hors-ligne comme le reste.
        //
        // assetlinks.json prouve la propriété du domaine au vérificateur
        // Digital Asset Links d'Android — il est récupéré directement par
        // l'OS/Chrome, pas par l'app, donc il n'a rien à faire dans son
        // propre cache hors-ligne.
        globIgnores: ['.well-known/**', 'bandes/**'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/bandes/'),
            // StaleWhileRevalidate plutôt que CacheFirst : les bannières
            // viennent de public/, donc leur nom ne porte PAS de hash de
            // contenu. Tant qu'elles étaient précachées, le manifeste Workbox
            // portait leur révision et un changement de contenu se propageait
            // au déploiement suivant. En CacheFirst sans maxAgeSeconds, une
            // bannière une fois mise en cache n'aurait plus jamais été
            // revalidée — et avec 52 bannières pour 60 entrées, jamais évincée
            // non plus : retoucher une illustration n'aurait plus jamais
            // atteint les joueurs déjà passés dessus.
            //
            // StaleWhileRevalidate sert la version en cache immédiatement
            // (même confort qu'en CacheFirst, même disponibilité hors-ligne
            // où la revalidation échoue silencieusement) tout en rafraîchissant
            // en arrière-plan : une bannière modifiée est reprise à la vue
            // suivante. maxAgeSeconds borne en plus la durée de vie d'une
            // entrée jamais revue.
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'bannieres-bandes',
              // 52 bandes au catalogue : la limite laisse de la marge pour les
              // ajouts sans jamais évincer une bannière déjà vue.
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
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

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Served under https://ybarthCH.github.io/mordheim-roster-app/ in production
// (GitHub Pages project site); kept at "/" for local dev so `npm run dev`
// still serves from the root as usual.
const base = '/mordheim-roster-app/';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? base : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-32.png', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        id: base,
        name: 'Mordheim Roster',
        short_name: 'Mordheim',
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
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
      },
    }),
  ],
}));

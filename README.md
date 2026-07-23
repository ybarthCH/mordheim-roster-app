# Mordheim Roster

PWA (React + TypeScript + Vite) pour gérer des rosters de bandes du jeu
Mordheim, 100 % locale et hors-ligne — pensée pour un téléphone Android fold,
utilisée en cours de partie.

## Fonctionnalités

- Catalogue de 27 bandes (grades 1a, 1b, 1c — extraites de BSData et de
  suppléments) avec profils, caractéristiques, coûts et règles spéciales.
- Création de bande avec vérification du budget et des limites de composition
  (unique, max par profil).
- Fiche de roster en vue étendue (tableau sur grand écran / cartes en mode
  replié) : trésorerie, wyrdstone, armurerie de la bande (stock d'équipement
  non attribué), historique des batailles, classement de campagne
  multi-bandes.
- Fiche personnage en mode « table de jeu » : caractéristiques, équipement
  (achat depuis le shop commun, transfert vers/depuis l'armurerie de la
  bande), statut (actif / hors de combat / mort / blessé), compétences par
  catégorie, sorts/mutations, blessures graves, notes.
- Base d'équipement complète (armes, armures, munitions, montures,
  véhicules, poisons, objets divers...) avec accès filtré par bande et par
  compétences (Connaissance des Armes, Expert en Armes...).
- Cases XP à cocher fidèles à la feuille de référence : grille continue avec
  paliers (1, 2, 4, 8, 16…) pour les héros, 6 cases fixes pour les hommes de
  main.
- Avancées d'expérience et blessures graves : **aucun jet de dé n'est simulé
  dans l'app** — tous les jets se font sur table papier par le joueur, qui
  saisit ensuite le résultat obtenu via un assistant dédié (table 2D6
  d'avancement, table 1D10 de caractéristique, table D66 des blessures
  graves). L'app applique l'effet et conserve l'historique.
- Assistant post-bataille (résultat, exploration, vente de wyrdstone,
  blessures graves des hors de combat, gains d'XP).
- Import/export JSON du roster complet, export PDF de la feuille de bande.
- Écran de réglages : thème clair/sombre/système, choix de la couleur
  d'accent (rouge, noir & gris).
- Iconographie maison dessinée à la main (SVG, traits fins façon gravure sur
  bois), pas d'icon pack générique.
- Identifiant de build (commit court + date) affiché en bas de l'écran
  d'accueil, pour repérer un cache PWA resté sur une ancienne version.
- Stockage 100 % local via IndexedDB (aucun localStorage/sessionStorage).
- Installable en PWA, fonctionne hors-ligne.

## Développement

```bash
npm install
npm run dev       # serveur de dev
npm run build     # build de production (tsc + vite build)
npm run lint       # oxlint
```

## Déploiement

L'app est publiée automatiquement sur GitHub Pages à chaque push sur
`main`, via le workflow `.github/workflows/deploy-pages.yml` (build Vite +
`actions/deploy-pages`) : https://ybarthCH.github.io/mordheim-roster-app/

Le base path (`/mordheim-roster-app/`) est configuré dans `vite.config.ts`
(uniquement en build, `npm run dev` reste servi à la racine) et propagé au
manifest PWA et au service worker.

À activer une seule fois côté dépôt : Settings → Pages → Build and
deployment → Source = **GitHub Actions**.

## Structure

```
src/
  types/        modèles de données (catalogue, roster, compétences/tables)
  data/         catalogues de bandes (JSON), équipement (JSON), compétences, tables de jeu
  db/           accès IndexedDB (idb)
  state/        contextes React (rosters, thème/palette)
  utils/        calculs (valeur de bande, validation, XP, export, normalisation de roster)
  components/
    bandes/         liste des bandes + classement de campagne
    creation/        création de bande
    roster/          fiche de roster (vue étendue)
    personnage/      fiche personnage (mode table de jeu)
    postbataille/    assistant post-bataille
    reglages/        écran de réglages (thème, palette de couleurs)
    common/          Screen, Modal, ThemeToggle, Icon, ErrorBoundary
```

Le schéma `RosterInstance`/`Member` (`src/types/roster.ts`) s'enrichit
régulièrement de nouveaux champs. Toute lecture d'un roster stocké passe par
`normaliserRoster()` (`src/utils/normalize.ts`), qui comble les champs
manquants sur une bande créée avant leur ajout — à étendre à chaque nouveau
champ requis sur `RosterInstance`/`Member`.

## Notes sur les données

Certains profils issus de l'extraction BSData ont des champs incomplets
(accès aux tables de compétences non confirmé, coût manquant) : ils sont
signalés dans l'interface (`⚠ à vérifier`) plutôt que masqués.

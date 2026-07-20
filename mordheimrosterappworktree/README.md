# Mordheim Roster

PWA (React + TypeScript + Vite) pour gérer des rosters de bandes du jeu
Mordheim, 100 % locale et hors-ligne — pensée pour un téléphone Android fold,
utilisée en cours de partie.

## Fonctionnalités

- Catalogue de 15 bandes du grade 1a (extraites de BSData) avec profils,
  caractéristiques, coûts et règles spéciales.
- Création de bande avec vérification du budget et des limites de composition
  (unique, max par profil).
- Fiche de roster en vue étendue (tableau sur grand écran / cartes en mode
  replié) : trésorerie, wyrdstone, équipement en réserve, historique des
  batailles, classement de campagne multi-bandes.
- Fiche personnage en mode « table de jeu » : caractéristiques, équipement,
  statut (actif / hors de combat / mort / capturé), compétences par catégorie,
  sorts/mutations, notes.
- Cases XP à cocher fidèles à la feuille de référence : grille continue avec
  paliers (1, 2, 4, 8, 16…) pour les héros, 6 cases fixes pour les hommes de
  main.
- Avancées d'expérience et blessures graves : **aucun jet de dé n'est simulé
  dans l'app** — tous les jets se font sur table papier par le joueur, qui
  saisit ensuite le résultat obtenu via un menu déroulant (table 2D6
  d'avancement, table 1D10 de caractéristique, table 2D6 des blessures
  graves). L'app applique l'effet et conserve l'historique.
- Assistant post-bataille (résultat, exploration, vente de wyrdstone,
  blessures graves des hors de combat, gains d'XP).
- Import/export JSON du roster complet, export PDF de la feuille de bande.
- Stockage 100 % local via IndexedDB (aucun localStorage/sessionStorage).
- Mode sombre / clair (suit la préférence système par défaut).
- Installable en PWA, fonctionne hors-ligne.

## Développement

```bash
npm install
npm run dev       # serveur de dev
npm run build     # build de production (tsc + vite build)
npm run lint       # oxlint
```

## Structure

```
src/
  types/        modèles de données (catalogue, roster, compétences/tables)
  data/         catalogues de bandes (JSON), compétences, tables de jeu
  db/           accès IndexedDB (idb)
  state/        contextes React (rosters, thème)
  utils/        calculs (valeur de bande, validation, XP, export)
  components/
    bandes/         liste des bandes + classement de campagne
    creation/        création de bande
    roster/          fiche de roster (vue étendue)
    personnage/      fiche personnage (mode table de jeu)
    postbataille/    assistant post-bataille
    common/          Screen, Modal, ThemeToggle
```

## Notes sur les données

Certains profils issus de l'extraction BSData ont des champs incomplets
(accès aux tables de compétences non confirmé, coût manquant) : ils sont
signalés dans l'interface (`⚠ à vérifier`) plutôt que masqués.

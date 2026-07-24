# Handoff — Mordheim Roster App

Ce document sert à faire reprendre le travail par une autre session/IA sans
perte de contexte. Rédigé initialement le 24 juillet 2026 (limite d'usage
hebdomadaire de l'utilisateur, ybartholdi@gmail.com) puis mis à jour le même
jour après la livraison de deux nouvelles PR (#69, #70) — tout ce qui suit
est à jour à ce moment-là.

## C'est quoi, ce projet

Une PWA (React 19 + TypeScript + Vite 8) pour gérer des bandes (rosters) du
jeu de figurines Mordheim (Games Workshop). Stockage 100% local via
IndexedDB (`idb`), pas de backend. Navigation via `HashRouter` (nécessaire
pour un déploiement statique). Lint via `oxlint`.

L'app couvre : création de bande, recrutement, fiche personnage (stats,
équipement, compétences, avancées XP), assistant post-bataille pas à pas,
export JSON/PDF, partage natif (Web Share API), thème clair/sombre/palettes,
et 27 bandes du jeu entièrement converties en JSON depuis les PDF de
règles officielles/fan-made (dans `src/data/warbands/*.json`).

## Repo & branche

- Repo GitHub : `ybarthCH/mordheim-roster-app`
- Branche de travail : `claude/verify-mordheim-pwa-repo-y5i4bz` — **toujours
  développer ici**, jamais ailleurs sans autorisation explicite de
  l'utilisateur.
- Toutes les PR de cette session mergent dans `main` sur GitHub, et après
  chaque merge la branche de travail est réinitialisée sur `origin/main` —
  les deux avancent donc ensemble. **Piège** : la branche locale `main` du
  clone (si elle existe) peut rester très en retard (`git branch -vv`
  affichera "behind N") car elle n'est jamais checkout/mise à jour — ce
  n'est pas un problème, ignorer ce ref local et se fier uniquement à
  `origin/main` (toujours `git fetch origin main` avant de comparer).
- Au 24/07/2026 (soir), la branche de travail est propre (`git status`
  vide), synchronisée avec `origin/claude/verify-mordheim-pwa-repo-y5i4bz`
  et avec `origin/main`, HEAD = `e1ec082` (PR #70 mergée).

## Règles permanentes (autorisées par l'utilisateur en amont, ne pas redemander)

- Mode autonome : commit, push, ouvrir des PR et les merger **sans attendre
  de confirmation**.
- Ne jamais pousser sur une branche différente de celle assignée sans
  permission explicite.
- Après un merge : **ne jamais faire `git commit --amend`**. Toujours
  resynchroniser avec `git fetch origin main && git checkout -B
  claude/verify-mordheim-pwa-repo-y5i4bz origin/main && git push
  --force-with-lease -u origin claude/verify-mordheim-pwa-repo-y5i4bz`.
- Ne jamais mentionner l'identifiant du modèle (nom de modèle IA) dans les
  commits/PR/code.
- Ne jamais utiliser `git add -A` — toujours lister les fichiers modifiés
  explicitement.
- Pas de commentaires de code sauf si le "pourquoi" est non-évident (pas de
  commentaires qui décrivent le "quoi").
- Ne pas over-engineer : pas d'abstraction prématurée, pas de
  feature-flags, pas de code mort.

## Workflow établi pour chaque changement

1. Lire le code concerné avant d'éditer.
2. Éditer.
3. `npx tsc -b` (doit être 100% propre).
4. `npx oxlint` — **3 warnings pré-existants tolérés et acceptés comme
   normaux**, ne pas essayer de les corriger (pas liés à ce projet de
   fonctionnalités) :
   - `StatutCard.tsx:~53` — `react-hooks(exhaustive-deps)` sur
     `membre.taille_groupe`
   - `ThemeContext.tsx:68` — `react(only-export-components)`
   - `RostersContext.tsx:113` — `react(only-export-components)`
   Tout autre warning/erreur doit être corrigé avant de continuer.
5. `npm run build` (doit réussir).
6. Vérification fonctionnelle réelle avec Playwright (voir section
   dédiée ci-dessous) — pas juste "ça compile", mais "ça marche dans le
   navigateur".
7. Supprimer les scripts de test temporaires (`verify_*.mjs` etc. à la
   racine du repo — ne jamais les committer).
8. `git add <fichiers précis>` (jamais `-A`).
9. `git commit` avec un message qui explique le "pourquoi", sans
   attribution IA.
10. `git push -u origin claude/verify-mordheim-pwa-repo-y5i4bz`.
11. Créer une PR (`mcp__github__create_pull_request`), la merger en squash
    (`mcp__github__merge_pull_request`), puis resynchroniser la branche
    locale (voir section règles permanentes ci-dessus).

### Comment lancer Playwright dans cet environnement

Le navigateur Chromium est pré-installé mais **pas** à l'emplacement par
défaut de Playwright — il faut passer `executablePath` explicitement :

```js
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
```

Ne PAS lancer `npx playwright install` (inutile, et l'environnement bloque
le téléchargement de toute façon).

Pattern habituel de script de vérif (à écrire dans un fichier `.mjs` à la
racine du repo temporairement, PAS dans le scratchpad — sinon
`import('playwright')` échoue car `node_modules/playwright` est local au
repo) :

```js
import { chromium } from 'playwright';
// 1. lancer `npm run dev -- --port 5183` en arrière-plan avant le script
// 2. page.goto(BASE + '/') puis page.evaluate(...) pour seeder IndexedDB
//    directement (base 'mordheim-roster-db', version 1, object store
//    'rosters', clé = roster.id) — objets RosterInstance complets, avec
//    tous les champs requis du type Member (voir types/roster.ts).
// 3. page.goto vers une route HashRouter, PUIS page.reload() — la
//    navigation hash seule ne déclenche pas de vrai rechargement, donc le
//    seed IndexedDB n'est pas relu sans reload.
// 4. Piège classique : la vue desktop (.roster-table-wrap /
//    .roster-table__row-principale) ET la vue mobile (.member-cards /
//    .list-item) sont TOUJOURS montées en même temps (juste cachées en CSS
//    display:none selon la largeur d'écran) — un simple `text=Foo` matche
//    donc souvent 2 éléments (strict-mode violation ou clic sur l'élément
//    caché qui ne fait rien). Toujours scoper avec
//    `.roster-table__row-principale` pour cibler la version desktop.
// 5. Piège classique : `button:has-text("Ajouter")` matche aussi
//    `+ Ajouter` (sous-chaîne) — scoper avec `.modal-sheet
//    button:has-text(...)` pour ne cibler que le bouton de la modale
//    ouverte.
// 6. Après un clic qui navigue, ne pas se fier à un texte générique
//    présent sur les deux écrans (ex: "Actif" apparaît à la fois sur
//    RosterScreen ET PersonnageScreen) — utiliser
//    `page.waitForURL(/\/personnage\//)` ou un marqueur unique à l'écran
//    cible.
```

Après vérification : `pkill -f "vite --port 5183"` (ou équivalent) et
supprimer les scripts `.mjs` de test.

## Architecture — points d'entrée utiles

- `src/types/catalog.ts` — schéma du **catalogue** (référence en lecture
  seule : `WarbandCatalog`, `Profile`, équipement de bande, magie...).
- `src/types/roster.ts` — schéma de **l'instance** de bande du joueur
  (`RosterInstance`, `Member`, historique de bataille...). C'est ce qui est
  persisté en IndexedDB.
- `src/data/warbands/*.json` — 27 bandes converties depuis les PDF de
  règles (une par fichier, chargées via `src/data/warbands/index.ts` →
  `getCatalogue(id)` / `getProfil(bandeId, profilId)`).
- `src/data/items/*.json` + `src/data/items/index.ts` — base d'objets
  commune ("Place du Marché"), référencée par `item_id` depuis les listes
  d'équipement de chaque bande.
- `src/utils/factory.ts` — création (`creerRoster`, `creerMembre`) avec
  valeurs par défaut.
- `src/utils/normalize.ts` — **rétrocompatibilité** : toute lecture d'un
  roster depuis IndexedDB/import JSON passe par `normaliserRoster()` pour
  remplir les champs ajoutés après coup (sans ça, un vieux roster planterait
  l'UI sur un `.map()`/`.length` undefined). **Ne jamais oublier d'y ajouter
  un défaut quand on ajoute un champ à `RosterInstance`/`Member`.**
- `src/utils/validation.ts` — `peutAjouterMembre` (bloque vraiment le
  recrutement — rare cas de contrainte dure), `validerComposition`/
  `validerEffectif` (purement informatifs, n'empêchent rien).
- `src/utils/profil.ts` — `resolveProfil(roster, membre)` résout le profil
  effectif d'un membre (catalogue, ou franc-tireur custom, avec la
  promotion "Ce gars est doué" appliquée par-dessus si `promu_heros`).
- `src/utils/shop.ts` — achats/transferts d'équipement structuré.
- `src/components/roster/RosterScreen.tsx`,
  `src/components/personnage/PersonnageScreen.tsx`,
  `src/components/postbataille/PostBatailleScreen.tsx` — les 3 écrans
  principaux, chacun découpé en sous-composants dans leur dossier.
- `src/components/common/Icon.tsx` — iconographie 100% SVG faite main
  (trait fin, `stroke="currentColor"`, pas de fill) — toute nouvelle icône
  doit suivre exactement ce style.
- Pattern de rendu double desktop/mobile : `.roster-table-wrap` (table) et
  `.member-cards` (cartes) sont **tous les deux toujours montés**, un
  `@media (max-width: 720px)` bascule `display:none`/`block`. Piège connu :
  tout état/ref partagé entre les deux doit être qualifié par variante
  (table/card), voir `src/utils/useDragReorder.ts` pour l'exemple canonique
  (bug corrigé en PR #65).

## Dernière fonctionnalité livrée (PR #66 + #67) — système de succession du chef de bande

C'est la feature la plus complexe et la plus récente ; documentée ici en
détail car elle introduit un nouveau sous-système transversal.

### Demande initiale (verbatim de l'utilisateur, résumée)

1. **Règle générale** : à la mort du chef de bande, le leadership passe
   automatiquement au héros vivant de plus haut Commandement ; en cas
   d'égalité, le joueur choisit. Le profil du chef mort est banni à jamais
   du recrutement (ex : le Capitaine mercenaire mort ne peut plus jamais
   être recruté). Exception : les Morts-Vivants (Undead 1a) — un nouveau
   Vampire reste recrutable et reprend le leadership dès qu'il est recruté,
   même si un Nécromancien/Paria assurait l'intérim entre-temps.
2. **Lustrian Reavers (bande spéciale)** : le chef est choisi librement
   parmi les héros à la création de bande (pas de profil fixe). Aucun de
   leurs 5 héros uniques ne peut être recruté à nouveau une fois mort
   ("Rare Heroes"), mais un Prospect vivant peut être promu pour reprendre
   le rôle d'un héros tombé ("Promotions", comme "Ce gars est doué").

### Modèle de données ajouté

- `RosterInstance.leader_instance_id?: string` — chef assigné manuellement
  (choix libre, départage d'égalité, ou intérim).
- `RosterInstance.profils_bannis?: string[]` — profils bannis à jamais du
  recrutement pour ce roster.
- `Profile.leader_toujours_recrutable?: boolean` — exemption au
  bannissement (posé uniquement sur `vampire` dans `undead.json`).
- `Profile.unique?: boolean` (déjà existant) + `Profile.remplace_heros_tombe?: boolean`
  (posé sur `prospect` dans `lustrian_reavers.json`).
- `WarbandCatalog.leader_libre?: boolean` — chef choisi librement (Lustrian
  Reavers).
- `WarbandCatalog.bannir_profils_uniques_a_mort?: boolean` — n'importe quel
  héros unique banni à sa mort, pas seulement le chef (Lustrian Reavers).

### Logique centrale : `src/utils/leader.ts`

- `resolveLeader(roster, catalogue)` — résout le chef actuel par priorité :
  (1) le profil à `est_leader: true` du catalogue tant qu'un titulaire est
  vivant (couvre à la fois les bandes classiques à chef fixe ET la reprise
  automatique/obligatoire du Vampire — élégamment, sans code spécial : le
  Vampire garde `est_leader: true`, donc il redevient prioritaire dès qu'il
  existe, peu importe l'intérim en place) ; (2) sinon `leader_instance_id`
  s'il pointe vers un membre vivant ; (3) sinon aucun chef déterminé.
- `choixLeaderRequis(roster, catalogue)` — vrai si la bande utilise le
  mécanisme de leadership (`leader_libre` ou un profil `est_leader` existe
  dans le catalogue) mais qu'aucun chef n'est actuellement résolu, alors
  qu'il reste des héros vivants → déclenche la bannière + modale de choix
  sur `RosterScreen`.
- `estLeaderActuel(roster, catalogue, membre)` — helper d'affichage
  (badge, bonus XP victoire).
- `succederApresMorts(rosterAvant, catalogue, membresApres)` — **le cœur du
  système**, à appeler après *toute* transition de statut vers `'mort'`
  (peu importe la source : changement manuel, blessure grave, table du
  Seigneur des Ombres, résolution post-bataille). Compare l'état avant/après
  pour détecter qui vient de mourir, bannit le profil du chef mort (sauf
  exemption) + tout héros unique si `bannir_profils_uniques_a_mort`, et
  recalcule `leader_instance_id` (single survivor au Cd max → auto-assigné,
  sinon vidé pour déclencher le choix joueur).

Points d'appel de `succederApresMorts` (à connaître si un nouveau chemin de
mort est ajouté un jour — il **doit** y être branché aussi) :
`PersonnageScreen.changerStatut`, `PersonnageScreen.appliquerBlessureGrave`,
`PersonnageScreen`'s `AvanceeModal.onApply`, `PostBatailleScreen.terminer`,
`PostBatailleScreen.appliquerAvancee`, `RosterScreen`'s
`PromotionHerosDechuModal` → `AvanceeModal.onApply`.

### Enforcement dur

`peutAjouterMembre` (`src/utils/validation.ts`) bloque vraiment le
recrutement d'un profil dans `roster.profils_bannis` (pas juste
informatif). `validerComposition` ignore le minimum requis pour un profil
banni (sinon warning permanent et absurde — c'est le bug corrigé en PR
#67, remonté par l'utilisateur juste après le merge de la PR #66).

### Nouveau composant : `PromotionHerosDechuModal.tsx`

Mécanique Lustrian Reavers "Promotions" : liste les rôles vacants (profils
bannis dont aucun titulaire vivant n'existe) et les Prospects vivants
(`remplace_heros_tombe: true`), fait choisir ≥2 tables de compétences comme
pour "Ce gars est doué", crée le nouveau héros avec le profil du rôle
vacant (stats du profil cible, pas celles du Prospect), hérite des armes et
armures du héros tombé (catégories `armes_cac`/`armes_tir`/
`armes_poudre_noire`/`munitions`/`armures` — pas le reste de son
équipement), préserve l'XP du Prospect, et enchaîne immédiatement sur
`AvanceeModal` pour le jet sur la table d'avancement des héros. Déclenché
depuis une bannière dédiée sur `RosterScreen`.

### Où c'est branché dans l'UI

Bannière "Choisir un chef" + modale sur `RosterScreen.tsx`. Section de choix
de chef sur `CreationBandeScreen.tsx` (visible seulement si
`catalogue.leader_libre`). Badge "Leader" dynamique dans
`MemberGroupCard.tsx` (remplace l'ancien `profil?.est_leader` statique dans
5 endroits — `MemberGroupCard`, `PostBatailleScreen`, `EtapeGainXp`,
`EtapeResume`).

## Fonctionnalité livrée ensuite (PR #69) — système de magie structuré

### Demande initiale (verbatim résumé)

Un sorcier (Matriarche sigmarite, prêtre-guerrier, Maître de Cérémonie,
Nécromancien...) qui obtient une avancée "nouvelle compétence" peut à la
place apprendre un nouveau sort. Il fallait donc : une section dédiée
"Magie - Sort connu" (sortie de l'ancien fourre-tout "Règles spéciales /
Sorts connus / mutations", ce dernier renommé simplement "Règles
spéciales" puisque les mutations sont déjà automatisées via `stats_delta`
— PR #57), un sélecteur de premier sort obligatoire au recrutement d'un
sorcier, et la possibilité de choisir un nouveau sort à la place d'une
compétence lors d'une avancée.

### Modèle de données

- `Member.sorts_connus: string[]` (champ déjà existant) est **repurposé** :
  contient maintenant de vrais noms de sorts choisis via sélecteur
  (correspondant à `catalogue.magie.sorts[].nom`), plus du texte libre.
- `Member.regles_speciales_notes: string[]` (nouveau) reprend l'ancien
  usage texte-libre de `sorts_connus` (notes de règles spéciales
  manuscrites, hors magie/mutations).
- Migration automatique et idempotente dans `normaliserRoster` : si
  `regles_speciales_notes` est absent (roster jamais relu depuis ce
  changement), l'ancien contenu de `sorts_connus` bascule vers
  `regles_speciales_notes` et `sorts_connus` repart vide — sinon (déjà
  migré), chaque champ garde son contenu propre. Voir
  `normaliserMembre()` dans `src/utils/normalize.ts`.

### Logique centrale : `src/utils/magie.ts`

- `estSorcier(catalogue, profilId)` — vrai si `profilId` figure dans
  `catalogue.magie.utilisateurs` (aucun nouveau flag catalogue requis,
  cette liste existait déjà pour `MagieReference`).
- `sortsDisponibles(catalogue, dejaConnus)` — sorts du catalogue pas
  encore dans `dejaConnus`, proposés au choix.
- `resolveSort(catalogue, nom)` — synopsis complet d'un sort connu par son
  nom (undefined si legacy/texte-libre non reconnu — l'UI retombe alors
  sur l'affichage du texte brut).

### Où c'est branché

- `MagieConnueCard.tsx` (nouveau) — carte "Magie — Sort connu" sur
  `PersonnageScreen`, visible seulement si `estSorcier`. Liste synopsis +
  bouton d'ajout manuel de correction (pas de suppression de la
  contrainte "premier sort obligatoire", juste un filet de rattrapage).
- `ReglesSpecialesCard.tsx` (renommé depuis `SortsConnusCard.tsx`) — même
  mécanique texte-libre qu'avant, mais sur `regles_speciales_notes` et
  titrée "Règles spéciales".
- `ResumeCard.tsx` — section "Magie — Sort connu" ajoutée (gated
  `estSorcier`), section "Règles spéciales" adaptée au nouveau champ ;
  reçoit maintenant un prop `catalogue` en plus.
- `AjouterMembreModal.tsx` et `CreationBandeScreen.tsx`
  (`RecrutementDraftModal`) — champ "Premier sort connu" obligatoire
  (bloque le bouton de confirmation) dès que le profil sélectionné est un
  sorcier et qu'on ne rejoint pas un groupe existant.
- `AvanceeModal.tsx` — nouvelle étape `choix_voie_sort` (miroir de
  `choix_voie_competence` déjà existante pour le Seigneur des Ombres) :
  sur un résultat "nouvelle compétence" pour un profil sorcier, propose
  compétence normale vs nouveau sort ; nouvelle étape `sort` liste les
  sorts pas encore connus (radio, comme la liste de compétences),
  confirmer ajoute le nom à `sorts_connus` et journalise un
  `AdvanceRecord` de `type: 'sort'`.

## Fonctionnalité livrée ensuite (PR #70) — heure de build (CET/CEST)

Petite fonctionnalité de confort demandée par l'utilisateur après avoir
confondu une ancienne version en cache avec la dernière : le pied de page
de l'écran d'accueil (`ListeBandesScreen.tsx`) affichait déjà un hash git +
date de build (`__APP_VERSION__` / `__APP_BUILD_DATE__`, définis dans
`vite.config.ts` via `execSync('git rev-parse --short HEAD')` +
`new Date().toISOString()` au moment du build). Ajouté : un code horaire
compact type "1850 CEST" (fonction `heureBuildCET()` locale au composant,
`Intl.DateTimeFormat` sur le fuseau `Europe/Paris`, CET vs CEST distingués
via le décalage horaire renvoyé par `timeZoneName: 'shortOffset'` — pas de
flag catalogue ni changement de `vite.config.ts` nécessaire, tout se fait
à l'affichage à partir de `__APP_BUILD_DATE__` qui contenait déjà l'heure).

## Revue croisée par une autre IA (Codex) — corrections appliquées

L'utilisateur a fait relire le repo par Codex en parallèle. Bilan : données
cohérentes (pas d'id dupliqué, pas de référence d'objet manquante,
config magie/leadership valides), mais quelques points relevés :

- **Bug réel corrigé** : `duplicateRoster()` (`src/state/RostersContext.tsx`)
  régénérait les `instance_id` des membres dupliqués sans remapper
  `leader_instance_id` — sur une bande à leadership libre (Lustrian
  Reavers), le chef choisi était donc silencieusement perdu après
  duplication (retombait sur "aucun chef", bannière de choix). Corrigé en
  construisant une `Map` ancien→nouveau id et en l'utilisant pour
  remapper `leader_instance_id` (ou le vider proprement si absent).
- **Commentaire obsolète corrigé** : `src/data/items/index.ts` disait le
  shop commun "pas encore branché sur le roster" — c'est faux depuis
  longtemps (achat direct depuis la fiche personnage, voir
  `utils/shop.ts`). Reformulé.
- **Ce handoff corrigé** : mentionnait "~34 bandes", le repo en contient
  exactement 27 (`ls src/data/warbands/*.json | wc -l`) — corrigé aux deux
  endroits où le chiffre apparaissait.
- **Reproductibilité des builds** : `package-lock.json` était gitignoré
  (donc `npm install` en CI résolvait les versions à chaque run, pas de
  garantie de reproductibilité). Retiré du `.gitignore`, lockfile commité,
  et le workflow `deploy-pages.yml` bascule sur `npm ci` (installation
  stricte depuis le lock) au lieu de `npm install`.
- **CI ne lintait pas** : `deploy-pages.yml` ne faisait que `npm run
  build` (qui inclut déjà `tsc -b`, donc le typecheck était déjà couvert)
  sans jamais lancer `oxlint`. Ajouté une étape `npx oxlint` avant le
  build — exit code 0 même avec les 3 warnings pré-existants tolérés
  (`oxlint` ne fait échouer le job que sur de vraies erreurs), donc rien
  à craindre côté faux positifs.
- **Points relevés mais volontairement non traités** (décisions de scope,
  pas des oublis) :
  - Pas de suite de tests automatisés — seulement des scripts Playwright
    temporaires (`verify_*.mjs`, jamais committés, voir workflow plus
    haut). Mettre en place une vraie suite (Vitest/Playwright committé)
    serait un chantier à part entière, à ne lancer que si l'utilisateur
    le demande explicitement — pas fait ici pour ne pas engager un choix
    d'outillage structurant sans son accord.
  - La migration `sorts_connus` → `regles_speciales_notes` (PR #69) reste
    une heuristique assumée (voir section magie ci-dessus) — comportement
    voulu, pas un bug, mais à garder en tête si un cas limite remonte un
    jour (roster avec `regles_speciales_notes` déjà défini à `[]`
    explicitement AVANT ce changement — cas quasi impossible vu que le
    champ n'existait pas avant, mais notons-le).

## État actuel

Tout ce qui précède (PR #57 à #70) est **mergé et déployé**. HEAD =
`e1ec082`. Le tree est propre. Rien n'est en cours. La liste de tâches
interne (TaskCreate/TaskUpdate) contient ~178 entrées historiques toutes
marquées `completed` — certaines ont pu être marquées completed
rétroactivement par inférence depuis un résumé de session compressé plutôt
que vérifiées une à une ; en cas de doute sur un point précis de
l'historique, se fier au contenu réel du code et à `git log`, pas à la
liste de tâches.

## Pour reprendre le travail

1. Vérifier `git status` et `git log -5` pour confirmer l'état ci-dessus
   n'a pas changé entre-temps.
2. Attendre la prochaine demande de l'utilisateur — rien n'est en attente
   actuellement.
3. Si l'utilisateur référence un point de règle Mordheim spécifique à une
   bande non encore implémenté, suivre le même pattern que la session
   "leader succession" ci-dessus : lire le PDF/les règles fournies,
   identifier si c'est une règle générale (→ nouveau champ générique
   réutilisable) ou spécifique à une bande (→ flag scoping le nouveau
   comportement à cette bande précise), implémenter, vérifier avec
   Playwright, livrer avec le workflow standard.

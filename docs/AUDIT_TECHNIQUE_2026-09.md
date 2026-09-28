# Audit technique — septembre 2026

Passe technique complète sur Musterheim : poids du `dist` livré à l'hébergeur
(contrainte dure : **10 Mo**), architecture du bundle, code mort, duplications
et bugs structurels.

Base auditée : `origin/main` à `946477f`. Deux catégories dans ce document :

- **[FAIT]** — corrigé dans la passe d'audit, mesuré et vérifié.
- **[À FAIRE]** — constat documenté, correction non appliquée (trop risquée
  pour une passe automatique, ou relevant d'une décision produit / d'un audit
  de règles).

---

## 1. Poids du `dist` — le sujet le plus urgent

### État initial : 9,75 Mo sur 10 Mo disponibles (97,5 %)

Le déploiement passait à **250 Ko près** de la limite de l'hébergeur. Toute
nouvelle bande (≈ 86 Ko de bannière) ou toute grosse dépendance aurait fait
échouer la mise en ligne, sans signal d'alerte préalable.

| Poste | Avant | Après | Gain |
|---|---:|---:|---:|
| `bandes/` (52 bannières) | 4,38 Mo | 2,99 Mo | −1,39 Mo |
| `assets/` (JS) | 3,60 Mo | 3,30 Mo | −0,30 Mo |
| `app-icons/` | 674 Ko | 113 Ko | −561 Ko |
| `fonts/` | 546 Ko | 212 Ko | −334 Ko |
| `decor/` | 852 Ko | 776 Ko | −76 Ko |
| **Total `dist`** | **9,75 Mo** | **7,20 Mo** | **−2,55 Mo (−26 %)** |

Marge restante : **2,8 Mo** au lieu de 250 Ko. En prime, le précache du
service worker passe de **9 400 Kio à 4 273 Kio** : la première visite
télécharge moitié moins.

### 1.1 [FAIT] Icônes PWA — 674 Ko → 113 Ko

`icon-512.png` pesait **418 Ko** : un PNG RGB pleine profondeur pour une
illustration de 512×512. Réencodé en palette 256 couleurs avec tramage
Floyd-Steinberg → **70 Ko**.

Qualité mesurée sur `icon-512.png` : RMS 2,69, écart maximum 13/255 par canal
(l'original contient 30 708 couleurs distinctes). Imperceptible. Les quatre
icônes du manifeste ont subi le même traitement.

### 1.2 [FAIT] Polices — 546 Ko → 212 Ko, et deux polices mortes

Les huit polices étaient servies en `.ttf`/`.otf` bruts. Converties en
**WOFF2** (seul format du lot compressé en Brotli) : −55 % en moyenne.

Deux polices n'étaient référencées **nulle part** hors de leur propre
`@font-face`, supprimées avec leur déclaration :

- `GaramondCondLightItalic.otf` (36 Ko) — famille `Garamond Cond Light`, aucun
  `font-family` ne l'appelle, aucun token `--font-*` ne la cite.
- `Schoensperger.otf` (25 Ko) — n'apparaît plus que dans des commentaires CSS,
  dont un qui dit explicitement que la bannière logo a *remplacé* l'ancien
  titre texte qui l'utilisait.

Pas de repli `.ttf` conservé : il doublerait le poids embarqué pour des
navigateurs incapables de faire tourner la PWA de toute façon.

### 1.3 [FAIT] Bug : les polices n'étaient pas précachées

`workbox.globPatterns` valait `['**/*.{js,css,html,svg,png,webp,ico,json}']` —
ni `ttf`, ni `otf`, ni `woff2`. **Les polices maison n'ont donc jamais été mises
en cache hors-ligne** : sans réseau, l'app retombait silencieusement sur les
polices système (`font-display: swap`), perdant toute son identité visuelle,
pour une app qui se revendique « 100 % locale et hors-ligne ».

`woff2` ajouté aux `globPatterns`.

### 1.4 [FAIT] Bannières de bande — 4,38 Mo → 2,99 Mo

52 illustrations en 1600×450. Réencodées en WebP qualité 70, **sans toucher aux
dimensions** : aucune perte de netteté, seule la compression change. RMS mesuré
entre 2,1 et 2,6 sur l'échantillon — invisible sur un fond décoratif recouvert
d'un voile dégradé.

Un redimensionnement (1440 px, −45 %) a été écarté : le conteneur de l'app fait
1100 px de large, donc 1600 px est déjà sous la barre du rendu retina desktop.

### 1.5 [FAIT] Bannières hors du précache

Les 52 bannières (≈ 3 Mo) étaient **précachées** : chaque première visite
téléchargeait les illustrations des 52 bandes alors qu'un joueur n'en consulte
que les siennes. Elles passent en `runtimeCaching` / `CacheFirst` (cache
`bannieres-bandes`, 60 entrées) : mises en cache à la première vue, puis
disponibles hors-ligne exactement comme avant.

### 1.6 [FAIT] `decor/` : ne pas y toucher (sauf la bannière d'accueil)

Constat contre-intuitif, vérifié : les sprites d'interface de `decor/` sont
**déjà encodés de façon optimale**. Un réencodage à qualité équivalente (q92)
les *alourdit* de 53 Ko. Ils portent presque tous un canal alpha et des bords
nets, où le lossy crée du ringing visible. **Laisser tel quel.**

Seule exception traitée : `home-hero-banner.webp`, visuel photographique sans
alpha, 144 Ko → 69 Ko à dimensions inchangées.

### 1.7 [FAIT] 220 Ko de JS mort : `html2canvas` et `dompurify`

Ces deux paquets représentaient **220 Ko du bundle** sans qu'aucun chemin de
code puisse les atteindre. Ils entrent par le graphe d'imports de `jspdf`, qui
les charge via un `import()` dynamique **uniquement depuis sa méthode
`.html()`** (HTML → PDF), déjà entourée d'un `try/catch` qui retombe sur
`Promise.reject`.

Or `utils/pdfExport.ts` n'appelle jamais `.html()` : il construit ses fiches
avec les seules API texte de jsPDF (`setFont`/`setFontSize`/`text`) et
`jspdf-autotable`. Neutralisés par `resolve.alias` vers
`build/jspdf-optional-stub.js`.

> Pour réactiver `jsPDF.html()` un jour : retirer l'alias correspondant dans
> `vite.config.ts`, rien d'autre à défaire.

### 1.8 [À FAIRE] Le chunk de données de 1,62 Mo

`dist/assets/hiredSwords-*.js` pèse **1,62 Mo** (407 Ko gzip) — la moitié du JS
livré. Le nom est trompeur : c'est le chunk partagé qui agrège **toutes** les
données de jeu.

Répartition des sources :

| Source | Poids |
|---|---:|
| `src/i18n/data/` (couche anglaise) | **840 Ko** |
| ↳ dont `i18n/data/warbands.ts` | 400 Ko |
| ↳ dont `i18n/data/items.ts` | 264 Ko |
| `src/data/warbands/*.json` (52 bandes) | 725 Ko |
| `src/data/items/*.json` | 367 Ko |
| `src/data/hiredSwords.ts` | 96 Ko |

Deux problèmes distincts, à ne pas confondre :

**a) La couche anglaise est livrée à 100 % des utilisateurs** (840 Ko), quelle
que soit leur langue. Un découpage dynamique (`import()` du module EN
uniquement quand `language === 'en'`) allégerait le **premier chargement** de
moitié. Mais les fonctions `translateX(obj, language)` sont synchrones et
appelées en plein rendu : il faudrait que `LanguageProvider` préharge le module
avant le premier rendu. Faisable (il charge déjà la langue depuis IndexedDB de
façon asynchrone), mais ça touche toute la chaîne de rendu.

**b) Les 52 catalogues de bande sont chargés d'un bloc** alors qu'une session
en consulte une ou deux. `getCatalogue(id)` est synchrone et utilisé partout,
y compris par l'écran d'accueil pour les bannières. Passer à un chargement par
id est un refactor profond.

> ⚠️ **Attention à la distinction** : découper en chunks n'allège **pas** le
> `dist` sur le disque de l'hébergeur — les fichiers y sont toujours, juste
> répartis autrement. Ça n'aide que le premier chargement. Pour gagner du
> **disque**, le seul vrai levier restant est la déduplication des données
> (§ 1.9).

### 1.9 [À FAIRE] Déduplication des données de bande

Piste non chiffrée mais prometteuse : les 52 JSON de bande répètent en clair
des règles spéciales génériques identiques (Peur, Frénésie, Stupidité,
Haine...) — 1 475 occurrences de `regles_speciales` dans le chunk. Les
extraire dans une table commune référencée par id réduirait à la fois le disque
et le chunk. Chantier de données, à faire bande par bande avec vérification.

---

## 2. Code mort

Détecté par analyse des exports jamais importés, puis vérifié un par un.

### 2.1 [FAIT] Une table de blessures graves fantôme — et fausse

`src/data/gameData.ts` exportait `BLESSURES_GRAVES`, alimenté par
`src/data/blessures_graves.json` : une table **2D6 de 11 entrées**, vestige
d'une première version de l'app.

La vraie table utilisée est la table **D66** de `src/data/blessuresGraves.ts`,
importée par `BlessureGraveWizard`. Les deux exportaient le **même nom** depuis
deux modules différents — piège classique à l'autocomplétion.

Pire : la table fantôme est **fausse au regard des règles** (résultats 2D6 qui
ne correspondent pas à la table officielle D66). La laisser traîner, c'était
laisser un futur contributeur — ou un audit de règles — travailler sur la
mauvaise source.

Supprimés : `blessures_graves.json`, l'export `BLESSURES_GRAVES` de
`gameData.ts`, le type `InjuryEntry` qui ne servait qu'à lui.

### 2.2 [FAIT] `legend.json` : importé, exporté, inatteignable

`src/data/items/index.ts` importait `legend.json` et l'exposait comme
`ITEMS_LEGEND` — mais ce fichier était **volontairement absent de
`TOUS_LES_ITEMS`**, donc introuvable via `getItem()`, et `ITEMS_LEGEND` n'était
importé nulle part. Du contenu embarqué qu'aucun écran ne pouvait afficher.

Supprimé avec les **12 constantes `ITEMS_*` par catégorie** (`ITEMS_ARMURES`,
`ITEMS_TIR`…), toutes exportées et jamais importées. Il ne reste que
`TOUS_LES_ITEMS`, `ITEMS_PAR_ID` et `getItem` — les trois seuls points d'entrée
réellement consommés.

### 2.3 [FAIT] Quatre fonctions exportées jamais appelées

| Fonction | Fichier |
|---|---|
| `retirerEffetPersistant` | `utils/effetsPersistants.ts` |
| `fragmentsTrouves` | `data/tableExplorationWyrdstone.ts` |
| `contributionProfilMembre` | `utils/powerValue.ts` |
| `creerMembreFrancTireur` | `utils/factory.ts` |

Supprimées. `retirerEffetPersistant` était le pendant symétrique
d'`ajouterEffetPersistant` : si un futur écran doit retirer un effet
persistant, l'historique git la restitue en une commande.

---

## 3. Duplications

### 3.1 [FAIT] Le type `CategorieInterdite` existait en triple

La même union de six catégories était écrite **trois fois** :

- inline sur `Profile.categories_interdites` (`types/catalog.ts`) ;
- inline sur `Profile.categories_interdites_commun`, à l'identique ;
- comme type nommé `CategorieInterdite` exporté par `utils/shop.ts` — **que
  personne n'importait**.

Ajouter une catégorie demandait donc trois modifications cohérentes, sans que
le compilateur signale un oubli. Le type nommé est remonté dans
`types/catalog.ts`, à côté des champs qui le portent, et les deux champs
l'utilisent.

### 3.2 [À FAIRE] Le plus gros clone réel : sélection matériau/base

**28 blocs dupliqués** entre :

- `components/personnage/AchatEquipementModal.tsx:597`
- `components/postbataille/RechercheObjetRareModal.tsx:428`

C'est tout le parcours « choisir un matériau, puis une base » qui est recopié.
Signe révélateur : `RechercheObjetRareModal` consomme des clés i18n du
namespace `achatEquipement.*` (`chooseBaseNote`, `searchBasePlaceholder`,
`noBaseAvailable`, `chooseOtherBase`…), preuve d'un copier-coller assumé.

**Correction proposée** : extraire un composant `SelectionMateriauBase`
(catalogue filtré + champ de recherche + en-tête de sélection) consommé par les
deux modales, avec son propre namespace i18n.

### 3.3 [À FAIRE] Autres clones significatifs

| Emplacements | Nature |
|---|---|
| `CloudBackupSection.tsx:71` ↔ `ListeBandesScreen.tsx:308` (17 blocs) | Bloc sauvegarde/restauration Drive dupliqué |
| `utils/useCardDragReorder.ts:125` ↔ `utils/useDragReorder.ts:198` (3 blocs) | Deux hooks de glisser-déposer qui se recouvrent |
| `utils/pdfExport.ts:183` ↔ `:281` | Section de fiche PDF recopiée |
| `RosterScreen.tsx:524/540/557/574/594` | 5 blocs `banner-danger` quasi identiques → candidat à un `<BanniereDanger>` |

---

## 4. Bugs et fragilités

### 4.1 [FAIT] Pied de page en anglais quelle que soit la langue

Deux paragraphes du pied de `ListeBandesScreen` étaient écrits **en anglais en
dur dans le JSX**, sans passer par `t()` : l'avertissement sur le stockage
local et la mention Games Workshop. Ils restaient en anglais avec l'interface
en français (visible sur capture d'écran).

Extraits en `home.localDataWarning` et `home.gamesWorkshopDisclaimer`. Cas
EN → FR (l'anglais existait, le français manquait) : traduction directe,
conforme à la politique de traduction du projet.

> Un balayage systématique du reste des composants n'a **pas** trouvé d'autre
> chaîne littérale rendue en JSX : la couverture i18n est solide par ailleurs.

### 4.2 [À FAIRE] `lame_des_etoiles` : divergence de **règles**, pas de traduction

`npm run check:i18n` signale depuis longtemps :

```
[items] lame_des_etoiles — regles_speciales : FR a 1 entrée(s), EN en a 2.
```

Ce n'est **pas** un trou de traduction. La version anglaise porte une règle
supplémentaire absente du français :

> **+1 Enemy Save** — *An enemy Wounded by this weapon gets +1 to his armour
> save, or a 6+ save if he has none.*

L'anglais étant la langue d'origine des suppléments et généralement le plus
juste, la règle manque probablement côté français. **Non corrigé
volontairement** : trancher demande de vérifier le PDF Amazones du Setting
Lustrie (p. 11), ce qui relève de `mordheim-rules-auditor`. Le script continue
à le signaler — c'est le comportement souhaité, pas du bruit.

### 4.3 [À FAIRE] `jsx-no-constructed-context-values` dans `UpdateSWContext`

`UpdateSWContext.tsx:62` construit l'objet `value` du contexte à chaque rendu,
sans `useMemo` — chaque rendu du provider re-rend tous ses consommateurs. Les
autres contextes du projet (`LanguageContext`) mémoïsent déjà correctement,
avec un commentaire expliquant pourquoi. Incohérence à aligner.

### 4.4 [À FAIRE] Masquage de variables (`no-shadow`)

Le plus gênant : `PostBatailleScreen.tsx:326` redéclare **`t`** dans une portée
interne, alors que `t` est la fonction de traduction utilisée partout. Piège à
relecture. Autres cas : `PersonnageScreen` (`id`, `instanceId` ×3),
`MemberGroupCard` (`peutAjouterXp` ×2), `RecruterFrancTireurScreen`,
`RosterScreen`, `pdfExport` (`doc` ×2).

### 4.5 [À FAIRE] `no-accumulating-spread` dans les boucles

Accumulateurs recopiés à chaque itération (complexité quadratique) :
`utils/shop.ts:1680`, `AjouterMembreModal.tsx:311` et `:314`,
`BlessureGraveWizard.tsx:461`. Sans effet perceptible aux tailles actuelles
(quelques dizaines d'éléments), mais gratuit à corriger.

---

## 5. Ce qui va bien

Pour équilibrer : l'audit n'a trouvé **aucun** bug de logique de jeu, **aucune**
fuite de données, **aucune** dépendance obsolète ou vulnérable bloquante.

- Découpage en routes lazy-loadées déjà en place et efficace.
- Couverture i18n quasi totale (un seul trou, corrigé).
- Commentaires d'intention d'une densité rare, qui expliquent le *pourquoi*
  (plusieurs corrections de cet audit n'ont été possibles qu'en les lisant).
- Séparation données / logique / présentation respectée.
- Le script `check:i18n` fait exactement son travail : il a survécu à l'audit
  en signalant un vrai problème (§ 4.2).

---

## 6. Récapitulatif chiffré

```
dist        9,75 Mo  ->  7,20 Mo    (-2,55 Mo, -26 %)
marge/10Mo  0,25 Mo  ->  2,80 Mo    (x11)
précache    9 400 Kio -> 4 273 Kio  (-55 %)
```

Vérifications passées après modifications : `tsc -b --force`, `oxlint`,
`check:i18n` (seul `lame_des_etoiles` subsiste, cf. § 4.2), `vite build`,
et contrôle visuel Playwright en `deviceScaleFactor: 2` — polices WOFF2
effectivement chargées (`document.fonts.status = loaded`), bannière réencodée
et icônes sans artefact visible.

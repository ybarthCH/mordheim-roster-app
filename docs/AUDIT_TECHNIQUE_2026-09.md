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

### 1.5 [FAIT] Bannières hors du précache — en `StaleWhileRevalidate`

Les 52 bannières (≈ 3 Mo) étaient **précachées** : chaque première visite
téléchargeait les illustrations des 52 bandes alors qu'un joueur n'en consulte
que les siennes. Elles passent en `runtimeCaching` (cache `bannieres-bandes`,
60 entrées) : mises en cache à la première vue, puis disponibles hors-ligne.

> **Correctif après revue QA.** La première version de ce changement utilisait
> `CacheFirst` sans `maxAgeSeconds` — une régression de maintenabilité que la
> revue a justement relevée. Les bannières viennent de `public/`, donc leur nom
> ne porte **pas** de hash de contenu ; tant qu'elles étaient précachées, le
> manifeste Workbox portait leur révision et un changement de contenu se
> propageait au déploiement suivant. En `CacheFirst` sans expiration, une
> bannière mise en cache n'aurait plus jamais été revalidée — ni évincée (52
> bannières pour 60 entrées) : **retoucher une illustration n'aurait plus
> jamais atteint les joueurs déjà passés dessus.**
>
> Corrigé en `StaleWhileRevalidate` + `maxAgeSeconds` de 90 jours : la version
> en cache est servie immédiatement (même confort, même disponibilité
> hors-ligne où la revalidation échoue silencieusement) et rafraîchie en
> arrière-plan, donc une bannière modifiée est reprise à la vue suivante.
>
> **Limite de vérification, à lever au prochain déploiement.** Le `sw.js`
> généré a bien été inspecté (handler `StaleWhileRevalidate`, `maxAgeSeconds`
> à 7776e3 = 90 jours, zéro entrée `bandes/` en précache). En revanche le
> chemin hors-ligne *de cette variante* n'a **pas** pu être rejoué de bout en
> bout : le service worker refusait de prendre le contrôle de façon
> reproductible dans le harnais Playwright. Ce qui est établi : le chemin
> hors-ligne a été validé par la revue QA sous `CacheFirst` (serveur réellement
> coupé, SW contrôleur), et `StaleWhileRevalidate` ne modifie que la
> revalidation, pas le service depuis le cache — c'est le contrat documenté de
> Workbox. À confirmer d'un coup d'œil au premier déploiement plutôt que tenu
> pour acquis.

Compromis assumé, et sa dégradation a été vérifiée : une bannière **jamais
consultée** n'est pas disponible hors-ligne. Sur l'écran de création hors-ligne
avec une faction jamais vue, le conteneur `.creation-banniere` se replie à 0 px
— pas d'icône d'image cassée, pas de trou dans la mise en page. Sur l'accueil,
c'est un `background-image` : absence = fond neutre.

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

### 4.3 [FAIT] L'export PDF ne suivait pas la langue de l'interface

Constat de la revue QA, **déjà présent sur `main`**. Un PDF exporté avec
l'interface en anglais sortait avec tous ses intitulés en français :
`Bande :`, `TRÉSORERIE`, `Valeur de bande :`, `Héros`,
`Hommes de main & créatures`. `utils/pdfExport.ts` ne recevait tout simplement
pas la langue.

L'extraction du texte des PDF générés a montré que le trou était **plus
profond que ce que la revue supposait** : ce n'étaient pas seulement les
libellés de structure, mais aussi le nom de la bande de référence
(`Horde Orque (1a)`), les noms de profils (`Chef Orque`) et les catégories de
compétences (`Tir`, `Force`, `Érudition`) — `getCatalogue()` renvoyait le
catalogue brut, jamais `translateWarbandCatalog()`, et `resolveProfil()` était
appelé sans catalogue ni langue.

Corrigé de bout en bout. `exporterRosterPDF(roster, rules, language)` reçoit la
langue depuis `RosterScreen`, les ~30 libellés sont sortis dans un namespace
`src/i18n/ui/pdfExport.ts`, le catalogue est traduit et les catégories de
compétences passent par `skillCategory.*`. La locale de date du pied de page
était elle aussi figée (`fr-FR`).

> **Anglais : d'où il vient.** La majorité des termes existaient déjà traduits
> ailleurs dans l'interface (Treasury, Heroes, Henchmen, Warband rating, Battle
> history, Date, Result, Notes, Tribe) — leur formulation est reprise telle
> quelle, pas réinventée. Les intitulés propres au PDF sans équivalent existant
> sont des **propositions**, marquées une par une dans le fichier i18n :
> `List:`, `Record: W/L/D`, `WARBAND STANDING`, `Total XP:`, `heroes,
> follower(s)`, `EQUIPMENT IN RESERVE`, `Opponent`, `Killed in action:`,
> `Group experience:`, `generated on`, `Page X of Y`, et la note sur le
> plafond racial. Conformément à la politique FR → EN du projet, elles
> attendent validation — une correction tient en une ligne du namespace.

Vérifié en générant réellement les deux PDF et en extrayant leur texte. Ce qui
reste identique entre les deux versions est correct : le nom que le joueur a
donné à sa bande, `MORDHEIM`, `Combat` (même mot dans les deux langues), et les
noms des figurines, enregistrés au recrutement — ce sont des noms, pas des
libellés.

### 4.4 [À FAIRE] `jsx-no-constructed-context-values` dans `UpdateSWContext`

`UpdateSWContext.tsx:62` construit l'objet `value` du contexte à chaque rendu,
sans `useMemo` — chaque rendu du provider re-rend tous ses consommateurs. Les
autres contextes du projet (`LanguageContext`) mémoïsent déjà correctement,
avec un commentaire expliquant pourquoi. Incohérence à aligner.

### 4.5 [À FAIRE] Masquage de variables (`no-shadow`)

Le plus gênant : `PostBatailleScreen.tsx:326` redéclare **`t`** dans une portée
interne, alors que `t` est la fonction de traduction utilisée partout. Piège à
relecture. Autres cas : `PersonnageScreen` (`id`, `instanceId` ×3),
`MemberGroupCard` (`peutAjouterXp` ×2), `RecruterFrancTireurScreen`,
`RosterScreen`, `pdfExport` (`doc` ×2).

### 4.6 [À FAIRE] `no-accumulating-spread` dans les boucles

Accumulateurs recopiés à chaque itération (complexité quadratique) :
`utils/shop.ts:1680`, `AjouterMembreModal.tsx:311` et `:314`,
`BlessureGraveWizard.tsx:461`. Sans effet perceptible aux tailles actuelles
(quelques dizaines d'éléments), mais gratuit à corriger.

---

## 5. Seconde passe — robustesse, garde-fous, intégrité

### 5.1 [FAIT] `normaliserRoster` : les nombres n'étaient pas protégés

`utils/normalize.ts` protège soigneusement les tableaux (`tableauSur`), les
objets (`objetSur`) et la photo (`photoSure`) contre un champ présent mais du
mauvais type — le fichier explique même pourquoi `??` ne suffit pas. Mais les
champs **numériques** étaient restés en `?? defaut`, qui ne se déclenche que
sur `undefined`. Même classe de bug, traitée partout sauf là.

Conséquences concrètes sur un JSON importé (édité à la main, tronqué, produit
par un outil tiers) :

| Entrée | Avant | Effet |
|---|---|---|
| `tresorerie: "50"` | reste la chaîne `"50"` | `"50" + 20` → `"5020"` |
| `tresorerie: NaN` | reste `NaN` | contamine tout calcul, sans recours joueur |
| `taille_groupe: 0` | reste `0` | `quantite % 0` → `NaN`, affichage des groupes cassé |
| `stats_actuels: { M: "trois" }` | reste la chaîne | fausse valeur de bande et plafonds |

Neuf champs de roster/membre plus les neuf caractéristiques passent désormais
par un helper `nombreSur`. Il **convertit** une chaîne numérique plutôt que de
la rejeter (elle porte une intention lisible : rejeter ferait perdre au joueur
sa valeur) et borne les seuls compteurs.

> ⚠️ Piège évité : borner `tresorerie` à 0 aurait été une régression.
> `RosterSummaryCard` autorise explicitement la saisie d'un `-` et affiche une
> trésorerie négative en rouge (`var(--danger)`) — **la dette est un état
> conçu**. `tresorerie` et `wyrdstone` restent donc non bornés.

Vérifié sur les 52 bandes : aller-retour sans perte et normalisation
idempotente, trésorerie négative préservée.

### 5.2 [FAIT] Le déploiement ne contrôlait pas la taille de `dist`

Le commentaire de l'étape `lftp` du workflow Infomaniak documente que le quota
de 10 Mo **a déjà été saturé plusieurs fois** (un bug de déploiement empilait
des copies). Ce bug-là est corrigé, mais rien ne vérifiait la taille du build
avant envoi — d'où les 9,75 Mo atteints en silence.

`deploy-infomaniak.yml` gagne une étape de contrôle, entre le build et
l'envoi : **erreur au-delà de 9,5 Mo** (on refuse d'envoyer un build qui ne
tiendra pas), **avertissement au-delà de 8,5 Mo**, et les dix plus gros
fichiers listés dans tous les cas pour que l'échec dise directement quoi
optimiser. Mesure actuelle : 7 728 Ko, soit 1 772 Ko de marge sous le seuil
d'erreur.

### 5.3 [FAIT] `check:i18n` ne voyait ni les collisions ni les clés absentes

`uiDictionary` est un simple étalement d'objets (`i18n/ui/index.ts`) : une clé
déclarée dans deux namespaces voit la dernière fusionnée **écraser
silencieusement** l'autre. Et une clé passée à `t()` sans être déclarée fait
afficher la clé brute à l'écran (`roster.exportPdf` au lieu d'un libellé).
Aucun des deux n'était surveillé.

Le script couvre maintenant les deux, et a immédiatement trouvé
**`resume.title` déclarée à la fois dans `etapeResume.ts` et
`personnageCards.ts`** — mêmes valeurs aujourd'hui, donc sans effet visible,
mais toute divergence future serait passée inaperçue. Dédupliquée.

Bilan : 1 254 clés, 0 clé manquante, 0 collision. Les clés déclarées sans
usage sont seulement **comptées** (17), pas bloquantes : l'app en contient un
lot légitime, consommé par construction dynamique de la clé
(`t(\`statut.${'{'}m.statut}\`)`, `uiDictionary[\`catalogueReference.list.${'{'}cle}\`]`).

### 5.4 [FAIT] Nouveau `npm run check:data` — intégrité référentielle

L'activité principale du projet est l'ajout et l'audit de bandes, et **rien ne
vérifiait mécaniquement** qu'une bande nouvellement saisie ne référence pas un
objet, un profil ou une catégorie qui n'existe pas. Une référence morte ne se
voit pas dans le JSON : elle se manifeste bien plus tard par une ligne
d'équipement absente de la boutique.

`scripts/checkDataIntegrity.ts` vérifie : objets et profils cités par
`equipement_special`, catégories de compétences, compétences gratuites,
existence du fichier de bannière, unicité des profils, mécanisme de chef
(`est_leader` unique **ou** `leader_libre`), et `min <= max`.

Il ne juge **rien** sur le fond des règles (prix, raretés, profils) — c'est le
rôle de `mordheim-rules-auditor` contre les PDF.

**Résultat : aucune référence morte sur 52 bandes et 313 objets.** La seule
alerte initiale — deux bandes sans profil `est_leader` — s'est révélée être un
faux positif : ce sont exactement les deux bandes `leader_libre`
(Cour des Plaisirs Profanes, Pillards de Lustrie), cas explicitement géré par
`utils/leader.ts`. Le script intègre cette règle.

### 5.5 [FAIT] Vérification hors-ligne réelle du service worker

Les deux changements de cache (polices ajoutées au précache, bannières
déplacées en `runtimeCaching`) ont été validés sur le **build de production**,
pas seulement sur le fichier de config : service worker activé, puis passage
hors-ligne et rechargement.

Résultat hors-ligne : app rendue, **polices maison effectivement chargées**
(Garamond + Caslon Antique — le bug du § 1.3 est bien corrigé), et bannière de
bande servie depuis le cache d'exécution. Le `sw.js` généré contient bien
zéro entrée `bandes/` en précache, les six `.woff2`, et la route
`bannieres-bandes`.

> **Piège méthodologique, relevé par la revue QA.** `context.setOffline(true)`
> de Playwright **n'intercepte pas** les requêtes émises par le service worker
> lui-même : une bannière jamais vue revenait en 200 alors que le test se
> croyait hors-ligne. Un vrai test hors-ligne demande de **couper le serveur
> HTTP**. La conclusion ci-dessus tient — elle a été reconfirmée par la revue
> avec le serveur réellement arrêté — mais la première mesure du volet
> bannières valait moins que ce qu'elle laissait croire.

> Mise en garde de mesure : `dist` **accumule les fichiers de builds
> précédents** quand on alterne `npm run build` et `npm run build:prod` (bases
> différentes). Une mesure de taille ne vaut qu'après `rm -rf dist`. Sans
> incidence en CI (checkout neuf), mais ça m'a d'abord fait lire 5 698 Kio de
> précache au lieu de 4 272.

### 5.6 [À FAIRE] Accessibilité : libellés non associés aux champs

Points positifs d'abord : **aucun bouton-icône sans `aria-label`**, **aucune
`<img>` sans `alt`** dans toute l'app — c'est soigné.

En revanche, ~27 champs de saisie ont un libellé **visible mais non associé
programmatiquement**. Trois cas représentatifs du motif :

- `AchatEquipementModal.tsx:516` — champ de recherche avec un simple
  `placeholder` (qui disparaît à la saisie et n'est pas un nom accessible).
- `CaracteristiquesCard.tsx:90` — l'`<input>` d'une caractéristique ; le
  `title` est porté par le `<div>` parent, pas par le champ. Un lecteur
  d'écran annonce donc un compteur sans nom, **neuf fois par personnage**.
- `StatutCard.tsx:205` — un `<span>` porte le texte juste avant le champ, sans
  `<label htmlFor>` ni `aria-labelledby`.

Correction : associer le libellé existant (`<label htmlFor>` ou
`aria-labelledby` vers le `<span>` déjà présent), plutôt qu'inventer de
nouveaux textes. Aucun impact visuel. Non fait ici : 27 sites demandent chacun
de choisir le bon libellé selon le contexte, ce qui mérite sa propre passe.

### 5.7 Revue QA indépendante du diff

`mordheim-qa-reviewer` a rejoué les parcours clés sur le build de production —
lecture de code exclue, exécution réelle. **Aucun P0, aucun P1, aucune
régression fonctionnelle.**

| Parcours | Résultat |
|---|---|
| Création de bande | 3 héros + 3 hommes de main, trésorerie 500 → 285, calcul exact |
| Recrutement / groupe | `taille_groupe: 3` correct, coûts affichés |
| Achat équipement + Place du marché | 23 objets, onglets OK, trésorerie et `stock` cohérents |
| `categories_interdites` | Chevalier de la Quête : aucun onglet Tir ; Écuyer (même bande) : Bow / Long Bow. Conforme |
| Post-bataille | 7 étapes, blocages de validation attendus, `historique_batailles: 1` |
| **Export PDF** | **OK** — 57 928 o, 2 pages, contenu textuel réel. Le chunk du bouchon jsPDF est émis séparément et **jamais chargé** |
| Export / import JSON | Aller-retour sans perte |
| 10 routes | 0 erreur JS, 0 réponse 4xx/5xx |

Points spécifiquement validés sur les suppressions de code mort : aucune
référence résiduelle, et **aucun accès dynamique** ne pouvait atteindre les
fichiers supprimés (pas d'`import.meta.glob`, pas d'`import()` à template, pas
de `fetch()` de JSON local). Le piège de l'homonyme `BLESSURES_GRAVES` a été
explicitement revérifié : la table canonique D66 est intacte et le sorcier de
blessures graves s'ouvre sans erreur.

Le seul défaut réel remonté (bannières en `CacheFirst` sans expiration) est
corrigé, cf. § 1.5.

### 5.8 Vérifié sans problème

Contrôles menés qui n'ont **rien** révélé — utile à savoir pour ne pas les
refaire :

- **Chaînes non traduites** : balayage de tous les composants à la recherche de
  texte littéral rendu en JSX. Hors le pied de page du § 4.1, aucune.
- **Mutation d'état React** : les 15 mutations directes détectées portent
  toutes sur un objet créé à la ligne précédente (`creerMembre`,
  `creerRoster`) avant passage à l'état. Idiomatique, aucun bug.
- **Coût des traductions en rendu** : traduire les 52 catalogues coûte
  **1,02 ms** (et 0,00 ms en français, repli immédiat), les 313 objets
  0,39 ms. Déjà mémoïsé, et négligeable même sans. **Ne pas optimiser.**
- **Intégrité des données** : cf. § 5.4, zéro référence morte.
- **Parcours fonctionnels** : revue QA indépendante, cf. § 5.7, aucune régression.

---

## 6. Ce qui va bien

Pour équilibrer : l'audit n'a trouvé **aucun** bug de logique de jeu, **aucune**
fuite de données, **aucune** dépendance obsolète ou vulnérable bloquante.

- Découpage en routes lazy-loadées déjà en place et efficace.
- Couverture i18n quasi totale (un seul trou, corrigé).
- Commentaires d'intention d'une densité rare, qui expliquent le *pourquoi*
  (plusieurs corrections de cet audit n'ont été possibles qu'en les lisant).
- Séparation données / logique / présentation respectée.
- Le script `check:i18n` fait exactement son travail : il a survécu à l'audit
  en signalant un vrai problème (§ 4.2).
- **Intégrité des données irréprochable** : 52 bandes, 313 objets, zéro
  référence morte, zéro doublon d'identifiant (§ 5.4). Pour des données
  saisies à la main bande par bande, c'est remarquable.
- `normalize.ts` avait déjà anticipé la bonne classe de risque (JSON importé
  au mauvais type) — il ne lui manquait que les nombres (§ 5.1).
- Aucune mutation d'état React, aucun coût de rendu à optimiser (§ 5.7).
- Accessibilité des boutons et des images complète (§ 5.6).

---

## 7. Récapitulatif chiffré

```
dist        9,75 Mo   ->  7,20 Mo     (-2,55 Mo, -26 %)
marge/10Mo  0,25 Mo   ->  2,80 Mo     (x11)
précache    9 400 Kio ->  4 273 Kio   (-55 %)
```

Garde-fous ajoutés, là où il n'y avait aucune surveillance :

| Contrôle | Portée |
|---|---|
| Taille de `dist` en CI | bloque le déploiement au-delà de 9,5 Mo |
| `check:i18n` étendu | collisions de clés + clés manquantes |
| `check:data` (nouveau) | références mortes sur 52 bandes / 313 objets |

Vérifications passées après modifications : `tsc -b --force`, `oxlint`,
`check:i18n` (seul `lame_des_etoiles` subsiste, cf. § 4.2), `check:data`,
`vite build` et `build:prod`, contrôle visuel Playwright en
`deviceScaleFactor: 2`, et **test hors-ligne réel** sur le build de production
(cf. § 5.5).

Le dépôt ne contient **aucun test unitaire** : `check:i18n` et `check:data`
sont, avec `tsc` et `oxlint`, les seuls filets automatiques. C'est le manque
structurel le plus net de l'audit — les parcours critiques (post-bataille,
achat, recrutement) ne sont couverts que par vérification manuelle.

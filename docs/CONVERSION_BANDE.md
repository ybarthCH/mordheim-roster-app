# Convertir une bande Mordheim (PDF → JSON) — guide pour IA

Ce document explique, étape par étape, comment convertir une bande Mordheim
publiée en PDF (typiquement un scan/export de la Grande Librairie de
Mordheim, Town Cryer, etc.) en fichier JSON exploitable par cette
application. Il est écrit pour être suivi par un autre modèle d'IA sans
contexte préalable sur le projet — toutes les conventions utiles sont
détaillées ici.

L'application est une PWA React/TypeScript (roster manager Mordheim, sans
backend, persistance IndexedDB). Le code source est dans `src/`.

## 0. Fichiers à connaître avant de commencer

- `src/types/catalog.ts` — types TypeScript qui définissent le schéma exact
  attendu (`WarbandCatalog`, `Profile`, `SpecialRule`, `CompetenceSpeciale`,
  `EquipementRef`, `EquipementSpecialRef`, `Magie`, `MagieSort`,
  `CaracteristiquesMax`, `Composition`...). **Lis ce fichier en entier avant
  d'écrire le moindre JSON** — c'est la source de vérité, ce guide n'en est
  qu'un résumé pratique.
- `src/data/warbands/*.json` — une bande = un fichier. Regarde 2-3 fichiers
  existants proches de la bande à convertir (même style : magie, mutations,
  hommes de main groupés...) pour t'imprégner du style attendu. `skaven.json`
  et `skavens_pestilens.json` sont de bons exemples avec système de magie ;
  `gladiateurs.json` et `maraudeurs_du_chaos.json` illustrent
  `caracteristiques_max`.
- `src/data/warbands/index.ts` — registre des bandes (import + tableau
  `CATALOGUES`), à mettre à jour à la fin.
- `src/data/items/*.json` — base commune d'objets (armes, armures, objets
  divers, montures...), extraite une fois pour toutes du compendium
  "Place du Marché". **Voir section 3, c'est l'étape la plus importante.**

## 1. Lire le PDF entièrement avant de coder

Lis toutes les pages du PDF (règles de composition, expérience de départ,
tableau de progression de caractéristiques, listes d'équipement, objets
spéciaux/rares, tableau de compétences, compétences spéciales, profils des
héros et hommes de main, système de magie/prières le cas échéant). Prends le
temps de tout capturer avant d'écrire le JSON — il est plus fiable de
convertir un texte source complet que de faire des allers-retours.

Repère en particulier :
- Le nombre de figurines min/max et le budget max de constitution ("Choix
  des guerriers").
- Les contraintes d'unicité par profil (ex : "0-1 Prêcheur-Sorcier",
  "0-2 Moines de la Peste").
- L'expérience de départ par profil.
- Le tableau de compétences (colonnes Combat/Tir/Érudition/Force/Vitesse/
  Spéciale) — donne `acces_competences` de chaque profil.
- Les objets spéciaux/rares propres à la bande (avec prix, rareté "Rare N",
  texte de règle complet).
- Les compétences spéciales propres à la bande, y compris leurs
  prérequis textuels (ex : "seul un héros possédant X peut choisir Y").
- Un éventuel système de magie/prières (nom, dé utilisé, difficulté par
  sort, texte de chaque sort).
- Les exceptions/dérogations textuelles (ex : "sauf les Jeunes Sangs").

## 2. Convention générale du fichier bande

Un fichier `src/data/warbands/<id>.json` respecte le type `WarbandCatalog` :

```jsonc
{
  "id": "identifiant_snake_case",              // utilisé partout comme clé stable
  "nom": "Nom Affiché (1b)",                    // "(1a)"/"(1b)"/"(1c)" = grade officiel/semi-officiel
  "grade": "1b",
  "source": "Town Cryer #29, v1e — La Grande Librairie de Mordheim",
  "regles_speciales": [],                        // règles de bande globales (rare, souvent vide)
  "composition": { "effectif_min": 3, "effectif_max": 15, "cout_max_constitution": 500 },
  "caracteristiques_max": [ /* optionnel, voir 2.4 */ ],
  "profils": [ /* voir 2.1 */ ],
  "competences_speciales": [ /* voir 2.2 */ ],
  "equipement": { /* voir section 3 */ },
  "equipement_special": [ /* voir section 3 */ ],
  "magie": { /* optionnel, voir 2.5 */ }
}
```

Le fichier doit être **formaté de façon compacte**, pas au format
`JSON.stringify` par défaut : regroupe les champs courts d'un même objet sur
une seule ligne (voir les fichiers existants comme modèle). Ce style est une
convention délibérée du projet pour garder des diffs lisibles — ne le casse
jamais en réécrivant un fichier existant avec un formateur JSON générique.

### 2.1 Profils (`profils[]`, type `Profile`)

Un profil par ligne du PDF (chaque héros nommé, chaque type d'homme de main,
chaque animal). Champs clés :

- `id` : snake_case, stable, utilisé comme clé partout (magie, équipement
  spécial, plafonds de caractéristiques...).
- `type` : `"heros"` | `"homme_de_main"` | `"animal"`. Un `"animal"` est
  suivi comme un groupe d'hommes de main (statut simplifié, compteur Hors de
  combat) mais ne gagne jamais d'expérience — mets `regles_speciales` avec
  une entrée `{ "nom": "Expérience", "texte": "..." }` si le PDF le précise
  explicitement (c'est presque toujours le cas pour les animaux).
- `unique` : `true` si un seul exemplaire nommé (pas un groupe) — typiquement
  les héros solo.
- `min` / `max` : contraintes de recrutement du PDF (ex : "0-2 Moines de la
  Peste" → `min: 0, max: 2`). `max: null` = illimité. **Purement informatif**
  — l'app ne bloque jamais le recrutement, elle affiche juste un avertissement
  "Composition — à vérifier" si dépassé.
- `cout` : coût d'achat en couronnes d'or.
- `xp_depart` : XP de départ (0 si non précisé pour les hommes de main).
- `stats` : `{ M, CC, CT, F, E, PV, I, A, Cd }`, toutes en `number`.
- `regles_speciales` : règles propres à ce profil (`{ nom, texte, exception? }`).
  Le champ `exception` sert pour une dérogation textuelle courte (ex :
  "Sauf les Jeunes Sangs et les Demi-Grands") plutôt que de la fondre dans
  `texte`.
- `acces_competences` : tableau de `SkillCategory` (`'combat' | 'tir' |
  'force' | 'academique' | 'vitesse' | 'equitation' | 'special'`), dérivé
  directement du tableau de compétences du PDF (colonne Érudition →
  `'academique'`, colonne Spéciale → `'special'`). Pas besoin d'ajouter
  `'equitation'` toi-même : l'app l'accorde automatiquement à tous les héros
  quel que soit ce tableau (règle Mordheim : tout le monde peut apprendre à
  monter). Pour les hommes de main/animaux sans accès aux compétences,
  mets `[]`.
- `acces_competences_a_verifier` : `false` si le tableau du PDF est fiable
  (cas normal). `true` uniquement si tu n'es pas sûr du mapping — dans ce
  cas l'app retombe sur "toutes les tables accessibles" par sécurité plutôt
  que de sous-restreindre injustement.
- `acces_equipement` : clé(s) du bloc `equipement` (section 3) accessibles à
  ce profil pour l'achat en jeu, ex `["heros_pestilens"]`. Un homme de main
  sans équipement du tout (beaucoup d'animaux) a `acces_equipement: []`.
- `est_leader` : `true` pour le chef de bande (un seul par catalogue) — donne
  un badge visuel + bonus auto de +1 XP en cas de victoire.
- `peut_lancer_sorts` / `categorie_magie` : rarement utilisés en pratique ;
  le lien avec le système de magie se fait surtout via `magie.utilisateurs`
  (section 2.5), pas ces champs.

### 2.2 Compétences spéciales (`competences_speciales[]`)

Une entrée par compétence propre à la bande (liste "Spéciale" alternative
citée par le PDF). `{ id, nom, texte, reserve_a? }`. Le champ `reserve_a`
est **informatif seulement** — l'app ne filtre pas la liste des compétences
sélectionnables en fonction de ça, donc si une compétence a un prérequis
(ex : "seul un héros possédant Dur à cuire peut choisir cette compétence"),
mets le texte du prérequis à la fois dans `texte` (texte de règle complet,
tel quel) et éventuellement en résumé dans `reserve_a`. Ne cherche pas à
faire respecter mécaniquement les prérequis de compétences — ce n'est pas le
niveau d'automatisation de l'app (voir section 5).

### 2.3 Composition (`composition`)

`effectif_min`, `effectif_max`, `cout_max_constitution` tels que donnés par
le PDF ("Choix des guerriers"). Purement informatif (affiché comme
avertissement, n'empêche jamais de jouer).

### 2.4 Plafonds de caractéristiques (`caracteristiques_max`, optionnel)

Certaines bandes donnent un profil-plafond que les caractéristiques ne
peuvent jamais dépasser en avançant (ex : bandes avec un "Profil M CC CT F E
PV I A Cd" maximal explicite dans le texte, souvent pour les bandes
Chaos/Skaven/Ogres). Tableau de `{ profil, note?, M?, CC?, ... }`.

**Important** : dans le code actuel, seule la **première entrée**
(`caracteristiques_max[0]`) est effectivement lue et affichée (voir
`PersonnageScreen.tsx`, `catalogue.caracteristiques_max?.[0]`) — elle
s'applique alors à toute la bande, peu importe la valeur du champ `profil`.
Si le PDF ne donne qu'un seul plafond commun à tous les profils, mets une
seule entrée avec un `profil` descriptif (ex `"clan_pestilens"`) et un
`note` expliquant les nuances (ex "les Hommes de main ne peuvent pas
dépasser +1 par caractéristique"). Si tu as plusieurs plafonds différents
selon le profil (rare), documente-les quand même tous dans le tableau pour
que l'info soit présente dans les données même si l'UI actuelle n'affiche
que la première — ne pas fabriquer un faux plafond unique pour contourner
cette limite.

### 2.5 Système de magie/prières (`magie`, optionnel)

Si la bande a un système de sorts/prières/bénédictions (Skavens, Sœurs de
Sigmar, Culte des Possédés...), remplis `magie` :

```jsonc
"magie": {
  "nom": "Magie du Rat Cornu",
  "type": "sorcellerie",              // libre : "sorcellerie", "prière", etc.
  "de": "D6",                          // dé utilisé pour le jet de résultat/table
  "utilisateurs": ["precheur_sorcier_pestilens"],  // id(s) de profils habilités
  "note": "Texte d'intro tel que donné par le PDF.",
  "sorts": [
    { "resultat": 1, "nom": "Maleflamme", "difficulte": 8, "texte": "Texte de règle complet." }
  ]
}
```

C'est une **référence affichée telle quelle**, sans moteur de jet
automatisé — pas besoin (et pas possible) d'y ajouter une logique de jeu.

## 3. Équipement — TOUJOURS chercher dans la base commune avant de créer un objet

C'est l'étape la plus rentable de la conversion : la base commune
`src/data/items/*.json` (armes_corps_a_corps, armes_tir, armes_poudre_noire,
munitions, armures, objets_divers, consommables, poisons_drogues, montures,
vehicules) a été extraite une fois pour toutes du compendium officiel
"Place du Marché" et contient **déjà** énormément d'objets rares
propres à des bandes qui n'étaient pas encore intégrées à l'app au moment de
l'extraction — y compris souvent tous les objets spéciaux de la bande que tu
es en train de convertir. Ne jamais créer un nouvel item avant d'avoir
vérifié qu'il n'existe pas déjà.

### 3.1 Workflow de recherche (avant toute création)

Pour chaque objet cité dans le PDF (armes de la liste d'équipement standard
ET objets spéciaux/rares), cherche par mot-clé dans `src/data/items/*.json` —
nom normalisé, mots-clés du texte de règle, catégorie. Exemple de recherche
efficace (Python/grep) :

```bash
python3 -c "
import json, glob
terms = ['peste', 'malepierre', 'rat familier']  # adapte selon la bande
for f in glob.glob('src/data/items/*.json'):
    data = json.load(open(f))
    for it in data:
        s = json.dumps(it, ensure_ascii=False).lower()
        if any(t in s for t in terms):
            print(f, it.get('id'), it.get('nom'))
"
```

Compare ensuite `nom`, `cout`, `rarete`/`disponibilite`, `texte` et
`regles_speciales` de l'entrée trouvée avec le PDF : si tout correspond
(c'est presque toujours le cas — ces entrées ont déjà été extraites du même
type de source), **réutilise `item_id` tel quel**, ne duplique rien.

### 3.2 Structure `EquipementRef` (équipement standard, `equipement`)

Le bloc `equipement` du fichier bande est un dictionnaire nommé (une clé par
liste, ex `"heros_pestilens"`, `"hommes_de_main_pestilens"`), chaque liste
ayant jusqu'à 4 catégories : `armes_cac`, `armes_tir`, `armures`, `divers`.
Chaque entrée :

```jsonc
{ "item_id": "dague", "cout": 2, "note": "première gratuite" }
```

- `item_id` : id dans la base commune (jamais dupliqué ici).
- `cout` : le prix **spécifique à cette bande** (peut différer du prix par
  défaut de l'item si le PDF donne un prix différent — dans ce cas garde le
  prix du PDF de la bande, c'est celui qui prévaut pour l'achat en jeu).
  Peut être une chaîne pour un coût variable (`"25+1D6"`).
- `note` / `restriction` : annotations libres, affichage seulement.

Les clés du dictionnaire `equipement` correspondent aux valeurs possibles de
`Profile.acces_equipement` de chaque profil (section 2.1). Convention
habituelle : une liste `"heros_<bande>"` et une liste
`"hommes_de_main_<bande>"`, parfois plus si le PDF différencie plusieurs
groupes (ex : bande avec plusieurs "cultures" d'hommes de main).

### 3.3 Objets spéciaux/rares (`equipement_special`, type `EquipementSpecialRef`)

Un objet par entrée "Rare N" du PDF, qu'il soit une arme (déjà listée dans
`equipement` par ailleurs) ou un objet purement "divers" (bannière,
amulette, grimoire...) :

```jsonc
{ "item_id": "parchemin_de_rat_familier", "cout": "25+1D6", "disponibilite": "Rare 8, Clan Pestilens uniquement", "profils": ["precheur_sorcier_pestilens"] }
```

- `disponibilite` : texte libre reprenant la mention "Rare N, ..." du PDF.
- `profils` (optionnel) : restreint l'objet à une liste d'`id` de profils
  précis (ex : mutation réservée à un profil nommé). Absent = accessible à
  tous les profils de la bande.
- `competences` (optionnel) : restreint l'objet aux membres possédant l'une
  de ces compétences (`id` de `CompetenceSpeciale` ou de compétence standard).
  Absent = pas de restriction par compétence.

Si un objet est à la fois une arme utilisable (donc déjà dans `equipement`)
et une entrée "Rare N" du PDF, il apparaît **dans les deux blocs** — une
fois dans la liste d'équipement normale (pour l'achat direct/le prix de
référence), une fois dans `equipement_special` (pour signaler sa rareté).
C'est la convention déjà suivie par `skaven.json` (sarbacane,
pistolet à malepierre...) et `skavens_pestilens.json` (dague de la peste,
encensoir à peste).

### 3.4 Créer un nouvel item (seulement si vraiment absent)

Si un objet du PDF n'existe vraiment nulle part dans `src/data/items/*.json`
(cas rare mais possible), ajoute-le dans le fichier de catégorie approprié en
respectant le schéma des entrées voisines (`id`, `nom`, `categorie`, `cout`,
`cout_fixe`, `rarete`, `disponibilite`, `acces` (tableau de tags de bandes ou
`"rare_N"` pour un objet Rare générique non restreint à une bande), `source`,
`page`, `texte`, et pour les armes `portee`/`force`/`regles_speciales`
structurées si présentes). Utilise `Read` + `Edit` chirurgical, jamais une
réécriture complète du fichier au format `JSON.stringify` (voir la remarque
de formatage compact en section 2).

## 4. Détection automatique de "Grande Cible"

Ne mets **jamais** de case à cocher manuelle "Grande Cible" pour un profil
issu du catalogue (elle est réservée aux profils "Franc-tireur" créés à la
volée par le joueur, qui n'ont pas de `regles_speciales` structurées). À la
place, ajoute une règle spéciale nommée exactement `"Grande Cible"` (ou
`"Grande cible"`, insensible à la casse — le détecteur est
`/^grande?\s*cible$/i`, plus une exception exacte pour le nom `"Grand"`
utilisé par un profil d'Ogre) dans `regles_speciales` du profil concerné :

```jsonc
{ "nom": "Grande Cible", "texte": "Les rats ogres sont des créatures immenses... ce sont des grandes cibles, comme défini dans les règles de tir." }
```

L'app (`estGrandeCible()` dans `src/utils/profil.ts`) détecte alors
automatiquement la règle et applique le rating +20 sans action du joueur.

## 5. Ce qu'il ne faut PAS essayer d'automatiser

L'application est volontairement un **outil de référence et de suivi**, pas
un moteur de règles complet. Le principe systématique de ce projet est :
si une règle est complexe, conditionnelle, ou nécessite un arbitrage humain
en cours de partie, elle est documentée en texte libre (`texte` d'une
`regles_speciales`, d'une compétence spéciale, ou d'un `equipement_special`)
et affichée comme référence — jamais mécaniquement appliquée. Exemples déjà
traités ainsi dans le projet :

- Prérequis de compétences en chaîne (ex : compétence B nécessite d'avoir
  pris la compétence A) — texte informatif seulement, l'app ne filtre pas.
- Coût doublé pour une deuxième mutation, remise liée à un trait d'origine,
  etc. — laissé au joueur de calculer/appliquer.
- Transformation d'un profil en un autre en cours de campagne (ex : un Rat
  Géant transformé en "Rat Familier" par un objet spécial, avec une ligne de
  tableau de progression différente) — documenté en texte dans la règle
  spéciale du profil de base (voir `regles_speciales` du profil `rat_geant`
  dans `skavens_pestilens.json` pour un exemple complet), sans créer de
  nouveau `Profile` séparé ni de mécanique de conversion automatique.
- Contraintes `min`/`max`/`unique` de composition — toujours informatives,
  jamais bloquantes (l'app affiche juste "Composition — à vérifier").

Ne cherche donc pas à ajouter de nouveaux champs au schéma
(`src/types/catalog.ts`) pour modéliser une règle complexe d'une bande
précise ; utilise le texte libre existant. Si vraiment un champ manque de
façon générique et réutilisable (pas ad hoc pour une seule bande), c'est un
signal pour en discuter avec le mainteneur humain plutôt que de l'ajouter
silencieusement.

## 6. Checklist finale (à chaque bande ajoutée)

1. Créer `src/data/warbands/<id>.json`.
2. L'enregistrer dans `src/data/warbands/index.ts` : ajouter l'import et
   l'entrée dans le tableau `CATALOGUES` (ordre alphabétique par nom de
   fichier).
3. `npx tsc -b` — doit passer sans erreur (le typage structurel de
   `WarbandCatalog` attrape la plupart des fautes de frappe de schéma).
4. `npx oxlint` — ne doit pas introduire de nouveau warning (seuls 2-3
   warnings historiques tolérés doivent apparaître, tous dans des fichiers
   non liés à la conversion de bandes).
5. `npm run build` — doit passer.
6. Vérification fonctionnelle (Playwright recommandé, ou test manuel) :
   - Créer une bande de ce catalogue, vérifier que tous les profils
     s'affichent avec le bon coût/type/min-max.
   - Recruter au moins un héros et un homme de main, vérifier l'écran
     roster (pas d'erreur console).
   - Si la bande a un système de magie, ouvrir la fiche du lanceur de
     sorts et vérifier que la carte "Magie" s'affiche avec tous les sorts.
   - Si la bande a de l'équipement spécial, vérifier que la carte
     "Équipement de bande (référence)" du roster liste bien les objets
     rares avec leur texte de règle complet.
7. Commit + push sur la branche de travail (jamais directement sur `main`),
   PR, merge — selon le mode d'autonomie convenu avec l'utilisateur pour ce
   projet (sinon, laisser la main à l'utilisateur pour ces étapes).

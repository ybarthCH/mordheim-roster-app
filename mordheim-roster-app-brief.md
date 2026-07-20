# Brief app : Gestionnaire de roster Mordheim (PWA locale)

## Contexte
- PWA, usage local uniquement (pas de backend, pas de compte)
- Cible : téléphone fold Android, utilisée pendant les parties
- Import/export JSON pour sauvegarde/portabilité
- Bandes jusqu'à grade 1c (1a via extraction BSData, 1c saisis manuellement dans le même schéma)

---

## Fonctionnalités

### Gestion de bande
- Création de bande : choix de la faction (parmi le catalogue de profils), nom personnalisé
- Valeur de bande (calcul automatique)
- Trésorerie courante (gold crowns)
- Wyrdstone en réserve
- Historique des batailles (victoires/défaites, dates)
- Box équipement en réserve (texte libre, en tête de feuille de roster)

### Gestion des hommes de main / héros
- Fiche profil complet : caractéristiques (M/CC/CT/F/E/PV/I/A/Cd), race, type (héros / homme de main)
- Box équipement libre (texte) — une par héros, une par groupe d'hommes de main
- Compétences acquises (tables selon accès du profil : Combat, Tir, Force, Académique, Vitesse, Spécial)
- Avancées aléatoires (tables XP) avec historique
- **XP en cases à cocher, fidèle à la feuille de référence** :
  - Héros : grille continue avec seuils de palier marqués visuellement (1, 2, 4, 8, 16...)
  - Hommes de main : 6 cases fixes (table d'avancement à échelons)
- Statut : actif / Hors de combat / mort / capturé
- Blessures graves (table standard 2D6) avec effets appliqués et suivis
- Sorts connus / mutations (champ optionnel selon bande — magie noire, nécromancie, etc.)

### Post-bataille / campagne
- Assistant phase d'après-bataille : exploration, vente de wyrdstone, jets de blessures graves, gains d'XP
- Suivi multi-bandes (utile pour une campagne à plusieurs joueurs)
- Historique de campagne / classement des bandes

### UX fold
- Mode table de jeu : fiche compacte par personnage, lisible et modifiable vite pendant un tour
- Édition rapide (PV actuels, statut HC, cases XP) en 1-2 taps
- Vue étendue (roster complet, grand écran déplié) vs vue repliée (fiche unique)
- Mode sombre

### Données & portabilité
- Import/export JSON
- Stockage local uniquement (pas de localStorage/sessionStorage — état en mémoire + export/import manuel, ou IndexedDB si persistance native nécessaire)
- Export PDF de la feuille de bande

### Règles/validation
- Vérification des limites de composition (ex. max 2 champions, unique captain, etc. selon profil)
- Vérification budget vs valeur de bande à la création
- Règles spéciales par bande affichées et appliquées où pertinent (texte informatif, pas forcément automatisé)

---

## Schéma de données

### Tables partagées

**skills.json** — compétences, par catégorie, réutilisées par toutes les bandes
```json
{
  "combat": [
    { "id": "combat_01", "nom": "Frappe en Puissance", "texte": "..." }
  ],
  "tir": [],
  "force": [],
  "academique": [],
  "vitesse": [],
  "special": []
}
```

**blessures_graves.json** — table standard 2D6
```json
{
  "table": [
    { "min": 2, "max": 2, "resultat": "Mort", "effet": "..." }
  ]
}
```

### Catalogue de bande (référence, un fichier par bande)

```json
{
  "id": "reiklanders",
  "nom": "Reiklanders",
  "grade": "1a",
  "source": "BSData/Broheim",
  "regles_speciales": [
    { "nom": "Discipline militaire", "texte": "Portée du commandement du Capitaine étendue à 12 pouces." }
  ],
  "profils": [
    {
      "id": "capitaine",
      "nom": "Capitaine",
      "type": "heros",
      "unique": true,
      "stats": { "M": 4, "CC": 4, "CT": 4, "F": 3, "E": 3, "PV": 1, "I": 4, "A": 1, "Cd": 8 },
      "acces_competences": ["combat", "tir", "force", "academique", "vitesse", "special"],
      "xp_depart": 20
    },
    {
      "id": "guerrier",
      "nom": "Guerrier",
      "type": "homme_de_main",
      "stats": { "M": 4, "CC": 3, "CT": 3, "F": 3, "E": 3, "PV": 1, "I": 3, "A": 1, "Cd": 6 },
      "acces_competences": ["combat", "force"],
      "xp_depart": 0
    }
  ]
}
```

### Instance de roster (données du joueur, séparées du catalogue)

```json
{
  "bande_id": "reiklanders",
  "nom_bande": "Les Lueurs de Fond",
  "tresorerie": 120,
  "wyrdstone": 3,
  "equipement_reserve": "2 épées, 1 arbalète",
  "membres": [
    {
      "instance_id": "uuid-ou-compteur",
      "profil_id": "capitaine",
      "nom_perso": "Gerrit Van der Velde",
      "equipement": "épée, pistolet, armure légère",
      "xp": 12,
      "competences_acquises": ["combat_01"],
      "statut": "actif",
      "blessures_graves": []
    }
  ],
  "historique_batailles": []
}
```

---

## Prompt prêt à donner à Claude Code

```
Crée une PWA (React + stockage local, pas de backend) pour gérer des rosters
de bandes du jeu Mordheim, optimisée pour un téléphone Android fold, utilisée
en cours de partie.

FONCTIONNALITÉS :
## Fonctionnalités

### Gestion de bande
- Création de bande : choix de la faction (parmi le catalogue de profils), nom personnalisé
- Valeur de bande (calcul automatique)
- Trésorerie courante (gold crowns)
- Wyrdstone en réserve
- Historique des batailles (victoires/défaites, dates)
- Box équipement en réserve (texte libre, en tête de feuille de roster)

### Gestion des hommes de main / héros
- Fiche profil complet : caractéristiques (M/CC/CT/F/E/PV/I/A/Cd), race, type (héros / homme de main)
- Box équipement libre (texte) — une par héros, une par groupe d'hommes de main
- Compétences acquises (tables selon accès du profil : Combat, Tir, Force, Académique, Vitesse, Spécial)
- Avancées aléatoires (tables XP) avec historique
- **XP en cases à cocher, fidèle à la feuille de référence** :
  - Héros : grille continue avec seuils de palier marqués visuellement (1, 2, 4, 8, 16...)
  - Hommes de main : 6 cases fixes (table d'avancement à échelons)
- Statut : actif / Hors de combat / mort / capturé
- Blessures graves (table standard 2D6) avec effets appliqués et suivis
- Sorts connus / mutations (champ optionnel selon bande — magie noire, nécromancie, etc.)

### Post-bataille / campagne
- Assistant phase d'après-bataille : exploration, vente de wyrdstone, jets de blessures graves, gains d'XP
- Suivi multi-bandes (utile pour une campagne à plusieurs joueurs)
- Historique de campagne / classement des bandes

### UX fold
- Mode table de jeu : fiche compacte par personnage, lisible et modifiable vite pendant un tour
- Édition rapide (PV actuels, statut HC, cases XP) en 1-2 taps
- Vue étendue (roster complet, grand écran déplié) vs vue repliée (fiche unique)
- Mode sombre

### Données & portabilité
- Import/export JSON
- Stockage local uniquement (pas de localStorage/sessionStorage — état en mémoire + export/import manuel, ou IndexedDB si persistance native nécessaire)
- Export PDF de la feuille de bande

### Règles/validation
- Vérification des limites de composition (ex. max 2 champions, unique captain, etc. selon profil)
- Vérification budget vs valeur de bande à la création
- Règles spéciales par bande affichées et appliquées où pertinent (texte informatif, pas forcément automatisé)

SCHÉMA DE DONNÉES :
### Tables partagées

**skills.json** — compétences, par catégorie, réutilisées par toutes les bandes
```json
{
  "combat": [
    { "id": "combat_01", "nom": "Frappe en Puissance", "texte": "..." }
  ],
  "tir": [],
  "force": [],
  "academique": [],
  "vitesse": [],
  "special": []
}
```

**blessures_graves.json** — table standard 2D6
```json
{
  "table": [
    { "min": 2, "max": 2, "resultat": "Mort", "effet": "..." }
  ]
}
```

### Catalogue de bande (référence, un fichier par bande)

```json
{
  "id": "reiklanders",
  "nom": "Reiklanders",
  "grade": "1a",
  "source": "BSData/Broheim",
  "regles_speciales": [
    { "nom": "Discipline militaire", "texte": "Portée du commandement du Capitaine étendue à 12 pouces." }
  ],
  "profils": [
    {
      "id": "capitaine",
      "nom": "Capitaine",
      "type": "heros",
      "unique": true,
      "stats": { "M": 4, "CC": 4, "CT": 4, "F": 3, "E": 3, "PV": 1, "I": 4, "A": 1, "Cd": 8 },
      "acces_competences": ["combat", "tir", "force", "academique", "vitesse", "special"],
      "xp_depart": 20
    },
    {
      "id": "guerrier",
      "nom": "Guerrier",
      "type": "homme_de_main",
      "stats": { "M": 4, "CC": 3, "CT": 3, "F": 3, "E": 3, "PV": 1, "I": 3, "A": 1, "Cd": 6 },
      "acces_competences": ["combat", "force"],
      "xp_depart": 0
    }
  ]
}
```

### Instance de roster (données du joueur, séparées du catalogue)

```json
{
  "bande_id": "reiklanders",
  "nom_bande": "Les Lueurs de Fond",
  "tresorerie": 120,
  "wyrdstone": 3,
  "equipement_reserve": "2 épées, 1 arbalète",
  "membres": [
    {
      "instance_id": "uuid-ou-compteur",
      "profil_id": "capitaine",
      "nom_perso": "Gerrit Van der Velde",
      "equipement": "épée, pistolet, armure légère",
      "xp": 12,
      "competences_acquises": ["combat_01"],
      "statut": "actif",
      "blessures_graves": []
    }
  ],
  "historique_batailles": []
}
```

CONTRAINTES TECHNIQUES :
- PWA installable, fonctionne 100% offline
- Pas de localStorage/sessionStorage brut — utiliser IndexedDB pour la
  persistance locale
- Import/export JSON du roster complet
- Design mobile-first mais qui exploite bien un écran large en mode déplié
  (vue étendue tableau vs vue repliée fiche unique)
- Mode sombre
- Les cases XP doivent être des cases à cocher cliquables (pas un simple
  champ numérique) — grille continue avec paliers marqués pour les héros,
  6 cases fixes pour les hommes de main

Commence par la structure du projet et le modèle de données/état, puis les
écrans dans cet ordre : liste des bandes → création de bande → fiche de
roster (vue étendue) → fiche personnage individuelle (mode table de jeu) →
assistant post-bataille.
```

---

## Prochaine étape suggérée
1. Je lance le script d'extraction sur les `.cat` BSData (grade 1a)
2. Tu lances Claude Code avec le prompt ci-dessus + 2-3 bandes en exemple (dont Reiklanders + une bande chaos + Undead, pour couvrir les cas mutations/sorts)
3. Une fois l'app stable, on complète le dataset (reste du 1a en mécanique, puis tes 1c à la main)

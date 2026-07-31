# Revue Codex de `main` après la PR #129

Date de la revue : 31 juillet 2026  
Commit audité : `69dfd55` — `Rend repliable le bloc "Règles spéciales du profil" (#129)`  
Base de comparaison : `0a6e797` — état après la PR #72  
Périmètre du diff : 57 commits, 126 fichiers, 14 174 insertions et 1 084 suppressions.

## Résumé exécutif

Le projet compile et passe `oxlint`. Les références principales des catalogues ont également été contrôlées sans incohérence structurelle détectée.

La revue a cependant identifié :

- 4 anomalies P1 susceptibles de fausser directement une campagne ;
- 7 anomalies P2 ou écarts de règle à corriger ;
- l'absence persistante d'une suite de tests automatisés, qui rend les régressions de séquence d'après-bataille particulièrement faciles.

Aucun correctif applicatif, commit, push, commentaire GitHub ou merge n'a été effectué pendant cette revue. Le seul fichier ajouté est ce rapport.

## Légende

- **P1** : impact métier important, données de campagne ou résultat de séquence incorrect.
- **P2** : comportement incorrect ou incomplet, mais avec un contournement possible ou un impact plus localisé.

## Anomalies

### 1. [P1] Un achat d'équipement reste possible malgré une trésorerie insuffisante

Fichiers :

- `src/components/personnage/AchatEquipementModal.tsx:218-230`
- `src/components/personnage/AchatEquipementModal.tsx:452-475`
- `src/components/personnage/AchatEquipementModal.tsx:698-724`
- `src/utils/shop.ts:711-724`

Le coût total est bien calculé et le message « Trésorerie insuffisante » est affiché, mais le bouton d'achat ordinaire n'est désactivé que si le coût est invalide ou si la limite de trinket est atteinte. `confirmer()` ne contrôle pas non plus la trésorerie. `acheterPourMembre()` soustrait ensuite le coût sans garde et peut produire une trésorerie négative.

Le parcours des matériaux comporte une variante du même problème pour les groupes : il compare le **prix unitaire** à la trésorerie, alors que `onAchat()` crée et facture ensuite un exemplaire par membre du groupe.

Reproduction navigateur effectuée :

1. bande avec 1 po en trésorerie ;
2. sélection d'une Dague à 2 po ;
3. le message d'insuffisance apparaît ;
4. le bouton « Acheter » reste actif.

Correction recommandée :

- calculer un booléen unique `budgetSuffisant = gratuit || coutTotal <= tresorerie` ;
- l'utiliser dans `disabled` et dans chaque fonction de confirmation ;
- pour un matériau, valider `prixFinal * tailleGroupe` ;
- ajouter aussi une garde dans la fonction métier qui débite la trésorerie, afin qu'un autre appelant ne puisse pas contourner l'interface.

### 2. [P1] Le bonus du Vagabond destiné à la prochaine exploration est appliqué et consommé immédiatement

Fichiers :

- `src/components/postbataille/ResolutionVagabond.tsx:34-44`
- `src/utils/exploration.ts:125-139`
- `src/components/postbataille/PostBatailleScreen.tsx:756-761`

`ResolutionVagabond` ajoute bien un effet libellé « prochain jet d'exploration ». Cependant, le résumé d'exploration relit immédiatement tous les effets persistants du roster courant. Le bonus modifie donc le nombre de dés de la phase qui est déjà en cours. `terminer()` supprime ensuite cet effet, ce qui prive réellement la prochaine bataille du bonus promis.

Reproduction navigateur effectuée :

1. l'exploration courante indiquait `Lance 2D6` ;
2. choix « Interroger — dé bonus prochaine exploration » ;
3. la même phase est immédiatement passée à `Lance 3D6` ;
4. après validation puis ouverture de l'après-bataille suivant, l'exploration était revenue à `Lance 2D6`.

Correction recommandée :

- prendre un snapshot des identifiants d'effets présents à l'ouverture de l'assistant ;
- seuls ces effets initiaux doivent modifier la bataille courante et être consommés à sa clôture ;
- les effets créés pendant cette exploration doivent rester en attente pour le prochain après-bataille.

Un marqueur explicite comme `actif_a_partir_bataille` rendrait le cycle de vie encore moins ambigu.

### 3. [P1] Les recrues obtenues pendant l'exploration sont traitées comme si elles avaient participé à la bataille déjà terminée

Fichiers :

- `src/data/tableExplorationEvenements.ts:248-255`
- `src/components/postbataille/ResolutionDebiteurReconnaissant.tsx:26-40`
- `src/components/postbataille/ResolutionVagabond.tsx:27-31`
- `src/components/postbataille/PostBatailleScreen.tsx:206-218`
- `src/components/postbataille/PostBatailleScreen.tsx:304-334`
- `src/components/postbataille/PostBatailleScreen.tsx:636-643`
- `src/components/postbataille/PostBatailleScreen.tsx:740-761`

La liste des participants est recalculée depuis le roster vivant, y compris après les mutations réalisées pendant l'exploration. Une figurine ajoutée à ce moment peut donc recevoir le +1 XP de participation à une bataille qu'elle n'a pas jouée.

Pour « Débiteur reconnaissant », le problème est plus large :

- la règle accorde le Franc-tireur gratuitement pour la **prochaine** bataille ;
- il rejoint le roster pendant l'exploration actuelle ;
- il entre dans l'entretien de la bataille actuelle ;
- son exemption est consommée à la validation actuelle ;
- il peut aussi recevoir l'XP de participation actuelle.

Les Zombies créés par Vagabond ou Prisonniers sont concernés par le même gain d'XP rétroactif lorsqu'ils sont normalement autorisés à gagner de l'expérience par le modèle courant.

Correction recommandée :

- prendre à l'ouverture de l'assistant un snapshot des `instance_id` ayant réellement participé ;
- calculer blessures, XP et entretien uniquement à partir de ce snapshot ;
- marquer les recrues d'exploration comme disponibles à partir de la bataille suivante ;
- consommer l'exemption du Débiteur à la fin de cette prochaine bataille, pas à la fin de celle qui vient d'être jouée.

### 4. [P1] Plusieurs profils « ne gagne jamais d'expérience » gagnent tout de même de l'XP et des avancées

Fichiers :

- `src/types/catalog.ts:53-58`
- `src/utils/xp.ts:31-40`
- `src/components/postbataille/PostBatailleScreen.tsx:201-218`
- `src/components/postbataille/PostBatailleScreen.tsx:636-641`
- `src/components/postbataille/EtapeGainXp.tsx:168-190`
- `src/components/personnage/PersonnageScreen.tsx:248-254`

Le code générique ne sait représenter « aucune expérience » qu'avec `type: "animal"`. Or plusieurs profils sont volontairement des `homme_de_main` tout en interdisant l'expérience dans leurs règles.

Exemples confirmés :

- `carnival_of_chaos/roulotte_de_la_peste` ;
- `maraudeurs_du_chaos/enfant_du_chaos` ;
- `morts_sans_repos/zombie` ;
- `morts_sans_repos/squelette` ;
- `pirates/enrole`.

Ces profils passent actuellement le filtre `type !== "animal"`, gagnent le +1 XP automatique et peuvent accumuler des avancées d'Homme de main. La Roulotte de la Peste n'a en plus aucun `groupe_caracteristiques`, ce qui confirme qu'elle n'a pas été modélisée pour progresser.

Correction recommandée :

- ajouter une propriété générique explicite, par exemple `gagne_experience?: boolean`, sur `Profile` ;
- centraliser un prédicat `peutGagnerExperience(profil, membre)` ;
- l'utiliser dans le recrutement, l'affichage de la grille, l'étape XP, `terminer()` et le calcul des avancées ;
- renseigner cette propriété dans les catalogues concernés ;
- traiter séparément les règles atypiques du Snotling au lieu de les déduire du texte.

### 5. [P2] La restriction de sorts du Nécromancien peut être contournée depuis sa fiche

Fichiers :

- `src/data/warbands/morts_sans_repos.json:44-58`
- `src/utils/magie.ts:63-89`
- `src/components/personnage/MagieConnueCard.tsx:38-44`
- `src/components/personnage/MagieConnueCard.tsx:84-104`

Le recrutement et les avancées utilisent correctement `sortsDisponiblesPourRoster()`, qui limite le Nécromancien aux sorts connus de la Liche vivante. La carte de magie de la fiche personnage utilise toutefois `sortsDisponibles()` sans le roster.

Conséquences :

- l'ajout manuel propose des sorts interdits ;
- l'utilisation d'un Grimoire sur la liste propre propose également des sorts interdits ;
- la contrainte « Apprenti » peut donc être contournée sans avertissement.

Correction recommandée :

- passer le roster à `MagieConnueCard` ;
- utiliser `sortsDisponiblesPourRoster()` pour l'ajout manuel et pour la branche `sourceGrimoire === "propre"` ;
- ajouter un test avec Liche vivante, puis Liche morte.

### 6. [P2] Plusieurs nouvelles bandes humaines ne résolvent pas l'accès générique `commun_humains`

Fichiers :

- `src/utils/shop.ts:104-142`
- `src/data/items/montures.json:37-48`
- `src/data/items/vehicules.json:88-90`

`estAccesPourCatalogue()` dépend d'une liste codée en dur. Celle-ci ne contient pas plusieurs catalogues humains ajoutés récemment :

- `bandits_du_hochland` ;
- `chasseurs_cornus` ;
- `chevaliers_bretonniens` ;
- `escorteurs_imperiaux` ;
- `hors_la_loi_de_stirwood` ;
- `pirates` ;
- `tileens`.

Les objets accessibles via `commun_humains` — notamment Cheval, Destrier et Pousse-pousse — disparaissent donc du catalogue commun de ces bandes, sauf lorsqu'une liste de bande les réintroduit explicitement. Les Chevaliers Bretonniens ont leurs montures dans leurs listes, mais ce n'est pas le cas général.

Correction recommandée :

- remplacer la liste codée en dur par une métadonnée de catalogue, par exemple `groupes_acces: ["humains"]` ;
- à court terme, compléter `CATALOGUES_HUMAINS` ;
- ajouter un test paramétré sur tous les catalogues humains et les objets `commun_humains`.

### 7. [P2] Dupliquer une bande ne remappe pas les cibles de ses effets persistants

Fichiers :

- `src/state/RostersContext.tsx:51-76`
- `src/types/roster.ts:304-315`

La duplication attribue de nouveaux `instance_id` aux membres et remappe le leader, mais elle recopie `effets_persistants` tels quels via le spread du roster original. Or `EffetPersistant.cible` contient précisément un `instance_id`.

Une exemption `CLE_FRANC_TIREUR_GRATUIT` présente au moment de la duplication continue donc de viser l'identifiant du membre de la bande source et ne s'applique plus au membre de la copie.

Correction recommandée :

- reconstruire les effets persistants pendant la duplication ;
- leur attribuer un nouvel `id` ;
- remapper `cible` avec `idsRemappes` ;
- définir explicitement le comportement si la cible n'existe plus.

### 8. [P2] Recruter dans un groupe sous-facture et sous-duplique les objets possédés en plusieurs exemplaires par figurine

Fichiers :

- `src/utils/shop.ts:784-823`
- `src/utils/shop.ts:839-859`
- `src/components/personnage/RecruterDansGroupeModal.tsx:25-32`

`resumeInventaireParItem()` connaît la quantité totale de chaque objet, mais `clonerEquipementPourNouvellesFigurines()` et `coutEquipementNouvellesFigurines()` ignorent cette quantité et prennent un seul exemplaire par objet distinct.

Exemple :

- groupe de 2 guerriers ;
- inventaire total : 4 Dagues, donc 2 par guerrier ;
- ajout d'un troisième guerrier ;
- résultat actuel : 1 seule Dague ajoutée et facturée ;
- résultat attendu : 2 Dagues ajoutées et facturées.

Correction recommandée :

- passer la taille actuelle du groupe aux deux fonctions ;
- calculer `quantiteParFigurine = quantiteTotale / tailleGroupe` ;
- cloner et facturer `quantiteParFigurine * quantiteNouvelle` ;
- refuser ou réparer au préalable un inventaire non divisible, puisque le code dispose déjà de `inventaireGroupeIncoherent()`.

Cette anomalie existait déjà avant la PR #72, mais elle reste présente sur le `main` audité.

### 9. [P2] Le verrou d'écran n'est pas repris après un passage de l'application en arrière-plan

Fichier :

- `src/state/WakeLockContext.tsx:18-49`

Le navigateur libère automatiquement le `WakeLockSentinel` lorsque l'onglet devient invisible. Le code prévoit de redemander le verrou au retour, mais seulement si `sentinelRef.current` vaut `null`. Aucun gestionnaire de l'événement `release` ne vide cette référence ; elle continue donc généralement de pointer vers un sentinel déjà libéré.

Correction recommandée :

- écouter l'événement `release` du sentinel ;
- vider la référence seulement si elle pointe encore vers ce même sentinel ;
- au retour au premier plan, tester également `sentinelRef.current?.released` ;
- couvrir le parcours `visible → hidden → visible` par un test avec une fausse API Wake Lock.

### 10. [P2] Le test obligatoire « Œil des Dieux Sombres » peut être ignoré

Fichiers :

- `src/components/postbataille/ResolutionOeilDesDieuxSombres.tsx:39-49`
- `src/components/postbataille/ResolutionOeilDesDieuxSombres.tsx:95-137`
- `src/components/postbataille/PostBatailleScreen.tsx:914-945`

La résolution est affichée sur l'étape Résumé pour les Maraudeurs du Chaos. Son état `resolu` reste local au composant et le bouton final « Valider et enregistrer » n'en tient pas compte. Le joueur peut donc terminer l'après-bataille sans déclarer « Réussi » ou « Raté ».

Correction recommandée :

- remonter l'état de résolution dans `PostBatailleScreen` ;
- désactiver la validation finale tant que le test applicable n'est pas résolu ;
- conserver « nul » et les chefs déjà marqués comme cas où aucune résolution n'est requise.

### 11. [P2] L'Armure lourde en gromril Lozheim coûte 100 po au lieu des 75 po demandés

Fichiers :

- `src/utils/shop.ts:206-216`
- `src/utils/shop.ts:344-346`
- `src/components/personnage/AchatEquipementModal.tsx:200-205`

La règle Lozheim divise d'abord l'Armure lourde de 50 à 25 po. Le matériau gromril applique ensuite le multiplicateur générique `×4`, soit 100 po.

La règle métier donnée pour ce projet était explicitement :

`50 × 3 ÷ 2 = 75 po`.

La donnée officielle `×4` et la règle maison demandée ne suivent donc pas la même formule.

Correction recommandée :

- clarifier la priorité de la règle maison dans le code ;
- si 75 po est bien la valeur de référence, utiliser un multiplicateur effectif `×3` pour l'armure en gromril sous Lozheim, sans modifier le prix officiel lorsque la règle est désactivée ;
- ajouter des tests de prix pour Armure légère, Armure lourde, Gromril, Ithilmar et Carapaçon, avec et sans Lozheim.

## Contrôles réussis

- `oxlint` : succès, aucune erreur.
- `tsc -b` : succès.
- build Vite/PWA de production : succès.
- `git diff --check 0a6e797..69dfd55` : succès.
- Validation des données :
  - 41 bandes chargées ;
  - 292 objets chargés ;
  - aucun identifiant d'objet dupliqué ;
  - aucune référence d'objet manquante dans les listes d'équipement ;
  - aucun identifiant de profil dupliqué à l'intérieur d'une bande ;
  - aucun utilisateur de magie ou domaine attendu manquant dans les références contrôlées.

Le message Git `dubious ownership` affiché à la fin du build vient de l'environnement local utilisé pour calculer l'identifiant de version. Il n'a pas fait échouer le build et ne correspond pas à une erreur TypeScript ou Vite.

## Tests de non-régression prioritaires à ajouter

1. Achat d'un objet et d'un matériau avec trésorerie exacte, insuffisante et achat de groupe.
2. Cycle complet sur deux batailles pour le Vagabond et le Débiteur reconnaissant.
3. Snapshot des participants : une recrue obtenue pendant l'exploration ne gagne pas l'XP de la bataille passée.
4. Profils génériques sans expérience : aucune case XP, aucun gain, aucune avancée.
5. Nécromancien avec Liche vivante puis morte, depuis recrutement, avancée, ajout manuel et Grimoire.
6. Duplication d'une bande avec leader libre et effet persistant ciblé.
7. Ajout d'une recrue dans un groupe portant deux armes identiques par figurine.
8. Accès aux objets `commun_humains` pour chaque catalogue humain.
9. Wake Lock après retour d'arrière-plan.
10. Impossibilité de valider l'après-bataille des Maraudeurs tant que l'Œil n'est pas résolu.

## Limites de la revue

- Le dépôt ne contient toujours pas de suite de tests automatisés déclenchable par un script `test`.
- Les règles de chaque nouvelle bande n'ont pas été comparées ligne par ligne à tous leurs suppléments papier d'origine.
- Les parcours navigateur ont ciblé les risques métier les plus élevés. Les données temporaires créées pour les reproductions ont été supprimées et la bande de test d'origine a été restaurée.

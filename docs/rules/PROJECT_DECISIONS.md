# Décisions de règles du projet

Registre des arbitrages de règles pris pour ce projet, quand une question a été tranchée par Yannick (règle officielle ambiguë, règle optionnelle activée/désactivée, écart maison assumé). Ce fichier ne contient que des décisions **explicitement validées par Yannick** — un audit (`mordheim-rules-auditor` ou autre) ne doit jamais y ajouter d'entrée de sa propre initiative, seulement proposer une question à trancher (voir le gabarit ci-dessous) dans son rapport, pour ajout ici après validation.

Les choix de règles faits au fil des sessions précédentes, avant la création de ce fichier (visibles dans l'historique git et les commentaires du code), n'ont pas été rétroactivement transcrits ici — seules les décisions prises à partir de sa création y sont consignées.

## Gabarit d'entrée

Copier ce bloc pour chaque nouvelle décision, une fois validée par Yannick :

```markdown
### <Titre court de la question>

- **Question de règle** : <description précise de l'ambiguïté ou du choix à faire>
- **Source et page** : <nom exact du document (voir SOURCE_INDEX.md) + numéro de page, ou "aucune source locale disponible">
- **Décision de Yannick** : <ce qui a été tranché, verbatim si possible>
- **Statut** : Officiel | Optionnel | Maison
- **Parties du code concernées** : <fichier:ligne ou zone fonctionnelle>
- **Date** : <AAAA-MM-JJ>
```

## Décisions enregistrées

### Artilleurs de Nuln — prix des 3 paires de pistolets

- **Question de règle** : le PDF imprime directement 35/35/65 CO pour les paires (double canon, duel, duel à double canon), mais la convention générale de l'app (« prix de la paire = double du prix simple », documentée sur chaque item du catalogue) donne 40/40/70 CO — la valeur en place avant cette décision, restaurée par un revert QA (commit 7dc3234) pour rester cohérente entre onglets, sans trancher laquelle des deux sources fait réellement foi.
- **Source et page** : `Artilleurs de Nuln [GLM].pdf`, liste d'équipement p.24 (Pistolet à double canon), p.28 (Pistolet de duel, Pistolet de duel à double canon) vs convention générique `note_maison` de `src/data/items/armes_poudre_noire.json`.
- **Décision de Yannick** : suivre le prix imprimé du PDF (35/35/65 CO), au prix d'une exception à la convention générale.
- **Statut** : Maison (exception assumée à la convention générique, en faveur du prix imprimé)
- **Parties du code concernées** : `src/data/warbands/artilleurs_de_nuln.json` (`cout` des 3 paires fixé à 35/35/65 dans les listes `artilleurs_de_nuln` et `tireurs_delite`) ; `src/utils/shop.ts` (`PRIX_LISTE_RAPIDE_NULN` étendue aux 3 paires, pour que le shop commun reste cohérent avec la liste de bande). Deux des trois objets sont partagés avec d'autres bandes (`pistolet_double_canon_paire` avec les Ostlanders ; `pistolet_de_duel_paire` en accès générique `rare_10`, ouvert à toute bande y ayant droit) — ces bandes gardent le prix issu de la convention générale (double du prix simple), seul le catalogue `artilleurs_de_nuln` applique ce prix fixe.
- **Date** : 2026-08-31

### Ostlanders — la règle « Autonome » ferme-t-elle aussi les Dramatis Personae ?

- **Question de règle** : la règle limite les Francs-Tireurs de la bande à l'Ogre uniquement. Le texte ne nomme que « Francs-Tireurs », jamais les « Personnages Hauts en Couleur » (Dramatis Personae) explicitement — contrairement à d'autres bandes qui citent les deux catégories ensemble quand la restriction doit s'étendre aux deux.
- **Source et page** : `Mercenaires Ostlanders [GLM].pdf`, règle spéciale « Autonome ».
- **Décision de Yannick** : étendre la restriction aux Dramatis Personae — aucune n'est recrutable par cette bande (seul l'Ogre, via les Francs-Tireurs).
- **Statut** : Maison (lecture extensive d'un texte qui ne le précise pas explicitement)
- **Parties du code concernées** : `src/data/dramatisPersonae.ts` (`RESTRICTIONS_ABSOLUES_DP.ostlanders = new Set()`, consommée à la fois par `dramatisPersonaeDisponibles()` et `appliquerRestrictionsDeBandeDP()`).
- **Date** : 2026-08-31

### Guerriers Fantômes — test de Force du sort « Théâtre d'Ombres »

- **Question de règle** : 2D6 au PDF FR vs 1D6+1 au PDF EN.
- **Source et page** : source FR vs `Hired Sword Compendium part1.pdf`/source EN équivalente pour ce sort.
- **Décision de Yannick** : garder 1D6+1 (EN).
- **Statut** : Officiel (source EN)
- **Parties du code concernées** : aucune — déjà conforme à l'EN, aucun changement.
- **Date** : 2026-08-31

### Gobelins de la Nuit — la Sorcière est-elle un franc-tireur recrutable pour cette bande ?

- **Question de règle** : présente dans la source EN (TBMF) mais absente de la source FR pourtant citée comme référence par la bande elle-même.
- **Source et page** : `Gobelins de la Nuit [GLM].pdf` (FR, absente) vs source EN (TBMF, présente).
- **Décision de Yannick** : ouvrir l'accès (suivre l'EN).
- **Statut** : Officiel (source EN)
- **Parties du code concernées** : aucune — vérification faite en préparant cette décision : la Sorcière (`src/data/hiredSwords.ts`, `bande_ids: toutesSauf('witch_hunters', 'sisters_of_sigmar')`) est déjà accessible à `gobelins_de_la_nuit`, et `RESTRICTIONS_ABSOLUES.gobelins_de_la_nuit` l'a déjà en liste blanche. Le constat « non tranché » du commit d'audit d'origine (2d4a2ae) décrivait un état qui n'était déjà plus d'actualité au moment de cette décision — aucun changement de code nécessaire.
- **Date** : 2026-08-31

### Gladiateurs — Javelot de gladiateur strictement dominé par le Javelot commun

- **Question de règle** : le Javelot de gladiateur (10 CO, portée annoncée 10ps) partage exactement les mêmes caractéristiques que le Javelot commun du catalogue partagé (5 CO, portée 8ps) sauf sa portée, jamais appliquée en pratique — un objet spécial strictement dominé par sa version commune, qu'aucun joueur rationnel n'achèterait.
- **Source et page** : `Gladiateurs [GLM].pdf`, équipement du style Skink, comparé à `src/data/items/armes_tir.json` (Javelot commun).
- **Décision de Yannick** : laisser tel quel — pas de correction.
- **Statut** : Maison (statu quo assumé plutôt qu'un nouvel item dédié ou un retrait de l'entrée redondante)
- **Parties du code concernées** : aucune.
- **Date** : 2026-08-31

### Artilleurs de Nuln — prix des armes à poudre noire spéciales (Pistolet/Arquebuse à répétition, Mortier portable, Pigeon explosif)

- **Question de règle** : le PDF se contredit entre sa liste rapide d'équipement (prix fixes : Pistolet à répétition 25, Arquebuse à répétition 50, Mortier portable 70, Pigeon explosif 25) et ses fiches détaillées plus loin dans le même document (prix à dés officiels : 30+2D6/60+2D6/80+2D6/30+2D6, déjà réduits par la règle poudre noire avancée à 20+2D6/40+2D6/55+2D6/20+2D6 dans le catalogue générique de l'app avant cette décision). Laquelle fait foi pour cette bande ?
- **Source et page** : `Artilleurs de Nuln [GLM].pdf`, liste rapide p.24/25/27/28 vs fiches détaillées de chaque arme dans le même document.
- **Décision de Yannick** : la liste rapide fait foi — prix fixes, pas de dés.
- **Statut** : Maison (choix entre deux sections contradictoires du même PDF officiel)
- **Parties du code concernées** : `src/data/items/armes_poudre_noire.json` (`pistolet_a_repetition`, `arquebuse_a_repetition`, `pigeon_explosif` — `cout` fixé directement, exclusifs à Nuln) ; `src/utils/shop.ts` (`PRIX_LISTE_RAPIDE_NULN`, pour `mortier_portable` qui est partagé avec les Mangeurs d'Hommes — l'override ne s'applique qu'au catalogue `artilleurs_de_nuln`, les Mangeurs d'Hommes gardent le calcul à dés habituel).
- **Date** : 2026-08-31

### Nains du Chaos — prix de l'Exosquelette et de la Machine du Chaos

- **Question de règle** : même schéma que Nuln ci-dessus — le PDF se contredit entre sa liste rapide (Exosquelette 175 CO, Machine du Chaos 125 CO) et ses encadrés détaillés (225 et 195 Couronnes d'Or). Laquelle fait foi ?
- **Source et page** : `Nains du Chaos [GLM].pdf`, liste rapide p.104/110 vs encadrés détaillés p.167-168 (Exosquelette) et p.223-224 (Machine du Chaos).
- **Décision de Yannick** : la liste rapide fait foi (175/125 CO) — cohérent avec la décision Nuln ci-dessus.
- **Statut** : Maison
- **Parties du code concernées** : `src/data/warbands/nains_du_chaos.json` (`exosquelette` déjà à 175, `machine_du_chaos` déjà à 125) — déjà conforme, aucun changement nécessaire.
- **Date** : 2026-08-31

### Averlanders — Arc long et Flèches de chasse réservés aux Bergjaeger

- **Question de règle** : le PDF EN dit explicitement « Bergjaeger only » pour l'Arc long et les Flèches de chasse ; le PDF FR cité comme source par le JSON ne mentionne ni la restriction ni même l'objet Flèches de chasse.
- **Source et page** : `Averland Mercenaries.pdf` (EN) vs `Mercenaires Averlanders [GLM].pdf` (FR, source déclarée par le fichier).
- **Décision de Yannick** : garder la restriction EN — seul le Bergjaeger a accès à l'Arc long et aux Flèches de chasse.
- **Statut** : Officiel (source EN)
- **Parties du code concernées** : `src/data/warbands/averlanders.json` (déjà conforme à l'EN — liste `eclaireurs_bergjaeger` séparée de `eclaireurs`, aucun changement de données ; le champ `source` de tête de fichier reste générique et ne cite pas spécifiquement le FR, donc rien à corriger là non plus).
- **Date** : 2026-08-31

### Gardiens de Chapelle Bretonniens — prix de la Lance des Pèlerins

- **Question de règle** : 5 CO au PDF FR vs 10 CO au PDF EN.
- **Source et page** : `Gardiens de Chapelle Bretonniens [GLM].pdf` (FR) vs source EN équivalente.
- **Décision de Yannick** : garder 10 CO (EN).
- **Statut** : Officiel (source EN)
- **Parties du code concernées** : `src/data/warbands/gardiens_de_chapelle_bretonniens.json` (`relique_sacree_bretonnienne`/liste Pèlerins — déjà à la valeur EN, aucun changement).
- **Date** : 2026-08-31

### Gardiens de Chapelle Bretonniens — présence du Fléau dans la liste Chevaliers

- **Question de règle** : le Fléau est absent de la liste Chevaliers au PDF FR mais présent au PDF EN, et cohérent avec le texte de la compétence « Muscles saillants » qui le mentionne explicitement.
- **Source et page** : `Gardiens de Chapelle Bretonniens [GLM].pdf` (FR, absent) vs source EN équivalente (présent) + compétence « Muscles saillants ».
- **Décision de Yannick** : garder le Fléau dans la liste.
- **Statut** : Officiel (source EN, cohérent avec une autre règle déjà implémentée)
- **Parties du code concernées** : `src/data/warbands/gardiens_de_chapelle_bretonniens.json` (déjà présent, aucun changement).
- **Date** : 2026-08-31

### Amazones (Setting Lustrie) — Élixir de Vie

- **Question de règle** : le PDF FR (GLM) autorise une relance du tableau des Dégâts uniquement si un second jet de 1D6 tombe sur 1-4 ; le PDF EN d'origine (Town Cryer #15) autorise une relance simple, sans jet supplémentaire.
- **Source et page** : `Amazones - Setting Lustrie [GLM].pdf` (FR) vs Town Cryer #15 (EN d'origine).
- **Décision de Yannick** : garder la relance simple (EN).
- **Statut** : Officiel (source EN d'origine)
- **Parties du code concernées** : aucune — l'app suit déjà l'EN pour cette compétence, aucun changement nécessaire.
- **Date** : 2026-08-31

### Skavens Pestilens — les Rats Géants invoqués par « Rejetons du Rat Cornu » disparaissent-ils après la bataille ?

- **Question de règle** : le PDF EN (Errata'd) le dit explicitement (« the rats disappear after the battle »). Le PDF FR (GLM) est silencieux sur ce point — il dit seulement que ces Rats ne comptent pas dans l'effectif max de la bande, sans préciser s'ils repartent ou rejoignent le roster en permanence.
- **Source et page** : `Pestilens, Errata'd.pdf` (EN) vs `Skavens du Clan Pestilens [GLM].pdf` (FR), sort « Rejetons du Rat Cornu ».
- **Décision de Yannick** : ils disparaissent après la bataille (suit l'EN) — ce sont des renforts temporaires pour la partie en cours, jamais ajoutés au roster permanent.
- **Statut** : Officiel (source EN)
- **Parties du code concernées** : aucune — correspond déjà au comportement de facto de l'app (aucun mécanisme n'ajoute ces Rats au roster après la bataille), aucun changement nécessaire.
- **Date** : 2026-08-31

### Commandement de l'Enfant du Chaos (Maraudeurs du Chaos)

- **Question de règle** : le profil `enfant_du_chaos` a-t-il un Commandement de 5 ou de 10 ? Les deux sources locales se contredisent : toutes les autres caractéristiques (M, CC, CT, F, E, PV, I, A) sont identiques entre les deux éditions, seul le Cd diverge.
- **Source et page** : `Maraudeurs du Chaos [GLM].pdf` (FR, édition GLM/BTB 2022, 18 pages), page 7, tableau "0-1 Enfant du Chaos" → Cd 5 ; `Marauders of Chaos.pdf` (ENG, édition 2010, 8 pages), page 4, tableau "0-1 Spawn of Chaos" → Ld 10.
- **Décision de Yannick** : Commandement 10 (source ENG).
- **Statut** : Officiel
- **Parties du code concernées** : `src/data/warbands/maraudeurs_du_chaos.json` (profil `enfant_du_chaos`, champ `stats.Cd`) — déjà à 10, aucun changement nécessaire.
- **Date** : 2026-08-27

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

### Nains du Chaos — accès Franc-Tireur Sorcière

- **Question de règle** : la règle spéciale « Francs-Tireurs » des Nains du Chaos autorise « ceux permis aux bandes Orques et du Chaos », sans lister les noms un par un. La Sorcière ne figurait pas dans la liste blanche `RESTRICTIONS_ABSOLUES.nains_du_chaos`, alors qu'elle figure explicitement dans celle des Maraudeurs du Chaos (même catégorie interne « Adeptes du Chaos », `bandeCategories.ts`) et que son propre champ `employeurs.bande_ids` ("toute bande sauf Répurgateurs et Sœurs de Sigmar") ne l'exclut pas des Nains du Chaos.
- **Source et page** : `Nains du Chaos [GLM].pdf`, p.1, règle spéciale « Francs-Tireurs » — aucune source ne nomme « Sorcière » explicitement pour cette bande (contrairement à Maraudeurs du Chaos où c'est nommé).
- **Décision de Yannick** : ouvrir l'accès — lecture extensive de « bandes... du Chaos », alignée sur la liste déjà retenue pour les Maraudeurs du Chaos.
- **Statut** : Maison (lecture extensive d'un texte qui ne le précise pas explicitement)
- **Parties du code concernées** : `src/data/hiredSwords.ts` (`RESTRICTIONS_ABSOLUES.nains_du_chaos`, ajout de `'sorciere'`).
- **Date** : 2026-09-01

### Tromblon Nain du Chaos — règle « Incidents de tir systématiques »

- **Question de règle** : l'app appliquait au Tromblon Nain du Chaos une règle spéciale absente de toute source retrouvée — un jet de 1D6 avant chaque tir (échec sur 1) forçant un incident de tir même hors règle optionnelle de campagne. Le PDF source complet de l'arme (« The Sons of Hashut »), fourni par Yannick, confirme tous les autres points (40 CO, Rare 9, portée 16ps, Force 3, Décharge, Rechargement) mais ne mentionne cette règle nulle part, et le changelog de l'éditeur du document détaille précisément ce qui a été changé sur l'arme sans jamais évoquer un mécanisme de raté.
- **Source et page** : « The Sons of Hashut » (GW Troll Magazine Espagne, éd. Moska García & Styrofoam King), p.3 — silence total sur ce point.
- **Décision de Yannick** : retirer la règle, faute de source.
- **Statut** : Officiel (alignement strict sur la source retrouvée)
- **Parties du code concernées** : `src/data/items/armes_poudre_noire.json` (`tromblon_nain_du_chaos.regles_speciales`, retrait de l'entrée « Incidents de tir systématiques » + `note_maison` nettoyée de la référence à cette règle) ; `src/i18n/data/items.ts` (retrait du miroir EN « Systematic Misfires »).
- **Date** : 2026-09-02

### Fils d'Hashut — accès à l'armure du Tromblonnier

- **Question de règle** : la rubrique « Blunderbusster equipment lists » (p.2) n'imprime aucune section ARMOUR, contrairement aux 2 autres listes d'équipement de la bande qui en ont une — d'abord lu comme un simple silence de la source. Mais le texte du profil « 0·3 Blunderbuss Chaos Dwarfs » (Henchmen, p.4) dit explicitement : « Blunderbuss Chaos Dwarfs may be equipped with weapons chosen from the Blunderbuss Chaos Dwarf equipment lists » — exactement la même formule (« Weapons/Armour: ... weapons chosen from the [X] equipment lists ») que celle utilisée pour les 2 autres profils, dont la liste d'équipement imprime bien une rubrique ARMOUR. L'absence d'ARMOUR sous « Blunderbusster equipment lists » à la p.2 est donc une lacune de mise en page du document source, pas une restriction voulue — confirmé en croisant p.2 et p.4 du même PDF, pas une simple supposition sur un silence.
- **Source et page** : « The Sons of Hashut » (GW Troll Magazine Espagne), p.2 (rubrique « Blunderbusster equipment lists », sans ARMOUR) et p.4 (profil « 0·3 Blunderbuss Chaos Dwarfs », formule Weapons/Armour identique aux autres profils).
- **Décision de Yannick** : garder l'accès armure actuel (armure légère/armure lourde/casque) — confirmé conforme à la source une fois les deux pages croisées, pas une simple tolérance d'un silence.
- **Statut** : Officiel (confirmé par recoupement interne au document, malgré la lacune de mise en page p.2)
- **Parties du code concernées** : aucune — comportement de l'app déjà correct, aucun changement nécessaire.
- **Date** : 2026-09-02

### Mangeurs d'Hommes — Mortier portable : objet catalogue distinct de celui des Artilleurs de Nuln, et son prix

- **Question de règle** : la source Ogre nouvellement retrouvée (`Maneaters.pdf`) décrit un « Hand-Held Mortar » aux statistiques et au texte de règle quasi identiques à celui déjà catalogué pour les Artilleurs de Nuln (`mortier_portable`, alors partagé entre les deux bandes via `acces: ["artilleurs_de_nuln", "maneaters"]`), avec le même conflit interne liste-rapide (70 CO fixe, p.2) / encadré détaillé (80+2D6 CO, p.3) déjà rencontré et tranché pour Nuln. Fallait-il traiter ça comme un seul objet partagé (une seule décision de prix pour les deux bandes) ou comme deux objets distincts ?
- **Source et page** : `Maneaters.pdf`, p.2 (« OGRE EQUIPMENT LIST », « Hand-held mortar ... 70 gc ») et p.3 (« Ogres special equipment », « hand-held mortar / 80 + 2D6 gold crowns ») ; comparé à `Artilleurs de Nuln [GLM].pdf` et `Gunnery School Of Nuln.pdf`, qui décrivent la même arme quasi mot pour mot avec le même conflit de prix.
- **Décision de Yannick** : ce sont deux armes distinctes dans la fiction malgré la ressemblance des statistiques — objet catalogue à dédoubler. Pour le prix du nouvel objet Ogre (`mortier_portable_ogre`) : prix fixe 70 CO, tranché indépendamment mais avec la même conclusion que Nuln (liste rapide fait foi).
- **Statut** : Maison (choix entre deux sections contradictoires du même document, comme pour Nuln) + Officiel (le dédoublement lui-même, confirmé explicitement par Yannick)
- **Parties du code concernées** : `src/data/items/armes_poudre_noire.json` (nouvel item `mortier_portable_ogre`, prix fixe 70 CO via `prix_poudre_noire_fixe: true` ; `mortier_portable` redevient exclusif à `artilleurs_de_nuln`, `disponibilite` corrigée en conséquence) ; `src/data/warbands/maneaters.json` (références mises à jour vers le nouvel id, lignes équipement Ogre et `equipement_special`) ; `src/i18n/data/items.ts` (traduction anglaise du nouvel item).
- **Date** : 2026-09-03

### Mangeurs d'Hommes — profil « Guerrier gnoblar » absent de la source Ogre retrouvée

- **Question de règle** : le profil recrutable « Guerrier gnoblar » (Homme de main à part entière, stats M4/CC2/CT3/F2/E3/PV1/I3/A1/Cd5, coût 15+1D6, Rare 9, règles « Chamailleries »/« Comme un chien de guerre ») n'apparaît nulle part dans `Maneaters.pdf` : la section « Choice of warriors » (p.1) ne liste que Capitaine/Guide/Jeunes Sangs/Demi-Grands/Taureaux/Tigres à Sabre, et aucun tableau de statistiques pour un Gnoblar ne figure dans les 5 pages du document (seule mention : « Gnoblar Fighter ... 15 gc » dans la liste d'équipement Divers, sans détail ni rareté). Le même bloc de statistiques existe verbatim dans `nains_du_chaos.json`, suggérant une réutilisation entre bandes plutôt qu'un contenu propre aux Mangeurs d'Hommes. Fallait-il le garder (contenu maison d'une autre source) ou le retirer (copier-coller erroné, non sourcé pour cette bande) ?
- **Source et page** : `Maneaters.pdf`, p.1 (« Choice of warriors », absence de catégorie Gnoblar) et p.2 (« Miscellaneous », « Gnoblar Fighter ... 15 gc », seule occurrence du terme dans tout le document).
- **Décision de Yannick** : garder — c'est un contenu légitime venant d'une autre source (partagée avec les Nains du Chaos).
- **Statut** : Maison (contenu assumé au-delà de cette source précise)
- **Parties du code concernées** : aucune — `src/data/warbands/maneaters.json` (profil `guerrier_gnoblar`) inchangé.
- **Date** : 2026-09-03

### Cavalcade Maudite — prix de la Lance à sanglier

- **Question de règle** : la liste rapide d'équipement des Héros imprime « Boar Spear (Aristocrat only) ... 30 GC », mais le paragraphe descriptif détaillé du même objet, plus loin dans le même document, indique « Cost: 20 Gold Crown / Availability: Rare 10, Aristocrat only » — même conflit interne liste-rapide/encadré détaillé déjà rencontré et tranché pour Nuln/Nains du Chaos.
- **Source et page** : `The Cursed Cavalcade.pdf`, p.2 (« HEROES EQUIPMENT LIST », liste rapide) vs p.3 (encadré détaillé « Boar Spear »).
- **Décision de Yannick** : garder 30 CO — la liste rapide fait foi, même méthode que pour Nuln/Nains du Chaos.
- **Statut** : Maison (choix entre deux sections contradictoires du même document, comme pour Nuln)
- **Parties du code concernées** : aucune — `src/data/warbands/cavalcade_maudite.json` (`lance_a_sanglier`, 30 CO) déjà conforme, aucun changement nécessaire.
- **Date** : 2026-09-06

### Chasseurs Cornus — prix des Flèches de chasse

- **Question de règle** : la liste rapide d'équipement des Héros du PDF FR indique « Flèches de chasseur ... 20 CO » (prix fixe, aucune mention de rareté) ; le PDF EN de 2007 confirme, sans même connaître de variante à dé (« Hunting arrows ... 20 gc », seule occurrence du terme dans tout le document). Seul l'encadré détaillé « Équipement spécial » d'une réécriture FR plus récente (GLM) introduit un prix à dé différent (« 25+1D6 CO / Rare 8 ») — jusqu'ici recopié à tort dans le catalogue de bande.
- **Source et page** : `Chasseurs cornus [GLM].pdf`, p.2 (liste rapide) vs p.3 (encadré détaillé « Équipement spécial ») ; `Horned Hunters.pdf` (EN, 2007), p.1 (« Miscellaneous », seule occurrence).
- **Décision de Yannick** : 20 CO fixe pour cette bande (liste rapide fait foi, convention déjà appliquée à Nuln/Cavalcade Maudite). **Révision du 6 septembre 2026** : la rareté (Rare 8) est conservée — elle avait été supprimée par erreur dans une première passe (surcharge `rarete: "-"`), sous l'hypothèse que l'encadré détaillé était une pure coquille d'édition. Après vérification plus poussée (règle générique confirmée dans `Mordheim - Part 3 - Campaigns & Optional Rules.pdf`, p.26 : après la première bataille, un objet Rare n'est plus achetable librement, même sur la liste propre d'une bande, et doit être retrouvé par recherche), la lecture retenue est : le prix fixe de la liste rapide reste le tarif de l'objet, mais la rareté du livre de règles s'applique normalement — l'objet est donc masqué de la boutique après la première bataille, comme tout objet Rare, réutilisant le mécanisme déjà existant de l'app (`masquerObjetsRares`/`roster.historique_batailles.length > 0`) plutôt que d'introduire un second prix pour l'achat via recherche (non modélisé par l'app, aurait demandé un vrai nouveau mécanisme).
- **Statut** : Maison (choix entre deux sections contradictoires, comme pour Nuln/Cavalcade Maudite) + Officiel (le prix fixe est aussi corroboré indépendamment par la source EN ; le maintien de la rareté Rare 8 s'appuie sur la règle générique confirmée du livre de règles)
- **Parties du code concernées** : `src/data/warbands/chasseurs_cornus.json` (référence `fleches_de_chasse` dans la liste rapide Héros et dans `equipement_special` : `cout` à 20, rareté laissée sans surcharge — hérite donc du Rare 8 de l'objet générique `src/data/items/munitions.json`, texte de disponibilité rétabli en « Rare 8 »). L'item générique `fleches_de_chasse` du catalogue commun (25+1D6 CO, Rare 8) reste inchangé et continue de servir les autres bandes y ayant droit (Averlanders, Hors-la-loi de Stirwood...).
- **Date** : 2026-09-06 (révisée le même jour)

### Prière « Cœur d'Acier » (Répurgateurs / Sœurs de Sigmar / Hors-la-loi de Stirwood) — condition de fin d'effet

- **Question de règle** : la source FR retenue par le projet dit que les effets durent jusqu'à ce que le lanceur soit mis Hors de combat ; la source EN est plus permissive pour l'adversaire, l'effet cessant dès que le lanceur est sonné, à terre OU mis Hors de combat (pas seulement ce dernier état).
- **Source et page** : source FR du projet pour cette prière (Prières de Sigmar) vs source EN équivalente.
- **Décision de Yannick** : suivre l'EN — l'effet cesse dès que le lanceur est sonné, à terre ou mis Hors de combat.
- **Statut** : Officiel (source EN)
- **Parties du code concernées** : `src/data/warbands/witch_hunters.json`, `sisters_of_sigmar.json`, `hors_la_loi_de_stirwood.json` (texte de la prière `c_ur_d_acier`, les 3 catalogues portent chacun leur propre copie du sort) ; miroirs anglais correspondants dans `src/i18n/data/warbands.ts`. Correction purement textuelle — le comportement en jeu (recrutement, roster) n'était pas affecté, cette prière étant un effet de partie non automatisé par l'app.
- **Date** : 2026-09-06

### Kislévites — XP de départ du Dompteur d'Ours

- **Question de règle** : l'app affiche 8 XP de départ pour le Dompteur d'Ours, conforme à la source EN citée par l'audit Niveau 3 du 6 septembre 2026 ; la source FR officiellement déclarée du projet pour cette bande (article de Mark Havener) indique 10.
- **Source et page** : article de Mark Havener, « Les hommes de Kislev, à la moustache pleine de givre et de vodka » (FR, source déclarée de `kislevites.json`) vs source EN citée dans le rapport d'audit Niveau 3 du 6 septembre 2026 — citation exacte (nom de PDF + page) à retrouver dans ce rapport si besoin de revérifier plus tard.
- **Décision de Yannick** : garder 8 (suivre l'EN).
- **Statut** : Officiel (source EN)
- **Parties du code concernées** : aucune — `src/data/warbands/kislevites.json` (profil `dompteur_dours`, `xp_depart: 8`) déjà conforme, aucun changement nécessaire.
- **Date** : 2026-09-06

### Orc Mob — la compétence « On y va ! » ignore-t-elle la Peur, la Terreur, ou les deux ?

- **Question de règle** : le texte FR retenu par le projet (GLM) ne mentionne que la Peur ; la source EN d'origine (Mordheim Annual 2002, « Da Mob Roolz ») mentionne aussi la Terreur. `orques_noirs` (Black Orcs), qui partage la même compétence (même id `on_y_va`), a déjà le texte correct des deux côtés (« ignore les tests de peur et de terreur »).
- **Source et page** : source EN Mordheim Annual 2002 citée par l'audit Niveau 3 du 6 septembre 2026, comparée à `orc_mob.json` (Peur seule) et `orques_noirs.json` (Peur et Terreur, déjà correct).
- **Décision de Yannick** : Peur et Terreur, c'est la même chose (pour l'usage de cette compétence) — ignore les deux, aligné sur `orques_noirs`.
- **Statut** : Officiel (source EN, cohérent avec la bande sœur déjà correcte)
- **Parties du code concernées** : `src/data/warbands/orc_mob.json` (compétence `on_y_va`, texte complété avec « ni de Terreur ») ; miroir anglais `src/i18n/data/warbands.ts` (« Fear or Terror test »).
- **Date** : 2026-09-06

### Mootlanders — plafond du Voleur Halfling

- **Question de règle** : le PDF se contredit lui-même — « jusqu'à trois » en prose p.1, mais la fiche de profil imprime « 0·2 » p.2.
- **Source et page** : `Mootlanders.pdf`, p.1 (prose) vs p.2 (fiche de profil, « 0·2 »).
- **Décision de Yannick** : garder 2 (fiche de profil fait foi).
- **Statut** : Maison (choix entre deux passages contradictoires du même document)
- **Parties du code concernées** : aucune — `src/data/warbands/mootlanders.json` (`voleur_halfling`, `max: 2`) déjà conforme, aucun changement nécessaire.
- **Date** : 2026-09-06

### Ostermarkers — accès compétences du Champion en Option 3

- **Question de règle** : l'Option 3 du tableau de compétences (calquée sur les Mercenaires de Marienburg) donnait au Champion seulement Combat+Tir dans le PDF bande, alors que le tableau officiel « MARIENBURG MERCENARIES » du livre de règles de base donne Combat+Tir+Vitesse à son Champion — rupture de symétrie avec les Options 1/2, qui donnent chacune 3 catégories au Champion.
- **Source et page** : `Mercenaires Ostermarkers [GLM].pdf`, p.3 (Option 3) vs `Mordheim Living Rulebook.pdf`, p.52 (Mercenary skill tables, Marienburg). Confirmé par Yannick : « Ostermarkers follow the rules for Mercenary warbands as given on page 48 of the Mordheim rulebook » — aucune exception propre à cette bande ne justifie de s'écarter du tableau officiel.
- **Décision de Yannick** : ajouter Vitesse — le Champion de l'Option 3 suit le tableau Marienburg officiel (Combat, Tir, Vitesse), comme les Champions des Options 1 et 2.
- **Statut** : Officiel (alignement sur le tableau du livre de règles de base, explicitement suivi par cette bande sans exception)
- **Parties du code concernées** : `src/data/warbands/ostermarkers.json` (`tribus[2].profil_acces_competences.champion`, texte descriptif de l'Option 3, et le résumé combiné des 3 options dans `regles_speciales`) ; miroir anglais `src/i18n/data/warbands.ts` (résumé combiné « Skill Choice »).
- **Date** : 2026-09-06

### Gardiens des Tombes — statut des Flèches aspic (munition ou arme à profil propre)

- **Question de règle** : l'app calquait la portée/Force des Flèches aspic sur celles du Javelot nehekharien (8ps/Force Utilisateur), un objet voisin sans rapport, faute de valeurs propres imprimées dans la source pour cet objet précis.
- **Source et page** : `tomb guardians.pdf` (variante ET vrai Town Cryer #18, confirmés identiques le 6 septembre 2026), p.8, « Asp Arrows » (silencieux sur portée/Force, seule règle spéciale imprimée : « +1 to hit »).
- **Décision de Yannick** : c'est simplement une munition utilisable avec n'importe quel arc, qui donne +1 pour toucher — pas une arme à portée/Force propre. Portée et Force suivent celles de l'arc/du tireur, inchangées.
- **Statut** : Maison (clarification du fonctionnement d'un objet dont la source imprimée reste silencieuse sur ce point précis)
- **Parties du code concernées** : `src/data/items/armes_tir.json` (`fleches_aspic` : `categorie` passée à `"munitions"` — même traitement que `fleches_de_chasse` —, `portee`/`force` mis à `null`, texte de flaveur complété) ; miroir anglais `src/i18n/data/items.ts`.
- **Date** : 2026-09-06

### Gardiens des Tombes — le Gardien des Tombes gagne-t-il de l'expérience ?

- **Question de règle** : la règle générale « No Brain » (« Undead Special Rules ») ne nomme explicitement que les « Skeletons » ; le Gardien des Tombes (Tomb Guard) est un profil distinct dont l'encart SPECIAL RULES propre ne mentionne que « Undead », jamais « No Brain » — le vrai Town Cryer #18 reproduit la même ambiguïté que la variante déjà auditée, aucune clarification supplémentaire trouvée.
- **Source et page** : `tomb guardians.pdf`, p.7 (« Undead Special Rules », « No Brain », ne nomme que les Skeletons) et p.10 (« 0-2 Tomb Guardians », encart SPECIAL RULES, silencieux sur l'XP).
- **Décision de Yannick** : oui, 0 XP — le Gardien des Tombes ne gagne jamais d'expérience, comme actuellement implémenté.
- **Statut** : Maison (lecture extensive de « No Brain » au-delà des seuls Squelettes nommés, faute de texte plus explicite)
- **Parties du code concernées** : aucune — `src/data/warbands/gardiens_des_tombes.json` (`gardien_des_tombes.gagne_experience: false`) déjà conforme, aucun changement nécessaire.
- **Date** : 2026-09-06

### Cour des Plaisirs Profanes — chef de bande librement choisi par le joueur

- **Question de règle** : la bande n'a pas de profil à leadership fixe (pas de « Chef » nommé dans sa composition) — le joueur doit désigner librement lequel de ses Héros assume les règles de Chef, mécanisme déjà utilisé pour d'autres bandes sans chef fixe (ex. Lustrian Reavers).
- **Source et page** : `Court of Profane Pleasures.pdf`, règle « Composition » (« you must choose one Hero to act as your Leader »).
- **Décision de Yannick** : confirmé — vérification faite : `leader_libre: true` est déjà positionné sur `cour_des_plaisirs_profanes.json`, sans aucun profil `est_leader`, ce qui déclenche déjà le mécanisme de choix libre du joueur (bannière + modale, voir `utils/leader.ts`, `choixLeaderRequis`). Déjà correctement câblé, aucun changement nécessaire.
- **Statut** : Officiel (comportement déjà conforme à la source)
- **Parties du code concernées** : aucune — vérifié dans `src/utils/leader.ts` et `src/data/warbands/cour_des_plaisirs_profanes.json`.
- **Date** : 2026-09-06

### Cour des Plaisirs Profanes — tableau d'accès aux compétences des 5 Héros

- **Question de règle** : aucun tableau d'accès aux compétences par catégorie (Combat/Tir/Érudition/Force/Vitesse/Spéciale) n'existe dans la source pour aucun des 5 Héros — contrairement aux autres bandes de ce lot d'audit (Cavalcade Maudite, Chasseurs Cornus), qui en ont chacune un. L'auteur du document reconnaît lui-même l'absence de tableau de compétences pour cette bande.
- **Source et page** : `Court of Profane Pleasures.pdf` (EN, seule source connue, 6 pages) — recherche exhaustive confirmée sans résultat lors de l'audit Niveau 3 du 6 septembre 2026 ; absence confirmée et assumée par l'auteur du document lui-même (reconnu par Yannick).
- **Décision de Yannick** : comme l'auteur reconnaît l'absence de tableau, laisser les 5 Héros en sélection libre du joueur (toutes catégories de compétences accessibles) plutôt que d'imposer une restriction inventée.
- **Statut** : Maison (comblement d'un vide de source explicitement reconnu par l'auteur, pas une divergence entre sources)
- **Parties du code concernées** : `src/data/warbands/cour_des_plaisirs_profanes.json` (`acces_competences` vidé pour les 5 profils Héros — `maitre_fouetteur`, `danseuse`, `marchand_de_chair`, `pretre_de_l_obscene`, `devot` —, `acces_competences_a_verifier` passé à `false` sur chacun, la question étant désormais tranchée plutôt qu'en attente).
- **Date** : 2026-09-06

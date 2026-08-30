# État de l'audit de fidélité des traductions par bande

Suivi de l'investigation lancée après des retours de testeurs Reddit sur la qualité de la traduction anglaise : plusieurs bandes ont été traduites FR→EN dans une session précédente sans jamais avoir eu le document anglais d'origine sous les yeux, ce qui a produit des noms de compétences/profils inventés et, pour certaines, de vraies divergences de règles (pas seulement de traduction). Ce fichier classe les 51 bandes du dépôt en trois niveaux de confiance, pour reprendre le travail sans tout redécouvrir.

Voir `SOURCE_INDEX.md` pour le détail des documents sources (nom exact, SHA-256, langue).

## Niveau 3 — déjà vérifiées cette session (haute confiance)

Audit complet (`mordheim-rules-auditor`) fait contre une source anglaise obtenue et cataloguée, corrections appliquées et poussées sur `main` :

`elfes_noirs`, `expedition_runique`, `orques_noirs`, `amazones_mordheim`, `amazones_lustrie`, `bandits_du_hochland`, `escorteurs_imperiaux`, `hommes_lezards`, `chevaliers_bretonniens`, `tileens`, `hors_la_loi_de_stirwood`, `skavens_pestilens`, `norses`, `pirates`, `guerriers_fantomes`, `maraudeurs_du_chaos`.

`maraudeurs_du_chaos` : l'écart de longueur FR/EN qui avait motivé la priorisation de cette bande s'est avéré normal — le PDF EN de 8 pages (Town Cryer #10) renvoie explicitement au livre de règles Mordheim (Rituels du Chaos de base) et à Empire in Flames (Bénédictions de Nurgle, Bestiaire) au lieu de les détailler, alors que le JSON FR les intègre. Seuls 9 noms propres divergeaient réellement (compétences, sorts, Marques — ex. « Chosen by Chaos » → « Chosen of Chaos », « Mark of Onogal the Raven » → « ... the Crow »), tous corrigés. Aucune divergence de règle ou de valeur numérique trouvée.

`gardiens_de_chapelle_bretonniens` : vérification partielle seulement (un seul point précis confirmé — noms « Questing Knight »/« Knight Errant » — pas un audit exhaustif de toutes ses règles spéciales/compétences comme les 16 bandes ci-dessus). À auditer complètement si on veut le même niveau de confiance.

`gladiateurs` : ré-auditée intégralement (grand audit des règles, pas seulement traduction) contre `Gladiateurs [GLM].pdf`, commit de correction `24e6cdf` — francs-tireurs (accès élargi à MERCENAIRES avec exclusion explicite de l'Éclaireur elfe), compétences spéciales exclusives du Tueur de Trolls (déplacées vers le profil), restrictions de profil sur la liste d'équipement Ogres/Tueurs de Trolls. Reclassée niveau 3 à part entière.

## Niveau 1 — source anglaise cataloguée, jamais recroisée avec le texte actuel de l'app

Ces PDF EN faisaient partie de l'envoi initial de 63 fichiers (session du 2026-08-13) et sont dans `SOURCE_INDEX.md`, mais aucun audit de fidélité n'a encore comparé leur contenu au texte anglais actuellement affiché par l'app (`src/i18n/data/warbands.ts`). Prochaine étape : redemander le PDF exact à Yannick (il faut le renvoyer, les fichiers ne sont pas conservés entre sessions) puis lancer `mordheim-rules-auditor` dessus, même méthode que pour le niveau 3.

| Bande (id catalogue) | PDF EN catalogué | Remarque |
|---|---|---|
| `artilleurs_de_nuln` | `Gunnery_School_Of_Nuln.pdf` | |
| `gobelins_des_forets` | `Forest_Goblins.pdf` | |
| `gardiens_des_tombes` | `Tomb_Guardians.pdf` (TC18) et `tomb_guardians.pdf` (variante) | Deux documents distincts (hash différent), a priori deux versions — comparer les deux |
| `nains_du_chaos` | `Sons_of_Hashut.pdf` | |
| `morts_sans_repos` | `The_Restless_Dead.pdf` | |
| `cavalcade_maudite` | `The_Cursed_Cavalcade.pdf` | |
| `cour_des_plaisirs_profanes` | `Court_of_Profane_Pleasures.pdf` | |
| `chasseurs_cornus` | `Horned_Hunters.pdf` | |
| `caravanes_marchandes` | `Merchant_Caravans.pdf` | |
| `moines_guerriers_de_cathay` | `Battle_Monks_of_Cathay.pdf` | |
| `maneaters` | `Maneaters.pdf` (TC16) | |
| `mootlanders` | `Mootlanders.pdf` | |
| `lustrian_reavers` | `LustrianReaversV1.2.pdf` | Langue non confirmée (page de titre sans texte extractible) — à vérifier avant même l'audit |
| `pilleurs_de_tombes_arabes` | `Arabian_Tomb_Raiders.pdf` | Langue non confirmée |

## Niveau 2 — aucune source cataloguée dans aucune langue

Aucun PDF, ni FR ni EN, n'a jamais été fourni pour ces bandes. Deux sous-groupes de risque très différents :

**Probablement bas risque** — bandes de base officielles LRB2 (`Mordheim__Part_2__Warbands.pdf`), dont le texte anglais est vraisemblablement la source originale plutôt qu'une traduction depuis le français : `reiklanders`, `marienburgers`, `middenheimers`, `ostlanders`, `averlanders`, `witch_hunters`, `undead`, `skaven`, `orc_mob`, `sisters_of_sigmar`, `kislevites`.

**Provenance inconnue, à vérifier en premier si on creuse ce niveau** : `beastmen_raiders`, `carnival_of_chaos`, `cult_of_the_possessed`, `sylvaneths`, `fils_dhashut`, `dwarf_treasure_hunters`, `gobelins_de_la_nuit`.

## Prochaine étape suggérée

Continuer le niveau 1 (le plus actionnable — sources déjà identifiées, juste à renvoyer) : 14 bandes restantes, aucune priorité particulière repérée pour l'instant.

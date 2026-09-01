# État de l'audit de fidélité des traductions par bande

Suivi de l'investigation lancée après des retours de testeurs Reddit sur la qualité de la traduction anglaise : plusieurs bandes ont été traduites FR→EN dans une session précédente sans jamais avoir eu le document anglais d'origine sous les yeux, ce qui a produit des noms de compétences/profils inventés et, pour certaines, de vraies divergences de règles (pas seulement de traduction). Ce fichier classe les 52 bandes du dépôt en niveaux de confiance, pour reprendre le travail sans tout redécouvrir.

Voir `SOURCE_INDEX.md` pour le détail des documents sources (nom exact, SHA-256, langue).

## Mise à jour du 2026-08-31

Entre la précédente version de ce fichier et aujourd'hui, une campagne d'audit des règles s'est étalée sur plusieurs sessions (24 → 31 août 2026, voir `src/data/changelog.ts` et l'historique git — commits `Audit bande #N/51 (...)`, `fix(<bande>): ...`, et les entrées `mordheim-rules-auditor` citées dans `PROJECT_DECISIONS.md`) et a fait passer **chacune des 52 bandes** par au moins une passe de vérification, corrections de traduction anglaise incluses. Aucune bande ne reste donc totalement non auditée.

Cela dit, toutes les passes ne se valent pas — ce fichier distingue toujours plusieurs niveaux :

- **Niveau 3** : audit complet par `mordheim-rules-auditor` contre une source anglaise identifiée et explicitement croisée (méthode d'origine de ce fichier, la plus fiable).
- **Niveau 3bis** : bande passée par le grand audit du 24-31 août (corrections de règles ET de traduction anglaise réellement appliquées), mais sans garantie que la méthode ait inclus un croisement PDF EN aussi systématique que le Niveau 3 pour chaque point — à considérer comme fiable mais pas revérifiée avec la même rigueur.
- **Source introuvable** : 3 bandes pour lesquelles aucun PDF (FR ou EN) n'a jamais été localisé pendant l'audit — seules des corrections de cohérence interne au catalogue ont pu être faites, confiance nettement plus faible que les deux niveaux ci-dessus.

## Niveau 3 — haute confiance (PDF EN croisé explicitement)

Audit complet (`mordheim-rules-auditor`) fait contre une source anglaise obtenue et cataloguée, corrections appliquées et poussées sur `main` :

`elfes_noirs`, `expedition_runique`, `orques_noirs`, `amazones_mordheim`, `amazones_lustrie`, `bandits_du_hochland`, `escorteurs_imperiaux`, `hommes_lezards`, `chevaliers_bretonniens`, `tileens`, `hors_la_loi_de_stirwood`, `skavens_pestilens`, `norses`, `pirates`, `guerriers_fantomes`, `maraudeurs_du_chaos`, `gladiateurs`, `gardiens_de_chapelle_bretonniens`.

`maraudeurs_du_chaos` : l'écart de longueur FR/EN qui avait motivé la priorisation de cette bande s'est avéré normal — le PDF EN de 8 pages (Town Cryer #10) renvoie explicitement au livre de règles Mordheim (Rituels du Chaos de base) et à Empire in Flames (Bénédictions de Nurgle, Bestiaire) au lieu de les détailler, alors que le JSON FR les intègre. Seuls 9 noms propres divergeaient réellement (compétences, sorts, Marques — ex. « Chosen by Chaos » → « Chosen of Chaos », « Mark of Onogal the Raven » → « ... the Crow »), tous corrigés. Aucune divergence de règle ou de valeur numérique trouvée. Revérifiée depuis à plusieurs reprises dans le cadre du grand audit général (Marque d'Arkhar, fouet barbelé, Œil des Dieux Sombres) sans nouvelle divergence de traduction.

`gladiateurs` : ré-auditée intégralement (grand audit des règles, pas seulement traduction) contre `Gladiateurs [GLM].pdf`, commit de correction `24e6cdf` — francs-tireurs (accès élargi à MERCENAIRES avec exclusion explicite de l'Éclaireur elfe), compétences spéciales exclusives du Tueur de Trolls (déplacées vers le profil), restrictions de profil sur la liste d'équipement Ogres/Tueurs de Trolls.

`gardiens_de_chapelle_bretonniens` : classée niveau 1 puis vérification partielle (noms « Questing Knight »/« Knight Errant » seulement) dans les versions précédentes de ce fichier — désormais auditée intégralement : passage dans le grand audit du 26 août (commit `f6bf5e6`, Équitation gratuite, restrictions d'équipement réelles, Basse caste) puis dans la clôture du 31 août, plus un travail approfondi cette même session sur sa règle « Faveur du Seigneur » (objet à moitié prix au recrutement, non-cessible) sourcée et implémentée.

## Niveau 3bis — auditées lors du grand audit des règles (24-31 août 2026)

Toutes les bandes suivantes ont eu au moins une passe de correction de règles ET de traduction anglaise pendant cette campagne (voir `src/data/changelog.ts`, entrées du 25 au 31 août, et les commits `fix(<bande>)`/`Audit <bande>` correspondants) :

`artilleurs_de_nuln`, `averlanders`, `beastmen_raiders`, `caravanes_marchandes`, `carnival_of_chaos`, `cavalcade_maudite`, `chasseurs_cornus`, `cour_des_plaisirs_profanes`, `cult_of_the_possessed`, `culte_des_tueurs`, `dwarf_treasure_hunters`, `gardiens_des_tombes`, `gobelins_de_la_nuit`, `gobelins_des_forets`, `kislevites`, `lustrian_reavers`, `marienburgers`, `middenheimers`, `moines_guerriers_de_cathay`, `mootlanders`, `morts_sans_repos`, `nains_du_chaos`, `orc_mob`, `ostermarkers`, `ostlanders`, `reiklanders`, `sisters_of_sigmar`, `skaven`, `sylvaneths`, `undead`, `witch_hunters`.

Quelques repères notables dans ce lot :

- `culte_des_tueurs` : bande ajoutée le 26 août (traduite en anglais vers le français pour l'occasion, pas l'inverse — donc pas de risque de traduction FR→EN inventée comme pour les autres), puis corrigée le 31 août (armure/tir non-jet interdits aux Tueurs, Dramatis Personae elfe exclues, commit `26d4f87`).
- `sylvaneths` : seule bande n'ayant jamais été mentionnée dans aucun audit avant le 31 août — corrigée ce jour-là (coût/succession/promotion, 2 fuites d'équipement fermées, commit `7bc54e1`), après un premier alignement sur une révision V1.7 de playtest plus tôt dans la campagne (commit `0bb5125`).
- `ostermarkers` : absente par erreur des niveaux précédents de ce fichier alors qu'auditée à deux reprises (27 et 31 août, dont un audit numéroté dédié « #34/51 », commit `6732d33`, et un rétablissement d'accès francs-tireurs, commit `9be53cf`).
- `nains_du_chaos`, `artilleurs_de_nuln`, `averlanders`, `gardiens_de_chapelle_bretonniens`, `amazones_lustrie` : ont aussi fait l'objet d'arbitrages explicites de Yannick sur des divergences FR/EN précises (prix, restrictions, statistiques) — voir `PROJECT_DECISIONS.md`, entrées du 31 août.

## Source introuvable au moment de l'audit — confiance plus faible

Pour ces 3 bandes, aucun PDF (FR ou EN) n'a jamais pu être localisé pendant l'audit : seules des corrections de cohérence interne au catalogue de l'app ont été possibles, sans texte source à croiser. À traiter en priorité si de nouveaux PDF sources sont retrouvés.

| Bande (id catalogue) | Commit(s) | Nature des corrections faites sans source |
|---|---|---|
| `fils_dhashut` | `1b7d699` | Fix partiel possible par cohérence interne uniquement. |
| `maneaters` | `cc37eff`, `e286653` | Fixes internes (3 incohérences internes, malus Clients Difficiles) ; règle « Chien de Guerre » (déblocage de francs-tireurs) implémentée cette session à partir du texte déjà présent dans le catalogue, toujours sans PDF source retrouvé. |
| `pilleurs_de_tombes_arabes` | `fbb2f7a`, `b69a087` | Fix partiel par cohérence interne, puis alignement d'accès francs-tireurs avec les Pirates (bande apparentée) faute de source propre. |

## Prochaine étape suggérée

L'essentiel du travail « à l'aveugle » est fait — il ne reste plus de bande jamais auditée. Deux pistes si on veut pousser la confiance plus loin :

1. Retrouver un PDF (FR ou EN) pour les 3 bandes « source introuvable » ci-dessus, seule vraie zone à risque restante.
2. Pour les bandes de Niveau 3bis, si une confiance équivalente au Niveau 3 est souhaitée sur un point précis (ex. avant une prochaine campagne de traduction), relancer `mordheim-rules-auditor` dessus avec croisement PDF EN explicite, même méthode que pour le Niveau 3 — mais rien n'indique aujourd'hui un problème connu qui le justifierait en urgence.

# CODEXCHANGE — travaux de la branche de test

Ce document décrit les changements réalisés après la PR #72 sur la branche
`codex/reprise-mordheim`. Il est volontairement séparé de `HANDOFF.md`, qui
documente une ancienne session et contient désormais des informations
obsolètes sur la branche et le workflow.

## État GitHub

- Dépôt : `ybarthCH/mordheim-roster-app`
- Branche : `codex/reprise-mordheim`
- PR brouillon : https://github.com/ybarthCH/mordheim-roster-app/pull/73
- Point de départ : `0a6e797` (PR #72 mergée dans `main`)
- Dernier commit fonctionnel documenté ici : `b582208`
- La branche est poussée sur GitHub.
- Aucun des changements de cette branche n'a été mergé dans `main`.

Règle de travail actuelle : continuer sur cette branche et mettre à jour la
PR #73, sans merger dans `main` tant que l'utilisateur n'a pas explicitement
demandé le merge.

### Tenue de ce journal

À chaque mise à jour fonctionnelle poussée sur la PR #73, mettre également
ce fichier à jour avec :

- le nouveau commit et son objectif ;
- le comportement ajouté ou modifié ;
- les fichiers et choix techniques importants ;
- les vérifications réellement effectuées ;
- toute nouvelle limite connue ou décision laissée en attente.

La mise à jour du journal doit accompagner le changement correspondant afin
que `CODEXCHANGE.md` décrive toujours l'état réel de la branche.

## Résumé des commits

| Commit | Objet |
| --- | --- |
| `2f91815` | Intégration du catalogue structuré des francs-tireurs |
| `9adc303` | Corrections d'affichage, d'XP, d'avancement et de blessures des francs-tireurs |
| `688542d` | Ajout de la Magie mineure et du Grimoire de magie |
| `2bef678` | Suppression des avertissements du lint |
| `88aecb9` | Sections de référence repliables avec état mémorisé |
| `60ba7ce` | Trois règles optionnelles persistantes |
| `d6d2245` | Nouvelle fenêtre plein écran d'achat d'équipement |
| `b582208` | Alerte de roster pour les trinkets limités en doublon |

## 1. Catalogue des francs-tireurs

Le PDF fourni par l'utilisateur (`LR merged v1.4-franc tireur.pdf`) a été
converti en un catalogue structuré de 35 profils dans
`src/data/hiredSwords.ts`.

Chaque profil peut définir :

- son prix de recrutement ;
- sa solde d'entretien après chaque bataille ;
- ses caractéristiques, son équipement et ses règles ;
- ses accès aux compétences ;
- les bandes autorisées à l'engager ;
- ses incompatibilités avec d'autres francs-tireurs ;
- ses éventuels profils secondaires ;
- ses règles particulières d'entretien, de départ ou de recrutement.

Le recrutement libre `profil_custom` reste lisible pour la rétrocompatibilité
des anciens rosters, mais les nouveaux recrutements passent par le catalogue.
Chaque type de franc-tireur ne peut être engagé qu'une fois dans une bande.
Les profils incompatibles sont masqués par défaut, avec possibilité de les
afficher.

Principaux fichiers :

- `src/types/hiredSword.ts`
- `src/data/hiredSwords.ts`
- `src/components/roster/RecruterFrancTireurScreen.tsx`
- `src/components/postbataille/EtapeEntretien.tsx`
- `src/utils/profil.ts`
- `src/utils/validation.ts`

### Progression et blessures

Tous les francs-tireurs :

- commencent à 0 XP ;
- affichent la grille d'XP des hommes de main ;
- utilisent la table d'avancement des héros lorsqu'un palier est atteint ;
- utilisent le jet post-bataille des hommes de main lorsqu'ils sont hors de
  combat : 1–2 mort, 3–6 survivant.

Ces comportements sont portés par `Profile.grille_xp` et
`Profile.table_avancement`, afin de ne pas les déduire uniquement du type
général du profil.

### Entretien post-bataille

Une étape dédiée calcule et prélève la solde de chaque franc-tireur. Les cas
spéciaux du catalogue sont également pris en charge : paiement en or ou en
malepierre, coût conditionnel, exemption, maintien sans paiement et départ
automatique après une mission.

## 2. Magie mineure et Grimoire de magie

Les six sorts de Magie mineure ont été ajoutés dans
`src/data/minorMagic.ts`.

Le Mage franc-tireur choisit deux sorts de Magie mineure au recrutement,
comme l'exige son profil. La sélection est intégrée au parcours de
recrutement et les sorts sont ensuite affichés comme les autres sorts connus.

Le Grimoire de magie permet à un sorcier :

- d'apprendre un sort supplémentaire de son propre domaine ;
- ou d'apprendre un sort de Magie mineure.

La logique de résolution des domaines et des sorts se trouve principalement
dans `src/utils/magie.ts`.

## 3. Sections repliables mémorisées

Un composant générique `CollapsibleCard` et le hook
`usePersistentDisclosure` ont été ajoutés.

L'état ouvert/replié est mémorisé sur l'appareil pour :

- les règles spéciales de la bande dans la vue du roster ;
- l'équipement de la bande utilisé comme référence ;
- les sorts du domaine de magie sur la fiche d'un sorcier.

## 4. Règles optionnelles

Les réglages contiennent maintenant une section « Règles optionnelles ».
Les choix sont persistés dans IndexedDB sous la clé `regles_jeu` et
s'appliquent à toutes les bandes de l'appareil.

Fichiers centraux :

- `src/types/rules.ts`
- `src/state/GameRulesContext.tsx`
- `src/state/useGameRules.ts`
- `src/components/reglages/ReglagesScreen.tsx`
- `src/utils/shop.ts`

### Règles avancées de poudre noire

Quand l'option est désactivée, le shop utilise les prix officiels, par
exemple :

- Arquebuse : 35 po ;
- Long fusil du Hochland : 200 po.

Quand elle est activée, le prix est réduit d'environ 33 %, puis arrondi au
multiple de 5 le plus proche :

- Arquebuse : 25 po ;
- Long fusil du Hochland : 135 po.

Les Artilleurs de Nuln utilisent toujours les prix réduits, même si l'option
est désactivée. Leur liste ne doit jamais recevoir une seconde réduction.

### Règle Maison Lozheim

Quand l'option est activée, les armures de corps admissibles coûtent 50 % de
leur prix normal et donnent +1 supplémentaire à la sauvegarde d'armure.

Exemple : une armure lourde en gromril coûte `50 × 3 ÷ 2 = 75 po`.

Sont inclus notamment :

- armures légères et lourdes ;
- variantes en gromril, ithilmar, chaos et cathayennes ;
- armures lamellaires et exosquelettes ;
- caparaçons, y compris bretonniens.

Ne sont pas concernés :

- boucliers ;
- casques ;
- cuirs durcis ;
- pavois ;
- rondaches et protections périphériques comparables.

### Règle Maison Trinket limité

Les objets suivants sont limités à un exemplaire de chaque par bande :

- Porte-bonheur et Gnoblar porte-bonheur ;
- Herbes de soin ;
- Patte de lapin et Amulette de malepierre ;
- Familier et Parchemin de rat familier ;
- Reliques sacrées bretonnienne et sigmarite ;
- futures reliques impies correspondant aux identifiants réservés.

La liste technique est `TRINKETS_LIMITES` dans `src/utils/shop.ts`.

La vérification porte sur tout le roster :

- stock de la bande ;
- inventaire de chaque membre ;
- équipement dupliqué lors du recrutement dans un groupe.

L'achat est bloqué s'il créerait un doublon. Si un ancien roster possède
déjà plusieurs exemplaires, ou si la règle est activée après les achats, une
bannière rouge apparaît dans la vue du roster, comme l'alerte de chef
manquant. Elle indique les objets et quantités concernés, par exemple
`Porte-bonheur ×2`.

Les identifiants `relique_impie` et `relique_maudite` sont réservés dans la
limite, mais ces objets ne sont pas encore présents dans le catalogue
d'équipement.

## 5. Fenêtre d'achat d'équipement

`AchatEquipementModal` utilise maintenant une variante plein écran de
`Modal`.

Comportement :

- la fenêtre occupe tout l'écran, y compris sur mobile ;
- la liste n'a plus son propre défilement imbriqué ;
- la fenêtre complète constitue l'unique zone de défilement ;
- chaque objet rare affiche directement son badge `Rare N` dans le
  catalogue ;
- cliquer un objet ouvre un écran de confirmation distinct ;
- le nom et le badge de rareté restent fixés en haut pendant le défilement ;
- les boutons d'action restent accessibles en bas ;
- un bouton de fermeture reste accessible en haut ;
- le texte de disponibilité ne répète pas `Rare N` lorsque le badge fournit
  déjà exactement cette information.

## 6. Nettoyage du lint

Les avertissements React/Oxlint qui étaient auparavant considérés comme
préexistants ont été supprimés. Les hooks de contexte ont été déplacés vers
des fichiers dédiés :

- `src/state/useRosters.ts`
- `src/state/useTheme.ts`
- `src/state/useGameRules.ts`

Le lint doit maintenant terminer sans avertissement.

## Vérifications réalisées

Pour chaque ensemble fonctionnel :

- `npm run lint` réussi ;
- `npm run build` réussi ;
- `git diff --check` réussi ;
- vérifications réelles dans le navigateur avec un viewport mobile.

Cas vérifiés manuellement :

- disponibilité et recrutement des francs-tireurs ;
- XP, avancement et hors-combat ;
- choix des deux sorts du Mage ;
- persistance des sections repliées ;
- persistance des trois règles optionnelles ;
- prix officiels et réduits de la poudre noire ;
- exception permanente des Artilleurs de Nuln ;
- armure en gromril à 75 po sous Lozheim ;
- exclusions Lozheim inchangées ;
- blocage d'un second Porte-bonheur ;
- alerte `Porte-bonheur ×2` pour un roster déjà invalide ;
- fenêtre d'achat à défilement unique ;
- badge de rareté visible dans le catalogue et fixé pendant l'achat.

Les rosters et réglages créés ou modifiés pour les tests ont été restaurés
après chaque vérification.

## Points à garder en tête

- Il n'existe toujours pas de suite de tests automatisés committée. Les
  vérifications ont été fonctionnelles et manuelles dans le navigateur.
- `profil_custom` ne doit pas être supprimé sans migration : il assure la
  lecture des anciens exports contenant des francs-tireurs personnalisés.
- Les prix payés sont conservés dans les entrées d'inventaire. Changer une
  règle de prix ne doit pas réécrire rétroactivement les anciens achats.
- Les règles optionnelles sont globales à l'appareil, pas stockées
  séparément dans chaque roster.
- `HANDOFF.md` ne décrit pas cette branche. Ses consignes d'ancienne branche
  et de merge automatique ne doivent pas être appliquées à la PR #73.

## Reprendre le travail

1. Se placer sur `codex/reprise-mordheim`.
2. Vérifier `git status -sb` et `git log -5 --oneline`.
3. Continuer à pousser sur cette branche.
4. Mettre à jour la PR brouillon #73.
5. Lancer au minimum `npm run lint` et `npm run build`.
6. Tester les changements d'interface sur mobile.
7. Ne pas merger dans `main` sans demande explicite de l'utilisateur.

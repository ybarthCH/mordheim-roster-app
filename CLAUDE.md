# Orchestration des sous-agents

Ce projet dispose de trois sous-agents Claude Code spécialisés, définis dans `.claude/agents/` : `mordheim-rules-auditor`, `mordheim-qa-reviewer`, `mordheim-responsive-reviewer`. Tous les trois sont en lecture seule (rapports de constats uniquement).

- Claude (l'agent principal) reste le seul autorisé à modifier le code. Les sous-agents produisent des constats ; Claude principal décide et réalise les corrections.
- Pour une modification touchant aux règles du jeu ou aux données de bande (profils, équipement, prix, rareté, compétences, magie, francs-tireurs, expérience, blessures graves, exploration, séquence post-bataille) : consulter `mordheim-rules-auditor` **avant** l'implémentation.
- Après une modification importante : lancer `mordheim-qa-reviewer`.
- Pour toute modification d'interface, de responsive design, de thème ou de split screen : lancer `mordheim-responsive-reviewer`.
- Lors d'une revue générale, les agents pertinents peuvent travailler en parallèle, mais leurs rapports doivent être terminés et synthétisés avant toute correction.
- Ne pas lancer les trois agents automatiquement pour une modification triviale — choisir le ou les agents pertinents pour le changement en cours.
- Ne jamais demander à un sous-agent de créer lui-même d'autres agents.
- Sources PDF de règles : le dépôt GitHub public `ybarthCH/Musterheim-pdf-warband-ref` (dossiers `FR/` et `ENG/` pour les bandes, FR incomplet ; dossier `Rules/` pour le livre de règles de base et les suppléments génériques — Living Rulebook, Part 1/Part 3, Empire in Flames, Best of Town Cryer, Errata, Annual 2002) contient les PDF utilisés pour vérifier les règles — persiste d'une session à l'autre, contrairement aux uploads de session. Chaque dossier contient aussi un sous-dossier de conversion `.md` (via `microsoft/markitdown`) avec un fichier par PDF, un peu moins coûteux à lire — attention à la casse, différente selon le dossier : `FR/Markitdown/` et `ENG/Markitdown/` (d minuscule) mais `Rules/MarkitDown/` (D majuscule). `Rules/MarkitDown/Mordheim Annual 2002, Printable.md` est vide (PDF non convertible, probablement scanné) — utiliser directement le PDF pour ce document. Validé par un audit de test (bande Kislévites) : le texte continu (règles spéciales, équipement en prose) reste fidèle au `.md` même sur un PDF à mise en page multi-colonnes, mais **tout tableau de données chiffrées** (compétences, statistiques) y ressort avec les colonnes entrelacées et doit systématiquement être revérifié sur le PDF d'origine (`pdftotext -layout`) avant d'être cité — pas seulement s'il semble louche, un tableau cassé peut rester plausible à l'œil. Toute citation dans un rapport reste sourcée sur le PDF (nom + page), jamais sur le `.md`. `mordheim-rules-auditor` applique déjà cette règle (voir sa définition) ; Claude principal peut aussi cloner ce dépôt directement (`git clone --depth 1 https://github.com/ybarthCH/Musterheim-pdf-warband-ref.git` vers un répertoire hors de l'arbre de travail, ex. `/tmp`) plutôt que de redemander un PDF déjà présent dedans.

## Politique des branches

- `origin/main` représente la version stable de référence.
- La branche actuellement ouverte, généralement `dev`, représente la version candidate à tester.
- Les agents ne doivent jamais modifier, fusionner, rebaser ou checkout une branche.
- Avant une revue, Claude principal peut actualiser les références distantes avec `git fetch`. Les agents travaillent à partir des références déjà présentes — ils ne fetchent pas eux-mêmes.
- Les agents doivent concentrer leur revue sur le diff `origin/main...HEAD`. Ils peuvent lire le reste du dépôt lorsque le contexte est nécessaire.
- Les tests, builds et contrôles visuels doivent être exécutés sur l'état actuel de la branche `dev`, jamais sur `main`.
- `mordheim-rules-auditor` doit vérifier le résultat complet présent sur `dev`, tout en distinguant les problèmes introduits par le diff des problèmes déjà présents sur `main`.
- `mordheim-qa-reviewer` et `mordheim-responsive-reviewer` doivent indiquer pour chaque problème : « introduit sur dev », « déjà présent sur main », ou « origine indéterminée ».
- Aucun agent ne doit corriger directement `main` ou `dev`.

## Notes de mise à jour

- Chaque merge/push sur `main` doit s'accompagner d'une entrée dans `src/data/changelog.ts` (+ sa traduction anglaise dans `src/i18n/data/changelog.ts`), affichée dans l'app via Options → Notes de mise à jour (voir `ChangelogScreen.tsx`).
- Une entrée par JOURNÉE de mise en production sur `main`, pas par push individuel : si une entrée existe déjà pour la date du jour, ajouter des puces dedans plutôt qu'en créer une nouvelle.
- Chaque puce a une catégorie (`fonctionnalite` / `interface` / `autre`) et un texte pensé pour le joueur (ce qui change pour lui), pas un résumé technique des commits.
- Ne jamais oublier cette étape avant de pousser sur `main` — elle fait partie intégrante du merge, pas une tâche à part.

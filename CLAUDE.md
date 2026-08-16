# Orchestration des sous-agents

Ce projet dispose de trois sous-agents Claude Code spécialisés, définis dans `.claude/agents/` : `mordheim-rules-auditor`, `mordheim-qa-reviewer`, `mordheim-responsive-reviewer`. Tous les trois sont en lecture seule (rapports de constats uniquement).

- Claude (l'agent principal) reste le seul autorisé à modifier le code. Les sous-agents produisent des constats ; Claude principal décide et réalise les corrections.
- Pour une modification touchant aux règles du jeu ou aux données de bande (profils, équipement, prix, rareté, compétences, magie, francs-tireurs, expérience, blessures graves, exploration, séquence post-bataille) : consulter `mordheim-rules-auditor` **avant** l'implémentation.
- Après une modification importante : lancer `mordheim-qa-reviewer`.
- Pour toute modification d'interface, de responsive design, de thème ou de split screen : lancer `mordheim-responsive-reviewer`.
- Lors d'une revue générale, les agents pertinents peuvent travailler en parallèle, mais leurs rapports doivent être terminés et synthétisés avant toute correction.
- Ne pas lancer les trois agents automatiquement pour une modification triviale — choisir le ou les agents pertinents pour le changement en cours.
- Ne jamais demander à un sous-agent de créer lui-même d'autres agents.

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

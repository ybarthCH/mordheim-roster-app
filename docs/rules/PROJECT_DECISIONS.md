# Décisions de règles du projet

Registre des arbitrages de règles pris pour ce projet, quand une question a été tranchée par Yannick (règle officielle ambiguë, règle optionnelle activée/désactivée, écart maison assumé). Ce fichier ne contient que des décisions **explicitement validées par Yannick** — un audit (`mordheim-rules-auditor` ou autre) ne doit jamais y ajouter d'entrée de sa propre initiative, seulement proposer une question à trancher (voir le gabarit ci-dessous) dans son rapport, pour ajout ici après validation.

Ce fichier est actuellement vide de décisions : aucune n'a encore été formellement enregistrée ici. Les choix de règles faits au fil des sessions précédentes (visibles dans l'historique git et les commentaires du code) n'ont pas été rétroactivement transcrits ici — seules les nouvelles décisions, à partir de maintenant, y sont consignées.

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

### Commandement de l'Enfant du Chaos (Maraudeurs du Chaos)

- **Question de règle** : le profil `enfant_du_chaos` a-t-il un Commandement de 5 ou de 10 ? Les deux sources locales se contredisent : toutes les autres caractéristiques (M, CC, CT, F, E, PV, I, A) sont identiques entre les deux éditions, seul le Cd diverge.
- **Source et page** : `Maraudeurs du Chaos [GLM].pdf` (FR, édition GLM/BTB 2022, 18 pages), page 7, tableau "0-1 Enfant du Chaos" → Cd 5 ; `Marauders of Chaos.pdf` (ENG, édition 2010, 8 pages), page 4, tableau "0-1 Spawn of Chaos" → Ld 10.
- **Décision de Yannick** : Commandement 10 (source ENG).
- **Statut** : Officiel
- **Parties du code concernées** : `src/data/warbands/maraudeurs_du_chaos.json` (profil `enfant_du_chaos`, champ `stats.Cd`) — déjà à 10, aucun changement nécessaire.
- **Date** : 2026-08-27

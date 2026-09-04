import type { UiDictionary } from './types';

export const personnageModalsSmall: UiDictionary = {
  // ItemDetailModal
  'itemDetail.range': { fr: 'Portée', en: 'Range' },
  'itemDetail.strength': { fr: 'Force', en: 'Strength' },
  'itemDetail.save': { fr: 'Save', en: 'Save' },
  'itemDetail.close': { fr: 'Fermer', en: 'Close' },

  // RecruterDansGroupeModal
  'recruterDansGroupe.titlePrefix': { fr: 'Recruter dans', en: 'Recruit into' },
  'recruterDansGroupe.figurineCount': { fr: 'Nombre de figurines rejoignant le groupe', en: 'Number of models joining the group' },
  'recruterDansGroupe.groupHasXpPrefix': { fr: 'Le groupe a', en: 'The group has' },
  'recruterDansGroupe.eachModelCosts': { fr: 'XP : chaque nouvelle figurine coûte', en: 'XP: each new model costs' },
  'recruterDansGroupe.plusSurtax': { fr: '(2 × XP du groupe)', en: '(2 × group XP)' },
  'recruterDansGroupe.equipEquallyNote': {
    fr: "et doit être équipée à l'identique du reste du groupe.",
    en: 'and must be equipped identically to the rest of the group.',
  },
  'recruterDansGroupe.forcedEquipmentPrefix': { fr: 'Équipement forcé :', en: 'Forced equipment:' },
  'recruterDansGroupe.totalForPrefix': { fr: 'po au total pour', en: 'gc total for' },
  'recruterDansGroupe.model': { fr: 'figurine', en: 'model' },
  'recruterDansGroupe.vetPointsIndicative': {
    fr: 'Coût indicatif en points vétéran : {points} (non contrôlé — libre à toi de recruter même sans les points suffisants).',
    en: "Indicative cost in veteran points: {points} (not enforced — you're free to recruit even without enough points).",
  },
  'recruterDansGroupe.trinketBlocked': {
    fr: "Recrutement bloqué : l'équipement du groupe contient un objet limité à un exemplaire par bande et serait automatiquement dupliqué.",
    en: "Recruitment blocked: the group's equipment includes an item limited to one copy per warband and would be automatically duplicated.",
  },
  'recruterDansGroupe.insufficientTreasury': {
    fr: 'Trésorerie insuffisante ({disponible} po disponibles, {requis} po requis).',
    en: 'Insufficient treasury ({disponible} gc available, {requis} gc required).',
  },
  'recruterDansGroupe.cancel': { fr: 'Annuler', en: 'Cancel' },
  'recruterDansGroupe.recruitForPrefix': { fr: 'Recruter pour', en: 'Recruit for' },

  // BlessureGraveModal
  'blessureGraveModal.titlePrefix': { fr: 'Blessure grave —', en: 'Serious injury —' },
  'blessureGraveModal.recorded': { fr: "Blessure enregistrée dans l'historique.", en: 'Injury recorded in the history.' },
  'blessureGraveModal.close': { fr: 'Fermer', en: 'Close' },

  // CustomItemForm
  'customItemForm.name': { fr: 'Nom', en: 'Name' },
  'customItemForm.namePlaceholder': { fr: "Nom de l'objet", en: 'Item name' },
  'customItemForm.category': { fr: 'Catégorie', en: 'Category' },
  'customItemForm.cost': { fr: 'Coût', en: 'Cost' },
  'customItemForm.fixedPrice': { fr: 'Prix fixe', en: 'Fixed price' },
  'customItemForm.diceNotation': { fr: 'Notation (dés)', en: 'Notation (dice)' },
  'customItemForm.costPlaceholderFixed': { fr: 'ex : 25', en: 'e.g. 25' },
  'customItemForm.costPlaceholderDice': { fr: 'ex : 2D6+10', en: 'e.g. 2D6+10' },
  'customItemForm.rarity': { fr: 'Rareté (optionnel)', en: 'Rarity (optional)' },
  'customItemForm.rarityPlaceholder': { fr: 'ex : 8', en: 'e.g. 8' },
  'customItemForm.availability': { fr: 'Disponibilité (optionnel)', en: 'Availability (optional)' },
  'customItemForm.availabilityPlaceholder': {
    fr: 'ex : Rare 8, jeteurs de sorts uniquement',
    en: 'e.g. Rare 8, spellcasters only',
  },
  'customItemForm.effectDescription': { fr: 'Effet / description (optionnel)', en: 'Effect / description (optional)' },
  'customItemForm.permanentStatsMod': {
    fr: 'Modification permanente des caractéristiques (optionnel)',
    en: 'Permanent characteristic modification (optional)',
  },
  'customItemForm.cancel': { fr: 'Annuler', en: 'Cancel' },
  'customItemForm.revertToCatalog': { fr: 'Revenir aux valeurs du catalogue', en: 'Revert to catalogue values' },
  'customItemForm.save': { fr: 'Enregistrer', en: 'Save' },

  // Étape équipement d'AjouterMembreModal (recrutement bande existante et
  // création de bande partagent la même fenêtre)
  'recrutementEquipement.title': { fr: '{nom} recruté(e)', en: '{nom} recruited' },
  'recrutementEquipement.finish': { fr: 'Terminer', en: 'Finish' },
  'recrutementEquipement.selectedEquipment': { fr: 'Récapitulatif', en: 'Summary' },
  'recrutementEquipement.startingTreasury': { fr: 'Trésorerie de départ', en: 'Starting treasury' },
  'recrutementEquipement.noSelectionYet': {
    fr: 'Aucun objet sélectionné pour l’instant — choisissez-en un ci-dessous.',
    en: 'No items selected yet — pick some below.',
  },
  'recrutementEquipement.removeItem': { fr: 'Retirer cet objet', en: 'Remove this item' },
  'recrutementEquipement.remaining': { fr: 'Restant :', en: 'Remaining:' },
  'recrutementEquipement.insufficientTreasury': {
    fr: 'Trésorerie insuffisante pour cette sélection : retirez un objet pour continuer.',
    en: 'Not enough treasury for this selection: remove an item to continue.',
  },
  'recrutementEquipement.mutationRequise': {
    fr: 'Ce profil doit recevoir au moins une mutation au recrutement : choisissez-en une avant de terminer.',
    en: 'This profile must receive at least one mutation at recruitment: pick one before finishing.',
  },
  'recrutementEquipement.cancelConfirmTitle': { fr: 'Annuler ce recrutement ?', en: 'Cancel this recruitment?' },
  'recrutementEquipement.cancelConfirmBody': {
    fr: 'Cette recrue et tout ce qui a déjà été acheté seront définitivement perdus — il n’y a pas de brouillon à reprendre plus tard.',
    en: 'This recruit and everything already purchased will be permanently lost — there is no draft to come back to later.',
  },
  'recrutementEquipement.cancelConfirmBack': { fr: 'Retour', en: 'Back' },
  'recrutementEquipement.cancelConfirmConfirm': { fr: 'Oui, tout annuler', en: 'Yes, cancel everything' },

  // DocteurModal
  'docteurModal.title': { fr: 'Quoi de neuf, Docteur ?', en: "What's Up, Doc?" },
  'docteurModal.appliedNote': { fr: 'Le résultat et ses effets ont été appliqués.', en: 'The result and its effects have been applied.' },
  'docteurModal.close': { fr: 'Fermer', en: 'Close' },
  'docteurModal.onlyHeroes': { fr: 'Seuls les Héros peuvent être envoyés chez le docteur.', en: 'Only Heroes can be sent to the doctor.' },
  'docteurModal.incurable': {
    fr: "Cette blessure fait partie des handicaps que le docteur ne peut pas traiter : ses effets sont permanents.",
    en: "This injury is one of the handicaps the doctor cannot treat: its effects are permanent.",
  },
  'docteurModal.alreadyTreated': {
    fr: 'Cette blessure a déjà été traitée et ne présente plus aucun effet soignable.',
    en: 'This injury has already been treated and no longer has any treatable effects.',
  },
  'docteurModal.notCovered': {
    fr: "Cette blessure ne figure pas parmi les traitements prévus par les règles du docteur.",
    en: "This injury is not among the treatments covered by the doctor's rules.",
  },
  'docteurModal.consultationCostPrefix': { fr: 'Une consultation coûte', en: 'A consultation costs' },
  'docteurModal.consultationCostSuffix': {
    fr: ", payées avant le jet. Elle remplace la recherche d'un objet rare de ce Héros et ne peut viser qu'une seule blessure pendant cette séquence d'après-bataille.",
    en: ", paid before the roll. It replaces this Hero's rare item search and can only target a single injury during this post-battle sequence.",
  },
  'docteurModal.rollInputNote': {
    fr: "L'application ne lance aucun dé : saisis le total de tes 2D6, puis elle appliquera le résultat.",
    en: 'The app does not roll any dice: enter the total of your 2D6, and it will apply the result.',
  },
  'docteurModal.injuryToTreat': { fr: 'Blessure à traiter', en: 'Injury to treat' },
  'docteurModal.treasuryAvailable': { fr: 'Trésorerie disponible :', en: 'Treasury available:' },
  'docteurModal.missingFundsPrefix': { fr: 'Il manque', en: 'Missing' },
  'docteurModal.missingFundsSuffix': { fr: 'po pour payer le docteur.', en: 'gc to pay the doctor.' },
  'docteurModal.cancel': { fr: 'Annuler', en: 'Cancel' },
  'docteurModal.payAndStartPrefix': { fr: 'Payer', en: 'Pay' },
  'docteurModal.payAndStartSuffix': { fr: 'et commencer', en: 'and start' },
  'docteurModal.paidNote': {
    fr: 'Consultation payée. Le résultat peut être saisi maintenant ou plus tard.',
    en: 'Consultation paid. The result can be entered now or later.',
  },
  'docteurModal.totalRollLabel': { fr: 'Résultat total des 2D6', en: '2D6 total result' },
  'docteurModal.chooseResult': { fr: 'Choisis le résultat obtenu…', en: 'Choose the result obtained…' },
  'docteurModal.closeEnterLater': { fr: 'Fermer et saisir plus tard', en: 'Close and enter later' },
  'docteurModal.applyResult': { fr: 'Appliquer le résultat', en: 'Apply the result' },

  // Résultats du traitement (voir utils/docteur.ts resultatDocteur) — un
  // couple titre/texte par issue possible, gardés distincts par (action,
  // table) puisque 'inefficace_repos' produit un texte différent selon la
  // table (membres/tête).
  'docteurModal.result.mort.titre': { fr: 'Appelez un prêtre…', en: 'Call a priest…' },
  'docteurModal.result.mort.membres.texte': {
    fr: "Le héros ne survit pas à l'hémorragie. Son équipement est conservé par la bande.",
    en: "The hero doesn't survive the bleeding. His equipment is kept by the warband.",
  },
  'docteurModal.result.mort.tete.texte': {
    fr: "Le héros ne survit pas à la trépanation. Son équipement est conservé par la bande.",
    en: "The hero doesn't survive the trepanation. His equipment is kept by the warband.",
  },
  'docteurModal.result.amputationMain.titre': { fr: 'Il faut couper…', en: 'It has to come off…' },
  'docteurModal.result.amputationMain.texte': {
    fr: "La main doit être amputée. Le héros ne pourra désormais utiliser qu'une seule arme à une main.",
    en: 'The hand must be amputated. The hero can now only use a single one-handed weapon.',
  },
  'docteurModal.result.amputationJambe.titre': { fr: 'Il faut couper…', en: 'It has to come off…' },
  'docteurModal.result.amputationJambe.texte': {
    fr: 'La jambe doit être amputée. Le Mouvement du héros est réduit de moitié, arrondi au supérieur.',
    en: "The leg must be amputated. The hero's Movement is halved, rounded up.",
  },
  'docteurModal.result.inefficaceRepos.membres.titre': { fr: 'Désolé…', en: 'Sorry…' },
  'docteurModal.result.inefficaceRepos.membres.texte': {
    fr: 'Le traitement est inefficace et le héros doit manquer la prochaine bataille.',
    en: 'The treatment fails and the hero must miss the next battle.',
  },
  'docteurModal.result.inefficace.titre': { fr: 'Pas de chance…', en: 'No luck…' },
  'docteurModal.result.inefficace.texte': { fr: 'Le traitement est inefficace.', en: 'The treatment fails.' },
  'docteurModal.result.stupidite.titre': { fr: "Y'a un problème…", en: "There's a problem…" },
  'docteurModal.result.stupidite.texte': {
    fr: "Le traitement empire l'état du héros, qui devient sujet à la Stupidité en plus de sa blessure. S'il l'était déjà, le traitement est simplement inefficace.",
    en: "The treatment worsens the hero's condition: he becomes Stupid in addition to his injury. If he already was, the treatment simply fails.",
  },
  'docteurModal.result.fouFurieux.titre': { fr: 'Oups…', en: 'Oops…' },
  'docteurModal.result.fouFurieux.texte': {
    fr: 'Le héros perd 1 en Initiative, jusqu’à un minimum de 1, et provoque désormais la Peur.',
    en: 'The hero loses 1 Initiative, to a minimum of 1, and now causes Fear.',
  },
  'docteurModal.result.inefficaceRepos.tete.titre': { fr: 'Pas de chance…', en: 'No luck…' },
  'docteurModal.result.inefficaceRepos.tete.texte': {
    fr: 'Le traitement est inefficace et le héros doit manquer la prochaine bataille.',
    en: 'The treatment fails and the hero must miss the next battle.',
  },
  'docteurModal.result.guerisonRepos.titre': { fr: 'Avec un peu de repos, ça devrait aller…', en: 'With a little rest, he should be fine…' },
  'docteurModal.result.guerisonRepos.texte': {
    fr: 'La blessure et ses effets sont annulés. Le héros doit manquer la prochaine bataille.',
    en: 'The injury and its effects are cancelled. The hero must miss the next battle.',
  },
  'docteurModal.result.guerison.titre': { fr: 'Shallya soit louée !', en: 'Praise Shallya!' },
  'docteurModal.result.guerison.texte': {
    fr: 'La blessure et ses effets sont annulés.',
    en: 'The injury and its effects are cancelled.',
  },
};

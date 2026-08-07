import type { UiDictionary } from './types';

export const personnageCards: UiDictionary = {
  // StatutCard
  'statutCard.hiredSword': { fr: 'Franc-tireur', en: 'Hired Sword' },
  'statutCard.hero': { fr: 'Héros', en: 'Hero' },
  'statutCard.animal': { fr: 'Animal', en: 'Animal' },
  'statutCard.henchman': { fr: 'Homme de main', en: 'Henchman' },
  'statutCard.promoted': { fr: ' (promu)', en: ' (promoted)' },
  'statutCard.injured': { fr: 'Blessé :', en: 'Injured:' },
  'statutCard.turns': { fr: 'tour(s)', en: 'turn(s)' },
  'statutCard.rating': { fr: 'Rating', en: 'Rating' },
  'statutCard.powerValue': { fr: 'Power Value', en: 'Power Value' },
  'statutCard.group': { fr: 'Groupe :', en: 'Group:' },
  'statutCard.identicalModels': { fr: 'identique', en: 'identical' },
  'statutCard.model': { fr: 'figurine', en: 'model' },
  'statutCard.recruitInGroup': { fr: '+ Recruter un nouveau membre dans ce groupe', en: '+ Recruit a new member into this group' },
  'statutCard.outOfAction': { fr: 'Hors de combat :', en: 'Out of action:' },
  'statutCard.toResolveNextPostBattle': { fr: 'à résoudre au prochain post-bataille', en: 'to resolve at the next post-battle' },
  'statutCard.injuredModalTitle': { fr: 'Blessé — combien de tours ?', en: 'Injured — how many turns?' },
  'statutCard.injuredModalBody': {
    fr: "Nombre de post-batailles avant rétablissement. Le guerrier ne gagnera pas d'expérience tant qu'il est blessé (il n'a pas participé à la bataille), mais le compteur avancera automatiquement à la fin de chaque assistant post-bataille.",
    en: "Number of post-battles before recovery. The warrior won't gain experience while injured (they didn't take part in the battle), but the counter will advance automatically at the end of each post-battle wizard.",
  },
  'statutCard.turnsInjuredLabel': { fr: 'Tours blessé', en: 'Turns injured' },
  'statutCard.cancel': { fr: 'Annuler', en: 'Cancel' },
  'statutCard.confirm': { fr: 'Confirmer', en: 'Confirm' },
  'statutCard.cycleStatusTitle': { fr: 'Cliquer pour passer au statut suivant', en: 'Click to cycle to the next status' },

  // CaracteristiquesCard
  'caracteristiques.title': { fr: 'Caractéristiques', en: 'Characteristics' },
  'caracteristiques.variableTitle': { fr: 'Caractéristique variable — se fixe via une avancée d\'expérience', en: 'Variable characteristic — set via an experience advance' },
  'caracteristiques.capTitle': { fr: 'Caractéristique au plafond racial', en: 'Characteristic at racial cap' },
  'caracteristiques.capLabel': { fr: 'Plafond de caractéristiques', en: 'Characteristic cap' },
  'caracteristiques.henchmanCapNote': {
    fr: 'Un homme de main ne peut jamais augmenter une même caractéristique de plus de +1.',
    en: 'A henchman can never increase the same characteristic by more than +1.',
  },

  // XpGrid
  'xpGrid.boxLabel': { fr: 'Case XP', en: 'XP box' },
  'xpGrid.startingXpTitle': { fr: "XP de départ — ne comptait pas pour une avancée", en: "Starting XP — did not count toward an advance" },

  // ExperienceCard
  'experience.title': { fr: 'Expérience', en: 'Experience' },
  'experience.neverGainsXp': { fr: "Ce profil ne gagne jamais d'expérience.", en: 'This profile never gains experience.' },
  'experience.pendingAdvances': { fr: 'avancée(s) en attente', en: 'advance(s) pending' },
  'experience.resolveAdvance': { fr: 'Résoudre une avancée', en: 'Resolve an advance' },
  'experience.history': { fr: 'Historique des avancées :', en: 'Advance history:' },
  'experience.rollPrefix': { fr: 'jet', en: 'roll' },
  'experience.editAdvanceTitle': { fr: 'Modifier cette avancée', en: 'Edit this advance' },

  // ResumeCard
  'resume.title': { fr: 'Résumé', en: 'Summary' },
  'resume.skills': { fr: 'Compétences', en: 'Skills' },
  'resume.none': { fr: 'Aucune', en: 'None' },
  'resume.equipment': { fr: 'Équipement', en: 'Equipment' },
  'resume.noneMasc': { fr: 'Aucun', en: 'None' },
  'resume.magicKnownSpell': { fr: 'Magie — Sort connu', en: 'Magic — Known spell' },
  'resume.specialRules': { fr: 'Règles spéciales', en: 'Special rules' },
  'resume.seriousInjuries': { fr: 'Blessures graves', en: 'Serious injuries' },

  // EquipementCard
  'equipementCard.title': { fr: 'Équipement', en: 'Equipment' },
  'equipementCard.buy': { fr: '+ Acheter', en: '+ Buy' },
  'equipementCard.noEquipment': { fr: 'Aucun équipement', en: 'No equipment' },
  'equipementCard.contractEquipmentNote': {
    fr: "Équipement fourni avec le contrat : il ne peut être ni complété, ni revendu, ni transféré.",
    en: 'Equipment provided with the contract: it cannot be added to, sold, or transferred.',
  },
  'equipementCard.mismatchWarning': {
    fr: "Équipement dépareillé : ce groupe de {taille} figurines ne possède pas les mêmes objets en nombre égal pour chacune (probablement un objet donné depuis l'armurerie à une seule figurine). Complète les exemplaires manquants ou renvoie les objets en trop au stock.",
    en: 'Mismatched equipment: this group of {taille} models does not have the same items in equal numbers for each (probably an item given from the armoury to a single model). Complete the missing copies or send the excess items back to stock.',
  },
  'equipementCard.noItemsBought': { fr: 'Aucun objet acheté.', en: 'No items bought.' },
  'equipementCard.perModelSuffix': { fr: '/figurine', en: '/model' },
  'equipementCard.totalSuffix': { fr: 'po au total', en: 'gc total' },
  'equipementCard.rollNotationPrefix': { fr: 'jet :', en: 'roll:' },
  'equipementCard.returnToStockOneTitle': { fr: 'Renvoyer au stock de la bande', en: "Send back to the warband's stock" },
  'equipementCard.returnToStockManyTitle': { fr: 'Renvoyer les {n} exemplaires au stock de la bande', en: "Send the {n} copies back to the warband's stock" },
  'equipementCard.sell': { fr: 'Vendre', en: 'Sell' },
  'equipementCard.sellTitle': { fr: 'Vendre (+{prix} po à la trésorerie)', en: 'Sell (+{prix} gc to treasury)' },
  'equipementCard.removeOneTitle': { fr: 'Supprimer sans contrepartie (perdu, détruit…)', en: 'Remove with no return (lost, destroyed…)' },
  'equipementCard.removeManyTitle': { fr: 'Supprimer les {n} exemplaires sans contrepartie (perdu, détruit…)', en: 'Remove the {n} copies with no return (lost, destroyed…)' },

  // ReglesSpecialesCard
  'reglesSpecialesCard.title': { fr: 'Règles spéciales', en: 'Special rules' },
  'reglesSpecialesCard.none': { fr: 'Aucune', en: 'None' },
  'reglesSpecialesCard.placeholder': {
    fr: 'Ex : Nuages de mouches : -1 pour être touché au corps à corps',
    en: 'E.g.: Cloud of Flies: -1 to be hit in close combat',
  },
  'reglesSpecialesCard.add': { fr: 'Ajouter', en: 'Add' },

  // BlessuresGravesCard
  'blessuresGravesCard.title': { fr: 'Blessures graves', en: 'Serious injuries' },
  'blessuresGravesCard.record': { fr: '+ Enregistrer un résultat', en: '+ Record a result' },
  'blessuresGravesCard.none': { fr: 'Aucune.', en: 'None.' },
  'blessuresGravesCard.treated': { fr: 'Traitée', en: 'Treated' },
  'blessuresGravesCard.removeTitle': { fr: "Supprimer cette entrée de l'historique", en: 'Delete this history entry' },

  // CompetencesPanel
  'competencesPanel.unconfirmedAccessWarning': {
    fr: '⚠ Accès aux tables de compétences non confirmé dans les données source — toutes les tables sont affichées par précaution.',
    en: '⚠ Skill table access not confirmed in the source data — all tables are shown as a precaution.',
  },
  'competencesPanel.noSpecialSkills': {
    fr: "Aucune compétence spéciale renseignée pour cette bande pour l'instant.",
    en: 'No special skills documented for this warband yet.',
  },

  // MagieConnueCard
  'magieConnue.title': { fr: 'Magie — Sort connu', en: 'Magic — Known spell' },
  'magieConnue.diffAbbrev': { fr: 'diff.', en: 'diff.' },
  'magieConnue.none': { fr: 'Aucun', en: 'None' },
  'magieConnue.addSpellPlaceholder': { fr: '— Ajouter un sort —', en: '— Add a spell —' },
  'magieConnue.add': { fr: 'Ajouter', en: 'Add' },
  'magieConnue.removeSpellTitle': { fr: 'Retirer ce sort', en: 'Remove this spell' },
  'magieConnue.cancel': { fr: 'Annuler', en: 'Cancel' },
  'magieConnue.useGrimoire': { fr: 'Utiliser un Grimoire de magie', en: 'Use a Grimoire of Magic' },
  'magieConnue.grimoireBody': {
    fr: 'Le grimoire sera consommé. Choisis un sort permanent dans la liste propre du sorcier ou dans celle de Magie mineure.',
    en: "The grimoire will be consumed. Choose a permanent spell from the caster's own list or from the Petty Magic list.",
  },
  'magieConnue.spellListLabel': { fr: 'Liste de sorts', en: 'Spell list' },
  'magieConnue.ownListFallback': { fr: 'Liste propre du sorcier', en: "Caster's own list" },
  'magieConnue.pettyMagic': { fr: 'Magie mineure', en: 'Petty Magic' },
  'magieConnue.newSpellLabel': { fr: 'Nouveau sort', en: 'New spell' },
  'magieConnue.choose': { fr: '— Choisir —', en: '— Choose —' },
  'magieConnue.allKnown': { fr: 'Tous les sorts de cette liste sont déjà connus.', en: 'All spells in this list are already known.' },
  'magieConnue.consumeGrimoire': { fr: 'Consommer le grimoire et apprendre ce sort', en: 'Consume the grimoire and learn this spell' },
};

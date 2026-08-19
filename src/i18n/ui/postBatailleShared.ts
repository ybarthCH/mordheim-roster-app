import type { UiDictionary } from './types';

export const postBatailleShared: UiDictionary = {
  'postBataille.addToTreasury': { fr: 'Ajouter à la trésorerie', en: 'Add to treasury' },
  'postBataille.appliedSeeJournal': {
    fr: "✓ Appliqué — voir le journal d'exploration ci-dessous.",
    en: '✓ Applied — see the exploration journal below.',
  },
  'postBataille.itemAddedToStock': { fr: '✓ {nom} ajouté(e) au stock.', en: '✓ {nom} added to stock.' },
  'postBataille.addItemToStock': { fr: '+ Ajouter {nom}{suffix} au stock', en: '+ Add {nom}{suffix} to stock' },
  'postBataille.rollForItem': { fr: 'Jet ({notation}) pour {nom} :', en: 'Roll ({notation}) for {nom}:' },
  'postBataille.addToStock': { fr: 'Ajouter au stock', en: 'Add to stock' },
  'postBataille.rollSucceeded': { fr: 'Jet réussi', en: 'Roll succeeded' },
  'postBataille.add': { fr: 'Ajouter', en: 'Add' },
  'postBataille.addAsWyrdstone': { fr: 'Ajouter en wyrdstone', en: 'Add as wyrdstone' },
  'postBataille.openMagicArtefactsTable': {
    fr: 'Ouvrir le Tableau des artefacts magiques',
    en: 'Open the Magical Artefacts table',
  },
  'postBataille.success': { fr: 'Réussi', en: 'Succeeded' },
  'postBataille.failure': { fr: 'Raté', en: 'Failed' },
  'postBataille.chooseEllipsis': { fr: '— Choisir —', en: '— Choose —' },
  'postBataille.rollNotation': { fr: 'Jet ({notation}) :', en: 'Roll ({notation}):' },
  'postBataille.rollObtainedNotation': { fr: 'Jet obtenu ({notation}) :', en: 'Roll obtained ({notation}):' },

  // Débiteur reconnaissant
  'postBataille.debtor.hiredForFree': { fr: '✓ Débiteur reconnaissant : {nom} rejoint la bande gratuitement.', en: '✓ Grateful Debtor: {nom} joins the warband for free.' },
  'postBataille.debtor.joinedFree': {
    fr: '{nom} rejoint la bande sans frais de recrutement.',
    en: '{nom} joins the warband without paying a recruitment fee.',
  },
  'postBataille.debtor.freeRecruitLabel': { fr: 'Franc-tireur engagé gratuitement', en: 'Hired sword recruited for free' },
  'postBataille.debtor.noneAvailable': {
    fr: "Aucun Franc-tireur disponible pour cette bande pour l'instant.",
    en: 'No hired sword available for this warband right now.',
  },
  'postBataille.debtor.hireForFree': { fr: 'Engager gratuitement', en: 'Hire for free' },

  // Puits
  'postBataille.well.result': { fr: '✓ Puits : {texte}', en: '✓ The Well: {texte}' },
  'postBataille.well.foundFragment': { fr: '{nom} trouve un fragment de pierre magique.', en: '{nom} finds a fragment of warpstone.' },
  'postBataille.well.tainted': {
    fr: "{nom} avale de l'eau impure — Blessé, rate la prochaine bataille.",
    en: '{nom} drinks tainted water — Injured, misses the next battle.',
  },
  'postBataille.well.heroLabel': { fr: 'Héros envoyé au puits', en: 'Hero sent to the well' },
  'postBataille.well.enduranceTest': {
    fr: "Test d'Endurance (1D6, réussi si ≤ E{e}) :",
    en: 'Toughness test (1D6, succeeds if ≤ T{e}):',
  },

  // La Fosse
  'postBataille.pit.result': { fr: '✓ La Fosse : {texte}', en: '✓ The Pit: {texte}' },
  'postBataille.pit.returnedWithFragments': {
    fr: '{nom} revient avec {n} fragment{s}.',
    en: '{nom} returns with {n} fragment{s}.',
  },
  'postBataille.pit.devoured': {
    fr: 'est dévoré par les gardiens de la Fosse — mort.',
    en: 'is devoured by the guardians of the Pit — dead.',
  },
  'postBataille.pit.heroLabel': { fr: 'Héros envoyé dans la Fosse', en: 'Hero sent into the Pit' },
  'postBataille.pit.rollInstruction': {
    fr: 'Jet de 1D6 : sur un 1, {nom} est dévoré et ne revient pas. Sur 2+, il revient avec D6+1 fragments de pierre magique.',
    en: 'Roll 1D6: on a 1, {nom} is devoured and does not return. On 2+, he returns with D6+1 fragments of warpstone.',
  },
  'postBataille.pit.fragmentsObtained': { fr: 'Fragments obtenus (D6+1) :', en: 'Fragments obtained (D6+1):' },

  // Taverne
  'postBataille.tavern.result': { fr: '✓ Taverne : {texte}', en: '✓ The Tavern: {texte}' },
  'postBataille.tavern.barrelsSold': { fr: 'Tonneaux vendus — +{n} po.', en: 'Barrels sold — +{n} gc.' },
  'postBataille.tavern.barrelsEmptied': { fr: 'Tonneaux vidés — +{n} po.', en: 'Barrels emptied — +{n} gc.' },
  'postBataille.tavern.autoSuccess': {
    fr: "Réussite automatique — un vulgaire breuvage alcoolisé n'intéresse pas cette bande.",
    en: 'Automatic success — a vulgar alcoholic brew holds no interest for this warband.',
  },
  'postBataille.tavern.rollObtained4d6': { fr: 'Jet obtenu (4D6) :', en: 'Roll obtained (4D6):' },
  'postBataille.tavern.rollObtainedD6': { fr: 'Jet obtenu (D6) :', en: 'Roll obtained (D6):' },
  'postBataille.tavern.leaderCommandTest': {
    fr: 'Test de Commandement du chef{chef} :',
    en: "Leader's Leadership test{chef}:",
  },

  // Vagabond
  'postBataille.vagrant.result': { fr: '✓ Vagabond : {texte}', en: '✓ Vagrant: {texte}' },
  'postBataille.vagrant.sacrificed': { fr: 'Sacrifié — {nom} gagne +1 XP.', en: 'Sacrificed — {nom} gains +1 XP.' },
  'postBataille.vagrant.turnedZombie': {
    fr: 'Tué et transformé — un zombie rejoint la bande.',
    en: 'Killed and turned — a zombie joins the warband.',
  },
  'postBataille.vagrant.questioned': {
    fr: "Interrogé — +1 dé au prochain jet d'exploration.",
    en: 'Questioned — +1 die on the next exploration roll.',
  },
  'postBataille.vagrant.soldTo': { fr: 'Vendu aux agents du clan Eshin — +{n} po.', en: 'Sold to Clan Eshin agents — +{n} gc.' },
  'postBataille.vagrant.sellFor2d6': { fr: 'Vendre pour 2D6 CO', en: 'Sell for 2D6 gc' },
  'postBataille.vagrant.sacrificeForXp': { fr: 'Sacrifier — chef +1 XP', en: 'Sacrifice — leader +1 XP' },
  'postBataille.vagrant.killForZombie': { fr: 'Tuer — zombie gratuit', en: 'Kill — free zombie' },
  'postBataille.vagrant.questionForDie': {
    fr: 'Interroger — dé bonus prochaine exploration',
    en: 'Question — bonus die on next exploration',
  },
  'postBataille.vagrant.sellAddTreasury': { fr: 'Vendre — ajouter à la trésorerie', en: 'Sell — add to treasury' },
  'postBataille.vagrant.rollObtained2d6': { fr: 'Jet obtenu (2D6) :', en: 'Roll obtained (2D6):' },
  'postBataille.vagrant.reservedFor': { fr: 'Réservé aux {faction}', en: 'Reserved for {faction}' },
  'postBataille.vagrant.betterOptionAbove': {
    fr: 'Cette bande a une meilleure option ci-dessus',
    en: 'This warband has a better option above',
  },

  // Prisonniers
  'postBataille.prisoners.result': { fr: '✓ Prisonniers : {texte}', en: '✓ Prisoners: {texte}' },
  'postBataille.prisoners.sacrificed': { fr: 'Sacrifiés — {nom} gagne +{n} XP.', en: 'Sacrificed — {nom} gains +{n} XP.' },
  'postBataille.prisoners.turnedZombies': {
    fr: 'Tués et transformés — {n} zombie(s) rejoignent la bande.',
    en: 'Killed and turned — {n} zombie(s) join the warband.',
  },
  'postBataille.prisoners.soldAsSlaves': { fr: 'Vendus comme esclaves — +{n} po.', en: 'Sold as slaves — +{n} gc.' },
  'postBataille.prisoners.escorted': {
    fr: "Escortés hors de la cité — +{n} po. Un captif peut rejoindre un groupe d'hommes de main humain existant si tu as le matériel pour l'équiper (à faire manuellement).",
    en: 'Escorted out of the city — +{n} gc. A captive may join an existing human henchman group if you have the gear to equip them (to be done manually).',
  },
  'postBataille.prisoners.sacrificeForXp': { fr: 'Sacrifier — D3 XP', en: 'Sacrifice — D3 XP' },
  'postBataille.prisoners.killForZombies': { fr: 'Tuer — D3 zombies gratuits', en: 'Kill — D3 free zombies' },
  'postBataille.prisoners.sellFor3d6': { fr: 'Vendre pour 3D6 CO', en: 'Sell for 3D6 gc' },
  'postBataille.prisoners.escort': { fr: 'Escorter — 2D6 CO + recrue', en: 'Escort — 2D6 gc + recruit' },
  'postBataille.prisoners.heroXpLabel': { fr: "Héros bénéficiaire de l'XP", en: 'Hero receiving the XP' },
  'postBataille.prisoners.rollObtainedD3': { fr: 'Jet obtenu (D3) :', en: 'Roll obtained (D3):' },
  'postBataille.prisoners.addXp': { fr: "Ajouter l'XP", en: 'Add the XP' },
  'postBataille.prisoners.addZombies': { fr: 'Ajouter les zombies', en: 'Add the zombies' },
  'postBataille.prisoners.rollObtained3d6': { fr: 'Jet obtenu (3D6) :', en: 'Roll obtained (3D6):' },

  // Œil des Dieux Sombres
  'postBataille.eyeOfDarkGods.markLabel': { fr: 'Marque des Dieux Sombres', en: 'Mark of the Dark Gods' },
  'postBataille.eyeOfDarkGods.assignMark': { fr: 'Attribuer la Marque', en: 'Assign the Mark' },
  'postBataille.eyeOfDarkGods.defeatDescription': {
    fr: '2D6 + 1 par Héros hors de combat ({n} ici) ≥ {seuil}+ → {chef} devient un Enfant du Chaos.',
    en: '2D6 + 1 per Hero taken Out of Action ({n} here) ≥ {seuil}+ → {chef} becomes a Chaos Spawn.',
  },
  'postBataille.eyeOfDarkGods.victoryDescription': {
    fr: '2D6 + 1 par ennemi mis hors de combat par {chef} ≥ {seuil}+ → il reçoit une Marque des Dieux Sombres au choix.',
    en: '2D6 + 1 per enemy taken Out of Action by {chef} ≥ {seuil}+ → he receives a Mark of the Dark Gods of his choice.',
  },
  'postBataille.eyeOfDarkGods.defeatPrefix': { fr: 'Défaite : ', en: 'Defeat: ' },
  'postBataille.eyeOfDarkGods.victoryPrefix': { fr: 'Victoire : ', en: 'Victory: ' },
  'postBataille.eyeOfDarkGods.alreadyResolved': {
    fr: 'Test déjà résolu pour cette séquence post-bataille.',
    en: 'Already resolved for this post-battle sequence.',
  },

  // Blessures graves (étape)
  'postBataille.injuries.title': { fr: 'Blessures graves', en: 'Serious injuries' },
  'postBataille.injuries.intro': {
    fr: "Pour chaque héros Hors de Combat, lance sur ta table papier puis résous le résultat obtenu : les effets (caractéristiques, équipement, notes) sont appliqués automatiquement, et le choix Oui/Non « A survécu » de l'étape suivante est pré-rempli en fonction du résultat.",
    en: 'For each Hero Out of Action, roll on your tabletop then resolve the result obtained: the effects (characteristics, equipment, notes) are applied automatically, and the "Survived" Yes/No choice on the next step is pre-filled based on the result.',
  },
  'postBataille.injuries.noneOutOfAction': { fr: 'Aucun héros Hors de Combat.', en: 'No hero Out of Action.' },
  'postBataille.injuries.resolveInjury': { fr: 'Résoudre la blessure grave', en: 'Resolve the serious injury' },
  'postBataille.injuries.markedDead': { fr: '⚠ Marqué Mort.', en: '⚠ Marked Dead.' },
  'postBataille.injuries.equipmentLost': { fr: '⚠ Équipement perdu.', en: '⚠ Equipment lost.' },
  'postBataille.injuries.modify': { fr: 'Modifier', en: 'Modify' },
  'postBataille.injuries.modalTitle': { fr: 'Blessure grave — {nom}', en: 'Serious injury — {nom}' },
  'postBataille.injuries.henchmenTitle': { fr: 'Homme de main', en: 'Henchman' },
  'postBataille.injuries.henchmenIntro': {
    fr: 'Pour un homme de main ou un franc-tireur seul Hors de combat, lance 1D6 sur table papier — 1–2, il meurt ; 3–6, il se rétablit complètement — et indique le résultat. Pour un groupe, résous chaque figurine Hors de combat individuellement de la même façon.',
    en: 'For a lone henchman or Hired Sword Out of Action, roll 1D6 on your tabletop — 1–2, they die; 3–6, they recover fully — and enter the result. For a group, resolve each model Out of Action individually the same way.',
  },
};

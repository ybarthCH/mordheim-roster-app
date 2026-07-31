import type { UiDictionary } from './types';

export const etapeCommerce: UiDictionary = {
  'commerce.title': {
    fr: 'Commerce : objets rares{dp}{docteur}',
    en: 'Trade: rare items{dp}{docteur}',
  },
  'commerce.dpSuffix': { fr: ', Dramatis Personae', en: ', Dramatis Personae' },
  'commerce.doctorSuffix': { fr: ' ou docteur', en: ' or doctor' },
  'commerce.treasuryAvailable': { fr: 'Trésorerie disponible : {n} po.', en: 'Treasury available: {n} gc.' },
  'commerce.intro': {
    fr: "Chaque Héros dispose d'une seule action de commerce. S'il n'a pas été mis Hors de combat, il peut effectuer un jet de rareté pour tenter d'acheter un seul objet rare{dp}.{docteur}",
    en: "Each Hero has a single trade action. If he hasn't been taken Out of Action, he can make a rarity roll to try to buy a single rare item{dp}.{docteur}",
  },
  'commerce.introDpSuffix': { fr: ', ou tenter à la place de retrouver un Dramatis Personae', en: ', or instead try to track down a Dramatis Personae' },
  'commerce.introDoctorSuffix': {
    fr: " À la place, il peut aussi consulter le docteur pour {cout} po. Un Héros mis Hors de combat ne peut pas chercher un objet rare{dp}, mais peut aller chez le docteur en urgence.",
    en: " Instead, he can also see the doctor for {cout} gc. A Hero taken Out of Action cannot search for a rare item{dp}, but can see the doctor in an emergency.",
  },
  'commerce.introDoctorDpSuffix': { fr: ' ni un Dramatis Personae', en: ' or a Dramatis Personae' },
  'commerce.noAutoRolls': {
    fr: "L'app ne lance aucun dé : tous les résultats de 2D6 sont saisis manuellement.",
    en: 'The app does not roll any dice: all 2D6 results are entered manually.',
  },
  'commerce.noHeroAvailable': { fr: 'Aucun Héros disponible pour le commerce.', en: 'No Hero available for trading.' },
  'commerce.outOfAction': { fr: 'Hors de combat', en: 'Out of Action' },
  'commerce.modify': { fr: 'Modifier', en: 'Modify' },
  'commerce.skip': { fr: 'Passer', en: 'Skip' },
  'commerce.searchRareItem': { fr: 'Rechercher un objet rare', en: 'Search for a rare item' },
  'commerce.searchDramatisPersonae': { fr: 'Rechercher un Dramatis Personae', en: 'Search for a Dramatis Personae' },
  'commerce.seeDoctor': { fr: 'Consulter le docteur ({cout} po)', en: 'See the doctor ({cout} gc)' },
  'commerce.noAction': { fr: 'Aucune action de commerce.', en: 'No trade action.' },
  'commerce.rareSearchLine': {
    fr: 'Recherche de {nom} (Rare {rarete}) : {issue}',
    en: 'Search for {nom} (Rare {rarete}): {issue}',
  },
  'commerce.rareSucceededBought': { fr: 'réussie, acheté pour {cout} po et placé dans le stock.', en: 'succeeded, bought for {cout} gc and placed in stock.' },
  'commerce.rareSucceededNotBought': { fr: 'réussie, mais non acheté.', en: 'succeeded, but not bought.' },
  'commerce.searchFailed': { fr: 'ratée.', en: 'failed.' },
  'commerce.dpSearchLine': { fr: 'Recherche de {nom} : {issue}', en: 'Search for {nom}: {issue}' },
  'commerce.dpSucceededRecruited': { fr: 'réussie, recruté pour {cout} po.', en: 'succeeded, recruited for {cout} gc.' },
  'commerce.dpSucceededNotRecruited': { fr: 'réussie, mais non recruté.', en: 'succeeded, but not recruited.' },
  'commerce.consultationPaid': { fr: 'Consultation payée : le résultat 2D6 reste à saisir.', en: 'Consultation paid: the 2D6 result still needs to be entered.' },
  'commerce.resumeConsultation': { fr: 'Reprendre la consultation', en: 'Resume the consultation' },
  'commerce.doctorRoll': { fr: 'Docteur : 2D6 = {jet} — {titre}', en: 'Doctor: 2D6 = {jet} — {titre}' },
  'commerce.rareSearchForbidden': {
    fr: "La recherche rare est interdite, mais la consultation d'urgence reste autorisée.",
    en: 'Rare item searches are forbidden, but the emergency consultation is still allowed.',
  },
  'commerce.noTreatableInjury': { fr: 'Aucune blessure traitable par le docteur.', en: 'No injury treatable by the doctor.' },
  'commerce.chooseInjuryTitle': { fr: 'Choisir la blessure à traiter — {nom}', en: 'Choose the injury to treat — {nom}' },
  'commerce.chooseInjuryNote': {
    fr: 'Une seule blessure peut être traitée pendant cette consultation.',
    en: 'Only one injury can be treated during this consultation.',
  },
  'commerce.notTreatableByDoctor': { fr: 'Non traitable par le docteur.', en: 'Not treatable by the doctor.' },
  'commerce.cancel': { fr: 'Annuler', en: 'Cancel' },
};

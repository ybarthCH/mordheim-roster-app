import { skillById } from '../data/gameData';
import type { WarbandCatalog } from '../types/catalog';
import type { BattleRecord, Member, RosterInstance } from '../types/roster';
import { resolveItemDetail } from './shop';
import { resolveProfil } from './profil';
import type { GameRules } from '../types/rules';
import { estFrancTireur } from '../data/hiredSwords';
import {
  CLE_DE_SUPPLEMENTAIRE_EXPLORATION,
  CLE_RELANCE_EXPLORATION_PERMANENTE,
  effetsPersistantsAvecCle,
} from './effetsPersistants';
import type { Language } from '../state/useLanguage';
import { uiDictionary } from '../i18n/ui';
import { translateItem } from '../i18n/data/items';
import { translateSkill } from '../i18n/data/skills';

// Reprise minimale du principe de useLanguage().t(), pour un usage hors
// composant React : `catalogue` est déjà traduit par l'appelant (voir
// PostBatailleScreen), mais les quelques libellés propres à cette fonction
// (préfixes de source, note de dés supplémentaires) ne le sont pas.
function tr(key: string, language: Language, params?: Record<string, string | number>): string {
  const entry = uiDictionary[key];
  const raw = entry ? (entry[language] ?? entry.fr) : key;
  if (!params) return raw;
  return raw.replace(/\{(\w+)\}/g, (match, token) => (token in params ? String(params[token]) : match));
}

export type AideExploration = {
  source: string;
  texte: string;
  desSupplementaires: number;
};

export type ResumeExploration = {
  herosEligibles: Member[];
  desHeros: number;
  bonusVictoire: number;
  bonusFixes: number;
  totalDesALancer: number;
  maximumAConserver: number;
  aides: AideExploration[];
  // Voir WarbandCatalog.des_exploration_manuels : quand vrai, totalDesALancer
  // ci-dessus reste calculé (au cas où un futur appelant en aurait besoin)
  // mais ne doit PAS être affiché comme une suggestion fiable — les règles
  // de la bande conditionnent les dés individuellement par Héros plutôt que
  // d'ajouter un bonus global, ce que ce calcul générique ne modélise pas.
  suggestionManuelle: boolean;
};

const NORMALISER = (texte: string) =>
  texte
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('fr');

function concerneExploration(texte: string): boolean {
  return NORMALISER(texte).includes('exploration');
}

function bonusDeuxDes(texte: string): boolean {
  const normalise = NORMALISER(texte);
  return normalise.includes('lancer deux des lors de la phase d’exploration') ||
    normalise.includes("lancer deux des lors de la phase d'exploration");
}

function ajouterAide(
  aides: AideExploration[],
  source: string,
  texteAffiche: string,
  // Texte français d'origine, utilisé uniquement pour détecter si la règle
  // concerne l'exploration — le mot est identique dans les deux langues,
  // mais on reste sur le texte canonique pour ne pas dépendre de la
  // formulation traduite.
  texteDetection: string,
  desSupplementaires = 0
) {
  if (!concerneExploration(texteDetection)) return;
  const cle = `${source}\n${texteAffiche}`;
  if (aides.some((aide) => `${aide.source}\n${aide.texte}` === cle)) return;
  aides.push({ source, texte: texteAffiche, desSupplementaires });
}

/**
 * Calcule uniquement ce que l'app peut déduire sans lancer de dés :
 * un dé par Héros ayant participé sans être mis Hors de combat, le bonus de
 * victoire et les rares règles fixes qui remplacent le dé d'un Héros par
 * deux dés. Les relances et modifications restent des rappels au joueur.
 */
export function resumeExploration(
  roster: RosterInstance,
  catalogue: WarbandCatalog | undefined,
  resultat: BattleRecord['resultat'],
  rules: GameRules,
  // Identifiants des effets persistants déjà présents à l'ouverture de
  // l'assistant post-bataille (voir PostBatailleScreen) : un bonus de dé
  // d'exploration tout juste créé pendant cette même session (ex : Vagabond
  // "Interroger") ne doit compter que pour la PROCHAINE phase d'exploration,
  // pas celle en cours. Omis (undefined), tous les effets présents comptent.
  effetsInitiauxIds?: Set<string>,
  language: Language = 'fr'
): ResumeExploration {
  const herosEligibles = roster.membres.filter((membre) => {
    if (
      membre.statut === 'mort' ||
      membre.statut === 'blesse' ||
      membre.statut === 'hors_de_combat' ||
      membre.franc_tireur_impaye ||
      estFrancTireur(membre)
    ) {
      return false;
    }
    return resolveProfil(roster, membre)?.type === 'heros';
  });

  const aides: AideExploration[] = [];
  let bonusFixes = 0;
  const idsHerosEligibles = new Set(herosEligibles.map((membre) => membre.instance_id));
  const membresPouvantAider = roster.membres.filter(
    (membre) =>
      membre.statut !== 'mort' &&
      membre.statut !== 'blesse' &&
      membre.statut !== 'hors_de_combat' &&
      !membre.franc_tireur_impaye
  );

  for (const membre of membresPouvantAider) {
    // `profil` reste toujours la donnée française d'origine (voir
    // resolveProfil) : sert à détecter de façon fiable les règles fixes
    // (bonusDeuxDes) quelle que soit la langue d'affichage. `profilAffiche`
    // est la même donnée passée dans `catalogue`, potentiellement déjà
    // traduite par l'appelant — utilisé uniquement pour l'affichage, avec
    // repli sur `profil` si la bande n'a pas encore de traduction.
    const profil = resolveProfil(roster, membre);
    const profilAffiche = resolveProfil(roster, membre, catalogue);
    profil?.regles_speciales?.forEach((regle, i) => {
      const bonus = idsHerosEligibles.has(membre.instance_id) && bonusDeuxDes(regle.texte) ? 1 : 0;
      bonusFixes += bonus;
      const regleAffichee = profilAffiche?.regles_speciales?.[i] ?? regle;
      ajouterAide(aides, `${membre.nom_perso} — ${regleAffichee.nom}`, regleAffichee.texte, regle.texte, bonus);
    });

    for (const competenceId of membre.competences_acquises) {
      // Compétence générique (catalogue de compétences commun) : traduite
      // via translateSkill. Compétence spéciale propre à la bande : déjà
      // traduite dans `profilAffiche`/`catalogue` (voir translateWarbandCatalog).
      const competenceGenerique = skillById(competenceId);
      if (competenceGenerique) {
        const traduite = translateSkill(competenceGenerique, language);
        ajouterAide(
          aides,
          `${membre.nom_perso} — ${traduite.nom}`,
          traduite.texte,
          competenceGenerique.texte
        );
        continue;
      }
      const competenceBrute =
        (profil?.competences_speciales ?? []).find((item) => item.id === competenceId) ??
        catalogue?.competences_speciales?.find((item) => item.id === competenceId);
      if (!competenceBrute) continue;
      const competenceAffichee =
        (profilAffiche?.competences_speciales ?? catalogue?.competences_speciales ?? []).find(
          (item) => item.id === competenceId
        ) ?? competenceBrute;
      ajouterAide(
        aides,
        `${membre.nom_perso} — ${competenceAffichee.nom}`,
        competenceAffichee.texte,
        competenceBrute.texte
      );
    }

    for (const entree of membre.inventaire) {
      const objetBrut = resolveItemDetail(entree, catalogue?.id ?? roster.bande_id, rules);
      const objetAffiche = translateItem(objetBrut, language);
      // Un objet dont le sous-jet d'achat a été résolu (ex : Carte de
      // Mordheim) n'affiche que le résultat obtenu, pas la liste complète
      // des résultats possibles.
      const reglesAffichees = objetAffiche.resultatSousJetAchat
        ? [`${objetAffiche.resultatSousJetAchat.label} — ${objetAffiche.resultatSousJetAchat.texte}`]
        : (objetAffiche.regles_speciales ?? []).map((regle) => `${regle.nom} — ${regle.texte}`);
      const reglesDetection = objetBrut.resultatSousJetAchat
        ? [`${objetBrut.resultatSousJetAchat.label} — ${objetBrut.resultatSousJetAchat.texte}`]
        : (objetBrut.regles_speciales ?? []).map((regle) => `${regle.nom} — ${regle.texte}`);
      const textesAffiches = [objetAffiche.texte, ...reglesAffichees].filter((texte): texte is string => !!texte);
      const textesDetection = [objetBrut.texte, ...reglesDetection].filter((texte): texte is string => !!texte);
      textesAffiches.forEach((texte, i) => {
        ajouterAide(aides, `${membre.nom_perso} — ${objetAffiche.nom}`, texte, textesDetection[i] ?? texte);
      });
    }
  }

  for (const regle of catalogue?.regles_speciales ?? []) {
    ajouterAide(aides, `${tr('exploration.bandSourceLabel', language)} — ${regle.nom}`, regle.texte, regle.texte);
  }

  // Bonus fixe et inconditionnel de dé(s) d'Exploration pour toute la
  // bande (ex : Gardiens des Tombes — "Terrain natal") — voir
  // WarbandCatalog.bonus_des_exploration_fixe.
  if (catalogue?.bonus_des_exploration_fixe) {
    bonusFixes += catalogue.bonus_des_exploration_fixe;
  }

  // Bonus de dé(s) obtenu lors d'un précédent jet d'exploration (ex :
  // Vagabond interrogé) — consommé une fois cette bataille terminée, voir
  // PostBatailleScreen.terminer().
  const desSupplementairesPersistants = effetsPersistantsAvecCle(roster, CLE_DE_SUPPLEMENTAIRE_EXPLORATION)
    .filter((effet) => !effetsInitiauxIds || effetsInitiauxIds.has(effet.id))
    .reduce((total, effet) => total + (effet.valeur ?? 1), 0);
  if (desSupplementairesPersistants > 0) {
    bonusFixes += desSupplementairesPersistants;
    const s = desSupplementairesPersistants > 1 ? 's' : '';
    const texteFrancais = `Vous bénéficiez de ${desSupplementairesPersistants} dé${s} supplémentaire${s} lors de cette phase d'exploration.`;
    const texteAffiche = tr('exploration.extraDiceNote', language, {
      n: desSupplementairesPersistants,
      dice: desSupplementairesPersistants > 1 ? 'dice' : 'die',
    });
    ajouterAide(
      aides,
      tr('exploration.pendingEffectSourceLabel', language),
      texteAffiche,
      texteFrancais,
      desSupplementairesPersistants
    );
  }

  // Relance permanente (Entrée des Catacombes, quintuples) — contrairement au
  // bonus de dé ci-dessus, jamais consommée/retirée par
  // PostBatailleScreen.terminer() : c'est un simple rappel, pas un dé en plus
  // (l'app ne relance jamais elle-même, le joueur le fait sur table papier).
  if (effetsPersistantsAvecCle(roster, CLE_RELANCE_EXPLORATION_PERMANENTE).length > 0) {
    ajouterAide(
      aides,
      tr('exploration.permanentRerollSourceLabel', language),
      tr('exploration.permanentRerollNote', language),
      "Vous pouvez relancer un dé lors de vos jets sur le Tableau d'exploration."
    );
  }

  const desHeros = herosEligibles.length;
  const bonusVictoire = resultat === 'victoire' ? 1 : 0;
  return {
    herosEligibles,
    desHeros,
    bonusVictoire,
    bonusFixes,
    totalDesALancer: desHeros + bonusVictoire + bonusFixes,
    maximumAConserver: 6,
    aides,
    suggestionManuelle: !!catalogue?.des_exploration_manuels,
  };
}

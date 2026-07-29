import { skillById } from '../data/gameData';
import type { WarbandCatalog } from '../types/catalog';
import type { BattleRecord, Member, RosterInstance } from '../types/roster';
import { resolveItemDetail } from './shop';
import { resolveProfil } from './profil';
import type { GameRules } from '../types/rules';
import { estFrancTireur } from '../data/hiredSwords';
import { CLE_DE_SUPPLEMENTAIRE_EXPLORATION, effetsPersistantsAvecCle } from './effetsPersistants';

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
  texte: string,
  desSupplementaires = 0
) {
  if (!concerneExploration(texte)) return;
  const cle = `${source}\n${texte}`;
  if (aides.some((aide) => `${aide.source}\n${aide.texte}` === cle)) return;
  aides.push({ source, texte, desSupplementaires });
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
  rules: GameRules
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
    const profil = resolveProfil(roster, membre);
    for (const regle of profil?.regles_speciales ?? []) {
      const bonus = idsHerosEligibles.has(membre.instance_id) && bonusDeuxDes(regle.texte) ? 1 : 0;
      bonusFixes += bonus;
      ajouterAide(aides, `${membre.nom_perso} — ${regle.nom}`, regle.texte, bonus);
    }

    for (const competenceId of membre.competences_acquises) {
      const competence =
        skillById(competenceId) ??
        (profil?.competences_speciales ?? catalogue?.competences_speciales ?? []).find(
          (item) => item.id === competenceId
        );
      if (competence) {
        ajouterAide(aides, `${membre.nom_perso} — ${competence.nom}`, competence.texte);
      }
    }

    for (const entree of membre.inventaire) {
      const objet = resolveItemDetail(entree, catalogue?.id ?? roster.bande_id, rules);
      const textes = [
        objet.texte,
        ...(objet.regles_speciales ?? []).map((regle) => `${regle.nom} — ${regle.texte}`),
      ].filter((texte): texte is string => !!texte);
      for (const texte of textes) {
        ajouterAide(aides, `${membre.nom_perso} — ${objet.nom}`, texte);
      }
    }
  }

  for (const regle of catalogue?.regles_speciales ?? []) {
    ajouterAide(aides, `Bande — ${regle.nom}`, regle.texte);
  }

  // Bonus de dé(s) obtenu lors d'un précédent jet d'exploration (ex :
  // Vagabond interrogé) — consommé une fois cette bataille terminée, voir
  // PostBatailleScreen.terminer().
  const desSupplementairesPersistants = effetsPersistantsAvecCle(roster, CLE_DE_SUPPLEMENTAIRE_EXPLORATION).reduce(
    (total, effet) => total + (effet.valeur ?? 1),
    0
  );
  if (desSupplementairesPersistants > 0) {
    bonusFixes += desSupplementairesPersistants;
    ajouterAide(
      aides,
      'Effet en attente',
      `Vous bénéficiez de ${desSupplementairesPersistants} dé(s) supplémentaire(s) lors de cette phase d'exploration.`,
      desSupplementairesPersistants
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
  };
}

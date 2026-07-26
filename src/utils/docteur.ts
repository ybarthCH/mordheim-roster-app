import { v4 as uuidv4 } from 'uuid';
import { trouverBlessure } from '../data/blessuresGraves';
import { annulerDeltaStats } from './blessures';
import type {
  DoctorTreatmentRecord,
  InventoryEntry,
  Member,
  SeriousInjuryRecord,
} from '../types/roster';
import type { Stats } from '../types/catalog';

export const COUT_DOCTEUR = 20;

export type TableDocteur = 'membres' | 'tete';

export type EffetTraitableDocteur = {
  id: string;
  resultatId: string;
  nom: string;
  table: TableDocteur;
  statsDelta: Partial<Record<keyof Stats, number>>;
  notesAjoutees: string[];
  legacy: boolean;
};

export type ActionDocteur =
  | 'mort'
  | 'amputation_jambe'
  | 'amputation_main'
  | 'inefficace_repos'
  | 'inefficace'
  | 'guerison_repos'
  | 'guerison'
  | 'stupidite'
  | 'fou_furieux';

export type ResultatDocteur = {
  titre: string;
  texte: string;
  action: ActionDocteur;
};

export type ApplicationDocteur = {
  membre: Member;
  equipementConserve: InventoryEntry[];
  resultat: ResultatDocteur;
};

const TABLE_PAR_BLESSURE: Partial<Record<string, TableDocteur>> = {
  blessure_jambe: 'membres',
  jambe_brisee: 'membres',
  blessure_main: 'membres',
  folie: 'tete',
  trouble_nerveux: 'tete',
};

const ID_PAR_NOM: Record<string, string> = {
  'blessure à la jambe': 'blessure_jambe',
  'jambe brisée': 'jambe_brisee',
  'jambe écrasée': 'jambe_brisee',
  'blessure à la main': 'blessure_main',
  folie: 'folie',
  'trouble nerveux': 'trouble_nerveux',
  'traumatisme nerveux': 'trouble_nerveux',
};

function normaliserNom(nom: string | undefined): string {
  return (nom ?? '').trim().toLocaleLowerCase('fr');
}

function notesLegacy(blessure: SeriousInjuryRecord, resultatId: string): string[] {
  const texte = `${blessure.nom ?? ''}\n${blessure.description ?? ''}`.toLocaleLowerCase('fr');
  if (resultatId === 'folie') {
    if (texte.includes('stupidité')) return ['Sujet à la Stupidité (Blessure grave — Folie)'];
    if (texte.includes('frénésie')) return ['Sujet à la Frénésie (Blessure grave — Folie)'];
  }
  if (resultatId === 'jambe_brisee') {
    if (texte.includes('ne peut plus courir')) return ['Ne peut plus courir (peut toujours charger)'];
    if (texte.includes('manque la prochaine')) return ['Doit manquer la prochaine partie (jambe brisée)'];
  }
  return [];
}

function effetLegacy(blessure: SeriousInjuryRecord): EffetTraitableDocteur | null {
  if (blessure.soignee) return null;
  const ancienFormat = blessure as SeriousInjuryRecord & { resultat?: string };
  const resultatId = ID_PAR_NOM[normaliserNom(blessure.nom ?? ancienFormat.resultat)];
  const table = TABLE_PAR_BLESSURE[resultatId];
  if (!resultatId || !table) return null;
  const definition = trouverBlessure(resultatId);
  return {
    id: blessure.id,
    resultatId,
    nom: definition?.nom ?? blessure.nom ?? 'Blessure',
    table,
    statsDelta: definition?.stat ?? {},
    notesAjoutees: notesLegacy(blessure, resultatId),
    legacy: true,
  };
}

export function effetsTraitablesDocteur(blessure: SeriousInjuryRecord): EffetTraitableDocteur[] {
  if (!blessure.effets?.length) {
    const legacy = effetLegacy(blessure);
    return legacy ? [legacy] : [];
  }

  return blessure.effets.flatMap((effet) => {
    const table = TABLE_PAR_BLESSURE[effet.resultat_id];
    if (!table || effet.traitee) return [];
    return [
      {
        id: effet.id,
        resultatId: effet.resultat_id,
        nom: effet.nom,
        table,
        statsDelta: effet.stats_delta,
        notesAjoutees: effet.notes_ajoutees,
        legacy: false,
      },
    ];
  });
}

export function resultatDocteur(
  table: TableDocteur,
  jet: number,
  effet: EffetTraitableDocteur
): ResultatDocteur {
  if (jet <= 3) {
    return {
      titre: 'Appelez un prêtre…',
      texte:
        table === 'membres'
          ? "Le héros ne survit pas à l'hémorragie. Son équipement est conservé par la bande."
          : "Le héros ne survit pas à la trépanation. Son équipement est conservé par la bande.",
      action: 'mort',
    };
  }

  if (table === 'membres') {
    if (jet === 4) {
      const main = effet.resultatId === 'blessure_main';
      return {
        titre: 'Il faut couper…',
        texte: main
          ? "La main doit être amputée. Le héros ne pourra désormais utiliser qu'une seule arme à une main."
          : 'La jambe doit être amputée. Le Mouvement du héros est réduit de moitié, arrondi au supérieur.',
        action: main ? 'amputation_main' : 'amputation_jambe',
      };
    }
    if (jet <= 6) {
      return {
        titre: 'Désolé…',
        texte: 'Le traitement est inefficace et le héros doit manquer la prochaine bataille.',
        action: 'inefficace_repos',
      };
    }
    if (jet <= 8) {
      return {
        titre: 'Pas de chance…',
        texte: 'Le traitement est inefficace.',
        action: 'inefficace',
      };
    }
  } else {
    if (jet <= 5) {
      return {
        titre: "Y'a un problème…",
        texte:
          "Le traitement empire l'état du héros, qui devient sujet à la Stupidité en plus de sa blessure. S'il l'était déjà, le traitement est simplement inefficace.",
        action: 'stupidite',
      };
    }
    if (jet === 6) {
      return {
        titre: 'Oups…',
        texte: 'Le héros perd 1 en Initiative, jusqu’à un minimum de 1, et provoque désormais la Peur.',
        action: 'fou_furieux',
      };
    }
    if (jet <= 8) {
      return {
        titre: 'Pas de chance…',
        texte: 'Le traitement est inefficace et le héros doit manquer la prochaine bataille.',
        action: 'inefficace_repos',
      };
    }
  }

  if (jet <= 10) {
    return {
      titre: 'Avec un peu de repos, ça devrait aller…',
      texte: 'La blessure et ses effets sont annulés. Le héros doit manquer la prochaine bataille.',
      action: 'guerison_repos',
    };
  }
  return {
    titre: 'Shallya soit louée !',
    texte: 'La blessure et ses effets sont annulés.',
    action: 'guerison',
  };
}

function creerSequelle(
  nom: string,
  description: string,
  statsDelta: Partial<Record<keyof Stats, number>>,
  notesAjoutees: string[]
): SeriousInjuryRecord {
  const resultatId = `docteur_${normaliserNom(nom).replace(/[^a-z0-9]+/g, '_')}`;
  return {
    id: uuidv4(),
    date: new Date().toISOString().slice(0, 10),
    nom,
    description,
    effets: [
      {
        id: uuidv4(),
        resultat_id: resultatId,
        nom,
        stats_delta: statsDelta,
        notes_ajoutees: notesAjoutees,
      },
    ],
  };
}

function imposerRepos(membre: Member): Member {
  if (membre.statut === 'mort') return membre;
  const restant =
    membre.statut === 'blesse' ? Math.max(0, membre.blesse_tour_total - membre.blesse_tour_actuel) : 0;
  if (restant >= 1) return membre;
  return { ...membre, statut: 'blesse', date_mort: undefined, blesse_tour_actuel: 0, blesse_tour_total: 1 };
}

function annulerEffet(
  membre: Member,
  blessure: SeriousInjuryRecord,
  effet: EffetTraitableDocteur
): { membre: Member; blessure: SeriousInjuryRecord } {
  const { stats_actuels, notes } = annulerDeltaStats(
    membre.stats_actuels,
    membre.notes,
    effet.statsDelta,
    effet.notesAjoutees
  );

  let blessureMaj: SeriousInjuryRecord;
  if (effet.legacy) {
    blessureMaj = { ...blessure, soignee: true };
  } else {
    blessureMaj = {
      ...blessure,
      effets: blessure.effets?.map((item) => (item.id === effet.id ? { ...item, traitee: true } : item)),
    };
  }

  return {
    membre: { ...membre, stats_actuels, notes },
    blessure: blessureMaj,
  };
}

export function appliquerTraitementDocteur(
  membreInitial: Member,
  blessureId: string,
  effetId: string,
  jet: number,
  dejaStupide: boolean
): ApplicationDocteur {
  const blessureInitiale = membreInitial.blessures_graves.find((item) => item.id === blessureId);
  if (!blessureInitiale) throw new Error('Blessure introuvable.');
  const effet = effetsTraitablesDocteur(blessureInitiale).find((item) => item.id === effetId);
  if (!effet) throw new Error('Cette blessure ne peut pas être traitée.');

  const resultat = resultatDocteur(effet.table, jet, effet);
  const historique: DoctorTreatmentRecord = {
    date: new Date().toISOString().slice(0, 10),
    jet,
    titre: resultat.titre,
    texte: resultat.texte,
  };
  let blessure = {
    ...blessureInitiale,
    docteur_effet_en_attente: undefined,
    historique_docteur: [...(blessureInitiale.historique_docteur ?? []), historique],
  };
  let membre: Member = {
    ...membreInitial,
    blessures_graves: membreInitial.blessures_graves.map((item) => (item.id === blessureId ? blessure : item)),
  };
  let equipementConserve: InventoryEntry[] = [];
  const sequelles: SeriousInjuryRecord[] = [];

  const guerir = () => {
    const annulation = annulerEffet(membre, blessure, effet);
    membre = annulation.membre;
    blessure = {
      ...annulation.blessure,
      docteur_effet_en_attente: undefined,
      historique_docteur: [...(blessureInitiale.historique_docteur ?? []), historique],
    };
  };

  if (resultat.action === 'mort') {
    equipementConserve = membre.inventaire;
    membre = {
      ...membre,
      statut: 'mort',
      date_mort: new Date().toISOString().slice(0, 10),
      inventaire: [],
      equipement: '',
    };
  } else if (resultat.action === 'amputation_jambe') {
    guerir();
    const mouvementAvant = membre.stats_actuels.M;
    const mouvementApres = Math.ceil(mouvementAvant / 2);
    const delta = mouvementApres - mouvementAvant;
    const note = 'Jambe amputée (Docteur) — Mouvement réduit de moitié, arrondi au supérieur';
    membre = {
      ...membre,
      stats_actuels: { ...membre.stats_actuels, M: mouvementApres },
      stats_modifiees: membre.stats_modifiees.includes('M')
        ? membre.stats_modifiees
        : [...membre.stats_modifiees, 'M'],
    };
    sequelles.push(creerSequelle('Jambe amputée', resultat.texte, { M: delta }, [note]));
  } else if (resultat.action === 'amputation_main') {
    guerir();
    const note = "Main amputée (Docteur) — une seule arme à une main peut être utilisée";
    sequelles.push(creerSequelle('Main amputée', resultat.texte, {}, [note]));
  } else if (resultat.action === 'inefficace_repos') {
    membre = imposerRepos(membre);
  } else if (resultat.action === 'guerison_repos') {
    guerir();
    membre = imposerRepos(membre);
  } else if (resultat.action === 'guerison') {
    guerir();
  } else if (resultat.action === 'stupidite' && !dejaStupide) {
    const note = 'Sujet à la Stupidité (Docteur)';
    sequelles.push(creerSequelle('Séquelles du docteur — Stupidité', resultat.texte, {}, [note]));
  } else if (resultat.action === 'fou_furieux') {
    const initiativeAvant = membre.stats_actuels.I;
    const initiativeApres = Math.max(1, initiativeAvant - 1);
    const delta = initiativeApres - initiativeAvant;
    const note = 'Cause la Peur (Docteur — Fou furieux)';
    membre = {
      ...membre,
      stats_actuels: { ...membre.stats_actuels, I: initiativeApres },
      stats_modifiees: membre.stats_modifiees.includes('I')
        ? membre.stats_modifiees
        : [...membre.stats_modifiees, 'I'],
    };
    sequelles.push(creerSequelle('Fou furieux après traitement', resultat.texte, { I: delta }, [note]));
  }

  membre = {
    ...membre,
    blessures_graves: [
      ...membre.blessures_graves.map((item) => (item.id === blessureId ? blessure : item)),
      ...sequelles,
    ],
  };
  return { membre, equipementConserve, resultat };
}

export function estBlessureExplicitementIncurable(blessure: SeriousInjuryRecord): boolean {
  const ancienFormat = blessure as SeriousInjuryRecord & { resultat?: string };
  const nom = normaliserNom(blessure.nom ?? ancienFormat.resultat);
  return (
    nom === 'blessure à la poitrine' ||
    nom === 'blessure au torse' ||
    nom === "aveuglé d'un œil" ||
    nom === 'œil crevé' ||
    nom === 'vieille blessure de guerre' ||
    nom === 'vieille blessure'
  );
}

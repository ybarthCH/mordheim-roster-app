import { useState } from 'react';
import type { Stats } from '../../types/catalog';
import {
  BLESSURES_GRAVES,
  IDS_GLADIATEUR_PERDU,
  type ResultatBlessureGrave,
  type SousJetOption,
} from '../../data/blessuresGraves';
import { Icon, type IconName } from '../common/Icon';
import type { SeriousInjuryEffect } from '../../types/roster';

const ICONE_BLESSURE: Partial<Record<string, IconName>> = {
  mort: 'crane',
  capture: 'chaine',
  detrousse: 'cle',
  retablissement_complet: 'etoile',
  endurci: 'bouclier',
  survit_contre_tout: 'etoile',
  gladiateur: 'epee',
  cicatrices_horribles: 'ossements',
};

function iconePourBlessure(r: ResultatBlessureGrave): IconName {
  return ICONE_BLESSURE[r.id] ?? 'goutte';
}

export type BlessureGraveResultat = {
  nom: string;
  texte: string;
  statsDelta: Partial<Record<keyof Stats, number>>;
  notes: string[];
  effets: Omit<SeriousInjuryEffect, 'id'>[];
  perteEquipement: boolean;
  statutMort: boolean;
  xpBonus: number;
  tresorerieBonus: number;
};

type IterationResolue = {
  resultat: ResultatBlessureGrave;
  sousJetChoisi?: SousJetOption;
  dureeD3?: number;
};

type Mode =
  | 'liste'
  | 'sous_jet'
  | 'duree_d3'
  | 'multiples_compte'
  | 'gladiateur_issue'
  | 'capture_issue'
  | 'confirmation';

function fusionnerStats(
  a: Partial<Record<keyof Stats, number>>,
  b: Partial<Record<keyof Stats, number>>
): Partial<Record<keyof Stats, number>> {
  const res = { ...a };
  for (const [k, v] of Object.entries(b)) {
    const key = k as keyof Stats;
    res[key] = (res[key] ?? 0) + (v ?? 0);
  }
  return res;
}

function texteIteration(it: IterationResolue): string {
  let t = `${it.resultat.nom} (${it.resultat.code}) — ${it.resultat.texte}`;
  if (it.sousJetChoisi) t += ` Résultat du sous-jet (${it.sousJetChoisi.label}) : ${it.sousJetChoisi.texte}`;
  if (it.dureeD3) t += ` Le guerrier manque ${it.dureeD3} prochaine(s) partie(s).`;
  return t;
}

function notesIteration(it: IterationResolue): string[] {
  const notes: string[] = [];
  if (it.resultat.noteTag) notes.push(it.resultat.noteTag);
  if (it.sousJetChoisi?.noteTag) notes.push(it.sousJetChoisi.noteTag);
  if (it.dureeD3) notes.push(`Manque ${it.dureeD3} prochaine(s) partie(s) (${it.resultat.nom})`);
  return notes;
}

function statsIteration(it: IterationResolue): Partial<Record<keyof Stats, number>> {
  return fusionnerStats(it.resultat.stat ?? {}, it.sousJetChoisi?.stat ?? {});
}

type Props = {
  nomPersonnage: string;
  // Le guerrier a déjà résolu "Aveuglé d'un œil" par le passé (historique
  // blessures_graves) : un second tirage sur ce résultat lui fait perdre son
  // second œil, ce qui force le statut Mort (règle imprimée dans le texte de
  // la blessure elle-même — voir data/blessuresGraves.ts).
  dejaAveugle?: boolean;
  // Trésorerie actuelle de la bande — affichée avant/après le choix d'une
  // rançon pour le résultat "Capturé", purement informatif (le paiement
  // n'est appliqué qu'à la validation finale, via tresorerieBonus négatif).
  tresorerieDisponible?: number;
  // Règle spéciale Éternelle (Liche des Morts Sans Repos) : peut ignorer
  // n'importe quel résultat de Blessure grave sauf Tué, en subissant à la
  // place -1 PV permanent — indisponible s'il ne lui reste qu'1 PV. Un
  // résultat Tué devient automatiquement -D3 PV permanents (mort normale
  // seulement si cela ramène ses PV à 0 ou moins).
  estEternelle?: boolean;
  // PV actuels du profil (Member.stats_actuels.PV) — nécessaire pour
  // appliquer/vérifier la règle Éternelle ci-dessus.
  pvActuelProfil?: number;
  onAppliquer: (resultat: BlessureGraveResultat) => void;
  onAnnuler?: () => void;
};

const ID_INTERDITS_BOUCLE = ['mort', 'capture', 'blessures_multiples'];

export function BlessureGraveWizard({
  nomPersonnage,
  dejaAveugle = false,
  tresorerieDisponible,
  estEternelle = false,
  pvActuelProfil,
  onAppliquer,
  onAnnuler,
}: Props) {
  const [mode, setMode] = useState<Mode>('liste');
  const [contexte, setContexte] = useState<'racine' | 'boucle'>('racine');
  const [selectionActuelle, setSelectionActuelle] = useState<ResultatBlessureGrave | null>(null);
  const [selectionEnAttente, setSelectionEnAttente] = useState('');
  const [racine, setRacine] = useState<IterationResolue | null>(null);
  const [multiplesCount, setMultiplesCount] = useState<number | null>(null);
  const [multiplesResultats, setMultiplesResultats] = useState<IterationResolue[]>([]);
  const [precision, setPrecision] = useState('');
  // Cas spécial "Gladiateur" perdu : la relance suivante est filtrée sur la
  // plage 11-35 (voir IDS_GLADIATEUR_PERDU, Mort inclus) et entraîne
  // toujours la perte d'équipement, quel que soit le résultat tiré — ce
  // second point ne se déduit pas des données de la table elle-même, d'où ce
  // drapeau appliqué à part dans construireResultatFinal. Si la relance tombe
  // sur Mort, ce résultat porte déjà son propre statutMort/perteEquipement :
  // aucun cas particulier à gérer ici.
  const [enChoixGladiateurPerdu, setEnChoixGladiateurPerdu] = useState(false);
  const [gladiateurForcePerte, setGladiateurForcePerte] = useState(false);
  // Cas spécial "Capturé" : deux issues possibles, la seconde nécessitant un
  // montant de rançon saisi avant de pouvoir conclure (voir mode
  // 'capture_issue' plus bas).
  const [captureChoix, setCaptureChoix] = useState<'perdu' | 'rancon' | null>(null);
  const [ranconSaisie, setRanconSaisie] = useState('');
  // Règle Éternelle (voir Props.estEternelle) : sur un résultat autre que
  // Tué, la Liche peut choisir d'ignorer ce résultat contre -1 PV permanent.
  const [eternelleIgnorer, setEternelleIgnorer] = useState(false);
  // Sur un résultat Tué, le jet de D3 (perte de PV permanents) qui remplace
  // automatiquement la mort — saisi comme n'importe quel jet papier.
  const [eternelleDeD3Saisi, setEternelleDeD3Saisi] = useState('');

  const enCoursDansBoucle = contexte === 'boucle' && multiplesCount !== null;
  const iterationActuelleIndex = multiplesResultats.length + 1;

  const reinitialiser = () => {
    setMode('liste');
    setContexte('racine');
    setSelectionActuelle(null);
    setSelectionEnAttente('');
    setRacine(null);
    setMultiplesCount(null);
    setMultiplesResultats([]);
    setPrecision('');
    setEnChoixGladiateurPerdu(false);
    setGladiateurForcePerte(false);
    setCaptureChoix(null);
    setRanconSaisie('');
    setEternelleIgnorer(false);
    setEternelleDeD3Saisi('');
  };

  const terminerIteration = (it: IterationResolue) => {
    if (contexte === 'boucle') {
      const nouveaux = [...multiplesResultats, it];
      setMultiplesResultats(nouveaux);
      setSelectionActuelle(null);
      setSelectionEnAttente('');
      if (multiplesCount !== null && nouveaux.length >= multiplesCount) {
        setMode('confirmation');
      } else {
        setMode('liste');
      }
    } else {
      setRacine(it);
      setMode('confirmation');
    }
  };

  const choisirResultat = (r: ResultatBlessureGrave) => {
    setSelectionActuelle(r);
    // Le filtre ne concerne que ce choix précis dans la liste — une éventuelle
    // relance imbriquée (ex : Blessures multiples tiré dans ce lot) repart sur
    // la table complète, conformément à la règle.
    setEnChoixGladiateurPerdu(false);
    if (r.combatGladiateur) {
      setMode('gladiateur_issue');
      return;
    }
    if (r.captureIssue) {
      setCaptureChoix(null);
      setRanconSaisie('');
      setMode('capture_issue');
      return;
    }
    if (r.multiplesInjuries) {
      // Racine posée dès maintenant : la boucle de relance qui suit ne
      // retouche jamais `racine` (voir terminerIteration, branche 'boucle'),
      // donc c'est le seul moment où l'accrocher est possible avant que
      // construireResultatFinal en ait besoin pour agréger le résultat final.
      setRacine({ resultat: r });
      setMode('multiples_compte');
      return;
    }
    if (r.sousJet) {
      setMode('sous_jet');
      return;
    }
    if (r.sousJetDureeD3) {
      setMode('duree_d3');
      return;
    }
    terminerIteration({ resultat: r });
  };

  const choisirGladiateurIssue = (victoire: boolean) => {
    if (!selectionActuelle) return;
    if (victoire) {
      terminerIteration({
        resultat: {
          ...selectionActuelle,
          nom: 'Gladiateur (victoire)',
          texte:
            "Le guerrier remporte son combat dans les fosses du Repaire des Coupe-Jarrets : il empoche 50 pièces d'or, gagne 2 points d'Expérience et rejoint sa bande avec tout son équipement intact.",
          xpBonus: 2,
          tresorerieBonus: 50,
          perteEquipement: false,
          statutMort: false,
        },
      });
    } else {
      // Défaite : une seule relance, filtrée sur 11-35 (Mort inclus comme
      // résultat possible parmi les autres) — pas de question Mort/Vivant à
      // part, le résultat tiré tranche lui-même.
      setGladiateurForcePerte(true);
      setEnChoixGladiateurPerdu(true);
      setSelectionActuelle(null);
      setSelectionEnAttente('');
      setMode('liste');
    }
  };

  const choisirCapturePerdu = () => {
    if (!selectionActuelle) return;
    terminerIteration({
      resultat: {
        ...selectionActuelle,
        nom: 'Capturé — héros perdu',
        texte:
          "Le prisonnier ne revient pas : vendu à des marchands d'esclaves, exécuté ou transformé par ses ravisseurs, il quitte définitivement la bande. Son équipement reste aux mains de ses ravisseurs.",
        captureIssue: false,
        perteEquipement: true,
        statutMort: true,
      },
    });
  };

  const choisirCaptureRancon = () => {
    if (!selectionActuelle) return;
    const montant = Math.max(0, Math.trunc(Number(ranconSaisie) || 0));
    terminerIteration({
      resultat: {
        ...selectionActuelle,
        nom: 'Capturé — libéré contre rançon',
        texte: `Le prisonnier est libéré contre une rançon de ${montant} po, payée par la bande. Il conserve tout son équipement et rejoint aussitôt la bande.`,
        captureIssue: false,
        perteEquipement: false,
        statutMort: false,
        tresorerieBonus: -montant,
      },
    });
  };

  const choisirSousJet = (option: SousJetOption) => {
    if (!selectionActuelle) return;
    terminerIteration({ resultat: selectionActuelle, sousJetChoisi: option });
  };

  const choisirDureeD3 = (n: number) => {
    if (!selectionActuelle) return;
    terminerIteration({ resultat: selectionActuelle, dureeD3: n });
  };

  const choisirMultiplesCount = (n: number) => {
    setMultiplesCount(n);
    setMultiplesResultats([]);
    setContexte('boucle');
    setSelectionActuelle(null);
    setSelectionEnAttente('');
    setMode('liste');
  };

  const validerSelection = () => {
    const r = BLESSURES_GRAVES.find((b) => b.id === selectionEnAttente);
    if (r) choisirResultat(r);
  };

  const prefixeGladiateur = gladiateurForcePerte ? 'Défaite face à un gladiateur dans les fosses de combat — ' : '';

  const NOTE_SECOND_OEIL = 'Perd son second œil — retiré définitivement de la bande (Mort).';

  const construireResultatBase = (): BlessureGraveResultat => {
    if (racine && racine.resultat.multiplesInjuries) {
      const texte =
        `${prefixeGladiateur}Blessures multiples (16-21) — relance de ${multiplesResultats.length} résultat(s) supplémentaire(s) :\n` +
        multiplesResultats.map((it, i) => `${i + 1}. ${texteIteration(it)}`).join('\n');
      let stats: Partial<Record<keyof Stats, number>> = {};
      let notes: string[] = [];
      let perteEquipement = false;
      let xpBonus = 0;
      let tresorerieBonus = 0;
      let nombreOeilPerdu = dejaAveugle ? 1 : 0;
      for (const it of multiplesResultats) {
        stats = fusionnerStats(stats, statsIteration(it));
        notes = [...notes, ...notesIteration(it)];
        if (it.resultat.perteEquipement) perteEquipement = true;
        if (it.resultat.xpBonus) xpBonus += it.resultat.xpBonus;
        if (it.resultat.tresorerieBonus) tresorerieBonus += it.resultat.tresorerieBonus;
        if (it.resultat.id === 'aveugle_oeil') nombreOeilPerdu += 1;
      }
      const secondOeilPerdu = nombreOeilPerdu >= 2;
      if (secondOeilPerdu) notes = [...notes, NOTE_SECOND_OEIL];
      return {
        nom: `Blessures multiples (${multiplesResultats.map((it) => it.resultat.nom).join(', ')})`,
        texte: precision.trim()
          ? `${texte}\n\nPrécision : ${precision.trim()}`
          : secondOeilPerdu
            ? `${texte}\n\n${NOTE_SECOND_OEIL}`
            : texte,
        statsDelta: stats,
        notes,
        effets: multiplesResultats.map((it) => ({
          resultat_id: it.resultat.id,
          nom: it.resultat.nom,
          stats_delta: statsIteration(it),
          notes_ajoutees: notesIteration(it),
        })),
        perteEquipement: perteEquipement || gladiateurForcePerte,
        statutMort: secondOeilPerdu,
        xpBonus,
        tresorerieBonus,
      };
    }
    if (!racine) {
      return {
        nom: '',
        texte: '',
        statsDelta: {},
        notes: [],
        effets: [],
        perteEquipement: false,
        statutMort: false,
        xpBonus: 0,
        tresorerieBonus: 0,
      };
    }
    const secondOeilPerdu = racine.resultat.id === 'aveugle_oeil' && dejaAveugle;
    const texte = `${prefixeGladiateur}${texteIteration(racine)}`;
    return {
      nom: racine.resultat.nom,
      texte: precision.trim()
        ? `${texte}\n\nPrécision : ${precision.trim()}`
        : secondOeilPerdu
          ? `${texte}\n\n${NOTE_SECOND_OEIL}`
          : texte,
      statsDelta: statsIteration(racine),
      notes: secondOeilPerdu ? [...notesIteration(racine), NOTE_SECOND_OEIL] : notesIteration(racine),
      effets: [
        {
          resultat_id: racine.resultat.id,
          nom: racine.resultat.nom,
          stats_delta: statsIteration(racine),
          notes_ajoutees: notesIteration(racine),
        },
      ],
      perteEquipement: !!racine.resultat.perteEquipement || gladiateurForcePerte,
      statutMort: !!racine.resultat.statutMort || secondOeilPerdu,
      xpBonus: racine.resultat.xpBonus ?? 0,
      tresorerieBonus: racine.resultat.tresorerieBonus ?? 0,
    };
  };

  // Une Liche a 1 PV restant : elle ne peut pas ignorer un résultat contre
  // -1 PV (cela la tuerait sans passer par un jet Tué).
  const eternellePeutIgnorer = estEternelle && (pvActuelProfil ?? 0) > 1;

  const construireResultatEternelleIgnore = (base: BlessureGraveResultat): BlessureGraveResultat => ({
    ...base,
    texte: `${base.texte}\n\nÉternelle : ce résultat est ignoré — la Liche subit à la place une perte permanente de -1 Point de Vie.`,
    statsDelta: fusionnerStats(base.statsDelta, { PV: -1 }),
    notes: [...base.notes, 'Éternelle : résultat ignoré, -1 PV permanent'],
    perteEquipement: false,
    statutMort: false,
    xpBonus: 0,
    tresorerieBonus: 0,
  });

  const construireResultatEternelleTue = (base: BlessureGraveResultat): BlessureGraveResultat => {
    const jet = Math.trunc(Number(eternelleDeD3Saisi));
    const perte = Number.isFinite(jet) && jet > 0 ? jet : 0;
    const pvApres = (pvActuelProfil ?? 0) - perte;
    const tue = pvApres <= 0;
    const texte = `${base.texte}\n\nÉternelle : un résultat Tué inflige à la place une perte permanente de -${perte} Point(s) de Vie (jet de 1D3).${
      tue
        ? ' Cette perte ramène ses PV à 0 ou moins : la Liche est tuée normalement.'
        : ` Ses PV passent définitivement à ${pvApres}.`
    }`;
    return {
      ...base,
      texte,
      statsDelta: tue ? {} : { PV: -perte },
      notes: tue ? base.notes : [...base.notes, `Éternelle : -${perte} PV permanent (Tué évité)`],
      perteEquipement: tue,
      statutMort: tue,
    };
  };

  const construireResultatFinal = (): BlessureGraveResultat => {
    const base = construireResultatBase();
    if (!racine) return base;
    if (estEternelle && racine.resultat.id === 'mort') return construireResultatEternelleTue(base);
    if (eternellePeutIgnorer && eternelleIgnorer) return construireResultatEternelleIgnore(base);
    return base;
  };

  if (mode === 'liste') {
    const disponibles = enCoursDansBoucle
      ? BLESSURES_GRAVES.filter((r) => !ID_INTERDITS_BOUCLE.includes(r.id))
      : enChoixGladiateurPerdu
        ? BLESSURES_GRAVES.filter((r) => IDS_GLADIATEUR_PERDU.includes(r.id))
        : BLESSURES_GRAVES;
    return (
      <div>
        {enCoursDansBoucle && (
          <p className="text-sm text-muted" style={{ marginTop: 0 }}>
            Blessures multiples — résultat {iterationActuelleIndex}/{multiplesCount}. Les résultats Mort, Capturé et
            Blessures multiples doivent être relancés : ils ne sont pas proposés ci-dessous.
          </p>
        )}
        {enChoixGladiateurPerdu && (
          <p className="text-sm text-muted" style={{ marginTop: 0 }}>
            Il perd le combat et est jeté hors des fosses sans arme ni armure. Relance sur la table (résultats 11 à
            35 uniquement) pour savoir ce qu'il devient — Mort y compris si le sort s'y prête.
          </p>
        )}
        {!enCoursDansBoucle && !enChoixGladiateurPerdu && (
          <p className="text-sm text-muted" style={{ marginTop: 0 }}>
            Lance 2D6 sur ta table papier, puis sélectionne le résultat obtenu pour {nomPersonnage}.
          </p>
        )}
        <div className="field">
          <label>Résultat obtenu</label>
          <select value={selectionEnAttente} onChange={(e) => setSelectionEnAttente(e.target.value)}>
            <option value="" disabled>
              Choisis un résultat…
            </option>
            {disponibles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.code} — {r.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          {onAnnuler && (
            <button className="btn" onClick={onAnnuler}>
              Annuler
            </button>
          )}
          <button className="btn btn--primary" disabled={!selectionEnAttente} onClick={validerSelection}>
            Continuer
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'sous_jet' && selectionActuelle?.sousJet) {
    const spec = selectionActuelle.sousJet;
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>
          <Icon name={iconePourBlessure(selectionActuelle)} style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
          {selectionActuelle.nom}
        </h4>
        <p className="text-sm text-muted">{spec.instructions}</p>
        <div className="flex flex-wrap gap-sm">
          {[1, 2, 3, 4, 5, 6].map((valeur) => {
            const option = spec.options.find((o) => o.valeurs.includes(valeur));
            return (
              <button key={valeur} className="btn" onClick={() => option && choisirSousJet(option)}>
                {valeur}
              </button>
            );
          })}
        </div>
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={() => setMode('liste')}>
            ‹ Retour
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'duree_d3' && selectionActuelle) {
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>
          <Icon name={iconePourBlessure(selectionActuelle)} style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
          {selectionActuelle.nom}
        </h4>
        <p className="text-sm text-muted">Lance 1D3 : combien de parties le guerrier doit-il manquer ?</p>
        <div className="flex flex-wrap gap-sm">
          {[1, 2, 3].map((n) => (
            <button key={n} className="btn" onClick={() => choisirDureeD3(n)}>
              {n}
            </button>
          ))}
        </div>
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={() => setMode('liste')}>
            ‹ Retour
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'multiples_compte') {
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>
          <Icon name="goutte" style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
          Blessures multiples
        </h4>
        <p className="text-sm text-muted">Lance 1D6 : combien de fois faut-il relancer sur la table ?</p>
        <div className="flex flex-wrap gap-sm">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button key={n} className="btn" onClick={() => choisirMultiplesCount(n)}>
              {n}
            </button>
          ))}
        </div>
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={() => setMode('liste')}>
            ‹ Retour
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'gladiateur_issue' && selectionActuelle) {
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>
          <Icon name={iconePourBlessure(selectionActuelle)} style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
          {selectionActuelle.nom}
        </h4>
        <p className="text-sm text-muted">
          Le guerrier affronte un gladiateur dans les fosses de combat du Repaire des Coupe-Jarrets. A-t-il gagné le
          combat ?
        </p>
        <div className="flex flex-wrap gap-sm">
          <button className="btn btn--primary" onClick={() => choisirGladiateurIssue(true)}>
            Oui
          </button>
          <button className="btn" onClick={() => choisirGladiateurIssue(false)}>
            Non
          </button>
        </div>
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={() => setMode('liste')}>
            ‹ Retour
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'capture_issue' && selectionActuelle) {
    const montantRancon = Math.max(0, Math.trunc(Number(ranconSaisie) || 0));
    return (
      <div>
        <h4 style={{ marginTop: 0 }}>
          <Icon name={iconePourBlessure(selectionActuelle)} style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
          {selectionActuelle.nom}
        </h4>
        <p className="text-sm text-muted">{selectionActuelle.texte}</p>
        {typeof tresorerieDisponible === 'number' && (
          <p className="text-sm">
            Trésorerie actuelle de la bande : <strong>{tresorerieDisponible} po</strong>.
          </p>
        )}
        {captureChoix !== 'rancon' && (
          <div className="flex flex-wrap gap-sm">
            <button className="btn" onClick={choisirCapturePerdu}>
              Héros perdu
            </button>
            <button className="btn btn--primary" onClick={() => setCaptureChoix('rancon')}>
              Récupéré contre rançon
            </button>
          </div>
        )}
        {captureChoix === 'rancon' && (
          <>
            <div className="field">
              <label>Montant de la rançon (po)</label>
              <input
                type="number"
                min={0}
                value={ranconSaisie}
                onChange={(e) => setRanconSaisie(e.target.value)}
                placeholder="0"
              />
            </div>
            {typeof tresorerieDisponible === 'number' && (
              <p className="text-sm text-muted">
                Trésorerie après paiement : {Math.max(0, tresorerieDisponible - montantRancon)} po.
              </p>
            )}
            <div className="flex flex-wrap gap-sm">
              <button className="btn" onClick={() => setCaptureChoix(null)}>
                ‹ Retour
              </button>
              <button className="btn btn--primary" onClick={choisirCaptureRancon}>
                Confirmer la rançon
              </button>
            </div>
          </>
        )}
        {captureChoix !== 'rancon' && (
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setMode('liste')}>
              ‹ Retour
            </button>
          </div>
        )}
      </div>
    );
  }

  // mode === 'confirmation'
  const resultatFinal = construireResultatFinal();
  const statsListe = Object.entries(resultatFinal.statsDelta).filter(([, v]) => v);
  return (
    <div>
      <h4 style={{ marginTop: 0 }}>
        {racine && <Icon name={iconePourBlessure(racine.resultat)} style={{ marginRight: '0.4em', color: 'var(--accent)' }} />}
        Résumé
      </h4>
      <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>
        {racine ? `${prefixeGladiateur}${texteIteration(racine)}` : ''}
      </p>
      {racine?.resultat.multiplesInjuries && multiplesResultats.length > 0 && (
        <ol className="text-sm">
          {multiplesResultats.map((it, i) => (
            <li key={i}>{texteIteration(it)}</li>
          ))}
        </ol>
      )}
      {estEternelle && racine?.resultat.id === 'mort' && (
        <div className="card card--tight" style={{ margin: '0.6rem 0', borderColor: 'var(--accent)' }}>
          <p className="text-sm mb-0">
            <strong>Éternelle</strong> — un résultat Tué inflige à la place une perte permanente de -D3 Points de
            Vie. Lance 1D3 sur ta table papier.
          </p>
          <div className="flex flex-wrap gap-sm" style={{ marginTop: '0.5rem' }}>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                className={eternelleDeD3Saisi === String(n) ? 'btn btn--primary' : 'btn'}
                onClick={() => setEternelleDeD3Saisi(String(n))}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
      {eternellePeutIgnorer && racine && racine.resultat.id !== 'mort' && (
        <label className="skill-check" style={{ cursor: 'pointer', margin: '0.6rem 0' }}>
          <input
            type="checkbox"
            checked={eternelleIgnorer}
            onChange={(e) => setEternelleIgnorer(e.target.checked)}
          />
          <span className="skill-check__name">
            Éternelle : ignorer ce résultat, -1 PV permanent à la place (PV actuels : {pvActuelProfil})
          </span>
        </label>
      )}
      {statsListe.length > 0 && (
        <p className="text-sm">
          <strong>Caractéristiques modifiées :</strong>{' '}
          {statsListe.map(([k, v], i) => (
            <span key={k}>
              {i > 0 && ', '}
              <span className={(v ?? 0) < 0 ? 'text-danger' : 'text-success'}>
                {k} {(v ?? 0) > 0 ? '+' : ''}
                {v}
              </span>
            </span>
          ))}
        </p>
      )}
      {resultatFinal.notes.length > 0 && (
        <p className="text-sm">
          <strong>À ajouter aux notes :</strong> {resultatFinal.notes.join(' · ')}
        </p>
      )}
      {resultatFinal.xpBonus > 0 && (
        <p className="text-sm">
          <strong>Expérience :</strong> +{resultatFinal.xpBonus}
        </p>
      )}
      {resultatFinal.tresorerieBonus !== 0 && (
        <p className="text-sm">
          <strong>Trésorerie de la bande :</strong> {resultatFinal.tresorerieBonus > 0 ? '+' : ''}
          {resultatFinal.tresorerieBonus} po
        </p>
      )}
      {resultatFinal.statutMort && <p className="text-danger">⚠ Ce guerrier sera marqué Mort.</p>}
      {resultatFinal.perteEquipement && (
        <p className="text-danger">
          ⚠ Cette blessure entraîne la perte de tout l'équipement (armes, armures, objets) — il sera vidé de la
          fiche en cliquant sur Appliquer.
        </p>
      )}
      {racine?.resultat.informatifSeulement && (
        <p className="text-sm text-muted">
          Ce résultat n'est pas automatisable (négociation avec l'adversaire, combat annexe...) : note l'issue
          ci-dessous, puis applique manuellement les conséquences sur la fiche si besoin.
        </p>
      )}
      <div className="field">
        <label>Précision (optionnel)</label>
        <textarea
          value={precision}
          onChange={(e) => setPrecision(e.target.value)}
          placeholder={
            racine?.resultat.id === 'capture'
              ? "Ex : nom de la bande ou du guerrier qui l'a capturé..."
              : "Ex : nom de l'adversaire responsable, issue de la négociation..."
          }
        />
      </div>
      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={reinitialiser}>
          Recommencer
        </button>
        {onAnnuler && (
          <button className="btn" onClick={onAnnuler}>
            Annuler
          </button>
        )}
        <button
          className="btn btn--primary"
          disabled={estEternelle && racine?.resultat.id === 'mort' && !eternelleDeD3Saisi}
          onClick={() => onAppliquer(resultatFinal)}
        >
          Appliquer
        </button>
      </div>
    </div>
  );
}

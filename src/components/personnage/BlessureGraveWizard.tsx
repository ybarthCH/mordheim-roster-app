import { useState } from 'react';
import type { Stats } from '../../types/catalog';
import { BLESSURES_GRAVES, type ResultatBlessureGrave, type SousJetOption } from '../../data/blessuresGraves';

export type BlessureGraveResultat = {
  texte: string;
  statsDelta: Partial<Record<keyof Stats, number>>;
  notes: string[];
  perteEquipement: boolean;
  statutMort: boolean;
  xpBonus: number;
};

type IterationResolue = {
  resultat: ResultatBlessureGrave;
  sousJetChoisi?: SousJetOption;
  dureeD3?: number;
};

type Mode = 'liste' | 'sous_jet' | 'duree_d3' | 'multiples_compte' | 'confirmation';

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
  onAppliquer: (resultat: BlessureGraveResultat) => void;
  onAnnuler?: () => void;
};

const ID_INTERDITS_BOUCLE = ['mort', 'capture', 'blessures_multiples'];

export function BlessureGraveWizard({ nomPersonnage, onAppliquer, onAnnuler }: Props) {
  const [mode, setMode] = useState<Mode>('liste');
  const [contexte, setContexte] = useState<'racine' | 'boucle'>('racine');
  const [selectionActuelle, setSelectionActuelle] = useState<ResultatBlessureGrave | null>(null);
  const [selectionEnAttente, setSelectionEnAttente] = useState('');
  const [racine, setRacine] = useState<IterationResolue | null>(null);
  const [multiplesCount, setMultiplesCount] = useState<number | null>(null);
  const [multiplesResultats, setMultiplesResultats] = useState<IterationResolue[]>([]);
  const [precision, setPrecision] = useState('');

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
    if (r.multiplesInjuries) {
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

  const construireResultatFinal = (): BlessureGraveResultat => {
    if (racine && racine.resultat.multiplesInjuries) {
      const texte =
        `Blessures multiples (16-21) — relance de ${multiplesResultats.length} résultat(s) supplémentaire(s) :\n` +
        multiplesResultats.map((it, i) => `${i + 1}. ${texteIteration(it)}`).join('\n');
      let stats: Partial<Record<keyof Stats, number>> = {};
      let notes: string[] = [];
      let perteEquipement = false;
      let xpBonus = 0;
      for (const it of multiplesResultats) {
        stats = fusionnerStats(stats, statsIteration(it));
        notes = [...notes, ...notesIteration(it)];
        if (it.resultat.perteEquipement) perteEquipement = true;
        if (it.resultat.xpBonus) xpBonus += it.resultat.xpBonus;
      }
      return {
        texte: precision.trim() ? `${texte}\n\nPrécision : ${precision.trim()}` : texte,
        statsDelta: stats,
        notes,
        perteEquipement,
        statutMort: false,
        xpBonus,
      };
    }
    if (!racine) {
      return { texte: '', statsDelta: {}, notes: [], perteEquipement: false, statutMort: false, xpBonus: 0 };
    }
    const texte = texteIteration(racine);
    return {
      texte: precision.trim() ? `${texte}\n\nPrécision : ${precision.trim()}` : texte,
      statsDelta: statsIteration(racine),
      notes: notesIteration(racine),
      perteEquipement: !!racine.resultat.perteEquipement,
      statutMort: !!racine.resultat.statutMort,
      xpBonus: racine.resultat.xpBonus ?? 0,
    };
  };

  if (mode === 'liste') {
    const interdits = enCoursDansBoucle ? ID_INTERDITS_BOUCLE : [];
    const disponibles = BLESSURES_GRAVES.filter((r) => !interdits.includes(r.id));
    return (
      <div>
        {enCoursDansBoucle && (
          <p className="text-sm text-muted" style={{ marginTop: 0 }}>
            Blessures multiples — résultat {iterationActuelleIndex}/{multiplesCount}. Les résultats Mort, Capturé et
            Blessures multiples doivent être relancés : ils ne sont pas proposés ci-dessous.
          </p>
        )}
        {!enCoursDansBoucle && (
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
        <h4 style={{ marginTop: 0 }}>{selectionActuelle.nom}</h4>
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
        <h4 style={{ marginTop: 0 }}>{selectionActuelle.nom}</h4>
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
        <h4 style={{ marginTop: 0 }}>Blessures multiples</h4>
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

  // mode === 'confirmation'
  const resultatFinal = construireResultatFinal();
  const statsListe = Object.entries(resultatFinal.statsDelta).filter(([, v]) => v);
  return (
    <div>
      <h4 style={{ marginTop: 0 }}>Résumé</h4>
      <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>
        {racine ? texteIteration(racine) : ''}
      </p>
      {racine?.resultat.multiplesInjuries && multiplesResultats.length > 0 && (
        <ol className="text-sm">
          {multiplesResultats.map((it, i) => (
            <li key={i}>{texteIteration(it)}</li>
          ))}
        </ol>
      )}
      {statsListe.length > 0 && (
        <p className="text-sm">
          <strong>Caractéristiques modifiées :</strong>{' '}
          {statsListe.map(([k, v]) => `${k} ${(v ?? 0) > 0 ? '+' : ''}${v}`).join(', ')}
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
          placeholder="Ex : nom de l'adversaire responsable, issue de la négociation..."
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
        <button className="btn btn--primary" onClick={() => onAppliquer(resultatFinal)}>
          Appliquer
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { TABLE_EXPLORATION_EVENEMENTS } from '../../data/tableExplorationEvenements';
import type { EvenementExploration as Evenement, PalierExploration } from '../../data/tableExplorationEvenements';
import { JetOrButton } from './JetOrButton';
import { ResolutionPuits } from './ResolutionPuits';
import { ResolutionVagabond } from './ResolutionVagabond';

type Props = {
  roster: RosterInstance;
  catalogue: WarbandCatalog;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  onAjouterOr: (montant: number) => void;
  onAjouterAuJournal: (texte: string) => void;
  onOuvrirArtefacts: () => void;
};

export function EvenementExploration({
  roster,
  catalogue,
  onMajRoster,
  onAjouterOr,
  onAjouterAuJournal,
  onOuvrirArtefacts,
}: Props) {
  const [palierId, setPalierId] = useState<PalierExploration['id'] | ''>('');
  const [face, setFace] = useState<number | ''>('');
  const [jetSousTable, setJetSousTable] = useState('');

  const palier = TABLE_EXPLORATION_EVENEMENTS.find((p) => p.id === palierId) ?? null;
  const evenement: Evenement | null =
    palier && face !== '' ? (palier.evenements.find((e) => e.face === face) ?? null) : null;
  const jetSousTableNombre = Number(jetSousTable);
  const ligneSousTable =
    evenement?.sousTable?.find((l) => jetSousTableNombre >= l.min && jetSousTableNombre <= l.max) ?? null;

  const changerPalier = (id: PalierExploration['id'] | '') => {
    setPalierId(id);
    setFace('');
    setJetSousTable('');
  };

  const changerFace = (f: number) => {
    setFace((prev) => (prev === f ? '' : f));
    setJetSousTable('');
  };

  const ajouterOr = (notation: string, nomLigne: string, valeur: number) => {
    if (!evenement) return;
    onAjouterOr(valeur);
    onAjouterAuJournal(`${evenement.nom}${nomLigne ? ` — ${nomLigne}` : ''} : +${valeur} po (${notation}).`);
  };

  return (
    <div className="card card--tight" style={{ marginBottom: '0.8rem' }}>
      <h3 className="mt-0">Résoudre un événement (double, triple…)</h3>
      <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
        Si ton jet d'exploration comporte un double, triple, quadruple, quintuple ou sextuple, sélectionne-le ici
        pour consulter l'événement correspondant sans rouvrir le livret.
      </p>
      <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginBottom: '0.6rem' }}>
        {TABLE_EXPLORATION_EVENEMENTS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`btn btn--sm ${palierId === p.id ? 'btn--primary' : ''}`}
            onClick={() => changerPalier(palierId === p.id ? '' : p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {palier && (
        <div className="dice-choice-grid" style={{ marginBottom: '0.6rem' }}>
          {palier.evenements.map((e) => (
            <button
              key={e.face}
              type="button"
              className={`dice-choice${face === e.face ? ' dice-choice--active' : ''}`}
              onClick={() => changerFace(e.face)}
            >
              <span className="dice-choice__range">{Array(palier.nombreDes).fill(e.face).join(' ')}</span>
              <span className="dice-choice__value" style={{ fontSize: '0.8rem' }}>
                {e.nom}
              </span>
            </button>
          ))}
        </div>
      )}

      {evenement && (
        <div className="card" style={{ marginTop: '0.4rem' }}>
          <h4 className="mt-0 mb-0">{evenement.nom}</h4>
          <p className="text-sm text-muted" style={{ fontStyle: 'italic' }}>
            {evenement.texte}
          </p>
          {evenement.regle.map((paragraphe, i) => (
            <p key={i} className="text-sm">
              {paragraphe}
            </p>
          ))}

          {evenement.or && (
            <JetOrButton
              label={`Jet obtenu (${evenement.or}) :`}
              onValider={(valeur) => ajouterOr(evenement.or!, '', valeur)}
            />
          )}

          {evenement.id === 'puits' && (
            <ResolutionPuits roster={roster} onMajRoster={onMajRoster} onAjouterAuJournal={onAjouterAuJournal} />
          )}

          {evenement.id === 'vagabond' && (
            <ResolutionVagabond
              roster={roster}
              catalogue={catalogue}
              onMajRoster={onMajRoster}
              onAjouterOr={onAjouterOr}
              onAjouterAuJournal={onAjouterAuJournal}
            />
          )}

          {evenement.artefactMagique && (
            <button className="btn btn--sm" style={{ marginTop: '0.5rem' }} onClick={onOuvrirArtefacts}>
              Ouvrir le Tableau des artefacts magiques
            </button>
          )}

          {evenement.sousTable && (
            <div style={{ marginTop: '0.6rem' }}>
              <div className="flex gap-sm items-center" style={{ flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                <span className="text-sm text-muted">Jet (1D6) :</span>
                <input
                  type="number"
                  min={1}
                  max={6}
                  style={{ width: '4rem' }}
                  value={jetSousTable}
                  onChange={(e) => setJetSousTable(e.target.value)}
                />
              </div>
              <div className="table-scroll">
                <table className="table-reference">
                  <tbody>
                    {evenement.sousTable.map((ligne, i) => (
                      <tr key={i} className={ligneSousTable === ligne ? 'table-reference__row-active' : undefined}>
                        <td>{ligne.min === ligne.max ? ligne.min : `${ligne.min}-${ligne.max}`}</td>
                        <td>{ligne.resultat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {ligneSousTable?.or && (
                <JetOrButton
                  label={`Jet or (${ligneSousTable.or}) :`}
                  onValider={(valeur) => ajouterOr(ligneSousTable.or!, ligneSousTable.resultat, valeur)}
                />
              )}
            </div>
          )}

          {evenement.sousTableTresor && (
            <div className="table-scroll" style={{ marginTop: '0.6rem' }}>
              <table className="table-reference">
                <thead>
                  <tr>
                    <th>Élément</th>
                    <th>Résultat requis</th>
                  </tr>
                </thead>
                <tbody>
                  {evenement.sousTableTresor.map((ligne) => (
                    <tr key={ligne.element}>
                      <td>{ligne.element}</td>
                      <td>{ligne.seuil}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            type="button"
            className="btn btn--sm"
            style={{ marginTop: '0.6rem' }}
            onClick={() => onAjouterAuJournal(evenement.nom)}
          >
            Consigner dans le journal d'exploration
          </button>
        </div>
      )}
    </div>
  );
}

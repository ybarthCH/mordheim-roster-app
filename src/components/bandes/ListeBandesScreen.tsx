import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRosters } from '../../state/RostersContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { Screen } from '../common/Screen';
import { Modal } from '../common/Modal';
import { bilanBatailles, nomCatalogue, valeurBande } from '../../utils/bandeValue';
import { exporterRoster, lireFichierRoster } from '../../utils/importExport';
import type { RosterInstance } from '../../types/roster';

export function ListeBandesScreen() {
  const { rosters, loading, removeRoster, duplicateRoster, importRoster } = useRosters();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aSupprimer, setASupprimer] = useState<RosterInstance | null>(null);
  const [erreurImport, setErreurImport] = useState<string | null>(null);

  const classement = useMemo(() => {
    return [...rosters].sort((a, b) => valeurBande(b) - valeurBande(a));
  }, [rosters]);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const roster = await lireFichierRoster(file);
      const imported = await importRoster(roster);
      navigate(`/roster/${imported.id}`);
    } catch (err) {
      setErreurImport(err instanceof Error ? err.message : "Échec de l'import.");
    }
  };

  return (
    <Screen title="Mes bandes" actions={<ThemeToggle />}>
      <div className="top-actions">
        <button className="btn btn--primary" onClick={() => navigate('/creer')}>
          + Nouvelle bande
        </button>
        <button className="btn" onClick={() => fileInputRef.current?.click()}>
          Importer JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>

      {erreurImport && (
        <div className="card" style={{ borderColor: 'var(--danger)' }}>
          <p className="text-danger mb-0">{erreurImport}</p>
        </div>
      )}

      {loading && <p className="text-muted">Chargement…</p>}

      {!loading && rosters.length === 0 && (
        <div className="empty-state">
          <p>Aucune bande enregistrée pour l'instant.</p>
          <p className="text-sm">Crée ta première bande ou importe un fichier JSON.</p>
        </div>
      )}

      {rosters.map((roster) => {
        const bilan = bilanBatailles(roster);
        return (
          <div key={roster.id} className="list-item" role="button" onClick={() => navigate(`/roster/${roster.id}`)}>
            <div className="list-item__main">
              <div className="list-item__title">{roster.nom_bande}</div>
              <div className="list-item__subtitle">
                {nomCatalogue(roster.bande_id)} · {roster.membres.filter((m) => m.statut !== 'mort').length} membres · Valeur {valeurBande(roster)} po
              </div>
              <div className="list-item__subtitle">
                {bilan.total > 0
                  ? `${bilan.victoires}V / ${bilan.defaites}D / ${bilan.nuls}N`
                  : 'Aucune bataille enregistrée'}
              </div>
            </div>
            <div className="flex flex-col gap-sm" onClick={(e) => e.stopPropagation()}>
              <button className="btn btn--sm" onClick={() => exporterRoster(roster)}>
                Export
              </button>
              <button className="btn btn--sm" onClick={() => duplicateRoster(roster.id)}>
                Dupliquer
              </button>
              <button className="btn btn--sm btn--danger" onClick={() => setASupprimer(roster)}>
                Suppr.
              </button>
            </div>
          </div>
        );
      })}

      {rosters.length > 1 && (
        <div className="card">
          <h3>Classement de campagne</h3>
          <div className="roster-table-wrap">
            <table className="roster-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Bande</th>
                  <th>Valeur</th>
                  <th>V/D/N</th>
                </tr>
              </thead>
              <tbody>
                {classement.map((r, i) => {
                  const bilan = bilanBatailles(r);
                  return (
                    <tr key={r.id} onClick={() => navigate(`/roster/${r.id}`)}>
                      <td>{i + 1}</td>
                      <td>{r.nom_bande}</td>
                      <td>{valeurBande(r)} po</td>
                      <td>
                        {bilan.victoires}/{bilan.defaites}/{bilan.nuls}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {aSupprimer && (
        <Modal onClose={() => setASupprimer(null)}>
          <h3>Supprimer « {aSupprimer.nom_bande} » ?</h3>
          <p className="text-muted">Cette action est irréversible. Pense à exporter un JSON avant si besoin.</p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setASupprimer(null)}>
              Annuler
            </button>
            <button
              className="btn btn--danger"
              onClick={async () => {
                await removeRoster(aSupprimer.id);
                setASupprimer(null);
              }}
            >
              Supprimer
            </button>
          </div>
        </Modal>
      )}
    </Screen>
  );
}

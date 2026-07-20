import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRosters } from '../../state/RostersContext';
import { Screen } from '../common/Screen';
import { getCatalogue, getProfil } from '../../data/warbands';
import { valeurBande, effectifTotal } from '../../utils/bandeValue';
import { validerComposition } from '../../utils/validation';
import { exporterRoster } from '../../utils/importExport';
import { AjouterMembreModal } from './AjouterMembreModal';
import { AjouterBatailleModal } from './AjouterBatailleModal';
import { STATUTS } from '../../types/roster';
import type { RosterInstance } from '../../types/roster';

const STATUT_BADGE: Record<string, string> = {
  actif: 'badge--success',
  hors_de_combat: 'badge--warning',
  mort: 'badge--danger',
  capture: 'badge--neutral',
};

export function RosterScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRosterById, updateRoster } = useRosters();
  const roster = getRosterById(id ?? '');
  const [modalMembre, setModalMembre] = useState(false);
  const [modalBataille, setModalBataille] = useState(false);

  if (!roster) {
    return (
      <Screen title="Bande introuvable" back="/">
        <p className="text-muted">Ce roster n'existe pas (ou plus) dans le stockage local.</p>
      </Screen>
    );
  }

  const catalogue = getCatalogue(roster.bande_id);
  const violations = validerComposition(roster);

  const patch = (partial: Partial<RosterInstance>) => {
    updateRoster({ ...roster, ...partial });
  };

  return (
    <Screen
      title={roster.nom_bande}
      back="/"
      actions={
        <div className="flex gap-sm">
          <button className="icon-btn" onClick={() => exporterRoster(roster)} title="Export JSON">
            JSON
          </button>
          <button
            className="icon-btn"
            onClick={() => import('../../utils/pdfExport').then((m) => m.exporterRosterPDF(roster))}
            title="Export PDF"
          >
            PDF
          </button>
        </div>
      }
    >
      <div className="card">
        <div className="flex justify-between items-center">
          <h2 className="mt-0 mb-0">{catalogue?.nom ?? roster.bande_id}</h2>
          <span className="badge badge--info">{effectifTotal(roster)} membres</span>
        </div>
        <div className="summary-grid" style={{ marginTop: '0.7rem' }}>
          <div className="summary-tile">
            <div className="summary-tile__value">{valeurBande(roster)}</div>
            <div className="summary-tile__label">Valeur (po)</div>
          </div>
          <div className="summary-tile">
            <input
              type="number"
              value={roster.tresorerie}
              onChange={(e) => patch({ tresorerie: Number(e.target.value) || 0 })}
              style={{
                width: '100%',
                textAlign: 'center',
                background: 'transparent',
                border: 'none',
                fontSize: '1.25rem',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                color: 'inherit',
              }}
            />
            <div className="summary-tile__label">Trésorerie (po)</div>
          </div>
          <div className="summary-tile">
            <input
              type="number"
              value={roster.wyrdstone}
              onChange={(e) => patch({ wyrdstone: Number(e.target.value) || 0 })}
              style={{
                width: '100%',
                textAlign: 'center',
                background: 'transparent',
                border: 'none',
                fontSize: '1.25rem',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                color: 'inherit',
              }}
            />
            <div className="summary-tile__label">Wyrdstone</div>
          </div>
        </div>
        <div className="field" style={{ marginTop: '0.7rem' }}>
          <label>Équipement en réserve</label>
          <textarea
            value={roster.equipement_reserve}
            onChange={(e) => patch({ equipement_reserve: e.target.value })}
            placeholder="Objets non attribués, réserve de la bande…"
          />
        </div>
      </div>

      {violations.length > 0 && (
        <div className="card" style={{ borderColor: 'var(--danger)' }}>
          <h3 className="text-danger">Composition invalide</h3>
          {violations.map((v) => (
            <p key={v.profilId} className="text-sm mb-0">
              {v.nomProfil} : {v.actuel}/{v.limite} autorisés
            </p>
          ))}
        </div>
      )}

      {catalogue && catalogue.regles_speciales.length > 0 && (
        <div className="card card--tight">
          <h3>Règles spéciales</h3>
          {catalogue.regles_speciales.map((r) => (
            <p key={r.nom} className="text-sm" style={{ whiteSpace: 'pre-line' }}>
              <strong>{r.nom}</strong> — {r.texte}
            </p>
          ))}
        </div>
      )}

      <div className="top-actions">
        <button className="btn btn--primary" onClick={() => setModalMembre(true)}>
          + Recruter
        </button>
        <button className="btn" onClick={() => navigate(`/roster/${roster.id}/post-bataille`)}>
          Assistant post-bataille
        </button>
      </div>

      <div className="card">
        <h3>Membres</h3>
        <div className="roster-table-wrap">
          <table className="roster-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Profil</th>
                <th>M</th>
                <th>CC</th>
                <th>CT</th>
                <th>F</th>
                <th>E</th>
                <th>PV</th>
                <th>I</th>
                <th>A</th>
                <th>Cd</th>
                <th>XP</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {roster.membres.map((m) => {
                const profil = getProfil(roster.bande_id, m.profil_id);
                return (
                  <tr key={m.instance_id} onClick={() => navigate(`/roster/${roster.id}/personnage/${m.instance_id}`)}>
                    <td>{m.nom_perso}</td>
                    <td>{profil?.nom ?? m.profil_id}</td>
                    <td>{m.stats_actuels.M}</td>
                    <td>{m.stats_actuels.CC}</td>
                    <td>{m.stats_actuels.CT}</td>
                    <td>{m.stats_actuels.F}</td>
                    <td>{m.stats_actuels.E}</td>
                    <td>
                      {m.pv_actuels}/{m.stats_actuels.PV}
                    </td>
                    <td>{m.stats_actuels.I}</td>
                    <td>{m.stats_actuels.A}</td>
                    <td>{m.stats_actuels.Cd}</td>
                    <td>{m.xp}</td>
                    <td>
                      <span className={`badge ${STATUT_BADGE[m.statut]}`}>
                        {STATUTS.find((s) => s.id === m.statut)?.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="member-cards">
          {roster.membres.map((m) => {
            const profil = getProfil(roster.bande_id, m.profil_id);
            return (
              <div
                key={m.instance_id}
                className="list-item"
                role="button"
                onClick={() => navigate(`/roster/${roster.id}/personnage/${m.instance_id}`)}
              >
                <div className="list-item__main">
                  <div className="list-item__title">{m.nom_perso}</div>
                  <div className="list-item__subtitle">
                    {profil?.nom} · XP {m.xp} · PV {m.pv_actuels}/{m.stats_actuels.PV}
                  </div>
                </div>
                <span className={`badge ${STATUT_BADGE[m.statut]}`}>
                  {STATUTS.find((s) => s.id === m.statut)?.label}
                </span>
              </div>
            );
          })}
        </div>

        {roster.membres.length === 0 && <p className="text-muted">Aucun membre recruté.</p>}
      </div>

      <div className="card">
        <div className="flex justify-between items-center">
          <h3 className="mt-0 mb-0">Historique des batailles</h3>
          <button className="btn btn--sm" onClick={() => setModalBataille(true)}>
            + Ajouter
          </button>
        </div>
        {roster.historique_batailles.length === 0 && (
          <p className="text-muted text-sm">Aucune bataille enregistrée.</p>
        )}
        {roster.historique_batailles
          .slice()
          .reverse()
          .map((b) => (
            <div key={b.id} className="list-item" style={{ marginBottom: '0.5rem' }}>
              <div className="list-item__main">
                <div className="list-item__title">
                  {b.date} —{' '}
                  <span
                    className={
                      b.resultat === 'victoire'
                        ? 'text-success'
                        : b.resultat === 'defaite'
                          ? 'text-danger'
                          : ''
                    }
                  >
                    {b.resultat}
                  </span>
                </div>
                <div className="list-item__subtitle">
                  {b.adversaire && `vs ${b.adversaire}`} {b.notes}
                </div>
              </div>
            </div>
          ))}
      </div>

      {modalMembre && (
        <AjouterMembreModal
          roster={roster}
          onClose={() => setModalMembre(false)}
          onConfirm={(r) => {
            updateRoster(r);
            setModalMembre(false);
          }}
        />
      )}
      {modalBataille && (
        <AjouterBatailleModal
          onClose={() => setModalBataille(false)}
          onConfirm={(bataille) => {
            patch({ historique_batailles: [...roster.historique_batailles, bataille] });
            setModalBataille(false);
          }}
        />
      )}
    </Screen>
  );
}

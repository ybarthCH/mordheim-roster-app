import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRosters } from '../../state/RostersContext';
import { Screen } from '../common/Screen';
import { getProfil } from '../../data/warbands';
import { STAT_KEYS } from '../../types/catalog';
import { STATUTS } from '../../types/roster';
import type { Statut } from '../../types/roster';
import { XpGrid } from './XpGrid';
import { CompetencesPanel } from './CompetencesPanel';
import { AvanceeModal } from './AvanceeModal';
import { BlessureGraveModal } from './BlessureGraveModal';
import { Modal } from '../common/Modal';
import { avancesDues } from '../../utils/xp';

const STATUT_BADGE: Record<string, string> = {
  actif: 'badge--success',
  hors_de_combat: 'badge--warning',
  mort: 'badge--danger',
  capture: 'badge--neutral',
};

export function PersonnageScreen() {
  const { id, instanceId } = useParams<{ id: string; instanceId: string }>();
  const navigate = useNavigate();
  const { getRosterById, updateRoster } = useRosters();
  const roster = getRosterById(id ?? '');
  const [modalAvancee, setModalAvancee] = useState(false);
  const [modalBlessure, setModalBlessure] = useState(false);
  const [modalSuppression, setModalSuppression] = useState(false);
  const [nouveauSort, setNouveauSort] = useState('');

  const membre = roster?.membres.find((m) => m.instance_id === instanceId);
  const profil = roster && membre ? getProfil(roster.bande_id, membre.profil_id) : undefined;

  if (!roster || !membre || !profil) {
    return (
      <Screen title="Personnage introuvable" back={id ? `/roster/${id}` : '/'}>
        <p className="text-muted">Ce personnage n'existe pas (ou plus).</p>
      </Screen>
    );
  }

  const majMembre = (partial: Partial<typeof membre>) => {
    const membresMaj = roster.membres.map((m) =>
      m.instance_id === membre.instance_id ? { ...m, ...partial } : m
    );
    updateRoster({ ...roster, membres: membresMaj });
  };

  const dues = avancesDues(profil.type, membre.xp);
  const obtenues = membre.historique_avancees.length;
  const enAttente = Math.max(0, dues - obtenues);

  const supprimerMembre = () => {
    updateRoster({ ...roster, membres: roster.membres.filter((m) => m.instance_id !== membre.instance_id) });
    navigate(`/roster/${roster.id}`);
  };

  return (
    <Screen title={membre.nom_perso} back={`/roster/${roster.id}`}>
      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="mt-0 mb-0">{membre.nom_perso}</h2>
            <p className="text-muted text-sm mb-0">
              {profil.nom} · {profil.type === 'heros' ? 'Héros' : 'Homme de main'}
            </p>
          </div>
          <span className={`badge ${STATUT_BADGE[membre.statut]}`}>
            {STATUTS.find((s) => s.id === membre.statut)?.label}
          </span>
        </div>

        <div className="status-select" style={{ marginTop: '0.7rem' }}>
          {STATUTS.map((s) => (
            <button
              key={s.id}
              className={`status-pill ${membre.statut === s.id ? 'status-pill--active' : ''}`}
              onClick={() => majMembre({ statut: s.id as Statut })}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Caractéristiques</h3>
        <div className="stat-grid">
          {STAT_KEYS.map((k) => (
            <div key={k} className="stat-grid__cell stat-grid__cell--label">
              {k}
            </div>
          ))}
          {STAT_KEYS.map((k) => (
            <div
              key={k}
              className={`stat-grid__cell stat-grid__cell--value ${
                profil.stats && membre.stats_actuels[k] !== profil.stats[k] ? 'stat-grid__cell--modified' : ''
              }`}
            >
              {k === 'PV' ? `${membre.pv_actuels}/${membre.stats_actuels[k]}` : membre.stats_actuels[k]}
            </div>
          ))}
        </div>
        <div className="flex gap-sm items-center" style={{ marginTop: '0.7rem' }}>
          <span className="text-sm text-muted">PV actuels :</span>
          <button
            className="btn btn--sm"
            onClick={() => majMembre({ pv_actuels: Math.max(0, membre.pv_actuels - 1) })}
          >
            −
          </button>
          <strong>{membre.pv_actuels}</strong>
          <button
            className="btn btn--sm"
            onClick={() => majMembre({ pv_actuels: Math.min(membre.stats_actuels.PV, membre.pv_actuels + 1) })}
          >
            +
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Équipement</h3>
        <textarea
          value={membre.equipement}
          onChange={(e) => majMembre({ equipement: e.target.value })}
          placeholder="Épée, armure légère, pistolet…"
          style={{
            width: '100%',
            background: 'var(--bg-inset)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '0.5rem 0.6rem',
            minHeight: '4em',
          }}
        />
        <div className="field" style={{ marginTop: '0.6rem', maxWidth: 200 }}>
          <label>Valeur équipement (po, pour le calcul de la valeur de bande)</label>
          <input
            type="number"
            value={membre.equipement_valeur}
            onChange={(e) => majMembre({ equipement_valeur: Number(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center">
          <h3 className="mt-0 mb-0">Expérience</h3>
          <span className="badge badge--info">{membre.xp} XP</span>
        </div>
        <XpGrid type={profil.type} xp={membre.xp} onChange={(xp) => majMembre({ xp })} />
        {enAttente > 0 && (
          <div className="flex justify-between items-center" style={{ marginTop: '0.7rem' }}>
            <span className="badge badge--warning">{enAttente} avancée(s) en attente</span>
            <button className="btn btn--sm btn--primary" onClick={() => setModalAvancee(true)}>
              Résoudre une avancée
            </button>
          </div>
        )}
        {membre.historique_avancees.length > 0 && (
          <div style={{ marginTop: '0.7rem' }}>
            <p className="text-sm text-muted mb-0">Historique des avancées :</p>
            {membre.historique_avancees.map((a) => (
              <p key={a.id} className="text-sm mb-0">
                {a.date} (jet {a.roll}) — {a.detail}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Compétences</h3>
        <CompetencesPanel
          member={membre}
          profil={profil}
          onToggleSkill={(skillId) => {
            const acquises = membre.competences_acquises.includes(skillId)
              ? membre.competences_acquises.filter((s) => s !== skillId)
              : [...membre.competences_acquises, skillId];
            majMembre({ competences_acquises: acquises });
          }}
        />
      </div>

      <div className="card">
        <h3>Sorts connus / mutations</h3>
        <div className="flex flex-wrap gap-sm" style={{ marginBottom: '0.6rem' }}>
          {membre.sorts_connus.map((s, i) => (
            <span key={i} className="badge badge--info">
              {s}
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', marginLeft: '0.3rem', padding: 0 }}
                onClick={() => majMembre({ sorts_connus: membre.sorts_connus.filter((_, j) => j !== i) })}
              >
                ✕
              </button>
            </span>
          ))}
          {membre.sorts_connus.length === 0 && <span className="text-muted text-sm">Aucun</span>}
        </div>
        <div className="flex gap-sm">
          <input
            value={nouveauSort}
            onChange={(e) => setNouveauSort(e.target.value)}
            placeholder="Ex : Boule de feu, Griffes acérées…"
            style={{
              flex: 1,
              background: 'var(--bg-inset)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '0.5rem 0.6rem',
            }}
          />
          <button
            className="btn"
            onClick={() => {
              if (!nouveauSort.trim()) return;
              majMembre({ sorts_connus: [...membre.sorts_connus, nouveauSort.trim()] });
              setNouveauSort('');
            }}
          >
            Ajouter
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center">
          <h3 className="mt-0 mb-0">Blessures graves</h3>
          <button className="btn btn--sm" onClick={() => setModalBlessure(true)}>
            + Enregistrer un résultat
          </button>
        </div>
        {membre.blessures_graves.length === 0 && <p className="text-muted text-sm">Aucune.</p>}
        {membre.blessures_graves.map((b) => (
          <p key={b.id} className="text-sm">
            {b.date} (jet {b.roll}) — <strong>{b.resultat}</strong> : {b.effet}
          </p>
        ))}
      </div>

      <div className="card">
        <h3>Notes</h3>
        <textarea
          value={membre.notes}
          onChange={(e) => majMembre({ notes: e.target.value })}
          style={{
            width: '100%',
            background: 'var(--bg-inset)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '0.5rem 0.6rem',
            minHeight: '3em',
          }}
        />
      </div>

      <button className="btn btn--danger btn--block" onClick={() => setModalSuppression(true)}>
        Retirer ce personnage de la bande
      </button>

      {modalAvancee && (
        <AvanceeModal
          member={membre}
          profil={profil}
          onClose={() => setModalAvancee(false)}
          onApply={(updated) => majMembre(updated)}
        />
      )}
      {modalBlessure && (
        <BlessureGraveModal
          member={membre}
          onClose={() => setModalBlessure(false)}
          onApply={(updated) => majMembre(updated)}
        />
      )}
      {modalSuppression && (
        <Modal onClose={() => setModalSuppression(false)}>
          <h3>Retirer {membre.nom_perso} ?</h3>
          <p className="text-muted">Cette action supprime définitivement ce personnage du roster.</p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setModalSuppression(false)}>
              Annuler
            </button>
            <button className="btn btn--danger" onClick={supprimerMembre}>
              Retirer
            </button>
          </div>
        </Modal>
      )}
    </Screen>
  );
}

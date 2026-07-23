import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { AjouterBatailleModal } from './AjouterBatailleModal';
import type { BattleRecord } from '../../types/roster';

type HistoriqueBataillesSectionProps = {
  historique: BattleRecord[];
  onAjouter: (bataille: BattleRecord) => void;
  onModifier: (bataille: BattleRecord) => void;
  onSupprimer: (id: string) => void;
};

export function HistoriqueBataillesSection({
  historique,
  onAjouter,
  onModifier,
  onSupprimer,
}: HistoriqueBataillesSectionProps) {
  const [modalAjout, setModalAjout] = useState(false);
  const [enEdition, setEnEdition] = useState<BattleRecord | null>(null);
  const [aSupprimer, setASupprimer] = useState<BattleRecord | null>(null);

  return (
    <div className="card">
      <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
        <h3 className="mt-0 mb-0">
          <Icon name="epee" style={{ marginRight: '0.35em' }} />
          Historique des batailles
        </h3>
        <button className="btn btn--sm btn--primary" onClick={() => setModalAjout(true)}>
          + Ajouter
        </button>
      </div>
      {historique.length === 0 && <p className="text-muted text-sm">Aucune bataille enregistrée.</p>}
      {historique
        .slice()
        .reverse()
        .map((b) => (
          <div
            key={b.id}
            className="list-item"
            role="button"
            style={{ marginBottom: '0.5rem' }}
            onClick={() => setEnEdition(b)}
          >
            <div className="list-item__main">
              <div className="list-item__title">
                {b.date} —{' '}
                <span
                  className={b.resultat === 'victoire' ? 'text-success' : b.resultat === 'defaite' ? 'text-danger' : ''}
                >
                  {b.resultat === 'victoire' && <Icon name="banniere" style={{ marginRight: '0.3em' }} />}
                  {b.resultat === 'defaite' && <Icon name="crane" style={{ marginRight: '0.3em' }} />}
                  {b.resultat}
                </span>
              </div>
              <div className="list-item__subtitle">
                {b.adversaires.length > 0 && `vs ${b.adversaires.join(', ')}`} {b.notes}
              </div>
            </div>
            <button
              className="btn--ghost"
              style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)' }}
              onClick={(e) => {
                e.stopPropagation();
                setASupprimer(b);
              }}
              title="Supprimer cette bataille"
            >
              ✕
            </button>
          </div>
        ))}

      {modalAjout && (
        <AjouterBatailleModal
          onClose={() => setModalAjout(false)}
          onConfirm={(bataille) => {
            onAjouter(bataille);
            setModalAjout(false);
          }}
        />
      )}
      {enEdition && (
        <AjouterBatailleModal
          bataille={enEdition}
          onClose={() => setEnEdition(null)}
          onConfirm={(bataille) => {
            onModifier(bataille);
            setEnEdition(null);
          }}
          onDelete={() => {
            onSupprimer(enEdition.id);
            setEnEdition(null);
          }}
        />
      )}
      {aSupprimer && (
        <Modal onClose={() => setASupprimer(null)}>
          <h3>Supprimer la bataille du {aSupprimer.date} ?</h3>
          <p className="text-muted">Cette action supprime définitivement cette entrée de l'historique.</p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setASupprimer(null)}>
              Annuler
            </button>
            <button
              className="btn btn--danger"
              onClick={() => {
                onSupprimer(aSupprimer.id);
                setASupprimer(null);
              }}
            >
              Supprimer
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

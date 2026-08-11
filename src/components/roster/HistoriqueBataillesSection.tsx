import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { AjouterBatailleModal } from './AjouterBatailleModal';
import type { BattleRecord } from '../../types/roster';
import { useLanguage } from '../../state/useLanguage';

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
  const { t } = useLanguage();
  const [modalAjout, setModalAjout] = useState(false);
  const [enEdition, setEnEdition] = useState<BattleRecord | null>(null);
  const [aSupprimer, setASupprimer] = useState<BattleRecord | null>(null);

  return (
    <>
    <CollapsibleCard
      preferenceKey="ui.roster.historique_batailles.ouvert"
      title={
        <>
          <Icon name="epee" style={{ marginRight: '0.35em' }} />
          {t('historique.title')}
        </>
      }
      actions={
        <button className="btn btn--sm btn--primary" onClick={() => setModalAjout(true)}>
          {t('historique.add')}
        </button>
      }
    >
      {historique.length === 0 && <p className="text-muted text-sm">{t('historique.empty')}</p>}
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
                  {t(`historique.resultLabel.${b.resultat}`)}
                </span>
              </div>
              <div className="list-item__subtitle">
                {b.adversaires.length > 0 && `${t('historique.vsPrefix')} ${b.adversaires.join(', ')}`} {b.notes}
              </div>
            </div>
            <button
              className="btn--ghost"
              style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--text-muted)' }}
              onClick={(e) => {
                e.stopPropagation();
                setEnEdition(b);
              }}
              title={t('historique.editTitle')}
            >
              <Icon name="crayon" size="0.9em" />
            </button>
            <button
              className="btn--ghost-danger"
              onClick={(e) => {
                e.stopPropagation();
                setASupprimer(b);
              }}
              title={t('historique.deleteTitle')}
            >
              ✕
            </button>
          </div>
        ))}
    </CollapsibleCard>

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
          <h3>
            {t('historique.deleteConfirmTitlePrefix')} {aSupprimer.date} ?
          </h3>
          <p className="text-muted">{t('historique.deleteConfirmBody')}</p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setASupprimer(null)}>
              {t('historique.cancel')}
            </button>
            <button
              className="btn btn--danger"
              onClick={() => {
                onSupprimer(aSupprimer.id);
                setASupprimer(null);
              }}
            >
              {t('historique.delete')}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

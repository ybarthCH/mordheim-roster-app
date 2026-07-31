import { Icon } from '../common/Icon';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { injuryLabel, nomCourtBlessure } from '../../utils/blessures';
import type { Member } from '../../types/roster';
import { useLanguage } from '../../state/useLanguage';

type BlessuresGravesCardProps = {
  membre: Member;
  onOpenAjout: () => void;
  onSupprimer: (id: string) => void;
};

export function BlessuresGravesCard({
  membre,
  onOpenAjout,
  onSupprimer,
}: BlessuresGravesCardProps) {
  const { t } = useLanguage();
  return (
    <CollapsibleCard
      preferenceKey="ui.personnage.blessures_graves.ouvert"
      title={
        <>
          <Icon name="goutte" style={{ marginRight: '0.35em' }} />
          {t('blessuresGravesCard.title')}
        </>
      }
      actions={
        <button className="btn btn--sm btn--primary" onClick={onOpenAjout}>
          {t('blessuresGravesCard.record')}
        </button>
      }
    >
      {membre.blessures_graves.length === 0 && <p className="text-muted text-sm">{t('blessuresGravesCard.none')}</p>}
      {membre.blessures_graves.map((b) => (
        <div key={b.id} className="list-item" style={{ alignItems: 'flex-start' }}>
          <div
            className="list-item__main"
            style={{ padding: 0, textAlign: 'left', color: 'inherit' }}
          >
            <div className="list-item__title">{nomCourtBlessure(b)}</div>
            <div className="list-item__subtitle" style={{ whiteSpace: 'pre-line' }}>
              {b.date} — {injuryLabel(b)}
            </div>
            <div className="flex flex-wrap gap-sm" style={{ marginTop: '0.35rem' }}>
              {(b.soignee || b.effets?.some((effet) => effet.traitee)) && (
                <span className="badge badge--success">{t('blessuresGravesCard.treated')}</span>
              )}
            </div>
          </div>
          <button
            className="btn--ghost"
            style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)', flexShrink: 0 }}
            onClick={() => onSupprimer(b.id)}
            title={t('blessuresGravesCard.removeTitle')}
          >
            ✕
          </button>
        </div>
      ))}
    </CollapsibleCard>
  );
}

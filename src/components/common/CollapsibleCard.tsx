import { useId, type ReactNode } from 'react';
import { usePersistentDisclosure } from '../../state/usePersistentDisclosure';
import { useLanguage } from '../../state/useLanguage';
import { Icon } from './Icon';

type Props = {
  title: ReactNode;
  preferenceKey: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  // Actions additionnelles affichées à côté du bouton de repli (ex : "+
  // Ajouter"), toujours visibles que le bloc soit replié ou non.
  actions?: ReactNode;
};

export function CollapsibleCard({
  title,
  preferenceKey,
  children,
  defaultOpen = true,
  className = 'card card--tight',
  actions,
}: Props) {
  const { open, toggle } = usePersistentDisclosure(preferenceKey, defaultOpen);
  const contenuId = useId();
  const { t } = useLanguage();

  return (
    <div className={className}>
      <div className="collapsible-card__header flex items-center justify-between gap-sm">
        <h3 className="mb-0">{title}</h3>
        <div className="flex items-center gap-sm">
          {actions}
          <button
            type="button"
            className={`collapse-btn ${open ? '' : 'collapse-btn--replie'}`}
            onClick={toggle}
            aria-expanded={open}
            aria-controls={contenuId}
            aria-label={open ? t('common.collapse') : t('common.expand')}
            title={open ? t('common.collapse') : t('common.expand')}
          >
            <Icon name="chevrons" size="1.1em" />
          </button>
        </div>
      </div>
      {open && (
        <div id={contenuId} style={{ marginTop: '0.6rem' }}>
          {children}
        </div>
      )}
    </div>
  );
}

import { useId, type ReactNode } from 'react';
import { usePersistentDisclosure } from '../../state/usePersistentDisclosure';

type Props = {
  title: ReactNode;
  preferenceKey: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function CollapsibleCard({
  title,
  preferenceKey,
  children,
  defaultOpen = true,
  className = 'card card--tight',
}: Props) {
  const { open, toggle } = usePersistentDisclosure(preferenceKey, defaultOpen);
  const contenuId = useId();

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-sm">
        <h3 className="mb-0">{title}</h3>
        <button className="btn btn--sm" onClick={toggle} aria-expanded={open} aria-controls={contenuId}>
          {open ? 'Replier' : 'Afficher'}
        </button>
      </div>
      {open && (
        <div id={contenuId} style={{ marginTop: '0.6rem' }}>
          {children}
        </div>
      )}
    </div>
  );
}

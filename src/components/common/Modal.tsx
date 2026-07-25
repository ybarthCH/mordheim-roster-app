import type { ReactNode } from 'react';

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
  variant?: 'sheet' | 'fullscreen';
};

export function Modal({ onClose, children, variant = 'sheet' }: ModalProps) {
  const fullscreen = variant === 'fullscreen';

  return (
    <div
      className={`modal-backdrop${fullscreen ? ' modal-backdrop--fullscreen' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal-sheet${fullscreen ? ' modal-sheet--fullscreen' : ''}`}>{children}</div>
    </div>
  );
}

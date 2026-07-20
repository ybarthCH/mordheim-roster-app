import type { ReactNode } from 'react';

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ onClose, children }: ModalProps) {
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-sheet">{children}</div>
    </div>
  );
}

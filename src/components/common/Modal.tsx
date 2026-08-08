import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
  variant?: 'sheet' | 'fullscreen';
};

export function Modal({ onClose, children, variant = 'sheet' }: ModalProps) {
  const fullscreen = variant === 'fullscreen';

  // Porté sur document.body plutôt que rendu en place : sinon, ouvert
  // depuis le volet gauche du mode deux-volets (voir .roster-split dans
  // index.css), la modale reste piégée dans la pile d'empilement de
  // .roster-split__list (position: sticky y ouvre son propre contexte
  // d'empilement) — malgré son position: fixed, elle se retrouve peinte
  // sous .roster-split__detail (sticky lui aussi, mais plus tard dans le
  // DOM) au lieu de recouvrir toute la page.
  return createPortal(
    <div
      className={`modal-backdrop${fullscreen ? ' modal-backdrop--fullscreen' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal-sheet${fullscreen ? ' modal-sheet--fullscreen' : ''}`}>{children}</div>
    </div>,
    document.body
  );
}

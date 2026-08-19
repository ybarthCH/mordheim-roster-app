import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
  variant?: 'sheet' | 'fullscreen';
};

const SELECTEUR_FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ onClose, children, variant = 'sheet' }: ModalProps) {
  const fullscreen = variant === 'fullscreen';
  const sheetRef = useRef<HTMLDivElement>(null);
  // Lu par le keydown handler plutôt que capturé dans les deps de l'effet
  // ci-dessous : la plupart des appelants passent une arrow function inline
  // (nouvelle référence à chaque rendu), ce qui redéclencherait l'effet — et
  // donc le vol de focus vers le premier élément — à chaque frappe dans un
  // champ de la modale si l'effet dépendait de `onClose` directement.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Échap pour fermer + piège à focus : sans ça, Tab fait sortir le focus
  // clavier de la modale vers la page derrière (masquée visuellement mais
  // toujours interactive), et un lecteur d'écran n'a aucun signal qu'une
  // boîte de dialogue vient de s'ouvrir (voir role="dialog" ci-dessous).
  // Deps vides : ne s'exécute qu'au montage, pas à chaque rendu.
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    // Focus initial sur le premier élément interactif de la modale plutôt
    // que de laisser le focus sur l'élément qui l'a ouverte (resterait
    // "derrière" visuellement tout en captant le clavier).
    const focusables = () => Array.from(sheet.querySelectorAll<HTMLElement>(SELECTEUR_FOCUSABLE));
    const premier = focusables()[0];
    (premier ?? sheet).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const elements = focusables();
      if (elements.length === 0) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      // Boucle Tab/Shift+Tab sur le dernier/premier élément plutôt que de
      // laisser le focus s'échapper de la modale.
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div
        ref={sheetRef}
        className={`modal-sheet${fullscreen ? ' modal-sheet--fullscreen' : ''}`}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

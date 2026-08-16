import { Fragment, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon, type IconName, type PackIconName } from './Icon';
import { useLanguage } from '../../state/useLanguage';

export type SettingsMenuItem = {
  key: string;
  icon: IconName | PackIconName;
  label: string;
  onClick: () => void;
  active?: boolean;
};

type Props = {
  // Éléments propres à l'écran courant (ex : deux volets/export sur
  // RosterScreen), ajoutés après l'entrée Réglages commune à tous les
  // écrans.
  extraItems?: SettingsMenuItem[];
};

// Menu déroulant unique remplaçant l'ancienne rangée de boutons-icônes
// séparés du bandeau (réglages, deux volets, exports...) — un seul
// déclencheur "roue crantée", panneau en pierre peinte du pack UI (même
// habillage que .card) façon parchemin déroulé.
export function SettingsMenu({ extraItems = [] }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Ferme le menu après toute navigation (ex : clic sur "Réglages").
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const items: SettingsMenuItem[] = [
    ...(location.pathname === '/reglages'
      ? []
      : [
          {
            key: 'reglages',
            icon: 'engrenagePack' as const,
            label: t('home.settings'),
            onClick: () => navigate('/reglages'),
          },
        ]),
    ...extraItems,
  ];

  return (
    <div className="settings-menu" ref={wrapRef}>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t('home.settings')}
        title={t('home.settings')}
      >
        <Icon name="engrenagePack" />
      </button>
      {open && (
        <div className="settings-menu__panel">
          <p className="settings-menu__title">{t('settingsMenu.title')}</p>
          <ul className="settings-menu__list">
            {items.map((item, i) => (
              <Fragment key={item.key}>
                <li>
                  <button
                    type="button"
                    className={`settings-menu__item${item.active ? ' settings-menu__item--active' : ''}`}
                    onClick={() => {
                      item.onClick();
                      setOpen(false);
                    }}
                  >
                    <span className="settings-menu__icon">
                      <Icon name={item.icon} />
                    </span>
                    <span className="settings-menu__text">{item.label}</span>
                  </button>
                </li>
                {i < items.length - 1 && <li className="settings-menu__divider" aria-hidden="true" />}
              </Fragment>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

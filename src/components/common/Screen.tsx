import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { Icon } from './Icon';
import { useLanguage } from '../../state/useLanguage';

type ScreenProps = {
  title: string;
  back?: boolean | string;
  actions?: ReactNode;
  children: ReactNode;
};

export function Screen({ title, back, actions, children }: ScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const headerRef = useRef<HTMLElement>(null);
  const handleBack = () => {
    if (typeof back === 'string') navigate(back);
    else navigate(-1);
  };

  // Hauteur réelle du bandeau exposée en variable CSS, pour que le mode deux
  // volets (RosterScreen) puisse caler ses colonnes défilables juste en
  // dessous plutôt que de deviner une hauteur fixe (le bandeau varie avec
  // l'encoche/safe-area et le nombre de boutons d'actions).
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const majHauteur = () => {
      document.documentElement.style.setProperty('--app-header-h', `${el.offsetHeight}px`);
    };
    majHauteur();
    const observer = new ResizeObserver(majHauteur);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header" ref={headerRef}>
        {back && (
          <button className="app-header__back" onClick={handleBack} aria-label={t('common.back')}>
            ‹
          </button>
        )}
        <div className="app-header__title">{title}</div>
        <LanguageToggle />
        {location.pathname !== '/reglages' && (
          <button
            type="button"
            className="icon-btn"
            onClick={() => navigate('/reglages')}
            aria-label={t('home.settings')}
            title={t('home.settings')}
          >
            <Icon name="engrenage" />
          </button>
        )}
        <ThemeToggle />
        {actions}
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

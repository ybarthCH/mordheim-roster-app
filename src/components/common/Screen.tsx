import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReferenceButton } from './ReferenceButton';
import { SettingsMenu, type SettingsMenuItem } from './SettingsMenu';
import { useLanguage } from '../../state/useLanguage';

type ScreenProps = {
  title: string;
  back?: boolean | string;
  // Appelé avant toute navigation déclenchée par le bouton retour du bandeau
  // (ex : confirmation de sortie d'un assistant en cours — voir
  // PostBatailleScreen). Renvoyer false annule la navigation ; omis, le
  // bouton retour navigue directement comme avant.
  onBeforeBack?: () => boolean;
  // Entrées propres à l'écran, ajoutées dans le menu Réglages du bandeau
  // (ex : deux volets/export JSON/export PDF sur RosterScreen) — voir
  // SettingsMenu.
  menuItems?: SettingsMenuItem[];
  // Lien vers la page de référence de la bande actuellement parcourue (voir
  // ReferenceButton/BandeReferenceScreen) — omis sur les écrans sans bande
  // en contexte (accueil, création, réglages...), le bouton n'est alors pas
  // rendu du tout plutôt que désactivé.
  referenceLink?: string;
  children: ReactNode;
};

export function Screen({ title, back, onBeforeBack, menuItems, referenceLink, children }: ScreenProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const headerRef = useRef<HTMLElement>(null);
  const handleBack = () => {
    if (onBeforeBack && !onBeforeBack()) return;
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
        <SettingsMenu extraItems={menuItems} />
        {referenceLink && <ReferenceButton to={referenceLink} />}
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

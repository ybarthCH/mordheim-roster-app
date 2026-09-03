import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  to: string;
};

// Remplace l'ancien bouton EN/FR du bandeau (déplacé dans le menu Réglages,
// voir SettingsMenu) : ouvre la page de référence de la bande actuellement
// parcourue (règles spéciales, équipement et magie de référence — voir
// BandeReferenceScreen). N'est rendu que par les écrans qui ont une bande en
// contexte (voir Screen.referenceLink) ; absent partout ailleurs (accueil,
// création, réglages...) plutôt que désactivé.
export function ReferenceButton({ to }: Props) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => navigate(to)}
      aria-label={t('bandeReference.buttonLabel')}
      title={t('bandeReference.buttonLabel')}
    >
      <Icon name="grimoireDorePack" />
    </button>
  );
}

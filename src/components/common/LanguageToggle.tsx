import { useLanguage } from '../../state/useLanguage';

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
      aria-label={t('common.language.ariaLabel')}
      title={t('common.language.title')}
    >
      {language === 'fr' ? '🇫🇷' : '🇬🇧'}
    </button>
  );
}

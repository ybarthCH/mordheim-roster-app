import { useLanguage } from '../../state/useLanguage';

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <button
      type="button"
      className="icon-btn"
      style={{ fontWeight: 700, letterSpacing: '0.02em' }}
      onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
      aria-label={t('common.language.ariaLabel')}
      title={t('common.language.title')}
    >
      {language === 'fr' ? 'FR' : 'EN'}
    </button>
  );
}

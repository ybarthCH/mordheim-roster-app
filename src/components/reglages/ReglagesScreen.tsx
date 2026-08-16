import { Screen } from '../common/Screen';
import { useGameRules } from '../../state/useGameRules';
import { useWakeLock } from '../../state/useWakeLock';
import { useLanguage } from '../../state/useLanguage';

export function ReglagesScreen() {
  const { rules, setRule } = useGameRules();
  const { actif: ecranActif, setActif: setEcranActif, supporte: ecranActifSupporte } = useWakeLock();
  const { t } = useLanguage();

  return (
    <Screen title={t('reglages.title')} back>
      <div className="card">
        <h3 className="mt-0">{t('reglages.appearance')}</h3>

        <label className="flex items-start gap-sm" style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={ecranActif}
            onChange={(e) => setEcranActif(e.target.checked)}
          />
          <span>
            <strong>{t('reglages.wakeLock.title')}</strong>
            <br />
            <span className="text-sm text-muted">
              {t('reglages.wakeLock.body')}
              {!ecranActifSupporte && t('reglages.wakeLock.unsupported')}
            </span>
          </span>
        </label>
      </div>

      <div className="card">
        <h3 className="mt-0">{t('reglages.optionalRules')}</h3>
        <p className="text-sm text-muted">{t('reglages.optionalRules.intro')}</p>

        <label className="flex items-start gap-sm" style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={rules.poudreNoireAvancee}
            onChange={(e) => setRule('poudreNoireAvancee', e.target.checked)}
          />
          <span>
            <strong>{t('reglages.poudreNoire.title')}</strong>
            <br />
            <span className="text-sm text-muted">{t('reglages.poudreNoire.body')}</span>
          </span>
        </label>

        <label className="flex items-start gap-sm" style={{ cursor: 'pointer', marginTop: '1rem' }}>
          <input
            type="checkbox"
            checked={rules.armuresLozheim}
            onChange={(e) => setRule('armuresLozheim', e.target.checked)}
          />
          <span>
            <strong>{t('reglages.lozheim.title')}</strong>
            <br />
            <span className="text-sm text-muted">{t('reglages.lozheim.body')}</span>
          </span>
        </label>

        <label className="flex items-start gap-sm" style={{ cursor: 'pointer', marginTop: '1rem' }}>
          <input
            type="checkbox"
            checked={rules.trinketsLimites}
            onChange={(e) => setRule('trinketsLimites', e.target.checked)}
          />
          <span>
            <strong>{t('reglages.trinkets.title')}</strong>
            <br />
            <span className="text-sm text-muted">{t('reglages.trinkets.body')}</span>
          </span>
        </label>

        <label className="flex items-start gap-sm" style={{ cursor: 'pointer', marginTop: '1rem' }}>
          <input
            type="checkbox"
            checked={rules.sawbonesDocteur}
            onChange={(e) => setRule('sawbonesDocteur', e.target.checked)}
          />
          <span>
            <strong>{t('reglages.sawbones.title')}</strong>
            <br />
            <span className="text-sm text-muted">{t('reglages.sawbones.body')}</span>
          </span>
        </label>

        <label className="flex items-start gap-sm" style={{ cursor: 'pointer', marginTop: '1rem' }}>
          <input
            type="checkbox"
            checked={rules.dramatisPersonae}
            onChange={(e) => setRule('dramatisPersonae', e.target.checked)}
          />
          <span>
            <strong>{t('reglages.dramatisPersonae.title')}</strong>
            <br />
            <span className="text-sm text-muted">{t('reglages.dramatisPersonae.body')}</span>
          </span>
        </label>

        <label className="flex items-start gap-sm" style={{ cursor: 'pointer', marginTop: '1rem' }}>
          <input
            type="checkbox"
            checked={rules.valeurPuissanceActivee}
            onChange={(e) => setRule('valeurPuissanceActivee', e.target.checked)}
          />
          <span>
            <strong>{t('reglages.powerValue.title')}</strong>
            <br />
            <span className="text-sm text-muted">{t('reglages.powerValue.body')}</span>
          </span>
        </label>
      </div>

      <div className="card">
        <h3 className="mt-0">{t('reglages.about')}</h3>
        <a href="/privacy" target="_blank" rel="noopener noreferrer">
          {t('reglages.privacyPolicy')}
        </a>
      </div>
    </Screen>
  );
}

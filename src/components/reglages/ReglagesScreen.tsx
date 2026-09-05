import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../common/Screen';
import { useTheme } from '../../state/useTheme';
import { useGameRules } from '../../state/useGameRules';
import { useWakeLock } from '../../state/useWakeLock';
import { useUpdateSW } from '../../state/useUpdateSW';
import { useLanguage } from '../../state/useLanguage';

const THEMES = [
  { value: 'light', key: 'reglages.theme.light' },
  { value: 'dark', key: 'reglages.theme.dark' },
  { value: 'system', key: 'reglages.theme.system' },
] as const;

export function ReglagesScreen() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { rules, setRule } = useGameRules();
  const { actif: ecranActif, setActif: setEcranActif, supporte: ecranActifSupporte } = useWakeLock();
  const { needRefresh, updateServiceWorker, checkForUpdate } = useUpdateSW();
  const { t } = useLanguage();

  // La vérification automatique (toutes les heures, voir UpdateSWContext)
  // peut faire attendre longtemps avant qu'une mise à jour tout juste
  // déployée soit détectée — ce bouton force une revérification immédiate
  // au lieu de laisser le temps faire son œuvre.
  const [verificationMaj, setVerificationMaj] = useState<'inactif' | 'en_cours' | 'a_jour'>('inactif');
  const verifierMaj = async () => {
    setVerificationMaj('en_cours');
    const resultat = await checkForUpdate();
    setVerificationMaj(resultat === 'update-found' ? 'inactif' : 'a_jour');
  };

  return (
    <Screen title={t('reglages.title')} back>
      <div className="card">
        <h3 className="mt-0">{t('reglages.appearance')}</h3>

        <div className="field">
          <label>{t('reglages.theme')}</label>
          <div className="status-select">
            {THEMES.map((th) => (
              <button
                key={th.value}
                type="button"
                className={`status-pill ${theme === th.value ? 'status-pill--active' : ''}`}
                onClick={() => setTheme(th.value)}
              >
                {t(th.key)}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-start gap-sm" style={{ cursor: 'pointer', marginTop: '1rem' }}>
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

        {/* Pourboire libre, pas un don vers une association : reversé à 100%
            au développeur, ne débloque aucune fonctionnalité — traité par
            Google Play comme un paiement pair-à-pair, donc pas soumis à sa
            billing (contrairement aux dons vers une structure, voir la
            politique Paiements de Google Play). Lien simple plutôt qu'un
            widget/script Ko-fi embarqué, cohérent avec le reste de l'app qui
            ne charge aucun script tiers au runtime. */}
        <p style={{ marginTop: '1rem', marginBottom: '0.3rem' }}>
          <a href="https://ko-fi.com/musterheim" target="_blank" rel="noopener noreferrer">
            {t('reglages.supportProject')}
          </a>
        </p>
        <p className="text-sm text-muted mb-0">{t('reglages.supportProjectBody')}</p>

        <div style={{ marginTop: '1rem' }}>
          {needRefresh ? (
            <div className="flex items-center justify-between gap-sm">
              <span className="text-sm">{t('updateToast.message')}</span>
              <button type="button" className="btn btn--primary btn--sm" onClick={() => updateServiceWorker()}>
                {t('updateToast.refresh')}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-sm">
              <button type="button" className="btn btn--sm" onClick={verifierMaj} disabled={verificationMaj === 'en_cours'}>
                {verificationMaj === 'en_cours' ? t('reglages.checkingUpdate') : t('reglages.checkUpdate')}
              </button>
              {verificationMaj === 'a_jour' && <span className="text-sm text-muted">{t('reglages.upToDate')}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Les réglages sont déjà enregistrés en direct à chaque changement —
          ce bouton n'enregistre rien de plus. Il existe purement pour
          rassurer l'utilisateur sur ce point et lui offrir un point de
          sortie explicite et cohérent avec le reste de l'app, plutôt que de
          devoir remonter jusqu'au petit chevron < de l'en-tête. */}
      <button
        type="button"
        className="btn--pack-pill-sm btn--pack-pill-sm--primary btn--block"
        onClick={() => navigate(-1)}
      >
        {t('reglages.saveAndBack')}
      </button>
    </Screen>
  );
}

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRosters } from '../../state/useRosters';
import { Screen } from '../common/Screen';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { bilanBatailles, effectifTotal, nomCatalogue } from '../../utils/bandeValue';
import { ratingTotal } from '../../utils/rating';
import { exporterRoster, lireFichierRoster } from '../../utils/importExport';
import type { RosterInstance } from '../../types/roster';
import { useLanguage } from '../../state/useLanguage';

// Code horaire compact (ex : "1847 CEST") sur le fuseau Europe/Paris —
// affiché à côté du hash de build pour repérer d'un coup d'œil un service
// worker resté sur un ancien cache : un déploiement qui vient de sortir a
// une heure de build proche de l'heure actuelle. CET/CEST distingués via le
// décalage horaire (Intl ne fournit pas l'abréviation directement).
function heureBuildCET(isoDate: string): string {
  const date = new Date(isoDate);
  const heure = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace(':', '');
  const decalage = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Paris',
    timeZoneName: 'shortOffset',
  })
    .formatToParts(date)
    .find((p) => p.type === 'timeZoneName')?.value;
  const fuseau = decalage === 'GMT+2' ? 'CEST' : 'CET';
  return `${heure} ${fuseau}`;
}

export function ListeBandesScreen() {
  const { rosters, loading, removeRoster, duplicateRoster, importRoster } = useRosters();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aSupprimer, setASupprimer] = useState<RosterInstance | null>(null);
  const [erreurImport, setErreurImport] = useState<string | null>(null);

  const winLabel = language === 'en' ? 'W' : 'V';
  const lossLabel = language === 'en' ? 'L' : 'D';
  const drawLabel = language === 'en' ? 'D' : 'N';

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const roster = await lireFichierRoster(file);
      const imported = await importRoster(roster);
      navigate(`/roster/${imported.id}`);
    } catch (err) {
      setErreurImport(err instanceof Error ? err.message : t('home.importFailed'));
    }
  };

  return (
    <Screen title={t('home.title')}>
      <div className="home-hero">
        <h1 className="home-hero__title">Musterheim</h1>
        <div className="home-hero__rule" />
        <p className="home-hero__subtitle">{t('home.subtitle')}</p>
      </div>

      <div className="top-actions">
        <button className="btn btn--primary" onClick={() => navigate('/creer')}>
          {t('home.newBand')}
        </button>
        <button className="btn" onClick={() => fileInputRef.current?.click()}>
          {t('home.importJson')}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>

      {erreurImport && (
        <div className="card" style={{ borderColor: 'var(--danger)' }}>
          <p className="text-danger mb-0">{erreurImport}</p>
        </div>
      )}

      {loading && <p className="text-muted">{t('home.loading')}</p>}

      {!loading && rosters.length === 0 && (
        <div className="empty-state">
          <Icon name="parchemin" size="2.4em" style={{ opacity: 0.5, marginBottom: '0.4rem' }} />
          <p>{t('home.emptyTitle')}</p>
          <p className="text-sm">{t('home.emptySubtitle')}</p>
        </div>
      )}

      {rosters.map((roster) => {
        const bilan = bilanBatailles(roster);
        return (
          <div key={roster.id} className="list-item" role="button" onClick={() => navigate(`/roster/${roster.id}`)}>
            <div className="list-item__main">
              <div className="list-item__title">{roster.nom_bande}</div>
              <div className="list-item__subtitle">
                {nomCatalogue(roster.bande_id, language)} · {effectifTotal(roster)} {t('home.members')} · Rating{' '}
                {ratingTotal(roster)}
              </div>
              <div className="list-item__subtitle">
                {bilan.total > 0
                  ? `${bilan.victoires}${winLabel} / ${bilan.defaites}${lossLabel} / ${bilan.nuls}${drawLabel}`
                  : t('home.noBattles')}
              </div>
            </div>
            <div className="flex flex-col gap-sm" onClick={(e) => e.stopPropagation()}>
              <button className="btn btn--sm" onClick={() => exporterRoster(roster)}>
                {t('home.export')}
              </button>
              <button className="btn btn--sm" onClick={() => duplicateRoster(roster.id)}>
                {t('home.duplicate')}
              </button>
              <button className="btn btn--sm btn--danger" onClick={() => setASupprimer(roster)}>
                {t('home.deleteShort')}
              </button>
            </div>
          </div>
        );
      })}

      {aSupprimer && (
        <Modal onClose={() => setASupprimer(null)}>
          <h3>
            {t('home.delete')} « {aSupprimer.nom_bande} » ?
          </h3>
          <p className="text-muted">{t('home.deleteConfirmBody')}</p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setASupprimer(null)}>
              {t('home.cancel')}
            </button>
            <button
              className="btn btn--danger"
              onClick={async () => {
                await removeRoster(aSupprimer.id);
                setASupprimer(null);
              }}
            >
              {t('home.delete')}
            </button>
          </div>
        </Modal>
      )}

      <p className="text-sm text-muted" style={{ textAlign: 'center', marginTop: '2rem' }}>
        {__APP_VERSION__} · {__APP_BUILD_DATE__.slice(0, 10)} · {heureBuildCET(__APP_BUILD_DATE__)}
      </p>
      <p className="text-sm text-muted" style={{ textAlign: 'center', marginTop: '0.4rem' }}>
        Musterheim saves your data locally on this device. Clearing your browser's site data may permanently delete
        your saved rosters. We strongly recommend exporting regular backups.
      </p>
      <p className="text-sm text-muted" style={{ textAlign: 'center', marginTop: '0.4rem' }}>
        This app is a free community project not associated with Games Workshop. All original content is
        Copyright 2026 Games Workshop.
      </p>
    </Screen>
  );
}

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRosters } from '../../state/useRosters';
import { Screen } from '../common/Screen';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { getCatalogue } from '../../data/warbands';
import { bilanBatailles, effectifTotal, nomCatalogue } from '../../utils/bandeValue';
import { ratingAffiche } from '../../utils/displayedRating';
import { exporterRoster, lireFichierRoster } from '../../utils/importExport';
import { useCardDragReorder } from '../../utils/useCardDragReorder';
import type { RosterInstance } from '../../types/roster';
import { useLanguage } from '../../state/useLanguage';
import { useGameRules } from '../../state/useGameRules';
import { useMediaQuery } from '../../state/useMediaQuery';

// Sur écran tactile, le glisser-déposer engagé n'importe où sur la carte
// entrait en conflit avec le scroll de la page (le doigt qui bouge fait à la
// fois défiler et glisser) — pénible à l'usage. `pointer: coarse` cible les
// écrans tactiles indépendamment de la largeur de fenêtre (contrairement aux
// media queries de largeur utilisées ailleurs dans ce fichier), ce qui est
// le bon signal ici : c'est le type de pointeur, pas la taille d'écran, qui
// cause le conflit. En dessous, le glisser ne s'engage plus que depuis une
// poignée dédiée (voir onHandlePointerDown), qui a touch-action: none.
const TACTILE_QUERY = '(pointer: coarse)';

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
  const { rosters, loading, removeRoster, duplicateRoster, importRoster, reorderRosters } = useRosters();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { rules } = useGameRules();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aSupprimer, setASupprimer] = useState<RosterInstance | null>(null);
  const [erreurImport, setErreurImport] = useState<string | null>(null);
  const { elements, refItem, onPointerDown, onHandlePointerDown, onCardClick, idEnCours, pointerPos } =
    useCardDragReorder(rosters, reorderRosters);
  const tactile = useMediaQuery(TACTILE_QUERY);

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
        <div className="home-hero__banner">
          <img src={`${import.meta.env.BASE_URL}decor/home-hero-banner.webp`} alt="Musterheim" className="home-hero__banner-img" />
        </div>
        <div className="home-hero__rule" />
      </div>

      <div className="roster-actions">
        <button className="btn btn--primary roster-actions__btn" onClick={() => navigate('/creer')}>
          {t('home.newBand')}
        </button>
        <button className="btn roster-actions__btn" onClick={() => fileInputRef.current?.click()}>
          {t('home.importJson')}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          // .json/application/json couvre l'export direct ; .txt/text/plain
          // couvre les rosters reçus via le partage natif (voir
          // partagerRoster dans utils/importExport.ts, qui étiquette
          // volontairement le même contenu JSON en .txt car les OS mobiles
          // rejettent le partage de fichiers application/json). Sans ces
          // deux derniers, le sélecteur de fichier peut filtrer le .txt
          // avant même que lireFichierRoster (qui ignore l'extension) n'ait
          // la main.
          accept="application/json,.json,text/plain,.txt"
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

      {elements.map((roster) => {
        const bilan = bilanBatailles(roster);
        const banniere = getCatalogue(roster.bande_id)?.banniere;
        return (
          <div
            key={roster.id}
            ref={refItem(roster.id)}
            className={`list-item list-item--bande${banniere ? ' list-item--with-banner' : ''}${idEnCours === roster.id ? ' list-item--fantome' : ''}${tactile ? ' list-item--tactile' : ''}`}
            role="button"
            onPointerDown={tactile ? undefined : onPointerDown(roster.id)}
            onClick={onCardClick(() => navigate(`/roster/${roster.id}`))}
            style={banniere ? { backgroundImage: `url(${import.meta.env.BASE_URL}${banniere})` } : undefined}
          >
            {tactile && (
              <span
                className="list-item--bande__poignee"
                onPointerDown={onHandlePointerDown(roster.id)}
                onClick={(e) => e.stopPropagation()}
                title={t('home.dragHandle')}
              >
                <Icon name="poigneeCartePack" size="1.5rem" />
              </span>
            )}
            <div className="list-item__row">
              <div className="list-item__main">
                <div className="list-item__title">{roster.nom_bande}</div>
                <div className="list-item__subtitle">{nomCatalogue(roster.bande_id, language)}</div>
                <div className="list-item__subtitle">
                  {effectifTotal(roster)} {t('home.members')}
                </div>
                <div className="list-item__subtitle">
                  {rules.valeurPuissanceActivee ? t('rosterSummary.powerValue') : t('rosterSummary.rating')}{' '}
                  {ratingAffiche(roster, rules)}
                </div>
                <div className="list-item__subtitle">
                  {bilan.total > 0
                    ? `${bilan.victoires}${winLabel} / ${bilan.defaites}${lossLabel} / ${bilan.nuls}${drawLabel}`
                    : t('home.noBattles')}
                </div>
              </div>
              <div className="list-item__actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn--pack-pill-sm" onClick={() => exporterRoster(roster)}>
                  {t('home.export')}
                </button>
                <button className="btn--pack-pill-sm" onClick={() => duplicateRoster(roster.id)}>
                  {t('home.duplicate')}
                </button>
                <button className="btn--ghost-danger" onClick={() => setASupprimer(roster)} title={t('home.deleteShort')}>
                  <Icon name="croixPack" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {idEnCours &&
        pointerPos &&
        (() => {
          const glissee = elements.find((r) => r.id === idEnCours);
          if (!glissee) return null;
          return (
            <div className="drag-ghost" style={{ left: pointerPos.x, top: pointerPos.y }}>
              <span className="drag-ghost__nom">{glissee.nom_bande}</span>
              <span className="drag-ghost__profil"> · {nomCatalogue(glissee.bande_id, language)}</span>
            </div>
          );
        })()}

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

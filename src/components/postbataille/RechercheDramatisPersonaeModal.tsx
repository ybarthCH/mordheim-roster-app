import { useState } from 'react';
import type { FrancTireurCatalog } from '../../types/hiredSword';
import type { Member } from '../../types/roster';
import { STAT_KEYS } from '../../types/catalog';
import { Modal } from '../common/Modal';
import { getDramatisPersonae } from '../../data/dramatisPersonae';
import { useLanguage } from '../../state/useLanguage';
import { libelleCaracteristique } from '../../utils/stats';

export type ResultatRechercheDramatisPersonae = {
  dramatisPersonaeId: string;
  nom: string;
  reussi: boolean;
  recrute: boolean;
  cout: number;
};

type Props = {
  membre: Member;
  dpDisponibles: FrancTireurCatalog[];
  tresorerieDisponible: number;
  onClose: () => void;
  onTerminer: (resultat: ResultatRechercheDramatisPersonae) => void;
};

export function RechercheDramatisPersonaeModal({
  membre,
  dpDisponibles,
  tresorerieDisponible,
  onClose,
  onTerminer,
}: Props) {
  const { t, language } = useLanguage();
  const [dpId, setDpId] = useState('');
  const [succesDeclare, setSuccesDeclare] = useState(false);

  const dp = dpDisponibles.find((candidat) => candidat.id === dpId) ?? null;
  const cout = dp?.recrutement.cout ?? 0;
  const budgetSuffisant = cout <= tresorerieDisponible;

  const choisir = (choisi: FrancTireurCatalog) => {
    setDpId(choisi.id);
    setSuccesDeclare(false);
  };

  const enregistrerEchec = () => {
    if (!dp) return;
    onTerminer({ dramatisPersonaeId: dp.id, nom: dp.nom, reussi: false, recrute: false, cout: 0 });
  };

  const nePasRecruter = () => {
    if (!dp) return;
    onTerminer({ dramatisPersonaeId: dp.id, nom: dp.nom, reussi: true, recrute: false, cout: 0 });
  };

  const recruter = () => {
    if (!dp || !budgetSuffisant) return;
    onTerminer({ dramatisPersonaeId: dp.id, nom: dp.nom, reussi: true, recrute: true, cout });
  };

  return (
    <Modal onClose={onClose} variant="fullscreen">
      <div className="achat-equipement">
        {!dp ? (
          <>
            <header className="achat-equipement__header">
              <div className="achat-equipement__header-ligne">
                <h3 className="mt-0 mb-0">{t('dpModal.title', { nom: membre.nom_perso })}</h3>
                <button className="btn btn--sm" aria-label={t('dpModal.close')} onClick={onClose}>
                  ✕
                </button>
              </div>
              <p className="text-sm text-muted mb-0" style={{ marginTop: '0.25rem' }}>
                {t('dpModal.intro')}
              </p>
            </header>
            <div className="achat-equipement__contenu">
              <div className="achat-equipement__catalogue">
                {dpDisponibles.length === 0 && (
                  <p className="text-muted">{t('dpModal.noneAvailable')}</p>
                )}
                {dpDisponibles.map((candidat) => (
                  <button
                    key={candidat.id}
                    type="button"
                    className="list-item achat-equipement__item"
                    onClick={() => choisir(candidat)}
                  >
                    <div className="list-item__main">
                      <div className="achat-equipement__item-titre">
                        <span className="list-item__title">{candidat.nom}</span>
                      </div>
                      <div className="list-item__subtitle">
                        {t('dpModal.recruitmentSubtitle', {
                          cout: candidat.recrutement.cout ?? candidat.recrutement.notation ?? '',
                          valeur: candidat.valeur,
                        })}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <header className="achat-equipement__header achat-equipement__header--selection">
              <div className="achat-equipement__header-ligne">
                <button className="btn btn--sm" onClick={() => setDpId('')}>
                  {t('dpModal.backToList')}
                </button>
                <button className="btn btn--sm" aria-label={t('dpModal.close')} onClick={onClose}>
                  ✕
                </button>
              </div>
              <div className="achat-equipement__selection-titre">
                <h3 className="mt-0 mb-0">{dp.nom}</h3>
              </div>
            </header>

            <div className="achat-equipement__contenu achat-equipement__detail">
              <p className="text-sm text-muted">{dp.employeurs.texte}</p>
              {dp.recrue_avec && (
                <p className="text-sm">
                  <strong>{t('dpModal.recruitedWith', { nom: getDramatisPersonae(dp.recrue_avec)?.nom ?? dp.recrue_avec })}</strong>{' '}
                  — {t('dpModal.recruitedWithNote')}
                </p>
              )}
              <div className="stat-grid">
                {STAT_KEYS.map((k) => (
                  <div key={k} className="stat-grid__cell stat-grid__cell--label">
                    {libelleCaracteristique(k, language)}
                  </div>
                ))}
                {STAT_KEYS.map((k) => (
                  <div key={k} className="stat-grid__cell stat-grid__cell--value">
                    {dp.stats[k]}
                  </div>
                ))}
              </div>
              <p className="text-sm">
                <strong>{t('dpModal.equipmentLabel')}</strong> {dp.equipement.join(', ')}
              </p>
              {dp.regles_speciales.map((regle) => (
                <p key={regle.nom} className="text-sm" style={{ whiteSpace: 'pre-line' }}>
                  <strong>{regle.nom}</strong> — {regle.texte}
                </p>
              ))}
              <p className="text-sm text-muted">{dp.entretien.texte}</p>

              {!succesDeclare && (
                <div className="flex gap-sm" style={{ marginTop: '0.4rem' }}>
                  <button type="button" className="btn btn--primary" onClick={() => setSuccesDeclare(true)}>
                    {t('dpModal.success')}
                  </button>
                  <button type="button" className="btn" onClick={enregistrerEchec}>
                    {t('dpModal.failure')}
                  </button>
                </div>
              )}

              {succesDeclare && (
                <>
                  <p className="text-sm">{t('dpModal.recruitmentCost', { cout })}</p>
                  <p className="text-sm text-muted">{t('dpModal.treasuryAvailable', { n: tresorerieDisponible })}</p>
                  {!budgetSuffisant && <p className="text-sm text-danger">{t('dpModal.insufficientTreasury')}</p>}
                </>
              )}
            </div>

            <footer className="achat-equipement__actions">
              <button className="btn" onClick={onClose}>{t('dpModal.cancel')}</button>
              {succesDeclare && (
                <>
                  <button className="btn" onClick={nePasRecruter}>
                    {t('dpModal.dontRecruit')}
                  </button>
                  <button className="btn btn--primary" disabled={!budgetSuffisant} onClick={recruter}>
                    {t('dpModal.recruitAndFinish')}
                  </button>
                </>
              )}
            </footer>
          </>
        )}
      </div>
    </Modal>
  );
}

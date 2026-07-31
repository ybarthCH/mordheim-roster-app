import { useEffect, useState } from 'react';
import { Icon } from '../common/Icon';
import type { IconName } from '../common/Icon';
import { STATUTS } from '../../types/roster';
import type { Member, Statut } from '../../types/roster';
import type { Profile } from '../../types/catalog';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../state/useLanguage';

const STATUT_BADGE: Record<string, string> = {
  actif: 'badge--success',
  hors_de_combat: 'badge--warning',
  mort: 'badge--danger',
  blesse: 'badge--neutral',
};

const STATUT_ICONE: Partial<Record<string, IconName>> = {
  hors_de_combat: 'ossements',
  mort: 'crane',
  blesse: 'goutte',
};

type StatutCardProps = {
  membre: Member;
  profil: Profile;
  rating: number;
  estGroupeSimplifie: boolean;
  onMajMembre: (partial: Partial<Member>) => void;
  // toursBlesse n'est renseigné que pour le statut "blesse" (voir dialog
  // ci-dessous) : nombre de tours (post-batailles) avant rétablissement.
  onChangerStatut: (s: Statut, toursBlesse?: number) => void;
  onOpenRecruterGroupe: () => void;
};

export function StatutCard({
  membre,
  profil,
  rating,
  estGroupeSimplifie,
  onMajMembre,
  onChangerStatut,
  onOpenRecruterGroupe,
}: StatutCardProps) {
  const { t } = useLanguage();
  const estFrancTireur = !!(membre.franc_tireur_id || membre.profil_custom);
  // Saisie gardée en texte brut : un input contrôlé par un number forcerait
  // la valeur dès l'effacement (impossible de vider le champ pour retaper un
  // chiffre) — la conversion/le plancher ne s'appliquent qu'à l'usage, la
  // valeur n'est répercutée sur le membre que si elle est valide.
  const [tailleGroupeSaisie, setTailleGroupeSaisie] = useState(String(membre.taille_groupe));
  // Resynchronise la saisie au changement de personnage ou lorsqu'une autre
  // action modifie la taille du groupe. Une valeur temporairement vide ne
  // modifie pas membre.taille_groupe et reste donc éditable jusqu'au blur.
  useEffect(() => {
    setTailleGroupeSaisie(String(membre.taille_groupe));
  }, [membre.instance_id, membre.taille_groupe]);

  const statutsDisponibles = estGroupeSimplifie ? STATUTS.filter((s) => s.id === 'actif' || s.id === 'mort') : STATUTS;

  // Passage au statut Blessé : demande le nombre de tours (post-batailles)
  // avant rétablissement plutôt que de laisser 0/0 à compléter à la main —
  // voir onChangerStatut('blesse', n) et le décompte automatique en
  // post-bataille (PostBatailleScreen.terminer).
  const [modalBlesseOuvert, setModalBlesseOuvert] = useState(false);
  const [toursSaisis, setToursSaisis] = useState('2');

  const cliquerStatut = (s: Statut) => {
    if (s === 'blesse' && membre.statut !== 'blesse') {
      setToursSaisis('2');
      setModalBlesseOuvert(true);
      return;
    }
    onChangerStatut(s);
  };

  const confirmerBlesse = () => {
    const n = Math.max(1, parseInt(toursSaisis, 10) || 1);
    onChangerStatut('blesse', n);
    setModalBlesseOuvert(false);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            value={membre.nom_perso}
            onChange={(e) => onMajMembre({ nom_perso: e.target.value })}
            className="input--heading"
          />
          <p className="text-muted text-sm mb-0">
            {profil.nom} ·{' '}
            {estFrancTireur
              ? t('statutCard.hiredSword')
              : profil.type === 'heros'
                ? t('statutCard.hero')
                : profil.type === 'animal'
                  ? t('statutCard.animal')
                  : t('statutCard.henchman')}
            {membre.promu_heros && t('statutCard.promoted')}
          </p>
        </div>
        <span className={`badge ${STATUT_BADGE[membre.statut]}`}>
          {STATUT_ICONE[membre.statut] && <Icon name={STATUT_ICONE[membre.statut]!} style={{ marginRight: '0.35em' }} />}
          {t(`statut.${membre.statut}`)}
          {membre.statut === 'mort' && membre.date_mort ? ` (${membre.date_mort})` : ''}
        </span>
      </div>

      <div className="status-select" style={{ marginTop: '0.7rem' }}>
        {statutsDisponibles.map((s) => (
          <button
            key={s.id}
            className={`status-pill ${membre.statut === s.id ? 'status-pill--active' : ''}`}
            onClick={() => cliquerStatut(s.id)}
          >
            {t(`statut.${s.id}`)}
          </button>
        ))}
      </div>

      {membre.statut === 'blesse' && (
        <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
          <span className="text-sm text-muted">{t('statutCard.injured')}</span>
          <input
            type="number"
            className="stat-grid__input stat-grid__input--pv"
            value={membre.blesse_tour_actuel}
            onChange={(e) => onMajMembre({ blesse_tour_actuel: Number(e.target.value) || 0 })}
          />
          <span>/</span>
          <input
            type="number"
            className="stat-grid__input stat-grid__input--pv"
            value={membre.blesse_tour_total}
            onChange={(e) => onMajMembre({ blesse_tour_total: Number(e.target.value) || 0 })}
          />
          <span className="text-sm text-muted">{t('statutCard.turns')}</span>
        </div>
      )}

      <div className="flex items-center gap-sm" style={{ marginTop: '0.7rem' }}>
        <span className="badge badge--info">{t('statutCard.rating')} {rating}</span>
      </div>

      {estGroupeSimplifie && (
        <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
          <span className="text-sm text-muted">{t('statutCard.group')}</span>
          <input
            type="number"
            min={1}
            className="stat-grid__input stat-grid__input--pv"
            value={tailleGroupeSaisie}
            onChange={(e) => {
              const raw = e.target.value;
              setTailleGroupeSaisie(raw);
              const n = parseInt(raw, 10);
              if (raw.trim() !== '' && n >= 1) onMajMembre({ taille_groupe: n });
            }}
            onBlur={() => setTailleGroupeSaisie(String(membre.taille_groupe))}
          />
          <span className="text-sm text-muted">
            {t('statutCard.model')}
            {membre.taille_groupe > 1 ? 's' : ''} {t('statutCard.identicalModels')}
            {membre.taille_groupe > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {estGroupeSimplifie && (
        <div style={{ marginTop: '0.6rem' }}>
          <button className="btn btn--sm" onClick={onOpenRecruterGroupe}>
            {t('statutCard.recruitInGroup')}
          </button>
        </div>
      )}

      {estGroupeSimplifie && (
        <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
          <span className="text-sm text-muted">{t('statutCard.outOfAction')}</span>
          <button className="btn btn--sm" onClick={() => onMajMembre({ hors_combat: Math.max(0, membre.hors_combat - 1) })}>
            −
          </button>
          <strong>
            {membre.hors_combat} / {membre.taille_groupe}
          </strong>
          <button
            className="btn btn--sm"
            onClick={() => onMajMembre({ hors_combat: Math.min(membre.taille_groupe, membre.hors_combat + 1) })}
          >
            +
          </button>
          {membre.hors_combat > 0 && <span className="text-sm text-muted">{t('statutCard.toResolveNextPostBattle')}</span>}
        </div>
      )}

      {modalBlesseOuvert && (
        <Modal onClose={() => setModalBlesseOuvert(false)}>
          <h3>{t('statutCard.injuredModalTitle')}</h3>
          <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
            {t('statutCard.injuredModalBody')}
          </p>
          <div className="field">
            <label>{t('statutCard.turnsInjuredLabel')}</label>
            <input
              type="number"
              min={1}
              value={toursSaisis}
              onChange={(e) => setToursSaisis(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setModalBlesseOuvert(false)}>
              {t('statutCard.cancel')}
            </button>
            <button className="btn btn--primary" onClick={confirmerBlesse}>
              {t('statutCard.confirm')}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

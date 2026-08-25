import { useState } from 'react';
import type { Member, RosterInstance } from '../../types/roster';
import type { Profile, WarbandCatalog } from '../../types/catalog';
import { sortsDisponiblesPourRoster } from '../../utils/magie';
import { magieMineure } from '../../i18n/data/minorMagic';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  roster: RosterInstance;
  membre: Member;
  profil: Profile;
  catalogue: WarbandCatalog;
  onClose: () => void;
  onConfirm: (sortId: string) => void;
};

// Upgrade payant "Option Sorcier" propre à certains profils (voir
// Profile.option_sorcier, ex : l'Ombre de la Jungle des Pillards de Lustrie,
// Town Cryer #14 / Lustrian Reavers v1.2) : le domaine de sorts n'existe pas
// encore sur `profil` tant que le paiement n'est pas confirmé (voir
// resolveProfil), donc synthétisé ici juste pour proposer la liste de Magie
// mineure — même mécanisme de choix que le premier sort d'un sorcier normal
// au recrutement (voir AjouterMembreModal) ou une avancée "nouveau sort"
// (voir AvanceeModal), mais déclenchable à tout moment de la campagne.
export function OptionSorcierModal({ roster, membre, profil, catalogue, onClose, onConfirm }: Props) {
  const { t, language } = useLanguage();
  const [sortChoisi, setSortChoisi] = useState('');
  const cout = profil.option_sorcier?.cout ?? 0;
  const budgetSuffisant = cout <= roster.tresorerie;
  const sorts = sortsDisponiblesPourRoster(
    catalogue,
    roster,
    membre.sorts_connus,
    { ...profil, peut_lancer_sorts: true, categorie_magie: 'magie_mineure' },
    membre.marque,
    magieMineure(language)
  );

  const confirmer = () => {
    if (!sortChoisi || !budgetSuffisant) return;
    onConfirm(sortChoisi);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="mt-0">{t('optionSorcier.title')}</h3>
      <p className="text-sm text-muted">{t('optionSorcier.body', { cout })}</p>
      <div className="field">
        <label>{t('optionSorcier.spellLabel')}</label>
        {sorts.map((s) => (
          <label
            key={s.id}
            className="flex items-start gap-sm"
            style={{ marginTop: '0.5rem', cursor: 'pointer' }}
          >
            <input
              type="radio"
              name="option-sorcier-sort"
              checked={sortChoisi === s.id}
              onChange={() => setSortChoisi(s.id)}
            />
            <span className="text-sm">
              <strong>
                {s.resultat} — {s.nom}
              </strong>
              <br />
              <span className="text-muted">
                ({t('magieConnue.diffAbbrev')} {s.difficulte}) : {s.texte}
              </span>
            </span>
          </label>
        ))}
      </div>
      {!budgetSuffisant && (
        <p className="text-danger text-sm">
          {t('optionSorcier.insufficientTreasury', { disponible: roster.tresorerie, requis: cout })}
        </p>
      )}
      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onClose}>
          {t('optionSorcier.cancel')}
        </button>
        <button className="btn btn--primary" disabled={!sortChoisi || !budgetSuffisant} onClick={confirmer}>
          {t('optionSorcier.confirm', { cout })}
        </button>
      </div>
    </Modal>
  );
}

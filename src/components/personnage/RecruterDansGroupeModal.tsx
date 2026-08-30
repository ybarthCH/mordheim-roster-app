import { useState } from 'react';
import type { Member, RosterInstance } from '../../types/roster';
import { calculerCoutRejoindreGroupe, rejoindreGroupe, groupeDupliqueraitObjetLimite } from '../../utils/shop';
import { useGameRules } from '../../state/useGameRules';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  roster: RosterInstance;
  groupe: Member;
  coutUnitaire: number;
  onClose: () => void;
  onConfirm: (roster: RosterInstance) => void;
};

// Raccourci pour recruter directement de nouvelles figurines dans ce groupe
// depuis sa propre fiche, sans repasser par le recrutement global du roster.
export function RecruterDansGroupeModal({ roster, groupe, coutUnitaire, onClose, onConfirm }: Props) {
  const { rules } = useGameRules();
  const { t } = useLanguage();
  // Saisie gardée en texte brut : un input contrôlé par un number forcerait
  // la valeur dès l'effacement (impossible de vider le champ pour retaper
  // un chiffre) — le plancher ne s'applique qu'à l'usage.
  const [quantiteSaisie, setQuantiteSaisie] = useState('1');
  const quantite = Math.max(1, parseInt(quantiteSaisie, 10) || 1);

  const cout = calculerCoutRejoindreGroupe(groupe, coutUnitaire, quantite);
  const budgetSuffisant = cout.coutTotal <= roster.tresorerie;
  const dupliqueraitTrinket = groupeDupliqueraitObjetLimite(groupe, rules);

  const confirmer = () => {
    if (dupliqueraitTrinket) return;
    onConfirm(rejoindreGroupe(roster, groupe, quantite, cout.coutTotal));
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h3>
        {t('recruterDansGroupe.titlePrefix')} « {groupe.nom_perso} »
      </h3>
      <div className="field">
        <label>{t('recruterDansGroupe.figurineCount')}</label>
        <input type="number" min={1} value={quantiteSaisie} onChange={(e) => setQuantiteSaisie(e.target.value)} />
      </div>
      <div className="card card--tight" style={{ margin: '0.6rem 0' }}>
        <p className="text-sm text-muted mb-0">
          {t('recruterDansGroupe.groupHasXpPrefix')} {cout.xpGroupe} {t('recruterDansGroupe.eachModelCosts')} {coutUnitaire} {t('creation.gc')}
          {cout.xpGroupe > 0 && ` + ${cout.surtaxeXpUnitaire} ${t('creation.gc')} ${t('recruterDansGroupe.plusSurtax')}`}, {t('recruterDansGroupe.equipEquallyNote')}
        </p>
        {groupe.inventaire.length > 0 && (
          <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
            {t('recruterDansGroupe.forcedEquipmentPrefix')} {[...new Set(groupe.inventaire.map((e) => e.nom))].join(', ')} (
            {cout.coutEquipementForce} {t('recruterDansGroupe.totalForPrefix')} {quantite} {t('recruterDansGroupe.model')}
            {quantite > 1 ? 's' : ''}).
          </p>
        )}
        {cout.xpGroupe > 0 && (
          <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
            {t('recruterDansGroupe.vetPointsIndicative', { points: cout.vetPointsIndicatifs })}
          </p>
        )}
        {dupliqueraitTrinket && (
          <p className="text-danger text-sm">{t('recruterDansGroupe.trinketBlocked')}</p>
        )}
      </div>
      {!budgetSuffisant && (
        <p className="text-danger text-sm">
          {t('recruterDansGroupe.insufficientTreasury', { disponible: roster.tresorerie, requis: cout.coutTotal })}
        </p>
      )}
      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onClose}>
          {t('recruterDansGroupe.cancel')}
        </button>
        <button className="btn btn--primary" disabled={dupliqueraitTrinket} onClick={confirmer}>
          {t('recruterDansGroupe.recruitForPrefix')} {cout.coutTotal} {t('creation.gc')}
          {!budgetSuffisant ? ` ${t('creation.modal.anyway')}` : ''}
        </button>
      </div>
    </Modal>
  );
}

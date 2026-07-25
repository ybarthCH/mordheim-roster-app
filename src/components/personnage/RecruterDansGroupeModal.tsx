import { useState } from 'react';
import type { Member, RosterInstance } from '../../types/roster';
import { calculerCoutRejoindreGroupe, rejoindreGroupe, TRINKETS_LIMITES } from '../../utils/shop';
import { useGameRules } from '../../state/useGameRules';
import { Modal } from '../common/Modal';

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
  // Saisie gardée en texte brut : un input contrôlé par un number forcerait
  // la valeur dès l'effacement (impossible de vider le champ pour retaper
  // un chiffre) — le plancher ne s'applique qu'à l'usage.
  const [quantiteSaisie, setQuantiteSaisie] = useState('1');
  const quantite = Math.max(1, parseInt(quantiteSaisie, 10) || 1);

  const cout = calculerCoutRejoindreGroupe(groupe, coutUnitaire, quantite);
  const budgetSuffisant = cout.coutTotal <= roster.tresorerie;
  const dupliqueraitTrinket =
    rules.trinketsLimites && groupe.inventaire.some((entree) => TRINKETS_LIMITES.has(entree.item_id));

  const confirmer = () => {
    if (dupliqueraitTrinket) return;
    onConfirm(rejoindreGroupe(roster, groupe, quantite, cout.coutTotal));
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h3>Recruter dans « {groupe.nom_perso} »</h3>
      <div className="field">
        <label>Nombre de figurines rejoignant le groupe</label>
        <input type="number" min={1} value={quantiteSaisie} onChange={(e) => setQuantiteSaisie(e.target.value)} />
      </div>
      <div className="card card--tight" style={{ margin: '0.6rem 0' }}>
        <p className="text-sm text-muted mb-0">
          Le groupe a {cout.xpGroupe} XP : chaque nouvelle figurine coûte {coutUnitaire} po
          {cout.xpGroupe > 0 && ` + ${cout.surtaxeXpUnitaire} po (2 × XP du groupe)`}, et doit être équipée à
          l'identique du reste du groupe.
        </p>
        {groupe.inventaire.length > 0 && (
          <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
            Équipement forcé : {[...new Set(groupe.inventaire.map((e) => e.nom))].join(', ')} (
            {cout.coutEquipementForce} po au total pour {quantite} figurine{quantite > 1 ? 's' : ''}).
          </p>
        )}
        {cout.xpGroupe > 0 && (
          <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
            Coût indicatif en points vétéran : {cout.vetPointsIndicatifs} (non contrôlé — libre à toi de recruter
            même sans les points suffisants).
          </p>
        )}
        {dupliqueraitTrinket && (
          <p className="text-danger text-sm">
            Recrutement bloqué : l'équipement du groupe contient un objet limité à un exemplaire par bande et serait
            automatiquement dupliqué.
          </p>
        )}
      </div>
      {!budgetSuffisant && (
        <p className="text-danger text-sm">
          Trésorerie insuffisante ({roster.tresorerie} po disponibles, {cout.coutTotal} po requis).
        </p>
      )}
      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onClose}>
          Annuler
        </button>
        <button className="btn btn--primary" disabled={dupliqueraitTrinket} onClick={confirmer}>
          Recruter pour {cout.coutTotal} po{!budgetSuffisant ? ' quand même' : ''}
        </button>
      </div>
    </Modal>
  );
}

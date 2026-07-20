import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Member, SeriousInjuryRecord } from '../../types/roster';
import { Modal } from '../common/Modal';
import { BLESSURES_GRAVES } from '../../data/gameData';

type Props = {
  member: Member;
  onClose: () => void;
  onApply: (member: Member) => void;
};

export function BlessureGraveModal({ member, onClose, onApply }: Props) {
  const [index, setIndex] = useState('');
  const [applique, setApplique] = useState(false);

  const resultat = index !== '' ? BLESSURES_GRAVES[Number(index)] : null;

  const appliquer = () => {
    if (!resultat) return;
    const record: SeriousInjuryRecord = {
      id: uuidv4(),
      date: new Date().toISOString().slice(0, 10),
      roll: resultat.min,
      resultat: resultat.resultat,
      effet: resultat.effet,
    };
    let updated: Member = {
      ...member,
      blessures_graves: [...member.blessures_graves, record],
    };
    if (resultat.mort) {
      updated = { ...updated, statut: 'mort' };
    } else if (resultat.modificateur) {
      const { stat, delta } = resultat.modificateur;
      updated = {
        ...updated,
        stats_actuels: { ...updated.stats_actuels, [stat]: Math.max(0, updated.stats_actuels[stat] + delta) },
      };
    }
    onApply(updated);
    setApplique(true);
  };

  return (
    <Modal onClose={onClose}>
      <h3>Blessure grave — {member.nom_perso}</h3>
      {!applique && (
        <>
          <p className="text-muted text-sm">
            Lance 2D6 sur ta table papier, puis choisis le résultat obtenu ci-dessous.
          </p>
          <div className="field">
            <label>Résultat du jet (2D6)</label>
            <select value={index} onChange={(e) => setIndex(e.target.value)}>
              <option value="">— Choisir le résultat obtenu —</option>
              {BLESSURES_GRAVES.map((entry, i) => (
                <option key={i} value={i}>
                  {entry.min} — {entry.resultat}
                </option>
              ))}
            </select>
          </div>
          {resultat && <p className="text-sm text-muted">{resultat.effet}</p>}
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={onClose}>
              Annuler
            </button>
            <button className="btn btn--primary" disabled={!resultat} onClick={appliquer}>
              Appliquer
            </button>
          </div>
        </>
      )}
      {applique && (
        <>
          <p className="text-success">Blessure appliquée et enregistrée dans l'historique.</p>
          <button className="btn btn--primary btn--block" onClick={onClose}>
            Fermer
          </button>
        </>
      )}
    </Modal>
  );
}

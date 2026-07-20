import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Member, SeriousInjuryRecord } from '../../types/roster';
import { Modal } from '../common/Modal';

type Props = {
  member: Member;
  onClose: () => void;
  onApply: (member: Member) => void;
};

export function BlessureGraveModal({ member, onClose, onApply }: Props) {
  const [description, setDescription] = useState('');
  const [applique, setApplique] = useState(false);

  const appliquer = () => {
    if (!description.trim()) return;
    const record: SeriousInjuryRecord = {
      id: uuidv4(),
      date: new Date().toISOString().slice(0, 10),
      description: description.trim(),
    };
    onApply({ ...member, blessures_graves: [...member.blessures_graves, record] });
    setApplique(true);
  };

  return (
    <Modal onClose={onClose}>
      <h3>Blessure grave — {member.nom_perso}</h3>
      {!applique && (
        <>
          <p className="text-muted text-sm">
            Lance sur ta table papier (table complète, pas seulement la table de base), puis note le résultat
            obtenu. Si la blessure modifie une caractéristique ou fait perdre un objet, pense à les modifier
            directement sur la fiche du personnage juste après.
          </p>
          <div className="field">
            <label>Résultat obtenu</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex : Jambe estropiée (-1 M définitif)"
              style={{
                width: '100%',
                background: 'var(--bg-inset)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '0.5rem 0.6rem',
                minHeight: '4em',
              }}
            />
          </div>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={onClose}>
              Annuler
            </button>
            <button className="btn btn--primary" disabled={!description.trim()} onClick={appliquer}>
              Appliquer
            </button>
          </div>
        </>
      )}
      {applique && (
        <>
          <p className="text-success">Blessure enregistrée dans l'historique.</p>
          <button className="btn btn--primary btn--block" onClick={onClose}>
            Fermer
          </button>
        </>
      )}
    </Modal>
  );
}

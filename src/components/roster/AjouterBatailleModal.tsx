import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { BattleRecord } from '../../types/roster';
import { Modal } from '../common/Modal';

type Props = {
  onClose: () => void;
  onConfirm: (bataille: BattleRecord) => void;
};

export function AjouterBatailleModal({ onClose, onConfirm }: Props) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [resultat, setResultat] = useState<BattleRecord['resultat']>('victoire');
  const [adversaire, setAdversaire] = useState('');
  const [notes, setNotes] = useState('');

  const confirmer = () => {
    onConfirm({ id: uuidv4(), date, resultat, adversaire: adversaire.trim(), notes: notes.trim() });
  };

  return (
    <Modal onClose={onClose}>
      <h3>Nouvelle bataille</h3>
      <div className="field-row">
        <div className="field">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label>Résultat</label>
          <select value={resultat} onChange={(e) => setResultat(e.target.value as BattleRecord['resultat'])}>
            <option value="victoire">Victoire</option>
            <option value="defaite">Défaite</option>
            <option value="nul">Match nul</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>Adversaire</label>
        <input value={adversaire} onChange={(e) => setAdversaire(e.target.value)} placeholder="Nom de la bande adverse" />
      </div>
      <div className="field">
        <label>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onClose}>
          Annuler
        </button>
        <button className="btn btn--primary" onClick={confirmer}>
          Ajouter
        </button>
      </div>
    </Modal>
  );
}

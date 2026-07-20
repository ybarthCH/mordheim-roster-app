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
  const [adversaires, setAdversaires] = useState<string[]>([]);
  const [nouvelAdversaire, setNouvelAdversaire] = useState('');
  const [notes, setNotes] = useState('');

  const ajouterAdversaire = () => {
    const nom = nouvelAdversaire.trim();
    if (!nom || adversaires.includes(nom)) return;
    setAdversaires((prev) => [...prev, nom]);
    setNouvelAdversaire('');
  };

  const confirmer = () => {
    onConfirm({ id: uuidv4(), date, resultat, adversaires, notes: notes.trim() });
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
        <label>Bande(s) adverse(s)</label>
        <div className="flex flex-wrap gap-sm" style={{ marginBottom: '0.4rem' }}>
          {adversaires.map((nom, i) => (
            <span key={i} className="badge badge--info">
              {nom}
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', marginLeft: '0.3rem', padding: 0 }}
                onClick={() => setAdversaires((prev) => prev.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            </span>
          ))}
          {adversaires.length === 0 && <span className="text-muted text-sm">Aucune</span>}
        </div>
        <div className="flex gap-sm">
          <input
            value={nouvelAdversaire}
            onChange={(e) => setNouvelAdversaire(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                ajouterAdversaire();
              }
            }}
            placeholder="Nom d'une bande adverse"
          />
          <button className="btn" onClick={ajouterAdversaire}>
            Ajouter
          </button>
        </div>
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

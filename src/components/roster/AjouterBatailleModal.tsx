import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { BattleRecord } from '../../types/roster';
import { Modal } from '../common/Modal';

type Props = {
  bataille?: BattleRecord;
  onClose: () => void;
  onConfirm: (bataille: BattleRecord) => void;
  onDelete?: () => void;
};

export function AjouterBatailleModal({ bataille, onClose, onConfirm, onDelete }: Props) {
  const [date, setDate] = useState(() => bataille?.date ?? new Date().toISOString().slice(0, 10));
  const [resultat, setResultat] = useState<BattleRecord['resultat']>(bataille?.resultat ?? 'victoire');
  const [adversaires, setAdversaires] = useState<string[]>(bataille?.adversaires ?? []);
  const [nouvelAdversaire, setNouvelAdversaire] = useState('');
  const [notes, setNotes] = useState(bataille?.notes ?? '');

  const ajouterAdversaire = () => {
    const nom = nouvelAdversaire.trim();
    if (!nom || adversaires.includes(nom)) return;
    setAdversaires((prev) => [...prev, nom]);
    setNouvelAdversaire('');
  };

  const confirmer = () => {
    onConfirm({ id: bataille?.id ?? uuidv4(), date, resultat, adversaires, notes: notes.trim() });
  };

  return (
    <Modal onClose={onClose}>
      <h3>{bataille ? 'Modifier la bataille' : 'Nouvelle bataille'}</h3>
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

      {bataille?.journal && (
        <div className="card card--tight" style={{ marginBottom: '0.7rem' }}>
          <p className="text-sm mb-0">
            <strong>Journal de l'assistant post-bataille</strong>
          </p>
          <p className="text-sm mb-0" style={{ marginTop: '0.4rem' }}>
            Wyrdstone trouvé : {bataille.journal.wyrdstoneTrouve} · Vendu : {bataille.journal.quantiteVendue} pour{' '}
            {bataille.journal.prixVente} po
          </p>
          {bataille.journal.notesExploration && (
            <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              Exploration : {bataille.journal.notesExploration}
            </p>
          )}
          {bataille.journal.soldeFrancsTireurs > 0 && (
            <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              Solde des francs-tireurs payée : {bataille.journal.soldeFrancsTireurs} po
            </p>
          )}
          {bataille.journal.blessures.length > 0 && (
            <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              <strong>Blessures graves :</strong>{' '}
              {bataille.journal.blessures.map((b) => `${b.nom} — ${b.description}`).join(' · ')}
            </p>
          )}
          {bataille.journal.survie.length > 0 && (
            <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              <strong>Survie :</strong>{' '}
              {bataille.journal.survie.map((s) => `${s.nom} (${s.survecu ? 'a survécu' : "n'a pas survécu"})`).join(', ')}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onClose}>
          Annuler
        </button>
        {onDelete && (
          <button className="btn btn--danger" onClick={onDelete}>
            Supprimer
          </button>
        )}
        <button className="btn btn--primary" onClick={confirmer}>
          {bataille ? 'Enregistrer' : 'Ajouter'}
        </button>
      </div>
    </Modal>
  );
}

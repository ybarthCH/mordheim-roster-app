import type { BattleRecord } from '../../types/roster';

type EtapeResultatProps = {
  date: string;
  onDateChange: (v: string) => void;
  resultat: BattleRecord['resultat'];
  onResultatChange: (v: BattleRecord['resultat']) => void;
  adversaires: string[];
  onAdversairesChange: (v: string[]) => void;
  nouvelAdversaire: string;
  onNouvelAdversaireChange: (v: string) => void;
  notesBataille: string;
  onNotesBatailleChange: (v: string) => void;
};

export function EtapeResultat({
  date,
  onDateChange,
  resultat,
  onResultatChange,
  adversaires,
  onAdversairesChange,
  nouvelAdversaire,
  onNouvelAdversaireChange,
  notesBataille,
  onNotesBatailleChange,
}: EtapeResultatProps) {
  const ajouterAdversaire = () => {
    const nom = nouvelAdversaire.trim();
    if (!nom || adversaires.includes(nom)) return;
    onAdversairesChange([...adversaires, nom]);
    onNouvelAdversaireChange('');
  };

  return (
    <div className="card">
      <h3>Résultat de la bataille</h3>
      <div className="field-row">
        <div className="field">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />
        </div>
        <div className="field">
          <label>Résultat</label>
          <select value={resultat} onChange={(e) => onResultatChange(e.target.value as BattleRecord['resultat'])}>
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
                onClick={() => onAdversairesChange(adversaires.filter((_, j) => j !== i))}
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
            onChange={(e) => onNouvelAdversaireChange(e.target.value)}
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
        <textarea value={notesBataille} onChange={(e) => onNotesBatailleChange(e.target.value)} />
      </div>
    </div>
  );
}

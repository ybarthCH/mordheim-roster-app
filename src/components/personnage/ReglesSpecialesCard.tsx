import { useState } from 'react';
import { Icon } from '../common/Icon';
import type { Member } from '../../types/roster';

type ReglesSpecialesCardProps = {
  membre: Member;
  onMajMembre: (partial: Partial<Member>) => void;
};

// Notes libres pour toute règle spéciale gagnée en jeu — les mutations sont
// désormais appliquées automatiquement à l'achat (stats_delta) et les sorts
// ont leur propre carte (voir MagieConnueCard), ce champ ne sert donc plus
// qu'à ce qui ne rentre dans aucune des deux.
export function ReglesSpecialesCard({ membre, onMajMembre }: ReglesSpecialesCardProps) {
  const [nouvelleNote, setNouvelleNote] = useState('');

  return (
    <div className="card">
      <h3>
        <Icon name="flamme" style={{ marginRight: '0.35em' }} />
        Règles spéciales
      </h3>
      <div className="flex flex-wrap gap-sm" style={{ marginBottom: '0.6rem' }}>
        {membre.regles_speciales_notes.map((s, i) => (
          <span key={i} className="badge badge--info">
            {s}
            <button
              className="btn--ghost"
              style={{ border: 'none', background: 'none', marginLeft: '0.3rem', padding: 0 }}
              onClick={() =>
                onMajMembre({ regles_speciales_notes: membre.regles_speciales_notes.filter((_, j) => j !== i) })
              }
            >
              ✕
            </button>
          </span>
        ))}
        {membre.regles_speciales_notes.length === 0 && <span className="text-muted text-sm">Aucune</span>}
      </div>
      <div className="flex gap-sm">
        <input
          value={nouvelleNote}
          onChange={(e) => setNouvelleNote(e.target.value)}
          placeholder="Ex : Nuages de mouches : -1 pour être touché au corps à corps"
          style={{
            flex: 1,
            background: 'var(--bg-inset)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '0.5rem 0.6rem',
          }}
        />
        <button
          className="btn"
          onClick={() => {
            if (!nouvelleNote.trim()) return;
            onMajMembre({ regles_speciales_notes: [...membre.regles_speciales_notes, nouvelleNote.trim()] });
            setNouvelleNote('');
          }}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Icon } from '../common/Icon';
import type { Member } from '../../types/roster';

type SortsConnusCardProps = {
  membre: Member;
  onMajMembre: (partial: Partial<Member>) => void;
};

export function SortsConnusCard({ membre, onMajMembre }: SortsConnusCardProps) {
  const [nouveauSort, setNouveauSort] = useState('');

  return (
    <div className="card">
      <h3>
        <Icon name="flamme" style={{ marginRight: '0.35em' }} />
        Règles spéciales / Sorts connus / mutations
      </h3>
      <div className="flex flex-wrap gap-sm" style={{ marginBottom: '0.6rem' }}>
        {membre.sorts_connus.map((s, i) => (
          <span key={i} className="badge badge--info">
            {s}
            <button
              className="btn--ghost"
              style={{ border: 'none', background: 'none', marginLeft: '0.3rem', padding: 0 }}
              onClick={() => onMajMembre({ sorts_connus: membre.sorts_connus.filter((_, j) => j !== i) })}
            >
              ✕
            </button>
          </span>
        ))}
        {membre.sorts_connus.length === 0 && <span className="text-muted text-sm">Aucun</span>}
      </div>
      <div className="flex gap-sm">
        <input
          value={nouveauSort}
          onChange={(e) => setNouveauSort(e.target.value)}
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
            if (!nouveauSort.trim()) return;
            onMajMembre({ sorts_connus: [...membre.sorts_connus, nouveauSort.trim()] });
            setNouveauSort('');
          }}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

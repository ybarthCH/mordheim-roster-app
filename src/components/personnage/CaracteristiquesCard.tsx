import { STAT_KEYS } from '../../types/catalog';
import type { CaracteristiquesMax, Stats } from '../../types/catalog';
import type { Member } from '../../types/roster';

type CaracteristiquesCardProps = {
  membre: Member;
  plafond: CaracteristiquesMax | undefined;
  onEditerStat: (k: keyof Stats, value: number) => void;
};

export function CaracteristiquesCard({ membre, plafond, onEditerStat }: CaracteristiquesCardProps) {
  return (
    <div className="card">
      <h3>Caractéristiques</h3>
      <div className="stat-grid">
        {STAT_KEYS.map((k) => (
          <div key={k} className="stat-grid__cell stat-grid__cell--label">
            {k}
          </div>
        ))}
        {STAT_KEYS.map((k) => (
          <div
            key={k}
            className={`stat-grid__cell stat-grid__cell--value ${
              membre.stats_modifiees.includes(k) ? 'stat-grid__cell--modified' : ''
            }`}
          >
            <input
              type="number"
              className="stat-grid__input"
              value={membre.stats_actuels[k]}
              onChange={(e) => onEditerStat(k, Number(e.target.value) || 0)}
            />
          </div>
        ))}
      </div>
      {plafond && (
        <p className="text-sm text-muted" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
          Plafond de caractéristiques ({plafond.profil}) :{' '}
          {plafond.note ?? STAT_KEYS.map((k) => `${k} ${plafond[k] ?? '—'}`).join(' · ')}
        </p>
      )}
    </div>
  );
}

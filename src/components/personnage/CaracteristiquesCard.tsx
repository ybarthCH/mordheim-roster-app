import { STAT_KEYS } from '../../types/catalog';
import type { Profile, Stats } from '../../types/catalog';
import type { Member } from '../../types/roster';
import { plafondPour, estStatAuPlafond } from '../../utils/plafond';

type CaracteristiquesCardProps = {
  membre: Member;
  profil: Profile;
  onEditerStat: (k: keyof Stats, value: number) => void;
};

export function CaracteristiquesCard({ membre, profil, onEditerStat }: CaracteristiquesCardProps) {
  const plafond = plafondPour(profil);
  return (
    <div className="card">
      <h3>Caractéristiques</h3>
      <div className="stat-grid">
        {STAT_KEYS.map((k) => (
          <div key={k} className="stat-grid__cell stat-grid__cell--label">
            {k}
          </div>
        ))}
        {STAT_KEYS.map((k) => {
          const auPlafond = estStatAuPlafond(profil, membre.stats_actuels, k);
          return (
            <div
              key={k}
              className={`stat-grid__cell stat-grid__cell--value ${
                membre.stats_modifiees.includes(k) ? 'stat-grid__cell--modified' : ''
              }`}
              title={auPlafond ? 'Caractéristique au plafond racial' : undefined}
            >
              <input
                type="number"
                className={`stat-grid__input ${auPlafond ? 'stat-grid__input--plafond' : ''}`}
                value={membre.stats_actuels[k]}
                onChange={(e) => onEditerStat(k, Number(e.target.value) || 0)}
              />
            </div>
          );
        })}
      </div>
      {plafond && (
        <p className="text-sm text-muted" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
          Plafond de caractéristiques ({plafond.label}) :{' '}
          {STAT_KEYS.map((k) => `${k} ${plafond[k]}`).join(' · ')}
          {plafond.note && <> — {plafond.note}</>}
        </p>
      )}
      {profil.type === 'homme_de_main' && (
        <p className="text-sm text-muted" style={{ marginTop: '0.3rem', marginBottom: 0 }}>
          Un homme de main ne peut jamais augmenter une même caractéristique de plus de +1.
        </p>
      )}
    </div>
  );
}

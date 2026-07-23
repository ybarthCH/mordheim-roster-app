import { Icon } from '../common/Icon';
import { injuryLabel } from '../../utils/blessures';
import type { Member } from '../../types/roster';

type BlessuresGravesCardProps = {
  membre: Member;
  onOpenAjout: () => void;
  onSupprimer: (id: string) => void;
};

export function BlessuresGravesCard({ membre, onOpenAjout, onSupprimer }: BlessuresGravesCardProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
        <h3 className="mt-0 mb-0">
          <Icon name="goutte" style={{ marginRight: '0.35em' }} />
          Blessures graves
        </h3>
        <button className="btn btn--sm btn--primary" onClick={onOpenAjout}>
          + Enregistrer un résultat
        </button>
      </div>
      {membre.blessures_graves.length === 0 && <p className="text-muted text-sm">Aucune.</p>}
      {membre.blessures_graves.map((b) => (
        <div key={b.id} className="flex justify-between" style={{ alignItems: 'flex-start', gap: '0.4rem', marginTop: '0.3rem' }}>
          <p className="text-sm mb-0">
            {b.date} — {injuryLabel(b)}
          </p>
          <button
            className="btn--ghost"
            style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)', flexShrink: 0 }}
            onClick={() => onSupprimer(b.id)}
            title="Supprimer cette entrée de l'historique"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

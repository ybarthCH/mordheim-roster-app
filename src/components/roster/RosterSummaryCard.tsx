import { valeurBande, effectifTotal } from '../../utils/bandeValue';
import { ratingTotal } from '../../utils/rating';
import type { RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';

type RosterSummaryCardProps = {
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  onPatch: (partial: Partial<RosterInstance>) => void;
};

export function RosterSummaryCard({ roster, catalogue, onPatch }: RosterSummaryCardProps) {
  return (
    <div className="card">
      <input
        value={roster.nom_bande}
        onChange={(e) => onPatch({ nom_bande: e.target.value })}
        className="input--heading"
        style={{ fontSize: '1.6rem' }}
        placeholder="Nom de la bande"
      />
      <p className="text-sm text-muted" style={{ margin: '0 0 0.3rem' }}>
        {catalogue?.nom ?? roster.bande_id}
      </p>
      <div className="summary-grid" style={{ marginTop: '0.7rem' }}>
        <div className="summary-tile">
          <div className="summary-tile__value">{valeurBande(roster)}</div>
          <div className="summary-tile__label">Valeur (po)</div>
        </div>
        <div className="summary-tile">
          <div className="summary-tile__value">{effectifTotal(roster)}</div>
          <div className="summary-tile__label">Membres</div>
        </div>
        <div className="summary-tile">
          <div className="summary-tile__value">{ratingTotal(roster)}</div>
          <div className="summary-tile__label">Rating</div>
        </div>
        <div className="summary-tile">
          <input
            type="number"
            value={roster.tresorerie}
            onChange={(e) => onPatch({ tresorerie: Number(e.target.value) || 0 })}
            style={{
              width: '100%',
              textAlign: 'center',
              background: 'transparent',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              color: 'inherit',
            }}
          />
          <div className="summary-tile__label">Trésorerie (po)</div>
        </div>
        <div className="summary-tile">
          <input
            type="number"
            value={roster.wyrdstone}
            onChange={(e) => onPatch({ wyrdstone: Number(e.target.value) || 0 })}
            style={{
              width: '100%',
              textAlign: 'center',
              background: 'transparent',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              color: 'inherit',
            }}
          />
          <div className="summary-tile__label">Wyrdstone</div>
        </div>
      </div>
      <div className="field" style={{ marginTop: '0.7rem' }}>
        <label>Notes</label>
        <textarea
          value={roster.equipement_reserve}
          onChange={(e) => onPatch({ equipement_reserve: e.target.value })}
          placeholder="Notes libres sur la bande…"
        />
      </div>
    </div>
  );
}

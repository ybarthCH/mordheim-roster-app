import { effectifTotal, nombreFrancsTireursActifs } from '../../utils/bandeValue';
import { ratingAffiche } from '../../utils/displayedRating';
import { formatPowerValueTooltip, powerValueDetailTotal } from '../../utils/powerValue';
import type { RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { effectifMaxAutorise } from '../../utils/validation';
import { useLanguage } from '../../state/useLanguage';
import { useGameRules } from '../../state/useGameRules';

type RosterSummaryCardProps = {
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  onPatch: (partial: Partial<RosterInstance>) => void;
};

export function RosterSummaryCard({ roster, catalogue, onPatch }: RosterSummaryCardProps) {
  const { t } = useLanguage();
  const { rules } = useGameRules();
  const effectif = effectifTotal(roster);
  const effectifMax = catalogue ? effectifMaxAutorise(roster) : undefined;
  const effectifPlein = effectifMax != null && effectif >= effectifMax;
  const francsTireurs = nombreFrancsTireursActifs(roster);

  return (
    <div className="card">
      <input
        value={roster.nom_bande}
        onChange={(e) => onPatch({ nom_bande: e.target.value })}
        className="input--heading"
        style={{ fontSize: '1.6rem' }}
        placeholder={t('rosterSummary.bandNamePlaceholder')}
      />
      <p className="text-sm text-muted" style={{ margin: '0 0 0.3rem' }}>
        {catalogue?.nom ?? roster.bande_id}
      </p>
      <div className="summary-grid" style={{ marginTop: '0.7rem' }}>
        <div className={`summary-tile${effectifPlein ? ' summary-tile--attention' : ''}`}>
          <div className="summary-tile__value" style={effectifPlein ? { color: 'var(--warning)' } : undefined}>
            {effectifMax != null ? `${effectif}/${effectifMax}` : effectif}
          </div>
          {francsTireurs > 0 && (
            <div className="summary-tile__hint">
              {francsTireurs} {t('rosterSummary.hiredSwordsAbbrev')}
            </div>
          )}
          <div className="summary-tile__label">{t('rosterSummary.members')}</div>
        </div>
        <div className="summary-tile">
          <div
            className="summary-tile__value"
            title={rules.valeurPuissanceActivee ? formatPowerValueTooltip(powerValueDetailTotal(roster)) : undefined}
          >
            {ratingAffiche(roster, rules)}
          </div>
          <div className="summary-tile__label">
            {rules.valeurPuissanceActivee ? t('rosterSummary.powerValue') : t('rosterSummary.rating')}
          </div>
        </div>
        <div className="summary-tile">
          <input
            type="number"
            value={roster.tresorerie}
            onChange={(e) => onPatch({ tresorerie: Number(e.target.value) || 0 })}
            className="summary-tile__value summary-tile__input"
            style={roster.tresorerie < 0 ? { color: 'var(--danger)' } : undefined}
          />
          <div className="summary-tile__label">{t('rosterSummary.treasury')}</div>
        </div>
        <div className="summary-tile">
          <input
            type="number"
            value={roster.wyrdstone}
            onChange={(e) => onPatch({ wyrdstone: Number(e.target.value) || 0 })}
            className="summary-tile__value summary-tile__input"
          />
          <div className="summary-tile__label">{t('rosterSummary.wyrdstone')}</div>
        </div>
      </div>
      <div className="field" style={{ marginTop: '0.7rem' }}>
        <label>{t('rosterSummary.notes')}</label>
        <textarea
          value={roster.equipement_reserve}
          onChange={(e) => onPatch({ equipement_reserve: e.target.value })}
          placeholder={t('rosterSummary.notesPlaceholder')}
        />
      </div>
    </div>
  );
}

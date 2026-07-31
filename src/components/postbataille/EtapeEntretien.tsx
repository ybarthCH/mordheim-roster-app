import type { Member } from '../../types/roster';
import { useLanguage } from '../../state/useLanguage';

export type DecisionEntretien =
  | 'payer'
  | 'renvoyer'
  | 'exempter'
  | 'impaye'
  | 'gratuit'
  | 'depart_automatique';

export type LigneEntretien = {
  membre: Member;
  nom: string;
  type: 'or' | 'malepierre' | 'aucun';
  cout: number;
  texte: string;
  exemption?: { label: string; texte: string };
  maintienSansPaiement?: string;
  departAutomatique?: boolean;
};

type Props = {
  lignes: LigneEntretien[];
  decisions: Record<string, DecisionEntretien>;
  onDecision: (instanceId: string, decision: DecisionEntretien) => void;
  totalOr: number;
  totalMalepierre: number;
  orDisponible: number;
  malepierreDisponible: number;
};

export function EtapeEntretien({
  lignes,
  decisions,
  onDecision,
  totalOr,
  totalMalepierre,
  orDisponible,
  malepierreDisponible,
}: Props) {
  const { t } = useLanguage();
  const insuffisant = totalOr > orDisponible || totalMalepierre > malepierreDisponible;

  return (
    <>
      <div className="card">
        <h3>{t('entretien.title')}</h3>
        {lignes.length === 0 ? (
          <p className="text-sm text-muted mb-0">{t('entretien.noneHired')}</p>
        ) : (
          <p className="text-sm text-muted mb-0">{t('entretien.intro')}</p>
        )}
      </div>

      {lignes.map((ligne) => {
        const decision =
          decisions[ligne.membre.instance_id] ??
          (ligne.departAutomatique ? 'depart_automatique' : ligne.type === 'aucun' ? 'gratuit' : 'payer');
        return (
          <div className="card" key={ligne.membre.instance_id}>
            <div className="flex justify-between items-center">
              <strong>{ligne.nom}</strong>
              <span className="badge badge--info">
                {ligne.type === 'or'
                  ? t('entretien.goldCoins', { n: ligne.cout })
                  : ligne.type === 'malepierre'
                    ? t('entretien.fragments', { n: ligne.cout, s: ligne.cout > 1 ? 's' : '' })
                    : t('entretien.noUpkeep')}
              </span>
            </div>
            <p className="text-sm text-muted">{ligne.texte}</p>

            {ligne.departAutomatique ? (
              <p className="text-sm mb-0">
                <strong>{t('entretien.automaticDeparture')}</strong> {t('entretien.oneBattleOnly')}
              </p>
            ) : ligne.type === 'aucun' ? (
              <p className="text-sm mb-0">{t('entretien.staysWithoutPayment')}</p>
            ) : (
              <div className="skill-list">
                <label className="skill-check" style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={`entretien-${ligne.membre.instance_id}`}
                    checked={decision === 'payer'}
                    onChange={() => onDecision(ligne.membre.instance_id, 'payer')}
                  />
                  <span>
                    <span className="skill-check__name">{t('entretien.payAndKeep')}</span>
                  </span>
                </label>
                <label className="skill-check" style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={`entretien-${ligne.membre.instance_id}`}
                    checked={decision === 'renvoyer'}
                    onChange={() => onDecision(ligne.membre.instance_id, 'renvoyer')}
                  />
                  <span>
                    <span className="skill-check__name">{t('entretien.dontPayDismiss')}</span>
                  </span>
                </label>
                {ligne.exemption && (
                  <label className="skill-check" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={`entretien-${ligne.membre.instance_id}`}
                      checked={decision === 'exempter'}
                      onChange={() => onDecision(ligne.membre.instance_id, 'exempter')}
                    />
                    <span>
                      <span className="skill-check__name">{t('entretien.exemptionLabel', { label: ligne.exemption.label })}</span>
                      <br />
                      <span className="skill-check__text">{ligne.exemption.texte}</span>
                    </span>
                  </label>
                )}
                {ligne.maintienSansPaiement && (
                  <label className="skill-check" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={`entretien-${ligne.membre.instance_id}`}
                      checked={decision === 'impaye'}
                      onChange={() => onDecision(ligne.membre.instance_id, 'impaye')}
                    />
                    <span>
                      <span className="skill-check__name">{t('entretien.keepWithoutPaying')}</span>
                      <br />
                      <span className="skill-check__text">{ligne.maintienSansPaiement}</span>
                    </span>
                  </label>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="card">
        <p className={insuffisant ? 'text-danger mb-0' : 'mb-0'}>
          {t('entretien.totalLine', {
            or: totalOr,
            malepierre: totalMalepierre > 0 ? t('entretien.andFragments', { n: totalMalepierre }) : '',
          })}
          <br />
          {t('entretien.availableAfterExploration', { or: orDisponible, malepierre: malepierreDisponible })}
        </p>
        {insuffisant && <p className="text-sm text-danger mb-0">{t('entretien.insufficientResources')}</p>}
      </div>
    </>
  );
}

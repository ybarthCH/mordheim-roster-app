import type { Member } from '../../types/roster';

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
  const insuffisant = totalOr > orDisponible || totalMalepierre > malepierreDisponible;

  return (
    <>
      <div className="card">
        <h3>Entretien des francs-tireurs</h3>
        <p className="text-sm text-muted">
          La prime d’engagement couvrait le recrutement, pas cette solde. Choisis qui reste sous contrat ; un
          franc-tireur renvoyé quitte immédiatement la bande et perd son expérience.
        </p>
        {lignes.length === 0 && (
          <p className="text-sm text-muted mb-0">Aucun franc-tireur ayant participé ne réclame de solde.</p>
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
                  ? `${ligne.cout} CO`
                  : ligne.type === 'malepierre'
                    ? `${ligne.cout} fragment${ligne.cout > 1 ? 's' : ''}`
                    : 'Sans entretien'}
              </span>
            </div>
            <p className="text-sm text-muted">{ligne.texte}</p>

            {ligne.departAutomatique ? (
              <p className="text-sm mb-0">
                <strong>Départ automatique :</strong> ce contrat ne couvrait qu’une seule bataille.
              </p>
            ) : ligne.type === 'aucun' ? (
              <p className="text-sm mb-0">Le profil reste dans la bande sans paiement.</p>
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
                    <span className="skill-check__name">Payer et conserver</span>
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
                    <span className="skill-check__name">Ne pas payer — renvoyer</span>
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
                      <span className="skill-check__name">Exemption : {ligne.exemption.label}</span>
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
                      <span className="skill-check__name">Conserver sans payer</span>
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
          Total : {totalOr} CO
          {totalMalepierre > 0 ? ` et ${totalMalepierre} fragment(s) de malepierre` : ''}.
          <br />
          Disponibles après exploration : {orDisponible} CO et {malepierreDisponible} fragment(s).
        </p>
        {insuffisant && (
          <p className="text-sm text-danger mb-0">
            Ressources insuffisantes : renvoie un ou plusieurs francs-tireurs, ou applique une exemption valide.
          </p>
        )}
      </div>
    </>
  );
}

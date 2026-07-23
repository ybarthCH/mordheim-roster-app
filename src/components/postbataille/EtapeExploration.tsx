import type { RosterInstance } from '../../types/roster';

type EtapeExplorationProps = {
  roster: RosterInstance;
  wyrdstoneTrouve: number;
  onWyrdstoneTrouveChange: (v: number) => void;
  notesExploration: string;
  onNotesExplorationChange: (v: string) => void;
  quantiteVendue: number;
  onQuantiteVendueChange: (v: number) => void;
  prixVente: number;
  onPrixVenteChange: (v: number) => void;
  pointsVeteran: number;
  onPointsVeteranChange: (v: number) => void;
};

export function EtapeExploration({
  roster,
  wyrdstoneTrouve,
  onWyrdstoneTrouveChange,
  notesExploration,
  onNotesExplorationChange,
  quantiteVendue,
  onQuantiteVendueChange,
  prixVente,
  onPrixVenteChange,
  pointsVeteran,
  onPointsVeteranChange,
}: EtapeExplorationProps) {
  return (
    <div className="card">
      <h3>Exploration &amp; wyrdstone</h3>
      <p className="text-sm text-muted">Reporte ici le résultat de tes jets d'exploration effectués sur table papier.</p>
      <div className="field">
        <label>Wyrdstone trouvé (à ajouter à la réserve)</label>
        <input type="number" value={wyrdstoneTrouve} onChange={(e) => onWyrdstoneTrouveChange(Number(e.target.value) || 0)} />
      </div>
      <div className="field">
        <label>Objets / événements d'exploration (texte libre, ajouté à l'équipement en réserve)</label>
        <textarea value={notesExploration} onChange={(e) => onNotesExplorationChange(e.target.value)} />
      </div>
      <h3>Vente de wyrdstone</h3>
      <div className="field-row">
        <div className="field">
          <label>Quantité vendue</label>
          <input type="number" value={quantiteVendue} onChange={(e) => onQuantiteVendueChange(Number(e.target.value) || 0)} />
        </div>
        <div className="field">
          <label>Prix total obtenu (po)</label>
          <input type="number" value={prixVente} onChange={(e) => onPrixVenteChange(Number(e.target.value) || 0)} />
        </div>
      </div>
      <p className="text-sm text-muted">
        Wyrdstone en réserve après cette étape : {Math.max(0, roster.wyrdstone + wyrdstoneTrouve - quantiteVendue)} ·
        Trésorerie : {roster.tresorerie + prixVente} po
      </p>
      <h3>Nombre de points vétéran disponibles</h3>
      <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
        Jet de 2D6 effectué sur table papier — saisis le résultat ici pour qu'il apparaisse dans le journal de la
        bataille.
      </p>
      <div className="field">
        <label>Points vétéran</label>
        <input type="number" value={pointsVeteran} onChange={(e) => onPointsVeteranChange(Number(e.target.value) || 0)} />
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { effectifTotal } from '../../utils/bandeValue';
import {
  COLONNES_GUERRIERS,
  TABLE_VENTE_WYRDSTONE,
  indexColonneGuerriers,
  indexLigneFragments,
  prixVenteWyrdstone,
} from '../../data/tableVenteWyrdstone';
import { TABLE_FRAGMENTS_TROUVES, fragmentsTrouves } from '../../data/tableExplorationWyrdstone';
import { AchatEquipementModal } from '../personnage/AchatEquipementModal';
import type { ShopItem } from '../../utils/shop';

type EtapeExplorationProps = {
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
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
  onAchatStock: (item: ShopItem, coutPaye: number) => void;
};

export function EtapeExploration({
  roster,
  catalogue,
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
  onAchatStock,
}: EtapeExplorationProps) {
  const [modalAchat, setModalAchat] = useState(false);
  const [sommeDes, setSommeDes] = useState('');
  const sommeDesNum = Number(sommeDes) || 0;
  const fragmentsSuggeres = sommeDesNum > 0 ? fragmentsTrouves(sommeDesNum) : 0;
  const palierActif =
    sommeDesNum > 0
      ? TABLE_FRAGMENTS_TROUVES.findIndex((p) => sommeDesNum >= p.min && (p.max === null || sommeDesNum <= p.max))
      : -1;
  const nbGuerriers = effectifTotal(roster);
  const colonneActive = indexColonneGuerriers(nbGuerriers);
  const ligneActive = quantiteVendue > 0 ? indexLigneFragments(quantiteVendue) : -1;
  const prixSuggere = quantiteVendue > 0 ? prixVenteWyrdstone(quantiteVendue, nbGuerriers) : 0;

  return (
    <div className="card">
      <h3>Exploration &amp; wyrdstone</h3>
      <p className="text-sm text-muted">Reporte ici le résultat de tes jets d'exploration effectués sur table papier.</p>
      <div className="table-scroll">
        <table className="table-reference">
          <thead>
            <tr>
              <th>Résultat des dés</th>
              <th>Fragments trouvés</th>
            </tr>
          </thead>
          <tbody>
            {TABLE_FRAGMENTS_TROUVES.map((p, i) => (
              <tr key={i} className={i === palierActif ? 'table-reference__row-active' : undefined}>
                <td>{p.max === null ? `${p.min}+` : `${p.min}-${p.max}`}</td>
                <td className={i === palierActif ? 'table-reference__cell-active' : undefined}>{p.fragments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="field-row">
        <div className="field">
          <label>Somme des dés d'exploration (optionnel)</label>
          <input type="number" value={sommeDes} onChange={(e) => setSommeDes(e.target.value)} />
        </div>
        <div className="field">
          <label>Wyrdstone trouvé (à ajouter à la réserve)</label>
          <input type="number" value={wyrdstoneTrouve} onChange={(e) => onWyrdstoneTrouveChange(Number(e.target.value) || 0)} />
        </div>
      </div>
      {sommeDesNum > 0 && (
        <p className="text-sm text-muted">
          Fragments suggérés par la table : {fragmentsSuggeres}.{' '}
          {wyrdstoneTrouve !== fragmentsSuggeres && (
            <button type="button" className="btn btn--sm" onClick={() => onWyrdstoneTrouveChange(fragmentsSuggeres)}>
              Utiliser cette valeur
            </button>
          )}
        </p>
      )}
      <div className="field">
        <label>Objets / événements d'exploration (texte libre, ajouté à l'équipement en réserve)</label>
        <textarea value={notesExploration} onChange={(e) => onNotesExplorationChange(e.target.value)} />
      </div>
      <div className="flex justify-between items-center" style={{ marginBottom: '0.3rem' }}>
        <p className="text-sm text-muted mb-0">
          Certains scénarios accordent un objet directement (shop commun de l'armurerie) : ajoute-le ici, il rejoint
          aussitôt le stock de la bande. Coût payé à 0 po pour un objet gagné gratuitement.
        </p>
        {catalogue && (
          <button type="button" className="btn btn--sm" style={{ flexShrink: 0 }} onClick={() => setModalAchat(true)}>
            + Objet
          </button>
        )}
      </div>
      <h3>Vente de wyrdstone</h3>
      <p className="text-sm text-muted">
        Prix de vente selon le nombre de fragments vendus ensemble et la taille de la bande ({nbGuerriers} guerrier
        {nbGuerriers > 1 ? 's' : ''}).
      </p>
      <div className="table-scroll">
        <table className="table-reference">
          <thead>
            <tr>
              <th>Fragments vendus</th>
              {COLONNES_GUERRIERS.map((c, i) => (
                <th key={c.label} className={i === colonneActive ? 'table-reference__col-active' : undefined}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_VENTE_WYRDSTONE.map((ligne, i) => (
              <tr key={i} className={i === ligneActive ? 'table-reference__row-active' : undefined}>
                <td>{i === TABLE_VENTE_WYRDSTONE.length - 1 ? `${i + 1}+` : i + 1}</td>
                {ligne.map((prix, j) => (
                  <td
                    key={j}
                    className={i === ligneActive && j === colonneActive ? 'table-reference__cell-active' : undefined}
                  >
                    {prix}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
      {quantiteVendue > 0 && (
        <p className="text-sm text-muted">
          Prix suggéré par la table : {prixSuggere} po.{' '}
          {prixVente !== prixSuggere && (
            <button type="button" className="btn btn--sm" onClick={() => onPrixVenteChange(prixSuggere)}>
              Utiliser ce prix
            </button>
          )}
        </p>
      )}
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

      {modalAchat && catalogue && (
        <AchatEquipementModal
          catalogue={catalogue}
          profil={null}
          tresorerie={roster.tresorerie}
          onClose={() => setModalAchat(false)}
          onAchat={onAchatStock}
        />
      )}
    </div>
  );
}

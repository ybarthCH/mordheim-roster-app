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
import { TABLE_FRAGMENTS_TROUVES } from '../../data/tableExplorationWyrdstone';
import { AchatEquipementModal } from '../personnage/AchatEquipementModal';
import { inventaireComplet } from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import type { ResumeExploration } from '../../utils/exploration';
import { EvenementExploration } from './EvenementExploration';

type EtapeExplorationProps = {
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  wyrdstoneTrouve: number;
  onWyrdstoneTrouveChange: (v: number) => void;
  notesExploration: string;
  onNotesExplorationChange: (v: string) => void;
  quantiteVendue: number;
  onQuantiteVendueChange: (v: number) => void;
  pointsVeteran: number;
  onPointsVeteranChange: (v: number) => void;
  onAchatStock: (item: ShopItem, coutPaye: number) => void;
  // Ajoute directement le montant à la trésorerie de la bande (voir les
  // événements à gain d'or de tableExplorationEvenements.ts) — appliqué
  // immédiatement, comme onAchatStock, indépendamment de la validation
  // finale de l'assistant.
  onAjouterOr: (montant: number) => void;
  // Fusionne un patch quelconque dans la bande — utilisé par les résolutions
  // d'événement qui touchent autre chose que la trésorerie (ex : Puits,
  // Vagabond) sans avoir à ajouter une prop dédiée pour chaque cas.
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  resumeExploration: ResumeExploration;
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
  pointsVeteran,
  onPointsVeteranChange,
  onAchatStock,
  onAjouterOr,
  onMajRoster,
  resumeExploration,
}: EtapeExplorationProps) {
  const [modalAchat, setModalAchat] = useState<false | 'normal' | 'artefacts'>(false);

  const ajouterAuJournalExploration = (texte: string) => {
    onNotesExplorationChange(`${notesExploration}${notesExploration ? '\n' : ''}${texte}`);
  };
  const palierActif = TABLE_FRAGMENTS_TROUVES.findIndex((p) => p.fragments === wyrdstoneTrouve);
  const nbGuerriers = effectifTotal(roster);
  const colonneActive = indexColonneGuerriers(nbGuerriers);
  const ligneActive = quantiteVendue > 0 ? indexLigneFragments(quantiteVendue) : -1;
  const prixSuggere = quantiteVendue > 0 ? prixVenteWyrdstone(quantiteVendue, nbGuerriers) : 0;
  const fragmentsDisponibles = Math.max(0, roster.wyrdstone + wyrdstoneTrouve);

  const changerQuantiteVendue = (valeur: number) => {
    const quantite = Math.min(fragmentsDisponibles, Math.max(0, Math.trunc(valeur)));
    onQuantiteVendueChange(quantite);
  };

  const changerWyrdstoneTrouve = (valeur: number) => {
    const trouve = Math.max(0, Math.trunc(valeur));
    onWyrdstoneTrouveChange(trouve);
    const nouveauMaximum = Math.max(0, roster.wyrdstone + trouve);
    if (quantiteVendue > nouveauMaximum) onQuantiteVendueChange(nouveauMaximum);
  };

  return (
    <div className="card">
      <h3>Exploration &amp; wyrdstone</h3>
      <div className="card card--tight" style={{ marginBottom: '0.8rem' }}>
        <p className="mb-0">
          Lance <strong>{resumeExploration.totalDesALancer}D6</strong> :
          {' '}{resumeExploration.desHeros} pour les Héros ayant participé sans être mis Hors de combat
          {resumeExploration.bonusVictoire > 0 ? ' + 1 pour la victoire' : ''}
          {resumeExploration.bonusFixes > 0
            ? ` + ${resumeExploration.bonusFixes} dû aux règles de la bande`
            : ''}.
        </p>
        <p className="text-sm text-muted mb-0" style={{ marginTop: '0.35rem' }}>
          Tu peux lancer plus de six dés, mais tu dois en choisir au maximum six pour former le résultat
          d'exploration.
        </p>
        {resumeExploration.herosEligibles.length > 0 && (
          <p className="text-sm mb-0" style={{ marginTop: '0.35rem' }}>
            <strong>Héros qui fournissent un dé :</strong>{' '}
            {resumeExploration.herosEligibles.map((membre) => membre.nom_perso).join(', ')}.
          </p>
        )}
      </div>

      {resumeExploration.aides.length > 0 && (
        <div className="card card--tight" style={{ marginBottom: '0.8rem', borderColor: 'var(--warning)' }}>
          <strong>Aides à l'exploration détectées</strong>
          {resumeExploration.aides.map((aide) => (
            <p key={`${aide.source}-${aide.texte}`} className="text-sm mb-0" style={{ marginTop: '0.35rem' }}>
              <strong>{aide.source}</strong> — {aide.texte}
            </p>
          ))}
          <p className="text-sm text-muted mb-0" style={{ marginTop: '0.45rem' }}>
            Ces règles ne lancent aucun dé automatiquement.
          </p>
        </div>
      )}

      <p className="text-sm text-muted">
        Reporte ici le résultat de tes jets d'exploration effectués sur table papier : touche la ligne obtenue
        ci-dessous.
      </p>
      <div className="table-scroll">
        <table className="table-reference table-reference--clickable">
          <thead>
            <tr>
              <th>Résultat des dés</th>
              <th>Fragments trouvés</th>
            </tr>
          </thead>
          <tbody>
            {TABLE_FRAGMENTS_TROUVES.map((p, i) => (
              <tr
                key={i}
                className={i === palierActif ? 'table-reference__row-active' : undefined}
                onClick={() => changerWyrdstoneTrouve(i === palierActif ? 0 : p.fragments)}
              >
                <td>{p.max === null ? `${p.min}+` : `${p.min}-${p.max}`}</td>
                <td>
                  <span className="table-reference__badge">{p.fragments}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted">
        Wyrdstone trouvé : <strong>{wyrdstoneTrouve}</strong> fragment{wyrdstoneTrouve > 1 ? 's' : ''}.
      </p>

      <h3>Événement d'exploration</h3>

      {catalogue && (
        <EvenementExploration
          roster={roster}
          catalogue={catalogue}
          onMajRoster={onMajRoster}
          onAjouterOr={onAjouterOr}
          onAjouterAuJournal={ajouterAuJournalExploration}
          onOuvrirArtefacts={() => setModalAchat('artefacts')}
        />
      )}

      <div className="field">
        <label>Journal d'exploration</label>
        <textarea value={notesExploration} onChange={(e) => onNotesExplorationChange(e.target.value)} />
      </div>

      <div className="card card--tight" style={{ marginBottom: '0.8rem' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '0.3rem' }}>
          <h3 className="mt-0 mb-0">Shop commun (objet(s) gagné(s) lors du scénario ou évènement d'exploration)</h3>
          {catalogue && (
            <button
              type="button"
              className="btn btn--primary btn--sm"
              style={{ flexShrink: 0 }}
              onClick={() => setModalAchat('normal')}
            >
              + Objet
            </button>
          )}
        </div>
        <p className="text-sm text-muted mb-0">
          Certains scénarios accordent un objet directement : ajoute-le ici, il rejoint aussitôt le stock de la
          bande, sans toucher à la trésorerie.
        </p>
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
                    className={[
                      j === colonneActive ? 'table-reference__col-active' : '',
                      i === ligneActive && j === colonneActive ? 'table-reference__cell-active' : '',
                    ].filter(Boolean).join(' ') || undefined}
                  >
                    {prix}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="field">
        <label>Quantité vendue</label>
        <div className="quantity-stepper">
          <button
            type="button"
            className="btn quantity-stepper__button"
            aria-label="Retirer un fragment de la vente"
            disabled={quantiteVendue <= 0}
            onClick={() => changerQuantiteVendue(quantiteVendue - 1)}
          >
            −
          </button>
          <input
            type="number"
            min={0}
            max={fragmentsDisponibles}
            inputMode="numeric"
            aria-label="Nombre de fragments à vendre"
            value={quantiteVendue}
            onChange={(e) => changerQuantiteVendue(Number(e.target.value) || 0)}
          />
          <button
            type="button"
            className="btn quantity-stepper__button"
            aria-label="Ajouter un fragment à la vente"
            disabled={quantiteVendue >= fragmentsDisponibles}
            onClick={() => changerQuantiteVendue(quantiteVendue + 1)}
          >
            +
          </button>
        </div>
        <span className="text-sm text-muted">
          {fragmentsDisponibles} fragment{fragmentsDisponibles > 1 ? 's' : ''} disponible
          {fragmentsDisponibles > 1 ? 's' : ''}.
        </span>
      </div>
      <div className="price-highlight">
        <span className="price-highlight__value">{prixSuggere} po</span>
        <span className="price-highlight__label">
          pour {quantiteVendue} fragment{quantiteVendue > 1 ? 's' : ''} vendu{quantiteVendue > 1 ? 's' : ''}
        </span>
      </div>
      <p className="text-sm text-muted">
        Wyrdstone en réserve après cette étape : {fragmentsDisponibles - quantiteVendue} ·
        Trésorerie : {roster.tresorerie + prixSuggere} po
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
          inventaireBande={inventaireComplet(roster)}
          gratuit
          categorieInitiale={modalAchat === 'artefacts' ? 'artefacts_magiques' : undefined}
          onClose={() => setModalAchat(false)}
          onAchat={onAchatStock}
        />
      )}
    </div>
  );
}

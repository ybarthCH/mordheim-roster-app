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
import { useLanguage } from '../../state/useLanguage';

type EtapeExplorationProps = {
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  date: string;
  wyrdstoneTrouve: number;
  onWyrdstoneTrouveChange: (v: number) => void;
  notesExploration: string;
  onNotesExplorationChange: (v: string) => void;
  quantiteVendue: number;
  onQuantiteVendueChange: (v: number) => void;
  pointsVeteranSaisie: string;
  onPointsVeteranSaisieChange: (v: string) => void;
  onAchatStock: (item: ShopItem, coutPaye: number) => void;
  // Variante à quantité multiple pour un objet trouvé lors d'un événement
  // d'exploration (voir LigneObjetTrouve dans tableExplorationEvenements.ts).
  onAchatStockMultiple: (item: ShopItem, coutPaye: number, quantite: number) => void;
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
  date,
  wyrdstoneTrouve,
  onWyrdstoneTrouveChange,
  notesExploration,
  onNotesExplorationChange,
  quantiteVendue,
  onQuantiteVendueChange,
  pointsVeteranSaisie,
  onPointsVeteranSaisieChange,
  onAchatStock,
  onAchatStockMultiple,
  onAjouterOr,
  onMajRoster,
  resumeExploration,
}: EtapeExplorationProps) {
  const { t } = useLanguage();
  const [modalAchat, setModalAchat] = useState(false);

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
      <h3>{t('exploration.title')}</h3>
      <div className="card card--tight" style={{ marginBottom: '0.8rem' }}>
        <p className="mb-0">
          {t('exploration.rollLine', {
            total: resumeExploration.totalDesALancer,
            heros: resumeExploration.desHeros,
            victoire: resumeExploration.bonusVictoire > 0 ? t('exploration.victorySuffix') : '',
            bonus: resumeExploration.bonusFixes > 0 ? t('exploration.bandRulesSuffix', { n: resumeExploration.bonusFixes }) : '',
          })}
        </p>
        <p className="text-sm text-muted mb-0" style={{ marginTop: '0.35rem' }}>
          {t('exploration.moreThanSixDiceNote')}
        </p>
        {resumeExploration.herosEligibles.length > 0 && (
          <p className="text-sm mb-0" style={{ marginTop: '0.35rem' }}>
            <strong>{t('exploration.heroesProvidingDie')}</strong>{' '}
            {resumeExploration.herosEligibles.map((membre) => membre.nom_perso).join(', ')}.
          </p>
        )}
      </div>

      {resumeExploration.aides.length > 0 && (
        <div className="card card--tight" style={{ marginBottom: '0.8rem', borderColor: 'var(--warning)' }}>
          <strong>{t('exploration.aidsDetected')}</strong>
          {resumeExploration.aides.map((aide) => (
            <p key={`${aide.source}-${aide.texte}`} className="text-sm mb-0" style={{ marginTop: '0.35rem' }}>
              <strong>{aide.source}</strong> — {aide.texte}
            </p>
          ))}
          <p className="text-sm text-muted mb-0" style={{ marginTop: '0.45rem' }}>
            {t('exploration.aidsNoAutoRoll')}
          </p>
        </div>
      )}

      <p className="text-sm text-muted">{t('exploration.reportRollsIntro')}</p>
      <div className="table-scroll">
        <table className="table-reference table-reference--clickable">
          <thead>
            <tr>
              <th>{t('exploration.diceResultHeader')}</th>
              <th>{t('exploration.fragmentsFoundHeader')}</th>
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
        {t('exploration.wyrdstoneFound', { n: wyrdstoneTrouve, s: wyrdstoneTrouve > 1 ? 's' : '' })}
      </p>

      <h3>{t('exploration.eventTitle')}</h3>

      {catalogue && (
        <EvenementExploration
          roster={roster}
          catalogue={catalogue}
          date={date}
          onMajRoster={onMajRoster}
          onAjouterOr={onAjouterOr}
          onAchatStockMultiple={onAchatStockMultiple}
          onAjouterAuJournal={ajouterAuJournalExploration}
          onOuvrirArtefacts={() => setModalAchat(true)}
        />
      )}

      <div className="field">
        <label>{t('exploration.journalLabel')}</label>
        <textarea value={notesExploration} onChange={(e) => onNotesExplorationChange(e.target.value)} />
      </div>

      <h3>{t('exploration.saleTitle')}</h3>
      <p className="text-sm text-muted">
        {t('exploration.salePriceIntro', { n: nbGuerriers, s: nbGuerriers > 1 ? 's' : '' })}
      </p>
      <div className="table-scroll">
        <table className="table-reference">
          <thead>
            <tr>
              <th>{t('exploration.fragmentsSoldHeader')}</th>
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
        <label>{t('exploration.quantitySoldLabel')}</label>
        <div className="quantity-stepper">
          <button
            type="button"
            className="btn quantity-stepper__button"
            aria-label={t('exploration.removeFragmentAria')}
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
            aria-label={t('exploration.fragmentCountAria')}
            value={quantiteVendue}
            onChange={(e) => changerQuantiteVendue(Number(e.target.value) || 0)}
          />
          <button
            type="button"
            className="btn quantity-stepper__button"
            aria-label={t('exploration.addFragmentAria')}
            disabled={quantiteVendue >= fragmentsDisponibles}
            onClick={() => changerQuantiteVendue(quantiteVendue + 1)}
          >
            +
          </button>
        </div>
        <span className="text-sm text-muted">
          {t('exploration.fragmentsAvailable', { n: fragmentsDisponibles, s: fragmentsDisponibles > 1 ? 's' : '' })}
        </span>
      </div>
      <div className="price-highlight">
        <span className="price-highlight__value">{prixSuggere} {t('creation.gc')}</span>
        <span className="price-highlight__label">
          {t('exploration.forFragmentsSold', { n: quantiteVendue, s: quantiteVendue > 1 ? 's' : '' })}
        </span>
      </div>
      <p className="text-sm text-muted">
        {t('exploration.reserveAfterStep', { n: fragmentsDisponibles - quantiteVendue, po: roster.tresorerie + prixSuggere })}
      </p>
      <h3>{t('exploration.veteranPointsTitle')}</h3>
      <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
        {t('exploration.veteranPointsNote')}
      </p>
      <div className="field">
        <label>{t('exploration.veteranPointsLabel')}</label>
        <input
          type="number"
          value={pointsVeteranSaisie}
          onChange={(e) => onPointsVeteranSaisieChange(e.target.value)}
        />
      </div>

      {modalAchat && catalogue && (
        <AchatEquipementModal
          catalogue={catalogue}
          profil={null}
          tresorerie={roster.tresorerie}
          inventaireBande={inventaireComplet(roster)}
          gratuit
          categorieInitiale="artefacts_magiques"
          onClose={() => setModalAchat(false)}
          onAchat={onAchatStock}
        />
      )}
    </div>
  );
}

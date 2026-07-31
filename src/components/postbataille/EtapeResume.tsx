import { resolveLeader } from '../../utils/leader';
import type { BattleRecord, Member, RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import type { XpDraft } from './PostBatailleScreen';

type EtapeResumeProps = {
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  date: string;
  resultat: BattleRecord['resultat'];
  adversaires: string[];
  wyrdstoneTrouve: number;
  quantiteVendue: number;
  prixVente: number;
  soldeTotal: number;
  entretienMalepierre: number;
  blessuresTresorerieBonus: number;
  coutCommerce: number;
  francTireursPayesCount: number;
  francsTireursPartants: string[];
  blessuresResume: { nom: string; blessure: string }[];
  docteurResultats: { nom: string; jet: number; titre: string }[];
  rechercheRareResultats: { nom: string; objetNom: string; rarete: number; reussi: boolean; achete: boolean }[];
  horsDeCombatIndividuel: Member[];
  xpDraftDe: (m: Member, xpParDefaut: number) => XpDraft;
  groupesHC: Member[];
  participantsAuto: Member[];
  avancesResolues: { nom: string; detail: string }[];
};

export function EtapeResume({
  roster,
  catalogue,
  date,
  resultat,
  adversaires,
  wyrdstoneTrouve,
  quantiteVendue,
  prixVente,
  soldeTotal,
  entretienMalepierre,
  blessuresTresorerieBonus,
  coutCommerce,
  francTireursPayesCount,
  francsTireursPartants,
  blessuresResume,
  docteurResultats,
  rechercheRareResultats,
  horsDeCombatIndividuel,
  xpDraftDe,
  groupesHC,
  participantsAuto,
  avancesResolues,
}: EtapeResumeProps) {
  const tresorerieApres = roster.tresorerie + prixVente - soldeTotal + blessuresTresorerieBonus - coutCommerce;
  const lignesTresorerie = [
    prixVente > 0 && { label: 'Vente de wyrdstone', montant: prixVente },
    blessuresTresorerieBonus > 0 && { label: 'Gains des blessures graves résolues', montant: blessuresTresorerieBonus },
    coutCommerce > 0 && { label: 'Dépenses de commerce', montant: -coutCommerce },
    soldeTotal > 0 && { label: `Solde des francs-tireurs (${francTireursPayesCount})`, montant: -soldeTotal },
  ].filter((l): l is { label: string; montant: number } => !!l);

  return (
    <div className="card">
      <h3>Résumé</h3>
      <p>
        {date} — {resultat} {adversaires.length > 0 && `vs ${adversaires.join(', ')}`}
      </p>
      <p className="text-sm mb-0">
        Wyrdstone : {roster.wyrdstone} →{' '}
        {Math.max(0, roster.wyrdstone + wyrdstoneTrouve - quantiteVendue - entretienMalepierre)}
      </p>
      <div className="text-sm" style={{ marginTop: '0.3rem' }}>
        <p className="mb-0">
          Trésorerie : {roster.tresorerie} → <strong>{tresorerieApres} po</strong>
        </p>
        {lignesTresorerie.length > 0 && (
          <ul style={{ margin: '0.2rem 0 0', paddingLeft: '1.2rem' }}>
            {lignesTresorerie.map((l) => (
              <li key={l.label}>
                {l.label} : {l.montant > 0 ? '+' : ''}
                {l.montant} po
              </li>
            ))}
          </ul>
        )}
      </div>
      {entretienMalepierre > 0 && (
        <p className="text-sm">
          Entretien en malepierre : {entretienMalepierre} fragment(s).
        </p>
      )}
      {francsTireursPartants.length > 0 && (
        <p className="text-sm">
          Départ de la bande : {francsTireursPartants.join(', ')}.{' '}
          {francsTireursPartants.length === 1 ? 'Son expérience est perdue.' : 'Leur expérience est perdue.'}
        </p>
      )}
      {docteurResultats.length > 0 && (
        <div className="text-sm">
          <p className="mb-0">Résultats du docteur :</p>
          <ul style={{ margin: '0.2rem 0 0.6rem', paddingLeft: '1.2rem' }}>
            {docteurResultats.map((d, i) => (
              <li key={`${d.nom}-${i}`}>
                {d.nom} — 2D6 = {d.jet} : <strong>{d.titre}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
      {rechercheRareResultats.length > 0 && (
        <div className="text-sm">
          <p className="mb-0">Recherches d'objet rare :</p>
          <ul style={{ margin: '0.2rem 0 0.6rem', paddingLeft: '1.2rem' }}>
            {rechercheRareResultats.map((r, i) => (
              <li key={`${r.nom}-${i}`} className={r.reussi ? 'text-success' : 'text-danger'}>
                {r.nom} — {r.objetNom} (Rare {r.rarete}) :{' '}
                {r.reussi ? (r.achete ? 'réussie, achetée' : 'réussie, non achetée') : 'ratée'}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-sm mb-0">
        {blessuresResume.length} blessure(s) grave(s) enregistrée(s)
        {blessuresResume.length > 0 ? ' :' : '.'}
      </p>
      {blessuresResume.length > 0 && (
        <ul className="text-sm" style={{ margin: '0.2rem 0 0.6rem', paddingLeft: '1.2rem' }}>
          {blessuresResume.map((b, i) => (
            <li key={`${b.nom}-${i}`}>
              {b.nom} — {b.blessure}
            </li>
          ))}
        </ul>
      )}
      <p className="text-sm">
        Hors de combat : {horsDeCombatIndividuel.filter((m) => xpDraftDe(m, m.xp).survecu === 'oui').length} survivant(s),{' '}
        {horsDeCombatIndividuel.filter((m) => xpDraftDe(m, m.xp).survecu === 'non').length} mort(s).
        {groupesHC.length > 0 && ` ${groupesHC.length} groupe(s) partiellement hors de combat résolu(s).`}
      </p>
      <p className="text-sm">{participantsAuto.length} membre(s) du reste du roster gagnent leur XP de participation.</p>
      {avancesResolues.length > 0 && (
        <p className="text-sm">
          {avancesResolues.length} avancée(s) résolue(s) pendant cette bataille :{' '}
          {avancesResolues.map((a) => `${a.nom} (${a.detail})`).join(', ')}
        </p>
      )}
      {resultat === 'victoire' && !!resolveLeader(roster, catalogue) && (
        <p className="text-sm">Le chef de bande gagne en plus son bonus de +1 XP pour la victoire.</p>
      )}
    </div>
  );
}

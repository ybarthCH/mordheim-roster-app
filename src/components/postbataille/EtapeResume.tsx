import { resolveProfil } from '../../utils/profil';
import type { BattleRecord, Member, RosterInstance } from '../../types/roster';
import type { BlessureDraft, XpDraft } from './PostBatailleScreen';

type EtapeResumeProps = {
  roster: RosterInstance;
  date: string;
  resultat: BattleRecord['resultat'];
  adversaires: string[];
  wyrdstoneTrouve: number;
  quantiteVendue: number;
  prixVente: number;
  soldeTotal: number;
  blessuresTresorerieBonus: number;
  francTireursActifsCount: number;
  blessureDrafts: Record<string, BlessureDraft>;
  horsDeCombatIndividuel: Member[];
  xpDraftDe: (m: Member, xpParDefaut: number) => XpDraft;
  groupesHC: Member[];
  participantsAuto: Member[];
  avancesResolues: { nom: string; detail: string }[];
};

export function EtapeResume({
  roster,
  date,
  resultat,
  adversaires,
  wyrdstoneTrouve,
  quantiteVendue,
  prixVente,
  soldeTotal,
  blessuresTresorerieBonus,
  francTireursActifsCount,
  blessureDrafts,
  horsDeCombatIndividuel,
  xpDraftDe,
  groupesHC,
  participantsAuto,
  avancesResolues,
}: EtapeResumeProps) {
  return (
    <div className="card">
      <h3>Résumé</h3>
      <p>
        {date} — {resultat} {adversaires.length > 0 && `vs ${adversaires.join(', ')}`}
      </p>
      <p className="text-sm">
        Wyrdstone : {roster.wyrdstone} → {Math.max(0, roster.wyrdstone + wyrdstoneTrouve - quantiteVendue)}
        <br />
        Trésorerie : {roster.tresorerie} → {roster.tresorerie + prixVente - soldeTotal + blessuresTresorerieBonus} po
      </p>
      {soldeTotal > 0 && (
        <p className="text-sm">
          Solde des francs-tireurs à payer : {soldeTotal} po ({francTireursActifsCount} franc(s)-tireur(s)).
        </p>
      )}
      {blessuresTresorerieBonus > 0 && (
        <p className="text-sm">Gains issus des blessures graves résolues : +{blessuresTresorerieBonus} po.</p>
      )}
      <p className="text-sm">
        {Object.values(blessureDrafts).filter((d) => d.description.trim()).length} blessure(s) grave(s) enregistrée(s).
      </p>
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
      {resultat === 'victoire' && roster.membres.some((m) => resolveProfil(roster, m)?.est_leader) && (
        <p className="text-sm">Le chef de bande gagne en plus son bonus de +1 XP pour la victoire.</p>
      )}
    </div>
  );
}

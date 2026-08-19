import { resolveLeader } from '../../utils/leader';
import type { BattleRecord, Member, RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import type { XpDraft } from './PostBatailleScreen';
import { useLanguage } from '../../state/useLanguage';
import { COUT_DOCTEUR } from '../../utils/docteur';

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
  // Calculée une seule fois dans PostBatailleScreen (même formule que
  // terminer(), qui l'applique réellement à la bande) plutôt que refaite ici
  // à partir des mêmes ingrédients — évite toute divergence entre l'aperçu
  // affiché et le montant réellement enregistré.
  tresorerieApres: number;
  // Trésorerie au tout début de l'assistant (voir tresorerieInitialeRef dans
  // PostBatailleScreen) — distincte de roster.tresorerie, déjà mutée en
  // direct par la récompense de scénario et les événements d'exploration à
  // ce stade.
  tresorerieInitiale: number;
  // Mouvements d'or appliqués en direct pendant l'assistant, hors ceux
  // calculés à la validation finale (wyrdstone/commerce/blessures, voir
  // lignesTresorerie ci-dessous) — voir journalOr dans PostBatailleScreen.
  journalOr: { label: string; montant: number }[];
  francTireursPayesCount: number;
  francsTireursPartants: string[];
  blessuresResume: { nom: string; blessure: string }[];
  docteurResultats: { nom: string; jet: number; titre: string }[];
  rechercheRareResultats: { nom: string; objetNom: string; rarete: number; reussi: boolean; achete: boolean }[];
  dramatisPersonaeResultats: { nom: string; dpNom: string; reussi: boolean; recrute: boolean }[];
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
  tresorerieApres,
  tresorerieInitiale,
  journalOr,
  francTireursPayesCount,
  francsTireursPartants,
  blessuresResume,
  docteurResultats,
  rechercheRareResultats,
  dramatisPersonaeResultats,
  horsDeCombatIndividuel,
  xpDraftDe,
  groupesHC,
  participantsAuto,
  avancesResolues,
}: EtapeResumeProps) {
  const { t } = useLanguage();
  const lignesTresorerie = [
    ...journalOr,
    prixVente > 0 && { label: t('resume.wyrdstoneSale'), montant: prixVente },
    blessuresTresorerieBonus !== 0 && { label: t('resume.injuryOutcomes'), montant: blessuresTresorerieBonus },
    coutCommerce > 0 && { label: t('resume.tradeExpenses'), montant: -coutCommerce },
    soldeTotal > 0 && { label: t('resume.hiredSwordWages', { n: francTireursPayesCount }), montant: -soldeTotal },
  ].filter((l): l is { label: string; montant: number } => !!l);
  const resultatLabel =
    resultat === 'victoire' ? t('resultat.victory') : resultat === 'defaite' ? t('resultat.defeat') : t('resultat.draw');

  return (
    <div className="card">
      <h3>{t('resume.title')}</h3>
      <p>
        {date} — {resultatLabel} {adversaires.length > 0 && t('resume.vsOpponents', { noms: adversaires.join(', ') })}
      </p>
      <p className="text-sm mb-0">
        {t('resume.wyrdstoneLine', {
          avant: roster.wyrdstone,
          apres: Math.max(0, roster.wyrdstone + wyrdstoneTrouve - quantiteVendue - entretienMalepierre),
        })}
      </p>
      <div className="text-sm" style={{ marginTop: '0.3rem' }}>
        <p className="mb-0">
          {t('resume.treasuryLine', { avant: tresorerieInitiale })}
          <strong>{t('resume.treasuryAfter', { n: tresorerieApres })}</strong>
        </p>
        {lignesTresorerie.length > 0 && (
          <ul style={{ margin: '0.2rem 0 0', paddingLeft: '1.2rem' }}>
            {lignesTresorerie.map((l, i) => (
              <li key={`${l.label}-${i}`}>
                {t('resume.ledgerLine', { label: l.label, sign: l.montant > 0 ? '+' : '', montant: l.montant })}
              </li>
            ))}
          </ul>
        )}
      </div>
      {entretienMalepierre > 0 && (
        <p className="text-sm">{t('resume.warpstoneUpkeep', { n: entretienMalepierre })}</p>
      )}
      {francsTireursPartants.length > 0 && (
        <p className="text-sm">
          {t('resume.departuresLine', { noms: francsTireursPartants.join(', ') })}{' '}
          {francsTireursPartants.length === 1 ? t('resume.experienceLostSingular') : t('resume.experienceLostPlural')}
        </p>
      )}
      {docteurResultats.length > 0 && (
        <div className="text-sm">
          <p className="mb-0">{t('resume.doctorResultsTitle')}</p>
          <ul style={{ margin: '0.2rem 0 0.6rem', paddingLeft: '1.2rem' }}>
            {docteurResultats.map((d, i) => (
              <li key={`${d.nom}-${i}`}>
                {d.nom} — 2D6 = {d.jet} : <strong>{d.titre}</strong> (
                {t('resume.doctorConsultationCost', { n: COUT_DOCTEUR })})
              </li>
            ))}
          </ul>
        </div>
      )}
      {rechercheRareResultats.length > 0 && (
        <div className="text-sm">
          <p className="mb-0">{t('resume.rareSearchTitle')}</p>
          <ul style={{ margin: '0.2rem 0 0.6rem', paddingLeft: '1.2rem' }}>
            {rechercheRareResultats.map((r, i) => (
              <li key={`${r.nom}-${i}`} className={r.reussi ? 'text-success' : 'text-danger'}>
                {r.nom} — {r.objetNom} (Rare {r.rarete}) :{' '}
                {r.reussi ? (r.achete ? t('resume.rareSearchSucceededBought') : t('resume.rareSearchSucceededNotBought')) : t('resume.searchFailed')}
              </li>
            ))}
          </ul>
        </div>
      )}
      {dramatisPersonaeResultats.length > 0 && (
        <div className="text-sm">
          <p className="mb-0">{t('resume.dramatisPersonaeTitle')}</p>
          <ul style={{ margin: '0.2rem 0 0.6rem', paddingLeft: '1.2rem' }}>
            {dramatisPersonaeResultats.map((r, i) => (
              <li key={`${r.nom}-${i}`} className={r.reussi ? 'text-success' : 'text-danger'}>
                {r.nom} — {r.dpNom} :{' '}
                {r.reussi ? (r.recrute ? t('resume.dpSucceededRecruited') : t('resume.dpSucceededNotRecruited')) : t('resume.searchFailed')}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-sm mb-0">
        {blessuresResume.length > 0
          ? t('resume.injuriesRecordedSome', { n: blessuresResume.length })
          : t('resume.injuriesRecordedNone', { n: blessuresResume.length })}
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
        {t('resume.outOfAction', {
          survivants: horsDeCombatIndividuel.filter((m) => xpDraftDe(m, m.xp).survecu === 'oui').length,
          morts: horsDeCombatIndividuel.filter((m) => xpDraftDe(m, m.xp).survecu === 'non').length,
        })}
        {groupesHC.length > 0 && t('resume.partialGroupsResolved', { n: groupesHC.length })}
      </p>
      <p className="text-sm">{t('resume.participationXp', { n: participantsAuto.length })}</p>
      {avancesResolues.length > 0 && (
        <p className="text-sm">
          {t('resume.advancesResolved', {
            n: avancesResolues.length,
            liste: avancesResolues.map((a) => `${a.nom} (${a.detail})`).join(', '),
          })}
        </p>
      )}
      {resultat === 'victoire' && !!resolveLeader(roster, catalogue) && (
        <p className="text-sm">{t('resume.leaderVictoryBonus')}</p>
      )}
    </div>
  );
}

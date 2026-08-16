import { useState } from 'react';
import { Modal } from '../common/Modal';
import { BlessureGraveWizard, type BlessureGraveResultat } from '../personnage/BlessureGraveWizard';
import { trouverBlessure } from '../../data/blessuresGraves';
import { estFrancTireur } from '../../data/hiredSwords';
import { nomAffiche } from '../../utils/profil';
import { peutGagnerExperience } from '../../utils/xp';
import type { Member, RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { resolveProfil } from '../../utils/profil';
import { injuryLabelAffiche } from '../../utils/blessures';
import type { BlessureDraft, SlotDraft, XpDraft } from './PostBatailleScreen';
import { useLanguage } from '../../state/useLanguage';

const NOM_AVEUGLE_OEIL = trouverBlessure('aveugle_oeil')?.nom;

type EtapeBlessuresGravesProps = {
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  horsDeCombatHeros: Member[];
  horsDeCombatHommesDeMain: Member[];
  groupesHC: Member[];
  blessureDrafts: Record<string, BlessureDraft>;
  tresorerieDisponible: number;
  xpDraftDe: (m: Member, xpParDefaut: number) => XpDraft;
  definirSurvie: (m: Member, valeur: 'oui' | 'non') => void;
  slotsDe: (m: Member) => SlotDraft[];
  definirSlot: (m: Member, index: number, valeur: 'oui' | 'non') => void;
  onAppliquer: (m: Member, resultat: BlessureGraveResultat) => void;
  onReinitialiser: (m: Member) => void;
};

export function EtapeBlessuresGraves({
  roster,
  catalogue,
  horsDeCombatHeros,
  horsDeCombatHommesDeMain,
  groupesHC,
  blessureDrafts,
  tresorerieDisponible,
  xpDraftDe,
  definirSurvie,
  slotsDe,
  definirSlot,
  onAppliquer,
  onReinitialiser,
}: EtapeBlessuresGravesProps) {
  const { t, language } = useLanguage();
  const [blessureEnCours, setBlessureEnCours] = useState<string | null>(null);
  const membreEnCours = horsDeCombatHeros.find((h) => h.instance_id === blessureEnCours);
  const profilEnCours = membreEnCours ? resolveProfil(roster, membreEnCours, catalogue, language) : undefined;

  return (
    <>
      <div className="card">
        <h3>{t('postBataille.injuries.title')}</h3>
        <p className="text-sm text-muted">{t('postBataille.injuries.intro')}</p>
        {horsDeCombatHeros.length === 0 && <p className="text-muted">{t('postBataille.injuries.noneOutOfAction')}</p>}
        {horsDeCombatHeros.map((m) => {
          const d = blessureDrafts[m.instance_id];
          return (
            <div key={m.instance_id} className="card card--tight" style={{ marginBottom: '0.7rem' }}>
              <strong>{m.nom_perso}</strong>
              {!d && (
                <div style={{ marginTop: '0.5rem' }}>
                  <button className="btn--pack-pill-sm btn--pack-pill-sm--primary" onClick={() => setBlessureEnCours(m.instance_id)}>
                    {t('postBataille.injuries.resolveInjury')}
                  </button>
                </div>
              )}
              {d && (
                <div style={{ marginTop: '0.5rem' }}>
                  <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {injuryLabelAffiche(d, language)}
                  </p>
                  {d.statutMort && <p className="text-danger mb-0">{t('postBataille.injuries.markedDead')}</p>}
                  {d.perteEquipement && <p className="text-danger mb-0">{t('postBataille.injuries.equipmentLost')}</p>}
                  <button className="btn--pack-pill-sm" style={{ marginTop: '0.5rem' }} onClick={() => onReinitialiser(m)}>
                    {t('postBataille.injuries.modify')}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(horsDeCombatHommesDeMain.length > 0 || groupesHC.length > 0) && (
        <div className="card">
          <h3>{t('postBataille.injuries.henchmenTitle')}</h3>
          <p className="text-sm text-muted">{t('postBataille.injuries.henchmenIntro')}</p>
          {horsDeCombatHommesDeMain.map((m) => {
            const d = xpDraftDe(m, m.xp);
            const francTireur = estFrancTireur(m);
            const sansXp = !peutGagnerExperience(resolveProfil(roster, m, catalogue, language));
            return (
              <div key={m.instance_id} className="card card--tight" style={{ marginBottom: '0.7rem' }}>
                <strong>{nomAffiche(m)}</strong>
                <p className="text-sm text-muted" style={{ marginTop: '0.4rem', marginBottom: 0 }}>
                  {t('gainXp.rollInstruction', { suffix: francTireur ? t('gainXp.rollForHiredSword') : '' })}
                </p>
                <div className="status-select" style={{ marginTop: '0.5rem' }}>
                  <button
                    className={`status-pill ${d.survecu === 'oui' ? 'status-pill--active' : ''}`}
                    onClick={() => definirSurvie(m, 'oui')}
                  >
                    {t('gainXp.survived', { xp: sansXp ? '' : t('gainXp.survivedXpSuffix') })}
                  </button>
                  <button
                    className={`status-pill ${d.survecu === 'non' ? 'status-pill--active' : ''}`}
                    onClick={() => definirSurvie(m, 'non')}
                  >
                    {t('gainXp.didNotSurvive')}
                  </button>
                </div>
              </div>
            );
          })}
          {groupesHC.map((m) => {
            const slots = slotsDe(m);
            const enAttente = slots.filter((s) => s === null).length;
            return (
              <div key={m.instance_id} className="card card--tight" style={{ marginBottom: '0.7rem' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '0.4rem' }}>
                  <strong>{nomAffiche(m)}</strong>
                  <span className="text-sm text-muted">
                    {t('gainXp.outOfActionCount', { hc: m.hors_combat, total: m.taille_groupe })}
                  </span>
                </div>
                <div className="flex flex-wrap gap-sm">
                  {slots.map((s, i) => (
                    <div key={i} className="flex items-center gap-sm">
                      <span className="text-sm text-muted">#{i + 1}</span>
                      <button className={`btn btn--sm ${s === 'oui' ? 'btn--primary' : ''}`} onClick={() => definirSlot(m, i, 'oui')}>
                        {t('gainXp.survivedShort')}
                      </button>
                      <button className={`btn btn--sm ${s === 'non' ? 'btn--danger' : ''}`} onClick={() => definirSlot(m, i, 'non')}>
                        {t('gainXp.deadShort')}
                      </button>
                    </div>
                  ))}
                </div>
                {enAttente > 0 && (
                  <p className="text-sm text-muted" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                    {t('gainXp.modelsToResolve', { n: enAttente })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {membreEnCours && (
        <Modal onClose={() => setBlessureEnCours(null)}>
          <h3>{t('postBataille.injuries.modalTitle', { nom: membreEnCours.nom_perso })}</h3>
          <BlessureGraveWizard
            nomPersonnage={membreEnCours.nom_perso}
            dejaAveugle={membreEnCours.blessures_graves.some((b) => b.nom === NOM_AVEUGLE_OEIL)}
            tresorerieDisponible={tresorerieDisponible}
            estEternelle={!!profilEnCours?.eternelle}
            pvActuelProfil={membreEnCours.stats_actuels.PV}
            statsPersonnage={membreEnCours.stats_actuels}
            equipementPersonnage={membreEnCours.inventaire.map((e) => e.nom)}
            reglesSpecialesPersonnage={profilEnCours?.regles_speciales}
            onAppliquer={(resultat) => {
              onAppliquer(membreEnCours, resultat);
              setBlessureEnCours(null);
            }}
            onAnnuler={() => setBlessureEnCours(null)}
          />
        </Modal>
      )}
    </>
  );
}

import { useState } from 'react';
import { Modal } from '../common/Modal';
import { BlessureGraveWizard, type BlessureGraveResultat } from '../personnage/BlessureGraveWizard';
import { trouverBlessure } from '../../data/blessuresGraves';
import type { Member, RosterInstance } from '../../types/roster';
import { resolveProfil } from '../../utils/profil';
import type { BlessureDraft } from './PostBatailleScreen';
import { useLanguage } from '../../state/useLanguage';

const NOM_AVEUGLE_OEIL = trouverBlessure('aveugle_oeil')?.nom;

type EtapeBlessuresGravesProps = {
  roster: RosterInstance;
  horsDeCombatHeros: Member[];
  blessureDrafts: Record<string, BlessureDraft>;
  tresorerieDisponible: number;
  onAppliquer: (m: Member, resultat: BlessureGraveResultat) => void;
  onReinitialiser: (m: Member) => void;
};

export function EtapeBlessuresGraves({
  roster,
  horsDeCombatHeros,
  blessureDrafts,
  tresorerieDisponible,
  onAppliquer,
  onReinitialiser,
}: EtapeBlessuresGravesProps) {
  const { t } = useLanguage();
  const [blessureEnCours, setBlessureEnCours] = useState<string | null>(null);
  const membreEnCours = horsDeCombatHeros.find((h) => h.instance_id === blessureEnCours);
  const profilEnCours = membreEnCours ? resolveProfil(roster, membreEnCours) : undefined;

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
                  <button className="btn btn--primary btn--sm" onClick={() => setBlessureEnCours(m.instance_id)}>
                    {t('postBataille.injuries.resolveInjury')}
                  </button>
                </div>
              )}
              {d && (
                <div style={{ marginTop: '0.5rem' }}>
                  <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {d.description}
                  </p>
                  {d.statutMort && <p className="text-danger mb-0">{t('postBataille.injuries.markedDead')}</p>}
                  {d.perteEquipement && <p className="text-danger mb-0">{t('postBataille.injuries.equipmentLost')}</p>}
                  <button className="btn btn--sm" style={{ marginTop: '0.5rem' }} onClick={() => onReinitialiser(m)}>
                    {t('postBataille.injuries.modify')}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

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

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Member, SeriousInjuryRecord } from '../../types/roster';
import type { Profile } from '../../types/catalog';
import { Modal } from '../common/Modal';
import { BlessureGraveWizard, type BlessureGraveResultat } from './BlessureGraveWizard';
import { estRetablissementIsole, trouverBlessure } from '../../data/blessuresGraves';
import { appliquerDeltaStats } from '../../utils/blessures';

type Props = {
  member: Member;
  profil?: Profile;
  tresorerieDisponible: number;
  onClose: () => void;
  onApply: (member: Member, tresorerieBonus: number) => void;
};

const NOM_AVEUGLE_OEIL = trouverBlessure('aveugle_oeil')?.nom;

export function BlessureGraveModal({ member, profil, tresorerieDisponible, onClose, onApply }: Props) {
  const [applique, setApplique] = useState(false);
  const dejaAveugle = member.blessures_graves.some((b) => b.nom === NOM_AVEUGLE_OEIL);

  const appliquer = (resultat: BlessureGraveResultat) => {
    const { stats_actuels, notes, statsTouchees } = appliquerDeltaStats(
      member.stats_actuels,
      member.notes,
      resultat.statsDelta,
      resultat.notes
    );

    let updated: Member = {
      ...member,
      stats_actuels,
      stats_modifiees: Array.from(new Set([...member.stats_modifiees, ...statsTouchees])),
      notes,
      xp: member.xp + resultat.xpBonus,
    };
    if (!estRetablissementIsole(resultat.effets)) {
      const record: SeriousInjuryRecord = {
        id: uuidv4(),
        date: new Date().toISOString().slice(0, 10),
        description: resultat.texte,
        nom: resultat.nom,
        effets: resultat.effets.map((effet) => ({ ...effet, id: uuidv4() })),
      };
      updated = { ...updated, blessures_graves: [...member.blessures_graves, record] };
    }
    if (resultat.perteEquipement) {
      updated = { ...updated, inventaire: [], equipement: '' };
    }
    if (resultat.statutMort) {
      updated = { ...updated, statut: 'mort', date_mort: new Date().toISOString().slice(0, 10) };
    }
    onApply(updated, resultat.tresorerieBonus);
    setApplique(true);
  };

  return (
    <Modal onClose={onClose}>
      <h3>Blessure grave — {member.nom_perso}</h3>
      {!applique && (
        <BlessureGraveWizard
          nomPersonnage={member.nom_perso}
          dejaAveugle={dejaAveugle}
          tresorerieDisponible={tresorerieDisponible}
          estEternelle={!!profil?.eternelle}
          pvActuelProfil={member.stats_actuels.PV}
          statsPersonnage={member.stats_actuels}
          onAppliquer={appliquer}
          onAnnuler={onClose}
        />
      )}
      {applique && (
        <>
          <p className="text-success">Blessure enregistrée dans l'historique.</p>
          <button className="btn btn--primary btn--block" onClick={onClose}>
            Fermer
          </button>
        </>
      )}
    </Modal>
  );
}

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Member, SeriousInjuryRecord } from '../../types/roster';
import { STAT_KEYS } from '../../types/catalog';
import { Modal } from '../common/Modal';
import { BlessureGraveWizard, type BlessureGraveResultat } from './BlessureGraveWizard';
import { trouverBlessure } from '../../data/blessuresGraves';

type Props = {
  member: Member;
  onClose: () => void;
  onApply: (member: Member, tresorerieBonus: number) => void;
};

const NOM_AVEUGLE_OEIL = trouverBlessure('aveugle_oeil')?.nom;

export function BlessureGraveModal({ member, onClose, onApply }: Props) {
  const [applique, setApplique] = useState(false);
  const dejaAveugle = member.blessures_graves.some((b) => b.nom === NOM_AVEUGLE_OEIL);

  const appliquer = (resultat: BlessureGraveResultat) => {
    const record: SeriousInjuryRecord = {
      id: uuidv4(),
      date: new Date().toISOString().slice(0, 10),
      description: resultat.texte,
      nom: resultat.nom,
    };
    const statsActuels = { ...member.stats_actuels };
    const statsModifiees = new Set(member.stats_modifiees);
    for (const k of STAT_KEYS) {
      const delta = resultat.statsDelta[k];
      if (delta) {
        statsActuels[k] += delta;
        statsModifiees.add(k);
      }
    }
    const notes = resultat.notes.length
      ? [member.notes, ...resultat.notes].filter(Boolean).join('\n')
      : member.notes;

    let updated: Member = {
      ...member,
      stats_actuels: statsActuels,
      stats_modifiees: Array.from(statsModifiees),
      notes,
      blessures_graves: [...member.blessures_graves, record],
      xp: member.xp + resultat.xpBonus,
    };
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

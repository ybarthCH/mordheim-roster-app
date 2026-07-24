import { useState } from 'react';
import { Modal } from '../common/Modal';
import { BlessureGraveWizard, type BlessureGraveResultat } from '../personnage/BlessureGraveWizard';
import { trouverBlessure } from '../../data/blessuresGraves';
import type { Member } from '../../types/roster';
import type { BlessureDraft } from './PostBatailleScreen';

const NOM_AVEUGLE_OEIL = trouverBlessure('aveugle_oeil')?.nom;

type EtapeBlessuresGravesProps = {
  horsDeCombatHeros: Member[];
  blessureDrafts: Record<string, BlessureDraft>;
  onAppliquer: (m: Member, resultat: BlessureGraveResultat) => void;
  onReinitialiser: (m: Member) => void;
};

export function EtapeBlessuresGraves({
  horsDeCombatHeros,
  blessureDrafts,
  onAppliquer,
  onReinitialiser,
}: EtapeBlessuresGravesProps) {
  const [blessureEnCours, setBlessureEnCours] = useState<string | null>(null);
  const membreEnCours = horsDeCombatHeros.find((h) => h.instance_id === blessureEnCours);

  return (
    <>
      <div className="card">
        <h3>Blessures graves</h3>
        <p className="text-sm text-muted">
          Pour chaque héros Hors de Combat, lance sur ta table papier puis résous le résultat obtenu : les effets
          (caractéristiques, équipement, notes) sont appliqués automatiquement, et le choix Oui/Non « A survécu » de
          l'étape suivante est pré-rempli en fonction du résultat. Les hommes de main utilisent la table simple
          mort-ou-survivant à l'étape suivante.
        </p>
        {horsDeCombatHeros.length === 0 && <p className="text-muted">Aucun héros Hors de Combat.</p>}
        {horsDeCombatHeros.map((m) => {
          const d = blessureDrafts[m.instance_id];
          return (
            <div key={m.instance_id} className="card card--tight" style={{ marginBottom: '0.7rem' }}>
              <strong>{m.nom_perso}</strong>
              {!d && (
                <div style={{ marginTop: '0.5rem' }}>
                  <button className="btn btn--primary btn--sm" onClick={() => setBlessureEnCours(m.instance_id)}>
                    Résoudre la blessure grave
                  </button>
                </div>
              )}
              {d && (
                <div style={{ marginTop: '0.5rem' }}>
                  <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {d.description}
                  </p>
                  {d.statutMort && <p className="text-danger mb-0">⚠ Marqué Mort.</p>}
                  {d.perteEquipement && <p className="text-danger mb-0">⚠ Équipement perdu.</p>}
                  <button className="btn btn--sm" style={{ marginTop: '0.5rem' }} onClick={() => onReinitialiser(m)}>
                    Modifier
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {membreEnCours && (
        <Modal onClose={() => setBlessureEnCours(null)}>
          <h3>Blessure grave — {membreEnCours.nom_perso}</h3>
          <BlessureGraveWizard
            nomPersonnage={membreEnCours.nom_perso}
            dejaAveugle={membreEnCours.blessures_graves.some((b) => b.nom === NOM_AVEUGLE_OEIL)}
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

import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import { FRANCS_TIREURS, disponibiliteFrancTireur } from '../../data/hiredSwords';
import { creerMembreFrancTireurCatalogue } from '../../utils/factory';
import { ajouterEffetPersistant, CLE_FRANC_TIREUR_GRATUIT } from '../../utils/effetsPersistants';

type Props = {
  roster: RosterInstance;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  onAjouterAuJournal: (texte: string) => void;
};

// (6 6 6) Débiteur reconnaissant — engage gratuitement un Franc-tireur pour
// la durée de la prochaine bataille (exemption d'entretien consommée à la
// prochaine résolution d'Entretien, voir PostBatailleScreen.lignesEntretien).
// Limité aux profils sans sorts de départ à choisir ni sacrifice de Liche,
// pour rester une action en un clic — ces cas restent à engager depuis
// l'écran de recrutement habituel si besoin.
export function ResolutionDebiteurReconnaissant({ roster, onMajRoster, onAjouterAuJournal }: Props) {
  const [francTireurId, setFrancTireurId] = useState('');

  const disponibles = FRANCS_TIREURS.filter(
    (f) => !f.magie?.sorts_depart && !f.sacrifice_liche && disponibiliteFrancTireur(f, roster).disponible
  );

  const engager = () => {
    const francTireur = disponibles.find((f) => f.id === francTireurId);
    if (!francTireur) return;
    const membre = creerMembreFrancTireurCatalogue(francTireur);
    onMajRoster({
      membres: [...roster.membres, membre],
      ...ajouterEffetPersistant(roster, {
        cle: CLE_FRANC_TIREUR_GRATUIT,
        label: `${francTireur.nom} engagé gratuitement (Débiteur reconnaissant)`,
        cible: membre.instance_id,
      }),
    });
    onAjouterAuJournal(
      `Débiteur reconnaissant : ${francTireur.nom} rejoint la bande gratuitement pour la prochaine bataille.`
    );
    setFrancTireurId('');
  };

  return (
    <div style={{ marginTop: '0.6rem' }}>
      <div className="field">
        <label>Franc-tireur engagé gratuitement</label>
        <select value={francTireurId} onChange={(e) => setFrancTireurId(e.target.value)}>
          <option value="">— Choisir —</option>
          {disponibles.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nom}
            </option>
          ))}
        </select>
      </div>
      {disponibles.length === 0 && (
        <p className="text-sm text-muted">Aucun Franc-tireur disponible pour cette bande pour l'instant.</p>
      )}
      <button type="button" className="btn btn--sm btn--primary" disabled={!francTireurId} onClick={engager}>
        Engager gratuitement
      </button>
    </div>
  );
}

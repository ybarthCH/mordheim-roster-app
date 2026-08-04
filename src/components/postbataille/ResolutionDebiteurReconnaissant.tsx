import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import { FRANCS_TIREURS, disponibiliteFrancTireur } from '../../data/hiredSwords';
import { translateHiredSword } from '../../i18n/data/hiredSwords';
import { creerMembreFrancTireurCatalogue } from '../../utils/factory';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  roster: RosterInstance;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  onAjouterAuJournal: (texte: string) => void;
};

// (6 6 6) Débiteur reconnaissant — engage un Franc-tireur sans payer son coût
// de recrutement initial. Son entretien (solde) suit ensuite les règles
// normales dès la bataille suivante, comme n'importe quel autre engagement.
// Limité aux profils sans sorts de départ à choisir ni sacrifice de Liche,
// pour rester une action en un clic — ces cas restent à engager depuis
// l'écran de recrutement habituel si besoin.
export function ResolutionDebiteurReconnaissant({ roster, onMajRoster, onAjouterAuJournal }: Props) {
  const { t, language } = useLanguage();
  const [francTireurId, setFrancTireurId] = useState('');
  // Se verrouille une fois un Franc-tireur engagé : l'événement n'en accorde
  // qu'un seul gratuitement, mais rien n'empêchait de resélectionner un
  // autre profil dans la liste et de recliquer pour en engager plusieurs.
  const [resolu, setResolu] = useState<string | null>(null);

  const disponibles = FRANCS_TIREURS.filter(
    (f) =>
      !f.est_dramatis_personae &&
      !f.magie?.sorts_depart &&
      !f.sacrifice_liche &&
      disponibiliteFrancTireur(f, roster).disponible
  ).map((f) => translateHiredSword(f, language));

  const engager = () => {
    const francTireur = disponibles.find((f) => f.id === francTireurId);
    if (!francTireur) return;
    const membre = creerMembreFrancTireurCatalogue(francTireur);
    onMajRoster({
      membres: [...roster.membres, membre],
    });
    onAjouterAuJournal(
      `Débiteur reconnaissant : ${francTireur.nom} rejoint la bande sans frais de recrutement.`
    );
    setResolu(francTireur.nom);
  };

  if (resolu) {
    return (
      <p className="text-sm text-success" style={{ marginTop: '0.6rem' }}>
        {t('postBataille.debtor.hiredForFree', { nom: resolu })}
      </p>
    );
  }

  return (
    <div style={{ marginTop: '0.6rem' }}>
      <div className="field">
        <label>{t('postBataille.debtor.freeRecruitLabel')}</label>
        <select value={francTireurId} onChange={(e) => setFrancTireurId(e.target.value)}>
          <option value="">{t('postBataille.chooseEllipsis')}</option>
          {disponibles.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nom}
            </option>
          ))}
        </select>
      </div>
      {disponibles.length === 0 && (
        <p className="text-sm text-muted">{t('postBataille.debtor.noneAvailable')}</p>
      )}
      <button type="button" className="btn btn--sm btn--primary" disabled={!francTireurId} onClick={engager}>
        {t('postBataille.debtor.hireForFree')}
      </button>
    </div>
  );
}

import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import { resolveProfil } from '../../utils/profil';
import { equipementPerduALaMort } from '../../utils/shop';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  roster: RosterInstance;
  date: string;
  // Nom traduit de l'événement (voir evenementAffiche dans EvenementExploration),
  // utilisé comme préfixe des entrées de journal ci-dessous.
  nomEvenement: string;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  onAjouterAuJournal: (texte: string) => void;
};

// (6 1) La Fosse — même principe que Puits, mais l'échec est mortel (le
// héros ne revient pas) et le gain de fragments est variable (D6+1, à
// reporter depuis la table papier) au lieu d'un fragment fixe.
export function ResolutionLaFosse({ roster, date, nomEvenement, onMajRoster, onAjouterAuJournal }: Props) {
  const { t } = useLanguage();
  const [heroId, setHeroId] = useState('');
  const [jetFragments, setJetFragments] = useState('');
  // Se verrouille une fois le jet résolu : côté échec le héros passe au
  // statut mort et disparaît naturellement de la liste, mais côté réussite
  // rien n'empêchait de rester sur le même héros (toujours vivant) et de
  // recliquer « Réussi » pour empocher plusieurs fois les fragments.
  const [resolu, setResolu] = useState<string | null>(null);

  const heros = roster.membres.filter((m) => m.statut !== 'mort' && resolveProfil(roster, m)?.type === 'heros');
  const hero = heros.find((m) => m.instance_id === heroId);
  const valeurFragments = Number(jetFragments);
  const jetValide = jetFragments.trim() !== '' && Number.isFinite(valeurFragments) && valeurFragments > 0;

  const appliquerReussite = () => {
    if (!hero || !jetValide) return;
    onMajRoster({ wyrdstone: roster.wyrdstone + valeurFragments });
    const texte = t('postBataille.pit.returnedWithFragments', {
      nom: hero.nom_perso,
      n: valeurFragments,
      s: valeurFragments > 1 ? 's' : '',
    });
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setResolu(texte);
  };

  const appliquerEchec = () => {
    if (!hero) return;
    onMajRoster({
      membres: roster.membres.map((m) =>
        m.instance_id === hero.instance_id
          ? { ...m, statut: 'mort' as const, date_mort: date, ...equipementPerduALaMort() }
          : m
      ),
    });
    const texte = `${hero.nom_perso} ${t('postBataille.pit.devoured')}`;
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setResolu(texte);
  };

  if (resolu) {
    return (
      <p className="text-sm text-success" style={{ marginTop: '0.6rem' }}>
        {t('postBataille.pit.result', { texte: resolu })}
      </p>
    );
  }

  return (
    <div style={{ marginTop: '0.6rem' }}>
      <div className="field">
        <label>{t('postBataille.pit.heroLabel')}</label>
        <select value={heroId} onChange={(e) => setHeroId(e.target.value)}>
          <option value="">{t('postBataille.chooseEllipsis')}</option>
          {heros.map((m) => (
            <option key={m.instance_id} value={m.instance_id}>
              {m.nom_perso}
            </option>
          ))}
        </select>
      </div>
      {hero && (
        <>
          <p className="text-sm text-muted" style={{ marginBottom: '0.4rem' }}>
            {t('postBataille.pit.rollInstruction', { nom: hero.nom_perso })}
          </p>
          <div className="flex gap-sm items-center" style={{ flexWrap: 'wrap', marginBottom: '0.4rem' }}>
            <span className="text-sm text-muted">{t('postBataille.pit.fragmentsObtained')}</span>
            <input
              type="number"
              min={1}
              style={{ width: '4rem' }}
              value={jetFragments}
              onChange={(e) => setJetFragments(e.target.value)}
            />
          </div>
          <div className="flex gap-sm">
            <button type="button" className="btn--pack-pill-sm btn--pack-pill-sm--primary" disabled={!jetValide} onClick={appliquerReussite}>
              {t('postBataille.success')}
            </button>
            <button type="button" className="btn--pack-pill-sm" onClick={appliquerEchec}>
              {t('postBataille.failure')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

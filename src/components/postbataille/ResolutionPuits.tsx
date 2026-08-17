import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import { resolveProfil } from '../../utils/profil';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  roster: RosterInstance;
  // Nom traduit de l'événement (voir evenementAffiche dans EvenementExploration),
  // utilisé comme préfixe des entrées de journal ci-dessous.
  nomEvenement: string;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  onAjouterAuJournal: (texte: string) => void;
};

// (1 1) Puits — un héros au choix teste son Endurance contre un jet de 1D6.
export function ResolutionPuits({ roster, nomEvenement, onMajRoster, onAjouterAuJournal }: Props) {
  const { t } = useLanguage();
  const [heroId, setHeroId] = useState('');
  // Se verrouille une fois le test résolu : sans ça, le héros envoyé au
  // puits restait sélectionnable et « Réussi » recliquable, permettant de
  // trouver plusieurs fragments de pierre magique pour un seul événement.
  const [resolu, setResolu] = useState<string | null>(null);

  const heros = roster.membres.filter((m) => m.statut !== 'mort' && resolveProfil(roster, m)?.type === 'heros');
  const hero = heros.find((m) => m.instance_id === heroId);

  const appliquerReussite = () => {
    if (!hero) return;
    onMajRoster({ wyrdstone: roster.wyrdstone + 1 });
    const texte = t('postBataille.well.foundFragment', { nom: hero.nom_perso });
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setResolu(texte);
  };

  const appliquerEchec = () => {
    if (!hero) return;
    onMajRoster({
      membres: roster.membres.map((m) =>
        m.instance_id === hero.instance_id ? { ...m, statut: 'blesse', blesse_tour_actuel: 0, blesse_tour_total: 1 } : m
      ),
    });
    const texte = t('postBataille.well.tainted', { nom: hero.nom_perso });
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setResolu(texte);
  };

  if (resolu) {
    return (
      <p className="text-sm text-success" style={{ marginTop: '0.6rem' }}>
        {t('postBataille.well.result', { texte: resolu })}
      </p>
    );
  }

  return (
    <div style={{ marginTop: '0.6rem' }}>
      <div className="field">
        <label>{t('postBataille.well.heroLabel')}</label>
        <select value={heroId} onChange={(e) => setHeroId(e.target.value)}>
          <option value="">{t('postBataille.chooseEllipsis')}</option>
          {heros.map((m) => (
            <option key={m.instance_id} value={m.instance_id}>
              {m.nom_perso} (E{m.stats_actuels.E})
            </option>
          ))}
        </select>
      </div>
      {hero && (
        <>
          <p className="text-sm text-muted" style={{ marginBottom: '0.4rem' }}>
            {t('postBataille.well.enduranceTest', { e: hero.stats_actuels.E })}
          </p>
          <div className="flex gap-sm">
            <button type="button" className="btn--pack-pill-sm btn--pack-pill-sm--primary" onClick={appliquerReussite}>
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

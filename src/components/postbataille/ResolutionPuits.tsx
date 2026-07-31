import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import { resolveProfil } from '../../utils/profil';

type Props = {
  roster: RosterInstance;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  onAjouterAuJournal: (texte: string) => void;
};

// (1 1) Puits — un héros au choix teste son Endurance contre un jet de 1D6.
export function ResolutionPuits({ roster, onMajRoster, onAjouterAuJournal }: Props) {
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
    onAjouterAuJournal(`Puits : ${hero.nom_perso} trouve un fragment de pierre magique.`);
    setResolu(`${hero.nom_perso} trouve un fragment de pierre magique.`);
  };

  const appliquerEchec = () => {
    if (!hero) return;
    onMajRoster({
      membres: roster.membres.map((m) =>
        m.instance_id === hero.instance_id ? { ...m, statut: 'blesse', blesse_tour_actuel: 0, blesse_tour_total: 1 } : m
      ),
    });
    onAjouterAuJournal(`Puits : ${hero.nom_perso} avale de l'eau impure — Blessé, rate la prochaine bataille.`);
    setResolu(`${hero.nom_perso} avale de l'eau impure — Blessé.`);
  };

  if (resolu) {
    return (
      <p className="text-sm text-success" style={{ marginTop: '0.6rem' }}>
        ✓ Puits : {resolu}
      </p>
    );
  }

  return (
    <div style={{ marginTop: '0.6rem' }}>
      <div className="field">
        <label>Héros envoyé au puits</label>
        <select value={heroId} onChange={(e) => setHeroId(e.target.value)}>
          <option value="">— Choisir —</option>
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
            Test d'Endurance (1D6, réussi si ≤ E{hero.stats_actuels.E}) :
          </p>
          <div className="flex gap-sm">
            <button type="button" className="btn btn--sm btn--primary" onClick={appliquerReussite}>
              Réussi
            </button>
            <button type="button" className="btn btn--sm" onClick={appliquerEchec}>
              Raté
            </button>
          </div>
        </>
      )}
    </div>
  );
}

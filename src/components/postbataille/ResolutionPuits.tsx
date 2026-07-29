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
  const [jet, setJet] = useState('');

  const heros = roster.membres.filter((m) => m.statut !== 'mort' && resolveProfil(roster, m)?.type === 'heros');
  const hero = heros.find((m) => m.instance_id === heroId);
  const jetNombre = Number(jet);
  const jetValide = jet.trim() !== '' && Number.isFinite(jetNombre) && jetNombre >= 1 && jetNombre <= 6;
  const reussite = jetValide && hero ? jetNombre <= hero.stats_actuels.E : null;

  const appliquerReussite = () => {
    if (!hero) return;
    onMajRoster({ wyrdstone: roster.wyrdstone + 1 });
    onAjouterAuJournal(`Puits : ${hero.nom_perso} trouve un fragment de pierre magique (jet ${jetNombre} ≤ E${hero.stats_actuels.E}).`);
    setHeroId('');
    setJet('');
  };

  const appliquerEchec = () => {
    if (!hero) return;
    onMajRoster({
      membres: roster.membres.map((m) =>
        m.instance_id === hero.instance_id ? { ...m, statut: 'blesse', blesse_tour_actuel: 0, blesse_tour_total: 1 } : m
      ),
    });
    onAjouterAuJournal(
      `Puits : ${hero.nom_perso} avale de l'eau impure (jet ${jetNombre} > E${hero.stats_actuels.E}) — Blessé, rate la prochaine bataille.`
    );
    setHeroId('');
    setJet('');
  };

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
        <div className="flex gap-sm items-center" style={{ flexWrap: 'wrap' }}>
          <span className="text-sm text-muted">Jet (1D6, réussi si ≤ E{hero.stats_actuels.E}) :</span>
          <input type="number" min={1} max={6} style={{ width: '4rem' }} value={jet} onChange={(e) => setJet(e.target.value)} />
        </div>
      )}
      {hero && jetValide && (
        <p className={`text-sm ${reussite ? 'text-success' : 'text-danger'}`} style={{ marginTop: '0.4rem' }}>
          {reussite
            ? `Réussite : ${hero.nom_perso} trouve un fragment de pierre magique.`
            : `Échec : ${hero.nom_perso} tombe malade et doit manquer la prochaine partie.`}
        </p>
      )}
      {hero && jetValide && (
        <button
          type="button"
          className="btn btn--sm btn--primary"
          style={{ marginTop: '0.3rem' }}
          onClick={reussite ? appliquerReussite : appliquerEchec}
        >
          {reussite ? '+1 fragment de pierre magique' : `Marquer ${hero.nom_perso} Blessé`}
        </button>
      )}
    </div>
  );
}

import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import { resolveProfil } from '../../utils/profil';

type Props = {
  roster: RosterInstance;
  date: string;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  onAjouterAuJournal: (texte: string) => void;
};

// (6 1) La Fosse — même principe que Puits, mais l'échec est mortel (le
// héros ne revient pas) et le gain de fragments est variable (D6+1, à
// reporter depuis la table papier) au lieu d'un fragment fixe.
export function ResolutionLaFosse({ roster, date, onMajRoster, onAjouterAuJournal }: Props) {
  const [heroId, setHeroId] = useState('');
  const [jetFragments, setJetFragments] = useState('');

  const heros = roster.membres.filter((m) => m.statut !== 'mort' && resolveProfil(roster, m)?.type === 'heros');
  const hero = heros.find((m) => m.instance_id === heroId);
  const valeurFragments = Number(jetFragments);
  const jetValide = jetFragments.trim() !== '' && Number.isFinite(valeurFragments) && valeurFragments > 0;

  const appliquerReussite = () => {
    if (!hero || !jetValide) return;
    onMajRoster({ wyrdstone: roster.wyrdstone + valeurFragments });
    onAjouterAuJournal(
      `La Fosse : ${hero.nom_perso} revient avec ${valeurFragments} fragment${valeurFragments > 1 ? 's' : ''} de pierre magique (D6+1).`
    );
    setHeroId('');
    setJetFragments('');
  };

  const appliquerEchec = () => {
    if (!hero) return;
    onMajRoster({
      membres: roster.membres.map((m) =>
        m.instance_id === hero.instance_id ? { ...m, statut: 'mort' as const, date_mort: date } : m
      ),
    });
    onAjouterAuJournal(`La Fosse : ${hero.nom_perso} est dévoré par les gardiens de la Fosse — mort.`);
    setHeroId('');
    setJetFragments('');
  };

  return (
    <div style={{ marginTop: '0.6rem' }}>
      <div className="field">
        <label>Héros envoyé dans la Fosse</label>
        <select value={heroId} onChange={(e) => setHeroId(e.target.value)}>
          <option value="">— Choisir —</option>
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
            Jet de 1D6 : sur un 1, {hero.nom_perso} est dévoré et ne revient pas. Sur 2+, il revient avec D6+1
            fragments de pierre magique.
          </p>
          <div className="flex gap-sm items-center" style={{ flexWrap: 'wrap', marginBottom: '0.4rem' }}>
            <span className="text-sm text-muted">Fragments obtenus (D6+1) :</span>
            <input
              type="number"
              min={1}
              style={{ width: '4rem' }}
              value={jetFragments}
              onChange={(e) => setJetFragments(e.target.value)}
            />
          </div>
          <div className="flex gap-sm">
            <button type="button" className="btn btn--sm btn--primary" disabled={!jetValide} onClick={appliquerReussite}>
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

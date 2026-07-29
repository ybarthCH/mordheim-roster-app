import { useState } from 'react';

type Props = {
  label: string;
  onValider: (valeur: number) => void;
  boutonLabel?: string;
};

// Saisie d'un jet physique (fait sur table papier) suivie d'un bouton
// d'application — motif partagé par tous les gains d'or automatisables des
// événements d'exploration (voir EvenementExploration/ResolutionVagabond).
export function JetOrButton({ label, onValider, boutonLabel = 'Ajouter à la trésorerie' }: Props) {
  const [jet, setJet] = useState('');
  const valeur = Number(jet);
  const valide = jet.trim() !== '' && Number.isFinite(valeur) && valeur > 0;

  return (
    <div className="flex gap-sm items-center" style={{ marginTop: '0.5rem', flexWrap: 'wrap' }}>
      <span className="text-sm text-muted">{label}</span>
      <input type="number" min={0} style={{ width: '5rem' }} value={jet} onChange={(e) => setJet(e.target.value)} />
      <button
        type="button"
        className="btn btn--sm btn--primary"
        disabled={!valide}
        onClick={() => {
          onValider(valeur);
          setJet('');
        }}
      >
        {boutonLabel}
      </button>
    </div>
  );
}

import { useState } from 'react';
import { useLanguage } from '../../state/useLanguage';
import { BoutonJetAuto } from './BoutonJetAuto';

type Props = {
  label: string;
  onValider: (valeur: number) => void;
  boutonLabel?: string;
  // Notation du jet demandé (« 2D6 », « D6x10 », « 30+2D6 »...), uniquement
  // pour proposer le bouton « Jet auto » quand le joueur a activé l'option
  // correspondante. Absente ou non jetable, aucun bouton n'apparaît et la
  // saisie reste strictement manuelle, comme avant.
  notation?: string | number | null;
};

// Saisie d'un jet physique (fait sur table papier) suivie d'un bouton
// d'application — motif partagé par tous les gains d'or automatisables des
// événements d'exploration (voir EvenementExploration/ResolutionVagabond).
// Se verrouille après application (confirmation affichée à la place des
// contrôles) : sans ça, rien n'empêchait de re-saisir un jet et de recliquer
// pour appliquer le même gain une seconde fois, sans même s'en apercevoir.
export function JetOrButton({ label, onValider, boutonLabel, notation }: Props) {
  const { t } = useLanguage();
  const [jet, setJet] = useState('');
  const [applique, setApplique] = useState(false);
  const valeur = Number(jet);
  const valide = jet.trim() !== '' && Number.isFinite(valeur) && valeur > 0;

  if (applique) {
    return (
      <p className="text-sm text-success" style={{ marginTop: '0.5rem' }}>
        {t('postBataille.appliedSeeJournal')}
      </p>
    );
  }

  return (
    <div className="flex gap-sm items-center" style={{ marginTop: '0.5rem', flexWrap: 'wrap' }}>
      <span className="text-sm text-muted">{label}</span>
      <input type="number" min={0} style={{ width: '5rem' }} value={jet} onChange={(e) => setJet(e.target.value)} />
      <BoutonJetAuto notation={notation} onResultat={(total) => setJet(String(total))} />
      <button
        type="button"
        className="btn--pack-pill-sm btn--pack-pill-sm--primary"
        disabled={!valide}
        onClick={() => {
          onValider(valeur);
          setApplique(true);
        }}
      >
        {boutonLabel ?? t('postBataille.addToTreasury')}
      </button>
    </div>
  );
}

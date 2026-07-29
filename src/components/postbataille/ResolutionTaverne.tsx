import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { resolveLeader } from '../../utils/leader';
import { JetOrButton } from './JetOrButton';

type Props = {
  roster: RosterInstance;
  catalogue: WarbandCatalog;
  onAjouterOr: (montant: number) => void;
  onAjouterAuJournal: (texte: string) => void;
};

const BANDES_REUSSITE_AUTOMATIQUE = new Set(['undead', 'morts_sans_repos', 'witch_hunters', 'sisters_of_sigmar']);

// (1 1 1) Taverne — test de Commandement du chef, sauf réussite automatique
// pour les bandes que l'alcool n'intéresse pas.
export function ResolutionTaverne({ roster, catalogue, onAjouterOr, onAjouterAuJournal }: Props) {
  const [resultat, setResultat] = useState<'reussi' | 'rate' | null>(null);
  const chef = resolveLeader(roster, catalogue);
  const automatique = BANDES_REUSSITE_AUTOMATIQUE.has(catalogue.id);

  const vendu = (valeur: number) => {
    onAjouterOr(valeur);
    onAjouterAuJournal(`Taverne : tonneaux vendus — +${valeur} po (4D6).`);
    setResultat(null);
  };

  const perdu = (valeur: number) => {
    onAjouterOr(valeur);
    onAjouterAuJournal(`Taverne : la plupart des tonneaux sont vidés — +${valeur} po (D6).`);
    setResultat(null);
  };

  if (automatique) {
    return (
      <div style={{ marginTop: '0.6rem' }}>
        <p className="text-sm text-success">
          Réussite automatique — un vulgaire breuvage alcoolisé n'intéresse pas cette bande.
        </p>
        <JetOrButton label="Jet obtenu (4D6) :" onValider={vendu} />
      </div>
    );
  }

  return (
    <div style={{ marginTop: '0.6rem' }}>
      <p className="text-sm text-muted" style={{ marginBottom: '0.4rem' }}>
        Test de Commandement du chef{chef ? ` (${chef.nom_perso})` : ''} :
      </p>
      <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
        <button type="button" className="btn btn--sm btn--primary" onClick={() => setResultat('reussi')}>
          Réussi
        </button>
        <button type="button" className="btn btn--sm" onClick={() => setResultat('rate')}>
          Raté
        </button>
      </div>
      {resultat === 'reussi' && <JetOrButton label="Jet obtenu (4D6) :" onValider={vendu} />}
      {resultat === 'rate' && <JetOrButton label="Jet obtenu (D6) :" onValider={perdu} />}
    </div>
  );
}

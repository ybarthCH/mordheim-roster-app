import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { resolveLeader } from '../../utils/leader';
import { JetOrButton } from './JetOrButton';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  roster: RosterInstance;
  catalogue: WarbandCatalog;
  // Nom traduit de l'événement (voir evenementAffiche dans EvenementExploration),
  // utilisé comme préfixe des entrées de journal ci-dessous.
  nomEvenement: string;
  onAjouterOr: (montant: number) => void;
  onAjouterAuJournal: (texte: string) => void;
};

const BANDES_REUSSITE_AUTOMATIQUE = new Set(['undead', 'morts_sans_repos', 'witch_hunters', 'sisters_of_sigmar']);

// (1 1 1) Taverne — test de Commandement du chef, sauf réussite automatique
// pour les bandes que l'alcool n'intéresse pas.
export function ResolutionTaverne({ roster, catalogue, nomEvenement, onAjouterOr, onAjouterAuJournal }: Props) {
  const { t } = useLanguage();
  const [resultat, setResultat] = useState<'reussi' | 'rate' | null>(null);
  // Se verrouille une fois le gain appliqué : les boutons Réussi/Raté
  // restaient cliquables indéfiniment après coup, permettant de rouvrir un
  // JetOrButton vierge et d'appliquer un second gain sur le même événement.
  const [resolu, setResolu] = useState<string | null>(null);
  const chef = resolveLeader(roster, catalogue);
  const automatique = BANDES_REUSSITE_AUTOMATIQUE.has(catalogue.id);

  const vendu = (valeur: number) => {
    onAjouterOr(valeur);
    const texte = t('postBataille.tavern.barrelsSold', { n: valeur });
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setResolu(texte);
  };

  const perdu = (valeur: number) => {
    onAjouterOr(valeur);
    const texte = t('postBataille.tavern.barrelsEmptied', { n: valeur });
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setResolu(texte);
  };

  if (resolu) {
    return (
      <p className="text-sm text-success" style={{ marginTop: '0.6rem' }}>
        {t('postBataille.tavern.result', { texte: resolu })}
      </p>
    );
  }

  if (automatique) {
    return (
      <div style={{ marginTop: '0.6rem' }}>
        <p className="text-sm text-success">{t('postBataille.tavern.autoSuccess')}</p>
        <JetOrButton label={t('postBataille.tavern.rollObtained4d6')} onValider={vendu} />
      </div>
    );
  }

  return (
    <div style={{ marginTop: '0.6rem' }}>
      <p className="text-sm text-muted" style={{ marginBottom: '0.4rem' }}>
        {t('postBataille.tavern.leaderCommandTest', { chef: chef ? ` (${chef.nom_perso})` : '' })}
      </p>
      <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`btn--pack-pill-sm ${resultat === 'reussi' ? 'btn--pack-pill-sm--primary' : ''}`}
          onClick={() => setResultat('reussi')}
        >
          {t('postBataille.success')}
        </button>
        <button
          type="button"
          className={`btn--pack-pill-sm ${resultat === 'rate' ? 'btn--pack-pill-sm--primary' : ''}`}
          onClick={() => setResultat('rate')}
        >
          {t('postBataille.failure')}
        </button>
      </div>
      {resultat === 'reussi' && <JetOrButton label={t('postBataille.tavern.rollObtained4d6')} onValider={vendu} />}
      {resultat === 'rate' && <JetOrButton label={t('postBataille.tavern.rollObtainedD6')} onValider={perdu} />}
    </div>
  );
}

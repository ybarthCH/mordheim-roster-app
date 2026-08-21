import { useState } from 'react';
import type { RosterInstance } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import { resolveLeader } from '../../utils/leader';
import { creerMembre } from '../../utils/factory';
import { JetOrButton } from './JetOrButton';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  roster: RosterInstance;
  catalogue: WarbandCatalog;
  // Nom traduit de l'événement (voir evenementAffiche dans EvenementExploration),
  // utilisé comme préfixe des entrées de journal ci-dessous.
  nomEvenement: string;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  onAjouterAuJournal: (texte: string) => void;
};

// (5 5) Bâtiment écroulé — deux gains indépendants d'un même jet : D3
// fragments de pierre magique (toujours obtenus) et, sur un test de
// Commandement réussi du chef de bande, un chien de guerre adopté. Verrouillés
// séparément (comme les lignes d'une sous-table trésor) plutôt qu'ensemble :
// ce sont deux récompenses distinctes du même événement, pas un choix unique.
export function ResolutionBatimentEcroule({ roster, catalogue, nomEvenement, onMajRoster, onAjouterAuJournal }: Props) {
  const { t } = useLanguage();
  const [fragmentsResolu, setFragmentsResolu] = useState<string | null>(null);
  const [testChien, setTestChien] = useState<'reussi' | 'rate' | null>(null);
  const [chienResolu, setChienResolu] = useState<string | null>(null);

  const chef = resolveLeader(roster, catalogue);
  const chienProfil = catalogue.profils.find((p) => p.id === 'chien_de_guerre');

  const ajouterFragments = (valeur: number) => {
    onMajRoster({ wyrdstone: roster.wyrdstone + valeur });
    const texte = t('postBataille.collapsedBuilding.fragmentsFound', { n: valeur, s: valeur > 1 ? 's' : '' });
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setFragmentsResolu(texte);
  };

  const adopterChien = () => {
    if (!chienProfil) return;
    onMajRoster({ membres: [...roster.membres, creerMembre(chienProfil, 0)] });
    const texte = t('postBataille.collapsedBuilding.dogAdopted');
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setChienResolu(texte);
  };

  const chienFuit = () => {
    const texte = t('postBataille.collapsedBuilding.dogFled');
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setChienResolu(texte);
  };

  return (
    <div style={{ marginTop: '0.6rem' }}>
      {fragmentsResolu ? (
        <p className="text-sm text-success">{t('postBataille.collapsedBuilding.fragmentsResult', { texte: fragmentsResolu })}</p>
      ) : (
        <JetOrButton
          label={t('postBataille.rollObtainedNotation', { notation: 'D3' })}
          boutonLabel={t('postBataille.addAsWyrdstone')}
          onValider={ajouterFragments}
        />
      )}

      {chienResolu ? (
        <p className="text-sm text-success" style={{ marginTop: '0.5rem' }}>
          {t('postBataille.collapsedBuilding.dogResult', { texte: chienResolu })}
        </p>
      ) : (
        <div style={{ marginTop: '0.5rem' }}>
          <p className="text-sm text-muted" style={{ marginBottom: '0.4rem' }}>
            {t('postBataille.collapsedBuilding.leaderCommandTest', { chef: chef ? ` (${chef.nom_perso})` : '' })}
          </p>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn--pack-pill-sm ${testChien === 'reussi' ? 'btn--pack-pill-sm--primary' : ''}`}
              onClick={() => setTestChien('reussi')}
            >
              {t('postBataille.success')}
            </button>
            <button
              type="button"
              className={`btn--pack-pill-sm ${testChien === 'rate' ? 'btn--pack-pill-sm--primary' : ''}`}
              onClick={() => {
                setTestChien('rate');
                chienFuit();
              }}
            >
              {t('postBataille.failure')}
            </button>
          </div>
          {testChien === 'reussi' &&
            (chienProfil ? (
              <button
                type="button"
                className="btn--pack-pill-sm btn--pack-pill-sm--primary"
                style={{ marginTop: '0.5rem' }}
                onClick={adopterChien}
              >
                {t('postBataille.collapsedBuilding.addDog')}
              </button>
            ) : (
              <p className="text-sm text-muted" style={{ marginTop: '0.4rem' }}>
                {t('postBataille.collapsedBuilding.noDogProfile')}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}

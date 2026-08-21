import type { RosterInstance } from '../../types/roster';
import {
  ajouterEffetPersistant,
  CLE_RELANCE_EXPLORATION_PERMANENTE,
  effetsPersistantsAvecCle,
} from '../../utils/effetsPersistants';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  roster: RosterInstance;
  // Nom traduit de l'événement (voir evenementAffiche dans EvenementExploration),
  // utilisé comme préfixe des entrées de journal ci-dessous.
  nomEvenement: string;
  onMajRoster: (patch: Partial<RosterInstance>) => void;
  onAjouterAuJournal: (texte: string) => void;
};

// (5 6) Entrée des Catacombes — contrairement au bonus de dé du Vagabond
// (temporaire, une seule phase d'exploration), cette relance est permanente :
// stockée comme un effet persistant à part (CLE_RELANCE_EXPLORATION_PERMANENTE),
// jamais retiré par PostBatailleScreen.terminer(), et simplement rappelé au
// joueur à chaque future phase d'exploration (voir resumeExploration). Une
// deuxième Entrée trouvée n'ajoute rien de plus (règle explicite du texte) :
// le bouton se désactive donc dès qu'un exemplaire est déjà présent.
export function ResolutionEntreeCatacombes({ roster, nomEvenement, onMajRoster, onAjouterAuJournal }: Props) {
  const { t } = useLanguage();
  const dejaObtenue = effetsPersistantsAvecCle(roster, CLE_RELANCE_EXPLORATION_PERMANENTE).length > 0;

  const ajouter = () => {
    onMajRoster(
      ajouterEffetPersistant(roster, {
        cle: CLE_RELANCE_EXPLORATION_PERMANENTE,
        label: t('exploration.permanentRerollNote'),
        valeur: 1,
      })
    );
    onAjouterAuJournal(`${nomEvenement} : ${t('postBataille.catacombs.added')}`);
  };

  if (dejaObtenue) {
    return (
      <p className="text-sm text-success" style={{ marginTop: '0.6rem' }}>
        {t('postBataille.catacombs.alreadyActive')}
      </p>
    );
  }

  return (
    <button
      type="button"
      className="btn--pack-pill-sm btn--pack-pill-sm--primary"
      style={{ marginTop: '0.6rem' }}
      onClick={ajouter}
    >
      {t('postBataille.catacombs.add')}
    </button>
  );
}

import { useParams } from 'react-router-dom';
import { RosterScreen } from './RosterScreen';
import { PersonnageScreen } from '../personnage/PersonnageScreen';
import { useMediaQuery, SPLIT_VIEW_QUERY } from '../../state/useMediaQuery';
import { usePersistentDisclosure } from '../../state/usePersistentDisclosure';

const PREFIXE_PERSONNAGE = 'personnage/';

// Point d'entrée commun de /roster/:id et /roster/:id/personnage/:instanceId
// — un seul Route (voir App.tsx) matché par /roster/:id/*, pour que React
// Router préserve ce composant (et donc le volet liste) au lieu de le
// remonter à chaque clic sur un membre. `instanceId` est donc extrait
// manuellement du reste du chemin plutôt que via un paramètre de route dédié.
// Sur petit écran, comportement inchangé : deux pages plein écran distinctes.
// Sur grand écran, RosterScreen affiche les deux volets (liste + détail) par
// défaut, mais l'utilisateur peut forcer la vue simple colonne (comme sur
// téléphone) via un bouton dans l'en-tête — préférence mémorisée.
export function RosterRoute() {
  const params = useParams<{ '*': string }>();
  const reste = params['*'] ?? '';
  const instanceId = reste.startsWith(PREFIXE_PERSONNAGE) ? reste.slice(PREFIXE_PERSONNAGE.length) : undefined;
  const isWide = useMediaQuery(SPLIT_VIEW_QUERY);
  const { open: preferSplit, toggle: toggleSplitView } = usePersistentDisclosure('ui.roster.splitView.actif', true);
  const splitView = isWide && preferSplit;

  if (!splitView && instanceId) return <PersonnageScreen instanceId={instanceId} />;
  return (
    <RosterScreen
      splitView={splitView}
      selectedInstanceId={splitView ? instanceId : undefined}
      canToggleSplitView={isWide}
      onToggleSplitView={toggleSplitView}
    />
  );
}

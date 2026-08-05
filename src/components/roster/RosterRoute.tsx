import { useParams } from 'react-router-dom';
import { RosterScreen } from './RosterScreen';
import { PersonnageScreen } from '../personnage/PersonnageScreen';
import { useMediaQuery, SPLIT_VIEW_QUERY } from '../../state/useMediaQuery';
import { usePersistentDisclosure } from '../../state/usePersistentDisclosure';

// Point d'entrée commun de /roster/:id et /roster/:id/personnage/:instanceId.
// Sur petit écran, comportement inchangé : deux pages plein écran distinctes.
// Sur grand écran, RosterScreen affiche les deux volets (liste + détail) par
// défaut, mais l'utilisateur peut forcer la vue simple colonne (comme sur
// téléphone) via un bouton dans l'en-tête — préférence mémorisée.
export function RosterRoute() {
  const { instanceId } = useParams<{ instanceId?: string }>();
  const isWide = useMediaQuery(SPLIT_VIEW_QUERY);
  const { open: preferSplit, toggle: toggleSplitView } = usePersistentDisclosure('ui.roster.splitView.actif', true);
  const splitView = isWide && preferSplit;

  if (!splitView && instanceId) return <PersonnageScreen />;
  return (
    <RosterScreen
      splitView={splitView}
      selectedInstanceId={splitView ? instanceId : undefined}
      canToggleSplitView={isWide}
      onToggleSplitView={toggleSplitView}
    />
  );
}

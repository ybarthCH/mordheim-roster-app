import { useParams } from 'react-router-dom';
import { RosterScreen } from './RosterScreen';
import { PersonnageScreen } from '../personnage/PersonnageScreen';
import { useMediaQuery, SPLIT_VIEW_QUERY } from '../../state/useMediaQuery';

// Point d'entrée commun de /roster/:id et /roster/:id/personnage/:instanceId.
// Sur petit écran, comportement inchangé : deux pages plein écran distinctes.
// Sur grand écran, RosterScreen affiche systématiquement les deux volets
// (liste + détail), quel que soit le chemin exact — voir RosterScreen.
export function RosterRoute() {
  const { instanceId } = useParams<{ instanceId?: string }>();
  const isWide = useMediaQuery(SPLIT_VIEW_QUERY);

  if (!isWide && instanceId) return <PersonnageScreen />;
  return <RosterScreen splitView={isWide} selectedInstanceId={isWide ? instanceId : undefined} />;
}

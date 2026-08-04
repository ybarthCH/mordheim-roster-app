// Effets à retardement stockés sur RosterInstance.effets_persistants (voir
// types/roster.ts) : tout ce qui doit survivre entre deux sessions
// post-bataille transite par ici plutôt que par un champ ad hoc — bonus de
// dé d'exploration (Vagabond), franc-tireur engagé gratuitement en attendant
// l'entretien suivant (Débiteur reconnaissant), futures jauges cumulatives...
import { v4 as uuidv4 } from 'uuid';
import type { EffetPersistant, RosterInstance } from '../types/roster';

// Bonus temporaire au prochain jet d'exploration (ex : Vagabond interrogé —
// "lancez un dé en plus, et annulez un des résultats de votre choix").
export const CLE_DE_SUPPLEMENTAIRE_EXPLORATION = 'de_supplementaire_exploration';

export function ajouterEffetPersistant(
  roster: RosterInstance,
  effet: Omit<EffetPersistant, 'id'>
): Pick<RosterInstance, 'effets_persistants'> {
  return {
    effets_persistants: [...(roster.effets_persistants ?? []), { id: uuidv4(), ...effet }],
  };
}

export function retirerEffetPersistant(
  roster: RosterInstance,
  effetId: string
): Pick<RosterInstance, 'effets_persistants'> {
  return {
    effets_persistants: (roster.effets_persistants ?? []).filter((e) => e.id !== effetId),
  };
}

export function effetsPersistantsAvecCle(roster: RosterInstance, cle: string): EffetPersistant[] {
  return (roster.effets_persistants ?? []).filter((e) => e.cle === cle);
}

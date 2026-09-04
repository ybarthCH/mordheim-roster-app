// Logique métier autour d'une RosterInstance complète, indépendante de sa
// persistance (voir state/RostersContext.tsx, qui ne fait plus qu'orchestrer
// l'appel à saveRoster + la mise à jour de l'état React autour de ces
// fonctions).
import { v4 as uuidv4 } from 'uuid';
import type { RosterInstance } from '../types/roster';

// Copie une bande avec de nouveaux identifiants (bande + tous ses membres),
// en remappant tout ce qui référence un instance_id de membre pour que la
// copie reste cohérente avec elle-même.
export function dupliquerRosterInstance(original: RosterInstance): RosterInstance {
  const now = new Date().toISOString();
  // Chaque membre reçoit un nouvel instance_id — leader_instance_id
  // (bandes à leadership libre) doit être remappé en conséquence, sinon
  // il pointe vers un id qui n'existe plus dans la copie et le chef
  // choisi est silencieusement perdu.
  const idsRemappes = new Map<string, string>();
  const membres = original.membres.map((m) => {
    const instance_id = uuidv4();
    idsRemappes.set(m.instance_id, instance_id);
    return { ...m, instance_id };
  });
  // Un effet persistant ciblant un membre précis (ex : exemption d'entretien
  // "Débiteur reconnaissant") doit suivre le remappage des instance_id ci-
  // dessus, sinon il continue de viser le membre de la bande source et ne
  // s'applique plus jamais dans la copie. Un effet devenu orphelin (cible
  // qui n'existe plus, ex : membre déjà mort avant la duplication) est
  // abandonné plutôt que recopié sans cible valide.
  const effets_persistants = (original.effets_persistants ?? []).flatMap((e) => {
    if (!e.cible) return [{ ...e, id: uuidv4() }];
    const cibleRemappee = idsRemappes.get(e.cible);
    return cibleRemappee ? [{ ...e, id: uuidv4(), cible: cibleRemappee }] : [];
  });
  return {
    ...original,
    id: uuidv4(),
    nom_bande: `${original.nom_bande} (copie)`,
    membres,
    effets_persistants,
    leader_instance_id: original.leader_instance_id
      ? idsRemappes.get(original.leader_instance_id)
      : undefined,
    // Pas d'ordre hérité de l'original : la copie retombe dans le repli
    // alphabétique de listRosters() plutôt que de partager exactement
    // la même position glissée-déposée que la bande source.
    ordre: undefined,
    createdAt: now,
    updatedAt: now,
  };
}

// Résolution du leadership de bande et de ses conséquences à la mort du
// chef : transfert de commandement + interdiction définitive de recruter à
// nouveau son profil (règle Mordheim, avec exception pour les profils
// `leader_toujours_recrutable` comme le Vampire des Morts-Vivants).
import type { Member, RosterInstance } from '../types/roster';
import type { WarbandCatalog } from '../types/catalog';
import { resolveProfil } from './profil';

/**
 * Membre actuellement chef de bande, par ordre de priorité :
 * 1. Le profil à leadership fixe du catalogue (`est_leader`), tant qu'un
 *    titulaire vivant existe — couvre la majorité des bandes ET la reprise
 *    automatique et obligatoire du leadership par un nouveau Vampire chez
 *    les Morts-Vivants (voir Profile.leader_toujours_recrutable).
 * 2. Sinon, l'assignation manuelle courante (`roster.leader_instance_id`),
 *    si elle pointe vers un membre vivant — choix libre à la création
 *    (Lustrian Reavers), départage d'égalité de Commandement, ou chef
 *    intérimaire en attendant le retour d'un profil à leadership fixe.
 * 3. Sinon, aucun chef déterminé (voir choixLeaderRequis).
 */
export function resolveLeader(
  roster: RosterInstance,
  catalogue: WarbandCatalog | undefined
): Member | undefined {
  if (!catalogue) return undefined;
  const profilFixe = catalogue.profils.find((p) => p.est_leader);
  if (profilFixe) {
    const titulaire = roster.membres.find((m) => m.statut !== 'mort' && m.profil_id === profilFixe.id);
    if (titulaire) return titulaire;
  }
  if (roster.leader_instance_id) {
    return roster.membres.find((m) => m.instance_id === roster.leader_instance_id && m.statut !== 'mort');
  }
  return undefined;
}

function utiliseLeadership(catalogue: WarbandCatalog | undefined): boolean {
  return !!catalogue && (!!catalogue.leader_libre || catalogue.profils.some((p) => p.est_leader));
}

/**
 * Vrai si le joueur doit choisir un chef (bannière + modale sur le roster) :
 * la bande utilise le mécanisme de leadership mais aucun chef n'est
 * actuellement déterminé, alors qu'il reste au moins un héros vivant.
 */
export function choixLeaderRequis(roster: RosterInstance, catalogue: WarbandCatalog | undefined): boolean {
  if (!utiliseLeadership(catalogue) || resolveLeader(roster, catalogue)) return false;
  return roster.membres.some((m) => m.statut !== 'mort' && resolveProfil(roster, m)?.type === 'heros');
}

/** Vrai si ce membre précis est le chef de bande actuel. */
export function estLeaderActuel(roster: RosterInstance, catalogue: WarbandCatalog | undefined, m: Member): boolean {
  return resolveLeader(roster, catalogue)?.instance_id === m.instance_id;
}

/**
 * À appeler après toute transition de statut vers "mort" (mort au combat,
 * blessure grave, table du Seigneur des Ombres...) : si le membre mort
 * détenait le leadership au moment des faits, bannit son profil du
 * recrutement futur (sauf exemption `leader_toujours_recrutable`) et
 * transfère le commandement au héros survivant de plus haut Commandement —
 * ou vide `leader_instance_id` en cas d'égalité, pour que le joueur choisisse
 * (voir choixLeaderRequis). S'applique aussi, indépendamment du leadership, à
 * tout profil unique d'une bande marquée `bannir_profils_uniques_a_mort`
 * (règle "Héros rares" des Lustrian Reavers).
 *
 * `membresApres` : l'état des membres une fois toutes les transitions de
 * statut de ce lot appliquées (sert à déterminer les survivants) —
 * `rosterAvant` reste la référence pour "qui était chef avant".
 *
 * Retourne `null` si rien à changer, sinon le patch à fusionner dans le
 * roster (toujours les deux champs ensemble, par simplicité).
 */
export function succederApresMorts(
  rosterAvant: RosterInstance,
  catalogue: WarbandCatalog | undefined,
  membresApres: Member[]
): Pick<RosterInstance, 'profils_bannis' | 'leader_instance_id'> | null {
  if (!catalogue) return null;

  const bannisSet = new Set(rosterAvant.profils_bannis ?? []);
  let changement = false;
  let leaderInstanceId = rosterAvant.leader_instance_id;

  const vientDeMourir = (instanceId: string) => {
    const avant = rosterAvant.membres.find((m) => m.instance_id === instanceId);
    const apres = membresApres.find((m) => m.instance_id === instanceId);
    return !!avant && avant.statut !== 'mort' && !!apres && apres.statut === 'mort';
  };

  if (catalogue.bannir_profils_uniques_a_mort) {
    for (const m of membresApres) {
      if (!vientDeMourir(m.instance_id)) continue;
      const profil = catalogue.profils.find((p) => p.id === m.profil_id);
      if (profil?.unique && !profil.leader_toujours_recrutable && !bannisSet.has(profil.id)) {
        bannisSet.add(profil.id);
        changement = true;
      }
    }
  }

  const leaderAvant = resolveLeader(rosterAvant, catalogue);
  if (leaderAvant && vientDeMourir(leaderAvant.instance_id)) {
    const profilLeader = catalogue.profils.find((p) => p.id === leaderAvant.profil_id);
    if (profilLeader && !profilLeader.leader_toujours_recrutable && !bannisSet.has(profilLeader.id)) {
      bannisSet.add(profilLeader.id);
      changement = true;
    }

    const survivants = membresApres.filter(
      (m) =>
        m.instance_id !== leaderAvant.instance_id &&
        m.statut !== 'mort' &&
        resolveProfil(rosterAvant, m)?.type === 'heros'
    );
    if (survivants.length === 0) {
      leaderInstanceId = undefined;
    } else {
      const maxCd = Math.max(...survivants.map((m) => m.stats_actuels.Cd));
      const candidats = survivants.filter((m) => m.stats_actuels.Cd === maxCd);
      leaderInstanceId = candidats.length === 1 ? candidats[0].instance_id : undefined;
    }
    changement = true;
  }

  if (!changement) return null;
  return { profils_bannis: Array.from(bannisSet), leader_instance_id: leaderInstanceId };
}

// Résolution du leadership de bande et de ses conséquences à la mort du
// chef : transfert de commandement + interdiction définitive de recruter à
// nouveau son profil (règle Mordheim, avec exception pour les profils
// `leader_toujours_recrutable` comme le Vampire des Morts-Vivants).
import type { Member, RosterInstance } from '../types/roster';
import type { WarbandCatalog } from '../types/catalog';
import { resolveProfil } from './profil';
import { estFrancTireur } from '../data/hiredSwords';

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
  // Une bande dissoute (voir RosterInstance.dissoute) n'a plus de chef à
  // choisir : ni le Vampire ni le Nécromancien ne peuvent plus reprendre le
  // commandement, et aucun autre profil de la bande n'est éligible.
  if (roster.dissoute) return false;
  if (!utiliseLeadership(catalogue) || resolveLeader(roster, catalogue)) return false;
  return roster.membres.some(
    (m) => m.statut !== 'mort' && !estFrancTireur(m) && resolveProfil(roster, m)?.type === 'heros'
  );
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
  membresApres: Member[],
  // `sansBannirProfilLeader` : la succession de commandement a bien lieu,
  // mais le profil du chef n'est pas banni du recrutement futur — utilisé
  // par la règle Œil des Dieux Sombres des Maraudeurs du Chaos, où le chef
  // est transformé plutôt que réellement tué au combat.
  options?: { sansBannirProfilLeader?: boolean }
): (Pick<RosterInstance, 'profils_bannis' | 'leader_instance_id' | 'dissoute'> & { membres?: Member[] }) | null {
  if (!catalogue) return null;

  const bannisSet = new Set(rosterAvant.profils_bannis ?? []);
  let changement = false;
  let leaderInstanceId = rosterAvant.leader_instance_id;
  let dissoute = false;
  // Membres éventuellement modifiés par la succession elle-même (ex : règle
  // spéciale octroyée au successeur, voir la branche orques_noirs
  // ci-dessous) — distinct de `membresApres`, qui reste la référence
  // "membres après morts, avant conséquences de la succession".
  let membresResultat: Member[] | null = null;

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
    // Le profil du chef n'est banni à jamais que s'il s'agit du VRAI rôle de
    // chef de la bande (Profile.est_leader) — pas d'un profil quelconque
    // simplement désigné chef intérimaire (leader_instance_id) faute de
    // titulaire à leadership fixe vivant, ex : un Prêtre-guerrier des
    // Répurgateurs qui hérite du commandement en l'absence de Capitaine
    // répurgateur. Ce dernier reste soumis à sa limite 0-1 normale
    // (recrutable de nouveau une fois mort), pas à l'interdiction
    // définitive du "vrai" chef. Dans les bandes à chef entièrement libre
    // (leader_libre, aucun profil est_leader — ex : Lustrian Reavers), tout
    // profil désigné chef EST par définition le rôle de chef : la règle
    // s'applique alors normalement.
    const catalogueALeaderFixe = catalogue.profils.some((p) => p.est_leader);
    const estVraiRoleDeChef = !catalogueALeaderFixe || !!profilLeader?.est_leader;
    if (
      !options?.sansBannirProfilLeader &&
      profilLeader &&
      estVraiRoleDeChef &&
      !profilLeader.leader_toujours_recrutable &&
      !bannisSet.has(profilLeader.id)
    ) {
      bannisSet.add(profilLeader.id);
      changement = true;
    }

    if (catalogue.id === 'undead') {
      // "In the case of Undead warbands, the death of the Vampire means
      // that the warband's Necromancer must take over. If the warband
      // doesn't include one, the spells that hold the restless dead
      // together unravel, and the warband collapses into a pile of bones."
      // (Mordheim - Part 3 - Campaigns & Optional Rules, "Death of a
      // Leader", dernière phrase remplacée par Errata.pdf p.3) — remplace
      // le départage générique par Commandement/XP par une succession
      // forcée au Nécromancien vivant, ou à défaut la dissolution de la
      // bande (voir RosterInstance.dissoute). Le Vampire porte déjà
      // `leader_toujours_recrutable`, donc le bannissement de profil
      // ci-dessus ne s'applique jamais à lui ("vous pouvez acheter un
      // Vampire après la prochaine partie") ; recruter un nouveau Vampire
      // lui rend alors automatiquement le commandement sans code
      // supplémentaire (Profile.est_leader prime toujours sur
      // leader_instance_id dans resolveLeader). Étendu par cohérence au cas
      // où c'est le Nécromancien lui-même (chef intérimaire après la mort
      // du Vampire) qui meurt à son tour sans successeur : non couvert
      // littéralement par le texte, mais seule lecture qui évite une bande
      // à jamais sans chef ni dissoute.
      const necromancien = membresApres.find((m) => m.profil_id === 'necromancien' && m.statut !== 'mort');
      if (necromancien) {
        leaderInstanceId = necromancien.instance_id;
      } else {
        leaderInstanceId = undefined;
        dissoute = true;
      }
    } else if (catalogue.id === 'orques_noirs') {
      // "Si le Chef venait à être tué, ce serait obligatoirement l'Orque
      // Noir avec le plus d'expérience qui prendrait le commandement de la
      // bande, même si un Orque est plus expérimenté. Le remplaçant gagne
      // automatiquement la règle spéciale t'vas t'calmer ?!" (règle "L'chef
      // il a kané !", déjà citée dans orques_noirs.json) — succession
      // restreinte aux seuls Orques Noirs (profil orque_noir), départagée
      // par XP seul (pas par Commandement comme l'algorithme générique), et
      // jamais par un autre type de héros de la bande (Pti'mek) même plus
      // expérimenté. Aucune lecture littérale ne prévoit de repli sur
      // l'algorithme générique si aucun Orque Noir ne survit — le choix
      // manuel du joueur reste alors possible (voir choixLeaderRequis),
      // comme en cas d'égalité de XP (le texte ne prévoit pas de D6 de
      // départage pour ce cas précis, contrairement à la règle générique).
      const orquesNoirs = membresApres.filter((m) => m.profil_id === 'orque_noir' && m.statut !== 'mort');
      if (orquesNoirs.length === 0) {
        leaderInstanceId = undefined;
      } else {
        const maxXp = Math.max(...orquesNoirs.map((m) => m.xp));
        const candidats = orquesNoirs.filter((m) => m.xp === maxXp);
        if (candidats.length !== 1) {
          leaderInstanceId = undefined;
        } else {
          leaderInstanceId = candidats[0].instance_id;
          const texteRegle =
            "T'vas t'calmer ?! : si un Orque de main rate son test d'Animosité à moins de 6ps, ce Héros peut intervenir pour le calmer — touche automatique d'une Force au choix, ajoutée au résultat du tableau d'Animosité si la cible reste debout.";
          if (!candidats[0].regles_speciales_notes.includes(texteRegle)) {
            membresResultat = membresApres.map((m) =>
              m.instance_id === candidats[0].instance_id
                ? { ...m, regles_speciales_notes: [...m.regles_speciales_notes, texteRegle] }
                : m
            );
          }
        }
      }
    } else {
      const survivants = membresApres.filter((m) => {
        if (m.instance_id === leaderAvant.instance_id || m.statut === 'mort' || estFrancTireur(m)) return false;
        const p = resolveProfil(rosterAvant, m);
        return p?.type === 'heros' && !p.ne_peut_jamais_devenir_chef;
      });
      if (survivants.length === 0) {
        leaderInstanceId = undefined;
      } else {
        // "If there is more than one Hero eligible to assume command, the
        // warrior with the most Experience points becomes the leader. In the
        // case of a tie roll a D6 to decide the new leader." (Part 3 -
        // Campaigns & Optional Rules p.78) — départage automatique par
        // Commandement puis XP ; seule une égalité stricte sur les deux
        // (représentant le jet de D6, que l'app ne simule pas) retombe sur
        // `undefined` et le choix manuel du joueur (voir choixLeaderRequis).
        const maxCd = Math.max(...survivants.map((m) => m.stats_actuels.Cd));
        const candidatsCd = survivants.filter((m) => m.stats_actuels.Cd === maxCd);
        const maxXp = Math.max(...candidatsCd.map((m) => m.xp));
        const candidats = candidatsCd.filter((m) => m.xp === maxXp);
        leaderInstanceId = candidats.length === 1 ? candidats[0].instance_id : undefined;
      }
    }

    // Compétence "Chien de Guerre" du Capitaine (Maneaters, reserve_a "Chef
    // uniquement") : "La bande peut engager les Francs-Tireurs disponibles
    // pour les Mercenaires ; si le chef meurt, tous les Francs-Tireurs sont
    // retirés de la bande." Ne s'applique que si CE chef (le Capitaine, seul
    // profil est_leader chez les Maneaters) portait la compétence — un
    // Capitaine qui ne l'avait jamais prise n'a jamais ouvert l'accès aux
    // francs-tireurs, donc rien à retirer.
    if (catalogue.id === 'maneaters' && leaderAvant.competences_acquises.includes('chien_de_guerre')) {
      const sansFrancsTireurs = (membresResultat ?? membresApres).filter(
        (m) => m.statut === 'mort' || !estFrancTireur(m)
      );
      if (sansFrancsTireurs.length !== (membresResultat ?? membresApres).length) {
        membresResultat = sansFrancsTireurs;
      }
    }

    changement = true;
  }

  if (!changement) return null;
  return {
    profils_bannis: Array.from(bannisSet),
    leader_instance_id: leaderInstanceId,
    ...(dissoute ? { dissoute: true } : {}),
    ...(membresResultat ? { membres: membresResultat } : {}),
  };
}

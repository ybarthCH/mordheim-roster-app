// Le schéma RosterInstance/Member s'est enrichi de nombreux champs au fil du
// développement (hors_combat, wyrdstone, inventaire, stock, blessures_graves,
// taille_groupe...). Les bandes créées avant l'ajout d'un champ n'ont aucune
// raison de l'avoir dans IndexedDB — sans ce filet, un simple `.map()` ou
// `.length` dessus plante l'écran. Toute lecture de roster (chargement,
// import JSON) doit passer par ici avant d'être utilisée par l'UI.
import { v4 as uuidv4 } from 'uuid';
import type { Stats } from '../types/catalog';
import type { Member, RosterInstance, Statut } from '../types/roster';

const STATS_VIDES: Stats = { M: 0, CC: 0, CT: 0, F: 0, E: 0, PV: 0, I: 0, A: 0, Cd: 0 };

// Un champ censé être un tableau (stock, inventaire, blessures_graves...)
// peut être présent mais du mauvais type dans un JSON importé (édité à la
// main, généré par un outil tiers, tronqué) — `??` seul ne s'en protège pas,
// puisqu'il ne se déclenche que si la valeur est `undefined`. Sans cette
// vérification, un `.map()`/`.filter()` ultérieur sur ce champ plante l'écran
// à chaque ouverture de la bande, sans recours pour le joueur hormis la
// suppression complète de ses données.
function tableauSur<T>(valeur: unknown): T[] {
  return Array.isArray(valeur) ? (valeur as T[]) : [];
}

// Même principe que tableauSur ci-dessus, pour un champ censé être un objet
// simple (Record), ex : objets_surcharges.
function objetSur<T>(valeur: unknown): T {
  return valeur && typeof valeur === 'object' && !Array.isArray(valeur) ? (valeur as T) : ({} as T);
}

// `photo` n'est censée contenir qu'un data URI produit par le sélecteur de
// photo de l'app (voir components/personnage/PhotoPicker) — jamais une URL
// externe. Un roster partagé/trafiqué pourrait y glisser une URL http(s) :
// affichée telle quelle dans un <img src>, elle ferait charger une ressource
// distante à l'ouverture de la fiche du personnage (mini-tracking passif —
// IP + moment d'ouverture révélés à un tiers, sans exécution de code
// possible). Toute valeur qui n'est pas un data URI image est donc ignorée
// ici, à la source, plutôt que fait confiance jusqu'au composant d'affichage.
function photoSure(valeur: unknown): string | undefined {
  return typeof valeur === 'string' && valeur.startsWith('data:image/') ? valeur : undefined;
}

function normaliserMembre(membreBrut: unknown): Member {
  // Un élément du tableau `membres` peut lui-même ne pas être un objet
  // (`null`, une chaîne, un nombre...) dans un JSON corrompu/trafiqué — sans
  // ce repli, le premier accès à un champ plus bas lève une TypeError avant
  // même d'atteindre les replis `??` de chaque champ individuel.
  const membre: Partial<Member> =
    membreBrut && typeof membreBrut === 'object' && !Array.isArray(membreBrut) ? (membreBrut as Partial<Member>) : {};
  // `sorts_connus` servait autrefois de fourre-tout texte libre (règles
  // spéciales gagnées en jeu, sorts, mutations manuscrites). Le champ dédié
  // `regles_speciales_notes` sépare maintenant les deux : sur un roster
  // jamais encore relu depuis cette séparation (regles_speciales_notes
  // absent), on bascule l'ancien contenu de sorts_connus vers les notes —
  // il s'agissait alors très majoritairement de notes manuscrites, jamais
  // de vrais sorts choisis dans un sélecteur — et on repart avec des sorts
  // connus vides, prêts pour le nouveau système structuré. Idempotent :
  // une fois `regles_speciales_notes` présent, plus aucune bascule. Vérifié
  // par Array.isArray plutôt que !== undefined : un champ présent mais du
  // mauvais type (JSON corrompu) ne doit pas être considéré comme "déjà
  // migré" alors qu'il n'a jamais reçu de vraie valeur de migration.
  const dejaMigreVersNotes = Array.isArray(membre.regles_speciales_notes);
  return {
    instance_id: membre.instance_id ?? uuidv4(),
    profil_id: membre.profil_id ?? '',
    nom_perso: membre.nom_perso ?? '',
    photo: photoSure(membre.photo),
    equipement: membre.equipement ?? '',
    inventaire: tableauSur(membre.inventaire),
    xp: membre.xp ?? 0,
    xp_depart: membre.xp_depart ?? 0,
    // Fusion clé par clé plutôt qu'un repli global sur l'objet reçu : une
    // bande importée dont stats_actuels a perdu une seule clé (JSON édité à
    // la main, export d'une version antérieure du schéma...) doit récupérer
    // uniquement cette clé à 0, pas voir tout le reste de ses caractéristiques
    // écrasées par le repli.
    stats_actuels: { ...STATS_VIDES, ...objetSur<Partial<Stats>>(membre.stats_actuels) },
    stats_modifiees: tableauSur(membre.stats_modifiees),
    stats_variables: membre.stats_variables,
    competences_acquises: tableauSur(membre.competences_acquises),
    monture_equitation: membre.monture_equitation,
    sorts_connus: dejaMigreVersNotes ? tableauSur(membre.sorts_connus) : [],
    option_sorcier_pris: membre.option_sorcier_pris,
    marque: membre.marque,
    regles_speciales_notes: dejaMigreVersNotes
      ? (membre.regles_speciales_notes as string[])
      : tableauSur(membre.sorts_connus),
    statut: (membre.statut as Statut | undefined) ?? 'actif',
    date_mort: membre.date_mort,
    blesse_tour_actuel: membre.blesse_tour_actuel ?? 0,
    blesse_tour_total: membre.blesse_tour_total ?? 0,
    blessures_graves: tableauSur(membre.blessures_graves),
    historique_avancees: tableauSur(membre.historique_avancees),
    bonus_avancee_en_attente: membre.bonus_avancee_en_attente,
    notes: membre.notes ?? '',
    grande_cible: membre.grande_cible ?? false,
    profil_custom: membre.profil_custom,
    franc_tireur_id: membre.franc_tireur_id,
    franc_tireur_impaye: membre.franc_tireur_impaye ?? false,
    promu_heros: membre.promu_heros,
    acces_competences_override: membre.acces_competences_override,
    taille_groupe: membre.taille_groupe ?? 1,
    hors_combat: membre.hors_combat ?? 0,
    pv_perdus: membre.pv_perdus,
    cout_recrutement: membre.cout_recrutement,
  };
}

export function normaliserRoster(roster: Partial<RosterInstance>): RosterInstance {
  const now = new Date().toISOString();
  return {
    id: roster.id ?? uuidv4(),
    bande_id: roster.bande_id ?? '',
    nom_bande: roster.nom_bande ?? '',
    tresorerie: roster.tresorerie ?? 0,
    wyrdstone: roster.wyrdstone ?? 0,
    equipement_reserve: roster.equipement_reserve ?? '',
    stock: tableauSur(roster.stock),
    objets_personnalises: tableauSur(roster.objets_personnalises),
    objets_surcharges: objetSur(roster.objets_surcharges),
    membres: tableauSur<unknown>(roster.membres).map(normaliserMembre),
    historique_batailles: tableauSur(roster.historique_batailles),
    leader_instance_id: roster.leader_instance_id,
    profils_bannis: tableauSur(roster.profils_bannis),
    tribu: roster.tribu,
    effets_persistants: tableauSur(roster.effets_persistants),
    ordre: roster.ordre,
    createdAt: roster.createdAt ?? now,
    updatedAt: roster.updatedAt ?? now,
  };
}

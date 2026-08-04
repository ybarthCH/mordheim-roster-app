// Modèle de données de l'instance de roster (données du joueur)
import type { SkillCategory, Stats } from './catalog';

export type Statut = 'actif' | 'hors_de_combat' | 'mort' | 'blesse';

export const STATUTS: { id: Statut; label: string }[] = [
  { id: 'actif', label: 'Actif' },
  { id: 'hors_de_combat', label: 'Hors de combat' },
  { id: 'mort', label: 'Mort' },
  { id: 'blesse', label: 'Blessé' },
];

export type SeriousInjuryRecord = {
  id: string;
  date: string;
  // Résultat saisi librement par le joueur (table papier, règles complètes
  // largement au-delà des 12 cas de la table de base 2D6).
  description: string;
  // Titre court de la blessure (ex : "Folie", "Jambe brisée"), utilisé pour
  // l'affichage condensé dans le roster global. Absent sur les
  // enregistrements créés avant son introduction.
  nom?: string;
  // Effets structurés réellement appliqués par l'assistant. Les anciens
  // rosters n'en ont pas : le docteur retombe alors sur le nom et le texte
  // de la blessure pour identifier les cinq traitements possibles.
  effets?: SeriousInjuryEffect[];
  // Consultation payée mais dont le résultat 2D6 n'a pas encore été saisi.
  // Utilisé par le brouillon de l'étape Commerce pour fermer puis rouvrir la
  // fenêtre sans proposer un second paiement.
  docteur_effet_en_attente?: string;
  // Une blessure simple héritée d'un ancien roster peut être marquée soignée
  // sans disposer d'un tableau `effets` structuré.
  soignee?: boolean;
  historique_docteur?: DoctorTreatmentRecord[];
};

export type SeriousInjuryEffect = {
  id: string;
  resultat_id: string;
  nom: string;
  stats_delta: Partial<Record<keyof Stats, number>>;
  notes_ajoutees: string[];
  traitee?: boolean;
};

export type DoctorTreatmentRecord = {
  date: string;
  jet: number;
  titre: string;
  texte: string;
};

export type AdvanceRecord = {
  id: string;
  date: string;
  xpAtRoll: number;
  roll: number;
  type: string;
  detail: string;
  // Caractéristique ciblée, uniquement pour type: 'caracteristique' — sert à
  // faire respecter la règle "un homme de main ne peut pas augmenter la même
  // caractéristique de plus de +1" (voir utils/plafond.ts).
  stat?: keyof Stats;
  // Id de la compétence acquise, uniquement pour type: 'competence' — permet
  // à annulerAvancee() de retrouver et retirer la compétence de façon fiable
  // même si son nom affiché a changé depuis (ex : renommage d'Équitation).
  // Absent sur les entrées historiques antérieures à l'ajout de ce champ, qui
  // retombent alors sur l'appariement par nom (fragile aux renommages).
  competenceId?: string;
  // Id du sort appris (MagieSort.id), uniquement pour type: 'sort' — même
  // principe que competenceId : permet à annulerAvancee() de retrouver et
  // retirer le sort de façon fiable, indépendamment de la langue d'affichage
  // au moment de l'avancée. Absent sur les entrées historiques antérieures à
  // l'ajout de ce champ, qui retombent alors sur l'appariement par nom
  // extrait de `detail` (fragile si la langue a changé depuis).
  sortId?: string;
  // Jet immédiat et gratuit sur la table des héros accordé par "Ce gars est
  // doué" (voir AvanceeModal.confirmerPromotion) — ne consomme pas une
  // avancée due au titre de la progression XP normale : à exclure du calcul
  // d'avancées obtenues (voir avancesDues côté utils/xp.ts et ses appelants).
  bonus?: boolean;
};

// Profil entièrement défini à la main pour une recrue "Franc-tireur"
// (indépendante du catalogue de la bande — profil, équipement, prix et
// solde propres à cette recrue).
export type ProfilFrancTireur = {
  nom: string;
  type: 'heros' | 'homme_de_main';
  stats: Stats;
  acces_competences: SkillCategory[];
  cout: number; // prix d'engagement, déduit une fois à l'embauche
  solde: number; // solde à payer après chaque bataille
};

// Objet possédé, acheté depuis le shop commun ou la liste d'équipement de la
// bande. Champs figés au moment de l'achat (nom/catégorie/coût) pour que
// l'historique reste stable même si la base d'objets évolue ensuite.
export type InventoryEntry = {
  instance_id: string;
  item_id: string;
  nom: string;
  categorie: string;
  cout: number;
  // Notation de dés affichée à l'achat (ex : "2D6"), purement informative —
  // le coût réellement déduit est saisi à la main dans `cout`.
  cout_notation?: string;
  date_achat?: string;
  // Résultat du jet fait à l'achat pour un objet dont l'effet dépend d'un
  // sous-jet (ex : Carte de Mordheim — voir ShopItem.sous_jet_achat dans
  // utils/shop.ts). `optionIndex` pointe dans les options d'origine de
  // l'objet ; `label`/`texte` sont un instantané français de repli si
  // l'objet ou l'option a disparu du catalogue depuis.
  resultat_sous_jet_achat?: { jet: number; optionIndex: number; label: string; texte: string };
};

export type Member = {
  instance_id: string;
  profil_id: string;
  nom_perso: string;
  equipement: string;
  // Équipement possédé sous forme structurée (achats via le shop). Le champ
  // `equipement` ci-dessus reste affiché en lecture seule, recalculé à
  // partir de cette liste.
  inventaire: InventoryEntry[];
  xp: number;
  // XP de départ à la recrue (catalogue ou saisie manuelle) : ne déclenche
  // aucune avancée due, sert uniquement de référence pour ne compter que
  // les paliers franchis depuis le recrutement.
  xp_depart: number;
  stats_actuels: Stats;
  // Caractéristiques modifiées à la main (édition directe, blessure grave...),
  // par opposition à une augmentation obtenue via une avancée XP normale —
  // sert uniquement à l'affichage distinct sur la fiche personnage.
  stats_modifiees: (keyof Stats)[];
  // Notation de dés (voir Profile.stats_variables) affichée à la place de la
  // valeur numérique correspondante dans stats_actuels, purement en lecture
  // pour l'affichage — la valeur numérique sous-jacente reste un espace
  // réservé ignoré par tout calcul (rating, plafond, avancées). Copié depuis
  // le profil au recrutement ; une clé est retirée dès que sa valeur est
  // fixée définitivement (ex : Destin du Damné).
  stats_variables?: Partial<Record<keyof Stats, string>>;
  competences_acquises: string[];
  // Monture à laquelle la compétence Équitation (utils/tribu.SKILL_EQUITATION)
  // est liée — cette compétence est spécifique à un animal donné (règle
  // imprimée) et doit être réapprise pour chevaucher un autre type de
  // monture. Choisie parmi les montures accessibles à la bande au moment où
  // la compétence est acquise (voir AvanceeModal).
  monture_equitation?: string;
  // Sorts effectivement appris (noms correspondant à `Magie.sorts[].nom` du
  // catalogue de la bande) : le premier est choisi obligatoirement au
  // recrutement d'un profil sorcier, les suivants via une avancée "nouvelle
  // compétence" (voir utils/magie.ts et AvanceeModal).
  sorts_connus: string[];
  // Marque choisie au recrutement pour les profils à `marque_requise` (ex :
  // le Devin des Maraudeurs du Chaos) — référence vers Marque.id, détermine
  // le domaine de sorts utilisé (voir utils/magie.ts). Fixée une fois pour
  // toutes.
  marque?: string;
  // Notes libres pour toute règle spéciale gagnée en jeu (hors mutations,
  // désormais appliquées automatiquement à l'achat — voir stats_delta sur
  // ShopItem) et hors sorts (voir sorts_connus ci-dessus).
  regles_speciales_notes: string[];
  statut: Statut;
  // Renseigné automatiquement quand le statut passe à "Mort".
  date_mort?: string;
  // Compteur manuel utilisé quand le statut est "Blessé".
  blesse_tour_actuel: number;
  blesse_tour_total: number;
  blessures_graves: SeriousInjuryRecord[];
  historique_avancees: AdvanceRecord[];
  // Vrai quand le jet gratuit "Ce gars est doué" (AdvanceRecord.bonus) a été
  // annulé via annulerAvancee() — restaure la possibilité de relancer ce jet
  // bonus depuis "Résoudre une avancée", faute de quoi il serait perdu sans
  // recours (le compteur enAttente normal l'ignore volontairement, voir
  // AdvanceRecord.bonus).
  bonus_avancee_en_attente?: boolean;
  notes: string;
  // Case manuelle "Grande Cible" (+20 au rating), non liée au catalogue.
  grande_cible: boolean;
  // Profil "Franc-tireur" : présent uniquement pour une recrue hors
  // catalogue, entièrement définie à la création (voir ProfilFrancTireur).
  profil_custom?: ProfilFrancTireur;
  // Franc-tireur structuré du catalogue commun. `profil_custom` reste
  // supporté uniquement pour les anciens exports/imports.
  franc_tireur_id?: string;
  // Un Geôlier conservé sans payer sa solde doit manquer la bataille
  // suivante. Le drapeau est consommé au prochain post-bataille.
  franc_tireur_impaye?: boolean;
  // Homme de main ayant obtenu "Ce gars est doué" : traité comme un héros
  // (grille XP à 90, table d'avancement héros) à partir de là.
  promu_heros?: boolean;
  // Tables de compétences choisies à la promotion (2 ou 3), remplace
  // l'accès du profil d'origine une fois promu.
  acces_competences_override?: SkillCategory[];
  // Nombre de figurines représentées par cette entrée (groupe d'hommes de
  // main identiques). Toujours 1 pour un héros — voir la promotion, qui
  // détache une figurine du groupe plutôt que de le convertir en bloc.
  taille_groupe: number;
  // Nombre de figurines de ce groupe actuellement Hors de Combat (0 à
  // taille_groupe), en attente de résolution à l'assistant post-bataille.
  // Sans objet pour taille_groupe = 1 : le statut "Hors de combat" suffit.
  hors_combat: number;
};

// Journal de la session post-bataille associée, pour ne pas perdre ces
// informations une fois l'assistant terminé (visible/consultable depuis
// l'historique des batailles).
export type JournalPostBataille = {
  wyrdstoneTrouve: number;
  notesExploration: string;
  quantiteVendue: number;
  prixVente: number;
  soldeFrancsTireurs: number;
  entretienFrancsTireurs?: {
    nom: string;
    decision: 'paye' | 'renvoye' | 'exempte' | 'gratuit' | 'depart_automatique';
    coutOr: number;
    coutMalepierre: number;
  }[];
  commerce?: {
    nom: string;
    action: 'aucune' | 'recherche_rare' | 'docteur' | 'dramatis_personae';
    detail: string;
    cout: number;
  }[];
  tresorerieApres: number;
  blessures: { nom: string; description: string }[];
  survie: { nom: string; survecu: boolean }[];
  // Points vétéran disponibles (2D6 lancés par le joueur), saisis
  // manuellement à titre indicatif — juste affichés dans le journal.
  pointsVeteran: number;
  // Avancées d'expérience résolues via l'étape Gain d'expérience de
  // l'assistant, en plus de historique_avancees du membre concerné —
  // pratique pour relire ce qui a été tiré sans rouvrir chaque fiche.
  // Absent sur les batailles enregistrées avant l'introduction de ce champ.
  avancesResolues?: { nom: string; detail: string }[];
  // Guerriers restés au camp car Blessé (n'ont pas participé à la bataille,
  // donc pas d'XP) : le compteur de tours blessé avance automatiquement à
  // chaque post-bataille — voir PostBatailleScreen.terminer(). Absent sur
  // les batailles enregistrées avant l'introduction de ce champ.
  blesses?: { nom: string; retabli: boolean }[];
};

export type BattleRecord = {
  id: string;
  date: string;
  resultat: 'victoire' | 'defaite' | 'nul';
  adversaires: string[];
  notes: string;
  journal?: JournalPostBataille;
};

// Objet créé sur mesure pour une bande précise (voir AchatEquipementModal et
// utils/shop.ts) — même forme qu'un objet du catalogue officiel, mais sans
// gestion d'accès inter-bande : il n'existe que pour cette bande.
export type CustomItem = {
  id: string;
  nom: string;
  categorie: string;
  cout: number | string;
  cout_fixe: boolean;
  rarete?: string;
  disponibilite?: string;
  texte?: string;
  stats_delta?: Partial<Record<keyof Stats, number>>;
};

// Surcharge locale d'un objet existant (officiel ou personnalisé) : un
// instantané complet des champs modifiables pour cette bande — l'objet
// d'origine reste inchangé pour les autres bandes/campagnes. Résolue par id
// dans utils/shop.ts, jamais persistée ailleurs.
export type CustomItemOverride = Omit<CustomItem, 'id'>;

export type RosterInstance = {
  id: string;
  bande_id: string;
  nom_bande: string;
  tresorerie: number;
  wyrdstone: number;
  equipement_reserve: string;
  // Stock structuré de la bande (armurerie) : objets achetés mais pas encore
  // attribués à un membre, ou renvoyés depuis la fiche d'un membre.
  stock: InventoryEntry[];
  // Objets homebrew créés pour cette bande (voir CustomItem ci-dessus) —
  // rejoignent l'onglet "Équipement de la bande" de la modale d'achat.
  objets_personnalises: CustomItem[];
  // Surcharges locales d'objets existants (officiels ou personnalisés),
  // clé = id de l'objet. Permet par ex. d'ajuster un prix "maison" sans
  // affecter les autres bandes.
  objets_surcharges: Record<string, CustomItemOverride>;
  membres: Member[];
  historique_batailles: BattleRecord[];
  // Membre actuellement chef de bande, quand ce n'est pas déterminé par un
  // profil à leadership fixe (voir Profile.est_leader) : choix libre à la
  // création (Lustrian Reavers), départage d'égalité de Commandement à la
  // mort du chef, ou chef intérimaire (Morts-Vivants, en attendant qu'un
  // nouveau Vampire soit recruté). Résolu via utils/leader.ts, jamais lu
  // directement — peut pointer vers un membre mort ou retiré (ignoré par la
  // résolution dans ce cas).
  leader_instance_id?: string;
  // Profils définitivement bannis du recrutement pour cette bande : le chef
  // mort ne peut plus jamais être repris (sauf exemption, ex : Vampire), ou
  // — chez les bandes à "héros rares" comme les Lustrian Reavers — tout héros
  // unique perdu, qu'il ait été chef ou non. Vide par défaut.
  profils_bannis?: string[];
  // Tribu choisie à la création pour les bandes qui en proposent (voir
  // WarbandCatalog.tribus, ex : Maraudeurs du Chaos) — référence vers
  // Tribu.id. Fixé une fois pour toutes, jamais modifié ensuite.
  tribu?: string;
  // Effets à retardement qui doivent survivre au-delà de la session
  // post-bataille courante (bonus au prochain jet d'exploration, franc-tireur
  // engagé gratuitement en attendant l'entretien suivant, jauge cumulative
  // type Œil des Dieux Sombres...) — voir utils/effetsPersistants.ts. Tout
  // état qui doit être retrouvé lors d'un post-bataille ultérieur doit
  // transiter par ce tableau plutôt que par un champ ad hoc.
  effets_persistants?: EffetPersistant[];
  createdAt: string;
  updatedAt: string;
};

export type EffetPersistant = {
  id: string;
  // Identifiant du type d'effet (voir les constantes CLE_* de
  // utils/effetsPersistants.ts) — sert à retrouver/filtrer les effets d'une
  // même nature sans dépendre du texte affiché.
  cle: string;
  // Texte affiché sur la fiche de bande / dans les rappels post-bataille.
  label: string;
  // Compteur ou jauge éventuelle (ex : nombre de dés bonus).
  valeur?: number;
  // instance_id d'un membre, si l'effet cible une figurine précise plutôt
  // que la bande entière (ex : franc-tireur engagé gratuitement).
  cible?: string;
  notes?: string;
};

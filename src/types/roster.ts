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
  competences_acquises: string[];
  sorts_connus: string[];
  statut: Statut;
  // Renseigné automatiquement quand le statut passe à "Mort".
  date_mort?: string;
  // Compteur manuel utilisé quand le statut est "Blessé".
  blesse_tour_actuel: number;
  blesse_tour_total: number;
  blessures_graves: SeriousInjuryRecord[];
  historique_avancees: AdvanceRecord[];
  notes: string;
  // Case manuelle "Grande Cible" (+20 au rating), non liée au catalogue.
  grande_cible: boolean;
  // Profil "Franc-tireur" : présent uniquement pour une recrue hors
  // catalogue, entièrement définie à la création (voir ProfilFrancTireur).
  profil_custom?: ProfilFrancTireur;
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
  tresorerieApres: number;
  blessures: { nom: string; description: string }[];
  survie: { nom: string; survecu: boolean }[];
  // Points vétéran disponibles (2D6 lancés par le joueur), saisis
  // manuellement à titre indicatif — juste affichés dans le journal.
  pointsVeteran: number;
};

export type BattleRecord = {
  id: string;
  date: string;
  resultat: 'victoire' | 'defaite' | 'nul';
  adversaires: string[];
  notes: string;
  journal?: JournalPostBataille;
};

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
  membres: Member[];
  historique_batailles: BattleRecord[];
  createdAt: string;
  updatedAt: string;
};

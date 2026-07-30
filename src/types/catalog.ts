// Modèle de données du catalogue (référence, en lecture seule côté joueur)

export type Stats = {
  M: number;
  CC: number;
  CT: number;
  F: number;
  E: number;
  PV: number;
  I: number;
  A: number;
  Cd: number;
};

export const STAT_KEYS: (keyof Stats)[] = ['M', 'CC', 'CT', 'F', 'E', 'PV', 'I', 'A', 'Cd'];

export type SkillCategory = 'combat' | 'tir' | 'force' | 'academique' | 'vitesse' | 'equitation' | 'special';

export const SKILL_CATEGORIES: { id: SkillCategory; label: string }[] = [
  { id: 'combat', label: 'Combat' },
  { id: 'tir', label: 'Tir' },
  { id: 'force', label: 'Force' },
  { id: 'academique', label: 'Académique' },
  { id: 'vitesse', label: 'Vitesse' },
  { id: 'equitation', label: 'Équitation' },
  { id: 'special', label: 'Spécial' },
];

export type SpecialRule = {
  nom: string;
  texte: string;
  // Précision/dérogation à la règle (ex : "Ne s'applique pas aux Délateurs").
  // Affichée telle quelle en complément du texte, purement informative.
  exception?: string;
};

// Forme minimale dupliquée de Skill (types/gameData.ts) pour éviter un
// import circulaire catalog.ts <-> gameData.ts.
export type CompetenceSpeciale = {
  id: string;
  nom: string;
  texte: string;
  // Restreint la compétence à un rôle précis (ex : "Chef uniquement").
  // Informatif seulement — l'app ne filtre pas la liste en fonction de ça.
  reserve_a?: string;
  // Cette compétence peut être choisie plusieurs fois par le même membre
  // (ex : Mutant chez les Maraudeurs du Chaos, pour cumuler des mutations à
  // prix croissant) — reste proposée après un premier choix, contrairement
  // aux autres compétences.
  repetable?: boolean;
};

export type Profile = {
  id: string;
  nom: string;
  // 'animal' : suivi comme un groupe d'hommes de main (statut simplifié,
  // compteur Hors de combat) mais ne gagne jamais d'expérience.
  type: 'heros' | 'homme_de_main' | 'animal';
  unique?: boolean;
  // Minimum requis dans la composition de bande (ex : chef obligatoire).
  // Informatif seulement — n'empêche pas de recruter/jouer sans.
  min?: number;
  max?: number | null;
  cout: number | null;
  // Notation de dés affichée quand `cout` est variable (donc null, ex :
  // "25+2D6" pour un chien de guerre) — le montant réel est saisi à la main
  // au recrutement, comme pour un objet non `cout_fixe`.
  cout_notation?: string;
  // Score "Rare N" (règles de disponibilité) : un jet de disponibilité est
  // requis en jeu avant de pouvoir recruter ce profil. Purement informatif,
  // comme pour les objets — n'empêche pas de recruter/jouer.
  rarete?: string;
  stats: Stats | null;
  // Notation de dés (ex : "2D6", "D6+1") pour les caractéristiques trop
  // instables pour tenir dans un seul nombre (Mouvement d'un Squig, valeurs
  // du Damné avant fixation via Destin...). La valeur correspondante dans
  // `stats` n'est alors qu'un espace réservé (0), ignoré par tout calcul
  // (rating, plafond, avancées) — seul l'affichage lit ce champ. Copié tel
  // quel sur le Member au recrutement (voir Member.stats_variables) ; peut
  // ensuite en être retiré individuellement une fois une valeur fixée.
  stats_variables?: Partial<Record<keyof Stats, string>>;
  // Ce profil peut dépasser le plafond racial normal de son
  // groupe_caracteristiques (ex : le Damné des Maraudeurs, dont la nature
  // erratique n'est bridée par aucune limite normale) — voir plafondPour.
  plafond_ignore?: boolean;
  // Un membre ayant acquis cette compétence utilise le plafond d'un autre
  // groupe_caracteristiques à la place du sien (ex : Choisi par le Chaos chez
  // les Maraudeurs, qui élève un Héros au niveau Guerrier du Chaos) — voir
  // plafondPour.
  plafond_competence_override?: { competence_id: string; groupe: string };
  acces_competences: SkillCategory[];
  acces_competences_a_verifier?: boolean;
  // La grille qui détermine les cases et paliers d'XP peut différer du type
  // du profil. Les francs-tireurs utilisent celle des hommes de main.
  grille_xp?: 'heros' | 'homme_de_main';
  // La table sur laquelle résoudre une avancée peut à son tour différer de
  // la grille XP. Les francs-tireurs lancent sur la table des héros.
  table_avancement?: 'heros' | 'homme_de_main';
  // Les héros de bande gagnent normalement l'accès générique à Équitation.
  // Les francs-tireurs suivent exclusivement les tables indiquées sur leur
  // profil et désactivent donc cet ajout automatique.
  acces_equitation_automatique?: boolean;
  // Clés du catalogue `WarbandCatalog.equipement` accessibles à ce profil
  // pour l'achat en jeu. Non renseigné = accès à toutes les listes de la
  // bande (repli par défaut, tant que ce champ n'est pas encore rempli
  // partout).
  acces_equipement?: string[];
  xp_depart?: number;
  peut_lancer_sorts?: boolean;
  categorie_magie?: string;
  // Sort(s) toujours connu(s) au recrutement, sans choix — s'ajoute(nt) aux
  // sorts choisis normalement (ex : le Hiérogrammate des Nains du Chaos
  // débute toujours avec le Rituel sacrificiel, en plus d'un rituel choisi).
  sorts_fixes_depart?: string[];
  // Nombre de sorts à choisir librement au recrutement (résultat déjà tiré
  // sur table papier, comme pour tout premier sort) — 1 par défaut pour tout
  // sorcier, davantage si la bande le précise (ex : la Liche des Morts Sans
  // Repos débute avec deux sorts tirés aléatoirement).
  nombre_sorts_choisis_depart?: number;
  // Restreint les sorts accessibles (recrutement et avancées) à ceux connus
  // par un membre vivant de ce profil dans la même bande — retombe sur la
  // liste complète si aucun membre vivant de ce profil n'existe (ex : le
  // Nécromancien des Morts Sans Repos, limité aux sorts connus de la Liche
  // tant qu'elle est vivante ; règle levée si la Liche meurt).
  sorts_restreints_a_profil?: string;
  // Ce profil doit choisir une Marque au recrutement (voir
  // WarbandCatalog.marques, ex : le Devin des Maraudeurs du Chaos) — le
  // choix détermine le domaine de sorts utilisé (Member.marque).
  marque_requise?: boolean;
  // Chef de bande selon les règles (un seul par catalogue) : badge visuel +
  // bonus de +1 XP automatique en cas de victoire.
  est_leader?: boolean;
  // Exemption à la règle générale "le profil du chef mort est banni du
  // recrutement à jamais" : réservée aux profils qui restent recrutables
  // indéfiniment malgré leur statut de chef (ex : le Vampire des
  // Morts-Vivants — un nouveau Vampire peut toujours être recruté après la
  // mort du précédent, et reprend alors le leadership automatiquement dès
  // lors qu'il est vivant, `est_leader` restant prioritaire sur toute
  // assignation manuelle intérimaire — voir utils/leader.ts).
  leader_toujours_recrutable?: boolean;
  // Règles spéciales propres à ce profil (en plus de celles de la bande).
  regles_speciales?: SpecialRule[];
  // Compétences spéciales propres au profil. Utilisé notamment par les
  // francs-tireurs, dont les listes ne dépendent pas de la bande employeuse.
  competences_speciales?: CompetenceSpeciale[];
  // Clé vers CARACTERISTIQUES_MAX (src/data/caracteristiquesMax.ts) : plafond
  // d'avancement applicable à ce profil. Absent seulement pour les profils
  // de type 'animal' (n'avancent jamais, voir avancesDues).
  groupe_caracteristiques?: string;
  // Règle optionnelle "Récompenses du Seigneur des Ombres" (livre de règles
  // Mordheim, p.146) : ce profil peut lancer 2D6 sur cette table au lieu de
  // choisir une compétence lors d'une avancée d'expérience. Réservée aux
  // Magisters/Mutants du Culte des Possédés dans le livre de règles.
  acces_seigneur_des_ombres?: boolean;
  // Ce profil ne peut jamais devenir héros via "Ce gars est doué" normal
  // (voir Profile "Promotion Only" des Lustrian Reavers) : sa seule voie de
  // promotion est de remplir le rôle d'un héros unique tombé, via l'action
  // dédiée sur le roster (voir WarbandCatalog.bannir_profils_uniques_a_mort).
  remplace_heros_tombe?: boolean;
  // Règle spéciale Éternelle (Liche des Morts Sans Repos) : peut ignorer
  // n'importe quel résultat de Blessure grave sauf Tué, en subissant à la
  // place -1 PV permanent (indisponible s'il ne lui reste qu'1 PV) ; un
  // résultat Tué devient -D3 PV permanents, mort normale seulement si cela
  // ramène ses PV à 0 ou moins — voir BlessureGraveWizard.
  eternelle?: boolean;
};

// Contraintes de composition de bande. Purement informatif (affiché comme
// les violations de max existantes) — n'empêche pas de recruter/jouer.
export type Composition = {
  effectif_min?: number;
  effectif_max?: number;
  cout_max_constitution?: number;
};

// Référence vers un objet de la base commune (src/data/items/*.json, extraite
// du compendium "Place du Marché") — nom, catégorie, stats et règles se
// résolvent via item_id, seul le prix (souvent propre à la bande) reste
// dupliqué ici. Remplace l'ancien schéma en texte libre (nom/cout dupliqués)
// pour ne plus dépendre d'une correspondance de nom fragile entre les deux
// sources.
export type EquipementRef = {
  item_id: string;
  cout: number | string;
  note?: string;
  restriction?: string;
};

// Une liste d'équipement nommée (ex : "repurgateurs", "flagellants"...) —
// affichée telle quelle en référence libre, sans automatisation d'achat.
export type EquipementListe = {
  armes_cac?: EquipementRef[];
  armes_tir?: EquipementRef[];
  armures?: EquipementRef[];
  divers?: EquipementRef[];
};

export type EquipementSpecialRef = {
  item_id: string;
  cout: number | string;
  disponibilite?: string;
  // Restreint l'objet à certains profils (ex : mutations réservées à
  // l'Impur). Absent = accessible à tous les profils de la bande.
  profils?: string[];
  // Restreint l'objet aux membres possédant l'une de ces compétences (ex :
  // mutations réservées aux héros ayant pris la compétence spéciale
  // « Mutant »). Absent = pas de restriction par compétence.
  competences?: string[];
  // Objets partageant la même clé : le prix double dès que le membre
  // possède déjà l'un d'entre eux (ex : Bénédictions de Nurgle — la
  // première coûte le prix normal, toute suivante coûte le double).
  groupe_prix?: string;
  // Restreint l'objet aux membres portant l'une de ces Marques (voir
  // Member.marque, ex : Bénédictions de Nurgle réservées aux Héros
  // Maraudeurs avec la Marque d'Onogal). Absent = pas de restriction par
  // Marque.
  marques?: string[];
};

export type MagieSort = {
  resultat: number | string;
  nom: string;
  difficulte: number | string;
  texte: string;
  note?: string;
};

// Système de magie/prières propre à la bande — affiché en référence libre
// sur le roster, sans moteur de jet automatisé.
export type Magie = {
  nom: string;
  type: string;
  de: string;
  utilisateurs: string[];
  note?: string;
  sorts: MagieSort[];
};

// Marque choisie au recrutement par un profil à `marque_requise` (ex : le
// Devin des Maraudeurs du Chaos, qui choisit sa Marque des Dieux Sombres) —
// détermine le domaine de sorts utilisé. Stockée sur Member.marque.
export type Marque = {
  id: string;
  nom: string;
  texte?: string;
  // Clé dans WarbandCatalog.magie_variantes : domaine de sorts propre à
  // cette Marque. Absent = utilise le domaine par défaut du profil
  // (WarbandCatalog.magie), sauf si `pas_de_sorts` est vrai.
  magie_variante?: string;
  // Cette Marque retire tout accès aux sorts (ex : Arkhar, dont le Devin
  // devient un Père de Sang qui ne jette plus de sorts).
  pas_de_sorts?: boolean;
};

// Variante de bande choisie une fois pour toutes à la création (ex : les
// trois tribus des Maraudeurs du Chaos) — modifie certaines règles de
// composition sans justifier un catalogue à part entière. Le choix du
// joueur est stocké sur RosterInstance.tribu (référence vers Tribu.id).
export type Tribu = {
  id: string;
  nom: string;
  // Texte de référence complet des règles propres à cette tribu.
  texte: string;
  // Surcharge de composition.effectif_max pour cette tribu, si différent.
  effectif_max?: number;
  // Surcharge du max d'un profil par id pour cette tribu (null = illimité),
  // si différent du `max` normal du profil.
  profil_max?: Record<string, number | null>;
  // Tous les Héros de cette tribu (y compris les Hommes de main promus)
  // possèdent automatiquement la compétence Équitation dès leur
  // recrutement/promotion (ex : les Hungs et leurs Chevaux de Guerre), sans
  // consommer d'avancée.
  equitation_gratuite_heros?: boolean;
};

export type WarbandCatalog = {
  id: string;
  nom: string;
  grade: string;
  source: string;
  regles_speciales: SpecialRule[];
  tribus?: Tribu[];
  profils: Profile[];
  // Compétences "Spéciale" propres à cette bande (contenu différent par
  // bande, accessible seulement à certains profils via acces_competences).
  // Vide initialement, à remplir bande par bande.
  competences_speciales: CompetenceSpeciale[];
  composition?: Composition;
  // Références libres, affichées en bas du roster sans automatisation.
  equipement?: Record<string, EquipementListe>;
  equipement_special?: EquipementSpecialRef[];
  magie?: Magie;
  // Marques disponibles au recrutement pour les profils à `marque_requise`
  // (voir Marque, Profile.marque_requise, Member.marque).
  marques?: Marque[];
  // Domaines de sorts alternatifs propres à certaines Marques, clé =
  // Marque.magie_variante (voir Marque et magieDuProfil dans utils/magie.ts).
  magie_variantes?: Record<string, Magie>;
  // Bande à progression ralentie (ex : Mangeurs d'Hommes) : chaque case de
  // la grille XP vaut 2 points d'XP réels au lieu d'1 — la case se remplit
  // à moitié au premier point gagné, complètement au second.
  xp_demi?: boolean;
  // Le chef n'est pas un profil fixe : choisi librement par le joueur parmi
  // les héros de la bande (ex : Lustrian Reavers). Aucun profil de cette
  // bande ne doit alors porter `est_leader`.
  leader_libre?: boolean;
  // "Héros rares" (Lustrian Reavers) : la mort de N'IMPORTE quel héros
  // unique bannit son profil du recrutement, pas seulement celui du chef —
  // voir Profile.unique et utils/leader.ts.
  bannir_profils_uniques_a_mort?: boolean;
};

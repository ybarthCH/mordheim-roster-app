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
  { id: 'academique', label: 'Érudition' },
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
  // Nombre maximum de membres vivants de la bande pouvant posséder cette
  // compétence en même temps (ex : Murmures des Racines des Sylvaneths,
  // "un seul Héros" -> 1 ; Solide Carrure des Guerriers Fantômes,
  // "maximum deux figurines" -> 2). Une fois ce plafond atteint, la
  // compétence n'est plus proposée aux AUTRES membres lors d'une avancée
  // (celui qui la possède déjà la garde). Distinct de `reserve_a`, qui
  // restreint À QUI la compétence s'adresse, pas COMBIEN peuvent l'avoir.
  plafond_bande?: number;
  // Id d'une compétence (de n'importe quelle catégorie, pas seulement
  // Spéciale) que le membre doit déjà posséder pour que celle-ci lui soit
  // proposée (ex : Insensible à la douleur des Skavens du Clan Pestilens,
  // "Nécessite la compétence Dur à cuire" -> "force_03"). Distinct de
  // `reserve_a`, qui restreint par profil, pas par compétence déjà acquise.
  necessite_competence?: string;
  // Voir Skill.valeurPuissance (types/gameData.ts) — même métadonnée Power
  // Value, dupliquée ici pour les mêmes raisons que le reste de ce type
  // (éviter un import circulaire catalog.ts <-> gameData.ts).
  valeurPuissance?: number;
  // Cette compétence augmente l'effectif maximum de la bande tant qu'un
  // membre vivant la possède (ex : Invocateur des Morts Sans Repos, "+1") —
  // même principe que Profile.bonus_effectif_max, lu par
  // effectifMaxAutorise() dans utils/validation.ts.
  bonus_effectif_max?: number;
};

export type Profile = {
  id: string;
  nom: string;
  // 'animal' : suivi comme un groupe d'hommes de main (statut simplifié,
  // compteur Hors de combat) mais ne gagne jamais d'expérience.
  type: 'heros' | 'homme_de_main' | 'animal';
  // Profil 'homme_de_main' ou 'heros' explicitement exclu de l'expérience
  // par ses propres règles (ex : Zombie, Squelette, Enfant du Chaos) malgré
  // un type qui la permettrait normalement — voir peutGagnerExperience()
  // dans utils/xp.ts. Les profils 'animal' n'en gagnent déjà jamais, quelle
  // que soit la valeur de ce champ.
  gagne_experience?: boolean;
  unique?: boolean;
  // Minimum requis dans la composition de bande (ex : chef obligatoire).
  // Informatif seulement — n'empêche pas de recruter/jouer sans.
  min?: number;
  max?: number | null;
  // Plafond partagé entre plusieurs profils (et éventuellement des objets
  // d'`equipement_special`, voir EquipementSpecialRef ci-dessous) portant le
  // même `id` — en plus du `max` propre à ce profil. Ex : chez les Pillards
  // de Lustrie, le Molosse estalien (max 2) et le Singe de Barbarie (max 1)
  // partagent avec le Faucon de chasse tiléen (équipement du Maître des
  // bêtes) un plafond combiné de 2 Bêtes de guerre au total — voir
  // comptePlafondGroupe dans utils/shop.ts.
  plafond_groupe?: { id: string; max: number; label?: string };
  // Ce profil ne peut être recruté que si la bande compte déjà au moins un
  // membre vivant (statut != 'mort') de ce profil-ci (ex : chez les Norses,
  // les Loups ne sont autorisés que si la bande possède un Wulfen vivant) —
  // voir peutAjouterMembre.
  requiert_profil_vivant?: string;
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
  // Catégories que ce profil ne peut jamais choisir comme tableau
  // supplémentaire lors d'une promotion "Ce gars est doué" (ex : l'Éclaireur
  // Halfling des Averlanders, qui ne peut jamais choisir Force) — distinct
  // d'acces_competences, qui régit les compétences déjà accessibles au
  // quotidien, pas ce choix ponctuel à la promotion. Voir AvanceeModal.
  tableaux_promotion_interdits?: SkillCategory[];
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
  // Ce profil n'a accès à AUCUN achat via l'onglet "boutique commune",
  // toutes catégories confondues — au-delà de `categories_interdites`
  // (armes/armures uniquement), pour les profils dont la seule
  // équipement légitime est fournie gratuitement à la création (ex :
  // Snotling des Gobelins de la Nuit, Kroxigor des Hommes-Lézards — voir
  // utils/shop.ts equipementInclusDepart) et qui ne devraient donc jamais
  // pouvoir acheter une monture/un véhicule/une munition/un poison via
  // cet onglet générique. Consommé par getShopCommun.
  aucun_achat_shop_commun?: boolean;
  // Catégories entièrement interdites à ce profil par ses propres règles
  // (ex : Flagellant sans armure ni arme de tir), appliqué en plus de
  // `acces_equipement` — celui-ci ne filtre que l'onglet "bande" du shop,
  // alors que l'onglet "commun" (et la recherche d'objet rare) n'a jamais
  // été filtré par profil : voir estCategorieInterdite dans utils/shop.ts.
  // Levé par les compétences "Connaissance des Armes"/"Expert en Armes"
  // pour la catégorie qu'elles couvrent, comme pour acces_equipement.
  // `armes_tir` et `armes_poudre_noire` sont deux entrées distinctes (une
  // bande peut n'interdire que l'une des deux, ex : Artilleurs de Nuln vs
  // Elfes Noirs) — un profil qui doit perdre tout accès au tir liste donc
  // les deux explicitement plutôt que de compter sur un regroupement
  // implicite. `armes_de_jet` cible un sous-type au sein d'`armes_tir` (voir
  // le champ `sous_type` sur les items de data/items/armes_tir.json), pour
  // les bandes qui ne bannissent que les armes lancées à la main (ex :
  // Gardiens de Chapelle Bretonniens). Reste une nuance encore hors de
  // portée : les profils qui n'interdisent qu'un type d'armure précis (ex :
  // Prêtre de Taal, armure lourde uniquement) — non automatisée, laissée en
  // texte informatif dans regles_speciales.
  categories_interdites?: (
    | 'armes_cac'
    | 'armes_tir'
    | 'armes_poudre_noire'
    | 'armes_de_jet'
    | 'armures'
    | 'poisons_drogues'
  )[];
  // Variante de `categories_interdites` qui ne filtre QUE l'onglet "commune"
  // du shop (et la recherche d'objet rare) — jamais l'onglet "bande" via
  // getEquipementBande, contrairement à `categories_interdites` qui filtre
  // les deux (voir son propre commentaire ci-dessus et le cas Artilleurs de
  // Nuln dans getEquipementBande/utils/shop.ts). Nécessaire quand la propre
  // liste d'équipement du profil range légitimement des objets dans une
  // catégorie par ailleurs interdite en boutique commune (ex : le Maître
  // Cuisinier des Mootlanders, dont les ustensiles de cuisine sont rangés
  // sous "armes_cac" — `categories_interdites: ["armes_cac"]` masquerait
  // aussi ses propres ustensiles, ce qui n'est pas voulu). Consommé par
  // getShopCommun uniquement.
  categories_interdites_commun?: (
    | 'armes_cac'
    | 'armes_tir'
    | 'armes_poudre_noire'
    | 'armes_de_jet'
    | 'armures'
    | 'poisons_drogues'
  )[];
  // Ce profil, tant qu'un membre vivant le possède, augmente l'effectif
  // maximum autorisé de la bande d'autant (ex : la Roulotte de la Peste de
  // la Kermesse du Chaos, "+2" — voir effectifMaxAutorise dans
  // utils/validation.ts, qui applique déjà un bonus équivalent en dur pour
  // le Cuisinier Halfling franc-tireur).
  bonus_effectif_max?: number;
  // Ce profil ne compte jamais dans l'effectif total de la bande (ex : les
  // Serviteurs Capturés de la Cavalcade Maudite, "do not count toward the
  // maximum number of models allowed in your warband") — même principe que
  // l'exclusion déjà appliquée aux francs-tireurs dans effectifTotal
  // (utils/bandeValue.ts), mais porté par le profil plutôt que par le statut
  // de franc-tireur.
  exclu_effectif_max?: boolean;
  // L'ensemble des membres de ce profil compte pour une seule figurine
  // dans l'effectif de la bande, quel que soit leur nombre réellement
  // recruté (ex : les Snotlings des Gobelins de la Nuit — "Foule : ...
  // considérés comme une seule figurine en ce qui concerne la taille de
  // la bande." / "Insignifiant : ... ne comptent que pour une seule
  // figurine pour [...] la vente de pierres magiques.") — distinct
  // d'exclu_effectif_max (qui les retire complètement du compte, soit 0
  // plutôt que 1). Consommé par effectifTotal (utils/bandeValue.ts), qui
  // alimente aussi le prix de vente de la pierre magique.
  groupe_compte_comme_un?: boolean;
  // Ce profil précis (et non toute la bande, contrairement à
  // WarbandCatalog.xp_demi, ex : Mangeurs d'Hommes) ne coche qu'une
  // demi-case par point d'expérience gagné — il lui faut donc le double
  // d'XP pour obtenir chaque avancée (ex : "Lent d'Esprit" du Gladiateur
  // Ogre). Consommé par avancesDues (utils/xp.ts), en plus de
  // catalogue.xp_demi.
  demi_xp?: boolean;
  // Compétence(s) acquises gratuitement dès la création du membre, sans
  // consommer d'avancée (ex : le Colosse de la Kermesse du Chaos, qui
  // démarre avec Homme Fort — "Force Surnaturelle") — voir
  // utils/factory.ts creerMembre.
  competences_gratuites?: string[];
  xp_depart?: number;
  peut_lancer_sorts?: boolean;
  categorie_magie?: string;
  // Upgrade optionnel payant qui transforme CE héros en sorcier (Magie
  // mineure), au recrutement ou plus tard en campagne — distinct d'un
  // profil sorcier dès le départ (peut_lancer_sorts) : voir
  // Member.option_sorcier_pris, resolveProfil (surcouche peut_lancer_sorts +
  // categorie_magie une fois pris) et OptionSorcierModal. Ex : l'Ombre de la
  // Jungle des Pillards de Lustrie (Town Cryer #14 / Lustrian Reavers v1.2).
  // `equipement_retire` : item_id de l'équipement de départ à retirer si pris
  // (recherché dans Member.inventaire au moment de l'achat — envoyé à
  // l'armurerie de la bande plutôt que perdu, voir transfererVersStock).
  // Absent d'inventaire (jamais acheté, ou notation "fixe" jamais reportée en
  // inventaire structuré) : aucun effet, silencieusement ignoré.
  option_sorcier?: { cout: number; equipement_retire?: string[] };
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
  // Ce profil doit acheter au moins un objet de categorie "mutations" au
  // recrutement (règle "doit commencer la partie avec une ou plusieurs
  // mutations" — ex : le Mutant du Culte des Possédés, l'Impur de la
  // Kermesse du Chaos) — bloque le bouton Terminer de l'étape équipement
  // du recrutement tant qu'aucune n'a été ajoutée au panier. Contrairement
  // au Possédé (mutations facultatives à son recrutement), non applicable
  // aux héros qui accèdent aux mutations via la compétence "Mutant"
  // (Maraudeurs du Chaos, Pillards Hommes-Bêtes) : cette compétence se
  // prend en avancée, hors du flux de recrutement que ce champ contrôle.
  mutation_requise_au_recrutement?: boolean;
  // Empêche définitivement ce profil de déclencher "Ce gars est doué"/Lads
  // Got Talent : l'entrée Promotion reste visible mais désactivée sur la
  // table d'avancement (voir AvanceeModal), le joueur doit relancer
  // physiquement pour obtenir un autre résultat — même mécanisme que la
  // limite de 6 héros déjà en place. Ex : le Fanatique Gobelin de la Nuit
  // ("Cerveau champignon"), ou un Squig des Cavernes désigné Entraîné (voir
  // designation_entrainee juste en dessous).
  ne_peut_jamais_devenir_heros?: boolean;
  // Marque ce profil ('animal' normalement) comme pouvant être désigné
  // manuellement par le joueur — une figurine à la fois, isolée d'un groupe
  // (Member.taille_groupe === 1) — comme statut spécial (Member.
  // squig_entraine), à condition qu'un membre vivant du profil
  // `profil_dresseur` ait acquis la compétence `competence_requise`. Une
  // seule figurine désignée à la fois dans toute la bande (voir
  // peutDesignerEntraine dans utils/profil.ts). Ex : le Squig des Cavernes
  // des Gobelins de la Nuit, désignable "Squig Entraîné" une fois le Berger
  // à Squig doté de la compétence "Entraînement" — gagne alors de l'XP
  // comme un Homme de Main (voir resolveProfil, qui superpose ce
  // comportement par-dessus le profil animal de base).
  designation_entrainee?: { competence_requise: string; profil_dresseur: string };
  // Chef de bande selon les règles (un seul par catalogue) : badge visuel +
  // bonus de +1 XP automatique en cas de victoire.
  est_leader?: boolean;
  // Engagé/mercenaire payé par le chef de bande : ne peut jamais devenir
  // chef, ni par succession automatique à la mort du chef actuel (voir
  // succederApresMorts dans utils/leader.ts) ni par choix manuel du joueur
  // en cas d'égalité de Commandement (voir la modale de choix de chef dans
  // RosterScreen.tsx). Ex : le Chevalier d'Avant-garde et le Magicien des
  // Caravanes marchandes ("Engagé").
  ne_peut_jamais_devenir_chef?: boolean;
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
  // Compétences spéciales propres au profil. Par défaut, REMPLACE la liste
  // Spéciale de la bande pour ce profil (utilisé notamment par les
  // francs-tireurs, dont les listes ne dépendent pas de la bande employeuse) —
  // sauf si `competences_speciales_ajoutees` est vrai, auquel cas elle s'y
  // ajoute (voir ce champ).
  competences_speciales?: CompetenceSpeciale[];
  // Si vrai, `competences_speciales` s'ajoute à la liste Spéciale de la
  // bande au lieu de la remplacer (ex : le Berger à Squig gobelin, dont les
  // compétences dédiées viennent en plus de la liste Spéciale de la bande,
  // pas à sa place). Sans effet si `competences_speciales` est absent.
  competences_speciales_ajoutees?: boolean;
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
  // Réserve cet objet précis aux profils de type 'heros' au sein d'une liste
  // par ailleurs partagée avec des hommes de main (voir getEquipementBande
  // dans utils/shop.ts) — ex : le Fouet d'hédoniste de la Cour des Plaisirs
  // Profanes ("Heroes only"). `note`/`restriction` restent purement du texte
  // affiché ; ce champ est le seul qui bloque réellement l'achat.
  heros_uniquement?: boolean;
  // Réserve cet objet précis à un ou plusieurs profils nommés au sein d'une
  // liste par ailleurs partagée avec d'autres profils — même principe que
  // EquipementSpecialRef.profils, pour un objet resté dans la liste normale
  // plutôt que déplacé en equipement_special (ex : le Sabre de Cathay des
  // Mangeurs d'Hommes, "Capitaine only", partagé avec les autres Ogres dans
  // la même liste `ogres`). Absent = accessible à tous les profils ayant
  // accès à la liste.
  profils?: string[];
  // Même principe que EquipementSpecialRef.rarete (voir son propre
  // commentaire) : surcharge le seuil de rareté de l'objet de base pour
  // cette bande précise (ex : les Champignons bonnets de fou d'Orc Mob,
  // objet habituellement Rare 9 mais rendu commun à 25 CO pour une bande
  // avec au moins un Gobelin — "rarete": "-"). Absent = utilise Item.rarete
  // sans changement.
  rarete?: string;
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
  // Surcharge le seuil de rareté NUMÉRIQUE de l'objet de base (Item.rarete)
  // pour cette bande précise — nécessaire quand un même objet a des seuils
  // différents selon le Setting/la bande (ex : l'Amulette lunaire, Rare 12
  // pour les Amazones du Setting Mordheim mais Rare 11 pour celles du
  // Setting Lustrie). `disponibilite` (texte libre) peut déjà l'annoncer,
  // mais sans ce champ le calcul réel de rareté (recherche d'objet rare
  // post-bataille, masquage des objets Rares après la 1ère bataille —
  // voir estObjetRare/masquerObjetsRares) continuait de lire Item.rarete
  // tel quel, ignorant la surcharge textuelle. Une valeur non numérique
  // (ex : "-") force le statut "jamais Rare pour cette bande" (même
  // convention que Item.rarete, voir estObjetRare) — utile pour un objet
  // habituellement Rare mais explicitement rendu commun par une règle de
  // bande (ex : les Herbes Médicinales des Amazones). Absent = utilise
  // Item.rarete sans changement.
  rarete?: string;
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
  // Voir Profile.plafond_groupe — un objet peut partager le même plafond
  // combiné qu'un ou plusieurs profils recrutables (ex : le Faucon de
  // chasse tiléen des Pillards de Lustrie, compté avec le Molosse estalien
  // et le Singe de Barbarie dans le plafond des 2 Bêtes de guerre).
  plafond_groupe?: { id: string; max: number; label?: string };
};

export type MagieSort = {
  resultat: number | string;
  // Identifiant stable dérivé du nom français canonique (jamais du nom
  // affiché) — seule clé fiable pour référencer un sort dans les données
  // persistées (Member.sorts_connus), le nom pouvant varier selon la langue
  // d'affichage. Voir utils/magie.ts.
  id: string;
  nom: string;
  difficulte: number | string;
  texte: string;
  note?: string;
  // Ce sort n'est proposé qu'au profil désigné (id) — utile quand deux
  // sorts distincts partagent le même `resultat` avec des lanceurs
  // mutuellement exclusifs (ex : Morts Tourmentés, Vision Funeste
  // "Nécromanciens uniquement" / Horreur Vivante "Liche uniquement" au
  // résultat 6). Sans effet sur le profil auquel il est déjà réservé —
  // sert seulement à l'exclure des AUTRES profils, y compris quand
  // Profile.sorts_restreints_a_profil le ferait sinon apparaître à tort
  // (voir sortsDisponiblesPourRoster, utils/magie.ts).
  reserve_a_profil?: string;
  // Id d'un autre sort de la même table : quand le profil référencé par
  // Profile.sorts_restreints_a_profil du lanceur courant connaît CE sort
  // (`reserve_a_profil` d'un autre lanceur), CELUI-CI devient disponible en
  // exception — modélise la règle "Apprenti" du Nécromancien des Morts
  // Tourmentés ("accessible si la Liche connaît le sort Horreur Vivante").
  exception_si_connu?: string;
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
  // Il ne peut jamais y avoir dans la bande deux figurines vivantes portant
  // des Marques différentes — sauf celle(s) marquées `coexiste_avec_autres`
  // (ex : la Marque du Chaos Universel des Maraudeurs du Chaos), qui restent
  // toujours proposables même si une autre Marque est déjà portée ailleurs
  // dans la bande. Voir marquesDisponibles dans utils/magie.ts.
  coexiste_avec_autres?: boolean;
  // Catégories de compétences supplémentaires accordées en plus de celles du
  // profil (ex : Marque d'Arkhar — le Devin devenu Père de Sang accède aux
  // compétences de Force). Fusionnées par resolveProfil dans utils/profil.ts.
  competences_supplementaires?: SkillCategory[];
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
  // Surcharge de l'accès aux compétences par profil pour cette tribu, si
  // différent de celui du profil de base (ex : les trois cités-états
  // tiléennes ont chacune leur propre tableau de compétences pour un même
  // profil Capitaine/Champion/Recrue). Clé = Profile.id.
  profil_acces_competences?: Record<string, SkillCategory[]>;
};

export type WarbandCatalog = {
  id: string;
  nom: string;
  grade: string;
  source: string;
  // Chemin vers l'illustration bannière de la bande (relatif à public/, ex.
  // "bandes/orc_mob.webp"). Optionnel : les bandes sans illustration
  // n'affichent simplement aucune bannière.
  banniere?: string;
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
  // Le calcul générique des dés d'Exploration (1 par Héros debout + bonus de
  // victoire + bonus fixes détectés par mot-clé) ne correspond pas à cette
  // bande : ses règles conditionnent chaque dé de Héros à l'issue de la
  // partie individuellement (ex : Culte des Tueurs — Seulement en Victoire,
  // Registre de Bravoure) plutôt que d'ajouter un bonus global. Plutôt que
  // d'afficher un total chiffré trompeur, l'app invite le joueur à calculer
  // lui-même le nombre de dés — voir utils/exploration.ts et
  // EtapeExploration.tsx.
  des_exploration_manuels?: boolean;
  // Bonus fixe et inconditionnel de dé(s) d'Exploration pour toute la
  // bande, ajouté à chaque phase d'Exploration quel que soit le résultat
  // de la partie (ex : Gardiens des Tombes — "Terrain natal" : "Une bande
  // de Gardiens des Tombes lance toujours un dé supplémentaire lors de la
  // phase d'Exploration."). Distinct de `des_exploration_manuels`, réservé
  // aux bandes dont le calcul générique ne peut pas du tout s'appliquer —
  // ici le calcul reste valide, il lui manque juste ce bonus fixe. Voir
  // utils/exploration.ts (resumeExploration).
  bonus_des_exploration_fixe?: number;
};

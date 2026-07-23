// Plafonds de caractéristiques par race/groupe ("Augmentation de
// caractéristique", livre de règles p.121) — table canonique unique,
// partagée par toutes les bandes plutôt que dupliquée par catalogue.
// Chaque profil pointe vers une entrée d'ici via `groupe_caracteristiques`.
import type { Stats } from '../types/catalog';

export type PlafondCaracteristiques = {
  label: string;
  note?: string;
} & Record<keyof Stats, number>;

export const CARACTERISTIQUES_MAX: Record<string, PlafondCaracteristiques> = {
  humain: { label: 'Humain', M: 4, CC: 6, CT: 6, F: 4, E: 4, PV: 3, I: 6, A: 4, Cd: 9 },
  maraudeur: { label: 'Maraudeur', M: 4, CC: 7, CT: 7, F: 4, E: 4, PV: 3, I: 7, A: 4, Cd: 9 },
  guerrier_du_chaos: { label: 'Guerrier du Chaos', M: 4, CC: 8, CT: 8, F: 5, E: 5, PV: 3, I: 8, A: 5, Cd: 9 },

  elfe: { label: 'Elfe', M: 5, CC: 7, CT: 7, F: 4, E: 4, PV: 3, I: 9, A: 4, Cd: 10 },

  goule: { label: 'Goule', M: 5, CC: 5, CT: 2, F: 4, E: 5, PV: 3, I: 5, A: 5, Cd: 7 },

  halfling: { label: 'Halfling', M: 4, CC: 5, CT: 7, F: 3, E: 3, PV: 3, I: 9, A: 4, Cd: 10 },

  hommes_betes_gor: { label: 'Gor et autres', M: 5, CC: 7, CT: 6, F: 4, E: 5, PV: 4, I: 6, A: 4, Cd: 9 },
  hommes_betes_ungor: { label: 'Ungor', M: 6, CC: 6, CT: 6, F: 4, E: 4, PV: 3, I: 7, A: 4, Cd: 7 },
  hommes_betes_centigor: { label: 'Centigor', M: 9, CC: 7, CT: 6, F: 4, E: 5, PV: 4, I: 6, A: 4, Cd: 9 },
  hommes_betes_minotaure: { label: 'Minotaure', M: 6, CC: 6, CT: 5, F: 5, E: 5, PV: 5, I: 6, A: 5, Cd: 9 },

  hommes_lezards_skinks: { label: 'Skinks', M: 6, CC: 5, CT: 6, F: 4, E: 3, PV: 3, I: 7, A: 4, Cd: 8 },
  hommes_lezards_saurus: {
    label: 'Saurus',
    M: 4,
    CC: 6,
    CT: 0,
    F: 5,
    E: 5,
    PV: 3,
    I: 4,
    A: 4,
    Cd: 10,
    note: "Attaques : certaines augmentations d'Attaques portent le plafond à 5 (voir règle spécifique du profil).",
  },

  morts_vivants_vampire: { label: 'Vampire', M: 6, CC: 8, CT: 6, F: 7, E: 6, PV: 4, I: 9, A: 4, Cd: 10 },
  morts_vivants_roi_des_tombes: { label: 'Roi des tombes', M: 4, CC: 6, CT: 6, F: 5, E: 5, PV: 5, I: 5, A: 4, Cd: 9 },
  morts_vivants_pretre_liche: {
    label: 'Prêtre-Liche et Acolytes',
    M: 4,
    CC: 6,
    CT: 6,
    F: 4,
    E: 4,
    PV: 3,
    I: 6,
    A: 4,
    Cd: 9,
  },
  morts_vivants_liche: { label: 'Liche', M: 5, CC: 4, CT: 4, F: 4, E: 4, PV: 8, I: 6, A: 3, Cd: 10 },
  morts_vivants_gardien_des_tombes: {
    label: 'Gardien des tombes',
    M: 5,
    CC: 5,
    CT: 5,
    F: 4,
    E: 4,
    PV: 4,
    I: 5,
    A: 4,
    Cd: 10,
  },

  nain: { label: 'Nain', M: 3, CC: 7, CT: 6, F: 4, E: 5, PV: 3, I: 5, A: 4, Cd: 10 },
  nain_centaure_taureau: { label: 'Centaure-Taureau', M: 8, CC: 7, CT: 6, F: 5, E: 5, PV: 4, I: 6, A: 5, Cd: 10 },
  // Variante propre aux Nains du Chaos (Centaure-Taureau corrompu) : plafond
  // différent de celui du Centaure-Taureau standard ci-dessus (source :
  // catalogue nains_du_chaos.json).
  nain_du_chaos_centaure_taureau: {
    label: 'Centaure-Taureau (Nains du Chaos)',
    M: 8,
    CC: 8,
    CT: 8,
    F: 5,
    E: 5,
    PV: 3,
    I: 8,
    A: 5,
    Cd: 9,
  },

  ogre_garde_mangeur: {
    label: "Garde du corps & Mangeur d'Homme",
    M: 6,
    CC: 6,
    CT: 5,
    F: 5,
    E: 5,
    PV: 5,
    I: 6,
    A: 5,
    Cd: 9,
  },
  ogre_gladiateur_ostlander: {
    label: 'Gladiateur & Mercenaire Ostlander',
    M: 6,
    CC: 5,
    CT: 4,
    F: 6,
    E: 6,
    PV: 4,
    I: 5,
    A: 4,
    Cd: 7,
  },

  peaux_vertes_gobelin: { label: 'Gobelin', M: 4, CC: 5, CT: 6, F: 4, E: 4, PV: 3, I: 6, A: 4, Cd: 7 },
  peaux_vertes_orque: { label: 'Orque', M: 4, CC: 6, CT: 6, F: 4, E: 5, PV: 3, I: 5, A: 4, Cd: 9 },
  peaux_vertes_orque_noir: { label: 'Orque noir', M: 4, CC: 7, CT: 6, F: 5, E: 6, PV: 3, I: 5, A: 4, Cd: 9 },

  possede: { label: 'Possédé', M: 6, CC: 8, CT: 0, F: 6, E: 6, PV: 4, I: 7, A: 5, Cd: 10 },

  skaven: { label: 'Skaven', M: 6, CC: 6, CT: 6, F: 4, E: 4, PV: 3, I: 7, A: 4, Cd: 7 },
  skaven_pestilens: { label: 'Skaven Clan Pestilens', M: 5, CC: 6, CT: 6, F: 4, E: 5, PV: 3, I: 7, A: 4, Cd: 7 },

  garou: { label: 'Garou', M: 8, CC: 6, CT: 0, F: 6, E: 5, PV: 4, I: 7, A: 4, Cd: 9 },
};

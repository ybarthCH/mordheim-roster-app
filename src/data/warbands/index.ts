import type { WarbandCatalog } from '../../types/catalog';

import amazones_lustrie from './amazones_lustrie.json';
import amazones_mordheim from './amazones_mordheim.json';
import artilleurs_de_nuln from './artilleurs_de_nuln.json';
import averlanders from './averlanders.json';
import bandits_du_hochland from './bandits_du_hochland.json';
import beastmen_raiders from './beastmen_raiders.json';
import caravanes_marchandes from './caravanes_marchandes.json';
import carnival_of_chaos from './carnival_of_chaos.json';
import cavalcade_maudite from './cavalcade_maudite.json';
import chasseurs_cornus from './chasseurs_cornus.json';
import chevaliers_bretonniens from './chevaliers_bretonniens.json';
import cour_des_plaisirs_profanes from './cour_des_plaisirs_profanes.json';
import cult_of_the_possessed from './cult_of_the_possessed.json';
import culte_des_tueurs from './culte_des_tueurs.json';
import dwarf_treasure_hunters from './dwarf_treasure_hunters.json';
import elfes_noirs from './elfes_noirs.json';
import escorteurs_imperiaux from './escorteurs_imperiaux.json';
import expedition_runique from './expedition_runique.json';
import fils_dhashut from './fils_dhashut.json';
import gardiens_de_chapelle_bretonniens from './gardiens_de_chapelle_bretonniens.json';
import gardiens_des_tombes from './gardiens_des_tombes.json';
import gladiateurs from './gladiateurs.json';
import gobelins_de_la_nuit from './gobelins_de_la_nuit.json';
import gobelins_des_forets from './gobelins_des_forets.json';
import guerriers_fantomes from './guerriers_fantomes.json';
import hommes_lezards from './hommes_lezards.json';
import hors_la_loi_de_stirwood from './hors_la_loi_de_stirwood.json';
import kislevites from './kislevites.json';
import lustrian_reavers from './lustrian_reavers.json';
import maneaters from './maneaters.json';
import maraudeurs_du_chaos from './maraudeurs_du_chaos.json';
import marienburgers from './marienburgers.json';
import middenheimers from './middenheimers.json';
import moines_guerriers_de_cathay from './moines_guerriers_de_cathay.json';
import mootlanders from './mootlanders.json';
import morts_sans_repos from './morts_sans_repos.json';
import nains_du_chaos from './nains_du_chaos.json';
import norses from './norses.json';
import orc_mob from './orc_mob.json';
import orques_noirs from './orques_noirs.json';
import ostermarkers from './ostermarkers.json';
import ostlanders from './ostlanders.json';
import pilleurs_de_tombes_arabes from './pilleurs_de_tombes_arabes.json';
import pirates from './pirates.json';
import reiklanders from './reiklanders.json';
import sisters_of_sigmar from './sisters_of_sigmar.json';
import skaven from './skaven.json';
import skavens_pestilens from './skavens_pestilens.json';
import sylvaneths from './sylvaneths.json';
import tileens from './tileens.json';
import undead from './undead.json';
import witch_hunters from './witch_hunters.json';

export const CATALOGUES: WarbandCatalog[] = [
  amazones_lustrie,
  amazones_mordheim,
  artilleurs_de_nuln,
  averlanders,
  bandits_du_hochland,
  beastmen_raiders,
  caravanes_marchandes,
  carnival_of_chaos,
  cavalcade_maudite,
  chasseurs_cornus,
  chevaliers_bretonniens,
  cour_des_plaisirs_profanes,
  cult_of_the_possessed,
  culte_des_tueurs,
  dwarf_treasure_hunters,
  elfes_noirs,
  escorteurs_imperiaux,
  expedition_runique,
  fils_dhashut,
  gardiens_de_chapelle_bretonniens,
  gardiens_des_tombes,
  gladiateurs,
  gobelins_de_la_nuit,
  gobelins_des_forets,
  guerriers_fantomes,
  hommes_lezards,
  hors_la_loi_de_stirwood,
  kislevites,
  lustrian_reavers,
  maneaters,
  maraudeurs_du_chaos,
  marienburgers,
  middenheimers,
  moines_guerriers_de_cathay,
  mootlanders,
  morts_sans_repos,
  nains_du_chaos,
  norses,
  orc_mob,
  orques_noirs,
  ostermarkers,
  ostlanders,
  pilleurs_de_tombes_arabes,
  pirates,
  reiklanders,
  sisters_of_sigmar,
  skaven,
  skavens_pestilens,
  sylvaneths,
  tileens,
  undead,
  witch_hunters,
] as unknown as WarbandCatalog[];

export const CATALOGUES_PAR_ID: Record<string, WarbandCatalog> = Object.fromEntries(
  CATALOGUES.map((c) => [c.id, c])
);

export function getCatalogue(id: string): WarbandCatalog | undefined {
  return CATALOGUES_PAR_ID[id];
}

export function getProfil(bandeId: string, profilId: string) {
  return getCatalogue(bandeId)?.profils.find((p) => p.id === profilId);
}

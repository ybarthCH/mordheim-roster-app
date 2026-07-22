import type { WarbandCatalog } from '../../types/catalog';

import artilleurs_de_nuln from './artilleurs_de_nuln.json';
import averlanders from './averlanders.json';
import beastmen_raiders from './beastmen_raiders.json';
import carnival_of_chaos from './carnival_of_chaos.json';
import cult_of_the_possessed from './cult_of_the_possessed.json';
import dwarf_treasure_hunters from './dwarf_treasure_hunters.json';
import gardiens_de_chapelle_bretonniens from './gardiens_de_chapelle_bretonniens.json';
import gladiateurs from './gladiateurs.json';
import gobelins_de_la_nuit from './gobelins_de_la_nuit.json';
import kislevites from './kislevites.json';
import lustrian_reavers from './lustrian_reavers.json';
import maneaters from './maneaters.json';
import maraudeurs_du_chaos from './maraudeurs_du_chaos.json';
import marienburgers from './marienburgers.json';
import middenheimers from './middenheimers.json';
import morts_sans_repos from './morts_sans_repos.json';
import nains_du_chaos from './nains_du_chaos.json';
import norses from './norses.json';
import orc_mob from './orc_mob.json';
import ostlanders from './ostlanders.json';
import reiklanders from './reiklanders.json';
import sisters_of_sigmar from './sisters_of_sigmar.json';
import skaven from './skaven.json';
import undead from './undead.json';
import witch_hunters from './witch_hunters.json';

export const CATALOGUES: WarbandCatalog[] = [
  artilleurs_de_nuln,
  averlanders,
  beastmen_raiders,
  carnival_of_chaos,
  cult_of_the_possessed,
  dwarf_treasure_hunters,
  gardiens_de_chapelle_bretonniens,
  gladiateurs,
  gobelins_de_la_nuit,
  kislevites,
  lustrian_reavers,
  maneaters,
  maraudeurs_du_chaos,
  marienburgers,
  middenheimers,
  morts_sans_repos,
  nains_du_chaos,
  norses,
  orc_mob,
  ostlanders,
  reiklanders,
  sisters_of_sigmar,
  skaven,
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

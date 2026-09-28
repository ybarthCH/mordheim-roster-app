import type { SkillsData, AdvanceEntry } from '../types/gameData';
import skillsRaw from './skills.json';
import avancementHerosRaw from './table_avancement_heros.json';
import avancementHommesDeMainRaw from './table_avancement_hommes_de_main.json';

export const SKILLS = skillsRaw as unknown as SkillsData;

export const TABLE_AVANCEMENT_HEROS = avancementHerosRaw.table as AdvanceEntry[];
export const TABLE_AVANCEMENT_HOMMES_DE_MAIN = avancementHommesDeMainRaw.table as AdvanceEntry[];

export function skillById(id: string) {
  for (const cat of Object.keys(SKILLS) as (keyof SkillsData)[]) {
    const found = SKILLS[cat].find((s) => s.id === id);
    if (found) return found;
  }
  return undefined;
}

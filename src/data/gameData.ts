import type { SkillsData, InjuryEntry, AdvanceEntry, CaracAleatoireEntry } from '../types/gameData';
import skillsRaw from './skills.json';
import blessuresRaw from './blessures_graves.json';
import avancementRaw from './table_avancement.json';

export const SKILLS = skillsRaw as unknown as SkillsData;

export const BLESSURES_GRAVES: InjuryEntry[] = blessuresRaw.table as InjuryEntry[];

export const TABLE_AVANCEMENT: AdvanceEntry[] = avancementRaw.table as AdvanceEntry[];
export const CARACTERISTIQUES_ALEATOIRES =
  avancementRaw.caracteristiques_aleatoires as CaracAleatoireEntry[];

export function skillById(id: string) {
  for (const cat of Object.keys(SKILLS) as (keyof SkillsData)[]) {
    const found = SKILLS[cat].find((s) => s.id === id);
    if (found) return found;
  }
  return undefined;
}

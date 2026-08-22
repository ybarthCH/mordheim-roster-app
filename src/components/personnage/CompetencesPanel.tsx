import { useState } from 'react';
import type { Member } from '../../types/roster';
import type { Profile, SkillCategory, WarbandCatalog } from '../../types/catalog';
import { SKILLS } from '../../data/gameData';
import { categoriesAccessibles, competencesSpecialesPourProfil } from '../../utils/profil';
import { useLanguage } from '../../state/useLanguage';
import { translateSkill } from '../../i18n/data/skills';

type Props = {
  member: Member;
  profil: Profile;
  catalogue: WarbandCatalog;
  onToggleSkill: (skillId: string) => void;
};

export function CompetencesPanel({ member, profil, catalogue, onToggleSkill }: Props) {
  const { language, t } = useLanguage();
  const categories: SkillCategory[] = categoriesAccessibles(profil);

  const [ongletActif, setOngletActif] = useState<SkillCategory>(categories[0]);

  const skillsDeLaCategorie = (cat: SkillCategory) =>
    cat === 'special' ? competencesSpecialesPourProfil(profil, catalogue) : SKILLS[cat];
  const competencesSpeciales = competencesSpecialesPourProfil(profil, catalogue);

  return (
    <div>
      {profil.acces_competences_a_verifier && (
        <p className="text-sm text-danger">{t('competencesPanel.unconfirmedAccessWarning')}</p>
      )}
      <div className="tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tabs__btn ${ongletActif === cat ? 'tabs__btn--active' : ''}`}
            onClick={() => setOngletActif(cat)}
          >
            {t(`skillCategory.${cat}`)}
          </button>
        ))}
      </div>
      <div className="skill-list">
        {skillsDeLaCategorie(ongletActif).map((skillOriginal) => {
          const skill = translateSkill(skillOriginal, language);
          return (
            <label key={skill.id} className="skill-check" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={member.competences_acquises.includes(skill.id)}
                onChange={() => onToggleSkill(skill.id)}
              />
              <span>
                <span className="skill-check__name">{skill.nom}</span>
                <br />
                <span className="skill-check__text">{skill.texte}</span>
              </span>
            </label>
          );
        })}
        {ongletActif === 'special' && competencesSpeciales.length === 0 && (
          <p className="text-muted text-sm">{t('competencesPanel.noSpecialSkills')}</p>
        )}
      </div>
    </div>
  );
}

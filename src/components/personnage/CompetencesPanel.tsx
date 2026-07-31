import { useState } from 'react';
import type { Member } from '../../types/roster';
import type { Profile, SkillCategory, WarbandCatalog } from '../../types/catalog';
import { SKILL_CATEGORIES } from '../../types/catalog';
import { SKILLS } from '../../data/gameData';
import { categoriesAccessibles } from '../../utils/profil';
import { useLanguage } from '../../state/useLanguage';
import { translateSkill } from '../../i18n/data/skills';

type Props = {
  member: Member;
  profil: Profile;
  catalogue: WarbandCatalog;
  onToggleSkill: (skillId: string) => void;
};

export function CompetencesPanel({ member, profil, catalogue, onToggleSkill }: Props) {
  const { language } = useLanguage();
  const categories: SkillCategory[] = categoriesAccessibles(profil);

  const [ongletActif, setOngletActif] = useState<SkillCategory>(categories[0]);

  const skillsDeLaCategorie = (cat: SkillCategory) =>
    cat === 'special' ? (profil.competences_speciales ?? catalogue.competences_speciales) : SKILLS[cat];
  const competencesSpeciales = profil.competences_speciales ?? catalogue.competences_speciales;

  return (
    <div>
      {profil.acces_competences_a_verifier && (
        <p className="text-sm text-danger">
          ⚠ Accès aux tables de compétences non confirmé dans les données source — toutes les tables sont affichées par
          précaution.
        </p>
      )}
      <div className="tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tabs__btn ${ongletActif === cat ? 'tabs__btn--active' : ''}`}
            onClick={() => setOngletActif(cat)}
          >
            {SKILL_CATEGORIES.find((c) => c.id === cat)?.label}
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
          <p className="text-muted text-sm">
            Aucune compétence spéciale renseignée pour cette bande pour l'instant.
          </p>
        )}
      </div>
    </div>
  );
}

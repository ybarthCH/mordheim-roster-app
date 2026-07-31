// Mécanique "Promotions" des Lustrian Reavers : quand un héros unique tombe,
// aucun remplaçant du même profil ne peut être acheté (voir
// WarbandCatalog.bannir_profils_uniques_a_mort) — la bande peut à la place
// promouvoir un Prospect vivant pour qu'il assume ce rôle précis, comme s'il
// avait réussi "Ce gars est doué" : deux tables de compétences au choix, un
// jet immédiat sur la table d'avancement des héros (enchaîné via
// AvanceeModal, comme la promotion normale), et récupération des armes et
// armures (pas le reste de l'équipement) du héros tombé.
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Member, RosterInstance, AdvanceRecord } from '../../types/roster';
import type { SkillCategory, WarbandCatalog } from '../../types/catalog';
import { SKILL_CATEGORIES } from '../../types/catalog';
import { formatEquipementAffiche } from '../../utils/shop';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../state/useLanguage';

const CATEGORIES_ARMES_ARMURES = new Set(['armes_cac', 'armes_tir', 'armes_poudre_noire', 'munitions', 'armures']);

type Props = {
  roster: RosterInstance;
  catalogue: WarbandCatalog;
  rolesVacants: string[];
  prospects: Member[];
  onClose: () => void;
  // `nouveauHeros` : le Prospect promu, avec son nouveau profil et son
  // équipement hérité — ouvre immédiatement AvanceeModal dessus (jet
  // immédiat sur la table héros, comme "Ce gars est doué").
  onConfirm: (roster: RosterInstance, nouveauHeros: Member) => void;
};

export function PromotionHerosDechuModal({ roster, catalogue, rolesVacants, prospects, onClose, onConfirm }: Props) {
  const { t } = useLanguage();
  const [profilId, setProfilId] = useState(rolesVacants.length === 1 ? rolesVacants[0] : '');
  const [prospectId, setProspectId] = useState(prospects.length === 1 ? prospects[0].instance_id : '');
  const [categories, setCategories] = useState<SkillCategory[]>([]);

  const profilVacant = catalogue.profils.find((p) => p.id === profilId);
  const prospect = prospects.find((m) => m.instance_id === prospectId);

  const toggleCategorie = (cat: SkillCategory) => {
    setCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const confirmer = () => {
    if (!profilVacant || !prospect || categories.length < 2) return;

    const herosTombe = roster.membres.find((m) => m.profil_id === profilVacant.id && m.statut === 'mort');
    const equipementHerite = (herosTombe?.inventaire ?? []).filter((e) => CATEGORIES_ARMES_ARMURES.has(e.categorie));

    const record: AdvanceRecord = {
      id: uuidv4(),
      date: new Date().toISOString().slice(0, 10),
      xpAtRoll: prospect.xp,
      roll: 0,
      type: 'promotion',
      detail: `Promu ${profilVacant.nom} (rôle vacant) — tables : ${categories
        .map((c) => SKILL_CATEGORIES.find((sc) => sc.id === c)?.label)
        .join(', ')}`,
    };

    const nouveauHeros: Member = {
      instance_id: uuidv4(),
      profil_id: profilVacant.id,
      nom_perso: prospect.nom_perso,
      equipement: formatEquipementAffiche(equipementHerite),
      inventaire: equipementHerite,
      xp: prospect.xp,
      xp_depart: prospect.xp_depart,
      stats_actuels: profilVacant.stats ? { ...profilVacant.stats } : prospect.stats_actuels,
      stats_modifiees: [],
      competences_acquises: [],
      sorts_connus: [],
      regles_speciales_notes: [],
      statut: 'actif',
      blesse_tour_actuel: 0,
      blesse_tour_total: 0,
      blessures_graves: [],
      historique_avancees: [record],
      notes: prospect.notes,
      grande_cible: false,
      taille_groupe: 1,
      hors_combat: 0,
      promu_heros: true,
      acces_competences_override: categories,
    };

    const membresRestants = roster.membres.filter((m) => m.instance_id !== prospect.instance_id);
    onConfirm({ ...roster, membres: [...membresRestants, nouveauHeros] }, nouveauHeros);
  };

  return (
    <Modal onClose={onClose}>
      <h3>{t('promotion.title')}</h3>
      <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
        {t('promotion.body')}
      </p>

      {rolesVacants.length > 1 && (
        <div className="field">
          <label>{t('promotion.roleToFill')}</label>
          <select value={profilId} onChange={(e) => setProfilId(e.target.value)}>
            <option value="">{t('promotion.choose')}</option>
            {rolesVacants.map((id) => (
              <option key={id} value={id}>
                {catalogue.profils.find((p) => p.id === id)?.nom ?? id}
              </option>
            ))}
          </select>
        </div>
      )}

      {prospects.length > 1 && (
        <div className="field">
          <label>{t('promotion.promotedProspect')}</label>
          <select value={prospectId} onChange={(e) => setProspectId(e.target.value)}>
            <option value="">{t('promotion.choose')}</option>
            {prospects.map((m) => (
              <option key={m.instance_id} value={m.instance_id}>
                {m.nom_perso} ({m.xp} XP)
              </option>
            ))}
          </select>
        </div>
      )}

      {profilVacant && prospect && (
        <>
          <p className="text-sm text-muted" style={{ marginBottom: '0.3rem' }}>
            {t('promotion.chooseTablesNote')}
          </p>
          <div className="skill-list">
            {SKILL_CATEGORIES.map((c) => (
              <label key={c.id} className="skill-check" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={categories.includes(c.id)}
                  onChange={() => toggleCategorie(c.id)}
                />
                <span className="skill-check__name">{c.label}</span>
              </label>
            ))}
          </div>
        </>
      )}

      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onClose}>
          {t('promotion.cancel')}
        </button>
        <button
          className="btn btn--primary"
          disabled={!profilVacant || !prospect || categories.length < 2}
          onClick={confirmer}
        >
          {t('promotion.confirm')}
        </button>
      </div>
    </Modal>
  );
}

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Member, AdvanceRecord } from '../../types/roster';
import type { Profile, SkillCategory, WarbandCatalog } from '../../types/catalog';
import { Modal } from '../common/Modal';
import { SKILLS, TABLE_AVANCEMENT, CARACTERISTIQUES_ALEATOIRES } from '../../data/gameData';
import { SKILL_CATEGORIES } from '../../types/catalog';

type Props = {
  member: Member;
  profil: Profile;
  catalogue: WarbandCatalog;
  onClose: () => void;
  onApply: (member: Member) => void;
};

type Etape = 'depart' | 'choix' | 'competence' | 'caracteristique' | 'resultat';

export function AvanceeModal({ member, profil, catalogue, onClose, onApply }: Props) {
  const [etape, setEtape] = useState<Etape>('depart');
  const [indexAvancement, setIndexAvancement] = useState('');
  const [texteResultat, setTexteResultat] = useState('');
  const [categorie, setCategorie] = useState<SkillCategory | ''>('');

  const categoriesAccessibles: SkillCategory[] =
    profil.acces_competences_a_verifier || profil.acces_competences.length === 0
      ? SKILL_CATEGORIES.map((c) => c.id)
      : profil.acces_competences;

  const entreeAvancement = indexAvancement !== '' ? TABLE_AVANCEMENT[Number(indexAvancement)] : null;

  const validerJetAvancement = () => {
    if (!entreeAvancement) return;
    if (entreeAvancement.type === 'caracteristique') setEtape('caracteristique');
    else if (entreeAvancement.type === 'competence') setEtape('competence');
    else setEtape('choix');
  };

  const appliquerCaracteristique = (indexCarac: number) => {
    const carac = CARACTERISTIQUES_ALEATOIRES[indexCarac];
    const record: AdvanceRecord = {
      id: uuidv4(),
      date: new Date().toISOString().slice(0, 10),
      xpAtRoll: member.xp,
      roll: carac.min,
      type: 'caracteristique',
      detail: `+${carac.delta} ${carac.stat}`,
    };
    const updated: Member = {
      ...member,
      stats_actuels: {
        ...member.stats_actuels,
        [carac.stat]: member.stats_actuels[carac.stat] + carac.delta,
      },
      historique_avancees: [...member.historique_avancees, record],
    };
    setTexteResultat(`Caractéristique augmentée : +${carac.delta} ${carac.stat}`);
    setEtape('resultat');
    onApply(updated);
  };

  const skillsDeLaCategorie = (cat: SkillCategory) =>
    cat === 'special' ? catalogue.competences_speciales : SKILLS[cat];

  const choisirCompetence = (skillId: string) => {
    const skill = [...Object.values(SKILLS).flat(), ...catalogue.competences_speciales].find(
      (s) => s.id === skillId
    );
    if (!skill) return;
    const record: AdvanceRecord = {
      id: uuidv4(),
      date: new Date().toISOString().slice(0, 10),
      xpAtRoll: member.xp,
      roll: entreeAvancement?.min ?? 0,
      type: 'competence',
      detail: skill.nom,
    };
    const updated: Member = {
      ...member,
      competences_acquises: [...member.competences_acquises, skillId],
      historique_avancees: [...member.historique_avancees, record],
    };
    setTexteResultat(`Nouvelle compétence : ${skill.nom}`);
    setEtape('resultat');
    onApply(updated);
  };

  return (
    <Modal onClose={onClose}>
      <h3>Avancée d'expérience — {member.nom_perso}</h3>

      {etape === 'depart' && (
        <>
          <p className="text-muted text-sm">
            Lance 2D6 sur ta table papier, puis choisis la ligne correspondante.
          </p>
          <div className="field">
            <label>Résultat du jet (2D6)</label>
            <select value={indexAvancement} onChange={(e) => setIndexAvancement(e.target.value)}>
              <option value="">— Choisir le résultat obtenu —</option>
              {TABLE_AVANCEMENT.map((entry, i) => (
                <option key={i} value={i}>
                  {entry.min === entry.max ? entry.min : `${entry.min}-${entry.max}`} — {entry.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={onClose}>
              Annuler
            </button>
            <button className="btn btn--primary" disabled={!entreeAvancement} onClick={validerJetAvancement}>
              Valider
            </button>
          </div>
        </>
      )}

      {etape === 'choix' && (
        <>
          <p>Résultat {entreeAvancement?.label} : choisis un type d'avancée.</p>
          <div className="flex gap-sm">
            <button className="btn" onClick={() => setEtape('competence')}>
              Nouvelle compétence
            </button>
            <button className="btn" onClick={() => setEtape('caracteristique')}>
              Caractéristique
            </button>
          </div>
        </>
      )}

      {etape === 'caracteristique' && (
        <>
          <p className="text-muted text-sm">Lance 1D10 sur ta table papier, puis choisis le résultat obtenu.</p>
          <div className="field">
            <label>Résultat du jet (1D10)</label>
            <select onChange={(e) => e.target.value !== '' && appliquerCaracteristique(Number(e.target.value))} defaultValue="">
              <option value="">— Choisir le résultat obtenu —</option>
              {CARACTERISTIQUES_ALEATOIRES.map((entry, i) => (
                <option key={i} value={i}>
                  {entry.min === entry.max ? entry.min : `${entry.min}-${entry.max}`} — {entry.stat} +{entry.delta}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {etape === 'competence' && (
        <>
          {entreeAvancement && <p className="text-sm text-muted">Résultat {entreeAvancement.label}.</p>}
          <div className="field">
            <label>Table de compétence</label>
            <select value={categorie} onChange={(e) => setCategorie(e.target.value as SkillCategory)}>
              <option value="">— Choisir —</option>
              {categoriesAccessibles.map((catId) => (
                <option key={catId} value={catId}>
                  {SKILL_CATEGORIES.find((c) => c.id === catId)?.label}
                </option>
              ))}
            </select>
          </div>
          {categorie && (
            <div className="skill-list">
              {skillsDeLaCategorie(categorie)
                .filter((s) => !member.competences_acquises.includes(s.id))
                .map((s) => (
                  <label key={s.id} className="skill-check" style={{ cursor: 'pointer' }}>
                    <input type="radio" name="competence" onChange={() => choisirCompetence(s.id)} />
                    <span>
                      <span className="skill-check__name">{s.nom}</span>
                      <br />
                      <span className="skill-check__text">{s.texte}</span>
                    </span>
                  </label>
                ))}
            </div>
          )}
        </>
      )}

      {etape === 'resultat' && (
        <>
          <p className="text-success">{texteResultat}</p>
          <button className="btn btn--primary btn--block" onClick={onClose}>
            Terminer
          </button>
        </>
      )}

      {etape !== 'resultat' && etape !== 'depart' && (
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={onClose}>
            Annuler
          </button>
        </div>
      )}
    </Modal>
  );
}

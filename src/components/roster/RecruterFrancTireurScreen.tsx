import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../common/Screen';
import { useRosters } from '../../state/RostersContext';
import { creerMembreFrancTireur } from '../../utils/factory';
import { SKILL_CATEGORIES } from '../../types/catalog';
import type { SkillCategory, Stats } from '../../types/catalog';
import type { ProfilFrancTireur } from '../../types/roster';

const STATS_PAR_DEFAUT: Stats = { M: 4, CC: 3, CT: 3, F: 3, E: 3, PV: 1, I: 3, A: 1, Cd: 7 };
const STAT_LABELS: (keyof Stats)[] = ['M', 'CC', 'CT', 'F', 'E', 'PV', 'I', 'A', 'Cd'];

export function RecruterFrancTireurScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRosterById, updateRoster } = useRosters();
  const roster = getRosterById(id ?? '');

  const [nom, setNom] = useState('');
  const [type, setType] = useState<'heros' | 'homme_de_main'>('heros');
  const [stats, setStats] = useState<Stats>({ ...STATS_PAR_DEFAUT });
  const [accesCompetences, setAccesCompetences] = useState<SkillCategory[]>([]);
  const [equipement, setEquipement] = useState('');
  const [cout, setCout] = useState(0);
  const [solde, setSolde] = useState(0);
  const [xpDepart, setXpDepart] = useState(0);

  if (!roster) {
    return (
      <Screen title="Bande introuvable" back="/">
        <p className="text-muted">Ce roster n'existe pas (ou plus).</p>
      </Screen>
    );
  }

  const budgetSuffisant = cout <= roster.tresorerie;
  const peutRecruter = nom.trim() !== '';

  const toggleCategorie = (cat: SkillCategory) => {
    setAccesCompetences((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const recruter = () => {
    if (!peutRecruter) return;
    const profilCustom: ProfilFrancTireur = {
      nom: nom.trim(),
      type,
      stats,
      acces_competences: accesCompetences,
      cout,
      solde,
    };
    const membre = creerMembreFrancTireur(profilCustom, xpDepart);
    membre.equipement = equipement;
    updateRoster({
      ...roster,
      tresorerie: roster.tresorerie - cout,
      membres: [...roster.membres, membre],
    });
    navigate(`/roster/${roster.id}`);
  };

  return (
    <Screen title="Franc-tireur" back={`/roster/${roster.id}`}>
      <div className="card">
        <p className="text-sm text-muted">
          Profil entièrement défini à la main, indépendant du catalogue de la bande — utile pour un mercenaire,
          un compagnon ou toute recrue hors liste habituelle.
        </p>
        <div className="field">
          <label>Nom du personnage</label>
          <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom du franc-tireur" />
        </div>
        <div className="field">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as 'heros' | 'homme_de_main')}>
            <option value="heros">Héros</option>
            <option value="homme_de_main">Homme de main</option>
          </select>
        </div>
        <div className="field">
          <label>Expérience de départ</label>
          <input type="number" value={xpDepart} onChange={(e) => setXpDepart(Number(e.target.value) || 0)} />
          <p className="text-sm text-muted mb-0">Ne déclenche aucune avancée due.</p>
        </div>
      </div>

      <div className="card">
        <h3>Caractéristiques</h3>
        <div className="stat-grid">
          {STAT_LABELS.map((k) => (
            <div key={k} className="stat-grid__cell stat-grid__cell--label">
              {k}
            </div>
          ))}
          {STAT_LABELS.map((k) => (
            <div key={k} className="stat-grid__cell stat-grid__cell--value">
              <input
                type="number"
                className="stat-grid__input"
                value={stats[k]}
                onChange={(e) => setStats((prev) => ({ ...prev, [k]: Number(e.target.value) || 0 }))}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Accès aux tables de compétences</h3>
        <div className="skill-list">
          {SKILL_CATEGORIES.map((c) => (
            <label key={c.id} className="skill-check" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={accesCompetences.includes(c.id)}
                onChange={() => toggleCategorie(c.id)}
              />
              <span className="skill-check__name">{c.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Équipement</h3>
        <textarea
          value={equipement}
          onChange={(e) => setEquipement(e.target.value)}
          placeholder="Épée, armure légère, pistolet…"
          style={{
            width: '100%',
            background: 'var(--bg-inset)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '0.5rem 0.6rem',
            minHeight: '4em',
          }}
        />
      </div>

      <div className="card">
        <h3>Prix</h3>
        <div className="field-row">
          <div className="field">
            <label>Prix d'engagement (po)</label>
            <input type="number" value={cout} onChange={(e) => setCout(Number(e.target.value) || 0)} />
          </div>
          <div className="field">
            <label>Solde après chaque bataille (po)</label>
            <input type="number" value={solde} onChange={(e) => setSolde(Number(e.target.value) || 0)} />
          </div>
        </div>
        <p className={budgetSuffisant ? 'text-sm text-muted' : 'text-sm text-danger'}>
          Le prix d'engagement ({cout} po) sera déduit immédiatement de la trésorerie ({roster.tresorerie} po
          disponibles{!budgetSuffisant ? ' — insuffisant' : ''}). La solde ({solde} po) sera à payer après
          chaque bataille via l'assistant post-bataille.
        </p>
      </div>

      <div className="flex gap-sm">
        <button className="btn" onClick={() => navigate(`/roster/${roster.id}`)}>
          Annuler
        </button>
        <button className="btn btn--primary" disabled={!peutRecruter} onClick={recruter}>
          Engager{!budgetSuffisant ? ' quand même' : ''}
        </button>
      </div>
    </Screen>
  );
}

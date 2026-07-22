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
  // Saisies gardées en texte brut : un input contrôlé par un number forcerait
  // la valeur dès l'effacement (impossible de vider le champ pour retaper un
  // chiffre) — la conversion/le plancher ne s'appliquent qu'à l'usage.
  const [statsSaisies, setStatsSaisies] = useState<Record<keyof Stats, string>>(
    Object.fromEntries(STAT_LABELS.map((k) => [k, String(STATS_PAR_DEFAUT[k])])) as Record<keyof Stats, string>
  );
  const [accesCompetences, setAccesCompetences] = useState<SkillCategory[]>([]);
  const [equipement, setEquipement] = useState('');
  const [coutSaisi, setCoutSaisi] = useState('0');
  const [soldeSaisi, setSoldeSaisi] = useState('0');
  const [xpDepartSaisie, setXpDepartSaisie] = useState('0');
  const [grandeCible, setGrandeCible] = useState(false);
  const [quantiteSaisie, setQuantiteSaisie] = useState('1');
  const [confirmationXp0, setConfirmationXp0] = useState(false);

  if (!roster) {
    return (
      <Screen title="Bande introuvable" back="/">
        <p className="text-muted">Ce roster n'existe pas (ou plus).</p>
      </Screen>
    );
  }

  const stats = Object.fromEntries(STAT_LABELS.map((k) => [k, Number(statsSaisies[k]) || 0])) as Stats;
  const cout = Number(coutSaisi) || 0;
  const solde = Number(soldeSaisi) || 0;
  const xpDepart = Number(xpDepartSaisie) || 0;
  const quantite = Math.max(1, parseInt(quantiteSaisie, 10) || 1);
  const estGroupable = type === 'homme_de_main';
  const coutTotal = cout * (estGroupable ? quantite : 1);
  const budgetSuffisant = coutTotal <= roster.tresorerie;
  const peutRecruter = nom.trim() !== '';

  const toggleCategorie = (cat: SkillCategory) => {
    setAccesCompetences((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const changerXpDepart = (value: string) => {
    setXpDepartSaisie(value);
    setConfirmationXp0(false);
  };

  const recruter = () => {
    if (!peutRecruter) return;
    if (xpDepart === 0 && !confirmationXp0) {
      setConfirmationXp0(true);
      return;
    }
    const profilCustom: ProfilFrancTireur = {
      nom: nom.trim(),
      type,
      stats,
      acces_competences: accesCompetences,
      cout,
      solde,
    };
    const membre = creerMembreFrancTireur(profilCustom, xpDepart, estGroupable ? quantite : 1);
    membre.equipement = equipement;
    membre.grande_cible = grandeCible;
    updateRoster({
      ...roster,
      tresorerie: roster.tresorerie - coutTotal,
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
          <select
            value={type}
            onChange={(e) => {
              const v = e.target.value as 'heros' | 'homme_de_main';
              setType(v);
              if (v === 'heros') setQuantiteSaisie('1');
            }}
          >
            <option value="heros">Héros</option>
            <option value="homme_de_main">Homme de main</option>
          </select>
        </div>
        {estGroupable && (
          <div className="field">
            <label>Nombre de figurines (groupe identique)</label>
            <input type="number" min={1} value={quantiteSaisie} onChange={(e) => setQuantiteSaisie(e.target.value)} />
          </div>
        )}
        <div className="field">
          <label>Expérience de départ</label>
          <input type="number" value={xpDepartSaisie} onChange={(e) => changerXpDepart(e.target.value)} />
          <p className="text-sm text-muted mb-0">Ne déclenche aucune avancée due.</p>
        </div>
        {confirmationXp0 && (
          <p className="text-danger text-sm">
            Es-tu sûr de vouloir commencer à 0 XP ? Clique à nouveau sur "Engager" pour confirmer.
          </p>
        )}
        <label className="flex items-center gap-sm" style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={grandeCible} onChange={(e) => setGrandeCible(e.target.checked)} />
          <span>
            <strong>Grande Cible</strong>
            <br />
            <span className="text-sm text-muted">
              Grosse figurine (troll, ogre…) — ajoute +20 au rating. Modifiable ensuite sur la fiche.
            </span>
          </span>
        </label>
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
                value={statsSaisies[k]}
                onChange={(e) => setStatsSaisies((prev) => ({ ...prev, [k]: e.target.value }))}
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
            <label>Prix d'engagement (po{estGroupable && quantite > 1 ? ' / figurine' : ''})</label>
            <input type="number" value={coutSaisi} onChange={(e) => setCoutSaisi(e.target.value)} />
          </div>
          <div className="field">
            <label>Solde après chaque bataille (po{estGroupable && quantite > 1 ? ' / figurine' : ''})</label>
            <input type="number" value={soldeSaisi} onChange={(e) => setSoldeSaisi(e.target.value)} />
          </div>
        </div>
        <p className={budgetSuffisant ? 'text-sm text-muted' : 'text-sm text-danger'}>
          Le prix d'engagement total ({coutTotal} po) sera déduit immédiatement de la trésorerie ({roster.tresorerie}{' '}
          po disponibles{!budgetSuffisant ? ' — insuffisant' : ''}). La solde sera à payer après chaque bataille via
          l'assistant post-bataille.
        </p>
      </div>

      <div className="flex gap-sm">
        <button className="btn" onClick={() => navigate(`/roster/${roster.id}`)}>
          Annuler
        </button>
        <button className="btn btn--primary" disabled={!peutRecruter} onClick={recruter}>
          {confirmationXp0 ? 'Confirmer 0 XP et engager' : `Engager${!budgetSuffisant ? ' quand même' : ''}`}
        </button>
      </div>
    </Screen>
  );
}

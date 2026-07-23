import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Member, AdvanceRecord } from '../../types/roster';
import type { Profile, SkillCategory, WarbandCatalog } from '../../types/catalog';
import { Modal } from '../common/Modal';
import { SKILLS, TABLE_AVANCEMENT_HEROS, TABLE_AVANCEMENT_HOMMES_DE_MAIN } from '../../data/gameData';
import { SKILL_CATEGORIES, STAT_KEYS } from '../../types/catalog';
import { LIMITE_HEROS, categoriesAccessibles } from '../../utils/profil';
import { peutAugmenterStat } from '../../utils/plafond';

type Props = {
  member: Member;
  profil: Profile;
  catalogue: WarbandCatalog;
  // Nombre de héros déjà présents dans la bande (figurine en cours d'avancée
  // exclue) — sert à bloquer "Ce gars est doué" une fois la limite de 6
  // héros atteinte.
  heroCount: number;
  onClose: () => void;
  // `nouveauMembre` n'est fourni que lorsqu'une promotion détache une
  // figurine d'un groupe de plus d'un homme de main (voir confirmerPromotion).
  onApply: (member: Member, nouveauMembre?: Member) => void;
};

type Etape = 'depart' | 'choix_carac' | 'competence' | 'promotion_categories' | 'resultat';

export function AvanceeModal({ member, profil, catalogue, heroCount, onClose, onApply }: Props) {
  const limiteHerosAtteinte = heroCount >= LIMITE_HEROS;
  // État local de travail : on accumule les mutations ici plutôt que de se
  // fier à la prop `member` (qui ne se met à jour qu'au prochain rendu du
  // parent) — indispensable pour la promotion, qui enchaîne deux mises à
  // jour (promotion puis jet héros immédiat) dans la même session de modale.
  const [travail, setTravail] = useState(member);
  // Devient 'heros' dès qu'une promotion est confirmée, pour basculer sur la
  // table héros immédiatement sans attendre le re-rendu du parent.
  const [tableForcee, setTableForcee] = useState<'heros' | null>(null);

  const [etape, setEtape] = useState<Etape>('depart');
  const [indexAvancement, setIndexAvancement] = useState('');
  const [texteResultat, setTexteResultat] = useState('');
  const [categorie, setCategorie] = useState<SkillCategory | ''>('');
  const [categoriesPromotion, setCategoriesPromotion] = useState<SkillCategory[]>([]);
  // Groupe restant après extraction d'une figurine promue (taille_groupe > 1
  // au moment de la promotion) : en attente de sa propre avancée, résolue
  // juste après celle du nouveau héros dans la même session de modale.
  const [groupeRestantEnAttente, setGroupeRestantEnAttente] = useState<Member | null>(null);
  // true une fois qu'on a basculé sur la résolution de l'avancée du groupe
  // restant (après celle du nouveau héros) — pilote le message affiché.
  const [resolutionGroupeRestant, setResolutionGroupeRestant] = useState(false);

  const typeEffectif = tableForcee ?? profil.type;
  const table = typeEffectif === 'heros' ? TABLE_AVANCEMENT_HEROS : TABLE_AVANCEMENT_HOMMES_DE_MAIN;

  const categoriesDisponibles: SkillCategory[] = categoriesAccessibles(profil);

  const entreeAvancement = indexAvancement !== '' ? table[Number(indexAvancement)] : null;

  const verdictStat = (stat: keyof Member['stats_actuels']) =>
    peutAugmenterStat(profil, travail.stats_actuels, travail.historique_avancees, stat);

  const verdictFixe =
    entreeAvancement?.type === 'caracteristique_fixe' ? verdictStat(entreeAvancement.stat) : null;

  const appliquer = (partial: Partial<Member>, record: AdvanceRecord, resume: string) => {
    const updated: Member = { ...travail, ...partial, historique_avancees: [...travail.historique_avancees, record] };
    setTravail(updated);
    onApply(updated);
    setTexteResultat(resume);
    setEtape('resultat');
  };

  const validerJetAvancement = () => {
    if (!entreeAvancement) return;
    if (entreeAvancement.type === 'caracteristique_fixe') {
      const { stat, label } = entreeAvancement;
      // Défense en profondeur : le bouton Valider est déjà désactivé dans ce cas.
      if (!verdictStat(stat).ok) return;
      appliquer(
        { stats_actuels: { ...travail.stats_actuels, [stat]: travail.stats_actuels[stat] + 1 } },
        {
          id: uuidv4(),
          date: new Date().toISOString().slice(0, 10),
          xpAtRoll: travail.xp,
          roll: entreeAvancement.min,
          type: 'caracteristique',
          detail: label,
          stat,
        },
        `Caractéristique augmentée : ${label}`
      );
    } else if (entreeAvancement.type === 'caracteristique_choix') {
      setEtape('choix_carac');
    } else if (entreeAvancement.type === 'competence') {
      setEtape('competence');
    } else if (limiteHerosAtteinte) {
      // Défense en profondeur : l'option est déjà désactivée dans le select.
      return;
    } else {
      setEtape('promotion_categories');
    }
  };

  const choisirCaracteristique = (stat: keyof Member['stats_actuels'], label: string) => {
    // Défense en profondeur : les boutons capés sont déjà désactivés.
    if (!verdictStat(stat).ok) return;
    appliquer(
      { stats_actuels: { ...travail.stats_actuels, [stat]: travail.stats_actuels[stat] + 1 } },
      {
        id: uuidv4(),
        date: new Date().toISOString().slice(0, 10),
        xpAtRoll: travail.xp,
        roll: entreeAvancement?.min ?? 0,
        type: 'caracteristique',
        detail: `+1 ${label}`,
        stat,
      },
      `Caractéristique augmentée : +1 ${label}`
    );
  };

  const skillsDeLaCategorie = (cat: SkillCategory) =>
    cat === 'special' ? catalogue.competences_speciales : SKILLS[cat];

  const choisirCompetence = (skillId: string) => {
    const skill = [...Object.values(SKILLS).flat(), ...catalogue.competences_speciales].find(
      (s) => s.id === skillId
    );
    if (!skill) return;
    appliquer(
      { competences_acquises: [...travail.competences_acquises, skillId] },
      {
        id: uuidv4(),
        date: new Date().toISOString().slice(0, 10),
        xpAtRoll: travail.xp,
        roll: entreeAvancement?.min ?? 0,
        type: 'competence',
        detail: skill.nom,
      },
      `Nouvelle compétence : ${skill.nom}`
    );
  };

  const toggleCategoriePromotion = (cat: SkillCategory) => {
    setCategoriesPromotion((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const confirmerPromotion = () => {
    const tablesLabel = categoriesPromotion.map((c) => SKILL_CATEGORIES.find((sc) => sc.id === c)?.label).join(', ');
    const record: AdvanceRecord = {
      id: uuidv4(),
      date: new Date().toISOString().slice(0, 10),
      xpAtRoll: travail.xp,
      roll: entreeAvancement?.min ?? 0,
      type: 'promotion',
      detail: `Promu héros — tables : ${tablesLabel}`,
    };

    const tailleGroupeActuelle = travail.taille_groupe || 1;
    let travailSuivant: Member;

    if (tailleGroupeActuelle > 1) {
      // Une seule figurine du groupe devient héros ; le reste du groupe
      // continue avec son XP et son profil, réduit d'une figurine — et doit
      // encore résoudre sa propre avancée (l'XP due n'est pas consommée par
      // la promotion, qui ne profite qu'à la figurine extraite).
      const nouveauHeros: Member = {
        ...travail,
        instance_id: uuidv4(),
        taille_groupe: 1,
        promu_heros: true,
        acces_competences_override: categoriesPromotion,
        historique_avancees: [...travail.historique_avancees, record],
      };
      const groupeRestant: Member = {
        ...travail,
        taille_groupe: tailleGroupeActuelle - 1,
      };
      onApply(groupeRestant, nouveauHeros);
      setGroupeRestantEnAttente(groupeRestant);
      travailSuivant = nouveauHeros;
    } else {
      const updated: Member = {
        ...travail,
        promu_heros: true,
        acces_competences_override: categoriesPromotion,
        historique_avancees: [...travail.historique_avancees, record],
      };
      onApply(updated);
      travailSuivant = updated;
    }

    setTravail(travailSuivant);
    setTableForcee('heros');
    setIndexAvancement('');
    setCategorie('');
    setCategoriesPromotion([]);
    setEtape('depart');
  };

  // Enchaîne sur la résolution de l'avancée du groupe restant, une fois
  // celle du nouveau héros terminée (voir étape 'resultat').
  const poursuivreAvecGroupeRestant = () => {
    if (!groupeRestantEnAttente) return;
    setTravail(groupeRestantEnAttente);
    setGroupeRestantEnAttente(null);
    setResolutionGroupeRestant(true);
    setTableForcee(null);
    setIndexAvancement('');
    setTexteResultat('');
    setCategorie('');
    setCategoriesPromotion([]);
    setEtape('depart');
  };

  return (
    <Modal onClose={onClose}>
      <h3>Avancée d'expérience — {travail.nom_perso}</h3>

      {etape === 'depart' && (
        <>
          {tableForcee === 'heros' && profil.type !== 'heros' && (
            <p className="text-success text-sm">
              Promu héros ! Jet immédiat sur la table de progression des héros.
            </p>
          )}
          {resolutionGroupeRestant && !tableForcee && (
            <p className="text-success text-sm">
              Avancée du groupe restant ({travail.taille_groupe} figurine{travail.taille_groupe > 1 ? 's' : ''}).
            </p>
          )}
          <p className="text-muted text-sm">
            Lance 2D6 sur ta table papier, puis choisis la ligne correspondante.
          </p>
          <div className="field">
            <label>Résultat du jet (2D6)</label>
            <select value={indexAvancement} onChange={(e) => setIndexAvancement(e.target.value)}>
              <option value="">— Choisir le résultat obtenu —</option>
              {table.map((entry, i) => {
                const bloquee = entry.type === 'promotion' && limiteHerosAtteinte;
                return (
                  <option key={i} value={i} disabled={bloquee}>
                    {entry.min === entry.max ? entry.min : `${entry.min}-${entry.max}`} — {entry.label}
                    {bloquee ? ' (indisponible — 6 héros déjà atteints)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
          {limiteHerosAtteinte && table.some((e) => e.type === 'promotion') && (
            <p className="text-sm text-muted">
              La bande compte déjà {LIMITE_HEROS} héros (maximum autorisé) : « Ce gars est doué » ne peut pas
              promouvoir ce membre pour l'instant.
            </p>
          )}
          {verdictFixe && !verdictFixe.ok && (
            <p className="text-sm text-danger">
              Impossible d'appliquer ce résultat : {verdictFixe.raison} Relance sur ta table papier pour obtenir un
              autre résultat.
            </p>
          )}
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={onClose}>
              Annuler
            </button>
            <button
              className="btn btn--primary"
              disabled={!entreeAvancement || (!!verdictFixe && !verdictFixe.ok)}
              onClick={validerJetAvancement}
            >
              Valider
            </button>
          </div>
        </>
      )}

      {etape === 'choix_carac' &&
        entreeAvancement?.type === 'caracteristique_choix' &&
        (() => {
          const options = entreeAvancement.options.map((o) => ({ ...o, verdict: verdictStat(o.stat) }));
          const toutesBloquees = options.every((o) => !o.verdict.ok);
          const autresDisponibles = toutesBloquees
            ? STAT_KEYS.filter((k) => verdictStat(k).ok)
            : [];
          return (
            <>
              <p className="text-sm text-muted">Choisis laquelle des deux caractéristiques augmenter.</p>
              <div className="flex gap-sm">
                {options.map((o) => (
                  <button
                    key={o.stat}
                    className="btn"
                    disabled={!o.verdict.ok}
                    title={o.verdict.ok ? undefined : o.verdict.raison}
                    onClick={() => choisirCaracteristique(o.stat, o.label)}
                  >
                    +1 {o.label}
                  </button>
                ))}
              </div>
              {toutesBloquees && (
                <>
                  <p className="text-sm text-danger" style={{ marginTop: '0.75rem' }}>
                    Les deux caractéristiques proposées sont déjà au maximum. Augmente n'importe quelle autre
                    caractéristique disponible de +1 à la place.
                  </p>
                  {autresDisponibles.length > 0 ? (
                    <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                      {autresDisponibles.map((k) => (
                        <button key={k} className="btn" onClick={() => choisirCaracteristique(k, k)}>
                          +1 {k}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted">
                      Toutes les caractéristiques de ce profil sont déjà au plafond racial.
                    </p>
                  )}
                </>
              )}
            </>
          );
        })()}

      {etape === 'promotion_categories' && (
        <>
          <p className="text-sm">
            <strong>Ce gars est doué !</strong>{' '}
            {(travail.taille_groupe || 1) > 1
              ? `Une figurine du groupe devient héros (le groupe continue avec ${
                  (travail.taille_groupe || 1) - 1
                } figurine(s)) : elle conserve le profil et l'expérience du groupe, mais accède désormais à la grille XP et à la table d'avancement des héros.`
              : "Ce membre devient un héros : il conserve son profil et son expérience, mais accède désormais à la grille XP et à la table d'avancement des héros."}
          </p>
          <p className="text-sm text-muted">
            Choisis au moins 2 tables de compétences accessibles à ce nouveau héros.
          </p>
          <div className="skill-list">
            {SKILL_CATEGORIES.map((c) => (
              <label key={c.id} className="skill-check" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={categoriesPromotion.includes(c.id)}
                  onChange={() => toggleCategoriePromotion(c.id)}
                />
                <span className="skill-check__name">{c.label}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={onClose}>
              Annuler
            </button>
            <button
              className="btn btn--primary"
              disabled={categoriesPromotion.length < 2}
              onClick={confirmerPromotion}
            >
              Confirmer la promotion et lancer sur la table héros
            </button>
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
              {categoriesDisponibles.map((catId) => (
                <option key={catId} value={catId}>
                  {SKILL_CATEGORIES.find((c) => c.id === catId)?.label}
                </option>
              ))}
            </select>
          </div>
          {categorie && (
            <div className="skill-list">
              {skillsDeLaCategorie(categorie)
                .filter((s) => !travail.competences_acquises.includes(s.id))
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
          {groupeRestantEnAttente ? (
            <button className="btn btn--primary btn--block" onClick={poursuivreAvecGroupeRestant}>
              Continuer — avancée du groupe restant ({groupeRestantEnAttente.taille_groupe} figurine
              {groupeRestantEnAttente.taille_groupe > 1 ? 's' : ''})
            </button>
          ) : (
            <button className="btn btn--primary btn--block" onClick={onClose}>
              Terminer
            </button>
          )}
        </>
      )}

      {etape !== 'resultat' && etape !== 'depart' && etape !== 'promotion_categories' && (
        <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={onClose}>
            Annuler
          </button>
        </div>
      )}
    </Modal>
  );
}

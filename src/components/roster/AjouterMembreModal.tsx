import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RosterInstance } from '../../types/roster';
import { getCatalogue } from '../../data/warbands';
import { peutAjouterMembre } from '../../utils/validation';
import { creerMembre } from '../../utils/factory';
import { calculerCoutRejoindreGroupe, formatCoutProfil, rejoindreGroupe, TRINKETS_LIMITES } from '../../utils/shop';
import { estSorcier, sortsDisponibles } from '../../utils/magie';
import { equitationGratuitePourTribu, SKILL_EQUITATION } from '../../utils/tribu';
import { Modal } from '../common/Modal';
import { useGameRules } from '../../state/useGameRules';

const FRANC_TIREUR = '__franc_tireur__';

type Props = {
  roster: RosterInstance;
  onClose: () => void;
  onConfirm: (roster: RosterInstance) => void;
};

export function AjouterMembreModal({ roster, onClose, onConfirm }: Props) {
  const navigate = useNavigate();
  const { rules } = useGameRules();
  const catalogue = getCatalogue(roster.bande_id);
  const [profilId, setProfilId] = useState('');
  const [nomPerso, setNomPerso] = useState('');
  // Saisies gardées en texte brut (pas en number) : un input contrôlé par un
  // number forcerait la valeur dès l'effacement (impossible de vider le
  // champ pour retaper un chiffre) — la conversion/le plancher ne s'applique
  // qu'à l'usage (voir xpDepart/quantite ci-dessous).
  const [xpDepartSaisie, setXpDepartSaisie] = useState('0');
  const [quantiteSaisie, setQuantiteSaisie] = useState('1');
  const [groupeCibleId, setGroupeCibleId] = useState<string | null>(null);
  // Coût saisi à la main quand le profil n'a pas de prix fixe (ex : chien de
  // guerre, "25+2D6") — jet à faire sur table papier, comme pour un objet.
  const [coutManuelSaisi, setCoutManuelSaisi] = useState('');
  // Premier sort connu, obligatoire au recrutement d'un profil sorcier.
  const [sortChoisi, setSortChoisi] = useState('');
  // Marque choisie au recrutement pour les profils à `marque_requise` (ex :
  // le Devin des Maraudeurs du Chaos) — détermine le domaine de sorts
  // proposé ensuite (voir utils/magie.ts).
  const [marqueChoisie, setMarqueChoisie] = useState('');

  const profilsHeros = catalogue?.profils.filter((p) => p.type === 'heros') ?? [];
  const profilsHommesDeMain = catalogue?.profils.filter((p) => p.type === 'homme_de_main') ?? [];
  const profilsAutres = catalogue?.profils.filter((p) => p.type === 'animal') ?? [];

  const profil = catalogue?.profils.find((p) => p.id === profilId);
  const estGroupable = profil?.type === 'homme_de_main' || profil?.type === 'animal';
  const marqueRequise = !!profil?.marque_requise;
  const marqueChoisieValide = !marqueRequise || marqueChoisie !== '';
  const estSorcierProfil = !!profil && estSorcier(catalogue, profil.id, marqueChoisie || undefined);
  const sortsPossibles = sortsDisponibles(catalogue, [], profil, marqueChoisie || undefined);
  const xpDepart = Number(xpDepartSaisie) || 0;
  const quantite = Math.max(1, parseInt(quantiteSaisie, 10) || 1);
  const coutManuelRequis = !!profil && profil.cout === null;
  const coutManuelValide =
    !coutManuelRequis || (coutManuelSaisi.trim() !== '' && !Number.isNaN(Number(coutManuelSaisi)) && Number(coutManuelSaisi) >= 0);

  // Groupes déjà existants pour ce profil (hors morts) : recruter peut soit
  // former un nouveau groupe, soit rejoindre l'un d'eux (au prix d'une
  // surtaxe liée à l'XP déjà acquise par le groupe — voir plus bas).
  const groupesExistants = estGroupable
    ? roster.membres.filter((m) => m.profil_id === profilId && m.statut !== 'mort' && !m.promu_heros)
    : [];
  const groupeCible = groupeCibleId ? (groupesExistants.find((m) => m.instance_id === groupeCibleId) ?? null) : null;
  // Le choix de la Marque (s'il y en a un) doit être fait avant de proposer
  // un premier sort : le domaine de sorts en dépend, et certaines Marques
  // (ex : Arkhar) retirent tout accès aux sorts.
  const premierSortRequis = estSorcierProfil && !groupeCible && marqueChoisieValide;

  const check = profilId ? peutAjouterMembre(roster, profilId, quantite) : { ok: false };
  const coutUnitaire = profil?.cout ?? (coutManuelRequis ? Number(coutManuelSaisi) || 0 : 0);
  const coutRejoindre = groupeCible ? calculerCoutRejoindreGroupe(groupeCible, coutUnitaire, quantite) : null;
  const coutTotal = coutRejoindre ? coutRejoindre.coutTotal : coutUnitaire * quantite;
  const budgetSuffisant = coutTotal <= roster.tresorerie;
  const dupliqueraitTrinket =
    !!groupeCible &&
    rules.trinketsLimites &&
    groupeCible.inventaire.some((entree) => TRINKETS_LIMITES.has(entree.item_id));

  const choisirProfil = (value: string) => {
    if (value === FRANC_TIREUR) {
      onClose();
      navigate(`/roster/${roster.id}/recruter-franc-tireur`);
      return;
    }
    setProfilId(value);
    const p = catalogue?.profils.find((pr) => pr.id === value);
    setXpDepartSaisie(String(p?.xp_depart ?? 0));
    setQuantiteSaisie('1');
    setGroupeCibleId(null);
    setCoutManuelSaisi('');
    setSortChoisi('');
    setMarqueChoisie('');
  };

  const confirmer = () => {
    if (!profil || !check.ok || !coutManuelValide || dupliqueraitTrinket) return;
    if (marqueRequise && !marqueChoisie) return;
    if (premierSortRequis && !sortChoisi) return;

    if (groupeCible) {
      // Rejoint un groupe existant : la figurine hérite immédiatement de
      // l'XP et de l'équipement du groupe (payé séparément ci-dessus), pas
      // d'XP de départ propre.
      onConfirm(rejoindreGroupe(roster, groupeCible, quantite, coutTotal));
      return;
    }

    const membre = creerMembre(profil, xpDepart, quantite);
    if (nomPerso.trim()) membre.nom_perso = nomPerso.trim();
    if (marqueRequise && marqueChoisie) membre.marque = marqueChoisie;
    if (premierSortRequis && sortChoisi) membre.sorts_connus = [sortChoisi];
    if (profil.type === 'heros' && equitationGratuitePourTribu(catalogue, roster)) {
      membre.competences_acquises = [...membre.competences_acquises, SKILL_EQUITATION];
    }
    onConfirm({
      ...roster,
      tresorerie: roster.tresorerie - coutTotal,
      membres: [...roster.membres, membre],
    });
  };

  return (
    <Modal onClose={onClose}>
      <h3>Recruter un nouveau membre</h3>
      <div className="field">
        <label>Profil</label>
        <select value={profilId} onChange={(e) => choisirProfil(e.target.value)}>
          <option value="">— Choisir —</option>
          {profilsHeros.length > 0 && (
            <optgroup label="Héros">
              {profilsHeros.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom} ({formatCoutProfil(p.cout, p.cout_notation)})
                </option>
              ))}
            </optgroup>
          )}
          {profilsHommesDeMain.length > 0 && (
            <optgroup label="Hommes de main">
              {profilsHommesDeMain.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom} ({formatCoutProfil(p.cout, p.cout_notation)})
                </option>
              ))}
            </optgroup>
          )}
          <optgroup label="Autres">
            {profilsAutres.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom} ({p.cout != null ? `${p.cout} po` : p.cout_notation ? `${p.cout_notation} po` : 'coût ?'})
              </option>
            ))}
            <option value={FRANC_TIREUR}>Franc-tireur…</option>
          </optgroup>
        </select>
      </div>
      {profil && (
        <>
          {profil.rarete && (
            <p className="text-sm text-danger">
              Rare {profil.rarete} : un jet de disponibilité est requis sur table papier avant de pouvoir recruter ce
              profil. Purement indicatif — n'empêche pas de recruter.
            </p>
          )}
          {coutManuelRequis && (
            <div className="field">
              <label>
                Coût (po){' '}
                {profil.cout_notation && <span className="text-muted">— notation : {profil.cout_notation}</span>}
              </label>
              <input
                type="number"
                min={0}
                value={coutManuelSaisi}
                onChange={(e) => setCoutManuelSaisi(e.target.value)}
                placeholder={profil.cout_notation ? `Résultat du jet, ex : 32` : undefined}
              />
            </div>
          )}
          {groupesExistants.length > 0 && (
            <div className="field">
              <label>Groupe</label>
              <select
                value={groupeCibleId ?? ''}
                onChange={(e) => {
                  setGroupeCibleId(e.target.value || null);
                  setQuantiteSaisie('1');
                }}
              >
                <option value="">Nouveau groupe</option>
                {groupesExistants.map((g) => (
                  <option key={g.instance_id} value={g.instance_id}>
                    Rejoindre « {g.nom_perso} » (×{g.taille_groupe}, {g.xp} XP)
                  </option>
                ))}
              </select>
            </div>
          )}
          {!groupeCible && (
            <div className="field">
              <label>Nom du personnage{estGroupable && quantite > 1 ? ' (groupe)' : ''}</label>
              <input value={nomPerso} onChange={(e) => setNomPerso(e.target.value)} placeholder={profil.nom} />
            </div>
          )}
          {marqueRequise && !groupeCible && (
            <div className="field">
              <label>Marque des Dieux Sombres</label>
              <select value={marqueChoisie} onChange={(e) => setMarqueChoisie(e.target.value)}>
                <option value="">— Choisir —</option>
                {catalogue?.marques?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nom}
                  </option>
                ))}
              </select>
              {marqueChoisie && catalogue?.marques?.find((m) => m.id === marqueChoisie)?.texte && (
                <p className="text-sm text-muted mb-0">
                  {catalogue.marques.find((m) => m.id === marqueChoisie)?.texte}
                </p>
              )}
            </div>
          )}
          {premierSortRequis && (
            <div className="field">
              <label>Premier sort connu</label>
              <select value={sortChoisi} onChange={(e) => setSortChoisi(e.target.value)}>
                <option value="">— Choisir —</option>
                {sortsPossibles.map((s) => (
                  <option key={s.nom} value={s.nom}>
                    {s.resultat} — {s.nom}
                  </option>
                ))}
              </select>
              <p className="text-sm text-muted mb-0">Obligatoire pour un profil sorcier.</p>
            </div>
          )}
          {marqueChoisieValide && !estSorcierProfil && marqueRequise && !groupeCible && (
            <p className="text-sm text-muted">
              Cette Marque retire tout accès aux sorts (voir son détail ci-dessus).
            </p>
          )}
          {(estGroupable || groupeCible) && (
            <div className="field">
              <label>Nombre de figurines {groupeCible ? 'rejoignant le groupe' : '(groupe identique)'}</label>
              <input
                type="number"
                min={1}
                value={quantiteSaisie}
                onChange={(e) => setQuantiteSaisie(e.target.value)}
              />
            </div>
          )}
          {groupeCible && coutRejoindre ? (
            <div className="card card--tight" style={{ margin: '0.6rem 0' }}>
              <p className="text-sm mb-0">
                <strong>Recrutement dans un groupe expérimenté</strong>
              </p>
              <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
                Le groupe a {coutRejoindre.xpGroupe} XP : chaque nouvelle figurine coûte +{coutRejoindre.surtaxeXpUnitaire}{' '}
                po (2 × XP du groupe) en plus du prix normal, et doit être équipée à l'identique du reste du groupe.
              </p>
              {groupeCible.inventaire.length > 0 && (
                <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
                  Équipement forcé : {[...new Set(groupeCible.inventaire.map((e) => e.nom))].join(', ')} (
                  {coutRejoindre.coutEquipementForce} po au total pour {quantite} figurine{quantite > 1 ? 's' : ''}).
                </p>
              )}
              <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
                Coût indicatif en points vétéran : {coutRejoindre.vetPointsIndicatifs} (non contrôlé — libre à toi de
                recruter même sans les points suffisants).
              </p>
              {dupliqueraitTrinket && (
                <p className="text-danger text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                  Recrutement bloqué : l'équipement du groupe contient un objet limité à un exemplaire par bande et
                  serait automatiquement dupliqué.
                </p>
              )}
            </div>
          ) : (
            <div className="field">
              <label>Expérience de départ</label>
              <input type="number" value={xpDepartSaisie} onChange={(e) => setXpDepartSaisie(e.target.value)} />
              <p className="text-sm text-muted mb-0">Ne déclenche aucune avancée due.</p>
            </div>
          )}
        </>
      )}
      {profilId && !check.ok && <p className="text-danger text-sm">{check.raison}</p>}
      {profil && !budgetSuffisant && (
        <p className="text-danger text-sm">
          Trésorerie insuffisante ({roster.tresorerie} po disponibles, {coutTotal} po requis).
        </p>
      )}
      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onClose}>
          Annuler
        </button>
        <button
          className="btn btn--primary"
          disabled={
            !profil ||
            !check.ok ||
            !coutManuelValide ||
            dupliqueraitTrinket ||
            (marqueRequise && !groupeCible && !marqueChoisie) ||
            (premierSortRequis && !sortChoisi)
          }
          onClick={confirmer}
        >
          Recruter pour {coutTotal} po{profil && !budgetSuffisant ? ' quand même' : ''}
        </button>
      </div>
    </Modal>
  );
}

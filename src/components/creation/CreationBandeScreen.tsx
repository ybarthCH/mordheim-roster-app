import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../common/Screen';
import { Modal } from '../common/Modal';
import { CATALOGUES } from '../../data/warbands';
import type { Profile, WarbandCatalog } from '../../types/catalog';
import { STAT_KEYS } from '../../types/catalog';
import type { Member, RosterInstance } from '../../types/roster';
import { creerMembre, creerRoster } from '../../utils/factory';
import { peutAjouterMembre } from '../../utils/validation';
import { estSorcier, sortsDisponiblesPourRoster } from '../../utils/magie';
import { useRosters } from '../../state/useRosters';

const BUDGET_PAR_DEFAUT = 500;

export function CreationBandeScreen() {
  const navigate = useNavigate();
  const { addRoster } = useRosters();

  const [bandeId, setBandeId] = useState<string>('');
  const [nomBande, setNomBande] = useState('');
  // Saisie gardée en texte brut : un input contrôlé par un number forcerait
  // la valeur dès l'effacement (impossible de vider le champ pour retaper
  // un chiffre) — la conversion ne s'applique qu'à l'usage (voir `budget`).
  const [budgetSaisi, setBudgetSaisi] = useState(String(BUDGET_PAR_DEFAUT));
  const [membres, setMembres] = useState<Member[]>([]);
  // Coût unitaire réellement payé pour les profils sans prix fixe (ex :
  // chien de guerre, "25+2D6") — le catalogue n'a pas de `cout` numérique
  // pour ces profils, donc `coutTotal` ci-dessous ne peut pas le déduire.
  const [coutPayeParInstance, setCoutPayeParInstance] = useState<Record<string, number>>({});
  const [profilEnRecrutement, setProfilEnRecrutement] = useState<Profile | null>(null);
  // Bandes à chef libre (ex : Lustrian Reavers) : le joueur choisit le chef
  // parmi les héros recrutés, plutôt qu'un profil fixe (voir Profile.est_leader).
  const [leaderInstanceId, setLeaderInstanceId] = useState<string | null>(null);
  // Tribu choisie pour les bandes qui en proposent (ex : Maraudeurs du
  // Chaos) — voir WarbandCatalog.tribus. Fixée une fois pour toutes.
  const [tribuId, setTribuId] = useState('');

  const budget = Number(budgetSaisi) || 0;

  const catalogue = useMemo(() => CATALOGUES.find((c) => c.id === bandeId), [bandeId]);

  // Groupées par grade (1a, 1b, 1c...) puis triées par nom au sein de chaque groupe.
  const catalauguesParGrade = useMemo(() => {
    const groupes = new Map<string, typeof CATALOGUES>();
    for (const c of CATALOGUES) {
      const liste = groupes.get(c.grade) ?? [];
      liste.push(c);
      groupes.set(c.grade, liste);
    }
    for (const liste of groupes.values()) {
      liste.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
    }
    return [...groupes.entries()].sort(([a], [b]) => a.localeCompare(b, 'fr'));
  }, []);

  const coutTotal = membres.reduce((acc, m) => {
    const profil = catalogue?.profils.find((p) => p.id === m.profil_id);
    const coutUnitaire = profil?.cout ?? coutPayeParInstance[m.instance_id] ?? 0;
    return acc + coutUnitaire * (m.taille_groupe || 1);
  }, 0);
  const restant = budget - coutTotal;

  // roster factice pour vérifier les limites de composition en cours de création
  const rosterFictif = useMemo<RosterInstance>(
    () => ({
      id: 'draft',
      bande_id: bandeId,
      nom_bande: nomBande,
      tresorerie: budget,
      wyrdstone: 0,
      equipement_reserve: '',
      stock: [],
      objets_personnalises: [],
      objets_surcharges: {},
      membres,
      historique_batailles: [],
      createdAt: '',
      updatedAt: '',
    }),
    [bandeId, nomBande, budget, membres]
  );

  const retirerMembre = (instanceId: string) => {
    setMembres((prev) => prev.filter((m) => m.instance_id !== instanceId));
    setLeaderInstanceId((prev) => (prev === instanceId ? null : prev));
    setCoutPayeParInstance((prev) => {
      if (!(instanceId in prev)) return prev;
      const reste = { ...prev };
      delete reste[instanceId];
      return reste;
    });
  };

  const herosRecrutes = membres.filter((m) => catalogue?.profils.find((p) => p.id === m.profil_id)?.type === 'heros');

  const renommerMembre = (instanceId: string, nom: string) => {
    setMembres((prev) => prev.map((m) => (m.instance_id === instanceId ? { ...m, nom_perso: nom } : m)));
  };

  const tribuRequise = (catalogue?.tribus?.length ?? 0) > 0;
  const peutCreer =
    bandeId !== '' && nomBande.trim() !== '' && membres.length > 0 && (!tribuRequise || tribuId !== '');

  const handleCreer = async () => {
    if (!peutCreer) return;
    const roster = creerRoster(bandeId, nomBande.trim(), restant);
    roster.membres = membres;
    if (catalogue?.leader_libre && leaderInstanceId) {
      roster.leader_instance_id = leaderInstanceId;
    }
    if (tribuRequise && tribuId) {
      roster.tribu = tribuId;
    }
    await addRoster(roster);
    navigate(`/roster/${roster.id}`);
  };

  return (
    <Screen title="Nouvelle bande" back="/">
      <div className="card">
        <div className="field">
          <label>Faction</label>
          <select
            value={bandeId}
            onChange={(e) => {
              setBandeId(e.target.value);
              setMembres([]);
              setTribuId('');
            }}
          >
            <option value="">— Choisir une faction —</option>
            {catalauguesParGrade.map(([grade, liste]) => (
              <optgroup key={grade} label={`Grade ${grade}`}>
                {liste.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {tribuRequise && (
          <div className="field">
            <label>Tribu</label>
            <select value={tribuId} onChange={(e) => setTribuId(e.target.value)}>
              <option value="">— Choisir une tribu —</option>
              {catalogue?.tribus?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nom}
                </option>
              ))}
            </select>
            <p className="text-sm text-muted mb-0">Fixée une fois pour toutes — voir le détail dans Règles spéciales.</p>
          </div>
        )}

        <div className="field">
          <label>Nom de la bande</label>
          <input value={nomBande} onChange={(e) => setNomBande(e.target.value)} placeholder="Les Lueurs de Fond" />
        </div>

        <div className="field">
          <label>Trésorerie de départ (couronnes d'or)</label>
          <input type="number" value={budgetSaisi} onChange={(e) => setBudgetSaisi(e.target.value)} />
        </div>
      </div>

      {catalogue && catalogue.regles_speciales.length > 0 && (
        <div className="card">
          <details className="disclosure">
            <summary>Règles spéciales</summary>
            {catalogue.regles_speciales.map((r) => (
              <div key={r.nom} style={{ marginBottom: '0.6rem' }}>
                <strong>{r.nom}</strong>
                <p className="text-sm text-muted" style={{ whiteSpace: 'pre-line' }}>
                  {r.texte}
                </p>
              </div>
            ))}
            {tribuRequise && (
              <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border)' }}>
                <strong>Tribu {tribuId ? `choisie : ${catalogue?.tribus?.find((t) => t.id === tribuId)?.nom}` : '(à choisir ci-dessus)'}</strong>
                {(tribuId ? catalogue?.tribus?.filter((t) => t.id === tribuId) : catalogue?.tribus)?.map((t) => (
                  <div key={t.id} style={{ marginTop: '0.5rem' }}>
                    {!tribuId && <strong>{t.nom}</strong>}
                    <p className="text-sm text-muted" style={{ whiteSpace: 'pre-line' }}>
                      {t.texte}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </details>
        </div>
      )}

      {catalogue && (
        <div className="card">
          <div className="flex justify-between items-center">
            <h3 className="mt-0 mb-0">Recruter</h3>
            <span className={restant < 0 ? 'badge badge--danger' : 'badge badge--success'}>
              {restant} po restantes
            </span>
          </div>
          <div className="flex flex-col gap-sm" style={{ marginTop: '0.6rem' }}>
            {catalogue.profils.map((p) => {
              const check = peutAjouterMembre(rosterFictif, p.id);
              return (
                <div key={p.id} className="list-item" style={{ marginBottom: 0 }}>
                  <div className="list-item__main">
                    <div className="list-item__title">{p.nom}</div>
                    <div className="list-item__subtitle">
                      {p.type === 'heros' ? 'Héros' : 'Homme de main'}
                      {p.unique && ' · Unique'}
                      {!p.unique && p.max ? ` · Max ${p.max}` : ''}
                      {' · '}
                      {p.cout != null ? `${p.cout} po` : 'coût ?'}
                    </div>
                  </div>
                  <button className="btn btn--sm" disabled={!check.ok} onClick={() => setProfilEnRecrutement(p)}>
                    + Ajouter
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {membres.length > 0 && (
        <div className="card">
          <h3>Membres recrutés ({membres.length})</h3>
          {membres.map((m) => (
            <div key={m.instance_id} className="list-item" style={{ marginBottom: '0.5rem' }}>
              <div className="list-item__main">
                <input
                  value={m.nom_perso}
                  onChange={(e) => renommerMembre(m.instance_id, e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontWeight: 700,
                    fontFamily: 'var(--font-heading)',
                    width: '100%',
                    padding: 0,
                  }}
                />
                <div className="list-item__subtitle">
                  {catalogue?.profils.find((p) => p.id === m.profil_id)?.nom}
                  {m.taille_groupe > 1 ? ` · × ${m.taille_groupe}` : ''} · XP {m.xp}
                </div>
              </div>
              <button className="btn btn--sm btn--danger" onClick={() => retirerMembre(m.instance_id)}>
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}

      {catalogue?.leader_libre && herosRecrutes.length > 0 && (
        <div className="card">
          <h3>Chef de bande</h3>
          <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
            Cette bande n'a pas de chef fixe : choisis-le parmi les héros recrutés (facultatif ici, modifiable
            depuis la fiche de bande).
          </p>
          <div className="flex flex-col gap-sm">
            {herosRecrutes.map((m) => (
              <label key={m.instance_id} className="flex items-center gap-sm" style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="leader"
                  checked={leaderInstanceId === m.instance_id}
                  onChange={() => setLeaderInstanceId(m.instance_id)}
                />
                <span>{m.nom_perso || catalogue.profils.find((p) => p.id === m.profil_id)?.nom}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button className="btn btn--primary btn--block" disabled={!peutCreer} onClick={handleCreer}>
        Créer la bande
      </button>

      {profilEnRecrutement && (
        <RecrutementDraftModal
          profil={profilEnRecrutement}
          catalogue={catalogue}
          roster={rosterFictif}
          budgetDisponible={restant}
          verifierLimite={(quantite) => peutAjouterMembre(rosterFictif, profilEnRecrutement.id, quantite)}
          onClose={() => setProfilEnRecrutement(null)}
          onConfirm={({ nom, xpDepart, quantite, sortsConnus, coutUnitaire, marque }) => {
            const membre = creerMembre(profilEnRecrutement, xpDepart, quantite);
            if (nom) membre.nom_perso = nom;
            if (marque) membre.marque = marque;
            if (sortsConnus.length > 0) membre.sorts_connus = sortsConnus;
            if (profilEnRecrutement.cout === null) {
              setCoutPayeParInstance((prev) => ({ ...prev, [membre.instance_id]: coutUnitaire }));
            }
            setMembres((prev) => [...prev, membre]);
            setProfilEnRecrutement(null);
          }}
        />
      )}
    </Screen>
  );
}

type RecrutementDraftModalProps = {
  profil: Profile;
  catalogue: WarbandCatalog | undefined;
  roster: RosterInstance;
  budgetDisponible: number;
  verifierLimite: (quantite: number) => { ok: boolean; raison?: string };
  onClose: () => void;
  onConfirm: (opts: {
    nom: string;
    xpDepart: number;
    quantite: number;
    sortsConnus: string[];
    coutUnitaire: number;
    marque: string;
  }) => void;
};

function RecrutementDraftModal({
  profil,
  catalogue,
  roster,
  budgetDisponible,
  verifierLimite,
  onClose,
  onConfirm,
}: RecrutementDraftModalProps) {
  const [nom, setNom] = useState('');
  const [xpDepartSaisie, setXpDepartSaisie] = useState(String(profil.xp_depart ?? 0));
  const [quantiteSaisie, setQuantiteSaisie] = useState('1');
  // Sort(s) connu(s) choisis librement au recrutement — un seul par défaut,
  // davantage si le profil le précise (voir Profile.nombre_sorts_choisis_depart).
  const [sortsChoisis, setSortsChoisis] = useState<string[]>([]);
  // Coût saisi à la main quand le profil n'a pas de prix fixe (ex : chien de
  // guerre, "25+2D6") — jet à faire sur table papier, comme pour un objet
  // acheté au shop plutôt qu'un recrutement classique.
  const [coutManuelSaisi, setCoutManuelSaisi] = useState('');
  // Marque choisie au recrutement pour les profils à `marque_requise` (ex :
  // le Devin des Maraudeurs du Chaos) — détermine le domaine de sorts
  // proposé ensuite (voir utils/magie.ts).
  const [marqueChoisie, setMarqueChoisie] = useState('');
  const estGroupable = profil.type === 'homme_de_main';
  // Un animal (chien de guerre, guerrier gnoblar...) ne gagne jamais
  // d'expérience — inutile et trompeur de proposer un XP de départ.
  const gagneExperience = profil.type !== 'animal';
  const marqueRequise = !!profil.marque_requise;
  const premierSortRequis =
    estSorcier(catalogue, profil.id, marqueChoisie || undefined) && (!marqueRequise || marqueChoisie !== '');
  const sortsPossibles = sortsDisponiblesPourRoster(catalogue, roster, [], profil, marqueChoisie || undefined);
  const nombreSortsRequis = profil.nombre_sorts_choisis_depart ?? 1;
  const sortsChoisisValides =
    sortsChoisis.length === nombreSortsRequis && sortsChoisis.every((s) => s !== '');
  const coutManuelRequis = profil.cout === null;
  const coutManuelValide =
    !coutManuelRequis || (coutManuelSaisi.trim() !== '' && !Number.isNaN(Number(coutManuelSaisi)) && Number(coutManuelSaisi) >= 0);

  const xpDepart = Number(xpDepartSaisie) || 0;
  const quantite = Math.max(1, parseInt(quantiteSaisie, 10) || 1);
  const coutUnitaire = profil.cout ?? (coutManuelRequis ? Number(coutManuelSaisi) || 0 : 0);
  const coutTotal = coutUnitaire * quantite;
  const budgetSuffisant = coutTotal <= budgetDisponible;
  const check = verifierLimite(quantite);

  const confirmer = () => {
    if (!check.ok || !coutManuelValide) return;
    if (marqueRequise && !marqueChoisie) return;
    if (premierSortRequis && !sortsChoisisValides) return;
    onConfirm({
      nom: nom.trim(),
      xpDepart: gagneExperience ? xpDepart : 0,
      quantite,
      sortsConnus:
        premierSortRequis && sortsChoisisValides ? [...(profil.sorts_fixes_depart ?? []), ...sortsChoisis] : [],
      coutUnitaire,
      marque: marqueRequise ? marqueChoisie : '',
    });
  };

  return (
    <Modal onClose={onClose}>
      <h3>Recruter — {profil.nom}</h3>
      {!gagneExperience && (
        <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
          Traité comme une créature/objet d'équipement (recrutement, prix et rareté comme au shop), pas comme un
          combattant normal de la bande.
        </p>
      )}
      {profil.stats && (
        <div className="stat-grid" style={{ marginBottom: '0.6rem' }}>
          {STAT_KEYS.map((k) => (
            <div key={k} className="stat-grid__cell stat-grid__cell--label">
              {k}
            </div>
          ))}
          {STAT_KEYS.map((k) => (
            <div key={k} className="stat-grid__cell stat-grid__cell--value">
              {profil.stats![k]}
            </div>
          ))}
        </div>
      )}
      {profil.regles_speciales?.map((r) => (
        <p key={r.nom} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
          <strong>{r.nom}</strong> — {r.texte}
        </p>
      ))}
      {profil.rarete && (
        <p className="text-sm text-danger" style={{ marginTop: '0.6rem' }}>
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
      <div className="field">
        <label>Nom du personnage{estGroupable && quantite > 1 ? ' (groupe)' : ''}</label>
        <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder={profil.nom} />
      </div>
      {estGroupable && (
        <div className="field">
          <label>Nombre de figurines (groupe identique)</label>
          <input type="number" min={1} value={quantiteSaisie} onChange={(e) => setQuantiteSaisie(e.target.value)} />
        </div>
      )}
      {marqueRequise && (
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
      {premierSortRequis && profil.sorts_fixes_depart && profil.sorts_fixes_depart.length > 0 && (
        <p className="text-sm text-muted">
          Connaît automatiquement : <strong>{profil.sorts_fixes_depart.join(', ')}</strong>.
        </p>
      )}
      {premierSortRequis &&
        Array.from({ length: nombreSortsRequis }, (_, i) => {
          const sortsRestants = sortsPossibles.filter(
            (s) => !sortsChoisis.some((sel, j) => j !== i && sel === s.nom)
          );
          return (
            <div className="field" key={i}>
              <label>{nombreSortsRequis > 1 ? `Sort connu (${i + 1}/${nombreSortsRequis})` : 'Premier sort connu'}</label>
              <select
                value={sortsChoisis[i] ?? ''}
                onChange={(e) => {
                  const copie = [...sortsChoisis];
                  copie[i] = e.target.value;
                  setSortsChoisis(copie);
                }}
              >
                <option value="">— Choisir —</option>
                {sortsRestants.map((s) => (
                  <option key={s.nom} value={s.nom}>
                    {s.resultat} — {s.nom}
                  </option>
                ))}
              </select>
              {i === nombreSortsRequis - 1 && (
                <p className="text-sm text-muted mb-0">Obligatoire pour un profil sorcier.</p>
              )}
            </div>
          );
        })}
      {gagneExperience ? (
        <div className="field">
          <label>Expérience de départ</label>
          <input type="number" value={xpDepartSaisie} onChange={(e) => setXpDepartSaisie(e.target.value)} />
          <p className="text-sm text-muted mb-0">Ne déclenche aucune avancée due.</p>
        </div>
      ) : (
        <p className="text-sm text-muted">Ce profil ne gagne jamais d'expérience.</p>
      )}
      {!check.ok && <p className="text-danger text-sm">{check.raison}</p>}
      {check.ok && !budgetSuffisant && (
        <p className="text-danger text-sm">
          Budget insuffisant ({budgetDisponible} po restantes, {coutTotal} po requis).
        </p>
      )}
      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onClose}>
          Annuler
        </button>
        <button
          className="btn btn--primary"
          disabled={
            !check.ok ||
            !coutManuelValide ||
            (marqueRequise && !marqueChoisie) ||
            (premierSortRequis && !sortsChoisisValides)
          }
          onClick={confirmer}
        >
          Ajouter pour {coutTotal} po{!budgetSuffisant ? ' quand même' : ''}
        </button>
      </div>
    </Modal>
  );
}

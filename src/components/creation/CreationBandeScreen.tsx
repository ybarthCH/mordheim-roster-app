import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../common/Screen';
import { Modal } from '../common/Modal';
import { CATALOGUES } from '../../data/warbands';
import type { Profile } from '../../types/catalog';
import type { Member, RosterInstance } from '../../types/roster';
import { creerMembre, creerRoster } from '../../utils/factory';
import { peutAjouterMembre } from '../../utils/validation';
import { useRosters } from '../../state/RostersContext';

const BUDGET_PAR_DEFAUT = 500;

export function CreationBandeScreen() {
  const navigate = useNavigate();
  const { addRoster } = useRosters();

  const [bandeId, setBandeId] = useState<string>('');
  const [nomBande, setNomBande] = useState('');
  const [budget, setBudget] = useState(BUDGET_PAR_DEFAUT);
  const [membres, setMembres] = useState<Member[]>([]);
  const [profilEnRecrutement, setProfilEnRecrutement] = useState<Profile | null>(null);

  const catalogue = useMemo(() => CATALOGUES.find((c) => c.id === bandeId), [bandeId]);

  const coutTotal = membres.reduce((acc, m) => {
    const profil = catalogue?.profils.find((p) => p.id === m.profil_id);
    return acc + (profil?.cout ?? 0) * (m.taille_groupe || 1);
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
      membres,
      historique_batailles: [],
      createdAt: '',
      updatedAt: '',
    }),
    [bandeId, nomBande, budget, membres]
  );

  const retirerMembre = (instanceId: string) => {
    setMembres((prev) => prev.filter((m) => m.instance_id !== instanceId));
  };

  const renommerMembre = (instanceId: string, nom: string) => {
    setMembres((prev) => prev.map((m) => (m.instance_id === instanceId ? { ...m, nom_perso: nom } : m)));
  };

  const peutCreer = bandeId !== '' && nomBande.trim() !== '' && membres.length > 0;

  const handleCreer = async () => {
    if (!peutCreer) return;
    const roster = creerRoster(bandeId, nomBande.trim(), restant);
    roster.membres = membres;
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
            }}
          >
            <option value="">— Choisir une faction —</option>
            {CATALOGUES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Nom de la bande</label>
          <input value={nomBande} onChange={(e) => setNomBande(e.target.value)} placeholder="Les Lueurs de Fond" />
        </div>

        <div className="field">
          <label>Trésorerie de départ (couronnes d'or)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value) || 0)}
          />
        </div>
      </div>

      {catalogue && catalogue.regles_speciales.length > 0 && (
        <div className="card">
          <h3>Règles spéciales</h3>
          {catalogue.regles_speciales.map((r) => (
            <div key={r.nom} style={{ marginBottom: '0.6rem' }}>
              <strong>{r.nom}</strong>
              <p className="text-sm text-muted" style={{ whiteSpace: 'pre-line' }}>
                {r.texte}
              </p>
            </div>
          ))}
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

      <button className="btn btn--primary btn--block" disabled={!peutCreer} onClick={handleCreer}>
        Créer la bande
      </button>

      {profilEnRecrutement && (
        <RecrutementDraftModal
          profil={profilEnRecrutement}
          budgetDisponible={restant}
          verifierLimite={(quantite) => peutAjouterMembre(rosterFictif, profilEnRecrutement.id, quantite)}
          onClose={() => setProfilEnRecrutement(null)}
          onConfirm={({ nom, xpDepart, quantite }) => {
            const membre = creerMembre(profilEnRecrutement, xpDepart, quantite);
            if (nom) membre.nom_perso = nom;
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
  budgetDisponible: number;
  verifierLimite: (quantite: number) => { ok: boolean; raison?: string };
  onClose: () => void;
  onConfirm: (opts: { nom: string; xpDepart: number; quantite: number }) => void;
};

function RecrutementDraftModal({
  profil,
  budgetDisponible,
  verifierLimite,
  onClose,
  onConfirm,
}: RecrutementDraftModalProps) {
  const [nom, setNom] = useState('');
  const [xpDepart, setXpDepart] = useState(profil.xp_depart ?? 0);
  const [quantite, setQuantite] = useState(1);
  const [confirmationXp0, setConfirmationXp0] = useState(false);
  const estGroupable = profil.type === 'homme_de_main';

  const coutTotal = (profil.cout ?? 0) * quantite;
  const budgetSuffisant = coutTotal <= budgetDisponible;
  const check = verifierLimite(quantite);

  const changerXpDepart = (value: number) => {
    setXpDepart(value);
    setConfirmationXp0(false);
  };

  const confirmer = () => {
    if (!check.ok) return;
    if (xpDepart === 0 && !confirmationXp0) {
      setConfirmationXp0(true);
      return;
    }
    onConfirm({ nom: nom.trim(), xpDepart, quantite });
  };

  return (
    <Modal onClose={onClose}>
      <h3>Recruter — {profil.nom}</h3>
      <div className="field">
        <label>Nom du personnage{estGroupable && quantite > 1 ? ' (groupe)' : ''}</label>
        <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder={profil.nom} />
      </div>
      {estGroupable && (
        <div className="field">
          <label>Nombre de figurines (groupe identique)</label>
          <input
            type="number"
            min={1}
            value={quantite}
            onChange={(e) => setQuantite(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
      )}
      <div className="field">
        <label>Expérience de départ</label>
        <input type="number" value={xpDepart} onChange={(e) => changerXpDepart(Number(e.target.value) || 0)} />
        <p className="text-sm text-muted mb-0">Ne déclenche aucune avancée due.</p>
      </div>
      {confirmationXp0 && (
        <p className="text-danger text-sm">
          Es-tu sûr de vouloir commencer à 0 XP ? Clique à nouveau pour confirmer.
        </p>
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
        <button className="btn btn--primary" disabled={!check.ok} onClick={confirmer}>
          {confirmationXp0 ? 'Confirmer 0 XP et ajouter' : `Ajouter${!budgetSuffisant ? ' quand même' : ''}`}
        </button>
      </div>
    </Modal>
  );
}

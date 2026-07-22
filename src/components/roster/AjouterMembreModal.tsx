import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RosterInstance } from '../../types/roster';
import { getCatalogue } from '../../data/warbands';
import { peutAjouterMembre } from '../../utils/validation';
import { creerMembre } from '../../utils/factory';
import { clonerEquipementPourNouvellesFigurines, coutEquipementNouvellesFigurines } from '../../utils/shop';
import { Modal } from '../common/Modal';

const FRANC_TIREUR = '__franc_tireur__';

type Props = {
  roster: RosterInstance;
  onClose: () => void;
  onConfirm: (roster: RosterInstance) => void;
};

export function AjouterMembreModal({ roster, onClose, onConfirm }: Props) {
  const navigate = useNavigate();
  const catalogue = getCatalogue(roster.bande_id);
  const [profilId, setProfilId] = useState('');
  const [nomPerso, setNomPerso] = useState('');
  const [xpDepart, setXpDepart] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [confirmationXp0, setConfirmationXp0] = useState(false);
  const [groupeCibleId, setGroupeCibleId] = useState<string | null>(null);

  const profil = catalogue?.profils.find((p) => p.id === profilId);
  const estGroupable = profil?.type === 'homme_de_main' || profil?.type === 'animal';

  // Groupes déjà existants pour ce profil (hors morts) : recruter peut soit
  // former un nouveau groupe, soit rejoindre l'un d'eux (au prix d'une
  // surtaxe liée à l'XP déjà acquise par le groupe — voir plus bas).
  const groupesExistants = estGroupable
    ? roster.membres.filter((m) => m.profil_id === profilId && m.statut !== 'mort' && !m.promu_heros)
    : [];
  const groupeCible = groupeCibleId ? (groupesExistants.find((m) => m.instance_id === groupeCibleId) ?? null) : null;

  const check = profilId ? peutAjouterMembre(roster, profilId, quantite) : { ok: false };
  const coutUnitaire = profil?.cout ?? 0;
  const xpGroupe = groupeCible?.xp ?? 0;
  const surtaxeXpUnitaire = groupeCible ? 2 * xpGroupe : 0;
  const coutEquipementForce = groupeCible ? coutEquipementNouvellesFigurines(groupeCible.inventaire, quantite) : 0;
  const coutTotal = (coutUnitaire + surtaxeXpUnitaire) * quantite + coutEquipementForce;
  const vetPointsIndicatifs = groupeCible ? xpGroupe * quantite : 0;
  const budgetSuffisant = coutTotal <= roster.tresorerie;

  const choisirProfil = (value: string) => {
    if (value === FRANC_TIREUR) {
      onClose();
      navigate(`/roster/${roster.id}/recruter-franc-tireur`);
      return;
    }
    setProfilId(value);
    const p = catalogue?.profils.find((pr) => pr.id === value);
    setXpDepart(p?.xp_depart ?? 0);
    setQuantite(1);
    setConfirmationXp0(false);
    setGroupeCibleId(null);
  };

  const changerXpDepart = (value: number) => {
    setXpDepart(value);
    setConfirmationXp0(false);
  };

  const confirmer = () => {
    if (!profil || !check.ok) return;
    if (!groupeCible && xpDepart === 0 && !confirmationXp0) {
      setConfirmationXp0(true);
      return;
    }

    if (groupeCible) {
      // Rejoint un groupe existant : la figurine hérite immédiatement de
      // l'XP et de l'équipement du groupe (payé séparément ci-dessus), pas
      // d'XP de départ propre.
      const nouvellesEntrees = clonerEquipementPourNouvellesFigurines(groupeCible.inventaire, quantite);
      const membresMaj = roster.membres.map((m) =>
        m.instance_id === groupeCible.instance_id
          ? { ...m, taille_groupe: m.taille_groupe + quantite, inventaire: [...m.inventaire, ...nouvellesEntrees] }
          : m
      );
      onConfirm({ ...roster, tresorerie: roster.tresorerie - coutTotal, membres: membresMaj });
      return;
    }

    const membre = creerMembre(profil, xpDepart, quantite);
    if (nomPerso.trim()) membre.nom_perso = nomPerso.trim();
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
          {catalogue?.profils.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom} ({p.cout != null ? `${p.cout} po` : 'coût ?'})
            </option>
          ))}
          <option value={FRANC_TIREUR}>Franc-tireur…</option>
        </select>
      </div>
      {profil && (
        <>
          {groupesExistants.length > 0 && (
            <div className="field">
              <label>Groupe</label>
              <select
                value={groupeCibleId ?? ''}
                onChange={(e) => {
                  setGroupeCibleId(e.target.value || null);
                  setQuantite(1);
                  setConfirmationXp0(false);
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
          {(estGroupable || groupeCible) && (
            <div className="field">
              <label>Nombre de figurines {groupeCible ? 'rejoignant le groupe' : '(groupe identique)'}</label>
              <input
                type="number"
                min={1}
                value={quantite}
                onChange={(e) => setQuantite(Math.max(1, Number(e.target.value) || 1))}
              />
            </div>
          )}
          {groupeCible ? (
            <div className="card card--tight" style={{ margin: '0.6rem 0' }}>
              <p className="text-sm mb-0">
                <strong>Recrutement dans un groupe expérimenté</strong>
              </p>
              <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
                Le groupe a {xpGroupe} XP : chaque nouvelle figurine coûte +{surtaxeXpUnitaire} po (2 × XP du groupe)
                en plus du prix normal, et doit être équipée à l'identique du reste du groupe.
              </p>
              {groupeCible.inventaire.length > 0 && (
                <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
                  Équipement forcé : {[...new Set(groupeCible.inventaire.map((e) => e.nom))].join(', ')} (
                  {coutEquipementForce} po au total pour {quantite} figurine{quantite > 1 ? 's' : ''}).
                </p>
              )}
              <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
                Coût indicatif en points vétéran : {vetPointsIndicatifs} (non contrôlé — libre à toi de recruter
                même sans les points suffisants).
              </p>
            </div>
          ) : (
            <div className="field">
              <label>Expérience de départ</label>
              <input type="number" value={xpDepart} onChange={(e) => changerXpDepart(Number(e.target.value) || 0)} />
              <p className="text-sm text-muted mb-0">Ne déclenche aucune avancée due.</p>
            </div>
          )}
          {confirmationXp0 && !groupeCible && (
            <p className="text-danger text-sm">
              Es-tu sûr de vouloir commencer à 0 XP ? Clique à nouveau pour confirmer.
            </p>
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
        <button className="btn btn--primary" disabled={!profil || !check.ok} onClick={confirmer}>
          {confirmationXp0 && !groupeCible
            ? 'Confirmer 0 XP et recruter'
            : `Recruter pour ${coutTotal} po${profil && !budgetSuffisant ? ' quand même' : ''}`}
        </button>
      </div>
    </Modal>
  );
}

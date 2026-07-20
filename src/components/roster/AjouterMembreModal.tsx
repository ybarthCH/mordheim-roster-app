import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RosterInstance } from '../../types/roster';
import { getCatalogue } from '../../data/warbands';
import { peutAjouterMembre } from '../../utils/validation';
import { creerMembre } from '../../utils/factory';
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

  const profil = catalogue?.profils.find((p) => p.id === profilId);
  const check = profilId ? peutAjouterMembre(roster, profilId) : { ok: false };
  const cout = profil?.cout ?? 0;
  const budgetSuffisant = cout <= roster.tresorerie;

  const choisirProfil = (value: string) => {
    if (value === FRANC_TIREUR) {
      onClose();
      navigate(`/roster/${roster.id}/recruter-franc-tireur`);
      return;
    }
    setProfilId(value);
    const p = catalogue?.profils.find((pr) => pr.id === value);
    setXpDepart(p?.xp_depart ?? 0);
  };

  const confirmer = () => {
    if (!profil || !check.ok) return;
    const membre = creerMembre(profil, xpDepart);
    if (nomPerso.trim()) membre.nom_perso = nomPerso.trim();
    onConfirm({
      ...roster,
      tresorerie: roster.tresorerie - cout,
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
          <div className="field">
            <label>Nom du personnage</label>
            <input value={nomPerso} onChange={(e) => setNomPerso(e.target.value)} placeholder={profil.nom} />
          </div>
          <div className="field">
            <label>Expérience de départ</label>
            <input
              type="number"
              value={xpDepart}
              onChange={(e) => setXpDepart(Number(e.target.value) || 0)}
            />
            <p className="text-sm text-muted mb-0">Ne déclenche aucune avancée due.</p>
          </div>
        </>
      )}
      {profilId && !check.ok && <p className="text-danger text-sm">{check.raison}</p>}
      {profil && !budgetSuffisant && (
        <p className="text-danger text-sm">
          Trésorerie insuffisante ({roster.tresorerie} po disponibles, {cout} po requis).
        </p>
      )}
      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onClose}>
          Annuler
        </button>
        <button className="btn btn--primary" disabled={!profil || !check.ok} onClick={confirmer}>
          Recruter{profil && !budgetSuffisant ? ' quand même' : ''}
        </button>
      </div>
    </Modal>
  );
}

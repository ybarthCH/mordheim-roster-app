import { useEffect, useState } from 'react';
import { Icon } from '../common/Icon';
import type { IconName } from '../common/Icon';
import { STATUTS } from '../../types/roster';
import type { Member, Statut } from '../../types/roster';
import type { Profile } from '../../types/catalog';

const STATUT_BADGE: Record<string, string> = {
  actif: 'badge--success',
  hors_de_combat: 'badge--warning',
  mort: 'badge--danger',
  blesse: 'badge--neutral',
};

const STATUT_ICONE: Partial<Record<string, IconName>> = {
  hors_de_combat: 'ossements',
  mort: 'crane',
  blesse: 'goutte',
};

type StatutCardProps = {
  membre: Member;
  profil: Profile;
  rating: number;
  estGroupeSimplifie: boolean;
  onMajMembre: (partial: Partial<Member>) => void;
  onChangerStatut: (s: Statut) => void;
  onOpenRecruterGroupe: () => void;
};

export function StatutCard({
  membre,
  profil,
  rating,
  estGroupeSimplifie,
  onMajMembre,
  onChangerStatut,
  onOpenRecruterGroupe,
}: StatutCardProps) {
  // Saisie gardée en texte brut : un input contrôlé par un number forcerait
  // la valeur dès l'effacement (impossible de vider le champ pour retaper un
  // chiffre) — la conversion/le plancher ne s'appliquent qu'à l'usage, la
  // valeur n'est répercutée sur le membre que si elle est valide.
  const [tailleGroupeSaisie, setTailleGroupeSaisie] = useState(String(membre.taille_groupe));
  // Ne resynchronise qu'au changement de personnage affiché (navigation) :
  // le champ lui-même pilote déjà membre.taille_groupe en écriture (voir
  // onChange plus bas), l'y re-souscrire aussi en lecture court-circuiterait
  // la saisie en cours.
  useEffect(() => {
    setTailleGroupeSaisie(String(membre.taille_groupe));
  }, [membre.instance_id]);

  const statutsDisponibles = estGroupeSimplifie ? STATUTS.filter((s) => s.id === 'actif' || s.id === 'mort') : STATUTS;

  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            value={membre.nom_perso}
            onChange={(e) => onMajMembre({ nom_perso: e.target.value })}
            className="input--heading"
          />
          <p className="text-muted text-sm mb-0">
            {profil.nom} · {profil.type === 'heros' ? 'Héros' : profil.type === 'animal' ? 'Animal' : 'Homme de main'}
            {membre.promu_heros && ' (promu)'}
            {membre.profil_custom && ' · Franc-tireur'}
          </p>
        </div>
        <span className={`badge ${STATUT_BADGE[membre.statut]}`}>
          {STATUT_ICONE[membre.statut] && <Icon name={STATUT_ICONE[membre.statut]!} style={{ marginRight: '0.35em' }} />}
          {STATUTS.find((s) => s.id === membre.statut)?.label}
          {membre.statut === 'mort' && membre.date_mort ? ` (${membre.date_mort})` : ''}
        </span>
      </div>

      <div className="status-select" style={{ marginTop: '0.7rem' }}>
        {statutsDisponibles.map((s) => (
          <button
            key={s.id}
            className={`status-pill ${membre.statut === s.id ? 'status-pill--active' : ''}`}
            onClick={() => onChangerStatut(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {membre.statut === 'blesse' && (
        <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
          <span className="text-sm text-muted">Blessé :</span>
          <input
            type="number"
            className="stat-grid__input stat-grid__input--pv"
            value={membre.blesse_tour_actuel}
            onChange={(e) => onMajMembre({ blesse_tour_actuel: Number(e.target.value) || 0 })}
          />
          <span>/</span>
          <input
            type="number"
            className="stat-grid__input stat-grid__input--pv"
            value={membre.blesse_tour_total}
            onChange={(e) => onMajMembre({ blesse_tour_total: Number(e.target.value) || 0 })}
          />
          <span className="text-sm text-muted">tour(s)</span>
        </div>
      )}

      <div className="flex items-center gap-sm" style={{ marginTop: '0.7rem' }}>
        <span className="badge badge--info">Rating {rating}</span>
      </div>

      {estGroupeSimplifie && (
        <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
          <span className="text-sm text-muted">Groupe :</span>
          <input
            type="number"
            min={1}
            className="stat-grid__input stat-grid__input--pv"
            value={tailleGroupeSaisie}
            onChange={(e) => {
              const raw = e.target.value;
              setTailleGroupeSaisie(raw);
              const n = parseInt(raw, 10);
              if (raw.trim() !== '' && n >= 1) onMajMembre({ taille_groupe: n });
            }}
            onBlur={() => setTailleGroupeSaisie(String(membre.taille_groupe))}
          />
          <span className="text-sm text-muted">
            figurine{membre.taille_groupe > 1 ? 's' : ''} identique{membre.taille_groupe > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {estGroupeSimplifie && (
        <div style={{ marginTop: '0.6rem' }}>
          <button className="btn btn--sm" onClick={onOpenRecruterGroupe}>
            + Recruter un nouveau membre dans ce groupe
          </button>
        </div>
      )}

      {estGroupeSimplifie && (
        <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
          <span className="text-sm text-muted">Hors de combat :</span>
          <button className="btn btn--sm" onClick={() => onMajMembre({ hors_combat: Math.max(0, membre.hors_combat - 1) })}>
            −
          </button>
          <strong>
            {membre.hors_combat} / {membre.taille_groupe}
          </strong>
          <button
            className="btn btn--sm"
            onClick={() => onMajMembre({ hors_combat: Math.min(membre.taille_groupe, membre.hors_combat + 1) })}
          >
            +
          </button>
          {membre.hors_combat > 0 && <span className="text-sm text-muted">à résoudre au prochain post-bataille</span>}
        </div>
      )}
    </div>
  );
}

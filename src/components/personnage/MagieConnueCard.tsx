import { useState } from 'react';
import { Icon } from '../common/Icon';
import { resolveSort, sortsDisponibles } from '../../utils/magie';
import type { Member } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';

type MagieConnueCardProps = {
  membre: Member;
  catalogue: WarbandCatalog;
  onMajMembre: (partial: Partial<Member>) => void;
};

// Sorts effectivement appris par ce sorcier — le premier est choisi
// obligatoirement au recrutement, les suivants via une avancée "nouvelle
// compétence" (voir AvanceeModal). Un ajout manuel reste possible ici, pour
// corriger un oubli sans repasser par une avancée.
export function MagieConnueCard({ membre, catalogue, onMajMembre }: MagieConnueCardProps) {
  const [sortAAjouter, setSortAAjouter] = useState('');
  const disponibles = sortsDisponibles(catalogue, membre.sorts_connus);

  return (
    <div className="card">
      <h3>
        <Icon name="flamme" style={{ marginRight: '0.35em' }} />
        Magie — Sort connu
      </h3>
      {membre.sorts_connus.length > 0 ? (
        membre.sorts_connus.map((nom, i) => {
          const sort = resolveSort(catalogue, nom);
          return (
            <p key={i} className="text-sm mb-0" style={{ marginTop: i > 0 ? '0.4rem' : 0 }}>
              <strong>{sort ? `${sort.resultat} — ${sort.nom}` : nom}</strong>
              {sort && <span className="text-muted"> (diff. {sort.difficulte}) : {sort.texte}</span>}
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', marginLeft: '0.4rem', padding: 0, color: 'var(--danger)' }}
                onClick={() => onMajMembre({ sorts_connus: membre.sorts_connus.filter((_, j) => j !== i) })}
                title="Retirer ce sort"
              >
                ✕
              </button>
            </p>
          );
        })
      ) : (
        <p className="text-sm text-muted mb-0">Aucun</p>
      )}
      {disponibles.length > 0 && (
        <div className="flex gap-sm" style={{ marginTop: '0.7rem' }}>
          <select value={sortAAjouter} onChange={(e) => setSortAAjouter(e.target.value)} style={{ flex: 1 }}>
            <option value="">— Ajouter un sort —</option>
            {disponibles.map((s) => (
              <option key={s.nom} value={s.nom}>
                {s.resultat} — {s.nom}
              </option>
            ))}
          </select>
          <button
            className="btn"
            disabled={!sortAAjouter}
            onClick={() => {
              if (!sortAAjouter) return;
              onMajMembre({ sorts_connus: [...membre.sorts_connus, sortAAjouter] });
              setSortAAjouter('');
            }}
          >
            Ajouter
          </button>
        </div>
      )}
    </div>
  );
}

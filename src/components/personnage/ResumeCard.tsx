import { injuryLabel } from '../../utils/blessures';
import { resolveItemDetail, resumeItem } from '../../utils/shop';
import type { InventoryEntry, Member } from '../../types/roster';
import type { Profile } from '../../types/catalog';

type ResumeCardProps = {
  profil: Profile;
  membre: Member;
  inventaireGroupe: { entree: InventoryEntry; quantite: number }[];
  nomCompetence: (skillId: string) => { nom: string; texte?: string } | undefined;
  onItemClick: (entree: InventoryEntry) => void;
};

export function ResumeCard({ profil, membre, inventaireGroupe, nomCompetence, onItemClick }: ResumeCardProps) {
  return (
    <div className="card">
      {profil.type === 'heros' && (
        <>
          <p className="text-sm mb-0">
            <strong>Compétences</strong>
          </p>
          {membre.competences_acquises.length > 0 ? (
            membre.competences_acquises.map((id) => {
              const s = nomCompetence(id);
              return (
                <p key={id} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                  <strong>{s?.nom ?? id}</strong>
                  {s?.texte && <span className="text-muted"> — {s.texte}</span>}
                </p>
              );
            })
          ) : (
            <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
              Aucune
            </p>
          )}
        </>
      )}

      <p className="text-sm mb-0" style={{ marginTop: profil.type === 'heros' ? '0.7rem' : 0 }}>
        <strong>Équipement</strong>
      </p>
      {inventaireGroupe.length > 0 ? (
        inventaireGroupe.map(({ entree, quantite }) => {
          const detail = resolveItemDetail(entree);
          const synopsis = resumeItem(detail);
          return (
            <p key={entree.instance_id} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              <button className="link-inline" onClick={() => onItemClick(entree)}>
                {entree.nom}
                {quantite > 1 ? ` ×${quantite}` : ''}
              </button>
              {synopsis && (
                <span className="text-muted"> — {synopsis.length > 70 ? `${synopsis.slice(0, 70).trimEnd()}…` : synopsis}</span>
              )}
            </p>
          );
        })
      ) : (
        <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
          Aucun
        </p>
      )}

      <p className="text-sm mb-0" style={{ marginTop: '0.7rem' }}>
        <strong>Règles spéciales / Sorts connus / mutations</strong>
      </p>
      {membre.sorts_connus.length > 0 ? (
        membre.sorts_connus.map((s, i) => (
          <p key={i} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
            {s}
          </p>
        ))
      ) : (
        <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
          Aucune
        </p>
      )}

      <p className="text-sm mb-0" style={{ marginTop: '0.7rem' }}>
        <strong>Blessures graves</strong>
      </p>
      {membre.blessures_graves.length > 0 ? (
        membre.blessures_graves.map((b) => (
          <p key={b.id} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
            {b.date} — {injuryLabel(b)}
          </p>
        ))
      ) : (
        <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
          Aucune
        </p>
      )}
    </div>
  );
}

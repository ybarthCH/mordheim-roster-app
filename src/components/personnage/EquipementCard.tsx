import { Icon } from '../common/Icon';
import { iconeCategorie, inventaireGroupeMismatch, libelleCategorie, prixVente } from '../../utils/shop';
import type { InventoryEntry, Member } from '../../types/roster';

type EquipementCardProps = {
  membre: Member;
  inventaireGroupe: { entree: InventoryEntry; quantite: number }[];
  onOpenAchat: () => void;
  onItemClick: (entree: InventoryEntry) => void;
  onRenvoyer: (instanceId: string) => void;
  onVendre: (entree: InventoryEntry) => void;
  onRetirer: (instanceId: string) => void;
};

export function EquipementCard({
  membre,
  inventaireGroupe,
  onOpenAchat,
  onItemClick,
  onRenvoyer,
  onVendre,
  onRetirer,
}: EquipementCardProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-center" style={{ marginBottom: '0.7rem' }}>
        <h3 className="mt-0 mb-0">
          <Icon name="epee" style={{ marginRight: '0.35em' }} />
          Équipement
        </h3>
        <button className="btn btn--sm btn--primary" onClick={onOpenAchat}>
          + Acheter
        </button>
      </div>
      {inventaireGroupeMismatch(membre) && (
        <p className="text-sm text-danger" style={{ marginTop: 0 }}>
          ⚠ Équipement dépareillé : ce groupe de {membre.taille_groupe} figurines ne possède pas les mêmes objets en
          nombre égal pour chacune (probablement un objet donné depuis l'armurerie à une seule figurine). Complète les
          exemplaires manquants ou renvoie les objets en trop au stock.
        </p>
      )}
      {inventaireGroupe.length === 0 && <p className="text-muted text-sm">Aucun objet acheté.</p>}
      {inventaireGroupe.map(({ entree, quantite }) => (
        <div key={entree.instance_id} className="list-item">
          <div className="list-item__main" role="button" style={{ cursor: 'pointer' }} onClick={() => onItemClick(entree)}>
            <div className="list-item__title" style={{ textDecoration: 'underline' }}>
              {entree.nom}
              {quantite > 1 ? ` ×${quantite}` : ''}
            </div>
            <div className="list-item__subtitle">
              {iconeCategorie(entree.categorie) && (
                <Icon name={iconeCategorie(entree.categorie)!} style={{ marginRight: '0.35em' }} />
              )}
              {libelleCategorie(entree.categorie)} · {entree.cout} po
              {quantite > 1 ? ` /figurine (${entree.cout * quantite} po au total)` : ''}
              {entree.cout_notation ? ` (jet : ${entree.cout_notation})` : ''}
            </div>
          </div>
          <div className="flex gap-sm">
            <button
              className="btn--ghost"
              style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem' }}
              onClick={() => onRenvoyer(entree.instance_id)}
              title={quantite > 1 ? `Renvoyer les ${quantite} exemplaires au stock de la bande` : 'Renvoyer au stock de la bande'}
            >
              ↩
            </button>
            <button
              className="btn--ghost"
              style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem' }}
              onClick={() => onVendre(entree)}
              title={`Vendre (+${prixVente(entree.cout) * quantite} po à la trésorerie)`}
            >
              Vendre
            </button>
            <button
              className="btn--ghost"
              style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)' }}
              onClick={() => onRetirer(entree.instance_id)}
              title={
                quantite > 1
                  ? `Supprimer les ${quantite} exemplaires sans contrepartie (perdu, détruit…)`
                  : 'Supprimer sans contrepartie (perdu, détruit…)'
              }
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

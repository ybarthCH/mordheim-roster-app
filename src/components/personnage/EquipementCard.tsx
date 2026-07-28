import { Icon } from '../common/Icon';
import { iconeCategorie, inventaireGroupeMismatch, libelleCategorie, prixVente } from '../../utils/shop';
import { getItem } from '../../data/items';
import type { InventoryEntry, Member } from '../../types/roster';

type EquipementCardProps = {
  membre: Member;
  inventaireGroupe: { entree: InventoryEntry; quantite: number }[];
  onOpenAchat: () => void;
  onItemClick: (entree: InventoryEntry) => void;
  onRenvoyer: (instanceId: string) => void;
  onVendre: (entree: InventoryEntry) => void;
  onRetirer: (instanceId: string) => void;
  verrouille?: boolean;
};

export function EquipementCard({
  membre,
  inventaireGroupe,
  onOpenAchat,
  onItemClick,
  onRenvoyer,
  onVendre,
  onRetirer,
  verrouille = false,
}: EquipementCardProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-center" style={{ marginBottom: '0.7rem' }}>
        <h3 className="mt-0 mb-0">
          <Icon name="epee" style={{ marginRight: '0.35em' }} />
          Équipement
        </h3>
        {!verrouille && (
          <button className="btn btn--sm btn--primary" onClick={onOpenAchat}>
            + Acheter
          </button>
        )}
      </div>
      {verrouille && (
        <p className="text-sm">
          {membre.equipement || 'Aucun équipement'}
          <br />
          <span className="text-muted">
            Équipement fourni avec le contrat : il ne peut être ni complété, ni revendu, ni transféré.
          </span>
        </p>
      )}
      {inventaireGroupeMismatch(membre) && (
        <p className="text-sm text-danger" style={{ marginTop: 0 }}>
          ⚠ Équipement dépareillé : ce groupe de {membre.taille_groupe} figurines ne possède pas les mêmes objets en
          nombre égal pour chacune (probablement un objet donné depuis l'armurerie à une seule figurine). Complète les
          exemplaires manquants ou renvoie les objets en trop au stock.
        </p>
      )}
      {!verrouille && inventaireGroupe.length === 0 && <p className="text-muted text-sm">Aucun objet acheté.</p>}
      {!verrouille && inventaireGroupe.map(({ entree, quantite }) => {
        // Une mutation/bénédiction modifie les caractéristiques à l'achat de
        // façon permanente (voir ShopItem.stats_delta) : elle ne peut ni être
        // revendue, ni transférée au stock de la bande, seulement supprimée
        // (perdue/détruite) sans annuler son effet sur les stats.
        const itemRef = getItem(entree.item_id);
        const modificationPermanente = !!itemRef && 'stats_delta' in itemRef && !!itemRef.stats_delta;
        return (
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
            {!modificationPermanente && (
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem' }}
                onClick={() => onRenvoyer(entree.instance_id)}
                title={quantite > 1 ? `Renvoyer les ${quantite} exemplaires au stock de la bande` : 'Renvoyer au stock de la bande'}
              >
                ↩
              </button>
            )}
            {!modificationPermanente && (
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem' }}
                onClick={() => onVendre(entree)}
                title={`Vendre (+${prixVente(entree.cout) * quantite} po à la trésorerie)`}
              >
                Vendre
              </button>
            )}
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
        );
      })}
    </div>
  );
}

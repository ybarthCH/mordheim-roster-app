import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { AchatEquipementModal } from '../personnage/AchatEquipementModal';
import { ItemDetailModal } from '../personnage/ItemDetailModal';
import { iconeCategorie, libelleCategorie, resolveItemDetail, prixVente } from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import type { RosterInstance, Member, InventoryEntry } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';

const nomAffiche = (m: Member) => `${m.nom_perso}${m.taille_groupe > 1 ? ` × ${m.taille_groupe}` : ''}`;

type ArmurerieSectionProps = {
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  onAchat: (item: ShopItem, coutPaye: number) => void;
  onDonner: (instanceId: string, membreId: string) => void;
  onVendre: (instanceId: string) => void;
  onRetirer: (instanceId: string) => void;
};

export function ArmurerieSection({ roster, catalogue, onAchat, onDonner, onVendre, onRetirer }: ArmurerieSectionProps) {
  const [modalAchat, setModalAchat] = useState(false);
  const [itemDetail, setItemDetail] = useState<InventoryEntry | null>(null);
  const [venteEnCours, setVenteEnCours] = useState<InventoryEntry | null>(null);

  return (
    <div className="card">
      <div className="flex justify-between items-center" style={{ marginBottom: '0.7rem' }}>
        <h3 className="mt-0 mb-0">
          <Icon name="coffre" style={{ marginRight: '0.35em' }} />
          Armurerie de la bande
        </h3>
        <button className="btn btn--sm btn--primary" onClick={() => setModalAchat(true)}>
          + Acheter
        </button>
      </div>
      {roster.stock.length === 0 && <p className="text-muted text-sm">Stock vide.</p>}
      {roster.stock.map((entree) => (
        <div key={entree.instance_id} className="list-item">
          <div
            className="list-item__main"
            role="button"
            style={{ cursor: 'pointer' }}
            onClick={() => setItemDetail(entree)}
          >
            <div className="list-item__title" style={{ textDecoration: 'underline' }}>
              {entree.nom}
            </div>
            <div className="list-item__subtitle">
              {iconeCategorie(entree.categorie) && (
                <Icon name={iconeCategorie(entree.categorie)!} style={{ marginRight: '0.35em' }} />
              )}
              {libelleCategorie(entree.categorie)} · {entree.cout} po
              {entree.cout_notation ? ` (jet : ${entree.cout_notation})` : ''}
            </div>
          </div>
          <div className="flex gap-sm items-center">
            <select value="" onChange={(e) => e.target.value && onDonner(entree.instance_id, e.target.value)}>
              <option value="">Donner à…</option>
              {roster.membres.map((m) => (
                <option key={m.instance_id} value={m.instance_id}>
                  {nomAffiche(m)}
                </option>
              ))}
            </select>
            <button
              className="btn--ghost"
              style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem' }}
              onClick={() => setVenteEnCours(entree)}
              title={`Vendre (+${prixVente(entree.cout)} po à la trésorerie)`}
            >
              Vendre
            </button>
            <button
              className="btn--ghost"
              style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)' }}
              onClick={() => onRetirer(entree.instance_id)}
              title="Supprimer sans contrepartie (perdu, détruit…)"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      {modalAchat && catalogue && (
        <AchatEquipementModal
          catalogue={catalogue}
          profil={null}
          tresorerie={roster.tresorerie}
          onClose={() => setModalAchat(false)}
          onAchat={onAchat}
        />
      )}
      {itemDetail && <ItemDetailModal item={resolveItemDetail(itemDetail)} onClose={() => setItemDetail(null)} />}
      {venteEnCours && (
        <Modal onClose={() => setVenteEnCours(null)}>
          <h3>Vendre {venteEnCours.nom} ?</h3>
          <p className="text-muted">
            L'objet sera retiré de l'armurerie et {prixVente(venteEnCours.cout)} po seront ajoutées à la trésorerie
            de la bande.
          </p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setVenteEnCours(null)}>
              Annuler
            </button>
            <button
              className="btn btn--primary"
              onClick={() => {
                onVendre(venteEnCours.instance_id);
                setVenteEnCours(null);
              }}
            >
              Vendre pour {prixVente(venteEnCours.cout)} po
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

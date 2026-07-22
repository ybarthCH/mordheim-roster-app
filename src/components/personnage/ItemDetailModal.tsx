import { Modal } from '../common/Modal';
import { libelleCategorie, iconeCategorie, classeRarete } from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import { Icon } from '../common/Icon';

type Props = {
  item: ShopItem;
  onClose: () => void;
};

// Fiche détaillée en lecture seule d'un objet possédé (stats/règles), ouverte
// au clic depuis le récapitulatif "en un coup d'œil" ou la liste
// d'équipement de la fiche personnage/armurerie.
export function ItemDetailModal({ item, onClose }: Props) {
  return (
    <Modal onClose={onClose}>
      <h3 className="mt-0 mb-0">
        {iconeCategorie(item.categorie) && (
          <Icon name={iconeCategorie(item.categorie)!} style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
        )}
        {item.nom}
      </h3>
      <p className="text-sm text-muted" style={{ marginTop: '0.2rem' }}>
        {libelleCategorie(item.categorie)} · {typeof item.cout === 'number' ? `${item.cout} po` : item.cout}
      </p>

      {(item.portee || item.force || item.sauvegarde) && (
        <div className="flex flex-wrap gap-sm" style={{ marginBottom: '0.4rem' }}>
          {item.portee && <span className="badge badge--info">Portée {item.portee}</span>}
          {item.force && <span className="badge badge--info">Force {item.force}</span>}
          {item.sauvegarde && <span className="badge badge--info">Save {item.sauvegarde}</span>}
        </div>
      )}
      {classeRarete(item.rarete) && (
        <span className={`badge ${classeRarete(item.rarete)}`} style={{ marginBottom: '0.3rem' }}>
          Rare {item.rarete}
        </span>
      )}
      {item.disponibilite && <p className="text-sm text-muted mb-0">{item.disponibilite}</p>}
      {item.regles_speciales?.map((r) => (
        <p key={r.nom} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
          <strong>{r.nom}</strong> — {r.texte}
        </p>
      ))}
      {item.texte && (
        <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
          {item.texte}
        </p>
      )}

      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onClose}>
          Fermer
        </button>
      </div>
    </Modal>
  );
}

import { Modal } from '../common/Modal';
import { libelleCategorie, iconeCategorie, classeRarete, formatCoutItem, traduirePortee } from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import { Icon } from '../common/Icon';
import { StatGrid } from '../common/StatGrid';
import { useLanguage } from '../../state/useLanguage';
import { translateItem } from '../../i18n/data/items';

type Props = {
  item: ShopItem;
  onClose: () => void;
};

// Fiche détaillée en lecture seule d'un objet possédé (stats/règles), ouverte
// au clic depuis le récapitulatif "en un coup d'œil" ou la liste
// d'équipement de la fiche personnage/armurerie.
export function ItemDetailModal({ item: itemBrut, onClose }: Props) {
  const { t, language } = useLanguage();
  const item = translateItem(itemBrut, language);
  return (
    <Modal onClose={onClose}>
      <h3 className="mt-0 mb-0">
        {iconeCategorie(item.categorie) && (
          <Icon name={iconeCategorie(item.categorie)!} style={{ marginRight: '0.4em', color: 'var(--accent)' }} />
        )}
        {item.nom}
      </h3>
      <p className="text-sm text-muted" style={{ marginTop: '0.2rem' }}>
        {libelleCategorie(item.categorie, language)} · {formatCoutItem(item.cout, language)}
      </p>

      {item.stats && <StatGrid stats={item.stats} style={{ marginBottom: '0.6rem' }} />}
      {(item.portee || item.force || item.sauvegarde) && (
        <div className="flex flex-wrap gap-sm" style={{ marginBottom: '0.4rem' }}>
          {item.portee && <span className="badge badge--info">{t('itemDetail.range')} {traduirePortee(item.portee, language)}</span>}
          {item.force && <span className="badge badge--info">{t('itemDetail.strength')} {item.force}</span>}
          {item.sauvegarde && <span className="badge badge--info">{t('itemDetail.save')} {item.sauvegarde}</span>}
        </div>
      )}
      {classeRarete(item.rarete) && (
        <span className={`badge ${classeRarete(item.rarete)}`} style={{ marginBottom: '0.3rem' }}>
          Rare {item.rarete}
        </span>
      )}
      {item.disponibilite && <p className="text-sm text-muted mb-0">{item.disponibilite}</p>}
      {item.resultatSousJetAchat ? (
        <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
          <strong>{item.resultatSousJetAchat.label}</strong> — {item.resultatSousJetAchat.texte}
        </p>
      ) : (
        item.regles_speciales?.map((r) => (
          <p key={r.nom} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
            <strong>{r.nom}</strong> — {r.texte}
          </p>
        ))
      )}
      {item.texte && (
        <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem' }}>
          {item.texte}
        </p>
      )}

      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onClose}>
          {t('itemDetail.close')}
        </button>
      </div>
    </Modal>
  );
}

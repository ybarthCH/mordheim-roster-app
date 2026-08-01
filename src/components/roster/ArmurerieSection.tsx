import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { AchatEquipementModal } from '../personnage/AchatEquipementModal';
import { ItemDetailModal } from '../personnage/ItemDetailModal';
import { iconeCategorie, libelleCategorie, resolveItemDetail, prixVente } from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import { nomAffiche } from '../../utils/profil';
import type { RosterInstance, InventoryEntry, CustomItem, CustomItemOverride } from '../../types/roster';
import type { WarbandCatalog } from '../../types/catalog';
import type { GameRules } from '../../types/rules';
import { useLanguage } from '../../state/useLanguage';
import { translateItem } from '../../i18n/data/items';

type ArmurerieSectionProps = {
  roster: RosterInstance;
  catalogue: WarbandCatalog | undefined;
  inventaireBande: InventoryEntry[];
  rules: GameRules;
  onAchat: (item: ShopItem, coutPaye: number) => void;
  onDonner: (instanceId: string, membreId: string) => void;
  onVendre: (instanceId: string) => void;
  onRetirer: (instanceId: string) => void;
  onObjetsPersonnalisesChange: (objets: CustomItem[]) => void;
  onObjetsSurchargesChange: (surcharges: Record<string, CustomItemOverride>) => void;
};

export function ArmurerieSection({
  roster,
  catalogue,
  inventaireBande,
  rules,
  onAchat,
  onDonner,
  onVendre,
  onRetirer,
  onObjetsPersonnalisesChange,
  onObjetsSurchargesChange,
}: ArmurerieSectionProps) {
  const { t, language } = useLanguage();
  const [modalAchat, setModalAchat] = useState(false);
  const [itemDetail, setItemDetail] = useState<InventoryEntry | null>(null);
  const [venteEnCours, setVenteEnCours] = useState<InventoryEntry | null>(null);

  const nomAfficheItem = (entree: InventoryEntry): string =>
    catalogue ? translateItem(resolveItemDetail(entree, catalogue.id, rules), language).nom : entree.nom;

  return (
    <>
    <CollapsibleCard
      preferenceKey="ui.roster.armurerie.ouvert"
      title={
        <>
          <Icon name="coffre" style={{ marginRight: '0.35em' }} />
          {t('armurerie.title')}
        </>
      }
      actions={
        <button className="btn btn--sm btn--primary" onClick={() => setModalAchat(true)}>
          {t('armurerie.buy')}
        </button>
      }
    >
      {roster.stock.length === 0 && <p className="text-muted text-sm">{t('armurerie.emptyStock')}</p>}
      {roster.stock.map((entree) => (
        <div key={entree.instance_id} className="list-item">
          <div
            className="list-item__main"
            role="button"
            style={{ cursor: 'pointer' }}
            onClick={() => setItemDetail(entree)}
          >
            <div className="list-item__title" style={{ textDecoration: 'underline' }}>
              {nomAfficheItem(entree)}
            </div>
            <div className="list-item__subtitle">
              {iconeCategorie(entree.categorie) && (
                <Icon name={iconeCategorie(entree.categorie)!} style={{ marginRight: '0.35em' }} />
              )}
              {libelleCategorie(entree.categorie, language)} · {entree.cout} {t('creation.gc')}
              {entree.cout_notation ? ` (${t('armurerie.rollNotationPrefix')} ${entree.cout_notation})` : ''}
            </div>
          </div>
          <div className="flex gap-sm items-center">
            <select value="" onChange={(e) => e.target.value && onDonner(entree.instance_id, e.target.value)}>
              <option value="">{t('armurerie.giveTo')}</option>
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
              title={t('armurerie.sellTitle', { prix: prixVente(entree.cout) })}
            >
              {t('armurerie.sell')}
            </button>
            <button
              className="btn--ghost"
              style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem', color: 'var(--danger)' }}
              onClick={() => onRetirer(entree.instance_id)}
              title={t('armurerie.removeTitle')}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </CollapsibleCard>

      {modalAchat && catalogue && (
        <AchatEquipementModal
          catalogue={catalogue}
          profil={null}
          tresorerie={roster.tresorerie}
          inventaireBande={inventaireBande}
          objetsPersonnalises={roster.objets_personnalises}
          objetsSurcharges={roster.objets_surcharges}
          onObjetsPersonnalisesChange={onObjetsPersonnalisesChange}
          onObjetsSurchargesChange={onObjetsSurchargesChange}
          onClose={() => setModalAchat(false)}
          onAchat={onAchat}
        />
      )}
      {itemDetail && catalogue && (
        <ItemDetailModal
          item={resolveItemDetail(itemDetail, catalogue.id, rules)}
          onClose={() => setItemDetail(null)}
        />
      )}
      {venteEnCours && (
        <Modal onClose={() => setVenteEnCours(null)}>
          <h3>
            {t('armurerie.sellConfirmTitlePrefix')} {nomAfficheItem(venteEnCours)} ?
          </h3>
          <p className="text-muted">
            {t('armurerie.sellConfirmBody', { prix: prixVente(venteEnCours.cout) })}
          </p>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setVenteEnCours(null)}>
              {t('roster.cancel')}
            </button>
            <button
              className="btn btn--primary"
              onClick={() => {
                onVendre(venteEnCours.instance_id);
                setVenteEnCours(null);
              }}
            >
              {t('armurerie.sellForPrefix')} {prixVente(venteEnCours.cout)} {t('creation.gc')}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

import { Icon } from '../common/Icon';
import { iconeCategorie, inventaireGroupeMismatch, libelleCategorie, prixVente } from '../../utils/shop';
import { getItem } from '../../data/items';
import type { InventoryEntry, Member } from '../../types/roster';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { useLanguage } from '../../state/useLanguage';
import { translateItem } from '../../i18n/data/items';

type EquipementCardProps = {
  membre: Member;
  inventaireGroupe: { entree: InventoryEntry; quantite: number }[];
  onOpenAchat: () => void;
  // Faux quand le profil de ce membre n'a structurellement rien à acheter
  // (ex : animal sans équipement propre — voir profilPeutAcheterEquipement,
  // utils/shop.ts) — grise le bouton plutôt que de le masquer, pour que le
  // joueur comprenne que c'est voulu et pas un bug d'affichage.
  peutAcheter: boolean;
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
  peutAcheter,
  onItemClick,
  onRenvoyer,
  onVendre,
  onRetirer,
  verrouille = false,
}: EquipementCardProps) {
  const { t, language } = useLanguage();
  return (
    <CollapsibleCard
      preferenceKey="ui.personnage.equipement.ouvert"
      title={
        <>
          <Icon name="epeePack" style={{ marginRight: '0.35em' }} />
          {t('equipementCard.title')}
        </>
      }
      actions={
        !verrouille && (
          <button
            className="btn--pack-pill-sm"
            onClick={onOpenAchat}
            disabled={!peutAcheter}
            title={peutAcheter ? undefined : t('equipementCard.buyDisabledTitle')}
          >
            {t('equipementCard.buy')}
          </button>
        )
      }
    >
      {verrouille && (
        <p className="text-sm">
          {membre.equipement || t('equipementCard.noEquipment')}
          <br />
          <span className="text-muted">{t('equipementCard.contractEquipmentNote')}</span>
        </p>
      )}
      {inventaireGroupeMismatch(membre) && (
        <p className="text-sm text-danger" style={{ marginTop: 0 }}>
          ⚠ {t('equipementCard.mismatchWarning', { taille: membre.taille_groupe })}
        </p>
      )}
      {/* Le `title` du bouton "+ Acheter" grisé (survol souris uniquement)
          n'est pas accessible au tactile ni au clavier — répété ici en texte
          toujours visible, sur le même principe que contractEquipmentNote
          ci-dessus pour l'équipement de contrat verrouillé. */}
      {!verrouille && !peutAcheter && (
        <p className="text-muted text-sm" style={{ marginTop: 0 }}>
          {t('equipementCard.buyDisabledTitle')}
        </p>
      )}
      {!verrouille && inventaireGroupe.length === 0 && <p className="text-muted text-sm">{t('equipementCard.noItemsBought')}</p>}
      {!verrouille && inventaireGroupe.map(({ entree, quantite }) => {
        // Une mutation/bénédiction modifie les caractéristiques à l'achat de
        // façon permanente (voir ShopItem.stats_delta) : elle ne peut ni être
        // revendue, ni transférée au stock de la bande, seulement supprimée
        // (perdue/détruite) sans annuler son effet sur les stats.
        const itemRef = getItem(entree.item_id);
        const modificationPermanente = !!itemRef && 'stats_delta' in itemRef && !!itemRef.stats_delta;
        const nomAffiche = itemRef ? translateItem(itemRef, language).nom : entree.nom;
        return (
        <div key={entree.instance_id} className="list-item">
          <div className="list-item__main" role="button" style={{ cursor: 'pointer' }} onClick={() => onItemClick(entree)}>
            <div className="list-item__title" style={{ textDecoration: 'underline' }}>
              {nomAffiche}
              {quantite > 1 ? ` ×${quantite}` : ''}
            </div>
            <div className="list-item__subtitle">
              {iconeCategorie(entree.categorie) && (
                <Icon name={iconeCategorie(entree.categorie)!} style={{ marginRight: '0.35em' }} />
              )}
              {libelleCategorie(entree.categorie, language)} · {entree.cout} {t('creation.gc')}
              {quantite > 1 ? ` ${t('equipementCard.perModelSuffix')} (${entree.cout * quantite} ${t('equipementCard.totalSuffix')})` : ''}
              {entree.cout_notation ? ` (${t('equipementCard.rollNotationPrefix')} ${entree.cout_notation})` : ''}
            </div>
          </div>
          <div className="list-item__actions">
            {!modificationPermanente && (
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem' }}
                onClick={() => onRenvoyer(entree.instance_id)}
                title={t('equipementCard.returnToStockOneTitle')}
              >
                ↩
              </button>
            )}
            {!modificationPermanente && (
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', padding: '0.2rem 0.4rem' }}
                onClick={() => onVendre(entree)}
                title={t('equipementCard.sellTitle', { prix: prixVente(entree.cout) })}
              >
                {t('equipementCard.sell')}
              </button>
            )}
            <button
              className="btn--ghost-danger"
              onClick={() => onRetirer(entree.instance_id)}
              title={t('equipementCard.removeOneTitle')}
            >
              <Icon name="croixPack" />
            </button>
          </div>
        </div>
        );
      })}
    </CollapsibleCard>
  );
}

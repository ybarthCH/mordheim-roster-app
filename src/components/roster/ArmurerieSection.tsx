import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { AchatEquipementModal } from '../personnage/AchatEquipementModal';
import { ItemDetailModal } from '../personnage/ItemDetailModal';
import {
  iconeCategorie,
  libelleCategorie,
  resolveItemDetail,
  prixVente,
  armeArmureUtilisableSansEntrainement,
  objetAutorisePourHommeDeMain,
} from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import { nomAffiche, resolveProfil } from '../../utils/profil';
import type { RosterInstance, InventoryEntry, CustomItem, CustomItemOverride, Member } from '../../types/roster';
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
  // Le bouton d'ouverture ("+ Acheter") a été déplacé à côté de
  // "Recruter"/"Assistant post-bataille" (voir RosterScreen.top-actions) —
  // la modale reste ici puisque c'est elle qui connaît le contexte
  // armurerie (inventaireBande, objets personnalisés...), seul l'état
  // d'ouverture est piloté par le parent.
  modalAchatOuvert: boolean;
  onFermerAchat: () => void;
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
  modalAchatOuvert,
  onFermerAchat,
}: ArmurerieSectionProps) {
  const { t, language } = useLanguage();
  const [itemDetail, setItemDetail] = useState<InventoryEntry | null>(null);
  const [venteEnCours, setVenteEnCours] = useState<InventoryEntry | null>(null);

  const nomAfficheItem = (entree: InventoryEntry): string =>
    catalogue ? translateItem(resolveItemDetail(entree, catalogue.id, rules), language).nom : entree.nom;

  // Un guerrier ne peut recevoir depuis l'armurerie que ce qu'il sait déjà
  // utiliser (voir armeArmureUtilisableSansEntrainement) ni un objet du
  // chapitre "Objets Divers" que son profil ne peut pas porter (voir
  // objetAutorisePourHommeDeMain) : contrairement à l'achat, transférer un
  // objet déjà en stock équivaut à l'équiper directement, donc ces mêmes
  // restrictions s'appliquent — sans quoi acheter en stock (non restreint,
  // aucun porteur désigné) puis "Donner à" contournerait le filtre appliqué
  // à l'achat direct côté personnage.
  const membresEligibles = (entree: InventoryEntry): Member[] =>
    roster.membres.filter((m) => {
      const profil = resolveProfil(roster, m, catalogue, language) ?? null;
      return (
        armeArmureUtilisableSansEntrainement(
          entree.item_id,
          entree.categorie,
          catalogue,
          profil,
          m.competences_acquises
        ) && objetAutorisePourHommeDeMain(catalogue?.id, profil, entree.item_id, entree.categorie)
      );
    });

  return (
    <>
    <CollapsibleCard
      preferenceKey="ui.roster.armurerie.ouvert"
      title={
        <>
          <Icon name="coffrePack" style={{ marginRight: '0.35em' }} />
          {t('armurerie.title')}
        </>
      }
    >
      {roster.stock.length === 0 && <p className="text-muted text-sm">{t('armurerie.emptyStock')}</p>}
      {roster.stock.map((entree) => {
        // Calculé une seule fois par ligne plutôt qu'à chaque usage
        // (disabled, title, options) : membresEligibles refiltre tout
        // roster.membres avec un resolveProfil par figurine à chaque appel.
        const eligibles = membresEligibles(entree);
        return (
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
          <div className="list-item__actions">
            <select
              value=""
              disabled={eligibles.length === 0}
              title={eligibles.length === 0 ? t('armurerie.noEligibleRecipient') : undefined}
              onChange={(e) => e.target.value && onDonner(entree.instance_id, e.target.value)}
            >
              <option value="">{t('armurerie.giveTo')}</option>
              {eligibles.map((m) => (
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
              className="btn--ghost-danger"
              onClick={() => onRetirer(entree.instance_id)}
              title={t('armurerie.removeTitle')}
            >
              <Icon name="croixPack" />
            </button>
          </div>
        </div>
        );
      })}
    </CollapsibleCard>

      {modalAchatOuvert && catalogue && (
        <AchatEquipementModal
          catalogue={catalogue}
          profil={null}
          tresorerie={roster.tresorerie}
          inventaireBande={inventaireBande}
          roster={roster}
          objetsPersonnalises={roster.objets_personnalises}
          objetsSurcharges={roster.objets_surcharges}
          onObjetsPersonnalisesChange={onObjetsPersonnalisesChange}
          onObjetsSurchargesChange={onObjetsSurchargesChange}
          onClose={onFermerAchat}
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

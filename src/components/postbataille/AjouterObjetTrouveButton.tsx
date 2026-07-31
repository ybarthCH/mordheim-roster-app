import { useState } from 'react';
import { itemVersShopItem } from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import type { LigneObjetTrouve } from '../../data/tableExplorationEvenements';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  ligneObjet: LigneObjetTrouve;
  catalogueId: string;
  onAjouter: (item: ShopItem, quantite: number) => void;
};

// Bouton d'ajout direct au stock pour un objet trouvé lors d'un événement
// d'exploration (voir tableExplorationEvenements.ts LigneObjetTrouve) —
// évite de rouvrir la liste d'achat pour retrouver l'objet correspondant.
// Quantité fixe : un clic suffit. Quantité en dés (ex : "D3") : reprend le
// motif de JetOrButton (jet fait sur table papier, jamais lancé par l'app).
export function AjouterObjetTrouveButton({ ligneObjet, catalogueId, onAjouter }: Props) {
  const { t } = useLanguage();
  const item = itemVersShopItem(ligneObjet.item_id, catalogueId);
  const [jet, setJet] = useState('');
  // Se verrouille après ajout, comme JetOrButton : sans ça rien n'empêchait
  // de recliquer et d'ajouter le même objet trouvé plusieurs fois au stock.
  const [ajoute, setAjoute] = useState(false);

  if (!item) return null;

  if (ajoute) {
    return (
      <p className="text-sm text-success" style={{ marginTop: '0.5rem' }}>
        {t('postBataille.itemAddedToStock', { nom: item.nom })}
      </p>
    );
  }

  if (typeof ligneObjet.quantite !== 'string') {
    const quantite = ligneObjet.quantite ?? 1;
    return (
      <button
        type="button"
        className="btn btn--sm btn--primary"
        style={{ marginTop: '0.5rem', marginRight: '0.5rem' }}
        onClick={() => {
          onAjouter(item, quantite);
          setAjoute(true);
        }}
      >
        {t('postBataille.addItemToStock', { nom: item.nom, suffix: quantite > 1 ? ` ×${quantite}` : '' })}
      </button>
    );
  }

  const valeur = Number(jet);
  const valide = jet.trim() !== '' && Number.isFinite(valeur) && valeur > 0;

  return (
    <div className="flex gap-sm items-center" style={{ marginTop: '0.5rem', flexWrap: 'wrap' }}>
      <span className="text-sm text-muted">
        {t('postBataille.rollForItem', { notation: ligneObjet.quantite, nom: item.nom })}
      </span>
      <input type="number" min={1} style={{ width: '4rem' }} value={jet} onChange={(e) => setJet(e.target.value)} />
      <button
        type="button"
        className="btn btn--sm btn--primary"
        disabled={!valide}
        onClick={() => {
          onAjouter(item, valeur);
          setAjoute(true);
        }}
      >
        {t('postBataille.addToStock')}
      </button>
    </div>
  );
}

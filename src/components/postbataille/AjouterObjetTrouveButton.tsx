import { useState } from 'react';
import { itemVersShopItem } from '../../utils/shop';
import type { ShopItem } from '../../utils/shop';
import type { LigneObjetTrouve } from '../../data/tableExplorationEvenements';
import { useLanguage } from '../../state/useLanguage';
import { useGameRules } from '../../state/useGameRules';
import { translateItem } from '../../i18n/data/items';

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
// Objet à sous-jet d'achat (ex : Carte de Mordheim) : le résultat doit être
// choisi AVANT l'ajout (même motif que AchatEquipementModal, qui gère ce
// même champ pour un achat normal) — sans ça, le sous-jet obtenu sur table
// papier était perdu, l'objet ajouté « vierge » sans son résultat.
export function AjouterObjetTrouveButton({ ligneObjet, catalogueId, onAjouter }: Props) {
  const { t, language } = useLanguage();
  const { rules } = useGameRules();
  const item = itemVersShopItem(ligneObjet.item_id, catalogueId, rules);
  const itemAffiche = item ? translateItem(item, language) : null;
  const [jet, setJet] = useState('');
  const [resultatSousJetAchat, setResultatSousJetAchat] = useState<{
    jet: number;
    optionIndex: number;
    label: string;
    texte: string;
  } | null>(null);
  // Se verrouille après ajout, comme JetOrButton : sans ça rien n'empêchait
  // de recliquer et d'ajouter le même objet trouvé plusieurs fois au stock.
  const [ajoute, setAjoute] = useState(false);

  if (!item) return null;

  if (ajoute) {
    return (
      <p className="text-sm text-success" style={{ marginTop: '0.5rem' }}>
        {t('postBataille.itemAddedToStock', { nom: itemAffiche!.nom })}
      </p>
    );
  }

  if (item.sous_jet_achat && !resultatSousJetAchat) {
    const choisir = (valeur: number) => {
      const optionIndex = item.sous_jet_achat!.options.findIndex((o) => o.valeurs.includes(valeur));
      if (optionIndex < 0) return;
      const option = item.sous_jet_achat!.options[optionIndex];
      setResultatSousJetAchat({ jet: valeur, optionIndex, label: option.label, texte: option.texte });
    };
    return (
      <div style={{ marginTop: '0.5rem' }}>
        <p className="text-sm" style={{ fontWeight: 600, marginBottom: '0.3rem' }}>
          {t('achatEquipement.rollResultTitle')}
        </p>
        <div className="flex flex-wrap gap-sm">
          {[1, 2, 3, 4, 5, 6].map((valeur) => (
            <button key={valeur} type="button" className="btn--pack-pill-sm" onClick={() => choisir(valeur)}>
              {valeur}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const itemResolu: ShopItem = resultatSousJetAchat ? { ...item, resultatSousJetAchat } : item;

  if (typeof ligneObjet.quantite !== 'string') {
    const quantite = ligneObjet.quantite ?? 1;
    return (
      <button
        type="button"
        className="btn--pack-pill-sm btn--pack-pill-sm--primary"
        style={{ marginTop: '0.5rem', marginRight: '0.5rem' }}
        onClick={() => {
          onAjouter(itemResolu, quantite);
          setAjoute(true);
        }}
      >
        {t('postBataille.addItemToStock', { nom: itemAffiche!.nom, suffix: quantite > 1 ? ` ×${quantite}` : '' })}
      </button>
    );
  }

  const valeur = Number(jet);
  const valide = jet.trim() !== '' && Number.isFinite(valeur) && valeur > 0;

  return (
    <div className="flex gap-sm items-center" style={{ marginTop: '0.5rem', flexWrap: 'wrap' }}>
      <span className="text-sm text-muted">
        {t('postBataille.rollForItem', { notation: ligneObjet.quantite, nom: itemAffiche!.nom })}
      </span>
      <input type="number" min={1} style={{ width: '4rem' }} value={jet} onChange={(e) => setJet(e.target.value)} />
      <button
        type="button"
        className="btn--pack-pill-sm btn--pack-pill-sm--primary"
        disabled={!valide}
        onClick={() => {
          onAjouter(itemResolu, valeur);
          setAjoute(true);
        }}
      >
        {t('postBataille.addToStock')}
      </button>
    </div>
  );
}

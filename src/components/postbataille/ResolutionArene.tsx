import { useState } from 'react';
import type { ShopItem } from '../../utils/shop';
import { AjouterObjetTrouveButton } from './AjouterObjetTrouveButton';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  // Nom traduit de l'événement (voir evenementAffiche dans EvenementExploration),
  // utilisé comme préfixe des entrées de journal ci-dessous.
  nomEvenement: string;
  catalogueId: string;
  onAjouterOr: (montant: number) => void;
  onAjouterObjet: (nomLigne: string, item: ShopItem, quantite: number) => void;
  onAjouterAuJournal: (texte: string) => void;
};

// (5 5 5) Arène — décision libre (pas un jet) : vendre le manuel
// d'entraînement pour 100 CO, ou le garder. « Garder » l'ajoute au stock de
// la bande comme tout autre objet trouvé à l'exploration (voir
// AjouterObjetTrouveButton) — pas de sélecteur de héros ici : le joueur le
// transfère ensuite au héros de son choix via le transfert d'inventaire
// habituel, exactement comme pour n'importe quelle arme ou armure trouvée.
export function ResolutionArene({ nomEvenement, catalogueId, onAjouterOr, onAjouterObjet, onAjouterAuJournal }: Props) {
  const { t } = useLanguage();
  const [garder, setGarder] = useState(false);
  const [resolu, setResolu] = useState<string | null>(null);

  const vendre = () => {
    onAjouterOr(100);
    const texte = t('postBataille.arena.sold');
    onAjouterAuJournal(`${nomEvenement} : ${texte}`);
    setResolu(texte);
  };

  if (resolu) {
    return (
      <p className="text-sm text-success" style={{ marginTop: '0.6rem' }}>
        {t('postBataille.arena.result', { texte: resolu })}
      </p>
    );
  }

  return (
    <div style={{ marginTop: '0.6rem' }}>
      <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
        <button type="button" className="btn--pack-pill-sm" onClick={vendre}>
          {t('postBataille.arena.sellFor100')}
        </button>
        <button
          type="button"
          className={`btn--pack-pill-sm ${garder ? 'btn--pack-pill-sm--primary' : ''}`}
          onClick={() => setGarder(true)}
        >
          {t('postBataille.arena.keep')}
        </button>
      </div>
      {garder && (
        <div style={{ marginTop: '0.5rem' }}>
          <AjouterObjetTrouveButton
            ligneObjet={{ item_id: 'manuel_entrainement' }}
            catalogueId={catalogueId}
            onAjouter={(item, quantite) => {
              onAjouterObjet(t('postBataille.arena.keepLabel'), item, quantite);
              setResolu(t('postBataille.arena.kept'));
            }}
          />
        </div>
      )}
    </div>
  );
}

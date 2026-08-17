import { useState } from 'react';
import type { LigneTresorConditionnel } from '../../data/tableExplorationEvenements';
import type { ShopItem } from '../../utils/shop';
import { JetOrButton } from './JetOrButton';
import { AjouterObjetTrouveButton } from './AjouterObjetTrouveButton';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  ligne: LigneTresorConditionnel;
  // Libellé traduit de `ligne.element`, utilisé pour l'affichage et transmis
  // aux callbacks ci-dessous (elles finissent consignées dans le journal
  // post-bataille, qui doit donc rester dans la langue active). Absent =
  // retombe sur `ligne.element` tel quel (français).
  elementAffiche?: string;
  catalogueId: string;
  onAjouterOr: (nomLigne: string, notation: string, valeur: number) => void;
  onAjouterObjet: (nomLigne: string, item: ShopItem, quantite: number) => void;
  onAjouterFragments: (nomLigne: string, notation: string, valeur: number) => void;
  onOuvrirArtefacts: () => void;
};

// Une ligne de sous-table "trésor" (Trésor caché, Bande massacrée) : chaque
// élément est indépendant, avec son propre seuil de réussite ("Auto" =
// toujours obtenu). Le joueur fait le jet de seuil sur table papier ; un
// clic sur "Jet réussi" révèle ensuite le contrôle d'ajout adapté à la
// récompense (or/objet/fragments/artefact), sur le même principe que les
// autres tableaux d'exploration.
export function LigneTresorRow({
  ligne,
  elementAffiche,
  catalogueId,
  onAjouterOr,
  onAjouterObjet,
  onAjouterFragments,
  onOuvrirArtefacts,
}: Props) {
  const { t } = useLanguage();
  const [reussi, setReussi] = useState(ligne.seuil.trim().toLowerCase() === 'auto');
  const nomLigne = elementAffiche ?? ligne.element;

  return (
    <tr>
      <td>{elementAffiche ?? ligne.element}</td>
      <td>{ligne.seuil}</td>
      <td>
        {!reussi ? (
          <button type="button" className="btn btn--sm" onClick={() => setReussi(true)}>
            {t('postBataille.rollSucceeded')}
          </button>
        ) : (
          <div className="flex gap-sm items-center" style={{ flexWrap: 'wrap' }}>
            {ligne.or && (
              <JetOrButton
                label={t('postBataille.rollNotation', { notation: ligne.or })}
                boutonLabel={t('postBataille.add')}
                onValider={(valeur) => onAjouterOr(nomLigne, ligne.or!, valeur)}
              />
            )}
            {ligne.fragments && (
              <JetOrButton
                label={t('postBataille.rollNotation', { notation: ligne.fragments })}
                boutonLabel={t('postBataille.addAsWyrdstone')}
                onValider={(valeur) => onAjouterFragments(nomLigne, ligne.fragments!, valeur)}
              />
            )}
            {ligne.objets?.map((objet, i) => (
              <AjouterObjetTrouveButton
                key={i}
                ligneObjet={objet}
                catalogueId={catalogueId}
                onAjouter={(item, quantite) => onAjouterObjet(nomLigne, item, quantite)}
              />
            ))}
            {ligne.artefactMagique && (
              <button type="button" className="btn btn--sm" onClick={onOuvrirArtefacts}>
                {t('postBataille.openMagicArtefactsTable')}
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

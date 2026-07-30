import { useState } from 'react';
import type { LigneTresorConditionnel } from '../../data/tableExplorationEvenements';
import type { ShopItem } from '../../utils/shop';
import { JetOrButton } from './JetOrButton';
import { AjouterObjetTrouveButton } from './AjouterObjetTrouveButton';

type Props = {
  ligne: LigneTresorConditionnel;
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
  catalogueId,
  onAjouterOr,
  onAjouterObjet,
  onAjouterFragments,
  onOuvrirArtefacts,
}: Props) {
  const [reussi, setReussi] = useState(ligne.seuil.trim().toLowerCase() === 'auto');

  return (
    <tr>
      <td>{ligne.element}</td>
      <td>{ligne.seuil}</td>
      <td>
        {!reussi ? (
          <button type="button" className="btn btn--sm" onClick={() => setReussi(true)}>
            Jet réussi
          </button>
        ) : (
          <div className="flex gap-sm items-center" style={{ flexWrap: 'wrap' }}>
            {ligne.or && (
              <JetOrButton
                label={`Jet (${ligne.or}) :`}
                boutonLabel="Ajouter"
                onValider={(valeur) => onAjouterOr(ligne.element, ligne.or!, valeur)}
              />
            )}
            {ligne.fragments && (
              <JetOrButton
                label={`Jet (${ligne.fragments}) :`}
                boutonLabel="Ajouter en wyrdstone"
                onValider={(valeur) => onAjouterFragments(ligne.element, ligne.fragments!, valeur)}
              />
            )}
            {ligne.objets?.map((objet, i) => (
              <AjouterObjetTrouveButton
                key={i}
                ligneObjet={objet}
                catalogueId={catalogueId}
                onAjouter={(item, quantite) => onAjouterObjet(ligne.element, item, quantite)}
              />
            ))}
            {ligne.artefactMagique && (
              <button type="button" className="btn btn--sm" onClick={onOuvrirArtefacts}>
                Ouvrir le Tableau des artefacts magiques
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

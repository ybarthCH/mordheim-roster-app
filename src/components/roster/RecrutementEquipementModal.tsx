import { useState } from 'react';
import { Modal } from '../common/Modal';
import { AchatEquipementModal } from '../personnage/AchatEquipementModal';
import { appliquerAchatSurMembre, inventaireComplet } from '../../utils/shop';
import type { Member, RosterInstance } from '../../types/roster';
import type { Profile, WarbandCatalog } from '../../types/catalog';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  roster: RosterInstance;
  membre: Member;
  profil: Profile;
  catalogue: WarbandCatalog;
  onUpdateRoster: (roster: RosterInstance) => void;
  onDone: () => void;
};

// Proposée juste après un recrutement (roster existant ou création de bande,
// voir RosterScreen et CreationBandeScreen) : plutôt que de forcer un aller
// jusqu'à la fiche personnage pour équiper la recrue, on enchaîne directement
// sur le même shop (AchatEquipementModal) déjà utilisé partout ailleurs.
// AchatEquipementModal se referme après chaque achat (conçu pour un item à la
// fois) — ce petit écran intermédiaire permet donc d'en racheter un autre ou
// de terminer, sans dupliquer sa logique.
export function RecrutementEquipementModal({ roster, membre, profil, catalogue, onUpdateRoster, onDone }: Props) {
  const { t } = useLanguage();
  const [achatOuvert, setAchatOuvert] = useState(false);
  // Toujours relire le membre à jour dans le roster : son inventaire/ses
  // stats peuvent avoir changé après un premier achat.
  const membreActuel = roster.membres.find((m) => m.instance_id === membre.instance_id) ?? membre;

  if (achatOuvert) {
    return (
      <AchatEquipementModal
        catalogue={catalogue}
        profil={profil}
        tresorerie={roster.tresorerie}
        competencesAcquises={membreActuel.competences_acquises}
        marqueId={membreActuel.marque}
        inventaireActuel={membreActuel.inventaire}
        inventaireBande={inventaireComplet(roster)}
        roster={roster}
        tailleGroupe={membreActuel.taille_groupe || 1}
        objetsPersonnalises={roster.objets_personnalises}
        objetsSurcharges={roster.objets_surcharges}
        onObjetsPersonnalisesChange={(objets) => onUpdateRoster({ ...roster, objets_personnalises: objets })}
        onObjetsSurchargesChange={(surcharges) => onUpdateRoster({ ...roster, objets_surcharges: surcharges })}
        onClose={() => setAchatOuvert(false)}
        onAchat={(item, coutPaye) => onUpdateRoster(appliquerAchatSurMembre(roster, membreActuel, item, coutPaye))}
      />
    );
  }

  return (
    <Modal onClose={onDone}>
      <h3>{t('recrutementEquipement.title', { nom: membreActuel.nom_perso })}</h3>
      <p className="text-sm text-muted">{t('recrutementEquipement.hint')}</p>
      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onDone}>
          {t('recrutementEquipement.finish')}
        </button>
        <button className="btn btn--primary" onClick={() => setAchatOuvert(true)}>
          {t('recrutementEquipement.buyEquipment')}
        </button>
      </div>
    </Modal>
  );
}

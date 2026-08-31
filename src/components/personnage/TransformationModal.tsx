import type { RosterInstance } from '../../types/roster';
import type { Profile, WarbandCatalog } from '../../types/catalog';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../state/useLanguage';

type Props = {
  roster: RosterInstance;
  profil: Profile;
  catalogue: WarbandCatalog;
  onClose: () => void;
  onConfirm: () => void;
};

// Confirmation de transformation payante vers un AUTRE profil de la même
// bande (voir Profile.transformation, ex : Pti'mek -> Orque Noir des Orques
// Noirs) — même schéma que OptionSorcierModal (upgrade payant confirmé
// depuis la fiche du personnage), mais sans choix à faire : la cible est
// fixée par les données, seule la confirmation reste à donner.
export function TransformationModal({ roster, profil, catalogue, onClose, onConfirm }: Props) {
  const { t } = useLanguage();
  const transformation = profil.transformation;
  const cible = catalogue.profils.find((p) => p.id === transformation?.cible);
  const cout = transformation?.cout ?? 0;
  const budgetSuffisant = cout <= roster.tresorerie;

  if (!transformation || !cible) return null;

  const confirmer = () => {
    if (!budgetSuffisant) return;
    onConfirm();
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="mt-0">{t('transformation.title', { nom: cible.nom })}</h3>
      <p className="text-sm text-muted">{t('transformation.body', { nom: cible.nom, cout })}</p>
      {!budgetSuffisant && (
        <p className="text-danger text-sm">
          {t('transformation.insufficientTreasury', { disponible: roster.tresorerie, requis: cout })}
        </p>
      )}
      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onClose}>
          {t('transformation.cancel')}
        </button>
        <button className="btn btn--primary" disabled={!budgetSuffisant} onClick={confirmer}>
          {t('transformation.confirm', { cout })}
        </button>
      </div>
    </Modal>
  );
}

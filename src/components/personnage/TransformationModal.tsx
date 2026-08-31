import type { RosterInstance } from '../../types/roster';
import type { Profile, WarbandCatalog } from '../../types/catalog';
import { transformationEstDepart } from '../../utils/profil';
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
// fixée par les données, seule la confirmation reste à donner. Si la cible
// (profil `bloque_si_profil_vivant`) est déjà occupée par un autre membre
// vivant de la bande (ex : la bande a déjà un Enfant du Chaos), la
// confirmation devient un simple retrait de la bande plutôt qu'un swap de
// profil — voir transformationEstDepart et transformerProfil
// (PersonnageScreen.tsx).
export function TransformationModal({ roster, profil, catalogue, onClose, onConfirm }: Props) {
  const { t } = useLanguage();
  const transformation = profil.transformation;
  const cible = catalogue.profils.find((p) => p.id === transformation?.cible);
  const depart = transformationEstDepart(profil, roster);
  const cout = depart ? 0 : (transformation?.cout ?? 0);
  const budgetSuffisant = cout <= roster.tresorerie;

  if (!transformation || !cible) return null;

  const confirmer = () => {
    if (!budgetSuffisant) return;
    onConfirm();
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="mt-0">{depart ? t('transformation.departTitle') : t('transformation.title', { nom: cible.nom })}</h3>
      <p className="text-sm text-muted">
        {depart ? t('transformation.departBody', { nom: cible.nom }) : t('transformation.body', { nom: cible.nom, cout })}
      </p>
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
          {depart ? t('transformation.departConfirm') : t('transformation.confirm', { cout })}
        </button>
      </div>
    </Modal>
  );
}

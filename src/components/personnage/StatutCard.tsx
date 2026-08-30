import { useEffect, useRef, useState } from 'react';
import { Icon } from '../common/Icon';
import { Avatar } from '../common/Avatar';
import { PhotoCropModal } from '../common/PhotoCropModal';
import { STATUTS } from '../../types/roster';
import type { Member, Statut } from '../../types/roster';
import type { Profile } from '../../types/catalog';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../state/useLanguage';

type StatutCardProps = {
  membre: Member;
  profil: Profile;
  rating: number;
  ratingEstPowerValue?: boolean;
  ratingTooltip?: string;
  estGroupeSimplifie: boolean;
  onMajMembre: (partial: Partial<Member>) => void;
  // toursBlesse n'est renseigné que pour le statut "blesse" (voir dialog
  // ci-dessous) : nombre de tours (post-batailles) avant rétablissement.
  onChangerStatut: (s: Statut, toursBlesse?: number) => void;
  onOpenRecruterGroupe: () => void;
  // Statut spécial "Squig Entraîné" (voir Profile.designation_entrainee) —
  // absent si ce profil n'en propose pas.
  designationEntrainee?: {
    estDesigne: boolean;
    peutEtreDesigne: boolean;
    doitEtreRetire: boolean;
    onDesigner: () => void;
    onRetirer: () => void;
  };
};

export function StatutCard({
  membre,
  profil,
  rating,
  ratingEstPowerValue,
  ratingTooltip,
  estGroupeSimplifie,
  onMajMembre,
  onChangerStatut,
  onOpenRecruterGroupe,
  designationEntrainee,
}: StatutCardProps) {
  const { t } = useLanguage();
  const estFrancTireur = !!(membre.franc_tireur_id || membre.profil_custom);
  // Saisie gardée en texte brut : un input contrôlé par un number forcerait
  // la valeur dès l'effacement (impossible de vider le champ pour retaper un
  // chiffre) — la conversion/le plancher ne s'appliquent qu'à l'usage, la
  // valeur n'est répercutée sur le membre que si elle est valide.
  const [tailleGroupeSaisie, setTailleGroupeSaisie] = useState(String(membre.taille_groupe));
  // Resynchronise la saisie au changement de personnage ou lorsqu'une autre
  // action modifie la taille du groupe. Une valeur temporairement vide ne
  // modifie pas membre.taille_groupe et reste donc éditable jusqu'au blur.
  useEffect(() => {
    setTailleGroupeSaisie(String(membre.taille_groupe));
  }, [membre.instance_id, membre.taille_groupe]);

  // Même principe pour le nom : un input contrôlé directement par
  // `membre.nom_perso` faisait sauter le curseur à chaque frappe, car
  // onMajMembre passe par updateRoster (écriture IndexedDB asynchrone, voir
  // RostersContext) — la prop ne se met à jour qu'après ce aller-retour, et
  // React réaffecte alors `.value` en retard sur ce que le clavier vient
  // d'insérer, ce qui déplace le curseur. Une saisie locale, synchronisée
  // uniquement au changement de personnage (jamais sur nom_perso lui-même,
  // qui n'est modifié que par cet input), garde l'affichage instantané et le
  // curseur stable tout en continuant à sauvegarder à chaque frappe.
  const [nomSaisi, setNomSaisi] = useState(membre.nom_perso);
  useEffect(() => {
    setNomSaisi(membre.nom_perso);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membre.instance_id]);

  // Même motif pour les compteurs de tours blessé : un input contrôlé
  // directement par le number empêche de vider le champ pour retaper une
  // valeur à plusieurs chiffres. Resynchronisé aussi sur la valeur elle-même
  // (décomptée automatiquement en post-bataille), comme tailleGroupeSaisie.
  const [tourActuelSaisi, setTourActuelSaisi] = useState(String(membre.blesse_tour_actuel));
  useEffect(() => {
    setTourActuelSaisi(String(membre.blesse_tour_actuel));
  }, [membre.instance_id, membre.blesse_tour_actuel]);
  const [tourTotalSaisi, setTourTotalSaisi] = useState(String(membre.blesse_tour_total));
  useEffect(() => {
    setTourTotalSaisi(String(membre.blesse_tour_total));
  }, [membre.instance_id, membre.blesse_tour_total]);

  const statutsDisponibles = estGroupeSimplifie ? STATUTS.filter((s) => s.id === 'actif' || s.id === 'mort') : STATUTS;

  // Passage au statut Blessé : demande le nombre de tours (post-batailles)
  // avant rétablissement plutôt que de laisser 0/0 à compléter à la main —
  // voir onChangerStatut('blesse', n) et le décompte automatique en
  // post-bataille (PostBatailleScreen.terminer).
  const [modalBlesseOuvert, setModalBlesseOuvert] = useState(false);
  const [toursSaisis, setToursSaisis] = useState('2');

  // Photo de la figurine : la modale de gestion (voir plus bas) montre la
  // photo en plus grand avec Changer/Supprimer, ou directement un bouton
  // d'ajout si aucune n'est encore renseignée. Changer déclenche le
  // sélecteur de fichier natif puis ouvre PhotoCropModal sur le fichier
  // choisi — la modale de gestion se referme entre-temps pour ne pas
  // superposer deux modales.
  const [gestionPhotoOuverte, setGestionPhotoOuverte] = useState(false);
  const [fichierACrop, setFichierACrop] = useState<File | null>(null);
  const inputFichierRef = useRef<HTMLInputElement>(null);
  // Second input dédié à la capture caméra : `capture` force l'ouverture
  // directe de l'appareil photo sur mobile (au lieu du sélecteur de
  // fichiers) — inutile de le partager avec inputFichierRef puisque cet
  // attribut changerait aussi le comportement du bouton "Depuis un fichier".
  const inputCameraRef = useRef<HTMLInputElement>(null);

  const choisirFichier = () => inputFichierRef.current?.click();
  const prendrePhoto = () => inputCameraRef.current?.click();
  const onFichierChoisi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFichierACrop(f);
      setGestionPhotoOuverte(false);
    }
    e.target.value = '';
  };
  const confirmerCrop = (dataUrl: string) => {
    onMajMembre({ photo: dataUrl });
    setFichierACrop(null);
  };
  const supprimerPhoto = () => {
    onMajMembre({ photo: undefined });
    setGestionPhotoOuverte(false);
  };

  const cliquerStatut = (s: Statut) => {
    if (s === 'blesse' && membre.statut !== 'blesse') {
      setToursSaisis('2');
      setModalBlesseOuvert(true);
      return;
    }
    onChangerStatut(s);
  };

  const confirmerBlesse = () => {
    const n = Math.max(1, parseInt(toursSaisis, 10) || 1);
    onChangerStatut('blesse', n);
    setModalBlesseOuvert(false);
  };

  const estMort = membre.statut === 'mort';

  return (
    <div className={`card${estMort ? ' card--mort' : ''}`}>
      {estMort && (
        <div className="death-plaque" title={membre.date_mort ?? undefined}>
          <Icon name="crane" size="1.5em" />
          {membre.date_mort && <span className="death-plaque__date">{membre.date_mort}</span>}
        </div>
      )}
      <div className="flex justify-between items-center gap-md">
        <span className="avatar-frame">
          <Avatar
            nom={membre.nom_perso}
            photo={membre.photo}
            size={50}
            onClick={() => setGestionPhotoOuverte(true)}
            title={t('avatar.viewTitle', { nom: membre.nom_perso })}
          />
        </span>
        <div style={{ flex: 1, minWidth: 0, paddingRight: estMort ? '4.2rem' : undefined }}>
          <input
            value={nomSaisi}
            onChange={(e) => {
              setNomSaisi(e.target.value);
              onMajMembre({ nom_perso: e.target.value });
            }}
            className="input--heading"
          />
          <p className="text-muted text-sm mb-0">
            {profil.nom} ·{' '}
            {estFrancTireur
              ? t('statutCard.hiredSword')
              : profil.type === 'heros'
                ? t('statutCard.hero')
                : profil.type === 'animal'
                  ? t('statutCard.animal')
                  : t('statutCard.henchman')}
            {membre.promu_heros && t('statutCard.promoted')}
          </p>
        </div>
      </div>

      <div className="status-segmented" style={{ marginTop: '0.7rem' }}>
        {statutsDisponibles.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`status-segmented__option${membre.statut === s.id ? ' status-segmented__option--active' : ''}`}
            onClick={() => cliquerStatut(s.id)}
          >
            {t(`statut.${s.id}`)}
          </button>
        ))}
      </div>

      {membre.statut === 'blesse' && (
        <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
          <span className="text-sm text-muted">{t('statutCard.injured')}</span>
          <input
            type="number"
            className="stat-grid__input stat-grid__input--pv"
            value={tourActuelSaisi}
            onChange={(e) => {
              const raw = e.target.value;
              setTourActuelSaisi(raw);
              const n = Number(raw);
              if (raw.trim() !== '' && Number.isFinite(n) && n >= 0) onMajMembre({ blesse_tour_actuel: n });
            }}
            onBlur={() => setTourActuelSaisi(String(membre.blesse_tour_actuel))}
          />
          <span>/</span>
          <input
            type="number"
            className="stat-grid__input stat-grid__input--pv"
            value={tourTotalSaisi}
            onChange={(e) => {
              const raw = e.target.value;
              setTourTotalSaisi(raw);
              const n = Number(raw);
              if (raw.trim() !== '' && Number.isFinite(n) && n >= 0) onMajMembre({ blesse_tour_total: n });
            }}
            onBlur={() => setTourTotalSaisi(String(membre.blesse_tour_total))}
          />
          <span className="text-sm text-muted">{t('statutCard.turns')}</span>
        </div>
      )}

      <div className="flex items-center gap-sm" style={{ marginTop: '0.7rem' }}>
        <span className="badge badge--info" title={ratingTooltip}>
          {ratingEstPowerValue ? t('statutCard.powerValue') : t('statutCard.rating')} {rating}
        </span>
      </div>

      {estGroupeSimplifie && (
        <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
          <span className="text-sm text-muted">{t('statutCard.group')}</span>
          <input
            type="number"
            min={1}
            className="stat-grid__input stat-grid__input--pv"
            value={tailleGroupeSaisie}
            onChange={(e) => {
              const raw = e.target.value;
              setTailleGroupeSaisie(raw);
              const n = parseInt(raw, 10);
              if (raw.trim() !== '' && n >= 1) onMajMembre({ taille_groupe: n });
            }}
            onBlur={() => setTailleGroupeSaisie(String(membre.taille_groupe))}
          />
          <span className="text-sm text-muted">
            {t('statutCard.model')}
            {membre.taille_groupe > 1 ? 's' : ''} {t('statutCard.identicalModels')}
            {membre.taille_groupe > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {estGroupeSimplifie && (
        <div style={{ marginTop: '0.6rem' }}>
          <button className="btn btn--sm" onClick={onOpenRecruterGroupe}>
            {t('statutCard.recruitInGroup')}
          </button>
        </div>
      )}

      {estGroupeSimplifie && (
        <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
          <span className="text-sm text-muted">{t('statutCard.outOfAction')}</span>
          <button className="btn btn--sm" onClick={() => onMajMembre({ hors_combat: Math.max(0, membre.hors_combat - 1) })}>
            −
          </button>
          <strong>
            {membre.hors_combat} / {membre.taille_groupe}
          </strong>
          <button
            className="btn btn--sm"
            onClick={() => onMajMembre({ hors_combat: Math.min(membre.taille_groupe, membre.hors_combat + 1) })}
          >
            +
          </button>
          {membre.hors_combat > 0 && <span className="text-sm text-muted">{t('statutCard.toResolveNextPostBattle')}</span>}
        </div>
      )}

      {designationEntrainee?.estDesigne && (
        <div className="flex items-center gap-sm" style={{ marginTop: '0.6rem' }}>
          <span className="badge badge--info">{t('statutCard.trainedBadge')}</span>
          {designationEntrainee.doitEtreRetire && (
            <>
              <span className="text-sm text-danger">{t('statutCard.trainedMustBeRemoved')}</span>
              <button className="btn btn--sm btn--danger" onClick={designationEntrainee.onRetirer}>
                {t('statutCard.trainedRemoveButton')}
              </button>
            </>
          )}
        </div>
      )}
      {designationEntrainee?.peutEtreDesigne && (
        <div style={{ marginTop: '0.6rem' }}>
          <button className="btn btn--sm" onClick={designationEntrainee.onDesigner}>
            {t('statutCard.trainedDesignateButton')}
          </button>
        </div>
      )}

      {modalBlesseOuvert && (
        <Modal onClose={() => setModalBlesseOuvert(false)}>
          <h3>{t('statutCard.injuredModalTitle')}</h3>
          <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
            {t('statutCard.injuredModalBody')}
          </p>
          <div className="field">
            <label>{t('statutCard.turnsInjuredLabel')}</label>
            <input
              type="number"
              min={1}
              value={toursSaisis}
              onChange={(e) => setToursSaisis(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => setModalBlesseOuvert(false)}>
              {t('statutCard.cancel')}
            </button>
            <button className="btn btn--primary" onClick={confirmerBlesse}>
              {t('statutCard.confirm')}
            </button>
          </div>
        </Modal>
      )}

      <input
        ref={inputFichierRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onFichierChoisi}
      />

      {gestionPhotoOuverte && (
        <Modal onClose={() => setGestionPhotoOuverte(false)}>
          <h3>{t('photoModal.title')}</h3>
          {membre.photo ? (
            <span className="photo-frame-large">
              <img src={membre.photo} alt="" className="photo-frame-large__img" />
            </span>
          ) : (
            <p className="text-sm text-muted">{t('photoModal.emptyHint')}</p>
          )}
          <div className="flex gap-sm" style={{ marginTop: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {membre.photo ? (
              <>
                <button className="btn" onClick={choisirFichier}>
                  {t('photoModal.change')}
                </button>
                <button className="btn" onClick={prendrePhoto}>
                  <Icon name="photo" style={{ marginRight: '0.35em' }} />
                  {t('photoModal.takePhoto')}
                </button>
                <button className="btn btn--danger" onClick={supprimerPhoto}>
                  {t('photoModal.remove')}
                </button>
              </>
            ) : (
              <>
                <button className="btn btn--primary" onClick={choisirFichier}>
                  {t('photoModal.add')}
                </button>
                <button className="btn" onClick={prendrePhoto}>
                  <Icon name="photo" style={{ marginRight: '0.35em' }} />
                  {t('photoModal.takePhoto')}
                </button>
              </>
            )}
          </div>
        </Modal>
      )}

      <input
        ref={inputCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={onFichierChoisi}
      />

      {fichierACrop && (
        <PhotoCropModal fichier={fichierACrop} onConfirm={confirmerCrop} onCancel={() => setFichierACrop(null)} />
      )}
    </div>
  );
}

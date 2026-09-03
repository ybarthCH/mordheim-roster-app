import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useRosters } from '../../state/useRosters';
import { useLanguage } from '../../state/useLanguage';
import { Screen } from '../common/Screen';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { EquipementReference, MagieReference, FrancsTireursReference } from '../common/CatalogueReference';
import { Icon } from '../common/Icon';
import { getCatalogue } from '../../data/warbands';
import { translateWarbandCatalog } from '../../i18n/data/warbands';
import { resolveProfil } from '../../utils/profil';
import { equipementReferenceAConcerner } from '../../utils/shop';
import { magieDuProfil } from '../../utils/magie';
import { tribuChoisie } from '../../utils/tribu';
import { FRANCS_TIREURS } from '../../data/hiredSwords';

// Page de référence de la bande actuellement parcourue (voir ReferenceButton
// dans le bandeau) : regroupe tout ce qui n'est qu'indicatif — règles
// spéciales, équipement et magie de référence — retiré du Roster de base
// pour ne plus l'encombrer. Règles spéciales en premier (voir demande),
// suivi de l'équipement puis de la magie, dans le même ordre qu'avant sur
// RosterScreen.
export function BandeReferenceScreen() {
  const { id } = useParams<{ id: string }>();
  const { getRosterById } = useRosters();
  const { t, language } = useLanguage();
  const roster = getRosterById(id ?? '');
  const catalogueBrut = getCatalogue(roster?.bande_id ?? '');
  const catalogue = useMemo(
    () => (catalogueBrut ? translateWarbandCatalog(catalogueBrut, language) : catalogueBrut),
    [catalogueBrut, language]
  );

  if (!roster) {
    return (
      <Screen title={t('roster.notFoundTitle')} back="/">
        <p className="text-muted">{t('roster.notFoundBody')}</p>
      </Screen>
    );
  }

  const tribu = catalogue ? tribuChoisie(catalogue, roster) : undefined;
  const membreMarque = catalogue ? roster.membres.find((m) => resolveProfil(roster, m)?.marque_requise) : undefined;
  const profilMarque = membreMarque && catalogue ? resolveProfil(roster, membreMarque, catalogue) : undefined;

  // Reflète exactement ce que rendent EquipementReference/MagieReference
  // (voir equipementReferenceAConcerner et magieDuProfil) plutôt que de
  // relire les champs bruts du catalogue : un objet d'équipement générique
  // (accès commun/rare_N) ou un domaine de magie absent pour la Marque
  // choisie ne doit pas compter comme "il y a quelque chose à afficher" ici
  // alors que la carte correspondante ne rend justement rien.
  const magieResolue = !catalogue
    ? undefined
    : profilMarque
      ? magieDuProfil(catalogue, profilMarque, membreMarque?.marque)
      : catalogue.magie;
  const aDesFrancsTireurs = !!catalogue && FRANCS_TIREURS.some(
    (ft) => !ft.est_dramatis_personae && ft.employeurs.bande_ids.includes(catalogue.id)
  );
  const aRien =
    !catalogue ||
    (catalogue.regles_speciales.length === 0 &&
      !equipementReferenceAConcerner(catalogue) &&
      !magieResolue &&
      !aDesFrancsTireurs);

  return (
    <Screen title={t('bandeReference.title', { nom: roster.nom_bande })} back={`/roster/${roster.id}`}>
      {aRien && <p className="text-muted">{t('bandeReference.empty')}</p>}

      {catalogue && catalogue.regles_speciales.length > 0 && (
        <CollapsibleCard
          preferenceKey="ui.roster.regles_speciales.ouvert"
          className="card card--tight card--titlebar"
          title={
            <>
              <Icon name="grimoirePack" style={{ marginRight: '0.35em' }} />
              {t('roster.specialRules')}
            </>
          }
        >
          {catalogue.regles_speciales.map((r) => (
            <p key={r.nom} className="text-sm" style={{ whiteSpace: 'pre-line' }}>
              <strong>{r.nom}</strong> — {r.texte}
              {r.exception && <span className="text-muted"> ({r.exception})</span>}
            </p>
          ))}
          {catalogue.tribus && catalogue.tribus.length > 0 && (
            <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border)' }}>
              <p className="text-sm mb-0">
                <strong>
                  {t('roster.tribe')} {tribu ? tribu.nom : t('roster.tribeNotSet')}
                </strong>
              </p>
              {tribu ? (
                <p className="text-sm" style={{ whiteSpace: 'pre-line' }}>
                  {tribu.texte}
                </p>
              ) : (
                catalogue.tribus.map((tr) => (
                  <p key={tr.id} className="text-sm" style={{ whiteSpace: 'pre-line' }}>
                    <strong>{tr.nom}</strong> — {tr.texte}
                  </p>
                ))
              )}
            </div>
          )}
        </CollapsibleCard>
      )}

      {catalogue && <EquipementReference catalogue={catalogue} />}
      {catalogue && <MagieReference catalogue={catalogue} profil={profilMarque} marqueId={membreMarque?.marque} />}
      {catalogue && <FrancsTireursReference catalogue={catalogue} roster={roster} />}
    </Screen>
  );
}

import { injuryLabelAffiche } from '../../utils/blessures';
import { resolveItemDetail, resumeItem } from '../../utils/shop';
import { estSorcier, resolveSort } from '../../utils/magie';
import { magieMineure } from '../../i18n/data/minorMagic';
import { CollapsibleCard } from '../common/CollapsibleCard';
import { estFrancTireur } from '../../data/hiredSwords';
import { estDramatisPersonae } from '../../data/dramatisPersonae';
import type { InventoryEntry, Member } from '../../types/roster';
import type { Profile, WarbandCatalog } from '../../types/catalog';
import { useLanguage } from '../../state/useLanguage';
import { translateItem } from '../../i18n/data/items';

type ResumeCardProps = {
  profil: Profile;
  membre: Member;
  catalogue: WarbandCatalog;
  inventaireGroupe: { entree: InventoryEntry; quantite: number }[];
  nomCompetence: (skillId: string) => { nom: string; texte?: string } | undefined;
  onItemClick: (entree: InventoryEntry) => void;
};

export function ResumeCard({ profil, membre, catalogue, inventaireGroupe, nomCompetence, onItemClick }: ResumeCardProps) {
  const { t, language } = useLanguage();
  return (
    <CollapsibleCard title={t('resume.title')} preferenceKey="ui.personnage.resume.ouvert" className="card">
      {profil.type === 'heros' && (
        <>
          <span className="resume-section__title">{t('resume.skills')}</span>
          {membre.competences_acquises.length > 0 ? (
            membre.competences_acquises.map((id) => {
              const s = nomCompetence(id);
              return (
                <p key={id} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                  <strong>{s?.nom ?? id}</strong>
                  {s?.texte && <span className="text-muted"> — {s.texte}</span>}
                </p>
              );
            })
          ) : (
            <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem', fontStyle: 'italic' }}>
              {t('resume.none')}
            </p>
          )}
        </>
      )}

      <span className="resume-section__title">{t('resume.equipment')}</span>
      {inventaireGroupe.length > 0 ? (
        inventaireGroupe.map(({ entree, quantite }) => {
          const detail = translateItem(resolveItemDetail(entree), language);
          const synopsis = resumeItem(detail);
          return (
            <p key={entree.instance_id} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
              <button className="link-inline" onClick={() => onItemClick(entree)}>
                {detail.nom}
                {quantite > 1 ? ` ×${quantite}` : ''}
              </button>
              {entree.item_id === 'dague' && entree.cout === 0 && (
                <span className="text-muted"> {t('achatEquipement.freeBadge')}</span>
              )}
              {synopsis && (
                <span className="text-muted" style={{ fontStyle: 'italic' }}>
                  {' '}
                  — {synopsis.length > 70 ? `${synopsis.slice(0, 70).trimEnd()}…` : synopsis}
                </span>
              )}
            </p>
          );
        })
      ) : membre.equipement ? (
        <p className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
          {membre.equipement}
        </p>
      ) : (
        <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem', fontStyle: 'italic' }}>
          {t('resume.noneMasc')}
        </p>
      )}

      {estSorcier(catalogue, profil, membre.marque) && (
        <>
          <span className="resume-section__title">{t('resume.magicKnownSpell')}</span>
          {membre.sorts_connus.length > 0 ? (
            membre.sorts_connus.map((id, i) => {
              const sort = resolveSort(catalogue, id, profil, membre.marque, magieMineure(language));
              return (
                <p key={i} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                  <strong>{sort ? sort.nom : id}</strong>
                  {sort && <span className="text-muted"> — {sort.texte}</span>}
                </p>
              );
            })
          ) : (
            <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem', fontStyle: 'italic' }}>
              {t('resume.noneMasc')}
            </p>
          )}
        </>
      )}

      <span className="resume-section__title">{t('resume.specialRules')}</span>
      {membre.regles_speciales_notes.length > 0 ? (
        membre.regles_speciales_notes.map((s, i) => (
          <p key={i} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
            {s}
          </p>
        ))
      ) : (
        <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem', fontStyle: 'italic' }}>
          {t('resume.none')}
        </p>
      )}

      {profil.type === 'heros' && (!estFrancTireur(membre) || estDramatisPersonae(membre)) && (
        <>
          <span className="resume-section__title">{t('resume.seriousInjuries')}</span>
          {membre.blessures_graves.length > 0 ? (
            membre.blessures_graves.map((b) => (
              <p key={b.id} className="text-sm mb-0" style={{ marginTop: '0.3rem' }}>
                {b.date} — {injuryLabelAffiche(b, language)}
              </p>
            ))
          ) : (
            <p className="text-sm text-muted mb-0" style={{ marginTop: '0.3rem', fontStyle: 'italic' }}>
              {t('resume.none')}
            </p>
          )}
        </>
      )}
    </CollapsibleCard>
  );
}

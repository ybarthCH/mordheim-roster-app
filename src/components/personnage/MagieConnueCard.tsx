import { useState } from 'react';
import { Icon } from '../common/Icon';
import { CollapsibleCard } from '../common/CollapsibleCard';
import {
  magieDuProfil,
  resolveSort,
  sortsDisponiblesPourRoster,
  sortsMagieMineureDisponibles,
} from '../../utils/magie';
import { magieMineure } from '../../i18n/data/minorMagic';
import type { Member, RosterInstance } from '../../types/roster';
import type { Profile, WarbandCatalog } from '../../types/catalog';
import { useLanguage } from '../../state/useLanguage';

type MagieConnueCardProps = {
  membre: Member;
  profil: Profile;
  catalogue: WarbandCatalog;
  roster: RosterInstance;
  onMajMembre: (partial: Partial<Member>) => void;
  grimoireDisponible: boolean;
  onUtiliserGrimoire: (idSort: string) => void;
};

// Sorts effectivement appris par ce sorcier — le premier est choisi
// obligatoirement au recrutement, les suivants via une avancée "nouvelle
// compétence" (voir AvanceeModal). Un ajout manuel reste possible ici, pour
// corriger un oubli sans repasser par une avancée.
export function MagieConnueCard({
  membre,
  profil,
  catalogue,
  roster,
  onMajMembre,
  grimoireDisponible,
  onUtiliserGrimoire,
}: MagieConnueCardProps) {
  const { t, language } = useLanguage();
  const [sortAAjouter, setSortAAjouter] = useState('');
  const [grimoireOuvert, setGrimoireOuvert] = useState(false);
  const [sourceGrimoire, setSourceGrimoire] = useState<'propre' | 'mineure'>('propre');
  const [sortGrimoire, setSortGrimoire] = useState('');
  const magieMineureAffichee = magieMineure(language);
  const magiePropre = magieDuProfil(catalogue, profil, membre.marque, magieMineureAffichee);
  const disponibles = sortsDisponiblesPourRoster(
    catalogue,
    roster,
    membre.sorts_connus,
    profil,
    membre.marque,
    magieMineureAffichee
  );
  const magieMineureEstPropre = profil.categorie_magie === 'magie_mineure';
  const sortsGrimoire =
    sourceGrimoire === 'propre' ? disponibles : sortsMagieMineureDisponibles(membre.sorts_connus, magieMineureAffichee);

  const utiliserGrimoire = () => {
    if (!sortGrimoire) return;
    onUtiliserGrimoire(sortGrimoire);
    setSortGrimoire('');
    setGrimoireOuvert(false);
  };

  return (
    <CollapsibleCard
      preferenceKey="ui.personnage.magie_connue.ouvert"
      title={
        <>
          <Icon name="flamme" style={{ marginRight: '0.35em' }} />
          {t('magieConnue.title')}
        </>
      }
    >
      {membre.sorts_connus.length > 0 ? (
        membre.sorts_connus.map((id, i) => {
          const sort = resolveSort(catalogue, id, profil, membre.marque, magieMineureAffichee);
          return (
            <p key={i} className="text-sm mb-0" style={{ marginTop: i > 0 ? '0.4rem' : 0 }}>
              <strong>{sort ? `${sort.resultat} — ${sort.nom}` : id}</strong>
              {sort && <span className="text-muted"> ({t('magieConnue.diffAbbrev')} {sort.difficulte}) : {sort.texte}</span>}
              <button
                className="btn--ghost"
                style={{ border: 'none', background: 'none', marginLeft: '0.4rem', padding: 0, color: 'var(--danger)' }}
                onClick={() => onMajMembre({ sorts_connus: membre.sorts_connus.filter((_, j) => j !== i) })}
                title={t('magieConnue.removeSpellTitle')}
              >
                ✕
              </button>
            </p>
          );
        })
      ) : (
        <p className="text-sm text-muted mb-0">{t('magieConnue.none')}</p>
      )}
      {disponibles.length > 0 && (
        <div className="flex gap-sm" style={{ marginTop: '0.7rem' }}>
          <select value={sortAAjouter} onChange={(e) => setSortAAjouter(e.target.value)} style={{ flex: 1 }}>
            <option value="">{t('magieConnue.addSpellPlaceholder')}</option>
            {disponibles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.resultat} — {s.nom}
              </option>
            ))}
          </select>
          <button
            className="btn"
            disabled={!sortAAjouter}
            onClick={() => {
              if (!sortAAjouter) return;
              onMajMembre({ sorts_connus: [...membre.sorts_connus, sortAAjouter] });
              setSortAAjouter('');
            }}
          >
            {t('magieConnue.add')}
          </button>
        </div>
      )}
      {grimoireDisponible && (
        <div style={{ marginTop: '0.8rem', paddingTop: '0.7rem', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn--sm" onClick={() => setGrimoireOuvert((ouvert) => !ouvert)}>
            {grimoireOuvert ? t('magieConnue.cancel') : t('magieConnue.useGrimoire')}
          </button>
          {grimoireOuvert && (
            <div style={{ marginTop: '0.6rem' }}>
              <p className="text-sm text-muted">{t('magieConnue.grimoireBody')}</p>
              {!magieMineureEstPropre && (
                <div className="field">
                  <label>{t('magieConnue.spellListLabel')}</label>
                  <select
                    value={sourceGrimoire}
                    onChange={(e) => {
                      setSourceGrimoire(e.target.value as 'propre' | 'mineure');
                      setSortGrimoire('');
                    }}
                  >
                    <option value="propre">{magiePropre?.nom ?? t('magieConnue.ownListFallback')}</option>
                    <option value="mineure">{t('magieConnue.pettyMagic')}</option>
                  </select>
                </div>
              )}
              <div className="field">
                <label>{t('magieConnue.newSpellLabel')}</label>
                <select value={sortGrimoire} onChange={(e) => setSortGrimoire(e.target.value)}>
                  <option value="">{t('magieConnue.choose')}</option>
                  {sortsGrimoire.map((sort) => (
                    <option key={sort.id} value={sort.id}>
                      {sort.resultat} — {sort.nom} ({t('magieConnue.diffAbbrev')} {sort.difficulte})
                    </option>
                  ))}
                </select>
                {sortsGrimoire.length === 0 && (
                  <p className="text-sm text-muted mb-0">{t('magieConnue.allKnown')}</p>
                )}
              </div>
              <button className="btn btn--primary" disabled={!sortGrimoire} onClick={utiliserGrimoire}>
                {t('magieConnue.consumeGrimoire')}
              </button>
            </div>
          )}
        </div>
      )}
    </CollapsibleCard>
  );
}

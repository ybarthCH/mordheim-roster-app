import { Screen } from '../common/Screen';
import { useLanguage } from '../../state/useLanguage';
import { CHANGELOG } from '../../data/changelog';
import { translateChangelog } from '../../i18n/data/changelog';

// new Date('AAAA-MM-JJ') parse en UTC minuit : dans un fuseau à décalage
// négatif, toLocaleDateString peut alors afficher la veille. Construction
// en champs locaux pour éviter ce décalage d'un jour.
function formatDate(iso: string, locale: string): string {
  const [annee, mois, jour] = iso.split('-').map(Number);
  return new Date(annee, mois - 1, jour).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function ChangelogScreen() {
  const { t, language } = useLanguage();
  const entries = translateChangelog(CHANGELOG, language);
  const locale = language === 'en' ? 'en-GB' : 'fr-FR';

  return (
    <Screen title={t('changelog.title')} back>
      <p className="text-sm text-muted" style={{ marginTop: 0 }}>
        {t('changelog.intro')}
      </p>

      {entries.map((entree) => (
        <div className="card" key={entree.date}>
          <h3 className="mt-0">{formatDate(entree.date, locale)}</h3>
          <ul style={{ marginBottom: 0 }}>
            {entree.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </Screen>
  );
}
